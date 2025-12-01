# Operadores Matemáticos

Olá, Gedê\!

A.R.I.A. está pronta para te ajudar com uma explicação detalhada sobre operadores matemáticos no Sass. Fique tranquilo, vamos cobrir tudo o que você pediu de forma clara e com muitos exemplos.

---

# Operadores Matemáticos no Sass: Dominando Cálculos em Suas Folhas de Estilo

## Introdução

O Sass (Syntactically Awesome Style Sheets) é um pré-processador CSS que estende as capacidades da linguagem, adicionando recursos poderosos como variáveis, mixins e, é claro, operadores matemáticos. Longe de ser apenas uma ferramenta para escrever menos código, o Sass permite que você crie lógicas complexas e dinâmicas, facilitando a manutenção e a escalabilidade de seus projetos. O uso de operadores matemáticos transforma suas folhas de estilo de documentos estáticos em sistemas inteligentes, onde valores podem ser calculados e ajustados dinamicamente.

---

## Sumário

- **Conceitos Fundamentais:** Entenda o papel dos operadores no Sass.
- **Sintaxe e Uso:** Como usar `+`, , , `/` e `%`.
- **Atenção ao Operador `/`:** A peculiaridade do operador de divisão no Sass.
- **Propriedades e Métodos:** O Sass não tem "propriedades" ou "métodos" matemáticos no sentido tradicional, mas sim funções embutidas. Vamos esclarecer isso.
- **Restrições de Uso:** Quando evitar os operadores matemáticos.
- **Melhores Práticas e Casos de Uso:** Aplicações práticas e dicas para um código limpo.
- **Exemplos Completos:** Um sistema de layout e tipografia que utiliza todos os conceitos.

---

## Conceitos Fundamentais

No Sass, os operadores matemáticos funcionam de forma muito similar à maioria das linguagens de programação. Eles permitem que você realize operações básicas como adição, subtração, multiplicação, divisão e módulo (resto da divisão) diretamente nos valores das suas propriedades CSS. O grande diferencial é a capacidade de realizar essas operações com variáveis, o que torna o processo de design muito mais flexível.

**Propósito:**

