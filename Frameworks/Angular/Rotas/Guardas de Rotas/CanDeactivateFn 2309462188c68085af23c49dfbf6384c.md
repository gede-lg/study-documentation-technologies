# CanDeactivateFn

Claro, Gedê\! Preparei uma explicação extremamente detalhada sobre o `CanDeactivateFn` em Angular, como você pediu. Vamos mergulhar fundo neste importante guarda de rotas.

---

### **Título: Dominando o `CanDeactivateFn`: Protegendo a Navegação e a Experiência do Usuário em Angular**

### **Introdução**

No ecossistema de desenvolvimento de aplicações de página única (SPA) com Angular, o gerenciamento de rotas é um pilar central. O roteador do Angular nos permite criar uma experiência de usuário fluida e dinâmica, mas também introduz desafios, como lidar com a perda de dados não salvos quando o usuário tenta navegar para fora de uma página. É exatamente para resolver este problema que o guarda de rotas `CanDeactivate` (e sua versão funcional, `CanDeactivateFn`) foi criado. Ele atua como um porteiro, interceptando a tentativa de navegação para fora de uma rota e permitindo que a aplicação decida se a navegação deve ser permitida ou bloqueada, geralmente após uma confirmação do usuário.

### **Sumário**

Este guia completo explora o `CanDeactivateFn`, a abordagem moderna e baseada em funções para implementar o guarda de rotas `CanDeactivate` em Angular. Abordaremos desde os conceitos fundamentais e o propósito por trás deste guarda, passando por sua sintaxe detalhada, métodos, propriedades e elementos associados. Discutiremos as melhores práticas, casos de uso comuns, como proteger formulários com dados não salvos, e forneceremos um exemplo prático completo para solidificar o conhecimento.

---

### **Conceitos Fundamentais**

**O que é um Guarda de Rota (Route Guard)?**

Em Angular, Guardas de Rota são serviços ou funções que o roteador utiliza para controlar o acesso a determinadas rotas. Eles implementam lógicas de verificação e retornam um valor booleano (ou uma Promise/Observable que resolve para um booleano) para permitir (`true`) ou negar (`false`) a navegação. Existem vários tipos de guardas, cada um com um propósito específico:

- `CanActivate`: Controla se uma rota *pode ser ativada*.
- `CanActivateChild`: Controla se as rotas filhas *podem ser ativadas*.
- `CanDeactivate`: Controla se o usuário *pode sair* de uma rota.
- `Resolve`: Realiza a busca de dados da rota antes de sua ativação.
- `CanMatch`: Controla se uma rota pode ser acessada com base em critérios mais complexos que apenas a URL.

**Propósito do `CanDeactivateFn`**

O propósito central do `CanDeactivateFn` é **prevenir a perda acidental de dados**. Imagine um cenário onde você, Gedê, ou a Ju estão preenchendo um formulário complexo. Se um de vocês clicasse acidentalmente em um link para outra página, todo o progresso seria perdido. O `CanDeactivateFn` intercepta essa tentativa de navegação e permite que a aplicação:

1. Verifique se há alterações não salvas na página atual.
2. Exiba uma caixa de diálogo de confirmação (por exemplo: "Você tem certeza que deseja sair? Suas alterações não salvas serão perdidas.").
3. Permita a navegação somente se o usuário confirmar a ação ou se não houver alterações pendentes.

A partir do Angular 14, a abordagem funcional (`CanDeactivateFn`) tornou-se a maneira preferencial e mais simples de criar guardas, eliminando a necessidade de criar uma classe de serviço inteira apenas para uma função de guarda.

---

### **Sintaxe e Uso**

A `CanDeactivateFn` é uma função que corresponde a uma assinatura específica. Ela é então associada a uma rota na configuração do roteamento.

### **Sintaxe da Função**

A assinatura da `CanDeactivateFn` é a seguinte:

```tsx
type CanDeactivateFn<T> = (
  component: T,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState?: RouterStateSnapshot
) => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

```

Vamos detalhar cada parâmetro:

- `component: T`: A instância do componente que está sendo desativado. O tipo genérico `T` permite uma forte tipagem, garantindo que você possa acessar métodos e propriedades específicas do seu componente dentro do guarda.
- `currentRoute: ActivatedRouteSnapshot`: Um snapshot (uma "foto") da rota que está sendo desativada no momento. Contém informações como parâmetros da rota, dados, etc.
- `currentState: RouterStateSnapshot`: Um snapshot da árvore de rotas no momento da desativação.
- `nextState?: RouterStateSnapshot`: (Opcional) Um snapshot do estado da rota para o qual o usuário está tentando navegar. É útil para tomar decisões baseadas no destino da navegação.

