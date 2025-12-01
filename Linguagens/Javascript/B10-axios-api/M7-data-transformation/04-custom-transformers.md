# 🎯 Introdução

Custom transformers representam a culminação da arquitetura de transformação de dados do Axios, oferecendo controle granular sobre como dados fluem através do pipeline HTTP request/response. Enquanto os transformers padrão do Axios lidam competentemente com casos comuns (serialização JSON, parsing automático), aplicações reais enfrentam cenários que ultrapassam estas capacidades: integração com APIs legadas que esperam formatos exóticos, manipulação de tipos JavaScript não-JSON (Date, BigInt, Map), implementação de encryption/compression client-side, ou conformidade com padrões corporativos específicos de estruturação de dados.

Custom transformers resolvem estes desafios ao permitir que desenvolvedores injetem lógica arbitrária nos pontos estratégicos do ciclo de vida de requisições. Um transformer pode interceptar dados antes de serem serializados e enviados ao servidor (`transformRequest`), ou processar dados recebidos antes de serem entregues ao código da aplicação (`transformResponse`). Esta capacidade de intervenção em momentos críticos transforma o Axios de biblioteca HTTP simples em framework extensível para comunicação de dados.

A arquitetura de transformers do Axios é fundamentalmente composicional: transformers são funções puras que recebem dados e retornam dados transformados, podendo ser encadeadas em pipelines arbitrariamente complexos. Esta composicionalidade permite que desenvolvedores construam transformações sofisticadas a partir de blocos simples e reutilizáveis, cada um com responsabilidade única e bem definida. Um pipeline pode incluir dezenas de transformers especializados - cada um focado em uma tarefa específica como conversão de naming conventions, type coercion, validação, ou enriquecimento de dados.

Além de flexibilidade técnica, custom transformers promovem clean architecture ao separar responsabilidades: lógica de transformação de dados vive em funções dedicadas e testáveis, isolada de lógica de negócio e componentes UI. Esta separação facilita testes unitários (transformers são funções puras), manutenção (mudanças em formato de dados afetam apenas transformers), e reutilização (transformers podem ser compartilhados entre projetos).

Este módulo explora a arte e ciência de implementar custom transformers, desde patterns básicos até arquiteturas avançadas, equipando desenvolvedores com conhecimento para criar pipelines de transformação robustos, performáticos, e maintainable que elevam a qualidade de aplicações enterprise.

---

# 📋 Sumário

### **Fundamentos de Custom Transformers**
- Anatomia de um transformer
- Signature e contratos de transformers
- Diferença entre request e response transformers
- Composição vs herança em transformers

### **Patterns Básicos de Transformers**
- Naming convention converters (camelCase ↔ snake_case)
- Null/undefined handlers
- Type coercion transformers
- Data enrichment transformers

### **Composition e Chaining**
- Pipeline patterns
- Ordem de execução
- Preservação de default transformers
- Conditional transformation

### **Transformers Bidirecionais**
- Symmetrical request/response transformers
- Invertible transformations
- Maintaining data integrity through round-trips
- Testing bidirectional transformers

### **Advanced Patterns**
- Stateful transformers
- Context-aware transformations
- Schema-based transformers
- Generic transformers com TypeScript

### **Error Handling e Validation**
- Error propagation em pipelines
- Validation transformers
- Fallback strategies
- Debug transformers

### **Performance Optimization**
- Memoization de transformações
- Lazy evaluation patterns
- Avoiding deep cloning
- Benchmarking transformers

### **Best Practices e Architecture**
- Organizing transformers em projetos
- Naming conventions
- Testing strategies
- Documentation patterns

---

# 🧠 Fundamentos

## Anatomia de um Transformer

Um transformer é essencialmente uma função pura que recebe dados em um formato e retorna dados em outro formato. A signature básica é:

```javascript
function transformer(data, headers, status) {
  // data: corpo da requisição ou resposta
  // headers: headers HTTP (opcional)
  // status: status code (apenas em transformResponse)
  
  const transformed = processData(data);
  return transformed;
}
```

**Características de um bom transformer**:

1. **Puro**: Não causa side effects, sempre retorna mesmo output para mesmo input
2. **Síncrono**: Não retorna Promises (Axios requer transformers síncronos)
3. **Type-Safe**: Lida gracefully com tipos inesperados de input
4. **Composable**: Pode ser combinado com outros transformers
5. **Single Responsibility**: Faz uma coisa bem feita

