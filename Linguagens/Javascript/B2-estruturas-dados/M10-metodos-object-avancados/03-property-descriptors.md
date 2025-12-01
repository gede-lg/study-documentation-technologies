# Property Descriptors em JavaScript: Estruturas de Metadados para Controle de Propriedades

## 🎯 Introdução e Definição

### Definição Conceitual

**Property Descriptors** são **objetos de metadados** que descrevem completamente as **características** e **comportamento** de uma propriedade em JavaScript. Funcionam como **blueprints** que especificam não apenas o **valor** ou **acessors** de uma propriedade, mas também seus **atributos comportamentais** como **enumerabilidade**, **mutabilidade** e **configurabilidade**.

Conceitualmente, representam o **modelo de dados** que JavaScript usa internamente para **gerenciar propriedades**, oferecendo **granularidade total** sobre como as propriedades se comportam em diferentes **contextos operacionais** como **iteração**, **serialização**, **modificação** e **remoção**.

### Tipos Fundamentais de Descriptors

**Existem dois tipos mutuamente exclusivos:**

1. **Data Descriptors** - Propriedades com valor direto
2. **Accessor Descriptors** - Propriedades com getters/setters

### Estrutura dos Property Descriptors

```javascript
// DATA DESCRIPTOR
{
  value: any,           // Valor da propriedade
  writable: boolean,    // Pode ser modificada?
  enumerable: boolean,  // Aparece em iterações?
  configurable: boolean // Pode ser reconfigurada/deletada?
}

// ACCESSOR DESCRIPTOR  
{
  get: function() {},   // Getter function
  set: function(val) {}, // Setter function
  enumerable: boolean,  // Aparece em iterações?
  configurable: boolean // Pode ser reconfigurada/deletada?
}
```

### Problema Fundamental que Resolve

Resolve a necessidade de **controle fino** sobre propriedades, permitindo **encapsulamento**, **immutability**, **computed properties**, **property hiding**, **access control** e **behavioral customization** que vão além da **atribuição simples** de propriedades.

---

## 📋 Sumário Conceitual

### Aspectos Fundamentais

1. **Descriptor Types:** Data vs Accessor - tipos mutuamente exclusivos
2. **Attribute Control:** enumerable, writable, configurable comportamentais
3. **Default Values:** Diferentes defaults para defineProperty vs assignment
4. **Validation Rules:** Combinações válidas e inválidas de atributos
5. **Inheritance Behavior:** Como descriptors afetam herança

### Características Operacionais

- **Mutual Exclusivity:** Data e Accessor descriptors não podem coexistir
- **Attribute Defaults:** false quando usando defineProperty, true para assignment
- **Validation Rules:** JavaScript valida consistência entre atributos
- **Immutable Structure:** Descriptors são snapshots, não referências

---

## 🧠 Fundamentos Teóricos

### Mecânicas de Descriptor Structure

