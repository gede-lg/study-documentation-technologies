# Grade Curricular Completa para CSS

# Grade Curricular Completa para Aprender CSS

*Baseada na documentação oficial e especificações mais recentes*

## 1. FUNDAMENTOS DA LINGUAGEM CSS

### 1.1 Conceitos Base

- O que é CSS e sua função no desenvolvimento web
- Sintaxe fundamental: seletores, propriedades e valores
- Comentários e organização do código
- Cascata, herança e especificidade
- Box model conceitual

### 1.2 Formas de Implementação

- CSS inline (atributo style)
- CSS interno (tag `<style>`)
- CSS externo (arquivos .css)
- CSS em JavaScript (CSS-in-JS)

### 1.3 Estrutura e Organização

- Anatomia de uma regra CSS
- Agrupamento de seletores
- Aninhamento conceitual
- Metodologias de organização (BEM, OOCSS, SMACSS)
- Arquitetura de CSS escalável

## 2. SELETORES CSS

### 2.1 Tipos Fundamentais de Seletores

### Seletores Básicos

- Seletor universal ()
- Seletor de tipo/elemento (`div`, `p`, `h1`)
- Seletor de classe (`.classe`)
- Seletor de ID (`#id`)
- Seletor de atributo (`[atributo]`, `[atributo="valor"]`)

### Seletores Combinadores

- Seletor descendente (espaço)
- Seletor filho direto (`>`)
- Seletor irmão adjacente (`+`)
- Seletor irmão geral (`~`)

### Seletores de Atributo Avançados

- Prefixo (`[attr^="valor"]`)
- Sufixo (`[attr$="valor"]`)
- Contém (`[attr*="valor"]`)
- Lista de palavras (`[attr~="valor"]`)
- Prefixo de idioma (`[attr|="valor"]`)
- Case insensitive (`[attr="valor" i]`)

### 2.2 Pseudo-classes por Finalidade

### Estados de Interação

- `:hover` - hover do mouse
- `:active` - elemento ativo
- `:focus` - foco do teclado
- `:focus-visible` - foco visível
- `:focus-within` - contém foco
- `:target` - elemento alvo

### Estados de Formulário

- `:checked` - checkbox/radio marcado
- `:disabled` - elemento desabilitado
- `:enabled` - elemento habilitado
- `:required` - campo obrigatório
- `:optional` - campo opcional
- `:valid` - validação válida
- `:invalid` - validação inválida
- `:in-range` - valor dentro do range
- `:out-of-range` - valor fora do range
- `:read-only` - somente leitura
- `:read-write` - leitura e escrita
- `:placeholder-shown` - placeholder visível
- `:default` - elemento padrão
- `:indeterminate` - estado indeterminado

### Seleção Estrutural - Posição

- `:first-child` - primeiro filho
- `:last-child` - último filho
- `:only-child` - filho único
- `:first-of-type` - primeiro do tipo
- `:last-of-type` - último do tipo
- `:only-of-type` - único do tipo

### Seleção Estrutural - Numeração

- `:nth-child()` - enésimo filho
- `:nth-last-child()` - enésimo filho do fim
- `:nth-of-type()` - enésimo do tipo
- `:nth-last-of-type()` - enésimo do tipo do fim

### Estados de Documento

- `:root` - elemento raiz
- `:empty` - elemento vazio
- `:not()` - negação

### Estados de Link

- `:link` - link não visitado
- `:visited` - link visitado
- `:any-link` - qualquer link

### Estados Direcionais

- `:dir()` - direção do texto
- `:lang()` - idioma específico

### Estados Experimentais

- `:is()` - lista de seletores
- `:where()` - lista sem especificidade
- `:has()` - contém seletor

### 2.3 Pseudo-elementos por Finalidade

### Geração de Conteúdo

- `::before` - antes do conteúdo
- `::after` - depois do conteúdo
- `::marker` - marcador de lista

### Seleção de Texto

- `::first-letter` - primeira letra
- `::first-line` - primeira linha
- `::selection` - texto selecionado

### Elementos de Formulário

- `::placeholder` - texto placeholder
- `::file-selector-button` - botão de seleção de arquivo

### Elementos Web

- `::backdrop` - fundo de modal
- `::cue` - legendas de vídeo

### Elementos Experimentais

- `::part()` - partes de Web Components
- `::slotted()` - elementos em slots

## 3. PROPRIEDADES CSS (MODELO DETALHADO)

### 3.1 Box Model e Dimensionamento (14 propriedades)

### Dimensões Básicas

- `width` - largura do elemento
- `height` - altura do elemento
- `min-width` - largura mínima
- `max-width` - largura máxima
- `min-height` - altura mínima
- `max-height` - altura máxima

### Dimensões Lógicas (Internacionalização)

- `block-size` - tamanho no eixo block
- `inline-size` - tamanho no eixo inline
- `min-block-size` - tamanho mínimo block
- `max-block-size` - tamanho máximo block
- `min-inline-size` - tamanho mínimo inline
- `max-inline-size` - tamanho máximo inline

### Controle do Box Model

- `box-sizing` - modelo de cálculo de tamanho
- `aspect-ratio` - proporção largura/altura

### 3.2 Margin - Espaçamento Externo (12 propriedades)

### Margin Clássico

- `margin` - shorthand para todas as direções
- `margin-top` - margem superior
- `margin-right` - margem direita
- `margin-bottom` - margem inferior
- `margin-left` - margem esquerda

### Margin Lógico (Internacionalização)

