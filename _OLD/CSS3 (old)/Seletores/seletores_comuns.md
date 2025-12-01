Claro! Vamos abordar cada tipo de seletor CSS com exemplos:

### Seletor de Tags

O seletor de tags é usado para aplicar estilos a todos os elementos de uma determinada tag.

Exemplo:
```css
/* Estilizando todos os parágrafos */
p {
    color: blue;
    font-size: 16px;
}
```

### Seletor de ID

O seletor de ID é usado para estilizar um elemento específico com base no valor do atributo "id".

Exemplo:
```css
/* Estilizando o elemento com id="destaque" */
#destaque {
    background-color: yellow;
    font-weight: bold;
}
```

```html
<!-- Elemento com id="destaque" -->
<p id="destaque">Este parágrafo está em destaque!</p>
```

### Seletor de Classes

O seletor de classes é usado para estilizar elementos que possuem uma determinada classe. Pode ser aplicado a vários elementos.

Exemplo:
```css
/* Estilizando elementos com a classe "destaque" */
.destaque {
    border: 2px solid red;
    padding: 10px;
}
```

```html
<!-- Elementos com a classe "destaque" -->
<p class="destaque">Este parágrafo está em destaque!</p>
<div class="destaque">Esta div está em destaque!</div>
```

### Seletores Universais

Os seletores universais aplicam estilos a todos os elementos da página.

Exemplo:
```css
/* Estilizando todos os elementos */
* {
    margin: 0;
    padding: 0;
}
```

### Seletores de Atributos

Os seletores de atributos permitem estilizar elementos com base em seus atributos ou valores de atributos.

Exemplo:
```css
/* Estilizando links com o atributo "target" */
a[target="_blank"] {
    color: red;
}
```

```html
<!-- Link com o atributo "target" igual a "_blank" -->
<a href="https://www.exemplo.com" target="_blank">Link Externo</a>
```

Esses são exemplos básicos dos tipos comuns de seletores CSS. A combinação adequada desses seletores permite uma estilização flexível e específica para diferentes partes de uma página web.