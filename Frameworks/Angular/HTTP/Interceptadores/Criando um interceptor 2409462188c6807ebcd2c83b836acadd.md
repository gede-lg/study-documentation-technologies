# Criando um interceptor

Claro, Gedê\! Entendi perfeitamente sua solicitação para uma explicação **extremamente detalhada** sobre a criação de Interceptores HTTP no contexto do Angular. A.R.I.A. vai te ajudar com isso.

---

# Interceptores HTTP no Angular: Manipulando Requisições e Respostas de Forma Centralizada

---

## Introdução

No desenvolvimento de aplicações web modernas, a comunicação com um backend é uma peça central. O Angular, sendo um framework robusto, oferece mecanismos poderosos para gerenciar essa comunicação. Um desses mecanismos, e talvez um dos mais flexíveis, são os **Interceptors HTTP**. Eles permitem que você intercepte requisições HTTP antes de serem enviadas ao servidor e respostas HTTP antes de serem recebidas pelo seu aplicativo, permitindo a modificação e o processamento centralizado.

---

## Sumário

Esta explicação detalhada cobrirá desde os conceitos fundamentais dos Interceptores HTTP no Angular até a implementação prática, abordando a sintaxe, os métodos e propriedades essenciais, as restrições de uso, elementos associados, melhores práticas e casos de uso, finalizando com um exemplo completo.

---

## Conceitos Fundamentais

### O que são Interceptores HTTP?

Os Interceptores HTTP são uma funcionalidade do módulo `@angular/common/http` que permite interceptar e manipular requisições e respostas HTTP de forma global em sua aplicação Angular. Pense neles como "ganchos" que se conectam ao pipeline de comunicação HTTP.

### Propósito

O principal propósito dos Interceptores é centralizar lógicas que seriam repetitivas em diversas chamadas HTTP. Por exemplo:

- **Adicionar cabeçalhos de autenticação:** Incluir tokens JWT (`Authorization`) em todas as requisições.
- **Log de requisições:** Registrar todas as requisições e respostas para depuração ou monitoramento.
- **Tratamento de erros:** Centralizar o tratamento de erros HTTP (ex: 401 Unauthorized, 404 Not Found).
- **Barra de carregamento:** Mostrar e esconder um spinner de carregamento para todas as requisições ativas.
- **Cache:** Implementar estratégias de cache para requisições específicas.
- **Transformação de dados:** Modificar o corpo da requisição ou da resposta.

### Como Funcionam?

Quando uma requisição HTTP é feita a partir de um serviço Angular (usando `HttpClient`), ela não vai diretamente para o servidor. Em vez disso, ela passa por uma cadeia de interceptores configurados. Cada interceptor pode:

1. **Inspecionar e modificar** a requisição de saída.
2. **Passar a requisição** para o próximo interceptor na cadeia ou para o `HttpClient` se for o último.
3. **Inspecionar e modificar** a resposta de entrada antes que ela chegue ao serviço que fez a requisição.

Se houver múltiplos interceptores, eles são executados na ordem em que são registrados. A resposta retorna na ordem inversa.

---

## Sintaxe e Uso

Para criar um interceptor, você precisa seguir dois passos principais:

1. **Implementar a interface `HttpInterceptor`**.
2. **Registrar o interceptor** no módulo de sua aplicação.

### 1\. Implementando `HttpInterceptor`

Um interceptor é uma classe TypeScript que implementa a interface `HttpInterceptor` e possui um único método, `intercept()`.

