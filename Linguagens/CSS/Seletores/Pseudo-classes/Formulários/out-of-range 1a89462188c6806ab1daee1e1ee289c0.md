# :out-of-range

---

# 1. Introdução

A pseudo-classe **:out-of-range** é uma funcionalidade do CSS que permite estilizar elementos de formulário, como *input* e *textarea*, quando seu valor está fora do intervalo definido pelos atributos de validação, como `min`, `max` e `step`. Essa ferramenta é essencial para melhorar a experiência do usuário, fornecendo feedback visual imediato sobre entradas inválidas e auxiliando na criação de interfaces mais intuitivas e responsivas.

### Relevância e Importância

- **Validação Visual:** Facilita a identificação imediata de erros de entrada pelo usuário, sem a necessidade de scripts adicionais.
- **Experiência do Usuário:** Melhora a usabilidade ao fornecer feedback instantâneo sobre o status do campo.
- **Integração com HTML5:** Complementa os atributos de validação nativos do HTML5, promovendo uma abordagem mais declarativa e semântica para a validação de formulários.

### Definições e Conceitos Fundamentais

- **Tema Principal:** *Pseudo-classe :out-of-range*
    
    Trata-se da pseudo-classe usada para selecionar elementos cujo valor não atende aos critérios de validação definidos (por exemplo, um número menor que o mínimo permitido).
    
- **Subtemas (caso existam):**
    - **Validação de Formulários com CSS:** Uso de pseudo-classes para indicar estados de erro e sucesso.
    - **Outras Pseudo-classes de Validação:** Como `:in-range`, `:invalid` e `:valid`, que permitem estilizar elementos com base na validade de seus dados.
- **Para que Serve:**
    
    Permite a aplicação de estilos específicos a campos de formulário que estão fora dos limites definidos, melhorando a clareza visual e a interação com o usuário.
    

---

# 2. Sumário

1. **Introdução**
    - Visão geral
    - Relevância e conceitos fundamentais
2. **Conteúdo Detalhado**
    - Sintaxe e Estrutura
    - Componentes Principais
    - Restrições de Uso
3. **Exemplos de Código Otimizados**
    - Exemplos básicos
    - Exemplos avançados
4. **Informações Adicionais**
    - Tópicos complementares e nuances
5. **Referências para Estudo Independente**
    - Documentação, artigos e tutoriais

---

# 3. Conteúdo Detalhado

## 3.1. Sintaxe e Estrutura

A pseudo-classe **:out-of-range** é utilizada em conjunto com seletores de elementos de formulário que possuem restrições de valor. A sintaxe básica é:

```css
/* Seleciona inputs cujo valor está fora do intervalo definido */
input:out-of-range {
  border: 2px solid red;
}

```

Neste exemplo, qualquer `<input>` que não atender aos critérios de validação (por exemplo, fora do `min` e `max` especificados) receberá uma borda vermelha.

## 3.2. Componentes Principais

### Função e Propósito

- **Identificação Visual:** Permite diferenciar visualmente campos de entrada com valores inválidos.
- **Feedback Instantâneo:** Proporciona um retorno imediato ao usuário sem depender de JavaScript.
- **Integração com Outras Pseudo-classes:** Pode ser combinada com outras pseudo-classes como `:invalid` e `:valid` para criar estilos abrangentes para todos os estados dos campos.

### Métodos e Elementos Relacionados

- **Atributos HTML de Validação:**
    
    A pseudo-classe depende dos atributos de validação do HTML, tais como:
    
    - `min` e `max`: Definem os limites mínimos e máximos para valores numéricos.
    - `step`: Define os incrementos permitidos para o valor.
    - `pattern`: Utilizado para validação de padrões em campos de texto.
- **Interação Entre Pseudo-classes:**
    - **:in-range:** Aplica-se a campos cujo valor está dentro dos limites definidos.
    - **:invalid:** Indica campos que não passaram na validação (mais abrangente que :out-of-range, pois inclui erros de padrão, required, etc.).
    - **:valid:** Aplica-se quando o valor do campo atende a todos os critérios de validação.

## 3.3. Restrições de Uso

- **Compatibilidade:**
    
    A pseudo-classe **:out-of-range** depende do suporte do navegador aos padrões de validação do HTML5. É importante verificar a compatibilidade em diferentes navegadores, embora os navegadores modernos geralmente ofereçam suporte adequado.
    
