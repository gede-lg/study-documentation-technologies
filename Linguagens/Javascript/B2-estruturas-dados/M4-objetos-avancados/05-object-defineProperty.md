# Object.defineProperty() em JavaScript: Definição Avançada de Propriedades com Descriptors

## 🎯 Introdução e Definição

### Definição Conceitual

**`Object.defineProperty()`** é um **método estático** do objeto `Object` que permite **definir ou modificar** uma propriedade diretamente em um objeto, especificando **property descriptors** detalhados que controlam o **comportamento** e **características** da propriedade. Oferece **controle granular** sobre atributos como **enumerabilidade**, **mutabilidade** e **configurabilidade**.

Conceitualmente, representa uma **operação de metaprogramming** que permite **definir propriedades** com **semânticas personalizadas**, indo além da **atribuição simples** (`obj.prop = value`) para fornecer **controle total** sobre como a propriedade se comporta em diferentes **contextos de uso**.

### Sintaxe e Comportamento Fundamental

```javascript
Object.defineProperty(obj, prop, descriptor)
// Retorna: obj (o objeto modificado)
```

**Parâmetros:**
- **`obj`**: Objeto no qual a propriedade será definida
- **`prop`**: Nome da propriedade (string ou Symbol)
- **`descriptor`**: Objeto descriptor com atributos da propriedade

**Characteristics essenciais:**
- **Fine-grained control** sobre propriedades
- **Descriptor-based** configuration
- **Immutable enforcement** através de atributos
- **Property semantics** customizáveis

### Problema Fundamental que Resolve

Resolve a necessidade de **controle avançado** sobre propriedades de objetos, permitindo **encapsulamento**, **validação**, **computed properties**, **immutability** e **API protection** que não são possíveis com **atribuição direta** de propriedades.

**Sem Object.defineProperty():**
```javascript
const obj = {};
obj.value = 42; // Propriedade sempre enumerável, editável, configurável

// Não há controle sobre:
// - Enumerabilidade em for...in / Object.keys()
// - Proteção contra modificação
// - Proteção contra remoção
// - Getters/setters personalizados
```

**Com Object.defineProperty():**
```javascript
const obj = {};
Object.defineProperty(obj, 'value', {
  value: 42,
  writable: false,    // Não editável
  enumerable: false,  // Não aparece em iterações
  configurable: false // Não removível
});
```

---

## 📋 Sumário Conceitual

### Aspectos Fundamentais

1. **Descriptor Types:** Data descriptors vs Accessor descriptors
2. **Attribute Control:** enumerable, writable, configurable
3. **Property Definition:** Criação com semânticas específicas
4. **Validation Logic:** Getters/setters com validação
5. **Encapsulation:** Private-like behavior através de descriptors

### Características Operacionais

- **Return Value:** O objeto modificado (mesmo objeto passado)
- **Descriptor Types:** Data (value/writable) ou Accessor (get/set)
- **Attribute Defaults:** false para todos os atributos se omitidos
- **Immutability:** Propriedades podem ser protegidas contra mudanças

---

## 🧠 Fundamentos Teóricos

### Mecânicas de Property Definition

