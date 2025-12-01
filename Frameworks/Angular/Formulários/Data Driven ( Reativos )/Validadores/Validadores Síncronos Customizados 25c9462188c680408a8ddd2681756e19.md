# Validadores Síncronos Customizados

---

### **Introdução**

No ecossistema Angular, os Formulários Reativos (Reactive Forms) oferecem uma abordagem poderosa e explícita para gerenciar o estado de um formulário. Uma de suas características mais importantes é a capacidade de validar as entradas do usuário. Embora o Angular forneça um conjunto de validadores prontos para uso (`Validators.required`, `Validators.minLength`, etc.), muitas aplicações do mundo real exigem regras de negócio específicas que vão além do básico. É aqui que entram os **Validadores Síncronos Customizados**: funções que criamos para encapsular lógicas de validação personalizadas, permitindo um controle fino e reutilizável sobre a integridade dos dados do formulário. Esta explicação detalhará cada aspecto da criação e utilização desses validadores.

---

### **Sumário**

- **Conceitos Fundamentais:** Entendimento do que são validadores síncronos, a interface `ValidatorFn` e o objeto `ValidationErrors`.
- **Sintaxe e Uso:** Como criar e aplicar uma função de validação customizada em um `FormControl`.
- **Validadores com Parâmetros:** A técnica de "Factory Function" para criar validadores dinâmicos.
- **Métodos e Propriedades:** Exploração completa das propriedades (`errors`, `status`, `valid`) e métodos (`hasError`, `setValidators`, `updateValueAndValidity`) relacionados à validação.
- **Restrições de Uso:** Quando optar por um validador síncrono e quando um assíncrono é necessário.
- **Elementos Associados:** A interação dos validadores com `FormControl`, `FormGroup`, `FormBuilder` e a classe `Validators`.
- **Melhores Práticas e Casos de Uso:** Estratégias para escrever validadores limpos, reutilizáveis e eficientes.
- **Exemplo Completo:** Uma implementação prática de um formulário de cadastro com múltiplos validadores customizados.
- **Tópicos para Aprofundamento:** Sugestões para expandir seu conhecimento.

---

### **Conceitos Fundamentais**

A base para criar validadores customizados reside na compreensão de duas peças-chave do framework Angular: a interface `ValidatorFn` e o tipo `ValidationErrors`.

- **O que é um Validador Síncrono?**
Um validador síncrono é, em sua essência, uma **função pura** que recebe um controle de formulário (`AbstractControl`) como seu único argumento e executa uma lógica de validação **imediatamente (de forma síncrona)**. O retorno dessa função determina o estado de validade do controle.
    - Se a validação **passar** (o valor do controle é válido), a função deve retornar `null`.
    - Se a validação **falhar** (o valor é inválido), a função deve retornar um objeto. Este objeto, conhecido como `ValidationErrors`, contém informações sobre o erro, servindo como uma "bandeira" que indica qual regra específica falhou.
- **A Interface `ValidatorFn`**
Embora não seja estritamente necessário implementar uma interface em TypeScript para funções, o Angular nos fornece a `ValidatorFn` para garantir a correta assinatura de nossa função de validação. A assinatura é a seguinte:
    
    ```tsx
    interface ValidatorFn {
      (control: AbstractControl): ValidationErrors | null
    }
    
    ```
    
    - `control: AbstractControl`: Este é o parâmetro de entrada. `AbstractControl` é a classe base para `FormControl`, `FormGroup` e `FormArray`. Isso significa que um validador pode ser aplicado não apenas a um campo individual, mas também a um grupo de campos ou a um array de campos, permitindo validações complexas (como "a senha e a confirmação de senha devem ser iguais").
- **O Objeto `ValidationErrors`**
Este é o objeto retornado em caso de falha na validação. É um tipo flexível que permite estruturar as informações de erro da maneira que for mais conveniente para sua aplicação. A estrutura é, essencialmente, um objeto onde as chaves são strings (o nome do erro) e os valores podem ser qualquer coisa (`any`), mas geralmente são `boolean` (`true`) ou um objeto com mais detalhes sobre o erro.
    
    ```tsx
    type ValidationErrors = {
      [key: string]: any;
    }
    
    ```
    
    **Exemplo de retorno de erro:**
    Se um campo não puder conter a palavra "teste", o retorno em caso de falha poderia ser:
    `{ "forbiddenWord": true }` ou `{ "forbiddenWord": { "value": "teste" } }`
    

---

### **Sintaxe e Uso**

Vamos criar nosso primeiro validador customizado. A regra será simples: um `FormControl` não pode conter espaços em branco.

**1. Criando a Função Validadora**

