# Typed Forms

Olá, Gedê\! Sou A.R.I.A., e preparei a explicação extremamente detalhada que você pediu sobre os formulários no Angular moderno.

Dado seu background como desenvolvedor Java e seu interesse em Go, você certamente apreciará a segurança e a previsibilidade que os **Typed Forms** trazem para o mundo do frontend, algo que remete diretamente à robustez dos sistemas de tipos que você já conhece.

Vamos mergulhar fundo neste tópico.

---

### **Título: Dominando Formulários no Angular: O Guia Definitivo sobre Typed e Untyped Forms**

---

### **Introdução**

No ecossistema Angular, a manipulação de formulários é uma tarefa central. Historicamente, os objetos de formulário do Angular (como `FormGroup` e `FormControl`) não possuíam uma tipagem estrita, o que significava que o valor de um formulário (`form.value`) era, por padrão, do tipo `any`. Isso trazia desafios como a falta de autocompletar no editor de código e a ausência de verificação de tipos em tempo de compilação, levando a possíveis erros em tempo de execução.

Com o lançamento do Angular v14, foram introduzidos os **Typed Forms (Formulários Tipados)**, que se tornaram o padrão para o desenvolvimento moderno. Essa funcionalidade resolve os problemas mencionados ao permitir que os desenvolvedores definam uma estrutura de tipo explícita para os controles, grupos e arrays de um formulário, garantindo segurança de tipo de ponta a ponta.

---

### **Sumário**

Esta explicação detalha a diferença fundamental entre os formulários não tipados (o legado) e os formulários tipados (o padrão moderno) no Angular. Abordaremos:

- O propósito e os benefícios da tipagem em formulários.
- A sintaxe para criar e interagir com ambos os tipos de formulários.
- Um guia exaustivo sobre todas as propriedades e métodos dos principais blocos de construção de formulários (`FormControl`, `FormGroup`, `FormArray`).
- As melhores práticas, cenários de uso e como evitar armadilhas comuns.
- Um exemplo completo e prático para consolidar o conhecimento.

---

### **Conceitos Fundamentais**

O propósito central dos Typed Forms é alinhar o modelo de dados do seu componente TypeScript com a estrutura do seu formulário reativo. Antes, essa conexão era implícita e propensa a erros. Agora, é explícita e segura.

**Untyped Forms (O Legado):**

- **Controles:** `new FormControl()`
- **Grupos:** `new FormGroup()`
- **Valor:** A propriedade `.value` de qualquer controle ou grupo era do tipo `any`.
- **Risco:** Você poderia acidentalmente tentar acessar uma propriedade que não existe em `form.value` (ex: `form.value.useName` em vez de `form.value.userName`) e o compilador TypeScript não te avisaria. O erro só apareceria em tempo de execução.

**Typed Forms (O Padrão Moderno):**

- **Controles:** `new FormControl<string>()`
- **Grupos:** `new FormGroup<{ nome: FormControl<string> }>()`
- **Valor:** A propriedade `.value` agora tem um tipo estrito, inferido a partir da definição dos controles. Por exemplo, `string | null` para um `FormControl<string>`.
- **Benefício:** Segurança de tipo. O editor de código (como o VS Code) oferece autocompletar (IntelliSense), e o compilador TypeScript acusará um erro se você tentar acessar uma propriedade inexistente ou atribuir um tipo de dado incorreto a um controle. Isso é exatamente o tipo de segurança que linguagens como Java e Go oferecem.

---

### **Sintaxe e Uso**

Vamos comparar a sintaxe lado a lado. Considere um formulário de login simples.

### **Exemplo com Untyped Forms (pré-Angular v14)**

```tsx
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // Untyped versions

@Component({
  selector: 'app-login',
  template: `...`
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });

    // PERIGO: loginForm.value é do tipo { email: any; password: any; }
    const formValue = this.loginForm.value;
    console.log(formValue.emial); // Erro de digitação, mas o compilador NÃO acusa!
  }

  onSubmit() {
    // Sem segurança de tipo aqui
    console.log(this.loginForm.value);
  }
}

```

