# color-adjust (atualmente conhecido como print-color-adjust)

## 1. Introdução

A propriedade **color-adjust** – que em contextos de impressão é mais comumente referida como **print-color-adjust** – foi criada para oferecer controle sobre como as cores dos elementos são processadas, principalmente durante a impressão. Essa propriedade permite que os desenvolvedores especifiquem se os navegadores devem preservar as cores originais ou ajustar as cores para economizar tinta ou obter melhores resultados em impressoras. Embora o suporte e a nomenclatura possam variar entre navegadores, o conceito central é o mesmo: otimizar a saída de cores para diferentes mídias.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **color-adjust** (ou **print-color-adjust**) controla se e como o navegador ajusta as cores de um elemento ao imprimir ou exibir conteúdos de maneira otimizada. Esse ajuste pode incluir a modificação das cores para economizar tinta (modo "economy") ou a preservação fiel das cores definidas (modo "exact").
    
- **Objetivos e Benefícios:**
    - **Consistência de Cores em Impressão:** Permite que os desenvolvedores garantam que as cores da página sejam reproduzidas fielmente ou ajustadas conforme necessário ao imprimir.
    - **Economia de Tinta:** Em situações onde a economia de tinta é desejada, é possível solicitar que o navegador modifique as cores para utilizar menos recursos, geralmente com um efeito de desaturação ou alteração de contraste.
    - **Controle sobre o Output Visual:** Oferece mais controle na preparação do conteúdo para diferentes mídias, especialmente impressões, ajudando a manter uma aparência consistente com o design pretendido.
- **Contexto de Uso:**
    
    Essa propriedade é particularmente relevante em cenários de impressão, onde as condições de cor do papel e da impressora podem exigir ajustes para que a reprodução seja adequada. Também pode ser utilizada em outros contextos onde o controle de cor é importante para a experiência do usuário.
    
- **Histórico e Nomenclatura:**
    
    Originalmente denominada **color-adjust**, essa propriedade é frequentemente implementada como **print-color-adjust** em alguns navegadores para diferenciar seu uso no contexto de impressão.
    

---

## 3. Sintaxe e Valores

A sintaxe básica é:

```css
seletor {
  print-color-adjust: <valor>;
}

```

*Observação:* Em alguns contextos e navegadores, pode ser usada como **color-adjust**.

### Valores Comuns

- **economy:**
    
    Indica que o navegador deve ajustar as cores para economizar tinta na impressão, geralmente desaturando as cores ou alterando o contraste.
    
    ```css
    .document {
      print-color-adjust: economy;
    }
    
    ```
    
- **exact:**
    
    Informa ao navegador para reproduzir as cores exatamente como definidas, sem ajustes para economia de tinta.
    
    ```css
    .document {
      print-color-adjust: exact;
    }
    
    ```
    

*Observação:* Nem todos os navegadores suportam esses valores de forma consistente, e o comportamento pode variar conforme o ambiente e a configuração do dispositivo de impressão.

---

## 4. Exemplos Práticos

### Exemplo 1: Preservando as Cores Exatas na Impressão

```css
.print-content {
  /* Garante que as cores sejam reproduzidas fielmente */
  print-color-adjust: exact;
  /* Pode ser aplicado a elementos específicos ou ao corpo inteiro */
  background-color: #f1c40f;
  color: #2c3e50;
  padding: 20px;
}

```

```html
<div class="print-content">
  <h1>Relatório Anual</h1>
  <p>Este conteúdo será impresso com as cores exatas definidas no CSS, sem ajustes para economia de tinta.</p>
</div>

```

*Explicação:*

Ao definir `print-color-adjust: exact;`, o navegador é instruído a reproduzir as cores exatamente como especificadas, garantindo que o relatório impresso mantenha a fidelidade visual do design original.

---

### Exemplo 2: Ajustando para Economia de Tinta na Impressão

```css
.article {
  /* Solicita ao navegador que ajuste as cores para economizar tinta na impressão */
  print-color-adjust: economy;
  background-color: #ecf0f1;
  color: #333;
  padding: 15px;
}

```

```html
<article class="article">
  <h2>Título do Artigo</h2>
  <p>Este artigo utiliza ajustes de cor para economizar tinta durante a impressão, resultando em uma saída mais econômica.</p>
</article>

```

*Explicação:*

Com `print-color-adjust: economy;`, o navegador pode ajustar as cores (por exemplo, desaturando ou modificando o contraste) para reduzir o uso de tinta, ideal para documentos onde a economia é uma prioridade.

---

## 5. Informações Adicionais

- **Compatibilidade e Suporte:**
    
    A propriedade **print-color-adjust** (ou **color-adjust**) é suportada nos navegadores modernos, mas seu comportamento pode ser inconsistente entre diferentes plataformas e versões de navegadores. É recomendável testar o resultado em condições de impressão reais.
    
- **Aplicação Específica para Impressão:**
    
    Essa propriedade é particularmente útil em folhas de estilo para impressão, onde se deseja controlar a saída de cores para garantir que o material impresso atenda aos padrões de qualidade e economia desejados.
    
- **Integração com Media Queries:**
    
    Para aplicar essas configurações somente em contextos de impressão, é comum utilizar media queries com `@media print`, garantindo que o comportamento seja aplicado apenas quando necessário.
    
    ```css
    @media print {
      body {
        print-color-adjust: exact;
      }
    }
    
    ```
    
- **Impacto no Design:**
    
    Ao ajustar as cores para impressão, é importante considerar como as alterações podem afetar a legibilidade e a estética geral do documento. Testes em impressoras reais são essenciais para validar os resultados.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS print-color-adjust:**[MDN CSS print-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust)
- **MDN Web Docs – Using CSS Custom Properties (for print styling):**[MDN CSS for print](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Printing)
- **W3Schools – CSS print-color-adjust:**[W3Schools CSS print-color-adjust](https://www.w3schools.com/cssref/css3_pr_print-color-adjust.asp)
- **Artigos e Tutoriais:**
    - [Optimizing Your Print Styles with CSS](https://css-tricks.com/complete-guide-to-print-styles/)
    - [CSS for Print: Best Practices and Techniques](https://www.smashingmagazine.com/2010/03/css-print-stylesheets-tutorial/)

---

## 7. Conclusão

A propriedade **color-adjust** (mais comumente referida como **print-color-adjust** em contextos de impressão) é uma ferramenta importante para controlar a forma como as cores são renderizadas em documentos impressos. Ao definir valores como `exact` ou `economy`, os desenvolvedores podem optar por preservar a fidelidade das cores originais ou ajustar as cores para economizar tinta. Essa capacidade de personalizar a saída de cores é essencial para garantir que os materiais impressos mantenham uma aparência profissional e consistente com o design digital, além de atender a necessidades práticas de economia de recursos. Explorar os exemplos e referências fornecidos permitirá que você aplique essas técnicas de forma eficaz em seus projetos, garantindo que a transição do digital para o impresso seja suave e de alta qualidade.