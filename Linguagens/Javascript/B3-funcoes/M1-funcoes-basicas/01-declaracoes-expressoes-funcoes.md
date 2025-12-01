# Declarações e Expressões de Funções JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Function Declarations** e **Function Expressions** são duas **abordagens fundamentais** para definir funções em JavaScript, cada uma com **comportamentos distintos** relacionados a **hoisting**, **temporal accessibility**, **scope management** e **execution context**.

Representam **paradigmas diferentes** de **function definition** que impactam **code organization**, **execution timing**, **memory allocation** e **architectural patterns** em aplicações JavaScript modernas.

### Problema Fundamental que Resolve

Resolve a necessidade de **flexible function definition** permitindo **different timing strategies** para função availability, **conditional function creation**, **dynamic function assignment** e **modular code organization** essenciais para **scalable application architecture**.

---

## 📋 Sumário Conceitual

### Function Declarations
- **Hoisting completo** - função disponível antes da declaração
- **Named functions** - sempre possuem identifier
- **Block scoped** (strict mode) ou function scoped
- **Statement form** - não retorna valor

### Function Expressions  
- **No hoisting** - disponível apenas após assignment
- **Anonymous ou named** - identifier opcional
- **Expression form** - retorna função como valor
- **Conditional creation** - pode ser criada dinamicamente

---

## 🧠 Fundamentos Teóricos

### Anatomia das Function Declarations

#### Análise de Hoisting e Accessibility
```javascript
// Demonstração completa de function declarations e hoisting

function demonstrarFunctionDeclarations() {
  console.log("=== Function Declaration Hoisting ===");
  
  // HOISTING DEMONSTRATION
  console.log("=== Hoisting Behavior ===");
  
  // Função pode ser chamada ANTES da declaração (hoisting)
  console.log("Resultado antes da declaração:", calcularQuadrado(5));
  
  function calcularQuadrado(num) {
    return num * num;
  }
  
  console.log("Resultado após a declaração:", calcularQuadrado(7));
  
  // BLOCK SCOPING IN STRICT MODE
  console.log("\n=== Block Scoping ===");
  
  function demonstrarBlockScoping() {
    'use strict';
    
    if (true) {
      // Em strict mode, function declaration é block-scoped
      function funcaoBlocoA() {
        return "Função do bloco A";
      }
      
      console.log("Dentro do bloco A:", funcaoBlocoA());
    }
    
    if (false) {
      function funcaoBlocoB() {
        return "Função do bloco B";  
      }
    }
    
    // funcaoBlocoA não está acessível aqui (strict mode)
    try {
      console.log(funcaoBlocoA());
    } catch (error) {
      console.log("Erro esperado em strict mode:", error.name);
    }
  }
  
  demonstrarBlockScoping();
  
  // FUNCTION DECLARATION CHARACTERISTICS
  console.log("\n=== Function Declaration Characteristics ===");
  
  function exemploCompleto(a, b = 10) {
    console.log("Function name:", exemploCompleto.name);
    console.log("Function length:", exemploCompleto.length); // Número de parâmetros obrigatórios
    console.log("Arguments:", arguments.length);
    return a + b;
  }
  
  console.log("Resultado:", exemploCompleto(5));
  console.log("Function properties:");
  console.log("  toString():", exemploCompleto.toString().substring(0, 50) + "...");
  
  // NESTED FUNCTION DECLARATIONS
  console.log("\n=== Nested Function Declarations ===");
  
  function funcaoExterna(x) {
    console.log("Função externa executada com:", x);
    
    // Nested function declaration
    function funcaoInterna(y) {
      console.log("Função interna executada com:", y);
      return x + y; // Closure sobre variável x
    }
    
    // Nested function é hoisted dentro do scope da função externa
    return funcaoInterna(10);
  }
  
  console.log("Resultado nested:", funcaoExterna(5));
  
  // CONDITIONAL FUNCTION DECLARATIONS (PROBLEMATIC)
  console.log("\n=== Conditional Declarations (Avoid) ===");
  
  let condicao = true;
  
  if (condicao) {
    function funcaoCondicional() {
      return "Função criada condicionalmente";
    }
  }
  
  // Comportamento inconsistente entre engines
  try {
    console.log("Tentativa de usar função condicional:", funcaoCondicional());
  } catch (error) {
    console.log("Função condicional pode não estar disponível:", error.name);
  }
}

demonstrarFunctionDeclarations();

// Function declaration examples com diferentes patterns
function demonstrarPatternsDeclaration() {
  console.log("\n=== Declaration Patterns ===");
  
  // BASIC FUNCTION DECLARATION
  function adicionar(a, b) {
    return a + b;
  }
  
  // FUNCTION WITH DEFAULT PARAMETERS
  function saudar(nome = "Usuário", prefixo = "Olá") {
    return `${prefixo}, ${nome}!`;
  }
  
  // FUNCTION WITH REST PARAMETERS
  function somarTodos(...numeros) {
    return numeros.reduce((soma, num) => soma + num, 0);
  }
  
  // FUNCTION WITH DESTRUCTURING PARAMETERS
  function processarUsuario({ nome, idade, email = "não informado" }) {
    return {
      info: `${nome} (${idade} anos)`,
      contato: email,
      timestamp: new Date().toISOString()
    };
  }
  
  // RECURSIVE FUNCTION DECLARATION
  function calcularFatorial(n) {
    if (n <= 1) return 1;
    return n * calcularFatorial(n - 1);
  }
  
  console.log("Exemplos de uso:");
  console.log("  Adição:", adicionar(3, 7));
  console.log("  Saudação:", saudar("Maria"));
  console.log("  Soma variadic:", somarTodos(1, 2, 3, 4, 5));
  console.log("  Processamento:", processarUsuario({ nome: "João", idade: 30 }));
  console.log("  Fatorial:", calcularFatorial(5));
}

demonstrarPatternsDeclaration();
```

