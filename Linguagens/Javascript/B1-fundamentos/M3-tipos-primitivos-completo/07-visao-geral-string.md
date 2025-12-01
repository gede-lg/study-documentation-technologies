# String: Texto em JavaScript - Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

Uma **String em JavaScript** é uma sequência ordenada e imutável de caracteres Unicode, representando texto. Diferentemente de linguagens que distinguem entre caracteres individuais e strings, JavaScript trata strings como entidades unificadas - não há tipo `char`, apenas `String`.

Na essência, uma String é uma **sequência finita de unidades de código Unicode** armazenada de forma imutável. Quando você escreve `"Olá"`, está criando um objeto primitivo String que contém três caracteres em sequência específica, imutável durante sua vida.

### Contexto Histórico e Motivação

Strings são tão antigas quanto linguagens de programação. A inovação do JavaScript foi **tratá-las como primitivos de primeira classe** com sintaxe simples. Antes de JavaScript, muitas linguagens tratavam strings como arrays de caracteres, complicando manipulação.

JavaScript simplificou: `let mensagem = "Olá";` é intuitivo. Inicialmente (1995), strings JavaScript usavam apenas UCS-2 (subset de Unicode). Isso causou problemas com caracteres fora do Basic Multilingual Plane (emojis, caracteres antigos, etc).

A motivação histórica era **simplicidade pragmática**: textos HTML, interfaces de usuário, logs - tudo precisa de strings. Torná-las simples era prioritário.

A evolução para suporte completo de Unicode (UTF-16 internally) e adição de template literals (ES6) refletem como necessidades mudaram com web moderna.

### Problema Fundamental que Resolve

Strings resolvem problemas fundamentais:

**1. Representação de Texto:** Qualquer informação textual precisa de representação. Strings são a primitiva universal para isso.

**2. Chaves Dinâmicas:** Objetos em JavaScript usam strings (ou símbolos) como chaves. Sem strings, não havia forma de acessar propriedades dinamicamente.

**3. Serialização e Comunicação:** Dados entre sistemas são frequentemente transmitidos como texto (JSON, XML, CSV). Strings são ponte de serialização.

**4. Processamento de Linguagem Natural:** Qualquer manipulação de texto (parsing, busca, transformação) começa com strings.

### Importância no Ecossistema

Strings são absolutamente fundamentais em JavaScript:

- **HTML e DOM:** Seletores, conteúdo, atributos - tudo texto
- **APIs e JSON:** Estrutura de dados padrão para web é JSON (strings)
- **Templates:** Template literals são padrão moderno para gerar HTML/SQL
- **Regular Expressions:** Regex opera em strings
- **Internacionalização:** Unicode em strings permite suportar qualquer idioma

Dominar strings é dominar um terço da linguagem.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Imutabilidade Total:** Strings não podem ser modificadas, operações retornam novas strings
2. **Indexação por Caractere:** Acesso individual via índice numérico
3. **Unicode Completo:** Suporte moderno para todos caracteres Unicode
4. **Métodos Extensos:** 40+ métodos nativos para manipulação
5. **Coerção de Tipo:** Conversão automática em contextos de concatenação

### Pilares Fundamentais

- **Sequência Imutável:** Uma vez criada, conteúdo não muda
- **Indexação Zero:** Primeiro caractere é índice 0
- **Length Property:** Propriedade `.length` indica número de caracteres
- **Método Chaining:** Múltiplas operações podem ser encadeadas
- **Unicode Points:** Internamente, caracteres são "code units" UTF-16

### Visão Geral das Nuances

- **Code Units vs Code Points:** UTF-16 usa às vezes 2 unidades para 1 ponto
- **Escape Sequences:** Caracteres especiais requerem escape
- **Template Literals:** Sintaxe moderna com interpolação e multilinha
- **String Coerção:** Conversão automática em contextos mistos
- **Métodos Mutáveis vs Imutáveis:** `.reverse()` muta arrays mas não strings

---

## 🧠 Fundamentos Teóricos

### A Natureza Textual da Comunicação Digital

Strings em JavaScript representam muito mais que simples sequências de caracteres - elas são a **manifestação digital da comunicação humana**. Cada string carrega **informação semântica, estrutural e cultural**, desde mensagens de usuário até identificadores de sistema e conteúdo dinâmico.

