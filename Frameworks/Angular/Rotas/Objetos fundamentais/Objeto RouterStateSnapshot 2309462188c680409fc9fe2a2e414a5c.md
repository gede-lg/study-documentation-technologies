# Objeto RouterStateSnapshot

Olá, Gedê\!

Com certeza, posso te ajudar a entender o `RouterStateSnapshot` em Angular. Como desenvolvedor backend, você vai notar algumas similaridades com a forma como as informações são estruturadas e trafegadas em sistemas distribuídos, mas com um foco na "árvore" de rotas do lado do cliente.

---

## Entendendo o `RouterStateSnapshot` no Angular

O `RouterStateSnapshot` é um objeto fundamental no sistema de roteamento do Angular, oferecendo uma representação imutável e instantânea do estado atual do roteador em um determinado momento. Ele é como uma "fotografia" da árvore de rotas que foi ativada.

---

### Introdução

No Angular, a navegação entre diferentes partes da sua aplicação é gerenciada pelo sistema de **roteamento**. Quando um usuário navega, o roteador do Angular entra em ação para determinar qual componente deve ser exibido. Durante esse processo, várias informações sobre a rota atual e as rotas futuras são geradas e disponibilizadas para que você possa tomar decisões ou acessar dados relacionados à navegação. O `RouterStateSnapshot` é um desses objetos cruciais, permitindo que você inspecione o estado do roteador após uma navegação bem-sucedida, mas antes que a UI seja completamente atualizada.

---

### Sumário

Nesta explicação detalhada, abordaremos os seguintes pontos sobre o `RouterStateSnapshot`:

- **Conceitos Fundamentais:** Sua importância, propósito e como ele se relaciona com a ativação de rotas.
- **Sintaxe Detalhada e Uso Prático:** Como acessá-lo e utilizá-lo em guardas de rota e resolvedores.
- **Métodos/Propriedades:** Uma exploração completa de suas propriedades, como `url`, `root`, `queryParams`, `fragment`, e `data`.
- **Cenários de Restrição ou Não Aplicação:** Quando outras abordagens podem ser mais adequadas.
- **Componentes Chave Associados:** `ActivatedRouteSnapshot`, `RouterState`, `ActivatedRoute`, e `UrlSegment`.
- **Melhores Práticas e Padrões de Uso:** Dicas para trabalhar eficientemente com `RouterStateSnapshot`.
- **Exemplo Prático Completo:** Um cenário demonstrando seu uso em um Resolvedor de Rota.

---

### Conceitos Fundamentais

O `RouterStateSnapshot` é uma representação **imutável** do estado do roteador em um ponto específico no tempo. Ele captura a hierarquia completa das rotas ativadas, incluindo seus parâmetros, dados e segmentos de URL. Pense nele como uma estrutura de dados em árvore, onde cada nó representa uma rota em um determinado nível na hierarquia.

**Importância e Propósito:**

1. **Guarda de Rotas (Route Guards):** É amplamente utilizado em *guards* (como `CanActivate`, `CanLoad`, `CanDeactivate`, `Resolve`) para tomar decisões de navegação. Por exemplo, você pode verificar se um usuário tem permissão para acessar uma rota específica ou se dados necessários já foram carregados antes de permitir a navegação.
2. **Resolvedores (Resolvers):** Em *resolvers* (`Resolve`), o `RouterStateSnapshot` permite que você acesse parâmetros da rota ou outros dados do estado do roteador para buscar informações necessárias antes que um componente seja carregado. Isso garante que o componente tenha todos os dados de que precisa assim que for instanciado, evitando que ele precise buscar dados assincronamente após a renderização.
3. **Depuração e Auditoria:** Ajuda a entender o estado do roteador em qualquer ponto da navegação.
4. **Imutabilidade:** Por ser um *snapshot* (instantâneo), ele não muda enquanto o processo de navegação está ocorrendo, garantindo consistência para as decisões tomadas.

Ele é gerado **antes** da navegação ser concluída e os componentes serem renderizados. Isso é crucial porque permite que você inspecione o estado *futuro* do roteador e decida se a navegação deve prosseguir.

