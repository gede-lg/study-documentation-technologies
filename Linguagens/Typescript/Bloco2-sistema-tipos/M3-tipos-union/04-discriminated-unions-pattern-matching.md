# Módulo 10: Discriminated Unions (Pattern Matching) - Unions Estruturados e Type-Safe

## 🎯 Introdução

**Discriminated Unions**, também conhecidos como **Tagged Unions** ou **Algebraic Data Types**, representam uma das construções mais poderosas e expressivas do sistema de tipos TypeScript. Eles utilizam propriedades **discriminantes** (tags) para distinguir entre diferentes variantes de um union type, permitindo **pattern matching** type-safe e eliminando ambiguidades na verificação de tipos.

Esta abordagem resolve fundamentalmente o problema de como diferenciar entre tipos estruturalmente similares em unions, fornecendo um mecanismo robusto para modelar dados polimórficos onde diferentes variantes compartilham uma estrutura base comum mas possuem comportamentos e propriedades específicas. O resultado é código mais seguro, mais expressivo e mais fácil de manter.

Discriminated unions são especialmente valiosos para modelar máquinas de estado, processamento de mensagens, sistemas de eventos e qualquer cenário onde dados podem existir em múltiplas formas mutuamente exclusivas. Eles implementam o conceito de **sum types** da teoria de tipos, oferecendo uma alternativa type-safe a padrões como inheritance hierarchies ou switch statements baseados em strings mágicas.

## 📋 Sumário

1. **Fundamentos Conceituais**: Teoria e motivação por trás de discriminated unions
2. **Anatomia de um Discriminated Union**: Estrutura e componentes essenciais
3. **Propriedades Discriminantes**: Escolha e design de tags eficazes
4. **Pattern Matching com Switch**: Implementação de pattern matching exhaustivo
5. **Type Narrowing Automático**: Como o TypeScript refina tipos automaticamente
6. **Unions Aninhados**: Composição hierárquica de discriminated unions
7. **Discriminated Unions Genéricos**: Combinação com generics para flexibilidade
8. **State Machines**: Modelagem de máquinas de estado com unions
9. **Error Handling**: Padrões Result/Either usando discriminated unions
10. **Performance e Otimização**: Considerações de runtime e compilação
11. **Testing Strategies**: Estratégias para testar pattern matching
12. **Advanced Patterns**: Técnicas avançadas e casos de uso especializados

## 🧠 Fundamentos Teóricos

### Teoria dos Sum Types (Tipos Soma)

Discriminated unions implementam o conceito matemático de **sum types** (tipos soma), onde um valor pode ser de um tipo OU de outro, mas nunca ambos simultaneamente. Diferentemente de product types (como objetos que combinam múltiplas propriedades), sum types representam alternativas mutuamente exclusivas.

Na teoria de tipos, um sum type `A + B` pode conter valores do tipo A ou do tipo B, e o número total de valores possíveis é a soma dos valores de A e B. No TypeScript, discriminated unions implementam sum types adicionando uma **propriedade discriminante** que atua como uma tag identificando qual variante específica está sendo utilizada.

```typescript
// Sum type teórico: Shape = Circle + Rectangle + Triangle
// Implementação com discriminated union:
interface Circle {
    kind: "circle";     // Propriedade discriminante
    radius: number;
}

interface Rectangle {
    kind: "rectangle";  // Propriedade discriminante
    width: number;
    height: number;
}

interface Triangle {
    kind: "triangle";   // Propriedade discriminante
    sideA: number;
    sideB: number;
    sideC: number;
}

// Union discriminado
type Shape = Circle | Rectangle | Triangle;
// Total de valores possíveis: Circle + Rectangle + Triangle
```

### Pattern Matching e Exhaustiveness

**Pattern matching** é o processo de examinar a estrutura de dados e executar código específico baseado no padrão encontrado. Em discriminated unions, o pattern matching é implementado através de verificações da propriedade discriminante, permitindo que o TypeScript realize **exhaustiveness checking** - garantindo que todos os casos possíveis sejam tratados.

O TypeScript implementa exhaustiveness checking através de **never type assignment**, onde casos não tratados resultam em tipos `never`, causando erros de compilação e garantindo que o pattern matching seja completo.