### Anatomia das Function Expressions

#### Análise de Assignment e Timing
```javascript
// Demonstração completa de function expressions

function demonstrarFunctionExpressions() {
  console.log("\n=== Function Expression Analysis ===");
  
  // NO HOISTING DEMONSTRATION
  console.log("=== No Hoisting Behavior ===");
  
  // Tentativa de usar função ANTES da expressão resulta em erro
  try {
    console.log("Tentativa antes da expressão:", multiplicar(3, 4));
  } catch (error) {
    console.log("Erro esperado (no hoisting):", error.name, "-", error.message);
  }
  
  // ANONYMOUS FUNCTION EXPRESSION
  const multiplicar = function(a, b) {
    return a * b;
  };
  
  console.log("Após a expressão:", multiplicar(3, 4));
  console.log("Function name (anonymous):", multiplicar.name); // ""
  
  // NAMED FUNCTION EXPRESSION
  const dividir = function operacaoDivisao(a, b) {
    if (b === 0) {
      throw new Error("Divisão por zero em " + operacaoDivisao.name);
    }
    return a / b;
  };
  
  console.log("Named expression:", dividir(10, 2));
  console.log("Function name (named):", dividir.name); // "operacaoDivisao"
  
  // CONDITIONAL FUNCTION EXPRESSIONS
  console.log("\n=== Conditional Function Creation ===");
  
  let tipoOperacao = "avancada";
  let funcaoCalculadora;
  
  if (tipoOperacao === "basica") {
    funcaoCalculadora = function(x, y) {
      return x + y;
    };
  } else if (tipoOperacao === "avancada") {
    funcaoCalculadora = function calculadoraAvancada(x, y, operador = '+') {
      switch (operador) {
        case '+': return x + y;
        case '-': return x - y;
        case '*': return x * y;
        case '/': return x / y;
        case '**': return x ** y;
        default: return NaN;
      }
    };
  }
  
  console.log("Calculadora criada condicionalmente:");
  console.log("  Adição:", funcaoCalculadora(5, 3));
  console.log("  Potenciação:", funcaoCalculadora(2, 8, '**'));
  
  // FUNCTION EXPRESSIONS AS VALUES
  console.log("\n=== Functions as Values ===");
  
  const operacoes = {
    somar: function(a, b) { return a + b; },
    subtrair: function(a, b) { return a - b; },
    multiplicar: function(a, b) { return a * b; },
    dividir: function(a, b) { return b !== 0 ? a / b : null; }
  };
  
  const arrayFuncoes = [
    function dobrar(x) { return x * 2; },
    function triplicar(x) { return x * 3; },
    function elevarAoQuadrado(x) { return x ** 2; }
  ];
  
  console.log("Operações em objeto:");
  console.log("  5 + 3 =", operacoes.somar(5, 3));
  console.log("  10 / 2 =", operacoes.dividir(10, 2));
  
  console.log("Funções em array:");
  arrayFuncoes.forEach((func, index) => {
    console.log(`  ${func.name}(4) =`, func(4));
  });
  
  // IMMEDIATELY INVOKED FUNCTION EXPRESSIONS (IIFE)
  console.log("\n=== IIFE Pattern ===");
  
  const resultadoIIFE = (function(nome, idade) {
    const dadosProcessados = {
      nomeCompleto: nome.toUpperCase(),
      categoria: idade >= 18 ? 'adulto' : 'menor',
      timestamp: Date.now()
    };
    
    console.log("IIFE executado com:", dadosProcessados);
    return dadosProcessados;
  })("João Silva", 25);
  
  console.log("Resultado IIFE:", resultadoIIFE);
  
  // FUNCTION EXPRESSIONS WITH CLOSURE
  console.log("\n=== Function Expressions with Closure ===");
  
  const criarContador = function() {
    let contador = 0;
    
    return function incrementar(valor = 1) {
      contador += valor;
      return contador;
    };
  };
  
  const meuContador = criarContador();
  console.log("Contador:", meuContador()); // 1
  console.log("Contador:", meuContador(5)); // 6
  console.log("Contador:", meuContador()); // 7
}

demonstrarFunctionExpressions();

// Performance comparison
function compararPerformance() {
  console.log("\n=== Performance Comparison ===");
  
  const iterations = 100000;
  
  // Function declaration
  function declaracaoTeste(x) {
    return x * 2 + 1;
  }
  
  // Function expression
  const expressaoTeste = function(x) {
    return x * 2 + 1;
  };
  
  // Named function expression
  const expressaoNomeadaTeste = function nomeadaTeste(x) {
    return x * 2 + 1;
  };
  
  console.log("Performance test com", iterations, "iterações:");
  
  // Test function declaration
  console.time("Function Declaration");
  for (let i = 0; i < iterations; i++) {
    declaracaoTeste(i);
  }
  console.timeEnd("Function Declaration");
  
  // Test function expression
  console.time("Function Expression");
  for (let i = 0; i < iterations; i++) {
    expressaoTeste(i);
  }
  console.timeEnd("Function Expression");
  
  // Test named function expression
  console.time("Named Function Expression");
  for (let i = 0; i < iterations; i++) {
    expressaoNomeadaTeste(i);
  }
  console.timeEnd("Named Function Expression");
  
  console.log("\nNote: Performance differences are usually negligible");
  console.log("Choose based on use case, not performance");
}

compararPerformance();
```

