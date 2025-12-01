# Módulo 10: Type Guards para Unions - Verificação Segura de Tipos em Runtime

## 🎯 Introdução

**Type Guards** são mecanismos fundamentais no TypeScript que permitem verificar e refinar tipos union em tempo de execução, garantindo acesso seguro a propriedades e métodos específicos de cada tipo. Eles representam a ponte crucial entre o sistema de tipos estático do TypeScript e as verificações dinâmicas necessárias em JavaScript, proporcionando tanto segurança quanto expressividade.

A importância dos type guards vai além da simples verificação de tipos - eles implementam o conceito de **type narrowing**, onde o TypeScript refina automaticamente os tipos disponíveis baseado nas verificações condicionais realizadas. Este mecanismo permite escrever código mais seguro e expressivo, eliminando a necessidade de type assertions perigosas e fornecendo garantias de tipo verificadas pelo compilador.

Type guards são especialmente críticos ao trabalhar com dados externos, APIs, bibliotecas de terceiros e qualquer cenário onde a informação de tipo não pode ser garantida em tempo de compilação. Eles estabelecem contratos claros sobre quais verificações são necessárias para acessar propriedades específicas, melhorando tanto a robustez quanto a legibilidade do código.

## 📋 Sumário

1. **Conceitos Fundamentais**: O que são type guards e por que são necessários
2. **Typeof Guards**: Verificação de tipos primitivos com operador typeof
3. **Instanceof Guards**: Verificação de instâncias de classe e construtores
4. **In Operator Guards**: Verificação de propriedades em objetos
5. **User-Defined Type Guards**: Criação de type guards customizados
6. **Assertion Functions**: Funções que garantem tipos através de assertions
7. **Discriminated Union Guards**: Verificação baseada em propriedades discriminantes
8. **Complex Type Guards**: Combinação e composição de múltiplos guards
9. **Performance Considerations**: Otimização e custo de verificações
10. **Error Handling**: Tratamento de casos não cobertos por guards
11. **Testing Type Guards**: Estratégias de teste para verificações de tipo
12. **Advanced Patterns**: Padrões avançados e técnicas especializadas

## 🧠 Fundamentos Teóricos

### Teoria do Type Narrowing

Type narrowing é o processo pelo qual o TypeScript **refina tipos union** baseado em verificações condicionais no código. O compilador utiliza **Control Flow Analysis (CFA)** para rastrear como os tipos são refinados através de branches condicionais, mantendo informação precisa sobre quais tipos são possíveis em cada ponto do programa.

O algoritmo de CFA funciona através de **eliminação progressiva**: cada type guard elimina tipos incompatíveis da união, deixando apenas os tipos que passaram na verificação. Este processo é **monotônico** - tipos nunca são adicionados de volta a uma união uma vez eliminados em um branch específico.

```typescript
// Demonstração do algoritmo de eliminação progressiva
function demonstrateNarrowing(value: string | number | boolean | Date) {
    // Aqui: value é string | number | boolean | Date
    
    if (typeof value === "string") {
        // Elimina: number, boolean, Date
        // Restante: string
        console.log(value.toUpperCase()); // ✓ Seguro: value é definitivamente string
        return;
    }
    
    // Aqui: value é number | boolean | Date (string foi eliminado)
    
    if (typeof value === "number") {
        // Elimina: boolean, Date 
        // Restante: number
        console.log(value.toFixed(2)); // ✓ Seguro: value é definitivamente number
        return;
    }
    
    // Aqui: value é boolean | Date (string e number foram eliminados)
    
    if (value instanceof Date) {
        // Elimina: boolean
        // Restante: Date
        console.log(value.toISOString()); // ✓ Seguro: value é definitivamente Date
        return;
    }
    
    // Aqui: value é boolean (por eliminação de todos os outros tipos)
    console.log(value ? "verdadeiro" : "falso"); // ✓ Seguro: value é definitivamente boolean
}
```

### Semântica de Verificação de Tipos

Type guards implementam verificações de tipo que seguem diferentes **semânticas de verdade**. Cada tipo de guard tem características específicas de precisão, performance e aplicabilidade:

**Typeof Guards**: Verificação baseada em tipos primitivos JavaScript
- **Precisão**: Alta para primitivos, limitada para objetos
- **Performance**: Excelente (operação nativa)
- **Aplicabilidade**: Tipos primitivos e funções

**Instanceof Guards**: Verificação baseada em cadeia de protótipos
- **Precisão**: Alta para classes e construtores
- **Performance**: Boa (verificação de protótipo)
- **Aplicabilidade**: Classes, construtores built-in, objetos complexos

**Property Guards (in operator)**: Verificação de existência de propriedades
- **Precisão**: Moderada (pode haver propriedades undefined)
- **Performance**: Boa (acesso direto à propriedade)
- **Aplicabilidade**: Objetos com propriedades discriminantes

