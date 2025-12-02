# Grade Curricular Completa de ReactJS

---

## B1 - Fundamentos e Conceitos Base

### M1 - Introdução ao React

**T1 - O que é React**
- Definição e propósito da biblioteca
- História e evolução do React (Facebook, 2013)
- React como biblioteca declarativa e baseada em componentes
- Diferença entre biblioteca e framework
- O problema que o React resolve (manipulação eficiente do DOM)
- Comparação conceitual com outras soluções (Angular, Vue, Svelte)
- Casos de uso ideais para React
- Empresas e produtos que utilizam React

**T2 - Filosofia e Princípios do React**
- Programação declarativa vs imperativa
- Composição sobre herança
- Fluxo de dados unidirecional (one-way data binding)
- Imutabilidade como princípio central
- Componentização e reutilização
- Separação de responsabilidades (Separation of Concerns)
- "Learn Once, Write Anywhere"

**T3 - Arquitetura do React**
- Virtual DOM: conceito e funcionamento
- Algoritmo de reconciliação (Reconciliation)
- Diffing algorithm e sua complexidade O(n)
- Fiber Architecture: motivação e benefícios
- Render phase vs Commit phase
- Batching de atualizações
- Concurrent features (visão geral)

**T4 - Ecossistema React**
- React DOM (renderização web)
- React Native (aplicações móveis)
- React Server Components
- Ferramentas de desenvolvimento (React DevTools)
- Gerenciadores de estado populares
- Bibliotecas de roteamento
- Meta-frameworks (Next.js, Remix, Gatsby)

---

### M2 - Ambiente de Desenvolvimento

**T1 - Configuração do Ambiente**
- Node.js: instalação e gerenciamento de versões (nvm)
- npm vs yarn vs pnpm: diferenças e escolhas
- Estrutura de um package.json
- Scripts npm e automação
- Variáveis de ambiente (.env)
- Configuração de IDE (VS Code, extensões recomendadas)
- ESLint e Prettier para React

**T2 - Ferramentas de Build**
- O papel do bundler em aplicações React
- Webpack: conceitos fundamentais
- Vite: arquitetura e vantagens (ESM nativo)
- Babel: transpilação e presets para React
- SWC como alternativa ao Babel
- Source maps e debugging
- Tree shaking e code splitting conceitual

**T3 - Criação de Projetos React**
- Create React App (CRA): uso e limitações
- Vite como alternativa moderna
- Estrutura de pastas padrão
- Arquivos de configuração essenciais
- Hot Module Replacement (HMR)
- Modos de desenvolvimento vs produção
- Build e deploy básico

**T4 - TypeScript com React**
- Por que usar TypeScript em projetos React
- Configuração do tsconfig.json para React
- Diferença entre .ts e .tsx
- Tipos básicos em contexto React
- Configuração de paths e aliases
- Strict mode e suas implicações

---

### M3 - JSX em Profundidade

**T1 - Fundamentos do JSX**
- O que é JSX (JavaScript XML)
- JSX como extensão sintática do JavaScript
- Transformação JSX para JavaScript (React.createElement)
- Por que JSX não é HTML
- JSX vs Template Strings
- Fragmentos (<></> e <React.Fragment>)
- Retorno de múltiplos elementos

**T2 - Sintaxe e Regras do JSX**
- Expressões JavaScript em JSX (chaves {})
- Atributos em JSX (className, htmlFor, etc.)
- Diferenças de nomenclatura HTML vs JSX
- Estilos inline (objeto JavaScript)
- Comentários em JSX
- Elementos auto-fechados
- Case sensitivity em componentes
- Spread de props ({...props})

**T3 - Renderização Condicional**
- Operador ternário em JSX
- Operador lógico AND (&&) e suas armadilhas
- Operador lógico OR (||) e nullish coalescing (??)
- Early return em componentes
- Variáveis de elemento
- IIFEs em JSX (quando usar)
- Padrões de renderização condicional complexa

**T4 - Renderização de Listas**
- Método map() para renderização
- A propriedade key: propósito e importância
- Regras para escolha de keys
- Por que índices como keys são problemáticos
- Renderização de listas aninhadas
- Filtragem e ordenação em renderização
- Fragmentos com keys

**T5 - JSX Avançado**
- Elementos como expressões JavaScript
- Escolha dinâmica de componentes
- Namespaced components (Menu.Item)
- JSX e closures
- Prevenção de XSS pelo React
- dangerouslySetInnerHTML: uso e riscos
- Transpilação JSX: classic vs automatic runtime

---

## B2 - Componentes e Props

### M1 - Anatomia dos Componentes

**T1 - Componentes Funcionais**
- Definição de componente funcional
- Função que retorna JSX
- Convenções de nomenclatura (PascalCase)
- Componentes como funções puras (conceito ideal)
- Componentes anônimos vs nomeados
- Arrow functions vs function declarations
- Default exports vs named exports

