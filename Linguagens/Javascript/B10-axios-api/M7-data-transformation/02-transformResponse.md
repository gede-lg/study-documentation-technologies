# 🎯 Introdução

A propriedade `transformResponse` do Axios opera como contrapartida simétrica de `transformRequest`, processando dados que chegam do servidor antes de serem entregues ao código da aplicação. Esta capacidade de transformação pós-recebimento resolve um problema arquitetural fundamental: **a impedance mismatch entre formatos de dados do backend e estruturas idiomáticas do frontend**.

Servidores backend frequentemente retornam dados em formatos otimizados para suas próprias tecnologias ou constraints: APIs em Python/Ruby usam snake_case, sistemas legados retornam estruturas XML ou formatos proprietários, e APIs de terceiros podem entregar dados com nomenclaturas inconsistentes ou estruturas profundamente aninhadas. Sem transformação, o código frontend fica poluído com lógica de mapeamento dispersa: cada componente que consome API precisa converter nomes de propriedades, normalizar estruturas, ou parsear formatos especiais.

`transformResponse` centraliza esta responsabilidade em um ponto único de controle, aplicando transformações consistentemente a todas as respostas antes de chegarem ao código de negócio. Esta abordagem promove **separation of concerns**: componentes trabalham com estruturas de dados idiomáticas do JavaScript (camelCase, flat structures), enquanto a camada de transporte (Axios) cuida da conversão de/para formatos wire protocol.

Além de conversão de naming conventions, `transformResponse` habilita casos de uso sofisticados: parsing de formatos não-JSON (XML, CSV), decryption de payloads encriptados, denormalization de estruturas nested, e enriquecimento de dados com computações client-side. Estas operações, quando implementadas como transformers, beneficiam-se de execução automática e composição modular.

A importância de `transformResponse` transcende conveniência sintática. Em aplicações enterprise com múltiplas integrações de APIs, ter um pipeline de transformação robusto e bem testado é diferencial entre código frágil e arquitetura resiliente. Este módulo explora desde fundamentos de transformação de response até patterns avançados, preparando desenvolvedores para implementar pipelines sofisticados que mantêm codebases limpos e escaláveis.

---

# 📋 Sumário

### **Fundamentos de transformResponse**
- Conceito de response transformation
- Posição no lifecycle do Axios
- Relação com parsing automático de JSON
- Casos de uso fundamentais

### **Sintaxe e Configuração**
- Estrutura da função `transformResponse`
- Parâmetros recebidos (data, headers, status)
- Retorno esperado e tipos suportados
- Configuração global, instance, e per-request

### **Transformações Padrão do Axios**
- Default response transformer
- JSON parsing automático
- Handling de JSON malformado
- Preservação ou substituição de defaults

### **Custom Transformers Básicos**
- Case conversion (snake_case → camelCase)
- Data enrichment (computed properties)
- Type coercion (strings → Date objects)
- Null/undefined handling

### **Parsing de Formatos Não-JSON**
- XML parsing com transformers
- CSV/TSV parsing
- Plain text processing
- Formato binário handling

### **Composition e Chaining**
- Pipeline de múltiplos transformers
- Ordem de execução
- Data flow entre transformers
- Composição com default transformers

### **Error Handling em Transformers**
- Tratamento de dados malformados
- Throwing errors vs retornar defaults
- Integration com error interceptors
- Validação de schema

### **Performance e Best Practices**
- Overhead de transformações complexas
- Lazy evaluation patterns
- Memoization de transformações
- Debugging de pipelines

---

# 🧠 Fundamentos

## Conceito de Response Transformation

Response transformation é o processo de modificar dados recebidos do servidor **após a recepção mas antes da entrega ao código da aplicação**. Este processamento intermediário cria uma camada de abstração entre o formato wire protocol (como dados chegam via rede) e o formato de consumo (como aplicação espera receber dados).

A necessidade emerge de diferenças fundamentais entre ecossistemas tecnológicos. Considere um backend Rails (Ruby) que retorna:

```json
{
  "user_id": 123,
  "first_name": "John",
  "created_at": "2023-10-15T14:30:00Z"
}
```

Código JavaScript idiomático espera:

```javascript
{
  userId: 123,
  firstName: "John",
  createdAt: Date // Date object, não string
}
```

Sem `transformResponse`, cada consumidor de API precisa realizar estas conversões:

```javascript
// ❌ Sem transformResponse: conversão manual em todo lugar
axios.get('/api/user').then(response => {
  const user = {
    userId: response.data.user_id,
    firstName: response.data.first_name,
    createdAt: new Date(response.data.created_at)
  };
  setUser(user);
});
```

Com `transformResponse`, conversão acontece automaticamente:

```javascript
// ✅ Com transformResponse: dados já transformados
axios.get('/api/user').then(response => {
  setUser(response.data); // Já em formato correto
});
```

Esta centralização elimina duplicação, reduz surface area para bugs, e facilita mudanças quando formato backend evolui.

## Posição no Lifecycle do Axios

`transformResponse` executa em posição específica no pipeline de processamento de respostas:

1. **Network Reception**: Resposta HTTP chega do servidor
2. **Status Check**: Axios verifica status code (2xx = success, outros = error)
3. **🔹 transformResponse**: Executa, modificando `response.data`
4. **Response Interceptors**: Executam em ordem
5. **Promise Resolution**: `.then()` ou `.catch()` executa no código da aplicação

Posicionar transformResponse **antes de interceptors** significa que:

- Interceptors recebem dados já transformados
- Interceptors podem operar em estruturas idiomáticas (camelCase) sem se preocupar com formato wire
- Erros lançados em `transformResponse` são tratados como response errors

Esta ordenação permite separação clara: `transformResponse` cuida de formato de dados, interceptors cuidam de lógica cross-cutting (logging, auth refresh, etc.).

## Relação com Parsing Automático de JSON

Axios, por padrão, parseia automaticamente respostas JSON. O default `transformResponse` implementa este parsing:

```javascript
// Simplificação do código real do Axios
axios.defaults.transformResponse = [
  function(data) {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        // Se parsing falhar, retorna string original
        return data;
      }
    }
    return data;
  }
];
```

**Implicações importantes**:

1. **Resposta é string bruta**: Quando `transformResponse` executa, `data` é ainda string (response body bruto)
2. **Parsing é responsabilidade do transformer**: Default transformer faz `JSON.parse()`, mas custom transformers precisam lidar com isto
3. **Substituir default quebra JSON parsing**: Se você define custom `transformResponse` sem incluir defaults, JSON parsing automático para de funcionar

**Exemplo do problema**:
```javascript
// ❌ PROBLEMA: perde JSON parsing
axios.defaults.transformResponse = [
  (data) => convertToCamelCase(data) // Assume que data é objeto, mas é string!
];

axios.get('/api/user').then(response => {
  console.log(response.data); // String JSON, não objeto!
});
```

**Solução**: Sempre preservar default transformer ou fazer parsing manualmente:
```javascript
axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse, // Preserva JSON parsing
  (data) => convertToCamelCase(data)
];
```

## Casos de Uso Fundamentais

**Naming Convention Conversion**: Backend usa snake_case, frontend usa camelCase:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => convertToCamelCase(data)
]
```

**Date String Parsing**: Converter strings ISO para Date objects:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    if (data.createdAt && typeof data.createdAt === 'string') {
      data.createdAt = new Date(data.createdAt);
    }
    return data;
  }
]
```

**Data Enrichment**: Adicionar computed properties:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    if (data.firstName && data.lastName) {
      data.fullName = `${data.firstName} ${data.lastName}`;
    }
    return data;
  }
]
```

**Null Coalescing**: Substituir valores null por defaults:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    return {
      name: data.name ?? 'Unknown',
      age: data.age ?? 0,
      active: data.active ?? false
    };
  }
]
```

---

# 🔍 Análise

## Estrutura da Função transformResponse

`transformResponse` aceita array de funções ou função única. Cada função recebe parâmetros com informações sobre a resposta:

```javascript
function myResponseTransformer(data, headers, status) {
  // data: response body (string bruta ou objeto se parseado)
  // headers: response headers (objeto)
  // status: HTTP status code (número)
  
  const transformed = processData(data);
  return transformed;
}
```

**Parâmetro `data`**: 
- **Antes de JSON parsing**: String bruta do response body
- **Após default transformer**: Objeto JavaScript (se response era JSON válido)
- Tipo varia conforme posição no pipeline de transformers

**Parâmetro `headers`**:
Objeto contendo response headers. Útil para transformações condicionais:
```javascript
transformResponse: [
  (data, headers) => {
    // Transformação diferente baseada em Content-Type
    if (headers['content-type']?.includes('application/xml')) {
      return parseXML(data);
    }
    return JSON.parse(data);
  }
]
```

