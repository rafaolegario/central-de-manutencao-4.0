import { apiFetch } from '@/services/api/client';
import type { OnboardingStatus } from '@/types/api';

export function getOnboardingStatusApi(): Promise<OnboardingStatus> {
  return apiFetch<OnboardingStatus>('/api/Onboarding/status');
}
