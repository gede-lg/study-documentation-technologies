# Criando uma Referência de FormControl com ngModel

---

### Introdução

No desenvolvimento *front-end*, lidar com formulários é uma tarefa comum e essencial. O Angular oferece duas abordagens principais para gerenciar formulários: *Reactive Forms* (Formulários Reativos) e *Template-Driven Forms* (Formulários Orientados a Modelo). Embora os *Reactive Forms* sejam frequentemente preferidos para cenários mais complexos devido ao seu controle programático, os *Template-Driven Forms* oferecem uma maneira rápida e declarativa de construir formulários simples, aproveitando as diretivas do *template*.

Este guia se aprofundará em um conceito específico dentro dos *Template-Driven Forms*: como obter uma **referência direta ao `FormControl`** de um campo de formulário usando a diretiva `ngModel`. Isso é particularmente útil quando você precisa de um controle mais granular sobre o estado de um campo individual, mesmo em um formulário *Template-Driven*, sem ter que migrar para *Reactive Forms*.

### Sumário

Nesta explicação, abordaremos os seguintes pontos:

- **Conceitos Fundamentais:** Entender o que são *Template-Driven Forms*, a função do `ngModel` e a importância de ter uma referência ao `FormControl`.
- **Sintaxe Detalhada e Uso Prático:** Exemplos de como criar uma referência local de *template* para a diretiva `ngModel` e, por consequência, acessar o `FormControl` subjacente.
- **Cenários de Restrição ou Não Aplicação:** Quando essa abordagem pode não ser a melhor escolha e quais alternativas considerar.
- **Componentes Chave Associados:** Análise das diretivas e classes cruciais envolvidas, como `ngModel` e `NgControl`.
- **Melhores Práticas e Padrões de Uso:** Recomendações para utilizar essa técnica de forma eficaz.
- **Exemplo Prático Completo:** Um cenário de ponta a ponta demonstrando o uso da referência do `FormControl`.

---

### Conceitos Fundamentais

### O que são Formulários *Template-Driven*?

Os *Template-Driven Forms* (Formulários Orientados a Modelo) são uma maneira de construir formulários no Angular onde a lógica do formulário é definida predominantemente no *template* (HTML). Eles são mais simples de usar para formulários menos complexos, pois aproveitam as diretivas do Angular para inferir a estrutura do formulário. A diretiva `FormsModule` é importada para habilitar essa funcionalidade.

### A Diretiva `ngModel`

A diretiva `ngModel` é o coração dos *Template-Driven Forms*. Ela faz duas coisas principais:

1. **Associação de Dados Bidirecional (Two-way Data Binding):** Conecta uma propriedade do seu componente a um elemento de formulário no *template*, permitindo que as alterações no *template* atualizem a propriedade e vice-versa.
2. **Criação Implícita de um `FormControl`:** Por debaixo dos panos, quando você usa `ngModel` em um elemento de formulário (`<input>`, `<select>`, `<textarea>`, etc.) e o atribui um atributo `name`, o Angular cria automaticamente uma instância de `FormControl` para aquele elemento. Essa instância gerencia o valor, o estado de validação (válido, inválido, *dirty*, *touched*, etc.) e as interações do usuário para o campo.

### Por que Referenciar o `FormControl`?

Mesmo em um formulário *Template-Driven*, pode haver situações em que você precisa interagir diretamente com o `FormControl` individual de um campo. Por exemplo:

- **Validação em Tempo Real:** Acessar o estado de validação (`valid`, `invalid`, `errors`) de um campo específico para exibir mensagens de erro personalizadas.
- **Controle Programático:** Alterar o valor de um campo, redefini-lo ou disparar validações de forma programática.
- **Desabilitar/Habilitar Campos:** Controlar a propriedade `disabled` de um campo com base em alguma lógica.
- **Verificar Estado do Campo:** Saber se um campo foi tocado (*touched*) ou modificado (*dirty*) pelo usuário.

Ter acesso a essa instância de `FormControl` permite um controle mais refinado sobre a experiência do usuário com o formulário, sem a necessidade de reestruturar tudo para *Reactive Forms*.

---

### Sintaxe Detalhada e Uso Prático

