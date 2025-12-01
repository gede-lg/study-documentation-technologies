# Flags e Metacaracteres em Regex JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Flags** são **modificadores globais** que alteram o **comportamento de matching** da regex, enquanto **metacaracteres** são **símbolos especiais** que representam **classes de caracteres**, **posições** ou **quantidades** em padrões de texto.

Funcionam como **instruções de controle** que determinam **como** a engine de regex **interpreta** e **executa** o padrão, oferecendo **flexibilidade comportamental** sem modificar a **lógica central** do pattern.

### Problema Fundamental que Resolve

Resolve a necessidade de **controle fino** sobre o comportamento de matching, permitindo **case-insensitive search**, **global matching**, **multiline processing**, **boundary detection** e **character classification** que são essenciais para **text processing robusto**.

---

## 📋 Sumário Conceitual

### Flags Fundamentais
- **g (global):** Encontrar todos os matches, não apenas o primeiro
- **i (ignoreCase):** Ignorar diferenças entre maiúsculas/minúsculas  
- **m (multiline):** ^ e $ funcionam em cada linha
- **s (dotAll):** . corresponde a quebras de linha
- **u (unicode):** Suporte completo a Unicode
- **y (sticky):** Match apenas na posição lastIndex

### Metacaracteres Essenciais
- **. ^ $ * + ? {} [] () |** - Símbolos com significados especiais
- **Boundary matchers** - \b, \B para limites de palavra
- **Character classes** - \d, \w, \s e suas negações

---

## 🧠 Fundamentos Teóricos

### Sistema de Flags

#### Análise Detalhada das Flags
```javascript
// Demonstração completa do sistema de flags

function analisarFlags() {
  console.log("=== Análise do Sistema de Flags ===");
  
  const testText = `First Line: Hello WORLD
Second Line: hello world
Third Line: HELLO World`;
  
  console.log("Test text:");
  console.log(testText);
  
  // GLOBAL FLAG (g)
  console.log("\n=== Global Flag (g) ===");
  
  const pattern = /hello/;
  const globalPattern = /hello/g;
  
  console.log("Without global:");
  console.log("  match():", testText.match(pattern));
  console.log("  matchAll() count:", [...testText.matchAll(pattern)].length);
  
  console.log("With global:");
  console.log("  match():", testText.match(globalPattern));
  console.log("  matchAll() count:", [...testText.matchAll(globalPattern)].length);
  
  // IGNORE CASE FLAG (i)
  console.log("\n=== Ignore Case Flag (i) ===");
  
  const caseSensitive = /hello/g;
  const caseInsensitive = /hello/gi;
  
  console.log("Case sensitive matches:", testText.match(caseSensitive));
  console.log("Case insensitive matches:", testText.match(caseInsensitive));
  
  // MULTILINE FLAG (m)
  console.log("\n=== Multiline Flag (m) ===");
  
  const startPattern = /^hello/gi;
  const startMultiline = /^hello/gim;
  
  console.log("Without multiline:", testText.match(startPattern));
  console.log("With multiline:", testText.match(startMultiline));
  
  // Demonstração com $ (end anchor)
  const endPattern = /world$/gi;
  const endMultiline = /world$/gim;
  
  console.log("End without multiline:", testText.match(endPattern));
  console.log("End with multiline:", testText.match(endMultiline));
  
  // DOT ALL FLAG (s)
  console.log("\n=== Dot All Flag (s) ===");
  
  const multilineText = "First\nSecond\nThird";
  const normalDot = /First.Second/;
  const dotAllPattern = /First.Second/s;
  
  console.log("Multiline text:", JSON.stringify(multilineText));
  console.log("Normal dot matches:", normalDot.test(multilineText));
  console.log("Dot-all matches:", dotAllPattern.test(multilineText));
  
  // UNICODE FLAG (u)
  console.log("\n=== Unicode Flag (u) ===");
  
  const unicodeText = "Hello 👋 World 🌍";
  const normalUnicode = /👋.🌍/;
  const unicodePattern = /👋.🌍/u;
  
  console.log("Unicode text:", unicodeText);
  console.log("Normal unicode:", normalUnicode.test(unicodeText));
  console.log("With unicode flag:", unicodePattern.test(unicodeText));
  
  // Demonstração com ranges unicode
  const emojiPattern = /[\u{1F600}-\u{1F64F}]/u; // Emoticons range
  console.log("Emoji detection:", emojiPattern.test("😀"));
  
  // STICKY FLAG (y)
  console.log("\n=== Sticky Flag (y) ===");
  
  const stickyText = "abcabc";
  const globalSticky = /abc/g;
  const stickyPattern = /abc/y;
  
  console.log("Sticky text:", stickyText);
  
  // Global behavior
  globalSticky.lastIndex = 0;
  console.log("Global - first exec:", globalSticky.exec(stickyText));
  console.log("Global - lastIndex:", globalSticky.lastIndex);
  console.log("Global - second exec:", globalSticky.exec(stickyText));
  
  // Sticky behavior
  stickyPattern.lastIndex = 0;
  console.log("Sticky - first exec:", stickyPattern.exec(stickyText));
  console.log("Sticky - lastIndex:", stickyPattern.lastIndex);
  console.log("Sticky - second exec:", stickyPattern.exec(stickyText));
  
  // Sticky failure when not at exact position
  stickyPattern.lastIndex = 1;
  console.log("Sticky at position 1:", stickyPattern.exec(stickyText));
}

analisarFlags();

// Flag combinations e interactions
function analisarCombinacaoFlags() {
  console.log("\n=== Combinações de Flags ===");
  
  const sampleText = `
