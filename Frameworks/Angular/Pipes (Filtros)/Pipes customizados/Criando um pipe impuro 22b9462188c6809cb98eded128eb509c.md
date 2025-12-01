# Criando um pipe impuro

E aí, Gedê\! Beleza? A.R.I.A. por aqui para te ajudar com essa solicitação detalhada sobre **Pipes Impuros no Angular**. Como você é desenvolvedor Backend Java e está migrando para Go, entender esses conceitos de frontend é super importante para ter uma visão completa do desenvolvimento de software.

---

## Introdução: Entendendo os Pipes no Angular

No universo do desenvolvimento web com **Angular**, os **Pipes** são ferramentas poderosas que permitem **transformar dados** diretamente nos templates, tornando a exibição mais flexível e a lógica de apresentação mais limpa. Eles atuam como funções que recebem um valor de entrada e retornam um valor transformado, sem a necessidade de manipular diretamente o código TypeScript do componente para cada pequena alteração de exibição.

A relevância dos Pipes é gigantesca. Eles contribuem para a **separação de responsabilidades** (tornando o código mais organizado), **reutilização de código** (uma vez que você define um Pipe, pode usá-lo em vários lugares) e **melhor performance** em muitos casos (especialmente os pipes puros, que otimizam as renderizações).

Existem dois tipos principais de Pipes no Angular: **Puros** e **Impuros**. Um **Pipe Puro** é aquele que só recalcula seu valor de saída quando a sua entrada **primitiva** muda (ex: string, number, boolean) ou quando a **referência do objeto de entrada** muda. Já um **Pipe Impuro**, que é o foco da nossa conversa, executa sua transformação a cada ciclo de detecção de mudanças do Angular, independentemente se a entrada mudou ou não. Ele é "impuro" porque pode produzir uma saída diferente mesmo com a mesma entrada, dependendo de fatores externos ou mutações internas de objetos.

---

## Sumário

- **Pipes Impuros: Definição e Propósito**
- **Sintaxe e Estrutura de um Pipe Impuro**
- **Componentes Principais e Interação**
- **Restrições e Considerações de Uso**
- **Exemplos de Código Otimizados**
    - Exemplo Básico: Filtragem Dinâmica
    - Exemplo Avançado: Ordenação de Array por Propriedade
- **Informações Adicionais**
    - Prós e Contras dos Pipes Impuros
    - Quando Utilizar e Quando Evitar Pipes Impuros
- **Referências para Estudo Independente**

---

## Conteúdo Detalhado

### Pipes Impuros: Definição e Propósito

Como mencionado, um **Pipe Impuro** no Angular é um tipo de Pipe que é executado **a cada ciclo de detecção de mudanças** (change detection) do Angular. Isso significa que, mesmo que os valores de entrada do pipe não tenham mudado, se algo no componente (ou em um componente pai) disparar um ciclo de detecção de mudanças, o pipe impuro será reexecutado.

O principal propósito de um Pipe Impuro é permitir transformações de dados que dependem de:

- **Mutações internas de objetos ou arrays**: Se você tem um array e adiciona/remove um item sem mudar a referência do array, um pipe puro não detectaria a mudança. Um pipe impuro sim.
- **Fatores externos**: Lógica que depende, por exemplo, do estado de um serviço, de um timer, ou de uma requisição assíncrona que não modifica a referência da entrada do pipe.

### Sintaxe e Estrutura de um Pipe Impuro

Para criar um pipe impuro, você precisa decorá-lo com `@Pipe` e definir a propriedade `pure` como `false`.

```tsx
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meuPipeImpuro',
  pure: false // <--- É isso que o torna impuro
})
export class MeuPipeImpuro implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    // Lógica de transformação
    // Esta lógica será executada a cada ciclo de detecção de mudanças
    return value;
  }
}

```

**Exemplo de declaração e utilização:**

1. **Crie o pipe (geralmente com o Angular CLI):**
    
    ```bash
    ng generate pipe meu-pipe-impuro
    
    ```
    
    Isso criará o arquivo `meu-pipe-impuro.pipe.ts` e o registrará automaticamente no `AppModule` (ou no módulo onde foi gerado).
    
2. **Modifique o arquivo do pipe para ser impuro:**
    
    ```tsx
    // src/app/meu-pipe-impuro.pipe.ts
    import { Pipe, PipeTransform } from '@angular/core';
    
    @Pipe({
      name: 'meuPipeImpuro',
      pure: false // Torna o pipe impuro
    })
    export class MeuPipeImpuroPipe implements PipeTransform {
      transform(value: any[], searchTerm: string): any[] {
        console.log('Pipe impuro executado!'); // Para ver quando ele é reexecutado
    
        if (!value || !searchTerm) {
          return value;
        }
        return value.filter(item =>
          JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }
    
    ```
    