Para obter uma referência ao `FormControl` em um formulário *Template-Driven*, você precisa primeiro criar uma **referência local de *template*** para a diretiva `ngModel`.

### 1\. Criando a Referência Local de Template para `ngModel`

Você pode criar uma referência local de *template* usando a sintaxe `#nomeReferencia`, onde `nomeReferencia` é o nome que você dará a essa referência. Para que essa referência se ligue à instância de `ngModel` (e não ao elemento HTML em si), você deve atribuir a ela o valor `ngModel`.

**Exemplo:**

```html
<form #meuForm="ngForm">
  <label for="nome">Nome:</label>
  <input type="text" id="nome" name="nomeUsuario"
         [(ngModel)]="usuario.nome" #campoNome="ngModel">
  <div *ngIf="campoNome.invalid && campoNome.touched" class="erro">
    <p *ngIf="campoNome.errors?.['required']">O nome é obrigatório.</p>
    <p *ngIf="campoNome.errors?.['minlength']">O nome deve ter pelo menos 3 caracteres.</p>
  </div>

  <button type="submit" [disabled]="meuForm.invalid">Salvar</button>
</form>

```

**Explicação do código:**

- `#meuForm="ngForm"`: Cria uma referência local de *template* chamada `meuForm` que se refere à instância da diretiva `NgForm` (a diretiva que representa o formulário como um todo).
- `[(ngModel)]="usuario.nome"`: Realiza o *two-way data binding* entre o input e a propriedade `usuario.nome` no componente.
- `name="nomeUsuario"`: **Essencial\!** O atributo `name` é obrigatório para que `ngModel` crie e registre um `FormControl` com o formulário pai (`NgForm`).
- `#campoNome="ngModel"`: Esta é a parte crucial. Aqui, criamos uma referência local de *template* chamada `campoNome`. Ao atribuir `"ngModel"` a ela, estamos dizendo ao Angular para que `campoNome` se refira à instância da diretiva `ngModel` anexada a este `<input>`, e **não** ao elemento DOM `<input>` em si.

### 2\. Acessando o `FormControl` Subjacente

Uma vez que você tem a referência `campoNome` para a instância de `ngModel`, o `FormControl` subjacente pode ser acessado através da propriedade `.control` da instância de `ngModel`.

**Exemplo:**

Continuando o exemplo anterior, você pode usar `campoNome.control` no seu *template* ou passá-lo para um método no seu componente.

**No Template:**

Você já está usando as propriedades do `FormControl` indiretamente através de `campoNome` (que é a instância de `NgModel`). As propriedades como `invalid`, `touched`, `errors`, etc., são expostas pela diretiva `NgControl` (que é a classe base para `ngModel`), e internamente elas acessam o `FormControl`.

Se você quisesse a instância `FormControl` em si para uma depuração ou para passar para outra diretiva/componente, você faria:

```html
<div *ngIf="campoNome.control.invalid && campoNome.control.touched" class="erro">
  </div>

<p>Valor do campo via FormControl: {{ campoNome.control.value }}</p>
<p>Validade do campo via FormControl: {{ campoNome.control.valid }}</p>

```

**No Componente (acessando via `@ViewChild`):**

Para manipular o `FormControl` do componente, você pode usar o decorador `@ViewChild`.

```tsx
// app.component.ts
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgModel } from '@angular/forms'; // Importe NgModel

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  usuario = {
    nome: '',
    email: ''
  };

  @ViewChild('campoNome') nomeInput: NgModel | undefined; // Referência à diretiva NgModel

  ngAfterViewInit() {
    // É importante acessar a referência no ciclo de vida AfterViewInit,
    // pois o template já estará renderizado e a diretiva NgModel inicializada.
    if (this.nomeInput) {
      console.log('Instância de NgModel:', this.nomeInput);
      console.log('FormControl do campoNome:', this.nomeInput.control);

      // Exemplo: Disparar validação após 2 segundos
      setTimeout(() => {
        if (this.nomeInput && this.nomeInput.control) {
          this.nomeInput.control.markAsTouched(); // Marca como tocado para exibir erros
          this.nomeInput.control.updateValueAndValidity(); // Recalcula a validade
        }
      }, 2000);
    }
  }

  // Você pode ter um método para submeter o formulário
  onSubmit(form: any) {
    console.log('Formulário submetido:', form.value);
    console.log('Validade do formulário:', form.valid);
    // Aqui você pode fazer algo com os dados do formulário
  }
}

```