Line 1: Hello World
Line 2: HELLO world  
Line 3: hello WORLD
`;
  
  // Todas as combinações importantes
  const flagCombinations = [
    { flags: '', description: 'No flags' },
    { flags: 'g', description: 'Global only' },
    { flags: 'i', description: 'Case insensitive only' },
    { flags: 'gi', description: 'Global + Case insensitive' },
    { flags: 'gim', description: 'Global + Case insensitive + Multiline' },
    { flags: 'gims', description: 'All flags except sticky' }
  ];
  
  flagCombinations.forEach(({ flags, description }) => {
    const regex = new RegExp('hello', flags);
    const matches = sampleText.match(regex);
    
    console.log(`${description} (${flags || 'none'}):`);
    console.log(`  Matches: ${matches ? matches.length : 0}`);
    console.log(`  Results:`, matches);
  });
}

analisarCombinacaoFlags();
```

### Metacaracteres Fundamentais

#### Análise dos Símbolos Especiais
```javascript
// Demonstração completa dos metacaracteres

function analisarMetacaracteres() {
  console.log("\n=== Análise de Metacaracteres ===");
  
  // DOT METACHARACTER (.)
  console.log("=== Dot (.) Metacharacter ===");
  
  const dotTests = [
    'abc', 'a.c', 'a c', 'a\nc', 'a\tc'
  ];
  
  const dotPattern = /a.c/;
  const dotAllPattern = /a.c/s;
  
  dotTests.forEach(test => {
    console.log(`"${JSON.stringify(test)}":`);
    console.log(`  Normal dot: ${dotPattern.test(test)}`);
    console.log(`  Dot-all: ${dotAllPattern.test(test)}`);
  });
  
  // ANCHORS (^ $)
  console.log("\n=== Anchors (^ $) ===");
  
  const anchorText = `start middle end
