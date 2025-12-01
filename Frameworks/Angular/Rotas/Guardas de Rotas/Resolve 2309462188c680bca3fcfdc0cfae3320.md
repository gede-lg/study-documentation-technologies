# Resolve

Certo, Gedê\! Entendido. A.R.I.A. vai te ajudar a entender tudo sobre o **Resolve em Rotas do Angular**. Como desenvolvedor Backend Go em busca de um cargo e com experiência em Java, você vai achar essa funcionalidade bem útil no Angular, que é um framework frontend. Vamos lá para uma explicação detalhada e completa\!

---

## O Poder do `Resolve` em Rotas do Angular: Carregando Dados Antes da Renderização

O `Resolve` no Angular é uma funcionalidade poderosa para **pré-carregar dados** antes que uma rota seja ativada e seu componente correspondente seja renderizado. Isso garante que o componente já tenha todas as informações necessárias disponíveis assim que ele é exibido na tela, proporcionando uma experiência de usuário mais fluida e evitando o carregamento de "telas vazias" ou com dados incompletos.

---

### Sumário

Nesta explicação detalhada, abordaremos os seguintes tópicos:

- **Introdução:** Contextualização do problema de carregamento de dados em aplicações Single Page Applications (SPAs) e a solução oferecida pelo `Resolve`.
- **Conceitos Fundamentais:** A base teórica, importância e o propósito do `Resolve` no ecossistema de roteamento do Angular.
- **Sintaxe Detalhada e Uso Prático:** Como implementar o `Resolve` com exemplos de código comentados.
- **Métodos/Propriedades:** Análise do método `resolve` da interface `Resolve` e o papel do `ActivatedRouteSnapshot` e `RouterStateSnapshot`.
- **Cenários de Restrição ou Não Aplicação:** Quando o `Resolve` pode não ser a melhor escolha e alternativas.
- **Componentes Chave Associados:** Exploração da interface `Resolve`, `ActivatedRoute` e `Router`.
- **Melhores Práticas e Padrões de Uso:** Recomendações e dicas para um uso eficaz do `Resolve`.
- **Exemplo Prático Completo:** Um cenário de ponta a ponta mostrando o `Resolve` em ação.

---

### Introdução

Em aplicações Single Page Applications (SPAs) como as construídas com Angular, a navegação entre as páginas (rotas) é fluida e não envolve recarregamento completo da página. No entanto, muitas vezes, um componente precisa de dados de um servidor (como detalhes de um produto, informações de um usuário, etc.) para ser exibido corretamente.

Sem o `Resolve`, a abordagem comum seria renderizar o componente e, então, dentro do seu método `ngOnInit`, fazer a chamada assíncrona para buscar os dados. Isso pode levar a um breve período em que o componente é exibido sem dados, ou com um "estado de carregamento" (como um *spinner* ou *skeleton loader*), o que pode impactar a experiência do usuário, especialmente em conexões mais lentas.

O `Resolve` entra como um guarda de rota que **intercepta a navegação** e **garante que os dados necessários sejam carregados** antes mesmo de o componente de destino ser inicializado. Se o `Resolve` falhar ou retornar um erro, a navegação pode ser cancelada, evitando que o usuário veja uma tela de erro ou um componente incompleto.

---

### Conceitos Fundamentais

O `Resolve` é um tipo de **guarda de rota (Route Guard)** no Angular. Guardas de rota são interfaces que o Angular fornece para controlar o comportamento do roteador, como `CanActivate`, `CanDeactivate`, `CanLoad`, e `Resolve`.

O propósito principal do `Resolve` é:

1. **Pré-carregar Dados:** Buscar dados assincronamente (geralmente de uma API) antes que a rota de destino seja ativada.
2. **Garantir Dados para o Componente:** Fornecer os dados já carregados para o componente de destino através do serviço `ActivatedRoute`.
3. **Melhorar a Experiência do Usuário:** Evitar "flashes" de conteúdo incompleto e permitir que o componente renderize com todos os dados desde o início.
4. **Centralizar a Lógica de Carregamento:** A lógica de busca de dados é encapsulada em um serviço `Resolver` separado, tornando o código mais modular e testável.
5. **Controlar a Navegação:** Se o `Resolve` retornar um erro (ou um Observable que emite um erro), a navegação para aquela rota pode ser abortada, e você pode redirecionar o usuário ou exibir uma mensagem.

