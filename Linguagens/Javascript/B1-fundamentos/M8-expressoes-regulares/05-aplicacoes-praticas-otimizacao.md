# Aplicações Práticas e Otimização de Regex JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Aplicações Práticas** representam a **implementação real** de expressões regulares em **cenários profissionais**, envolvendo **validation**, **parsing**, **data extraction** e **text processing**. **Otimização** aborda **performance tuning**, **catastrophic backtracking prevention** e **maintainable pattern design**.

Constituem a **bridge** entre **theoretical regex knowledge** e **production-ready implementations** que lidam com **real-world data complexity**, **performance constraints** e **maintainability requirements** em **enterprise applications**.

### Problema Fundamental que Resolve

Resolve a **gap** entre **academic regex patterns** e **production deployment**, oferecendo **robust solutions** para **form validation**, **data parsing**, **content filtering** e **performance optimization** que são **críticos** para **user experience** e **system reliability**.

---

## 📋 Sumário Conceitual

### Aplicações Práticas
- **Form Validation** - Email, phone, password, URL patterns
- **Data Parsing** - Log files, CSV, structured text extraction
- **Content Processing** - HTML/XML parsing, markdown processing
- **Security** - Input sanitization, XSS prevention

### Otimização
- **Performance Tuning** - Quantifier optimization, anchoring
- **Backtracking Prevention** - Atomic groups, possessive quantifiers
- **Memory Management** - Pattern compilation, caching strategies
- **Maintainability** - Readable patterns, documentation

---

## 🧠 Fundamentos Teóricos

### Form Validation Patterns

#### Análise de Validação Completa
```javascript
// Sistema completo de validação de formulários com regex

class FormValidator {
  constructor() {
    this.patterns = {
      // EMAIL VALIDATION
      email: {
        basic: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        comprehensive: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        strict: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
      },
      
      // PHONE NUMBER VALIDATION
      phone: {
        brazilian: /^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)(?:9\s?)?\d{4}-?\d{4}$/,
        us: /^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
        international: /^\+(?:[0-9]\s?){6,14}[0-9]$/
      },
      
      // PASSWORD VALIDATION
      password: {
        weak: /^.{6,}$/,
        medium: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
        strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        veryStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?!.*(.)\1{2,})[A-Za-z\d@$!%*?&]{12,}$/
      },
      
      // URL VALIDATION
      url: {
        basic: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
        comprehensive: /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/,
        strict: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/
      },
      
      // CREDIT CARD VALIDATION
      creditCard: {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        general: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/
      },
      
      // DATE VALIDATION
      date: {
        iso: /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/,
        us: /^(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
        european: /^(?:0[1-9]|[12][0-9]|3[01])\/(?:0[1-9]|1[0-2])\/\d{4}$/,
        flexible: /^(?:\d{4}[-/.](?:0[1-9]|1[0-2])[-/.](?:0[1-9]|[12][0-9]|3[01])|(?:0[1-9]|1[0-2])[-/.](?:0[1-9]|[12][0-9]|3[01])[-/.]\d{4})$/
      }
    };
    
    this.errorMessages = {
      email: {
        basic: "Please enter a valid email address",
        comprehensive: "Email format is invalid",
        strict: "Email does not meet RFC 5322 standards"
      },
      phone: {
        brazilian: "Please enter a valid Brazilian phone number",
        us: "Please enter a valid US phone number", 
        international: "Please enter a valid international phone number"
      },
      password: {
        weak: "Password must be at least 6 characters",
        medium: "Password must contain letters and numbers (8+ chars)",
        strong: "Password must contain lowercase, uppercase, numbers and special characters (8+ chars)",
        veryStrong: "Password must be very strong with no repeating characters (12+ chars)"
      }
    };
  }
  
  validate(field, value, strength = 'basic') {
    const pattern = this.patterns[field]?.[strength];
    const message = this.errorMessages[field]?.[strength];
    
    if (!pattern) {
      throw new Error(`Unknown validation pattern: ${field}.${strength}`);
    }
    
    const isValid = pattern.test(value);
    
    return {
      isValid,
      message: isValid ? null : message,
      pattern: pattern.source,
      value
    };
  }
  
  validateMultiple(data, rules) {
    const results = {};
    let allValid = true;
    
    Object.entries(rules).forEach(([field, rule]) => {
      const value = data[field];
      const [type, strength = 'basic'] = rule.split('.');
      
      const result = this.validate(type, value, strength);
      results[field] = result;
      
      if (!result.isValid) {
        allValid = false;
      }
    });
    
    return { allValid, results };
  }
}

// Demonstração de validação de formulários
function demonstrarValidacaoFormularios() {
  console.log("=== Form Validation Demo ===");
  
  const validator = new FormValidator();
  
  // Test data
  const testData = {
    email: 'user@example.com',
    phone: '(11) 99999-9999',
    password: 'StrongPass123!',
    url: 'https://example.com/path',
    creditCard: '4532015112830366'
  };
  
  const validationRules = {
    email: 'email.comprehensive',
    phone: 'phone.brazilian',
    password: 'password.strong',
    url: 'url.comprehensive',
    creditCard: 'creditCard.visa'
  };
  
  console.log("Test Data:", testData);
  console.log("Validation Rules:", validationRules);
  
  const validationResults = validator.validateMultiple(testData, validationRules);
  
  console.log("\n=== Validation Results ===");
  console.log("All Valid:", validationResults.allValid);
  
  Object.entries(validationResults.results).forEach(([field, result]) => {
    console.log(`\n${field}:`);
    console.log(`  Value: "${result.value}"`);
    console.log(`  Valid: ${result.isValid ? '✅' : '❌'}`);
    console.log(`  Message: ${result.message || 'Valid'}`);
    console.log(`  Pattern: /${result.pattern}/`);
  });
  
  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  
  const testEmails = [
    'test@example.com',
    'user.name+tag@example.com',
    'invalid.email',
    'very.long.email.address.that.might.cause.performance.issues@very.long.domain.name.example.com'
  ];
  
  const emailPatterns = ['basic', 'comprehensive', 'strict'];
  
  emailPatterns.forEach(strength => {
    console.log(`\n${strength} pattern performance:`);
    
    testEmails.forEach(email => {
      console.time(`  ${email}`);
      for (let i = 0; i < 1000; i++) {
        validator.validate('email', email, strength);
      }
      console.timeEnd(`  ${email}`);
    });
  });
}

demonstrarValidacaoFormularios();
```

### Data Parsing e Extraction

#### Análise de Parsing Avançado
```javascript
// Sistema avançado de parsing e extração de dados

class DataParser {
  constructor() {
    this.logPatterns = {
      // Apache access log
      apache: /^(?<ip>\d+\.\d+\.\d+\.\d+) - (?<user>\S+) \[(?<timestamp>[^\]]+)\] "(?<method>\w+) (?<path>\S+) (?<protocol>HTTP\/[\d.]+)" (?<status>\d+) (?<size>\d+|-) "(?<referer>[^"]*)" "(?<userAgent>[^"]*)"$/,
      
      // Application log (custom format)
      application: /^\[(?<level>\w+)\] (?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (?<component>\w+): (?<message>.+)$/,
      
      // Error log
      error: /^(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) \[(?<thread>[^\]]+)\] (?<level>\w+)\s+(?<logger>\S+) - (?<message>.+)$/
    };
    
    this.csvPatterns = {
      // Simple CSV (no escaping)
      simple: /(?:^|,)([^,\n\r]*)/g,
      
      // RFC 4180 compliant CSV
      rfc4180: /(?:^|,)(?:"([^"]*)"|([^",\n\r]*))/g,
      
      // CSV with custom delimiter
      custom: (delimiter) => new RegExp(`(?:^|\\${delimiter})(?:"([^"]*)"|([^"${delimiter}\\n\\r]*))`, 'g')
    };
    
    this.codePatterns = {
      // JavaScript function extraction
      jsFunction: /(?<type>function|const|let|var)?\s*(?<name>\w+)\s*(?<arrow>=>\s*)?(?:\((?<params>[^)]*)\))?\s*(?<body>\{[\s\S]*?\}|[^;]+;?)/g,
      
      // Import/Export statements
      imports: /^(?<type>import|export)\s+(?:(?<default>\w+)|(?:\{(?<named>[^}]+)\})|\*)?\s*(?:from\s+)?(?<source>["'][^"']+["'])?/gm,
      
      // CSS rules
      cssRule: /(?<selector>[^{]+)\s*\{\s*(?<properties>[^}]*)\s*\}/g,
      
      // HTML elements
      htmlElement: /<(?<tag>\w+)(?:\s+(?<attributes>[^>]*))?>(?<content>.*?)<\/\k<tag>>|<(?<selfClosingTag>\w+)(?:\s+(?<selfClosingAttributes>[^>]*))?\s*\/?>/gs
    };
  }
  
  parseLogFile(logContent, format = 'apache') {
    const pattern = this.logPatterns[format];
    if (!pattern) {
      throw new Error(`Unknown log format: ${format}`);
    }
    
    const lines = logContent.split('\n').filter(line => line.trim());
    const parsed = [];
    const errors = [];
    
    lines.forEach((line, index) => {
      const match = line.match(pattern);
      if (match && match.groups) {
        parsed.push({
          lineNumber: index + 1,
          raw: line,
          parsed: match.groups
        });
      } else {
        errors.push({
          lineNumber: index + 1,
          raw: line,
          error: 'Failed to parse'
        });
      }
    });
    
    return { parsed, errors, totalLines: lines.length };
  }
  
  parseCsv(csvContent, options = {}) {
    const { delimiter = ',', hasHeader = true, strict = false } = options;
    
    const pattern = delimiter === ',' ? 
      (strict ? this.csvPatterns.rfc4180 : this.csvPatterns.simple) :
      this.csvPatterns.custom(delimiter);
    
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
    const result = [];
    let headers = null;
    
    lines.forEach((line, lineIndex) => {
      const fields = [];
      let match;
      
      // Reset regex lastIndex for each line
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(line)) !== null) {
        // Handle quoted vs unquoted fields
        const field = match[1] !== undefined ? match[1] : match[2] || '';
        fields.push(field.trim());
      }
      
      if (lineIndex === 0 && hasHeader) {
        headers = fields;
      } else {
        const rowData = hasHeader && headers ? 
          Object.fromEntries(headers.map((header, i) => [header, fields[i] || ''])) :
          fields;
        
        result.push({
          lineNumber: lineIndex + 1,
          data: rowData
        });
      }
    });
    
    return { headers, data: result, totalRows: result.length };
  }
  
  extractCodeElements(code, language = 'javascript') {
    const patterns = language === 'javascript' ? 
      { functions: this.codePatterns.jsFunction, imports: this.codePatterns.imports } :
      language === 'css' ?
      { rules: this.codePatterns.cssRule } :
      { elements: this.codePatterns.htmlElement };
    
    const result = {};
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      const matches = [...code.matchAll(pattern)];
      result[type] = matches.map(match => ({
        full: match[0],
        groups: match.groups || {},
        index: match.index,
        length: match[0].length
      }));
    });
    
    return result;
  }
  
  extractUrls(text) {
    const urlPattern = /(?<protocol>https?):\/\/(?<domain>(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?::(?<port>\d+))?(?<path>\/[^\s]*)?/g;
    const emailPattern = /(?<email>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const phonePattern = /(?<phone>(?:\+\d{1,3}[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g;
    
    return {
      urls: [...text.matchAll(urlPattern)].map(m => ({
        full: m[0],
        ...m.groups,
        index: m.index
      })),
      emails: [...text.matchAll(emailPattern)].map(m => ({
        full: m[0],
        ...m.groups,
        index: m.index
      })),
      phones: [...text.matchAll(phonePattern)].map(m => ({
        full: m[0],
        ...m.groups,
        index: m.index
      }))
    };
  }
}

// Demonstração de parsing de dados
function demonstrarDataParsing() {
  console.log("\n=== Data Parsing Demo ===");
  
  const parser = new DataParser();
  
  // Log parsing
  console.log("=== Log File Parsing ===");
  
  const sampleLog = `
