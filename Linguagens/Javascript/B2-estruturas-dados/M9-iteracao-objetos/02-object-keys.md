# Object.keys() em JavaScript: Extração e Manipulação de Propriedades Enumeráveis

## 🎯 Introdução e Definição

### Definição Conceitual

**`Object.keys()`** é um **método estático** do objeto `Object` que **extrai** e **retorna um array** contendo todas as **propriedades enumeráveis próprias** (own enumerable properties) de um objeto como **strings**. Representa uma **abstração funcional** sobre o processo de **property enumeration**, fornecendo **acesso direto** às chaves sem necessidade de iteração manual.

Conceitualmente, `Object.keys()` implementa uma **operação de projeção** que mapeia um objeto para o **conjunto ordenado** de suas propriedades enumeráveis, excluindo **propriedades herdadas** da prototype chain e **propriedades não-enumeráveis**.

### Sintaxe e Comportamento Fundamental

```javascript
Object.keys(obj) // Retorna Array<string>
```

**Características essenciais:**
- Retorna **array de strings** (property names)
- Inclui **apenas propriedades próprias** (não herdadas)
- Respeita **enumerable descriptor** (enumerable: true)
- Ordem garantida desde **ES2015** (integer-like keys first, then insertion order)

### Problema Fundamental que Resolve

Resolve a necessidade de **obter programaticamente** as chaves de um objeto de forma **consistente** e **previsível**, sem os **efeitos colaterais** do `for...in` (propriedades herdadas) e com **garantias de ordenação** para manipulação funcional de dados.

**Sem Object.keys():**
```javascript
// Seria necessário usar for...in + hasOwnProperty
const obj = { a: 1, b: 2, c: 3 };
const keys = [];
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    keys.push(key);
  }
}
console.log(keys); // ['a', 'b', 'c']
```

**Com Object.keys():**
```javascript
const obj = { a: 1, b: 2, c: 3 };
const keys = Object.keys(obj);
console.log(keys); // ['a', 'b', 'c']
```

---

## 📋 Sumário Conceitual

### Aspectos Fundamentais

1. **Own Property Extraction:** Apenas propriedades próprias do objeto
2. **Enumerable Filtering:** Respeita enumerable descriptor
3. **String Conversion:** Keys sempre retornadas como strings
4. **Ordered Array:** Resultado em array com ordem garantida
5. **Shallow Operation:** Não percorre propriedades aninhadas

### Características Operacionais

- **Return Type:** Array<string> (nunca undefined/null)
- **Empty Objects:** Retorna array vazio `[]`
- **Primitive Coercion:** Converte primitives para objects temporários
- **Non-Object Inputs:** Comportamento específico para cada tipo

---

## 🧠 Fundamentos Teóricos

### Mecânicas Internas de Property Extraction

