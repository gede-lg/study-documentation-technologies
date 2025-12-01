# Grade Curricular - React Router DOM (Completa e Estruturada)

**Objetivo**: Dominar React Router DOM desde fundamentos até padrões avançados de roteamento, navegação programática, proteção de rotas e otimização.

**Carga Horária Total**: ~50 horas

**Proporção**: 90% teoria + 10% código (foco em conceitos profundos)

---

## Bloco 1: Fundamentos de Roteamento (8h)

### M1: Introdução ao Roteamento
- O que é roteamento SPA (Single Page Application)
- Client-side routing vs Server-side routing
- História do roteamento no React (antes e depois do Router)
- Problemas que o React Router resolve
- Alternativas (Reach Router, TanStack Router, wouter)

### M2: Conceitos Core
- BrowserRouter vs HashRouter vs MemoryRouter
- Routes e Route components
- URL anatomy (pathname, search, hash, state)
- Matching algorithm (ordem, exatidão, prioridade)
- Nested routing mental model

### M3: Setup e Instalação
- Versões do React Router (v5 vs v6 breaking changes)
- Instalação e dependências
- Provider setup (BrowserRouter wrapper)
- Configuração base do projeto
- TypeScript integration

### M4: Navegação Básica
- Link vs NavLink
- Navigate component (redirects)
- a tag vs Link (diferenças críticas)
- href vs to (comportamento)
- Prevenindo navegação padrão

---

## Bloco 2: Rotas e Matching (10h)

### M5: Definição de Rotas
- Route component anatomy
- path prop patterns
- element vs component (v6 changes)
- index routes
- Rotas 404 (catch-all routes)

