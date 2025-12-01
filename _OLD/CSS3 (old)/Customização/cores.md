Vamos explorar as propriedades CSS relacionadas a cores:

### Cores Pré-definidas

As cores pré-definidas são nomes de cores comuns, como `red`, `blue`, `green`, etc.

Exemplo:
```css
/* Usando cor pré-definida para o texto */
.texto-vermelho {
    color: red;
}
```

### RGB e RGBA

RGB representa a cor por meio de intensidades de vermelho, verde e azul. RGBA é semelhante, mas inclui um canal alfa para transparência.

Exemplo:
```css
/* Usando RGB para definir uma cor de fundo */
.fundo-verde {
    background-color: rgb(0, 128, 0); /* verde */
}

/* Usando RGBA para adicionar transparência ao fundo */
.fundo-azul-transparente {
    background-color: rgba(0, 0, 255, 0.5); /* azul com 50% de transparência */
}
```

### Hexadecimal

O sistema hexadecimal usa códigos hexadecimais para representar cores. Cada componente (vermelho, verde, azul) é representado por dois dígitos hexadecimais.

Exemplo:
```css
/* Usando código hexadecimal para definir a cor da borda */
.borda-roxa {
    border: 2px solid #800080; /* roxo */
}
```

### HSL e HSLA

HSL representa a cor por meio do matiz, saturação e luminosidade. HSLA é semelhante, mas inclui um canal alfa para transparência.

Exemplo:
```css
/* Usando HSL para definir a cor do texto */
.texto-azul-claro {
    color: hsl(210, 100%, 75%); /* azul claro */
}

/* Usando HSLA para adicionar transparência à cor do fundo */
.fundo-amarelo-transparente {
    background-color: hsla(60, 100%, 50%, 0.7); /* amarelo com 70% de transparência */
}
```

Essas propriedades proporcionam flexibilidade na escolha de cores, permitindo a representação de uma ampla gama de tons e a manipulação de transparência para criar efeitos visuais interessantes.