---

### Sintaxe Detalhada e Uso Prático

Para usar o `Resolve`, você precisa seguir os seguintes passos:

1. **Criar um Serviço Resolver:** Um serviço que implementa a interface `Resolve<T>`, onde `T` é o tipo de dado que ele irá resolver.
2. **Implementar o Método `resolve()`:** Este método conterá a lógica para buscar os dados. Ele deve retornar um `Observable`, `Promise` ou um valor direto.
3. **Registrar o Resolver na Configuração da Rota:** Adicionar o `Resolver` na propriedade `resolve` da configuração da rota no `RouterModule`.
4. **Acessar os Dados no Componente:** Injetar o `ActivatedRoute` no componente de destino e acessar os dados pré-carregados.

### Exemplo de Código Comentado:

Vamos criar um cenário onde precisamos carregar os detalhes de um usuário antes de exibir a página de perfil.

```tsx
// 1. Criar um modelo de dados (user.model.ts)
export interface User {
  id: number;
  name: string;
  email: string;
  // ... outras propriedades
}

// 2. Criar um serviço para buscar dados (user.service.ts)
// Geralmente você faria requisições HTTP aqui.
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'João Silva', email: 'joao@example.com' },
    { id: 2, name: 'Maria Souza', email: 'maria@example.com' },
    // ...
  ];

  constructor() { }

  getUserById(id: number): Observable<User | undefined> {
    // Simula uma chamada HTTP com um delay
    return of(this.users.find(user => user.id === id)).pipe(delay(1000));
  }
}

// 3. Criar o serviço Resolver (user-detail.resolver.ts)
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user.model';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserDetailResolver implements Resolve<User | undefined> { // T é o tipo de dado que será resolvido
  constructor(private userService: UserService, private router: Router) {}

  // O método resolve é chamado pelo roteador.
  // Ele recebe ActivatedRouteSnapshot (informações da rota atual) e RouterStateSnapshot (estado do roteador).
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | undefined> {
    const userId = Number(route.paramMap.get('id')); // Obtém o ID do usuário dos parâmetros da rota

    if (isNaN(userId)) {
      console.error('ID do usuário inválido na URL');
      this.router.navigate(['/usuarios']); // Redireciona se o ID for inválido
      return of(undefined); // Retorna undefined para que a navegação continue, mas sem dados
    }

    return this.userService.getUserById(userId).pipe(
      catchError(error => {
        console.error('Erro ao buscar usuário:', error);
        this.router.navigate(['/erro']); // Você pode redirecionar para uma página de erro
        return of(undefined); // Retorna undefined ou um Observable vazio para abortar a navegação
      })
    );
  }
}

// 4. Configurar a rota (app-routing.module.ts)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserDetailResolver } from './user-detail.resolver';
import { UsersListComponent } from './users-list/users-list.component'; // Um componente para listar usuários
import { NotFoundComponent } from './not-found/not-found.component'; // Um componente para rota não encontrada
import { ErrorPageComponent } from './error-page/error-page.component'; // Um componente para erros

const routes: Routes = [
  { path: 'usuarios', component: UsersListComponent },
  {
    path: 'usuarios/:id', // Rota com parâmetro de ID
    component: UserDetailComponent,
    resolve: { // A propriedade 'resolve' aceita um objeto onde as chaves são os nomes dos dados
      user: UserDetailResolver // e os valores são as classes dos Resolvers
    }
  },
  { path: 'erro', component: ErrorPageComponent },
  { path: '**', component: NotFoundComponent } // Rota curinga para não encontrado
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// 5. Acessar os dados no componente (user-detail/user-detail.component.ts)
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-user-detail',
  template: `
    <div *ngIf="user">
      <h2>Detalhes do Usuário: {{ user.name }}</h2>
      <p>ID: {{ user.id }}</p>
      <p>Email: {{ user.email }}</p>
    </div>
    <div *ngIf="!user">
      <p>Usuário não encontrado ou erro ao carregar.</p>
    </div>
  `
})
export class UserDetailComponent implements OnInit {
  user: User | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Acessa os dados pré-carregados através da propriedade 'data' do ActivatedRoute
    // A chave 'user' corresponde à chave definida na configuração da rota (resolve: { user: UserDetailResolver })
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }
}

```