#### Análise Profunda dos Tipos de Descriptors
```javascript
// Demonstração completa da estrutura de Property Descriptors

function analisarEstruturaDescriptors() {
  console.log("=== Análise da Estrutura de Property Descriptors ===");
  
  const testObj = {};
  
  // 1. DATA DESCRIPTOR - Completo
  Object.defineProperty(testObj, 'dataComplete', {
    value: 'data value',
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  // 2. DATA DESCRIPTOR - Mínimo (apenas value)
  Object.defineProperty(testObj, 'dataMinimal', {
    value: 'minimal data'
    // writable: false (default)
    // enumerable: false (default)
    // configurable: false (default)
  });
  
  // 3. ACCESSOR DESCRIPTOR - Completo
  let accessorStorage = 'initial';
  Object.defineProperty(testObj, 'accessorComplete', {
    get: function() {
      console.log("Getter called for accessorComplete");
      return accessorStorage;
    },
    set: function(newValue) {
      console.log("Setter called for accessorComplete with:", newValue);
      accessorStorage = String(newValue).toUpperCase();
    },
    enumerable: true,
    configurable: true
  });
  
  // 4. ACCESSOR DESCRIPTOR - Getter apenas
  Object.defineProperty(testObj, 'getterOnly', {
    get: function() {
      return new Date().toISOString();
    },
    enumerable: true
    // configurable: false (default)
  });
  
  // 5. ACCESSOR DESCRIPTOR - Setter apenas
  let setterOnlyStorage = null;
  Object.defineProperty(testObj, 'setterOnly', {
    set: function(value) {
      setterOnlyStorage = `Processed: ${value}`;
      console.log("Value processed and stored");
    },
    enumerable: false,
    configurable: true
  });
  
  console.log("=== Análise dos Descriptors Criados ===");
  
  const properties = ['dataComplete', 'dataMinimal', 'accessorComplete', 'getterOnly', 'setterOnly'];
  
  properties.forEach(prop => {
    const descriptor = Object.getOwnPropertyDescriptor(testObj, prop);
    console.log(`\n${prop}:`);
    console.log("  Descriptor:", descriptor);
    
    // Análise do tipo
    const isData = 'value' in descriptor;
    const isAccessor = 'get' in descriptor || 'set' in descriptor;
    
    console.log("  Type:", isData ? 'Data' : (isAccessor ? 'Accessor' : 'Unknown'));
    
    // Análise dos atributos
    console.log("  Attributes:");
    console.log("    enumerable:", descriptor.enumerable);
    console.log("    configurable:", descriptor.configurable);
    
    if (isData) {
      console.log("    writable:", descriptor.writable);
      console.log("    value:", typeof descriptor.value === 'string' ? `"${descriptor.value}"` : descriptor.value);
    } else {
      console.log("    has getter:", typeof descriptor.get === 'function');
      console.log("    has setter:", typeof descriptor.set === 'function');
    }
  });
  
  // Testar comportamentos
  console.log("\n=== Teste de Comportamentos ===");
  
  // Data properties
  console.log("dataComplete value:", testObj.dataComplete);
  testObj.dataComplete = 'modified';
  console.log("dataComplete after modification:", testObj.dataComplete);
  
  try {
    testObj.dataMinimal = 'attempt to modify';
    console.log("dataMinimal modification (should fail silently):", testObj.dataMinimal);
  } catch (error) {
    console.log("dataMinimal modification error:", error.message);
  }
  
  // Accessor properties
  console.log("accessorComplete value:", testObj.accessorComplete);
  testObj.accessorComplete = 'new accessor value';
  console.log("accessorComplete after setting:", testObj.accessorComplete);
  
  console.log("getterOnly value:", testObj.getterOnly);
  try {
    testObj.setterOnly = 'test value';
    console.log("setterOnly after setting (should be undefined on read):", testObj.setterOnly);
  } catch (error) {
    console.log("setterOnly error:", error.message);
  }
  
  // Enumeração
  console.log("\n=== Teste de Enumeração ===");
  console.log("Object.keys():", Object.keys(testObj));
  console.log("for...in loop:");
  for (const key in testObj) {
    console.log("  ", key, ":", testObj[key]);
  }
  
  return testObj;
}

const descriptorObj = analisarEstruturaDescriptors();

// Validação de Descriptor Rules
function validarDescriptorRules() {
  console.log("\n=== Validação de Descriptor Rules ===");
  
  const testObj = {};
  
  // Regra 1: Data e Accessor são mutuamente exclusivos
  console.log("=== Regra 1: Mutual Exclusivity ===");
  try {
    Object.defineProperty(testObj, 'invalidMix', {
      value: 'data value',        // Data descriptor
      get: () => 'getter value',  // Accessor descriptor
      enumerable: true
    });
    console.log("❌ Erro: Mistura não detectada");
  } catch (error) {
    console.log("✅ Erro correto:", error.message);
  }
  
  // Regra 2: writable só existe em Data Descriptors
  console.log("\n=== Regra 2: writable em Data Descriptor ===");
  try {
    Object.defineProperty(testObj, 'invalidWritable', {
      get: () => 'value',
      writable: true  // Inválido em accessor
    });
    console.log("❌ Erro: writable em accessor não detectado");
  } catch (error) {
    console.log("✅ Erro correto:", error.message);
  }
  
  // Regra 3: value só existe em Data Descriptors  
  console.log("\n=== Regra 3: value em Data Descriptor ===");
  try {
    Object.defineProperty(testObj, 'invalidValue', {
      get: () => 'getter',
      value: 'data value'  // Inválido com getter
    });
    console.log("❌ Erro: value com getter não detectado");
  } catch (error) {
    console.log("✅ Erro correto:", error.message);
  }
  
  // Regra 4: Descriptors válidos mínimos
  console.log("\n=== Regra 4: Descriptors Válidos Mínimos ===");
  
  // Data descriptor mínimo
  Object.defineProperty(testObj, 'minimalData', {
    value: 'just value'
    // Outros atributos ficam false
  });
  console.log("✅ Data descriptor mínimo:", Object.getOwnPropertyDescriptor(testObj, 'minimalData'));
  
  // Accessor descriptor com apenas getter
  Object.defineProperty(testObj, 'minimalGetter', {
    get: () => 'only getter'
  });
  console.log("✅ Accessor descriptor mínimo:", Object.getOwnPropertyDescriptor(testObj, 'minimalGetter'));
  
  // Accessor descriptor com apenas setter
  Object.defineProperty(testObj, 'minimalSetter', {
    set: (val) => console.log('Setting:', val)
  });
  console.log("✅ Setter-only descriptor:", Object.getOwnPropertyDescriptor(testObj, 'minimalSetter'));
  
  // Regra 5: Descriptor vazio (inválido)
  console.log("\n=== Regra 5: Descriptor Vazio ===");
  try {
    Object.defineProperty(testObj, 'emptyDescriptor', {
      enumerable: true,
      configurable: true
      // Sem value, get, ou set
    });
    console.log("✅ Descriptor vazio aceito (pode ser válido)");
  } catch (error) {
    console.log("❌ Descriptor vazio rejeitado:", error.message);
  }
}

validarDescriptorRules();
```

