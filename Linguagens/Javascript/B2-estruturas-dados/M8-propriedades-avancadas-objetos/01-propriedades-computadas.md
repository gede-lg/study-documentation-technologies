# Propriedades Computadas em JavaScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Propriedades computadas** (computed property names) são nomes de propriedades determinados **dinamicamente** em tempo de execução através de **expressões** avaliadas entre colchetes `[ ]`. Conceitualmente, permitem que o **nome** da propriedade seja o **resultado de uma computação**, não apenas um identificador literal fixo.

Sintaxe:
```javascript
const objeto = {
  [expressao]: valor
};
```

Na essência, propriedades computadas transformam objetos de estruturas **estáticas** (chaves fixas em tempo de código) em estruturas **dinâmicas** (chaves determinadas em tempo de execução).

```javascript
// ❌ Propriedade estática (nome fixo)
const obj1 = {
  nome: 'Ana'
};

// ✅ Propriedade computada (nome dinâmico)
const chave = 'nome';
const obj2 = {
  [chave]: 'Ana' // Avalia chave → 'nome'
};

console.log(obj2.nome); // 'Ana'
```

**Diferença fundamental:**
- **Propriedade normal**: Nome é literal (`nome: valor`)
- **Propriedade computada**: Nome é expressão (`[expressao]: valor`)

### Contexto Histórico

Propriedades computadas foram introduzidas no **ECMAScript 6 (2015)** como parte da modernização de objetos literais.

**Evolução:**
- **Pre-ES6**: Apenas nomes literais em object literals
  ```javascript
  const obj = {};
  const chave = 'prop';
  obj[chave] = 'valor'; // Computação fora do literal
  ```

- **ES6 (2015)**: Computed property names em object literals
  ```javascript
  const chave = 'prop';
  const obj = {
    [chave]: 'valor' // Computação dentro do literal
  };
  ```

- **Moderno**: Amplamente usado com Symbols, template literals, e lógica dinâmica

**Filosofia:** ES6 buscou tornar object literals **mais expressivos** e **poderosos**, permitindo que toda flexibilidade de bracket notation estivesse disponível na sintaxe literal.

### Problema Fundamental que Resolve

1. **Nomes Dinâmicos**: Criar propriedades com nomes não conhecidos em tempo de código
2. **Expressões como Chaves**: Usar resultado de cálculos como nomes
3. **Symbols**: Usar Symbols como chaves diretamente em literals
4. **Template Literals**: Interpolar valores em nomes de propriedades
5. **Código Mais Limpo**: Evitar atribuições pós-criação
6. **Metaprogramação**: Gerar objetos dinamicamente baseado em dados

**Exemplo do problema:**

```javascript
// ❌ Pre-ES6: Verboso, atribuição separada
const campo = 'email';
const usuario = {
  nome: 'Bruno'
};
usuario[campo] = 'bruno@email.com';

// ✅ ES6: Conciso, tudo no literal
const usuarioES6 = {
  nome: 'Bruno',
  [campo]: 'bruno@email.com'
};
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Avaliação em Runtime**: Expressão computada quando objeto é criado
2. **Sintaxe [ ]**: Colchetes delimitam expressão computada
3. **Qualquer Expressão**: Variáveis, operações, chamadas de função, etc.
4. **Coerção para String**: Resultado convertido em string (ou Symbol)
5. **Object Literal Enhancement**: Parte das melhorias ES6 em objetos

### Pilares Fundamentais

- **Sintaxe**: `{ [expressao]: valor }`
- **Avaliação**: Expressão avaliada no momento da criação do objeto
- **Tipos Válidos**: Qualquer expressão JavaScript válida
- **Resultado**: Convertido para string (ou Symbol mantido)
- **Múltiplas**: Várias propriedades computadas no mesmo objeto

### Visão Geral das Nuances

- **Template Literals**: Interpolação em nomes de propriedades
- **Symbols**: Propriedades únicas não enumeráveis
- **Operações**: Concatenação, cálculos aritméticos
- **Funções**: Chamar funções para obter nome
- **Combinação**: Com shorthand properties e method definitions

---

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

```javascript
const prefixo = 'user';
const sufixo = 'Name';

