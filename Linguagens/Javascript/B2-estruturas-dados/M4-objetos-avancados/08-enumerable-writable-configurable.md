# Atributos Enumerable, Writable e Configurable: Controle Comportamental de Propriedades

## 🎯 Introdução e Definição

### Definição Conceitual

Os atributos **enumerable**, **writable** e **configurable** são **flags comportamentais** que controlam as **características operacionais** de propriedades em JavaScript. Funcionam como **switches de controle** que determinam **como**, **quando** e **em que contextos** uma propriedade pode ser **acessada**, **modificada**, **listada** e **reconfigurada**.

Conceitualmente, representam o **modelo de permissões** que JavaScript usa para **governar propriedades**, oferecendo **granularidade operacional** sobre **visibility**, **mutability** e **reconfigurability** que vai muito além da **simples atribuição de valores**.

### Atributos Fundamentais

**Enumerable:** Controla se a propriedade aparece em **enumerações** como `Object.keys()`, `for...in`, `JSON.stringify()`

**Writable:** Determina se o **valor** da propriedade pode ser **modificado** através de atribuição direta

**Configurable:** Define se a propriedade pode ser **deletada** ou ter seus **atributos modificados**

### Problema Fundamental que Resolve

Resolve a necessidade de **controle granular** sobre **visibilidade** e **mutabilidade** de propriedades, permitindo **encapsulamento**, **property hiding**, **immutability selective**, **API protection** e **behavioral customization** que são essenciais para **library design**, **framework development** e **secure coding patterns**.

---

## 📋 Sumário Conceitual

### Aspectos Fundamentais

1. **Enumerable Control:** Visibilidade em iterações e serialização
2. **Writable Control:** Mutabilidade de valores em data descriptors
3. **Configurable Control:** Capacidade de reconfiguração e remoção
4. **Interaction Patterns:** Como atributos interagem entre si
5. **Performance Implications:** Impacto de diferentes configurações

### Características Operacionais

- **Boolean Flags:** Cada atributo é um valor boolean true/false
- **Default Behaviors:** Diferentes defaults para defineProperty vs assignment
- **Immutable Rules:** Algumas combinações criam propriedades imutáveis
- **Engine Optimizations:** JavaScript engines otimizam baseado nos atributos

---

## 🧠 Fundamentos Teóricos

### Enumerable: Controle de Visibilidade

#### Análise Profunda do Atributo Enumerable
```javascript
// Demonstração completa do comportamento enumerable

function analisarEnumerable() {
  console.log("=== Análise Completa do Atributo Enumerable ===");
  
  const testObj = {};
  
  // 1. Propriedades enumeráveis (padrão para assignment)
  testObj.visibleProp1 = 'visible 1';
  testObj.visibleProp2 = 'visible 2';
  
  // 2. Propriedades não-enumeráveis (padrão para defineProperty)
  Object.defineProperty(testObj, 'hiddenProp1', {
    value: 'hidden 1',
    writable: true,
    configurable: true
    // enumerable: false (default)
  });
  
  Object.defineProperty(testObj, 'hiddenProp2', {
    value: 'hidden 2',
    enumerable: false,
    writable: true,
    configurable: true
  });
  
  // 3. Propriedades explicitamente enumeráveis
  Object.defineProperty(testObj, 'explicitVisible', {
    value: 'explicit visible',
    enumerable: true,
    writable: true,
    configurable: true
  });
  
  console.log("=== Métodos de Enumeração ===");
  
  // Object.keys() - apenas enumerable own properties
  console.log("Object.keys():", Object.keys(testObj));
  
  // Object.getOwnPropertyNames() - todas as own properties
  console.log("Object.getOwnPropertyNames():", Object.getOwnPropertyNames(testObj));
  
  // for...in - enumerable properties (own + inherited)
  console.log("for...in:");
  const forInKeys = [];
  for (const key in testObj) {
    forInKeys.push(key);
  }
  console.log("  Keys:", forInKeys);
  
  // Object.values() e Object.entries() - apenas enumerable
  console.log("Object.values():", Object.values(testObj));
  console.log("Object.entries():", Object.entries(testObj));
  
  // JSON.stringify() - apenas enumerable properties
  console.log("JSON.stringify():", JSON.stringify(testObj));
  
  console.log("=== Teste de Acesso Direto ===");
  console.log("Direct access to hiddenProp1:", testObj.hiddenProp1);
  console.log("Direct access to visibleProp1:", testObj.visibleProp1);
  
  console.log("=== Descriptor Analysis ===");
  Object.getOwnPropertyNames(testObj).forEach(prop => {
    const descriptor = Object.getOwnPropertyDescriptor(testObj, prop);
    console.log(`${prop}: enumerable=${descriptor.enumerable}`);
  });
  
  return testObj;
}

const enumerableTest = analisarEnumerable();

// Enumerable com Inheritance
function analisarEnumerableHeranca() {
  console.log("\n=== Enumerable com Herança ===");
  
  // Objeto base
  const parent = {};
  Object.defineProperty(parent, 'parentVisible', {
    value: 'parent enumerable',
    enumerable: true,
    writable: true,
    configurable: true
  });
  
  Object.defineProperty(parent, 'parentHidden', {
    value: 'parent hidden',
    enumerable: false,
    writable: true,
    configurable: true
  });
  
  // Objeto derivado
  const child = Object.create(parent);
  child.childVisible = 'child enumerable';
  
  Object.defineProperty(child, 'childHidden', {
    value: 'child hidden',
    enumerable: false
  });
  
  console.log("=== Child Object Enumeration ===");
  console.log("Object.keys() (own enumerable only):", Object.keys(child));
  console.log("Object.getOwnPropertyNames() (all own):", Object.getOwnPropertyNames(child));
  
  console.log("for...in (own + inherited enumerable):");
  const inheritedEnumerable = [];
  for (const key in child) {
    inheritedEnumerable.push({
      key,
      isOwn: child.hasOwnProperty(key),
      value: child[key]
    });
  }
  console.log("  Results:", inheritedEnumerable);
  
  // Filtrar apenas inherited enumerable
  console.log("Only inherited enumerable:");
  for (const key in child) {
    if (!child.hasOwnProperty(key)) {
      console.log(`  ${key}: ${child[key]}`);
    }
  }
  
  return { parent, child };
}

const inheritanceTest = analisarEnumerableHeranca();

// Enumerable Performance Impact
function analisarEnumerablePerformance() {
  console.log("\n=== Performance Impact do Enumerable ===");
  
  const iterations = 100000;
  
  // Criar objetos para teste
  const allEnumerable = {};
  const mixedEnumerable = {};
  const allHidden = {};
  
  // Setup objetos
  for (let i = 0; i < 100; i++) {
    // Todas enumeráveis
    allEnumerable[`prop${i}`] = i;
    
    // Misturadas
    if (i % 2 === 0) {
      mixedEnumerable[`prop${i}`] = i;
    } else {
      Object.defineProperty(mixedEnumerable, `prop${i}`, {
        value: i,
        enumerable: false
      });
    }
    
    // Todas não-enumeráveis
    Object.defineProperty(allHidden, `prop${i}`, {
      value: i,
      enumerable: false
    });
  }
  
  console.log("=== Object.keys() Performance ===");
  
  console.time("All enumerable - Object.keys()");
  for (let i = 0; i < iterations; i++) {
    Object.keys(allEnumerable);
  }
  console.timeEnd("All enumerable - Object.keys()");
  
  console.time("Mixed enumerable - Object.keys()");
  for (let i = 0; i < iterations; i++) {
    Object.keys(mixedEnumerable);
  }
  console.timeEnd("Mixed enumerable - Object.keys()");
  
  console.time("All hidden - Object.keys()");
  for (let i = 0; i < iterations; i++) {
    Object.keys(allHidden);
  }
  console.timeEnd("All hidden - Object.keys()");
  
  console.log("=== Results ===");
  console.log(`All enumerable keys: ${Object.keys(allEnumerable).length}`);
  console.log(`Mixed enumerable keys: ${Object.keys(mixedEnumerable).length}`);
  console.log(`All hidden keys: ${Object.keys(allHidden).length}`);
  
  console.log("=== JSON.stringify() Performance ===");
  
  console.time("All enumerable - JSON.stringify()");
  for (let i = 0; i < iterations / 100; i++) {
    JSON.stringify(allEnumerable);
  }
  console.timeEnd("All enumerable - JSON.stringify()");
  
  console.time("Mixed enumerable - JSON.stringify()");
  for (let i = 0; i < iterations / 100; i++) {
    JSON.stringify(mixedEnumerable);
  }
  console.timeEnd("Mixed enumerable - JSON.stringify()");
  
  console.time("All hidden - JSON.stringify()");
  for (let i = 0; i < iterations / 100; i++) {
    JSON.stringify(allHidden);
  }
  console.timeEnd("All hidden - JSON.stringify()");
}

analisarEnumerablePerformance();
```