192.168.1.1 - - [10/Oct/2023:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326 "http://example.com" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
192.168.1.2 - user [10/Oct/2023:13:55:37 +0000] "POST /api/login HTTP/1.1" 401 0 "-" "curl/7.68.0"
  `;
  
  const logResult = parser.parseLogFile(sampleLog.trim());
  console.log("Log parsing results:");
  console.log(`  Parsed: ${logResult.parsed.length}/${logResult.totalLines} lines`);
  console.log(`  Errors: ${logResult.errors.length} lines`);
  
  logResult.parsed.forEach(entry => {
    console.log(`  Line ${entry.lineNumber}:`);
    console.log(`    IP: ${entry.parsed.ip}`);
    console.log(`    Method: ${entry.parsed.method}`);
    console.log(`    Path: ${entry.parsed.path}`);
    console.log(`    Status: ${entry.parsed.status}`);
  });
  
  // CSV parsing
  console.log("\n=== CSV Parsing ===");
  
  const sampleCsv = `name,age,city
"John Doe",30,"New York"
Jane Smith,25,Boston
"Bob, Jr.",35,"Los Angeles"`;
  
  const csvResult = parser.parseCsv(sampleCsv, { hasHeader: true, strict: true });
  console.log("CSV parsing results:");
  console.log(`  Headers: ${csvResult.headers.join(', ')}`);
  console.log(`  Rows: ${csvResult.totalRows}`);
  
  csvResult.data.forEach(row => {
    console.log(`  Row ${row.lineNumber}:`, row.data);
  });
  
  // Code extraction
  console.log("\n=== Code Element Extraction ===");
  
  const sampleCode = `
import { Component } from 'react';
export default function MyComponent() {
  const handleClick = () => {
    console.log('clicked');
  };
  return <div onClick={handleClick}>Hello</div>;
}`;
  
  const codeResult = parser.extractCodeElements(sampleCode, 'javascript');
  console.log("Code extraction results:");
  
  Object.entries(codeResult).forEach(([type, elements]) => {
    console.log(`  ${type}:`);
    elements.forEach(element => {
      console.log(`    ${element.full.replace(/\n/g, '\\n')}`);
      if (Object.keys(element.groups).length > 0) {
        console.log(`      Groups:`, element.groups);
      }
    });
  });
  
  // URL/Email/Phone extraction
  console.log("\n=== Contact Information Extraction ===");
  
  const contactText = `
Visit our website at https://example.com:8080/contact
Email us at support@example.com or info@company.org
Call us at +1-555-123-4567 or (555) 987-6543
  `;
  
  const extractionResult = parser.extractUrls(contactText);
  
  console.log("Extraction results:");
  Object.entries(extractionResult).forEach(([type, items]) => {
    console.log(`  ${type}:`);
    items.forEach(item => {
      console.log(`    ${item.full} (at position ${item.index})`);
    });
  });
}

demonstrarDataParsing();
```

### Performance Optimization

#### Análise de Otimização Avançada
```javascript
// Sistema de otimização de performance para regex

class RegexOptimizer {
  constructor() {
    this.optimizationStrategies = {
      // Anchoring patterns
      anchoring: {
        description: "Use ^ and $ to anchor patterns and avoid unnecessary scanning",
        examples: [
          { bad: /\d{3}-\d{2}-\d{4}/, good: /^\d{3}-\d{2}-\d{4}$/, context: "SSN validation" },
          { bad: /https?:\/\//, good: /^https?:\/\//, context: "URL prefix check" }
        ]
      },
      
      // Quantifier optimization
      quantifiers: {
        description: "Use specific quantifiers instead of greedy ones when possible",
        examples: [
          { bad: /.*\.jpg$/, good: /[^.]*\.jpg$/, context: "File extension matching" },
          { bad: /.+@.+\..+/, good: /[^@\s]+@[^@\s]+\.[^@\s]+/, context: "Email validation" }
        ]
      },
      
      // Character class optimization
      characterClasses: {
        description: "Use specific character classes instead of broad ones",
        examples: [
          { bad: /./, good: /[^\n]/, context: "Any character except newline" },
          { bad: /[a-zA-Z0-9_]/, good: /\w/, context: "Word characters" },
          { bad: /[0-9]/, good: /\d/, context: "Digits" }
        ]
      },
      
      // Alternation optimization
      alternation: {
        description: "Order alternations by frequency and use non-capturing groups",
        examples: [
          { bad: /(jpg|jpeg|png|gif|bmp)/, good: /(jpg|png|gif|jpeg|bmp)/, context: "Order by frequency" },
          { bad: /(cat|dog)/, good: /(?:cat|dog)/, context: "Non-capturing when no backreference needed" }
        ]
      }
    };
    
    this.antiPatterns = {
      // Catastrophic backtracking patterns
      catastrophicBacktracking: [
        { pattern: /(a+)+b/, description: "Nested quantifiers", example: "aaaaaaaaaaaaaaaaaaaaX" },
        { pattern: /(a|a)*b/, description: "Alternation with overlap", example: "aaaaaaaaaaaaaaaaaaaaX" },
        { pattern: /a*a*b/, description: "Multiple quantifiers", example: "aaaaaaaaaaaaaaaaaaaaX" }
      ],
      
      // Inefficient patterns
      inefficient: [
        { pattern: /.*foo.*bar.*/, description: "Multiple .* in sequence", better: /(?=.*foo)(?=.*bar)/ },
        { pattern: /[aeiou][aeiou]/, description: "Repeated character classes", better: /[aeiou]{2}/ },
        { pattern: /.{0,1}/, description: "Unnecessary quantifier", better: /.?/ }
      ]
    };
  }
  
  benchmarkPatterns(patterns, testStrings, iterations = 1000) {
    const results = {};
    
    patterns.forEach(({ name, pattern, flags }) => {
      const regex = new RegExp(pattern, flags);
      const times = [];
      
      testStrings.forEach(testString => {
        const start = performance.now();
        
        for (let i = 0; i < iterations; i++) {
          regex.test(testString);
          // Reset lastIndex for global patterns
          if (regex.global) regex.lastIndex = 0;
        }
        
        const end = performance.now();
        times.push(end - start);
      });
      
      results[name] = {
        pattern: pattern,
        flags: flags,
        averageTime: times.reduce((a, b) => a + b, 0) / times.length,
        totalTime: times.reduce((a, b) => a + b, 0),
        times: times
      };
    });
    
    return results;
  }
  
  analyzePattern(pattern, flags = '') {
    const regex = new RegExp(pattern, flags);
    const analysis = {
      pattern: pattern,
      flags: flags,
      issues: [],
      suggestions: [],
      complexity: this.calculateComplexity(pattern),
      riskLevel: 'low'
    };
    
    // Check for catastrophic backtracking patterns
    this.antiPatterns.catastrophicBacktracking.forEach(antiPattern => {
      if (pattern.includes(antiPattern.pattern.source.replace(/[()]/g, ''))) {
        analysis.issues.push({
          type: 'catastrophic-backtracking',
          description: antiPattern.description,
          severity: 'high',
          example: antiPattern.example
        });
        analysis.riskLevel = 'high';
      }
    });
    
    // Check for inefficient patterns
    this.antiPatterns.inefficient.forEach(antiPattern => {
      if (pattern.includes(antiPattern.pattern.source)) {
        analysis.issues.push({
          type: 'inefficient',
          description: antiPattern.description,
          severity: 'medium',
          suggestion: antiPattern.better?.source
        });
        if (analysis.riskLevel === 'low') analysis.riskLevel = 'medium';
      }
    });
    
    // Check for missing anchors
    if (!pattern.startsWith('^') && !pattern.endsWith('$') && 
        !pattern.includes('\\b') && pattern.length > 5) {
      analysis.suggestions.push({
        type: 'anchoring',
        description: 'Consider adding anchors (^ $) or word boundaries (\\b) for better performance',
        severity: 'low'
      });
    }
    
    // Check for unnecessary capturing groups
    const capturingGroups = (pattern.match(/\([^?]/g) || []).length;
    const totalGroups = (pattern.match(/\(/g) || []).length;
    
    if (capturingGroups > 0 && capturingGroups === totalGroups) {
      analysis.suggestions.push({
        type: 'capturing-groups',
        description: `Consider using non-capturing groups (?:) if backreferences aren't needed`,
        severity: 'low',
        details: `Found ${capturingGroups} capturing groups`
      });
    }
    
    return analysis;
  }
  
  calculateComplexity(pattern) {
    let complexity = 0;
    
    // Count quantifiers
    complexity += (pattern.match(/[*+?{}]/g) || []).length * 2;
    
    // Count alternations
    complexity += (pattern.match(/\|/g) || []).length * 3;
    
    // Count lookarounds
    complexity += (pattern.match(/\(\?[=!<]/g) || []).length * 4;
    
    // Count character classes
    complexity += (pattern.match(/\[[^\]]+\]/g) || []).length;
    
    // Count escapes
    complexity += (pattern.match(/\\./g) || []).length * 0.5;
    
    return Math.round(complexity);
  }
  
  optimizePattern(pattern, flags = '') {
    let optimized = pattern;
    const optimizations = [];
    
    // Replace common inefficient patterns
    const replacements = [
      { from: /\.\*/g, to: '[^\\n]*', desc: 'Replace .* with [^\\n]* for single-line matching' },
      { from: /\[a-zA-Z0-9_\]/g, to: '\\w', desc: 'Use \\w instead of [a-zA-Z0-9_]' },
      { from: /\[0-9\]/g, to: '\\d', desc: 'Use \\d instead of [0-9]' },
      { from: /\[\^\\n\]\*/g, to: '.*', desc: 'Revert to .* if multiline not needed' }
    ];
    
    replacements.forEach(({ from, to, desc }) => {
      const originalLength = optimized.length;
      optimized = optimized.replace(from, to);
      if (optimized.length !== originalLength) {
        optimizations.push(desc);
      }
    });
    
    // Add anchors for validation patterns
    if (!optimized.startsWith('^') && !optimized.endsWith('$') && 
        optimizations.length === 0) {
      optimized = `^${optimized}$`;
      optimizations.push('Added anchors for validation');
    }
    
    return {
      original: pattern,
      optimized: optimized,
      optimizations: optimizations,
      originalComplexity: this.calculateComplexity(pattern),
      optimizedComplexity: this.calculateComplexity(optimized)
    };
  }
}

