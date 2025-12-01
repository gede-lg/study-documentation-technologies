# Object.values() em JavaScript: Extração e Manipulação de Valores de Propriedades

## 🎯 Introdução e Definição

### Definição Conceitual

**`Object.values()`** é um **método estático** do objeto `Object` que **extrai** e **retorna um array** contendo todos os **valores** das **propriedades enumeráveis próprias** de um objeto. Complementa `Object.keys()` ao focar nos **valores** ao invés das **chaves**, fornecendo **acesso direto** aos dados armazenados nas propriedades.

Conceitualmente, representa uma **operação de projeção** que mapeia um objeto para o **conjunto ordenado** de seus valores enumeráveis, mantendo a **mesma ordem** garantida pelo `Object.keys()` mas retornando o **conteúdo** das propriedades.

### Sintaxe e Comportamento Fundamental

```javascript
Object.values(obj) // Retorna Array<any>
```

**Características essenciais:**
- Retorna **array com valores** (qualquer tipo)
- Inclui **apenas propriedades próprias** (não herdadas)
- Respeita **enumerable descriptor** (enumerable: true)
- **Ordem idêntica** ao Object.keys() (ES2017+)

### Problema Fundamental que Resolve

Resolve a necessidade de **extrair valores** de um objeto de forma **consistente** e **performática**, sem necessidade de **iteração manual** ou **acesso individual** a cada propriedade, facilitando **processamento funcional** e **análise de dados**.

**Sem Object.values():**
```javascript
const obj = { a: 1, b: 2, c: 3 };
const values = [];
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    values.push(obj[key]);
  }
}
// ou
const values = Object.keys(obj).map(key => obj[key]);
```

**Com Object.values():**
```javascript
const obj = { a: 1, b: 2, c: 3 };
const values = Object.values(obj); // [1, 2, 3]
```

---

## 📋 Sumário Conceitual

### Aspectos Fundamentais

1. **Value Extraction:** Extração direta de valores sem chaves
2. **Type Preservation:** Mantém tipos originais dos valores
3. **Reference Handling:** Valores por referência para objetos/arrays
4. **Order Consistency:** Mesma ordem do Object.keys()
5. **Shallow Operation:** Não extrai valores aninhados

### Características Operacionais

- **Return Type:** Array (mixed types possível)
- **Primitive Values:** Números, strings, booleans preservados
- **Reference Values:** Objetos, arrays, funções por referência
- **Empty Objects:** Retorna array vazio `[]`

---

## 🧠 Fundamentos Teóricos

### Mecânicas de Value Extraction

#### Algoritmo de Extração
```javascript
// Demonstração das mecânicas internas do Object.values()

function demonstrarMecanicasValues() {
  console.log("=== Mecânicas Internas do Object.values() ===");
  
  const obj = {
    numero: 42,
    texto: "hello",
    booleano: true,
    objeto: { nested: "valor" },
    array: [1, 2, 3],
    funcao: function() { return "function"; },
    nulo: null,
    indefinido: undefined
  };
  
  console.log("Objeto original:", obj);
  
  // Object.values() extração
  const values = Object.values(obj);
  console.log("Object.values() resultado:", values);
  
  // Análise dos tipos
  console.log("\n=== Análise de Tipos ===");
  values.forEach((value, index) => {
    const key = Object.keys(obj)[index];
    console.log(`${key}: ${typeof value} = ${
      typeof value === 'object' && value !== null ? 
      JSON.stringify(value) : value
    }`);
  });
  
  // Verificar referências vs valores
  console.log("\n=== Teste de Referências ===");
  const objetoNested = values[3]; // { nested: "valor" }
  const arrayNested = values[4];  // [1, 2, 3]
  
  // Modificar objetos extraídos
  objetoNested.modified = true;
  arrayNested.push(4);
  
  console.log("Objeto original após modificação:", obj.objeto);
  console.log("Array original após modificação:", obj.array);
  console.log("Referências são mantidas:", 
    obj.objeto === objetoNested && obj.array === arrayNested);
}

demonstrarMecanicasValues();

// Simulação do algoritmo interno
function simularObjectValues(obj) {
  console.log("\n=== Simulação do Algoritmo Object.values() ===");
  
  // 1. Converter para objeto
  const O = Object(obj);
  
  // 2. Obter keys enumeráveis (mesma lógica do Object.keys)
  const keys = Object.keys(O);
  
  // 3. Extrair valores na mesma ordem
  const values = keys.map(key => O[key]);
  
  console.log("Keys obtidas:", keys);
  console.log("Values simulados:", values);
  console.log("Object.values() real:", Object.values(obj));
  
  const iguais = JSON.stringify(values) === JSON.stringify(Object.values(obj));
  console.log("Simulação correta:", iguais);
  
  return values;
}

// Teste com diferentes tipos
const testCases = [
  { a: 1, b: 2 },
  "string",
  [1, 2, 3],
  42,
  true
];

testCases.forEach((testCase, i) => {
  console.log(`\nTeste ${i + 1}:`, testCase);
  simularObjectValues(testCase);
});
```

