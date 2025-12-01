# Módulo 10: Múltiplos Tipos na Union - Escalabilidade e Complexidade em Union Types

## 🎯 Introdução

Quando trabalhamos com union types mais complexos envolvendo **múltiplos tipos**, entramos em um território de maior expressividade e flexibilidade no sistema de tipos TypeScript. Diferentemente de unions simples com dois tipos, unions com três ou mais tipos introduzem desafios únicos de design, performance e manutenibilidade que requerem técnicas específicas para serem gerenciados eficazmente.

A escalabilidade de union types é fundamental para modelar sistemas complexos do mundo real, onde dados podem assumir múltiplas formas válidas. Desde APIs que retornam diferentes formatos de resposta até sistemas de eventos com dezenas de tipos diferentes, a capacidade de gerenciar unions extensos determina a robustez e expressividade de nossas aplicações TypeScript.

Union types com múltiplos componentes também introduzem considerações de performance tanto em tempo de compilação quanto em runtime, além de impactar a experiência do desenvolvedor através de IntelliSense e verificação de tipos. O domínio dessas técnicas é essencial para arquiteturas escaláveis e maintíveis.

## 📋 Sumário

1. **Progressão de Complexidade**: De unions simples para complexos
2. **Unions com Tipos Primitivos**: Combinações de string, number, boolean
3. **Unions com Objetos**: Estruturas complexas em unions
4. **Unions com Arrays e Tuplas**: Coleções heterogêneas
5. **Unions com Funções**: Overloads e signatures múltiplas
6. **Unions Aninhados**: Composições recursivas de tipos
7. **Performance e Escalabilidade**: Otimizações e limitações
8. **Padrões de Organização**: Estruturação de unions complexos
9. **IntelliSense e DX**: Impacto na experiência do desenvolvedor
10. **Casos de Uso Avançados**: Aplicações práticas complexas
11. **Anti-patterns**: Armadilhas comuns com unions extensos
12. **Migração e Refatoração**: Evoluindo unions ao longo do tempo

## 🧠 Fundamentos Teóricos

### Teoria da Complexidade em Union Types

A complexidade de um union type cresce de forma **não-linear** com o número de tipos componentes. Enquanto um union de dois tipos `A | B` requer análise de apenas duas possibilidades, um union `A | B | C | D | E` exige que o compilador considere cinco caminhos diferentes para cada operação de verificação de tipos.

Esta complexidade se manifesta principalmente na **análise de fluxo de controle**, onde o TypeScript precisa rastrear quais tipos são possíveis em cada branch condicional. A complexidade temporal para verificação completa pode ser expressa como O(n × m), onde n é o número de tipos na união e m é o número de operações/propriedades sendo verificadas.

```typescript
// Complexidade crescente
type Simple = string | number;                    // O(2)
type Medium = string | number | boolean;          // O(3)  
type Complex = string | number | boolean | Date | RegExp; // O(5)

// Cada operação multiplica a complexidade
function process(value: Complex) {
    // TypeScript deve verificar 5 tipos para cada operação
    console.log(value.toString());     // 5 verificações
    console.log(typeof value);         // 5 verificações
    // Total: O(5 × 2) = O(10) verificações
}
```

### Semântica de Intersecção de Operações

Com múltiplos tipos em union, apenas operações que são **válidas em todos** os tipos componentes são permitidas sem type narrowing. Isso significa que quanto mais tipos adicionamos, menor se torna o conjunto de operações comuns disponíveis.

```typescript
// Demonstração da redução de operações disponíveis
type TwoTypes = string | number;
// Operações comuns: toString(), valueOf()

type ThreeTypes = string | number | boolean;  
// Operações comuns: toString(), valueOf()

type FourTypes = string | number | boolean | Date;
// Operações comuns: toString(), valueOf()

type FiveTypes = string | number | boolean | Date | RegExp;
// Operações comuns: toString(), valueOf()
// Note que as operações comuns permanecem as mesmas, mas a verificação fica mais custosa
```

### Algoritmo de Type Narrowing para Múltiplos Tipos

O TypeScript implementa um algoritmo de **eliminação progressiva** para type narrowing em unions complexos. Cada verificação condicional remove tipos incompatíveis da união, refinando progressivamente o conjunto de tipos possíveis.

