# Intersection Observer: Detecção de Visibilidade

## 🎯 Definição

**Intersection Observer API** detecta de forma assíncrona quando um elemento entra ou sai da viewport (ou de outro elemento ancestral), permitindo implementar lazy loading, infinite scroll, animações on-scroll e analytics de visibilidade sem monitorar eventos de scroll manualmente. Observa interseções entre um elemento alvo e sua raiz de forma performática, disparando callbacks apenas quando a visibilidade muda.

```javascript
// Criar observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Elemento visível:', entry.target);
    } else {
      console.log('Elemento oculto:', entry.target);
    }
  });
});

// Observar elemento
const elemento = document.querySelector('.box');
observer.observe(elemento);
```

**Conceito:** API assíncrona para detecção de visibilidade de elementos na viewport.

## 📋 IntersectionObserver

### Construtor e Callback

```javascript
const observer = new IntersectionObserver(
  (entries, observer) => {
    // Callback executado quando visibilidade muda
    entries.forEach(entry => {
      console.log('Target:', entry.target);
      console.log('Visível?', entry.isIntersecting);
      console.log('Ratio:', entry.intersectionRatio);
    });
  },
  {
    root: null,           // null = viewport (padrão)
    rootMargin: '0px',    // Margem ao redor da root
    threshold: 0          // [0-1] ou array: quando disparar callback
  }
);
```

### Métodos

```javascript
const observer = new IntersectionObserver(callback);

// observe(): começar a observar elemento
observer.observe(elemento1);
observer.observe(elemento2);

// unobserve(): parar de observar elemento específico
observer.unobserve(elemento1);

// disconnect(): parar de observar todos elementos
observer.disconnect();

// takeRecords(): obter entries pendentes (raramente usado)
const entries = observer.takeRecords();
```

## 🧠 IntersectionObserverEntry

### Propriedades

```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // Target: elemento sendo observado
    console.log(entry.target);

    // isIntersecting: true se elemento está visível
    console.log(entry.isIntersecting);

    // intersectionRatio: porção visível (0-1)
    console.log(entry.intersectionRatio);

    // intersectionRect: retângulo da interseção
    console.log(entry.intersectionRect);

    // boundingClientRect: retângulo do elemento
    console.log(entry.boundingClientRect);

    // rootBounds: retângulo da root (viewport)
    console.log(entry.rootBounds);

    // time: timestamp da observação
    console.log(entry.time);
  });
});
```

### isIntersecting vs intersectionRatio

```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // isIntersecting: boolean simples
    if (entry.isIntersecting) {
      console.log('Elemento entrou na viewport');
    }

    // intersectionRatio: porcentagem precisa (0-1)
    if (entry.intersectionRatio >= 0.5) {
      console.log('Pelo menos 50% do elemento está visível');
    }

    if (entry.intersectionRatio === 1) {
      console.log('Elemento 100% visível');
    }
  });
});
```

## 🔍 Opções de Configuração

### root

```javascript
// root: null = viewport (padrão)
const observer1 = new IntersectionObserver(callback, {
  root: null
});

// root: elemento específico (container scrollável)
const container = document.querySelector('.scrollable-container');
const observer2 = new IntersectionObserver(callback, {
  root: container
});

// Observa quando elementos entram/saem de container
```

### rootMargin

```javascript
// Expandir/contrair área de detecção
const observer = new IntersectionObserver(callback, {
  rootMargin: '50px' // Detectar 50px antes de entrar na viewport
});

// Sintaxe CSS: 'top right bottom left'
const observer2 = new IntersectionObserver(callback, {
  rootMargin: '100px 0px -50px 0px'
  // Top: +100px (detecta antes)
  // Bottom: -50px (detecta depois)
});

// Útil para lazy loading: começar a carregar antes de visível
```

### threshold

```javascript
// threshold: quando callback dispara
// 0 = qualquer pixel visível (padrão)
const observer1 = new IntersectionObserver(callback, {
  threshold: 0
});

// 0.5 = callback dispara quando 50% está visível
const observer2 = new IntersectionObserver(callback, {
  threshold: 0.5
});

// 1.0 = callback dispara quando 100% está visível
const observer3 = new IntersectionObserver(callback, {
  threshold: 1.0
});

// Array: múltiplos thresholds
const observer4 = new IntersectionObserver(callback, {
  threshold: [0, 0.25, 0.5, 0.75, 1.0]
  // Callback dispara a cada 25% de visibilidade
});
```

## 🎯 Casos de Uso

### Lazy Loading de Imagens

```javascript
// HTML:
// <img data-src="imagem.jpg" class="lazy">

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;

      // Carregar imagem
      img.src = img.dataset.src;

      // Parar de observar após carregar
      observer.unobserve(img);

      // Remover classe
      img.classList.remove('lazy');
    }
  });
}, {
  rootMargin: '50px' // Começar a carregar 50px antes
});

// Observar todas imagens lazy
document.querySelectorAll('img.lazy').forEach(img => {
  observer.observe(img);
});
```

