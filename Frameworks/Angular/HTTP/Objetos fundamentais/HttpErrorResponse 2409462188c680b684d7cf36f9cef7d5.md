# HttpErrorResponse

Olá, Gedê\!

A.R.I.A. está pronta para te ajudar com uma explicação detalhada sobre o `HttpErrorResponse` do Angular. Como desenvolvedor que busca se aprofundar em Go, é ótimo ver você explorando a fundo os conceitos de desenvolvimento web, especialmente o tratamento de erros em requisições HTTP. Vamos mergulhar nesse tema, com uma abordagem completa para você.

---

### HttpErrorResponse no Angular: Detalhes e Aplicação Prática

---

### Introdução

Ao interagir com APIs em uma aplicação Angular, é fundamental saber como lidar com as respostas de erro que podem surgir. O `HttpErrorResponse` é a classe central do Angular para encapsular essas falhas. Ele fornece uma forma estruturada e consistente de acessar informações detalhadas sobre a falha, como o código de status HTTP, a mensagem de erro e os dados retornados pelo servidor.

### Sumário

Nesta explicação, você encontrará:

- **Conceitos Fundamentais:** O que é o `HttpErrorResponse` e sua importância.
- **Propriedades:** Um guia completo de todas as propriedades da classe e como utilizá-las.
- **Métodos:** Uma visão geral sobre os métodos (e por que são limitados).
- **Restrições de Uso:** Cenários onde a classe não é aplicável.
- **Melhores Práticas:** Como tratar erros de forma eficiente em seus serviços e componentes.
- **Exemplo Completo:** Um código prático que demonstra o tratamento de erros em um serviço e componente.

---

### Conceitos Fundamentais

O `HttpErrorResponse` é uma classe especializada que estende a classe `HttpResponseBase` e é emitida pelo `HttpClient` do Angular quando ocorre um erro durante uma requisição HTTP. Ela é o objeto que você recebe no bloco `catchError` de um `Observable`.

Seu principal propósito é normalizar a maneira como os erros são apresentados na aplicação. Em vez de lidar com diferentes tipos de erros (como erros de rede, erros do lado do servidor ou erros do lado do cliente), o Angular os unifica em um único tipo, permitindo um tratamento consistente.

---

### Propriedades do `HttpErrorResponse`

A classe `HttpErrorResponse` possui diversas propriedades que fornecem informações valiosas sobre o erro. Todas as propriedades são **somente leitura**.

| Propriedade | Tipo | Descrição | Exemplo de Uso |
| --- | --- | --- | --- |
| `name` | `string` | O nome do objeto. Para `HttpErrorResponse`, é sempre `'HttpErrorResponse'`. | `error.name` |
| `message` | `string` | Uma mensagem de erro resumida. Ela pode ser gerada pelo próprio Angular ou conter a mensagem do servidor. | `error.message` |
| `ok` | `boolean` | Indica se a requisição foi bem-sucedida. Para erros, seu valor é sempre `false`. | `error.ok` |
| `status` | `number` | O código de status HTTP da resposta (ex: `404`, `500`). Se for um erro de rede, pode ser `0`. | `error.status` |
| `statusText` | `string` | A mensagem de texto associada ao código de status (ex: `'Not Found'`, `'Internal Server Error'`). Se for um erro de rede, pode ser `'Unknown Error'`. | `error.statusText` |
| `url` | `string` | A URL da requisição que falhou. | `error.url` |
| `error` | `any` ou `ErrorEvent` | Contém o corpo da resposta de erro do servidor (quando disponível). Para erros de rede ou do lado do cliente, contém um objeto `ErrorEvent`. | `error.error` |
| `headers` | `HttpHeaders` | Os cabeçalhos da resposta de erro. | `error.headers` |

**Sintaxe de uso:**

```tsx
// Exemplo em um bloco catchError
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

// ...

catchError((error: HttpErrorResponse) => {
  console.log('Erro de requisição:', error.status);
  console.log('Mensagem:', error.message);

  if (error.status === 404) {
    console.log('Recurso não encontrado.');
  } else if (error.status >= 500) {
    console.log('Erro no servidor. Tente novamente mais tarde.');
  }

  // A propriedade 'error' contém o corpo do erro do servidor.
  // Pode ser um objeto JSON, string, etc.
  if (error.error instanceof ErrorEvent) {
    // Erro do lado do cliente ou de rede.
    console.error('Um erro de rede ou do lado do cliente ocorreu:', error.error.message);
  } else {
    // O backend retornou um código de resposta sem sucesso.
    // O corpo da resposta pode conter informações úteis.
    console.error(`Backend retornou o código ${error.status}, body era: `, error.error);
  }

  // Retorne um observable com uma mensagem de erro voltada para o usuário.
  return throwError(() => new Error('Ocorreu um erro ao buscar os dados. Tente novamente.'));
});

```

---

### Métodos do `HttpErrorResponse`

A classe `HttpErrorResponse` herda da classe `HttpResponseBase`, que não possui métodos próprios, apenas propriedades. Portanto, na prática, o `HttpErrorResponse` não tem métodos relevantes para serem chamados diretamente. Seu uso se limita a acessar e inspecionar suas propriedades para entender e tratar o erro.

---

### Restrições de Uso

O `HttpErrorResponse` é projetado especificamente para erros que ocorrem durante requisições HTTP feitas pelo `HttpClient` do Angular. Você não deve usá-lo para:

- **Tratamento de erros síncronos:** Erros lançados diretamente no código, fora de um contexto assíncrono de requisição HTTP. Para isso, use blocos `try...catch`.
- **Erros não relacionados a HTTP:** Erros de validação de formulário, erros de lógica de negócio em sua aplicação, ou outros tipos de exceções que não vêm de uma chamada de API. Para esses casos, crie suas próprias classes de erro ou use as classes de erro padrão do JavaScript.

---

### Melhores Práticas e Casos de Uso

1. **Centralize o tratamento de erros:** A melhor prática é tratar os erros em um único lugar, geralmente em um **`interceptor`**. Isso evita a duplicação de código em todos os seus serviços e componentes. O `interceptor` pode, por exemplo, registrar o erro, mostrar uma notificação global para o usuário e até mesmo redirecionar para uma página de erro.
2. **Trate diferentes tipos de erros:**
    - **Erros do lado do cliente (`status = 0` ou `instanceof ErrorEvent`):** Erros de rede, como perda de conexão. Mostre uma mensagem clara ao usuário como "Verifique sua conexão com a internet."
    - **Erros de status 4xx:** Erros do lado do cliente (no sentido de que a requisição está errada). Exemplos: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`. Para cada um, mostre uma mensagem específica e útil. Para um `401`, por exemplo, redirecione para a tela de login.
    - **Erros de status 5xx:** Erros do lado do servidor. Mostre uma mensagem genérica como "Ocorreu um erro no servidor. Tente novamente mais tarde."
3. **Encapsule a lógica de erro:** Em seus serviços, use o `catchError` do RxJS para tratar o erro e, em seguida, retorne um `Observable` que lança um erro mais amigável ou uma mensagem de erro customizada. Isso mantém a lógica de tratamento fora de seus componentes.

---

### Exemplo Completo

Vamos criar um serviço simples e um componente para ilustrar como isso funciona na prática.

### 1\. O Serviço (`api.service.ts`)

Este serviço simula uma chamada a uma API e trata o erro de forma centralizada.

```tsx
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = '<https://jsonplaceholder.typicode.com/posts/1>';
  private apiErrorUrl = '<https://jsonplaceholder.typicode.com/posts/999999>'; // Esta URL irá gerar um erro 404

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError) // Chamamos o nosso método de tratamento de erro
    );
  }

  getNonExistentData(): Observable<any> {
    return this.http.get<any>(this.apiErrorUrl).pipe(
      catchError(this.handleError) // Este irá sempre cair no erro
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente ou de rede
      console.error('Um erro de rede ou do lado do cliente ocorreu:', error.error.message);
      errorMessage = 'Erro de conexão. Verifique sua rede.';
    } else {
      // Erro do servidor
      console.error(
        `Backend retornou o código ${error.status}, ` +
        `mensagem do servidor: ${error.message}`);

      switch (error.status) {
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 401:
          errorMessage = 'Você não tem autorização para acessar este recurso.';
          // Exemplo: redirecionar para a tela de login
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Erro: ${error.status} - ${error.statusText}`;
      }
    }
    // Retorna um observable de erro com uma mensagem amigável para o componente
    return throwError(() => new Error(errorMessage));
  }
}

```

### 2\. O Componente (`my-component.ts`)

O componente se inscreve no `Observable` do serviço e trata o erro de forma simplificada, exibindo a mensagem amigável para o usuário.

```tsx
import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-my-component',
  template: `
    <div *ngIf="data">
      <h3>Dados Carregados:</h3>
      <pre>{{ data | json }}</pre>
    </div>
    <div *ngIf="errorMessage" style="color: red;">
      <h3>Erro:</h3>
      <p>{{ errorMessage }}</p>
    </div>
    <button (click)="loadData()">Carregar Dados</button>
    <button (click)="loadNonExistentData()">Simular Erro</button>
  `,
})
export class MyComponent implements OnInit {

  data: any;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Chamada inicial (opcional)
  }

  loadData(): void {
    this.errorMessage = null;
    this.apiService.getData().subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (error: Error) => {
        // Apenas exibe a mensagem de erro que já foi tratada no serviço
        this.errorMessage = error.message;
      }
    });
  }

  loadNonExistentData(): void {
    this.errorMessage = null;
    this.apiService.getNonExistentData().subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (error: Error) => {
        // Aqui, 'error' já é um objeto 'Error' com a mensagem amigável
        this.errorMessage = error.message;
      }
    });
  }
}

```

### Sugestões para Aprofundamento

Para continuar sua jornada, Gedê, sugiro explorar os seguintes tópicos relacionados:

- **Interceptores HTTP do Angular:** Como criar e usar `HttpInterceptor` para centralizar o tratamento de erros, autenticação, logs e outras tarefas.
- **RxJS `retry()` e `retryWhen()`:** Estratégias para re-executar requisições que falharam temporariamente (como em caso de erros de rede) antes de lançar o erro.
- **Tratamento de erros em APIs REST:** Estudar como APIs bem projetadas retornam mensagens de erro claras e consistentes, o que facilita o tratamento no front-end.

Espero que esta explicação detalhada tenha sido útil. Se tiver mais alguma dúvida ou quiser aprofundar em qualquer um desses tópicos, é só me chamar.