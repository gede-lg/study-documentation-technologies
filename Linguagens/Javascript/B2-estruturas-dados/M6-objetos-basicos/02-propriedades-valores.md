# Propriedades e Valores em Objetos JavaScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Propriedades** são os componentes fundamentais de objetos JavaScript - pares de **nome (chave) e valor** que armazenam dados e comportamentos. Cada propriedade é uma associação entre um identificador (string ou Symbol) e um valor (qualquer tipo JavaScript).

Conceitualmente, uma propriedade é:
- **Nome/Chave**: Identificador único (string ou Symbol)
- **Valor**: Dados armazenados (primitivo, objeto, função)
- **Atributos**: Metadados (enumerable, writable, configurable - veremos em módulos avançados)

Na essência, objetos JavaScript são **coleções de propriedades** - estruturas dinâmicas que mapeiam chaves para valores, similar a dicionários ou hash maps em outras linguagens.

---

## 📋 Sumário Conceitual

1. **Propriedades são Pares**: Nome + Valor
2. **Nomes são Strings/Symbols**: Convertidos implicitamente
3. **Valores são Tipados**: Qualquer tipo JavaScript
4. **Dinâmicas**: Podem ser adicionadas/removidas em runtime
5. **Property Descriptors**: Metadados ocultos (enumerable, writable, configurable)

---

## 🧠 Fundamentos Teóricos

### Tipos de Propriedades

#### 1. Data Properties (Propriedades de Dados)

Armazenam valores diretamente:

```javascript
const pessoa = {
  nome: 'Ana',      // Data property
  idade: 25,        // Data property
  ativo: true       // Data property
};
```

#### 2. Accessor Properties (Getters/Setters)

Usam funções para obter/definir valores:

```javascript
const retangulo = {
  largura: 10,
  altura: 5,

  // Getter (accessor property)
  get area() {
    return this.largura * this.altura;
  },

  // Setter (accessor property)
  set dimensoes(valor) {
    [this.largura, this.altura] = valor;
  }
};

console.log(retangulo.area); // 50 (chama getter)
retangulo.dimensoes = [20, 10]; // Chama setter
console.log(retangulo.area); // 200
```

### Nomes de Propriedade

```javascript
const obj = {
  // Identificador válido (sem aspas)
  nome: 'valor',

  // Caracteres especiais (requer aspas)
  'nome-completo': 'Ana Silva',
  'meu email': 'ana@email.com',

  // Número (convertido para string)
  123: 'número',

  // String numérica
  '456': 'string',

  // Expressão (computed property - ES6)
  ['prop' + 'Dinamica']: 'valor'
};

console.log(obj['123'] === obj[123]); // true (ambos acessam "123")
```

**Conceito:** Internamente, todas as chaves são strings (exceto Symbols). Números são convertidos.

### Valores de Propriedade

```javascript
const variado = {
  // Primitivos
  numero: 42,
  texto: 'string',
  booleano: true,
  nulo: null,
  indefinido: undefined,
  bigInt: 123n,
  simbolo: Symbol('único'),

  // Objetos
  objeto: { x: 1 },
  array: [1, 2, 3],
  data: new Date(),
  regex: /abc/,

  // Funções
  metodo: function() { return 'oi'; },
  arrow: () => 'arrow',

  // ES6 shorthand
  metodoShort() { return 'short'; }
};
```

---

## 🔍 Análise Conceitual Profunda

### Propriedades Own vs Herdadas

```javascript
const pai = { herdada: 'do prototype' };
const filho = Object.create(pai);
filho.propria = 'do objeto';

console.log(filho.propria);  // 'do objeto' (own property)
console.log(filho.herdada);  // 'do prototype' (inherited)

// Verificar propriedade própria
console.log(filho.hasOwnProperty('propria'));  // true
console.log(filho.hasOwnProperty('herdada')); // false

// in operator (verifica próprias E herdadas)
console.log('propria' in filho);  // true
console.log('herdada' in filho);  // true
```

### Propriedades Enumeráveis