```typescript
// Comparação de semânticas diferentes
interface Bird {
    type: "bird";
    fly(): void;
}

interface Fish {
    type: "fish"; 
    swim(): void;
}

type Animal = Bird | Fish;

function processAnimal(animal: Animal) {
    // Property guard - verificação discriminante
    if (animal.type === "bird") {
        // Semântica: verificação de valor de propriedade
        animal.fly(); // ✓ TypeScript sabe que é Bird
    }
    
    // In operator guard - verificação de existência
    if ("fly" in animal) {
        // Semântica: verificação de existência de propriedade
        animal.fly(); // ✓ TypeScript infere que tem método fly
    }
    
    // User-defined guard - lógica customizada
    if (isBird(animal)) {
        // Semântica: lógica de verificação definida pelo usuário
        animal.fly(); // ✓ TypeScript confia na função de verificação
    }
}

// User-defined type guard
function isBird(animal: Animal): animal is Bird {
    return animal.type === "bird";
}
```

### Control Flow Analysis Avançado

O TypeScript implementa análise de fluxo de controle sofisticada que rastreia type narrowing através de estruturas de controle complexas, incluindo loops, funções aninhadas e callbacks.

```typescript
// CFA através de estruturas complexas
function complexControlFlow(items: Array<string | number | boolean>) {
    const strings: string[] = [];
    const numbers: number[] = [];
    const booleans: boolean[] = [];
    
    // CFA através de loop
    for (const item of items) {
        // Dentro do loop: item é string | number | boolean
        
        if (typeof item === "string") {
            // CFA sabe que item é string aqui
            strings.push(item); // ✓ Sem type assertion necessária
            
            // CFA através de função aninhada
            const processString = () => {
                // item ainda é conhecido como string aqui
                return item.toUpperCase();
            };
            
            processString();
        } else if (typeof item === "number") {
            // CFA sabe que item é number aqui
            numbers.push(item); // ✓ Sem type assertion necessária
        } else {
            // CFA sabe que item é boolean aqui (por eliminação)
            booleans.push(item); // ✓ Sem type assertion necessária
        }
    }
    
    return { strings, numbers, booleans };
}
```

## 🔍 Análise Detalhada

### 1. Typeof Guards - Verificação de Primitivos

O operador `typeof` é o type guard mais fundamental, fornecendo verificação type-safe para todos os tipos primitivos JavaScript.

```typescript
// Typeof guard completo para todos os primitivos
function processValue(value: unknown): string {
    if (typeof value === "string") {
        // value é string aqui
        return `String: ${value.toUpperCase()}`;
    }
    
    if (typeof value === "number") {
        // value é number aqui
        if (Number.isFinite(value)) {
            return `Finite Number: ${value.toFixed(2)}`;
        } else if (Number.isNaN(value)) {
            return "NaN";
        } else {
            return `Infinite Number: ${value > 0 ? '+' : '-'}Infinity`;
        }
    }
    
    if (typeof value === "boolean") {
        // value é boolean aqui
        return `Boolean: ${value ? 'true' : 'false'}`;
    }
    
    if (typeof value === "undefined") {
        // value é undefined aqui
        return "Undefined value";
    }
    
    if (typeof value === "symbol") {
        // value é symbol aqui
        return `Symbol: ${value.toString()}`;
    }
    
    if (typeof value === "bigint") {
        // value é bigint aqui
        return `BigInt: ${value.toString()}`;
    }
    
    if (typeof value === "function") {
        // value é function aqui
        return `Function: ${value.name || 'anonymous'}`;
    }
    
    if (typeof value === "object") {
        // value é object | null aqui
        if (value === null) {
            return "Null";
        } else {
            return `Object: ${value.constructor.name}`;
        }
    }
    
    // Este ponto nunca deve ser alcançado com unknown
    return "Unknown type";
}

// Typeof guards com tipos específicos
type PrimitiveValue = string | number | boolean | symbol | bigint;

function processPrimitive(value: PrimitiveValue): string {
    switch (typeof value) {
        case "string":
            // Narrowed to string
            return value.repeat(2);
        case "number":
            // Narrowed to number
            return value.toString(16);
        case "boolean":
            // Narrowed to boolean
            return value ? "YES" : "NO";
        case "symbol":
            // Narrowed to symbol
            return value.description || "unnamed symbol";
        case "bigint":
            // Narrowed to bigint
            return value.toString() + "n";
        default:
            // TypeScript sabe que este caso nunca acontecerá
            const _exhaustiveCheck: never = value;
            throw new Error("Unreachable code");
    }
}
```

### 2. Instanceof Guards - Verificação de Classes e Construtores

