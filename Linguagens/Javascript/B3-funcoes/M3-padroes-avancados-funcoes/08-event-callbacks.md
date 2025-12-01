# Event Callbacks: Programação Orientada a Eventos em JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Event callbacks** são funções passadas para serem executadas em **resposta a eventos específicos** que ocorrem no sistema, navegador ou aplicação. Implementam o padrão **Observer** (Observador) e são a fundação da **programação orientada a eventos** (event-driven programming) em JavaScript.

Conceitualmente, event callbacks invertem o fluxo de controle tradicional: ao invés de código executar sequencialmente, ele **reage a eventos** quando eles acontecem. Isso modela interações assíncronas naturais: cliques do usuário, respostas de rede, timers, mudanças de estado.

```javascript
// Event callback básico
button.addEventListener('click', function() {
  console.log('Botão clicado!'); // Executado quando evento ocorre
});
```

### Contexto Histórico

JavaScript foi criado especificamente para interagir com páginas web de forma **event-driven**:

- **1995 (Netscape):** JavaScript criado para responder a eventos DOM (clicks, submits)
- **1999 (DOM Level 2):** API `addEventListener` padronizada
- **2009 (Node.js):** Event-driven programming no backend (EventEmitter)
- **Modern Web:** Eventos são base de frameworks (React, Vue, Angular)
- **Service Workers:** Eventos para PWAs e cache

Eventos são **DNA do JavaScript** - a linguagem foi projetada desde o início para programação assíncrona baseada em eventos.

### Problema que Resolve

Event callbacks resolvem problemas fundamentais de **interatividade** e **assincronia**:

**1. User Interaction:** Responder a ações do usuário (clicks, scroll, input)
**2. Async Operations:** Lidar com operações não-bloqueantes
**3. Decoupling:** Separar "quando acontece" de "o que fazer"
**4. Reactive UI:** Interface que reage a mudanças de estado
**5. Pub/Sub:** Comunicação entre componentes desacoplados

**Sem event callbacks (impossível em browsers):**
```javascript
// ❌ Não funciona - JavaScript é single-threaded
while (true) {
  if (buttonWasClicked()) { // Como saber?
    handleClick();
  }
}
```

**Com event callbacks:**
```javascript
// ✅ Código reage quando evento ocorre
button.addEventListener('click', handleClick);
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Event-Driven Architecture:** Programa reage a eventos, não executa linearmente
2. **Observer Pattern:** Callbacks "observam" e reagem a eventos
3. **Event Loop:** Mecanismo que processa eventos e callbacks
4. **Asynchronous Execution:** Callbacks executam fora da sequência original
5. **Event Propagation:** Eventos podem "borbulhar" pela árvore DOM

### Pilares Fundamentais

- **Event Target:** Objeto que dispara eventos (elementos DOM, window, objetos)
- **Event Type:** Tipo de evento (click, keypress, load, etc.)
- **Event Listener:** Callback registrado para escutar evento
- **Event Object:** Informações sobre o evento ocorrido
- **Event Handler:** Função que processa o evento

---

## 🧠 Fundamentos Teóricos

### Anatomia de um Event Listener

```javascript
// Estrutura básica
elemento.addEventListener(tipoEvento, callback, opcoes);

// Exemplo detalhado
const botao = document.querySelector('#meuBotao');

