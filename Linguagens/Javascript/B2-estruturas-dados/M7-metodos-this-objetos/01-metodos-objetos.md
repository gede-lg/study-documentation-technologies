# Métodos em Objetos JavaScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Métodos em objetos** representam **funções encapsuladas** dentro de estruturas de dados, implementando o **paradigma de programação orientada a objetos** em JavaScript. Conceitualmente, são **comportamentos** associados a **dados**, criando uma **unidade coesa** que combina **estado** (propriedades) e **comportamento** (métodos).

Em JavaScript, métodos são **propriedades de objetos** cujos valores são **funções**, permitindo que objetos **respondam a mensagens** e **executem ações** específicas. Matematicamente, representam **transformações** que operam sobre o **domínio interno** do objeto, podendo **modificar estado**, **calcular valores** ou **interagir com outros objetos**.

### Contexto Histórico e Motivação

JavaScript foi criado como uma **linguagem multi-paradigma**, incorporando conceitos de **programação funcional**, **imperativa** e **orientada a objetos**. Os métodos em objetos emergiram da necessidade de **organizar código** de forma mais **estruturada** e **reutilizável**, permitindo **encapsulamento** de lógica relacionada.

A **motivação fundamental** foi fornecer:
- **Encapsulamento** de comportamento relacionado aos dados
- **Reutilização** de código através de herança e composição
- **Organização lógica** de funcionalidades
- **Abstração** de complexidades internas
- **Interface consistente** para interação com objetos

### Problema Fundamental que Resolve

Resolve o problema de **organização e estruturação** de código complexo, eliminando **funções globais dispersas** e **dados desconectados**, criando **entidades coesas** que combinam **responsabilidades relacionadas**.

**Antes dos métodos:**
```javascript
// Código desorganizado com funções globais
let saldo = 1000;
let titular = "João Silva";

function depositar(valor) {
  saldo += valor;
  console.log(`Depósito de R$ ${valor}. Saldo: R$ ${saldo}`);
}

function sacar(valor) {
  if (saldo >= valor) {
    saldo -= valor;
    console.log(`Saque de R$ ${valor}. Saldo: R$ ${saldo}`);
  } else {
    console.log("Saldo insuficiente");
  }
}
```

**Com métodos:**
```javascript
const conta = {
  saldo: 1000,
  titular: "João Silva",
  
  depositar(valor) {
    this.saldo += valor;
    console.log(`Depósito de R$ ${valor}. Saldo: R$ ${this.saldo}`);
  },
  
  sacar(valor) {
    if (this.saldo >= valor) {
      this.saldo -= valor;
      console.log(`Saque de R$ ${valor}. Saldo: R$ ${this.saldo}`);
    } else {
      console.log("Saldo insuficiente");
    }
  }
};
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Encapsulamento:** Combinação de dados e comportamentos
2. **Context Binding:** Acesso ao estado interno via `this`
3. **Polimorfismo:** Diferentes implementações de métodos similares
4. **Composição:** Construção de objetos complexos através de métodos
5. **Interface Pública:** Exposição controlada de funcionalidades

### Pilares Fundamentais

- **Coesão:** Métodos relacionados agrupados logicamente
- **Encapsulamento:** Dados e comportamentos unificados
- **Reutilização:** Código organizando para reaproveitamento
- **Manutenibilidade:** Estrutura clara e modificável
- **Abstração:** Complexidade interna oculta

---

## 🧠 Fundamentos Teóricos

### Sintaxes de Definição de Métodos

#### 1. Object Literal Syntax
```javascript
// Sintaxe tradicional com function keyword
const pessoa = {
  nome: "Ana",
  idade: 30,
  
  // Método tradicional
  apresentar: function() {
    return `Olá, sou ${this.nome} e tenho ${this.idade} anos`;
  },
  
  // Method shorthand (ES6+)
  cumprimentar() {
    return `Prazer em conhecê-lo!`;
  },
  
  // Arrow function (cuidado com this!)
  despedir: () => {
    // ❌ this não se refere ao objeto
    return "Tchau!"; // Sem acesso a propriedades do objeto
  }
};

console.log(pessoa.apresentar());  // "Olá, sou Ana e tenho 30 anos"
console.log(pessoa.cumprimentar()); // "Prazer em conhecê-lo!"
console.log(pessoa.despedir());     // "Tchau!"
```

#### 2. Definição Dinâmica de Métodos
```javascript
// Adicionando métodos após criação do objeto
const calculadora = {
  valor: 0
};

// Método simples
calculadora.somar = function(num) {
  this.valor += num;
  return this;
};

// Método com validação
calculadora.dividir = function(num) {
  if (num === 0) {
    throw new Error("Divisão por zero não permitida");
  }
  this.valor /= num;
  return this;
};

// Método com closure para encapsular lógica
calculadora.criarHistorico = function() {
  const operacoes = [];
  
  return {
    registrar: (operacao) => {
      operacoes.push({
        operacao,
        valor: this.valor,
        timestamp: new Date()
      });
    },
    
    obterHistorico: () => [...operacoes],
    
    limpar: () => {
      operacoes.length = 0;
    }
  };
};

// Uso com method chaining
calculadora
  .somar(10)
  .somar(5)
  .dividir(3);

console.log(calculadora.valor); // 5
```

### Padrões Avançados de Definição

#### Métodos Computados (ES6+)
```javascript
const prefixo = "executar";
const sufixos = ["Acao", "Tarefa", "Processo"];

const processador = {
  dados: [],
  
  // Propriedades computadas para métodos
  [prefixo + "Acao"]() {
    console.log("Executando ação...");
    return this.processarDados("acao");
  },
  
  [prefixo + "Tarefa"]() {
    console.log("Executando tarefa...");
    return this.processarDados("tarefa");
  },
  
  // Método auxiliar
  processarDados(tipo) {
    const resultado = {
      tipo,
      timestamp: Date.now(),
      dados: [...this.dados]
    };
    
    this.dados.push(resultado);
    return resultado;
  },
  
  // Método factory para criar métodos dinamicamente
  criarMetodo(nome, logica) {
    this[nome] = function(...args) {
      console.log(`Executando método dinâmico: ${nome}`);
      return logica.apply(this, args);
    };
  }
};

// Criando método dinamicamente
processador.criarMetodo("processoCustomizado", function(config) {
  return {
    config,
    resultado: "Processamento personalizado concluído",
    dados: this.dados.length
  };
});
```

---

## 🔍 Análise Conceitual Profunda

### Tipos de Métodos por Funcionalidade

#### 1. Métodos de Estado (Getters/Setters Implícitos)
```javascript
class ContaBancaria {
  constructor(saldoInicial = 0) {
    this._saldo = saldoInicial;
    this._historico = [];
  }
  
  // Método getter implícito
  obterSaldo() {
    return this._saldo;
  }
  
  // Método getter com formatação
  obterSaldoFormatado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this._saldo);
  }
  
  // Método setter com validação
  definirLimite(limite) {
    if (limite < 0) {
      throw new Error("Limite deve ser positivo");
    }
    
    this._limite = limite;
    return this; // Method chaining
  }
  
  // Método de estado computado
  obterStatus() {
    if (this._saldo < 0) return "DEVEDOR";
    if (this._saldo < 100) return "BAIXO";
    if (this._saldo < 1000) return "NORMAL";
    return "ALTO";
  }
}
```

#### 2. Métodos de Transformação
```javascript
class ProcessadorTexto {
  constructor(texto = "") {
    this.texto = texto;
  }
  
  // Método de transformação simples
  paraMinusculas() {
    this.texto = this.texto.toLowerCase();
    return this;
  }
  
  // Método de transformação complexa
  limparEFormatear() {
    this.texto = this.texto
      .trim()                           // Remove espaços
      .replace(/\s+/g, ' ')            // Normaliza espaços
      .replace(/[^\w\s]/g, '')         // Remove pontuação
      .split(' ')                      // Divide em palavras
      .map(palavra => 
        palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
      )                                // Capitaliza cada palavra
      .join(' ');                      // Reconstrói o texto
    
    return this;
  }
  
  // Método de transformação com configuração
  aplicarTransformacao(config = {}) {
    const {
      maiuscula = false,
      removerAcentos = false,
      limitarPalavras = null,
      prefixo = '',
      sufixo = ''
    } = config;
    
    let resultado = this.texto;
    
    if (removerAcentos) {
      resultado = resultado.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    
    if (maiuscula) {
      resultado = resultado.toUpperCase();
    }
    
    if (limitarPalavras) {
      resultado = resultado.split(' ').slice(0, limitarPalavras).join(' ');
    }
    
    this.texto = prefixo + resultado + sufixo;
    return this;
  }
}
```

#### 3. Métodos de Validação e Verificação
```javascript
class Validador {
  constructor(dados) {
    this.dados = dados;
    this.erros = [];
  }
  
