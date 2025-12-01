# page-break-after

## 1. Introdução

A propriedade **page-break-after** é parte do conjunto de propriedades de paginação do CSS, utilizadas para controlar onde ocorrem as quebras de página em documentos impressos. Essa propriedade especifica se uma quebra de página deve ser inserida imediatamente após o elemento ao qual ela é aplicada. É particularmente útil para formatar documentos para impressão, garantindo que seções ou elementos importantes terminem em uma página, mantendo uma organização e legibilidade adequadas.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **page-break-after** determina se uma quebra de página deve ocorrer após um elemento quando o conteúdo é impresso.
    
    - Ao forçar uma quebra de página, você pode garantir que o próximo conteúdo comece em uma nova página.
- **Aplicabilidade:**
    
    Essa propriedade é aplicada apenas em contextos de impressão ou quando a mídia de saída suporta paginação. Em telas, a propriedade é ignorada, a menos que estilos específicos para impressão sejam definidos usando `@media print`.
    
- **Importância:**
    - **Organização de Documentos:** Garante que títulos, seções ou outros elementos críticos sejam isolados em suas próprias páginas, melhorando a clareza e a estrutura visual do documento impresso.
    - **Controle de Layout:** Permite que o designer controle precisamente onde as páginas devem ser quebradas, evitando que elementos importantes sejam divididos entre páginas.

---

## 3. Sintaxe e Valores

A sintaxe básica para **page-break-after** é:

```css
seletor {
    page-break-after: valor;
}

```

### Valores Comuns:

- **auto (valor padrão):**
    
    Deixa a decisão de inserir ou não uma quebra de página a cargo do navegador.
    
    ```css
    .elemento {
        page-break-after: auto;
    }
    
    ```
    
- **always:**
    
    Força uma quebra de página após o elemento, fazendo com que o próximo conteúdo inicie em uma nova página.
    
    ```css
    .elemento {
        page-break-after: always;
    }
    
    ```
    
- **avoid:**
    
    Tenta evitar uma quebra de página após o elemento, mantendo o conteúdo junto, se possível.
    
    ```css
    .elemento {
        page-break-after: avoid;
    }
    
    ```
    
- **left:**
    
    Força uma quebra de página e garante que a próxima página seja uma página de lado esquerdo (normalmente ímpar, dependendo da configuração da mídia de impressão).
    
    ```css
    .elemento {
        page-break-after: left;
    }
    
    ```
    
- **right:**
    
    Força uma quebra de página e garante que a próxima página seja uma página de lado direito (normalmente par).
    
    ```css
    .elemento {
        page-break-after: right;
    }
    
    ```
    

---

## 4. Exemplos de Código Otimizados

### Exemplo 1: Forçando uma Quebra de Página Após um Elemento

```css
.section {
    margin-bottom: 20px;
    page-break-after: always;
}

```

```html
<div class="section">
  <h2>Seção 1</h2>
  <p>Conteúdo da seção 1...</p>
</div>
<div class="section">
  <h2>Seção 2</h2>
  <p>Conteúdo da seção 2...</p>
</div>

```

*Explicação:*

Cada seção que utiliza `page-break-after: always;` fará com que, ao imprimir, o conteúdo seguinte comece em uma nova página.

### Exemplo 2: Evitando Quebras de Página Após um Elemento

```css
.note {
    margin-bottom: 15px;
    page-break-after: avoid;
}

```

```html
<div class="note">
  <p>Este parágrafo tenta evitar uma quebra de página após si, mantendo o conteúdo contínuo na mesma página, se possível.</p>
</div>

```

*Explicação:*

O uso de `page-break-after: avoid;` tenta manter o parágrafo e o conteúdo subsequente juntos na mesma página, evitando uma quebra imediata.

### Exemplo 3: Aplicando Quebra de Página com `@media print`

```css
@media print {
  .chapter {
      page-break-after: always;
  }
}

```

```html
<div class="chapter">
  <h1>Capítulo 1</h1>
  <p>Conteúdo do Capítulo 1...</p>
</div>
<div class="chapter">
  <h1>Capítulo 2</h1>
  <p>Conteúdo do Capítulo 2...</p>
</div>

```

*Explicação:*

Utilizando uma media query para impressão, garantimos que cada capítulo seja impresso em uma página separada, forçando uma quebra de página após cada elemento com a classe `chapter`.

---

## 5. Informações Adicionais

- **Contexto de Impressão:**
    
    **page-break-after** é aplicada principalmente em ambientes de impressão. Para que a propriedade tenha efeito, é comum utilizar regras dentro de uma media query `@media print`.
    
- **Compatibilidade:**
    
    A maioria dos navegadores modernos suporta **page-break-after** em estilos de impressão, mas o comportamento pode variar. Teste em diferentes navegadores e dispositivos para assegurar a consistência.
    
- **Considerações de Layout:**
    
    Usar `always` pode resultar em muitas páginas vazias se não for aplicado com cuidado. É importante balancear o uso de quebras forçadas com a continuidade do conteúdo para evitar layouts fragmentados.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS page-break-after:**[MDN CSS page-break-after](https://developer.mozilla.org/pt-BR/docs/Web/CSS/page-break-after)
- **W3Schools – CSS page-break:**[W3Schools CSS page-break](https://www.w3schools.com/cssref/pr_print_page-break-after.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to Print Styles in CSS](https://css-tricks.com/complete-guide-to-print-styles/)
    - [CSS for Print: Designing Print Stylesheets](https://www.smashingmagazine.com/2010/03/css-print-stylesheets-tutorial/)

---

## 7. Conclusão

A propriedade **page-break-after** é uma ferramenta essencial para controlar a paginação de documentos impressos. Ela permite que você insira quebras de página de forma estratégica, garantindo que elementos importantes iniciem em uma nova página e que a estrutura do documento seja preservada para uma boa legibilidade e organização. Ao utilizar **page-break-after** em conjunto com media queries para impressão, os desenvolvedores podem criar layouts otimizados para diversos formatos de saída, mantendo a integridade visual e a funcionalidade do conteúdo. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS para impressão.