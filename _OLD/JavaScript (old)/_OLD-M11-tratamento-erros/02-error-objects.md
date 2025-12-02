# A Fenomenologia dos Error Objects: Anatomia Estrutural das Manifestações de Falha

## 🎯 Introdução Conceitual: A Materialização do Erro em Objeto

### Definição Ontológica: Error Objects como Entidades Informacionais

**Error Objects** em JavaScript representam **encapsulamento estruturado** das **informações** sobre **falhas** que **ocorrem** durante **execução**. Mais que **simples mensagens**, constituem **entidades complexas** que **carregam** **contexto**, **tipagem**, **stack traces** e **metadados** essenciais para **compreensão** e **resolução** de **problemas**. São **materialização** da **fenomenologia** do **erro**: **transformam** **eventos abstratos** de **falha** em **objetos concretos** **manipuláveis**.

Cada **Error Object** **encarna** uma **"narrativa** da **falha"** - **conta história** de **o que** **aconteceu**, **onde** **aconteceu**, **quando** **aconteceu** e **por que** **aconteceu**. Esta **narrativa** é **estruturada** através de **propriedades específicas** que **seguem** **padrões ontológicos** **estabelecidos** pela **linguagem**.

A **arquitetura** dos **Error Objects** **reflete** **epistemologia** do **debugging**: **informação suficiente** para **reconstruir** **contexto** da **falha** e **permitir** **diagnóstico** **preciso**.

### Arqueologia Conceptual: Das Exceções Primitivas aos Objetos Estruturados

#### Fundamentos Filosóficos: Estrutura e Informação

**Immanuel Kant** (1724-1804) **distinguiu** entre **fenômeno** (**aparência**) e **noúmeno** (**coisa-em-si**). **Error Objects** **funcionam** como **fenômenos** que **representam** **noúmenos** das **falhas**: **não são** as **falhas** **em si**, mas suas **manifestações estruturadas** **acessíveis** ao **conhecimento**.

**Edmund Husserl** (1859-1938) **desenvolveu** **fenomenologia** como **método** de **estudar** **estruturas** da **experiência**. **Error Objects** **implementam** **fenomenologia aplicada**: **cada propriedade** (**name**, **message**, **stack**) **representa** **aspecto específico** da **"experiência** do **erro"**.

**Ludwig Wittgenstein** (1889-1951) **explorou** **relação** entre **linguagem** e **significado**. **Error Objects** **são** **"jogos** de **linguagem"** **especializados**: **vocabulário estruturado** para **comunicar** **falhas** entre **sistema** e **desenvolvedor**.

#### Tradições Computacionais: Evolução dos Mecanismos de Erro

**LISP** (1958) **introduziu** conceito de **exceções** como **objetos de primeira classe**
**Smalltalk** (1972) **formalizou** **hierarquia** de **classes** de **exceção**
**Java** (1995) **estabeleceu** **padrão** de **checked** vs **unchecked exceptions**
**JavaScript** **herdou** e **adaptou** esses **conceitos** para **ambiente dinâmico**

#### Manifestações Pré-Computacionais: Protocolos Estruturados de Falha

**Medicina Diagnóstica:**

```
PRONTUÁRIO DE ERRO (análogo a Error Object):
- Tipo: Infecção respiratória (name)
- Descrição: Pneumonia bacteriana adquirida (message) 
- Localização: Pulmão direito, lobo inferior (stack trace)
- Código: CID-10 J15.9 (código específico)
- Contexto: Paciente imunossuprimido (propriedades adicionais)
```

**Controle de Qualidade Industrial:**

```
RELATÓRIO DE DEFEITO:
- Categoria: Falha mecânica (error type)
- Especificação: Rolamento desgastado (message)
- Rastreabilidade: Linha 3 > Setor B > Máquina 7 (stack)
- Lote: 20241101-A34 (metadata)
- Impacto: Produção interrompida (severity)
```

#### Formalização em JavaScript: Hierarquia e Estrutura

**JavaScript** **estabeleceu** **hierarquia** de **Error Objects** **baseada** em **herança prototípica**:

```javascript
Error                    // Classe base
├── EvalError           // Erros de eval()
├── RangeError          // Valores fora de intervalo válido
├── ReferenceError      // Referências inválidas
├── SyntaxError         // Problemas de sintaxe
├── TypeError           // Operações incompatíveis com tipo
├── URIError            // Problemas de codificação URI
└── AggregateError      // Múltiplos erros agrupados (ES2021)
```

### O Problema Ontológico: Informação vs Ruído

**Error Objects** **resolvem** o **problema fundamental** de **comunicar** **contexto** de **falha** **sem** **sobrecarregar** com **informações** **irrelevantes**. **Cada propriedade** **representa** **equilíbrio** entre **completude informacional** e **usabilidade prática**.

#### Propriedades Fundamentais Universais

**name**: **Classificação ontológica** do **tipo** de **erro**
**message**: **Descrição semântica** da **falha específica**  
**stack**: **Contexto temporal** e **espacial** da **ocorrência**

#### Propriedades Específicas por Tipo

```javascript
// RangeError: informações sobre limites
const rangeErr = new RangeError('Array length must be finite');
rangeErr.name;     // 'RangeError'
rangeErr.message;  // 'Array length must be finite'

// TypeError: informações sobre incompatibilidade de tipos
const typeErr = new TypeError('Cannot read property of undefined');
typeErr.name;     // 'TypeError'  
typeErr.message;  // 'Cannot read property of undefined'

// Custom Error: propriedades estendidas
class ValidationError extends Error {
    constructor(message, field, value) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
        this.timestamp = new Date().toISOString();
    }
}
```