#### Algoritmo de Property Definition
```javascript
// Demonstração das mecânicas internas do Object.defineProperty()

function demonstrarMecanicasDefineProperty() {
  console.log("=== Mecânicas Internas do Object.defineProperty() ===");
  
  const obj = {};
  
  // 1. Data Descriptor - valor simples
  Object.defineProperty(obj, 'simpleValue', {
    value: 42,
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  console.log("Propriedade simpleValue definida:", obj.simpleValue);
  
  // 2. Data Descriptor - valor protegido
  Object.defineProperty(obj, 'constantValue', {
    value: 'immutable',
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  console.log("Propriedade constantValue:", obj.constantValue);
  
  // Teste de imutabilidade
  try {
    obj.constantValue = 'new value';
    console.log("Tentativa de modificação (silenciosa):", obj.constantValue);
  } catch (error) {
    console.log("Erro na modificação:", error.message);
  }
  
  // 3. Accessor Descriptor - getter/setter
  let internalValue = 0;
  
  Object.defineProperty(obj, 'computedValue', {
    get() {
      console.log("Getter called - reading computedValue");
      return internalValue * 2;
    },
    set(newValue) {
      console.log("Setter called - writing computedValue:", newValue);
      if (typeof newValue !== 'number') {
        throw new TypeError('Value must be a number');
      }
      internalValue = newValue;
    },
    enumerable: true,
    configurable: true
  });
  
  console.log("Initial computedValue:", obj.computedValue); // 0
  obj.computedValue = 5;
  console.log("After setting to 5:", obj.computedValue); // 10
  
  // 4. Propriedade não-enumerável
  Object.defineProperty(obj, 'hiddenValue', {
    value: 'secret',
    writable: true,
    enumerable: false, // Não aparece em Object.keys()
    configurable: true
  });
  
  console.log("\n=== Análise de Enumerabilidade ===");
  console.log("Object.keys():", Object.keys(obj));
  console.log("hasOwnProperty('hiddenValue'):", obj.hasOwnProperty('hiddenValue'));
  console.log("Direct access hiddenValue:", obj.hiddenValue);
  
  // 5. Propriedade não-configurável
  Object.defineProperty(obj, 'lockedValue', {
    value: 'locked',
    writable: true,
    enumerable: true,
    configurable: false // Não pode ser deletada ou reconfigurada
  });
  
  console.log("\n=== Teste de Configurabilidade ===");
  try {
    delete obj.lockedValue;
    console.log("Tentativa de delete (falhou silenciosamente):", 'lockedValue' in obj);
  } catch (error) {
    console.log("Erro no delete:", error.message);
  }
  
  // Tentativa de redefinir propriedade não-configurável
  try {
    Object.defineProperty(obj, 'lockedValue', {
      value: 'new value'
    });
    console.log("Redefinição bem-sucedida (permitida):", obj.lockedValue);
  } catch (error) {
    console.log("Erro na redefinição:", error.message);
  }
  
  return obj;
}

const testObj = demonstrarMecanicasDefineProperty();

// Demonstração de descriptor defaults
function demonstrarDescriptorDefaults() {
  console.log("\n=== Descriptor Defaults ===");
  
  const obj = {};
  
  // Sem especificar atributos (todos ficam false por default)
  Object.defineProperty(obj, 'defaultProp', {
    value: 'test'
    // writable: false (default)
    // enumerable: false (default) 
    // configurable: false (default)
  });
  
  console.log("Propriedade com defaults:", obj.defaultProp);
  console.log("Aparece em Object.keys():", Object.keys(obj));
  console.log("É writable:", Object.getOwnPropertyDescriptor(obj, 'defaultProp').writable);
  
  // Comparar com atribuição direta
  obj.directProp = 'direct';
  
  console.log("\n=== Comparação: defineProperty vs Atribuição Direta ===");
  console.log("defineProperty descriptor:", Object.getOwnPropertyDescriptor(obj, 'defaultProp'));
  console.log("Direct assignment descriptor:", Object.getOwnPropertyDescriptor(obj, 'directProp'));
}

demonstrarDescriptorDefaults();
```

#### Data vs Accessor Descriptors
```javascript
// Análise detalhada dos tipos de descriptors

function analisarTiposDescriptors() {
  console.log("\n=== Análise: Data vs Accessor Descriptors ===");
  
  const obj = {};
  
  // DATA DESCRIPTOR
  console.log("=== Data Descriptor ===");
  
  Object.defineProperty(obj, 'dataProperty', {
    value: 'initial value',
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  const dataDesc = Object.getOwnPropertyDescriptor(obj, 'dataProperty');
  console.log("Data descriptor:", dataDesc);
  console.log("Tem value:", 'value' in dataDesc);
  console.log("Tem writable:", 'writable' in dataDesc);
  console.log("Tem get:", 'get' in dataDesc);
  console.log("Tem set:", 'set' in dataDesc);
  
  // ACCESSOR DESCRIPTOR
  console.log("\n=== Accessor Descriptor ===");
  
  let backingValue = 'backing store';
  
  Object.defineProperty(obj, 'accessorProperty', {
    get() {
      console.log("Getter executado");
      return backingValue.toUpperCase();
    },
    set(newValue) {
      console.log("Setter executado com:", newValue);
      backingValue = String(newValue).toLowerCase();
    },
    enumerable: true,
    configurable: true
  });
  
  const accessorDesc = Object.getOwnPropertyDescriptor(obj, 'accessorProperty');
  console.log("Accessor descriptor:", accessorDesc);
  console.log("Tem value:", 'value' in accessorDesc);
  console.log("Tem writable:", 'writable' in accessorDesc);
  console.log("Tem get:", 'get' in accessorDesc);
  console.log("Tem set:", 'set' in accessorDesc);
  
  // Teste de funcionamento
  console.log("\n=== Teste de Funcionamento ===");
  console.log("Reading accessorProperty:", obj.accessorProperty);
  obj.accessorProperty = 'New Value';
  console.log("After setting:", obj.accessorProperty);
  console.log("Backing value:", backingValue);
  
  // INVALID DESCRIPTOR - misturar data e accessor
  console.log("\n=== Tentativa de Descriptor Inválido ===");
  try {
    Object.defineProperty(obj, 'invalidProp', {
      value: 'test',           // Data descriptor attribute
      get() { return 'get'; }, // Accessor descriptor attribute
      enumerable: true
    });
  } catch (error) {
    console.log("Erro esperado:", error.message);
  }
  
  // GETTER-ONLY (read-only accessor)
  console.log("\n=== Getter-Only Property ===");
  
  Object.defineProperty(obj, 'readOnlyComputed', {
    get() {
      return new Date().toISOString();
    },
    enumerable: true,
    configurable: false
  });
  
  console.log("Read-only computed:", obj.readOnlyComputed);
  
  try {
    obj.readOnlyComputed = 'cannot set';
    console.log("Tentativa de set (falhou silenciosamente)");
  } catch (error) {
    console.log("Erro no set:", error.message);
  }
  
  // SETTER-ONLY (write-only accessor)
  console.log("\n=== Setter-Only Property ===");
  
  let writeOnlyStore = null;
  
  Object.defineProperty(obj, 'writeOnlyProperty', {
    set(value) {
      console.log("Write-only setter chamado:", value);
      writeOnlyStore = value;
    },
    enumerable: true,
    configurable: true
  });
  
  obj.writeOnlyProperty = 'secret data';
  console.log("Tentativa de read (undefined):", obj.writeOnlyProperty);
  console.log("Valor no store:", writeOnlyStore);
}

analisarTiposDescriptors();
```