```typescript
// Pattern matching exhaustivo
function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            // TypeScript sabe que shape é Circle aqui
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            // TypeScript sabe que shape é Rectangle aqui  
            return shape.width * shape.height;
        case "triangle":
            // TypeScript sabe que shape é Triangle aqui
            const s = (shape.sideA + shape.sideB + shape.sideC) / 2;
            return Math.sqrt(s * (s - shape.sideA) * (s - shape.sideB) * (s - shape.sideC));
        default:
            // Exhaustiveness checking: se um caso for esquecido, 
            // este ponto terá tipo 'never' e causará erro
            const _exhaustiveCheck: never = shape;
            throw new Error(`Unhandled shape kind: ${_exhaustiveCheck}`);
    }
}
```

### Structural vs Nominal Typing

TypeScript utiliza **structural typing** (tipagem estrutural), onde tipos são considerados compatíveis se possuem a mesma estrutura. Discriminated unions introduzem elementos de **nominal typing** através das propriedades discriminantes, criando distinções explícitas entre tipos que poderiam ser estruturalmente similares.

```typescript
// Sem discriminated union - structural typing pode causar ambiguidade
interface Point2D {
    x: number;
    y: number;
}

interface Vector2D {
    x: number;
    y: number;
}

// Point2D e Vector2D são estruturalmente idênticos
// TypeScript os considera compatíveis, o que pode não ser desejado

// Com discriminated union - distinção nominal clara
interface Point2D_Discriminated {
    type: "point";
    x: number;
    y: number;
}

interface Vector2D_Discriminated {
    type: "vector";
    x: number;
    y: number;
}

// Agora são distintos devido às propriedades discriminantes
type Coordinate = Point2D_Discriminated | Vector2D_Discriminated;
```

## 🔍 Análise Detalhada

### 1. Design de Propriedades Discriminantes Eficazes

A escolha da propriedade discriminante é crucial para a eficácia de um discriminated union. A propriedade deve ser **única**, **imutável** e **semanticamente significativa**.

```typescript
// Boas práticas para propriedades discriminantes

// ✓ BOM: Uso de string literals específicas
interface LoadingState {
    status: "loading";
    progress?: number;
}

interface SuccessState {
    status: "success";
    data: any;
    timestamp: number;
}

interface ErrorState {
    status: "error";
    error: string;
    code: number;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

// ✓ BOM: Múltiplas propriedades discriminantes para granularidade
interface UserCreatedEvent {
    type: "user";
    action: "created";
    userId: string;
    userData: UserData;
}

interface UserUpdatedEvent {
    type: "user";
    action: "updated";
    userId: string;
    changes: Partial<UserData>;
}

interface ProductCreatedEvent {
    type: "product";
    action: "created";
    productId: string;
    productData: ProductData;
}

// Discriminação hierárquica: primeiro por type, depois por action
type DomainEvent = UserCreatedEvent | UserUpdatedEvent | ProductCreatedEvent;

// ✗ RUIM: Valores discriminantes ambíguos
interface BadExample1 {
    kind: string; // Muito genérico
    data: any;
}

interface BadExample2 {
    kind: 1; // Números mágicos
    value: string;
}

// ✗ RUIM: Propriedade discriminante opcional
interface BadExample3 {
    type?: "user"; // Opcional quebra o pattern matching
    name: string;
}
```

### 2. Pattern Matching Avançado com Nested Discriminators

Discriminated unions podem ser organizados hierarquicamente para criar pattern matching mais sofisticado e organizacional.

