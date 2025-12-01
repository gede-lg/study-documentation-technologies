# Singleton Pattern: Instância Única Global

## 🎯 Definição

**Singleton Pattern** garante que uma classe tenha apenas uma instância em toda a aplicação e fornece um ponto de acesso global a essa instância. Útil para gerenciar recursos compartilhados (configuração, conexões de banco, cache, logger), o padrão previne múltiplas instanciações acidentais e centraliza estado global de forma controlada.

```javascript
class Configuracao {
  constructor() {
    if (Configuracao.instancia) {
      return Configuracao.instancia;
    }

    this.configuracoes = {};
    Configuracao.instancia = this;
  }

  set(chave, valor) {
    this.configuracoes[chave] = valor;
  }

  get(chave) {
    return this.configuracoes[chave];
  }
}

// Sempre retorna a mesma instância
const config1 = new Configuracao();
const config2 = new Configuracao();

console.log(config1 === config2); // true
```

**Conceito:** Garantir única instância de classe com acesso global.

## 📋 Implementações

### Singleton com Classe ES6

```javascript
class Database {
  constructor() {
    if (Database.instancia) {
      return Database.instancia;
    }

    this.conexao = null;
    this.conectado = false;
    Database.instancia = this;
  }

  conectar() {
    if (!this.conectado) {
      this.conexao = criarConexao();
      this.conectado = true;
      console.log('Conectado ao banco');
    }
    return this.conexao;
  }

  desconectar() {
    if (this.conectado) {
      this.conexao.close();
      this.conectado = false;
      console.log('Desconectado do banco');
    }
  }

  static obterInstancia() {
    if (!Database.instancia) {
      Database.instancia = new Database();
    }
    return Database.instancia;
  }
}

// Uso
const db1 = new Database();
const db2 = new Database();
const db3 = Database.obterInstancia();

console.log(db1 === db2); // true
console.log(db2 === db3); // true
```

### Singleton com Closure

```javascript
const Logger = (function() {
  let instancia;

  function criarInstancia() {
    return {
      logs: [],

      log(mensagem) {
        const timestamp = new Date().toISOString();
        this.logs.push({ timestamp, mensagem });
        console.log(`[${timestamp}] ${mensagem}`);
      },

      getLogs() {
        return this.logs;
      },

      limpar() {
        this.logs = [];
      }
    };
  }

  return {
    obterInstancia() {
      if (!instancia) {
        instancia = criarInstancia();
      }
      return instancia;
    }
  };
})();

// Uso
const logger1 = Logger.obterInstancia();
const logger2 = Logger.obterInstancia();

logger1.log('Mensagem 1');
logger2.log('Mensagem 2');

console.log(logger1 === logger2); // true
console.log(logger1.getLogs().length); // 2
```

### Singleton com Object Literal

```javascript
// Forma mais simples: objeto literal (já é singleton)
const ConfiguracaoApp = {
  apiUrl: 'https://api.exemplo.com',
  timeout: 5000,
  debug: false,

  set(chave, valor) {
    this[chave] = valor;
  },

  get(chave) {
    return this[chave];
  }
};

// Sempre o mesmo objeto
export default ConfiguracaoApp;
```

### Singleton com Proxy (Lazy Initialization)

```javascript
class ServicoAPI {
  constructor() {
    this.cache = new Map();
    this.requisicoes = 0;
  }

  async buscar(endpoint) {
    if (this.cache.has(endpoint)) {
      return this.cache.get(endpoint);
    }

    this.requisicoes++;
    const resposta = await fetch(endpoint);
    const dados = await resposta.json();

    this.cache.set(endpoint, dados);
    return dados;
  }

  getEstatisticas() {
    return {
      requisicoes: this.requisicoes,
      cacheSize: this.cache.size
    };
  }
}

// Proxy para lazy initialization
const ServicoAPISingleton = new Proxy(ServicoAPI, {
  instancia: null,

  construct(target, args) {
    if (!this.instancia) {
      this.instancia = new target(...args);
    }
    return this.instancia;
  }
});

// Uso
const api1 = new ServicoAPISingleton();
const api2 = new ServicoAPISingleton();

console.log(api1 === api2); // true
```

## 🧠 Casos de Uso

### Cache Global

