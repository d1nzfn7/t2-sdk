"""
Main Application Entry Point
FastAPI server with FN7 SDK integration
"""

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from dotenv import load_dotenv
from typing import Optional

# Configure logging
# Set root logger to WARNING (quiet)
logging.basicConfig(level=logging.WARNING)

# Set SDK logger to DEBUG (verbose)
logging.getLogger('fn7_sdk').setLevel(logging.DEBUG)

# Load environment variables
load_dotenv()
print(os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON"))
from fn7_sdk import FN7SDK, get_initialization_status

# Initialize FastAPI app
app = FastAPI(title="FN7 Python Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SDK
sdk = None
try:
    sdk = FN7SDK()
    # Check initialization status
    status = get_initialization_status()
    print(status)
    print("✅ FN7 SDK initialized successfully")
except Exception as e:
    print(f"⚠️  Warning: Failed to initialize SDK: {e}")
    print("   Make sure FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH is set")


def extract_jwt_token(authorization: Optional[str] = Header(None)):
    """
    Extract JWT token from Authorization header (optional)
    Token format: "Bearer <token>"

    If no token is provided, SDK will use default values automatically.
    """
    if not authorization:
        return None

    return authorization


@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok", "sdk_initialized": sdk is not None}


# User endpoints
@app.get("/api/users/{user_id}")
async def get_user(user_id: str, authorization: Optional[str] = Header(None)):
    """
    Get user data
    Authorization header is optional. SDK uses default values if token is not provided.
    """
    print(f"\n{'='*60}")
    print(f"[DEBUG] GET /api/users/{user_id}")
    print(f"{'='*60}")
    print(f"[DEBUG] Authorization header: {authorization}")

    if not sdk:
        print("[ERROR] SDK not initialized")
        raise HTTPException(status_code=500, detail="SDK not initialized")

    jwt_token = extract_jwt_token(authorization)
    print(f"[DEBUG] Extracted JWT token: {jwt_token}")
    print(f"[DEBUG] Token type: {type(jwt_token)}")
    print(f"[DEBUG] Token is None: {jwt_token is None}")
    print(f"[DEBUG] Calling sdk.get_firebase_data('Users', '{user_id}', {jwt_token})")

    try:
        user_data = sdk.get_firebase_data("Users", user_id, jwt_token)
        print(f"[DEBUG] ✅ Success! Received data: {user_data}")
        print(f"[DEBUG] Data type: {type(user_data)}")
        print(f"{'='*60}\n")
        return user_data
    except Exception as e:
        print(f"[ERROR] ❌ Exception occurred: {type(e).__name__}: {str(e)}")
        print(f"[ERROR] Exception details: {repr(e)}")
        import traceback
        print(f"[ERROR] Traceback:")
        traceback.print_exc()
        print(f"{'='*60}\n")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/users/{user_id}")
async def create_user(user_id: str, request_data: dict, authorization: Optional[str] = Header(None)):
    """
    Create user data
    """
    print(f"\n{'='*60}")
    print(f"[DEBUG] POST /api/users/{user_id}")
    print(f"{'='*60}")
    print(f"[DEBUG] Authorization header: {authorization}")
    print(f"[DEBUG] Request data: {request_data}")

    if not sdk:
        print("[ERROR] SDK not initialized")
        raise HTTPException(status_code=500, detail="SDK not initialized")

    jwt_token = extract_jwt_token(authorization)
    data = request_data.get("data", {})

    print(f"[DEBUG] Extracted JWT token: {jwt_token}")
    print(f"[DEBUG] Token type: {type(jwt_token)}")
    print(f"[DEBUG] Token is None: {jwt_token is None}")
    print(f"[DEBUG] Data to create: {data}")
    print(f"[DEBUG] Data type: {type(data)}")
    print(f"[DEBUG] Calling sdk.create_firebase_data('Users', '{user_id}', {data}, {jwt_token})")

    try:
        result = sdk.create_firebase_data("Users", user_id, data, jwt_token)
        print(f"[DEBUG] ✅ Success! Created data: {result}")
        print(f"[DEBUG] Result type: {type(result)}")
        print(f"{'='*60}\n")
        return result
    except Exception as e:
        print(f"[ERROR] ❌ Exception occurred: {type(e).__name__}: {str(e)}")
        print(f"[ERROR] Exception details: {repr(e)}")
        import traceback
        print(f"[ERROR] Traceback:")
        traceback.print_exc()
        print(f"{'='*60}\n")
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/users/{user_id}")
async def update_user(user_id: str, request_data: dict, authorization: Optional[str] = Header(None)):
    """
    Update user data
    """
    if not sdk:
        raise HTTPException(status_code=500, detail="SDK not initialized")

    jwt_token = extract_jwt_token(authorization)
    data = request_data.get("data", {})

    try:
        result = sdk.update_firebase_data("Users", user_id, data, jwt_token)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/users/{user_id}")
async def delete_user(user_id: str, authorization: Optional[str] = Header(None)):
    """
    Delete user data
    """
    if not sdk:
        raise HTTPException(status_code=500, detail="SDK not initialized")

    jwt_token = extract_jwt_token(authorization)

    try:
        sdk.delete_firebase_data("Users", user_id, jwt_token)
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8090))  # Default to 8090 for Python backend
    host = os.getenv("HOST", "0.0.0.0")

    # Use import string format to enable reload mode
    uvicorn.run("app.main:app", host=host, port=port, reload=True)

