# String.raw: Raw Strings e Escape Sequences

## 🎯 Introdução e Definição

### Definição Conceitual

**`String.raw`** é uma **tag function built-in** para template literals que retorna a string **"crua"** (raw), preservando **escape sequences** (`\n`, `\t`, etc.) como caracteres literais em vez de interpretá-los.

**Sintaxe:**

```javascript
// Template literal NORMAL - escapes processados
const normal = `Line 1\nLine 2`;
console.log(normal);
// Line 1
// Line 2

// String.raw - escapes NÃO processados
const raw = String.raw`Line 1\nLine 2`;
console.log(raw);  // "Line 1\nLine 2" (backslash + n literais!)

// Windows path - problema com escapes
const path1 = 'C:\Users\nome\file.txt';  // ❌ \U, \n interpretados!
console.log(path1);  // "C:Users
//                            ome ile.txt" (quebrado!)

// String.raw - paths funcionam!
const path2 = String.raw`C:\Users\nome\file.txt`;
console.log(path2);  // "C:\Users\nome\file.txt" ✅
```

**Características:**

- **Built-in tag:** `String.raw` é função nativa
- **Escape preservation:** `\n`, `\t`, `\\`, etc. não processados
- **Windows paths:** Ideal para caminhos de arquivo
- **Regex:** Facilita criação de regex complexos
- **Template tag:** Funciona como tag function normal

### Como Funciona

```javascript
// String.raw é equivalente a:
function raw(strings, ...values) {
    // Usar .raw do array strings
    return strings.raw.reduce((acc, str, i) => 
        acc + str + (values[i] !== undefined ? values[i] : ''), ''
    );
}

const nome = 'João';
const msg1 = String.raw`Path: C:\Users\${nome}`;
const msg2 = raw`Path: C:\Users\${nome}`;

console.log(msg1 === msg2);  // true (comportamento idêntico)
```

**`strings.raw`** é propriedade do array `strings` em tag functions que contém versão "crua" das strings.

### Contexto Histórico e Motivação

**Problema histórico:** Escape sequences em strings

```javascript
// JavaScript processa escapes automaticamente
const quebrado = 'C:\Users\nome\teste\arquivo.txt';
//                    \U      \n    \t      \a
//                    ^^      ^^    ^^      ^^
//                    escapes interpretados!

console.log(quebrado);
// "C:Users
// ome    este rquivo.txt" (QUEBRADO!)

// Soluções antigas:
// 1. Escapar cada backslash (verboso)
const fix1 = 'C:\\Users\\nome\\teste\\arquivo.txt';

// 2. Forward slashes (não é Windows path real)
const fix2 = 'C:/Users/nome/teste/arquivo.txt';
```

**ES6 (2015):** `String.raw` introduzido

```javascript
// ✅ String.raw preserva backslashes
const path = String.raw`C:\Users\nome\teste\arquivo.txt`;
console.log(path);  // "C:\Users\nome\teste\arquivo.txt" (correto!)
```

**Motivações principais:**

1. **Windows paths:** Caminhos de arquivo sem duplicar `\\`
2. **Regex:** Criar regex sem escape hell
3. **Literais:** Strings exatamente como escritas
4. **Debugging:** Ver escape sequences literalmente

### Problema Fundamental que Resolve

**Problema:** Como criar strings com **backslashes literais** sem escape hell?

**Antes - escape manual:**

```javascript
// ❌ Duplicar cada backslash
const regex = new RegExp('\\d+\\.\\d+');  // Regex: \d+\.\d+
const path = 'C:\\Users\\nome\\Documents\\file.txt';

// Difícil de ler e manter!
```

**Depois - String.raw (limpo):**

```javascript
// ✅ Backslashes literais
const regex = new RegExp(String.raw`\d+\.\d+`);
const path = String.raw`C:\Users\nome\Documents\file.txt`;

// Legível e correto!
```

### Importância no Ecossistema

`String.raw` é essencial para:

- **Windows development:** Paths de arquivo
- **Regex:** Patterns complexos
- **Template engines:** Strings literais
- **Configuration:** Paths em config files
- **Latex/Math:** Formulas com backslashes

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Built-in tag:** `String.raw` é tag function nativa
2. **Escape preservation:** Escapes não processados
3. **`strings.raw`:** Acessa versão crua
4. **Literalidade:** String exatamente como escrita
5. **Interpolação funciona:** `${}` ainda processa

### Pilares Fundamentais

- **Raw = não processado:** Escapes preservados
- **Windows paths:** Principal use case
- **Regex clarity:** Patterns mais legíveis
- **Tag function:** Segue regras de tagged templates
- **Interpolação mantida:** Valores ainda inseridos

