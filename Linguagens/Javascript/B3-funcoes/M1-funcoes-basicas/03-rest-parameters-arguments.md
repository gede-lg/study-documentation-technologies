# Rest Parameters e Arguments Object JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Rest Parameters** (`...args`) são uma **modern ES6+ feature** que permite coletar **multiple arguments** em um **array**, enquanto o **Arguments Object** é o **legacy mechanism** para acessar **all passed arguments** como um **array-like object** disponível em todas as funções tradicionais.

Representam **different approaches** para **variadic function design**, oferecendo **flexible argument collection**, **dynamic parameter handling** e **function overloading simulation** essenciais para **versatile function APIs** e **adaptable function behavior**.

### Problema Fundamental que Resolve

Resolve a necessidade de **variable argument handling** permitindo funções que aceitem **unknown number of parameters**, **optional argument processing**, **argument forwarding** e **dynamic function behavior** que são **críticos** para **utility functions**, **wrapper functions** e **flexible APIs**.

---

## 📋 Sumário Conceitual

### Rest Parameters (`...args`)
- **ES6+ syntax** - `function func(...args) {}`
- **True array** - possui todos os métodos de array
- **Named parameter** - pode ter qualquer nome
- **Must be last** - deve ser o último parâmetro

### Arguments Object
- **Legacy mechanism** - disponível em function declarations/expressions
- **Array-like** - tem length mas não métodos de array
- **Always 'arguments'** - nome fixo
- **Not in arrow functions** - não disponível em arrow functions

---

## 🧠 Fundamentos Teóricos

### Rest Parameters Fundamentals

#### Análise de Rest Parameter Syntax
```javascript
// Demonstração completa de rest parameters

function demonstrarRestParameters() {
  console.log("=== Rest Parameters Fundamentals ===");
  
  // BASIC REST PARAMETERS
  console.log("=== Basic Rest Parameters ===");
  
  function somarTodos(...numeros) {
    console.log("Rest parameter 'numeros':", numeros);
    console.log("Type:", typeof numeros);
    console.log("Is Array:", Array.isArray(numeros));
    console.log("Length:", numeros.length);
    
    // Usar métodos de array diretamente
    const soma = numeros
      .filter(n => typeof n === 'number')
      .reduce((acc, n) => acc + n, 0);
    
    return soma;
  }
  
  console.log("Soma vazia:", somarTodos());
  console.log("Soma 1-5:", somarTodos(1, 2, 3, 4, 5));
  console.log("Soma mista:", somarTodos(1, "2", 3, null, 4, undefined, 5));
  
  // REST WITH REGULAR PARAMETERS
  console.log("\n=== Rest with Regular Parameters ===");
  
  function processarDados(operacao, configuracao = {}, ...valores) {
    console.log("Operação:", operacao);
    console.log("Configuração:", configuracao);
    console.log("Valores para processar:", valores);
    console.log("Quantidade de valores:", valores.length);
    
    let resultado;
    
    switch (operacao) {
      case 'somar':
        resultado = valores.reduce((acc, val) => acc + val, 0);
        break;
      case 'multiplicar':
        resultado = valores.reduce((acc, val) => acc * val, 1);
        break;
      case 'concatenar':
        resultado = valores.join(configuracao.separador || '');
        break;
      case 'filtrar':
        resultado = valores.filter(configuracao.filtro || (x => x));
        break;
      default:
        resultado = valores;
    }
    
    if (configuracao.debug) {
      console.log("Resultado calculado:", resultado);
    }
    
    return resultado;
  }
  
  console.log("Somar:", processarDados('somar', {}, 10, 20, 30));
  console.log("Multiplicar:", processarDados('multiplicar', { debug: true }, 2, 3, 4));
  console.log("Concatenar:", processarDados('concatenar', { separador: '-' }, 'a', 'b', 'c'));
  console.log("Filtrar:", processarDados('filtrar', { filtro: x => x > 5 }, 1, 6, 3, 8, 2, 9));
  
  // DESTRUCTURING WITH REST
  console.log("\n=== Destructuring with Rest ===");
  
  function analisarGrupo(lider, vice, ...membros) {
    console.log("Estrutura do grupo:");
    console.log("  Líder:", lider);
    console.log("  Vice-líder:", vice);
    console.log("  Membros:", membros);
    console.log("  Total de pessoas:", 2 + membros.length);
    
    return {
      lideranca: { lider, vice },
      equipe: membros,
      tamanhoTotal: 2 + membros.length,
      estrutura: membros.length > 0 ? 'completa' : 'mínima'
    };
  }
  
  const grupo1 = analisarGrupo("Alice", "Bob", "Carol", "Dave", "Eve");
  const grupo2 = analisarGrupo("Frank", "Grace");
  
  console.log("Grupo 1:", grupo1);
  console.log("Grupo 2:", grupo2);
  
  // ARRAY DESTRUCTURING WITH REST
  function processarArray([primeiro, segundo, ...resto]) {
    console.log("Array destructuring:");
    console.log("  Primeiro:", primeiro);
    console.log("  Segundo:", segundo);
    console.log("  Resto:", resto);
    
    return {
      cabecalho: [primeiro, segundo],
      dados: resto,
      temDados: resto.length > 0
    };
  }
  
  const resultado1 = processarArray([1, 2, 3, 4, 5]);
  const resultado2 = processarArray(['header']);
  
  console.log("Processamento 1:", resultado1);
  console.log("Processamento 2:", resultado2);
  
  // REST IN OBJECT PATTERNS
  console.log("\n=== Object Patterns with Rest ===");
  
  function configurarServidor({ host, port, ssl = false, ...outrasConfigs }) {
    console.log("Configuração base:");
    console.log("  Host:", host);
    console.log("  Port:", port); 
    console.log("  SSL:", ssl);
    console.log("  Outras configurações:", outrasConfigs);
    
    const config = {
      endereco: `${ssl ? 'https' : 'http'}://${host}:${port}`,
      configuracaoBase: { host, port, ssl },
      configuracaoExtendida: outrasConfigs,
      timestamp: Date.now()
    };
    
    return config;
  }
  
  const servidor = configurarServidor({
    host: 'localhost',
    port: 8080,
    ssl: true,
    debug: true,
    cors: { origin: '*' },
    auth: { type: 'jwt' },
    cache: { ttl: 3600 }
  });
  
  console.log("Servidor configurado:", servidor);
}