## 📋 Arquitetura Conceitual: Anatomia Estrutural do Error Object

### Propriedade 'name': Taxonomia Ontológica

A propriedade **name** **estabelece** **categoria ontológica** do **erro** - **define** **"que tipo** de **falha"** **ocorreu** em **nível classificatório**.

```javascript
// Demonstração da hierarquia de names

// Error base - tipo genérico
const erro = new Error('Algo deu errado');
console.log(erro.name); // 'Error'

// ReferenceError - referência inválida
try {
    console.log(variavelInexistente);
} catch (error) {
    console.log(error.name); // 'ReferenceError'
}

// TypeError - incompatibilidade de tipos
try {
    null.propriedade;
} catch (error) {
    console.log(error.name); // 'TypeError'
}

// RangeError - valor fora de limites
try {
    new Array(-1);
} catch (error) {
    console.log(error.name); // 'RangeError'
}

// SyntaxError - estrutura inválida
try {
    eval('function malformada( {');
} catch (error) {
    console.log(error.name); // 'SyntaxError'
}

// Erros customizados - taxonomia específica
class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
```

**Função Ontológica do Name:**
- **Categorização**: **Permite** **classificação** **automática** de **tipos** de **erro**
- **Routing**: **Facilita** **direcionamento** para **handlers específicos**
- **Debugging**: **Oferece** **contexto** **imediato** sobre **natureza** da **falha**
- **Logging**: **Permite** **agregação** e **análise** **estatística** por **tipo**

### Propriedade 'message': Narrativa Semântica

A propriedade **message** **contém** **descrição textual** **específica** da **falha** - **explica** **"o que exatamente** **deu errado"** em **linguagem humana**.

```javascript
// Análise de messages por contexto

// Messages de ReferenceError - identificam variável específica
function exemploReference() {
    try {
        console.log(variavelNaoDeclarada);
    } catch (error) {
        console.log(error.message); // 'variavelNaoDeclarada is not defined'
        
        // Message contém informação específica sobre qual variável
        const variavel = error.message.split(' ')[0];
        console.log(`Variável problemática: ${variavel}`);
    }
}

// Messages de TypeError - descrevem operação incompatível
function exemploType() {
    try {
        const nulo = null;
        nulo.metodo();
    } catch (error) {
        console.log(error.message); // 'Cannot read property 'metodo' of null'
        
        // Message explica tanto a operação quanto o valor problemático
        if (error.message.includes('null')) {
            console.log('Problema: tentativa de acessar propriedade de null');
        }
    }
}

// Messages customizadas - contexto específico da aplicação
class BusinessLogicError extends Error {
    constructor(operation, details) {
        const message = `Falha na operação '${operation}': ${details}`;
        super(message);
        this.name = 'BusinessLogicError';
        this.operation = operation;
        this.details = details;
    }
}

function processarPedido(pedido) {
    if (!pedido.items || pedido.items.length === 0) {
        throw new BusinessLogicError(
            'processar_pedido',
            'Pedido deve conter pelo menos um item'
        );
    }
    
    if (pedido.valor < 0) {
        throw new BusinessLogicError(
            'processar_pedido', 
            `Valor do pedido não pode ser negativo: ${pedido.valor}`
        );
    }
}
```

**Arquitetura da Message:**
- **Específica**: **Descreve** **instância particular** da **falha**
- **Humana**: **Legível** para **desenvolvedores**
- **Contextual**: **Inclui** **valores** e **identificadores relevantes**
- **Actionable**: **Fornece** **pistas** para **resolução**

### Propriedade 'stack': Fenomenologia do Contexto de Execução

A propriedade **stack** **revela** **"arqueologia** da **execução"** - **sequência** de **chamadas** de **função** que **levaram** ao **erro**.

```javascript
// Análise da stack trace

function nivel1() {
    nivel2();
}

function nivel2() {
    nivel3();
}

function nivel3() {
    throw new Error('Falha no nível mais profundo');
}

try {
    nivel1();
} catch (error) {
    console.log(error.stack);
    /*
    Error: Falha no nível mais profundo
        at nivel3 (arquivo.js:linha:coluna)
        at nivel2 (arquivo.js:linha:coluna)  
        at nivel1 (arquivo.js:linha:coluna)
        at Object.<anonymous> (arquivo.js:linha:coluna)
    */
    
    // Stack permite reconstruir caminho da execução
    const stackLines = error.stack.split('\n');
    stackLines.forEach((line, index) => {
        if (line.includes('at ')) {
            const funcName = line.trim().split(' ')[1];
            console.log(`Nível ${index}: ${funcName}`);
        }
    });
}

// Stack traces em contextos assíncronos
async function operacaoAssincrona() {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error('Erro em contexto assíncrono');
}

async function chamarAssincrono() {
    try {
        await operacaoAssincrona();
    } catch (error) {
        console.log(error.stack);
        // Stack trace preserva contexto assíncrono (em engines modernas)
    }
}

// Stack traces com informações customizadas
class DetailedError extends Error {
    constructor(message, context = {}) {
        super(message);
        this.name = 'DetailedError';
        this.context = context;
        this.timestamp = new Date().toISOString();
        
        // Captura stack trace personalizada
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DetailedError);
        }
    }
    
    getFormattedStack() {
        const lines = this.stack.split('\n');
        return lines.map((line, index) => {
            if (index === 0) return `${line} (${this.timestamp})`;
            return line;
        }).join('\n');
    }
}
```

