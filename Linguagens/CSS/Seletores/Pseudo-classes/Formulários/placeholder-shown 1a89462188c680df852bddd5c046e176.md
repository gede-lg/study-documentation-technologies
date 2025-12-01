# :placeholder-shown

---

## 1. Introdução

A pseudo-classe **`:placeholder-shown`** é uma ferramenta do CSS que permite selecionar elementos de formulário (principalmente `<input>` e `<textarea>`) enquanto o texto do *placeholder* estiver visível. Essa funcionalidade é relevante para personalizar a aparência dos formulários de forma dinâmica, melhorando a experiência do usuário ao fornecer dicas visuais de preenchimento.

### Relevância e Importância

- **Melhoria na usabilidade:** Permite estilizar campos de entrada de acordo com o estado em que o *placeholder* é exibido, sinalizando ao usuário que o campo ainda não foi preenchido.
- **Design responsivo:** Facilita a criação de interfaces que se adaptam dinamicamente, destacando a interação do usuário com os formulários.
- **Acessibilidade:** Contribui para a clareza visual e pode auxiliar usuários a entenderem rapidamente o propósito dos campos.

### Definições e Conceitos Fundamentais

- **`:placeholder-shown`:** Pseudo-classe que se aplica a elementos cujo atributo `placeholder` está visível, ou seja, quando o campo não contém valor inserido pelo usuário.
- **Placeholder:** Texto de exemplo ou dica exibida em campos de formulário que desaparece quando o usuário começa a digitar.
- **Seletores de Pseudo-classes:** Mecanismo do CSS que permite aplicar estilos baseados em estados específicos dos elementos (por exemplo, foco, estado válido, entre outros).

---

## 2. Sumário

1. **Introdução**
    - Visão geral
    - Relevância e conceitos fundamentais
2. **Conteúdo Detalhado**
    - Sintaxe e Estrutura
    - Componentes Principais e Funcionamento
    - Restrições de Uso
3. **Exemplos de Código Otimizados**
    - Exemplos básicos e avançados
4. **Informações Adicionais**
    - Dicas e nuances relevantes
5. **Referências para Estudo Independente**
    - Recursos confiáveis e links diretos

---

## 3. Conteúdo Detalhado

### Sintaxe e Estrutura

A sintaxe básica para utilizar a pseudo-classe `:placeholder-shown` é a seguinte:

```css
input:placeholder-shown {
  /* Estilos aplicados enquanto o placeholder está visível */
  background-color: #f9f9f9;
  border-color: #ccc;
}

```

**Explicação:**

- O seletor `input:placeholder-shown` aplica os estilos apenas quando o elemento `<input>` está mostrando o placeholder.
- Assim que o usuário começa a digitar e o placeholder deixa de ser visível, esses estilos não serão mais aplicados.

### Componentes Principais

- **Seleção do elemento:** A pseudo-classe pode ser aplicada a `<input>` e `<textarea>`, mas funciona apenas em campos que possuam o atributo `placeholder`.
- **Interação com outros seletores:** Pode ser combinada com outros seletores de estado, como `:focus` ou `:valid`, para criar efeitos mais complexos.
    
    Exemplo:
    
    ```css
    input:placeholder-shown {
      color: #999;
    }
    
    input:focus:not(:placeholder-shown) {
      border-color: #66afe9;
    }
    
    ```
    
    Nesse exemplo, o estilo do texto muda quando o campo está em foco e o placeholder não está mais visível.
    

### Restrições de Uso

- **Compatibilidade:** A pseudo-classe `:placeholder-shown` é suportada nos navegadores modernos, mas pode não funcionar corretamente em versões mais antigas ou em navegadores menos comuns.
- **Aplicabilidade:** Só funciona em elementos que tenham um placeholder definido. Se o campo não tiver um atributo `placeholder`, a pseudo-classe não terá efeito.
- **Interferência com outras pseudo-classes:** Quando combinada com outras pseudo-classes, é importante verificar a ordem e a especificidade dos seletores para evitar conflitos de estilo.

---

## 4. Exemplos de Código Otimizados

### Exemplo Básico

```html
<!-- HTML -->
<input type="text" placeholder="Digite seu nome" id="nome">

```

```css
/* CSS */
input:placeholder-shown {
  background-color: #eef;
  color: #666;
}

```

> Comentário:
> 
> 
> Este exemplo aplica um fundo e uma cor de texto específicos enquanto o placeholder "Digite seu nome" está visível.
> 

### Exemplo Avançado

```html
<!-- HTML -->
<style>
  .input-wrapper {
    position: relative;
    margin-bottom: 1rem;
  }
  input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    transition: border-color 0.3s;
  }
  input:focus {
    border-color: #5b9dd9;
  }
  input:placeholder-shown {
    background-color: #f9f9f9;
    font-style: italic;
  }
  /* Exemplo combinando com outra pseudo-classe */
  input:not(:placeholder-shown):invalid {
    border-color: #e74c3c;
  }
</style>

<div class="input-wrapper">
  <input type="email" placeholder="Digite seu e-mail" required>
</div>

```

> Comentário:
> 
> 
> Este exemplo demonstra:
> 
> - Estilização básica do input.
> - Mudança de cor de borda quando o campo está em foco.
> - Aplicação de um fundo e estilo de fonte (itálico) enquanto o placeholder está visível.
> - Alteração da borda para vermelho se o valor digitado não for válido e o placeholder já tiver sido substituído.

---

## 5. Informações Adicionais

- **Integração com Validação:** A pseudo-classe pode ser combinada com `:valid` e `:invalid` para dar feedback visual imediato sobre a validade dos dados inseridos.
- **Performance:** Por ser uma pseudo-classe que depende do estado do DOM, a aplicação de estilos com `:placeholder-shown` é leve e não impacta significativamente o desempenho.
- **Usabilidade:** Melhorar a indicação visual dos campos de formulário pode reduzir erros de preenchimento e aumentar a eficiência na interação do usuário.

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – `:placeholder-shown`:**
    
    [https://developer.mozilla.org/pt-BR/docs/Web/CSS/:placeholder-shown](https://developer.mozilla.org/pt-BR/docs/Web/CSS/:placeholder-shown)
    
- **W3C – Working Draft for CSS Pseudo-classes:**
    
    [https://www.w3.org/TR/selectors-4/](https://www.w3.org/TR/selectors-4/)
    
- **CSS-Tricks – Guide to CSS Pseudo-classes:**
    
    [https://css-tricks.com/pseudo-class-selectors/](https://css-tricks.com/pseudo-class-selectors/)
    
- **Smashing Magazine – Modern CSS Techniques:**
    
    [https://www.smashingmagazine.com/](https://www.smashingmagazine.com/)
    

---

Esta estrutura oferece uma visão completa sobre o uso e as aplicações da pseudo-classe `:placeholder-shown` em CSS, auxiliando desenvolvedores a implementarem interfaces mais responsivas e intuitivas.