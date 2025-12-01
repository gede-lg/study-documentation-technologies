# grid-template-rows

## 1. Introdução

A propriedade **grid-template-rows** é uma parte fundamental do CSS Grid Layout, que permite definir a estrutura das linhas de um contêiner grid. Ela especifica quantas linhas haverá, suas alturas e como essas alturas se comportam, possibilitando a criação de layouts bidimensionais complexos e responsivos. Essa propriedade fornece controle detalhado sobre a distribuição vertical do espaço no grid, complementando outras propriedades como **grid-template-columns** e **grid-gap**.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **grid-template-rows** define a altura de cada linha (grid row) dentro de um contêiner que utiliza CSS Grid Layout. Com ela, você pode especificar linhas com alturas fixas, flexíveis ou mesmo automáticas, adaptando o layout às necessidades de conteúdo e ao design responsivo.
    
- **Importância:**
    - **Organização Vertical:** Controla como o espaço vertical é dividido entre as linhas do grid.
    - **Responsividade:** Permite o ajuste das alturas das linhas de forma a manter um design harmonioso em diferentes dispositivos.
    - **Flexibilidade:** Suporta diversas unidades (px, %, fr, auto, etc.) e funções (como `repeat()` e `minmax()`), possibilitando configurações complexas de layout.

---

## 3. Sintaxe e Estrutura

A sintaxe básica para **grid-template-rows** é:

```css
seletor {
    grid-template-rows: <track-size> [ <track-size> ]*;
}

```

- **:**
Especifica a altura de uma linha. Pode ser definido utilizando:
    - **Unidades absolutas:** Ex.: `100px`, `50pt`
    - **Unidades relativas:** Ex.: `auto`, `%`
    - **Unidade fracional (fr):** Ex.: `1fr` – representa uma fração do espaço restante.
    - **Funções:**
        - **repeat()** para repetir um padrão de linhas.
            
            ```css
            grid-template-rows: repeat(3, 1fr);
            
            ```
            
        - **minmax()** para definir um intervalo mínimo e máximo de altura.
            
            ```css
            grid-template-rows: minmax(100px, auto);
            
            ```
            

**Exemplo Básico:**

```css
.grid-container {
    display: grid;
    grid-template-rows: 100px auto 50px;
}

```

Neste exemplo:

- A primeira linha terá 100px de altura.
- A segunda linha se ajustará automaticamente ao conteúdo (auto).
- A terceira linha terá uma altura fixa de 50px.

---

## 4. Exemplos de Código Otimizados

### Exemplo 1: Linhas com Alturas Fixas e Flexíveis

```css
.grid-container {
    display: grid;
    grid-template-rows: 80px 1fr 2fr;
    grid-gap: 10px;
    border: 1px solid #ccc;
    padding: 10px;
}

.grid-item {
    background-color: #3498db;
    color: #fff;
    padding: 15px;
    text-align: center;
}

```

```html
<div class="grid-container">
  <div class="grid-item">Linha 1 (80px)</div>
  <div class="grid-item">Linha 2 (1fr)</div>
  <div class="grid-item">Linha 3 (2fr)</div>
</div>

```

*Explicação:*

- A primeira linha é fixa em 80px.
- A segunda e terceira linhas utilizam unidades fracionais (`1fr` e `2fr`), distribuindo o espaço restante de forma proporcional (a terceira linha ocupará o dobro da altura da segunda).

### Exemplo 2: Uso da Função repeat()

```css
.grid-container {
    display: grid;
    grid-template-rows: repeat(4, 150px);
    grid-gap: 15px;
    padding: 10px;
    background-color: #ecf0f1;
}

.grid-item {
    background-color: #e67e22;
    color: #fff;
    padding: 20px;
    text-align: center;
}

```

```html
<div class="grid-container">
  <div class="grid-item">Linha 1</div>
  <div class="grid-item">Linha 2</div>
  <div class="grid-item">Linha 3</div>
  <div class="grid-item">Linha 4</div>
</div>

```

*Explicação:*

Utilizando `repeat(4, 150px)`, o grid é dividido em quatro linhas, cada uma com 150px de altura, o que simplifica a escrita do código.

### Exemplo 3: Linhas com Tamanho Mínimo e Máximo (minmax)

```css
.grid-container {
    display: grid;
    grid-template-rows: minmax(100px, 1fr) 200px auto;
    grid-gap: 10px;
    padding: 10px;
}

.grid-item {
    background-color: #9b59b6;
    color: #fff;
    padding: 15px;
    text-align: center;
}

```

```html
<div class="grid-container">
  <div class="grid-item">Linha 1: minmax(100px, 1fr)</div>
  <div class="grid-item">Linha 2: 200px</div>
  <div class="grid-item">Linha 3: auto</div>
</div>

```

*Explicação:*

- A primeira linha terá pelo menos 100px de altura, mas pode crescer até ocupar uma fração do espaço restante (1fr).
- A segunda linha é fixa em 200px.
- A terceira linha se ajusta automaticamente ao conteúdo.

---

## 5. Informações Adicionais

- **Responsividade:**
    
    Usar unidades relativas como `fr` ou funções como `minmax()` torna os layouts de grid altamente responsivos, pois as alturas se ajustam conforme o tamanho do contêiner e o conteúdo.
    
- **Combinação com grid-template-columns:**
    
    Para um layout completo, **grid-template-rows** é frequentemente combinado com **grid-template-columns** e outras propriedades de grid (como **grid-gap** e **grid-template-areas**) para definir a estrutura bidimensional.
    
- **Visualização:**
    
    Ferramentas de desenvolvimento em navegadores modernos permitem visualizar as linhas e colunas do grid, facilitando o ajuste fino dos tamanhos.
    
- **Flexibilidade:**
    
    A propriedade oferece uma grande variedade de opções, desde a definição de linhas fixas até a criação de linhas que se adaptam ao conteúdo ou que distribuem o espaço de forma proporcional.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS grid-template-rows:**[MDN CSS grid-template-rows](https://developer.mozilla.org/pt-BR/docs/Web/CSS/grid-template-rows)
- **W3Schools – CSS Grid:**[W3Schools CSS Grid](https://www.w3schools.com/css/css_grid.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
    - [CSS Grid Garden – Jogo Interativo para Aprender Grid](https://cssgridgarden.com/)

---

## 7. Conclusão

A propriedade **grid-template-rows** é essencial para definir a estrutura vertical de um contêiner grid. Ela permite especificar com precisão o tamanho das linhas, seja através de valores fixos, unidades fracionais ou funções avançadas como `repeat()` e `minmax()`. Dominar essa propriedade possibilita a criação de layouts complexos e responsivos, onde a distribuição do espaço vertical é controlada de maneira elegante e adaptável. Ao combinar **grid-template-rows** com outras propriedades do CSS Grid, os desenvolvedores podem criar interfaces modernas, organizadas e visualmente impactantes. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas em seus projetos de CSS.