# Grade Curricular - jQuery (Completa e Estruturada)

**Objetivo**: Dominar jQuery desde fundamentos até padrões avançados de manipulação DOM, eventos, AJAX, animações e plugins.

**Carga Horária Total**: ~60 horas

**Proporção**: 90% teoria + 10% código (foco em conceitos profundos)

---

## Bloco 1: Fundamentos e Setup (8h)

### M1: Introdução ao jQuery
- O que é jQuery e por que foi criado
- jQuery vs JavaScript vanilla (comparação detalhada)
- Vantagens e limitações
- Quando usar (e quando não usar)

### M2: Setup e Configuração
- Download e instalação (CDN vs local)
- Versões do jQuery (1.x, 2.x, 3.x)
- jQuery Migrate (compatibilidade)
- Integração com projetos modernos

### M3: Seletores
- Seletores CSS básicos
- Seletores jQuery específicos (:first, :last, :even, :odd)
- Seletores de atributo
- Filtros e pseudo-seletores
- Performance de seletores

### M4: Objeto jQuery
- A função $() e jQuery()
- Objeto jQuery vs DOM nativo
- Chaining (encadeamento)
- Contexto e this

---

## Bloco 2: Manipulação DOM (10h)

### M5: Traversing (Navegação)
- Métodos de navegação (parent, children, siblings)
- find(), filter(), not()
- first(), last(), eq()
- closest(), parents(), parentsUntil()

### M6: Manipulação de Conteúdo
- text(), html(), val()
- append(), prepend(), after(), before()
- wrap(), unwrap(), wrapAll()
- clone(), remove(), detach(), empty()

### M7: Atributos e Propriedades
- attr() vs prop()
- addClass(), removeClass(), toggleClass()
- hasClass()
- data() (data attributes)
- removeAttr(), removeProp()

### M8: CSS e Dimensões
- css() getter e setter
- width(), height(), innerWidth(), outerWidth()
- position(), offset(), scrollTop(), scrollLeft()
- hide(), show(), toggle()

---

## Bloco 3: Eventos (10h)

### M9: Event Handling Básico
- on(), off(), one()
- click(), dblclick(), hover()
- Métodos deprecated (bind, unbind, live, delegate)
- Event object (e.target, e.preventDefault, e.stopPropagation)

### M10: Eventos Avançados
- Event delegation (delegação de eventos)
- Event namespacing
- Custom events (trigger, triggerHandler)
- Event bubbling e capturing

### M11: Eventos de Formulário
- submit(), change(), focus(), blur()
- Validação de formulários
- serialize(), serializeArray()
- Preventing default behavior

### M12: Eventos de Mouse e Teclado
- mouseenter, mouseleave, mousemove
- keydown, keyup, keypress
- which e keyCode
- Coordenadas do mouse (pageX, pageY)

---

## Bloco 4: Efeitos e Animações (8h)

### M13: Efeitos Básicos
- show(), hide(), toggle()
- fadeIn(), fadeOut(), fadeToggle(), fadeTo()
- slideDown(), slideUp(), slideToggle()
- Callbacks de efeitos

### M14: Animações Customizadas
- animate() (propriedades, duração, easing)
- stop(), delay(), finish()
- Queue de animações
- Easing functions (linear, swing)

### M15: Plugins de Animação
- jQuery UI Effects
- Velocity.js integration
- animate.css integration
- Performance considerations

---

## Bloco 5: AJAX (12h)

### M16: AJAX Básico
- $.ajax() método completo
- $.get(), $.post()
- $.getJSON(), $.getScript()
- load() para carregar HTML

### M17: AJAX Avançado
- beforeSend, success, error, complete
- dataType (json, xml, html, script)
- contentType e processData
- Timeout e retry

### M18: Promises e Deferred
- $.Deferred() objeto
- then(), done(), fail(), always()
- when() para múltiplas requisições
- Chaining de promises

### M19: JSONP e Cross-Origin
- JSONP requests
- CORS handling
- $.ajaxSetup() configuração global
- Error handling strategies

---

## Bloco 6: Plugins e Extensões (8h)

### M20: Criando Plugins
- Estrutura básica de plugin
- $.fn.extend() para métodos
- $.extend() para utilitários
- Options e defaults
- Chaining em plugins

