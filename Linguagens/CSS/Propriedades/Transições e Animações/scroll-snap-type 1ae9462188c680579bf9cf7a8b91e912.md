# scroll-snap-type

## 1. Introdução

A propriedade **scroll-snap-type** faz parte do conjunto de ferramentas de CSS Scroll Snap, que possibilita a criação de experiências de rolagem precisas e controladas. Ela define a política de "snap" para um contêiner de rolagem, ou seja, como e quando o contêiner deve parar em pontos pré-definidos (snap points) durante a rolagem. Isso permite que os elementos dentro do contêiner se alinhem automaticamente em posições específicas, melhorando a usabilidade e a estética de interfaces como carrosséis, galerias e páginas com seções "snap-to-section".

---

## 2. Conceitos Fundamentais

- **Objetivo:**
    
    **scroll-snap-type** determina a direção e a obrigatoriedade dos pontos de snap dentro de um contêiner rolável. Quando aplicada, essa propriedade indica ao navegador que ele deve alinhar os itens do contêiner conforme as condições definidas.
    
- **Benefícios e Aplicações:**
    - **Experiência de Navegação Suave:** Permite que a rolagem se pare de forma suave e previsível em pontos de snap, facilitando a navegação por interfaces complexas.
    - **Precisão Visual:** Garante que os elementos se alinhem de forma consistente, evitando que partes do conteúdo fiquem parcialmente visíveis ou desorganizadas.
    - **Layouts Responsivos:** Essencial para criar carrosséis, listas e seções de páginas onde a rolagem deve “encaixar” em locais específicos, independentemente do dispositivo.
- **Interação com Outras Propriedades:**
    
    **scroll-snap-type** trabalha em conjunto com propriedades como:
    
    - **scroll-snap-align:** Define o alinhamento individual dos itens dentro do contêiner.
    - **scroll-snap-stop:** Controla se o contêiner deve obrigatoriamente parar em um ponto de snap.
    - **scroll-behavior:** Quando usado com `smooth`, cria transições animadas até os pontos de snap.

---

## 3. Sintaxe e Valores

A sintaxe básica é:

```css
seletor {
  scroll-snap-type: <eixo> [<comportamento>];
}

```

### 3.1. Valores para o Eixo

- **x:**
    
    Define que o snapping ocorrerá horizontalmente.
    
    ```css
    scroll-snap-type: x;
    
    ```
    
- **y:**
    
    Define que o snapping ocorrerá verticalmente.
    
    ```css
    scroll-snap-type: y;
    
    ```
    
- **both:**
    
    Permite snapping em ambas as direções, horizontal e vertical.
    
    ```css
    scroll-snap-type: both;
    
    ```
    

### 3.2. Valores para o Comportamento

- **normal:**
    
    Permite que a rolagem seja interrompida nos pontos de snap, mas não força uma parada rígida se o usuário rolar rapidamente. Este é o valor implícito em muitos casos.
    
- **mandatory:**
    
    Força o contêiner a parar exatamente nos pontos de snap, mesmo que o usuário role com grande velocidade ou inércia.
    
    ```css
    scroll-snap-type: x mandatory;
    
    ```
    
- **proximity:**
    
    Aplica o snapping apenas se o ponto de snap estiver próximo do ponto de parada. Este valor permite uma rolagem mais flexível, onde o snapping ocorre de forma condicional.
    
    ```css
    scroll-snap-type: y proximity;
    
    ```
    

### Exemplo Combinado

```css
.carousel {
  scroll-snap-type: x mandatory;
}

```

*Neste exemplo, o contêiner `carousel` habilita o snapping horizontal de forma obrigatória.*

---

## 4. Exemplos Práticos

### Exemplo 1: Carrossel Horizontal com Scroll Snap

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory; /* Snapping horizontal obrigatório */
  scroll-behavior: smooth;       /* Rolagem suave */
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
}

.carousel-item {
  flex: 0 0 80%;
  scroll-snap-align: center; /* Cada item se alinha centralmente */
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

Cada item do carrossel se alinha ao centro da viewport quando a rolagem é concluída, graças a `scroll-snap-align: center;` e ao comportamento obrigatório definido em `scroll-snap-type: x mandatory;`. A propriedade `scroll-behavior: smooth;` proporciona uma transição animada, melhorando a experiência do usuário.

---

### Exemplo 2: Seções de Página com Snap Vertical

```css
.page-container {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.page-section {
  height: 100vh;
  scroll-snap-align: start; /* As seções se alinham ao topo */
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

Cada seção ocupa 100% da altura da viewport. Com `scroll-snap-type: y mandatory;` e `scroll-snap-align: start;`, a rolagem vertical faz com que o início de cada seção se alinhe com o topo da viewport, proporcionando uma transição de página precisa e intuitiva.

---

### Exemplo 3: Layout Bidimensional com Scroll Snap

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;
  overflow: auto;
  scroll-snap-type: both mandatory; /* Snapping em ambas as direções */
  gap: 10px;
  padding: 10px;
}

.grid-item {
  scroll-snap-align: center; /* Centraliza os itens quando snapados */
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

Neste exemplo, um grid bidimensional permite que os itens se alinhem tanto vertical quanto horizontalmente. O contêiner utiliza `scroll-snap-type: both mandatory;` para forçar o snap em ambas as direções, enquanto cada item se centraliza na área de snap, proporcionando um layout organizado e visualmente coerente.

---

## 5. Informações Adicionais

- **Integração com scroll-behavior:**
    
    Para obter uma experiência de rolagem suave, combine **scroll-snap-type** com `scroll-behavior: smooth;`. Isso proporciona transições animadas entre os pontos de snap.
    
- **Ajuste com scroll-margin e scroll-padding:**
    
    As propriedades **scroll-margin** e **scroll-padding** podem ser usadas em conjunto com **scroll-snap-align** para ajustar ainda mais a posição dos elementos na viewport, garantindo que eles não fiquem colados nas bordas.
    
- **Responsividade:**
    
    Em layouts responsivos, os pontos de snap podem ser ajustados via media queries para garantir que o comportamento de rolagem seja adequado a diferentes tamanhos de tela e dispositivos.
    
- **Aplicações Comuns:**
    - Carrosséis horizontais e verticais.
    - Seções de páginas de rolagem "snap-to-section".
    - Interfaces interativas e dashboards que exigem posicionamento preciso dos elementos durante a rolagem.
- **Compatibilidade:**
    
    As propriedades de Scroll Snap são suportadas pela maioria dos navegadores modernos, mas sempre é bom verificar as versões e realizar testes em diferentes dispositivos para garantir a consistência do comportamento.
    

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

A propriedade **scroll-snap-type** é fundamental para definir a política de snapping em contêineres de rolagem, permitindo que os elementos se alinhem de forma precisa e previsível na viewport. Ao definir a direção (x, y ou both) e o comportamento (mandatory ou proximity), os desenvolvedores podem criar experiências de rolagem suaves e intuitivas, que melhoram a navegação e a estética de interfaces interativas. Combinada com outras propriedades de scroll, como **scroll-snap-align**, **scroll-margin**, e **scroll-padding**, essa ferramenta permite a criação de layouts responsivos e bem organizados, adaptáveis a diversas necessidades de design. Explore os exemplos e recursos indicados para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.