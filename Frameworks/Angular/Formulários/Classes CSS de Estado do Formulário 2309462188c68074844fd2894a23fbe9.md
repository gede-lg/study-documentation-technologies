# Classes CSS de Estado do Formulário

Perfeito, Gedê\! Entendido o pedido. A.R.I.A. vai te ajudar a entender tudo sobre as **Classes CSS de Estado de Formulário no Angular** com a profundidade que você precisa. Vamos lá\!

---

## Classes CSS de Estado de Formulário no Angular: Uma Explicação Completa

### Introdução

Ao trabalhar com formulários em aplicações web modernas, a **experiência do usuário (UX)** é crucial. Mostrar feedback visual sobre o estado de um campo — se ele foi tocado, se é válido, se está pendente de validação — é fundamental para guiar o usuário e melhorar a usabilidade. No **Angular**, os formulários reativos e baseados em template fornecem um conjunto robusto de classes CSS que são automaticamente aplicadas a elementos de controle de formulário, refletindo seus estados internos. Entender e utilizar essas classes permite que você crie interfaces de formulário dinâmicas, responsivas e intuitivas.

### Sumário

Nesta explicação detalhada, abordaremos os seguintes pontos:

- **Conceitos Fundamentais:** A base teórica por trás do controle de estado de formulários no Angular.
- **Sintaxe Detalhada e Uso Prático:** Como as classes são aplicadas e como você pode estilizá-las.
- **Cenários de Restrição ou Não Aplicação:** Onde e por que essas classes podem não ser a melhor solução.
- **Componentes Chave Associados:** Análise de `FormControl`, `FormGroup`, `NgModel`, `NgForm`, e diretivas como `NgControl`.
- **Melhores Práticas e Padrões de Uso:** Recomendações para tirar o máximo proveito dessas classes.
- **Exemplo Prático Completo:** Um cenário ponta a ponta demonstrando o uso das classes.

---

### Conceitos Fundamentais

No Angular, a gestão do estado dos formulários é feita de forma declarativa e reativa. Independentemente de você usar **Formulários Reativos** (abordagem preferida para formulários complexos) ou **Formulários Baseados em Template** (mais simples, para casos menos complexos), o Angular associa **diretivas de formulário** a elementos HTML. Essas diretivas, como `FormControlName`, `formControl`, ou `ngModel`, monitoram o estado de cada controle de entrada (input, select, textarea, etc.) e do formulário como um todo.

Com base nesse monitoramento, o Angular automaticamente adiciona ou remove classes CSS predefinidas aos elementos do DOM. Essas classes seguem um padrão e descrevem diversos estados importantes:

- **Validade:** Se o valor do controle atende às regras de validação.
- **Modificação (Dirty/Pristine):** Se o usuário interagiu ou alterou o valor original do controle.
- **Interação (Touched/Untouched):** Se o controle perdeu o foco (blur event).
- **Status de Validação (Validating/Pending):** Se há uma validação assíncrona em andamento.

O propósito principal dessas classes é permitir que desenvolvedores e designers apliquem **estilos CSS** específicos para fornecer feedback visual instantâneo ao usuário. Por exemplo, um campo inválido pode ter uma borda vermelha, enquanto um campo válido pode ter uma borda verde.

---

### Sintaxe Detalhada e Uso Prático

As classes CSS de estado de formulário no Angular são prefixadas com `ng-` e são aplicadas diretamente aos elementos de controle do formulário (como `<input>`, `<select>`, `<textarea>`) ou aos elementos que encapsulam esses controles (como `<form>`).

Aqui está a lista das classes principais e o que elas significam:

- **`ng-valid`**: O controle ou formulário é válido, ou seja, atende a todas as suas regras de validação.
    
    ```css
    /* Exemplo de estilo para campo válido */
    .ng-valid {
        border-color: #28a745; /* Verde */
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
    }
    
    ```
    
- **`ng-invalid`**: O controle ou formulário é inválido. Pelo menos uma regra de validação não foi atendida.
    
    ```css
    /* Exemplo de estilo para campo inválido */
    .ng-invalid {
        border-color: #dc3545; /* Vermelho */
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    ```
    
- **`ng-pending`**: O controle ou formulário está em processo de validação assíncrona.
    
    ```css
    /* Exemplo de estilo para campo com validação pendente */
    .ng-pending {
        border-color: #ffc107; /* Amarelo */
        box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
    }
    
    ```
    