```typescript
type MultiType = string | number | boolean | Date | Array<any>;

function smartNarrowing(value: MultiType) {
    // Eliminação progressiva
    if (typeof value === "string") {
        // Elimina: number, boolean, Date, Array<any>
        // Restante: string
        return value.toUpperCase();
    }
    
    if (typeof value === "number") {
        // Elimina: string, boolean, Date, Array<any>  
        // Restante: number
        return value.toFixed(2);
    }
    
    if (typeof value === "boolean") {
        // Elimina: string, number, Date, Array<any>
        // Restante: boolean
        return value ? "yes" : "no";
    }
    
    if (value instanceof Date) {
        // Elimina: string, number, boolean, Array<any>
        // Restante: Date
        return value.toISOString();
    }
    
    // Restante: Array<any> (por eliminação)
    return value.length;
}
```

## 🔍 Análise Detalhada

### Padrões de Construção de Unions Complexos

#### 1. Union Progressivo (Aditivo)

Construção incremental de unions, adicionando tipos conforme necessário. Este padrão é útil para APIs evolutivas e sistemas modulares.

```typescript
// Construção progressiva de tipos de resposta
type BaseResponse = {
    status: number;
    timestamp: Date;
};

// Adição progressiva de tipos de sucesso
type SuccessResponse = BaseResponse & {
    success: true;
    data: any;
};

type ErrorResponse = BaseResponse & {
    success: false;
    error: string;
};

type ValidationErrorResponse = BaseResponse & {
    success: false;
    error: string;
    validationErrors: Array<{
        field: string;
        message: string;
    }>;
};

// Union final combinando todos os tipos
type APIResponse = SuccessResponse | ErrorResponse | ValidationErrorResponse;

// Extensão posterior para novos casos
type TimeoutResponse = BaseResponse & {
    success: false;
    error: "timeout";
    retryAfter: number;
};

// Union expandido
type ExtendedAPIResponse = APIResponse | TimeoutResponse;
```

#### 2. Union Categórico (Hierarchical)

Organização de unions por categorias lógicas, facilitando manutenção e compreensão.

```typescript
// Categorização por domínio
type StringOperations = "uppercase" | "lowercase" | "trim" | "reverse";
type NumberOperations = "add" | "subtract" | "multiply" | "divide";
type ArrayOperations = "push" | "pop" | "shift" | "unshift" | "sort";
type ObjectOperations = "merge" | "clone" | "keys" | "values";

// Union hierárquico
type DataOperation = StringOperations | NumberOperations | ArrayOperations | ObjectOperations;

// Função que processa operações categorizadas
function executeOperation(
    operation: DataOperation,
    data: string | number | Array<any> | object
) {
    // Type narrowing por categoria
    const stringOps: StringOperations[] = ["uppercase", "lowercase", "trim", "reverse"];
    const numberOps: NumberOperations[] = ["add", "subtract", "multiply", "divide"];
    const arrayOps: ArrayOperations[] = ["push", "pop", "shift", "unshift", "sort"];
    
    if (stringOps.includes(operation as StringOperations)) {
        // Sabemos que data deve ser string
        return processStringOperation(operation as StringOperations, data as string);
    }
    
    if (numberOps.includes(operation as NumberOperations)) {
        // Sabemos que data deve ser number
        return processNumberOperation(operation as NumberOperations, data as number);
    }
    
    // ... outros casos
}
```

#### 3. Union Funcional (Compositional)

Construção de unions através de composição funcional, permitindo reutilização e modularidade.

```typescript
// Tipos base reutilizáveis
type Identifiable = { id: string };
type Timestamped = { createdAt: Date; updatedAt: Date };
type Versioned = { version: number };

// Composições funcionais
type User = Identifiable & Timestamped & {
    type: "user";
    name: string;
    email: string;
};

type Product = Identifiable & Timestamped & Versioned & {
    type: "product";
    name: string;
    price: number;
};

type Order = Identifiable & Timestamped & {
    type: "order";
    userId: string;
    items: Array<{ productId: string; quantity: number }>;
    total: number;
};

type Comment = Identifiable & Timestamped & {
    type: "comment";
    authorId: string;
    content: string;
    parentId?: string;
};

// Union compositional final
type Entity = User | Product | Order | Comment;

// Função genérica que trabalha com propriedades compostas
function processEntity<T extends Entity>(entity: T): T & { processed: boolean } {
    // Todas as entidades têm id e timestamps (propriedades compostas)
    console.log(`Processing ${entity.type} with id: ${entity.id}`);
    console.log(`Created: ${entity.createdAt.toISOString()}`);
    
    return {
        ...entity,
        processed: true
    };
}
```

