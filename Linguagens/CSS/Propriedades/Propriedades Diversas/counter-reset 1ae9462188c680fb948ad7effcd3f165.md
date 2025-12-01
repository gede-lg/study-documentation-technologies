# counter-reset

## 1. Introdução

A propriedade **counter-reset** é parte do conjunto de funcionalidades de contadores do CSS, que permite criar e manipular contadores numéricos para gerar conteúdo dinâmico. Essa propriedade reinicializa ou define o valor de um ou mais contadores, que podem ser utilizados em conjunto com a propriedade **content** (normalmente em pseudo-elementos `::before` e `::after`) para exibir números, listas ou outras informações de forma automática. É especialmente útil para criar listas numeradas personalizadas, índices ou qualquer situação onde o controle dinâmico de contagem seja necessário.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **counter-reset** inicializa um ou mais contadores e define seu valor inicial. Esse valor pode ser posteriormente incrementado ou decrementado usando a propriedade **counter-increment**.
    
- **Objetivo:**
    
    Permitir que os desenvolvedores controlem contadores CSS para gerar conteúdo dinâmico, como números de lista personalizados, marcadores ou outras informações baseadas em contagem.
    
- **Uso em Pseudo-elementos:**
    
    Comumente utilizado em conjunto com os pseudo-elementos `::before` ou `::after` para inserir o valor do contador no conteúdo gerado.
    

---

## 3. Sintaxe e Estrutura

A sintaxe básica para **counter-reset** é:

```css
seletor {
    counter-reset: nome [valor] [, nome2 [valor2], ...];
}

```

- **nome:** O identificador do contador que você deseja redefinir.
- **valor (opcional):** O valor inicial para o contador; se não for especificado, o valor padrão é `0`.

**Exemplo:**

```css
.article {
    counter-reset: section; /* Inicializa o contador "section" com 0 */
}

```

Ou, para inicializar múltiplos contadores:

```css
.article {
    counter-reset: section 1 figure; /* "section" inicia em 1 e "figure" inicia em 0 */
}

```

---

## 4. Funcionamento e Interação com Outros Contadores

- **counter-reset + counter-increment:**
    
    Para que os contadores sejam úteis, você também utilizará **counter-increment** para modificar o valor dos contadores conforme o conteúdo é renderizado.
    
    Por exemplo:
    
    ```css
    .section {
        counter-increment: section;
    }
    
    ```
    
- **Exibição com content:**
    
    Com os pseudo-elementos, você pode inserir o valor do contador no conteúdo:
    
    ```css
    .section::before {
        content: "Section " counter(section) ": ";
    }
    
    ```
    
- **Uso Combinado:**
    
    A combinação de **counter-reset**, **counter-increment** e a função `counter()` no **content** possibilita a criação de sistemas de numeração automática sem a necessidade de modificar o HTML.
    

---

## 5. Exemplos de Código Otimizados

### Exemplo 1: Lista Numerada Personalizada com Seções

```css
/* Reinicia o contador 'section' no início do contêiner */
.article {
    counter-reset: section;
    padding: 20px;
}

/* Incrementa o contador 'section' para cada elemento com a classe 'section' */
.section {
    counter-increment: section;
    margin-bottom: 20px;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

/* Insere o valor do contador antes do conteúdo de cada seção */
.section::before {
    content: "Section " counter(section) ": ";
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
}

```

```html
<div class="article">
  <div class="section">
    <p>Conteúdo da primeira seção.</p>
  </div>
  <div class="section">
    <p>Conteúdo da segunda seção.</p>
  </div>
  <div class="section">
    <p>Conteúdo da terceira seção.</p>
  </div>
</div>

```

*Explicação:*

- O contêiner `.article` reinicializa o contador `section`.
- Cada `.section` incrementa esse contador.
- Os pseudo-elementos `::before` exibem o número da seção automaticamente.

### Exemplo 2: Contador para Listas Aninhadas

```css
/* Reinicializa o contador 'item' para a lista principal */
.list {
    counter-reset: item;
    list-style: none;
    padding-left: 0;
}

/* Incrementa o contador para cada item da lista */
.list li {
    counter-increment: item;
    margin-bottom: 10px;
    position: relative;
}

/* Exibe o valor do contador antes de cada item */
.list li::before {
    content: counter(item) ". ";
    position: absolute;
    left: -2em;
    font-weight: bold;
}

```

```html
<ul class="list">
  <li>Primeiro item</li>
  <li>Segundo item</li>
  <li>Terceiro item</li>
</ul>

```

*Explicação:*

- A lista `.list` reinicia o contador `item`.
- Cada `<li>` incrementa o contador, e o pseudo-elemento `::before` exibe o número do item.

---

## 6. Informações Adicionais

- **Contadores Múltiplos:**
    
    Você pode reinicializar vários contadores simultaneamente, separando-os por vírgulas. Por exemplo:
    
    ```css
    .container {
        counter-reset: section 1 figure;
    }
    
    ```
    
- **Valores Iniciais Personalizados:**
    
    Ao especificar um valor para o contador, você pode começar a numeração a partir de um número diferente de zero.
    
- **Aplicações Práticas:**
    
    Essa técnica é útil para:
    
    - Criar listas numeradas customizadas.
    - Organizar seções de um documento sem a necessidade de inserir manualmente números no HTML.
    - Gerar índices ou tabelas de conteúdo dinâmicos.
- **Compatibilidade:**
    
    As propriedades de contador (como **counter-reset** e **counter-increment**) são amplamente suportadas nos navegadores modernos e são essenciais para a criação de conteúdo dinâmico através do CSS.
    

---

## 7. Referências para Estudo Independente

- **MDN Web Docs – CSS counter-reset:**[MDN CSS counter-reset](https://developer.mozilla.org/pt-BR/docs/Web/CSS/counter-reset)
- **MDN Web Docs – CSS counter-increment:**[MDN CSS counter-increment](https://developer.mozilla.org/pt-BR/docs/Web/CSS/counter-increment)
- **W3Schools – CSS Counters:**[W3Schools CSS Counters](https://www.w3schools.com/css/css3_counters.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to CSS Counters](https://css-tricks.com/a-complete-guide-to-css-counters/)
    - [Using CSS Counters to Number Elements](https://www.smashingmagazine.com/2010/03/css3-counters/)

---

## 8. Conclusão

A propriedade **counter-reset** é uma ferramenta essencial para a criação de contadores dinâmicos em CSS, permitindo que você reinicialize e defina o valor inicial de contadores que podem ser incrementados e exibidos em conjunto com os pseudo-elementos `::before` e `::after`. Essa funcionalidade é amplamente utilizada para gerar listas numeradas, seções organizadas e outros conteúdos dinâmicos, sem a necessidade de alterar o HTML. Dominar **counter-reset** e as propriedades associadas, como **counter-increment** e a função `counter()`, permite que você crie layouts semânticos, organizados e visualmente impactantes. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.