**T2 - Estrutura de um Componente**
- Imports e dependências
- Definição de tipos/interfaces (TypeScript)
- Lógica e hooks
- Early returns e guards
- Retorno JSX
- Exports
- Colocação de arquivos relacionados

**T3 - Class Components (Legado)**
- Sintaxe de class components
- O método render()
- Constructor e inicialização
- Binding de métodos
- Por que function components são preferidos
- Migração de class para function components
- Casos onde ainda se encontram class components

**T4 - Componentização Efetiva**
- Princípio da responsabilidade única
- Quando extrair um componente
- Granularidade de componentes
- Componentes de apresentação vs container (padrão histórico)
- Componentes controlados vs não controlados
- Componentes puros (conceito)

---

### M2 - Sistema de Props

**T1 - Fundamentos de Props**
- O que são props (properties)
- Props como argumentos de função
- Props são read-only (imutabilidade)
- Passagem de props para componentes
- Acesso a props no componente filho
- Destructuring de props
- Props default values

**T2 - Tipos de Props**
- Props primitivas (string, number, boolean)
- Props de objeto e array
- Props de função (callbacks)
- Props de elementos React (ReactNode, ReactElement)
- Props de componentes (component as prop)
- Props de renderização (render props pattern)
- Rest props e spread operator

**T3 - Tipagem de Props com TypeScript**
- Interface vs Type para props
- Props obrigatórias vs opcionais
- Props com valores default tipados
- Union types em props
- Generic components
- Utility types úteis (Partial, Required, Pick, Omit)
- PropsWithChildren e ReactNode

**T4 - Children Props**
- A prop especial children
- Tipos de children (string, elemento, array, função)
- React.Children utilities (map, forEach, count, only, toArray)
- Manipulação de children com cloneElement
- Compound components pattern (introdução)
- Children como função (render props)

**T5 - Padrões de Props**
- Props drilling: problema e identificação
- Prop forwarding
- Default props e valores fallback
- Props booleanas (convenções)
- Props de estilo (className, style)
- Props de acessibilidade (aria-*)
- Props de dados (data-*)

---

### M3 - Comunicação entre Componentes

**T1 - Fluxo de Dados Unidirecional**
- Dados fluem de cima para baixo
- Componentes pais e filhos
- Lifting state up (elevação de estado)
- Componentes irmãos e ancestral comum
- Identificando o dono do estado
- Diagramas de fluxo de dados

**T2 - Callbacks e Eventos**
- Passando funções como props
- Convenção de nomenclatura (onAction, handleAction)
- Parâmetros em callbacks
- Evitando funções inline desnecessárias
- useCallback para estabilização (preview)
- Event handlers vs callbacks

**T3 - Composição de Componentes**
- Composição vs herança
- Especialização de componentes
- Containment pattern
- Slots com children
- Múltiplos slots com props nomeadas
- Higher-Order Components (HOC) - conceito
- Render props pattern - conceito

---

## B3 - Estado e Ciclo de Vida

### M1 - Estado com useState

**T1 - Fundamentos do Estado**
- O que é estado em React
- Estado vs props: diferenças fundamentais
- Por que precisamos de estado
- Estado local vs estado compartilhado
- Imutabilidade do estado
- Re-renderização baseada em estado

**T2 - O Hook useState**
- Sintaxe e retorno do useState
- Valor inicial do estado
- Inicialização lazy (função como valor inicial)
- Convenção de nomenclatura ([value, setValue])
- Múltiplos useState no mesmo componente
- Ordem dos hooks (regra fundamental)

**T3 - Atualizando Estado**
- Setter function básica
- Functional updates (updater function)
- Quando usar functional updates
- Batching de atualizações de estado
- Estado assíncrono e valores stale
- Closures e estado

**T4 - Estado com Diferentes Tipos**
- Estado primitivo (string, number, boolean)
- Estado de objeto (spread operator para imutabilidade)
- Estado de array (métodos imutáveis: map, filter, spread)
- Estado aninhado e suas complexidades
- Normalização de estado
- Bibliotecas auxiliares (Immer - menção)

**T5 - Padrões de Estado**
- Estado derivado (computed values)
- Estado vs referências
- Single source of truth
- Estado controlado vs não controlado
- Inicialização de estado a partir de props
- Reset de estado com key

---

### M2 - Efeitos com useEffect

**T1 - Conceito de Efeitos Colaterais**
- O que são side effects
- Efeitos síncronos vs assíncronos
- Por que efeitos não podem estar no corpo do componente
- Separação entre renderização e efeitos
- Modelo mental: sincronização com sistemas externos

