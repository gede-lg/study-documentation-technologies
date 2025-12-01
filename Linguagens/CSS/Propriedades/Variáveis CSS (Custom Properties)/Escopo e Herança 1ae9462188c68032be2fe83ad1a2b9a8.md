# Escopo e Herança

## 1. Introdução

As propriedades customizadas, popularmente conhecidas como variáveis CSS, são uma funcionalidade poderosa que permite armazenar e reutilizar valores em todo o seu CSS. Elas facilitam a manutenção e a consistência do design, permitindo que você defina cores, tamanhos, espaçamentos e outros valores uma única vez e os utilize em múltiplos lugares. Essa abordagem não só simplifica a atualização de estilos, mas também permite a criação de temas dinâmicos e layouts responsivos.

---

## 2. Escopo e Herança

### 2.1. Escopo das Variáveis

- **Definição de Escopo:**
    
    As variáveis CSS são definidas dentro de um seletor e são limitadas ao escopo desse seletor. O escopo pode ser global ou local, dependendo de onde a variável é declarada.
    
- **Variáveis Globais:**
    
    Declaradas geralmente no seletor `:root`, que representa o elemento raiz do documento (normalmente `<html>`).
    
    ```css
    :root {
      --primary-color: #3498db;
      --font-size-base: 16px;
    }
    
    ```
    
    *Explicação:*
    
    Variáveis definidas em `:root` estão disponíveis em todo o documento, garantindo consistência em todos os componentes.
    
- **Variáveis Locais:**
    
    Declaradas dentro de seletores específicos, e seu escopo é restrito ao elemento e seus descendentes.
    
    ```css
    .card {
      --card-padding: 20px;
      padding: var(--card-padding);
      background-color: var(--primary-color);
    }
    
    ```
    
    *Explicação:*
    
    A variável `--card-padding` só estará disponível dentro do elemento com a classe `.card` e de seus descendentes.
    

### 2.2. Herança das Variáveis

- **Herança Natural:**
    
    As variáveis CSS, por padrão, herdam seus valores dos elementos pai para seus descendentes, a menos que sejam sobrescritas. Isso significa que uma variável definida no elemento `:root` pode ser utilizada em qualquer lugar da página.
    
- **Sobrescrita (Overriding):**
    
    Você pode redefinir (ou sobrescrever) o valor de uma variável em um seletor específico para alterar seu valor dentro daquele contexto.
    
    ```css
    :root {
      --button-bg: #3498db;
    }
    
    .special-button {
      --button-bg: #e74c3c; /* Sobrescreve o valor global para este botão específico */
      background-color: var(--button-bg);
    }
    
    ```
    
    *Explicação:*
    
    Enquanto a maioria dos botões usará o valor `#3498db` definido em `:root`, o botão com a classe `.special-button` usará `#e74c3c` devido à sobrescrita da variável.
    

---

## 3. Overriding de Variáveis em Seletores Específicos

### 3.1. Mecanismo de Sobrescrita

- **Especificidade e Cascata:**
    
    A sobrescrita de variáveis segue as mesmas regras de cascata e especificidade do CSS. Variáveis definidas em seletores com maior especificidade ou que aparecem mais tarde na folha de estilo terão prioridade sobre variáveis com menor especificidade.
    
- **Exemplo Prático:**
    
    ```css
    :root {
      --font-color: #333;
    }
    
    .text {
      color: var(--font-color);
    }
    
    .highlight {
      --font-color: #e74c3c; /* Sobrescreve a variável para este elemento e seus descendentes */
    }
    
    ```
    
    ```html
    <p class="text">Texto padrão</p>
    <p class="text highlight">Texto com cor sobrescrita</p>
    
    ```
    
    *Explicação:*
    
    O primeiro parágrafo usará o valor `#333`, enquanto o segundo, com a classe adicional `.highlight`, usará `#e74c3c` devido à sobrescrita local.
    

### 3.2. Escopo Local vs. Global

- **Variáveis Globais:**
    
    São definidas em `:root` e estão disponíveis em todos os elementos, a menos que sejam sobrescritas.
    
- **Variáveis Locais:**
    
    Variáveis definidas dentro de um seletor afetam somente esse seletor e seus descendentes, permitindo personalizar o estilo em seções específicas da página.
    
    ```css
    :root {
      --padding: 16px;
    }
    
    .container {
      padding: var(--padding);
    }
    
    .container.special {
      --padding: 32px; /* Sobrescreve o valor para este contêiner específico */
      padding: var(--padding);
    }
    
    ```
    

---

## 4. Exemplos Avançados

### Exemplo 1: Tema Personalizado com Variáveis Globais e Locais

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --font-size: 16px;
}

body {
  font-size: var(--font-size);
  color: var(--primary-color);
}

.header {
  background-color: var(--primary-color);
  color: #fff;
  padding: 20px;
}

.article {
  padding: 20px;
  background-color: #f4f4f4;
}

/* Sobrescrevendo a cor para uma seção específica */
.article.featured {
  --primary-color: var(--secondary-color);
  border: 2px solid var(--primary-color);
}

.article.featured p {
  color: var(--primary-color);
}

```

*Explicação:*

- As variáveis globais definidas em `:root` garantem um tema consistente.
- A classe `.article.featured` sobrescreve a variável `-primary-color` para alterar o esquema de cores somente para essa seção, sem afetar outros elementos.

### Exemplo 2: Responsividade com Variáveis CSS

```css
:root {
  --margin: 20px;
}

.container {
  margin: var(--margin);
  padding: var(--margin);
  background-color: #ecf0f1;
}

/* Reduz a margem em telas menores */
@media (max-width: 600px) {
  :root {
    --margin: 10px;
  }
}

```

*Explicação:*

Ao definir a variável `--margin` globalmente e sobrescrevê-la dentro de uma media query, o layout se adapta automaticamente a diferentes larguras de tela, mantendo uma consistência visual.

---

## 5. Informações Adicionais

- **Cascata e Especificidade:**
    
    Assim como outras propriedades CSS, as variáveis seguem a ordem da cascata e as regras de especificidade, permitindo ajustes finos em diferentes níveis do documento.
    
- **Uso Dinâmico:**
    
    Variáveis CSS podem ser manipuladas dinamicamente com JavaScript para criar temas e layouts interativos, alterando o estilo do site em tempo real sem recarregar a página.
    
- **Manutenção e Escalabilidade:**
    
    Utilizar variáveis CSS melhora a manutenção do código, permitindo a atualização centralizada de valores como cores, tamanhos e espaçamentos em todo o projeto.
    

---

## 6. Referências para Estudo Independente

- **MDN Web Docs – CSS Custom Properties (Variáveis CSS):**[MDN CSS Custom Properties](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Using_CSS_custom_properties)
- **CSS-Tricks – A Complete Guide to Custom Properties:**[CSS-Tricks: Custom Properties](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- **W3Schools – CSS Variables:**[W3Schools CSS Variables](https://www.w3schools.com/css/css3_variables.asp)

---

## 7. Conclusão

As propriedades customizadas, ou variáveis CSS, oferecem uma maneira poderosa e flexível de definir e gerenciar valores que podem ser reutilizados em todo o seu código. Entender o escopo, a herança e a sobrescrita (overriding) de variáveis é essencial para criar temas consistentes, layouts responsivos e um código mais limpo e fácil de manter. Ao dominar essas técnicas, você poderá adaptar rapidamente o design de um site às mudanças e personalizar o visual de componentes específicos, melhorando significativamente a experiência do usuário. Explore as referências e exemplos fornecidos para aprofundar seu conhecimento e aplicar essas práticas de forma eficaz em seus projetos de CSS.