#### A Complexidade Oculta do Texto Digital

O que aparenta ser simples texto na superfície revela **camadas de complexidade técnica** extraordinárias. JavaScript deve navegar através de **sistemas de codificação**, **representações binárias** e **convenções culturais** para transformar bytes em significado humano legível.

### O Universo UTF-16: Onde Caracteres Encontram Computação

#### A Escolha Arquitetônica do UTF-16

JavaScript adotou **UTF-16** como sistema interno de codificação, uma decisão que reflete o **contexto histórico** da web dos anos 1990, quando UTF-16 prometia ser o **padrão universal futuro**. Esta escolha criou tanto **elegância quanto complexidade** na manipulação de texto moderno.

#### O Conceito Dual: Code Units vs Code Points

UTF-16 introduz uma **dualidade fundamental** entre **code units** (unidades de armazenamento de 16 bits) e **code points** (caracteres conceituais). Esta distinção é crucial para compreender por que `"😀".length` retorna 2 em vez de 1 - o emoji requer **dois code units** (surrogate pair) para representar **um code point**.

Esta arquitetura revela como JavaScript equilibra **compatibilidade histórica** com **suporte moderno** para o universo completo Unicode, incluindo emojis, símbolos matemáticos e caracteres de línguas menos comuns.

// Emojis (2 code units cada)
const emoji = "😀"; // 1 caractere visual = 2 code units
console.log(emoji.length); // 2 (JavaScript vê como 2 unidades!)

// Verificar código Unicode
console.log("A".charCodeAt(0)); // 65
console.log("😀".charCodeAt(0)); // 55357 (parte do surrogate pair)
```

**Implicação Prática:** `.length` de uma string com emojis pode ser diferente do número visual de caracteres. Para contar caracteres reais, precisa de técnicas especiais.

#### Imutabilidade: Por Que e Como

Strings em JavaScript são **imutáveis por design**. Uma vez criada, não pode ser alterada:

```javascript
let str = "Hello";
str[0] = "J";  // Tentativa de mutação
console.log(str); // Ainda "Hello" - tentativa falhou silenciosamente!

// Operações retornam NOVAS strings
str = str.replace("H", "J"); // Cria nova string "Jello"
```

**Por quê Imutável?**

1. **Segurança:** Se alguém passa uma string para função, tem garantia que não será modificada
2. **Performance:** Múltiplas referências para mesma string podem ser compartilhadas (string interning)
3. **Previsibilidade:** Código é mais previsível quando dados não mutam

**Consequência Conceitual:** Toda operação que modifica retorna novo string. Isso muda raciocínio: em vez de "alterar", você "transforma em novo".

```javascript
const original = "abc";
const transformado = original.toUpperCase(); // "ABC"
// original continua "abc"
```

#### Representação de Caracteres: Code Points vs Code Units

JavaScript em teoria trabalha com **code points** (caracteres lógicos), mas internamente usa **code units** (componentes de 16 bits):

```javascript
// Caractere com emoji (code point único, mas 2 code units)
const emoji = "🏠"; // Emoji de casa (U+1F3E0)

console.log(emoji.length);              // 2 (2 code units)
console.log(emoji.codePointAt(0));      // 127968 (code point correto)
console.log(emoji.charCodeAt(0));       // 55359 (primeira code unit)
console.log(emoji.charCodeAt(1));       // 56672 (segunda code unit)

// Para iterar corretamente por code points:
for (const codePoint of emoji) {
  console.log(codePoint); // Itera por code points lógicos
}
```

**Conceito Profundo:** A distinção entre code units e code points é legado de quando Unicode tinha menos de 65536 caracteres. Hoje, é detalhe de implementação, mas afeta operações como `.length` e indexação.

### Princípios e Conceitos Subjacentes

#### 1. Imutabilidade como Design Pattern

JavaScript embrace imutabilidade em strings como princípio fundamental. Isso conecta com programação funcional: transformações criam novos valores, não alteram existentes.

```javascript
// Pensamento imperativo (mutação)
let str = "hello";
str = str.toUpperCase(); // Cria novo, reatribui

