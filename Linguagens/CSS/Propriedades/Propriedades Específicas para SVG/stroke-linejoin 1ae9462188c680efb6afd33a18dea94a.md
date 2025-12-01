# stroke-linejoin

## 1. Introdução

A propriedade **stroke-linejoin** é utilizada em SVG para definir como as junções entre segmentos de um traçado (path) são renderizadas. Essa propriedade influencia a forma como os cantos (joins) do traçado aparecem, proporcionando diferentes estilos visuais que podem melhorar a estética dos gráficos vetoriais.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **stroke-linejoin** determina o estilo dos cantos onde dois segmentos de um traçado se encontram.
    
- **Importância:**
    - **Estética Visual:** Melhora a aparência dos elementos gráficos, tornando as transições entre segmentos mais suaves ou mais marcadas, conforme o estilo desejado.
    - **Controle de Detalhe:** Permite ajustar a aparência dos cantos para se adequar ao design do ícone, gráfico ou ilustração.
    - **Compatibilidade:** Funciona em todos os elementos SVG que possuem um traçado, como `<path>`, `<rect>`, `<line>`, entre outros.
- **Relação com Outras Propriedades:**
    
    Essa propriedade é frequentemente utilizada junto com **stroke-width**, **stroke**, **stroke-linecap**, e **stroke-dasharray** para criar efeitos completos de estilo para os traçados.
    

---

## 3. Sintaxe e Valores

A sintaxe básica é:

```css
seletor {
  stroke-linejoin: valor;
}

```

### Valores Comuns:

- **miter (valor padrão):**
    
    Cria uma junção afiada, estendendo as bordas até que se encontrem em um ponto. Pode, porém, produzir "picos" muito agudos se os ângulos forem estreitos.
    
    ```css
    svg path {
      stroke-linejoin: miter;
    }
    
    ```
    
- **round:**
    
    As junções são arredondadas, criando um efeito suave e contínuo entre os segmentos.
    
    ```css
    svg path {
      stroke-linejoin: round;
    }
    
    ```
    
- **bevel:**
    
    Cria uma junção achatada, cortando o canto em um ângulo reto, o que pode ser útil para evitar picos agudos.
    
    ```css
    svg path {
      stroke-linejoin: bevel;
    }
    
    ```
    

---

## 4. Exemplos de Código Otimizados

### Exemplo 1: Comparando os Tipos de Junção

```html
<svg width="400" height="150">
  <!-- Linha com junção miter -->
  <path d="M20,30 L120,30 L120,100" fill="none" stroke="#3498db" stroke-width="10" stroke-linejoin="miter" />

  <!-- Linha com junção round -->
  <path d="M150,30 L250,30 L250,100" fill="none" stroke="#e74c3c" stroke-width="10" stroke-linejoin="round" />

  <!-- Linha com junção bevel -->
  <path d="M280,30 L380,30 L380,100" fill="none" stroke="#2ecc71" stroke-width="10" stroke-linejoin="bevel" />
</svg>

```

*Explicação:*

Neste exemplo, três caminhos SVG são desenhados com o mesmo traçado (mesma largura e cor variável), mas com diferentes valores para **stroke-linejoin**:

- O primeiro caminho usa `miter`, com junções afiladas.
- O segundo utiliza `round`, proporcionando cantos arredondados.
- O terceiro aplica `bevel`, resultando em cantos achatados.

### Exemplo 2: Aplicando em um Ícone Personalizado

```html
<svg width="200" height="200" viewBox="0 0 200 200">
  <path d="M50,50 L150,50 L100,150 Z" fill="none" stroke="#8e44ad" stroke-width="8" stroke-linejoin="round" />
</svg>

```

*Explicação:*

Um ícone triangular é desenhado com bordas arredondadas graças a `stroke-linejoin: round;`, suavizando os cantos do triângulo e oferecendo um visual mais moderno.

---

## 5. Informações Adicionais

- **Combinação com stroke-width:**
    
    O efeito de **stroke-linejoin** é mais evidente com valores mais altos de **stroke-width**. Um traçado fino pode não mostrar claramente as diferenças entre `miter`, `round` e `bevel`.
    
- **Ajuste com Miter Limit:**
    
    Quando se utiliza `stroke-linejoin: miter;`, é possível ajustar a propriedade **stroke-miterlimit** para controlar o quão longa uma junção miter pode se estender antes de ser convertida em um bevel.
    
- **Uso em Gráficos e Ícones:**
    
    Essa propriedade é essencial para desenhar gráficos, ícones e ilustrações SVG que exigem um controle preciso sobre a aparência dos cantos dos traçados.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – SVG stroke-linejoin:**[MDN SVG stroke-linejoin](https://developer.mozilla.org/pt-BR/docs/Web/SVG/Attribute/stroke-linejoin)
- **W3Schools – SVG Stroke Attributes:**[W3Schools SVG stroke-linejoin](https://www.w3schools.com/graphics/svg_stroke-linejoin.asp)
- **Artigos e Tutoriais:**
    - [Understanding SVG Stroke Properties](https://css-tricks.com/understanding-svg-stroke-properties/)
    - [A Guide to SVG](https://www.smashingmagazine.com/2014/04/svg-in-use/)

---

## 7. Conclusão

A propriedade **stroke-linejoin** é crucial para definir como os cantos dos traçados SVG são renderizados. Ao escolher entre os valores `miter`, `round` e `bevel`, os desenvolvedores podem personalizar a aparência dos gráficos vetoriais, garantindo que os elementos se integrem de forma harmoniosa ao design geral. Combinada com outras propriedades de traçado, **stroke-linejoin** permite criar interfaces visuais sofisticadas e coerentes. Explore os exemplos e referências indicados para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de SVG e CSS.