import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="results-display">
        <h2>Results Display</h2>
        <p className="no-results">No operations performed yet. Use Firebase Operations to test SDK functions.</p>
      </div>
    );
  }

  const latestResult = results[results.length - 1];

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>Results Display</h2>
        <div className="results-count">
          {results.length} operation{results.length !== 1 ? 's' : ''} performed
        </div>
      </div>

      <div className="result-card">
        <div className="result-header">
          <h3>{latestResult.operation}</h3>
          <span className={`result-status ${latestResult.error ? 'error' : 'success'}`}>
            {latestResult.error ? 'Error' : 'Success'}
          </span>
        </div>

        <div className="result-section">
          <h4>Parameters:</h4>
          <pre className="result-json">{JSON.stringify(latestResult.params, null, 2)}</pre>
        </div>

        {latestResult.error ? (
          <div className="result-section">
            <h4>Error:</h4>
            <div className="error-box">
              <strong>Message:</strong> {latestResult.error.message || String(latestResult.error)}
              {latestResult.error.stack && (
                <details>
                  <summary>Stack Trace</summary>
                  <pre>{latestResult.error.stack}</pre>
                </details>
              )}
            </div>
          </div>
        ) : (
          <div className="result-section">
            <h4>Result:</h4>
            <pre className="result-json">{JSON.stringify(latestResult.result, null, 2)}</pre>
          </div>
        )}

        <div className="result-meta">
          <small>Timestamp: {new Date(latestResult.timestamp).toLocaleString()}</small>
        </div>
      </div>

      {results.length > 1 && (
        <details className="history-section">
          <summary>View History ({results.length - 1} previous operations)</summary>
          <div className="history-list">
            {results.slice(0, -1).reverse().map((result, index) => (
              <div key={index} className="history-item">
                <div className="history-header">
                  <strong>{result.operation}</strong>
                  <span className={`history-status ${result.error ? 'error' : 'success'}`}>
                    {result.error ? 'Error' : 'Success'}
                  </span>
                  <small>{new Date(result.timestamp).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default ResultsDisplay;