É uma boa prática criar os validadores em um arquivo separado (ex: `custom-validators.ts`) para que possam ser facilmente importados e reutilizados em toda a aplicação.

```tsx
// src/app/validators/custom-validators.ts

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador que verifica se o valor do controle contém espaços em branco.
 * @param control O controle de formulário a ser validado.
 * @returns Um objeto de erro se houver espaços, caso contrário, null.
 */
export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  // Verifica se o valor existe e se é uma string
  if (control.value && typeof control.value === 'string') {
    // A regex /\\s/ verifica a presença de qualquer caractere de espaço em branco
    const hasWhitespace = /\\s/.test(control.value);

    // Se houver espaço, retorna o objeto de erro.
    // A chave 'noWhitespace' será usada no template para exibir a mensagem de erro.
    if (hasWhitespace) {
      return { 'noWhitespace': true };
    }
  }

  // Se a validação passar (sem valor ou sem espaços), retorna null.
  return null;
}

```

**2. Aplicando o Validador em um `FormControl`**

Você pode aplicar o validador ao criar o `FormControl`, seja diretamente ou usando o `FormBuilder`.

```tsx
// no-seu-component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '../validators/custom-validators'; // Importe seu validador

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      // O segundo elemento do array são os validadores síncronos.
      // Pode ser um único validador ou um array deles.
      username: ['', [Validators.required, noWhitespaceValidator]],
      password: ['', Validators.required]
    });
  }
}

```

**3. Exibindo a Mensagem de Erro no Template HTML**

Agora, você pode usar a propriedade `errors` e o método `hasError` do controle no template para exibir uma mensagem de erro condicional.

```html
<form [formGroup]="signupForm">
  <div>
    <label for="username">Username:</label>
    <input id="username" type="text" formControlName="username">

    <div *ngIf="signupForm.get('username')?.hasError('noWhitespace') && signupForm.get('username')?.touched">
      O nome de usuário não pode conter espaços.
    </div>
    <div *ngIf="signupForm.get('username')?.hasError('required') && signupForm.get('username')?.touched">
      O nome de usuário é obrigatório.
    </div>
  </div>

  </form>

```

---

### **Métodos e Propriedades Relevantes do `AbstractControl`**

Para interagir com o estado de validação de um controle, você usará um conjunto de propriedades e métodos fornecidos pela classe `AbstractControl`.

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `valid` | `boolean` | Retorna `true` se o controle e todos os seus descendentes são válidos. |
| `invalid` | `boolean` | Retorna `true` se o controle ou algum de seus descendentes é inválido. |
| `pending` | `boolean` | Retorna `true` se o controle ou algum de seus descendentes está com uma validação assíncrona em andamento. |
| `disabled` | `boolean` | Retorna `true` se o controle está desabilitado. Controles desabilitados são excluídos da validação. |
| `enabled` | `boolean` | Retorna `true` se o controle está habilitado. |
| `status` | `string` | O estado de validação agregado: `'VALID'`, `'INVALID'`, `'PENDING'` ou `'DISABLED'`. |
| `errors` | `ValidationErrors \| null` | Retorna um objeto contendo todos os erros de validação do controle. Se o controle for válido, retorna `null`. |
| `value` | `any` | O valor atual do controle. |
| `pristine` | `boolean` | Retorna `true` se o valor do controle não foi alterado pelo usuário. |
| `dirty` | `boolean` | Retorna `true` se o valor do controle foi alterado pelo usuário. |
| `touched` | `boolean` | Retorna `true` se o usuário tocou no elemento do formulário (evento `blur`). |
| `untouched` | `boolean` | Retorna `true` se o usuário ainda não tocou no elemento do formulário. |

| Método | Descrição | Sintaxe de Uso |
| --- | --- | --- |
| `hasError(errorCode)` | Verifica se o controle possui um erro de validação específico. | `control.hasError('required')` |
| `getError(errorCode)` | Retorna o valor associado a um erro específico, permitindo acessar detalhes do erro. | `control.getError('minlength')` retornaria `{ requiredLength: 8, actualLength: 5 }`. |
| `setValidators(validators)` | **Substitui** os validadores síncronos existentes por um novo conjunto. | `control.setValidators([Validators.required, Validators.minLength(8)])` |
| `addValidators(validators)` | **Adiciona** um ou mais validadores síncronos ao conjunto existente. Disponível a partir do Angular 14. | `control.addValidators(noWhitespaceValidator)` |
| `removeValidators(validators)` | **Remove** um ou mais validadores síncronos do conjunto existente. Disponível a partir do Angular 14. | `control.removeValidators(Validators.required)` |
| `clearValidators()` | Remove todos os validadores síncronos do controle. | `control.clearValidators()` |
| `updateValueAndValidity()` | Recalcula o valor e o estado de validação do controle. Essencial após manipular validadores programaticamente. | `control.updateValueAndValidity()` |

---

### **Restrições de Uso: Síncrono vs. Assíncrono**

A principal restrição de um validador síncrono é sua natureza: ele deve retornar um resultado **imediatamente**.

**Use um validador SÍNCRONO quando:**

- A lógica de validação depende **apenas** do valor do próprio controle ou de outros controles no mesmo grupo de formulário.
- A validação não requer operações que levem tempo, como chamadas de API (HTTP), acesso a banco de dados ou operações complexas no sistema de arquivos.
- Exemplos: verificar formato de e-mail, idade mínima, se um campo é obrigatório, se duas senhas coincidem.

**NÃO use um validador síncrono (use um ASSÍNCRONO) quando:**

- A validação requer uma consulta a um servidor externo.
- **Cenário Clássico:** Verificar se um nome de usuário ou e-mail já existe no banco de dados. Esta operação envolve uma chamada HTTP, que é inerentemente assíncrona. Tentar fazer isso de forma síncrona bloquearia a thread principal da interface do usuário, congelando a aplicação.
- A lógica de validação é computacionalmente muito pesada e pode impactar a performance se executada instantaneamente a cada mudança de valor.

---

### **Elementos Associados**

- **`FormControl`**: A unidade fundamental de um formulário reativo. Representa um campo de entrada individual (`input`, `select`, etc.). É aqui que os validadores são aplicados diretamente.
- **`FormGroup`**: Agrupa uma coleção de `FormControl`s. Permite validar campos em relação uns aos outros (validação cruzada de campos). Por exemplo, um validador aplicado a um `FormGroup` pode verificar se `password` e `confirmPassword` são iguais.
- **`FormBuilder`**: Uma classe de serviço (helper) que simplifica a criação de instâncias de `FormControl` e `FormGroup`. É a maneira recomendada de construir formulários complexos.
- **`Validators`**: Uma classe fornecida pelo Angular (`@angular/forms`) que contém um conjunto de validadores síncronos e assíncronos prontos para uso (`required`, `minLength`, `maxLength`, `email`, `pattern`, etc.).

---

### **Melhores Práticas e Casos de Uso**

