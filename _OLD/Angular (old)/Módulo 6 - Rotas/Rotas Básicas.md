# Rotas no Angular

O Angular é uma plataforma poderosa e versátil para o desenvolvimento de aplicações web single-page (SPA). Uma das características fundamentais do Angular é o sistema de rotas, que permite navegar entre diferentes componentes e exibir conteúdo específico baseado na URL. Vamos detalhar os conceitos de rotas básicas, incluindo a sintaxe de uma rota básica, a estrutura do arquivo de configuração de rotas, a rota padrão e a rota 404.

## Rotas Básicas

As rotas básicas no Angular são definidas usando o objeto `Routes`, que é um array de objetos de rota. Cada objeto de rota pode ter várias propriedades, mas as principais são `path` e `component`.

### Sintaxe de uma Rota Básica (Propriedades do Objeto Routes)

Aqui está a sintaxe básica de uma rota no Angular:

```typescript
import { Routes } from '@angular/router';
import { MeuComponente } from './meu-componente/meu-componente.component';

const routes: Routes = [
  { path: 'caminho-da-rota', component: MeuComponente }
];
```

**Propriedades principais:**

- `path`: Uma string que especifica o segmento URL da rota. Quando a URL corresponde a esse caminho, o Angular seleciona a rota.

- `component`: O componente que o Angular deve criar quando navegar para esta rota.

- **`redirectTo`**: Uma string que define para qual caminho a rota deve redirecionar. É usado para rotas que não criam um componente, mas sim redirecionam para outro caminho.

- **`pathMatch`**: Define como a URL deve ser comparada com o caminho da rota. Os valores possíveis são 'full' (compara toda a URL) e 'prefix' (compara apenas o prefixo da URL).

- **`children`**: Um array de objetos `Routes` que define rotas filho. Isso permite configurar uma hierarquia de rotas.

- **`loadChildren`**: Permite definir uma rota para carregar módulos de forma lazy. Você pode passar uma função que retorne um módulo ou uma string que represente o caminho do módulo com a sintaxe de importação dinâmica.

- **`canActivate`**: Um array de serviços que serão usados como guardas de rota para decidir se a rota pode ser ativada.

- **`canActivateChild`**: Um array de serviços guardas que serão usados para decidir se as rotas filhas podem ser ativadas.

- **`canDeactivate`**: Um array de serviços guardas que decidem se o usuário pode sair da rota atual.

- **`canLoad`**: Um array de serviços guardas que decidem se um módulo pode ser carregado lazy.

- **`data`**: Um objeto de dados que pode ser injetado em componentes via `ActivatedRoute`.

- **`resolve`**: Um objeto que define dados a serem pré-carregados antes da ativação da rota. Os dados resolvidos podem ser injetados em componentes.

- **`runGuardsAndResolvers`**: Define como e quando os guardas e resolvers serão executados. Os valores podem ser 'paramsOrQueryParamsChange' (executa quando os parâmetros da rota ou os parâmetros de consulta mudam) ou 'always' (executa sempre).

- **`outlet`**: Define o nome do `router-outlet` que a rota deve renderizar. Isso é usado principalmente para rotas nomeadas.

- **`matcher`**: Uma função personalizada para determinar se a rota corresponde à URL. Isso permite definir correspondências de rotas mais complexas que não são baseadas apenas em strings.

Essas propriedades oferecem uma flexibilidade considerável na definição de como as rotas devem se comportar em sua aplicação Angular, permitindo desde a simples navegação até o carregamento preguiçoso de módulos, proteção de rotas com guardas, e mais.

### Estrutura do Arquivo de Configuração de Rotas

O Angular utiliza um módulo especial chamado `RouterModule` para configurar as rotas. A configuração de rotas geralmente é feita em um arquivo separado, por convenção chamado `app-routing.module.ts`. Aqui está como a estrutura básica desse arquivo se parece:

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeuComponente } from './meu-componente/meu-componente.component';

const routes: Routes = [
  { path: 'meu-caminho', component: MeuComponente }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

Este arquivo define um `NgModule` que importa o `RouterModule` e suas rotas configuradas com `RouterModule.forRoot(routes)`. Isso inicializa o sistema de rotas na raiz do aplicativo.

## Rota Padrão

Para definir uma rota padrão que os usuários verão ao entrar no aplicativo, usa-se o caminho vazio (`''`) e normalmente se redireciona para uma rota específica.

```typescript
{ path: '', redirectTo: '/pagina-inicial', pathMatch: 'full' }
```

A propriedade `pathMatch: 'full'` assegura que apenas a URL exata e completa '' corresponde a esta regra de redirecionamento.

## Rota 404

Uma rota 404 é usada para lidar com situações onde o usuário tenta acessar uma página que não existe. No Angular, você pode configurar uma rota para capturar todas as URLs não reconhecidas e direcionar para um componente específico, como um componente `PageNotFoundComponent`.

```typescript
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '**', component: PageNotFoundComponent }
];
```

Aqui, `path: '**'` age como um coringa que corresponde a qualquer caminho que não tenha sido correspondido pelas rotas definidas anteriormente. É importante que esta rota seja a última na definição de `routes`, pois o Angular processa as rotas na ordem em que elas são definidas.

---

Ao configurar rotas no Angular, é crucial entender a sintaxe e as opções disponíveis para definir rotas básicas, rotas padrão e de erro (404). Isso não apenas melhora a navegação dentro do aplicativo, mas também aprimora a experiência do usuário, fornecendo feedback visual adequado para rotas não encontradas e direcionando os usuários para o conteúdo desejado de maneira eficiente.