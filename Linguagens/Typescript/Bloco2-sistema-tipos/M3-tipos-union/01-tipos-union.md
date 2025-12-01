# Módulo 10: Tipos Union - Versatilidade e Flexibilidade no Sistema de Tipos TypeScript

## 🎯 Introdução

Os **Union Types** representam uma das funcionalidades mais poderosas e expressivas do sistema de tipos TypeScript, permitindo que uma variável ou parâmetro aceite valores de múltiplos tipos diferentes. Esta característica oferece flexibilidade controlada, mantendo a segurança de tipos que é o coração do TypeScript. Union types são fundamentais para criar APIs robustas, lidar com dados heterogêneos e modelar estados complexos de aplicação.

A sintaxe básica utiliza o operador pipe (`|`) para conectar diferentes tipos, criando uma união lógica onde o valor pode ser de qualquer um dos tipos especificados. Esta abordagem permite expressar cenários do mundo real onde dados podem ter múltiplas formas válidas, desde valores primitivos simples até estruturas de objetos complexas.

Union types representam uma evolução natural da programação tipada, oferecendo um meio termo entre a rigidez de tipos únicos e a permissividade excessiva do tipo `any`. Eles permitem que desenvolvedores expressem intenções claras sobre quais tipos são aceitáveis, mantendo verificações de tempo de compilação que previnem erros comuns.

## 📋 Sumário

1. **Definição e Sintaxe Básica**: Operador pipe e declaração de union types
2. **Union Types Primitivos**: Combinações de string, number, boolean
3. **Union com Tipos Complexos**: Objetos, arrays e funções em unions
4. **Type Guards Básicos**: typeof, instanceof e verificações condicionais
5. **Discriminated Unions**: Pattern matching com propriedades discriminantes  
6. **Type Narrowing**: Redução de tipos através de condicionais
7. **Union Types em Parâmetros**: Funções que aceitam múltiplos tipos
8. **Union vs Intersection**: Diferenças conceituais e práticas
9. **Casos de Uso Práticos**: Aplicações reais em desenvolvimento
10. **Limitações e Armadilhas**: Problemas comuns e como evitá-los
11. **Performance**: Implicações de unions no desempenho
12. **Evolução Histórica**: Desenvolvimento dos union types no TypeScript

## 🧠 Fundamentos Teóricos

### Teoria dos Tipos Union

Union types implementam o conceito matemático de **união de conjuntos** no contexto de sistemas de tipos. Em teoria dos conjuntos, a união A ∪ B representa todos os elementos que pertencem ao conjunto A, ao conjunto B, ou a ambos. No TypeScript, um union type `A | B` aceita valores que são válidos para o tipo A, para o tipo B, ou para ambos.

Esta implementação segue os princípios da **teoria dos tipos estruturais**, onde TypeScript verifica se um valor possui a estrutura necessária para satisfazer pelo menos um dos tipos na união. O sistema de tipos analisa cada tipo componente individualmente e permite operações que são válidas em pelo menos um deles.

```typescript
// Conceito fundamental: união de tipos primitivos
type StringOrNumber = string | number;

// O compilador aceita ambos os tipos
let value1: StringOrNumber = "texto";    // ✓ Válido
let value2: StringOrNumber = 42;         // ✓ Válido
let value3: StringOrNumber = true;       // ✗ Erro: boolean não está na união
```

### Semântica de Verificação de Tipos

O TypeScript implementa verificação de tipos para unions seguindo o **princípio da intersecção de operações válidas**. Quando você trabalha com uma variável de tipo union, apenas operações que são válidas em **todos** os tipos da união são permitidas sem type narrowing. Esta abordagem conservadora garante segurança de tipos em tempo de compilação.

```typescript
function processValue(input: string | number) {
    // Apenas operações válidas em AMBOS os tipos são permitidas
    console.log(input.toString());   // ✓ Válido: ambos têm toString()
    console.log(input.length);       // ✗ Erro: number não tem length
    console.log(input.toFixed(2));   // ✗ Erro: string não tem toFixed()
}
```

### Type Narrowing e Control Flow Analysis

O **Type Narrowing** é o processo pelo qual o TypeScript refina tipos union baseado em verificações condicionais no código. O compilador utiliza **Control Flow Analysis** para rastrear como tipos são refinados através de branches condicionais, permitindo acesso seguro a propriedades específicas de cada tipo.