**Estrutura da Stack Trace:**
- **Temporal**: **Ordem cronológica** das **chamadas**
- **Espacial**: **Localização** no **código** (**arquivo**, **linha**, **coluna**)
- **Hierárquica**: **Aninhamento** de **contextos** de **execução**
- **Rastreável**: **Permite** **navegação** **reversa** da **falha** à **origem**

### Error Objects Nativos: Especialização Funcional

#### ReferenceError: Filosofia da Referência Inexistente

```javascript
// ReferenceError representa problemas de referenciamento

// Caso 1: Variável não declarada
function exemploVariavelNaoDeclarada() {
    try {
        console.log(minhaVariavel); // ReferenceError
    } catch (error) {
        console.log(`Name: ${error.name}`);
        console.log(`Message: ${error.message}`);
        console.log(`Type: ${error.constructor.name}`);
    }
}

// Caso 2: Acesso fora de escopo
function exemploEscopo() {
    {
        let variavelLocal = 'dentro do bloco';
    }
    
    try {
        console.log(variavelLocal); // ReferenceError
    } catch (error) {
        console.log('Erro de escopo:', error.message);
    }
}

// Caso 3: Temporal Dead Zone (TDZ)
function exemploTDZ() {
    try {
        console.log(minhaConst); // ReferenceError
        const minhaConst = 'valor';
    } catch (error) {
        console.log('TDZ Error:', error.message);
    }
}
```

**Ontologia do ReferenceError:**
- **Representa**: **Falha** na **resolução** de **identificadores**
- **Contexto**: **Escopo**, **declaração**, **hoisting**
- **Temporalidade**: **Momento** da **tentativa** de **acesso**

#### TypeError: Filosofia da Incompatibilidade Operacional

```javascript
// TypeError representa operações incompatíveis com tipos

// Caso 1: Operação em null/undefined
function exemploNullUndefined() {
    const valores = [null, undefined];
    
    valores.forEach(valor => {
        try {
            valor.propriedade; // TypeError
        } catch (error) {
            console.log(`Valor ${valor}: ${error.message}`);
        }
    });
}

// Caso 2: Chamada de não-função
function exemploNaoFuncao() {
    const numero = 42;
    
    try {
        numero(); // TypeError
    } catch (error) {
        console.log(error.message); // 'numero is not a function'
    }
}

// Caso 3: Operações de escrita em readonly
function exemploReadonly() {
    'use strict';
    
    try {
        const obj = {};
        Object.defineProperty(obj, 'readonly', {
            value: 'imutável',
            writable: false
        });
        
        obj.readonly = 'novo valor'; // TypeError em strict mode
    } catch (error) {
        console.log('Readonly error:', error.message);
    }
}

// Caso 4: Problemas com protótipos
function exemploPrototipo() {
    try {
        const obj = Object.create(null); // Sem protótipo
        obj.toString(); // TypeError
    } catch (error) {
        console.log('Prototype error:', error.message);
    }
}
```

**Ontologia do TypeError:**
- **Representa**: **Incompatibilidade** entre **operação** e **tipo**
- **Contexto**: **Sistema** de **tipos** **dinâmico** do **JavaScript**
- **Manifestação**: **Runtime** quando **operação** é **tentada**

#### RangeError: Filosofia dos Limites e Intervalos

```javascript
// RangeError representa violações de limites válidos

// Caso 1: Array com tamanho inválido
function exemploArrayInvalido() {
    try {
        new Array(-1); // RangeError
    } catch (error) {
        console.log('Array size error:', error.message);
    }
    
    try {
        new Array(4294967296); // Muito grande, RangeError
    } catch (error) {
        console.log('Array too large:', error.message);
    }
}

// Caso 2: Métodos com argumentos fora de intervalo
function exemploMetodosComLimites() {
    const numero = 123.456;
    
    try {
        numero.toFixed(-1); // RangeError
    } catch (error) {
        console.log('toFixed error:', error.message);
    }
    
    try {
        numero.toFixed(101); // RangeError (limite é 100)
    } catch (error) {
        console.log('toFixed out of range:', error.message);
    }
}

// Caso 3: Stack overflow
function exemploStackOverflow() {
    function recursaoInfinita() {
        return recursaoInfinita(); // RangeError: Maximum call stack exceeded
    }
    
    try {
        recursaoInfinita();
    } catch (error) {
        console.log('Stack overflow:', error.name);
        console.log('Message:', error.message);
    }
}

// Caso 4: Datas inválidas
function exemploDataInvalida() {
    try {
        new Date().setFullYear(275760); // RangeError
    } catch (error) {
        console.log('Date range error:', error.message);
    }
}
```

**Ontologia do RangeError:**
- **Representa**: **Violação** de **limites** **estabelecidos**
- **Contexto**: **Especificações** da **linguagem** e **APIs**
- **Domínio**: **Valores numéricos**, **tamanhos**, **recursão**

#### SyntaxError: Filosofia da Conformidade Gramatical