**T2 - Anatomia do useEffect**
- Sintaxe do useEffect
- Callback de efeito
- Array de dependências
- Função de cleanup (limpeza)
- Quando o efeito executa
- Ordem de execução de múltiplos useEffects

**T3 - Array de Dependências**
- Dependências vazias ([]) - executar uma vez
- Sem array - executar toda renderização
- Dependências específicas - executar quando mudam
- Regras do exhaustive-deps (ESLint)
- Dependências de objetos e arrays (referências)
- Estabilização de dependências

**T4 - Cleanup de Efeitos**
- Por que cleanup é necessário
- Sintaxe da função de cleanup
- Quando o cleanup executa
- Memory leaks comuns
- Cleanup de subscriptions
- Cleanup de event listeners
- Cleanup de timers (setTimeout, setInterval)
- Abort controllers para fetch

**T5 - Casos de Uso Comuns**
- Fetch de dados
- Subscriptions a eventos (window, document)
- Sincronização com localStorage
- Integração com bibliotecas externas
- Manipulação direta do DOM
- Logging e analytics
- WebSocket connections

**T6 - Antipadrões e Armadilhas**
- Dependências faltantes
- Dependências desnecessárias
- Loops infinitos de efeitos
- Race conditions em fetch
- Estado derivado em useEffect (desnecessário)
- useEffect para event handlers (incorreto)
- Efeitos que deveriam ser eventos

---

### M3 - Outros Hooks Fundamentais

**T1 - useRef**
- Conceito de referências mutáveis
- useRef vs useState
- Referências não causam re-render
- Acessando elementos DOM
- Valores persistentes entre renders
- Casos de uso: foco, scroll, medições
- Forward refs (introdução)

**T2 - useContext**
- O problema do prop drilling
- Criando contexto (createContext)
- Provider e valor do contexto
- Consumindo contexto com useContext
- Quando usar contexto
- Contexto vs props
- Performance e contexto (preview de problemas)

**T3 - useReducer**
- Quando useState não é suficiente
- Conceito de reducer (Redux-like)
- Sintaxe: state, action, dispatch
- Diferença entre useState e useReducer
- Tipando reducers com TypeScript
- Padrões de actions
- useReducer + useContext para estado global

**T4 - useMemo e useCallback**
- O problema de renderizações desnecessárias
- useMemo: memoização de valores
- useCallback: memoização de funções
- Dependências e invalidação de cache
- Quando usar (e quando não usar)
- Otimização prematura vs necessária
- Regras práticas de uso

**T5 - Hooks Adicionais**
- useId: IDs únicos para acessibilidade
- useLayoutEffect: efeitos síncronos
- useImperativeHandle: customização de refs
- useDebugValue: debugging de hooks customizados
- useDeferredValue: valores diferidos
- useTransition: transições não-bloqueantes
- useSyncExternalStore: stores externos

---

### M4 - Hooks Customizados

**T1 - Fundamentos de Custom Hooks**
- O que são custom hooks
- Convenção de nomenclatura (use*)
- Extraindo lógica reutilizável
- Regras de hooks em custom hooks
- Custom hooks vs funções utilitárias
- Composição de hooks

**T2 - Criando Custom Hooks**
- Estrutura básica de um custom hook
- Parâmetros de entrada
- Valores de retorno (objeto vs array vs valor único)
- Tipagem de custom hooks
- Hooks que usam outros hooks
- Hooks com estado interno

**T3 - Padrões Comuns de Custom Hooks**
- useToggle: estado booleano
- useLocalStorage: persistência local
- useFetch: requisições HTTP
- useDebounce: debouncing de valores
- useOnClickOutside: cliques externos
- useMediaQuery: responsividade
- usePrevious: valor anterior
- useMount/useUnmount: ciclo de vida

**T4 - Custom Hooks Avançados**
- Hooks com cleanup complexo
- Hooks que retornam componentes
- Hooks com refs
- Hooks compostos (usando outros custom hooks)
- Testabilidade de custom hooks
- Documentação de hooks

---

## B4 - Estilização em React

### M1 - CSS Tradicional

**T1 - CSS Externo**
- Importação de arquivos CSS
- Escopo global de estilos
- Convenções de nomenclatura (BEM)
- Organização de arquivos CSS
- CSS reset e normalize
- Variáveis CSS (custom properties)
- Media queries em React

**T2 - CSS Modules**
- O que são CSS Modules
- Configuração e uso
- Escopo local automático
- Composição de classes (composes)
- Convenções de nomenclatura
- Tipagem de CSS Modules (TypeScript)
- Vantagens sobre CSS global

**T3 - Sass/SCSS com React**
- Configuração de Sass em projetos React
- Variáveis e mixins
- Nesting e organização
- Partials e imports
- Funções e operações
- CSS Modules com Sass

---

