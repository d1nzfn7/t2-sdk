# FN7 Micro Module Template

This is a template repository that can be used as a starting point for building FN7 micro modules.

## 🧠 What is a Micro Module?

A micro module is a **self-contained mini-app** that plugs into the larger FN7 platform. Each micro module:

- **Has its own UI layer** - Built as a React application (frontend)
- **Optionally has its own backend** - Written in Python for APIs, automation, or heavy processing
- **Uses SDKs as the integration layer** - SDKs serve as the glue between:
  - The micro module ↔ the host platform
  - The frontend ↔ backend (if present)

### Architecture Overview

```
┌─────────────────────────────────────┐
│   Micro Module                      │
│                                     │
│  ┌──────────┐      ┌──────────┐     │
│  │  React   │◄────►│  Python  │     │
│  │  (UI)    │      │ (Backend)│     │
│  └────┬─────┘      └────┬─────┘     │
│       │                 │           │
│       │ Frontend SDK    │ Python    │
│       │                 │ SDK       │
│       └────────┬────────┴           │
│                │                    │
└────────────────┼────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │    Firebase   │
         └───────────────┘
```

### Data Flow

1. **User interacts** with your micro module's React UI
2. **Frontend calls SDK functions** (e.g., `sdk.getFirebaseData()`, `sdk.createFirebaseData()`)
3. **SDK abstracts data access** - It may:
   - Fetch directly from the core platform (using authenticated tokens), or
   - Call your Python backend, which uses the Python SDK to access/transform data
4. **Backend processes** and sends data back to frontend → React re-renders UI


## 🚀 Quick Start

### Option 1: Use GitHub Template Feature (Recommended)

1. Click the green **"Use this template"** button on GitHub
2. Give your new repository a name
3. Click **"Create repository from template"**
4. Clone your new repository
5. You're done! The new repository is already disconnected from this template.

### Option 2: Manual Setup

1. **Clone the repository:**
   ```bash
   git clone <this-repo-url>
   cd <repo-name>
   ```

2. **Remove the existing git history:**
   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit from template"
   ```

3. **Create a new repository** on GitHub/GitLab/Bitbucket (do NOT initialize with README)

4. **Add your remote and push:**
   ```bash
   git remote add origin <your-new-repo-url>
   git branch -M main
   git push -u origin main
   ```

## 📦 Building a Micro Module - Complete Guide

Every micro module **must have a React frontend**. You can optionally add a Python backend for APIs.

### Step 1: Create Your React Application

**Eg: Using Create React App**
```bash
npx create-react-app my-micro-module
cd my-micro-module
```

### Step 2: Install and Configure the Frontend SDK

**Install the SDK via CDN or ES Modules:**

Create a file `src/sdk.js` (or `src/sdk.ts` for TypeScript):

```javascript
// src/sdk.js
import FN7SDK from 'https://fn7.io/.fn7-sdk/frontend/latest/sdk.esm.js';

// Firebase configuration - Get this from your Firebase project settings
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize SDK
const sdk = new FN7SDK(undefined, firebaseConfig);

