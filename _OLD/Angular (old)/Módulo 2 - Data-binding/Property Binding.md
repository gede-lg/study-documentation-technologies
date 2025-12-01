### O que é?

O **Property Binding** é um tipo de Data Binding usado no Angular para definir valores para propriedades de elementos HTML ou componentes baseados em dados do componente Angular. Ele permite que você vincule propriedades de elementos do DOM às propriedades do componente TypeScript, tornando os dados dinâmicos e responsivos às alterações no estado da aplicação.

### Para que serve?

O **Property Binding** serve para dinamizar o conteúdo de um aplicativo Angular, permitindo que a interface do usuário reflita o estado atual dos dados do modelo. Por exemplo, você pode usar o Property Binding para controlar dinamicamente as propriedades de um elemento, como `disabled`, `href`, `title`, e muitas outras, baseando-se em valores ou condições definidas no seu componente TypeScript.

### Sintaxe

A sintaxe básica do **Property Binding** utiliza colchetes `[]` em torno do nome da propriedade que você deseja vincular no seu template HTML. O valor dentro dos colchetes é o nome da propriedade do seu componente TypeScript que você deseja vincular à propriedade do elemento.

**Exemplo de código:**

Suponha que você tenha um componente Angular com uma propriedade chamada `pageTitle`, e você deseja vincular essa propriedade ao atributo `title` de um elemento HTML. O código do seu componente TypeScript pode parecer com isso:

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'Bem-vindo ao meu aplicativo!';
}
```

E no template HTML do componente, você usaria o Property Binding da seguinte forma:

```html
<h1 [title]="pageTitle">Olá, mundo!</h1>
```

Neste exemplo, o valor da propriedade `pageTitle` do componente é vinculado à propriedade `title` do elemento `<h1>`. Isso significa que o atributo `title` do `<h1>` (aquele que aparece como uma dica de ferramenta quando você passa o mouse sobre o elemento) será atualizado para refletir o valor de `pageTitle`.