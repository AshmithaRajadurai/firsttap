import {
  FSMState,
  Lesson,
  LiteracyLevel,
  SessionData,
  SupportedLanguage,
  PrimaryCategory,
  LearningGoal,
  StartingLearningPath,
  LearnerProfile,
  MascotMood,
} from '@/types';
import {
  APP_PROMPTS,
  CATEGORIES_META,
  LEARNING_PATHS_META,
  LESSONS,
} from '../lessons/catalog';
import {
  extractNameIntent,
  matchCommandIntent,
  matchLanguageIntent,
  matchLearningGoalIntent,
  matchYesNoIntent,
  validateAnswerForQuestion,
} from './intents';
import { logger } from '../logger';

export interface FSMTransitionResult {
  nextState: FSMState;
  updatedSession: SessionData;
  speechToSpeak: string;
  expectedInputType: 'language' | 'name' | 'yes_no' | 'goal' | 'lesson_command' | 'none';
  action?: 'CELEBRATE' | 'PLAY_SOUND';
  speechSequence?: { text: string; language: SupportedLanguage }[];
  suggestedMood?: MascotMood;
}

export class FirstTapFSM {
  private state: FSMState;
  private session: SessionData;

  constructor(initialState: FSMState = 'APP_START', initialSession?: Partial<SessionData>) {
    this.state = initialState;
    this.session = {
      language: 'ta-IN',
      userName: '',
      phoneIndependent: null,
      learningGoal: null,
      branchAnswer: null,
      primaryCategory: null,
      startingPath: null,
      learnerProfile: null,
      isSavingProfile: false,
      profileSaveError: null,
      consecutiveRetries: 0,
      lastRecognizedText: '',
      lastSpokenText: '',
      captionsEnabled: true,
      isApiMode: false,
      hasPhone: null,
      placementCurrentIndex: 0,
      placementAnswers: {},
      assessedLevel: null,
      currentLessonId: 'lesson_basics',
      currentStepIndex: 0,
      previousStateBeforeDoubt: null,
      ...initialSession,
    };
  }

  public getState(): FSMState {
    return this.state;
  }

  public setState(newState: FSMState): void {
    this.state = newState;
  }

  public getSession(): SessionData {
    return { ...this.session };
  }

  public setSession(updates: Partial<SessionData>): void {
    this.session = { ...this.session, ...updates };
  }

  public getCurrentLesson(): Lesson {
    const found = LESSONS.find((l) => l.id === this.session.currentLessonId);
    return found || LESSONS[0];
  }

  /**
   * 1. APP OPENS: Mascot greets the user
   */
  public startApp(language?: SupportedLanguage): FSMTransitionResult {
    this.state = 'GREETING';
    this.session.consecutiveRetries = 0;
    if (language) {
      this.session.language = language;
    }
    this.session.userName = '';
    this.session.phoneIndependent = null;
    this.session.learningGoal = null;
    this.session.branchAnswer = null;
    this.session.primaryCategory = null;
    this.session.startingPath = null;
    this.session.learnerProfile = null;

    const speech = APP_PROMPTS.welcome[this.session.language];
    this.session.lastSpokenText = speech;

    return {
      nextState: 'GREETING',
      updatedSession: this.getSession(),
      speechToSpeak: speech,
      expectedInputType: 'none',
      suggestedMood: 'welcome',
    };
  }

  /**
   * 2. LANGUAGE SELECTION: Mascot speaks options in English, Tamil, and Hindi
   */
  public moveToLanguageSelect(): FSMTransitionResult {
    this.state = 'LANGUAGE_OPTIONS';
    this.session.consecutiveRetries = 0;

    const speech = `${APP_PROMPTS.languageChoiceIntro.fullOffer['en-IN']} ${APP_PROMPTS.languageChoiceIntro.fullOffer['ta-IN']} ${APP_PROMPTS.languageChoiceIntro.fullOffer['hi-IN']}`;
    this.session.lastSpokenText = speech;

    return {
      nextState: 'LANGUAGE_OPTIONS',
      updatedSession: this.getSession(),
      speechToSpeak: speech,
      speechSequence: APP_PROMPTS.languageChoiceIntro.promptSequence,
      expectedInputType: 'language',
      suggestedMood: 'language_selection',
    };
  }