```javascript
// SyntaxError representa violações de regras sintáticas

// Caso 1: Parsing dinâmico com eval
function exemploEvalSyntax() {
    const codigosMalformados = [
        'function malformada( {',
        'const obj = { propriedade: }',
        'if (true { console.log("sem parênteses"); }'
    ];
    
    codigosMalformados.forEach(codigo => {
        try {
            eval(codigo); // SyntaxError
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.log(`Syntax error em: "${codigo}"`);
                console.log(`Message: ${error.message}`);
            }
        }
    });
}

// Caso 2: Function constructor
function exemploFunctionConstructor() {
    try {
        new Function('invalid syntax here }');
    } catch (error) {
        console.log('Function constructor error:', error.message);
    }
}

// Caso 3: JSON parsing
function exemploJSONParsing() {
    const jsonsInvalidos = [
        '{ "chave": }',           // Valor faltando
        '{ chave: "valor" }',     // Chave sem aspas
        '{ "chave": "valor", }'  // Vírgula extra
    ];
    
    jsonsInvalidos.forEach(json => {
        try {
            JSON.parse(json); // SyntaxError
        } catch (error) {
            console.log(`JSON error: ${error.message}`);
        }
    });
}
```

**Ontologia do SyntaxError:**
- **Representa**: **Violação** das **regras gramaticais**
- **Contexto**: **Parsing** **dinâmico** (**eval**, **Function**, **JSON**)
- **Detecção**: **Parse time** ao invés de **execution time**

#### URIError: Filosofia da Codificação Malformada

```javascript
// URIError representa problemas de codificação URI

function exemploURIError() {
    const urisProblematicas = [
        '%',           // Sequência de escape incompleta
        '%ZZ',         // Código hexadecimal inválido
        '\uD800'       // Surrogate pair incompleto
    ];
    
    urisProblematicas.forEach(uri => {
        try {
            decodeURI(uri); // URIError
        } catch (error) {
            console.log(`URI error para "${uri}": ${error.message}`);
        }
        
        try {
            encodeURI(uri); // Pode gerar URIError
        } catch (error) {
            console.log(`Encode error para "${uri}": ${error.message}`);
        }
    });
}

// Exemplo com componentes URI
function exemploComponenteURI() {
    try {
        decodeURIComponent('%E0%A4%A'); // Sequência UTF-8 incompleta
    } catch (error) {
        console.log('Component decode error:', error.message);
    }
}
```

### Error Objects Customizados: Extensão Semântica

```javascript
// Criando hierarquia de erros específicos da aplicação

class ApplicationError extends Error {
    constructor(message, code = 'APP_ERROR') {
        super(message);
        this.name = 'ApplicationError';
        this.code = code;
        this.timestamp = new Date().toISOString();
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApplicationError);
        }
    }
}

class ValidationError extends ApplicationError {
    constructor(message, field, value, rule) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
        this.rule = rule;
    }
    
    toString() {
        return `${this.name}: Field '${this.field}' with value '${this.value}' failed rule '${this.rule}': ${this.message}`;
    }
}

class NetworkError extends ApplicationError {
    constructor(message, url, method, statusCode) {
        super(message, 'NETWORK_ERROR');
        this.name = 'NetworkError';
        this.url = url;
        this.method = method;
        this.statusCode = statusCode;
    }
}

class BusinessLogicError extends ApplicationError {
    constructor(message, operation, context = {}) {
        super(message, 'BUSINESS_LOGIC_ERROR');
        this.name = 'BusinessLogicError';
        this.operation = operation;
        this.context = context;
    }
}

// Uso das classes customizadas
function exemploErrosCustomizados() {
    // Validação
    try {
        validarIdade(-5);
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log(`Validation failed: ${error.toString()}`);
        }
    }
    
    // Network
    try {
        throw new NetworkError(
            'Connection timeout',
            'https://api.exemplo.com/dados',
            'GET',
            408
        );
    } catch (error) {
        console.log(`Network issue: ${error.method} ${error.url} - ${error.statusCode}`);
    }
    
    // Business Logic
    try {
        throw new BusinessLogicError(
            'Insufficient funds for transaction',
            'process_payment',
            { accountId: '12345', requestedAmount: 1000, availableBalance: 750 }
        );
    } catch (error) {
        console.log(`Business error in ${error.operation}:`, error.context);
    }
}

function validarIdade(idade) {
    if (typeof idade !== 'number') {
        throw new ValidationError(
            'Age must be a number',
            'age',
            idade,
            'type_check'
        );
    }
    
    if (idade < 0) {
        throw new ValidationError(
            'Age cannot be negative',
            'age',
            idade,
            'range_check'
        );
    }
    
    if (idade > 150) {
        throw new ValidationError(
            'Age seems unrealistic',
            'age', 
            idade,
            'sanity_check'
        );
    }
}
```

## 🧠 Fundamentos Teóricos: Lógica da Estruturação de Erros

### Teoria da Informação Estruturada

**Princípio da Completude Informacional**: **Error Objects** devem **conter** **informação suficiente** para **reconstruir** **contexto** da **falha** sem **redundância excessiva**.

**Corolário da Especificidade**: **Propriedades** devem ser **específicas** o **suficiente** para **permitir** **ação corretiva** **precisa**.

### Epistemologia da Herança de Erros

**Hierarquia Semântica** baseada em **especialização progressiva**:

```javascript
// Demonstração da hierarquia conceitual

Error                           // Conceito abstrato de "falha"
└── ApplicationError            // Falha no domínio da aplicação
    ├── ValidationError         // Falha de validação de dados
    ├── AuthenticationError     // Falha de autenticação
    ├── AuthorizationError      // Falha de autorização
    ├── BusinessLogicError      // Falha de regra de negócio
    └── ExternalServiceError    // Falha de serviço externo
        ├── NetworkError        // Falha de conectividade
        ├── DatabaseError       // Falha de banco de dados
        └── APIError            // Falha de API externa
```

**Implicações Hermenêuticas:**
- **Cada nível** **adiciona** **especificidade semântica**
- **Handlers** podem **capturar** em **nível apropriado**
- **Logging** pode **agregar** por **categoria**

## 🔍 Análise Conceitual Profunda: Padrões Avançados com Error Objects

### Padrão 1: Error Enrichment (Enriquecimento de Contexto)

```javascript
// Adicionando contexto progressivo conforme erro propaga

class ContextualError extends Error {
    constructor(message, context = {}) {
        super(message);
        this.name = 'ContextualError';
        this.contexts = [context];
        this.timestamp = new Date().toISOString();
    }
    
    addContext(context) {
        this.contexts.push({
            ...context,
            timestamp: new Date().toISOString()
        });
        return this;
    }
    
    getFullContext() {
        return this.contexts.reduce((acc, ctx) => ({...acc, ...ctx}), {});
    }
}

function operacaoNivel1(dados) {
    try {
        return operacaoNivel2(dados);
    } catch (error) {
        if (error instanceof ContextualError) {
            error.addContext({
                level: 'nivel1',
                operation: 'validation',
                input: dados
            });
        }
        throw error;
    }
}

function operacaoNivel2(dados) {
    try {
        return operacaoNivel3(dados);
    } catch (error) {
        if (error instanceof ContextualError) {
            error.addContext({
                level: 'nivel2',
                operation: 'processing',
                processedAt: new Date().toISOString()
            });
        }
        throw error;
    }
}

function operacaoNivel3(dados) {
    throw new ContextualError('Falha na operação', {
        level: 'nivel3',
        operation: 'core_logic',
        originalData: dados
    });
}
```

### Padrão 2: Error Aggregation (Agregação de Múltiplos Erros)

```javascript
// ES2021 AggregateError para múltiplas falhas relacionadas

class ValidationAggregateError extends AggregateError {
    constructor(errors, message = 'Multiple validation errors occurred') {
        super(errors, message);
        this.name = 'ValidationAggregateError';
        this.validationErrors = errors;
    }
    
    getErrorsByField() {
        return this.validationErrors.reduce((acc, error) => {
            if (error.field) {
                if (!acc[error.field]) acc[error.field] = [];
                acc[error.field].push(error);
            }
            return acc;
        }, {});
    }
    
    getErrorsBySeverity() {
        return this.validationErrors.reduce((acc, error) => {
            const severity = error.severity || 'error';
            if (!acc[severity]) acc[severity] = [];
            acc[severity].push(error);
            return acc;
        }, {});
    }
}

function validarFormularioCompleto(dados) {
    const erros = [];
    
    // Validação de múltiplos campos
    if (!dados.nome) {
        erros.push(new ValidationError('Nome é obrigatório', 'nome', dados.nome, 'required'));
    }
    
    if (!dados.email || !/\S+@\S+\.\S+/.test(dados.email)) {
        erros.push(new ValidationError('Email inválido', 'email', dados.email, 'format'));
    }
    
    if (!dados.idade || dados.idade < 18) {
        erros.push(new ValidationError('Idade deve ser maior que 18', 'idade', dados.idade, 'range'));
    }
    
    if (dados.senha && dados.senha.length < 8) {
        const error = new ValidationError('Senha muito curta', 'senha', '***', 'length');
        error.severity = 'warning';
        erros.push(error);
    }
    
    if (erros.length > 0) {
        throw new ValidationAggregateError(erros);
    }
    
    return true;
}

// Uso com tratamento específico
try {
    validarFormularioCompleto({
        nome: '',
        email: 'invalid-email',
        idade: 16,
        senha: '123'
    });
} catch (error) {
    if (error instanceof ValidationAggregateError) {
        console.log('Errors by field:', error.getErrorsByField());
        console.log('Errors by severity:', error.getErrorsBySeverity());
    }
}
```

### Padrão 3: Error Chaining (Encadeamento de Causa)

```javascript
// Mantendo cadeia de causalidade entre erros

class ChainedError extends Error {
    constructor(message, cause = null) {
        super(message);
        this.name = 'ChainedError';
        this.cause = cause;
        this.timestamp = new Date().toISOString();
    }
    
    getRootCause() {
        let current = this;
        while (current.cause) {
            current = current.cause;
        }
        return current;
    }
    
    getCausalChain() {
        const chain = [];
        let current = this;
        
        while (current) {
            chain.push({
                name: current.name,
                message: current.message,
                timestamp: current.timestamp || 'unknown'
            });
            current = current.cause;
        }
        
        return chain;
    }
    
    toString() {
        let message = `${this.name}: ${this.message}`;
        if (this.cause) {
            message += `\nCaused by: ${this.cause.toString()}`;
        }
        return message;
    }
}

function operacaoComCausas() {
    try {
        // Simula operação de baixo nível que falha
        throw new Error('Database connection failed');
    } catch (lowLevelError) {
        try {
            // Operação de nível intermediário
            throw new ChainedError('Failed to fetch user data', lowLevelError);
        } catch (midLevelError) {
            // Operação de alto nível
            throw new ChainedError('User authentication failed', midLevelError);
        }
    }
}

try {
    operacaoComCausas();
} catch (error) {
    console.log('Full error chain:');
    console.log(error.toString());
    
    console.log('\nCausal chain:');
    error.getCausalChain().forEach((link, index) => {
        console.log(`${index + 1}. ${link.name}: ${link.message} (${link.timestamp})`);
    });
    
    console.log('\nRoot cause:', error.getRootCause().message);
}
```