**Parâmetro `status`**:
HTTP status code. Permite transformações baseadas em status:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data, headers, status) => {
    if (status === 206) { // Partial Content
      return { partial: true, data };
    }
    return data;
  }
]
```

**Retorno**: Transformer retorna dados transformados. Tipo do retorno é o que `response.data` conterá.

## Configuração em Múltiplos Níveis

Como `transformRequest`, `transformResponse` pode ser configurado em três níveis:

**1. Global Defaults**:
```javascript
axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse,
  (data) => convertToCamelCase(data)
];
// Aplica a TODAS as respostas de todas as instâncias
```

**2. Instance Defaults**:
```javascript
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  transformResponse: [
    ...axios.defaults.transformResponse,
    (data) => enrichData(data)
  ]
});
// Aplica apenas a respostas desta instância
```

**3. Per-Request**:
```javascript
axios.get('/users', {
  transformResponse: [
    ...axios.defaults.transformResponse,
    (data) => normalizeUsers(data)
  ]
});
// Aplica apenas a esta requisição
```

**Precedência**: Per-request > Instance > Global. Configuração mais específica **substitui** (não mescla) anteriores.

## Default Response Transformer

O transformer padrão do Axios é simples mas crucial:

```javascript
// Código real do Axios (simplificado)
function defaultTransformResponse(data) {
  const transitional = this.transitional || {};
  const silentJSONParsing = transitional.silentJSONParsing;
  const forcedJSONParsing = transitional.forcedJSONParsing;
  
  if (typeof data === 'string') {
    if (forcedJSONParsing || (silentJSONParsing && data.trim())) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (!silentJSONParsing) {
          throw e; // Propaga erro de parsing
        }
      }
    }
  }
  
  return data;
}
```

**Comportamento**:
1. Verifica se `data` é string
2. Tenta fazer `JSON.parse()`
3. Se parsing falhar:
   - Com `silentJSONParsing: true` (padrão): retorna string original
   - Com `silentJSONParsing: false`: lança erro

**Opções Transitional**:
```javascript
axios.get('/api/data', {
  transitional: {
    silentJSONParsing: false, // Falhar se JSON inválido
    forcedJSONParsing: true   // Sempre tentar parsear, mesmo se vazio
  }
});
```

## Custom Transformers com Preservação de Defaults

Pattern mais comum é adicionar transformações **após** defaults:

```javascript
axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse, // JSON parsing
  (data) => {
    // Data já é objeto parseado aqui
    if (Array.isArray(data)) {
      return data.map(item => ({
        ...item,
        id: String(item.id) // Converte IDs para string
      }));
    }
    return data;
  }
];
```

Para executar transformação **antes** de JSON parsing:

```javascript
axios.defaults.transformResponse = [
  (data) => {
    // Data é ainda string bruta
    if (typeof data === 'string' && data.startsWith('<xml>')) {
      return parseXML(data); // Parser XML customizado
    }
    return data;
  },
  ...axios.defaults.transformResponse // JSON parsing executa depois
];
```

## Parsing de Formatos Não-JSON

**XML Parsing**:
```javascript
import { XMLParser } from 'fast-xml-parser';

const xmlTransformer = (data, headers) => {
  if (headers['content-type']?.includes('xml')) {
    const parser = new XMLParser();
    return parser.parse(data);
  }
  return data;
};

axios.get('/api/xml-data', {
  transformResponse: [xmlTransformer]
});
```

**CSV Parsing**:
```javascript
import Papa from 'papaparse';

const csvTransformer = (data, headers) => {
  if (headers['content-type']?.includes('csv')) {
    const result = Papa.parse(data, { header: true });
    return result.data;
  }
  return data;
};

