# Invocação e Parâmetros de Funções JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Function Invocation** representa os **diferentes padrões** de **chiamada de funções** em JavaScript, enquanto **Parameters** constituem o **sistema de input handling** que define como funções **recebem**, **processam** e **validam dados** passados durante a invocação.

Constituem o **interface contract** entre **caller** e **function**, definindo **data flow**, **argument validation**, **default behavior** e **parameter flexibility** essenciais para **robust function design** e **predictable behavior**.

### Problema Fundamental que Resolve

Resolve a necessidade de **flexible parameter handling** permitindo **default values**, **optional parameters**, **destructuring assignment**, **parameter validation** e **variadic arguments** que são **cruciais** para **maintainable APIs** e **user-friendly function interfaces**.

---

## 📋 Sumário Conceitual

### Invocation Patterns
- **Function Call** - `func()` - invocação direta
- **Method Call** - `obj.method()` - contexto de objeto  
- **Constructor Call** - `new Func()` - criação de instância
- **Apply/Call** - `func.call()` - contexto explícito

### Parameter Types
- **Required Parameters** - obrigatórios para execução
- **Optional Parameters** - com valores padrão
- **Destructured Parameters** - object/array unpacking
- **Rest Parameters** - collection de argumentos variáveis

---

## 🧠 Fundamentos Teóricos

### Function Invocation Mechanisms