#### Comportamento com Diferentes Tipos
```javascript
// Análise do comportamento com diferentes tipos de entrada

function analisarComportamentoPorTipo() {
  console.log("\n=== Comportamento por Tipo de Entrada ===");
  
  // 1. Objeto simples
  const objSimples = { a: 1, b: 2, c: 3 };
  console.log("Objeto simples:", Object.values(objSimples));
  
  // 2. Array (índices como propriedades)
  const arr = ['primeiro', 'segundo', 'terceiro'];
  arr.propriedadeCustom = 'custom';
  console.log("Array:", arr);
  console.log("Object.values(array):", Object.values(arr));
  console.log("Array.values seria:", [...arr]); // Comparação
  
  // 3. String (caracteres como propriedades)
  const str = "hello";
  console.log("String:", str);
  console.log("Object.values(string):", Object.values(str));
  
  // 4. Número
  const num = 123;
  console.log("Número:", num);
  console.log("Object.values(number):", Object.values(num));
  
  // 5. Boolean
  const bool = true;
  console.log("Boolean:", bool);
  console.log("Object.values(boolean):", Object.values(bool));
  
  // 6. Função com propriedades
  function func() { return "função"; }
  func.prop1 = "propriedade 1";
  func.prop2 = "propriedade 2";
  console.log("Função com propriedades:", func);
  console.log("Object.values(function):", Object.values(func));
  
  // 7. Null e undefined
  console.log("\nTeste com null/undefined:");
  try {
    console.log("Object.values(null):", Object.values(null));
  } catch (e) {
    console.log("Object.values(null) erro:", e.message);
  }
  
  try {
    console.log("Object.values(undefined):", Object.values(undefined));
  } catch (e) {
    console.log("Object.values(undefined) erro:", e.message);
  }
  
  // 8. Objeto com propriedades não-enumeráveis
  const objComNaoEnum = {};
  objComNaoEnum.enum1 = "enumerável 1";
  objComNaoEnum.enum2 = "enumerável 2";
  
  Object.defineProperty(objComNaoEnum, 'naoEnum', {
    value: "não enumerável",
    enumerable: false
  });
  
  console.log("Objeto com prop não-enumerável:", objComNaoEnum);
  console.log("Object.values():", Object.values(objComNaoEnum));
  console.log("Propriedade não-enum diretamente:", objComNaoEnum.naoEnum);
}

analisarComportamentoPorTipo();
```

### Primitive vs Reference Values