Instanceof guards verificam se um objeto é instância de um construtor específico, sendo essenciais para working com classes e objetos built-in.

```typescript
// Classe base e derivadas para demonstração
abstract class Shape {
    abstract area(): number;
    abstract perimeter(): number;
}

class Circle extends Shape {
    constructor(public radius: number) {
        super();
    }
    
    area(): number {
        return Math.PI * this.radius ** 2;
    }
    
    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }
    
    // Método específico de Circle
    diameter(): number {
        return this.radius * 2;
    }
}

class Rectangle extends Shape {
    constructor(public width: number, public height: number) {
        super();
    }
    
    area(): number {
        return this.width * this.height;
    }
    
    perimeter(): number {
        return 2 * (this.width + this.height);
    }
    
    // Método específico de Rectangle
    diagonal(): number {
        return Math.sqrt(this.width ** 2 + this.height ** 2);
    }
}

class Triangle extends Shape {
    constructor(
        public sideA: number,
        public sideB: number, 
        public sideC: number
    ) {
        super();
    }
    
    area(): number {
        // Fórmula de Heron
        const s = this.perimeter() / 2;
        return Math.sqrt(s * (s - this.sideA) * (s - this.sideB) * (s - this.sideC));
    }
    
    perimeter(): number {
        return this.sideA + this.sideB + this.sideC;
    }
    
    // Método específico de Triangle
    isRightTriangle(): boolean {
        const sides = [this.sideA, this.sideB, this.sideC].sort((a, b) => a - b);
        return Math.abs(sides[0] ** 2 + sides[1] ** 2 - sides[2] ** 2) < 0.0001;
    }
}

// Função que usa instanceof guards
function processShape(shape: Shape): string {
    // Verificações com instanceof
    if (shape instanceof Circle) {
        // shape é Circle aqui
        return `Circle - Area: ${shape.area().toFixed(2)}, Diameter: ${shape.diameter()}`;
    }
    
    if (shape instanceof Rectangle) {
        // shape é Rectangle aqui
        return `Rectangle - Area: ${shape.area()}, Diagonal: ${shape.diagonal().toFixed(2)}`;
    }
    
    if (shape instanceof Triangle) {
        // shape é Triangle aqui
        const rightTriangle = shape.isRightTriangle() ? " (Right Triangle)" : "";
        return `Triangle - Area: ${shape.area().toFixed(2)}${rightTriangle}`;
    }
    
    // Fallback para casos não cobertos
    return `Unknown Shape - Area: ${shape.area()}`;
}

// Instanceof com tipos built-in
type DateLike = Date | string | number;

function processDateLike(value: DateLike): Date {
    if (value instanceof Date) {
        // value é Date aqui
        return new Date(value.getTime()); // Clone da data
    }
    
    if (typeof value === "string") {
        // value é string aqui
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) {
            throw new Error(`Invalid date string: ${value}`);
        }
        return parsed;
    }
    
    // value deve ser number aqui
    return new Date(value);
}

// Instanceof com múltiplos built-ins
type CollectionType = Array<any> | Set<any> | Map<any, any> | WeakSet<any> | WeakMap<any, any>;

function getCollectionInfo(collection: CollectionType): string {
    if (collection instanceof Array) {
        return `Array with ${collection.length} items`;
    }
    
    if (collection instanceof Set) {
        return `Set with ${collection.size} unique items`;
    }
    
    if (collection instanceof Map) {
        return `Map with ${collection.size} key-value pairs`;
    }
    
    if (collection instanceof WeakSet) {
        return "WeakSet (size not available)";
    }
    
    if (collection instanceof WeakMap) {
        return "WeakMap (size not available)";
    }
    
    // Este caso nunca deve acontecer se o tipo estiver correto
    const _exhaustiveCheck: never = collection;
    throw new Error("Unknown collection type");
}
```

### 3. In Operator Guards - Verificação de Propriedades

O operador `in` verifica a existência de propriedades em objetos, sendo fundamental para discriminated unions e verificação de APIs opcionais.