const obj = {
  // Expressão simples: variável
  [prefixo]: 'dados do usuário',

  // Expressão: concatenação
  [prefixo + sufixo]: 'Carlos',

  // Expressão: template literal
  [`${prefixo}Email`]: 'carlos@email.com',

  // Expressão: operação aritmética
  [1 + 2]: 'três',

  // Expressão: chamada de função
  [getNomePropriedade()]: 'valor'
};

function getNomePropriedade() {
  return 'dinamica';
}

console.log(obj);
// {
//   user: 'dados do usuário',
//   userName: 'Carlos',
//   userEmail: 'carlos@email.com',
//   3: 'três',
//   dinamica: 'valor'
// }
```

**Conceito:** A expressão entre `[ ]` é **avaliada** e seu resultado se torna o nome da propriedade.

### Com Variáveis

```javascript
const chave1 = 'nome';
const chave2 = 'idade';
const chave3 = 'email';

const pessoa = {
  [chave1]: 'Diana',
  [chave2]: 28,
  [chave3]: 'diana@email.com'
};

console.log(pessoa.nome);  // 'Diana'
console.log(pessoa.idade); // 28
console.log(pessoa.email); // 'diana@email.com'
```

### Com Template Literals

```javascript
const tipo = 'produto';
const id = 123;

const item = {
  [`${tipo}Id`]: id,
  [`${tipo}Nome`]: 'Notebook',
  [`${tipo}Preco`]: 3000,
  [`obter${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`]() {
    return this[`${tipo}Nome`];
  }
};

console.log(item.produtoId);    // 123
console.log(item.produtoNome);  // 'Notebook'
console.log(item.obterProduto()); // 'Notebook'
```

**Conceito:** Template literals permitem **interpolação** complexa em nomes de propriedades.

### Com Symbols

```javascript
// Symbols são ideais para propriedades computadas
const simboloUnico = Symbol('id');
const simboloNome = Symbol('nome');

const obj = {
  // Propriedades computadas com Symbols
  [simboloUnico]: 12345,
  [simboloNome]: 'Eduardo',

  // Propriedades normais
  tipo: 'usuario'
};

console.log(obj[simboloUnico]); // 12345
console.log(obj[simboloNome]);  // 'Eduardo'

// Symbols não aparecem em enumerações normais
console.log(Object.keys(obj)); // ['tipo']
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(id), Symbol(nome)]
```

**Conceito:** Symbols são **únicos** e **não enumeráveis**, ideais para metadados internos via propriedades computadas.

### Com Operações

```javascript
const base = 'prop';
const contador = 1;

const obj = {
  // Concatenação
  [base + 'A']: 'valor A',

  // Aritmética
  [contador + 1]: 'segunda propriedade',
  [contador * 10]: 'décima propriedade',

  // Lógica
  [true ? 'ativo' : 'inativo']: true,

  // Expressões complexas
  [base.toUpperCase() + '_' + contador]: 'PROP_1'
};

console.log(obj);
// {
//   2: 'segunda propriedade',
//   10: 'décima propriedade',
//   propA: 'valor A',
//   ativo: true,
//   PROP_1: 'PROP_1'
// }
```

---

## 🔍 Análise Conceitual Profunda

### Criação Dinâmica de Objetos

```javascript
function criarObjeto(campos) {
  const obj = {};

  campos.forEach(campo => {
    obj[`get${campo.charAt(0).toUpperCase() + campo.slice(1)}`] = function() {
      return this[`_${campo}`];
    };

    obj[`set${campo.charAt(0).toUpperCase() + campo.slice(1)}`] = function(valor) {
      this[`_${campo}`] = valor;
    };
  });

  return obj;
}

// ES6 com propriedades computadas
function criarObjetoES6(campos) {
  const metodos = {};

  campos.forEach(campo => {
    const captalizado = campo.charAt(0).toUpperCase() + campo.slice(1);

    Object.assign(metodos, {
      [`get${captalizado}`]() {
        return this[`_${campo}`];
      },

      [`set${captalizado}`](valor) {
        this[`_${campo}`] = valor;
      }
    });
  });

  return metodos;
}

