# dominant-baseline

## 1. Introdução

A propriedade **dominant-baseline** é amplamente utilizada em gráficos vetoriais (SVG) para controlar o alinhamento vertical do texto em relação à sua linha de base. Essa propriedade determina qual linha de base do texto é utilizada como referência para o alinhamento do conteúdo, sendo essencial para garantir que o texto seja posicionado de forma precisa e visualmente consistente em diferentes contextos gráficos.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **dominant-baseline** especifica qual linha de base deve ser utilizada para alinhar o conteúdo de texto em elementos SVG. Ela influencia o posicionamento vertical do texto, permitindo que se escolha entre diferentes critérios de alinhamento, como o centro do texto, a linha de base matemática, ou a posição de suspensão (hanging), entre outros.
    
- **Objetivos e Benefícios:**
    - **Alinhamento Preciso:** Garante que o texto seja posicionado de acordo com a linha de base desejada, o que é crucial para composições tipográficas complexas em SVG.
    - **Consistência Visual:** Ajuda a manter uma aparência uniforme em layouts gráficos onde o texto precisa estar perfeitamente alinhado com outros elementos visuais.
    - **Flexibilidade Tipográfica:** Permite a adaptação de diferentes estilos e contextos linguísticos, onde as regras de alinhamento podem variar (por exemplo, para scripts não latinos).
- **Contexto de Uso:**
    
    Essa propriedade é particularmente importante em SVG, onde o alinhamento do texto pode afetar significativamente a legibilidade e a estética dos gráficos e ilustrações. É comum usá-la em gráficos, infográficos, ícones e qualquer outro contexto em que o texto precisa ser posicionado com precisão.
    

---

## 3. Sintaxe e Valores

A sintaxe básica é:

```css
seletor {
  dominant-baseline: valor;
}

```

### Valores Comuns:

- **auto:**
    
    Permite que o navegador determine automaticamente a linha de base dominante com base no conteúdo e na fonte.
    
    ```css
    text {
      dominant-baseline: auto;
    }
    
    ```
    
- **text-bottom:**
    
    Alinha o fundo do texto com a linha de base dominante.
    
    ```css
    text {
      dominant-baseline: text-bottom;
    }
    
    ```
    
- **alphabetic:**
    
    Utiliza a linha de base alfabética, que é o padrão para a maioria dos textos latinos.
    
    ```css
    text {
      dominant-baseline: alphabetic;
    }
    
    ```
    
- **ideographic:**
    
    Alinha o texto de acordo com a linha de base ideográfica, comum em sistemas de escrita como o chinês ou o japonês.
    
    ```css
    text {
      dominant-baseline: ideographic;
    }
    
    ```
    
- **middle:**
    
    Alinha o centro do texto com a linha de base dominante, centralizando verticalmente o conteúdo.
    
    ```css
    text {
      dominant-baseline: middle;
    }
    
    ```
    
- **central:**
    
    Semelhante a `middle`, mas pode ter uma implementação sutilmente diferente dependendo do navegador e da fonte.
    
    ```css
    text {
      dominant-baseline: central;
    }
    
    ```
    
- **mathematical:**
    
    Usa uma linha de base ajustada para notação matemática, que pode ser útil para equações e fórmulas.
    
    ```css
    text {
      dominant-baseline: mathematical;
    }
    
    ```
    
- **hanging:**
    
    Utiliza uma linha de base baseada na parte superior das letras, comumente usada para certos scripts ou para efeitos estilísticos.
    
    ```css
    text {
      dominant-baseline: hanging;
    }
    
    ```
    

*Nota:* A interpretação exata desses valores pode variar entre navegadores e depende do conteúdo e da fonte utilizada.

---

## 4. Exemplos Práticos

### Exemplo 1: Uso Básico com Texto em SVG

```css
svg text {
  font-size: 24px;
  fill: #333;
  dominant-baseline: middle;
}

```

```html
<svg width="300" height="100">
  <text x="150" y="50" text-anchor="middle">
    Texto Centralizado
  </text>
</svg>

```

*Explicação:*