```typescript
// Sistema hierárquico de eventos
interface UIEvent {
    category: "ui";
    type: "click" | "scroll" | "resize";
    timestamp: number;
}

interface ClickEvent extends UIEvent {
    type: "click";
    element: string;
    coordinates: { x: number; y: number };
}

interface ScrollEvent extends UIEvent {
    type: "scroll";
    delta: { x: number; y: number };
}

interface ResizeEvent extends UIEvent {
    type: "resize";
    newSize: { width: number; height: number };
}

interface NetworkEvent {
    category: "network";
    type: "request" | "response" | "error";
    timestamp: number;
}

interface RequestEvent extends NetworkEvent {
    type: "request";
    url: string;
    method: string;
}

interface ResponseEvent extends NetworkEvent {
    type: "response";
    status: number;
    data: any;
}

interface NetworkErrorEvent extends NetworkEvent {
    type: "error";
    error: string;
    retryCount: number;
}

// Union hierárquico
type UIEventTypes = ClickEvent | ScrollEvent | ResizeEvent;
type NetworkEventTypes = RequestEvent | ResponseEvent | NetworkErrorEvent;
type ApplicationEvent = UIEventTypes | NetworkEventTypes;

// Pattern matching hierárquico
function handleApplicationEvent(event: ApplicationEvent): void {
    // Primeiro nível: categoria
    switch (event.category) {
        case "ui":
            handleUIEvent(event);
            break;
        case "network":
            handleNetworkEvent(event);
            break;
    }
}

function handleUIEvent(event: UIEventTypes): void {
    // Segundo nível: tipo específico
    switch (event.type) {
        case "click":
            // event é ClickEvent aqui
            console.log(`Click on ${event.element} at (${event.coordinates.x}, ${event.coordinates.y})`);
            break;
        case "scroll":
            // event é ScrollEvent aqui
            console.log(`Scroll delta: (${event.delta.x}, ${event.delta.y})`);
            break;
        case "resize":
            // event é ResizeEvent aqui
            console.log(`Resize to: ${event.newSize.width}x${event.newSize.height}`);
            break;
    }
}

function handleNetworkEvent(event: NetworkEventTypes): void {
    switch (event.type) {
        case "request":
            // event é RequestEvent aqui
            console.log(`${event.method} request to ${event.url}`);
            break;
        case "response":
            // event é ResponseEvent aqui
            console.log(`Response with status ${event.status}`);
            break;
        case "error":
            // event é NetworkErrorEvent aqui
            console.log(`Network error (attempt ${event.retryCount}): ${event.error}`);
            break;
    }
}
```

### 3. Discriminated Unions com Generics

Combinação de discriminated unions com generics para criar abstrações reutilizáveis e type-safe.

```typescript
// Result type genérico - padrão fundamental para error handling
interface Success<T> {
    kind: "success";
    value: T;
}

interface Failure<E> {
    kind: "failure";
    error: E;
}

type Result<T, E = string> = Success<T> | Failure<E>;

// Funções utilitárias para Result
function success<T>(value: T): Result<T, never> {
    return { kind: "success", value };
}

function failure<E>(error: E): Result<never, E> {
    return { kind: "failure", error };
}

// Funções para trabalhar com Results
function map<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => U
): Result<U, E> {
    switch (result.kind) {
        case "success":
            return success(fn(result.value));
        case "failure":
            return result; // Propaga o erro
    }
}

function flatMap<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => Result<U, E>
): Result<U, E> {
    switch (result.kind) {
        case "success":
            return fn(result.value);
        case "failure":
            return result; // Propaga o erro
    }
}

function mapError<T, E, F>(
    result: Result<T, E>,
    fn: (error: E) => F
): Result<T, F> {
    switch (result.kind) {
        case "success":
            return result;
        case "failure":
            return failure(fn(result.error));
    }
}

// Uso prático do Result type
async function fetchUserData(id: string): Promise<Result<User, FetchError>> {
    try {
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
            return failure({
                type: "http_error",
                status: response.status,
                message: response.statusText
            });
        }
        
        const userData = await response.json();
        return success(userData);
    } catch (error) {
        return failure({
            type: "network_error",
            message: error.message
        });
    }
}

interface FetchError {
    type: "http_error" | "network_error" | "parse_error";
    status?: number;
    message: string;
}

// Chain de operações com Results
async function processUser(id: string): Promise<Result<string, string>> {
    const userResult = await fetchUserData(id);
    
    return flatMap(userResult, user =>
        map(validateUser(user), validUser =>
            formatUserDisplay(validUser)
        )
    );
}

function validateUser(user: any): Result<User, string> {
    if (!user.name || !user.email) {
        return failure("User validation failed: missing required fields");
    }
    return success(user as User);
}

function formatUserDisplay(user: User): string {
    return `${user.name} (${user.email})`;
}
```

### 4. State Machine Implementation

Discriminated unions são ideais para implementar máquinas de estado type-safe, garantindo transições válidas e estados bem definidos.