botao.addEventListener('click', function(evento) {
  // evento: objeto com informações sobre o evento
  console.log('Tipo:', evento.type); // 'click'
  console.log('Target:', evento.target); // elemento clicado
  console.log('Timestamp:', evento.timeStamp);
});
```

**Componentes:**
- **elemento:** Event target (quem escuta)
- **'click':** Event type (qual evento)
- **function(evento):** Event handler/callback (o que fazer)
- **evento:** Event object (informações do evento)

### Event Object

Cada evento passa um **objeto de evento** para o callback com informações contextuais:

```javascript
button.addEventListener('click', function(event) {
  console.log('=== PROPRIEDADES DO EVENT OBJECT ===');

  // Identificação
  console.log('type:', event.type); // 'click'
  console.log('target:', event.target); // elemento que disparou
  console.log('currentTarget:', event.currentTarget); // elemento com listener

  // Timing
  console.log('timeStamp:', event.timeStamp); // quando ocorreu

  // Estado
  console.log('bubbles:', event.bubbles); // evento borbulha?
  console.log('cancelable:', event.cancelable); // pode cancelar?
  console.log('defaultPrevented:', event.defaultPrevented);

  // Métodos de controle
  event.preventDefault(); // Previne comportamento padrão
  event.stopPropagation(); // Para propagação (bubbling)
  event.stopImmediatePropagation(); // Para todos os listeners
});
```

### Event Types (Tipos de Eventos)

**Mouse Events:**
```javascript
elemento.addEventListener('click', callback); // Clique
elemento.addEventListener('dblclick', callback); // Clique duplo
elemento.addEventListener('mousedown', callback); // Botão pressionado
elemento.addEventListener('mouseup', callback); // Botão solto
elemento.addEventListener('mousemove', callback); // Mouse movendo
elemento.addEventListener('mouseenter', callback); // Mouse entrou
elemento.addEventListener('mouseleave', callback); // Mouse saiu
elemento.addEventListener('mouseover', callback); // Mouse sobre (bubbles)
elemento.addEventListener('mouseout', callback); // Mouse fora (bubbles)
```

**Keyboard Events:**
```javascript
elemento.addEventListener('keydown', callback); // Tecla pressionada
elemento.addEventListener('keyup', callback); // Tecla solta
elemento.addEventListener('keypress', callback); // Tecla (deprecated)

// Event object contém informações da tecla
input.addEventListener('keydown', (e) => {
  console.log('Key:', e.key); // Tecla pressionada
  console.log('Code:', e.code); // Código físico da tecla
  console.log('Ctrl:', e.ctrlKey); // Ctrl pressionado?
  console.log('Shift:', e.shiftKey);
  console.log('Alt:', e.altKey);
});
```

**Form Events:**
```javascript
form.addEventListener('submit', callback); // Formulário enviado
input.addEventListener('input', callback); // Valor mudou (tempo real)
input.addEventListener('change', callback); // Valor mudou (blur)
input.addEventListener('focus', callback); // Elemento focado
input.addEventListener('blur', callback); // Elemento perdeu foco
```

**Document/Window Events:**
```javascript
window.addEventListener('load', callback); // Página carregada
window.addEventListener('DOMContentLoaded', callback); // DOM pronto
window.addEventListener('resize', callback); // Janela redimensionada
window.addEventListener('scroll', callback); // Scroll da página
document.addEventListener('visibilitychange', callback); // Aba ativa/inativa
```

---

## 🔍 Análise Conceitual Profunda

### Event Propagation (Propagação de Eventos)

Eventos no DOM têm **três fases** de propagação:

**1. Capturing Phase (Captura):** Evento desce da raiz até o target
**2. Target Phase (Alvo):** Evento atinge o elemento target
**3. Bubbling Phase (Borbulhamento):** Evento sobe do target até a raiz

```html
<div id="pai">
  <button id="filho">Clique</button>
</div>
```

```javascript
const pai = document.querySelector('#pai');
const filho = document.querySelector('#filho');

// Por padrão, listeners executam na fase de bubbling
filho.addEventListener('click', (e) => {
  console.log('1. Filho clicado');
});

pai.addEventListener('click', (e) => {
  console.log('2. Pai clicado (bubbling)');
});

// Terceiro parâmetro true = capturing phase
pai.addEventListener('click', (e) => {
  console.log('0. Pai clicado (capturing)');
}, true);

// Ao clicar no botão:
// 0. Pai clicado (capturing)    <- Desce
// 1. Filho clicado              <- Target
// 2. Pai clicado (bubbling)     <- Sobe
```

**Visualização:**

```
Capturing (↓)          Target          Bubbling (↑)
   window               ↓                 ↑
     ↓                  ↓                 ↑
  document              ↓                 ↑
     ↓                  ↓                 ↑
   <div>                ↓                 ↑
     ↓                  ↓                 ↑
  <button> ←────── CLICK AQUI ───────→ <button>
```

### Controlar Propagação

```javascript
// stopPropagation: Para bubbling/capturing
filho.addEventListener('click', (e) => {
  e.stopPropagation(); // Evento NÃO sobe para pai
  console.log('Filho clicado');
});