Neste exemplo, o texto é centralizado verticalmente dentro do SVG graças a `dominant-baseline: middle;`, enquanto `text-anchor: middle;` garante o alinhamento horizontal. O resultado é um texto que parece perfeitamente centrado na área do SVG.

---

### Exemplo 2: Alinhamento com Diferentes Baselines

```css
svg text.alphabetic {
  font-size: 20px;
  fill: #2ecc71;
  dominant-baseline: alphabetic;
}

svg text.ideographic {
  font-size: 20px;
  fill: #e74c3c;
  dominant-baseline: ideographic;
}

```

```html
<svg width="300" height="120">
  <text class="alphabetic" x="10" y="40">Alphabetic Baseline</text>
  <text class="ideographic" x="10" y="80">Ideographic Baseline</text>
</svg>

```

*Explicação:*

Duas linhas de texto são renderizadas com diferentes configurações de baseline. A primeira utiliza `alphabetic`, que é o padrão para textos latinos, enquanto a segunda utiliza `ideographic`, que é mais comum para scripts ideográficos. Esse exemplo destaca as diferenças visuais no alinhamento vertical dos textos.

---

### Exemplo 3: Aplicando Hanging Baseline para Efeitos Estilísticos

```css
svg text.hanging {
  font-size: 18px;
  fill: #34495e;
  dominant-baseline: hanging;
}

```

```html
<svg width="300" height="100">
  <text class="hanging" x="10" y="10">
    Texto com Hanging Baseline
  </text>
</svg>

```

*Explicação:*

Aqui, o texto é posicionado usando `dominant-baseline: hanging;`, o que significa que o alinhamento é baseado na parte superior das letras, criando um efeito visual que pode ser interessante para certos estilos tipográficos ou scripts específicos.

---

## 5. Informações Adicionais

- **Compatibilidade:**
    
    A propriedade **dominant-baseline** é suportada na maioria dos navegadores modernos para SVG. Entretanto, seu comportamento pode variar dependendo do navegador, da fonte e do conteúdo, portanto, testes em diferentes ambientes são recomendados.
    
- **Uso em Conjunto com Outras Propriedades:**
    
    **dominant-baseline** é frequentemente usada com propriedades como `text-anchor` para alinhar texto de forma precisa tanto verticalmente quanto horizontalmente.
    
    ```css
    text {
      dominant-baseline: middle;
      text-anchor: middle;
    }
    
    ```
    
- **Ajustes Finitos em Tipografia:**
    
    Essa propriedade é crucial em aplicações de design tipográfico onde o alinhamento vertical do texto impacta significativamente a legibilidade e a estética do layout, como em logotipos, títulos e infográficos.
    
- **Contexto Cultural:**
    
    Em scripts não latinos, como o chinês, japonês ou coreano, os valores como `ideographic` e `hanging` são essenciais para um alinhamento tipográfico apropriado.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS dominant-baseline:**[MDN CSS dominant-baseline](https://developer.mozilla.org/en-US/docs/Web/CSS/dominant-baseline)
- **MDN Web Docs – SVG Text:**[MDN SVG Text](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text)
- **W3Schools – SVG Text:**[W3Schools SVG Text](https://www.w3schools.com/graphics/svg_text.asp)
- **Artigos e Tutoriais:**
    - [Aligning Text in SVG](https://css-tricks.com/centering-text-in-an-svg/)
    - [Understanding Baselines in Typography](https://www.smashingmagazine.com/2018/03/typography-baselines/)

---

## 7. Conclusão

A propriedade **dominant-baseline** é uma ferramenta essencial para controlar o alinhamento vertical do texto em SVG, proporcionando maior precisão e flexibilidade na disposição dos elementos tipográficos. Ao escolher entre valores como `alphabetic`, `ideographic`, `middle`, `hanging` e outros, os desenvolvedores podem ajustar o posicionamento do texto para atender aos requisitos específicos do design e das convenções tipográficas dos diferentes idiomas. Essa capacidade de personalização é fundamental para a criação de interfaces visualmente consistentes e de alta qualidade. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.