// Pensamento funcional (imutabilidade)
const result = "hello".toUpperCase(); // Novo valor produzido
```

#### 2. Protocolo de String Coerção

JavaScript define regras precisas para converter valores para strings:

- **null** → `"null"`
- **undefined** → `"undefined"`
- **true/false** → `"true"` ou `"false"`
- **Numbers** → representação decimal ou exponencial
- **Objects** → resultado de `.toString()` (geralmente `"[object Object]"`)

```javascript
String(null);      // "null"
String(undefined); // "undefined"
String(true);      // "true"
String(42);        // "42"
String({});        // "[object Object]"

// Implicitamente em contexto de concatenação
null + "";         // "null"
42 + "";          // "42"
```

#### 3. Template Literals: Paradigm Shift

ES6 template literals introduzem **interpolação nativa** e **multilinha**, mudando como strings complexas são construídas:

```javascript
// Antes (concatenação)
const saudacao = "Olá, " + nome + "! Você tem " + idade + " anos.";

// Depois (template literal)
const saudacao = `Olá, ${nome}! Você tem ${idade} anos.`;
```

Isso não é apenas sintaxe - é mudança conceitual de "construir strings" para "descrever strings com interpolação".

### Relação com Outros Conceitos

#### Number e String

Conversão entre esses dois é frequentíssima:

```javascript
const num = 42;
const str = String(num);    // "42"
const volta = Number(str);  // 42

// Coerção implícita em operações
const resultado = "10" + 5; // "105" (+ é ambíguo)
const resultado2 = "10" - 5; // 5 (- força conversão)
```

#### Array e String

Strings e arrays são similares em indexação:

```javascript
const str = "hello";
console.log(str[0]);        // "h"

const arr = ['h', 'e', 'l', 'l', 'o'];
console.log(arr[0]);        // "h"

// Mas strings são imutáveis
str[0] = 'H';               // Falha silenciosamente
arr[0] = 'H';               // Sucesso
```

#### Regex e String

Expressões regulares operam em strings para busca e transformação:

```javascript
const texto = "hello world";
const resultado = texto.match(/\w+/g);
const transformado = texto.replace(/l/g, "L");
```

### Modelo Mental para Compreensão

#### "Strings são Sequências Congeladas"

Pense em string como um array imutável de caracteres:

```javascript
const str = "ABC";
// Internamente: [A, B, C] - mas congelado

str[0] = "X"; // Tentativa de mudar elemento
// Falha - é congelado
```

#### "Template Literals são Funções de Interpolação"

```javascript
const nome = "Alice";
const msg = `Olá, ${nome}!`;

// Mentalmente:
// 1. Avalia ${nome} → "Alice"
// 2. Substitui: "Olá, Alice!"
// 3. Retorna a string
```

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica: Criando Strings

#### Literais Simples

```javascript
// Aspas simples
const aspasSimples = 'Olá';

// Aspas duplas
const aspasDuplas = "Olá";

// Template literal (backtick)
const template = `Olá`;

// Tecnicamente equivalentes
console.log(aspasSimples === aspasDuplas); // true
console.log(aspasSimples === template);    // true
```

**Convenção:** Escolha um estilo (duplas é comum) e seja consistente. Ou use prettier para automático.

#### Template Literals com Interpolação

```javascript
const nome = "Alice";
const idade = 30;

const mensagem = `
  Nome: ${nome}
  Idade: ${idade}
  Próximo ano: ${idade + 1}
`;

console.log(mensagem);
// Output multilinhas preservadas!
```

**Poder Conceitual:** Template literals desmutilam strings complexas com múltiplas linhas e expressões interpoladas.

#### Tagged Template Literals

```javascript
// Função processadora de template
function highlight(strings, ...values) {
  // strings = array de partes constantes
  // values = array de valores interpolados
  let resultado = "";
  strings.forEach((str, i) => {
    resultado += str;
    if (values[i] !== undefined) {
      resultado += `<mark>${values[i]}</mark>`;
    }
  });
  return resultado;
}

const usuario = "Alice";
const resultado = highlight`Bem-vindo, ${usuario}!`;
// "Bem-vindo, <mark>Alice</mark>!"
```

**Conceito Avançado:** Tagged templates permitem processar strings e valores de forma customizada. Usado em bibliotecas de CSS-in-JS (styled-components).

### Escape Sequences: Caracteres Especiais

```javascript
// Newline e tabs
const multilinhas = "Linha 1\nLinha 2\tTabulação";

