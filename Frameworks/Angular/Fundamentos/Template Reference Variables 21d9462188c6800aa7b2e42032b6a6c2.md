# Template Reference Variables

## 1. Introdução

Variáveis declaradas com `#` em templates Angular são conhecidas como **template reference variables**. Elas permitem criar um “apelido” local dentro de um bloco de template para:

- Referenciar diretamente um **elemento DOM** (ex.: `<input>`, `<div>`).
- Acessar uma **instância de componente** filho ou diretiva (ex.: `<app-child>`, `NgForm`, `NgModel`).
- Obter um **TemplateRef** de um bloco `<ng-template>`.

**Relevância:**

- Facilita a comunicação **unidirecional** dentro do template, sem precisar expor propriedades no componente TypeScript.
- Simplifica a **manipulação de elementos DOM** e chamadas de métodos de componentes-filho diretamente no template.
- Melhora a **legibilidade** e **manutenibilidade** do código, agrupando a lógica de visualização no HTML.

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#conceitos-fundamentais)
2. [Sintaxe e Estrutura](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#sintaxe-e-estrutura)
3. [Componentes Principais e Associados](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#componentes-principais-e-associados)
4. [Restrições de Uso](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#restricoes-de-uso)
5. [Exemplos de Código Otimizados](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#exemplos-de-codigo-otimizados)
6. [Informações Adicionais](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#informacoes-adicionais)
7. [Referências para Estudo Independente](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#referencias-para-estudo-independente)

---

## 3. Conteúdo Detalhado

### 3.1. Conceitos Fundamentais

- **Template Reference Variable**: um alias local para um elemento, diretiva ou template. Usado apenas no **escopo do template** onde foi declarado.
- **ExportAs**: muitas diretivas e componentes Angular definem um `exportAs` para permitir acesso via `#var="exportAsName"`.
- **TemplateRef**: representação interna de um bloco angular `<ng-template>`, permitindo renderização programática.

### 3.2. Sintaxe e Estrutura

- **Declaração básica**:
    
    ```html
    <input #nomeInput>
    <app-child #childCmp>
    <ng-template #tplBlock>…</ng-template>
    
    ```
    
- **Com diretivas/exportAs**:
    
    ```html
    <!-- ngModel exportAs é "ngModel" -->
    <input [(ngModel)]="user.name" #modelVar="ngModel">
    
    <!-- NgForm exportAs é "ngForm" -->
    <form #formVar="ngForm">…</form>
    
    ```
    
- **Uso em binding/eventos**:
    
    ```html
    <button (click)="onSave(nomeInput.value, formVar.valid)">
      Salvar
    </button>
    
    ```
    

### 3.3. Componentes Principais e Associados

- **ElementRef**
    - Ao usar `#elem`, o Angular injeta um `ElementRef` associado ao elemento.
    - Permite acesso direto via `@ViewChild('elem') elemRef: ElementRef;` no componente TypeScript.
- **NgModel & NgForm**
    - `#model="ngModel"` fornece acesso a propriedades como `.valid`, `.value`, `.errors`.
    - `#form="ngForm"` dá `.valid`, `.dirty`, listas de controles, `form.value`.
- **Componentes-filho**
    - `#child="exportAsNameDoComponente"` acessa métodos e propriedades públicas do componente-filho.
- **TemplateRef & ViewContainerRef**
    - `#tpl` em `<ng-template>` produz um `TemplateRef`.
    - Pode ser instanciado via `ViewContainerRef.createEmbeddedView(tpl)` para renderização dinâmica.

### 3.4. Restrições de uso

- **Escopo local**: só funciona dentro do mesmo template onde foi declarado (não atravessa componentes).
- **Nome válido**: deve seguir regras de identificadores JavaScript (sem espaços, sem caracteres especiais).
- **Não substitui lógica de componente**: variáveis de template sintetizam acesso, mas lógica complexa deve residir no TypeScript.
- **Não disponível em views filtradas**: se um elemento com `#var` estiver dentro de um bloco destruído por `ngIf` ou `ngFor`, a variável some quando a view é removida.

---

## 4. Exemplos de Código Otimizados

```html
<!-- Exemplo 1: Referência de elemento puro -->
<input #userInput type="text" placeholder="Nome">
<button (click)="greet(userInput.value)">
  Diga Olá
</button>

```

```
// Componente TypeScript
export class HomeComponent {
  greet(name: string) {
    alert(`Olá, ${name}!`);
  }
}

```

```html
<!-- Exemplo 2: Formulário com NgForm e NgModel -->
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm.value)">
  <input name="email" ngModel #emailModel="ngModel" required>
  <div *ngIf="emailModel.invalid && emailModel.touched">
    Email é obrigatório.
  </div>

  <input name="password" type="password" ngModel #pwModel="ngModel" minlength="6">
  <button type="submit" [disabled]="loginForm.invalid">
    Entrar
  </button>
</form>

```

```html
<!-- Exemplo 3: Acessando componente-filho -->
<app-modal #modalRef="modalAPI" title="Aviso">
  Conteúdo do modal
</app-modal>

<button (click)="modalRef.open()">
  Abrir Modal
</button>

```

```html
<!-- Exemplo 4: Renderização dinâmica de ng-template -->
<ng-template #loadingTpl>
  <p>Carregando dados…</p>
</ng-template>

<div #vc></div> <!-- ViewContainerRef aqui -->

<button (click)="showLoading()">
  Mostrar Loading
</button>

```

```
export class DataComponent implements AfterViewInit {
  @ViewChild('loadingTpl') loadingTpl!: TemplateRef<any>;
  @ViewChild('vc', { read: ViewContainerRef }) vc!: ViewContainerRef;

  showLoading() {
    this.vc.clear();
    this.vc.createEmbeddedView(this.loadingTpl);
  }
}

```

---

## 5. Informações Adicionais

- **Diferença de Template Reference vs. Property Binding**
    - `#var` é resolvido **na renderização do template**; bindings como `[value]="prop"` vêm do componente TS.
- **Uso com Structural Directives**
    - Ao combinar com `ngIf; else tpl`, pode-se alternar templates:
        
        ```html
        <ng-template #elseTpl>Alternativa</ng-template>
        <div *ngIf="condicao; else elseTpl">
          Conteúdo principal
        </div>
        
        ```
        
- **Integração com @ViewChild e Ciclo de Vida**
    - Variáveis referenciadas com `#var` podem ser capturadas em `ngAfterViewInit` via `@ViewChild('var')`.

---

## 6. Referências para Estudo Independente

- **Angular Official Docs**
    - Template syntax (Template reference variables):
        
        [https://angular.io/guide/template-syntax#template-reference-variables](https://angular.io/guide/template-syntax#template-reference-variables)
        
    - Forms (NgModel & NgForm):
        
        [https://angular.io/guide/forms-overview](https://angular.io/guide/forms-overview)
        
    - ViewContainerRef & TemplateRef (Dynamic Components):
        
        [https://angular.io/api/core/ViewContainerRef](https://angular.io/api/core/ViewContainerRef)
        
- **Artigos e Tutoriais**
    - “Understanding Template Reference Variables in Angular” – DigitalOcean Tutorial
    - “Angular Dynamic Components and Templates” – Alligator.io
- **Livros**
    - “Angular Up & Running” (Shyam Seshadri)
    - “ng-book: The Complete Book on Angular” (Nathan Murray et al.)