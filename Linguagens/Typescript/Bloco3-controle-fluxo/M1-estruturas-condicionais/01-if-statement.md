# Módulo 14: If Statement - Estruturas Condicionais Fundamentais

## 🎯 Introdução

O **if statement** representa uma das estruturas de controle de fluxo mais fundamentais e essenciais na programação, permitindo que programas tomem decisões baseadas em condições específicas. Em TypeScript, o if statement não apenas controla o fluxo de execução do código, mas também trabalha de forma integrada com o sistema de tipos para fornecer **type narrowing** automático e verificações de tipo em tempo de compilação.

Esta estrutura condicional permite que o código execute diferentes blocos de instruções dependendo se uma expressão booleana é avaliada como verdadeira ou falsa. O TypeScript expande significativamente as capacidades do if statement tradicional do JavaScript, adicionando análise estática de tipos, verificação de null safety e refinamento de tipos baseado em guards condicionais.

O if statement em TypeScript não é apenas uma ferramenta de controle de fluxo, mas também um mecanismo poderoso para garantir type safety, permitindo que o compilador entenda e verifique diferentes caminhos de execução e os tipos associados a cada contexto condicional.

## 📋 Sumário

1. **Sintaxe Fundamental**: Estrutura básica e componentes do if statement
2. **Expressões Booleanas**: Construção e avaliação de condições
3. **Bloco de Código**: Organização e escopo dentro de condicionais
4. **Type Narrowing Básico**: Como o TypeScript refina tipos em condicionais
5. **Condições Complexas**: Operadores lógicos e expressões compostas
6. **Null Safety**: Verificações de nulidade e undefined
7. **Performance**: Otimizações e considerações de execução
8. **Padrões Comuns**: Idiomas e práticas recomendadas
9. **Debugging**: Técnicas para depuração de condicionais
10. **Integration Patterns**: Combinação com outros recursos do TypeScript

## 🧠 Fundamentos Conceituais

### Anatomia do If Statement

O if statement em TypeScript segue a sintaxe clássica das linguagens da família C, mas com adições específicas para trabalhar com o sistema de tipos:

```typescript
// Estrutura básica
if (condition) {
    // Bloco executado quando condition é truthy
}

// Sintaxe detalhada com type annotations
interface User {
    id: number;
    name: string;
    email?: string; // Propriedade opcional
}

function processUser(user: User | null) {
    // Type guard básico - verifica se user não é null
    if (user) {
        // Dentro deste bloco, TypeScript sabe que user é User, não User | null
        console.log(`Processing user: ${user.name}`);
        console.log(`ID: ${user.id}`);
        
        // Verificação de propriedade opcional
        if (user.email) {
            // Aqui TypeScript sabe que user.email é string, não string | undefined
            console.log(`Email: ${user.email.toLowerCase()}`);
        }
    }
}
```

### Avaliação de Expressões Booleanas

O TypeScript mantém a mesma semântica de avaliação booleana do JavaScript, mas adiciona verificações de tipo em tempo de compilação:

```typescript
// Tipos de condições válidas
let condition1: boolean = true;
let condition2: number = 0;
let condition3: string = "hello";
let condition4: object | null = { name: "test" };
let condition5: undefined = undefined;

// Verificações diretas
if (condition1) { /* boolean literal */ }
if (condition2) { /* number - 0 é falsy, outros são truthy */ }
if (condition3) { /* string - "" é falsy, outras são truthy */ }
if (condition4) { /* object - null é falsy, objetos são truthy */ }
if (condition5) { /* undefined é sempre falsy */ }

// Comparações explícitas
if (condition2 > 0) { /* comparação numérica */ }
if (condition3.length > 0) { /* verificação de comprimento */ }
if (condition4 !== null) { /* verificação explícita de null */ }
if (condition5 !== undefined) { /* verificação explícita de undefined */ }
```

### Control Flow Analysis

O TypeScript realiza análise de fluxo de controle para determinar quais tipos são possíveis em diferentes pontos do código:

