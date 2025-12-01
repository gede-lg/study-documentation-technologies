# 🎯 Introdução

**Error Monitoring com Sentry** em Axios envolve integrating error tracking platform (**automated error capture**, **stack traces**, **breadcrumbs**, **user context**, **release tracking**), capturing HTTP errors (4xx/5xx responses, network failures, timeouts), enriching error reports (request details, response data, user information), setting up alerts/notifications, analyzing error trends, debugging production issues, improving application reliability through proactive monitoring.

O problema fundamental de production errors: Applications fail em production de ways não anticipated during development; **errors occur silently** (users encounter issues mas developers unaware), **debugging is difficult** (no access to user's environment/state), **reproduction is challenging** (intermittent errors, specific user conditions), **impact is unknown** (how many users affected, severity, business impact), **resolution is slow** (discovering error → understanding context → reproducing → fixing → deploying takes days).

Error monitoring fundamentals: **Automatic capture** (errors reported to centralized platform without manual logging), **Rich context** (stack traces, request details, user information, device/browser data), **Aggregation** (grouping similar errors preventing noise), **Alerting** (notifications when errors occur or spike), **Prioritization** (identifying high-impact errors affecting many users), **Historical tracking** (trends over time, regression detection).

Sentry overview: **Error tracking platform** (cloud-hosted or self-hosted), **Multi-language support** (JavaScript, Python, Java, etc.), **Framework integrations** (React, Vue, Angular, Express), **Rich SDK** (automatic error capture, breadcrumbs, user context, releases), **Dashboard** (visualizing errors, trends, affected users), **Alerts** (email, Slack, PagerDuty when errors occur).

Sentry concepts:

**Events**: Individual error occurrences (each exception, HTTP error, or manual capture creates event).

**Issues**: Grouped events (similar errors aggregated into single issue for easier management).

**Breadcrumbs**: Trail of events leading to error (user actions, API calls, navigation helping understand context).

**Releases**: Versions of application (tracking which version introduced error, enabling version-specific filtering).

**Environments**: Development, staging, production (separating errors by environment).

**User context**: Identifying affected users (user ID, email, username helping prioritize/contact).

Axios integration: Axios responses/errors can be captured via **response interceptor** (catching HTTP errors 4xx/5xx), **request interceptor** (capturing request context as breadcrumbs), **manual capture** (`Sentry.captureException(error)` for specific errors), **automatic capture** (Sentry SDK catching unhandled errors globally).

Error enrichment: **Request details** (URL, method, headers, body), **Response details** (status, data, headers), **User context** (authenticated user information), **Custom tags** (environment, feature flags, A/B test variants), **Breadcrumbs** (sequence of API calls before error).

Benefits of error monitoring:

**Proactive detection**: Discover errors before users report them (automated alerts).

**Faster resolution**: Rich context (stack traces, breadcrumbs) enabling quick debugging without reproduction.

**Impact assessment**: Understand severity (how many users affected, error frequency).

**Trend analysis**: Identify regressions (new errors after deployment), improvement over time.

**User experience**: Fix issues affecting real users improving satisfaction/retention.

Sentry setup process:

1. **Create Sentry project** (sign up at sentry.io, create project for JavaScript).
2. **Install SDK** (`npm install @sentry/react` ou `@sentry/browser`).
3. **Initialize Sentry** (configure DSN, environment, release).
4. **Integrate Axios** (interceptors capturing errors/breadcrumbs).
5. **Deploy** (errors automatically reported to Sentry dashboard).

Common use cases:

**HTTP error tracking**: Capturing 4xx client errors (400 Bad Request, 401 Unauthorized, 404 Not Found) and 5xx server errors (500 Internal Server Error, 503 Service Unavailable).

**Network failure monitoring**: Tracking connection errors, timeouts, DNS failures.

**API deprecation tracking**: Monitoring usage of deprecated endpoints via custom tags.

**User impact analysis**: Identifying users affected by specific errors for proactive support.

**Performance monitoring**: Sentry Performance capturing slow API requests, transaction tracing.

Advanced features:

**Source maps**: Mapping minified production code to original source for readable stack traces.

**Release tracking**: Associating errors with specific releases/commits identifying regressions.

**Session replay**: Recording user sessions visualizing actions leading to error.

**Performance monitoring**: APM (Application Performance Monitoring) tracking slow requests/transactions.

**Custom integrations**: Slack notifications, JIRA ticket creation, PagerDuty alerts.

Challenges and considerations:

**Privacy**: Avoid capturing sensitive data (passwords, tokens, PII) em error reports.

**Volume**: High error rates consuming Sentry quota requiring filtering/sampling.

**Noise**: Too many errors overwhelming requiring prioritization/filtering.

**Alert fatigue**: Frequent notifications desensitizing team requiring threshold tuning.

**Cost**: Sentry pricing based on events/transactions requiring budget management.

Best practices incluem:

**Filter sensitive data**: Strip authentication tokens, passwords, credit cards before sending to Sentry.

**Set sampling rate**: Capture percentage of errors (e.g., 10%) para high-traffic apps reducing costs.

**Configure environments**: Separate development/staging/production errors for clarity.

**Tag errors**: Add custom tags (feature, user plan, A/B variant) enabling filtering/analysis.

**Set context**: Include user ID, email, subscription plan helping prioritize impactful errors.

**Configure alerts**: Notification rules for critical errors (spike, new issue, regression).

**Use releases**: Track deployments associating errors with versions identifying regressions quickly.

Este módulo explora comprehensive Sentry integration for Axios error monitoring: desde core concepts (Sentry fundamentals, events/issues/breadcrumbs), através de implementation techniques (SDK installation, Axios interceptor integration, error enrichment), até advanced topics (source maps, release tracking, performance monitoring, custom integrations). Objetivo é fornecer complete understanding para implementing production-grade error monitoring em Axios applications.

---

# 📋 Sumário

### **Error Monitoring Fundamentals**
- Why monitor errors
- Sentry overview
- Key concepts
- Benefits

### **Sentry Concepts**
- Events and Issues
- Breadcrumbs
- Releases
- Environments
- User context

### **Sentry Setup**
- Account creation
- SDK installation
- Configuration
- DSN setup

### **Axios Integration**
- Response interceptor
- Request interceptor
- Error capture
- Breadcrumbs

### **Error Enrichment**
- Request details
- Response details
- User context
- Custom tags

### **Advanced Features**
- Source maps
- Release tracking
- Performance monitoring
- Session replay

### **Privacy and Security**
- Filtering sensitive data
- beforeSend hook
- Data scrubbing
- Compliance

### **Production Best Practices**
- Sampling rate
- Environment separation
- Alert configuration
- Tag strategy

### **Debugging**
- Stack traces
- Breadcrumb analysis
- User sessions
- Replay

### **Integration Examples**
- React integration
- Vue integration
- Error boundaries
- Custom capture

---

# 🧠 Fundamentos

## Error Monitoring Fundamentals

### **Why Monitor Errors**

**Problem: Silent failures**:

```javascript
// Production: User encounters error
try {
  await axios.get('/api/users');
} catch (error) {
  // Error logged to console (invisible to developers)
  console.error(error);
  
  // User sees generic error message
  toast.error('Something went wrong');
  
  // Developer has NO IDEA error occurred
}
```

**Without monitoring**:
- ❌ Errors occur silently (developers unaware)
- ❌ Users frustrated (errors not fixed)
- ❌ Debugging difficult (no reproduction steps)
- ❌ Impact unknown (how many users affected?)

**With monitoring (Sentry)**:
- ✅ Automatic error capture (every error reported)
- ✅ Rich context (stack trace, request details, user info)
- ✅ Instant alerts (Slack notification when error occurs)
- ✅ Impact visible (10 users affected, 50 events)

### **Sentry Overview**

**Error tracking platform**:

```
User encounters error
       ↓
Sentry SDK captures error
       ↓
Error sent to Sentry servers
       ↓
Sentry dashboard displays error
       ↓
Alert sent to team (email/Slack)
       ↓
Developers debug and fix
```

**Key features**:
- Automatic error capture (unhandled exceptions, HTTP errors)
- Stack traces (line numbers, function calls)
- Breadcrumbs (events leading to error)
- User identification (who was affected)
- Release tracking (which version has error)
- Performance monitoring (slow requests)
- Alerts (email, Slack, PagerDuty)

### **Key Concepts**

**Events**: Individual error occurrences.

```javascript
// Each of these creates a separate event
axios.get('/users').catch(error => Sentry.captureException(error));
axios.get('/posts').catch(error => Sentry.captureException(error));
```

**Issues**: Grouped events (similar errors).

```
Issue: "Network Error: GET /users"
├── Event 1: User A at 10:00
├── Event 2: User B at 10:05
└── Event 3: User C at 10:10
(3 events grouped into 1 issue)
```

**Breadcrumbs**: Trail of events before error.

```
Breadcrumb 1: User clicked "Load Users" button
Breadcrumb 2: Sent GET /users
Breadcrumb 3: Received 500 error
Breadcrumb 4: Error thrown
```

**Releases**: Application versions.

```javascript
Sentry.init({
  release: 'my-app@1.2.3'
});

// Errors tagged with release version
// "Error first seen in version 1.2.3"
```

**Environments**: Dev/staging/production.

```javascript
Sentry.init({
  environment: process.env.NODE_ENV // 'production'
});

// Filter errors by environment in dashboard
```

**User context**: Identifying users.

```javascript
Sentry.setUser({
  id: '123',
  email: 'john@example.com',
  username: 'john'
});

// Errors show which user was affected
```

### **Benefits**

**Proactive detection**:

```
Traditional: User reports bug → Developer investigates → Reproduces → Fixes (days)

With Sentry: Error occurs → Alert sent → Developer sees context → Fixes (hours)
```

**Faster resolution**:

```javascript
// Sentry provides:
// - Stack trace: Error at UserList.jsx:42
// - Breadcrumbs: User clicked "Load More" → GET /users?page=5 → 500 error
// - Request: GET /users?page=5&limit=10
// - Response: { "error": "Database connection failed" }
// - User: john@example.com (user ID 123)

// Developer immediately knows:
// - What happened (database connection failed)
// - Where (UserList.jsx:42)
// - How (user clicked Load More on page 5)
// - Who (user 123)

// Fix deployed in hours instead of days
```

## Sentry Concepts

### **Events and Issues**

**Event**: Single error occurrence.

```javascript
// Event structure
{
  "event_id": "abc123",
  "timestamp": "2025-11-17T10:00:00Z",
  "level": "error",
  "message": "Network Error",
  "exception": {
    "type": "Error",
    "value": "Request failed with status code 500",
    "stacktrace": [...]
  },
  "user": {
    "id": "123",
    "email": "john@example.com"
  },
  "request": {
    "url": "https://api.example.com/users",
    "method": "GET"
  }
}
```

**Issue**: Grouped events.

```
Issue #42: "AxiosError: Request failed with status code 500"
├── First seen: Nov 17, 10:00
├── Last seen: Nov 17, 14:30
├── Events: 47
├── Users affected: 12
└── Environments: production
```

**Grouping logic**: Sentry groups events by exception type/message/stack trace.

### **Breadcrumbs**

**Trail of events**:

```javascript
// Breadcrumbs automatically captured
1. User clicked button (DOM event)
2. Sent POST /login (HTTP request)
3. Received response (HTTP response)
4. Navigated to /dashboard (Navigation)
5. Sent GET /users (HTTP request)
6. Error occurred (Exception)

// Helps understand context leading to error
```

**Custom breadcrumbs**:

```javascript
Sentry.addBreadcrumb({
  category: 'user-action',
  message: 'User filtered by role: admin',
  level: 'info'
});

Sentry.addBreadcrumb({
  category: 'api',
  message: 'Fetching users with filters',
  level: 'info',
  data: { page: 1, limit: 10, role: 'admin' }
});
```

### **Releases**

**Version tracking**:

```javascript
// Initialize with release
Sentry.init({
  dsn: 'https://...',
  release: 'my-app@1.2.3'
});

// Sentry shows:
// "Error introduced in version 1.2.3"
// "Regression: Error returned after being resolved in 1.2.2"
```

**Git integration**:

```javascript
// Automatically use Git commit SHA
Sentry.init({
  release: process.env.REACT_APP_GIT_SHA
});

// package.json script
"build": "REACT_APP_GIT_SHA=$(git rev-parse HEAD) react-scripts build"
```

### **Environments**

**Separating contexts**:

```javascript
// Development
Sentry.init({
  dsn: 'https://...',
  environment: 'development'
});

// Staging
Sentry.init({
  environment: 'staging'
});

// Production
Sentry.init({
  environment: 'production'
});

// Dashboard: Filter by environment
// "Show only production errors"
```

### **User Context**

**Identifying affected users**:

```javascript
// After login
async function login(credentials) {
  const response = await axios.post('/auth/login', credentials);
  const user = response.data.user;
  
  // Set user context
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
    subscription: user.subscription // Custom field
  });
}

// After logout
function logout() {
  Sentry.setUser(null);
}

// Errors now show affected user
// "john@example.com (ID: 123) encountered error"
```

## Sentry Setup

### **Account Creation**

**Steps**:

1. Sign up at https://sentry.io
2. Create organization
3. Create project (select JavaScript/React)
4. Copy DSN (Data Source Name)

**DSN format**:

```
https://abc123@o123456.ingest.sentry.io/7890123
         ↑              ↑                    ↑
       Public Key    Organization ID    Project ID
```

### **SDK Installation**

**React**:

```bash
npm install @sentry/react
```

**Vue**:

```bash
npm install @sentry/vue
```

**Vanilla JavaScript**:

```bash
npm install @sentry/browser
```

### **Configuration**

**React example**:

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import App from './App';

// Initialize Sentry
Sentry.init({
  dsn: 'https://abc123@o123456.ingest.sentry.io/7890123',
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Percentage of errors to capture (100% = all errors)
  sampleRate: 1.0,
  
  // Capture breadcrumbs
  integrations: [
    new Sentry.BrowserTracing()
  ],
  
  // Performance monitoring (optional)
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Filter sensitive data
  beforeSend(event, hint) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
      delete event.request.headers['Cookie'];
    }
    return event;
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
```

**Vue example**:

```javascript
// main.js
import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import App from './App.vue';

Sentry.init({
  Vue,
  dsn: 'https://abc123@o123456.ingest.sentry.io/7890123',
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing()
  ],
  tracesSampleRate: 0.1
});

new Vue({
  render: h => h(App)
}).$mount('#app');
```

## Axios Integration

### **Response Interceptor**

**Capturing HTTP errors**:

```javascript
import axios from 'axios';
import * as Sentry from '@sentry/browser';

const client = axios.create({
  baseURL: 'https://api.example.com'
});

// Response interceptor
client.interceptors.response.use(
  response => response,
  error => {
    // Capture HTTP errors (4xx, 5xx)
    if (error.response) {
      Sentry.captureException(error, {
        contexts: {
          axios: {
            url: error.config.url,
            method: error.config.method,
            status: error.response.status,
            statusText: error.response.statusText
          }
        },
        tags: {
          http_status: error.response.status,
          endpoint: error.config.url
        },
        extra: {
          request: {
            url: error.config.url,
            method: error.config.method,
            headers: error.config.headers,
            data: error.config.data
          },
          response: {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          }
        }
      });
    }
    
    // Network error (no response)
    if (error.request && !error.response) {
      Sentry.captureException(error, {
        tags: {
          error_type: 'network_error',
          endpoint: error.config.url
        }
      });
    }
    
    return Promise.reject(error);
  }
);

export default client;
```

### **Request Interceptor**

**Adding breadcrumbs**:

```javascript
client.interceptors.request.use(
  config => {
    // Add breadcrumb for each request
    Sentry.addBreadcrumb({
      category: 'axios',
      message: `${config.method.toUpperCase()} ${config.url}`,
      level: 'info',
      data: {
        url: config.url,
        method: config.method,
        params: config.params
      }
    });
    
    return config;
  },
  error => {
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);
```

### **Error Capture**

**Manual capture**:

```javascript
async function loadUsers() {
  try {
    const response = await axios.get('/users');
    return response.data;
  } catch (error) {
    // Manually capture with extra context
    Sentry.captureException(error, {
      tags: {
        feature: 'user-list',
        action: 'load-users'
      },
      contexts: {
        user_action: {
          attempted: 'Loading user list',
          filters: { status: 'active' }
        }
      }
    });
    
    throw error;
  }
}
```

### **Breadcrumbs**

**Tracking user flow**:

```javascript
// User actions
function handleFilterChange(filter) {
  Sentry.addBreadcrumb({
    category: 'ui',
    message: `User changed filter to: ${filter}`,
    level: 'info',
    data: { filter }
  });
  
  setFilter(filter);
}

// API calls
async function fetchUsers(filters) {
  Sentry.addBreadcrumb({
    category: 'api',
    message: 'Fetching users',
    level: 'info',
    data: { filters }
  });
  
  const response = await axios.get('/users', { params: filters });
  
  Sentry.addBreadcrumb({
    category: 'api',
    message: `Fetched ${response.data.length} users`,
    level: 'info'
  });
  
  return response.data;
}
```

## Error Enrichment

### **Request Details**

**Capturing request context**:

```javascript
client.interceptors.response.use(
  response => response,
  error => {
    Sentry.captureException(error, {
      extra: {
        request: {
          url: error.config.url,
          method: error.config.method,
          baseURL: error.config.baseURL,
          headers: sanitizeHeaders(error.config.headers),
          params: error.config.params,
          data: sanitizeData(error.config.data)
        }
      }
    });
    
    return Promise.reject(error);
  }
);

function sanitizeHeaders(headers) {
  const sanitized = { ...headers };
  delete sanitized['Authorization']; // Remove token
  delete sanitized['Cookie'];
  return sanitized;
}

function sanitizeData(data) {
  if (!data) return null;
  
  const sanitized = { ...data };
  delete sanitized.password;
  delete sanitized.creditCard;
  return sanitized;
}
```

### **Response Details**

**Capturing response data**:

```javascript
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      Sentry.captureException(error, {
        extra: {
          response: {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: error.response.data
          }
        },
        tags: {
          http_status: error.response.status,
          http_method: error.config.method
        }
      });
    }
    
    return Promise.reject(error);
  }
);
```

### **User Context**

**Identifying affected users**:

```javascript
// After authentication
async function login(credentials) {
  const response = await axios.post('/auth/login', credentials);
  const user = response.data.user;
  
  // Set Sentry user context
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
    subscription: user.subscription, // Custom field
    role: user.role
  });
  
  return user;
}