#### Attribute Combinations e Validation
```javascript
// Análise detalhada de combinações de atributos

function analisarCombinacoes() {
  console.log("\n=== Análise de Combinações de Atributos ===");
  
  const testObj = {};
  
  // Matrix de combinações para Data Descriptors
  const dataDescriptorTests = [
    { name: 'full-access', writable: true, enumerable: true, configurable: true },
    { name: 'read-only', writable: false, enumerable: true, configurable: true },
    { name: 'hidden', writable: true, enumerable: false, configurable: true },
    { name: 'locked', writable: true, enumerable: true, configurable: false },
    { name: 'protected', writable: false, enumerable: false, configurable: true },
    { name: 'constant', writable: false, enumerable: true, configurable: false },
    { name: 'secret', writable: true, enumerable: false, configurable: false },
    { name: 'immutable', writable: false, enumerable: false, configurable: false }
  ];
  
  console.log("=== Data Descriptor Combinations ===");
  
  dataDescriptorTests.forEach((test, index) => {
    const propName = `data_${test.name}`;
    
    Object.defineProperty(testObj, propName, {
      value: `value for ${test.name}`,
      writable: test.writable,
      enumerable: test.enumerable,
      configurable: test.configurable
    });
    
    console.log(`\n${test.name.toUpperCase()}:`);
    console.log(`  Property: ${propName}`);
    console.log(`  Attributes: W:${test.writable} E:${test.enumerable} C:${test.configurable}`);
    
    // Testar modificação
    const originalValue = testObj[propName];
    try {
      testObj[propName] = `modified ${test.name}`;
      const wasModified = testObj[propName] !== originalValue;
      console.log(`  Modification: ${wasModified ? 'SUCCESS' : 'FAILED (as expected)'}`);
    } catch (error) {
      console.log(`  Modification: ERROR - ${error.message}`);
    }
    
    // Testar enumeração
    const isEnumerable = Object.keys(testObj).includes(propName);
    console.log(`  Enumeration: ${isEnumerable ? 'VISIBLE' : 'HIDDEN'} (expected: ${test.enumerable ? 'VISIBLE' : 'HIDDEN'})`);
    
    // Testar reconfiguração (apenas algumas)
    if (index < 3) {
      try {
        Object.defineProperty(testObj, propName, {
          enumerable: !test.enumerable
        });
        console.log(`  Reconfiguration: SUCCESS`);
      } catch (error) {
        console.log(`  Reconfiguration: FAILED - ${error.message}`);
      }
    }
  });
  
  // Matrix de combinações para Accessor Descriptors
  console.log("\n=== Accessor Descriptor Combinations ===");
  
  const accessorDescriptorTests = [
    { name: 'full-accessor', get: true, set: true, enumerable: true, configurable: true },
    { name: 'read-only-accessor', get: true, set: false, enumerable: true, configurable: true },
    { name: 'write-only-accessor', get: false, set: true, enumerable: true, configurable: true },
    { name: 'hidden-accessor', get: true, set: true, enumerable: false, configurable: true },
    { name: 'locked-accessor', get: true, set: true, enumerable: true, configurable: false },
    { name: 'secret-accessor', get: true, set: false, enumerable: false, configurable: false }
  ];
  
  accessorDescriptorTests.forEach(test => {
    const propName = `accessor_${test.name}`;
    let storage = `initial ${test.name}`;
    
    const descriptor = {
      enumerable: test.enumerable,
      configurable: test.configurable
    };
    
    if (test.get) {
      descriptor.get = function() {
        return storage;
      };
    }
    
    if (test.set) {
      descriptor.set = function(newValue) {
        storage = `set: ${newValue}`;
      };
    }
    
    Object.defineProperty(testObj, propName, descriptor);
    
    console.log(`\n${test.name.toUpperCase()}:`);
    console.log(`  Property: ${propName}`);
    console.log(`  Attributes: G:${test.get} S:${test.set} E:${test.enumerable} C:${test.configurable}`);
    
    // Testar leitura
    try {
      const value = testObj[propName];
      console.log(`  Read: ${value !== undefined ? 'SUCCESS' : 'UNDEFINED'} - "${value}"`);
    } catch (error) {
      console.log(`  Read: ERROR - ${error.message}`);
    }
    
    // Testar escrita
    try {
      testObj[propName] = `new ${test.name}`;
      const newValue = testObj[propName];
      console.log(`  Write: SUCCESS - "${newValue}"`);
    } catch (error) {
      console.log(`  Write: ERROR - ${error.message}`);
    }
  });
  
  // Estatísticas finais
  console.log("\n=== Estatísticas Finais ===");
  const allProps = Object.getOwnPropertyNames(testObj);
  const enumerableProps = Object.keys(testObj);
  
  console.log(`Total properties: ${allProps.length}`);
  console.log(`Enumerable properties: ${enumerableProps.length}`);
  console.log(`Hidden properties: ${allProps.length - enumerableProps.length}`);
  
  const dataProps = allProps.filter(prop => {
    const desc = Object.getOwnPropertyDescriptor(testObj, prop);
    return 'value' in desc;
  });
  
  const accessorProps = allProps.filter(prop => {
    const desc = Object.getOwnPropertyDescriptor(testObj, prop);
    return 'get' in desc || 'set' in desc;
  });
  
  console.log(`Data properties: ${dataProps.length}`);
  console.log(`Accessor properties: ${accessorProps.length}`);
  
  return testObj;
}

const combinationsObj = analisarCombinacoes();
```

### Performance Implications

