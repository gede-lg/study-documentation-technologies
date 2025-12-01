## 1. Introdução

As tabelas são elementos fundamentais em HTML para exibir dados tabulares, como planilhas, calendários ou comparações estruturadas. Antes do CSS, eram frequentemente usadas para layouts, mas hoje seu uso é recomendado exclusivamente para dados tabulares. A semântica correta das tabelas é crucial para acessibilidade, permitindo que leitores de tela interpretem os dados adequadamente.

---

## 2. Sumário

1. **Definição e Conceitos Fundamentais**
2. **Sintaxe e Estrutura**
3. **Componentes Principais**
4. **Atributos Específicos**
5. **Uso Avançado**
6. **Exemplos Práticos**
7. **Informações Adicionais**
8. **Referências para Estudo**

---

## 3. Conteúdo Detalhado

### **Definição e Conceitos Fundamentais**

- **Básico**: Uma tabela é composta por linhas (`<tr>`), células (`<td>`), e cabeçalhos (`<th>`).
- **Avançado**: Elementos semânticos como `<thead>`, `<tbody>`, `<tfoot>`, e atributos como `colspan` e `rowspan` permitem estruturas complexas e acessíveis.

---

### **Sintaxe e Estrutura**

A estrutura básica de uma tabela inclui:

```html
<table>
  <tr>
    <th>Cabeçalho 1</th>
    <th>Cabeçalho 2</th>
  </tr>
  <tr>
    <td>Dado 1</td>
    <td>Dado 2</td>
  </tr>
</table>

```

---

### **Componentes Principais**

| Elemento     | Função                                      |
| ------------ | ------------------------------------------- |
| `<table>`    | Contêiner principal da tabela.              |
| `<tr>`       | Define uma linha.                           |
| `<td>`       | Célula padrão para dados.                   |
| `<th>`       | Célula de cabeçalho (com ênfase semântica). |
| `<thead>`    | Agrupa cabeçalhos.                          |
| `<tbody>`    | Agrupa o corpo da tabela.                   |
| `<tfoot>`    | Agrupa o rodapé (ex.: totais).              |
| `<caption>`  | Legenda/título da tabela.                   |
| `<colgroup>` | Define grupos de colunas para estilização.  |

---

### **Atributos Específicos**

- **`colspan`**: Mescla células horizontalmente (ex.: `<td colspan="2">`).
- **`rowspan`**: Mescla células verticalmente (ex.: `<td rowspan="3">`).
- **`scope`** (em `<th>`): Define a abrangência do cabeçalho (`col`, `row`, `colgroup`, `rowgroup`).
- **`headers`** (em `<td>`): Associa células a cabeçalhos específicos (para tabelas complexas).
- **Atributos globais**: `id`, `class`, `style`, etc.

⚠️ **Nota**: Atributos como `border` (ex.: `<table border="1">`) são obsoletos em HTML5. Use CSS.

---

### **Uso Avançado**

1. **Acessibilidade**:
    - Use `<th scope="col">` para associar cabeçalhos a colunas.
    - Adicione `<caption>` para descrever o propósito da tabela.
2. **Responsividade**:
    - Envolva a tabela em `<div class="table-responsive">` e use `overflow-x: auto` no CSS para rolagem horizontal em dispositivos pequenos.
3. **Estrutura Semântica**:
    - Divida a tabela em `<thead>`, `<tbody>`, e `<tfoot>` para melhor organização.

---

## 4. Exemplos Práticos

### **Exemplo Básico**

```html
<table>
  <caption>Notas dos Alunos</caption>
  <thead>
    <tr>
      <th scope="col">Nome</th>
      <th scope="col">Nota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ana</td>
      <td>9.5</td>
    </tr>
    <tr>
      <td>Carlos</td>
      <td>8.0</td>
    </tr>
  </tbody>
</table>

```

### **Exemplo Avançado (com colspan e rowspan)**

```html
<table>
  <thead>
    <tr>
      <th colspan="2">Informações</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">João</td>
      <td>Matemática: 10</td>
    </tr>
    <tr>
      <td>Português: 9</td>
    </tr>
  </tbody>
</table>

```

---

## 5. Informações Adicionais

- **Nuances**:
    - Evite aninhar tabelas, pois isso prejudica a acessibilidade e a performance.
    - Use `aria-describedby` para associar tabelas a descrições externas.
- **CSS**: Priorize estilização via CSS (ex.: `border-collapse: collapse` para bordas uniformes).

---

## 6. Referências para Estudo

1. [MDN Web Docs: Table](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/table)
2. [W3C: Tables](https://www.w3.org/TR/html52/tabular-data.html)
3. [WebAIM: Table Accessibility](https://webaim.org/techniques/tables/)

---

## 7. Formatação

Este documento segue uma estrutura hierárquica com títulos, subtítulos, tabelas e blocos de código para clareza. Use **semântica HTML** e **CSS** para otimizar a apresentação de tabelas em projetos reais.