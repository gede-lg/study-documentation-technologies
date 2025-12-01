# Rotas com Standalone Components

---

### **Introdução**

Com a introdução das Standalone APIs a partir do Angular v14 e sua consolidação nas versões seguintes, a forma como estruturamos e gerenciamos aplicações mudou drasticamente. Uma das áreas mais impactadas e simplificadas foi o sistema de roteamento. A abordagem moderna, livre de `NgModules`, utiliza funções e provedores que tornam a configuração de rotas mais intuitiva, declarativa e eficiente. Este guia detalha tudo o que você precisa saber para configurar e gerenciar rotas em uma aplicação Angular moderna utilizando exclusivamente Standalone Components.

---

### **Sumário**

Esta explicação abordará a transição do roteamento baseado em `NgModule` para a nova API standalone. Iniciaremos com os conceitos que fundamentam essa abordagem, detalhando os benefícios como a redução de boilerplate e a melhoria no tree-shaking. Em seguida, exploraremos a sintaxe de configuração de rotas, dissecando exaustivamente cada propriedade do objeto `Route` e cada função de configuração do `provideRouter`. Por fim, discutiremos as melhores práticas, restrições de uso, elementos associados (como diretivas e services) e apresentaremos um exemplo prático completo.

---

### **Conceitos Fundamentais**

O pilar da nova abordagem de roteamento é a eliminação da necessidade do `RouterModule`. Em aplicações baseadas em `NgModule`, era comum termos um `AppRoutingModule` com `RouterModule.forRoot(routes)` e múltiplos `FeatureRoutingModule` com `RouterModule.forChild(routes)`. Essa estrutura, embora funcional, adicionava uma camada de complexidade e boilerplate.

**O Propósito da Mudança:**

1. **Simplificação:** A configuração das rotas é centralizada e feita através de funções simples, como `provideRouter`, diretamente no bootstrap da aplicação (`main.ts`) ou em arquivos de rota dedicados.
2. **Redução de Boilerplate:** Fim da necessidade de criar módulos (`@NgModule`) apenas para configurar rotas de uma funcionalidade.
3. **Tree-Shaking Aprimorado:** As funcionalidades do roteador (como preloading, debug tracing, etc.) são agora "opt-in" e providas através de funções. Se você não usa uma funcionalidade, ela não é incluída no bundle final da sua aplicação, resultando em um código mais leve.
4. **Lazy Loading Intuitivo:** O carregamento tardio (lazy loading) de componentes e suas rotas filhas tornou-se mais direto, usando as propriedades `loadComponent` e `loadChildren`.

Essencialmente, a nova API alinha o roteamento com a filosofia "standalone": os componentes são as unidades primárias, e as rotas são simplesmente uma forma de mapear URLs a esses componentes, sem a intermediação obrigatória de um `NgModule`.

---

### **Sintaxe e Uso**

A configuração fundamental do roteador em uma aplicação standalone é feita no arquivo `main.ts` (ou `app.config.ts`) ao inicializar a aplicação.

**Exemplo Básico em `main.ts`:**

```tsx
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes'; // Arquivo de rotas separado

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES) // Provê o serviço de roteamento com as rotas definidas
  ]
}).catch(err => console.error(err));

```

**Definindo as Rotas em `app.routes.ts`:**

```tsx
// app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

// Nossos componentes HomeComponent e AboutComponent devem ser standalone: true
export const APP_ROUTES: Routes = [
  {
    path: '', // Rota para a raiz da aplicação
    component: HomeComponent
  },
  {
    path: 'about', // Rota para /about
    component: AboutComponent
  },
  // Exemplo de rota com carregamento tardio (lazy loading)
  {
    path: 'products',
    // Carrega o componente apenas quando a rota for acessada
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
  }
];

```

---

### **Métodos/Propriedades (A API de Roteamento Detalhada)**

Aqui detalhamos as peças centrais da API de roteamento standalone.

### **Função Principal: `provideRouter()`**

Esta é a função que ativa o roteamento na aplicação.

- **Sintaxe:** `provideRouter(routes: Routes, ...features: RouterFeatures[])`
- **Parâmetros:**
    - `routes`: Um array de objetos `Route` que define a configuração das rotas da sua aplicação.
    - `features`: (Opcional) Funções adicionais para habilitar funcionalidades extras do roteador.

### **A Interface `Route`**

Cada objeto no array `Routes` define uma rota e seu comportamento. Vamos passar por **todas** as suas propriedades:

| Propriedade | Tipo | Descrição e Conceito |
| --- | --- | --- |
| **`path`** | `string` | O segmento de URL que corresponde a esta rota. Ex: `'users/:id'`. Pode ser vazio (`''`) para rotas padrão ou conter parâmetros (`:id`). |
| **`component`** | `Type<any>` | O componente a ser renderizado quando esta rota for ativada. Usado para **carregamento imediato** (eager loading). O componente não deve estar em `imports` se já estiver aqui. |
| **`loadComponent`** | `() => Promise<Type<any>> \| Observable<Type<any>>` | Uma função que retorna uma promessa ou um observável para o tipo do componente. Usado para **carregamento tardio** (lazy loading) de um único componente. É a forma preferencial para rotas de funcionalidades. |
| **`children`** | `Routes` | Um array de objetos `Route` para definir rotas aninhadas. Essas rotas serão renderizadas dentro do `<router-outlet>` do componente pai. Usado para agrupar rotas que carregam juntas. |
| **`loadChildren`** | `() => Promise<Routes> \| Observable<Routes>` | Similar ao `loadComponent`, mas para um conjunto de rotas filhas. Ideal para carregar um arquivo de rotas de uma funcionalidade inteira sob demanda. Ex: `() => import('./feature/feature.routes').then(m => m.FEATURE_ROUTES)`. |
| **`redirectTo`** | `string` | A URL para a qual redirecionar quando esta rota for ativada. Usado para criar redirecionamentos. |
| **`pathMatch`** | `'prefix' \| 'full'` | Define como o `path` deve ser comparado com a URL. `'full'` (padrão para redirecionamentos) exige que o caminho corresponda exatamente. `'prefix'` (padrão para outras rotas) corresponde se a URL começar com o `path`. |
| **`outlet`** | `string` | O nome do `<router-outlet>` onde este componente deve ser renderizado. O padrão é `'primary'`. Útil para rotas auxiliares (ex: modais, sidebars). |
| **`canActivate`** | `(CanActivateFn \| Type<any>)[]` | Array de guardas de rota. Se **todos** os guardas retornarem `true`, a navegação para a rota é permitida. Caso contrário, é cancelada. |
| **`canActivateChild`** | `(CanActivateChildFn \| Type<any>)[]` | Array de guardas de rota que se aplicam a **todas as rotas filhas**. |
| **`canDeactivate`** | `(CanDeactivateFn<T> \| Type<any>)[]` | Array de guardas que são executados antes de sair da rota atual. Útil para prevenir o usuário de sair de uma página com alterações não salvas. |
| **`canMatch`** | `(CanMatchFn \| Type<any>)[]` | Array de guardas que determinam se a rota pode ser usada. Se retornar `false`, o roteador continua procurando por outra rota que corresponda à URL. Útil para controle de acesso a nível de módulo/funcionalidade. |
| **`resolve`** | `{ [key: string]: ResolveFn<any> \| Type<any> }` | Um mapa de "resolvers". Permite buscar dados antes da ativação da rota. Os dados resolvidos ficam disponíveis no `ActivatedRoute.data`. |
| **`data`** | `Data` | Um objeto para passar dados estáticos para o componente da rota. Útil para passar metadados como títulos, roles, etc. Acessível via `ActivatedRoute.data`. |
| **`title`** | `string \| Type<Resolve<string>>` | Define o título da página no navegador. Pode ser um valor estático ou um resolver que retorna o título dinamicamente. |
| **`providers`** | `Provider[]` | Permite fornecer serviços específicos para a rota e seus filhos. Esses serviços estarão disponíveis para injeção apenas nos componentes renderizados por esta rota (e suas filhas), criando um injetor de dependência hierárquico. |

### **Funções de Features do Roteador (`RouterFeatures`)**

Estas funções são passadas como segundo argumento para `provideRouter` para habilitar comportamentos.