#### Algoritmo de Extração
```javascript
// Demonstração das mecânicas internas do Object.keys()

function demonstrarMecanicasInternas() {
  console.log("=== Mecânicas Internas do Object.keys() ===");
  
  // Objeto com diferentes tipos de propriedades
  const obj = {};
  
  // Propriedade enumerável (padrão)
  obj.enumeravel = "visível";
  
  // Propriedade não-enumerável
  Object.defineProperty(obj, 'naoEnumeravel', {
    value: "invisível",
    enumerable: false,
    writable: true,
    configurable: true
  });
  
  // Propriedade Symbol (não incluída em Object.keys())
  const sym = Symbol('simbolo');
  obj[sym] = "símbolo invisível";
  
  // Propriedades herdadas
  Object.getPrototypeOf(obj).herdada = "propriedade herdada";
  
  console.log("Objeto completo:", obj);
  console.log("Object.keys() resultado:", Object.keys(obj));
  
  // Comparação com outros métodos
  console.log("\n=== Comparação de Métodos ===");
  console.log("Object.keys():", Object.keys(obj));
  console.log("Object.getOwnPropertyNames():", Object.getOwnPropertyNames(obj));
  console.log("Object.getOwnPropertySymbols():", Object.getOwnPropertySymbols(obj));
  
  // for...in para comparação
  const forInKeys = [];
  for (const key in obj) {
    forInKeys.push(key);
  }
  console.log("for...in keys:", forInKeys);
  
  // Análise detalhada dos descriptors
  console.log("\n=== Property Descriptors ===");
  Object.getOwnPropertyNames(obj).forEach(key => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    console.log(`${key}:`, {
      enumerable: descriptor.enumerable,
      incluídoEmKeys: Object.keys(obj).includes(key)
    });
  });
}

demonstrarMecanicasInternas();

// Simulação do algoritmo interno (simplificado)
function simularObjectKeys(obj) {
  console.log("\n=== Simulação do Algoritmo Object.keys() ===");
  
  // 1. Converter para objeto se necessário
  const O = Object(obj);
  
  // 2. Obter todas as propriedades próprias
  const ownProps = Object.getOwnPropertyNames(O);
  
  // 3. Filtrar apenas as enumeráveis
  const enumerableKeys = ownProps.filter(key => {
    const descriptor = Object.getOwnPropertyDescriptor(O, key);
    return descriptor && descriptor.enumerable;
  });
  
  // 4. Ordenar conforme especificação ES2015+
  const numericKeys = [];
  const stringKeys = [];
  
  enumerableKeys.forEach(key => {
    const num = Number(key);
    if (Number.isInteger(num) && num >= 0 && num < 2**32 - 1) {
      numericKeys.push(key);
    } else {
      stringKeys.push(key);
    }
  });
  
  // Numeric keys em ordem numérica, string keys em ordem de inserção
  numericKeys.sort((a, b) => Number(a) - Number(b));
  
  const resultado = [...numericKeys, ...stringKeys];
  
  console.log("Algoritmo simulado:", resultado);
  console.log("Object.keys() real:", Object.keys(obj));
  console.log("Resultados iguais:", 
    JSON.stringify(resultado) === JSON.stringify(Object.keys(obj))
  );
  
  return resultado;
}

// Teste da simulação
const testObj = {
  '10': 'dez',
  'b': 'segundo',
  '2': 'dois',
  'a': 'primeiro',
  '1': 'um'
};

simularObjectKeys(testObj);
```

#### Ordenação Garantida (ES2015+)
```javascript
// Análise da ordenação garantida pelo Object.keys()

function analisarOrdenacao() {
  console.log("\n=== Ordenação Garantida ES2015+ ===");
  
  const obj = {};
  
  // Adicionar propriedades em ordem "caótica"
  obj.z = "último alfabético";
  obj['100'] = "cem";
  obj.a = "primeiro alfabético"; 
  obj['2'] = "dois";
  obj.m = "meio alfabético";
  obj['1'] = "um";
  obj['10'] = "dez";
  obj.b = "segundo alfabético";
  
  console.log("Ordem de inserção:", 
    ['z', '100', 'a', '2', 'm', '1', '10', 'b']
  );
  console.log("Object.keys() resultado:", Object.keys(obj));
  
  // Análise da regra de ordenação:
  // 1. Array indices (integer-like strings) em ordem numérica
  // 2. Outras string properties na ordem de criação
  
  const keys = Object.keys(obj);
  const numericKeys = keys.filter(key => {
    const num = Number(key);
    return Number.isInteger(num) && num >= 0;
  });
  const stringKeys = keys.filter(key => {
    const num = Number(key);
    return !(Number.isInteger(num) && num >= 0);
  });
  
  console.log("\nAnálise da ordenação:");
  console.log("Keys numéricas (em ordem numérica):", numericKeys);
  console.log("Keys string (em ordem de criação):", stringKeys);
  
  // Teste de consistência
  console.log("\nTeste de consistência:");
  for (let i = 0; i < 5; i++) {
    const keysRepeat = Object.keys(obj);
    const consistent = JSON.stringify(keys) === JSON.stringify(keysRepeat);
    console.log(`Iteração ${i + 1}: ${consistent ? '✓' : '✗'}`);
  }
}

analisarOrdenacao();

// Comportamento com diferentes tipos de objetos
function testarDiferentesTipos() {
  console.log("\n=== Comportamento com Diferentes Tipos ===");
  
  // Array
  const arr = ['a', 'b', 'c'];
  arr.customProp = 'custom';
  console.log("Array:", arr);
  console.log("Object.keys(array):", Object.keys(arr));
  
  // String
  const str = "hello";
  console.log("\nString:", str);
  console.log("Object.keys(string):", Object.keys(str));
  
  // Número
  const num = 42;
  console.log("\nNúmero:", num);
  console.log("Object.keys(number):", Object.keys(num));
  
  // Boolean
  const bool = true;
  console.log("\nBoolean:", bool);
  console.log("Object.keys(boolean):", Object.keys(bool));
  
  // null e undefined
  console.log("\nTeste com null/undefined:");
  try {
    console.log("Object.keys(null):", Object.keys(null));
  } catch (e) {
    console.log("Object.keys(null) erro:", e.message);
  }
  
  try {
    console.log("Object.keys(undefined):", Object.keys(undefined));
  } catch (e) {
    console.log("Object.keys(undefined) erro:", e.message);
  }
  
  // Função
  function testFunc() {}
  testFunc.customProp = 'função tem propriedades';
  console.log("\nFunção:", testFunc);
  console.log("Object.keys(function):", Object.keys(testFunc));
}

testarDiferentesTipos();
```

