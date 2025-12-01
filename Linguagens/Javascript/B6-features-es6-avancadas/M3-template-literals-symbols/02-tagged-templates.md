# Tagged Template Literals: Processamento Customizado de Templates

## 🎯 Introdução e Definição

### Definição Conceitual

**Tagged template literals** são templates literais precedidos por uma **função tag** que permite **processar** o template antes de retornar o resultado final. A função tag recebe as **strings estáticas** e os **valores interpolados** separadamente, permitindo customização total.

**Sintaxe:**

```javascript
// Template literal BÁSICO
const msg = `Hello ${name}`;

// TAGGED template literal
function tag(strings, ...values) {
    // strings: array de partes estáticas ["Hello ", ""]
    // values: array de valores interpolados [name]
    
    return 'resultado customizado';
}

const msg2 = tag`Hello ${name}`;
//           ^^^
//           função tag SEM parênteses!
```

**Características:**

- **Função tag:** Função que processa template
- **`strings`:** Array de partes estáticas
- **`...values`:** Rest parameter com valores interpolados
- **`strings.raw`:** Array com strings "cruas" (escape sequences não processados)
- **Customização total:** Tag decide o retorno

### Anatomia de Tagged Template

```javascript
const nome = 'João';
const idade = 30;

function tag(strings, ...values) {
    console.log('strings:', strings);  // ["Olá, ", " tem ", " anos"]
    console.log('values:', values);    // ["João", 30]
    console.log('strings.raw:', strings.raw);  // Versão "crua"
    
    // Customizar processamento
    return strings[0] + values[0] + strings[1] + values[1] + strings[2];
}

const resultado = tag`Olá, ${nome} tem ${idade} anos`;
//                ^^^
//                Tag function

console.log(resultado);  // "Olá, João tem 30 anos"
```

**Como funciona:**

1. **Parsing:** JavaScript divide template em strings estáticas e valores
2. **Chamada:** Chama `tag(strings, ...values)`
3. **Processamento:** Tag processa como quiser
4. **Retorno:** Tag retorna valor final (pode ser qualquer tipo!)

### Contexto Histórico e Motivação

**ES6 (2015):** Tagged templates introduzidos

**Motivações principais:**

1. **Customização:** Processar templates de forma personalizada
2. **Sanitização:** Limpar/escapar valores (XSS, SQL injection)
3. **Internacionalização (i18n):** Traduzir strings
4. **DSLs:** Domain-Specific Languages (styled-components, GraphQL)
5. **Debugging:** Adicionar informações extras

**Exemplos de uso real:**

- **styled-components (React):** CSS-in-JS
- **GraphQL:** Queries
- **i18n libraries:** Traduções
- **SQL builders:** Prepared statements
- **HTML sanitization:** Prevenir XSS

### Problema Fundamental que Resolve

**Problema:** Como **customizar** processamento de strings dinâmicas mantendo **legibilidade** de template literals?

**Antes - processamento manual:**

```javascript
// ❌ Concatenação + processamento manual
const nome = '<script>alert("xss")</script>';
const mensagem = 'Olá, ' + escapeHtml(nome);

function escapeHtml(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

**Depois - tagged template (limpo):**

```javascript
// ✅ Tag function faz sanitização automaticamente
const nome = '<script>alert("xss")</script>';
const mensagem = html`Olá, ${nome}`;

function html(strings, ...values) {
    const escaped = values.map(v => 
        String(v).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    );
    
    return strings.reduce((acc, str, i) => 
        acc + str + (escaped[i] || ''), ''
    );
}

console.log(mensagem);  // "Olá, &lt;script&gt;alert("xss")&lt;/script&gt;"
```

**Benefícios:**
- **Automático:** Sanitização transparente
- **Legível:** Sintaxe de template mantida
- **Reutilizável:** Tag function reutilizada
- **Seguro:** Previne injeção

### Importância no Ecossistema

Tagged templates são **críticos** em:

- **styled-components:** CSS-in-JS no React
- **GraphQL:** Queries type-safe
- **i18n:** Internacionalização
- **Template engines:** Rendering customizado
- **Security:** Sanitização automática

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Tag function:** Função que processa template
2. **`strings`:** Array de strings estáticas
3. **`values`:** Valores interpolados (rest parameter)
4. **`strings.raw`:** Strings cruas (escape não processado)
5. **Retorno customizado:** Tag decide tipo retornado

### Pilares Fundamentais

- **Separação:** Strings estáticas vs valores dinâmicos
- **Customização:** Tag processa como quiser
- **Type-safety:** TypeScript com tags
- **DSLs:** Criar linguagens específicas
- **Security:** Sanitização automática

### Visão Geral das Nuances

- **Nesting:** Tags dentro de tags
- **Composição:** Combinar tags
- **Caching:** Strings array sempre mesmo objeto
- **Raw strings:** `strings.raw` para escape sequences

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Parsing de Template

```javascript
const nome = 'João';
const idade = 30;

