# text-emphasis-color

## 1. Introdução

A propriedade **text-emphasis-color** é usada para definir a cor das marcas de ênfase aplicadas ao texto por meio da propriedade **text-emphasis**. Essa propriedade permite personalizar o aspecto visual das marcas de ênfase, contribuindo para a consistência do design tipográfico e ajudando a destacar partes importantes do conteúdo. É especialmente útil em contextos onde se deseja enfatizar visualmente o texto, seja de forma decorativa ou para melhorar a legibilidade.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **text-emphasis-color** especifica a cor que será utilizada para renderizar a marca de ênfase inserida pelo pseudo-elemento (geralmente via `::before` ou `::after`) quando a propriedade **text-emphasis** é aplicada.
    
- **Objetivo e Importância:**
    - **Personalização Visual:** Permite que as marcas de ênfase sejam coloridas de forma a harmonizar com o restante da paleta de cores do design.
    - **Destaque e Legibilidade:** Ao escolher uma cor contrastante, é possível chamar a atenção para partes específicas do texto, melhorando a experiência do usuário.
    - **Consistência:** Garante que as marcas de ênfase mantenham uma aparência uniforme em todo o site ou aplicação.
- **Contexto de Uso:**
    
    Essa propriedade é aplicada juntamente com outras propriedades relacionadas à ênfase de texto, como **text-emphasis** e **text-emphasis-style**, para formar um conjunto completo que define tanto o conteúdo da ênfase quanto sua aparência.
    

---

## 3. Sintaxe e Estrutura

A sintaxe básica para **text-emphasis-color** é:

```css
seletor {
  text-emphasis-color: <valor>;
}

```

- **:**
Pode ser definido utilizando nomes de cores, valores hexadecimais, funções RGB, RGBA, HSL ou HSLA, permitindo flexibilidade na escolha da cor.

**Exemplo:**

```css
.emphasized-text {
  text-emphasis: filled dot over;
  text-emphasis-color: #e74c3c;
}

```

*Explicação:*

Neste exemplo, a marca de ênfase (um ponto preenchido posicionado acima do texto) será renderizada com a cor vermelha (#e74c3c).

---

## 4. Exemplos Práticos

### Exemplo 1: Ênfase Simples em um Parágrafo

```css
p.emphasis {
  /* Define a marca de ênfase com estilo e posição */
  text-emphasis: filled circle under;
  /* Define a cor da marca de ênfase */
  text-emphasis-color: #2ecc71;
  font-size: 1.1rem;
  line-height: 1.6;
}

```

```html
<p class="emphasis">
  Este parágrafo utiliza uma marca de ênfase em forma de círculo preenchido, com a cor verde, para destacar seu conteúdo.
</p>

```

*Explicação:*

O parágrafo apresenta uma ênfase visual na forma de um círculo posicionado abaixo do texto, com a cor verde (#2ecc71), o que confere destaque e melhora a legibilidade.

---

### Exemplo 2: Destacando Links com Ênfase

```css
a {
  text-decoration: none;
  text-emphasis: filled dot over;
  text-emphasis-color: #3498db;
  font-size: 1rem;
  color: #333;
}

```

```html
<a href="#">Clique aqui para mais informações</a>

```

*Explicação:*

Neste exemplo, o link é destacado por uma marca de ênfase na forma de um ponto preenchido posicionado acima do texto, com a cor azul (#3498db). Isso não apenas diferencia o link visualmente, mas também adiciona um elemento de design moderno ao texto.

---

### Exemplo 3: Combinação com Outras Propriedades de Ênfase

```css
.highlight {
  font-size: 1.2rem;
  text-emphasis: open circle under;
  text-emphasis-color: hsl(210, 70%, 50%);
  text-underline-offset: 0.2em;
  color: #333;
}

```

```html
<p class="highlight">
  Marquei este texto com uma ênfase de círculo aberto, adicionando um toque sutil e elegante à tipografia.
</p>

```

*Explicação:*

A classe `.highlight` aplica uma marca de ênfase em forma de círculo aberto, posicionado abaixo do texto, com a cor definida em HSL para maior flexibilidade e controle sobre a tonalidade. A combinação com `text-underline-offset` ajuda a ajustar o espaçamento da marca, criando um design tipográfico harmonioso.

---

## 5. Informações Adicionais

- **Compatibilidade:**
    
    A propriedade **text-emphasis-color** é suportada em navegadores modernos. Contudo, como parte do conjunto de propriedades de ênfase de texto, é importante verificar a compatibilidade se o design depende fortemente desses efeitos.
    
- **Integração com Outras Propriedades:**
    
    **text-emphasis-color** funciona em conjunto com **text-emphasis** e **text-emphasis-style** para formar um conjunto coeso de propriedades que definem tanto a presença quanto o estilo visual das marcas de ênfase. Juntas, elas permitem um controle total sobre como o texto é destacado.
    
- **Aplicações Criativas:**
    
    Além de destacar links e parágrafos, **text-emphasis-color** pode ser usada para criar efeitos de design em interfaces interativas, infográficos e layouts onde a tipografia tem um papel central no design.
    
- **Personalização e Tematização:**
    
    Ao utilizar variáveis CSS ou valores dinâmicos, é possível ajustar a cor da ênfase para se adequar a diferentes temas ou modos (como o modo escuro e claro), contribuindo para uma experiência de usuário consistente e personalizada.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS text-emphasis-color:**[MDN CSS text-emphasis-color](https://developer.mozilla.org/pt-BR/docs/Web/CSS/text-emphasis-color)
- **MDN Web Docs – CSS text-emphasis:**[MDN CSS text-emphasis](https://developer.mozilla.org/pt-BR/docs/Web/CSS/text-emphasis)
- **W3Schools – CSS text-emphasis:**[W3Schools CSS text-emphasis](https://www.w3schools.com/cssref/css3_pr_text-emphasis.asp)
- **Artigos e Tutoriais:**
    - [A Comprehensive Guide to CSS Text Emphasis](https://css-tricks.com/guide-to-css-text-emphasis/)
    - [Styling Emphasis Marks in CSS](https://www.smashingmagazine.com/2019/03/css-typography/)

---

## 7. Conclusão

A propriedade **text-emphasis-color** permite que os desenvolvedores personalizem a cor das marcas de ênfase aplicadas ao texto, contribuindo para uma tipografia rica e visualmente atraente. Ao ser utilizada em conjunto com **text-emphasis** e **text-emphasis-style**, ela oferece uma maneira elegante de destacar elementos importantes sem alterar a estrutura do conteúdo. Essa flexibilidade é fundamental para criar interfaces modernas e dinâmicas, onde a ênfase tipográfica pode reforçar a identidade visual e melhorar a experiência do usuário. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.