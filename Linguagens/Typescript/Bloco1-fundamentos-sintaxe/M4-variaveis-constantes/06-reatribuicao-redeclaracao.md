# Reatribuição vs. Redeclaração: Identidade e Valor em Variáveis

## 🎯 Introdução e Definição

Reatribuição e redeclaração são **operações conceitualmente distintas** sobre variáveis: **reatribuição** muda o **valor** de binding existente; **redeclaração** tenta criar **novo binding** com mesmo identificador no mesmo escopo. Compreender essa distinção é fundamental para dominar semântica de `let`, `const` e `var` em TypeScript.

## 📋 Sumário Conceitual

**Reatribuição:** Mudar valor de variável existente
**Redeclaração:** Declarar variável com nome já usado no escopo

**Regras:**
- `let`: Reatribuição ✅, Redeclaração ❌
- `const`: Reatribuição ❌, Redeclaração ❌
- `var`: Reatribuição ✅, Redeclaração ✅ (perigoso)

## 🧠 Fundamentos Teóricos

### Reatribuição

**Conceito:** Alterar valor associado ao identificador.

**Com `let`:**
```typescript
let x = 10;
x = 20;  // Reatribuição - OK
x = 30;  // Outra reatribuição - OK
```

**Com `const`:**
```typescript
const y = 10;
y = 20;  // ERRO: Cannot assign to 'y' because it is a constant
```

**Mutação vs. Reatribuição:**
```typescript
const obj = { value: 10 };
obj.value = 20;  // Mutação - OK (modifica propriedade)
obj = { value: 30 };  // ERRO: Reatribuição proibida
```

### Redeclaração

**Conceito:** Tentar declarar variável com nome existente no mesmo escopo.

**Com `let`:**
```typescript
let x = 10;
let x = 20;  // ERRO: Cannot redeclare block-scoped variable 'x'
```

**Com `const`:**
```typescript
const y = 10;
const y = 20;  // ERRO: Cannot redeclare block-scoped variable 'y'
```

**Com `var` (Legado - Perigoso):**
```typescript
var z = 10;
var z = 20;  // OK - silenciosamente sobrescreve
console.log(z);  // 20
```

### Redeclaração em Escopos Diferentes (Shadowing)

**Conceito:** Declarar variável com mesmo nome em escopo interno **não é redeclaração** - é shadowing.

```typescript
let x = 10;  // Escopo externo

{
  let x = 20;  // Escopo interno - shadowing, OK
  console.log(x);  // 20
}

console.log(x);  // 10
```

**Função:**
```typescript
let nome = "Global";

function exemplo() {
  let nome = "Função";  // Shadowing - OK
  console.log(nome);  // "Função"
}

console.log(nome);  // "Global"
```

## 🎯 Implicações Práticas

**Reatribuição com `let`:**
Útil para valores que evoluem:
```typescript
let contador = 0;
contador = contador + 1;
contador += 1;
contador++;
```

**Imutabilidade com `const`:**
Previne bugs de modificação acidental:
```typescript
const CONFIG_URL = "https://api.com";
// CONFIG_URL = "https://outro.com";  // ERRO - protegido
```

**Perigo de Redeclaração com `var`:**
```typescript
var configuracao = loadConfig();
// ... muitas linhas depois ...
var configuracao = loadOtherConfig();  // Sobrescreve sem aviso!
```

## ⚠️ Armadilhas

**1. Confundir Mutação com Reatribuição:**
```typescript
const arr = [1, 2];
arr.push(3);  // Mutação - OK
arr = [1, 2, 3];  // Reatribuição - ERRO
```

**2. Shadowing Acidental:**
```typescript
let config = globalConfig;

function processar() {
  let config = localConfig;  // Sombra variável externa
}
```

**Solução:** Nomear variáveis distintamente.

## 📚 Conclusão

**Reatribuição** muda valor; **redeclaração** tenta criar novo binding. `let` permite reatribuição mas proíbe redeclaração; `const` proíbe ambas. Entender essa distinção evita bugs e aproveita proteções do TypeScript.

**Use `const` por padrão (imutabilidade); `let` quando reatribuição necessária; nunca `var`.**