---

### Métodos/Propriedades

A interface `Resolve<T>` define um único método:

### `resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T`

- **`route: ActivatedRouteSnapshot`**: Um "instantâneo" da rota que está sendo ativada. Contém informações estáticas sobre a rota, como seus parâmetros (`params`, `paramMap`), dados (`data`), e a URL.
    - **Uso:** É essencial para obter parâmetros da URL (ex: `route.paramMap.get('id')`) que serão usados para buscar os dados.
- **`state: RouterStateSnapshot`**: Um instantâneo do estado atual do roteador. Fornece uma representação da árvore de rotas ativas. Geralmente menos utilizado no `resolve` do que o `route`.
    - **Uso:** Pode ser útil em cenários mais complexos onde você precisa inspecionar o estado geral do roteador.
- **Retorno**:
    - **`Observable<T>`**: O mais comum. O roteador esperará que o Observable seja completado e emita um valor antes de ativar a rota. Se o Observable emitir um erro, a navegação será cancelada.
    - **`Promise<T>`**: Semelhante ao Observable, o roteador esperará que a Promise seja resolvida. Se a Promise for rejeitada, a navegação será cancelada.
    - **`T` (um valor direto)**: Se você tiver os dados disponíveis imediatamente (muito raro em casos reais de busca de dados), pode retornar o valor diretamente.

---

### Cenários de Restrição ou Não Aplicação

Embora o `Resolve` seja poderoso, existem situações em que ele pode não ser a melhor escolha:

- **Carregamento lento de dados essenciais:** Se a requisição de dados demorar muito, o usuário ficará esperando com uma tela em branco (ou a página anterior) até que todos os dados sejam carregados. Isso pode prejudicar a percepção de desempenho.
    - **Alternativa:** Para dados que podem ser carregados *depois* que o componente é renderizado (dados não essenciais para a primeira renderização), é melhor carregar os dados dentro do `ngOnInit` do componente e exibir um *spinner* ou *skeleton loader*.
- **Dados que mudam frequentemente:** Se os dados no servidor mudam muito rapidamente e você precisa da versão mais atualizada *no momento da exibição*, o `Resolve` pode não ser suficiente, pois ele carrega os dados apenas uma vez durante a navegação.
    - **Alternativa:** Combine o `Resolve` para dados iniciais com atualizações em tempo real (WebSockets) ou *polling* dentro do componente.
- **Múltiplas requisições de dados em rotas aninhadas:** Se uma rota aninhada também tiver um `Resolve`, isso pode levar a múltiplas requisições em cascata, que podem ser difíceis de gerenciar e otimizar.
    - **Alternativa:** Considere consolidar as requisições em um `Resolve` de nível superior ou usar o `forkJoin` (RxJS) para executar várias requisições em paralelo dentro de um único `Resolve`.
- **Controle de erro complexo com redirecionamento:** Gerenciar erros e redirecionamentos dentro do `resolve` pode ser um pouco verboso.
    - **Alternativa:** Abordagens de interceptores HTTP podem centralizar o tratamento de erros.

---

### Componentes Chave Associados

Vamos analisar os principais componentes e interfaces envolvidos com o `Resolve`:

- **`Resolve<T>` (Interface)**:
    - **Tipo**: Interface.
    - **Uso**: Define um contrato para classes que podem pré-carregar dados para uma rota. Exige a implementação do método `resolve()`.
    - **Sintaxe**:
        
        ```tsx
        import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
        import { Observable } from 'rxjs';
        
        interface Resolve<T> {
          resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T;
        }
        
        ```
        
    - **Atributos Cruciais**: Não possui atributos, apenas o método `resolve()`.
