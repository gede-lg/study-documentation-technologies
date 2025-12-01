# Module Pattern: Análise Conceitual

## 🎯 Definição

O **Module Pattern** é um design pattern que usa closures para criar **encapsulamento** e **privacidade** em JavaScript, simulando módulos com membros públicos e privados. É implementado usando IIFE (Immediately Invoked Function Expression).

```javascript
const Contador = (function() {
  // Variável privada (closure)
  let count = 0;

  // Interface pública
  return {
    incrementar: function() {
      count++;
      return count;
    },
    decrementar: function() {
      count--;
      return count;
    },
    obterValor: function() {
      return count;
    }
  };
})();

// Uso
console.log(Contador.incrementar()); // 1
console.log(Contador.incrementar()); // 2
console.log(Contador.obterValor()); // 2
console.log(Contador.count); // undefined (privado!)
```

## 📋 Estrutura Básica

```javascript
const MeuModulo = (function() {
  // 1. Membros privados
  const privado = 'Não acessível fora';

  function funcaoPrivada() {
    return 'Privada';
  }

  // 2. Membros públicos
  return {
    publico: 'Acessível',

    funcaoPublica: function() {
      // Pode acessar membros privados
      return funcaoPrivada() + ' chamada de pública';
    }
  };
})();

console.log(MeuModulo.publico); // 'Acessível'
console.log(MeuModulo.funcaoPublica()); // 'Privada chamada de pública'
console.log(MeuModulo.privado); // undefined
```

## 🧠 Variações

### Revealing Module Pattern

```javascript
const Calculadora = (function() {
  // Implementações privadas
  function somar(a, b) {
    return a + b;
  }

  function subtrair(a, b) {
    return a - b;
  }

  function multiplicar(a, b) {
    return a * b;
  }

  // Revelar apenas o que é público
  return {
    somar: somar,
    subtrair: subtrair
    // multiplicar permanece privado
  };
})();

console.log(Calculadora.somar(5, 3)); // 8
console.log(Calculadora.multiplicar); // undefined
```

### Module com Parâmetros

```javascript
const Configuracao = (function(ambiente) {
  const config = {
    desenvolvimento: {
      api: 'http://localhost:3000',
      debug: true
    },
    producao: {
      api: 'https://api.exemplo.com',
      debug: false
    }
  };

  const atual = config[ambiente] || config.desenvolvimento;

  return {
    obterAPI: function() {
      return atual.api;
    },
    debugAtivo: function() {
      return atual.debug;
    }
  };
})('producao');

console.log(Configuracao.obterAPI()); // 'https://api.exemplo.com'
```

## 🔍 Exemplo Completo: Gerenciador de Tarefas

```javascript
const GerenciadorTarefas = (function() {
  // Estado privado
  let tarefas = [];
  let proximoId = 1;

  // Funções privadas
  function validarTitulo(titulo) {
    if (typeof titulo !== 'string' || titulo.trim() === '') {
      throw new Error('Título inválido');
    }
  }

  function encontrarPorId(id) {
    return tarefas.find(function(t) {
      return t.id === id;
    });
  }

  // API pública
  return {
    adicionar: function(titulo) {
      validarTitulo(titulo);

      const tarefa = {
        id: proximoId++,
        titulo: titulo,
        concluida: false,
        dataCriacao: new Date()
      };

      tarefas.push(tarefa);
      return tarefa.id;
    },

    listar: function() {
      // Retorna cópia para não expor array interno
      return tarefas.map(function(t) {
        return Object.assign({}, t);
      });
    },

    concluir: function(id) {
      const tarefa = encontrarPorId(id);

      if (!tarefa) {
        throw new Error('Tarefa não encontrada');
      }

      tarefa.concluida = true;
      tarefa.dataConclusao = new Date();

      return true;
    },

    remover: function(id) {
      const index = tarefas.findIndex(function(t) {
        return t.id === id;
      });

      if (index === -1) {
        throw new Error('Tarefa não encontrada');
      }

      tarefas.splice(index, 1);
      return true;
    },

    obterEstatisticas: function() {
      return {
        total: tarefas.length,
        concluidas: tarefas.filter(function(t) {
          return t.concluida;
        }).length,
        pendentes: tarefas.filter(function(t) {
          return !t.concluida;
        }).length
      };
    }
  };
})();

// Uso
const id1 = GerenciadorTarefas.adicionar('Estudar JavaScript');
const id2 = GerenciadorTarefas.adicionar('Fazer exercícios');

console.log(GerenciadorTarefas.listar());
// [ { id: 1, titulo: 'Estudar JavaScript', ... }, ... ]

GerenciadorTarefas.concluir(id1);

console.log(GerenciadorTarefas.obterEstatisticas());
// { total: 2, concluidas: 1, pendentes: 1 }

// Não pode acessar dados privados
console.log(GerenciadorTarefas.tarefas); // undefined
console.log(GerenciadorTarefas.proximoId); // undefined
```

## ⚠️ Considerações

### Vantagens

- ✅ **Encapsulamento:** Dados privados reais
- ✅ **Namespace:** Evita poluição global
- ✅ **Organização:** Código estruturado e legível
- ✅ **Singleton:** Uma única instância

### Desvantagens

- ❌ **Imutável:** Não pode criar múltiplas instâncias
- ❌ **Testing:** Difícil testar membros privados
- ❌ **Memória:** Métodos não são compartilhados (não usam prototype)

## 🔗 Uso Moderno

Com ES6 modules, o Module Pattern é menos necessário:

```javascript
// ES6 Module (módulo.js)
let count = 0; // Privado ao módulo

export function incrementar() {
  count++;
  return count;
}

export function obterValor() {
  return count;
}

// count não é exportado = privado
```

Mas o Module Pattern permanece útil em:
- Código ES5/legado
- Navegadores sem suporte a modules
- Quando precisa de singleton simples
- Scripts inline em HTML

O Module Pattern é um padrão fundamental em JavaScript ES5 para criar privacidade e organização de código.