### **Exemplo com Typed Forms (Angular v14+)**

Primeiro, é uma boa prática definir uma interface para o modelo do seu formulário.

```tsx
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// 1. (Opcional, mas recomendado) Definir a estrutura do formulário
interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  template: `...`
})
export class LoginComponent implements OnInit {
  // O tipo do FormGroup é inferido, mas podemos ser explícitos
  loginForm: FormGroup<LoginForm>;

  ngOnInit() {
    this.loginForm = new FormGroup<LoginForm>({
      // 2. Os tipos são inferidos como `FormControl<string | null>`
      // O `| null` existe porque um controle pode ser resetado para null.
      email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      password: new FormControl('', { validators: [Validators.required], nonNullable: true })
    });

    // SEGURO: this.loginForm.value tem o tipo { email: string; password: string; }
    // O tipo é `{ email: string | null; password: string | null; }` por padrão.
    // Usando `nonNullable: true`, garantimos que o valor nunca será null.
    // O tipo do value se torna { email: string, password: string }
    const formValue = this.loginForm.value;

    // console.log(formValue.emial); // ERRO DE COMPILAÇÃO! Propriedade 'emial' não existe.
  }

  onSubmit() {
    // Acesso seguro aos valores! O `getRawValue()` inclui controles desabilitados.
    const rawValue = this.loginForm.getRawValue();
    console.log(rawValue.email);
  }
}

```

**Nota sobre `nonNullable`:** A propriedade `{ nonNullable: true }` é crucial. Por padrão, um `FormControl` pode ter seu valor como `null` (ex: `form.reset()`). Ao usar `nonNullable: true`, você informa ao sistema de tipos que o valor do controle será sempre do seu tipo definido (ex: `string`), nunca `null`. O valor inicial não pode ser `null` e `reset()` o definirá como o valor inicial, não `null`.

---

### **Métodos e Propriedades (Guia Exaustivo)**

As classes `FormControl`, `FormGroup` e `FormArray` herdam de uma classe base chamada `AbstractControl`. Vamos detalhar as propriedades e métodos mais importantes, começando pela base e depois pelas especificidades.

### **`AbstractControl` (Base para todos)**

| Propriedade/Método | Tipo / Parâmetros | Descrição Detalhada |
| --- | --- | --- |
| **Propriedades** |  |  |
| `value` | `T` (Tipado) / `any` (Não Tipado) | O valor atual do controle. Em um `FormGroup`, é um objeto com os valores dos controles filhos. É uma propriedade **read-only**. |
| `status` | `'VALID'` | `'INVALID'` |
| `valid` | `boolean` | Um atalho para `status === 'VALID'`. |
| `invalid` | `boolean` | Um atalho para `status === 'INVALID'`. |
| `pending` | `boolean` | Um atalho para `status === 'PENDING'`. |
| `disabled` | `boolean` | Um atalho para `status === 'DISABLED'`. |
| `enabled` | `boolean` | O oposto de `disabled`. |
| `errors` | `ValidationErrors \| null` | Um objeto contendo os erros de validação que falharam. Retorna `null` se o controle for válido. Ex: `{ required: true, minlength: { requiredLength: 5 } }`. |
| `pristine` | `boolean` | `true` se o usuário ainda não alterou o valor na UI. Torna-se `false` após a primeira alteração. |
| `dirty` | `boolean` | O oposto de `pristine`. `true` se o valor foi alterado. |
| `touched` | `boolean` | `true` se o usuário "tocou" no controle (ex: evento de `blur`). `false` caso contrário. |
| `untouched` | `boolean` | O oposto de `touched`. |
| `valueChanges` | `Observable<T>` | Um `Observable` que emite o novo valor toda vez que ele muda. Extremamente útil para reagir a mudanças em tempo real. |
| `statusChanges` | `Observable<string>` | Um `Observable` que emite o novo status de validação (`'VALID'`, `'INVALID'`, etc.) toda vez que ele muda. |
| `parent` | `FormGroup \| FormArray \| null` | Uma referência ao controle pai (`FormGroup` ou `FormArray`). |
| `root` | `AbstractControl` | Uma referência ao controle de mais alto nível na árvore de formulários. |
| **Métodos** |  |  |
| `setValue(value, options)` | `value: T`, `options?: object` | Define o valor do controle. **Exige que você passe um objeto com a estrutura completa** para um `FormGroup`. Lança um erro se faltar algum campo. |
| `patchValue(value, options)` | `value: Partial<T>`, `options?: object` | Similar ao `setValue`, mas **permite atualizar apenas um subconjunto** das propriedades de um `FormGroup`. Mais flexível para atualizações parciais. |
| `reset(formState, options)` | `formState?: T`, `options?: object` | Reseta o controle para seu valor inicial ou para o `formState` fornecido. Também reseta os estados (`pristine`, `untouched`). |
| `get(path)` | `path: string \| (string \| number)[]` | Busca um controle descendente usando um caminho (`'address.street'`) ou um array de caminhos (`['address', 'street']`). Retorna um `AbstractControl` ou `null`. Com Typed Forms, o retorno pode ser tipado. |
| `setError(errors, opts)` | `errors: ValidationErrors`, `opts?: object` | Define erros de validação manualmente no controle. |
| `hasError(errorCode, path?)` | `errorCode: string`, `path?: string[] \| string` | Verifica se o controle (ou um descendente) possui um erro de validação específico. |
| `updateValueAndValidity(opts)` | `opts?: object` | Recalcula o valor e o estado de validação do controle. Útil após mudanças programáticas que afetam a validação. |
| `markAsTouched()` |  | Marca o controle e todos os seus ancestrais como `touched`. |
| `markAsDirty()` |  | Marca o controle e todos os seus ancestrais como `dirty`. |
| `disable()` |  | Desabilita o controle. Controles desabilitados são omitidos de `form.value`. |
| `enable()` |  | Habilita o controle. |