### Writable: Controle de Mutabilidade

#### Análise Profunda do Atributo Writable
```javascript
// Demonstração completa do comportamento writable

function analisarWritable() {
  console.log("\n=== Análise Completa do Atributo Writable ===");
  
  const testObj = {};
  
  // 1. Propriedade writable (padrão para assignment)
  testObj.mutableProp = 'can be changed';
  
  // 2. Propriedade read-only explícita
  Object.defineProperty(testObj, 'readOnlyProp', {
    value: 'cannot be changed',
    writable: false,
    enumerable: true,
    configurable: true
  });
  
  // 3. Propriedade writable explícita
  Object.defineProperty(testObj, 'explicitWritable', {
    value: 'explicit writable',
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  // 4. Propriedade com writable padrão (false para defineProperty)
  Object.defineProperty(testObj, 'defaultNonWritable', {
    value: 'default non-writable',
    enumerable: true,
    configurable: true
    // writable: false (default)
  });
  
  console.log("=== Teste de Modificação ===");
  
  const properties = ['mutableProp', 'readOnlyProp', 'explicitWritable', 'defaultNonWritable'];
  
  properties.forEach(prop => {
    const descriptor = Object.getOwnPropertyDescriptor(testObj, prop);
    const originalValue = testObj[prop];
    
    console.log(`\n${prop}:`);
    console.log(`  Original: "${originalValue}"`);
    console.log(`  Writable: ${descriptor.writable}`);
    
    try {
      testObj[prop] = `modified ${prop}`;
      const newValue = testObj[prop];
      const wasChanged = newValue !== originalValue;
      
      console.log(`  Modified: "${newValue}"`);
      console.log(`  Changed: ${wasChanged}`);
      
      if (!wasChanged && descriptor.writable === false) {
        console.log("  ✅ Correctly prevented modification");
      } else if (wasChanged && descriptor.writable === true) {
        console.log("  ✅ Correctly allowed modification");
      } else {
        console.log("  ❌ Unexpected behavior");
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  });
  
  console.log("\n=== Strict Mode Behavior ===");
  
  // Simular strict mode behavior
  function strictModeTest() {
    'use strict';
    
    const strictObj = {};
    Object.defineProperty(strictObj, 'readOnly', {
      value: 'strict read only',
      writable: false
    });
    
    try {
      strictObj.readOnly = 'attempt change';
      console.log("No error in strict mode (unexpected)");
    } catch (error) {
      console.log("Strict mode error:", error.message);
    }
  }
  
  strictModeTest();
  
  return testObj;
}

const writableTest = analisarWritable();

// Writable com Object Types
function analisarWritableObjectTypes() {
  console.log("\n=== Writable com Tipos de Objeto ===");
  
  const testObj = {};
  
  // Array read-only
  Object.defineProperty(testObj, 'readOnlyArray', {
    value: [1, 2, 3],
    writable: false,
    enumerable: true,
    configurable: true
  });
  
  // Object read-only
  Object.defineProperty(testObj, 'readOnlyObject', {
    value: { x: 10, y: 20 },
    writable: false,
    enumerable: true,
    configurable: true
  });
  
  console.log("=== Comportamento com Referencias ===");
  
  console.log("Original array:", testObj.readOnlyArray);
  console.log("Original object:", testObj.readOnlyObject);
  
  // Tentar substituir referência (deve falhar)
  try {
    testObj.readOnlyArray = [4, 5, 6];
    console.log("❌ Array replacement succeeded unexpectedly");
  } catch (error) {
    console.log("✅ Array replacement blocked:", error.message);
  }
  
  try {
    testObj.readOnlyObject = { z: 30 };
    console.log("❌ Object replacement succeeded unexpectedly");
  } catch (error) {
    console.log("✅ Object replacement blocked:", error.message);
  }
  
  // Modificar conteúdo da referência (deve funcionar)
  console.log("=== Modificação de Conteúdo ===");
  
  try {
    testObj.readOnlyArray.push(4);
    console.log("Array after push:", testObj.readOnlyArray);
    console.log("✅ Array content modification allowed");
  } catch (error) {
    console.log("❌ Array content modification blocked:", error.message);
  }
  
  try {
    testObj.readOnlyObject.z = 30;
    console.log("Object after property addition:", testObj.readOnlyObject);
    console.log("✅ Object content modification allowed");
  } catch (error) {
    console.log("❌ Object content modification blocked:", error.message);
  }
  
  console.log("=== Imutabilidade Profunda ===");
  
  // Para imutabilidade real, usar Object.freeze ou Object.seal
  const deepImmutable = {};
  Object.defineProperty(deepImmutable, 'frozenArray', {
    value: Object.freeze([1, 2, 3]),
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  Object.defineProperty(deepImmutable, 'frozenObject', {
    value: Object.freeze({ x: 10, y: 20 }),
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  console.log("Frozen array:", deepImmutable.frozenArray);
  console.log("Frozen object:", deepImmutable.frozenObject);
  
  try {
    deepImmutable.frozenArray.push(4);
    console.log("❌ Frozen array modification succeeded");
  } catch (error) {
    console.log("✅ Frozen array modification blocked:", error.message);
  }
  
  try {
    deepImmutable.frozenObject.z = 30;
    console.log("Current frozen object:", deepImmutable.frozenObject);
    console.log("✅ Frozen object modification silently ignored");
  } catch (error) {
    console.log("✅ Frozen object modification blocked:", error.message);
  }
}

analisarWritableObjectTypes();

// Writable Performance Analysis
function analisarWritablePerformance() {
  console.log("\n=== Performance do Writable ===");
  
  const iterations = 1000000;
  
  // Setup objetos
  const writableObj = {};
  const readOnlyObj = {};
  
  for (let i = 0; i < 100; i++) {
    writableObj[`prop${i}`] = i;
    
    Object.defineProperty(readOnlyObj, `prop${i}`, {
      value: i,
      writable: false
    });
  }
  
  console.log("=== Write Performance ===");
  
  console.time("Writable properties");
  for (let i = 0; i < iterations; i++) {
    writableObj.prop1 = i;
  }
  console.timeEnd("Writable properties");
  
  console.time("Read-only properties (silent failure)");
  for (let i = 0; i < iterations; i++) {
    readOnlyObj.prop1 = i; // Falha silenciosa
  }
  console.timeEnd("Read-only properties (silent failure)");
  
  console.log("Final writable value:", writableObj.prop1);
  console.log("Final read-only value:", readOnlyObj.prop1);
}

analisarWritablePerformance();
```