axios.get('/api/export.csv', {
  transformResponse: [csvTransformer]
});
```

**Plain Text Processing**:
```javascript
transformResponse: [
  (data, headers) => {
    if (headers['content-type']?.includes('text/plain')) {
      return {
        text: data,
        lineCount: data.split('\n').length,
        wordCount: data.split(/\s+/).length
      };
    }
    return data;
  }
]
```

## Composition e Chaining

Múltiplos transformers formam pipeline sequencial:

```javascript
transformResponse: [
  // 1. JSON parsing (default)
  ...axios.defaults.transformResponse,
  
  // 2. Convert dates
  (data) => {
    if (data.createdAt) {
      data.createdAt = new Date(data.createdAt);
    }
    return data;
  },
  
  // 3. Convert to camelCase
  (data) => convertToCamelCase(data),
  
  // 4. Add computed properties
  (data) => {
    if (data.firstName && data.lastName) {
      data.fullName = `${data.firstName} ${data.lastName}`;
    }
    return data;
  }
]
```

**Data Flow**:
```
Raw Response: '{"first_name":"John","created_at":"2023-01-01T00:00:00Z"}'
  ↓ Transformer 1 (JSON parse)
{ first_name: "John", created_at: "2023-01-01T00:00:00Z" }
  ↓ Transformer 2 (convert dates)
{ first_name: "John", created_at: Date(2023-01-01) }
  ↓ Transformer 3 (camelCase)
{ firstName: "John", createdAt: Date(2023-01-01) }
  ↓ Transformer 4 (computed properties)
{ firstName: "John", createdAt: Date(2023-01-01), fullName: "John Doe" }
  ↓ Entrega para aplicação
response.data
```

Cada transformer recebe output do anterior, permitindo composição modular.

## Error Handling em Transformers

Transformers devem lidar com dados malformados ou inesperados:

**Defensive Transformation**:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    // Garantir que data tem estrutura esperada
    if (!data || typeof data !== 'object') {
      console.warn('Unexpected response format:', data);
      return { error: 'Invalid response format' };
    }
    
    // Transformação segura
    return {
      id: data.id ?? null,
      name: data.name ?? 'Unknown',
      items: Array.isArray(data.items) ? data.items : []
    };
  }
]
```

**Throwing Errors**:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    // Validação estrita
    if (!data.id) {
      throw new Error('Response missing required field: id');
    }
    
    if (typeof data.age !== 'number') {
      throw new Error('Invalid age type');
    }
    
    return data;
  }
]
```

Erros lançados em `transformResponse` são capturados em `.catch()`:
```javascript
axios.get('/api/data')
  .then(response => {
    // Só executa se transformers não lançaram erro
    console.log(response.data);
  })
  .catch(error => {
    console.error(error.message); // "Response missing required field: id"
  });
```

**Integration com Error Interceptors**:
Response interceptors executam **após** `transformResponse`, podendo capturar erros de transformação:

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.message.includes('Response missing')) {
      // Erro vem de transformer
      console.error('Data validation failed:', error);
    }
    throw error;
  }
);
```

## Schema Validation

Para validação robusta, integrar bibliotecas como Zod ou Yup:

**Com Zod**:
```javascript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().transform(str => new Date(str))
});

transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    try {
      return UserSchema.parse(data);
    } catch (error) {
      console.error('Validation failed:', error);
      throw new Error('Invalid response schema');
    }
  }
]
```

**Com Yup**:
```javascript
import * as yup from 'yup';

const schema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  age: yup.number().min(0).max(150)
});

transformResponse: [
  ...axios.defaults.transformResponse,
  async (data) => {
    return await schema.validate(data);
  }
]
```

**Atenção**: Yup usa validação assíncrona, mas `transformResponse` deve ser síncrono. Se schema validation precisa ser async, fazer antes de usar response:

```javascript
const response = await axios.get('/api/user');
const validated = await schema.validate(response.data);
```

## Performance Considerations

**Evitar Deep Cloning Desnecessário**:
```javascript
// ❌ Lento para objetos grandes
transformResponse: [
  (data) => JSON.parse(JSON.stringify(data)) // Deep clone
]

// ✅ Usar shallow copy quando possível
transformResponse: [
  (data) => ({ ...data, processed: true })
]
```

**Lazy Evaluation para Propriedades Computadas**:
```javascript
// ❌ Computa mesmo se não usado
transformResponse: [
  (data) => ({
    ...data,
    expensiveComputation: heavyCalculation(data)
  })
]

// ✅ Usar getter para lazy evaluation
transformResponse: [
  (data) => {
    Object.defineProperty(data, 'expensiveComputation', {
      get() {
        return heavyCalculation(this);
      }
    });
    return data;
  }
]
```

**Memoization para Transformações Repetidas**:
```javascript
const memoizedTransform = memoize((data) => {
  return expensiveTransformation(data);
});

transformResponse: [
  ...axios.defaults.transformResponse,
  memoizedTransform
]
```