```typescript
// Interfaces com propriedades discriminantes
interface Cat {
    type: "cat";
    name: string;
    meow(): void;
    purr?(): void; // Propriedade opcional
}

interface Dog {
    type: "dog";
    name: string;
    bark(): void;
    wagTail(): void;
}

interface Bird {
    type: "bird";
    name: string;
    fly(): void;
    chirp(): void;
}

type Pet = Cat | Dog | Bird;

// In operator guards para métodos específicos
function interactWithPet(pet: Pet): void {
    // Verificação de propriedade discriminante
    if (pet.type === "cat") {
        // pet é Cat aqui
        pet.meow();
        
        // Verificação de propriedade opcional
        if ("purr" in pet && pet.purr) {
            pet.purr();
        }
    } else if (pet.type === "dog") {
        // pet é Dog aqui
        pet.bark();
        pet.wagTail();
    } else {
        // pet é Bird aqui (por eliminação)
        pet.fly();
        pet.chirp();
    }
}

// In operator para verificar capabilities
function checkPetCapabilities(pet: Pet): string[] {
    const capabilities: string[] = [];
    
    if ("meow" in pet) {
        capabilities.push("can meow");
    }
    
    if ("bark" in pet) {
        capabilities.push("can bark");
    }
    
    if ("fly" in pet) {
        capabilities.push("can fly");
    }
    
    if ("purr" in pet && pet.purr) {
        capabilities.push("can purr");
    }
    
    return capabilities;
}

// In operator com objetos dinâmicos
interface APIResponse {
    success: boolean;
    data?: any;
    error?: string;
    metadata?: {
        timestamp: number;
        requestId: string;
    };
}

function processAPIResponse(response: APIResponse): void {
    if (response.success) {
        if ("data" in response && response.data !== undefined) {
            console.log("Processing successful response data:", response.data);
        }
        
        if ("metadata" in response && response.metadata) {
            console.log(`Request ${response.metadata.requestId} completed at ${new Date(response.metadata.timestamp)}`);
        }
    } else {
        if ("error" in response && response.error) {
            console.error("API Error:", response.error);
        }
    }
}

// Verificação complexa com múltiplas propriedades
interface ConfigObject {
    [key: string]: any;
}

function validateConfig(config: ConfigObject): boolean {
    // Verificações obrigatórias
    const requiredFields = ["host", "port", "database"];
    
    for (const field of requiredFields) {
        if (!(field in config)) {
            console.error(`Missing required field: ${field}`);
            return false;
        }
    }
    
    // Verificações opcionais
    if ("ssl" in config && typeof config.ssl === "object") {
        if (!("cert" in config.ssl) || !("key" in config.ssl)) {
            console.error("SSL config requires both cert and key");
            return false;
        }
    }
    
    if ("pool" in config) {
        if (typeof config.pool !== "object" || !("min" in config.pool) || !("max" in config.pool)) {
            console.error("Pool config requires min and max values");
            return false;
        }
    }
    
    return true;
}
```

### 4. User-Defined Type Guards - Guards Customizados

User-defined type guards permitem criar lógica de verificação customizada com garantias de tipo fornecidas pelo desenvolvedor.

```typescript
// Type guards básicos para tipos personalizados
interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user" | "guest";
}

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
}

// User-defined type guards
function isUser(obj: any): obj is User {
    return (
        obj &&
        typeof obj === "object" &&
        typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        typeof obj.email === "string" &&
        ["admin", "user", "guest"].includes(obj.role)
    );
}

function isProduct(obj: any): obj is Product {
    return (
        obj &&
        typeof obj === "object" &&
        typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        typeof obj.price === "number" &&
        typeof obj.category === "string"
    );
}

// Uso dos type guards customizados
function processEntity(entity: unknown): string {
    if (isUser(entity)) {
        // entity é User aqui
        return `User: ${entity.name} (${entity.email}) - Role: ${entity.role}`;
    }
    
    if (isProduct(entity)) {
        // entity é Product aqui
        return `Product: ${entity.name} - $${entity.price} (${entity.category})`;
    }
    
    return "Unknown entity type";
}

// Type guards para validação robusta
interface ValidatedData<T> {
    isValid: true;
    data: T;
    errors?: never;
}

interface InvalidData {
    isValid: false;
    data?: never;
    errors: string[];
}

type ValidationResult<T> = ValidatedData<T> | InvalidData;

// Type guard genérico com validação
function validateUser(obj: any): ValidationResult<User> {
    const errors: string[] = [];
    
    if (!obj || typeof obj !== "object") {
        errors.push("Expected object");
        return { isValid: false, errors };
    }
    
    if (typeof obj.id !== "number") {
        errors.push("id must be a number");
    }
    
    if (typeof obj.name !== "string" || obj.name.trim().length === 0) {
        errors.push("name must be a non-empty string");
    }
    
    if (typeof obj.email !== "string" || !obj.email.includes("@")) {
        errors.push("email must be a valid email address");
    }
    
    if (!["admin", "user", "guest"].includes(obj.role)) {
        errors.push("role must be admin, user, or guest");
    }
    
    if (errors.length > 0) {
        return { isValid: false, errors };
    }
    
    return { isValid: true, data: obj as User };
}

// Função que usa validação robusta
function processValidatedUser(userData: unknown): void {
    const validation = validateUser(userData);
    
    if (validation.isValid) {
        // validation.data é User aqui
        console.log(`Processing user: ${validation.data.name}`);
    } else {
        // validation.errors é string[] aqui
        console.error("Validation failed:", validation.errors.join(", "));
    }
}

// Type guards compostos para unions complexos
type DatabaseEntity = User | Product;

function isDatabaseEntity(obj: any): obj is DatabaseEntity {
    return isUser(obj) || isProduct(obj);
}

// Type guard que diferencia entre User e Product
function getUserFromEntity(entity: DatabaseEntity): User | null {
    return isUser(entity) ? entity : null;
}

function getProductFromEntity(entity: DatabaseEntity): Product | null {
    return isProduct(entity) ? entity : null;
}
```

