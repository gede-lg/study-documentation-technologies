# Módulo 14: Falsy vs Truthy Values - Avaliação Booleana em TypeScript

## 🎯 Introdução

Em TypeScript, assim como em JavaScript, **todos os valores** podem ser avaliados em **contexto booleano**. Valores **falsy** são considerados `false` quando convertidos para boolean, enquanto valores **truthy** são considerados `true`. Compreender essa distinção é crucial para escrever condições eficazes e evitar bugs sutis.

## 📋 Sumário

1. **Valores Falsy**: Lista completa e comportamento
2. **Valores Truthy**: Tudo que não é falsy
3. **Type Narrowing**: Como TypeScript usa truthy/falsy
4. **Coerção Booleana**: Conversão explícita vs implícita
5. **Armadilhas Comuns**: Casos que podem causar bugs
6. **Boas Práticas**: Verificações explícitas vs implícitas

## 🧠 Fundamentos Conceituais

### Valores Falsy Completos

```typescript
// Os 8 valores falsy em JavaScript/TypeScript:
const falsyValues = [
    false,        // boolean false
    0,            // número zero
    -0,           // zero negativo
    0n,           // BigInt zero
    "",           // string vazia
    null,         // null
    undefined,    // undefined
    NaN           // Not a Number
];

// Todos retornam false em contexto booleano
falsyValues.forEach(value => {
    console.log(`${value} is falsy:`, !value); // todos true
});

// Função para testar se um valor é falsy
function isFalsy(value: any): boolean {
    return !value;
}

// Testes
console.log(isFalsy(false));    // true
console.log(isFalsy(0));        // true
console.log(isFalsy(""));       // true
console.log(isFalsy(null));     // true
console.log(isFalsy(undefined)); // true
console.log(isFalsy(NaN));      // true
```

### Valores Truthy

```typescript
// Tudo que não é falsy é truthy
const truthyExamples = [
    true,           // boolean true
    1,              // números diferentes de 0
    -1,             // números negativos (exceto -0)
    "hello",        // strings não vazias
    " ",            // string com espaço (não vazia)
    [],             // array vazio (objeto)
    {},             // object vazio
    function() {},   // função
    new Date(),     // objeto Date
    /regex/,        // regex
    Symbol(),       // symbol
    42n             // BigInt não zero
];

// Todos são truthy
truthyExamples.forEach(value => {
    console.log(`${value} is truthy:`, Boolean(value)); // todos true
});

// Casos especiais que podem confundir
console.log(Boolean([]));          // true - array vazio é truthy!
console.log(Boolean({}));          // true - objeto vazio é truthy!
console.log(Boolean("0"));         // true - string "0" é truthy!
console.log(Boolean("false"));     // true - string "false" é truthy!
```

### Type Narrowing com Truthy/Falsy

```typescript
// TypeScript usa truthy/falsy para type narrowing
function processValue(value: string | null | undefined) {
    if (value) {
        // value é string aqui (null e undefined são falsy)
        console.log(value.toUpperCase()); // ✓ Seguro
    } else {
        // value é null ou undefined aqui
        console.log("No value provided");
    }
}

// Com números
function processNumber(num: number | null) {
    if (num) {
        // CUIDADO: num é number, mas 0 é falsy!
        console.log(num.toFixed(2)); // Funciona, mas 0 não entra aqui
    }
}

// Verificação mais explícita para números
function processNumberSafe(num: number | null) {
    if (num !== null) {
        // Agora 0 é tratado corretamente
        console.log(num.toFixed(2)); // ✓ Inclui 0
    }
}

// Arrays e objects
function processArray(arr: any[] | null) {
    if (arr) {
        // arr é any[] aqui (não null)
        console.log(`Array has ${arr.length} items`);
        // Mas cuidado: array vazio ainda entra aqui!
    }
}

function processArrayWithLength(arr: any[] | null) {
    if (arr && arr.length > 0) {
        // Agora verifica se tem elementos
        console.log(`Processing ${arr.length} items`);
    }
}
```

## 🔍 Análise Detalhada

### Coerção Booleana Explícita vs Implícita