**Medindo Performance**:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    const start = performance.now();
    const result = complexTransform(data);
    const duration = performance.now() - start;
    
    if (duration > 20) { // > 20ms
      console.warn(`Slow transformer: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
]
```

## Debugging de Response Transformers

**Logging Intermediário**:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    console.log('After JSON parse:', data);
    return data;
  },
  (data) => {
    const result = convertToCamelCase(data);
    console.log('After camelCase:', result);
    return result;
  }
]
```

**Debug Transformer Reutilizável**:
```javascript
function debugTransformer(label) {
  return (data) => {
    console.group(label);
    console.log('Type:', typeof data);
    console.log('Data:', data);
    console.groupEnd();
    return data;
  };
}

transformResponse: [
  debugTransformer('Raw Response'),
  ...axios.defaults.transformResponse,
  debugTransformer('After JSON Parse'),
  convertToCamelCase,
  debugTransformer('After CamelCase')
]
```

**Conditional Debugging**:
```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    if (process.env.NODE_ENV === 'development') {
      console.table(Array.isArray(data) ? data : [data]);
    }
    return transformData(data);
  }
]
```

---

# 🎯 Aplicabilidade

## Cenários Ideais

**APIs com Múltiplas Naming Conventions**: Quando integrar com várias APIs (uma snake_case, outra kebab-case), transformers permitem normalizar tudo para camelCase internamente.

**Legacy System Integration**: Sistemas legados retornam formatos peculiares (XML, CSV, formatos proprietários). Transformers convertem para JSON/objetos modernos.

**Data Denormalization**: API retorna estruturas nested complexas, mas UI precisa de estrutura flat. Transformer aplaina automaticamente.

**Type Coercion**: APIs que retornam "true"/"false" como strings, ou números como strings. Transformer converte para tipos corretos.

**Computed Properties**: Adicionar campos derivados que não existem no response (fullName de firstName+lastName, age de birthDate).

## Quando Evitar

**Transformações Específicas a Componentes**: Se transformação só se aplica a um componente específico, fazer no componente em vez de transformer global.

**Transformações Assíncronas**: `transformResponse` deve ser síncrono. Operações async (fetch adicional, async validation) devem ser feitas depois.

**Business Logic Complexa**: Transformers devem ser puramente técnicos. Lógica de negócio complexa pertence a camadas superiores.

## Combinação com Interceptors

**Pattern Recomendado**:
```javascript
// Transformer: converte formato de dados
axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse,
  (data) => convertToCamelCase(data)
];

// Interceptor: lida com lógica cross-cutting
axios.interceptors.response.use(
  response => {
    // Log ou analytics
    trackAPICall(response.config.url);
    return response;
  },
  error => {
    // Error handling global
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    throw error;
  }
);
```

Separação clara: transformers = formato de dados, interceptors = lógica cross-cutting.

---

# ⚠️ Limitações

## Sincronidade Obrigatória

Como `transformRequest`, `transformResponse` **deve** ser síncrono:

```javascript
// ❌ NÃO FUNCIONA
transformResponse: [
  async (data) => {
    const enriched = await fetchRelatedData(data.id);
    return { ...data, related: enriched };
  }
]
```

**Workaround**: Fazer enriquecimento assíncrono após receber response:
```javascript
const response = await axios.get('/api/user');
const relatedData = await fetchRelatedData(response.data.id);
const enriched = { ...response.data, related: relatedData };
```

## Substituição Total de Defaults

Definir `transformResponse` substitui defaults, incluindo JSON parsing:

```javascript
// ❌ PROBLEMA: perde JSON parsing
axios.defaults.transformResponse = [
  (data) => convertToCamelCase(data)
];
// data ainda é string JSON!
```

**Solução**: Sempre incluir defaults:
```javascript
axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse,
  (data) => convertToCamelCase(data)
];
```

## Erros Silenciosos com silentJSONParsing

Por padrão, Axios silencia erros de JSON parsing:

```javascript
// Response: "{invalid json}"
axios.get('/api/data').then(response => {
  console.log(response.data); // String "{invalid json}", não erro!
});
```

Para falhar em JSON inválido:
```javascript
axios.get('/api/data', {
  transitional: { silentJSONParsing: false }
});
```

## Performance em Large Payloads

Transformações em responses muito grandes (MBs de dados) podem causar UI freeze. Considerar web workers para processamento pesado:

```javascript
// Exemplo conceitual (requer setup de web worker)
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => {
    if (JSON.stringify(data).length > 1000000) {
      // Delegar para web worker
      return processInWorker(data);
    }
    return processInMainThread(data);
  }
]
```

## Debugging Complexo

Com múltiplos transformers, rastrear onde transformação falha é desafiador. Usar debug transformers e logging extensivo.

---

# 🔗 Interconexões

## Simetria com transformRequest

`transformRequest` e `transformResponse` formam pipeline bidirecional:

```javascript
// Request: camelCase → snake_case
transformRequest: [
  ...axios.defaults.transformRequest,
  (data) => toSnakeCase(data)
],

