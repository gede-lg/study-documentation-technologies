# Exemplos Práticos de Closures em JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

Este tópico explora **aplicações concretas e padrões de design** que utilizam closures como mecanismo fundamental. Enquanto o conceito teórico de closures pode parecer abstrato, suas aplicações práticas são onipresentes em JavaScript moderno - desde simples contadores até arquiteturas modulares complexas.

Exemplos práticos de closures demonstram como este mecanismo resolve problemas reais de engenharia de software: encapsulamento de dados, gerenciamento de estado, criação de APIs elegantes, implementação de privacidade, e composição de comportamentos. Cada padrão representa uma solução idiomática para desafios comuns no desenvolvimento JavaScript.

### Contexto e Motivação

Closures não são apenas um conceito acadêmico - são ferramentas práticas usadas diariamente por desenvolvedores JavaScript. Frameworks como React, Vue e Angular dependem fortemente de closures. Bibliotecas de gerenciamento de estado (Redux, Zustand) as utilizam extensivamente. Programação assíncrona com callbacks e promises é impossível sem closures.

Dominar aplicações práticas de closures transforma desenvolvedores de intermediários em avançados, permitindo criar código mais elegante, seguro e manutenível.

---

## 📋 Padrões Práticos Fundamentais

### 1. Contador Privado

**Problema:** Criar um contador onde o valor não pode ser modificado diretamente.

**Solução:**

```javascript
function criarContador(valorInicial = 0) {
  let contagem = valorInicial; // Privado via closure

  return {
    incrementar() {
      contagem++;
      return contagem;
    },
    decrementar() {
      contagem--;
      return contagem;
    },
    obterValor() {
      return contagem;
    },
    resetar() {
      contagem = valorInicial;
    }
  };
}

// Uso
const contador = criarContador(10);
console.log(contador.incrementar()); // 11
console.log(contador.incrementar()); // 12
console.log(contador.decrementar()); // 11
console.log(contador.obterValor()); // 11
console.log(contador.contagem); // undefined - privado!
```

**Análise conceitual:** A variável `contagem` está completamente encapsulada. Não há como acessá-la ou modificá-la diretamente. Os métodos retornados (closures) são a única interface para interagir com o estado privado. Isso implementa o princípio de **information hiding** - apenas a interface necessária é exposta.

### 2. Factory Function com Configuração

**Problema:** Criar funções customizadas baseadas em parâmetros.

**Solução:**

```javascript
function criarSaudacao(prefixo, sufixo = "!") {
  return function(nome) {
    return `${prefixo} ${nome}${sufixo}`;
  };
}

// Criar funções especializadas
const saudacaoFormal = criarSaudacao("Prezado(a) Sr(a).", ".");
const saudacaoInformal = criarSaudacao("E aí", "!");
const saudacaoInglesa = criarSaudacao("Hello", ".");

console.log(saudacaoFormal("Silva")); // "Prezado(a) Sr(a). Silva."
console.log(saudacaoInformal("João")); // "E aí João!"
console.log(saudacaoInglesa("John")); // "Hello John."
```

**Análise conceitual:** Cada função retornada "lembra" de seus parâmetros específicos (`prefixo`, `sufixo`) através de closure. Isso permite criar **especializações** de uma função genérica sem duplicar código. É composição funcional pura.

### 3. Module Pattern (IIFE + Closures)

**Problema:** Criar módulo com métodos públicos e variáveis privadas.

**Solução:**

```javascript
const CarrinhoDeCompras = (function() {
  // Estado privado
  let itens = [];
  let total = 0;

  // Funções helper privadas
  function calcularTotal() {
    total = itens.reduce((soma, item) => soma + item.preco, 0);
  }

  // API pública (closures acessam estado privado)
  return {
    adicionar(item) {
      itens.push(item);
      calcularTotal();
    },

    remover(index) {
      if (index >= 0 && index < itens.length) {
        itens.splice(index, 1);
        calcularTotal();
      }
    },

    listar() {
      return itens.map(item => ({ ...item })); // Cópia defensiva
    },

    obterTotal() {
      return total;
    },

    limpar() {
      itens = [];
      total = 0;
    }
  };
})();

// Uso
CarrinhoDeCompras.adicionar({ nome: "Livro", preco: 30 });
CarrinhoDeCompras.adicionar({ nome: "Caneta", preco: 5 });
console.log(CarrinhoDeCompras.listar()); // [...]
console.log(CarrinhoDeCompras.obterTotal()); // 35
console.log(CarrinhoDeCompras.itens); // undefined - privado!
```

