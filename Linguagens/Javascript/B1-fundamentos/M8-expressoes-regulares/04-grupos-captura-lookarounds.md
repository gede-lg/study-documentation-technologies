# Grupos, Captura e Lookarounds em Regex JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Grupos** são **subpadrões** delimitados por parênteses que **organizam** e **capturam** partes específicas do match. **Lookarounds** são **asserções posicionais** que verificam **contexto** sem **consumir caracteres**, permitindo **conditional matching** baseado em **vizinhança textual**.

Funcionam como **estruturas organizacionais** e **sensores contextuais** que transformam regex de **flat pattern matching** para **hierarchical parsing** com **semantic extraction** e **context-aware validation**.

### Problema Fundamental que Resolve

Resolve a necessidade de **structured data extraction**, **conditional matching**, **backreferencing** e **context validation** que são essenciais para **complex parsing**, **data transformation** e **advanced text processing** impossíveis com pattern matching simples.

---

## 📋 Sumário Conceitual

### Tipos de Grupos
- **()** - Capturing groups que armazenam matches
- **(?:)** - Non-capturing groups para organização  
- **(?<name>)** - Named groups para acesso semântico
- **\1, \2** - Backreferences para grupos numerados
- **\k<name>** - Backreferences para grupos nomeados

### Lookaround Assertions
- **(?=)** - Positive lookahead (seguido por)
- **(?!)** - Negative lookahead (não seguido por)
- **(?<=)** - Positive lookbehind (precedido por)
- **(?<!)** - Negative lookbehind (não precedido por)

---

## 🧠 Fundamentos Teóricos

### Sistema de Grupos

#### Análise de Capturing Groups
```javascript
// Demonstração completa de grupos de captura

function analisarCapturingGroups() {
  console.log("=== Análise de Capturing Groups ===");
  
  // BASIC CAPTURING GROUPS
  console.log("=== Basic Capturing Groups ===");
  
  const emailText = 'Contact john.doe@company.com for support';
  const emailPattern = /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  
  const emailMatch = emailText.match(emailPattern);
  console.log("Email pattern match:");
  console.log("  Full match:", emailMatch[0]);
  console.log("  Username (group 1):", emailMatch[1]);
  console.log("  Domain (group 2):", emailMatch[2]);
  console.log("  Match index:", emailMatch.index);
  
  // NESTED GROUPS
  console.log("\n=== Nested Groups ===");
  
  const urlText = 'Visit https://www.example.com:8080/path';
  const urlPattern = /(https?):\/\/(([a-z0-9.-]+)(:[0-9]+)?)(\/.*)?/i;
  
  const urlMatch = urlText.match(urlPattern);
  console.log("URL pattern match:");
  console.log("  Full match:", urlMatch[0]);
  console.log("  Protocol (group 1):", urlMatch[1]);
  console.log("  Host+Port (group 2):", urlMatch[2]);
  console.log("  Hostname (group 3):", urlMatch[3]);
  console.log("  Port (group 4):", urlMatch[4]);
  console.log("  Path (group 5):", urlMatch[5]);
  
  // MULTIPLE MATCHES WITH GROUPS
  console.log("\n=== Multiple Matches with Groups ===");
  
  const phoneText = 'Call (11) 99999-9999 or (21) 88888-8888';
  const phonePattern = /\((\d{2})\) (\d{4,5})-(\d{4})/g;
  
  const phoneMatches = [...phoneText.matchAll(phonePattern)];
  console.log("Phone matches:");
  phoneMatches.forEach((match, index) => {
    console.log(`  Phone ${index + 1}:`);
    console.log(`    Full: ${match[0]}`);
    console.log(`    Area code: ${match[1]}`);
    console.log(`    Number: ${match[2]}-${match[3]}`);
  });
  
  // GROUP NUMBERING WITH NESTING
  console.log("\n=== Group Numbering ===");
  
  const datePattern = /((0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4}))/;
  const dateText = 'Event date: 25/12/2023';
  
  const dateMatch = dateText.match(datePattern);
  console.log("Date pattern groups:");
  dateMatch.forEach((group, index) => {
    console.log(`  Group ${index}: "${group}"`);
  });
  
  // Explanation of group numbering
  console.log("\nGroup explanation:");
  console.log("  Group 0: Full match");
  console.log("  Group 1: Entire date (dd/mm/yyyy)");
  console.log("  Group 2: Day (dd)");
  console.log("  Group 3: Month (mm)");
  console.log("  Group 4: Year (yyyy)");
}

analisarCapturingGroups();

// Non-capturing groups analysis
function analisarNonCapturingGroups() {
  console.log("\n=== Non-Capturing Groups ===");
  
  // PERFORMANCE AND ORGANIZATION
  console.log("=== Performance Comparison ===");
  
  const testText = 'The price is $19.99 and discount is 10%';
  
  // With capturing groups (creates capture overhead)
  const capturingPattern = /(price|discount) (is) (\$?\d+(?:\.\d{2})?%?)/g;
  
  // With non-capturing groups (better performance)
  const nonCapturingPattern = /(?:price|discount) (?:is) (\$?\d+(?:\.\d{2})?%?)/g;
  
  console.log("Capturing groups pattern:");
  const capturingMatches = [...testText.matchAll(capturingPattern)];
  capturingMatches.forEach(match => {
    console.log("  Groups:", match.slice(1));
  });
  
  console.log("Non-capturing groups pattern:");
  const nonCapturingMatches = [...testText.matchAll(nonCapturingPattern)];
  nonCapturingMatches.forEach(match => {
    console.log("  Groups:", match.slice(1));
  });
  
  // ORGANIZATION WITHOUT CAPTURE
  console.log("\n=== Organization Benefits ===");
  
  // Complex pattern with mixed groups
  const complexText = 'user@example.com and admin@company.org';
  const mixedPattern = /(?:([a-z]+)@(example)\.com|([a-z]+)@(company)\.org)/g;
  
  console.log("Mixed capturing/non-capturing groups:");
  const mixedMatches = [...complexText.matchAll(mixedPattern)];
  mixedMatches.forEach((match, index) => {
    console.log(`  Match ${index + 1}:`, {
      full: match[0],
      user1: match[1],
      domain1: match[2], 
      user2: match[3],
      domain2: match[4]
    });
  });
}

analisarNonCapturingGroups();
```

