# Rest Parameters: Agrupar Argumentos em Array

## 🎯 Introdução e Definição

### Definição Conceitual

**Rest parameters** (parâmetros rest) usam a sintaxe `...` para **agrupar** todos os argumentos restantes de uma função em um **array**, permitindo criar funções que aceitam **número variável de argumentos** de forma limpa e moderna.

**Sintaxe:**

```javascript
// Rest parameters - ...args agrupa argumentos em array
function somar(...numeros) {
    console.log(numeros);  // Array com todos os argumentos
    return numeros.reduce((acc, n) => acc + n, 0);
}

somar(1, 2, 3);        // numeros = [1, 2, 3] → 6
somar(10, 20, 30, 40); // numeros = [10, 20, 30, 40] → 100

// Combinar parâmetros normais + rest
function apresentar(nome, idade, ...hobbies) {
    console.log(`Nome: ${nome}`);
    console.log(`Idade: ${idade}`);
    console.log(`Hobbies: ${hobbies.join(', ')}`);
}

apresentar('João', 30, 'futebol', 'programação', 'música');
// Nome: João
// Idade: 30
// Hobbies: futebol, programação, música
```

**Características:**

- **Agrupa argumentos:** Argumentos restantes → array
- **Deve ser último:** Rest parameters sempre no final
- **Array real:** Diferente de `arguments` (array-like)
- **Métodos de array:** Pode usar `.map()`, `.filter()`, etc.
- **Arrow functions:** Funciona em arrow functions (diferente de `arguments`)

### Contexto Histórico e Motivação

**Era pré-ES6:** `arguments` object (problemático)

```javascript
// ES5 - arguments object
function somar() {
    console.log(arguments);  // Array-like object (não é array!)
    
    // ❌ Não tem métodos de array
    // arguments.map(n => n * 2);  // TypeError
    
    // ✅ Precisa converter para array
    const args = Array.prototype.slice.call(arguments);
    return args.reduce(function(acc, n) {
        return acc + n;
    }, 0);
}

somar(1, 2, 3);  // 6
```

**Problemas com `arguments`:**
- **Não é array:** Array-like, sem métodos de array
- **Conversão verbosa:** `Array.prototype.slice.call(arguments)`
- **Sem arrow functions:** `arguments` não existe em arrow functions
- **Confuso:** Nome genérico, não descreve parâmetros

**ES6 (2015):** Rest parameters `...`

```javascript
// ES6 - rest parameters
function somar(...numeros) {
    console.log(numeros);  // Array REAL
    
    // ✅ Métodos de array funcionam
    return numeros.reduce((acc, n) => acc + n, 0);
}

somar(1, 2, 3);  // 6

// ✅ Funciona em arrow functions
const somar2 = (...numeros) => numeros.reduce((acc, n) => acc + n, 0);
```

**Muito mais claro!**

**Motivações principais:**

1. **Array real:** Métodos de array disponíveis
2. **Legibilidade:** Nome descritivo (`...numeros`, não `arguments`)
3. **Arrow functions:** Funciona em arrows (diferente de `arguments`)
4. **Combinar:** Parâmetros nomeados + rest
5. **Modernidade:** Padrão ES6+ para variadic functions

### Problema Fundamental que Resolve

**Problema:** Como criar funções que aceitam **número variável de argumentos** de forma limpa e com acesso a métodos de array?

**Antes - arguments verboso:**

```javascript
// ❌ arguments não é array
function calcularMedia() {
    // Precisa converter para array
    const args = Array.prototype.slice.call(arguments);
    
    const soma = args.reduce(function(acc, n) {
        return acc + n;
    }, 0);
    
    return soma / args.length;
}

calcularMedia(10, 20, 30);  // 20

// ❌ Não funciona em arrow functions
const media = () => {
    // ReferenceError: arguments is not defined
    // console.log(arguments);
};
```

**Depois - rest parameters (limpo):**

```javascript
// ✅ Rest parameters = array real
function calcularMedia(...numeros) {
    const soma = numeros.reduce((acc, n) => acc + n, 0);
    return soma / numeros.length;
}

calcularMedia(10, 20, 30);  // 20

// ✅ Funciona em arrow functions
const media = (...numeros) => {
    const soma = numeros.reduce((acc, n) => acc + n, 0);
    return soma / numeros.length;
};

media(10, 20, 30);  // 20
```