---

### Sintaxe Detalhada e Uso Prático

Você não instancia `RouterStateSnapshot` diretamente. Ele é injetado ou passado como argumento para os métodos de *guards* e *resolvers*.

### Em um `CanActivate` Guard:

```tsx
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot, // Snapshot da rota que está sendo ativada
    state: RouterStateSnapshot // Snapshot do estado do roteador inteiro
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Exemplo: Verificar se o usuário está logado
    const isLoggedIn = true; // Simule aqui a lógica de autenticação

    if (isLoggedIn) {
      console.log('URL de destino:', state.url); // Acessa a URL completa da rota para a qual se está navegando
      console.log('Parâmetros da rota pai (se houver):', route.parent?.params);
      return true; // Permite a navegação
    } else {
      console.log('Usuário não autenticado. Redirecionando para login.');
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }); // Redireciona
    }
  }
}

```

**Comentários:**

- O método `canActivate` recebe dois argumentos: `route` (um `ActivatedRouteSnapshot` da rota específica que está sendo ativada) e `state` (o `RouterStateSnapshot` de todo o estado do roteador).
- `state.url` é frequentemente usado para obter a URL completa da rota de destino, útil para redirecionamentos com `returnUrl`.

### Em um `Resolve` Guard:

```tsx
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {

  constructor() {}

  resolve(
    route: ActivatedRouteSnapshot, // Snapshot da rota que está sendo ativada
    state: RouterStateSnapshot // Snapshot do estado do roteador inteiro
  ): Observable<User> | Promise<User> | User {
    const userId = route.paramMap.get('id'); // Acessa o parâmetro 'id' da rota
    console.log(`Buscando dados para o usuário com ID: ${userId} na rota ${state.url}`);

    // Simula uma chamada de API
    return of({
      id: Number(userId),
      name: `Usuário ${userId}`,
      email: `user${userId}@example.com`
    }).pipe(delay(1000)); // Simula atraso na rede
  }
}

```

**Comentários:**

- Aqui, usamos `route.paramMap.get('id')` para obter um parâmetro específico da rota que está sendo resolvida, mas o `state.url` ainda está disponível para contexto.
- O `UserResolver` garante que os dados do usuário estejam disponíveis antes que o componente associado à rota seja renderizado.

---

### Métodos/Propriedades

O `RouterStateSnapshot` expõe várias propriedades importantes para inspecionar o estado do roteador. Ele não possui métodos no sentido de funções que realizam ações, mas suas propriedades oferecem acesso a diferentes partes do estado.

- `url: string`:
    - **Conceito:** A URL completa que corresponde ao estado atual do roteador. É a string que apareceria na barra de endereço do navegador se a navegação fosse concluída.
    - **Sintaxe de Uso:** `state.url`
    - **Exemplo:** Se a navegação for para `/users/123?admin=true#profile`, `state.url` será `"/users/123?admin=true#profile"`.
- `root: ActivatedRouteSnapshot`:
    - **Conceito:** O `ActivatedRouteSnapshot` que representa a raiz da árvore de rotas. A partir deste nó raiz, você pode percorrer toda a árvore de rotas ativadas. É o ponto de partida para acessar informações de rotas filhas e suas configurações.
    - **Sintaxe de Uso:** `state.root`
    - **Exemplo:** `state.root.children` para acessar as rotas filhas diretas da raiz.
- `queryParams: Params`:
    - **Conceito:** Um objeto que contém todos os parâmetros de consulta (query parameters) presentes na URL do `RouterStateSnapshot`. Estes são os pares chave-valor que aparecem após o `?` na URL.
    - **Sintaxe de Uso:** `state.queryParams`
    - **Exemplo:** Para a URL `/produtos?categoria=eletronicos&ordenarPor=preco`, `state.queryParams` seria `{ categoria: 'eletronicos', ordenarPor: 'preco' }`.
