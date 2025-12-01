# Unidades de Medida no CSS

No CSS, existem diversas unidades de medida que podem ser utilizadas para definir propriedades como tamanho, comprimento, largura, etc.

#### Unidades de Medida Absolutas

As unidades absolutas são fixas e não dependem do contexto do elemento ou do dispositivo.

- **Pixels (px):** Uma unidade de medida de comprimento mais comum. Um pixel é uma unidade física de tela.

  ```css
  div {
      width: 200px;
      height: 150px;
  }
  ```

- **Polegadas (in), Centímetros (cm), Milímetros (mm):** Unidades baseadas em medidas físicas reais.

  ```css
  p {
      font-size: 0.5in;
      margin: 1cm;
  }
  ```

#### Pixels Físicos e Lógicos

- **Pixel Físico (px):** Corresponde ao tamanho físico de um pixel em um dispositivo de exibição.

  ```css
  p {
      font-size: 16px;
  }
  ```

- **Pixel Lógico (px):** Usado em telas de alta resolução (retina) onde um pixel lógico pode ser composto por vários pixels físicos.

  ```css
  img {
      width: 100px;
      height: 100px;
  }
  ```

### O que são Unidades de Medida Relativas?

Unidades de medida relativas são baseadas em características do próprio elemento ou do contexto de layout.

#### Porcentagem (%)

A unidade de porcentagem é usada em relação a outra quantidade, geralmente o pai do elemento.

```css
.container {
    width: 80%;
}

.child {
    width: 50%;
}
```

### Unidade de Medida em

A unidade `em` é relativa ao tamanho da fonte do elemento pai.

```css
body {
    font-size: 16px;
}

p {
    margin-bottom: 1em; /* 1em é igual a 16px neste caso */
}
```

### Unidade de Medida rem

A unidade `rem` é semelhante ao `em`, mas é relativa ao tamanho da fonte do elemento raiz (normalmente o `<html>`).

```css
html {
    font-size: 16px;
}

p {
    margin-bottom: 2rem; /* 2rem é igual a 32px neste caso */
}
```

### Diferença Entre rem e em

A principal diferença é que `em` é relativo ao tamanho da fonte do elemento pai, enquanto `rem` é relativo ao tamanho da fonte do elemento raiz.

```css
body {
    font-size: 16px;
}

.container {
    font-size: 1.5em; /* 1.5 vezes o tamanho da fonte do elemento pai (24px) */
}

.child {
    font-size: 1.5rem; /* 1.5 vezes o tamanho da fonte do elemento raiz (24px) */
}
```

### Viewports

Unidades relativas à largura e altura da janela de visualização.

- **vw (viewport width):** Relativo a 1% da largura da janela de visualização.

  ```css
  section {
      width: 50vw; /* 50% da largura da janela de visualização */
  }
  ```

- **vh (viewport height):** Relativo a 1% da altura da janela de visualização.

  ```css
  div {
      height: 80vh; /* 80% da altura da janela de visualização */
  }
  ```

### Unidade de Medida ex e ch

- **ex:** Relativo à altura da fonte do caractere 'x'.

  ```css
  p {
      line-height: 2ex; /* Dupla altura da fonte do caractere 'x' */
  }
  ```

- **ch:** Relativo à largura do caractere '0'.

  ```css
  code {
      width: 40ch; /* Largura equivalente a 40 caracteres '0' */
  }
  ```

### Calculando Valores com CSS

Você pode usar a função `calc()` para realizar cálculos com valores.

```css
.container {
    width: calc(50% - 20px); /* 50% da largura menos 20 pixels */
}
```

A função `calc()` permite a realização de operações matemáticas para definir valores de propriedades CSS, proporcionando maior flexibilidade no design.