### Visão Geral das Nuances

- **Apenas escapes:** Unicode (`\u`), hex (`\x`) etc. não processados
- **Interpolação normal:** `${}` executa
- **Nested templates:** String.raw em nested
- **Manual raw tag:** Criar própria raw tag

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### `strings.raw` Property

```javascript
function myTag(strings, ...values) {
    console.log('Processado:', strings);
    // ["Line 1\nLine 2"] (quebra de linha REAL)
    
    console.log('Raw:', strings.raw);
    // ["Line 1\\nLine 2"] (backslash + n literais)
}

myTag`Line 1\nLine 2`;
```

Toda tag function recebe `strings.raw` com versão não processada.

#### String.raw Implementação

```javascript
// String.raw é aproximadamente:
String.raw = function(strings, ...values) {
    let result = '';
    
    for (let i = 0; i < strings.raw.length; i++) {
        result += strings.raw[i];  // Usar .raw!
        
        if (i < values.length) {
            result += values[i];
        }
    }
    
    return result;
};
```

### Princípios Conceituais

#### Escape Sequences Preservados

```javascript
// Escapes comuns que String.raw preserva:
const escapes = String.raw`
    \n - newline
    \t - tab
    \r - carriage return
    \\ - backslash
    \' - single quote
    \" - double quote
    \b - backspace
    \f - form feed
    \v - vertical tab
`;

console.log(escapes);
// "\n - newline\n\t - tab\n..." (literais!)
```

#### Interpolação Ainda Funciona

```javascript
const nome = 'João';
const path = String.raw`C:\Users\${nome}\Documents`;

console.log(path);  // "C:\Users\João\Documents"
//                          escapes preservados ^^
//                          interpolação funcionou ^^
```

---

## 🔍 Análise Conceitual Profunda

### Windows File Paths

```javascript
// ❌ String normal quebra
const bad = 'C:\Users\nome\Documents\file.txt';
console.log(bad);  // "C:Users
                   // ome    Documents ile.txt"

// ❌ Escape manual (verboso)
const verbose = 'C:\\Users\\nome\\Documents\\file.txt';

// ✅ String.raw (limpo)
const good = String.raw`C:\Users\nome\Documents\file.txt`;
console.log(good);  // "C:\Users\nome\Documents\file.txt"

// ✅ Com interpolação
const user = 'João';
const file = 'relatorio.pdf';
const fullPath = String.raw`C:\Users\${user}\Documents\${file}`;
console.log(fullPath);  // "C:\Users\João\Documents\relatorio.pdf"
```

### Regex Patterns

```javascript
// ❌ Regex com string normal (escape hell)
const regex1 = new RegExp('\\d+\\.\\d+');  // Difícil ler!

// ✅ String.raw (legível)
const regex2 = new RegExp(String.raw`\d+\.\d+`);

// Teste
console.log(regex2.test('123.45'));  // true
console.log(regex2.test('abc'));     // false

// Regex complexo
const urlPattern = String.raw`^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$`;
const urlRegex = new RegExp(urlPattern);

console.log(urlRegex.test('https://example.com'));  // true
```

### LaTeX/Math Formulas

```javascript
// LaTeX usa muitos backslashes
const formula = String.raw`\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}`;

console.log(formula);
// \frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
```

### SQL Queries com Escape

```javascript
// SQL LIKE pattern com %
const pattern = '%João%';
const query = String.raw`SELECT * FROM users WHERE name LIKE '${pattern}'`;

console.log(query);
// SELECT * FROM users WHERE name LIKE '%João%'

// ⚠️ CUIDADO: Ainda vulnerável a SQL injection!
// Use prepared statements em produção!
```

### Configuration Paths

```javascript
const config = {
    logPath: String.raw`C:\ProgramData\MyApp\logs\app.log`,
    dataPath: String.raw`C:\ProgramData\MyApp\data`,
    backupPath: String.raw`\\server\share\backups\${new Date().toISOString().split('T')[0]}`
};

console.log(config);
// {
//   logPath: "C:\ProgramData\MyApp\logs\app.log",
//   dataPath: "C:\ProgramData\MyApp\data",
//   backupPath: "\\server\share\backups\2024-01-15"
// }
```

### Template Engine Literals

```javascript
function template(strings, ...values) {
    // Usar .raw para preservar escapes do template
    return strings.raw.reduce((acc, str, i) => 
        acc + str + (values[i] !== undefined ? values[i] : ''), ''
    );
}

const titulo = 'Meu Site';
const html = template`
<!DOCTYPE html>
<html>
<head>
    <title>${titulo}</title>
    <script>
        // String.raw preserva \n aqui
        console.log('Line 1\nLine 2');
    </script>
</head>
</html>
`;

console.log(html);  // \n preservado no script!
```

### Comparing Normal vs Raw

```javascript
const text = 'test\nstring';

// Normal template literal
const normal = `Path: C:\test\name\string`;
console.log(normal);
// Path: C:    est
//              ame    tring (quebrado!)

// String.raw
const raw = String.raw`Path: C:\test\name\string`;
console.log(raw);
// Path: C:\test\name\string (correto!)

// Comparação
console.log(normal === raw);  // false (diferentes!)
```

### Unicode Escapes

```javascript
// Normal: unicode processado
const unicode1 = `\u0041`;  // 'A'
console.log(unicode1);  // "A"

// String.raw: unicode literal
const unicode2 = String.raw`\u0041`;
console.log(unicode2);  // "\u0041" (literal!)

// Hex escapes
const hex1 = `\x41`;  // 'A'
const hex2 = String.raw`\x41`;

console.log(hex1);  // "A"
console.log(hex2);  // "\x41"
```

### Custom Raw Tag

```javascript
// Criar própria tag "raw"
function myRaw(strings, ...values) {
    return strings.raw.reduce((acc, str, i) => {
        // Adicionar processamento customizado
        const value = values[i];
        const formatted = typeof value === 'number'
            ? value.toFixed(2)
            : value || '';
        
        return acc + str + formatted;
    }, '');
}

const price = 19.5;
const path = myRaw`C:\Users\data\price_${price}.txt`;

console.log(path);
// "C:\Users\data\price_19.50.txt"
```

### Mixed Escapes

```javascript
// String.raw + escapes manuais
const mixed = String.raw`Line 1` + '\n' + String.raw`Line 2`;

console.log(mixed);
// Line 1
// Line 2

// Dentro de String.raw, escapes preservados
const inside = String.raw`Preserved: \n` + ' | Processed: \n';
console.log(inside);
// "Preserved: \n | Processed: 
// " (quebra de linha real no segundo)
```

### Array of Paths

```javascript
const user = 'João';

const paths = [
    String.raw`C:\Users\${user}\Documents`,
    String.raw`C:\Users\${user}\Downloads`,
    String.raw`C:\Users\${user}\Pictures`,
    String.raw`C:\ProgramData\MyApp\logs`
];

paths.forEach(path => console.log(path));
// C:\Users\João\Documents
// C:\Users\João\Downloads
// C:\Users\João\Pictures
// C:\ProgramData\MyApp\logs
```

### Regex with Capture Groups

```javascript
// Regex com grupos de captura
const pattern = String.raw`^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$`;
const cpfRegex = new RegExp(pattern);

const cpf = '123.456.789-10';
const match = cpf.match(cpfRegex);

console.log(match);
// ["123.456.789-10", "123", "456", "789", "10"]
```

### Nested String.raw

```javascript
const inner = String.raw`\inner\path`;
const outer = String.raw`C:\outer\${inner}\file.txt`;

console.log(outer);
// "C:\outer\\inner\path\file.txt"
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar String.raw

**Use quando:**

1. **Windows paths:** Caminhos de arquivo
2. **Regex:** Patterns com escapes
3. **LaTeX:** Formulas matemáticas
4. **Templates:** Preservar escapes literais
5. **Config files:** Paths em configuração

**Exemplos:**

```javascript
// 1. Windows paths
const path = String.raw`C:\Users\nome\file.txt`;

// 2. Regex
const regex = new RegExp(String.raw`\d+\.\d+`);

// 3. LaTeX
const formula = String.raw`\frac{a}{b}`;

// 4. Templates
const tpl = String.raw`Line 1\nLine 2`;

// 5. Config
const logPath = String.raw`C:\ProgramData\logs`;
```

### Quando NÃO Usar String.raw

**Evite quando:**

1. **Quer processar escapes:** Use template literal normal
2. **Cross-platform paths:** Use `path.join()` (Node.js)
3. **Regex literal:** Use `/regex/` quando possível

```javascript
// ❌ String.raw quando QUER quebra de linha
const bad = String.raw`Line 1\nLine 2`;
console.log(bad);  // "Line 1\nLine 2" (literal, não quebra)

// ✅ Template literal normal
const good = `Line 1\nLine 2`;
console.log(good);
// Line 1
// Line 2