```typescript
// Estados de uma máquina de pedido
interface IdleState {
    status: "idle";
}

interface LoadingState {
    status: "loading";
    startTime: number;
    operation: string;
}

interface LoadedState {
    status: "loaded";
    data: OrderData;
    lastFetch: number;
}

interface ErrorState {
    status: "error";
    error: string;
    canRetry: boolean;
    retryCount: number;
}

interface ProcessingState {
    status: "processing";
    step: "validation" | "payment" | "fulfillment";
    progress: number;
}

interface CompletedState {
    status: "completed";
    orderId: string;
    completedAt: number;
}

type OrderState = IdleState | LoadingState | LoadedState | ErrorState | ProcessingState | CompletedState;

// Eventos que causam transições de estado
interface LoadEvent {
    type: "LOAD";
    orderId: string;
}

interface LoadSuccessEvent {
    type: "LOAD_SUCCESS";
    data: OrderData;
}

interface LoadErrorEvent {
    type: "LOAD_ERROR";
    error: string;
}

interface ProcessEvent {
    type: "PROCESS";
}

interface ProcessProgressEvent {
    type: "PROCESS_PROGRESS";
    step: ProcessingState["step"];
    progress: number;
}

interface ProcessCompleteEvent {
    type: "PROCESS_COMPLETE";
    orderId: string;
}

interface RetryEvent {
    type: "RETRY";
}

interface ResetEvent {
    type: "RESET";
}

type OrderEvent = LoadEvent | LoadSuccessEvent | LoadErrorEvent | ProcessEvent | 
                 ProcessProgressEvent | ProcessCompleteEvent | RetryEvent | ResetEvent;

// State machine implementation
class OrderStateMachine {
    private state: OrderState = { status: "idle" };
    private listeners: Array<(state: OrderState) => void> = [];
    
    getState(): OrderState {
        return this.state;
    }
    
    onStateChange(listener: (state: OrderState) => void): void {
        this.listeners.push(listener);
    }
    
    private setState(newState: OrderState): void {
        this.state = newState;
        this.listeners.forEach(listener => listener(newState));
    }
    
    dispatch(event: OrderEvent): void {
        const newState = this.transition(this.state, event);
        if (newState !== this.state) {
            this.setState(newState);
        }
    }
    
    private transition(currentState: OrderState, event: OrderEvent): OrderState {
        // Pattern matching para transições válidas
        switch (currentState.status) {
            case "idle":
                return this.handleIdleState(currentState, event);
            case "loading":
                return this.handleLoadingState(currentState, event);
            case "loaded":
                return this.handleLoadedState(currentState, event);
            case "error":
                return this.handleErrorState(currentState, event);
            case "processing":
                return this.handleProcessingState(currentState, event);
            case "completed":
                return this.handleCompletedState(currentState, event);
            default:
                const _exhaustiveCheck: never = currentState;
                throw new Error(`Unhandled state: ${_exhaustiveCheck}`);
        }
    }
    
    private handleIdleState(state: IdleState, event: OrderEvent): OrderState {
        switch (event.type) {
            case "LOAD":
                return {
                    status: "loading",
                    startTime: Date.now(),
                    operation: `Loading order ${event.orderId}`
                };
            default:
                return state; // Ignorar eventos não válidos
        }
    }
    
    private handleLoadingState(state: LoadingState, event: OrderEvent): OrderState {
        switch (event.type) {
            case "LOAD_SUCCESS":
                return {
                    status: "loaded",
                    data: event.data,
                    lastFetch: Date.now()
                };
            case "LOAD_ERROR":
                return {
                    status: "error",
                    error: event.error,
                    canRetry: true,
                    retryCount: 0
                };
            default:
                return state;
        }
    }
    
    private handleLoadedState(state: LoadedState, event: OrderEvent): OrderState {
        switch (event.type) {
            case "PROCESS":
                return {
                    status: "processing",
                    step: "validation",
                    progress: 0
                };
            case "RESET":
                return { status: "idle" };
            default:
                return state;
        }
    }
    
    private handleErrorState(state: ErrorState, event: OrderEvent): OrderState {
        switch (event.type) {
            case "RETRY":
                if (state.canRetry) {
                    return {
                        status: "loading",
                        startTime: Date.now(),
                        operation: "Retrying..."
                    };
                }
                return state;
            case "RESET":
                return { status: "idle" };
            default:
                return state;
        }
    }
    
    private handleProcessingState(state: ProcessingState, event: OrderEvent): OrderState {
        switch (event.type) {
            case "PROCESS_PROGRESS":
                return {
                    ...state,
                    step: event.step,
                    progress: event.progress
                };
            case "PROCESS_COMPLETE":
                return {
                    status: "completed",
                    orderId: event.orderId,
                    completedAt: Date.now()
                };
            case "LOAD_ERROR":
                return {
                    status: "error",
                    error: event.error,
                    canRetry: false,
                    retryCount: 0
                };
            default:
                return state;
        }
    }
    
    private handleCompletedState(state: CompletedState, event: OrderEvent): OrderState {
        switch (event.type) {
            case "RESET":
                return { status: "idle" };
            default:
                return state; // Estado final, apenas aceita reset
        }
    }
}

interface OrderData {
    id: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    customer: { name: string; email: string };
}

// Uso da state machine
const orderMachine = new OrderStateMachine();

orderMachine.onStateChange(state => {
    console.log("State changed:", state);
});

// Simular fluxo de pedido
orderMachine.dispatch({ type: "LOAD", orderId: "12345" });
setTimeout(() => {
    orderMachine.dispatch({
        type: "LOAD_SUCCESS",
        data: {
            id: "12345",
            items: [{ name: "Product A", quantity: 2, price: 29.99 }],
            customer: { name: "John Doe", email: "john@example.com" }
        }
    });
}, 1000);
```

