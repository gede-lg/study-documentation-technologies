Vamos explorar as propriedades relacionadas a fontes no CSS:

### Onde Encontrar Fontes Personalizadas?

Existem várias fontes personalizadas disponíveis em sites como Google Fonts, Adobe Fonts, FontSquirrel, entre outros. Esses sites oferecem uma variedade de fontes que podem ser incorporadas em seus projetos.

### Personalizando as Fontes do Nosso Site

Personalizar as fontes do seu site pode melhorar a estética e a legibilidade. Vamos explorar algumas maneiras de fazer isso.

### Aplicando Fontes Personalizadas com `@font-face`

A regra `@font-face` permite incorporar fontes personalizadas diretamente no seu estilo.

Exemplo:
```css
/* Incorporando uma fonte personalizada usando @font-face */
@font-face {
    font-family: 'MinhaFontePersonalizada';
    src: url('caminho/para/fonte.woff2') format('woff2'),
         url('caminho/para/fonte.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

body {
    font-family: 'MinhaFontePersonalizada', sans-serif;
}
```

### Aplicando Fontes Personalizadas com `@import url()`

A regra `@import` também pode ser usada para incluir fontes personalizadas em seu estilo.

Exemplo:
```css
/* Importando uma fonte personalizada usando @import url() */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
    font-family: 'Roboto', sans-serif;
}
```

### Alterando o Tamanho das Fontes com `font-size`

A propriedade `font-size` controla o tamanho da fonte.

Exemplo:
```css
/* Definindo o tamanho da fonte */
.paragrafo-grande {
    font-size: 24px;
}
```

### Estilo de Fontes com `font-style`

A propriedade `font-style` define o estilo da fonte (normal, itálico ou obliquo).

Exemplo:
```css
/* Definindo a fonte em itálico */
.italico {
    font-style: italic;
}
```

### Espessura das Fontes com `font-weight`

A propriedade `font-weight` define a espessura da fonte.

Exemplo:
```css
/* Definindo a fonte como negrito */
.negrito {
    font-weight: bold;
}
```

### Variação das Fontes com `font-variant`

A propriedade `font-variant` controla as variantes de fonte, como maiúsculas pequenas.

Exemplo:
```css
/* Utilizando maiúsculas pequenas */
.maiusculas-pequenas {
    font-variant: small-caps;
}
```

### Propriedade `font-stretch`

A propriedade `font-stretch` controla a largura ou estreitamento da fonte.

Exemplo:
```css
/* Esticando a largura da fonte */
.fonte-estendida {
    font-stretch: expanded;
}
```

### Customizando a Altura da Linha com `line-height`

A propriedade `line-height` controla a altura da linha, afetando o espaçamento entre as linhas de texto.

Exemplo:
```css
/* Ajustando a altura da linha */
.texto-espacado {
    line-height: 1.5;
}
```

### Propriedade Resumida `font`

A propriedade `font` combina várias propriedades de fonte em uma única declaração.

Exemplo:
```css
/* Usando a propriedade font de modo geral */
.titulo-personalizado {
    font: italic bold 24px/1.5 'MinhaFontePersonalizada', sans-serif;
}
```

Neste exemplo, a propriedade `font` é usada para definir o estilo, peso, tamanho, altura da linha e fonte em uma única declaração, proporcionando uma maneira eficiente de organizar e aplicar estilos de fonte.