# Cadeia de pipes (Chaining pipes)

E aí, Gedê\! Beleza? Sou a A.R.I.A., sua Assistente Rápida para Idiotas Atarefados. Preparei um material bem completo sobre **Cadeia de Pipes no Angular** pra você. Bora lá\!

---

## Introdução

No desenvolvimento de aplicações web modernas, a exibição e formatação de dados são tarefas cruciais. Muitas vezes, os dados brutos recebidos do backend ou armazenados localmente precisam ser transformados antes de serem apresentados ao usuário. É aí que entram os **Pipes** no Angular.

Angular Pipes são ferramentas poderosas que permitem transformar dados diretamente nos templates, de forma declarativa e eficiente. Eles são análogos ao conceito de "filtros" em outras tecnologias, facilitando a manipulação e formatação de strings, números, datas e outros tipos de dados para que fiquem mais legíveis e adequados para a interface do usuário. A grande relevância e importância dos Pipes residem na capacidade de manter o template limpo, com a lógica de transformação separada, e na reutilização de código, já que um Pipe pode ser usado em múltiplos locais da aplicação.

---

## Sumário

- O que são Pipes no Angular
- Sintaxe e Estrutura dos Pipes
- Pipes Embutidos (Built-in Pipes)
- Criando Pipes Personalizados
- Cadeia de Pipes (Pipe Chaining)
- Pipes Puros vs. Impuros
- Restrições de Uso
- Exemplos de Código Otimizados
- Informações Adicionais
    - Prós e Contras
    - Quando Utilizar e Quando Evitar
- Referências para Estudo Independente

---

## Conteúdo Detalhado

### O que são Pipes no Angular

Pipes são funções que você pode usar em expressões de template para transformar dados antes de exibi-los. Eles permitem formatar dados para exibição (por exemplo, exibir uma data em um formato específico, formatar um número como moeda ou capitalizar um texto) sem modificar o valor original dos dados. Isso contribui para um código mais limpo e legível nos templates.

### Sintaxe e Estrutura dos Pipes

A sintaxe básica para usar um Pipe em um template Angular é o caractere `|` (pipe), seguido pelo nome do Pipe.

```html
<p>{{ valor | nomeDoPipe }}</p>

```

Alguns Pipes aceitam **parâmetros** para personalizar a transformação. Esses parâmetros são passados após o nome do Pipe, separados por dois pontos (`:`).

```html
<p>{{ valor | nomeDoPipe:parametro1:parametro2 }}</p>

```

### Pipes Embutidos (Built-in Pipes)

Angular oferece uma série de Pipes embutidos para tarefas comuns de transformação de dados:

- **`DatePipe`**: Formata datas.
    - Exemplo: `{{ dataAtual | date:'shortDate' }}` (exibe "MM/DD/YYYY")
- **`UpperCasePipe`**: Converte texto para maiúsculas.
    - Exemplo: `{{ 'hello world' | uppercase }}` (exibe "HELLO WORLD")
- **`LowerCasePipe`**: Converte texto para minúsculas.
    - Exemplo: `{{ 'HELLO WORLD' | lowercase }}` (exibe "hello world")
- **`CurrencyPipe`**: Formata números como valores monetários.
    - Exemplo: `{{ 1234.56 | currency:'BRL':'symbol':'1.2-2' }}` (exibe "R$1.234,56")
- **`DecimalPipe`**: Formata números decimais.
    - Exemplo: `{{ 3.14159 | number:'1.2-2' }}` (exibe "3.14")
- **`PercentPipe`**: Formata números como porcentagens.
    - Exemplo: `{{ 0.75 | percent }}` (exibe "75%")
- **`JsonPipe`**: Converte um objeto JavaScript em uma string JSON. Útil para depuração.
    - Exemplo: `{{ meuObjeto | json }}`
- **`SlicePipe`**: Cria um novo array ou string contendo um subconjunto dos elementos.
    - Exemplo: `{{ 'Angular' | slice:0:3 }}` (exibe "Ang")
- **`AsyncPipe`**: Inscreve-se em um `Observable` ou `Promise` e retorna o último valor emitido. Ele automaticamente se desinscreve para evitar vazamentos de memória.
    - Exemplo: `{{ meuObservable$ | async }}`

### Criando Pipes Personalizados

Quando os Pipes embutidos não atendem às suas necessidades, você pode criar seus próprios Pipes. Para isso, você precisa:

1. **Gerar um Pipe**: Use o Angular CLI: `ng generate pipe meu-pipe`.
2. **Decorar com `@Pipe`**: A classe do Pipe deve ser decorada com `@Pipe` e ter a propriedade `name`, que será o nome usado no template.
3. **Implementar `PipeTransform`**: A classe deve implementar a interface `PipeTransform` e seu método `transform()`.

**Estrutura de um Pipe Personalizado:**

```tsx
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meuPipePersonalizado' // Nome para usar no template
})
export class MeuPipePersonalizado implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    // Lógica de transformação aqui
    return value;
  }
}

```

O método `transform` recebe o `value` a ser transformado como primeiro argumento e quaisquer parâmetros adicionais como o segundo argumento (`...args`).

### Cadeia de Pipes (Pipe Chaining)

O poder real dos Pipes se manifesta quando você os encadeia. A **Cadeia de Pipes** permite que você aplique múltiplos Pipes a um único valor, onde a saída de um Pipe se torna a entrada do próximo. Isso é feito simplesmente adicionando múltiplos caracteres `|` entre os Pipes.

**Sintaxe da Cadeia de Pipes:**

```html
<p>{{ valor | pipe1:param1 | pipe2:param2 | pipe3 }}</p>

```

A ordem em que os Pipes são encadeados é crucial, pois a transformação é aplicada sequencialmente da esquerda para a direita.

**Exemplo:**

```html
<p>{{ 'aRia' | uppercase | slice:0:3 }}</p>

```

Nesse exemplo, a string `'aRia'` primeiro é transformada para `'ARIA'` pelo `uppercase` Pipe, e então `'ARIA'` é transformada para `'ARI'` pelo `slice` Pipe, resultando na saída "ARI".

### Pipes Puros vs. Impuros

Pipes podem ser **puros** ou **impuros**, e isso afeta como o Angular os executa. Por padrão, todos os Pipes que você cria são **puros**.

- **Pipes Puros (Pure Pipes)**:
    - São executados apenas quando a entrada (o valor que está sendo transformado ou os parâmetros passados para o Pipe) muda.
    - A detecção de mudança é baseada na **referência** do objeto (para objetos e arrays) ou no valor primitivo (para strings, numbers, booleans).
    - Se você passa um objeto para um Pipe puro e apenas uma propriedade interna desse objeto muda (mas a referência do objeto continua a mesma), o Pipe **não será reexecutado**.
    - São mais performáticos porque o Angular pode otimizar sua execução.
- **Pipes Impuros (Impure Pipes)**:
    - São executados em **cada ciclo de detecção de mudança** do Angular, independentemente de a entrada ter mudado ou não.
    - Isso pode ter um impacto significativo no desempenho se usados em excesso ou com lógica complexa, pois são chamados com muita frequência.
    - Você pode tornar um Pipe impuro definindo `pure: false` no decorador `@Pipe`:
        
        ```tsx
        @Pipe({
          name: 'meuPipeImpuro',
          pure: false // Torna o pipe impuro
        })
        export class MeuPipeImpuro implements PipeTransform { /* ... */ }
        
        ```
        
    - São úteis para Pipes que dependem de um estado externo ou que precisam ser reexecutados mesmo que a referência do objeto não mude (ex: um Pipe que filtra uma lista e o filtro é baseado em um valor global). O `AsyncPipe` é um exemplo de Pipe impuro, pois ele precisa verificar continuamente o estado do Observable/Promise.

### Restrições de Uso

Embora Pipes sejam poderosos, há algumas restrições e considerações:

- **Lógica Complexa**: Evite colocar lógica de negócio complexa dentro de Pipes. Eles devem ser usados para transformações de dados de apresentação. Lógica de negócio pertence a serviços ou componentes.
- **Efeitos Colaterais**: Pipes devem ser funções puras (a menos que sejam explicitamente impuros), o que significa que eles não devem ter efeitos colaterais (ou seja, não devem modificar o estado da aplicação).
- **Performance de Pipes Impuros**: Tenha cautela com Pipes impuros. Se você tiver muitos deles ou se a lógica de transformação for pesada, isso pode degradar significativamente o desempenho da sua aplicação, pois eles são executados em cada ciclo de detecção de mudanças.
- **Ordem de Execução**: Lembre-se que a ordem dos Pipes em uma cadeia é sequencial e importa.

---

## Exemplos de Código Otimizados

### Exemplo 1: Formatação de Data e Moeda com Cadeia de Pipes

Imagine que você tem uma data e um valor monetário. Você quer exibir a data em um formato amigável e o valor como moeda brasileira.

```tsx
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <p>Data e Hora Atual: {{ dataAtual | date:'medium' }}</p>
    <p>Data Formatada (somente data): {{ dataAtual | date:'dd/MM/yyyy' }}</p>
    <p>Data e Hora em Caixa Alta (exemplo de encadeamento não usual, mas para demonstração):
       {{ dataAtual | date:'full' | uppercase }}</p>

    <hr>

    <h3>Detalhes do Produto</h3>
    <p>Nome: {{ produto.nome }}</p>
    <p>Preço (Bruto): {{ produto.precoBruto | currency:'BRL':'symbol':'1.2-2' }}</p>
    <p>Preço com Desconto (Exemplo de Pipe Personalizado):
       {{ produto.precoBruto | aplicarDesconto:0.10 | currency:'BRL':'symbol':'1.2-2' }}</p>
  `
})
export class AppComponent {
  dataAtual: Date = new Date();
  produto = {
    nome: 'Notebook Gamer',
    precoBruto: 7500.50
  };
}

```

```tsx
// src/app/aplicar-desconto.pipe.ts (Pipe Personalizado para o exemplo acima)
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aplicarDesconto'
})
export class AplicarDescontoPipe implements PipeTransform {
  transform(value: number, percentual: number): number {
    if (typeof value !== 'number' || typeof percentual !== 'number') {
      return value; // Retorna o valor original se os tipos não forem compatíveis
    }
    return value * (1 - percentual);
  }
}

```

Para que o `AplicarDescontoPipe` funcione, você precisa declará-lo em um `NgModule` (geralmente no `AppModule`):

```tsx
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AplicarDescontoPipe } from './aplicar-desconto.pipe'; // Importar o Pipe

