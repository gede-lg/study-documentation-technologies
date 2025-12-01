# Sintaxe Básica e Criação de Regex em JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Expressões Regulares (Regex)** são **padrões textuais** que descrevem **conjuntos de strings** através de uma **linguagem formal** baseada em **autômatos finitos**. Em JavaScript, representam **objetos especializados** para **pattern matching**, **validação**, **extração** e **manipulação** de texto usando **sintaxe declarativa**.

Conceitualmente, funcionam como **filtros inteligentes** que processam texto através de **regras de correspondência**, oferecendo **poder expressivo** para operações que seriam **complexas** com métodos convencionais de string.

### Problema Fundamental que Resolve

Resolve a necessidade de **pattern recognition** em texto, permitindo **validação de formatos**, **extração de dados estruturados**, **parsing simples**, **text transformation** e **search operations** com **precisão** e **eficiência** superiores aos métodos de string tradicionais.

---

## 📋 Sumário Conceitual

### Aspectos Fundamentais
1. **Literal vs Constructor:** Duas formas de criação com diferentes características
2. **RegExp Object:** Estrutura interna e propriedades do objeto
3. **Test vs Exec:** Métodos fundamentais com diferentes retornos
4. **Flags System:** Modificadores de comportamento global
5. **Escape Sequences:** Tratamento de caracteres especiais

### Características Operacionais
- **Pattern Compilation:** Regex é compilada para otimização
- **State Machine:** Execução baseada em máquina de estados
- **Immutable Patterns:** Padrão não muda após criação
- **Global State:** Flags afetam comportamento de matching

---

## 🧠 Fundamentos Teóricos

### Criação de Regex: Literal vs Constructor