// Template:
tag`Olá, ${nome} tem ${idade} anos`;

// JavaScript divide em:
// strings: ["Olá, ", " tem ", " anos"]
// values: ["João", 30]

// E chama:
tag(["Olá, ", " tem ", " anos"], "João", 30);
```

#### `strings.raw` Property

```javascript
function tag(strings, ...values) {
    console.log('Processado:', strings);
    console.log('Raw:', strings.raw);
}

tag`Line 1\nLine 2`;
// Processado: ["Line 1\nLine 2"] (quebra de linha real)
// Raw: ["Line 1\\nLine 2"] (backslash + n literais)
```

### Princípios Conceituais

#### Tag Function Signature

```javascript
function tag(strings, ...values) {
    // strings: TemplateStringsArray (array-like com .raw)
    // ...values: rest parameter com valores interpolados
    
    // Retorna QUALQUER COISA (não apenas string!)
    return 'string' || 123 || { objeto: true } || [array];
}
```

#### Strings Array é Imutável e Cached

```javascript
let cachedStrings;

function tag(strings, ...values) {
    if (!cachedStrings) {
        cachedStrings = strings;
    }
    
    // Mesmo objeto SEMPRE para mesmo template
    console.log(strings === cachedStrings);  // true
}

const nome = 'João';
tag`Hello ${nome}`;  // false (primeira vez)
tag`Hello ${nome}`;  // true (cached!)
```

JavaScript **cacheia** o array `strings` para performance.

---

## 🔍 Análise Conceitual Profunda

### Tag Function Básica

```javascript
function simpleTag(strings, ...values) {
    console.log('Strings:', strings);
    console.log('Values:', values);
    
    // Reconstruir string original
    let resultado = '';
    for (let i = 0; i < strings.length; i++) {
        resultado += strings[i];
        if (i < values.length) {
            resultado += values[i];
        }
    }
    
    return resultado;
}

const nome = 'Maria';
const idade = 25;

const msg = simpleTag`Nome: ${nome}, Idade: ${idade}`;
console.log(msg);  // "Nome: Maria, Idade: 25"
```

### HTML Sanitization Tag

```javascript
function html(strings, ...values) {
    // Escapar valores para prevenir XSS
    const escaped = values.map(value => {
        const str = String(value);
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    });
    
    // Recombinar
    return strings.reduce((acc, str, i) => 
        acc + str + (escaped[i] || ''), ''
    );
}

const userInput = '<script>alert("XSS")</script>';
const safe = html`<div>User input: ${userInput}</div>`;

console.log(safe);
// <div>User input: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>
```

### Internationalization (i18n) Tag

```javascript
const translations = {
    en: {
        greeting: (name) => `Hello, ${name}!`,
        farewell: (name) => `Goodbye, ${name}!`
    },
    pt: {
        greeting: (name) => `Olá, ${name}!`,
        farewell: (name) => `Tchau, ${name}!`
    }
};

let currentLang = 'en';

function i18n(strings, ...values) {
    // strings[0] é a chave de tradução
    const key = strings[0].trim();
    const translator = translations[currentLang][key];
    
    if (!translator) {
        return `Missing translation: ${key}`;
    }
    
    return translator(...values);
}

const nome = 'João';

currentLang = 'en';
console.log(i18n`greeting${nome}`);  // "Hello, João!"

currentLang = 'pt';
console.log(i18n`greeting${nome}`);  // "Olá, João!"
```

### Currency Formatting Tag

```javascript
function currency(strings, ...values) {
    return strings.reduce((acc, str, i) => {
        const value = values[i];
        
        // Formatar números como moeda
        const formatted = typeof value === 'number'
            ? `R$ ${value.toFixed(2).replace('.', ',')}`
            : value || '';
        
        return acc + str + formatted;
    }, '');
}

const preco = 1234.56;
const desconto = 123.45;

const msg = currency`Preço: ${preco}, Desconto: ${desconto}`;
console.log(msg);  // "Preço: R$ 1234,56, Desconto: R$ 123,45"
```

### Logging Tag (with timestamp)

```javascript
function log(strings, ...values) {
    const timestamp = new Date().toISOString();
    const message = strings.reduce((acc, str, i) => 
        acc + str + (values[i] !== undefined ? values[i] : ''), ''
    );
    
    console.log(`[${timestamp}] ${message}`);
    return message;
}

const usuario = 'João';
const acao = 'login';