- **`ng-pristine`**: O controle ou formulário não foi modificado pelo usuário desde que foi inicializado. Seu valor é o mesmo do valor inicial.
    
    ```css
    /* Pode ser usado para dar um estilo neutro antes da interação */
    .ng-pristine {
        /* Estilos padrão ou neutros */
    }
    
    ```
    
- **`ng-dirty`**: O controle ou formulário foi modificado pelo usuário. Seu valor é diferente do valor inicial.
    
    ```css
    /* Estilo para campos que já foram alterados */
    .ng-dirty {
        background-color: #f8f9fa; /* Um cinza claro */
    }
    
    ```
    
- **`ng-untouched`**: O controle não foi focado e depois perdeu o foco (não houve evento `blur`).
    
    ```css
    /* Estilo para campos que ainda não foram tocados */
    .ng-untouched {
        /* Nenhuma interação ainda */
    }
    
    ```
    
- **`ng-touched`**: O controle foi focado e depois perdeu o foco (houve um evento `blur`). Isso é útil para mostrar erros de validação apenas após o usuário tentar interagir com o campo.
    
    ```css
    /* Exemplo de estilo para campo tocado e inválido */
    .ng-touched.ng-invalid {
        border-color: #dc3545;
        background-color: #fdd; /* Fundo levemente avermelhado */
    }
    
    ```
    

**Como as classes são aplicadas no HTML:**

Quando você tem um formulário Angular, seja ele reativo ou baseado em template, o Angular adiciona automaticamente essas classes aos elementos `input`, `select`, `textarea` e até mesmo à tag `<form>`.

**Exemplo com Formulário Reativo:**

```tsx
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  template: `
    <form [formGroup]="myForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="name">Nome:</label>
        <input type="text" id="name" formControlName="name" required>
        <div *ngIf="myForm.get('name')?.invalid && myForm.get('name')?.touched" class="error-message">
          Nome é obrigatório.
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <email type="email" id="email" formControlName="email" email required>
        <div *ngIf="myForm.get('email')?.invalid && myForm.get('email')?.touched" class="error-message">
          Email inválido.
        </div>
      </div>

      <button type="submit" [disabled]="myForm.invalid">Enviar</button>
    </form>
  `,
  styles: [`
    .form-group { margin-bottom: 15px; }
    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 100%;
    }
    .ng-touched.ng-invalid {
      border-color: red;
      box-shadow: 0 0 0 0.2rem rgba(255, 0, 0, 0.25);
    }
    .ng-touched.ng-valid {
      border-color: green;
      box-shadow: 0 0 0 0.2rem rgba(0, 128, 0, 0.25);
    }
    .error-message {
      color: red;
      font-size: 0.8em;
      margin-top: 5px;
    }
    form.ng-invalid button[type="submit"] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class FormComponent implements OnInit {
  myForm!: FormGroup;

  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      console.log('Formulário enviado!', this.myForm.value);
    } else {
      console.log('Formulário inválido.');
    }
  }
}

```

No exemplo acima, observe como os seletores CSS `.ng-touched.ng-invalid` e `.ng-touched.ng-valid` são usados para estilizar os campos. O Angular adiciona essas classes automaticamente ao `<input>` conforme o usuário interage.

**Exemplo com Formulário Baseado em Template:**

```html
<form #heroForm="ngForm" (ngSubmit)="onSubmit(heroForm)">
  <div class="form-group">
    <label for="name">Nome:</label>
    <input type="text" id="name" name="name" [(ngModel)]="model.name" #name="ngModel" required>
    <div *ngIf="name.invalid && name.touched" class="error-message">
      Nome é obrigatório.
    </div>
  </div>

  <button type="submit" [disabled]="!heroForm.valid">Enviar</button>
</form>

```

```tsx
// app.component.ts
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-hero-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class HeroFormComponent {
  model = { name: '' };

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Formulário enviado!', this.model);
    } else {
      console.log('Formulário inválido.');
    }
  }
}

```

O `ngModel` em formulários baseados em template também adiciona as mesmas classes CSS (`ng-valid`, `ng-invalid`, etc.) ao elemento `<input>`. A variável template `#name="ngModel"` nos dá acesso ao controle de formulário individual e seus estados (`name.invalid`, `name.touched`).

**Dica:** Para depurar e ver quais classes estão sendo aplicadas, inspecione os elementos do formulário no navegador (DevTools) enquanto interage com eles.