new line start
end of line`;
  
  const startAnchor = /^start/gm;
  const endAnchor = /end$/gm;
  
  console.log("Text:");
  console.log(anchorText);
  console.log("Start anchors:", anchorText.match(startAnchor));
  console.log("End anchors:", anchorText.match(endAnchor));
  
  // QUANTIFIERS (* + ?)
  console.log("\n=== Quantifiers (* + ?) ===");
  
  const quantifierTests = [
    '', 'a', 'aa', 'aaa', 'b', 'ab', 'aab', 'aaab'
  ];
  
  const patterns = {
    'a*': /a*/,    // Zero or more
    'a+': /a+/,    // One or more  
    'a?': /a?/     // Zero or one
  };
  
  quantifierTests.forEach(test => {
    console.log(`"${test}":`);
    Object.entries(patterns).forEach(([pattern, regex]) => {
      const match = test.match(regex);
      console.log(`  ${pattern}: "${match ? match[0] : 'no match'}"`);
    });
  });
  
  // ALTERNATION (|)
  console.log("\n=== Alternation (|) ===");
  
  const alternationPattern = /cat|dog|bird/gi;
  const alternationText = "I have a cat, you have a dog, she has a bird";
  
  console.log("Text:", alternationText);
  console.log("Matches:", alternationText.match(alternationPattern));
  
  // GROUPING ()
  console.log("\n=== Grouping () ===");
  
  const groupText = "abc def abc ghi abc";
  const groupPattern = /(abc)/g;
  
  const matches = [...groupText.matchAll(groupPattern)];
  console.log("Grouped matches:");
  matches.forEach((match, index) => {
    console.log(`  Match ${index + 1}: "${match[0]}" at index ${match.index}`);
  });
  
  // CHARACTER CLASSES []
  console.log("\n=== Character Classes [] ===");
  
  const classTests = [
    'a', 'b', 'c', '1', '2', 'A', 'Z', '!'
  ];
  
  const classPatterns = {
    '[abc]': /[abc]/,      // Any of a, b, c
    '[^abc]': /[^abc]/,    // Not a, b, or c
    '[a-z]': /[a-z]/,      // Lowercase letters
    '[A-Z]': /[A-Z]/,      // Uppercase letters
    '[0-9]': /[0-9]/       // Digits
  };
  
  classTests.forEach(test => {
    console.log(`"${test}":`);
    Object.entries(classPatterns).forEach(([pattern, regex]) => {
      console.log(`  ${pattern}: ${regex.test(test)}`);
    });
  });
}

analisarMetacaracteres();

// Predefined character classes
function analisarClassesPredefinidas() {
  console.log("\n=== Classes de Caracteres Predefinidas ===");
  
  const testChars = [
    'a', 'Z', '5', '_', ' ', '\t', '\n', '!', 'ñ', '€'
  ];
  
  const predefinedClasses = {
    '\\d': /\d/,    // Digits [0-9]
    '\\D': /\D/,    // Non-digits
    '\\w': /\w/,    // Word chars [a-zA-Z0-9_]
    '\\W': /\W/,    // Non-word chars
    '\\s': /\s/,    // Whitespace
    '\\S': /\S/     // Non-whitespace
  };
  
  console.log("Character analysis:");
  testChars.forEach(char => {
    console.log(`"${char === '\n' ? '\\n' : char === '\t' ? '\\t' : char}":`);
    Object.entries(predefinedClasses).forEach(([name, regex]) => {
      console.log(`  ${name}: ${regex.test(char)}`);
    });
  });
  
  // Word boundaries
  console.log("\n=== Word Boundaries (\\b \\B) ===");
  
  const boundaryText = "The cat in the hat";
  const boundaryPatterns = {
    '\\bcat\\b': /\bcat\b/g,     // Whole word "cat"
    'cat': /cat/g,               // Any "cat"
    '\\Bcat\\B': /\Bcat\B/g      // "cat" not at word boundary
  };
  
  console.log("Text:", boundaryText);
  Object.entries(boundaryPatterns).forEach(([name, regex]) => {
    console.log(`${name}:`, boundaryText.match(regex));
  });
  
  // Complex boundary example
  const complexText = "concatenate category catch";
  console.log("\nComplex boundary text:", complexText);
  console.log("\\bcat\\b (whole word):", complexText.match(/\bcat\b/g));
  console.log("cat (substring):", complexText.match(/cat/g));
}

analisarClassesPredefinidas();
```

### Escape Sequences e Literal Characters