### M21: Plugins Populares
- jQuery UI (widgets, interactions, effects)
- jQuery Validation
- DataTables
- Select2
- Slick Carousel

### M22: Plugin Patterns
- Lightweight pattern
- Widget factory pattern
- Namespacing
- Destroy method
- Public methods e API

---

## Bloco 7: Utilitários e Helpers (6h)

### M23: Métodos Utilitários
- $.each(), $.map(), $.grep()
- $.merge(), $.unique(), $.makeArray()
- $.extend() deep copy
- $.trim(), $.isArray(), $.isFunction()

### M24: Type Checking
- $.type()
- $.isNumeric(), $.isEmptyObject()
- $.isPlainObject(), $.isWindow()
- Feature detection

### M25: Callbacks e Queue
- $.Callbacks() objeto
- Queue methods (queue, dequeue, clearQueue)
- $.queue(), $.dequeue()
- Custom queues

---

## Bloco 8: Performance e Best Practices (8h)

### M26: Performance Optimization
- Seletor caching
- Event delegation vs direct binding
- Detached DOM manipulation
- Minimizando reflows e repaints

### M27: jQuery vs Vanilla JS
- Quando usar cada um
- Performance comparison
- Migration strategies
- Modern alternatives (React, Vue)

### M28: Debugging e Testing
- jQuery debugging techniques
- Browser DevTools
- QUnit para testes
- Common pitfalls

### M29: Migration e Modernização
- Removing jQuery dependencies
- jQuery Migrate plugin
- Refactoring to vanilla JS
- Code splitting strategies

---

## Estrutura de Cada Módulo

Cada arquivo `.md` deve conter:

### 🎯 Introdução
- Conceito principal em 2-3 parágrafos
- Problema que resolve
- Contextualização histórica/teórica

### 📋 Sumário
- Lista de tópicos principais
- Organização hierárquica

### 🧠 Fundamentos
- Explicação teórica detalhada (90%)
- Conceitos base
- Terminologia
- Exemplos mínimos de código (10%)

### 🔍 Análise
- Comparações
- Trade-offs
- Casos de uso
- Análise crítica

### 🎯 Aplicabilidade
- Quando usar
- Quando NÃO usar
- Cenários reais

### ⚠️ Limitações
- Restrições técnicas
- Problemas conhecidos
- Workarounds

### 🔗 Interconexões
- Relação com outros módulos
- Dependências
- Pré-requisitos

### 🚀 Evolução
- Histórico
- Tendências futuras
- Alternativas modernas

---

## Notas Importantes

**Proporção de Conteúdo**:
- 90% teoria (explicações profundas, conceitos, análises)
- 10% código (exemplos mínimos para ilustrar conceitos)

**Filosofia**:
- Priorizar ENTENDIMENTO sobre memorização
- Explicar o POR QUÊ antes do COMO
- Contextualizar historicamente
- Analisar trade-offs e limitações
- Comparar com alternativas modernas

**Público-Alvo**:
- Desenvolvedores que querem DOMINAR jQuery
- Foco em conhecimento profundo, não tutoriais práticos
- Preparação para entender código legado
- Transição para frameworks modernos

**Progressão**:
- Do básico ao avançado
- Cada módulo constrói sobre o anterior
- Interconexões explícitas entre tópicos
- Revisão e reforço de conceitos

---

## Cronograma Sugerido

**Semana 1-2**: Bloco 1 (Fundamentos) + Bloco 2 (DOM)
**Semana 3**: Bloco 3 (Eventos)
**Semana 4**: Bloco 4 (Animações) + Bloco 5 (AJAX)
**Semana 5**: Bloco 6 (Plugins) + Bloco 7 (Utilitários)
**Semana 6**: Bloco 8 (Performance e Modernização)

**Total**: ~60 horas de estudo profundo

---

## Recursos Complementares

- Documentação oficial jQuery
- jQuery Learning Center
- jQuery UI Documentation
- "jQuery in Action" (livro)
- "Learning jQuery" (livro)

---

**Status**: Pronto para implementação módulo por módulo
**Última atualização**: 17/11/2025