// Aspas escapadas
const comAspas = "Ele disse \"Olá!\"";
const comAspasSimples = 'Maria\'s book';

// Caracteres especiais
const unicode = "\u0041"; // Unicode escapes - "A"
const unicode2 = "\u{1F600}"; // Unicode extendido - 😀

// Backslash literal
const caminho = "C:\\Users\\Alice\\Desktop";
```

**Importante:** Em template literals, escape não é necessário para aspas:

```javascript
const msg = `Ele disse "Olá!"`;  // Aspas duplas sem escape
```

### Indexação e Length

```javascript
const str = "JavaScript";

// Acessar por índice (zero-based)
console.log(str[0]);      // "J"
console.log(str[5]);      // "S"
console.log(str[100]);    // undefined (fora do range)

// Propriedade length
console.log(str.length);  // 10

// Último caractere
console.log(str[str.length - 1]); // "t"

// Iteração
for (let i = 0; i < str.length; i++) {
  console.log(str[i]);
}

// For...of (itera por caracteres de verdade, não code units)
for (const char of str) {
  console.log(char);
}
```

**Armadilha:** Com emojis, `.length` é enganoso:

```javascript
const emoji = "👨‍👩‍👧‍👦"; // Família
console.log(emoji.length); // 25 (múltiplos code units!)

for (const char of emoji) { // Itera corretamente
  console.log(char);
}
```

### Métodos de Busca e Acesso

#### indexOf, lastIndexOf, includes

```javascript
const texto = "O JavaScript é incrível";

// Buscar primeira ocorrência
console.log(texto.indexOf("Script"));      // 4 (posição)
console.log(texto.indexOf("Python"));      // -1 (não encontrado)

// Buscar última ocorrência
console.log(texto.lastIndexOf("i"));       // 20

// Testar inclusão (booleano)
console.log(texto.includes("é"));          // true
console.log(texto.includes("python", 10)); // false (começa do índice 10)
```

#### startsWith, endsWith

```javascript
const url = "https://example.com";

console.log(url.startsWith("https"));  // true
console.log(url.startsWith("http", 0)); // false
console.log(url.endsWith(".com"));     // true
console.log(url.endsWith("example"));  // false
```

#### charAt e charCodeAt

```javascript
const str = "ABC";

// Obter caractere
console.log(str.charAt(0));        // "A"
console.log(str[0]);               // "A" (forma moderna)

// Código Unicode do caractere
console.log(str.charCodeAt(0));    // 65
console.log(String.fromCharCode(65)); // "A"
```

### Métodos de Extração e Divisão

#### slice, substring, substr

```javascript
const str = "JavaScript";

// slice (recomendado)
console.log(str.slice(0, 4));   // "Java" (end não incluído)
console.log(str.slice(4));      // "Script" (do índice ao fim)
console.log(str.slice(-6));     // "Script" (negativos contam do fim)

// substring (similar, mas índices negativos viram 0)
console.log(str.substring(0, 4)); // "Java"

// substr (deprecated - evite)
console.log(str.substr(0, 4));  // "Java"
```

#### split

```javascript
const csv = "maçã, banana, laranja";
const frutas = csv.split(","); // ["maçã", " banana", " laranja"]

// Remover espaços
const frutasLimpas = frutas.map(f => f.trim());

// Split sem argumentos
const caracteres = "ABC".split(""); // ["A", "B", "C"]

// Split com regex
const palavras = "Um-Dois-Três".split(/-/); // ["Um", "Dois", "Três"]

// Split com limite
const partes = "a-b-c-d".split("-", 2); // ["a", "b"]
```

### Métodos de Transformação

#### toUpperCase, toLowerCase

```javascript
const texto = "JavaScript";

console.log(texto.toUpperCase());    // "JAVASCRIPT"
console.log(texto.toLowerCase());    // "javascript"
```

#### trim, trimStart, trimEnd

```javascript
const sujo = "   Olá   ";

console.log(sujo.trim());       // "Olá"
console.log(sujo.trimStart());  // "Olá   "
console.log(sujo.trimEnd());    // "   Olá"
```

**Uso Comum:** Limpar input do usuário

```javascript
const inputUsuario = "  João  ";
const nomeLimpo = inputUsuario.trim();
```

#### replace, replaceAll

```javascript
const texto = "gato gato gato";