#### Memory Implications
```javascript
// Análise de implicações de memória e referências

function analisarMemoryImplications() {
  console.log("\n=== Memory Implications - Primitives vs References ===");
  
  const dataObj = {
    // Primitives
    id: 1,
    name: "João",
    active: true,
    score: 95.5,
    
    // References  
    profile: { age: 30, city: "São Paulo" },
    skills: ["JavaScript", "Python", "Java"],
    metadata: new Date(),
    
    // Function
    greet: function() { return `Hello, ${this.name}`; }
  };
  
  console.log("Objeto original:", dataObj);
  
  // Extrair values
  const values = Object.values(dataObj);
  console.log("Values extraídos:", values);
  
  // Análise de tipos
  console.log("\n=== Análise de Tipos nos Values ===");
  values.forEach((value, index) => {
    const key = Object.keys(dataObj)[index];
    const type = typeof value;
    const isPrimitive = type !== 'object' && type !== 'function' || value === null;
    
    console.log(`${key}: ${type} (${isPrimitive ? 'primitive' : 'reference'})`);
  });
  
  // Teste de modificação - primitives
  console.log("\n=== Teste: Modificação de Primitives ===");
  const primitiveValue = values[0]; // id: 1
  const modifiedPrimitive = primitiveValue + 100;
  
  console.log("Value original:", primitiveValue);
  console.log("Value modificado:", modifiedPrimitive);
  console.log("Objeto original não afetado:", dataObj.id);
  
  // Teste de modificação - references
  console.log("\n=== Teste: Modificação de References ===");
  const profileRef = values[4]; // profile object
  const skillsRef = values[5];  // skills array
  
  console.log("Profile antes:", profileRef);
  console.log("Skills antes:", skillsRef);
  
  // Modificar referências
  profileRef.modified = true;
  skillsRef.push("TypeScript");
  
  console.log("Profile depois:", profileRef);
  console.log("Skills depois:", skillsRef);
  console.log("Objeto original afetado:");
  console.log("  profile:", dataObj.profile);
  console.log("  skills:", dataObj.skills);
  
  // Memory footprint comparison
  console.log("\n=== Memory Footprint Analysis ===");
  
  // Shallow copy vs deep copy implications
  const shallowValues = Object.values(dataObj);
  const deepCopyValues = Object.values(dataObj).map(value => {
    if (typeof value === 'object' && value !== null) {
      // Simple deep copy (para arrays e objects simples)
      return Array.isArray(value) ? [...value] : { ...value };
    }
    return value;
  });
  
  console.log("Shallow values length:", shallowValues.length);
  console.log("Deep copy values length:", deepCopyValues.length);
  
  // Modificar deep copy
  if (Array.isArray(deepCopyValues[5])) {
    deepCopyValues[5].push("React");
  }
  
  console.log("Após modificar deep copy:");
  console.log("Original skills:", dataObj.skills);
  console.log("Deep copy skills:", deepCopyValues[5]);
}

analisarMemoryImplications();
```

### Performance Analysis

#### Benchmark com Grandes Datasets
```javascript
// Performance analysis do Object.values()

function performanceAnalysis() {
  console.log("\n=== Performance Analysis ===");
  
  // Criar objeto grande para teste
  const largeObj = {};
  const numProps = 10000;
  
  for (let i = 0; i < numProps; i++) {
    largeObj[`prop${i}`] = {
      id: i,
      value: Math.random(),
      text: `texto-${i}`,
      active: i % 2 === 0
    };
  }
  
  console.log(`Testando com objeto de ${numProps} propriedades`);
  
  const iterations = 1000;
  
  // 1. Object.values()
  console.time("Object.values()");
  for (let i = 0; i < iterations; i++) {
    const values = Object.values(largeObj);
  }
  console.timeEnd("Object.values()");
  
  // 2. Object.keys() + map
  console.time("Object.keys() + map");
  for (let i = 0; i < iterations; i++) {
    const values = Object.keys(largeObj).map(key => largeObj[key]);
  }
  console.timeEnd("Object.keys() + map");
  
  // 3. for...in manual
  console.time("for...in manual");
  for (let i = 0; i < iterations; i++) {
    const values = [];
    for (const key in largeObj) {
      if (largeObj.hasOwnProperty(key)) {
        values.push(largeObj[key]);
      }
    }
  }
  console.timeEnd("for...in manual");
  
  // 4. forEach com Object.keys()
  console.time("Object.keys() + forEach");
  for (let i = 0; i < iterations; i++) {
    const values = [];
    Object.keys(largeObj).forEach(key => {
      values.push(largeObj[key]);
    });
  }
  console.timeEnd("Object.keys() + forEach");
  
  // Memory usage analysis
  console.log("\n=== Memory Usage Analysis ===");
  
  // Object.values cria novo array
  const values1 = Object.values(largeObj);
  console.log("Object.values array length:", values1.length);
  
  // Manual array building
  const values2 = [];
  for (const key in largeObj) {
    if (largeObj.hasOwnProperty(key)) {
      values2.push(largeObj[key]);
    }
  }
  console.log("Manual array length:", values2.length);
  
  // Verificar se são iguais (shallow comparison)
  const saoIguais = values1.every((val, index) => val === values2[index]);
  console.log("Arrays são equivalentes:", saoIguais);
}

performanceAnalysis();
```

---

## 🔍 Análise Conceitual Profunda

### Integration com Functional Programming

