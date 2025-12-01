# Tratamento de Erros

Com certeza, Gedê\! A.R.I.A está aqui para te ajudar com uma explicação detalhada sobre **Tratamento de Erros em Requisições HTTP no Angular**.

---

## Tratamento Robusto de Erros em Requisições HTTP no Angular

### Introdução

Em qualquer aplicação web moderna, a comunicação com o backend é uma peça fundamental. No entanto, essa comunicação nem sempre ocorre sem falhas. Erros podem surgir por uma variedade de razões, desde problemas de rede e servidores indisponíveis até dados inválidos ou questões de autenticação. Ignorar esses erros não é uma opção; pelo contrário, um tratamento de erros eficaz é crucial para garantir a **resiliência**, a **usabilidade** e a **estabilidade** da sua aplicação.

No contexto do Angular, que utiliza **Observables** e o módulo `HttpClient` para lidar com requisições HTTP, o tratamento de erros se torna uma parte integrante do fluxo de dados. Este guia detalhado explorará as melhores práticas e as ferramentas que o Angular oferece para gerenciar e responder a erros de forma elegante e centralizada.

### Sumário

Esta explicação abordará os conceitos fundamentais do tratamento de erros em requisições HTTP no Angular, focando na utilização do `HttpErrorResponse` para inspecionar detalhes dos erros e na implementação de `HttpInterceptor` para um tratamento global e centralizado. Serão explorados os tipos de erros mais comuns, a sintaxe de uso, as propriedades e métodos relevantes, as restrições e as melhores práticas, incluindo exemplos práticos e um exemplo completo para ilustrar a aplicação em um cenário real.

---

### Conceitos Fundamentais

O tratamento de erros em requisições HTTP no Angular gira em torno da ideia de **interceptar** e **reagir** a falhas na comunicação entre o frontend e o backend.

1. **Observables e `catchError`:**
O `HttpClient` do Angular retorna **Observables**. Quando ocorre um erro em um Observable, ele emite uma notificação de erro e completa. Para "capturar" esse erro e evitar que ele "quebre" a aplicação ou o fluxo do Observable, utilizamos o operador `catchError` do RxJS. Este operador permite que você intercepte o erro, execute alguma lógica (como logar o erro, exibir uma mensagem ao usuário) e, opcionalmente, retorne um novo Observable (para continuar o fluxo) ou lance um novo erro.
2. **Tipos de Erros HTTP:**
    - **Erros do Lado do Cliente/Rede (`ErrorEvent`):** São erros que ocorrem antes mesmo da requisição chegar ao servidor, ou que acontecem na resposta antes que ela seja completamente recebida. Isso inclui problemas de rede (usuário offline, DNS não encontrado), erros CORS, ou até mesmo erros de execução no JavaScript dentro do manipulador da resposta. Nesses casos, a propriedade `error` do `HttpErrorResponse` será uma instância de `ErrorEvent`.
    - **Erros do Lado do Servidor (Status HTTP 4xx, 5xx):** Estes são os erros mais comuns e indicam que a requisição chegou ao servidor, mas algo deu errado no processamento.
        - **4xx (Erros do Cliente):** Indicam que o cliente (sua aplicação Angular) enviou uma requisição inválida. Exemplos: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`.
        - **5xx (Erros do Servidor):** Indicam que o servidor encontrou um erro ao tentar processar uma requisição válida. Exemplos: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`.

---

### Sintaxe e Uso: `HttpErrorResponse` e `catchError`

A forma mais comum de tratar erros em requisições HTTP individuais é usando o operador `catchError` do RxJS em conjunto com o `HttpErrorResponse`.

```tsx
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = '<https://api.example.com/data>';

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // A função `catchError` recebe o HttpErrorResponse como argumento.

          if (error.error instanceof ErrorEvent) {
            // Este bloco trata erros do lado do cliente ou de rede.
            // `error.error` é um `ErrorEvent` que contém o erro real.
            console.error('Um erro de cliente/rede ocorreu:', error.error.message);
            // Poderíamos exibir uma notificação genérica para o usuário aqui
            // Ex: this.notificationService.showError('Não foi possível conectar. Verifique sua internet.');
          } else {
            // Este bloco trata erros do lado do servidor (status HTTP 4xx ou 5xx).
            // `error.status` é o código de status HTTP.
            // `error.error` pode ser um objeto JSON retornado pelo backend com detalhes.
            console.error(
              `Backend retornou código ${error.status}, ` +
              `body era: ${JSON.stringify(error.error)}`
            );
            // Dependendo do status, podemos tomar ações específicas.
            // Ex: if (error.status === 401) { this.authService.logout(); }
          }

          // É importante retornar um Observable que emita um erro para que
          // o consumidor do Observable (componente, outro serviço) saiba
          // que a operação falhou e possa reagir.
          // `throwError` é uma função de criação de Observable que emite um erro.
          return throwError(() => new Error('Algo deu errado na requisição. Por favor, tente novamente mais tarde.'));
        })
      );
  }
}

```

---

### Métodos/Propriedades de `HttpErrorResponse`

A classe `HttpErrorResponse` é fundamental para inspecionar os detalhes de um erro HTTP. Ela estende `HttpResponseBase` e contém informações específicas sobre a falha.

| Propriedade/Método | Tipo                                 | Descrição

```tsx
import { HttpErrorResponse } from '@angular/common/http';
catchError((error: HttpErrorResponse) => {
  if (error.error instanceof ErrorEvent) {
    // Erro do lado do cliente ou de rede
    console.error('Um erro de cliente/rede ocorreu:', error.error.message);
  } else {
    // O backend retornou um código de resposta de erro.
    console.error(`Backend retornou código ${error.status}, body era: ${error.error}`);
  }
  return throwError(() => new Error('Erro na requisição; por favor, tente novamente mais tarde.'));
});

```

---

### Global Error Handling: Usando `HttpInterceptor`

Para um tratamento de erros mais robusto e centralizado, o Angular oferece os **`HttpInterceptor`s**. Um interceptor é uma classe que implementa a interface `HttpInterceptor` e pode "interceptar" requisições HTTP de saída e respostas HTTP de entrada. Isso significa que você pode adicionar lógica antes que uma requisição seja enviada e depois que uma resposta (ou erro) seja recebida, sem a necessidade de replicar o código em cada serviço ou componente que faz uma requisição.

### Por que usar Interceptors para Tratamento de Erros?

- **Centralização:** Todo o tratamento de erros é feito em um único local, evitando duplicação de código.
- **Consistência:** Garante que todos os erros sejam tratados da mesma maneira em toda a aplicação.
- **Desacoplamento:** Separa a lógica de tratamento de erros da lógica de negócios dos seus serviços.
- **Melhoria da Experiência do Usuário:** Permite exibir mensagens de erro padronizadas ou redirecionar o usuário em casos específicos (e.g., sessão expirada).

---

### Sintaxe e Uso: `HttpInterceptor`

Para criar um `HttpInterceptor` para tratamento de erros, você precisa:

1. **Criar a classe do Interceptor:**
Implemente a interface `HttpInterceptor` e o método `intercept()`.
    
    ```tsx
    // src/app/interceptors/error.interceptor.ts
    import { Injectable } from '@angular/core';
    import {
      HttpRequest,
      HttpHandler,
      HttpEvent,
      HttpInterceptor,
      HttpErrorResponse
    } from '@angular/common/http';
    import { Observable, throwError } from 'rxjs';
    import { catchError } from 'rxjs/operators';
    import { Router } from '@angular/router'; // Exemplo para redirecionamento
    import { NotificationService } from '../services/notification.service'; // Exemplo para notificações
    
    @Injectable()
    export class ErrorInterceptor implements HttpInterceptor {
    
      constructor(
        private router: Router, // Injetar dependências necessárias
        private notificationService: NotificationService
      ) {}
    
      intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Um erro desconhecido ocorreu.';
    
            if (error.error instanceof ErrorEvent) {
              // Erro do lado do cliente ou de rede
              errorMessage = `Erro de rede/cliente: ${error.error.message}`;
              console.error(errorMessage);
              this.notificationService.showError('Problema de conexão. Verifique sua internet.');
            } else {
              // Erro do lado do servidor (status HTTP)
              switch (error.status) {
                case 400: // Bad Request
                  errorMessage = `Requisição inválida: ${error.error?.message || error.statusText}`;
                  console.error(errorMessage, error.error);
                  this.notificationService.showError(errorMessage);
                  break;
                case 401: // Unauthorized
                  errorMessage = 'Não autorizado. Por favor, faça login novamente.';
                  console.error(errorMessage);
                  this.notificationService.showWarning(errorMessage);
                  this.router.navigate(['/login']); // Redirecionar para login
                  break;
                case 403: // Forbidden
                  errorMessage = 'Acesso negado. Você não tem permissão para realizar esta ação.';
                  console.error(errorMessage);
                  this.notificationService.showError(errorMessage);
                  this.router.navigate(['/access-denied']); // Redirecionar para página de acesso negado
                  break;
                case 404: // Not Found
                  errorMessage = `Recurso não encontrado: ${request.url}`;
                  console.error(errorMessage);
                  this.notificationService.showWarning('O recurso solicitado não foi encontrado.');
                  break;
                case 500: // Internal Server Error
                  errorMessage = `Erro interno do servidor: ${error.error?.message || error.statusText}`;
                  console.error(errorMessage, error.error);
                  this.notificationService.showError('Ocorreu um erro interno no servidor. Tente novamente mais tarde.');
                  break;
                case 0: // Por exemplo, erro CORS ou servidor não respondeu (antes de um status HTTP)
                  errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.';
                  console.error(errorMessage);
                  this.notificationService.showError(errorMessage);
                  break;
                default:
                  errorMessage = `Erro do servidor (${error.status}): ${error.error?.message || error.statusText}`;
                  console.error(errorMessage, error.error);
                  this.notificationService.showError(`Erro desconhecido: ${errorMessage}`);
                  break;
              }
            }
            // Sempre relance o erro para que os Observables que chamaram
            // a requisição ainda possam tratar o erro se precisarem de lógica específica.
            return throwError(() => new Error(errorMessage));
          })
        );
      }
    }
    
    ```
    
2. **Registrar o Interceptor:**
Você precisa registrar seu interceptor no `AppModule` ou em qualquer módulo onde ele será usado. Interceptors são fornecidos como multi-provedores, o que significa que você pode ter vários interceptores na sua aplicação.
    
    ```tsx
    // src/app/app.module.ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importante!
    
    import { AppComponent } from './app.component';
    import { ErrorInterceptor } from './interceptors/error.interceptor';
    import { AppRoutingModule } from './app-routing.module';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
    import { MatSnackBarModule } from '@angular/material/snack-bar'; // Exemplo de módulo para notificações
    
    // Exemplo de serviço de notificação simples
    import { NotificationService } from './services/notification.service';
    
    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule, // Essencial para Http Interceptors
        BrowserAnimationsModule,
        MatSnackBarModule // Necessário se usar MatSnackBar para notificações
      ],
      providers: [
        NotificationService, // O serviço de notificação deve ser fornecido
        {
          provide: HTTP_INTERCEPTORS, // Token de injeção para interceptores
          useClass: ErrorInterceptor, // Sua classe de interceptor
          multi: true // Permite que múltiplos interceptores sejam registrados
        }
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    
    ```
    
    **Explicação do `providers` no `AppModule`:**
    
    - `provide: HTTP_INTERCEPTORS`: É um **Injection Token** que o Angular usa para registrar e acessar todos os interceptores HTTP.
    - `useClass: ErrorInterceptor`: Especifica a classe que será usada como o interceptor.
    - `multi: true`: **Crucial**. Indica que este provedor é parte de uma coleção de provedores (no caso, uma coleção de interceptores). Se `multi` fosse `false` (padrão), apenas um interceptor poderia ser registrado, e o último a ser registrado sobrescreveria os anteriores. Com `multi: true`, você pode registrar vários interceptores, e eles serão executados em cadeia na ordem em que são fornecidos.

---

### Restrições de Uso

Embora o tratamento de erros global com `HttpInterceptor` seja altamente recomendado, existem cenários onde você pode querer um tratamento de erro mais específico:

- **Lógica de Re-tentativa (Retry Logic):** Se uma requisição específica pode se beneficiar de ser re-tentada (por exemplo, em caso de erro de rede intermitente ou status `503 Service Unavailable`), essa lógica geralmente é melhor aplicada diretamente no serviço que faz a requisição, usando operadores RxJS como `retry()` ou `retryWhen()`. Fazer isso globalmente no interceptor pode não ser ideal, pois nem todas as requisições se beneficiam de re-tentativas, e pode levar a ciclos infinitos.
    
    ```tsx
    // Exemplo de retry no serviço
    import { retry } from 'rxjs/operators';
    
    // ... dentro do serviço
    getDataWithRetry(): Observable<any> {
      return this.http.get<any>(this.apiUrl)
        .pipe(
          retry(3), // Tenta a requisição até 3 vezes em caso de erro
          catchError((error: HttpErrorResponse) => {
            // ... tratamento do erro final após as tentativas
            return throwError(() => new Error('Falha após múltiplas tentativas.'));
          })
        );
    }
    
    ```
    
- **Erros Específicos de Negócio que Requerem Respostas Únicas:** Se um erro do backend (e.g., um `422 Unprocessable Entity` com um payload de validação específico) precisa de uma manipulação particular no componente que originou a requisição (como exibir mensagens de validação ao lado de campos do formulário), o interceptor pode apenas fazer o log ou exibir uma notificação genérica, mas a lógica detalhada de processamento do payload de erro deve ser feita no consumidor do Observable. Nesses casos, o interceptor relança o erro, permitindo que o serviço ou componente capture-o e processe os detalhes específicos.

---

### Elementos Associados

Para um tratamento de erros eficaz no Angular, vários elementos são cruciais:

- **`@angular/common/http`:**
    - **`HttpClient`:** O serviço principal para fazer requisições HTTP.
    - **`HttpErrorResponse`:** Classe que encapsula os detalhes de um erro HTTP.
    - **`HttpInterceptor` (Interface):** Interface que seus interceptors devem implementar. Define o método `intercept()`.
    - **`HttpRequest`:** Objeto que representa a requisição HTTP de saída.
    - **`HttpHandler`:** Representa o próximo manipulador na cadeia de interceptores.
    - **`HTTP_INTERCEPTORS` (Injection Token):** Token usado para fornecer interceptores ao sistema de injeção de dependência do Angular.
- **RxJS:**
    - **`Observable`:** A base de todas as operações assíncronas no Angular. O `HttpClient` retorna Observables.
    - **`throwError` (Função de Criação de Observable):** Usado para criar um Observable que imediatamente emite uma notificação de erro. É comumente usado dentro do `catchError` para propagar o erro.
    - **`catchError` (Operador RxJS):** Operador que intercepta erros em um Observable, permitindo que você lide com eles e retorne um novo Observable ou relance o erro.
    - **`pipe` (Método de Observable):** Usado para encadear operadores RxJS em um Observable.
- **`ErrorEvent`:**
Uma interface nativa do JavaScript que representa um evento de erro. Como mencionado, `HttpErrorResponse.error` será uma instância de `ErrorEvent` em casos de erros de cliente/rede. Você pode acessar propriedades como `message` e `filename` do `ErrorEvent`.

---

### Melhores Práticas e Casos de Uso

- **Sempre use `HttpInterceptor` para Tratamento Global:** Esta é a pedra angular de um tratamento de erros consistente. Logar erros, exibir notificações genéricas, e tratar casos de autenticação expirada devem ser feitos aqui.
- **Distinguir Erros de Cliente/Rede de Erros de Servidor:** Como demonstrado, `if (error.error instanceof ErrorEvent)` é essencial para diferenciar esses tipos de erros e apresentar mensagens mais precisas ao usuário.
- **Seja Específico com Mensagens para o Usuário:** Evite mensagens genéricas como "Ocorreu um erro". Tente traduzir o erro técnico em algo que o usuário possa entender e, se possível, indicar uma ação. Por exemplo, em vez de "Erro 401", diga "Sua sessão expirou. Por favor, faça login novamente."
- **Logar Detalhes Completos do Erro no Console/Serviço de Log:** Para depuração, é crucial logar o máximo de detalhes possível sobre o erro (status, URL, payload da resposta do erro, stack trace) no console do navegador e, idealmente, enviá-los para um serviço de log externo (ex: Sentry, ELK Stack) em produção.
- **Manipulação de Erros 401/403 (Autenticação/Autorização):**
    - Para `401 Unauthorized`, geralmente, você deve limpar qualquer token de autenticação e redirecionar o usuário para a página de login.
    - Para `403 Forbidden`, você pode redirecionar para uma página de "Acesso Negado" ou exibir uma mensagem clara.