```typescript
function smartProcessing(input: string | number | boolean) {
    if (typeof input === "string") {
        // TypeScript sabe que aqui input é string
        return input.toUpperCase();
    } else if (typeof input === "number") {
        // TypeScript sabe que aqui input é number
        return input.toFixed(2);
    } else {
        // TypeScript sabe que aqui input é boolean
        return input ? "verdadeiro" : "falso";
    }
}
```

## 🔍 Análise Detalhada

### Padrões de Union Types

#### 1. Union Types Simples com Primitivos

O padrão mais básico combina tipos primitivos para criar flexibilidade controlada. Este padrão é especialmente útil para parâmetros de função que podem aceitar diferentes formatos de entrada.

```typescript
// ID que pode ser string ou número
type ID = string | number;

// Função que aceita diferentes tipos de identificador
function findUser(id: ID): User | null {
    if (typeof id === "string") {
        return database.findByEmail(id);
    } else {
        return database.findById(id);
    }
}

// Uso flexível
findUser("user@example.com");  // Busca por email
findUser(12345);               // Busca por ID numérico
```

#### 2. Union Types com Literais

Combinando union types com literal types, criamos enumerações type-safe que são mais expressivas que enums tradicionais. Este padrão é fundamental para modelar estados finitos e configurações.

```typescript
// Status de processamento com valores específicos
type ProcessingStatus = "pending" | "processing" | "completed" | "failed";

// Configuração de tema com opções limitadas
type Theme = "light" | "dark" | "auto";

// Função que utiliza literal union
function updateStatus(newStatus: ProcessingStatus) {
    switch (newStatus) {
        case "pending":
            showSpinner(false);
            break;
        case "processing":
            showSpinner(true);
            break;
        case "completed":
            showSuccessMessage();
            break;
        case "failed":
            showErrorMessage();
            break;
    }
}
```

#### 3. Discriminated Unions (Tagged Unions)

O padrão mais poderoso utiliza uma propriedade comum (discriminante) para distinguir entre diferentes variantes de uma união. Este padrão implementa **pattern matching** type-safe e é fundamental para modelar dados polimórficos.

```typescript
// Diferentes tipos de eventos com discriminante comum
interface ClickEvent {
    type: "click";
    element: HTMLElement;
    coordinates: { x: number; y: number };
}

interface KeyboardEvent {
    type: "keyboard";
    key: string;
    modifiers: string[];
}

interface ScrollEvent {
    type: "scroll";
    direction: "up" | "down";
    delta: number;
}

// Union discriminada
type UIEvent = ClickEvent | KeyboardEvent | ScrollEvent;

// Pattern matching type-safe
function handleEvent(event: UIEvent) {
    switch (event.type) {
        case "click":
            // TypeScript sabe que event é ClickEvent
            highlightElement(event.element);
            logCoordinates(event.coordinates);
            break;
        case "keyboard":
            // TypeScript sabe que event é KeyboardEvent
            processKeyInput(event.key, event.modifiers);
            break;
        case "scroll":
            // TypeScript sabe que event é ScrollEvent
            animateScroll(event.direction, event.delta);
            break;
    }
}
```

### Técnicas Avançadas de Type Guards

#### 1. User-Defined Type Guards

Criação de funções customizadas que atuam como type guards, permitindo lógica complexa de verificação de tipos que o TypeScript não pode inferir automaticamente.

```typescript
// Interface para diferentes tipos de usuário
interface RegularUser {
    type: "regular";
    name: string;
    email: string;
}

interface AdminUser {
    type: "admin";
    name: string;
    email: string;
    permissions: string[];
}

type User = RegularUser | AdminUser;

// Type guard customizado
function isAdmin(user: User): user is AdminUser {
    return user.type === "admin";
}

// Uso do type guard
function processUser(user: User) {
    if (isAdmin(user)) {
        // TypeScript sabe que user é AdminUser
        console.log(`Admin ${user.name} has ${user.permissions.length} permissions`);
    } else {
        // TypeScript sabe que user é RegularUser
        console.log(`Regular user: ${user.name}`);
    }
}
```

#### 2. Type Guards com Validação Complexa

Implementação de type guards que incluem validação robusta de estrutura de dados, especialmente útil para dados externos ou APIs.

