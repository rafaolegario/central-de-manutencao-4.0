import { useApiQuery } from '@/services/api/useApiQuery';
import type { OnboardingStatus } from '@/types/api';
import { getOnboardingStatusApi } from './onboardingService';

export function useOnboardingStatus(enabled: boolean = true) {
  return useApiQuery<OnboardingStatus | null>(
    () => (enabled ? getOnboardingStatusApi() : Promise.resolve(null)),
    [enabled],
  );
}

export function pickFirstIncompleteStep(
  status: OnboardingStatus,
): 'add-tool' | 'add-stock' | 'invite-technician' | 'completed' {
  if (!status.hasTools) return 'add-tool';
  if (!status.hasStockItems) return 'add-stock';
  if (!status.hasTechnicians) return 'invite-technician';
  return 'completed';
}