3. **Utilize no template:**
    
    ```html
    <input [(ngModel)]="meuTermoDeBusca" placeholder="Buscar...">
    <ul>
      <li *ngFor="let item of (minhaLista | meuPipeImpuro:meuTermoDeBusca)">
        {{ item | json }}
      </li>
    </ul>
    
    ```
    

### Componentes Principais e Interação

- **`@Pipe` Decorator**: É o decorador que marca uma classe como um pipe e permite configurar suas propriedades, como o `name` (nome usado no template) e o `pure` (definindo se é puro ou impuro).
- **`PipeTransform` Interface**: Uma classe pipe deve implementar esta interface, que define o método `transform()`.
- **`transform(value: any, ...args: any[]): any` Método**: Este é o coração do pipe. Ele recebe o `value` a ser transformado como primeiro argumento, e quaisquer argumentos adicionais passados para o pipe no template (depois do `:`). Ele deve retornar o valor transformado.
- **Ciclo de Detecção de Mudanças (Change Detection)**: Este é o mecanismo do Angular que verifica se há mudanças no estado do aplicativo e atualiza a UI. Um pipe impuro é reexecutado a cada vez que esse ciclo ocorre.

A interação é simples: o Angular, durante a fase de detecção de mudanças, avalia as expressões no template. Ao encontrar um pipe impuro, ele chama o método `transform()` do pipe, que então executa sua lógica e retorna o valor atualizado para ser exibido.

### Restrições de Uso

A principal restrição e consideração ao usar pipes impuros é o **desempenho**. Como eles são executados a cada ciclo de detecção de mudanças, podem causar problemas de performance se a lógica dentro do `transform` for complexa ou demorada, especialmente em aplicações grandes com muitos pipes impuros ou com muitos ciclos de detecção de mudanças.

Por essa razão, a maioria dos pipes deve ser **pura** por padrão. Utilize pipes impuros apenas quando a natureza da transformação de dados exige a reavaliação constante, como em casos onde a mutação interna de objetos ou arrays é comum e você não quer (ou não pode) garantir a imutabilidade das referências.

---

## Exemplos de Código Otimizados

A seguir, dois exemplos práticos para ilustrar o uso de pipes impuros.

### Exemplo Básico: Filtragem Dinâmica de uma Lista (Mutável)

Imagine que você tem uma lista de usuários e quer filtrá-los com base em um termo de busca. Se a lista de usuários pode ser alterada (adicionar/remover itens) e você quer que o filtro responda a essas mutações sem recriar a referência do array, um pipe impuro é uma opção.

```tsx
// src/app/pipes/filter-impure.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterImpure',
  pure: false // Essencial para ser impuro
})
export class FilterImpurePipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    // console.log('FilterImpurePipe executado. Items:', items.length); // Para debug de reexecução

    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      // Adapte a lógica de filtro conforme suas propriedades
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm)
      );
    });
  }
}

```

Para usá-lo:

1. Certifique-se de que o `FilterImpurePipe` está declarado no `imports` ou `declarations` do seu módulo (geralmente `AppModule`).
2. No seu componente TypeScript (`app.component.ts`):
    
    ```tsx
    // src/app/app.component.ts
    import { Component } from '@angular/core';
    
    interface User {
      id: number;
      name: string;
      email: string;
    }
    
    @Component({
      selector: 'app-root',
      template: `
        <h2>Lista de Usuários com Filtro Impuro</h2>
        <input [(ngModel)]="searchTerm" placeholder="Filtrar usuários...">
        <button (click)="addUser()">Adicionar Usuário</button>
        <button (click)="removeLastUser()">Remover Último Usuário</button>
        <p>Total de usuários na lista original: {{ users.length }}</p>
    
        <div *ngFor="let user of (users | filterImpure: searchTerm)">
          {{ user.name }} ({{ user.email }})
        </div>
        <p *ngIf="(users | filterImpure: searchTerm)?.length === 0">Nenhum usuário encontrado.</p>
      `
    })
    export class AppComponent {
      searchTerm: string = '';
      users: User[] = [
        { id: 1, name: 'Alice Silva', email: 'alice@example.com' },
        { id: 2, name: 'Bruno Costa', email: 'bruno@example.com' },
        { id: 3, name: 'Carla Pereira', email: 'carla@example.com' },
        { id: 4, name: 'Daniel Souza', email: 'daniel@example.com' }
      ];
    
      private nextId = 5;
    
      addUser() {
        const newUser: User = {
          id: this.nextId++,
          name: `Novo Usuário ${this.nextId - 1}`,
          email: `novo${this.nextId - 1}@example.com`
        };
        // Aqui, estamos mutando o array 'users' diretamente.
        // Um pipe puro não detectaria essa mudança na referência do array.
        this.users.push(newUser);
        console.log('Usuário adicionado:', newUser.name);
      }
    
      removeLastUser() {
        if (this.users.length > 0) {
          const removedUser = this.users.pop(); // Muta o array
          console.log('Usuário removido:', removedUser?.name);
        }
      }
    }
    
    ```
    
    Neste exemplo, você verá que, ao adicionar ou remover um usuário da lista (mutando o array `users` sem criar uma nova referência), o pipe impuro **`filterImpure`** será reexecutado e o filtro funcionará corretamente. Se fosse um pipe puro, as alterações no array (`push`, `pop`) não seriam detectadas, a menos que você criasse um novo array (`this.users = [...this.users, newUser];`).
    

### Exemplo Avançado: Ordenação de Array por Propriedade (com Mutações e Argumentos)

Este exemplo mostra um pipe impuro que ordena um array de objetos com base em uma propriedade e uma direção (crescente/decrescente), e que também responde a mutações no array.

```tsx
// src/app/pipes/sort-impure.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortImpure',
  pure: false // Essencial para ser impuro
})
export class SortImpurePipe implements PipeTransform {
  transform(array: any[], field: string, direction: 'asc' | 'desc' = 'asc'): any[] {
    // console.log('SortImpurePipe executado. Field:', field, 'Direction:', direction); // Para debug

    if (!array || !Array.isArray(array) || array.length === 0 || !field) {
      return array;
    }

    // Criar uma cópia para não mutar o array original diretamente,
    // mas o pipe impuro ainda re-executará se o array original mudar a referência ou mutar.
    // O 'sort' nativo do JS muta o array original, por isso a cópia é boa prática aqui.
    const sortedArray = [...array];

    sortedArray.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        // Assume números ou outros tipos comparáveis
        if (valA < valB) {
          return direction === 'asc' ? -1 : 1;
        } else if (valA > valB) {
          return direction === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      }
    });

    return sortedArray;
  }
}

```

Para usá-lo:

1. Certifique-se de que o `SortImpurePipe` está declarado no seu módulo.
2. No seu componente TypeScript (`app.component.ts`):
    
    ```tsx
    // src/app/app.component.ts
    // (continuando do exemplo anterior, ou em um novo componente)
    import { Component } from '@angular/core';
    
    interface Product {
      id: number;
      name: string;
      price: number;
      category: string;
    }
    
    @Component({
      selector: 'app-sort-example',
      template: `
        <h2>Lista de Produtos com Ordenação Impura</h2>
        <button (click)="addProduct()">Adicionar Produto</button>
        <button (click)="removeProduct()">Remover Último Produto</button>
    
        <div>
          Ordenar por:
          <select [(ngModel)]="sortField">
            <option value="name">Nome</option>
            <option value="price">Preço</option>
            <option value="category">Categoria</option>
          </select>
          <select [(ngModel)]="sortDirection">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
    
        <ul>
          <li *ngFor="let product of (products | sortImpure: sortField: sortDirection)">
            {{ product.name }} - R$ {{ product.price }} ({{ product.category }})
          </li>
        </ul>
      `
    })
    export class SortExampleComponent {
      products: Product[] = [
        { id: 1, name: 'Tablet', price: 800, category: 'Eletrônicos' },
        { id: 2, name: 'Fone de Ouvido', price: 150, category: 'Acessórios' },
        { id: 3, name: 'Smartphone', price: 2500, category: 'Eletrônicos' },
        { id: 4, name: 'Teclado Mecânico', price: 400, category: 'Acessórios' }
      ];
    
      sortField: string = 'name';
      sortDirection: 'asc' | 'desc' = 'asc';
      private nextProductId = 5;
    
      addProduct() {
        const newProduct: Product = {
          id: this.nextProductId++,
          name: `Produto X ${this.nextProductId - 1}`,
          price: Math.floor(Math.random() * 1000) + 50,
          category: this.nextProductId % 2 === 0 ? 'Eletrônicos' : 'Cozinha'
        };
        this.products.push(newProduct); // Muta o array
      }
    
      removeProduct() {
        if (this.products.length > 0) {
          this.products.pop(); // Muta o array
        }
      }
    }
    
    ```
    
    Neste exemplo, ao mudar o `sortField` ou `sortDirection`, ou ao adicionar/remover um produto (mutando o array `products`), o pipe `sortImpure` será reexecutado e a lista será reordenada.
    