// ❌ String.raw para paths cross-platform
const bad2 = String.raw`C:\Users\nome`;  // Windows apenas!

// ✅ Use path.join (Node.js)
const path = require('path');
const good2 = path.join('C:', 'Users', 'nome');  // Funciona em qualquer OS

// ❌ String.raw para regex simples
const bad3 = new RegExp(String.raw`\d+`);

// ✅ Regex literal mais limpo
const good3 = /\d+/;
```

---

## ⚠️ Limitações e Considerações Teóricas

### Interpolação Ainda Processa

```javascript
const value = 'test\nvalue';
const result = String.raw`Path: C:\${value}\file.txt`;

console.log(result);
// "Path: C:\test
// value\file.txt"

// \n em value FOI processado (value é string normal)!
// Apenas escapes DENTRO do template são preservados
```

### Não É Escape Automático

```javascript
// String.raw NÃO escapa caracteres especiais
const userInput = '<script>alert("xss")</script>';
const bad = String.raw`<div>${userInput}</div>`;

console.log(bad);
// <div><script>alert("xss")</script></div> (VULNERÁVEL!)

// ✅ Use tag function de sanitização
function html(strings, ...values) {
    const escaped = values.map(v => 
        String(v).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    );
    
    return strings.reduce((acc, str, i) => 
        acc + str + (escaped[i] || ''), ''
    );
}

const good = html`<div>${userInput}</div>`;
// <div>&lt;script&gt;alert("xss")&lt;/script&gt;</div>
```

### Platform-Specific

```javascript
// String.raw não garante portabilidade
const windowsPath = String.raw`C:\Users\nome`;

// Em Linux/Mac, backslashes podem causar problemas
// ✅ Use bibliotecas cross-platform (Node.js path)
```

### Template Coercion

```javascript
// Valores são convertidos para string
const num = 123;
const path = String.raw`C:\data\${num}\file.txt`;

console.log(path);  // "C:\data\123\file.txt"
console.log(typeof num);  // "number" (original não mudou)
```

---

## 🔗 Interconexões Conceituais

### Relação com Tagged Templates

```javascript
// String.raw É uma tagged template!
const raw = String.raw`\n`;

// Equivalente a criar tag function:
function myRaw(strings, ...values) {
    return strings.raw.reduce((acc, str, i) => 
        acc + str + (values[i] || ''), ''
    );
}

const raw2 = myRaw`\n`;

console.log(raw === raw2);  // true
```

### Relação com Template Literals

```javascript
// Template literal normal
const normal = `Line 1\nLine 2`;

// String.raw
const raw = String.raw`Line 1\nLine 2`;

console.log(normal);  // Quebra de linha
console.log(raw);     // "\n" literal
```

### Relação com Regex

```javascript
// String.raw facilita regex
const pattern = String.raw`\d{3}\.\d{3}\.\d{3}-\d{2}`;
const regex = new RegExp(pattern);

// Equivalente a regex literal
const regex2 = /\d{3}\.\d{3}\.\d{3}-\d{2}/;

console.log(regex.source === regex2.source);  // true
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Template Literals Basics
2. Tagged Templates
3. **Raw Strings** (você está aqui)
4. **Symbols** (próximo)

### Preparação para Symbols

Symbols são **primitive type** para criar **unique identifiers**:

```javascript
// Symbol básico
const sym = Symbol('description');

// Unique
const sym1 = Symbol('test');
const sym2 = Symbol('test');
console.log(sym1 === sym2);  // false (sempre único!)

// Uso como propriedade
const obj = {
    [sym]: 'valor secreto'
};
```

Próximo: **Symbols Basics** detalhado.

---

## 📚 Conclusão

**`String.raw`** é tag function built-in que preserva **escape sequences** literalmente, essencial para **Windows paths** e **regex patterns**.

**Conceitos essenciais:**
- **Built-in tag:** `String.raw` é função nativa
- **Escape preservation:** `\n`, `\t`, etc. não processados
- **`strings.raw`:** Array com strings cruas
- **Windows paths:** Principal use case
- **Regex clarity:** Patterns legíveis
- **Interpolação funciona:** `${}` ainda processa
- **Tag function:** Segue regras de tagged templates
- **Literalidade:** String exatamente como escrita
- **Unicode/hex:** Também preservados
- **Cross-platform:** Considere `path.join()` (Node.js)
- **Not sanitization:** Não escapa HTML/SQL
- **Manual raw tag:** Pode criar própria versão customizada

Dominar `String.raw` é essencial para trabalhar com **paths**, **regex** e **strings literais** em JavaScript moderno!