### Performance Analysis e Optimization

#### Benchmark Comparativo
```javascript
// Análise de performance do Object.keys() vs alternativas

function performanceBenchmark() {
  console.log("\n=== Performance Benchmark ===");
  
  // Criar objeto de teste grande
  const largeObj = {};
  const numProps = 10000;
  
  for (let i = 0; i < numProps; i++) {
    largeObj[`prop${i}`] = `value${i}`;
  }
  
  console.log(`Testando com objeto de ${numProps} propriedades`);
  
  const iterations = 1000;
  
  // 1. Object.keys()
  console.time("Object.keys()");
  for (let i = 0; i < iterations; i++) {
    const keys = Object.keys(largeObj);
  }
  console.timeEnd("Object.keys()");
  
  // 2. for...in + hasOwnProperty
  console.time("for...in + hasOwnProperty");
  for (let i = 0; i < iterations; i++) {
    const keys = [];
    for (const key in largeObj) {
      if (largeObj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
  }
  console.timeEnd("for...in + hasOwnProperty");
  
  // 3. Object.getOwnPropertyNames() + filter
  console.time("getOwnPropertyNames + filter");
  for (let i = 0; i < iterations; i++) {
    const allProps = Object.getOwnPropertyNames(largeObj);
    const keys = allProps.filter(key => {
      const descriptor = Object.getOwnPropertyDescriptor(largeObj, key);
      return descriptor.enumerable;
    });
  }
  console.timeEnd("getOwnPropertyNames + filter");
  
  // Análise de memory footprint
  console.log("\n=== Memory Footprint ===");
  
  const keys1 = Object.keys(largeObj);
  const keys2 = [];
  for (const key in largeObj) {
    if (largeObj.hasOwnProperty(key)) {
      keys2.push(key);
    }
  }
  
  console.log("Object.keys() length:", keys1.length);
  console.log("Manual array length:", keys2.length);
  console.log("Resultados iguais:", 
    JSON.stringify(keys1.slice(0, 10)) === JSON.stringify(keys2.slice(0, 10))
  );
}

performanceBenchmark();

// Otimizações específicas
function otimizacoesEspecificas() {
  console.log("\n=== Otimizações Específicas ===");
  
  const obj = {
    a: 1, b: 2, c: 3, d: 4, e: 5,
    f: 6, g: 7, h: 8, i: 9, j: 10
  };
  
  // Cache de keys quando objeto não muda
  console.time("Object.keys() repetido");
  for (let i = 0; i < 10000; i++) {
    const keys = Object.keys(obj);
  }
  console.timeEnd("Object.keys() repetido");
  
  // Cache manual
  console.time("Cache manual");
  let cachedKeys = null;
  for (let i = 0; i < 10000; i++) {
    if (!cachedKeys) {
      cachedKeys = Object.keys(obj);
    }
    const keys = cachedKeys;
  }
  console.timeEnd("Cache manual");
  
  // Early return para objetos vazios
  function getKeysOptimized(obj) {
    // Quick check para objetos vazios
    if (!obj || typeof obj !== 'object') return [];
    
    // Para objetos pequenos, Object.keys é mais eficiente
    const keys = Object.keys(obj);
    return keys;
  }
  
  console.log("Função otimizada para objeto vazio:", 
    getKeysOptimized({}).length
  );
}

otimizacoesEspecificas();
```

