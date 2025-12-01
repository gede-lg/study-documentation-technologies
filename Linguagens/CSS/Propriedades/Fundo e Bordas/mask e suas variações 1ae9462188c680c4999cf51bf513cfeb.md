# mask e suas variações

As propriedades de **mask** em CSS permitem controlar a visibilidade de um elemento por meio de uma “máscara” que define quais partes do elemento são exibidas e quais são ocultadas. Essa técnica é muito poderosa para criar efeitos visuais sofisticados sem precisar editar imagens. Com o uso de máscaras, você pode gerar recortes complexos, aplicar gradientes de opacidade ou padrões que influenciam a aparência do elemento. A seguir, exploraremos em detalhes cada uma dessas propriedades, como elas funcionam, exemplos práticos e suas aplicações.

---

## 1. Conceito Geral de Masking

**Masking** permite que você controle a transparência de um elemento com base em outra imagem ou gradiente. Ao contrário de **clip-path** — que recorta o elemento para mostrar apenas uma determinada forma —, as máscaras determinam a opacidade de cada pixel do elemento.

- **Áreas opacas (ou com alta opacidade)** na máscara farão com que o conteúdo do elemento seja exibido normalmente.
- **Áreas transparentes (ou com baixa opacidade)** farão com que o conteúdo seja ocultado ou se torne parcialmente visível.

Essa abordagem oferece uma flexibilidade sem precedentes, permitindo criar efeitos como transições suaves, formas complexas e designs dinâmicos que se adaptam a diferentes contextos visuais.

---

## 2. Propriedades Principais de Mask

Cada propriedade relacionada à máscara controla um aspecto específico do comportamento da máscara. As principais são:

### 2.1. **mask-image**

- **O que é:**
    
    Define a imagem ou o gradiente que será usado como máscara. Essa imagem determina a distribuição da opacidade sobre o elemento alvo.
    
- **Sintaxe:**
    
    ```css
    selector {
      mask-image: <imagem ou gradiente>;
    }
    
    ```
    
- **Exemplos:**
    - Usando uma imagem:
        
        ```css
        .masked {
          mask-image: url('mask.png');
        }
        
        ```
        
    - Usando um gradiente:
        
        ```css
        .masked {
          mask-image: linear-gradient(to bottom, black, transparent);
        }
        
        ```
        
- **Detalhes Importantes:**
    - A máscara é aplicada de forma que os pixels pretos ou opacos (normalmente, valores mais próximos de 1 em um canal alfa) tornam o conteúdo completamente visível.
    - Pixels transparentes (ou com valores próximos de 0) ocultam o conteúdo.
    - Se a imagem de máscara não for encontrada ou não estiver definida, o elemento será renderizado sem máscara.

---

### 2.2. **mask-mode**

- **O que é:**
    
    Especifica como o navegador deve interpretar a imagem ou gradiente definido em **mask-image** para aplicar a máscara. Pode utilizar o canal alfa (transparência) ou a luminância (brilho).
    
- **Sintaxe:**
    
    ```css
    selector {
      mask-mode: <modo>;
    }
    
    ```
    
- **Valores Comuns:**
    - `alpha`: Usa o canal alfa da imagem como base para a máscara.
    - `luminance`: Utiliza os valores de luminosidade dos pixels da imagem.
- **Exemplo:**
    
    ```css
    .masked {
      mask-image: url('mask.png');
      mask-mode: alpha;
    }
    
    ```
    
- **Detalhes Importantes:**
    - A escolha entre `alpha` e `luminance` pode alterar significativamente o resultado visual.
    - `alpha` é o modo mais comum quando a imagem possui um canal alfa, enquanto `luminance` pode ser usado para imagens em escala de cinza.

---

### 2.3. **mask-size**

- **O que é:**
    
    Define o tamanho da máscara aplicada ao elemento, funcionando de forma similar à propriedade `background-size`. Essa propriedade determina como a imagem ou gradiente de máscara será dimensionado para se ajustar ao elemento alvo.
    
- **Sintaxe:**
    
    ```css
    selector {
      mask-size: <valor>;
    }
    
    ```
    
- **Exemplos de Valores:**
    - `cover`: A máscara cobre completamente o elemento, possivelmente cortando partes se as proporções não coincidirem.
    - `contain`: A máscara é dimensionada para ser totalmente visível dentro do elemento, sem corte.
    - Valores específicos:
        
        ```css
        mask-size: 100px 200px;
        mask-size: 50% 50%;
        
        ```
        