### Técnicas Avançadas para Múltiplos Tipos

#### 1. Padrão Map-Based Narrowing

Utilização de maps/objetos para organizar handlers por tipo, evitando chains extensos de if/else.

```typescript
type EventType = "click" | "scroll" | "resize" | "keypress" | "focus" | "blur";

interface EventData {
    click: { x: number; y: number; button: number };
    scroll: { deltaX: number; deltaY: number };
    resize: { width: number; height: number };
    keypress: { key: string; modifiers: string[] };
    focus: { element: string };
    blur: { element: string };
}

type AppEvent<T extends EventType = EventType> = {
    type: T;
    timestamp: number;
    data: EventData[T];
};

// Map-based handler system
const eventHandlers: {
    [K in EventType]: (event: AppEvent<K>) => void
} = {
    click: (event) => {
        // TypeScript sabe que event.data é { x: number; y: number; button: number }
        console.log(`Click at (${event.data.x}, ${event.data.y}) with button ${event.data.button}`);
    },
    scroll: (event) => {
        // TypeScript sabe que event.data é { deltaX: number; deltaY: number }
        console.log(`Scroll delta: (${event.data.deltaX}, ${event.data.deltaY})`);
    },
    resize: (event) => {
        console.log(`Resize to: ${event.data.width}x${event.data.height}`);
    },
    keypress: (event) => {
        console.log(`Key pressed: ${event.data.key} with modifiers: ${event.data.modifiers.join(', ')}`);
    },
    focus: (event) => {
        console.log(`Focus on element: ${event.data.element}`);
    },
    blur: (event) => {
        console.log(`Blur from element: ${event.data.element}`);
    }
};

// Processamento type-safe
function handleEvent(event: AppEvent) {
    const handler = eventHandlers[event.type];
    handler(event as any); // Type assertion necessária devido à natureza genérica
}
```

#### 2. Visitor Pattern para Unions Complexos

Implementação do padrão visitor para processamento estruturado de unions com múltiplos tipos.

```typescript
// Tipos de nós em uma AST
interface NumberLiteral {
    type: "number";
    value: number;
}

interface StringLiteral {
    type: "string";
    value: string;
}

interface BinaryExpression {
    type: "binary";
    operator: "+" | "-" | "*" | "/";
    left: ASTNode;
    right: ASTNode;
}

interface FunctionCall {
    type: "function";
    name: string;
    args: ASTNode[];
}

interface VariableReference {
    type: "variable";
    name: string;
}

type ASTNode = NumberLiteral | StringLiteral | BinaryExpression | FunctionCall | VariableReference;

// Visitor interface
interface ASTVisitor<T> {
    visitNumber(node: NumberLiteral): T;
    visitString(node: StringLiteral): T;
    visitBinary(node: BinaryExpression): T;
    visitFunction(node: FunctionCall): T;
    visitVariable(node: VariableReference): T;
}

// Visitor dispatcher
function visitAST<T>(node: ASTNode, visitor: ASTVisitor<T>): T {
    switch (node.type) {
        case "number":
            return visitor.visitNumber(node);
        case "string":
            return visitor.visitString(node);
        case "binary":
            return visitor.visitBinary(node);
        case "function":
            return visitor.visitFunction(node);
        case "variable":
            return visitor.visitVariable(node);
    }
}

// Implementação concreta: evaluator
class Evaluator implements ASTVisitor<any> {
    private variables: Map<string, any> = new Map();
    
    visitNumber(node: NumberLiteral) {
        return node.value;
    }
    
    visitString(node: StringLiteral) {
        return node.value;
    }
    
    visitBinary(node: BinaryExpression) {
        const left = visitAST(node.left, this);
        const right = visitAST(node.right, this);
        
        switch (node.operator) {
            case "+": return left + right;
            case "-": return left - right;
            case "*": return left * right;
            case "/": return left / right;
        }
    }
    
    visitFunction(node: FunctionCall) {
        const args = node.args.map(arg => visitAST(arg, this));
        // Lógica de chamada de função
        return this.callFunction(node.name, args);
    }
    
    visitVariable(node: VariableReference) {
        return this.variables.get(node.name);
    }
    
    private callFunction(name: string, args: any[]) {
        // Implementação de funções built-in
        switch (name) {
            case "max": return Math.max(...args);
            case "min": return Math.min(...args);
            case "abs": return Math.abs(args[0]);
            default: throw new Error(`Unknown function: ${name}`);
        }
    }
}
```