#### Functional Programming Patterns
```javascript
// Object.values() em padrões funcionais

function functionalPatternsWithValues() {
  console.log("\n=== Functional Programming com Object.values() ===");
  
  const products = {
    laptop: { name: "Laptop Pro", price: 2500, category: "electronics" },
    mouse: { name: "Gaming Mouse", price: 80, category: "electronics" },  
    book: { name: "JS Guide", price: 45, category: "books" },
    chair: { name: "Office Chair", price: 300, category: "furniture" }
  };
  
  console.log("Produtos:", products);
  
  // 1. Map - transformar todos os valores
  const productValues = Object.values(products);
  const pricesOnly = productValues.map(product => product.price);
  console.log("Apenas preços:", pricesOnly);
  
  // 2. Filter - filtrar valores por critério
  const expensiveProducts = productValues.filter(product => product.price > 100);
  console.log("Produtos caros:", expensiveProducts);
  
  // 3. Reduce - agregações
  const totalValue = productValues.reduce((sum, product) => sum + product.price, 0);
  console.log("Valor total:", totalValue);
  
  const categoryCounts = productValues.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  console.log("Contagem por categoria:", categoryCounts);
  
  // 4. Composição funcional
  const pipeline = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);
  
  const getExpensiveElectronics = pipeline(
    (products) => Object.values(products),
    (values) => values.filter(p => p.category === 'electronics'),
    (electronics) => electronics.filter(p => p.price > 70),
    (expensive) => expensive.map(p => ({ name: p.name, price: p.price }))
  );
  
  const result = getExpensiveElectronics(products);
  console.log("Eletrônicos caros:", result);
  
  // 5. Análise estatística funcional
  const analyzeValues = (obj) => {
    const values = Object.values(obj);
    
    if (values.length === 0) return {};
    
    const numbers = values.filter(v => typeof v === 'number');
    const strings = values.filter(v => typeof v === 'string');
    const objects = values.filter(v => typeof v === 'object' && v !== null);
    
    return {
      total: values.length,
      byType: {
        numbers: numbers.length,
        strings: strings.length,
        objects: objects.length,
        others: values.length - numbers.length - strings.length - objects.length
      },
      numericStats: numbers.length > 0 ? {
        sum: numbers.reduce((a, b) => a + b, 0),
        avg: numbers.reduce((a, b) => a + b, 0) / numbers.length,
        min: Math.min(...numbers),
        max: Math.max(...numbers)
      } : null
    };
  };
  
  const stats = analyzeValues(products.laptop);
  console.log("Análise estatística do laptop:", stats);
}

functionalPatternsWithValues();

// Utilities funcionais com Object.values()
const ValueUtils = {
  // Encontrar valores únicos
  uniqueValues(obj) {
    const values = Object.values(obj);
    return [...new Set(values.map(v => JSON.stringify(v)))]
      .map(v => JSON.parse(v));
  },
  
  // Agrupar objetos por propriedade dos valores
  groupByValueProperty(obj, property) {
    return Object.values(obj).reduce((groups, value) => {
      if (typeof value === 'object' && value !== null && property in value) {
        const key = value[property];
        if (!groups[key]) groups[key] = [];
        groups[key].push(value);
      }
      return groups;
    }, {});
  },
  
  // Validar todos os valores
  validateAllValues(obj, validator) {
    return Object.values(obj).every(validator);
  },
  
  // Transformar valores recursivamente
  deepTransformValues(obj, transformer) {
    return Object.keys(obj).reduce((result, key) => {
      const value = obj[key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.deepTransformValues(value, transformer);
      } else {
        result[key] = transformer(value, key);
      }
      
      return result;
    }, {});
  },
  
  // Flatten valores aninhados
  flattenValues(obj, maxDepth = 2) {
    const flatten = (values, currentDepth) => {
      if (currentDepth >= maxDepth) return values;
      
      return values.reduce((flattened, value) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flattened.push(...flatten(Object.values(value), currentDepth + 1));
        } else {
          flattened.push(value);
        }
        return flattened;
      }, []);
    };
    
    return flatten(Object.values(obj), 0);
  }
};

// Demonstração dos utilities
function demonstrarValueUtils() {
  console.log("\n=== Value Utils Demonstration ===");
  
  const testData = {
    user1: { name: "Ana", age: 25, role: "dev" },
    user2: { name: "João", age: 30, role: "dev" },
    user3: { name: "Maria", age: 25, role: "designer" },
    config: { debug: true, port: 3000 }
  };
  
  // uniqueValues
  const unique = ValueUtils.uniqueValues({ a: 1, b: 1, c: 2, d: 2 });
  console.log("Valores únicos:", unique);
  
  // groupByValueProperty
  const grouped = ValueUtils.groupByValueProperty(testData, 'role');
  console.log("Agrupado por role:", grouped);
  
  // validateAllValues
  const allHaveName = ValueUtils.validateAllValues(
    { user1: testData.user1, user2: testData.user2 }, 
    value => typeof value === 'object' && 'name' in value
  );
  console.log("Todos têm propriedade 'name':", allHaveName);
  
  // deepTransformValues
  const transformed = ValueUtils.deepTransformValues(testData, (value, key) => 
    typeof value === 'string' ? value.toUpperCase() : value
  );
  console.log("Strings transformadas:", transformed);
  
  // flattenValues
  const flattened = ValueUtils.flattenValues(testData);
  console.log("Valores flattened:", flattened);
}

demonstrarValueUtils();
```