- `margin-block` - shorthand para block start/end
- `margin-block-start` - margem início do block
- `margin-block-end` - margem fim do block
- `margin-inline` - shorthand para inline start/end
- `margin-inline-start` - margem início do inline
- `margin-inline-end` - margem fim do inline

### Margin Avançado

- `margin-trim` - aparar margens em containers

### 3.3 Padding - Espaçamento Interno (11 propriedades)

### Padding Clássico

- `padding` - shorthand para todas as direções
- `padding-top` - preenchimento superior
- `padding-right` - preenchimento direito
- `padding-bottom` - preenchimento inferior
- `padding-left` - preenchimento esquerdo

### Padding Lógico (Internacionalização)

- `padding-block` - shorthand para block start/end
- `padding-block-start` - preenchimento início do block
- `padding-block-end` - preenchimento fim do block
- `padding-inline` - shorthand para inline start/end
- `padding-inline-start` - preenchimento início do inline
- `padding-inline-end` - preenchimento fim do inline

### 3.4 Posicionamento (14 propriedades)

### Position Base

- `position` - tipo de posicionamento
- `z-index` - ordem de empilhamento

### Posicionamento Clássico

- `top` - distância do topo
- `right` - distância da direita
- `bottom` - distância de baixo
- `left` - distância da esquerda

### Posicionamento Lógico

- `inset` - shorthand para todas as direções
- `inset-block` - shorthand para block start/end
- `inset-block-start` - posição início do block
- `inset-block-end` - posição fim do block
- `inset-inline` - shorthand para inline start/end
- `inset-inline-start` - posição início do inline
- `inset-inline-end` - posição fim do inline

### Float e Clear

- `float` - flutuação do elemento
- `clear` - limpeza de float

### 3.5 Anchor Positioning (8 propriedades)

### Anchor Base

- `anchor-name` - nome do âncora
- `anchor-scope` - escopo do âncora
- `position-anchor` - âncora de referência

### Anchor Positioning

- `position-area` - área de posicionamento
- `position-try` - tentativa de posicionamento
- `position-try-fallbacks` - fallbacks de posicionamento
- `position-try-order` - ordem das tentativas
- `position-visibility` - visibilidade baseada em posição

### 3.6 Display e Visibilidade (4 propriedades)

- `display` - tipo de renderização
- `visibility` - visibilidade do elemento
- `opacity` - transparência
- `content-visibility` - visibilidade do conteúdo para performance

### 3.7 Flexbox (15 propriedades)

### Container Flexbox - Direção e Quebra

- `flex-direction` - direção dos itens
- `flex-wrap` - quebra de linha
- `flex-flow` - shorthand para direction e wrap

### Container Flexbox - Alinhamento

- `justify-content` - alinhamento no eixo principal
- `align-items` - alinhamento no eixo cruzado
- `align-content` - alinhamento das linhas

### Item Flexbox - Flexibilidade

- `flex` - shorthand para grow, shrink e basis
- `flex-grow` - crescimento proporcional
- `flex-shrink` - encolhimento proporcional
- `flex-basis` - tamanho base

### Item Flexbox - Posicionamento

- `align-self` - alinhamento individual
- `order` - ordem de exibição

### Espaçamento Flexbox

- `gap` - espaçamento entre itens
- `row-gap` - espaçamento entre linhas
- `column-gap` - espaçamento entre colunas

### 3.8 CSS Grid (20 propriedades)

### Container Grid - Template

- `grid` - shorthand principal do grid
- `grid-template` - shorthand para rows, columns e areas
- `grid-template-rows` - definição das linhas
- `grid-template-columns` - definição das colunas
- `grid-template-areas` - áreas nomeadas

### Container Grid - Auto

- `grid-auto-rows` - tamanho automático das linhas
- `grid-auto-columns` - tamanho automático das colunas
- `grid-auto-flow` - fluxo automático dos itens

### Container Grid - Alinhamento

- `justify-items` - alinhamento horizontal dos itens
- `place-items` - shorthand para justify e align items
- `place-content` - shorthand para justify e align content

### Item Grid - Posicionamento

- `grid-area` - shorthand para row e column
- `grid-row` - shorthand para row start e end
- `grid-row-start` - início da linha
- `grid-row-end` - fim da linha
- `grid-column` - shorthand para column start e end
- `grid-column-start` - início da coluna
- `grid-column-end` - fim da coluna

### Item Grid - Alinhamento Individual

- `justify-self` - alinhamento horizontal individual
- `place-self` - shorthand para justify e align self

### 3.9 Tipografia - Fonte (28 propriedades)

### Font Base

- `font` - shorthand principal da fonte
- `font-family` - família tipográfica
- `font-size` - tamanho da fonte
- `font-weight` - peso da fonte
- `font-style` - estilo da fonte
- `font-stretch` - estiramento da fonte

### Font Variações

- `font-variant` - variações da fonte
- `font-variant-caps` - maiúsculas especiais
- `font-variant-numeric` - numerais especiais
- `font-variant-ligatures` - ligaduras tipográficas
- `font-variant-alternates` - caracteres alternativos
- `font-variant-east-asian` - variações asiáticas
- `font-variant-emoji` - variações de emoji
- `font-variant-position` - posição dos caracteres

### Font Avançadas

- `font-optical-sizing` - ajuste ótico automático
- `font-feature-settings` - recursos OpenType
- `font-variation-settings` - eixos de fontes variáveis
- `font-synthesis` - síntese de estilos
- `font-synthesis-weight` - síntese de peso
- `font-synthesis-style` - síntese de estilo
- `font-synthesis-small-caps` - síntese de small caps
- `font-synthesis-position` - síntese de posição
- `font-kerning` - kerning automático
- `font-size-adjust` - ajuste de tamanho x-height
- `font-language-override` - idioma específico
- `font-palette` - paleta de cores da fonte
- `font-display` - comportamento de carregamento

### 3.10 Tipografia - Texto (37 propriedades)

### Text Base

- `color` - cor do texto
- `text-align` - alinhamento horizontal
- `text-align-last` - alinhamento da última linha
- `text-indent` - indentação da primeira linha
- `text-transform` - transformação de case
- `text-shadow` - sombra do texto
- `text-overflow` - comportamento do overflow
- `text-justify` - justificação do texto

### Text Decoration

- `text-decoration` - shorthand para decoração
- `text-decoration-line` - tipo de linha
- `text-decoration-color` - cor da decoração
- `text-decoration-style` - estilo da linha
- `text-decoration-thickness` - espessura da linha
- `text-decoration-skip` - pular elementos
- `text-decoration-skip-ink` - pular tinta dos descendentes
- `text-underline-offset` - offset do sublinhado
- `text-underline-position` - posição do sublinhado

### Text Wrapping

- `text-wrap` - comportamento de quebra
- `text-wrap-mode` - modo de quebra
- `text-wrap-style` - estilo de quebra

### Text Oriental

- `text-orientation` - orientação do texto
- `text-combine-upright` - combinação vertical

### Text Emphasis

- `text-emphasis` - shorthand para ênfase
- `text-emphasis-color` - cor da ênfase
- `text-emphasis-style` - estilo da ênfase
- `text-emphasis-position` - posição da ênfase

### Text Direction

- `direction` - direção do texto
- `unicode-bidi` - algoritmo bidirecional

### Text Advanced

- `text-anchor` - âncora do texto SVG
- `text-box` - caixa do texto
- `text-box-edge` - borda da caixa de texto
- `text-box-trim` - aparar caixa de texto
- `text-rendering` - otimização de renderização
- `text-size-adjust` - ajuste de tamanho em mobile
- `text-spacing-trim` - aparar espaçamento

### 3.11 Tipografia - Espaçamento (16 propriedades)

### Line Spacing

- `line-height` - altura da linha
- `line-height-step` - passo da altura da linha
- `line-clamp` - número máximo de linhas

### Character Spacing

- `letter-spacing` - espaçamento entre letras
- `word-spacing` - espaçamento entre palavras

### White Space Control

- `white-space` - comportamento do espaço em branco
- `white-space-collapse` - colapso de espaços
- `word-break` - quebra de palavras
- `word-wrap` - quebra de palavras longas
- `overflow-wrap` - quebra por overflow

### Hyphenation

- `hyphens` - hifenização automática
- `hyphenate-character` - caractere de hifenização
- `hyphenate-limit-chars` - limite de caracteres para hifenizar

### Advanced Spacing

- `tab-size` - tamanho da tabulação
- `hanging-punctuation` - pontuação suspensa
- `line-break` - regras de quebra de linha

### 3.12 Escrita e Orientação (3 propriedades)

- `writing-mode` - modo de escrita (horizontal/vertical)
- `initial-letter` - letra inicial decorativa
- `initial-letter-align` - alinhamento da letra inicial

### 3.13 Background (12 propriedades)

### Background Base

- `background` - shorthand principal
- `background-color` - cor de fundo
- `background-image` - imagem de fundo

### Background Posicionamento

- `background-position` - posição da imagem
- `background-position-x` - posição horizontal
- `background-position-y` - posição vertical
- `background-size` - tamanho da imagem

### Background Comportamento

- `background-repeat` - repetição da imagem
- `background-attachment` - anexo da imagem
- `background-origin` - origem da imagem
- `background-clip` - área de clipping
- `background-blend-mode` - modo de mistura

### 3.14 Border - Bordas Gerais (4 propriedades)

- `border` - shorthand para todas as bordas
- `border-width` - largura de todas as bordas
- `border-style` - estilo de todas as bordas
- `border-color` - cor de todas as bordas

### 3.15 Border - Bordas Específicas (16 propriedades)

### Border Top

- `border-top` - shorthand da borda superior
- `border-top-width` - largura da borda superior
- `border-top-style` - estilo da borda superior
- `border-top-color` - cor da borda superior

### Border Right

- `border-right` - shorthand da borda direita
- `border-right-width` - largura da borda direita
- `border-right-style` - estilo da borda direita
- `border-right-color` - cor da borda direita

### Border Bottom

- `border-bottom` - shorthand da borda inferior
- `border-bottom-width` - largura da borda inferior
- `border-bottom-style` - estilo da borda inferior
- `border-bottom-color` - cor da borda inferior

### Border Left

- `border-left` - shorthand da borda esquerda
- `border-left-width` - largura da borda esquerda
- `border-left-style` - estilo da borda esquerda
- `border-left-color` - cor da borda esquerda

### 3.16 Border - Bordas Lógicas (24 propriedades)

### Border Block

- `border-block` - shorthand para start e end
- `border-block-color` - cor das bordas block
- `border-block-style` - estilo das bordas block
- `border-block-width` - largura das bordas block
- `border-block-start` - shorthand da borda block start
- `border-block-start-color` - cor da borda block start
- `border-block-start-style` - estilo da borda block start
- `border-block-start-width` - largura da borda block start
- `border-block-end` - shorthand da borda block end
- `border-block-end-color` - cor da borda block end
- `border-block-end-style` - estilo da borda block end
- `border-block-end-width` - largura da borda block end

### Border Inline