| Função | Descrição e Conceito |
| --- | --- |
| **`withComponentInputBinding()`** | Habilita a vinculação de dados da rota (parâmetros, query params, data) diretamente às propriedades `@Input()` do componente. Simplifica muito o acesso aos dados da rota, eliminando a necessidade de injetar `ActivatedRoute` para esse fim. **Altamente recomendado.** |
| **`withPreloading(strategy)`** | Configura uma estratégia de pré-carregamento para módulos/componentes de lazy loading. Ex: `PreloadAllModules` (carrega todos em background após o bootstrap) ou `QuicklinkStrategy` (carrega os visíveis na tela). |
| **`withDebugTracing()`** | Habilita o log de todos os eventos internos do roteador no console. Extremamente útil para depuração de problemas de roteamento. |
| **`withRouterConfig(config)`** | Permite passar opções de configuração extras (`ExtraOptions`), como `paramsInheritanceStrategy` (para herdar parâmetros de rotas pai) ou `onSameUrlNavigation` ('reload' ou 'ignore'). |
| **`withViewTransitions(options)`** | Habilita a API de View Transitions do navegador para animações suaves entre as transições de rota. |
| **`withInMemoryScrolling(options)`** | Configura o comportamento de rolagem da página durante a navegação. Opções incluem `scrollPositionRestoration` ('enabled' ou 'disabled') e `anchorScrolling` ('enabled' ou 'disabled'). |
| **`withHashLocation()`** | Configura o roteador para usar a estratégia de hash (`/#/`) nas URLs em vez da estratégia `PathLocationStrategy` (padrão do HTML5). |
| **`withDisabledInitialNavigation()`** | Desabilita a navegação inicial automática, que normalmente acontece logo após o bootstrap da aplicação. |
| **`withEnabledBlockingInitialNavigation()`** | Habilita a navegação inicial de forma síncrona e bloqueante. Útil para cenários de renderização no servidor (SSR). |

---

### **Restrições de Uso**

Apesar de ser a abordagem recomendada para novas aplicações, existem cenários onde a adoção pode requerer cautela:

1. **Aplicações Legadas com `NgModule`:** Em projetos grandes e antigos, migrar tudo de uma vez pode ser inviável. Uma migração gradual, convertendo funcionalidades para standalone aos poucos, é a melhor estratégia. A interoperabilidade é totalmente suportada.
2. **Bibliotecas de Terceiros Desatualizadas:** Embora raro hoje em dia, alguma biblioteca mais antiga pode ter dependências diretas de `NgModule` e esperar ser importada da maneira tradicional. Verifique sempre a compatibilidade da biblioteca com Standalone APIs.
3. **Curva de Aprendizagem da Equipe:** Para equipes acostumadas exclusivamente com `NgModule`, pode haver um período de adaptação. A simplicidade do novo modelo, no entanto, geralmente acelera esse processo.

---

### **Elementos Associados**

O sistema de roteamento não se resume apenas à sua configuração. Diversos outros elementos são essenciais para construir a navegação.

| Elemento | Tipo | Propósito e Uso |
| --- | --- | --- |
| **`<router-outlet>`** | Diretiva | Um marcador no template de um componente que indica onde o Angular deve renderizar o componente correspondente à rota ativa. Pode ter um atributo `name` para rotas auxiliares. |
| **`[routerLink]`** | Diretiva | Usada em elementos `<a>` ou botões para criar links de navegação. Ex: `<a routerLink="/users/1">User 1</a>`. A navegação é gerenciada pelo Angular, evitando um recarregamento completo da página. |
| **`routerLinkActive`** | Diretiva | Aplica classes CSS a um elemento quando o `routerLink` associado a ele está ativo. Ex: `<a routerLink="/home" routerLinkActive="active-link">Home</a>`. |
| **`Router`** | Serviço | Serviço injetável que permite a navegação programática. Uso: `constructor(private router: Router) {}` e `this.router.navigate(['/path'])`. |
| **`ActivatedRoute`** | Serviço | Serviço que contém informações sobre a rota ativa no momento, como parâmetros (`params`), query params (`queryParams`), fragmentos (`fragment`) e dados estáticos (`data`). |
| **`Routes`** | Tipo | Um alias para `Route[]`. É o tipo de dado esperado pela função `provideRouter`. |
| **`CanActivateFn`** | Tipo de Função | A assinatura de uma função guarda de ativação: `(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => boolean \| UrlTree \| Promise<...> \| Observable<...>` |
| **`ResolveFn`** | Tipo de Função | A assinatura de uma função resolver: `(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => T \| Promise<T> \| Observable<T>` |

---

### **Melhores Práticas e Casos de Uso**

