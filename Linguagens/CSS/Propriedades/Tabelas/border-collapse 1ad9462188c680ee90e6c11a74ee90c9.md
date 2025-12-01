# border-collapse

## 1. Introdução

A propriedade **border-collapse** é utilizada para definir como as bordas de uma tabela (ou de seus elementos) são exibidas. Essa propriedade é fundamental para o design de tabelas, permitindo que as bordas sejam apresentadas de forma separada ou fundida (colapsada), o que afeta significativamente a estética e a clareza visual dos dados apresentados.

### Conceitos Fundamentais

- **Tema Principal (Propriedade border-collapse):**
    
    Controla se as bordas adjacentes das células da tabela são desenhadas separadamente ou colapsadas em uma única borda.
    
- **Valores Comuns:**
    - `collapse`: As bordas adjacentes se fundem em uma única borda.
    - `separate`: As bordas são desenhadas de forma individual para cada célula, permitindo a definição de espaçamento entre elas (através da propriedade **border-spacing**).

## 2. Sumário

1. **Introdução**
    - Visão geral e relevância
    - Conceitos fundamentais
2. **Sintaxe e Estrutura**
    - Declaração básica da propriedade **border-collapse**
    - Valores disponíveis: `collapse` e `separate`
3. **Componentes Principais**
    - Efeito do valor `collapse` na visualização de tabelas
    - Efeito do valor `separate` e relação com **border-spacing**
4. **Exemplos de Código Otimizados**
    - Exemplo básico de tabela com bordas colapsadas
    - Exemplo com bordas separadas e espaçamento personalizado
5. **Informações Adicionais**
    - Boas práticas e considerações de design para tabelas
6. **Referências para Estudo Independente**
    - Recursos e links para aprofundamento

## 3. Conteúdo Detalhado

### 3.1. Sintaxe e Estrutura

A sintaxe básica para a propriedade **border-collapse** é:

```css
table {
    border-collapse: valor;
}

```

Onde **valor** pode ser:

- `collapse`: As bordas da tabela e das células se fundem em uma única borda.
- `separate`: As bordas permanecem separadas, permitindo o uso da propriedade **border-spacing** para definir o espaço entre elas.

### 3.2. Componentes Principais

- **collapse:**
    
    Quando definido, as bordas adjacentes da tabela se unem, criando um visual mais limpo e compacto. Essa abordagem é frequentemente utilizada em tabelas onde se deseja uma aparência mais integrada, sem espaçamentos entre as células.
    
- **separate:**
    
    Com este valor, cada célula mantém sua própria borda, permitindo a especificação de um espaçamento (via **border-spacing**) entre elas. Essa opção é útil quando se deseja destacar individualmente cada célula.
    

### 3.3. Considerações Adicionais

- **Compatibilidade:**
A propriedade **border-collapse** é suportada pela maioria dos navegadores modernos e é específica para elementos de tabela.
- **Interação com Border-Spacing:**
O valor `separate` permite o uso da propriedade **border-spacing** para definir o espaço entre as bordas das células. Esse recurso não se aplica quando **border-collapse** está definido como `collapse`.

## 4. Exemplos de Código Otimizados

### Exemplo Básico: Tabela com Bordas Colapsadas

```css
table.tabela-colapsada {
    width: 100%;
    border-collapse: collapse;
}

table.tabela-colapsada th,
table.tabela-colapsada td {
    border: 1px solid #333;
    padding: 8px;
    text-align: left;
}

```

```html
<table class="tabela-colapsada">
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

### Exemplo Avançado: Tabela com Bordas Separadas e Espaçamento

```css
table.tabela-separada {
    width: 100%;
    border-collapse: separate;
    border-spacing: 10px;  /* Espaço entre as células */
}

table.tabela-separada th,
table.tabela-separada td {
    border: 1px solid #666;
    padding: 8px;
    background-color: #f9f9f9;
}

```

```html
<table class="tabela-separada">
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
</table>

```

## 5. Informações Adicionais

- **Estética e Legibilidade:**
A escolha entre **collapse** e **separate** depende do design desejado. Bordas colapsadas criam um visual mais compacto, enquanto bordas separadas podem destacar melhor cada célula.
- **Uso Consistente:**
Manter um estilo consistente em todas as tabelas do projeto contribui para uma melhor experiência de usuário e uma aparência profissional.
- **Border-Spacing:**
Lembre-se de que **border-spacing** só funciona quando **border-collapse** está definido como `separate`.

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS border-collapse:**[MDN CSS border-collapse](https://developer.mozilla.org/pt-BR/docs/Web/CSS/border-collapse)
- **W3Schools – CSS border-collapse:**[W3Schools CSS border-collapse](https://www.w3schools.com/cssref/pr_tab_border-collapse.asp)
- **Artigos e Tutoriais:**
    - [CSS-Tricks: A Complete Guide to Tables in CSS](https://css-tricks.com/complete-guide-to-tables-in-css/)
    - [Understanding Table Border Collapse](https://www.smashingmagazine.com/2010/10/using-css-to-style-html-tables/)

## 7. Conclusão

A propriedade **border-collapse** é uma ferramenta essencial para controlar a aparência das bordas de tabelas em CSS. Ao definir se as bordas devem ser colapsadas ou mantidas separadas, os desenvolvedores podem adaptar o design das tabelas para atender aos requisitos estéticos e funcionais do projeto. Explorar os exemplos e as referências indicadas permitirá um melhor domínio dessa propriedade, contribuindo para a criação de interfaces limpas, organizadas e visualmente consistentes.