### Named Groups e Backreferences

#### Análise de Grupos Nomeados
```javascript
// Demonstração de named groups e backreferences

function analisarNamedGroups() {
  console.log("\n=== Named Groups e Backreferences ===");
  
  // NAMED GROUPS SYNTAX
  console.log("=== Named Groups Syntax ===");
  
  const personText = 'John Doe born on 1990-05-15';
  const personPattern = /(?<firstName>[A-Z][a-z]+) (?<lastName>[A-Z][a-z]+) born on (?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
  
  const personMatch = personText.match(personPattern);
  console.log("Person data extraction:");
  console.log("  Full match:", personMatch[0]);
  console.log("  Named groups:", personMatch.groups);
  console.log("  First name:", personMatch.groups.firstName);
  console.log("  Last name:", personMatch.groups.lastName);
  console.log("  Birth year:", personMatch.groups.year);
  
  // NUMERIC BACKREFERENCES
  console.log("\n=== Numeric Backreferences ===");
  
  const duplicateText = 'The quick quick brown fox fox jumps';
  const duplicatePattern = /\b(\w+)\s+\1\b/g;
  
  const duplicates = [...duplicateText.matchAll(duplicatePattern)];
  console.log("Duplicate words found:");
  duplicates.forEach(match => {
    console.log(`  "${match[0]}" - word: "${match[1]}"`);
  });
  
  // NAMED BACKREFERENCES
  console.log("\n=== Named Backreferences ===");
  
  const quotedText = 'He said "Hello world" and she replied "Hello world"';
  const quotedPattern = /(?<quote>["'])(?<content>.*?)\k<quote>/g;
  
  const quotes = [...quotedText.matchAll(quotedPattern)];
  console.log("Quoted content:");
  quotes.forEach((match, index) => {
    console.log(`  Quote ${index + 1}:`);
    console.log(`    Full: ${match[0]}`);
    console.log(`    Quote char: ${match.groups.quote}`);
    console.log(`    Content: ${match.groups.content}`);
  });
  
  // HTML TAG MATCHING
  console.log("\n=== HTML Tag Matching ===");
  
  const htmlText = '<div>Content</div> <span>Text</span> <p>Paragraph</p>';
  const htmlPattern = /<(?<tag>[a-z]+)>.*?<\/\k<tag>>/g;
  
  const htmlMatches = [...htmlText.matchAll(htmlPattern)];
  console.log("HTML tags:");
  htmlMatches.forEach(match => {
    console.log(`  ${match[0]} (tag: ${match.groups.tag})`);
  });
  
  // COMPLEX BACKREFERENCE PATTERNS  
  console.log("\n=== Complex Backreference Patterns ===");
  
  // Palindrome detection
  const palindromeText = 'racecar level hello madam';
  const palindromePattern = /\b(\w)(\w?)(\w?)\3\2\1\b/g;
  
  const palindromes = palindromeText.match(palindromePattern);
  console.log("Palindromes found:", palindromes);
  
  // Date format consistency
  const dateText = 'Dates: 2023-12-25, 2023/12/25, 2023.12.25';
  const consistentDatePattern = /\b(\d{4})([-/.])(\d{2})\2(\d{2})\b/g;
  
  const consistentDates = [...dateText.matchAll(consistentDatePattern)];
  console.log("Consistent date formats:");
  consistentDates.forEach(match => {
    console.log(`  ${match[0]} (separator: "${match[2]}")`);
  });
}

analisarNamedGroups();
```

