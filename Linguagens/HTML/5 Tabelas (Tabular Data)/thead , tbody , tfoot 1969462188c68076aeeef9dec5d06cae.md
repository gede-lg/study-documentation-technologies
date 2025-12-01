# <thead>, <tbody>, <tfoot>

---

### **1. Introdução**

As tags `<thead>`, `<tbody>`, e `<tfoot>` são elementos estruturais para organizar tabelas em HTML5. Elas dividem a tabela em três seções lógicas: **cabeçalho**, **corpo** e **rodapé**, melhorando a semântica, a acessibilidade e facilitando a estilização e manipulação via CSS/JavaScript. Essas tags são essenciais para tabelas complexas, como relatórios financeiros ou grades de dados, onde a separação clara de conteúdo é crítica.

---

### **2. Sumário**

1. **Definição e Conceitos Fundamentais**
2. **Sintaxe e Estrutura**
3. **Componentes Principais**
4. **Propriedades/Atributos**
5. **Uso Avançado**
6. **Exemplos Práticos**
7. **Nuances e Detalhes Relevantes**
8. **Referências para Estudo**

---

### **3. Conteúdo Detalhado**

### **Definição e Conceitos Fundamentais**

- **`<thead>`**: Define o cabeçalho da tabela. Contém linhas (`<tr>`) com células de cabeçalho (`<th>`).
- **`<tbody>`**: Define o corpo principal da tabela. Contém as linhas de dados (`<td>`).
- **`<tfoot>`**: Define o rodapé da tabela. Usado para resumos ou totais.

**Diferenças**:

- `<thead>` e `<tfoot>` são opcionais, enquanto `<tbody>` é implícito (mesmo que não declarado).
- A ordem no HTML é `<thead>` → `<tfoot>` → `<tbody>` para renderização correta.

---

### **Sintaxe e Estrutura**

```html
<table>
  <thead>
    <tr>
      <th>Cabeçalho 1</th>
      <th>Cabeçalho 2</th>
    </tr>
  </thead>
  <tfoot>
    <tr>
      <td>Total</td>
      <td>R$ 1000</td>
    </tr>
  </tfoot>
  <tbody>
    <tr>
      <td>Dado 1</td>
      <td>R$ 500</td>
    </tr>
    <tr>
      <td>Dado 2</td>
      <td>R$ 500</td>
    </tr>
  </tbody>
</table>

```

---

### **Componentes Principais**

- **Linhas**: `<tr>` dentro de cada seção.
- **Células**: `<th>` (cabeçalho) ou `<td>` (dados).

---

### **Propriedades/Atributos**

- **Atributos Globais**: `class`, `id`, `style`, etc.
- **Sem Atributos Exclusivos**: Não possuem atributos específicos.

---

### **Uso Avançado**

1. **Múltiplos `<tbody>`**:
    
    Útil para agrupar dados relacionados.
    
    ```html
    <tbody>
      <tr><td>Grupo A</td></tr>
    </tbody>
    <tbody>
      <tr><td>Grupo B</td></tr>
    </tbody>
    
    ```
    
2. **Acessibilidade**:
    
    Use `scope="col"` ou `scope="row"` em `<th>` para associar células a colunas/linhas.
    
3. **JavaScript**:
    
    Manipule dinamicamente seções:
    
    ```jsx
    document.querySelector('tbody').insertRow();
    
    ```
    

---

### **4. Exemplos Práticos**

### **Exemplo Básico**

```html
<table border="1">
  <thead>
    <tr>
      <th>Produto</th>
      <th>Preço</th>
    </tr>
  </thead>
  <tfoot>
    <tr>
      <td>Total</td>
      <td>R$ 200</td>
    </tr>
  </tfoot>
  <tbody>
    <tr>
      <td>Caneta</td>
      <td>R$ 50</td>
    </tr>
    <tr>
      <td>Caderno</td>
      <td>R$ 150</td>
    </tr>
  </tbody>
</table>

```

### **Exemplo Avançado (Múltiplos `<tbody>` e Estilização)**

```html
<style>
  tbody:nth-child(odd) { background: #f0f0f0; }
  tfoot { font-weight: bold; }
</style>

<table>
  <thead>...</thead>
  <tfoot>...</tfoot>
  <tbody>
    <!-- Grupo 1 -->
    <tr><td>Item 1</td></tr>
  </tbody>
  <tbody>
    <!-- Grupo 2 -->
    <tr><td>Item 2</td></tr>
  </tbody>
</table>

```

---

### **5. Informações Adicionais**

- **Ordem no HTML**: `<tfoot>` deve vir antes de `<tbody>` para renderização consistente.
- **Impressão**: `<thead>` e `<tfoot>` podem repetir em páginas impressas.
- **SEO**: Tabelas bem estruturadas melhoram a interpretação por motores de busca.

---

### **6. Referências para Estudo**

1. [MDN Web Docs - Table](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/table)
2. [W3C Tables Specification](https://www.w3.org/TR/html52/tabular-data.html)
3. [WebAIM - Table Accessibility](https://webaim.org/techniques/tables/)

---

### **7. Formatação**

Resposta estruturada em seções, com exemplos de código e ênfase em práticas recomendadas.