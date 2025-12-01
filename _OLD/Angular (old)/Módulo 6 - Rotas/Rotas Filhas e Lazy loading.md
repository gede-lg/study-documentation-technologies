As rotas filhas no Angular são uma funcionalidade poderosa que permite aos desenvolvedores organizar melhor a navegação dentro de suas aplicações SPA (Single Page Applications). Esta funcionalidade é essencial para construir aplicações complexas e hierárquicas, melhorando a organização do código e a experiência do usuário. Vamos explorar o conceito, a sintaxe e como utilizar rotas filhas, com e sem lazy loading, por meio de um exemplo prático de CRUD de um ator.

## O que é e para que serve?

Rotas filhas permitem que você defina sub-rotas dentro de uma rota principal, organizando melhor a estrutura de navegação da sua aplicação. Por exemplo, em um módulo de gerenciamento de atores, você pode ter uma rota principal `/ator` e sub-rotas como `/cadastrar`, `/atualizar`, etc., que são acessadas como `/ator/cadastrar`, `/ator/atualizar`, etc. Isso não apenas ajuda a manter a estrutura do projeto clara e organizada, mas também facilita o controle de acesso e a modularidade da aplicação.

## O que é Lazy Loading e para que serve?

Lazy Loading, ou carregamento preguiçoso, é uma técnica de otimização usada no desenvolvimento de aplicações web, incluindo aplicações Angular. O objetivo principal do Lazy Loading é carregar componentes, módulos ou recursos de uma aplicação sob demanda, ao invés de carregar tudo na inicialização da aplicação. Isso significa que os recursos serão carregados apenas quando necessários, o que pode significativamente reduzir o tempo de carregamento inicial da aplicação, melhorar a performance e a experiência do usuário.

Essa técnica é particularmente útil em aplicações grandes e complexas, onde o carregamento de todos os módulos de uma vez pode levar a um aumento significativo no tempo de carregamento e consumir recursos desnecessários.

### Sintaxe de Uso

Para implementar o Lazy Loading no Angular, você precisa organizar sua aplicação em módulos e configurar o roteamento para carregar esses módulos sob demanda. Vejamos os passos e a sintaxe básica:

1. **Criar um Módulo Angular**: Primeiro, você deve criar um módulo que deseja carregar preguiçosamente. Use o Angular CLI para criar um novo módulo com seu próprio roteamento:

```bash
ng generate module nome-modulo --route nome-rota --module app.module
```

2. **Configurar o Roteamento**: No módulo principal ou em qualquer módulo onde você deseja implementar o Lazy Loading, configure o roteador para carregar o módulo sob demanda. Isso é feito utilizando a propriedade `loadChildren` na definição da rota:

```typescript
const routes: Routes = [
  {
    path: 'caminho-da-rota',
    loadChildren: () => import('./nome-modulo/nome-modulo.module').then(m => m.NomeModuloModule)
  }
];
```

3. **Definir Rotas no Módulo Carregado Preguiçosamente**: No módulo que está sendo carregado preguiçosamente, você deve definir as rotas específicas para esse módulo, usando o `RouterModule.forChild()`:

```typescript
const routes: Routes = [
  { path: '', component: ComponentePrincipalDoModulo }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [ComponentePrincipalDoModulo]
})
export class NomeModuloModule { }
```

### Exemplo de Código

Vamos supor que temos uma aplicação com um módulo de `Produtos` que queremos carregar preguiçosamente:

1. **Criar o Módulo de Produtos**:
```bash
ng generate module produtos --route produtos --module app.module
```

2. **Configuração no AppModule**:

No `app-routing.module.ts`, a rota para `produtos` seria configurada da seguinte forma:
```typescript
const routes: Routes = [
  {
    path: 'produtos',
    loadChildren: () => import('./produtos/produtos.module').then(m => m.ProdutosModule)
  }
];
```

3. **Definir Rotas no Módulo Produtos**:

No `produtos-routing.module.ts`, você configuraria as rotas específicas do módulo:
```typescript
const routes: Routes = [
  { path: '', component: ListaProdutosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutosRoutingModule { }
```

E no `produtos.module.ts`, você importaria o `ProdutosRoutingModule`.

### Considerações

- **Pré-carregamento**: Angular também oferece estratégias de pré-carregamento para módulos lazy-loaded, permitindo que você refine ainda mais o comportamento de carregamento, carregando módulos em segundo plano quando a rede estiver ociosa.
- **Performance**: Apesar dos benefícios, é importante medir e monitorar o impacto do Lazy Loading na performance da sua aplicação, para garantir que a técnica está sendo aplicada de forma eficaz.

O Lazy Loading é uma técnica poderosa no Angular para melhorar a performance de aplicações grandes, tornando o carregamento inicial mais rápido e economizando recursos.
## Sintaxe de uso sem lazy loading

### Exemplo Prático: CRUD de um Ator

Vamos considerar um exemplo onde temos um módulo de ator, com componentes para listar, cadastrar e atualizar atores. Primeiramente, vamos separar `app.routing.modules` do `ator.routing.modules` para organizar melhor as rotas.

#### app.routing.modules.ts

No arquivo principal de rotas, você definiria a rota para o módulo de ator:

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'ator', loadChildren: () => import('./ator/ator.module').then(m => m.AtorModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

#### ator.routing.modules.ts

Dentro do módulo de ator, definimos as rotas filhas para as operações de CRUD:

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtorComponent } from './ator.component';
import { CadastrarAtorComponent } from './cadastrar-ator.component';
import { AtualizarAtorComponent } from './atualizar-ator.component';

const routes: Routes = [
  {
    path: '', component: AtorComponent, children: [
      { path: 'cadastrar', component: CadastrarAtorComponent },
      { path: 'atualizar', component: AtualizarAtorComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtorRoutingModule { }
```

Neste exemplo, o `AtorComponent` seria o componente principal que atua como um contêiner para as sub-rotas. `CadastrarAtorComponent` e `AtualizarAtorComponent` são acessados como sub-rotas de `/ator`.

## Sintaxe de uso com lazy loading

O lazy loading é uma técnica de otimização que carrega módulos sob demanda, melhorando o tempo de carregamento inicial da aplicação. Para aplicar o lazy loading ao nosso exemplo de CRUD de um ator, faremos algumas alterações.

### app.routing.modules.ts

A definição de rota para o módulo de ator permanece praticamente inalterada, já que o Angular cuida do lazy loading com a sintaxe `loadChildren`:

```typescript
const routes: Routes = [
  { path: 'ator', loadChildren: () => import('./ator/ator.module').then(m => m.AtorModule) }
];
```

### ator.module.ts

No módulo de ator, assegure-se de que `AtorRoutingModule` seja importado:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtorComponent } from './ator.component';
import { CadastrarAtorComponent } from './cadastrar-ator.component';
import { AtualizarAtorComponent } from './atualizar-ator.component';
import { AtorRoutingModule } from './ator-routing.module';

@NgModule({
  declarations: [
    AtorComponent,
    CadastrarAtorComponent,
    AtualizarAtorComponent
  ],
  imports: [
    CommonModule,
    AtorRoutingModule
  ]
})
export class AtorModule { }
```

### Considerações Finais

As rotas filhas no Angular são extremamente úteis para criar aplicações com uma estrutura de navegação complexa e organizada. Utilizando o lazy loading, você pode otimizar ainda mais sua aplicação, carregando módulos apenas quando são necessários. Esse modelo não apenas ajuda a manter o código mais limpo e modular, mas também oferece uma melhor experiência ao usuário, com tempos de carregamento reduzidos.