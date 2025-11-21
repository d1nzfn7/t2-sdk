import { useState, useEffect } from 'react';
import './App.css';
import SetupSection from './components/SetupSection';
import ContextDisplay from './components/ContextDisplay';
import FirebaseOperations from './components/FirebaseOperations';
import ResultsDisplay from './components/ResultsDisplay';
import BackendTesting from './components/BackendTesting';
import { environment } from './config/environment';

function App() {
  const [sdk, setSdk] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState(null);
  const [results, setResults] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize SDK dynamically from CDN
  useEffect(() => {
    const initSDK = async () => {
      try {
        setSdkError(null);
        // Use www.fn7.io directly to avoid 301 redirect CORS issues
        const SDK = await import(/* webpackIgnore: true */ 'https://www.fn7.io/.fn7-sdk/frontend/latest/sdk.esm.js');
        // Initialize SDK with Firebase config from environment
        const sdkInstance = new SDK.default(environment.apiBaseUrl, environment.firebase);
        setSdk(sdkInstance);
        setSdkReady(true);
      } catch (error) {
        console.error('Failed to load SDK:', error);
        setSdkError(
          error.message || 'Failed to load SDK from https://www.fn7.io/.fn7-sdk/frontend/latest/sdk.esm.js. ' +
          'Please check your internet connection and Firebase configuration.'
        );
        setSdkReady(false);
      }
    };

    initSDK();
  }, [refreshKey]);

  const handleSetupSave = () => {
    // Refresh SDK context after localStorage update
    setRefreshKey(prev => prev + 1);
  };

  const handleOperation = (operation, params, result, error) => {
    const newResult = {
      operation,
      params,
      result,
      error,
      timestamp: Date.now(),
    };
    setResults(prev => [...prev, newResult]);
  };

  const handleClearResults = () => {
    setResults([]);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>FN7 SDK Test App</h1>
          <div className="sdk-status">
            {sdkReady ? (
              <span className="status-badge status-success">SDK Ready</span>
            ) : sdkError ? (
              <span className="status-badge status-error">SDK Error</span>
            ) : (
              <span className="status-badge status-loading">Loading SDK...</span>
            )}
          </div>
        </header>

        {sdkError && (
          <div className="error-banner">
            <div>
              <strong>SDK Loading Error:</strong> {sdkError}
              {sdkError.includes('Firebase config is required') && (
                <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                  Please configure Firebase settings in <code>src/config/environment.js</code>
                </div>
              )}
            </div>
            <button onClick={() => setRefreshKey(prev => prev + 1)} className="btn-retry">
              Retry
            </button>
          </div>
        )}

        <SetupSection onSave={handleSetupSave} />

        <ContextDisplay sdk={sdk} key={refreshKey} />

        <FirebaseOperations sdk={sdk} onOperation={handleOperation} />

        <BackendTesting />

        <div className="results-header-actions">
          <ResultsDisplay results={results} />
          {results.length > 0 && (
            <button onClick={handleClearResults} className="btn-clear">
              Clear Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