**Exemplo mínimo**:
```javascript
// Transformer que adiciona timestamp
function addTimestamp(data) {
  if (typeof data !== 'object' || data === null) {
    return data; // Não transforma tipos primitivos
  }
  
  return {
    ...data,
    timestamp: new Date().toISOString()
  };
}

// Uso
axios.post('/api/event', eventData, {
  transformRequest: [
    ...axios.defaults.transformRequest,
    addTimestamp
  ]
});
```

## Signature e Contratos

**transformRequest Signature**:
```javascript
function(data: any, headers: AxiosRequestHeaders): any
```

- `data`: O que foi passado para `axios.post()`, `axios.put()`, etc.
- `headers`: Objeto de headers da requisição (mutável)
- Retorno: Dados transformados ou string serializada

**transformResponse Signature**:
```javascript
function(data: any, headers?: RawAxiosResponseHeaders, status?: number): any
```

- `data`: Response body (string bruta antes de JSON parsing, ou objeto após)
- `headers`: Response headers (opcional)
- `status`: HTTP status code (opcional)
- Retorno: Dados transformados

**Contrato Implícito**:
- Transformers **devem** retornar valor (não `undefined` a menos que intencional)
- Não devem lançar exceções em condições normais (tratar tipos inesperados gracefully)
- Modificações em `headers` são permitidas mas devem ser conservadoras

## Diferença Entre Request e Response Transformers

**Request Transformers**:
- Operam em dados **saindo** para o servidor
- Executam **antes** de serialização (a menos que retornem string)
- Podem modificar estrutura para atender expectativas da API
- Comumente usados para: naming convention conversion, data sanitization, adding metadata

**Response Transformers**:
- Operam em dados **chegando** do servidor
- Executam **após** recepção mas **antes** de serem entregues ao código
- Primeiro transformer recebe **string bruta** (se incluir defaults, JSON parsing já ocorreu)
- Comumente usados para: parsing de formatos, type coercion, data enrichment, normalization

**Simetria**: Frequentemente, request e response transformers são inversos:

```javascript
// Request: camelCase → snake_case
transformRequest: [(data) => toSnakeCase(data)],

// Response: snake_case → camelCase
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => toCamelCase(data)
]
```

## Composição vs Herança

Transformers favorecem **composição** sobre herança. Em vez de criar hierarquias de classes, combine funções pequenas:

**❌ Anti-pattern: Herança**:
```javascript
class BaseTransformer {
  transform(data) {
    return data;
  }
}

class SnakeCaseTransformer extends BaseTransformer {
  transform(data) {
    return toSnakeCase(super.transform(data));
  }
}

class TimestampTransformer extends SnakeCaseTransformer {
  transform(data) {
    return addTimestamp(super.transform(data));
  }
}
```

**✅ Pattern: Composição**:
```javascript
const toSnakeCase = (data) => /* ... */;
const addTimestamp = (data) => /* ... */;

// Composição via array
transformRequest: [
  ...axios.defaults.transformRequest,
  toSnakeCase,
  addTimestamp
]
```

Composição é mais flexível, testável, e idiomática em JavaScript funcional.

---

# 🔍 Análise

## Naming Convention Converters

Um dos use cases mais comuns: converter entre camelCase (JavaScript) e snake_case (backends em Python/Ruby).

**Implementation Básica**:
```javascript
function toSnakeCase(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => toSnakeCase(item));
  }
  
  const result = {};
  for (const key in data) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = toSnakeCase(data[key]);
  }
  
  return result;
}

function toCamelCase(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => toCamelCase(item));
  }
  
  const result = {};
  for (const key in data) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = toCamelCase(data[key]);
  }
  
  return result;
}
```

**Uso**:
```javascript
axios.defaults.transformRequest = [
  ...axios.defaults.transformRequest,
  toSnakeCase
];

axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse,
  toCamelCase
];

// Agora todo código usa camelCase
axios.post('/api/user', { firstName: 'John', lastName: 'Doe' });
// Request: {"first_name":"John","last_name":"Doe"}

axios.get('/api/user/123').then(response => {
  console.log(response.data.firstName); // "John" (convertido de first_name)
});
```

**Usando Biblioteca (humps)**:
```javascript
import { decamelizeKeys, camelizeKeys } from 'humps';

axios.defaults.transformRequest = [
  ...axios.defaults.transformRequest,
  (data) => decamelizeKeys(data)
];

axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse,
  (data) => camelizeKeys(data)
];
```

## Null/Undefined Handlers

APIs frequentemente têm diferentes tratamentos para `null` e `undefined`. Transformer pode normalizar:

```javascript
function removeNullish(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(removeNullish).filter(item => item !== null && item !== undefined);
  }
  
  const result = {};
  for (const key in data) {
    const value = data[key];
    if (value !== null && value !== undefined) {
      result[key] = removeNullish(value);
    }
  }
  
  return result;
}

// Uso
axios.post('/api/user', {
  name: 'John',
  age: null,      // Será removido
  city: undefined // Será removido
}, {
  transformRequest: [
    removeNullish,
    ...axios.defaults.transformRequest
  ]
});
// Request body: {"name":"John"}
```

**Variação: Converter null para defaults**:
```javascript
function nullToDefault(defaults) {
  return function(data) {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    
    const result = { ...data };
    for (const key in defaults) {
      if (result[key] === null || result[key] === undefined) {
        result[key] = defaults[key];
      }
    }
    
    return result;
  };
}

// Uso
axios.get('/api/user', {
  transformResponse: [
    ...axios.defaults.transformResponse,
    nullToDefault({ age: 0, name: 'Unknown' })
  ]
});
```

## Type Coercion Transformers

Converter tipos para garantir consistência:

```javascript
function coerceTypes(schema) {
  return function(data) {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    
    const result = { ...data };
    
    for (const key in schema) {
      const expectedType = schema[key];
      const value = result[key];
      
      if (value === null || value === undefined) continue;
      
      switch (expectedType) {
        case 'number':
          result[key] = Number(value);
          break;
        case 'string':
          result[key] = String(value);
          break;
        case 'boolean':
          result[key] = value === 'true' || value === true;
          break;
        case 'date':
          result[key] = new Date(value);
          break;
      }
    }
    
    return result;
  };
}

// Uso
axios.get('/api/user', {
  transformResponse: [
    ...axios.defaults.transformResponse,
    coerceTypes({
      id: 'number',
      name: 'string',
      active: 'boolean',
      createdAt: 'date'
    })
  ]
});
```

## Data Enrichment Transformers

Adicionar computed properties ou metadata:

```javascript
function enrichUser(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  return {
    ...data,
    // Computed property
    fullName: data.firstName && data.lastName 
      ? `${data.firstName} ${data.lastName}` 
      : data.name,
    
    // Metadata
    receivedAt: new Date().toISOString(),
    
    // Derived data
    isAdult: data.age && data.age >= 18
  };
}

axios.get('/api/user/123', {
  transformResponse: [
    ...axios.defaults.transformResponse,
    enrichUser
  ]
});
```

## Pipeline Patterns

Combinar múltiplos transformers pequenos:

```javascript
// Biblioteca de transformers reutilizáveis
const transformers = {
  removeNullish: (data) => /* ... */,
  toSnakeCase: (data) => /* ... */,
  toCamelCase: (data) => /* ... */,
  addTimestamp: (data) => /* ... */,
  validateSchema: (schema) => (data) => /* ... */
};

// Criar pipeline customizado
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  
  transformRequest: [
    transformers.removeNullish,
    transformers.toSnakeCase,
    transformers.addTimestamp,
    ...axios.defaults.transformRequest
  ],
  
  transformResponse: [
    ...axios.defaults.transformResponse,
    transformers.toCamelCase,
    transformers.validateSchema({
      id: 'number',
      name: 'string'
    })
  ]
});
```

## Conditional Transformation

Aplicar transformação apenas sob certas condições:

```javascript
function conditionalTransform(condition, transformer) {
  return function(data, headers) {
    if (condition(data, headers)) {
      return transformer(data, headers);
    }
    return data;
  };
}

// Transformar apenas se Content-Type é JSON
axios.get('/api/data', {
  transformResponse: [
    conditionalTransform(
      (data, headers) => headers['content-type']?.includes('json'),
      (data) => toCamelCase(JSON.parse(data))
    )
  ]
});

// Adicionar timestamp apenas em production
axios.defaults.transformRequest = [
  ...axios.defaults.transformRequest,
  conditionalTransform(
    () => process.env.NODE_ENV === 'production',
    addTimestamp
  )
];
```

## Transformers Bidirecionais (Symmetrical)

Request e response transformers frequentemente são inversos. Organizar em pares:

```javascript
const transformerPairs = {
  caseConversion: {
    request: toSnakeCase,
    response: toCamelCase
  },
  
  dateHandling: {
    request: (data) => {
      // Converte Date objects para ISO strings
      return JSON.stringify(data, (key, value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
    },
    response: (data) => {
      // Converte ISO strings para Date objects
      return JSON.parse(data, (key, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
          return new Date(value);
        }
        return value;
      });
    }
  }
};

// Aplicar pares
axios.defaults.transformRequest = [
  transformerPairs.caseConversion.request,
  transformerPairs.dateHandling.request
];

axios.defaults.transformResponse = [
  transformerPairs.dateHandling.response,
  transformerPairs.caseConversion.response
];
```

**Testando Simetria**:
```javascript
describe('Transformer symmetry', () => {
  it('should preserve data through round-trip', () => {
    const original = { firstName: 'John', createdAt: new Date() };
    
    // Simula request transform
    const sent = transformerPairs.caseConversion.request(original);
    
    // Simula response transform
    const received = transformerPairs.caseConversion.response(sent);
    
    expect(received).toEqual(original);
  });
});
```

## Advanced: Stateful Transformers

Embora transformers devam ser preferencialmente stateless, alguns cenários requerem estado:

```javascript
function createRequestCounter() {
  let count = 0;
  
  return function(data) {
    count++;
    return {
      ...data,
      requestId: `req-${count}`,
      timestamp: Date.now()
    };
  };
}

const requestCounter = createRequestCounter();

axios.defaults.transformRequest = [
  ...axios.defaults.transformRequest,
  requestCounter
];

// Cada request tem ID incremental
axios.post('/api/event', { type: 'click' });
// { type: 'click', requestId: 'req-1', timestamp: ... }

axios.post('/api/event', { type: 'view' });
// { type: 'view', requestId: 'req-2', timestamp: ... }
```

**Cuidado**: Estado introduz complexidade e dificulta testes. Usar apenas quando necessário.

## Context-Aware Transformations

Transformers que se adaptam baseado em contexto (headers, URL, etc.):

```javascript
function contextAwareTransform(data, headers) {
  // Transformação diferente baseada em Accept header
  const acceptHeader = headers['Accept'];
  
  if (acceptHeader?.includes('application/hal+json')) {
    // Formato HAL
    return {
      _links: { self: { href: `/users/${data.id}` } },
      ...data
    };
  }
  
  if (acceptHeader?.includes('application/vnd.api+json')) {
    // JSON:API format
    return {
      data: {
        type: 'users',
        id: String(data.id),
        attributes: data
      }
    };
  }
  
  // Default format
  return data;
}

axios.post('/api/user', userData, {
  headers: { 'Accept': 'application/hal+json' },
  transformRequest: [
    ...axios.defaults.transformRequest,
    contextAwareTransform
  ]
});
```

## Schema-Based Transformers

Usar schemas para guiar transformação:

```javascript
import Joi from 'joi';

function schemaBasedTransform(schema) {
  return function(data) {
    const { error, value } = schema.validate(data, {
      stripUnknown: true,  // Remove campos não definidos no schema
      convert: true         // Converte tipos automaticamente
    });
    
    if (error) {
      throw new Error(`Validation failed: ${error.message}`);
    }
    
    return value;
  };
}

const userSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(0).max(150),
  createdAt: Joi.date()
});

axios.get('/api/user/123', {
  transformResponse: [
    ...axios.defaults.transformResponse,
    schemaBasedTransform(userSchema)
  ]
});
```

## Generic Transformers com TypeScript

Criar transformers type-safe:

```typescript
import { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios';

// Generic transformer com types
function createTransformer<TInput, TOutput>(
  transformFn: (data: TInput) => TOutput
): AxiosRequestTransformer {
  return (data: unknown): TOutput => {
    return transformFn(data as TInput);
  };
}

// Uso
interface User {
  firstName: string;
  lastName: string;
}

interface UserDTO {
  first_name: string;
  last_name: string;
}

const userTransformer = createTransformer<User, UserDTO>(
  (user) => ({
    first_name: user.firstName,
    last_name: user.lastName
  })
);

axios.post<UserDTO>('/api/user', userData, {
  transformRequest: [
    userTransformer,
    ...axios.defaults.transformRequest
  ]
});
```

## Error Handling em Transformers

**Throwing Errors**:
```javascript
function strictTransformer(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Expected object, got ' + typeof data);
  }
  
  if (!data.id) {
    throw new Error('Missing required field: id');
  }
  
  return data;
}

axios.post('/api/data', invalidData, {
  transformRequest: [
    strictTransformer,
    ...axios.defaults.transformRequest
  ]
})
  .catch(error => {
    console.error('Transform failed:', error.message);
  });
```