```tsx
// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders // Importe HttpHeaders para manipulação de cabeçalhos
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Exemplo de operador para demonstração

@Injectable() // Necessário para que o Angular possa injetar dependências no seu interceptor, se houver
export class AuthInterceptor implements HttpInterceptor {

  constructor(/* Se precisar injetar serviços, faça aqui, ex: private authService: AuthService */) {}

  /**
   * Intercepta uma requisição HTTP.
   * @param req A requisição HTTP de saída.
   * @param next O manipulador do próximo interceptor na cadeia ou do backend.
   * @returns Um Observable de HttpEvent<any> representando a resposta.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptando requisição:', req.url);

    // Exemplo: Adicionando um cabeçalho de autorização (muito comum)
    const token = 'meuTokenDeAutenticacaoSuperSecreto123'; // Simule a obtenção do token

    // Clone a requisição para modificar (requisições são imutáveis)
    let clonedReq = req;
    if (token) {
      clonedReq = req.clone({
        setHeaders: { // Use setHeaders para adicionar ou sobrescrever cabeçalhos
          Authorization: `Bearer ${token}`,
          'X-Custom-Header': 'ValorCustomizado' // Adicionando outro cabeçalho
        },
        // Também é possível modificar outros aspectos da requisição:
        // url: '<https://nova-api.com/api/>' + req.url, // Alterar a URL base
        // body: { ...req.body, newProperty: 'newValue' } // Modificar o corpo
      });
    }

    // Passa a requisição (clonada ou original) para o próximo manipulador na cadeia
    return next.handle(clonedReq).pipe(
      // Exemplo: Interceptando a resposta
      tap(
        event => {
          // 'event' pode ser HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent
          if (event instanceof HttpResponse) {
            console.log('Resposta recebida para:', event.url, event.status);
            // Você pode modificar o corpo da resposta aqui se necessário:
            // return event.clone({ body: this.transformResponse(event.body) });
          }
        },
        error => {
          console.error('Erro interceptado:', error.status, error.message);
          // Lógica para tratamento de erros global (ex: redirecionar para tela de login em 401)
          if (error.status === 401) {
            console.log('Usuário não autorizado, redirecionando...');
            // Ex: this.router.navigate(['/login']);
          }
        }
      )
    );
  }
}

```

### 2\. Registrando o Interceptor

Para que o Angular utilize seu interceptor, ele precisa ser registrado como um provedor em um módulo (geralmente no `AppModule`, para que seja global).