#### Análise das Formas de Criação
```javascript
// Demonstração completa das formas de criação

function analisarCriacaoRegex() {
  console.log("=== Análise de Criação de Regex ===");
  
  // 1. LITERAL NOTATION - Compilação em parse time
  const literalRegex = /hello/gi;
  console.log("Literal regex:", literalRegex);
  console.log("Source:", literalRegex.source);
  console.log("Flags:", literalRegex.flags);
  
  // 2. CONSTRUCTOR - Compilação em runtime
  const constructorRegex = new RegExp('hello', 'gi');
  console.log("Constructor regex:", constructorRegex);
  console.log("Source:", constructorRegex.source);
  console.log("Flags:", constructorRegex.flags);
  
  // 3. DYNAMIC PATTERN - Vantagem do constructor
  const pattern = 'world';
  const flags = 'i';
  const dynamicRegex = new RegExp(pattern, flags);
  console.log("Dynamic regex:", dynamicRegex);
  
  // Não é possível com literal (erro de sintaxe):
  // const invalidLiteral = /pattern/flags; // ❌
  
  // 4. ESCAPING DIFFERENCES
  console.log("\n=== Escaping Differences ===");
  
  // Literal - escape simples
  const literalBackslash = /\d+/;
  console.log("Literal \\d+:", literalBackslash.source);
  
  // Constructor - double escape necessário
  const constructorBackslash = new RegExp('\\d+');
  console.log("Constructor \\\\d+:", constructorBackslash.source);
  
  // Demonstração prática
  const testString = '123 abc 456';
  
  console.log("Test string:", testString);
  console.log("Literal match:", testString.match(literalBackslash));
  console.log("Constructor match:", testString.match(constructorBackslash));
  
  // 5. PERFORMANCE COMPARISON
  console.log("\n=== Performance Analysis ===");
  
  const iterations = 100000;
  const testText = 'This is a test string with numbers 123 and letters abc';
  
  // Literal performance
  console.time('Literal creation');
  for (let i = 0; i < iterations; i++) {
    const regex = /\d+/g;
  }
  console.timeEnd('Literal creation');
  
  // Constructor performance
  console.time('Constructor creation');
  for (let i = 0; i < iterations; i++) {
    const regex = new RegExp('\\d+', 'g');
  }
  console.timeEnd('Constructor creation');
  
  // Execution performance com regex pré-criadas
  const preLiteral = /\d+/g;
  const preConstructor = new RegExp('\\d+', 'g');
  
  console.time('Literal execution');
  for (let i = 0; i < iterations; i++) {
    preLiteral.lastIndex = 0; // Reset para global flag
    preLiteral.test(testText);
  }
  console.timeEnd('Literal execution');
  
  console.time('Constructor execution');
  for (let i = 0; i < iterations; i++) {
    preConstructor.lastIndex = 0; // Reset para global flag
    preConstructor.test(testText);
  }
  console.timeEnd('Constructor execution');
}

analisarCriacaoRegex();

// Análise de casos de uso para cada forma
function analisarCasosDeUso() {
  console.log("\n=== Casos de Uso por Tipo ===");
  
  console.log("=== LITERAL REGEX - Casos Ideais ===");
  
  // 1. Padrões fixos e conhecidos
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  
  console.log("Email pattern:", emailPattern.source);
  console.log("Phone pattern:", phonePattern.source);
  console.log("CPF pattern:", cpfPattern.source);
  
  // Teste dos padrões fixos
  const testData = {
    email: "user@example.com",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-01"
  };
  
  console.log("Email valid:", emailPattern.test(testData.email));
  console.log("Phone valid:", phonePattern.test(testData.phone));
  console.log("CPF valid:", cpfPattern.test(testData.cpf));
  
  console.log("\n=== CONSTRUCTOR REGEX - Casos Ideais ===");
  
  // 1. Padrões dinâmicos baseados em input
  function createSearchPattern(searchTerm, caseSensitive = false) {
    // Escape special characters
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = caseSensitive ? 'g' : 'gi';
    return new RegExp(escaped, flags);
  }
  
  const userSearch = 'hello.world';
  const searchRegex = createSearchPattern(userSearch);
  console.log("Dynamic search pattern:", searchRegex.source);
  
  const testText = 'Hello.World says hello.world to HELLO.WORLD';
  const matches = testText.match(searchRegex);
  console.log("Search matches:", matches);
  
  // 2. Padrões configuráveis
  function createValidationPattern(config) {
    const {
      minLength = 1,
      maxLength = 50,
      allowNumbers = true,
      allowSpecial = false,
      caseSensitive = false
    } = config;
    
    let charClass = 'a-zA-Z';
    if (allowNumbers) charClass += '0-9';
    if (allowSpecial) charClass += '!@#$%^&*';
    
    const pattern = `^[${charClass}]{${minLength},${maxLength}}$`;
    const flags = caseSensitive ? '' : 'i';
    
    return new RegExp(pattern, flags);
  }
  
  const usernameValidator = createValidationPattern({
    minLength: 3,
    maxLength: 20,
    allowNumbers: true,
    allowSpecial: false
  });
  
  console.log("Username validator:", usernameValidator.source);
  console.log("Valid 'user123':", usernameValidator.test('user123'));
  console.log("Valid 'u$er':", usernameValidator.test('u$er'));
  
  // 3. Padrões baseados em arrays/conjuntos
  function createAlternationPattern(words, wholeWord = true) {
    const escaped = words.map(word => 
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    
    const pattern = wholeWord 
      ? `\\b(${escaped.join('|')})\\b`
      : `(${escaped.join('|')})`;
      
    return new RegExp(pattern, 'gi');
  }
  
  const badWords = ['spam', 'fake', 'scam'];
  const contentFilter = createAlternationPattern(badWords);
  console.log("Content filter:", contentFilter.source);
  
  const testContent = 'This is a spam message with fake content';
  console.log("Filtered content:", testContent.replace(contentFilter, '***'));
}

analisarCasosDeUso();
```

### Métodos Fundamentais: test() vs exec()