- **Reutilização (DRY - Don't Repeat Yourself):** Sempre crie seus validadores em arquivos separados. Isso os torna fáceis de importar, testar e reutilizar em diferentes componentes e módulos.
- **Validadores Parametrizados (Factory Functions):** Para validadores que precisam de configuração, use uma função de fábrica (uma função que retorna outra função).
    - **Caso de Uso:** Criar um validador de idade mínima que aceite a idade como parâmetro.
    
    <!-- end list -->
    
    ```tsx
    // src/app/validators/custom-validators.ts
    
    import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
    
    export function minAgeValidator(minAge: number): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
          return null; // Não validar se o campo estiver vazio
        }
    
        const birthDate = new Date(control.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
    
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
    
        return age >= minAge ? null : { 'minAge': { requiredAge: minAge, actualAge: age } };
      };
    }
    
    ```
    
    **Uso no componente:**`birthDate: ['', [Validators.required, minAgeValidator(18)]]`
    
- **Validação Cruzada de Campos (Cross-Field Validation):** Aplique o validador ao `FormGroup` pai, não aos `FormControl`s individuais.
    - **Caso de Uso:** Verificar se a senha e a confirmação de senha são idênticas.
    
    <!-- end list -->
    
    ```tsx
    // src/app/validators/custom-validators.ts
    
    export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
      return (formGroup: AbstractControl): ValidationErrors | null => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);
    
        if (!control || !matchingControl) {
          return null;
        }
    
        // Define o erro no controle de confirmação para exibição da mensagem no lugar certo
        if (matchingControl.errors && !matchingControl.errors['passwordMatch']) {
          return null;
        }
    
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ 'passwordMatch': true });
          return { 'passwordMatch': true }; // O erro é retornado no nível do FormGroup
        } else {
          matchingControl.setErrors(null);
          return null;
        }
      };
    }
    
    ```
    
    **Uso no componente:**
    
    ```tsx
    this.signupForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator('password', 'confirmPassword')
    });
    
    ```
    

---

### **Exemplo Completo: Formulário de Inscrição de Evento**

Vamos consolidar tudo em um formulário mais complexo.

**Regras de Negócio:**

1. Nome do participante é obrigatório e não pode conter números.
2. E-mail é obrigatório e deve ter um formato válido.
3. Idade deve ser de no mínimo 18 anos.
4. O participante deve escolher um "código de inscrição" que deve começar com "EVT-" e ser seguido por 5 números.

**1. Criando os Validadores Customizados (`custom-validators.ts`)**

```tsx
// src/app/validators/custom-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador 1: Não permitir números
export function noNumbersValidator(control: AbstractControl): ValidationErrors | null {
  const hasNumber = /[0-9]/.test(control.value);
  return hasNumber ? { 'noNumbers': true } : null;
}

// Validador 2: Idade mínima (Factory Function)
export function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= minAge ? null : { 'minAge': { requiredAge: minAge, actualAge: age } };
  };
}

// Validador 3: Formato específico do código de inscrição (usando regex)
export function registrationCodeValidator(control: AbstractControl): ValidationErrors | null {
  const pattern = /^EVT-\\d{5}$/;
  const isValid = pattern.test(control.value);
  return isValid ? null : { 'invalidCodeFormat': true };
}

```

**2. O Componente (`event-registration.component.ts`)**

```tsx
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noNumbersValidator, minAgeValidator, registrationCodeValidator } from '../validators/custom-validators';

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
})
export class EventRegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, noNumbersValidator]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required, minAgeValidator(18)]],
      registrationCode: ['', [Validators.required, registrationCodeValidator]]
    });
  }

  get f() { return this.registrationForm.controls; }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Formulário válido!', this.registrationForm.value);
    } else {
      console.log('Formulário inválido!');
      // Marcar todos os campos como "touched" para exibir os erros
      this.registrationForm.markAllAsTouched();
    }
  }
}

```

**3. O Template (`event-registration.component.html`)**

```html
<form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="fullName">Nome Completo</label>
    <input id="fullName" formControlName="fullName">
    <div *ngIf="f.fullName.touched && f.fullName.errors">
      <small *ngIf="f.fullName.hasError('required')">Nome é obrigatório.</small>
      <small *ngIf="f.fullName.hasError('noNumbers')">Nome não pode conter números.</small>
    </div>
  </div>

  <div>
    <label for="email">E-mail</label>
    <input id="email" type="email" formControlName="email">
    <div *ngIf="f.email.touched && f.email.errors">
      <small *ngIf="f.email.hasError('required')">E-mail é obrigatório.</small>
      <small *ngIf="f.email.hasError('email')">Formato de e-mail inválido.</small>
    </div>
  </div>

  <div>
    <label for="birthDate">Data de Nascimento</label>
    <input id="birthDate" type="date" formControlName="birthDate">
    <div *ngIf="f.birthDate.touched && f.birthDate.errors">
      <small *ngIf="f.birthDate.hasError('required')">Data de nascimento é obrigatória.</small>
      <small *ngIf="f.birthDate.hasError('minAge')">
        Você deve ter no mínimo {{ f.birthDate.getError('minAge').requiredAge }} anos.
      </small>
    </div>
  </div>

  <div>
    <label for="registrationCode">Código de Inscrição</label>
    <input id="registrationCode" formControlName="registrationCode">
    <div *ngIf="f.registrationCode.touched && f.registrationCode.errors">
      <small *ngIf="f.registrationCode.hasError('required')">Código é obrigatório.</small>
      <small *ngIf="f.registrationCode.hasError('invalidCodeFormat')">
        Formato inválido. Use EVT- seguido por 5 números (ex: EVT-12345).
      </small>
    </div>
  </div>

  <button type="submit" [disabled]="registrationForm.invalid">Registrar</button>
</form>

```

---

### **Tópicos para Aprofundamento**

1. **Validadores Assíncronos Customizados:** O próximo passo natural. Aprenda a criar validadores que dependem de operações assíncronas, como chamadas HTTP, usando a interface `AsyncValidatorFn` e retornando `Observables` ou `Promises`.
2. **Testes Unitários para Validadores:** Validadores são funções puras, o que os torna extremamente fáceis de testar. Aprenda a escrever testes unitários para garantir que sua lógica de validação funcione como esperado em todos os cenários.
3. **Diretivas de Validação Customizadas:** Uma abordagem alternativa onde a lógica de validação é encapsulada dentro de uma diretiva, permitindo que você a adicione diretamente a um elemento do template (útil tanto para formulários reativos quanto para `template-driven`).
4. **Validação Dinâmica:** Explore como adicionar e remover validadores de um controle de formulário dinamicamente em tempo de execução, com base em outras ações do usuário (por exemplo, tornar um campo obrigatório apenas se um determinado checkbox for marcado).

Espero que esta explicação super detalhada seja exatamente o que você precisava, Gedê. Se tiver qualquer outra dúvida, é só chamar\!