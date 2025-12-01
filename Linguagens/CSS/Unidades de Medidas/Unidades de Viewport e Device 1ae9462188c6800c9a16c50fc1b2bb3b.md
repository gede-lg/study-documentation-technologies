# Unidades de Viewport e Device

Este guia explora, de maneira aprofundada, as **unidades de viewport** e as emergentes **unidades de device-viewport**. Você encontrará uma explicação teórica detalhada, exemplos práticos e dicas de quando e como utilizar cada tipo para criar layouts responsivos, que se adaptam tanto à janela de visualização quanto às variações de interface nos dispositivos.

---

## 1. Introdução

No desenvolvimento web moderno, medir dimensões relativas à janela de visualização (viewport) é essencial para criar designs responsivos. As unidades tradicionais de viewport – **vw**, **vh**, **vmin** e **vmax** – facilitam a adaptação de elementos conforme o tamanho da janela do navegador. Entretanto, em dispositivos móveis e em cenários com barras de navegação e outros elementos de interface (chrome do navegador), essas unidades podem se comportar de maneira inesperada.

Para resolver essas limitações, foram propostas e implementadas as chamadas **unidades de device-viewport**. Essas novas unidades ajudam a definir dimensões com base no tamanho real do dispositivo, ignorando mudanças temporárias na interface do usuário.

---

## 2. Sumário

1. **Introdução**
2. **Unidades de Viewport Tradicionais**
    - `vw` (Viewport Width)
    - `vh` (Viewport Height)
    - `vmin` e `vmax`
3. **Unidades de Device-Viewport**
    - Conceito e Motivação
    - Novos identificadores: `dvw`, `dvh`, `dvmin`, `dvmax`*(e variantes experimentais como `svw`/`svh` e `lvw`/`lvh`, conforme suporte)*
4. **Exemplos Práticos e Comparações**
5. **Boas Práticas e Considerações Avançadas**
6. **Referências para Estudo**

---

## 3. Unidades de Viewport Tradicionais

### 3.1 `vw` (Viewport Width)

- **Descrição:**
1vw equivale a 1% da largura da viewport, isto é, da área de exibição do navegador.
- **Uso:**
Ideal para definir larguras de elementos que devem se ajustar dinamicamente à largura disponível.
- **Exemplo:**
    
    ```css
    .full-width {
      width: 100vw; /* 100% da largura da viewport */
    }
    
    ```
    

---

### 3.2 `vh` (Viewport Height)

- **Descrição:**
1vh equivale a 1% da altura da viewport.
- **Uso:**
Muito utilizado para definir alturas de seções ou elementos que precisam ocupar uma porcentagem da altura da tela.
- **Exemplo:**
    
    ```css
    .full-height {
      height: 100vh; /* 100% da altura da viewport */
    }
    
    ```
    

---

### 3.3 `vmin` e `vmax`

- **vmin:**
    - **Descrição:** 1vmin corresponde a 1% da menor dimensão da viewport (seja largura ou altura).
    - **Uso:** Útil quando o design deve manter proporções baseadas na menor dimensão disponível.
    - **Exemplo:**
        
        ```css
        .square {
          width: 50vmin;
          height: 50vmin;
        }
        
        ```
        
- **vmax:**
    - **Descrição:** 1vmax equivale a 1% da maior dimensão da viewport.
    - **Uso:** Pode ser aplicado para garantir que elementos se expandam com base na dimensão máxima da tela.
    - **Exemplo:**
        
        ```css
        .banner {
          font-size: 5vmax;
        }
        
        ```
        

> Observação:
> 
> 
> As unidades tradicionais de viewport são muito úteis, mas podem ser afetadas pela exibição ou ocultação dos elementos de interface do navegador – como barras de endereço e de ferramentas – principalmente em dispositivos móveis.
> 

---

## 4. Unidades de Device-Viewport

### 4.1 Conceito e Motivação

As **unidades de device-viewport** foram introduzidas para resolver as inconsistências causadas pela variação da área visível em dispositivos móveis.

- **Problema:** Em muitos navegadores, as unidades tradicionais (vw, vh) podem recalcular seu valor quando a interface do navegador (como a barra de endereço) aparece ou desaparece, alterando a dimensão visível.
- **Solução:** As novas unidades medem o tamanho **real** ou **dinâmico** do dispositivo, garantindo que o layout permaneça consistente, mesmo com mudanças temporárias na interface.

### 4.2 Novos Identificadores e Variantes

### 4.2.1 `dvw`, `dvh`, `dvmin` e `dvmax`

- **`dvw` (Device Viewport Width):**
Mede 1% da largura real do dispositivo, desconsiderando alterações provocadas por elementos de interface.
- **`dvh` (Device Viewport Height):**
Mede 1% da altura real do dispositivo, garantindo que o valor não mude com a aparição ou desaparecimento de UI.
- **`dvmin` e `dvmax`:**
Funcionam de forma similar a `vmin` e `vmax`, mas baseados nas dimensões reais do dispositivo.

> Exemplo:
> 
> 
> Imagine que um dispositivo móvel exiba uma barra de endereço que reduz a área visível. Usando `100vh` pode resultar em um valor menor do que o esperado quando a barra estiver oculta. Com `100dvh`, o elemento ocupará sempre 100% da altura real do dispositivo:
> 
> ```css
> .hero {
>   height: 100dvh; /* Garante que o elemento sempre ocupe toda a altura real do dispositivo */
> }
> 
> ```
> 

