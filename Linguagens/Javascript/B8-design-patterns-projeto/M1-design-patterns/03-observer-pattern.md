# Observer Pattern: Sistema de Notificação e Assinaturas

## 🎯 Definição

**Observer Pattern** (ou Publish-Subscribe) define dependência um-para-muitos entre objetos, onde quando um objeto (subject/observable) muda de estado, todos seus dependentes (observers/subscribers) são notificados e atualizados automaticamente. Promove baixo acoplamento ao permitir comunicação sem que objetos conheçam uns aos outros diretamente.

```javascript
class Observable {
  constructor() {
    this.observers = [];
  }

  inscrever(observer) {
    this.observers.push(observer);
  }

  desinscrever(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notificar(dados) {
    this.observers.forEach(observer => observer.atualizar(dados));
  }
}

// Observers
const observer1 = {
  atualizar(dados) {
    console.log('Observer 1 recebeu:', dados);
  }
};

const observer2 = {
  atualizar(dados) {
    console.log('Observer 2 recebeu:', dados);
  }
};

// Uso
const subject = new Observable();
subject.inscrever(observer1);
subject.inscrever(observer2);

subject.notificar('Nova atualização!');
// 'Observer 1 recebeu: Nova atualização!'
// 'Observer 2 recebeu: Nova atualização!'
```

**Conceito:** Notificação automática de dependentes quando estado muda.

## 📋 Implementações

### Event Emitter Básico

```javascript
class EventEmitter {
  constructor() {
    this.eventos = new Map();
  }

  on(evento, callback) {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, []);
    }
    this.eventos.get(evento).push(callback);

    // Retornar função de desinscrever
    return () => this.off(evento, callback);
  }

  off(evento, callback) {
    if (!this.eventos.has(evento)) return;

    const callbacks = this.eventos.get(evento);
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(evento, ...args) {
    if (!this.eventos.has(evento)) return;

    this.eventos.get(evento).forEach(callback => {
      callback(...args);
    });
  }

  once(evento, callback) {
    const wrappedCallback = (...args) => {
      callback(...args);
      this.off(evento, wrappedCallback);
    };
    this.on(evento, wrappedCallback);
  }
}

// Uso
const emitter = new EventEmitter();

const unsubscribe = emitter.on('dados:atualizados', dados => {
  console.log('Dados atualizados:', dados);
});

emitter.emit('dados:atualizados', { id: 1, nome: 'João' });

// Parar de ouvir
unsubscribe();
```

### Subject com Estado

```javascript
class Subject {
  constructor(valorInicial) {
    this.valor = valorInicial;
    this.observers = [];
  }

  obterValor() {
    return this.valor;
  }

  setValor(novoValor) {
    const valorAnterior = this.valor;
    this.valor = novoValor;
    this.notificar(novoValor, valorAnterior);
  }

  inscrever(observer) {
    this.observers.push(observer);

    // Notificar imediatamente com valor atual
    observer(this.valor);

    // Retornar função de desinscrever
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  notificar(novoValor, valorAnterior) {
    this.observers.forEach(observer => {
      observer(novoValor, valorAnterior);
    });
  }
}

// Uso
const contador = new Subject(0);

const unsubscribe = contador.inscrever((novo, antigo) => {
  console.log(`Contador mudou de ${antigo} para ${novo}`);
});

contador.setValor(1); // 'Contador mudou de 0 para 1'
contador.setValor(2); // 'Contador mudou de 1 para 2'

unsubscribe();
contador.setValor(3); // Não dispara callback
```

### Observable com Filtros

```javascript
class ObservableComFiltros {
  constructor() {
    this.subscricoes = [];
  }

  inscrever(callback, filtro = null) {
    const subscricao = { callback, filtro };
    this.subscricoes.push(subscricao);

    return () => {
      const index = this.subscricoes.indexOf(subscricao);
      if (index > -1) {
        this.subscricoes.splice(index, 1);
      }
    };
  }

  notificar(dados) {
    this.subscricoes.forEach(({ callback, filtro }) => {
      // Aplicar filtro se existir
      if (!filtro || filtro(dados)) {
        callback(dados);
      }
    });
  }
}

// Uso
const observable = new ObservableComFiltros();

// Observer que só recebe números pares
observable.inscrever(
  valor => console.log('Par:', valor),
  valor => valor % 2 === 0
);

// Observer que recebe todos
observable.inscrever(valor => console.log('Todos:', valor));

observable.notificar(1); // Apenas 'Todos: 1'
observable.notificar(2); // 'Par: 2' e 'Todos: 2'
observable.notificar(3); // Apenas 'Todos: 3'
```

## 🧠 Casos de Uso

### Sistema de Notificações de Usuário

