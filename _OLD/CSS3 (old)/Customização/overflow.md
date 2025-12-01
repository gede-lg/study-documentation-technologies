### Propriedade `overflow`

A propriedade `overflow` controla como o conteúdo deve ser gerenciado quando excede as dimensões do elemento contenedor.

- **Valores:**
  1. **`visible`**: O conteúdo pode transbordar as bordas do contêiner. (Valor padrão)
  2. **`hidden`**: O conteúdo que transborda é cortado e não é exibido.
  3. **`scroll`**: Barras de rolagem são adicionadas se o conteúdo exceder as dimensões do contêiner.
  4. **`auto`**: As barras de rolagem são adicionadas somente se o conteúdo exceder as dimensões do contêiner.
  5. **`inherit`**: Herda o comportamento de overflow do elemento pai.

```css
/* Exemplo de uso da propriedade overflow */
.contenedor-com-overflow {
    width: 200px;
    height: 100px;
    overflow: scroll; /* Adiciona barras de rolagem se o conteúdo exceder as dimensões do contêiner */
}
```

A propriedade `overflow` é útil para controlar como o conteúdo é exibido, especialmente em elementos com dimensões fixas, onde o conteúdo pode ser maior do que o espaço disponível.