## 🎯 Aplicabilidade Prática

### 1. Sistema de Notificações Multi-canal

Sistema robusto para gerenciar diferentes tipos de notificações com configurações específicas para cada canal.

```typescript
// Diferentes tipos de notificação por canal
interface EmailNotification {
    channel: "email";
    recipient: string;
    subject: string;
    body: string;
    attachments?: Array<{
        filename: string;
        content: string;
        mimeType: string;
    }>;
    priority: "low" | "normal" | "high";
}

interface SMSNotification {
    channel: "sms";
    phoneNumber: string;
    message: string;
    shortCode?: string;
}

interface PushNotification {
    channel: "push";
    deviceTokens: string[];
    title: string;
    body: string;
    badge?: number;
    sound?: string;
    data?: Record<string, any>;
}

interface WebhookNotification {
    channel: "webhook";
    url: string;
    method: "POST" | "PUT";
    headers?: Record<string, string>;
    payload: Record<string, any>;
    retryPolicy: {
        maxRetries: number;
        backoffMs: number;
    };
}

interface SlackNotification {
    channel: "slack";
    webhookUrl: string;
    channel_name: string;
    text: string;
    attachments?: Array<{
        color: string;
        title: string;
        text: string;
        fields?: Array<{
            title: string;
            value: string;
            short: boolean;
        }>;
    }>;
}

type Notification = EmailNotification | SMSNotification | PushNotification | 
                   WebhookNotification | SlackNotification;

// Estados do processo de envio
interface PendingNotification {
    status: "pending";
    notification: Notification;
    scheduledFor?: number;
    attempts: number;
}

interface SendingNotification {
    status: "sending";
    notification: Notification;
    startedAt: number;
    attempts: number;
}

interface SentNotification {
    status: "sent";
    notification: Notification;
    sentAt: number;
    attempts: number;
    responseData?: any;
}

interface FailedNotification {
    status: "failed";
    notification: Notification;
    attempts: number;
    lastAttemptAt: number;
    error: string;
    willRetry: boolean;
    nextRetryAt?: number;
}

type NotificationState = PendingNotification | SendingNotification | 
                        SentNotification | FailedNotification;

// Sistema de processamento
class NotificationService {
    private processors: {
        [K in Notification['channel']]: (notification: Extract<Notification, { channel: K }>) => Promise<any>
    };
    
    constructor() {
        this.processors = {
            email: this.sendEmail.bind(this),
            sms: this.sendSMS.bind(this),
            push: this.sendPush.bind(this),
            webhook: this.sendWebhook.bind(this),
            slack: this.sendSlack.bind(this)
        };
    }
    
    async processNotification(state: NotificationState): Promise<NotificationState> {
        switch (state.status) {
            case "pending":
                return this.handlePendingNotification(state);
            case "sending":
                return this.handleSendingNotification(state);
            case "failed":
                return this.handleFailedNotification(state);
            case "sent":
                return state; // Estado final
            default:
                const _exhaustiveCheck: never = state;
                throw new Error(`Unhandled notification state: ${_exhaustiveCheck}`);
        }
    }
    
    private async handlePendingNotification(state: PendingNotification): Promise<NotificationState> {
        // Verificar se deve enviar agora
        if (state.scheduledFor && Date.now() < state.scheduledFor) {
            return state; // Ainda não é hora
        }
        
        return {
            status: "sending",
            notification: state.notification,
            startedAt: Date.now(),
            attempts: state.attempts + 1
        };
    }
    
    private async handleSendingNotification(state: SendingNotification): Promise<NotificationState> {
        try {
            // Dispatch baseado no canal
            const processor = this.processors[state.notification.channel];
            const responseData = await processor(state.notification as any);
            
            return {
                status: "sent",
                notification: state.notification,
                sentAt: Date.now(),
                attempts: state.attempts,
                responseData
            };
        } catch (error) {
            const shouldRetry = state.attempts < this.getMaxRetries(state.notification.channel);
            
            return {
                status: "failed",
                notification: state.notification,
                attempts: state.attempts,
                lastAttemptAt: Date.now(),
                error: error.message,
                willRetry: shouldRetry,
                nextRetryAt: shouldRetry ? Date.now() + this.getRetryDelay(state.attempts) : undefined
            };
        }
    }
    
    private async handleFailedNotification(state: FailedNotification): Promise<NotificationState> {
        if (!state.willRetry || !state.nextRetryAt || Date.now() < state.nextRetryAt) {
            return state; // Não deve tentar novamente ainda
        }
        
        return {
            status: "pending",
            notification: state.notification,
            attempts: state.attempts
        };
    }
    
    private async sendEmail(notification: EmailNotification): Promise<any> {
        // Implementação específica para email
        console.log(`Sending email to ${notification.recipient}: ${notification.subject}`);
        
        // Simular diferentes behaviors baseados na prioridade
        if (notification.priority === "high") {
            // Usar serviço premium para alta prioridade
            return this.sendPriorityEmail(notification);
        } else {
            // Usar serviço padrão
            return this.sendStandardEmail(notification);
        }
    }
    
    private async sendSMS(notification: SMSNotification): Promise<any> {
        console.log(`Sending SMS to ${notification.phoneNumber}: ${notification.message}`);
        
        // Validar número de telefone
        if (!this.isValidPhoneNumber(notification.phoneNumber)) {
            throw new Error("Invalid phone number format");
        }
        
        // Simular envio
        return { messageId: "sms_" + Date.now() };
    }
    
    private async sendPush(notification: PushNotification): Promise<any> {
        console.log(`Sending push notification to ${notification.deviceTokens.length} devices`);
        
        // Filtrar tokens válidos
        const validTokens = notification.deviceTokens.filter(token => this.isValidDeviceToken(token));
        
        if (validTokens.length === 0) {
            throw new Error("No valid device tokens");
        }
        
        return { 
            sentTo: validTokens.length,
            messageId: "push_" + Date.now()
        };
    }
    
    private async sendWebhook(notification: WebhookNotification): Promise<any> {
        console.log(`Sending webhook to ${notification.url}`);
        
        const response = await fetch(notification.url, {
            method: notification.method,
            headers: {
                "Content-Type": "application/json",
                ...notification.headers
            },
            body: JSON.stringify(notification.payload)
        });
        
        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
        }
        
        return { status: response.status, headers: response.headers };
    }
    
    private async sendSlack(notification: SlackNotification): Promise<any> {
        console.log(`Sending Slack message to ${notification.channel_name}`);
        
        const payload = {
            channel: notification.channel_name,
            text: notification.text,
            attachments: notification.attachments
        };
        
        const response = await fetch(notification.webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Slack webhook failed: ${response.status}`);
        }
        
        return { timestamp: Date.now() };
    }
    
    // Métodos auxiliares
    private getMaxRetries(channel: Notification['channel']): number {
        const retryLimits = {
            email: 3,
            sms: 2,
            push: 3,
            webhook: 5,
            slack: 2
        };
        return retryLimits[channel];
    }
    
    private getRetryDelay(attempts: number): number {
        // Exponential backoff
        return Math.min(1000 * Math.pow(2, attempts), 30000);
    }
    
    private sendPriorityEmail(notification: EmailNotification): Promise<any> {
        // Implementação para email prioritário
        return Promise.resolve({ priority: true, messageId: "email_priority_" + Date.now() });
    }
    
    private sendStandardEmail(notification: EmailNotification): Promise<any> {
        // Implementação para email padrão
        return Promise.resolve({ messageId: "email_standard_" + Date.now() });
    }
    
    private isValidPhoneNumber(phone: string): boolean {
        return /^\+?[1-9]\d{1,14}$/.test(phone);
    }
    
    private isValidDeviceToken(token: string): boolean {
        return token.length > 10; // Simplificado
    }
}