```tsx
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importe HttpClientModule e HTTP_INTERCEPTORS

import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth.interceptor'; // Importe seu interceptor

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule // Necessário para usar HttpClient e interceptors
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, // Token de injeção para interceptores
      useClass: AuthInterceptor, // A classe do seu interceptor
      multi: true // IMPORTANTE: Permite registrar múltiplos interceptores.
                  // Sem 'multi: true', apenas o último interceptor registrado seria usado.
    }
    // Você pode registrar outros interceptores aqui, eles serão executados na ordem de registro
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: LoadingInterceptor, // Exemplo de outro interceptor
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

---

## Métodos/Propriedades

A interface `HttpInterceptor` é bastante concisa, focando no método `intercept`. No entanto, os objetos com os quais ele interage (`HttpRequest` e `HttpHandler`) são ricos em métodos e propriedades.

### `HttpInterceptor` Interface

| Propriedade/Método | Tipo | Descrição |
| --- | --- | --- |
| `intercept` | `(req: HttpRequest<any>, next: HttpHandler) => Observable<HttpEvent<any>>` | O único método da interface. Ele é chamado para cada requisição HTTP. Recebe a requisição original e um manipulador para a próxima etapa na cadeia. Deve retornar um `Observable` da resposta. |

### `HttpRequest<any>` (Requisição de Saída)

Representa a requisição HTTP que está prestes a ser enviada. É **imutável**, o que significa que para modificá-la, você deve criar uma cópia (`clone()`).

| Propriedade/Método | Tipo | Descrição |
| --- | --- | --- |
| `url` | `string` | A URL completa da requisição. |
| `method` | `string` | O método HTTP da requisição (ex: 'GET', 'POST', 'PUT', 'DELETE'). |
| `headers` | `HttpHeaders` | Um objeto `HttpHeaders` contendo os cabeçalhos da requisição. Use `clone()` com `setHeaders` ou `appendHeaders` para modificá-los. |
| `body` | `any` | O corpo da requisição para métodos como POST, PUT, PATCH. Pode ser `null` para GET, DELETE. |
| `params` | `HttpParams` | Um objeto `HttpParams` contendo os parâmetros de consulta da URL. |
| `responseType` | `string` | O tipo de resposta esperado (ex: 'json', 'text', 'arraybuffer', 'blob'). Define como o Angular deve parsear a resposta. |
| `withCredentials` | `boolean` | Indica se credenciais (cookies, cabeçalhos de autorização) devem ser enviadas com a requisição cross-origin. |
| `reportProgress` | `boolean` | Se `true`, o Observable da resposta emitirá eventos de progresso de upload/download. |
| `clone(changes?: { ... })` | `HttpRequest<any>` | **Essencial para interceptores.** Retorna uma cópia modificada da requisição. Os `changes` são um objeto com propriedades que você deseja sobrescrever. Exemplos: `{ setHeaders: { ... } }`, `{ url: '...' }`, `{ body: { ... } }`. Permite criar uma nova requisição com base na original, alterando apenas o que é necessário. |
| `setHeaders` | `object` | (Usado dentro de `clone()`) Objeto onde as chaves são os nomes dos cabeçalhos e os valores são seus valores. Sobrescreve cabeçalhos existentes ou adiciona novos. Ex: `setHeaders: { 'Authorization': 'Bearer token' }`. |
| `appendHeaders` | `object` | (Usado dentro de `clone()`) Similar a `setHeaders`, mas adiciona novos valores a cabeçalhos existentes, em vez de sobrescrevê-los. Útil para cabeçalhos que podem ter múltiplos valores. Ex: `appendHeaders: { 'X-Forwarded-For': '192.168.1.1' }`. |
| `setParams` | `object` | (Usado dentro de `clone()`) Objeto onde as chaves são os nomes dos parâmetros e os valores são seus valores. Sobrescreve parâmetros existentes ou adiciona novos. Ex: `setParams: { 'page': '2' }`. |
| `appendParams` | `object` | (Usado dentro de `clone()`) Similar a `setParams`, mas adiciona novos valores a parâmetros existentes. |

### `HttpHandler`

O `HttpHandler` é o responsável por despachar a requisição para o próximo manipulador na cadeia de interceptores, ou para o `HttpClient` se não houver mais interceptores.

| Propriedade/Método | Tipo | Descrição |
| --- | --- | --- |
| `handle(req: HttpRequest<any>)` | `Observable<HttpEvent<any>>` | Este método envia a requisição (que pode ter sido modificada) para o próximo interceptor na cadeia ou para o backend. Ele retorna um `Observable` que emitirá os eventos da resposta. |

### `HttpEvent<any>` (Eventos da Resposta)

O `Observable` retornado por `next.handle()` pode emitir vários tipos de eventos durante o ciclo de vida da requisição/resposta. É importante usar `instanceof` para verificar o tipo de evento.

| Evento de Resposta | Descrição |
| --- | --- |
| `HttpSentEvent` | Emitido quando a requisição é enviada com sucesso. |
| `HttpHeaderResponse` | Emitido quando apenas os cabeçalhos da resposta são recebidos. O corpo da resposta ainda não chegou. |
| `HttpProgressEvent` | Emitido para eventos de progresso de upload ou download. Contém informações sobre bytes carregados e total. |
| `HttpResponse<T>` | O evento final e mais comum, contendo a resposta HTTP completa, incluindo status, cabeçalhos e o corpo da resposta. `T` é o tipo do corpo da resposta. |
| `HttpUserEvent<T>` | Um tipo de evento personalizado que pode ser usado para comunicação entre interceptores ou entre o interceptor e o serviço de chamada, embora seja menos comum. |

---

## Restrições de Uso

Embora poderosos, os interceptores não são a solução para todos os problemas.

- **Não para lógica de negócios específica:** Interceptores são para lógica *transversal* (aplicada a todas ou muitas requisições/respostas). Lógica de negócios específica que depende do contexto da requisição deve permanecer nos serviços ou componentes que a originam.
- **Não para manipulação complexa de fluxo:** Fluxos complexos que envolvem múltiplas chamadas encadeadas ou condicionalidades intrincadas são melhor gerenciados com o uso de `RxJS` diretamente nos serviços, não nos interceptores.
- **Imutabilidade da Requisição:** Lembre-se sempre que `HttpRequest` é imutável. Tentar modificar suas propriedades diretamente resultará em erros ou comportamento inesperado. Use `req.clone()` para qualquer modificação.
- **Impacto Global:** Qualquer lógica dentro de um interceptor afeta *todas* as requisições HTTP feitas através do `HttpClient` (a menos que você adicione lógica condicional dentro do interceptor para ignorar certas URLs, por exemplo). Isso pode ser uma desvantagem se você precisar de um comportamento HTTP muito específico e isolado para apenas uma ou duas chamadas.

---

## Elementos Associados

Para trabalhar com interceptores, você precisará dos seguintes elementos principais:

### 1\. `HttpClientModule`

- **Propósito:** Fornece o `HttpClient` e os mecanismos necessários para a funcionalidade de interceptores.
- **Uso e Sintaxe:** Deve ser importado no seu `AppModule` (ou em um módulo de recursos se você estiver lazy loading) para que o `HttpClient` e, consequentemente, os interceptores funcionem.
    
    ```tsx
    import { HttpClientModule } from '@angular/common/http';
    
    @NgModule({
      imports: [
        HttpClientModule // Importar aqui
      ]
    })
    export class AppModule { }
    
    ```
    

### 2\. `HTTP_INTERCEPTORS` (Injection Token)

- **Propósito:** Este é um `InjectionToken` especial fornecido pelo Angular que informa ao sistema de injeção de dependência onde procurar os interceptores.
- **Uso e Sintaxe:** Utilizado no array `providers` de um `NgModule` para registrar seus interceptores.
    
    ```tsx
    import { HTTP_INTERCEPTORS } from '@angular/common/http';
    import { AuthInterceptor } from './auth.interceptor';
    
    @NgModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS, // O token
          useClass: AuthInterceptor,  // A classe do interceptor
          multi: true                 // ESSENCIAL para permitir múltiplos interceptores
        }
      ]
    })
    export class AppModule { }
    
    ```
    

### 3\. `HttpRequest` (Classe)

- **Propósito:** Representa a requisição HTTP de saída. Permite acessar e manipular detalhes da requisição antes de ser enviada.
- **Uso e Sintaxe:** No método `intercept(req: HttpRequest<any>, ...)`, `req` é uma instância desta classe. Para modificar, use `req.clone({...})`.
    
    ```tsx
    import { HttpRequest } from '@angular/common/http';
    // ...
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const newReq = req.clone({
        setHeaders: { 'Custom-Header': 'Value' }
      });
      return next.handle(newReq);
    }
    
    ```
    

### 4\. `HttpHandler` (Classe)

- **Propósito:** Representa o próximo manipulador na cadeia de interceptores ou o `HttpClient` em si. É o que permite que a requisição continue seu caminho.
- **Uso e Sintaxe:** No método `intercept(..., next: HttpHandler)`, `next` é uma instância desta classe. Chame `next.handle(requisição)` para prosseguir.
    
    ```tsx
    import { HttpHandler } from '@angular/common/http';
    // ...
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Lógica antes de enviar
      return next.handle(req); // Envia a requisição
      // Lógica depois de receber a resposta (usando operadores RxJS no Observable retornado)
    }
    
    ```
    

### 5\. `Observable<HttpEvent<any>>` (Tipo de Retorno)

- **Propósito:** O método `intercept` deve retornar um `Observable` que emite eventos do tipo `HttpEvent`. Isso permite que você lide com a resposta de forma assíncrona e reaja a diferentes fases do ciclo de vida da requisição/resposta (envio, progresso, cabeçalhos, corpo final).
- **Uso e Sintaxe:** Você frequentemente usará operadores RxJS como `pipe()`, `tap()`, `catchError()` para manipular o Observable da resposta.
    
    ```tsx
    import { Observable, throwError } from 'rxjs';
    import { HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
    import { tap, catchError } from 'rxjs/operators';
    // ...
    return next.handle(clonedReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('Resposta completa:', event.body);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro no interceptor:', error);
        return throwError(() => error); // Re-lança o erro para ser tratado por quem chamou
      })
    );
    
    ```
    

---

## Melhores Práticas e Casos de Uso

### Melhores Práticas

1. **Imutabilidade:** Sempre clone a requisição (`req.clone()`) antes de modificá-la. `HttpRequest` é imutável.
2. **Modularização:** Para aplicações maiores, considere criar um `CoreModule` ou `SharedModule` para provedores globais, incluindo interceptores.
3. **Ordem de Registro:** A ordem em que você registra os interceptores importa. A requisição passa por eles na ordem de registro, e a resposta retorna na ordem inversa. Planeje cuidadosamente.
4. **Tratamento de Erros:** Use `catchError` do RxJS no pipeline do `Observable` retornado por `next.handle()` para tratar erros globais. Lembre-se de re-lançar o erro (`return throwError(() => error);`) para que ele continue sendo propagado e possa ser tratado nos serviços ou componentes que originaram a requisição.
5. **Re-lançamento de Erros:** Se um interceptor lida com um erro, ele deve re-lançar o erro (usando `throwError`) se outros manipuladores ou o código de chamada precisarem estar cientes do erro. Caso contrário, o erro pode ser "consumido" e o `Observable` parecerá ter sido concluído com sucesso.
6. **Gerenciamento de Estado:** Para lógica que depende do estado (ex: token de autenticação), injete um serviço que gerencia esse estado no seu interceptor.
7. **Sinalização de Carregamento:** Para mostrar um indicador de carregamento, você pode manter um contador de requisições ativas. Incrementa no início de `intercept` e decrementa em `finalize` (RxJS operator) para garantir que seja sempre decrementado, mesmo em caso de erro.

### Casos de Uso Comuns

- **Autenticação (Token JWT):** Adicionar um token de autorização (`Bearer Token`) a todas as requisições de saída.
- **Tratamento Global de Erros:** Capturar e exibir mensagens de erro amigáveis para o usuário para determinados códigos de status HTTP (ex: 401 para não autorizado, 404 para recurso não encontrado, 500 para erro interno do servidor).
- **Cache de Requisições:** Interceptar requisições `GET` e armazenar suas respostas em um cache, servindo do cache para requisições subsequentes para a mesma URL, reduzindo a carga no servidor.
- **Logs e Monitoramento:** Registrar detalhes de todas as requisições e respostas para fins de depuração ou auditoria.
- **Manipulação de URL:** Adicionar uma base de URL padrão (`environment.apiUrl`) ou transformar URLs para roteamento específico.
- **Spinner de Carregamento Global:** Mostrar um indicador de carregamento quando qualquer requisição HTTP estiver ativa e escondê-lo quando todas as requisições forem concluídas.
- **Transformação de Dados:** Serializar ou desserializar dados de forma diferente do padrão JSON, ou modificar o formato de dados antes de enviar/depois de receber.

---

## Exemplo Completo: Interceptor de Autenticação e Erro Global

Este exemplo combina um interceptor de autenticação com tratamento global de erros, além de um spinner de carregamento básico.

### 1\. `auth-error.interceptor.ts`

```tsx
// auth-error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Simule um serviço de autenticação
import { LoadingService } from './loading.service'; // Simule um serviço de carregamento
import { Router } from '@angular/router'; // Para redirecionar em caso de 401

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.show(); // Mostra o spinner de carregamento

    let authReq = req;
    const authToken = this.authService.getToken(); // Obtém o token do serviço

    // Adiciona o token de autorização se existir
    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    // Passa a requisição modificada para o próximo manipulador
    return next.handle(authReq).pipe(
      tap(event => {
        // Lógica para respostas de sucesso
        if (event instanceof HttpResponse) {
          console.log('Requisição concluída com sucesso:', event.url, event.status);
          // Opcional: Processar corpo da resposta aqui
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Lógica para tratamento de erros
        console.error('Erro interceptado na requisição:', error.url, 'Status:', error.status);

        if (error.status === 401) {
          // Ex: Token expirado ou inválido. Redirecionar para login.
          console.log('401 Unauthorized: Token expirado ou inválido. Redirecionando...');
          this.authService.logout(); // Limpa o token localmente
          this.router.navigate(['/login']); // Redireciona para a página de login
        } else if (error.status === 404) {
          console.warn('404 Not Found: Recurso não encontrado.');
          // Ex: Exibir uma mensagem genérica de erro para o usuário
          // this.notificationService.showError('Recurso não encontrado.');
        } else if (error.status >= 500) {
          console.error('Erro interno do servidor:', error.message);
          // Ex: Logar o erro em um serviço de log de erros (Sentry, New Relic)
          // this.errorReportingService.report(error);
          // this.notificationService.showError('Ocorreu um erro no servidor. Tente novamente mais tarde.');
        }
        // Re-lança o erro para que o componente/serviço que chamou ainda possa tratá-lo
        return throwError(() => error);
      }),
      finalize(() => {
        // Este bloco é executado independentemente de sucesso ou erro
        this.loadingService.hide(); // Esconde o spinner de carregamento
      })
    );
  }
}