#### Análise de Invocation Patterns
```javascript
// Demonstração completa dos padrões de invocação de funções

function demonstrarInvocationPatterns() {
  console.log("=== Function Invocation Patterns ===");
  
  // BASIC FUNCTION CALL
  console.log("=== 1. Basic Function Call ===");
  
  function saudar(nome, prefixo = "Olá") {
    console.log(`${prefixo}, ${nome}!`);
    console.log("Context 'this':", this === globalThis || this === window || this === global);
    return `${prefixo}, ${nome}!`;
  }
  
  // Invocação direta
  const resultado1 = saudar("Maria");
  console.log("Resultado:", resultado1);
  
  // METHOD CALL
  console.log("\n=== 2. Method Call ===");
  
  const pessoa = {
    nome: "João",
    idade: 30,
    
    apresentar: function(formato = "formal") {
      console.log(`Context 'this':`, this === pessoa);
      console.log(`This.nome:`, this.nome);
      
      if (formato === "formal") {
        return `Meu nome é ${this.nome} e tenho ${this.idade} anos.`;
      } else {
        return `Oi! Sou ${this.nome}, ${this.idade} anos.`;
      }
    },
    
    calcularIdadeFutura(anos) {
      console.log(`Em ${anos} anos terei ${this.idade + anos} anos`);
      return this.idade + anos;
    }
  };
  
  // Invocação como método
  const apresentacao = pessoa.apresentar("informal");
  console.log("Apresentação:", apresentacao);
  
  const idadeFutura = pessoa.calcularIdadeFutura(5);
  console.log("Idade futura:", idadeFutura);
  
  // CONSTRUCTOR CALL
  console.log("\n=== 3. Constructor Call ===");
  
  function Veiculo(marca, modelo, ano) {
    console.log("Constructor context 'this':", this instanceof Veiculo);
    
    this.marca = marca;
    this.modelo = modelo;
    this.ano = ano;
    this.quilometragem = 0;
    
    this.dirigir = function(distancia) {
      this.quilometragem += distancia;
      return `Dirigiu ${distancia}km. Total: ${this.quilometragem}km`;
    };
    
    console.log("Veículo criado:", this.marca, this.modelo);
  }
  
  // Invocação com 'new'
  const meuCarro = new Veiculo("Toyota", "Corolla", 2022);
  console.log("Meu carro:", meuCarro);
  console.log("Dirigindo:", meuCarro.dirigir(100));
  
  // CALL/APPLY/BIND INVOCATION
  console.log("\n=== 4. Call/Apply/Bind Invocation ===");
  
  function calcularAreaRetangulo(largura, altura) {
    console.log("Context 'this':", this);
    console.log("Calculando área:", largura, "x", altura);
    return largura * altura;
  }
  
  const calculadora = {
    nome: "Calculadora Geométrica",
    precisao: 2
  };
  
  // .call() - argumentos separados
  const area1 = calcularAreaRetangulo.call(calculadora, 10, 5);
  console.log("Área (call):", area1);
  
  // .apply() - argumentos em array
  const area2 = calcularAreaRetangulo.apply(calculadora, [8, 6]);
  console.log("Área (apply):", area2);
  
  // .bind() - função bound
  const calcularAreaBound = calcularAreaRetangulo.bind(calculadora);
  const area3 = calcularAreaBound(12, 4);
  console.log("Área (bind):", area3);
  
  // IMMEDIATE INVOCATION (IIFE)
  console.log("\n=== 5. Immediate Invocation (IIFE) ===");
  
  const resultado = (function(nome, valor) {
    console.log("IIFE executado com:", nome, valor);
    return {
      processado: nome.toUpperCase(),
      dobrado: valor * 2,
      timestamp: Date.now()
    };
  })("teste", 42);
  
  console.log("Resultado IIFE:", resultado);
  
  // ARROW FUNCTION INVOCATION
  console.log("\n=== 6. Arrow Function Invocation ===");
  
  const objetoComArrow = {
    nome: "Objeto com Arrow",
    
    metodoTradicional: function() {
      console.log("Método tradicional - this:", this.nome);
      
      const arrowInterna = () => {
        console.log("Arrow interna - this:", this.nome); // Herda o this
      };
      
      arrowInterna();
    }
  };
  
  objetoComArrow.metodoTradicional();
  
  // ASYNC FUNCTION INVOCATION
  console.log("\n=== 7. Async Function Invocation ===");
  
  async function operacaoAssincrona(dados) {
    console.log("Iniciando operação assíncrona com:", dados);
    
    // Simular operação assíncrona
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("Operação assíncrona concluída");
    return `Processado: ${dados}`;
  }
  
  // Invocação async (retorna Promise)
  operacaoAssincrona("dados importantes")
    .then(resultado => console.log("Resultado async:", resultado))
    .catch(erro => console.error("Erro async:", erro));
}

demonstrarInvocationPatterns();

// Parameter handling mechanisms
function demonstrarParameterHandling() {
  console.log("\n=== Parameter Handling Mechanisms ===");
  
  // BASIC PARAMETERS
  console.log("=== Basic Parameters ===");
  
  function operacaoBasica(a, b, c) {
    console.log("Parâmetros recebidos:");
    console.log("  a:", a, typeof a);
    console.log("  b:", b, typeof b);
    console.log("  c:", c, typeof c);
    console.log("  Total de argumentos:", arguments.length);
    
    return a + b + (c || 0);
  }
  
  console.log("Chamada com todos os parâmetros:");
  console.log("Resultado:", operacaoBasica(1, 2, 3));
  
  console.log("\nChamada com parâmetros faltando:");
  console.log("Resultado:", operacaoBasica(1, 2));
  
  console.log("\nChamada com parâmetros extras:");
  console.log("Resultado:", operacaoBasica(1, 2, 3, 4, 5));
  
  // DEFAULT PARAMETERS
  console.log("\n=== Default Parameters ===");
  
  function criarPerfil(nome, idade = 18, cidade = "Não informado", ativo = true) {
    console.log("Criando perfil:");
    console.log("  Nome:", nome);
    console.log("  Idade:", idade);
    console.log("  Cidade:", cidade);
    console.log("  Ativo:", ativo);
    
    return {
      nome,
      idade,
      cidade,
      ativo,
      criadoEm: new Date().toISOString()
    };
  }
  
  console.log("Perfil com valores padrão:");
  const perfil1 = criarPerfil("Ana");
  console.log(perfil1);
  
  console.log("\nPerfil com alguns valores customizados:");
  const perfil2 = criarPerfil("Carlos", 25, "São Paulo");
  console.log(perfil2);
  
  // COMPLEX DEFAULT PARAMETERS
  console.log("\n=== Complex Default Parameters ===");
  
  function configurarServico(
    nome,
    opcoes = {},
    callback = () => console.log("Callback padrão executado"),
    configuracao = {
      timeout: 5000,
      retries: 3,
      debug: false
    }
  ) {
    console.log("Configurando serviço:", nome);
    console.log("Opções:", opcoes);
    console.log("Configuração:", configuracao);
    
    callback();
    
    return {
      nome,
      opcoes: { ...opcoes },
      configuracao: { ...configuracao },
      inicializado: true
    };
  }
  
  const servico1 = configurarServico("API Client");
  console.log("Serviço 1:", servico1);
  
  const servico2 = configurarServico(
    "Database", 
    { host: "localhost", port: 5432 },
    () => console.log("DB callback executado"),
    { timeout: 10000, debug: true }
  );
  console.log("Serviço 2:", servico2);
  
  // PARAMETER VALIDATION
  console.log("\n=== Parameter Validation ===");
  
  function validarEProcessar(
    email = (() => { throw new Error("Email é obrigatório"); })(),
    senha = (() => { throw new Error("Senha é obrigatória"); })(),
    opcoes = {}
  ) {
    // Validações
    if (typeof email !== 'string' || !email.includes('@')) {
      throw new Error("Email deve ser uma string válida");
    }
    
    if (typeof senha !== 'string' || senha.length < 8) {
      throw new Error("Senha deve ter pelo menos 8 caracteres");
    }
    
    console.log("Validação passou!");
    console.log("Email:", email);
    console.log("Senha:", "*".repeat(senha.length));
    console.log("Opções:", opcoes);
    
    return { 
      emailValidado: email,
      senhaLength: senha.length,
      opcoes
    };
  }
  
  try {
    const resultado = validarEProcessar("user@example.com", "senha123", { lembrar: true });
    console.log("Resultado validação:", resultado);
  } catch (error) {
    console.error("Erro de validação:", error.message);
  }
  
  // Tentativa com parâmetros inválidos
  try {
    validarEProcessar("email-inválido", "123");
  } catch (error) {
    console.error("Erro esperado:", error.message);
  }
}

demonstrarParameterHandling();
```