```typescript
// Coerção implícita (em condicionais)
function implicitCoercion(value: any) {
    if (value) {
        console.log("Value is truthy");
    }
    
    // Operadores lógicos usam coerção implícita
    const result1 = value && "has value";  // falsy values retornam value, truthy retorna "has value"
    const result2 = value || "default";   // falsy values retornam "default", truthy retorna value
}

// Coerção explícita
function explicitCoercion(value: any) {
    // Usando Boolean()
    const bool1 = Boolean(value);
    
    // Usando double negation
    const bool2 = !!value;
    
    // Ambos são equivalentes
    console.log(bool1 === bool2); // sempre true
}

// Exemplos práticos
const examples = [0, "", "hello", [], null, undefined, false, true];

examples.forEach(value => {
    console.log({
        value,
        implicit: value ? "truthy" : "falsy",
        explicit: Boolean(value),
        doubleNeg: !!value
    });
});
```

### Operadores Lógicos e Short-Circuit

```typescript
// AND (&&) - retorna primeiro falsy ou último valor
function andOperator() {
    console.log(true && "hello");        // "hello"
    console.log(false && "hello");       // false
    console.log("" && "hello");          // ""
    console.log(null && "hello");        // null
    console.log("a" && "b" && "c");      // "c"
}

// OR (||) - retorna primeiro truthy ou último valor
function orOperator() {
    console.log(false || "default");     // "default"
    console.log("" || "fallback");       // "fallback"
    console.log(null || undefined);      // undefined (último)
    console.log("value" || "default");   // "value"
}

// Nullish coalescing (??) - apenas null/undefined são falsy
function nullishCoalescing() {
    console.log(0 ?? "default");         // 0 (não considera 0 como falsy)
    console.log("" ?? "default");        // "" (não considera "" como falsy)
    console.log(null ?? "default");      // "default"
    console.log(undefined ?? "default"); // "default"
}

// Uso prático para valores padrão
interface Config {
    timeout?: number;
    retries?: number;
    debug?: boolean;
    apiUrl?: string;
}

function createConnection(config: Config = {}) {
    // Cuidado com ||: 0 e false são falsy
    const timeout = config.timeout || 5000;     // 0 vira 5000!
    const debug = config.debug || false;        // OK, false || false = false
    
    // Melhor usar nullish coalescing
    const timeout2 = config.timeout ?? 5000;    // 0 permanece 0
    const retries = config.retries ?? 3;        // 0 permanece 0
    const apiUrl = config.apiUrl ?? "localhost"; // "" vira "localhost"
    
    return { timeout: timeout2, retries, debug, apiUrl };
}
```

### Verificações Comuns e Armadilhas

```typescript
// Armadilha 1: Arrays vazios são truthy
function checkArray(arr: any[]) {
    if (arr) {
        console.log("Array exists"); // Array vazio ainda entra aqui!
    }
    
    // Verificação correta para array com elementos
    if (arr && arr.length > 0) {
        console.log("Array has items");
    }
}

// Armadilha 2: String "0" é truthy, número 0 é falsy
function checkZero(value: string | number) {
    if (value) {
        console.log("Has value");
    }
    
    // "0" entra na condição, mas 0 não!
    checkZero("0");  // "Has value"
    checkZero(0);    // não imprime nada
}

// Armadilha 3: NaN é falsy mas tipo number
function checkNumber(num: number) {
    if (num) {
        console.log("Number is valid");
    }
    
    // NaN não entra na condição!
    checkNumber(NaN); // não imprime nada
    
    // Verificação explícita para NaN
    if (!isNaN(num) && num !== 0) {
        console.log("Number is valid and not zero");
    }
}

// Verificações mais seguras
function safeChecks(value: any) {
    // Para strings não vazias
    if (typeof value === "string" && value.length > 0) {
        console.log("Valid string:", value);
    }
    
    // Para números válidos (incluindo 0)
    if (typeof value === "number" && !isNaN(value)) {
        console.log("Valid number:", value);
    }
    
    // Para arrays com elementos
    if (Array.isArray(value) && value.length > 0) {
        console.log("Array with items:", value);
    }
    
    // Para objects não null
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        console.log("Valid object:", value);
    }
}
```

## 🎯 Aplicações Práticas

