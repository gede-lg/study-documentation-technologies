# Axios - Grade Curricular Compacta

## Bloco 1: Fundamentos (6h)

### M1: Introdução e HTTP
- O que é Axios, vantagens sobre Fetch
- HTTP: métodos, status codes, headers
- Promises, async/await
- Instalação e configuração inicial

## Bloco 2: Requisições Básicas (6h)

### M2: Métodos HTTP
- GET: `axios.get(url)`, response.data
- POST: `axios.post(url, data)`
- PUT, PATCH, DELETE
- Shorthand methods vs axios(config)

### M3: Configuração
- Request config (url, method, headers, data, params)
- Default config: `axios.defaults`
- Axios instances com `axios.create()`
- Per-request overrides

## Bloco 3: Response e Error Handling (6h)

### M4: Response/Error
- Response schema (data, status, headers, config)
- Error handling (error.response, error.request, error.message)
- validateStatus option
- HTTP error vs network error

## Bloco 4: Interceptors (8h)

### M5: Request/Response Interceptors
- Request interceptors (auth, logging, modification)
- Response interceptors (data transformation, error handling)
- Interceptor patterns (chaining, conditional, async)
- Error recovery em interceptors

## Bloco 5: Cancelamento (4h)

### M6: Cancellation
- AbortController (recomendado)
- CancelToken (deprecated)
- Timeout config
- Cleanup patterns

## Bloco 6: Transformação (4h)

### M7: Data Transformation
- Request transformation (transformRequest)
- Response transformation (transformResponse)
- JSON serialization automática
- Custom transformers

## Bloco 7: Autenticação (6h)

### M8: Authentication
- Basic Auth (auth config)
- Bearer Token (Authorization header)
- OAuth 2.0 flow
- Token refresh com interceptors

## Bloco 8: Upload/Download (6h)

### M9: Files
- File upload com FormData
- Download files (responseType: 'blob')
- Progress tracking (onUploadProgress, onDownloadProgress)
- Multipart form data

## Bloco 9: Concorrência (6h)

### M10: Performance
- Parallel requests (Promise.all)
- Request batching
- axios.all() e axios.spread() (deprecated)
- Caching strategies

## Bloco 10: Error Recovery (6h)

### M11: Resilience
- Retry logic com interceptors
- Exponential backoff
- Fallback strategies
- Network detection

## Bloco 11: Testing (6h)

### M12: Testing
- Mocking Axios (axios-mock-adapter, jest.mock)
- MSW (Mock Service Worker)
- Testing interceptors
- Testing error scenarios

## Bloco 12: TypeScript (6h)

### M13: TypeScript
- Type-safe Axios: `axios.get<T>()`
- Typing request/response
- Custom types e interfaces
- Generic API client

## Bloco 13: Framework Integration (6h)

### M14: React/Vue/Node
- React: custom hooks (useAxios)
- Vue: composables
- Node.js/Express integration
- React Query com Axios

## Bloco 14: Segurança (4h)

### M15: Security
- CORS handling
- XSRF protection (xsrfCookieName, xsrfHeaderName)
- XSS e CSRF prevention
- Secure token storage

## Bloco 15: Real-World e Projeto (8h)

### M16: Production Patterns
- RESTful API client
- GraphQL com Axios
- Pagination, filtering, sorting
- Error monitoring (Sentry)

### M17: Projeto Final
- E-commerce API client TypeScript
- JWT + refresh token
- File upload com progress
- Advanced caching
- Retry + exponential backoff
- Interceptors completos
- 80%+ test coverage
- Production deployment

---

## Resumo

**Total:** 17 módulos | 84 horas | 10 semanas

**Ordem de Estudo:**
1. Semana 1-2: Blocos 1-3 (Fundamentos, Requisições, Response/Error)
2. Semana 3: Bloco 4 (Interceptors - feature chave)
3. Semana 4: Blocos 5-7 (Cancelamento, Transformação, Auth)
4. Semana 5: Blocos 8-9 (Upload/Download, Concorrência)
5. Semana 6: Blocos 10-11 (Error Recovery, Testing)
6. Semana 7: Blocos 12-14 (TypeScript, Frameworks, Security)
7. Semana 8-10: Bloco 15 (Projeto Final)

**Pré-requisitos:**
- JavaScript ES6+ (Promises, async/await)
- HTTP protocol basics
- npm/yarn

**Vantagens sobre Fetch:**
- Interceptors nativos
- Automatic JSON parsing
- XSRF protection
- Progress tracking
- Timeout support
- Browser + Node.js
- Request cancellation
- Better error handling

**Recursos:**
- Axios Docs: https://axios-http.com/
- GitHub: https://github.com/axios/axios

**Projeto Final:** E-commerce API client com auth completo, upload com progress, caching avançado, retry logic, interceptors, TypeScript, tests, monitoring e deploy
