# perspective-origin

## 1. Introdução

A propriedade **perspective-origin** define o ponto de origem para a aplicação da perspectiva em elementos 3D. Enquanto a propriedade **perspective** especifica a distância entre o elemento e o "observador" (ou a "câmera" virtual), o **perspective-origin** determina o ponto focal no elemento, ou seja, a posição a partir da qual a perspectiva é aplicada. Esse controle refinado é essencial para criar efeitos 3D realistas e dinâmicos, influenciando como as transformações 3D dos elementos filhos são visualizadas.

---

## 2. Conceitos Fundamentais

- **Definição:**
    
    **perspective-origin** especifica o ponto de referência no plano 2D a partir do qual a perspectiva é aplicada aos elementos transformados em 3D. Ele funciona de maneira similar à propriedade **transform-origin**, mas é usado no contexto da perspectiva.
    
- **Importância:**
    - **Controle da Profundidade:** Ajusta como a distância e a profundidade são percebidas em uma cena 3D.
    - **Ponto Focal:** Permite definir qual parte do contêiner 3D parece estar mais próxima do observador.
    - **Efeito Visual:** Altera a forma como os elementos filhos (que usam transformações 3D) se comportam em relação à perspectiva definida pelo contêiner.

---

## 3. Sintaxe e Estrutura

A sintaxe básica para a propriedade **perspective-origin** é:

```css
seletor {
    perspective-origin: valorX valorY;
}

```

- **valorX:** Define a posição horizontal do ponto de origem. Pode ser:
    - Percentual (ex.: `50%` para o centro, `0%` para a esquerda, `100%` para a direita)
    - Palavras-chave: `left`, `center`, `right`
    - Valores com unidade (ex.: `100px`)
- **valorY:** Define a posição vertical do ponto de origem. Pode ser:
    - Percentual (ex.: `50%` para o centro, `0%` para o topo, `100%` para a parte inferior)
    - Palavras-chave: `top`, `center`, `bottom`
    - Valores com unidade (ex.: `50px`)

**Exemplos:**

- Ponto central padrão:
    
    ```css
    .cena {
        perspective-origin: 50% 50%;
    }
    
    ```
    
- Ponto focal no canto superior esquerdo:
    
    ```css
    .cena {
        perspective-origin: left top;
    }
    
    ```
    
- Ponto personalizado com valores em pixels:
    
    ```css
    .cena {
        perspective-origin: 100px 50px;
    }
    
    ```
    

---

## 4. Funcionamento e Impacto Visual

### 4.1. Relação com a Propriedade **perspective**

- **perspective:** Define a distância da "câmera" virtual do contêiner, afetando a intensidade do efeito 3D.
- **perspective-origin:** Define o ponto focal, ou seja, o local no contêiner onde a perspectiva parece se concentrar.
Juntas, essas propriedades moldam como os elementos filhos com transformações 3D são percebidos:
    - Um **perspective-origin** central (`50% 50%`) cria uma sensação de simetria, onde o centro do contêiner é o ponto de convergência.
    - Alterar o **perspective-origin** para `left top` ou `right bottom` pode fazer com que a parte correspondente do contêiner pareça mais próxima ou mais distante, modificando dramaticamente a percepção de profundidade.

### 4.2. Efeito Visual em Transformações 3D

Quando aplicadas transformações 3D, como `rotateY`, `translateZ` ou `rotateX`, a posição definida por **perspective-origin** determina como o movimento e a rotação são percebidos:

- **Exemplo de Rotação 3D:**
    
    Se um elemento gira em torno do eixo Y, o ponto definido por **perspective-origin** afetará se o elemento parece girar em torno do seu centro ou se inclina de maneira diferente.
    
- **Ajuste Fino de Cenas 3D:**
    
    Em animações e transformações complexas, modificar o **perspective-origin** pode criar efeitos visuais sutis, como a sensação de que uma cena 3D está "inclinada" ou que o observador está olhando de um ângulo diferente.
    

