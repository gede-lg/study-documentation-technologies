# Pipes parametrizados

E aí, Gedê\! Beleza? Compreendo que você deseja uma explicação detalhada sobre como os parâmetros funcionam em Pipes no Angular. Como um desenvolvedor Backend Java em transição para Go, entender a manipulação de dados na camada de visualização é superimportante. Vamos lá\!

---

## Pipes e Parâmetros no Angular: Uma Visão Geral

Pipes no Angular são funções que permitem **transformar dados antes de exibi-los** na UI (User Interface). Eles são uma maneira conveniente de formatar strings, moedas, datas e muito mais, diretamente nos templates HTML.

A relevância dos pipes é enorme para desenvolvedores como você, Gedê, pois eles promovem a **reusabilidade e a separação de responsabilidades**. Em vez de ter lógica de formatação complexa em seus componentes, você a encapsula em um pipe, tornando seu código mais limpo, legível e fácil de manter.

Os **parâmetros em pipes** são argumentos adicionais que você pode passar para um pipe, permitindo que a transformação seja mais flexível e configurável. Eles servem para modificar o comportamento padrão do pipe, adaptando a saída de acordo com suas necessidades específicas.

---

## Sumário

- **Introdução aos Pipes com Parâmetros**
- **Sintaxe e Estrutura**
    - Uso de Pipes Nativos com Parâmetros
    - Criação de Pipes Personalizados com Parâmetros
- **Componentes Principais e Associados**
    - `@Pipe` Decorator
    - `PipeTransform` Interface
- **Restrições de Uso**
- **Exemplos de Código Otimizados**
    - Pipe de Moeda com Parâmetros
    - Pipe de Filtro Personalizado
- **Informações Adicionais**
    - Prós e Contras
    - Quando Utilizar e Quando Evitar o Uso
- **Referências para Estudo Independente**

---

## Conteúdo Detalhado

### Sintaxe e Estrutura

A sintaxe básica para usar um pipe no Angular é o símbolo de pipe (`|`). Para passar parâmetros, você usa dois pontos (`:`) seguidos pelo valor do parâmetro. Se houver múltiplos parâmetros, eles são separados por mais dois pontos.

### Uso de Pipes Nativos com Parâmetros

Muitos pipes nativos do Angular já aceitam parâmetros para configurações adicionais.

**Exemplos de Declaração e Utilização:**

- **`DatePipe`**: Formata datas.
    
    ```html
    <p>Data de hoje: {{ today | date:'shortDate' }}</p>
    
    <p>Data completa: {{ today | date:'fullDate' }}</p>
    
    <p>Data personalizada: {{ today | date:'dd-MM-yyyy' }}</p>
    
    ```
    
- **`CurrencyPipe`**: Formata valores monetários.
    
    ```html
    <p>Preço (USD): {{ price | currency:'USD' }}</p>
    
    <p>Preço (BRL): {{ price | currency:'BRL' }}</p>
    
    <p>Preço (BRL, sem símbolo): {{ price | currency:'BRL':'symbol':'1.2-2' }}</p>
    
    ```
    
- **`SlicePipe`**: Retorna uma fatia de uma string ou array.
    
    ```html
    <p>Primeiros 6 caracteres: {{ 'Olá Mundo' | slice:0:6 }}</p>
    
    <p>A partir do 5º caractere: {{ 'Olá Mundo' | slice:4 }}</p>
    
    ```
    

### Criação de Pipes Personalizados com Parâmetros

Para criar seus próprios pipes que aceitam parâmetros, você precisa definir os parâmetros no método `transform` da sua classe de pipe.

```tsx
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meuPipePersonalizado'
})
export class MeuPipePersonalizado implements PipeTransform {
  transform(value: any, parametro1: string, parametro2?: number): string {
    // Lógica de transformação que utiliza parametro1 e parametro2
    return `Valor original: ${value}, Parametro1: ${parametro1}, Parametro2: ${parametro2 || 'Não informado'}`;
  }
}

```

### Componentes Principais e Associados

Ao criar um pipe personalizado, dois elementos são essenciais:

- **`@Pipe` Decorator**: É usado para declarar uma classe como um pipe. Ele exige a propriedade `name`, que é o nome que você usará no template para invocar o pipe.
    
    ```tsx
    @Pipe({
      name: 'meuPipePersonalizado' // Nome que será usado no HTML
    })
    
    ```
    
- **`PipeTransform` Interface**: Essa interface deve ser implementada pela sua classe de pipe e exige a implementação do método `transform`. O Angular chama esse método quando o pipe é executado.
    - **`transform(value: any, ...args: any[]): any`**:
        - `value`: É o valor que o pipe está processando (o dado à esquerda do `|`).
        - `...args`: Representa os parâmetros passados para o pipe. Eles são recebidos como um array de argumentos. Você pode definir os tipos dos seus parâmetros diretamente na assinatura do método `transform` para maior clareza e tipagem forte.
    
    **Explicação da Interação:**
    Quando você usa um pipe no seu template, por exemplo `{{ someValue | myPipe:param1:param2 }}`, o Angular faz o seguinte:
    
    1. Ele encontra a classe do pipe `myPipe` (baseado no `name` do `@Pipe` decorator).
    2. Ele chama o método `transform` dessa classe.
    3. `someValue` é passado como o primeiro argumento (`value`).
    4. `param1` é passado como o segundo argumento (ou `args[0]`).
    5. `param2` é passado como o terceiro argumento (ou `args[1]`).
    6. O valor retornado pelo método `transform` é exibido no template.