O retorno da função determina o que o roteador fará:

- `true`: A navegação é permitida.
- `false`: A navegação é cancelada, e o usuário permanece na página atual.
- `UrlTree`: A navegação atual é cancelada, e o usuário é redirecionado para a rota definida pelo `UrlTree`.
- `Observable<...>` ou `Promise<...>`: A navegação fica em espera até que o Observable ou a Promise seja resolvido. Isso é crucial para lógicas assíncronas, como exibir um modal de confirmação e aguardar a resposta do usuário.

### **Exemplo de Uso Básico**

1. **Crie uma interface (boa prática):** Para garantir que seu componente tenha o método que o guarda irá verificar.
    
    ```tsx
    // src/app/interfaces/can-component-deactivate.interface.ts
    import { Observable } from 'rxjs';
    
    export interface CanComponentDeactivate {
      canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
    }
    
    ```
    
2. **Crie a função do guarda:**
    
    ```tsx
    // src/app/guards/unsaved-changes.guard.ts
    import { CanDeactivateFn } from '@angular/router';
    import { CanComponentDeactivate } from '../interfaces/can-component-deactivate.interface';
    
    export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
      // O guarda chama o método `canDeactivate` do próprio componente.
      // Isso delega a lógica de verificação para o componente, tornando o guarda reutilizável.
      return component.canDeactivate ? component.canDeactivate() : true;
    };
    
    ```
    
3. **Implemente a interface no seu componente:**
    
    ```tsx
    // src/app/components/user-form/user-form.component.ts
    import { Component } from '@angular/core';
    import { CanComponentDeactivate } from '../../interfaces/can-component-deactivate.interface';
    import { Observable, of } from 'rxjs';
    import { FormGroup, FormControl } from '@angular/forms'; // Exemplo com formulário
    
    @Component({
      selector: 'app-user-form',
      templateUrl: './user-form.component.html',
    })
    export class UserFormComponent implements CanComponentDeactivate {
      userForm = new FormGroup({
        name: new FormControl(''),
        email: new FormControl('')
      });
    
      // Lógica principal do guarda reside aqui
      canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this.userForm.dirty) { // `dirty` indica que o formulário foi alterado
          return confirm('Você possui alterações não salvas. Deseja realmente sair?');
        }
        return true; // Permite a navegação se o formulário não foi alterado
      }
    }
    
    ```
    
4. **Aplique o guarda na sua rota:**
    
    ```tsx
    // src/app/app-routing.module.ts
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { UserFormComponent } from './components/user-form/user-form.component';
    import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
    
    const routes: Routes = [
      {
        path: 'user-form',
        component: UserFormComponent,
        canDeactivate: [unsavedChangesGuard] // Aqui aplicamos o guarda!
      },
      // ... outras rotas
    ];
    
    @NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
    })
    export class AppRoutingModule { }
    
    ```
    

---

### **Métodos/Propriedades (dos parâmetros da função)**

O `CanDeactivateFn` em si é uma função, não uma classe, então não possui métodos ou propriedades próprios. No entanto, seus parâmetros (`component`, `currentRoute`, `currentState`, `nextState`) são objetos ricos em informações.

### **Parâmetro `component: T`**

- **Conceito:** É a referência direta à instância do componente da rota que está sendo desativada.
- **Uso:** Permite acessar qualquer propriedade ou método público do componente. É por meio dele que acessamos a lógica de verificação (ex: `component.userForm.dirty` ou `component.canDeactivate()`).

### **Parâmetro `currentRoute: ActivatedRouteSnapshot`**

- **Conceito:** Um objeto imutável que representa o estado da rota no momento da verificação.
- **Propriedades Essenciais:**
    - `params`: Um objeto com os parâmetros da rota (ex: `/user/:id`). `currentRoute.params['id']`.
    - `queryParams`: Um objeto com os parâmetros de consulta da URL (ex: `/search?q=angular`). `currentRoute.queryParams['q']`.
    - `data`: Um objeto com dados estáticos definidos na configuração da rota.
    - `url`: Um array de segmentos da URL da rota.
    - `component`: A classe do componente associado à rota.

### **Parâmetro `currentState: RouterStateSnapshot` e `nextState: RouterStateSnapshot`**

- **Conceito:** Representam a árvore completa de rotas ativas. `currentState` é o estado antes da navegação e `nextState` é o estado para o qual se deseja navegar.
- **Propriedades Essenciais:**
    - `url`: A URL completa para o estado da rota. `currentState.url` lhe dará a URL da página atual. `nextState.url` lhe dará a URL de destino.
    - `root`: O nó raiz da árvore de `ActivatedRouteSnapshot`.
