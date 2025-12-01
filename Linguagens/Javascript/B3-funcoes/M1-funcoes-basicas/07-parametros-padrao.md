# Parâmetros Padrão (Default Parameters): Valores de Fallback e Flexibilidade de Interface

## 🎯 Introdução e Definição

### Definição Conceitual

**Parâmetros padrão** (default parameters) no JavaScript são valores **pré-estabelecidos** que são automaticamente atribuídos a parâmetros de função quando os argumentos correspondentes não são fornecidos ou são explicitamente `undefined`. Eles representam uma evolução significativa na expressividade e robustez das interfaces de função, permitindo que desenvolvedores criem **APIs mais intuitivas e resilientes**.

Conceitualmente, default parameters implementam o **padrão de fallback** - eles fornecem valores sensatos quando dados explícitos não estão disponíveis. Isso transforma funções de contratos rígidos em interfaces flexíveis que podem adaptar-se graciosamente a diferentes contextos de uso, mantendo funcionalidade mesmo com informações incompletas.

### Contexto Histórico e Motivação

Antes do ES6 (2015), implementar parâmetros padrão exigia **verificações manuais** verbosas e propensas a erros. A introdução de default parameters foi motivada por:

**1. Developer Experience:** Eliminar boilerplate repetitivo de verificação de parâmetros
**2. Robustness:** Reduzir erros causados por parâmetros `undefined`
**3. API Design:** Facilitar criação de interfaces mais user-friendly
**4. Code Clarity:** Tornar intenções de default values explícitas na assinatura

**Evolução histórica:**
- **ES5 e anteriores:** Verificações manuais com `|| operator` ou condicionais
- **ES6 (2015):** Introdução de syntax nativa para default parameters
- **ES6+:** Expansão para incluir expressões complexas e destructuring

### Problema Fundamental que Resolve

Default parameters resolvem problemas críticos de **interface robusta** e **usabilidade**:

**1. Optional Parameters:** Tornam parâmetros opcionais sem quebrar a interface
**2. Initialization Safety:** Garantem que parâmetros sempre tenham valores válidos
**3. API Flexibility:** Permitem chamadas mais concisas mantendo funcionalidade completa
**4. Error Prevention:** Reduzem `TypeError` causados por `undefined` values
**5. Documentation:** Servem como documentação viva dos valores esperados

### Importância no Ecossistema

Default parameters são **essenciais** para:

- **Library Design:** Criar APIs flexíveis em bibliotecas e frameworks
- **Configuration Objects:** Implementar sistemas de configuração robustos
- **Function Composition:** Facilitar combinação de funções com diferentes assinaturas
- **Backward Compatibility:** Adicionar novos parâmetros sem quebrar código existente
- **User Experience:** Reduzir complexidade cognitiva para usuários de APIs

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Lazy Evaluation:** Default values são avaliados apenas quando necessários
2. **Expression Support:** Podem ser qualquer expressão válida, não apenas literais
3. **Temporal Dead Zone:** Parâmetros anteriores podem ser referenciados em defaults
4. **Undefined Semantics:** Apenas `undefined` (não `null`) dispara default values
5. **Function Signature:** Tornam-se parte da documentação da interface

### Pilares Fundamentais

- **Fallback Mechanism:** Sistema de valores de reserva
- **Runtime Evaluation:** Avaliação durante execução da função
- **Parameter Dependency:** Defaults podem depender de parâmetros anteriores
- **Expression Flexibility:** Suporte a expressões complexas como defaults
- **Backward Compatibility:** Não afetam funções existentes

### Visão Geral das Nuances

- **Evaluation Timing:** Quando e como defaults são avaliados
- **Reference Scope:** Que variáveis defaults podem acessar
- **Type Flexibility:** Defaults podem ter tipos diferentes do esperado
- **Performance Implications:** Custos de avaliação de expressões complexas
- **Debugging Considerations:** Como aparecem em stack traces e debugging

---

## 🧠 Fundamentos Teóricos

### Mecânica de Avaliação

#### Lazy Evaluation Principle

```javascript
function demonstrarLazyEvaluation(
    nome = "Usuário",
    timestamp = new Date().toISOString(), // Avaliado APENAS quando usado
    id = Math.random().toString(36).substr(2, 9)
) {
    console.log("Função executada com:");
    console.log("Nome:", nome);
    console.log("Timestamp:", timestamp);
    console.log("ID:", id);
}

// Primeira chamada - defaults são avaliados
console.log("=== PRIMEIRA CHAMADA ===");
demonstrarLazyEvaluation();

// Segunda chamada - novos defaults são avaliados
console.log("=== SEGUNDA CHAMADA ===");
demonstrarLazyEvaluation();

// Com argumentos - defaults NÃO são avaliados
console.log("=== COM ARGUMENTOS ===");
demonstrarLazyEvaluation("João", "2024-01-01", "custom-id");
```

