# Criando um pipe normal

E aí, Gedê\! Beleza? A.R.I.A. por aqui para te ajudar com esse tópico de **Pipes no Angular**. Como você está buscando uma vaga em Go, é sempre bom ter esses fundamentos de front-end na ponta da língua, né?

---

# Entendendo Pipes no Angular

Pipes no Angular são uma ferramenta poderosa para **transformar dados antes de exibi-los** na interface do usuário. Eles são uma maneira simples e eficiente de formatar e manipular dados em seus templates, tornando o código mais limpo e legível, já que a lógica de formatação é separada da lógica do componente.

A relevância dos Pipes está na sua capacidade de **reuso** e **manutenção**. Em vez de repetir a mesma lógica de formatação em vários componentes ou interpolar expressões complexas nos templates, você pode criar um Pipe uma única vez e usá-lo em qualquer lugar da sua aplicação. Isso ajuda a manter seu código DRY (Don't Repeat Yourself) e facilita a leitura e o entendimento do que está sendo exibido.

Basicamente, um Pipe recebe um valor de entrada, transforma esse valor e retorna o valor transformado para ser exibido. Pense neles como pequenas funções puras que são aplicadas aos dados.

---

## Sumário

- **Introdução aos Pipes**
    - Definição e Propósito
- **Criando um Pipe Customizado**
    - Sintaxe e Estrutura
    - Decorador `@Pipe`
    - Interface `PipeTransform`
- **Componentes Principais e Associados**
    - `transform` Método
    - Argumentos e Encadeamento
- **Exemplos de Código Otimizados**
    - Exemplo Básico: Capitalizar String
    - Exemplo Avançado: Filtrar Lista
- **Informações Adicionais**
    - Prós e Contras dos Pipes
    - Quando Usar e Quando Evitar
    - Pipes Puros e Impuros
- **Referências para Estudo Independente**

---

# Conteúdo Detalhado

## Criando um Pipe Customizado

Para criar um Pipe personalizado no Angular, você precisa seguir uma estrutura específica:

### Sintaxe e Estrutura

Um Pipe customizado é uma classe TypeScript decorada com `@Pipe()` e que implementa a interface `PipeTransform`.

```tsx
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nomeDoMeuPipe' // Nome que será usado no template
})
export class NomeDoMeuPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    // Lógica de transformação aqui
    return value;
  }
}

```

### Componentes Principais e Associados

- **`@Pipe` Decorador**: Este decorador é o que identifica a classe como um Pipe. Ele exige uma propriedade `name`, que é a string que você usará para referenciar o Pipe nos templates. Por exemplo, se o `name` for `'meuPipe'`, você o usará como `{{ valor | meuPipe }}`.
- **`PipeTransform` Interface**: Essa interface define um único método obrigatório: `transform`. Sua classe de Pipe deve implementar este método.

### `transform` Método

O método `transform` é onde a mágica acontece. Ele recebe o valor de entrada como primeiro argumento e, opcionalmente, qualquer número de argumentos adicionais que você possa querer passar para o Pipe.

```tsx
transform(value: any, arg1?: any, arg2?: any, ...restArgs: any[]): any {
  // 'value' é o dado que está sendo transformado (ex: uma string, um número, um objeto)
  // 'arg1', 'arg2', etc., são argumentos opcionais que você passa para o pipe no template
  // A função deve retornar o valor transformado
  return value;
}

```

### Argumentos e Encadeamento

Você pode passar argumentos para um Pipe usando dois pontos (`:`) após o nome do Pipe, e pode encadear múltiplos Pipes usando o caractere Pipe (`|`).

```html
<p>{{ 'olá mundo' | meuTransformador: 'maiusculo' }}</p>

<p>{{ 'data e hora' | date:'short' | uppercase }}</p>

```

### Restrições de Uso

Pipes são ideais para **transformações de dados puras**. Isso significa que, dada a mesma entrada, eles sempre devem produzir a mesma saída e não devem ter efeitos colaterais (ou seja, não devem modificar o estado da aplicação). Pipes puros são mais performáticos, pois o Angular pode otimizar a execução, rodando o Pipe apenas quando a entrada ou os argumentos mudam.

Evite usar Pipes para lógica complexa que envolva chamadas assíncronas, manipulação de DOM ou qualquer coisa que mude o estado da aplicação. Para esses casos, é melhor usar métodos no componente.

---

# Exemplos de Código Otimizados

Vamos ver alguns exemplos práticos, Gedê.

### Exemplo Básico: Capitalizar String

Crie um Pipe para capitalizar a primeira letra de uma string.

1. **Gere o Pipe:**
    
    ```bash
    ng generate pipe capitalize
    
    ```
    
2. **`capitalize.pipe.ts`:**
    
    ```tsx
    import { Pipe, PipeTransform } from '@angular/core';
    
    @Pipe({
      name: 'capitalize'
    })
    export class CapitalizePipe implements PipeTransform {
      transform(value: string): string {
        if (!value) return ''; // Garante que não haverá erro se o valor for nulo ou vazio
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    }
    
    ```
    
3. **`app.module.ts` (ou o módulo onde você usará o Pipe):**
Certifique-se de que o Pipe está declarado no `declarations` array do seu módulo. Quando você gera o Pipe com o CLI, ele já faz isso automaticamente.
    
    ```tsx
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { AppComponent } from './app.component';
    import { CapitalizePipe } from './capitalize.pipe'; // Importe seu pipe
    
    @NgModule({
      declarations: [
        AppComponent,
        CapitalizePipe // Declare seu pipe aqui
      ],
      imports: [
        BrowserModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    
    ```
    
4. **Uso no Template (`app.component.html`):**
    
    ```html
    <p>Nome original: gedê</p>
    <p>Nome capitalizado: {{ 'gedê' | capitalize }}</p>
    
    <p>Minha cidade: colatina</p>
    <p>Cidade formatada: {{ 'colatina' | capitalize }}</p>
    
    ```
    
    **Saída:**
    
    ```
    Nome original: gedê
    Nome capitalizado: Gedê
    
    Minha cidade: colatina
    Cidade formatada: Colatina
    
    ```
    

### Exemplo Avançado: Filtrar Lista de Objetos

Imagine que você tem uma lista de produtos e quer filtrar por um termo de busca. Embora um Pipe de filtro possa impactar a performance em listas muito grandes (já que o Angular re-executa o pipe em cada ciclo de detecção de mudança para pipes puros), para listas menores ou cenários específicos, é uma solução válida.

1. **Gere o Pipe:**
    
    ```bash
    ng generate pipe filter
    
    ```
    
2. **`filter.pipe.ts`:**
    
    ```tsx
    import { Pipe, PipeTransform } from '@angular/core';
    
    interface Product {
      id: number;
      name: string;
      category: string;
      price: number;
    }
    
    @Pipe({
      name: 'filter'
    })
    export class FilterPipe implements PipeTransform {
      transform(items: any[], searchText: string, fieldName: string = 'name'): any[] {
        if (!items || !searchText) {
          return items;
        }
    
        searchText = searchText.toLowerCase();
    
        return items.filter(item => {
          if (item[fieldName]) {
            return item[fieldName].toLowerCase().includes(searchText);
          }
          return false;
        });
      }
    }
    
    ```
    
3. **`app.component.ts`:**
    
    ```tsx
    import { Component } from '@angular/core';
    
    interface Product {
      id: number;
      name: string;
      category: string;
      price: number;
    }
    
    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })
    export class AppComponent {
      products: Product[] = [
        { id: 1, name: 'Notebook', category: 'Eletrônicos', price: 5000 },
        { id: 2, name: 'Mouse', category: 'Eletrônicos', price: 150 },
        { id: 3, name: 'Teclado Mecânico', category: 'Periféricos', price: 400 },
        { id: 4, name: 'Monitor', category: 'Eletrônicos', price: 1200 },
        { id: 5, name: 'Câmera', category: 'Fotografia', price: 800 }
      ];
    
      searchTerm: string = '';
      filterByField: string = 'name'; // Pode ser 'name', 'category', etc.
    }
    
    ```
    
4. **Uso no Template (`app.component.html`):**
    
    ```html
    <div>
      <input type="text" [(ngModel)]="searchTerm" placeholder="Buscar produto...">
      <select [(ngModel)]="filterByField">
        <option value="name">Nome</option>
        <option value="category">Categoria</option>
      </select>
    </div>
    
    <ul>
      <li *ngFor="let product of products | filter:searchTerm:filterByField">
        {{ product.name }} ({{ product.category }}) - R$ {{ product.price | number:'1.2-2' }}
      </li>
    </ul>
    
    ```
    
    Neste exemplo, o pipe `filter` recebe o array `products`, o `searchTerm` e o `filterByField`. A cada mudança no `searchTerm` ou `filterByField`, o pipe é re-executado. Note que usei o pipe `number` padrão do Angular para formatar o preço, mostrando como eles podem ser encadeados.
    

---

# Informações Adicionais

### Prós e Contras dos Pipes

**Prós:**

- **Reusabilidade:** Crie uma vez, use em vários lugares.
- **Código Limpo:** Separa a lógica de transformação do componente e do template, tornando-os mais legíveis.
- **Performance (Pipes Puros):** Angular otimiza a execução de pipes puros, rodando-os apenas quando o valor de entrada ou os argumentos mudam.
- **Componibilidade:** Podem ser encadeados para realizar múltiplas transformações.
- **Teste Unitário:** Pipes são funções puras, o que os torna fáceis de testar em isolamento.

**Contras:**

- **Performance (Pipes Impuros):** Pipes impuros são executados a cada ciclo de detecção de mudança, o que pode impactar a performance se usados em larga escala ou com lógica complexa.
- **Depuração:** Às vezes pode ser um pouco mais desafiador depurar problemas que surgem de Pipes complexos.
- **Limitações para Lógica Complexa:** Não são adequados para transformações que exigem interação com serviços, chamadas assíncronas ou manipulação de DOM.

### Quando Utilizar / Quando Evitar o Uso

**Quando Utilizar:**

- Para **formatação de dados visuais** (datas, moedas, textos).
- Para **transformações de dados puras** (que não alteram o estado da aplicação).
- Quando a lógica de transformação é **reutilizável** em vários locais.
- Para filtros e ordenações em **listas pequenas a médias**, onde a performance não é um gargalo crítico.

**Quando Evitar o Uso:**

- Para **operações complexas** que exigem chamadas de API, acesso a serviços ou gerenciamento de estado. Nesses casos, prefira métodos no componente ou serviços.
- Para **filtros ou ordenações de listas muito grandes**, pois podem causar problemas de performance se o Pipe for impuro ou a lógica for pesada. Nesses cenários, é melhor mover a lógica de filtro/ordenação para o componente ou para um serviço, atualizando a coleção de dados diretamente.
- Quando a transformação envolve **efeitos colaterais**.

### Pipes Puros e Impuros

Por padrão, todos os Pipes que você cria são **Puros**.

- **Pipes Puros**:
    - São executados apenas quando o valor de entrada ou os argumentos passados para o Pipe mudam (por **referência**).
    - Isso significa que se você passar um objeto ou array para um pipe puro e apenas uma propriedade interna desse objeto/array mudar, o pipe **não será re-executado** (a menos que a referência do objeto/array mude).
    - São mais performáticos e preferíveis na maioria dos casos.
- **Pipes Impuros**:
    - São executados a cada ciclo de detecção de mudança (aproximadamente a cada evento, como um clique, entrada de teclado, etc.).
    - Você os declara definindo `pure: false` no decorador `@Pipe`:
        
        ```tsx
        @Pipe({
          name: 'meuPipeImpuro',
          pure: false // Torna o pipe impuro
        })
        export class MeuPipeImpuro implements PipeTransform { /* ... */ }
        
        ```
        
    - São necessários quando a transformação depende de um estado que pode mudar sem uma nova referência para o valor de entrada (por exemplo, um filtro que reage a um serviço externo, ou um filtro que verifica mudanças internas de um array sem que a referência do array mude).
    - Devem ser usados com cautela devido ao potencial impacto na performance.

---

# Referências para Estudo Independente

Para se aprofundar ainda mais nos Pipes do Angular, A.R.I.A. recomenda os seguintes recursos:

- **Documentação Oficial do Angular - Pipes:** Esta é sempre a melhor fonte para informações detalhadas e atualizadas.
    - [Angular Pipes](https://angular.io/guide/pipes)
- **Artigos e Tutoriais:**
    - [Custom Pipes in Angular - GeeksforGeeks](https://www.google.com/search?q=https://www.geeksforgeeks.org/custom-pipes-in-angular/)
    - [Angular Pipes: Best Practices - Indepth.dev](https://www.google.com/search?q=https://indepth.dev/posts/1487/angular-pipes-best-practices)
- **Vídeos (Busca no YouTube):**
    - Procure por "Angular custom pipes tutorial" para encontrar demonstrações visuais e explicações.

Espero que essa explicação detalhada te ajude a dominar os Pipes no Angular, Gedê\! Se tiver mais alguma dúvida, é só chamar a A.R.I.A.\!