### Destructuring Parameters

#### Análise de Object e Array Destructuring
```javascript
// Demonstração completa de destructuring em parâmetros

function demonstrarDestructuring() {
  console.log("\n=== Parameter Destructuring ===");
  
  // OBJECT DESTRUCTURING
  console.log("=== Object Destructuring ===");
  
  function processarUsuario({
    nome,
    idade = 18,
    email,
    endereco: { cidade, estado } = {},
    preferencias = {},
    ...outrosDados
  }) {
    console.log("Dados extraídos:");
    console.log("  Nome:", nome);
    console.log("  Idade:", idade);
    console.log("  Email:", email);
    console.log("  Cidade:", cidade);
    console.log("  Estado:", estado);
    console.log("  Preferências:", preferencias);
    console.log("  Outros dados:", outrosDados);
    
    return {
      nomeCompleto: nome,
      dadosContato: { email, cidade, estado },
      configuracao: { idade, ...preferencias },
      extra: outrosDados
    };
  }
  
  const usuario = {
    nome: "Maria Silva",
    idade: 28,
    email: "maria@example.com",
    endereco: {
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "20000-000"
    },
    preferencias: {
      tema: "dark",
      notificacoes: true
    },
    telefone: "21999999999",
    profissao: "Desenvolvedora"
  };
  
  const processado = processarUsuario(usuario);
  console.log("Resultado processamento:", processado);
  
  // ARRAY DESTRUCTURING
  console.log("\n=== Array Destructuring ===");
  
  function calcularEstatisticas([primeiro, segundo, ...resto]) {
    console.log("Valores recebidos:");
    console.log("  Primeiro:", primeiro);
    console.log("  Segundo:", segundo);
    console.log("  Resto:", resto);
    
    const todos = [primeiro, segundo, ...resto].filter(x => typeof x === 'number');
    
    const soma = todos.reduce((acc, val) => acc + val, 0);
    const media = soma / todos.length;
    const maximo = Math.max(...todos);
    const minimo = Math.min(...todos);
    
    return {
      total: todos.length,
      soma,
      media: Number(media.toFixed(2)),
      maximo,
      minimo,
      valores: todos
    };
  }
  
  const numeros = [10, 20, 30, 40, 50];
  const estatisticas = calcularEstatisticas(numeros);
  console.log("Estatísticas:", estatisticas);
  
  // MIXED DESTRUCTURING
  console.log("\n=== Mixed Destructuring ===");
  
  function processarRequest({
    method = "GET",
    url,
    headers = {},
    params = []
  }, callback = () => {}) {
    console.log("Processando request:");
    console.log("  Method:", method);
    console.log("  URL:", url);
    console.log("  Headers:", headers);
    console.log("  Params:", params);
    
    // Simular processamento
    const response = {
      status: 200,
      data: `${method} request to ${url}`,
      headers: {
        'Content-Type': 'application/json',
        'X-Processed-By': 'JavaScript Function'
      },
      timestamp: Date.now()
    };
    
    callback(null, response);
    return response;
  }
  
  const requestConfig = {
    method: "POST",
    url: "/api/users",
    headers: {
      'Authorization': 'Bearer token123',
      'Content-Type': 'application/json'
    },
    params: ['user', 'admin']
  };
  
  const response = processarRequest(requestConfig, (error, result) => {
    if (error) {
      console.error("Request error:", error);
    } else {
      console.log("Request callback executado:", result.status);
    }
  });
  
  console.log("Response:", response);
  
  // NESTED DESTRUCTURING
  console.log("\n=== Nested Destructuring ===");
  
  function analisarConfig({
    servidor: {
      host = "localhost",
      porta = 3000,
      ssl = false,
      configuracao: { maxConnections = 100, timeout = 30000 } = {}
    } = {},
    database: {
      tipo = "mongodb",
      url,
      opcoes: { poolSize = 10, autoReconnect = true } = {}
    } = {}
  }) {
    console.log("Configuração do servidor:");
    console.log("  Host:", host);
    console.log("  Porta:", porta);
    console.log("  SSL:", ssl);
    console.log("  Max Connections:", maxConnections);
    console.log("  Timeout:", timeout);
    
    console.log("Configuração do database:");
    console.log("  Tipo:", tipo);
    console.log("  URL:", url);
    console.log("  Pool Size:", poolSize);
    console.log("  Auto Reconnect:", autoReconnect);
    
    return {
      servidor: { host, porta, ssl, maxConnections, timeout },
      database: { tipo, url, poolSize, autoReconnect }
    };
  }
  
  const config = {
    servidor: {
      host: "api.example.com",
      porta: 443,
      ssl: true,
      configuracao: {
        maxConnections: 200,
        timeout: 60000
      }
    },
    database: {
      tipo: "postgresql",
      url: "postgresql://localhost:5432/mydb",
      opcoes: {
        poolSize: 20
      }
    }
  };
  
  const configProcessada = analisarConfig(config);
  console.log("Config processada:", configProcessada);
}

demonstrarDestructuring();

// Function signatures e parameter patterns
function demonstrarFunctionSignatures() {
  console.log("\n=== Function Signatures & Patterns ===");
  
  // OVERLOADING SIMULATION
  console.log("=== Function Overloading Simulation ===");
  
  function formatarData(...args) {
    console.log("Arguments recebidos:", args);
    console.log("Número de argumentos:", args.length);
    
    // Simular overloading baseado no número e tipo de argumentos
    if (args.length === 0) {
      return new Date().toLocaleDateString();
    }
    
    if (args.length === 1) {
      if (typeof args[0] === 'string') {
        return new Date(args[0]).toLocaleDateString();
      }
      if (args[0] instanceof Date) {
        return args[0].toLocaleDateString();
      }
      if (typeof args[0] === 'number') {
        return new Date(args[0]).toLocaleDateString();
      }
    }
    
    if (args.length === 2) {
      const [data, formato] = args;
      const dateObj = new Date(data);
      
      if (formato === 'long') {
        return dateObj.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      if (formato === 'short') {
        return dateObj.toLocaleDateString('pt-BR');
      }
    }
    
    if (args.length === 3) {
      const [dia, mes, ano] = args;
      return new Date(ano, mes - 1, dia).toLocaleDateString();
    }
    
    throw new Error("Formato de argumentos não suportado");
  }
  
  console.log("Overloading examples:");
  console.log("  Sem argumentos:", formatarData());
  console.log("  Com string:", formatarData("2023-12-25"));
  console.log("  Com Date:", formatarData(new Date()));
  console.log("  Com formato:", formatarData("2023-12-25", "long"));
  console.log("  Com dia/mês/ano:", formatarData(25, 12, 2023));
  
  // FLUENT INTERFACE PATTERN
  console.log("\n=== Fluent Interface Pattern ===");
  
  function criarQueryBuilder() {
    let query = {
      select: [],
      from: null,
      where: [],
      orderBy: [],
      limit: null
    };
    
    return {
      select(...campos) {
        query.select.push(...campos);
        console.log("SELECT adicionado:", campos);
        return this;
      },
      
      from(tabela) {
        query.from = tabela;
        console.log("FROM definido:", tabela);
        return this;
      },
      
      where(condicao, ...valores) {
        query.where.push({ condicao, valores });
        console.log("WHERE adicionado:", condicao, valores);
        return this;
      },
      
      orderBy(campo, direcao = 'ASC') {
        query.orderBy.push({ campo, direcao });
        console.log("ORDER BY adicionado:", campo, direcao);
        return this;
      },
      
      limit(quantidade) {
        query.limit = quantidade;
        console.log("LIMIT definido:", quantidade);
        return this;
      },
      
      build() {
        console.log("Query construída:", query);
        
        let sql = `SELECT ${query.select.join(', ')} FROM ${query.from}`;
        
        if (query.where.length > 0) {
          sql += ` WHERE ${query.where.map(w => w.condicao).join(' AND ')}`;
        }
        
        if (query.orderBy.length > 0) {
          sql += ` ORDER BY ${query.orderBy.map(o => `${o.campo} ${o.direcao}`).join(', ')}`;
        }
        
        if (query.limit) {
          sql += ` LIMIT ${query.limit}`;
        }
        
        return sql;
      }
    };
  }
  
  const querySQL = criarQueryBuilder()
    .select('nome', 'email', 'idade')
    .from('usuarios')
    .where('idade > ?', 18)
    .where('ativo = ?', true)
    .orderBy('nome', 'ASC')
    .orderBy('idade', 'DESC')
    .limit(10)
    .build();
  
  console.log("SQL gerado:", querySQL);
  
  // CALLBACK PATTERNS
  console.log("\n=== Callback Patterns ===");
  
  function processarArquivo(
    nomeArquivo,
    onSuccess = (result) => console.log("Sucesso:", result),
    onError = (error) => console.error("Erro:", error),
    onProgress = (percent) => console.log("Progresso:", percent + "%")
  ) {
    console.log(`Processando arquivo: ${nomeArquivo}`);
    
    // Simular processamento com callbacks
    setTimeout(() => onProgress(25), 100);
    setTimeout(() => onProgress(50), 200);
    setTimeout(() => onProgress(75), 300);
    setTimeout(() => {
      if (nomeArquivo.includes('.txt')) {
        onSuccess(`Arquivo ${nomeArquivo} processado com sucesso!`);
      } else {
        onError(new Error("Formato de arquivo não suportado"));
      }
    }, 400);
  }
  
  processarArquivo(
    "documento.txt",
    (resultado) => console.log("✅", resultado),
    (erro) => console.log("❌", erro.message),
    (progresso) => console.log("📊", progresso)
  );
  
  // HIGHER-ORDER FUNCTION PARAMETERS
  console.log("\n=== Higher-Order Function Parameters ===");
  
  function criarMiddleware(
    validador = (data) => true,
    transformer = (data) => data,
    logger = (action, data) => console.log(`${action}:`, data)
  ) {
    return function middleware(data) {
      logger("Recebido", data);
      
      if (!validador(data)) {
        logger("Validação falhou", data);
        throw new Error("Dados inválidos");
      }
      
      logger("Validação passou", data);
      
      const resultado = transformer(data);
      logger("Transformado", resultado);
      
      return resultado;
    };
  }
  
  const middlewareUsuario = criarMiddleware(
    (user) => user.nome && user.email,
    (user) => ({
      ...user,
      nome: user.nome.trim().toUpperCase(),
      email: user.email.toLowerCase(),
      id: Date.now()
    }),
    (action, data) => console.log(`[USER MIDDLEWARE] ${action}:`, JSON.stringify(data))
  );
  
  try {
    const resultado = middlewareUsuario({
      nome: "  João Silva  ",
      email: "JOAO@EXAMPLE.COM",
      idade: 30
    });
    console.log("Resultado final:", resultado);
  } catch (error) {
    console.error("Middleware error:", error.message);
  }
}

demonstrarFunctionSignatures();
```

