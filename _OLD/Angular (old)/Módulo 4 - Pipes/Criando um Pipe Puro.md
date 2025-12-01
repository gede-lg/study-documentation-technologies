Um **pipe puro** é aquele que dá o mesmo output para o mesmo input, sem efeitos colaterais. Isso significa que o Angular pode otimizar a aplicação ao não recalculá-lo em cada ciclo de detecção de mudanças, a não ser que o input mude.

Para criar um pipe puro, você segue estes passos:

1. **Criação do Pipe**: Utilize o Angular CLI ou crie manualmente uma classe decorada com `@Pipe`.

   Utilizando o Angular CLI, o comando seria:

   ```bash
   ng generate pipe nome-do-pipe
   ```

   Se preferir criar manualmente, crie um arquivo `nome-do-pipe.pipe.ts` e adicione o seguinte código:

   ```typescript
   import { Pipe, PipeTransform } from '@angular/core';

   @Pipe({
     name: 'nomeDoPipe'
   })
   export class NomeDoPipePipe implements PipeTransform {
     transform(value: any, ...args: any[]): any {
       // Lógica do pipe
       return transformedValue;
     }
   }
   ```

2. **Implementação do PipeTransform**: Todo pipe deve implementar a interface `PipeTransform`, que exige a definição do método `transform()`. Este método é onde você coloca a lógica de transformação do dado.

   Exemplo: Vamos criar um pipe simples que duplica uma string.

   ```typescript
   import { Pipe, PipeTransform } from '@angular/core';

   @Pipe({
     name: 'duplicate'
   })
   export class DuplicatePipe implements PipeTransform {
     transform(value: string): string {
       return value.repeat(2);
     }
   }
   ```

### Usando o Pipe Criado

Após criar o pipe, você pode usá-lo em qualquer template Angular simplesmente passando os dados através do pipe, usando o símbolo de pipe (`|`) seguido pelo nome do pipe.

Exemplo de uso no template:

```html
<!-- Supondo que component.ts tenha uma propriedade chamada 'message' -->
<p>{{ message | duplicate }}</p>
```

Se `message` for `"Hello"`, a saída será `"HelloHello"`.

### Observações Importantes

- **Pipes Puros x Impuros**: Por padrão, pipes são puros. Um pipe impuro é marcado definindo a propriedade `pure: false` no objeto `@Pipe`. Pipes impuros são chamados em cada ciclo de detecção de mudança, o que pode levar a problemas de performance.
- **Passagem de Argumentos**: Pipes podem aceitar argumentos além do valor de entrada. Isso é feito passando os argumentos após o nome do pipe, separados por dois-pontos.

  Exemplo com argumento:

  ```typescript
  @Pipe({
    name: 'append'
  })
  export class AppendPipe implements PipeTransform {
    transform(value: string, toAppend: string): string {
      return value + toAppend;
    }
  }
  ```

  Uso no template:

  ```html
  <p>{{ message | append:'!!' }}</p>
  ```

  Se `message` for `"Hello"`, a saída será `"Hello!!"`.

- **Reutilização e Composição**: Pipes podem ser reutilizados em diferentes componentes e também podem ser encadeados para realizar transformações complexas.

Pipes são uma ferramenta elegante e poderosa no Angular, permitindo uma separação clara da lógica de transformação dos dados da lógica do componente, mantendo os templates limpos e expressivos.