```typescript
function analyzeValue(value: string | number | boolean) {
    // Antes do if: value pode ser string | number | boolean
    console.log("Before if:", typeof value);
    
    if (typeof value === "string") {
        // Dentro deste bloco: value é definitivamente string
        console.log("String value:", value.toUpperCase()); // ✓ Método de string disponível
        console.log("Length:", value.length); // ✓ Propriedade de string disponível
        // value.toFixed(); // ✗ Erro: toFixed não existe em string
    }
    
    if (typeof value === "number") {
        // Dentro deste bloco: value é definitivamente number
        console.log("Number value:", value.toFixed(2)); // ✓ Método de number disponível
        console.log("Is integer:", Number.isInteger(value)); // ✓ Funções de number disponíveis
        // value.toUpperCase(); // ✗ Erro: toUpperCase não existe em number
    }
    
    if (typeof value === "boolean") {
        // Dentro deste bloco: value é definitivamente boolean
        console.log("Boolean value:", value ? "true" : "false");
        console.log("Negated:", !value);
        // value.length; // ✗ Erro: length não existe em boolean
    }
    
    // Após todos os ifs: TypeScript ainda considera o tipo original
    // porque os ifs não são exhaustivos (não cobrem todos os casos com else)
}
```

## 🔍 Análise Detalhada

### 1. Type Guards e Narrowing Patterns

O if statement é o mecanismo principal para implementar type guards em TypeScript:

```typescript
// User-defined type guard functions
interface Dog {
    breed: string;
    bark(): void;
}

interface Cat {
    color: string;
    meow(): void;
}

type Pet = Dog | Cat;

// Type guard function
function isDog(pet: Pet): pet is Dog {
    return 'breed' in pet && 'bark' in pet;
}

function isCat(pet: Pet): pet is Cat {
    return 'color' in pet && 'meow' in pet;
}

// Uso de type guards com if statements
function handlePet(pet: Pet) {
    if (isDog(pet)) {
        // pet é definitivamente Dog aqui
        console.log(`This is a ${pet.breed}`);
        pet.bark(); // ✓ Método disponível
        // pet.meow(); // ✗ Erro: meow não existe em Dog
    }
    
    if (isCat(pet)) {
        // pet é definitivamente Cat aqui
        console.log(`This cat is ${pet.color}`);
        pet.meow(); // ✓ Método disponível
        // pet.bark(); // ✗ Erro: bark não existe em Cat
    }
}

// Built-in type guards
function processValue(value: unknown) {
    // instanceof type guard
    if (value instanceof Date) {
        // value é Date aqui
        console.log("Date:", value.toISOString());
    }
    
    // typeof type guard
    if (typeof value === "string") {
        // value é string aqui
        console.log("String length:", value.length);
    }
    
    // Array.isArray type guard
    if (Array.isArray(value)) {
        // value é array aqui
        console.log("Array length:", value.length);
        value.forEach(item => console.log(item));
    }
    
    // Property existence check
    if (value && typeof value === "object" && "name" in value) {
        // value é object com propriedade name
        const obj = value as { name: unknown };
        if (typeof obj.name === "string") {
            console.log("Object name:", obj.name.toUpperCase());
        }
    }
}
```

### 2. Null Safety e Optional Chaining

O TypeScript fortalece significativamente a verificação de null safety através de if statements:

```typescript
interface UserProfile {
    id: number;
    name: string;
    email?: string;
    address?: {
        street: string;
        city: string;
        zipCode?: string;
    };
    preferences?: {
        theme: "light" | "dark";
        notifications: boolean;
    };
}

function displayUserInfo(user: UserProfile | null | undefined) {
    // Verificação de nulidade do objeto principal
    if (!user) {
        console.log("No user data available");
        return; // Early return pattern
    }
    
    // Aqui user é definitivamente UserProfile
    console.log(`User ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    
    // Verificação de propriedade opcional
    if (user.email) {
        // user.email é string aqui, não string | undefined
        console.log(`Email: ${user.email}`);
        
        // Verificações adicionais em propriedades
        if (user.email.includes("@company.com")) {
            console.log("Corporate email detected");
        }
    } else {
        console.log("No email provided");
    }
    
    // Verificação de objeto aninhado
    if (user.address) {
        // user.address é definitivamente Address aqui
        console.log(`Address: ${user.address.street}, ${user.address.city}`);
        
        // Verificação de propriedade opcional aninhada
        if (user.address.zipCode) {
            console.log(`ZIP Code: ${user.address.zipCode}`);
        }
    }
    
    // Verificação de objeto complexo com múltiplas propriedades
    if (user.preferences) {
        console.log(`Theme: ${user.preferences.theme}`);
        console.log(`Notifications: ${user.preferences.notifications ? "enabled" : "disabled"}`);
    }
}

