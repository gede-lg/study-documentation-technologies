# Standalone Components

## 1. Introdução

Standalone Components foram introduzidos como recurso experimental no Angular v14 e estabilizados no Angular v15, permitindo criar componentes, diretivas e pipes sem precisar declará-los em um `NgModule` separado. Isso simplifica a arquitetura da aplicação, reduzindo boilerplate e acelerando o desenvolvimento ([blog.angular.dev](https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8?utm_source=chatgpt.com), [infoq.com](https://www.infoq.com/news/2022/11/angular-15-standalone-components/?utm_source=chatgpt.com)). Ao marcar um componente como standalone, você encapsula todas as dependências — módulos, diretivas, pipes e providers — diretamente no decorator `@Component`, o que fortalece a árvore de dependências e melhora a eliminação de código não usado (tree-shaking) ([v17.angular.io](https://v17.angular.io/guide/standalone-components?utm_source=chatgpt.com), [angular.io](https://angular.io/guide/standalone-components?c=semanadaprogramacao&utm_source=chatgpt.com)).

## 2. Sumário

1. [Conteúdo Detalhado](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#3-conte%C3%BAdo-detalhado)
    1. [Sintaxe e Estrutura](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#31-sintaxe-e-estrutura)
    2. [Componentes Principais e Associados](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#32-componentes-principais-e-associados)
    3. [Routing e Lazy Loading](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#33-routing-e-lazy-loading)
    4. [Testes](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#34-testes)
    5. [Restrições de Uso](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#35-restri%C3%A7%C3%B5es-de-uso)
2. [Exemplos de Código Otimizados](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#4-exemplos-de-c%C3%B3digo-otimizados)
3. [Informações Adicionais](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#5-informa%C3%A7%C3%B5es-adicionais)
4. [Referências para Estudo Independente](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#6-refer%C3%AAncias-para-estudo-independente)

---

## 3. Conteúdo Detalhado

### 3.1 Sintaxe e Estrutura

Para declarar um componente standalone, inclua `standalone: true` no decorator e liste suas dependências no array `imports`:

```tsx
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hello',
  standalone: true,             // torna o componente independente
  imports: [CommonModule],       // módulos, directives e pipes necessários
  template: `<h1>Hello {{ name }}</h1>`,
})
export class HelloComponent {
  name = 'Angular';
}

```

- **`standalone: true`** habilita o uso sem NgModule.
- **`imports`** recebe módulos, componentes, diretivas ou pipes standalone. ([v17.angular.io](https://v17.angular.io/guide/standalone-components?utm_source=chatgpt.com), [angular.io](https://angular.io/guide/standalone-components?c=semanadaprogramacao&utm_source=chatgpt.com))

### 3.2 Componentes Principais e Associados

O decorator `@Component` em standalone ganhou novas propriedades, além das tradicionais:

- **`standalone`**: sinaliza o componente como module-less.
- **`imports`**: dependências diretas (módulos, components, directives, pipes).
- **`providers`**: providers de serviços locais (sem precisar de `providers` em NgModule).
- **`schemas`**: para suportar elementos personalizados ou não reconhecidos. ([v17.angular.io](https://v17.angular.io/guide/standalone-components?utm_source=chatgpt.com), [angular.dev](https://angular.dev/api/core/Directive?utm_source=chatgpt.com))

Além disso, existem:

- **Standalone Directives & Pipes**
    
    ```tsx
    @Directive({ standalone: true, selector: '[appHighlight]' })
    export class HighlightDirective { /* ... */ }
    
    @Pipe({ standalone: true, name: 'capitalize' })
    export class CapitalizePipe implements PipeTransform { /* ... */ }
    
    ```
    
- **`importProvidersFrom`**
    
    Permite registrar providers de módulos antigos ao bootstrapar a aplicação:
    
    ```tsx
    import { bootstrapApplication } from '@angular/platform-browser';
    import { importProvidersFrom } from '@angular/core';
    import { RouterModule } from '@angular/router';
    
    bootstrapApplication(AppComponent, {
      providers: [
        importProvidersFrom(RouterModule.forRoot(routes))
      ]
    });
    
    ```
    
- **Interação entre componentes**
    
    Um standalone component pode **importar** diretamente outro standalone component no seu `imports`, sem envolver NgModules intermediários ([angular.dev](https://angular.dev/api/platform-browser/bootstrapApplication?utm_source=chatgpt.com), [angular.dev](https://angular.dev/guide/components?utm_source=chatgpt.com)).
    

### 3.3 Routing e Lazy Loading

Em vez de definir `loadChildren` para módulos, você pode usar:

```tsx
import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
];

```

- **`loadComponent`** carrega apenas o componente standalone, reduzindo o bundle inicial.
- As rotas funcionam normalmente com `RouterModule.forRoot(routes)` ou `provideRouter(routes)` no bootstrap ([v17.angular.io](https://v17.angular.io/guide/standalone-components?utm_source=chatgpt.com), [blog.angular-university.io](https://blog.angular-university.io/angular-standalone-components/?utm_source=chatgpt.com)).

### 3.4 Testes

Nos testes, o `TestBed` pode importar componentes standalone diretamente, sem chamar `configureTestingModule`:

```tsx
import { TestBed } from '@angular/core/testing';
import { CategoryListComponent } from './category-list.component';

describe(CategoryListComponent.name, () => {
  let fixture = TestBed.createComponent(CategoryListComponent);
  it('deve renderizar a lista', () => {
    fixture.autoDetectChanges();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBeGreaterThan(0);
  });
});

```

Para testar um componente host que consome o standalone:

```tsx
@Component({
  standalone: true,
  imports: [DailyForecastComponent],
  template: `<weather-daily-forecast [temperatureCelsius]="20"></weather-daily-forecast>`
})
class TestHostComponent {}

beforeEach(() => {
  TestBed.createComponent(TestHostComponent).autoDetectChanges();
});

```

Essa abordagem garante que todas as dependências (components, directives, pipes e providers) sejam carregadas automaticamente ([this-is-angular.github.io](https://this-is-angular.github.io/angular-guides/docs/standalone-apis/testing-a-standalone-component-using-the-angular-testbed?utm_source=chatgpt.com), [angulararchitects.io](https://www.angulararchitects.io/en/blog/testing-angular-standalone-components/?utm_source=chatgpt.com)).

### 3.5 Restrições de Uso

- **Pacotes legados**: bibliotecas que só expõem NgModules ainda precisam ser importadas via `importProvidersFrom` ou wrappers standalone.
- **Ferramentas CLI**: para gerar um standalone component, use `ng g component nome --standalone` (Angular CLI v15+) ([blog.angular.dev](https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8?utm_source=chatgpt.com), [angular.dev](https://angular.dev/reference/migrations/standalone?utm_source=chatgpt.com)).
- **Versões**: recursos standalone exigem Angular v14+ (pré-visualização) ou v15+ (estável); evite em projetos abaixo disso.

---

## 4. Exemplos de Código Otimizados

### 4.1 Formulário Reativo Standalone

```tsx
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Nome: <input formControlName="name"/></label>
      <label>Email: <input formControlName="email"/></label>
      <button type="submit" [disabled]="form.invalid">Enviar</button>
    </form>
  `
})
export class ContactFormComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  constructor(private fb: FormBuilder) {}
  onSubmit() {
    console.log(this.form.value);
  }
}

```

### 4.2 Bootstrap com SSR

```tsx
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(RouterModule.forRoot(routes))
  ]
});

```

Este padrão se integra ao Angular Universal para Server-Side Rendering sem NgModules ([dev.to](https://dev.to/zenika/angular-universal-with-standalone-component-206c?utm_source=chatgpt.com), [angular.dev](https://angular.dev/guide/ssr?utm_source=chatgpt.com)).

---

## 5. Informações Adicionais

- **Migração Gradual**: use o schematics oficial `ng add @angular/core --migrate-only` para converter módulos em componentes standalone incrementalmente ([angular.dev](https://angular.dev/reference/migrations/standalone?utm_source=chatgpt.com), [blog.angular.dev](https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8?utm_source=chatgpt.com)).
- **Tree-Shaking**: imports explícitos evitam incluir código não utilizado no bundle, reduzindo o tamanho final ([blog.angular-university.io](https://blog.angular-university.io/angular-standalone-components/?utm_source=chatgpt.com), [engineering.backbase.com](https://engineering.backbase.com/2023/07/03/angular-standalone-components/?utm_source=chatgpt.com)).
- **Hybrid Rendering**: combine SSR, SSG e CSR via `@angular/ssr` e funções híbridas do Angular v19 para otimizar performance e UX ([angular.dev](https://angular.dev/guide/ssr?utm_source=chatgpt.com), [dev.to](https://dev.to/zenika/angular-universal-with-standalone-component-206c?utm_source=chatgpt.com)).

---

## 6. Referências para Estudo Independente

- Angular Official Guide: Standalone Components — [https://angular.io/guide/standalone-components](https://angular.io/guide/standalone-components) ([v17.angular.io](https://v17.angular.io/guide/standalone-components?utm_source=chatgpt.com))
- Angular v15 Release Notes — [https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8](https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8) ([blog.angular.dev](https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8?utm_source=chatgpt.com))
- Angular Standalone Components: Complete Guide (Angular University) — [https://blog.angular-university.io/angular-standalone-components/](https://blog.angular-university.io/angular-standalone-components/) ([blog.angular-university.io](https://blog.angular-university.io/angular-standalone-components/?utm_source=chatgpt.com))
- Migrating to Standalone APIs — [https://angular.io/reference/migrations/standalone](https://angular.io/reference/migrations/standalone) ([angular.dev](https://angular.dev/reference/migrations/standalone?utm_source=chatgpt.com))
- Testing Angular Standalone Components (Angular Architects) — [https://www.angulararchitects.io/en/blog/testing-angular-standalone-components/](https://www.angulararchitects.io/en/blog/testing-angular-standalone-components/) ([angulararchitects.io](https://www.angulararchitects.io/en/blog/testing-angular-standalone-components/?utm_source=chatgpt.com))
- Server-Side & Hybrid Rendering Guide — [https://angular.dev/guide/ssr](https://angular.dev/guide/ssr) ([angular.dev](https://angular.dev/guide/ssr?utm_source=chatgpt.com))