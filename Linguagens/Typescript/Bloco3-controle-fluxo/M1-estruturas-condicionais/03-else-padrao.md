# Módulo 14: Else Padrão - Cláusula Final e Fallback Garantido

## 🎯 Introdução

A **cláusula else** representa o **mecanismo de fallback** essencial nas estruturas condicionais, fornecendo um **caminho de execução garantido** quando todas as condições anteriores falham. Em TypeScript, o else não é apenas uma alternativa final, mas também um elemento crucial para **exhaustiveness checking**, **type safety completeness** e **garantia de cobertura lógica** em sistemas de decisão complexos.

O else padrão atua como uma **rede de segurança** que assegura que o código sempre tenha um comportamento definido, mesmo em cenários imprevistos ou quando todas as condições específicas são falsas. Esta funcionalidade é especialmente importante em TypeScript, onde o compilador utiliza a presença ou ausência de cláusulas else para determinar se todas as possibilidades de tipo foram adequadamente tratadas.

Além de sua função básica como alternativa final, o else em TypeScript integra-se profundamente com o sistema de **control flow analysis**, permitindo que o compilador faça inferências precisas sobre tipos e garantindo que funções sempre retornem valores quando necessário, contribuindo para a robustez e previsibilidade do código.

## 📋 Sumário

1. **Sintaxe e Semântica**: Estrutura e significado da cláusula else
2. **Exhaustiveness Checking**: Garantia de cobertura completa de casos
3. **Type Safety Completeness**: Como else contribui para type safety
4. **Default Values e Fallbacks**: Implementação de valores padrão
5. **Error Handling**: Tratamento de casos inesperados
6. **Control Flow Analysis**: Impacto na análise de fluxo
7. **Performance Implications**: Considerações de execução
8. **Refactoring Patterns**: Transformação e organização de else
9. **Testing Strategies**: Cobertura de teste para cláusulas else
10. **Best Practices**: Diretrizes para uso eficaz de else

## 🧠 Fundamentos Conceituais

### Função de Fallback e Completeness

A cláusula else garante que uma estrutura condicional tenha **cobertura completa**, fornecendo um caminho de execução para todos os casos não explicitamente tratados:

```typescript
// Função que sempre retorna um valor devido ao else
function categorizeAge(age: number): string {
    if (age < 13) {
        return "child";
    } else if (age < 18) {
        return "teenager";
    } else if (age < 65) {
        return "adult";
    } else {
        // Else garante que a função sempre retorna algo
        return "senior";
    }
}

// Sem else - TypeScript detecta possível undefined return
function problematicCategorization(age: number): string {
    if (age < 13) {
        return "child";
    } else if (age < 18) {
        return "teenager";
    }
    // ✗ Erro: Not all code paths return a value
}

// Type narrowing com else para unknown types
function processUnknownValue(value: unknown): string {
    if (typeof value === "string") {
        return `String: ${value}`;
    } else if (typeof value === "number") {
        return `Number: ${value}`;
    } else if (typeof value === "boolean") {
        return `Boolean: ${value}`;
    } else {
        // Else trata todos os outros tipos possíveis
        return `Unknown type: ${typeof value}`;
    }
}
```

### Exhaustiveness Checking com Never

O else pode ser usado para implementar **exhaustiveness checking** explícito usando o tipo `never`:

```typescript
type UserRole = "admin" | "user" | "guest" | "moderator";

function getUserPermissions(role: UserRole): string[] {
    if (role === "admin") {
        return ["read", "write", "delete", "manage"];
    } else if (role === "moderator") {
        return ["read", "write", "moderate"];
    } else if (role === "user") {
        return ["read", "write"];
    } else if (role === "guest") {
        return ["read"];
    } else {
        // Exhaustiveness check: garante que todos os casos foram tratados
        const _exhaustiveCheck: never = role;
        throw new Error(`Unhandled role: ${_exhaustiveCheck}`);
    }
}

// Se um novo role for adicionado ao tipo, TypeScript forçará atualização
type ExtendedUserRole = "admin" | "user" | "guest" | "moderator" | "superuser";

function getExtendedPermissions(role: ExtendedUserRole): string[] {
    if (role === "admin") {
        return ["read", "write", "delete", "manage"];
    } else if (role === "moderator") {
        return ["read", "write", "moderate"];
    } else if (role === "user") {
        return ["read", "write"];
    } else if (role === "guest") {
        return ["read"];
    } else {
        // TypeScript detectará que "superuser" não foi tratado
        const _exhaustiveCheck: never = role; // Erro de compilação aqui
        throw new Error(`Unhandled role: ${_exhaustiveCheck}`);
    }
}
```

### Default Values e Configuration

O else é fundamental para implementar sistemas de configuração com valores padrão:

```typescript
interface DatabaseConfig {
    host?: string;
    port?: number;
    database?: string;
    ssl?: boolean;
    timeout?: number;
    retries?: number;
}

function buildConnectionString(config: DatabaseConfig): string {
    // Valores padrão usando else patterns
    const host = config.host ? config.host : "localhost";
    const port = config.port ? config.port : 5432;
    const database = config.database ? config.database : "defaultdb";
    
    // Pattern mais complexo com validação
    let timeout: number;
    if (config.timeout && config.timeout > 0) {
        timeout = config.timeout;
    } else {
        timeout = 30000; // 30 seconds default
    }
    
    let ssl: boolean;
    if (config.ssl !== undefined) {
        ssl = config.ssl;
    } else {
        // Default baseado no host
        if (host === "localhost" || host === "127.0.0.1") {
            ssl = false;
        } else {
            ssl = true; // Requer SSL para hosts remotos
        }
    }
    
    const sslParam = ssl ? "?ssl=true" : "";
    return `postgresql://${host}:${port}/${database}${sslParam}&timeout=${timeout}`;
}

// Sistema de configuração em camadas com else cascading
interface ApplicationConfig {
    environment?: "development" | "staging" | "production";
    debug?: boolean;
    logLevel?: "error" | "warn" | "info" | "debug";
    features?: {
        analytics?: boolean;
        experiments?: boolean;
        caching?: boolean;
    };
}

function resolveConfig(userConfig: ApplicationConfig = {}): Required<ApplicationConfig> {
    // Determinar environment com fallback
    let environment: "development" | "staging" | "production";
    if (userConfig.environment) {
        environment = userConfig.environment;
    } else if (process.env.NODE_ENV === "production") {
        environment = "production";
    } else if (process.env.NODE_ENV === "staging") {
        environment = "staging";
    } else {
        environment = "development";
    }
    
    // Debug baseado no environment
    let debug: boolean;
    if (userConfig.debug !== undefined) {
        debug = userConfig.debug;
    } else {
        debug = environment === "development";
    }
    
    // Log level baseado no environment e debug
    let logLevel: "error" | "warn" | "info" | "debug";
    if (userConfig.logLevel) {
        logLevel = userConfig.logLevel;
    } else if (debug) {
        logLevel = "debug";
    } else if (environment === "production") {
        logLevel = "error";
    } else {
        logLevel = "info";
    }
    
    // Features com defaults baseados no environment
    const features = {
        analytics: userConfig.features?.analytics !== undefined 
            ? userConfig.features.analytics 
            : environment === "production",
        experiments: userConfig.features?.experiments !== undefined
            ? userConfig.features.experiments
            : environment !== "production",
        caching: userConfig.features?.caching !== undefined
            ? userConfig.features.caching
            : true
    };
    
    return {
        environment,
        debug,
        logLevel,
        features
    };
}
```

## 🔍 Análise Detalhada

### 1. Error Handling e Exception Safety

O else é crucial para implementar tratamento robusto de erros e cenários excepcionais:

```typescript
interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: string[];
}

function validateUserInput(input: any): ValidationResult<{
    name: string;
    email: string;
    age: number;
}> {
    const errors: string[] = [];
    
    // Validação de nome
    if (!input.name) {
        errors.push("Name is required");
    } else if (typeof input.name !== "string") {
        errors.push("Name must be a string");
    } else if (input.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters");
    }
    
    // Validação de email
    if (!input.email) {
        errors.push("Email is required");
    } else if (typeof input.email !== "string") {
        errors.push("Email must be a string");
    } else if (!isValidEmail(input.email)) {
        errors.push("Email format is invalid");
    }
    
    // Validação de idade
    if (input.age === undefined || input.age === null) {
        errors.push("Age is required");
    } else if (typeof input.age !== "number") {
        errors.push("Age must be a number");
    } else if (input.age < 0 || input.age > 150) {
        errors.push("Age must be between 0 and 150");
    }
    
    // Else final determina o resultado
    if (errors.length > 0) {
        return {
            success: false,
            errors
        };
    } else {
        // Todos os valores foram validados
        return {
            success: true,
            data: {
                name: input.name.trim(),
                email: input.email.toLowerCase(),
                age: input.age
            }
        };
    }
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de retry com else para fallback
async function retryableOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            if (attempt === maxRetries) {
                // Último attempt - não fazer retry
                break;
            } else {
                // Tentar novamente após delay
                console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
    
    // Else implícito: se chegou aqui, todos os attempts falharam
    throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

// Wrapper para operações que podem falhar
type SafeOperationResult<T, E = Error> = 
    | { success: true; data: T }
    | { success: false; error: E };

async function safeAsyncOperation<T>(
    operation: () => Promise<T>
): Promise<SafeOperationResult<T>> {
    try {
        const data = await operation();
        return { success: true, data };
    } catch (error) {
        // Else implícito: captura qualquer erro
        return { 
            success: false, 
            error: error instanceof Error ? error : new Error(String(error))
        };
    }
}

// Uso do sistema de error handling
async function processUserData(userData: any) {
    const validation = validateUserInput(userData);
    
    if (!validation.success) {
        console.error("Validation failed:", validation.errors);
        return;
    } else {
        console.log("Validation passed:", validation.data);
    }
    
    // Operação que pode falhar
    const saveResult = await safeAsyncOperation(async () => {
        return await saveToDatabase(validation.data!);
    });
    
    if (saveResult.success) {
        console.log("User saved successfully:", saveResult.data);
    } else {
        console.error("Failed to save user:", saveResult.error.message);
        
        // Retry logic
        const retryResult = await retryableOperation(
            () => saveToDatabase(validation.data!),
            3,
            1000
        ).catch(error => {
            console.error("All retry attempts failed:", error.message);
            return null;
        });
        
        if (retryResult) {
            console.log("User saved after retry:", retryResult);
        } else {
            console.error("Unable to save user after multiple attempts");
        }
    }
}

async function saveToDatabase(data: any): Promise<string> {
    // Simular operação de database que pode falhar
    if (Math.random() > 0.7) {
        throw new Error("Database connection failed");
    }
    return `saved_${Date.now()}`;
}
```

### 2. State Management com Default States

Use else para gerenciar estados padrão em sistemas complexos:

```typescript
type LoadingState = "idle" | "loading" | "success" | "error";

interface AsyncData<T> {
    state: LoadingState;
    data?: T;
    error?: string;
    lastUpdated?: Date;
}

class DataManager<T> {
    private _state: AsyncData<T> = { state: "idle" };
    private listeners: Array<(state: AsyncData<T>) => void> = [];
    
    getState(): AsyncData<T> {
        return { ...this._state };
    }
    
    subscribe(listener: (state: AsyncData<T>) => void) {
        this.listeners.push(listener);
        
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
    
    private setState(newState: Partial<AsyncData<T>>) {
        this._state = { ...this._state, ...newState };
        this.listeners.forEach(listener => listener(this.getState()));
    }
    
    async load(fetcher: () => Promise<T>) {
        // Determinar estado inicial baseado no estado atual
        if (this._state.state === "loading") {
            // Já está carregando - ignore request duplicado
            return;
        } else {
            // Qualquer outro estado pode iniciar loading
            this.setState({ state: "loading" });
        }
        
        try {
            const data = await fetcher();
            this.setState({
                state: "success",
                data,
                error: undefined,
                lastUpdated: new Date()
            });
        } catch (error) {
            // Else implícito: qualquer erro
            this.setState({
                state: "error",
                error: error instanceof Error ? error.message : String(error),
                data: undefined
            });
        }
    }
    
    reset() {
        this.setState({ state: "idle", data: undefined, error: undefined });
    }
    
    // Método para acessar dados com fallback
    getData(defaultValue?: T): T | undefined {
        if (this._state.state === "success" && this._state.data !== undefined) {
            return this._state.data;
        } else {
            // Else para todos os outros estados
            return defaultValue;
        }
    }
    
    // Método para determinar se deve mostrar loading
    isLoading(): boolean {
        return this._state.state === "loading";
    }
    
    // Método para determinar se há erro
    hasError(): boolean {
        return this._state.state === "error";
    }
}

// Sistema de cache com fallbacks
class CacheManager<K, V> {
    private cache = new Map<K, { value: V; expiresAt: number }>();
    private defaultTTL: number;
    
    constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
        this.defaultTTL = defaultTTL;
    }
    
    set(key: K, value: V, ttl?: number): void {
        const expiresAt = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, { value, expiresAt });
    }
    
    get(key: K): V | undefined {
        const item = this.cache.get(key);
        
        if (!item) {
            // Não existe no cache
            return undefined;
        } else if (Date.now() > item.expiresAt) {
            // Expired - remove and return undefined
            this.cache.delete(key);
            return undefined;
        } else {
            // Valid item
            return item.value;
        }
    }
    
    getOrSet(key: K, factory: () => V | Promise<V>, ttl?: number): V | Promise<V> {
        const cached = this.get(key);
        
        if (cached !== undefined) {
            return cached;
        } else {
            // Cache miss - use factory
            const value = factory();
            
            if (value instanceof Promise) {
                return value.then(resolvedValue => {
                    this.set(key, resolvedValue, ttl);
                    return resolvedValue;
                });
            } else {
                this.set(key, value, ttl);
                return value;
            }
        }
    }
    
    // Cleanup expired entries
    cleanup(): number {
        const now = Date.now();
        let removed = 0;
        
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
                removed++;
            }
        }
        
        return removed;
    }
}

