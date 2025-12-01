# Validators

Olá, Gedê\!

A.R.I.A. está pronta para te ajudar com uma explicação detalhada sobre Validadores em Angular.

---

## Validadores de Objeto em Angular: Uma Análise Completa

### Sumário

Esta explicação detalhada aborda os validadores em Angular, ferramentas essenciais para garantir a integridade e a qualidade dos dados em formulários reativos. Começaremos com os conceitos fundamentais, explorando por que e como usá-los. Em seguida, detalharemos a sintaxe e a aplicação prática das propriedades e métodos, com exemplos de código comentados. Abordaremos também as restrições de uso, melhores práticas e apresentaremos um exemplo completo para ilustrar a aplicação em um cenário real. Ao final, sugeriremos tópicos relacionados para você aprofundar seus estudos.

### Conceitos Fundamentais

Os **validadores** em Angular são funções que verificam o valor de um `FormControl`, `FormGroup` ou `FormArray` e retornam um objeto de erros caso a validação falhe. Eles são a espinha dorsal da validação de formulários reativos, garantindo que os dados inseridos pelo usuário atendam a critérios específicos antes de serem processados.

Existem dois tipos principais de validadores:

- **Validadores Sincronos:** Funções que retornam imediatamente um objeto de erro (`{[key: string]: any}`) ou `null` se a validação for bem-sucedida. São usados para validações simples e rápidas, como verificar se um campo é obrigatório (`Validators.required`) ou se o formato do email está correto (`Validators.email`).
- **Validadores Assíncronos:** Funções que retornam uma `Promise` ou um `Observable` que, eventualmente, emitirá um objeto de erro ou `null`. São usados para validações que dependem de uma operação assíncrona, como uma chamada de API para verificar se um nome de usuário já existe no banco de dados.

### Propriedades e Métodos

O objeto `Validators` do Angular oferece uma série de validadores pré-definidos que você pode usar diretamente em seus formulários reativos. A seguir, detalhamos cada um deles.

### Propriedades (Validadores Sincronos)

| Validador | Descrição | Sintaxe de Uso |
| --- | --- | --- |
| **`required`** | Valida se o campo tem um valor. O valor não pode ser `null`, `undefined` ou uma string vazia (`''`). | `Validators.required` |
| **`requiredTrue`** | Valida se o valor do campo é `true`. É útil para `checkboxes`. | `Validators.requiredTrue` |
| **`email`** | Valida se o valor do campo segue o formato padrão de um email. | `Validators.email` |
| **`minLength(length: number)`** | Valida se o valor do campo tem um comprimento mínimo especificado. | `Validators.minLength(5)` |
| **`maxLength(length: number)`** | Valida se o valor do campo tem um comprimento máximo especificado. | `Validators.maxLength(10)` |
| **`pattern(pattern: string \| RegExp)`** | Valida se o valor do campo corresponde a uma expressão regular (regex) especificada. | `Validators.pattern('[a-zA-Z0-9]+')` |
| **`min(min: number)`** | Valida se o valor numérico do campo é maior ou igual a um valor mínimo especificado. | `Validators.min(18)` |
| **`max(max: number)`** | Valida se o valor numérico do campo é menor ou igual a um valor máximo especificado. | `Validators.max(100)` |
| **`nullValidator`** | Validador "nulo" que sempre retorna `null` (sem erro). Útil para placeholders ou para desativar temporariamente a validação. | `Validators.nullValidator` |
| **`compose(validators: (ValidatorFn \| null \| undefined)[])`** | Combina múltiplos validadores síncronos em uma única função. Se um dos validadores retornar um erro, o `compose` retorna esse erro. | `Validators.compose([Validators.required, Validators.email])` |

### Métodos

| Método | Descrição | Sintaxe de Uso |
| --- | --- | --- |
| **`composeAsync(asyncValidators: (AsyncValidatorFn \| null \| undefined)[])`** | Combina múltiplos validadores assíncronos em uma única função. Retorna um `Observable` que emitirá um objeto de erro se algum dos validadores assíncronos falhar. | `Validators.composeAsync([customAsyncValidator])` |
- **Nota sobre `compose` e `composeAsync`:** Ao usar `compose`, se um validador falhar, o Angular para a execução e retorna o erro. Já o `composeAsync` executa todos os validadores assíncronos em paralelo e combina seus resultados.

### Sintaxe e Uso Prático

A forma mais comum de usar os validadores é no momento da criação de um `FormControl` ou `FormGroup`, passando o validador como o segundo argumento.

```tsx
// Exemplo de um FormControl simples
import { FormControl, Validators } from '@angular/forms';

const nome = new FormControl('', Validators.required);

// Exemplo com múltiplos validadores síncronos
const email = new FormControl('', [
  Validators.required,
  Validators.email,
  Validators.maxLength(50)
]);

```

