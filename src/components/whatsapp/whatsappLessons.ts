export interface LessonStep {
  id: string;
  caption: string;
  targetId: string;
  action: 'wait' | 'tap' | 'type' | 'point';
  textToType?: string;
  guideText: string;
  screen: 'HOME' | 'NEW_CONTACT' | 'SEARCH' | 'CHAT' | 'SHARING_MENU' | 'PHOTO_PICKER' | 'LOCATION' | 'CALL';
  waitMs?: number;
}

export interface WhatsAppLesson {
  id: number;
  title: string;
  shortTitle: string;
  successMessage: string;
  steps: LessonStep[];
}

export const WHATSAPP_LESSONS: WhatsAppLesson[] = [
  // LESSON 1: Save a new contact
  {
    id: 1,
    title: '1. Save a new contact',
    shortTitle: 'Save contact',
    successMessage: 'Great job! You saved a contact.',
    steps: [
      {
        id: 'l1_s1_intro',
        caption: 'This is the WhatsApp home page.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'HOME',
        waitMs: 3000,
      },
      {
        id: 'l1_s2_intro2',
        caption: 'Now we are going to learn how to save a contact.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'HOME',
        waitMs: 1800,
      },
      {
        id: 'l1_s3_tap_new_contact',
        caption: 'Tap the New Contact button.',
        targetId: 'new-contact-fab',
        action: 'tap',
        guideText: 'Tap here',
        screen: 'HOME',
      },
      {
        id: 'l1_s4_type_name',
        caption: 'Type the name of the contact.',
        targetId: 'contact-name-input',
        action: 'type',
        textToType: 'Ravi Kumar',
        guideText: 'Type the name here',
        screen: 'NEW_CONTACT',
      },
      {
        id: 'l1_s5_type_phone',
        caption: 'Type the phone number.',
        targetId: 'contact-phone-input',
        action: 'type',
        textToType: '9876543210',
        guideText: 'Type the number here',
        screen: 'NEW_CONTACT',
      },
      {
        id: 'l1_s6_tap_save',
        caption: 'Now tap Save to save the contact.',
        targetId: 'save-contact-btn',
        action: 'tap',
        guideText: 'Now tap Save',
        screen: 'NEW_CONTACT',
      },
      {
        id: 'l1_s7_show_saved',
        caption: 'The contact is saved and appears in your chat list.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'HOME',
        waitMs: 2500,
      },
    ],
  },

  // LESSON 2: Search for a person and send a message
  {
    id: 2,
    title: '2. Search for a person and send a message',
    shortTitle: 'Search & message',
    successMessage: 'Great job! You searched for a person and sent a message.',
    steps: [
      {
        id: 'l2_s1_intro',
        caption: 'This is the WhatsApp home page. Now we will search for a person and send a message.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'HOME',
        waitMs: 2500,
      },
      {
        id: 'l2_s2_tap_search',
        caption: 'Tap the search icon at the top.',
        targetId: 'search-icon-btn',
        action: 'tap',
        guideText: 'Tap search icon',
        screen: 'HOME',
      },
      {
        id: 'l2_s3_type_search',
        caption: 'Type the name of the person you want to find.',
        targetId: 'search-input-field',
        action: 'type',
        textToType: 'Amma',
        guideText: 'Type name here',
        screen: 'SEARCH',
      },
      {
        id: 'l2_s4_tap_contact',
        caption: 'Tap Amma from the results to open the conversation.',
        targetId: 'search-result-amma',
        action: 'tap',
        guideText: 'Tap Amma',
        screen: 'SEARCH',
      },
      {
        id: 'l2_s5_tap_input',
        caption: 'Tap the message box to start typing.',
        targetId: 'chat-input-box',
        action: 'tap',
        guideText: 'Tap message box',
        screen: 'CHAT',
      },
      {
        id: 'l2_s6_type_message',
        caption: 'Type your message on the keyboard.',
        targetId: 'chat-input-field',
        action: 'type',
        textToType: 'Hello Amma',
        guideText: 'Type message here',
        screen: 'CHAT',
      },
      {
        id: 'l2_s7_tap_send',
        caption: 'Now tap the green Send button.',
        targetId: 'send-message-btn',
        action: 'tap',
        guideText: 'Tap Send',
        screen: 'CHAT',
      },
      {
        id: 'l2_s8_wait_reply',
        caption: 'Your message is sent and appears with checkmarks.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'CHAT',
        waitMs: 2200,
      },
    ],
  },

  // LESSON 3: Send a photo
  {
    id: 3,
    title: '3. Send a photo',
    shortTitle: 'Send photo',
    successMessage: 'Great job! You learned how to send a photo.',
    steps: [
      {
        id: 'l3_s1_intro',
        caption: 'This is your chat with Amma. Now we will learn how to send a photo.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'CHAT',
        waitMs: 2500,
      },
      {
        id: 'l3_s2_tap_paperclip',
        caption: 'Tap the paperclip icon in the message bar.',
        targetId: 'paperclip-attach-btn',
        action: 'tap',
        guideText: 'Tap paperclip',
        screen: 'CHAT',
      },
      {
        id: 'l3_s3_tap_photo',
        caption: 'Tap Photo to choose an image from your gallery.',
        targetId: 'share-menu-photo',
        action: 'tap',
        guideText: 'Tap Photo',
        screen: 'SHARING_MENU',
      },
      {
        id: 'l3_s4_select_sample',
        caption: 'Select the sample photo you want to send.',
        targetId: 'sample-photo-1',
        action: 'tap',
        guideText: 'Select sample photo',
        screen: 'PHOTO_PICKER',
      },
      {
        id: 'l3_s5_tap_send_photo',
        caption: 'Now tap Send to share the photo.',
        targetId: 'send-photo-btn',
        action: 'tap',
        guideText: 'Tap Send',
        screen: 'PHOTO_PICKER',
      },
      {
        id: 'l3_s6_photo_in_chat',
        caption: 'The photo is sent and appears right inside the chat.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'CHAT',
        waitMs: 2200,
      },
    ],
  },

  // LESSON 4: Send a location
  {
    id: 4,
    title: '4. Send a location',
    shortTitle: 'Send location',
    successMessage: 'Great job! You learned how to share your location.',
    steps: [
      {
        id: 'l4_s1_intro',
        caption: 'This is your chat with Amma. Now we will learn how to share your location safely.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'CHAT',
        waitMs: 2500,
      },
      {
        id: 'l4_s2_tap_paperclip',
        caption: 'Tap the paperclip icon to open sharing options.',
        targetId: 'paperclip-attach-btn',
        action: 'tap',
        guideText: 'Tap paperclip',
        screen: 'CHAT',
      },
      {
        id: 'l4_s3_tap_location',
        caption: 'Tap Location to open the map options.',
        targetId: 'share-menu-location',
        action: 'tap',
        guideText: 'Tap Location',
        screen: 'SHARING_MENU',
      },
      {
        id: 'l4_s4_tap_send_loc',
        caption: "Tap 'Send this location' to share where you are.",
        targetId: 'send-current-location-btn',
        action: 'tap',
        guideText: 'Tap Send this location',
        screen: 'LOCATION',
      },
      {
        id: 'l4_s5_loc_in_chat',
        caption: 'The location card with the map is now shared in the chat.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'CHAT',
        waitMs: 2200,
      },
    ],
  },

  // LESSON 5: Calls (voice call and video call)
  {
    id: 5,
    title: '5. Calls (voice call and video call)',
    shortTitle: 'Calls',
    successMessage: 'Great job! You mastered WhatsApp voice and video calls.',
    steps: [
      {
        id: 'l5_s1_intro',
        caption: 'This is your chat with Amma. Now we will learn how to make voice and video calls.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'CHAT',
        waitMs: 2500,
      },
      {
        id: 'l5_s2_tap_voice_call',
        caption: 'Tap the phone call icon at the top to start an audio call.',
        targetId: 'header-voice-call-btn',
        action: 'tap',
        guideText: 'Tap call icon',
        screen: 'CHAT',
      },
      {
        id: 'l5_s3_check_video_icon',
        caption: 'On the call page, you can see controls like Speaker, Mute, and Video.',
        targetId: 'call-video-control',
        action: 'point',
        guideText: 'Video call toggle',
        screen: 'CALL',
        waitMs: 2200,
      },
      {
        id: 'l5_s4_tap_end_call',
        caption: 'Tap the red button to end the call cleanly.',
        targetId: 'end-call-btn',
        action: 'tap',
        guideText: 'Tap red End call',
        screen: 'CALL',
      },
      {
        id: 'l5_s5_back_to_home',
        caption: 'Tap Back to return to the home screen.',
        targetId: 'chat-back-arrow',
        action: 'tap',
        guideText: 'Tap Back',
        screen: 'CHAT',
      },
      {
        id: 'l5_s6_tap_calls_tab',
        caption: 'Tap the Calls tab at the bottom to view your call history.',
        targetId: 'bottom-tab-calls',
        action: 'tap',
        guideText: 'Tap Calls tab',
        screen: 'HOME',
      },
      {
        id: 'l5_s7_calls_overview',
        caption: 'Here you can see all your recent voice and video calls.',
        targetId: '',
        action: 'wait',
        guideText: '',
        screen: 'HOME',
        waitMs: 2200,
      },
    ],
  },
];
