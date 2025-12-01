# Object.entries() em JavaScript: Extração de Pares Chave-Valor e Transformação de Dados

## 🎯 Introdução e Definição

### Definição Conceitual

**`Object.entries()`** é um **método estático** do objeto `Object` que **extrai** e **retorna um array bidimensional** contendo todos os **pares chave-valor** das **propriedades enumeráveis próprias** de um objeto. Cada elemento do array retornado é um **sub-array** com dois elementos: **`[chave, valor]`**.

Conceitualmente, representa uma **operação de projeção** que mapeia um objeto para um **conjunto ordenado** de tuplas **chave-valor**, fornecendo **acesso simultâneo** tanto às propriedades quanto aos seus valores correspondentes, ideal para **transformação de estruturas** e **iteração avançada**.

### Sintaxe e Comportamento Fundamental

```javascript
Object.entries(obj) // Retorna Array<[string, any]>
```

**Características essenciais:**
- Retorna **array de arrays** com formato **`[key, value]`**
- Inclui **apenas propriedades próprias** (não herdadas)
- Respeita **enumerable descriptor** (enumerable: true)
- **Ordem idêntica** ao Object.keys() e Object.values()
- **Tipo de retorno:** `Array<[string, any]>`

### Problema Fundamental que Resolve

Resolve a necessidade de **processar simultaneamente** chaves e valores de um objeto, facilitando **transformações**, **destructuring**, **conversões** para outras estruturas de dados (Map, Set), e **iteração funcional** onde ambos elementos do par são necessários.

**Sem Object.entries():**
```javascript
const obj = { a: 1, b: 2, c: 3 };
const pairs = [];
const keys = Object.keys(obj);
for (let i = 0; i < keys.length; i++) {
  pairs.push([keys[i], obj[keys[i]]]);
}
// ou
const pairs = Object.keys(obj).map(key => [key, obj[key]]);
```

**Com Object.entries():**
```javascript
const obj = { a: 1, b: 2, c: 3 };
const pairs = Object.entries(obj); // [["a", 1], ["b", 2], ["c", 3]]
```

---

## 📋 Sumário Conceitual

### Aspectos Fundamentais

1. **Pair Extraction:** Extração simultânea de chaves e valores
2. **Tuple Structure:** Formato consistente de tuplas [key, value]
3. **Destructuring Ready:** Otimizado para destructuring assignment
4. **Map Conversion:** Base para conversão Object ↔ Map
5. **Functional Iteration:** Ideal para padrões funcionais

### Características Operacionais

- **Return Type:** `Array<[string, any]>`
- **Tuple Format:** Cada elemento é `[key, value]`
- **Order Consistency:** Mesma ordem de Object.keys()/values()
- **Memory Efficiency:** Cria novo array com sub-arrays

---

## 🧠 Fundamentos Teóricos

### Mecânicas de Pair Extraction