#### Descriptor Performance Analysis
```javascript
// Análise de performance de diferentes tipos de descriptors

function analisarPerformanceDescriptors() {
  console.log("\n=== Performance Analysis de Descriptors ===");
  
  const iterations = 100000;
  
  // Objetos para teste
  const objects = {
    direct: {},
    dataDescriptor: {},
    accessorDescriptor: {},
    protectedDescriptor: {}
  };
  
  // Setup - Direct assignment
  objects.direct.prop = 'direct value';
  
  // Setup - Data descriptor
  Object.defineProperty(objects.dataDescriptor, 'prop', {
    value: 'descriptor value',
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  // Setup - Accessor descriptor
  let accessorStorage = 'accessor value';
  Object.defineProperty(objects.accessorDescriptor, 'prop', {
    get: () => accessorStorage,
    set: (val) => accessorStorage = val,
    enumerable: true,
    configurable: true
  });
  
  // Setup - Protected descriptor (non-writable)
  Object.defineProperty(objects.protectedDescriptor, 'prop', {
    value: 'protected value',
    writable: false,
    enumerable: true,
    configurable: true
  });
  
  console.log("=== Read Performance ===");
  
  // Teste de leitura
  Object.entries(objects).forEach(([name, obj]) => {
    console.time(`Read ${name}`);
    let sum = 0;
    for (let i = 0; i < iterations; i++) {
      const value = obj.prop;
      sum += typeof value === 'string' ? value.length : 0;
    }
    console.timeEnd(`Read ${name}`);
    console.log(`  Checksum: ${sum}`);
  });
  
  console.log("\n=== Write Performance ===");
  
  // Teste de escrita
  ['direct', 'dataDescriptor', 'accessorDescriptor', 'protectedDescriptor'].forEach(name => {
    const obj = objects[name];
    
    console.time(`Write ${name}`);
    for (let i = 0; i < iterations; i++) {
      try {
        obj.prop = `value ${i}`;
      } catch (error) {
        // Ignorar erros para propriedades protegidas
      }
    }
    console.timeEnd(`Write ${name}`);
    
    console.log(`  Final value: "${obj.prop}"`);
  });
  
  console.log("\n=== Property Creation Performance ===");
  
  // Teste de criação
  console.time("Direct assignment creation");
  for (let i = 0; i < iterations / 10; i++) {
    const obj = {};
    obj.prop1 = i;
    obj.prop2 = i * 2;
    obj.prop3 = i * 3;
  }
  console.timeEnd("Direct assignment creation");
  
  console.time("Data descriptor creation");
  for (let i = 0; i < iterations / 10; i++) {
    const obj = {};
    Object.defineProperty(obj, 'prop1', { value: i, writable: true, enumerable: true, configurable: true });
    Object.defineProperty(obj, 'prop2', { value: i * 2, writable: true, enumerable: true, configurable: true });
    Object.defineProperty(obj, 'prop3', { value: i * 3, writable: true, enumerable: true, configurable: true });
  }
  console.timeEnd("Data descriptor creation");
  
  console.time("Accessor descriptor creation");
  for (let i = 0; i < iterations / 10; i++) {
    const obj = {};
    let val1 = i, val2 = i * 2, val3 = i * 3;
    
    Object.defineProperty(obj, 'prop1', {
      get: () => val1,
      set: (v) => val1 = v,
      enumerable: true
    });
    Object.defineProperty(obj, 'prop2', {
      get: () => val2,
      set: (v) => val2 = v,
      enumerable: true
    });
    Object.defineProperty(obj, 'prop3', {
      get: () => val3,
      set: (v) => val3 = v,
      enumerable: true
    });
  }
  console.timeEnd("Accessor descriptor creation");
  
  console.log("\n=== Enumeration Performance ===");
  
  // Criar objetos com muitas propriedades para teste de enumeração
  const enumerationTest = {};
  
  // Direct properties
  for (let i = 0; i < 1000; i++) {
    enumerationTest[`direct_${i}`] = i;
  }
  
  // Non-enumerable properties
  for (let i = 0; i < 1000; i++) {
    Object.defineProperty(enumerationTest, `hidden_${i}`, {
      value: i,
      enumerable: false
    });
  }
  
  // Enumerable descriptors
  for (let i = 0; i < 1000; i++) {
    Object.defineProperty(enumerationTest, `descriptor_${i}`, {
      value: i,
      enumerable: true
    });
  }
  
  console.time("Object.keys()");
  for (let i = 0; i < 1000; i++) {
    const keys = Object.keys(enumerationTest);
  }
  console.timeEnd("Object.keys()");
  
  console.time("Object.getOwnPropertyNames()");
  for (let i = 0; i < 1000; i++) {
    const names = Object.getOwnPropertyNames(enumerationTest);
  }
  console.timeEnd("Object.getOwnPropertyNames()");
  
  console.time("for...in loop");
  for (let i = 0; i < 1000; i++) {
    const keys = [];
    for (const key in enumerationTest) {
      keys.push(key);
    }
  }
  console.timeEnd("for...in loop");
  
  console.log(`Total properties: ${Object.getOwnPropertyNames(enumerationTest).length}`);
  console.log(`Enumerable properties: ${Object.keys(enumerationTest).length}`);
  
  // Memory usage analysis
  console.log("\n=== Memory Usage Analysis ===");
  
  const memoryTest = {
    direct: [],
    descriptors: [],
    accessors: []
  };
  
  const objectCount = 10000;
  
  // Direct assignment objects
  const start1 = performance.now();
  for (let i = 0; i < objectCount; i++) {
    memoryTest.direct.push({
      prop1: i,
      prop2: i * 2,
      prop3: `string ${i}`
    });
  }
  const end1 = performance.now();
  
  // Descriptor objects
  const start2 = performance.now();
  for (let i = 0; i < objectCount; i++) {
    const obj = {};
    Object.defineProperty(obj, 'prop1', { value: i, enumerable: true });
    Object.defineProperty(obj, 'prop2', { value: i * 2, enumerable: true });
    Object.defineProperty(obj, 'prop3', { value: `string ${i}`, enumerable: true });
    memoryTest.descriptors.push(obj);
  }
  const end2 = performance.now();
  
  // Accessor objects
  const start3 = performance.now();
  for (let i = 0; i < objectCount; i++) {
    const obj = {};
    let val1 = i, val2 = i * 2, val3 = `string ${i}`;
    
    Object.defineProperty(obj, 'prop1', {
      get: () => val1,
      set: (v) => val1 = v
    });
    Object.defineProperty(obj, 'prop2', {
      get: () => val2,
      set: (v) => val2 = v
    });
    Object.defineProperty(obj, 'prop3', {
      get: () => val3,
      set: (v) => val3 = v
    });
    
    memoryTest.accessors.push(obj);
  }
  const end3 = performance.now();
  
  console.log(`Direct objects creation: ${(end1 - start1).toFixed(2)}ms`);
  console.log(`Descriptor objects creation: ${(end2 - start2).toFixed(2)}ms`);
  console.log(`Accessor objects creation: ${(end3 - start3).toFixed(2)}ms`);
  
  console.log(`Direct objects count: ${memoryTest.direct.length}`);
  console.log(`Descriptor objects count: ${memoryTest.descriptors.length}`);
  console.log(`Accessor objects count: ${memoryTest.accessors.length}`);
}

analisarPerformanceDescriptors();
```

---

## 🔍 Análise Conceitual Profunda

### Descriptor Transformation Utilities