log`Usuário ${usuario} realizou ${acao}`;
// [2024-01-15T10:30:00.000Z] Usuário João realizou login
```

### SQL Tag (Prepared Statements)

```javascript
function sql(strings, ...values) {
    // Criar prepared statement seguro
    let query = strings[0];
    const params = [];
    
    for (let i = 0; i < values.length; i++) {
        query += '?' + strings[i + 1];  // Placeholder
        params.push(values[i]);  // Valor separado
    }
    
    return { query, params };
}

const userId = 123;
const userName = "'; DROP TABLE users; --";  // SQL injection attempt

const { query, params } = sql`
    SELECT * FROM users 
    WHERE id = ${userId} 
    AND name = ${userName}
`;

console.log(query);
// SELECT * FROM users WHERE id = ? AND name = ?

console.log(params);
// [123, "'; DROP TABLE users; --"]

// Executar com biblioteca segura:
// db.execute(query, params);  // Valores escapados automaticamente!
```

### Styled-Components Style Tag (Simplificado)

```javascript
function css(strings, ...values) {
    // Simular styled-components
    return strings.reduce((acc, str, i) => {
        const value = values[i];
        
        // Se for função, executar com props
        const resolved = typeof value === 'function'
            ? value({ theme: 'dark' })  // Simplificado
            : value || '';
        
        return acc + str + resolved;
    }, '');
}

const primaryColor = 'blue';
const fontSize = (props) => props.theme === 'dark' ? '16px' : '14px';

const styles = css`
    color: ${primaryColor};
    font-size: ${fontSize};
    background: #fff;
`;

console.log(styles);
// color: blue;
// font-size: 16px;
// background: #fff;
```

### GraphQL Tag (Simplificado)

```javascript
function gql(strings, ...values) {
    // Criar query GraphQL
    const query = strings.reduce((acc, str, i) => 
        acc + str + (values[i] || ''), ''
    );
    
    return {
        kind: 'Document',
        query: query.trim()
    };
}

const userFields = `id, name, email`;

const query = gql`
    query GetUser {
        user {
            ${userFields}
        }
    }
`;

console.log(query);
// { kind: 'Document', query: 'query GetUser { user { id, name, email } }' }
```

### Type Coercion em Tags

```javascript
function tag(strings, ...values) {
    console.log('Types:', values.map(v => typeof v));
    
    return strings.reduce((acc, str, i) => 
        acc + str + (values[i] !== undefined ? values[i] : ''), ''
    );
}

const num = 42;
const bool = true;
const obj = { value: 10 };
const arr = [1, 2, 3];

tag`Number: ${num}, Boolean: ${bool}, Object: ${obj}, Array: ${arr}`;
// Types: ['number', 'boolean', 'object', 'object']
```

### Nested Tagged Templates

```javascript
function outer(strings, ...values) {
    return `OUTER[${strings[0]}${values[0]}${strings[1]}]`;
}

function inner(strings, ...values) {
    return `INNER[${strings[0]}${values[0]}${strings[1]}]`;
}

const nome = 'João';
const resultado = outer`Start ${inner`Name: ${nome}`} End`;

console.log(resultado);
// OUTER[Start INNER[Name: João] End]
```

### Composição de Tags

```javascript
function uppercase(strings, ...values) {
    return strings.reduce((acc, str, i) => 
        acc + str + (values[i] || ''), ''
    ).toUpperCase();
}

function exclamation(strings, ...values) {
    return strings.reduce((acc, str, i) => 
        acc + str + (values[i] || ''), ''
    ) + '!!!';
}

// Compor manualmente
const nome = 'João';
const msg1 = uppercase`Hello ${nome}`;
const msg2 = exclamation`${msg1}`;

console.log(msg2);  // "HELLO JOÃO!!!"
```

### Raw Strings com `strings.raw`

```javascript
function showRaw(strings, ...values) {
    console.log('Processado:', strings);
    console.log('Raw:', strings.raw);
    
    // Usar .raw para preservar escape sequences
    return strings.raw.reduce((acc, str, i) => 
        acc + str + (values[i] || ''), ''
    );
}

const resultado = showRaw`Line 1\nLine 2\tTab`;
console.log(resultado);
// "Line 1\\nLine 2\\tTab" (escape sequences preservados!)
```

### Retornar Objeto em Vez de String

```javascript
function metadata(strings, ...values) {
    return {
        strings: strings,
        values: values,
        combined: strings.reduce((acc, str, i) => 
            acc + str + (values[i] || ''), ''
        ),
        timestamp: Date.now()
    };
}

const nome = 'João';
const meta = metadata`Hello ${nome}`;

console.log(meta);
// {
//   strings: ["Hello ", ""],
//   values: ["João"],
//   combined: "Hello João",
//   timestamp: 1705320600000
// }
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Tagged Templates

**Use quando:**

