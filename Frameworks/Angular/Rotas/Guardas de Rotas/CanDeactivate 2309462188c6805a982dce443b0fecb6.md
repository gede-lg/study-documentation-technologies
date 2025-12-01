# CanDeactivate

Certo, Gedê\! A.R.I.A. está pronta para te ajudar a entender tudo sobre a guarda de rotas **CanDeactivate** no Angular. Vamos mergulhar fundo nesse conceito fundamental para o desenvolvimento front-end.

---

## Guarda de Rotas: CanDeactivate no Angular

### Introdução

No desenvolvimento de aplicações web modernas, a navegação entre diferentes partes da aplicação é uma funcionalidade central. O Angular, com seu poderoso sistema de roteamento, oferece diversas ferramentas para gerenciar essa navegação. Uma dessas ferramentas são as **Guards (Guards de Rotas)**, que permitem controlar o acesso a determinadas rotas antes, durante e depois da navegação.

Entre as guards, a **CanDeactivate** desempenha um papel crucial. Ela é utilizada para **impedir que um usuário saia de uma rota específica** sob certas condições. Pense, por exemplo, em um formulário com dados não salvos. Seria frustrante para o usuário perder o progresso apenas por clicar em um link sem querer. A CanDeactivate entra em cena para evitar exatamente isso, proporcionando uma camada de segurança e usabilidade na sua aplicação.

### Sumário

Nesta explicação detalhada, abordaremos os seguintes pontos:

- **Conceitos Fundamentais:** O que são guards de rotas, a importância da CanDeactivate e seu propósito.
- **Sintaxe Detalhada e Uso Prático:** Como implementar a interface `CanDeactivate`, incluindo exemplos de código.
- **Métodos/Propriedades:** Explicação completa do método `canDeactivate`.
- **Cenários de Restrição ou Não Aplicação:** Quando a CanDeactivate pode não ser a melhor escolha.
- **Componentes Chave Associados:** Análise de anotações, classes, interfaces e métodos cruciais.
- **Melhores Práticas e Padrões de Uso:** Recomendações e dicas para um uso eficaz da CanDeactivate.
- **Exemplo Prático Completo:** Um cenário de ponta a ponta para ilustrar a aplicação.

---

### Conceitos Fundamentais

### O que são Guards de Rotas?

Guards de rotas são classes no Angular que implementam uma interface específica do pacote `@angular/router` e são usadas para decidir se uma navegação para uma rota pode ocorrer. Elas podem permitir ou negar a navegação com base em alguma lógica de negócio, como verificação de autenticação, autorização de usuário, ou, no caso da CanDeactivate, o estado atual de um componente.

Existem cinco tipos principais de guards no Angular:

- `CanActivate`: Decide se uma rota pode ser ativada.
- `CanActivateChild`: Decide se os filhos de uma rota podem ser ativados.
- `CanDeactivate`: Decide se o usuário pode sair da rota atual.
- `CanLoad`: Decide se um módulo pode ser carregado via lazy loading.
- `Resolve`: Realiza a pré-busca de dados antes que a rota seja ativada.

### A Importância e Propósito da CanDeactivate

A **`CanDeactivate`** é fundamental para garantir a integridade dos dados e melhorar a experiência do usuário. Seu principal propósito é:

- **Prevenir Perda de Dados:** Impede que o usuário saia de uma página (componente) onde dados foram modificados, mas não salvos, como em formulários de edição.
- **Confirmar Ações do Usuário:** Permite que você solicite uma confirmação ao usuário antes que ele saia de uma rota, caso haja alguma ação pendente ou que possa ter consequências.
- **Controlar Fluxo de Navegação:** Pode ser usada para guiar o usuário em um fluxo específico, impedindo que ele pule etapas ou saia antes de concluir uma tarefa obrigatória.