**Análise conceitual:** IIFE cria escopo isolado executado imediatamente. Variáveis `itens` e `total` são completamente privadas - nem reflection pode acessá-las. O objeto retornado é a interface pública, onde cada método é uma closure que mantém acesso ao estado privado. Este padrão foi extremamente popular antes de módulos ES6.

### 4. Gerador de IDs Únicos

**Problema:** Gerar IDs sequenciais únicos sem variável global.

**Solução:**

```javascript
const gerarId = (function() {
  let proximoId = 1;

  return function(prefixo = "ID") {
    return `${prefixo}_${proximoId++}`;
  };
})();

console.log(gerarId()); // "ID_1"
console.log(gerarId("USER")); // "USER_2"
console.log(gerarId("PRODUCT")); // "PRODUCT_3"
```

**Análise conceitual:** `proximoId` persiste entre chamadas (closure), mas está isolado do escopo global. Cada invocação incrementa o contador. Impossível resetar ou manipular externamente - garantia de unicidade.

### 5. Cache/Memoization

**Problema:** Memorizar resultados de função para evitar recálculos.

**Solução:**

```javascript
function memoize(funcao) {
  const cache = {}; // Privado via closure

  return function(...args) {
    const chave = JSON.stringify(args);

    if (chave in cache) {
      console.log("Retornando do cache:", chave);
      return cache[chave];
    }

    console.log("Calculando:", chave);
    const resultado = funcao(...args);
    cache[chave] = resultado;
    return resultado;
  };
}

// Função cara (exemplo)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const fibMemoizado = memoize(fibonacci);

console.log(fibMemoizado(10)); // Calcula
console.log(fibMemoizado(10)); // Retorna do cache
console.log(fibMemoizado(5)); // Calcula
```

**Análise conceitual:** O `cache` é privado à closure retornada. Cada função memoizada tem seu próprio cache isolado. A função original não é modificada - memoize retorna nova função com comportamento aumentado.

### 6. Event Handlers com Contexto

**Problema:** Event handler precisa acessar contexto externo.

**Solução:**

```javascript
function configurarBotoes(usuarios) {
  usuarios.forEach((usuario, index) => {
    const botao = document.getElementById(`botao-${index}`);

    botao.addEventListener('click', function() {
      // Closure captura 'usuario' e 'index'
      console.log(`Botão ${index} clicado: ${usuario.nome}`);
      processarUsuario(usuario);
    });
  });
}

// Cada handler tem seu próprio 'usuario' e 'index' capturados
```

**Análise conceitual:** Sem closures, seria impossível associar dados específicos a cada handler sem variáveis globais ou data attributes. Closures permitem que cada callback "lembre" seu contexto.

### 7. Debounce/Throttle

**Problema:** Limitar frequência de execução de função (útil para eventos de scroll, resize, input).

**Solução (Debounce):**

```javascript
function debounce(funcao, espera) {
  let timeoutId; // Privado via closure

  return function(...args) {
    const contexto = this;

    clearTimeout(timeoutId); // Cancela timeout anterior

    timeoutId = setTimeout(() => {
      funcao.apply(contexto, args);
    }, espera);
  };
}

// Uso
const buscarDebounced = debounce(function(termo) {
  console.log("Buscando:", termo);
  // Chamada à API...
}, 300);

// Usuário digita rapidamente:
buscarDebounced("j");
buscarDebounced("jo");
buscarDebounced("joa"); // Apenas esta executa após 300ms
```

**Análise conceitual:** `timeoutId` persiste entre chamadas (closure), permitindo cancelar timeout anterior. Cada instância de função debounced tem seu próprio `timeoutId`. Isso cria "memória" da última chamada.

### 8. Currying

**Problema:** Transformar função f(a, b, c) em f(a)(b)(c).

**Solução:**

```javascript
function curry(funcao) {
  return function curried(...args) {
    if (args.length >= funcao.length) {
      return funcao.apply(this, args);
    } else {
      return function(...args2) {
        // Closure captura 'args' anteriores
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

// Uso
function somar(a, b, c) {
  return a + b + c;
}

const somarCurried = curry(somar);

console.log(somarCurried(1)(2)(3)); // 6
console.log(somarCurried(1, 2)(3)); // 6
console.log(somarCurried(1)(2, 3)); // 6

// Partial application
const somar10 = somarCurried(10);
console.log(somar10(5)(3)); // 18
```