// Demonstração de otimização de performance
function demonstrarOptimizacao() {
  console.log("\n=== Regex Performance Optimization ===");
  
  const optimizer = new RegexOptimizer();
  
  // Benchmark comparison
  console.log("=== Performance Benchmarks ===");
  
  const testPatterns = [
    { name: 'Unanchored Email', pattern: '[\\w._%+-]+@[\\w.-]+\\.[A-Za-z]{2,}', flags: '' },
    { name: 'Anchored Email', pattern: '^[\\w._%+-]+@[\\w.-]+\\.[A-Za-z]{2,}$', flags: '' },
    { name: 'Greedy Dot', pattern: '.*\\.jpg$', flags: '' },
    { name: 'Optimized Extension', pattern: '[^.]*\\.jpg$', flags: '' },
    { name: 'Capturing Groups', pattern: '(\\w+)@(\\w+)\\.(\\w+)', flags: '' },
    { name: 'Non-Capturing', pattern: '(?:\\w+)@(?:\\w+)\\.(?:\\w+)', flags: '' }
  ];
  
  const testStrings = [
    'user@example.com',
    'invalid.email.without.at.symbol',
    'photo.jpg',
    'document.pdf.jpg',
    'very.long.string.that.should.not.match.the.pattern.at.all'
  ];
  
  const benchmarkResults = optimizer.benchmarkPatterns(testPatterns, testStrings, 1000);
  
  console.log("Benchmark Results (milliseconds):");
  Object.entries(benchmarkResults).forEach(([name, result]) => {
    console.log(`  ${name}:`);
    console.log(`    Pattern: /${result.pattern}/${result.flags}`);
    console.log(`    Average time: ${result.averageTime.toFixed(4)}ms`);
    console.log(`    Total time: ${result.totalTime.toFixed(4)}ms`);
  });
  
  // Pattern analysis
  console.log("\n=== Pattern Analysis ===");
  
  const problematicPatterns = [
    '(a+)+b',           // Catastrophic backtracking
    '.*foo.*bar.*',     // Multiple greedy quantifiers
    '(\\w+)@(\\w+)',    // Unnecessary capturing
    '[a-zA-Z0-9_]+',    // Inefficient character class
    '\\d{3}-\\d{2}-\\d{4}' // Missing anchors
  ];
  
  problematicPatterns.forEach(pattern => {
    console.log(`\nAnalyzing: /${pattern}/`);
    const analysis = optimizer.analyzePattern(pattern);
    
    console.log(`  Complexity: ${analysis.complexity}`);
    console.log(`  Risk Level: ${analysis.riskLevel}`);
    
    if (analysis.issues.length > 0) {
      console.log("  Issues:");
      analysis.issues.forEach(issue => {
        console.log(`    ${issue.severity.toUpperCase()}: ${issue.description}`);
        if (issue.suggestion) {
          console.log(`      Suggestion: ${issue.suggestion}`);
        }
      });
    }
    
    if (analysis.suggestions.length > 0) {
      console.log("  Suggestions:");
      analysis.suggestions.forEach(suggestion => {
        console.log(`    ${suggestion.description}`);
      });
    }
  });
  
  // Pattern optimization
  console.log("\n=== Pattern Optimization ===");
  
  const patternsToOptimize = [
    '.*\\.jpg$',
    '[a-zA-Z0-9_]+@[a-zA-Z0-9_.-]+\\.[a-zA-Z]{2,}',
    '(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})',
    '.*foo.*bar.*'
  ];
  
  patternsToOptimize.forEach(pattern => {
    console.log(`\nOptimizing: /${pattern}/`);
    const optimization = optimizer.optimizePattern(pattern);
    
    console.log(`  Original: /${optimization.original}/`);
    console.log(`  Optimized: /${optimization.optimized}/`);
    console.log(`  Complexity: ${optimization.originalComplexity} → ${optimization.optimizedComplexity}`);
    
    if (optimization.optimizations.length > 0) {
      console.log("  Optimizations applied:");
      optimization.optimizations.forEach(opt => {
        console.log(`    - ${opt}`);
      });
    }
  });
  
  // Catastrophic backtracking demonstration
  console.log("\n=== Catastrophic Backtracking Prevention ===");
  
  const catastrophicPattern = /(a+)+b/;
  const safePattern = /a+b/;
  const testInput = 'a'.repeat(20) + 'X'; // No 'b' at the end
  
  console.log("Testing catastrophic vs safe patterns:");
  console.log(`Input: "${'a'.repeat(20)}X" (20 a's + X)`);
  
  try {
    console.time('Catastrophic pattern');
    catastrophicPattern.test(testInput);
    console.timeEnd('Catastrophic pattern');
  } catch (e) {
    console.log('Catastrophic pattern: Timed out or error');
  }
  
  console.time('Safe pattern');
  safePattern.test(testInput);
  console.timeEnd('Safe pattern');
  
  console.log("\nNote: The catastrophic pattern may take significantly longer or timeout");
  console.log("Always test regex patterns with edge cases and long inputs");
}