- **Uso Prático:** Você pode usar `nextState` para permitir a navegação para certas rotas mesmo com alterações não salvas. Por exemplo, permitir que o usuário vá para uma rota de "Ajuda" sem o aviso, mas bloquear a navegação para outras partes da aplicação.
    
    ```tsx
    export const smartUnsavedChangesGuard: CanDeactivateFn<MyComponent> = (component, currentRoute, currentState, nextState) => {
      if (nextState?.url.includes('/ajuda')) {
        return true; // Sempre permite a navegação para a página de ajuda
      }
      return component.canDeactivate ? component.canDeactivate() : true;
    };
    
    ```
    

---

### **Restrições de Uso**

Apesar de poderoso, o `CanDeactivateFn` não é uma solução para todos os cenários.

- **Não previne o fechamento do navegador/aba:** O `CanDeactivate` funciona apenas para a navegação *dentro* da sua aplicação Angular (clicar em um `routerLink`, usar `router.navigate()`, etc.). Ele **não pode** impedir que o usuário feche a aba, feche o navegador ou recarregue a página (F5). Para esses casos, você deve usar a API nativa do navegador, como o evento `beforeunload`.
    
    ```tsx
    import { HostListener } from '@angular/core';
    
    // Dentro do seu componente:
    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event: BeforeUnloadEvent) {
      if (this.userForm.dirty) {
        event.preventDefault(); // Necessário para a maioria dos navegadores
        event.returnValue = ''; // Padrão legado, necessário para alguns navegadores
        return ''; // Exibe o prompt padrão do navegador
      }
    }
    
    ```
    
- **Má experiência do usuário se usado em excesso:** Interromper a navegação do usuário pode ser frustrante. Use `CanDeactivate` apenas quando houver um risco real de perda de dados importantes. Evite usá-lo para ações triviais.
- **Complexidade com lógicas assíncronas:** Ao usar `Observable` ou `Promise`, certifique-se de que eles sempre completem/resolvam. Um Observable que nunca emite um valor fará com que a navegação fique "presa" indefinidamente.

---

### **Elementos Associados**

Para que o `CanDeactivateFn` funcione corretamente, ele interage com várias partes do Roteador do Angular.

- **`Routes` (Array de Rotas):** É a configuração central do roteamento. É aqui que você associa sua função de guarda a uma rota específica usando a propriedade `canDeactivate`.
    
    ```tsx
    const routes: Routes = [{
      path: 'profile',
      component: ProfileComponent,
      canDeactivate: [unsavedChangesGuard]
    }];
    
    ```
    
- **`CanDeactivateFn` (Interface/Tipo):** A assinatura de tipo que sua função de guarda deve seguir. Garante que o Angular saiba como chamar sua função e quais parâmetros passar para ela.
- **`ActivatedRouteSnapshot` e `RouterStateSnapshot`:** Interfaces que fornecem informações detalhadas sobre o estado da rota no momento da transição. São as fontes de dados para tomar decisões inteligentes dentro do guarda.
- **`UrlTree`:** Um objeto retornado pelo roteador que representa uma URL analisada. Você pode criar um `UrlTree` usando `router.parseUrl('/algum-lugar')` para redirecionar o usuário programaticamente a partir de um guarda.
    
    ```tsx
    // Exemplo de redirecionamento dentro de um guarda
    import { inject } from '@angular/core';
    import { Router } from '@angular/router';
    
    export const someGuard: CanDeactivateFn<any> = (component) => {
      const router = inject(Router); // Injetando o Router na função
      if (/* alguma condição de erro */) {
        // Cancela a navegação atual e redireciona para a página de erro
        return router.parseUrl('/error');
      }
      return true;
    };
    
    ```
    

---

### **Melhores Práticas e Casos de Uso**

