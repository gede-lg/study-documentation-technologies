# 🎯 Introdução

**XSRF Protection (Cross-Site Request Forgery)** em Axios utiliza **token-based validation** via `xsrfCookieName` e `xsrfHeaderName` configuration options para automatically extract CSRF token de cookie e include em request header, protecting against malicious sites forging authenticated requests ao exploitar browser's automatic cookie transmission, ensuring requests originate de legitimate application pages não de attacker-controlled sites.

O problema fundamental que XSRF/CSRF attacks exploram é **automatic cookie transmission**: quando user está logged into `bank.com`, browser automatically sends session cookies com EVERY request para `bank.com`, mesmo quando request triggered por malicious site `evil.com`. Attacker cria forged request (`<form action="https://bank.com/transfer" method="POST">`) que executes quando victim visits `evil.com` enquanto authenticated em `bank.com`, transferring money sem user knowledge.

CSRF protection mechanism: server generates **unique token** para each user session, embeds em page/cookie, requires token em request headers/body. Legitimate requests de application pages include token (extracted de cookie/page), forged requests de attacker sites cannot access token (Same-Origin Policy previne reading cookies/DOM de different origin), server validates token presence/correctness, rejects requests sem valid token.

Axios CSRF configuration fundamentals: **xsrfCookieName** (default: 'XSRF-TOKEN') specifies cookie name containing CSRF token, **xsrfHeaderName** (default: 'X-XSRF-TOKEN') specifies header name onde Axios sends token, **automatic extraction**: Axios reads token de cookie automatically e adds to request header, **server validation**: backend validates header token matches session token.

CSRF token lifecycle: **Server generates** random token quando user authenticates, **stores** em session/database associado with user, **sends** token to client via cookie (`Set-Cookie: XSRF-TOKEN=abc123`) ou response body, **Client extracts** token de cookie (Axios automatic) ou manual extraction, **includes** em subsequent requests via header (`X-XSRF-TOKEN: abc123`), **Server validates** token em header matches stored token.

Critical patterns: **Cookie-to-header token** (Axios default - token em cookie automatically sent to header), **Double submit cookie** (token em cookie E header/body, server validates matching), **Synchronizer token** (token em server session, sent to client, included em requests), **SameSite cookie attribute** (modern alternative - `SameSite=Strict` previne cookie sending cross-site).

Common CSRF protection frameworks: **Express.js** via `csurf` middleware generating tokens, **Spring Boot** via `CsrfFilter` automatic protection, **Django** via `{% csrf_token %}` template tag e middleware, **Laravel** via `@csrf` directive, all seguem similar pattern: generate token → embed em page/cookie → validate em requests.

Axios integration patterns: **Configuration-based** (set xsrfCookieName/xsrfHeaderName matching backend), **Interceptor-based** (custom token extraction/injection logic), **Instance-specific** (different CSRF configs para different API endpoints), **Conditional CSRF** (apply CSRF protection only for state-changing methods - POST/PUT/DELETE).

Security considerations: **Token randomness** (cryptographically secure random tokens preventing guessing), **Token expiration** (tokens expire com session preventing reuse), **HTTPS requirement** (CSRF tokens transmitted over HTTPS preventing interception), **SameSite attribute** (modern browsers support SameSite=Strict/Lax reducing CSRF risk), **GET safety** (CSRF protection typically skipped para GET requests - should be idempotent).

CSRF vs XSS distinction: **CSRF** exploits automatic authentication (cookies sent automatically), não requires executing JavaScript em target site, prevented via token validation; **XSS** injects malicious scripts em target site, can read tokens/cookies de same-origin, prevented via input sanitization/Content Security Policy. XSS can bypass CSRF protection (JavaScript can read same-origin tokens).