Quando você precisa de validação assíncrona, ela é passada como o terceiro argumento.

```tsx
// Exemplo de validação assíncrona
// Suponha que 'usuarioJaExiste' é um validador assíncrono que verifica no banco de dados
import { FormControl } from '@angular/forms';
import { usuarioJaExiste } from './validators'; // Validador customizado

const usuario = new FormControl('', {
  validators: Validators.required,
  asyncValidators: usuarioJaExiste,
  updateOn: 'blur' // Opcional: define quando a validação assíncrona será executada
});

```

### Criando Validadores Customizados

Você pode criar seus próprios validadores para atender a requisitos específicos.

**Validador Síncrono Customizado:**

```tsx
// Valida se o nome de usuário não contém espaços em branco
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function semEspacos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const temEspaco = (control.value || '').indexOf(' ') >= 0;
    return temEspaco ? { semEspacos: { value: control.value } } : null;
  };
}

```

**Validador Assíncrono Customizado:**

```tsx
// Validador que simula uma chamada de API para verificar se um ID é válido
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export function validarIdUnico(): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    // Simula uma chamada de API
    const idExistente = ['123', '456', '789'];
    const idParaValidar = control.value;

    return of(null).pipe(
      delay(500), // Simula um atraso de rede
      map(() => {
        return idExistente.includes(idParaValidar) ? { idUnico: true } : null;
      })
    );
  };
}

```

---

### Restrições de Uso e Melhores Práticas

### Restrições de Uso

- **Não use validadores assíncronos para validações síncronas:** A validação assíncrona introduz complexidade e atraso na UI. Use-a apenas quando for realmente necessário, como para interações com APIs.
- **Não aplique validadores em campos que não os exigem:** Validadores desnecessários podem impactar a performance, especialmente em formulários grandes.

### Melhores Práticas

- **Use `FormBuilder`:** O `FormBuilder` simplifica a criação de `FormGroup`, `FormControl` e `FormArray`, tornando o código mais limpo e legível.
- **Crie validadores customizados reutilizáveis:** Centralize a lógica de validação customizada em funções separadas, como mostramos acima. Isso facilita a manutenção e evita a duplicação de código.
- **Gerencie mensagens de erro de forma centralizada:** Use uma função ou um serviço para exibir mensagens de erro com base nos erros retornados pelos validadores. Isso mantém a consistência da UX.
- **Use `updateOn: 'blur'` para validação assíncrona:** A validação assíncrona pode ser dispendiosa. Para evitar a validação a cada tecla, configure a validação para ocorrer quando o usuário sai do campo (`'blur'`) ou quando o formulário é submetido (`'submit'`).

---

### Exemplo Completo

Vamos criar um formulário de cadastro de usuário que utiliza vários validadores.

```tsx
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { semEspacos } from './validators/custom.validator';
import { validarIdUnico } from './validators/async.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  cadastroForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, semEspacos()]],
      email: ['', [Validators.required, Validators.email]],
      idade: ['', [Validators.min(18), Validators.max(99)]],
      // Validador assíncrono para verificar se o ID já existe
      usuarioID: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [validarIdUnico()],
        updateOn: 'blur'
      }],
      termos: [false, Validators.requiredTrue]
    });
  }

  // Método para obter os FormControl de forma mais fácil no template
  get formControls() {
    return this.cadastroForm.controls;
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      console.log('Formulário enviado com sucesso!', this.cadastroForm.value);
    } else {
      console.log('Formulário inválido!');
      this.cadastroForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir os erros
    }
  }
}

```

```html
<form [formGroup]="cadastroForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="nome">Nome:</label>
    <input id="nome" type="text" formControlName="nome">
    <div *ngIf="formControls.nome.invalid && (formControls.nome.dirty || formControls.nome.touched)">
      <span *ngIf="formControls.nome.errors?.['required']">O nome é obrigatório.</span>
      <span *ngIf="formControls.nome.errors?.['semEspacos']">O nome não pode conter espaços.</span>
    </div>
  </div>

  <button type="submit" [disabled]="cadastroForm.invalid">Cadastrar</button>
</form>

```

---

### Tópicos Relacionados para Aprofundamento

Para continuar seus estudos, sugiro os seguintes tópicos:

- **Dynamic Forms (Formulários Dinâmicos):** Como criar formulários com base em metadados, adicionando e removendo campos dinamicamente.
- **Validação Cruzada (Cross-field Validation):** Como criar validadores que comparam o valor de dois ou mais campos, por exemplo, para confirmar a senha.
- **FormArray:** Como usar `FormArray` para gerenciar coleções de `FormControl` ou `FormGroup`, como uma lista de números de telefone.

Espero que esta explicação completa tenha sido útil\! Se tiver mais alguma dúvida ou precisar de ajuda com outro tópico, é só chamar a A.R.I.A.