### Sistema de Validação

```typescript
interface UserInput {
    name?: string;
    age?: number;
    email?: string;
    preferences?: {
        newsletter?: boolean;
        theme?: string;
    };
}

class InputValidator {
    validateUser(input: UserInput): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        // Nome - verificação explícita
        if (!input.name || typeof input.name !== "string" || input.name.trim().length === 0) {
            errors.push("Name is required and must be non-empty");
        }
        
        // Idade - cuidado com 0
        if (input.age === undefined || input.age === null) {
            errors.push("Age is required");
        } else if (typeof input.age !== "number" || isNaN(input.age) || input.age < 0) {
            errors.push("Age must be a valid positive number");
        }
        // Note: idade 0 é válida!
        
        // Email - verificação de string válida
        if (input.email !== undefined) { // email é opcional
            if (typeof input.email !== "string" || !input.email.includes("@")) {
                errors.push("Email must be a valid email address");
            }
        }
        
        // Preferences - verificação de objeto
        if (input.preferences !== undefined) {
            if (typeof input.preferences !== "object" || input.preferences === null) {
                errors.push("Preferences must be an object");
            } else {
                // Newsletter pode ser false - não usar truthy check
                if (input.preferences.newsletter !== undefined && 
                    typeof input.preferences.newsletter !== "boolean") {
                    errors.push("Newsletter preference must be boolean");
                }
                
                // Theme vazio é inválido
                if (input.preferences.theme !== undefined && 
                    (!input.preferences.theme || typeof input.preferences.theme !== "string")) {
                    errors.push("Theme must be a non-empty string");
                }
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    // Método utilitário para verificar valores "vazios"
    isEmpty(value: any): boolean {
        // null ou undefined
        if (value == null) return true;
        
        // string vazia ou só espaços
        if (typeof value === "string") return value.trim().length === 0;
        
        // array vazio
        if (Array.isArray(value)) return value.length === 0;
        
        // object vazio (mas não null)
        if (typeof value === "object") return Object.keys(value).length === 0;
        
        // números: apenas NaN é considerado "vazio"
        if (typeof value === "number") return isNaN(value);
        
        // outros tipos não são "vazios"
        return false;
    }
}

// Uso do validator
const validator = new InputValidator();

const testCases: UserInput[] = [
    { name: "João", age: 25, email: "joao@email.com" },
    { name: "", age: 0, email: "invalid" }, // nome vazio, idade 0 (válida)
    { name: "Maria", age: NaN },             // idade inválida
    { preferences: { newsletter: false } },  // newsletter false é válido
];

testCases.forEach((testCase, index) => {
    const result = validator.validateUser(testCase);
    console.log(`Test ${index + 1}:`, result.valid ? "PASS" : "FAIL");
    if (!result.valid) {
        console.log("Errors:", result.errors);
    }
});
```

## ⚠️ Boas Práticas

### Diretrizes de Verificação

```typescript
// ✓ BOM: Verificações explícitas quando precisão importa
function goodPractices(value: any) {
    // Para strings: verificar tipo e comprimento
    if (typeof value === "string" && value.length > 0) {
        return value.toUpperCase();
    }
    
    // Para números: incluir 0 mas excluir NaN
    if (typeof value === "number" && !isNaN(value)) {
        return value.toFixed(2);
    }
    
    // Para arrays: verificar se é array e tem elementos
    if (Array.isArray(value) && value.length > 0) {
        return value.join(", ");
    }
    
    return null;
}

// ✗ EVITAR: Verificações truthy quando precisão importa
function badPractices(value: any) {
    if (value) { // Pode excluir 0, "", arrays vazios
        return processValue(value);
    }
    return null;
}

// ✓ BOM: Usar truthy para null/undefined checks simples
function goodTruthyUsage(user: User | null | undefined) {
    if (user) {
        // Apropriado: apenas excluir null/undefined
        return user.name;
    }
    return "Guest";
}

function processValue(value: any): string {
    return String(value);
}

interface User {
    name: string;
}
```

---

Compreender a distinção entre valores falsy e truthy é essencial para escrever condições corretas e evitar bugs sutis relacionados à coerção booleana em TypeScript.