  // Método de validação básica
  validarRequeridos(campos) {
    for (const campo of campos) {
      if (!this.dados[campo] || this.dados[campo].toString().trim() === '') {
        this.erros.push(`Campo '${campo}' é obrigatório`);
      }
    }
    return this;
  }
  
  // Método de validação com regex
  validarFormato(campo, regex, mensagem) {
    if (this.dados[campo] && !regex.test(this.dados[campo])) {
      this.erros.push(mensagem || `Campo '${campo}' tem formato inválido`);
    }
    return this;
  }
  
  // Método de validação customizada
  validarCustomizado(campo, validador, mensagem) {
    if (this.dados[campo] && !validador(this.dados[campo])) {
      this.erros.push(mensagem || `Campo '${campo}' falhou na validação customizada`);
    }
    return this;
  }
  
  // Método de verificação de resultado
  ehValido() {
    return this.erros.length === 0;
  }
  
  // Método para obter relatório
  obterRelatorio() {
    return {
      valido: this.ehValido(),
      erros: [...this.erros],
      totalErros: this.erros.length,
      dadosValidados: { ...this.dados }
    };
  }
}

// Uso
const usuario = {
  nome: "João Silva",
  email: "joao@email.com",
  idade: 25,
  telefone: "(11) 99999-9999"
};

const validador = new Validador(usuario)
  .validarRequeridos(['nome', 'email'])
  .validarFormato('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido')
  .validarCustomizado('idade', idade => idade >= 18, 'Deve ser maior de idade');

console.log(validador.obterRelatorio());
```

### Padrões de Método Chaining

#### Builder Pattern com Métodos
```javascript
class QueryBuilder {
  constructor() {
    this.query = {
      select: [],
      from: null,
      where: [],
      orderBy: [],
      limit: null
    };
  }
  
  // Método para SELECT
  select(...campos) {
    if (campos.length === 0) {
      this.query.select = ['*'];
    } else {
      this.query.select.push(...campos);
    }
    return this;
  }
  
  // Método para FROM
  from(tabela) {
    this.query.from = tabela;
    return this;
  }
  
  // Método para WHERE
  where(condicao, valor = null, operador = '=') {
    if (typeof condicao === 'string' && valor !== null) {
      this.query.where.push(`${condicao} ${operador} '${valor}'`);
    } else if (typeof condicao === 'object') {
      // WHERE com objeto
      Object.entries(condicao).forEach(([campo, val]) => {
        this.query.where.push(`${campo} = '${val}'`);
      });
    }
    return this;
  }
  
  // Método para ORDER BY
  orderBy(campo, direcao = 'ASC') {
    this.query.orderBy.push(`${campo} ${direcao}`);
    return this;
  }
  
  // Método para LIMIT
  limit(quantidade) {
    this.query.limit = quantidade;
    return this;
  }
  
  // Método para construir query final
  build() {
    let sql = `SELECT ${this.query.select.join(', ')}`;
    
    if (this.query.from) {
      sql += ` FROM ${this.query.from}`;
    }
    
    if (this.query.where.length > 0) {
      sql += ` WHERE ${this.query.where.join(' AND ')}`;
    }
    
    if (this.query.orderBy.length > 0) {
      sql += ` ORDER BY ${this.query.orderBy.join(', ')}`;
    }
    
    if (this.query.limit) {
      sql += ` LIMIT ${this.query.limit}`;
    }
    
    return sql;
  }
  
  // Método para reset
  reset() {
    this.query = {
      select: [],
      from: null,
      where: [],
      orderBy: [],
      limit: null
    };
    return this;
  }
}

// Uso fluente
const query = new QueryBuilder()
  .select('nome', 'email', 'idade')
  .from('usuarios')
  .where('ativo', true)
  .where('idade', 18, '>=')
  .orderBy('nome')
  .limit(10)
  .build();

console.log(query);
// "SELECT nome, email, idade FROM usuarios WHERE ativo = 'true' AND idade >= '18' ORDER BY nome LIMIT 10"
```

---

## 🎯 Aplicabilidade e Contextos

### Padrões de Design com Métodos

#### Factory Pattern
```javascript
class VeiculoFactory {
  // Método factory principal
  static criarVeiculo(tipo, configuracao = {}) {
    const fabricantes = {
      carro: () => this.criarCarro(configuracao),
      moto: () => this.criarMoto(configuracao),
      caminhao: () => this.criarCaminhao(configuracao)
    };
    
    const fabricante = fabricantes[tipo.toLowerCase()];
    if (!fabricante) {
      throw new Error(`Tipo de veículo '${tipo}' não suportado`);
    }
    
    return fabricante();
  }
  
  // Métodos auxiliares especializados
  static criarCarro(config) {
    return {
      tipo: 'Carro',
      portas: config.portas || 4,
      combustivel: config.combustivel || 'Gasolina',
      
      // Métodos específicos do carro
      acelerar() {
        console.log(`${this.tipo} acelerando com ${this.combustivel}`);
        return this;
      },
      
      abrirPorta(numero) {
        if (numero > this.portas) {
          console.log(`Porta ${numero} não existe`);
          return this;
        }
        console.log(`Abrindo porta ${numero}`);
        return this;
      },
      
      obterInfo() {
        return {
          tipo: this.tipo,
          portas: this.portas,
          combustivel: this.combustivel
        };
      }
    };
  }
  
  static criarMoto(config) {
    return {
      tipo: 'Moto',
      cilindradas: config.cilindradas || 125,
      
      acelerar() {
        console.log(`${this.tipo} de ${this.cilindradas}cc acelerando`);
        return this;
      },
      
      empinar() {
        console.log("Empinando a moto!");
        return this;
      },
      
      obterInfo() {
        return {
          tipo: this.tipo,
          cilindradas: this.cilindradas
        };
      }
    };
  }
}
```

#### Observer Pattern
```javascript
class EventEmitter {
  constructor() {
    this.eventos = new Map();
  }
  
  // Método para registrar listeners
  on(evento, callback) {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, []);
    }
    this.eventos.get(evento).push(callback);
    return this;
  }
  
  // Método para registrar listener único
  once(evento, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(evento, wrapper);
    };
    
    return this.on(evento, wrapper);
  }
  
  // Método para remover listeners
  off(evento, callback) {
    if (!this.eventos.has(evento)) return this;
    
    const callbacks = this.eventos.get(evento);
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
    
    return this;
  }
  
  // Método para emitir eventos
  emit(evento, ...args) {
    if (!this.eventos.has(evento)) return this;
    
    const callbacks = this.eventos.get(evento);
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Erro no listener do evento '${evento}':`, error);
      }
    });
    
    return this;
  }
  
  // Método para listar eventos
  listenerCount(evento) {
    return this.eventos.has(evento) ? this.eventos.get(evento).length : 0;
  }
  
  // Método para remover todos os listeners
  removeAllListeners(evento) {
    if (evento) {
      this.eventos.delete(evento);
    } else {
      this.eventos.clear();
    }
    return this;
  }
}

// Sistema de notificações usando Observer
class SistemaNotificacao extends EventEmitter {
  constructor() {
    super();
    this.usuarios = new Map();
  }
  
  // Método para adicionar usuário
  adicionarUsuario(id, dados) {
    this.usuarios.set(id, dados);
    this.emit('usuario:adicionado', { id, dados });
    return this;
  }
  
  // Método para enviar notificação
  enviarNotificacao(tipo, mensagem, destinatarios = null) {
    const notificacao = {
      tipo,
      mensagem,
      timestamp: new Date(),
      destinatarios: destinatarios || Array.from(this.usuarios.keys())
    };
    
    this.emit('notificacao:enviada', notificacao);
    return this;
  }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Performance e Memory Overhead

#### Análise de Performance de Métodos
```javascript
function compararApordagemMetodos() {
  // Abordagem 1: Métodos no prototype
  function PessoaPrototype(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }
  
  PessoaPrototype.prototype.cumprimentar = function() {
    return `Olá, sou ${this.nome}`;
  };
  
  // Abordagem 2: Métodos na instância
  function PessoaInstancia(nome, idade) {
    this.nome = nome;
    this.idade = idade;
    this.cumprimentar = function() {
      return `Olá, sou ${this.nome}`;
    };
  }
  
  // Abordagem 3: Object literal
  function criarPessoaLiteral(nome, idade) {
    return {
      nome,
      idade,
      cumprimentar() {
        return `Olá, sou ${this.nome}`;
      }
    };
  }
  
  const quantidadeInstancias = 100000;
  
  // Teste Prototype
  console.time('Prototype Creation');
  const pessoasPrototype = [];
  for (let i = 0; i < quantidadeInstancias; i++) {
    pessoasPrototype.push(new PessoaPrototype(`Pessoa${i}`, 20 + i % 50));
  }
  console.timeEnd('Prototype Creation');
  
  // Teste Instance
  console.time('Instance Creation');
  const pessoasInstancia = [];
  for (let i = 0; i < quantidadeInstancias; i++) {
    pessoasInstancia.push(new PessoaInstancia(`Pessoa${i}`, 20 + i % 50));
  }
  console.timeEnd('Instance Creation');
  
  // Teste Object Literal
  console.time('Literal Creation');
  const pessoasLiteral = [];
  for (let i = 0; i < quantidadeInstancias; i++) {
    pessoasLiteral.push(criarPessoaLiteral(`Pessoa${i}`, 20 + i % 50));
  }
  console.timeEnd('Literal Creation');
  
  // Teste de execução de métodos
  console.time('Prototype Method Calls');
  pessoasPrototype.forEach(p => p.cumprimentar());
  console.timeEnd('Prototype Method Calls');
  
  console.time('Instance Method Calls');
  pessoasInstancia.forEach(p => p.cumprimentar());
  console.timeEnd('Instance Method Calls');
  
  console.time('Literal Method Calls');
  pessoasLiteral.forEach(p => p.cumprimentar());
  console.timeEnd('Literal Method Calls');
}
```

### Problemas Comuns e Soluções

#### Context Binding Issues
```javascript
class ProblemasComuns {
  constructor() {
    this.valor = 42;
    this.callbacks = [];
  }
  
  // ❌ Problema: Perda de contexto em callbacks
  adicionarCallback() {
    setTimeout(this.executarCallback, 1000); // `this` será undefined/window
  }
  
  // ✅ Solução 1: Arrow function
  adicionarCallbackCorreto1() {
    setTimeout(() => this.executarCallback(), 1000);
  }
  
  // ✅ Solução 2: bind()
  adicionarCallbackCorreto2() {
    setTimeout(this.executarCallback.bind(this), 1000);
  }
  
  executarCallback() {
    console.log(`Valor: ${this.valor}`);
  }
  
  // ❌ Problema: Método como callback perde contexto
  registrarEventos() {
    document.addEventListener('click', this.onClick); // Problema!
  }
  
  // ✅ Solução: Sempre fazer bind ou usar arrow function
  registrarEventosCorreto() {
    document.addEventListener('click', this.onClick.bind(this));
    // ou
    document.addEventListener('click', (event) => this.onClick(event));
  }
  
  onClick(event) {
    console.log(`Clique detectado! Valor: ${this.valor}`);
  }
  
  // ✅ Padrão: Arrow functions como propriedades de classe
  onClickArrow = (event) => {
    console.log(`Clique detectado! Valor: ${this.valor}`);
  }
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Conceitos

#### Métodos vs Funções
```javascript
// Demonstração das diferenças conceituais

// 1. Função pura - sem estado
function somar(a, b) {
  return a + b;
}

// 2. Função com closure - estado encapsulado
function criarContador() {
  let count = 0;
  return function() {
    return ++count;
  };
}

// 3. Método - estado compartilhado via this
const contador = {
  count: 0,
  incrementar() {
    return ++this.count;
  },
  resetar() {
    this.count = 0;
    return this;
  }
};

// 4. Método com estado privado (WeakMap)
const Contador = (function() {
  const privateState = new WeakMap();
  
  return class {
    constructor(inicial = 0) {
      privateState.set(this, { count: inicial });
    }
    
    incrementar() {
      const state = privateState.get(this);
      state.count++;
      return state.count;
    }
    
    obterValor() {
      return privateState.get(this).count;
    }
  };
})();
```

#### Herança de Métodos
```javascript
// Sistema de herança com métodos
class Veiculo {
  constructor(marca, modelo) {
    this.marca = marca;
    this.modelo = modelo;
    this.velocidade = 0;
  }
  
  // Método base
  acelerar(incremento = 10) {
    this.velocidade += incremento;
    return this;
  }
  
  // Método virtual (será sobrescrito)
  obterInfo() {
    return `${this.marca} ${this.modelo}`;
  }
  
  // Método template (usa outros métodos)
  executarManobra(tipo) {
    console.log(`Iniciando manobra: ${tipo}`);
    this.acelerar(5);
    console.log(this.obterInfo());
    return this;
  }
}

class Carro extends Veiculo {
  constructor(marca, modelo, portas) {
    super(marca, modelo);
    this.portas = portas;
  }
  
  // Override do método base
  acelerar(incremento = 15) {
    super.acelerar(incremento);
    console.log(`Carro acelerando - Velocidade: ${this.velocidade}km/h`);
    return this;
  }
  
  // Override do método virtual
  obterInfo() {
    return `${super.obterInfo()} (${this.portas} portas)`;
  }
  
  // Método específico
  abrirPorta(numero) {
    if (numero <= this.portas) {
      console.log(`Porta ${numero} aberta`);
    }
    return this;
  }
}

class Moto extends Veiculo {
  constructor(marca, modelo, cilindradas) {
    super(marca, modelo);
    this.cilindradas = cilindradas;
  }
  
  acelerar(incremento = 20) {
    super.acelerar(incremento);
    console.log(`Moto acelerando - Velocidade: ${this.velocidade}km/h`);
    return this;
  }
  
  obterInfo() {
    return `${super.obterInfo()} (${this.cilindradas}cc)`;
  }
  
  empinar() {
    console.log("Empinando!");
    return this;
  }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Tendências Futuras

#### Métodos Privados (ES2022+)
```javascript
class ExemploMetodosPrivados {
  #valorPrivado = 0;
  
  constructor(inicial) {
    this.#valorPrivado = inicial;
    this.#inicializar();
  }
  
  // Método privado
  #inicializar() {
    console.log("Inicializando com valor:", this.#valorPrivado);
  }
  
  // Método privado para validação
  #validarValor(valor) {
    return typeof valor === 'number' && valor >= 0;
  }
  
  // Método público que usa métodos privados
  definirValor(novoValor) {
    if (!this.#validarValor(novoValor)) {
      throw new Error("Valor inválido");
    }
    
    const valorAnterior = this.#valorPrivado;
    this.#valorPrivado = novoValor;
    this.#notificarMudanca(valorAnterior, novoValor);
    
    return this;
  }
  
  #notificarMudanca(anterior, atual) {
    console.log(`Valor alterado: ${anterior} → ${atual}`);
  }
  
  obterValor() {
    return this.#valorPrivado;
  }
}
```

#### Decorators (Proposta Stage 3)
```javascript
// Futuro: Decorators para métodos
class ExemploDecorators {
  @logged
  @cached
  @validate((x) => x > 0)
  calcular(valor) {
    console.log("Executando cálculo complexo...");
    return valor * valor * Math.PI;
  }
  
