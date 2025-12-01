## 1. Introdução

A tag `<caption>` é usada para definir um título ou legenda para tabelas HTML, melhorando a acessibilidade e organização de dados. Sua importância está em:

- **Contextualização**: Explica o propósito da tabela.
- **Acessibilidade**: Auxilia leitores de tela a interpretarem dados tabulares.
- **SEO**: Melhora a indexação de conteúdo estruturado.

---

## 2. Sumário

1. Definição e Conceitos Fundamentais
2. Sintaxe e Estrutura
3. Componentes Principais
4. Propriedades/Atributos
5. Uso Avançado
6. Exemplos Práticos
7. Informações Adicionais

---

## 3. Conteúdo Detalhado

### **3.1 Definição e Conceitos**

- **Básico**: Título descritivo posicionado acima da tabela por padrão.
- **Avançado**: Integração com CSS/JavaScript para interatividade e acessibilidade aprimorada.

### **3.2 Sintaxe e Estrutura**

```html
<table>
  <caption>Título da Tabela</caption>
  <!-- Conteúdo da tabela (thead, tbody, etc.) -->
</table>

```

- **Regra**: `<caption>` deve ser o **primeiro filho direto** de `<table>`.

### **3.3 Componentes Principais**

- `<table>`: Elemento pai.
- Elementos de tabela: `<thead>`, `<tbody>`, `<tr>`, etc.

### **3.4 Propriedades/Atributos**

- **Atributos globais** (ex: `class`, `id`).
- **Atributos obsoletos**: `align` (substituído por CSS).

### **3.5 Uso Avançado**

- **Posicionamento com CSS**:
    
    ```css
    caption {
      caption-side: bottom; /* Posiciona a legenda abaixo */
      text-align: right;
    }
    
    ```
    
- **Acessibilidade**: Associar com `aria-describedby` para contexto adicional.

---

## 4. Exemplos Práticos

### **4.1 Uso Básico**

```html
<table>
  <caption>Lista de Funcionários</caption>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Cargo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>João</td>
      <td>Desenvolvedor</td>
    </tr>
  </tbody>
</table>

```

### **4.2 Uso Avançado (CSS + ARIA)**

```html
<table aria-describedby="descricao-tabela">
  <caption style="caption-side: bottom; font-weight: bold;">
    Tabela de Vendas 2023
  </caption>
  <!-- Conteúdo da tabela -->
</table>
<p id="descricao-tabela">Dados financeiros trimestrais.</p>

```

---

## 5. Informações Adicionais

- **Acessibilidade**: Sempre use `<caption>` para tabelas complexas.
- **CSS**: Use `caption-side` para posicionar a legenda (valores: `top` | `bottom`).
- **Compatibilidade**: Suportado em todos os navegadores modernos.

---

## 6. Referências para Estudo

1. [MDN Web Docs - <caption>](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/caption)
2. [W3C - Tabelas HTML5](https://www.w3.org/TR/html52/tabular-data.html)
3. [WebAIM - Tabelas Acessíveis](https://webaim.org/techniques/tables/)

---

## 7. Formatação

- **Legibilidade**: Hierarquia clara com títulos e subtítulos.
- **Códigos**: Destacados com syntax highlighting.
- **Links**: Hyperlinks para documentação oficial.