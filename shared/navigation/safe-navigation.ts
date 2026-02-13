import { Router, Href } from 'expo-router';

export const safeGoBack = (router: Router, fallbackPath: Href): void => {
  if (typeof router.canGoBack === 'function') {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackPath);
    }
  } else {
    try {
      router.back();
    } catch {
      router.replace(fallbackPath);
    }
  }
};