Imagine que Ju esteja preenchendo um longo formulário de um paciente para fisioterapia. Se ela acidentalmente clicar em "voltar" no navegador ou em outro link, todo o trabalho dela seria perdido. Com a `CanDeactivate`, você pode exibir um modal perguntando "Tem certeza que deseja sair? As alterações não salvas serão perdidas." antes de permitir a navegação.

---

### Sintaxe Detalhada e Uso Prático

Para usar a `CanDeactivate`, você precisa de três coisas:

1. **Uma interface que define o contrato do componente.**
2. **O componente que você deseja proteger.**
3. **Uma classe guard que implementa `CanDeactivate`.**
4. **A configuração da rota que usa a guard.**

### 1\. Definindo a Interface do Componente

Primeiro, é uma boa prática criar uma interface que seus componentes devem implementar para indicar que eles podem ser "desativados". Isso torna o código mais seguro e legível.

```tsx
// src/app/shared/guards/can-deactivate-guard.interface.ts

import { Observable } from 'rxjs';

// Define um tipo genérico para a interface, permitindo que a guard seja reutilizável.
export interface CanComponentDeactivate {
  // O método que a guard chamará no componente.
  // Ele deve retornar um boolean, uma Promise<boolean> ou um Observable<boolean>.
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

```

### 2\. O Componente a Ser Protegido

O componente que você deseja proteger (por exemplo, um formulário de edição) deve implementar a interface `CanComponentDeactivate`.

```tsx
// src/app/pages/product-edit/product-edit.component.ts

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CanComponentDeactivate } from '../../shared/guards/can-deactivate-guard.interface'; // Importa a interface

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements CanComponentDeactivate { // Implementa a interface

  product = { id: 1, name: 'Produto A', price: 100 };
  isSaved = false; // Flag para controlar se o formulário foi salvo

  constructor() { }

  // Método chamado pela guard CanDeactivate
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Se o formulário não foi salvo, pergunta ao usuário
    if (!this.isSaved) {
      const confirmation = confirm('Você tem alterações não salvas. Deseja realmente sair?');
      return confirmation; // Retorna true se o usuário confirmar, false caso contrário
    }
    return true; // Se o formulário foi salvo, permite a navegação
  }

  saveProduct(form: NgForm) {
    // Lógica para salvar o produto
    console.log('Produto salvo!', this.product);
    this.isSaved = true; // Marca como salvo
    form.resetForm(this.product); // Opcional: reseta o estado do formulário após salvar
  }

  // Exemplo de como resetar o estado (para simular uma nova edição)
  resetFormState() {
    this.isSaved = false;
  }
}

```

### 3\. A Classe Guard que Implementa `CanDeactivate`

Agora, crie a guard propriamente dita. Ela será uma classe que implementa `CanDeactivate<T>`, onde `T` é o tipo do componente que ela está protegendo.

```tsx
// src/app/shared/guards/pending-changes.guard.ts

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from './can-deactivate-guard.interface'; // Importa a interface

@Injectable({
  providedIn: 'root' // Torna a guard disponível em toda a aplicação
})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  // O método canDeactivate é chamado pelo roteador antes de sair da rota.
  // Ele recebe o componente atual como argumento.
  canDeactivate(
    component: CanComponentDeactivate // O componente que está sendo desativado
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Verifica se o componente tem o método canDeactivate e o chama.
    // Isso garante que apenas componentes que implementam a interface sejam tratados.
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

```

### 4\. Configuração da Rota

Finalmente, você precisa aplicar a guard à rota no seu arquivo de configuração de rotas (`app-routing.module.ts` ou um módulo de rotas específico).