pai.addEventListener('click', (e) => {
  console.log('Pai NÃO será executado');
});

// stopImmediatePropagation: Para TODOS os listeners
filho.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
  console.log('Primeiro listener');
});

filho.addEventListener('click', (e) => {
  console.log('Este NÃO será executado');
});
```

### preventDefault: Cancelar Comportamento Padrão

```javascript
// Prevenir submit de formulário
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Não envia formulário
  console.log('Validando antes de enviar...');

  if (valido) {
    form.submit(); // Submete programaticamente
  }
});

// Prevenir link de navegar
link.addEventListener('click', (e) => {
  e.preventDefault(); // Não navega
  console.log('Link clicado, mas não navegou');
});

// Prevenir menu de contexto
elemento.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // Bloqueia clique direito
  mostrarMenuCustomizado();
});
```

### Event Delegation (Delegação de Eventos)

**Conceito:** Ao invés de adicionar listener em cada filho, adicionar no pai e usar bubbling.

```javascript
// ❌ Abordagem ineficiente
const botoes = document.querySelectorAll('.botao');
botoes.forEach(botao => {
  botao.addEventListener('click', handleClick); // N listeners
});

// ✅ Event delegation - um listener no pai
const container = document.querySelector('#container');

container.addEventListener('click', (e) => {
  // Verificar se clique foi em botão
  if (e.target.matches('.botao')) {
    handleClick(e);
  }
});
```

**Vantagens:**
- **Performance:** Um listener ao invés de muitos
- **Elementos Dinâmicos:** Funciona com elementos adicionados depois
- **Memória:** Menos listeners = menos memória

**Exemplo Prático: Lista Dinâmica**

```javascript
const lista = document.querySelector('#lista');

// Event delegation para itens dinâmicos
lista.addEventListener('click', (e) => {
  // Deletar item
  if (e.target.matches('.deletar')) {
    e.target.closest('li').remove();
  }

  // Editar item
  if (e.target.matches('.editar')) {
    const item = e.target.closest('li');
    const texto = prompt('Novo texto:', item.textContent);
    if (texto) item.textContent = texto;
  }
});

// Adicionar novos itens funciona automaticamente
function adicionarItem(texto) {
  const li = document.createElement('li');
  li.innerHTML = `
    ${texto}
    <button class="editar">Editar</button>
    <button class="deletar">Deletar</button>
  `;
  lista.appendChild(li);
}
```

### Remover Event Listeners

```javascript
// Para remover, callback deve ser função nomeada
function handleClick(e) {
  console.log('Clicado!');
}

// Adicionar
button.addEventListener('click', handleClick);

// Remover (mesma função, mesmo tipo, mesma fase)
button.removeEventListener('click', handleClick);

// ❌ NÃO funciona com função anônima
button.addEventListener('click', () => console.log('Oi'));
button.removeEventListener('click', () => console.log('Oi')); // Não remove!

// Padrão: Listener que se remove após execução
button.addEventListener('click', function listener(e) {
  console.log('Executado uma vez');
  button.removeEventListener('click', listener); // Remove a si mesmo
});

// ES6: Opção { once: true }
button.addEventListener('click', (e) => {
  console.log('Executado uma vez');
}, { once: true }); // Remove automaticamente
```

### Event Listener Options

```javascript
elemento.addEventListener('click', callback, {
  capture: false,      // false = bubbling (padrão), true = capturing
  once: false,         // true = remove após primeira execução
  passive: false,      // true = nunca chama preventDefault (performance)
  signal: abortSignal  // AbortSignal para remover listener depois
});

// Exemplo: passive para scroll performance
window.addEventListener('scroll', (e) => {
  // e.preventDefault() não funciona aqui
  console.log('Scrolling...');
}, { passive: true }); // Browser sabe que não vai cancelar

// Exemplo: AbortController para remover múltiplos listeners
const controller = new AbortController();

elemento.addEventListener('click', callback1, { signal: controller.signal });
elemento.addEventListener('mouseover', callback2, { signal: controller.signal });

// Remover todos de uma vez
controller.abort();
```

### Custom Events

Criar e disparar eventos customizados:

```javascript
// Criar evento customizado
const meuEvento = new CustomEvent('usuario-logado', {
  detail: {
    userId: 123,
    username: 'joao'
  },
  bubbles: true,
  cancelable: true
});