const obj = criarObjetoES6(['nome', 'idade']);
obj.setNome('Fernanda');
obj.setIdade(30);
console.log(obj.getNome()); // 'Fernanda'
console.log(obj.getIdade()); // 30
```

### Mapeamento de Dados

```javascript
// Transformar array de dados em objeto com chaves específicas
const usuarios = [
  { id: 1, nome: 'Ana' },
  { id: 2, nome: 'Bruno' },
  { id: 3, nome: 'Carlos' }
];

// Criar objeto indexado por ID
const usuariosPorId = usuarios.reduce((acc, usuario) => {
  return {
    ...acc,
    [usuario.id]: usuario // Propriedade computada com ID
  };
}, {});

console.log(usuariosPorId);
// {
//   1: { id: 1, nome: 'Ana' },
//   2: { id: 2, nome: 'Bruno' },
//   3: { id: 3, nome: 'Carlos' }
// }

console.log(usuariosPorId[2]); // { id: 2, nome: 'Bruno' }
```

### Configurações Condicionais

```javascript
const ambiente = 'producao';
const debug = false;

const config = {
  // Propriedades estáticas
  appName: 'MeuApp',
  versao: '1.0.0',

  // Propriedades computadas condicionais
  [ambiente === 'producao' ? 'apiURL' : 'apiURLDev']:
    ambiente === 'producao'
      ? 'https://api.prod.com'
      : 'http://localhost:3000',

  [debug ? 'logLevel' : 'silencioso']: debug ? 'verbose' : 'off'
};

console.log(config);
// {
//   appName: 'MeuApp',
//   versao: '1.0.0',
//   apiURL: 'https://api.prod.com',
//   silencioso: 'off'
// }
```

### Nomear Propriedades Dinamicamente

```javascript
const tipos = ['string', 'number', 'boolean'];

const validadores = tipos.reduce((acc, tipo) => {
  return {
    ...acc,

    // Método computado com nome baseado no tipo
    [`valida${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`](valor) {
      return typeof valor === tipo;
    }
  };
}, {});

console.log(validadores.validaString('texto')); // true
console.log(validadores.validaString(123));     // false
console.log(validadores.validaNumber(42));      // true
console.log(validadores.validaBoolean(true));   // true
```

### Internacionalização (i18n)

```javascript
const idioma = 'pt-BR';

const traducoes = {
  'pt-BR': {
    bemVindo: 'Bem-vindo',
    sair: 'Sair'
  },
  'en-US': {
    bemVindo: 'Welcome',
    sair: 'Logout'
  },
  'es-ES': {
    bemVindo: 'Bienvenido',
    sair: 'Salir'
  }
};

// Criar objeto com traduções do idioma atual
function obterTraducoes(lang) {
  const t = traducoes[lang];

  return {
    [`mensagem${Object.keys(t)[0]}`]: t[Object.keys(t)[0]],
    [`mensagem${Object.keys(t)[1]}`]: t[Object.keys(t)[1]]
  };
}

// Abordagem mais simples e direta
const mensagens = {
  [idioma]: traducoes[idioma]
};

console.log(mensagens['pt-BR']); // { bemVindo: 'Bem-vindo', sair: 'Sair' }
```

### Metadados com Symbols

```javascript
// Símbolos para metadados privados
const metaCreatedAt = Symbol('createdAt');
const metaUpdatedAt = Symbol('updatedAt');
const metaVersion = Symbol('version');

class Entidade {
  constructor(dados) {
    // Propriedades públicas normais
    Object.assign(this, dados);

    // Metadados com Symbols (propriedades computadas)
    this[metaCreatedAt] = new Date();
    this[metaUpdatedAt] = new Date();
    this[metaVersion] = 1;
  }

  atualizar(dados) {
    Object.assign(this, dados);
    this[metaUpdatedAt] = new Date();
    this[metaVersion]++;
  }

  obterMetadados() {
    return {
      criadoEm: this[metaCreatedAt],
      atualizadoEm: this[metaUpdatedAt],
      versao: this[metaVersion]
    };
  }
}

const usuario = new Entidade({ nome: 'Gabriel', idade: 28 });
console.log(usuario.nome); // 'Gabriel'

