## 1. Introdução

A tag `<img>` é um elemento fundamental do HTML5 usado para incorporar imagens em páginas web. Ela desempenha um papel crítico na criação de interfaces visuais atraentes e funcionais, sendo essencial para design, acessibilidade e otimização de desempenho. Ao contrário de elementos como `<div>` ou `<p>`, `<img>` é uma tag **autofechada** (não requer tag de fechamento) e depende de atributos para funcionar corretamente. Sua importância se estende à SEO (otimização para motores de busca) e acessibilidade, já que atributos como `alt` fornecem contexto para leitores de tela e indexadores.

---

## 2. Sumário

- **Conteúdo Detalhado**
    - Definição e conceitos fundamentais
    - Sintaxe e estrutura
    - Atributos específicos
    - Uso avançado (imagens responsivas, lazy loading)
- **Exemplos práticos**
- **Informações adicionais**
- **Referências para estudo**

---

## 3. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

A tag `<img>` é usada para exibir imagens em formatos como JPEG, PNG, SVG ou GIF.

- **Conceitos básicos**: Utilização de `src` e `alt` para caminho da imagem e texto alternativo.
- **Conceitos avançados**: Imagens responsivas (`srcset`, `sizes`), lazy loading, e integração com `<picture>` para art direction.

### Sintaxe e Estrutura

```html
<img
  src="caminho/da-imagem.jpg"
  alt="Descrição da imagem"
  width="800"
  height="600"
>

```

### Componentes Principais (Atributos)

| Atributo | Valores Possíveis | Descrição |
| --- | --- | --- |
| `src` | URL absoluta ou relativa | **Obrigatório**. Define o caminho da imagem. |
| `alt` | Texto | **Obrigatório**. Texto alternativo para acessibilidade e SEO. |
| `width`/`height` | Números (px) | Define dimensões para evitar layout shifts. |
| `loading` | `eager` (padrão) ou `lazy` | Controla carregamento lazy. |
| `srcset` | URLs com descritores de resolução | Define múltiplas fontes para imagens responsivas (ex: `image-2x.jpg 2x`). |
| `sizes` | Media queries + tamanhos | Define condições para seleção de imagens em `srcset`. |
| `decoding` | `sync`, `async`, `auto` | Controla prioridade de decodificação. |
| `crossorigin` | `anonymous`, `use-credentials` | Permite acesso a imagens em CORS. |

**Atributos Obsoletos**: `border`, `hspace`, `vspace` (evite usá-los).

### Uso Avançado

1. **Imagens Responsivas**:
    
    ```html
    <img
      src="imagem-padrao.jpg"
      srcset="imagem-pequena.jpg 480w, imagem-grande.jpg 1080w"
      sizes="(max-width: 600px) 480px, 1080px"
      alt="Imagem responsiva"
    >
    
    ```
    
2. **Lazy Loading**:
    
    ```html
    <img src="imagem.jpg" loading="lazy" alt="Carregamento tardio">
    
    ```
    
3. **Art Direction com `<picture>`**:
    
    ```html
    <picture>
      <source media="(min-width: 1200px)" srcset="imagem-desktop.jpg">
      <source media="(min-width: 768px)" srcset="imagem-tablet.jpg">
      <img src="imagem-mobile.jpg" alt="Imagem adaptável">
    </picture>
    
    ```
    

---

## 4. Exemplos Práticos

### Uso Básico

```html
<!-- Imagem com texto alternativo e dimensões fixas -->
<img
  src="logo.png"
  alt="Logo da Empresa"
  width="200"
  height="100"
>

```

### Uso Avançado (Imagem Responsiva + Lazy Loading)

```html
<img
  src="thumbnail.jpg"
  srcset="thumbnail@2x.jpg 2x, thumbnail@3x.jpg 3x"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Thumbnail responsiva"
  loading="lazy"
  decoding="async"
>

```

---

## 5. Informações Adicionais

- **Acessibilidade**: Sempre inclua `alt` descritivo. Para imagens decorativas, use `alt=""`.
- **Performance**: Comprima imagens (ex: WebP) e use CDNs para otimização.
- **Layout Stability**: Defina `width` e `height` para evitar Cumulative Layout Shift (CLS).
- **SVG**: Use `<img>` para SVGs estáticos. Para interatividade, prefira `<svg>` inline.

---

## 6. Referências para Estudo

1. [MDN Web Docs: `<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
2. [HTML Living Standard: Images](https://html.spec.whatwg.org/multipage/images.html)
3. [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)
4. [Google Images Best Practices](https://developers.google.com/search/docs/advanced/guidelines/google-images)

---

## 7. Formatação

Este guia foi estruturado para facilitar a compreensão progressiva, desde o básico até técnicas avançadas. Use os exemplos como ponto de partida e consulte as referências para aprofundamento.