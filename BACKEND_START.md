# Backend Start Commands

## Quick Start

Both backends are configured to run on specific ports:
- **Python Backend (FastAPI)**: Port **8090**
- **Node.js Backend (Express)**: Port **8091**

## Prerequisites

### Python Backend
- Python 3.11+
- Virtual environment (recommended)

### Node.js Backend
- Node.js 18.0+
- npm or yarn

## Starting the Backends

### Option 1: Start Both Backends (Terminal 1 & 2)

**Terminal 1 - Python Backend:**
```bash
cd python-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fn7-sdk --extra-index-url https://fn7.io/.fn7-sdk/python/
pip install -r requirements.txt
PORT=8090 python -m app.main

# Or use uvicorn directly:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8090
```

**Terminal 2 - Node.js Backend:**
```bash
cd nodejs-backend
npm install
PORT=8091 npm run dev
```

### Option 2: Using Environment Variables

**Python Backend:**
```bash
cd python-backend
# Create .env file with:
# PORT=8090
# FIREBASE_SERVICE_ACCOUNT_JSON='{...}'
# FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com

python -m venv venv
source venv/bin/activate
pip install fn7-sdk --extra-index-url https://fn7.io/.fn7-sdk/python/
pip install -r requirements.txt
python -m app.main
```

**Node.js Backend:**
```bash
cd nodejs-backend
# Create .env file with:
# PORT=8091
# FIREBASE_SERVICE_ACCOUNT_JSON='{...}'
# FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
# FN7_LOCAL_MODE=true  # IMPORTANT: Enable local mode to make tokens optional
# NODE_ENV=development

npm install
npm run dev
```

**Important:** Make sure `FN7_LOCAL_MODE=true` or `NODE_ENV=development` is set in your `.env` file, otherwise the SDK will require JWT tokens.

## Verify Backends Are Running

Once started, you can verify both backends are running:

```bash
# Check Python Backend (port 8090)
curl http://localhost:8090/health

# Check Node.js Backend (port 8091)
curl http://localhost:8091/health
```

Both should return: `{"status": "ok", ...}`

## Testing Backends

Use the **Backend Testing** page in the React app (http://localhost:3000) to test both backends interactively.

## Backend Endpoints

### Python Backend (http://localhost:8090)
- `GET /health` - Health check
- `GET /api/users/{user_id}` - Get user
- `POST /api/users/{user_id}` - Create user
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

### Node.js Backend (http://localhost:8091)
- `GET /health` - Health check
- `GET /users/{userId}` - Get user
- `POST /users/{userId}` - Create user
- `PUT /users/{userId}` - Update user
- `DELETE /users/{userId}` - Delete user

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
- Check what's running on the port: `lsof -i :8090` or `lsof -i :8091`
- Kill the process or change the PORT in .env

### SDK Not Initialized
Make sure you have:
1. Created `.env` file in the backend directory
2. Added `FIREBASE_SERVICE_ACCOUNT_JSON` with your Firebase service account
3. Added `FIREBASE_STORAGE_BUCKET` (optional but recommended)

### CORS Errors
Both backends have CORS enabled for `localhost:3000`. If you see CORS errors, check:
- Backend is running on correct port
- Frontend is making requests to correct backend URL