// Replace primeira ocorrência
console.log(texto.replace("gato", "cão")); // "cão gato gato"

// Replace todas (com regex global)
console.log(texto.replace(/gato/g, "cão")); // "cão cão cão"

// replaceAll (ES2021)
console.log(texto.replaceAll("gato", "cão")); // "cão cão cão"

// Com função para transformação
const resultado = "abc".replace(/b/, (match) => {
  return match.toUpperCase(); // Retorna "B"
}); // "aBc"
```

#### repeat, padStart, padEnd

```javascript
const str = "Ha";

console.log(str.repeat(3));        // "HaHaHa"

// Padding (preenchimento)
const numero = "5";
console.log(numero.padStart(3, "0")); // "005"
console.log(numero.padEnd(3, "0"));   // "500"

// Uso: formatação de números
const valor = "42";
console.log(`R$ ${valor.padStart(6)}`); // "R$     42"
```

### Métodos para Busca com Padrões

#### match

```javascript
const texto = "Tenho 25 anos e peso 80kg";

// Match global
const numeros = texto.match(/\d+/g); // ["25", "80"]

// Match primeira
const primeiro = texto.match(/\d+/); // ["25", ...]

// Match com capture groups
const idade = "Idade: 25".match(/Idade: (\d+)/);
// ["Idade: 25", "25"] (grupo capturado no índice 1)
```

#### search

```javascript
const texto = "JavaScript is awesome";

console.log(texto.search(/is/));   // 11 (índice da primeira match)
console.log(texto.search(/python/)); // -1 (não encontrado)
```

### Métodos com Localização

```javascript
const nomes = ["Alice", "Bob", "Ana"];

// Comparar strings com localização específica
console.log("b".localeCompare("a"));  // > 0 (b depois de a)
console.log("a".localeCompare("a"));  // 0 (igual)
console.log("a".localeCompare("b"));  // < 0 (a antes de b)

// Para ordenação
nomes.sort((a, b) => a.localeCompare(b));
```

### Casos Especiais

#### Strings Vazias vs Falsy

```javascript
const vazio = "";

console.log(vazio.length === 0); // true (é vazio)
console.log(Boolean(vazio));     // false (é falsy)
console.log(vazio === "");       // true (equivalente)

// Array vazio vs string vazia
console.log([].length);          // 0
console.log("".length);          // 0
console.log(Boolean([]));        // true (array é truthy!)
console.log(Boolean(""));        // false (string vazia é falsy)
```

#### Strings Muito Longas

```javascript
// Multilinhas com continuação
const longaString = `
Esta é uma string
que continua
em várias linhas
`;

// Ou concatenação
const outra = "Parte 1 " +
              "Parte 2 " +
              "Parte 3";
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Strings

Resposta: Sempre que trabalha com texto em JavaScript.

### Cenários Ideais

#### 1. Conteúdo do DOM

```javascript
// Definir innerHTML
document.getElementById("msg").innerHTML = `<h1>Bem-vindo!</h1>`;

// Seletores
const elemento = document.querySelector(".botao");

// Atributos
elemento.setAttribute("data-id", "123");
```

#### 2. Processamento de Dados Textuais

```javascript
// Processar CSV
const linhas = csvData.split("\n");
const registros = linhas.map(linha => {
  const [nome, idade] = linha.split(",").map(s => s.trim());
  return { nome, idade: parseInt(idade) };
});
```

#### 3. URLs e Caminhos

```javascript
const baseUrl = "https://api.example.com";
const endpoint = "/users";
const id = "123";

const url = `${baseUrl}${endpoint}/${id}`;
```

#### 4. Validação com Regex

```javascript
const email = "usuario@example.com";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (emailRegex.test(email)) {
  console.log("Email válido");
}
```

#### 5. Formatação de Saída

```javascript
const nome = "Alice";
const idade = 30;
const saldo = 1234.567;

const relatorio = `
Usuário: ${nome}
Idade: ${idade} anos
Saldo: R$ ${saldo.toFixed(2)}
`.trim();
```

---

## ⚠️ Limitações e Considerações

### Restrições Conceituais

#### 1. Imutabilidade Impossibilita Operações In-Place