#### Evaluation Context e Scope

```javascript
// Variáveis do escopo externo são acessíveis
let configuracaoGlobal = {
    tema: 'claro',
    idioma: 'pt-BR'
};

function criarUsuario(
    nome = "Anônimo",
    config = configuracaoGlobal,           // Acessa escopo externo
    timestamp = Date.now(),                // Função global
    id = gerarId()                         // Função definida abaixo
) {
    console.log("Usuário criado:", { nome, config, timestamp, id });
    return { nome, config, timestamp, id };
}

function gerarId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Teste do acesso ao escopo
criarUsuario();
criarUsuario("Maria");
```

### Parameter Dependency Chain

#### Forward Reference Pattern

```javascript
function configurarServico(
    host = "localhost",
    port = 3000,
    protocol = "http",
    baseUrl = `${protocol}://${host}:${port}`,  // Depende dos anteriores
    timeout = 5000,
    retries = 3,
    config = {                                  // Objeto complexo usando anteriores
        baseUrl,
        timeout,
        retries,
        headers: { 'User-Agent': `Cliente-${host}` }
    }
) {
    console.log("Configuração do serviço:");
    console.log("Host:", host);
    console.log("Port:", port);
    console.log("Protocol:", protocol);
    console.log("Base URL:", baseUrl);
    console.log("Config completa:", config);
    
    return config;
}

// Testes da cadeia de dependência
console.log("=== DEFAULT COMPLETO ===");
configurarServico();

console.log("=== SOBRESCREVER APENAS HOST ===");
configurarServico("api.exemplo.com");

console.log("=== SOBRESCREVER HOST E PROTOCOL ===");
configurarServico("api.exemplo.com", 443, "https");
```

#### Complex Expression Defaults

```javascript
// Contador para demonstrar avaliação múltipla
let contadorChamadas = 0;

function exemploExpressaoComplexa(
    // Default simples
    nome = "Usuário",
    
    // Expressão condicional
    nivel = nome === "admin" ? "administrador" : "usuário",
    
    // Função com side effect (demonstração - evite em produção)
    sessaoId = (() => {
        contadorChamadas++;
        return `sessao_${contadorChamadas}_${Date.now()}`;
    })(),
    
    // Array computado
    permissoes = nivel === "administrador" ? 
        ['ler', 'escrever', 'deletar', 'admin'] : 
        ['ler'],
    
    // Objeto baseado em outros parâmetros
    perfil = {
        nome,
        nivel,
        sessaoId,
        permissoes,
        criadoEm: new Date(),
        expiresEm: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    }
) {
    console.log("Perfil criado:", perfil);
    return perfil;
}

console.log("=== USUÁRIO PADRÃO ===");
exemploExpressaoComplexa();

console.log("=== ADMIN ===");
exemploExpressaoComplexa("admin");

console.log("=== CONTADOR DE CHAMADAS ===");
console.log("Total de chamadas:", contadorChamadas);
```

### Undefined vs Null Semantics

#### Comportamento Específico com Undefined

```javascript
function testarSemanticaUndefined(
    parametro1 = "default1",
    parametro2 = "default2",  
    parametro3 = "default3"
) {
    console.log("Parâmetro 1:", parametro1);
    console.log("Parâmetro 2:", parametro2);
    console.log("Parâmetro 3:", parametro3);
}

console.log("=== SEM ARGUMENTOS ===");
testarSemanticaUndefined();

console.log("=== COM UNDEFINED EXPLÍCITO ===");
testarSemanticaUndefined(undefined, undefined, undefined);

console.log("=== COM NULL (NÃO DISPARA DEFAULTS) ===");
testarSemanticaUndefined(null, null, null);

console.log("=== VALORES FALSY MAS NÃO UNDEFINED ===");
testarSemanticaUndefined(0, false, "");

console.log("=== MISTURANDO UNDEFINED E VALORES ===");
testarSemanticaUndefined("valor1", undefined, "valor3");
```

#### Diferenciação Explícita

```javascript
function tratarUndefinedExplicitamente(
    obrigatorio,
    opcional = "valor padrão",
    nullable = null
) {
    // Verificação manual para casos especiais
    if (obrigatorio === undefined) {
        throw new Error("Parâmetro obrigatório não pode ser undefined");
    }
    
    // Opcional usa default normally
    console.log("Opcional:", opcional);
    
    // Nullable aceita null como valor válido
    if (nullable === null) {
        console.log("Nullable: explicitamente null");
    } else if (nullable === undefined) {
        console.log("Nullable: não fornecido (undefined)");
    } else {
        console.log("Nullable:", nullable);
    }
    
    return { obrigatorio, opcional, nullable };
}