```typescript
// Tipos para resposta de API
interface SuccessResponse {
    status: "success";
    data: any;
}

interface ErrorResponse {
    status: "error";
    message: string;
    code: number;
}

type APIResponse = SuccessResponse | ErrorResponse;

// Type guard com validação completa
function isSuccessResponse(response: any): response is SuccessResponse {
    return (
        response &&
        typeof response === "object" &&
        response.status === "success" &&
        "data" in response
    );
}

function isErrorResponse(response: any): response is ErrorResponse {
    return (
        response &&
        typeof response === "object" &&
        response.status === "error" &&
        typeof response.message === "string" &&
        typeof response.code === "number"
    );
}
```

### Padrões Funcionais com Union Types

#### 1. Option/Maybe Pattern

Implementação do padrão Option usando union types para representar valores que podem estar presentes ou ausentes de forma type-safe.

```typescript
// Tipo Option genérico
type Option<T> = T | null;

// Funções utilitárias para trabalhar com Option
function some<T>(value: T): Option<T> {
    return value;
}

function none<T>(): Option<T> {
    return null;
}

function map<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
    return option !== null ? fn(option) : null;
}

function flatMap<T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U> {
    return option !== null ? fn(option) : null;
}

// Uso prático
function findUserById(id: number): Option<User> {
    const user = database.find(id);
    return user ? some(user) : none();
}

const userId = 123;
const userName = map(findUserById(userId), user => user.name);
```

#### 2. Result Pattern

Padrão Result para operações que podem falhar, fornecendo informações detalhadas sobre sucessos e falhas sem usar exceções.

```typescript
// Tipos Result
interface Success<T> {
    type: "success";
    value: T;
}

interface Failure<E> {
    type: "failure";
    error: E;
}

type Result<T, E> = Success<T> | Failure<E>;

// Funções construtoras
function success<T, E>(value: T): Result<T, E> {
    return { type: "success", value };
}

function failure<T, E>(error: E): Result<T, E> {
    return { type: "failure", error };
}

// Exemplo de uso em operação de arquivo
function readFile(path: string): Result<string, string> {
    try {
        const content = fs.readFileSync(path, 'utf8');
        return success(content);
    } catch (error) {
        return failure(`Failed to read file: ${error.message}`);
    }
}

// Pattern matching para processar resultado
function processFileResult(result: Result<string, string>) {
    switch (result.type) {
        case "success":
            console.log(`File content: ${result.value}`);
            break;
        case "failure":
            console.error(`Error: ${result.error}`);
            break;
    }
}
```

## 🎯 Aplicabilidade Prática

### 1. Modelagem de Estados de Aplicação

Union types são ideais para modelar diferentes estados de uma aplicação, especialmente em máquinas de estado e gerenciamento de estado reativo.

```typescript
// Estados de carregamento de dados
type LoadingState<T> = 
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: string };

// Hook React para gerenciamento de estado de fetch
function useAsyncData<T>(fetchFn: () => Promise<T>) {
    const [state, setState] = useState<LoadingState<T>>({ status: "idle" });

    const execute = useCallback(async () => {
        setState({ status: "loading" });
        try {
            const data = await fetchFn();
            setState({ status: "success", data });
        } catch (error) {
            setState({ status: "error", error: error.message });
        }
    }, [fetchFn]);

    return { state, execute };
}

// Componente que utiliza o estado
function DataComponent() {
    const { state, execute } = useAsyncData(fetchUserData);

    switch (state.status) {
        case "idle":
            return <button onClick={execute}>Load Data</button>;
        case "loading":
            return <Spinner />;
        case "success":
            return <UserProfile user={state.data} />;
        case "error":
            return <ErrorMessage error={state.error} />;
    }
}
```

### 2. APIs Flexíveis com Múltiplos Formatos

Desenvolvimento de APIs que aceitam diferentes formatos de entrada, mantendo type safety e documentação clara.

```typescript
// Configuração que aceita diferentes formatos
type DatabaseConfig = 
    | string  // URL de conexão
    | {       // Configuração detalhada
        host: string;
        port: number;
        database: string;
        credentials: {
            username: string;
            password: string;
        };
    };

// Função que normaliza diferentes formatos
function connectToDatabase(config: DatabaseConfig): Promise<Database> {
    let connectionUrl: string;

    if (typeof config === "string") {
        connectionUrl = config;
    } else {
        const { host, port, database, credentials } = config;
        connectionUrl = `postgresql://${credentials.username}:${credentials.password}@${host}:${port}/${database}`;
    }

    return createConnection(connectionUrl);
}

