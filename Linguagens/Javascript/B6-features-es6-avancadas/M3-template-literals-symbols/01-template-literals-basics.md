# Template Literals: Strings Modernas com Interpolação

## 🎯 Introdução e Definição

### Definição Conceitual

**Template literals** (ou template strings) são strings delimitadas por **backticks** (`` ` ``) que permitem **multi-line strings**, **interpolação de expressões** e **strings dinâmicas** de forma concisa e legível.

**Sintaxe:**

```javascript
// String normal (aspas simples/duplas)
const str1 = 'Hello';
const str2 = "World";

// TEMPLATE LITERAL (backticks)
const str3 = `Hello World`;

// INTERPOLAÇÃO - ${expressão}
const nome = 'João';
const idade = 30;
const mensagem = `Olá, meu nome é ${nome} e tenho ${idade} anos`;
console.log(mensagem);  // "Olá, meu nome é João e tenho 30 anos"

// MULTI-LINE - sem \n
const multiline = `
    Linha 1
    Linha 2
    Linha 3
`;

// EXPRESSÕES dentro de ${}
const a = 10;
const b = 20;
const resultado = `A soma de ${a} e ${b} é ${a + b}`;
console.log(resultado);  // "A soma de 10 e 20 é 30"
```

**Características:**

- **Backticks:** Delimitador `` ` `` em vez de `'` ou `"`
- **Interpolação:** `${expressão}` executa e insere resultado
- **Multi-line:** Quebras de linha literais (sem `\n`)
- **Expressões:** Qualquer expressão JavaScript válida
- **Conciso:** Substitui concatenação verbosa

### Contexto Histórico e Motivação

**Era pré-ES6:** Concatenação verbosa e `\n` para multi-line

```javascript
// ES5 - Concatenação
const nome = 'João';
const idade = 30;
const mensagem = 'Olá, meu nome é ' + nome + ' e tenho ' + idade + ' anos';

// ES5 - Multi-line (feio!)
const multiline = 'Linha 1\n' +
                  'Linha 2\n' +
                  'Linha 3';

// ES5 - Expressões
const a = 10;
const b = 20;
const resultado = 'A soma de ' + a + ' e ' + b + ' é ' + (a + b);
```

**Problemas:**
- **Verboso:** Muitos `+` para concatenar
- **Erro-prone:** Esquecer espaços, aspas
- **Multi-line confuso:** `\n` + concatenação
- **Menos legível:** Difícil ver estrutura final

**ES6 (2015):** Template literals com backticks

```javascript
// ES6 - Template literals
const nome = 'João';
const idade = 30;
const mensagem = `Olá, meu nome é ${nome} e tenho ${idade} anos`;

// Multi-line natural
const multiline = `
    Linha 1
    Linha 2
    Linha 3
`;

// Expressões inline
const a = 10;
const b = 20;
const resultado = `A soma de ${a} e ${b} é ${a + b}`;
```

**Muito mais limpo!**

**Motivações principais:**

1. **Legibilidade:** Ver estrutura final da string
2. **Concisão:** Menos caracteres para mesmo resultado
3. **Multi-line:** Quebras de linha literais
4. **Interpolação:** Expressões inline com `${}`
5. **DX (Developer Experience):** Código mais agradável de escrever

### Problema Fundamental que Resolve

**Problema:** Como criar **strings dinâmicas** e **multi-line** de forma **limpa e legível**?

**Antes - concatenação verbosa:**

```javascript
const produto = 'Notebook';
const preco = 2500;
const desconto = 0.1;
const precoFinal = preco - (preco * desconto);

// ❌ Concatenação verbosa e propensa a erros
const mensagem = 'Produto: ' + produto + 
                 '\nPreço original: R$ ' + preco + 
                 '\nDesconto: ' + (desconto * 100) + '%' +
                 '\nPreço final: R$ ' + precoFinal;

console.log(mensagem);
```

**Depois - template literals (limpo):**

```javascript
const produto = 'Notebook';
const preco = 2500;
const desconto = 0.1;
const precoFinal = preco - (preco * desconto);

// ✅ Template literal limpo e legível
const mensagem = `Produto: ${produto}
Preço original: R$ ${preco}
Desconto: ${desconto * 100}%
Preço final: R$ ${precoFinal}`;

console.log(mensagem);
```

**Benefícios:**
- **Legível:** Estrutura final visível
- **Conciso:** Sem `+` e `\n`
- **Menos erros:** Menos chance de esquecer espaços
- **Natural:** Multi-line como escrevemos

### Importância no Ecossistema

Template literals são **essenciais** porque:

- **Modern JavaScript:** Padrão para strings dinâmicas
- **Frameworks:** React (JSX alternativo), Vue (templates)
- **HTML generation:** Criar markup dinamicamente
- **SQL queries:** Construir queries (cuidado com SQL injection!)
- **Logging:** Mensagens de log formatadas
- **APIs:** Construir URLs, payloads JSON

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Backticks:** Delimitador `` ` `` define template literal
2. **Interpolação:** `${expressão}` executa e insere
3. **Multi-line:** Quebras de linha literais
4. **Expressões:** Qualquer JavaScript válido
5. **String coercion:** Resultado sempre string

### Pilares Fundamentais

- **Substituir concatenação:** `+` → template literals
- **Multi-line natural:** Sem `\n`
- **Expressões inline:** Cálculos, chamadas de função
- **Legibilidade:** Ver resultado final
- **Concisão:** Menos caracteres

### Visão Geral das Nuances

- **Nested templates:** Templates dentro de `${}`
- **Escaping backticks:** `` \` `` para backtick literal
- **Whitespace preservado:** Espaços e quebras mantidos
- **Tagged templates:** Funções processam templates (próximo arquivo)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Interpolação = Avaliação de Expressão

```javascript
const nome = 'João';
const idade = 30;

const msg = `Nome: ${nome}, Idade: ${idade}`;

// Internamente equivalente a:
const msg2 = 'Nome: ' + nome + ', Idade: ' + idade;

console.log(msg === msg2);  // true
```

Template literals **avaliam** expressões e **convertem** para string.

#### String Coercion

```javascript
const numero = 42;
const obj = { valor: 10 };
const arr = [1, 2, 3];

const msg = `Número: ${numero}, Object: ${obj}, Array: ${arr}`;
console.log(msg);
// "Número: 42, Object: [object Object], Array: 1,2,3"

// Conversão automática para string (toString())
```

### Princípios Conceituais

#### Expressões, Não Statements

```javascript
const a = 10;

// ✅ Expressões funcionam
`Valor: ${a}`;
`Dobro: ${a * 2}`;
`Ternário: ${a > 5 ? 'grande' : 'pequeno'}`;
`Função: ${Math.max(1, 2, 3)}`;

// ❌ Statements NÃO funcionam
// `${if (a > 5) { 'grande' }}`  // SyntaxError
// `${const x = 10;}`  // SyntaxError

// ✅ Use IIFE ou ternário
`${(() => { if (a > 5) return 'grande'; else return 'pequeno'; })()}`;
```

#### Multi-line Preserva Whitespace

```javascript
const html = `
    <div>
        <h1>Título</h1>
        <p>Parágrafo</p>
    </div>
`;

console.log(html);
// 
//     <div>
//         <h1>Título</h1>
//         <p>Parágrafo</p>
//     </div>
// 

// Espaços e quebras PRESERVADOS!
```

---

## 🔍 Análise Conceitual Profunda

### Interpolação Básica

```javascript
const nome = 'Maria';
const profissao = 'Desenvolvedora';

const apresentacao = `Olá, sou ${nome} e sou ${profissao}`;
console.log(apresentacao);  // "Olá, sou Maria e sou Desenvolvedora"
```

### Expressões em Interpolação

```javascript
const a = 10;
const b = 20;

// Operações matemáticas
const soma = `${a} + ${b} = ${a + b}`;
console.log(soma);  // "10 + 20 = 30"

// Operador ternário
const status = `O valor ${a} é ${a > 15 ? 'grande' : 'pequeno'}`;
console.log(status);  // "O valor 10 é pequeno"

// Chamadas de função
const max = `O máximo entre ${a} e ${b} é ${Math.max(a, b)}`;
console.log(max);  // "O máximo entre 10 e 20 é 20"
```

### Multi-line Strings

```javascript
const poema = `
Roses are red,
Violets are blue,
JavaScript is awesome,
And so are you!
`;

console.log(poema);
// 
// Roses are red,
// Violets are blue,
// JavaScript is awesome,
// And so are you!
// 
```

### HTML Generation

```javascript
const titulo = 'Meu Site';
const conteudo = 'Bem-vindo ao site!';

const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${titulo}</title>
</head>
<body>
    <h1>${titulo}</h1>
    <p>${conteudo}</p>
</body>
</html>
`;

console.log(html);
```

### Nested Templates

```javascript
const itens = ['Maçã', 'Banana', 'Laranja'];

const lista = `
<ul>
    ${itens.map(item => `<li>${item}</li>`).join('\n    ')}
</ul>
`;

console.log(lista);
// <ul>
//     <li>Maçã</li>
//     <li>Banana</li>
//     <li>Laranja</li>
// </ul>
```

### Concatenação de Template Literals

```javascript
const nome = 'João';
const sobrenome = 'Silva';

// Concatenar templates
const nomeCompleto = `${nome}` + ` ${sobrenome}`;
console.log(nomeCompleto);  // "João Silva"

// Ou simplesmente
const nomeCompleto2 = `${nome} ${sobrenome}`;
```

### Escaping Backticks

```javascript
// Para incluir backtick literal, use \
const codigo = `const msg = \`Hello\`;`;
console.log(codigo);  // "const msg = `Hello`;"
```

### Expressões Complexas

```javascript
const usuario = {
    nome: 'Ana',
    idade: 25,
    ativo: true
};

const info = `
Usuário: ${usuario.nome}
Idade: ${usuario.idade}
Status: ${usuario.ativo ? 'Ativo' : 'Inativo'}
Maior de idade: ${usuario.idade >= 18 ? 'Sim' : 'Não'}
`;

console.log(info);
```

### Array Methods em Templates

```javascript
const numeros = [1, 2, 3, 4, 5];

const resultado = `
Números: ${numeros.join(', ')}
Soma: ${numeros.reduce((acc, n) => acc + n, 0)}
Média: ${numeros.reduce((acc, n) => acc + n, 0) / numeros.length}
Dobrados: ${numeros.map(n => n * 2).join(', ')}
`;

console.log(resultado);
// Números: 1, 2, 3, 4, 5
// Soma: 15
// Média: 3
// Dobrados: 2, 4, 6, 8, 10
```

### Formatação de Números

```javascript
const preco = 1234.56;
const desconto = 0.15;

const mensagem = `
Preço original: R$ ${preco.toFixed(2)}
Desconto: ${(desconto * 100).toFixed(0)}%
Preço final: R$ ${(preco - preco * desconto).toFixed(2)}
`;

console.log(mensagem);
```

### Condicionais Inline

```javascript
const idade = 17;

const mensagem = `Você ${idade >= 18 ? 'pode' : 'não pode'} votar.`;
console.log(mensagem);  // "Você não pode votar."
```

### URL Construction

```javascript
const baseURL = 'https://api.exemplo.com';
const endpoint = 'users';
const id = 123;

const url = `${baseURL}/${endpoint}/${id}`;
console.log(url);  // "https://api.exemplo.com/users/123"

// Com query params
const params = { page: 1, limit: 10 };
const query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

const fullURL = `${baseURL}/${endpoint}?${query}`;
console.log(fullURL);
// "https://api.exemplo.com/users?page=1&limit=10"
```

### JSON String Generation

```javascript
const usuario = {
    nome: 'João',
    idade: 30,
    ativo: true
};

// ❌ Não use template literal para JSON completo (use JSON.stringify)
// const json = `{"nome": "${usuario.nome}", "idade": ${usuario.idade}}`;

// ✅ Use JSON.stringify
const json = JSON.stringify(usuario);

// ✅ Template literal para partes de JSON
const partial = `"nome": "${usuario.nome}"`;
```

### SQL Query (⚠️ Cuidado com SQL Injection!)

```javascript
const userId = 123;

// ⚠️ VULNERÁVEL a SQL injection!
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Use prepared statements ou bibliotecas (Sequelize, Knex)
// const query = 'SELECT * FROM users WHERE id = ?';
// db.query(query, [userId]);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Template Literals

**Use quando:**

1. **Strings dinâmicas:** Interpolação de variáveis
2. **Multi-line:** Strings com várias linhas
3. **HTML/Markup:** Gerar HTML, XML
4. **Mensagens:** Logs, erros, notificações
5. **URLs:** Construir URLs dinamicamente

**Exemplos:**

```javascript
// 1. Strings dinâmicas
const msg = `Olá, ${nome}!`;

// 2. Multi-line
const texto = `
    Linha 1
    Linha 2
`;

// 3. HTML
const html = `<div>${conteudo}</div>`;

// 4. Mensagens
console.log(`Erro: ${erro.message}`);

// 5. URLs
const url = `${base}/${path}`;
```

### Quando NÃO Usar Template Literals

**Evite quando:**

1. **String estática:** Sem interpolação
2. **Performance crítica:** Milhões de strings (mínima diferença)
3. **SQL direto:** Use prepared statements

```javascript
// ❌ Desnecessário para string estática
const msg = `Hello World`;

// ✅ Use aspas normais
const msg2 = 'Hello World';

// ❌ SQL injection risk
const query = `SELECT * FROM users WHERE name = '${name}'`;

// ✅ Use prepared statements
const query2 = 'SELECT * FROM users WHERE name = ?';
```

---

## ⚠️ Limitações e Considerações Teóricas

### Whitespace Preservado

```javascript
const html = `
    <div>
        Conteúdo
    </div>
`;

// Espaços iniciais preservados!
console.log(html);
//     <div>
//         Conteúdo
//     </div>

// Para remover, use trim()
console.log(html.trim());
// <div>
//     Conteúdo
// </div>
```

### SQL Injection Vulnerability

```javascript
const nome = "'; DROP TABLE users; --";

// ⚠️ PERIGOSO!
const query = `SELECT * FROM users WHERE name = '${nome}'`;
// SELECT * FROM users WHERE name = ''; DROP TABLE users; --'

// ✅ Use bibliotecas com prepared statements
```

### Apenas Expressões

```javascript
// ❌ Statements não funcionam
// `${const x = 10;}`  // SyntaxError
// `${if (true) { 'yes' }}`  // SyntaxError

// ✅ Use expressões
`${10}`;
`${true ? 'yes' : 'no'}`;
```

---

## 🔗 Interconexões Conceituais

### Relação com String Concatenation

```javascript
// Concatenação antiga
const msg1 = 'Olá, ' + nome + '!';

// Template literal (preferível)
const msg2 = `Olá, ${nome}!`;
```

### Relação com Tagged Templates (Próximo)

```javascript
// Template literal básico
const msg = `Valor: ${valor}`;

// Tagged template (próximo arquivo)
const msg2 = tag`Valor: ${valor}`;
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Template Literals Basics** (você está aqui)
2. **Tagged Templates** (próximo)
3. Raw Strings
4. Symbols

### Preparação para Tagged Templates

Template literals podem ser "processados" por funções:

```javascript
// Básico
const msg = `Hello ${name}`;

// Tagged (próximo)
function tag(strings, ...values) {
    // Processa template
}

const msg2 = tag`Hello ${name}`;
```

Próximo: **Tagged Template Literals** detalhado.

---

## 📚 Conclusão

**Template literals** fornecem sintaxe moderna para strings dinâmicas com interpolação e multi-line.

**Conceitos essenciais:**
- **Backticks:** Delimitador `` ` `` define template literal
- **Interpolação:** `${expressão}` executa e insere resultado
- **Multi-line:** Quebras de linha literais sem `\n`
- **Expressões:** Qualquer JavaScript válido em `${}`
- **String coercion:** Resultado sempre string
- **Nested templates:** Templates dentro de interpolação
- **Whitespace preservado:** Espaços mantidos
- **Legibilidade:** Ver estrutura final da string
- **Conciso:** Substitui concatenação verbosa
- **Modern JavaScript:** Padrão para strings dinâmicas

Dominar template literals é essencial para **código limpo, legível e modern JavaScript**!
