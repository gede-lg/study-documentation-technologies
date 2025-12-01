# Classes de Caracteres e Quantificadores em Regex

## 🎯 Introdução e Definição

### Definição Conceitual

**Character Classes** são **conjuntos de caracteres** definidos entre colchetes `[]` que permitem **matching flexível** de qualquer caractere do conjunto. **Quantificadores** especificam **quantas vezes** um elemento deve ocorrer, oferecendo **controle preciso** sobre repetições em padrões.

Funcionam como **filtros seletivos** e **contadores inteligentes** que transformam **matching rígido** em **pattern recognition adaptável**, essencial para **text processing robusto** e **data validation flexível**.

### Problema Fundamental que Resolve

Resolve a necessidade de **flexible character matching** e **repetition control**, permitindo **range-based validation**, **pattern quantification**, **greedy/non-greedy behavior** e **performance-optimized text processing** que seriam **impraticáveis** com literal matching.

---

## 📋 Sumário Conceitual

### Character Classes Fundamentais
- **[abc]** - Qualquer um dos caracteres listados
- **[^abc]** - Qualquer caractere EXCETO os listados  
- **[a-z]** - Range de caracteres (lowercase)
- **[A-Z0-9]** - Múltiplos ranges combinados
- **\d \w \s** - Predefined character classes

### Quantificadores Essenciais
- **{n}** - Exatamente n repetições
- **{n,m}** - Entre n e m repetições
- **{n,}** - No mínimo n repetições
- *****, **+**, **?** - Zero+, um+, zero-ou-um

---

## 🧠 Fundamentos Teóricos

### Sistema de Character Classes

#### Análise Detalhada das Classes
```javascript
// Demonstração completa de character classes

function analisarCharacterClasses() {
  console.log("=== Análise de Character Classes ===");
  
  // BASIC CHARACTER SETS
  console.log("=== Basic Character Sets ===");
  
  const testChars = ['a', 'b', 'x', '1', '5', 'A', 'Z', '!', ' '];
  
  const basicClasses = {
    '[abc]': /[abc]/,           // Matches a, b, or c
    '[^abc]': /[^abc]/,         // Matches anything except a, b, c
    '[a-z]': /[a-z]/,           // Lowercase letters
    '[A-Z]': /[A-Z]/,           // Uppercase letters
    '[0-9]': /[0-9]/,           // Digits
    '[a-zA-Z]': /[a-zA-Z]/,     // All letters
    '[a-zA-Z0-9]': /[a-zA-Z0-9]/ // Alphanumeric
  };
  
  testChars.forEach(char => {
    console.log(`Testing "${char}":`);
    Object.entries(basicClasses).forEach(([pattern, regex]) => {
      console.log(`  ${pattern}: ${regex.test(char)}`);
    });
  });
  
  // COMPLEX CHARACTER RANGES
  console.log("\n=== Complex Character Ranges ===");
  
  const complexTests = ['a', 'é', 'ñ', '€', '😀', '中', 'א'];
  
  const complexClasses = {
    '[\\u00C0-\\u017F]': /[\u00C0-\u017F]/,     // Latin Extended
    '[\\u20A0-\\u20CF]': /[\u20A0-\u20CF]/,     // Currency symbols
    '[\\u1F600-\\u1F64F]': /[\u1F600-\u1F64F]/u, // Emoticons (needs unicode flag)
    '[\\u4E00-\\u9FFF]': /[\u4E00-\u9FFF]/,     // Chinese characters
    '[\\u0590-\\u05FF]': /[\u0590-\u05FF]/      // Hebrew
  };
  
  complexTests.forEach(char => {
    console.log(`Testing "${char}":`);
    Object.entries(complexClasses).forEach(([pattern, regex]) => {
      try {
        console.log(`  ${pattern}: ${regex.test(char)}`);
      } catch (error) {
        console.log(`  ${pattern}: Error - ${error.message}`);
      }
    });
  });
  
  // PREDEFINED CLASSES vs CUSTOM CLASSES
  console.log("\n=== Predefined vs Custom Classes ===");
  
  const comparisonText = 'Hello123_world$test';
  
  const comparisons = [
    { custom: '[a-zA-Z0-9_]', predefined: '\\w', description: 'Word characters' },
    { custom: '[0-9]', predefined: '\\d', description: 'Digits' },
    { custom: '[ \\t\\n\\r\\f]', predefined: '\\s', description: 'Whitespace' }
  ];
  
  comparisons.forEach(({ custom, predefined, description }) => {
    const customRegex = new RegExp(custom, 'g');
    const predefinedRegex = new RegExp(predefined, 'g');
    
    const customMatches = comparisonText.match(customRegex) || [];
    const predefinedMatches = comparisonText.match(predefinedRegex) || [];
    
    console.log(`${description}:`);
    console.log(`  Custom ${custom}: ${customMatches.length} matches`);
    console.log(`  Predefined ${predefined}: ${predefinedMatches.length} matches`);
    console.log(`  Equal results: ${JSON.stringify(customMatches) === JSON.stringify(predefinedMatches)}`);
  });
}

analisarCharacterClasses();

// Negated classes e edge cases
function analisarClassesNegadas() {
  console.log("\n=== Classes Negadas e Edge Cases ===");
  
  // NEGATED CLASSES BEHAVIOR
  console.log("=== Negated Classes ===");
  
  const negationTests = [
    { text: 'abc123', pattern: '[^a-z]', description: 'Not lowercase' },
    { text: 'ABC123', pattern: '[^A-Z]', description: 'Not uppercase' },
    { text: '!@#abc', pattern: '[^\\w]', description: 'Not word chars' },
    { text: 'test\ntest', pattern: '[^\\s]', description: 'Not whitespace' }
  ];
  
  negationTests.forEach(({ text, pattern, description }) => {
    const regex = new RegExp(pattern, 'g');
    const matches = text.match(regex) || [];
    
    console.log(`${description} in "${text}":`);
    console.log(`  Pattern: ${pattern}`);
    console.log(`  Matches: [${matches.map(m => `"${m}"`).join(', ')}]`);
  });
  
  // SPECIAL CHARACTERS IN CLASSES
  console.log("\n=== Special Characters in Classes ===");
  
  const specialInClass = [
    { pattern: '[\\]]', char: ']', description: 'Literal closing bracket' },
    { pattern: '[\\[]', char: '[', description: 'Literal opening bracket' },
    { pattern: '[\\\\]', char: '\\', description: 'Literal backslash' },
    { pattern: '[\\-]', char: '-', description: 'Literal hyphen' },
    { pattern: '[\\^]', char: '^', description: 'Literal caret' }
  ];
  
  specialInClass.forEach(({ pattern, char, description }) => {
    const regex = new RegExp(pattern);
    console.log(`${description}: ${pattern} matches "${char}": ${regex.test(char)}`);
  });
  
  // RANGE ORDER IMPORTANCE
  console.log("\n=== Range Order and Validity ===");
  
  const rangeTests = [
    { pattern: '[a-z]', valid: true, description: 'Normal range' },
    { pattern: '[z-a]', valid: false, description: 'Reverse range (invalid)' },
    { pattern: '[0-9a-z]', valid: true, description: 'Multiple ranges' },
    { pattern: '[a-zA-Z0-9_-]', valid: true, description: 'Complex valid range' }
  ];
  
  rangeTests.forEach(({ pattern, valid, description }) => {
    try {
      const regex = new RegExp(pattern);
      console.log(`${description}: ${pattern} - ${valid ? 'Valid' : 'Should be invalid'}`);
      
      if (valid) {
        console.log(`  Test 'a': ${regex.test('a')}`);
      }
    } catch (error) {
      console.log(`${description}: ${pattern} - Error: ${error.message}`);
    }
  });
}

analisarClassesNegadas();
```

### Sistema de Quantificadores

