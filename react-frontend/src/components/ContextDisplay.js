import React, { useState, useEffect } from 'react';
import './ContextDisplay.css';

const ContextDisplay = ({ sdk }) => {
  const [contextData, setContextData] = useState(null);

  useEffect(() => {
    if (sdk) {
      updateContext();
    }
  }, [sdk]);

  const updateContext = () => {
    if (!sdk) return;

    try {
      const data = {
        user: {
          userId: sdk.getUserId(),
          userRole: sdk.getUserRole(),
          orgRole: sdk.getOrgRole(),
          userOrgHkey: sdk.getUserOrgHkey(),
          userContext: sdk.userContext(),
        },
        app: {
          appId: sdk.applicationId(),
          appName: sdk.applicationName(),
          appOrgHkey: sdk.getApplicationOrgHkey(),
          isBaseApp: sdk.isBaseApp(),
          applicationMeta: sdk.applicationMeta(),
        },
        org: {
          primaryOrgId: sdk.getApplicationPrimaryOrgId(),
        },
      };
      setContextData(data);
    } catch (error) {
      console.error('Error getting context:', error);
      setContextData({ error: error.message });
    }
  };

  if (!sdk) {
    return (
      <div className="context-display">
        <h2>Context Display</h2>
        <p className="no-sdk">SDK not initialized. Please wait for SDK to load.</p>
      </div>
    );
  }

  if (!contextData) {
    return (
      <div className="context-display">
        <h2>Context Display</h2>
        <p className="loading">Loading context...</p>
      </div>
    );
  }

  if (contextData.error) {
    return (
      <div className="context-display">
        <h2>Context Display</h2>
        <div className="error-box">
          <strong>Error:</strong> {contextData.error}
        </div>
      </div>
    );
  }

  return (
    <div className="context-display">
      <div className="context-header">
        <h2>Context Display</h2>
        <button onClick={updateContext} className="btn-refresh">
          Refresh
        </button>
      </div>

      <div className="context-grid">
        <div className="context-card">
          <h3>User Context</h3>
          <div className="context-item">
            <strong>User ID:</strong>
            <span>{contextData.user.userId || 'N/A'}</span>
          </div>
          <div className="context-item">
            <strong>User Role:</strong>
            <span>{contextData.user.userRole || 'N/A'}</span>
          </div>
          <div className="context-item">
            <strong>Org Role:</strong>
            <span>{contextData.user.orgRole || 'N/A'}</span>
          </div>
          <div className="context-item">
            <strong>User Org Hkey:</strong>
            <span>{contextData.user.userOrgHkey || 'N/A'}</span>
          </div>
          <details className="context-details">
            <summary>Full User Context</summary>
            <pre>{JSON.stringify(contextData.user.userContext, null, 2)}</pre>
          </details>
        </div>

        <div className="context-card">
          <h3>App Context</h3>
          <div className="context-item">
            <strong>App ID:</strong>
            <span>{contextData.app.appId || 'N/A'}</span>
          </div>
          <div className="context-item">
            <strong>App Name:</strong>
            <span>{contextData.app.appName || 'N/A'}</span>
          </div>
          <div className="context-item">
            <strong>App Org Hkey:</strong>
            <span>{contextData.app.appOrgHkey || 'N/A'}</span>
          </div>
          <div className="context-item">
            <strong>Is Base App:</strong>
            <span>{String(contextData.app.isBaseApp)}</span>
          </div>
          <details className="context-details">
            <summary>Full App Context</summary>
            <pre>{JSON.stringify(contextData.app.applicationMeta, null, 2)}</pre>
          </details>
        </div>

        <div className="context-card">
          <h3>Organization Context</h3>
          <div className="context-item">
            <strong>Primary Org ID:</strong>
            <span>{contextData.org.primaryOrgId || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextDisplay;

