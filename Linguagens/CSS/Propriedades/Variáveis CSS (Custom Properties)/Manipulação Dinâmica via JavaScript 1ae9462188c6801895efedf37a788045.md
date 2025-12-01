# Manipulação Dinâmica via JavaScript

## 1. Introdução

As **Propriedades Customizadas** — mais comumente conhecidas como **variáveis CSS** — permitem que você armazene valores de CSS que podem ser reutilizados em todo o seu stylesheet. Essa funcionalidade promove consistência, facilita a manutenção e torna os estilos mais dinâmicos. Além disso, embora o foco seja o CSS, é importante saber que essas variáveis podem ser manipuladas dinamicamente via JavaScript, permitindo a criação de interfaces interativas e adaptativas.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    Variáveis CSS são propriedades definidas pelo desenvolvedor que armazenam valores reutilizáveis. São declaradas com a notação `--nome-da-variavel` e podem ser acessadas usando a função `var()`.
    
- **Vantagens:**
    - **Manutenção Simplificada:** Facilita a atualização de cores, tamanhos e outros valores em vários locais com uma única alteração.
    - **Consistência:** Garante que valores importantes sejam usados de maneira consistente em todo o projeto.
    - **Dinamismo:** Permite ajustes dinâmicos dos estilos, especialmente quando combinadas com JavaScript para alterar a interface em tempo real.
- **Manipulação via JavaScript:**
    
    Mesmo que o foco seja CSS, é útil conhecer que as variáveis CSS podem ser atualizadas dinamicamente com JavaScript. Isso permite, por exemplo, a criação de temas dinâmicos, animações reativas ou interfaces que respondem à interação do usuário sem a necessidade de recarregar a página.
    

---

## 3. Sintaxe e Exemplos de Declaração

### 3.1. Declaração de Variáveis CSS

As variáveis CSS são definidas dentro de um seletor (normalmente no `:root` para torná-las globais):

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #e74c3c;
  --font-size-base: 16px;
  --spacing: 1rem;
}

```

*Explicação:*

- `:root` é o seletor do elemento raiz (equivalente a `html`), tornando as variáveis disponíveis globalmente.
- Cada variável é definida com um nome que começa com `-`.

### 3.2. Uso das Variáveis

Você pode utilizar as variáveis definidas com a função `var()`:

```css
.button {
  background-color: var(--primary-color);
  color: #fff;
  font-size: var(--font-size-base);
  padding: var(--spacing);
  border: none;
  border-radius: 4px;
}

```

*Explicação:*

- A cor de fundo, o tamanho da fonte e o espaçamento do botão são definidos usando as variáveis, facilitando ajustes futuros.

---

## 4. Manipulação Dinâmica via JavaScript

Mesmo que JavaScript não seja o foco principal, vale a pena conhecer como ele pode interagir com as variáveis CSS para criar interfaces dinâmicas.

### 4.1. Acessando e Modificando Variáveis CSS

Você pode ler ou modificar variáveis CSS usando o objeto `document.documentElement` (ou outro elemento específico) e o método `style.setProperty()`.

### Exemplo: Alterar Dinamicamente uma Variável CSS

```html
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>Exemplo de Variáveis CSS Dinâmicas</title>
  <style>
    :root {
      --primary-color: #3498db;
    }
    .box {
      width: 200px;
      height: 200px;
      background-color: var(--primary-color);
      margin: 20px;
      transition: background-color 0.5s ease;
    }
  </style>
</head>
<body>
  <div class="box"></div>
  <button id="changeColor">Mudar Cor</button>

  <script>
    const button = document.getElementById('changeColor');
    button.addEventListener('click', () => {
      // Alterna a cor primária entre azul e vermelho
      const rootStyles = document.documentElement.style;
      const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
      if (currentColor === '#3498db') {
        rootStyles.setProperty('--primary-color', '#e74c3c');
      } else {
        rootStyles.setProperty('--primary-color', '#3498db');
      }
    });
  </script>
</body>
</html>

```

*Explicação:*

- O botão com o ID `changeColor` alterna a cor da variável `-primary-color` entre azul (#3498db) e vermelho (#e74c3c).
- O `getComputedStyle()` obtém o valor atual da variável, e `setProperty()` altera seu valor, o que atualiza a cor de fundo da `.box` automaticamente, graças à ligação com `var(--primary-color)`.

### 4.2. Benefícios da Manipulação Dinâmica

- **Tematização Dinâmica:** Permite mudar o tema do site em tempo real (ex.: modo escuro vs. claro).
- **Interatividade:** Facilita a criação de efeitos interativos que respondem às ações do usuário sem recarregar a página.
- **Customização pelo Usuário:** Possibilita interfaces onde os usuários podem escolher suas preferências de estilo (como cores e espaçamentos).

---

## 5. Informações Adicionais

- **Herança:**
    
    As variáveis definidas no `:root` são globais e podem ser utilizadas em todo o documento, mas também podem ser redefinidas em escopos menores.
    
- **Fallback:**
    
    A função `var()` permite definir valores de fallback caso a variável não esteja definida:
    
    ```css
    color: var(--primary-color, blue);
    
    ```
    
- **Melhores Práticas:**
    - Nomeie as variáveis de forma semântica (ex.: `-primary-color` em vez de `-blue`).
    - Mantenha as variáveis em um local centralizado (como `:root`) para facilitar a manutenção.
    - Utilize a manipulação dinâmica via JavaScript com cuidado, garantindo que as alterações não prejudiquem a legibilidade ou acessibilidade.

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – Using CSS Custom Properties (Variables):**[MDN CSS Custom Properties](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Using_CSS_custom_properties)
- **MDN Web Docs – Manipulating CSS Variables with JavaScript:**[MDN CSS Variables JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Using_CSS_custom_properties#manipulating_css_custom_properties_with_javascript)
- **W3Schools – CSS Variables:**[W3Schools CSS Variables](https://www.w3schools.com/css/css3_variables.asp)
- **Artigos e Tutoriais:**
    - [CSS Variables: Why Should You Care?](https://css-tricks.com/guides/css-variables/)
    - [Dynamic Theming with CSS Variables and JavaScript](https://www.smashingmagazine.com/2019/07/dynamic-theming-css-variables/)

---

## 7. Conclusão

As **variáveis CSS** (propriedades customizadas) oferecem uma maneira poderosa de armazenar e reutilizar valores de estilo em todo o seu projeto, promovendo consistência e facilitando a manutenção. A capacidade de manipulá-las dinamicamente via JavaScript abre um leque de possibilidades para criar interfaces interativas e responsivas, onde o tema e os estilos podem ser ajustados em tempo real conforme as preferências dos usuários ou outras condições. Dominar as variáveis CSS e a sua manipulação com JavaScript é fundamental para o desenvolvimento de projetos modernos e dinâmicos. Explore os exemplos e recursos indicados para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos.