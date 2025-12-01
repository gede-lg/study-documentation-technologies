# object-position

## 1. Introdução

A propriedade **object-position** é utilizada em conjunto com a propriedade **object-fit** para definir a posição de um elemento substituto (como imagens, vídeos ou outros conteúdos embutidos) dentro do seu contêiner. Ela controla como o conteúdo é posicionado quando seu tamanho não corresponde exatamente às dimensões do contêiner, permitindo que você ajuste o alinhamento (por exemplo, centralizado, à esquerda, à direita ou em outras posições) sem distorcer o conteúdo.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **object-position** especifica a posição do conteúdo substituído dentro do contêiner quando **object-fit** é usado. Essa propriedade é particularmente útil para ajustar a parte da imagem ou vídeo que será exibida, principalmente quando o conteúdo é redimensionado ou cortado para se ajustar ao espaço disponível.
    
- **Importância:**
    - **Alinhamento Preciso:** Permite posicionar o conteúdo (ex.: imagem ou vídeo) de forma que a parte mais importante fique visível.
    - **Melhoria Estética:** Ajusta a exibição do conteúdo, mesmo quando as dimensões do contêiner e do conteúdo não são compatíveis.
    - **Responsividade:** Em layouts responsivos, possibilita o controle refinado do alinhamento do conteúdo substituto, melhorando a experiência visual em diferentes dispositivos.

---

## 3. Sintaxe e Valores

A sintaxe básica para **object-position** é:

```css
seletor {
  object-position: <valor>;
}

```

### Valores Comuns:

- **Valores de Alinhamento:**
    
    É comum especificar a posição usando valores como:
    
    - **percentuais:**
        
        ```css
        object-position: 50% 50%;
        
        ```
        
        Centraliza o conteúdo dentro do contêiner. O primeiro valor corresponde à posição horizontal (50% = centro) e o segundo à posição vertical (50% = centro).
        
    - **Palavras-chave:**
        
        ```css
        object-position: top left;
        object-position: bottom right;
        object-position: center;
        
        ```
        
        Permite o uso de palavras-chave como `top`, `right`, `bottom`, `left` e `center` para posicionar o conteúdo em pontos específicos do contêiner.
        
    - **Combinação de Unidades:**
        
        Você pode combinar unidades para maior controle, como pixels e percentuais:
        
        ```css
        object-position: 20px 30%;
        
        ```
        
        Nesse caso, o conteúdo é deslocado 20px da borda esquerda e 30% da altura do contêiner a partir do topo.
        
- **Uso com object-fit:**
    
    **object-position** funciona em conjunto com **object-fit**. Por exemplo, quando **object-fit** é definido como `cover`, a imagem pode ser cortada para preencher o contêiner; **object-position** especifica qual parte da imagem será priorizada para a exibição.
    

---

## 4. Exemplos de Código Otimizados

### Exemplo 1: Centralizando o Conteúdo

```css
.image-center {
  width: 300px;
  height: 200px;
  object-fit: cover;
  object-position: 50% 50%; /* Centraliza a imagem dentro do contêiner */
  border: 1px solid #ccc;
}

```

```html
<img src="exemplo.jpg" alt="Exemplo de imagem centralizada" class="image-center">

```

*Explicação:*

A imagem é redimensionada para preencher o contêiner (usando `object-fit: cover;`) e é centralizada tanto horizontalmente quanto verticalmente graças a `object-position: 50% 50%;`.

---

### Exemplo 2: Alinhamento à Esquerda e no Topo

```css
.image-top-left {
  width: 300px;
  height: 200px;
  object-fit: cover;
  object-position: top left; /* Alinha a imagem ao topo e à esquerda */
  border: 1px solid #ccc;
}

```

```html
<img src="exemplo.jpg" alt="Exemplo de imagem alinhada ao topo esquerdo" class="image-top-left">

```

*Explicação:*

A imagem será posicionada de forma que sua parte superior esquerda seja exibida no contêiner, útil quando essa região contém a informação mais importante.

---

### Exemplo 3: Uso de Valores Mistos com Unidades

```css
.image-custom {
  width: 300px;
  height: 200px;
  object-fit: cover;
  object-position: 20px 30%; /* 20px a partir da esquerda e 30% a partir do topo */
  border: 1px solid #ccc;
}

```

```html
<img src="exemplo.jpg" alt="Imagem com posicionamento customizado" class="image-custom">

```

*Explicação:*

Este exemplo demonstra como utilizar valores combinados (pixels e percentuais) para posicionar o conteúdo de forma personalizada dentro do contêiner.

---

## 5. Informações Adicionais

- **Integração com object-fit:**
    
    O efeito de **object-position** é mais evidente quando combinado com **object-fit**, pois este último determina como o conteúdo é redimensionado ou cortado, e **object-position** indica qual parte do conteúdo é focalizada.
    
- **Aplicações Comuns:**
    - Galerias de imagens.
    - Vídeos embutidos.
    - Elementos decorativos ou ícones que precisam se ajustar ao contêiner.
- **Responsividade:**
    
    Valores em porcentagem ajudam a manter o alinhamento proporcional ao contêiner, sendo ideais para layouts responsivos.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS object-position:**[MDN CSS object-position](https://developer.mozilla.org/pt-BR/docs/Web/CSS/object-position)
- **W3Schools – CSS object-position:**[W3Schools CSS object-position](https://www.w3schools.com/cssref/css3_pr_object-position.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to object-fit and object-position](https://css-tricks.com/almanac/properties/o/object-fit/)
    - [Responsive Images with object-fit and object-position](https://www.smashingmagazine.com/2017/06/responsive-images-object-fit/)

---

## 7. Conclusão

A propriedade **object-position** é fundamental para definir como o conteúdo substituto (como imagens e vídeos) é posicionado dentro de seu contêiner, especialmente quando combinado com **object-fit**. Ao utilizar valores percentuais, palavras-chave ou uma combinação de unidades, os desenvolvedores podem garantir que a parte mais importante do conteúdo seja exibida, criando layouts visuais atraentes e responsivos. Dominar **object-position** permite um controle refinado sobre a apresentação dos elementos, contribuindo para uma melhor experiência do usuário. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.