demonstrarRestParameters();

// Advanced rest parameter patterns
function demonstrarAdvancedRestPatterns() {
  console.log("\n=== Advanced Rest Parameter Patterns ===");
  
  // VARIADIC FUNCTION OVERLOADING
  console.log("=== Variadic Function Overloading ===");
  
  function criarElemento(...args) {
    console.log("Arguments recebidos:", args);
    
    // Different signatures based on argument patterns
    if (args.length === 1 && typeof args[0] === 'string') {
      // criarElemento('div')
      return { tag: args[0], attributes: {}, children: [] };
    }
    
    if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'object' && !Array.isArray(args[1])) {
      // criarElemento('div', { class: 'container' })
      return { tag: args[0], attributes: args[1], children: [] };
    }
    
    if (args.length >= 2 && typeof args[0] === 'string') {
      const [tag, ...rest] = args;
      
      // Check if second argument is attributes object
      if (rest.length > 0 && typeof rest[0] === 'object' && !Array.isArray(rest[0]) && rest[0] !== null) {
        const [attributes, ...children] = rest;
        return { tag, attributes, children };
      } else {
        // All rest are children
        return { tag, attributes: {}, children: rest };
      }
    }
    
    throw new Error("Invalid arguments for criarElemento");
  }
  
  console.log("Element 1:", criarElemento('div'));
  console.log("Element 2:", criarElemento('span', { class: 'highlight' }));
  console.log("Element 3:", criarElemento('p', 'Hello', 'World'));
  console.log("Element 4:", criarElemento('div', { id: 'main' }, 'Content', { type: 'nested' }));
  
  // FUNCTION COMPOSITION WITH REST
  console.log("\n=== Function Composition with Rest ===");
  
  function compor(...funcoes) {
    console.log("Compondo", funcoes.length, "funções");
    
    // Validar que todos os argumentos são funções
    funcoes.forEach((fn, index) => {
      if (typeof fn !== 'function') {
        throw new Error(`Argument ${index} is not a function`);
      }
    });
    
    return function composicaoExecutada(valor) {
      console.log("Executando composição com valor inicial:", valor);
      
      const resultado = funcoes.reduceRight((acc, fn, index) => {
        console.log(`Aplicando função ${index}:`, fn.name || 'anonymous');
        const novoAcc = fn(acc);
        console.log(`Resultado da função ${index}:`, novoAcc);
        return novoAcc;
      }, valor);
      
      console.log("Resultado final da composição:", resultado);
      return resultado;
    };
  }
  
  const dobrar = x => x * 2;
  const somar10 = x => x + 10;
  const elevarAoQuadrado = x => x ** 2;
  const arredondar = x => Math.round(x);
  
  const pipeline = compor(arredondar, elevarAoQuadrado, somar10, dobrar);
  const resultado = pipeline(5.7);
  console.log("Pipeline result:", resultado);
  
  // COLLECTOR PATTERNS
  console.log("\n=== Collector Patterns ===");
  
  function criarColetorEventos() {
    const eventos = [];
    
    function coletor(tipo, ...dados) {
      const evento = {
        tipo,
        dados,
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
      };
      
      eventos.push(evento);
      console.log(`Evento '${tipo}' coletado:`, dados);
      
      return {
        // Retornar interface fluente
        e: coletor, // shorthand para adicionar mais eventos
        obterEventos: () => [...eventos],
        filtrarPorTipo: (tipoFiltro) => eventos.filter(e => e.tipo === tipoFiltro),
        limpar: () => { eventos.length = 0; },
        count: () => eventos.length
      };
    }
    
    return coletor;
  }
  
  const coletor = criarColetorEventos();
  
  const resultado_fluente = coletor('click', 100, 200, 'button1')
    .e('hover', 'menu', 'item2')
    .e('scroll', 0, 150)
    .e('click', 300, 400, 'button2');
  
  console.log("Todos eventos:", resultado_fluente.obterEventos());
  console.log("Eventos de click:", resultado_fluente.filtrarPorTipo('click'));
  console.log("Total de eventos:", resultado_fluente.count());
  
  // PARAMETER FORWARDING
  console.log("\n=== Parameter Forwarding ===");
  
  function criarLogger(prefixo = 'LOG') {
    return function logger(nivel, ...mensagens) {
      const timestamp = new Date().toISOString();
      const formatada = mensagens
        .map(msg => typeof msg === 'object' ? JSON.stringify(msg) : String(msg))
        .join(' ');
      
      console.log(`[${timestamp}] ${prefixo}:${nivel.toUpperCase()} - ${formatada}`);
      
      // Forwarding para outros loggers se necessário
      if (nivel === 'error' && typeof console.error === 'function') {
        console.error(`${prefixo} ERROR:`, ...mensagens);
      }
    };
  }
  
  const appLogger = criarLogger('APP');
  const dbLogger = criarLogger('DATABASE');
  
  appLogger('info', 'Application started', { port: 3000, env: 'development' });
  dbLogger('warn', 'Connection retry', 'attempt #3');
  appLogger('error', 'Fatal error occurred:', new Error('Something went wrong'));
}

demonstrarAdvancedRestPatterns();
```

### Arguments Object Analysis

#### Análise do Arguments Object Legacy
```javascript
// Demonstração completa do arguments object

function demonstrarArgumentsObject() {
  console.log("\n=== Arguments Object Analysis ===");
  
  // BASIC ARGUMENTS OBJECT
  console.log("=== Basic Arguments Object ===");
  
  function exemploBasicoArguments() {
    console.log("Arguments object:");
    console.log("  Type:", typeof arguments);
    console.log("  Length:", arguments.length);
    console.log("  Is Array:", Array.isArray(arguments));
    console.log("  Constructor:", arguments.constructor.name);
    
    // Mostrar cada argumento
    for (let i = 0; i < arguments.length; i++) {
      console.log(`  [${i}]:`, arguments[i], typeof arguments[i]);
    }
    
    // Arguments não tem métodos de array
    console.log("  Has forEach method:", typeof arguments.forEach);
    console.log("  Has map method:", typeof arguments.map);
    
    // Converter para array para usar métodos
    const argsArray = Array.from(arguments);
    console.log("  Converted to array:", argsArray);
    console.log("  Array methods available:", typeof argsArray.forEach);
    
    return arguments.length;
  }
  
  exemploBasicoArguments('a', 42, true, { key: 'value' }, null);
  
  // ARGUMENTS OBJECT PROPERTIES
  console.log("\n=== Arguments Object Properties ===");
  
  function propriedadesArguments(a, b, c) {
    console.log("Function parameters:", { a, b, c });
    console.log("Arguments length:", arguments.length);
    
    // Arguments.callee (deprecated in strict mode)
    if (arguments.callee) {
      console.log("Arguments.callee (function reference):", arguments.callee.name);
    } else {
      console.log("Arguments.callee not available (strict mode)");
    }
    
    // Modificar arguments afeta parâmetros (non-strict mode)
    if (arguments.length > 0) {
      console.log("Original argument 0:", arguments[0]);
      arguments[0] = 'modificado';
      console.log("Modified argument 0:", arguments[0]);
      console.log("Parameter 'a' after modification:", a);
    }
    
    // Adicionar novos indices
    arguments[10] = 'novo valor';
    console.log("Added arguments[10]:", arguments[10]);
    console.log("New length:", arguments.length); // Length não muda!
    
    return { params: { a, b, c }, argsLength: arguments.length };
  }
  
  propriedadesArguments('primeiro', 'segundo');
  
  // ARGUMENTS VS REST COMPARISON
  console.log("\n=== Arguments vs Rest Comparison ===");
  
  // Função com arguments object
  function funcaoComArguments() {
    console.log("=== Function with Arguments ===");
    console.log("Arguments:", arguments);
    
    // Precisar converter para array para usar métodos
    const soma = Array.from(arguments)
      .filter(arg => typeof arg === 'number')
      .reduce((acc, num) => acc + num, 0);
    
    return soma;
  }
  
  // Função com rest parameters
  function funcaoComRest(...args) {
    console.log("=== Function with Rest ===");
    console.log("Rest args:", args);
    
    // Já é array, pode usar métodos diretamente
    const soma = args
      .filter(arg => typeof arg === 'number')
      .reduce((acc, num) => acc + num, 0);
    
    return soma;
  }
  
  const testValues = [1, 'a', 2, null, 3, undefined, 4];
  
  console.log("Arguments result:", funcaoComArguments(...testValues));
  console.log("Rest result:", funcaoComRest(...testValues));
  
  // ARGUMENTS OBJECT LIMITATIONS
  console.log("\n=== Arguments Object Limitations ===");
  
  function demonstrarLimitacoes() {
    console.log("Arguments limitations:");
    
    // 1. Não funciona com arrow functions
    const arrowFunction = () => {
      try {
        console.log("Arguments in arrow:", arguments);
      } catch (error) {
        console.log("Error: Arguments not available in arrow functions");
      }
    };
    
    arrowFunction(1, 2, 3);
    
    // 2. Array-like mas não array
    console.log("Arguments is array-like but not array:");
    console.log("  Has length:", 'length' in arguments);
    console.log("  Has numeric indices:", '0' in arguments);
    console.log("  Has forEach:", 'forEach' in arguments);
    console.log("  Has map:", 'map' in arguments);
    
    // 3. Performance considerations
    console.log("Performance note: arguments object creates overhead");
    
    // 4. Strict mode restrictions
    try {
      'use strict';
      console.log("Strict mode callee:", arguments.callee);
    } catch (error) {
      console.log("Strict mode error:", error.name);
    }
    
    return arguments;
  }
  
  demonstrarLimitacoes('test', 123);
  
  // ARGUMENTS OBJECT PATTERNS
  console.log("\n=== Arguments Object Patterns (Legacy) ===");
  
  function criarFuncaoVariadica() {
    return function funcaoVariadica() {
      console.log("Legacy variadic function called with", arguments.length, "arguments");
      
      // Pattern 1: Convert to array
      const argsArray = Array.prototype.slice.call(arguments);
      console.log("Converted to array:", argsArray);
      
      // Pattern 2: Loop through arguments
      let resultado = [];
      for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'string') {
          resultado.push(arguments[i].toUpperCase());
        } else if (typeof arguments[i] === 'number') {
          resultado.push(arguments[i] * 2);
        } else {
          resultado.push(arguments[i]);
        }
      }
      
      // Pattern 3: Use Array.from (ES6)
      const modernConversion = Array.from(arguments, (arg, index) => {
        return { index, value: arg, type: typeof arg };
      });
      
      console.log("Processed result:", resultado);
      console.log("Modern conversion:", modernConversion);
      
      return resultado;
    };
  }
  
  const funcaoLegacy = criarFuncaoVariadica();
  funcaoLegacy('hello', 42, true, { test: 'object' });
  
  // PERFORMANCE COMPARISON
  console.log("\n=== Performance Considerations ===");
  
  function testePerformance() {
    const iterations = 100000;
    
    // Arguments object version
    function argumentsVersion() {
      const args = Array.from(arguments);
      return args.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
    }
    
    // Rest parameters version
    function restVersion(...args) {
      return args.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
    }
    
    const testData = [1, 2, 3, 4, 5];
    
    console.time("Arguments Object Performance");
    for (let i = 0; i < iterations; i++) {
      argumentsVersion(...testData);
    }
    console.timeEnd("Arguments Object Performance");
    
    console.time("Rest Parameters Performance");
    for (let i = 0; i < iterations; i++) {
      restVersion(...testData);
    }
    console.timeEnd("Rest Parameters Performance");
    
    console.log("Note: Rest parameters are generally faster and more memory efficient");
  }
  
  testePerformance();
}

demonstrarArgumentsObject();

// Migration patterns from arguments to rest
function demonstrarMigrationPatterns() {
  console.log("\n=== Migration from Arguments to Rest ===");
  
  // BEFORE: Using arguments object
  console.log("=== Legacy Pattern (Arguments) ===");
  
  function legacyLogger() {
    var prefix = Array.prototype.shift.call(arguments);
    var messages = Array.prototype.slice.call(arguments);
    
    console.log('[' + prefix + ']', messages.join(' '));
    return messages;
  }
  
  // AFTER: Using rest parameters
  console.log("=== Modern Pattern (Rest) ===");
  
  function modernLogger(prefix, ...messages) {
    console.log(`[${prefix}]`, messages.join(' '));
    return messages;
  }
  
  // Test both versions
  legacyLogger('ERROR', 'Something', 'went', 'wrong');
  modernLogger('INFO', 'Application', 'started', 'successfully');
  
  // COMPLEX MIGRATION EXAMPLE
  console.log("\n=== Complex Migration Example ===");
  
  // Legacy: Complex argument processing
  function legacyComplexFunction() {
    var options = {};
    var callback = function() {};
    var data = [];
    
    // Process arguments based on types
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      
      if (typeof arg === 'function') {
        callback = arg;
      } else if (typeof arg === 'object' && !Array.isArray(arg) && arg !== null) {
        options = arg;
      } else if (Array.isArray(arg)) {
        data = arg;
      } else {
        data.push(arg);
      }
    }
    
    console.log('Legacy processed:', { options, callback: callback.name, data });
    return { options, callback, data };
  }
  
  // Modern: Using rest with destructuring
  function modernComplexFunction(...args) {
    let options = {};
    let callback = () => {};
    let data = [];
    
    // More readable argument processing
    args.forEach(arg => {
      if (typeof arg === 'function') {
        callback = arg;
      } else if (typeof arg === 'object' && !Array.isArray(arg) && arg !== null) {
        options = arg;
      } else if (Array.isArray(arg)) {
        data = arg;
      } else {
        data.push(arg);
      }
    });
    
    console.log('Modern processed:', { options, callback: callback.name, data });
    return { options, callback, data };
  }
  
  // Test migration
  const testCallback = function processData() { return 'processed'; };
  const testOptions = { timeout: 5000, debug: true };
  const testData = ['item1', 'item2', 'item3'];
  
  legacyComplexFunction(testCallback, testOptions, testData, 'extra');
  modernComplexFunction(testCallback, testOptions, testData, 'extra');
  
  console.log("\n=== Migration Benefits ===");
  console.log("✅ Rest parameters are true arrays");
  console.log("✅ Better performance and memory usage");
  console.log("✅ Works with arrow functions");
  console.log("✅ More readable and maintainable code");
  console.log("✅ Better IDE support and debugging");
  console.log("✅ Strict mode compatible");
  
  console.log("\n❌ Arguments object drawbacks:");
  console.log("- Array-like but not array");
  console.log("- Not available in arrow functions");
  console.log("- Deprecated features (callee, caller)");
  console.log("- Performance overhead");
  console.log("- Strict mode restrictions");
}

