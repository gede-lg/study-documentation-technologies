# white-space

## 1. Introdução

A propriedade **white-space** controla como o espaço em branco dentro de um elemento é tratado pelo navegador. Isso inclui espaços, quebras de linha e tabulações, influenciando o modo como o texto é exibido e quebrado na página. Essa propriedade é especialmente útil para preservar a formatação de textos pré-formatados, ajustar a exibição de conteúdo dinâmico e criar layouts onde o controle do espaço em branco é fundamental para a legibilidade.

### Conceitos Fundamentais

- **Tema Principal (Propriedade white-space):**
    
    Define o tratamento dos espaços em branco, quebras de linha e o comportamento de quebra de linha do conteúdo textual.
    
- **Valores Comuns:**
    - **normal:** Espaços e quebras de linha são tratados como um único espaço; o texto quebra automaticamente quando necessário.
    - **nowrap:** O texto não quebra automaticamente, permanecendo em uma única linha, a menos que haja uma tag `<br>`.
    - **pre:** Preserva todos os espaços e quebras de linha, exibindo o texto exatamente como está no código fonte (comportamento similar à tag `<pre>`).
    - **pre-wrap:** Preserva espaços e quebras de linha, mas permite que o texto quebre automaticamente para evitar overflow.
    - **pre-line:** Preserva as quebras de linha, mas colapsa espaços extras, combinando características de **normal** e **pre**.
    - **break-spaces (CSS Text Module Level 4):** Preserva espaços e quebras de linha como no **pre**, mas também permite que espaços no final de linhas sejam mantidos e respeita caracteres de espaço "visíveis".

## 2. Sumário

1. **Introdução**
    - Visão geral e relevância
    - Conceitos fundamentais
2. **Sintaxe e Estrutura**
    - Declaração básica da propriedade **white-space**
    - Valores disponíveis e seus comportamentos
3. **Componentes Principais**
    - **normal:** Comportamento padrão de colapso de espaços
    - **nowrap:** Previne quebras de linha automáticas
    - **pre:** Preserva formatação de espaços e quebras de linha
    - **pre-wrap:** Preserva formatação, mas permite quebra automática
    - **pre-line:** Preserva quebras, mas colapsa espaços extras
    - **break-spaces:** (quando suportado) Mantém espaços finais e caracteres de espaço visíveis
4. **Exemplos de Código Otimizados**
    - Demonstração prática de cada valor
5. **Informações Adicionais**
    - Melhores práticas e considerações para legibilidade e design responsivo
6. **Referências para Estudo Independente**
    - Recursos e links para aprofundamento

## 3. Conteúdo Detalhado

### 3.1. Sintaxe e Estrutura

A sintaxe básica para a propriedade **white-space** é:

```css
.seletor {
    white-space: valor;
}

```

**Exemplo:**

```css
.paragrafo {
    white-space: normal;
}

```

### 3.2. Valores e Comportamentos

- **normal:**
    
    Valor padrão. Colapsa múltiplos espaços em um único espaço e permite quebras de linha automáticas.
    
    ```css
    .normal {
        white-space: normal;
    }
    
    ```
    
- **nowrap:**
    
    Impede quebras de linha automáticas, mantendo o conteúdo em uma única linha (a não ser que haja quebras explícitas com `<br>`).
    
    ```css
    .nowrap {
        white-space: nowrap;
    }
    
    ```
    
- **pre:**
    
    Preserva todos os espaços em branco e quebras de linha, exibindo o conteúdo exatamente como está escrito no HTML.
    
    ```css
    .pre {
        white-space: pre;
    }
    
    ```
    
- **pre-wrap:**
    
    Preserva os espaços e quebras de linha, mas permite que o texto quebre automaticamente para se ajustar ao contêiner.
    
    ```css
    .pre-wrap {
        white-space: pre-wrap;
    }
    
    ```
    
- **pre-line:**
    
    Preserva quebras de linha, mas colapsa múltiplos espaços em um único espaço.
    
    ```css
    .pre-line {
        white-space: pre-line;
    }
    
    ```
    
