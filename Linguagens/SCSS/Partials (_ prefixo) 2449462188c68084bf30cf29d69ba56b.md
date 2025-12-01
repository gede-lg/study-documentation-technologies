# Partials (_ prefixo)

Olá, Gedê\!

Entendido. Preparei uma explicação detalhada e extensa sobre os partials no Sass, conforme você solicitou.

---

# Entendendo Sass Partials: Modularização e Organização

## Uma Explicação Detalhada

### Sumário

Os **partials** no Sass são arquivos que começam com o prefixo `_` (underscore). Eles são projetados para não serem compilados individualmente para arquivos CSS, mas sim para serem importados e usados em outros arquivos Sass. Isso permite modularizar o código, tornando-o mais organizado, reutilizável e fácil de manter. Abordaremos os conceitos fundamentais, sintaxe, exemplos práticos, melhores práticas e casos de uso.

### Conceitos Fundamentais

O propósito principal de um partial é a **modularização**. Em vez de ter um único arquivo Sass enorme e difícil de navegar, você pode dividir seu código em arquivos menores e mais específicos, cada um com uma responsabilidade clara (por exemplo, um partial para variáveis, outro para mixins, outro para estilos de botões, etc.).

Quando você usa a diretiva `@import` para incluir um partial em outro arquivo Sass (por exemplo, `main.scss`), o Sass processa o conteúdo do partial e o combina com o arquivo principal antes da compilação. O resultado é um único arquivo CSS final, o que otimiza o desempenho, pois o navegador precisa fazer apenas uma requisição para carregar todos os estilos.

### Sintaxe e Uso

Para criar um partial, basta nomear o arquivo com um `_` no início. Por exemplo, `_variables.scss` ou `_buttons.scss`.

Para importar um partial em outro arquivo, você usa a diretiva `@import`, mas **sem** o `_` e **sem** a extensão `.scss`.

**Exemplo:**

Se você tem os arquivos `_variables.scss`, `_mixins.scss` e `style.scss` na mesma pasta:

**`_variables.scss`**

```sass
// cores
$primary-color: #3498db;
$secondary-color: #2ecc71;

// fontes
$font-stack: Helvetica, sans-serif;

```

**`_mixins.scss`**

```sass
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

```

**`style.scss`**

```sass
// Importando os partials
@import "variables";
@import "mixins";

body {
  font-family: $font-stack;
  color: $primary-color;
  @include flex-center;
}

h1 {
  color: $secondary-color;
}

```

Ao compilar `style.scss`, o Sass irá gerar um único arquivo `style.css`:

**`style.css`**

```css
body {
  font-family: Helvetica, sans-serif;
  color: #3498db;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  color: #2ecc71;
}

```

---

### Propriedades e Métodos (Variáveis, Mixins, Funções, etc.)

É importante notar que "propriedades" e "métodos" no contexto de um partial não são conceitos separados. Um partial é um contêiner para qualquer código Sass. As "propriedades" seriam variáveis, e os "métodos" seriam mixins e funções.

- **Variáveis (`$`)**: Definidas em partials (`_variables.scss`), elas podem ser acessadas globalmente por qualquer arquivo que importe o partial.
- **Mixins (`@mixin`)**: Definidos em partials (`_mixins.scss`), eles podem ser incluídos em seletores em outros arquivos usando `@include`.
- **Funções (`@function`)**: Semelhante aos mixins, funções podem ser definidas em um partial (`_functions.scss`) e usadas para retornar valores, como `darken($color, 10%)`.
- **Extend (`@extend`)**: Você pode definir classes genéricas em um partial (`_placeholders.scss`) e estendê-las em outros arquivos para herdar seus estilos.

---

### Restrições de Uso

A principal "restrição" de uso é mais uma questão de boa prática do que uma limitação técnica.

- **Não compile partials diretamente**: O propósito deles é serem importados. Tentar compilar um partial individualmente (por exemplo, `sass _partial.scss`) resultará em um arquivo CSS com o conteúdo do partial, o que não é o uso pretendido. O `_` serve justamente para indicar ao compilador que ele deve ser ignorado na compilação individual.
- **Evite imports circulares**: Não importe um arquivo A em um arquivo B e, ao mesmo tempo, importe B em A. Isso causará um erro de compilação.
- **Não abuse de `@import`**: Embora a diretiva `@import` seja fundamental para os partials, o Sass tem evoluído. O Sass Module System (`@use` e `@forward`) é a forma moderna e recomendada de gerenciar dependências. Embora `@import` ainda funcione, `@use` oferece um escopo mais restrito e evita poluir o namespace global.