- **Caso de Uso Principal: Formulários de Edição/Criação:** Este é o uso mais comum. Qualquer página com um `<form>` onde o usuário insere dados (cadastro de cliente, edição de perfil, escrita de um artigo) é um candidato perfeito para o `CanDeactivate`.
- **Melhor Prática: Delegar a Lógica para o Componente:** Como mostrado no exemplo inicial, o guarda deve ser genérico. A lógica de "há algo não salvo?" deve residir no próprio componente. Isso torna o guarda reutilizável para qualquer componente que precise dessa funcionalidade, bastando implementar a interface `CanComponentDeactivate`.
- **Use Modais de Confirmação em vez de `confirm()`:** O `window.confirm()` é bloqueante, simples e interrompe a execução do JavaScript. Para uma melhor experiência de usuário e um design mais alinhado à sua aplicação, use um serviço de modal (como os do Angular Material, NG-Bootstrap, ou um customizado). O serviço de modal retornará uma `Promise` ou `Observable`, que se encaixa perfeitamente no tipo de retorno do `CanDeactivateFn`.
- **Injeção de Dependências em Guardas Funcionais:** Desde o Angular 14, você pode usar a função `inject()` para obter instâncias de serviços dentro de uma função de guarda, sem a necessidade de uma classe.
    
    ```tsx
    import { inject } from '@angular/core';
    import { ModalService } from '../services/modal.service'; // Seu serviço de modal
    
    export const modalGuard: CanDeactivateFn<MyFormComponent> = (component) => {
      const modalService = inject(ModalService);
    
      if (!component.form.dirty) {
        return true;
      }
    
      // `openConfirmModal` retorna um Observable<boolean>
      return modalService.openConfirmModal(
        'Sair?',
        'Você tem alterações não salvas. Deseja mesmo sair?'
      );
    };
    
    ```
    

---

### **Exemplo Completo: Usando um Serviço de Modal**

Este exemplo ilustra uma implementação mais robusta e realista.

**1. Serviço de Modal (Simplificado)**

```tsx
// src/app/services/confirmation-modal.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmationModalService {
  confirm(message: string): Observable<boolean> {
    const confirmation = window.confirm(message); // Em um app real, aqui você abriria um componente de modal
    return of(confirmation);
  }
}

```

**2. Interface (Reutilizando)**

```tsx
// src/app/interfaces/can-component-deactivate.interface.ts
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

```

**3. O Componente com o Formulário**

```tsx
// src/app/components/profile-editor/profile-editor.component.ts
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../../interfaces/can-component-deactivate.interface';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';

@Component({
  selector: 'app-profile-editor',
  template: `
    <h3>Editar Perfil</h3>
    <form [formGroup]="profileForm">
      <label for="name">Nome:</label>
      <input id="name" type="text" formControlName="name"><br>
      <label for="bio">Biografia:</label>
      <textarea id="bio" formControlName="bio"></textarea>
    </form>
    <p>Formulário sujo (dirty): {{ profileForm.dirty }}</p>
  `,
})
export class ProfileEditorComponent implements CanComponentDeactivate {
  private modalService = inject(ConfirmationModalService);

  profileForm = new FormGroup({
    name: new FormControl(''),
    bio: new FormControl(''),
  });

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.profileForm.dirty) {
      return true; // Permite sair se o formulário está "limpo"
    }

    // Usa o serviço de modal para confirmação
    return this.modalService.confirm(
      'Você tem alterações não salvas. Tem certeza que deseja descartá-las e sair?'
    );
  }
}

```

**4. A Função de Guarda (Genérica)**

```tsx
// src/app/guards/form-unsaved.guard.ts
import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '../interfaces/can-component-deactivate.interface';

export const formUnsavedGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};

```

**5. Configuração da Rota**

```tsx
// src/app/app-routing.module.ts
import { Routes } from '@angular/router';
import { ProfileEditorComponent } from './components/profile-editor/profile-editor.component';
import { formUnsavedGuard } from './guards/form-unsaved.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'edit-profile',
    component: ProfileEditorComponent,
    canDeactivate: [formUnsavedGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

```

---

### **Tópicos Relacionados para Aprofundamento**

1. **Outros Guardas de Rota:** Explore `CanActivate`, `CanActivateChild`, `Resolve` e `CanMatch` para ter um controle completo sobre o fluxo de navegação.
2. **Resolvedores de Rota (`ResolveFn`):** Aprenda a pré-carregar dados para um componente antes que a rota seja ativada, melhorando a experiência do usuário ao evitar telas de carregamento dentro do componente.
3. **Injeção de Dependência no Angular:** Aprofunde seus conhecimentos sobre como o `inject()` funciona e como ele simplifica a criação de serviços, guardas e interceptadores baseados em funções.
4. **Estratégias de Reutilização de Rotas (`RouteReuseStrategy`):** Entenda como o Angular decide quando destruir e recriar um componente durante a navegação, e como você pode customizar esse comportamento.
5. **Programação Reativa com RxJS:** O retorno de `Observable` nos guardas é extremamente poderoso. Dominar RxJS abrirá um leque de possibilidades para criar lógicas de guarda complexas e assíncronas de forma elegante.

Espero que esta explicação detalhada tenha sido útil, Gedê\! É um conceito fundamental para criar aplicações robustas e que respeitam o trabalho do usuário. Se tiver mais alguma dúvida, pode perguntar\!