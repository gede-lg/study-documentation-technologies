# Criando um pipe puro

E aí, Gedê\! Beleza? A.R.I.A. por aqui para te ajudar com o tema de **Pipes Puros no Angular**. Como desenvolvedor Backend Java e em transição para Go, sei que você valoriza clareza e eficiência, então vamos direto ao ponto.

---

## 1\. Introdução

No desenvolvimento de aplicações web modernas, a **exibição e formatação de dados** são tarefas rotineiras. O Angular, um dos frameworks front-end mais populares, oferece uma ferramenta poderosa para lidar com isso: os **Pipes**. Eles permitem transformar dados antes de exibi-los no template, de forma declarativa e reativa. A relevância dos Pipes está na sua capacidade de manter o template limpo e legível, isolando a lógica de transformação dos dados e promovendo a reutilização de código.

Um **Pipe no Angular** é uma função que você pode usar em expressões de template para transformar dados antes de exibi-los. Ele pega um valor de entrada, aplica uma transformação e retorna um novo valor formatado.

---

## 2\. Sumário

Nesta explicação, abordaremos os seguintes tópicos:

- **Pipes Puros vs. Impuros**: Entendendo a diferença crucial entre os tipos de pipes.
- **Criando um Pipe Puro**: O passo a passo para desenvolver seu próprio pipe puro customizado.
- **Sintaxe e Estrutura**: Como a declaração e o uso de pipes funcionam.
- **Componentes Principais**: A interface `PipeTransform` e o decorador `@Pipe`.
- **Restrições de Uso**: Quando um pipe puro pode não ser a melhor opção.
- **Exemplos de Código Otimizados**: Casos de uso práticos para pipes puros.
- **Informações Adicionais**: Prós, contras e quando usar ou evitar pipes puros.
- **Referências para Estudo Independente**: Recursos para aprofundar seus conhecimentos.

---

## 3\. Conteúdo Detalhado

### Pipes Puros vs. Impuros

A principal distinção no mundo dos Pipes do Angular é entre **Puros** e **Impuros**.

- **Pipes Puros (Pure Pipes)**:
    - São o padrão no Angular (todos os pipes built-in são puros por padrão, como `DatePipe`, `CurrencyPipe`, `UpperCasePipe`).
    - **Reexecutam apenas quando a entrada é uma mudança puramente imutável.** Isso significa que o pipe só será executado se o valor de entrada for uma nova referência primitiva (string, number, boolean, symbol) ou uma nova referência de objeto/array.
    - Não reagem a mudanças dentro de objetos ou arrays, apenas se o objeto ou array em si for substituído por um novo.
    - São mais performáticos, pois o Angular pode otimizar as verificações de mudança.
- **Pipes Impuros (Impure Pipes)**:
    - Devem ser explicitamente marcados como `pure: false` no decorador `@Pipe`.
    - **Reexecutam a cada ciclo de detecção de mudanças do Angular**, independentemente de o valor de entrada ter mudado ou não. Isso inclui mudanças de referência e mudanças internas dentro de objetos ou arrays.
    - São menos performáticos e devem ser usados com cautela, pois podem causar problemas de desempenho se usados em excesso. Um exemplo comum de pipe impuro é o `AsyncPipe`.

### Criando um Pipe Puro

Para criar um pipe puro, você precisa seguir alguns passos:

1. **Gerar o Pipe**: Você pode usar o Angular CLI para gerar um pipe:
    
    ```bash
    ng generate pipe meu-pipe-personalizado
    # ou a forma curta
    ng g p meu-pipe-personalizado
    
    ```
    
    Isso criará um arquivo `meu-pipe-personalizado.pipe.ts` e o registrará no `app.module.ts`.
    
2. **Implementar a Interface `PipeTransform`**: Seu pipe deve implementar a interface `PipeTransform` e seu método `transform`.
3. **Aplicar o Decorador `@Pipe`**: O decorador `@Pipe` é usado para configurar o pipe, e por padrão, `pure` é `true`.

### Sintaxe e Estrutura

### Declaração de um Pipe Puro

```tsx
// meu-pipe-personalizado.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meuPipePersonalizado',
  pure: true // Opcional, é true por padrão
})
export class MeuPipePersonalizadoPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    // Lógica de transformação aqui
    // value é o valor de entrada
    // args são argumentos adicionais passados para o pipe
    return value;
  }
}

```

### Utilização no Template

Uma vez declarado e importado no módulo Angular apropriado, você pode usar seu pipe no template de um componente:

```html
<p>Valor Original: {{ meuValor }}</p>
<p>Valor Transformado: {{ meuValor | meuPipePersonalizado }}</p>

<p>Valor com Argumento: {{ meuValor | meuPipePersonalizado:'argumentoExtra' }}</p>

```

### Componentes Principais e Associados