```

### 2\. `auth.service.ts` (Simulação)

```tsx
// auth.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor() {
    // Simula a obtenção de um token do localStorage
    this.token = localStorage.getItem('app_token');
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('app_token', token);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('app_token');
    console.log('Usuário deslogado. Token removido.');
  }

  // Simulação de login
  login(username: string, password: string): Observable<boolean> {
    if (username === 'teste' && password === '123') {
      this.setToken('fake-jwt-token-12345');
      return of(true);
    }
    return of(false);
  }
}

```

### 3\. `loading.service.ts` (Simulação)

```tsx
// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() { }

  show(): void {
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }
}

```

### 4\. `app.module.ts`

```tsx
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthErrorInterceptor } from './auth-error.interceptor'; // Importe o interceptor
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common'; // Para usar ngIf com o spinner
import { RouterModule, Routes } from '@angular/router'; // Para simular roteamento
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';

// Simulação de componentes para o roteamento
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms'; // Para usar ngModel

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes) // Configura o roteamento
  ],
  providers: [
    AuthService,
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthErrorInterceptor, // Registra o interceptor
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### 5\. `app.component.ts` (Exemplo de uso e spinner)

```tsx
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="loading$ | async" class="loading-spinner">
      Carregando...
    </div>
    <nav>
      <a routerLink="/dashboard">Dashboard</a> |
      <a routerLink="/login">Login</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .loading-spinner {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2em;
      z-index: 9999;
    }
  `]
})
export class AppComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$;
  }
}