### Property Validation e Computed Properties

#### Advanced Validation Patterns
```javascript
// Padrões avançados de validação usando Object.defineProperty()

class ValidatedObject {
  constructor() {
    // Armazenamento interno privado
    this._data = {};
    this._validators = new Map();
    this._transformers = new Map();
    this._listeners = new Map();
  }
  
  // Definir propriedade com validação
  defineValidatedProperty(name, options = {}) {
    const {
      validator = () => true,
      transformer = (val) => val,
      defaultValue = undefined,
      required = false,
      type = null,
      enumerable = true,
      configurable = true
    } = options;
    
    // Armazenar configurações
    this._validators.set(name, validator);
    this._transformers.set(name, transformer);
    
    // Valor inicial
    this._data[name] = defaultValue;
    
    Object.defineProperty(this, name, {
      get() {
        return this._data[name];
      },
      
      set(newValue) {
        // Validação de required
        if (required && (newValue === null || newValue === undefined)) {
          throw new Error(`Property '${name}' is required`);
        }
        
        // Validação de tipo
        if (type !== null && newValue !== null && newValue !== undefined) {
          if (typeof newValue !== type) {
            throw new TypeError(`Property '${name}' must be of type '${type}', got '${typeof newValue}'`);
          }
        }
        
        // Transformer
        let transformedValue = newValue;
        if (this._transformers.has(name)) {
          try {
            transformedValue = this._transformers.get(name)(newValue);
          } catch (error) {
            throw new Error(`Transformation failed for '${name}': ${error.message}`);
          }
        }
        
        // Validação customizada
        if (this._validators.has(name)) {
          const isValid = this._validators.get(name)(transformedValue);
          if (!isValid) {
            throw new Error(`Validation failed for property '${name}' with value: ${transformedValue}`);
          }
        }
        
        // Notificar listeners antes da mudança
        if (this._listeners.has(name)) {
          this._listeners.get(name).forEach(listener => {
            listener(transformedValue, this._data[name], name);
          });
        }
        
        // Atualizar valor
        this._data[name] = transformedValue;
      },
      
      enumerable,
      configurable
    });
    
    return this;
  }
  
  // Adicionar listener para mudanças
  addListener(property, listener) {
    if (!this._listeners.has(property)) {
      this._listeners.set(property, new Set());
    }
    this._listeners.get(property).add(listener);
    
    return () => {
      this._listeners.get(property).delete(listener);
    };
  }
  
  // Validar objeto completo
  validate() {
    const errors = [];
    
    for (const [name, validator] of this._validators) {
      try {
        const isValid = validator(this._data[name]);
        if (!isValid) {
          errors.push(`Validation failed for '${name}': ${this._data[name]}`);
        }
      } catch (error) {
        errors.push(`Validation error for '${name}': ${error.message}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Serializar apenas dados válidos
  toJSON() {
    const result = {};
    
    Object.keys(this._data).forEach(key => {
      const descriptor = Object.getOwnPropertyDescriptor(this, key);
      if (descriptor && descriptor.enumerable) {
        result[key] = this._data[key];
      }
    });
    
    return result;
  }
}

// Demonstração da ValidatedObject
function demonstrarValidatedObject() {
  console.log("\n=== Demonstração ValidatedObject ===");
  
  const user = new ValidatedObject();
  
  // Email com validação
  user.defineValidatedProperty('email', {
    validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    transformer: (email) => email.toLowerCase().trim(),
    required: true,
    type: 'string'
  });
  
  // Age com validação de range
  user.defineValidatedProperty('age', {
    validator: (age) => age >= 0 && age <= 150,
    type: 'number',
    required: true
  });
  
  // Name com transformação
  user.defineValidatedProperty('name', {
    transformer: (name) => name.trim().replace(/\s+/g, ' '),
    validator: (name) => name.length >= 2,
    type: 'string',
    required: true
  });
  
  // Score com listener
  user.defineValidatedProperty('score', {
    validator: (score) => score >= 0 && score <= 100,
    type: 'number',
    defaultValue: 0
  });
  
  // Adicionar listener para score
  const unsubscribe = user.addListener('score', (newVal, oldVal, prop) => {
    console.log(`Score changed from ${oldVal} to ${newVal}`);
  });
  
  // Testes de validação
  console.log("=== Testes de Validação ===");
  
  try {
    user.email = '  TEST@EXAMPLE.COM  ';
    console.log("Email válido:", user.email);
  } catch (error) {
    console.log("Erro email:", error.message);
  }
  
  try {
    user.age = 25;
    console.log("Age válida:", user.age);
  } catch (error) {
    console.log("Erro age:", error.message);
  }
  
  try {
    user.name = '   João    Silva   ';
    console.log("Name processado:", user.name);
  } catch (error) {
    console.log("Erro name:", error.message);
  }
  
  try {
    user.score = 85;
    user.score = 95; // Deve disparar listener
  } catch (error) {
    console.log("Erro score:", error.message);
  }
  
  // Teste de validação global
  console.log("\n=== Validação Global ===");
  const validation = user.validate();
  console.log("Validação:", validation);
  
  // Serialização
  console.log("JSON:", JSON.stringify(user));
  
  // Teste de erro
  console.log("\n=== Teste de Erro ===");
  try {
    user.email = 'invalid-email';
  } catch (error) {
    console.log("Erro esperado:", error.message);
  }
  
  try {
    user.age = -5;
  } catch (error) {
    console.log("Erro esperado:", error.message);
  }
  
  unsubscribe(); // Cleanup
}

