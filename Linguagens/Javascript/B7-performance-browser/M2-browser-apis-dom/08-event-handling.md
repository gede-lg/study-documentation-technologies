# Event Handling: Manipulação de Eventos

## 🎯 Definição

**Event Handling** (manipulação de eventos) é o mecanismo pelo qual JavaScript responde a interações do usuário (cliques, digitação, movimento do mouse) e eventos do sistema (carregamento de página, erros, timers). O DOM fornece uma API robusta para registrar listeners, capturar eventos, controlar propagação e definir comportamentos customizados.

```javascript
// Registrar event listener
const botao = document.querySelector('#meuBotao');

botao.addEventListener('click', function(evento) {
  console.log('Botão clicado!');
  console.log('Alvo:', evento.target);
});
```

**Conceito:** Sistema de resposta a interações e eventos através de listeners.

## 📋 Tipos de Eventos

### Eventos de Mouse

```javascript
const elemento = document.querySelector('.box');

elemento.addEventListener('click', e => {
  console.log('Click:', e.clientX, e.clientY);
});

elemento.addEventListener('dblclick', e => {
  console.log('Duplo click');
});

elemento.addEventListener('mousedown', e => {
  console.log('Mouse pressionado');
});

elemento.addEventListener('mouseup', e => {
  console.log('Mouse solto');
});

elemento.addEventListener('mousemove', e => {
  console.log('Mouse movendo:', e.clientX, e.clientY);
});

elemento.addEventListener('mouseenter', e => {
  console.log('Mouse entrou'); // Não faz bubble
});

elemento.addEventListener('mouseleave', e => {
  console.log('Mouse saiu'); // Não faz bubble
});

elemento.addEventListener('mouseover', e => {
  console.log('Mouse sobre'); // Faz bubble
});

elemento.addEventListener('mouseout', e => {
  console.log('Mouse fora'); // Faz bubble
});

elemento.addEventListener('contextmenu', e => {
  e.preventDefault(); // Prevenir menu de contexto
  console.log('Clique direito');
});
```

### Eventos de Teclado

```javascript
document.addEventListener('keydown', e => {
  console.log('Tecla pressionada:', e.key);
  console.log('Código:', e.code);
  console.log('Ctrl:', e.ctrlKey);
  console.log('Alt:', e.altKey);
  console.log('Shift:', e.shiftKey);

  // Prevenir ação padrão (ex: Ctrl+S)
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    console.log('Salvando...');
  }
});

document.addEventListener('keyup', e => {
  console.log('Tecla solta:', e.key);
});

// keypress: deprecated, usar keydown
```

### Eventos de Formulário

```javascript
const form = document.querySelector('form');
const input = document.querySelector('input');

form.addEventListener('submit', e => {
  e.preventDefault(); // Prevenir envio padrão
  console.log('Formulário enviado');

  const dados = new FormData(form);
  console.log(Object.fromEntries(dados));
});

input.addEventListener('input', e => {
  console.log('Valor mudou:', e.target.value);
  // Dispara a cada caractere digitado
});

input.addEventListener('change', e => {
  console.log('Input alterado:', e.target.value);
  // Dispara quando input perde foco (após edição)
});

input.addEventListener('focus', e => {
  console.log('Input focado');
});

input.addEventListener('blur', e => {
  console.log('Input desfocado');
});

// Select
const select = document.querySelector('select');
select.addEventListener('change', e => {
  console.log('Opção selecionada:', e.target.value);
});

// Checkbox/Radio
const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.addEventListener('change', e => {
  console.log('Checked:', e.target.checked);
});
```

### Eventos de Janela/Documento

```javascript
// Carregamento
window.addEventListener('load', () => {
  console.log('Página completamente carregada (imagens, CSS, etc.)');
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado (antes de imagens/CSS)');
});

// Redimensionamento
window.addEventListener('resize', e => {
  console.log('Janela redimensionada:', window.innerWidth, window.innerHeight);
});

// Scroll
window.addEventListener('scroll', e => {
  console.log('Scroll:', window.scrollY);
});

document.addEventListener('scroll', e => {
  console.log('Documento scrollado');
});

// Visibilidade
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Aba oculta');
  } else {
    console.log('Aba visível');
  }
});

// Antes de sair
window.addEventListener('beforeunload', e => {
  e.preventDefault();
  e.returnValue = ''; // Necessário para alguns browsers
  // Mostra confirmação antes de fechar aba
});
```