- **Exemplo:**
    
    ```css
    .masked {
      mask-image: url('mask.png');
      mask-size: cover;
    }
    
    ```
    
- **Detalhes Importantes:**
    - A escolha do valor pode impactar como os detalhes da máscara influenciam a visibilidade do elemento.
    - Usar valores relativos pode ajudar a manter a responsividade da máscara.

---

### 2.4. **mask-repeat**

- **O que é:**
    
    Determina se e como a máscara se repete no elemento, muito semelhante a `background-repeat` para imagens de fundo.
    
- **Sintaxe:**
    
    ```css
    selector {
      mask-repeat: <valor>;
    }
    
    ```
    
- **Valores Comuns:**
    - `no-repeat`: A máscara não se repete.
    - `repeat`: A máscara se repete tanto horizontal quanto verticalmente.
    - `repeat-x`: A máscara se repete horizontalmente.
    - `repeat-y`: A máscara se repete verticalmente.
- **Exemplo:**
    
    ```css
    .masked {
      mask-image: url('pattern.png');
      mask-repeat: repeat;
    }
    
    ```
    
- **Detalhes Importantes:**
    - Escolher a forma de repetição da máscara pode alterar o efeito visual, permitindo criar padrões contínuos ou aplicar uma máscara única em uma área.

---

### 2.5. **mask-position**

- **O que é:**
    
    Define a posição da máscara dentro do elemento, similar a `background-position`.
    
- **Sintaxe:**
    
    ```css
    selector {
      mask-position: <posição>;
    }
    
    ```
    
- **Exemplos de Valores:**
    - Palavras-chave: `center`, `top left`, `bottom right`, etc.
    - Valores específicos:
        
        ```css
        mask-position: 10px 20px;
        mask-position: 50% 50%;
        
        ```
        
- **Exemplo:**
    
    ```css
    .masked {
      mask-image: url('mask.png');
      mask-position: center;
    }
    
    ```
    
- **Detalhes Importantes:**
    - A propriedade permite alinhar a máscara dentro do elemento para que a parte mais relevante da máscara seja aplicada onde se deseja.
    - Funciona bem em conjunto com **mask-size** para obter o efeito desejado.

---

### 2.6. **mask-clip**

- **O que é:**
    
    Especifica a área do elemento à qual a máscara é aplicada. Essa propriedade controla até onde a máscara deve ser visível, determinando se ela se aplica à borda, ao padding ou ao conteúdo do elemento.
    
- **Sintaxe:**
    
    ```css
    selector {
      mask-clip: <valor>;
    }
    
    ```
    
- **Valores Comuns:**
    - `border-box`: A máscara é aplicada até a borda do elemento.
    - `padding-box`: A máscara é aplicada apenas até a área de padding.
    - `content-box`: A máscara é aplicada apenas ao conteúdo do elemento.
    - `margin-box`: (Menos comum, quando suportado) inclui também a margem.
- **Exemplo:**
    
    ```css
    .masked {
      mask-image: url('mask.png');
      mask-clip: padding-box;
    }
    
    ```
    
- **Detalhes Importantes:**
    - **mask-clip** é crucial para controlar o recorte da máscara e pode ser usado para criar efeitos onde a máscara não ultrapassa certos limites visuais do elemento.

---

### 2.7. **mask-origin**

- **O que é:**
    
    Define o ponto de referência para o posicionamento da máscara, similar a `background-origin` para imagens de fundo.
    
- **Sintaxe:**
    
    ```css
    selector {
      mask-origin: <valor>;
    }
    
    ```
    
- **Valores Comuns:**
    - `border-box`: A origem da máscara é a borda do elemento.
    - `padding-box`: A origem é o padding.
    - `content-box`: A origem é o conteúdo.
- **Exemplo:**
    
    ```css
    .masked {
      mask-image: url('mask.png');
      mask-origin: content-box;
    }
    
    ```
    
- **Detalhes Importantes:**
    - Ajustar a origem da máscara com **mask-origin** é fundamental para garantir que a máscara seja posicionada corretamente em relação aos diferentes modelos de caixa do elemento.

---

## 3. Exemplos Práticos