### Restrições de Uso

Embora poderosos, pipes têm algumas considerações:

- **Pipes Puros vs. Impuros**: Por padrão, os pipes são **puros**. Isso significa que o Angular só re-executará o pipe se o valor de entrada (o `value`) ou qualquer um dos parâmetros de entrada mudar (por referência). Se você tem um array e apenas um item dentro do array muda, mas a referência do array permanece a mesma, um pipe puro *não será re-executado*.
    - **Pipes Impuros**: Se você precisa que um pipe seja re-executado sempre que a detecção de mudança ocorrer (mesmo que a referência não mude, como em um filtro de array onde os itens internos mudam), você pode declarar um pipe como `pure: false` no `@Pipe` decorator. No entanto, pipes impuros são menos eficientes e podem afetar a performance se usados em excesso, pois são executados a cada ciclo de detecção de mudanças.
    - **Exemplo de Pipe Impuro**:
        
        ```tsx
        @Pipe({
          name: 'meuPipeImpuro',
          pure: false // Marca o pipe como impuro
        })
        export class MeuPipeImpuro implements PipeTransform {
          transform(items: any[], filter: string): any[] {
            // Lógica de filtro que pode depender de mudanças internas nos items
            return items.filter(item => item.name.includes(filter));
          }
        }
        
        ```
        
- **Evite Lógica Complexa**: Pipes devem ser usados para transformações de exibição. Lógica de negócio complexa ou operações que causam efeitos colaterais (como modificações de estado) não devem ser colocadas em pipes. Mantenha-os focados em formatação e apresentação.
- **Performance com Dados Grandes**: Pipes impuros em conjuntos de dados muito grandes podem levar a problemas de performance, pois são executados com muita frequência. Nesses casos, considere mover a lógica para o componente e armazenar o resultado em uma propriedade.

---

## Exemplos de Código Otimizados

### Exemplo 1: Pipe de Moeda Personalizado com Parâmetros para Taxa de Câmbio

Este pipe converterá um valor para uma moeda diferente usando uma taxa de câmbio fornecida como parâmetro.

```tsx
// src/app/pipes/exchange-currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exchangeCurrency'
})
export class ExchangeCurrencyPipe implements PipeTransform {
  /**
   * Transforma um valor numérico em um valor de outra moeda.
   * @param value O valor numérico a ser convertido.
   * @param exchangeRate A taxa de câmbio para a nova moeda (ex: 5.0 para USD para BRL).
   * @param targetCurrencyCode O código da moeda de destino (ex: 'BRL', 'EUR').
   * @param display O formato de exibição do símbolo ('symbol', 'code', 'symbol-narrow', ou 'none').
   * @param digitsInfo O formato para dígitos decimais (ex: '1.2-2' para 1 inteiro, 2 decimais).
   * @returns O valor formatado na moeda de destino.
   */
  transform(
    value: number | string,
    exchangeRate: number,
    targetCurrencyCode: string = 'BRL',
    display: 'symbol' | 'code' | 'symbol-narrow' | boolean = 'symbol',
    digitsInfo: string = '1.2-2'
  ): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) {
      console.warn('ExchangeCurrencyPipe: O valor de entrada não é um número válido.');
      return null;
    }

    const convertedValue = numericValue * exchangeRate;

    // Usamos o CurrencyPipe nativo internamente para a formatação final.
    // Para isso, precisamos de uma instância. Isso não é ideal para pipes
    // por injeção de dependência em pipes puros, mas para este exemplo didático,
    // ou em pipes impuros, é aceitável. Uma alternativa seria a API Intl.NumberFormat.
    // Para um pipe puro que usa outro pipe, seria melhor encapsular a lógica de formatação.

    // No entanto, a melhor prática aqui é usar Intl.NumberFormat para evitar
    // a injeção de CurrencyPipe em um pipe que já está em um template.
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: targetCurrencyCode,
        minimumFractionDigits: parseInt(digitsInfo.split('-')[0].split('.')[1] || '2'),
        maximumFractionDigits: parseInt(digitsInfo.split('-')[1] || '2')
      }).format(convertedValue);
    } catch (e) {
      console.error('Erro ao formatar moeda:', e);
      return convertedValue.toFixed(2); // Fallback
    }
  }
}

```

```tsx
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ExchangeCurrencyPipe } from './pipes/exchange-currency.pipe'; // Importe o pipe

@NgModule({
  declarations: [
    AppComponent,
    ExchangeCurrencyPipe // Declare o pipe aqui
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

```html
<p>Valor em USD: $100.00</p>
<p>Convertido para BRL (Taxa 5.25): {{ 100 | exchangeCurrency:5.25:'BRL' }}</p>

