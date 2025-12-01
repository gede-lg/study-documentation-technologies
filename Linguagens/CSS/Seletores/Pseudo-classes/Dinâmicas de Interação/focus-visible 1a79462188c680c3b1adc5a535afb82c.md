# :focus-visible

---

## **1. Introdução**

A pseudo-classe **`:focus-visible`** permite aplicar estilos a elementos focados **apenas quando o navegador determina que o indicador de foco deve ser visível**, geralmente em casos de navegação por teclado (ex: usando a tecla `Tab`). Ela resolve um problema comum de acessibilidade: evitar que estilos de foco apareçam em interações via mouse, mantendo-os visíveis para usuários que dependem de teclado ou tecnologias assistivas.

### **Relevância**

- **Acessibilidade**: Garante que usuários com limitações motoras ou visuais identifiquem o elemento em foco.
- **UX (Experiência do Usuário)**: Elimina efeitos visuais indesejados em cliques com mouse, preservando a clareza em navegações por teclado.

### **Definição**

- **Tema Principal**: `:focus-visible` é uma pseudo-classe CSS que ativa estilos condicionalmente, baseada na modalidade de entrada do usuário (teclado vs. mouse).
- **Subtemas**:
    - Diferença entre `:focus` e `:focus-visible`.
    - Gerenciamento de estilos para diferentes modos de interação.

---

## **2. Sumário**

1. Sintaxe e Estrutura
2. Componentes Principais e Interações
3. Restrições de Uso
4. Exemplos de Código
5. Informações Adicionais (Acessibilidade e Boas Práticas)
6. Referências

---

## **3. Conteúdo Detalhado**

### **Sintaxe e Estrutura**

```css
seletor:focus-visible {
  propriedade: valor;
}

```

- Aplica estilos **apenas** se o elemento está focável (ex: `button`, `a`, inputs) e o navegador detecta que o foco deve ser destacado.

### **Componentes Principais**

- **Input Modality**: O navegador decide se o foco é visível com base no método de interação (teclado, mouse, touch).
- **Estilos Padrão do Navegador**: Alguns navegadores (ex: Chrome) já aplicam `:focus-visible` automaticamente a elementos como `button`.

### **Restrições**

- **Suporte de Navegadores**:
    - Suportado no Chrome (>=86), Firefox (>=85), Edge (>=86), Safari (>=15.4).
    - Polyfills (ex: [focus-visible.js](https://github.com/WICG/focus-visible)) são necessários para versões antigas.

---

## **4. Exemplos de Código**

### **Exemplo Básico**

```css
/* Estilo apenas para foco via teclado */
button:focus-visible {
  outline: 3px solid #4a90e2;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

```

### **Fallback para Navegadores sem Suporte**

```css
/* Estilo padrão para :focus */
button:focus {
  outline: 2px solid red;
}

/* Sobrescreve se o navegador suportar :focus-visible */
button:focus-visible {
  outline: 3px solid #4a90e2;
  outline-offset: 2px;
}

```

### **Remover Outline Apenas para Mouse**

```css
/* Remove outline padrão */
button:focus:not(:focus-visible) {
  outline: none;
}

```

---

## **5. Informações Adicionais**

### **Acessibilidade**

- **Não remova outlines completamente**: Use `:focus-visible` para personalizar, mas mantenha indicadores visíveis para teclado.
- **Testes**: Valide em diferentes navegadores e dispositivos (ex: leitores de tela).

### **Boas Práticas**

- Combine `:focus` e `:focus-visible` para fallback.
- Use contraste adequado nos estilos de foco (ex: mínimo 3:1 em relação ao fundo).

---

## **6. Referências**

1. **MDN Web Docs**: [Documentação Oficial](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
2. **CSSWG**: [Especificação CSS Selectors Level 4](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo)
3. **Artigo**: ["Focus Visible" no CSS-Tricks](https://css-tricks.com/focus-visible-and-backwards-compatibility/)
4. **Polyfill**: [Biblioteca focus-visible.js](https://github.com/WICG/focus-visible)

---

**Formatação**: Utilize pré-processadores (ex: Sass) para organizar estilos e ferramentas como Lighthouse para validar acessibilidade.