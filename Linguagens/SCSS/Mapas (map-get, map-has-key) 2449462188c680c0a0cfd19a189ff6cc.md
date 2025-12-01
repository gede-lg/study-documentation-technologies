# Mapas (map-get, map-has-key)

Olá, Gedê\!

A.R.I.A. aqui para te ajudar com uma explicação detalhada sobre mapas em Sass. É uma ferramenta muito poderosa para gerenciar dados de forma organizada, perfeita para temas e configurações, como você mencionou. Vamos mergulhar nesse tópico\!

---

## Mapas em Sass: A Chave para Estilos Organizados e Dinâmicos

### Introdução

Mapas em Sass são estruturas de dados que permitem armazenar informações em pares de **chave-valor**, similar aos objetos em JavaScript ou dicionários em Python. Eles são essenciais para manter seu código limpo, reutilizável e fácil de manter, especialmente quando você precisa gerenciar temas de cores, tamanhos de fontes, pontos de interrupção (`breakpoints`) ou configurações de componentes.

### Sumário

Esta explicação cobrirá desde os conceitos básicos de mapas em Sass até o uso de suas funções e restrições. Veremos como criar um mapa, acessar seus valores com `map-get`, verificar a existência de chaves com `map-has-key` e explorar outras funções como `map-merge`, `map-keys`, `map-values` e `map-remove`. Ao final, teremos exemplos práticos e um caso de uso completo para consolidar o aprendizado.

---

### Conceitos Fundamentais

Um mapa é uma lista de pares de chave-valor separados por vírgulas. A chave e o valor podem ser de qualquer tipo de dado válido no Sass (números, strings, listas, etc.). As chaves são únicas dentro de um mapa. O propósito principal dos mapas é agrupar informações relacionadas em uma única variável, tornando o código mais legível e fácil de gerenciar.

**Sintaxe Básica:**
A sintaxe para declarar um mapa é simples:

```scss
// Mapa com chaves de string e valores de cor
$cores-tema: (
  "primaria": #007bff,
  "secundaria": #6c757d,
  "sucesso": #28a745,
  "perigo": #dc3545
);

// Mapa com chaves de string e valores numéricos
$espacamento: (
  "pequeno": 10px,
  "medio": 20px,
  "grande": 30px
);

// Mapa com chaves e valores variados
$config-botao: (
  "tamanho": "pequeno",
  "cor": $cores-tema-primaria, // Pode referenciar outras variáveis
  "borda-arredondada": true
);

```

---

### Funções para Manipular Mapas

Sass fornece uma série de funções embutidas para interagir com mapas. Vamos detalhar cada uma delas.

### `map-get($map, $key)`

Esta é a função mais comum. Ela **retorna o valor associado a uma chave específica** em um mapa. Se a chave não existir, ela retornará `null`.

**Sintaxe de Uso:**

```scss
map-get($map, $key)

```

**Conceito:** É a sua ferramenta principal para extrair informações de um mapa.

**Exemplo:**

```scss
$cores-tema: (
  "primaria": #007bff,
  "secundaria": #6c757d
);

.button {
  background-color: map-get($cores-tema, "primaria"); // Saída: #007bff
  color: #fff;
}

```

### `map-has-key($map, $key)`

Esta função **retorna `true` se a chave existir no mapa, e `false` caso contrário**. É útil para criar verificações condicionais.

**Sintaxe de Uso:**

```scss
map-has-key($map, $key)

```

**Conceito:** Essencial para evitar erros ao tentar acessar chaves que podem não existir.

**Exemplo:**

```scss
$cores-tema: (
  "primaria": #007bff
);

@if map-has-key($cores-tema, "primaria") {
  .header {
    background-color: map-get($cores-tema, "primaria");
  }
} @else {
  .header {
    background-color: #333;
  }
}

```

### `map-merge($map1, $map2)`

Esta função **mescla dois mapas em um novo mapa**. Se houver chaves duplicadas, os valores do segundo mapa (`$map2`) sobrescreverão os do primeiro (`$map1`). O mapa original não é modificado.

**Sintaxe de Uso:**

```scss
map-merge($map1, $map2)

```

**Conceito:** Perfeito para estender ou sobrescrever configurações padrão.

**Exemplo:**

```scss
$config-padrao: (
  "cor-texto": #333,
  "padding": 10px
);

$config-personalizada: (
  "cor-texto": #fff,
  "background-color": #000
);

$config-final: map-merge($config-padrao, $config-personalizada);

// $config-final agora é:
// (
//   "cor-texto": #fff,
//   "padding": 10px,
//   "background-color": #000
// );

.componente-escuro {
  color: map-get($config-final, "cor-texto"); // Saída: #fff
  background-color: map-get($config-final, "background-color"); // Saída: #000
}

```

### `map-keys($map)`

Esta função **retorna uma lista de todas as chaves** em um mapa.

**Sintaxe de Uso:**

```scss
map-keys($map)

```

**Conceito:** Útil para iterar sobre as chaves de um mapa.

**Exemplo:**

```scss
$cores-tema: (
  "primaria": #007bff,
  "secundaria": #6c757d
);

$chaves: map-keys($cores-tema); // Saída: ("primaria", "secundaria")

```

### `map-values($map)`

Esta função **retorna uma lista de todos os valores** em um mapa.

