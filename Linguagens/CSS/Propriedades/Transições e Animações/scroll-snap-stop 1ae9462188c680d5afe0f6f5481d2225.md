# scroll-snap-stop

## 1. Introdução

A propriedade **scroll-snap-stop** é uma adição ao conjunto de funcionalidades de CSS Scroll Snap que permite controlar o comportamento de "parada" em pontos de snap dentro de um contêiner rolável. Em essência, ela define se um ponto de snap é obrigatório, forçando a rolagem a parar naquele ponto, mesmo que haja inércia ou gestos de rolagem rápidos do usuário. Essa propriedade oferece maior controle sobre a experiência de rolagem, garantindo uma navegação mais precisa e consistente em layouts interativos e responsivos.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **scroll-snap-stop** especifica se o contêiner de rolagem deve obrigatoriamente parar em um ponto de snap definido por **scroll-snap-align** quando um usuário interage com o scroll. Em outras palavras, ela determina se o snap deve ser "mandatório" (obrigatório) ou se o comportamento padrão de inércia pode ultrapassar o ponto de snap.
    
- **Objetivos e Benefícios:**
    - **Controle Preciso do Comportamento de Rolagem:** Força o navegador a interromper a rolagem em pontos específicos, garantindo que o conteúdo se alinhe exatamente como desejado.
    - **Melhoria na Experiência do Usuário:** Ao evitar que a rolagem ultrapasse pontos de snap importantes, essa propriedade ajuda a manter uma navegação intuitiva e previsível, especialmente em interfaces com carrosséis, listas ou seções de página.
    - **Interação com Gestos e Inércia:** É particularmente útil em dispositivos com rolagem inercial, onde a rolagem pode continuar mesmo após o gesto do usuário terminar. **scroll-snap-stop** pode forçar a parada naquele ponto crítico, melhorando a usabilidade.
- **Contexto de Uso:**
    
    Essa propriedade é utilizada em contêineres que aplicam Scroll Snap, onde os pontos de snap são definidos por outras propriedades como **scroll-snap-type** no contêiner e **scroll-snap-align** nos itens. Combinada, elas permitem que os elementos se alinhem de maneira suave e precisa durante a rolagem.
    

---

## 3. Sintaxe e Valores

A sintaxe básica para **scroll-snap-stop** é:

```css
seletor {
  scroll-snap-stop: valor;
}

```

### Valores Possíveis:

- **normal:**
    
    Este é o valor padrão. Quando definido como `normal`, o comportamento de snap é flexível e o contêiner não forçará uma parada rígida no ponto de snap se o usuário rolar rapidamente ou se houver inércia.
    
    ```css
    .carousel-item {
      scroll-snap-stop: normal;
    }
    
    ```
    
- **always:**
    
    Quando definido como `always`, o contêiner de rolagem é instruído a obrigatoriamente parar no ponto de snap, mesmo que o usuário role com grande velocidade ou inércia. Esse valor é útil para garantir que certos itens sempre se alinhem exatamente, criando uma experiência de rolagem "bloqueada" nesse ponto.
    
    ```css
    .carousel-item {
      scroll-snap-stop: always;
    }
    
    ```
    

*Nota:* O valor `always` pode ser particularmente útil em interfaces onde é crucial que o usuário observe cada item individualmente, sem pular acidentalmente algum conteúdo importante.

---

## 4. Exemplos Práticos

### Exemplo 1: Carrossel Horizontal com Parada Obrigatória

Imagine um carrossel horizontal onde cada item precisa ser visualizado completamente antes que o usuário possa continuar rolando.

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
  scroll-snap-stop: always; /* Força a parada no ponto de snap */
  background-color: #3498db;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
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

Ao definir `scroll-snap-stop: always;` em cada item do carrossel, o navegador garante que, mesmo se o usuário rolar rapidamente, ele fará uma parada obrigatória em cada item, proporcionando uma experiência de navegação controlada e focada.

---

### Exemplo 2: Seções de Página com Parada Flexível

Em uma página longa com seções que devem ser snapadas, mas onde uma rolagem mais fluida é desejada, você pode manter o valor padrão.

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
  scroll-snap-stop: normal; /* Permite rolagem inercial se necessário */
  padding: 20px;
  background: #f7f7f7;
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

Neste exemplo, as seções usam `scroll-snap-stop: normal;`, o que permite uma rolagem inercial mais natural e não obriga uma parada rígida, ideal para uma experiência de leitura contínua.

---

### Exemplo 3: Combinação com scroll-margin e scroll-padding

Para um ajuste ainda mais refinado da posição dos elementos durante a rolagem, **scroll-snap-stop** pode ser combinada com **scroll-margin** e **scroll-padding**:

```css
.container {
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  scroll-padding-top: 50px;
  scroll-margin-bottom: 20px;
}

.item {
  height: 100vh;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: #2ecc71;
}

```

```html
<div class="container">
  <div class="item">Slide 1</div>
  <div class="item">Slide 2</div>
  <div class="item">Slide 3</div>
</div>

```

*Explicação:*

Neste layout de slides, os itens são "snapados" ao centro da viewport com uma margem e preenchimento extras. A propriedade `scroll-snap-stop: always;` garante que cada slide seja apresentado integralmente, sem ser pulado, mesmo com rolagem rápida.

---

## 5. Informações Adicionais

- **Impacto na Experiência do Usuário:**
    
    O uso de **scroll-snap-stop** pode melhorar significativamente a experiência de rolagem, especialmente em interfaces onde cada item possui importância visual ou informativa. No entanto, um uso excessivo de `always` pode tornar a rolagem menos fluida, por isso é importante usá-lo estrategicamente.
    
- **Combinação com JavaScript:**
    
    Em casos onde o comportamento de rolagem precisa ser controlado dinamicamente, **scroll-snap-stop** pode ser combinada com métodos JavaScript como `scrollIntoView()` para garantir que os itens se alinhem corretamente, respeitando as margens e pontos de snap definidos.
    
- **Compatibilidade:**
    
    As propriedades de Scroll Snap, incluindo **scroll-snap-stop**, são suportadas em navegadores modernos, mas é sempre bom verificar a compatibilidade em diferentes ambientes, especialmente em dispositivos móveis e navegadores mais antigos.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS Scroll Snap:**[MDN CSS Scroll Snap](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_Scroll_Snap)
- **MDN Web Docs – scroll-snap-stop:**[MDN scroll-snap-stop](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-stop)*(Verifique a disponibilidade e notas de compatibilidade, pois essa propriedade é relativamente nova.)*
- **W3Schools – CSS Scroll Snap:**[W3Schools CSS Scroll Snap](https://www.w3schools.com/css/css3_scroll_snap.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to CSS Scroll Snap](https://css-tricks.com/snippets/css/complete-guide-scroll-snap/)
    - [Building a Scroll Snap Carousel](https://www.smashingmagazine.com/2019/05/scroll-snap-layouts-css/)

---

## 7. Conclusão

A propriedade **scroll-snap-stop** é uma ferramenta valiosa para aprimorar a precisão e o controle da rolagem em layouts que utilizam Scroll Snap. Ao definir se um ponto de snap deve ser obrigatório (`always`) ou flexível (`normal`), os desenvolvedores podem criar experiências de navegação que garantem que cada elemento seja exibido com a devida importância e sem ser pulado acidentalmente. Quando combinada com outras propriedades de scroll, como **scroll-snap-align**, **scroll-margin** e **scroll-padding**, **scroll-snap-stop** permite a criação de interfaces modernas, interativas e responsivas, proporcionando uma experiência de usuário suave e intuitiva. Explore os exemplos e referências fornecidas para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.