# grid-template

## 1. Introdução

A propriedade **grid-template** é uma propriedade abreviada do CSS Grid Layout que permite definir, em uma única declaração, as dimensões das linhas e colunas, bem como a disposição das áreas nomeadas de um contêiner de grid. Ela combina as propriedades **grid-template-rows**, **grid-template-columns** e **grid-template-areas**. Essa abordagem simplificada torna o código mais conciso e legível, além de facilitar a criação e manutenção de layouts complexos e responsivos.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **grid-template** permite definir simultaneamente a estrutura vertical e horizontal do grid, especificando as alturas das linhas, as larguras das colunas e a distribuição das áreas nomeadas.
    
- **Componentes:**
    
    Ao utilizar **grid-template**, você pode:
    
    - Definir as linhas do grid (via **grid-template-rows**).
    - Definir as colunas do grid (via **grid-template-columns**).
    - Nomear áreas específicas do grid (via **grid-template-areas**).
- **Benefícios:**
    - **Simplicidade:** Agrupa várias configurações em uma única linha de código.
    - **Semântica:** Facilita a visualização da estrutura do layout, tornando o código mais intuitivo e fácil de manter.
    - **Flexibilidade:** Permite criar layouts complexos com áreas nomeadas, colunas e linhas com tamanhos variados (fixos, flexíveis ou adaptáveis).

---

## 3. Sintaxe e Estrutura

A sintaxe geral da propriedade **grid-template** é:

```css
grid-template: <'grid-template-rows'> / <'grid-template-columns'>;

```

ou, de forma mais completa, quando inclui áreas nomeadas:

```css
grid-template:
  "area1 area2 area2" 100px
  "area3 area4 area4" 200px
  / 1fr 2fr 1fr;

```

### Componentes:

1. **Grid Template Rows:**
    
    Define as alturas das linhas do grid. Por exemplo: `100px 200px auto`.
    
2. **Grid Template Columns:**
    
    Define as larguras das colunas do grid. Por exemplo: `1fr 2fr 1fr`.
    
3. **Grid Template Areas:**
    
    Permite nomear as áreas do grid usando strings entre aspas. Cada linha de áreas é separada por quebras de linha.
    
    Exemplo:
    
    ```css
    grid-template-areas:
      "header header header"
      "sidebar main main"
      "footer footer footer";
    
    ```
    
4. **Barra (/):**
    
    A barra é usada para separar as definições das linhas das definições das colunas quando se utiliza a propriedade abreviada.
    

---

## 4. Exemplos de Código Otimizados

### Exemplo 1: Layout Simples com Linhas e Colunas

```css
.grid-container {
    display: grid;
    grid-template: 100px auto / 1fr 2fr;
    gap: 10px;
    border: 1px solid #ccc;
    padding: 10px;
}

```

```html
<div class="grid-container">
  <div style="background: #3498db; color: #fff;">Item 1</div>
  <div style="background: #e74c3c; color: #fff;">Item 2</div>
</div>

```

*Explicação:*

- A primeira linha tem 100px de altura e a segunda se ajusta automaticamente.
- As colunas têm larguras proporcionais de 1fr e 2fr, respectivamente.

### Exemplo 2: Layout com Áreas Nomeadas

```css
.grid-container {
    display: grid;
    grid-template:
      "header header header" 80px
      "sidebar main main" 1fr
      "footer footer footer" 60px
      / 1fr 3fr 1fr;
    gap: 10px;
}

.header {
    grid-area: header;
    background: #e67e22;
    color: #fff;
    text-align: center;
}

.sidebar {
    grid-area: sidebar;
    background: #3498db;
    color: #fff;
}

.main {
    grid-area: main;
    background: #2ecc71;
    color: #fff;
}

.footer {
    grid-area: footer;
    background: #9b59b6;
    color: #fff;
    text-align: center;
}

```

```html
<div class="grid-container">
  <div class="header">Header</div>
  <div class="sidebar">Sidebar</div>
  <div class="main">Main Content</div>
  <div class="footer">Footer</div>
</div>

```

*Explicação:*

- O contêiner é dividido em três linhas e três colunas.
- Cada linha tem uma altura definida: 80px para o header, 1fr para a área principal e 60px para o footer.
- As colunas têm larguras proporcionais: a coluna central é maior (3fr) em comparação com as laterais (1fr cada).
- Áreas nomeadas permitem posicionar os itens de forma semântica e intuitiva.

### Exemplo 3: Uso do `repeat()` e `minmax()`

```css
.grid-container {
    display: grid;
    grid-template:
      "nav nav nav nav" 60px
      "content content sidebar sidebar" minmax(200px, 1fr)
      "footer footer footer footer" 80px
      / repeat(4, 1fr);
    gap: 10px;
}

```

```html
<div class="grid-container">
  <div style="grid-area: nav; background: #2ecc71;">Navigation</div>
  <div style="grid-area: content; background: #3498db;">Content</div>
  <div style="grid-area: sidebar; background: #e74c3c;">Sidebar</div>
  <div style="grid-area: footer; background: #9b59b6;">Footer</div>
</div>

```

*Explicação:*

- Utiliza a função `repeat(4, 1fr)` para criar quatro colunas iguais.
- A área "content" tem um tamanho mínimo de 200px e pode crescer até ocupar uma fração do espaço restante, graças a `minmax()`.
- Áreas são definidas e mapeadas, permitindo uma estrutura clara e responsiva.

---

## 5. Informações Adicionais

- **Responsividade:**
    
    Utilizar funções como `repeat()` e `minmax()` torna o grid altamente responsivo, pois as dimensões se ajustam automaticamente ao tamanho do contêiner.
    
- **Manutenção e Legibilidade:**
    
    Nomear áreas com **grid-template-areas** melhora a legibilidade do código e facilita a manutenção, especialmente em layouts complexos.
    
- **Integração com Outras Propriedades de Grid:**
    
    **grid-template** pode ser combinada com **grid-gap** (ou `gap`), **justify-items**, **align-items** e **grid-auto-flow** para criar layouts completos e refinados.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS grid-template-areas:**[MDN CSS grid-template-areas](https://developer.mozilla.org/pt-BR/docs/Web/CSS/grid-template-areas)
- **MDN Web Docs – CSS grid-template:**[MDN CSS grid-template](https://developer.mozilla.org/pt-BR/docs/Web/CSS/grid-template)
- **W3Schools – CSS Grid Layout:**[W3Schools CSS Grid](https://www.w3schools.com/css/css_grid.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
    - [CSS Grid Garden – Jogo Interativo para Aprender Grid Layout](https://cssgridgarden.com/)

---

## 7. Conclusão

A propriedade **grid-template** é uma poderosa ferramenta abreviada que unifica a definição das linhas, colunas e áreas nomeadas de um contêiner de grid, tornando o desenvolvimento de layouts bidimensionais mais intuitivo e eficiente. Ao utilizar essa propriedade, os desenvolvedores podem criar interfaces altamente responsivas, organizadas e semânticas, que se adaptam facilmente a diferentes tamanhos de tela e complexidades de design. Explore os exemplos e recursos indicados para aprofundar seu conhecimento e aplicar essas técnicas em seus projetos de CSS.