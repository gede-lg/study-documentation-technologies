# column-rule e Suas Subpropriedades

## 1. Introdução

A propriedade **column-rule** faz parte do módulo de layout multicoluna do CSS e permite definir uma linha visual entre as colunas de um elemento. Essa linha, ou "regra", pode ser customizada em termos de largura, estilo e cor, ajudando a separar visualmente as colunas e a melhorar a legibilidade do conteúdo. Além da propriedade abreviada **column-rule**, o CSS oferece subpropriedades específicas para configurar cada aspecto da regra: **column-rule-width**, **column-rule-style** e **column-rule-color**.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **column-rule** é uma propriedade abreviada que define, de forma integrada, a largura, o estilo e a cor da linha que separa as colunas em um layout multi-coluna.
    
- **Componentes:**
    - **column-rule-width:** Especifica a espessura da linha.
    - **column-rule-style:** Define o estilo da linha (por exemplo, sólido, tracejado, pontilhado, etc.).
    - **column-rule-color:** Determina a cor da linha.
- **Importância:**
    - **Separação Visual:** Cria uma divisão clara entre as colunas, melhorando a organização e a legibilidade do conteúdo.
    - **Personalização:** Permite um alto nível de customização, possibilitando que o design da regra se alinhe com a identidade visual do projeto.
    - **Estilo Jornalístico:** É especialmente útil em layouts de artigos e revistas online, onde múltiplas colunas facilitam a leitura.

---

## 3. Sintaxe e Estrutura

### 3.1. Propriedade Abreviada

A sintaxe abreviada para **column-rule** é:

```css
seletor {
  column-rule: <column-rule-width> <column-rule-style> <column-rule-color>;
}

```

**Exemplo:**

```css
.container {
  column-rule: 2px solid #333;
}

```

*Neste exemplo, a linha entre as colunas terá 2px de espessura, será sólida e terá a cor #333.*

### 3.2. Subpropriedades Individuais

Você também pode definir cada subpropriedade separadamente:

- **column-rule-width:**
    
    ```css
    .container {
        column-rule-width: 2px;
    }
    
    ```
    
- **column-rule-style:**
    
    ```css
    .container {
        column-rule-style: solid;
    }
    
    ```
    
- **column-rule-color:**
    
    ```css
    .container {
        column-rule-color: #333;
    }
    
    ```
    

---

## 4. Exemplos de Código Otimizados

### Exemplo 1: Layout Multi-Coluna com Regra Simples

```css
.article {
    width: 800px;
    margin: 0 auto;
    column-count: 3;           /* Divide o conteúdo em 3 colunas */
    column-gap: 20px;          /* Espaço entre as colunas */
    column-rule: 1px dashed #999; /* Linha entre as colunas: 1px, tracejada e cinza */
    padding: 10px;
    font-size: 1rem;
    line-height: 1.5;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
}

```

```html
<div class="article">
  <p>Este é um exemplo de artigo que utiliza múltiplas colunas. A regra entre as colunas facilita a separação visual e melhora a legibilidade do conteúdo.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis.</p>
  <p>In condimentum facilisis porta. Sed nec diam eu diam mattis viverra.</p>
</div>

```

*Explicação:*

O artigo é dividido em três colunas com 20px de espaço entre elas, e uma linha tracejada de 1px e cor cinza é desenhada entre as colunas, separando visualmente cada coluna.

### Exemplo 2: Definindo Subpropriedades Individualmente

```css
.article {
    width: 800px;
    margin: 0 auto;
    column-count: 2;
    column-gap: 25px;
    column-rule-width: 3px;
    column-rule-style: double;
    column-rule-color: #2c3e50;
    padding: 15px;
    background-color: #fff;
}

```

```html
<div class="article">
  <p>Este exemplo mostra como configurar individualmente as subpropriedades da coluna regra. O resultado é uma linha dupla de 3px, com a cor definida, que separa as duas colunas.</p>
  <p>O layout de múltiplas colunas pode ser muito útil em designs que se assemelham a jornais ou revistas.</p>
</div>

```

*Explicação:*

Neste exemplo, as duas colunas são separadas por uma linha dupla de 3px com cor #2c3e50, proporcionando uma separação visual forte e definida.

---

## 5. Informações Adicionais

- **Propriedades Complementares:**
    - **column-gap:** Define o espaço entre as colunas.
    - **column-count:** Determina o número de colunas.
    - **columns:** É uma propriedade abreviada que pode combinar **column-width** e **column-count**.
- **Design Responsivo:**
    
    Ao usar unidades relativas ou definir apenas o número de colunas, o layout pode se adaptar automaticamente a diferentes tamanhos de tela, mantendo a consistência visual do espaçamento e das regras.
    
- **Aplicações Práticas:**
    
    Ideal para layouts de textos longos, como artigos, blogs, sites de notícias e revistas online, onde a separação clara entre colunas pode melhorar a legibilidade e a estética do design.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS column-rule:**[MDN CSS column-rule](https://developer.mozilla.org/pt-BR/docs/Web/CSS/column-rule)
- **MDN Web Docs – CSS Multi-column Layout:**[MDN CSS Multi-column Layout](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_Multi-column_Layout)
- **W3Schools – CSS Multi-column:**[W3Schools CSS Multi-column](https://www.w3schools.com/css/css3_multicolumn.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to CSS Multi-column Layout](https://css-tricks.com/snippets/css/multi-column-layout/)
    - [CSS Columns: An In-Depth Look](https://www.smashingmagazine.com/2015/05/css-multi-column-layout/)

---

## 7. Conclusão

A propriedade **column-rule** e suas subpropriedades (**column-rule-width**, **column-rule-style** e **column-rule-color**) oferecem um controle detalhado sobre a separação visual entre as colunas em um layout multi-coluna. Ao definir a largura, o estilo e a cor da linha que separa as colunas, os desenvolvedores podem criar designs mais organizados e legíveis, que se assemelham ao layout tradicional de jornais e revistas. Dominar essas propriedades é fundamental para criar interfaces modernas e responsivas. Explore os exemplos e referências fornecidos para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.