### 5. Assertion Functions - Garantias de Tipo

Assertion functions são funções que garantem que um valor satisfaz um tipo específico, lançando erro se a verificação falhar.

```typescript
// Assertion function básica
function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error(`Expected string, got ${typeof value}`);
    }
}

function assertIsNumber(value: unknown): asserts value is number {
    if (typeof value !== "number" || isNaN(value)) {
        throw new Error(`Expected number, got ${typeof value}`);
    }
}

// Assertion function para objetos
function assertIsUser(obj: unknown): asserts obj is User {
    if (!isUser(obj)) {
        throw new Error("Expected User object");
    }
}

// Uso de assertion functions
function processStringValue(input: unknown): string {
    assertIsString(input); // Garante que input é string ou lança erro
    // TypeScript sabe que input é string daqui em diante
    return input.toUpperCase();
}

// Assertion functions com validação detalhada
function assertValidEmail(email: unknown): asserts email is string {
    if (typeof email !== "string") {
        throw new Error("Email must be a string");
    }
    
    if (!email.includes("@")) {
        throw new Error("Email must contain @ symbol");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Email format is invalid");
    }
}

// Assertion function para arrays
function assertIsArray<T>(
    value: unknown,
    itemValidator?: (item: unknown) => item is T
): asserts value is T[] {
    if (!Array.isArray(value)) {
        throw new Error("Expected array");
    }
    
    if (itemValidator) {
        value.forEach((item, index) => {
            if (!itemValidator(item)) {
                throw new Error(`Invalid item at index ${index}`);
            }
        });
    }
}

// Uso com validador de item
function processUserArray(data: unknown): User[] {
    assertIsArray(data, isUser); // Garante que data é User[] ou lança erro
    // TypeScript sabe que data é User[] aqui
    return data.filter(user => user.role !== "guest");
}

// Assertion functions condicionais
function assertNotNull<T>(value: T | null | undefined): asserts value is T {
    if (value === null || value === undefined) {
        throw new Error("Value must not be null or undefined");
    }
}

function safeProcessValue<T>(value: T | null | undefined, processor: (val: T) => void): void {
    assertNotNull(value); // Garante que value não é null/undefined
    processor(value); // TypeScript sabe que value é T aqui
}
```

## 🎯 Aplicabilidade Prática

### 1. Sistema de Validação de API

Sistema robusto para validação de dados de entrada de API com type guards integrados.

```typescript
// Tipos para API REST
interface CreateUserRequest {
    name: string;
    email: string;
    age: number;
    role?: "admin" | "user";
}

interface UpdateUserRequest {
    id: number;
    name?: string;
    email?: string;
    age?: number;
    role?: "admin" | "user";
}

interface DeleteUserRequest {
    id: number;
}

type UserRequest = CreateUserRequest | UpdateUserRequest | DeleteUserRequest;

// Type guards para diferentes tipos de request
function isCreateUserRequest(req: any): req is CreateUserRequest {
    return (
        req &&
        typeof req === "object" &&
        typeof req.name === "string" &&
        typeof req.email === "string" &&
        typeof req.age === "number" &&
        (!req.role || ["admin", "user"].includes(req.role)) &&
        !("id" in req) // Não deve ter ID para criação
    );
}

function isUpdateUserRequest(req: any): req is UpdateUserRequest {
    return (
        req &&
        typeof req === "object" &&
        typeof req.id === "number" &&
        (req.name === undefined || typeof req.name === "string") &&
        (req.email === undefined || typeof req.email === "string") &&
        (req.age === undefined || typeof req.age === "number") &&
        (req.role === undefined || ["admin", "user"].includes(req.role))
    );
}

function isDeleteUserRequest(req: any): req is DeleteUserRequest {
    return (
        req &&
        typeof req === "object" &&
        typeof req.id === "number" &&
        Object.keys(req).length === 1 // Apenas ID presente
    );
}

// Sistema de roteamento baseado em type guards
class UserController {
    async handleUserRequest(requestBody: unknown, method: string): Promise<any> {
        switch (method) {
            case "POST":
                if (isCreateUserRequest(requestBody)) {
                    return this.createUser(requestBody);
                } else {
                    throw new Error("Invalid create user request");
                }
                
            case "PUT":
                if (isUpdateUserRequest(requestBody)) {
                    return this.updateUser(requestBody);
                } else {
                    throw new Error("Invalid update user request");
                }
                
            case "DELETE":
                if (isDeleteUserRequest(requestBody)) {
                    return this.deleteUser(requestBody);
                } else {
                    throw new Error("Invalid delete user request");
                }
                
            default:
                throw new Error(`Unsupported method: ${method}`);
        }
    }
    
    private async createUser(req: CreateUserRequest): Promise<User> {
        // TypeScript sabe exatamente que propriedades estão disponíveis
        const user: User = {
            id: Math.random(), // Em produção, seria gerado pelo banco
            name: req.name,
            email: req.email,
            role: req.role || "user"
        };
        
        // Lógica de criação...
        return user;
    }
    
    private async updateUser(req: UpdateUserRequest): Promise<User> {
        // Buscar usuário existente
        const existingUser = await this.findUserById(req.id);
        
        // Atualizar apenas campos fornecidos
        const updatedUser: User = {
            ...existingUser,
            ...(req.name && { name: req.name }),
            ...(req.email && { email: req.email }),
            ...(req.role && { role: req.role })
        };
        
        // Lógica de atualização...
        return updatedUser;
    }
    
    private async deleteUser(req: DeleteUserRequest): Promise<void> {
        // TypeScript sabe que req tem apenas id
        await this.removeUserById(req.id);
    }
    
    private async findUserById(id: number): Promise<User> {
        // Implementação de busca...
        throw new Error("Not implemented");
    }
    
    private async removeUserById(id: number): Promise<void> {
        // Implementação de remoção...
        throw new Error("Not implemented");
    }
}
```