**Análise conceitual:** Cada chamada parcial retorna nova closure que "lembra" dos argumentos anteriores. Closures se acumulam até ter argumentos suficientes para chamar função original.

### 9. Once (Executar Apenas Uma Vez)

**Problema:** Garantir que função execute apenas uma vez.

**Solução:**

```javascript
function once(funcao) {
  let executou = false;
  let resultado;

  return function(...args) {
    if (!executou) {
      resultado = funcao.apply(this, args);
      executou = true;
    }
    return resultado;
  };
}

// Uso
const inicializar = once(function() {
  console.log("Inicializando sistema...");
  return { status: "pronto" };
});

console.log(inicializar()); // Log + { status: "pronto" }
console.log(inicializar()); // { status: "pronto" } (sem log)
console.log(inicializar()); // { status: "pronto" } (sem log)
```

**Análise conceitual:** `executou` e `resultado` são privados via closure. Primeira chamada executa e armazena resultado. Chamadas subsequentes retornam resultado armazenado sem re-executar.

### 10. Timer Privado

**Problema:** Criar timer com controles (pausar, retomar, resetar) e estado privado.

**Solução:**

```javascript
function criarTimer() {
  let segundos = 0;
  let intervalId = null;
  let rodando = false;

  return {
    iniciar() {
      if (!rodando) {
        rodando = true;
        intervalId = setInterval(() => {
          segundos++;
          console.log(`Tempo: ${segundos}s`);
        }, 1000);
      }
    },

    pausar() {
      if (rodando) {
        clearInterval(intervalId);
        rodando = false;
      }
    },

    resetar() {
      this.pausar();
      segundos = 0;
      console.log("Timer resetado");
    },

    obterTempo() {
      return segundos;
    }
  };
}

// Uso
const timer = criarTimer();
timer.iniciar();
// Após alguns segundos...
timer.pausar();
console.log(timer.obterTempo()); // Ex: 5
timer.resetar();
```

**Análise conceitual:** Todo o estado (`segundos`, `intervalId`, `rodando`) é privado. Métodos públicos são closures que manipulam esse estado. Impossível corromper o timer externamente.

---

## 🎯 Padrões Avançados

### 11. Revealing Module Pattern

Variação do Module Pattern que declara tudo privado e depois "revela" o que é público:

```javascript
const MeuModulo = (function() {
  // Tudo privado por padrão
  let contador = 0;

  function incrementar() {
    contador++;
  }

  function decrementar() {
    contador--;
  }

  function obterValor() {
    return contador;
  }

  function funcaoPrivada() {
    console.log("Privado");
  }

  // Revelar apenas o necessário
  return {
    incrementar,
    decrementar,
    obterValor
    // funcaoPrivada não é revelada
  };
})();
```

### 12. Namespace Pattern

Evitar poluição global criando namespace único:

```javascript
const MeuApp = MeuApp || {};

MeuApp.Utilitarios = (function() {
  function formatarData(data) {
    // ...
  }

  function validarEmail(email) {
    // ...
  }

  return {
    formatarData,
    validarEmail
  };
})();

MeuApp.Servicos = (function() {
  function buscarUsuario(id) {
    // ...
  }

  return {
    buscarUsuario
  };
})();

// Uso
MeuApp.Utilitarios.formatarData(new Date());
MeuApp.Servicos.buscarUsuario(123);
```

---

## ⚠️ Armadilhas e Considerações

### Memory Leaks

Closures mantêm referências - cuidado com objetos grandes:

```javascript
function criar() {
  let objetoGrande = new Array(1000000);

  return function() {
    // Mesmo sem usar, 'objetoGrande' permanece na memória
    console.log("função");
  };
}
```

### Performance em Loops

Criar closures em loops pode ter impacto:

```javascript
// Pode ser custoso
for (let i = 0; i < 10000; i++) {
  setTimeout(() => processar(i), 100);
  // 10000 closures criadas
}
```

---

## 🔗 Aplicabilidade Real

Closures são usadas em:
- **React Hooks:** `useState`, `useEffect` baseiam-se em closures
- **Redux:** Actions creators e thunks
- **Express.js:** Middleware com acesso a req/res
- **jQuery:** Callbacks e plugins
- **Lodash/Underscore:** Funções utilitárias (debounce, throttle, memoize)

---

## 🚀 Conclusão

Estes padrões não são apenas exemplos acadêmicos - são ferramentas práticas usadas diariamente em produção. Dominar esses padrões transforma a forma como você estrutura código JavaScript, permitindo criar APIs mais elegantes, seguras e manuteníveis.