### M2 - CSS-in-JS

**T1 - Conceitos de CSS-in-JS**
- O que é CSS-in-JS
- Vantagens: escopo, dinamismo, colocação
- Desvantagens: bundle size, runtime cost
- Runtime vs build-time CSS-in-JS
- Comparação de bibliotecas populares

**T2 - Styled Components**
- Instalação e configuração
- Sintaxe de template literals
- Props dinâmicas em estilos
- Extensão de componentes
- Temas com ThemeProvider
- Estilos globais (createGlobalStyle)
- Attrs para props default

**T3 - Emotion**
- CSS prop vs styled
- Diferenças para Styled Components
- Configuração com Babel
- Object styles vs string styles
- Composição de estilos
- Performance considerations

**T4 - Alternativas Modernas**
- Vanilla Extract (zero-runtime)
- Linaria (zero-runtime)
- Stitches
- Panda CSS
- Trade-offs entre abordagens

---

### M3 - Utility-First CSS

**T1 - Tailwind CSS com React**
- Filosofia utility-first
- Instalação e configuração
- Classes utilitárias fundamentais
- Responsividade com prefixos
- Estados (hover, focus, active)
- Dark mode
- Customização do tema

**T2 - Padrões com Tailwind**
- Componentes e reutilização
- @apply e extração de classes
- Class variance authority (CVA)
- Tailwind Merge
- Conditional classes (clsx, classnames)
- Organização de classes longas

**T3 - Outras Abordagens Utility-First**
- UnoCSS
- Windi CSS
- Twind
- Comparações e trade-offs

---

### M4 - Bibliotecas de Componentes

**T1 - Design Systems e Component Libraries**
- O que são design systems
- Vantagens de usar bibliotecas prontas
- Trade-offs de customização
- Acessibilidade out-of-the-box
- Consistência visual

**T2 - Bibliotecas Populares**
- Material UI (MUI)
- Chakra UI
- Ant Design
- Radix UI (primitivos)
- Headless UI
- shadcn/ui (copy-paste components)
- React Aria

**T3 - Customização de Bibliotecas**
- Temas e theming
- Override de estilos
- Composição de componentes
- Criando variantes
- Design tokens

---

## B5 - Formulários

### M1 - Formulários Controlados

**T1 - Conceito de Controlled Components**
- Input controlado vs não controlado
- Estado como single source of truth
- O padrão value + onChange
- Sincronização de estado e UI
- Vantagens do controle total

**T2 - Inputs Básicos**
- Text input
- Number input
- Password input
- Textarea
- Checkbox (booleano)
- Radio buttons (grupo)
- Select e options

**T3 - Manipulação de Valores**
- Event handlers para formulários
- event.target.value
- event.target.checked
- event.target.name (inputs dinâmicos)
- Parsing e formatação de valores
- Estado de objeto para múltiplos campos

**T4 - Validação de Formulários**
- Validação síncrona
- Validação no submit vs on change vs on blur
- Mensagens de erro e feedback
- Estado de validação
- Validação de campos dependentes
- Regex e padrões de validação
- HTML5 validation attributes

**T5 - Padrões de Formulários**
- Formulário como componente único
- Formulário com componentes de campo
- Estado do formulário (pristine, dirty, touched)
- Submissão e loading state
- Reset de formulário
- Formulários multi-step

---

### M2 - Formulários Não Controlados

**T1 - Conceito de Uncontrolled Components**
- Quando usar formulários não controlados
- Refs para acesso a valores
- defaultValue vs value
- Performance considerations
- Integração com bibliotecas não-React

**T2 - useRef em Formulários**
- Acessando valores de input
- Focus management
- Integração com validação
- FormData API

---

### M3 - Bibliotecas de Formulários

**T1 - React Hook Form**
- Filosofia e arquitetura
- useForm hook
- Register e unregister
- handleSubmit
- Modos de validação
- Erros e mensagens
- watch e getValues
- Controller para componentes controlados
- Integração com UI libraries

**T2 - Validação com Zod**
- Schemas de validação
- Integração com React Hook Form (zodResolver)
- Tipagem automática com infer
- Validação condicional
- Transformações
- Error messages customizadas

**T3 - Alternativas**
- Formik: conceitos e uso
- Yup para validação
- Comparação entre bibliotecas
- Quando usar cada uma

---

## B6 - Roteamento

### M1 - React Router Fundamentos

**T1 - Conceitos de Roteamento SPA**
- Single Page Applications
- Client-side routing
- History API do navegador
- Hash routing vs Browser routing
- Por que precisamos de uma biblioteca de roteamento

**T2 - Configuração do React Router**
- Instalação (react-router-dom)
- BrowserRouter vs HashRouter
- RouterProvider (data router)
- Estrutura básica de rotas
- createBrowserRouter (moderna)

**T3 - Definição de Rotas**
- Route component
- path e element
- Index routes
- Rotas aninhadas (nested routes)
- Outlet para renderização de filhos
- Catch-all routes (*)
- Rotas opcionais

**T4 - Navegação**
- Link component
- NavLink com active state
- useNavigate hook
- Navigate component (redirect)
- Navegação programática
- State na navegação
- Replace vs push

---

### M2 - React Router Avançado

**T1 - Parâmetros de Rota**
- Parâmetros dinâmicos (:id)
- useParams hook
- Múltiplos parâmetros
- Parâmetros opcionais
- Tipagem de parâmetros

**T2 - Query Strings**
- useSearchParams hook
- Leitura de query params
- Atualização de query params
- Serialização de objetos
- Estado na URL

**T3 - Data Loading**
- Loaders em rotas
- useLoaderData hook
- Carregamento paralelo
- defer e Await
- Tratamento de erros em loaders
- Revalidação de dados

**T4 - Actions e Mutations**
- Actions em rotas
- Form component
- useActionData
- useFetcher para mutations
- Optimistic updates
- Revalidação após actions

**T5 - Proteção de Rotas**
- Rotas protegidas (autenticação)
- Redirect condicional
- Layout routes para proteção
- Higher-order route pattern
- useLocation para redirect

**T6 - Recursos Avançados**
- Lazy loading de rotas
- Code splitting com React.lazy
- Error boundaries em rotas
- Scroll restoration
- Pending UI (useNavigation)
- Bloqueio de navegação (useBlocker)

---

### M3 - Alternativas de Roteamento

**T1 - TanStack Router**
- Type-safe routing
- Search params tipados
- File-based routing
- Loaders e preloading
- Comparação com React Router

**T2 - Outras Opções**
- Wouter (minimalista)
- Reach Router (histórico)
- Next.js routing (App Router)
- Remix routing

---

## B7 - Gerenciamento de Estado

### M1 - Estado Local e Contexto

**T1 - Padrões de Estado Local**
- Quando estado local é suficiente
- Colocação de estado (state colocation)
- Lifting state up revisitado
- Componente container com estado
- Props drilling e seus limites

**T2 - Context API em Profundidade**
- Anatomia completa do Context
- Criando providers reutilizáveis
- Múltiplos contextos
- Context com reducer
- Separação de state e dispatch contexts
- Composição de providers
- Context selectors (problema de performance)

**T3 - Padrões com Context**
- Feature-based contexts
- Theme context
- Auth context
- Locale/i18n context
- Custom provider hooks
- Context factories

---

### M2 - Estado Global com Bibliotecas

**T1 - Zustand**
- Filosofia minimalista
- Criando stores
- Selectors e re-renders
- Actions e mutations
- Middleware (persist, devtools)
- Múltiplas stores
- TypeScript com Zustand
- Comparação com Redux

**T2 - Redux Toolkit**
- Por que Redux (e quando)
- Redux Toolkit vs Redux clássico
- createSlice
- configureStore
- Reducers e actions
- useSelector e useDispatch
- Immer integration
- createAsyncThunk
- RTK Query (introdução)

**T3 - Jotai**
- Atomic state management
- Primitivos: atom
- Derived atoms
- Async atoms
- Comparação com Zustand e Redux
- Casos de uso ideais

**T4 - Outras Soluções**
- Recoil (Facebook)
- MobX (observable pattern)
- Valtio (proxy-based)
- XState (state machines)
- Comparação geral e escolhas

---

### M3 - Server State

**T1 - Conceito de Server State**
- Diferença entre client state e server state
- Caching e sincronização
- Stale-while-revalidate
- Problemas de estado do servidor
- Por que bibliotecas específicas

**T2 - TanStack Query (React Query)**
- Queries: useQuery
- QueryClient e Provider
- Query keys
- Stale time e cache time
- Refetching strategies
- Polling e real-time
- Pagination e infinite queries
- Mutations: useMutation
- Optimistic updates
- Query invalidation
- Prefetching
- Suspense mode
- DevTools

**T3 - SWR**
- Filosofia stale-while-revalidate
- useSWR hook
- Configuração global
- Revalidation strategies
- Mutations com SWR
- Comparação com React Query

**T4 - Outras Opções**
- RTK Query
- Apollo Client (GraphQL)
- urql (GraphQL)
- tRPC (end-to-end typesafe)

---

## B8 - Performance

### M1 - Entendendo Re-renders

**T1 - Modelo Mental de Renderização**
- O que é uma re-renderização
- Quando componentes re-renderizam
- Props changes (referência vs valor)
- State changes
- Context changes
- Parent re-renders
- Force update (evitar)