**Observações Importantes:**

- O atributo `name` no elemento do formulário (`<input>`, `<select>`, etc.) é **obrigatório** para que a diretiva `ngModel` registre o `FormControl` com o formulário pai e para que a referência local de *template* funcione corretamente com `"ngModel"`.
- A instância de `NgModel` (que é o que `campoNome` representa) implementa a interface `NgControl`. Propriedades como `valid`, `invalid`, `touched`, `dirty`, e `errors` são herdadas de `NgControl` e acessam o `FormControl` subjacente.
- Se você precisar acessar o `FormControl` programaticamente no componente, use `@ViewChild` e acesse a propriedade `.control` da instância de `NgModel` no *lifecycle hook* `ngAfterViewInit`.

---

### Cenários de Restrição ou Não Aplicação

Embora seja útil, referenciar o `FormControl` em formulários *Template-Driven* tem suas limitações e nem sempre é a melhor abordagem:

- **Formulários Complexos:** Para formulários com muitas validações dinâmicas, validações cruzadas entre campos, ou lógica de formulário complexa, os **Reactive Forms** são a escolha superior. Eles fornecem uma API mais robusta e programática para gerenciar o estado do formulário e dos *FormControls*.
- **Testabilidade:** Testar formulários *Template-Driven* com lógica complexa pode ser mais difícil do que testar *Reactive Forms*, onde você tem controle total sobre os *FormControls* no código TypeScript.
- **Escalabilidade:** Manter a lógica de validação e estado no *template* pode se tornar difícil de gerenciar à medida que o formulário cresce.
- **Validação Customizada Complexa:** Embora seja possível criar validadores customizados para *Template-Driven Forms*, a integração e o uso são mais diretos com *Reactive Forms*.
- **Dependência do Template:** A lógica para acessar o `FormControl` está ligada ao *template*. Se você precisar de uma lógica de formulário reutilizável ou desacoplada da visão, os *Reactive Forms* são mais adequados.

**Quando não usar essa abordagem:**

Se você se encontrar acessando o `.control` de várias referências de `ngModel` e escrevendo muita lógica de formulário no seu componente ou *template* para gerenciar o estado, é um forte indicativo de que **Reactive Forms** seria uma solução mais limpa e escalável. Essa técnica é melhor para interações pontuais ou para adicionar pequenas melhorias a formulários *Template-Driven* existentes.

---

### Componentes Chave Associados

Para entender completamente a interação, é importante conhecer as classes e interfaces principais envolvidas:

1. **`NgModel` (Classe/Diretiva):**
    - **Propósito:** Fornece *two-way data binding* em elementos de formulário e registra um `FormControl` com o `NgForm` pai.
    - **Uso:** Anexada a elementos como `<input>`, `<select>`, `<textarea>`. Requer o atributo `name`.
    - **Propriedades Notáveis (que expõem o estado do FormControl):**
        - `valid`: `boolean` - Se o controle tem erros de validação.
        - `invalid`: `boolean` - Se o controle não tem erros de validação.
        - `pending`: `boolean` - Se o controle tem uma validação assíncrona pendente.
        - `disabled`: `boolean` - Se o controle está desabilitado.
        - `untouched`: `boolean` - Se o controle ainda não foi tocado pelo usuário.
        - `touched`: `boolean` - Se o controle foi tocado pelo usuário.
        - `pristine`: `boolean` - Se o valor do controle não foi alterado desde o seu estado inicial.
        - `dirty`: `boolean` - Se o valor do controle foi alterado.
        - `errors`: `ValidationErrors | null` - Objeto contendo os erros de validação (ex: `{ 'required': true }`, `{ 'minlength': { 'requiredLength': 3, 'actualLength': 1 } }`).
        - `control`: **`FormControl`** - Esta é a propriedade que expõe a instância `FormControl` real gerenciada por `ngModel`.
