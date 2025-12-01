# Getters e Setters em JavaScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Getters** e **Setters** são **métodos acessores especiais** que permitem definir comportamento customizado ao **ler** (get) ou **escrever** (set) propriedades de objetos. Conceitualmente, são **propriedades computadas** que se comportam como propriedades de dados mas executam lógica quando acessadas.

Na essência:
- **Getter**: Função executada ao **acessar** uma propriedade (aparece como leitura)
- **Setter**: Função executada ao **atribuir** valor a uma propriedade (aparece como escrita)

```javascript
const pessoa = {
  _nome: 'Ana',

  // Getter: chamado ao ler pessoa.nome
  get nome() {
    return this._nome.toUpperCase();
  },

  // Setter: chamado ao escrever pessoa.nome = 'valor'
  set nome(valor) {
    this._nome = valor.trim();
  }
};

console.log(pessoa.nome);  // 'ANA' (chama getter)
pessoa.nome = '  Bruno  '; // (chama setter)
console.log(pessoa.nome);  // 'BRUNO'
```

**Diferença fundamental:**
- **Propriedade de dados**: Acesso direto ao valor armazenado
- **Getter/Setter**: Acesso mediado por função (computado, validado, formatado)

### Contexto Histórico

Getters e Setters foram introduzidos no **ECMAScript 5 (2009)** como forma de criar propriedades computadas e controlar acesso a dados.

**Evolução:**
- **Pre-ES5**: Apenas propriedades de dados diretas
- **ES5 (2009)**: Sintaxe `get`/`set` em object literals e `Object.defineProperty()`
- **ES6 (2015)**: Getters/setters em classes
- **Moderno**: Private fields com getters/setters para encapsulamento

**Filosofia:** Getters/setters seguem princípio de **encapsulamento** - ocultar implementação interna, expor interface controlada. Permitem **abstração de dados** - propriedades que parecem simples mas têm lógica complexa.

### Problema Fundamental que Resolve

1. **Validação**: Garantir dados válidos ao atribuir
2. **Formatação**: Transformar dados ao ler/escrever
3. **Propriedades Computadas**: Valores derivados de outros dados
4. **Encapsulamento**: Ocultar propriedades internas, expor interface
5. **Compatibilidade**: Adicionar lógica sem quebrar API existente
6. **Lazy Initialization**: Computar valores apenas quando necessário

**Exemplo do problema:**

```javascript
// ❌ Sem getters/setters: sem validação, sem formatação
const usuario = {
  idade: 25
};

usuario.idade = -5;        // Aceita valor inválido!
usuario.idade = 'texto';   // Aceita tipo errado!

// ✅ Com setter: validação automática
const usuarioValidado = {
  _idade: 25,

  set idade(valor) {
    if (typeof valor !== 'number' || valor < 0) {
      throw new Error('Idade inválida');
    }
    this._idade = valor;
  },

  get idade() {
    return this._idade;
  }
};

usuarioValidado.idade = 30;  // OK
// usuarioValidado.idade = -5; // Erro: Idade inválida
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Métodos Acessores**: Funções disfarçadas de propriedades
2. **Sintaxe Especial**: Palavras-chave `get` e `set`
3. **Acesso Transparente**: Chamados automaticamente (sem parênteses)
4. **Propriedades Computadas**: Valores derivados dinamicamente
5. **Controle de Acesso**: Validação, transformação, log

### Pilares Fundamentais

- **get**: Define comportamento ao **ler** propriedade
- **set**: Define comportamento ao **escrever** propriedade
- **Convenção _prop**: Propriedade interna com underscore
- **Sem Parâmetros (get)**: Getters não recebem argumentos
- **Um Parâmetro (set)**: Setters recebem novo valor

### Visão Geral das Nuances

- **Read-only**: Getter sem setter (propriedade somente leitura)
- **Write-only**: Setter sem getter (raro, mas possível)
- **Computed Properties**: Valores derivados, não armazenados
- **Validação**: Setters podem rejeitar valores inválidos
- **Side Effects**: Getters/setters podem executar lógica adicional

---

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

```javascript
const objeto = {
  _propriedade: 'valor interno',

  // Getter: executado ao LER
  get propriedade() {
    console.log('Getter chamado');
    return this._propriedade;
  },

  // Setter: executado ao ESCREVER
  set propriedade(valor) {
    console.log('Setter chamado com:', valor);
    this._propriedade = valor;
  }
};

// Acesso parece propriedade normal, mas chama getter
console.log(objeto.propriedade); // 'Getter chamado' → 'valor interno'