- `border-inline` - shorthand para start e end
- `border-inline-color` - cor das bordas inline
- `border-inline-style` - estilo das bordas inline
- `border-inline-width` - largura das bordas inline
- `border-inline-start` - shorthand da borda inline start
- `border-inline-start-color` - cor da borda inline start
- `border-inline-start-style` - estilo da borda inline start
- `border-inline-start-width` - largura da borda inline start
- `border-inline-end` - shorthand da borda inline end
- `border-inline-end-color` - cor da borda inline end
- `border-inline-end-style` - estilo da borda inline end
- `border-inline-end-width` - largura da borda inline end

### 3.17 Border Radius (9 propriedades)

### Border Radius Clássico

- `border-radius` - shorthand para todos os cantos
- `border-top-left-radius` - raio do canto superior esquerdo
- `border-top-right-radius` - raio do canto superior direito
- `border-bottom-right-radius` - raio do canto inferior direito
- `border-bottom-left-radius` - raio do canto inferior esquerdo

### Border Radius Lógico

- `border-start-start-radius` - raio do canto start-start
- `border-start-end-radius` - raio do canto start-end
- `border-end-start-radius` - raio do canto end-start
- `border-end-end-radius` - raio do canto end-end

### 3.18 Border Avançadas (8 propriedades)

### Border Image

- `border-image` - shorthand para imagem de borda
- `border-image-source` - fonte da imagem
- `border-image-slice` - fatias da imagem
- `border-image-width` - largura da imagem
- `border-image-outset` - extensão da imagem
- `border-image-repeat` - repetição da imagem

### Border Extras

- `border-collapse` - colapso de bordas em tabelas
- `border-spacing` - espaçamento entre bordas

### 3.19 Outline (5 propriedades)

- `outline` - shorthand do contorno
- `outline-width` - largura do contorno
- `outline-style` - estilo do contorno
- `outline-color` - cor do contorno
- `outline-offset` - distância do contorno

### 3.20 Sombras e Filtros (5 propriedades)

### Sombras

- `box-shadow` - sombra da caixa
- `text-shadow` - sombra do texto

### Filtros

- `filter` - filtros de imagem
- `backdrop-filter` - filtros de fundo
- `box-decoration-break` - quebra de decorações

### 3.21 Transformações (9 propriedades)

### Transform 2D/3D

- `transform` - transformações múltiplas
- `transform-origin` - ponto de origem
- `transform-style` - estilo 3D
- `transform-box` - caixa de referência

### Perspective 3D

- `perspective` - perspectiva 3D
- `perspective-origin` - origem da perspectiva
- `backface-visibility` - visibilidade das costas

### Transform Individual

- `translate` - translação individual
- `rotate` - rotação individual
- `scale` - escala individual

### 3.22 Transições (6 propriedades)

- `transition` - shorthand das transições
- `transition-property` - propriedades a transicionar
- `transition-duration` - duração da transição
- `transition-timing-function` - função de timing
- `transition-delay` - atraso da transição
- `transition-behavior` - comportamento da transição

### 3.23 Animações (15 propriedades)

### Animation Base

- `animation` - shorthand da animação
- `animation-name` - nome do keyframe
- `animation-duration` - duração da animação
- `animation-timing-function` - função de timing
- `animation-delay` - atraso da animação
- `animation-iteration-count` - número de repetições
- `animation-direction` - direção da animação
- `animation-fill-mode` - modo de preenchimento
- `animation-play-state` - estado de reprodução

### Animation Timeline

- `animation-timeline` - timeline personalizada
- `animation-range` - range da animação
- `animation-range-start` - início do range
- `animation-range-end` - fim do range
- `animation-composition` - composição de animações

### 3.24 Listas (4 propriedades)

- `list-style` - shorthand do estilo da lista
- `list-style-type` - tipo do marcador
- `list-style-image` - imagem do marcador
- `list-style-position` - posição do marcador

### 3.25 Tabelas (4 propriedades)

- `table-layout` - algoritmo de layout
- `caption-side` - lado da legenda
- `empty-cells` - exibição de células vazias
- `border-collapse` - colapso de bordas

### 3.26 Overflow (7 propriedades)

- `overflow` - comportamento do overflow
- `overflow-x` - overflow horizontal
- `overflow-y` - overflow vertical
- `overflow-anchor` - ancoragem do scroll
- `overflow-block` - overflow na direção block
- `overflow-inline` - overflow na direção inline
- `overflow-clip-margin` - margem do clip

### 3.27 Scroll Behavior (9 propriedades)

### Scroll Base

- `scroll-behavior` - comportamento do scroll

### Overscroll

- `overscroll-behavior` - comportamento do overscroll
- `overscroll-behavior-x` - overscroll horizontal
- `overscroll-behavior-y` - overscroll vertical
- `overscroll-behavior-block` - overscroll block
- `overscroll-behavior-inline` - overscroll inline

### Scroll Snap

- `scroll-snap-type` - tipo de snap
- `scroll-snap-align` - alinhamento do snap
- `scroll-snap-stop` - parada obrigatória

### 3.28 Scroll Margin (11 propriedades)

- `scroll-margin` - shorthand da margem de scroll
- `scroll-margin-top` - margem superior
- `scroll-margin-right` - margem direita
- `scroll-margin-bottom` - margem inferior
- `scroll-margin-left` - margem esquerda
- `scroll-margin-block` - margem block
- `scroll-margin-block-start` - margem block start
- `scroll-margin-block-end` - margem block end
- `scroll-margin-inline` - margem inline
- `scroll-margin-inline-start` - margem inline start
- `scroll-margin-inline-end` - margem inline end

### 3.29 Scroll Padding (11 propriedades)