**T2 - React DevTools Profiler**
- Instalação e configuração
- Gravando renders
- Flamegraph e ranked views
- Identificando renders desnecessários
- Component highlights
- Commit information

**T3 - Identificando Problemas**
- Renders cascateados
- Renders frequentes
- Renders lentos
- Props instáveis
- Context over-rendering
- Ferramentas de debugging

---

### M2 - Técnicas de Otimização

**T1 - React.memo**
- O que faz React.memo
- Quando usar
- Custom comparison function
- Limitações
- Componentes que não devem ser memoizados

**T2 - useMemo em Profundidade**
- Memoização de valores computados
- Dependências corretas
- Custo vs benefício
- Cálculos pesados vs leves
- Estabilização de referências

**T3 - useCallback em Profundidade**
- Memoização de funções
- Callbacks como props
- Combinação com React.memo
- Dependências e closures
- Quando é desnecessário

**T4 - Otimização de Contexto**
- Split de contextos
- Memoização de value
- Context selectors libraries
- use-context-selector
- Zustand como alternativa

**T5 - Virtualização**
- O problema de listas longas
- react-window
- react-virtualized
- TanStack Virtual
- Infinite scroll

**T6 - Outras Técnicas**
- Debouncing e throttling
- Lazy initialization
- Windowing
- Web Workers
- Concurrent features

---

### M3 - Code Splitting e Lazy Loading

**T1 - Code Splitting Conceitos**
- O que é code splitting
- Por que dividir o bundle
- Entry points
- Dynamic imports
- Vendor splitting

**T2 - React.lazy e Suspense**
- React.lazy para componentes
- Suspense boundaries
- Fallback UI
- Error boundaries com lazy
- Named exports e lazy
- Preloading components

**T3 - Route-based Splitting**
- Lazy loading de rotas
- Prefetching de rotas
- Loading indicators
- Skeleton screens

**T4 - Análise de Bundle**
- webpack-bundle-analyzer
- source-map-explorer
- Identificando dependências pesadas
- Tree shaking verification

---

## B9 - Padrões Avançados

### M1 - Padrões de Composição

**T1 - Compound Components**
- O padrão compound
- Context para estado compartilhado
- Flexibilidade de composição
- Exemplos: Tabs, Accordion, Select
- Validação de children

**T2 - Render Props**
- O padrão render props
- Children as function
- Prop como função de renderização
- Casos de uso
- Hooks vs render props
- Combinação de padrões

**T3 - Higher-Order Components (HOC)**
- O padrão HOC
- Criando HOCs
- Composição de HOCs
- Props forwarding
- Display name
- Ref forwarding em HOCs
- HOCs vs Hooks
- Quando ainda usar HOCs

**T4 - Slots Pattern**
- Múltiplos pontos de inserção
- Props de slot
- Default content
- Compound components com slots

---

### M2 - Padrões de Estado

**T1 - State Machines com XState**
- Conceito de state machines
- Estados, eventos, transições
- XState com React
- useMachine hook
- Visualização de máquinas
- Guards e actions
- Nested e parallel states

**T2 - State Reducer Pattern**
- Controle externo de estado
- Customização de comportamento
- Implementação
- Casos de uso

**T3 - Controlled/Uncontrolled Pattern**
- Componentes híbridos
- Default value vs value
- Internamente controlado
- useControlled hook

---

### M3 - Padrões de Dados

**T1 - Container/Presenter (Revisitado)**
- Separação de responsabilidades
- Smart vs Dumb components
- Hooks como alternativa
- Quando ainda faz sentido

**T2 - Data Fetching Patterns**
- Fetch on render
- Fetch then render
- Render as you fetch
- Suspense for data fetching
- Error boundaries para erros

**T3 - Optimistic Updates**
- Conceito de optimistic UI
- Implementação manual
- Com React Query
- Rollback em caso de erro

---

## B10 - Testes

### M1 - Fundamentos de Testes

**T1 - Tipos de Testes**
- Pirâmide de testes
- Testes unitários
- Testes de integração
- Testes end-to-end
- Testes de snapshot
- Testes visuais

**T2 - Filosofia de Testes em React**
- Testing Library principles
- Testar comportamento, não implementação
- User-centric testing
- Queries acessíveis
- Evitando testes frágeis

**T3 - Configuração do Ambiente**
- Jest configuration
- Vitest como alternativa
- jsdom
- Setup files
- Mocking de módulos
- Coverage reports

---

### M2 - React Testing Library

**T1 - Queries**
- getBy, queryBy, findBy
- ByRole (preferencial)
- ByLabelText
- ByText
- ByTestId (último recurso)
- Multiple elements (getAllBy)
- Query priorities

**T2 - User Events**
- userEvent vs fireEvent
- click, type, keyboard
- Async actions
- Upload de arquivos
- Hover e focus