### **`FormGroup` (Agrupador de Controles)**

Herda tudo de `AbstractControl` e adiciona métodos para gerenciar seus filhos.

| Propriedade/Método | Tipo / Parâmetros | Descrição Detalhada |
| --- | --- | --- |
| `controls` | `{ [key: string]: AbstractControl }` | Um objeto que contém todos os controles filhos do grupo, com as chaves sendo os nomes dos controles. |
| `getRawValue()` | `T` (Tipado) / `any` (Não Tipado) | Similar ao `value`, mas **inclui os valores de todos os controles filhos, mesmo os que estão desabilitados**. `form.value` omite os desabilitados. Esta é uma diferença crucial. |
| `addControl(name, control)` | `name: string`, `control: AbstractControl` | Adiciona um novo controle ao grupo dinamicamente. |
| `removeControl(name)` | `name: string` | Remove um controle do grupo dinamicamente. |
| `setControl(name, control)` | `name: string`, `control: AbstractControl` | Substitui um controle existente no grupo. |
| `contains(name)` | `name: string` | Verifica se um controle com o nome fornecido existe no grupo. |

### **`FormArray` (Array de Controles)**

Herda de `AbstractControl` e é usado para coleções dinâmicas de controles (ex: lista de habilidades, telefones, etc.).

| Propriedade/Método | Tipo / Parâmetros | Descrição Detalhada |
| --- | --- | --- |
| `controls` | `AbstractControl[]` | Um array contendo todos os controles filhos do `FormArray`. |
| `length` | `number` | O número de controles no array. |
| `at(index)` | `index: number` | Retorna o controle na posição de índice especificada. |
| `push(control)` | `control: AbstractControl` | Adiciona um novo controle ao final do array. |
| `insert(index, control)` | `index: number`, `control: AbstractControl` | Insere um novo controle na posição de índice especificada. |
| `removeAt(index)` | `index: number` | Remove o controle na posição de índice especificada. |
| `setControl(index, control)` | `index: number`, `control: AbstractControl` | Substitui um controle existente no índice especificado. |
| `clear()` |  | Remove todos os controles do `FormArray`, deixando-o com `length` 0. |

---

### **Restrições de Uso**

