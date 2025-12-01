Vamos explorar as propriedades relacionadas ao fundo (`background`) no CSS, detalhando seus valores:

### Alterando o Fundo de Elementos

A propriedade `background-color` define a cor de fundo de um elemento.

- **Valores:**
  1. Nome de cor: `red`, `blue`, etc.
  2. Código hexadecimal: `#FF0000`, `#0000FF`.
  3. Código RGB: `rgb(255, 0, 0)`, `rgb(0, 0, 255)`.

Exemplo:
```css
.elemento-com-fundo {
    background-color: lightgray; /* Define a cor de fundo como cinza claro */
}
```

### Redimensionando Imagens de Fundo

A propriedade `background-size` especifica o tamanho da imagem de fundo.

- **Valores:**
  1. **`auto`**: O tamanho original da imagem é mantido.
  2. **`cover`**: A imagem é redimensionada para cobrir completamente o contêiner mantendo a proporção original.
  3. **`contain`**: A imagem é redimensionada para caber dentro do contêiner mantendo a proporção original.
  4. Valores em pixels, porcentagem, etc.

Exemplo:
```css
.elemento-com-imagem-fundo {
    background-image: url('imagem.jpg');
    background-size: cover; /* Redimensiona a imagem para cobrir completamente o contêiner */
}
```

### Repetição das Imagens de Fundo

A propriedade `background-repeat` define se a imagem de fundo deve ser repetida.

- **Valores:**
  1. **`repeat`**: A imagem é repetida tanto na horizontal quanto na vertical.
  2. **`repeat-x`**: A imagem é repetida apenas horizontalmente.
  3. **`repeat-y`**: A imagem é repetida apenas verticalmente.
  4. **`no-repeat`**: A imagem não é repetida.

Exemplo:
```css
.elemento-com-imagem-repetida {
    background-image: url('padrao.png');
    background-repeat: repeat; /* Repete a imagem tanto na horizontal quanto na vertical */
}
```

### Posicionamento das Imagens de Fundo

A propriedade `background-position` define a posição inicial da imagem de fundo.

- **Valores:**
  1. Coordenadas em pixels, porcentagem, palavras-chave como `top`, `bottom`, `center`, etc.

Exemplo:
```css
.elemento-com-imagem-posicionada {
    background-image: url('imagem.jpg');
    background-position: center top; /* Posiciona a imagem no centro superior do contêiner */
}
```

### Propriedade `background-attachment`

A propriedade `background-attachment` define se a imagem de fundo deve rolar com o restante do conteúdo ou permanecer fixa enquanto o conteúdo rola.

- **Valores:**
  1. **`scroll`**: A imagem rola junto com o conteúdo.
  2. **`fixed`**: A imagem permanece fixa enquanto o conteúdo rola.
  3. **`local`**: A imagem rola com o elemento contendo a imagem.

Exemplo:
```css
.elemento-com-imagem-fixada {
    background-image: url('ceu-estrelado.jpg');
    background-attachment: fixed; /* Fixa a imagem no fundo enquanto o conteúdo rola */
}
```

### Propriedade `background-origin`

A propriedade `background-origin` define a posição inicial da imagem de fundo em relação à borda do elemento.

- **Valores:**
  1. **`padding-box`**: A imagem inicia a partir da borda interna do elemento (levando em conta a borda e o preenchimento).
  2. **`border-box`**: A imagem inicia a partir da borda externa do elemento (levando em conta apenas a borda).
  3. **`content-box`**: A imagem inicia a partir da borda externa do conteúdo do elemento (ignorando a borda e o preenchimento).

Exemplo:
```css
.elemento-com-imagem-origem {
    background-image: url('textura-madeira.jpg');
    background-origin: content-box; /* A imagem inicia a partir da borda externa do conteúdo */
}
```

### Propriedade `background-clip`

A propriedade `background-clip` define a área de exibição da imagem de fundo em relação ao conteúdo e à borda do elemento.

- **Valores:**
  1. **`border-box`**: A imagem é exibida abaixo da borda.
  2. **`padding-box`**: A imagem é exibida abaixo do preenchimento.
  3. **`content-box`**: A imagem é exibida apenas no conteúdo.

Exemplo:
```css
.elemento-com-imagem-clipada {
    background-image: url('padrao-geometrico.png');
    background-clip: content-box; /* A imagem é exibida apenas no conteúdo do elemento */
}
```

### Mesclagem (`background-blend-mode`)

A propriedade `background-blend-mode` define como a imagem de fundo é mesclada com a cor de fundo do elemento.

- **Valores:**
  1. Modos de mesclagem, como `normal`, `multiply`, `screen`, `overlay`, etc.

Exemplo:
```css
.elemento-com-mesclagem {
    background-image: url('imagem-transparente.png');
    background-color: #ff0000; /* Cor de fundo */
    background-blend-mode: overlay; /* Mescla a imagem com a cor de fundo usando o modo overlay */
}
```

### Propriedade `background` de Forma Resumida

A propriedade `background` pode ser usada de forma resumida para definir várias propriedades de fundo em uma única linha.

- **Exemplo:**
```css
.elemento-com-background {
    background: #eaeaea url('padrao.png') center/cover no-repeat fixed content-box;
    /* Cor de fundo, imagem, posição, tamanho, repetição, fixação, origem e clip */
}
```

Essa propriedade resumida `background` permite definir várias características do fundo de uma vez, simplificando o código.