### Comparative Analysis

#### Análise Comparativa Detalhada
```javascript
// Análise comparativa completa entre declarations e expressions

function analisarComparativa() {
  console.log("\n=== Comparative Analysis ===");
  
  // HOISTING COMPARISON
  console.log("=== Hoisting Differences ===");
  
  console.log("1. Function Declaration Hoisting:");
  
  // Isso funciona devido ao hoisting
  try {
    console.log("  Resultado hoisted:", funcaoHoisted(10));
  } catch (e) {
    console.log("  Erro:", e.message);
  }
  
  function funcaoHoisted(x) {
    return x ** 2;
  }
  
  console.log("2. Function Expression Hoisting:");
  
  // Isso NÃO funciona - var é hoisted, mas assignment não
  try {
    console.log("  Resultado var expression:", varExpression(10));
  } catch (e) {
    console.log("  Erro esperado:", e.message);
  }
  
  var varExpression = function(x) {
    return x ** 2;
  };
  
  // Isso NÃO funciona - let/const são hoisted mas em temporal dead zone
  try {
    console.log("  Resultado const expression:", constExpression(10));
  } catch (e) {
    console.log("  Erro esperado:", e.message);
  }
  
  const constExpression = function(x) {
    return x ** 2;
  };
  
  // SCOPE BEHAVIOR
  console.log("\n=== Scope Behavior ===");
  
  function demonstrarEscopo() {
    if (true) {
      // Function declaration - behavior varies by mode
      function declInBlock() {
        return "Declaration in block";
      }
      
      // Function expression - always block scoped with let/const
      const exprInBlock = function() {
        return "Expression in block";
      };
      
      console.log("  Inside block:");
      console.log("    Declaration:", declInBlock());
      console.log("    Expression:", exprInBlock());
    }
    
    // Tentativa de acesso fora do bloco
    try {
      console.log("  Outside block - Declaration:", declInBlock());
    } catch (e) {
      console.log("  Outside block - Declaration error:", e.name);
    }
    
    try {
      console.log("  Outside block - Expression:", exprInBlock());
    } catch (e) {
      console.log("  Outside block - Expression error:", e.name);
    }
  }
  
  demonstrarEscopo();
  
  // CONDITIONAL CREATION
  console.log("\n=== Conditional Creation ===");
  
  let criarFuncoes = true;
  
  if (criarFuncoes) {
    // Declaration - pode ter comportamento inconsistente
    function condicionalDecl() {
      return "Conditional declaration";
    }
    
    // Expression - comportamento previsível
    var condicionalExpr = function() {
      return "Conditional expression";
    };
  }
  
  console.log("  Conditional functions:");
  try {
    console.log("    Declaration:", condicionalDecl());
  } catch (e) {
    console.log("    Declaration error:", e.name);
  }
  
  try {
    console.log("    Expression:", condicionalExpr());
  } catch (e) {
    console.log("    Expression error:", e.name);
  }
  
  // MEMORY AND PERFORMANCE
  console.log("\n=== Memory Implications ===");
  
  // Function declarations são criadas durante parsing
  console.log("  Function declarations:");
  console.log("    - Criadas durante parsing phase");
  console.log("    - Consomem memória imediatamente");
  console.log("    - Sempre nomeadas");
  
  console.log("  Function expressions:");
  console.log("    - Criadas durante execution");
  console.log("    - Memória alocada quando executadas");
  console.log("    - Podem ser anônimas");
  
  // RECURSION CAPABILITIES
  console.log("\n=== Recursion Comparison ===");
  
  // Declaration - sempre pode se referenciar pelo nome
  function fatorialDecl(n) {
    return n <= 1 ? 1 : n * fatorialDecl(n - 1);
  }
  
  // Anonymous expression - precisa de referência externa
  const fatorialExprAnonima = function(n) {
    return n <= 1 ? 1 : n * fatorialExprAnonima(n - 1);
  };
  
  // Named expression - pode se referenciar internamente
  const fatorialExprNomeada = function fatorial(n) {
    return n <= 1 ? 1 : n * fatorial(n - 1);
  };
  
  console.log("  Recursion results:");
  console.log("    Declaration 5!:", fatorialDecl(5));
  console.log("    Anonymous expr 5!:", fatorialExprAnonima(5));
  console.log("    Named expr 5!:", fatorialExprNomeada(5));
}

analisarComparativa();

// Best practices guide
function guiaBestPractices() {
  console.log("\n=== Best Practices Guide ===");
  
  console.log("QUANDO USAR FUNCTION DECLARATIONS:");
  console.log("✅ Funções utilitárias principais do módulo");
  console.log("✅ Funções que podem ser chamadas antes da definição");
  console.log("✅ Funções que fazem parte da API pública");
  console.log("✅ Recursão simples e direta");
  
  console.log("\nQUANDO USAR FUNCTION EXPRESSIONS:");
  console.log("✅ Funções condicionais ou dinâmicas");
  console.log("✅ Funções como valores (callbacks, arrays, objects)");
  console.log("✅ Closures e factory patterns");
  console.log("✅ Funções que precisam ser reatribuídas");
  console.log("✅ IIFE patterns");
  console.log("✅ Quando hoisting pode causar confusão");
  
  console.log("\nEVITE:");
  console.log("❌ Function declarations em blocos condicionais");
  console.log("❌ Misturar declarations e expressions sem critério");
  console.log("❌ Anonymous expressions para funções complexas");
  console.log("❌ Dependência excessiva de hoisting");
  
  console.log("\nRECOMENDAÇÕES MODERNAS:");
  console.log("💡 Prefira const para function expressions");
  console.log("💡 Use arrow functions para callbacks simples");
  console.log("💡 Nomeie function expressions para debug");
  console.log("💡 Seja consistente no projeto");
  console.log("💡 Consider ESLint rules para enforcar padrões");
}

guiaBestPractices();
```

