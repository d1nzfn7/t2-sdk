/**
 * Local Development Environment Configuration
 * Following the SDK pattern: https://fn7.io/.fn7-sdk/frontend/latest/docs
 *
 * This file is for local development. For Create React App, you can also use
 * .env files with REACT_APP_ prefix, but this pattern allows for better
 * build-time configuration selection.
 *
 * Local Mode: Set apiBaseUrl to undefined to enable local mode.
 * In local mode, the SDK automatically uses hardcoded defaults for
 * user_context and app_context - no manual setup needed!
 */

export const environment = {
  firebase: {
    apiKey: "AIzaSyDoCwHuDbpOLO7AmHA7ACrfKDYWZfnKLXA",
    authDomain: "testing-cdd44.firebaseapp.com",
    projectId: "testing-cdd44",
    storageBucket: "testing-cdd44.firebasestorage.app",
    messagingSenderId: "1096498398002",
    appId: "1:1096498398002:web:6de27d13d2cb4c8dac8d2b",
    measurementId: "G-MM967YWQE4"
  },
  // Set to undefined for local mode (no backend calls, automatic defaults)
  // Set to 'https://atlas.dev2.app.fn7.io' for dev environment
  // Set to 'https://api.prod.fn7.io' for production
  apiBaseUrl: undefined, // Local mode enabled
};

