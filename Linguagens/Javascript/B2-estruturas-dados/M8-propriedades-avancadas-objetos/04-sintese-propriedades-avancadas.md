# Síntese: Propriedades Avançadas de Objetos em JavaScript

## 🎯 Visão Geral Conceitual

Este módulo apresentou as **melhorias em object literals** introduzidas pelo ES6 e ES5, transformando objetos de estruturas básicas em **entidades expressivas e poderosas**. Juntas, essas features formam a base da programação orientada a objetos moderna em JavaScript.

### As Quatro Pilares

1. **Propriedades Computadas** (ES6): Nomes dinâmicos via expressões
2. **Shorthand Properties** (ES6): Sintaxe concisa quando nome = variável
3. **Method Definitions** (ES6): Métodos sem `function` keyword
4. **Getters/Setters** (ES5): Controle customizado de acesso

---

## 📋 Comparação Direta

### Tabela Comparativa

| Feature | Sintaxe | Quando Usar | Benefício Principal |
|---------|---------|-------------|---------------------|
| **Propriedades Computadas** | `{ [expr]: valor }` | Nome desconhecido em tempo de código | Dinamismo |
| **Shorthand Properties** | `{ variavel }` | Nome propriedade = nome variável | Concisão |
| **Method Definitions** | `metodo() {}` | Definir métodos | Legibilidade |
| **Getters** | `get prop() {}` | Computar valor ao ler | Propriedades derivadas |
| **Setters** | `set prop(v) {}` | Validar/transformar ao escrever | Encapsulamento |

### Evolução da Sintaxe

```javascript
// ❌ Pre-ES6/ES5: Verboso e limitado
var nome = 'usuario';
var email = 'user@email.com';
var prefixo = 'obter';

var obj = {
  nome: nome,                    // Redundante
  email: email,                  // Redundante
  apresentar: function() {       // Verboso
    return 'Olá';
  }
};

obj[prefixo + 'Nome'] = function() {  // Fora do literal
  return this.nome;
};

// ✅ ES6: Conciso e expressivo
const obj = {
  nome,                          // Shorthand
  email,                         // Shorthand

  apresentar() {                 // Method definition
    return 'Olá';
  },

  [prefixo + 'Nome']() {         // Computada + method
    return this.nome;
  },

  get nomeCompleto() {           // Getter
    return this.nome.toUpperCase();
  },

  set nomeCompleto(valor) {      // Setter
    this.nome = valor.trim();
  }
};
```

---

## 🔍 Combinando Features

### Exemplo Completo: Sistema de Usuários

```javascript
// Símbolos para propriedades privadas
const _id = Symbol('id');
const _criadoEm = Symbol('criadoEm');
const _atualizadoEm = Symbol('atualizadoEm');

function criarUsuario(nome, email, tipo = 'regular') {
  let _senha = null; // Privado via closure

  return {
    // Shorthand properties
    nome,
    email,
    tipo,

    // Propriedades computadas com Symbols
    [_id]: Math.random().toString(36).substr(2, 9),
    [_criadoEm]: new Date(),
    [_atualizadoEm]: new Date(),

    // Getter: propriedade derivada
    get id() {
      return this[_id];
    },

    get info() {
      return `${this.nome} (${this.email})`;
    },

    // Getter/Setter: validação
    get senha() {
      return '********'; // Nunca expõe senha real
    },

    set senha(valor) {
      if (valor.length < 8) {
        throw new Error('Senha deve ter no mínimo 8 caracteres');
      }
      _senha = valor;
      this[_atualizadoEm] = new Date();
    },

    // Method definitions
    validarSenha(senha) {
      return _senha === senha;
    },

    atualizar(dados) {
      Object.assign(this, dados);
      this[_atualizadoEm] = new Date();
      return this;
    },

    obterMetadados() {
      return {
        id: this[_id],
        criadoEm: this[_criadoEm],
        atualizadoEm: this[_atualizadoEm]
      };
    },

    // Method definition com nome computado
    [`é${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`]() {
      return true;
    }
  };
}

// Uso
const usuario = criarUsuario('Fernanda', 'fernanda@email.com', 'admin');

// Shorthand properties funcionando
console.log(usuario.nome);  // 'Fernanda'
console.log(usuario.email); // 'fernanda@email.com'

// Getters
console.log(usuario.id);    // 'abc123...'
console.log(usuario.info);  // 'Fernanda (fernanda@email.com)'

// Setter com validação
usuario.senha = 'SenhaSegura123';
console.log(usuario.validarSenha('SenhaSegura123')); // true

// Method definitions
usuario.atualizar({ nome: 'Fernanda Silva' });
console.log(usuario.obterMetadados());

// Propriedade computada em método
console.log(usuario.éAdmin()); // true

// Propriedades computadas com Symbols (privadas)
console.log(Object.keys(usuario)); // Symbols não aparecem
console.log(usuario[_criadoEm]);   // Date (ainda acessível via Symbol)
```

### Exemplo: Query Builder Completo

```javascript
class QueryBuilder {
  constructor(config = {}) {
    this._config = config;
  }

  // Method definitions para fluent interface
  select(...campos) {
    const select = campos.length > 0 ? campos : ['*'];
    return new QueryBuilder({ ...this._config, select });
  }

  from(tabela) {
    return new QueryBuilder({ ...this._config, from: tabela });
  }

  where(campo, operador, valor) {
    const where = [...(this._config.where || []), { campo, operador, valor }];
    return new QueryBuilder({ ...this._config, where });
  }

  orderBy(campo, direcao = 'ASC') {
    return new QueryBuilder({ ...this._config, orderBy: { campo, direcao } });
  }

  limit(quantidade) {
    return new QueryBuilder({ ...this._config, limit: quantidade });
  }

  // Getters para construir SQL
  get sql() {
    return this._construirSQL();
  }

  get params() {
    return this._extrairParametros();
  }

  // Method definition privado (convenção)
  _construirSQL() {
    const { select = ['*'], from, where = [], orderBy, limit } = this._config;

    let sql = `SELECT ${select.join(', ')} FROM ${from}`;

    if (where.length > 0) {
      const condicoes = where.map((w, i) => `${w.campo} ${w.operador} $${i + 1}`);
      sql += ` WHERE ${condicoes.join(' AND ')}`;
    }

    if (orderBy) {
      sql += ` ORDER BY ${orderBy.campo} ${orderBy.direcao}`;
    }

    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    return sql;
  }

  _extrairParametros() {
    const { where = [] } = this._config;
    return where.map(w => w.valor);
  }

  // Method definition para executar
  async executar(conexao) {
    return conexao.query(this.sql, this.params);
  }

  // Shorthand no retorno
  build() {
    const sql = this.sql;
    const params = this.params;
    return { sql, params }; // Shorthand
  }
}

// Uso
const query = new QueryBuilder()
  .select('nome', 'email', 'idade')
  .from('usuarios')
  .where('idade', '>=', 18)
  .where('ativo', '=', true)
  .orderBy('nome', 'ASC')
  .limit(10);

console.log(query.sql);
// SELECT nome, email, idade FROM usuarios WHERE idade >= $1 AND ativo = $2 ORDER BY nome ASC LIMIT 10

console.log(query.params);
// [18, true]

const { sql, params } = query.build(); // Destructuring + shorthand
```

### Exemplo: Validador com Todas Features

```javascript
const validadores = {
  // Method definitions
  email(valor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  },

  senha(valor) {
    return valor.length >= 8 &&
           /[A-Z]/.test(valor) &&
           /[a-z]/.test(valor) &&
           /[0-9]/.test(valor);
  },

  cpf(valor) {
    const limpo = valor.replace(/\D/g, '');
    return limpo.length === 11;
  },

  // Method definition com nome computado
  ...['string', 'number', 'boolean'].reduce((acc, tipo) => {
    return {
      ...acc,
      // Propriedade computada + method definition
      [`é${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`](valor) {
        return typeof valor === tipo;
      }
    };
  }, {})
};

function criarSchema(definicoes) {
  const schema = {
    _erros: {},

    // Getter
    get valido() {
      return Object.keys(this._erros).length === 0;
    },

    get erros() {
      return { ...this._erros };
    },

    // Method definitions
    validar(dados) {
      this._erros = {};

      definicoes.forEach(({ campo, regras }) => {
        const valor = dados[campo];

        regras.forEach(regra => {
          const validador = validadores[regra];

          if (validador && !validador(valor)) {
            if (!this._erros[campo]) {
              this._erros[campo] = [];
            }
            this._erros[campo].push(`Falhou validação: ${regra}`);
          }
        });
      });

      const valido = this.valido;
      const erros = this.erros;

      return { valido, erros }; // Shorthand
    },

    reset() {
      this._erros = {};
      return this;
    }
  };

  // Adicionar validadores dinâmicos para cada campo
  definicoes.forEach(({ campo, regras }) => {
    // Propriedade computada + method definition
    schema[`validar${campo.charAt(0).toUpperCase() + campo.slice(1)}`] = function(valor) {
      return regras.every(regra => {
        const validador = validadores[regra];
        return !validador || validador(valor);
      });
    };
  });

  return schema;
}

const schema = criarSchema([
  { campo: 'email', regras: ['email'] },
  { campo: 'senha', regras: ['senha'] },
  { campo: 'idade', regras: ['éNumber'] }
]);

const resultado = schema.validar({
  email: 'teste@email.com',
  senha: 'Senha123',
  idade: 25
});

console.log(resultado.valido); // true (getter + shorthand)
console.log(schema.validarEmail('invalido')); // false (método computado)
```

---

## 🎯 Quando Usar Cada Feature

### Propriedades Computadas

**Use quando:**
- Nome da propriedade desconhecido em tempo de código
- Gerar propriedades baseadas em dados (loop)
- Usar Symbols como chaves
- Criar propriedades com template literals

**Exemplo típico:**
```javascript
const tipo = 'usuario';
const obj = {
  [`${tipo}Id`]: 123,
  [`obter${tipo}`]() { return this[`${tipo}Id`]; }
};
```

### Shorthand Properties

**Use quando:**
- Nome da propriedade = nome da variável
- Retornar objetos de funções
- Reconstruir objetos após destructuring
- Exports de módulos

**Exemplo típico:**
```javascript
function criar(nome, email) {
  return { nome, email, ativo: true };
}
```

### Method Definitions

**Use quando:**
- Definir métodos em objetos (SEMPRE preferir sobre function expressions)
- Precisar acessar `super`
- Manter consistência com sintaxe de classes

**Exemplo típico:**
```javascript
const obj = {
  processar() { /* ... */ },
  async buscar() { /* ... */ },
  *gerar() { /* ... */ }
};
```

### Getters/Setters

**Use quando:**
- Propriedades computadas (derivadas de outras)
- Validação ao atribuir valores
- Formatação ao ler/escrever
- Lazy initialization
- Propriedades read-only

**Exemplo típico:**
```javascript
const obj = {
  _valor: 0,
  get valor() { return this._valor; },
  set valor(v) {
    if (v >= 0) this._valor = v;
  }
};
```

---

## ⚠️ Armadilhas Comuns

### 1. Confundir Shorthand com Destructuring

```javascript
// Shorthand: cria propriedade
const nome = 'Ana';
const obj = { nome }; // { nome: 'Ana' }

// Destructuring: extrai propriedade
const pessoa = { nome: 'Ana' };
const { nome } = pessoa; // nome = 'Ana'
```

### 2. Propriedades Computadas com Objetos

```javascript
const obj1 = { id: 1 };
const obj2 = { id: 2 };

const mapa = {
  [obj1]: 'valor1',
  [obj2]: 'valor2'
};

console.log(mapa);
// { '[object Object]': 'valor2' }
// Ambos viraram mesma string!

// Use Map para objetos como chaves
const map = new Map();
map.set(obj1, 'valor1');
map.set(obj2, 'valor2');
```

### 3. Getter com Side Effects

```javascript
// ❌ Evite side effects em getters
const obj = {
  _contador: 0,
  get valor() {
    this._contador++; // Side effect!
    return this._contador;
  }
};

console.log(obj.valor); // 1
console.log(obj.valor); // 2 (mudou!)
```

### 4. Method Definition vs Arrow

```javascript
const obj = {
  valor: 10,

  // ✅ Method definition: this correto
  metodo() {
    return this.valor;
  },

  // ❌ Arrow: this não é obj
  metodoArrow: () => {
    return this.valor; // undefined!
  }
};
```

---

## 🚀 Melhores Práticas

### 1. Combine Features Sabiamente

```javascript
// ✅ Excelente: todas features com propósito
function criarEntidade(tipo, dados) {
  const _metadata = Symbol('metadata');

  return {
    tipo,           // Shorthand
    ...dados,       // Spread

    [_metadata]: {  // Computada + Symbol
      criadoEm: new Date()
    },

    [`é${tipo}`]() {  // Computada + method
      return true;
    },

    get info() {      // Getter
      return `${tipo}: ${dados.nome}`;
    },

    atualizar(novos) {  // Method
      Object.assign(this, novos);
      return this;
    }
  };
}
```

### 2. Prefira Shorthand Sempre que Possível

```javascript
// ❌ Verboso
function criar(nome, email, idade) {
  return {
    nome: nome,
    email: email,
    idade: idade
  };
}

// ✅ Conciso
function criar(nome, email, idade) {
  return { nome, email, idade };
}
```

### 3. Use Method Definitions para Métodos

```javascript
// ❌ Antigo
const obj = {
  metodo: function() {}
};

// ✅ Moderno
const obj = {
  metodo() {}
};
```

### 4. Getters para Valores Derivados

```javascript
// ✅ Getter para propriedade computada
const retangulo = {
  largura: 10,
  altura: 5,

  get area() {
    return this.largura * this.altura;
  }
};

// ❌ Não use método para propriedade derivada
const retangulo = {
  largura: 10,
  altura: 5,

  area() { // Estranho: parece ação, mas é valor
    return this.largura * this.altura;
  }
};
```

---

## 📚 Conclusão

As propriedades avançadas de objetos transformaram object literals de **estruturas passivas** em **entidades expressivas e poderosas**.

**Resumo:**
- **Propriedades Computadas**: Dinamismo (nomes em runtime)
- **Shorthand Properties**: Concisão (elimina redundância)
- **Method Definitions**: Legibilidade (sintaxe moderna)
- **Getters/Setters**: Controle (validação, computação, encapsulamento)

**Impacto:**
- Código mais limpo e manutenível
- Alinhamento com padrões modernos
- Base para classes ES6
- Melhor encapsulamento e abstração

Dominar essas features é **essencial** para JavaScript moderno - são a fundação da programação orientada a objetos idiomática e expressiva.