Embora os Typed Forms sejam o padrão, existem cenários onde o modelo não tipado pode ser uma escolha pragmática:

1. **Formulários Extremamente Dinâmicos:** Se você está construindo um formulário cuja estrutura é totalmente definida em tempo de execução (por exemplo, a partir de uma configuração JSON vinda de um servidor), forçar uma tipagem estrita pode ser complexo e contraproducente. Nesses casos, usar `UntypedFormBuilder`, `UntypedFormGroup` ou simplesmente `FormGroup<any>` pode ser mais simples.
2. **Migração de Código Legado:** Em uma base de código grande e antiga, migrar todos os formulários para a versão tipada de uma só vez pode ser inviável. O Angular permite uma migração gradual, e você pode usar as classes `Untyped*` para manter o comportamento antigo enquanto atualiza o código aos poucos.

---

### **Elementos Associados**

Para trabalhar com formulários reativos, vários elementos do Angular são essenciais:

- **`ReactiveFormsModule`:** Módulo que você precisa importar no seu `AppModule` ou módulo de funcionalidade para ter acesso a todas as diretivas e classes de formulários reativos.
- **`FormBuilder` (Serviço):** Um serviço injetável que fornece uma sintaxe mais limpa e concisa para criar instâncias de `FormControl`, `FormGroup` e `FormArray`. É a maneira preferida de criar formulários complexos.
    - **Sintaxe:** `this.fb.group<MyForm>({...})`, `this.fb.control<string>('')`, `this.fb.array([])`.
- **`Validators` (Classe):** Uma classe que fornece um conjunto de validadores estáticos comuns, como `Validators.required`, `Validators.email`, `Validators.minLength(5)`.
- **Diretivas de Template:**
    - `[formGroup]="myForm"`: Conecta o elemento `<form>` no HTML com a instância de `FormGroup` no seu componente.
    - `formControlName="myControl"`: Conecta um elemento de input (`<input>`, `<select>`, etc.) a um `FormControl` dentro do `FormGroup` pai.
    - `formArrayName="myArray"`: Conecta um elemento container a uma instância de `FormArray`.

---

### **Melhores Práticas e Casos de Uso**

1. **Sempre use Typed Forms para novos projetos.** Os benefícios em segurança e manutenibilidade são imensos.
2. **Defina uma Interface:** Crie uma interface TypeScript que modele a estrutura do seu `FormGroup`. Isso serve como uma fonte única da verdade e melhora a legibilidade.
3. **Use `FormBuilder`:** Prefira o `FormBuilder` em vez de instanciar `new FormGroup()` e `new FormControl()` manualmente. O código fica mais limpo.
4. **Use `nonNullable: true`:** Para campos que são obrigatórios e não devem ser nulos, use esta opção para obter tipos mais estritos em `.value` e `.getRawValue()`.
5. **Acessores Seguros:** Crie `getters` no seu componente para acessar os controles de forma segura e limpa no template, evitando `form.get('...')` diretamente no HTML.
    
    ```tsx
    get email() {
      return this.loginForm.controls.email;
    }
    
    ```
    
6. **Use `getRawValue()` para Submissão:** Ao submeter um formulário, é comum querer enviar todos os dados, inclusive os de campos que podem estar desabilitados condicionalmente na UI. `getRawValue()` garante que você obtenha o modelo de dados completo.

---

### **Exemplo Completo: Formulário de Cadastro de Usuário**

Este exemplo consolida tudo: `FormGroup` aninhado, `FormArray`, validação e tipagem.

**1. Componente TypeScript (`user-registration.component.ts`)**