### Lookaround Assertions

#### Análise de Lookahead e Lookbehind
```javascript
// Demonstração completa de lookaround assertions

function analisarLookarounds() {
  console.log("\n=== Lookaround Assertions ===");
  
  // POSITIVE LOOKAHEAD (?=)
  console.log("=== Positive Lookahead (?=) ===");
  
  const passwordText = 'MyPassword123!';
  
  const passwordChecks = {
    'Has lowercase': /(?=.*[a-z])/,
    'Has uppercase': /(?=.*[A-Z])/, 
    'Has digit': /(?=.*\d)/,
    'Has special': /(?=.*[@$!%*?&])/,
    'Min 8 chars': /(?=.{8,})/
  };
  
  console.log(`Password: "${passwordText}"`);
  Object.entries(passwordChecks).forEach(([check, pattern]) => {
    console.log(`  ${check}: ${pattern.test(passwordText) ? '✅' : '❌'}`);
  });
  
  // Strong password with multiple lookaheads
  const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  console.log(`Strong password check: ${strongPasswordPattern.test(passwordText) ? '✅' : '❌'}`);
  
  // NEGATIVE LOOKAHEAD (?!)
  console.log("\n=== Negative Lookahead (?!) ===");
  
  const fileText = 'image.jpg document.pdf script.js backup.tmp';
  
  // Files that are NOT temporary (.tmp)
  const nonTempPattern = /\b\w+\.(?!tmp)\w+\b/g;
  const nonTempFiles = fileText.match(nonTempPattern);
  console.log("Non-temporary files:", nonTempFiles);
  
  // Words that do NOT start with vowels
  const wordText = 'apple banana orange umbrella elephant';
  const nonVowelPattern = /\b(?![aeiou])\w+\b/gi;
  const nonVowelWords = wordText.match(nonVowelPattern);
  console.log("Words not starting with vowels:", nonVowelWords);
  
  // POSITIVE LOOKBEHIND (?<=)
  console.log("\n=== Positive Lookbehind (?<=) ===");
  
  const priceText = 'Price: $19.99, Cost: €25.50, Fee: £10.00';
  
  // Numbers that follow currency symbols
  const currencyPattern = /(?<=[$€£])\d+\.\d{2}/g;
  const prices = priceText.match(currencyPattern);
  console.log("Currency amounts:", prices);
  
  // Words after specific prefixes
  const prefixText = 'Mr. Johnson, Dr. Smith, Ms. Davis';
  const titlePattern = /(?<=(?:Mr|Dr|Ms)\. )\w+/g;
  const names = prefixText.match(titlePattern);
  console.log("Names after titles:", names);
  
  // NEGATIVE LOOKBEHIND (?<!)
  console.log("\n=== Negative Lookbehind (?<!) ===");
  
  const numberText = 'Phone: 555-1234, ID: 98765, Zip: 12345';
  
  // Numbers NOT preceded by "Phone: "
  const nonPhonePattern = /(?<!Phone: )\b\d{3,5}\b/g;
  const nonPhoneNumbers = numberText.match(nonPhonePattern);
  console.log("Non-phone numbers:", nonPhoneNumbers);
  
  // COMPLEX LOOKAROUND COMBINATIONS
  console.log("\n=== Complex Lookaround Combinations ===");
  
  const codeText = 'function test() { return true; } var x = 5;';
  
  // Function names (word after 'function' but before '(')
  const functionPattern = /(?<=function\s+)\w+(?=\s*\()/g;
  const functionNames = codeText.match(functionPattern);
  console.log("Function names:", functionNames);
  
  // Variables (word after 'var' but not followed by '(')
  const variablePattern = /(?<=var\s+)\w+(?!\s*\()/g;
  const variableNames = codeText.match(variablePattern);
  console.log("Variable names:", variableNames);
  
  // Email usernames (before @ but not at start of string)
  const emailsText = 'user@domain.com admin@site.org root@server.net';
  const usernamePattern = /(?<!^)\b\w+(?=@)/g;
  const usernames = emailsText.match(usernamePattern);
  console.log("Email usernames:", usernames);
}

analisarLookarounds();

// Advanced grouping patterns
function analisarPadroesAvancados() {
  console.log("\n=== Padrões Avançados de Agrupamento ===");
  
  // CONDITIONAL EXPRESSIONS (simulated in JavaScript)
  console.log("=== Conditional Logic Simulation ===");
  
  // URL validation with optional parts
  const urlValidationText = 'http://example.com https://secure.site.org/path';
  const flexibleUrlPattern = /(https?):\/\/([a-z0-9.-]+)(?::(\d+))?(?:\/([^\s]*))?/gi;
  
  const urlMatches = [...urlValidationText.matchAll(flexibleUrlPattern)];
  console.log("URL parsing:");
  urlMatches.forEach((match, index) => {
    console.log(`  URL ${index + 1}:`);
    console.log(`    Full: ${match[0]}`);
    console.log(`    Protocol: ${match[1]}`);
    console.log(`    Domain: ${match[2]}`);
    console.log(`    Port: ${match[3] || 'default'}`);
    console.log(`    Path: ${match[4] || '/'}`);
  });
  
  // PARSING WITH MULTIPLE ALTERNATIVES
  console.log("\n=== Multi-Format Parsing ===");
  
  const dateFormats = '2023-12-25 25/12/2023 Dec 25, 2023';
  const multiDatePattern = /(?:(\d{4})-(\d{2})-(\d{2})|(\d{2})\/(\d{2})\/(\d{4})|([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{4}))/g;
  
  const dateMatches = [...dateFormats.matchAll(multiDatePattern)];
  console.log("Multi-format date parsing:");
  dateMatches.forEach((match, index) => {
    console.log(`  Date ${index + 1}: ${match[0]}`);
    
    if (match[1]) { // ISO format
      console.log(`    Format: ISO (YYYY-MM-DD)`);
      console.log(`    Year: ${match[1]}, Month: ${match[2]}, Day: ${match[3]}`);
    } else if (match[4]) { // DD/MM/YYYY format
      console.log(`    Format: European (DD/MM/YYYY)`);
      console.log(`    Day: ${match[4]}, Month: ${match[5]}, Year: ${match[6]}`);
    } else if (match[7]) { // Month DD, YYYY format
      console.log(`    Format: US (Mon DD, YYYY)`);
      console.log(`    Month: ${match[7]}, Day: ${match[8]}, Year: ${match[9]}`);
    }
  });
  
  // PERFORMANCE ANALYSIS
  console.log("\n=== Performance Analysis ===");
  
  const testText = 'Performance test with various patterns and groups'.repeat(1000);
  const iterations = 1000;
  
  const patterns = [
    { name: 'No groups', regex: /\w+/g },
    { name: 'Capturing groups', regex: /(\w+)/g },
    { name: 'Non-capturing groups', regex: /(?:\w+)/g },
    { name: 'Named groups', regex: /(?<word>\w+)/g },
    { name: 'With lookahead', regex: /\w+(?=\s)/g }
  ];
  
  patterns.forEach(({ name, regex }) => {
    console.time(name);
    for (let i = 0; i < iterations; i++) {
      testText.match(regex);
    }
    console.timeEnd(name);
  });
}

analisarPadroesAvancados();
```