```javascript
class GerenciadorNotificacoes {
  constructor() {
    this.listeners = new Map();
  }

  inscrever(usuario, callback) {
    if (!this.listeners.has(usuario)) {
      this.listeners.set(usuario, []);
    }
    this.listeners.get(usuario).push(callback);
  }

  notificar(usuario, mensagem) {
    if (this.listeners.has(usuario)) {
      this.listeners.get(usuario).forEach(callback => {
        callback(mensagem);
      });
    }
  }

  broadcast(mensagem) {
    this.listeners.forEach(callbacks => {
      callbacks.forEach(callback => callback(mensagem));
    });
  }
}

// Uso
const notificacoes = new GerenciadorNotificacoes();

// Usuário 1
notificacoes.inscrever('joao@email.com', msg => {
  console.log('[João] Nova notificação:', msg);
});

// Usuário 2
notificacoes.inscrever('maria@email.com', msg => {
  console.log('[Maria] Nova notificação:', msg);
});

// Notificação específica
notificacoes.notificar('joao@email.com', 'Você tem uma nova mensagem');

// Broadcast para todos
notificacoes.broadcast('Manutenção programada às 22h');
```

### Store Reativo (Estado Global)

```javascript
class Store {
  constructor(estadoInicial = {}) {
    this.estado = estadoInicial;
    this.listeners = new Map();
  }

  getEstado(chave) {
    return this.estado[chave];
  }

  setEstado(chave, valor) {
    const valorAnterior = this.estado[chave];
    this.estado[chave] = valor;

    // Notificar listeners específicos dessa chave
    if (this.listeners.has(chave)) {
      this.listeners.get(chave).forEach(callback => {
        callback(valor, valorAnterior);
      });
    }

    // Notificar listeners globais
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(callback => {
        callback(chave, valor, valorAnterior);
      });
    }
  }

  inscrever(chave, callback) {
    if (!this.listeners.has(chave)) {
      this.listeners.set(chave, []);
    }
    this.listeners.get(chave).push(callback);

    // Retornar desinscrever
    return () => {
      const callbacks = this.listeners.get(chave);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  inscreverGlobal(callback) {
    return this.inscrever('*', callback);
  }
}

// Uso
const store = new Store({ usuario: null, tema: 'claro' });

// Inscrever em chave específica
const unsubscribeUsuario = store.inscrever('usuario', (novo, antigo) => {
  console.log(`Usuário mudou de ${antigo} para ${novo?.nome}`);
});

// Inscrever globalmente
const unsubscribeGlobal = store.inscreverGlobal((chave, novo, antigo) => {
  console.log(`Estado ${chave} mudou:`, { antigo, novo });
});

store.setEstado('usuario', { nome: 'João', id: 123 });
store.setEstado('tema', 'escuro');
```

### Chat em Tempo Real

```javascript
class SalaChat {
  constructor(nome) {
    this.nome = nome;
    this.usuarios = new Set();
    this.mensagens = [];
  }

  entrar(usuario) {
    this.usuarios.add(usuario);
    usuario.entrarSala(this);
    this.broadcast({
      tipo: 'entrada',
      usuario: usuario.nome,
      mensagem: `${usuario.nome} entrou na sala`
    });
  }

  sair(usuario) {
    this.usuarios.delete(usuario);
    usuario.sairSala(this);
    this.broadcast({
      tipo: 'saida',
      usuario: usuario.nome,
      mensagem: `${usuario.nome} saiu da sala`
    });
  }

  enviarMensagem(remetente, texto) {
    const mensagem = {
      tipo: 'mensagem',
      usuario: remetente.nome,
      mensagem: texto,
      timestamp: new Date()
    };

    this.mensagens.push(mensagem);
    this.broadcast(mensagem);
  }

  broadcast(dados) {
    this.usuarios.forEach(usuario => {
      usuario.receberAtualizacao(dados);
    });
  }
}

class Usuario {
  constructor(nome) {
    this.nome = nome;
    this.salas = new Set();
  }

  entrarSala(sala) {
    this.salas.add(sala);
  }

  sairSala(sala) {
    this.salas.delete(sala);
  }

  enviarMensagem(sala, texto) {
    sala.enviarMensagem(this, texto);
  }

  receberAtualizacao(dados) {
    console.log(`[${this.nome}] ${dados.tipo}: ${dados.mensagem}`);
  }
}

// Uso
const sala = new SalaChat('JavaScript');

const joao = new Usuario('João');
const maria = new Usuario('Maria');

sala.entrar(joao);   // '[João] entrada: João entrou na sala'
                     // '[Maria] entrada: João entrou na sala'
sala.entrar(maria);

joao.enviarMensagem(sala, 'Olá pessoal!');
// '[João] mensagem: Olá pessoal!'
// '[Maria] mensagem: Olá pessoal!'
```

### Sistema de Logs com Múltiplos Destinos