**T3 - Assertions**
- Jest-dom matchers
- toBeInTheDocument
- toBeVisible
- toHaveTextContent
- toBeDisabled
- Custom matchers

**T4 - Testando Componentes**
- Renderização de componentes
- Props e estados
- Eventos e interações
- Componentes assíncronos
- Mocking de hooks
- Mocking de contexto

**T5 - Testando Hooks**
- renderHook
- act wrapper
- Hooks com estado
- Hooks com efeitos
- Custom hooks testing

---

### M3 - Testes Avançados

**T1 - Mocking**
- Jest mocks
- Mocking de módulos
- Mocking de componentes
- Mocking de APIs (MSW)
- Mocking de timers
- Spy functions

**T2 - Testes de Integração**
- Múltiplos componentes
- Contexto e providers
- Roteamento
- Formulários
- Data fetching

**T3 - Testes E2E**
- Cypress introduction
- Playwright introduction
- Configuração básica
- Escrevendo testes E2E
- CI/CD integration

**T4 - Snapshot Testing**
- O que são snapshots
- Quando usar
- Limitações
- Inline snapshots
- Atualização de snapshots

---

## B11 - Recursos Modernos do React

### M1 - Concurrent React

**T1 - Concurrent Rendering**
- O que é concurrent rendering
- Rendering interruptível
- Time slicing
- Priority-based rendering
- Automatic batching

**T2 - Transitions**
- useTransition hook
- startTransition
- isPending state
- Urgent vs non-urgent updates
- Casos de uso práticos

**T3 - Deferred Values**
- useDeferredValue hook
- Diferença para debounce
- Background rendering
- Casos de uso

---

### M2 - Suspense

**T1 - Suspense Fundamentals**
- O que é Suspense
- Suspense boundaries
- Fallback UI
- Nested Suspense
- SuspenseList (experimental)

**T2 - Suspense para Código**
- React.lazy integration
- Route-based suspense
- Component-based suspense
- Error boundaries combination

**T3 - Suspense para Dados**
- Data fetching com Suspense
- React Query Suspense mode
- use hook (React 19)
- Streaming SSR

---

### M3 - Server Components

**T1 - Conceitos de RSC**
- O que são Server Components
- Server vs Client components
- "use client" directive
- "use server" directive
- Benefícios de RSC
- Zero-bundle components

**T2 - Arquitetura RSC**
- Componentes compartilhados
- Composição server/client
- Data fetching em RSC
- Serialização de props
- Streaming

**T3 - Frameworks com RSC**
- Next.js App Router
- RSC em outros frameworks
- Adoção e migração

---

### M4 - React 19 Features

**T1 - Actions**
- useActionState (ex-useFormState)
- useFormStatus
- Server Actions
- Optimistic updates nativos
- Form handling melhorado

**T2 - Novos Hooks**
- use hook
- useOptimistic
- Promises como recursos

**T3 - Outras Melhorias**
- Document metadata
- Asset loading
- ref como prop
- Cleanup functions em refs
- Melhorias de hidratação

---

## B12 - Ecossistema e Ferramentas

### M1 - Meta-Frameworks

**T1 - Next.js**
- Pages Router vs App Router
- File-based routing
- SSR, SSG, ISR
- API routes
- Middleware
- Deployment (Vercel)

**T2 - Remix**
- Filosofia web fundamentals
- Nested routing
- Loaders e actions
- Progressive enhancement
- Error handling
- Deployment

**T3 - Outros Frameworks**
- Gatsby (static sites)
- Astro (content sites)
- Expo (React Native)

---

### M2 - Ferramentas de Desenvolvimento

**T1 - DevTools**
- React DevTools (components, profiler)
- Redux DevTools
- React Query DevTools
- Network tab profiling

**T2 - Linting e Formatação**
- ESLint para React
- eslint-plugin-react
- eslint-plugin-react-hooks
- Prettier configuration
- Configuração recomendada

**T3 - Type Checking**
- TypeScript strict mode
- Tipos do React (@types/react)
- Utility types para React
- Generics em componentes

---

### M3 - Build e Deploy

**T1 - Build Optimization**
- Production builds
- Minification
- Compression
- Cache headers
- CDN deployment

**T2 - Deployment Platforms**
- Vercel
- Netlify
- AWS (S3, CloudFront, Amplify)
- Docker containers
- CI/CD pipelines

**T3 - Monitoramento**
- Error tracking (Sentry)
- Analytics
- Performance monitoring
- Core Web Vitals

---

## B13 - Acessibilidade (a11y)

### M1 - Fundamentos de Acessibilidade

**T1 - Por que Acessibilidade Importa**
- Inclusão digital
- Requisitos legais
- Benefícios para todos os usuários
- SEO e acessibilidade
- Tipos de deficiências