// Escutar evento customizado
document.addEventListener('usuario-logado', (e) => {
  console.log('Usuário:', e.detail.username);
});

// Disparar evento
document.dispatchEvent(meuEvento);

// Exemplo prático: Comunicação entre componentes
class Carrinho extends EventTarget {
  constructor() {
    super();
    this.itens = [];
  }

  adicionar(item) {
    this.itens.push(item);

    // Disparar evento customizado
    this.dispatchEvent(new CustomEvent('item-adicionado', {
      detail: { item, total: this.itens.length }
    }));
  }
}

const carrinho = new Carrinho();

carrinho.addEventListener('item-adicionado', (e) => {
  console.log(`Adicionado: ${e.detail.item}`);
  console.log(`Total: ${e.detail.total} itens`);
});

carrinho.adicionar('Livro'); // Dispara evento
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Event Callbacks

**✅ Use para:**

1. **User Interactions:** Clicks, inputs, gestos
2. **Async Operations:** Carregar dados, timers
3. **State Changes:** Mudanças de estado da aplicação
4. **Cross-Component Communication:** Pub/Sub entre componentes
5. **Browser APIs:** Eventos de navegação, conectividade, etc.

### Padrões Comuns

**1. Debounce/Throttle em Eventos de Alta Frequência:**

```javascript
// Debounce: Executar após parar de disparar
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Uso: busca ao digitar
const buscar = debounce((termo) => {
  console.log('Buscando:', termo);
}, 300);

input.addEventListener('input', (e) => buscar(e.target.value));

// Throttle: Limitar taxa de execução
function throttle(func, delay) {
  let ultimaExecucao = 0;
  return function(...args) {
    const agora = Date.now();
    if (agora - ultimaExecucao >= delay) {
      func.apply(this, args);
      ultimaExecucao = agora;
    }
  };
}

// Uso: scroll
const logScroll = throttle(() => {
  console.log('Scroll:', window.scrollY);
}, 100);

window.addEventListener('scroll', logScroll);
```

**2. Once Pattern (Executar Uma Vez):**

```javascript
// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  inicializarApp();
}, { once: true });

// Intro modal que aparece só uma vez
if (!localStorage.getItem('intro-visto')) {
  mostrarIntro();
  localStorage.setItem('intro-visto', 'true');
}
```

---

## ⚠️ Limitações e Considerações

### Memory Leaks

**Problema:** Event listeners não removidos causam vazamentos de memória.

```javascript
// ❌ Memory leak
function criarElemento() {
  const elemento = document.createElement('div');
  elemento.addEventListener('click', handleClick);
  document.body.appendChild(elemento);

  // Remover do DOM mas listener ainda existe na memória
  elemento.remove(); // Elemento fica na memória!
}

// ✅ Limpar listeners antes de remover
function criarElemento() {
  const elemento = document.createElement('div');
  const handleClick = () => console.log('Click');

  elemento.addEventListener('click', handleClick);
  document.body.appendChild(elemento);

  // Cleanup
  elemento.removeEventListener('click', handleClick);
  elemento.remove();
}
```

### Performance com Muitos Listeners

Use **event delegation** para evitar milhares de listeners:

```javascript
// ❌ 10.000 listeners
items.forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ 1 listener via delegation
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) handleClick(e);
});
```

---

## 🔗 Interconexões Conceituais

**Conceitos Relacionados:**
- **Callback Pattern:** Event callbacks são tipo específico de callback
- **Observer Pattern:** Base conceitual de event listeners
- **Event Loop:** Mecanismo que processa event callbacks
- **Promises:** Evolução para async, mas eventos ainda necessários para UI
- **Reactive Programming:** RxJS usa eventos como streams

---

## 🚀 Evolução e Próximos Conceitos

**Próximos Tópicos:**
- **Error-First Callbacks:** Convenção Node.js para callbacks
- **Callback Hell:** Problema de callbacks aninhados
- **Promises:** Alternativa moderna para async
- **Observables (RxJS):** Eventos como streams

Event callbacks são **fundação do JavaScript interativo**. Dominá-los é essencial para criar interfaces responsivas e aplicações event-driven modernas.