**Benefícios:**
- **Array real:** Métodos de array nativamente
- **Limpo:** Sem conversão verbosa
- **Arrow functions:** Funciona em arrows
- **Descritivo:** Nome significativo

### Importância no Ecossistema

Rest parameters são **essenciais** porque:

- **Variadic functions:** Funções com número variável de argumentos
- **Utilities:** `sum()`, `max()`, `merge()`, etc.
- **Frameworks:** React (props spreading), Node.js (event emitters)
- **Modern JavaScript:** Substitui `arguments` object
- **Functional programming:** Higher-order functions
- **APIs:** Criar APIs flexíveis

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Agrupa argumentos:** `...rest` cria array com argumentos
2. **Array real:** Não array-like como `arguments`
3. **Deve ser último:** Rest sempre no final dos parâmetros
4. **Nome descritivo:** `...numeros`, `...items`, etc.
5. **Arrow functions:** Funciona em arrows

### Pilares Fundamentais

- **Variadic functions:** Número variável de argumentos
- **Combinar parâmetros:** Nomeados + rest
- **Métodos de array:** `.map()`, `.filter()`, `.reduce()`
- **Substituir arguments:** Forma moderna
- **Flexibilidade:** APIs adaptáveis

### Visão Geral das Nuances

- **Sempre último:** Rest não pode ter parâmetros depois
- **Único rest:** Apenas um rest parameter por função
- **Array vazio:** Se nenhum argumento restante, array vazio `[]`
- **Destructuring:** Combinar com destructuring

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Rest = Agrupar em Array

```javascript
function func(...args) {
    console.log(args);  // Array
    console.log(Array.isArray(args));  // true
}

func(1, 2, 3);  // args = [1, 2, 3]

// Internamente equivalente a:
function func2() {
    const args = Array.from(arguments);
    console.log(args);
}
```

Rest parameters **agrupa** argumentos em array real.

#### Diferença de arguments

```javascript
// arguments - array-like object
function comArguments() {
    console.log(arguments);  // Arguments(3) [1, 2, 3]
    console.log(Array.isArray(arguments));  // false
    
    // ❌ Não tem métodos de array
    // arguments.map(n => n * 2);  // TypeError
}

// Rest - array real
function comRest(...args) {
    console.log(args);  // [1, 2, 3]
    console.log(Array.isArray(args));  // true
    
    // ✅ Métodos de array funcionam
    args.map(n => n * 2);  // [2, 4, 6]
}

comArguments(1, 2, 3);
comRest(1, 2, 3);
```

### Princípios Conceituais

#### Deve Ser Último Parâmetro

```javascript
// ✅ Rest no final
function func(a, b, ...resto) {
    console.log(a, b, resto);
}

func(1, 2, 3, 4, 5);  // 1 2 [3, 4, 5]

// ❌ SyntaxError - rest deve ser último
// function errado(...resto, a, b) {}
```

Rest **sempre** no final.

#### Array Vazio se Nenhum Argumento Restante

```javascript
function func(a, b, ...resto) {
    console.log(resto);
}

func(1, 2);           // []
func(1, 2, 3);        // [3]
func(1, 2, 3, 4, 5);  // [3, 4, 5]
```

---

## 🔍 Análise Conceitual Profunda

### Rest Parameters Básico

```javascript
function somar(...numeros) {
    console.log(numeros);  // Array com todos os argumentos
    return numeros.reduce((acc, n) => acc + n, 0);
}

console.log(somar(1, 2, 3));        // 6
console.log(somar(10, 20, 30, 40)); // 100
console.log(somar());               // 0 (numeros = [])
```

### Combinar Parâmetros Nomeados + Rest

```javascript
function criarUsuario(nome, email, ...permissoes) {
    return {
        nome,
        email,
        permissoes  // Array de permissões
    };
}

const user = criarUsuario('João', 'joao@email.com', 'read', 'write', 'delete');
console.log(user);
// {
//   nome: 'João',
//   email: 'joao@email.com',
//   permissoes: ['read', 'write', 'delete']
// }
```