#### Análise dos Tipos de Quantificação
```javascript
// Demonstração completa de quantificadores

function analisarQuantificadores() {
  console.log("\n=== Análise de Quantificadores ===");
  
  // EXACT QUANTIFIERS {n}
  console.log("=== Exact Quantifiers {n} ===");
  
  const exactTests = [
    'a', 'aa', 'aaa', 'aaaa', 'aaaaa'
  ];
  
  const exactPatterns = {
    'a{1}': /a{1}/,     // Exactly 1
    'a{3}': /a{3}/,     // Exactly 3
    'a{5}': /a{5}/      // Exactly 5
  };
  
  exactTests.forEach(text => {
    console.log(`Testing "${text}":`);
    Object.entries(exactPatterns).forEach(([pattern, regex]) => {
      const match = text.match(regex);
      console.log(`  ${pattern}: ${match ? `"${match[0]}"` : 'no match'}`);
    });
  });
  
  // RANGE QUANTIFIERS {n,m}
  console.log("\n=== Range Quantifiers {n,m} ===");
  
  const rangeTests = [
    '', 'a', 'aa', 'aaa', 'aaaa', 'aaaaa', 'aaaaaa'
  ];
  
  const rangePatterns = {
    'a{2,4}': /a{2,4}/,   // 2 to 4
    'a{1,3}': /a{1,3}/,   // 1 to 3
    'a{3,}': /a{3,}/      // 3 or more
  };
  
  rangeTests.forEach(text => {
    console.log(`Testing "${text}":`);
    Object.entries(rangePatterns).forEach(([pattern, regex]) => {
      const match = text.match(regex);
      console.log(`  ${pattern}: ${match ? `"${match[0]}"` : 'no match'}`);
    });
  });
  
  // SHORTHAND QUANTIFIERS
  console.log("\n=== Shorthand Quantifiers ===");
  
  const shorthandTests = [
    '', 'a', 'aa', 'aaa', 'aaaa'
  ];
  
  const shorthandPatterns = {
    'a*': /a*/,      // 0 or more (equivalent to {0,})
    'a+': /a+/,      // 1 or more (equivalent to {1,})
    'a?': /a?/       // 0 or 1 (equivalent to {0,1})
  };
  
  shorthandTests.forEach(text => {
    console.log(`Testing "${text}":`);
    Object.entries(shorthandPatterns).forEach(([pattern, regex]) => {
      const match = text.match(regex);
      console.log(`  ${pattern}: ${match ? `"${match[0]}"` : 'no match'}`);
    });
  });
  
  // GREEDY vs NON-GREEDY (LAZY)
  console.log("\n=== Greedy vs Non-Greedy ===");
  
  const greedyText = '<div>content</div><span>more</span>';
  
  const greedyPatterns = {
    '<.*>': /<.*>/,        // Greedy - matches as much as possible
    '<.*?>': /<.*?>/,      // Non-greedy - matches as little as possible
    '<.+>': /<.+>/,        // Greedy with +
    '<.+?>': /<.+?>/       // Non-greedy with +
  };
  
  console.log(`Text: "${greedyText}"`);
  Object.entries(greedyPatterns).forEach(([pattern, regex]) => {
    const match = greedyText.match(regex);
    console.log(`${pattern}: ${match ? `"${match[0]}"` : 'no match'}`);
  });
  
  // QUANTIFIERS WITH CHARACTER CLASSES
  console.log("\n=== Quantifiers with Character Classes ===");
  
  const classQuantifierText = 'abc123XYZ!@#';
  
  const classQuantifiers = {
    '[a-z]+': /[a-z]+/g,      // One or more lowercase
    '[A-Z]{2,}': /[A-Z]{2,}/g, // Two or more uppercase
    '[0-9]{3}': /[0-9]{3}/g,   // Exactly 3 digits
    '[^a-zA-Z0-9]*': /[^a-zA-Z0-9]*/g // Zero or more non-alphanumeric
  };
  
  console.log(`Text: "${classQuantifierText}"`);
  Object.entries(classQuantifiers).forEach(([pattern, regex]) => {
    const matches = classQuantifierText.match(regex) || [];
    console.log(`${pattern}: [${matches.map(m => `"${m}"`).join(', ')}]`);
  });
}

analisarQuantificadores();

// Performance analysis de quantifiers
function analisarPerformanceQuantifiers() {
  console.log("\n=== Performance Analysis ===");
  
  const testText = 'a'.repeat(1000) + 'b';
  const iterations = 1000;
  
  // Different quantifier approaches
  const quantifierTests = [
    { name: 'Greedy *', regex: /a*b/ },
    { name: 'Non-greedy *?', regex: /a*?b/ },
    { name: 'Greedy +', regex: /a+b/ },
    { name: 'Non-greedy +?', regex: /a+?b/ },
    { name: 'Exact count', regex: new RegExp(`a{${1000}}b`) }
  ];
  
  quantifierTests.forEach(({ name, regex }) => {
    console.time(name);
    for (let i = 0; i < iterations; i++) {
      regex.test(testText);
    }
    console.timeEnd(name);
  });
  
  // Character class performance
  console.log("\nCharacter class performance:");
  const mixedText = 'ABCabc123XYZ789'.repeat(100);
  
  const classTests = [
    { name: 'Predefined \\w+', regex: /\w+/g },
    { name: 'Custom [a-zA-Z0-9_]+', regex: /[a-zA-Z0-9_]+/g },
    { name: 'Multiple ranges', regex: /[a-z]+|[A-Z]+|[0-9]+/g },
    { name: 'Negated [^\\s]+', regex: /[^\s]+/g }
  ];
  
  classTests.forEach(({ name, regex }) => {
    console.time(name);
    for (let i = 0; i < iterations; i++) {
      mixedText.match(regex);
    }
    console.timeEnd(name);
  });
}

analisarPerformanceQuantifiers();
```