Advanced patterns incluem: **SameSite cookies** reducing CSRF attack surface (`Set-Cookie: sessionId=abc; SameSite=Strict`), **Origin/Referer validation** (checking request Origin header matches expected domain), **Custom header requirement** (requiring custom header like `X-Requested-With: XMLHttpRequest` - attackers can't set via simple HTML forms), **Per-request tokens** (generating new token para each request instead of per-session).

Este módulo explora comprehensive XSRF protection: desde CSRF attack fundamentals (automatic cookie transmission exploitation), através de Axios CSRF configuration (xsrfCookieName/xsrfHeaderName automatic token handling), token lifecycle (generation, storage, extraction, validation), framework-specific implementations (Express, Spring Boot, Django), até advanced protection patterns (SameSite cookies, Origin validation, per-request tokens). Objetivo é fornecer complete understanding para securing applications contra CSRF attacks.

---

# 📋 Sumário

### **CSRF Attack Fundamentals**
- What is CSRF
- How attacks work
- Automatic cookie transmission
- Attack scenarios

### **Token-Based Protection**
- Token generation
- Token storage
- Token validation
- Token lifecycle

### **Axios CSRF Configuration**
- xsrfCookieName
- xsrfHeaderName
- Automatic extraction
- Manual configuration

### **Server-Side Implementation**
- Express.js (csurf)
- Spring Boot (CsrfFilter)
- Django (csrf middleware)
- Laravel (@csrf)

### **Token Patterns**
- Cookie-to-header
- Double submit
- Synchronizer token
- SameSite cookies

### **Security Best Practices**
- Token randomness
- Token expiration
- HTTPS requirement
- GET request safety

### **Advanced Protection**
- SameSite attribute
- Origin validation
- Custom headers
- Per-request tokens

### **CSRF vs XSS**
- Attack differences
- Protection differences
- XSS bypassing CSRF
- Defense-in-depth

---

# 🧠 Fundamentos

## CSRF Attack Fundamentals

### **What is CSRF**

**Cross-Site Request Forgery definition**:

Attack onde malicious site triggers authenticated request para target site sem user's knowledge, exploiting browser's automatic cookie transmission. Attacker cannot read response (Same-Origin Policy), mas can trigger state-changing actions (transfer money, change password, delete account).

### **How Attacks Work**

**Attack flow**:

```
1. User logs into bank.com
   → Browser stores session cookie: sessionId=abc123

2. User visits evil.com (while still logged into bank.com)

3. evil.com serves malicious HTML:
   <form action="https://bank.com/transfer" method="POST">
     <input type="hidden" name="to" value="attacker-account">
     <input type="hidden" name="amount" value="10000">
   </form>
   <script>document.forms[0].submit();</script>

4. Browser automatically submits form to bank.com
   → Includes session cookie: sessionId=abc123

5. bank.com receives authenticated request
   → Transfers $10,000 to attacker account
   → User unaware of action
```

### **Automatic Cookie Transmission**

**Browser behavior**:

```javascript
// User logged into bank.com
// Browser has cookie: sessionId=abc123 for bank.com

// Attacker site evil.com executes:
fetch('https://bank.com/transfer', {
  method: 'POST',
  credentials: 'include', // Browser sends cookies automatically
  body: JSON.stringify({
    to: 'attacker-account',
    amount: 10000
  })
});

// Browser automatically includes:
Cookie: sessionId=abc123

// bank.com sees authenticated request
// Cannot distinguish from legitimate request
```

**Why automatic transmission is dangerous**:

```javascript
// Legitimate request from bank.com page:
axios.post('/transfer', {
  to: 'friend-account',
  amount: 100
});
// Cookie: sessionId=abc123 (sent automatically)

// Forged request from evil.com:
fetch('https://bank.com/transfer', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ to: 'attacker-account', amount: 10000 })
});
// Cookie: sessionId=abc123 (ALSO sent automatically!)

// Server sees identical authentication - cannot tell them apart without CSRF token
```

### **Attack Scenarios**

**Scenario 1: Form-based attack**:

```html
<!-- evil.com page -->
<html>
  <body>
    <h1>You've won a prize! Click here to claim.</h1>
    
    <!-- Hidden form -->
    <form id="attack" action="https://bank.com/transfer" method="POST">
      <input type="hidden" name="to" value="attacker-account">
      <input type="hidden" name="amount" value="10000">
    </form>
    
    <script>
      // Auto-submit when user clicks anywhere
      document.addEventListener('click', () => {
        document.getElementById('attack').submit();
      });
    </script>
  </body>
</html>
```

**Scenario 2: Image-based GET attack**:

```html
<!-- evil.com page -->
<img src="https://bank.com/delete-account?confirm=yes">

<!-- Browser automatically sends GET request with cookies
     If delete-account endpoint uses GET (bad practice), account deleted -->
```

**Scenario 3: AJAX-based attack**:

```javascript
// evil.com JavaScript
fetch('https://bank.com/api/change-email', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ newEmail: 'attacker@evil.com' })
});

// User's email changed to attacker's email
// Attacker can now reset password via email
```

## Token-Based Protection

### **Token Generation**

**Server generates cryptographically secure token**:

```javascript
// Express.js
const crypto = require('crypto');

function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
  // Returns: "a3f8e9c2b1d4e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1"
}

// Store in session
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }
  next();
});
```

**Spring Boot automatic generation**:

```java
// Spring Security automatically generates CSRF token
// Accessible via: ${_csrf.token}

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf()
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
            // Stores token in cookie named XSRF-TOKEN
    }
}
```

### **Token Storage**

**Server-side storage options**:

```javascript
// 1. Session storage (most common)
req.session.csrfToken = generateCsrfToken();

// 2. Database storage
await db.csrfTokens.create({
  userId: req.user.id,
  token: generateCsrfToken(),
  expiresAt: Date.now() + 3600000 // 1 hour
});

// 3. Encrypted cookie
const encryptedToken = encrypt(csrfToken, SECRET_KEY);
res.cookie('csrf_token', encryptedToken);
```

**Client-side storage**:

```javascript
// Option 1: Cookie (Axios default)
// Server sets:
res.cookie('XSRF-TOKEN', csrfToken, {
  httpOnly: false, // Allow JavaScript access
  secure: true,    // HTTPS only
  sameSite: 'strict'
});

// Axios automatically reads from cookie

// Option 2: Response header/body
// Server sends:
res.json({
  data: userData,
  csrfToken: csrfToken
});

// Client stores in memory/localStorage
```

### **Token Validation**

**Server validation logic**:

```javascript
// Express middleware
function validateCsrfToken(req, res, next) {
  const headerToken = req.headers['x-xsrf-token'];
  const sessionToken = req.session.csrfToken;
  
  if (!headerToken) {
    return res.status(403).json({ error: 'Missing CSRF token' });
  }
  
  if (headerToken !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  next();
}

// Apply to state-changing routes
app.post('/transfer', validateCsrfToken, (req, res) => {
  // Process transfer
});

app.put('/update-profile', validateCsrfToken, (req, res) => {
  // Update profile
});

// Skip for GET (safe methods)
app.get('/users', (req, res) => {
  // No CSRF validation needed
});
```

### **Token Lifecycle**

**Complete lifecycle**:

```javascript
// 1. User logs in
POST /login
→ Server generates: csrfToken = "abc123..."
→ Stores in session: req.session.csrfToken = "abc123..."
→ Sends to client: Set-Cookie: XSRF-TOKEN=abc123...

// 2. Client makes request (Axios automatic)
POST /transfer
Headers:
  Cookie: sessionId=xyz789; XSRF-TOKEN=abc123...
  X-XSRF-TOKEN: abc123...  ← Axios extracts from cookie and adds to header

// 3. Server validates
→ Extracts header token: req.headers['x-xsrf-token'] = "abc123..."
→ Extracts session token: req.session.csrfToken = "abc123..."
→ Compares: "abc123..." === "abc123..." ✅
→ Processes request

// 4. Token expires/refreshes
→ Session expires: token invalid
→ User logs out: token cleared
→ New login: new token generated
```

## Axios CSRF Configuration

### **xsrfCookieName**

**Default configuration**:

```javascript
// Axios default
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';

// Axios looks for cookie named 'XSRF-TOKEN'
// Extracts token value automatically
```

**Custom cookie name**:

```javascript
// Server uses different cookie name
res.cookie('CSRF-TOKEN', csrfToken);

// Configure Axios to match
axios.defaults.xsrfCookieName = 'CSRF-TOKEN';

// Now Axios extracts token from 'CSRF-TOKEN' cookie
```

**Per-instance configuration**:

```javascript
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  xsrfCookieName: 'X-CSRF-TOKEN' // Custom name for this instance
});
```

### **xsrfHeaderName**

**Default header**:

```javascript
// Axios default
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Axios sends token in 'X-XSRF-TOKEN' header
```

**Custom header name**:

```javascript
// Server expects different header
const headerToken = req.headers['x-csrf-token'];

// Configure Axios to match
axios.defaults.xsrfHeaderName = 'X-CSRF-Token';

// Now Axios sends token in 'X-CSRF-Token' header
```

**Complete configuration**:

```javascript
axios.defaults.xsrfCookieName = 'csrf_token';  // Cookie name
axios.defaults.xsrfHeaderName = 'X-CSRF-Token'; // Header name

// Axios workflow:
// 1. Read token from 'csrf_token' cookie
// 2. Add token to 'X-CSRF-Token' header
// 3. Send request
```

### **Automatic Extraction**

**How Axios extracts tokens**:

```javascript
// Browser has cookie: XSRF-TOKEN=abc123

// When you make request:
axios.post('/transfer', { amount: 100 });

// Axios automatically:
// 1. Reads cookie: document.cookie → "XSRF-TOKEN=abc123"
// 2. Parses value: "abc123"
// 3. Adds header: X-XSRF-TOKEN: abc123

// Final request:
POST /transfer
Headers:
  Cookie: sessionId=xyz; XSRF-TOKEN=abc123
  X-XSRF-TOKEN: abc123  ← Added by Axios
  Content-Type: application/json
Body:
  { "amount": 100 }
```

**Automatic extraction conditions**:

```javascript
// Axios ONLY extracts token if:
// 1. Request is NOT cross-domain (same origin)
// 2. Cookie exists
// 3. Cookie is readable (httpOnly: false)

// Cross-domain requests skip CSRF (CORS protection instead)
axios.post('https://different-domain.com/api', data);
// No CSRF token added (different origin)

// Same-domain requests include CSRF
axios.post('/api/users', data);
// CSRF token added automatically
```

### **Manual Configuration**

**Disable automatic CSRF**:

```javascript
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  xsrfCookieName: null, // Disable automatic extraction
  xsrfHeaderName: null
});

// No CSRF token added
```

**Custom token extraction**:

```javascript
// Token not in cookie (e.g., in localStorage)
const csrfToken = localStorage.getItem('csrf_token');

// Add via interceptor
axios.interceptors.request.use(config => {
  config.headers['X-CSRF-Token'] = csrfToken;
  return config;
});

// Or per-request
axios.post('/transfer', data, {
  headers: {
    'X-CSRF-Token': csrfToken
  }
});
```

## Server-Side Implementation

### **Express.js (csurf)**

**Basic setup**:

```javascript
const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Send token to client
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Or set in cookie
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

// Protected routes
app.post('/transfer', (req, res) => {
  // csurf automatically validates token
  res.json({ success: true });
});
```

**Custom configuration**:

```javascript
const csrfProtection = csrf({
  cookie: {
    httpOnly: false, // Allow Axios to read
    secure: true,    // HTTPS only
    sameSite: 'strict'
  },
  value: (req) => {
    // Custom token extraction
    return req.headers['x-csrf-token'];
  }
});

app.use(csrfProtection);
```

### **Spring Boot (CsrfFilter)**

**Automatic protection**:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf()
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
            // Sets cookie: XSRF-TOKEN
            // httpOnly=false allows JavaScript access
    }
}
```

**Custom token endpoint**:

```java
@RestController
public class CsrfController {
    
    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token;
        // Returns: { "token": "abc123...", "headerName": "X-XSRF-TOKEN" }
    }
}
```

### **Django (csrf middleware)**

**Default protection**:

```python
# settings.py
MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',
    # ...
]