**Fallback Strategy**:
```javascript
function safeTransform(data) {
  try {
    return riskyTransformation(data);
  } catch (error) {
    console.warn('Transform failed, using fallback:', error);
    return data; // Fallback para data original
  }
}
```

## Debug Transformers

Transformer para logging durante development:

```javascript
function debugTransformer(label) {
  return (data, headers) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔍 ${label}`);
      console.log('Data:', data);
      console.log('Type:', typeof data);
      console.log('Headers:', headers);
      console.groupEnd();
    }
    return data;
  };
}

axios.defaults.transformRequest = [
  debugTransformer('Initial Data'),
  toSnakeCase,
  debugTransformer('After Snake Case'),
  addTimestamp,
  debugTransformer('After Timestamp'),
  ...axios.defaults.transformRequest
];
```

## Performance: Memoization

Para transformações caras em dados que mudam raramente:

```javascript
import memoize from 'lodash/memoize';

const expensiveTransform = memoize((data) => {
  // Transformação computacionalmente cara
  return deeplyProcessData(data);
}, (data) => {
  // Custom hash function para cache key
  return JSON.stringify(data);
});

axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse,
  expensiveTransform
];
```

**Cuidado**: Memoization consome memória. Usar apenas para transformações caras em datasets pequenos.

## Performance: Avoiding Deep Cloning

```javascript
// ❌ Lento: deep clone com JSON
function slowTransform(data) {
  return JSON.parse(JSON.stringify(data));
}

// ✅ Rápido: shallow copy quando possível
function fastTransform(data) {
  return { ...data, transformed: true };
}

// ✅ Modificação in-place se data não será reutilizado
function inPlaceTransform(data) {
  data.transformed = true;
  return data;
}
```

---

# 🎯 Aplicabilidade

## Quando Criar Custom Transformers

**APIs com Formatos Específicos**: Quando API espera estrutura que difere do idiomático JavaScript.

**Type Safety**: Garantir tipos corretos após desserialização (strings → Date, etc.).

**Cross-Cutting Concerns**: Adicionar metadata (request IDs, timestamps) a todas as requisições.

**Legacy Integration**: Adaptar código moderno para trabalhar com APIs antigas.

**Compliance**: Adicionar audit trails, sanitization, ou encryption.

## Quando Evitar

**Lógica de Negócio**: Transformers devem ser técnicos. Business logic pertence a camadas superiores.

**Transformações Assíncronas**: Fazer antes/depois de chamar Axios, não em transformers.

**One-Off Transformations**: Se transformação só se aplica a um endpoint, fazer inline.

---

# ⚠️ Limitações

## Sincronidade Obrigatória

Transformers não podem ser `async`. Operações assíncronas devem ser feitas fora do transformer.

## State Introduces Complexity

Stateful transformers dificultam debugging e testes. Preferir stateless quando possível.

## Performance Overhead

Cada transformer adiciona overhead. Pipelines muito longos podem impactar performance.

## Debugging Difícil

Com muitos transformers, rastrear bugs é desafiador. Usar debug transformers e logging.

---

# 🔗 Interconexões

## Relação com Interceptors

Transformers = transformação de **dados**. Interceptors = lógica **cross-cutting** (auth, logging).

## Integration com Validation Libraries

Zod, Joi, Yup integram-se bem com transformers para validation + transformation.

## TypeScript Type Safety

Transformers podem ser tipados para garantir type safety em todo pipeline.

---

# 🚀 Evolução

## De Callbacks para Pipelines Composable

**Era Antiga**: Transformação inline, dispersa:
```javascript
axios.post('/api/user', toSnakeCase(addTimestamp(data)));
```

**Era Moderna**: Pipeline declarativo:
```javascript
transformRequest: [toSnakeCase, addTimestamp]
```

## Bibliotecas Especializadas

Crescimento de bibliotecas focadas em transformação (humps, class-transformer).

## Integração com Runtime Validation

Zod, io-ts combinam validation + transformation em uma step.

## Trend: Code Generation

Ferramentas geram transformers automaticamente de schemas (OpenAPI, GraphQL).

---

**Conclusão Integrada**: Custom transformers são ferramenta mais poderosa do Axios para adaptar comunicação HTTP a necessidades específicas. Através de composição de funções puras, desenvolvedores constroem pipelines sofisticados que mantêm código limpo, testável, e resiliente. Dominar patterns de transformers - desde básicos como case conversion até avançados como schema-based validation - é essencial para arquiteturas frontend enterprise-grade.