---

## 🎯 Aplicabilidade e Contextos

### Casos de Uso Práticos

```javascript
// Implementação de casos de uso reais

class FunctionPatternsExamples {
  // Module pattern com function declarations
  static createModuleWithDeclarations() {
    console.log("\n=== Module Pattern with Declarations ===");
    
    function criarCalculadoraModule() {
      // Private variables (closure)
      let historico = [];
      let precisao = 2;
      
      // Public API usando function declarations
      function adicionar(a, b) {
        const resultado = Number((a + b).toFixed(precisao));
        registrarOperacao('adição', a, b, resultado);
        return resultado;
      }
      
      function multiplicar(a, b) {
        const resultado = Number((a * b).toFixed(precisao));
        registrarOperacao('multiplicação', a, b, resultado);
        return resultado;
      }
      
      function obterHistorico() {
        return [...historico]; // defensive copy
      }
      
      function configurarPrecisao(novaPrecisao) {
        if (novaPrecisao >= 0 && novaPrecisao <= 10) {
          precisao = novaPrecisao;
          return true;
        }
        return false;
      }
      
      // Private helper usando function declaration
      function registrarOperacao(tipo, a, b, resultado) {
        historico.push({
          tipo,
          operandos: [a, b],
          resultado,
          timestamp: new Date().toISOString()
        });
        
        // Limitar histórico a 10 itens
        if (historico.length > 10) {
          historico.shift();
        }
      }
      
      // Return public interface
      return {
        adicionar,
        multiplicar,
        obterHistorico,
        configurarPrecisao
      };
    }
    
    const calculadora = criarCalculadoraModule();
    
    console.log("Calculadora module:");
    console.log("  2 + 3 =", calculadora.adicionar(2, 3));
    console.log("  4 * 5 =", calculadora.multiplicar(4, 5));
    console.log("  Histórico:", calculadora.obterHistorico());
    
    return calculadora;
  }
  
  // Dynamic function creation com expressions
  static createDynamicFunctions() {
    console.log("\n=== Dynamic Function Creation ===");
    
    const operatorMap = {
      '+': function somar(a, b) { return a + b; },
      '-': function subtrair(a, b) { return a - b; },
      '*': function multiplicar(a, b) { return a * b; },
      '/': function dividir(a, b) { return b !== 0 ? a / b : null; },
      '%': function modulo(a, b) { return b !== 0 ? a % b : null; },
      '**': function potencia(a, b) { return a ** b; }
    };
    
    // Factory function usando expressions
    const criarValidador = function(tipo) {
      const validators = {
        email: function validarEmail(email) {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return regex.test(email);
        },
        
        telefone: function validarTelefone(telefone) {
          const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
          return regex.test(telefone);
        },
        
        cpf: function validarCPF(cpf) {
          const numerico = cpf.replace(/\D/g, '');
          return numerico.length === 11;
        },
        
        senha: function validarSenha(senha) {
          return senha.length >= 8 && 
                 /[A-Z]/.test(senha) && 
                 /[a-z]/.test(senha) && 
                 /\d/.test(senha);
        }
      };
      
      return validators[tipo] || function() { return false; };
    };
    
    // Conditional function assignment
    let processarDados;
    const ambiente = 'desenvolvimento'; // ou 'producao'
    
    if (ambiente === 'desenvolvimento') {
      processarDados = function debugProcessor(dados) {
        console.log("DEBUG: Processando dados:", dados);
        const resultado = dados.map(item => item * 2);
        console.log("DEBUG: Resultado:", resultado);
        return resultado;
      };
    } else {
      processarDados = function productionProcessor(dados) {
        return dados.map(item => item * 2);
      };
    }
    
    console.log("Operações dinâmicas:");
    console.log("  5 + 3 =", operatorMap['+'](5, 3));
    console.log("  2 ** 8 =", operatorMap['**'](2, 8));
    
    const validadorEmail = criarValidador('email');
    console.log("  Email válido:", validadorEmail('test@example.com'));
    
    console.log("  Processamento:", processarDados([1, 2, 3, 4]));
    
    return { operatorMap, criarValidador, processarDados };
  }
  
  // Event handling patterns
  static createEventHandlers() {
    console.log("\n=== Event Handling Patterns ===");
    
    // Simulated DOM-like event system
    class SimpleEventEmitter {
      constructor() {
        this.events = {};
      }
      
      on(event, handler) {
        if (!this.events[event]) {
          this.events[event] = [];
        }
        this.events[event].push(handler);
      }
      
      emit(event, data) {
        if (this.events[event]) {
          this.events[event].forEach(handler => {
            try {
              handler(data);
            } catch (error) {
              console.error(`Error in ${handler.name || 'anonymous'} handler:`, error.message);
            }
          });
        }
      }
    }
    
    const eventBus = new SimpleEventEmitter();
    
    // Function declaration para handler principal
    function handleUserLogin(userData) {
      console.log(`User ${userData.name} logged in at ${new Date().toLocaleTimeString()}`);
      
      // Nested function para logging
      function logActivity(action, user) {
        const logEntry = {
          timestamp: Date.now(),
          action,
          user: user.name,
          ip: user.ip || '127.0.0.1'
        };
        console.log("Activity log:", logEntry);
      }
      
      logActivity('login', userData);
    }
    
    // Function expressions para handlers específicos
    const handleUserLogout = function logoutHandler(userData) {
      console.log(`User ${userData.name} logged out`);
    };
    
    const handleDataUpdate = function(updateData) {
      console.log("Data updated:", updateData);
    };
    
    // Anonymous function para handler temporário
    eventBus.on('error', function(errorData) {
      console.error("System error:", errorData.message);
    });
    
    // IIFE para setup de handlers
    (function setupEventHandlers() {
      eventBus.on('user:login', handleUserLogin);
      eventBus.on('user:logout', handleUserLogout);
      eventBus.on('data:update', handleDataUpdate);
      
      console.log("Event handlers configurados");
    })();
    
    // Simular eventos
    eventBus.emit('user:login', { name: 'João', ip: '192.168.1.100' });
    eventBus.emit('data:update', { table: 'users', changes: 5 });
    eventBus.emit('user:logout', { name: 'João' });
    eventBus.emit('error', { message: 'Connection timeout' });
    
    return eventBus;
  }
  
  // Performance optimization patterns
  static createOptimizedFunctions() {
    console.log("\n=== Performance Optimization Patterns ===");
    
    // Memoization com function expression
    const criarMemoized = function(funcaoOriginal) {
      const cache = new Map();
      
      return function memoizedFunction(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
          console.log(`Cache hit para ${funcaoOriginal.name}`);
          return cache.get(key);
        }
        
        console.log(`Calculando ${funcaoOriginal.name}`);
        const resultado = funcaoOriginal.apply(this, args);
        cache.set(key, resultado);
        return resultado;
      };
    };
    
    // Função pesada para memoizar
    function calcularFibonacci(n) {
      if (n <= 1) return n;
      return calcularFibonacci(n - 1) + calcularFibonacci(n - 2);
    }
    
    const fibonacciMemoized = criarMemoized(calcularFibonacci);
    
    // Debounce pattern
    const criarDebounced = function(funcao, delay) {
      let timeoutId;
      
      return function debouncedFunction(...args) {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
          funcao.apply(this, args);
        }, delay);
      };
    };
    
    // Throttle pattern
    const criarThrottled = function(funcao, interval) {
      let lastCall = 0;
      
      return function throttledFunction(...args) {
        const now = Date.now();
        
        if (now - lastCall >= interval) {
          lastCall = now;
          funcao.apply(this, args);
        }
      };
    };
    
    // Teste de performance
    console.log("Performance tests:");
    
    console.time("Fibonacci normal (10)");
    calcularFibonacci(10);
    console.timeEnd("Fibonacci normal (10)");
    
    console.time("Fibonacci memoized (10) - first call");
    fibonacciMemoized(10);
    console.timeEnd("Fibonacci memoized (10) - first call");
    
    console.time("Fibonacci memoized (10) - cached call");
    fibonacciMemoized(10);
    console.timeEnd("Fibonacci memoized (10) - cached call");
    
    // Demo debounce/throttle
    const searchFunction = function(query) {
      console.log(`Searching for: ${query}`);
    };
    
    const debouncedSearch = criarDebounced(searchFunction, 300);
    const throttledSearch = criarThrottled(searchFunction, 1000);
    
    console.log("Debounced/Throttled functions created (would be used with user input)");
    
    return {
      fibonacciMemoized,
      debouncedSearch,
      throttledSearch
    };
  }
}

// Demonstração dos casos de uso
function demonstrarCasosUso() {
  console.log("=== Practical Use Cases ===");
  
  const calculadora = FunctionPatternsExamples.createModuleWithDeclarations();
  const dynamicFunctions = FunctionPatternsExamples.createDynamicFunctions();
  const eventHandlers = FunctionPatternsExamples.createEventHandlers();
  const optimizedFunctions = FunctionPatternsExamples.createOptimizedFunctions();
  
  console.log("\n=== Summary ===");
  console.log("Function declarations: Ideal para API estável, hoisting necessário");
  console.log("Function expressions: Ideal para dinamismo, condições, callbacks");
  console.log("Named expressions: Melhor para debugging e recursão");
  console.log("Anonymous expressions: Adequado para callbacks simples");
}

demonstrarCasosUso();
```