```

### 6\. `dashboard/dashboard.component.ts` (Exemplo de chamada HTTP)

```tsx
// dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <h2>Dashboard</h2>
    <p>Seja bem-vindo!</p>
    <button (click)="makeApiCall()">Fazer Chamada API (com token)</button>
    <button (click)="makeUnauthorizedCall()">Fazer Chamada Unauthorized (401)</button>
    <button (click)="makeNotFoundCall()">Fazer Chamada Não Encontrada (404)</button>
    <pre>{{ apiResponse | json }}</pre>
  `
})
export class DashboardComponent implements OnInit {
  apiResponse: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    // Para testar o interceptor de auth, garanta que há um token
    if (!this.authService.getToken()) {
      this.authService.setToken('initial-valid-token-for-testing');
    }
  }

  makeApiCall(): void {
    // Esta chamada passará pelo interceptor e terá o token adicionado
    this.http.get('<https://jsonplaceholder.typicode.com/posts/1>')
      .subscribe(
        data => this.apiResponse = data,
        error => this.apiResponse = error // O erro será re-lançado pelo interceptor e chegará aqui
      );
  }

  makeUnauthorizedCall(): void {
    // Simula uma chamada que retornaria 401
    // Apenas para demonstração, use um endpoint real que retorne 401 se disponível
    this.http.get('<https://httpstat.us/401>')
      .subscribe(
        data => this.apiResponse = data,
        error => this.apiResponse = error
      );
  }

  makeNotFoundCall(): void {
    // Simula uma chamada que retornaria 404
    this.http.get('<https://jsonplaceholder.typicode.com/non-existent-path>')
      .subscribe(
        data => this.apiResponse = data,
        error => this.apiResponse = error
      );
  }
}

```