// Uso do sistema
const notificationService = new NotificationService();

// Exemplo de diferentes tipos de notificação
const notifications: Notification[] = [
    {
        channel: "email",
        recipient: "user@example.com",
        subject: "Order Confirmation",
        body: "Your order has been confirmed.",
        priority: "high"
    },
    {
        channel: "sms",
        phoneNumber: "+1234567890",
        message: "Your order #12345 is being processed."
    },
    {
        channel: "push",
        deviceTokens: ["token1", "token2"],
        title: "Order Update",
        body: "Your order status has changed."
    },
    {
        channel: "webhook",
        url: "https://api.partner.com/notifications",
        method: "POST",
        payload: { event: "order.created", orderId: "12345" },
        retryPolicy: { maxRetries: 3, backoffMs: 1000 }
    }
];

// Processar todas as notificações
notifications.forEach(async notification => {
    let state: NotificationState = {
        status: "pending",
        notification,
        attempts: 0
    };
    
    // Processar até estado final
    while (state.status !== "sent" && (state.status !== "failed" || state.willRetry)) {
        state = await notificationService.processNotification(state);
        await new Promise(resolve => setTimeout(resolve, 100)); // Pequeno delay
    }
    
    console.log(`Final state for ${notification.channel}:`, state.status);
});
```

## ⚠️ Limitações e Armadilhas

### 1. Propriedades Discriminantes Mutáveis

**Problema**: Permitir mutação de propriedades discriminantes pode quebrar type safety.

```typescript
interface Dog {
    type: "dog";
    breed: string;
}

