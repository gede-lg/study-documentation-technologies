# DELETE (Exclusão de Dados)

Com certeza, Gedê\! A.R.I.A está aqui para te ajudar com uma explicação detalhada sobre o método **DELETE** no contexto de requisições HTTP em **Angular**.

---

## O Método DELETE em Requisições HTTP no Angular

### Introdução

Em aplicações web modernas, a capacidade de **gerenciar dados** é fundamental. Isso inclui não apenas a criação, leitura e atualização, mas também a **exclusão** de informações. No ecossistema do **Angular**, as requisições HTTP são a ponte entre o frontend (sua aplicação Angular) e o backend (sua API). O método **DELETE** é a ferramenta padrão para sinalizar a um servidor que um recurso específico deve ser removido.

### Sumário

Esta explicação abordará o método **DELETE** em HTTP, especificamente como ele é utilizado no **Angular** através do `HttpClient`. Cobriremos desde os conceitos fundamentais até a sintaxe, uso prático, melhores práticas e exemplos completos, garantindo que você compreenda profundamente como e quando aplicar este método para exclusão de dados.

### Conceitos Fundamentais

O método **DELETE** é um dos verbos HTTP padrão, conforme definido pela RFC 7231. Sua finalidade principal é **solicitar a exclusão de um recurso** no servidor identificado pela URL.

- **Idempotência:** Uma característica crucial do método DELETE é sua **idempotência**. Isso significa que múltiplas requisições DELETE idênticas (com a mesma URL) terão o mesmo efeito no servidor que uma única requisição. Se o recurso já foi excluído, as requisições subsequentes não causarão erro ou alteração adicional no estado do servidor além da exclusão inicial. No entanto, é importante notar que a *resposta* do servidor pode variar (por exemplo, 200 OK para a primeira exclusão e 404 Not Found para as subsequentes).
- **Segurança:** Requisições DELETE são consideradas **não seguras** no sentido de que podem alterar o estado do servidor. Por isso, elas **nunca devem ser disparadas automaticamente** por navegadores, como links clicáveis ou pre-fetchers. Sempre exigem uma ação explícita do usuário (como clicar em um botão de "Excluir").
- **Recurso:** O recurso a ser excluído é geralmente identificado na **URL** da requisição. Por exemplo, para excluir um usuário com ID 123, a URL seria algo como `/api/usuarios/123`.

### Sintaxe e Uso

No Angular, a comunicação HTTP é facilitada pelo módulo `HttpClient`. Para realizar uma requisição DELETE, você usará o método `delete()` do `HttpClient`.

```tsx
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '<http://localhost:3000/api/usuarios>'; // Exemplo de URL da API

  constructor(private http: HttpClient) { }

  /**
   * Exclui um usuário do servidor.
   * @param id O ID do usuário a ser excluído.
   * @returns Um Observable que emite a resposta do servidor após a exclusão.
   */
  excluirUsuario(id: number): Observable<any> {
    // Constrói a URL para o recurso específico.
    const url = `${this.apiUrl}/${id}`;
    // Realiza a requisição DELETE. O TipoRetorno aqui é 'any', mas pode ser mais específico
    // dependendo do que a API retorna (ex: um objeto de confirmação, um booleano, ou void).
    return this.http.delete<any>(url);
  }
}

```

**Exemplo de Componente utilizando o Serviço:**

```tsx
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service'; // Assumindo que UserService está no mesmo diretório
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  template: `
    <h2>Lista de Usuários</h2>
    <ul>
      <li *ngFor="let user of users">
        {{ user.nome }}
        <button (click)="deletarUsuario(user.id)">Excluir</button>
      </li>
    </ul>
    <div *ngIf="mensagemErro" style="color: red;">{{ mensagemErro }}</div>
    <div *ngIf="mensagemSucesso" style="color: green;">{{ mensagemSucesso }}</div>
  `
})
export class UserListComponent implements OnInit {
  users: any[] = []; // Suponha que você carregue isso de alguma forma
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Exemplo: Carregar usuários (não focado no DELETE, mas para contexto)
    // this.userService.getUsers().subscribe(data => this.users = data);
    this.users = [{id: 1, nome: 'Gedê'}, {id: 2, nome: 'Ju'}]; // Dados de exemplo para o botão Excluir
  }

  deletarUsuario(id: number): void {
    this.mensagemErro = null; // Limpa mensagens anteriores
    this.mensagemSucesso = null;

    if (confirm(`Tem certeza que deseja excluir o usuário com ID ${id}?`)) {
      this.userService.excluirUsuario(id).subscribe({
        next: (resposta) => {
          console.log('Usuário excluído com sucesso!', resposta);
          this.mensagemSucesso = `Usuário com ID ${id} excluído com sucesso!`;
          // Atualiza a lista de usuários após a exclusão
          this.users = this.users.filter(user => user.id !== id);
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erro ao excluir usuário:', erro);
          this.mensagemErro = `Erro ao excluir usuário com ID ${id}: ${erro.message}`;
          // Você pode querer verificar o status do erro (ex: 404 Not Found, 403 Forbidden)
          if (erro.status === 404) {
            this.mensagemErro = `Usuário com ID ${id} não encontrado.`;
          }
        },
        complete: () => {
          console.log('Requisição DELETE para usuário finalizada.');
        }
      });
    }
  }
}

```