#### 3. Conditional Type Composition

Uso de conditional types para criar unions dinâmicos baseados em parâmetros de tipo.

```typescript
// Tipos base
interface ReadOperation {
    type: "read";
    resource: string;
}

interface WriteOperation {
    type: "write";
    resource: string;
    data: any;
}

interface DeleteOperation {
    type: "delete";
    resource: string;
}

// Conditional type para filtrar operações por capacidade
type FilterOperationsByCapability<T, Capability> = 
    T extends { type: infer OpType }
        ? Capability extends "read"
            ? OpType extends "read" ? T : never
            : Capability extends "write" 
            ? OpType extends "write" | "delete" ? T : never
            : never
        : never;

type AllOperations = ReadOperation | WriteOperation | DeleteOperation;

// Unions filtrados dinamicamente
type ReadOnlyOps = FilterOperationsByCapability<AllOperations, "read">;     // ReadOperation
type WriteOps = FilterOperationsByCapability<AllOperations, "write">;       // WriteOperation | DeleteOperation

// Sistema de permissões baseado em tipos
class PermissionSystem<TCapability extends "read" | "write"> {
    private capability: TCapability;
    
    constructor(capability: TCapability) {
        this.capability = capability;
    }
    
    execute(operation: FilterOperationsByCapability<AllOperations, TCapability>) {
        switch (operation.type) {
            case "read":
                if (this.capability === "read" || this.capability === "write") {
                    return this.performRead(operation as ReadOperation);
                }
                break;
            case "write":
                if (this.capability === "write") {
                    return this.performWrite(operation as WriteOperation);
                }
                break;
            case "delete":
                if (this.capability === "write") {
                    return this.performDelete(operation as DeleteOperation);
                }
                break;
        }
        throw new Error("Operation not permitted");
    }
    
    private performRead(op: ReadOperation) {
        console.log(`Reading from ${op.resource}`);
    }
    
    private performWrite(op: WriteOperation) {
        console.log(`Writing to ${op.resource}:`, op.data);
    }
    
    private performDelete(op: DeleteOperation) {
        console.log(`Deleting ${op.resource}`);
    }
}
```

## 🎯 Aplicabilidade Prática

### 1. Sistema de Configuração Multi-formato

Implementação de sistema que aceita configurações em múltiplos formatos, com validação e normalização automáticas.