demonstrarValidatedObject();
```

---

## 🔍 Análise Conceitual Profunda

### Performance Analysis

#### Benchmark defineProperty vs Direct Assignment
```javascript
// Análise de performance: defineProperty vs atribuição direta

function performanceAnalysis() {
  console.log("\n=== Performance Analysis ===");
  
  const iterations = 100000;
  
  // 1. Direct Assignment Benchmark
  console.time("Direct Assignment");
  for (let i = 0; i < iterations; i++) {
    const obj = {};
    obj.prop1 = i;
    obj.prop2 = i * 2;
    obj.prop3 = i * 3;
  }
  console.timeEnd("Direct Assignment");
  
  // 2. Object.defineProperty Benchmark
  console.time("Object.defineProperty");
  for (let i = 0; i < iterations; i++) {
    const obj = {};
    Object.defineProperty(obj, 'prop1', { value: i, writable: true, enumerable: true, configurable: true });
    Object.defineProperty(obj, 'prop2', { value: i * 2, writable: true, enumerable: true, configurable: true });
    Object.defineProperty(obj, 'prop3', { value: i * 3, writable: true, enumerable: true, configurable: true });
  }
  console.timeEnd("Object.defineProperty");
  
  // 3. Mixed Approach Benchmark
  console.time("Mixed Approach");
  for (let i = 0; i < iterations; i++) {
    const obj = {};
    // Direct para propriedades simples
    obj.prop1 = i;
    obj.prop2 = i * 2;
    // defineProperty apenas quando necessário
    Object.defineProperty(obj, 'prop3', { 
      value: i * 3, 
      enumerable: false // Caso específico
    });
  }
  console.timeEnd("Mixed Approach");
  
  // 4. Accessor Performance
  console.time("Accessor Properties");
  for (let i = 0; i < iterations; i++) {
    const obj = {};
    let internalValue = i;
    Object.defineProperty(obj, 'computedProp', {
      get: () => internalValue * 2,
      set: (val) => internalValue = val
    });
  }
  console.timeEnd("Accessor Properties");
  
  // 5. Property Access Performance
  const testObjects = [];
  
  // Criar objetos para teste
  for (let i = 0; i < 1000; i++) {
    const directObj = { value: i };
    const definedObj = {};
    Object.defineProperty(definedObj, 'value', { 
      value: i, 
      writable: true, 
      enumerable: true, 
      configurable: true 
    });
    
    testObjects.push({ direct: directObj, defined: definedObj });
  }
  
  // Teste de acesso - direct
  console.time("Access Direct Properties");
  let sum1 = 0;
  for (let i = 0; i < iterations; i++) {
    const obj = testObjects[i % testObjects.length].direct;
    sum1 += obj.value;
  }
  console.timeEnd("Access Direct Properties");
  
  // Teste de acesso - defined
  console.time("Access Defined Properties");
  let sum2 = 0;
  for (let i = 0; i < iterations; i++) {
    const obj = testObjects[i % testObjects.length].defined;
    sum2 += obj.value;
  }
  console.timeEnd("Access Defined Properties");
  
  console.log("Sums match:", sum1 === sum2);
  
  // Memory usage analysis
  console.log("\n=== Memory Usage Analysis ===");
  
  const measureMemory = (name, createFn, count = 10000) => {
    const objects = [];
    const start = performance.now();
    
    for (let i = 0; i < count; i++) {
      objects.push(createFn(i));
    }
    
    const end = performance.now();
    console.log(`${name}: ${count} objects created in ${(end - start).toFixed(2)}ms`);
    
    return objects;
  };
  
  const directObjects = measureMemory("Direct Assignment", (i) => ({ value: i }));
  
  const definedObjects = measureMemory("defineProperty", (i) => {
    const obj = {};
    Object.defineProperty(obj, 'value', { 
      value: i, 
      writable: true, 
      enumerable: true, 
      configurable: true 
    });
    return obj;
  });
  
  const accessorObjects = measureMemory("Accessor Properties", (i) => {
    const obj = {};
    let val = i;
    Object.defineProperty(obj, 'value', {
      get: () => val,
      set: (newVal) => val = newVal
    });
    return obj;
  });
}