// Padrão alternativo usando optional chaining (quando apropriado)
function displayUserInfoAlternative(user: UserProfile | null | undefined) {
    if (!user) return;
    
    // Combinação de if statement com optional chaining
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email ?? "Not provided"}`);
    
    // Optional chaining com verificação condicional
    if (user.address?.zipCode) {
        // Mesmo com optional chaining, ainda precisa de if para type narrowing
        console.log(`ZIP Code: ${user.address.zipCode}`);
    }
}
```

### 3. Condições Compostas e Operadores Lógicos

If statements podem incorporar lógica complexa através de operadores booleanos:

```typescript
interface ValidationContext {
    isEmailValid: boolean;
    isPasswordStrong: boolean;
    isTermsAccepted: boolean;
    userAge: number;
    accountType: "free" | "premium" | "enterprise";
}

function validateRegistration(context: ValidationContext): boolean {
    // Condições simples
    if (!context.isEmailValid) {
        console.log("Email is invalid");
        return false;
    }
    
    // Condições compostas com AND (&&)
    if (context.isEmailValid && context.isPasswordStrong) {
        console.log("Basic validation passed");
    }
    
    // Condições compostas com OR (||)
    if (context.userAge < 13 || !context.isTermsAccepted) {
        console.log("Age or terms requirement not met");
        return false;
    }
    
    // Condições complexas com parênteses para precedência
    if ((context.userAge >= 18 && context.accountType === "premium") || 
        (context.userAge >= 21 && context.accountType === "enterprise")) {
        console.log("Adult account with premium features");
    }
    
    // Negação e múltiplas condições
    if (!(context.userAge < 18) && context.isTermsAccepted && context.accountType !== "free") {
        console.log("Full access granted");
    }
    
    // Short-circuit evaluation com type narrowing
    if (context.accountType === "enterprise" && context.userAge >= 18) {
        // Ambas condições garantem type safety
        console.log("Enterprise user with full privileges");
        return true;
    }
    
    return false;
}

// Funções auxiliares para condições complexas
function isAdultUser(age: number): boolean {
    return age >= 18;
}

function hasPremiumAccess(accountType: string): boolean {
    return accountType === "premium" || accountType === "enterprise";
}

function validateComplexConditions(context: ValidationContext) {
    // Uso de funções auxiliares para melhor legibilidade
    if (isAdultUser(context.userAge) && hasPremiumAccess(context.accountType)) {
        console.log("User has premium access");
    }
    
    // Condições com early returns para reduzir aninhamento
    if (!context.isEmailValid) return false;
    if (!context.isPasswordStrong) return false;
    if (!context.isTermsAccepted) return false;
    
    // Se chegou até aqui, todas as validações básicas passaram
    console.log("All basic validations passed");
    return true;
}
```

### 4. Performance e Otimização

Considerações de performance específicas para if statements em TypeScript:

```typescript
// Ordem de condições para performance otimizada
interface ProcessingContext {
    data: any[];
    isLargeDataset: boolean;
    processingMode: "fast" | "thorough" | "debug";
    cacheEnabled: boolean;
}

function optimizedProcessing(context: ProcessingContext) {
    // Verificações mais prováveis/rápidas primeiro
    if (context.data.length === 0) {
        // Quick exit para caso mais comum
        return [];
    }
    
    // Verificações baseadas em flags booleanos (rápidas)
    if (!context.cacheEnabled) {
        console.log("Cache disabled - processing without cache");
    }
    
    // Verificações de string literals (otimizadas pelo compilador)
    if (context.processingMode === "fast") {
        return fastProcessing(context.data);
    }
    
    // Verificações mais custosas por último
    if (context.isLargeDataset && context.data.length > 10000) {
        return optimizedLargeDataProcessing(context.data);
    }
    
    return standardProcessing(context.data);
}

// Padrões para evitar verificações desnecessárias
class DataProcessor {
    private cache = new Map<string, any>();
    
    process(id: string, data: any[]) {
        // Early return com cache lookup
        if (this.cache.has(id)) {
            return this.cache.get(id);
        }
        
        // Verificação de precondições
        if (!data || data.length === 0) {
            return null;
        }
        
        // Processamento principal apenas quando necessário
        const result = this.performProcessing(data);
        this.cache.set(id, result);
        return result;
    }
    
    private performProcessing(data: any[]): any {
        // Implementação do processamento
        return data.map(item => ({ processed: true, ...item }));
    }
}

function fastProcessing(data: any[]): any[] {
    return data.slice(0, 100); // Processamento limitado
}

function optimizedLargeDataProcessing(data: any[]): any[] {
    // Processamento otimizado para grandes volumes
    const chunkSize = 1000;
    const results: any[] = [];
    
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        results.push(...processChunk(chunk));
    }
    
    return results;
}

function standardProcessing(data: any[]): any[] {
    return data.map(item => processItem(item));
}

function processChunk(chunk: any[]): any[] {
    return chunk.map(item => processItem(item));
}

function processItem(item: any): any {
    return { processed: true, ...item };
}
```

## 🎯 Aplicabilidade Prática

### 1. Sistema de Validação de Formulário

Implementação robusta de validação usando if statements com type safety:

```typescript
interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    age: number;
    termsAccepted: boolean;
    newsletter?: boolean;
}

interface ValidationError {
    field: keyof FormData;
    message: string;
    code: string;
}

type ValidationResult = {
    isValid: true;
    data: FormData;
} | {
    isValid: false;
    errors: ValidationError[];
};

class FormValidator {
    private errors: ValidationError[] = [];
    
    validate(data: FormData): ValidationResult {
        this.errors = [];
        
        // Validação de email
        this.validateEmail(data.email);
        
        // Validação de senha
        this.validatePassword(data.password);
        
        // Validação de confirmação de senha
        this.validatePasswordConfirmation(data.password, data.confirmPassword);
        
        // Validação de idade
        this.validateAge(data.age);
        
        // Validação de termos
        this.validateTerms(data.termsAccepted);
        
        // Retorno baseado em condição
        if (this.errors.length === 0) {
            return {
                isValid: true,
                data: data
            };
        } else {
            return {
                isValid: false,
                errors: [...this.errors]
            };
        }
    }
    
    private validateEmail(email: string): void {
        // Verificação básica de presença
        if (!email) {
            this.addError("email", "Email is required", "REQUIRED");
            return;
        }
        
        // Verificação de tipo (redundante mas demonstrativa)
        if (typeof email !== "string") {
            this.addError("email", "Email must be a string", "INVALID_TYPE");
            return;
        }
        
        // Verificação de formato
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.addError("email", "Email format is invalid", "INVALID_FORMAT");
            return;
        }
        
        // Verificação de comprimento
        if (email.length > 254) {
            this.addError("email", "Email is too long", "TOO_LONG");
            return;
        }
        
        // Verificação de domínios suspeitos
        const suspiciousDomains = ["tempmail.com", "10minutemail.com"];
        const domain = email.split("@")[1];
        if (domain && suspiciousDomains.includes(domain.toLowerCase())) {
            this.addError("email", "Temporary email addresses are not allowed", "TEMP_EMAIL");
        }
    }
    
    private validatePassword(password: string): void {
        if (!password) {
            this.addError("password", "Password is required", "REQUIRED");
            return;
        }
        
        // Verificação de comprimento mínimo
        if (password.length < 8) {
            this.addError("password", "Password must be at least 8 characters long", "TOO_SHORT");
        }
        
        // Verificação de complexidade
        const hasUpperCase = /[A-Z]/.test(password);
        if (!hasUpperCase) {
            this.addError("password", "Password must contain at least one uppercase letter", "NO_UPPERCASE");
        }
        
        const hasLowerCase = /[a-z]/.test(password);
        if (!hasLowerCase) {
            this.addError("password", "Password must contain at least one lowercase letter", "NO_LOWERCASE");
        }
        
        const hasNumbers = /\d/.test(password);
        if (!hasNumbers) {
            this.addError("password", "Password must contain at least one number", "NO_NUMBERS");
        }
        
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        if (!hasSpecialChar) {
            this.addError("password", "Password must contain at least one special character", "NO_SPECIAL_CHAR");
        }
        
        // Verificação de padrões comuns fracos
        const commonPasswords = ["password", "12345678", "qwerty123"];
        if (commonPasswords.includes(password.toLowerCase())) {
            this.addError("password", "Password is too common", "COMMON_PASSWORD");
        }
    }
    
    private validatePasswordConfirmation(password: string, confirmPassword: string): void {
        if (!confirmPassword) {
            this.addError("confirmPassword", "Password confirmation is required", "REQUIRED");
            return;
        }
        
        if (password !== confirmPassword) {
            this.addError("confirmPassword", "Passwords do not match", "MISMATCH");
        }
    }
    
    private validateAge(age: number): void {
        // Verificação de tipo number
        if (typeof age !== "number" || isNaN(age)) {
            this.addError("age", "Age must be a valid number", "INVALID_TYPE");
            return;
        }
        
        // Verificação de idade mínima
        if (age < 13) {
            this.addError("age", "Minimum age is 13", "TOO_YOUNG");
            return;
        }
        
        // Verificação de idade máxima razoável
        if (age > 120) {
            this.addError("age", "Age seems unrealistic", "TOO_OLD");
            return;
        }
        
        // Verificação de idade para recursos específicos
        if (age < 18) {
            console.log("User is minor - restricted features will apply");
        }
    }
    
    private validateTerms(termsAccepted: boolean): void {
        if (typeof termsAccepted !== "boolean") {
            this.addError("termsAccepted", "Terms acceptance must be boolean", "INVALID_TYPE");
            return;
        }
        
        if (!termsAccepted) {
            this.addError("termsAccepted", "Terms and conditions must be accepted", "NOT_ACCEPTED");
        }
    }
    
    private addError(field: keyof FormData, message: string, code: string): void {
        this.errors.push({ field, message, code });
    }
}

// Uso do validador
const validator = new FormValidator();

function handleFormSubmission(formData: FormData) {
    const result = validator.validate(formData);
    
    if (result.isValid) {
        // TypeScript sabe que result.data existe aqui
        console.log("Form is valid, processing:", result.data);
        processValidForm(result.data);
    } else {
        // TypeScript sabe que result.errors existe aqui
        console.log("Form has errors:");
        result.errors.forEach(error => {
            console.log(`${error.field}: ${error.message} (${error.code})`);
        });
        displayErrors(result.errors);
    }
}

function processValidForm(data: FormData) {
    // Processamento adicional baseado em condições
    if (data.age >= 18) {
        console.log("Adult user - full access granted");
    } else {
        console.log("Minor user - parental consent required");
    }
    
    if (data.newsletter) {
        console.log("User opted in for newsletter");
    }
}

function displayErrors(errors: ValidationError[]) {
    errors.forEach(error => {
        // Display logic for each error
        console.error(`Error in ${error.field}: ${error.message}`);
    });
}

// Exemplo de uso
const sampleFormData: FormData = {
    email: "user@example.com",
    password: "SecurePassword123!",
    confirmPassword: "SecurePassword123!",
    age: 25,
    termsAccepted: true,
    newsletter: true
};

handleFormSubmission(sampleFormData);
```