// Uso dos managers
const userDataManager = new DataManager<{ id: string; name: string; email: string }>();
const cache = new CacheManager<string, any>();

async function fetchUserWithCache(userId: string) {
    // Tentar cache primeiro
    const cached = cache.get(`user_${userId}`);
    
    if (cached) {
        console.log("Cache hit for user:", userId);
        return cached;
    } else {
        console.log("Cache miss for user:", userId);
        
        // Usar DataManager para fetch
        await userDataManager.load(async () => {
            // Simular API call
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user: ${response.statusText}`);
            }
            return response.json();
        });
        
        const userData = userDataManager.getData();
        
        if (userData) {
            // Cache successful result
            cache.set(`user_${userId}`, userData, 10 * 60 * 1000); // 10 minutes
            return userData;
        } else {
            // Else: no data available
            throw new Error("No user data available");
        }
    }
}
```

### 3. Configuration Resolution com Hierarchical Defaults

Implemente sistemas de configuração com múltiplas camadas de fallback:

```typescript
interface ThemeConfig {
    primaryColor?: string;
    secondaryColor?: string;
    fontSize?: number;
    fontFamily?: string;
    spacing?: {
        small?: number;
        medium?: number;
        large?: number;
    };
    breakpoints?: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
    };
}

class ThemeResolver {
    private systemDefaults: Required<ThemeConfig> = {
        primaryColor: "#007bff",
        secondaryColor: "#6c757d",
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
        spacing: {
            small: 8,
            medium: 16,
            large: 24
        },
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        }
    };
    
    private userPreferences?: Partial<ThemeConfig>;
    private systemPreferences?: Partial<ThemeConfig>;
    
    constructor() {
        this.loadSystemPreferences();
        this.loadUserPreferences();
    }
    
    private loadSystemPreferences() {
        // Detectar preferências do sistema (dark mode, reduced motion, etc.)
        if (typeof window !== "undefined") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            
            if (prefersDark) {
                this.systemPreferences = {
                    primaryColor: "#0d6efd",
                    secondaryColor: "#495057"
                };
            } else {
                // Else: light mode preferences
                this.systemPreferences = {
                    primaryColor: "#007bff",
                    secondaryColor: "#6c757d"
                };
            }
        }
    }
    
    private loadUserPreferences() {
        // Carregar preferências salvas do usuário
        if (typeof localStorage !== "undefined") {
            const saved = localStorage.getItem("theme-preferences");
            if (saved) {
                try {
                    this.userPreferences = JSON.parse(saved);
                } catch {
                    // Else: erro no parsing - usar defaults
                    this.userPreferences = {};
                }
            }
        }
    }
    
    resolveTheme(overrides?: Partial<ThemeConfig>): Required<ThemeConfig> {
        // Resolver cada propriedade com cascading fallbacks
        const theme: Required<ThemeConfig> = {
            primaryColor: this.resolveProperty("primaryColor", overrides),
            secondaryColor: this.resolveProperty("secondaryColor", overrides),
            fontSize: this.resolveProperty("fontSize", overrides),
            fontFamily: this.resolveProperty("fontFamily", overrides),
            spacing: {
                small: this.resolveNestedProperty("spacing", "small", overrides),
                medium: this.resolveNestedProperty("spacing", "medium", overrides),
                large: this.resolveNestedProperty("spacing", "large", overrides)
            },
            breakpoints: {
                mobile: this.resolveNestedProperty("breakpoints", "mobile", overrides),
                tablet: this.resolveNestedProperty("breakpoints", "tablet", overrides),
                desktop: this.resolveNestedProperty("breakpoints", "desktop", overrides)
            }
        };
        
        return theme;
    }
    
    private resolveProperty<K extends keyof ThemeConfig>(
        key: K, 
        overrides?: Partial<ThemeConfig>
    ): Required<ThemeConfig>[K] {
        // Ordem de precedência: overrides > user > system > defaults
        if (overrides && overrides[key] !== undefined) {
            return overrides[key] as Required<ThemeConfig>[K];
        } else if (this.userPreferences && this.userPreferences[key] !== undefined) {
            return this.userPreferences[key] as Required<ThemeConfig>[K];
        } else if (this.systemPreferences && this.systemPreferences[key] !== undefined) {
            return this.systemPreferences[key] as Required<ThemeConfig>[K];
        } else {
            // Else final: system defaults
            return this.systemDefaults[key];
        }
    }
    
    private resolveNestedProperty<
        P extends "spacing" | "breakpoints",
        K extends keyof Required<ThemeConfig>[P]
    >(
        parent: P,
        key: K,
        overrides?: Partial<ThemeConfig>
    ): Required<ThemeConfig>[P][K] {
        // Resolver propriedades aninhadas com mesma lógica de cascata
        if (overrides?.[parent] && overrides[parent]![key] !== undefined) {
            return overrides[parent]![key] as Required<ThemeConfig>[P][K];
        } else if (this.userPreferences?.[parent] && this.userPreferences[parent]![key] !== undefined) {
            return this.userPreferences[parent]![key] as Required<ThemeConfig>[P][K];
        } else if (this.systemPreferences?.[parent] && this.systemPreferences[parent]![key] !== undefined) {
            return this.systemPreferences[parent]![key] as Required<ThemeConfig>[P][K];
        } else {
            // Else: system default for nested property
            return this.systemDefaults[parent][key];
        }
    }
    
    updateUserPreferences(preferences: Partial<ThemeConfig>) {
        this.userPreferences = { ...this.userPreferences, ...preferences };
        
        // Salvar no localStorage
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("theme-preferences", JSON.stringify(this.userPreferences));
        }
    }
    
    resetToDefaults() {
        this.userPreferences = {};
        if (typeof localStorage !== "undefined") {
            localStorage.removeItem("theme-preferences");
        }
    }
}

// Factory para criar temas específicos
class ThemeFactory {
    private resolver = new ThemeResolver();
    
    createDarkTheme(): Required<ThemeConfig> {
        return this.resolver.resolveTheme({
            primaryColor: "#0d6efd",
            secondaryColor: "#495057"
        });
    }
    
    createLightTheme(): Required<ThemeConfig> {
        return this.resolver.resolveTheme({
            primaryColor: "#007bff",
            secondaryColor: "#6c757d"
        });
    }
    
    createHighContrastTheme(): Required<ThemeConfig> {
        return this.resolver.resolveTheme({
            primaryColor: "#000000",
            secondaryColor: "#ffffff",
            fontSize: 18 // Larger font for accessibility
        });
    }
    
    createCompactTheme(): Required<ThemeConfig> {
        return this.resolver.resolveTheme({
            fontSize: 14,
            spacing: {
                small: 4,
                medium: 8,
                large: 12
            }
        });
    }
}

// Uso do sistema de temas
const themeFactory = new ThemeFactory();

function applyTheme(themeName: "light" | "dark" | "high-contrast" | "compact" | "auto") {
    let theme: Required<ThemeConfig>;
    
    if (themeName === "light") {
        theme = themeFactory.createLightTheme();
    } else if (themeName === "dark") {
        theme = themeFactory.createDarkTheme();
    } else if (themeName === "high-contrast") {
        theme = themeFactory.createHighContrastTheme();
    } else if (themeName === "compact") {
        theme = themeFactory.createCompactTheme();
    } else {
        // Else: auto theme based on system preferences
        const prefersDark = typeof window !== "undefined" && 
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        if (prefersDark) {
            theme = themeFactory.createDarkTheme();
        } else {
            theme = themeFactory.createLightTheme();
        }
    }
    
    console.log("Applied theme:", theme);
    return theme;
}
```

## 🎯 Aplicabilidade Prática

### 1. Sistema de Processamento de Dados com Fallbacks

```typescript
interface DataProcessor<T, R> {
    name: string;
    canProcess: (data: T) => boolean;
    process: (data: T) => R;
}

class ProcessingPipeline<T, R> {
    private processors: DataProcessor<T, R>[] = [];
    private defaultProcessor?: DataProcessor<T, R>;
    
    addProcessor(processor: DataProcessor<T, R>) {
        this.processors.push(processor);
    }
    
    setDefaultProcessor(processor: DataProcessor<T, R>) {
        this.defaultProcessor = processor;
    }
    
    process(data: T): R {
        // Tentar cada processor em ordem
        for (const processor of this.processors) {
            if (processor.canProcess(data)) {
                console.log(`Processing with: ${processor.name}`);
                return processor.process(data);
            }
        }
        
        // Else: nenhum processor específico pode tratar
        if (this.defaultProcessor) {
            console.log(`Using default processor: ${this.defaultProcessor.name}`);
            return this.defaultProcessor.process(data);
        } else {
            throw new Error("No processor can handle this data and no default processor set");
        }
    }
}

// Processors específicos para diferentes tipos de arquivo
const imageProcessor: DataProcessor<File, string> = {
    name: "ImageProcessor",
    canProcess: (file: File) => file.type.startsWith("image/"),
    process: (file: File) => `Processed image: ${file.name} (${file.size} bytes)`
};

const videoProcessor: DataProcessor<File, string> = {
    name: "VideoProcessor", 
    canProcess: (file: File) => file.type.startsWith("video/"),
    process: (file: File) => `Processed video: ${file.name} (${file.size} bytes)`
};

const documentProcessor: DataProcessor<File, string> = {
    name: "DocumentProcessor",
    canProcess: (file: File) => 
        file.type === "application/pdf" || 
        file.type.startsWith("application/vnd.openxmlformats"),
    process: (file: File) => `Processed document: ${file.name}`
};

// Processor padrão para arquivos não reconhecidos
const genericProcessor: DataProcessor<File, string> = {
    name: "GenericProcessor",
    canProcess: () => true, // Pode processar qualquer coisa
    process: (file: File) => `Generic processing for: ${file.name} (type: ${file.type})`
};

// Setup do pipeline
const filePipeline = new ProcessingPipeline<File, string>();
filePipeline.addProcessor(imageProcessor);
filePipeline.addProcessor(videoProcessor);
filePipeline.addProcessor(documentProcessor);
filePipeline.setDefaultProcessor(genericProcessor);

// Sistema de validação em cascata
interface ValidationRule<T> {
    name: string;
    validate: (data: T) => boolean;
    errorMessage: string;
}

class Validator<T> {
    private rules: ValidationRule<T>[] = [];
    private allowPartialSuccess = false;
    
    addRule(rule: ValidationRule<T>) {
        this.rules.push(rule);
    }
    
    setAllowPartialSuccess(allow: boolean) {
        this.allowPartialSuccess = allow;
    }
    
    validate(data: T): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        for (const rule of this.rules) {
            if (!rule.validate(data)) {
                errors.push(rule.errorMessage);
                
                // Se não permite sucesso parcial, para na primeira falha
                if (!this.allowPartialSuccess) {
                    break;
                }
            }
        }
        
        // Else implícito: se errors.length === 0, validação passou
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Exemplo de uso com file upload
interface FileUpload {
    file: File;
    metadata?: {
        description?: string;
        tags?: string[];
    };
}

const fileValidator = new Validator<FileUpload>();

fileValidator.addRule({
    name: "FileSize",
    validate: (upload) => upload.file.size <= 10 * 1024 * 1024, // 10MB
    errorMessage: "File size must be 10MB or less"
});

fileValidator.addRule({
    name: "FileType",
    validate: (upload) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
        return allowedTypes.includes(upload.file.type);
    },
    errorMessage: "File type not allowed"
});

fileValidator.addRule({
    name: "FileName",
    validate: (upload) => upload.file.name.length > 0 && upload.file.name.length <= 255,
    errorMessage: "File name must be between 1 and 255 characters"
});

function processFileUpload(upload: FileUpload) {
    // Validar primeiro
    const validation = fileValidator.validate(upload);
    
    if (!validation.isValid) {
        console.error("Validation failed:", validation.errors);
        return { success: false, errors: validation.errors };
    } else {
        console.log("Validation passed, processing file...");
        
        try {
            const result = filePipeline.process(upload.file);
            return { success: true, result };
        } catch (error) {
            // Else implícito: erro no processamento
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Processing failed:", errorMessage);
            return { success: false, errors: [errorMessage] };
        }
    }
}

// Simular upload
const mockFile = new File(["test content"], "test.jpg", { type: "image/jpeg" });
const upload: FileUpload = {
    file: mockFile,
    metadata: {
        description: "Test image",
        tags: ["test", "image"]
    }
};

console.log(processFileUpload(upload));
```

## ⚠️ Limitações e Armadilhas

### 1. Else Desnecessário

```typescript
// ✗ PROBLEMA: Else desnecessário após return
function problematicElse(value: number): string {
    if (value > 0) {
        return "positive";
    } else {
        // Este else é desnecessário - função já retornou acima
        return "non-positive";
    }
}

// ✓ SOLUÇÃO: Remover else desnecessário
function cleanerVersion(value: number): string {
    if (value > 0) {
        return "positive";
    }
    
    return "non-positive"; // Mais limpo sem else
}
```

### 2. Else Muito Genérico

```typescript
// ✗ PROBLEMA: Else muito genérico sem tratamento específico
function problematicGenericElse(type: string) {
    if (type === "user") {
        handleUser();
    } else if (type === "admin") {
        handleAdmin();
    } else {
        // Muito genérico - não trata casos específicos
        console.log("Unknown type");
    }
}

// ✓ SOLUÇÃO: Else mais específico com logging e recovery
function betterErrorHandling(type: string) {
    if (type === "user") {
        handleUser();
    } else if (type === "admin") {
        handleAdmin();
    } else {
        // Tratamento mais específico
        console.warn(`Unexpected user type: ${type}. Defaulting to guest access.`);
        logUnknownType(type); // Log para investigação
        handleGuest(); // Fallback seguro
    }
}

function handleUser() { console.log("Handling user"); }
function handleAdmin() { console.log("Handling admin"); }
function handleGuest() { console.log("Handling guest"); }
function logUnknownType(type: string) { console.log("Logged unknown type:", type); }
```

## 🔗 Interconexões com Outros Conceitos

### Relação com Optional Chaining e Nullish Coalescing

```typescript
// Combinação de else com operadores modernos
function processUser(user?: { name?: string; settings?: { theme?: string } }) {
    // Usando else tradicional
    if (user && user.name) {
        console.log(`Hello, ${user.name}`);
    } else {
        console.log("Hello, Guest");
    }
    
    // Usando nullish coalescing (mais conciso)
    const name = user?.name ?? "Guest";
    console.log(`Hello, ${name}`);
    
    // Combinação de ambos para lógica mais complexa
    if (user?.settings?.theme) {
        applyTheme(user.settings.theme);
    } else {
        // Determinar tema baseado em outras condições
        const systemTheme = detectSystemTheme();
        if (systemTheme) {
            applyTheme(systemTheme);
        } else {
            applyTheme("light"); // Default final
        }
    }
}

function detectSystemTheme(): string | null {
    return typeof window !== "undefined" && 
           window.matchMedia("(prefers-color-scheme: dark)").matches 
           ? "dark" 
           : null;
}

function applyTheme(theme: string) {
    console.log(`Applying theme: ${theme}`);
}
```

## 🚀 Evolução e Tendências Futuras

### Pattern Matching com Else

```typescript
// Sintaxe futura hipotética
function handleResponseFuture(response: { status: number; data?: any }) {
    return match response.status {
        when 200 => response.data,
        when 400..499 => { error: "Client error", status: response.status },
        when 500..599 => { error: "Server error", status: response.status },
        else => { error: "Unknown status", status: response.status }
    }
}

// Equivalente atual
function handleResponseCurrent(response: { status: number; data?: any }) {
    if (response.status === 200) {
        return response.data;
    } else if (response.status >= 400 && response.status < 500) {
        return { error: "Client error", status: response.status };
    } else if (response.status >= 500 && response.status < 600) {
        return { error: "Server error", status: response.status };
    } else {
        return { error: "Unknown status", status: response.status };
    }
}
```

---

Este módulo estabelece uma compreensão profunda da cláusula else como elemento essencial para completeness, error handling e robustez em sistemas TypeScript, demonstrando sua importância para criar código confiável e maintível.