export default sdk;
```

**Where to get Firebase config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll to "Your apps" section
5. Click the web icon (`</>`) to add a web app
6. Copy the `firebaseConfig` object

### Step 3: Set Up Authentication

The Frontend SDK automatically reads authentication tokens from `localStorage`. The SDK expects:

**`localStorage.user_context`** - Contains user authentication data:
Take this value from `.env` file please.

**`localStorage.app_context`** - Contains application metadata:
Take this value from `.env` file please.

**`localStorage.id_token`** - JWT Token:
Take this value from `.env` file please.

**Note:** These are typically set by the FN7 platform when your micro module is loaded. For local development, you may need to set them manually.

### Step 4: Use the SDK in Your React Components

**Example Component:**
```javascript
// src/App.js
import { useState, useEffect } from 'react';
import sdk from './sdk';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user context
    const userId = sdk.getUserId();
    console.log('Current user:', userId);

    // Fetch data using SDK
    if (userId) {
      sdk.getFirebaseData('Users', userId)
        .then((userData) => {
          setData(userData);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, []);

  const handleCreate = async () => {
    try {
      const result = await sdk.createFirebaseData('Chats', 'chat123', {
        message: 'Hello from micro module!',
        created_at: new Date().toISOString()
      });
      console.log('Created:', result);
    } catch (error) {
      console.error('Error creating:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <h1>My Micro Module</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={handleCreate}>Create Data</button>
    </div>
  );
}

export default App;
```

**Frontend SDK Features:**
- Firebase CRUD operations (Get, Create, Update, Delete, Search)
- Firebase Storage operations (Upload, Get URL, Get Blob)
- User, Application, and Organization context helpers
- Real-time Firebase listeners

**Documentation:** [`fn7-sdk/frontend-sdk.md`](./fn7-sdk/frontend-sdk.md)
**Example:** [fn7SDK-React-app](https://github.com/d1nzfn7/fn7SDK-React-app)

### Step 5: Add Python Backend

If your micro module needs backend logic, APIs, or automation:

**5.1. Create Backend Directory Structure:**
```bash
mkdir backend
cd backend
```

**5.2. Set Up Python Environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**5.3. Install Dependencies:**
```bash
pip install fn7-sdk --index-url https://fn7.io/.fn7-sdk/python/
pip install fastapi uvicorn python-dotenv
```

**5.4. Create Backend Application:**

Create `backend/app/main.py`:
```python
from fastapi import FastAPI, Header
from fn7_sdk import FN7SDK
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
sdk = FN7SDK()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/process")
async def process_data(authorization: str = Header(None)):
    # Extract JWT token from Authorization header
    jwt_token = authorization if authorization else None

    if not jwt_token:
        return {"error": "Missing authorization token"}, 401

    try:
        # Fetch data using SDK
        data = sdk.get_firebase_data("Users", "user123", jwt_token)

        # Process data...
        result = {"processed": data, "status": "success"}

        # Save back using SDK
        sdk.update_firebase_data("Users", "user123", result, jwt_token)
        return result
    except Exception as e:
        return {"error": str(e)}, 500
```

**5.5. Set Up Environment Variables:**

Create `backend/.env`:
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json
# OR
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
FIREBASE_STORAGE_BUCKET=your-storage-bucket.appspot.com
```

**5.6. Run Backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

**5.7. Connect Frontend to Backend:**

Update your React app to call your backend:
```javascript
// In your React component
const callBackend = async () => {
  const token = JSON.parse(localStorage.user_context).id_token;
  const response = await fetch('http://localhost:8000/api/process', {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  console.log(result);
};
```

**Python SDK Features:**
- Firebase CRUD operations with security rules enforcement
- Firebase Storage operations
- JWT token-based authentication
- Organization isolation and access control
- Built-in security validation

**Documentation:** [`fn7-sdk/python-sdk.md`](./fn7-sdk/python-sdk.md)
**Example:** [fn7SDK-python-backend](https://github.com/d1nzfn7/fn7SDK-python-backend)

### Project Structure

A typical micro module structure looks like:

```
my-micro-module/
├── frontend/                 # React application
│   ├── src/
│   │   ├── sdk.js           # SDK initialization
│   │   ├── App.js           # Main component
│   │   └── components/      # Your React components
│   ├── package.json
│   └── ...
├── backend/                  # Python backend (optional)
│   ├── app/
│   │   └── main.py          # FastAPI application
│   ├── .env                 # Environment variables
│   └── requirements.txt
└── README.md
```

## 📚 SDK Documentation

Both SDKs are documented in detail:

- **Frontend SDK:** [`fn7-sdk/frontend-sdk.md`](./fn7-sdk/frontend-sdk.md) - Complete API reference for JavaScript/TypeScript SDK
- **Python SDK:** [`fn7-sdk/python-sdk.md`](./fn7-sdk/python-sdk.md) - Complete API reference for Python SDK

## 🎨 UI Guidelines

For frontend micro modules, please refer to [`UI_CONTEXT.md`](./UI_CONTEXT.md) for design guidelines, including:
- Font specifications (Sora)
- Theme requirements (Light theme)
- Color palette
- Component guidelines

## 📝 Quick Start Checklist

1. ✅ **Set up your repository** using the Quick Start guide above
2. ✅ **Create your React application** (Step 1 in Building Guide)
3. ✅ **Get Firebase configuration** from Firebase Console
4. ✅ **Install and configure Frontend SDK** (Step 2 in Building Guide)
5. ✅ **Set up authentication** - Understand how tokens work (Step 3)
6. ✅ **Build your React UI** using the SDK (Step 4)
7. ✅ **Add Python backend** if needed (Step 5)
8. ✅ **Review SDK documentation** - See links below for complete API references
9. ✅ **Check example implementations** - Reference the example repos
10. ✅ **Test locally** - Run your React app and backend (if applicable)

## ⚠️ Important Notes

- **Never push directly to this template repository** - Always create a new repository first
- **Firebase Configuration Required** - Both SDKs need proper Firebase setup
- **Authentication** - Frontend SDK reads tokens from `localStorage.user_context` and `localStorage.app_context`
- **Backend Authentication** - Python backend requires JWT token passed in `Authorization` header. Can be found in `.env` file
- **Environment Variables** - Python backend needs Firebase service account credentials
- **UI Guidelines** - Follow the UI guidelines for frontend modules (Sora font, light theme)
- **Review Examples** - Check the example implementations for best practices

## 🔧 Development Tips

- **Local Development**: Set `localStorage.user_context` and `localStorage.app_context` manually for testing
- **CORS**: If connecting frontend to backend, ensure CORS is configured in your backend
- **Error Handling**: Always wrap SDK calls in try-catch blocks
- **Loading States**: Show loading indicators while SDK operations are in progress
- **TypeScript**: Both SDKs support TypeScript for better type safety

## 🤝 Contributing to the Template

If you want to improve this template itself, please:

1. Fork this repository
2. Make your changes
3. Submit a pull request

---

**Note:** If you're using this template on GitHub, make sure the repository settings mark it as a template repository (Settings → Template repository).