### M6: Path Patterns
- Static paths (/about, /contact)
- Dynamic segments (/:id, /:userId)
- Optional segments (/:lang?)
- Wildcard routes (*, /*)
- Splat routes (/docs/*)

### M7: Route Matching
- Algoritmo de matching (ranked routing)
- Ordem de prioridade
- Especificidade vs ordem de declaração
- Múltiplas rotas simultâneas
- caseSensitive option

### M8: Nested Routes
- Outlet component
- Parent-child routing
- Relative paths vs absolute paths
- Index routes em nested routing
- Layout routes (rotas sem path)

---

## Bloco 3: Navegação Programática (8h)

### M9: useNavigate Hook
- Sintaxe e API
- Navegação imperativa
- Argumentos (to, options)
- replace vs push (history stack)
- Navegação com state

### M10: Navigation Options
- state (passar dados entre rotas)
- replace (substituir history entry)
- Relative navigation (".", "..", "../sibling")
- Hash navigation (#section)
- preventScrollReset

### M11: História e Back/Forward
- History stack mental model
- go(), goBack(), goForward()
- delta navigation (go(-2))
- History API integration
- Limitações do history

### M12: Redirecionamentos
- Navigate component declarativo
- useNavigate programático
- Redirect patterns (autenticação)
- Preservando query params
- Conditional redirects

---

## Bloco 4: Parâmetros e Query Strings (6h)

### M13: Route Parameters
- useParams hook
- Dynamic segments (/:id)
- Múltiplos parâmetros (/:category/:id)
- Optional parameters
- Type safety com TypeScript

### M14: Query Parameters
- useSearchParams hook
- Leitura de query params
- Atualização de query params
- Múltiplos valores (arrays)
- URLSearchParams API

### M15: Location e State
- useLocation hook
- location.pathname, search, hash
- location.state (dados transitórios)
- location.key (identificação única)
- Persistência vs transitoriedade

---

## Bloco 5: Proteção de Rotas (8h)

### M16: Autenticação Básica
- Protected routes pattern
- Wrapper components
- Conditional rendering
- Redirect após login
- Preservando intended destination

### M17: Route Guards
- beforeEnter pattern
- Role-based access control (RBAC)
- Permission checking
- Multiple guard composition
- Loading states durante verificação

### M18: Auth Context Integration
- useAuth hook pattern
- Context + Router integration
- Token verification
- Refresh token flow
- Logout e limpeza de state

### M19: Rotas Públicas vs Privadas
- Layout separation
- Nested protected routes
- Redirect loops prevention
- Anonymous-only routes (login page)
- Mixed access scenarios

---

## Bloco 6: Data Loading (6h)

### M20: Loaders (React Router v6.4+)
- loader function API
- useLoaderData hook
- Parallel data loading
- Error handling em loaders
- Revalidation strategies

### M21: Actions (Form Handling)
- action function API
- useActionData hook
- Form component
- useFetcher hook
- Optimistic UI

### M22: Defer e Suspense
- defer() para streaming
- Await component
- Suspense boundaries
- Progressive loading
- Fallback strategies

---

## Bloco 7: Patterns Avançados (8h)

### M23: Layout Routes
- Shared layouts
- Persistent UI (sidebars, headers)
- Outlet context
- Layout nesting
- Conditional layouts

### M24: Code Splitting
- React.lazy com rotas
- Suspense integration
- Route-based splitting
- Prefetching strategies
- Bundle optimization

### M25: Modal Routes
- Background location pattern
- Modal navigation
- Preserving background state
- Close modal behaviors
- URL-driven modals

### M26: Scroll Management
- ScrollRestoration component
- Manual scroll control
- Scroll to top on navigation
- Anchor links (#sections)
- Smooth scrolling

---

## Bloco 8: Performance e Best Practices (6h)

### M27: Performance Optimization
- Memoization de rotas
- Route component optimization
- Evitando re-renders desnecessários
- Lazy loading strategies
- Prefetching crítico

### M28: Testing
- Testing Library com Router
- Mocking useNavigate
- Testing protected routes
- Integration tests
- E2E com rotas

### M29: Migration e Troubleshooting
- v5 para v6 migration guide
- Breaking changes analysis
- Common pitfalls
- Debugging strategies
- DevTools integration

---

## Estrutura de Cada Módulo

Cada arquivo `.md` deve conter:

### 🎯 Introdução
- Conceito principal em 2-3 parágrafos
- Problema que resolve
- Contextualização histórica/teórica

### 📋 Sumário
- Lista de tópicos principais
- Organização hierárquica

### 🧠 Fundamentos
- Explicação teórica detalhada (90%)
- Conceitos base
- Terminologia
- Exemplos mínimos de código (10%)

### 🔍 Análise
- Comparações
- Trade-offs
- Casos de uso
- Análise crítica

### 🎯 Aplicabilidade
- Quando usar
- Quando NÃO usar
- Cenários reais

### ⚠️ Limitações
- Restrições técnicas
- Problemas conhecidos
- Workarounds

### 🔗 Interconexões
- Relação com outros módulos
- Dependências
- Pré-requisitos

### 🚀 Evolução
- Histórico
- Tendências futuras
- Alternativas modernas

---

## Notas Importantes

**Proporção de Conteúdo**:
- 90% teoria (explicações profundas, conceitos, análises)
- 10% código (exemplos mínimos para ilustrar conceitos)

**Filosofia**:
- Priorizar ENTENDIMENTO sobre memorização
- Explicar o POR QUÊ antes do COMO
- Contextualizar historicamente (v5 vs v6)
- Analisar trade-offs e limitações
- Comparar com alternativas (Reach Router, TanStack Router)

**Público-Alvo**:
- Desenvolvedores React intermediários
- Foco em conhecimento profundo de roteamento
- Preparação para aplicações complexas
- Compreensão de SPA architecture

**Progressão**:
- Do básico ao avançado
- Cada módulo constrói sobre o anterior
- Interconexões explícitas entre tópicos
- Revisão e reforço de conceitos

---

## Cronograma Sugerido

**Semana 1**: Bloco 1 (Fundamentos) + Bloco 2 (Rotas)
**Semana 2**: Bloco 3 (Navegação) + Bloco 4 (Parâmetros)
**Semana 3**: Bloco 5 (Proteção)
**Semana 4**: Bloco 6 (Data Loading) + Bloco 7 (Patterns)
**Semana 5**: Bloco 8 (Performance e Testing)

**Total**: ~50 horas de estudo profundo

---

## Recursos Complementares

- Documentação oficial React Router v6
- React Router Tutorial (oficial)
- "React Router - Complete Guide" (online courses)
- GitHub discussions e issues
- Community patterns repository

---

## Diferenças v5 → v6 (Importantes)

**Breaking Changes**:
- Switch → Routes
- component/render → element
- Exact removido (padrão agora)
- Nested routes via Outlet
- useHistory → useNavigate
- Relative routing changes

**Novos Recursos v6.4+**:
- Data APIs (loader, action)
- defer() para streaming
- Form component
- useFetcher hook
- RouterProvider

---

**Status**: Pronto para implementação módulo por módulo
**Última atualização**: 17/11/2025
**Versão React Router**: 6.x (com notas sobre v5)
