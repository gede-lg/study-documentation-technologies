# Conversão com Funções: Number(), String(), Boolean() - Transformação Real de Valores

## 🎯 Introdução e Definição

Conversões com funções (`Number()`, `String()`, `Boolean()`) são **transformações reais de valores em runtime** que convertem dados de um tipo primitivo para outro, modificando representação interna e comportamento do valor. Diferente de type assertions (`as`) que apenas mudam tipo em compile-time, conversões de função **efetivamente transformam valores** durante execução do programa.

## 📋 Sumário Conceitual

**Funções Principais:**
- `Number()`: Converte para número
- `String()`: Converte para string
- `Boolean()`: Converte para booleano
- `parseInt()`, `parseFloat()`: Parse de números
- `toString()`: Método de conversão

**Conceito Central:** Conversões são **operações runtime** que produzem novos valores.

## 🧠 Fundamentos Teóricos

### Number() - Conversão para Número

**Sintaxe:**
```typescript
const numero = Number(valor);
```

**Comportamento:**
```typescript
Number("42")      // 42
Number("3.14")    // 3.14
Number("texto")   // NaN (Not a Number)
Number(true)      // 1
Number(false)     // 0
Number(null)      // 0
Number(undefined) // NaN
Number("")        // 0
Number("  ")      // 0 (whitespace)
```

**Conceito:** `Number()` tenta parsing agressivo; retorna `NaN` se falhar.

**vs. parseInt/parseFloat:**
```typescript
Number("42px")      // NaN (parsing rígido)
parseInt("42px")    // 42 (parsing permissivo, para no primeiro não-dígito)

Number("3.14")      // 3.14
parseInt("3.14")    // 3 (ignora decimais)
parseFloat("3.14")  // 3.14 (mantém decimais)
```

### String() - Conversão para String

**Sintaxe:**
```typescript
const texto = String(valor);
```

**Comportamento:**
```typescript
String(42)        // "42"
String(true)      // "true"
String(null)      // "null"
String(undefined) // "undefined"
String([1,2,3])   // "1,2,3"
String({a: 1})    // "[object Object]"
```

**vs. toString():**
```typescript
const num = 42;
num.toString()    // "42"
String(num)       // "42"

// Diferença:
const valor = null;
// valor.toString()  // ERRO - null não tem método toString
String(valor)     // "null" - OK
```

**Conceito:** `String()` é mais seguro (funciona com null/undefined); `toString()` requer valor não-nulo.

### Boolean() - Conversão para Booleano

**Sintaxe:**
```typescript
const flag = Boolean(valor);
```

**Valores Falsy (viram false):**
```typescript
Boolean(false)     // false
Boolean(0)         // false
Boolean(-0)        // false
Boolean("")        // false (string vazia)
Boolean(null)      // false
Boolean(undefined) // false
Boolean(NaN)       // false
```

**Valores Truthy (viram true):**
```typescript
Boolean(true)      // true
Boolean(1)         // true
Boolean(-1)        // true
Boolean("texto")   // true
Boolean("0")       // true (string não-vazia, mesmo "0")
Boolean([])        // true (array vazio)
Boolean({})        // true (objeto vazio)
```

**Atalho com `!!`:**
```typescript
const flag = !!valor;  // Dupla negação força booleano
!!0         // false
!!"texto"   // true
```

## 🎯 Aplicabilidade

### Quando Usar Conversões de Função

**1. Parsing de Entrada do Usuário:**
```typescript
const idadeInput = document.querySelector<HTMLInputElement>('#idade')!;
const idade = Number(idadeInput.value);
```

**2. Normalização de Dados:**
```typescript
const config = {
  timeout: Number(process.env.TIMEOUT),
  debug: Boolean(process.env.DEBUG)
};
```

**3. Garantir Tipo Específico:**
```typescript
function processar(valor: string | number) {
  const numero = Number(valor);  // Garante number
  return numero * 2;
}
```

### Padrões de Validação

**Verificar Sucesso da Conversão:**
```typescript
const valor = Number(input);
if (isNaN(valor)) {
  throw new Error('Valor inválido');
}
```

**Parsing Seguro:**
```typescript
function parseNumeroSeguro(texto: string): number | null {
  const num = Number(texto);
  return isNaN(num) ? null : num;
}
```

## ⚠️ Armadilhas Comuns

**1. `Number()` vs. `parseInt()`:**
```typescript
Number("42px")     // NaN
parseInt("42px")   // 42 (ignora "px")
```

**2. Truthy/Falsy Surpreendentes:**
```typescript
Boolean("0")       // true (string não-vazia!)
Boolean([])        // true (array vazio!)
```

**3. `toString()` em null/undefined:**
```typescript
const valor = null;
// valor.toString()  // ERRO
String(valor)      // "null" - OK
```

## 📚 Conclusão

Conversões com funções são **transformações reais de valores** em runtime. Diferente de type assertions (compile-time), conversões de função modificam valores efetivamente.

**Use `Number()`, `String()`, `Boolean()` para conversões seguras e explícitas. Sempre valide resultado, especialmente com `Number()` (verificar `NaN`).**
