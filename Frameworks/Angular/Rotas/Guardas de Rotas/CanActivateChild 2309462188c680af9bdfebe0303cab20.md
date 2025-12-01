# CanActivateChild

Claro, Gedê\! A.R.I.A. está pronta para te dar uma explicação detalhada sobre `CanActivateChild` no Angular. Você me pediu para focar na explicação detalhada e completa, abordando todos os métodos e propriedades, e incluindo um exemplo prático. Vamos lá\!

---

# Guarda de Rotas no Angular: Desvendando o `CanActivateChild`

## Introdução

No desenvolvimento de aplicações modernas, a **segurança** e o **controle de acesso** são pilares fundamentais. Imagine uma aplicação com diversas seções, algumas acessíveis a todos, outras apenas a usuários logados, e algumas ainda mais restritas, como áreas administrativas. Como garantir que um usuário só acesse o que realmente tem permissão? É aqui que as **guardas de rotas** (Route Guards) do Angular entram em cena. Elas são classes que implementam uma interface específica e podem decidir se uma navegação para uma rota é permitida, impedida ou redirecionada.

Entre as diversas guardas, o `CanActivateChild` possui um papel muito específico e poderoso: ele controla o acesso às **rotas filhas** de uma rota pai. Isso significa que, em vez de aplicar a lógica de permissão em cada rota filha individualmente, você pode definir uma única guarda na rota pai que será avaliada para todas as suas filhas. Isso centraliza a lógica de autorização e evita duplicação de código, tornando a gestão de permissões mais eficiente e legível.

## Sumário

Nesta explicação, vamos abordar os seguintes pontos para você entender profundamente o `CanActivateChild`:

- **Conceitos Fundamentais:** Entender o que são guardas de rotas, a importância do `CanActivateChild` e seu propósito.
- **Sintaxe Detalhada e Uso Prático:** Como implementar e configurar o `CanActivateChild` no seu módulo de roteamento.
- **Métodos/Propriedades:** Análise do método `canActivateChild` e seus parâmetros.
- **Cenários de Restrição ou Não Aplicação:** Quando o `CanActivateChild` não é a melhor escolha.
- **Componentes Chave Associados:** Detalhes sobre as interfaces e tipos envolvidos.
- **Melhores Práticas e Padrões de Uso:** Dicas para usar o `CanActivateChild` de forma eficaz.
- **Exemplo Prático Completo:** Um cenário ponta a ponta para ilustrar seu uso.

---

## Conceitos Fundamentais

### O que são Guardas de Rotas?

As **guardas de rotas** no Angular são classes que implementam interfaces específicas para controlar o acesso a rotas. Elas são executadas antes que uma rota seja ativada ou desativada, ou antes que o carregamento de módulos com carregamento tardio (lazy-loading) seja permitido. Isso permite que você implemente lógicas de autenticação, autorização, salvamento de dados, etc., antes que a navegação ocorra.

As principais interfaces de guardas de rotas são:

- `CanActivate`: Controla se uma rota pode ser ativada.
- `CanActivateChild`: Controla se as rotas filhas de uma rota podem ser ativadas.
- `CanDeactivate`: Controla se a navegação pode sair de uma rota.
- `Resolve`: Permite buscar dados antes que uma rota seja ativada.
- `CanLoad`: Controla se um módulo com carregamento tardio pode ser carregado.

### A Importância e Propósito do `CanActivateChild`

O `CanActivateChild` é crucial para gerenciar permissões em aplicações com **estruturas de rotas aninhadas**. Em vez de adicionar uma guarda `CanActivate` a cada rota filha individualmente, você pode definir uma única guarda `CanActivateChild` na rota pai. Essa guarda será executada **antes que qualquer rota filha seja ativada**.

**Propósito:**

- **Centralização da Lógica de Autorização:** Evita a repetição de código de autorização em várias rotas filhas.
- **Consistência nas Permissões:** Garante que todas as rotas filhas sob um determinado caminho pai sigam a mesma lógica de acesso.
- **Facilidade de Manutenção:** Alterações na lógica de permissão precisam ser feitas em apenas um local (a guarda da rota pai), em vez de em várias rotas filhas.
- **Performance:** Em alguns cenários, pode otimizar a verificação de permissões, especialmente se a lógica for complexa e precisar ser executada apenas uma vez para o grupo de rotas filhas.

---

## Sintaxe Detalhada e Uso Prático

Para usar o `CanActivateChild`, você precisa seguir dois passos principais:

1. **Criar uma Classe de Guarda:** Esta classe deve implementar a interface `CanActivateChild` e, consequentemente, o método `canActivateChild`.
2. **Configurar a Guarda no Módulo de Roteamento:** Adicionar a guarda à propriedade `canActivateChild` de uma rota pai no seu `AppRoutingModule` ou em um módulo de roteamento de feature.

### 1\. Criando a Classe de Guarda

Vamos criar um serviço de guarda que simula uma verificação de permissão.

```tsx
// src/app/guards/auth-child.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Torna o serviço disponível em toda a aplicação
})
export class AuthChildGuard implements CanActivateChild {
  constructor(private router: Router) {}

  // O método canActivateChild é o coração da nossa guarda
  canActivateChild(
    childRoute: ActivatedRouteSnapshot, // Snapshot da rota filha que está sendo ativada
    state: RouterStateSnapshot // Estado atual do roteador
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // --- Lógica de Permissão ---
    // Exemplo: Simula se o usuário tem permissão para acessar rotas filhas
    const hasPermission = true; // Neste exemplo, sempre permitimos o acesso.
    // Em um cenário real, você verificaria um serviço de autenticação,
    // roles de usuário, etc.

    if (hasPermission) {
      console.log(
        'AuthChildGuard: Permissão concedida para rota filha:',
        childRoute.url.join('/')
      );
      return true; // Permite a ativação da rota filha
    } else {
      console.log(
        'AuthChildGuard: Permissão NEGADA para rota filha:',
        childRoute.url.join('/')
      );
      // Redireciona para uma página de acesso negado ou login
      alert('Acesso negado às rotas filhas!');
      return this.router.createUrlTree(['/acesso-negado']); // Redireciona
    }
  }
}

```

### 2\. Configurando a Guarda no Módulo de Roteamento

Agora, vamos aplicar esta guarda em uma rota pai no nosso `app-routing.module.ts`.

```tsx
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthChildGuard } from './guards/auth-child.guard'; // Importe a guarda
import { AccessDeniedComponent } from './components/access-denied/access-denied.component'; // Página de acesso negado

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'admin', // Esta é a rota pai
    // canActivateChild aplica a guarda a TODAS as rotas filhas de 'admin'
    canActivateChild: [AuthChildGuard], // Aqui você adiciona a guarda
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'settings', component: SettingsComponent,
        children: [ // rotas filhas aninhadas também são protegidas pelo canActivateChild da rota pai 'admin'
          { path: 'profile', component: ProfileComponent }
        ]
      },
    ],
  },
  { path: 'acesso-negado', component: AccessDeniedComponent },
  { path: '**', redirectTo: '/dashboard' }, // Rota curinga para caminhos não encontrados
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

```

Com essa configuração, sempre que você tentar navegar para `/admin/users`, `/admin/products`, `/admin/settings`, ou até mesmo `/admin/settings/profile`, o método `canActivateChild` do `AuthChildGuard` será executado.

---

## Métodos/Propriedades

A interface `CanActivateChild` possui apenas um método obrigatório:

### `canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree`

- **Conceito:** Este método é o coração da guarda `CanActivateChild`. Ele é invocado pelo roteador do Angular **antes que qualquer rota filha de uma rota pai configurada seja ativada**. Sua responsabilidade é determinar se a navegação para a rota filha específica é permitida.
- **Parâmetros:**
    - `childRoute: ActivatedRouteSnapshot`:
        - **Conceito:** É um "snapshot" (uma fotografia) da rota que está sendo ativada (a rota filha). Contém informações estáticas sobre a rota, como os **parâmetros da rota**, os **dados definidos na configuração da rota**, e a **árvore de URLs da rota**.
        - **Uso:** Você pode acessar dados como `childRoute.params`, `childRoute.queryParams`, `childRoute.data` para tomar decisões de autorização mais refinadas. Por exemplo, verificar se um usuário tem permissão para editar um produto específico com base no `id` do produto na URL.
    - `state: RouterStateSnapshot`:
        - **Conceito:** Representa o estado completo do roteador no momento em que a guarda é verificada. Ele fornece a "foto" da árvore de URLs inteira do roteador.
        - **Uso:** Geralmente, `state.url` é o mais útil, pois retorna a URL completa que o usuário está tentando acessar. Isso pode ser útil para logar tentativas de acesso ou para redirecionar para uma página de login com um parâmetro de `returnUrl`.
- **Valores de Retorno Possíveis:** O método `canActivateChild` pode retornar um dos seguintes tipos, que determinam o comportamento da navegação:
    - `boolean`:
        - `true`: A navegação para a rota filha é **permitida**.
        - `false`: A navegação para a rota filha é **impedida**. Se `false` for retornado, a navegação é cancelada e o roteador permanece na URL anterior.
    - `UrlTree`:
        - **Conceito:** Representa uma árvore de URLs, que pode ser construída usando `this.router.createUrlTree(['/some-path'])`.
        - **Uso:** Se você retornar um `UrlTree`, a navegação para a rota filha atual será **cancelada**, e o roteador **redirecionará** para a URL especificada no `UrlTree`. Isso é comumente usado para redirecionar usuários não autenticados para uma página de login ou para uma página de acesso negado.
    - `Observable<boolean | UrlTree>`:
        - **Conceito:** Um Observable que eventualmente resolve para um `boolean` ou `UrlTree`.
        - **Uso:** Ideal para operações assíncronas, como fazer uma requisição HTTP para um servidor de autenticação/autorização, ou esperar o resultado de um serviço de verificação de permissões que retorna um Observable. A navegação aguardará a emissão do Observable.
    - `Promise<boolean | UrlTree>`:
        - **Conceito:** Uma Promise que eventualmente resolve para um `boolean` ou `UrlTree`.
        - **Uso:** Similar ao Observable, usado para operações assíncronas que retornam uma Promise, como chamadas de API baseadas em Promises.

**Importante:** Ao retornar `false` ou um `UrlTree`, a navegação é abortada ou redirecionada, respectivamente, e as rotas filhas subsequentes na hierarquia (se houver) não serão avaliadas por esta guarda.

---

## Cenários de Restrição ou Não Aplicação

Embora o `CanActivateChild` seja muito útil, há situações em que ele pode não ser a melhor escolha ou onde outras guardas são mais apropriadas:

- **Lógica de Autorização Diferente para Cada Rota Filha:** Se cada rota filha exigir uma lógica de autorização completamente distinta e complexa (que não pode ser parametrizada facilmente pelo `childRoute.data` ou `childRoute.params`), pode ser mais claro e gerenciável usar `CanActivate` individualmente em cada rota filha, ou criar guardas `CanActivate` específicas para cada caso.
- **Controle de Acesso à Rota Pai em Si:** O `CanActivateChild` não controla o acesso à rota pai. Se você precisa garantir que o usuário só possa acessar a rota pai se atender a certos critérios, você deve usar `CanActivate` na rota pai.
    - **Exemplo:** Se a rota `/admin` em si (sem filhos) também precisa de proteção, você faria:
        
        ```tsx
        {
          path: 'admin',
          component: AdminRootComponent, // Um componente para a rota pai
          canActivate: [AdminGuard], // Guarda para a rota pai
          canActivateChild: [AuthChildGuard], // Guarda para as rotas filhas
          children: [ /* ... */ ]
        }
        
        ```
        
- **Carregamento de Módulos Lazy-Loaded:** Se você estiver usando carregamento tardio (lazy-loading) para seus módulos e quiser controlar se um módulo inteiro pode ser carregado, a guarda `CanLoad` é a mais indicada. O `CanActivateChild` só é acionado *após* o módulo pai ser carregado.
    - **Exemplo:** Se o módulo `AdminModule` é lazy-loaded:
        
        ```tsx
        {
          path: 'admin',
          loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
          canLoad: [AdminModuleLoadGuard] // Controla o carregamento do módulo
        }
        
        ```
        
- **Desativação de Rotas (`CanDeactivate`):** Se a sua necessidade é verificar se o usuário pode *sair* de uma rota (por exemplo, para evitar a perda de dados de um formulário não salvo), a guarda `CanDeactivate` é a ferramenta correta.
- **Resolução de Dados (`Resolve`):** Se você precisa buscar dados antes que uma rota seja ativada para que o componente já tenha os dados ao inicializar, a guarda `Resolve` é a ideal.

---

## Componentes Chave Associados

Além da própria interface `CanActivateChild` e do método `canActivateChild`, os seguintes componentes são cruciais para o seu funcionamento e para a lógica dentro da guarda:

- **`@Injectable()` Decorator:**
    - **Conceito:** É um decorador que marca uma classe como disponível para injeção de dependências.
    - **Uso:** Todas as suas classes de guarda devem ser decoradas com `@Injectable()`. Isso permite que o Angular as injete no seu módulo de roteamento e, mais importante, que você possa injetar outros serviços (como `Router`, `AuthService`, etc.) dentro da sua guarda. O `providedIn: 'root'` garante que o serviço seja um singleton e esteja disponível em toda a aplicação.
- **`Router` Class:**
    - **Conceito:** O serviço `Router` do Angular fornece a API para navegar programaticamente, inspecionar o estado da URL e interagir com o roteador.
    - **Uso:** Frequentemente injetado nas guardas (como `private router: Router` no construtor) para permitir redirecionamentos programáticos usando `this.router.navigate(['/some-path'])` ou `this.router.createUrlTree(['/some-path'])`. O `createUrlTree` é particularmente útil para retornar um `UrlTree` do método `canActivateChild`.
- **`ActivatedRouteSnapshot` Class:**
    - **Conceito:** Representa uma "foto" imutável da rota ativa em um determinado momento. Contém os parâmetros, dados e segmentos da URL para aquela rota específica.
    - **Uso:** É o primeiro parâmetro do método `canActivateChild`. Você o usa para obter informações da rota filha que está prestes a ser ativada.
        - `childRoute.params`: Um objeto que contém os parâmetros de rota dinâmicos (ex: `/users/:id` -\> `id` estaria em `params`).
        - `childRoute.queryParams`: Um objeto que contém os parâmetros de consulta da URL (ex: `/users?page=1` -\> `page` estaria em `queryParams`).
        - `childRoute.data`: Um objeto que contém dados estáticos definidos na configuração da rota (ex: `{ path: 'users', component: UsersComponent, data: { role: 'admin' } }`).
- **`RouterStateSnapshot` Class:**
    - **Conceito:** Uma "foto" imutável da árvore de estados do roteador no momento da navegação. Inclui o estado da rota raiz e de todas as suas rotas filhas.
    - **Uso:** É o segundo parâmetro do método `canActivateChild`. O mais comum é usar `state.url` para obter a URL completa que o usuário tentou acessar.
- **`UrlTree` Class:**
    - **Conceito:** Uma estrutura de dados que representa uma URL do roteador como uma árvore.
    - **Uso:** Usado em conjunto com `router.createUrlTree()` para criar uma URL para a qual o roteador deve redirecionar, caso a guarda decida negar o acesso.
- **`Observable` / `Promise` (do RxJS e JavaScript):**
    - **Conceito:** Tipos para lidar com operações assíncronas.
    - **Uso:** Permitem que a guarda espere por um resultado de uma chamada de API (por exemplo, para verificar o token de autenticação ou as permissões do usuário em um backend) antes de decidir se a navegação é permitida. Se o Observable ou Promise emitir `true`, a navegação continua; se emitir `false` ou um `UrlTree`, a navegação é interrompida ou redirecionada.

---

## Melhores Práticas e Padrões de Uso

Ao usar o `CanActivateChild`, considere as seguintes melhores práticas:

1. **Mantenha a Lógica Simples e Focada:** Uma guarda deve ter uma única responsabilidade. Se a lógica de autorização se tornar muito complexa, considere dividi-la em serviços separados que a guarda pode injetar e chamar.
2. **Injete Dependências Necessárias:** Use a injeção de dependências para obter serviços (como serviços de autenticação, serviços de usuário, etc.) dentro da sua guarda.
3. **Lide com Cenários Assíncronos:** Use `Observable` ou `Promise` se precisar fazer chamadas assíncronas (e.g., API calls) para verificar permissões. Certifique-se de que o Observable/Promise seja concluído (`complete()`) e emita um valor (`true`, `false`, ou `UrlTree`).
4. **Redirecione Apropriadamente:** Se um usuário não tiver permissão, redirecione-o para uma página de login, uma página de acesso negado ou a página inicial, usando `this.router.createUrlTree()` ou `this.router.navigate()`.
5. **Forneça Feedback ao Usuário:** Se o acesso for negado, informe o usuário de alguma forma (mensagem, alerta, redirecionamento para uma página explicativa).
6. **Use Dados da Rota (`data` e `params`):** Aproveite `childRoute.data` e `childRoute.params` para passar informações adicionais para a guarda e tomar decisões de autorização mais dinâmicas. Por exemplo, você pode definir um `role` mínimo na configuração da rota e verificar isso na guarda.
    
    ```tsx
    // Configuração da rota
    {
      path: 'products',
      component: ProductsComponent,
      data: { requiredRole: 'editor' } // Dados da rota
    }
    
    // Na guarda:
    const requiredRole = childRoute.data['requiredRole'];
    // ... lógica para verificar se o usuário tem o 'requiredRole'
    
    ```
    
7. **Combine com Outras Guardas:** Você pode combinar `CanActivateChild` com `CanActivate` na mesma rota pai se precisar de proteção tanto para a rota pai quanto para suas filhas.
8. **Testes Unitários:** Escreva testes unitários para suas guardas para garantir que a lógica de autorização funcione conforme o esperado em diferentes cenários (permissão concedida, negada, redirecionamento).

---

## Exemplo Prático Completo

Vamos expandir nosso exemplo para incluir um serviço de autenticação e usar os `data` da rota para verificar permissões mais detalhadamente.

### 1\. Serviço de Autenticação (`auth.service.ts`)

```tsx
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

interface User {
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    // Simula um usuário logado com certas roles
    const mockUser: User = { username: 'gededeveloper', roles: ['admin', 'editor'] };
    this.currentUserSubject.next(mockUser);
  }

  // Simula login
  login(username: string, password: string): Observable<boolean> {
    console.log(`Tentando login para ${username}...`);
    // Em um cenário real, faria uma requisição HTTP
    return of(true).pipe(
      delay(1000), // Simula latência da rede
      tap(() => {
        const user: User = { username: username, roles: ['user', 'editor'] };
        if (username === 'admin') {
          user.roles.push('admin');
        }
        this.currentUserSubject.next(user);
        console.log('Login bem-sucedido. Usuário:', user);
      })
    );
  }

  // Simula logout
  logout(): void {
    this.currentUserSubject.next(null);
    console.log('Usuário deslogado.');
  }

  // Verifica se o usuário está logado
  isLoggedIn(): Observable<boolean> {
    return this.currentUser.pipe(
      tap(user => console.log('isLoggedIn check:', !!user)),
      delay(500), // Simula latência
      // O of(!!user) garante que o observable sempre emita um valor,
      // para que a guarda possa prosseguir.
      // O take(1) garantiria que a guarda não espere por mais emissões,
      // mas para este exemplo, não é estritamente necessário se o BehaviorSubject é único.
      // Poderíamos usar first() também, se quisermos apenas o primeiro valor.
    );
  }

  // Verifica se o usuário tem uma determinada role
  hasRole(role: string): Observable<boolean> {
    return this.currentUser.pipe(
      delay(500), // Simula latência
      tap(user => console.log(`Checking role '${role}' for user:`, user?.roles.includes(role))),
      // Certifica-se de que o observable sempre emita um valor
      // O of() embrulha o resultado em um observable.
      // Poderíamos usar map se quisermos transformar o valor do observable.
      // Ex: map(user => !!user && user.roles.includes(role))
    ).pipe(
        delay(500),
        // Adiciona um operador para transformar o valor do observable
        // do BehaviorSubject para o valor booleano esperado pelo hasRole.
        // O of() é para o caso de um valor síncrono, mas aqui já temos um observable.
        // Usar map é a forma mais idiomática com observables.
        // O !!user garante que user não seja nulo.
        map(user => !!user && user.roles.includes(role)),
        first() // Emite o primeiro valor e completa o observable
      );
  }
}

```

### 2\. Guarda de Autorização com `data` da Rota (`permission-child.guard.ts`)

```tsx
// src/app/guards/permission-child.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Importe o serviço de autenticação

@Injectable({
  providedIn: 'root',
})
export class PermissionChildGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // 1. Verificar se o usuário está logado (operação assíncrona)
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          console.warn('PermissionChildGuard: Usuário não logado. Redirecionando para /login.');
          return this.router.createUrlTree(['/login']); // Redireciona para a página de login
        }

        // 2. Se logado, verificar permissões com base nos dados da rota
        const requiredRole = childRoute.data['requiredRole'] as string;
        console.log(
          `PermissionChildGuard: Rota filha "${childRoute.url.join('/')}" requer role: "${requiredRole || 'Nenhuma'}"`
        );

        if (requiredRole) {
          // Se uma role for necessária, verifica se o usuário a possui (operação assíncrona)
          return this.authService.hasRole(requiredRole).pipe(
            map((hasRole) => {
              if (hasRole) {
                console.log(`PermissionChildGuard: Acesso permitido para ${childRoute.url.join('/')} (role '${requiredRole}')`);
                return true;
              } else {
                console.warn(`PermissionChildGuard: Acesso negado para ${childRoute.url.join('/')}. Requer role: '${requiredRole}'`);
                alert(`Você não tem permissão para acessar esta página. Requer a role: ${requiredRole}`);
                return this.router.createUrlTree(['/acesso-negado']);
              }
            }),
            catchError((error) => {
              console.error('Erro ao verificar permissão:', error);
              return of(this.router.createUrlTree(['/erro'])); // Redireciona para uma página de erro
            })
          );
        } else {
          // Nenhuma role específica necessária, permite acesso
          console.log(`PermissionChildGuard: Acesso permitido para ${childRoute.url.join('/')} (sem role específica)`);
          return true;
        }
      }),
      catchError((error) => {
        console.error('Erro na guarda de permissão (isLoggedIn check):', error);
        return of(this.router.createUrlTree(['/erro'])); // Redireciona para uma página de erro
      })
    ).pipe(
      // O flatMap (ou mergeMap) é essencial aqui para lidar com o Observable aninhado
      // que vem de `this.authService.hasRole(requiredRole)`.
      // Ele "achata" o Observable de Observable para um único Observable.
      mergeMap(result => (result instanceof Observable ? result : of(result)))
    );
  }
}

```

**Observação sobre o `mergeMap`**: No exemplo acima, a lógica dentro do primeiro `map` pode retornar um `boolean` ou um `Observable<boolean | UrlTree>`. Quando retorna um `Observable`, precisamos de um operador como `mergeMap` (ou `switchMap`, `concatMap`, `exhaustMap` dependendo do comportamento desejado) para "achatar" esses Observables aninhados em um único Observable que a guarda pode subscrever. O `of(result)` é para garantir que mesmo quando um `boolean` ou `UrlTree` é retornado diretamente, ele seja tratado como um Observable para consistência com o `mergeMap`.

### 3\. Configuração das Rotas no `app-routing.module.ts`

```tsx
// src/app/app-routing.module.ts (trecho)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component'; // Nova página de erro

import { PermissionChildGuard } from './guards/permission-child.guard'; // Importe a nova guarda

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'acesso-negado', component: AccessDeniedComponent },
  { path: 'erro', component: ErrorComponent },
  {
    path: 'admin', // Esta é a rota pai
    canActivateChild: [PermissionChildGuard], // Aplica a guarda a TODAS as rotas filhas
    children: [
      {
        path: 'users',
        component: UsersComponent,
        data: { requiredRole: 'admin' }, // Rota de usuários requer role 'admin'
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: { requiredRole: 'editor' }, // Rota de produtos requer role 'editor'
      },
      {
        path: 'settings',
        component: SettingsComponent,
        // Não requer role específica para 'settings', mas suas filhas podem ter
        children: [
          {
            path: 'profile',
            component: ProfileComponent,
            data: { requiredRole: 'user' }, // Perfil requer apenas role 'user'
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

```

### Exemplo de Componentes Simples (apenas para demonstração)

Crie componentes vazios para `DashboardComponent`, `UsersComponent`, `ProductsComponent`, `SettingsComponent`, `ProfileComponent`, `LoginComponent`, `AccessDeniedComponent`, e `ErrorComponent` para que o exemplo funcione.

```tsx
// Exemplo: src/app/components/users/users.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  template: `<h2>Gestão de Usuários</h2><p>Conteúdo da página de usuários (requer ADMIN).</p>`,
  styles: [],
})
export class UsersComponent {}

// E assim por diante para os outros componentes...

```

### Cenário de Teste:

- **Usuário Mock (Inicial):** `gededeveloper` com roles `['admin', 'editor']`.
    - Navegar para `/admin/users`: **Permitido** (tem `admin` role).
    - Navegar para `/admin/products`: **Permitido** (tem `editor` role).
    - Navegar para `/admin/settings/profile`: **Permitido** (tem `user` role, pois `admin` e `editor` são `user` também).
- **Se o `AuthService` fosse modificado para um usuário sem role 'admin' (ex: apenas 'editor'):**
    - Navegar para `/admin/users`: **NEGADO** (redireciona para `/acesso-negado` e alerta).
    - Navegar para `/admin/products`: **Permitido**.

---

Com este exemplo, Gedê, você pode ver como o `CanActivateChild` centraliza a lógica de permissão para grupos de rotas, utilizando dados da rota e chamadas assíncronas para um serviço de autenticação. Isso torna sua aplicação mais robusta e sua gestão de permissões muito mais organizada.

Se tiver mais alguma dúvida ou quiser explorar outro tópico, A.R.I.A. está à disposição\!