demonstrarOptimizacao();
```

---

## 🎯 Aplicabilidade e Contextos

### Casos de Uso Enterprise

```javascript
// Implementação de casos de uso enterprise com regex otimizado

class EnterpriseRegexSuite {
  // Security-focused input validation
  static createSecurityValidator() {
    return {
      // SQL injection prevention
      sqlInjection: {
        pattern: /(?:union|select|insert|update|delete|drop|exec|script|javascript|vbscript|onload|onerror)/i,
        validate: (input) => !this.sqlInjection.pattern.test(input),
        sanitize: (input) => input.replace(this.sqlInjection.pattern, '')
      },
      
      // XSS prevention
      xssAttack: {
        pattern: /<(?:script|iframe|object|embed|form|input|img)[^>]*>|javascript:|vbscript:|on\w+\s*=/i,
        validate: (input) => !this.xssAttack.pattern.test(input),
        sanitize: (input) => input.replace(/<[^>]*>/g, '').replace(/javascript:|vbscript:|on\w+\s*=/gi, '')
      },
      
      // File path traversal prevention
      pathTraversal: {
        pattern: /(?:\.{2}[\/\\]|[\/\\]\.{2}|\.{2}$)/,
        validate: (input) => !this.pathTraversal.pattern.test(input),
        sanitize: (input) => input.replace(/\.{2}[\/\\]/g, '')
      },
      
      // Command injection prevention
      commandInjection: {
        pattern: /[;&|`$(){}[\]]/,
        validate: (input) => !this.commandInjection.pattern.test(input),
        sanitize: (input) => input.replace(/[;&|`$(){}[\]]/g, '')
      }
    };
  }
  
  // Advanced log analysis
  static createLogAnalyzer() {
    const patterns = {
      // Security events
      securityEvents: {
        loginFailure: /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*(?:failed|invalid|unauthorized).*login.*(?:user|username):\s*(?<user>\w+).*(?:ip|from):\s*(?<ip>\d+\.\d+\.\d+\.\d+)/i,
        
        bruteForce: /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*(?:multiple|repeated|excessive).*(?:failed|attempts).*(?<ip>\d+\.\d+\.\d+\.\d+)/i,
        
        privilegeEscalation: /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*(?:sudo|su|admin|root|elevated).*(?<user>\w+).*(?<action>granted|denied|attempted)/i
      },
      
      // Performance monitoring
      performance: {
        slowQuery: /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*query.*(?<duration>\d+(?:\.\d+)?)(?:ms|seconds?).*(?<query>SELECT|INSERT|UPDATE|DELETE)/i,
        
        memoryUsage: /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*memory.*(?<usage>\d+(?:\.\d+)?)(?:%|MB|GB)/i,
        
        errorRate: /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*(?:error|exception|failed).*(?<component>\w+)/i
      },
      
      // Business events
      business: {
        transaction: /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*transaction.*(?<id>\w+).*(?<amount>\d+(?:\.\d{2})?).*(?<status>completed|failed|pending)/i,
        
        userActivity: /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*user.*(?<userId>\w+).*(?<action>login|logout|purchase|view|click)/i
      }
    };
    
    return {
      analyzeLogStream: (logStream) => {
        const events = {
          security: [],
          performance: [],
          business: [],
          unmatched: []
        };
        
        const lines = logStream.split('\n');
        
        lines.forEach((line, index) => {
          let matched = false;
          
          Object.entries(patterns).forEach(([category, categoryPatterns]) => {
            Object.entries(categoryPatterns).forEach(([eventType, pattern]) => {
              const match = line.match(pattern);
              if (match && match.groups) {
                events[category].push({
                  lineNumber: index + 1,
                  eventType,
                  timestamp: match.groups.timestamp,
                  data: match.groups,
                  raw: line
                });
                matched = true;
              }
            });
          });
          
          if (!matched && line.trim()) {
            events.unmatched.push({
              lineNumber: index + 1,
              raw: line
            });
          }
        });
        
        return events;
      },
      
      generateReport: (events) => {
        const report = {
          summary: {},
          alerts: [],
          recommendations: []
        };
        
        // Generate summary
        Object.entries(events).forEach(([category, categoryEvents]) => {
          if (Array.isArray(categoryEvents)) {
            report.summary[category] = categoryEvents.length;
            
            // Generate alerts for security events
            if (category === 'security') {
              const ipCounts = {};
              categoryEvents.forEach(event => {
                if (event.data.ip) {
                  ipCounts[event.data.ip] = (ipCounts[event.data.ip] || 0) + 1;
                }
              });
              
              Object.entries(ipCounts).forEach(([ip, count]) => {
                if (count > 5) {
                  report.alerts.push({
                    type: 'security',
                    severity: 'high',
                    message: `Suspicious activity from IP ${ip}: ${count} failed attempts`
                  });
                }
              });
            }
          }
        });
        
        return report;
      }
    };
  }
  
  // Content management system
  static createContentProcessor() {
    const processors = {
      // Markdown to HTML conversion helpers
      markdown: {
        headers: /^(#{1,6})\s+(.+)$/gm,
        bold: /\*\*(.*?)\*\*/g,
        italic: /\*(.*?)\*/g,
        code: /`([^`]+)`/g,
        links: /\[([^\]]+)\]\(([^)]+)\)/g,
        images: /!\[([^\]]*)\]\(([^)]+)\)/g
      },
      
      // URL and link extraction
      links: {
        urls: /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g,
        emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        mentions: /@(\w+)/g,
        hashtags: /#(\w+)/g
      },
      
      // Content cleaning
      sanitize: {
        removeHtml: /<[^>]*>/g,
        normalizeSpaces: /\s+/g,
        removeSpecialChars: /[^\w\s.-]/g,
        extractNumbers: /\d+(?:\.\d+)?/g
      }
    };
    
    return {
      processContent: (content, options = {}) => {
        const result = {
          original: content,
          processed: content,
          extracted: {},
          metadata: {}
        };
        
        // Extract links and metadata
        result.extracted.urls = [...content.matchAll(processors.links.urls)].map(m => m[0]);
        result.extracted.emails = [...content.matchAll(processors.links.emails)].map(m => m[0]);
        result.extracted.mentions = [...content.matchAll(processors.links.mentions)].map(m => m[1]);
        result.extracted.hashtags = [...content.matchAll(processors.links.hashtags)].map(m => m[1]);
        
        // Process markdown if requested
        if (options.processMarkdown) {
          result.processed = result.processed
            .replace(processors.markdown.headers, (match, hashes, text) => 
              `<h${hashes.length}>${text}</h${hashes.length}>`)
            .replace(processors.markdown.bold, '<strong>$1</strong>')
            .replace(processors.markdown.italic, '<em>$1</em>')
            .replace(processors.markdown.code, '<code>$1</code>')
            .replace(processors.markdown.links, '<a href="$2">$1</a>')
            .replace(processors.markdown.images, '<img src="$2" alt="$1">');
        }
        
        // Sanitize content if requested
        if (options.sanitize) {
          result.processed = result.processed
            .replace(processors.sanitize.removeHtml, '')
            .replace(processors.sanitize.normalizeSpaces, ' ')
            .trim();
        }
        
        // Generate metadata
        result.metadata = {
          wordCount: result.processed.split(/\s+/).length,
          charCount: result.processed.length,
          linkCount: result.extracted.urls.length,
          emailCount: result.extracted.emails.length,
          mentionCount: result.extracted.mentions.length,
          hashtagCount: result.extracted.hashtags.length
        };
        
        return result;
      }
    };
  }
}

// Demonstração de casos enterprise
function demonstrarCasosEnterprise() {
  console.log("\n=== Enterprise Use Cases ===");
  
  // Security validation
  console.log("=== Security Validation ===");
  
  const securityValidator = EnterpriseRegexSuite.createSecurityValidator();
  
  const maliciousInputs = [
    "'; DROP TABLE users; --",
    "<script>alert('XSS')</script>",
    "../../../etc/passwd",
    "user && rm -rf /",
    "normal input"
  ];
  
  maliciousInputs.forEach(input => {
    console.log(`\nInput: "${input}"`);
    
    Object.entries(securityValidator).forEach(([threatType, validator]) => {
      const isValid = validator.validate(input);
      const sanitized = validator.sanitize(input);
      
      console.log(`  ${threatType}: ${isValid ? '✅ Safe' : '❌ Threat detected'}`);
      if (!isValid && sanitized !== input) {
        console.log(`    Sanitized: "${sanitized}"`);
      }
    });
  });
  
  // Log analysis
  console.log("\n=== Log Analysis ===");
  
  const logAnalyzer = EnterpriseRegexSuite.createLogAnalyzer();
  
  const sampleLogs = `
2023-10-15 10:30:15 [AUTH] Failed login attempt for user admin from ip: 192.168.1.100
2023-10-15 10:30:20 [AUTH] Failed login attempt for user admin from ip: 192.168.1.100
2023-10-15 10:30:25 [AUTH] Failed login attempt for user admin from ip: 192.168.1.100
2023-10-15 10:35:10 [PERF] Slow query detected: SELECT * FROM users WHERE... Duration: 2.5 seconds
2023-10-15 10:40:30 [BIZ] Transaction ABC123 completed with amount 150.00 status completed
2023-10-15 10:45:15 [ERROR] Database connection failed for component UserService
  `;
  
  const logEvents = logAnalyzer.analyzeLogStream(sampleLogs);
  const report = logAnalyzer.generateReport(logEvents);
  
  console.log("Log analysis results:");
  console.log("  Summary:", report.summary);
  
  if (report.alerts.length > 0) {
    console.log("  Alerts:");
    report.alerts.forEach(alert => {
      console.log(`    ${alert.severity.toUpperCase()}: ${alert.message}`);
    });
  }
  
  Object.entries(logEvents).forEach(([category, events]) => {
    if (Array.isArray(events) && events.length > 0) {
      console.log(`  ${category} events: ${events.length}`);
      events.forEach(event => {
        console.log(`    ${event.eventType}: ${JSON.stringify(event.data)}`);
      });
    }
  });
  
  // Content processing
  console.log("\n=== Content Processing ===");
  
  const contentProcessor = EnterpriseRegexSuite.createContentProcessor();
  
  const sampleContent = `
# Welcome to our platform!

Visit our **website** at https://example.com or email us at support@example.com.
Follow us @company and use #awesome hashtag!

Check out this image: ![Logo](https://example.com/logo.png)

Contact information:
- Phone: +1-555-123-4567
- Website: www.example.com
  `;
  
  const processedContent = contentProcessor.processContent(sampleContent, {
    processMarkdown: true,
    sanitize: false
  });
  
  console.log("Content processing results:");
  console.log("  Metadata:", processedContent.metadata);
  console.log("  Extracted URLs:", processedContent.extracted.urls);
  console.log("  Extracted emails:", processedContent.extracted.emails);
  console.log("  Extracted mentions:", processedContent.extracted.mentions);
  console.log("  Extracted hashtags:", processedContent.extracted.hashtags);
  
  console.log("\n  Processed content (first 200 chars):");
  console.log(`    ${processedContent.processed.substring(0, 200)}...`);
}

demonstrarCasosEnterprise();
```

---

## 📚 Conclusão

**Aplicações Práticas** e **Otimização** de regex representam a **culminação** do conhecimento teórico em **production-ready implementations**, oferecendo **robust validation**, **efficient parsing** e **secure text processing** essenciais para **enterprise applications**.

**Aplicações críticas:**

- **Security Validation:** XSS/SQL injection prevention, input sanitization
- **Data Processing:** Log analysis, CSV parsing, content extraction
- **Performance Optimization:** Backtracking prevention, pattern efficiency
- **Enterprise Integration:** Form validation, content management, monitoring

**Estratégias de otimização:**

- **Anchoring:** ^ $ boundaries para evitar scanning desnecessário
- **Quantifier Optimization:** Specific vs greedy patterns
- **Catastrophic Backtracking Prevention:** Atomic groups, possessive quantifiers
- **Caching:** Compiled pattern reuse, performance monitoring

**Considerações críticas:**

- **Security First:** Sempre validar input contra common attack vectors
- **Performance Testing:** Benchmark patterns com realistic data volumes
- **Maintainability:** Document complex patterns, use named groups
- **Error Handling:** Graceful degradation para invalid input

Dominar **regex applications** e **optimization** é **fundamental** para **senior developers** que precisam implementar **robust text processing** em **production environments** onde **performance**, **security** e **maintainability** são **non-negotiable requirements**.