### Método de Array com Rest

```javascript
function dobrar(...numeros) {
    return numeros.map(n => n * 2);
}

console.log(dobrar(1, 2, 3, 4, 5));  // [2, 4, 6, 8, 10]
```

### Filter com Rest

```javascript
function filtrarPares(...numeros) {
    return numeros.filter(n => n % 2 === 0);
}

console.log(filtrarPares(1, 2, 3, 4, 5, 6));  // [2, 4, 6]
```

### Arrow Function com Rest

```javascript
const max = (...numeros) => Math.max(...numeros);
const min = (...numeros) => Math.min(...numeros);

console.log(max(1, 5, 3, 9, 2));  // 9
console.log(min(1, 5, 3, 9, 2));  // 1
```

### Calcular Média

```javascript
function calcularMedia(...numeros) {
    if (numeros.length === 0) return 0;
    
    const soma = numeros.reduce((acc, n) => acc + n, 0);
    return soma / numeros.length;
}

console.log(calcularMedia(10, 20, 30));  // 20
console.log(calcularMedia(5, 10, 15, 20, 25));  // 15
```

### Logger com Timestamp

```javascript
function log(tipo, ...mensagens) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${tipo}]`, ...mensagens);
}

log('INFO', 'Aplicação iniciada');
log('ERROR', 'Falha ao conectar', 'Database offline');
// [2024-11-12T...] [INFO] Aplicação iniciada
// [2024-11-12T...] [ERROR] Falha ao conectar Database offline
```

### Primeiro Parâmetro + Rest

```javascript
function primeiroEResto(primeiro, ...resto) {
    console.log('Primeiro:', primeiro);
    console.log('Resto:', resto);
}

primeiroEResto(1, 2, 3, 4, 5);
// Primeiro: 1
// Resto: [2, 3, 4, 5]
```

### Múltiplos Parâmetros + Rest

```javascript
function criarPessoa(nome, idade, ...tags) {
    return {
        nome,
        idade,
        tags
    };
}

const pessoa = criarPessoa('João', 30, 'developer', 'gamer', 'reader');
console.log(pessoa);
// {
//   nome: 'João',
//   idade: 30,
//   tags: ['developer', 'gamer', 'reader']
// }
```

### Destructuring com Rest

```javascript
const [primeiro, segundo, ...resto] = [1, 2, 3, 4, 5];

console.log(primeiro);  // 1
console.log(segundo);   // 2
console.log(resto);     // [3, 4, 5]

// Em objects
const { a, b, ...outros } = { a: 1, b: 2, c: 3, d: 4 };
console.log(a);       // 1
console.log(b);       // 2
console.log(outros);  // { c: 3, d: 4 }
```

### Validação com Rest

```javascript
function validarNotas(notaMinima, ...notas) {
    if (notas.length === 0) {
        throw new Error('Nenhuma nota fornecida');
    }
    
    const notasValidas = notas.filter(n => n >= notaMinima);
    const notasInvalidas = notas.filter(n => n < notaMinima);
    
    return {
        validas: notasValidas,
        invalidas: notasInvalidas,
        todasValidas: notasInvalidas.length === 0
    };
}

const resultado = validarNotas(6, 7, 5, 8, 4, 9);
console.log(resultado);
// {
//   validas: [7, 8, 9],
//   invalidas: [5, 4],
//   todasValidas: false
// }
```

### Merge Arrays

```javascript
function merge(...arrays) {
    return [].concat(...arrays);
}

const merged = merge([1, 2], [3, 4], [5, 6]);
console.log(merged);  // [1, 2, 3, 4, 5, 6]

// Alternativa com flat
function merge2(...arrays) {
    return arrays.flat();
}
```

### Comparação com arguments

```javascript
// arguments object (antigo)
function somaArguments() {
    console.log(arguments);  // Arguments object
    console.log(Array.isArray(arguments));  // false
    
    // Precisa converter
    const args = Array.from(arguments);
    return args.reduce((acc, n) => acc + n, 0);
}

// Rest parameters (moderno)
function somaRest(...numeros) {
    console.log(numeros);  // Array
    console.log(Array.isArray(numeros));  // true
    
    // Já é array
    return numeros.reduce((acc, n) => acc + n, 0);
}