## ⚠️ Limitações e Armadilhas Comuns

### 1. Type Narrowing Incompleto

```typescript
// Problema: type narrowing pode não funcionar como esperado
function problematicTypeNarrowingExample(value: string | number) {
    let result: string;
    
    if (typeof value === "string") {
        result = value; // ✓ OK - value é string aqui
    }
    // ✗ PROBLEMA: Se não há else, TypeScript não garante que result foi atribuído
    
    // return result; // Erro: Variable 'result' is used before being assigned
}

// Solução: sempre inicializar ou garantir cobertura completa
function correctedTypeNarrowingExample(value: string | number): string {
    let result: string;
    
    if (typeof value === "string") {
        result = value;
    } else {
        result = value.toString(); // Cobertura completa
    }
    
    return result; // ✓ OK
}

// Alternativa: inicialização padrão
function alternativeApproach(value: string | number): string {
    let result: string = ""; // Inicialização padrão
    
    if (typeof value === "string") {
        result = value;
    } else if (typeof value === "number") {
        result = value.toString();
    }
    
    return result;
}
```

### 2. Comparações de Igualdade Perigosas

```typescript
// Problema: == vs === pode causar comportamento inesperado
function problematicEqualityCheck(value: unknown) {
    // ✗ PERIGOSO: == faz coerção de tipo
    if (value == 0) {
        // Isso captura 0, false, "", null, undefined
        console.log("Value is falsy-like");
    }
    
    // ✗ PERIGOSO: comparação com string pode ser enganosa
    if (value == "0") {
        // Isso captura 0 (number) e "0" (string)
        console.log("Value is zero-like");
    }
}

// Solução: sempre usar === para comparações exatas
function correctedEqualityCheck(value: unknown) {
    // ✓ BOM: === não faz coerção de tipo
    if (value === 0) {
        // Apenas o número 0
        console.log("Value is exactly zero");
    }
    
    if (value === "0") {
        // Apenas a string "0"
        console.log("Value is string zero");
    }
    
    // Para verificações de falsy, seja explícito
    if (value === null || value === undefined || value === 0 || value === false || value === "") {
        console.log("Value is explicitly falsy");
    }
}
```

### 3. Mutação Durante Verificação Condicional

