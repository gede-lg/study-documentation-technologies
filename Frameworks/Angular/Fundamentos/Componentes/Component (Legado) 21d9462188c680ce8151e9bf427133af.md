# Component (Legado)

Olá Gedê\! A.R.I.A. está pronta para te ajudar. Preparei uma explicação extremamente detalhada sobre Componentes em Angular, cobrindo todos os pontos que você solicitou. Vamos mergulhar fundo neste que é o principal bloco de construção de qualquer aplicação Angular.

---

### **Título: Desvendando os Componentes Angular: A Espinha Dorsal das Aplicações Modernas**

### **Introdução**

No ecossistema Angular, os componentes são os blocos de construção fundamentais e centrais de qualquer interface de usuário (UI). Cada aplicação Angular pode ser vista como uma árvore de componentes, onde cada componente é responsável por uma porção específica da tela. Ele encapsula o template HTML, a lógica de apresentação (em TypeScript) e os estilos (CSS) necessários para renderizar essa porção da UI, tornando o desenvolvimento mais modular, reutilizável e fácil de gerenciar.

### **Sumário**

Esta explicação detalhada abordará a anatomia completa de um Componente Angular. Iniciaremos com seus conceitos fundamentais, explorando o que são e qual seu propósito. Em seguida, detalharemos a sintaxe de sua criação, o decorador `@Component` e todas as suas propriedades de metadados. Analisaremos o ciclo de vida de um componente, as formas de comunicação entre eles (`@Input`, `@Output`), e as melhores práticas para construir componentes robustos e reutilizáveis. Por fim, apresentaremos exemplos práticos e completos para solidificar o conhecimento.

---

### **Conceitos Fundamentais**

A principal ideia por trás dos componentes é a **Componentização**, um padrão de arquitetura que divide a interface do usuário em pedaços independentes, reutilizáveis e autocontidos. Pense em uma página web como um quebra-cabeça: cada peça é um componente. Temos o componente de cabeçalho, o de menu lateral, o de lista de produtos, o de rodapé, etc.

Um Componente Angular é, essencialmente, uma classe TypeScript que é decorada com o metadado `@Component`. Este decorador informa ao Angular que a classe é um componente e fornece a configuração necessária para que ele funcione, como seu seletor CSS, seu template HTML e seus estilos.

O propósito de um componente é:

- **Controlar uma parte da UI:** Cada componente gerencia uma porção da tela, chamada de "visão" (view).
- **Encapsular Lógica:** A lógica de como a visão funciona (o que acontece quando um botão é clicado, como os dados são formatados, etc.) é contida dentro da classe do componente.
- **Ser Reutilizável:** Um componente bem projetado pode ser usado em diferentes partes da aplicação sem a necessidade de reescrever o código. Por exemplo, um componente de "cartão de usuário" pode ser usado em uma lista de amigos, em um resultado de busca e em uma página de perfil.

---

### **Sintaxe e Uso**

Um componente é definido por uma classe TypeScript e o decorador `@Component`.

```tsx
// Importa o decorador Component do core do Angular
import { Component } from '@angular/core';

// Decorador @Component que define os metadados
@Component({
  selector: 'app-hello-world', // Seletor CSS para usar este componente no HTML
  standalone: true, // A partir do Angular 14, indica que o componente não precisa ser declarado em um NgModule.
  imports: [], // Necessário para componentes 'standalone', para importar outras dependências.
  templateUrl: './hello-world.component.html', // Caminho para o arquivo HTML do template
  styleUrls: ['./hello-world.component.css'] // Array com caminhos para os arquivos de estilo
})
// A classe do componente, que contém a lógica
export class HelloWorldComponent {
  // Propriedades (estado) do componente
  message: string = 'Olá, Mundo!';
  author: string = 'A.R.I.A.';

  // Métodos (comportamentos) do componente
  constructor() {
    // O construtor é usado principalmente para injeção de dependências
  }

  showMessage(): void {
    alert(`Mensagem de ${this.author}: ${this.message}`);
  }
}

```