### Configurable: Controle de Reconfiguração

#### Análise Profunda do Atributo Configurable
```javascript
// Demonstração completa do comportamento configurable

function analisarConfigurable() {
  console.log("\n=== Análise Completa do Atributo Configurable ===");
  
  const testObj = {};
  
  // 1. Propriedade configurable (padrão para assignment)
  testObj.configurableProp = 'can be reconfigured';
  
  // 2. Propriedade non-configurable explícita
  Object.defineProperty(testObj, 'lockedProp', {
    value: 'locked property',
    writable: true,
    enumerable: true,
    configurable: false
  });
  
  // 3. Propriedade configurable explícita
  Object.defineProperty(testObj, 'explicitConfigurable', {
    value: 'explicit configurable',
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  // 4. Propriedade com configurable padrão (false para defineProperty)
  Object.defineProperty(testObj, 'defaultNonConfigurable', {
    value: 'default non-configurable',
    writable: true,
    enumerable: true
    // configurable: false (default)
  });
  
  console.log("=== Teste de Deleção ===");
  
  const properties = ['configurableProp', 'lockedProp', 'explicitConfigurable', 'defaultNonConfigurable'];
  
  properties.forEach(prop => {
    const descriptor = Object.getOwnPropertyDescriptor(testObj, prop);
    
    console.log(`\n${prop}:`);
    console.log(`  Configurable: ${descriptor.configurable}`);
    console.log(`  Exists before delete: ${prop in testObj}`);
    
    try {
      const deleted = delete testObj[prop];
      const stillExists = prop in testObj;
      
      console.log(`  Delete returned: ${deleted}`);
      console.log(`  Exists after delete: ${stillExists}`);
      
      if (deleted && !stillExists && descriptor.configurable) {
        console.log("  ✅ Correctly allowed deletion");
      } else if (!deleted && stillExists && !descriptor.configurable) {
        console.log("  ✅ Correctly prevented deletion");
      } else {
        console.log("  ❌ Unexpected behavior");
      }
      
      // Recrear propriedade para próximos testes
      if (!stillExists) {
        Object.defineProperty(testObj, prop, descriptor);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  });
  
  console.log("\n=== Teste de Reconfiguração ===");
  
  properties.forEach(prop => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(testObj, prop);
    
    console.log(`\n${prop}:`);
    console.log(`  Original configurable: ${originalDescriptor.configurable}`);
    
    try {
      // Tentar mudar enumerable
      Object.defineProperty(testObj, prop, {
        enumerable: !originalDescriptor.enumerable
      });
      
      const newDescriptor = Object.getOwnPropertyDescriptor(testObj, prop);
      const changed = newDescriptor.enumerable !== originalDescriptor.enumerable;
      
      console.log(`  Reconfiguration succeeded: ${changed}`);
      
      if (changed && originalDescriptor.configurable) {
        console.log("  ✅ Correctly allowed reconfiguration");
      } else if (!changed && !originalDescriptor.configurable) {
        console.log("  ✅ Correctly prevented reconfiguration");
      } else {
        console.log("  ❌ Unexpected behavior");
      }
      
      // Restaurar estado original
      if (changed) {
        Object.defineProperty(testObj, prop, originalDescriptor);
      }
    } catch (error) {
      console.log(`  Reconfiguration error: ${error.message}`);
      
      if (!originalDescriptor.configurable) {
        console.log("  ✅ Correctly threw error for non-configurable property");
      } else {
        console.log("  ❌ Unexpected error for configurable property");
      }
    }
  });
  
  return testObj;
}

const configurableTest = analisarConfigurable();

// Configurable Edge Cases
function analisarConfigurableEdgeCases() {
  console.log("\n=== Edge Cases do Configurable ===");
  
  const testObj = {};
  
  console.log("=== Caso 1: Writable false para true (permitido) ===");
  
  Object.defineProperty(testObj, 'writableTransition', {
    value: 'test',
    writable: false,
    enumerable: true,
    configurable: true
  });
  
  console.log("Original writable:", Object.getOwnPropertyDescriptor(testObj, 'writableTransition').writable);
  
  try {
    Object.defineProperty(testObj, 'writableTransition', {
      writable: true
    });
    console.log("New writable:", Object.getOwnPropertyDescriptor(testObj, 'writableTransition').writable);
    console.log("✅ Successfully changed writable from false to true");
  } catch (error) {
    console.log("❌ Error changing writable:", error.message);
  }
  
  console.log("\n=== Caso 2: Value change em non-writable configurable ===");
  
  Object.defineProperty(testObj, 'valueTransition', {
    value: 'original',
    writable: false,
    enumerable: true,
    configurable: true
  });
  
  console.log("Original value:", testObj.valueTransition);
  
  try {
    Object.defineProperty(testObj, 'valueTransition', {
      value: 'new value'
    });
    console.log("New value:", testObj.valueTransition);
    console.log("✅ Successfully changed value of non-writable configurable property");
  } catch (error) {
    console.log("❌ Error changing value:", error.message);
  }
  
  console.log("\n=== Caso 3: Data para Accessor conversion ===");
  
  Object.defineProperty(testObj, 'dataToAccessor', {
    value: 'data property',
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  console.log("Original (data):", Object.getOwnPropertyDescriptor(testObj, 'dataToAccessor'));
  
  try {
    let storage = 'accessor storage';
    Object.defineProperty(testObj, 'dataToAccessor', {
      get: () => storage,
      set: (val) => storage = val,
      enumerable: true,
      configurable: true
    });
    
    console.log("New (accessor):", Object.getOwnPropertyDescriptor(testObj, 'dataToAccessor'));
    console.log("Accessor value:", testObj.dataToAccessor);
    console.log("✅ Successfully converted data to accessor property");
  } catch (error) {
    console.log("❌ Error converting to accessor:", error.message);
  }
  
  console.log("\n=== Caso 4: Non-configurable restrictions ===");
  
  Object.defineProperty(testObj, 'strictlyLocked', {
    value: 'locked',
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  console.log("Strictly locked property created");
  
  // Tentar mudanças que devem falhar
  const restrictedOperations = [
    { name: 'Change enumerable', operation: () => Object.defineProperty(testObj, 'strictlyLocked', { enumerable: false }) },
    { name: 'Change configurable', operation: () => Object.defineProperty(testObj, 'strictlyLocked', { configurable: true }) },
    { name: 'Change to accessor', operation: () => Object.defineProperty(testObj, 'strictlyLocked', { get: () => 'getter' }) },
    { name: 'Delete property', operation: () => delete testObj.strictlyLocked }
  ];
  
  restrictedOperations.forEach(({ name, operation }) => {
    try {
      operation();
      console.log(`❌ ${name}: Unexpectedly succeeded`);
    } catch (error) {
      console.log(`✅ ${name}: Correctly failed - ${error.message}`);
    }
  });
  
  // Operações que devem ser permitidas
  console.log("\n=== Operações permitidas em non-configurable ===");
  
  try {
    // Redefinir com mesmos valores deve funcionar
    Object.defineProperty(testObj, 'strictlyLocked', {
      value: 'locked',
      writable: false,
      enumerable: true,
      configurable: false
    });
    console.log("✅ Redefinition with same values succeeded");
  } catch (error) {
    console.log("❌ Redefinition with same values failed:", error.message);
  }
  
  // Writable false para false (change value) pode ser permitido em alguns casos
  try {
    Object.defineProperty(testObj, 'strictlyLocked', {
      value: 'new locked value'
    });
    console.log("Value change result:", testObj.strictlyLocked);
  } catch (error) {
    console.log("Value change blocked:", error.message);
  }
}

analisarConfigurableEdgeCases();
```