```tsx
// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { HomeComponent } from './pages/home/home.component';
import { PendingChangesGuard } from './shared/guards/pending-changes.guard'; // Importa a guard

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'products/edit/:id',
    component: ProductEditComponent,
    canDeactivate: [PendingChangesGuard] // Aplica a guard CanDeactivate aqui!
  },
  { path: '**', redirectTo: '' } // Rota curinga para qualquer outra URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

Com essa configuração, sempre que um usuário tentar sair da rota `/products/edit/:id`, o roteador invocará o `PendingChangesGuard`, que por sua vez chamará o método `canDeactivate()` do `ProductEditComponent`.

---

### Métodos/Propriedades

A interface `CanDeactivate` possui apenas um método principal:

- **`canDeactivate(component: T, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean`**
    - **Propósito:** Este método é chamado pelo roteador quando há uma tentativa de sair da rota associada à guard. Ele é responsável por determinar se a navegação de saída pode prosseguir.
    - **Parâmetros:**
        - `component: T`: Uma referência à instância do componente que está sendo desativado. O tipo `T` é o tipo do componente que você especificou ao implementar `CanDeactivate<T>`. No nosso exemplo, é `CanComponentDeactivate`.
        - `currentRoute: ActivatedRouteSnapshot`: Um objeto `ActivatedRouteSnapshot` que representa a rota ativa no momento em que a navegação está saindo. Contém informações sobre a rota, como parâmetros e dados.
        - `currentState: RouterStateSnapshot`: Um objeto `RouterStateSnapshot` que representa o estado atual do roteador.
        - `nextState?: RouterStateSnapshot`: Um objeto `RouterStateSnapshot` que representa o estado para o qual o roteador tentará navegar. Este parâmetro é opcional (`?`) e pode não estar presente em todos os cenários.
    - **Retorno:** O método `canDeactivate` deve retornar um dos seguintes tipos:
        - `boolean`: `true` se a navegação de saída for permitida, `false` se não for.
        - `Promise<boolean>`: Uma promessa que resolve para `true` ou `false`. Útil para operações assíncronas, como mostrar um modal de confirmação.
        - `Observable<boolean>`: Um Observable que emite `true` ou `false`. Também útil para operações assíncronas que usam Observables (ex: serviços de diálogo, requisições HTTP).
    
    No nosso exemplo, simplificamos o `canDeactivate` na guard, passando apenas o `component` para o método `canDeactivate` definido na interface `CanComponentDeactivate`, pois a lógica de confirmação já estava dentro do componente. No entanto, é importante saber que você tem acesso a essas informações de rota caso precise delas na sua lógica da guard.
    

---

### Cenários de Restrição ou Não Aplicação

Embora a `CanDeactivate` seja muito útil, há situações em que ela pode não ser a melhor escolha ou onde seu uso deve ser ponderado:

- **Rotas Somente Leitura:** Se uma rota apenas exibe informações e não permite edições, a `CanDeactivate` é desnecessária, pois não há dados para serem perdidos.
- **Fluxos de Usuário Simples:** Para aplicações com fluxos de navegação muito simples e diretos, a adição de uma guard pode introduzir complexidade desnecessária.
- **Controle de Acesso (Login/Permissões):** Para controlar se um usuário pode sequer *entrar* em uma rota com base em autenticação ou autorização, `CanActivate` ou `CanLoad` são as guards apropriadas, não `CanDeactivate`. A `CanDeactivate` assume que o usuário já está na rota.
- **Performance:** Se a lógica dentro do `canDeactivate` for muito pesada e síncrona, ela pode causar lentidão na navegação. Operações assíncronas devem ser gerenciadas com Promises ou Observables.
- **UX Excessiva:** Usar a `CanDeactivate` em todas as rotas de formulário pode se tornar irritante para o usuário se cada pequena alteração disparar um aviso. É importante equilibrar a proteção de dados com uma experiência de usuário fluida. Considere usá-la apenas para formulários complexos ou com alto risco de perda de dados.
- **Navegação Externa:** A `CanDeactivate` funciona apenas para navegações internas do Angular. Ela não pode impedir que o usuário feche a aba do navegador, a janela ou navegue para um URL externo via barra de endereço. Para isso, você precisaria de listeners de eventos `beforeunload` do navegador, que têm suas próprias limitações e UX.

---

### Componentes Chave Associados

Além da própria interface `CanDeactivate`, outros elementos do Angular são cruciais para seu funcionamento:

- **`@angular/router`:** O módulo principal que fornece todas as funcionalidades de roteamento do Angular, incluindo as guards.
- **`Router` (Serviço):** O serviço `Router` (injetável) é o coração do sistema de roteamento. Embora você não o use diretamente na implementação da `CanDeactivate` em si, ele é o responsável por invocar as guards durante o ciclo de navegação.
- **`ActivatedRouteSnapshot`:** Representa uma fatia da árvore de rotas ativada em um determinado momento. Contém informações sobre a rota atual, como parâmetros (`params`), dados (`data`), e segmentos da URL.
- **`RouterStateSnapshot`:** Representa o estado completo do roteador em um ponto específico no tempo, incluindo a árvore de rotas ativadas e seus dados.
- **`Observable<boolean>` ou `Promise<boolean>`:** São tipos de retorno que permitem que a lógica assíncrona seja executada antes que a guard decida permitir ou negar a navegação. Isso é vital para interações com o usuário (como modais de confirmação) ou requisições de API.

---

### Melhores Práticas e Padrões de Uso

1. **Interface Abstrata para Componentes:** Crie uma interface como `CanComponentDeactivate` (como fizemos no exemplo) para que seus componentes que precisam da guard a implementem. Isso promove a reutilização, o encapsulamento da lógica e o type-checking.
2. **Lógica no Componente, Não na Guard:** A regra de ouro é que a **lógica de decisão se o componente pode ser desativado deve residir no próprio componente**, não na guard. A guard deve ser o mais genérica possível, apenas chamando um método padronizado no componente. Isso mantém o componente autônomo e facilita testes.
3. **Use Diálogos de Confirmação:** Para interações com o usuário, utilize caixas de diálogo modais (como as fornecidas por bibliotecas como Angular Material, PrimeNG ou até mesmo um serviço customizado) em vez do `window.confirm()` nativo, para uma experiência de usuário mais consistente e personalizável.
4. **Assincronia para UX:** Sempre que envolver uma interação com o usuário ou uma operação que demore (como salvar dados), use `Promise<boolean>` ou `Observable<boolean>` para que a navegação aguarde a resposta do usuário.
5. **Reutilize Guards:** Crie guards genéricas que possam ser aplicadas a múltiplos componentes que compartilham a mesma lógica de "desativação".
6. **Gerenciamento de Estado do Formulário:** Utilize `NgForm.dirty` e `NgForm.pristine` (se estiver usando formulários template-driven) ou o estado de um `FormGroup` (se for reativo) para verificar se o formulário foi modificado. Uma flag `isSaved` no componente também é uma boa prática para controlar o estado de salvamento.
7. **Feedback ao Usuário:** Se a navegação for impedida, forneça um feedback claro ao usuário sobre o motivo.
8. **Testes:** Certifique-se de testar suas guards exaustivamente, incluindo cenários onde a navegação deve ser permitida e onde deve ser impedida.

---

### Exemplo Prático Completo

Vamos expandir o exemplo anterior para incluir um serviço de diálogo simulado, tornando-o mais próximo de uma aplicação real.

```tsx
// src/app/shared/services/dialog.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || 'Confirma a ação?');
    return of(confirmation); // Retorna um Observable
  }
}