<p>Convertido para EUR (Taxa 0.92): {{ 50 | exchangeCurrency:0.92:'EUR':'code' }}</p>

<p>Convertido para JPY (Taxa 145.50): {{ 200 | exchangeCurrency:145.50:'JPY':'symbol':'1.0-0' }}</p>

```

### Exemplo 2: Pipe de Filtro de Lista (Busca)

Este pipe filtra uma lista de objetos com base em um termo de busca e uma propriedade específica do objeto.

```tsx
// src/app/pipes/filter-by-property.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByProperty',
  pure: false // Opcional: defina como true se a lista não mudar frequentemente
              // ou se a referência da lista sempre mudar ao adicionar/remover itens.
              // False aqui para reavaliar o filtro a cada mudança no input.
})
export class FilterByPropertyPipe implements PipeTransform {
  /**
   * Filtra um array de objetos por uma propriedade específica.
   * @param items O array de objetos a ser filtrado.
   * @param searchTerm O termo de busca.
   * @param propertyName A propriedade do objeto a ser usada na busca.
   * @returns O array filtrado.
   */
  transform(items: any[], searchTerm: string, propertyName: string): any[] {
    if (!items || !searchTerm || !propertyName) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      // Garante que a propriedade existe e é uma string antes de chamar toLowerCase
      const propertyValue = item[propertyName];
      return propertyValue && typeof propertyValue === 'string' && propertyValue.toLowerCase().includes(searchTerm);
    });
  }
}

```

```tsx
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Necessário para ngModel
import { AppComponent } from './app.component';
import { FilterByPropertyPipe } from './pipes/filter-by-property.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FilterByPropertyPipe
  ],
  imports: [
    BrowserModule,
    FormsModule // Adicione FormsModule aqui
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

```html
<input [(ngModel)]="searchText" placeholder="Buscar por nome...">

<div *ngFor="let user of users | filterByProperty:searchText:'name'">
  <p>{{ user.name }} ({{ user.age }} anos)</p>
</div>

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchText: string = '';
  users = [
    { name: 'João', age: 30 },
    { name: 'Maria', age: 25 },
    { name: 'Pedro', age: 35 },
    { name: 'Ana', age: 28 },
    { name: 'Carlos', age: 40 }
  ];
}

```

---

## Informações Adicionais

### Prós

- **Reusabilidade**: Centraliza a lógica de formatação, evitando código duplicado.
- **Limpeza do Template**: Mantém o template HTML mais limpo e legível, livre de lógica de apresentação.
- **Separation of Concerns (Separação de Preocupações)**: Lógica de transformação de UI é separada da lógica do componente.
- **Performance Otimizada (com Pipes Puros)**: O Angular otimiza a execução de pipes puros, re-executando-os apenas quando os inputs mudam.
- **Composição**: Pipes podem ser encadeados (`| pipe1 | pipe2:param`).

### Contras

- **Complexidade em Pipes Impuros**: Pipes impuros podem levar a problemas de performance se não forem usados com cautela, pois executam com mais frequência.
- **Depuração**: Às vezes, pode ser um pouco mais difícil depurar problemas que ocorrem dentro de um pipe.
- **Limitado a Lógica de Transformação**: Não são adequados para lógica de negócio complexa ou manipulação do DOM.

### Quando Utilizar

- **Formatação de Dados**: Datas, moedas, percentuais, textos (maiusculas/minusculas).
- **Filtros Simples**: Filtrar listas de dados com base em um critério.
- **Ordenação Simples**: Ordenar listas.
- **Transformações de String**: Limitar caracteres, adicionar reticências, etc.

### Quando Evitar o Uso

- **Lógica de Negócio Complexa**: Qualquer coisa que envolva manipulação de estado, chamadas HTTP ou lógica de decisão complexa. Mova isso para um serviço ou componente.
- **Grandes Transformações de Dados que Afetam a Performance**: Se a transformação for muito pesada e precisar ser executada frequentemente (especialmente com pipes impuros), considere pré-processar os dados no componente.
- **Efeitos Colaterais**: Pipes devem ser "puros" em termos de efeitos colaterais; eles não devem alterar o estado da aplicação.

---

## Referências para Estudo Independente

- **Documentação Oficial do Angular - Pipes**: O melhor lugar para começar e se aprofundar.
    - [Angular Pipes Overview](https://angular.io/guide/pipes)
    - [Built-in Angular Pipes](https://angular.io/api?query=pipe)
- **Artigos e Tutoriais**:
    - Procure por "Angular custom pipes with parameters" ou "Angular pure vs impure pipes" em blogs como [Netanel Basal](https://blog.angular-university.io/) ou [Angular University](https://blog.angular-university.io/).
- **Livros**:
    - "Angular Development with TypeScript" by Yakov Fain and Anton Moiseev
    - "Ng-Book: The Complete Guide to Angular"

Espero que esta explicação detalhada ajude você a entender e usar os pipes com parâmetros no Angular de forma eficaz, Gedê\! Se tiver mais alguma dúvida, pode perguntar, A.R.I.A está aqui para ajudar\!