---

### Métodos/Propriedades do `HttpClient.delete()`

O método `delete()` do `HttpClient` é uma sobrecarga do método principal `request()`. Ele possui várias assinaturas que permitem diferentes formas de passar configurações para a requisição.

### Sintaxe Básica

```tsx
delete<T>(url: string, options?: {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}): Observable<T>

```

### Explicação de Parâmetros e Opções:

- **`url: string` (Obrigatório):**
    - **Conceito:** A URL do recurso que você deseja excluir no servidor.
    - **Uso:** É a parte mais crucial, pois identifica unicamente o recurso. Geralmente, inclui o endpoint da API e o identificador do recurso (ex: `/api/produtos/123`).
- **`options?: { ... }` (Opcional):**
    - **Conceito:** Um objeto que permite configurar a requisição HTTP com cabeçalhos personalizados, parâmetros de consulta, tipo de observação da resposta, etc.
    - **Uso:** Fornece flexibilidade para ajustar o comportamento da requisição.
    - **`headers?: HttpHeaders | { [header: string]: string | string[]; }`:**
        - **Conceito:** Define os cabeçalhos HTTP que serão enviados com a requisição.
        - **Uso:** Usado para autenticação (ex: `Authorization` header com um token JWT), especificar o tipo de conteúdo aceito (`Accept`), ou qualquer outro cabeçalho personalizado que sua API possa exigir.
        - **Exemplo:**
            
            ```tsx
            import { HttpHeaders } from '@angular/common/http';
            const headers = new HttpHeaders().set('Authorization', 'Bearer meu_token_jwt');
            this.http.delete<any>(url, { headers: headers });
            
            ```
            
    - **`context?: HttpContext` (Introduzido no Angular 12):**
        - **Conceito:** Um novo mecanismo para passar informações arbitrárias para interceptors. É uma alternativa mais limpa e tipada para adicionar dados customizados ao contexto da requisição.
        - **Uso:** Útil quando você precisa que um interceptor se comporte de uma certa maneira com base em uma propriedade específica da requisição (ex: pular autenticação para uma rota específica).
        - **Exemplo:**
            
            ```tsx
            import { HttpContextToken, HttpContext } from '@angular/common/http';
            const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);
            this.http.delete<any>(url, { context: new HttpContext().set(BYPASS_AUTH, true) });
            
            ```
            
    - **`observe?: 'body' | 'events' | 'response'`:**
        - **Conceito:** Determina qual parte da resposta HTTP o Observable deve emitir.
        - **Uso:**
            - **`'body'` (Padrão):** O Observable emite apenas o corpo da resposta (o que é mais comum para requisições DELETE, onde o corpo pode ser vazio ou conter uma mensagem de sucesso).
            - **`'response'`:** O Observable emite a `HttpResponse` completa, que inclui cabeçalhos, status, URL, etc., além do corpo. Útil se você precisar inspecionar os cabeçalhos de resposta ou o código de status exato.
            - **`'events'`:** O Observable emite eventos do ciclo de vida da requisição (como `HttpEventType.Sent`, `HttpEventType.Response`, etc.). Raramente usado para DELETE, mais comum para uploads de arquivos com barra de progresso.
        - **Exemplo (`observe: 'response'`):**
            
            ```tsx
            this.http.delete<any>(url, { observe: 'response' }).subscribe(response => {
              console.log('Status da resposta:', response.status); // Ex: 200, 204
              console.log('Corpo da resposta:', response.body); // Pode ser null/undefined para 204 No Content
            });
            
            ```
            
    - **`params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }`:**
        - **Conceito:** Define parâmetros de consulta (query parameters) a serem anexados à URL.
        - **Uso:** Embora menos comum para DELETE (já que o ID geralmente vai na URL), pode ser usado para filtros ou opções adicionais na exclusão.
        - **Exemplo:**
            
            ```tsx
            import { HttpParams } from '@angular/common/http';
            const params = new HttpParams().set('forcaExclusao', 'true');
            this.http.delete<any>(url, { params: params }); // URL seria: /api/recurso/123?forcaExclusao=true
            
            ```
            
    - **`reportProgress?: boolean`:**
        - **Conceito:** Se `true`, habilita o rastreamento de progresso para eventos de download (e upload, embora DELETE não tenha corpo de upload).
        - **Uso:** Raramente relevante para requisições DELETE, que geralmente não envolvem grandes transferências de dados.
        - **Exemplo:**
            
            ```tsx
            this.http.delete<any>(url, { reportProgress: true, observe: 'events' }).subscribe(event => {
              if (event.type === HttpEventType.Response) {
                console.log('Download completo!');
              }
            });
            
            ```
            
    - **`responseType?: 'json' | 'arraybuffer' | 'blob' | 'text'`:**
        - **Conceito:** Especifica o tipo esperado do corpo da resposta.
        - **Uso:**
            - **`'json'` (Padrão):** Angular tenta fazer parse do corpo como JSON.
            - **`'text'`:** O corpo é tratado como texto puro. Útil se sua API retorna apenas uma string simples (ex: "Excluído com sucesso").
            - **`'arraybuffer'` / `'blob'`:** Para dados binários. Não é comum para DELETE.
        - **Exemplo (`responseType: 'text'`):***Nota: Ao usar `responseType: 'text'`, o tipo genérico `<T>` do `delete<T>` deve ser compatível (ex: `<string>`).*
            
            ```tsx
            this.http.delete(url, { responseType: 'text' }).subscribe(message => {
              console.log('Resposta em texto:', message); // Ex: "Item removido"
            });
            
            ```
            
    - **`withCredentials?: boolean`:**
        - **Conceito:** Se `true`, indica que as credenciais (como cookies ou cabeçalhos de autorização) devem ser incluídas na requisição cross-site.
        - **Uso:** Essencial para comunicação com APIs em domínios diferentes que dependem de cookies para autenticação (CORS).
        - **Exemplo:**
            
            ```tsx
            this.http.delete<any>(url, { withCredentials: true });
            
            ```
            