2. **`NgForm` (Classe/Diretiva):**
    - **Propósito:** Representa o formulário como um todo em *Template-Driven Forms*. Coleta todos os `FormControls` registrados por `ngModel` dentro do seu escopo.
    - **Uso:** Anexada ao elemento `<form>`.
    - **Propriedades Notáveis:**
        - `value`: `any` - Um objeto contendo os valores de todos os campos do formulário.
        - `valid`, `invalid`, `pending`, `disabled`, `untouched`, `touched`, `pristine`, `dirty`, `errors`: Semelhantes às propriedades de `NgModel`, mas para o formulário completo.
        - `form`: **`FormGroup`** - A instância de `FormGroup` que representa o formulário, contendo todos os `FormControls` individuais.
3. **`FormControl` (Classe):**
    - **Propósito:** A classe fundamental que representa um controle individual em um formulário. Gerencia o valor do controle, seu estado de validação e rastreia o estado de interação do usuário.
    - **Uso:** Geralmente criada explicitamente em *Reactive Forms*, mas criada implicitamente por `ngModel` em *Template-Driven Forms*.
    - **Métodos Notáveis:**
        - `setValue(value: any, options?: Object)`: Define um novo valor para o controle.
        - `patchValue(value: any, options?: Object)`: Define um novo valor para o controle, permitindo que você forneça um objeto com apenas um subconjunto de propriedades.
        - `reset(value?: any, options?: Object)`: Redefine o controle para seu valor inicial e remove todos os erros.
        - `markAsTouched(opts?: {onlySelf?: boolean})`: Marca o controle como tocado.
        - `markAsDirty(opts?: {onlySelf?: boolean})`: Marca o controle como sujo.
        - `updateValueAndValidity(opts?: {onlySelf?: boolean, emitEvent?: boolean})`: Recalcula o valor e o status de validação do controle.
4. **`NgControl` (Interface Abstrata):**
    - **Propósito:** Uma interface abstrata que define o comportamento comum para as diretivas de controle de formulário (`NgModel`, `FormControlName`). Ambas `NgModel` e `FormControlName` estendem `NgControl`.
    - **Propriedades:** `valid`, `invalid`, `touched`, `dirty`, `errors`, etc. (as mesmas que `NgModel` expõe).
    - **Importância:** É por isso que você pode usar `campoNome.invalid` diretamente; `campoNome` é uma instância de `NgModel` que se comporta como um `NgControl`.

---

### Melhores Práticas e Padrões de Uso

Ao usar referências de `FormControl` com `ngModel` em *Template-Driven Forms*, considere as seguintes melhores práticas:

- **Use para Melhorias Pontuais:** Utilize essa técnica para validação instantânea, exibição de mensagens de erro específicas para um campo, ou para desabilitar/habilitar um campo com base em sua própria validade.
- **Atributo `name` é Essencial:** Sempre inclua o atributo `name` em elementos de formulário que usam `ngModel`. Sem ele, a diretiva `ngModel` não registrará um `FormControl` e a referência não funcionará como esperado.
- **Nomeie Suas Referências Claramente:** Escolha nomes significativos para suas referências locais de *template* (ex: `#emailInput`, `#senhaCampo`).
- **Validação no Template:** Prefira exibir as mensagens de erro diretamente no *template* usando `ngIf` e as propriedades do `NgModel` (`campoNome.invalid`, `campoNome.errors`). Isso mantém a lógica de validação próxima ao campo.
- **Acesso Programático com Cuidado:** Se você precisar de acesso programático ao `FormControl` no seu componente, use `@ViewChild` e acesse a propriedade `.control` da instância de `NgModel`. No entanto, se essa necessidade se tornar muito frequente ou complexa, reavalie a mudança para *Reactive Forms*.
- **Evite o Excesso de Lógica no Componente:** Mantenha a lógica do formulário no componente mínima ao usar *Template-Driven Forms*. Se a complexidade aumentar, migre para *Reactive Forms*.
- **Não Misture Abordagens no Mesmo Formulário:** Evite misturar *Template-Driven* e *Reactive Forms* no mesmo `<form>`. Escolha uma abordagem e mantenha-a consistente para aquele formulário.

---

### Exemplo Prático Completo

Vamos criar um formulário de login simples onde demonstramos a referência do `FormControl` para exibir mensagens de erro para o campo de email e verificar sua validade.