**T2 - WCAG e Standards**
- Web Content Accessibility Guidelines
- Níveis A, AA, AAA
- Princípios POUR
- ARIA specification

**T3 - Ferramentas de Avaliação**
- Screen readers (NVDA, VoiceOver)
- axe DevTools
- Lighthouse accessibility
- WAVE
- Testes manuais

---

### M2 - Acessibilidade em React

**T1 - HTML Semântico**
- Elementos semânticos nativos
- Headings hierarchy
- Landmarks
- Formulários acessíveis
- Tabelas acessíveis

**T2 - ARIA em React**
- Roles
- States and properties
- aria-label, aria-labelledby
- aria-describedby
- aria-live regions
- aria-expanded, aria-hidden

**T3 - Gerenciamento de Foco**
- Focus order (tabindex)
- Focus trapping (modals)
- Skip links
- Focus indicators
- useRef para focus management

**T4 - Padrões de Componentes Acessíveis**
- Modals e dialogs
- Dropdown menus
- Tabs
- Accordions
- Carousels
- Formulários

**T5 - Bibliotecas de Acessibilidade**
- React Aria (Adobe)
- Radix UI
- Reach UI
- Headless UI
- Downshift

---

## B14 - Internacionalização (i18n)

### M1 - Fundamentos de i18n

**T1 - Conceitos Básicos**
- Internacionalização vs Localização
- Locale e language codes
- RTL languages
- Pluralização
- Formatação de números e datas
- Timezone handling

**T2 - Bibliotecas de i18n**
- react-intl (Format.js)
- react-i18next
- LinguiJS
- Comparação e escolha

---

### M2 - Implementação com react-i18next

**T1 - Configuração**
- Setup inicial
- i18n instance
- Language detection
- Fallback languages
- Namespaces

**T2 - Uso em Componentes**
- useTranslation hook
- Trans component
- Interpolação
- Pluralização
- Contexto

**T3 - Gerenciamento de Traduções**
- Estrutura de arquivos
- JSON vs outros formatos
- Ferramentas de tradução
- CI/CD para traduções

---

## B15 - Segurança

### M1 - Vulnerabilidades Comuns

**T1 - XSS (Cross-Site Scripting)**
- Como React previne XSS
- dangerouslySetInnerHTML
- Sanitização de input
- Content Security Policy

**T2 - CSRF e Autenticação**
- CSRF tokens
- Secure cookies
- JWT handling
- Storage de tokens (localStorage vs cookies)

**T3 - Outras Vulnerabilidades**
- Injection attacks
- Sensitive data exposure
- Dependency vulnerabilities
- npm audit

---

### M2 - Boas Práticas de Segurança

**T1 - Autenticação e Autorização**
- Fluxos de autenticação
- OAuth 2.0 / OIDC
- Protected routes
- Role-based access

**T2 - Dados Sensíveis**
- Environment variables
- Secrets management
- Client-side vs server-side
- Data masking

**T3 - Segurança em Produção**
- HTTPS
- Headers de segurança
- Rate limiting
- Logging e monitoring

---

## B16 - Arquitetura de Projetos

### M1 - Estrutura de Projetos

**T1 - Organizações de Pastas**
- Por tipo de arquivo
- Por feature/domínio
- Atomic design
- Screaming architecture
- Monorepos vs single repo

**T2 - Convenções e Padrões**
- Nomenclatura de arquivos
- Index files (barrel exports)
- Path aliases
- Documentação de código
- README e contributing guides

**T3 - Escalabilidade**
- Feature flags
- Module boundaries
- Lazy loading strategies
- Micro-frontends (conceito)

---

### M2 - Qualidade de Código

**T1 - Code Review Practices**
- O que revisar em React
- Checklist de review
- Automated checks
- PR templates

**T2 - Documentação**
- Storybook para componentes
- JSDoc para funções
- Architecture Decision Records (ADR)
- Component documentation

**T3 - Manutenção**
- Dependency updates
- Technical debt
- Refactoring strategies
- Performance budgets

---

## B17 - Projetos Práticos

### M1 - Projeto Iniciante

**T1 - Todo App Completo**
- CRUD completo
- Local storage
- Filtros e busca
- Drag and drop
- Temas (dark/light)

---

### M2 - Projeto Intermediário

**T1 - Dashboard de E-commerce**
- Autenticação
- Listagem com paginação
- Gráficos e visualizações
- Formulários complexos
- Estado global

---

### M3 - Projeto Avançado

**T1 - Aplicação Real-time**
- WebSocket integration
- Optimistic updates
- Offline support
- Push notifications
- Performance optimization

---

Esta grade cobre React de forma abrangente, desde os fundamentos até tópicos avançados. O conteúdo está organizado para permitir progressão gradual, com cada bloco construindo sobre os anteriores.