// Testes dos diferentes casos
try {
    console.log("=== CASO COMPLETO ===");
    tratarUndefinedExplicitamente("valor", "custom", "not null");
    
    console.log("=== COM NULL EXPLÍCITO ===");
    tratarUndefinedExplicitamente("valor", undefined, null);
    
    console.log("=== PARÂMETRO OBRIGATÓRIO UNDEFINED ===");
    tratarUndefinedExplicitamente(undefined);
} catch (error) {
    console.log("Erro capturado:", error.message);
}
```

---

## 🔍 Análise Conceitual Profunda

### Padrões de Implementação

#### Configuration Object Pattern

```javascript
// Padrão clássico para configurações complexas
function criarConexaoBanco({
    host = 'localhost',
    port = 5432,
    database = 'myapp',
    username = 'user',
    password = '',
    ssl = false,
    timeout = 30000,
    pool = {
        min: 2,
        max: 10,
        idle: 10000
    },
    logging = false
} = {}) {
    // Note o '= {}' no final para default object completo
    
    console.log("Configuração da conexão:");
    console.log(`  Host: ${host}:${port}`);
    console.log(`  Database: ${database}`);
    console.log(`  User: ${username}`);
    console.log(`  SSL: ${ssl ? 'habilitado' : 'desabilitado'}`);
    console.log(`  Timeout: ${timeout}ms`);
    console.log(`  Pool: min=${pool.min}, max=${pool.max}`);
    console.log(`  Logging: ${logging ? 'ativado' : 'desativado'}`);
    
    return {
        connectionString: `postgres://${username}:${password}@${host}:${port}/${database}`,
        options: { ssl, timeout, pool, logging }
    };
}

// Diferentes formas de uso
console.log("=== CONFIGURAÇÃO PADRÃO ===");
criarConexaoBanco();

console.log("=== CONFIGURAÇÃO PERSONALIZADA ===");
criarConexaoBanco({
    host: 'prod-db.empresa.com',
    port: 5432,
    database: 'production',
    username: 'prod_user',
    password: 'secret123',
    ssl: true,
    logging: true
});

console.log("=== CONFIGURAÇÃO PARCIAL ===");
criarConexaoBanco({
    database: 'test_db',
    logging: true
});
```

#### Builder Pattern Enhancement

```javascript
class HttpClientBuilder {
    constructor() {
        this.config = {};
    }
    
    // Métodos com defaults inteligentes
    baseUrl(url = 'http://localhost:3000') {
        this.config.baseUrl = url;
        return this;
    }
    
    timeout(ms = 5000) {
        this.config.timeout = ms;
        return this;
    }
    
    headers(headerObj = {}) {
        this.config.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headerObj
        };
        return this;
    }
    
    auth(type = 'bearer', token = '') {
        if (type === 'bearer' && token) {
            this.config.headers = {
                ...this.config.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        return this;
    }
    
    retries(count = 3, delay = 1000) {
        this.config.retries = { count, delay };
        return this;
    }
    
    build() {
        // Aplicar defaults finais se não configurados
        return {
            baseUrl: this.config.baseUrl || 'http://localhost:3000',
            timeout: this.config.timeout || 5000,
            headers: this.config.headers || { 'Content-Type': 'application/json' },
            retries: this.config.retries || { count: 3, delay: 1000 }
        };
    }
}

// Uso do builder com defaults
const client1 = new HttpClientBuilder()
    .baseUrl('https://api.exemplo.com')
    .timeout(10000)
    .build();

const client2 = new HttpClientBuilder()
    .auth('bearer', 'abc123')
    .headers({ 'X-Custom': 'value' })
    .build();

console.log("Client 1:", client1);
console.log("Client 2:", client2);
```

### Performance e Optimization

#### Evaluation Cost Analysis

```javascript
// Função custosa para demonstrar evaluation timing
function operacaoCustosa(label = "default") {
    console.log(`Executando operação custosa para: ${label}`);
    
    // Simular operação pesada
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.random();
    }
    
    console.log(`Operação custosa finalizada: ${result.toFixed(2)}`);
    return `resultado_${label}_${Date.now()}`;
}