---

### Cenários de Restrição ou Não Aplicação

Embora as classes CSS de estado de formulário do Angular sejam extremamente úteis, existem cenários onde elas podem não ser a melhor ou a única solução:

1. **Estilização Extremamente Customizada:** Se a sua aplicação exige uma estilização que vai muito além das simples bordas e cores de fundo, você pode precisar de uma abordagem mais granular. Isso pode envolver:
    - **Classes CSS específicas da sua aplicação:** Definir classes como `.my-custom-invalid-field` e aplicá-las condicionalmente usando `ngClass` ou `[class.my-class]="condition"`.
    - **Manipulação direta do DOM (desaconselhável no Angular):** Evite ao máximo manipular o DOM diretamente para aplicar estilos, pois isso pode levar a inconsistências com o ciclo de detecção de mudanças do Angular.
2. **Bibliotecas de Componentes UI:** Se você estiver usando uma biblioteca de componentes UI como Angular Material, PrimeNG, Ng-Zorro, etc., esses componentes geralmente já vêm com sua própria lógica de estilo para estados de formulário. Eles podem não depender diretamente das classes `ng-valid`, `ng-invalid` para sua estilização padrão, ou podem ter wrappers que as utilizam internamente. Nesses casos, você estilizará através das opções e APIs fornecidas pela própria biblioteca.
3. **Validação Customizada Complexa:** Para validações muito específicas que requerem lógica de negócios complexa, ou para cenários onde você precisa de mais controle sobre como e quando as mensagens de erro são exibidas, você pode combinar o uso das classes CSS com lógica em TypeScript para exibir mensagens ou aplicar estilos adicionais baseados em condições mais complexas do que apenas `ng-invalid` e `ng-touched`.

---

### Componentes Chave Associados

As classes CSS de estado de formulário são um reflexo das propriedades de estado dos controles de formulário subjacentes. Para entender completamente como elas funcionam, é crucial conhecer os componentes e diretivas chave:

1. **`FormControl`**: Representa um único controle de formulário (como um input, select ou textarea). Ele mantém o valor atual e o estado de validação daquele controle.
    - **Propriedades de estado:**
        - `valid: boolean`: `true` se o controle é válido, `false` caso contrário.
        - `invalid: boolean`: `true` se o controle é inválido, `false` caso contrário.
        - `pending: boolean`: `true` se a validação assíncrona está em andamento.
        - `pristine: boolean`: `true` se o controle não foi modificado.
        - `dirty: boolean`: `true` se o controle foi modificado.
        - `touched: boolean`: `true` se o controle foi focado e perdeu o foco.
        - `untouched: boolean`: `true` se o controle nunca foi focado ou perdeu o foco.
    - **Sintaxe de Uso (Formulários Reativos):**
        
        ```tsx
        // No componente
        myField = new FormControl('', Validators.required);
        
        // No template
        <input [formControl]="myField">
        
        ```
        
2. **`FormGroup`**: Agrupa múltiplos `FormControl` (e/ou outros `FormGroup`s) em uma única unidade. Ele agrega o valor e o estado de validação de todos os seus controles filhos. Se qualquer controle filho for inválido, o `FormGroup` também será inválido. As mesmas propriedades de estado do `FormControl` (valid, invalid, dirty, touched, etc.) se aplicam ao `FormGroup`.
    - **Sintaxe de Uso (Formulários Reativos):**
        
        ```tsx
        // No componente
        myForm = new FormGroup({
            name: new FormControl('', Validators.required),
            email: new FormControl('', Validators.email)
        });
        
        // No template
        <form [formGroup]="myForm">
            <input formControlName="name">
            <input formControlName="email">
        </form>
        
        ```
        
3. **`FormArray`**: Agrupa múltiplos `FormControl` ou `FormGroup`s em um array. Útil para formulários dinâmicos onde o número de campos pode mudar (ex: lista de telefones, itens de um pedido). Assim como `FormGroup`, ele agrega o estado de seus filhos.
    - **Sintaxe de Uso (Formulários Reativos):**
        
        ```tsx
        // No componente
        phoneNumbers = new FormArray([
            new FormControl('123-456-7890'),
            new FormControl('098-765-4321')
        ]);
        
        // No template
        <div formArrayName="phoneNumbers">
            <input *ngFor="let control of phoneNumbers.controls; let i = index" [formControlName]="i">
        </div>
        
        ```
        
