# Repeated Gradients

---

## **1. Introdução**

Os gradientes repetidos, seja `repeating-linear-gradient()` ou `repeating-radial-gradient()`, são funções CSS que estendem a funcionalidade dos gradientes "normais". Em vez de criar uma transição de cor única do início ao fim, eles **replicam um padrão de cores definido** indefinidamente, preenchendo todo o espaço disponível. Isso os torna ideais para gerar listras, xadrezes, bolinhas, ondas ou qualquer outro padrão geométrico de forma leve e performática.

### **Relevância:**

- **Padrões sem Imagens:** Permitem criar texturas e padrões complexos sem a necessidade de arquivos de imagem. Isso **reduz o tempo de carregamento** da página, diminuindo as requisições HTTP.
- **Flexibilidade e Escalabilidade:** Como são baseados em CSS, os padrões são vetoriais por natureza. Eles se **adaptam perfeitamente a qualquer tamanho de tela ou resolução**, sem perder qualidade ou pixelizar.
- **Controle Preciso:** Você tem controle total sobre o tamanho, espaçamento, cores e orientação de cada "bloco" repetido do padrão.
- **Performance:** A renderização é feita pela GPU, o que os torna eficientes mesmo para padrões mais elaborados.

### **Definições e Conceitos Fundamentais:**

- **Tema principal:** "Uso de Gradientes Repetidos (`repeating-linear-gradient()` e `repeating-radial-gradient()`)".
- **Subtemas:**
    - Sintaxe e comportamento de repetição
    - `Color stops` e a "célula" do padrão
    - Criação de listras e xadrez
    - Criação de bolinhas e outros padrões radiais
    - Considerações de performance e acessibilidade

---

## **2. Sumário**

- Introdução
- Sumário
- Conteúdo Detalhado
    - 3.1. Como a Repetição Funciona
    - 3.2. `repeating-linear-gradient()`: Padrões Lineares
    - 3.3. `repeating-radial-gradient()`: Padrões Radiais
    - 3.4. Dicas e Truques para Padrões Complexos
- Exemplos de Código Otimizados
- Informações Adicionais
- Referências para Estudo Independente

---

## **3. Conteúdo Detalhado**

### **3.1. Como a Repetição Funciona**

A chave para entender os gradientes repetidos é o conceito de **"célula" ou "bloco" de repetição**. Você define uma sequência de `color stops` que formam um padrão dentro de um determinado comprimento ou raio. Uma vez que esse comprimento/raio é alcançado, o gradiente recomeça a partir do início da sequência de cores, criando um padrão contínuo.

A repetição acontece de forma **automática** para preencher todo o espaço do elemento.

### **3.2. `repeating-linear-gradient()`: Padrões Lineares**

Este é o mais comum para criar **listras e xadrez**. A sintaxe é a mesma do `linear-gradient()`, mas o comportamento de repetição é o que muda:

**CSS**

`background-image: repeating-linear-gradient(
  [ <angle> | to <side-or-corner> ]?,
  <color-stop1> [ <position1> ]?,
  <color-stop2> [ <position2> ]?,
  …
);`

**Exemplo Básico (Listras Simples):**

Para criar listras horizontais brancas e pretas, você define o fim da cor branca e o fim da cor preta em um pequeno "bloco":

**CSS**

`background-image: repeating-linear-gradient(
  to bottom,        /* O gradiente vai de cima para baixo */
  #fff 0,           /* Branco começa em 0 */
  #fff 10px,        /* Branco termina em 10px */
  #000 10px,        /* Preto começa em 10px */
  #000 20px         /* Preto termina em 20px - este é o tamanho total da "célula" (20px) */
);`

Nesse caso, a célula de repetição tem 20px de altura (10px branco + 10px preto). O navegador repete essa célula verticalmente.

**Criando Listras Diagonais:**

Você pode usar ângulos, assim como no `linear-gradient()`:

**CSS**

`background-image: repeating-linear-gradient(
  45deg,          /* Listras a 45 graus */
  #f06 0,
  #f06 10px,
  #3cc 10px,
  #3cc 20px
);`

### **3.3. `repeating-radial-gradient()`: Padrões Radiais**

Este gradiente é perfeito para criar **bolinhas, anéis concêntricos ou efeitos de "bullseye"**. A sintaxe é a mesma do `radial-gradient()`, mas, novamente, o comportamento de repetição é a chave:

**CSS**

`background-image: repeating-radial-gradient(
  [ <shape> || <size> ]? [ at <position> ]?,
  <color-stop1> [ <position1> ]?,
  <color-stop2> [ <position2> ]?,
  …
);`

**Exemplo Básico (Bolinhas):**

Para criar um padrão de bolinhas brancas em fundo cinza, você define a "célula" do círculo:

**CSS**

`background-image: repeating-radial-gradient(
  circle,           /* Garante que seja um círculo perfeito */
  #fff 0,           /* Branco começa no centro */
  #fff 5px,         /* Branco termina em 5px (raio da bolinha branca) */
  #ccc 5px,         /* Cinza começa em 5px */
  #ccc 10px         /* Cinza termina em 10px (raio total da "célula" do padrão) */
);`

