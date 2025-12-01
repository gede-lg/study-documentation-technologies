# Tipos de Interceptadores

Claro, Gedê\! Entendi perfeitamente sua solicitação sobre **Interceptors HTTP no Angular**.

Vamos mergulhar fundo neste tópico, cobrindo todos os pontos que você pediu, desde os conceitos fundamentais até exemplos práticos e as melhores práticas. Como a explicação será bem detalhada, vou dividi-la em partes lógicas para facilitar a leitura.

---

## Dominando os Interceptores HTTP no Angular: Um Guia Completo

### Introdução

No desenvolvimento de aplicações web modernas, a comunicação com APIs REST é uma tarefa central. O Angular, com seu robusto módulo `HttpClient`, facilita essa interação. No entanto, muitas vezes precisamos de uma forma de interceptar e manipular as requisições e respostas HTTP de maneira global, antes que elas cheguem ao servidor ou antes que sejam processadas pelo código da nossa aplicação. É aqui que entram os **Interceptors HTTP**.

### Sumário

Este guia detalhado abordará o conceito, sintaxe, métodos, propriedades, restrições, elementos associados, melhores práticas e exemplos completos de como criar e utilizar Interceptores HTTP no Angular. Exploraremos as abordagens baseadas em classes (versões mais antigas) e em funções (a partir do Angular 17), garantindo que você tenha um entendimento abrangente e prático sobre essa ferramenta poderosa.

### Conceitos Fundamentais

Os Interceptores HTTP no Angular funcionam como um **middleware** no fluxo de comunicação entre o cliente (sua aplicação Angular) e o servidor. Eles permitem que você **intercepta** as requisições enviadas e as respostas recebidas, oferecendo a oportunidade de:

- **Modificar requisições:** Adicionar cabeçalhos (headers) de autenticação (como tokens JWT), logs, parâmetros de consulta, ou qualquer outra modificação antes que a requisição seja enviada.
- **Modificar respostas:** Tratar erros globalmente, formatar dados recebidos, ou aplicar transformações nas respostas antes que elas cheguem aos componentes que as solicitaram.
- **Adicionar lógica global:** Implementar loaders de carregamento, mecanismos de cache, ou qualquer outra lógica que precise ser executada para todas (ou um subconjunto) das requisições HTTP.

Eles são uma parte crucial do `HttpClient` do Angular e são implementados como um array de provedores em seu módulo raiz (`AppModule`) ou em módulos específicos, permitindo uma arquitetura modular e fácil manutenção.

---

## Criando um Interceptor: Sintaxe e Uso

A partir do Angular 17, o Angular introduziu uma nova forma de criar interceptores usando funções, tornando o processo mais conciso e "standalone". No entanto, a forma baseada em classes ainda é amplamente utilizada em projetos legados e ainda é suportada. Vamos cobrir ambas as abordagens.

### 1\. Interceptores Baseados em Classes (Versões Antigas - `HttpInterceptor`)

Antes do Angular 17, os interceptores eram implementados como classes que implementavam a interface `HttpInterceptor`.

### Sintaxe Básica

Para criar um interceptor baseado em classe, você precisa:

1. Criar uma classe que implemente a interface `HttpInterceptor`.
2. Implementar o método `intercept()`.

<!-- end list -->

```tsx
// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable() // Necessário para injeção de dependência se o interceptor precisar de outros serviços
export class AuthInterceptor implements HttpInterceptor {
  constructor() {} // Pode injetar serviços aqui, se necessário

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Lógica antes da requisição ser enviada
    const authToken = 'SEU_TOKEN_AQUI'; // Exemplo: Pegar token de um serviço de autenticação
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Passa a requisição modificada para o próximo handler na cadeia
    return next.handle(authRequest);
  }
}

```

### Registro do Interceptor

Para que o Angular utilize seu interceptor, você precisa registrá-lo no array `providers` do seu `AppModule` (ou outro módulo).