---

## 🔍 Análise Conceitual Profunda

### Polyfill Implementation e Compatibilidade

#### Implementação de Polyfill
```javascript
// Implementação de polyfill para Object.keys() (ES5 compatibility)

function implementarPolyfill() {
  console.log("\n=== Implementação de Polyfill ===");
  
  // Polyfill para Object.keys (se não existir)
  if (!Object.keys) {
    Object.keys = function(obj) {
      // Verificar se é objeto
      if (obj !== Object(obj)) {
        throw new TypeError('Object.keys called on non-object');
      }
      
      const keys = [];
      
      // Usar for...in + hasOwnProperty para emular comportamento
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          keys.push(key);
        }
      }
      
      return keys;
    };
  }
  
  // Versão mais completa do polyfill
  function objectKeysPolyfill(obj) {
    console.log("Executando polyfill customizado");
    
    // 1. Conversão para objeto
    const O = Object(obj);
    
    // 2. Array para armazenar keys
    const keys = [];
    
    // 3. Iterar e coletar propriedades próprias enumeráveis
    for (const key in O) {
      if (Object.prototype.hasOwnProperty.call(O, key)) {
        // Verificar se é enumerável (no polyfill básico, for...in já filtra)
        const descriptor = Object.getOwnPropertyDescriptor ? 
          Object.getOwnPropertyDescriptor(O, key) : 
          { enumerable: true }; // Fallback para ambientes muito antigos
          
        if (descriptor.enumerable) {
          keys.push(key);
        }
      }
    }
    
    // 4. Ordenar se necessário (ES5 não garantia ordem)
    // Em ES2015+, a ordem é garantida pela engine
    
    return keys;
  }
  
  // Teste do polyfill
  const testObj = {
    prop1: "valor1",
    prop2: "valor2",
    prop3: "valor3"
  };
  
  console.log("Object.keys() nativo:", Object.keys(testObj));
  console.log("Polyfill resultado:", objectKeysPolyfill(testObj));
  
  // Teste com casos especiais
  console.log("\nTestes especiais do polyfill:");
  
  // String
  console.log("String 'abc':", objectKeysPolyfill("abc"));
  
  // Array
  console.log("Array [1,2,3]:", objectKeysPolyfill([1, 2, 3]));
  
  // Objeto vazio
  console.log("Objeto vazio:", objectKeysPolyfill({}));
  
  // Comparação de compatibilidade
  const inputs = ["abc", [1, 2, 3], { a: 1, b: 2 }, {}];
  
  inputs.forEach(input => {
    const nativo = Object.keys(input);
    const polyfill = objectKeysPolyfill(input);
    const igual = JSON.stringify(nativo) === JSON.stringify(polyfill);
    
    console.log(`Input ${JSON.stringify(input)}: ${igual ? '✓' : '✗'}`);
  });
}

implementarPolyfill();
```

### Integration com Functional Programming