// Atribuição parece normal, mas chama setter
objeto.propriedade = 'novo valor'; // 'Setter chamado com: novo valor'

console.log(objeto.propriedade); // 'Getter chamado' → 'novo valor'
```

**Conceito:** Sintaxe de acesso é idêntica a propriedades normais, mas comportamento é mediado por funções.

### Convenção de Naming (\_prop)

```javascript
const pessoa = {
  // Propriedade interna (convenção: underscore)
  _nome: 'Bruno',
  _idade: 30,

  // Getter/setter expõem interface pública
  get nome() {
    return this._nome;
  },

  set nome(valor) {
    this._nome = valor.trim();
  },

  get idade() {
    return this._idade;
  },

  set idade(valor) {
    if (valor < 0 || valor > 150) {
      throw new Error('Idade inválida');
    }
    this._idade = valor;
  }
};

// Interface pública (sem underscore)
pessoa.nome = '  Carlos  ';
console.log(pessoa.nome); // 'Carlos'

// Acesso direto ainda possível (convenção, não enforcement)
console.log(pessoa._nome); // 'Carlos' (não recomendado)
```

**Conceito:** Underscore indica "propriedade interna" - convenção, não restrição. JavaScript moderno tem **private fields** (`#prop`) para verdadeira privacidade.

### Propriedades Computadas

```javascript
const retangulo = {
  largura: 10,
  altura: 5,

  // Propriedade computada (não armazenada)
  get area() {
    return this.largura * this.altura;
  },

  get perimetro() {
    return 2 * (this.largura + this.altura);
  }
};

console.log(retangulo.area);      // 50 (calculado)
console.log(retangulo.perimetro); // 30 (calculado)

retangulo.largura = 20;
console.log(retangulo.area);      // 100 (recalculado automaticamente)
```

**Conceito:** Getters podem retornar valores derivados de outras propriedades, atualizados automaticamente quando dados mudam.

### Read-Only Properties

```javascript
const config = {
  _apiKey: 'chave-secreta-123',

  // Getter sem setter = somente leitura
  get apiKey() {
    return this._apiKey;
  }
};

console.log(config.apiKey); // 'chave-secreta-123'

// Tentativa de escrita é silenciosamente ignorada (non-strict)
config.apiKey = 'nova-chave';
console.log(config.apiKey); // 'chave-secreta-123' (não mudou)

// Em strict mode, lança erro
'use strict';
// config.apiKey = 'nova'; // TypeError: Cannot set property apiKey
```

---

## 🔍 Análise Conceitual Profunda

### Validação com Setters

```javascript
const usuario = {
  _email: '',
  _senha: '',

  get email() {
    return this._email;
  },

  set email(valor) {
    // Validação de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(valor)) {
      throw new Error('Email inválido');
    }

    this._email = valor.toLowerCase(); // Normalizar
  },

  get senha() {
    return '********'; // Nunca expõe senha real
  },

  set senha(valor) {
    // Validação de senha
    if (valor.length < 8) {
      throw new Error('Senha deve ter no mínimo 8 caracteres');
    }

    if (!/[A-Z]/.test(valor)) {
      throw new Error('Senha deve ter letra maiúscula');
    }

    if (!/[0-9]/.test(valor)) {
      throw new Error('Senha deve ter número');
    }

    this._senha = valor; // Em produção, usar hash!
  }
};

usuario.email = 'CARLOS@EMAIL.COM';
console.log(usuario.email); // 'carlos@email.com' (normalizado)

usuario.senha = 'Senha123';
console.log(usuario.senha); // '********' (ocultado)

// usuario.email = 'invalido'; // Erro: Email inválido
// usuario.senha = 'curta';     // Erro: Senha deve ter no mínimo 8 caracteres
```

### Formatação Automática

```javascript
const produto = {
  _preco: 0,
  _nome: '',

  get preco() {
    // Formatar como moeda ao ler
    return `R$ ${this._preco.toFixed(2)}`;
  },

  set preco(valor) {
    // Aceitar número ou string, normalizar
    const numero = typeof valor === 'string'
      ? parseFloat(valor.replace(/[^\d.-]/g, ''))
      : valor;

    if (isNaN(numero) || numero < 0) {
      throw new Error('Preço inválido');
    }

    this._preco = numero;
  },

  get nome() {
    return this._nome;
  },

  set nome(valor) {
    // Capitalizar primeira letra de cada palavra
    this._nome = valor
      .toLowerCase()
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');
  }
};

produto.preco = 'R$ 1.234,56';
console.log(produto.preco); // 'R$ 1234.56'

produto.nome = 'notebook GAMER';
console.log(produto.nome); // 'Notebook Gamer'
```

