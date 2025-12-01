# grid-template-columns

## 1. Introdução

A propriedade **grid-template-columns** é fundamental no CSS Grid Layout, permitindo que você defina a estrutura das colunas de um contêiner grid. Com ela, é possível especificar quantas colunas haverá, suas larguras e como elas se comportarão, usando uma variedade de unidades e funções. Essa propriedade é essencial para criar layouts bidimensionais flexíveis e responsivos, onde o controle detalhado das colunas facilita a organização e o alinhamento do conteúdo.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **grid-template-columns** determina o número, a largura e o comportamento das colunas dentro de um contêiner grid. Ela define as linhas verticais que compõem a grade, ajudando a estruturar o layout da página.
    
- **Importância:**
    - Permite definir colunas de tamanho fixo, fluido ou flexível usando unidades como pixels, porcentagens, `fr` (fração), `auto` e funções como `repeat()` e `minmax()`.
    - Facilita a criação de layouts responsivos, onde a disposição dos elementos pode se adaptar dinamicamente ao espaço disponível.
    - Complementa outras propriedades de grid, como **grid-template-rows**, **grid-gap** e **grid-template-areas**, para oferecer controle completo sobre o design da grade.

---

## 3. Sintaxe e Estrutura

A sintaxe básica é:

```css
grid-template-columns: <track-size> [ <track-size> ]*;

```

Onde **track-size** pode ser definido com:

- **Unidades Absolutas:**
    
    Ex.: `100px`, `2em`
    
- **Unidades Relativas:**
    
    Ex.: `%`, `auto`
    
- **Unidade Fracional (fr):**
    
    Representa uma fração do espaço disponível. Ex.: `1fr` distribui o espaço de forma proporcional.
    
- **Função repeat():**
    
    Permite repetir um conjunto de colunas de forma concisa.
    
    ```css
    grid-template-columns: repeat(3, 1fr);
    
    ```
    
- **Função minmax():**
    
    Define um intervalo mínimo e máximo para o tamanho das colunas.
    
    ```css
    grid-template-columns: minmax(150px, 1fr);
    
    ```
    

**Exemplo Simples:**

```css
.grid-container {
    display: grid;
    grid-template-columns: 200px 1fr 2fr;
}

```

Nesse exemplo, a primeira coluna terá 200px, a segunda ocupará uma fração do espaço restante, e a terceira duas vezes essa fração.

---

## 4. Exemplos de Código Otimizados

### Exemplo 1: Colunas de Larguras Fixas e Flexíveis

```css
.grid-container {
    display: grid;
    grid-template-columns: 150px 1fr 1fr;
    grid-gap: 10px;
    padding: 10px;
    background-color: #f0f0f0;
}

.grid-item {
    background-color: #3498db;
    color: #fff;
    padding: 20px;
    text-align: center;
}

```

```html
<div class="grid-container">
  <div class="grid-item">Coluna 1 (150px)</div>
  <div class="grid-item">Coluna 2 (1fr)</div>
  <div class="grid-item">Coluna 3 (1fr)</div>
</div>

```

*Explicação:*

A primeira coluna tem uma largura fixa de 150px, enquanto as duas demais se dividem igualmente o espaço restante.

### Exemplo 2: Uso de `repeat()` para Colunas Iguais

```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 15px;
    padding: 15px;
    background-color: #ecf0f1;
}

.grid-item {
    background-color: #e67e22;
    color: #fff;
    padding: 10px;
    text-align: center;
}

```

```html
<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item">4</div>
</div>

```

*Explicação:*

A função `repeat(4, 1fr)` cria quatro colunas iguais, cada uma ocupando uma fração igual do espaço disponível.

### Exemplo 3: Colunas com Tamanho Mínimo e Máximo (minmax)

```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-gap: 10px;
    padding: 10px;
    background-color: #bdc3c7;
}

.grid-item {
    background-color: #16a085;
    color: #fff;
    padding: 15px;
    text-align: center;
}

```

```html
<div class="grid-container">
  <div class="grid-item">A</div>
  <div class="grid-item">B</div>
  <div class="grid-item">C</div>
</div>

```

*Explicação:*

Cada coluna terá pelo menos 100px de largura, mas pode crescer até ocupar igualmente o espaço restante (1fr), garantindo flexibilidade e responsividade.

---

## 5. Informações Adicionais

- **Responsividade:**
    
    Usar unidades relativas e funções como `repeat()` e `minmax()` torna os layouts grid altamente responsivos, adaptando-se automaticamente a diferentes tamanhos de tela.
    
- **Interação com Outras Propriedades:**
    
    **grid-template-columns** trabalha em conjunto com **grid-template-rows**, **grid-gap** e **grid-template-areas** para definir a estrutura completa do layout.
    
- **Princípio do Espaço Flexível (fr):**
    
    A unidade `fr` é particularmente útil para distribuir o espaço de forma proporcional, tornando o layout mais fluido e dinâmico.
    
- **Planejamento de Layouts Complexos:**
    
    Ao combinar **grid-template-columns** com outras funções, você pode criar layouts complexos e adaptáveis, como grades de produtos, galerias e dashboards interativos.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS grid-template-columns:**[MDN CSS grid-template-columns](https://developer.mozilla.org/pt-BR/docs/Web/CSS/grid-template-columns)
- **W3Schools – CSS Grid:**[W3Schools CSS Grid](https://www.w3schools.com/css/css_grid.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
    - [CSS Grid Garden – Jogo Interativo para Aprender Grid Layout](https://cssgridgarden.com/)

---

## 7. Conclusão

A propriedade **grid-template-columns** é essencial para definir a estrutura e a disposição das colunas em um layout CSS Grid. Ao utilizar essa propriedade, você pode especificar colunas de tamanhos fixos, flexíveis ou adaptáveis por meio de unidades relativas e funções avançadas como `repeat()` e `minmax()`. Dominar **grid-template-columns** permite criar layouts responsivos, organizados e visualmente impactantes, facilitando o design de interfaces modernas e complexas. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas com eficácia em seus projetos de CSS.