# page-break-before

## 1. Introdução

A propriedade **page-break-before** é utilizada para controlar a inserção de quebras de página antes de um elemento quando o conteúdo é impresso ou visualizado em formatos que requerem paginação (como e-books). Essa propriedade é especialmente útil para preparar documentos para impressão, garantindo que o conteúdo seja dividido em páginas de forma apropriada.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **page-break-before** determina se uma quebra de página deve ocorrer antes de um elemento. Essa propriedade é aplicada somente em contextos de mídia impressa ou visualização em modo de impressão.
    
- **Importância:**
    - **Organização de Documentos:** Garante que títulos, seções ou outros elementos importantes iniciem em uma nova página, melhorando a legibilidade e a estrutura do documento impresso.
    - **Controle de Paginação:** Permite ao designer definir pontos estratégicos para a quebra de página, evitando que elementos relacionados sejam divididos de forma indesejada.
    - **Compatibilidade:** É amplamente suportada em navegadores e softwares de impressão que interpretam CSS, embora seu comportamento possa variar ligeiramente entre eles.

---

## 3. Sintaxe e Valores

A sintaxe básica é:

```css
seletor {
  page-break-before: valor;
}

```

### Valores Comuns:

- **auto (valor padrão):**
    
    Permite que o navegador determine automaticamente onde inserir as quebras de página.
    
- **always:**
    
    Garante que uma quebra de página seja inserida antes do elemento, forçando o início de uma nova página.
    
- **avoid:**
    
    Tenta evitar a quebra de página antes do elemento, mantendo-o junto com o conteúdo anterior, se possível.
    
- **left:**
    
    Insere uma quebra de página e força o elemento a aparecer em uma página ímpar (lado esquerdo) ao imprimir.
    
- **right:**
    
    Insere uma quebra de página e força o elemento a aparecer em uma página par (lado direito) ao imprimir.
    

**Exemplo:**

```css
h2 {
  page-break-before: always;
}

```

*Este exemplo garante que cada elemento `<h2>` comece em uma nova página quando o documento for impresso.*

---

## 4. Exemplos de Código Otimizados

### Exemplo 1: Iniciar uma Nova Página para Títulos

```css
.article h2 {
  page-break-before: always;
  /* Em um contexto de impressão, cada <h2> iniciará em uma nova página */
}

```

```html
<div class="article">
  <h2>Seção 1</h2>
  <p>Conteúdo da Seção 1...</p>
  <h2>Seção 2</h2>
  <p>Conteúdo da Seção 2...</p>
</div>

```

*Explicação:*

Cada título `<h2>` forçará uma quebra de página antes de ser renderizado na impressão, garantindo que cada seção inicie em uma página nova.

### Exemplo 2: Evitar Quebra de Página Antes de Elementos Específicos

```css
.no-break {
  page-break-before: avoid;
}

```

```html
<div class="article">
  <h2 class="no-break">Subtítulo sem quebra</h2>
  <p>Conteúdo que permanece junto do subtítulo, sem iniciar uma nova página.</p>
</div>

```

*Explicação:*

O uso de `page-break-before: avoid;` tenta manter o elemento e seu conteúdo juntos na mesma página, evitando uma quebra de página indesejada.

---

## 5. Informações Adicionais

- **Contexto de Impressão:**
    
    A propriedade **page-break-before** é relevante principalmente para mídias de impressão. Ela é ignorada em visualizações na tela, a menos que você utilize regras específicas com `@media print`.
    
- **Mídia Query:**
    
    Para aplicar a propriedade apenas em impressões, utilize uma mídia query:
    
    ```css
    @media print {
      h2 {
        page-break-before: always;
      }
    }
    
    ```
    
- **Compatibilidade e Considerações:**
    
    Embora a maioria dos navegadores modernos suporte **page-break-before**, seu comportamento pode variar entre diferentes ambientes e dispositivos de impressão. Testes são recomendados para garantir que o layout impresso atenda às expectativas.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS page-break-before:**[MDN CSS page-break-before](https://developer.mozilla.org/pt-BR/docs/Web/CSS/page-break-before)
- **W3Schools – CSS page-break:**[W3Schools CSS page-break](https://www.w3schools.com/cssref/pr_print_page-break-before.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to Print Styles in CSS](https://css-tricks.com/complete-guide-to-print-styles/)
    - [CSS for Print: Designing Print Stylesheets](https://www.smashingmagazine.com/2010/03/css-print-stylesheets-tutorial/)

---

## 7. Conclusão

A propriedade **page-break-before** é uma ferramenta valiosa para controlar a paginação de documentos impressos. Ao forçar ou evitar quebras de página antes de elementos específicos, ela permite que o conteúdo seja organizado de maneira lógica e visualmente agradável na impressão. Utilizando essa propriedade dentro de regras de mídia específicas para impressão, os desenvolvedores podem criar layouts que mantêm a integridade e a legibilidade do conteúdo em qualquer formato. Explore os exemplos e referências fornecidos para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS para impressão.