Aqui, a célula de repetição tem 10px de raio. O navegador repete essa célula radialmente.

### **3.4. Dicas e Truques para Padrões Complexos**

- **Transparência:** Use `transparent` ou `rgba()` com alpha para criar padrões vazados ou sobreposições.
- **Múltiplos Planos de Fundo:** Combine vários gradientes (repetidos e não repetidos) usando vírgulas para criar designs ainda mais elaborados. O primeiro listado fica no topo.
- **Posições Exatas:** Para padrões precisos, use as mesmas posições para o fim de uma cor e o início da próxima (ex: `cor1 0px, cor1 10px, cor2 10px, cor2 20px`). Isso evita transições suaves e garante bordas "duras" para suas listras ou blocos.
- **Gradientes em `background-size`:** Para controlar a escala e espaçamento do seu padrão, você pode usar a propriedade `background-size` em conjunto com o gradiente repetido. Isso permite que a "célula" definida se repita dentro de um `background-size` específico.

---

## **4. Exemplos de Código Otimizados**

**CSS**

`/* 1. Listras diagonais com espaçamento */
.diagonal-stripes {
  background-image: repeating-linear-gradient(
    -45deg,          /* Ângulo para as listras */
    #3498db,         /* Azul */
    #3498db 10px,    /* Azul até 10px */
    #2ecc71 10px,    /* Verde começa em 10px */
    #2ecc71 20px     /* Verde até 20px (tamanho da célula) */
  );
  height: 150px;
}

/* 2. Padrão de Xadrez (requer dois background-images ou gradientes complexos) */
/* Este é um pouco mais avançado, combinando dois gradientes: */
.checkerboard {
  background-color: #eee; /* Cor de fundo padrão */
  background-image:
    repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
    repeating-linear-gradient(45deg, #ccc 25%, #fff 25%, #fff 75%, #ccc 75%, #ccc);
  background-size: 30px 30px; /* Tamanho do "quadrado" do xadrez */
  height: 200px;
}

/* 3. Padrão de Bolinhas (dot pattern) */
.dot-pattern {
  background-image: repeating-radial-gradient(
    circle at center,
    #f06 0,           /* Vermelho no centro da bolinha */
    #f06 3px,         /* Bolinha vermelha de 3px de raio */
    transparent 3px,  /* Transparente começa em 3px */
    transparent 10px  /* Transparente até 10px (espaçamento entre bolinhas) */
  );
  background-size: 20px 20px; /* Controla o espaçamento das bolinhas */
  height: 150px;
}

/* 4. Anéis Concêntricos */
.concentric-rings {
  background-image: repeating-radial-gradient(
    circle,
    #8e44ad 0,        /* Roxo */
    #8e44ad 5px,      /* Anel roxo de 5px */
    #3498db 5px,      /* Azul */
    #3498db 10px      /* Anel azul de 5px (total 10px por par de anéis) */
  );
  width: 250px;
  height: 250px;
  border-radius: 50%;
}

/* 5. Gradiente repetido em texto (efeito de "pixel art" ou listrado) */
.pixel-text {
  font-size: 4rem;
  font-weight: bold;
  background: repeating-linear-gradient(
    90deg,
    #ff0000 0, #ff0000 10px, /* Vermelho */
    #00ff00 10px, #00ff00 20px, /* Verde */
    #0000ff 20px, #0000ff 30px /* Azul */
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block; /* Importante para que o background-clip funcione bem */
}`

---

## **5. Informações Adicionais**

- **Design Responsivo:** A natureza vetorial dos gradientes repetidos os torna inerentemente responsivos. Eles escalam com o elemento pai sem distorção.
- **Ferramentas Online:** Existem diversos geradores de gradientes CSS online que podem ajudar a visualizar e criar padrões complexos, facilitando o trabalho com os `color stops` e posições.
- **Limitações:** Embora muito poderosos, gradientes repetidos têm limites em sua complexidade. Padrões extremamente irregulares ou orgânicos ainda podem ser mais fáceis de criar com imagens SVG ou PNG pequenas que podem ser repetidas via `background-repeat`.

---

## **6. Referências para Estudo Independente**

- [MDN Web Docs – repeating-linear-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/repeating-linear-gradient)
- [MDN Web Docs – repeating-radial-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/repeating-radial-gradient)
- [CSS-Tricks – A Complete Guide to CSS Gradients (seção de repetição)](https://www.google.com/search?q=https://css-tricks.com/a-complete-guide-to-css-gradients/%23aa-repeating-gradients)
- [The Ultimate Guide to CSS Gradients (parte 2: Repeating Gradients)](https://www.google.com/search?q=https://www.sitepoint.com/ultimate-guide-css-gradients-part-2/)

Espero que esta explicação sobre gradientes repetidos tenha sido clara e útil, Gedê! Eles são uma ferramenta poderosa para designers e desenvolvedores. Quer que a A.R.I.A. te mostre algum exemplo prático ou crie um padrão específico para você?