---

## Informações Adicionais

### Prós/Contras dos Pipes Impuros

**Prós:**

- **Detecção de Mutações Internas**: A principal vantagem. Permitem que você trabalhe com objetos e arrays que são mutados internamente (itens adicionados/removidos, propriedades de objetos alteradas) sem ter que criar novas referências para acionar a atualização.
- **Facilidade para Certos Casos**: Em cenários específicos onde a reavaliação constante é necessária (como um pipe de data/hora que sempre mostra a hora atual), eles simplificam a implementação.
- **Lógica Complexa Dependente de Estado Externo**: Útil para pipes que dependem de um estado que não está diretamente ligado à entrada do pipe, mas que pode mudar ao longo do tempo (ex: um serviço que carrega configurações).

**Contras:**

- **Impacto na Performance**: A maior desvantagem. Serem executados a cada ciclo de detecção de mudanças pode levar a problemas de performance significativos, especialmente se a lógica interna do pipe for custosa ou se houver muitos pipes impuros em uma página com muitos ciclos de detecção de mudanças.
- **Dificuldade de Debugging**: A reexecução constante pode tornar o debug mais complexo, pois é mais difícil identificar quando e por que o pipe está sendo reavaliado.
- **Potencial para Bugs Sutis**: Se a lógica interna do pipe não for idempotente (produzir o mesmo resultado para a mesma entrada se nada "externo" mudou), pode levar a comportamentos inesperados.

### Quando Utilizar/Quando Evitar o Uso

**Quando Utilizar:**

- **Transformação de Objetos/Arrays Mutáveis**: Quando você precisa que a UI reaja a alterações internas em objetos ou arrays (adição/remoção de elementos, alteração de propriedades de objetos dentro de um array) sem ter que criar novas referências para esses objetos/arrays.
- **Pipes de Estado Dinâmico**: Para pipes que precisam sempre exibir o estado "atual" de algo, como a hora atual, um contador regressivo, ou um status que é atualizado por um serviço em segundo plano.
- **`AsyncPipe`**: O `AsyncPipe` é um pipe impuro nativo do Angular e é amplamente utilizado e recomendado. Ele se inscreve automaticamente em Observables ou Promises e retorna o valor emitido mais recente, lidando com a inscrição e desinscrição. É um excelente exemplo de um pipe impuro bem justificado.

**Quando Evitar o Uso:**

- **Para a Maioria das Transformações Simples**: Se a transformação depende apenas das entradas primitivas ou de novas referências de objetos/arrays (o caso mais comum), use um pipe puro. Eles são mais performáticos e preferíveis.
- **Lógica Computacionalmente Cara**: Se o cálculo dentro do seu pipe é pesado e pode ser evitado. Evite reexecutá-lo desnecessariamente.
- **Quando a Imutabilidade Pode Ser Mantida**: Se você pode garantir que os arrays e objetos passados para o pipe sempre terão uma nova referência quando seus conteúdos mudarem (por exemplo, usando `map`, `filter`, `slice` que retornam novos arrays), prefira um pipe puro.

---

## Referências para Estudo Independente

Para Gedê, que está sempre buscando se aprofundar, aqui estão algumas referências essenciais:

- **Documentação Oficial do Angular - Pipes**: O ponto de partida para tudo sobre pipes.
    - [Angular Pipes (Documentação Oficial)](https://angular.io/guide/pipes)
- **Artigo sobre Pure vs Impure Pipes**: Um bom artigo que explica as diferenças e quando usar cada um.
    - [Angular Pure vs Impure Pipes: A Comprehensive Guide](https://www.google.com/search?q=https://www.freecodecamp.org/news/angular-pure-vs-impure-pipes-a-comprehensive-guide/) (Artigo em inglês, mas muito completo)
- **Vídeo Explicativo no YouTube**: Conteúdo visual pode ajudar a entender o fluxo da detecção de mudanças.
    - Procure por "Angular Pure vs Impure Pipes" no YouTube, há vários vídeos bons. Um exemplo popular é o do canal "Academind" ou "Fireship".

Espero que esta explicação detalhada sobre pipes impuros no Angular ajude você, Gedê, a entender melhor essa ferramenta e a tomar decisões mais informadas no seu dia a dia como desenvolvedor\!

Tem mais alguma dúvida ou quer que aprofundemos em outro tópico, Ju? A.R.I.A. está à disposição\!