```typescript
// Diferentes formatos de configuração
interface ConfigFromFile {
    source: "file";
    path: string;
    format: "json" | "yaml" | "toml";
}

interface ConfigFromEnv {
    source: "env";
    prefix: string;
    mappings: Record<string, string>;
}

interface ConfigFromObject {
    source: "object";
    data: Record<string, any>;
}

interface ConfigFromURL {
    source: "url";
    url: string;
    method: "GET" | "POST";
    headers?: Record<string, string>;
}

interface ConfigFromDatabase {
    source: "database";
    connectionString: string;
    table: string;
    keyColumn: string;
    valueColumn: string;
}

type ConfigSource = ConfigFromFile | ConfigFromEnv | ConfigFromObject | ConfigFromURL | ConfigFromDatabase;

// Sistema de carregamento multi-formato
class ConfigurationManager {
    private loaders: {
        [K in ConfigSource['source']]: (config: Extract<ConfigSource, { source: K }>) => Promise<Record<string, any>>
    };

    constructor() {
        this.loaders = {
            file: this.loadFromFile.bind(this),
            env: this.loadFromEnv.bind(this),
            object: this.loadFromObject.bind(this),
            url: this.loadFromURL.bind(this),
            database: this.loadFromDatabase.bind(this)
        };
    }

    async loadConfiguration(sources: ConfigSource[]): Promise<Record<string, any>> {
        const results = await Promise.all(
            sources.map(source => this.loaders[source.source](source as any))
        );
        
        // Merge configurations with precedence
        return results.reduce((merged, config) => ({ ...merged, ...config }), {});
    }

    private async loadFromFile(config: ConfigFromFile): Promise<Record<string, any>> {
        const content = await fs.readFile(config.path, 'utf8');
        
        switch (config.format) {
            case "json":
                return JSON.parse(content);
            case "yaml":
                return yaml.parse(content);
            case "toml":
                return toml.parse(content);
        }
    }

    private async loadFromEnv(config: ConfigFromEnv): Promise<Record<string, any>> {
        const result: Record<string, any> = {};
        
        Object.entries(config.mappings).forEach(([key, envVar]) => {
            const value = process.env[config.prefix + envVar];
            if (value !== undefined) {
                result[key] = this.parseEnvValue(value);
            }
        });
        
        return result;
    }

    private async loadFromObject(config: ConfigFromObject): Promise<Record<string, any>> {
        return { ...config.data };
    }

    private async loadFromURL(config: ConfigFromURL): Promise<Record<string, any>> {
        const response = await fetch(config.url, {
            method: config.method,
            headers: config.headers
        });
        
        return response.json();
    }

    private async loadFromDatabase(config: ConfigFromDatabase): Promise<Record<string, any>> {
        const db = new Database(config.connectionString);
        const rows = await db.query(
            `SELECT ${config.keyColumn}, ${config.valueColumn} FROM ${config.table}`
        );
        
        const result: Record<string, any> = {};
        rows.forEach(row => {
            result[row[config.keyColumn]] = JSON.parse(row[config.valueColumn]);
        });
        
        return result;
    }

    private parseEnvValue(value: string): any {
        // Try to parse as JSON first
        try {
            return JSON.parse(value);
        } catch {
            // Return as string if not valid JSON
            return value;
        }
    }
}

// Uso do sistema multi-formato
const configManager = new ConfigurationManager();

const appConfig = await configManager.loadConfiguration([
    { source: "file", path: "./config.json", format: "json" },
    { source: "env", prefix: "APP_", mappings: { port: "PORT", debug: "DEBUG" } },
    { source: "url", url: "https://config.service.com/app/config", method: "GET" }
]);
```

### 2. Sistema de Validação Multi-tipo

Sistema robusto de validação que trabalha com múltiplos tipos de dados e regras de validação.

```typescript
// Tipos de validadores
interface StringValidator {
    type: "string";
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: string[];
}

interface NumberValidator {
    type: "number";
    min?: number;
    max?: number;
    integer?: boolean;
    multipleOf?: number;
}

interface BooleanValidator {
    type: "boolean";
}

interface ArrayValidator {
    type: "array";
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    itemValidator?: Validator;
}

interface ObjectValidator {
    type: "object";
    properties?: Record<string, Validator>;
    required?: string[];
    additionalProperties?: boolean;
}

interface DateValidator {
    type: "date";
    min?: Date;
    max?: Date;
}

type Validator = StringValidator | NumberValidator | BooleanValidator | ArrayValidator | ObjectValidator | DateValidator;

// Sistema de validação
class ValidationEngine {
    validate(value: any, validator: Validator): ValidationResult {
        switch (validator.type) {
            case "string":
                return this.validateString(value, validator);
            case "number":
                return this.validateNumber(value, validator);
            case "boolean":
                return this.validateBoolean(value, validator);
            case "array":
                return this.validateArray(value, validator);
            case "object":
                return this.validateObject(value, validator);
            case "date":
                return this.validateDate(value, validator);
        }
    }

    private validateString(value: any, validator: StringValidator): ValidationResult {
        if (typeof value !== "string") {
            return { valid: false, errors: ["Expected string"] };
        }

        const errors: string[] = [];

        if (validator.minLength && value.length < validator.minLength) {
            errors.push(`String too short (min: ${validator.minLength})`);
        }

        if (validator.maxLength && value.length > validator.maxLength) {
            errors.push(`String too long (max: ${validator.maxLength})`);
        }

        if (validator.pattern && !validator.pattern.test(value)) {
            errors.push(`String doesn't match pattern: ${validator.pattern}`);
        }

        if (validator.enum && !validator.enum.includes(value)) {
            errors.push(`String not in allowed values: ${validator.enum.join(', ')}`);
        }

        return { valid: errors.length === 0, errors };
    }

    private validateNumber(value: any, validator: NumberValidator): ValidationResult {
        if (typeof value !== "number" || isNaN(value)) {
            return { valid: false, errors: ["Expected number"] };
        }

        const errors: string[] = [];

        if (validator.min !== undefined && value < validator.min) {
            errors.push(`Number too small (min: ${validator.min})`);
        }

        if (validator.max !== undefined && value > validator.max) {
            errors.push(`Number too large (max: ${validator.max})`);
        }

        if (validator.integer && !Number.isInteger(value)) {
            errors.push("Expected integer");
        }

        if (validator.multipleOf && value % validator.multipleOf !== 0) {
            errors.push(`Number must be multiple of ${validator.multipleOf}`);
        }

        return { valid: errors.length === 0, errors };
    }

    // Implementações similares para outros tipos...
    private validateBoolean(value: any, validator: BooleanValidator): ValidationResult {
        return {
            valid: typeof value === "boolean",
            errors: typeof value === "boolean" ? [] : ["Expected boolean"]
        };
    }

    private validateArray(value: any, validator: ArrayValidator): ValidationResult {
        if (!Array.isArray(value)) {
            return { valid: false, errors: ["Expected array"] };
        }

        const errors: string[] = [];

        if (validator.minItems && value.length < validator.minItems) {
            errors.push(`Array too short (min items: ${validator.minItems})`);
        }

        if (validator.maxItems && value.length > validator.maxItems) {
            errors.push(`Array too long (max items: ${validator.maxItems})`);
        }

        if (validator.uniqueItems) {
            const unique = new Set(value);
            if (unique.size !== value.length) {
                errors.push("Array items must be unique");
            }
        }

        if (validator.itemValidator) {
            value.forEach((item, index) => {
                const itemResult = this.validate(item, validator.itemValidator!);
                if (!itemResult.valid) {
                    errors.push(`Item ${index}: ${itemResult.errors.join(', ')}`);
                }
            });
        }

        return { valid: errors.length === 0, errors };
    }

    private validateObject(value: any, validator: ObjectValidator): ValidationResult {
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
            return { valid: false, errors: ["Expected object"] };
        }

        const errors: string[] = [];

        if (validator.required) {
            validator.required.forEach(prop => {
                if (!(prop in value)) {
                    errors.push(`Missing required property: ${prop}`);
                }
            });
        }

        if (validator.properties) {
            Object.entries(validator.properties).forEach(([prop, propValidator]) => {
                if (prop in value) {
                    const propResult = this.validate(value[prop], propValidator);
                    if (!propResult.valid) {
                        errors.push(`Property ${prop}: ${propResult.errors.join(', ')}`);
                    }
                }
            });
        }

        if (!validator.additionalProperties) {
            const allowedProps = Object.keys(validator.properties || {});
            Object.keys(value).forEach(prop => {
                if (!allowedProps.includes(prop)) {
                    errors.push(`Additional property not allowed: ${prop}`);
                }
            });
        }

        return { valid: errors.length === 0, errors };
    }

    private validateDate(value: any, validator: DateValidator): ValidationResult {
        const date = value instanceof Date ? value : new Date(value);
        
        if (isNaN(date.getTime())) {
            return { valid: false, errors: ["Expected valid date"] };
        }

        const errors: string[] = [];

        if (validator.min && date < validator.min) {
            errors.push(`Date too early (min: ${validator.min.toISOString()})`);
        }

        if (validator.max && date > validator.max) {
            errors.push(`Date too late (max: ${validator.max.toISOString()})`);
        }

        return { valid: errors.length === 0, errors };
    }
}

interface ValidationResult {
    valid: boolean;
    errors: string[];
}

// Exemplo de uso
const validator = new ValidationEngine();