#### Tratamento de Caracteres Especiais
```javascript
// Análise de escape sequences e literais

function analisarEscapeSequences() {
  console.log("\n=== Escape Sequences e Literals ===");
  
  // ESCAPING METACHARACTERS
  console.log("=== Escaping Metacharacters ===");
  
  const specialChars = ['.', '^', '$', '*', '+', '?', '{', '}', '[', ']', '(', ')', '|', '\\'];
  
  specialChars.forEach(char => {
    const literal = `test${char}end`;
    
    // Unescaped (wrong)
    try {
      const unescapedRegex = new RegExp(`test${char}end`);
      console.log(`"${char}" unescaped pattern: ${unescapedRegex.source}`);
    } catch (error) {
      console.log(`"${char}" unescaped error: ${error.message}`);
    }
    
    // Escaped (correct)
    const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedRegex = new RegExp(`test${escapedChar}end`);
    console.log(`"${char}" escaped pattern: ${escapedRegex.source}`);
    console.log(`"${char}" matches literal: ${escapedRegex.test(literal)}`);
  });
  
  // ESCAPE HELPER FUNCTION
  console.log("\n=== Escape Helper Function ===");
  
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  const userInputs = [
    'hello.world',
    'price: $19.99',
    'math: 2+2=4',
    'question?',
    'array[0]'
  ];
  
  userInputs.forEach(input => {
    const escaped = escapeRegex(input);
    const regex = new RegExp(escaped);
    
    console.log(`Input: "${input}"`);
    console.log(`Escaped: "${escaped}"`);
    console.log(`Matches: ${regex.test(input)}`);
  });
  
  // UNICODE ESCAPES
  console.log("\n=== Unicode Escapes ===");
  
  const unicodeExamples = [
    { name: 'Basic Latin A', code: '\\u0041', char: 'A' },
    { name: 'Euro Symbol', code: '\\u20AC', char: '€' },
    { name: 'Smile Emoji', code: '\\u{1F600}', char: '😀' },
    { name: 'Heart Emoji', code: '\\u{2764}', char: '❤' }
  ];
  
  unicodeExamples.forEach(({ name, code, char }) => {
    const regex = new RegExp(code, 'u');
    console.log(`${name}: ${code} matches "${char}": ${regex.test(char)}`);
  });
  
  // CONTROL CHARACTERS
  console.log("\n=== Control Characters ===");
  
  const controlChars = {
    '\\n': '\n',    // Newline
    '\\r': '\r',    // Carriage return
    '\\t': '\t',    // Tab
    '\\f': '\f',    // Form feed
    '\\v': '\v'     // Vertical tab
  };
  
  Object.entries(controlChars).forEach(([escape, char]) => {
    const regex = new RegExp(escape);
    console.log(`${escape} matches control char: ${regex.test(char)}`);
  });
}

analisarEscapeSequences();

// Performance analysis
function analisarPerformanceFlags() {
  console.log("\n=== Performance Analysis ===");
  
  const largeText = 'Hello World! '.repeat(10000);
  const iterations = 1000;
  
  // Flag performance comparison
  const flagTests = [
    { name: 'No flags', regex: /hello/g },
    { name: 'Case insensitive', regex: /hello/gi },
    { name: 'Multiline', regex: /hello/gm },
    { name: 'All flags', regex: /hello/gims }
  ];
  
  flagTests.forEach(({ name, regex }) => {
    console.time(name);
    for (let i = 0; i < iterations; i++) {
      regex.lastIndex = 0;
      regex.test(largeText);
    }
    console.timeEnd(name);
  });
  
  // Metacharacter performance
  const metacharTests = [
    { name: 'Literal match', regex: /Hello/g },
    { name: 'Dot metachar', regex: /H.llo/g },
    { name: 'Character class', regex: /[Hh]ello/g },
    { name: 'Predefined class', regex: /\w+/g }
  ];
  
  console.log("\nMetacharacter performance:");
  metacharTests.forEach(({ name, regex }) => {
    console.time(name);
    for (let i = 0; i < iterations; i++) {
      regex.lastIndex = 0;
      largeText.match(regex);
    }
    console.timeEnd(name);
  });
}

analisarPerformanceFlags();
```

---

## 🎯 Aplicabilidade e Contextos

