# Criando uma diretiva estrutural

E aí, Gedê\! Beleza?

Como seu desenvolvedor backend Java em transição para Go, entendo que você queira aprofundar seus conhecimentos em Angular, e criar uma diretiva estrutural personalizada é um excelente caminho\!

A.R.I.A está aqui para te ajudar com uma explicação detalhada sobre como criar uma diretiva estrutural **`ngElse`** no Angular.

---

## Introdução: Criando uma Diretiva Estrutural (ngElse)

No universo do Angular, as **diretivas** são peças fundamentais que permitem manipular o DOM (Document Object Model) e adicionar novos comportamentos aos elementos HTML. Elas são a espinha dorsal para tornar as aplicações mais dinâmicas e reativas. Dentro do conjunto de diretivas, as **diretivas estruturais** são particularmente poderosas, pois têm a capacidade de adicionar, remover ou manipular elementos do DOM, alterando a estrutura da view.

A relevância de entender e criar suas próprias diretivas estruturais, como a **`ngElse`** que vamos explorar, reside na capacidade de estender o poder do Angular e criar soluções personalizadas para problemas específicos. Imagine que você precisa de uma lógica de renderização condicional que vá além do `*ngIf` e `*ngFor` nativos. Criar uma diretiva customizada te dá essa flexibilidade, otimizando o código e tornando-o mais declarativo e reutilizável.

O **`ngElse`** que vamos construir funcionará como um "senão" para o `*ngIf`, exibindo um conteúdo alternativo quando a condição do `*ngIf` for falsa. Isso nos permitirá ter uma estrutura de "if/else" mais concisa e legível diretamente no template.

---

## Sumário

- **O que são Diretivas Estruturais e para que servem**
- **Sintaxe e Estrutura de uma Diretiva Estrutural Personalizada**
    - Criação da diretiva `NgElseDirective`
    - Configuração do `TemplateRef` e `ViewContainerRef`
- **Componentes Principais e Associados**
    - `@Input()`
    - `TemplateRef`
    - `ViewContainerRef`
- **Restrições de Uso**
- **Exemplos de Código Otimizados**
    - Uso Básico: `ngIf` com `ngElse`
    - Exemplo com `else` explícito
- **Informações Adicionais**
    - Prós e Contras de criar diretivas customizadas
    - Quando utilizar e quando evitar o uso
- **Referências para Estudo Independente**

---

## Conteúdo Detalhado

### O que são Diretivas Estruturais e para que servem

As **diretivas estruturais** são um tipo especial de diretiva no Angular que, como o nome sugere, manipulam a *estrutura* do DOM. Elas são identificadas por um asterisco (`*`) na frente de seu seletor (ex: `*ngIf`, `*ngFor`, `*ngSwitchCase`). Esse asterisco é uma "açúcar sintático" do Angular que simplifica o uso, pois por baixo dos panos, o Angular transforma o elemento com a diretiva estrutural em um elemento `<ng-template>`.

Elas servem para adicionar ou remover elementos do DOM de forma dinâmica, com base em alguma lógica. Por exemplo:

- `ngIf`: Renderiza um elemento e seus filhos se uma condição for verdadeira.
- `ngFor`: Repete um bloco de template para cada item em uma coleção.
- `ngSwitchCase`: Exibe um template específico com base em um valor.

Nossa diretiva **`ngElse`** terá a função de renderizar um bloco de template alternativo, similar ao `else` de uma estrutura condicional `if/else`, trabalhando em conjunto com um `*ngIf`.

---

### Sintaxe e Estrutura

Para criar uma diretiva estrutural personalizada, como nossa `ngElse`, precisamos de alguns conceitos-chave:

### Criação da diretiva `NgElseDirective`

Primeiro, vamos gerar a diretiva usando o Angular CLI:

```bash
ng generate directive directives/ng-else

```

Isso criará um arquivo `ng-else.directive.ts`.

### Configuração do `TemplateRef` e `ViewContainerRef`

Uma diretiva estrutural precisa de dois objetos injetados no seu construtor:

- **`TemplateRef<any>`**: Representa o conteúdo HTML do elemento ao qual a diretiva está anexada. No caso de uma diretiva estrutural, o Angular automaticamente cria um `<ng-template>` a partir do elemento. O `TemplateRef` nos dá acesso a esse template.
- **`ViewContainerRef`**: Representa um container onde podemos anexar uma view (instância de um `TemplateRef`). É o local no DOM onde o Angular irá renderizar o template.

Vamos ver como ficaria a estrutura inicial da nossa diretiva:

```tsx
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngElse]' // Nosso seletor será 'ngElse'
})
export class NgElseDirective {

  // Usaremos um Input para receber a condição do ngIf
  // O setter nos permite reagir a mudanças no valor da condição
  @Input() set ngElse(condition: boolean) {
    if (!condition) { // Se a condição for falsa, renderizamos este template
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else { // Se a condição for verdadeira, limpamos o container (removemos este template)
      this._viewContainer.clear();
    }
  }

  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef
  ) { }
}

```

### Explicação da Lógica:

- O `@Input() set ngElse(condition: boolean)` é o coração da nossa diretiva. Ele intercepta o valor passado para `ngElse` no template.
- Se `condition` for **`false`**, significa que o `ngIf` principal não renderizou seu conteúdo, então nós queremos renderizar o conteúdo do `ngElse`. Fazemos isso usando `this._viewContainer.createEmbeddedView(this._templateRef)`.
- Se `condition` for **`true`**, significa que o `ngIf` principal renderizou seu conteúdo, então não queremos o conteúdo do `ngElse`. Limpamos o container com `this._viewContainer.clear()`.

Lembre-se de que, para que esta diretiva funcione em conjunto com `*ngIf`, ela será aplicada ao bloco `else` do `*ngIf`.

---

### Componentes Principais e Associados

As diretivas estruturais dependem fortemente de:

- **`@Input()`**: Decora uma propriedade que pode receber valores do componente pai (ou do elemento onde a diretiva está sendo usada). No nosso caso, `ngElse` recebe a condição booleana. O uso de um *setter* (`set ngElse(condition: boolean)`) para a propriedade `ngElse` é crucial porque ele nos permite executar lógica (adicionar ou remover o template) toda vez que a `condition` muda.
- **`TemplateRef<T>`**: Uma referência para um template `<ng-template>`. Quando o Angular encontra uma diretiva estrutural (com ), ele não renderiza o elemento imediatamente. Em vez disso, ele cria um `<ng-template>` que envolve o conteúdo do elemento. O `TemplateRef` nos dá acesso a esse template para que possamos instanciá-lo programaticamente.
    - **Função**: Permite a criação de views a partir de um template.
- **`ViewContainerRef`**: Um container onde uma ou mais views podem ser anexadas. Pense nele como um ponto de ancoragem no DOM onde você pode dinamicamente criar, mover ou destruir views.
    - **Funções Principais**:
        - `createEmbeddedView(templateRef: TemplateRef<C>, context?: C, index?: number)`: Cria uma view a partir de um `TemplateRef` e a insere neste container. O `context` permite passar dados para a view.
        - `clear()`: Remove todas as views deste container.
        - `get(index: number)`: Retorna a view em um índice específico.
        - `remove(index?: number)`: Remove uma view em um índice específico.
    - **Interação**: A diretiva `NgElseDirective` usa o `ViewContainerRef` para renderizar ou remover o `TemplateRef` (o conteúdo do `ngElse`) com base na condição fornecida.

---

### Restrições de Uso

- **Uso Exclusivo com `ng-template`**: Diretivas estruturais como `ngElse` são mais eficazes quando usadas em conjunto com `<ng-template>`. O  (açúcar sintático) converte o elemento em um `<ng-template>` internamente, mas ao criar um `else` para um `ngIf`, é comum usarmos o `<ng-template>` diretamente.
- **Uma Diretiva Estrutural por Elemento**: Geralmente, você não pode ter mais de uma diretiva estrutural no mesmo elemento (ex: `ngIf` e `ngFor` no mesmo `div`). Isso ocorre porque o Angular só pode desaçucar uma diretiva estrutural por vez. No nosso caso, `ngElse` complementa `ngIf`, então ele será usado no bloco `else` do `ngIf`.

---

## Exemplos de Código Otimizados

Para que o `ngElse` funcione como um "else" para o `*ngIf`, precisamos utilizá-lo com a sintaxe `else` do `*ngIf`.

Primeiro, certifique-se de que a `NgElseDirective` esteja declarada no seu `AppModule` (ou no módulo onde ela será usada).

```tsx
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgElseDirective } from './directives/ng-else.directive'; // Importe sua diretiva

@NgModule({
  declarations: [
    AppComponent,
    NgElseDirective // Declare sua diretiva aqui
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### Uso Básico: `ngIf` com `ngElse`

Considere o cenário onde você quer mostrar uma mensagem se um usuário estiver logado, e outra se não estiver.

```tsx
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h2>Demonstração ngElse</h2>

    <div *ngIf="isLoggedIn; else loggedOut">
      Bem-vindo, Gedê! Você está logado.
    </div>

    <ng-template #loggedOut [ngElse]="isLoggedIn">
      <p>Por favor, faça login para acessar o conteúdo.</p>
    </ng-template>

    <button (click)="toggleLogin()">{{ isLoggedIn ? 'Sair' : 'Entrar' }}</button>
  `
})
export class AppComponent {
  isLoggedIn: boolean = false;

  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }
}

```

