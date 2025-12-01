# text-emphasis-position

## 1. Introdução

A propriedade **text-emphasis-position** faz parte do conjunto de propriedades de ênfase de texto em CSS, que é usada para controlar onde as marcas de ênfase são posicionadas em relação ao conteúdo do texto. Essa propriedade especifica a posição (ou o deslocamento) das marcas de ênfase geradas pela propriedade **text-emphasis**, permitindo que os desenvolvedores ajustem a apresentação visual para melhor integrar a ênfase ao design tipográfico.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **text-emphasis-position** determina onde as marcas de ênfase (como pontos, círculos ou outros símbolos) serão exibidas em relação ao texto. Essas marcas são inseridas normalmente por meio de pseudo-elementos associados ao conteúdo e podem ser posicionadas acima, abaixo ou ao lado do texto.
    
- **Objetivo e Benefícios:**
    - **Personalização Tipográfica:** Permite ajustar a posição das marcas de ênfase para que se harmonizem com a estética geral do design.
    - **Melhoria na Legibilidade:** Um posicionamento apropriado pode evitar que as marcas interfiram na leitura, ajudando a destacar as partes importantes do texto sem atrapalhar a clareza.
    - **Flexibilidade:** Oferece controle refinado sobre a apresentação do texto, permitindo a criação de efeitos visuais únicos e adaptáveis a diferentes contextos.
- **Relação com Outras Propriedades:**
    
    **text-emphasis-position** é usada em conjunto com:
    
    - **text-emphasis:** Que define a marca de ênfase (por exemplo, um ponto ou círculo).
    - **text-emphasis-style:** Que determina o estilo da marca (por exemplo, filled, open, etc.).
    - **text-emphasis-color:** Que especifica a cor da marca.
    
    Juntas, essas propriedades formam um conjunto que controla a aplicação e a aparência das marcas de ênfase no texto.
    

---

## 3. Sintaxe e Valores

A sintaxe básica para **text-emphasis-position** é:

```css
seletor {
  text-emphasis-position: valor;
}

```

### Valores Comuns:

- **Palavras-chave:**
    
    Você pode utilizar palavras-chave para posicionar a marca de ênfase:
    
    - `over`: Coloca a marca de ênfase acima do texto.
    - `under`: Coloca a marca de ênfase abaixo do texto.
    - `left`: Alinha a marca à esquerda do texto (geralmente aplicada ao eixo inline).
    - `right`: Alinha a marca à direita do texto.
    
    Essas palavras-chave podem ser combinadas para definir o posicionamento em ambos os eixos. Por exemplo:
    
    ```css
    text-emphasis-position: over right;
    
    ```
    
    Este exemplo posiciona a marca de ênfase acima do texto e alinhada à direita.
    
- **Valores Combinados:**
    
    É possível combinar dois valores para definir o posicionamento no eixo block (vertical) e no eixo inline (horizontal). Por exemplo:
    
    ```css
    text-emphasis-position: under left;
    
    ```
    
    Isso coloca a marca de ênfase abaixo do texto e alinhada à esquerda.
    
- **Valor Único:**
    
    Se um único valor for usado, ele será aplicado a ambos os eixos, quando possível. Por exemplo:
    
    ```css
    text-emphasis-position: center;
    
    ```
    
    Contudo, o valor `center` não é oficialmente um valor para **text-emphasis-position**; as palavras-chave mais comuns são `over`, `under`, `left` e `right`.
    

---

## 4. Exemplos Práticos

### Exemplo 1: Marcação Acima do Texto

```css
.notice {
  font-size: 1.2rem;
  text-emphasis: filled dot;
  text-emphasis-position: over;  /* Posiciona a marca de ênfase acima do texto */
  text-emphasis-color: #e74c3c;
}

```

```html
<p class="notice">
  Este parágrafo utiliza uma marca de ênfase posicionada acima do texto, destacando informações importantes.
</p>

```

*Explicação:*