4. **`NgModel`**: Diretiva usada em **Formulários Baseados em Template** para criar um `FormControl` implícito para um elemento de entrada. Ela lida com a vinculação de dados bidirecional (`[(ngModel)]`).
    - **Propriedades de estado:** As mesmas propriedades (`valid`, `invalid`, `touched`, etc.) estão disponíveis através da variável de template exportada (`#nomeVar="ngModel"`).
    - **Sintaxe de Uso (Formulários Baseados em Template):**
        
        ```html
        <input type="text" name="username" [(ngModel)]="user.username" #username="ngModel" required>
        <div *ngIf="username.invalid && username.touched">Campo obrigatório.</div>
        
        ```
        
5. **`NgForm`**: Diretiva usada em **Formulários Baseados em Template** que cria um `FormGroup` de nível superior implicitamente em um elemento `<form>`. Ela agrega todos os `NgModel`s dentro do formulário.
    - **Propriedades de estado:** As mesmas propriedades (`valid`, `invalid`, `touched`, etc.) se aplicam ao `NgForm` e podem ser acessadas via uma variável de template (`#myForm="ngForm"`).
    - **Sintaxe de Uso (Formulários Baseados em Template):**
        
        ```html
        <form #myForm="ngForm">
            <button type="submit" [disabled]="myForm.invalid">Salvar</button>
        </form>
        
        ```
        
6. **`NgControl`**: É uma classe abstrata base para diretivas de controle de formulário (`FormControlName`, `ngModel`, `formControl`). Ela define a interface comum para as propriedades de estado que o Angular monitora. Todas as diretivas de controle de formulário estendem `NgControl` para fornecer acesso a essas propriedades.

---

### Melhores Práticas e Padrões de Uso

Para tirar o máximo proveito das classes CSS de estado de formulário no Angular, considere as seguintes melhores práticas:

1. **Estilize para `ng-invalid` combinado com `ng-touched` ou `ng-dirty`:**
    - **`ng-touched.ng-invalid`**: Ideal para exibir mensagens de erro e estilos de validação **depois que o usuário interagiu** com o campo e o deixou. Isso evita que o formulário pareça "cheio de erros" antes mesmo de o usuário começar a preenchê-lo.
    - **`ng-dirty.ng-invalid`**: Útil se você quer mostrar um erro assim que o usuário **modifica** o campo, mesmo sem ter saído dele.
    - **Formulário como um todo:** Para desabilitar o botão de submissão, use a propriedade `invalid` do formulário (`[disabled]="myForm.invalid"` ou `[disabled]="!heroForm.valid"`).
2. **Mantenha os seletores CSS específicos:** Para evitar que os estilos de formulário vazem para outras partes da sua aplicação, use seletores CSS mais específicos, como `input.ng-invalid` ou classes de contexto (`.my-form input.ng-invalid`).
3. **Utilize feedback visual claro:**
    - **Bordas coloridas:** Vermelho para inválido, verde para válido.
    - **Ícones:** Adicione ícones (ex: um "X" para erro, um "✓" para sucesso) ao lado dos campos para feedback rápido.
    - **Mensagens de erro:** Exiba mensagens de erro claras e concisas, condicionadas ao estado `invalid` e `touched` (ou `dirty`) do controle.
4. **Consistência é chave:** Mantenha um design de formulário consistente em toda a sua aplicação. Isso inclui cores, espaçamento e a forma como as mensagens de erro são apresentadas.
5. **Acessibilidade:** Certifique-se de que seus estilos de feedback de formulário também sejam acessíveis. Use cores com bom contraste e forneça mensagens de erro claras para leitores de tela (utilizando atributos ARIA como `aria-invalid` e `aria-describedby`).
6. **Componentização:** Se você tem muitos formulários semelhantes, considere criar componentes reutilizáveis para campos de entrada ou grupos de campos, encapsulando a lógica de exibição de erros e estilização. Isso torna o código mais limpo e fácil de manter.
7. **Validação Assíncrona (`ng-pending`):** Ao usar validadores assíncronos (por exemplo, verificar se um nome de usuário já existe no servidor), use a classe `ng-pending` para indicar que uma verificação está em andamento (ex: um spinner de carregamento).
    
    ```css
    input.ng-pending {
        background-image: url('assets/spinner.gif'); /* Seu spinner de carregamento */
        background-repeat: no-repeat;
        background-position: right 5px center;
        padding-right: 30px; /* Espaço para o spinner */
    }
    
    ```
    

