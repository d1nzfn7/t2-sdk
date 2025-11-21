# FN7 SDK Test App - React Hello World

A React hello world application that demonstrates and tests all FN7 SDK functions. This app provides a comprehensive UI for testing Firebase operations, context helpers, and SDK functionality.

## 🚀 Quick Start

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn
- Internet connection (SDK loads from CDN)
- Firebase project configuration

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase settings**

   Edit `src/config/environment.js` with your Firebase configuration:

   ```javascript
   export const environment = {
     firebase: {
       apiKey: 'your-api-key',
       authDomain: 'your-project.firebaseapp.com',
       projectId: 'your-project-id',
       storageBucket: 'your-project.appspot.com',
       messagingSenderId: '123456789',
       appId: 'your-app-id',
     },
     apiBaseUrl: undefined, // Local mode (or set to your API URL)
   };
   ```

   **Getting Firebase Configuration:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create a new one)
   - Go to **Project Settings** (gear icon)
   - Scroll to **"Your apps"** section
   - Click the web icon (`</>`) to add a web app
   - Copy the `firebaseConfig` values to your `environment.js` file

3. **Run the React app**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

   **Note:** The SDK is automatically loaded from `https://fn7.io/.fn7-sdk/frontend/latest/sdk.esm.js`. No local SDK server is required.

## 📋 Application Features

### 1. Setup Section

Configure `localStorage` values for `user_context` and `app_context`:

- **user_context**: Contains user authentication data (user_id, org_hkey, user_role, org_role, id_token)
- **app_context**: Contains application metadata (doc_id, org_hkey, application_url_prefix)

The app provides default example values that you can modify. Click "Save Configuration" to store them in localStorage.

### 2. Context Display

Shows all context information retrieved from the SDK:

- **User Context**: User ID, User Role, Org Role, User Org Hkey
- **App Context**: App ID, App Name, App Org Hkey, Is Base App
- **Organization Context**: Primary Org ID

Click "Refresh" to reload context data after updating localStorage.

### 3. Firebase Operations

Test all Firebase CRUD operations:

- **Get Firebase Data**: Retrieve a document by doc_type and doc_id
- **Create Firebase Data**: Create a new document with JSON data
- **Update Firebase Data**: Update an existing document with JSON data
- **Delete Firebase Data**: Delete a document (with confirmation)
- **Search Firebase Data**: Search with query constraints and limit
- **Get Custom Firebase Token**: Get a Firebase authentication token

Each operation includes input fields for required parameters and shows loading states during execution.

### 4. Results Display

Shows results and errors from SDK operations:

- Displays the latest operation result
- Shows formatted JSON output
- Displays error messages with stack traces
- Maintains a history of all operations
- Includes a "Clear Results" button

## 🔧 Setup localStorage

### Example user_context

```json
{
  "user_id": "test-user-123",
  "org_hkey": "org.456",
  "user_role": "admin",
  "org_role": "owner",
  "id_token": "test-token-here"
}
```

### Example app_context

```json
{
  "doc_id": "test-app-789",
  "org_hkey": "org.456",
  "application_url_prefix": "test-app"
}
```

### Setting localStorage Manually

You can also set localStorage values directly in the browser console:

```javascript
localStorage.setItem('user_context', JSON.stringify({
  user_id: 'test-user-123',
  org_hkey: 'org.456',
  user_role: 'admin',
  org_role: 'owner',
  id_token: 'test-token-here'
}));

localStorage.setItem('app_context', JSON.stringify({
  doc_id: 'test-app-789',
  org_hkey: 'org.456',
  application_url_prefix: 'test-app'
}));
```

After setting localStorage, refresh the page or click "Refresh" in the Context Display section.

## 🧪 Testing SDK Functions

### Testing Get Firebase Data

1. Enter a document type (e.g., "Users")
2. Enter a document ID (e.g., "user123")
3. Click "Get Data"
4. Check the Results Display section for the result

### Testing Create Firebase Data

1. Enter document type and ID
2. Enter JSON data in the data field:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "created_at": "2024-01-01T00:00:00Z"
   }
   ```
3. Click "Create Data"

### Testing Update Firebase Data

1. Enter document type and ID
2. Enter JSON data with fields to update:
   ```json
   {
     "name": "Jane Doe"
   }
   ```
3. Click "Update Data"

### Testing Delete Firebase Data

1. Enter document type and ID
2. Click "Delete Data"
3. Confirm the deletion

### Testing Search Firebase Data

1. Enter query constraints in JSON format:
   ```json
   {
     "AND": [
       ["doc_type", "==", "Users"],
       ["status", "==", "active"]
     ]
   }
   ```
2. Set a limit (e.g., 10)
3. Click "Search Data"

### Testing Get Custom Firebase Token

1. Click "Get Token"
2. Check Results Display for the token

## 📁 Project Structure

```
react-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SetupSection.js          # localStorage configuration UI
│   │   ├── SetupSection.css
│   │   ├── ContextDisplay.js        # Context information display
│   │   ├── ContextDisplay.css
│   │   ├── FirebaseOperations.js    # Firebase CRUD operations UI
│   │   ├── FirebaseOperations.css
│   │   ├── ResultsDisplay.js        # Results and errors display
│   │   └── ResultsDisplay.css
│   ├── App.js                       # Main app component
│   ├── App.css                      # App styles
│   ├── index.js                     # Entry point
│   └── index.css                    # Global styles
├── package.json
└── README.md
```

## 🛠️ Development

### Scripts

- `npm start` - Start development server with hot reload
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

### SDK Initialization

The app dynamically loads the SDK from the CDN:

```javascript
const SDK = await import('https://fn7.io/.fn7-sdk/frontend/latest/sdk.esm.js');
const sdk = new SDK.default(environment.apiBaseUrl, environment.firebase);
```

The SDK requires Firebase configuration, which is loaded from `src/config/environment.js`. If the SDK fails to load, you'll see an error message with a "Retry" button.

## 🐛 Troubleshooting

### SDK Loading Error

**Problem:** "Failed to load SDK from https://fn7.io/.fn7-sdk/frontend/latest/sdk.esm.js" or "Failed to fetch dynamically imported module"

**Solution:**
1. **Check your internet connection** - The SDK loads from a CDN
2. **Check browser console** - Look for CORS errors or network failures
3. **Verify Firebase configuration** - Make sure `src/config/environment.js` has valid Firebase settings
4. **CORS Issues** - If you see CORS errors, the SDK server might need to allow your origin. Try:
   - Opening the SDK URL directly in your browser: `https://fn7.io/.fn7-sdk/frontend/latest/sdk.esm.js`
   - Checking browser console for specific CORS error messages
5. **If you see "Firebase config is required"** - Make sure `environment.firebase` is properly configured in `src/config/environment.js`
6. **Click "Retry" button** - The app will attempt to reload the SDK

**Note:** The app uses a fetch + blob URL approach to load the SDK, which works around Create React App's limitations with external dynamic imports. If you continue to have issues, check that:
- Your browser supports ES modules (all modern browsers do)
- There are no browser extensions blocking the request
- Your network/firewall allows connections to `fn7.io`

### Context Not Showing

**Problem:** Context Display shows "N/A" or empty values

**Solution:**
1. Go to Setup Section
2. Configure `user_context` and `app_context`
3. Click "Save Configuration"
4. Click "Refresh" in Context Display

### Firebase Operations Failing

**Problem:** Operations return errors

**Solution:**
1. Check that localStorage is properly configured
2. Verify Firebase backend is accessible (if using dev/prod mode)
3. Check browser console for detailed error messages
4. Ensure document types and IDs are correct

## 📖 SDK Documentation

For complete SDK API documentation, see:
- [FN7 Frontend SDK Documentation](../fn7-sdk/frontend-sdk.md)

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Shows loading indicators during async operations
- **Error Handling**: Displays user-friendly error messages
- **JSON Formatting**: Pretty-prints JSON in results
- **Operation History**: Maintains history of all operations
- **Clean Interface**: Modern, card-based UI design

## 📝 Notes

- The SDK is loaded from CDN (`https://fn7.io/.fn7-sdk/frontend/latest/sdk.esm.js`)
- Firebase configuration is required - make sure `src/config/environment.js` is properly configured
- All Firebase operations make actual API calls to `/api/k8s/firebase/*` (if `apiBaseUrl` is set)
- The app handles cases where the backend is not available
- localStorage values persist across page refreshes
- Use "Reset localStorage" to clear all stored data

## 🔄 Expected Results

### Successful Operations

- **Get Data**: Returns document data as JSON
- **Create Data**: Returns created document with generated fields
- **Update Data**: Returns updated document with actual values
- **Delete Data**: Returns deletion confirmation
- **Search Data**: Returns array of matching documents
- **Get Token**: Returns Firebase token object

### Error Cases

- Invalid JSON format in data fields
- Missing required parameters (doc_type, doc_id)
- Network errors (backend not available)
- Authentication errors (invalid tokens)
- Document not found errors

All errors are displayed in the Results Display section with detailed error messages.