---

## 🎯 Aplicabilidade e Contextos

### Advanced Parameter Patterns

```javascript
// Implementação de padrões avançados de parâmetros

class AdvancedParameterPatterns {
  // Configuration object pattern
  static createConfigurableService({
    name,
    host = 'localhost',
    port = 3000,
    ssl = false,
    auth = {},
    middleware = [],
    plugins = {},
    options = {}
  } = {}) {
    console.log("\n=== Configurable Service Pattern ===");
    
    const defaultAuth = { type: 'none', credentials: null };
    const defaultOptions = { timeout: 30000, retries: 3, debug: false };
    
    const config = {
      name: name || 'Unnamed Service',
      host,
      port,
      ssl,
      auth: { ...defaultAuth, ...auth },
      middleware: [...middleware],
      plugins: { ...plugins },
      options: { ...defaultOptions, ...options }
    };
    
    console.log("Service configured:", config);
    
    return {
      config,
      start() { console.log(`Starting ${config.name}...`); },
      stop() { console.log(`Stopping ${config.name}...`); },
      addMiddleware(fn) { config.middleware.push(fn); },
      configure(newConfig) { Object.assign(config, newConfig); }
    };
  }
  
  // Builder pattern with parameters
  static createParameterBuilder() {
    console.log("\n=== Parameter Builder Pattern ===");
    
    class QueryBuilder {
      constructor() {
        this.params = {
          fields: [],
          conditions: [],
          joins: [],
          sorting: [],
          pagination: null
        };
      }
      
      select(...fields) {
        this.params.fields.push(...fields);
        return this;
      }
      
      where(field, operator = '=', value) {
        // Handle different parameter patterns
        if (arguments.length === 1 && typeof field === 'object') {
          // Object syntax: where({ name: 'John', age: 30 })
          Object.entries(field).forEach(([key, val]) => {
            this.params.conditions.push({ field: key, operator: '=', value: val });
          });
        } else if (arguments.length === 2) {
          // Two args: where('name', 'John')
          this.params.conditions.push({ field, operator: '=', value: operator });
        } else {
          // Three args: where('age', '>', 18)
          this.params.conditions.push({ field, operator, value });
        }
        return this;
      }
      
      join(table, on, type = 'INNER') {
        this.params.joins.push({ table, on, type });
        return this;
      }
      
      orderBy(...args) {
        // Handle multiple patterns:
        // orderBy('name')
        // orderBy('name', 'DESC')
        // orderBy({ name: 'ASC', age: 'DESC' })
        
        if (args.length === 1 && typeof args[0] === 'object') {
          Object.entries(args[0]).forEach(([field, direction]) => {
            this.params.sorting.push({ field, direction });
          });
        } else {
          const [field, direction = 'ASC'] = args;
          this.params.sorting.push({ field, direction });
        }
        return this;
      }
      
      limit(count, offset = 0) {
        this.params.pagination = { count, offset };
        return this;
      }
      
      build() {
        console.log("Built query params:", this.params);
        return { ...this.params };
      }
    }
    
    // Demonstrate usage
    const query1 = new QueryBuilder()
      .select('name', 'email', 'age')
      .where({ active: true, role: 'admin' })
      .where('age', '>', 18)
      .orderBy('name', 'ASC')
      .limit(10, 20)
      .build();
    
    const query2 = new QueryBuilder()
      .select('*')
      .where('status', 'published')
      .join('categories', 'posts.category_id = categories.id')
      .orderBy({ created_at: 'DESC', title: 'ASC' })
      .build();
    
    return { query1, query2 };
  }
  
  // Event emitter with flexible parameters
  static createEventEmitter() {
    console.log("\n=== Event Emitter with Flexible Parameters ===");
    
    class FlexibleEventEmitter {
      constructor() {
        this.events = {};
      }
      
      // Multiple parameter patterns for 'on':
      // on(event, handler)
      // on(eventObj) where eventObj = { event1: handler1, event2: handler2 }
      // on(eventArray) where eventArray = [{ event, handler, options }]
      on(...args) {
        if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
          // Object pattern
          Object.entries(args[0]).forEach(([event, handler]) => {
            this._addListener(event, handler);
          });
        } else if (args.length === 1 && Array.isArray(args[0])) {
          // Array pattern
          args[0].forEach(({ event, handler, options = {} }) => {
            this._addListener(event, handler, options);
          });
        } else {
          // Standard pattern
          const [event, handler, options = {}] = args;
          this._addListener(event, handler, options);
        }
        return this;
      }
      
      _addListener(event, handler, options = {}) {
        if (!this.events[event]) {
          this.events[event] = [];
        }
        this.events[event].push({ handler, options });
        console.log(`Listener added for '${event}'`);
      }
      
      // Flexible emit with variable arguments
      emit(event, ...data) {
        if (!this.events[event]) return false;
        
        this.events[event].forEach(({ handler, options }) => {
          try {
            if (options.once) {
              this.events[event] = this.events[event].filter(l => l.handler !== handler);
            }
            handler(...data);
          } catch (error) {
            console.error(`Error in ${event} handler:`, error);
          }
        });
        
        return true;
      }
    }
    
    const emitter = new FlexibleEventEmitter();
    
    // Different ways to add listeners
    emitter
      .on('user:login', (user) => console.log(`User ${user.name} logged in`))
      .on({
        'user:logout': (user) => console.log(`User ${user.name} logged out`),
        'data:update': (data) => console.log(`Data updated:`, data)
      })
      .on([
        { 
          event: 'system:error', 
          handler: (error) => console.error('System error:', error),
          options: { once: true }
        }
      ]);
    
    // Emit events
    emitter.emit('user:login', { name: 'Alice', id: 1 });
    emitter.emit('user:logout', { name: 'Alice', id: 1 });
    emitter.emit('data:update', { table: 'users', count: 5 });
    emitter.emit('system:error', 'Database connection failed');
    
    return emitter;
  }
  
  // Validation and transformation pipeline
  static createValidationPipeline() {
    console.log("\n=== Validation Pipeline with Parameters ===");
    
    function createValidator({
      rules = {},
      transformers = {},
      errorHandlers = {},
      options = { stopOnFirstError: false, includeWarnings: true }
    } = {}) {
      
      return function validate(data, context = {}) {
        const results = {
          valid: true,
          errors: [],
          warnings: [],
          transformed: { ...data },
          context: { ...context }
        };
        
        // Apply transformations first
        Object.entries(transformers).forEach(([field, transformer]) => {
          if (data.hasOwnProperty(field)) {
            try {
              results.transformed[field] = transformer(data[field], data, context);
            } catch (error) {
              results.errors.push({
                field,
                type: 'transformation',
                message: error.message
              });
            }
          }
        });
        
        // Apply validation rules
        Object.entries(rules).forEach(([field, ruleSet]) => {
          const value = results.transformed[field];
          
          if (Array.isArray(ruleSet)) {
            ruleSet.forEach(rule => {
              const result = rule(value, results.transformed, context);
              if (result !== true) {
                const error = {
                  field,
                  type: 'validation',
                  message: result || `Invalid value for ${field}`
                };
                
                if (rule.severity === 'warning') {
                  results.warnings.push(error);
                } else {
                  results.errors.push(error);
                  results.valid = false;
                  
                  if (options.stopOnFirstError) {
                    return results;
                  }
                }
              }
            });
          }
        });
        
        // Handle errors if handlers are provided
        if (results.errors.length > 0 && Object.keys(errorHandlers).length > 0) {
          results.errors.forEach(error => {
            const handler = errorHandlers[error.field] || errorHandlers.default;
            if (handler) {
              handler(error, results, context);
            }
          });
        }
        
        return results;
      };
    }
    
    // Create validation rules
    const required = (message = 'Field is required') => (value) => {
      return value !== undefined && value !== null && value !== '' ? true : message;
    };
    
    const minLength = (min, message) => (value) => {
      return typeof value === 'string' && value.length >= min ? true : 
        message || `Must be at least ${min} characters`;
    };
    
    const email = (message = 'Invalid email format') => (value) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value) ? true : message;
    };
    
    // Create validator instance
    const userValidator = createValidator({
      rules: {
        name: [required(), minLength(2)],
        email: [required(), email()],
        age: [
          (value) => value >= 18 ? true : 'Must be 18 or older',
          (value) => value <= 100 ? true : 'Age seems unrealistic'
        ]
      },
      
      transformers: {
        name: (value) => value.trim().replace(/\s+/g, ' '),
        email: (value) => value.toLowerCase().trim(),
        age: (value) => parseInt(value, 10)
      },
      
      errorHandlers: {
        email: (error) => console.log(`Email validation failed: ${error.message}`),
        default: (error) => console.log(`Validation error in ${error.field}: ${error.message}`)
      },
      
      options: { stopOnFirstError: false, includeWarnings: true }
    });
    
    // Test validation
    const testData = {
      name: '  John  Doe  ',
      email: '  JOHN@EXAMPLE.COM  ',
      age: '25'
    };
    
    const result = userValidator(testData, { source: 'registration_form' });
    console.log("Validation result:", result);
    
    return { userValidator, result };
  }
}

// Demonstrate advanced patterns
function demonstrarAdvancedPatterns() {
  console.log("=== Advanced Parameter Patterns ===");
  
  const service = AdvancedParameterPatterns.createConfigurableService({
    name: 'API Service',
    port: 8080,
    ssl: true,
    auth: { type: 'jwt', secret: 'my-secret' },
    options: { debug: true }
  });
  
  const queries = AdvancedParameterPatterns.createParameterBuilder();
  const emitter = AdvancedParameterPatterns.createEventEmitter();
  const validator = AdvancedParameterPatterns.createValidationPipeline();
  
  console.log("\n=== Summary ===");
  console.log("Advanced parameter patterns provide:");
  console.log("✅ Flexible API design");
  console.log("✅ Multiple input formats");
  console.log("✅ Default value management");
  console.log("✅ Validation and transformation");
  console.log("✅ Fluent interfaces");
  console.log("✅ Configuration objects");
}

demonstrarAdvancedPatterns();
```

