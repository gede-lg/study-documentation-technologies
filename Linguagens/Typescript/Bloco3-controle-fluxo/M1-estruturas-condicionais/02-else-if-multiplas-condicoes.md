# Módulo 14: Else If - Múltiplas Condições e Decisões Sequenciais

## 🎯 Introdução

A estrutura **else if** representa uma das extensões mais importantes e práticas do if statement básico, permitindo a criação de **cadeias de decisão** onde múltiplas condições são avaliadas sequencialmente até que uma condição verdadeira seja encontrada. Em TypeScript, else if não apenas organiza lógica condicional complexa de forma legível, mas também trabalha integradamente com o sistema de tipos para fornecer **type narrowing progressivo** e **análise de fluxo de controle** sofisticada.

Esta estrutura é fundamental para implementar **decisões mutuamente exclusivas**, onde diferentes condições levam a diferentes caminhos de execução, permitindo que o código modele eficazmente cenários do mundo real onde múltiplas alternativas devem ser consideradas em ordem de prioridade ou especificidade.

O else if em TypeScript vai além da simples organização de condições, oferecendo **type refinement incremental**, onde cada condição successive pode refinar ainda mais os tipos disponíveis, criando um sistema de **progressive type narrowing** que garante type safety em cenários complexos de tomada de decisão.

## 📋 Sumário

1. **Sintaxe e Estrutura**: Anatomia da cadeia else if
2. **Ordem de Avaliação**: Sequência e precedência de condições
3. **Type Narrowing Progressivo**: Refinamento de tipos através da cadeia
4. **Padrões de Decisão**: Estratégias para organizar condições
5. **Performance Considerations**: Otimização de cadeias condicionais
6. **Exhaustiveness Checking**: Garantia de cobertura completa
7. **Refactoring Patterns**: Transformação para outras estruturas
8. **Complex Conditions**: Integração com operadores lógicos
9. **Error Handling**: Tratamento de erros em cadeias condicionais
10. **Testing Strategies**: Cobertura de teste para múltiplas condições

## 🧠 Fundamentos Conceituais

### Anatomia da Cadeia Else If

A estrutura else if cria uma **sequência de avaliação** onde apenas a primeira condição verdadeira é executada, com todas as subsequentes sendo ignoradas:

```typescript
// Estrutura básica da cadeia else if
function processValue(value: string | number | boolean | null) {
    if (value === null) {
        // Primeira verificação: null check
        console.log("Value is null");
    } else if (typeof value === "string") {
        // Segunda verificação: string type
        // TypeScript sabe que value não é null e é string aqui
        console.log(`String value: "${value}", length: ${value.length}`);
    } else if (typeof value === "number") {
        // Terceira verificação: number type  
        // TypeScript sabe que value não é null, não é string, e é number aqui
        console.log(`Number value: ${value}, fixed: ${value.toFixed(2)}`);
    } else if (typeof value === "boolean") {
        // Quarta verificação: boolean type
        // TypeScript sabe que value é boolean aqui
        console.log(`Boolean value: ${value ? "true" : "false"}`);
    }
    // Se nenhuma condição for verdadeira, nada acontece
    // TypeScript sabe que após todas as verificações, value pode ser never
}
```

### Progressive Type Narrowing

Cada else if progressivamente refina o tipo, eliminando as possibilidades já verificadas:

```typescript
type APIResponse = 
    | { status: "loading" }
    | { status: "success"; data: any }
    | { status: "error"; error: string; code: number }
    | { status: "timeout"; retryAfter: number };

function handleAPIResponse(response: APIResponse) {
    if (response.status === "loading") {
        // response: { status: "loading" }
        console.log("Request is still loading...");
        showSpinner();
    } else if (response.status === "success") {
        // response: { status: "success"; data: any }
        console.log("Request successful:", response.data);
        hideSpinner();
        displayData(response.data);
    } else if (response.status === "error") {
        // response: { status: "error"; error: string; code: number }
        console.log(`Error ${response.code}: ${response.error}`);
        hideSpinner();
        showErrorMessage(response.error);
        
        // Sub-condições baseadas no código de erro
        if (response.code === 401) {
            redirectToLogin();
        } else if (response.code === 403) {
            showPermissionDeniedMessage();
        } else if (response.code >= 500) {
            scheduleRetry();
        }
    } else if (response.status === "timeout") {
        // response: { status: "timeout"; retryAfter: number }
        console.log(`Request timed out, retry in ${response.retryAfter}ms`);
        hideSpinner();
        scheduleRetryAfter(response.retryAfter);
    }
}

// Funções auxiliares
function showSpinner() { console.log("Spinner shown"); }
function hideSpinner() { console.log("Spinner hidden"); }
function displayData(data: any) { console.log("Displaying:", data); }
function showErrorMessage(error: string) { console.log("Error:", error); }
function redirectToLogin() { console.log("Redirecting to login"); }
function showPermissionDeniedMessage() { console.log("Permission denied"); }
function scheduleRetry() { console.log("Scheduling retry"); }
function scheduleRetryAfter(ms: number) { console.log(`Retry in ${ms}ms`); }
```

### Ordem de Avaliação e Short-Circuit

O else if implementa **short-circuit evaluation** - assim que uma condição é verdadeira, as subsequentes são ignoradas:

```typescript
interface UserPermissions {
    role: "guest" | "user" | "moderator" | "admin" | "superadmin";
    permissions: string[];
    isActive: boolean;
    accountLevel: number;
}

function determineUserAccess(user: UserPermissions): string {
    // Ordem importa: verificações mais específicas primeiro
    if (user.role === "superadmin") {
        // Acesso total - não precisa verificar outras condições
        return "full_access";
    } else if (user.role === "admin" && user.isActive) {
        // Admin ativo - verificação combinada
        return "admin_access";
    } else if (user.role === "moderator" && user.isActive && user.accountLevel >= 3) {
        // Moderador com nível mínimo
        return "moderation_access";
    } else if (user.role === "user" && user.isActive) {
        // Usuário comum ativo
        if (user.permissions.includes("premium")) {
            return "premium_user_access";
        } else {
            return "basic_user_access";
        }
    } else if (user.role === "guest") {
        // Convidado - acesso limitado independente de outras condições
        return "guest_access";
    } else {
        // Usuário inativo ou role desconhecida
        return "no_access";
    }
}

// Exemplo de como a ordem afeta o resultado
function demonstrateOrderImportance(user: UserPermissions) {
    // Versão com ordem otimizada (mais específica primeiro)
    function optimizedVersion(user: UserPermissions): string {
        if (!user.isActive && user.role !== "superadmin") {
            // Verifica inatividade primeiro para casos comuns
            return "inactive_user";
        } else if (user.role === "superadmin") {
            return "superadmin_access";
        } else if (user.role === "admin") {
            return "admin_access";
        } else {
            return "regular_access";
        }
    }
    
    // Versão com ordem menos otimizada
    function suboptimalVersion(user: UserPermissions): string {
        if (user.accountLevel > 0) {
            // Condição muito ampla primeiro
            if (user.role === "superadmin") {
                return "superadmin_access";
            } else if (user.role === "admin") {
                return "admin_access";
            } else {
                return "regular_access";
            }
        } else if (!user.isActive) {
            // Verifica inatividade muito tarde
            return "inactive_user";
        } else {
            return "no_access";
        }
    }
    
    console.log("Optimized:", optimizedVersion(user));
    console.log("Suboptimal:", suboptimalVersion(user));
}
```

## 🔍 Análise Detalhada

### 1. Padrões Avançados de Classificação

Use else if para implementar sistemas de classificação e categorização complexos:

```typescript
interface ProductAnalysis {
    price: number;
    category: string;
    rating: number;
    reviewCount: number;
    isSponsored: boolean;
    stock: number;
    brand: string;
    releaseDate: Date;
}

type ProductPriority = "critical" | "high" | "medium" | "low" | "hidden";

function calculateProductPriority(product: ProductAnalysis): ProductPriority {
    const now = Date.now();
    const daysSinceRelease = (now - product.releaseDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Sistema de priorização hierárquica
    if (product.stock === 0) {
        // Produtos fora de estoque têm prioridade baixa
        return "hidden";
    } else if (product.isSponsored && product.rating >= 4.5) {
        // Produtos patrocinados com alta avaliação
        return "critical";
    } else if (product.price < 50 && product.rating >= 4.0 && product.reviewCount >= 100) {
        // Produtos baratos e bem avaliados - alta conversão
        return "high";
    } else if (daysSinceRelease <= 7 && product.rating >= 3.5) {
        // Produtos novos com avaliação decente
        return "high";
    } else if (product.category === "electronics" && product.rating >= 4.0) {
        // Eletrônicos bem avaliados têm prioridade média-alta
        return "medium";
    } else if (product.rating >= 3.0 && product.reviewCount >= 10) {
        // Produtos com avaliação e reviews suficientes
        return "medium";
    } else if (product.rating < 2.0 || product.reviewCount < 3) {
        // Produtos mal avaliados ou com poucos reviews
        return "low";
    } else {
        // Produtos neutros
        return "medium";
    }
}

// Sistema de filtros em cascata
interface SearchFilters {
    priceRange?: { min: number; max: number };
    categories?: string[];
    minRating?: number;
    inStock?: boolean;
    brands?: string[];
}

function filterProducts(
    products: ProductAnalysis[], 
    filters: SearchFilters
): ProductAnalysis[] {
    return products.filter(product => {
        // Cadeia de filtros com else if para performance
        if (filters.inStock !== undefined && filters.inStock && product.stock === 0) {
            return false;
        } else if (filters.priceRange) {
            const { min, max } = filters.priceRange;
            if (product.price < min || product.price > max) {
                return false;
            }
        } else if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(product.category)) {
                return false;
            }
        } else if (filters.minRating !== undefined && product.rating < filters.minRating) {
            return false;
        } else if (filters.brands && filters.brands.length > 0) {
            if (!filters.brands.includes(product.brand)) {
                return false;
            }
        }
        
        return true; // Passa por todos os filtros
    });
}

// Sistema de recomendação baseado em múltiplos critérios
function getRecommendationReason(product: ProductAnalysis, userHistory: string[]): string {
    if (product.isSponsored) {
        return "Sponsored product";
    } else if (userHistory.includes(product.category) && product.rating >= 4.0) {
        return "Based on your interests and high rating";
    } else if (product.rating >= 4.5 && product.reviewCount >= 1000) {
        return "Highly rated by customers";
    } else if (product.price < 25) {
        return "Great value for money";
    } else if (product.category === "bestseller") {
        return "Popular choice";
    } else {
        return "Recommended for you";
    }
}
```

### 2. Validação em Camadas com Type Guards

Implemente validação progressiva onde cada else if adiciona mais verificações:

```typescript
interface NetworkRequest {
    url?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}

interface ValidatedRequest {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    headers: Record<string, string>;
    body?: any;
    timeout: number;
}

type ValidationResult = 
    | { success: true; request: ValidatedRequest }
    | { success: false; error: string; field?: keyof NetworkRequest };

function validateNetworkRequest(request: NetworkRequest): ValidationResult {
    // Validação progressiva com else if
    if (!request.url) {
        return { success: false, error: "URL is required", field: "url" };
    } else if (typeof request.url !== "string" || request.url.trim().length === 0) {
        return { success: false, error: "URL must be a non-empty string", field: "url" };
    } else if (!isValidURL(request.url)) {
        return { success: false, error: "URL format is invalid", field: "url" };
    } else if (!request.method) {
        return { success: false, error: "HTTP method is required", field: "method" };
    } else if (!["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
        return { success: false, error: "Invalid HTTP method", field: "method" };
    } else if (request.headers && !isValidHeaders(request.headers)) {
        return { success: false, error: "Invalid headers format", field: "headers" };
    } else if (request.method === "POST" && !request.body) {
        return { success: false, error: "POST requests require a body", field: "body" };
    } else if (request.timeout !== undefined && (typeof request.timeout !== "number" || request.timeout <= 0)) {
        return { success: false, error: "Timeout must be a positive number", field: "timeout" };
    } else {
        // Todas as validações passaram
        const validatedRequest: ValidatedRequest = {
            url: request.url,
            method: request.method,
            headers: request.headers || {},
            body: request.body,
            timeout: request.timeout || 30000 // Default 30s
        };
        
        return { success: true, request: validatedRequest };
    }
}

function isValidURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function isValidHeaders(headers: any): headers is Record<string, string> {
    if (typeof headers !== "object" || headers === null) {
        return false;
    }
    
    return Object.entries(headers).every(([key, value]) => 
        typeof key === "string" && typeof value === "string"
    );
}

// Sistema de autenticação em camadas
interface AuthContext {
    token?: string;
    userId?: string;
    sessionId?: string;
    permissions?: string[];
    expiresAt?: Date;
}

type AuthLevel = "none" | "basic" | "authenticated" | "authorized" | "admin";

function determineAuthLevel(context: AuthContext): AuthLevel {
    if (!context.token) {
        return "none";
    } else if (!isValidToken(context.token)) {
        return "none";
    } else if (!context.userId || !context.sessionId) {
        return "basic";
    } else if (!context.expiresAt || new Date() > context.expiresAt) {
        return "basic"; // Token expired
    } else if (!context.permissions || context.permissions.length === 0) {
        return "authenticated";
    } else if (context.permissions.includes("admin")) {
        return "admin";
    } else {
        return "authorized";
    }
}

function isValidToken(token: string): boolean {
    // Simplified token validation
    return token.length >= 32 && /^[a-zA-Z0-9+/=]+$/.test(token);
}

// Uso da validação em camadas
function processRequest(request: NetworkRequest, auth: AuthContext) {
    const validationResult = validateNetworkRequest(request);
    
    if (!validationResult.success) {
        console.error("Request validation failed:", validationResult.error);
        return;
    }
    
    const authLevel = determineAuthLevel(auth);
    const validRequest = validationResult.request;
    
    // Diferentes tratamentos baseados no nível de auth
    if (authLevel === "none") {
        console.log("Public request to:", validRequest.url);
    } else if (authLevel === "basic") {
        console.log("Basic authenticated request");
    } else if (authLevel === "authenticated") {
        console.log("Fully authenticated request");
    } else if (authLevel === "authorized") {
        console.log("Authorized request with permissions");
    } else if (authLevel === "admin") {
        console.log("Admin request - full access");
    }
}
```

### 3. State Machine Implementation com Else If

Use else if para implementar máquinas de estado simples:

```typescript
type ConnectionState = "disconnected" | "connecting" | "connected" | "reconnecting" | "failed";

interface Connection {
    state: ConnectionState;
    lastError?: string;
    retryCount: number;
    maxRetries: number;
    lastConnectedAt?: Date;
}

type ConnectionAction = 
    | { type: "connect" }
    | { type: "disconnect" }
    | { type: "connection_success" }
    | { type: "connection_failed"; error: string }
    | { type: "retry" };

function connectionReducer(connection: Connection, action: ConnectionAction): Connection {
    if (connection.state === "disconnected") {
        if (action.type === "connect") {
            return { ...connection, state: "connecting", retryCount: 0 };
        } else {
            // Outras ações ignoradas no estado disconnected
            return connection;
        }
    } else if (connection.state === "connecting") {
        if (action.type === "connection_success") {
            return { 
                ...connection, 
                state: "connected", 
                lastConnectedAt: new Date(),
                lastError: undefined 
            };
        } else if (action.type === "connection_failed") {
            if (connection.retryCount < connection.maxRetries) {
                return { 
                    ...connection, 
                    state: "reconnecting", 
                    lastError: action.error,
                    retryCount: connection.retryCount + 1 
                };
            } else {
                return { 
                    ...connection, 
                    state: "failed", 
                    lastError: action.error 
                };
            }
        } else if (action.type === "disconnect") {
            return { ...connection, state: "disconnected" };
        } else {
            return connection;
        }
    } else if (connection.state === "connected") {
        if (action.type === "disconnect") {
            return { ...connection, state: "disconnected" };
        } else if (action.type === "connection_failed") {
            return { 
                ...connection, 
                state: "reconnecting", 
                lastError: action.error,
                retryCount: 1 
            };
        } else {
            return connection;
        }
    } else if (connection.state === "reconnecting") {
        if (action.type === "connection_success") {
            return { 
                ...connection, 
                state: "connected", 
                lastConnectedAt: new Date(),
                lastError: undefined 
            };
        } else if (action.type === "connection_failed") {
            if (connection.retryCount < connection.maxRetries) {
                return { 
                    ...connection, 
                    retryCount: connection.retryCount + 1,
                    lastError: action.error 
                };
            } else {
                return { 
                    ...connection, 
                    state: "failed", 
                    lastError: action.error 
                };
            }
        } else if (action.type === "disconnect") {
            return { ...connection, state: "disconnected" };
        } else {
            return connection;
        }
    } else if (connection.state === "failed") {
        if (action.type === "retry") {
            return { ...connection, state: "connecting", retryCount: 0 };
        } else if (action.type === "disconnect") {
            return { ...connection, state: "disconnected" };
        } else {
            return connection;
        }
    } else {
        // Exhaustiveness check - este ponto nunca deve ser alcançado
        const _exhaustiveCheck: never = connection.state;
        throw new Error(`Unhandled connection state: ${_exhaustiveCheck}`);
    }
}

// Classe para gerenciar conexão com state machine
class ConnectionManager {
    private connection: Connection;
    private listeners: ((state: ConnectionState) => void)[] = [];
    
    constructor(maxRetries: number = 3) {
        this.connection = {
            state: "disconnected",
            retryCount: 0,
            maxRetries
        };
    }
    
    getState(): ConnectionState {
        return this.connection.state;
    }
    
    onStateChange(listener: (state: ConnectionState) => void) {
        this.listeners.push(listener);
    }
    
    private dispatch(action: ConnectionAction) {
        const oldState = this.connection.state;
        this.connection = connectionReducer(this.connection, action);
        
        if (oldState !== this.connection.state) {
            this.listeners.forEach(listener => listener(this.connection.state));
        }
    }
    
    connect() {
        this.dispatch({ type: "connect" });
        
        // Simulate async connection
        setTimeout(() => {
            if (Math.random() > 0.3) { // 70% success rate
                this.dispatch({ type: "connection_success" });
            } else {
                this.dispatch({ 
                    type: "connection_failed", 
                    error: "Connection timeout" 
                });
            }
        }, 1000);
    }
    
    disconnect() {
        this.dispatch({ type: "disconnect" });
    }
    
    retry() {
        this.dispatch({ type: "retry" });
    }
}
```

## 🎯 Aplicabilidade Prática

### 1. Sistema de Roteamento e Middleware

Implementação de sistema de roteamento usando else if para determinar handlers:

```typescript
interface Route {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    handler: (req: Request, res: Response) => void;
    middleware?: Middleware[];
}

interface Request {
    method: string;
    path: string;
    headers: Record<string, string>;
    body?: any;
    params: Record<string, string>;
    query: Record<string, string>;
}

interface Response {
    status(code: number): Response;
    json(data: any): void;
    send(data: string): void;
}

type Middleware = (req: Request, res: Response, next: () => void) => void;

class Router {
    private routes: Route[] = [];
    
    addRoute(route: Route) {
        this.routes.push(route);
    }
    
    handle(req: Request, res: Response) {
        const matchedRoute = this.findMatchingRoute(req);
        
        if (!matchedRoute) {
            res.status(404).json({ error: "Route not found" });
            return;
        }
        
        // Executar middleware em sequência
        this.executeMiddleware(matchedRoute, req, res, () => {
            matchedRoute.handler(req, res);
        });
    }
    
    private findMatchingRoute(req: Request): Route | null {
        for (const route of this.routes) {
            if (this.matchesRoute(route, req)) {
                return route;
            }
        }
        return null;
    }
    
    private matchesRoute(route: Route, req: Request): boolean {
        // Verificação de método HTTP
        if (route.method !== req.method) {
            return false;
        }
        
        // Verificação de path com parâmetros
        return this.matchesPath(route.path, req.path, req);
    }
    
    private matchesPath(routePath: string, requestPath: string, req: Request): boolean {
        const routeSegments = routePath.split('/');
        const requestSegments = requestPath.split('/');
        
        if (routeSegments.length !== requestSegments.length) {
            return false;
        }
        
        req.params = {};
        
        for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i];
            const requestSegment = requestSegments[i];
            
            if (routeSegment.startsWith(':')) {
                // Parâmetro de rota
                const paramName = routeSegment.slice(1);
                req.params[paramName] = requestSegment;
            } else if (routeSegment !== requestSegment) {
                return false;
            }
        }
        
        return true;
    }
    
    private executeMiddleware(
        route: Route, 
        req: Request, 
        res: Response, 
        final: () => void
    ) {
        if (!route.middleware || route.middleware.length === 0) {
            final();
            return;
        }
        
        let currentIndex = 0;
        
        const next = () => {
            if (currentIndex >= route.middleware!.length) {
                final();
                return;
            }
            
            const middleware = route.middleware![currentIndex++];
            middleware(req, res, next);
        };
        
        next();
    }
}

// Sistema de autenticação como middleware
const authMiddleware: Middleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        res.status(401).json({ error: "Authorization header required" });
        return;
    } else if (!authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Bearer token required" });
        return;
    } else {
        const token = authHeader.slice(7);
        
        if (!isValidAuthToken(token)) {
            res.status(401).json({ error: "Invalid token" });
            return;
        } else {
            // Token válido, continuar
            next();
        }
    }
};

// Middleware de logging
const loggingMiddleware: Middleware = (req, res, next) => {
    const startTime = Date.now();
    
    console.log(`${req.method} ${req.path} - Started`);
    
    // Interceptar o response para logging de completion
    const originalJson = res.json;
    const originalSend = res.send;
    
    res.json = function(data: any) {
        const duration = Date.now() - startTime;
        console.log(`${req.method} ${req.path} - Completed in ${duration}ms`);
        return originalJson.call(this, data);
    };
    
    res.send = function(data: string) {
        const duration = Date.now() - startTime;
        console.log(`${req.method} ${req.path} - Completed in ${duration}ms`);
        return originalSend.call(this, data);
    };
    
    next();
};

// Content-type validation middleware
const jsonMiddleware: Middleware = (req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
        const contentType = req.headers["content-type"];
        
        if (!contentType) {
            res.status(400).json({ error: "Content-Type header required" });
            return;
        } else if (!contentType.includes("application/json")) {
            res.status(400).json({ error: "Content-Type must be application/json" });
            return;
        } else if (!req.body) {
            res.status(400).json({ error: "Request body required" });
            return;
        } else {
            next();
        }
    } else {
        next(); // GET e DELETE não precisam de body
    }
};

function isValidAuthToken(token: string): boolean {
    // Simplified token validation
    return token.length >= 32;
}

// Uso do sistema de roteamento
const router = new Router();

// Rotas públicas
router.addRoute({
    path: "/health",
    method: "GET",
    handler: (req, res) => {
        res.json({ status: "healthy" });
    },
    middleware: [loggingMiddleware]
});

// Rotas protegidas
router.addRoute({
    path: "/users/:id",
    method: "GET",
    handler: (req, res) => {
        const userId = req.params.id;
        res.json({ userId, name: `User ${userId}` });
    },
    middleware: [loggingMiddleware, authMiddleware]
});

router.addRoute({
    path: "/users",
    method: "POST",
    handler: (req, res) => {
        console.log("Creating user:", req.body);
        res.status(201).json({ id: Math.random().toString(), ...req.body });
    },
    middleware: [loggingMiddleware, authMiddleware, jsonMiddleware]
});

// Sistema de dispatch de requests
function handleHTTPRequest(req: Request, res: Response) {
    // Parsing de query parameters
    const [path, queryString] = req.path.split('?');
    req.path = path;
    req.query = parseQueryString(queryString || '');
    
    router.handle(req, res);
}

function parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {};
    
    if (queryString) {
        const pairs = queryString.split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        }
    }
    
    return params;
}

// Mock response object para demonstração
class MockResponse implements Response {
    private statusCode: number = 200;
    
    status(code: number): Response {
        this.statusCode = code;
        return this;
    }
    
    json(data: any): void {
        console.log(`Response ${this.statusCode}:`, JSON.stringify(data));
    }
    
    send(data: string): void {
        console.log(`Response ${this.statusCode}:`, data);
    }
}

// Exemplo de uso
const mockRequest: Request = {
    method: "GET",
    path: "/users/123",
    headers: { authorization: "Bearer valid_token_here_12345678901234567890" },
    params: {},
    query: {}
};

const mockResponse = new MockResponse();
handleHTTPRequest(mockRequest, mockResponse);
```

