import { useLocalSearchParams } from 'expo-router';

export default function PinScreen() {
  const { mode } = useLocalSearchParams<{ mode?: 'create' | 'enter' }>();
  const pinMode = mode || 'enter';

  if (pinMode === 'create') {
    return null;
  }

  return null;
}