  /**
   * Manual language selection fallback
   */
  public setLanguageManually(lang: SupportedLanguage): FSMTransitionResult {
    this.session.language = lang;
    this.session.consecutiveRetries = 0;
    return this.moveToAskName(false);
  }

  /**
   * 3. NAME COLLECTION: Ask user's name in selected language
   */
  public moveToAskName(includeLanguageGreeting: boolean = false): FSMTransitionResult {
    this.state = 'ASKING_NAME';
    this.session.consecutiveRetries = 0;

    const namePrompt = APP_PROMPTS.askName[this.session.language];
    const confirmPrompt = includeLanguageGreeting ? `${APP_PROMPTS.languageConfirm[this.session.language]} ` : '';
    const speech = `${confirmPrompt}${namePrompt}`;
    this.session.lastSpokenText = speech;

    return {
      nextState: 'ASKING_NAME',
      updatedSession: this.getSession(),
      speechToSpeak: speech,
      expectedInputType: 'name',
      suggestedMood: 'speaking',
    };
  }

  /**
   * 4. QUESTION 1: Phone Independence
   */
  public moveToPhoneIndependence(): FSMTransitionResult {
    this.state = 'ASKING_PHONE_INDEPENDENCE';
    this.session.consecutiveRetries = 0;

    const speech = APP_PROMPTS.phoneIndependence.ask[this.session.language](
      this.session.userName || 'Learner'
    );
    this.session.lastSpokenText = speech;

    return {
      nextState: 'ASKING_PHONE_INDEPENDENCE',
      updatedSession: this.getSession(),
      speechToSpeak: speech,
      expectedInputType: 'yes_no',
      suggestedMood: 'speaking',
    };
  }

  /**
   * Manual Phone Independence selection fallback
   */
  public setPhoneIndependenceManually(isIndependent: boolean): FSMTransitionResult {
    return this.handlePhoneIndependence(isIndependent ? 'yes' : 'no');
  }

  /**
   * 5. QUESTION 2: Main Learning Goal (if phone independent = YES)
   */
  public moveToAskLearningGoal(): FSMTransitionResult {
    this.state = 'ASKING_LEARNING_GOAL';
    this.session.consecutiveRetries = 0;

    const speech = APP_PROMPTS.learningGoal.ask[this.session.language](
      this.session.userName || 'Learner'
    );
    this.session.lastSpokenText = speech;

    return {
      nextState: 'ASKING_LEARNING_GOAL',
      updatedSession: this.getSession(),
      speechToSpeak: speech,
      expectedInputType: 'goal',
      suggestedMood: 'speaking',
    };
  }

  /**
   * Manual Learning Goal selection fallback
   */
  public setLearningGoalManually(goal: LearningGoal): FSMTransitionResult {
    this.session.learningGoal = goal;
    this.session.consecutiveRetries = 0;
    return this.moveToBranchQuestion(goal);
  }

  /**
   * 6. QUESTION 3: Branching question based on user's goal
   */
  public moveToBranchQuestion(goal: LearningGoal): FSMTransitionResult {
    this.state = 'ASKING_BRANCH_QUESTION';
    this.session.consecutiveRetries = 0;

    const speech = APP_PROMPTS.branchQuestions[goal].ask[this.session.language];
    this.session.lastSpokenText = speech;

    return {
      nextState: 'ASKING_BRANCH_QUESTION',
      updatedSession: this.getSession(),
      speechToSpeak: speech,
      expectedInputType: 'yes_no',
      suggestedMood: 'speaking',
    };
  }

  /**
   * Manual Branch Answer selection fallback
   */
  public setBranchAnswerManually(isAffirmative: boolean): FSMTransitionResult {
    return this.handleBranchQuestion(isAffirmative ? 'yes' : 'no');
  }