```tsx
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; // Importante!

import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Importe seu interceptor

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule], // HttpClientModule é necessário
  providers: [
    {
      provide: HTTP_INTERCEPTORS, // Token de injeção para interceptores
      useClass: AuthInterceptor, // Sua classe de interceptor
      multi: true, // Indica que múltiplos interceptores podem ser fornecidos
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

A propriedade `multi: true` é crucial, pois permite que você registre múltiplos interceptores. Os interceptores são executados na ordem em que são fornecidos no array `providers`.

### 2\. Interceptores Baseados em Funções (Angular 17+)

A partir do Angular 17, você pode criar interceptores usando funções, o que é mais conciso e se alinha com o modelo de injeção de dependência baseado em `inject()`.

### Sintaxe Básica

Para criar um interceptor baseado em função, você usa a função `HttpInterceptorFn`.

```tsx
// src/app/interceptors/auth-fn.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Exemplo de serviço

export const authFnInterceptor: HttpInterceptorFn = (req, next) => {
  // Lógica antes da requisição ser enviada
  const authService = inject(AuthService); // Usando inject para obter serviços
  const authToken = authService.getToken(); // Exemplo: Pegar token de um serviço

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  // Passa a requisição modificada para o próximo handler na cadeia
  return next(authReq);
};

```

### Registro do Interceptor

Você registra interceptores baseados em função de forma similar, mas usando `provideHttpClient(withInterceptors())`.

```tsx
// src/app/app.config.ts (para aplicações standalone)
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importante!

import { routes } from './app.routes';
import { authFnInterceptor } from './interceptors/auth-fn.interceptor';
import { loggingInterceptor } from './interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authFnInterceptor,
        loggingInterceptor, // Você pode adicionar múltiplos aqui
      ])
    ),
  ],
};

```

**Observação:** Em módulos tradicionais (não standalone), você ainda usaria o `HTTP_INTERCEPTORS` com `useValue` para funções.

```tsx
// src/app/app.module.ts (para aplicações não-standalone)
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { authFnInterceptor } from './interceptors/auth-fn.interceptor'; // Importe sua função de interceptor

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useValue: authFnInterceptor, // Use useValue para a função
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

---

## Métodos e Propriedades Essenciais

### 1\. Para Interceptores Baseados em Classes (`HttpInterceptor`)

A interface `HttpInterceptor` define um único método:

### `intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>`

- **`request: HttpRequest<any>`**: Representa a requisição HTTP de saída. É uma instância imutável, o que significa que se você precisar modificá-la (por exemplo, adicionar um cabeçalho), deve cloná-la e fazer as modificações no clone.
    - **Propriedades de `HttpRequest` (comuns):**
        - `url: string`: A URL completa da requisição.
        - `method: string`: O método HTTP (GET, POST, PUT, DELETE, etc.).
        - `headers: HttpHeaders`: Os cabeçalhos da requisição.
        - `body: any`: O corpo da requisição (para métodos como POST, PUT).
        - `params: HttpParams`: Os parâmetros de consulta da requisição.
        - `responseType: 'arraybuffer' | 'blob' | 'json' | 'text'`: O tipo de resposta esperado.
        - `withCredentials: boolean`: Indica se a requisição deve enviar credenciais (cookies, headers de autorização).
- **`next: HttpHandler`**: Representa o próximo interceptor na cadeia de interceptores, ou o backend HTTP se for o último.
    - **Método de `HttpHandler`:**
        - `handle(req: HttpRequest<any>): Observable<HttpEvent<any>>`: Este método envia a requisição para o próximo handler na cadeia e retorna um `Observable` de eventos HTTP (`HttpEvent<any>`). É fundamental chamar `next.handle(request)` para que a requisição continue seu fluxo.
