Claro, vamos explorar o conceito de **Diretivas Data Bindings** no Angular, com foco especial nas **Output Properties**.

### O que é Data Binding?

No Angular, **Data Binding** é um conceito fundamental que permite a comunicação entre o modelo de dados da aplicação e a representação visual desses dados (a interface do usuário). Existem várias formas de data binding, como:

- **Interpolation** (`{{value}}`),
- **Property Binding** (`[property]="value"`),
- **Event Binding** (`(event)="handler()"`),
- **Two-Way Binding** (`[(ngModel)]="property"`).

Esses métodos permitem a sincronização de dados entre o modelo (componentes) e a visão (templates HTML), facilitando a construção de interfaces dinâmicas.

### Output Properties

As **Output Properties** são uma parte crucial do data binding no Angular, especificamente usadas para emitir eventos de um componente filho para um componente pai. Isso é especialmente útil em arquiteturas de aplicativos complexas onde os componentes precisam se comunicar e passar dados entre si de forma eficaz.

#### O que é?

Uma **Output Property** é uma propriedade de um componente que pode ser usada para enviar dados para fora do componente. No Angular, isso é geralmente realizado com a ajuda do decorador `@Output()`, que marca uma propriedade de um componente como uma porta de saída para eventos.

#### Para que serve?

Serve para criar uma forma de comunicação de eventos baseada em componentes, permitindo que um componente filho notifique e transmita informações para o componente pai. Isso é útil para modularizar a aplicação e permitir a comunicação entre componentes sem a necessidade de criar acoplamentos fortes entre eles.

#### Sintaxe (@Output)

A sintaxe básica envolve a importação do decorador `@Output` e da classe `EventEmitter` do pacote `@angular/core`. A propriedade decorada com `@Output()` é então instanciada como um novo `EventEmitter`, que pode emitir eventos específicos.

```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<button (click)="sendData()">Send Data to Parent</button>`
})
export class ChildComponent {
  @Output() dataEmitter = new EventEmitter<string>();

  sendData() {
    this.dataEmitter.emit('Data from child');
  }
}
```

Neste exemplo, o componente filho tem um botão. Quando clicado, o método `sendData()` é chamado, emitindo um evento através de `dataEmitter` com a string `'Data from child'`. O componente pai pode então ouvir esse evento e reagir a ele.

### Implementação no Componente Pai

Para capturar o evento emitido pelo componente filho, o componente pai precisa adicionar um manipulador de eventos no template onde o componente filho é declarado.

```html
<app-child (dataEmitter)="handleData($event)"></app-child>
```

E no componente pai TypeScript:

```typescript
@Component({
  selector: 'app-parent',
  template: `<div>Received data: {{receivedData}}</div>
             <app-child (dataEmitter)="handleData($event)"></app-child>`
})
export class ParentComponent {
  receivedData: string;

  handleData(data: string) {
    this.receivedData = data;
  }
}
```

Aqui, quando o `dataEmitter` do `ChildComponent` emite um evento, o `handleData` do `ParentComponent` é chamado, passando os dados emitidos (`'Data from child'`) como argumento, que são então armazenados em `receivedData` e podem ser usados no template do componente pai.