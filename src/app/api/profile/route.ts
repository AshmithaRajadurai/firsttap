import { NextRequest, NextResponse } from 'next/server';
import { LearnerProfile, PrimaryCategory, StartingLearningPath } from '@/types';

// In-memory persistent store for learner profiles
let currentProfile: LearnerProfile | null = null;

const VALID_CATEGORIES: PrimaryCategory[] = [
  'DIGITAL_BEGINNER',
  'EVERYDAY_DIGITAL_LEARNER',
  'DIGITAL_PAYMENT_LEARNER',
  'MSME_LEARNER',
];

const VALID_PATHS: StartingLearningPath[] = [
  'SMARTPHONE_BASICS',
  'INTERNET_COMMUNICATION_BASICS',
  'EVERYDAY_DIGITAL_SERVICES',
  'DIGITAL_PAYMENTS_BASICS',
  'PAYMENT_VERIFICATION_AND_SAFETY',
  'DIGITAL_BUSINESS_BASICS',
  'DIGITAL_BOOKKEEPING_AND_BUSINESS_TOOLS',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile = (body.profile || body) as Partial<LearnerProfile>;

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'No profile data provided' },
        { status: 400 }
      );
    }

    if (!profile.name || typeof profile.name !== 'string' || profile.name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Learner name is required' },
        { status: 400 }
      );
    }

    if (!profile.preferred_language || !['ta-IN', 'en-IN', 'hi-IN'].includes(profile.preferred_language)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing preferred_language' },
        { status: 400 }
      );
    }

    if (typeof profile.phone_independent !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'phone_independent boolean is required' },
        { status: 400 }
      );
    }

    if (!profile.primary_category || !VALID_CATEGORIES.includes(profile.primary_category)) {
      return NextResponse.json(
        { success: false, error: `Invalid primary_category: ${profile.primary_category}` },
        { status: 400 }
      );
    }

    if (!profile.starting_learning_path || !VALID_PATHS.includes(profile.starting_learning_path)) {
      return NextResponse.json(
        { success: false, error: `Invalid starting_learning_path: ${profile.starting_learning_path}` },
        { status: 400 }
      );
    }

    const structuredProfile: LearnerProfile = {
      name: profile.name.trim(),
      preferred_language: profile.preferred_language,
      phone_independent: profile.phone_independent,
      learning_goal: profile.learning_goal || null,
      primary_category: profile.primary_category,
      starting_learning_path: profile.starting_learning_path,
      assessment_status: profile.assessment_status || 'COMPLETED',
      assessment_completed_at: profile.assessment_completed_at || new Date().toISOString(),
      completion_reason: profile.completion_reason || (profile.phone_independent ? 'BRANCH_ASSESSMENT_COMPLETED' : 'FOUNDATION_PATH'),
      whatsapp_progress: profile.whatsapp_progress,
      spam_progress: profile.spam_progress,
      business_progress: profile.business_progress,
      phone_settings_progress: profile.phone_settings_progress,
    };

    currentProfile = structuredProfile;

    console.log('[API:Profile] Saved learner profile:', JSON.stringify(structuredProfile));

    return NextResponse.json({
      success: true,
      profile: structuredProfile,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save profile';
    console.error('[API:Profile] Error:', msg);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    profile: currentProfile,
  });
}
