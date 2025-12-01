Claro, vamos detalhar o tema "Template Driven no Angular" abordando os tópicos que você mencionou. Vou fornecer explicações detalhadas e exemplos de código para cada conceito.

### Conceitos Básicos

#### NgForm
- **O que é e para que serve**: `NgForm` é uma diretiva do Angular que representa um formulário. Ela permite o rastreamento do estado de validade e do valor de todos os controles dentro do formulário.
- **Sintaxe**: Utiliza-se a diretiva `ngForm` como um atributo em um elemento de formulário HTML. Exemplo:
  ```html
  <form #meuForm="ngForm">
    <!-- campos do formulário aqui -->
  </form>
  ```

#### NgSubmit
- **O que é e para que serve**: `NgSubmit` é um evento que é disparado quando o formulário é submetido. É usado para executar uma função no componente quando o usuário submete o formulário.
- **Sintaxe**: Vincula-se ao evento de envio do formulário. Exemplo:
  ```html
  <form (ngSubmit)="minhaFuncaoSubmit()">
    <!-- campos do formulário aqui -->
  </form>
  ```

#### [(NgModel)]
- **O que é e para que serve**: `[(NgModel)]` é uma diretiva que implementa a vinculação bidirecional de dados entre um input do formulário e uma propriedade no componente.
- **Sintaxe**: Vincula um elemento de entrada a uma propriedade do componente. Exemplo:
  ```html
  <input [(ngModel)]="minhaPropriedade" name="nome">
  ```

#### NgModelGroup
- **O que é e para que serve**: `NgModelGroup` permite agrupar um conjunto de controles e rastrear o estado e a validade do grupo como um todo.
- **Sintaxe**: Utiliza-se para criar subgrupos dentro de um formulário. Exemplo:
  ```html
  <div ngModelGroup="grupo">
    <!-- controles do grupo aqui -->
  </div>
  ```

### Criando um Formulário com NgForm e NgSubmit

1. **Estrutura HTML**:
   ```html
   <form #meuForm="ngForm" (ngSubmit)="minhaFuncaoSubmit()">
     <!-- campos do formulário aqui -->
   </form>
   ```

2. **Componente TypeScript**:
   ```typescript
   minhaFuncaoSubmit() {
     // lógica de submissão aqui
   }
   ```

### Criando Campos do Formulário e Ligando-os com [(NgModel)]

1. **Adicionando Campos**:
   ```html
   <form #meuForm="ngForm" (ngSubmit)="minhaFuncaoSubmit()">
     <input type="text" [(ngModel)]="nome" name="nome">
     <input type="email" [(ngModel)]="email" name="email">
   </form>
   ```

2. **Componente TypeScript**:
   ```typescript
   nome: string;
   email: string;
   ```

### Criando Validações no Template Driven e Mostrando Mensagens de Erro

1. **Adicionando Validações**:
   ```html
   <input type="text" [(ngModel)]="nome" name="nome" required>
   <div *ngIf="meuForm.controls.nome?.invalid && meuForm.controls.nome?.touched">
     Nome é obrigatório.
   </div>
   ```

### Resetando o Formulário Template Driven

1. **Resetando via Componente**:
   ```typescript
   @ViewChild('meuForm') meuForm: NgForm;

   resetarFormulario() {
     this.meuForm.reset();
   }
   ```

### Observações Adicionais

- É importante nomear cada controle no seu formulário. Isso é necessário para que o Angular possa rastrear os valores e o estado de validação.
- A validação de formulários no Angular pode ser estendida com validadores customizados, se necessário.
- Para formulários mais complexos, considere usar Reactive Forms, que oferece mais flexibilidade e controle.

Espero que esta explicação detalhada ajude a compreender o funcionamento dos formulários Template Driven no Angular!