# Django automatically validates CSRF token
# Expects header: X-CSRFToken
```

**Template usage**:

```html
<!-- Django template -->
<form method="POST">
  {% csrf_token %}
  <!-- Renders: <input type="hidden" name="csrfmiddlewaretoken" value="abc123..."> -->
  <input type="text" name="amount">
  <button type="submit">Transfer</button>
</form>
```

**AJAX configuration**:

```python
# views.py
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def get_data(request):
    # Sets cookie: csrftoken
    return JsonResponse({'data': [...]})
```

```javascript
// Frontend
axios.defaults.xsrfCookieName = 'csrftoken';  // Django's cookie name
axios.defaults.xsrfHeaderName = 'X-CSRFToken'; // Django's header name

axios.post('/api/transfer', { amount: 100 });
// Axios extracts from 'csrftoken' cookie
// Sends in 'X-CSRFToken' header
```

### **Laravel (@csrf)**

**Blade directive**:

```html
<!-- Laravel Blade template -->
<form method="POST" action="/transfer">
  @csrf
  <!-- Renders: <input type="hidden" name="_token" value="abc123..."> -->
  <input type="text" name="amount">
  <button type="submit">Transfer</button>
</form>
```

**API token**:

```php
// routes/web.php
Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});
```

```javascript
// Frontend
const response = await axios.get('/csrf-token');
const csrfToken = response.data.csrfToken;

axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
```

## Token Patterns

### **Cookie-to-Header**

**Axios default pattern**:

```javascript
// Server sends token in cookie
res.cookie('XSRF-TOKEN', csrfToken, {
  httpOnly: false // Must be readable by JavaScript
});

// Axios automatically:
// 1. Reads from cookie
// 2. Sends in header

axios.post('/transfer', data);

// Request:
Cookie: XSRF-TOKEN=abc123
X-XSRF-TOKEN: abc123  ← Axios added this
```

**Why cookie-to-header works**:

```javascript
// Attacker cannot:
// 1. Read cookie from different origin (Same-Origin Policy)
// 2. Set custom headers in simple HTML forms
// 3. Access victim's cookies via JavaScript

// Only legitimate app can:
// 1. Read cookie (same origin)
// 2. Extract token
// 3. Add to header via Axios
```

### **Double Submit**

**Pattern**: Token em cookie AND header/body, server validates matching

```javascript
// Server sends token in cookie
res.cookie('csrf_token', csrfToken);

// Client sends SAME token in header
axios.post('/transfer', data, {
  headers: {
    'X-CSRF-Token': csrfToken // Same value as cookie
  }
});

// Server validates
const cookieToken = req.cookies.csrf_token;
const headerToken = req.headers['x-csrf-token'];