### Padrões Práticos com Flags e Metacaracteres

```javascript
// Exemplos práticos usando flags e metacaracteres

class RegexPatterns {
  // Email validation with proper flags
  static email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  
  // Phone numbers (flexible format)
  static phone = /^[\+]?[\d\s\-\(\)]{10,}$/;
  
  // URLs with protocol
  static url = /^https?:\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-@?^=%&/~\+#])?$/i;
  
  // Password strength (multiline for security display)
  static passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  // Extract data patterns
  static extractors = {
    emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
    urls: /https?:\/\/[^\s]+/gi,
    hashtags: /#\w+/gi,
    mentions: /@\w+/gi
  };
  
  // Text processing patterns
  static processors = {
    multipleSpaces: /\s+/g,
    lineBreaks: /\r?\n/g,
    htmlTags: /<[^>]*>/g,
    numbers: /\d+(\.\d+)?/g
  };
}

// Demonstração de uso prático
function demonstrarPadroesAvancados() {
  console.log("\n=== Padrões Avançados com Flags ===");
  
  // Validation examples
  console.log("=== Validation ===");
  const testInputs = {
    email: 'User@EXAMPLE.COM',
    phone: '+1 (555) 123-4567',
    url: 'HTTPS://WWW.EXAMPLE.COM/path',
    password: 'MyPass123!'
  };
  
  console.log("Email (case insensitive):", RegexPatterns.email.test(testInputs.email));
  console.log("Phone:", RegexPatterns.phone.test(testInputs.phone));
  console.log("URL (case insensitive):", RegexPatterns.url.test(testInputs.url));
  console.log("Strong password:", RegexPatterns.passwordStrong.test(testInputs.password));
  
  // Data extraction
  console.log("\n=== Data Extraction ===");
  const socialText = `
    Check out https://example.com for more info!
    Contact support@company.com or follow @company
    Use #javascript and #regex for better code
    Visit HTTP://ANOTHER-SITE.ORG too
  `;
  
  Object.entries(RegexPatterns.extractors).forEach(([type, pattern]) => {
    const matches = socialText.match(pattern) || [];
    console.log(`${type}:`, matches);
  });
  
  // Text processing
  console.log("\n=== Text Processing ===");
  const messyText = `  Multiple    spaces   and
  
  line breaks    with <div>HTML tags</div> and numbers 123.45  `;
  
  let processedText = messyText;
  
  // Clean multiple spaces
  processedText = processedText.replace(RegexPatterns.processors.multipleSpaces, ' ');
  console.log("After space cleanup:", JSON.stringify(processedText));
  
  // Remove HTML tags
  processedText = processedText.replace(RegexPatterns.processors.htmlTags, '');
  console.log("After HTML removal:", JSON.stringify(processedText));
  
  // Extract numbers
  const numbers = processedText.match(RegexPatterns.processors.numbers);
  console.log("Extracted numbers:", numbers);
}

demonstrarPadroesAvancados();
```

---

## 📚 Conclusão

**Flags** e **metacaracteres** são **componentes essenciais** que amplificam exponencialmente o **poder expressivo** das regex, oferecendo **controle comportamental** e **simbolismo especial** para **pattern matching sofisticado**.

**Características distintivas:**

- **Flags:** Modificadores globais (g, i, m, s, u, y) que alteram comportamento de matching
- **Metacaracteres:** Símbolos especiais (. ^ $ * + ? {} [] () |) com significados específicos
- **Escape System:** Mecanismo para tratar caracteres especiais como literais
- **Performance Impact:** Diferentes flags e metacaracteres têm custos operacionais distintos

**Casos de uso estratégicos:**

- **Validation:** Case-insensitive email, URL e password validation
- **Data Extraction:** Global matching para emails, URLs, hashtags
- **Text Processing:** Multiline cleaning, HTML removal, number extraction
- **Boundary Detection:** Word boundaries para search precision

É **fundamental** compreender as **interações entre flags** e o **comportamento dos metacaracteres** antes de avançar para **character classes**, **quantifiers** e **grouping patterns** mais complexos.