# Mutation Observer: Observação de Mudanças no DOM

## 🎯 Definição

**MutationObserver** permite observar mudanças na árvore DOM de forma assíncrona, detectando adições/remoções de nós, modificações de atributos e alterações de conteúdo de texto. Substitui o legado Mutation Events (síncronos e deprecados), oferecendo API performática para reagir a modificações no DOM sem degradar performance.

```javascript
// Criar observer
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    console.log('Tipo:', mutation.type);
    console.log('Alvo:', mutation.target);

    if (mutation.type === 'childList') {
      console.log('Nós adicionados:', mutation.addedNodes);
      console.log('Nós removidos:', mutation.removedNodes);
    }

    if (mutation.type === 'attributes') {
      console.log('Atributo modificado:', mutation.attributeName);
    }
  });
});

// Observar elemento
const elemento = document.querySelector('#container');

observer.observe(elemento, {
  childList: true,      // Observar adições/remoções de filhos
  attributes: true,     // Observar mudanças de atributos
  characterData: true,  // Observar mudanças de texto
  subtree: true         // Observar descendentes também
});
```

**Conceito:** API assíncrona para observar modificações na árvore DOM.

## 📋 MutationObserver

### Construtor e Callback

```javascript
const observer = new MutationObserver((mutations, observer) => {
  // Callback executado quando DOM muda
  // mutations: array de MutationRecord
  // observer: próprio MutationObserver

  mutations.forEach(mutation => {
    console.log('Mutação detectada:', mutation);
  });
});
```

### Métodos

```javascript
const observer = new MutationObserver(callback);

// observe(): começar a observar elemento
observer.observe(elemento, opcoes);

// disconnect(): parar de observar
observer.disconnect();

// takeRecords(): obter mutations pendentes
const mutations = observer.takeRecords();
// Retorna array de MutationRecord que não foram processados
```

## 🧠 Opções de Observação

### childList

```javascript
// Observar adições/remoções de filhos diretos
observer.observe(elemento, {
  childList: true
});

// Detecta:
elemento.appendChild(novoElemento);      // ✅
elemento.removeChild(elemento.firstChild); // ✅
elemento.innerHTML = '<p>Novo</p>';      // ✅

// Não detecta:
elemento.textContent = 'Texto';          // ❌ (usa characterData)
elemento.setAttribute('class', 'ativo'); // ❌ (usa attributes)
```

### attributes

```javascript
// Observar mudanças em atributos
observer.observe(elemento, {
  attributes: true
});

// Detecta:
elemento.setAttribute('class', 'ativo');  // ✅
elemento.id = 'novoId';                   // ✅
elemento.className = 'box';               // ✅
elemento.dataset.value = '123';           // ✅

// Filtrar atributos específicos
observer.observe(elemento, {
  attributes: true,
  attributeFilter: ['class', 'id'] // Apenas class e id
});

// Guardar valores antigos
observer.observe(elemento, {
  attributes: true,
  attributeOldValue: true // mutation.oldValue disponível
});
```

### characterData

```javascript
// Observar mudanças em text nodes
const textoNode = elemento.firstChild; // Text node

observer.observe(elemento, {
  characterData: true,
  subtree: true // Necessário para observar text nodes descendentes
});

// Detecta:
textoNode.nodeValue = 'Novo texto';      // ✅
textoNode.data = 'Outro texto';          // ✅

// Guardar texto antigo
observer.observe(elemento, {
  characterData: true,
  characterDataOldValue: true, // mutation.oldValue disponível
  subtree: true
});
```

### subtree

```javascript
// subtree: false (padrão) - apenas elemento alvo
observer.observe(container, {
  childList: true,
  subtree: false
});

// Detecta apenas filhos diretos:
container.appendChild(div);               // ✅
container.firstChild.appendChild(span);   // ❌ (neto, não filho)

// subtree: true - elemento e todos descendentes
observer.observe(container, {
  childList: true,
  subtree: true
});

// Detecta em qualquer nível:
container.appendChild(div);               // ✅
container.firstChild.appendChild(span);   // ✅
container.querySelector('p').textContent = 'Novo'; // ✅ (com characterData)
```

## 🔍 MutationRecord

### Propriedades

```javascript
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    // type: tipo de mutação
    console.log(mutation.type);
    // 'childList', 'attributes', ou 'characterData'

    // target: nó que mudou
    console.log(mutation.target);

    // addedNodes: NodeList de nós adicionados (childList)
    console.log(mutation.addedNodes);

    // removedNodes: NodeList de nós removidos (childList)
    console.log(mutation.removedNodes);

    // previousSibling: irmão anterior dos nós adicionados/removidos
    console.log(mutation.previousSibling);

    // nextSibling: irmão seguinte
    console.log(mutation.nextSibling);

    // attributeName: nome do atributo modificado (attributes)
    console.log(mutation.attributeName);

    // attributeNamespace: namespace do atributo (XML)
    console.log(mutation.attributeNamespace);

    // oldValue: valor antigo (se *OldValue: true)
    console.log(mutation.oldValue);
  });
});
```

### Tipos de Mutações

```javascript
observer.observe(elemento, {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});

// childList
elemento.appendChild(document.createElement('div'));
// mutation.type === 'childList'
// mutation.addedNodes contém novo div

// attributes
elemento.setAttribute('class', 'ativo');
// mutation.type === 'attributes'
// mutation.attributeName === 'class'
// mutation.oldValue === valor anterior

// characterData
const textoNode = elemento.firstChild;
textoNode.nodeValue = 'Novo';
// mutation.type === 'characterData'
// mutation.oldValue === texto anterior
```

## 🎯 Casos de Uso

### Detectar Adição de Elementos

```javascript
// Reagir quando novos elementos são adicionados
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          console.log('Elemento adicionado:', node.tagName);

          // Inicializar elemento adicionado dinamicamente
          if (node.matches('.tooltip')) {
            inicializarTooltip(node);
          }
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

### Monitorar Mudanças de Classe

```javascript
// Detectar quando classe muda
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const elemento = mutation.target;
      const classesAntigas = mutation.oldValue?.split(' ') || [];
      const classesNovas = elemento.className.split(' ');

      const adicionadas = classesNovas.filter(c => !classesAntigas.includes(c));
      const removidas = classesAntigas.filter(c => !classesNovas.includes(c));

      console.log('Classes adicionadas:', adicionadas);
      console.log('Classes removidas:', removidas);
    }
  });
});

observer.observe(elemento, {
  attributes: true,
  attributeFilter: ['class'],
  attributeOldValue: true
});
```

### Auto-save em Editor

```javascript
// Salvar automaticamente quando conteúdo muda
const editor = document.querySelector('#editor');

const observer = new MutationObserver(debounce(() => {
  const conteudo = editor.innerHTML;
  salvarRascunho(conteudo);
  console.log('Rascunho salvo');
}, 1000));

observer.observe(editor, {
  childList: true,
  characterData: true,
  subtree: true
});

function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### Validação de Formulário Dinâmico

```javascript
// Reagir quando novos campos são adicionados ao formulário
const form = document.querySelector('form');

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Adicionar validação a novos inputs
        const inputs = node.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          adicionarValidacao(input);
        });
      }
    });
  });
});

observer.observe(form, {
  childList: true,
  subtree: true
});
```

### Detectar Remoção de Elementos

```javascript
// Cleanup quando elementos são removidos
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.removedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        console.log('Elemento removido:', node);

        // Cleanup de event listeners, timers, etc.
        if (node.dataset.componentId) {
          limparComponente(node.dataset.componentId);
        }
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

### Polyfill de Custom Elements

```javascript
// Emular comportamento de Custom Elements em browsers antigos
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Verificar se é custom element
        if (node.tagName.includes('-')) {
          inicializarCustomElement(node);
        }

        // Verificar descendentes
        node.querySelectorAll('[is]').forEach(el => {
          inicializarCustomElement(el);
        });
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

## ⚠️ Performance e Boas Práticas

### Batch de Mutações

```javascript
// MutationObserver agrupa mutações automaticamente
elemento.appendChild(div1);
elemento.appendChild(div2);
elemento.appendChild(div3);

// Callback recebe array com 3 mutations (ou mais, agrupadas)
// Não dispara callback 3 vezes separadamente
```

### Evitar Loops Infinitos

```javascript
// ❌ Loop infinito: observer modifica DOM, dispara nova mutation
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    // Modificar DOM no callback
    mutation.target.classList.add('processado'); // Dispara nova mutation!
  });
});

observer.observe(elemento, {
  attributes: true,
  subtree: true
});

// ✅ Solução 1: Desconectar temporariamente
const observer = new MutationObserver(mutations => {
  observer.disconnect(); // Parar observação

  mutations.forEach(mutation => {
    mutation.target.classList.add('processado');
  });

  observer.observe(elemento, opcoes); // Reativar observação
});

// ✅ Solução 2: Verificar condição
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (!mutation.target.classList.contains('processado')) {
      mutation.target.classList.add('processado');
    }
  });
});
```

### Limitar Escopo

```javascript
// ❌ Observar todo documento (ineficiente)
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// ✅ Observar apenas container específico
const container = document.querySelector('#app');
observer.observe(container, {
  childList: true,
  subtree: true
});
```

### Cleanup

```javascript
// Sempre desconectar observer quando não mais necessário
class Componente {
  constructor(elemento) {
    this.elemento = elemento;
    this.observer = new MutationObserver(this.handleMutation.bind(this));

    this.observer.observe(this.elemento, {
      childList: true,
      attributes: true
    });
  }

  handleMutation(mutations) {
    // ...
  }

  destruir() {
    this.observer.disconnect(); // Importante!
  }
}
```

## 🚀 Wrapper Útil

```javascript
class DOMObserver {
  constructor() {
    this.observers = new Map();
  }

  onAdd(container, callback) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            callback(node);
          }
        });
      });
    });

    observer.observe(container, {
      childList: true,
      subtree: true
    });

    this.observers.set(callback, observer);
    return () => this.off(callback);
  }

  onRemove(container, callback) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            callback(node);
          }
        });
      });
    });

    observer.observe(container, {
      childList: true,
      subtree: true
    });

    this.observers.set(callback, observer);
    return () => this.off(callback);
  }

  onAttributeChange(elemento, atributo, callback) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === atributo) {
          callback(mutation.target, mutation.oldValue);
        }
      });
    });

    observer.observe(elemento, {
      attributes: true,
      attributeFilter: [atributo],
      attributeOldValue: true
    });

    this.observers.set(callback, observer);
    return () => this.off(callback);
  }

  off(callback) {
    const observer = this.observers.get(callback);
    if (observer) {
      observer.disconnect();
      this.observers.delete(callback);
    }
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Uso
const domObserver = new DOMObserver();

const unsubscribe = domObserver.onAdd(document.body, elemento => {
  console.log('Elemento adicionado:', elemento);
});

// Parar de observar
unsubscribe();
```

MutationObserver é essencial para aplicações que precisam reagir a mudanças dinâmicas no DOM, permitindo criar componentes reativos, polyfills, ferramentas de debugging e frameworks sem comprometer performance.