- `scroll-padding` - shorthand do padding de scroll
- `scroll-padding-top` - padding superior
- `scroll-padding-right` - padding direito
- `scroll-padding-bottom` - padding inferior
- `scroll-padding-left` - padding esquerdo
- `scroll-padding-block` - padding block
- `scroll-padding-block-start` - padding block start
- `scroll-padding-block-end` - padding block end
- `scroll-padding-inline` - padding inline
- `scroll-padding-inline-start` - padding inline start
- `scroll-padding-inline-end` - padding inline end

### 3.30 Scrollbar Customização (3 propriedades)

- `scrollbar-width` - largura da scrollbar
- `scrollbar-color` - cores da scrollbar
- `scrollbar-gutter` - espaço reservado para scrollbar

### 3.31 Interação do Usuário (8 propriedades)

### Cursor e Seleção

- `cursor` - tipo do cursor
- `pointer-events` - eventos do ponteiro
- `user-select` - seleção pelo usuário
- `user-drag` - arrasto pelo usuário
- `user-modify` - modificação pelo usuário

### Resize e Touch

- `resize` - redimensionamento pelo usuário
- `touch-action` - ações de toque
- `field-sizing` - dimensionamento de campos

### 3.32 Multi-colunas (15 propriedades)

### Columns Base

- `columns` - shorthand das colunas
- `column-count` - número de colunas
- `column-width` - largura das colunas
- `column-gap` - espaçamento entre colunas

### Column Rules

- `column-rule` - shorthand da regra
- `column-rule-width` - largura da regra
- `column-rule-style` - estilo da regra
- `column-rule-color` - cor da regra

### Column Behavior

- `column-span` - extensão através das colunas
- `column-fill` - preenchimento das colunas

### Page Breaks

- `break-before` - quebra antes
- `break-after` - quebra depois
- `break-inside` - quebra dentro
- `orphans` - linhas órfãs
- `widows` - linhas viúvas

### 3.33 Contadores CSS (3 propriedades)

- `counter-reset` - reset do contador
- `counter-increment` - incremento do contador
- `counter-set` - definição do contador

### 3.34 Geração de Conteúdo (2 propriedades)

- `content` - conteúdo gerado
- `quotes` - aspas personalizadas

### 3.35 Quebras de Página (4 propriedades)

- `page-break-before` - quebra antes (deprecated)
- `page-break-after` - quebra depois (deprecated)
- `page-break-inside` - quebra dentro (deprecated)
- `page` - página nomeada

### 3.36 Máscaras e Clipping (20 propriedades)

### Mask

- `mask` - shorthand da máscara
- `mask-image` - imagem da máscara
- `mask-mode` - modo da máscara
- `mask-repeat` - repetição da máscara
- `mask-position` - posição da máscara
- `mask-clip` - área de clipping
- `mask-origin` - origem da máscara
- `mask-size` - tamanho da máscara
- `mask-composite` - composição da máscara
- `mask-type` - tipo da máscara

### Mask Border

- `mask-border` - shorthand da borda da máscara
- `mask-border-mode` - modo da borda
- `mask-border-outset` - extensão da borda
- `mask-border-repeat` - repetição da borda
- `mask-border-slice` - fatias da borda
- `mask-border-source` - fonte da borda
- `mask-border-width` - largura da borda

### Clipping

- `clip` - clipping retangular (deprecated)
- `clip-path` - caminho de clipping
- `clip-rule` - regra de clipping

### 3.37 Shapes (4 propriedades)

- `shape-outside` - forma externa para float
- `shape-margin` - margem da forma
- `shape-image-threshold` - limite de transparência
- `shape-rendering` - otimização de renderização

### 3.38 Container Queries (3 propriedades)

- `container` - shorthand do container
- `container-type` - tipo de containment
- `container-name` - nome do container

### 3.39 Intrinsic Sizing (4 propriedades)

- `fit-content` - ajuste ao conteúdo (função)
- `min-content` - tamanho mínimo intrínseco
- `max-content` - tamanho máximo intrínseco
- `interpolate-size` - interpolação de tamanhos

### 3.40 Ruby - Anotações Asiáticas (4 propriedades)

- `ruby-align` - alinhamento das anotações
- `ruby-merge` - fusão de anotações
- `ruby-position` - posição das anotações
- `ruby-overhang` - sobreposição das anotações

### 3.41 Blend Modes e Isolation (3 propriedades)

- `mix-blend-mode` - modo de mistura
- `isolation` - isolamento de contexto
- `forced-color-adjust` - ajuste de cores forçadas

### 3.42 Object Fitting (3 propriedades)

- `object-fit` - ajuste de objetos substituídos
- `object-position` - posição de objetos
- `object-view-box` - caixa de visualização

### 3.43 Performance e Otimização (7 propriedades)

### Containment

- `contain` - tipo de contenção
- `contain-intrinsic-size` - tamanho intrínseco
- `contain-intrinsic-width` - largura intrínseca
- `contain-intrinsic-height` - altura intrínseca
- `contain-intrinsic-block-size` - tamanho block intrínseco
- `contain-intrinsic-inline-size` - tamanho inline intrínseco

### Performance Hints

- `will-change` - dica de mudanças futuras

### 3.44 Timeline e Scroll Avançado (8 propriedades)

### Scroll Timeline

- `scroll-timeline` - shorthand da timeline
- `scroll-timeline-name` - nome da timeline
- `scroll-timeline-axis` - eixo da timeline

### View Timeline

- `view-timeline` - shorthand da view timeline
- `view-timeline-name` - nome da view timeline
- `view-timeline-axis` - eixo da view timeline
- `view-timeline-inset` - inset da view timeline