### Infinite Scroll

```javascript
// HTML:
// <div class="sentinela"></div>

const sentinela = document.querySelector('.sentinela');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      carregarMaisItens();
    }
  });
}, {
  rootMargin: '100px' // Carregar quando sentinela está 100px antes de visível
});

observer.observe(sentinela);

async function carregarMaisItens() {
  const resposta = await fetch('/api/items?pagina=' + paginaAtual++);
  const items = await resposta.json();

  items.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.titulo;
    lista.appendChild(div);
  });

  // Reposicionar sentinela ao fim da lista
  lista.appendChild(sentinela);
}
```

### Animações on Scroll

```javascript
// HTML:
// <div class="fade-in">Conteúdo</div>

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visivel');
    } else {
      entry.target.classList.remove('visivel');
    }
  });
}, {
  threshold: 0.1 // Animar quando 10% está visível
});

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// CSS:
// .fade-in { opacity: 0; transition: opacity 0.5s; }
// .fade-in.visivel { opacity: 1; }
```

### Analytics de Visibilidade

```javascript
// Rastrear quando elementos são visualizados
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Elemento visível por tempo suficiente?
      setTimeout(() => {
        if (entry.isIntersecting) {
          console.log('Usuário visualizou:', entry.target.dataset.trackingId);
          enviarAnalytics('elemento_visualizado', {
            id: entry.target.dataset.trackingId,
            tempo: Date.now()
          });
        }
      }, 1000); // Visível por 1 segundo
    }
  });
}, {
  threshold: 0.5 // Pelo menos 50% visível
});

document.querySelectorAll('[data-tracking-id]').forEach(el => {
  observer.observe(el);
});
```

### Pausa de Vídeo fora da Viewport

```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target;

    if (entry.isIntersecting) {
      video.play();
    } else {
      video.pause();
    }
  });
}, {
  threshold: 0.5 // 50% do vídeo visível
});

document.querySelectorAll('video').forEach(video => {
  observer.observe(video);
});
```

### Sticky Navigation

```javascript
// Detectar quando header sai da viewport
const header = document.querySelector('header');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      // Header saiu da viewport: mostrar sticky nav
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  });
}, {
  threshold: 0
});

observer.observe(header);
```

## ⚠️ Considerações

### Performance

```javascript
// ✅ IntersectionObserver é performático
// Não bloqueia main thread
// Observações são assíncronas

// ❌ Evitar: monitorar scroll manualmente
window.addEventListener('scroll', () => {
  elementos.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      // ...
    }
  });
}); // Síncrono, causa layout thrashing

// ✅ Usar IntersectionObserver
const observer = new IntersectionObserver(callback);
elementos.forEach(el => observer.observe(el));
```

### Múltiplos Observers vs Único Observer

```javascript
// ❌ Múltiplos observers (menos eficiente)
elementos.forEach(el => {
  const observer = new IntersectionObserver(callback);
  observer.observe(el);
});

// ✅ Observer único para múltiplos elementos (mais eficiente)
const observer = new IntersectionObserver(callback);
elementos.forEach(el => {
  observer.observe(el);
});
```

### Polyfill para Browsers Antigos

```javascript
// Verificar suporte
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(callback);
  observer.observe(elemento);
} else {
  // Fallback: implementar com scroll events
  window.addEventListener('scroll', () => {
    verificarVisibilidade(elemento);
  });
}

// Ou usar polyfill
// <script src="intersection-observer-polyfill.js"></script>
```

## 🚀 Padrões Avançados

### Observer com Cleanup

```javascript
class LazyLoader {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { rootMargin: '50px' }
    );
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.observer.unobserve(img);
      }
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    img.src = src;
    img.addEventListener('load', () => {
      img.classList.add('carregada');
    });
  }

  observe(elemento) {
    this.observer.observe(elemento);
  }

  disconnect() {
    this.observer.disconnect();
  }
}

// Uso
const loader = new LazyLoader();
document.querySelectorAll('img[data-src]').forEach(img => {
  loader.observe(img);
});

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
  loader.disconnect();
});
```

### Progressive Enhancement

```javascript
// Carregar imagens progressivamente baseado em visibilidade
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0.1) {
      carregarBaixaQualidade(entry.target);
    }
    if (entry.intersectionRatio > 0.5) {
      carregarMediaQualidade(entry.target);
    }
    if (entry.intersectionRatio > 0.9) {
      carregarAltaQualidade(entry.target);
    }
  });
}, {
  threshold: [0.1, 0.5, 0.9]
});
```

Intersection Observer é fundamental para aplicações web modernas, oferecendo forma performática de detectar visibilidade sem comprometer responsividade, essencial para lazy loading, infinite scroll e experiências interativas baseadas em scroll.