1. **Estrutura de Arquivos:** Centralize suas rotas principais em um arquivo `app.routes.ts`. Para cada funcionalidade com múltiplas rotas (ex: "settings"), crie um arquivo de rotas dedicado (`settings.routes.ts`) e carregue-o via `loadChildren`.
2. **Lazy Loading por Padrão:** Use `loadComponent` ou `loadChildren` para todas as rotas que não precisam ser exibidas imediatamente. Isso mantém o bundle inicial pequeno e melhora o tempo de carregamento percebido pelo usuário.
3. **Use `withComponentInputBinding()`:** Adote esta feature para simplificar seus componentes. Em vez de injetar `ActivatedRoute` para pegar um `id`, simplesmente declare `@Input() id: string;`.
4. **Guards e Resolvers Funcionais:** Prefira a criação de guardas e resolvers como funções simples em vez de classes com `@Injectable()`. Elas são mais leves, mais fáceis de testar e compor.
5. **Rotas Tipadas (Avançado):** Para projetos maiores, considere usar bibliotecas ou técnicas para adicionar tipagem forte às suas rotas, evitando erros de digitação em `routerLink` ou `router.navigate`.

---

### **Exemplo Completo**

Vamos montar a estrutura de uma pequena aplicação com dashboard e uma seção de usuários (com detalhes).

**1. Estrutura de Arquivos:**

```
src/
├── app/
│   ├── components/
│   │   ├── not-found/not-found.component.ts
│   │   └── sidebar/sidebar.component.ts
│   ├── features/
│   │   ├── dashboard/dashboard.component.ts
│   │   └── users/
│   │       ├── user-detail/user-detail.component.ts
│   │       ├── user-list/user-list.component.ts
│   │       └── users.routes.ts  // <-- Rotas específicas de usuários
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts        // <-- Rotas principais
└── main.ts

```

**2. Configuração Principal (`app.config.ts` e `main.ts`)**

```tsx
// app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provê as rotas e habilita features recomendadas
    provideRouter(
      APP_ROUTES,
      withComponentInputBinding(),
      withViewTransitions()
    )
  ]
};

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

```

**3. Rotas Principais (`app.routes.ts`)**

```tsx
// app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const APP_ROUTES: Routes = [
  {
    path: 'dashboard',
    title: 'Meu Dashboard', // Título estático da página
    component: DashboardComponent
  },
  {
    path: 'users',
    // Carrega um arquivo inteiro de rotas filhas sob demanda
    loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES)
  },
  {
    path: '',
    redirectTo: '/dashboard', // Redireciona a raiz para o dashboard
    pathMatch: 'full'
  },
  {
    path: '**', // Rota wildcard para capturar URLs não encontradas
    component: NotFoundComponent
  }
];

```

**4. Rotas da Funcionalidade de Usuários (`users.routes.ts`)**

```tsx
// app/features/users/users.routes.ts
import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { userTitleResolver } from './user-detail/user-title.resolver'; // Um resolver funcional

export const USERS_ROUTES: Routes = [
  {
    path: '', // Rota filha: /users
    component: UserListComponent,
  },
  {
    path: ':id', // Rota filha: /users/123
    component: UserDetailComponent,
    title: userTitleResolver // Título dinâmico usando um resolver
  }
];

```

**5. Componente com `@Input()` (`user-detail.component.ts`)**

```tsx
// app/features/users/user-detail/user-detail.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [],
  template: `<h1>Detalhes do Usuário: {{ userId }}</h1>`
})
export class UserDetailComponent implements OnInit {
  // Graças ao withComponentInputBinding(), o parâmetro 'id' da URL
  // é automaticamente vinculado a esta propriedade.
  @Input('id') userId!: string;

  ngOnInit(): void {
    console.log(`Carregando dados para o usuário com ID: ${this.userId}`);
  }
}

```

**6. Componente Principal com Navegação (`app.component.ts`)**

```tsx
// app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importa RouterOutlet para renderizar as rotas e nosso sidebar
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <app-sidebar></app-sidebar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}

```

---

### **Tópicos Relacionados para Aprofundamento**

- **Estratégias Avançadas de Preloading:** Crie sua própria estratégia de pré-carregamento (ex: baseada em dados do usuário).
- **State Management e o Roteador:** Integre o roteador com bibliotecas de gerenciamento de estado como NgRx (`@ngrx/router-store`) para sincronizar o estado da rota com o store da sua aplicação.
- **Testes Unitários e de Integração para Componentes Roteados:** Aprenda a testar componentes que dependem de informações de rota usando `RouterTestingModule` e stubs.
- **Animações de Rota:** Explore o módulo `@angular/animations` para criar animações complexas de entrada e saída de componentes durante a navegação.

Espero que esta explicação super detalhada tenha esclarecido todas as suas dúvidas sobre o roteamento com Standalone Components, Gedê. É uma abordagem poderosa e elegante que certamente tornará seu trabalho como desenvolvedor Go e Java ainda mais produtivo no ecossistema Angular.

Se tiver mais alguma pergunta, pode mandar\!