- **`ActivatedRoute` (Serviço)**:
    - **Tipo**: Serviço injetável.
    - **Uso**: Permite que um componente acesse informações sobre a rota que o ativou. É a principal forma de obter os dados resolvidos.
    - **Sintaxe para injeção**:
        
        ```tsx
        import { ActivatedRoute } from '@angular/router';
        
        class MyComponent {
          constructor(private route: ActivatedRoute) {}
          // ...
        }
        
        ```
        
    - **Propriedades Cruciais para `Resolve`**:
        - **`data: Observable<Data>`**: Um Observable que emite um objeto contendo os dados resolvidos pela rota. A chave do objeto corresponde à chave definida na propriedade `resolve` da configuração da rota.
            - **Uso**: `this.route.data.subscribe(data => { this.myResolvedData = data['myKey']; });`
        - **`snapshot: ActivatedRouteSnapshot`**: Uma representação estática da rota no momento da ativação. Útil para acessar parâmetros (parâmetros de URL, parâmetros de consulta) diretamente sem se inscrever em Observables.
            - **Uso**: `this.route.snapshot.data['myKey']` (menos reativo, bom para o primeiro carregamento). `this.route.snapshot.paramMap.get('id')`.
- **`Router` (Serviço)**:
    - **Tipo**: Serviço injetável.
    - **Uso**: Permite a navegação programática, o acesso a eventos do roteador e o controle geral do roteamento.
    - **Sintaxe para injeção**:
        
        ```tsx
        import { Router } from '@angular/router';
        
        class MyComponentOrService {
          constructor(private router: Router) {}
          // ...
        }
        
        ```
        
    - **Métodos/Propriedades Cruciais para `Resolve` (em um Resolver)**:
        - **`Maps(commands: any[], extras?: NavigationExtras)`**: Usado para navegar programaticamente para outras rotas. Essencial em um `Resolver` para redirecionar o usuário em caso de erro ou dados não encontrados.
            - **Uso**: `this.router.navigate(['/pagina-de-erro']);`

---

### Melhores Práticas e Padrões de Uso

- **Separação de Preocupações:** Mantenha a lógica de busca de dados (chamadas a APIs) em serviços dedicados (ex: `UserService`). O Resolver deve apenas orquestrar essa busca e lidar com a navegação em caso de erro.
- **Tratamento de Erros:** Sempre inclua um bloco `catchError` no seu Observable retornado pelo `resolve`. Isso permite que você trate erros de API gracefully, talvez redirecionando o usuário para uma página de erro ou exibindo uma mensagem. Se você não tratar o erro e o Observable emitir um erro, a navegação será cancelada e nenhuma rota será ativada.
- **Tratamento de Dados Não Encontrados:** Se o `resolve` buscar um item por ID e ele não for encontrado (ex: API retorna 404), o `resolve` deve decidir o que fazer.
    - Opção 1: Retornar `undefined` ou `null` e o componente lidará com a ausência de dados.
    - Opção 2: Redirecionar para uma página "Não Encontrado" (como `404`).
- **Indicadores de Carregamento:** Embora o `Resolve` evite "flashes" de conteúdo incompleto, a página pode ficar em branco (ou a anterior) enquanto os dados são carregados. Considere implementar um **guard-level spinner** ou um **progression bar global** (como o NgProgress ou um `Router.events` listener) para dar feedback ao usuário de que algo está acontecendo durante a fase de `resolve`.
- **Reuso:** Se vários componentes precisarem dos mesmos dados pré-carregados, use o mesmo `Resolver` em suas respectivas configurações de rota.
- **Múltiplos Resolvers:** Você pode ter vários Resolvers para uma única rota. Os dados de cada Resolver estarão disponíveis na propriedade `data` do `ActivatedRoute` sob a chave definida na configuração da rota.
    
    ```tsx
    // Em app-routing.module.ts
    {
      path: 'produto/:id',
      component: ProductDetailComponent,
      resolve: {
        product: ProductResolver,
        categories: CategoriesResolver
      }
    }
    
    // Em ProductDetailComponent
    this.route.data.subscribe(data => {
      this.product = data['product'];
      this.categories = data['categories'];
    });
    
    ```
    