### Combinações Avançadas

#### Padrões Complexos com Classes e Quantifiers
```javascript
// Padrões avançados combinando classes e quantificadores

function analisarPadroesAvancados() {
  console.log("\n=== Padrões Avançados ===");
  
  // REALISTIC VALIDATION PATTERNS
  console.log("=== Validation Patterns ===");
  
  const validationPatterns = {
    // Username: 3-20 chars, letters/numbers/underscore, must start with letter
    username: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
    
    // Password: 8+ chars, must have upper, lower, digit, special
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    
    // Phone: flexible format
    phone: /^[\+]?[\d\s\-\(\)]{10,}$/,
    
    // Brazilian CPF: XXX.XXX.XXX-XX
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    
    // Hexadecimal color
    hexColor: /^#[0-9A-Fa-f]{6}$/,
    
    // IPv4 address (simplified)
    ipv4: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
  };
  
  const testData = {
    username: ['user123', 'validUser', '123invalid', 'a', 'valid_user_name'],
    password: ['Password123!', 'weak', 'NoSpecial123', 'noUPPER123!', 'ValidPass1@'],
    phone: ['+1234567890', '(11) 99999-9999', '123', '+55 11 98765-4321'],
    cpf: ['123.456.789-01', '12345678901', '123.456.789.01'],
    hexColor: ['#FF0000', '#ff0000', '#FF00', 'FF0000', '#GG0000'],
    ipv4: ['192.168.1.1', '256.256.256.256', '192.168.1', '192.168.1.1.1']
  };
  
  Object.entries(testData).forEach(([type, tests]) => {
    console.log(`\n${type.toUpperCase()} validation:`);
    const pattern = validationPatterns[type];
    
    tests.forEach(test => {
      const isValid = pattern.test(test);
      console.log(`  "${test}": ${isValid ? '✅' : '❌'}`);
    });
  });
  
  // EXTRACTION PATTERNS
  console.log("\n=== Extraction Patterns ===");
  
  const extractionText = `
    Contact: john.doe@company.com or (555) 123-4567
    Website: https://www.example.com
    Colors: #FF0000, #00FF00, #0000FF
    IPs: 192.168.1.1, 10.0.0.1
    Dates: 2023-12-25, 01/15/2024
  `;
  
  const extractionPatterns = {
    emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phones: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    urls: /https?:\/\/[^\s]+/g,
    hexColors: /#[0-9A-Fa-f]{6}/g,
    ips: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
    dates: /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/g
  };
  
  console.log("Extraction from text:");
  Object.entries(extractionPatterns).forEach(([type, pattern]) => {
    const matches = extractionText.match(pattern) || [];
    console.log(`${type}: ${matches.join(', ') || 'none'}`);
  });
  
  // CLEANING PATTERNS
  console.log("\n=== Text Cleaning Patterns ===");
  
  const dirtyText = `  Remove   multiple    spaces,
  normalize-line_breaks,
  CLEAN_special#characters@here!
  and   trim    everything   `;
  
  const cleaningSteps = [
    { name: 'Multiple spaces', pattern: /\s+/g, replacement: ' ' },
    { name: 'Special chars', pattern: /[^\w\s.-]/g, replacement: '' },
    { name: 'Underscores to spaces', pattern: /_/g, replacement: ' ' },
    { name: 'Trim whitespace', pattern: /^\s+|\s+$/g, replacement: '' },
    { name: 'Normalize case', pattern: /\w+/g, replacement: (match) => match.toLowerCase() }
  ];
  
  let cleanedText = dirtyText;
  console.log("Original:", JSON.stringify(dirtyText));
  
  cleaningSteps.forEach(({ name, pattern, replacement }) => {
    cleanedText = cleanedText.replace(pattern, replacement);
    console.log(`After ${name}:`, JSON.stringify(cleanedText));
  });
}

analisarPadroesAvancados();

// Advanced quantifier behaviors
function analisarComportamentosAvancados() {
  console.log("\n=== Comportamentos Avançados ===");
  
  // CATASTROPHIC BACKTRACKING EXAMPLE
  console.log("=== Catastrophic Backtracking Prevention ===");
  
  const problematicPattern = /^(a+)+$/;  // Can cause exponential backtracking
  const optimizedPattern = /^a+$/;       // Optimized version
  
  const testStrings = ['a'.repeat(20), 'a'.repeat(20) + 'b'];
  
  testStrings.forEach(str => {
    console.log(`Testing "${str.substring(0, 10)}${str.length > 10 ? '...' : ''}":`);
    
    // Safe test with timeout simulation
    try {
      console.time('Optimized pattern');
      const result = optimizedPattern.test(str);
      console.timeEnd('Optimized pattern');
      console.log(`  Optimized result: ${result}`);
    } catch (error) {
      console.log(`  Optimized error: ${error.message}`);
    }
    
    // Note: problematic pattern intentionally commented to prevent hanging
    console.log('  Problematic pattern: Skipped (would cause exponential time)');
  });
  
  // ATOMIC GROUPING SIMULATION
  console.log("\n=== Atomic Grouping Patterns ===");
  
  // JavaScript doesn't have atomic groups, but we can simulate with techniques
  const atomicLikePatterns = {
    'Possessive-like': /\d++/,  // Not supported in JS, but concept shown
    'Optimized alternative': /\d{1,}/,  // Better approach
    'Character class optimization': /[0-9]+/
  };
  
  console.log("Atomic grouping concepts (JavaScript alternatives):");
  console.log("- Use specific quantifiers when possible");
  console.log("- Avoid nested quantifiers");
  console.log("- Use character classes over alternation when applicable");
}

analisarComportamentosAvancados();
```