// Uso flexível
connectToDatabase("postgresql://user:pass@localhost:5432/mydb");
connectToDatabase({
    host: "localhost",
    port: 5432,
    database: "mydb",
    credentials: {
        username: "user",
        password: "pass"
    }
});
```

### 3. Processamento de Eventos Polimórficos

Implementação de sistemas de eventos que lidam com diferentes tipos de eventos de forma type-safe.

```typescript
// Diferentes tipos de notificação
interface EmailNotification {
    type: "email";
    recipient: string;
    subject: string;
    body: string;
    attachments?: string[];
}

interface SMSNotification {
    type: "sms";
    phoneNumber: string;
    message: string;
}

interface PushNotification {
    type: "push";
    deviceId: string;
    title: string;
    body: string;
    badge?: number;
}

type Notification = EmailNotification | SMSNotification | PushNotification;

// Sistema de processamento de notificações
class NotificationService {
    async send(notification: Notification): Promise<boolean> {
        switch (notification.type) {
            case "email":
                return this.sendEmail(notification);
            case "sms":
                return this.sendSMS(notification);
            case "push":
                return this.sendPush(notification);
        }
    }

    private async sendEmail(notification: EmailNotification): Promise<boolean> {
        // Lógica específica para email
        const emailService = new EmailService();
        return emailService.send({
            to: notification.recipient,
            subject: notification.subject,
            html: notification.body,
            attachments: notification.attachments
        });
    }

    private async sendSMS(notification: SMSNotification): Promise<boolean> {
        // Lógica específica para SMS
        const smsService = new SMSService();
        return smsService.send(notification.phoneNumber, notification.message);
    }

    private async sendPush(notification: PushNotification): Promise<boolean> {
        // Lógica específica para push
        const pushService = new PushService();
        return pushService.send({
            deviceId: notification.deviceId,
            title: notification.title,
            body: notification.body,
            badge: notification.badge
        });
    }
}
```

## ⚠️ Limitações e Armadilhas

### 1. Complexidade de Type Narrowing

**Problema**: Quando union types se tornam muito complexos, o type narrowing pode se tornar verboso e difícil de manter.

```typescript
// Union complexo que dificulta type narrowing
type ComplexUnion = 
    | { type: "a"; propA: string }
    | { type: "b"; propB: number }
    | { type: "c"; propC: boolean }
    | { type: "d"; propD: Date }
    | { type: "e"; propE: string[] };

// Type narrowing verboso
function processComplex(item: ComplexUnion) {
    if (item.type === "a") {
        // Apenas propA disponível
    } else if (item.type === "b") {
        // Apenas propB disponível
    } else if (item.type === "c") {
        // Apenas propC disponível
    } // ... e assim por diante
}
```

**Solução**: Usar visitor pattern ou map de handlers para reduzir complexidade.

```typescript
// Visitor pattern para unions complexos
interface ComplexUnionVisitor<T> {
    visitA(item: { type: "a"; propA: string }): T;
    visitB(item: { type: "b"; propB: number }): T;
    visitC(item: { type: "c"; propC: boolean }): T;
    visitD(item: { type: "d"; propD: Date }): T;
    visitE(item: { type: "e"; propE: string[] }): T;
}

function visitComplexUnion<T>(item: ComplexUnion, visitor: ComplexUnionVisitor<T>): T {
    switch (item.type) {
        case "a": return visitor.visitA(item);
        case "b": return visitor.visitB(item);
        case "c": return visitor.visitC(item);
        case "d": return visitor.visitD(item);
        case "e": return visitor.visitE(item);
    }
}
```

### 2. Performance em Unions Muito Grandes

**Problema**: Unions com muitos tipos podem impactar performance de compilação e IntelliSense.

```typescript
// Union muito grande pode causar problemas de performance
type MassiveUnion = 
    | Type1 | Type2 | Type3 | Type4 | Type5
    | Type6 | Type7 | Type8 | Type9 | Type10
    | Type11 | Type12 | Type13 | Type14 | Type15
    // ... mais 100 tipos
```

**Solução**: Usar hierarquias de tipos ou abstrações intermediárias.

```typescript
// Agrupamento hierárquico
type UserEvents = LoginEvent | LogoutEvent | ProfileUpdateEvent;
type SystemEvents = StartupEvent | ShutdownEvent | ErrorEvent;
type DataEvents = CreateEvent | UpdateEvent | DeleteEvent;