- **Cuidado com `ActivatedRouteSnapshot` e `ActivatedRoute`:** Lembre-se que `ActivatedRouteSnapshot` é um *snapshot* (instantâneo) e não reage a mudanças na URL. Se você espera que os parâmetros da URL mudem *dentro do mesmo componente* (ex: `/usuarios/1` para `/usuarios/2`), você precisará se inscrever no `paramMap` do `ActivatedRoute` (que é um `Observable`) e recarregar os dados manualmente no `ngOnInit` do componente, ou então usar um padrão como o "Smart Component / Dumb Component" para forçar a recriação do componente.

---

### Exemplo Prático Completo: Detalhes de um Blog Post

Vamos criar um cenário onde você tem uma lista de posts de blog e, ao clicar em um post, você quer que os detalhes completos do post sejam carregados antes que a página de detalhes seja exibida.

```bash
# Crie um novo projeto Angular (se ainda não tiver um)
ng new blog-app --routing --style=scss
cd blog-app

# Gere os componentes, serviços e resolvers
ng g c components/post-list
ng g c components/post-detail
ng g c components/not-found
ng g s services/post
ng g r resolvers/post-detail

```

**1. `src/app/models/post.model.ts`**

```tsx
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: string;
}

```

**2. `src/app/services/post.service.ts`**

```tsx
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'Primeiro Post do Blog',
      content: 'Este é o conteúdo do primeiro post. Muito interessante!',
      author: 'João',
      publishDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Desvendando o Angular',
      content: 'Uma jornada pelos conceitos fundamentais do Angular e suas maravilhas.',
      author: 'Maria',
      publishDate: '2024-02-20'
    },
    {
      id: 3,
      title: 'A Arte de Codificar com Go',
      content: 'Explorando as vantagens e a sintaxe elegante da linguagem Go para backend.',
      author: 'Gedê', // Um post do Gedê!
      publishDate: '2025-07-14'
    }
  ];

  constructor() { }

  getPosts(): Observable<Post[]> {
    return of(this.posts).pipe(delay(500)); // Simula delay para lista
  }

  getPostById(id: number): Observable<Post> {
    const post = this.posts.find(p => p.id === id);
    if (post) {
      return of(post).pipe(delay(1000)); // Simula delay para detalhe
    } else {
      // Simula um erro 404
      return throwError(() => new Error('Post não encontrado!'));
    }
  }
}

```

**3. `src/app/resolvers/post-detail.resolver.ts`**

```tsx
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { PostService } from '../services/post.service';

@Injectable({
  providedIn: 'root'
})
export class PostDetailResolver implements Resolve<Post | null> { // Pode retornar Post ou null
  constructor(private postService: PostService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post | null> {
    const postId = Number(route.paramMap.get('id'));

    if (isNaN(postId)) {
      console.error('ID do post inválido:', route.paramMap.get('id'));
      this.router.navigate(['/posts']); // Redireciona para a lista de posts
      return of(null); // Retorna null para sinalizar que não há dados válidos
    }

    return this.postService.getPostById(postId).pipe(
      catchError(error => {
        console.error('Erro ao carregar post:', error);
        // Em caso de erro (ex: 404), redireciona para a página de não encontrado ou de erro
        this.router.navigate(['/nao-encontrado']);
        return of(null); // Importante retornar um Observable que completa com null para evitar que a navegação trave
      })
    );
  }
}

```

**4. `src/app/components/post-list/post-list.component.ts`**