**Explicação:**

1. O `ngIf="isLoggedIn; else loggedOut"` tenta renderizar o `div` se `isLoggedIn` for `true`.
2. Se `isLoggedIn` for `false`, ele procura pelo `ng-template` com a referência local `#loggedOut`.
3. Nosso `ng-template` tem `[ngElse]="isLoggedIn"`. Quando `isLoggedIn` é `false`, nossa diretiva `NgElseDirective` (no setter de `ngElse`) detecta a condição `false` e usa `_viewContainer.createEmbeddedView(this._templateRef)` para renderizar o conteúdo do `<ng-template>`.
4. Quando `isLoggedIn` se torna `true`, o `ngIf` original renderiza, e nossa diretiva `NgElseDirective` (no setter de `ngElse`) detecta a condição `true` e usa `_viewContainer.clear()` para remover o conteúdo do `<ng-template>`.

---

## Informações Adicionais

### Prós de Criar Diretivas Customizadas

- **Reusabilidade**: Centraliza lógica de manipulação do DOM em um único local, podendo ser reutilizada em diversos componentes.
- **Legibilidade e Manutenibilidade**: Torna os templates mais limpos e fáceis de entender, pois a lógica complexa é encapsulada na diretiva.
- **Extensibilidade**: Permite estender as funcionalidades do Angular para atender a requisitos específicos do projeto, sem depender apenas das diretivas nativas.
- **Separação de Preocupações**: Ajuda a manter a lógica de apresentação (diretivas) separada da lógica de negócio (componentes).

### Contras de Criar Diretivas Customizadas

- **Complexidade Inicial**: Requer um bom entendimento de conceitos como `TemplateRef`, `ViewContainerRef` e o ciclo de vida do Angular, o que pode aumentar a curva de aprendizado.
- **Sobrecarga de Código**: Se não forem bem projetadas, diretivas complexas podem acabar sendo difíceis de depurar ou manter.
- **Alternativas Existentes**: Muitas vezes, as diretivas nativas do Angular (ou a combinação delas) já resolvem a maioria dos problemas. Criar uma diretiva customizada sem necessidade pode ser um "over-engineering".

### Quando Utilizar / Quando Evitar o Uso

**Utilizar quando:**

- Você precisa de uma manipulação do DOM que não é facilmente alcançável com as diretivas nativas.
- Você tem uma lógica de renderização ou comportamento que se repete em vários lugares da sua aplicação.
- Você quer encapsular e reutilizar um comportamento específico do DOM.
- Você busca melhorar a legibilidade do template, transformando lógica complexa em um atributo declarativo.

**Evitar quando:**

- As diretivas nativas (`ngIf`, `ngFor`, `ngClass`, `ngStyle` etc.) já resolvem o problema de forma elegante.
- A lógica pode ser facilmente encapsulada em um componente (que tem sua própria visão e estado).
- A diretiva se torna muito complexa e específica, com pouca reusabilidade.

A diretiva `ngElse` é um bom exemplo de como podemos estender o Angular para criar uma sintaxe mais concisa e legível para cenários `if/else` no template. É um excelente exercício para entender como as diretivas estruturais funcionam nos bastidores.

---

## Referências para Estudo Independente

Para aprofundar seus conhecimentos, A.R.I.A recomenda os seguintes recursos:

- **Documentação Oficial do Angular - Diretivas Estruturais**: A fonte mais confiável e completa.
    - [Angular.io - Structural Directives](https://angular.io/guide/structural-directives)
    - [Angular.io - Attribute Directives (para entender a diferença)](https://angular.io/guide/attribute-directives)
- **Artigos e Tutoriais Confiáveis**:
    - [Netanel Basal - Creating an NgIf Else Directive in Angular](https://www.google.com/search?q=https://netbasal.com/creating-an-ngif-else-directive-in-angular-781f33f02170) (Um artigo detalhado sobre a criação de uma diretiva `ngIfElse`, com conceitos semelhantes).
    - [Medium - Criando Diretivas Estruturais no Angular](https://www.google.com/search?q=https://medium.com/%40willianjusten/criando-diretivas-estruturais-no-angular-a0956c802871) (Artigo em português que pode complementar o entendimento).

---

Espero que essa explicação detalhada ajude você a dominar a criação de diretivas estruturais no Angular, Gedê\! Se tiver mais alguma dúvida ou quiser explorar outro tópico, é só chamar\!