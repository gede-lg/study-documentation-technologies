# HttpInterceptor

Olá, Gedê\!

A.R.I.A. está pronta para te ajudar com uma explicação detalhada sobre `HttpInterceptor` no Angular. Preparei um material bem completo para você, seguindo todas as suas instruções.

---

### **Interceptores HTTP no Angular: O Guardião Silencioso das Requisições**

### **Introdução**

O `HttpInterceptor` é uma funcionalidade poderosa do Angular que permite interceptar requisições e respostas HTTP. Atuando como um "guardião" central, ele pode inspecionar, modificar e tratar requisições antes que sejam enviadas ao servidor e respostas antes que cheguem ao seu destino final (geralmente, o componente ou serviço que as solicitou). Isso centraliza a lógica de tratamento de HTTP, evitando a repetição de código em múltiplos serviços.

### **Sumário**

Esta explicação cobrirá os conceitos fundamentais dos interceptores, sua sintaxe, propriedades e métodos, além de restrições de uso, melhores práticas e exemplos práticos. Abordaremos como eles são uma peça-chave na arquitetura de aplicações Angular para tarefas como adição de cabeçalhos de autenticação, tratamento de erros, e manipulação de requisições e respostas de forma global.

---

### **Conceitos Fundamentais**

O `HttpInterceptor` é uma interface que você implementa em uma classe. Quando uma requisição é feita, o Angular passa essa requisição por um pipeline de interceptores que você configurou. Cada interceptor pode realizar uma tarefa específica e, em seguida, passar a requisição para o próximo interceptor na cadeia, ou para o `HttpHandler` (que é o responsável por, de fato, enviar a requisição ao servidor).

O propósito principal é:

- **Centralizar a lógica:** Em vez de adicionar, por exemplo, o token de autenticação em cada requisição individualmente, você pode fazer isso em um único lugar.
- **Reusabilidade:** A lógica de tratamento de erros ou logging pode ser usada em toda a aplicação.
- **Modificação de requisições:** Você pode adicionar, remover ou modificar cabeçalhos, corpo (body) da requisição, e outros parâmetros.
- **Manipulação de respostas:** É possível modificar o corpo da resposta, tratar erros globalmente ou adicionar cabeçalhos.

---

### **Sintaxe e Uso**

Para criar um interceptor, você precisa de uma classe que implemente a interface `HttpInterceptor`. Essa interface exige a implementação de um único método: `intercept()`.

```tsx
// src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Lógica de interceptação aqui
    const authToken = 'meu-token-de-autenticacao';

    // Clona a requisição para poder modificá-la
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Passa a requisição modificada para o próximo handler na cadeia
    return next.handle(authRequest);
  }
}

```

Para que o Angular utilize este interceptor, ele precisa ser registrado no `providers` do seu `app.module.ts` (ou no módulo onde você o utilizará). É crucial registrá-lo com o token de injeção `HTTP_INTERCEPTORS` e a propriedade `multi: true`, pois podem existir múltiplos interceptores.

```tsx
// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth.interceptor'; // Importa o interceptor

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

---

### **Propriedades e Métodos**

Os interceptores não possuem propriedades próprias no sentido de "atributos de classe". Eles operam nos parâmetros do método `intercept()`:

### **Método `intercept()`**

Este é o único método da interface `HttpInterceptor`.

- **Sintaxe:** `intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>`
- **Conceito:** É o método central onde a lógica de interceptação é implementada. Ele recebe a requisição (`HttpRequest`) e o próximo manipulador (`HttpHandler`) na cadeia.
- **Parâmetros:**
    - **`request: HttpRequest<any>`:** Representa a requisição HTTP atual. Esta requisição é **imutável**, o que significa que para modificá-la, você deve criar uma cópia usando o método `request.clone()`.
    - **`next: HttpHandler`:** Representa o próximo manipulador na cadeia de interceptores. Chamar `next.handle(request)` envia a requisição para o próximo interceptor ou, se for o último, para o backend.

### **Propriedades da Classe `HttpRequest`**

Embora não sejam propriedades do interceptor em si, elas são os atributos da requisição que você pode inspecionar e modificar.

| Propriedade | Conceito |
| --- | --- |
| `url` | A URL completa da requisição. |
| `urlWithParams` | A URL com os parâmetros de consulta (query params). |
| `method` | O método HTTP da requisição (e.g., 'GET', 'POST', 'PUT'). |
| `headers` | Os cabeçalhos da requisição, como um objeto `HttpHeaders`. |
| `body` | O corpo da requisição (se houver, como em 'POST' ou 'PUT'). |
| `params` | Os parâmetros de consulta (query params), como um objeto `HttpParams`. |
| `responseType` | O tipo de resposta esperado (e.g., 'json', 'text'). |
| `reportProgress` | Booleano que indica se a requisição deve emitir eventos de progresso. |

### **Métodos da Classe `HttpRequest`**

O método mais importante aqui é o `clone()`, pois ele permite a modificação da requisição.

| Método | Conceito |
| --- | --- |
| `clone(updates)` | Cria uma cópia da requisição com as modificações especificadas no objeto `updates`. É a única maneira de alterar uma requisição. |

---

### **Restrições de Uso**

Embora extremamente úteis, os interceptores têm cenários onde seu uso pode ser inadequado:

- **Lógica de Negócio Específica:** Não use interceptores para tratar a lógica de negócio específica de um componente ou serviço. O interceptor deve ter uma responsabilidade global, como autenticação ou logging, e não lidar com dados específicos de uma API.
- **Interceptors Pesados:** Evite colocar lógica de processamento muito pesada dentro do interceptor, pois isso pode impactar o desempenho de todas as requisições na sua aplicação.
- **Modificação de requisições de forma seletiva:** Embora seja possível adicionar lógica para modificar apenas certas requisições (por exemplo, usando a URL), é melhor ter múltiplos interceptores com responsabilidades claras do que um interceptor "monolítico".

---

### **Melhores Práticas e Casos de Uso**

- **Autenticação (JWT, por exemplo):** Este é o caso de uso mais comum. Um interceptor pode adicionar um cabeçalho `Authorization` com um token para cada requisição.
- **Cache:** Um interceptor pode verificar se uma requisição `GET` já foi feita e, se sim, retornar os dados em cache em vez de fazer uma nova chamada ao servidor.
- **Logging:** Registrar todas as requisições e respostas em um serviço de log.
- **Manipulação Global de Erros:** Capturar erros 401 (Não Autorizado) e redirecionar o usuário para a página de login, ou exibir uma notificação para erros 500.
- **Barra de Carregamento (Loading Indicator):** Um interceptor pode mostrar uma barra de carregamento no início de uma requisição e escondê-la quando a resposta for recebida.

---

### **Exemplo Completo: Interceptor de Autenticação e Loading**

Este exemplo demonstra um interceptor que adiciona um token de autenticação e também gerencia um serviço de loading (carregamento).

### **1. O Serviço de Loading (loading.service.ts)**

```tsx
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingState = new Subject<boolean>();
  private activeRequests = 0;

  constructor() { }

  show() {
    this.activeRequests++;
    this.loadingState.next(true);
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this.loadingState.next(false);
    }
  }
}

```

### **2. O Interceptor (auth-loading.interceptor.ts)**

```tsx
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class AuthLoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Mostrar o loading
    this.loadingService.show();

    // 2. Clona a requisição para adicionar o cabeçalho de autenticação
    const authToken = localStorage.getItem('authToken');
    let authRequest = request;

    if (authToken) {
      authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    // 3. Passa a requisição modificada para o próximo handler e lida com a resposta
    return next.handle(authRequest).pipe(
      // 4. Captura a resposta e trata possíveis erros
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('Resposta recebida com sucesso.');
          // Lógica de sucesso (opcional)
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Ocorreu um erro na requisição:', error);

        if (error.status === 401) {
          // Lógica para lidar com token expirado ou não autorizado
          // Ex: Redirecionar para login
          // Ex: window.location.href = '/login';
        }

        // Retorna o erro para ser tratado no componente/serviço que fez a requisição
        return throwError(() => error);
      }),
      // 5. Oculta o loading, independente de sucesso ou erro
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}

```

### **3. Registro no Módulo Principal (app.module.ts)**

```tsx
// ... (imports)
import { AuthLoadingInterceptor } from './auth-loading.interceptor';

@NgModule({
  // ... (declarations, imports)
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthLoadingInterceptor,
      multi: true
    }
  ],
  // ... (bootstrap)
})
export class AppModule { }

```

---

### **Tópicos Relacionados para Aprofundamento**

- **HttpClientModule:** Entender como a injeção de dependência e os provedores funcionam neste módulo.
- **RxJS Operators (pipe, tap, catchError, finalize):** A forma como você lida com o `Observable` da resposta é fundamental. Aprofunde-se nestes operadores para manipular o fluxo de forma eficiente.
- **Gerenciamento de Estado no Angular (NgRx, Akita):** Como os interceptores podem interagir com um gerenciador de estado para, por exemplo, armazenar o token de autenticação ou o estado de loading.
- **Testes Unitários de Interceptors:** Como escrever testes para garantir que seu interceptor funciona como esperado, sem depender de uma chamada real à API.

Espero que esta explicação tenha sido útil, Gedê. Se tiver mais alguma dúvida ou quiser aprofundar em algum desses tópicos, é só me dizer\!