Neste exemplo, a marca de ênfase (um ponto preenchido) é exibida acima do parágrafo, atraindo a atenção do leitor para a mensagem sem interferir na legibilidade do texto.

---

### Exemplo 2: Marcação Abaixo e à Direita do Texto

```css
.highlight {
  font-size: 1.1rem;
  text-emphasis: open circle;
  text-emphasis-position: under right;  /* Marca posicionada abaixo e à direita */
  text-emphasis-color: #3498db;
}

```

```html
<p class="highlight">
  Este texto tem uma marca de ênfase que se posiciona abaixo e à direita, criando um efeito visual interessante.
</p>

```

*Explicação:*

Aqui, a marca de ênfase é posicionada de forma que fique abaixo do texto e alinhada à direita, oferecendo um destaque sutil e assimétrico.

---

### Exemplo 3: Marcação Personalizada com Combinação de Valores

```css
.article-title {
  font-size: 2rem;
  text-emphasis: filled triangle;
  text-emphasis-position: over left; /* Coloca a marca acima e à esquerda do título */
  text-emphasis-color: #8e44ad;
  margin-bottom: 0.5em;
}

```

```html
<h2 class="article-title">
  Título do Artigo
</h2>

```

*Explicação:*

O cabeçalho `<h2>` utiliza uma marca de ênfase em forma de triângulo preenchido, posicionada acima e à esquerda do título. Esse posicionamento é ideal para criar um visual marcante e diferenciado, enfatizando o título sem comprometer a harmonia tipográfica.

---

## 5. Informações Adicionais

- **Compatibilidade:**
    
    A propriedade **text-emphasis-position** é suportada em navegadores modernos, mas o nível de suporte pode variar para diferentes valores e combinações. É importante testar em múltiplos navegadores para garantir que o efeito desejado seja consistente.
    
- **Integração com Outras Propriedades de Ênfase:**
    
    Para obter o efeito completo, **text-emphasis-position** deve ser usada junto com **text-emphasis**, **text-emphasis-style** e **text-emphasis-color**. Essa combinação oferece um controle completo sobre a aparência e a posição das marcas de ênfase.
    
- **Aplicações Criativas:**
    
    A propriedade pode ser utilizada para destacar links, citações, títulos ou qualquer trecho de texto que necessite de um realce visual sem modificar o conteúdo HTML, mantendo a semântica intacta.
    
- **Acessibilidade e Legibilidade:**
    
    Ao ajustar o posicionamento das marcas de ênfase, é possível melhorar a legibilidade e tornar os elementos interativos mais evidentes, contribuindo para uma experiência de usuário mais intuitiva.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS text-emphasis:**[MDN CSS text-emphasis](https://developer.mozilla.org/pt-BR/docs/Web/CSS/text-emphasis)
- **MDN Web Docs – CSS text-emphasis-position:**[MDN CSS text-emphasis-position](https://developer.mozilla.org/pt-BR/docs/Web/CSS/text-emphasis-position)
- **W3Schools – CSS Text Emphasis:**[W3Schools CSS Text Emphasis](https://www.w3schools.com/css/css3_text_emphasis.asp)
- **Artigos e Tutoriais:**
    - [A Comprehensive Guide to CSS Text Emphasis](https://css-tricks.com/guide-to-css-text-emphasis/)
    - [Styling Emphasis Marks in CSS](https://www.smashingmagazine.com/2019/03/css-typography/)

---

## 7. Conclusão

A propriedade **text-emphasis-position** é uma ferramenta essencial para ajustar a posição das marcas de ênfase em relação ao texto. Ao combinar essa propriedade com **text-emphasis**, **text-emphasis-style** e **text-emphasis-color**, os desenvolvedores podem criar efeitos tipográficos sofisticados que realçam informações importantes de maneira elegante e acessível. Essa capacidade de personalização melhora tanto a estética quanto a funcionalidade dos elementos textuais, contribuindo para uma experiência de usuário aprimorada. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.