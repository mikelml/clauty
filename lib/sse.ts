/**
 * SSE polyfill for React Native.
 *
 * React Native does NOT have a native EventSource implementation.
 * This module re-exports EventSource from react-native-sse so all hooks
 * import from here instead of relying on the global.
 */
import RNEventSource from 'react-native-sse';

export default RNEventSource;
