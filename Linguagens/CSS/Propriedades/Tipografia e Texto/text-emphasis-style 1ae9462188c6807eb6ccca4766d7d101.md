# text-emphasis-style

## 1. Introdução

A propriedade **text-emphasis-style** é parte do conjunto de propriedades de ênfase de texto introduzidas para fornecer uma forma nativa e elegante de destacar trechos de texto através de marcas visuais. Essa propriedade define o estilo do símbolo de ênfase aplicado ao texto — seja ele um ponto, um círculo, um triângulo ou outros formatos predefinidos — sem a necessidade de alterar o conteúdo HTML. É especialmente útil para idiomas que tradicionalmente utilizam marcas de ênfase (como o japonês), mas também pode ser empregada de maneira criativa em layouts ocidentais para realçar links, títulos ou palavras importantes.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **text-emphasis-style** especifica o formato do símbolo de ênfase que será renderizado quando a propriedade **text-emphasis** for aplicada. Esse símbolo pode ser definido como um ponto, um círculo, um triângulo ou outros formatos predefinidos, dependendo do efeito visual desejado.
    
- **Objetivos e Benefícios:**
    - **Realce Visual:** Permite que o texto seja destacado de forma sutil, adicionando uma camada extra de semântica visual sem modificar o HTML.
    - **Flexibilidade e Personalização:** Ao escolher entre diferentes estilos (por exemplo, `filled dot`, `open circle`, `filled triangle`, etc.), você pode criar uma identidade tipográfica única que se alinha ao design geral da interface.
    - **Consistência:** Garante que as marcas de ênfase sejam aplicadas de maneira uniforme em todo o documento, melhorando a coesão do design.
- **Contexto de Uso:**
    
    Essa propriedade é normalmente usada em conjunto com:
    
    - **text-emphasis:** A propriedade abreviada que combina o estilo e a posição da ênfase.
    - **text-emphasis-color:** Para definir a cor da marca.
    - **text-emphasis-position:** Para determinar a posição da marca em relação ao texto.
    
    Juntas, essas propriedades fornecem um controle abrangente sobre como a ênfase é apresentada, sem a necessidade de manipular o conteúdo.
    

---

## 3. Sintaxe e Valores

A sintaxe básica para **text-emphasis-style** é:

```css
seletor {
  text-emphasis-style: valor;
}

```

### Valores Comuns:

- **none:**
    
    Remove qualquer marca de ênfase.
    
    ```css
    p {
      text-emphasis-style: none;
    }
    
    ```
    
- **filled dot:**
    
    Exibe um ponto preenchido. Esse é um dos estilos mais comuns e é amplamente utilizado para destacar palavras ou frases.
    
    ```css
    p {
      text-emphasis-style: filled dot;
    }
    
    ```
    
- **open dot:**
    
    Exibe um ponto aberto (sem preenchimento), proporcionando um efeito mais sutil.
    
    ```css
    p {
      text-emphasis-style: open dot;
    }
    
    ```
    
- **filled circle:**
    
    Similar a `filled dot`, mas com uma forma circular maior.
    
    ```css
    p {
      text-emphasis-style: filled circle;
    }
    
    ```
    
- **open circle:**
    
    Exibe um círculo aberto.
    
    ```css
    p {
      text-emphasis-style: open circle;
    }
    
    ```
    
- **filled triangle:**
    
    Utiliza um triângulo preenchido como marca de ênfase.
    
    ```css
    p {
      text-emphasis-style: filled triangle;
    }
    
    ```
    
- **open triangle:**
    
    Exibe um triângulo sem preenchimento.
    
    ```css
    p {
      text-emphasis-style: open triangle;
    }
    
    ```
    

*Observação:*

Os valores exatos e a disponibilidade dos estilos podem depender do navegador e do idioma, pois a especificação do CSS para ênfase de texto foi inicialmente focada em sistemas de escrita como o japonês.

---

## 4. Exemplos Práticos

### Exemplo 1: Ênfase Simples com Ponto Preenchido

```css
.emphasis-example {
  text-emphasis: filled dot over;
  text-emphasis-color: #e74c3c;
}

```