- **Notificações ao Usuário:** Utilize um serviço de notificação (como Angular Material Snackbar, Toastr, ou um customizado) para exibir mensagens amigáveis ao usuário sem interromper seu fluxo de trabalho.
- **Evitar Re-lançamento de Erro em Casos Não Recuperáveis Globalmente:** Se um erro é tratado completamente no interceptor (ex: redirecionamento para login), e não há necessidade de mais lógica no serviço ou componente, você pode considerar não relançar o erro, embora a prática de relançar (`return throwError(...)`) seja mais comum e flexível. No entanto, é quase sempre uma boa prática relançar, pois o consumidor pode querer adicionar uma lógica específica também.
- **Tratamento de Erros Específicos por Requisição:** Para lógica que vai além do tratamento genérico (e.g., parsing de erros de validação do backend para exibir feedback de formulário), use `catchError` diretamente no serviço ou componente que faz a requisição, *depois* do interceptor ter agido.

---

### Exemplo Completo

Vamos a um exemplo mais completo que integra um serviço de notificação simples e um componente.

### 1\. Serviço de Notificação (`notification.service.ts`)

```tsx
// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'; // Assumindo Angular Material

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string, action: string = 'Fechar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string, action: string = 'Fechar', duration: number = 5000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: ['error-snackbar']
    });
  }

  showWarning(message: string, action: string = 'Fechar', duration: number = 4000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: ['warning-snackbar']
    });
  }
}

```

*(Você precisará adicionar estilos CSS para `success-snackbar`, `error-snackbar`, `warning-snackbar` em seu `styles.scss` global para personalizar a aparência do `MatSnackBar`)*

### 2\. Interceptor de Erros (`error.interceptor.ts`)

Mantém o mesmo código demonstrado anteriormente.

### 3\. Serviço de Dados (`user.service.ts`)

```tsx
// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service'; // Usar o serviço de notificação

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '<https://jsonplaceholder.typicode.com>'; // Exemplo de API pública

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService // Injetar NotificationService
  ) { }

  getUsers(): Observable<User[]> {
    // Este serviço irá se beneficiar do interceptor global.
    // Não precisamos adicionar um catchError aqui para erros genéricos.
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    // Exemplo de como você PODE adicionar um catchError específico
    // se precisar de lógica adicional após o interceptor global.
    // Note que o interceptor já teria tratado os erros genéricos.
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          this.notificationService.showWarning(`Usuário com ID ${id} não encontrado.`);
        }
        // É importante re-lançar o erro para o componente/consumidor final
        return throwError(() => new Error('Falha ao buscar usuário.'));
      })
    );
  }

  // Simula uma requisição que retornaria 400 Bad Request
  createInvalidUser(userData: any): Observable<any> {
    // Usaremos uma URL inválida para forçar um erro 404/400 se a API simulada retornar isso
    // Em uma aplicação real, você enviaria dados inválidos para uma rota válida.
    return this.http.post<any>(`${this.apiUrl}/invalid-endpoint`, userData);
  }
}

```

### 4\. Componente de Exemplo (`app.component.ts` e `app.component.html`)

```tsx
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { NotificationService } from './services/notification.service'; // Para exibir sucesso

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users: any[] = [];
  selectedUser: any | null = null;
  loading: boolean = false;
  title = 'angular-error-handling-demo';

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.notificationService.showSuccess('Usuários carregados com sucesso!');
        this.loading = false;
      },
      error: (err) => {
        // O interceptor já tratou o erro e exibiu uma notificação.
        // Aqui podemos lidar com erros que precisam de tratamento MUITO específico,
        // ou simplesmente logar que o Observable completou com erro.
        console.error('Erro ao carregar usuários no componente:', err);
        this.loading = false;
      }
    });
  }

  loadSpecificUser(id: number): void {
    this.loading = true;
    this.selectedUser = null;
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.selectedUser = data;
        this.notificationService.showSuccess(`Usuário ${data.name} carregado!`);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar usuário específico no componente:', err);
        // O erro já foi tratado pelo interceptor e possivelmente pelo serviço.
        // Se houver uma mensagem específica de erro do serviço, ela estará em `err.message`.
        this.loading = false;
      }
    });
  }

  // Simula uma requisição inválida que pode retornar 400
  createInvalidData(): void {
    this.loading = true;
    this.userService.createInvalidUser({ name: '', email: 'invalid' }).subscribe({
      next: (response) => {
        console.log('Dados criados (inesperado, se erro fosse esperado):', response);
        this.notificationService.showSuccess('Dados criados com sucesso (algo deu errado, este é um cenário de teste)!');
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao criar dados inválidos no componente:', err);
        // O interceptor já teria tratado os erros como 400 ou 404.
        // Aqui, podemos adicionar lógica de UI, como limpar formulários, etc.
        this.loading = false;
      }
    });
  }
}

```