### 7\. `login/login.component.ts` (Exemplo de login)

```tsx
// login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="onLogin()">
      <div>
        <label for="username">Usuário:</label>
        <input id="username" type="text" [(ngModel)]="username" name="username" required>
      </div>
      <div>
        <label for="password">Senha:</label>
        <input id="password" type="password" [(ngModel)]="password" name="password" required>
      </div>
      <button type="submit">Entrar</button>
      <p *ngIf="loginFailed" style="color: red;">Usuário ou senha inválidos.</p>
    </form>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  loginFailed = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(success => {
      if (success) {
        this.loginFailed = false;
        this.router.navigate(['/dashboard']);
      } else {
        this.loginFailed = true;
      }
    });
  }
}

```

---

## Tópicos Relacionados para Aprofundamento

Para aprofundar ainda mais seu conhecimento sobre Interceptores HTTP e áreas relacionadas no Angular, sugiro os seguintes tópicos:

- **Manipulação de Erros com RxJS:** Explorar operadores como `retry`, `retryWhen`, `delay`, `timeout` para estratégias mais avançadas de tratamento de erros e resiliência.
- **Encadeamento de Interceptores:** Entender como a ordem de registro afeta a execução e a importância do `multi: true`.
- **Testando Interceptores:** Como escrever testes unitários para interceptores usando `HttpClientTestingModule`.
- **Server-Side Rendering (SSR) e Interceptores:** Considerações ao usar interceptores em aplicações Angular com SSR.
- **Gerenciamento de Estado Global:** Abordagens para gerenciar estados como token de autenticação ou estado de carregamento global (NGRX, NGXS, Akita, ou serviços simples com RxJS BehaviorSubject).
- **CORS (Cross-Origin Resource Sharing):** Como os interceptores podem ser usados, em casos específicos, para adicionar cabeçalhos CORS (embora geralmente seja configurado no servidor).

Espero que esta explicação tenha sido clara e completa, Gedê\! Se tiver mais alguma dúvida, A.R.I.A. está à disposição.