### Interações Entre Atributos

#### Análise das Combinações de Atributos
```javascript
// Análise de como os atributos interagem entre si

class AttributeInteractionAnalyzer {
  static analyzeAllCombinations() {
    console.log("\n=== Análise de Todas as Combinações de Atributos ===");
    
    const combinations = [
      { name: 'full-access', e: true, w: true, c: true },
      { name: 'read-only', e: true, w: false, c: true },
      { name: 'hidden', e: false, w: true, c: true },
      { name: 'locked', e: true, w: true, c: false },
      { name: 'protected', e: false, w: false, c: true },
      { name: 'constant', e: true, w: false, c: false },
      { name: 'secret', e: false, w: true, c: false },
      { name: 'immutable', e: false, w: false, c: false }
    ];
    
    const testObj = {};
    
    combinations.forEach((combo, index) => {
      const propName = `prop_${combo.name}`;
      
      Object.defineProperty(testObj, propName, {
        value: `value for ${combo.name}`,
        enumerable: combo.e,
        writable: combo.w,
        configurable: combo.c
      });
      
      console.log(`\n${combo.name.toUpperCase()} (E:${combo.e} W:${combo.w} C:${combo.c}):`);
      
      // Teste de visibilidade
      const visible = Object.keys(testObj).includes(propName);
      console.log(`  Visible in Object.keys(): ${visible} ${visible === combo.e ? '✅' : '❌'}`);
      
      // Teste de mutabilidade
      const originalValue = testObj[propName];
      testObj[propName] = 'attempted change';
      const changed = testObj[propName] !== originalValue;
      console.log(`  Value changeable: ${changed} ${changed === combo.w ? '✅' : '❌'}`);
      
      // Teste de configurabilidade
      try {
        Object.defineProperty(testObj, propName, { enumerable: !combo.e });
        const reconfSucceeded = true;
        console.log(`  Reconfigurable: ${reconfSucceeded} ${reconfSucceeded === combo.c ? '✅' : '❌'}`);
        
        // Restaurar se mudou
        if (reconfSucceeded) {
          Object.defineProperty(testObj, propName, {
            enumerable: combo.e,
            writable: combo.w,
            configurable: combo.c
          });
        }
      } catch (error) {
        const reconfSucceeded = false;
        console.log(`  Reconfigurable: ${reconfSucceeded} ${reconfSucceeded === combo.c ? '✅' : '❌'}`);
      }
      
      // Teste de deleção
      const beforeDelete = propName in testObj;
      const deleteSucceeded = delete testObj[propName];
      const afterDelete = propName in testObj;
      const actuallyDeleted = beforeDelete && !afterDelete;
      
      console.log(`  Deletable: ${actuallyDeleted} ${actuallyDeleted === combo.c ? '✅' : '❌'}`);
      
      // Recriar se foi deletado
      if (actuallyDeleted) {
        Object.defineProperty(testObj, propName, {
          value: `value for ${combo.name}`,
          enumerable: combo.e,
          writable: combo.w,
          configurable: combo.c
        });
      }
    });
    
    return { combinations, testObj };
  }
  
  static analyzeSecurityImplications(obj) {
    console.log("\n=== Implicações de Segurança ===");
    
    // API Surface Analysis
    const publicAPI = Object.keys(obj);
    const allProperties = Object.getOwnPropertyNames(obj);
    const hiddenProperties = allProperties.filter(prop => !publicAPI.includes(prop));
    
    console.log(`Public API surface: ${publicAPI.length} properties`);
    console.log(`Hidden properties: ${hiddenProperties.length} properties`);
    console.log("Hidden properties:", hiddenProperties);
    
    // Mutation Safety Analysis
    console.log("\n=== Mutation Safety Analysis ===");
    
    allProperties.forEach(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      
      let securityLevel = 'LOW';
      let risks = [];
      
      if (descriptor.enumerable && descriptor.writable && descriptor.configurable) {
        securityLevel = 'HIGH RISK';
        risks.push('Fully exposed and mutable');
      } else if (descriptor.writable && descriptor.configurable) {
        securityLevel = 'MEDIUM RISK';
        risks.push('Hidden but mutable');
      } else if (descriptor.enumerable && descriptor.configurable) {
        securityLevel = 'MEDIUM RISK';
        risks.push('Visible but reconfigurable');
      } else if (!descriptor.enumerable && !descriptor.writable && !descriptor.configurable) {
        securityLevel = 'SECURE';
        risks.push('Fully protected');
      }
      
      if (risks.length > 0) {
        console.log(`  ${prop}: ${securityLevel} - ${risks.join(', ')}`);
      }
    });
  }
  
  static analyzePerformanceCharacteristics() {
    console.log("\n=== Performance Characteristics Analysis ===");
    
    const iterations = 100000;
    const testObjects = {};
    
    // Criar objetos com diferentes configurações
    const configs = [
      { name: 'all-true', e: true, w: true, c: true },
      { name: 'all-false', e: false, w: false, c: false },
      { name: 'enumerable-only', e: true, w: false, c: false },
      { name: 'writable-only', e: false, w: true, c: false }
    ];
    
    configs.forEach(config => {
      testObjects[config.name] = {};
      
      for (let i = 0; i < 50; i++) {
        Object.defineProperty(testObjects[config.name], `prop${i}`, {
          value: i,
          enumerable: config.e,
          writable: config.w,
          configurable: config.c
        });
      }
    });
    
    // Test property access performance
    console.log("=== Property Access Performance ===");
    
    configs.forEach(config => {
      console.time(`Access ${config.name}`);
      
      for (let i = 0; i < iterations; i++) {
        const value = testObjects[config.name].prop1;
      }
      
      console.timeEnd(`Access ${config.name}`);
    });
    
    // Test enumeration performance
    console.log("\n=== Enumeration Performance ===");
    
    configs.forEach(config => {
      console.time(`Enumerate ${config.name}`);
      
      for (let i = 0; i < iterations / 100; i++) {
        Object.keys(testObjects[config.name]);
      }
      
      console.timeEnd(`Enumerate ${config.name}`);
      
      console.log(`  ${config.name} enumerable count: ${Object.keys(testObjects[config.name]).length}`);
    });
    
    // Test modification performance
    console.log("\n=== Modification Performance ===");
    
    configs.forEach(config => {
      if (config.w) { // Only test writable properties
        console.time(`Modify ${config.name}`);
        
        for (let i = 0; i < iterations; i++) {
          testObjects[config.name].prop1 = i;
        }
        
        console.timeEnd(`Modify ${config.name}`);
      } else {
        console.log(`Modify ${config.name}: N/A (not writable)`);
      }
    });
  }
}

// Executar análises
const interactionAnalysis = AttributeInteractionAnalyzer.analyzeAllCombinations();
AttributeInteractionAnalyzer.analyzeSecurityImplications(interactionAnalysis.testObj);
AttributeInteractionAnalyzer.analyzePerformanceCharacteristics();
```

