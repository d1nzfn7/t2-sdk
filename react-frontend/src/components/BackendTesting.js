import React, { useState } from 'react';
import './BackendTesting.css';

const BackendTesting = () => {
  const [pythonBackendStatus, setPythonBackendStatus] = useState('unknown');
  const [nodeBackendStatus, setNodeBackendStatus] = useState('unknown');
  const [pythonResult, setPythonResult] = useState(null);
  const [nodeResult, setNodeResult] = useState(null);
  const [loading, setLoading] = useState({ python: false, node: false });
  const [userId, setUserId] = useState('test-user-123');
  const [userData, setUserData] = useState('{"name": "Test User", "email": "test@example.com"}');

  const PYTHON_BACKEND_URL = 'http://localhost:8090';
  const NODE_BACKEND_URL = 'http://localhost:8091';
  const REQUEST_TIMEOUT = 15000; // 15 seconds

  // Fetch with timeout helper
  const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout after 15 seconds');
      }
      throw error;
    }
  };

  // Check backend health
  const checkBackendHealth = async (backend, url) => {
    try {
      const response = await fetchWithTimeout(`${url}/health`);
      const data = await response.json();
      return { status: 'online', data };
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  };

  // Check both backends on mount
  React.useEffect(() => {
    const checkBackends = async () => {
      const pythonHealth = await checkBackendHealth('python', PYTHON_BACKEND_URL);
      setPythonBackendStatus(pythonHealth.status);

      const nodeHealth = await checkBackendHealth('node', NODE_BACKEND_URL);
      setNodeBackendStatus(nodeHealth.status);
    };

    checkBackends();
    // Check every 5 seconds
    const interval = setInterval(checkBackends, 5000);
    return () => clearInterval(interval);
  }, []);

  // Test Python Backend
  const testPythonBackend = async (operation) => {
    setLoading({ ...loading, python: true });
    setPythonResult(null);

    try {
      let response;
      let data;

      switch (operation) {
        case 'health':
          response = await fetchWithTimeout(`${PYTHON_BACKEND_URL}/health`);
          data = await response.json();
          setPythonResult({ operation: 'Health Check', success: true, data });
          break;

        case 'get':
          response = await fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/users/${userId}`);
          data = await response.json();
          setPythonResult({ operation: 'Get User', success: true, data });
          break;

        case 'create':
          const createData = JSON.parse(userData);
          response = await fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/users/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: createData }),
          });
          data = await response.json();
          setPythonResult({ operation: 'Create User', success: true, data });
          break;

        case 'update':
          const updateData = JSON.parse(userData);
          response = await fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: updateData }),
          });
          data = await response.json();
          setPythonResult({ operation: 'Update User', success: true, data });
          break;

        case 'delete':
          response = await fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/users/${userId}`, {
            method: 'DELETE',
          });
          setPythonResult({ operation: 'Delete User', success: response.status === 204, data: null });
          break;

        default:
          break;
      }
    } catch (error) {
      setPythonResult({ operation, success: false, error: error.message });
    } finally {
      setLoading({ ...loading, python: false });
    }
  };

  // Test Node.js Backend
  const testNodeBackend = async (operation) => {
    setLoading({ ...loading, node: true });
    setNodeResult(null);

    try {
      let response;
      let data;

      switch (operation) {
        case 'health':
          response = await fetchWithTimeout(`${NODE_BACKEND_URL}/health`);
          data = await response.json();
          setNodeResult({ operation: 'Health Check', success: true, data });
          break;

        case 'get':
          response = await fetchWithTimeout(`${NODE_BACKEND_URL}/users/${userId}`);
          data = await response.json();
          setNodeResult({ operation: 'Get User', success: true, data });
          break;

        case 'create':
          const createData = JSON.parse(userData);
          response = await fetchWithTimeout(`${NODE_BACKEND_URL}/users/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: createData }),
          });
          data = await response.json();
          setNodeResult({ operation: 'Create User', success: true, data });
          break;

        case 'update':
          const updateData = JSON.parse(userData);
          response = await fetchWithTimeout(`${NODE_BACKEND_URL}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: updateData }),
          });
          data = await response.json();
          setNodeResult({ operation: 'Update User', success: true, data });
          break;

        case 'delete':
          response = await fetchWithTimeout(`${NODE_BACKEND_URL}/users/${userId}`, {
            method: 'DELETE',
          });
          setNodeResult({ operation: 'Delete User', success: response.status === 204, data: null });
          break;

        default:
          break;
      }
    } catch (error) {
      setNodeResult({ operation, success: false, error: error.message });
    } finally {
      setLoading({ ...loading, node: false });
    }
  };

  return (
    <div className="backend-testing">
      <h2>Backend Testing</h2>
      <p className="section-description">
        Test both Python (port 8090) and Node.js (port 8091) backends. Make sure both servers are running.
      </p>

      {/* Backend Status */}
      <div className="backend-status">
        <div className="status-item">
          <span className="status-label">Python Backend (8090):</span>
          <span className={`status-badge ${pythonBackendStatus === 'online' ? 'online' : 'offline'}`}>
            {pythonBackendStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Node.js Backend (8091):</span>
          <span className={`status-badge ${nodeBackendStatus === 'online' ? 'online' : 'offline'}`}>
            {nodeBackendStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
      </div>

      {/* Input Fields */}
      <div className="backend-inputs">
        <div className="input-group">
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="test-user-123"
          />
        </div>
        <div className="input-group">
          <label>User Data (JSON):</label>
          <textarea
            value={userData}
            onChange={(e) => setUserData(e.target.value)}
            rows={4}
            placeholder='{"name": "Test User", "email": "test@example.com"}'
          />
        </div>
      </div>

      {/* Backend Testing Grid */}
      <div className="backend-grid">
        {/* Python Backend */}
        <div className="backend-card">
          <h3>Python Backend (FastAPI)</h3>
          <p className="backend-url">{PYTHON_BACKEND_URL}</p>

          <div className="backend-actions">
            <button
              onClick={() => testPythonBackend('health')}
              disabled={loading.python || pythonBackendStatus === 'offline'}
              className="btn-backend"
            >
              Health Check
            </button>
            <button
              onClick={() => testPythonBackend('get')}
              disabled={loading.python || pythonBackendStatus === 'offline'}
              className="btn-backend"
            >
              Get User
            </button>
            <button
              onClick={() => testPythonBackend('create')}
              disabled={loading.python || pythonBackendStatus === 'offline'}
              className="btn-backend"
            >
              Create User
            </button>
            <button
              onClick={() => testPythonBackend('update')}
              disabled={loading.python || pythonBackendStatus === 'offline'}
              className="btn-backend"
            >
              Update User
            </button>
            <button
              onClick={() => testPythonBackend('delete')}
              disabled={loading.python || pythonBackendStatus === 'offline'}
              className="btn-backend btn-danger"
            >
              Delete User
            </button>
          </div>

          {loading.python && <div className="loading-indicator">Loading...</div>}

          {pythonResult && (
            <div className={`result-box ${pythonResult.success ? 'success' : 'error'}`}>
              <strong>{pythonResult.operation}</strong>
              {pythonResult.success ? (
                <pre>{JSON.stringify(pythonResult.data, null, 2)}</pre>
              ) : (
                <div className="error-message">{pythonResult.error}</div>
              )}
            </div>
          )}
        </div>

        {/* Node.js Backend */}
        <div className="backend-card">
          <h3>Node.js Backend (Express)</h3>
          <p className="backend-url">{NODE_BACKEND_URL}</p>

          <div className="backend-actions">
            <button
              onClick={() => testNodeBackend('health')}
              disabled={loading.node || nodeBackendStatus === 'offline'}
              className="btn-backend"
            >
              Health Check
            </button>
            <button
              onClick={() => testNodeBackend('get')}
              disabled={loading.node || nodeBackendStatus === 'offline'}
              className="btn-backend"
            >
              Get User
            </button>
            <button
              onClick={() => testNodeBackend('create')}
              disabled={loading.node || nodeBackendStatus === 'offline'}
              className="btn-backend"
            >
              Create User
            </button>
            <button
              onClick={() => testNodeBackend('update')}
              disabled={loading.node || nodeBackendStatus === 'offline'}
              className="btn-backend"
            >
              Update User
            </button>
            <button
              onClick={() => testNodeBackend('delete')}
              disabled={loading.node || nodeBackendStatus === 'offline'}
              className="btn-backend btn-danger"
            >
              Delete User
            </button>
          </div>

          {loading.node && <div className="loading-indicator">Loading...</div>}

          {nodeResult && (
            <div className={`result-box ${nodeResult.success ? 'success' : 'error'}`}>
              <strong>{nodeResult.operation}</strong>
              {nodeResult.success ? (
                <pre>{JSON.stringify(nodeResult.data, null, 2)}</pre>
              ) : (
                <div className="error-message">{nodeResult.error}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendTesting;