#### Algoritmo de Extração
```javascript
// Demonstração das mecânicas internas do Object.entries()

function demonstrarMecanicasEntries() {
  console.log("=== Mecânicas Internas do Object.entries() ===");
  
  const obj = {
    string: "hello",
    number: 42,
    boolean: true,
    object: { nested: "value" },
    array: [1, 2, 3],
    func: function() { return "function"; },
    date: new Date(),
    regex: /pattern/g
  };
  
  console.log("Objeto original:", obj);
  
  // Object.entries() extração
  const entries = Object.entries(obj);
  console.log("Object.entries() resultado:", entries);
  
  // Análise da estrutura
  console.log("\n=== Análise da Estrutura ===");
  console.log("Tipo do retorno:", Array.isArray(entries) ? "Array" : typeof entries);
  console.log("Número de pares:", entries.length);
  console.log("Formato do primeiro elemento:", entries[0]);
  console.log("Tipo do primeiro elemento:", Array.isArray(entries[0]) ? "Array" : typeof entries[0]);
  
  // Análise de cada par
  console.log("\n=== Análise dos Pares ===");
  entries.forEach((pair, index) => {
    const [key, value] = pair;
    console.log(`Par ${index}: [${typeof key}]"${key}" => [${typeof value}]${
      typeof value === 'object' && value !== null ? 
      JSON.stringify(value) : value
    }`);
  });
  
  // Verificação de integridade
  console.log("\n=== Verificação de Integridade ===");
  const keysFromEntries = entries.map(([key]) => key);
  const valuesFromEntries = entries.map(([, value]) => value);
  const directKeys = Object.keys(obj);
  const directValues = Object.values(obj);
  
  const keysMatch = JSON.stringify(keysFromEntries) === JSON.stringify(directKeys);
  const valuesMatch = JSON.stringify(valuesFromEntries) === JSON.stringify(directValues);
  
  console.log("Keys correspondem:", keysMatch);
  console.log("Values correspondem:", valuesMatch);
  console.log("Ordem consistente:", keysMatch && valuesMatch);
}

demonstrarMecanicasEntries();

// Simulação do algoritmo interno
function simularObjectEntries(obj) {
  console.log("\n=== Simulação do Algoritmo Object.entries() ===");
  
  // 1. Converter para objeto
  const O = Object(obj);
  
  // 2. Obter keys enumeráveis (mesma lógica dos métodos anteriores)
  const keys = Object.keys(O);
  
  // 3. Criar pares [key, value] na mesma ordem
  const entries = keys.map(key => [key, O[key]]);
  
  console.log("Keys obtidas:", keys);
  console.log("Entries simuladas:", entries);
  console.log("Object.entries() real:", Object.entries(obj));
  
  const iguais = JSON.stringify(entries) === JSON.stringify(Object.entries(obj));
  console.log("Simulação correta:", iguais);
  
  return entries;
}

// Teste com diferentes tipos
const testCases = [
  { a: 1, b: 2, c: 3 },
  "string",
  [10, 20, 30],
  function test() { return "func"; },
  new Date()
];

testCases.forEach((testCase, i) => {
  console.log(`\nTeste ${i + 1}:`, testCase);
  simularObjectEntries(testCase);
});
```

#### Destructuring Applications
```javascript
// Aplicações avançadas com destructuring

function destructuringApplications() {
  console.log("\n=== Destructuring Applications com Object.entries() ===");
  
  const userData = {
    id: 101,
    name: "Ana Silva",
    email: "ana@email.com",
    age: 28,
    role: "developer",
    active: true,
    lastLogin: "2024-01-15"
  };
  
  console.log("Dados do usuário:", userData);
  
  // 1. Destructuring básico em loop
  console.log("\n=== Destructuring em Loop ===");
  for (const [property, value] of Object.entries(userData)) {
    console.log(`${property}: ${value} (${typeof value})`);
  }
  
  // 2. Destructuring com renomeação
  console.log("\n=== Destructuring com Renomeação ===");
  const entries = Object.entries(userData);
  entries.forEach(([prop, val]) => {
    const displayName = prop.charAt(0).toUpperCase() + prop.slice(1);
    console.log(`${displayName}: ${val}`);
  });
  
  // 3. Destructuring seletivo
  console.log("\n=== Destructuring Seletivo ===");
  const personalInfo = {};
  const systemInfo = {};
  
  for (const [key, value] of Object.entries(userData)) {
    if (['name', 'email', 'age'].includes(key)) {
      personalInfo[key] = value;
    } else {
      systemInfo[key] = value;
    }
  }
  
  console.log("Informações pessoais:", personalInfo);
  console.log("Informações do sistema:", systemInfo);
  
  // 4. Destructuring com validação
  console.log("\n=== Destructuring com Validação ===");
  const validators = {
    id: (val) => Number.isInteger(val) && val > 0,
    name: (val) => typeof val === 'string' && val.length > 0,
    email: (val) => typeof val === 'string' && val.includes('@'),
    age: (val) => Number.isInteger(val) && val >= 0 && val <= 150,
    role: (val) => ['developer', 'designer', 'manager'].includes(val),
    active: (val) => typeof val === 'boolean'
  };
  
  const validationResults = Object.entries(userData)
    .map(([key, value]) => ({
      property: key,
      value,
      isValid: validators[key] ? validators[key](value) : true,
      validator: validators[key] ? 'exists' : 'none'
    }));
  
  console.log("Resultados da validação:", validationResults);
  
  // 5. Destructuring com transformação
  console.log("\n=== Destructuring com Transformação ===");
  const transformers = {
    name: (val) => val.toUpperCase(),
    email: (val) => val.toLowerCase(),
    lastLogin: (val) => new Date(val),
    age: (val) => `${val} anos`
  };
  
  const transformedData = Object.entries(userData)
    .reduce((acc, [key, value]) => {
      acc[key] = transformers[key] ? transformers[key](value) : value;
      return acc;
    }, {});
  
  console.log("Dados transformados:", transformedData);
  
  // 6. Destructuring aninhado
  const complexObj = {
    user: { name: "João", details: { age: 30, city: "SP" } },
    config: { theme: "dark", notifications: { email: true, push: false } }
  };
  
  console.log("\n=== Destructuring Aninhado ===");
  
  function processNestedEntries(obj, prefix = '') {
    return Object.entries(obj).flatMap(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return processNestedEntries(value, fullKey);
      } else {
        return [[fullKey, value]];
      }
    });
  }
  
  const flatEntries = processNestedEntries(complexObj);
  console.log("Entries aninhadas processadas:", flatEntries);
}

destructuringApplications();
```

### Map/Set Conversion

#### Object ↔ Map Conversion
```javascript
// Conversões entre Object, Map e Set usando Object.entries()

function mapSetConversions() {
  console.log("\n=== Object ↔ Map ↔ Set Conversions ===");
  
  const originalObj = {
    user1: { name: "Ana", score: 95 },
    user2: { name: "João", score: 87 },
    user3: { name: "Maria", score: 92 },
    user4: { name: "Pedro", score: 88 }
  };
  
  console.log("Objeto original:", originalObj);
  
  // 1. Object → Map
  console.log("\n=== Object → Map ===");
  const userMap = new Map(Object.entries(originalObj));
  console.log("Map criado:", userMap);
  console.log("Map size:", userMap.size);
  console.log("Tem user1:", userMap.has('user1'));
  console.log("Get user2:", userMap.get('user2'));
  
  // 2. Map → Object
  console.log("\n=== Map → Object ===");
  const backToObject = Object.fromEntries(userMap);
  console.log("De volta para objeto:", backToObject);
  console.log("Objetos iguais:", JSON.stringify(originalObj) === JSON.stringify(backToObject));
  
  // 3. Map operations com entries
  console.log("\n=== Map Operations ===");
  
  // Filtrar usuários com score > 90
  const highScorers = new Map(
    Object.entries(originalObj)
      .filter(([key, user]) => user.score > 90)
  );
  console.log("Usuários com score > 90:", highScorers);
  
  // Transformar valores no Map
  const transformedMap = new Map(
    Object.entries(originalObj)
      .map(([key, user]) => [key, {
        ...user,
        grade: user.score >= 90 ? 'A' : 'B',
        passed: user.score >= 70
      }])
  );
  console.log("Map transformado:", transformedMap);
  
  // 4. Object → Set (diferentes abordagens)
  console.log("\n=== Object → Set ===");
  
  // Set das chaves
  const keysSet = new Set(Object.entries(originalObj).map(([key]) => key));
  console.log("Set das chaves:", keysSet);
  
  // Set dos valores (objetos)
  const valuesSet = new Set(Object.entries(originalObj).map(([, value]) => value));
  console.log("Set dos valores:", valuesSet);
  
  // Set de propriedades específicas
  const namesSet = new Set(
    Object.entries(originalObj).map(([, user]) => user.name)
  );
  console.log("Set dos nomes:", namesSet);
  
  // Set de scores únicos
  const scoresSet = new Set(
    Object.entries(originalObj).map(([, user]) => user.score)
  );
  console.log("Set dos scores únicos:", scoresSet);
  
  // 5. Operações complexas com múltiplas estruturas
  console.log("\n=== Operações Complexas ===");
  
  const analysis = {
    totalUsers: Object.entries(originalObj).length,
    averageScore: Object.entries(originalObj)
      .reduce((sum, [, user]) => sum + user.score, 0) / 
      Object.entries(originalObj).length,
    topScorer: Object.entries(originalObj)
      .reduce((top, [key, user]) => 
        user.score > (top.score || 0) ? { key, ...user } : top, {}),
    scoreDistribution: Object.entries(originalObj)
      .reduce((dist, [, user]) => {
        const range = user.score >= 90 ? 'A' : user.score >= 80 ? 'B' : 'C';
        dist[range] = (dist[range] || 0) + 1;
        return dist;
      }, {})
  };
  
  console.log("Análise complexa:", analysis);
  
  // 6. WeakMap usage (quando aplicável)
  console.log("\n=== WeakMap Usage ===");
  
  // Criar objetos para usar como chaves no WeakMap
  const userObjects = Object.entries(originalObj).map(([key, user]) => ({
    id: key,
    ...user
  }));
  
  const userMetadata = new WeakMap();
  
  userObjects.forEach(userObj => {
    userMetadata.set(userObj, {
      created: new Date(),
      accessed: 0,
      lastUpdate: new Date()
    });
  });
  
  console.log("WeakMap criado com metadata para", userObjects.length, "usuários");
  
  // Simular acesso
  userObjects.forEach(userObj => {
    const metadata = userMetadata.get(userObj);
    if (metadata) {
      metadata.accessed++;
      metadata.lastUpdate = new Date();
    }
  });
  
  console.log("Metadata do primeiro usuário:", userMetadata.get(userObjects[0]));
}

mapSetConversions();
```