#### Functional Programming Patterns
```javascript
// Object.keys() em padrões de programação funcional

function functionalProgrammingPatterns() {
  console.log("\n=== Functional Programming com Object.keys() ===");
  
  const dados = {
    nome: "João Silva",
    idade: 30,
    salario: 5000,
    ativo: true,
    departamento: "TI"
  };
  
  // 1. Map - transformar keys
  const keysUpperCase = Object.keys(dados).map(key => key.toUpperCase());
  console.log("Keys em maiúsculo:", keysUpperCase);
  
  // 2. Filter - filtrar keys por critério
  const keysString = Object.keys(dados).filter(key => 
    typeof dados[key] === 'string'
  );
  console.log("Keys com valores string:", keysString);
  
  // 3. Reduce - criar novo objeto baseado em keys
  const objetoFiltrado = Object.keys(dados)
    .filter(key => typeof dados[key] !== 'boolean')
    .reduce((acc, key) => {
      acc[key] = dados[key];
      return acc;
    }, {});
  
  console.log("Objeto sem booleans:", objetoFiltrado);
  
  // 4. Composição de funções
  const processarObjeto = (obj) => 
    Object.keys(obj)
      .filter(key => key.length > 4)  // Keys com mais de 4 caracteres
      .map(key => ({                  // Transformar em objetos
        key,
        value: obj[key],
        type: typeof obj[key]
      }))
      .sort((a, b) => a.key.localeCompare(b.key)); // Ordenar por key
  
  const resultado = processarObjeto(dados);
  console.log("Processamento funcional:", resultado);
  
  // 5. Pipeline de transformações
  const pipeline = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);
  
  const extrairKeys = obj => Object.keys(obj);
  const filtrarNumericos = keys => keys.filter(key => !isNaN(Number(key)));
  const ordenarDecrescente = keys => [...keys].sort((a, b) => Number(b) - Number(a));
  
  const processarKeysNumericas = pipeline(
    extrairKeys,
    filtrarNumericos, 
    ordenarDecrescente
  );
  
  const objComKeysNumericas = {
    '10': 'dez',
    'nome': 'string',
    '5': 'cinco',
    'idade': 30,
    '1': 'um'
  };
  
  console.log("Keys numéricas processadas:", 
    processarKeysNumericas(objComKeysNumericas)
  );
}

functionalProgrammingPatterns();

// Utilities funcionais com Object.keys()
const ObjectUtils = {
  // Mapear objeto mantendo keys, transformando valores
  mapValues(obj, fn) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = fn(obj[key], key, obj);
      return acc;
    }, {});
  },
  
  // Filtrar objeto por keys
  filterByKeys(obj, predicate) {
    return Object.keys(obj)
      .filter(predicate)
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {});
  },
  
  // Renomear keys de objeto
  renameKeys(obj, keyMap) {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = keyMap[key] || key;
      acc[newKey] = obj[key];
      return acc;
    }, {});
  },
  
  // Agrupar propriedades por tipo de valor
  groupByValueType(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      const type = typeof obj[key];
      if (!acc[type]) acc[type] = {};
      acc[type][key] = obj[key];
      return acc;
    }, {});
  },
  
  // Análise estatística das keys
  analyzeKeys(obj) {
    const keys = Object.keys(obj);
    return {
      count: keys.length,
      avgLength: keys.reduce((sum, key) => sum + key.length, 0) / keys.length,
      longest: keys.reduce((max, key) => key.length > max.length ? key : max, ''),
      shortest: keys.reduce((min, key) => key.length < min.length ? key : min, keys[0] || ''),
      hasNumericKeys: keys.some(key => !isNaN(Number(key))),
      uniqueChars: new Set(keys.join('')).size
    };
  }
};

// Demonstração dos utilities
function demonstrarUtils() {
  console.log("\n=== Utilities Funcionais ===");
  
  const pessoa = {
    firstName: "João",
    lastName: "Silva", 
    age: 30,
    salary: 5000,
    active: true
  };
  
  // mapValues
  const pessoaUpperCase = ObjectUtils.mapValues(pessoa, value => 
    typeof value === 'string' ? value.toUpperCase() : value
  );
  console.log("Valores em maiúsculo:", pessoaUpperCase);
  
  // filterByKeys  
  const apenasNomes = ObjectUtils.filterByKeys(pessoa, key => 
    key.includes('Name')
  );
  console.log("Apenas nomes:", apenasNomes);
  
  // renameKeys
  const pessoaPortugues = ObjectUtils.renameKeys(pessoa, {
    firstName: 'nome',
    lastName: 'sobrenome',
    age: 'idade',
    salary: 'salario',
    active: 'ativo'
  });
  console.log("Keys em português:", pessoaPortugues);
  
  // groupByValueType
  const agrupado = ObjectUtils.groupByValueType(pessoa);
  console.log("Agrupado por tipo:", agrupado);
  
  // analyzeKeys
  const analise = ObjectUtils.analyzeKeys(pessoa);
  console.log("Análise das keys:", analise);
}

demonstrarUtils();
```

