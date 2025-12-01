# Módulo 14: Operador Ternário - Expressões Condicionais Concisas

## 🎯 Introdução

O **operador ternário** (`? :`) oferece uma forma concisa de escrever expressões condicionais simples, permitindo atribuições e retornos baseados em condições de forma elegante e legível. Em TypeScript, o operador ternário mantém type safety completo e integra-se perfeitamente com o sistema de tipos.

## 📋 Sumário

1. **Sintaxe Básica**: `condição ? valorSeVerdadeiro : valorSeFalso`
2. **Type Safety**: Como TypeScript infere tipos em ternários
3. **Ternários Aninhados**: Múltiplas condições encadeadas
4. **Casos de Uso**: Aplicações práticas e idiomas comuns
5. **Performance**: Considerações de otimização
6. **Limitações**: Quando evitar ternários

## 🧠 Fundamentos Conceituais

### Sintaxe e Semântica

```typescript
// Estrutura básica
const resultado = condição ? valorVerdadeiro : valorFalso;

// Exemplo prático
function getStatusMessage(isOnline: boolean): string {
    return isOnline ? "Usuário online" : "Usuário offline";
}

// Com type inference
const idade = 25;
const categoria = idade >= 18 ? "adulto" : "menor"; // string

// Com tipos complexos
interface User { name: string; role: string; }
const user: User | null = getCurrentUser();
const displayName = user ? user.name : "Convidado";
```

### Type Safety em Ternários

```typescript
// TypeScript infere o union type corretamente
function processValue(input: string | number): string | number {
    return typeof input === "string" ? input.toUpperCase() : input * 2;
    // Tipo retornado: string | number
}

// Narrowing automático
function safeDivision(a: number, b: number): number | string {
    return b !== 0 ? a / b : "Divisão por zero";
}

// Com generics
function defaultValue<T>(value: T | null | undefined, defaultVal: T): T {
    return value != null ? value : defaultVal;
}
```

### Ternários Aninhados

```typescript
// Aninhamento controlado
function getGrade(score: number): string {
    return score >= 90 ? "A" :
           score >= 80 ? "B" :
           score >= 70 ? "C" :
           score >= 60 ? "D" : "F";
}

// Alternativa com if-else para melhor legibilidade
function getGradeReadable(score: number): string {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}
```

## 🔍 Análise Prática

### 1. Casos de Uso Comuns

```typescript
// Valores padrão
const config = {
    apiUrl: process.env.API_URL ? process.env.API_URL : "http://localhost:3000",
    timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 5000,
    debug: process.env.NODE_ENV ? process.env.NODE_ENV === "development" : false
};

// Renderização condicional (React-like)
function renderButton(isLoading: boolean, onClick: () => void) {
    return isLoading ? 
        { text: "Carregando...", disabled: true } : 
        { text: "Enviar", disabled: false, onClick };
}

// Validação e transformação
function formatCurrency(value: number | null): string {
    return value !== null ? `R$ ${value.toFixed(2)}` : "N/A";
}

// Acesso seguro a propriedades
interface ApiResponse {
    data?: { items: any[] };
    error?: string;
}

function getItemCount(response: ApiResponse): number {
    return response.data ? response.data.items.length : 0;
}
```

### 2. Sistema de Configuração

```typescript
interface AppSettings {
    theme: "light" | "dark" | "auto";
    language: string;
    notifications: boolean;
    autoSave: boolean;
}

class SettingsManager {
    private defaults: AppSettings = {
        theme: "auto",
        language: "pt-BR", 
        notifications: true,
        autoSave: true
    };
    
    loadSettings(userPrefs: Partial<AppSettings> = {}): AppSettings {
        return {
            theme: userPrefs.theme ? userPrefs.theme : this.defaults.theme,
            language: userPrefs.language ? userPrefs.language : this.defaults.language,
            notifications: userPrefs.notifications !== undefined ? userPrefs.notifications : this.defaults.notifications,
            autoSave: userPrefs.autoSave !== undefined ? userPrefs.autoSave : this.defaults.autoSave
        };
    }
    
    // Versão com nullish coalescing (mais moderna)
    loadSettingsModern(userPrefs: Partial<AppSettings> = {}): AppSettings {
        return {
            theme: userPrefs.theme ?? this.defaults.theme,
            language: userPrefs.language ?? this.defaults.language,
            notifications: userPrefs.notifications ?? this.defaults.notifications,
            autoSave: userPrefs.autoSave ?? this.defaults.autoSave
        };
    }
}
```

## ⚠️ Limitações e Boas Práticas

### Quando Evitar Ternários

```typescript
// ✗ Muito complexo - usar if-else
const badExample = isLoggedIn ? 
    (user.role === "admin" ? 
        (user.permissions.includes("write") ? 
            "full-access" : "read-only") : 
        "limited") : 
    "guest";

// ✓ Melhor legibilidade
function getAccessLevel(isLoggedIn: boolean, user?: User): string {
    if (!isLoggedIn) return "guest";
    if (user?.role === "admin") {
        return user.permissions.includes("write") ? "full-access" : "read-only";
    }
    return "limited";
}

// ✗ Side effects em ternário
const result = condition ? doSomething() : doSomethingElse(); // Evitar

// ✓ Separar side effects
if (condition) {
    doSomething();
} else {
    doSomethingElse();
}
const result = condition ? valueA : valueB;
```

## 🔗 Interconexões

### Comparação com Nullish Coalescing

```typescript
// Ternário tradicional
const value1 = input !== null && input !== undefined ? input : "default";

// Nullish coalescing (mais conciso)
const value2 = input ?? "default";

// Optional chaining + ternário
const userName = user?.profile?.name ? user.profile.name : "Anônimo";

// Optional chaining + nullish coalescing
const userName2 = user?.profile?.name ?? "Anônimo";
```

---

O operador ternário é uma ferramenta poderosa para expressões condicionais simples, mantendo o código conciso e type-safe quando usado apropriadamente.