### Lazy Initialization

```javascript
const dados = {
  _cache: null,

  // Getter com lazy loading
  get cache() {
    if (this._cache === null) {
      console.log('Inicializando cache...');
      this._cache = this.carregarDados(); // Computação pesada
    }
    return this._cache;
  },

  carregarDados() {
    // Simulação de operação custosa
    return Array.from({ length: 1000 }, (_, i) => i);
  },

  limparCache() {
    this._cache = null;
  }
};

// Cache só é criado quando acessado pela primeira vez
console.log(dados.cache.length); // 'Inicializando cache...' → 1000
console.log(dados.cache.length); // 1000 (usa cache existente)

dados.limparCache();
console.log(dados.cache.length); // 'Inicializando cache...' → 1000
```

### Dependências entre Propriedades

```javascript
const temperatura = {
  _celsius: 0,

  // Celsius (armazenado)
  get celsius() {
    return this._celsius;
  },

  set celsius(valor) {
    this._celsius = valor;
  },

  // Fahrenheit (computado de celsius)
  get fahrenheit() {
    return (this._celsius * 9/5) + 32;
  },

  set fahrenheit(valor) {
    this._celsius = (valor - 32) * 5/9;
  },

  // Kelvin (computado de celsius)
  get kelvin() {
    return this._celsius + 273.15;
  },

  set kelvin(valor) {
    this._celsius = valor - 273.15;
  }
};

temperatura.celsius = 0;
console.log(temperatura.fahrenheit); // 32
console.log(temperatura.kelvin);     // 273.15

temperatura.fahrenheit = 100;
console.log(temperatura.celsius);    // 37.77...
console.log(temperatura.kelvin);     // 310.92...
```

**Conceito:** Getters/setters permitem múltiplas "visões" dos mesmos dados, com conversões automáticas.

### Logging e Observação

```javascript
const observavel = {
  _valor: 0,
  _historico: [],

  get valor() {
    console.log(`[GET] Valor lido: ${this._valor}`);
    return this._valor;
  },

  set valor(novoValor) {
    const antigoValor = this._valor;
    console.log(`[SET] ${antigoValor} → ${novoValor}`);

    this._historico.push({
      de: antigoValor,
      para: novoValor,
      timestamp: new Date()
    });

    this._valor = novoValor;
  },

  get historico() {
    return [...this._historico]; // Retorna cópia
  }
};

observavel.valor = 10;  // [SET] 0 → 10
observavel.valor = 20;  // [SET] 10 → 20
console.log(observavel.valor); // [GET] Valor lido: 20 → 20
console.log(observavel.historico);
```

---

## 🎯 Aplicabilidade e Contextos

### Padrões de Uso

#### 1. Propriedades Virtuais (FullName Pattern)

```javascript
const pessoa = {
  _primeiroNome: '',
  _sobrenome: '',

  get primeiroNome() {
    return this._primeiroNome;
  },

  set primeiroNome(valor) {
    this._primeiroNome = valor.trim();
  },

  get sobrenome() {
    return this._sobrenome;
  },

  set sobrenome(valor) {
    this._sobrenome = valor.trim();
  },

  // Propriedade virtual (não armazenada)
  get nomeCompleto() {
    return `${this._primeiroNome} ${this._sobrenome}`.trim();
  },

  set nomeCompleto(valor) {
    const partes = valor.trim().split(' ');
    this._primeiroNome = partes[0] || '';
    this._sobrenome = partes.slice(1).join(' ') || '';
  }
};

pessoa.nomeCompleto = 'Diana Silva Costa';
console.log(pessoa.primeiroNome);  // 'Diana'
console.log(pessoa.sobrenome);     // 'Silva Costa'
console.log(pessoa.nomeCompleto);  // 'Diana Silva Costa'
```

#### 2. Validação de Dados

```javascript
const conta = {
  _saldo: 0,
  _limite: 1000,

  get saldo() {
    return this._saldo;
  },

  get limite() {
    return this._limite;
  },

  set limite(valor) {
    if (valor < 0) {
      throw new Error('Limite não pode ser negativo');
    }
    this._limite = valor;
  },

  depositar(valor) {
    if (valor <= 0) {
      throw new Error('Valor deve ser positivo');
    }
    this._saldo += valor;
  },

  sacar(valor) {
    if (valor <= 0) {
      throw new Error('Valor deve ser positivo');
    }

    if (this._saldo - valor < -this._limite) {
      throw new Error('Limite excedido');
    }

    this._saldo -= valor;
  }
};

conta.depositar(500);
console.log(conta.saldo); // 500

conta.limite = 2000;
conta.sacar(1500);
console.log(conta.saldo); // -1000 (dentro do limite)
```