// Clear on logout
function logout() {
  Sentry.setUser(null);
  axios.post('/auth/logout');
}
```

### **Custom Tags**

**Filtering and grouping**:

```javascript
// Set global tags
Sentry.setTag('feature', 'user-management');
Sentry.setTag('ab_test_variant', 'B');

// Event-specific tags
Sentry.captureException(error, {
  tags: {
    endpoint: '/users',
    http_method: 'GET',
    user_role: 'admin',
    feature_flag: 'new_ui_enabled'
  }
});

// Dashboard: Filter by tag
// "Show errors where feature = user-management"
// "Show errors where http_status = 500"
```

## Advanced Features

### **Source Maps**

**Readable stack traces**:

```javascript
// Production build minifies code
// Stack trace shows: main.a3f8e9.js:1:4532

// With source maps:
// Stack trace shows: UserList.jsx:42

// Setup (Create React App automatic)
// Manual setup:
Sentry.init({
  dsn: 'https://...',
  integrations: [
    new Sentry.Integrations.RewriteFrames({
      iteratee: frame => {
        frame.filename = frame.filename.replace(
          window.location.origin,
          'app://'
        );
        return frame;
      }
    })
  ]
});

// Upload source maps to Sentry
// sentry-cli releases files my-app@1.2.3 upload-sourcemaps ./build
```

### **Release Tracking**

**Associating errors with versions**:

```javascript
// package.json
{
  "version": "1.2.3",
  "scripts": {
    "build": "react-scripts build && npm run sentry:release",
    "sentry:release": "sentry-cli releases new $npm_package_version && sentry-cli releases files $npm_package_version upload-sourcemaps ./build && sentry-cli releases finalize $npm_package_version"
  }
}