const userSchema: ObjectValidator = {
    type: "object",
    required: ["name", "email", "age"],
    properties: {
        name: { type: "string", minLength: 2, maxLength: 50 },
        email: { type: "string", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        age: { type: "number", min: 0, max: 120, integer: true },
        active: { type: "boolean" },
        tags: { 
            type: "array", 
            itemValidator: { type: "string" },
            uniqueItems: true 
        }
    }
};

const userData = {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    active: true,
    tags: ["developer", "typescript"]
};

const result = validator.validate(userData, userSchema);
console.log(result); // { valid: true, errors: [] }
```

## ⚠️ Limitações e Armadilhas

### 1. Explosão Combinatória de Verificações

**Problema**: Unions muito grandes podem causar performance ruim do compilador e IntelliSense lento.

```typescript
// Exemplo problemático: union muito grande
type MassiveUnion = 
    | Type1 | Type2 | Type3 | Type4 | Type5 | Type6 | Type7 | Type8
    | Type9 | Type10 | Type11 | Type12 | Type13 | Type14 | Type15 | Type16
    | Type17 | Type18 | Type19 | Type20; // ... e mais tipos

// Cada operação requer verificação de 20+ tipos
function problematicFunction(value: MassiveUnion) {
    // Esta linha pode ser muito lenta para processar
    console.log(value.toString());
}
```

**Solução**: Usar hierarquias de tipos e agrupamentos lógicos.

```typescript
// Agrupamento hierárquico
type NumericTypes = number | bigint | Float32Array | Float64Array;
type StringTypes = string | String | RegExp;
type ObjectTypes = object | Array<any> | Map<any, any> | Set<any>;

type WellOrganizedUnion = NumericTypes | StringTypes | ObjectTypes;

// Verificação em duas etapas
function betterFunction(value: WellOrganizedUnion) {
    if (typeof value === "number" || typeof value === "bigint") {
        // Narrowed to NumericTypes
        return handleNumeric(value as NumericTypes);
    } else if (typeof value === "string") {
        // Narrowed to StringTypes  
        return handleString(value as StringTypes);
    } else {
        // Must be ObjectTypes
        return handleObject(value as ObjectTypes);
    }
}
```

### 2. Type Narrowing Incompleto

**Problema**: Com muitos tipos, é fácil esquecer casos de narrowing, resultando em tipos `never`.

```typescript
type ComplexType = string | number | boolean | Date | RegExp | Array<any>;

function incompleteNarrowing(value: ComplexType) {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else if (typeof value === "number") {
        return value.toFixed(2);
    } else if (typeof value === "boolean") {
        return value.toString();
    }
    // Esquecemos Date, RegExp e Array<any>!
    // TypeScript infera que aqui value é: Date | RegExp | Array<any>
    // Mas tratamos como never, causando erro
    return value; // Erro potencial
}
```

**Solução**: Usar exhaustive checking e default cases.

```typescript
function exhaustiveNarrowing(value: ComplexType): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else if (typeof value === "number") {
        return value.toFixed(2);
    } else if (typeof value === "boolean") {
        return value.toString();
    } else if (value instanceof Date) {
        return value.toISOString();
    } else if (value instanceof RegExp) {
        return value.toString();
    } else if (Array.isArray(value)) {
        return `Array[${value.length}]`;
    } else {
        // Exhaustive check - should never reach here
        const _exhaustiveCheck: never = value;
        throw new Error(`Unhandled type: ${typeof value}`);
    }
}
```

### 3. IntelliSense Degradation

**Problema**: Unions grandes degradam a experiência de desenvolvimento com sugestões lentas ou incompletas.

```typescript
// Union que pode causar problemas de IntelliSense
type APIEndpoints = 
    | "/api/users" | "/api/products" | "/api/orders" | "/api/payments"
    | "/api/inventory" | "/api/shipping" | "/api/analytics" | "/api/reports"
    // ... 50+ endpoints

function callAPI(endpoint: APIEndpoints) {
    // IntelliSense pode ficar lento aqui
    return fetch(endpoint);
}
```

**Solução**: Usar const assertions e namespace organization.

```typescript
// Organização com namespaces
const API_ENDPOINTS = {
    users: "/api/users",
    products: "/api/products", 
    orders: "/api/orders",
    payments: "/api/payments"
} as const;

type APIEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];

// IntelliSense mais responsivo
function betterCallAPI(endpoint: APIEndpoint) {
    return fetch(endpoint);
}

// Uso com autocomplete melhor
callAPI(API_ENDPOINTS.users); // Boa experiência de dev
```

## 🔗 Interconexões com Outros Conceitos

### Relação com Mapped Types

Unions complexos frequentemente trabalham com mapped types para criar transformações sistemáticas.

```typescript
// Union base
type EntityType = "user" | "product" | "order" | "comment";

// Mapped type baseado no union
type EntityConfig<T extends EntityType> = {
    [K in T]: {
        endpoint: string;
        validator: (data: any) => boolean;
        serializer: (data: any) => string;
    }
};

// Configuração específica para cada tipo
const entityConfigs: EntityConfig<EntityType> = {
    user: {
        endpoint: "/api/users",
        validator: (data) => typeof data.name === "string",
        serializer: (data) => JSON.stringify(data)
    },
    product: {
        endpoint: "/api/products", 
        validator: (data) => typeof data.price === "number",
        serializer: (data) => JSON.stringify(data)
    },
    order: {
        endpoint: "/api/orders",
        validator: (data) => Array.isArray(data.items),
        serializer: (data) => JSON.stringify(data)
    },
    comment: {
        endpoint: "/api/comments",
        validator: (data) => typeof data.content === "string", 
        serializer: (data) => JSON.stringify(data)
    }
};
```

### Integração com Template Literal Types

Template literal types podem ser combinados com unions para criar strings tipadas complexas.

```typescript
// Base unions
type Protocol = "http" | "https";
type Domain = "api.example.com" | "staging-api.example.com" | "localhost:3000";
type Version = "v1" | "v2";
type Resource = "users" | "products" | "orders";

// Template literal combinando unions
type APIUrl = `${Protocol}://${Domain}/api/${Version}/${Resource}`;

// Resulta em todas as combinações possíveis:
// "http://api.example.com/api/v1/users" | "http://api.example.com/api/v1/products" | ...
// Total: 2 × 3 × 2 × 3 = 36 combinações

// Função type-safe para URLs
function buildAPIUrl<T extends APIUrl>(url: T): T {
    return url;
}

// Uso com verificação completa de tipos
const userUrl = buildAPIUrl("https://api.example.com/api/v2/users"); // ✓
const invalidUrl = buildAPIUrl("ftp://invalid.com/api/v3/invalid"); // ✗ Erro
```

## 🚀 Evolução e Tendências Futuras

### Pattern Matching Nativo

O futuro pode incluir syntax nativa para pattern matching, similar a linguagens funcionais:

```typescript
// Sintaxe hipotética futura
function processValue(value: string | number | boolean | Date) {
    return match value {
        case string when value.length > 10 => "long string",
        case string => "short string", 
        case number when value > 100 => "big number",
        case number => "small number",
        case boolean => value ? "true" : "false",
        case Date => value.toISOString(),
        default => "unknown"
    }
}
```

### Improved Union Performance

Melhorias contínuas no compilador para otimizar verificação de unions grandes:

- **Lazy evaluation** de tipos union
- **Caching** de resultados de verificação
- **Parallel processing** de verificações de tipo
- **Smart narrowing** baseado em uso patterns

### Runtime Type Information

Integração melhorada entre tipos compile-time e runtime:

```typescript
// Hipótese futura: runtime type info
function processValueRuntime(value: string | number | boolean) {
    const runtimeType = TypeScript.getType(value); // Informação de tipo em runtime
    
    switch (runtimeType) {
        case "string":
            return value.toUpperCase(); // TypeScript sabe que é string
        case "number": 
            return value.toFixed(2);    // TypeScript sabe que é number
        case "boolean":
            return value.toString();    // TypeScript sabe que é boolean
    }
}
```

---

Este módulo estabelece uma compreensão profunda de como trabalhar com unions complexos envolvendo múltiplos tipos, fornecendo técnicas avançadas e padrões para gerenciar a complexidade crescente enquanto mantém performance e experiência de desenvolvimento de alta qualidade.