#### Advanced Descriptor Manipulation
```javascript
// Utilitários avançados para manipulação de descriptors

class DescriptorTransformer {
  // Converter data descriptor para accessor descriptor
  static dataToAccessor(obj, prop, options = {}) {
    const currentDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
    
    if (!currentDescriptor || !('value' in currentDescriptor)) {
      throw new Error(`Property '${prop}' is not a data descriptor`);
    }
    
    const {
      interceptGet = false,
      interceptSet = false,
      validation = null,
      transformation = null,
      logging = false
    } = options;
    
    let internalValue = currentDescriptor.value;
    
    const newDescriptor = {
      enumerable: currentDescriptor.enumerable,
      configurable: currentDescriptor.configurable
    };
    
    // Getter
    newDescriptor.get = function() {
      if (logging) {
        console.log(`[GET] ${prop}:`, internalValue);
      }
      
      if (interceptGet) {
        return interceptGet.call(this, internalValue, prop);
      }
      
      return internalValue;
    };
    
    // Setter
    newDescriptor.set = function(newValue) {
      if (logging) {
        console.log(`[SET] ${prop}:`, newValue);
      }
      
      // Validation
      if (validation && !validation(newValue, this, prop)) {
        throw new Error(`Validation failed for property '${prop}': ${newValue}`);
      }
      
      // Transformation
      if (transformation) {
        newValue = transformation(newValue, this, prop);
      }
      
      // Interceptor
      if (interceptSet) {
        newValue = interceptSet.call(this, newValue, internalValue, prop);
      }
      
      internalValue = newValue;
    };
    
    // Aplicar nova definição
    Object.defineProperty(obj, prop, newDescriptor);
    
    return {
      originalDescriptor: currentDescriptor,
      newDescriptor: Object.getOwnPropertyDescriptor(obj, prop),
      internalStorage: () => internalValue
    };
  }
  
  // Converter accessor descriptor para data descriptor
  static accessorToData(obj, prop, options = {}) {
    const currentDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
    
    if (!currentDescriptor || ('value' in currentDescriptor)) {
      throw new Error(`Property '${prop}' is not an accessor descriptor`);
    }
    
    const {
      captureCurrentValue = true,
      defaultValue = undefined
    } = options;
    
    let value = defaultValue;
    
    // Capturar valor atual se possível
    if (captureCurrentValue && currentDescriptor.get) {
      try {
        value = obj[prop];
      } catch (error) {
        console.warn(`Could not capture current value for '${prop}':`, error.message);
      }
    }
    
    const newDescriptor = {
      value: value,
      writable: true, // Default para data descriptor
      enumerable: currentDescriptor.enumerable,
      configurable: currentDescriptor.configurable
    };
    
    Object.defineProperty(obj, prop, newDescriptor);
    
    return {
      originalDescriptor: currentDescriptor,
      newDescriptor: Object.getOwnPropertyDescriptor(obj, prop),
      capturedValue: value
    };
  }
  
  // Clonar descriptor com transformações
  static cloneDescriptor(descriptor, transformations = {}) {
    const clone = {};
    
    // Copiar atributos base
    ['enumerable', 'configurable'].forEach(attr => {
      if (attr in descriptor) {
        clone[attr] = transformations[attr] !== undefined ? 
          transformations[attr] : descriptor[attr];
      }
    });
    
    // Copiar atributos específicos do tipo
    if ('value' in descriptor) {
      // Data descriptor
      clone.value = transformations.value !== undefined ? 
        transformations.value : descriptor.value;
        
      if ('writable' in descriptor) {
        clone.writable = transformations.writable !== undefined ?
          transformations.writable : descriptor.writable;
      }
    } else {
      // Accessor descriptor
      if (descriptor.get) {
        clone.get = transformations.get !== undefined ?
          transformations.get : descriptor.get;
      }
      
      if (descriptor.set) {
        clone.set = transformations.set !== undefined ?
          transformations.set : descriptor.set;
      }
    }
    
    return clone;
  }
  
  // Mergir descriptors com estratégias personalizadas
  static mergeDescriptors(descriptor1, descriptor2, strategy = {}) {
    const {
      conflictResolution = 'second', // 'first', 'second', 'merge', 'error'
      typeConversion = 'preserve',   // 'preserve', 'toData', 'toAccessor'
      attributeMerge = 'override'    // 'override', 'and', 'or'
    } = strategy;
    
    const isData1 = 'value' in descriptor1;
    const isData2 = 'value' in descriptor2;
    
    if (isData1 && isData2) {
      // Ambos são data descriptors
      return this.mergeDataDescriptors(descriptor1, descriptor2, strategy);
    } else if (!isData1 && !isData2) {
      // Ambos são accessor descriptors
      return this.mergeAccessorDescriptors(descriptor1, descriptor2, strategy);
    } else {
      // Tipos diferentes - aplicar conversão
      switch (typeConversion) {
        case 'toData':
          // Converter ambos para data
          const data1 = isData1 ? descriptor1 : { value: undefined, writable: true };
          const data2 = isData2 ? descriptor2 : { value: undefined, writable: true };
          return this.mergeDataDescriptors(data1, data2, strategy);
          
        case 'toAccessor':
          // Converter ambos para accessor
          const acc1 = !isData1 ? descriptor1 : { 
            get: () => descriptor1.value,
            set: descriptor1.writable ? (v) => {} : undefined
          };
          const acc2 = !isData2 ? descriptor2 : {
            get: () => descriptor2.value,
            set: descriptor2.writable ? (v) => {} : undefined
          };
          return this.mergeAccessorDescriptors(acc1, acc2, strategy);
          
        case 'preserve':
        default:
          if (conflictResolution === 'error') {
            throw new Error('Cannot merge descriptors of different types');
          }
          return conflictResolution === 'first' ? descriptor1 : descriptor2;
      }
    }
  }
  
  static mergeDataDescriptors(desc1, desc2, strategy) {
    const result = {};
    
    // Merge attributes
    ['enumerable', 'configurable', 'writable'].forEach(attr => {
      if (attr in desc1 && attr in desc2) {
        switch (strategy.attributeMerge) {
          case 'and':
            result[attr] = desc1[attr] && desc2[attr];
            break;
          case 'or':
            result[attr] = desc1[attr] || desc2[attr];
            break;
          case 'override':
          default:
            result[attr] = desc2[attr];
            break;
        }
      } else {
        result[attr] = (attr in desc2) ? desc2[attr] : desc1[attr];
      }
    });
    
    // Merge value
    result.value = strategy.conflictResolution === 'first' ? desc1.value : desc2.value;
    
    return result;
  }
  
  static mergeAccessorDescriptors(desc1, desc2, strategy) {
    const result = {};
    
    // Merge attributes
    ['enumerable', 'configurable'].forEach(attr => {
      if (attr in desc1 && attr in desc2) {
        switch (strategy.attributeMerge) {
          case 'and':
            result[attr] = desc1[attr] && desc2[attr];
            break;
          case 'or':
            result[attr] = desc1[attr] || desc2[attr];
            break;
          case 'override':
          default:
            result[attr] = desc2[attr];
            break;
        }
      } else {
        result[attr] = (attr in desc2) ? desc2[attr] : desc1[attr];
      }
    });
    
    // Merge accessors
    if (strategy.conflictResolution === 'merge') {
      // Combinar getters e setters
      if (desc1.get && desc2.get) {
        result.get = function() {
          return desc2.get.call(this) ?? desc1.get.call(this);
        };
      } else {
        result.get = desc2.get || desc1.get;
      }
      
      if (desc1.set && desc2.set) {
        result.set = function(value) {
          desc1.set.call(this, value);
          desc2.set.call(this, value);
        };
      } else {
        result.set = desc2.set || desc1.set;
      }
    } else {
      // Override strategy
      result.get = (strategy.conflictResolution === 'first' ? desc1.get : desc2.get) || desc1.get || desc2.get;
      result.set = (strategy.conflictResolution === 'first' ? desc1.set : desc2.set) || desc1.set || desc2.set;
    }
    
    return result;
  }
  
  // Validar descriptor
  static validateDescriptor(descriptor) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      type: null
    };
    
    const hasValue = 'value' in descriptor;
    const hasWritable = 'writable' in descriptor;
    const hasGet = 'get' in descriptor;
    const hasSet = 'set' in descriptor;
    
    // Determinar tipo
    if (hasValue || hasWritable) {
      validation.type = 'data';
    } else if (hasGet || hasSet) {
      validation.type = 'accessor';
    } else {
      validation.type = 'generic';
    }
    
    // Validar exclusividade mútua
    if ((hasValue || hasWritable) && (hasGet || hasSet)) {
      validation.valid = false;
      validation.errors.push('Data and accessor descriptor attributes cannot coexist');
    }
    
    // Validar tipos de atributos
    if ('enumerable' in descriptor && typeof descriptor.enumerable !== 'boolean') {
      validation.valid = false;
      validation.errors.push('enumerable must be a boolean');
    }
    
    if ('configurable' in descriptor && typeof descriptor.configurable !== 'boolean') {
      validation.valid = false;
      validation.errors.push('configurable must be a boolean');
    }
    
    if (hasWritable && typeof descriptor.writable !== 'boolean') {
      validation.valid = false;
      validation.errors.push('writable must be a boolean');
    }
    
    if (hasGet && descriptor.get !== undefined && typeof descriptor.get !== 'function') {
      validation.valid = false;
      validation.errors.push('get must be a function or undefined');
    }
    
    if (hasSet && descriptor.set !== undefined && typeof descriptor.set !== 'function') {
      validation.valid = false;
      validation.errors.push('set must be a function or undefined');
    }
    
    // Warnings para configurações incomuns
    if (validation.type === 'data' && hasValue && descriptor.writable === false && 
        descriptor.configurable === false) {
      validation.warnings.push('Property is completely immutable');
    }
    
    if (validation.type === 'accessor' && hasGet && !hasSet) {
      validation.warnings.push('Read-only accessor property');
    }
    
    if (validation.type === 'accessor' && hasSet && !hasGet) {
      validation.warnings.push('Write-only accessor property');
    }
    
    return validation;
  }
}

// Demonstração dos Descriptor Transformers
function demonstrarDescriptorTransformer() {
  console.log("\n=== Demonstração DescriptorTransformer ===");
  
  const testObj = {
    regularProp: 'initial value'
  };
  
  console.log("=== Data to Accessor Transformation ===");
  
  console.log("Before transformation:", Object.getOwnPropertyDescriptor(testObj, 'regularProp'));
  
  const transformation1 = DescriptorTransformer.dataToAccessor(testObj, 'regularProp', {
    validation: (value) => typeof value === 'string' && value.length > 0,
    transformation: (value) => value.toUpperCase(),
    logging: true
  });
  
  console.log("After transformation:", transformation1.newDescriptor);
  
  console.log("Testing transformed property:");
  console.log("Read:", testObj.regularProp);
  testObj.regularProp = 'new value';
  console.log("After write:", testObj.regularProp);
  
  try {
    testObj.regularProp = '';
  } catch (error) {
    console.log("Validation error:", error.message);
  }
  
  console.log("\n=== Accessor to Data Transformation ===");
  
  const transformation2 = DescriptorTransformer.accessorToData(testObj, 'regularProp', {
    captureCurrentValue: true
  });
  
  console.log("Back to data descriptor:", transformation2.newDescriptor);
  console.log("Captured value:", transformation2.capturedValue);
  
  console.log("\n=== Descriptor Cloning ===");
  
  const originalDesc = Object.getOwnPropertyDescriptor(testObj, 'regularProp');
  const clonedDesc = DescriptorTransformer.cloneDescriptor(originalDesc, {
    writable: false,
    enumerable: false
  });
  
  console.log("Original descriptor:", originalDesc);
  console.log("Cloned descriptor:", clonedDesc);
  
  console.log("\n=== Descriptor Merging ===");
  
  const desc1 = { value: 'first', writable: true, enumerable: true };
  const desc2 = { value: 'second', writable: false, configurable: true };
  
  const merged = DescriptorTransformer.mergeDescriptors(desc1, desc2, {
    conflictResolution: 'second',
    attributeMerge: 'and'
  });
  
  console.log("Descriptor 1:", desc1);
  console.log("Descriptor 2:", desc2);
  console.log("Merged result:", merged);
  
  console.log("\n=== Descriptor Validation ===");
  
  const validDescriptor = { value: 'test', writable: true };
  const invalidDescriptor = { value: 'test', get: () => 'getter' };
  
  console.log("Valid descriptor:", DescriptorTransformer.validateDescriptor(validDescriptor));
  console.log("Invalid descriptor:", DescriptorTransformer.validateDescriptor(invalidDescriptor));
}

demonstrarDescriptorTransformer();
```

