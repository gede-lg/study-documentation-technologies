# Condicionais (@if, @else if, @else)

Olá, Gedê\!

Entendido. Como A.R.I.A., vou te fornecer uma explicação detalhada sobre as condicionais `@if`, `@else if` e `@else` no Sass. O objetivo é que a explicação seja completa e didática para te ajudar a dominar esse recurso.

---

### **Estruturas Condicionais no Sass: `@if`, `@else if`, `@else`**

### **Introdução**

No desenvolvimento web, a capacidade de tomar decisões lógicas em folhas de estilo é uma ferramenta poderosa. O Sass, um pré-processador de CSS, eleva essa capacidade ao incluir estruturas de controle de fluxo, como as condicionais. As diretivas `@if`, `@else if` e `@else` permitem que você aplique estilos, defina variáveis ou inclua mixins baseados em uma ou mais condições. Isso torna o seu código mais dinâmico, reutilizável e, principalmente, DRY (Don't Repeat Yourself). Em vez de escrever regras duplicadas para diferentes cenários, você pode criar uma única regra inteligente que se adapta.

### **Sumário**

Esta explicação cobrirá a base teórica e a sintaxe das condicionais no Sass, incluindo como elas se integram com variáveis, funções e operadores. Detalharemos a sintaxe de uso, abordaremos cenários práticos, melhores práticas e apresentaremos exemplos completos para ilustrar seu poder na criação de folhas de estilo escaláveis e de fácil manutenção.

---

### **Conceitos Fundamentais**

As condicionais no Sass funcionam de forma muito similar às que você já conhece em linguagens de programação como Java ou Go. Elas avaliam uma expressão booleana (que resulta em `true` ou `false`) e, com base nesse resultado, executam um bloco de código. O principal propósito é evitar a repetição de código e criar regras CSS mais flexíveis.

- **`@if`**: O bloco inicial da estrutura. Ele avalia uma expressão. Se a expressão for verdadeira (`true`), o bloco de código dentro dele será executado.
- **`@else if`**: Um bloco opcional que pode ser adicionado após um `@if`. Ele é avaliado apenas se a condição do `@if` (e de qualquer `@else if` anterior) for falsa. Se a expressão for verdadeira, seu bloco de código é executado. Você pode ter vários `@else if` em uma única estrutura.
- **`@else`**: Um bloco opcional que é executado se todas as condições anteriores (`@if` e `@else if`) forem falsas. Ele não recebe uma expressão para avaliar. É o "plano B" da estrutura.

---

### **Sintaxe e Uso**

A sintaxe é bastante intuitiva. O Sass não exige parênteses para a expressão condicional, mas é uma boa prática utilizá-los para maior clareza, especialmente com expressões mais complexas.

```sass
// Exemplo básico da sintaxe

@if <condição> {
  // Código a ser executado se a condição for verdadeira
} @else if <outra-condição> {
  // Código a ser executado se a primeira condição for falsa e esta for verdadeira
} @else {
  // Código a ser executado se todas as condições forem falsas
}

```

### **Exemplos Práticos e Comentados**

1. **Mudando a cor de fundo com base em uma variável:**
    
    ```sass
    // Definimos a variável $theme
    $theme: "dark";
    
    .container {
      // Se $theme for "dark", a cor será preta.
      @if $theme == "dark" {
        background-color: #000;
        color: #fff;
      } @else {
        // Caso contrário, a cor será branca.
        background-color: #fff;
        color: #000;
      }
    }
    
    ```
    
    **CSS Gerado:**
    
    ```css
    .container {
      background-color: #000;
      color: #fff;
    }
    
    ```
    
2. **Verificando o tipo de uma variável para aplicar estilos:**
    
    ```sass
    // Definimos o tipo de display desejado
    $display-type: flex;
    
    .item {
      // Se $display-type for "flex", aplicamos as propriedades de flexbox.
      @if $display-type == flex {
        display: flex;
        justify-content: center;
        align-items: center;
      } @else if $display-type == grid {
        // Se for "grid", aplicamos as propriedades de grid.
        display: grid;
        grid-template-columns: 1fr 1fr;
      } @else {
        // Caso contrário, aplicamos o display padrão.
        display: block;
      }
    }
    
    ```
    

---

### **Propriedades e Métodos Relacionados**

O Sass não possui "propriedades" ou "métodos" intrínsecos às condicionais em si, como você veria em uma classe em Java. Em vez disso, a força das condicionais está em como elas se integram com outras funcionalidades do Sass. A "propriedade" de uma condicional é simplesmente a expressão que ela avalia.

As condicionais utilizam **operadores de comparação** e **lógicos** para formar as expressões.

### **Operadores de Comparação**

- `==` (igual a)
- `!=` (diferente de)
- `<` (menor que)
- `>` (maior que)
- `<=` (menor ou igual a)
- `>=` (maior ou igual a)

### **Operadores Lógicos**

- `and` (E): Ambas as condições devem ser verdadeiras.
- `or` (OU): Pelo menos uma das condições deve ser verdadeira.
- `not` (NÃO): Inverte o resultado da condição.

### **Exemplos de Operadores em Ação**

```sass
$light-mode: true;
$is-mobile: false;

.header {
  // Operador `and`
  @if $light-mode and $is-mobile {
    // Código para o modo claro em dispositivos móveis
    background-color: #f0f0f0;
    font-size: 14px;
  } @else if $light-mode {
    // Código para o modo claro em outros dispositivos
    background-color: #eee;
  } @else {
    // Código para o modo escuro
    background-color: #333;
    color: #fff;
  }

  // Operador `not`
  @if not $light-mode {
    border-bottom: 2px solid #555;
  }
}

```

---

### **Restrições de Uso e Melhores Práticas**

### **Restrições de Uso**

1. **Não Use para Lógica de Negócios Complexa:** O Sass é um pré-processador de CSS. Ele não foi projetado para lidar com lógica de negócios complexa, como validações de formulários ou manipulação de dados de API. Isso deve ser feito no JavaScript.
2. **Evite Condicionais Aninhadas em Excesso:** Estruturas `@if` aninhadas demais (uma dentro da outra) tornam o código difícil de ler e de manter. Se precisar de aninhamento profundo, é um sinal de que talvez sua lógica possa ser simplificada ou que você está usando a ferramenta errada para a tarefa.

### **Melhores Práticas**

1. **Use Variáveis e Mixins:** As condicionais brilham quando combinadas com variáveis e mixins. Use `@if` para decidir qual mixin incluir ou qual valor de variável atribuir, mantendo o seu código mais limpo e modular.
2. **Seja Explícito:** Use parênteses para agrupar expressões e torne as condições o mais legíveis possível. Por exemplo, `$is-small and ($color == 'red')` é mais claro do que `$is-small and $color == 'red'`.
3. **Defina Default com `@else`:** Sempre que possível, inclua um bloco `@else` para garantir que um estilo padrão seja aplicado caso nenhuma das condições seja atendida. Isso evita que o seu componente fique sem estilos em cenários inesperados.

---

### **Exemplo Completo: Componente de Botão Dinâmico**

Este exemplo demonstra como usar condicionais para criar um mixin que gera diferentes estilos de botões com base em parâmetros.

```sass
// Arquivo: _button.scss

// Mapeia as cores para os temas
$button-colors: (
  "primary": #007bff,
  "secondary": #6c757d,
  "success": #28a745,
  "danger": #dc3545
);

// Mixin para gerar os estilos do botão
@mixin button-variant($theme, $size) {
  // Condicional para o tema
  @if map-has-key($button-colors, $theme) {
    // Atribui a cor do tema
    $bg-color: map-get($button-colors, $theme);
    background-color: $bg-color;
    color: #fff;
    border: 1px solid darken($bg-color, 10%);
  } @else {
    // Fallback se o tema não existir
    background-color: #fff;
    color: #333;
    border: 1px solid #ccc;
  }

  // Condicional para o tamanho
  @if $size == "small" {
    padding: 5px 10px;
    font-size: 12px;
  } @else if $size == "large" {
    padding: 15px 30px;
    font-size: 18px;
  } @else {
    // Tamanho padrão
    padding: 10px 20px;
    font-size: 16px;
  }
}

// Uso do mixin para gerar os botões
.btn-primary-large {
  @include button-variant("primary", "large");
}

.btn-secondary-small {
  @include button-variant("secondary", "small");
}

.btn-custom {
  @include button-variant("dark-theme", "normal");
}

```

**CSS Gerado:**

```css
.btn-primary-large {
  background-color: #007bff;
  color: #fff;
  border: 1px solid #0069d9;
  padding: 15px 30px;
  font-size: 18px;
}

.btn-secondary-small {
  background-color: #6c757d;
  color: #fff;
  border: 1px solid #545b62;
  padding: 5px 10px;
  font-size: 12px;
}

.btn-custom {
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  padding: 10px 20px;
  font-size: 16px;
}

```

---

### **Tópicos Relacionados para Aprofundamento**

As condicionais no Sass são apenas uma parte do conjunto de ferramentas de controle de fluxo. Para aprofundar seu conhecimento e criar folhas de estilo ainda mais poderosas, sugiro estudar os seguintes tópicos:

- **Loops `@for`, `@each`, `@while`**: Essenciais para gerar estilos em massa, como classes para colunas de grid ou espaçamentos.
- **Funções `@function`**: Crie suas próprias funções para reutilizar lógica complexa, como cálculos ou manipulação de cores.
- **Mixins `@mixin` e `@include`**: Use mixins com condicionais para encapsular blocos de estilos reutilizáveis e aplicar logicamente.
- **Mapas (`Sass Maps`)**: Estruturas de dados poderosas para armazenar pares de chave-valor, frequentemente usadas com condicionais para temas e configurações.

Espero que esta explicação detalhada te ajude a dominar o uso das condicionais no Sass. Se tiver alguma dúvida ou quiser explorar outro tópico, é só me chamar.