- **Retorno: `Observable<HttpEvent<any>>`**: O método `intercept` deve retornar um `Observable` que emite eventos HTTP.
    - **`HttpEvent<any>`**: É um tipo genérico que pode representar vários eventos durante o ciclo de vida de uma requisição HTTP, como:
        - `HttpResponse<T>`: O evento mais comum, representando uma resposta HTTP bem-sucedida.
        - `HttpHeaderResponse`: Uma resposta que contém apenas os cabeçalhos (ocorre quando `reportProgress` é `true`).
        - `HttpProgressEvent`: Eventos de progresso para upload/download.
        - `HttpSentEvent`: Indica que a requisição foi enviada.
        - `HttpUserEvent<T>`: Eventos personalizados definidos pelo usuário.
        - `HttpDownloadProgressEvent`: Eventos de progresso de download.

### 2\. Para Interceptores Baseados em Funções (`HttpInterceptorFn`)

A `HttpInterceptorFn` é um tipo de função que recebe os mesmos argumentos que o método `intercept` de um interceptor baseado em classe:

### `(req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<unknown>>`

- **`req: HttpRequest<unknown>`**: Idêntico ao `request` do interceptor baseado em classe.
- **`next: HttpHandlerFn`**: Semelhante ao `next` do interceptor baseado em classe, mas é um tipo de função (`(req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>`).
    - **Método de `HttpHandlerFn`:**
        - `next(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>>`: Este é o método para passar a requisição para o próximo na cadeia.
- **Retorno: `Observable<HttpEvent<unknown>>`**: Idêntico ao retorno do interceptor baseado em classe.

---

## Restrições de Uso

Embora poderosos, os interceptores não são a solução para todos os problemas e há cenários onde seu uso pode ser inadequado ou gerar complexidade desnecessária:

1. **Lógica Específica de Componente/Serviço:**
    - **Porquê não:** Se a lógica de modificação de requisição ou tratamento de resposta se aplica apenas a um único componente ou serviço e não tem impacto global, é melhor mantê-la nesse componente/serviço diretamente. Adicionar lógica muito específica a um interceptor pode poluir o interceptor e torná-lo menos reutilizável.
    - **Exemplo:** Um `UserService` que faz uma requisição específica para obter dados do usuário. Se essa requisição requer um cabeçalho único que nenhuma outra requisição usa, adicione o cabeçalho diretamente no `UserService` em vez de criar um interceptor para isso.
2. **Requisições Não HTTP:**
    - **Porquê não:** Interceptores HTTP são, por definição, para o protocolo HTTP. Eles não interceptarão requisições feitas por WebSockets, Server-Sent Events (SSE) ou outras tecnologias de comunicação não-HTTP.
    - **Exemplo:** Se você estiver usando WebSockets para comunicação em tempo real, não tente interceptar as mensagens com um interceptor HTTP. Você precisará de uma abordagem diferente para isso.
3. **Manipulação de DOM ou Interface do Usuário:**
    - **Porquê não:** Interceptores devem ser puros e focados na camada de rede. Eles não devem manipular diretamente o DOM, exibir mensagens de erro na interface do usuário (UI) (exceto talvez para disparar um evento que um serviço de UI escutaria) ou interagir diretamente com o estado global da aplicação de forma que afete a renderização.
    - **Exemplo:** Um interceptor não deve tentar adicionar uma classe CSS a um elemento ou esconder um spinner diretamente. Em vez disso, ele pode emitir um evento ou chamar um método em um serviço de notificação/estado que, por sua vez, atualiza a UI.
4. **Lógica de Negócio Complexa:**
    - **Porquê não:** Interceptores devem ser simples e focar em tarefas transversais da camada de rede. Implementar lógica de negócio complexa ou validações de dados específicas de um domínio dentro de um interceptor pode torná-lo difícil de testar, manter e entender.
    - **Exemplo:** Não use um interceptor para validar se um objeto de `Produto` recebido de uma API tem todos os campos necessários. Isso é responsabilidade do serviço ou da camada de modelo de dados.
5. **Excesso de Interceptores ou Interceptores Muito Longos:**
    - **Porquê não:** Uma cadeia de interceptores muito longa ou interceptores que tentam fazer muitas coisas podem introduzir complexidade e degradação de performance. Cada interceptor adiciona uma sobrecarga.
    - **Melhor prática:** Mantenha os interceptores focados em uma única responsabilidade (SRP - Single Responsibility Principle). Se um interceptor está ficando muito grande, considere dividi-lo em múltiplos interceptores menores e mais específicos.

---

## Elementos Associados

Para trabalhar com interceptores, você interage com várias classes, interfaces e provedores do módulo `@angular/common/http`.

### Interfaces e Classes Essenciais

- **`HttpInterceptor` (Interface - para interceptores de classe):**
    - **Propósito:** Define o contrato para um interceptor HTTP baseado em classe. Exige a implementação do método `intercept`.
    - **Sintaxe:**
        
        ```tsx
        interface HttpInterceptor {
          intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
        }
        
        ```
        
- **`HttpInterceptorFn` (Tipo de Função - para interceptores de função):**
    - **Propósito:** Define o contrato para um interceptor HTTP baseado em função.
    - **Sintaxe:**
        
        ```tsx
        type HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<unknown>>;
        
        ```
        
- **`HttpRequest<T>` (Classe):**
    - **Propósito:** Representa uma requisição HTTP imutável de saída. Usada para ler e criar novas requisições com modificações (via `clone()`).
    - **Uso:** `req.clone({ setHeaders: { ... } })`, `req.url`, `req.method`.
    - **Sintaxe (Exemplo de propriedades):**
        
        ```tsx
        class HttpRequest<T> {
          readonly url: string;
          readonly method: string;
          readonly headers: HttpHeaders;
          // ...outras propriedades
          clone(update: HttpRequest<any>): HttpRequest<any>;
        }
        
        ```
        
- **`HttpHandler` (Classe - para interceptores de classe):**
    - **Propósito:** Interface para o próximo interceptor na cadeia ou para o backend HTTP.
    - **Uso:** `next.handle(request)` para passar a requisição adiante.
    - **Sintaxe:**
        
        ```tsx
        abstract class HttpHandler {
          abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
        }
        
        ```
        
- **`HttpHandlerFn` (Tipo de Função - para interceptores de função):**
    - **Propósito:** Função para passar a requisição para o próximo interceptor ou para o backend HTTP.
    - **Uso:** `next(request)` para passar a requisição adiante.
    - **Sintaxe:**
        
        ```tsx
        type HttpHandlerFn = (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>;
        
        ```
        
- **`HttpEvent<T>` (Type Union):**
    - **Propósito:** Representa os vários tipos de eventos que podem ocorrer durante o ciclo de vida de uma requisição HTTP.
    - **Uso:** Você pode usar operadores RxJS como `filter` para reagir a tipos específicos de eventos (`HttpResponse`, `HttpErrorResponse`, etc.).
    - **Sintaxe (Exemplo de alguns tipos):**
        
        ```tsx
        type HttpEvent<T> = HttpSentEvent | HttpHeaderResponse | HttpResponse<T> | HttpProgressEvent | HttpUserEvent<T>;
        
        ```
        
- **`HttpResponse<T>` (Classe):**
    - **Propósito:** Representa uma resposta HTTP bem-sucedida.
    - **Uso:** Contém o corpo da resposta (`body`), status (`status`), cabeçalhos (`headers`).
    - **Sintaxe (Exemplo de propriedades):**
        
        ```tsx
        class HttpResponse<T> extends HttpHeaderResponse {
          readonly body: T | null;
          // ...outras propriedades
        }
        
        ```
        
- **`HttpErrorResponse` (Classe):**
    - **Propósito:** Representa uma resposta de erro HTTP.
    - **Uso:** Contém o status do erro (`status`), a mensagem de erro (`message`), o objeto de erro original (`error`).
    - **Sintaxe (Exemplo de propriedades):**
        
        ```tsx
        class HttpErrorResponse extends HttpResponseBase {
          readonly error: any;
          readonly message: string;
          readonly status: number;
          // ...outras propriedades
        }
        
        ```
        
- **`HttpHeaders` (Classe):**
    - **Propósito:** Representa os cabeçalhos HTTP. É imutável, então você usa `set()`, `append()`, `delete()` para criar novas instâncias com modificações.
    - **Uso:** `new HttpHeaders().set('Content-Type', 'application/json')`.
- **`HttpParams` (Classe):**
    - **Propósito:** Representa os parâmetros de consulta URL. Imutável.
    - **Uso:** `new HttpParams().set('page', '1')`.

### Tokens de Injeção e Funções de Provisão

- **`HTTP_INTERCEPTORS` (InjectionToken):**
    - **Propósito:** É um `InjectionToken` usado para registrar interceptores baseados em classe ou função (em módulos tradicionais).
    - **Uso:** No array `providers` do `@NgModule`.
    - **Sintaxe:**
        
        ```tsx
        // Em app.module.ts
        providers: [
          { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
          // ou
          { provide: HTTP_INTERCEPTORS, useValue: authFnInterceptor, multi: true },
        ]
        
        ```
        
- **`provideHttpClient(withInterceptors([]))` (Função de Provisão - para standalone):**
    - **Propósito:** Função que configura o `HttpClient` para aplicações standalone, permitindo o registro de interceptores baseados em função.
    - **Uso:** No array `providers` de `ApplicationConfig` em `app.config.ts`.
    - **Sintaxe:**
        
        ```tsx
        // Em app.config.ts
        providers: [
          provideHttpClient(withInterceptors([authFnInterceptor, loggingInterceptor])),
        ]
        
        ```
        

---

## Melhores Práticas e Casos de Uso

Os interceptores são incrivelmente versáteis. Aqui estão alguns casos de uso comuns e as melhores práticas:

### Casos de Uso Comuns:

1. **Autenticação e Autorização:**
    - **Descrição:** Adicionar tokens de autenticação (JWT, OAuth) a todas as requisições de saída.
    - **Exemplo:**
        
        ```tsx
        // auth.interceptor.ts (baseado em função)
        import { HttpInterceptorFn } from '@angular/common/http';
        import { inject } from '@angular/core';
        import { AuthService } from '../services/auth.service'; // Exemplo de serviço de autenticação
        
        export const authInterceptor: HttpInterceptorFn = (req, next) => {
          const authService = inject(AuthService);
          const authToken = authService.getToken();
        
          if (authToken) {
            const cloned = req.clone({
              setHeaders: {
                Authorization: `Bearer ${authToken}`,
              },
            });
            return next(cloned);
          }
          return next(req);
        };
        
        ```
        
2. **Tratamento Global de Erros:**
    - **Descrição:** Centralizar o tratamento de erros HTTP (401 Unauthorized, 404 Not Found, 500 Internal Server Error) para exibir mensagens amigáveis ao usuário, redirecionar para páginas de erro ou fazer logout em caso de token expirado.
    - **Exemplo:**
        
        ```tsx
        // error.interceptor.ts
        import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
        import { catchError } from 'rxjs/operators';
        import { throwError } from 'rxjs';
        import { Router } from '@angular/router';
        import { inject } from '@angular/core';
        import { SnackBarService } from '../services/snack-bar.service'; // Serviço para exibir mensagens
        
        export const errorInterceptor: HttpInterceptorFn = (req, next) => {
          const router = inject(Router);
          const snackBarService = inject(SnackBarService);
        
          return next(req).pipe(
            catchError((error: HttpErrorResponse) => {
              let errorMessage = 'Um erro desconhecido ocorreu.';
              if (error.error instanceof ErrorEvent) {
                // Erro do lado do cliente ou rede
                errorMessage = `Erro: ${error.error.message}`;
              } else {
                // Erro do lado do servidor
                switch (error.status) {
                  case 401:
                    errorMessage = 'Não autorizado. Por favor, faça login novamente.';
                    router.navigate(['/login']);
                    break;
                  case 403:
                    errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
                    break;
                  case 404:
                    errorMessage = 'Recurso não encontrado.';
                    break;
                  case 500:
                    errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
                    break;
                  default:
                    errorMessage = `Erro HTTP: ${error.status} - ${error.message}`;
                }
              }
              snackBarService.openSnackBar(errorMessage, 'Fechar'); // Exibe a mensagem de erro
              return throwError(() => new Error(errorMessage)); // Propaga o erro
            })
          );
        };
        
        ```
        