// src/app/shared/guards/can-deactivate-guard.interface.ts (Mesma do exemplo anterior)
// export interface CanComponentDeactivate {
//   canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
// }

// src/app/pages/product-edit/product-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Usando formulários reativos
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../../shared/guards/can-deactivate-guard.interface';
import { DialogService } from '../../shared/services/dialog.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements CanComponentDeactivate, OnInit {

  productForm!: FormGroup; // Usaremos FormGroup para formulários reativos
  originalProduct: any; // Para comparar se houve alteração

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    // Simula o carregamento de um produto existente
    this.originalProduct = { id: 1, name: 'Produto A', price: 100 };

    this.productForm = this.fb.group({
      id: [this.originalProduct.id],
      name: [this.originalProduct.name, Validators.required],
      price: [this.originalProduct.price, [Validators.required, Validators.min(0.01)]]
    });
  }

  // Método chamado pela guard CanDeactivate
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Verifica se o formulário está 'sujo' (dirty) e não foi salvo (pristine após salvar)
    // Além disso, verifica se os valores do formulário são diferentes dos originais.
    if (this.productForm.dirty && !this.productForm.pristine) {
      // Usa o serviço de diálogo para obter a confirmação
      return this.dialogService.confirm('Você tem alterações não salvas. Deseja realmente sair?');
    }
    return true; // Se não houver alterações pendentes, permite a navegação
  }

  saveProduct() {
    if (this.productForm.valid) {
      console.log('Produto salvo!', this.productForm.value);
      // Aqui você enviaria os dados para um serviço/API
      this.productForm.markAsPristine(); // Marca o formulário como "limpo" após salvar
      this.originalProduct = { ...this.productForm.value }; // Atualiza o produto original
    }
  }
}

