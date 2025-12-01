Vamos explorar as propriedades relacionadas às bordas (`border`) no CSS:

### Tamanho da Borda

A propriedade `border-width` define a largura da borda.

- **Valores:**
  1. **`thin`**: Fina
  2. **`medium`**: Média (valor padrão)
  3. **`thick`**: Espessa
  4. Valor numérico em unidades (por exemplo, `px`, `em`, `rem`)

Exemplo:
```css
/* Definindo diferentes tamanhos de borda */
.borda-fina {
    border-width: thin;
}

.borda-media {
    border-width: medium;
}

.borda-espessa {
    border-width: thick;
}

.borda-personalizada {
    border-width: 2px; /* Valor numérico em pixels */
}
```

### Estilo da Borda

A propriedade `border-style` define o estilo da borda.

- **Valores:**
  1. **`none`**: Sem borda
  2. **`solid`**: Borda sólida (valor padrão)
  3. **`dashed`**: Borda tracejada
  4. **`dotted`**: Borda pontilhada
  5. **`double`**: Borda dupla
  6. **`groove`**: Efeito entalhado
  7. **`ridge`**: Efeito elevado
  8. **`inset`**: Efeito entalhado interno
  9. **`outset`**: Efeito elevado externo

Exemplo:
```css
/* Definindo diferentes estilos de borda */
.borda-solida {
    border-style: solid;
}

.borda-tracejada {
    border-style: dashed;
}

.borda-dupla {
    border-style: double;
}
```

### Cor da Borda

A propriedade `border-color` define a cor da borda.

- **Valores:**
  1. Nome da cor (por exemplo, `red`, `blue`)
  2. Código hexadecimal (por exemplo, `#ff0000`)
  3. Código RGB (por exemplo, `rgb(255, 0, 0)`)

Exemplo:
```css
/* Definindo diferentes cores de borda */
.borda-vermelha {
    border-color: red;
}

.borda-azul {
    border-color: #0000ff;
}

.borda-verde {
    border-color: rgb(0, 128, 0);
}
```

### Propriedade `border`

A propriedade `border` combina `border-width`, `border-style` e `border-color` em uma única declaração.

Exemplo:
```css
/* Usando a propriedade border de modo geral */
.borda-completa {
    border: 2px dashed #ff6600; /* Largura, estilo e cor da borda */
}
```

### Arredondando os Cantos com a Propriedade `border-radius`

A propriedade `border-radius` define o raio dos cantos de um elemento.

- **Valores:**
  1. Valor único: Aplica a todos os cantos.
  2. Dois valores: O primeiro é para os cantos superiores, o segundo para os cantos inferiores.
  3. Quatro valores: Aplicados no sentido horário, começando pelos cantos superiores esquerdos.

Exemplo:
```css
/* Arredondando os cantos de uma caixa */
.cantos-arredondados {
    border-radius: 10px; /* Todos os cantos com raio de 10 pixels */
}

.cantos-arredondados-diferentes {
    border-radius: 20px 10px; /* Cantos superiores com raio de 20 pixels, cantos inferiores com raio de 10 pixels */
}

.cantos-arredondados-individuais {
    border-radius: 15px 10px 5px 20px; /* Cantos no sentido horário: superior esquerdo, superior direito, inferior direito, inferior esquerdo */
}
```

### Propriedade `border-image-source`

A propriedade `border-image-source` define a imagem a ser usada como borda.

Exemplo:
```css
/* Usando uma imagem como borda */
.borda-com-imagem {
    border-image-source: url('borda.png');
}
```

### Propriedade `border-image-slice`

A propriedade `border-image-slice` define como a imagem da borda deve ser dividida em regiões.

Exemplo:
```css
/* Dividindo a imagem de borda em regiões */
.borda-imagem-dividida {
    border-image-source: url('borda.png');
    border-image-slice: 30 fill; /* 30 pixels para a divisão, preenchendo as áreas não utilizadas */
}
```

### Propriedade `border-image-width`

A propriedade `border-image-width` define a largura da imagem da borda.

Exemplo:
```css
/* Definindo a largura da imagem da borda */
.borda-imagem-largura {
    border-image-source: url('borda.png');
    border-image-width: 10px; /* Largura da imagem da borda */
}
```

### Propriedade `border-image-repeat`

A propriedade `border-image-repeat` define como a imagem da borda deve ser repetida.

- **Valores:**
  1. **`stretch`**: Esticar para preencher a borda.
  2. **`repeat`**: Repetir a imagem.
  3. **`round`**: Repetir a imagem, mas ajustar o número de repetições para caber na borda inteira.

Exemplo:
```css
/* Configurando a repetição da imagem da borda */
.borda-imagem-repetida {
    border-image-source: url('borda.png');
    border-image-repeat: round; /* Repete a imagem ajustando o número de repetições */
}
```

### Propriedade `border-image-outset`

A propriedade `border-image-outset` define a largura da área fora da borda onde a imagem da borda será exibida.

Exemplo:
```css
/* Definindo a área de início da imagem da borda */
.borda-imagem-outset {
    border-image-source: url('borda.png');
    border-image-outset: 10px; /* Largura da área fora da borda */
}
```

Estas propriedades proporcionam uma ampla variedade de opções para estilizar bordas em elementos HTML, permitindo designs mais complexos e personalizados.