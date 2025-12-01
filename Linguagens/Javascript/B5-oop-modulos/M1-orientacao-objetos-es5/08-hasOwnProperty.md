# hasOwnProperty(): Análise Conceitual

## 🎯 Definição

**hasOwnProperty()** é um método de `Object.prototype` que verifica se uma propriedade pertence **diretamente ao objeto** (não herdada via prototype chain).

```javascript
function Pessoa(nome) {
  this.nome = nome;
}

Pessoa.prototype.tipo = 'Humano';

const pessoa = new Pessoa('João');

console.log(pessoa.hasOwnProperty('nome')); // true (própria)
console.log(pessoa.hasOwnProperty('tipo')); // false (herdada)
console.log(pessoa.hasOwnProperty('toString')); // false (herdada de Object.prototype)
```

## 📋 Sintaxe e Uso

```javascript
objeto.hasOwnProperty(propriedade)
// Retorna: true se propriedade existe diretamente no objeto
//          false se herdada ou não existe
```

## 🧠 Casos de Uso

### 1. Filtrar Propriedades Herdadas em Loops

```javascript
const obj = { a: 1, b: 2 };

// for...in itera sobre próprias E herdadas
for (let prop in obj) {
  if (obj.hasOwnProperty(prop)) {
    console.log(`${prop}: ${obj[prop]}`); // Apenas próprias
  }
}
```

### 2. Verificar Existência de Propriedade

```javascript
const config = {
  host: 'localhost',
  port: 3000
};

if (config.hasOwnProperty('timeout')) {
  console.log('Timeout configurado');
} else {
  console.log('Usando timeout padrão');
}
```

### 3. Distinguir undefined de Ausência

```javascript
const obj = { prop: undefined };

console.log(obj.prop); // undefined
console.log(obj.outra); // undefined

// Como distinguir?
console.log(obj.hasOwnProperty('prop')); // true (existe, valor é undefined)
console.log(obj.hasOwnProperty('outra')); // false (não existe)
```

## ⚠️ Considerações

### Objetos sem Prototype

```javascript
const obj = Object.create(null);
obj.prop = 'valor';

// ❌ Não tem hasOwnProperty (sem Object.prototype)
// obj.hasOwnProperty('prop'); // TypeError!

// ✅ Usar call
console.log(Object.prototype.hasOwnProperty.call(obj, 'prop')); // true
```

### Shadowing de hasOwnProperty

```javascript
const obj = {
  hasOwnProperty: function() {
    return 'Sobrescrito!';
  }
};

// ❌ Método sobrescrito
console.log(obj.hasOwnProperty('x')); // 'Sobrescrito!'

// ✅ Usar Object.prototype diretamente
console.log(Object.prototype.hasOwnProperty.call(obj, 'x')); // false
```

## 🔗 Alternativas Modernas

```javascript
// ES2022: Object.hasOwn() (mais seguro)
const obj = { prop: 'valor' };

console.log(Object.hasOwn(obj, 'prop')); // true
console.log(Object.hasOwn(obj, 'toString')); // false
```

**hasOwnProperty()** é essencial para distinguir propriedades próprias de herdadas, especialmente em iterações e verificações de existência.