---

### Exemplo Prático Completo

Vamos construir um formulário de cadastro de usuário simples, utilizando as classes CSS para feedback visual.

**Estrutura do Projeto (Assumindo um projeto Angular novo):**

```
src/
├── app/
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.css
│   └── app.module.ts
└── styles.css

```

**`src/app/app.module.ts`**:

```tsx
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Importar para Formulários Reativos

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule // Adicionei aqui
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

**`src/app/app.component.ts`**:

```tsx
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cadastroForm!: FormGroup;

  ngOnInit(): void {
    this.cadastroForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email], this.emailExisteValidator),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmarSenha: new FormControl('', Validators.required)
    }, { validators: this.senhasConferemValidator }); // Validador de grupo
  }

  // Validador assíncrono simulado
  emailExisteValidator(control: AbstractControl): Promise<{[key: string]: any} | null> | Observable<{[key: string]: any} | null> {
    const email = control.value;
    if (!email) {
      return of(null); // Não validar se o campo está vazio
    }
    // Simula uma chamada API
    return of(email === 'teste@teste.com' ? { emailExiste: true } : null)
           .pipe(delay(1000)); // Simula um atraso de rede
  }

  // Validador customizado para comparar senhas
  senhasConferemValidator(group: FormGroup): {[key: string]: any} | null {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;

    return senha === confirmarSenha ? null : { senhasNaoConferem: true };
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      console.log('Formulário de Cadastro Válido!', this.cadastroForm.value);
      alert('Cadastro realizado com sucesso!');
      this.cadastroForm.reset(); // Limpa o formulário
    } else {
      console.log('Formulário de Cadastro Inválido!');
      // Marcar todos os campos como 'touched' para exibir todos os erros
      this.markAllAsTouched(this.cadastroForm);
    }
  }

  // Função auxiliar para marcar todos os controles como 'touched'
  markAllAsTouched(formGroup: FormGroup | AbstractControl): void {
    if (formGroup instanceof FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markAllAsTouched(control);
        }
      });
    } else if (formGroup instanceof FormControl) {
      formGroup.markAsTouched();
    }
  }

  // Função para verificar se o campo deve mostrar erro
  shouldShowError(controlName: string): boolean | undefined {
    const control = this.cadastroForm.get(controlName);
    return control?.invalid && control?.touched;
  }
}

```

**`src/app/app.component.html`**:

```html
<div class="container">
  <h2>Cadastro de Usuário</h2>
  <form [formGroup]="cadastroForm" (ngSubmit)="onSubmit()">

    <div class="form-group">
      <label for="nome">Nome:</label>
      <input type="text" id="nome" formControlName="nome" placeholder="Digite seu nome completo">
      <div *ngIf="shouldShowError('nome')">
        <span *ngIf="cadastroForm.get('nome')?.errors?.['required']" class="error-message">Nome é obrigatório.</span>
        <span *ngIf="cadastroForm.get('nome')?.errors?.['minlength']" class="error-message">Nome deve ter no mínimo 3 caracteres.</span>
      </div>
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" formControlName="email" placeholder="seuemail@exemplo.com">
      <div *ngIf="shouldShowError('email')">
        <span *ngIf="cadastroForm.get('email')?.errors?.['required']" class="error-message">Email é obrigatório.</span>
        <span *ngIf="cadastroForm.get('email')?.errors?.['email']" class="error-message">Email inválido.</span>
        <span *ngIf="cadastroForm.get('email')?.errors?.['emailExiste']" class="error-message">Este email já está em uso.</span>
      </div>
      <div *ngIf="cadastroForm.get('email')?.pending" class="pending-message">Verificando email...</div>
    </div>

    <div class="form-group">
      <label for="senha">Senha:</label>
      <input type="password" id="senha" formControlName="senha" placeholder="Mínimo 6 caracteres">
      <div *ngIf="shouldShowError('senha')">
        <span *ngIf="cadastroForm.get('senha')?.errors?.['required']" class="error-message">Senha é obrigatória.</span>
        <span *ngIf="cadastroForm.get('senha')?.errors?.['minlength']" class="error-message">Senha deve ter no mínimo 6 caracteres.</span>
      </div>
    </div>

    <div class="form-group">
      <label for="confirmarSenha">Confirmar Senha:</label>
      <input type="password" id="confirmarSenha" formControlName="confirmarSenha" placeholder="Confirme sua senha">
      <div *ngIf="shouldShowError('confirmarSenha')">
        <span *ngIf="cadastroForm.get('confirmarSenha')?.errors?.['required']" class="error-message">Confirmação de senha é obrigatória.</span>
      </div>
      <div *ngIf="cadastroForm.errors?.['senhasNaoConferem'] && cadastroForm.get('confirmarSenha')?.touched" class="error-message">
        As senhas não conferem.
      </div>
    </div>

    <button type="submit" [disabled]="cadastroForm.invalid">Cadastrar</button>

    <pre>Formulário Status: {{ cadastroForm.status }}</pre>
    <pre>Nome: touched: {{ cadastroForm.get('nome')?.touched }}, valid: {{ cadastroForm.get('nome')?.valid }}, dirty: {{ cadastroForm.get('nome')?.dirty }}</pre>
    <pre>Email: touched: {{ cadastroForm.get('email')?.touched }}, valid: {{ cadastroForm.get('email')?.valid }}, dirty: {{ cadastroForm.get('email')?.dirty }}, pending: {{ cadastroForm.get('email')?.pending }}</pre>
  </form>