function exemploPerformance(
    param1 = "simples",                    // Literal - barato
    param2 = new Date().toISOString(),     // Constructor - médio custo
    param3 = operacaoCustosa("param3"),    // Função - caro
    param4 = Math.random() > 0.5 ? "A" : "B" // Condicional - barato
) {
    console.log("Parâmetros recebidos:");
    console.log("  Param1:", param1);
    console.log("  Param2:", param2);
    console.log("  Param3:", param3);
    console.log("  Param4:", param4);
}

console.log("=== PRIMEIRA CHAMADA (DEFAULTS CUSTOSOS) ===");
console.time("primeira-chamada");
exemploPerformance();
console.timeEnd("primeira-chamada");

console.log("=== SEGUNDA CHAMADA (SEM DEFAULTS) ===");
console.time("segunda-chamada");
exemploPerformance("custom1", "custom2", "custom3", "custom4");
console.timeEnd("segunda-chamada");
```

#### Optimization Strategies

```javascript
// ❌ Default custoso avaliado sempre
function ineficiente(config = criarConfiguracaoCompleta()) {
    return config;
}

function criarConfiguracaoCompleta() {
    console.log("Criando configuração custosa...");
    return {
        timestamp: Date.now(),
        random: Math.random(),
        // ... muitas outras propriedades
    };
}

// ✅ Lazy evaluation otimizada
function eficiente(config = null) {
    if (config === null) {
        config = criarConfiguracaoCompleta(); // Só cria quando necessário
    }
    return config;
}

// ✅ Ainda melhor - factory pattern
function muitoEficiente(configFactory = criarConfiguracaoCompleta) {
    const config = typeof configFactory === 'function' ? 
        configFactory() : 
        configFactory;
    return config;
}

console.log("=== TESTE DE PERFORMANCE ===");
console.log("Ineficiente (default sempre avaliado):");
console.time("ineficiente");
ineficiente({ custom: true }); // Mesmo com valor customizado, default é avaliado!
console.timeEnd("ineficiente");

console.log("Eficiente (lazy evaluation):");
console.time("eficiente");
eficiente({ custom: true });
console.timeEnd("eficiente");
```

### Destructuring com Defaults

#### Nested Destructuring Defaults

```javascript
function processarUsuarioComplexo({
    // Propriedades básicas com defaults
    nome = "Usuário Anônimo",
    idade = 0,
    
    // Nested object com defaults
    endereco = {
        rua: "",
        cidade: "Não informado",
        cep: "00000-000"
    },
    
    // Destructuring aninhado com defaults individuais
    contato: {
        email = "sem-email@exemplo.com",
        telefone = "Não informado",
        whatsapp = telefone // Default baseado em outro valor
    } = {},
    
    // Array com defaults
    hobbies = ["leitura", "música"],
    
    // Configurações com nested defaults
    config: {
        tema = "claro",
        idioma = "pt-BR",
        notificacoes: {
            email: emailNotif = true,
            push: pushNotif = true,
            sms: smsNotif = false
        } = {}
    } = {}
} = {}) {
    
    console.log("Usuário processado:");
    console.log("Nome:", nome);
    console.log("Idade:", idade);
    console.log("Endereço:", endereco);
    console.log("Contato:", { email, telefone, whatsapp });
    console.log("Hobbies:", hobbies);
    console.log("Configurações:", {
        tema,
        idioma,
        notificacoes: { emailNotif, pushNotif, smsNotif }
    });
    
    return {
        nome, idade, endereco,
        contato: { email, telefone, whatsapp },
        hobbies,
        config: { tema, idioma, notificacoes: { emailNotif, pushNotif, smsNotif } }
    };
}

// Testes com diferentes níveis de dados
console.log("=== OBJETO VAZIO ===");
processarUsuarioComplexo({});

console.log("=== DADOS PARCIAIS ===");
processarUsuarioComplexo({
    nome: "João",
    contato: {
        email: "joao@email.com"
    },
    config: {
        tema: "escuro"
    }
});

