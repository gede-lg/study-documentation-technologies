# apply e construct Traps: Análise Conceitual

## 🎯 apply Trap

Intercepta **chamadas de função** quando target é uma função.

```javascript
function somar(a, b) {
  return a + b;
}

const proxy = new Proxy(somar, {
  apply(target, thisArg, args) {
    console.log(`Chamando com: ${args}`);

    // Validar argumentos
    if (args.some(arg => typeof arg !== 'number')) {
      throw new TypeError('Argumentos devem ser números');
    }

    return target.apply(thisArg, args);
  }
});

console.log(proxy(5, 3)); // 'Chamando com: 5,3' | 8
// proxy('a', 'b');       // TypeError
```

### Parâmetros

- **target:** Função original
- **thisArg:** Contexto `this` da chamada
- **args:** Array de argumentos

### Uso: Memoização

```javascript
function criarMemoizada(funcao) {
  const cache = new Map();

  return new Proxy(funcao, {
    apply(target, thisArg, args) {
      const chave = JSON.stringify(args);

      if (cache.has(chave)) {
        console.log('Cache hit!');
        return cache.get(chave);
      }

      console.log('Calculando...');
      const resultado = target.apply(thisArg, args);
      cache.set(chave, resultado);

      return resultado;
    }
  });
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const fibMemo = criarMemoizada(fibonacci);

console.log(fibMemo(40)); // 'Calculando...' (lento)
console.log(fibMemo(40)); // 'Cache hit!' (instantâneo)
```

### Uso: Logging de Chamadas

```javascript
function logChamadas(funcao, nome) {
  let contador = 0;

  return new Proxy(funcao, {
    apply(target, thisArg, args) {
      contador++;
      console.log(`[${nome}] Chamada #${contador} com args: ${args}`);

      const inicio = Date.now();
      const resultado = target.apply(thisArg, args);
      const tempo = Date.now() - inicio;

      console.log(`[${nome}] Retornou ${resultado} em ${tempo}ms`);

      return resultado;
    }
  });
}

const processarLog = logChamadas(
  (x, y) => x * y,
  'processar'
);

processarLog(5, 3);
// [processar] Chamada #1 com args: 5,3
// [processar] Retornou 15 em 0ms
```

## 📋 construct Trap

Intercepta **construção** com `new`.

```javascript
class Usuario {
  constructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }
}

const UsuarioProxy = new Proxy(Usuario, {
  construct(target, args) {
    console.log(`Criando usuário com: ${args}`);

    const [nome, idade] = args;

    // Validação
    if (!nome) {
      throw new Error('Nome é obrigatório');
    }

    if (typeof idade !== 'number' || idade < 0) {
      throw new Error('Idade inválida');
    }

    return new target(...args);
  }
});

const user = new UsuarioProxy('João', 30); // OK
// new UsuarioProxy('', 20);               // Error: Nome obrigatório
// new UsuarioProxy('Maria', -5);          // Error: Idade inválida
```

### Parâmetros

- **target:** Função construtora
- **args:** Array de argumentos
- **newTarget:** Construtor que foi chamado originalmente

### Uso: Singleton Pattern

```javascript
function singleton(classe) {
  let instancia = null;

  return new Proxy(classe, {
    construct(target, args) {
      if (!instancia) {
        console.log('Criando instância única...');
        instancia = new target(...args);
      } else {
        console.log('Retornando instância existente...');
      }

      return instancia;
    }
  });
}

class Configuracao {
  constructor(ambiente) {
    this.ambiente = ambiente;
  }
}

const ConfigSingleton = singleton(Configuracao);

const config1 = new ConfigSingleton('producao');
const config2 = new ConfigSingleton('desenvolvimento');

console.log(config1 === config2);     // true (mesma instância)
console.log(config1.ambiente);        // 'producao' (primeira chamada)
```

### Uso: Auto-binding

```javascript
function autobind(classe) {
  return new Proxy(classe, {
    construct(target, args) {
      const instancia = new target(...args);

      // Bind todos os métodos automaticamente
      Object.getOwnPropertyNames(target.prototype).forEach(prop => {
        if (prop !== 'constructor' && typeof instancia[prop] === 'function') {
          instancia[prop] = instancia[prop].bind(instancia);
        }
      });

      return instancia;
    }
  });
}

class Contador {
  constructor() {
    this.valor = 0;
  }

  incrementar() {
    this.valor++;
    console.log(this.valor);
  }
}

const ContadorAutoBind = autobind(Contador);
const contador = new ContadorAutoBind();

const { incrementar } = contador;
incrementar(); // 1 (funciona! método está bound)
```

## ⚠️ Combinando apply e construct

```javascript
function Logger(prefixo) {
  this.prefixo = prefixo;
}

Logger.prototype.log = function(mensagem) {
  console.log(`[${this.prefixo}] ${mensagem}`);
};

const LoggerProxy = new Proxy(Logger, {
  // Interceptar new Logger()
  construct(target, args) {
    console.log(`Construindo Logger com: ${args}`);
    return new target(...args);
  },

  // Interceptar Logger() sem new
  apply(target, thisArg, args) {
    console.log(`Logger chamado sem 'new', redirecionando...`);
    return new target(...args);
  }
});

const log1 = new LoggerProxy('App');  // new explícito
const log2 = LoggerProxy('API');      // sem new (apply intercepta)

log1.log('Mensagem 1');
log2.log('Mensagem 2');
```

apply e construct permitem interceptar invocação e construção de funções, abrindo possibilidades como validação de argumentos, memoização, logging, singletons e autowiring de forma transparente.