- `queryParamMap: ParamMap`:
    - **Conceito:** Uma versão imutável e mais robusta dos parâmetros de consulta, semelhante ao `paramMap` de `ActivatedRouteSnapshot`. Permite verificar a existência de parâmetros e recuperá-los de forma mais segura.
    - **Sintaxe de Uso:** `state.queryParamMap`
    - **Exemplo:** `state.queryParamMap.has('categoria')` ou `state.queryParamMap.get('ordenarPor')`.
- `fragment: string | null`:
    - **Conceito:** O fragmento da URL (hash) que aparece após o `#`.
    - **Sintaxe de Uso:** `state.fragment`
    - **Exemplo:** Para a URL `/home#section1`, `state.fragment` seria `"section1"`.

Além dessas propriedades diretas no `RouterStateSnapshot`, a principal forma de explorar o estado é através da propriedade `root` e, consequentemente, da árvore de `ActivatedRouteSnapshot` que ela representa. Cada `ActivatedRouteSnapshot` na árvore possui as seguintes propriedades importantes (que você acessa a partir de `state.root` ou de seus filhos):

- `routeConfig: Route | null`:
    - **Conceito:** O objeto de configuração da rota original (`Route`) que foi usada para criar este `ActivatedRouteSnapshot`. Contém propriedades como `path`, `component`, `redirectTo`, `canActivate`, `resolve`, etc.
    - **Sintaxe de Uso:** `state.root.routeConfig` ou `route.routeConfig` (dentro de um guard/resolver).
- `url: UrlSegment[]`:
    - **Conceito:** Um array de `UrlSegment`s que representam os segmentos de URL para esta parte específica da rota. Cada `UrlSegment` contém o caminho (`path`) e os parâmetros da matriz (`parameters`).
    - **Sintaxe de Uso:** `route.url`
- `params: Params`:
    - **Conceito:** Um objeto contendo os parâmetros de rota para este nó `ActivatedRouteSnapshot`. São os parâmetros definidos na configuração da rota com `:nomeParametro`.
    - **Sintaxe de Uso:** `route.params`
- `paramMap: ParamMap`:
    - **Conceito:** Similar ao `queryParamMap`, é uma versão imutável dos parâmetros de rota, permitindo acesso mais seguro e eficiente.
    - **Sintaxe de Uso:** `route.paramMap.get('id')`
- `data: Data`:
    - **Conceito:** Um objeto contendo os dados estáticos definidos na configuração da rota (`data` property), ou os dados resolvidos por um *resolver* (`resolve` property).
    - **Sintaxe de Uso:** `route.data`
- `outlet: string`:
    - **Conceito:** O nome do `router-outlet` onde este componente da rota será exibido. O padrão é `'primary'`.
    - **Sintaxe de Uso:** `route.outlet`
- `component: Type<any> | null`:
    - **Conceito:** A classe do componente que será ativada por esta rota.
    - **Sintaxe de Uso:** `route.component`
- `parent: ActivatedRouteSnapshot | null`:
    - **Conceito:** O `ActivatedRouteSnapshot` da rota pai. Útil para navegar para cima na hierarquia.
    - **Sintaxe de Uso:** `route.parent`
- `firstChild: ActivatedRouteSnapshot | null`:
    - **Conceito:** O primeiro `ActivatedRouteSnapshot` filho desta rota.
    - **Sintaxe de Uso:** `route.firstChild`
- `children: ActivatedRouteSnapshot[]`:
    - **Conceito:** Um array de `ActivatedRouteSnapshot`s que são filhos diretos desta rota.
    - **Sintaxe de Uso:** `route.children`

---

### Cenários de Restrição ou Não Aplicação

Embora o `RouterStateSnapshot` seja extremamente útil, há situações em que ele pode não ser a melhor escolha ou onde outras abordagens são mais adequadas:

1. **Reatividade a Mudanças de Rota Pós-Navegação:** O `RouterStateSnapshot` é um **instantâneo**. Se você precisa reagir a mudanças nos parâmetros de rota, parâmetros de consulta ou fragmento *após* a navegação ter sido concluída e o componente ter sido carregado, você deve usar o `ActivatedRoute` (que é um observable).
    - **Por que não `RouterStateSnapshot`?** Ele não emitirá novos valores quando os parâmetros mudarem.
    - **Alternativa:** Injete `ActivatedRoute` no seu componente e assine os observables `params`, `paramMap`, `queryParams`, `queryParamMap`, ou `fragment`.
    
    <!-- end list -->
    
    ```tsx
    // Exemplo de uso de ActivatedRoute para reatividade
    import { Component, OnInit } from '@angular/core';
    import { ActivatedRoute } from '@angular/router';
    import { Subscription } from 'rxjs';
    
    @Component({ /* ... */ })
    export class UserDetailComponent implements OnInit {
      userId: number;
      private routeSubscription: Subscription;
    
      constructor(private route: ActivatedRoute) {}
    
      ngOnInit(): void {
        // Reage a mudanças no parâmetro 'id' da rota
        this.routeSubscription = this.route.paramMap.subscribe(params => {
          this.userId = +params.get('id');
          console.log('ID do usuário atualizado:', this.userId);
          // Buscar dados do usuário com o novo ID
        });
      }
    
      ngOnDestroy(): void {
        this.routeSubscription.unsubscribe(); // Importante para evitar vazamento de memória
      }
    }
    
    ```
    
2. **Operações de Manipulação de URL:** Se você precisa construir URLs programaticamente, o `Router` fornece métodos como `Maps` e `createUrlTree`, que são mais apropriados do que tentar construir URLs manualmente a partir de um `RouterStateSnapshot`.
3. **Acesso a Dados de Rotas Atuais em Componentes:** Embora você possa usar `RouterStateSnapshot` para depuração ou logs em qualquer lugar, para acesso reativo a dados da rota *do componente atual*, `ActivatedRoute` é a ferramenta preferencial.

---

### Componentes Chave Associados

O `RouterStateSnapshot` não opera isoladamente. Ele está intrinsecamente ligado a outros componentes do sistema de roteamento do Angular.

- `ActivatedRouteSnapshot`:
    - **Definição:** É uma representação imutável de uma rota ativada em um determinado ponto no tempo. O `RouterStateSnapshot` é, na verdade, uma árvore de `ActivatedRouteSnapshot`s, com `state.root` sendo o nó raiz dessa árvore.
    - **Uso:** Cada nó na árvore de rotas ativadas é um `ActivatedRouteSnapshot`. Ele contém informações específicas sobre *aquela* rota em particular, como seus parâmetros (`params`, `paramMap`), dados estáticos (`data`), o componente associado (`component`), e seus filhos (`children`). É o objeto que você recebe como primeiro argumento em `CanActivate`, `Resolve`, etc.
    - **Sintaxe Específica:** Conforme abordado na seção de métodos/propriedades, você acessa as propriedades como `route.paramMap.get('id')`.
- `RouterState`:
    - **Definição:** É o estado *reativo* do roteador, representando a árvore atual das rotas ativadas. Ao contrário do `RouterStateSnapshot` que é um instante, o `RouterState` é um observable que emite novos `RouterStateSnapshot`s sempre que o estado do roteador muda.
    - **Uso:** Geralmente injetado no construtor de serviços ou componentes para obter o estado *atual* do roteador e reagir a futuras mudanças. É o `state` (o segundo argumento) que você recebe nos *guards* e *resolvers*, mas encapsulado em um `Observable` ao usar `Router.events` ou o próprio `Router.routerState`.
    - **Sintaxe Específica:**
        
        ```tsx
        import { Router, RouterEvent, NavigationEnd } from '@angular/router';
        import { filter, map } from 'rxjs/operators';
        
        // Em um serviço ou componente
        constructor(private router: Router) {
          this.router.events.pipe(
            filter((e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd),
            map(() => this.router.routerState.snapshot) // Obtém o RouterStateSnapshot do RouterState atual
          ).subscribe(snapshot => {
            console.log('RouterStateSnapshot atual após navegação:', snapshot.url);
          });
        }
        
        ```
        