```javascript
class Logger {
  constructor() {
    this.appenders = [];
  }

  addAppender(appender) {
    this.appenders.push(appender);
  }

  removeAppender(appender) {
    const index = this.appenders.indexOf(appender);
    if (index > -1) {
      this.appenders.splice(index, 1);
    }
  }

  log(nivel, mensagem) {
    const logEntry = {
      nivel,
      mensagem,
      timestamp: new Date().toISOString()
    };

    this.appenders.forEach(appender => {
      appender.escrever(logEntry);
    });
  }

  info(mensagem) {
    this.log('INFO', mensagem);
  }

  warn(mensagem) {
    this.log('WARN', mensagem);
  }

  error(mensagem) {
    this.log('ERROR', mensagem);
  }
}

// Appenders (Observers)
class ConsoleAppender {
  escrever(logEntry) {
    console.log(`[${logEntry.nivel}] ${logEntry.timestamp}: ${logEntry.mensagem}`);
  }
}

class FileAppender {
  constructor(nomeArquivo) {
    this.nomeArquivo = nomeArquivo;
    this.logs = [];
  }

  escrever(logEntry) {
    this.logs.push(logEntry);
    console.log(`Salvando em ${this.nomeArquivo}:`, logEntry);
  }

  flush() {
    // Salvar logs em arquivo
    console.log(`Flushing ${this.logs.length} logs para ${this.nomeArquivo}`);
    this.logs = [];
  }
}

class RemoteAppender {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  escrever(logEntry) {
    // Enviar para API remota
    console.log(`Enviando log para ${this.apiUrl}:`, logEntry);
    // fetch(this.apiUrl, { method: 'POST', body: JSON.stringify(logEntry) });
  }
}

// Uso
const logger = new Logger();

logger.addAppender(new ConsoleAppender());
logger.addAppender(new FileAppender('app.log'));
logger.addAppender(new RemoteAppender('https://logs.exemplo.com/api'));

logger.info('Aplicação iniciada');
logger.warn('Memória em 80%');
logger.error('Falha ao conectar ao banco');
```

### Sincronização de Componentes UI

```javascript
class ComponenteObservavel {
  constructor() {
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  notificar(dados) {
    this.listeners.forEach(callback => callback(dados));
  }
}

class InputTexto extends ComponenteObservavel {
  constructor(elemento) {
    super();
    this.elemento = elemento;

    elemento.addEventListener('input', () => {
      this.notificar(elemento.value);
    });
  }

  setValue(valor) {
    this.elemento.value = valor;
  }
}

class PreviewTexto {
  constructor(elemento) {
    this.elemento = elemento;
  }

  atualizar(texto) {
    this.elemento.textContent = texto;
  }
}

class ContadorCaracteres {
  constructor(elemento) {
    this.elemento = elemento;
  }

  atualizar(texto) {
    this.elemento.textContent = `${texto.length} caracteres`;
  }
}

// Uso
const input = new InputTexto(document.querySelector('#input'));
const preview = new PreviewTexto(document.querySelector('#preview'));
const contador = new ContadorCaracteres(document.querySelector('#contador'));

// Sincronizar componentes
input.onChange(texto => preview.atualizar(texto));
input.onChange(texto => contador.atualizar(texto));

// Qualquer alteração no input atualiza preview e contador automaticamente
```

## ⚠️ Considerações

### Memory Leaks

```javascript
// ❌ Problema: não desin screver pode causar memory leak
class Component {
  constructor(observable) {
    observable.inscrever(dados => {
      this.processar(dados); // 'this' mantém Component vivo
    });
  }

  processar(dados) {
    // ...
  }
}

// ✅ Solução: sempre desinscrever
class Component {
  constructor(observable) {
    this.unsubscribe = observable.inscrever(dados => {
      this.processar(dados);
    });
  }

  destruir() {
    this.unsubscribe();
  }

  processar(dados) {
    // ...
  }
}
```

### Ordem de Notificação

```javascript
// ⚠️ Ordem de notificação é ordem de inscrição
observable.inscrever(d => console.log('1:', d));
observable.inscrever(d => console.log('2:', d));
observable.inscrever(d => console.log('3:', d));

observable.notificar('teste');
// '1: teste'
// '2: teste'
// '3: teste'

// Se ordem importa, documentar ou usar prioridades
```

### Performance com Muitos Observers

```javascript
// ⚠️ Muitos observers podem degradar performance
// Considerar debounce/throttle

class ObservableComThrottle {
  constructor(delay = 100) {
    this.observers = [];
    this.delay = delay;
    this.timeoutId = null;
    this.dadosPendentes = null;
  }

  inscrever(callback) {
    this.observers.push(callback);
  }

  notificar(dados) {
    this.dadosPendentes = dados;

    if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => {
        this.observers.forEach(obs => obs(this.dadosPendentes));
        this.timeoutId = null;
        this.dadosPendentes = null;
      }, this.delay);
    }
  }
}
```

Observer Pattern é fundamental para arquiteturas reativas e event-driven, permitindo componentes desacoplados se comunicarem através de eventos, essencial para UI frameworks, sistemas de notificação e aplicações em tempo real.