// Sentry init
Sentry.init({
  release: process.env.REACT_APP_VERSION // '1.2.3'
});

// Dashboard shows:
// "Error introduced in version 1.2.3"
// "50 errors in version 1.2.3, 0 errors in 1.2.2"
```

### **Performance Monitoring**

**Tracking slow requests**:

```javascript
Sentry.init({
  dsn: 'https://...',
  tracesSampleRate: 0.1, // 10% of transactions
  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: ['api.example.com']
    })
  ]
});

// Automatic transaction tracking
axios.get('/users'); // Tracked as transaction

// Manual transaction
const transaction = Sentry.startTransaction({
  name: 'Load User List',
  op: 'page-load'
});

const span = transaction.startChild({
  op: 'http',
  description: 'GET /users'
});

await axios.get('/users');
span.finish();
transaction.finish();

// Dashboard shows:
// "GET /users: avg 250ms, p95 500ms"
```

### **Session Replay**

**Recording user sessions**:

```javascript
Sentry.init({
  dsn: 'https://...',
  integrations: [
    new Sentry.Replay({
      maskAllText: true, // Privacy
      blockAllMedia: true
    })
  ],
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0  // 100% when error occurs
});

// Dashboard: Watch replay of user session leading to error
// See exactly what user did before error occurred
```

## Privacy and Security

### **Filtering Sensitive Data**

**beforeSend hook**:

```javascript
Sentry.init({
  dsn: 'https://...',
  beforeSend(event, hint) {
    // Remove Authorization header
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
      delete event.request.headers['Cookie'];
    }
    
    // Remove password from request data
    if (event.extra?.request?.data) {
      const data = event.extra.request.data;
      if (data.password) delete data.password;
      if (data.creditCard) delete data.creditCard;
      if (data.ssn) delete data.ssn;
    }
    
    // Remove sensitive response data
    if (event.extra?.response?.data) {
      const data = event.extra.response.data;
      if (data.token) delete data.token;
      if (data.apiKey) delete data.apiKey;
    }
    
    return event;
  }
});
```

### **Data Scrubbing**

**Automatic PII removal**:

```javascript
Sentry.init({
  dsn: 'https://...',
  
  // Built-in data scrubbing
  beforeSend(event) {
    // Scrub email addresses
    if (event.message) {
      event.message = event.message.replace(
        /[\w.-]+@[\w.-]+\.\w+/g,
        '[email]'
      );
    }
    
    // Scrub credit card numbers
    if (event.extra?.request?.data) {
      const data = JSON.stringify(event.extra.request.data);
      event.extra.request.data = JSON.parse(
        data.replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '[card]')
      );
    }
    
    return event;
  }
});
```

## Production Best Practices

### **Sampling Rate**

**Control event volume**:

```javascript
Sentry.init({
  dsn: 'https://...',
  
  // Error sampling (100% = all errors)
  sampleRate: 1.0,
  
  // Performance sampling (10% = 1 in 10 transactions)
  tracesSampleRate: 0.1,
  
  // Conditional sampling
  beforeSend(event, hint) {
    // Sample 10% of 404 errors
    if (event.extra?.response?.status === 404) {
      if (Math.random() > 0.1) {
        return null; // Drop event
      }
    }
    
    return event;
  }
});
```

### **Environment Separation**

**Filter by environment**:

```javascript
Sentry.init({
  dsn: 'https://...',
  environment: process.env.NODE_ENV,
  
  // Disable in development
  enabled: process.env.NODE_ENV === 'production'
});