## ⚠️ Limitações e Armadilhas

### 1. Excesso de Condições Aninhadas

```typescript
// ✗ PROBLEMA: Cadeia muito longa de else if
function problematicLongChain(value: any) {
    if (typeof value === "string") {
        console.log("String");
    } else if (typeof value === "number") {
        console.log("Number");
    } else if (typeof value === "boolean") {
        console.log("Boolean");
    } else if (Array.isArray(value)) {
        console.log("Array");
    } else if (value instanceof Date) {
        console.log("Date");
    } else if (value instanceof RegExp) {
        console.log("RegExp");
    } else if (value === null) {
        console.log("Null");
    } else if (value === undefined) {
        console.log("Undefined");
    } else {
        console.log("Unknown");
    }
}

// ✓ SOLUÇÃO: Refatorar para lookup table ou switch
const typeHandlers = {
    string: (value: string) => console.log("String:", value),
    number: (value: number) => console.log("Number:", value),
    boolean: (value: boolean) => console.log("Boolean:", value),
    object: (value: any) => {
        if (Array.isArray(value)) {
            console.log("Array:", value);
        } else if (value instanceof Date) {
            console.log("Date:", value);
        } else if (value instanceof RegExp) {
            console.log("RegExp:", value);
        } else if (value === null) {
            console.log("Null");
        } else {
            console.log("Object:", value);
        }
    },
    undefined: () => console.log("Undefined")
};

function improvedTypeHandling(value: any) {
    const type = typeof value;
    const handler = typeHandlers[type as keyof typeof typeHandlers];
    
    if (handler) {
        handler(value);
    } else {
        console.log("Unknown type:", type);
    }
}
```

### 2. Condições Redundantes ou Sobrepostas

```typescript
// ✗ PROBLEMA: Condições sobrepostas
function problematicOverlap(user: { age: number; role: string }) {
    if (user.age >= 18) {
        console.log("Adult user");
    } else if (user.age >= 21) {
        // Esta condição nunca será alcançada!
        console.log("Legal drinking age");
    } else if (user.role === "admin") {
        console.log("Admin user");
    }
}

// ✓ SOLUÇÃO: Organizar condições em ordem lógica
function correctedConditions(user: { age: number; role: string }) {
    if (user.role === "admin") {
        // Verificar role primeiro se for mais específico
        console.log("Admin user");
    } else if (user.age >= 21) {
        // Condições de idade em ordem decrescente
        console.log("Legal drinking age");
    } else if (user.age >= 18) {
        console.log("Adult user");
    } else {
        console.log("Minor user");
    }
}
```

## 🔗 Interconexões com Outros Conceitos

### Relação com Switch Statements

```typescript
// Else if para lógica complexa
function handleWithElseIf(status: number, hasRetry: boolean, errorCount: number) {
    if (status === 200) {
        console.log("Success");
    } else if (status === 400 && hasRetry && errorCount < 3) {
        console.log("Retryable client error");
    } else if (status >= 400 && status < 500) {
        console.log("Client error");
    } else if (status >= 500) {
        console.log("Server error");
    }
}

// Switch para casos simples
function handleWithSwitch(status: number) {
    switch (true) {
        case status === 200:
            console.log("Success");
            break;
        case status >= 400 && status < 500:
            console.log("Client error");
            break;
        case status >= 500:
            console.log("Server error");
            break;
    }
}
```

## 🚀 Evolução e Tendências Futuras

### Pattern Matching Proposals

```typescript
// Sintaxe futura hipotética
function handleValueFuture(value: string | number | boolean) {
    return match value {
        when string if value.length > 10 => "Long string",
        when string => "Short string", 
        when number if value > 0 => "Positive number",
        when number => "Non-positive number",
        when boolean => value ? "True" : "False"
    }
}
```

---

Este módulo fornece uma compreensão abrangente do uso de else if em TypeScript, demonstrando como criar cadeias de decisão eficientes, type-safe e maintíveis que aproveitam ao máximo o sistema de tipos do TypeScript.