### Timeline Scope

- `timeline-scope` - escopo das timelines

### 3.45 View Transitions (2 propriedades base + pseudo-elementos)

### View Transition Base

- `view-transition-name` - nome da transição
- `view-transition-class` - classe da transição

### View Transition Pseudo-elementos

- `::view-transition` - elemento raiz da transição
- `::view-transition-group()` - grupo de transição
- `::view-transition-image-pair()` - par de imagens
- `::view-transition-new()` - imagem nova
- `::view-transition-old()` - imagem antiga

### 3.46 SVG Properties (35 propriedades)

### SVG Fill e Stroke

- `fill` - preenchimento SVG
- `fill-opacity` - opacidade do preenchimento
- `fill-rule` - regra de preenchimento
- `stroke` - contorno SVG
- `stroke-color` - cor do contorno
- `stroke-dasharray` - padrão de traços
- `stroke-dashoffset` - offset dos traços
- `stroke-linecap` - terminação das linhas
- `stroke-linejoin` - junção das linhas
- `stroke-miterlimit` - limite do miter
- `stroke-opacity` - opacidade do contorno
- `stroke-width` - largura do contorno

### SVG Geometry

- `cx` - centro X de círculos/elipses
- `cy` - centro Y de círculos/elipses
- `d` - dados do caminho
- `r` - raio de círculos
- `rx` - raio X de elipses
- `ry` - raio Y de elipses
- `x` - coordenada X
- `y` - coordenada Y

### SVG Text

- `alignment-baseline` - linha de base de alinhamento
- `baseline-shift` - deslocamento da linha de base
- `dominant-baseline` - linha de base dominante

### SVG Filters

- `color-interpolation-filters` - interpolação de cores
- `flood-color` - cor de flood
- `flood-opacity` - opacidade de flood
- `lighting-color` - cor de iluminação
- `stop-color` - cor do stop de gradiente
- `stop-opacity` - opacidade do stop

### SVG Markers

- `marker` - shorthand para marcadores
- `marker-start` - marcador inicial
- `marker-mid` - marcador intermediário
- `marker-end` - marcador final

### SVG Paint

- `paint-order` - ordem de pintura
- `vector-effect` - efeitos vetoriais

### 3.47 Accent Color (1 propriedade)

- `accent-color` - cor de destaque de controles

### 3.48 Caret (3 propriedades)

- `caret` - shorthand do cursor de texto
- `caret-color` - cor do cursor
- `caret-shape` - forma do cursor

### 3.49 Appearance (2 propriedades)

- `appearance` - aparência nativa
- `webkit-appearance` - aparência WebKit (legacy)

### 3.50 Custom Properties e At-Rules (5 propriedades)

### Custom Properties

- `-*` - propriedades customizadas (variáveis CSS)
- `@property` - definição de propriedades customizadas

### Scoping e Reset

- `@scope` - escopo de regras
- `@starting-style` - estilos iniciais para animações
- `all` - reset de todas as propriedades

## 4. RESPONSIVIDADE E QUERIES

### 4.1 Media Queries

### Conceitos Fundamentais

- Tipos de mídia (screen, print, speech, all)
- Operadores lógicos (and, or, not, only)
- Sintaxe de media queries

### Media Features - Viewport

- `width` e `min-width`, `max-width`
- `height` e `min-height`, `max-height`
- `aspect-ratio` e `min-aspect-ratio`, `max-aspect-ratio`
- `orientation` (portrait, landscape)

### Media Features - Display

- `resolution` e `min-resolution`, `max-resolution`
- `display-mode` (fullscreen, standalone, minimal-ui, browser)
- `color` e `min-color`, `max-color`
- `color-index` e variações
- `monochrome` e variações
- `color-gamut` (srgb, p3, rec2020)

### Media Features - Interação

- `hover` (none, hover)
- `pointer` (none, coarse, fine)
- `any-hover` e `any-pointer`
- `update` (none, slow, fast)
- `overflow-block` e `overflow-inline`

### Media Features - Ambiente

- `prefers-color-scheme` (light, dark)
- `prefers-contrast` (no-preference, more, less)
- `prefers-reduced-motion` (no-preference, reduce)
- `prefers-reduced-transparency`
- `forced-colors` (none, active)

### Media Features - Scripting

- `scripting` (none, initial-only, enabled)

### 4.2 Container Queries

### Container Query Fundamentals

- Conceito de containment context
- Container query length units
- Diferenças entre media e container queries

### Container Types

- `size` - containment de tamanho
- `inline-size` - containment inline
- `block-size` - containment block
- `style` - containment de estilo
- `state` - containment de estado

### Container Query Features

- `width` e variações em containers
- `height` e variações em containers
- `inline-size` e `block-size`
- `aspect-ratio` em containers
- `orientation` em containers

### Container Query Units

- `cqw` - container query width
- `cqh` - container query height
- `cqi` - container query inline
- `cqb` - container query block
- `cqmin` - container query minimum
- `cqmax` - container query maximum

### 4.3 Responsividade Avançada

### Estratégias Responsivas

- Mobile-first vs Desktop-first
- Content-first design
- Progressive enhancement
- Graceful degradation

### Técnicas Avançadas

- Fluid typography com clamp()
- Container-based components
- Intrinsic web design
- Responsive sem breakpoints

### Performance Responsiva

- Critical CSS
- Lazy loading de estilos
- Conditional loading
- Resource hints

## 5. CORES

### 5.1 Sistemas de Cores

### Modelos de Cor Básicos