// Dashboard: Filter "environment = production"
```

### **Alert Configuration**

**Sentry dashboard**:

```
Settings → Alerts → New Alert Rule

Conditions:
- When: Issue is first seen
- Filter: environment = production
- Filter: level = error

Actions:
- Send notification to: #alerts Slack channel
- Send email to: team@example.com
```

### **Tag Strategy**

**Organized tagging**:

```javascript
// Global tags
Sentry.setTag('app_version', '1.2.3');
Sentry.setTag('region', 'us-east-1');

// Feature tags
Sentry.setTag('feature', 'user-management');

// User tags
Sentry.setTag('user_role', 'admin');
Sentry.setTag('subscription', 'premium');

// Request tags
Sentry.captureException(error, {
  tags: {
    http_status: 500,
    endpoint: '/users',
    method: 'GET'
  }
});

// Dashboard: Filter by any tag
```

---

# 🎯 Aplicabilidade

## When to Use Sentry

**Production applications**: Any user-facing app requiring reliability monitoring.

**Critical systems**: E-commerce, healthcare, finance where errors impact business.

**Large-scale apps**: High-traffic applications with many users where manual error tracking impossible.

**Remote teams**: Distributed teams needing centralized error visibility.

## Integration Strategy

**Start simple**: Basic setup capturing unhandled errors.

**Add context**: Axios interceptors, user identification, custom tags.

**Enrich gradually**: Breadcrumbs, releases, performance monitoring.

**Optimize**: Sampling, filtering, alert tuning based on volume/needs.

---

# ⚠️ Limitações

## Privacy Concerns

Sentry receives all error data potentially including sensitive information.

**Solution**: `beforeSend` hook filtering passwords/tokens/PII, data scrubbing, compliance review.

## Cost

Sentry pricing based on events/transactions; high-traffic apps can be expensive.

**Solution**: Sampling rate reducing volume, filtering noisy errors, budget monitoring.

## Alert Fatigue

Too many alerts desensitizing team.

**Solution**: Threshold tuning (alert when >10 errors/minute), prioritization (critical errors only), Slack threading.

---

# 🔗 Interconexões

## Error Handling

Sentry complements Axios error handling (M4-response-error) providing visibility.

## Authentication

User context integration (M8-authentication) identifying affected users.

## Performance

Sentry Performance monitoring slow Axios requests (M10-performance APM alternative).

---

# 🚀 Evolução

## AI-Powered Insights

Sentry AI suggesting fixes, identifying root causes automatically.

## Proactive Monitoring

Anomaly detection identifying issues before widespread impact.

## Integration Ecosystem

Deeper integrations: GitHub auto-fixing, Jira ticket creation, PagerDuty escalation.

---

**Conclusão Integrada**: Error monitoring via Sentry essential para production Axios applications providing proactive error detection and rapid resolution: **fundamentals** (automatic error capture reporting exceptions/HTTP errors to centralized platform, rich context including stack traces/request details/user information/breadcrumbs, aggregation grouping similar errors preventing noise, alerting notifications via email/Slack when errors occur/spike, prioritization identifying high-impact errors affecting many users, historical tracking trends/regressions over time), **Sentry concepts** (events individual error occurrences cada exception/HTTP error creating event, issues grouped events similar errors aggregated for easier management, breadcrumbs trail of events leading to error user-actions/API-calls helping understand context, releases tracking application versions associating errors with deployments identifying regressions, environments separating dev/staging/production errors for clarity, user context identifying affected users via ID/email prioritizing/contacting), **setup** (account creation at sentry.io creating project copying DSN, SDK installation `@sentry/react` or `@sentry/browser`, configuration initializing with DSN/environment/release/sampleRate/integrations, beforeSend hook filtering sensitive data passwords/tokens), **Axios integration** (response interceptor capturing HTTP errors 4xx/5xx with `Sentry.captureException(error)` enriching with request/response details, request interceptor adding breadcrumbs for each request tracking API call sequence, manual capture via `captureException` for specific errors with custom tags/contexts, automatic capture via Sentry SDK catching unhandled errors globally), **error enrichment** (request details URL/method/headers/params/data sanitizing sensitive fields, response details status/statusText/data/headers, user context via `Sentry.setUser({ id, email })` after authentication cleared on logout, custom tags feature/endpoint/http_status enabling filtering/grouping em dashboard), **advanced features** (source maps mapping minified code to original source readable stack traces via sentry-cli upload-sourcemaps, release tracking associating errors with versions `release: '1.2.3'` identifying regressions "error introduced em 1.2.3", performance monitoring via `tracesSampleRate` tracking slow requests APM, session replay recording user sessions visualizing actions leading to error), **privacy** (filtering sensitive data via beforeSend hook removing Authorization/password/creditCard, data scrubbing automatic PII removal emails/cards, compliance ensuring GDPR/privacy requirements met), **production best practices** (sampling rate controlling volume `sampleRate: 1.0` errors `tracesSampleRate: 0.1` transactions reducing costs, environment separation `environment: production` filtering dashboard, alert configuration rules for critical errors spike/new-issue/regression sending Slack/email, tag strategy organized tagging feature/user_role/http_status enabling analysis). Axios interceptor integration critical: response interceptor catching HTTP errors automatically `error.response.status` capturing 4xx client errors (400 Bad Request, 401 Unauthorized, 404 Not Found) and 5xx server errors (500 Internal Server Error, 503 Service Unavailable) enriching with axios context (config.url, config.method, response.data), request interceptor adding breadcrumbs tracking request sequence understanding flow before error occurred. Error enrichment providing debugging context: request details (URL https://api.example.com/users, method GET, params page=5, data filters) helping reproduce, response details (status 500, data error-message) understanding failure, user context (ID 123, email john@example.com) prioritizing high-value users, custom tags (feature user-list, endpoint /users, http_status 500) enabling dashboard filtering "show all 500 errors em user-list feature". Benefits transformative: proactive detection discovering errors before user reports automated alerts Slack notification, faster resolution rich context (stack traces, breadcrumbs, request/response) enabling quick debugging without reproduction hours instead days, impact assessment understanding severity (47 events, 12 users affected) prioritizing fixes, trend analysis identifying regressions (new errors after deployment 1.2.3) improvement over time. Common challenges: privacy avoiding capturing sensitive data (passwords, tokens, PII) solution beforeSend filtering, volume high error rates consuming quota solution sampling/filtering, noise too many errors overwhelming solution prioritization, alert fatigue frequent notifications desensitizing solution threshold tuning, cost Sentry pricing based events/transactions solution budget management sampling. Critical understanding: error monitoring não replacing proper error handling complementing via visibility, Sentry SDK automatic capture unhandled errors mas Axios interceptors needed for HTTP errors enrichment, beforeSend hook essential filtering sensitive data preventing privacy violations, sampling rate balancing visibility with cost high-traffic apps requiring lower rates, user context critical identifying affected users enabling proactive support prioritization, releases tracking deployments associating errors with versions identifying regressions quickly "error first seen em 1.2.3", breadcrumbs providing context trail user-actions/API-calls helping reproduce understanding what led to error, tags enabling organization filtering dashboard "show errors where http_status=500 AND feature=user-list".