3. **Logs de Requisições:**
    - **Descrição:** Registrar informações sobre todas as requisições e respostas (URL, status, tempo de resposta) para depuração ou auditoria.
    - **Exemplo:**
        
        ```tsx
        // logging.interceptor.ts
        import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
        import { finalize, tap } from 'rxjs/operators';
        
        export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
          const started = Date.now();
          let ok: string;
        
          // observe 'response' para ter acesso ao corpo da resposta
          return next(req).pipe(
            tap({
              next: (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
              error: (error) => (ok = 'failed'),
            }),
            finalize(() => {
              const elapsed = Date.now() - started;
              const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
              console.log(msg);
            })
          );
        };
        
        ```
        
4. **Adicionar um Loader (Spinner):**
    - **Descrição:** Mostrar um indicador de carregamento (spinner) sempre que houver uma requisição HTTP ativa e escondê-lo quando todas as requisições terminarem.
    - **Exemplo:** (Este exemplo geralmente envolve um `LoadingService` injetável)
        
        ```tsx
        // loading.interceptor.ts
        import { HttpInterceptorFn, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
        import { inject } from '@angular/core';
        import { LoadingService } from '../services/loading.service'; // Seu serviço de loading
        import { finalize } from 'rxjs/operators';
        
        export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
          const loadingService = inject(LoadingService);
        
          loadingService.show(); // Mostra o loader
        
          return next(req).pipe(
            finalize(() => {
              loadingService.hide(); // Esconde o loader quando a requisição termina (sucesso ou erro)
            })
          );
        };
        
        ```
        
5. **Cache de Requisições:**
    - **Descrição:** Armazenar respostas de requisições GET para evitar chamadas repetidas ao servidor para os mesmos dados.

### Melhores Práticas:

- **Princípio da Responsabilidade Única (SRP):** Cada interceptor deve ter uma única responsabilidade. Não misture autenticação com logs e tratamento de erros no mesmo interceptor. Crie interceptores separados para cada função.
- **Ordem Importa:** A ordem em que você registra seus interceptores no array `providers` (ou `withInterceptors`) é crucial. A requisição passa por eles na ordem de registro, e a resposta volta na ordem inversa.
    - **Exemplo de Ordem Lógica:**
        1. **AuthInterceptor:** Adiciona token (precisa ser o primeiro para que o token esteja presente antes de outros interceptores modificarem a requisição).
        2. **LoggingInterceptor:** Registra a requisição antes e depois de ser processada.
        3. **LoadingInterceptor:** Mostra/esconde o loader.
        4. **ErrorInterceptor:** Trata erros (idealmente depois que a requisição já foi para o servidor e pode retornar um erro).
- **Imutabilidade de `HttpRequest`:** Sempre `clone()` a requisição se precisar modificá-la. `HttpRequest` é imutável.
- **Tratamento de Erros no `Observable`:** Use operadores RxJS como `catchError` para tratar erros dentro do fluxo do `Observable` da resposta.
- **Propagação de Erros:** Se você trata um erro no interceptor mas não quer consumi-lo completamente, use `throwError(() => new Error(...))` do RxJS para propagá-lo para os assinantes subsequentes.
- **Evite Bloqueio Síncrono:** Interceptores devem ser assíncronos e não devem bloquear o thread principal. Todas as operações devem ser baseadas em Observables.
- **Injeção de Dependência:** Use `inject()` (para interceptores de função) ou o construtor (para interceptores de classe) para injetar serviços necessários.

---

## Exemplo Completo: Interceptor de Autenticação e Erro

Vamos combinar os conceitos em um exemplo mais abrangente, simulando uma aplicação standalone com dois interceptores: um para autenticação e outro para tratamento de erros.

```tsx
// app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { AuthService } from './services/auth.service'; // Serviço para simular autenticação
import { SnackBarService } from './services/snack-bar.service'; // Serviço para exibir mensagens

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor, // Primeiro, adiciona o token
        errorInterceptor, // Depois, trata os erros
      ])
    ),
    AuthService, // Prover serviços que os interceptores usam
    SnackBarService,
  ],
};

```

```tsx
// app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('authToken')
  );
  public token$: Observable<string | null> = this.tokenSubject.asObservable();

  constructor() {}

  login(username: string, password: string): void {
    // Simula uma chamada de API para login
    if (username === 'test' && password === '123') {
      const token = 'fake-jwt-token-12345';
      localStorage.setItem('authToken', token);
      this.tokenSubject.next(token);
      console.log('Login bem-sucedido!');
    } else {
      console.error('Credenciais inválidas.');
      this.tokenSubject.next(null);
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.tokenSubject.next(null);
    console.log('Logout realizado.');
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

```

```tsx
// app/services/snack-bar.service.ts
import { Injectable } from '@angular/core';
// Em um ambiente real, você usaria o MatSnackBar do Angular Material ou uma biblioteca similar.
// Para este exemplo, vamos apenas usar console.log
@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor() {}

  openSnackBar(message: string, action: string = 'Close'): void {
    console.log(`[SnackBar] ${message} - Action: ${action}`);
    // console.log para simular a exibição de uma mensagem na UI
    // Ex: this.snackBar.open(message, action, { duration: 3000 });
  }
}

```

```tsx
// app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  // Se houver um token, clona a requisição e adiciona o cabeçalho de Autorização
  if (authToken) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(clonedReq);
  }

  // Caso contrário, passa a requisição original
  return next(req);
};

```

```tsx
// app/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { SnackBarService } from '../services/snack-bar.service';
import { AuthService } from '../services/auth.service'; // Para logout em caso de 401

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBarService = inject(SnackBarService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Um erro inesperado ocorreu. Tente novamente.';

      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente (rede, etc.)
        errorMessage = `Erro de rede/cliente: ${error.error.message}`;
      } else {
        // Erro do lado do servidor (resposta HTTP)
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Requisição inválida.';
            break;
          case 401:
            errorMessage = 'Não autorizado. Sua sessão expirou ou você não tem permissão.';
            authService.logout(); // Força o logout
            router.navigate(['/login']); // Redireciona para o login
            break;
          case 403:
            errorMessage = 'Acesso proibido. Você não tem permissão para acessar este recurso.';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado.';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflito de dados.';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor. Estamos trabalhando para resolver isso.';
            break;
          default:
            errorMessage = `Erro ${error.status}: ${error.statusText || 'Erro desconhecido'}`;
        }
      }

      snackBarService.openSnackBar(errorMessage, 'OK'); // Exibe a mensagem de erro na UI (simulada)
      console.error('Erro HTTP Interceptado:', error); // Loga o erro completo no console
      return throwError(() => new Error(errorMessage)); // Propaga o erro para o componente/serviço chamador
    })
  );
};

```