type ApplicationEvent = UserEvents | SystemEvents | DataEvents;
```

### 3. Incompatibilidade com Bibliotecas Externas

**Problema**: Bibliotecas que não foram projetadas para union types podem não funcionar corretamente.

```typescript
// Problema com serialização JSON
const data: string | number = Math.random() > 0.5 ? "texto" : 42;
const json = JSON.stringify({ value: data });
// JSON não preserva informação de tipo union
```

**Solução**: Usar wrapper objects ou tags de tipo para preservar informação semântica.

```typescript
// Wrapper que preserva informação de tipo
interface TypedValue<T> {
    type: string;
    value: T;
}

function createStringValue(value: string): TypedValue<string> {
    return { type: "string", value };
}

function createNumberValue(value: number): TypedValue<number> {
    return { type: "number", value };
}
```

## 🔗 Interconexões com Outros Conceitos

### Relação com Intersection Types

Union e intersection types são conceitos duais que podem ser combinados para criar sistemas de tipos sofisticados.

```typescript
// Combination de union e intersection
interface Readable {
    read(): string;
}

interface Writable {
    write(data: string): void;
}

// Intersection: deve implementar AMBAS as interfaces
type ReadWrite = Readable & Writable;

// Union: pode implementar QUALQUER uma das interfaces
type FileOperation = Readable | Writable;

// Combinação complexa
type StreamType<T> = T extends "read" 
    ? Readable 
    : T extends "write" 
        ? Writable 
        : T extends "readwrite" 
            ? ReadWrite 
            : never;
```

### Integração com Generics

Union types combinados com generics criam abstrações poderosas para bibliotecas e frameworks.

```typescript
// Generic union para diferentes tipos de resposta
type ApiResponse<T> = 
    | { success: true; data: T }
    | { success: false; error: string };

// Função genérica que retorna union
async function apiCall<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Uso com tipos específicos
const userResponse = await apiCall<User>("/api/user/123");
const productsResponse = await apiCall<Product[]>("/api/products");
```

### Relação com Conditional Types

Union types frequentemente trabalham em conjunto com conditional types para criar lógica de tipos avançada.

```typescript
// Conditional type baseado em union
type NonNullable<T> = T extends null | undefined ? never : T;

// Extração de tipos específicos de union
type ExtractByType<T, U> = T extends U ? T : never;

// Exemplo prático
type StringFromUnion = ExtractByType<string | number | boolean, string>; // string
type NumberFromUnion = ExtractByType<string | number | boolean, number>; // number
```

## 🚀 Evolução e Tendências Futuras

### Histórico do Desenvolvimento

Union types foram introduzidos no TypeScript 1.4 (2015) como uma resposta à necessidade de expressar tipos alternativos de forma type-safe. A evolução incluiu:

**TypeScript 1.4**: Introdução básica de union types com sintaxe `|`
**TypeScript 1.6**: Melhorias em type guards e narrowing
**TypeScript 2.0**: Introdução de discriminated unions
**TypeScript 2.1**: Control flow analysis aprimorado
**TypeScript 3.2**: BigInt support em unions
**TypeScript 4.0**: Variadic tuple types expandindo possibilidades

### Tendências Atuais

**Pattern Matching Nativo**: Discussões sobre sintaxe nativa para pattern matching, similar a linguagens funcionais:

```typescript
// Sintaxe hipotética futura
function process(value: string | number | boolean) {
    return match value {
        when string => value.toUpperCase(),
        when number => value.toString(),
        when boolean => value ? "yes" : "no"
    }
}
```

**Melhorias em Performance**: Otimizações contínuas no compilador para lidar com unions grandes e complexos de forma mais eficiente.

**Integração com Runtime**: Desenvolvimento de bibliotecas que bridgeiam type information para runtime, permitindo validação automática de union types.

### Impacto no Ecossistema

Union types influenciaram significativamente o design de bibliotecas modernas:

- **React**: Hooks que retornam unions para diferentes estados
- **Express**: Middleware que aceita múltiplos tipos de input
- **Lodash**: Funções utilitárias que trabalham com tipos variados
- **GraphQL**: Schema definitions que mapeiam para union types

A tendência é de maior adoção de patterns funcionais e type-safe error handling, com union types sendo fundamentais para essas abordagens.

---

Este módulo estabelece as bases fundamentais para union types em TypeScript, fornecendo tanto conhecimento teórico quanto aplicações práticas. O domínio deste conceito é essencial para aproveitar totalmente o sistema de tipos do TypeScript e criar código mais expressivo, seguro e maintível.