### 1\. Configure o Módulo (`app.module.ts`)

Certifique-se de que o `FormsModule` esteja importado no seu `AppModule` para habilitar os *Template-Driven Forms*.

```tsx
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importe FormsModule

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // Adicione FormsModule aos imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### 2\. Crie o Componente (`app.component.ts`)

```tsx
// app.component.ts
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  credenciais = {
    email: '',
    senha: ''
  };

  @ViewChild('loginForm') form?: NgForm; // Referência ao formulário completo
  @ViewChild('emailInput') emailModel?: NgModel; // Referência à diretiva NgModel do email

  ngAfterViewInit() {
    // Acessando a instância de NgModel e seu FormControl subjacente
    if (this.emailModel) {
      console.log('Instância de NgModel do email:', this.emailModel);
      console.log('FormControl do email:', this.emailModel.control);

      // Exemplo de manipulação programática:
      // Podemos definir um valor ou mudar o estado do FormControl
      // this.emailModel.control.setValue('teste@exemplo.com');
      // this.emailModel.control.markAsTouched();
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Formulário de Login Válido:', this.credenciais);
      // Aqui você enviaria os dados para um serviço de autenticação
    } else {
      console.log('Formulário de Login Inválido!');
      // Marcar todos os campos como "touched" para exibir mensagens de erro
      // if (this.form) {
      //   Object.keys(this.form.controls).forEach(key => {
      //     this.form!.controls[key].markAsTouched();
      //   });
      // }
    }
  }
}

```

### 3\. Desenvolva o Template (`app.component.html`)

```html
<div class="container">
  <h1>Login</h1>
  <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email"
             [(ngModel)]="credenciais.email"
             required email #emailInput="ngModel"
             class="form-control"
             [class.is-invalid]="emailInput.invalid && emailInput.touched">
      <div *ngIf="emailInput.invalid && emailInput.touched" class="invalid-feedback">
        <div *ngIf="emailInput.errors?.['required']">O email é obrigatório.</div>
        <div *ngIf="emailInput.errors?.['email']">Por favor, insira um email válido.</div>
      </div>
    </div>

    <div class="form-group">
      <label for="senha">Senha:</label>
      <input type="password" id="senha" name="senha"
             [(ngModel)]="credenciais.senha"
             required minlength="6" #senhaInput="ngModel"
             class="form-control"
             [class.is-invalid]="senhaInput.invalid && senhaInput.touched">
      <div *ngIf="senhaInput.invalid && senhaInput.touched" class="invalid-feedback">
        <div *ngIf="senhaInput.errors?.['required']">A senha é obrigatória.</div>
        <div *ngIf="senhaInput.errors?.['minlength']">A senha deve ter pelo menos {{ senhaInput.errors?.['minlength']?.['requiredLength'] }} caracteres.</div>
      </div>
    </div>

    <button type="submit" [disabled]="loginForm.invalid" class="btn btn-primary">Entrar</button>

    <div class="form-status">
      <p>Email Válido: {{ emailInput.valid }}</p>
      <p>Email Tocadado: {{ emailInput.touched }}</p>
      <p>Email Sujo (Dirty): {{ emailInput.dirty }}</p>
      <p>Formulário Válido: {{ loginForm.valid }}</p>
    </div>
  </form>
</div>

```

### 4\. Adicione Estilos (Opcional, `app.component.css`)

```css
/* app.component.css */
.container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Para incluir padding e border no width */
}

.form-control.is-invalid {
  border-color: #dc3545; /* Cor de borda vermelha para campos inválidos */
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 5px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.form-status {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

```

Neste exemplo, você pode ver claramente como a referência `#emailInput="ngModel"` nos permite acessar as propriedades de validação do `FormControl` subjacente (`emailInput.invalid`, `emailInput.touched`, `emailInput.errors`) para exibir mensagens de erro condicionais e dinâmicas. Além disso, o `@ViewChild` no componente demonstra como obter essa referência para manipulação programática, se necessário.

---

Espero que esta explicação detalhada tenha clareado como criar e usar referências de `FormControl` com `ngModel` em seus formulários *Template-Driven*, Gedê\! Se tiver mais alguma dúvida ou quiser se aprofundar em outro tópico, é só chamar A.R.I.A.\!