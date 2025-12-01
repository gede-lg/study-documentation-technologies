### O que é?

Event Binding é uma forma de data binding que permite que você escute por eventos no DOM (como cliques, movimentos de mouse, entradas de teclado, etc.) e execute uma expressão ou função definida no componente Angular em resposta. É uma parte crucial para criar interações dinâmicas dentro de suas aplicações Angular.

### Para que serve?

O Event Binding é utilizado para adicionar comportamentos interativos à sua aplicação Angular sem a necessidade de recorrer à manipulação direta do DOM. Por exemplo, você pode usar event binding para capturar cliques de botão, entradas de formulário, movimentos de mouse, e mais, executando lógica de aplicativo definida em seu componente Angular como resposta a esses eventos.

### Sintaxe

A sintaxe básica do event binding envolve colocar o nome do evento entre parênteses e atribuir a ele uma expressão ou chamada de função que você deseja que seja executada quando o evento ocorrer. Veja abaixo um exemplo de como isso pode ser feito:

```html
<button (click)="onButtonClick()">Clique-me</button>
```

No componente TypeScript, você definiria a função `onButtonClick` que será chamada quando o botão for clicado:

```typescript
@Component({
  selector: 'app-exemplo',
  templateUrl: './exemplo.component.html',
  styleUrls: ['./exemplo.component.css']
})
export class ExemploComponent {
  onButtonClick() {
    console.log('Botão clicado!');
  }
}
```

### Exemplo Completo de Event Binding

Vamos considerar um exemplo onde queremos capturar o evento de clique de um botão para incrementar um contador:

**HTML:**

```html
<button (click)="incrementar()">Incrementar</button>
<p>Contagem: {{ contagem }}</p>
```

**Componente TypeScript:**

```typescript
@Component({
  selector: 'app-contador',
  template: './contador.component.html'
})
export class ContadorComponent {
  contagem = 0;

  incrementar() {
    this.contagem++;
  }
}
```

Neste exemplo, cada vez que o botão é clicado, a função `incrementar` é chamada, incrementando o valor de `contagem`. Graças ao Data Binding, o valor atualizado de `contagem` é automaticamente refletido na view.