// Response: snake_case → camelCase
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => toCamelCase(data)
]
```

Aplicação usa camelCase everywhere, conversão só nas bordas (network boundary).

## Ordem com Response Interceptors

Ordem de execução:
1. **transformResponse** (opera em raw data)
2. Response Interceptors (operam em response completo)

Isto significa transformers preparam dados para interceptors:

```javascript
transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => toCamelCase(data) // Converte para camelCase
],

axios.interceptors.response.use(response => {
  // response.data já está em camelCase aqui
  console.log(response.data.firstName); // Não first_name
  return response;
});
```

## Relação com Serialization

Axios deserializa automaticamente JSON em `transformResponse` default. Custom transformers podem implementar deserialization customizada:

```javascript
transformResponse: [
  (data) => {
    // Custom deserialization (ex: BSON, MessagePack)
    return customDeserialize(data);
  }
]
```

## Integration com Type Systems (TypeScript)

TypeScript pode tipar responses transformados:

```typescript
interface User {
  userId: number;
  firstName: string;
  createdAt: Date;
}

const response = await axios.get<User>('/api/user', {
  transformResponse: [
    ...axios.defaults.transformResponse,
    (data): User => ({
      userId: data.user_id,
      firstName: data.first_name,
      createdAt: new Date(data.created_at)
    })
  ]
});

// response.data tem tipo User
console.log(response.data.firstName);
```

---

# 🚀 Evolução

## De Manual Parsing para Transformers Automáticos

**Era Antiga**: Parsing manual em cada call site:
```javascript
axios.get('/api/user').then(response => {
  const data = JSON.parse(response.data); // Manual
  const user = {
    userId: data.user_id,
    firstName: data.first_name
  };
});
```

**Era Moderna**: Transformers automáticos:
```javascript
axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse,
  (data) => toCamelCase(data)
];

axios.get('/api/user').then(response => {
  console.log(response.data.firstName); // Já transformado
});
```

## Bibliotecas Especializadas

Comunidade criou bibliotecas para transformações comuns:

**humps**: camelCase/snake_case conversion:
```javascript
import { camelizeKeys } from 'humps';

transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => camelizeKeys(data)
]
```

**class-transformer**: Converte plain objects para class instances:
```javascript
import { plainToClass } from 'class-transformer';

transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => plainToClass(UserClass, data)
]
```

## Integração com React Query / SWR

Ferramentas modernas abstraem transformação:

```javascript
// React Query
const { data } = useQuery('user', async () => {
  const response = await axios.get('/api/user');
  return toCamelCase(response.data); // Transformação na query
});
```

Transformação move-se para query layer em vez de Axios layer.

## Trend: Runtime Type Validation

Crescimento de runtime validation (Zod, io-ts) integra-se com transformers:

```javascript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
}).transform(data => ({
  userId: data.id,
  userName: data.name
}));

transformResponse: [
  ...axios.defaults.transformResponse,
  (data) => UserSchema.parse(data) // Valida E transforma
]
```

## Possível Futuro: Async Transformers

Proposta para suportar async transformers:

```javascript
// Hipotético
transformResponse: [
  ...axios.defaults.transformResponse,
  async (data) => {
    const enriched = await enrichData(data);
    return enriched;
  }
]
```

Requereria mudanças arquiteturais no Axios.

## Streaming Responses

Com growth de streaming APIs (Server-Sent Events, chunked responses), transformers podem evoluir para processar chunks:

```javascript
// Conceitual
transformResponse: [
  {
    stream: true,
    transform: (chunk) => processChunk(chunk)
  }
]
```

---

**Conclusão Integrada**: `transformResponse` é espinha dorsal da integridade de dados em aplicações frontend modernas. Permite que código mantenha estruturas idiomáticas enquanto consome APIs heterogêneas. Combinado com `transformRequest`, forma pipeline completo que isola código de negócio de detalhes de wire protocol. Dominar composition, error handling, e performance optimization de transformers é essencial para arquiteturas robustas e maintainable.