---

## 🎯 Aplicabilidade e Contextos

### Casos de Uso Reais

```javascript
// Implementação prática de padrões do mundo real

class PracticalRegexPatterns {
  // Form validation patterns
  static validation = {
    // Brazilian patterns
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    cep: /^\d{5}-?\d{3}$/,
    
    // International patterns  
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
    phone: /^[\+]?[\d\s\-\(\)]{10,}$/,
    creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
    
    // Security patterns
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    url: /^https?:\/\/[^\s/$.?#].[^\s]*$/i
  };
  
  // Data extraction patterns
  static extraction = {
    emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
    phones: /\b[\+]?[\d\s\-\(\)]{10,}\b/g,
    urls: /https?:\/\/[^\s]+/gi,
    mentions: /@([a-zA-Z0-9_]+)/g,
    hashtags: /#([a-zA-Z0-9_]+)/g,
    numbers: /\d+(?:\.\d+)?/g
  };
  
  // Text processing patterns
  static processing = {
    removeExtraSpaces: /\s+/g,
    removeHtml: /<[^>]*>/g,
    extractWords: /\b\w+\b/g,
    camelCaseToKebab: /([a-z])([A-Z])/g,
    kebabToCamelCase: /-([a-z])/g
  };
  
  // Validation method
  static validate(type, value) {
    return this.validation[type]?.test(value) || false;
  }
  
  // Extraction method
  static extract(type, text) {
    return text.match(this.extraction[type]) || [];
  }
  
  // Processing methods
  static cleanSpaces(text) {
    return text.replace(this.processing.removeExtraSpaces, ' ').trim();
  }
  
  static removeHtml(text) {
    return text.replace(this.processing.removeHtml, '');
  }
  
  static camelToKebab(text) {
    return text.replace(this.processing.camelCaseToKebab, '$1-$2').toLowerCase();
  }
  
  static kebabToCamel(text) {
    return text.replace(this.processing.kebabToCamelCase, (_, char) => char.toUpperCase());
  }
}

// Demonstração prática
function demonstrarCasosPraticos() {
  console.log("\n=== Casos Práticos do Mundo Real ===");
  
  // Form validation
  console.log("=== Form Validation ===");
  const formData = {
    email: 'user@EXAMPLE.com',
    cpf: '123.456.789-01',
    phone: '+55 (11) 99999-9999',
    password: 'MySecure123!',
    url: 'https://www.example.com'
  };
  
  Object.entries(formData).forEach(([field, value]) => {
    const isValid = PracticalRegexPatterns.validate(field, value);
    console.log(`${field}: "${value}" - ${isValid ? '✅' : '❌'}`);
  });
  
  // Data extraction
  console.log("\n=== Data Extraction ===");
  const socialText = `
    Follow me @john_doe and visit https://mysite.com
    Contact: support@company.com or call +1-555-123-4567
    Use tags #javascript #regex for better code!
    Prices: $19.99, €25.50, £15.75
  `;
  
  console.log("Social media text analysis:");
  ['emails', 'phones', 'urls', 'mentions', 'hashtags'].forEach(type => {
    const extracted = PracticalRegexPatterns.extract(type, socialText);
    console.log(`${type}: ${extracted.join(', ') || 'none'}`);
  });
  
  // Text processing
  console.log("\n=== Text Processing ===");
  const processingExamples = {
    'Multiple spaces': '  Remove   extra    spaces   here  ',
    'HTML content': '<div>Keep <strong>this</strong> text only</div>',
    'camelCase': 'convertCamelCaseToKebab',
    'kebab-case': 'convert-kebab-case-to-camel'
  };
  
  Object.entries(processingExamples).forEach(([type, text]) => {
    let processed;
    switch (type) {
      case 'Multiple spaces':
        processed = PracticalRegexPatterns.cleanSpaces(text);
        break;
      case 'HTML content':
        processed = PracticalRegexPatterns.removeHtml(text);
        break;
      case 'camelCase':
        processed = PracticalRegexPatterns.camelToKebab(text);
        break;
      case 'kebab-case':
        processed = PracticalRegexPatterns.kebabToCamel(text);
        break;
    }
    console.log(`${type}:`);
    console.log(`  Before: "${text}"`);
    console.log(`  After:  "${processed}"`);
  });
}

demonstrarCasosPraticos();
```

---

## 📚 Conclusão

**Character Classes** e **Quantificadores** são **componentes fundamentais** que transformam regex de **matching rígido** para **pattern recognition flexível**, oferecendo **range-based selection** e **repetition control** essenciais para **robust text processing**.

**Características distintivas:**

- **Character Classes:** Conjuntos flexíveis [abc], ranges [a-z], negação [^abc]
- **Quantificadores:** Controle preciso de repetição {n,m}, *, +, ?
- **Greedy vs Lazy:** Comportamento de matching máximo vs mínimo
- **Performance Impact:** Classes predefinidas (\d, \w, \s) são otimizadas

**Casos de uso estratégicos:**

- **Form Validation:** CPF, email, phone com format flexibility
- **Data Extraction:** Emails, URLs, phone numbers de texto livre
- **Text Processing:** Cleaning, normalization, format conversion
- **Security Patterns:** Password strength, input sanitization

Dominar **character classes** e **quantifiers** é **prerequisito** para **grouping**, **lookarounds** e **advanced regex patterns** que amplificam o poder de **text processing** e **data validation** em aplicações modernas.