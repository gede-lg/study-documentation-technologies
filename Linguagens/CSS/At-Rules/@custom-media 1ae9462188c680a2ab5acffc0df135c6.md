# @custom-media

A at-rule **@custom-media** permite definir media queries personalizadas e reutilizáveis, centralizando condições específicas de mídia em um único lugar. Isso facilita a manutenção e a organização dos estilos responsivos, pois você pode reutilizar esses breakpoints ou condições ao longo de seu código CSS.

---

## 1. Introdução

No desenvolvimento de layouts responsivos, as media queries são fundamentais para adaptar os estilos a diferentes tamanhos e características de tela. No entanto, definir repetidamente as mesmas condições de mídia pode tornar o código redundante e difícil de manter. A at-rule **@custom-media** resolve esse problema ao permitir que você defina, uma vez, um conjunto de condições de mídia personalizadas que podem ser referenciadas posteriormente em seus blocos de media queries.

---

## 2. Quando e Por Que Usar @custom-media

- **Centralização de Breakpoints:**
    
    Defina breakpoints ou condições específicas uma única vez e reutilize-os, facilitando ajustes globais sem a necessidade de alterar múltiplas declarações.
    
- **Organização do Código:**
    
    Melhora a clareza e a manutenção do CSS, permitindo que os critérios de responsividade sejam gerenciados de forma modular.
    
- **Consistência:**
    
    Garante que os mesmos critérios de mídia sejam aplicados de forma consistente em todo o projeto, evitando discrepâncias entre diferentes partes do código.
    

---

## 3. Sintaxe e Exemplo

### Sintaxe Básica

A declaração de uma media query personalizada com **@custom-media** segue a sintaxe:

```css
@custom-media --nome-da-media (condição-de-mídia);

```

- **-nome-da-media:**
    
    Um identificador que você escolhe para referenciar essa condição personalizada. Deve começar com dois traços.
    
- **(condição-de-mídia):**
    
    A expressão de media query que define a condição desejada, como `(max-width: 600px)`.
    

### Exemplo Prático

```css
@custom-media --small-viewport (max-width: 600px);

/* Uso da media query personalizada */
@media (--small-viewport) {
  body {
    background-color: #f0f0f0;
    font-size: 14px;
  }
}

```

> Comentário:
> 
> 
> No exemplo, definimos `--small-viewport` como uma condição onde a largura máxima da tela é 600px. Em seguida, essa custom media query é utilizada dentro de `@media` para aplicar estilos específicos a dispositivos com telas pequenas.
> 

---

## 4. Exemplos Práticos e Aplicações

### Exemplo 1: Breakpoints para Diferentes Dispositivos

```css
@custom-media --mobile (max-width: 480px);
@custom-media --tablet (min-width: 481px) and (max-width: 768px);
@custom-media --desktop (min-width: 769px);

/* Estilos para dispositivos móveis */
@media (--mobile) {
  .container {
    padding: 10px;
  }
}

/* Estilos para tablets */
@media (--tablet) {
  .container {
    padding: 20px;
  }
}

/* Estilos para desktops */
@media (--desktop) {
  .container {
    padding: 30px;
  }
}

```

> Comentário:
> 
> 
> Esse exemplo ilustra como definir diferentes breakpoints para mobile, tablet e desktop usando **@custom-media**. Cada condição é referenciada nas media queries, garantindo uma abordagem consistente e de fácil manutenção para estilos responsivos.
> 

### Exemplo 2: Centralização de Condições Complexas

```css
@custom-media --landscape-and-wide (orientation: landscape) and (min-width: 1024px);

@media (--landscape-and-wide) {
  header {
    height: 80px;
  }
}

```

> Comentário:
> 
> 
> Aqui, a media query personalizada `--landscape-and-wide` combina duas condições: a orientação da tela deve ser paisagem e a largura mínima deve ser de 1024px. Essa combinação é aplicada para ajustar a altura do cabeçalho em dispositivos que atendem a esses critérios.
> 

---

## 5. Boas Práticas

- **Nomeação Significativa:**
    
    Escolha nomes claros e descritivos para suas media queries personalizadas, facilitando a leitura e manutenção do código.
    
- **Centralize as Definições:**
    
    Coloque as declarações de **@custom-media** no início do seu arquivo CSS ou em um arquivo separado dedicado à responsividade para manter a organização.
    
- **Consistência:**
    
    Utilize as mesmas media queries personalizadas em todo o projeto para garantir que as alterações sejam aplicadas de forma global, evitando discrepâncias.
    
- **Combinação com Variáveis CSS:**
    
    Você pode combinar **@custom-media** com variáveis CSS para tornar ainda mais flexível a configuração dos breakpoints.
    

---

## 6. Referências para Estudo

- **MDN Web Docs - @custom-media:**[MDN - @custom-media](https://developer.mozilla.org/pt-BR/docs/Web/CSS/@custom-media)
- **Artigos e Tutoriais:**
Pesquise por "CSS custom media queries" e "responsive design with @custom-media" para encontrar estudos de caso e exemplos avançados.
- **Comunidades de Desenvolvimento:**
Fóruns como Stack Overflow e blogs especializados em CSS podem fornecer insights adicionais sobre a implementação prática dessa at-rule.

---

## 7. Conclusão

A at-rule **@custom-media** é uma ferramenta poderosa para a criação de media queries personalizadas e reutilizáveis, permitindo centralizar as condições de responsividade em seu projeto. Ao adotar essa abordagem, você melhora a organização, a consistência e a facilidade de manutenção do seu CSS, tornando-o mais escalável e adaptável a mudanças. Explore os exemplos e boas práticas apresentados para integrar **@custom-media** de forma eficaz e otimizar seus layouts responsivos.