console.log("=== DADOS COMPLETOS ===");
processarUsuarioComplexo({
    nome: "Maria",
    idade: 30,
    endereco: {
        rua: "Rua das Flores, 123",
        cidade: "São Paulo",
        cep: "01234-567"
    },
    contato: {
        email: "maria@email.com",
        telefone: "(11) 99999-9999"
    },
    hobbies: ["natação", "culinária", "fotografia"],
    config: {
        tema: "escuro",
        idioma: "en-US",
        notificacoes: {
            email: true,
            push: false,
            sms: true
        }
    }
});
```

---

## 🎯 Aplicabilidade e Contextos

### API Design Patterns

#### Progressive Enhancement Pattern

```javascript
// API que pode ser usada de forma simples ou avançada
class DataProcessor {
    // Método simples com defaults inteligentes
    static process(
        data,
        options = {
            format: 'json',
            validate: true,
            transform: true,
            cache: false
        }
    ) {
        console.log(`Processando dados no formato ${options.format}`);
        
        if (options.validate) {
            console.log("Validando dados...");
        }
        
        if (options.transform) {
            console.log("Transformando dados...");
        }
        
        if (options.cache) {
            console.log("Cache habilitado");
        }
        
        return {
            processed: data,
            format: options.format,
            metadata: {
                validated: options.validate,
                transformed: options.transform,
                cached: options.cache,
                processedAt: new Date()
            }
        };
    }
    
    // Métodos especializados que usam o método base
    static processForAPI(data) {
        return this.process(data, {
            format: 'json',
            validate: true,
            transform: true,
            cache: true
        });
    }
    
    static processForExport(data, format = 'csv') {
        return this.process(data, {
            format: format,
            validate: false,
            transform: true,
            cache: false
        });
    }
}

// Diferentes níveis de uso
const dados = [{ id: 1, nome: 'Teste' }];

console.log("=== USO SIMPLES ===");
DataProcessor.process(dados);

console.log("=== USO PERSONALIZADO ===");
DataProcessor.process(dados, { format: 'xml', cache: true });

console.log("=== MÉTODO ESPECIALIZADO ===");
DataProcessor.processForAPI(dados);
```

#### Plugin System Pattern

```javascript
class PluginSystem {
    constructor() {
        this.plugins = new Map();
    }
    
    // Registro de plugin com configuração flexível
    registerPlugin(
        name,
        plugin,
        options = {
            enabled: true,
            priority: 0,
            autoStart: true,
            dependencies: [],
            config: {}
        }
    ) {
        console.log(`Registrando plugin: ${name}`);
        
        // Validar dependências
        for (const dep of options.dependencies) {
            if (!this.plugins.has(dep)) {
                throw new Error(`Dependência não encontrada: ${dep}`);
            }
        }
        
        this.plugins.set(name, {
            instance: plugin,
            ...options,
            registeredAt: new Date()
        });
        
        if (options.autoStart && options.enabled) {
            this.startPlugin(name);
        }
        
        return this;
    }
    
    // Configuração de plugin com merge inteligente
    configurePlugin(
        name, 
        newConfig = {},
        options = {
            merge: true,
            restart: false,
            validate: true
        }
    ) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            throw new Error(`Plugin não encontrado: ${name}`);
        }
        
        if (options.merge) {
            plugin.config = { ...plugin.config, ...newConfig };
        } else {
            plugin.config = newConfig;
        }
        
        if (options.restart && plugin.enabled) {
            this.restartPlugin(name);
        }
        
        console.log(`Plugin ${name} reconfigurado:`, plugin.config);
        return this;
    }
    
    startPlugin(name) {
        const plugin = this.plugins.get(name);
        if (plugin && plugin.instance.start) {
            plugin.instance.start(plugin.config);
            console.log(`Plugin ${name} iniciado`);
        }
    }
    
    restartPlugin(name) {
        console.log(`Reiniciando plugin: ${name}`);
        const plugin = this.plugins.get(name);
        if (plugin && plugin.instance.stop) {
            plugin.instance.stop();
        }
        this.startPlugin(name);
    }
}

// Exemplo de plugins
const loggerPlugin = {
    start(config) {
        console.log("Logger iniciado com config:", config);
    },
    stop() {
        console.log("Logger parado");
    }
};

const cachePlugin = {
    start(config) {
        console.log("Cache iniciado com config:", config);
    },
    stop() {
        console.log("Cache parado");
    }
};

// Uso do sistema
const system = new PluginSystem();

system.registerPlugin("logger", loggerPlugin);
system.registerPlugin("cache", cachePlugin, {
    priority: 1,
    dependencies: ["logger"],
    config: { ttl: 3600, maxSize: 1000 }
});

system.configurePlugin("cache", { ttl: 7200 });
```

### Functional Programming Integration

#### Currying com Defaults

```javascript
// Função curried com defaults em cada nível
const criarValidador = (
    type = 'string',
    options = { required: true, minLength: 0, maxLength: 255 }
) => (
    value,
    customOptions = {}
) => {
    const finalOptions = { ...options, ...customOptions };
    
    console.log(`Validando ${type} com opções:`, finalOptions);
    
    // Validação básica
    if (finalOptions.required && (value === undefined || value === null)) {
        return { valid: false, error: 'Valor é obrigatório' };
    }
    
    if (type === 'string') {
        if (typeof value !== 'string') {
            return { valid: false, error: 'Valor deve ser string' };
        }
        
        if (value.length < finalOptions.minLength) {
            return { valid: false, error: `Mínimo ${finalOptions.minLength} caracteres` };
        }
        
        if (value.length > finalOptions.maxLength) {
            return { valid: false, error: `Máximo ${finalOptions.maxLength} caracteres` };
        }
    }
    
    return { valid: true, value };
};

