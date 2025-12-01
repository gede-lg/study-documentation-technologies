# overscroll-behavior e Variações

## 1. Introdução

A propriedade **overscroll-behavior** é uma ferramenta poderosa para controlar como um contêiner lida com o "excesso de rolagem" — ou seja, quando o usuário tenta rolar além dos limites do conteúdo. Essa propriedade evita comportamentos indesejados, como o "bounce" (efeito de mola) em dispositivos móveis ou a propagação de eventos de rolagem para elementos pai, e permite uma experiência de rolagem mais suave e controlada.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **overscroll-behavior** especifica o que deve ocorrer quando a rolagem atinge o fim de um contêiner. Ela determina se o evento de rolagem deve ser propagado para o elemento pai (por exemplo, para a janela de visualização) ou se deve ser “contido” dentro do próprio elemento.
    
- **Importância:**
    - **Experiência do Usuário:** Evita comportamentos indesejados, como o efeito de "bounce" em dispositivos móveis, e permite um controle mais preciso da rolagem.
    - **Isolamento de Eventos:** Impede que eventos de rolagem ultrapassem o contêiner, o que é especialmente útil em interfaces complexas onde múltiplos níveis de rolagem coexistem.
    - **Controle de Interatividade:** Melhora a previsibilidade e o comportamento de interfaces que dependem de rolagem, como carrosséis, painéis de navegação e conteúdos dinâmicos.
- **Variações:**
    
    A propriedade possui variações que permitem controlar o comportamento de rolagem em direções específicas:
    
    - **overscroll-behavior-x:** Aplica as regras de overscroll apenas no eixo horizontal.
    - **overscroll-behavior-y:** Aplica as regras de overscroll apenas no eixo vertical.

---

## 3. Sintaxe e Valores

### 3.1. Sintaxe Básica

```css
seletor {
  overscroll-behavior: <valor>;
}

```

Ou, para direções específicas:

```css
seletor {
  overscroll-behavior-x: <valor>;
  overscroll-behavior-y: <valor>;
}

```

### 3.2. Valores Comuns

- **auto:**
    
    Permite o comportamento padrão de overscroll, onde o evento pode se propagar para os elementos pai ou exibir efeitos de "bounce" conforme implementado pelo navegador.
    
    ```css
    overscroll-behavior: auto;
    
    ```
    
- **contain:**
    
    Contém o comportamento de rolagem dentro do elemento, evitando que a rolagem "vaze" para os elementos pai. Nesse modo, o navegador não irá exibir efeitos de "bounce" nem propagará eventos de rolagem.
    
    ```css
    overscroll-behavior: contain;
    
    ```
    
- **none:**
    
    Desabilita completamente o comportamento de overscroll, impedindo que qualquer rolagem adicional ocorra, mesmo que o usuário tente ir além dos limites do elemento.
    
    ```css
    overscroll-behavior: none;
    
    ```
    

*Nota:* Os mesmos valores podem ser usados para **overscroll-behavior-x** e **overscroll-behavior-y**, permitindo controle granular em cada eixo.

---

## 4. Exemplos de Uso

### Exemplo 1: Contenção de Rolagem Vertical com `overscroll-behavior`

Imagine um contêiner com rolagem vertical onde você deseja evitar que, ao atingir o final, o efeito de "bounce" ou a propagação para a janela de visualização aconteça.

```css
.scroll-container {
  height: 300px;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  border: 1px solid #ccc;
  padding: 10px;
}

```

```html
<div class="scroll-container">
  <p>Conteúdo longo que exige rolagem...</p>
  <p>Mais conteúdo...</p>
  <p>Continue adicionando conteúdo para criar rolagem.</p>
  <p>Exemplo de texto para preencher o espaço.</p>
  <p>Outro parágrafo para testar o comportamento.</p>
  <p>E assim por diante...</p>
</div>

```

*Explicação:*

Com `overscroll-behavior-y: contain;`, quando o usuário rolar até o final do contêiner, a rolagem não será propagada para o elemento pai nem causará efeitos de "bounce".

---

### Exemplo 2: Contenção de Rolagem Horizontal com `overscroll-behavior-x`

Para um carrossel horizontal, você pode querer que a rolagem horizontal se limite ao contêiner, sem acionar rolagem adicional na página.

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
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

Com `overscroll-behavior-x: contain;`, a rolagem horizontal é limitada ao contêiner do carrossel, evitando que o gesto de rolagem ultrapasse o carrossel e afete o scroll global da página.

---

### Exemplo 3: Desabilitando o Overscroll com `none`

Em alguns casos, você pode querer desabilitar completamente o comportamento de overscroll para um elemento.

```css
.full-page-scroll {
  height: 100vh;
  overflow-y: scroll;
  overscroll-behavior: none;
}

```

```html
<div class="full-page-scroll">
  <p>Conteúdo da página que não permitirá overscroll, evitando efeitos de "bounce".</p>
  <!-- Conteúdo adicional -->
</div>

```

*Explicação:*

Com `overscroll-behavior: none;`, qualquer tentativa de rolagem além dos limites do elemento será bloqueada, sem propagação ou efeitos de rolagem adicionais.

---

## 5. Informações Adicionais

- **Combinação com Outras Propriedades de Rolagem:**
    
    **overscroll-behavior** trabalha em conjunto com `overflow`, `scroll-snap-type` e `scroll-behavior` para proporcionar uma experiência de rolagem completa e controlada.
    
- **Aplicações em Layouts Complexos:**
    
    Essa propriedade é particularmente útil em interfaces complexas, onde múltiplos níveis de rolagem existem (por exemplo, um carrossel dentro de uma página longa) e onde é crucial evitar a propagação não intencional dos eventos de rolagem.
    
- **Compatibilidade:**
    
    As propriedades **overscroll-behavior**, **overscroll-behavior-x** e **overscroll-behavior-y** são amplamente suportadas em navegadores modernos. Contudo, sempre verifique a compatibilidade para ambientes específicos, pois navegadores mais antigos podem não oferecer suporte completo.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS overscroll-behavior:**[MDN CSS overscroll-behavior](https://developer.mozilla.org/pt-BR/docs/Web/CSS/overscroll-behavior)
- **MDN Web Docs – CSS scroll-snap-type:**[MDN CSS scroll-snap-type](https://developer.mozilla.org/pt-BR/docs/Web/CSS/scroll-snap-type)
- **Artigos e Tutoriais:**
    - [A Complete Guide to CSS Scroll Snap](https://css-tricks.com/snippets/css/complete-guide-scroll-snap/)
    - [Improving Scrolling Experience with overscroll-behavior](https://www.smashingmagazine.com/2020/01/css-scroll-snap-overscroll-behavior/)

---

## 7. Conclusão

A propriedade **overscroll-behavior** e suas variações permitem um controle preciso sobre como os elementos respondem ao "excesso de rolagem", melhorando a experiência do usuário e evitando efeitos indesejados, como o "bounce" ou a propagação de eventos de rolagem para elementos pai. Ao aplicar técnicas como `overscroll-behavior: contain;` ou `none`, os desenvolvedores podem criar interfaces mais estáveis e intuitivas, seja em carrosséis, páginas completas ou componentes complexos. Dominar essas propriedades, juntamente com outras ferramentas de rolagem e responsividade, é essencial para criar experiências web modernas e refinadas. Explore os exemplos e recursos indicados para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.