```

```html
<div class="product-edit-container">
  <h2>Editar Produto</h2>
  <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
    <div class="form-group">
      <label for="name">Nome do Produto:</label>
      <input id="name" type="text" formControlName="name">
      <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" class="error-message">
        Nome é obrigatório.
      </div>
    </div>

    <div class="form-group">
      <label for="price">Preço:</label>
      <input id="price" type="number" formControlName="price">
      <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" class="error-message">
        Preço é obrigatório e deve ser maior que zero.
      </div>
    </div>

    <button type="submit" [disabled]="!productForm.dirty || productForm.invalid">Salvar</button>
    <button type="button" (click)="productForm.reset(originalProduct)">Cancelar Edição</button>
  </form>

  <p *ngIf="productForm.dirty && !productForm.pristine" style="color: orange;">
    Você tem alterações pendentes!
  </p>
</div>

```

```tsx
// src/app/shared/guards/pending-changes.guard.ts (Mesma do exemplo anterior)
// import { Injectable } from '@angular/core';
// import { CanDeactivate } from '@angular/router';
// import { Observable } from 'rxjs';
// import { CanComponentDeactivate } from './can-deactivate-guard.interface';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
//   canDeactivate(
//     component: CanComponentDeactivate
//   ): Observable<boolean> | Promise<boolean> | boolean {
//     return component.canDeactivate ? component.canDeactivate() : true;
//   }
// }

// src/app/app.module.ts (Adicione as importações necessárias)
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
// Importa o PendingChangesGuard, mas não precisa adicionar nos providers se providedIn: 'root'
// import { PendingChangesGuard } from './shared/guards/pending-changes.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule // Adicione aqui
  ],
  providers: [], // Não precisa adicionar o PendingChangesGuard aqui se providedIn: 'root'
  bootstrap: [AppComponent]
})
export class AppModule { }

```

```html
<nav>
  <a routerLink="/">Home</a> |
  <a routerLink="/products/edit/1">Editar Produto</a> |
  <a routerLink="/some-other-page">Outra Página</a>
</nav>
<router-outlet></router-outlet>

```

Nesse exemplo completo, usamos formulários reativos (`FormGroup`) para gerenciar o estado do formulário e o `DialogService` para uma confirmação assíncrona. Quando você altera o formulário e tenta navegar para outra rota sem salvar, a guarda `PendingChangesGuard` entra em ação e pergunta se você realmente deseja sair, demonstrando o poder da `CanDeactivate`.

Espero que esta explicação detalhada, Gedê, tenha te ajudado a compreender o conceito e a aplicação prática da guarda `CanDeactivate` no Angular. Se tiver mais alguma dúvida, é só perguntar\!