**Sintaxe de Uso:**

```scss
map-values($map)

```

**Conceito:** Perfeito para iterar sobre os valores de um mapa sem se preocupar com as chaves.

**Exemplo:**

```scss
$cores-tema: (
  "primaria": #007bff,
  "secundaria": #6c757d
);

$valores: map-values($cores-tema); // Saída: (#007bff, #6c757d)

```

### `map-remove($map, $keys...)`

Esta função **retorna um novo mapa com as chaves especificadas removidas**. O mapa original não é modificado. Você pode passar uma ou mais chaves.

**Sintaxe de Uso:**

```scss
map-remove($map, $keys...)

```

**Conceito:** Útil para criar uma nova versão de um mapa sem certas chaves.

**Exemplo:**

```scss
$cores-tema: (
  "primaria": #007bff,
  "secundaria": #6c757d,
  "sucesso": #28a745
);

$cores-sem-secundaria: map-remove($cores-tema, "secundaria");
// $cores-sem-secundaria agora é: ("primaria": #007bff, "sucesso": #28a745)

```

---

### Restrições de Uso

Embora mapas sejam extremamente versáteis, há cenários onde seu uso pode ser desnecessário ou até complicado:

- **Para dados simples e únicos:** Se você precisa apenas de uma variável para armazenar uma cor, uma fonte ou um tamanho, usar um mapa é um exagero. Por exemplo, `$cor-primaria: #007bff;` é mais direto do que criar um mapa para uma única cor.
- **Em loops sem um propósito claro:** A iteração sobre mapas deve ter um objetivo. Evite loops que apenas extraem valores sem uma lógica clara, pois isso pode ser menos eficiente e mais difícil de ler do que variáveis simples.

---

### Melhores Práticas e Casos de Uso

**1. Gestão de Temas (`Theming`)**
Um dos casos de uso mais poderosos. Você pode definir múltiplos temas em diferentes mapas e mesclá-los ou selecionar o tema desejado em tempo de compilação.

**2. Pontos de Interrupção (`Breakpoints`)**
Definir os tamanhos de tela para responsividade em um mapa centralizado torna o gerenciamento de media queries muito mais fácil.

**Exemplo:**

```scss
$breakpoints: (
  "mobile": 576px,
  "tablet": 768px,
  "desktop": 992px
);

@mixin for-desktop {
  @media (min-width: map-get($breakpoints, "desktop")) {
    @content;
  }
}

.container {
  padding: 10px;
  @include for-desktop {
    padding: 20px;
  }
}

```

**3. Configurações de Componentes**
Mapas são ideais para centralizar configurações de componentes, como tamanhos de botões, tipos de fontes, ou espaçamentos, permitindo uma fácil customização.

---

### Exemplo Completo: Sistema de Cores e Temas

Vamos juntar tudo o que aprendemos em um exemplo prático que simula um sistema de temas simples.

```scss
// Definição dos mapas de cores para diferentes temas
$tema-claro: (
  "cor-fundo": #ffffff,
  "cor-texto": #333333,
  "cor-link": #007bff
);

$tema-escuro: (
  "cor-fundo": #333333,
  "cor-texto": #ffffff,
  "cor-link": #17a2b8
);

// Ponto de entrada: define qual tema será usado.
// Isso poderia ser um parâmetro para um mixin ou uma variável global
$tema-atual: $tema-claro; // Mude para $tema-escuro para ver a mágica acontecer!

// Mixin para aplicar o tema em um seletor
@mixin aplicar-tema($mapa-tema) {
  background-color: map-get($mapa-tema, "cor-fundo");
  color: map-get($mapa-tema, "cor-texto");

  a {
    color: map-get($mapa-tema, "cor-link");
  }
}

// Aplicação do tema em um elemento
.page-wrapper {
  @include aplicar-tema($tema-atual);
}

// Outro mixin para gerar classes de cores de status
$cores-status: (
  "sucesso": #28a745,
  "aviso": #ffc107,
  "erro": #dc3545
);

@each $nome-status, $cor-status in $cores-status {
  .alerta--#{$nome-status} {
    background-color: $cor-status;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
  }
}

// Exemplo de uso da função map-merge para estender configurações
$config-botao-padrao: (
  "padding": 12px 24px,
  "fonte-tamanho": 16px
);

$config-botao-grande: map-merge($config-botao-padrao, (
  "padding": 16px 32px,
  "fonte-tamanho": 20px
));

.botao-padrao {
  padding: map-get($config-botao-padrao, "padding");
  font-size: map-get($config-botao-padrao, "fonte-tamanho");
}

.botao-grande {
  padding: map-get($config-botao-grande, "padding");
  font-size: map-get($config-botao-grande, "fonte-tamanho");
}

```

Espero que esta explicação detalhada tenha sido útil. Mapas são uma das funcionalidades mais poderosas do Sass e, uma vez que você domina seu uso, eles se tornam indispensáveis para qualquer projeto.

---

### Tópicos Relacionados para Aprofundamento

- **Listas (`Lists`) em Sass:** Estruturas de dados similares a arrays.
- **Funções e Mixins com Parâmetros de Mapas:** Como passar mapas como argumentos para mixins e funções.
- **Iteração com `@each`:** Aprenda a iterar sobre mapas e listas para gerar estilos dinâmicos.