demonstrarMigrationPatterns();
```

---

## 🎯 Aplicabilidade e Contextos

### Modern Rest Parameter Patterns

```javascript
// Implementação de padrões modernos com rest parameters

class ModernRestPatterns {
  // Utility function factory
  static createUtilityFunctions() {
    console.log("\n=== Modern Utility Functions ===");
    
    // Mathematical operations with rest
    const math = {
      sum: (...numbers) => numbers.reduce((a, b) => a + b, 0),
      
      product: (...numbers) => numbers.reduce((a, b) => a * b, 1),
      
      average: (...numbers) => numbers.length > 0 ? 
        numbers.reduce((a, b) => a + b, 0) / numbers.length : 0,
      
      min: (...numbers) => numbers.length > 0 ? Math.min(...numbers) : undefined,
      
      max: (...numbers) => numbers.length > 0 ? Math.max(...numbers) : undefined,
      
      range: (...numbers) => {
        if (numbers.length === 0) return 0;
        return Math.max(...numbers) - Math.min(...numbers);
      },
      
      statistics: (...numbers) => {
        if (numbers.length === 0) return null;
        
        const sorted = [...numbers].sort((a, b) => a - b);
        const sum = numbers.reduce((a, b) => a + b, 0);
        const avg = sum / numbers.length;
        
        return {
          count: numbers.length,
          sum,
          average: avg,
          min: sorted[0],
          max: sorted[sorted.length - 1],
          median: sorted.length % 2 === 0 ?
            (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 :
            sorted[Math.floor(sorted.length / 2)],
          range: sorted[sorted.length - 1] - sorted[0]
        };
      }
    };
    
    // Test mathematical operations
    console.log("Math operations:");
    console.log("  Sum:", math.sum(1, 2, 3, 4, 5));
    console.log("  Product:", math.product(2, 3, 4));
    console.log("  Average:", math.average(10, 20, 30, 40));
    console.log("  Statistics:", math.statistics(5, 2, 8, 1, 9, 3, 7));
    
    return math;
  }
  
  // String manipulation utilities
  static createStringUtils() {
    console.log("\n=== String Utilities with Rest ===");
    
    const strings = {
      concat: (separator = '', ...strings) => strings.join(separator),
      
      template: (template, ...values) => {
        return template.replace(/{(\d+)}/g, (match, index) => {
          return values[index] !== undefined ? values[index] : match;
        });
      },
      
      padAll: (length, char = ' ', ...strings) => {
        return strings.map(str => str.toString().padStart(length, char));
      },
      
      capitalize: (...strings) => {
        return strings.map(str => 
          str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        );
      },
      
      longest: (...strings) => {
        return strings.reduce((longest, current) => 
          current.length > longest.length ? current : longest, ''
        );
      },
      
      shortest: (...strings) => {
        return strings.reduce((shortest, current) => 
          current.length < shortest.length ? current : shortest
        );
      },
      
      search: (pattern, ...strings) => {
        const regex = new RegExp(pattern, 'i');
        return strings
          .map((str, index) => ({ string: str, index, matches: regex.test(str) }))
          .filter(result => result.matches);
      }
    };
    
    // Test string utilities
    console.log("String utilities:");
    console.log("  Concat:", strings.concat(' | ', 'apple', 'banana', 'cherry'));
    console.log("  Template:", strings.template('Hello {0}, you are {1} years old', 'Alice', 25));
    console.log("  Pad all:", strings.padAll(8, '0', '123', '45', '6789'));
    console.log("  Capitalize:", strings.capitalize('hello', 'WORLD', 'JavaScript'));
    console.log("  Longest:", strings.longest('cat', 'elephant', 'dog', 'butterfly'));
    console.log("  Search:", strings.search('java', 'JavaScript', 'Python', 'Java', 'C++'));
    
    return strings;
  }
  
  // Array manipulation with rest
  static createArrayUtils() {
    console.log("\n=== Array Utilities with Rest ===");
    
    const arrays = {
      merge: (...arrays) => {
        return arrays.reduce((merged, arr) => merged.concat(arr), []);
      },
      
      unique: (...arrays) => {
        const merged = arrays.reduce((acc, arr) => acc.concat(arr), []);
        return [...new Set(merged)];
      },
      
      intersection: (...arrays) => {
        if (arrays.length === 0) return [];
        return arrays.reduce((result, array) => 
          result.filter(item => array.includes(item))
        );
      },
      
      difference: (first, ...others) => {
        const otherItems = new Set(others.flat());
        return first.filter(item => !otherItems.has(item));
      },
      
      zip: (...arrays) => {
        const maxLength = Math.max(...arrays.map(arr => arr.length));
        return Array.from({ length: maxLength }, (_, index) => 
          arrays.map(arr => arr[index])
        );
      },
      
      chunk: (size, ...items) => {
        const chunks = [];
        for (let i = 0; i < items.length; i += size) {
          chunks.push(items.slice(i, i + size));
        }
        return chunks;
      },
      
      partition: (predicate, ...items) => {
        const trueItems = [];
        const falseItems = [];
        
        items.forEach(item => {
          if (predicate(item)) {
            trueItems.push(item);
          } else {
            falseItems.push(item);
          }
        });
        
        return [trueItems, falseItems];
      }
    };
    
    // Test array utilities
    console.log("Array utilities:");
    console.log("  Merge:", arrays.merge([1, 2], [3, 4], [5, 6]));
    console.log("  Unique:", arrays.unique([1, 2, 3], [2, 3, 4], [3, 4, 5]));
    console.log("  Intersection:", arrays.intersection([1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]));
    console.log("  Difference:", arrays.difference([1, 2, 3, 4, 5], [2, 4], [5]));
    console.log("  Zip:", arrays.zip(['a', 'b', 'c'], [1, 2, 3], [true, false, true]));
    console.log("  Chunk:", arrays.chunk(3, 1, 2, 3, 4, 5, 6, 7, 8, 9));
    console.log("  Partition:", arrays.partition(x => x % 2 === 0, 1, 2, 3, 4, 5, 6, 7, 8, 9));
    
    return arrays;
  }
  
  // Function composition and piping
  static createFunctionUtils() {
    console.log("\n=== Function Composition with Rest ===");
    
    const functions = {
      compose: (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value),
      
      pipe: (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value),
      
      parallel: (...fns) => (value) => fns.map(fn => fn(value)),
      
      race: (...asyncFns) => async (value) => {
        const promises = asyncFns.map(fn => Promise.resolve(fn(value)));
        return Promise.race(promises);
      },
      
      all: (...asyncFns) => async (value) => {
        const promises = asyncFns.map(fn => Promise.resolve(fn(value)));
        return Promise.all(promises);
      },
      
      retry: (maxAttempts, ...fns) => async (value) => {
        const errors = [];
        
        for (const fn of fns) {
          for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
              return await fn(value);
            } catch (error) {
              errors.push({ fn: fn.name, attempt, error: error.message });
              if (attempt === maxAttempts) {
                continue; // Try next function
              }
              await new Promise(resolve => setTimeout(resolve, attempt * 100));
            }
          }
        }
        
        throw new Error(`All functions failed: ${JSON.stringify(errors)}`);
      },
      
      memoize: (...fns) => {
        const caches = fns.map(() => new Map());
        
        return fns.map((fn, index) => {
          return function memoizedFunction(...args) {
            const key = JSON.stringify(args);
            const cache = caches[index];
            
            if (cache.has(key)) {
              return cache.get(key);
            }
            
            const result = fn.apply(this, args);
            cache.set(key, result);
            return result;
          };
        });
      }
    };
    
