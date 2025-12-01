Diferente dos Pipes puros, que só executam a transformação quando detectam uma mudança pura nos inputs (como mudanças em valores primitivos ou alterações de referência de objetos/arrays), um Pipe impuro é executado em cada ciclo de detecção de mudanças, o que pode ser útil para dados que mudam de maneira imprevisível ou para operações que dependem de valores externos ao componente.

Para criar um Pipe impuro, você segue basicamente os mesmos passos para criar um Pipe puro, mas define a propriedade `pure` como `false` na anotação `@Pipe`.

### Passo a Passo

1. **Criar o Pipe:**

   Primeiro, gere um novo Pipe usando a CLI do Angular:

   ```bash
   ng generate pipe nome-do-seu-pipe
   ```

   Isso criará um arquivo para o seu Pipe com um esqueleto básico.

2. **Modificar o Pipe para ser Impuro:**

   No arquivo gerado, modifique o decorator `@Pipe` para incluir `pure: false`:

   ```typescript
   import { Pipe, PipeTransform } from '@angular/core';

   @Pipe({
     name: 'seuPipeImpuro',
     pure: false
   })
   export class SeuPipeImpuroPipe implements PipeTransform {
     transform(value: any, ...args: any[]): any {
       // Sua lógica de transformação aqui
     }
   }
   ```

3. **Implementar a Lógica de Transformação:**

   Dentro do método `transform`, implemente a lógica que irá transformar o valor de entrada em algo que você deseja exibir na UI.

   Por exemplo, um Pipe impuro que filtra uma lista de itens baseada em alguma propriedade que pode mudar dinamicamente:

   ```typescript
   transform(items: any[], filter: string): any[] {
     if (!items || !filter) {
       return items;
     }
     return items.filter(item => item.propriedade.indexOf(filter) !== -1);
   }
   ```

## Usando o Pipe Criado

Depois de criar seu Pipe impuro, você pode usá-lo em seus templates Angular da seguinte maneira:

```html
<div *ngFor="let item of (itens | seuPipeImpuro: filtro)">
  {{ item | json }}
</div>
```

Neste exemplo, `itens` é uma lista de objetos e `filtro` é a string de filtro que é passada para o Pipe. O Pipe filtra os itens baseados na presença da string de filtro em uma `propriedade` específica dos objetos.

## Observações Importantes

- **Performance:** Pipes impuros são executados em cada ciclo de detecção de mudanças, o que pode levar a problemas de performance se não forem usados com cuidado, especialmente em aplicações grandes ou complexas.
- **Uso Consciente:** Avalie a necessidade de usar um Pipe impuro. Em muitos casos, uma combinação de Pipes puros e técnicas de gerenciamento de estado pode resolver o problema de forma mais eficiente.

## Conclusão

Pipes impuros no Angular oferecem uma maneira flexível de trabalhar com dados dinâmicos nos templates. No entanto, é crucial usá-los de maneira consciente devido às implicações de performance. Compreender como e quando usar Pipes impuros pode ajudar a criar aplicações Angular mais dinâmicas e responsivas.