```html
<p class="emphasis-example">
  Este texto é destacado com uma marca de ênfase em forma de ponto preenchido posicionado acima.
</p>

```

*Explicação:*

O parágrafo terá um ponto preenchido como marca de ênfase, aplicado na posição `over` (acima do texto), com a cor vermelha definida por **text-emphasis-color**.

---

### Exemplo 2: Ênfase com Círculo Aberto

```css
.emphasis-circle {
  text-emphasis: open circle under;
  text-emphasis-color: #3498db;
}

```

```html
<p class="emphasis-circle">
  Esta linha de texto tem uma marca de ênfase em forma de círculo aberto, posicionada abaixo, oferecendo um efeito sutil e elegante.
</p>

```

*Explicação:*

O texto possui um círculo aberto como marca de ênfase posicionado `under` (abaixo do texto), com a cor azul definida para destacar o efeito sem sobrecarregar a tipografia.

---

### Exemplo 3: Ênfase com Triângulo Preenchido para Destaque

```css
.title-emphasis {
  text-emphasis: filled triangle over;
  text-emphasis-color: #8e44ad;
  font-size: 2rem;
  margin-bottom: 0.5em;
}

```

```html
<h2 class="title-emphasis">
  Título de Seção
</h2>

```

*Explicação:*

O cabeçalho `<h2>` utiliza um triângulo preenchido como marca de ênfase, posicionado acima do texto, com a cor púrpura, criando um destaque visual que diferencia o título do restante do conteúdo.

---

## 5. Considerações Adicionais

- **Integração com Outras Propriedades:**
    
    Para obter o efeito completo, **text-emphasis-style** deve ser usado em conjunto com **text-emphasis**, **text-emphasis-color** e **text-emphasis-position**. Essa combinação permite um controle total sobre a presença e o estilo das marcas de ênfase.
    
- **Contexto Cultural:**
    
    Em idiomas como o japonês, as marcas de ênfase têm um papel tradicional e são amplamente utilizadas. Em outros contextos, a propriedade pode ser usada de forma criativa para adicionar um toque estético a elementos específicos do texto.
    
- **Acessibilidade e Legibilidade:**
    
    Marcas de ênfase podem melhorar a legibilidade e chamar a atenção para partes importantes do conteúdo, mas devem ser usadas com moderação para não sobrecarregar o leitor.
    
- **Compatibilidade:**
    
    A maioria dos navegadores modernos suporta **text-emphasis-style**, mas sempre verifique as especificações e a compatibilidade para garantir que o efeito seja consistente em todas as plataformas.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS text-emphasis:**[MDN CSS text-emphasis](https://developer.mozilla.org/pt-BR/docs/Web/CSS/text-emphasis)
- **MDN Web Docs – CSS text-emphasis-style:**[MDN CSS text-emphasis-style](https://developer.mozilla.org/pt-BR/docs/Web/CSS/text-emphasis-style)
- **W3Schools – CSS Text Emphasis:**[W3Schools CSS Text Emphasis](https://www.w3schools.com/cssref/css3_pr_text-emphasis.asp)
- **Artigos e Tutoriais:**
    - [A Comprehensive Guide to CSS Text Emphasis](https://css-tricks.com/guide-to-css-text-emphasis/)
    - [Advanced Underline Techniques in CSS](https://www.smashingmagazine.com/2019/04/modern-css-underline/)

---

## 7. Conclusão

A propriedade **text-emphasis-style** oferece um controle refinado sobre o estilo das marcas de ênfase aplicadas ao texto, permitindo que os desenvolvedores criem efeitos tipográficos únicos e consistentes. Ao combinar essa propriedade com **text-emphasis**, **text-emphasis-color** e **text-emphasis-position**, você pode realçar informações importantes e melhorar a experiência visual do usuário de maneira elegante e acessível. Dominar **text-emphasis-style** é essencial para quem deseja explorar as possibilidades da ênfase de texto em CSS e criar designs modernos e impactantes. Explore os exemplos e referências fornecidos para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos.