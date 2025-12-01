# Validadores Assíncronos Customizados

---

### **Introdução**

No ecossistema de formulários reativos do Angular, a validação de dados é um pilar fundamental para garantir a integridade da informação e uma boa experiência do usuário. Enquanto os validadores síncronos lidam com checagens imediatas (ex: campo obrigatório, formato de e-mail), os **validadores assíncronos** entram em cena quando a validação depende de uma operação que não retorna um resultado instantaneamente. O caso de uso mais clássico é a verificação em um banco de dados, via API, se um nome de usuário ou e-mail já está em uso. Esta explicação detalhada irá guiá-lo através da teoria, sintaxe, implementação e melhores práticas para criar e utilizar validadores assíncronos customizados de forma eficaz.

---

### **Sumário**

- **Conceitos Fundamentais**: O que são, por que e quando usar validadores assíncronos.
- **Sintaxe e Uso**: Como criar validadores usando funções (`AsyncValidatorFn`) e classes (`AsyncValidator`).
- **Métodos e Propriedades Chave**: Análise das propriedades e métodos de `AbstractControl` relacionados à validação assíncrona.
- **Restrições de Uso**: Situações em que validadores assíncronos podem não ser a melhor escolha.
- **Elementos Associados**: Exploração de `Observable`, `HttpClient`, `ValidationErrors` e outras peças do quebra-cabeça.
- **Melhores Práticas e Casos de Uso**: Estratégias para otimização, tratamento de erros e cenários de aplicação comuns.
- **Exemplo Completo**: Uma implementação ponta a ponta de um formulário de cadastro com validação assíncrona de e-mail.
- **Tópicos para Aprofundamento**: Próximos passos para expandir seu conhecimento.

---

### **Conceitos Fundamentais**

### O que é um Validador Assíncrono?

Um validador assíncrono é uma função ou classe que executa uma lógica de validação que não se resolve imediatamente. Em vez de retornar um objeto de erro (`ValidationErrors`) ou `null` diretamente, como fazem os validadores síncronos, ele retorna um `Promise<ValidationErrors | null>` ou, mais comumente no universo Angular, um `Observable<ValidationErrors | null>`.

O ciclo de vida de um validador assíncrono é ativado após a passagem bem-sucedida de todos os validadores síncronos. Enquanto a validação assíncrona está em andamento, o status do controle de formulário (`FormControl`) é definido como `PENDING`. Ao ser concluída, a validação emite:

- `null`: se o valor for válido.
- `ValidationErrors`: um objeto contendo a chave do erro e informações adicionais, se o valor for inválido.

### Propósito e Casos de Uso

O propósito principal é validar um dado contra uma fonte externa de forma não bloqueante, garantindo que a interface do usuário permaneça responsiva.

- **Verificar Unicidade**: Checar se um nome de usuário, e-mail ou CPF já existe no banco de dados.
- **Validação de Códigos**: Validar um código de cupom ou um token de acesso contra um serviço externo.
- **Consulta de Dados Externos**: Verificar se um CEP informado corresponde a uma localidade válida através de uma API de endereços.
- **Regras de Negócio Complexas**: Executar uma validação que depende de uma série de cálculos ou consultas complexas no backend.

---

### **Sintaxe e Uso**

Existem duas maneiras principais de criar um validador assíncrono customizado:

1. **Função de Validação (`AsyncValidatorFn`)**: Uma abordagem mais simples e direta.
2. **Classe de Validação (`AsyncValidator`)**: Uma abordagem mais robusta, ideal quando o validador possui dependências que precisam ser injetadas (como um `HttpClient` para fazer chamadas de API).

### 1\. Usando uma Função (`AsyncValidatorFn`)

A `AsyncValidatorFn` é uma interface de função que recebe um `AbstractControl` como argumento e deve retornar um `Promise<ValidationErrors | null>` ou um `Observable<ValidationErrors | null>`.

**Sintaxe da Interface:**

```tsx
interface AsyncValidatorFn {
  (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>
}

```

**Exemplo Prático: Validador de "CPF Proibido"**

Vamos criar um validador que simula uma chamada de API para verificar se um CPF "123.456.789-00" já está em uso.

```tsx
// forbidden-cpf.validator.ts
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export function forbiddenCpfValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Simula uma chamada HTTP com um delay de 1.5 segundos
    return of(control.value === '123.456.789-00').pipe(
      delay(1500),
      map(isCpfForbidden => {
        // Se o CPF for o proibido, retorna um objeto de erro
        if (isCpfForbidden) {
          return { cpfForbidden: { value: control.value } };
        }
        // Se for válido, retorna null
        return null;
      })
    );
  };
}

```

**Como aplicar no `FormControl`:**

```tsx
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forbiddenCpfValidator } from './forbidden-cpf.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      // O terceiro argumento do array é para validadores assíncronos
      cpf: ['', [Validators.required], [forbiddenCpfValidator()]]
    });
  }
}

```

### 2\. Usando uma Classe (`AsyncValidator`)

A interface `AsyncValidator` exige a implementação de um método `validate`. Esta abordagem é preferível quando você precisa injetar serviços.

**Sintaxe da Interface:**

```tsx
interface AsyncValidator {
  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>
}

```

**Exemplo Prático: Validador de E-mail Único (com `HttpClient`)**

Primeiro, criamos um serviço que fará a chamada HTTP.

```tsx
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  // Método que simula a verificação no backend
  checkEmailExists(email: string): Observable<boolean> {
    // Em um cenário real, seria algo como:
    // return this.http.get<any>(`/api/users/check-email?email=${email}`).pipe(map(response => response.exists));

    // Simulação para o exemplo:
    const existingEmails = ['gedê@email.com', 'ju@email.com'];
    const exists = existingEmails.includes(email.toLowerCase());
    return of(exists).pipe(delay(1000)); // Simula latência de rede
  }
}

```

Agora, a classe do validador que injeta e usa este serviço.

```tsx
// unique-email.validator.ts
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userService.checkEmailExists(control.value).pipe(
      map(isEmailTaken => (isEmailTaken ? { emailExists: true } : null)),
      catchError(() => of(null)) // Em caso de erro na API, considera a validação como passada para não travar o usuário.
    );
  }
}

```

**Como aplicar no `FormControl`:**

O validador precisa ser injetado no componente e passado para o `FormControl`.

```tsx
// register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UniqueEmailValidator } from './unique-email.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  // Injetamos o validador aqui
  constructor(private fb: FormBuilder, private uniqueEmailValidator: UniqueEmailValidator) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      // Passamos a instância do validador
      // O método `bind(this.uniqueEmailValidator)` garante que o `this` dentro da classe do validador seja o correto.
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
        updateOn: 'blur' // Estratégia de atualização, muito útil com validadores async!
      }]
    });
  }
}

```

*Observação sobre `updateOn`*: Usar `'blur'` é uma ótima prática com validadores assíncronos, pois a validação só é disparada quando o usuário sai do campo, evitando chamadas de API a cada tecla digitada (`'change'`).

---

### **Métodos e Propriedades de `AbstractControl`**

O `AbstractControl` (classe base para `FormControl`, `FormGroup` e `FormArray`) possui propriedades e métodos essenciais para trabalhar com validação assíncrona.

| Propriedade/Método | Tipo | Descrição |
| --- | --- | --- |
| `asyncValidator` | `AsyncValidatorFn \| AsyncValidatorFn[] \| null` | Obtém ou define o(s) validador(es) assíncrono(s) associado(s) ao controle. |
| `status` | `string` | Uma string que indica o status da validação do controle. Pode ser `VALID`, `INVALID`, `PENDING` ou `DISABLED`. O status `PENDING` é exclusivo para validações assíncronas em andamento. |
| `statusChanges` | `Observable<any>` | Um `Observable` que emite um evento sempre que o `status` de validação do controle muda. Muito útil para mostrar/ocultar ícones de loading na UI. |
| `setAsyncValidators()` | `void` | Define ou substitui os validadores assíncronos de um controle de forma programática. |
| `addAsyncValidators()` | `void` | Adiciona um ou mais validadores assíncronos a um controle que já pode ter outros. |
| `removeAsyncValidators()` | `void` | Remove um ou mais validadores assíncronos de um controle. |
| `clearAsyncValidators()` | `void` | Remove todos os validadores assíncronos de um controle. |
| `updateValueAndValidity()` | `void` | Recalcula o valor e o status de validação do controle. Pode ser usado para disparar a validação assíncrona manualmente. |

**Exemplo de uso no Template:**

Você pode usar a propriedade `status` para dar feedback visual ao usuário.

```html
<div class="form-group">
  <label for="email">Email</label>
  <input type="email" id="email" formControlName="email">

  <div *ngIf="registerForm.get('email').status === 'PENDING'">
    Verificando disponibilidade...
  </div>

  <div *ngIf="registerForm.get('email').hasError('emailExists') && registerForm.get('email').dirty">
    Este e-mail já está em uso.
  </div>
</div>

```

---

### **Restrições de Uso**

Apesar de poderosos, existem cenários onde o uso de validadores assíncronos deve ser cuidadoso ou evitado:

1. **Validações que Podem ser Síncronas**: Não use um validador assíncrono para algo que pode ser resolvido no cliente sem uma chamada externa (ex: validação de formato de data, comparação de senhas). Isso adiciona complexidade e um delay desnecessário.
2. **Ambientes Offline**: Se sua aplicação precisa de um forte suporte offline, validações que dependem de uma API externa irão falhar. Nesses casos, a lógica precisa ser adaptada, talvez sincronizando dados para validação local ou adiando a validação para quando houver conexão.
3. **APIs Lentas ou Instáveis**: Uma API lenta pode deixar o formulário no estado `PENDING` por muito tempo, prejudicando a UX. É crucial implementar `timeouts`, bom tratamento de erros (`catchError`) e feedback claro para o usuário.
4. **Excesso de Chamadas**: Se não for configurado com `updateOn: 'blur'` ou uma estratégia de `debounce`, um validador assíncrono pode disparar uma chamada de API a cada tecla digitada, sobrecarregando o servidor e consumindo recursos desnecessariamente.

---

### **Elementos Associados**

Para construir validadores assíncronos robustos, você interagirá com vários elementos do Angular e do RxJS.

- **`Observable` (RxJS)**: É o coração da programação reativa em Angular. Validadores assíncronos retornam `Observable<ValidationErrors | null>`. Você usará operadores RxJS para manipular o fluxo de dados.
    - **`map`**: Para transformar o resultado da sua chamada de API no formato esperado (`null` ou `ValidationErrors`).
    - **`delay`**: Útil para simular latência de rede durante o desenvolvimento.
    - **`debounceTime`**: Para esperar um período de inatividade do usuário antes de disparar a chamada de API. Evita chamadas excessivas.
    - **`switchMap`**: Essencial para evitar "race conditions". Se o usuário digita rapidamente, múltiplas chamadas podem ser disparadas. `switchMap` cancela as requisições anteriores e pendentes, considerando apenas a mais recente.
    - **`catchError`**: Para lidar com falhas na comunicação com a API, evitando que o `Observable` quebre e o formulário fique em um estado inconsistente.
    - **`of`**: Para criar um `Observable` a partir de um valor estático (ex: `of(null)`).
- **`AbstractControl`**: A classe base que fornece a API comum para interagir com controles de formulário. O validador recebe uma instância dela para obter o valor (`control.value`) a ser validado.
- **`ValidationErrors`**: Uma interface de tipo para o objeto de erro. É um mapa de `string` para `any` (ex: `{ emailExists: true }`).
- **`HttpClient`**: O serviço do Angular para realizar requisições HTTP. É injetado no seu validador (quando implementado como uma classe) para se comunicar com o backend.
- **`@Injectable()`**: O decorador que marca uma classe como disponível para ser injetada pelo sistema de injeção de dependência do Angular. Essencial para classes de validadores que dependem de outros serviços.

---

### **Melhores Práticas e Casos de Uso**

1. **Use `debounceTime` e `switchMap` para Otimização**:
Para evitar sobrecarregar o servidor, especialmente em campos de digitação livre, combine `debounceTime` com `switchMap`.
    
    ```tsx
    // Dentro do validador, ao invés de chamar o serviço diretamente
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
      return control.valueChanges.pipe(
        debounceTime(500), // Espera 500ms após a última digitação
        distinctUntilChanged(), // Só emite se o valor realmente mudou
        switchMap(value => this.userService.checkEmailExists(value)), // Cancela requisições anteriores
        map(isEmailTaken => (isEmailTaken ? { emailExists: true } : null)),
        first(), // Pega a primeira emissão e completa o observable, essencial para o validador
        catchError(() => of(null))
      );
    }
    
    ```
    
    *Atenção*: Essa abordagem mais complexa geralmente é implementada de forma diferente, pois o validador em si só recebe o controle. A lógica de `debounce` é mais comumente aplicada no próprio componente, escutando o `valueChanges` e disparando a validação manualmente se necessário, ou em validadores mais avançados. A forma mais simples e recomendada continua sendo `updateOn: 'blur'`.
    
2. **Forneça Feedback Visual Claro**:
Use a propriedade `status` para mostrar um spinner ou uma mensagem de "Verificando..." enquanto o estado for `PENDING`. Isso informa ao usuário que algo está acontecendo e que ele deve aguardar.
3. **Lide com Erros de API Graciosa**:
Use o operador `catchError` do RxJS. Se a API falhar, você provavelmente não quer impedir o usuário de continuar. Uma estratégia comum é tratar o erro e retornar `of(null)`, considerando a validação como passada, e talvez logar o erro para a equipe de desenvolvimento.
4. **Separe a Lógica**:
Mantenha a lógica de chamada de API em um serviço (`UserService`, `ApiService`) e a lógica de transformação do resultado no validador. Isso segue o princípio de responsabilidade única e torna seu código mais testável e reutilizável.
5. **Use `updateOn: 'blur'` por padrão**:
Para validações assíncronas que envolvem chamadas de rede, defina `updateOn: 'blur'` no `FormControl`. É a forma mais simples e eficaz de evitar chamadas excessivas.

---

### **Exemplo Completo: Formulário de Cadastro**

Vamos juntar tudo em um formulário de cadastro de usuário que valida se o e-mail já existe.

**1. `user.service.ts`**

```tsx
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  // Simulação de um banco de dados
  private existingEmails = ['gedê@email.com', 'juliana@email.com', 'contato@email.com'];

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string): Observable<boolean> {
    console.log(`Verificando o e-mail: ${email}`);
    const exists = this.existingEmails.includes(email.toLowerCase());
    // Adiciona um delay para simular uma chamada de API real
    return of(exists).pipe(delay(1500));
  }
}

```

**2. `unique-email.validator.ts` (Classe do Validador)**

```tsx
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    // Só executa a validação se o campo não estiver vazio e for um e-mail válido
    if (!control.value || control.hasError('email')) {
      return of(null);
    }

    return this.userService.checkEmailExists(control.value).pipe(
      map(isTaken => (isTaken ? { emailExists: { message: 'Este e-mail já está cadastrado.' } } : null)),
      catchError(() => {
        // Em caso de erro na API, podemos retornar um erro específico ou passar a validação
        console.error('Falha ao conectar com o serviço de validação de e-mail.');
        return of(null); // Não trava o formulário do usuário
      })
    );
  }
}

```

**3. `app.component.ts` (Componente do Formulário)**

```tsx
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UniqueEmailValidator } from './validators/unique-email.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uniqueEmailValidator: UniqueEmailValidator
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
          updateOn: 'blur'
        }
      ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter para facilitar o acesso ao controle de e-mail no template
  get emailControl(): AbstractControl {
    return this.registerForm.get('email');
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulário enviado!', this.registerForm.value);
      alert('Cadastro realizado com sucesso!');
    } else {
      console.log('Formulário inválido.');
      this.registerForm.markAllAsTouched();
    }
  }
}

```

**4. `app.component.html` (Template com Feedback Visual)**

```html
<div class="container">
  <h2>Cadastro</h2>
  <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>

    <div class="form-field">
      <label for="username">Nome de Usuário</label>
      <input id="username" type="text" formControlName="username">
      <div *ngIf="registerForm.get('username').invalid && registerForm.get('username').touched" class="error-message">
        Nome de usuário é obrigatório.
      </div>
    </div>

    <div class="form-field">
      <label for="email">E-mail</label>
      <div class="input-wrapper">
        <input id="email" type="email" formControlName="email">
        <span *ngIf="emailControl.pending" class="spinner"></span>
      </div>

      <div *ngIf="emailControl.invalid && emailControl.touched" class="error-message">
        <div *ngIf="emailControl.hasError('required')">E-mail é obrigatório.</div>
        <div *ngIf="emailControl.hasError('email')">Formato de e-mail inválido.</div>
        <div *ngIf="emailControl.hasError('emailExists')">
          {{ emailControl.getError('emailExists').message }}
        </div>
      </div>
    </div>

    <div class="form-field">
      <label for="password">Senha</label>
      <input id="password" type="password" formControlName="password">
      <div *ngIf="registerForm.get('password').invalid && registerForm.get('password').touched" class="error-message">
        A senha deve ter no mínimo 6 caracteres.
      </div>
    </div>

    <button type="submit" [disabled]="registerForm.invalid">Cadastrar</button>

    <pre>Status do Formulário: {{ registerForm.status | json }}</pre>
    <pre>Erros do E-mail: {{ emailControl.errors | json }}</pre>
  </form>
</div>

```

**5. `app.component.css` (Estilos para o Feedback)**

```css
.spinner {
  /* Estilos para um ícone de loading simples */
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0,0,0,.1);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s ease-in-out infinite;
  margin-left: -30px; /* Alinha ao lado do input */
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.error-message {
  color: red;
  font-size: 0.8em;
  margin-top: 4px;
}
.input-wrapper {
  display: flex;
  align-items: center;
}
/* ... outros estilos ... */

```

---

### **Tópicos para Aprofundamento**

1. **Validadores Assíncronos em Nível de `FormGroup`**: Como criar uma validação assíncrona que depende de múltiplos campos do formulário (ex: verificar se a combinação de cidade e estado é válida).
2. **Estratégias Avançadas de RxJS**: Aprofundar-se em operadores como `takeUntil` para cancelar validações quando o componente é destruído, ou `retry` para tentar novamente uma chamada de API que falhou.
3. **Testes Unitários de Validadores Assíncronos**: Aprender a escrever testes para seus validadores, usando `fakeAsync`, `tick` e `TestBed` para simular o tempo e as dependências (como `HttpClient`).
4. **Integração com Gerenciamento de Estado (NGRX/NGXS)**: Como integrar validações que dependem do estado global da sua aplicação.

Espero que esta explicação superdetalhada seja exatamente o que você precisava, Gedê\! É um tópico poderoso que, uma vez dominado, eleva a qualidade dos seus formulários a outro nível. Se tiver qualquer dúvida, pode me chamar.

Um abraço,
A.R.I.A.