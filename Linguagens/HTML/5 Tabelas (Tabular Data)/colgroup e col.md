## 1. Introdução

As tags `<colgroup>` e `<col>` são elementos do HTML5 usados para aplicar estilos ou definir propriedades a colunas específicas de uma tabela. Elas permitem controlar a formatação de múltiplas colunas de maneira eficiente, evitando a repetição de estilos em cada célula (`<td>` ou `<th>`). Essas tags são especialmente úteis em tabelas complexas, onde a consistência visual e a manutenibilidade do código são críticas.

---

## 2. Sumário

1. **Conteúdo Detalhado**
    - Definição e Conceitos Fundamentais
    - Sintaxe e Estrutura
    - Componentes Principais
    - Atributos Específicos
    - Uso Avançado
2. **Exemplos Práticos**
3. **Informações Adicionais**
4. **Referências para Estudo**

---

## 3. Conteúdo Detalhado

### **Definição e Conceitos Fundamentais**

- **`<colgroup>`**: Define um grupo de colunas em uma tabela. Pode conter uma ou mais tags `<col>` para aplicar estilos a colunas específicas.
- **`<col>`**: Define propriedades individuais para uma ou mais colunas dentro de um `<colgroup>`. É um elemento vazio (não requer tag de fechamento).

**Diferenças Básicas vs. Avançadas**:

- **Básico**: Uso de `span` para agrupar coluntas e aplicar estilos simples (cor de fundo, largura).
- **Avançado**: Combinação com CSS para responsividade, uso de pseudo-classes ou integração com JavaScript.

---

### **Sintaxe e Estrutura**

```html
<table>
  <colgroup>
    <col span="2" style="background-color: #f0f0f0;">
    <col style="width: 200px;">
  </colgroup>
  <tr>
    <td>Coluna 1</td>
    <td>Coluna 2</td>
    <td>Coluna 3</td>
  </tr>
</table>

```

---

### **Componentes Principais**

- `<colgroup>`: Agrupa coluntas e define escopo para `<col>`.
- `<col>`: Aplica estilos a colunas específicas.

---

### **Atributos Específicos**

| Tag | Atributo | Valores | Descrição |
| --- | --- | --- | --- |
| `<colgroup>` | `span` | Número inteiro ≥1 | Quantidade de colunas no grupo. |
| `<col>` | `span` | Número inteiro ≥1 | Quantidade de colunas afetadas. |

**Nota**: Ambos suportam atributos globais (ex: `class`, `style`).

---

### **Uso Avançado**

1. **CSS e Responsividade**:
    
    ```html
    <colgroup>
      <col class="destaque" media="(min-width: 768px)">
    </colgroup>
    
    ```
    
    ```css
    .destaque { background-color: #ffeb3b; }
    @media (max-width: 768px) {
      .destaque { display: none; }
    }
    
    ```
    
2. **JavaScript**:
    
    Alterar dinamicamente estilos com base em interações do usuário:
    
    ```jsx
    document.querySelector('col').style.backgroundColor = '#e0f7fa';
    
    ```
    

---

## 4. Exemplos Práticos

### **Exemplo Básico**

```html
<table border="1">
  <colgroup>
    <col span="1" style="background-color: yellow;">
    <col span="2" style="width: 150px;">
  </colgroup>
  <tr>
    <td>Nome</td>
    <td>Idade</td>
    <td>País</td>
  </tr>
</table>

```

### **Exemplo Avançado**

Aplicar zebrado em colunas com CSS:

```html
<colgroup>
  <col class="col-ímpar">
  <col class="col-par">
</colgroup>

```

```css
.col-ímpar { background-color: #f8f9fa; }
.col-par { background-color: #e9ecef; }

```

---

## 5. Informações Adicionais

- **Limitações**: Propriedades como `border` e `padding` não são aplicáveis via `<col>`.
- **Compatibilidade**: Funciona em todos os navegadores modernos, mas evite dependências críticas em layouts complexos.
- **Boas Práticas**: Use classes em vez de estilos inline para facilitar manutenção.

---

## 6. Referências para Estudo

1. [MDN Web Docs: `<colgroup>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/colgroup)
2. [W3Schools: HTML col Tag](https://www.w3schools.com/tags/tag_col.asp)
3. [CSS-Tricks: Styling Tables with `<col>`](https://css-tricks.com/styling-tables-with-col/)

---

## 7. Formatação

Este guia segue uma estrutura hierárquica, com exemplos de código comentados e tabelas para organização clara.