### Advanced Iteration Patterns

#### Performance Comparison
```javascript
// Análise de performance de diferentes padrões de iteração

function performanceComparison() {
  console.log("\n=== Performance Comparison - Iteration Patterns ===");
  
  // Criar objeto grande para teste
  const largeObj = {};
  const numProps = 10000;
  
  for (let i = 0; i < numProps; i++) {
    largeObj[`prop${i}`] = {
      id: i,
      value: Math.random(),
      category: `cat${i % 10}`,
      active: i % 2 === 0
    };
  }
  
  console.log(`Testando com objeto de ${numProps} propriedades`);
  
  const iterations = 1000;
  
  // 1. Object.entries() forEach
  console.time("Object.entries() + forEach");
  for (let i = 0; i < iterations; i++) {
    Object.entries(largeObj).forEach(([key, value]) => {
      // Simular processamento
      const result = key + value.id;
    });
  }
  console.timeEnd("Object.entries() + forEach");
  
  // 2. Object.entries() for...of
  console.time("Object.entries() + for...of");
  for (let i = 0; i < iterations; i++) {
    for (const [key, value] of Object.entries(largeObj)) {
      // Simular processamento
      const result = key + value.id;
    }
  }
  console.timeEnd("Object.entries() + for...of");
  
  // 3. for...in tradicional
  console.time("for...in tradicional");
  for (let i = 0; i < iterations; i++) {
    for (const key in largeObj) {
      if (largeObj.hasOwnProperty(key)) {
        const value = largeObj[key];
        // Simular processamento
        const result = key + value.id;
      }
    }
  }
  console.timeEnd("for...in tradicional");
  
  // 4. Object.keys() + forEach
  console.time("Object.keys() + forEach");
  for (let i = 0; i < iterations; i++) {
    Object.keys(largeObj).forEach(key => {
      const value = largeObj[key];
      // Simular processamento
      const result = key + value.id;
    });
  }
  console.timeEnd("Object.keys() + forEach");
  
  // 5. Destructuring assignment com entries
  console.time("entries + destructuring");
  for (let i = 0; i < iterations; i++) {
    const entries = Object.entries(largeObj);
    entries.forEach(entry => {
      const [key, value] = entry;
      // Simular processamento
      const result = key + value.id;
    });
  }
  console.timeEnd("entries + destructuring");
  
  // Memory usage analysis
  console.log("\n=== Memory Usage Analysis ===");
  
  // Diferentes abordagens para transformação
  const transformData = (obj) => {
    console.log("Testando transformações...");
    
    // Abordagem 1: Object.entries
    const start1 = performance.now();
    const result1 = Object.entries(obj).reduce((acc, [key, value]) => {
      if (value.active) {
        acc[key] = value.value * 2;
      }
      return acc;
    }, {});
    const end1 = performance.now();
    
    // Abordagem 2: for...in
    const start2 = performance.now();
    const result2 = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key].active) {
        result2[key] = obj[key].value * 2;
      }
    }
    const end2 = performance.now();
    
    // Abordagem 3: Object.keys + reduce
    const start3 = performance.now();
    const result3 = Object.keys(obj).reduce((acc, key) => {
      if (obj[key].active) {
        acc[key] = obj[key].value * 2;
      }
      return acc;
    }, {});
    const end3 = performance.now();
    
    console.log("Object.entries + reduce:", (end1 - start1).toFixed(2), "ms");
    console.log("for...in manual:", (end2 - start2).toFixed(2), "ms");
    console.log("Object.keys + reduce:", (end3 - start3).toFixed(2), "ms");
    
    // Verificar se os resultados são iguais
    const equal = JSON.stringify(result1) === JSON.stringify(result2) && 
                  JSON.stringify(result2) === JSON.stringify(result3);
    console.log("Resultados equivalentes:", equal);
    
    return { result1, result2, result3 };
  };
  
  // Testar com um subset menor para comparação
  const smallObj = Object.entries(largeObj)
    .slice(0, 100)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  
  transformData(smallObj);
}

performanceComparison();
```