  /**
   * Main input processor for spoken user text
   */
  public processInput(userInput: string): FSMTransitionResult {
    const text = userInput.trim();
    this.session.lastRecognizedText = text;

    // Check for global commands (Repeat, Help)
    const command = matchCommandIntent(text);
    if (command && command.type === 'REPEAT') {
      return this.handleRepeat();
    }

    // State-specific transition handling
    switch (this.state) {
      case 'GREETING':
      case 'APP_START':
        return this.moveToLanguageSelect();

      case 'LANGUAGE_OPTIONS':
      case 'WAITING_FOR_LANGUAGE':
      case 'LANGUAGE_SELECT':
        return this.handleLanguageSelect(text);

      case 'ASKING_NAME':
      case 'WAITING_FOR_NAME':
      case 'ASK_NAME':
        return this.handleAskName(text);

      case 'ASKING_PHONE_INDEPENDENCE':
      case 'WAITING_FOR_PHONE_ANSWER':
      case 'ASK_PHONE_OWNERSHIP':
        return this.handlePhoneIndependence(text);

      case 'ASKING_LEARNING_GOAL':
      case 'WAITING_FOR_LEARNING_GOAL':
        return this.handleLearningGoal(text);

      case 'ASKING_BRANCH_QUESTION':
      case 'WAITING_FOR_BRANCH_ANSWER':
        return this.handleBranchQuestion(text);

      case 'ASSESSMENT_COMPLETE':
      case 'SESSION_COMPLETE':
        return {
          nextState: 'ASSESSMENT_COMPLETE',
          updatedSession: this.getSession(),
          speechToSpeak: this.session.lastSpokenText,
          expectedInputType: 'none',
          suggestedMood: 'celebrating',
        };

      default:
        return this.handleGenericRetry();
    }
  }

  private handleLanguageSelect(text: string): FSMTransitionResult {
    const matchedLang = matchLanguageIntent(text);

    if (matchedLang) {
      this.session.language = matchedLang;
      this.session.consecutiveRetries = 0;
      return this.moveToAskName(false);
    }

    this.session.consecutiveRetries++;
    const speech = APP_PROMPTS.languageChoiceIntro.promptSequence
      .map((item) => item.text)
      .join(' ');
    this.session.lastSpokenText = speech;

    return {
      nextState: 'WAITING_FOR_LANGUAGE',
      updatedSession: this.getSession(),
      speechToSpeak: speech,
      speechSequence: APP_PROMPTS.languageChoiceIntro.promptSequence,
      expectedInputType: 'language',
      suggestedMood: 'encouraging',
    };
  }

  private handleAskName(text: string): FSMTransitionResult {
    const extractedName = extractNameIntent(text);

    if (extractedName && extractedName.length >= 2) {
      this.session.userName = extractedName;
      this.session.consecutiveRetries = 0;
      return this.moveToPhoneIndependence();
    }

    this.session.consecutiveRetries++;
    const retrySpeech =
      this.session.language === 'en-IN'
        ? 'Sorry, I could not hear your name clearly. What is your name?'
        : this.session.language === 'hi-IN'
        ? 'माफ़ कीजिए, मुझे आपका नाम ठीक से सुनाई नहीं दिया। आपका नाम क्या है?'
        : 'மன்னிக்கவும், உங்கள் பெயர் எனக்குத் தெளிவாகக் கேட்கவில்லை. உங்கள் பெயர் என்ன?';

    this.session.lastSpokenText = retrySpeech;

    return {
      nextState: 'WAITING_FOR_NAME',
      updatedSession: this.getSession(),
      speechToSpeak: retrySpeech,
      expectedInputType: 'name',
      suggestedMood: 'encouraging',
    };
  }