---

### Melhores Práticas e Casos de Uso

1. **Estrutura de pastas**: Organize seus partials em pastas lógicas para manter o projeto escalável. Uma estrutura comum é:
    
    ```
    sass/
    ├── base/
    │   ├── _reset.scss
    │   ├── _typography.scss
    │   └── _variables.scss
    ├── components/
    │   ├── _button.scss
    │   ├── _card.scss
    │   └── _form.scss
    ├── layout/
    │   ├── _footer.scss
    │   ├── _header.scss
    │   └── _navigation.scss
    └── main.scss
    
    ```
    
2. **`main.scss` como ponto de entrada**: Use um único arquivo principal, como `main.scss`, para importar todos os seus partials na ordem correta. Isso cria um único arquivo de saída CSS. A ordem é importante, pois as variáveis e mixins devem ser importados antes de serem usados.
3. **Partials de variáveis e mixins**: Separe as variáveis e mixins em partials dedicados. Isso facilita a localização e a modificação de valores e funções globais.
4. **Partials para componentes**: Cada componente da sua interface (botões, cards, formulários) pode ter seu próprio partial. Isso segue o princípio de **separação de preocupações**.

---

### Exemplo Completo

Vamos criar um exemplo completo de um projeto Sass usando partials para uma página simples.

**Estrutura de Pastas**

```
project/
├── scss/
│   ├── base/
│   │   ├── _variables.scss
│   │   └── _typography.scss
│   ├── components/
│   │   ├── _button.scss
│   │   └── _card.scss
│   ├── layout/
│   │   └── _header.scss
│   └── main.scss
└── index.html

```

**`_variables.scss`**

```sass
// Cores da paleta
$primary-color: #007bff;
$secondary-color: #6c757d;
$background-light: #f8f9fa;
$text-dark: #343a40;

// Tamanhos de fonte
$font-base: 16px;
$font-large: 24px;
$font-small: 14px;

```

**`_typography.scss`**

```sass
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: $font-base;
  color: $text-dark;
  background-color: $background-light;
}

h1, h2, h3 {
  color: $primary-color;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

```

**`_button.scss`**

```sass
.button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.button-primary {
  background-color: $primary-color;
  color: #fff;

  &:hover {
    background-color: darken($primary-color, 10%);
    border-color: darken($primary-color, 10%);
  }
}

.button-secondary {
  background-color: $secondary-color;
  color: #fff;

  &:hover {
    background-color: darken($secondary-color, 10%);
    border-color: darken($secondary-color, 10%);
  }
}

```

**`_card.scss`**

```sass
.card {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

```

**`_header.scss`**

```sass
.header {
  background-color: $primary-color;
  color: #fff;
  padding: 1rem;
  text-align: center;
}

```

**`main.scss`**

```sass
// Importando partials na ordem
// Variáveis e tipografia primeiro
@import "base/variables";
@import "base/typography";

// Componentes e layout depois
@import "layout/header";
@import "components/button";
@import "components/card";

// Estilos específicos da página
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}

```

Ao compilar `main.scss`, o Sass gerará um único arquivo CSS com todos os estilos combinados e em ordem, pronto para ser usado no `index.html`.

---

### Tópicos Relacionados para Aprofundamento

- **Sass Modules (`@use` e `@forward`)**: A forma moderna de gerenciar dependências e evitar conflitos de nome. É o sucessor de `@import`.
- **Mixins vs. Extends (`@mixin` vs. `@extend`)**: Entenda a diferença de uso e quando preferir um sobre o outro.
- **Functions (`@function`)**: Como criar funções Sass para processar e retornar valores, tornando seu código mais dinâmico.
- **Organização BEM (Block, Element, Modifier)**: Combine a metodologia BEM com a modularização dos partials para criar uma arquitetura CSS escalável e manutenível.

Espero que esta explicação detalhada tenha sido útil. Se tiver mais alguma dúvida, é só perguntar\!