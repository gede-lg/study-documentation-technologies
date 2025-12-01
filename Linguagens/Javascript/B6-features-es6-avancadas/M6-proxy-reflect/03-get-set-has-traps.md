# get, set, has Traps: Análise Conceitual

## 🎯 get Trap

Intercepta leitura de propriedades.

```javascript
const obj = { nome: 'João', idade: 30 };

const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    console.log(`Lendo: ${prop}`);

    if (!(prop in target)) {
      return `Propriedade '${prop}' não existe`;
    }

    return target[prop];
  }
});

console.log(proxy.nome);     // 'Lendo: nome' | 'João'
console.log(proxy.inexiste); // 'Lendo: inexiste' | "Propriedade 'inexiste' não existe"
```

### Parâmetros

- **target:** Objeto original
- **prop:** Nome da propriedade (string ou symbol)
- **receiver:** Proxy ou objeto que herda dele

### Uso: Valores Computados

```javascript
const pessoa = {
  primeiroNome: 'João',
  sobrenome: 'Silva'
};

const proxy = new Proxy(pessoa, {
  get(target, prop) {
    if (prop === 'nomeCompleto') {
      return `${target.primeiroNome} ${target.sobrenome}`;
    }
    return target[prop];
  }
});

console.log(proxy.nomeCompleto); // 'João Silva'
```

## 📋 set Trap

Intercepta atribuição de propriedades.

```javascript
const validado = new Proxy({}, {
  set(target, prop, valor, receiver) {
    console.log(`Definindo ${prop} = ${valor}`);

    if (prop === 'idade') {
      if (typeof valor !== 'number') {
        throw new TypeError('Idade deve ser número');
      }
      if (valor < 0 || valor > 150) {
        throw new RangeError('Idade inválida');
      }
    }

    target[prop] = valor;
    return true; // Importante!
  }
});

validado.nome = 'Maria'; // OK
validado.idade = 25;     // OK
// validado.idade = -5;  // RangeError
```

### Parâmetros

- **target:** Objeto original
- **prop:** Nome da propriedade
- **valor:** Novo valor
- **receiver:** Proxy ou objeto que herda dele

### Uso: Read-Only

```javascript
function readOnly(obj) {
  return new Proxy(obj, {
    set(target, prop) {
      throw new Error(`Não pode modificar '${String(prop)}'`);
    }
  });
}

const constante = readOnly({ x: 10 });
// constante.x = 20; // Error
```

## 🔍 has Trap

Intercepta operador `in`.

```javascript
const segredos = {
  _senha: '12345',
  _token: 'abc',
  nome: 'João'
};

const proxy = new Proxy(segredos, {
  has(target, prop) {
    // Ocultar propriedades privadas
    if (String(prop).startsWith('_')) {
      return false;
    }
    return prop in target;
  }
});

console.log('nome' in proxy);   // true
console.log('_senha' in proxy); // false (oculta)
console.log('_token' in proxy); // false (oculta)

// Mas ainda acessível diretamente
console.log(proxy._senha); // '12345'
```

### Parâmetros

- **target:** Objeto original
- **prop:** Nome da propriedade

### Uso: Range Object

```javascript
function range(min, max) {
  return new Proxy({}, {
    has(target, prop) {
      const num = Number(prop);
      return num >= min && num <= max;
    }
  });
}

const numeros = range(1, 100);

console.log(50 in numeros);  // true
console.log(150 in numeros); // false
console.log(-5 in numeros);  // false
```

## ⚠️ Combinando Traps

```javascript
const banco = {
  saldo: 1000
};

const conta = new Proxy(banco, {
  get(target, prop) {
    if (prop === 'saldo') {
      console.log('Consultando saldo...');
    }
    return target[prop];
  },

  set(target, prop, valor) {
    if (prop === 'saldo') {
      console.log(`Atualizando saldo: ${valor}`);

      if (valor < 0) {
        throw new Error('Saldo não pode ser negativo');
      }
    }

    target[prop] = valor;
    return true;
  },

  has(target, prop) {
    // Ocultar saldo do operador 'in'
    if (prop === 'saldo') {
      return false;
    }
    return prop in target;
  }
});

console.log(conta.saldo); // 'Consultando saldo...' | 1000
conta.saldo = 2000;       // 'Atualizando saldo: 2000'
console.log('saldo' in conta); // false (oculto)
```

get, set e has são os traps mais usados, formando a tríade fundamental para controlar acesso, modificação e verificação de existência de propriedades em objetos proxy.