  private handlePhoneIndependence(text: string): FSMTransitionResult {
    const validation = validateAnswerForQuestion('phone_independence', text);
    logger.logValidation('phone_independence', validation.status, { rawText: text });

    if (validation.status === 'VALID_YES_NO') {
      const yesNo = validation.value;
      if (yesNo === 'no') {
        this.session.phoneIndependent = false;
        this.session.hasPhone = false;
        this.session.learningGoal = null;
        this.session.branchAnswer = null;
        this.session.primaryCategory = 'DIGITAL_BEGINNER';
        this.session.startingPath = 'SMARTPHONE_BASICS';
        this.session.consecutiveRetries = 0;

        const profile: LearnerProfile = {
          name: this.session.userName || 'Learner',
          preferred_language: this.session.language,
          phone_independent: false,
          learning_goal: null,
          primary_category: 'DIGITAL_BEGINNER',
          starting_learning_path: 'SMARTPHONE_BASICS',
          assessment_status: 'COMPLETED',
          assessment_completed_at: new Date().toISOString(),
          completion_reason: 'FOUNDATION_PATH',
        };

        this.session.learnerProfile = profile;
        this.state = 'ASSESSMENT_COMPLETE';

        const speech = APP_PROMPTS.beginnerCompletion[this.session.language](
          this.session.userName || 'Learner'
        );
        this.session.lastSpokenText = speech;

        logger.logTransition('WAITING_FOR_PHONE_ANSWER', 'ASSESSMENT_COMPLETE', 'NO -> FOUNDATION_PATH');

        return {
          nextState: 'ASSESSMENT_COMPLETE',
          updatedSession: this.getSession(),
          speechToSpeak: speech,
          expectedInputType: 'none',
          action: 'CELEBRATE',
          suggestedMood: 'happy',
        };
      }

      if (yesNo === 'yes') {
        this.session.phoneIndependent = true;
        this.session.hasPhone = true;
        this.session.consecutiveRetries = 0;
        logger.logTransition('WAITING_FOR_PHONE_ANSWER', 'ASKING_LEARNING_GOAL', 'YES -> ASK_GOAL');
        return this.moveToAskLearningGoal();
      }
    }

    // Unclear or empty answer -> Handle recovery without advancing or misclassifying
    this.session.consecutiveRetries++;

    let retrySpeech = '';
    if (validation.status === 'EMPTY') {
      // Nothing heard / silence
      retrySpeech = APP_PROMPTS.phoneIndependence.retry[this.session.language];
    } else {
      // Spoke something, but answer was not Yes/No (do NOT claim "I couldn't hear you")
      retrySpeech =
        (APP_PROMPTS.phoneIndependence as any).clarifyYesNo?.[this.session.language] ||
        APP_PROMPTS.phoneIndependence.retry[this.session.language];
    }

    this.session.lastSpokenText = retrySpeech;

    return {
      nextState: 'WAITING_FOR_PHONE_ANSWER',
      updatedSession: this.getSession(),
      speechToSpeak: retrySpeech,
      expectedInputType: 'yes_no',
      suggestedMood: 'retry',
    };
  }

  private handleLearningGoal(text: string): FSMTransitionResult {
    const validation = validateAnswerForQuestion('learning_goal', text);
    logger.logValidation('learning_goal', validation.status, { rawText: text });

    if (validation.status === 'VALID_GOAL') {
      const goal = validation.value;
      this.session.learningGoal = goal;
      this.session.consecutiveRetries = 0;
      logger.logTransition('WAITING_FOR_LEARNING_GOAL', 'ASKING_BRANCH_QUESTION', goal);
      return this.moveToBranchQuestion(goal);
    }

    this.session.consecutiveRetries++;

    let retrySpeech = '';
    if (validation.status === 'YES_NO_WHEN_GOAL_EXPECTED') {
      // Requirement 6: If transcript is 'Yes' but question expects a goal:
      // Respond: "Please choose one: everyday phone and internet use, digital payments, or small business."
      retrySpeech =
        (APP_PROMPTS.learningGoal as any).chooseFromThree?.[this.session.language] ||
        APP_PROMPTS.learningGoal.retry[this.session.language];
    } else {
      // Ambiguous answer -> Repeat the three options. Do not guess a category.
      retrySpeech = APP_PROMPTS.learningGoal.retry[this.session.language];
    }

    this.session.lastSpokenText = retrySpeech;

    return {
      nextState: 'WAITING_FOR_LEARNING_GOAL',
      updatedSession: this.getSession(),
      speechToSpeak: retrySpeech,
      expectedInputType: 'goal',
      suggestedMood: 'retry',
    };
  }