```tsx
// app/app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h1>Exemplo de Interceptores</h1>
    <button (click)="login()" *ngIf="!(authService.isLoggedIn())">Login</button>
    <button (click)="logout()" *ngIf="authService.isLoggedIn()">Logout</button>
    <button (click)="getProtectedData()" *ngIf="authService.isLoggedIn()">
      Obter Dados Protegidos (200 OK)
    </button>
    <button (click)="getForbiddenData()" *ngIf="authService.isLoggedIn()">
      Obter Dados Proibidos (403 Forbidden)
    </button>
    <button (click)="getNotFoundData()">Obter Dados Inexistentes (404 Not Found)</button>
    <button (click)="getUnauthorizedData()">
      Obter Dados Sem Autorização (401 Unauthorized)
    </button>
    <button (click)="getServerError()">Simular Erro de Servidor (500)</button>

    <hr />
    <pre>{{ response | json }}</pre>
  `,
  styles: [
    `
      button {
        margin: 5px;
        padding: 10px 15px;
        font-size: 16px;
        cursor: pointer;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  httpClient = inject(HttpClient);
  authService = inject(AuthService);
  response: any;

  ngOnInit(): void {
    // Para fins de demonstração, loga o estado inicial do token
    this.authService.token$.subscribe((token) => {
      console.log('Token Atual:', token ? 'Presente' : 'Ausente');
    });
  }

  login(): void {
    this.authService.login('test', '123');
  }

  logout(): void {
    this.authService.logout();
    this.response = null;
  }

  getProtectedData(): void {
    this.httpClient
      .get('<https://jsonplaceholder.typicode.com/posts/1>') // Simula um endpoint protegido que retornaria 200
      .subscribe({
        next: (res) => {
          this.response = res;
          console.log('Dados Protegidos (200 OK):', res);
        },
        error: (err) => {
          this.response = err;
          console.error('Erro ao obter dados protegidos:', err);
        },
      });
  }

  getForbiddenData(): void {
    // Simula uma requisição que retornaria 403 Forbidden
    this.httpClient
      .get('<https://httpstat.us/403>')
      .subscribe({
        next: (res) => {
          this.response = res;
        },
        error: (err) => {
          this.response = err;
          console.error('Erro (403 Forbidden):', err);
        },
      });
  }

  getNotFoundData(): void {
    // Simula uma requisição que retornaria 404 Not Found
    this.httpClient
      .get('<https://jsonplaceholder.typicode.com/non-existent-endpoint>')
      .subscribe({
        next: (res) => {
          this.response = res;
        },
        error: (err) => {
          this.response = err;
          console.error('Erro (404 Not Found):', err);
        },
      });
  }

  getUnauthorizedData(): void {
    // Simula uma requisição que retornaria 401 Unauthorized
    // Note: O authInterceptor adiciona o token, então para simular 401,
    // vamos tentar uma URL que retorna 401 mesmo com um token "válido"
    // Ou, para testar o interceptor 401, você pode deslogar e tentar acessar um endpoint protegido.
    // Vamos usar um simulador de 401.
    this.httpClient
      .get('<https://httpstat.us/401>')
      .subscribe({
        next: (res) => {
          this.response = res;
        },
        error: (err) => {
          this.response = err;
          console.error('Erro (401 Unauthorized):', err);
        },
      });
  }

  getServerError(): void {
    // Simula uma requisição que retornaria 500 Internal Server Error
    this.httpClient
      .get('<https://httpstat.us/500>')
      .subscribe({
        next: (res) => {
          this.response = res;
        },
        error: (err) => {
          this.response = err;
          console.error('Erro (500 Internal Server Error):', err);
        },
      });
  }
}

```

Neste exemplo, você pode ver como o `authInterceptor` automaticamente adiciona um token após o login, e como o `errorInterceptor` captura e trata diferentes tipos de erros HTTP, exibindo mensagens e redirecionando para a tela de login em caso de 401.

---

## Tópicos Relacionados para Aprofundamento

Para continuar sua jornada de aprendizado sobre HTTP no Angular, sugiro os seguintes tópicos:

- **Manipulação de Respostas:** Explorar mais a fundo a manipulação de respostas para transformações de dados, validações e normalizações.
- **Tratamento de Headers Condicionais:** Criar interceptores que adicionam cabeçalhos apenas em certas condições (ex: para endpoints específicos).
- **Múltiplos Interceptores e Ordem de Execução:** Entender em detalhes como a ordem de registro afeta a cadeia de interceptores e como gerenciar dependências entre eles.
- **Testando Interceptores:** Melhores práticas e técnicas para escrever testes unitários para seus interceptores.
- **HttpClient com `reportProgress`:** Como interceptar e reagir a eventos de progresso de upload/download.
- **Uso de `Subject` e `BehaviorSubject` para Comunicação de Estado:** Como os serviços (como `AuthService` e `LoadingService` no nosso exemplo) usam Subjects para se comunicar com interceptores e outros componentes.

Espero que esta explicação detalhada ajude você a dominar os Interceptores HTTP no Angular, Gedê\! Se tiver mais alguma dúvida, é só perguntar\!