    // Test function utilities
    const add5 = x => x + 5;
    const multiply2 = x => x * 2;
    const square = x => x ** 2;
    
    const composed = functions.compose(square, multiply2, add5);
    const piped = functions.pipe(add5, multiply2, square);
    const parallel = functions.parallel(add5, multiply2, square);
    
    console.log("Function utilities:");
    console.log("  Compose (square(multiply2(add5(3)))):", composed(3));
    console.log("  Pipe (square(multiply2(add5(3)))):", piped(3));
    console.log("  Parallel [add5(10), multiply2(10), square(10)]:", parallel(10));
    
    return functions;
  }
  
  // Event handling with rest parameters
  static createEventSystem() {
    console.log("\n=== Event System with Rest Parameters ===");
    
    class EventEmitter {
      constructor() {
        this.events = new Map();
      }
      
      on(event, ...handlers) {
        if (!this.events.has(event)) {
          this.events.set(event, []);
        }
        this.events.get(event).push(...handlers);
        console.log(`Added ${handlers.length} handler(s) for '${event}'`);
        return this;
      }
      
      emit(event, ...data) {
        if (!this.events.has(event)) {
          console.log(`No handlers for event '${event}'`);
          return false;
        }
        
        const handlers = this.events.get(event);
        console.log(`Emitting '${event}' to ${handlers.length} handler(s) with data:`, data);
        
        handlers.forEach((handler, index) => {
          try {
            handler(...data);
          } catch (error) {
            console.error(`Error in handler ${index} for '${event}':`, error.message);
          }
        });
        
        return true;
      }
      
      once(event, ...handlers) {
        const onceHandlers = handlers.map(handler => {
          const onceWrapper = (...args) => {
            handler(...args);
            this.off(event, onceWrapper);
          };
          return onceWrapper;
        });
        
        return this.on(event, ...onceHandlers);
      }
      
      off(event, ...handlersToRemove) {
        if (!this.events.has(event)) return this;
        
        if (handlersToRemove.length === 0) {
          this.events.delete(event);
          console.log(`Removed all handlers for '${event}'`);
        } else {
          const handlers = this.events.get(event);
          const filtered = handlers.filter(h => !handlersToRemove.includes(h));
          this.events.set(event, filtered);
          console.log(`Removed ${handlersToRemove.length} handler(s) for '${event}'`);
        }
        
        return this;
      }
    }
    
    // Test event system
    const emitter = new EventEmitter();
    
    const handler1 = (msg, code) => console.log(`Handler 1: ${msg} (${code})`);
    const handler2 = (msg, code) => console.log(`Handler 2: Processing ${msg}`);
    const handler3 = (msg, code) => console.log(`Handler 3: Code ${code} received`);
    
    emitter
      .on('message', handler1, handler2, handler3)
      .once('startup', () => console.log('System started!'))
      .emit('message', 'Hello World', 200)
      .emit('startup')
      .emit('startup') // Won't trigger again
      .off('message', handler2)
      .emit('message', 'Second message', 201);
    
    return emitter;
  }
}

