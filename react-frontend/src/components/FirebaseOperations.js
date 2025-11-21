import React, { useState } from 'react';
import './FirebaseOperations.css';

const FirebaseOperations = ({ sdk, onOperation }) => {
  const [docType, setDocType] = useState('Users');
  const [docId, setDocId] = useState('');
  const [data, setData] = useState('{}');
  const [queryConstraints, setQueryConstraints] = useState('{"AND": [["doc_type", "==", "Users"]]}');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleGetData = async () => {
    if (!docId.trim()) {
      alert('Please enter a document ID');
      return;
    }
    setLoading(true);
    try {
      const result = await sdk.getFirebaseData(docType, docId);
      onOperation('getFirebaseData', { docType, docId }, result, null);
    } catch (error) {
      onOperation('getFirebaseData', { docType, docId }, null, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateData = async () => {
    if (!docId.trim()) {
      alert('Please enter a document ID');
      return;
    }
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      alert('Invalid JSON data. Please check your JSON format.');
      return;
    }
    setLoading(true);
    try {
      const result = await sdk.createFirebaseData(docType, docId, parsedData);
      onOperation('createFirebaseData', { docType, docId, data: parsedData }, result, null);
    } catch (error) {
      onOperation('createFirebaseData', { docType, docId, data: parsedData }, null, error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateData = async () => {
    if (!docId.trim()) {
      alert('Please enter a document ID');
      return;
    }
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      alert('Invalid JSON data. Please check your JSON format.');
      return;
    }
    setLoading(true);
    try {
      const result = await sdk.updateFirebaseData(docType, docId, parsedData);
      onOperation('updateFirebaseData', { docType, docId, data: parsedData }, result, null);
    } catch (error) {
      onOperation('updateFirebaseData', { docType, docId, data: parsedData }, null, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteData = async () => {
    if (!docId.trim()) {
      alert('Please enter a document ID');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${docType}/${docId}?`)) {
      return;
    }
    setLoading(true);
    try {
      const result = await sdk.deleteFirebaseData(docType, docId);
      onOperation('deleteFirebaseData', { docType, docId }, result, null);
    } catch (error) {
      onOperation('deleteFirebaseData', { docType, docId }, null, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchData = async () => {
    let parsedConstraints;
    try {
      parsedConstraints = JSON.parse(queryConstraints);
    } catch (error) {
      alert('Invalid query constraints JSON. Please check your JSON format.');
      return;
    }
    setLoading(true);
    try {
      const result = await sdk.searchFirebaseData(parsedConstraints, limit);
      onOperation('searchFirebaseData', { queryConstraints: parsedConstraints, limit }, result, null);
    } catch (error) {
      onOperation('searchFirebaseData', { queryConstraints: parsedConstraints, limit }, null, error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetToken = async () => {
    setLoading(true);
    try {
      const result = await sdk.getCustomFirebaseToken();
      onOperation('getCustomFirebaseToken', {}, result, null);
    } catch (error) {
      onOperation('getCustomFirebaseToken', {}, null, error);
    } finally {
      setLoading(false);
    }
  };

  if (!sdk) {
    return (
      <div className="firebase-operations">
        <h2>Firebase Operations</h2>
        <p className="no-sdk">SDK not initialized. Please wait for SDK to load.</p>
      </div>
    );
  }

  return (
    <div className="firebase-operations">
      <h2>Firebase Operations</h2>
      {loading && <div className="loading-overlay">Processing...</div>}

      <div className="operations-grid">
        {/* Get Data */}
        <div className="operation-card">
          <h3>Get Firebase Data</h3>
          <div className="form-group">
            <label>Document Type:</label>
            <input
              type="text"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              placeholder="e.g., Users"
            />
          </div>
          <div className="form-group">
            <label>Document ID:</label>
            <input
              type="text"
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              placeholder="e.g., user123"
            />
          </div>
          <button onClick={handleGetData} className="btn-operation" disabled={loading}>
            Get Data
          </button>
        </div>

        {/* Create Data */}
        <div className="operation-card">
          <h3>Create Firebase Data</h3>
          <div className="form-group">
            <label>Document Type:</label>
            <input
              type="text"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              placeholder="e.g., Users"
            />
          </div>
          <div className="form-group">
            <label>Document ID:</label>
            <input
              type="text"
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              placeholder="e.g., user123"
            />
          </div>
          <div className="form-group">
            <label>Data (JSON):</label>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              rows={4}
              placeholder='{"name": "John", "email": "john@example.com"}'
            />
          </div>
          <button onClick={handleCreateData} className="btn-operation" disabled={loading}>
            Create Data
          </button>
        </div>

        {/* Update Data */}
        <div className="operation-card">
          <h3>Update Firebase Data</h3>
          <div className="form-group">
            <label>Document Type:</label>
            <input
              type="text"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              placeholder="e.g., Users"
            />
          </div>
          <div className="form-group">
            <label>Document ID:</label>
            <input
              type="text"
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              placeholder="e.g., user123"
            />
          </div>
          <div className="form-group">
            <label>Data (JSON):</label>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              rows={4}
              placeholder='{"name": "Jane"}'
            />
          </div>
          <button onClick={handleUpdateData} className="btn-operation" disabled={loading}>
            Update Data
          </button>
        </div>

        {/* Delete Data */}
        <div className="operation-card">
          <h3>Delete Firebase Data</h3>
          <div className="form-group">
            <label>Document Type:</label>
            <input
              type="text"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              placeholder="e.g., Users"
            />
          </div>
          <div className="form-group">
            <label>Document ID:</label>
            <input
              type="text"
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              placeholder="e.g., user123"
            />
          </div>
          <button onClick={handleDeleteData} className="btn-operation btn-danger" disabled={loading}>
            Delete Data
          </button>
        </div>

        {/* Search Data */}
        <div className="operation-card">
          <h3>Search Firebase Data</h3>
          <div className="form-group">
            <label>Query Constraints (JSON):</label>
            <textarea
              value={queryConstraints}
              onChange={(e) => setQueryConstraints(e.target.value)}
              rows={6}
              placeholder='{"AND": [["doc_type", "==", "Users"]]}'
            />
          </div>
          <div className="form-group">
            <label>Limit:</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
              min="1"
              max="100"
            />
          </div>
          <button onClick={handleSearchData} className="btn-operation" disabled={loading}>
            Search Data
          </button>
        </div>

        {/* Get Token */}
        <div className="operation-card">
          <h3>Get Custom Firebase Token</h3>
          <p className="operation-description">
            Get a custom Firebase authentication token.
          </p>
          <button onClick={handleGetToken} className="btn-operation" disabled={loading}>
            Get Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseOperations;

