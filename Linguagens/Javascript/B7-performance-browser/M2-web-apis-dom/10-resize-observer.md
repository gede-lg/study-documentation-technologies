# Resize Observer: Detecção de Redimensionamento

## 🎯 Definição

**ResizeObserver** detecta mudanças nas dimensões de elementos de forma assíncrona e performática, disparando callbacks quando largura ou altura mudam. Substitui técnicas antiquadas como polling com `setInterval` ou listeners de `window.resize`, oferecendo detecção precisa de redimensionamento específico por elemento, incluindo mudanças causadas por CSS, conteúdo dinâmico ou media queries.

```javascript
// Criar observer
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    console.log('Elemento:', entry.target);
    console.log('Nova largura:', entry.contentRect.width);
    console.log('Nova altura:', entry.contentRect.height);
  });
});

// Observar elemento
const elemento = document.querySelector('.box');
observer.observe(elemento);
```

**Conceito:** API assíncrona para detectar mudanças nas dimensões de elementos.

## 📋 ResizeObserver

### Construtor e Callback

```javascript
const observer = new ResizeObserver((entries, observer) => {
  // Callback executado quando dimensões mudam
  // entries: array de ResizeObserverEntry
  // observer: próprio ResizeObserver

  entries.forEach(entry => {
    console.log('Target:', entry.target);
    console.log('ContentRect:', entry.contentRect);
    console.log('BorderBoxSize:', entry.borderBoxSize);
    console.log('ContentBoxSize:', entry.contentBoxSize);
  });
});
```

### Métodos

```javascript
const observer = new ResizeObserver(callback);

// observe(): começar a observar elemento
observer.observe(elemento);

// observe() com opções (box model)
observer.observe(elemento, { box: 'border-box' });
// Opções: 'content-box' (padrão), 'border-box', 'device-pixel-content-box'

// unobserve(): parar de observar elemento específico
observer.unobserve(elemento);

// disconnect(): parar de observar todos elementos
observer.disconnect();
```

## 🧠 ResizeObserverEntry

### contentRect

```javascript
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const rect = entry.contentRect;

    console.log('x:', rect.x);           // Posição X (geralmente 0)
    console.log('y:', rect.y);           // Posição Y (geralmente 0)
    console.log('width:', rect.width);   // Largura da content box
    console.log('height:', rect.height); // Altura da content box
    console.log('top:', rect.top);       // Mesmo que y
    console.log('right:', rect.right);   // x + width
    console.log('bottom:', rect.bottom); // y + height
    console.log('left:', rect.left);     // Mesmo que x
  });
});
```

### borderBoxSize / contentBoxSize

```javascript
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    // borderBoxSize: dimensões incluindo padding e border
    const borderBox = entry.borderBoxSize[0]; // Array (multi-column)
    console.log('Border box width:', borderBox.inlineSize);
    console.log('Border box height:', borderBox.blockSize);

    // contentBoxSize: dimensões do conteúdo (sem padding/border)
    const contentBox = entry.contentBoxSize[0];
    console.log('Content box width:', contentBox.inlineSize);
    console.log('Content box height:', contentBox.blockSize);

    // devicePixelContentBoxSize: em pixels de dispositivo (raro)
    if (entry.devicePixelContentBoxSize) {
      const deviceBox = entry.devicePixelContentBoxSize[0];
      console.log('Device pixels width:', deviceBox.inlineSize);
    }
  });
});
```

### target

```javascript
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    // target: elemento sendo observado
    const elemento = entry.target;

    console.log('Tag:', elemento.tagName);
    console.log('ID:', elemento.id);
    console.log('Classes:', elemento.className);
  });
});
```

## 🔍 Box Model Options

### content-box (Padrão)

```javascript
// Observar content box (sem padding/border)
observer.observe(elemento, { box: 'content-box' });

// Útil para detectar mudanças no conteúdo
```

### border-box

```javascript
// Observar border box (incluindo padding e border)
observer.observe(elemento, { box: 'border-box' });

// Útil para layout baseado em dimensões totais
```

### device-pixel-content-box

```javascript
// Observar em pixels de dispositivo (alta resolução)
observer.observe(elemento, { box: 'device-pixel-content-box' });

// Útil para canvas, gráficos de alta resolução
```

## 🎯 Casos de Uso

### Gráfico Responsivo

```javascript
// Redimensionar gráfico quando container muda
const chartContainer = document.querySelector('#chart');
const chart = criarGrafico(chartContainer);

const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;

    // Redimensionar gráfico
    chart.resize(width, height);
  });
});

observer.observe(chartContainer);
```

### Canvas Responsivo

```javascript
// Ajustar resolução de canvas baseado em tamanho
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    const dpr = window.devicePixelRatio || 1;

    // Ajustar resolução para alta densidade
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Escalar contexto
    ctx.scale(dpr, dpr);

    // Redesenhar
    desenhar();
  });
});

observer.observe(canvas);
```

### Layout Adaptativo

```javascript
// Adicionar classes baseado em largura do elemento
const card = document.querySelector('.card');

const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const largura = entry.contentRect.width;

    // Remover classes antigas
    card.classList.remove('pequeno', 'medio', 'grande');

    // Adicionar classe baseado em largura
    if (largura < 300) {
      card.classList.add('pequeno');
    } else if (largura < 600) {
      card.classList.add('medio');
    } else {
      card.classList.add('grande');
    }
  });
});

observer.observe(card);
```

### Textarea Auto-resize

```javascript
// Ajustar altura de textarea baseado em conteúdo
const textarea = document.querySelector('textarea');

const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const { height } = entry.contentRect;

    // Ajustar altura para caber conteúdo
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  });
});

observer.observe(textarea);

// Também observar mudanças de conteúdo
textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
});
```

### Container Queries Polyfill

```javascript
// Emular container queries
const container = document.querySelector('.container');

const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const largura = entry.contentRect.width;

    // Definir custom properties baseado em largura
    container.style.setProperty('--container-width', `${largura}px`);

    // Adicionar data attributes para queries CSS
    if (largura < 400) {
      container.dataset.size = 'small';
    } else if (largura < 800) {
      container.dataset.size = 'medium';
    } else {
      container.dataset.size = 'large';
    }
  });
});

observer.observe(container);

// CSS:
// .container[data-size="small"] .item { /* ... */ }
// .container[data-size="medium"] .item { /* ... */ }
// .container[data-size="large"] .item { /* ... */ }
```

### Sincronizar Altura de Elementos

```javascript
// Manter elementos com mesma altura
const elementos = document.querySelectorAll('.sync-height');

const observer = new ResizeObserver(() => {
  // Encontrar altura máxima
  let alturaMaxima = 0;

  elementos.forEach(el => {
    el.style.height = 'auto'; // Reset
    alturaMaxima = Math.max(alturaMaxima, el.offsetHeight);
  });

  // Aplicar altura máxima a todos
  elementos.forEach(el => {
    el.style.height = alturaMaxima + 'px';
  });
});

elementos.forEach(el => observer.observe(el));
```

### Lazy Loading baseado em Tamanho

```javascript
// Carregar imagem de resolução apropriada
const img = document.querySelector('img');

const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const largura = entry.contentRect.width;

    // Escolher resolução apropriada
    let src;
    if (largura < 400) {
      src = img.dataset.srcSmall;
    } else if (largura < 800) {
      src = img.dataset.srcMedium;
    } else {
      src = img.dataset.srcLarge;
    }

    // Carregar apenas se mudou
    if (img.src !== src) {
      img.src = src;
    }
  });
});

observer.observe(img.parentElement); // Observar container
```

## ⚠️ Performance e Considerações

### Throttle de Callbacks

```javascript
// Limitar frequência de execução
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

const observer = new ResizeObserver(throttle(entries => {
  entries.forEach(entry => {
    console.log('Resize:', entry.contentRect);
  });
}, 100)); // Executar no máximo a cada 100ms

observer.observe(elemento);
```

### Loop de Resize

```javascript
// ⚠️ Cuidado: modificar dimensões no callback pode causar loop

// ❌ Loop infinito potencial
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    // Modificar dimensão dispara novo resize!
    entry.target.style.width = entry.contentRect.width + 10 + 'px';
  });
});

// ✅ Evitar modificar dimensões no callback
// Ou usar requestAnimationFrame para batchear
const observer = new ResizeObserver(entries => {
  requestAnimationFrame(() => {
    entries.forEach(entry => {
      // Modificar aqui é mais seguro
    });
  });
});
```

### Cleanup

```javascript
// Sempre desconectar quando não mais necessário
class ResponsiveComponent {
  constructor(elemento) {
    this.elemento = elemento;
    this.observer = new ResizeObserver(this.handleResize.bind(this));
    this.observer.observe(this.elemento);
  }

  handleResize(entries) {
    entries.forEach(entry => {
      // ...
    });
  }

  destruir() {
    this.observer.disconnect(); // Importante!
  }
}
```

### Comparação com window.resize

```javascript
// ❌ window.resize: apenas redimensionamento de janela
window.addEventListener('resize', () => {
  // Dispara quando janela redimensiona
  // Não detecta mudanças de elemento específico
  // Pode disparar muito (throttling manual necessário)
});

// ✅ ResizeObserver: elemento específico
const observer = new ResizeObserver(entries => {
  // Dispara quando ELEMENTO redimensiona
  // Detecta mudanças por CSS, conteúdo, etc.
  // Throttling automático
});

observer.observe(elemento);
```

## 🚀 Padrões Avançados

### Wrapper com Promises

```javascript
function observarResize(elemento, callback) {
  const observer = new ResizeObserver(entries => {
    entries.forEach(entry => {
      callback(entry.contentRect, entry.target);
    });
  });

  observer.observe(elemento);

  // Retornar função de cleanup
  return () => observer.disconnect();
}

// Uso
const unobserve = observarResize(elemento, (rect, target) => {
  console.log('Novo tamanho:', rect.width, rect.height);
});

// Parar de observar
unobserve();
```

### Múltiplos Elementos

```javascript
class ResponsiveManager {
  constructor() {
    this.observer = new ResizeObserver(this.handleResize.bind(this));
    this.handlers = new WeakMap();
  }

  observe(elemento, callback) {
    this.handlers.set(elemento, callback);
    this.observer.observe(elemento);
  }

  unobserve(elemento) {
    this.handlers.delete(elemento);
    this.observer.unobserve(elemento);
  }

  handleResize(entries) {
    entries.forEach(entry => {
      const callback = this.handlers.get(entry.target);
      if (callback) {
        callback(entry.contentRect, entry.target);
      }
    });
  }

  disconnect() {
    this.observer.disconnect();
    this.handlers = new WeakMap();
  }
}

// Uso
const manager = new ResponsiveManager();

manager.observe(elemento1, rect => {
  console.log('Elemento 1:', rect);
});

manager.observe(elemento2, rect => {
  console.log('Elemento 2:', rect);
});
```

ResizeObserver é essencial para criar interfaces verdadeiramente responsivas, permitindo reagir a mudanças de dimensão de elementos individuais causadas por qualquer motivo (viewport, conteúdo dinâmico, CSS), com performance superior a soluções baseadas em eventos de window.