---

## 🔍 Análise Conceitual Profunda

### Data Transformation Utilities

#### Advanced Object Transformation
```javascript
// Utilitários avançados de transformação usando Object.entries()

class ObjectTransformer {
  static deepTransform(obj, transformer, options = {}) {
    const { 
      maxDepth = 10, 
      preserveArrays = true, 
      skipNullValues = false,
      keyTransformer = null 
    } = options;
    
    const transform = (current, depth = 0) => {
      if (depth >= maxDepth) return current;
      
      if (skipNullValues && current === null) return current;
      
      if (typeof current !== 'object' || current === null) {
        return transformer(current, null, depth);
      }
      
      if (Array.isArray(current)) {
        return preserveArrays ? 
          current.map(item => transform(item, depth + 1)) : 
          current;
      }
      
      return Object.entries(current).reduce((result, [key, value]) => {
        const transformedKey = keyTransformer ? keyTransformer(key) : key;
        const transformedValue = transformer(value, key, depth);
        
        result[transformedKey] = typeof transformedValue === 'object' && 
                                transformedValue !== null ?
                                transform(transformedValue, depth + 1) : 
                                transformedValue;
        return result;
      }, {});
    };
    
    return transform(obj);
  }
  
  static merge(...objects) {
    const mergeStrategy = {
      arrays: 'concat',    // 'concat', 'replace', 'merge'
      objects: 'deep',     // 'deep', 'shallow', 'replace'
      primitives: 'last'   // 'last', 'first', 'array'
    };
    
    return objects.reduce((merged, current) => {
      if (!current || typeof current !== 'object') return merged;
      
      Object.entries(current).forEach(([key, value]) => {
        if (!(key in merged)) {
          merged[key] = value;
          return;
        }
        
        const existingValue = merged[key];
        
        // Arrays
        if (Array.isArray(existingValue) && Array.isArray(value)) {
          merged[key] = mergeStrategy.arrays === 'concat' ?
            [...existingValue, ...value] : value;
          return;
        }
        
        // Objects
        if (typeof existingValue === 'object' && existingValue !== null &&
            typeof value === 'object' && value !== null &&
            !Array.isArray(existingValue) && !Array.isArray(value)) {
          merged[key] = mergeStrategy.objects === 'deep' ?
            this.merge(existingValue, value) : value;
          return;
        }
        
        // Primitives
        merged[key] = value;
      });
      
      return merged;
    }, {});
  }
  
  static pick(obj, keys) {
    return Object.entries(obj).reduce((picked, [key, value]) => {
      if (keys.includes(key)) {
        picked[key] = value;
      }
      return picked;
    }, {});
  }
  
  static omit(obj, keys) {
    return Object.entries(obj).reduce((filtered, [key, value]) => {
      if (!keys.includes(key)) {
        filtered[key] = value;
      }
      return filtered;
    }, {});
  }
  
  static groupBy(obj, groupingFunction) {
    return Object.entries(obj).reduce((groups, [key, value]) => {
      const groupKey = groupingFunction(value, key);
      
      if (!groups[groupKey]) {
        groups[groupKey] = {};
      }
      
      groups[groupKey][key] = value;
      return groups;
    }, {});
  }
  
  static validate(obj, schema) {
    const errors = [];
    const warnings = [];
    
    // Validar propriedades obrigatórias
    if (schema.required) {
      schema.required.forEach(requiredKey => {
        if (!(requiredKey in obj)) {
          errors.push(`Missing required property: ${requiredKey}`);
        }
      });
    }
    
    // Validar cada propriedade
    Object.entries(obj).forEach(([key, value]) => {
      const fieldSchema = schema.properties && schema.properties[key];
      
      if (!fieldSchema) {
        if (schema.additionalProperties === false) {
          warnings.push(`Unexpected property: ${key}`);
        }
        return;
      }
      
      // Type validation
      if (fieldSchema.type && typeof value !== fieldSchema.type) {
        errors.push(`${key}: expected ${fieldSchema.type}, got ${typeof value}`);
      }
      
      // Custom validator
      if (fieldSchema.validator && !fieldSchema.validator(value)) {
        errors.push(`${key}: custom validation failed`);
      }
      
      // Range validation for numbers
      if (typeof value === 'number' && fieldSchema.range) {
        const [min, max] = fieldSchema.range;
        if (value < min || value > max) {
          errors.push(`${key}: value ${value} out of range [${min}, ${max}]`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  static diff(obj1, obj2) {
    const changes = {
      added: {},
      removed: {},
      modified: {},
      unchanged: {}
    };
    
    const allKeys = new Set([
      ...Object.keys(obj1),
      ...Object.keys(obj2)
    ]);
    
    allKeys.forEach(key => {
      const hasKey1 = key in obj1;
      const hasKey2 = key in obj2;
      
      if (!hasKey1 && hasKey2) {
        changes.added[key] = obj2[key];
      } else if (hasKey1 && !hasKey2) {
        changes.removed[key] = obj1[key];
      } else if (hasKey1 && hasKey2) {
        if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          changes.modified[key] = {
            old: obj1[key],
            new: obj2[key]
          };
        } else {
          changes.unchanged[key] = obj1[key];
        }
      }
    });
    
    return changes;
  }
}

// Demonstração dos utilitários
function demonstrarObjectTransformer() {
  console.log("\n=== Demonstração do ObjectTransformer ===");
  
  const testData = {
    user: {
      id: 1,
      name: "joão silva",
      profile: {
        age: 30,
        preferences: {
          theme: "dark",
          language: "pt-br"
        }
      }
    },
    settings: {
      notifications: true,
      privacy: "public"
    }
  };
  
  console.log("Dados originais:", testData);
  
  // 1. Deep transform - normalizar strings
  const normalized = ObjectTransformer.deepTransform(testData, (value, key) => {
    return typeof value === 'string' ? value.toLowerCase().trim() : value;
  });
  
  console.log("Dados normalizados:", normalized);
  
  // 2. Pick específico
  const userOnly = ObjectTransformer.pick(testData, ['user']);
  console.log("Apenas user:", userOnly);
  
  // 3. Merge com outros dados
  const additionalData = {
    user: { email: "joao@email.com" },
    config: { debug: true }
  };
  
  const merged = ObjectTransformer.merge(testData, additionalData);
  console.log("Dados merged:", merged);
  
  // 4. Validação
  const schema = {
    required: ['user'],
    properties: {
      user: {
        type: 'object',
        validator: (value) => value && 'name' in value
      },
      settings: {
        type: 'object'
      }
    },
    additionalProperties: true
  };
  
  const validation = ObjectTransformer.validate(testData, schema);
  console.log("Validação:", validation);
  
  // 5. Diff
  const modifiedData = {
    ...testData,
    user: { ...testData.user, name: "João Silva", age: 31 },
    newField: "added"
  };
  
  const diff = ObjectTransformer.diff(testData, modifiedData);
  console.log("Diff:", diff);
}

demonstrarObjectTransformer();
```