</div>

```

**`src/app/app.component.css`**:

```css
.container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: calc(100% - 20px); /* Ajuste para padding */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Estilos para as classes CSS de estado do formulário */

/* Estilo para campos que foram tocados e são inválidos */
input.ng-touched.ng-invalid {
  border-color: #dc3545; /* Vermelho */
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  background-color: #ffe0e3; /* Fundo levemente avermelhado */
}

/* Estilo para campos que foram tocados e são válidos */
input.ng-touched.ng-valid {
  border-color: #28a745; /* Verde */
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

/* Estilo para campos pendentes (validação assíncrona) */
input.ng-pending {
  border-color: #ffc107; /* Amarelo */
  box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
  background-color: #fffbe6;
  /* Opcional: ícone de carregamento */
  background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%23ffc107%22%3E%3Cpath%20d%3D%22M12%202c5.523%200%2010%204.477%2010%2010s-4.477%2010-10%2010-10-4.477-10-10%204.477-10%2010-10zm0%202c-4.418%200-8%203.582-8%208s3.582%208%208%208%208-3.582%208-8-3.582-8-8-8zM12%206.5a5.5%205.5%200%20015.5%205.5h-2c0-1.93-1.57-3.5-3.5-3.5S8.5%2010.07%208.5%2012H6.5A5.5%205.5%200%200112%206.5z%22%2F%3E%3C%2Fsvg%3E'); /* Pequeno spinner SVG inline */
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 40px; /* Mais espaço para o ícone */
}

/* Estilo para o formulário completo quando inválido (desabilitar botão) */
button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  width: 100%;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

button[type="submit"]:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.error-message {
  color: #dc3545; /* Vermelho */
  font-size: 0.85em;
  margin-top: 5px;
  display: block; /* Garante que a mensagem fique em nova linha */
}

.pending-message {
  color: #ffc107; /* Amarelo */
  font-size: 0.85em;
  margin-top: 5px;
  display: block;
}

pre {
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
    margin-top: 20px;
    font-size: 0.9em;
    color: #333;
    overflow-x: auto;
}

```

Neste exemplo:

- Utilizamos um **formulário reativo** (`cadastroForm`).
- O campo **email** possui um **validador assíncrono** simulado para demonstrar o estado `ng-pending`.
- As **senhas são comparadas** usando um validador customizado de grupo (`senhasConferemValidator`).
- As mensagens de erro são exibidas condicionalmente usando `ngIf` e as propriedades de estado (`invalid`, `touched`, `errors`).
- Os estilos CSS (`app.component.css`) são aplicados especificamente para `input.ng-touched.ng-invalid`, `input.ng-touched.ng-valid` e `input.ng-pending`, fornecendo feedback visual claro.
- O botão de submissão é desabilitado (`[disabled]="cadastroForm.invalid"`) enquanto o formulário não é válido.
- A função `markAllAsTouched` garante que, ao tentar submeter um formulário inválido, todos os erros sejam imediatamente exibidos.

---

Espero que esta explicação detalhada, A.R.I.A., tenha sido útil para você, Gedê\! Se tiver mais alguma dúvida ou quiser explorar outros aspectos, é só chamar.