**Uso no HTML:**

Para usar este componente, você simplesmente utiliza o seletor definido (`app-hello-world`) como uma tag HTML em outro template de componente ou no `index.html`.

```html
<h1>Minha Aplicação</h1>
<app-hello-world></app-hello-world>

```

---

### **Metadados/Propriedades do Decorador `@Component`**

O decorador `@Component` aceita um objeto de configuração com várias propriedades. Vamos passar por todas elas.

| Propriedade | Tipo | Descrição Detalhada |
| --- | --- | --- |
| `selector` | `string` | **(Essencial)** Define o seletor CSS que o Angular usará para encontrar um elemento na DOM e instanciar este componente. Pode ser um nome de tag (`app-root`), um atributo (`[app-component]`) ou uma classe (`.app-component`). A convenção é usar um prefixo (como `app-`) para evitar colisões com tags HTML padrão. |
| `template` | `string` | Permite definir o HTML do componente diretamente no arquivo TypeScript como uma string. Ideal para templates muito pequenos (2-3 linhas). Para templates maiores, use `templateUrl`. |
| `templateUrl` | `string` | **(Comum)** O caminho relativo para um arquivo HTML externo que contém o template do componente. Esta é a abordagem mais comum e recomendada para manter a separação de responsabilidades. |
| `styleUrls` | `string[]` | **(Comum)** Um array de strings contendo os caminhos relativos para os arquivos de estilo (CSS, SCSS, etc.) que se aplicam a este componente. Os estilos são encapsulados por padrão. |
| `styles` | `string[]` | Similar ao `styleUrls`, mas permite definir os estilos diretamente como um array de strings dentro do arquivo TypeScript. Útil para estilos muito simples e pequenos. |
| `standalone` | `boolean` | Introduzido no Angular 14. Quando `true`, o componente gerencia suas próprias dependências através da propriedade `imports` e não precisa ser declarado em um `NgModule`. Simplifica a arquitetura. |
| `imports` | `any[]` | Usado com `standalone: true`. É um array de outros componentes, diretivas, pipes ou `NgModules` que o template deste componente utiliza. |
| `providers` | `Provider[]` | Um array de provedores de serviços para injeção de dependência. Quando um serviço é provido em um componente, uma nova instância daquele serviço é criada para cada instância do componente. |
| `changeDetection` | `ChangeDetectionStrategy` | Define a estratégia de detecção de mudanças. Os valores podem ser `ChangeDetectionStrategy.Default` (verifica o componente e seus filhos sempre que algo muda na aplicação) ou `ChangeDetectionStrategy.OnPush` (só verifica quando suas propriedades `@Input` mudam, um evento se origina dele, ou é marcado manualmente para verificação). `OnPush` oferece uma grande melhoria de performance. |
| `encapsulation` | `ViewEncapsulation` | Define como os estilos do componente são encapsulados. `ViewEncapsulation.Emulated` (padrão): Emula o Shadow DOM, reescrevendo o CSS para escopar os estilos ao componente. `ViewEncapsulation.None`: Os estilos não são encapsulados e se aplicam globalmente. `ViewEncapsulation.ShadowDom`: Usa o Shadow DOM nativo do navegador para encapsulamento. |
| `moduleId` | `string` | **(Depreciado)** Usado em sistemas de módulos mais antigos (como SystemJS) para resolver caminhos relativos para `templateUrl` e `styleUrls`. Com o Angular CLI e Webpack, não é mais necessário. |
| `animations` | `any[]` | Um array de `triggers` de animação para o componente, definidos usando as funções do `@angular/animations`. |
| `interpolation` | `[string, string]` | Permite customizar os delimitadores de interpolação `{{` e `}}`. Por exemplo, `interpolation: ['[[', ']]']` mudaria `{{ message }}` para `[[ message ]]`. É raramente utilizado. |
| `viewProviders` | `Provider[]` | Similar ao `providers`, mas os serviços aqui declarados só estão disponíveis para o próprio componente e seus descendentes na *view* (elementos dentro do seu template), não para o conteúdo projetado com `<ng-content>`. |
| `queries` | `{ [key: string]: any; }` | Configura queries (`@ViewChild`, `@ContentChild`, etc.) que podem ser resolvidas antes da detecção de mudanças. É um uso avançado e menos comum. |
| `schemas` | `Schema[]` | Define um conjunto de esquemas que declaram elementos e propriedades permitidos no template que não são componentes ou diretivas Angular. `CUSTOM_ELEMENTS_SCHEMA` permite usar Web Components, e `NO_ERRORS_SCHEMA` desliga a verificação de erros (não recomendado para produção). Usado principalmente em `NgModule`. |

---

### **Restrições de Uso**

Embora os componentes sejam a base de tudo, existem cenários onde eles não são a melhor ferramenta:

1. **Manipulação Pura de DOM:** Se você precisa apenas adicionar um comportamento ou modificar o estilo de um elemento DOM existente (ex: um tooltip que aparece ao passar o mouse), uma **Diretiva de Atributo** é muito mais leve e apropriada. Criar um componente para isso adicionaria um elemento extra desnecessário na árvore DOM.
2. **Lógica de Negócio Reutilizável:** Lógica que não está diretamente atrelada a uma view específica (ex: fazer chamadas HTTP para uma API, gerenciar o estado global da aplicação, cálculos complexos) deve ser extraída para um **Serviço Injetável**. Componentes devem focar na lógica de apresentação.
3. **Formatação de Dados no Template:** Para transformar dados diretamente no template (ex: formatar uma data, converter texto para maiúsculas, filtrar uma lista), um **Pipe** é a ferramenta correta, pois é mais performático e declarativo.

---

### **Elementos Associados**

Um componente não vive isolado. Ele interage com vários outros elementos do framework Angular.

### **1. Ciclo de Vida (Lifecycle Hooks)**

O Angular gerencia a criação, renderização, verificação de dados e destruição de um componente. Podemos "enganchar" nesses momentos através de métodos especiais, chamados Lifecycle Hooks. Eles são métodos de interface que a sua classe de componente pode implementar.

| Hook | Propósito |
| --- | --- |
| `constructor()` | **(Não é um hook do Angular)** Ocorre antes de tudo. Usado para inicialização básica e injeção de dependência. **Não** acesse propriedades `@Input` aqui, elas ainda não estarão disponíveis. |
| `ngOnChanges` | Chamado antes do `ngOnInit` e sempre que uma ou mais propriedades de entrada (`@Input`) do componente mudam. Recebe um objeto `SimpleChanges` com os valores atuais e anteriores. |
| `ngOnInit` | Chamado **uma única vez** após o primeiro `ngOnChanges`. É o local ideal para inicializar a lógica do componente, buscar dados de um serviço, etc. |
| `ngDoCheck` | Chamado imediatamente após `ngOnChanges` em cada ciclo de detecção de mudanças, e após `ngOnInit` na primeira vez. Permite implementar sua própria lógica de detecção de mudanças. Use com cuidado, pois é chamado com muita frequência. |
| `ngAfterContentInit` | Chamado **uma única vez** depois que o Angular projeta conteúdo externo no componente (usando `<ng-content>`). |
| `ngAfterContentChecked` | Chamado após `ngAfterContentInit` e a cada `ngDoCheck` subsequente. Ocorre após o conteúdo projetado ter sido verificado. |
| `ngAfterViewInit` | Chamado **uma única vez** depois que a view do componente (e as views de seus filhos) foi completamente inicializada. É aqui que você pode interagir com segurança com elementos do template (via `@ViewChild`). |
| `ngAfterViewChecked` | Chamado após `ngAfterViewInit` e a cada `ngAfterContentChecked` subsequente. Ocorre após a view do componente ter sido verificada. |
| `ngOnDestroy` | Chamado **uma única vez**, imediatamente antes do componente ser destruído. É o local perfeito para limpar recursos, como desinscrever-se de `Observables` para evitar vazamentos de memória. |

### **2. Comunicação entre Componentes**

- **`@Input()` (Pai para Filho):** Permite que um componente pai passe dados para um componente filho.
    
    ```tsx
    // no componente filho (ex: user-profile.component.ts)
    import { Component, Input } from '@angular/core';
    @Component({ selector: 'app-user-profile', ... })
    export class UserProfileComponent {
      @Input() userName: string = ''; // Declara uma propriedade de entrada
    }
    
    // no template do componente pai
    <app-user-profile [userName]="'Gedê'"></app-user-profile>
    
    ```
    
- **`@Output()` (Filho para Pai):** Permite que um componente filho emita eventos para o componente pai. Usa a classe `EventEmitter`.
    
    ```tsx
    // no componente filho (ex: vote.component.ts)
    import { Component, Output, EventEmitter } from '@angular/core';
    @Component({ selector: 'app-vote', ... })
    export class VoteComponent {
      @Output() voted = new EventEmitter<boolean>(); // Declara um evento de saída
    
      vote(agreed: boolean) {
        this.voted.emit(agreed); // Emite o evento com um payload
      }
    }
    
    // no template do componente pai
    <app-vote (voted)="onVote($event)"></app-vote>
    // no .ts do pai, haveria um método onVote(agreed: boolean) { ... }
    
    ```
    

### **3. Injeção de Dependência e Serviços**

Componentes devem delegar tarefas complexas (como buscar dados) para **Serviços**. O Angular injeta esses serviços no construtor do componente.

```tsx
// user.service.ts
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers() { /* ... lógica para buscar usuários ... */ }
}

// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({ ... })
export class UserListComponent implements OnInit {
  users: any[];

  // O Angular 'injeta' uma instância de UserService aqui
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users = this.userService.getUsers();
  }
}

```

---

### **Melhores Práticas e Casos de Uso**

- **Princípio da Responsabilidade Única (SRP):** Cada componente deve ter uma única responsabilidade. Um componente monolítico que faz tudo (busca dados, exibe lista, edita item, mostra detalhes) é difícil de manter. Quebre-o em componentes menores: `user-list`, `user-list-item`, `user-edit-form`.
- **Componentes "Dumb" vs "Smart":**
    - **Smart Components (Componentes de Container):** São os componentes que conhecem o estado da aplicação. Eles se comunicam com serviços, gerenciam dados e passam esses dados para os componentes "burros".
    - **Dumb Components (Componentes de Apresentação):** Apenas recebem dados via `@Input` e emitem eventos via `@Output`. Eles não sabem de onde os dados vêm ou o que acontece quando um evento é emitido. São altamente reutilizáveis.
- **Use `OnPush` Change Detection:** Para componentes de apresentação ("dumb"), use `changeDetection: ChangeDetectionStrategy.OnPush`. Isso melhora drasticamente a performance, pois o Angular não precisa reverificar o componente a cada pequena mudança na aplicação.
- **Organização de Arquivos:** Mantenha os arquivos de um componente (`.ts`, `.html`, `.css`, `.spec.ts`) juntos em uma mesma pasta.
- **Use Interfaces:** Defina interfaces para os objetos que você passa via `@Input`. Isso torna seu código mais robusto e fácil de entender.

---

### **Exemplos Completos**

Vamos criar um cenário simples de uma lista de tarefas, Gedê. Teremos um componente "pai" (`app.component`) que gerencia a lista e um componente "filho" (`task-item.component`) que exibe uma única tarefa e permite marcá-la como concluída ou excluí-la.

### **Filho: `task-item.component.ts`**