```javascript
class Cache {
  constructor() {
    if (Cache.instancia) {
      return Cache.instancia;
    }

    this.armazenamento = new Map();
    this.ttl = 60000; // 1 minuto
    Cache.instancia = this;
  }

  set(chave, valor, ttl = this.ttl) {
    this.armazenamento.set(chave, {
      valor,
      expira: Date.now() + ttl
    });
  }

  get(chave) {
    const entrada = this.armazenamento.get(chave);

    if (!entrada) {
      return null;
    }

    if (Date.now() > entrada.expira) {
      this.armazenamento.delete(chave);
      return null;
    }

    return entrada.valor;
  }

  limpar() {
    this.armazenamento.clear();
  }

  limparExpirados() {
    const agora = Date.now();
    for (const [chave, entrada] of this.armazenamento) {
      if (agora > entrada.expira) {
        this.armazenamento.delete(chave);
      }
    }
  }
}

// Uso global
const cache = new Cache();

// Em qualquer lugar da aplicação
cache.set('usuarios', listaUsuarios);

// Em outro módulo
const usuarios = new Cache().get('usuarios'); // Mesma instância
```

### Gerenciador de Estado Global

```javascript
class Store {
  constructor() {
    if (Store.instancia) {
      return Store.instancia;
    }

    this.estado = {};
    this.listeners = new Map();
    Store.instancia = this;
  }

  getEstado(chave) {
    return this.estado[chave];
  }

  setEstado(chave, valor) {
    const valorAnterior = this.estado[chave];
    this.estado[chave] = valor;

    // Notificar listeners
    if (this.listeners.has(chave)) {
      this.listeners.get(chave).forEach(callback => {
        callback(valor, valorAnterior);
      });
    }
  }

  inscrever(chave, callback) {
    if (!this.listeners.has(chave)) {
      this.listeners.set(chave, new Set());
    }
    this.listeners.get(chave).add(callback);

    // Retornar função de desinscrever
    return () => {
      this.listeners.get(chave).delete(callback);
    };
  }
}

// Uso
const store = new Store();

// Componente 1
store.setEstado('usuario', { nome: 'João' });

// Componente 2
const desinscrever = store.inscrever('usuario', (novoValor, antigoValor) => {
  console.log('Usuário mudou:', novoValor);
});

// Componente 3
const usuario = new Store().getEstado('usuario'); // Mesma instância
```

### Pool de Conexões

```javascript
class ConnectionPool {
  constructor(tamanhoMax = 5) {
    if (ConnectionPool.instancia) {
      return ConnectionPool.instancia;
    }

    this.tamanhoMax = tamanhoMax;
    this.conexoes = [];
    this.conexoesDisponiveis = [];
    this.filaEspera = [];

    ConnectionPool.instancia = this;
  }

  async obterConexao() {
    // Usar conexão disponível
    if (this.conexoesDisponiveis.length > 0) {
      return this.conexoesDisponiveis.pop();
    }

    // Criar nova conexão se abaixo do limite
    if (this.conexoes.length < this.tamanhoMax) {
      const conexao = await criarConexao();
      this.conexoes.push(conexao);
      return conexao;
    }

    // Aguardar conexão disponível
    return new Promise(resolve => {
      this.filaEspera.push(resolve);
    });
  }

  liberarConexao(conexao) {
    // Resolver próximo na fila ou devolver ao pool
    if (this.filaEspera.length > 0) {
      const resolve = this.filaEspera.shift();
      resolve(conexao);
    } else {
      this.conexoesDisponiveis.push(conexao);
    }
  }

  async fecharTodas() {
    await Promise.all(
      this.conexoes.map(con => con.close())
    );
    this.conexoes = [];
    this.conexoesDisponiveis = [];
  }
}

// Uso
const pool = new ConnectionPool(10);

async function executarQuery(sql) {
  const conexao = await pool.obterConexao();
  try {
    const resultado = await conexao.query(sql);
    return resultado;
  } finally {
    pool.liberarConexao(conexao);
  }
}
```

### Sistema de Eventos Global

```javascript
class EventBus {
  constructor() {
    if (EventBus.instancia) {
      return EventBus.instancia;
    }

    this.eventos = new Map();
    EventBus.instancia = this;
  }

  on(evento, handler) {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, new Set());
    }
    this.eventos.get(evento).add(handler);

    return () => this.off(evento, handler);
  }

  off(evento, handler) {
    if (this.eventos.has(evento)) {
      this.eventos.get(evento).delete(handler);
    }
  }

  emit(evento, dados) {
    if (this.eventos.has(evento)) {
      this.eventos.get(evento).forEach(handler => {
        handler(dados);
      });
    }
  }

  once(evento, handler) {
    const wrappedHandler = dados => {
      handler(dados);
      this.off(evento, wrappedHandler);
    };
    this.on(evento, wrappedHandler);
  }
}

// Uso global
const bus = new EventBus();

// Módulo 1
bus.on('usuario:login', usuario => {
  console.log('Usuário logou:', usuario.nome);
});

// Módulo 2
bus.emit('usuario:login', { nome: 'João', id: 123 });
```