- **break-spaces:**
    
    (Suportado em navegadores modernos) Preserva espaços, incluindo espaços finais e tabulações, e quebra linhas conforme necessário.
    
    ```css
    .break-spaces {
        white-space: break-spaces;
    }
    
    ```
    

### 3.3. Componentes Principais

- **Controle de Espaços:**
    
    Com **normal** e **pre-line**, espaços consecutivos são colapsados, enquanto com **pre** e **pre-wrap** os espaços são mantidos exatamente como estão no código.
    
- **Quebras de Linha Automáticas:**
    
    Valores como **normal**, **pre-wrap** e **break-spaces** permitem que o texto quebre automaticamente se ultrapassar a largura do contêiner, enquanto **nowrap** impede essa quebra.
    
- **Preservação de Formatação:**
    
    **pre** é ideal para exibir código ou texto pré-formatado, já que respeita quebras de linha e espaços extras, mas pode causar overflow em contêineres menores.
    

## 4. Exemplos de Código Otimizados

### Exemplo 1: Uso de **normal**

```css
.paragrafo-normal {
    white-space: normal;
}

```

```html
<p class="paragrafo-normal">
    Este é um exemplo de parágrafo com white-space normal. Múltiplos espaços   serão colapsados e o texto quebrará automaticamente conforme necessário.
</p>

```

### Exemplo 2: Uso de **nowrap**

```css
.paragrafo-nowrap {
    white-space: nowrap;
    background: #f0f0f0;
    padding: 10px;
    overflow: hidden;
}

```

```html
<p class="paragrafo-nowrap">
    Este texto não quebrará automaticamente, permanecendo em uma única linha.
</p>

```

### Exemplo 3: Uso de **pre-wrap**

```css
.paragrafo-pre-wrap {
    white-space: pre-wrap;
    background: #e0ffe0;
    padding: 10px;
}

```

```html
<p class="paragrafo-pre-wrap">
    Este exemplo preserva todos os espaços e quebras de linha,
    mas ainda permite que o texto se ajuste ao contêiner.
</p>

```

### Exemplo 4: Uso de **pre**

```css
.paragrafo-pre {
    white-space: pre;
    background: #e0f7fa;
    padding: 10px;
}

```

```html
<pre class="paragrafo-pre">
Este é um exemplo de
texto pré-formatado.
    Os espaços e quebras de linha
são preservados.
</pre>

```

## 5. Informações Adicionais

- **Responsividade e Legibilidade:**
    
    Escolha o valor de **white-space** de acordo com o conteúdo e o layout. Por exemplo, **nowrap** pode ser útil para menus ou botões, enquanto **pre-wrap** é ideal para parágrafos longos que precisam manter a formatação sem causar overflow.
    
- **Uso em Elementos Pré-Formatados:**
    
    A combinação de **white-space: pre** com a tag `<pre>` é comum para exibir código ou texto onde a formatação original é importante.
    
- **Acessibilidade:**
    
    Certifique-se de que o uso de **white-space** não prejudique a legibilidade do conteúdo, principalmente em dispositivos móveis.
    

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS white-space:**[MDN CSS white-space](https://developer.mozilla.org/pt-BR/docs/Web/CSS/white-space)
- **W3Schools – CSS white-space:**[W3Schools CSS white-space](https://www.w3schools.com/cssref/pr_text_white-space.asp)
- **Artigos e Tutoriais:**
    - [CSS-Tricks: Handling White Space](https://css-tricks.com/almanac/properties/w/white-space/)
    - [A Guide to CSS Text Wrapping and White Space](https://www.smashingmagazine.com/2012/03/css-tips-tricks-whitespace/)

## 7. Conclusão

A propriedade **white-space** é uma ferramenta poderosa para controlar a formatação e o comportamento do espaço em branco dentro de elementos textuais. Ao escolher entre valores como **normal**, **nowrap**, **pre**, **pre-wrap** ou **pre-line**, os desenvolvedores podem adaptar a apresentação do conteúdo às necessidades específicas do design e melhorar a legibilidade em diferentes dispositivos. Explore os exemplos e recursos indicados para aprofundar seu conhecimento e aplicar essas práticas em seus projetos de CSS.