#### Análise Comparativa dos Métodos
```javascript
// Análise detalhada de test() vs exec()

function analisarMetodosRegex() {
  console.log("\n=== Análise test() vs exec() ===");
  
  const testString = 'The price is $25.99 and tax is $3.50';
  const pricePattern = /\$(\d+)\.(\d+)/g;
  
  console.log("Test string:", testString);
  console.log("Pattern:", pricePattern.source);
  
  // TEST() METHOD ANALYSIS
  console.log("\n=== test() Method ===");
  
  // Reset pattern
  pricePattern.lastIndex = 0;
  
  // test() retorna apenas boolean
  console.log("First test():", pricePattern.test(testString));
  console.log("LastIndex after first test:", pricePattern.lastIndex);
  
  console.log("Second test():", pricePattern.test(testString));
  console.log("LastIndex after second test:", pricePattern.lastIndex);
  
  console.log("Third test():", pricePattern.test(testString));
  console.log("LastIndex after third test:", pricePattern.lastIndex);
  
  // EXEC() METHOD ANALYSIS
  console.log("\n=== exec() Method ===");
  
  // Reset pattern
  const pricePattern2 = /\$(\d+)\.(\d+)/g;
  
  let match;
  let matchCount = 0;
  
  while ((match = pricePattern2.exec(testString)) !== null) {
    matchCount++;
    console.log(`Match ${matchCount}:`);
    console.log("  Full match:", match[0]);
    console.log("  Index:", match.index);
    console.log("  Input:", match.input.substring(0, 20) + "...");
    console.log("  Groups:", match.slice(1));
    console.log("  LastIndex:", pricePattern2.lastIndex);
    
    // Prevenir loop infinito com regex sem global flag
    if (matchCount > 10) break;
  }
  
  // STRING METHODS WITH REGEX
  console.log("\n=== String Methods com Regex ===");
  
  const pattern = /\$(\d+)\.(\d+)/g;
  
  // match() - similar ao exec() mas retorna array
  const matchResult = testString.match(pattern);
  console.log("match() result:", matchResult);
  
  // matchAll() - iterator com todos os matches detalhados
  const matchAllResult = [...testString.matchAll(pattern)];
  console.log("matchAll() results:");
  matchAllResult.forEach((match, index) => {
    console.log(`  Match ${index + 1}:`, {
      full: match[0],
      groups: match.slice(1),
      index: match.index
    });
  });
  
  // search() - encontra index do primeiro match
  const searchIndex = testString.search(/\$\d/);
  console.log("search() index:", searchIndex);
  
  // replace() com function callback
  const replaced = testString.replace(pattern, (match, dollars, cents, offset) => {
    const total = parseFloat(`${dollars}.${cents}`);
    return `$${(total * 1.1).toFixed(2)}`; // Add 10% markup
  });
  console.log("replace() result:", replaced);
}

analisarMetodosRegex();

// Performance comparison entre métodos
function compararPerformanceMetodos() {
  console.log("\n=== Performance Comparison ===");
  
  const longText = 'Price $10.50, cost $20.75, fee $5.25, '.repeat(1000);
  const pattern = /\$\d+\.\d+/g;
  const iterations = 1000;
  
  // test() performance (apenas verificação)
  console.time('test() performance');
  for (let i = 0; i < iterations; i++) {
    const regex = new RegExp(pattern);
    regex.test(longText);
  }
  console.timeEnd('test() performance');
  
  // exec() performance (com extração completa)
  console.time('exec() performance');
  for (let i = 0; i < iterations; i++) {
    const regex = new RegExp(pattern);
    let match;
    while ((match = regex.exec(longText)) !== null) {
      // Process match
    }
  }
  console.timeEnd('exec() performance');
  
  // match() performance
  console.time('match() performance');
  for (let i = 0; i < iterations; i++) {
    longText.match(new RegExp(pattern));
  }
  console.timeEnd('match() performance');
  
  // matchAll() performance
  console.time('matchAll() performance');
  for (let i = 0; i < iterations; i++) {
    [...longText.matchAll(new RegExp(pattern))];
  }
  console.timeEnd('matchAll() performance');
}

compararPerformanceMetodos();
```

### Estrutura Interna do RegExp Object