## 🧠 Event Object

### Propriedades Principais

```javascript
elemento.addEventListener('click', e => {
  // Alvo do evento
  console.log(e.target);        // Elemento que disparou
  console.log(e.currentTarget); // Elemento com listener (this em função normal)

  // Tipo
  console.log(e.type); // 'click'

  // Coordenadas (mouse)
  console.log(e.clientX, e.clientY); // Relativo à viewport
  console.log(e.pageX, e.pageY);     // Relativo ao documento
  console.log(e.screenX, e.screenY); // Relativo à tela

  // Teclas modificadoras
  console.log(e.ctrlKey);
  console.log(e.altKey);
  console.log(e.shiftKey);
  console.log(e.metaKey); // Cmd (Mac) / Win (Windows)

  // Botão do mouse
  console.log(e.button); // 0: esquerdo, 1: meio, 2: direito

  // Timestamp
  console.log(e.timeStamp); // ms desde page load
});
```

### Métodos

```javascript
elemento.addEventListener('click', e => {
  // Prevenir ação padrão
  e.preventDefault();
  // Ex: prevenir submit de form, seguir link, etc.

  // Parar propagação (bubble/capture)
  e.stopPropagation();
  // Evento não propaga para pais/filhos

  // Parar propagação imediata
  e.stopImmediatePropagation();
  // Evento não propaga E não dispara outros listeners no mesmo elemento
});
```

## 🔍 Event Propagation

### Capturing e Bubbling

```javascript
// HTML:
// <div id="pai">
//   <button id="filho">Click</button>
// </div>

const pai = document.querySelector('#pai');
const filho = document.querySelector('#filho');

// Bubble phase (padrão): filho → pai → body → document
pai.addEventListener('click', () => {
  console.log('Pai (bubble)');
});

filho.addEventListener('click', () => {
  console.log('Filho (bubble)');
});

// Click no filho: "Filho (bubble)" → "Pai (bubble)"

// Capture phase: document → body → pai → filho
pai.addEventListener('click', () => {
  console.log('Pai (capture)');
}, { capture: true }); // ou true como 3º argumento

filho.addEventListener('click', () => {
  console.log('Filho (capture)');
}, { capture: true });

// Click no filho:
// "Pai (capture)" → "Filho (capture)" → "Filho (bubble)" → "Pai (bubble)"
```

### stopPropagation()

```javascript
filho.addEventListener('click', e => {
  console.log('Filho');
  e.stopPropagation(); // Para aqui
});

pai.addEventListener('click', () => {
  console.log('Pai'); // Não executa
});
```

### Event Delegation (Delegação)

```javascript
// ❌ Listener em cada item (ineficiente)
const items = document.querySelectorAll('.item');
items.forEach(item => {
  item.addEventListener('click', () => {
    console.log('Item clicado');
  });
});

// ✅ Listener único no pai (delegation)
const lista = document.querySelector('#lista');

lista.addEventListener('click', e => {
  // Verificar se alvo é item
  if (e.target.matches('.item')) {
    console.log('Item clicado:', e.target);
  }
});

// Funciona para items adicionados dinamicamente!
const novoItem = document.createElement('div');
novoItem.className = 'item';
lista.appendChild(novoItem); // Listener já funciona
```

## 🎯 addEventListener() vs Propriedades

### addEventListener() (Preferível)

```javascript
const botao = document.querySelector('button');

// Múltiplos listeners
botao.addEventListener('click', () => console.log('Listener 1'));
botao.addEventListener('click', () => console.log('Listener 2'));
// Ambos executam

// Remover listener específico
function handler() {
  console.log('Click');
}
botao.addEventListener('click', handler);
botao.removeEventListener('click', handler); // Remove apenas este
```

### Propriedades (Legado)

```javascript
// ❌ Apenas um listener por tipo
botao.onclick = () => console.log('Listener 1');
botao.onclick = () => console.log('Listener 2');
// Apenas "Listener 2" executa (sobrescreve)

// Remover: atribuir null
botao.onclick = null;
```

## ⚠️ Opções de addEventListener

### Options Object