- **`@Pipe` Decorador**:
    - Metadata para o pipe.
    - **`name`**: (Obrigatório) Define o nome que você usará no template para invocar o pipe. Deve ser único dentro do seu projeto.
    - **`pure`**: (Opcional, padrão `true`) Define se o pipe é puro ou impuro. Para pipes puros, não há necessidade de definir, mas é bom entender sua existência.
- **`PipeTransform` Interface**:
    - Define o método `transform()`. Todo pipe deve implementar esta interface.
    - **`transform(value: any, ...args: any[]): any`**:
        - `value`: O primeiro argumento é o valor que o pipe está transformando.
        - `...args`: Parâmetros opcionais que podem ser passados para o pipe após o `|` e o nome do pipe. Por exemplo, `{{ data | date:'shortDate' }}` onde `'shortDate'` é um argumento.
        - Retorna o valor transformado.

### Restrições de Uso

Pipes puros são ótimos para a maioria das transformações, mas têm suas limitações:

- **Não reagem a mutações internas de objetos/arrays**: Se você tem um array e adiciona ou remove um item (mutando o array original), um pipe puro não será reexecutado porque a referência do array não mudou. Para esses casos, você precisaria de um pipe impuro ou de uma abordagem que garanta uma nova referência ao objeto/array a cada mudança relevante.
- **Não são adequados para operações que precisam de reexecução constante**: Se a sua transformação depende de fatores externos que mudam frequentemente e não são passados como entrada do pipe (como uma variável global ou um serviço que atualiza dados sem emitir novos valores), um pipe puro não será reexecutado e não mostrará o estado mais recente.

---

## 4\. Exemplos de Código Otimizados

Vamos criar um pipe puro que formata um número para um formato de "kilos" (ex: 1000 -\> 1k, 1500000 -\> 1.5M).

```tsx
// src/app/pipes/kilo-formatter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kiloFormatter',
  pure: true // Explicitamente definido, mas já é o padrão
})
export class KiloFormatterPipe implements PipeTransform {
  /**
   * Transforma um número grande para um formato mais legível (ex: 1000 -> 1K, 1500000 -> 1.5M).
   * @param value O número a ser formatado.
   * @param decimals Opcional. Número de casas decimais para exibir (padrão: 1).
   * @returns O número formatado como string.
   */
  transform(value: number | string, decimals: number = 1): string {
    if (value === null || value === undefined) {
      return '';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
      return ''; // Retorna vazio se não for um número válido
    }

    const absValue = Math.abs(numValue);
    const sign = numValue < 0 ? '-' : '';

    if (absValue >= 1000000000) {
      return sign + (absValue / 1000000000).toFixed(decimals) + 'B'; // Bilhões
    }
    if (absValue >= 1000000) {
      return sign + (absValue / 1000000).toFixed(decimals) + 'M'; // Milhões
    }
    if (absValue >= 1000) {
      return sign + (absValue / 1000).toFixed(decimals) + 'K'; // Milhares
    }
    return String(numValue); // Retorna o número original se for menor que 1000
  }
}

```

Para usar este pipe, você precisa importá-lo no seu `AppModule` (ou no módulo onde ele será usado) e adicioná-lo ao array `declarations`:

```tsx
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { KiloFormatterPipe } from './pipes/kilo-formatter.pipe'; // Importe o pipe

@NgModule({
  declarations: [
    AppComponent,
    KiloFormatterPipe // Declare o pipe aqui
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

Agora, você pode usá-lo em qualquer template do seu projeto:

```html
<div>
  <h2>Exemplos de Uso do Kilo Formatter Pipe</h2>
  <p>Visualizações: {{ 12345 | kiloFormatter }}</p>
  <p>Preço: R$ {{ 987654321 | kiloFormatter:2 }}</p>
  <p>Temperatura: {{ 500 | kiloFormatter:0 }} graus</p>
  <p>Zero: {{ 0 | kiloFormatter }}</p>
  <p>Negativo: {{ -123456 | kiloFormatter }}</p>

  <hr>

  <h3>Exemplo de um valor que não será re-renderizado com pipe puro</h3>
  <button (click)="incrementaNumero()">Adicionar 1 ao número</button>
  <p>Número atual (o pipe só atualiza se a referência for nova): {{ numero | kiloFormatter }}</p>
  <p>Número original: {{ numero }}</p>

  <hr>

  <h3>Exemplo de atualização que o pipe puro reage (nova referência)</h3>
  <button (click)="reiniciaNumero()">Reiniciar número (nova referência)</button>
  <p>Número redefinido: {{ numeroComNovaReferencia | kiloFormatter }}</p>

</div>

```

E o componente TypeScript:

```tsx
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-pipes-example';
  numero: number = 1200;

  // Este número será redefinido para uma nova referência
  numeroComNovaReferencia: number = 25000;

  incrementaNumero() {
    // Isso NÃO fará o pipe puro reexecutar, pois a referência do 'numero' não muda
    // apenas o valor interno.
    this.numero += 1;
    console.log('Número incrementado (pipe puro não reage):', this.numero);
  }

  reiniciaNumero() {
    // Isso fará o pipe puro reexecutar, pois 'numeroComNovaReferencia'
    // está sendo reatribuído a uma nova referência (mesmo que seja um valor primitivo).
    this.numeroComNovaReferencia = Math.floor(Math.random() * 1000000);
    console.log('Número redefinido (pipe puro reage):', this.numeroComNovaReferencia);
  }
}

```

No exemplo acima, você verá que `incrementaNumero()` altera o `numero`, mas o valor exibido pelo `kiloFormatter` não muda, pois a referência do primitivo `numero` permanece a mesma. Já `reiniciaNumero()` reatribui `numeroComNovaReferencia` com um novo valor, fazendo com que o pipe puro reexecute.

---

## 5\. Informações Adicionais

### Prós dos Pipes Puros

- **Performance Otimizada**: O Angular executa pipes puros apenas quando detecta uma mudança na referência do valor de entrada. Isso reduz o número de execuções e melhora a performance da sua aplicação, especialmente em listas grandes ou aplicações com muitos dados sendo exibidos.
- **Reutilização de Código**: Encapulam a lógica de formatação, tornando-a reutilizável em diferentes partes da aplicação.
- **Template Limpo**: Mantêm a lógica de transformação fora do template, tornando-o mais limpo, legível e focado na apresentação.
- **Isolamento da Lógica**: A lógica de transformação fica isolada no pipe, facilitando a manutenção e os testes.

### Contras dos Pipes Puros

- **Não Reagem a Mutações Internas**: Como vimos, se você mutar um objeto ou array (adicionar um item a um array existente, mudar uma propriedade de um objeto), o pipe puro não será reexecutado. Isso pode levar a dados desatualizados na UI se você não garantir que uma nova referência seja passada.
- **Necessidade de Reatribuição**: Para que um pipe puro reaja a mudanças em objetos ou arrays, você precisa criar e passar uma *nova referência* para o pipe cada vez que o conteúdo interno muda. Isso pode envolver o uso de métodos como `Array.prototype.slice()`, `Object.assign()`, ou o spread operator (`...`) para criar cópias.

### Quando Utilizar Pipes Puros

- **Transformações de Dados Primitivos**: Ideal para formatar strings, números, datas.
- **Transformações com Entradas Imutáveis**: Quando a entrada do pipe é um valor primitivo, ou um objeto/array que sempre será substituído por uma nova referência quando seu conteúdo mudar.
- **Performance Crítica**: Em cenários onde a performance é crucial e você quer minimizar as reexecuções do pipe.
- **Filtro/Ordenação de Dados que Resultam em Nova Coleção**: Se você está filtrando ou ordenando um array e sempre retorna um *novo* array resultante.

### Quando Evitar o Uso de Pipes Puros (e Considerar Impuros ou Outras Abordagens)

- **Mutações Internas Frequentes em Objetos/Arrays**: Se você precisa que o pipe reaja a alterações *internas* em objetos ou arrays sem criar novas referências (o que é uma prática comum em Angular, mas pode ser um "gotcha" para pipes puros). Nesses casos, um pipe impuro pode ser necessário, mas com cautela, ou é melhor mover a lógica de transformação para o componente.
- **Efeitos Colaterais ou Dependência de Estado Externo Mutável**: Pipes não devem ter efeitos colaterais. Se a sua lógica de transformação depende de um serviço que muda seu estado interno frequentemente sem notificar o pipe através de uma nova entrada, o pipe puro não será adequado.
- **Operações Computacionalmente Caras que Precisam de Reação a Mutações Internas**: Se a lógica é pesada e precisa reagir a mutações internas, um pipe impuro pode degradar muito a performance. Nesses casos, é melhor realizar a computação no componente e passar o resultado já transformado para o template, ou usar `OnPush` change detection.

---

## 6\. Referências para Estudo Independente

Para se aprofundar no mundo dos Pipes no Angular, Gedê, recomendo fortemente a documentação oficial, que é sempre a fonte mais confiável:

- **Documentação Oficial do Angular - Pipes**:
    - [https://angular.io/guide/pipes](https://angular.io/guide/pipes)
    - Esta seção da documentação cobre desde o básico até tópicos avançados sobre pipes, incluindo a diferença entre puros e impuros.

Você também pode encontrar diversos artigos e tutoriais de qualidade em blogs e plataformas como Medium, [Dev.to](http://dev.to/) e freeCodeCamp. Ao procurar, foque em materiais que expliquem a otimização de performance e os prós e contras de cada tipo de pipe.

---

Espero que esta explicação detalhada sobre Pipes Puros no Angular tenha sido útil para você, Gedê\! Se tiver mais alguma dúvida ou quiser explorar outro tópico, é só chamar a A.R.I.A. aqui\!