- Hexadecimal (#rgb, #rrggbb, #rgba, #rrggbbaa)
- RGB e RGBA (rgb(), rgba())
- HSL e HSLA (hsl(), hsla())
- Cores nomeadas (keywords)

### Modelos de Cor Avançados

- HWB (hwb()) - Hue, Whiteness, Blackness
- LAB (lab()) - Perceptualmente uniforme
- LCH (lch()) - Luminance, Chroma, Hue
- OKLAB (oklab()) - LAB melhorado
- OKLCH (oklch()) - LCH melhorado

### Espaços de Cor

- sRGB (padrão web)
- Display P3 (color(display-p3))
- Adobe RGB (color(a98-rgb))
- ProPhoto RGB (color(prophoto-rgb))
- Rec2020 (color(rec2020))
- XYZ (color(xyz))

### 5.2 Funções de Cor

### Manipulação Relativa

- `color-mix()` - mistura de cores
- `light-dark()` - cor baseada no tema
- Relative color syntax

### Transparência

- `alpha()` - canal alfa
- `opacity` vs alpha em cores
- Composição de transparências

### 5.3 Propriedades de Cor

### Cores do Sistema

- `currentColor` - cor atual do texto
- `transparent` - transparente
- System colors (Canvas, ButtonText, etc.)

### Esquemas de Cor

- `color-scheme` - esquema claro/escuro
- `forced-color-adjust` - ajuste forçado
- Cores em high contrast mode

## 6. UNIDADES DE MEDIDAS

### 6.1 Unidades Absolutas

- `px` - pixels CSS
- `pt` - pontos tipográficos
- `pc` - paicas
- `in` - polegadas
- `cm` - centímetros
- `mm` - milímetros
- `Q` - quartos de milímetro

### 6.2 Unidades Relativas ao Font

- `em` - relativo ao font-size do elemento
- `rem` - relativo ao font-size do root
- `ex` - altura do x do font
- `rex` - altura do x do root font
- `cap` - altura das maiúsculas
- `rcap` - altura das maiúsculas do root
- `ch` - largura do caractere “0”
- `rch` - largura do “0” do root font
- `ic` - largura do ideograma “水”
- `ric` - largura do ideograma do root
- `lh` - line-height do elemento
- `rlh` - line-height do root

### 6.3 Unidades de Viewport

### Viewport Básicas

- `vw` - viewport width
- `vh` - viewport height
- `vmin` - menor dimensão do viewport
- `vmax` - maior dimensão do viewport

### Viewport Dinâmicas

- `dvw` - dynamic viewport width
- `dvh` - dynamic viewport height
- `dvmin` - dynamic viewport minimum
- `dvmax` - dynamic viewport maximum

### Viewport Grandes

- `lvw` - large viewport width
- `lvh` - large viewport height
- `lvmin` - large viewport minimum
- `lvmax` - large viewport maximum

### Viewport Pequenas

- `svw` - small viewport width
- `svh` - small viewport height
- `svmin` - small viewport minimum
- `svmax` - small viewport maximum

### 6.4 Unidades de Container

- `cqw` - container query width
- `cqh` - container query height
- `cqi` - container query inline size
- `cqb` - container query block size
- `cqmin` - container query minimum
- `cqmax` - container query maximum

### 6.5 Unidades de Porcentagem

- `%` - porcentagem relativa ao parent
- Contextos diferentes para porcentagem
- Cálculo de porcentagem em propriedades específicas

### 6.6 Unidades Especiais

- `fr` - fração no CSS Grid
- `turn` - voltas completas (360deg)
- `deg` - graus
- `rad` - radianos
- `grad` - gradianos
- `s` - segundos
- `ms` - milissegundos
- `Hz` - hertz
- `kHz` - kilohertz
- `dpi` - dots per inch
- `dpcm` - dots per centimeter
- `dppx` - dots per pixel

## 7. AT-RULES

### 7.1 Import e Media

### @import

- Sintaxe e uso do @import
- Importação condicional com media queries
- Orden de importação e performance
- layer() function para cascade layers

### @media

- Media queries responsivas
- Nested media queries
- Combinação de condições
- Media query ranges

### 7.2 Fontes e Recursos

### @font-face

- Definição de fontes personalizadas
- font-display strategies
- Unicode ranges
- Font variations e eixos
- Fallbacks e font loading

### @font-feature-values

- Valores nomeados para font features
- Estilistic sets
- Character variants
- Swash e ornaments

### @font-palette-values

- Paletas de cores para color fonts
- Override de cores específicas
- Base palette e font-family matching

### 7.3 Keyframes e Animações

### @keyframes

- Definição de animações
- Percentuais vs from/to
- Múltiplas propriedades
- Timing e easing
- Animation composition

### 7.4 Layout e Container

### @container

- Container queries
- Named containers
- Container query syntax
- Style queries (experimental)

### @supports

- Feature queries
- Syntax support detection
- Combinação de condições
- Progressive enhancement

### 7.5 Cascade e Scope

### @layer

- Cascade layers
- Ordem de prioridade
- Named layers
- Anonymous layers
- Nested layers

### @scope

- Scoped styles
- Scope root e scope limit
- Proximity e cascade
- Shadow DOM integration

### 7.6 Pseudo-classes e Seletores

### @starting-style

- Estilos iniciais para transições
- Element entry animations
- Integration com view transitions

### 7.7 Print e Paginação

### @page

- Estilos de página para impressão
- Page margins e boxes
- Named pages
- Page selectors (:first, :left, :right)

### @page margins

- @top-left, @top-center, @top-right
- @bottom-left, @bottom-center, @bottom-right
- @left-top, @left-middle, @left-bottom
- @right-top, @right-middle, @right-bottom

### 7.8 Propriedades Customizadas

### @property

- Definição de custom properties
- Syntax description
- Inherits behavior
- Initial values
- Type checking e validation

### 7.9 Namespace e Imports

### @namespace

- Namespaces XML
- Default namespace
- Prefixed namespaces
- Namespace em seletores

### @charset

- Encoding de folhas de estilo
- UTF-8 e outros encodings
- Posicionamento obrigatório

### 7.10 Viewport e Color

### @viewport (deprecated)

- Meta viewport alternativo
- Zoom e initial-scale
- Migration para meta tag

### @color-profile

- Perfis de cor personalizados
- ICC profiles
- Color management

## 8. FUNÇÕES CSS

### 8.1 Funções Matemáticas Básicas

### Funções de Comparação

- `min()` - valor mínimo
- `max()` - valor máximo
- `clamp()` - valor limitado entre min e max
- `calc()` - cálculos matemáticos

### Funções Trigonométricas

- `sin()` - seno
- `cos()` - cosseno
- `tan()` - tangente
- `asin()` - arco seno
- `acos()` - arco cosseno
- `atan()` - arco tangente
- `atan2()` - arco tangente de dois argumentos

### Funções Matemáticas Avançadas

- `abs()` - valor absoluto
- `sqrt()` - raiz quadrada
- `pow()` - potenciação
- `log()` - logaritmo natural
- `exp()` - exponencial
- `hypot()` - hipotenusa
- `mod()` - módulo
- `rem()` - resto
- `round()` - arredondamento
- `sign()` - sinal do número

### 8.2 Funções de Layout

### Sizing Functions

- `fit-content()` - ajuste ao conteúdo
- `minmax()` - range no Grid
- `repeat()` - repetição no Grid
- `calc-size()` - cálculo de tamanhos intrínsecos

### 8.3 Funções de Cores

### Funções de Cor Básicas

- `rgb()` e `rgba()` - RGB com alpha
- `hsl()` e `hsla()` - HSL com alpha
- `hwb()` - Hue, Whiteness, Blackness
- `lab()` - LAB color space
- `lch()` - LCH color space
- `oklab()` - OKLAB melhorado
- `oklch()` - OKLCH melhorado
- `color()` - generic color function

### Funções de Manipulação

- `color-mix()` - mistura de cores
- `light-dark()` - cor baseada no esquema
- `color-contrast()` - contraste automático (experimental)

### 8.4 Funções de Imagem

### Gradientes Lineares

- `linear-gradient()` - gradiente linear
- `repeating-linear-gradient()` - gradiente linear repetido

### Gradientes Radiais

- `radial-gradient()` - gradiente radial
- `repeating-radial-gradient()` - gradiente radial repetido

### Gradientes Cônicos

- `conic-gradient()` - gradiente cônico
- `repeating-conic-gradient()` - gradiente cônico repetido

### Imagens e Elementos

- `url()` - referência de recurso
- `image()` - imagem com fallbacks
- `element()` - elemento como imagem
- `cross-fade()` - transição entre imagens

### 8.5 Funções de Transformação

### Transform Functions 2D

- `translate()` - translação 2D
- `translateX()` - translação horizontal
- `translateY()` - translação vertical
- `scale()` - escala 2D
- `scaleX()` - escala horizontal
- `scaleY()` - escala vertical
- `rotate()` - rotação 2D
- `skew()` - inclinação 2D
- `skewX()` - inclinação horizontal
- `skewY()` - inclinação vertical

### Transform Functions 3D

- `translate3d()` - translação 3D
- `translateZ()` - translação em Z
- `scale3d()` - escala 3D
- `scaleZ()` - escala em Z
- `rotate3d()` - rotação 3D
- `rotateX()` - rotação em X
- `rotateY()` - rotação em Y
- `rotateZ()` - rotação em Z

### Transform Utilities

- `matrix()` - matriz 2D
- `matrix3d()` - matriz 3D
- `perspective()` - perspectiva

### 8.6 Funções de Filtro

### Filter Functions

- `blur()` - desfoque
- `brightness()` - brilho
- `contrast()` - contraste
- `drop-shadow()` - sombra
- `grayscale()` - escala de cinza
- `hue-rotate()` - rotação de matiz
- `invert()` - inversão
- `opacity()` - opacidade
- `saturate()` - saturação
- `sepia()` - sépia

### 8.7 Funções de Formas

### Shape Functions

- `circle()` - círculo
- `ellipse()` - elipse
- `polygon()` - polígono
- `path()` - caminho SVG
- `inset()` - retângulo com bordas arredondadas

### 8.8 Funções de Conteúdo

### Content Generation

- `counter()` - valor do contador
- `counters()` - contadores aninhados
- `attr()` - valor de atributo
- `string()` - string nomeada (experimental)

### 8.9 Funções de Ambiente

### Environment Functions

- `env()` - variáveis de ambiente
- `var()` - custom properties

### 8.10 Funções de Timeline

### Animation Timeline

- `scroll()` - scroll timeline
- `view()` - view timeline

### 8.11 Funções Experimentais

### Advanced Functions

- `toggle()` - alternância de valores
- `sibling-count()` - contagem de irmãos
- `sibling-index()` - índice do irmão

---

Esta grade curricular abrangente cobre todos os aspectos fundamentais e avançados do CSS, desde conceitos básicos até funcionalidades experimentais e de ponta. A estrutura é progressiva, permitindo tanto o aprendizado sistemático quanto a consulta específica de tópicos avançados. Cada seção pode ser expandida com exemplos práticos e exercícios conforme a necessidade do estudante.