setTimeout(() => {
  usuario.atualizar({ idade: 29 });
  console.log(usuario.obterMetadados());
  // { criadoEm: Date, atualizadoEm: Date (mais recente), versao: 2 }
}, 1000);
```

---

## 🎯 Aplicabilidade e Contextos

### Padrões de Uso

#### 1. Transformação de Arrays em Objetos

```javascript
// Array de produtos
const produtos = [
  { sku: 'NB001', nome: 'Notebook', preco: 3000 },
  { sku: 'MS002', nome: 'Mouse', preco: 50 },
  { sku: 'TC003', nome: 'Teclado', preco: 200 }
];

// Indexar por SKU usando propriedades computadas
const produtosPorSKU = produtos.reduce((acc, produto) => ({
  ...acc,
  [produto.sku]: produto
}), {});

console.log(produtosPorSKU['NB001']);
// { sku: 'NB001', nome: 'Notebook', preco: 3000 }

// Busca O(1) ao invés de O(n)
```

#### 2. Builders e Configuradores

```javascript
class QueryBuilder {
  constructor() {
    this.query = {};
  }

  where(campo, valor) {
    return new QueryBuilder({
      ...this.query,
      [`where_${campo}`]: valor
    });
  }

  orderBy(campo, direcao = 'ASC') {
    return new QueryBuilder({
      ...this.query,
      [`orderBy_${campo}`]: direcao
    });
  }

  constructor(queryParcial = {}) {
    this.query = queryParcial;
  }

  build() {
    return this.query;
  }
}

const query = new QueryBuilder()
  .where('idade', 18)
  .where('ativo', true)
  .orderBy('nome', 'ASC')
  .build();

console.log(query);
// {
//   where_idade: 18,
//   where_ativo: true,
//   orderBy_nome: 'ASC'
// }
```

#### 3. Schemas e Validação

```javascript
function criarSchema(campos) {
  const schema = {};

  campos.forEach(({ nome, tipo, obrigatorio = false }) => {
    // Propriedades computadas para regras
    schema[nome] = {
      tipo,
      obrigatorio,
      [`valida${nome.charAt(0).toUpperCase() + nome.slice(1)}`](valor) {
        if (obrigatorio && (valor === null || valor === undefined)) {
          return false;
        }
        return typeof valor === tipo || valor === null || valor === undefined;
      }
    };
  });

  return schema;
}

const schema = criarSchema([
  { nome: 'nome', tipo: 'string', obrigatorio: true },
  { nome: 'idade', tipo: 'number', obrigatorio: true },
  { nome: 'email', tipo: 'string', obrigatorio: false }
]);

console.log(schema.nome.validaNome('Helena')); // true
console.log(schema.nome.validaNome(null));     // false (obrigatório)
console.log(schema.idade.validaIdade(25));     // true
```

#### 4. Event Emitters Dinâmicos

```javascript
class EventEmitter {
  constructor() {
    this.eventos = {};
  }

  on(evento, callback) {
    // Propriedade computada para array de listeners
    this.eventos = {
      ...this.eventos,
      [evento]: [...(this.eventos[evento] || []), callback]
    };
  }

  emit(evento, ...args) {
    const listeners = this.eventos[evento] || [];
    listeners.forEach(callback => callback(...args));
  }
}

const emitter = new EventEmitter();

emitter.on('usuario:criado', (dados) => {
  console.log('Usuário criado:', dados);
});

emitter.on('usuario:atualizado', (dados) => {
  console.log('Usuário atualizado:', dados);
});

emitter.emit('usuario:criado', { nome: 'Igor' });
// Usuário criado: { nome: 'Igor' }
```

---

## ⚠️ Limitações e Considerações

### Coerção para String

```javascript
const obj = {
  [1 + 2]: 'três',           // Número → "3"
  [true]: 'verdadeiro',      // Boolean → "true"
  [{}]: 'objeto',            // Object → "[object Object]"
  [['a', 'b']]: 'array'      // Array → "a,b"
};

console.log(obj);
// {
//   3: 'três',
//   true: 'verdadeiro',
//   '[object Object]': 'objeto',
//   'a,b': 'array'
// }

