// Android emulator: use http://10.0.2.2:8080 instead of localhost
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';