### 2. Sistema de Processamento de Eventos Multi-tipo

Sistema para processar diferentes tipos de eventos com type guards específicos para cada categoria.

```typescript
// Diferentes categorias de eventos
interface UserEvent {
    type: "user";
    action: "login" | "logout" | "register" | "profile_update";
    userId: string;
    timestamp: number;
    metadata?: Record<string, any>;
}

interface SystemEvent {
    type: "system";
    action: "startup" | "shutdown" | "error" | "maintenance";
    component: string;
    timestamp: number;
    severity: "info" | "warning" | "error" | "critical";
}

interface BusinessEvent {
    type: "business";
    action: "purchase" | "refund" | "subscription" | "cancellation";
    entityId: string;
    amount?: number;
    currency?: string;
    timestamp: number;
}

type ApplicationEvent = UserEvent | SystemEvent | BusinessEvent;

// Type guards especializados para cada tipo de evento
function isUserEvent(event: any): event is UserEvent {
    return (
        event &&
        event.type === "user" &&
        ["login", "logout", "register", "profile_update"].includes(event.action) &&
        typeof event.userId === "string" &&
        typeof event.timestamp === "number"
    );
}

function isSystemEvent(event: any): event is SystemEvent {
    return (
        event &&
        event.type === "system" &&
        ["startup", "shutdown", "error", "maintenance"].includes(event.action) &&
        typeof event.component === "string" &&
        typeof event.timestamp === "number" &&
        ["info", "warning", "error", "critical"].includes(event.severity)
    );
}

function isBusinessEvent(event: any): event is BusinessEvent {
    return (
        event &&
        event.type === "business" &&
        ["purchase", "refund", "subscription", "cancellation"].includes(event.action) &&
        typeof event.entityId === "string" &&
        typeof event.timestamp === "number" &&
        (event.amount === undefined || typeof event.amount === "number") &&
        (event.currency === undefined || typeof event.currency === "string")
    );
}

// Sistema de processamento com handlers especializados
class EventProcessor {
    private userEventHandlers: Map<UserEvent['action'], (event: UserEvent) => void>;
    private systemEventHandlers: Map<SystemEvent['action'], (event: SystemEvent) => void>;
    private businessEventHandlers: Map<BusinessEvent['action'], (event: BusinessEvent) => void>;
    
    constructor() {
        this.setupUserEventHandlers();
        this.setupSystemEventHandlers();
        this.setupBusinessEventHandlers();
    }
    
    processEvent(eventData: unknown): void {
        if (isUserEvent(eventData)) {
            this.processUserEvent(eventData);
        } else if (isSystemEvent(eventData)) {
            this.processSystemEvent(eventData);
        } else if (isBusinessEvent(eventData)) {
            this.processBusinessEvent(eventData);
        } else {
            console.error("Unknown event type:", eventData);
        }
    }
    
    private processUserEvent(event: UserEvent): void {
        const handler = this.userEventHandlers.get(event.action);
        if (handler) {
            handler(event);
        } else {
            console.warn(`No handler for user action: ${event.action}`);
        }
    }
    
    private processSystemEvent(event: SystemEvent): void {
        // Log crítico para eventos de sistema com severidade alta
        if (["error", "critical"].includes(event.severity)) {
            console.error(`System ${event.severity}: ${event.component} - ${event.action}`);
        }
        
        const handler = this.systemEventHandlers.get(event.action);
        if (handler) {
            handler(event);
        }
    }
    
    private processBusinessEvent(event: BusinessEvent): void {
        // Validação adicional para eventos financeiros
        if (["purchase", "refund"].includes(event.action) && !event.amount) {
            console.error("Financial event missing amount:", event);
            return;
        }
        
        const handler = this.businessEventHandlers.get(event.action);
        if (handler) {
            handler(event);
        }
    }
    
    private setupUserEventHandlers(): void {
        this.userEventHandlers = new Map([
            ["login", (event) => {
                console.log(`User ${event.userId} logged in at ${new Date(event.timestamp)}`);
                // Atualizar estatísticas de login...
            }],
            ["logout", (event) => {
                console.log(`User ${event.userId} logged out at ${new Date(event.timestamp)}`);
                // Cleanup de sessão...
            }],
            ["register", (event) => {
                console.log(`New user registered: ${event.userId}`);
                // Enviar email de boas-vindas...
            }],
            ["profile_update", (event) => {
                console.log(`User ${event.userId} updated profile`);
                // Invalidar cache de perfil...
            }]
        ]);
    }
    
    private setupSystemEventHandlers(): void {
        this.systemEventHandlers = new Map([
            ["startup", (event) => {
                console.log(`System component started: ${event.component}`);
            }],
            ["shutdown", (event) => {
                console.log(`System component stopping: ${event.component}`);
            }],
            ["error", (event) => {
                console.error(`Error in ${event.component}:`, event);
                // Enviar alerta...
            }],
            ["maintenance", (event) => {
                console.info(`Maintenance mode: ${event.component}`);
            }]
        ]);
    }
    
    private setupBusinessEventHandlers(): void {
        this.businessEventHandlers = new Map([
            ["purchase", (event) => {
                console.log(`Purchase: ${event.amount} ${event.currency} for entity ${event.entityId}`);
                // Processar pagamento...
            }],
            ["refund", (event) => {
                console.log(`Refund: ${event.amount} ${event.currency} for entity ${event.entityId}`);
                // Processar reembolso...
            }],
            ["subscription", (event) => {
                console.log(`New subscription: ${event.entityId}`);
                // Ativar benefícios...
            }],
            ["cancellation", (event) => {
                console.log(`Subscription cancelled: ${event.entityId}`);
                // Desativar benefícios...
            }]
        ]);
    }
}

// Uso do sistema
const eventProcessor = new EventProcessor();

// Eventos de exemplo
const events = [
    { type: "user", action: "login", userId: "user123", timestamp: Date.now() },
    { type: "system", action: "error", component: "database", timestamp: Date.now(), severity: "critical" },
    { type: "business", action: "purchase", entityId: "order456", amount: 99.99, currency: "USD", timestamp: Date.now() }
];

events.forEach(event => eventProcessor.processEvent(event));
```