// Criação de validadores especializados
const validarNome = criarValidador('string', { minLength: 2, maxLength: 50 });
const validarEmail = criarValidador('string', { minLength: 5, maxLength: 100 });
const validarSenha = criarValidador('string', { minLength: 8, maxLength: 32 });

// Uso dos validadores
console.log("=== VALIDAÇÃO DE NOME ===");
console.log(validarNome("João"));
console.log(validarNome("A")); // Muito curto

console.log("=== VALIDAÇÃO COM OPÇÕES CUSTOMIZADAS ===");
console.log(validarEmail("user@email.com", { minLength: 10 }));
```

#### Composition com Defaults

```javascript
// Funções composáveis com defaults
const pipeline = (...functions) => (initialValue) => {
    return functions.reduce((acc, fn) => fn(acc), initialValue);
};

const transform = (
    transformFn = x => x,
    options = { logInput: false, logOutput: false }
) => (data) => {
    if (options.logInput) {
        console.log("Input:", data);
    }
    
    const result = transformFn(data);
    
    if (options.logOutput) {
        console.log("Output:", result);
    }
    
    return result;
};

const filter = (
    predicate = () => true,
    options = { logFiltered: false }
) => (data) => {
    if (!Array.isArray(data)) {
        throw new Error("Filter expects an array");
    }
    
    const filtered = data.filter(predicate);
    
    if (options.logFiltered) {
        console.log(`Filtered ${data.length} -> ${filtered.length} items`);
    }
    
    return filtered;
};

const sort = (
    compareFn = (a, b) => a > b ? 1 : a < b ? -1 : 0,
    options = { logSort: false }
) => (data) => {
    if (options.logSort) {
        console.log("Sorting data...");
    }
    
    return [...data].sort(compareFn);
};

// Pipeline de processamento de dados
const processUsers = pipeline(
    filter(user => user.active, { logFiltered: true }),
    sort((a, b) => a.name.localeCompare(b.name), { logSort: true }),
    transform(user => ({ ...user, processed: true }), { logOutput: true })
);

// Dados de teste
const users = [
    { id: 3, name: "Charlie", active: false },
    { id: 1, name: "Alice", active: true },
    { id: 2, name: "Bob", active: true }
];

console.log("=== PIPELINE DE PROCESSAMENTO ===");
const result = processUsers(users);
console.log("Resultado final:", result);
```

---

## ⚠️ Limitações e Considerações Teóricas

### Armadilhas Comuns

#### Object Reference Sharing

```javascript
// ❌ PERIGO: Objeto compartilhado entre chamadas
function problemaCompartilhamento(opcoes = { items: [] }) {
    opcoes.items.push(`Item ${Date.now()}`);
    console.log("Opções atuais:", opcoes);
    return opcoes;
}

console.log("=== DEMONSTRAÇÃO DO PROBLEMA ===");
const result1 = problemaCompartilhamento();
const result2 = problemaCompartilhamento();
console.log("Result1 items:", result1.items);
console.log("Result2 items:", result2.items);
console.log("São o mesmo objeto?", result1 === result2);

// ✅ SOLUÇÃO: Factory function
function solucaoFactory(opcoes = null) {
    if (opcoes === null) {
        opcoes = { items: [] }; // Novo objeto a cada chamada
    }
    
    opcoes.items.push(`Item ${Date.now()}`);
    return opcoes;
}

console.log("=== SOLUÇÃO COM FACTORY ===");
const safe1 = solucaoFactory();
const safe2 = solucaoFactory();
console.log("Safe1 items:", safe1.items);
console.log("Safe2 items:", safe2.items);
console.log("São o mesmo objeto?", safe1 === safe2);
```

#### Side Effects em Defaults

```javascript
let globalCounter = 0;

// ❌ PROBLEMA: Side effect em default
function comSideEffect(id = ++globalCounter) {
    console.log(`Processando item ${id}`);
    return { id, processedAt: Date.now() };
}

console.log("=== SIDE EFFECTS EM DEFAULTS ===");
console.log("Global counter inicial:", globalCounter);