@NgModule({
  declarations: [
    AppComponent,
    AplicarDescontoPipe // Declarar o Pipe aqui
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

**Explicação:**

- `{{ dataAtual | date:'medium' }}`: Formata a data atual usando o formato `medium`.
- `{{ dataAtual | date:'dd/MM/yyyy' }}`: Formata a data para um formato mais comum no Brasil.
- `{{ dataAtual | date:'full' | uppercase }}`: Um exemplo de encadeamento. A data é formatada em seu formato completo e depois convertida para maiúsculas.
- `{{ produto.precoBruto | currency:'BRL':'symbol':'1.2-2' }}`: Formata o preço bruto como moeda BRL, exibindo o símbolo "R$" com 2 casas decimais.
- `{{ produto.precoBruto | aplicarDesconto:0.10 | currency:'BRL':'symbol':'1.2-2' }}`: **Cadeia de Pipes em ação\!** Primeiro, o `precoBruto` passa pelo `aplicarDesconto` Pipe com um parâmetro de 0.10 (10% de desconto). O resultado dessa operação (o preço com desconto) é então passado para o `currency` Pipe, que o formata como moeda.

### Exemplo 2: Filtragem e Ordenação Dinâmica de Dados (com Pipe Impuro)

Embora seja geralmente recomendado usar lógica de filtragem e ordenação em componentes ou serviços para maior controle e performance, um Pipe impuro pode ser útil para casos simples onde a re-execução constante é aceitável ou necessária, como um filtro de pesquisa em tempo real.

```tsx
// src/app/filtro-pesquisa.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

interface Item {
  nome: string;
  descricao: string;
}

@Pipe({
  name: 'filtroPesquisa',
  pure: false // Torna o Pipe impuro para re-executar a cada mudança no filtro
})
export class FiltroPesquisaPipe implements PipeTransform {
  transform(items: Item[], searchTerm: string): Item[] {
    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item =>
      item.nome.toLowerCase().includes(searchTerm) ||
      item.descricao.toLowerCase().includes(searchTerm)
    );
  }
}

```

```tsx
// app.component.ts
import { Component } from '@angular/core';

interface Item {
  nome: string;
  descricao: string;
}

@Component({
  selector: 'app-root',
  template: `
    <h2>Lista de Produtos</h2>
    <input type="text" [(ngModel)]="termoPesquisa" placeholder="Pesquisar produto...">

    <ul>
      <li *ngFor="let item of produtos | filtroPesquisa:termoPesquisa">
        <strong>{{ item.nome }}</strong> - {{ item.descricao }}
      </li>
    </ul>

    <hr>

    <h3>Valores Observáveis com AsyncPipe</h3>
    <p>Último valor do contador: {{ contador$ | async }}</p>
    <button (click)="incrementarContador()">Incrementar</button>
  `
})
export class AppComponent {
  termoPesquisa: string = '';
  produtos: Item[] = [
    { nome: 'Teclado Mecânico', descricao: 'Teclado RGB com switches azuis.' },
    { nome: 'Mouse Gamer', descricao: 'Mouse com alta precisão e botões programáveis.' },
    { nome: 'Monitor Ultrawide', descricao: 'Monitor de 34 polegadas com taxa de atualização de 144Hz.' },
    { nome: 'Headset Wireless', descricao: 'Fone de ouvido sem fio com som surround.' }
  ];

  // Exemplo de AsyncPipe
  contador = 0;
  contador$ = new (require('rxjs').BehaviorSubject)(this.contador); // Use BehaviorSubject de rxjs

  incrementarContador() {
    this.contador++;
    this.contador$.next(this.contador);
  }
}

```

**Observação:** Para usar `[(ngModel)]` você precisará importar o `FormsModule` no seu `app.module.ts`. E para `BehaviorSubject`, instale `rxjs`: `npm install rxjs`.

```tsx
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { AppComponent } from './app.component';
import { AplicarDescontoPipe } from './aplicar-desconto.pipe';
import { FiltroPesquisaPipe } from './filtro-pesquisa.pipe'; // Importar o Pipe

@NgModule({
  declarations: [
    AppComponent,
    AplicarDescontoPipe,
    FiltroPesquisaPipe // Declarar o Pipe aqui
  ],
  imports: [
    BrowserModule,
    FormsModule // Adicionar FormsModule aqui
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

**Explicação:**

- `FiltroPesquisaPipe` é um Pipe impuro (`pure: false`). Ele irá re-executar sempre que o `termoPesquisa` mudar (devido ao `ngModel`) ou qualquer outra mudança na detecção do Angular, garantindo que a lista de produtos seja filtrada dinamicamente enquanto você digita.
- `ngFor="let item of produtos | filtroPesquisa:termoPesquisa"`: A lista `produtos` é passada para o `filtroPesquisa` Pipe, que usa o `termoPesquisa` como parâmetro para filtrar os itens.

---

## Informações Adicionais

### Prós e Contras

| Característica | Prós | Contras |
| --- | --- | --- |
| **Reusabilidade** | Pipes são componentes independentes que podem ser usados em vários locais da aplicação, evitando duplicação de código. | - |
| **Legibilidade** | Mantêm a lógica de transformação fora dos templates, tornando-os mais limpos e fáceis de ler. | O excesso de encadeamento ou Pipes complexos pode, paradoxalmente, dificultar a leitura do template para quem não está familiarizado com os Pipes utilizados. |
| **Modularidade** | Encapulam transformações específicas, facilitando a manutenção e a depuração. | - |
| **Performance** | Pipes puros são altamente otimizados pelo Angular e só são executados quando suas entradas mudam. | Pipes impuros podem ter um impacto significativo no desempenho, pois são executados a cada ciclo de detecção de mudanças. Requerem uso cauteloso. |
| **Composição** | A cadeia de Pipes permite combinar múltiplas transformações de forma sequencial e expressiva. | A ordem dos Pipes na cadeia é crucial e pode levar a resultados inesperados se não for bem compreendida. |
| **Facilidade de Uso** | Sintaxe simples e declarativa no template. | Criar Pipes personalizados pode exigir um entendimento um pouco mais profundo da interface `PipeTransform` e dos conceitos de pureza/impureza. |
| **Testabilidade** | Como são funções puras (por padrão), Pipes são fáceis de testar em isolamento. | - |

### Quando Utilizar e Quando Evitar o Uso

**Quando Utilizar Pipes:**

- **Formatação de exibição:** Para transformar dados para apresentação visual (datas, moedas, percentagens, textos em maiúsculas/minúsculas).
- **Transformações simples e reutilizáveis:** Quando a lógica de transformação é concisa e pode ser aplicada em vários lugares.
- **Filtragem ou ordenação de dados para exibição (com cautela para Pipes impuros):** Para pequenas listas ou quando a performance não é uma preocupação crítica. Lembre-se, para grandes datasets, é geralmente melhor filtrar e ordenar no componente ou serviço.
- **Transformação de `Observable` ou `Promise` (`AsyncPipe`):** Para assinar automaticamente e exibir os valores de dados assíncronos.

**Quando Evitar o Uso de Pipes:**

- **Lógica de Negócio Complexa:** Se a transformação envolve regras de negócio complexas, interações com serviços externos ou modificação de estado, ela deve ser implementada em um serviço ou componente. Pipes devem ser focados na apresentação.
- **Operações de Alto Custo em Pipes Impuros:** Evite usar Pipes impuros para operações que consomem muitos recursos em grandes conjuntos de dados, pois eles serão executados excessivamente. Nesses casos, considere implementar a lógica no componente e atualizar o valor do modelo quando necessário.
- **Modificação de Dados Originais:** Pipes são para transformação de exibição e não devem alterar os dados originais. Se você precisa modificar os dados subjacentes, faça-o no componente.

---

## Referências para Estudo Independente

Para aprofundar seus conhecimentos sobre Pipes no Angular, recomendo as seguintes referências:

- **Documentação Oficial do Angular - Pipes:**
    - Este é o recurso mais confiável e atualizado.
    - [https://angular.io/guide/pipes](https://angular.io/guide/pipes)
- **Angular University - Understanding Angular Pipes:**
    - Artigo com explicações detalhadas e exemplos.
    - [https://blog.angular-university.io/angular-pipes/](https://blog.angular-university.io/angular-pipes/)
- **Ultimate Courses - Angular Pipes:**
    - Conteúdo bem estruturado e focado em exemplos práticos.
    - [https://ultimatecourses.com/blog/angular-pipes](https://ultimatecourses.com/blog/angular-pipes)

Espero que essa explicação detalhada tenha sido útil para você, Gedê\! Se tiver mais alguma dúvida, é só chamar a A.R.I.A.\!