if (cookieToken !== headerToken) {
  return res.status(403).json({ error: 'CSRF token mismatch' });
}
```

### **Synchronizer Token**

**Pattern**: Token stored em server session, sent to client, included em requests

```javascript
// Server generates and stores
req.session.csrfToken = generateCsrfToken();

// Send to client
res.json({ csrfToken: req.session.csrfToken });

// Client includes in requests
axios.post('/transfer', data, {
  headers: {
    'X-CSRF-Token': csrfToken
  }
});

// Server validates against session
if (req.headers['x-csrf-token'] !== req.session.csrfToken) {
  return res.status(403).json({ error: 'Invalid CSRF token' });
}
```

### **SameSite Cookies**

**Modern CSRF mitigation**:

```javascript
// Server sets SameSite attribute
res.cookie('sessionId', sessionId, {
  sameSite: 'strict', // Cookie NOT sent on cross-site requests
  secure: true,
  httpOnly: true
});

// Behavior:
// ✅ User navigates within site → Cookie sent
// ✅ User clicks link from site → Cookie sent
// ❌ Attacker site makes request → Cookie NOT sent

// Reduces CSRF risk without tokens
```

**SameSite options**:

```javascript
// Strict: Never sent cross-site
sameSite: 'strict'

// Lax: Sent on top-level navigation (links), not on forms/AJAX
sameSite: 'lax'

// None: Always sent (requires secure: true)
sameSite: 'none', secure: true
```

## Security Best Practices

### **Token Randomness**

**Cryptographically secure generation**:

```javascript
// ✅ Good: crypto.randomBytes
const crypto = require('crypto');
const csrfToken = crypto.randomBytes(32).toString('hex');

// ❌ Bad: Math.random (predictable)
const csrfToken = Math.random().toString(36); // Don't use!

// ❌ Bad: timestamp (predictable)
const csrfToken = Date.now().toString(); // Don't use!
```

### **Token Expiration**

**Expire with session**:

```javascript
// Token tied to session
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }
  next();
});

// When session expires, token expires too
```

**Per-request tokens**:

```javascript
// Generate new token for each request
app.use((req, res, next) => {
  req.session.csrfToken = generateCsrfToken();
  res.cookie('XSRF-TOKEN', req.session.csrfToken);
  next();
});

// More secure but more overhead
```

### **HTTPS Requirement**

**Always use HTTPS for CSRF tokens**:

```javascript
// ✅ Secure cookie (HTTPS only)
res.cookie('XSRF-TOKEN', csrfToken, {
  secure: true, // Only sent over HTTPS
  httpOnly: false,
  sameSite: 'strict'
});

