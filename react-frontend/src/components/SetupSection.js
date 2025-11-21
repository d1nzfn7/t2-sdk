import React, { useState, useEffect } from 'react';
import './SetupSection.css';

const SetupSection = ({ onSave }) => {
  const [userContext, setUserContext] = useState('');
  const [appContext, setAppContext] = useState('');
  const [userContextError, setUserContextError] = useState('');
  const [appContextError, setAppContextError] = useState('');

  // Load existing values from localStorage on mount
  useEffect(() => {
    try {
      const storedUserContext = localStorage.getItem('user_context');
      const storedAppContext = localStorage.getItem('app_context');

      if (storedUserContext) {
        setUserContext(JSON.stringify(JSON.parse(storedUserContext), null, 2));
      } else {
        // Set default example
        setUserContext(JSON.stringify({
          user_id: 'test-user-123',
          org_hkey: 'org.456',
          user_role: 'admin',
          org_role: 'owner',
          id_token: 'test-token-here'
        }, null, 2));
      }

      if (storedAppContext) {
        setAppContext(JSON.stringify(JSON.parse(storedAppContext), null, 2));
      } else {
        // Set default example
        setAppContext(JSON.stringify({
          doc_id: 'test-app-789',
          org_hkey: 'org.456',
          application_url_prefix: 'test-app'
        }, null, 2));
      }
    } catch (error) {
      console.error('Error loading localStorage:', error);
    }
  }, []);

  const handleSave = () => {
    let hasError = false;

    // Validate and parse user_context
    try {
      const parsedUserContext = JSON.parse(userContext);
      localStorage.setItem('user_context', JSON.stringify(parsedUserContext));
      setUserContextError('');
    } catch (error) {
      setUserContextError('Invalid JSON format');
      hasError = true;
    }

    // Validate and parse app_context
    try {
      const parsedAppContext = JSON.parse(appContext);
      localStorage.setItem('app_context', JSON.stringify(parsedAppContext));
      setAppContextError('');
    } catch (error) {
      setAppContextError('Invalid JSON format');
      hasError = true;
    }

    if (!hasError) {
      if (onSave) {
        onSave();
      }
      alert('Configuration saved successfully!');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset localStorage? This will clear all stored data.')) {
      localStorage.removeItem('user_context');
      localStorage.removeItem('app_context');
      setUserContext(JSON.stringify({
        user_id: 'test-user-123',
        org_hkey: 'org.456',
        user_role: 'admin',
        org_role: 'owner',
        id_token: 'test-token-here'
      }, null, 2));
      setAppContext(JSON.stringify({
        doc_id: 'test-app-789',
        org_hkey: 'org.456',
        application_url_prefix: 'test-app'
      }, null, 2));
      setUserContextError('');
      setAppContextError('');
      if (onSave) {
        onSave();
      }
      alert('localStorage reset successfully!');
    }
  };

  return (
    <div className="setup-section">
      <h2>Setup Configuration</h2>
      <p className="section-description">
        Configure localStorage values for user_context and app_context. These values are used by the SDK for authentication and context.
      </p>

      <div className="setup-grid">
        <div className="setup-item">
          <label htmlFor="user-context">
            <strong>user_context</strong> (JSON)
          </label>
          <textarea
            id="user-context"
            className={`json-editor ${userContextError ? 'error' : ''}`}
            value={userContext}
            onChange={(e) => {
              setUserContext(e.target.value);
              setUserContextError('');
            }}
            rows={8}
            placeholder='{"user_id": "test-user-123", ...}'
          />
          {userContextError && (
            <span className="error-message">{userContextError}</span>
          )}
        </div>

        <div className="setup-item">
          <label htmlFor="app-context">
            <strong>app_context</strong> (JSON)
          </label>
          <textarea
            id="app-context"
            className={`json-editor ${appContextError ? 'error' : ''}`}
            value={appContext}
            onChange={(e) => {
              setAppContext(e.target.value);
              setAppContextError('');
            }}
            rows={8}
            placeholder='{"doc_id": "test-app-789", ...}'
          />
          {appContextError && (
            <span className="error-message">{appContextError}</span>
          )}
        </div>
      </div>

      <div className="setup-actions">
        <button onClick={handleSave} className="btn-primary">
          Save Configuration
        </button>
        <button onClick={handleReset} className="btn-secondary">
          Reset localStorage
        </button>
      </div>
    </div>
  );
};

export default SetupSection;