- **Automatização:** Calcular tamanhos, espaçamentos e outros valores de forma automática.
- **Escalabilidade:** Mudar um valor base e ter todos os elementos dependentes recalculados.
- **Consistência:** Garantir que o design siga uma proporção ou sistema de grid definido.
- **DRY (Don't Repeat Yourself):** Evitar a repetição de valores calculados manualmente.

---

## Sintaxe e Uso

Os operadores matemáticos no Sass são `+`, `-`, `*`, `/` e `%`. Eles podem ser usados com diferentes tipos de dados, como números, unidades (pixels, ems, rems), cores e listas.

### Adição (`+`)

Usado para somar valores.

```scss
$largura-base: 100px;
$padding: 20px;

.elemento {
  // A largura total será 120px
  width: $largura-base + $padding;
}

```

### Subtração ()

Usado para subtrair valores.

```scss
$largura-total: 100%;
$margin-lateral: 20px;

.coluna-principal {
  // A largura será 100% menos 40px (20px de cada lado)
  width: $largura-total - ($margin-lateral * 2);
}

```

### Multiplicação ()

Usado para multiplicar valores. É ótimo para criar sistemas de escala.

```scss
$tamanho-fonte-base: 16px;

h1 {
  // Tamanho da fonte será 16px * 2 = 32px
  font-size: $tamanho-fonte-base * 2;
}
h2 {
  // Tamanho da fonte será 16px * 1.5 = 24px
  font-size: $tamanho-fonte-base * 1.5;
}

```

### Divisão (`/`)

Este é o operador mais peculiar no Sass e exige atenção. O Sass interpreta `/` de duas maneiras:

1. **Operador de divisão:** Quando a divisão é intencional.
2. **Separador CSS:** Quando o valor deve ser mantido como está (ex: `font: 16px/1.5`).

Para forçar o Sass a realizar a divisão, você deve:

- Usar a divisão dentro de parênteses.
- Usar a divisão com variáveis.
- Usar a divisão com uma função matemática.

**Exemplos:**

```scss
// Divisão como separador CSS - o Sass não irá calcular
.divisao-separador {
  font-size: 16px/1.5; // Compila para 'font-size: 16px/1.5;'
}

// Divisão forçada com parênteses
.divisao-parente {
  width: (1000px / 2); // Compila para 'width: 500px;'
}

// Divisão forçada com variável
$total-colunas: 12;
.coluna-3 {
  width: 100% / $total-colunas * 3; // Compila para 'width: 25%;'
}

```

### Módulo (`%`)

Retorna o resto de uma divisão. É útil para verificar se um número é par, ímpar, ou para criar padrões repetitivos.

```scss
$total-elementos: 10;

@for $i from 1 through $total-elementos {
  .item-#{$i} {
    // Se o resto da divisão por 2 for 0, é par
    @if $i % 2 == 0 {
      background-color: lightgray;
    } @else {
      background-color: white;
    }
  }
}

```

---

## Propriedades e Métodos

No Sass, o conceito de "propriedades" ou "métodos" matemáticos não se aplica da mesma forma que em linguagens orientadas a objeto. Em vez disso, o Sass oferece **funções embutidas** que realizam operações matemáticas.

**Principais Funções Matemáticas do Sass:**

| Função | Sintaxe | Conceito |
| --- | --- | --- |
| `abs($number)` | `abs(-10px)` | Retorna o valor absoluto de um número. |
| `round($number)` | `round(1.5px)` | Arredonda um número para o inteiro mais próximo. |
| `ceil($number)` | `ceil(1.2px)` | Arredonda um número para cima para o próximo inteiro. |
| `floor($number)` | `floor(1.9px)` | Arredonda um número para baixo para o próximo inteiro. |
| `min($numbers...)` | `min(10px, 20px, 5px)` | Retorna o menor valor de uma lista de números. |
| `max($numbers...)` | `max(10px, 20px, 5px)` | Retorna o maior valor de uma lista de números. |
| `pow($base, $power)` | `pow(2, 3)` | Retorna o resultado de um número elevado a uma potência. |
| `sqrt($number)` | `sqrt(9)` | Retorna a raiz quadrada de um número. |
| `random($limit: null)` | `random(10)` | Retorna um número aleatório (inteiro ou decimal). |
| `unit($number)` | `unit(10px)` | Retorna a unidade de um número (ex: `px`). |
| `unitless($number)` | `unitless(10px)` | Retorna `true` se o número não tiver unidade. |

Essas funções são essenciais para manipular valores de forma precisa e controlada, complementando os operadores básicos.

---

## Restrições de Uso

Embora os operadores matemáticos sejam incrivelmente úteis, há cenários onde seu uso pode causar problemas:

- **Tipos de Dados Incompatíveis:** Tentar operar com tipos de dados incompatíveis (ex: `10px + 'abc'`) resultará em um erro de compilação.
- **Unidades de Medida Diferentes:** O Sass pode somar ou subtrair unidades compatíveis (ex: `10px + 2em` é válido), mas tentar somar unidades incompatíveis (ex: `10px + 5%`) pode gerar resultados inesperados e não é recomendado sem a devida conversão.
- **Abuso de Lógica Complexa:** Embora seja possível, criar cadeias de cálculo excessivamente longas e complexas pode tornar o código difícil de ler e depurar. Nestes casos, o ideal é quebrar a lógica em variáveis ou mixins menores e mais compreensíveis.

---

## Melhores Práticas e Casos de Uso

### 1\. Sistema de Grid Fluido

Use operadores matemáticos para criar um sistema de grid responsivo e escalável.

```scss
$total-colunas: 12;
$espacamento-coluna: 20px;

@mixin coluna($num-colunas) {
  // A largura da coluna é calculada dinamicamente
  width: (100% / $total-colunas * $num-colunas) - $espacamento-coluna;
  margin-right: $espacamento-coluna;
}

.item-grid {
  @include coluna(3); // 3 colunas de 12
}

```

### 2\. Tipografia Modular

Crie uma escala de tipografia que seja baseada em um valor de fonte inicial, garantindo consistência.

```scss
$fonte-base: 1rem;
$escala-tipo: 1.618; // Proporção áurea

h1 {
  font-size: $fonte-base * ($escala-tipo * $escala-tipo);
}
h2 {
  font-size: $fonte-base * $escala-tipo;
}
p {
  font-size: $fonte-base;
}

```

### 3\. Paletas de Cores Dinâmicas

Embora não sejam operadores matemáticos puros, as funções de cor do Sass usam lógica similar. É possível clarear ou escurecer cores com `lighten()` e `darken()`, que internamente fazem cálculos.

```scss
$cor-primaria: #3498db;

.botao {
  background-color: $cor-primaria;
  border: 1px solid darken($cor-primaria, 10%);
}

.botao:hover {
  background-color: lighten($cor-primaria, 5%);
}

```

---

## Exemplo Completo: Layout de Cartões

Este exemplo integra variáveis, operadores matemáticos e mixins para criar um layout flexível e dinâmico.

```scss
// Definições de variáveis globais
$largura-maxima-pagina: 1200px;
$padding-pagina: 30px;
$espacamento-cartao: 20px;

// Variável para a largura total dos cartões
$largura-cartao-total: $largura-maxima-pagina - ($padding-pagina * 2);

// Mixin para criar colunas flexíveis
@mixin grid-cartoes($num-colunas) {
  // Calcula a largura de cada cartão dinamicamente
  width: ($largura-cartao-total / $num-colunas) - $espacamento-cartao;
  margin-right: $espacamento-cartao;
  margin-bottom: $espacamento-cartao;

  // Limpa o último cartão da linha
  &:nth-child(#{$num-colunas}n) {
    margin-right: 0;
  }
}

// Estilos
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.container {
  max-width: $largura-maxima-pagina;
  margin: 0 auto;
  padding: $padding-pagina;
  display: flex;
  flex-wrap: wrap;
}

.cartao {
  @include grid-cartoes(4); // Exibe 4 cartões por linha

  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  box-sizing: border-box; // Fundamental para que o padding não quebre o cálculo
}

// Exemplo de uso
// HTML correspondente:
// <div class="container">
//   <div class="cartao">Cartão 1</div>
//   <div class="cartao">Cartão 2</div>
//   ...
// </div>

```

Neste exemplo, se você alterar `$num-colunas` no mixin, o Sass recalculará automaticamente a largura de cada cartão, tornando a manutenção do layout extremamente simples.

Espero que esta explicação detalhada tenha te ajudado a dominar os operadores matemáticos no Sass, Gedê\! É uma ferramenta poderosa para qualquer desenvolvedor que busca um código mais limpo e dinâmico.

---

## Tópicos Relacionados para Aprofundamento

- **Variáveis e Mixins:** Como combinar operadores matemáticos com esses recursos para criar sistemas ainda mais avançados.
- **Funções de Cor do Sass:** Explore como usar funções como `mix()`, `lighten()`, `darken()`, `saturate()` e `desaturate()` para criar paletas de cores dinâmicas.
- **Mapas (Maps):** Aprenda a armazenar pares chave-valor e usar operadores para iterar e manipular esses dados.
- **`@function`:** Crie suas próprias funções no Sass para encapsular lógicas de cálculo complexas e reutilizáveis.