### Padrão 4: Error Metadata e Telemetry

```javascript
// Error Objects com metadados para observabilidade

class ObservableError extends Error {
    constructor(message, metadata = {}) {
        super(message);
        this.name = 'ObservableError';
        this.metadata = {
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            userId: metadata.userId || 'anonymous',
            requestId: metadata.requestId || this.generateRequestId(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.APP_VERSION || 'unknown',
            ...metadata
        };
        
        this.severity = metadata.severity || 'error';
        this.category = metadata.category || 'general';
        this.tags = metadata.tags || [];
        
        // Captura informações do sistema
        this.systemInfo = {
            memory: process.memoryUsage ? process.memoryUsage() : null,
            platform: typeof process !== 'undefined' ? process.platform : 'browser',
            nodeVersion: typeof process !== 'undefined' ? process.version : null
        };
    }
    
    generateSessionId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    generateRequestId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            stack: this.stack,
            metadata: this.metadata,
            severity: this.severity,
            category: this.category,
            tags: this.tags,
            systemInfo: this.systemInfo
        };
    }
    
    // Para integração com sistemas de logging
    toLogEntry() {
        return {
            level: this.severity,
            message: this.message,
            error: {
                name: this.name,
                stack: this.stack
            },
            metadata: this.metadata,
            category: this.category,
            tags: this.tags,
            timestamp: this.metadata.timestamp
        };
    }
}

// Uso em contexto de aplicação
function processarPagamento(dadosPagamento, contexto) {
    try {
        // Simulação de falha
        throw new Error('Payment gateway timeout');
    } catch (originalError) {
        throw new ObservableError(
            'Payment processing failed',
            {
                userId: contexto.userId,
                requestId: contexto.requestId,
                paymentAmount: dadosPagamento.amount,
                paymentMethod: dadosPagamento.method,
                severity: 'critical',
                category: 'payment',
                tags: ['gateway', 'timeout', 'retry-required'],
                originalError: originalError.message,
                retryAttempt: contexto.retryAttempt || 0
            }
        );
    }
}
```

## 🎯 Aplicabilidade e Contextos: Estratégias com Error Objects

### Quando Usar Error Objects Específicos vs Genéricos

**Regra Fundamental**: **Especificidade** do **Error Object** deve **corresponder** à **granularidade** do **tratamento** **necessário**.

#### Contextos para Error Objects Genéricos

```javascript
// Uso apropriado de Error genérico
function operacaoSimples(valor) {
    if (valor === null) {
        throw new Error('Valor não pode ser null');
    }
    return valor * 2;
}

// Handler simples
try {
    operacaoSimples(null);
} catch (error) {
    console.log('Operação falhou:', error.message);
    // Não precisa de tratamento específico
}
```

#### Contextos para Error Objects Específicos

```javascript
// Sistema que requer tratamento diferenciado
class PaymentProcessor {
    static processPayment(paymentData) {
        // Diferentes tipos de erro requerem diferentes tratamentos
        
        if (!paymentData.cardNumber) {
            throw new ValidationError('Card number required', 'cardNumber', null, 'required');
        }
        
        if (!this.isValidCard(paymentData.cardNumber)) {
            throw new ValidationError('Invalid card number', 'cardNumber', '****', 'format');
        }
        
        if (paymentData.amount > 10000) {
            throw new BusinessLogicError('Amount exceeds limit', 'validate_amount', {
                amount: paymentData.amount,
                limit: 10000
            });
        }
        
        try {
            return this.chargeCard(paymentData);
        } catch (networkError) {
            throw new NetworkError('Payment gateway unavailable', 
                'https://payment.api.com/charge', 'POST', 503);
        }
    }
    
    static isValidCard(cardNumber) {
        return /^\d{16}$/.test(cardNumber);
    }
    
    static chargeCard(paymentData) {
        // Simula falha de rede
        throw new Error('Network timeout');
    }
}

// Handler com tratamento específico
try {
    PaymentProcessor.processPayment({
        cardNumber: '123',
        amount: 15000
    });
} catch (error) {
    if (error instanceof ValidationError) {
        // UI pode mostrar erro específico do campo
        console.log(`Validation error on field ${error.field}: ${error.message}`);
        
    } else if (error instanceof BusinessLogicError) {
        // Log para auditoria, notificação para admin
        console.log(`Business rule violation in ${error.operation}:`, error.context);
        
    } else if (error instanceof NetworkError) {
        // Retry logic, fallback, notificação de status
        console.log(`Network issue: ${error.method} ${error.url} (${error.statusCode})`);
        console.log('Will retry in 30 seconds...');
        
    } else {
        // Erro inesperado
        console.log('Unexpected error:', error);
    }
}
```

### Estratégias de Logging com Error Objects