1. **Sanitização:** XSS, SQL injection
2. **DSLs:** Criar linguagens específicas
3. **i18n:** Internacionalização
4. **Formatting:** Moeda, data, número
5. **Logging:** Timestamps, níveis
6. **Type-safety:** TypeScript type checking

**Exemplos:**

```javascript
// 1. Sanitização
const safe = html`<div>${userInput}</div>`;

// 2. DSL
const styles = css`color: ${color};`;

// 3. i18n
const translated = t`greeting${name}`;

// 4. Formatting
const formatted = currency`Price: ${price}`;

// 5. Logging
log`User ${user} logged in`;

// 6. Type-safety (TypeScript)
const query = gql`query { user { id } }`;
```

### Quando NÃO Usar Tagged Templates

**Evite quando:**

1. **String simples:** Sem processamento customizado
2. **Performance crítica:** Overhead de função
3. **Over-engineering:** Template literal básico suficiente

```javascript
// ❌ Over-engineering
function identity(strings, ...values) {
    return strings.reduce((acc, str, i) => 
        acc + str + (values[i] || ''), ''
    );
}
const msg = identity`Hello ${nome}`;

// ✅ Use template literal básico
const msg2 = `Hello ${nome}`;
```

---

## ⚠️ Limitações e Considerações Teóricas

### Performance Overhead

```javascript
// Template literal: ~instantâneo
const msg1 = `Hello ${nome}`;

// Tagged template: chamada de função (overhead mínimo)
const msg2 = tag`Hello ${nome}`;
```

**Impacto:** Mínimo, mas existe. Para milhões de strings, considere.

### Strings Array é Frozen

```javascript
function tag(strings, ...values) {
    strings[0] = 'Modified';  // ❌ Não funciona (frozen)
    console.log(strings[0]);  // Valor original
}
```

### Type Coercion

```javascript
function tag(strings, ...values) {
    // values pode conter QUALQUER tipo!
    console.log(values);  // [42, true, {}, [], null, undefined]
}

tag`${42}${true}${{}}${[]}${null}${undefined}`;
```

### Security: Sanitização Deve Ser Feita Corretamente

```javascript
// ❌ Sanitização incompleta
function badHtml(strings, ...values) {
    return strings.reduce((acc, str, i) => 
        acc + str + (values[i] || '').replace(/</g, '&lt;'), ''
    );
}

// ✅ Sanitização completa
function goodHtml(strings, ...values) {
    const escaped = values.map(v => 
        String(v)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    );
    
    return strings.reduce((acc, str, i) => 
        acc + str + (escaped[i] || ''), ''
    );
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Template Literals Básicos

```javascript
// Básico (sem tag)
const msg1 = `Hello ${nome}`;

// Tagged (com tag)
const msg2 = tag`Hello ${nome}`;
```

### Relação com String.raw (Próximo)

```javascript
// String.raw é TAG BUILT-IN!
const path = String.raw`C:\Users\nome\file.txt`;
//           ^^^^^^^^^^
//           Tag function built-in
```

### Relação com DSLs (styled-components, GraphQL)

```javascript
// styled-components usa tagged templates!
const Button = styled.button`
    color: ${props => props.primary ? 'blue' : 'gray'};
`;

// GraphQL também!
const query = gql`
    query GetUser {
        user {
            id
            name
        }
    }
`;
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Template Literals Basics
2. **Tagged Templates** (você está aqui)
3. **Raw Strings** (próximo - String.raw)
4. Symbols

### Preparação para String.raw

`String.raw` é uma **tag function built-in**:

```javascript
// String.raw = tag function nativa
const path = String.raw`C:\Users\nome`;

// Equivalente a criar tag function:
function raw(strings, ...values) {
    return strings.raw.reduce((acc, str, i) => 
        acc + str + (values[i] || ''), ''
    );
}

const path2 = raw`C:\Users\nome`;
```

Próximo: **Raw Strings** com `String.raw` detalhado.

---

## 📚 Conclusão

**Tagged template literals** permitem processamento customizado de templates com **separação clara** entre strings estáticas e valores dinâmicos.

**Conceitos essenciais:**
- **Tag function:** Função que processa template
- **`strings`:** Array de partes estáticas (frozen)
- **`...values`:** Rest parameter com valores interpolados
- **`strings.raw`:** Strings cruas (escape não processado)
- **Customização total:** Tag decide retorno
- **Separação:** Strings vs valores separados
- **Security:** Sanitização automática
- **DSLs:** styled-components, GraphQL
- **i18n:** Internacionalização
- **Type-safety:** TypeScript support
- **Caching:** Strings array cacheado
- **Flexibilidade:** Retorna qualquer tipo

Dominar tagged templates é essencial para **criar DSLs, sanitização segura e abstrações poderosas** em JavaScript moderno!