---

## 🎯 Aplicabilidade e Contextos

### Object Transformation e Data Processing

```javascript
// Transformação de objetos usando Object.keys()

function demonstrarTransformacoes() {
  console.log("\n=== Object Transformation ===");
  
  // Dados de exemplo
  const userData = {
    id: 1,
    name: "Ana Costa",
    email: "ana@email.com",
    age: 28,
    department: "Marketing",
    salary: 4500,
    active: true,
    lastLogin: "2024-01-15"
  };
  
  // 1. Sanitização - remover propriedades sensíveis
  function sanitizeUser(user, sensitiveFields = ['salary', 'lastLogin']) {
    return Object.keys(user)
      .filter(key => !sensitiveFields.includes(key))
      .reduce((sanitized, key) => {
        sanitized[key] = user[key];
        return sanitized;
      }, {});
  }
  
  const userPublic = sanitizeUser(userData);
  console.log("Usuário sanitizado:", userPublic);
  
  // 2. Validação de schema
  function validateSchema(obj, requiredFields, optionalFields = []) {
    const objKeys = Object.keys(obj);
    const allowedKeys = [...requiredFields, ...optionalFields];
    
    const validation = {
      valid: true,
      errors: [],
      warnings: []
    };
    
    // Verificar campos obrigatórios
    requiredFields.forEach(field => {
      if (!objKeys.includes(field)) {
        validation.valid = false;
        validation.errors.push(`Campo obrigatório ausente: ${field}`);
      }
    });
    
    // Verificar campos não permitidos
    objKeys.forEach(key => {
      if (!allowedKeys.includes(key)) {
        validation.warnings.push(`Campo não reconhecido: ${key}`);
      }
    });
    
    return validation;
  }
  
  const schemaValidation = validateSchema(
    userData,
    ['id', 'name', 'email'], // obrigatórios
    ['age', 'department', 'active', 'salary', 'lastLogin'] // opcionais
  );
  
  console.log("Validação de schema:", schemaValidation);
  
  // 3. Normalização de dados
  function normalizeObject(obj, normalizers = {}) {
    return Object.keys(obj).reduce((normalized, key) => {
      let value = obj[key];
      
      // Aplicar normalizer específico se existir
      if (normalizers[key]) {
        value = normalizers[key](value);
      }
      // Normalizer por tipo
      else if (typeof value === 'string') {
        value = value.trim();
      }
      
      normalized[key] = value;
      return normalized;
    }, {});
  }
  
  const normalizers = {
    email: email => email.toLowerCase(),
    name: name => name.split(' ').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ')
  };
  
  const normalizedUser = normalizeObject(userData, normalizers);
  console.log("Usuário normalizado:", normalizedUser);
}

demonstrarTransformacoes();
```

### Configuration Management