```html
<div style="text-align:center">
  <h1>
    Bem-vindo ao {{ title }}!
  </h1>
  <hr>

  <h2>Demonstração de Tratamento de Erros HTTP</h2>

  <button (click)="loadUsers()" [disabled]="loading">
    {{ loading && !users.length ? 'Carregando...' : 'Carregar Usuários (Sucesso/Erro Global)' }}
  </button>
  <button (click)="loadSpecificUser(1)" [disabled]="loading">
    Carregar Usuário ID 1 (Sucesso)
  </button>
  <button (click)="loadSpecificUser(999)" [disabled]="loading">
    Carregar Usuário ID 999 (Erro 404)
  </button>
  <button (click)="createInvalidData()" [disabled]="loading">
    Criar Dados Inválidos (Erro 400/404 Simulado)
  </button>

  <div *ngIf="loading">
    <p>Aguarde, processando requisição...</p>
  </div>

  <hr>

  <div *ngIf="users.length">
    <h3>Lista de Usuários:</h3>
    <ul>
      <li *ngFor="let user of users">
        ID: {{ user.id }} - Nome: {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  </div>

  <div *ngIf="selectedUser">
    <h3>Detalhes do Usuário Selecionado:</h3>
    <p><strong>ID:</strong> {{ selectedUser.id }}</p>
    <p><strong>Nome:</strong> {{ selectedUser.name }}</p>
    <p><strong>Email:</strong> {{ selectedUser.email }}</p>
  </div>

</div>

```

Neste exemplo, você verá que:

- Ao carregar usuários normalmente, o `notificationService` exibe uma mensagem de sucesso.
- Ao tentar carregar o usuário com ID 999 (que não existe na JSONPlaceholder), o `ErrorInterceptor` captura o erro 404 e o `NotificationService` exibe uma mensagem de aviso. O `userService` também tem um `catchError` adicional para o 404, demonstrando tratamento mais específico.
- Ao tentar "criar dados inválidos", o `ErrorInterceptor` capturará o erro 404 (já que `invalid-endpoint` não existe) e exibirá a notificação de erro correspondente.
- A beleza é que o código nos componentes e serviços de dados permanece limpo, focado na lógica de sucesso, enquanto a lógica de tratamento de erro (incluindo exibição de mensagens e redirecionamentos) é centralizada no `ErrorInterceptor`.

---

### Tópicos Relacionados para Aprofundamento

- **Estratégias de Re-tentativa com RxJS (`retry`, `retryWhen`):** Explorar como configurar lógicas de re-tentativa mais avançadas para requisições que podem falhar temporariamente.
- **Tratamento de Erros Específicos do Backend (Payloads de Erro):** Como parsear e utilizar payloads de erro mais detalhados retornados pelo backend para exibir mensagens de validação específicas em formulários.
- **Serviços de Log de Erros (Sentry, New Relic, etc.):** Como integrar sua aplicação Angular com ferramentas de monitoramento e log de erros em tempo real para produção.
- **Integração com Servidores de Mensagens (`MatSnackBar`, `ngx-toastr`):** Aprofundar nas opções de notificação para o usuário.
- **Gerenciamento de Estado de Carregamento Global:** Como usar interceptores para gerenciar um estado de `loading` global na aplicação (ex: exibir um spinner de carregamento para todas as requisições HTTP ativas).

Espero que esta explicação seja super detalhada e útil para você, Gedê\! Se tiver mais alguma dúvida ou quiser aprofundar em algo, é só me chamar.