---

## 🎯 Aplicabilidade e Contextos

### Data Processing e Analytics

```javascript
// Processamento de dados usando Object.values()

function dataProcessingWithValues() {
  console.log("\n=== Data Processing com Object.values() ===");
  
  // Dataset de vendas
  const salesData = {
    jan: { month: "Janeiro", sales: 15000, target: 12000, region: "SP" },
    feb: { month: "Fevereiro", sales: 18000, target: 15000, region: "SP" },
    mar: { month: "Março", sales: 12000, target: 14000, region: "RJ" },
    apr: { month: "Abril", sales: 22000, target: 18000, region: "SP" },
    may: { month: "Maio", sales: 16000, target: 16000, region: "RJ" }
  };
  
  console.log("Dados de vendas:", salesData);
  
  // Analytics usando Object.values()
  const monthlyData = Object.values(salesData);
  
  // 1. Vendas totais
  const totalSales = monthlyData.reduce((sum, month) => sum + month.sales, 0);
  console.log("Vendas totais:", totalSales);
  
  // 2. Meta total
  const totalTarget = monthlyData.reduce((sum, month) => sum + month.target, 0);
  console.log("Meta total:", totalTarget);
  
  // 3. Performance vs meta
  const performance = (totalSales / totalTarget * 100).toFixed(2);
  console.log("Performance vs meta:", `${performance}%`);
  
  // 4. Melhores e piores meses
  const bestMonth = monthlyData.reduce((best, current) => 
    current.sales > best.sales ? current : best
  );
  const worstMonth = monthlyData.reduce((worst, current) => 
    current.sales < worst.sales ? current : worst
  );
  
  console.log("Melhor mês:", bestMonth.month, "-", bestMonth.sales);
  console.log("Pior mês:", worstMonth.month, "-", worstMonth.sales);
  
  // 5. Análise por região
  const regionStats = monthlyData.reduce((stats, month) => {
    if (!stats[month.region]) {
      stats[month.region] = { sales: 0, count: 0, months: [] };
    }
    
    stats[month.region].sales += month.sales;
    stats[month.region].count++;
    stats[month.region].months.push(month.month);
    
    return stats;
  }, {});
  
  console.log("Estatísticas por região:", regionStats);
  
  // 6. Crescimento mensal
  const growth = monthlyData.slice(1).map((month, index) => ({
    month: month.month,
    growth: ((month.sales - monthlyData[index].sales) / monthlyData[index].sales * 100).toFixed(2)
  }));
  
  console.log("Crescimento mensal:", growth);
}

dataProcessingWithValues();
```

### Configuration Validation

```javascript
// Validação de configuração usando Object.values()

class ConfigValidator {
  constructor() {
    this.rules = new Map();
    this.transformers = new Map();
  }
  
  // Adicionar regra de validação
  addRule(property, validator, message = "Invalid value") {
    this.rules.set(property, { validator, message });
    return this;
  }
  
  // Adicionar transformer
  addTransformer(property, transformer) {
    this.transformers.set(property, transformer);
    return this;
  }
  
  // Validar configuração completa
  validate(config) {
    const errors = [];
    const warnings = [];
    const transformedConfig = { ...config };
    
    // Analisar todos os valores
    const configValues = Object.values(config);
    const configKeys = Object.keys(config);
    
    console.log("=== Validação de Configuração ===");
    console.log("Valores encontrados:", configValues.length);
    
    // Análise geral dos tipos
    const typeAnalysis = configValues.reduce((analysis, value) => {
      const type = typeof value;
      analysis[type] = (analysis[type] || 0) + 1;
      return analysis;
    }, {});
    
    console.log("Distribuição de tipos:", typeAnalysis);
    
    // Validação individual
    configKeys.forEach((key, index) => {
      let value = configValues[index];
      
      // Aplicar transformer se existir
      if (this.transformers.has(key)) {
        try {
          value = this.transformers.get(key)(value);
          transformedConfig[key] = value;
        } catch (error) {
          errors.push(`Erro ao transformar ${key}: ${error.message}`);
          return;
        }
      }
      
      // Aplicar validação se existir
      if (this.rules.has(key)) {
        const { validator, message } = this.rules.get(key);
        
        try {
          const isValid = validator(value);
          if (!isValid) {
            errors.push(`${key}: ${message} (valor: ${value})`);
          }
        } catch (error) {
          errors.push(`Erro na validação de ${key}: ${error.message}`);
        }
      }
    });
    
    // Validações globais usando Object.values()
    this.performGlobalValidations(transformedConfig, errors, warnings);
    
    return {
      isValid: errors.length === 0,
      config: transformedConfig,
      errors,
      warnings,
      stats: {
        totalProperties: configKeys.length,
        typeDistribution: typeAnalysis,
        hasNestedObjects: configValues.some(v => 
          typeof v === 'object' && v !== null && !Array.isArray(v)
        )
      }
    };
  }
  
  // Validações que dependem de múltiplos valores
  performGlobalValidations(config, errors, warnings) {
    const values = Object.values(config);
    
    // Verificar valores duplicados
    const duplicates = values.filter((value, index, arr) => 
      arr.indexOf(value) !== index && typeof value !== 'object'
    );
    
    if (duplicates.length > 0) {
      warnings.push(`Valores duplicados encontrados: ${duplicates.join(', ')}`);
    }
    
    // Verificar se há valores null/undefined
    const nullCount = values.filter(v => v === null || v === undefined).length;
    if (nullCount > 0) {
      warnings.push(`${nullCount} propriedades com valores null/undefined`);
    }
    
    // Verificar propriedades vazias (strings/arrays/objects)
    const emptyCount = values.filter(v => {
      if (typeof v === 'string') return v.length === 0;
      if (Array.isArray(v)) return v.length === 0;
      if (typeof v === 'object' && v !== null) return Object.keys(v).length === 0;
      return false;
    }).length;
    
    if (emptyCount > 0) {
      warnings.push(`${emptyCount} propriedades com valores vazios`);
    }
  }
}

// Demonstração do validator
function demonstrarConfigValidator() {
  console.log("\n=== Demonstração do Config Validator ===");
  
  const validator = new ConfigValidator()
    .addRule('port', port => Number.isInteger(port) && port > 0 && port < 65536, 
             'Port deve ser um inteiro entre 1 e 65535')
    .addRule('host', host => typeof host === 'string' && host.length > 0,
             'Host deve ser uma string não-vazia')
    .addRule('timeout', timeout => Number.isInteger(timeout) && timeout > 0,
             'Timeout deve ser um inteiro positivo')
    .addTransformer('host', host => host.toLowerCase().trim())
    .addTransformer('port', port => parseInt(port, 10));
  
  const testConfigs = [
    {
      host: "  LOCALHOST  ",
      port: "3000",
      timeout: 5000,
      debug: true,
      name: "test-server"
    },
    {
      host: "",
      port: "invalid",
      timeout: -1,
      duplicate1: "same",
      duplicate2: "same"
    }
  ];
  
  testConfigs.forEach((config, index) => {
    console.log(`\nTestando configuração ${index + 1}:`, config);
    const result = validator.validate(config);
    console.log("Resultado:", result);
  });
}

demonstrarConfigValidator();
```

---

## 📚 Conclusão

**`Object.values()`** é um **método essencial** para **extração de valores** de propriedades em JavaScript, complementando `Object.keys()` ao focar nos **dados** ao invés das **chaves**.

**Características fundamentais:**
- Extrai **valores** de propriedades enumeráveis próprias
- Mantém **ordem consistente** com Object.keys()
- Preserva **tipos originais** e **referências** para objetos
- **Performance superior** a iteração manual para casos simples

**Casos de uso principais:**
- **Data processing** e analytics
- **Functional programming** patterns  
- **Value validation** e transformation
- **Statistical analysis** de datasets

É **fundamental** para processamento moderno de dados, oferecendo **acesso direto** aos valores com **garantias de ordem** e **performance otimizada**.