---

## 📚 Conclusão

**Function Invocation** e **Parameters** constituem o **foundation** do **function interface design** em JavaScript, oferecendo **multiple invocation patterns**, **flexible parameter handling** e **advanced argument processing** essenciais para **robust API creation** e **maintainable code architecture**.

**Invocation patterns fundamentais:**

- **Function Call:** Invocação direta com `this` global/undefined
- **Method Call:** Invocação com contexto de objeto
- **Constructor Call:** Instanciação com `new` operator
- **Explicit Context:** `call()`, `apply()`, `bind()` para contexto controlado

**Parameter handling strategies:**

- **Default Parameters:** ES6+ syntax para valores padrão
- **Destructuring:** Object/array unpacking em parâmetros
- **Rest Parameters:** Coleta de argumentos variáveis
- **Validation:** Parameter checking e transformation

**Advanced patterns:**

- **Configuration Objects:** Flexible API com object parameters
- **Builder Patterns:** Fluent interfaces com method chaining
- **Overloading Simulation:** Multiple parameter signatures
- **Pipeline Patterns:** Validation e transformation chains

**Best practices:**

- **Consistent Signatures:** Maintain predictable parameter order
- **Default Values:** Provide reasonable defaults for optional parameters
- **Validation:** Check parameter types e values early
- **Documentation:** Clear parameter documentation com examples

Dominar **function invocation** e **parameter patterns** é **crucial** para **creating maintainable APIs**, **flexible function interfaces** e **robust parameter validation** que são **essential** para **professional JavaScript development** e **scalable application architecture**.