## ⚠️ Limitações e Armadilhas

### 1. Performance de Verificações Complexas

**Problema**: Type guards complexos podem impactar performance, especialmente em hot paths.

```typescript
// Type guard custoso
function expensiveTypeGuard(obj: any): obj is ComplexObject {
    // Múltiplas verificações aninhadas custosas
    return (
        obj &&
        typeof obj === "object" &&
        Array.isArray(obj.items) &&
        obj.items.every((item: any) => 
            item &&
            typeof item.id === "string" &&
            typeof item.data === "object" &&
            Array.isArray(item.data.tags) &&
            item.data.tags.every((tag: any) => typeof tag === "string")
        ) &&
        typeof obj.metadata === "object" &&
        Object.values(obj.metadata).every((value: any) => 
            typeof value === "string" || typeof value === "number"
        )
    );
}
```

**Solução**: Cache de resultados e verificações incrementais.

```typescript
// Cache para type guards custosos
const typeGuardCache = new WeakMap<object, boolean>();

function optimizedTypeGuard(obj: any): obj is ComplexObject {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    
    // Verificar cache primeiro
    if (typeGuardCache.has(obj)) {
        return typeGuardCache.get(obj)!;
    }
    
    // Verificações rápidas primeiro
    if (!obj.items || !Array.isArray(obj.items)) {
        typeGuardCache.set(obj, false);
        return false;
    }
    
    // Verificações custosas apenas quando necessário
    const result = obj.items.every((item: any) => isValidItem(item)) &&
                  isValidMetadata(obj.metadata);
    
    typeGuardCache.set(obj, result);
    return result;
}
```

