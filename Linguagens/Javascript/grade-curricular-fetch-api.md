# Fetch API - Grade Curricular Compacta

## Bloco 1: Fundamentos (6h)

### M1: Introdução e HTTP
- O que é Fetch API, vantagens, Promise-based
- HTTP: métodos (GET, POST, PUT, DELETE), status codes, headers
- Promises, async/await, error handling básico

## Bloco 2: Requisições e Configuração (8h)

### M2: Métodos HTTP
- GET: `fetch(url)`, response.json(), .text(), .blob()
- POST: `fetch(url, {method, headers, body})`
- PUT, PATCH, DELETE e suas diferenças
- Query parameters com URLSearchParams

### M3: Request/Response
- Request headers (Content-Type, Authorization, custom)
- Response object (ok, status, headers)
- Request options (mode, credentials, cache, redirect, signal)
- Parsing response body (json, text, blob, arrayBuffer)

## Bloco 3: Error Handling e Cancelamento (6h)

### M4: Errors
- Network errors vs HTTP errors (response.ok)
- Status code handling (4xx, 5xx)
- Custom error classes
- Try/catch com async/await

### M5: Timeout e Abort
- AbortController API e AbortSignal
- Timeout implementation
- Cancelling requests
- Cleanup patterns

## Bloco 4: Autenticação e Segurança (6h)

### M6: Authentication
- Basic Authentication (Base64, Authorization header)
- Bearer tokens e JWT
- Token storage e refresh
- Cookies com credentials option

### M7: CORS e Security
- CORS headers e preflight requests
- mode: 'cors' vs 'no-cors'
- XSS e CSRF prevention
- Content Security Policy

## Bloco 5: Upload/Download e Streams (6h)

### M8: Files
- FormData para file upload
- Multiple files e validation
- response.blob() para download
- URL.createObjectURL para downloads
- ReadableStream e chunks
- Progress tracking (manual implementation)

## Bloco 6: Padrões Avançados (8h)

### M9: Advanced Patterns
- Wrapper functions (interceptors manuais)
- Retry logic com exponential backoff
- Caching strategies (cache option, manual)
- Request deduplication
- Parallel requests (Promise.all, allSettled, race)

## Bloco 7: Testing e TypeScript (6h)

### M10: Testing
- Mocking fetch (jest.mock, fetch-mock, MSW)
- Testing error handling e loading states
- Browser DevTools debugging

### M11: TypeScript
- Typing fetch responses com generics
- Response<T> interfaces
- Type guards e assertions
- Type-safe API client

## Bloco 8: Framework Integration (6h)

### M12: React/Vue
- React: useEffect, custom hooks (useFetch), cleanup
- Vue: Composition API, composables
- React Query / SWR integration
- Loading e error states

## Bloco 9: Real-World e Projeto (8h)

### M13: Production Patterns
- RESTful CRUD operations
- GraphQL queries
- Pagination, filtering, sorting
- Error monitoring (Sentry)
- Performance optimization

### M14: Projeto Final
- API client completo com TypeScript
- Authentication (JWT)
- File upload/download
- Caching, retry, error handling
- Tests e deployment

---

## Resumo

**Total:** 14 módulos | 60 horas | 8 semanas

**Ordem de Estudo:**
1. Semana 1-2: Blocos 1-3 (Fundamentos, Requisições, Errors)
2. Semana 3: Blocos 4-5 (Auth, Upload/Download)
3. Semana 4: Blocos 6-7 (Patterns, Testing)
4. Semana 5: Bloco 8 (Frameworks)
5. Semana 6-8: Bloco 9 (Projeto Final)

**Pré-requisitos:**
- JavaScript ES6+ (Promises, async/await)
- HTTP protocol basics
- JSON format

**Recursos:**
- MDN Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- Fetch Standard: https://fetch.spec.whatwg.org/

**Projeto Final:** Sistema CRUD com autenticação JWT, upload de arquivos, caching, TypeScript e tests