interface Cat {
    type: "cat";
    color: string;
}

type Pet = Dog | Cat;

// Problema: propriedade discriminante mutável
function problematicFunction(pet: Pet) {
    if (pet.type === "dog") {
        // pet é Dog aqui
        console.log(pet.breed); // ✓ OK
        
        // PERIGO: mutação da propriedade discriminante
        (pet as any).type = "cat";
        
        // Agora pet não é mais um Dog válido, mas TypeScript ainda pensa que é
        console.log(pet.breed); // Runtime error possível
    }
}
```

**Solução**: Usar `readonly` ou tipos imutáveis.

```typescript
interface Dog {
    readonly type: "dog";
    breed: string;
}

interface Cat {
    readonly type: "cat";
    color: string;
}

// Ou usar utility type
type ImmutablePet = Readonly<Pet>;

// Ou criar factory functions que garantem imutabilidade
function createDog(breed: string): Dog {
    return Object.freeze({
        type: "dog" as const,
        breed
    });
}
```

### 2. Exhaustiveness Checking Incompleto

**Problema**: Esquecer de atualizar pattern matching quando novos tipos são adicionados ao union.

```typescript
// Union original
type Shape = Circle | Rectangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        // Sem default case - vulnerável a mudanças
    }
}

// Depois adiciona-se novo tipo
type Shape = Circle | Rectangle | Triangle; // Triangle adicionado