---

## 🎯 Aplicabilidade e Contextos

### Casos de Uso Avançados

```javascript
// Implementação de casos de uso complexos com grupos e lookarounds

class AdvancedRegexPatterns {
  // Data extraction with named groups
  static extractStructuredData(text) {
    const patterns = {
      // Contact information
      contact: /(?<name>[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*(?<email>[^\s@]+@[^\s@]+\.[^\s@]+),?\s*(?<phone>[\+]?[\d\s\-\(\)]{10,})/g,
      
      // Addresses
      address: /(?<street>\d+\s+[A-Za-z\s]+),\s*(?<city>[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*(?<state>[A-Z]{2})\s+(?<zip>\d{5}(?:-\d{4})?)/g,
      
      // Dates in multiple formats
      date: /(?:(?<year1>\d{4})-(?<month1>\d{2})-(?<day1>\d{2})|(?<month2>\d{1,2})\/(?<day2>\d{1,2})\/(?<year2>\d{4})|(?<monthName>[A-Za-z]{3,9})\s+(?<dayNum>\d{1,2}),?\s+(?<yearNum>\d{4}))/g,
      
      // URLs with components
      url: /(?<protocol>https?):\/\/(?<domain>[a-z0-9.-]+)(?::(?<port>\d+))?(?<path>\/[^\s]*)?(?:\?(?<query>[^\s#]*))?(?:#(?<fragment>[^\s]*))?/gi
    };
    
    const results = {};
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      const matches = [...text.matchAll(pattern)];
      results[type] = matches.map(match => ({
        full: match[0],
        groups: match.groups,
        index: match.index
      }));
    });
    
    return results;
  }
  
  // Password validation with multiple criteria
  static validatePassword(password) {
    const criteria = {
      length: {
        pattern: /^.{8,}$/,
        message: "At least 8 characters"
      },
      lowercase: {
        pattern: /(?=.*[a-z])/,
        message: "At least one lowercase letter"
      },
      uppercase: {
        pattern: /(?=.*[A-Z])/,
        message: "At least one uppercase letter"
      },
      digit: {
        pattern: /(?=.*\d)/,
        message: "At least one digit"
      },
      special: {
        pattern: /(?=.*[@$!%*?&])/,
        message: "At least one special character (@$!%*?&)"
      },
      noSpaces: {
        pattern: /^(?!.*\s)/,
        message: "No spaces allowed"
      },
      noSequential: {
        pattern: /^(?!.*(?:123|abc|ABC))/i,
        message: "No sequential characters (123, abc)"
      }
    };
    
    const results = {};
    let isValid = true;
    
    Object.entries(criteria).forEach(([key, { pattern, message }]) => {
      const passes = pattern.test(password);
      results[key] = { passes, message };
      if (!passes) isValid = false;
    });
    
    return { isValid, criteria: results };
  }
  
  // Code parsing with groups
  static parseCode(code) {
    const patterns = {
      // Functions: function name(params) { }
      functions: /(?<type>function|const|let|var)?\s*(?<name>\w+)\s*(?<arrow>=>\s*)?(?:\((?<params>[^)]*)\))?\s*(?<body>\{[^}]*\}|\w+|.*)/g,
      
      // Variables: var/let/const name = value
      variables: /(?<type>var|let|const)\s+(?<name>\w+)(?:\s*=\s*(?<value>[^;]+))?;?/g,
      
      // Comments: // or /* */
      comments: /(?:\/\/(?<singleLine>.*)|\/\*(?<multiLine>[\s\S]*?)\*\/)/g,
      
      // Strings: "text" or 'text'
      strings: /(?<quote>["'`])(?<content>(?:\\.|(?!\k<quote>).)*)?\k<quote>/g
    };
    
    const results = {};
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      results[type] = [...code.matchAll(pattern)].map(match => ({
        full: match[0],
        groups: match.groups,
        index: match.index
      }));
    });
    
    return results;
  }
  
  // HTML/XML parsing with balanced tags
  static parseHtml(html) {
    const patterns = {
      // Self-closing tags
      selfClosing: /<(?<tag>\w+)(?:\s+(?<attributes>[^>]*?))?\/>/g,
      
      // Opening tags
      opening: /<(?<tag>\w+)(?:\s+(?<attributes>[^>]*?))?>/g,
      
      // Closing tags
      closing: /<\/(?<tag>\w+)>/g,
      
      // Balanced pairs (simplified)
      balanced: /<(?<tag>\w+)(?:\s+[^>]*)?>(?<content>.*?)<\/\k<tag>>/gs,
      
      // Attributes
      attributes: /(?<name>\w+)(?:=(?<quote>["'])(?<value>.*?)\k<quote>|=(?<unquoted>\w+))?/g
    };
    
    const results = {};
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      results[type] = [...html.matchAll(pattern)].map(match => ({
        full: match[0],
        groups: match.groups,
        index: match.index
      }));
    });
    
    return results;
  }
}