### 2. Falsos Positivos com Duck Typing

**Problema**: Type guards baseados apenas em propriedades podem aceitar objetos incorretos.

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

// Type guard insuficiente
function isUser(obj: any): obj is User {
    return obj && obj.id && obj.name && obj.email;
}

// Pode aceitar objetos incorretos
const fakeUser = {
    id: "123", // String em vez de number!
    name: 42,   // Number em vez de string!
    email: true // Boolean em vez de string!
};

console.log(isUser(fakeUser)); // true, mas está incorreto!
```

**Solução**: Verificação rigorosa de tipos.

```typescript
// Type guard rigoroso
function isUserStrict(obj: any): obj is User {
    return (
        obj &&
        typeof obj === "object" &&
        typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        typeof obj.email === "string" &&
        // Verificações adicionais se necessário
        obj.email.includes("@") &&
        obj.name.length > 0
    );
}
```

### 3. Type Guards Desatualizados

**Problema**: Type guards podem ficar desatualizados quando interfaces evoluem.

```typescript
// Interface original
interface OriginalUser {
    id: number;
    name: string;
}

// Type guard original
function isOriginalUser(obj: any): obj is OriginalUser {
    return obj && typeof obj.id === "number" && typeof obj.name === "string";
}

// Interface evolui, mas type guard não é atualizado
interface User extends OriginalUser {
    email: string; // Nova propriedade obrigatória
    role: "admin" | "user";
}

// Type guard desatualizado ainda aceita objetos incompletos!
const incompleteUser = { id: 1, name: "John" };
console.log(isOriginalUser(incompleteUser)); // true, mas User agora requer email e role
```

**Solução**: Testes automatizados e validação completa.

```typescript
// Type guard atualizado com testes
function isUser(obj: any): obj is User {
    return (
        obj &&
        typeof obj === "object" &&
        typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        typeof obj.email === "string" &&
        ["admin", "user"].includes(obj.role)
    );
}

// Testes para garantir que type guard está correto
describe("isUser type guard", () => {
    test("accepts valid user", () => {
        const validUser = { id: 1, name: "John", email: "john@example.com", role: "user" };
        expect(isUser(validUser)).toBe(true);
    });
    
    test("rejects incomplete user", () => {
        const incompleteUser = { id: 1, name: "John" };
        expect(isUser(incompleteUser)).toBe(false);
    });
});
```

## 🔗 Interconexões com Outros Conceitos

### Relação com Conditional Types

Type guards podem ser combinados com conditional types para criar sistemas de tipos avançados.

```typescript
// Conditional type baseado em type guards
type GuardedType<T, U> = T extends U ? T : never;

// Função que usa tanto type guards quanto conditional types
function processGuardedValue<T>(
    value: T,
    guard: (val: T) => val is GuardedType<T, string>
): GuardedType<T, string> | null {
    return guard(value) ? value : null;
}
```

### Integração com Template Literal Types

Type guards para template literal types permitem validação de strings estruturadas.

```typescript
// Template literal type
type EmailAddress = `${string}@${string}.${string}`;

// Type guard para template literal
function isEmailAddress(str: string): str is EmailAddress {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    return emailRegex.test(str);
}

function processEmail<T extends string>(
    email: T
): T extends EmailAddress ? T : never {
    if (isEmailAddress(email)) {
        return email as T extends EmailAddress ? T : never;
    }
    throw new Error("Invalid email format");
}
```

## 🚀 Evolução e Tendências Futuras

### Automatic Type Guard Generation

Ferramentas futuras podem gerar type guards automaticamente a partir de definições de tipo:

```typescript
// Hipótese futura: geração automática
interface User {
    id: number;
    name: string;
    email: string;
}

// Gerado automaticamente pelo compilador
const isUser = TypeScript.generateTypeGuard<User>();
```

### Runtime Type Validation Integration

Integração mais estreita entre validação runtime e type guards:

```typescript
// Sintaxe hipotética futura
function processData(data: unknown) {
    // Validação automática baseada em schema
    const user = data as User validate; // Combina type assertion com validação runtime
    
    // TypeScript garante que user é User válido
    console.log(user.name);
}
```

### Smart Type Guard Optimization

Otimizações automáticas do compilador para type guards:

```typescript
// Otimização automática de type guards redundantes
function optimizedCheck(value: string | number) {
    if (typeof value === "string") {
        // Compiler automatically optimizes subsequent typeof checks
        if (typeof value === "string") { // Redundant, automatically removed
            return value.toUpperCase();
        }
    }
}
```

---

Este módulo fornece uma base sólida para compreender e implementar type guards eficazes, essenciais para trabalhar com union types de forma segura e expressiva no TypeScript.