---

## 5. Exemplos de Código Otimizados

### Exemplo 1: Ponto de Origem Central

```css
.cena {
    perspective: 800px;          /* Define a distância da câmera virtual */
    perspective-origin: 50% 50%;  /* Ponto central: padrão */
}

.elemento-3d {
    width: 150px;
    height: 150px;
    background-color: #3498db;
    transform: rotateY(45deg);
    transition: transform 0.5s ease;
}

```

```html
<div class="cena">
    <div class="elemento-3d">
        Elemento com efeito 3D
    </div>
</div>

```

### Exemplo 2: Ponto de Origem no Canto Superior Esquerdo

```css
.cena {
    perspective: 800px;
    perspective-origin: left top;  /* Ponto focal no canto superior esquerdo */
}

.elemento-3d {
    width: 150px;
    height: 150px;
    background-color: #e74c3c;
    transform: rotateY(45deg);
    transition: transform 0.5s ease;
}

```

```html
<div class="cena">
    <div class="elemento-3d">
        Elemento com ponto de origem no canto superior esquerdo
    </div>
</div>

```

### Exemplo 3: Personalizando com Valores em Pixels

```css
.cena {
    perspective: 1000px;
    perspective-origin: 100px 200px; /* Ponto específico definido em pixels */
}

.elemento-3d {
    width: 200px;
    height: 200px;
    background-color: #2ecc71;
    transform: rotateX(30deg) rotateY(30deg);
    transition: transform 0.7s ease;
}

```

```html
<div class="cena">
    <div class="elemento-3d">
        Exemplo com valores personalizados em pixels
    </div>
</div>

```

---

## 6. Informações Adicionais

- **Valores Percentuais vs. Valores Absolutos:**
    - Percentuais (`50% 50%`) são relativos às dimensões do elemento, proporcionando um comportamento responsivo.
    - Valores com unidades absolutas (como pixels) fornecem um ponto fixo, útil quando o layout tem dimensões definidas.
- **Interação com Outras Propriedades 3D:**
    
    **perspective-origin** funciona em conjunto com **perspective** e **transform** para criar efeitos tridimensionais completos. Ao ajustar essas propriedades de forma combinada, você pode controlar com precisão como os elementos 3D são percebidos.
    
- **Aplicações Práticas:**
    - Animações 3D: Alterar o ponto de origem pode fazer com que um elemento gire de maneira mais realista.
    - Efeitos de Parallax: Pode ser utilizado para definir a profundidade em cenas onde múltiplos elementos se movem em diferentes velocidades.
    - Interfaces Imersivas: Essencial para criar experiências visuais que dependam de uma percepção tridimensional.

---

## 7. Referências para Estudo Independente

- **MDN Web Docs – CSS perspective-origin:**[MDN CSS perspective-origin](https://developer.mozilla.org/pt-BR/docs/Web/CSS/perspective-origin)
- **W3Schools – CSS 3D Transforms:**[W3Schools CSS 3D Transforms](https://www.w3schools.com/css/css3_3dtransforms.asp) *(inclui informações sobre perspective e perspective-origin)*
- **Artigos e Tutoriais:**
    - [CSS-Tricks: Understanding Transform Origins](https://css-tricks.com/almanac/properties/t/transform-origin/)
    - [A Complete Guide to CSS 3D Transforms](https://css-tricks.com/3d-transforms/)

---

## 8. Conclusão

A propriedade **perspective-origin** é crucial para definir o ponto de referência da perspectiva em cenas 3D, determinando como os elementos filhos transformados em 3D serão visualizados. Ao ajustar esse ponto, você pode alterar dramaticamente a percepção de profundidade e o efeito de transformações 3D, proporcionando uma experiência visual mais rica e interativa. Dominar **perspective-origin**, em conjunto com **perspective** e **transform**, permite a criação de interfaces modernas e imersivas, onde o controle sobre o ponto focal da cena é fundamental. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos de CSS.