---

### Restrições de Uso

Embora o método DELETE seja direto em sua intenção, há cenários em que ele não deveria ser aplicado ou onde sua aplicação requer cautela:

- **Não use DELETE para "desativar" ou "arquivar" um recurso:** Se o recurso deve permanecer no banco de dados, mas apenas não estar mais "ativo" ou visível, um método **PUT** ou **PATCH** que atualiza um status (`ativo: false`, `arquivado: true`) é mais apropriado. DELETE implica remoção permanente.
- **Não use DELETE para grandes conjuntos de dados sem confirmação:** Excluir múltiplos itens sem uma confirmação clara do usuário pode levar a perda irreversível de dados.
- **Não use DELETE com corpo de requisição significativo:** A especificação HTTP não proíbe um corpo em requisições DELETE, mas a maioria dos servidores e clientes não o processa ou espera. IDs ou critérios para exclusão devem ir na URL ou nos parâmetros de consulta, não no corpo.
- **Não use DELETE para operações não-idempotentes:** Se a mesma requisição DELETE executada várias vezes tiver efeitos diferentes (ex: remover itens diferentes a cada vez), algo está errado na sua API ou na forma como o DELETE está sendo interpretado.
- **Evite DELETE em cenários com dependências complexas:** Se a exclusão de um item tem cascatas complexas de exclusões ou alterações em outros recursos, certifique-se de que sua API lida com isso de forma transacional e que o usuário é informado sobre as consequências.

### Elementos Associados

Para que o `HttpClient.delete()` funcione no Angular, outros elementos são essenciais:

- **`HttpClientModule`:**
    - **Propósito:** O módulo Angular que fornece o serviço `HttpClient`.
    - **Uso:** Deve ser importado no seu `AppModule` (ou em um módulo específico de recursos que use `HttpClient`) para que o `HttpClient` possa ser injetado.
    - **Sintaxe:**
        
        ```tsx
        // app.module.ts
        import { NgModule } from '@angular/core';
        import { BrowserModule } from '@angular/platform-browser';
        import { HttpClientModule } from '@angular/common/http'; // <-- Importe aqui
        
        import { AppComponent } from './app.component';
        
        @NgModule({
          declarations: [
            AppComponent,
            // ... outros componentes
          ],
          imports: [
            BrowserModule,
            HttpClientModule, // <-- Adicione aos imports
          ],
          providers: [],
          bootstrap: [AppComponent]
        })
        export class AppModule { }
        
        ```
        
- **`Observable` (do RxJS):**
    - **Propósito:** O `HttpClient` retorna `Observable`s, que são fluxos assíncronos de dados. Isso permite que você lide com a resposta da requisição (sucesso ou erro) de forma reativa.
    - **Uso:** Você `subscreve` ao `Observable` retornado pelo `delete()` para receber a resposta ou tratar erros.
    - **Sintaxe:**
        
        ```tsx
        this.http.delete<any>(url).subscribe({
          next: (response) => { /* sucesso */ },
          error: (err) => { /* erro */ },
          complete: () => { /* finalizado */ }
        });
        
        ```
        
- **`HttpErrorResponse`:**
    - **Propósito:** Uma classe que encapsula informações sobre um erro de HTTP (status, mensagem, etc.) que pode ocorrer durante uma requisição.
    - **Uso:** É o tipo do erro que você recebe no callback `error` de um `subscribe`. Permite inspecionar o código de status HTTP do erro para tratar diferentes cenários (ex: 404 Not Found, 403 Forbidden).
    - **Sintaxe:**
        
        ```tsx
        import { HttpErrorResponse } from '@angular/common/http';
        
        // ...
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            console.error('Recurso não encontrado.');
          } else if (err.status === 403) {
            console.error('Acesso negado.');
          } else {
            console.error('Erro desconhecido:', err.message);
          }
        }
        
        ```
        
- **`HttpHeaders` e `HttpParams`:**
    - **Propósito:** Classes auxiliares para construir e manipular cabeçalhos HTTP e parâmetros de consulta de forma imutável e segura.
    - **Uso:** São as formas recomendadas para passar opções complexas para o método `delete()`.
    - **Sintaxe:** Já demonstrado na seção "Métodos/Propriedades".

### Melhores Práticas e Casos de Uso

- **Confirmação do Usuário:** Sempre solicite confirmação ao usuário antes de executar uma operação DELETE, especialmente em dados críticos. Um `confirm()` básico ou um modal mais elaborado são essenciais.
- **Feedback Visual:** Forneça feedback visual claro ao usuário durante e após a exclusão (ex: "Excluindo...", "Item excluído com sucesso\!", ou uma mensagem de erro).
- **Atualização da UI:** Após uma exclusão bem-sucedida, atualize a interface do usuário imediatamente (ex: remova o item da lista) para refletir o novo estado. Evite recarregar a página inteira se não for necessário.
- **Tratamento de Erros Robusto:** Implemente um tratamento de erros abrangente. Capturar `HttpErrorResponse` e reagir a diferentes códigos de status HTTP (404 Not Found, 403 Forbidden, 500 Internal Server Error, etc.) é crucial para uma boa experiência do usuário.
- **Autenticação e Autorização:** Requisições DELETE quase sempre exigem autenticação e autorização para garantir que apenas usuários permitidos possam excluir recursos. Implemente interceptors Angular para anexar tokens de autenticação automaticamente.
- **CORS (Cross-Origin Resource Sharing):** Certifique-se de que seu backend está configurado corretamente para permitir requisições DELETE de seu domínio Angular, caso eles estejam em domínios diferentes.
- **Remoção em Cascata (Backend):** Se a exclusão de um recurso implica na remoção de recursos relacionados (ex: excluir um usuário também exclui seus posts), essa lógica deve ser gerenciada pelo backend. O Angular apenas envia a solicitação de exclusão do recurso principal.

---

### Exemplo Completo: Gerenciamento de Produtos

Vamos criar um exemplo mais completo que simula um gerenciamento de produtos, onde podemos listar e excluir produtos.

**1. `product.service.ts`:**