```tsx
import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  template: `
    <h2>Lista de Posts</h2>
    <div *ngIf="posts.length > 0">
      <div *ngFor="let post of posts" class="post-card">
        <h3><a [routerLink]="['/posts', post.id]">{{ post.title }}</a></h3>
        <p>Por: {{ post.author }} em {{ post.publishDate }}</p>
        <hr>
      </div>
    </div>
    <div *ngIf="posts.length === 0">
      <p>Nenhum post disponível.</p>
    </div>
  `,
  styles: [`
    .post-card {
      border: 1px solid #ccc;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 5px;
    }
    .post-card h3 {
      margin-top: 0;
    }
    .post-card a {
      text-decoration: none;
      color: #007bff;
    }
    .post-card a:hover {
      text-decoration: underline;
    }
  `]
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }
}

```

**5. `src/app/components/post-detail/post-detail.component.ts`**

```tsx
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  template: `
    <div *ngIf="post">
      <h2>{{ post.title }}</h2>
      <p><strong>Autor:</strong> {{ post.author }}</p>
      <p><strong>Publicado em:</strong> {{ post.publishDate }}</p>
      <hr>
      <p>{{ post.content }}</p>
      <button routerLink="/posts">Voltar para a Lista</button>
    </div>
    <div *ngIf="!post">
      <p>Post não encontrado ou erro ao carregar os detalhes.</p>
      <button routerLink="/posts">Voltar para a Lista</button>
    </div>
  `,
  styles: [`
    div { margin-top: 20px; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
    h2 { color: #333; }
    p { line-height: 1.6; }
    button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 20px;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null; // Pode ser null se o resolve retornar null

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Acessa os dados resolvidos. O nome 'post' deve ser o mesmo que a chave em app-routing.module.ts
    this.route.data.subscribe(data => {
      this.post = data['post'];
      if (!this.post) {
        console.warn('Dados do post não carregados.');
        // Aqui você poderia exibir uma mensagem de erro específica se o post for null
      }
    });
  }
}

```

**6. `src/app/components/not-found/not-found.component.ts`**

```tsx
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h2>404 - Página Não Encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <button routerLink="/posts">Ir para a Página Inicial</button>
    </div>
  `,
  styles: [`
    button {
      padding: 10px 15px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 20px;
    }
    button:hover {
      background-color: #c82333;
    }
  `]
})
export class NotFoundComponent { }

```

**7. `src/app/app-routing.module.ts`**

```tsx
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostDetailResolver } from './resolvers/post-detail.resolver';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' }, // Redireciona a raiz para /posts
  { path: 'posts', component: PostListComponent },
  {
    path: 'posts/:id',
    component: PostDetailComponent,
    resolve: { // Aqui definimos o resolver
      post: PostDetailResolver // 'post' é a chave que será usada para acessar os dados no componente
    }
  },
  { path: 'nao-encontrado', component: NotFoundComponent }, // Rota para casos de não encontrado/erro do resolver
  { path: '**', component: NotFoundComponent } // Rota curinga para qualquer outra URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

**8. `src/app/app.module.ts`**

```tsx
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostDetailComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

**9. `src/app/app.component.ts`**

```tsx
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Meu Blog com Angular e Resolve</h1>
    <nav>
      <a routerLink="/posts" routerLinkActive="active">Lista de Posts</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    h1 { text-align: center; color: #007bff; }
    nav { text-align: center; margin-bottom: 20px; }
    nav a {
      margin: 0 10px;
      text-decoration: none;
      color: #007bff;
      font-weight: bold;
    }
    nav a.active {
      color: #0056b3;
      text-decoration: underline;
    }
  `]
})
export class AppComponent {
  title = 'blog-app';
}

```

Agora, quando você navegar para `/posts/1` (ou `/posts/2`, `/posts/3`), o `PostDetailResolver` será ativado, buscará os dados do post e somente depois o `PostDetailComponent` será renderizado, já com os dados disponíveis. Se você tentar um ID que não existe (ex: `/posts/999`), o `PostDetailResolver` tratará o erro e redirecionará para a página de "Não Encontrado".

---

Espero que esta explicação completa e detalhada sobre o `Resolve` no Angular tenha sido útil para você, Gedê\! Se tiver mais alguma dúvida ou quiser explorar outro tópico, A.R.I.A. está à disposição.