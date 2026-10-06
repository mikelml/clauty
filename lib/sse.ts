/**
 * SSE — platform-aware EventSource.
 *
 * Web: uses the browser's native EventSource (works perfectly with CORS).
 * React Native (iOS/Android): uses react-native-sse polyfill (RN has no native EventSource).
 */
import { Platform } from 'react-native';

let Impl: typeof EventSource;

if (Platform.OS === 'web' && typeof globalThis.EventSource !== 'undefined') {
  // Browser has native EventSource — use it directly
  Impl = globalThis.EventSource;
} else {
  // React Native — use polyfill
  // @ts-ignore — dynamic import for RN only
  Impl = require('react-native-sse').default;
}

export default Impl;