```typescript
// Problema: mutação pode quebrar type safety
interface MutableObject {
    type: "user" | "admin";
    permissions: string[];
}

function problematicMutation(obj: MutableObject) {
    if (obj.type === "admin") {
        // obj é considerado admin aqui
        console.log("Admin permissions:", obj.permissions);
        
        // ✗ PROBLEMA: mutação durante verificação condicional
        obj.type = "user"; // Muda o tipo após a verificação
        
        // Agora obj.type não é mais "admin", mas TypeScript ainda pensa que é
        // porque a análise de fluxo é estática
    }
}

// Solução: evitar mutação ou usar imutabilidade
interface ImmutableObject {
    readonly type: "user" | "admin";
    readonly permissions: readonly string[];
}

function safeMutationHandling(obj: ImmutableObject) {
    if (obj.type === "admin") {
        console.log("Admin permissions:", obj.permissions);
        // obj.type = "user"; // ✗ Erro de compilação - readonly property
    }
}

// Alternativa: criar novo objeto em vez de mutar
function createModifiedObject(obj: MutableObject): MutableObject {
    if (obj.type === "admin") {
        // Retornar novo objeto em vez de mutar
        return {
            type: "user",
            permissions: obj.permissions.filter(p => p !== "admin")
        };
    }
    return obj;
}
```

## 🔗 Interconexões com Outros Conceitos

### Relação com Switch Statements

If statements e switch statements são complementares para diferentes padrões de decisão:

```typescript
type StatusCode = 200 | 400 | 404 | 500;

// If statement para lógica condicional complexa
function handleWithIf(status: StatusCode, hasRetry: boolean) {
    if (status === 200) {
        console.log("Success");
    } else if (status === 400 && hasRetry) {
        console.log("Bad request, but retry available");
    } else if (status === 404) {
        console.log("Not found");
    } else {
        console.log("Server error");
    }
}

// Switch statement para pattern matching simples
function handleWithSwitch(status: StatusCode) {
    switch (status) {
        case 200:
            console.log("Success");
            break;
        case 400:
            console.log("Bad request");
            break;
        case 404:
            console.log("Not found");
            break;
        case 500:
            console.log("Server error");
            break;
    }
}
```

### Integration com Async/Await

If statements trabalham naturalmente com código assíncrono:

```typescript
async function processAsyncData(id: string) {
    if (!id) {
        throw new Error("ID is required");
    }
    
    const user = await fetchUser(id);
    
    if (!user) {
        console.log("User not found");
        return null;
    }
    
    if (user.isActive) {
        const profile = await fetchUserProfile(user.id);
        
        if (profile) {
            return { user, profile };
        }
    }
    
    return { user };
}

async function fetchUser(id: string): Promise<{ id: string; isActive: boolean } | null> {
    // Simulated async operation
    return { id, isActive: true };
}

async function fetchUserProfile(id: string): Promise<{ bio: string } | null> {
    // Simulated async operation
    return { bio: "User bio" };
}
```

## 🚀 Evolução e Tendências Futuras

### Pattern Matching Proposals

O futuro pode incluir syntax nativa para pattern matching mais expressivo:

```typescript
// Sintaxe hipotética futura para pattern matching
function handleValueFuture(value: string | number | boolean) {
    return match value {
        when string => value.toUpperCase(),
        when number if value > 0 => `Positive: ${value}`,
        when number => `Non-positive: ${value}`,
        when boolean => value ? "true" : "false"
    }
}

// Equivalente atual com if statements
function handleValueCurrent(value: string | number | boolean) {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else if (typeof value === "number") {
        if (value > 0) {
            return `Positive: ${value}`;
        } else {
            return `Non-positive: ${value}`;
        }
    } else {
        return value ? "true" : "false";
    }
}
```

### Enhanced Control Flow Analysis

Melhorias futuras na análise de fluxo de controle podem permitir verificações mais sofisticadas:

```typescript
// Possível melhoria futura - análise inter-procedural
function validateInput(input: unknown): input is string {
    return typeof input === "string" && input.length > 0;
}

function processInput(input: unknown) {
    // TypeScript futuro pode entender que após validateInput,
    // input é garantidamente string
    if (validateInput(input)) {
        // Análise mais sofisticada de type guards
        return input.toUpperCase(); // TypeScript sabe que input é string
    }
}
```

---

Este módulo estabelece uma base sólida para o uso de if statements em TypeScript, combinando controle de fluxo tradicional com as capacidades avançadas de type safety e narrowing que fazem do TypeScript uma ferramenta poderosa para desenvolvimento type-safe.