### 4.2.2 Variantes Experimentais: `svw`/`svh` e `lvw`/`lvh`

Algumas propostas e implementações experimentais dividem as medições da viewport em:

- **`svw` (Small Viewport Width) e `svh` (Small Viewport Height):**
Representam a menor dimensão disponível – por exemplo, quando os elementos de UI estão ativos.
- **`lvw` (Large Viewport Width) e `lvh` (Large Viewport Height):**
Representam a dimensão máxima possível, como quando a UI está minimizada.

> Nota:
> 
> 
> O suporte para essas variantes pode variar entre navegadores e estão em estágios experimentais, mas oferecem um controle mais refinado para cenários onde a interface do usuário é variável.
> 

---

## 5. Exemplos Práticos e Comparações

### Exemplo 1: Comparando `vh` vs. `dvh`

Imagine um layout em que você deseja que uma seção ocupe a altura total da tela. Em alguns dispositivos móveis, a barra de endereço pode interferir:

```css
/* Usando a unidade tradicional */
.section-tradicional {
  height: 100vh;
  background-color: #a0c4ff;
}

/* Usando a unidade device-viewport */
.section-device {
  height: 100dvh;
  background-color: #ffadad;
}

```

> Comentário:
> 
> - Em um dispositivo móvel, `.section-tradicional` pode ter uma altura menor quando a barra do navegador estiver visível, enquanto `.section-device` mantém sua altura com base na dimensão real do dispositivo, oferecendo maior consistência visual.

---

### Exemplo 2: Layout Flexível com `dvw` e `dvmin`

```css
.container {
  width: 90dvw; /* 90% da largura real do dispositivo */
  max-width: 90vmax; /* Limita a expansão baseada na maior dimensão da viewport tradicional */
  margin: 0 auto;
}

.card {
  padding: 2dvmin; /* Espaço proporcional à menor dimensão do device-viewport */
  border: 1px solid #333;
}

```

> Comentário:
> 
> 
> O uso de `dvw` e `dvmin` garante que os elementos se adaptem ao tamanho real do dispositivo, independentemente de como a interface do navegador altera a área visível.
> 

---

## 6. Boas Práticas e Considerações Avançadas

### 6.1 Quando Utilizar Cada Unidade

- **Unidades Tradicionais (vw, vh):**
Use-as quando as variações de UI não afetarem significativamente o layout ou em contextos desktop, onde a diferença entre viewport e device-viewport é mínima.
- **Unidades Device-Viewport (dvw, dvh, etc.):**
São ideais para aplicações móveis e para situações onde a consistência do layout precisa ser mantida independentemente de elementos flutuantes da interface.

### 6.2 Compatibilidade e Suporte

- **Verifique o Suporte do Navegador:**
As unidades device-viewport ainda estão em estágio experimental em alguns navegadores. Consulte a documentação e realize testes para garantir que seu público-alvo terá a experiência desejada.
- **Fallbacks:**
Considere definir estilos que utilizem as unidades tradicionais como fallback, para navegadores que não suportem as novas unidades.

### 6.3 Teste em Diferentes Cenários

- **Variações de UI:**
Teste seu layout com e sem elementos de interface ativos (barras de endereço, menus flutuantes, etc.) para assegurar que o design se mantenha consistente.
- **Responsividade Dinâmica:**
Combine as novas unidades com media queries e outras técnicas responsivas para criar experiências adaptáveis a diversos dispositivos e orientações.

---

## 7. Conclusão

As unidades de viewport tradicionais (`vw`, `vh`, `vmin`, `vmax`) já revolucionaram a maneira de criar layouts responsivos. No entanto, com as variações de interface e os desafios encontrados em dispositivos móveis, as novas **unidades de device-viewport** (como `dvw`, `dvh`, `dvmin`, `dvmax` e suas variantes experimentais) oferecem um controle mais preciso, medindo com base no tamanho real do dispositivo.

Dominar essas ferramentas permite que você crie interfaces que se comportam de forma consistente, independentemente das mudanças na UI, melhorando a experiência do usuário e a robustez do design.

---

## 8. Referências para Estudo

- **MDN Web Docs - CSS Values and Units:**[MDN - CSS Values and Units](https://developer.mozilla.org/pt-BR/docs/Learn/CSS/Building_blocks/Values_and_units)
- **Artigo sobre Viewport Units:**
Pesquise por "CSS viewport units" para aprofundar as diferenças entre as unidades tradicionais e as novas propostas.
- **CSS Values and Units Level 4 Draft:**
Consulte os rascunhos e propostas do CSS para entender as futuras implementações das unidades device-viewport.
- **Tutoriais e Vídeos:**
Plataformas como YouTube, freeCodeCamp e CSS-Tricks possuem conteúdos que demonstram o uso prático dessas unidades em projetos reais.

---

Este guia detalhado apresenta as principais características e diferenças entre as unidades de viewport e as emergentes unidades de device-viewport. Ao aplicar esses conceitos, você poderá desenvolver layouts modernos e responsivos que se ajustam com precisão às variações dos dispositivos e interfaces dos navegadores. Experimente combinar essas técnicas e ajuste os valores conforme a necessidade do seu projeto para obter a melhor experiência visual possível.