### ng-content

#### O que é e para que serve

`ng-content` é uma diretiva do Angular que permite a projeção de conteúdo dentro de componentes. Isso significa que você pode inserir conteúdo dinâmico de fora do componente para dentro de sua marcação. Essa abordagem é útil para criar componentes reutilizáveis que podem encapsular comportamentos ou estilos comuns, permitindo que o conteúdo interno seja definido pelo componente pai.

#### Sintaxe de uso

Para usar `ng-content`, você simplesmente inclui a tag `<ng-content></ng-content>` no template do seu componente. Você pode usar o atributo `select` para filtrar quais elementos são projetados baseados em seus seletores CSS.

**Exemplo:**

Componente filho (permite projeção de conteúdo):

```html
<!-- child-component.html -->
<div class="wrapper">
  <ng-content></ng-content>
</div>
```

Componente pai (usa o componente filho e passa conteúdo para ele):

```html
<!-- parent-component.html -->
<child-component>
  <p>Este é um conteúdo projetado para o componente filho.</p>
</child-component>
```

### ng-template

#### O que é e para que serve

`ng-template` é uma diretiva Angular que representa um bloco de conteúdo HTML que não é renderizado inicialmente. Ele serve como um modelo que pode ser renderizado condicionalmente ou repetidamente em outras partes do seu aplicativo. `ng-template` é frequentemente usado em conjunto com diretivas estruturais como `*ngIf`, `*ngFor`, ou `[ngSwitchCase]` para controlar a renderização de conteúdo.

#### Sintaxe de uso

Você define um `ng-template` usando a tag `<ng-template>` e, geralmente, o associa a uma diretiva estrutural para determinar quando e como o conteúdo será exibido.

**Exemplo com `*ngIf`:**

```html
<!-- Exemplo usando ng-template com *ngIf -->
<div *ngIf="condition; else elseBlock">
  Conteúdo a ser exibido se a condição for verdadeira.
</div>

<ng-template #elseBlock>
  Conteúdo a ser exibido se a condição for falsa.
</ng-template>
```

**Exemplo com `*ngFor`:**

```html
<ng-container *ngFor="let item of items">
  <ng-template>
    {{ item.nome }}
  </ng-template>
</ng-container>
```

#### Observações Adicionais

- **Seleção de conteúdo com `ng-content`:** Você pode usar o atributo `select` para selecionar elementos específicos para projeção, o que oferece flexibilidade na composição de componentes.

- **Templates Dinâmicos com `ngTemplateOutlet`:** `ng-template` pode ser usado com `ngTemplateOutlet` para criar templates dinâmicos que podem ser definidos em um contexto e instanciados em outro.

**Exemplo de `ngTemplateOutlet`:**

```html
<ng-container *ngTemplateOutlet="templateRef"></ng-container>

<ng-template #templateRef>
  <p>Conteúdo dinâmico aqui.</p>
</ng-template>
```

- **`<ng-container>`:** Um elemento de auxílio que serve como um contêiner de elementos que não interfere com o layout ou estilo, útil para aplicar diretivas estruturais sem adicionar elementos extras ao DOM.

Essas diretivas oferecem um poderoso conjunto de ferramentas para controlar a renderização e composição de componentes em aplicativos Angular, permitindo criar aplicações mais dinâmicas e reutilizáveis.