## ⚠️ Desvantagens e Considerações

### Acoplamento Global

```javascript
// ❌ Problema: código acoplado ao singleton
class ServicoUsuarios {
  obterUsuario(id) {
    const db = Database.obterInstancia(); // Acoplamento
    return db.query(`SELECT * FROM usuarios WHERE id = ${id}`);
  }
}

// ✅ Melhor: injeção de dependência
class ServicoUsuarios {
  constructor(database) {
    this.database = database; // Dependência injetada
  }

  obterUsuario(id) {
    return this.database.query(`SELECT * FROM usuarios WHERE id = ${id}`);
  }
}

// Uso
const db = Database.obterInstancia();
const servico = new ServicoUsuarios(db);
```

### Dificuldade em Testes

```javascript
// ❌ Difícil testar: singleton persiste entre testes
test('teste 1', () => {
  const cache = Cache.obterInstancia();
  cache.set('chave', 'valor1');
  // ...
});

test('teste 2', () => {
  const cache = Cache.obterInstancia();
  // cache ainda tem dados do teste anterior!
  expect(cache.get('chave')).toBe(null); // Falha
});

// ✅ Solução: adicionar método de reset
class Cache {
  // ...

  static reset() {
    Cache.instancia = null;
  }
}

// Nos testes
afterEach(() => {
  Cache.reset();
});
```

### Estado Mutável Global

```javascript
// ⚠️ Singleton com estado mutável pode causar bugs sutis
const config = Configuracao.obterInstancia();
config.set('modo', 'producao');

// Em outro módulo (modificação não intencional)
const config2 = Configuracao.obterInstancia();
config2.set('modo', 'debug'); // Afeta toda aplicação!

// ✅ Considerar imutabilidade
class ConfiguracaoImutavel {
  constructor() {
    if (ConfiguracaoImutavel.instancia) {
      return ConfiguracaoImutavel.instancia;
    }

    this._config = Object.freeze({
      apiUrl: 'https://api.com',
      timeout: 5000
    });

    ConfiguracaoImutavel.instancia = this;
  }

  get(chave) {
    return this._config[chave];
  }

  // Não permite set() - imutável
}
```

### Módulos ES6 como Alternativa

```javascript
// Módulos ES6 já são singletons naturalmente
// config.js
const configuracao = {
  apiUrl: 'https://api.com',
  timeout: 5000
};

export default configuracao;

// Em qualquer módulo que importar, sempre mesmo objeto
import config from './config.js';
```

## 🚀 Singleton Moderno

### Singleton com WeakMap (Privacidade)

```javascript
const instancias = new WeakMap();

class Logger {
  constructor() {
    if (instancias.has(Logger)) {
      return instancias.get(Logger);
    }

    const privado = {
      logs: [],
      nivel: 'info'
    };

    instancias.set(Logger, this);
    instancias.set(this, privado);
  }

  log(mensagem, nivel = 'info') {
    const privado = instancias.get(this);
    privado.logs.push({ mensagem, nivel, timestamp: Date.now() });
    console.log(`[${nivel.toUpperCase()}] ${mensagem}`);
  }

  getLogs() {
    const privado = instancias.get(this);
    return [...privado.logs]; // Cópia
  }
}
```

### Singleton com Symbol (Prevenir Acesso Direto)

```javascript
const CHAVE_SINGLETON = Symbol('singleton');

class Aplicacao {
  constructor(chave) {
    if (chave !== CHAVE_SINGLETON) {
      throw new Error('Use Aplicacao.obterInstancia()');
    }

    this.inicializada = false;
  }

  static obterInstancia() {
    if (!this[CHAVE_SINGLETON]) {
      this[CHAVE_SINGLETON] = new Aplicacao(CHAVE_SINGLETON);
    }
    return this[CHAVE_SINGLETON];
  }

  inicializar() {
    if (!this.inicializada) {
      console.log('Inicializando aplicação...');
      this.inicializada = true;
    }
  }
}

// ❌ Erro: não pode criar diretamente
// const app = new Aplicacao(); // Throw Error

// ✅ Correto
const app = Aplicacao.obterInstancia();
```

Singleton é um dos padrões mais reconhecidos mas também controversos: útil para recursos verdadeiramente globais e únicos, mas pode introduzir acoplamento e dificultar testes. Use com parcimônia e considere alternativas como injeção de dependência e módulos ES6.