#### Propriedades e Estado Interno
```javascript
// Análise da estrutura interna do RegExp

function analisarEstruturaRegExp() {
  console.log("\n=== Estrutura Interna RegExp ===");
  
  const regex = /hello\s+(world)/gim;
  
  // PROPRIEDADES BÁSICAS
  console.log("=== Propriedades Básicas ===");
  console.log("source:", regex.source);
  console.log("flags:", regex.flags);
  console.log("global:", regex.global);
  console.log("ignoreCase:", regex.ignoreCase);
  console.log("multiline:", regex.multiline);
  console.log("sticky:", regex.sticky);
  console.log("unicode:", regex.unicode);
  console.log("dotAll:", regex.dotAll);
  
  // ESTADO MUTÁVEL
  console.log("\n=== Estado Mutável ===");
  console.log("Initial lastIndex:", regex.lastIndex);
  
  const testString = 'Hello World and hello world again';
  
  // Executar regex e observar mudanças de estado
  let match = regex.exec(testString);
  console.log("After first exec:");
  console.log("  Match:", match && match[0]);
  console.log("  LastIndex:", regex.lastIndex);
  
  match = regex.exec(testString);
  console.log("After second exec:");
  console.log("  Match:", match && match[0]);
  console.log("  LastIndex:", regex.lastIndex);
  
  // Reset manual do estado
  regex.lastIndex = 0;
  console.log("After reset - LastIndex:", regex.lastIndex);
  
  // CLONING E IMMUTABILITY
  console.log("\n=== Cloning e Immutability ===");
  
  const originalRegex = /test/gi;
  
  // Criar cópia com new RegExp
  const clonedRegex = new RegExp(originalRegex.source, originalRegex.flags);
  console.log("Original:", originalRegex);
  console.log("Cloned:", clonedRegex);
  console.log("Are equal:", originalRegex.toString() === clonedRegex.toString());
  console.log("Are same object:", originalRegex === clonedRegex);
  
  // Estado independente
  originalRegex.lastIndex = 5;
  console.log("Original lastIndex:", originalRegex.lastIndex);
  console.log("Cloned lastIndex:", clonedRegex.lastIndex);
  
  // REGEX COMPILATION
  console.log("\n=== Regex Compilation ===");
  
  function measureCompilation() {
    const pattern = '\\b\\w{5,10}\\b';
    const flags = 'gi';
    const iterations = 10000;
    
    // Literal compilation (parse-time)
    console.time('Literal compilation');
    for (let i = 0; i < iterations; i++) {
      const regex = /\b\w{5,10}\b/gi;
    }
    console.timeEnd('Literal compilation');
    
    // Constructor compilation (runtime)
    console.time('Constructor compilation');
    for (let i = 0; i < iterations; i++) {
      const regex = new RegExp(pattern, flags);
    }
    console.timeEnd('Constructor compilation');
    
    // Pre-compiled reuse
    const preCompiled = new RegExp(pattern, flags);
    console.time('Pre-compiled reuse');
    for (let i = 0; i < iterations; i++) {
      preCompiled.lastIndex = 0;
      preCompiled.test('this is a sample text');
    }
    console.timeEnd('Pre-compiled reuse');
  }
  
  measureCompilation();
}

analisarEstruturaRegExp();

// Advanced RegExp analysis
function analisarRecursosAvancados() {
  console.log("\n=== Recursos Avançados RegExp ===");
  
  // REGEX VALIDATION
  console.log("=== Regex Validation ===");
  
  function isValidRegex(pattern, flags = '') {
    try {
      new RegExp(pattern, flags);
      return true;
    } catch (error) {
      console.log("Invalid regex:", error.message);
      return false;
    }
  }
  
  console.log("Valid pattern '[a-z]+':", isValidRegex('[a-z]+'));
  console.log("Invalid pattern '[a-z':", isValidRegex('[a-z'));
  console.log("Invalid flag 'x':", isValidRegex('test', 'x'));
  
  // REGEX INSPECTION
  console.log("\n=== Regex Inspection ===");
  
  function inspectRegex(regex) {
    return {
      source: regex.source,
      flags: {
        global: regex.global,
        ignoreCase: regex.ignoreCase,
        multiline: regex.multiline,
        sticky: regex.sticky,
        unicode: regex.unicode,
        dotAll: regex.dotAll
      },
      state: {
        lastIndex: regex.lastIndex
      },
      complexity: estimateComplexity(regex.source)
    };
  }
  
  function estimateComplexity(pattern) {
    let score = 0;
    score += (pattern.match(/[+*?{]/g) || []).length; // Quantifiers
    score += (pattern.match(/[()]/g) || []).length / 2; // Groups
    score += (pattern.match(/[[\]]/g) || []).length / 2; // Character classes
    score += (pattern.match(/\\./g) || []).length; // Escapes
    return score;
  }
  
  const complexRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  console.log("Complex regex analysis:", inspectRegex(complexRegex));
  
  // DEBUGGING UTILITIES
  console.log("\n=== Debugging Utilities ===");
  
  function debugRegexMatch(regex, text) {
    console.log(`Testing: ${regex} against "${text}"`);
    
    const result = {
      test: regex.test(text),
      matches: [],
      performance: null
    };
    
    // Reset for exec
    regex.lastIndex = 0;
    
    const startTime = performance.now();
    let match;
    while ((match = regex.exec(text)) !== null) {
      result.matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1),
        lastIndex: regex.lastIndex
      });
      
      if (!regex.global) break;
    }
    const endTime = performance.now();
    
    result.performance = `${(endTime - startTime).toFixed(4)}ms`;
    
    return result;
  }
  
  const emailRegex = /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emailText = 'Contact john@example.com or mary@test.org';
  
  console.log("Debug result:", debugRegexMatch(emailRegex, emailText));
}

analisarRecursosAvancados();
```