// Demonstrate all modern patterns
function demonstrarModernPatterns() {
  console.log("=== Modern Rest Parameter Patterns ===");
  
  const math = ModernRestPatterns.createUtilityFunctions();
  const strings = ModernRestPatterns.createStringUtils();
  const arrays = ModernRestPatterns.createArrayUtils();
  const functions = ModernRestPatterns.createFunctionUtils();
  const events = ModernRestPatterns.createEventSystem();
  
  console.log("\n=== Summary of Modern Patterns ===");
  console.log("✅ Rest parameters provide clean, readable syntax");
  console.log("✅ True arrays with all array methods available");
  console.log("✅ Better performance than arguments object");
  console.log("✅ Works with arrow functions and modern JavaScript");
  console.log("✅ Excellent IDE support and debugging experience");
  console.log("✅ Future-proof and ES6+ compatible");
}

demonstrarModernPatterns();
```

---

## 📚 Conclusão

**Rest Parameters** e **Arguments Object** representam **different eras** do JavaScript function design, onde **rest parameters** emergiram como a **modern solution** para **variadic function handling**, oferecendo **superior performance**, **better developer experience** e **enhanced functionality** comparado ao **legacy arguments object**.

**Rest Parameters (`...args`) vantagens:**

- **True Array:** Todos os métodos de array disponíveis imediatamente
- **Named Parameters:** Semantic naming para melhor readability
- **Performance:** Faster execution e menos memory overhead
- **Arrow Function Compatibility:** Funciona em todos os tipos de função
- **Strict Mode:** Sem restrições ou deprecated features

**Arguments Object limitações:**

- **Array-like:** Requer conversão para usar métodos de array
- **Fixed Name:** Sempre `arguments`, sem semantic naming
- **Performance Overhead:** Slower execution e mais memory usage
- **Arrow Function Incompatible:** Não disponível em arrow functions
- **Deprecated Features:** `callee` e `caller` removidos em strict mode

**Use cases modernos:**

- **Utility Functions:** Mathematical operations, string manipulation
- **Function Composition:** Pipe, compose, parallel processing
- **Event Systems:** Multiple handler registration
- **API Design:** Flexible parameter acceptance
- **Collection Operations:** Array merging, filtering, transformation

**Migration strategy:**

1. **Replace arguments** com rest parameters em novas funções
2. **Convert existing functions** gradualmente para rest syntax  
3. **Use destructuring** para complex parameter patterns
4. **Leverage array methods** diretamente sem conversão
5. **Adopt modern patterns** para better maintainability

Adoptar **rest parameters** é **essential** para **modern JavaScript development**, oferecendo **cleaner syntax**, **better performance**, e **enhanced developer experience** que são **crucial** para **scalable application development** e **maintainable code architecture**.