```javascript
// Logger que aproveita estrutura dos Error Objects

class ErrorLogger {
    static log(error, context = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: this.getSeverityLevel(error),
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            context: context
        };
        
        // Adiciona propriedades específicas se disponíveis
        if (error.code) logEntry.error.code = error.code;
        if (error.field) logEntry.error.field = error.field;
        if (error.operation) logEntry.error.operation = error.operation;
        if (error.url) logEntry.error.url = error.url;
        if (error.statusCode) logEntry.error.statusCode = error.statusCode;
        
        // Agregação por tipo
        this.incrementErrorCounter(error.name);
        
        // Output baseado no ambiente
        if (process.env.NODE_ENV === 'production') {
            this.sendToLoggingService(logEntry);
        } else {
            console.error(JSON.stringify(logEntry, null, 2));
        }
    }
    
    static getSeverityLevel(error) {
        if (error.severity) return error.severity;
        
        // Mapeamento baseado em tipo
        const severityMap = {
            'ValidationError': 'warning',
            'BusinessLogicError': 'error', 
            'NetworkError': 'error',
            'SecurityError': 'critical',
            'Error': 'error'
        };
        
        return severityMap[error.name] || 'error';
    }
    
    static incrementErrorCounter(errorType) {
        // Implementação de métricas
        if (!this.errorCounts) this.errorCounts = {};
        this.errorCounts[errorType] = (this.errorCounts[errorType] || 0) + 1;
    }
    
    static sendToLoggingService(logEntry) {
        // Integração com serviços de logging (Datadog, Splunk, etc.)
        console.log('Sending to logging service:', logEntry);
    }
    
    static getErrorStats() {
        return {
            counts: this.errorCounts || {},
            totalErrors: Object.values(this.errorCounts || {}).reduce((a, b) => a + b, 0)
        };
    }
}
```

## ⚠️ Limitações e Armadilhas com Error Objects

### Armadilha 1: Information Overload

```javascript
// ❌ Error Object com informações excessivas
class OverlyDetailedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OverlyDetailedError';
        
        // Informação excessiva
        this.timestamp = new Date().toISOString();
        this.browserInfo = navigator.userAgent; // Pode não estar disponível
        this.memoryUsage = performance.memory; // Browser-specific
        this.connectionInfo = navigator.connection; // Nem sempre disponível
        this.screenResolution = `${screen.width}x${screen.height}`; // Irrelevante
        this.cookieEnabled = navigator.cookieEnabled; // Não relacionado
        this.language = navigator.language;
        this.plugins = Array.from(navigator.plugins); // Potencial privacy issue
        
        // Stack trace desnecessariamente detalhado
        this.detailedStack = new Error().stack.split('\n').map(line => ({
            line: line,
            timestamp: Date.now(),
            randomId: Math.random()
        }));
    }
}

// ✅ Error Object com informação apropriada
class AppropriateError extends Error {
    constructor(message, context = {}) {
        super(message);
        this.name = 'AppropriateError';
        this.timestamp = new Date().toISOString();
        
        // Apenas informações relevantes para debugging
        this.context = {
            operation: context.operation,
            userId: context.userId, // Se relevante para o erro
            requestId: context.requestId, // Para correlação
            ...(context.additionalInfo || {})
        };
    }
}
```

### Armadilha 2: Circular References

```javascript
// ❌ Problema: referências circulares
class ProblematicError extends Error {
    constructor(message, relatedObject) {
        super(message);
        this.name = 'ProblematicError';
        this.relatedObject = relatedObject; // Pode conter referências circulares
    }
}

const obj1 = { name: 'obj1' };
const obj2 = { name: 'obj2', ref: obj1 };
obj1.ref = obj2; // Referência circular

try {
    throw new ProblematicError('Something failed', obj1);
} catch (error) {
    // JSON.stringify(error) falhará com referência circular
    console.log(JSON.stringify(error)); // TypeError: Converting circular structure to JSON
}

// ✅ Solução: serialização segura
class SafeError extends Error {
    constructor(message, context = {}) {
        super(message);
        this.name = 'SafeError';
        this.context = this.sanitizeContext(context);
    }
    
    sanitizeContext(context) {
        try {
            // Testa se pode ser serializado
            JSON.stringify(context);
            return context;
        } catch (error) {
            // Se não pode ser serializado, extrai apenas propriedades primitivas
            const safe = {};
            for (const key in context) {
                const value = context[key];
                if (typeof value === 'string' || 
                    typeof value === 'number' || 
                    typeof value === 'boolean' ||
                    value === null) {
                    safe[key] = value;
                } else if (typeof value === 'object') {
                    safe[key] = '[Object - not serializable]';
                }
            }
            return safe;
        }
    }
    
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            context: this.context,
            timestamp: new Date().toISOString()
        };
    }
}
```

### Armadilha 3: Memory Leaks com Stack Traces

```javascript
// ❌ Potencial memory leak
class ErrorWithLargeClosure extends Error {
    constructor(message, largeData) {
        super(message);
        this.name = 'ErrorWithLargeClosure';
        
        // Mantém referência a dados grandes no closure
        this.processingFunction = () => {
            return largeData.map(item => item.process()); // largeData nunca será coletada
        };
    }
}

// ✅ Versão que evita memory leaks
class MemoryEfficientError extends Error {
    constructor(message, largeDataSummary) {
        super(message);
        this.name = 'MemoryEfficientError';
        
        // Armazena apenas resumo dos dados grandes
        this.dataSummary = {
            itemCount: largeDataSummary.length,
            firstItem: largeDataSummary[0]?.id || null,
            lastItem: largeDataSummary[largeDataSummary.length - 1]?.id || null
        };
        
        // Não mantém referência aos dados originais
    }
}
```