```javascript
elemento.addEventListener('click', handler, {
  capture: false,      // Fase de capture (padrão: false = bubble)
  once: true,          // Remover automaticamente após primeira execução
  passive: true,       // Não chama preventDefault() (otimização)
  signal: controller.signal // AbortSignal para cancelamento
});
```

### once: true

```javascript
// Listener que executa apenas uma vez
botao.addEventListener('click', () => {
  console.log('Só executa uma vez');
}, { once: true });

// Equivalente a:
function handler() {
  console.log('Só executa uma vez');
  botao.removeEventListener('click', handler);
}
botao.addEventListener('click', handler);
```

### passive: true

```javascript
// Otimização para scroll/touch (não bloqueia)
document.addEventListener('touchstart', e => {
  // e.preventDefault(); // ❌ Não tem efeito com passive: true
  console.log('Touch');
}, { passive: true });

// Use passive: true para eventos que não chamam preventDefault()
// Melhora scroll performance
```

### signal (AbortController)

```javascript
const controller = new AbortController();

botao.addEventListener('click', () => {
  console.log('Click');
}, { signal: controller.signal });

// Remover listener
controller.abort();

// Útil para remover múltiplos listeners de uma vez
const controller2 = new AbortController();

botao.addEventListener('click', handler1, { signal: controller2.signal });
botao.addEventListener('mouseover', handler2, { signal: controller2.signal });
window.addEventListener('resize', handler3, { signal: controller2.signal });

controller2.abort(); // Remove todos de uma vez
```

## 🚀 Padrões Avançados

### Debounce

```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Uso: executar após usuário parar de digitar
const input = document.querySelector('input');
const buscar = debounce(() => {
  console.log('Buscando...', input.value);
}, 500);

input.addEventListener('input', buscar);
```

### Throttle

```javascript
function throttle(fn, limite) {
  let executando = false;
  return function(...args) {
    if (!executando) {
      fn.apply(this, args);
      executando = true;
      setTimeout(() => { executando = false; }, limite);
    }
  };
}

// Uso: limitar execuções de scroll
const handleScroll = throttle(() => {
  console.log('Scroll:', window.scrollY);
}, 200);

window.addEventListener('scroll', handleScroll);
```

### Custom Events

```javascript
// Criar evento customizado
const evento = new CustomEvent('meuEvento', {
  detail: { mensagem: 'Dados customizados' },
  bubbles: true,
  cancelable: true
});

// Listener
elemento.addEventListener('meuEvento', e => {
  console.log('Evento custom:', e.detail.mensagem);
});

// Disparar
elemento.dispatchEvent(evento);
```

### Event Bus

```javascript
class EventBus {
  constructor() {
    this.eventos = {};
  }

  on(tipo, handler) {
    if (!this.eventos[tipo]) {
      this.eventos[tipo] = [];
    }
    this.eventos[tipo].push(handler);
  }

  off(tipo, handler) {
    if (!this.eventos[tipo]) return;
    const index = this.eventos[tipo].indexOf(handler);
    if (index > -1) {
      this.eventos[tipo].splice(index, 1);
    }
  }

  emit(tipo, dados) {
    if (!this.eventos[tipo]) return;
    this.eventos[tipo].forEach(handler => handler(dados));
  }
}

// Uso
const bus = new EventBus();

bus.on('usuarioLogado', usuario => {
  console.log('Usuário:', usuario.nome);
});

bus.emit('usuarioLogado', { nome: 'João' });
```

### Keyboard Shortcuts

```javascript
const atalhos = {
  'Control+s': () => console.log('Salvar'),
  'Control+o': () => console.log('Abrir'),
  'Escape': () => console.log('Fechar modal')
};

document.addEventListener('keydown', e => {
  let teclas = [];

  if (e.ctrlKey) teclas.push('Control');
  if (e.altKey) teclas.push('Alt');
  if (e.shiftKey) teclas.push('Shift');
  teclas.push(e.key);

  const atalho = teclas.join('+');

  if (atalhos[atalho]) {
    e.preventDefault();
    atalhos[atalho]();
  }
});
```

Event handling é o mecanismo central de interatividade na web, permitindo aplicações responderem dinamicamente a ações do usuário e eventos do sistema com controle fino sobre propagação, timing e comportamento.