  @deprecated("Use novoMetodo() instead")
  metodoAntigo() {
    return "Funcionalidade antiga";
  }
  
  @throttle(1000)
  salvar() {
    console.log("Salvando dados...");
  }
}

// Implementação conceitual de decorators
function logged(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args) {
    console.log(`Chamando ${propertyKey} com argumentos:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} retornou:`, result);
    return result;
  };
}

function cached(target, propertyKey, descriptor) {
  const cache = new Map();
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log(`Cache hit para ${propertyKey}`);
      return cache.get(key);
    }
    
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

---

## 📚 Conclusão

**Métodos em objetos** representam um **conceito fundamental** na programação orientada a objetos em JavaScript, fornecendo **encapsulamento**, **organização** e **reutilização** de código.

**Características essenciais:**
- **Encapsulamento**: Combinação de dados e comportamentos
- **Context binding**: Acesso ao estado através de `this`
- **Flexibilidade**: Múltiplas sintaxes de definição
- **Composição**: Base para padrões de design complexos

São indispensáveis para **arquitetura de software**, **padrões de design**, **APIs orientadas a objetos** e **sistemas complexos**. O domínio de métodos é fundamental para **programação orientada a objetos eficaz** e **código bem estruturado**.

O futuro aponta para **métodos privados**, **decorators** e **meta-programação avançada**, expandindo ainda mais as possibilidades de organização e funcionalidade.