```javascript
// ❌ Não funciona
let str = "abc";
str[0] = "X";
console.log(str); // "abc" (inalterado)

// ✅ Necessário criar novo
str = "X" + str.slice(1);
console.log(str); // "Xbc"
```

#### 2. Performance em Concatenações Repetidas

```javascript
// ❌ Ineficiente (cria muitas strings intermediárias)
let resultado = "";
for (let i = 0; i < 1000; i++) {
  resultado += i + ",";
}

// ✅ Eficiente (usa array e join)
const partes = [];
for (let i = 0; i < 1000; i++) {
  partes.push(i);
}
const resultado = partes.join(",");
```

#### 3. Emojis e Caracteres Complexos

```javascript
// Problemas com .length
const emoji = "👨‍👩‍👧‍👦";
console.log(emoji.length); // 25 (unexpected!)

// Solução: usar spread operator
console.log([...emoji].length); // 1 (correto!)
```

### Armadilhas Comuns

#### 1. Confundindo Índice Não Encontrado

```javascript
const texto = "JavaScript";
const indice = texto.indexOf("Python");

if (indice) { // ❌ Bug! 0 é falsy
  console.log("Encontrado");
}

if (indice !== -1) { // ✅ Correto
  console.log("Encontrado");
}
```

#### 2. Escape em Regex vs Strings

```javascript
// Escape diferente em strings vs regex
const caminho = "C:\\Users\\Alice"; // String: \\
const regex = /C:\\Users\\Alice/;   // Regex: \\

// Regex em string
const regexStr = new RegExp("C:\\\\Users\\\\Alice"); // 4 backslashes!
```

#### 3. Presunção sobre Encoding

```javascript
// ❌ Presume que 1 caractere = 1 index
const senha = "abc";
if (senha.length >= 8) { // Pode ser enganoso com emojis
  console.log("Seguro");
}

// ✅ Contar code points realmente
const longueurReal = [...senha].length;
```

---

## 🔗 Interconexões Conceituais

### Relação com Number

Conversão é frequente:

```javascript
const numero = 42;
const texto = String(numero);    // "42"
const voltaNumero = Number(texto); // 42
```

### Relação com Array

Métodos similares mas diferentes comportamentos:

```javascript
// Arrays podem mutar
const arr = [1, 2, 3];
arr[0] = 99;

// Strings não podem
const str = "123";
str[0] = "9"; // Falha silenciosamente
```

### Relação com Regex

Regex busca e substitui em strings:

```javascript
const email = "usuario@example.com";
const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

### Relação com JSON

JSON serializa dados como strings:

```javascript
const obj = { nome: "Alice", idade: 30 };
const json = JSON.stringify(obj); // String: '{"nome":"Alice",...}'
const volta = JSON.parse(json);   // Objeto de novo
```

---

## 🚀 Próximos Conceitos

### Desenvolvimento Natural

1. **Básicos:** Criação, indexação, length
2. **Busca:** indexOf, includes, search
3. **Extração:** slice, substring, split
4. **Transformação:** toUpperCase, replace, trim
5. **Padrões:** Regex, template literals avançados

### Conceitos que Constroem sobre Strings

#### Regular Expressions

Padrão de busca e transformação avançado:

```javascript
const texto = "João 25 anos, Maria 30 anos";
const padrão = /(\w+) (\d+)/g;
const resultado = texto.match(padrão);
```

#### Internacionalização (i18n)

```javascript
const mensagem = new Intl.DateTimeFormat('pt-BR').format(new Date());
```

#### Encoding e Decodeing

```javascript
const encoded = encodeURIComponent("Hello World");
const decoded = decodeURIComponent(encoded);
```

---

## 📚 Conclusão

Strings são estrutura fundamental e ubíqua em JavaScript. Sua simplicidade na superfície (literais simples com "") esconde profundidade: imutabilidade, Unicode, coerção, métodos extensos.

Os pontos-chave:
- **Imutáveis por design** - transformações criam novas strings
- **Métodos extensos** - 40+ métodos para manipulação
- **Unicode moderno** - suporte completo mas complexidade de UTF-16
- **Template literals** - revolução na construção de strings
- **Coerção automática** - poderosa mas exige cuidado

Dominar strings é dominar comunicação de dados em JavaScript.