## 🔗 Interconexões Conceituais: Error Objects no Ecossistema

### Relação com Promise Rejection

```javascript
// Error Objects em contexto assíncrono

async function operacaoAssincronaComErrorObjects() {
    try {
        const resultado = await fetch('/api/dados');
        
        if (!resultado.ok) {
            throw new NetworkError(
                `HTTP ${resultado.status}: ${resultado.statusText}`,
                resultado.url,
                'GET', 
                resultado.status
            );
        }
        
        const dados = await resultado.json();
        return dados;
        
    } catch (error) {
        if (error instanceof NetworkError) {
            // Re-throw com contexto adicional
            error.addContext({ retryable: error.statusCode >= 500 });
            throw error;
        } else {
            // Wrap outros erros
            throw new ApplicationError('Failed to fetch data', 'FETCH_ERROR');
        }
    }
}

// Handler que preserva Error Objects através de Promise chains
operacaoAssincronaComErrorObjects()
    .catch(error => {
        if (error instanceof NetworkError && error.context?.retryable) {
            return retryOperation();
        }
        throw error;
    })
    .catch(error => ErrorLogger.log(error, { operation: 'data_fetch' }));
```

### Integração com Event Systems

```javascript
// Error Objects em Event-Driven Architecture

class ErrorEventEmitter extends EventTarget {
    static emitError(error, context = {}) {
        const errorEvent = new CustomEvent('application-error', {
            detail: {
                error: error,
                context: context,
                timestamp: new Date().toISOString()
            }
        });
        
        this.dispatchEvent(errorEvent);
    }
    
    static onError(handler) {
        this.addEventListener('application-error', handler);
    }
}

// Sistema de monitoramento que escuta erros
ErrorEventEmitter.onError((event) => {
    const { error, context } = event.detail;
    
    // Diferentes tratamentos baseados no tipo do Error Object
    if (error instanceof ValidationError) {
        notifyUser(error.message, 'warning');
    } else if (error instanceof NetworkError) {
        showNetworkStatusIndicator(false);
    } else if (error instanceof BusinessLogicError) {
        logToAnalytics('business_rule_violation', error.context);
    }
});
```

## 🚀 Evolução e Horizontes: O Futuro dos Error Objects

### Tendências Emergentes

#### Error Objects com AI-Enhanced Context

```javascript
// Conceito futuro: Error Objects que sugerem soluções

class AIEnhancedError extends Error {
    constructor(message, context = {}) {
        super(message);
        this.name = 'AIEnhancedError';
        this.context = context;
        this.suggestions = this.generateSuggestions();
    }
    
    async generateSuggestions() {
        // Hipotético: AI analisa erro e sugere soluções
        const pattern = await ErrorPatternAnalyzer.analyze(this.message, this.stack);
        return pattern.suggestions;
    }
}
```

#### Rich Error Objects com Multimedia Context

```javascript
// Futuro: Error Objects que capturam estado visual/audio

class MultimediaError extends Error {
    constructor(message, captureContext = true) {
        super(message);
        this.name = 'MultimediaError';
        
        if (captureContext && typeof document !== 'undefined') {
            this.visualContext = {
                screenshot: this.captureScreenshot(),
                domSnapshot: this.captureDOMSnapshot(),
                userInteractions: this.getUserInteractionLog()
            };
        }
    }
    
    captureScreenshot() {
        // Captura screenshot do estado atual
        return html2canvas(document.body).then(canvas => canvas.toDataURL());
    }
    
    captureDOMSnapshot() {
        // Captura estrutura DOM relevante
        return document.body.innerHTML;
    }
    
    getUserInteractionLog() {
        // Retorna log das últimas interações do usuário
        return InteractionTracker.getRecentInteractions(10);
    }
}
```

## 📚 Síntese Filosófica: A Ontologia dos Error Objects

### Error Objects como Linguagem Estruturada

**Error Objects** **representam** **evolução** da **comunicação** sobre **falhas**: de **mensagens** **simples** para **estruturas** **semânticas** **ricas** que **carregam** **contexto**, **tipagem** e **metadados** **relevantes**.

### Lições Fundamentais

1. **Estrutura** **importa**: **Informação** **bem organizada** **acelera** **diagnóstico** e **resolução**

2. **Especialização** **serve** ao **propósito**: **Error Objects** **específicos** **permitem** **tratamento** **direcionado**

3. **Contexto** é **rei**: **Propriedades** **adicionais** (**stack**, **metadata**, **context**) são **essenciais** para **debugging** **eficaz**

4. **Herança** **semântica**: **Hierarquia** de **Error Objects** **reflete** **hierarquia** de **conceitos** de **falha**

**Em essência**: **Error Objects** são **manifestação** da **maturidade** em **tratamento** de **erros** - **transformam** **falhas** **caóticas** em **informações** **estruturadas** que **facilitam** **compreensão**, **correção** e **prevenção** de **problemas**.

A **fenomenologia** dos **Error Objects** **revela** que **erros** **não são** **apenas** **obstáculos**, mas **oportunidades** de **aprender** sobre **sistema**, **melhorar** **robustez** e **criar** **experiências** **mais resilientes**. **Dominar** **Error Objects** é **dominar** **arte** de **transformar** **caos** em **ordem**, **confusão** em **clareza**, e **problemas** em **oportunidades** de **melhoria**.