// Mesmo não usando o default, ele é avaliado!
comSideEffect(100); // globalCounter é incrementado!
console.log("Counter após chamada com argumento:", globalCounter);

comSideEffect(); // Usa default, incrementa novamente
console.log("Counter após chamada sem argumento:", globalCounter);

// ✅ SOLUÇÃO: Lazy evaluation
function semSideEffect(id = null) {
    if (id === null) {
        id = ++globalCounter;
    }
    
    console.log(`Processando item ${id}`);
    return { id, processedAt: Date.now() };
}

console.log("=== SOLUÇÃO SEM SIDE EFFECTS ===");
const initialCounter = globalCounter;
semSideEffect(200); // Counter não é alterado
console.log("Counter após chamada com argumento:", globalCounter);
console.log("Counter mudou?", globalCounter !== initialCounter);
```

#### Performance com Expressions Complexas

```javascript
// Função custosa para demonstrar
function criarConfigCompleta() {
    console.log("Criando configuração complexa...");
    
    // Simular operação custosa
    const start = Date.now();
    while (Date.now() - start < 100) {} // 100ms de delay
    
    return {
        database: {
            host: 'localhost',
            port: 5432,
            connections: Array.from({ length: 100 }, (_, i) => ({
                id: i,
                created: new Date()
            }))
        },
        cache: new Map(),
        timestamp: Date.now()
    };
}

// ❌ PERFORMANCE PROBLEM: Default custoso sempre avaliado
function funcaoIneficiente(config = criarConfigCompleta()) {
    return { message: "Processado", config };
}

// ✅ SOLUTION: Conditional evaluation
function funcaoEficiente(config = null) {
    if (config === null) {
        config = criarConfigCompleta();
    }
    return { message: "Processado", config };
}

console.log("=== TESTE DE PERFORMANCE ===");

console.time("Ineficiente com argumento");
funcaoIneficiente({ simple: true }); // Default ainda é avaliado!
console.timeEnd("Ineficiente com argumento");

console.time("Eficiente com argumento");
funcaoEficiente({ simple: true }); // Default NÃO é avaliado
console.timeEnd("Eficiente com argumento");
```

### Debugging e Development Experience

#### Stack Trace Considerations

```javascript
// Defaults podem afetar stack traces
function funcaoComDefaultComplexo(
    callback = function defaultCallback(error) {
        console.log("Callback padrão executado");
        if (error) throw error;
        return "resultado padrão";
    }
) {
    console.log("Executando com callback:", callback.name || "anônimo");
    
    try {
        return callback();
    } catch (error) {
        console.log("Erro capturado:", error.message);
        console.log("Stack trace:", error.stack);
        throw error;
    }
}

// Nome da função aparece no stack trace
console.log("=== CALLBACK COM NOME ===");
try {
    funcaoComDefaultComplexo(function namedCallback() {
        throw new Error("Erro no callback nomeado");
    });
} catch (e) {
    console.log("Erro tratado");
}

console.log("=== CALLBACK DEFAULT ===");
try {
    funcaoComDefaultComplexo(); // Usa callback default
} catch (e) {
    console.log("Erro tratado");
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Destructuring

```javascript
// Defaults combinados com destructuring
function processarPedido({
    items = [],
    desconto = 0,
    frete = calcularFrete(items),  // Default baseado em outro parâmetro
    impostos = desconto > 100 ? 0 : calcularImpostos(items, desconto)
} = {}) {
    console.log("Processando pedido:");
    console.log("Items:", items);
    console.log("Desconto:", desconto);
    console.log("Frete:", frete);
    console.log("Impostos:", impostos);
    
    return {
        subtotal: items.reduce((acc, item) => acc + item.preco, 0),
        desconto,
        frete,
        impostos,
        total: 0 // Calcular depois
    };
}

function calcularFrete(items) {
    return items.length * 5;
}

function calcularImpostos(items, desconto) {
    const base = items.reduce((acc, item) => acc + item.preco, 0) - desconto;
    return base * 0.1;
}

// Teste
processarPedido({
    items: [{ nome: "Item 1", preco: 100 }, { nome: "Item 2", preco: 50 }],
    desconto: 20
});
```

### Relação com Arrow Functions

```javascript
// Arrow functions com defaults
const criarUsuario = (
    nome = "Anônimo",
    idade = 0,
    ativo = true
) => ({
    id: Math.random().toString(36).substr(2, 9),
    nome,
    idade,
    ativo,
    criadoEm: new Date()
});

// Currying com arrow functions e defaults
const criarValidadorArrow = (tipo = 'string') => (
    valor,
    obrigatorio = true
) => {
    if (obrigatorio && !valor) {
        return { valido: false, erro: 'Campo obrigatório' };
    }
    
    if (valor && typeof valor !== tipo) {
        return { valido: false, erro: `Esperado ${tipo}` };
    }
    
    return { valido: true, valor };
};

const validarNomeArrow = criarValidadorArrow('string');
console.log(validarNomeArrow("João"));
console.log(validarNomeArrow("", false)); // Não obrigatório
```

### Preparação para Conceitos Avançados

#### Rest Parameters Integration

```javascript
// Combinando defaults com rest parameters
function criarLogger(
    nivel = 'info',
    formato = 'json',
    ...configuracoes
) {
    console.log(`Logger criado - Nível: ${nivel}, Formato: ${formato}`);
    console.log('Configurações extras:', configuracoes);
    
    return {
        nivel,
        formato,
        extras: configuracoes,
        log: function(message) {
            console.log(`[${nivel.toUpperCase()}] ${message}`);
        }
    };
}

const logger1 = criarLogger();
const logger2 = criarLogger('debug', 'text', 'timestamp', 'colors');

logger1.log("Mensagem de teste");
logger2.log("Mensagem de debug");
```

---

## 🚀 Evolução e Próximos Conceitos

### Modern JavaScript Patterns

#### ES2020+ Features Integration

```javascript
// Nullish coalescing com defaults
function configurarApp(
    config = {
        debug: false,
        port: 3000,
        host: 'localhost'
    }
) {
    // Usando nullish coalescing para preservar valores falsy
    const finalConfig = {
        debug: config.debug ?? false,
        port: config.port ?? 3000,
        host: config.host ?? 'localhost',
        // Optional chaining com defaults
        ssl: config.ssl?.enabled ?? false,
        database: {
            host: config.database?.host ?? 'localhost',
            port: config.database?.port ?? 5432
        }
    };
    
    return finalConfig;
}

// Teste
console.log(configurarApp({
    debug: 0,    // Falsy, mas deve ser preservado
    port: null,  // Null, deve usar default
    ssl: { enabled: true }
}));
```

#### Promise Integration

```javascript
// Defaults com promises
async function buscarDados(
    url = '/api/default',
    options = {
        timeout: 5000,
        retries: 3,
        cache: false
    }
) {
    console.log(`Buscando dados de ${url} com opções:`, options);
    
    // Simular fetch
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                url,
                dados: { id: 1, nome: 'Dados default' },
                timestamp: Date.now(),
                options
            });
        }, 100);
    });
}

// Uso com async/await
async function exemplo() {
    const dados1 = await buscarDados();
    const dados2 = await buscarDados('/api/usuarios', { timeout: 10000 });
    
    console.log('Dados 1:', dados1);
    console.log('Dados 2:', dados2);
}

exemplo();
```

### Preparação para Tópicos Avançados

Dominar default parameters prepara para:

- **Rest Parameters:** Sintaxe `...` para argumentos variáveis
- **Spread Operator:** Expansão de arrays/objetos
- **Destructuring:** Extração de valores com defaults
- **Arrow Functions:** Sintaxe concisa com defaults
- **Async Functions:** Defaults em funções assíncronas

---

## 📚 Conclusão

Parâmetros padrão representam uma **evolução fundamental** na expressividade e robustez das interfaces de função JavaScript. Eles transformam contratos rígidos em **APIs flexíveis** que se adaptam graciosamente a diferentes contextos de uso.

**Conceitos Essenciais:**

- **Lazy Evaluation:** Defaults só são avaliados quando necessários
- **Expression Support:** Podem ser qualquer expressão válida
- **Parameter Dependency:** Podem referenciar parâmetros anteriores
- **Undefined Semantics:** Apenas `undefined` dispara defaults
- **Performance Awareness:** Expressões custosas devem ser evitadas

**Aplicações Práticas:**

- **Configuration Objects:** Sistemas flexíveis de configuração
- **API Design:** Interfaces mais intuitivas e robustas
- **Progressive Enhancement:** APIs que crescem sem quebrar compatibilidade
- **Error Prevention:** Redução de erros por parâmetros ausentes

**Importância Estratégica:**

Default parameters são **fundacionais** para:
- Design de bibliotecas e frameworks modernos
- Padrões de programação funcional
- Criação de DSLs (Domain Specific Languages)
- Arquiteturas plugin-based
- APIs resilientes e user-friendly

O domínio de default parameters é **essencial** para progressão em JavaScript moderno, preparando o terreno para conceitos avançados como rest parameters, spread operator, e patterns sofisticados de programação funcional e orientada a objetos.