// getArea agora está quebrado, mas pode não ser detectado se não tiver exhaustiveness checking
```

**Solução**: Sempre implementar exhaustiveness checking.

```typescript
function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            const s = (shape.sideA + shape.sideB + shape.sideC) / 2;
            return Math.sqrt(s * (s - shape.sideA) * (s - shape.sideB) * (s - shape.sideC));
        default:
            // Exhaustiveness checking - garante que todos os casos sejam tratados
            const _exhaustiveCheck: never = shape;
            throw new Error(`Unhandled shape kind: ${_exhaustiveCheck}`);
    }
}
```

### 3. Discriminated Unions Deeply Nested

**Problema**: Unions aninhados profundamente podem tornar o código difícil de manter.

```typescript
// Estrutura muito aninhada - difícil de manter
interface ComplexState {
    ui: {
        modal: {
            type: "confirmation" | "alert" | "custom";
            data: {
                confirmation: { message: string; onConfirm: () => void };
                alert: { title: string; message: string };
                custom: { component: React.Component };
            };
        };
        loading: {
            type: "spinner" | "progress" | "skeleton";
            // ... mais aninhamento
        };
    };
    // ... mais níveis
}
```

**Solução**: Flatten structure e usar composição.

```typescript
// Estrutura mais plana
interface ConfirmationModal {
    modalType: "confirmation";
    message: string;
    onConfirm: () => void;
}

interface AlertModal {
    modalType: "alert";
    title: string;
    message: string;
}

interface CustomModal {
    modalType: "custom";
    component: React.Component;
}

type Modal = ConfirmationModal | AlertModal | CustomModal;

interface UIState {
    activeModal?: Modal;
    loadingType?: "spinner" | "progress" | "skeleton";
}
```

## 🔗 Interconexões com Outros Conceitos

### Relação com Template Literal Types

Discriminated unions podem ser combinados com template literal types para criar tags dinâmicas.

```typescript
// Template literal discriminators
type EventCategory = "user" | "system" | "business";
type EventAction = "create" | "update" | "delete";

type EventType = `${EventCategory}_${EventAction}`;

interface DynamicEvent<T extends EventType> {
    type: T;
    timestamp: number;
    data: T extends `user_${infer Action}` 
        ? { userId: string; action: Action }
        : T extends `system_${infer Action}`
        ? { component: string; action: Action }
        : { entityId: string };
}

// Uso com types dinâmicos
function handleEvent<T extends EventType>(event: DynamicEvent<T>) {
    // Pattern matching baseado em template literal
    if (event.type.startsWith("user_")) {
        // TypeScript infere que event.data tem userId
        console.log(`User event: ${event.data.userId}`);
    }
}
```

### Integração com Conditional Types

Discriminated unions trabalham bem com conditional types para criar transformações de tipo sofisticadas.

```typescript
// Conditional types baseados em discriminated unions
type ApiResponse<T> = 
    | { status: "success"; data: T }
    | { status: "error"; error: string };

// Extract data type from API response
type ExtractData<T> = T extends { status: "success"; data: infer U } ? U : never;

// Extract error type
type ExtractError<T> = T extends { status: "error"; error: infer E } ? E : never;

// Usage
type UserData = ExtractData<ApiResponse<User>>; // User
type UserError = ExtractError<ApiResponse<User>>; // string
```

## 🚀 Evolução e Tendências Futuras

### Pattern Matching Nativo

O futuro pode incluir syntax nativa para pattern matching, similar a Rust ou F#:

```typescript
// Sintaxe hipotética futura
function processShape(shape: Shape) {
    return match shape {
        { kind: "circle", radius } => Math.PI * radius ** 2,
        { kind: "rectangle", width, height } => width * height,
        { kind: "triangle", sideA, sideB, sideC } => {
            const s = (sideA + sideB + sideC) / 2;
            return Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
        }
    }
}
```

### Enhanced Exhaustiveness Checking

Melhorias no exhaustiveness checking com sugestões automáticas:

```typescript
// Possível melhoria futura - auto-completion de cases
function processEvent(event: ApplicationEvent) {
    switch (event.type) {
        case "user_login":
            // ...
        // TypeScript sugere automaticamente cases restantes
        // case "user_logout": // <- Sugestão automática
        // case "system_error": // <- Sugestão automática
    }
}
```

### Runtime Type Validation Integration

Maior integração entre compile-time e runtime validation:

```typescript
// Hipótese futura - validação automática
function processApiData(data: unknown): ApiResponse<User> {
    // Validação automática baseada no discriminated union
    return data as ApiResponse<User> validate;
}
```

---

Este módulo estabelece uma compreensão abrangente de discriminated unions, desde conceitos fundamentais até aplicações práticas avançadas, fornecendo as ferramentas necessárias para implementar pattern matching type-safe e sistemas robustos de modelagem de dados.