performanceAnalysis();
```

### Polyfill Implementation

#### Complete Polyfill for defineProperty
```javascript
// Polyfill completo para Object.defineProperty()

function implementDefinePropertyPolyfill() {
  console.log("\n=== Polyfill Implementation ===");
  
  // Salvar referência original (se existir)
  const originalDefineProperty = Object.defineProperty;
  
  // Implementação do polyfill
  if (!Object.defineProperty || !Object.getOwnPropertyDescriptor) {
    
    // Helper: converter descriptor para formato interno
    const normalizeDescriptor = (descriptor) => {
      const normalized = {};
      
      // Verificar conflitos entre data e accessor descriptors
      const hasDataDesc = 'value' in descriptor || 'writable' in descriptor;
      const hasAccessorDesc = 'get' in descriptor || 'set' in descriptor;
      
      if (hasDataDesc && hasAccessorDesc) {
        throw new TypeError('Property descriptors must not specify a value or be writable when a getter or setter has been specified');
      }
      
      // Normalizar atributos com defaults
      normalized.enumerable = Boolean(descriptor.enumerable);
      normalized.configurable = Boolean(descriptor.configurable);
      
      if (hasAccessorDesc) {
        // Accessor descriptor
        normalized.get = typeof descriptor.get === 'function' ? descriptor.get : undefined;
        normalized.set = typeof descriptor.set === 'function' ? descriptor.set : undefined;
      } else {
        // Data descriptor
        normalized.value = descriptor.value;
        normalized.writable = Boolean(descriptor.writable);
      }
      
      return normalized;
    };
    
    // Polyfill Object.defineProperty
    Object.defineProperty = function(obj, prop, descriptor) {
      if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
        throw new TypeError('Object.defineProperty called on non-object');
      }
      
      if (typeof prop !== 'string' && typeof prop !== 'symbol') {
        prop = String(prop);
      }
      
      const desc = normalizeDescriptor(descriptor);
      
      // Para browsers muito antigos, fallback para atribuição simples
      if (desc.get || desc.set) {
        // Tentar usar __defineGetter__/__defineSetter__ se disponível
        if (obj.__defineGetter__ && obj.__defineSetter__) {
          if (desc.get) obj.__defineGetter__(prop, desc.get);
          if (desc.set) obj.__defineSetter__(prop, desc.set);
        } else {
          // Fallback: atribuição simples (perde funcionalidade de accessor)
          console.warn('Accessor properties not supported, using simple assignment');
          if (desc.get) {
            obj[prop] = desc.get();
          }
        }
      } else {
        // Data descriptor - atribuição simples
        obj[prop] = desc.value;
      }
      
      // Tentar simular non-enumerable (limitado)
      if (!desc.enumerable && obj.propertyIsEnumerable) {
        // Não há forma real de tornar uma propriedade non-enumerable em ES3
        console.warn('Non-enumerable properties not fully supported');
      }
      
      return obj;
    };
    
    // Polyfill Object.getOwnPropertyDescriptor
    Object.getOwnPropertyDescriptor = function(obj, prop) {
      if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
        throw new TypeError('Object.getOwnPropertyDescriptor called on non-object');
      }
      
      if (!(prop in obj)) {
        return undefined;
      }
      
      // Descriptor básico (limitado em browsers antigos)
      const descriptor = {
        enumerable: obj.propertyIsEnumerable ? obj.propertyIsEnumerable(prop) : true,
        configurable: true // Sempre true em browsers antigos
      };
      
      // Tentar detectar se é accessor
      if (obj.__lookupGetter__ && obj.__lookupSetter__) {
        const getter = obj.__lookupGetter__(prop);
        const setter = obj.__lookupSetter__(prop);
        
        if (getter || setter) {
          descriptor.get = getter;
          descriptor.set = setter;
        } else {
          descriptor.value = obj[prop];
          descriptor.writable = true; // Assumir true em browsers antigos
        }
      } else {
        // Fallback: data descriptor
        descriptor.value = obj[prop];
        descriptor.writable = true;
      }
      
      return descriptor;
    };
    
    console.log("Polyfill instalado para Object.defineProperty e Object.getOwnPropertyDescriptor");
  }
  
  // Testes do polyfill
  console.log("\n=== Testes do Polyfill ===");
  
  const testObj = {};
  
  // Teste 1: Data property
  Object.defineProperty(testObj, 'dataProp', {
    value: 'test value',
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  console.log("Data property:", testObj.dataProp);
  
  // Teste 2: Accessor property (se suportado)
  try {
    let backingValue = 0;
    Object.defineProperty(testObj, 'accessorProp', {
      get: function() { return backingValue; },
      set: function(val) { backingValue = val * 2; },
      enumerable: true,
      configurable: true
    });
    
    testObj.accessorProp = 5;
    console.log("Accessor property:", testObj.accessorProp); // Should be 10
  } catch (error) {
    console.log("Accessor test error:", error.message);
  }
  
  // Teste 3: getOwnPropertyDescriptor
  const descriptor = Object.getOwnPropertyDescriptor(testObj, 'dataProp');
  console.log("Retrieved descriptor:", descriptor);
  
  // Teste 4: Verificar compatibilidade
  const features = {
    defineProperty: typeof Object.defineProperty === 'function',
    getOwnPropertyDescriptor: typeof Object.getOwnPropertyDescriptor === 'function',
    lookupGetter: typeof testObj.__lookupGetter__ === 'function',
    propertyIsEnumerable: typeof testObj.propertyIsEnumerable === 'function'
  };
  
  console.log("Feature support:", features);
  
  // Restaurar implementação original se necessário
  if (originalDefineProperty && originalDefineProperty !== Object.defineProperty) {
    console.log("Polyfill mode: original not available or replaced");
  }
}

implementDefinePropertyPolyfill();
```

---

## 🎯 Aplicabilidade e Contextos

### Library Design Patterns

```javascript
// Padrões de design de bibliotecas usando Object.defineProperty()

class APILibrary {
  constructor() {
    this._config = {};
    this._modules = new Map();
    this._version = '1.0.0';
    
    this.setupCore();
  }
  
  setupCore() {
    // Versão como propriedade read-only
    Object.defineProperty(this, 'version', {
      value: this._version,
      writable: false,
      enumerable: true,
      configurable: false
    });
    
    // Config como propriedade com validação
    Object.defineProperty(this, 'config', {
      get: () => ({ ...this._config }),
      set: (newConfig) => {
        if (typeof newConfig !== 'object' || newConfig === null) {
          throw new TypeError('Config must be an object');
        }
        
        // Validar configuração
        const validKeys = ['apiUrl', 'timeout', 'retries', 'debug'];
        const invalidKeys = Object.keys(newConfig).filter(key => !validKeys.includes(key));
        
        if (invalidKeys.length > 0) {
          throw new Error(`Invalid config keys: ${invalidKeys.join(', ')}`);
        }
        
        this._config = { ...this._config, ...newConfig };
      },
      enumerable: true,
      configurable: false
    });
    
    // Modules como propriedade computed
    Object.defineProperty(this, 'modules', {
      get: () => Array.from(this._modules.keys()),
      enumerable: true,
      configurable: false
    });
    
    // Debug helper (non-enumerable)
    Object.defineProperty(this, '_debug', {
      value: (...args) => {
        if (this._config.debug) {
          console.log('[API Debug]', ...args);
        }
      },
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  
  // Registrar módulo com proteções
  registerModule(name, moduleFactory) {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('Module name must be a non-empty string');
    }
    
    if (typeof moduleFactory !== 'function') {
      throw new Error('Module factory must be a function');
    }
    
    if (this._modules.has(name)) {
      throw new Error(`Module '${name}' already registered`);
    }
    
    // Criar instância do módulo
    const moduleInstance = moduleFactory(this);
    this._modules.set(name, moduleInstance);
    
    // Definir propriedade para acesso ao módulo
    Object.defineProperty(this, name, {
      value: moduleInstance,
      writable: false,
      enumerable: true,
      configurable: false
    });
    
    this._debug(`Module '${name}' registered`);
    
    return this;
  }
  
  // Método protegido para extensibilidade controlada
  extend(name, extension) {
    if (name in this) {
      throw new Error(`Property '${name}' already exists`);
    }
    
    Object.defineProperty(this, name, {
      value: extension,
      writable: false,
      enumerable: false, // Extensions são hidden por padrão
      configurable: true  // Permite remoção se necessário
    });
    
    return this;
  }
}

// Module factory example
const httpModuleFactory = (api) => {
  const httpModule = {};
  
  // Request method com validação
  Object.defineProperty(httpModule, 'request', {
    value: async (endpoint, options = {}) => {
      api._debug('Making request to:', endpoint);
      
      if (!api._config.apiUrl) {
        throw new Error('API URL not configured');
      }
      
      const url = `${api._config.apiUrl}${endpoint}`;
      const timeout = api._config.timeout || 5000;
      
      // Simular request
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            status: 200, 
            data: { message: `Response from ${endpoint}` },
            url 
          });
        }, 100);
      });
    },
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  // Statistics (computed property)
  let requestCount = 0;
  
  Object.defineProperty(httpModule, 'stats', {
    get: () => ({
      requestCount,
      lastRequest: new Date().toISOString()
    }),
    enumerable: true,
    configurable: false
  });
  
  // Intercept para incrementar contador
  const originalRequest = httpModule.request;
  Object.defineProperty(httpModule, 'request', {
    value: async (...args) => {
      requestCount++;
      return originalRequest(...args);
    },
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  return httpModule;
};

// Demonstração da API Library
function demonstrarAPILibrary() {
  console.log("\n=== Demonstração API Library ===");
  
  const api = new APILibrary();
  
  // Configurar
  api.config = {
    apiUrl: 'https://api.example.com',
    timeout: 3000,
    debug: true
  };
  
  console.log("Version:", api.version);
  console.log("Config:", api.config);
  
  // Tentar modificar version (deve falhar)
  try {
    api.version = '2.0.0';
    console.log("Version modification failed silently:", api.version);
  } catch (error) {
    console.log("Version modification error:", error.message);
  }
  
  // Registrar módulo HTTP
  api.registerModule('http', httpModuleFactory);
  
  console.log("Modules:", api.modules);
  console.log("HTTP module available:", 'http' in api);
  
  // Testar request
  api.http.request('/users').then(response => {
    console.log("Request response:", response);
    console.log("HTTP stats:", api.http.stats);
  });
  
  // Extend com funcionalidade adicional
  api.extend('utils', {
    formatDate: (date) => date.toISOString(),
    generateId: () => Math.random().toString(36).substr(2, 9)
  });
  
  console.log("Utils extension:", typeof api.utils);
  console.log("Generated ID:", api.utils.generateId());
  
  // Verificar propriedades enumeráveis
  console.log("Enumerable properties:", Object.keys(api));
  console.log("All own properties:", Object.getOwnPropertyNames(api));
}

demonstrarAPILibrary();
```

### Encapsulation Patterns

```javascript
// Padrões de encapsulamento usando Object.defineProperty()

class EncapsulatedClass {
  constructor(initialData = {}) {
    // Private store
    const privateStore = new Map();
    
    // Helper para criar propriedades privadas
    const createPrivateProperty = (name, value, options = {}) => {
      privateStore.set(name, value);
      
      const {
        getter = true,
        setter = true,
        validator = () => true,
        transformer = (val) => val
      } = options;
      
      const descriptor = {
        enumerable: false,
        configurable: false
      };
      
      if (getter || setter) {
        if (getter) {
          descriptor.get = function() {
            return privateStore.get(name);
          };
        }
        
        if (setter) {
          descriptor.set = function(newValue) {
            const transformed = transformer(newValue);
            if (!validator(transformed)) {
              throw new Error(`Invalid value for private property '${name}'`);
            }
            privateStore.set(name, transformed);
          };
        }
      } else {
        descriptor.value = value;
        descriptor.writable = false;
      }
      
      Object.defineProperty(this, `_${name}`, descriptor);
    };
    
    // Helper para propriedades públicas controladas
    const createPublicProperty = (name, privateKey, options = {}) => {
      const {
        readOnly = false,
        validator = () => true,
        transformer = (val) => val,
        computed = null
      } = options;
      
      const descriptor = {
        enumerable: true,
        configurable: false
      };
      
      if (computed) {
        descriptor.get = computed.bind(this);
      } else {
        descriptor.get = function() {
          return privateStore.get(privateKey);
        };
        
        if (!readOnly) {
          descriptor.set = function(newValue) {
            const transformed = transformer(newValue);
            if (!validator(transformed)) {
              throw new Error(`Invalid value for '${name}': ${newValue}`);
            }
            
            const oldValue = privateStore.get(privateKey);
            privateStore.set(privateKey, transformed);
            
            // Trigger change event se definido
            if (this._onChange) {
              this._onChange(name, transformed, oldValue);
            }
          };
        }
      }
      
      Object.defineProperty(this, name, descriptor);
    };
    
    // Inicializar propriedades privadas
    createPrivateProperty('id', Math.random().toString(36).substr(2, 9), {
      setter: false // Read-only
    });
    
    createPrivateProperty('created', new Date(), {
      setter: false
    });
    
    createPrivateProperty('data', {}, {
      validator: (val) => typeof val === 'object' && val !== null
    });
    
    createPrivateProperty('listeners', new Map(), {
      setter: false
    });
    
    // Propriedades públicas
    createPublicProperty('id', 'id', { readOnly: true });
    
    createPublicProperty('created', 'created', { readOnly: true });
    
    createPublicProperty('data', 'data', {
      validator: (val) => typeof val === 'object' && val !== null,
      transformer: (val) => ({ ...val }) // Shallow clone
    });
    
    // Propriedade computed
    createPublicProperty('age', null, {
      computed: function() {
        return Math.floor((Date.now() - this._created.getTime()) / 1000);
      },
      readOnly: true
    });
    
    // Método privado para onChange
    Object.defineProperty(this, '_onChange', {
      value: function(property, newValue, oldValue) {
        const listeners = this._listeners.get(property);
        if (listeners) {
          listeners.forEach(callback => {
            try {
              callback(newValue, oldValue, property);
            } catch (error) {
              console.error('Listener error:', error);
            }
          });
        }
      },
      writable: false,
      enumerable: false,
      configurable: false
    });
    
    // Métodos públicos
    this.addEventListener = function(property, callback) {
      if (!this._listeners.has(property)) {
        this._listeners.set(property, new Set());
      }
      this._listeners.get(property).add(callback);
      
      return () => {
        this._listeners.get(property).delete(callback);
      };
    };
    
    this.getPrivateStore = function() {
      // Método para debugging (pode ser removido em produção)
      return new Map(privateStore);
    };
    
    // Inicializar com dados
    if (Object.keys(initialData).length > 0) {
      this.data = initialData;
    }
    
    // Selar objeto para prevenir adição de propriedades
    Object.seal(this);
  }
  
  // Método estático para validar instância
  static isValid(instance) {
    return instance instanceof EncapsulatedClass &&
           typeof instance.id === 'string' &&
           instance.created instanceof Date &&
           typeof instance.data === 'object';
  }
}

// Factory pattern com encapsulation
function createSecureObject(type, config = {}) {
  const secureObj = {};
  
  // Tipo (read-only)
  Object.defineProperty(secureObj, 'type', {
    value: type,
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  // Configuração interna
  const internalConfig = { ...config };
  const accessLog = [];
  
  // Config accessor com logging
  Object.defineProperty(secureObj, 'config', {
    get() {
      accessLog.push({ action: 'read', property: 'config', timestamp: Date.now() });
      return { ...internalConfig };
    },
    set(newConfig) {
      accessLog.push({ action: 'write', property: 'config', timestamp: Date.now() });
      
      if (typeof newConfig !== 'object' || newConfig === null) {
        throw new TypeError('Config must be an object');
      }
      
      Object.assign(internalConfig, newConfig);
    },
    enumerable: true,
    configurable: false
  });
  
  // Access log (read-only)
  Object.defineProperty(secureObj, 'accessLog', {
    get() {
      return [...accessLog]; // Return copy
    },
    enumerable: false,
    configurable: false
  });
  
  // Secure method
  Object.defineProperty(secureObj, 'secureMethod', {
    value: function(action, data) {
      accessLog.push({ action: 'method_call', method: 'secureMethod', args: [action], timestamp: Date.now() });
      
      switch (action) {
        case 'encrypt':
          return btoa(JSON.stringify(data));
        case 'decrypt':
          try {
            return JSON.parse(atob(data));
          } catch {
            throw new Error('Invalid encrypted data');
          }
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    },
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  return secureObj;
}

// Demonstração dos padrões de encapsulation
function demonstrarEncapsulation() {
  console.log("\n=== Demonstração Encapsulation Patterns ===");
  
  // EncapsulatedClass
  console.log("=== EncapsulatedClass ===");
  
  const instance = new EncapsulatedClass({ name: 'Test', value: 42 });
  
  console.log("ID:", instance.id);
  console.log("Created:", instance.created);
  console.log("Data:", instance.data);
  console.log("Age (computed):", instance.age);
  
  // Listener para mudanças
  const unsubscribe = instance.addEventListener('data', (newVal, oldVal) => {
    console.log("Data changed:", { old: oldVal, new: newVal });
  });
  
  // Modificar data
  instance.data = { name: 'Updated', value: 100 };
  
  // Tentar modificar propriedade read-only
  try {
    instance.id = 'new-id';
    console.log("ID modification silently failed:", instance.id);
  } catch (error) {
    console.log("ID modification error:", error.message);
  }
  
  // Verificar propriedades enumeráveis
  console.log("Public properties:", Object.keys(instance));
  console.log("All properties:", Object.getOwnPropertyNames(instance));
  
  // SecureObject
  console.log("\n=== SecureObject ===");
  
  const secure = createSecureObject('api', { endpoint: 'https://api.example.com' });
  
  console.log("Type:", secure.type);
  console.log("Config:", secure.config);
  
  // Modificar config
  secure.config = { timeout: 5000 };
  console.log("Updated config:", secure.config);
  
  // Usar método seguro
  const encrypted = secure.secureMethod('encrypt', { secret: 'data' });
  console.log("Encrypted:", encrypted);
  
  const decrypted = secure.secureMethod('decrypt', encrypted);
  console.log("Decrypted:", decrypted);
  
  // Verificar log de acesso
  console.log("Access log:", secure.accessLog);
  
  unsubscribe();
}

demonstrarEncapsulation();
```

---

## 📚 Conclusão

**`Object.defineProperty()`** é uma **ferramenta fundamental** de metaprogramming que oferece **controle granular** sobre propriedades de objetos, permitindo **encapsulamento**, **validação** e **computed properties** sofisticadas.

**Características distintivas:**
- **Descriptor-based** property definition com controle total
- **Fine-grained attributes** (enumerable, writable, configurable)  
- **Data vs Accessor** descriptors para diferentes semantics
- **Validation logic** através de getters/setters customizados
- **Encapsulation patterns** para privacy e API protection

**Casos de uso estratégicos:**
- **Library design** com APIs controladas e protegidas
- **Property validation** e transformation automática
- **Computed properties** com lazy evaluation
- **Encapsulation patterns** simulando private members
- **Polyfills** para features ES5+ em browsers antigos

É **essencial** para desenvolvimento de **bibliotecas robustas**, **frameworks** e **APIs** que necessitam de **controle fino** sobre propriedades e **comportamentos customizados**.