```javascript
const obj = {
  visivel: 'aparece em loops',
  _privado: 'também aparece (convenção, não enforced)'
};

// Propriedade não-enumerável (usando defineProperty)
Object.defineProperty(obj, 'oculta', {
  value: 'não aparece',
  enumerable: false
});

// for...in (apenas enumeráveis)
for (const key in obj) {
  console.log(key); // 'visivel', '_privado'
}

// Object.keys (apenas enumeráveis próprias)
console.log(Object.keys(obj)); // ['visivel', '_privado']

// getOwnPropertyNames (todas próprias, inclusive não-enumeráveis)
console.log(Object.getOwnPropertyNames(obj));
// ['visivel', '_privado', 'oculta']
```

### Valores undefined vs Propriedades Inexistentes

```javascript
const obj = {
  existe: undefined,
  // 'naoExiste' não está definido
};

console.log(obj.existe);     // undefined (propriedade existe)
console.log(obj.naoExiste);  // undefined (propriedade não existe)

// Diferenciar:
console.log('existe' in obj);     // true
console.log('naoExiste' in obj);  // false

console.log(obj.hasOwnProperty('existe'));    // true
console.log(obj.hasOwnProperty('naoExiste')); // false
```

**Conceito:** `undefined` pode ser valor de propriedade. Use `in` ou `hasOwnProperty` para verificar existência.

### Propriedades Computadas (ES6)

```javascript
const prefixo = 'user';
const id = 123;

const usuario = {
  // Computed property name
  [prefixo + '_' + id]: 'Ana',
  [`${prefixo}Email`]: 'ana@email.com',

  // Expressões complexas
  [(() => 'dinamica')()]: 'valor calculado'
};

console.log(usuario.user_123); // 'Ana'
console.log(usuario.userEmail); // 'ana@email.com'
```

---

## 🎯 Aplicabilidade e Contextos

### Padrões de Uso

#### 1. Valores Padrão

```javascript
const config = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
  retries: 3
};

function conectar(options = {}) {
  const configuracao = {
    ...config,      // Valores padrão
    ...options      // Sobrescreve com valores fornecidos
  };

  console.log(configuracao);
}

conectar({ port: 8080 });
// { host: 'localhost', port: 8080, timeout: 5000, retries: 3 }
```

#### 2. Propriedades Privadas (Convenção)

```javascript
const conta = {
  titular: 'Bruno',
  _saldo: 1000,  // Convenção: _ indica "privado"

  depositar(valor) {
    this._saldo += valor;
  },

  get saldo() {
    return this._saldo; // Acesso controlado
  }
};

// Ainda acessível (não é verdadeiramente privado)
console.log(conta._saldo); // 1000 (mas por convenção, não deveria)
```

**Nota:** JavaScript moderno tem **private fields** em classes (`#propriedade`), mas em object literals, privacidade é por convenção.

#### 3. Metadata Properties

```javascript
const tarefa = {
  titulo: 'Fazer compras',
  completa: false,

  // Metadados
  _criadaEm: new Date(),
  _modificadaEm: null,
  _versao: 1,

  completar() {
    this.completa = true;
    this._modificadaEm = new Date();
    this._versao++;
  }
};
```

---

## ⚠️ Limitações e Considerações

### Armadilhas

#### 1. Sobrescrever Propriedades

```javascript
const obj = {
  nome: 'primeiro',
  idade: 25,
  nome: 'segundo'  // Sobrescreve silenciosamente
};

console.log(obj.nome); // 'segundo'
```

#### 2. Referências em Valores

```javascript
const referencia = { x: 1 };

const obj = {
  prop: referencia  // Armazena referência, não cópia
};

referencia.x = 99;
console.log(obj.prop.x); // 99 (modificado!)
```

---

## 📚 Conclusão

Propriedades são os **blocos de construção** de objetos JavaScript.

**Pontos-chave:**
- **Pares chave-valor**
- **Nomes**: Strings/Symbols
- **Valores**: Qualquer tipo
- **Dinâmicas**: Adicionáveis/removíveis
- **Metadados**: Descriptors ocultos

Compreender propriedades profundamente é essencial para dominar objetos em JavaScript.