---

## 🔍 Análise Conceitual Profunda

### Advanced Property Protection Patterns

```javascript
// Padrões avançados de proteção usando atributos

class PropertyProtectionPatterns {
  // 1. Immutable Value Pattern
  static createImmutableValue(obj, propName, value) {
    return Object.defineProperty(obj, propName, {
      value: Object.freeze(value),
      writable: false,
      enumerable: true,
      configurable: false
    });
  }
  
  // 2. Hidden Configuration Pattern
  static createHiddenConfig(obj, config) {
    Object.keys(config).forEach(key => {
      Object.defineProperty(obj, `_${key}`, {
        value: config[key],
        writable: false,
        enumerable: false,
        configurable: false
      });
    });
    
    // Accessor público read-only
    Object.keys(config).forEach(key => {
      Object.defineProperty(obj, key, {
        get: function() {
          return this[`_${key}`];
        },
        enumerable: true,
        configurable: false
      });
    });
    
    return obj;
  }
  
  // 3. Graduated Access Pattern
  static createGraduatedAccess(obj, propName, levels) {
    const {
      publicValue = null,
      internalValue = null,
      secretValue = null
    } = levels;
    
    // Public (enumerable, read-only)
    if (publicValue !== null) {
      Object.defineProperty(obj, propName, {
        value: publicValue,
        writable: false,
        enumerable: true,
        configurable: false
      });
    }
    
    // Internal (hidden, writable)
    if (internalValue !== null) {
      Object.defineProperty(obj, `_${propName}`, {
        value: internalValue,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
    
    // Secret (hidden, immutable)
    if (secretValue !== null) {
      Object.defineProperty(obj, `__${propName}`, {
        value: secretValue,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
    
    return obj;
  }
  
  // 4. Lazy Initialization Pattern
  static createLazyProperty(obj, propName, initializerFn, options = {}) {
    const {
      enumerable = true,
      configurable = true,
      cache = true
    } = options;
    
    let initialized = false;
    let cachedValue;
    
    Object.defineProperty(obj, propName, {
      get: function() {
        if (!initialized || !cache) {
          cachedValue = initializerFn.call(this);
          initialized = true;
        }
        return cachedValue;
      },
      
      set: function(value) {
        cachedValue = value;
        initialized = true;
      },
      
      enumerable,
      configurable
    });
    
    return obj;
  }
  
  // 5. Property Lifecycle Pattern
  static createLifecycleProperty(obj, propName, lifecycle = {}) {
    const {
      onCreate = () => {},
      onRead = () => {},
      onWrite = () => {},
      onDelete = () => {},
      validator = () => true
    } = lifecycle;
    
    let internalValue;
    let created = false;
    
    Object.defineProperty(obj, propName, {
      get: function() {
        if (!created) {
          internalValue = onCreate.call(this, propName);
          created = true;
        }
        
        onRead.call(this, internalValue, propName);
        return internalValue;
      },
      
      set: function(newValue) {
        if (!validator.call(this, newValue, internalValue, propName)) {
          throw new Error(`Validation failed for ${propName}: ${newValue}`);
        }
        
        const oldValue = internalValue;
        internalValue = newValue;
        created = true;
        
        onWrite.call(this, newValue, oldValue, propName);
      },
      
      enumerable: true,
      configurable: true
    });
    
    // Override delete behavior
    const originalDelete = obj.constructor.prototype || obj;
    if (!originalDelete._propertyDeleteHandlers) {
      originalDelete._propertyDeleteHandlers = new Map();
    }
    
    originalDelete._propertyDeleteHandlers.set(propName, function() {
      onDelete.call(this, internalValue, propName);
    });
    
    return obj;
  }
  
  // 6. Attribute Migration Pattern
  static migratePropertyAttributes(obj, propName, migrations) {
    const currentDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
    if (!currentDescriptor) {
      throw new Error(`Property ${propName} does not exist`);
    }
    
    const migrationLog = [];
    
    migrations.forEach((migration, index) => {
      const {
        condition = () => true,
        changes = {},
        description = `Migration ${index + 1}`
      } = migration;
      
      if (condition(currentDescriptor, obj, propName)) {
        const newDescriptor = { ...currentDescriptor, ...changes };
        
        try {
          Object.defineProperty(obj, propName, newDescriptor);
          migrationLog.push({
            description,
            applied: true,
            changes,
            timestamp: new Date()
          });
        } catch (error) {
          migrationLog.push({
            description,
            applied: false,
            error: error.message,
            timestamp: new Date()
          });
        }
      }
    });
    
    return migrationLog;
  }
}

// Demonstração dos Protection Patterns
function demonstrarProtectionPatterns() {
  console.log("\n=== Demonstração Protection Patterns ===");
  
  // 1. Immutable Value
  console.log("=== Immutable Value Pattern ===");
  const config = {};
  PropertyProtectionPatterns.createImmutableValue(config, 'VERSION', '1.0.0');
  PropertyProtectionPatterns.createImmutableValue(config, 'FEATURES', ['auth', 'api', 'ui']);
  
  console.log("Config version:", config.VERSION);
  console.log("Config features:", config.FEATURES);
  
  try {
    config.VERSION = '2.0.0';
    console.log("❌ Version change succeeded unexpectedly:", config.VERSION);
  } catch (error) {
    console.log("✅ Version change correctly blocked");
  }
  
  // 2. Hidden Configuration
  console.log("\n=== Hidden Configuration Pattern ===");
  const service = {};
  PropertyProtectionPatterns.createHiddenConfig(service, {
    apiKey: 'secret-key-123',
    timeout: 5000,
    retries: 3
  });
  
  console.log("Public properties:", Object.keys(service));
  console.log("All properties:", Object.getOwnPropertyNames(service));
  console.log("API Key (read-only):", service.apiKey);
  
  try {
    service.apiKey = 'new-key';
    console.log("API Key after change attempt:", service.apiKey);
  } catch (error) {
    console.log("API Key change error:", error.message);
  }
  
  // 3. Graduated Access
  console.log("\n=== Graduated Access Pattern ===");
  const user = {};
  PropertyProtectionPatterns.createGraduatedAccess(user, 'id', {
    publicValue: 'user-123',
    internalValue: 12345,
    secretValue: 'internal-uuid-456'
  });
  
  console.log("Public ID:", user.id);
  console.log("Internal ID:", user._id);
  console.log("Secret ID:", user.__id);
  
  console.log("Enumerable properties:", Object.keys(user));
  
  // 4. Lazy Initialization
  console.log("\n=== Lazy Initialization Pattern ===");
  const calculator = {};
  PropertyProtectionPatterns.createLazyProperty(calculator, 'expensiveComputation', function() {
    console.log("Performing expensive computation...");
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += Math.random();
    }
    return sum;
  });
  
  console.log("Calculator created (computation not yet performed)");
  console.log("First access:", calculator.expensiveComputation);
  console.log("Second access (should be cached):", calculator.expensiveComputation);
  
  // 5. Property Lifecycle
  console.log("\n=== Property Lifecycle Pattern ===");
  const entity = {};
  PropertyProtectionPatterns.createLifecycleProperty(entity, 'status', {
    onCreate: () => {
      console.log("Status property created with default value");
      return 'initialized';
    },
    onRead: (value) => {
      console.log(`Status read: ${value}`);
    },
    onWrite: (newValue, oldValue) => {
      console.log(`Status changed: ${oldValue} -> ${newValue}`);
    },
    validator: (value) => {
      const validStatuses = ['initialized', 'active', 'inactive', 'deleted'];
      return validStatuses.includes(value);
    }
  });
  
  console.log("First read:", entity.status);
  entity.status = 'active';
  console.log("After setting active:", entity.status);
  
  try {
    entity.status = 'invalid';
  } catch (error) {
    console.log("Invalid status error:", error.message);
  }
  
  // 6. Attribute Migration
  console.log("\n=== Attribute Migration Pattern ===");
  const document = { title: 'Test Document' };
  
  const migrationLog = PropertyProtectionPatterns.migratePropertyAttributes(document, 'title', [
    {
      description: 'Make title non-enumerable',
      condition: (desc) => desc.enumerable === true,
      changes: { enumerable: false }
    },
    {
      description: 'Make title read-only',
      condition: (desc) => desc.writable !== false,
      changes: { writable: false }
    },
    {
      description: 'Lock title configuration',
      condition: (desc) => desc.configurable !== false,
      changes: { configurable: false }
    }
  ]);
  
  console.log("Migration log:", migrationLog);
  console.log("Final title descriptor:", Object.getOwnPropertyDescriptor(document, 'title'));
  console.log("Document keys after migration:", Object.keys(document));
}

demonstrarProtectionPatterns();
```