### Exemplo 1: Máscara com Imagem e Gradiente

```css
.masked-element {
  width: 300px;
  height: 200px;
  background: url('imagem.jpg') no-repeat center/cover;
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-clip: border-box;
  mask-origin: padding-box;
}

```

*Explicação:*

O elemento exibe a imagem de fundo, mas sua visibilidade é controlada por um gradiente que serve de máscara. O gradiente garante que a parte superior seja totalmente visível e a inferior gradualmente transparente, enquanto as propriedades de posição, tamanho, clip e origin garantem que a máscara se aplique da forma desejada.

---

### Exemplo 2: Máscara com Padrão Repetido

```css
.pattern-mask {
  width: 400px;
  height: 300px;
  background: url('foto.jpg') center/cover no-repeat;
  mask-image: url('pattern.png');
  mask-size: 50px 50px;
  mask-repeat: repeat;
  mask-position: top left;
}

```

*Explicação:*

Neste exemplo, um padrão definido em `pattern.png` é usado como máscara. A máscara se repete em toda a área do elemento, criando um efeito de textura ou recorte repetitivo, que pode ser usado para efeitos decorativos.

---

### Exemplo 3: Combinando Mask com Animações

```css
.animated-mask {
  width: 300px;
  height: 300px;
  background: url('imagem.jpg') center/cover no-repeat;
  mask-image: radial-gradient(circle, black 40%, transparent 80%);
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  mask-position: center;
  animation: maskMove 5s infinite alternate;
}

@keyframes maskMove {
  from {
    mask-position: center;
  }
  to {
    mask-position: top left;
  }
}

```

*Explicação:*

O elemento possui uma máscara baseada em um gradiente radial que se move de `center` a `top left` através de uma animação, criando um efeito dinâmico e interativo que pode ser usado para chamar a atenção para um conteúdo específico.

---

## 4. Informações Adicionais

- **Compatibilidade:**
    
    As propriedades de máscara são suportadas em navegadores modernos, mas a implementação pode variar entre eles. É importante testar os efeitos de máscara para garantir que funcionem conforme esperado em seu público-alvo.
    
- **Uso Responsivo:**
    
    Assim como outras propriedades de CSS, as propriedades de máscara podem ser ajustadas com media queries para adaptar os efeitos a diferentes tamanhos de tela.
    
- **Aplicações Criativas:**
    
    Máscaras podem ser utilizadas para criar efeitos de transição, revelação de conteúdo, designs artísticos e layouts que se destacam visualmente, sem a necessidade de manipulação de imagens externas.
    
- **Performance:**
    
    O uso intensivo de máscaras pode ter impacto na performance de renderização, especialmente em dispositivos menos potentes. Use com moderação e otimize os recursos (como o tamanho das imagens de máscara) para melhores resultados.
    

---

## 5. Referências para Estudo Independente

- **MDN Web Docs – CSS mask properties:**[MDN CSS mask](https://developer.mozilla.org/pt-BR/docs/Web/CSS/mask)
- **MDN Web Docs – Using CSS Masks:**[MDN Using CSS Masks](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_Masks)
- **W3Schools – CSS Mask:**[W3Schools CSS Mask](https://www.w3schools.com/css/css3_masks.asp)
- **Artigos e Tutoriais:**
    - [A Complete Guide to CSS Masks](https://css-tricks.com/a-complete-guide-to-css-masks/)
    - [Creating Dynamic Visuals with CSS Masks](https://www.smashingmagazine.com/2019/04/css-masks/)

---

## 6. Conclusão

As propriedades de **mask** e suas subpropriedades oferecem um conjunto avançado de ferramentas para controlar a visibilidade e a apresentação de elementos através de máscaras. Ao utilizar **mask-image**, **mask-mode**, **mask-size**, **mask-repeat**, **mask-position**, **mask-clip** e **mask-origin**, os desenvolvedores podem criar efeitos visuais sofisticados, dinâmicos e responsivos sem alterar o HTML. Essa abordagem permite recortes criativos, transições suaves e designs que se destacam, tornando as interfaces mais interativas e visualmente impressionantes. Dominar essas propriedades é essencial para quem deseja explorar as capacidades avançadas do CSS e criar experiências de usuário únicas. Explore os exemplos e referências indicadas para aprofundar seu conhecimento e aplicar essas técnicas de forma eficaz em seus projetos.