```javascript
// Gerenciamento de configurações com Object.keys()

class ConfigManager {
  constructor(defaultConfig = {}) {
    this.defaultConfig = defaultConfig;
    this.currentConfig = { ...defaultConfig };
    this.configHistory = [];
  }
  
  // Merge configurações usando Object.keys()
  mergeConfig(newConfig) {
    console.log("=== Merge de Configuração ===");
    
    const beforeKeys = Object.keys(this.currentConfig);
    console.log("Keys antes:", beforeKeys);
    
    // Salvar estado atual no histórico
    this.configHistory.push({
      timestamp: Date.now(),
      config: { ...this.currentConfig }
    });
    
    // Processar novas configurações
    Object.keys(newConfig).forEach(key => {
      const newValue = newConfig[key];
      const currentValue = this.currentConfig[key];
      
      console.log(`Processando ${key}: ${currentValue} → ${newValue}`);
      
      // Validação específica por key
      if (this.validateConfigKey(key, newValue)) {
        this.currentConfig[key] = newValue;
      } else {
        console.warn(`Valor inválido para ${key}: ${newValue}`);
      }
    });
    
    const afterKeys = Object.keys(this.currentConfig);
    console.log("Keys depois:", afterKeys);
    
    return this;
  }
  
  // Validação de configuração
  validateConfigKey(key, value) {
    const validators = {
      port: val => Number.isInteger(val) && val > 0 && val < 65536,
      host: val => typeof val === 'string' && val.length > 0,
      debug: val => typeof val === 'boolean',
      timeout: val => Number.isInteger(val) && val > 0
    };
    
    const validator = validators[key];
    return validator ? validator(value) : true; // Default: aceitar
  }
  
  // Diferenças entre configurações
  getDifferences(otherConfig = {}) {
    const currentKeys = Object.keys(this.currentConfig);
    const otherKeys = Object.keys(otherConfig);
    
    const differences = {
      added: otherKeys.filter(key => !currentKeys.includes(key)),
      removed: currentKeys.filter(key => !otherKeys.includes(key)),
      modified: currentKeys.filter(key => 
        otherKeys.includes(key) && 
        this.currentConfig[key] !== otherConfig[key]
      )
    };
    
    return differences;
  }
  
  // Exportar apenas configurações não-default
  exportModified() {
    return Object.keys(this.currentConfig)
      .filter(key => this.currentConfig[key] !== this.defaultConfig[key])
      .reduce((modified, key) => {
        modified[key] = this.currentConfig[key];
        return modified;
      }, {});
  }
  
  // Análise da configuração
  analyze() {
    const keys = Object.keys(this.currentConfig);
    
    return {
      totalKeys: keys.length,
      modifiedFromDefault: Object.keys(this.exportModified()).length,
      keysByType: keys.reduce((acc, key) => {
        const type = typeof this.currentConfig[key];
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}),
      longestKey: keys.reduce((max, key) => 
        key.length > max.length ? key : max, ''
      ),
      hasNestedObjects: keys.some(key => 
        typeof this.currentConfig[key] === 'object' && 
        this.currentConfig[key] !== null
      )
    };
  }
}

// Demonstração do ConfigManager
function demonstrarConfigManager() {
  console.log("\n=== Configuration Manager ===");
  
  const manager = new ConfigManager({
    host: 'localhost',
    port: 3000,
    debug: false,
    timeout: 5000
  });
  
  console.log("Configuração inicial:", manager.currentConfig);
  
  // Aplicar novas configurações
  manager.mergeConfig({
    host: 'production.com',
    port: 8080,
    debug: true,
    newFeature: 'enabled'
  });
  
  console.log("Após merge:", manager.currentConfig);
  
  // Análise
  const analysis = manager.analyze();
  console.log("Análise:", analysis);
  
  // Configurações modificadas
  const modified = manager.exportModified();
  console.log("Apenas modificadas:", modified);
  
  // Diferenças
  const differences = manager.getDifferences({
    host: 'localhost',
    port: 9000,
    ssl: true
  });
  console.log("Diferenças:", differences);
}

demonstrarConfigManager();
```

---

## 📚 Conclusão

**`Object.keys()`** é um **método fundamental** para **extração de propriedades** em JavaScript, fornecendo **acesso consistente** e **ordenado** às chaves enumeráveis próprias de objetos.

**Características essenciais:**
- Retorna **array de strings** com propriedades próprias enumeráveis
- **Ordem garantida** desde ES2015+ (numeric keys primeiro, depois insertion order)
- **Performance superior** ao for...in + hasOwnProperty para casos simples
- **Base fundamental** para programação funcional com objetos

**Casos de uso principais:**
- **Object transformation** e data processing
- **Configuration management** e validation
- **Functional programming** patterns
- **Property iteration** sem efeitos colaterais do prototype chain

É **indispensável** para manipulação moderna de objetos, oferecendo **previsibilidade** e **performance** superiores às alternativas tradicionais.