---

## 📚 Conclusão

**Function Declarations** e **Function Expressions** são **paradigmas complementares** que oferecem **different approaches** para **function definition**, cada um com **trade-offs específicos** em termos de **hoisting**, **scope behavior**, **memory allocation** e **architectural flexibility**.

**Características distintivas:**

- **Declarations:** Hoisting completo, sempre nomeadas, statement form
- **Expressions:** No hoisting, podem ser anônimas, expression form  
- **Timing:** Declarations disponíveis antes da definição, expressions apenas após assignment
- **Flexibility:** Expressions permitem conditional creation e dynamic assignment

**Casos de uso estratégicos:**

- **Declarations:** API modules, utility functions, recursive functions
- **Anonymous Expressions:** Callbacks, event handlers, IIFE patterns
- **Named Expressions:** Complex logic functions, debugging scenarios
- **Conditional Expressions:** Dynamic function creation, environment-specific logic

**Performance considerations:**

- **Memory:** Declarations consomem memória durante parsing, expressions durante execution
- **Optimization:** Engines otimizam ambos similarmente em runtime
- **Debugging:** Named functions facilitam stack traces e profiling

Dominar **function declarations** e **function expressions** é **fundamental** para **effective JavaScript architecture**, permitindo **strategic choices** baseadas em **use case requirements**, **code organization needs** e **performance considerations** essenciais para **maintainable applications**.