console.log(somaArguments(1, 2, 3));  // 6
console.log(somaRest(1, 2, 3));       // 6
```

### Rest em Arrow Functions

```javascript
// ❌ arguments não existe em arrow functions
const func1 = () => {
    // console.log(arguments);  // ReferenceError
};

// ✅ Rest funciona em arrow functions
const func2 = (...args) => {
    console.log(args);  // Array
};

func2(1, 2, 3);  // [1, 2, 3]
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Rest Parameters

**Use quando:**

1. **Variadic functions:** Número variável de argumentos
2. **Utilities:** Funções matemáticas, merge, concat
3. **Substituir arguments:** Modernizar código legado
4. **Arrow functions:** Não tem `arguments`
5. **APIs flexíveis:** Aceitar múltiplos valores

**Exemplos:**

```javascript
// 1. Variadic
function somar(...nums) { }

// 2. Utilities
function merge(...arrays) { }

// 3. Substituir arguments
// Antes: function() { arguments }
// Depois: (...args) => { args }

// 4. Arrow functions
const func = (...args) => { };

// 5. APIs flexíveis
addEventListener('click', ...handlers);
```

### Quando NÃO Usar Rest

**Evite quando:**

1. **Número fixo de argumentos:** Use parâmetros nomeados
2. **Apenas um argumento:** Desnecessário
3. **Performance crítica:** Criar array tem custo (mínimo)

```javascript
// ❌ Evite: número fixo conhecido
function somar(...nums) {  // Desnecessário se sempre 2
    return nums[0] + nums[1];
}

// ✅ Use: parâmetros nomeados
function somar(a, b) {
    return a + b;
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Deve Ser Último Parâmetro

```javascript
// ❌ SyntaxError
// function func(...rest, a) { }

// ✅ Rest no final
function func(a, ...rest) { }
```

### Apenas Um Rest Parameter

```javascript
// ❌ SyntaxError - apenas um rest
// function func(...rest1, ...rest2) { }

// ✅ Um rest apenas
function func(...rest) { }
```

### Array Vazio se Sem Argumentos

```javascript
function func(...args) {
    console.log(args);
}

func();  // [] (não undefined)
```

---

## 🔗 Interconexões Conceituais

### Relação com Spread Operator

Rest **agrupa**, spread **expande**:

```javascript
// Rest - agrupa argumentos em array
function func(...args) {
    console.log(args);  // [1, 2, 3]
}

func(1, 2, 3);

// Spread - expande array em argumentos
const arr = [1, 2, 3];
func(...arr);  // Passa 1, 2, 3 como argumentos separados
```

### Relação com arguments Object

```javascript
// arguments - array-like (antigo)
function antiga() {
    console.log(arguments);
}

// Rest - array real (moderno)
function moderna(...args) {
    console.log(args);
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Destructuring
2. Spread em Arrays
3. Spread em Objects
4. Spread em Function Calls
5. **Rest Parameters** (você está aqui)
6. **Spread vs Rest** (próximo - comparação)

### Preparação para Spread vs Rest

Mesmo operador `...`, contextos opostos:

```javascript
// Rest - agrupa
function func(...args) { }

// Spread - expande
const arr = [1, 2, 3];
func(...arr);
```

Próximo: **Spread vs Rest** - comparação detalhada.

---

## 📚 Conclusão

**Rest parameters** agrupam argumentos restantes em array real, permitindo criar funções variádicas modernas.

**Conceitos essenciais:**
- **Sintaxe:** `...args` agrupa argumentos em array
- **Array real:** Não array-like como `arguments`
- **Deve ser último:** Rest sempre no final
- **Métodos de array:** `.map()`, `.filter()`, `.reduce()`
- **Arrow functions:** Funciona em arrows (diferente de `arguments`)
- **Combinar:** Parâmetros nomeados + rest
- **Nome descritivo:** `...numeros`, `...items`
- **Array vazio:** `[]` se nenhum argumento restante
- **Substituir arguments:** Forma moderna
- **Variadic functions:** Número variável de argumentos

Dominar rest parameters é essencial para **funções flexíveis, utilities e modern JavaScript**!