// ❌ Insecure (HTTP allows interception)
res.cookie('XSRF-TOKEN', csrfToken, {
  secure: false // Token can be intercepted
});
```

### **GET Request Safety**

**Skip CSRF for safe methods**:

```javascript
// CSRF protection only for state-changing methods
const csrfProtection = csrf({ cookie: true });

// Protected (POST/PUT/DELETE)
app.post('/transfer', csrfProtection, handler);
app.put('/update-profile', csrfProtection, handler);
app.delete('/delete-account', csrfProtection, handler);

// Not protected (GET - should be idempotent)
app.get('/users', handler);
app.get('/profile', handler);

// GET should NEVER change state
// ❌ Bad: app.get('/delete-account')
// ✅ Good: app.delete('/delete-account')
```

## Advanced Protection

### **SameSite Attribute**

**Combining SameSite + CSRF tokens**:

```javascript
// Defense-in-depth approach
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' // Prevents most CSRF
});

res.cookie('XSRF-TOKEN', csrfToken, {
  httpOnly: false, // Axios needs to read
  secure: true,
  sameSite: 'lax' // Additional CSRF protection
});

// Double protection:
// 1. SameSite prevents cross-site cookie sending
// 2. CSRF token validates request origin
```

### **Origin Validation**

**Validate request origin**:

```javascript
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = ['https://app.example.com', 'https://admin.example.com'];
  
  if (req.method !== 'GET' && !allowedOrigins.some(allowed => origin?.startsWith(allowed))) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  
  next();
});
```

### **Custom Headers**

**Require custom header**:

```javascript
// Require X-Requested-With header
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'Missing X-Requested-With header' });
  }
  next();
});

// Axios automatically sets for XHR requests
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
```

### **Per-Request Tokens**

**Generate new token each request**:

```javascript
// More secure but higher overhead
app.use((req, res, next) => {
  const newToken = generateCsrfToken();
  req.session.csrfToken = newToken;
  res.cookie('XSRF-TOKEN', newToken);
  next();
});

// Client must refresh token after each request
axios.interceptors.response.use(response => {
  // Token refreshed in cookie automatically
  return response;
});
```

## CSRF vs XSS

### **Attack Differences**

**CSRF**:
- Exploits automatic cookie transmission
- Cannot read responses (Same-Origin Policy)
- Can trigger actions (transfer money, change settings)
- Does NOT require executing JavaScript on target site

**XSS**:
- Injects malicious scripts into target site
- Can read cookies, tokens, DOM (same origin)
- Full access to application as victim
- Requires executing JavaScript on target site

### **Protection Differences**

**CSRF protection**:

```javascript
// Token-based validation
app.use(csrf({ cookie: true }));

// Tokens prevent forged requests
// Attacker cannot read token (different origin)
```

**XSS protection**:

```javascript
// Input sanitization
const sanitized = sanitizeHtml(userInput);

// Content Security Policy
res.setHeader('Content-Security-Policy', "default-src 'self'");

// HttpOnly cookies (prevent JavaScript access)
res.cookie('sessionId', sessionId, { httpOnly: true });
```

### **XSS Bypassing CSRF**

**XSS can bypass CSRF protection**:

```javascript
// Attacker injects XSS payload into target site
// Payload executes on target origin

// Malicious script can:
// 1. Read CSRF token (same origin)
const csrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)[1];

// 2. Make authenticated request with token
axios.post('/transfer', 
  { to: 'attacker', amount: 10000 },
  { headers: { 'X-XSRF-TOKEN': csrfToken } }
);

// CSRF protection bypassed because script executes on same origin
```

### **Defense-in-Depth**

**Layered security**:

```javascript
// Layer 1: CSRF tokens
app.use(csrf({ cookie: true }));

// Layer 2: Input sanitization (XSS prevention)
app.use((req, res, next) => {
  req.body = sanitize(req.body);
  next();
});

// Layer 3: Content Security Policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'");
  next();
});

// Layer 4: SameSite cookies
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});