```tsx
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para ngClass, ngIf, etc.

// Definindo uma interface para o objeto de tarefa
export interface Task {
  id: number;
  title: string;
  isDone: boolean;
}

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-item" [ngClass]="{ 'done': task.isDone }">
      <span>{{ task.title }}</span>
      <div class="actions">
        <button (click)="toggleDone()">{{ task.isDone ? 'Refazer' : 'Concluir' }}</button>
        <button (click)="deleteTask()">Excluir</button>
      </div>
    </div>
  `,
  styles: [`
    .task-item { display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #ccc; }
    .task-item.done span { text-decoration: line-through; color: grey; }
    .actions button { margin-left: 8px; }
  `]
})
export class TaskItemComponent {
  // Recebe o objeto da tarefa do componente pai
  @Input({ required: true }) task!: Task;

  // Emite um evento quando a tarefa é marcada/desmarcada como concluída
  @Output() taskToggled = new EventEmitter<number>();
  // Emite um evento quando a tarefa deve ser excluída
  @Output() taskDeleted = new EventEmitter<number>();

  toggleDone() {
    this.taskToggled.emit(this.task.id);
  }

  deleteTask() {
    this.taskDeleted.emit(this.task.id);
  }
}

```

### **Pai: `app.component.ts`**

```tsx
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskItemComponent } from './task-item/task-item.component'; // Importa o filho e a interface

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskItemComponent], // Importa o componente filho
  template: `
    <div class="container">
      <h1>Minha Lista de Tarefas</h1>
      <div *ngFor="let task of tasks">
        <app-task-item
          [task]="task"
          (taskToggled)="onTaskToggled($event)"
          (taskDeleted)="onTaskDeleted($event)">
        </app-task-item>
      </div>
    </div>
  `,
  styles: [`.container { max-width: 600px; margin: auto; }`]
})
export class AppComponent {
  tasks: Task[] = [
    { id: 1, title: 'Estudar Componentes Angular com a A.R.I.A.', isDone: true },
    { id: 2, title: 'Começar projeto com Go', isDone: false },
    { id: 3, title: 'Planejar detalhes do casamento com a Ju', isDone: false }
  ];

  onTaskToggled(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.isDone = !task.isDone;
      console.log(`Tarefa ${taskId} foi alterada.`);
    }
  }

  onTaskDeleted(taskId: number): void {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    console.log(`Tarefa ${taskId} foi excluída.`);
  }
}

```

Neste exemplo completo, o `AppComponent` (Smart) mantém a lista de tarefas e a lógica para alterá-la. Ele renderiza vários `TaskItemComponent` (Dumb), passando a cada um a sua respectiva tarefa via `@Input`. Quando o usuário clica nos botões dentro de `TaskItemComponent`, ele não altera o estado diretamente, mas emite eventos (`@Output`) que o `AppComponent` ouve para então executar a lógica de negócio.

---

### **Tópicos para Aprofundamento**

1. **Módulos Angular (`@NgModule`):** Entender como os componentes eram organizados antes da era `standalone` e como os módulos ainda são usados para organizar aplicações maiores.
2. **Diretivas e Pipes:** Aprofundar-se nos outros dois tipos de "blocos de construção" de templates do Angular.
3. **Roteamento (Angular Router):** Aprender como navegar entre diferentes "páginas" (que na verdade são componentes sendo renderizados) em uma Single Page Application (SPA).
4. **Gerenciamento de Estado:** Estudar padrões e bibliotecas como NgRx ou Akita para gerenciar estados complexos e compartilhados em aplicações grandes.
5. **Testes de Componentes:** Aprender a escrever testes unitários e de integração para seus componentes usando o Angular Testing Framework (com Karma e Jasmine).

Espero que esta explicação super detalhada tenha esclarecido tudo sobre os componentes em Angular, Gedê\! Se tiver qualquer outra dúvida, pode perguntar.