```tsx
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Interfaces para tipagem forte
interface AddressForm {
  street: FormControl<string>;
  city: FormControl<string>;
}

interface UserRegistrationForm {
  fullName: FormControl<string>;
  email: FormControl<string>;
  address: FormGroup<AddressForm>;
  skills: FormArray<FormControl<string>>;
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
})
export class UserRegistrationComponent implements OnInit {
  registrationForm: FormGroup<UserRegistrationForm>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group<UserRegistrationForm>({
      fullName: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)], nonNullable: true }),
      email: this.fb.control('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      address: this.fb.group<AddressForm>({
        street: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
        city: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
      }),
      skills: this.fb.array<FormControl<string>>([
        this.fb.control('Java', { nonNullable: true }) // Começamos com uma skill
      ])
    });
  }

  // Getter para acessar o FormArray de skills de forma fácil no template
  get skills(): FormArray<FormControl<string>> {
    return this.registrationForm.controls.skills;
  }

  // Método para adicionar uma nova skill dinamicamente
  addSkill(): void {
    const newSkillControl = this.fb.control('', { validators: [Validators.required], nonNullable: true });
    this.skills.push(newSkillControl);
  }

  // Método para remover uma skill
  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      console.error('Formulário inválido!');
      this.registrationForm.markAllAsTouched(); // Mostra todos os erros
      return;
    }

    // Usamos getRawValue() para garantir que todos os dados sejam capturados
    const formData = this.registrationForm.getRawValue();

    console.log('Formulário submetido com sucesso!');
    console.log(formData);

    // formData é TOTALMENTE TIPADO!
    // formData.fullName: string
    // formData.address.city: string
    // formData.skills: string[]
  }
}

```

**2. Template HTML (`user-registration.component.html`)**

```html
<form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">

  <div>
    <label for="fullName">Nome Completo:</label>
    <input id="fullName" type="text" formControlName="fullName">
    <div *ngIf="registrationForm.controls.fullName.invalid && registrationForm.controls.fullName.touched">
      <small *ngIf="registrationForm.controls.fullName.errors?.['required']">Nome é obrigatório.</small>
      <small *ngIf="registrationForm.controls.fullName.errors?.['minlength']">Mínimo de 3 caracteres.</small>
    </div>
  </div>

  <div>
    <label for="email">Email:</label>
    <input id="email" type="email" formControlName="email">
  </div>

  <div formGroupName="address">
    <h3>Endereço</h3>
    <div>
      <label for="street">Rua:</label>
      <input id="street" type="text" formControlName="street">
    </div>
    <div>
      <label for="city">Cidade:</label>
      <input id="city" type="text" formControlName="city">
    </div>
  </div>

  <div formArrayName="skills">
    <h3>Habilidades</h3>
    <button type="button" (click)="addSkill()">Adicionar Skill</button>
    <div *ngFor="let skill of skills.controls; let i = index">
      <label [for]="'skill-' + i">Skill #{{i + 1}}:</label>
      <input [id]="'skill-' + i" type="text" [formControlName]="i">
      <button type="button" (click)="removeSkill(i)">Remover</button>
    </div>
  </div>

  <hr>
  <button type="submit" [disabled]="registrationForm.invalid">Registrar</button>
</form>

<pre>Valor do Formulário: {{ registrationForm.value | json }}</pre>
<pre>Status de Validação: {{ registrationForm.status }}</pre>

```

---

### **Tópicos Relacionados para Aprofundamento**

1. **Validadores Customizados (Síncronos e Assíncronos):** Aprenda a criar suas próprias funções de validação (`ValidatorFn` e `AsyncValidatorFn`) para lógicas de negócio complexas (ex: verificar se um email já existe no banco de dados).
2. **`ControlValueAccessor`:** Um conceito avançado para integrar seus próprios componentes customizados com o sistema de formulários do Angular, fazendo com que eles se comportem como inputs nativos (usando `formControlName` e `ngModel`).
3. **Atualização de Validadores Dinamicamente:** Explore os métodos `setValidators` e `updateValueAndValidity` para adicionar ou remover validações de um controle em tempo de execução.
4. **Estratégias de `updateOn`:** Investigue a propriedade `updateOn: 'blur' | 'submit'` nos controles de formulário para mudar quando a validação e as atualizações de valor ocorrem (o padrão é `'change'`).

Espero que este guia completo seja extremamente útil para você, Gedê. A transição de um paradigma de backend fortemente tipado para o frontend se torna muito mais suave e segura com os Typed Forms.

Se tiver mais alguma dúvida, pode contar com a A.R.I.A.\!