- `ActivatedRoute`:
    - **Definição:** É um serviço injetável que contém informações sobre a rota associada ao componente que o injeta. Diferente de `ActivatedRouteSnapshot` que é um instantâneo, `ActivatedRoute` é um observable e pode emitir novos valores se os parâmetros da rota mudarem *sem* uma recarga completa do componente (por exemplo, navegando de `/users/1` para `/users/2` dentro do mesmo componente).
    - **Uso:** Usado dentro de componentes para acessar os parâmetros da URL, parâmetros de consulta, fragmento e dados da rota *do componente atual* de forma reativa.
    - **Sintaxe Específica:**
        
        ```tsx
        import { ActivatedRoute } from '@angular/router';
        // ...
        constructor(private route: ActivatedRoute) {
          this.route.paramMap.subscribe(params => {
            console.log('Parâmetro ID:', params.get('id'));
          });
          this.route.queryParams.subscribe(queryParams => {
            console.log('Query params:', queryParams);
          });
        }
        
        ```
        
- `UrlSegment`:
    - **Definição:** Representa um segmento de caminho em uma URL. Uma URL é dividida em vários `UrlSegment`s, cada um contendo o caminho e os parâmetros da matriz (os parâmetros `key=value` que aparecem após um `;` dentro do segmento do caminho, como `/users;id=123/profile`).
    - **Uso:** Raramente manipulado diretamente, mas é parte da estrutura de `ActivatedRouteSnapshot.url`. É mais comum acessar os parâmetros de rota via `paramMap`.
    - **Sintaxe Específica:** Você acessa um array de `UrlSegment`s via `route.url`. Cada `UrlSegment` tem propriedades como `path` e `parameters`.

---

### Melhores Práticas e Padrões de Uso

1. **Priorize `paramMap` e `queryParamMap`:** Sempre que possível, use `paramMap` e `queryParamMap` em vez de `params` e `queryParams`. Eles fornecem uma API mais segura e eficiente, especialmente para acessar parâmetros que podem não existir (evitando erros `null` ou `undefined`).
2. **Imutabilidade para Decisões de Navegação:** O fato de `RouterStateSnapshot` ser imutável é uma de suas maiores forças. Confie nele para tomar decisões consistentes em seus *guards* e *resolvers*, pois o estado não será alterado durante o processo de ativação da rota.
3. **Guards Leves e Focados:** Mantenha seus *guards* e *resolvers* o mais leves possível. Evite lógica de negócio complexa dentro deles. Se precisar de dados complexos, use *resolvers* para buscá-los e, em seguida, os *guards* para verificar permissões ou estados com base nesses dados resolvidos.
4. **Use `RouterStateSnapshot` para "Pre-Checks":** Ele é ideal para verificar condições ou buscar dados *antes* que um componente seja carregado. Pense nele como uma fase de "pré-processamento" da rota.
5. **Use `ActivatedRoute` para Reatividade em Componentes:** Para qualquer lógica que precise reagir a mudanças nos parâmetros da rota *depois* que um componente foi carregado e exibido (por exemplo, se o usuário navegar entre sub-rotas sem recarregar o componente pai), use o `ActivatedRoute` injetado no componente.
6. **Cuidado com a Árvore de Rotas:** Ao trabalhar com `state.root` e percorrer a árvore de `ActivatedRouteSnapshot`s, esteja ciente da estrutura de suas rotas no `RouterModule.forRoot` ou `RouterModule.forChild`. Entender essa hierarquia é crucial para acessar as informações corretas.
7. **Tratamento de Erros em Resolvers:** Se um *resolver* falhar (por exemplo, a chamada da API retorna um erro), você pode impedir a navegação retornando um observable que emite um erro ou um `UrlTree` para redirecionar.

---

### Exemplo Prático Completo: Carregando Dados de Usuário com Resolver

Vamos expandir o exemplo do `UserResolver` e mostrar como os dados resolvidos são acessados no componente.

**1. Definir o resolvedor (`user.resolver.ts`):**

```tsx
// src/app/users/user.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | null> { // Pode retornar null se não encontrar

  constructor() {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User | null> {
    const userId = route.paramMap.get('id'); // ID da rota atual
    const userRoleFilter = state.queryParams['roleFilter']; // Query param do RouterStateSnapshot

    console.log(`[UserResolver] Buscando usuário ${userId} com filtro de role: ${userRoleFilter}. URL completa: ${state.url}`);

    // Simula uma chamada de API para buscar o usuário
    return of({
      id: Number(userId),
      name: `Usuário Teste ${userId}`,
      email: `user${userId}@example.com`,
      role: userRoleFilter || 'guest' // Aplica o filtro ou define um padrão
    }).pipe(
      delay(1500), // Simula um atraso de rede
      tap(user => {
        if (!user) {
          console.warn(`[UserResolver] Usuário com ID ${userId} não encontrado.`);
        } else {
          console.log(`[UserResolver] Dados do usuário ${user.id} carregados:`, user);
        }
      })
    );
  }
}

```

**2. Configurar as rotas (`app-routing.module.ts`):**

```tsx
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UserResolver } from './users/user.resolver';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'users/:id', // Rota com um parâmetro 'id'
    component: UserDetailComponent,
    resolve: {
      userData: UserResolver // 'userData' é a chave que o componente usará para acessar os dados
    }
  },
  { path: '**', redirectTo: '' } // Redireciona rotas não encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

**3. Criar o componente que exibirá os dados (`user-detail.component.ts` e `.html`):**

```tsx
// src/app/users/user-detail/user-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user.resolver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Acessa os dados resolvidos pela chave 'userData' definida na configuração da rota
    this.user$ = this.route.data.pipe(
      map(data => data['userData'] as User | null)
    );
    // Note: this.route.data é um Observable que emite os dados resolvidos
  }
}

```

```html
<div>
  <h2>Detalhes do Usuário</h2>

  <ng-container *ngIf="user$ | async as user; else loading">
    <div *ngIf="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Nome:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Função:</strong> {{ user.role }}</p>
    </div>
    <div *ngIf="!user">
      <p>Usuário não encontrado.</p>
    </div>
  </ng-container>

  <ng-template #loading>
    <p>Carregando dados do usuário...</p>
  </ng-template>

  <button (click)="navigateToUser(1)">Ir para Usuário 1 (Mesmo Componente)</button>
  <button (click)="navigateToUser(2)">Ir para Usuário 2 (Mesmo Componente)</button>
</div>

```

```tsx
// (Opcional) Adicione no UserDetailComponent para mostrar a reatividade:
import { Router } from '@angular/router'; // Importar Router

// Dentro da classe UserDetailComponent
constructor(private route: ActivatedRoute, private router: Router) { } // Injetar Router

navigateToUser(id: number): void {
  this.router.navigate(['/users', id], { queryParams: { roleFilter: 'admin' } });
}

```

**Explicação do Exemplo:**

1. O `UserResolver` é executado antes que o `UserDetailComponent` seja instanciado.
2. No `resolve` do `UserResolver`, usamos `route.paramMap.get('id')` para obter o `id` da rota e `state.queryParams['roleFilter']` para obter um parâmetro de consulta de todo o estado do roteador (`RouterStateSnapshot`).
3. O `resolve` retorna um `Observable` que simula uma chamada de API, atrasando a resposta em 1.5 segundos.
4. No `app-routing.module.ts`, configuramos a rota `/users/:id` para usar o `UserResolver` sob a chave `userData`.
5. No `UserDetailComponent`, injetamos `ActivatedRoute`. Usamos `this.route.data.pipe(map(data => data['userData']))` para acessar os dados que foram resolvidos. Como `route.data` é um `Observable`, podemos usar o pipe `async` no template para desempacotar os dados.
6. Ao navegar para `/users/1` ou `/users/2?roleFilter=admin`, você verá o "Carregando dados do usuário..." por 1.5 segundos, e então os dados do usuário serão exibidos. O `roleFilter` é acessado pelo resolver através do `RouterStateSnapshot`.

---

Espero que esta explicação detalhada, Gedê, ajude você a dominar o `RouterStateSnapshot` no Angular\! Ele é uma ferramenta poderosa quando você precisa de uma visão completa e imutável do estado do roteador antes de uma navegação ser concluída.

Se tiver mais alguma dúvida ou quiser explorar cenários específicos, é só chamar\!