  private handleBranchQuestion(text: string): FSMTransitionResult {
    const validation = validateAnswerForQuestion('branch_question', text);
    logger.logValidation('branch_question', validation.status, { rawText: text });

    const goal = this.session.learningGoal || 'EVERYDAY_DIGITAL_SKILLS';

    if (validation.status === 'VALID_YES_NO') {
      const isAffirmative = validation.value === 'yes';
      this.session.branchAnswer = isAffirmative;
      this.session.consecutiveRetries = 0;

      let primaryCategory: PrimaryCategory = 'EVERYDAY_DIGITAL_LEARNER';
      let startingPath: StartingLearningPath = 'EVERYDAY_DIGITAL_SERVICES';

      if (goal === 'EVERYDAY_DIGITAL_SKILLS') {
        primaryCategory = 'EVERYDAY_DIGITAL_LEARNER';
        startingPath = isAffirmative
          ? 'EVERYDAY_DIGITAL_SERVICES'
          : 'INTERNET_COMMUNICATION_BASICS';
      } else if (goal === 'DIGITAL_PAYMENTS') {
        primaryCategory = 'DIGITAL_PAYMENT_LEARNER';
        startingPath = isAffirmative
          ? 'PAYMENT_VERIFICATION_AND_SAFETY'
          : 'DIGITAL_PAYMENTS_BASICS';
      } else if (goal === 'MSME_BUSINESS_SKILLS') {
        primaryCategory = 'MSME_LEARNER';
        startingPath = isAffirmative
          ? 'DIGITAL_BOOKKEEPING_AND_BUSINESS_TOOLS'
          : 'DIGITAL_BUSINESS_BASICS';
      }

      this.session.primaryCategory = primaryCategory;
      this.session.startingPath = startingPath;

      const profile: LearnerProfile = {
        name: this.session.userName || 'Learner',
        preferred_language: this.session.language,
        phone_independent: true,
        learning_goal: goal,
        primary_category: primaryCategory,
        starting_learning_path: startingPath,
        assessment_status: 'COMPLETED',
        assessment_completed_at: new Date().toISOString(),
        completion_reason: 'BRANCH_ASSESSMENT_COMPLETED',
      };

      this.session.learnerProfile = profile;
      this.state = 'ASSESSMENT_COMPLETE';

      const pathTitle =
        LEARNING_PATHS_META[startingPath].title[this.session.language];
      const speech = APP_PROMPTS.assessmentCompletion[this.session.language](
        this.session.userName || 'Learner',
        pathTitle
      );
      this.session.lastSpokenText = speech;

      logger.logTransition(
        'WAITING_FOR_BRANCH_ANSWER',
        'ASSESSMENT_COMPLETE',
        `${goal} -> ${startingPath}`
      );

      return {
        nextState: 'ASSESSMENT_COMPLETE',
        updatedSession: this.getSession(),
        speechToSpeak: speech,
        expectedInputType: 'none',
        action: 'CELEBRATE',
        suggestedMood: 'celebrating',
      };
    }

    // Unclear answer -> Ask for clarification instead of assigning random path
    this.session.consecutiveRetries++;

    let retrySpeech = '';
    if (validation.status === 'EMPTY') {
      retrySpeech = APP_PROMPTS.branchQuestions[goal].retry[this.session.language];
    } else {
      retrySpeech =
        (APP_PROMPTS.branchQuestions[goal] as any).clarifyYesNo?.[this.session.language] ||
        APP_PROMPTS.branchQuestions[goal].retry[this.session.language];
    }

    this.session.lastSpokenText = retrySpeech;

    return {
      nextState: 'WAITING_FOR_BRANCH_ANSWER',
      updatedSession: this.getSession(),
      speechToSpeak: retrySpeech,
      expectedInputType: 'yes_no',
      suggestedMood: 'retry',
    };
  }

  private handleRepeat(): FSMTransitionResult {
    const speech = this.session.lastSpokenText || APP_PROMPTS.welcome[this.session.language];
    let expected: FSMTransitionResult['expectedInputType'] = 'none';

    if (this.state === 'LANGUAGE_OPTIONS' || this.state === 'WAITING_FOR_LANGUAGE') {
      expected = 'language';
    } else if (this.state === 'ASKING_NAME' || this.state === 'WAITING_FOR_NAME') {
      expected = 'name';
    } else if (
      this.state === 'ASKING_PHONE_INDEPENDENCE' ||
      this.state === 'WAITING_FOR_PHONE_ANSWER' ||
      this.state === 'ASKING_BRANCH_QUESTION' ||
      this.state === 'WAITING_FOR_BRANCH_ANSWER'
    ) {
      expected = 'yes_no';
    } else if (
      this.state === 'ASKING_LEARNING_GOAL' ||
      this.state === 'WAITING_FOR_LEARNING_GOAL'
    ) {
      expected = 'goal';
    }

    return {
      nextState: this.state,
      updatedSession: this.getSession(),
      speechToSpeak: speech,
      expectedInputType: expected,
      suggestedMood: 'speaking',
    };
  }

  private handleGenericRetry(): FSMTransitionResult {
    this.session.consecutiveRetries++;
    const speech = APP_PROMPTS.retryPrompts.unclear[this.session.language];
    return {
      nextState: this.state,
      updatedSession: this.getSession(),
      speechToSpeak: speech,
      expectedInputType: 'none',
      suggestedMood: 'encouraging',
    };
  }
}
