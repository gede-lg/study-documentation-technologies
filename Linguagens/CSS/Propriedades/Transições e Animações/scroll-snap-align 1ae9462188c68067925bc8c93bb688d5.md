# scroll-snap-align

## 1. Introdução

A propriedade **scroll-snap-align** é parte do conjunto de funcionalidades de Scroll Snap em CSS, que permite alinhar elementos roláveis em pontos específicos da viewport. Essa propriedade determina como um item dentro de um contêiner de rolagem deve se alinhar com os pontos de snap definidos pelo contêiner (através de `scroll-snap-type`). Ao aplicar **scroll-snap-align**, os desenvolvedores podem criar experiências de rolagem mais precisas e controladas, onde os elementos "encaixam" automaticamente em posições definidas, melhorando a usabilidade e a estética do layout.

---

## 2. Conceitos Fundamentais

- **Objetivo:**
    
    **scroll-snap-align** especifica a posição que um item deve ocupar quando o contêiner de rolagem “snapa” (fixa) o item em uma posição determinada. Essa propriedade determina o alinhamento do item em relação à viewport.
    
- **Importância:**
    - **Experiência de Navegação Melhorada:** Ao garantir que os itens se alinhem corretamente, os usuários experimentam uma rolagem suave e intuitiva.
    - **Precisão no Layout:** Ajuda a manter a consistência visual, fazendo com que os elementos pareçam organizados e bem posicionados, mesmo quando o usuário interage com a rolagem.
    - **Flexibilidade:** Pode ser aplicada em qualquer contêiner com rolagem, seja horizontal ou vertical, e permite definir alinhamentos diferentes para cada item.
- **Relação com Outras Propriedades de Scroll Snap:**
    
    Geralmente usada em conjunto com `scroll-snap-type` no contêiner, que define a política de snapping (e.g., `x mandatory` para rolagem horizontal). Enquanto `scroll-snap-type` determina a estratégia do contêiner, **scroll-snap-align** especifica como cada item deve se posicionar dentro desse contexto.
    

---

## 3. Sintaxe e Valores

A sintaxe básica é:

```css
seletor {
  scroll-snap-align: valor;
}

```

### Valores Comuns:

- **start:**
    
    Alinha o início do item com o ponto de snap.
    
    ```css
    .item {
      scroll-snap-align: start;
    }
    
    ```
    
- **center:**
    
    Centraliza o item no ponto de snap.
    
    ```css
    .item {
      scroll-snap-align: center;
    }
    
    ```
    
- **end:**
    
    Alinha o final do item com o ponto de snap.
    
    ```css
    .item {
      scroll-snap-align: end;
    }
    
    ```
    
- **Valores Combinados:**
    
    Você pode também especificar valores para os eixos (block e inline) separadamente, embora na prática, para a maioria dos casos, um único valor seja suficiente.
    
    ```css
    .item {
      scroll-snap-align: start center;
    }
    
    ```
    
    *Aqui, o primeiro valor geralmente se refere ao eixo block (vertical) e o segundo ao eixo inline (horizontal).*
    

---

## 4. Exemplos Práticos

### Exemplo 1: Carrossel Horizontal com Itens Centralizados

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
}

.carousel-item {
  flex: 0 0 80%;
  scroll-snap-align: center;
  background-color: #3498db;
  color: #fff;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
}

```

```html
<div class="carousel">
  <div class="carousel-item">Item 1</div>
  <div class="carousel-item">Item 2</div>
  <div class="carousel-item">Item 3</div>
</div>

```

*Explicação:*

Cada item do carrossel se alinha ao centro da viewport ao ser "snapado", graças a `scroll-snap-align: center;`. A propriedade `scroll-snap-type: x mandatory;` garante que o contêiner horizontal force o alinhamento conforme os itens são rolados.

---

### Exemplo 2: Seções de Página com Alinhamento no Início

```css
.page-container {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.page-section {
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: #ecf0f1;
  border-bottom: 2px solid #bdc3c7;
}

```

```html
<div class="page-container">
  <section class="page-section">Seção 1</section>
  <section class="page-section">Seção 2</section>
  <section class="page-section">Seção 3</section>
</div>

```

*Explicação:*

Neste exemplo, cada `<section>` ocupa a altura completa da viewport. Com `scroll-snap-align: start;`, o início de cada seção se alinha com o início da viewport, proporcionando uma transição clara e precisa entre as seções ao rolar verticalmente.

---

### Exemplo 3: Alinhamento Combinado para Layout Bidimensional

Em um layout de grid com rolagem bidimensional, você pode ajustar o alinhamento tanto no eixo vertical quanto no horizontal:

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;
  overflow: auto;
  scroll-snap-type: both mandatory;
  gap: 10px;
  padding: 10px;
}

.grid-item {
  scroll-snap-align: center;
  background-color: #2ecc71;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

```

```html
<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
  <div class="grid-item">Item 4</div>
  <div class="grid-item">Item 5</div>
  <div class="grid-item">Item 6</div>
</div>

```

*Explicação:*

No grid bidimensional, cada item se alinha ao centro tanto no eixo vertical quanto no horizontal quando o contêiner "snapa" a rolagem, proporcionando um layout uniforme e organizado.

---

## 5. Informações Adicionais

- **Integração com scroll-behavior:**
    
    A propriedade **scroll-snap-align** funciona melhor quando combinada com `scroll-behavior: smooth;`, que garante uma transição animada e suave para o ponto de snap.
    
- **Ajuste Fino:**
    
    Em layouts complexos, você pode combinar **scroll-snap-align** com outras propriedades de scroll, como `scroll-margin` e `scroll-padding`, para ajustar de forma precisa a posição final dos elementos na viewport.
    
- **Responsividade:**
    
    Os valores de **scroll-snap-align** podem ser ajustados com media queries para adaptar o comportamento de rolagem a diferentes tamanhos de tela, garantindo uma experiência de usuário consistente em dispositivos móveis, tablets e desktops.
    
- **Aplicações Práticas:**
    - Carrosséis horizontais e verticais.
    - Seções de página em layouts de rolagem "snap-to-section".
    - Interfaces interativas e dashboards que requerem posicionamento preciso de elementos durante a rolagem.

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS Scroll Snap:**[MDN CSS Scroll Snap](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_Scroll_Snap)
- **MDN Web Docs – scroll-snap-align:**[MDN scroll-snap-align](https://developer.mozilla.org/pt-BR/docs/Web/CSS/scroll-snap-align)
- **W3Schools – CSS Scroll Snap:**[W3Schools CSS Scroll Snap](https://www.w3schools.com/css/css3_scroll_snap.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to CSS Scroll Snap](https://css-tricks.com/snippets/css/complete-guide-scroll-snap/)
    - [Building a Scroll Snap Carousel](https://www.smashingmagazine.com/2019/05/scroll-snap-layouts-css/)

---

## 7. Conclusão

A propriedade **scroll-snap-align** é fundamental para definir como os elementos se posicionam dentro de um contêiner de rolagem quando os pontos de snap são ativados. Ao especificar valores como `start`, `center` ou `end`, os desenvolvedores podem garantir que os elementos se alinhem de maneira precisa e consistente na viewport, proporcionando uma experiência de navegação suave e intuitiva. Combinada com outras propriedades de scroll (como `scroll-snap-type`, `scroll-behavior`, e `scroll-margin`), **scroll-snap-align** contribui para a criação de layouts interativos e responsivos que se adaptam perfeitamente a diferentes dispositivos e contextos. Explore os exemplos e referências fornecidos para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.