```tsx
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface simples para o produto
export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '<http://localhost:3000/api/products>'; // Assumindo uma API REST simples

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError) // Reutiliza a função de tratamento de erro
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Um erro desconhecido ocorreu.';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente ou de rede
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      // Erro retornado pelo backend
      if (error.status === 404) {
        errorMessage = `Recurso não encontrado (Status: ${error.status})`;
      } else if (error.status === 403) {
        errorMessage = `Você não tem permissão para realizar esta ação (Status: ${error.status})`;
      } else if (error.status === 500) {
        errorMessage = `Erro interno do servidor (Status: ${error.status})`;
      } else {
        errorMessage = `Erro do servidor: ${error.status} - ${error.message || ''}`;
      }
      // Opcional: erro.error pode conter um objeto de erro do backend com mais detalhes
      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage += ` - Detalhes: ${error.error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

```

**2. `product-list.component.ts`:**

```tsx
import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from './product.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  template: `
    <hr>
    <h3>{{ title }}</h3>
    <div *ngIf="products.length === 0 && !loading && !errorMessage">
      Nenhum produto encontrado.
    </div>
    <div *ngIf="loading">Carregando produtos...</div>
    <div *ngIf="errorMessage" style="color: red;">
      Erro: {{ errorMessage }}
    </div>

    <ul *ngIf="products.length > 0">
      <li *ngFor="let product of products">
        {{ product.name }} - R$ {{ product.price | number:'1.2-2' }}
        <button (click)="onDelete(product.id)">Excluir</button>
      </li>
    </ul>

    <div *ngIf="successMessage" style="color: green;">{{ successMessage }}</div>
  `,
  styles: [`
    button { margin-left: 10px; cursor: pointer; }
    ul { list-style-type: none; padding: 0; }
    li { margin-bottom: 5px; }
  `]
})
export class ProductListComponent implements OnInit {
  title = 'Lista de Produtos';
  products: Product[] = [];
  loading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Falha ao carregar produtos.';
        this.loading = false;
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }

  onDelete(id: number): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (confirm(`Tem certeza que deseja excluir o produto com ID ${id}?`)) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.successMessage = `Produto com ID ${id} excluído com sucesso!`;
          // Remove o produto da lista local para atualizar a UI
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message || `Erro ao excluir produto com ID ${id}.`;
          console.error('Erro na exclusão:', err);
        },
        complete: () => {
          console.log('Operação DELETE finalizada.');
        }
      });
    }
  }
}

```

**3. `app.module.ts` (Verificar se `HttpClientModule` está importado):**

```tsx
// ...
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent // Adicione o componente de lista de produtos
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Certifique-se que está aqui
    // ... outros módulos
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

**4. `app.component.ts` (Para usar o componente):**

```tsx
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Minha Aplicação Angular</h1>
    <app-product-list></app-product-list>
  `
})
export class AppComponent {
  title = 'angular-delete-example';
}

```

**Para testar este exemplo, você precisaria de um backend simples (como um `json-server`):**

Instale `json-server`:
`npm install -g json-server`

Crie um arquivo `db.json` na raiz do seu projeto Angular:

```json
{
  "products": [
    { "id": 1, "name": "Smartphone", "price": 1200.00 },
    { "id": 2, "name": "Notebook", "price": 3500.00 },
    { "id": 3, "name": "Monitor", "price": 800.00 }
  ]
}

```

Inicie o `json-server`:
`json-server --watch db.json --port 3000`

Agora, ao iniciar sua aplicação Angular (`ng serve`), ela tentará buscar e permitir a exclusão de produtos desse "backend" simulado.

---

### Sugestões de Tópicos Relacionados para Aprofundamento

- **Interceptors HTTP no Angular:** Como interceptar requisições para adicionar cabeçalhos de autenticação, logar erros ou manipular respostas globalmente.
- **Tratamento de Erros Reativo com RxJS:** Estratégias mais avançadas de tratamento de erros, como `retry`, `retryWhen`, `catchError` com diferentes lógicas.
- **Autenticação e Autorização em Aplicações Angular:** Implementação de JWT (JSON Web Tokens) e guardas de rota (`CanActivate`) para proteger suas aplicações.
- **Boas Práticas de Design de API REST:** Como modelar seus endpoints RESTful para que os métodos HTTP (GET, POST, PUT, DELETE) sejam usados de forma consistente e semântica.
- **Status Codes HTTP:** Uma compreensão mais aprofundada dos códigos de status de sucesso (200 OK, 204 No Content) e erro (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error) e como reagir a eles.

Espero que esta explicação detalhada seja útil para você, Gedê\! Se tiver mais alguma dúvida, A.R.I.A está à disposição.