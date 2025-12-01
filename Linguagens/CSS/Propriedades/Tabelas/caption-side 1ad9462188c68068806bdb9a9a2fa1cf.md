# caption-side

## 1. Introdução

A propriedade **caption-side** é utilizada para definir a posição do título (caption) de uma tabela. Essa propriedade permite que você escolha se o título da tabela será exibido na parte superior ou inferior da mesma. Em alguns contextos e com determinados modos de escrita (como em layouts com escrita vertical), pode haver suporte para valores adicionais, mas os valores mais comuns e amplamente suportados são `top` e `bottom`.

### Conceitos Fundamentais

- **Tema Principal (Propriedade caption-side):**
    
    Determina onde o título de uma tabela (a tag `<caption>`) é posicionado em relação ao corpo da tabela.
    
- **Valores Comuns:**
    - `top` (valor padrão): O título é exibido acima da tabela.
    - `bottom`: O título é exibido abaixo da tabela.

## 2. Sumário

1. **Introdução**
    - Visão geral e relevância
    - Conceitos fundamentais
2. **Sintaxe e Estrutura**
    - Declaração básica da propriedade **caption-side**
    - Valores disponíveis: `top` e `bottom`
3. **Componentes Principais**
    - Comportamento padrão e efeitos de cada valor
    - Impacto no layout da tabela
4. **Exemplos de Código Otimizados**
    - Tabela com título posicionado no topo
    - Tabela com título posicionado na parte inferior
5. **Informações Adicionais**
    - Considerações sobre acessibilidade e consistência visual
6. **Referências para Estudo Independente**
    - Recursos e links para aprofundamento

## 3. Conteúdo Detalhado

### 3.1. Sintaxe e Estrutura

A sintaxe básica para utilizar a propriedade **caption-side** é:

```css
table {
    caption-side: valor;
}

```

Onde **valor** pode ser:

- `top`: Posiciona o título acima da tabela (valor padrão).
- `bottom`: Posiciona o título abaixo da tabela.

### 3.2. Componentes Principais

- **caption-side: top**
    
    Este valor coloca o elemento `<caption>` no topo da tabela, acima das células e linhas. É o comportamento padrão em praticamente todos os navegadores.
    
- **caption-side: bottom**
    
    Este valor posiciona o título da tabela na parte inferior, abaixo dos dados. Pode ser utilizado em designs onde se deseja enfatizar os dados antes do título ou quando o título funciona como uma nota de rodapé.
    

## 4. Exemplos de Código Otimizados

### Exemplo 1: Tabela com Caption no Topo

```css
table.tabela-top {
    width: 100%;
    border-collapse: collapse;
    caption-side: top; /* Posição padrão */
}

table.tabela-top caption {
    font-weight: bold;
    padding: 8px;
    background-color: #f0f0f0;
}

```

```html
<table class="tabela-top">
    <caption>Título da Tabela no Topo</caption>
    <thead>
        <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Cidade</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Ana</td>
            <td>28</td>
            <td>São Paulo</td>
        </tr>
        <tr>
            <td>Bruno</td>
            <td>34</td>
            <td>Rio de Janeiro</td>
        </tr>
    </tbody>
</table>

```

### Exemplo 2: Tabela com Caption na Parte Inferior

```css
table.tabela-bottom {
    width: 100%;
    border-collapse: collapse;
    caption-side: bottom;
}

table.tabela-bottom caption {
    font-weight: bold;
    padding: 8px;
    background-color: #f0f0f0;
}

```

```html
<table class="tabela-bottom">
    <thead>
        <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Quantidade</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Camiseta</td>
            <td>R$ 29,90</td>
            <td>50</td>
        </tr>
        <tr>
            <td>Calça</td>
            <td>R$ 79,90</td>
            <td>30</td>
        </tr>
    </tbody>
    <caption>Título da Tabela na Parte Inferior</caption>
</table>

```

## 5. Informações Adicionais

- **Acessibilidade:**
    
    A posição do título da tabela pode afetar a forma como leitores de tela interpretam a estrutura dos dados. Usar **caption-side** corretamente ajuda a garantir que o título seja lido no momento apropriado.
    
- **Consistência Visual:**
    
    Manter uma abordagem consistente para a posição dos títulos de tabelas ao longo de um site contribui para uma experiência de usuário coesa.
    
- **Suporte a Idiomas e Layouts:**
    
    Embora os valores `top` e `bottom` sejam os mais comuns, verifique as necessidades específicas de seu projeto, principalmente se estiver trabalhando com layouts que utilizem modos de escrita diferentes.
    

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS caption-side:**[MDN CSS caption-side](https://developer.mozilla.org/pt-BR/docs/Web/CSS/caption-side)
- **W3Schools – HTML Tables and Captions:**[W3Schools Tabelas](https://www.w3schools.com/html/html_tables.asp) (Inclui informações sobre `<caption>`)
- **Artigos e Tutoriais:**
    - [CSS-Tricks: Styling HTML Tables](https://css-tricks.com/complete-guide-to-styling-tables-with-css/)
    - [A Guide to Accessible Tables](https://www.w3.org/WAI/tutorials/tables/)

## 7. Conclusão

A propriedade **caption-side** oferece um controle simples e eficaz sobre a posição do título de uma tabela, permitindo que desenvolvedores escolham entre exibir o título na parte superior ou inferior. Essa flexibilidade é fundamental para a criação de layouts de tabelas que atendam tanto a requisitos estéticos quanto a considerações de acessibilidade. Explore os exemplos e recursos indicados para aprofundar seu conhecimento e aplicar essas práticas em seus projetos de CSS.