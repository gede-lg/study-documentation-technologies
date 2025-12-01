# Modificando Prototypes: Análise Conceitual

## 🎯 Definição

**Modificar prototypes** refere-se à capacidade de adicionar, alterar ou remover propriedades e métodos de um prototype após sua criação inicial. Esta é uma característica poderosa mas que requer cuidado em JavaScript.

```javascript
function Pessoa(nome) {
  this.nome = nome;
}

// Modificar prototype após definição
Pessoa.prototype.cumprimentar = function() {
  return `Olá, sou ${this.nome}`;
};

const p1 = new Pessoa('Ana');
console.log(p1.cumprimentar()); // 'Olá, sou Ana'

// Adicionar método mesmo após criar instâncias
Pessoa.prototype.despedir = function() {
  return `Até logo, ${this.nome}`;
};

console.log(p1.despedir()); // 'Até logo, Ana' (funciona!)
```

## 📋 Formas de Modificação

### 1. Adicionar Métodos

```javascript
function Contador() {
  this.valor = 0;
}

// Adicionar um por vez
Contador.prototype.incrementar = function() {
  this.valor++;
};

Contador.prototype.decrementar = function() {
  this.valor--;
};

Contador.prototype.resetar = function() {
  this.valor = 0;
};
```

### 2. Sobrescrever Prototype Inteiro

```javascript
function Animal(nome) {
  this.nome = nome;
}

// ⚠️ Sobrescrever prototype inteiro
Animal.prototype = {
  // IMPORTANTE: restaurar constructor
  constructor: Animal,

  falar: function() {
    return `${this.nome} faz som`;
  },

  comer: function() {
    return `${this.nome} está comendo`;
  }
};
```

### 3. Modificar Prototype Nativo (❌ NÃO RECOMENDADO)

```javascript
// ❌ NUNCA FAÇA ISSO EM PRODUÇÃO!
Array.prototype.primeiro = function() {
  return this[0];
};

const arr = [1, 2, 3];
console.log(arr.primeiro()); // 1

// Problemas:
// - Polui namespace global
// - Conflita com futuros padrões
// - Quebra código de bibliotecas
```

## 🧠 Análise Profunda

### Modificação Dinâmica

Prototypes são **dinâmicos** - mudanças afetam todas instâncias, incluindo as já criadas:

```javascript
function Carro(marca) {
  this.marca = marca;
}

const c1 = new Carro('Toyota');
const c2 = new Carro('Honda');

// Adicionar método APÓS criar instâncias
Carro.prototype.buzinar = function() {
  return `${this.marca}: Beep beep!`;
};

// Instâncias antigas ganham novo método!
console.log(c1.buzinar()); // 'Toyota: Beep beep!'
console.log(c2.buzinar()); // 'Honda: Beep beep!'
```

### Sobrescrever vs Adicionar

```javascript
function Teste() {}

const obj1 = new Teste();

// Adicionar (seguro)
Teste.prototype.metodo1 = function() {
  return 'método 1';
};

console.log(obj1.metodo1()); // 'método 1' (funciona)

// Sobrescrever prototype (problemático)
Teste.prototype = {
  metodo2: function() {
    return 'método 2';
  }
};

const obj2 = new Teste();

// obj1 ainda aponta para prototype ANTIGO
console.log(obj1.metodo1()); // 'método 1' (ainda funciona)
console.log(obj1.metodo2); // undefined (não vê novo prototype)

// obj2 aponta para prototype NOVO
console.log(obj2.metodo1); // undefined (não vê método antigo)
console.log(obj2.metodo2()); // 'método 2' (funciona)
```

### Remover Propriedades

```javascript
function Usuario(nome) {
  this.nome = nome;
}

Usuario.prototype.tipo = 'comum';
Usuario.prototype.ativo = true;

const user = new Usuario('João');
console.log(user.tipo); // 'comum'

// Remover do prototype
delete Usuario.prototype.tipo;

console.log(user.tipo); // undefined (removido)
console.log(user.ativo); // true (ainda existe)
```

## 🔍 Exemplo Completo: Plugin System

```javascript
function Editor(conteudo) {
  this.conteudo = conteudo || '';
}

Editor.prototype.obterConteudo = function() {
  return this.conteudo;
};

Editor.prototype.definirConteudo = function(novoConteudo) {
  this.conteudo = novoConteudo;
};

// Sistema de plugins: adiciona funcionalidades ao prototype
const EditorPlugins = {
  contarPalavras: function() {
    return this.conteudo.split(/\s+/).filter(Boolean).length;
  },

  contarCaracteres: function() {
    return this.conteudo.length;
  },

  converterMaiusculas: function() {
    this.conteudo = this.conteudo.toUpperCase();
    return this;
  },

  converterMinusculas: function() {
    this.conteudo = this.conteudo.toLowerCase();
    return this;
  }
};

// "Instalar" plugins modificando prototype
Object.keys(EditorPlugins).forEach(function(plugin) {
  Editor.prototype[plugin] = EditorPlugins[plugin];
});

// Uso
const editor = new Editor('Olá Mundo JavaScript');

console.log(editor.contarPalavras()); // 3
console.log(editor.contarCaracteres()); // 21

editor.converterMaiusculas();
console.log(editor.obterConteudo()); // 'OLÁ MUNDO JAVASCRIPT'
```

## ⚠️ Cuidados e Armadilhas

### 1. Perder Referência ao Constructor

```javascript
function MinhaClasse() {}

// ❌ Sobrescrever sem restaurar constructor
MinhaClasse.prototype = {
  metodo: function() {}
};

const obj = new MinhaClasse();
console.log(obj.constructor === MinhaClasse); // false (perdeu!)

// ✅ Sempre restaurar
MinhaClasse.prototype = {
  constructor: MinhaClasse, // Restaurar
  metodo: function() {}
};
```

### 2. Modificar Object.prototype (NUNCA!)

```javascript
// ❌ EXTREMAMENTE PERIGOSO
Object.prototype.minhaPropriedade = 'valor';

// Agora TODOS objetos têm isso
const obj = {};
console.log(obj.minhaPropriedade); // 'valor'

// Quebra for...in
for (let key in obj) {
  console.log(key); // 'minhaPropriedade' aparece!
}
```

### 3. Monkeypatch com Cuidado

```javascript
// Guardar método original antes de sobrescrever
const originalToString = Date.prototype.toString;

Date.prototype.toString = function() {
  // Adicionar comportamento customizado
  const result = originalToString.call(this);
  return `[CUSTOMIZADO] ${result}`;
};

console.log(new Date().toString());
// [CUSTOMIZADO] ...
```

## 🔗 Boas Práticas

1. **Prefira adicionar** ao invés de sobrescrever prototype inteiro
2. **Nunca modifique** prototypes nativos (Object, Array, etc.)
3. **Sempre restaure** `constructor` quando sobrescrever
4. **Use com cuidado** - modificações são globais
5. **Documente** modificações de prototype claramente

Modificar prototypes é poderoso mas deve ser usado com responsabilidade. Em código moderno, prefira composição e classes ES6 a modificações dinâmicas de prototype.