---

## 🎯 Aplicabilidade e Contextos

### Design Patterns com Descriptors

```javascript
// Padrões de design avançados usando Property Descriptors

// 1. Computed Property Pattern
class ComputedPropertyPattern {
  static create(obj, propName, computeFn, dependencies = [], options = {}) {
    const {
      cache = true,
      lazy = true,
      enumerable = true,
      configurable = true
    } = options;
    
    let cachedValue;
    let isDirty = true;
    const dependencyValues = new Map();
    
    // Setup watchers para dependências
    if (cache && dependencies.length > 0) {
      dependencies.forEach(dep => {
        if (dep in obj) {
          const originalDesc = Object.getOwnPropertyDescriptor(obj, dep);
          
          if (originalDesc && 'value' in originalDesc) {
            // Converter para accessor para interceptar mudanças
            let internalValue = originalDesc.value;
            
            Object.defineProperty(obj, dep, {
              get: () => internalValue,
              set: (newValue) => {
                if (dependencyValues.get(dep) !== newValue) {
                  dependencyValues.set(dep, newValue);
                  isDirty = true;
                }
                internalValue = newValue;
              },
              enumerable: originalDesc.enumerable,
              configurable: originalDesc.configurable
            });
            
            dependencyValues.set(dep, internalValue);
          }
        }
      });
    }
    
    Object.defineProperty(obj, propName, {
      get() {
        if (!cache || isDirty || cachedValue === undefined) {
          try {
            cachedValue = computeFn.call(this);
            isDirty = false;
          } catch (error) {
            throw new Error(`Compute function failed for '${propName}': ${error.message}`);
          }
        }
        return cachedValue;
      },
      enumerable,
      configurable
    });
    
    // Método para invalidar cache manualmente
    Object.defineProperty(obj, `invalidate${propName.charAt(0).toUpperCase() + propName.slice(1)}`, {
      value: () => {
        isDirty = true;
        cachedValue = undefined;
      },
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

// 2. Property Proxy Pattern
class PropertyProxyPattern {
  constructor(target, interceptors = {}) {
    this.target = target;
    this.interceptors = interceptors;
    this.propertyMap = new Map();
    
    return this.createProxy();
  }
  
  createProxy() {
    const self = this;
    
    return new Proxy(this.target, {
      get(target, prop) {
        if (self.interceptors.get) {
          return self.interceptors.get(target, prop, target[prop]);
        }
        return target[prop];
      },
      
      set(target, prop, value) {
        if (self.interceptors.set) {
          const result = self.interceptors.set(target, prop, value, target[prop]);
          if (result === false) return false;
          if (result !== undefined) value = result;
        }
        
        target[prop] = value;
        return true;
      },
      
      defineProperty(target, prop, descriptor) {
        if (self.interceptors.defineProperty) {
          const result = self.interceptors.defineProperty(target, prop, descriptor);
          if (result === false) return false;
          if (result && typeof result === 'object') descriptor = result;
        }
        
        self.propertyMap.set(prop, descriptor);
        return Object.defineProperty(target, prop, descriptor);
      },
      
      getOwnPropertyDescriptor(target, prop) {
        return self.propertyMap.get(prop) || Object.getOwnPropertyDescriptor(target, prop);
      }
    });
  }
}

// 3. Property State Machine Pattern
class PropertyStateMachine {
  constructor(obj, propName, states, initialState, options = {}) {
    this.states = states;
    this.currentState = initialState;
    this.stateHistory = [initialState];
    this.options = options;
    
    if (!(initialState in states)) {
      throw new Error(`Initial state '${initialState}' not defined`);
    }
    
    this.setupProperty(obj, propName);
  }
  
  setupProperty(obj, propName) {
    Object.defineProperty(obj, propName, {
      get: () => this.getCurrentValue(),
      set: (newValue) => this.transition(newValue),
      enumerable: this.options.enumerable !== false,
      configurable: this.options.configurable !== false
    });
    
    // State control methods
    Object.defineProperty(obj, `${propName}State`, {
      get: () => this.currentState,
      enumerable: false
    });
    
    Object.defineProperty(obj, `${propName}History`, {
      get: () => [...this.stateHistory],
      enumerable: false
    });
    
    Object.defineProperty(obj, `reset${propName.charAt(0).toUpperCase() + propName.slice(1)}`, {
      value: () => this.reset(),
      enumerable: false
    });
  }
  
  getCurrentValue() {
    const stateConfig = this.states[this.currentState];
    return typeof stateConfig.value === 'function' ? 
      stateConfig.value() : stateConfig.value;
  }
  
  transition(newValue) {
    const stateConfig = this.states[this.currentState];
    
    // Verificar se transição é válida
    if (stateConfig.validTransitions) {
      const validStates = stateConfig.validTransitions.map(t => 
        typeof t === 'string' ? t : t.to
      );
      
      let targetState = null;
      
      // Encontrar estado alvo baseado no valor
      for (const [stateName, config] of Object.entries(this.states)) {
        if (validStates.includes(stateName)) {
          const stateValue = typeof config.value === 'function' ? 
            config.value() : config.value;
          
          if (stateValue === newValue || 
              (config.validator && config.validator(newValue))) {
            targetState = stateName;
            break;
          }
        }
      }
      
      if (!targetState) {
        throw new Error(`Invalid transition from '${this.currentState}' with value '${newValue}'`);
      }
      
      // Executar callback de transição se definido
      const transitionConfig = stateConfig.validTransitions.find(t => 
        (typeof t === 'string' ? t : t.to) === targetState
      );
      
      if (transitionConfig && typeof transitionConfig === 'object' && transitionConfig.onTransition) {
        transitionConfig.onTransition(this.currentState, targetState, newValue);
      }
      
      this.currentState = targetState;
      this.stateHistory.push(targetState);
      
      // Limitar histórico se especificado
      if (this.options.maxHistory && this.stateHistory.length > this.options.maxHistory) {
        this.stateHistory.shift();
      }
      
    } else {
      throw new Error(`No transitions defined for state '${this.currentState}'`);
    }
  }
  
  reset() {
    const initialState = this.stateHistory[0];
    this.currentState = initialState;
    this.stateHistory = [initialState];
  }
}

// 4. Property Factory Pattern
class PropertyFactory {
  static createTypedProperty(obj, propName, type, options = {}) {
    const {
      defaultValue = this.getDefaultValueForType(type),
      nullable = false,
      validator = null,
      transformer = null,
      enumerable = true,
      configurable = true
    } = options;
    
    let internalValue = defaultValue;
    
    const typeValidator = (value) => {
      if (value === null && nullable) return true;
      if (value === undefined && options.optional) return true;
      
      switch (type) {
        case 'string': return typeof value === 'string';
        case 'number': return typeof value === 'number' && !isNaN(value);
        case 'boolean': return typeof value === 'boolean';
        case 'array': return Array.isArray(value);
        case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value);
        case 'function': return typeof value === 'function';
        case 'date': return value instanceof Date;
        default: return true;
      }
    };
    
    Object.defineProperty(obj, propName, {
      get() {
        return internalValue;
      },
      
      set(newValue) {
        // Type validation
        if (!typeValidator(newValue)) {
          throw new TypeError(`Property '${propName}' must be of type '${type}', got '${typeof newValue}'`);
        }
        
        // Custom validation
        if (validator && !validator(newValue)) {
          throw new Error(`Validation failed for property '${propName}': ${newValue}`);
        }
        
        // Transformation
        if (transformer) {
          newValue = transformer(newValue);
        }
        
        internalValue = newValue;
      },
      
      enumerable,
      configurable
    });
    
    return obj;
  }
  
  static getDefaultValueForType(type) {
    switch (type) {
      case 'string': return '';
      case 'number': return 0;
      case 'boolean': return false;
      case 'array': return [];
      case 'object': return {};
      case 'date': return new Date();
      default: return null;
    }
  }
  
  static createEnum(obj, propName, enumValues, options = {}) {
    const {
      defaultValue = enumValues[0],
      enumerable = true,
      configurable = true
    } = options;
    
    if (!enumValues.includes(defaultValue)) {
      throw new Error(`Default value '${defaultValue}' is not in enum values`);
    }
    
    let internalValue = defaultValue;
    
    Object.defineProperty(obj, propName, {
      get() {
        return internalValue;
      },
      
      set(newValue) {
        if (!enumValues.includes(newValue)) {
          throw new Error(`Value '${newValue}' is not valid. Must be one of: ${enumValues.join(', ')}`);
        }
        internalValue = newValue;
      },
      
      enumerable,
      configurable
    });
    
    // Create enum values as static properties
    Object.defineProperty(obj, `${propName}Values`, {
      value: Object.freeze([...enumValues]),
      writable: false,
      enumerable: false,
      configurable: false
    });
    
    return obj;
  }
}

// Demonstração dos Design Patterns
function demonstrarDesignPatterns() {
  console.log("\n=== Demonstração Design Patterns ===");
  
  // 1. Computed Property Pattern
  console.log("=== Computed Property Pattern ===");
  
  const mathObj = {
    a: 5,
    b: 10
  };
  
  ComputedPropertyPattern.create(mathObj, 'sum', function() {
    console.log("Computing sum...");
    return this.a + this.b;
  }, ['a', 'b']);
  
  console.log("Initial sum:", mathObj.sum);
  console.log("Cached sum:", mathObj.sum);
  
  mathObj.a = 15;
  console.log("Sum after changing a:", mathObj.sum);
  
  mathObj.invalidateSum();
  console.log("Sum after manual invalidation:", mathObj.sum);
  
  // 2. Property Proxy Pattern
  console.log("\n=== Property Proxy Pattern ===");
  
  const data = { name: 'John', age: 30 };
  
  const proxiedData = new PropertyProxyPattern(data, {
    get: (target, prop, value) => {
      console.log(`Accessing property: ${prop}`);
      return value;
    },
    set: (target, prop, newValue, oldValue) => {
      console.log(`Setting ${prop}: ${oldValue} -> ${newValue}`);
      return newValue;
    }
  });
  
  console.log("Name:", proxiedData.name);
  proxiedData.age = 31;
  
  // 3. Property State Machine Pattern
  console.log("\n=== Property State Machine Pattern ===");
  
  const connection = {};
  
  new PropertyStateMachine(connection, 'status', {
    disconnected: {
      value: 'DISCONNECTED',
      validTransitions: ['connecting']
    },
    connecting: {
      value: 'CONNECTING',
      validTransitions: [
        { to: 'connected', onTransition: () => console.log('Connection established!') },
        { to: 'disconnected', onTransition: () => console.log('Connection failed!') }
      ]
    },
    connected: {
      value: 'CONNECTED',
      validTransitions: ['disconnected']
    }
  }, 'disconnected');
  
  console.log("Initial status:", connection.status);
  
  connection.status = 'CONNECTING';
  console.log("After connecting:", connection.status);
  
  connection.status = 'CONNECTED';
  console.log("After connected:", connection.status);
  console.log("Status history:", connection.statusHistory);
  
  // 4. Property Factory Pattern
  console.log("\n=== Property Factory Pattern ===");
  
  const user = {};
  
  PropertyFactory.createTypedProperty(user, 'name', 'string', {
    validator: (value) => value.length >= 2,
    transformer: (value) => value.trim().toLowerCase()
  });
  
  PropertyFactory.createTypedProperty(user, 'age', 'number', {
    validator: (value) => value >= 0 && value <= 150
  });
  
  PropertyFactory.createEnum(user, 'role', ['admin', 'user', 'guest'], {
    defaultValue: 'user'
  });
  
  console.log("User role values:", user.roleValues);
  
  try {
    user.name = 'Alice Johnson';
    user.age = 25;
    user.role = 'admin';
    
    console.log("User:", { name: user.name, age: user.age, role: user.role });
    
    user.age = -5; // Should throw
  } catch (error) {
    console.log("Validation error:", error.message);
  }
}

demonstrarDesignPatterns();
```

---

## 📚 Conclusão

**Property Descriptors** são as **estruturas fundamentais** que governam o comportamento de propriedades em JavaScript, oferecendo **controle granular** sobre **enumerabilidade**, **mutabilidade**, **configurabilidade** e **semantics de acesso**.

**Características distintivas:**
- **Two-type system:** Data vs Accessor descriptors com **mutual exclusivity**
- **Attribute control:** enumerable, writable, configurable para **fine-grained behavior**
- **Validation rules:** JavaScript enforces **consistency** entre atributos do descriptor
- **Default behaviors:** Diferentes defaults para **defineProperty** vs **direct assignment**
- **Performance implications:** Diferentes custos para diferentes configurações

**Casos de uso estratégicos:**
- **Advanced encapsulation** com computed properties e validation
- **API design** com controlled access patterns e protection
- **Design patterns** como state machines, proxies e factories
- **Library development** com descriptor-based abstractions
- **Metaprogramming** com descriptor transformation e manipulation

É **essencial** para **desenvolvimento avançado** que exija **controle fino** sobre comportamento de propriedades, **encapsulamento sofisticado** e **padrões de design** baseados em **metadados de propriedades**.