- **Interferência com JavaScript:**
    
    Embora a pseudo-classe forneça feedback visual, a validação de formulários complexos ainda pode exigir manipulação adicional via JavaScript.
    

---

# 4. Exemplos de Código Otimizados

## Exemplo Básico

```html
<!-- Exemplo de input numérico com atributos de validação -->
<form>
  <label for="age">Idade (entre 18 e 99):</label>
  <input type="number" id="age" name="age" min="18" max="99">
</form>

```

```css
/* Estiliza inputs fora do intervalo */
input:out-of-range {
  border: 2px solid red;
  background-color: #ffe6e6;
}

/* Estiliza inputs dentro do intervalo */
input:in-range {
  border: 2px solid green;
  background-color: #e6ffe6;
}

```

> Comentário: Neste exemplo, se o usuário inserir um valor fora do intervalo definido (menor que 18 ou maior que 99), o input receberá uma borda vermelha e um fundo levemente avermelhado, enquanto valores corretos serão destacados em verde.
> 

## Exemplo Avançado

```html
<!-- Exemplo de formulário com múltiplos campos e feedback visual -->
<form>
  <div>
    <label for="salary">Salário (entre 3000 e 10000):</label>
    <input type="number" id="salary" name="salary" min="3000" max="10000">
  </div>
  <div>
    <label for="rating">Avaliação (entre 1 e 5):</label>
    <input type="number" id="rating" name="rating" min="1" max="5" step="0.1">
  </div>
  <button type="submit">Enviar</button>
</form>

```

```css
/* Estilos para inputs fora do intervalo */
input:out-of-range {
  border: 2px solid #d9534f; /* Vermelho Bootstrap */
  box-shadow: 0 0 5px rgba(217, 83, 79, 0.5);
}

/* Estilos para inputs válidos */
input:in-range {
  border: 2px solid #5cb85c; /* Verde Bootstrap */
  box-shadow: 0 0 5px rgba(92, 184, 92, 0.5);
}

/* Estilos adicionais para melhorar a legibilidade */
input {
  padding: 0.5rem;
  font-size: 1rem;
  transition: border 0.3s, box-shadow 0.3s;
}

```

> Comentário: Este exemplo demonstra a aplicação de estilos diferenciados para múltiplos campos de formulário, garantindo feedback visual consistente e aprimorando a experiência do usuário.
> 

---

# 5. Informações Adicionais

- **Combinação com JavaScript:**
    
    Para casos onde a validação do formulário deve ser mais robusta, a pseudo-classe pode ser combinada com scripts que fornecem mensagens de erro personalizadas ou manipulação de eventos.
    
- **Acessibilidade:**
    
    O feedback visual deve ser complementado por outros mecanismos de acessibilidade (como mensagens de erro em texto) para garantir que todos os usuários, incluindo aqueles que dependem de leitores de tela, possam compreender os erros de validação.
    
- **Pseudoclasses Relacionadas:**
    
    Além de `:out-of-range`, outras pseudo-classes de validação como `:in-range`, `:invalid` e `:valid` são úteis para criar um sistema de feedback visual completo. Combiná-las de forma inteligente pode resultar em uma experiência de usuário muito mais intuitiva.
    
- **Limitações:**
    
    Em navegadores mais antigos que não suportam os atributos de validação do HTML5, essas pseudo-classes não terão efeito, sendo necessário recorrer a soluções alternativas.
    

---

# 6. Referências para Estudo Independente

- **MDN Web Docs:**
    - [Pseudo-classes de validação](https://developer.mozilla.org/pt-BR/docs/Web/CSS/:out-of-range)
    - [Form validation](https://developer.mozilla.org/pt-BR/docs/Learn/Forms/Form_validation)
- **W3C HTML5 Specification:**
    - [HTML5: A linguagem de marcação para a Web](https://www.w3.org/TR/html52/sec-forms.html)
- **Tutoriais e Artigos:**
    - [CSS-Tricks: Form Validation](https://css-tricks.com/form-validation-part-1-constraint-validation-api/)
    - [A Complete Guide to Form Validation in HTML5](https://www.smashingmagazine.com/2010/07/html5-form-validation-the-basics/)

---

Essa explicação cobre desde os fundamentos da pseudo-classe **:out-of-range** até exemplos práticos e recomendações para aprofundamento. Essa abordagem integrada auxilia desenvolvedores a compreenderem tanto os aspectos técnicos quanto as melhores práticas para implementação em projetos reais.