import AsyncStorage from '@react-native-async-storage/async-storage';

const DISMISSED_KEY = '@onboarding_dismissed';

export async function getOnboardingDismissed(): Promise<boolean> {
  const value = await AsyncStorage.getItem(DISMISSED_KEY);
  return value === 'true';
}

export async function setOnboardingDismissed(): Promise<void> {
  await AsyncStorage.setItem(DISMISSED_KEY, 'true');
}

export async function clearOnboardingDismissed(): Promise<void> {
  await AsyncStorage.removeItem(DISMISSED_KEY);
}