console.log(obj[3]);                      // 'três'
console.log(obj['3']);                    // 'três' (mesma propriedade)
console.log(obj[true]);                   // 'verdadeiro'
console.log(obj['[object Object]']);      // 'objeto'
```

**Conceito:** Valores não-string/não-Symbol são convertidos para string via `toString()`.

### Objetos como Chaves (Armadilha)

```javascript
const chave1 = { id: 1 };
const chave2 = { id: 2 };

const obj = {
  [chave1]: 'valor 1',
  [chave2]: 'valor 2'
};

console.log(obj);
// { '[object Object]': 'valor 2' }
// Ambos viraram a mesma string!

console.log(obj[chave1]); // 'valor 2'
console.log(obj[chave2]); // 'valor 2'

// ✅ Use Map para objetos como chaves
const mapa = new Map();
mapa.set(chave1, 'valor 1');
mapa.set(chave2, 'valor 2');

console.log(mapa.get(chave1)); // 'valor 1'
console.log(mapa.get(chave2)); // 'valor 2'
```

### Performance

```javascript
// ⚠️ Expressões complexas são avaliadas toda vez que objeto é criado
function criarObjeto() {
  return {
    [funcaoComputacionalmenteCara()]: 'valor'
  };
}

function funcaoComputacionalmenteCara() {
  // Simulação de operação custosa
  let resultado = '';
  for (let i = 0; i < 1000000; i++) {
    resultado += 'a';
  }
  return 'propriedade';
}

// Toda chamada executa função cara
const obj1 = criarObjeto(); // Lento
const obj2 = criarObjeto(); // Lento novamente

// ✅ Cache o resultado se possível
const nomePropriedade = funcaoComputacionalmenteCara(); // Uma vez

function criarObjetoOtimizado() {
  return {
    [nomePropriedade]: 'valor'
  };
}

const obj3 = criarObjetoOtimizado(); // Rápido
const obj4 = criarObjetoOtimizado(); // Rápido
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Tópicos

**Fundação:**
- **Object Literals**: Propriedades computadas são feature de object literals
- **Bracket Notation**: Mesma semântica, mas em literal
- **Expressões**: Qualquer expressão JavaScript válida

**Combinação:**
- **Shorthand Properties**: Podem coexistir
- **Method Definitions**: Métodos com nomes computados
- **Getters/Setters**: Com nomes computados
- **Spread Operator**: Com propriedades computadas

**Avançado:**
- **Symbols**: Propriedades únicas e privadas
- **Metaprogramação**: Geração dinâmica de objetos
- **Proxy/Reflect**: Interceptação de propriedades computadas
- **Decorators**: Modificar propriedades em tempo de classe

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

Após dominar propriedades computadas:
1. **Shorthand Properties**: Sintaxe concisa ES6
2. **Method Definitions**: Métodos com nomes computados
3. **Symbols**: Propriedades únicas
4. **Proxy**: Interceptação dinâmica
5. **Metaprogramação**: Geração avançada de objetos

### Conceitos que se Constroem

- **Dynamic Object Generation**: Objetos baseados em dados
- **Schema Builders**: Validação e configuração dinâmica
- **ORM Patterns**: Mapeamento objeto-relacional
- **Framework Internals**: Como frameworks usam computação

---

## 📚 Conclusão

Propriedades computadas permitem **nomes de propriedades dinâmicos** avaliados em tempo de execução.

**Pontos-chave:**
- **Sintaxe `[expressao]`**: Colchetes delimitam expressão
- **Avaliação Runtime**: Computadas ao criar objeto
- **Qualquer Expressão**: Variáveis, operações, funções, template literals
- **Coerção**: Resultados convertidos para string (exceto Symbols)
- **Flexibilidade**: Objetos mais dinâmicos e expressivos

**Use para:**
- Nomes de propriedades desconhecidos em tempo de código
- Transformar arrays em objetos indexados
- Metadados com Symbols
- Configurações dinâmicas
- Builders e schemas

Propriedades computadas são **essenciais para metaprogramação** e criação de APIs flexíveis em JavaScript moderno, eliminando necessidade de atribuições pós-criação e tornando código mais declarativo.