---

## 🎯 Aplicabilidade e Contextos

### Real-World Use Cases

```javascript
// Casos de uso do mundo real para controle de atributos

// 1. Library API Design
class SecureLibrary {
  constructor() {
    // Public constants
    Object.defineProperty(this, 'VERSION', {
      value: '2.1.0',
      writable: false,
      enumerable: true,
      configurable: false
    });
    
    // Hidden internal state
    Object.defineProperty(this, '_initialized', {
      value: false,
      writable: true,
      enumerable: false,
      configurable: false
    });
    
    // Protected configuration
    Object.defineProperty(this, '_config', {
      value: {},
      writable: false,
      enumerable: false,
      configurable: false
    });
    
    // Public API methods (read-only)
    this._setupAPIMethods();
  }
  
  _setupAPIMethods() {
    const apiMethods = ['init', 'process', 'destroy'];
    
    apiMethods.forEach(methodName => {
      Object.defineProperty(this, methodName, {
        value: this[`_${methodName}`].bind(this),
        writable: false,
        enumerable: true,
        configurable: false
      });
    });
  }
  
  _init(config) {
    if (this._initialized) {
      throw new Error('Library already initialized');
    }
    
    Object.assign(this._config, config);
    this._initialized = true;
    return this;
  }
  
  _process(data) {
    if (!this._initialized) {
      throw new Error('Library not initialized');
    }
    
    return `Processed: ${data}`;
  }
  
  _destroy() {
    this._initialized = false;
    Object.keys(this._config).forEach(key => delete this._config[key]);
  }
}

// 2. Configuration Management
class ConfigurationManager {
  constructor(initialConfig = {}) {
    // Setup configuration with different protection levels
    this._setupConfiguration(initialConfig);
  }
  
  _setupConfiguration(config) {
    Object.keys(config).forEach(key => {
      const value = config[key];
      const protection = this._getProtectionLevel(key, value);
      
      switch (protection) {
        case 'readonly':
          Object.defineProperty(this, key, {
            value: value,
            writable: false,
            enumerable: true,
            configurable: false
          });
          break;
          
        case 'hidden':
          Object.defineProperty(this, `_${key}`, {
            value: value,
            writable: true,
            enumerable: false,
            configurable: true
          });
          
          // Create public getter
          Object.defineProperty(this, key, {
            get: function() { return this[`_${key}`]; },
            enumerable: true,
            configurable: false
          });
          break;
          
        case 'secure':
          Object.defineProperty(this, `__${key}`, {
            value: value,
            writable: false,
            enumerable: false,
            configurable: false
          });
          break;
          
        case 'normal':
        default:
          Object.defineProperty(this, key, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true
          });
          break;
      }
    });
  }
  
  _getProtectionLevel(key, value) {
    // Constants and versions are readonly
    if (key.toUpperCase() === key || key === 'version') {
      return 'readonly';
    }
    
    // Sensitive data is secure
    if (key.includes('key') || key.includes('secret') || key.includes('password')) {
      return 'secure';
    }
    
    // Internal configurations are hidden
    if (key.startsWith('_') || key.includes('internal')) {
      return 'hidden';
    }
    
    return 'normal';
  }
}

// 3. State Management with Validation
class ValidatedState {
  constructor(schema) {
    this._schema = schema;
    this._state = {};
    this._setupStateProperties();
  }
  
  _setupStateProperties() {
    Object.keys(this._schema).forEach(key => {
      const config = this._schema[key];
      
      Object.defineProperty(this, key, {
        get: function() {
          return this._state[key];
        },
        
        set: function(value) {
          this._validateValue(key, value, config);
          this._state[key] = value;
        },
        
        enumerable: true,
        configurable: false
      });
    });
  }
  
  _validateValue(key, value, config) {
    const { type, required, validator, min, max } = config;
    
    if (required && (value === undefined || value === null)) {
      throw new Error(`${key} is required`);
    }
    
    if (value !== undefined && type && typeof value !== type) {
      throw new TypeError(`${key} must be of type ${type}`);
    }
    
    if (typeof value === 'number') {
      if (min !== undefined && value < min) {
        throw new Error(`${key} must be >= ${min}`);
      }
      if (max !== undefined && value > max) {
        throw new Error(`${key} must be <= ${max}`);
      }
    }
    
    if (validator && !validator(value)) {
      throw new Error(`Validation failed for ${key}`);
    }
  }
}

// 4. Event System with Protection
class ProtectedEventEmitter {
  constructor() {
    // Hidden event storage
    Object.defineProperty(this, '_events', {
      value: new Map(),
      writable: false,
      enumerable: false,
      configurable: false
    });
    
    // Read-only event count
    Object.defineProperty(this, 'eventCount', {
      get: function() {
        return this._events.size;
      },
      enumerable: true,
      configurable: false
    });
    
    // Protected methods
    this._protectMethods();
  }
  
  _protectMethods() {
    const publicMethods = ['on', 'off', 'emit', 'listenerCount'];
    
    publicMethods.forEach(method => {
      Object.defineProperty(this, method, {
        value: this[`_${method}`].bind(this),
        writable: false,
        enumerable: true,
        configurable: false
      });
    });
  }
  
  _on(event, listener) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).push(listener);
  }
  
  _off(event, listener) {
    if (this._events.has(event)) {
      const listeners = this._events.get(event);
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  _emit(event, ...args) {
    if (this._events.has(event)) {
      this._events.get(event).forEach(listener => {
        try {
          listener.apply(this, args);
        } catch (error) {
          console.error(`Error in event listener for '${event}':`, error);
        }
      });
    }
  }
  
  _listenerCount(event) {
    return this._events.has(event) ? this._events.get(event).length : 0;
  }
}

// Demonstração dos casos de uso
function demonstrarRealWorldUseCases() {
  console.log("\n=== Real-World Use Cases ===");
  
  // 1. Secure Library
  console.log("=== Secure Library ===");
  const lib = new SecureLibrary();
  console.log("Library version:", lib.VERSION);
  console.log("Public API:", Object.keys(lib));
  console.log("All properties:", Object.getOwnPropertyNames(lib));
  
  try {
    lib.init({ debug: true, timeout: 1000 });
    console.log("Library initialized successfully");
    console.log("Process result:", lib.process("test data"));
  } catch (error) {
    console.log("Library error:", error.message);
  }
  
  // 2. Configuration Manager
  console.log("\n=== Configuration Manager ===");
  const config = new ConfigurationManager({
    VERSION: '1.0.0',
    apiKey: 'secret-123',
    internal_cache_size: 1000,
    debug: true,
    normal_setting: 'value'
  });
  
  console.log("Public config keys:", Object.keys(config));
  console.log("All config properties:", Object.getOwnPropertyNames(config));
  console.log("Version:", config.VERSION);
  console.log("Debug:", config.debug);
  
  try {
    config.debug = false;
    console.log("Debug after change:", config.debug);
  } catch (error) {
    console.log("Config change error:", error.message);
  }
  
  // 3. Validated State
  console.log("\n=== Validated State ===");
  const state = new ValidatedState({
    name: { type: 'string', required: true },
    age: { type: 'number', min: 0, max: 150 },
    email: { 
      type: 'string', 
      validator: (value) => value.includes('@') 
    }
  });
  
  try {
    state.name = 'John Doe';
    state.age = 30;
    state.email = 'john@example.com';
    
    console.log("State:", { name: state.name, age: state.age, email: state.email });
    
    state.age = 200; // Should fail
  } catch (error) {
    console.log("State validation error:", error.message);
  }
  
  // 4. Protected Event Emitter
  console.log("\n=== Protected Event Emitter ===");
  const emitter = new ProtectedEventEmitter();
  
  emitter.on('test', (data) => console.log('Test event:', data));
  console.log("Event count:", emitter.eventCount);
  console.log("Listener count for 'test':", emitter.listenerCount('test'));
  
  emitter.emit('test', 'Hello World');
  
  console.log("Emitter public API:", Object.keys(emitter));
  console.log("Emitter all properties:", Object.getOwnPropertyNames(emitter));
}

demonstrarRealWorldUseCases();
```

---

## 📚 Conclusão

Os atributos **enumerable**, **writable** e **configurable** são **ferramentas fundamentais** para **controle granular** sobre o comportamento de propriedades em JavaScript, oferecendo **precision control** sobre **visibility**, **mutability** e **reconfigurability**.

**Características distintivas:**

- **Enumerable:** Controla **visibility** em iterações, serialização e discovery
- **Writable:** Governa **mutability** de valores através de assignment direto
- **Configurable:** Determina **reconfigurability** e **deletability** das propriedades
- **Interaction Patterns:** Combinações criam **protection levels** diferenciados
- **Performance Impact:** Diferentes configurações têm **custos operacionais** específicos

**Casos de uso estratégicos:**

- **Library Design:** API protection com granular access control
- **Configuration Management:** Multi-level security para configurações sensíveis
- **State Management:** Validated state com controlled mutations
- **Framework Development:** Internal property hiding e protection
- **Security Patterns:** Property-based access control e encapsulation

É **essencial** para **desenvolvimento robusto** que exija **fine-grained control** sobre propriedades, **secure API design**, **encapsulation patterns** e **behavioral customization** avançada em **library** e **framework development**.