---

## 🎯 Aplicabilidade e Contextos

### Serialization/Deserialization

```javascript
// Serialização e deserialização avançada com Object.entries()

class AdvancedSerializer {
  constructor(options = {}) {
    this.options = {
      includeNonEnumerable: false,
      includeSymbols: false,
      maxDepth: 10,
      dateFormat: 'iso',
      functionHandling: 'ignore', // 'ignore', 'string', 'error'
      circularHandling: 'error',  // 'error', 'ignore', 'reference'
      ...options
    };
    
    this.refs = new WeakMap();
    this.refCounter = 0;
  }
  
  serialize(obj, depth = 0) {
    // Controle de profundidade
    if (depth > this.options.maxDepth) {
      return '[Max Depth Exceeded]';
    }
    
    // Valores primitivos
    if (obj === null || typeof obj !== 'object') {
      return this.serializePrimitive(obj);
    }
    
    // Controle de referências circulares
    if (this.refs.has(obj)) {
      if (this.options.circularHandling === 'error') {
        throw new Error('Circular reference detected');
      } else if (this.options.circularHandling === 'reference') {
        return `[Circular:${this.refs.get(obj)}]`;
      } else {
        return '[Circular]';
      }
    }
    
    const refId = ++this.refCounter;
    this.refs.set(obj, refId);
    
    try {
      // Arrays
      if (Array.isArray(obj)) {
        return obj.map(item => this.serialize(item, depth + 1));
      }
      
      // Dates
      if (obj instanceof Date) {
        return this.options.dateFormat === 'iso' ? 
          obj.toISOString() : obj.getTime();
      }
      
      // RegExp
      if (obj instanceof RegExp) {
        return {
          __type: 'RegExp',
          source: obj.source,
          flags: obj.flags
        };
      }
      
      // Objects
      const result = {};
      
      // Propriedades enumeráveis
      Object.entries(obj).forEach(([key, value]) => {
        result[key] = this.serialize(value, depth + 1);
      });
      
      // Propriedades não-enumeráveis (opcional)
      if (this.options.includeNonEnumerable) {
        Object.getOwnPropertyNames(obj).forEach(key => {
          if (!obj.propertyIsEnumerable(key)) {
            result[`__nonEnum_${key}`] = this.serialize(obj[key], depth + 1);
          }
        });
      }
      
      // Symbols (opcional)
      if (this.options.includeSymbols) {
        Object.getOwnPropertySymbols(obj).forEach(symbol => {
          result[`__symbol_${symbol.toString()}`] = 
            this.serialize(obj[symbol], depth + 1);
        });
      }
      
      return result;
      
    } finally {
      this.refs.delete(obj);
    }
  }
  
  serializePrimitive(value) {
    if (typeof value === 'function') {
      switch (this.options.functionHandling) {
        case 'string':
          return { __type: 'Function', code: value.toString() };
        case 'error':
          throw new Error('Cannot serialize function');
        default:
          return '[Function]';
      }
    }
    
    if (typeof value === 'undefined') {
      return { __type: 'undefined' };
    }
    
    if (typeof value === 'symbol') {
      return { __type: 'Symbol', description: value.toString() };
    }
    
    return value;
  }
  
  deserialize(serializedObj) {
    if (serializedObj === null || typeof serializedObj !== 'object') {
      return this.deserializePrimitive(serializedObj);
    }
    
    // Verificar tipos especiais
    if (serializedObj.__type) {
      switch (serializedObj.__type) {
        case 'undefined':
          return undefined;
        case 'Function':
          return this.options.functionHandling === 'string' ?
            new Function('return ' + serializedObj.code)() :
            () => {};
        case 'Symbol':
          return Symbol(serializedObj.description);
        case 'RegExp':
          return new RegExp(serializedObj.source, serializedObj.flags);
      }
    }
    
    // Arrays
    if (Array.isArray(serializedObj)) {
      return serializedObj.map(item => this.deserialize(item));
    }
    
    // Objects
    const result = {};
    
    Object.entries(serializedObj).forEach(([key, value]) => {
      if (key.startsWith('__nonEnum_')) {
        // Propriedade não-enumerável
        const realKey = key.substring(10);
        Object.defineProperty(result, realKey, {
          value: this.deserialize(value),
          enumerable: false,
          configurable: true,
          writable: true
        });
      } else if (key.startsWith('__symbol_')) {
        // Symbol property
        const symbolKey = Symbol(key.substring(9));
        result[symbolKey] = this.deserialize(value);
      } else {
        result[key] = this.deserialize(value);
      }
    });
    
    return result;
  }
  
  deserializePrimitive(value) {
    return value;
  }
}

// Configuration Management System
class ConfigManager {
  constructor() {
    this.configs = new Map();
    this.watchers = new Map();
    this.serializer = new AdvancedSerializer({
      includeNonEnumerable: true,
      circularHandling: 'ignore'
    });
  }
  
  setConfig(name, config) {
    const oldConfig = this.configs.get(name);
    this.configs.set(name, config);
    
    // Notificar watchers
    if (this.watchers.has(name)) {
      this.watchers.get(name).forEach(callback => {
        callback(config, oldConfig);
      });
    }
    
    return this;
  }
  
  getConfig(name, path = null) {
    const config = this.configs.get(name);
    
    if (!config) return null;
    
    if (!path) return config;
    
    // Navegar pelo path usando entries
    return path.split('.').reduce((current, key) => {
      return current && current[key];
    }, config);
  }
  
  mergeConfig(name, updates) {
    const existing = this.configs.get(name) || {};
    const merged = this.deepMerge(existing, updates);
    this.setConfig(name, merged);
    
    return merged;
  }
  
  deepMerge(target, source) {
    const result = { ...target };
    
    Object.entries(source).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && 
          typeof result[key] === 'object' && result[key] !== null &&
          !Array.isArray(value) && !Array.isArray(result[key])) {
        result[key] = this.deepMerge(result[key], value);
      } else {
        result[key] = value;
      }
    });
    
    return result;
  }
  
  watch(name, callback) {
    if (!this.watchers.has(name)) {
      this.watchers.set(name, new Set());
    }
    
    this.watchers.get(name).add(callback);
    
    return () => {
      this.watchers.get(name).delete(callback);
    };
  }
  
  export(format = 'json') {
    const data = {};
    
    this.configs.forEach((config, name) => {
      data[name] = config;
    });
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'serialized':
        return this.serializer.serialize(data);
      case 'entries':
        return Object.entries(data);
      default:
        return data;
    }
  }
  
  import(data, format = 'json') {
    let parsedData;
    
    switch (format) {
      case 'json':
        parsedData = JSON.parse(data);
        break;
      case 'serialized':
        parsedData = this.serializer.deserialize(data);
        break;
      case 'entries':
        parsedData = Object.fromEntries(data);
        break;
      default:
        parsedData = data;
    }
    
    Object.entries(parsedData).forEach(([name, config]) => {
      this.setConfig(name, config);
    });
  }
  
  analyze() {
    const analysis = {
      totalConfigs: this.configs.size,
      configSizes: {},
      typeDistribution: {},
      watcherCount: 0
    };
    
    this.configs.forEach((config, name) => {
      const entries = Object.entries(config);
      analysis.configSizes[name] = entries.length;
      
      entries.forEach(([key, value]) => {
        const type = typeof value;
        analysis.typeDistribution[type] = 
          (analysis.typeDistribution[type] || 0) + 1;
      });
    });
    
    this.watchers.forEach(watcherSet => {
      analysis.watcherCount += watcherSet.size;
    });
    
    return analysis;
  }
}

// Demonstração do sistema
function demonstrarConfigSystem() {
  console.log("\n=== Demonstração do Config System ===");
  
  const configManager = new ConfigManager();
  
  // Configuração de app
  const appConfig = {
    database: {
      host: "localhost",
      port: 5432,
      name: "myapp"
    },
    api: {
      baseUrl: "https://api.example.com",
      timeout: 5000,
      retries: 3
    },
    features: {
      logging: true,
      debug: false,
      analytics: true
    }
  };
  
  configManager.setConfig('app', appConfig);
  
  // Watch changes
  const unwatch = configManager.watch('app', (newConfig, oldConfig) => {
    console.log("Config 'app' atualizada:", {
      old: oldConfig?.features,
      new: newConfig.features
    });
  });
  
  // Merge updates
  configManager.mergeConfig('app', {
    features: { debug: true, newFeature: "enabled" },
    newSection: { value: "test" }
  });
  
  // Analysis
  console.log("Análise:", configManager.analyze());
  
  // Export/Import
  const exported = configManager.export('entries');
  console.log("Exported entries:", exported);
  
  unwatch(); // Cleanup watcher
}

demonstrarConfigSystem();
```

---

## 📚 Conclusão

**`Object.entries()`** é o **método mais versátil** da família de métodos de iteração de objetos, fornecendo **acesso simultâneo** a chaves e valores através de **tuplas bem estruturadas**.

**Características distintivas:**
- **Dual Access:** Acesso simultâneo a chaves e valores
- **Tuple Structure:** Formato consistente `[key, value]`
- **Destructuring Friendly:** Otimizado para destructuring patterns
- **Map Integration:** Base natural para conversões Object ↔ Map
- **Functional Ready:** Ideal para padrões funcionais avançados

**Aplicações estratégicas:**
- **Data transformation** e processamento
- **Object merging** e manipulação
- **Serialization/deserialization** avançada
- **Configuration management** systems
- **Schema validation** e análise

É a **escolha preferencial** quando **ambos elementos** (chave e valor) são necessários simultaneamente, oferecendo **máxima flexibilidade** para transformação e manipulação de estruturas de dados complexas.