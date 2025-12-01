# Declaração com var (Escopo de Função - Evitar): Legado e Armadilhas Históricas

## 🎯 Introdução e Definição

`var` é a **palavra-chave legada de declaração de variáveis** com **escopo de função** (function-scoped), **hoisting completo**, e **permissão de redeclaração**. Embora parte histórica de JavaScript, `var` é considerado **antipadrão em código TypeScript moderno** devido a comportamentos contraIntuitivos que causam bugs sutis. Conceitualmente, entender `var` é essencial não para usá-lo, mas para **compreender código legado** e **apreciar por que `let`/`const` foram introduzidos**.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Function Scope:** Variável existe em toda função, ignorando blocos
2. **Hoisting:** Declaração içada ao topo com valor `undefined`
3. **Redeclaração Permitida:** Pode re-declarar no mesmo escopo
4. **Global Leaking:** Sem função, `var` polui escopo global

**Por Que Evitar:**
- Escopo imprevisível (blocos não contêm)
- Hoisting causa bugs de uso antes de atribuição
- Closures em loops capturam valor incorreto
- Redeclaração silenciosa sobrescreve valores

## 🧠 Fundamentos Teóricos

### Escopo de Função vs. Bloco

**Problema Fundamental:**
```typescript
function exemplo() {
  if (true) {
    var x = 10;
  }
  console.log(x);  // 10 - vaza do if!
}

// vs. let (escopo de bloco)
function exemplo() {
  if (true) {
    let y = 10;
  }
  console.log(y);  // ERRO - não existe fora do bloco
}
```

**Conceito:** `var` ignora blocos (`{}` de if, for, while); escopo é **toda função** ou global.

### Hoisting

**Comportamento:**
```typescript
console.log(x);  // undefined (não erro!)
var x = 10;
console.log(x);  // 10

// Equivalente a:
var x;  // Declaração hoisted
console.log(x);  // undefined
x = 10;
console.log(x);  // 10
```

**vs. let/const:**
```typescript
console.log(y);  // ERRO: Cannot access before initialization
let y = 10;
```

**Conceito:** `var` é içado (hoisted) com valor `undefined`; `let`/`const` têm Temporal Dead Zone.

### Problema em Loops

**Armadilha Clássica:**
```typescript
var funcoes = [];
for (var i = 0; i < 3; i++) {
  funcoes.push(function() { return i; });
}
funcoes[0]();  // 3 (esperava 0!)
funcoes[1]();  // 3
funcoes[2]();  // 3
```

**Razão:** Único `i` compartilhado; closures veem último valor.

**Solução com let:**
```typescript
for (let i = 0; i < 3; i++) {
  funcoes.push(function() { return i; });
}
funcoes[0]();  // 0
funcoes[1]();  // 1
funcoes[2]();  // 2
```

## ⚠️ Por Que Não Usar

**Problemas de `var`:**
1. **Escopo Confuso:** Blocos não delimitam escopo
2. **Hoisting Perigoso:** Uso antes de declaração retorna `undefined` silenciosamente
3. **Redeclaração:** Sobrescreve sem avisar
4. **Closures Quebradas:** Loops capturam valor errado
5. **Poluição Global:** Sem função, `var` vira propriedade de `window`/`global`

**Regra TypeScript Moderna:** **Nunca use `var`. Sempre use `let` ou `const`.**

## 🔗 Interconexões

**Relação com let/const:**
- `var`: Legado, escopo função, hoisting completo
- `let`: Moderno, escopo bloco, TDZ
- `const`: Moderno, escopo bloco, TDZ, imutável

**Migração:**
Trocar `var` por `let` (se mutável) ou `const` (se imutável).

## 📚 Conclusão

`var` é **legado que deve ser evitado**. Entender `var` é importante para manutenção de código antigo, mas **nunca use em código novo**. TypeScript moderno usa exclusivamente `let`/`const`.

**Sempre configure ESLint com `no-var: error`.**