// Layer 5: Origin validation
app.use(validateOrigin);
```

---

# 🎯 Aplicabilidade

## Quando Usar CSRF Protection

**Authenticated Applications**: Any app com user authentication.

**State-Changing Operations**: Transfers, updates, deletions.

**Cookie-Based Auth**: Applications using session cookies.

## Trade-offs

**Performance**: Token generation/validation adds overhead (minimal).

**Complexity**: Requires coordination between frontend/backend.

**Mobile Apps**: CSRF protection typically unnecessary (no automatic cookies).

---

# ⚠️ Limitações

## Same-Origin Attacks

CSRF tokens não protegem contra XSS (same-origin scripts can read tokens).

**Solution**: Input sanitization, Content Security Policy.

## GET Request Abuse

CSRF tokens typically skipped para GET requests.

**Solution**: Never use GET for state-changing operations.

---

# 🔗 Interconexões

## Authentication

CSRF protection essential para authenticated endpoints.

## XSS Prevention

Complementary to CSRF - both needed for complete security.

## SameSite Cookies

Modern alternative reducing CSRF attack surface.

---

# 🚀 Evolução

## Token-less CSRF Protection

SameSite cookies + Origin validation eliminating need for tokens.

## Double Submit Variations

Encrypted double-submit cookies preventing token fixation.

## Per-Request Tokens

Rotating tokens for maximum security.

---

**Conclusão Integrada**: XSRF protection em Axios utiliza token-based validation via automatic cookie-to-header pattern (**xsrfCookieName** extracting token de cookie, **xsrfHeaderName** sending em request header) protecting contra CSRF attacks que exploit browser's automatic cookie transmission enabling malicious sites forging authenticated requests sem user knowledge. **CSRF attack fundamentals**: browser automatically sends cookies to domain regardless de request origin (victim logged into bank.com, visits evil.com, evil.com submits form to bank.com, browser includes session cookie, bank.com sees authenticated request, executes action); Same-Origin Policy previne reading responses mas não previne sending requests. **Token-based protection**: server generates cryptographically secure random token, stores em session/database, sends to client via cookie (`Set-Cookie: XSRF-TOKEN=abc123`), client extracts token (Axios automatic de cookie), includes em requests via header (`X-XSRF-TOKEN: abc123`), server validates header token matches stored token. **Axios CSRF configuration**: **xsrfCookieName** (default 'XSRF-TOKEN') specifies cookie name para extraction, **xsrfHeaderName** (default 'X-XSRF-TOKEN') specifies header name para submission, **automatic extraction** only for same-origin requests (cross-domain skipped - CORS protection instead), **manual configuration** via interceptors quando token not em cookie (localStorage, response body). **Server-side implementations**: **Express csurf** middleware automatic validation requiring cookie-parser, **Spring Boot CsrfFilter** automatic protection via CookieCsrfTokenRepository.withHttpOnlyFalse(), **Django csrf middleware** expecting X-CSRFToken header com csrftoken cookie, **Laravel @csrf** directive generating _token hidden input. **Token patterns**: **cookie-to-header** (Axios default - token em cookie automatically sent to header, attacker cannot read cookie cross-origin ou set custom headers via forms), **double submit** (token em cookie AND header/body, server validates matching), **synchronizer token** (token stored em server session, sent to client, validated against session), **SameSite cookies** (modern alternative - `SameSite=Strict` preventing cookie sending cross-site). **Security best practices**: **token randomness** via crypto.randomBytes (never Math.random ou timestamps), **token expiration** tied to session lifecycle, **HTTPS requirement** (secure: true preventing interception), **GET safety** (CSRF protection only para POST/PUT/DELETE - GET should be idempotent). **Advanced protection**: **SameSite + CSRF tokens** (defense-in-depth - SameSite prevents most attacks, tokens validate origin), **Origin validation** (checking Origin/Referer headers matching allowed domains), **custom headers** requirement (X-Requested-With: XMLHttpRequest - attackers can't set via simple forms), **per-request tokens** (generating new token each request para maximum security). **CSRF vs XSS distinction**: CSRF exploits automatic authentication não requiring JavaScript execution on target (prevented via token validation), XSS injects scripts em target site reading cookies/tokens same-origin (prevented via sanitization/CSP), XSS can bypass CSRF (same-origin scripts read tokens), defense-in-depth combining both protections essential. Critical understanding: CSRF tokens protect against forged requests from malicious sites exploiting automatic cookie transmission; tokens work because attackers cannot read cookies cross-origin (Same-Origin Policy) nor set custom headers via simple HTML forms; Axios automates cookie-to-header pattern simplifying implementation; server must validate token presence/correctness rejecting requests sem valid token; SameSite cookies provide modern alternative/complement to token-based protection; XSS can bypass CSRF requiring additional protections (sanitization, CSP, HttpOnly cookies).