---

## 🎯 Aplicabilidade e Contextos

### Casos de Uso Fundamentais

```javascript
// Casos de uso essenciais para regex básica

class RegexBasicUseCases {
  // 1. Input Validation
  static createValidators() {
    return {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[\d\s\-\(\)]{10,}$/,
      url: /^https?:\/\/.+/,
      number: /^-?\d*\.?\d+$/,
      hexColor: /^#[0-9A-Fa-f]{6}$/
    };
  }
  
  static validateInput(type, value) {
    const validators = this.createValidators();
    return validators[type]?.test(value) || false;
  }
  
  // 2. Text Extraction
  static extractData(text) {
    const patterns = {
      emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      urls: /https?:\/\/[^\s]+/g,
      phones: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      numbers: /-?\d*\.?\d+/g
    };
    
    const results = {};
    for (const [key, pattern] of Object.entries(patterns)) {
      results[key] = text.match(pattern) || [];
    }
    
    return results;
  }
  
  // 3. Text Cleaning
  static cleanText(text) {
    return text
      .replace(/\s+/g, ' ')           // Multiple spaces to single
      .replace(/^\s+|\s+$/g, '')     // Trim
      .replace(/[^\w\s.-]/g, '')     // Remove special chars
      .toLowerCase();
  }
  
  // 4. Format Conversion
  static formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
  }
}

// Demonstração dos casos de uso
function demonstrarCasosDeUso() {
  console.log("\n=== Casos de Uso Fundamentais ===");
  
  // Validation
  console.log("=== Validation ===");
  const testInputs = {
    email: ['user@example.com', 'invalid-email', 'test@test.co.uk'],
    phone: ['+1234567890', '123-456-7890', 'invalid'],
    url: ['https://example.com', 'http://test.org', 'not-a-url']
  };
  
  Object.entries(testInputs).forEach(([type, values]) => {
    console.log(`${type} validation:`);
    values.forEach(value => {
      const isValid = RegexBasicUseCases.validateInput(type, value);
      console.log(`  "${value}": ${isValid ? '✅' : '❌'}`);
    });
  });
  
  // Extraction
  console.log("\n=== Data Extraction ===");
  const sampleText = `
    Contact us at support@company.com or visit https://www.company.com
    Call 555-123-4567 or 555.987.6543 for support.
    Prices: $19.99, $29.50, and $5.00 available.
  `;
  
  const extracted = RegexBasicUseCases.extractData(sampleText);
  console.log("Extracted data:", extracted);
  
  // Cleaning
  console.log("\n=== Text Cleaning ===");
  const messyText = '  Hello!!!   World???   How   are    you???  ';
  console.log("Original:", `"${messyText}"`);
  console.log("Cleaned:", `"${RegexBasicUseCases.cleanText(messyText)}"`);
  
  // Formatting
  console.log("\n=== Format Conversion ===");
  const phoneNumbers = ['1234567890', '(123) 456-7890', '123.456.7890'];
  phoneNumbers.forEach(phone => {
    console.log(`"${phone}" → "${RegexBasicUseCases.formatPhone(phone)}"`);
  });
}

demonstrarCasosDeUso();
```

---

## 📚 Conclusão

**Expressões Regulares** são **ferramentas fundamentais** para **pattern matching** em JavaScript, oferecendo **sintaxe declarativa** para operações complexas de texto através de **literal notation** ou **constructor approach** com características distintas.

**Características distintivas:**
- **Literal Regex:** Compilação em parse-time, melhor performance, sintaxe fixa
- **Constructor Regex:** Compilação em runtime, padrões dinâmicos, double escaping
- **test():** Boolean return, ideal para validação simples
- **exec():** Detailed match info, suporte a global matching com estado
- **RegExp Object:** Propriedades imutáveis + lastIndex mutável para controle de estado

**Casos de uso estratégicos:**
- **Input Validation:** Email, telefone, URL, formatos específicos
- **Data Extraction:** Parsing de texto estruturado e semi-estruturado
- **Text Processing:** Limpeza, formatação e transformação de strings
- **Search Operations:** Pattern finding com precisão superior a métodos de string

É **essencial** dominar a **sintaxe básica** e **métodos fundamentais** antes de avançar para **metacaracteres**, **flags** e **padrões complexos** que amplificam exponencialmente o poder expressivo das regex.