#### 3. Conversão de Unidades

```javascript
const medida = {
  _metros: 0,

  // Metros (armazenado)
  get metros() {
    return this._metros;
  },

  set metros(valor) {
    if (valor < 0) throw new Error('Valor inválido');
    this._metros = valor;
  },

  // Centímetros (computado)
  get centimetros() {
    return this._metros * 100;
  },

  set centimetros(valor) {
    if (valor < 0) throw new Error('Valor inválido');
    this._metros = valor / 100;
  },

  // Quilômetros (computado)
  get quilometros() {
    return this._metros / 1000;
  },

  set quilometros(valor) {
    if (valor < 0) throw new Error('Valor inválido');
    this._metros = valor * 1000;
  },

  // Milhas (computado)
  get milhas() {
    return this._metros / 1609.34;
  },

  set milhas(valor) {
    if (valor < 0) throw new Error('Valor inválido');
    this._metros = valor * 1609.34;
  }
};

medida.quilometros = 5;
console.log(medida.metros);      // 5000
console.log(medida.centimetros); // 500000
console.log(medida.milhas);      // ~3.107
```

---

## ⚠️ Limitações e Considerações

### Performance

```javascript
// ❌ Getter com computação custosa chamado repetidamente
const obj = {
  get custoso() {
    // Simulação de cálculo pesado
    return Array.from({ length: 1000000 }, (_, i) => i)
      .reduce((a, b) => a + b);
  }
};

// Chamado 3 vezes = 3 computações!
console.log(obj.custoso);
console.log(obj.custoso);
console.log(obj.custoso);

// ✅ Solução: cache
const objOtimizado = {
  _cache: null,

  get custoso() {
    if (this._cache === null) {
      this._cache = Array.from({ length: 1000000 }, (_, i) => i)
        .reduce((a, b) => a + b);
    }
    return this._cache;
  }
};
```

### Side Effects em Getters

```javascript
// ❌ Getter com side effects (não recomendado)
const contador = {
  _acessos: 0,

  get valor() {
    this._acessos++; // Side effect!
    return 42;
  }
};

console.log(contador.valor); // 42
console.log(contador.valor); // 42
console.log(contador._acessos); // 2 (mudou estado!)
```

**Conceito:** Getters idealmente devem ser **idempotentes** (sem side effects), comportando-se como propriedades de dados.

### Compatibilidade com JSON

```javascript
const obj = {
  _nome: 'Eduardo',

  get nome() {
    return this._nome;
  }
};

// ⚠️ Getters não aparecem em JSON.stringify
console.log(JSON.stringify(obj)); // {"_nome":"Eduardo"}

// ✅ Solução: método toJSON customizado
const objJSON = {
  _nome: 'Eduardo',

  get nome() {
    return this._nome;
  },

  toJSON() {
    return {
      nome: this.nome // Chama getter explicitamente
    };
  }
};

console.log(JSON.stringify(objJSON)); // {"nome":"Eduardo"}
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Tópicos

**Fundação:**
- **Métodos**: Getters/setters são métodos especiais
- **Propriedades**: Alternativa a propriedades de dados
- **this**: Acessam dados via `this`

**Progressão:**
- **Object.defineProperty()**: Forma alternativa de criar getters/setters
- **Proxy**: Interceptar acesso mais genérico
- **Classes**: Getters/setters em classes
- **Private Fields**: Encapsulamento real com `#prop`

---

## 📚 Conclusão

Getters e Setters são **métodos acessores** que controlam acesso a propriedades.

**Pontos-chave:**
- **get**: Executa ao **ler** propriedade
- **set**: Executa ao **escrever** propriedade
- **Validação**: Garantir dados válidos
- **Computação**: Propriedades derivadas dinamicamente
- **Encapsulamento**: Ocultar implementação interna

**Use para:**
- Validar dados ao atribuir
- Formatar valores ao ler/escrever
- Propriedades computadas (área, total, etc.)
- Conversões de unidades
- Lazy initialization

Getters/setters permitem objetos com **interface simples** mas **lógica complexa** - essencial para encapsulamento e abstração em JavaScript.