// Demonstração de casos avançados
function demonstrarCasosAvancados() {
  console.log("\n=== Casos de Uso Avançados ===");
  
  // Structured data extraction
  console.log("=== Structured Data Extraction ===");
  
  const contactText = `
    John Smith, john@company.com, +1-555-123-4567
    Contact: Mary Johnson mary.johnson@email.com (555) 987-6543
    Address: 123 Main Street, New York, NY 10001
    Date: 2023-12-25 or 12/25/2023
    Website: https://example.com:8080/path?query=value#section
  `;
  
  const extractedData = AdvancedRegexPatterns.extractStructuredData(contactText);
  
  Object.entries(extractedData).forEach(([type, items]) => {
    console.log(`${type}:`);
    items.forEach((item, index) => {
      console.log(`  ${index + 1}: ${item.full}`);
      if (Object.keys(item.groups).length > 0) {
        console.log(`     Groups:`, item.groups);
      }
    });
  });
  
  // Password validation
  console.log("\n=== Password Validation ===");
  
  const testPasswords = [
    'weak',
    'StrongPass123!',
    'NoSpecial123',
    'short1A!',
    'HasSpaces 123!A'
  ];
  
  testPasswords.forEach(password => {
    const validation = AdvancedRegexPatterns.validatePassword(password);
    console.log(`\nPassword: "${password}"`);
    console.log(`Valid: ${validation.isValid ? '✅' : '❌'}`);
    
    Object.entries(validation.criteria).forEach(([key, { passes, message }]) => {
      console.log(`  ${message}: ${passes ? '✅' : '❌'}`);
    });
  });
  
  // Code parsing
  console.log("\n=== Code Parsing ===");
  
  const sampleCode = `
    function calculateTotal(price, tax) {
      const result = price * (1 + tax);
      return result;
    }
    
    const discount = 0.1; // 10% discount
    let finalPrice = calculateTotal(100, 0.08);
  `;
  
  const parsedCode = AdvancedRegexPatterns.parseCode(sampleCode);
  
  Object.entries(parsedCode).forEach(([type, items]) => {
    console.log(`${type}:`);
    items.forEach(item => {
      console.log(`  ${item.full.trim()}`);
      if (item.groups) {
        console.log(`    Groups:`, item.groups);
      }
    });
  });
}

demonstrarCasosAvancados();
```

---

## 📚 Conclusão

**Grupos** e **Lookarounds** são **ferramentas avançadas** que elevam regex de **simple pattern matching** para **structured parsing** e **context-aware validation**, oferecendo **semantic extraction** e **conditional logic** essenciais para **complex text processing**.

**Características distintivas:**

- **Capturing Groups:** Extraction e backreferencing com () e named (?<name>)
- **Non-capturing Groups:** Organization sem overhead de captura (?:)
- **Lookarounds:** Context validation sem character consumption
- **Backreferences:** Pattern consistency com \1 e \k<name>

**Casos de uso estratégicos:**

- **Data Extraction:** Structured parsing de contacts, URLs, code
- **Validation:** Password strength, format consistency
- **Text Processing:** HTML parsing, code analysis, content transformation
- **Context Matching:** Conditional patterns baseados em neighborhood

Dominar **grupos** e **lookarounds** é **essencial** para **professional regex usage** em **parsing**, **validation** e **advanced text processing** que são **fundamentais** em **modern web development** e **data processing applications**.