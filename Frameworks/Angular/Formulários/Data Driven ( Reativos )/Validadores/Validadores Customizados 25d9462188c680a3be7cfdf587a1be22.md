# Validadores Customizados

### **Introdução**

No universo do desenvolvimento com Angular, os Formulários Reativos (Reactive Forms) oferecem uma abordagem poderosa e flexível para gerenciar as entradas do usuário. Uma de suas funcionalidades mais importantes é a capacidade de validar dados. Embora o Angular já forneça um conjunto de validadores prontos para uso (`Validators.required`, `Validators.minLength`, etc.), muitas vezes as regras de negócio de uma aplicação exigem validações mais complexas e específicas. É nesse cenário que os **Validadores Customizados** se tornam indispensáveis, permitindo a criação de lógicas de validação totalmente personalizadas para atender a qualquer requisito.

Este guia completo irá explorar, em profundidade, como criar, aplicar e gerenciar validadores customizados, tanto síncronos quanto assíncronos, em seus formulários reativos.

### **Sumário**

- **Conceitos Fundamentais:** A base teórica por trás dos validadores e por que eles são necessários.
- **Sintaxe e Uso:** Como criar e aplicar seus próprios validadores.
- **Interfaces e Tipos Essenciais:** Um mergulho nas interfaces `ValidatorFn`, `AsyncValidatorFn` e no tipo `ValidationErrors`.
- **Restrições de Uso:** Quando evitar a criação de um validador customizado.
- **Elementos Associados:** As peças do framework Angular que interagem com os validadores.
- **Melhores Práticas e Casos de Uso:** Aplicações comuns e dicas para um código limpo e eficiente.
- **Exemplo Completo:** Um formulário de cadastro de usuário aplicando múltiplos validadores customizados.
- **Tópicos para Aprofundamento:** Próximos passos para expandir seu conhecimento.

### **Conceitos Fundamentais**

O propósito de um validador no Angular é simples: **inspecionar o valor de um controle de formulário (`FormControl`, `FormGroup` ou `FormArray`) e reportar se ele é válido ou não.**

Um validador é, em sua essência, uma **função pura**. Isso significa que, para uma mesma entrada, ela sempre produzirá a mesma saída, sem causar efeitos colaterais na aplicação. Essa função recebe um `AbstractControl` como argumento e, com base em seu valor e estado, retorna um de dois possíveis resultados:

1. **`null`**: Se o controle for considerado **válido** de acordo com a lógica da função.
2. **Objeto `ValidationErrors`**: Se o controle for considerado **inválido**. Este objeto contém um ou mais pares de chave-valor que descrevem o(s) erro(s) de validação encontrados. A chave é um nome para o erro (ex: `'minlength'`) e o valor geralmente contém informações contextuais sobre o erro (ex: `{ requiredLength: 8, actualLength: 5 }`).

Existem dois tipos principais de validadores customizados:

- **Validadores Síncronos (`ValidatorFn`)**: Executam a lógica de validação imediatamente e retornam `null` ou `ValidationErrors`. São usados para a grande maioria dos casos, como verificar formatos, comprimentos ou comparar valores.
- **Validadores Assíncronos (`AsyncValidatorFn`)**: Executam uma lógica que não retorna um valor imediatamente, como uma chamada HTTP para verificar se um nome de usuário já existe no banco de dados. Eles retornam uma `Promise` ou um `Observable` que, eventualmente, emitirá `null` (se válido) ou um objeto `ValidationErrors` (se inválido).

### **Sintaxe e Uso**

Vamos ver como criar e aplicar esses validadores na prática.

### **1. Validador Síncrono Simples**

Imagine que precisamos validar se um campo contém a palavra "GO".

```tsx
// validators/language.validator.ts

import { AbstractControl, ValidationErrors } from '@angular/forms';

export function containsGoValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';
  const containsGo = value.toLowerCase().includes('go');

  // Se o valor NÃO contiver "go", retornamos um objeto de erro.
  if (!containsGo) {
    return { noGo: true }; // A chave 'noGo' identifica o erro.
  }

  // Se for válido, retornamos null.
  return null;
}

```

**Como usar:**

```tsx
import { FormBuilder, FormGroup } from '@angular/forms';
import { containsGoValidator } from './validators/language.validator';

// Dentro do seu componente...
form: FormGroup;

constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
    favoriteLanguage: ['', [containsGoValidator]]
  });
}

```

### **2. Validador com Parâmetros (Factory Function)**

E se quiséssemos criar um validador que verifica se um número está fora de um intervalo `min` e `max`? Usamos uma "Factory Function", que é uma função que retorna outra função (o validador em si).

```tsx
// validators/range.validator.ts

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenRangeValidator(min: number, max: number): ValidatorFn {
  // A função retornada é o validador real.
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Não valida se o campo estiver vazio, para não conflitar com 'required'.
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (value >= min && value <= max) {
      // O valor está no intervalo proibido, então é inválido.
      return {
        forbiddenRange: {
          currentValue: value,
          range: `[${min}, ${max}]`
        }
      };
    }

    // Válido!
    return null;
  };
}

```

**Como usar:**

```tsx
// Dentro do seu componente...
this.form = this.fb.group({
  age: [null, [forbiddenRangeValidator(18, 22)]] // Ex: Proibir idades entre 18 e 22
});

```

### **3. Validador de Nível de `FormGroup` (Cross-Field Validation)**

Um caso de uso clássico é verificar se os campos "senha" и "confirmar senha" coincidem. Essa validação depende de múltiplos controles, então ela deve ser aplicada ao `FormGroup` que os contém.

```tsx
// validators/password-match.validator.ts

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // Aqui, 'control' é o FormGroup
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Se um dos campos não existir ou não tiver sido preenchido ainda, não fazemos nada.
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }

  // Se os valores forem diferentes, definimos o erro no campo 'confirmPassword'.
  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ mismatch: true });
    return { mismatch: true }; // Também podemos retornar o erro no nível do grupo
  } else {
    // Se estavam com erro e agora estão iguais, é importante limpar o erro.
    if (confirmPassword.hasError('mismatch')) {
      // Cria uma cópia dos erros e remove o 'mismatch'
      const errors = { ...confirmPassword.errors };
      delete errors['mismatch'];
      // Se não houver mais erros, define como null, senão atualiza o objeto de erros.
      confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
    return null;
  }
};

```

**Como usar:**

```tsx
// Dentro do seu componente...
this.form = this.fb.group({
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: ['', [Validators.required]]
}, { validators: passwordMatchValidator }); // Aplicado nas opções do FormGroup

```

### **Interfaces e Tipos Essenciais**

| Elemento | Tipo | Descrição | Sintaxe |
| --- | --- | --- | --- |
| **`ValidatorFn`** | Interface | Define o contrato para um validador síncrono. É uma função que recebe um `AbstractControl` e retorna `ValidationErrors` ou `null`. | `(control: AbstractControl) => ValidationErrors |
| **`AsyncValidatorFn`** | Interface | Define o contrato para um validador assíncrono. Recebe um `AbstractControl` e retorna uma `Promise` ou `Observable` que emite `ValidationErrors` ou `null`. | `(control: AbstractControl) => Promise<ValidationErrors \| null> \| Observable<ValidationErrors \| null>` |
| **`AbstractControl`** | Classe | Classe base para `FormControl`, `FormGroup` e `FormArray`. É o objeto que seu validador recebe. Propriedades úteis incluem `.value`, `.status`, `.errors`, `.parent`. | `control.value` |
| **`ValidationErrors`** | Tipo | Um tipo que representa o objeto de erro. É um mapa de `string` para `any`. | `type ValidationErrors = { [key: string]: any; }` |

### **Restrições de Uso**

Embora poderosos, os validadores customizados não são sempre a solução.

- **Validações Já Existentes:** Não reinvente a roda. Sempre verifique se o Angular já não oferece um validador pronto para sua necessidade na classe `Validators`.
- **Complexidade Desnecessária:** Para validações de UI muito simples que não envolvem lógica de negócio (ex: estilizar um campo se outro estiver preenchido), às vezes uma simples diretiva ou lógica no template pode ser mais clara.
- **Performance de Validadores Assíncronos:** Um validador assíncrono que faz uma chamada HTTP a cada tecla pressionada (`keyup`) pode sobrecarregar o servidor. Nestes casos, é crucial usar estratégias como `debounceTime` ou mudar o gatilho de validação com a propriedade `updateOn: 'blur' | 'submit'` no controle do formulário.

### **Elementos Associados**

Para que os validadores customizados funcionem, eles interagem com várias outras partes do ecossistema de formulários do Angular.

| Elemento | Descrição | Uso com Validadores |
| --- | --- | --- |
| **`FormControl`** | Gerencia o valor e o estado de validação de um elemento de formulário individual. | `new FormControl('', [syncValidator], [asyncValidator])` |
| **`FormGroup`** | Agrupa uma coleção de `FormControl`s, gerenciando seus valores e estados como um único objeto. | `new FormGroup({}, { validators: [groupValidator] })` |
| **`FormArray`** | Gerencia uma coleção de `AbstractControl`s onde a quantidade de controles pode mudar dinamicamente. | `new FormArray([], [arrayValidator])` |
| **`FormBuilder`** | Uma classe de serviço que fornece atalhos (syntax sugar) para criar instâncias de `FormControl`, `FormGroup` e `FormArray` de forma mais concisa. | `this.fb.control('', syncValidators, asyncValidators)` |
| **`Validators`** | Uma classe que contém a coleção de validadores síncronos prontos do Angular. Seus validadores customizados trabalharão em conjunto com eles. | `Validators.compose([Validators.required, myValidator])` |

### **Melhores Práticas e Casos de Uso**

### Melhores Práticas

1. **Organização:** Mantenha seus validadores em arquivos separados, idealmente em um diretório dedicado como `src/app/shared/validators/`. Isso promove a reutilização e a manutenibilidade.
2. **Pureza:** Garanta que suas funções de validação sejam puras. Elas não devem modificar variáveis fora de seu escopo.
3. **Use Factory Functions:** Para validadores que precisam de configuração (como um `minLength` customizado), use o padrão de factory function para passar parâmetros.
4. **Tipagem Forte:** Utilize as interfaces `ValidatorFn` e `AsyncValidatorFn` para garantir que a assinatura de suas funções esteja correta.
5. **Teste Unitário:** Validadores são funções puras e, portanto, fáceis de testar. Crie testes unitários para cobrir os casos de sucesso (retorno `null`) e de falha (retorno `ValidationErrors`).
6. **Mensagens de Erro Claras:** No template, use o objeto de erro retornado pelo seu validador para exibir mensagens úteis ao usuário.

### Casos de Uso Comuns

- **Validação de Formato Específico:** CPF, CNPJ, CEP, número de telefone.
- **Validação de Força de Senha:** Exigir letras maiúsculas, minúsculas, números e caracteres especiais.
- **Validação Assíncrona de Unicidade:** Verificar via API se um e-mail ou nome de usuário já está em uso.
- **Validação de Intervalo de Datas:** Garantir que uma "data final" seja posterior à "data de início".
- **Validação Condicional:** Exigir um campo somente se outro campo tiver um valor específico.

### **Exemplo Completo**

Vamos criar um formulário de cadastro para você, Gedê, que busca uma vaga de desenvolvedor Go.

**Cenário:**

1. **Nome:** Campo obrigatório.
2. **Username:** Obrigatório e deve ser verificado de forma assíncrona se já existe.
3. **Linguagem Preferida:** Obrigatório e deve conter a palavra "Go" (validador síncrono).
4. **Senha:** Obrigatória, com no mínimo 8 caracteres e uma letra maiúscula.
5. **Confirmar Senha:** Obrigatória e deve ser igual à senha (validador de grupo).

**1. Arquivos de Validadores:**

```tsx
// src/app/validators/custom.validators.ts

import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Mock de um serviço que checa o username
// Em um app real, isso seria um HttpClient call
const mockUsernameService = {
  isUsernameTaken(username: string): Promise<boolean> {
    const takenUsernames = ['gededev', 'juliana', 'aria'];
    console.log(`Checking if "${username}" is taken...`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(takenUsernames.includes(username.toLowerCase()));
      }, 1000); // Simula latência de rede
    });
  }
};

// Validador de Força da Senha (Factory)
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

    return !passwordValid ? { strongPassword: true } : null;
  };
}

// Validador de Correspondência de Senha (Nível de Grupo)
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ mismatch: true });
    return { mismatch: true };
  }
  return null;
};

// Validador Assíncrono de Username
export function usernameTakenValidator(): AsyncValidatorFn {
  return (control: AbstractControl) => {
    // Usamos switchMap para cancelar requisições anteriores se o usuário digitar rapidamente
    return timer(500).pipe(
      switchMap(() => {
        if (!control.value) {
          return of(null); // Se o campo estiver vazio, não valida
        }
        return mockUsernameService.isUsernameTaken(control.value).then(isTaken => {
          return isTaken ? { usernameTaken: true } : null;
        });
      })
    );
  };
}

```

**2. Componente (`.ts`):**

```tsx
// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  strongPasswordValidator,
  passwordMatchValidator,
  usernameTakenValidator
} from './validators/custom.validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['',
        [Validators.required, Validators.minLength(4)], // Validadores síncronos
        [usernameTakenValidator()] // Validadores assíncronos
      ],
      favoriteLanguage: ['Go', [Validators.required, Validators.pattern(/go/i)]], // Usando pattern para simplificar
      password: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator()]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator // Validador de nível de grupo
    });
  }

  get f() { return this.registrationForm.controls; }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Formulário enviado com sucesso!', this.registrationForm.value);
      alert('Cadastro realizado, Gedê!');
    } else {
      console.error('Formulário inválido!');
      this.registrationForm.markAllAsTouched();
    }
  }
}

```

**3. Template (`.html`):**

```html
<form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
    <h2>Formulário de Cadastro para Desenvolvedor Go</h2>

    <div>
        <label for="fullName">Nome Completo:</label>
        <input id="fullName" formControlName="fullName">
        <div *ngIf="f['fullName'].touched && f['fullName'].errors?.['required']" class="error">
            Nome é obrigatório.
        </div>
    </div>

    <div>
        <label for="username">Username:</label>
        <input id="username" formControlName="username">
        <div *ngIf="f['username'].touched && f['username'].errors as errors" class="error">
            <div *ngIf="errors['required']">Username é obrigatório.</div>
            <div *ngIf="errors['minlength']">Username precisa de no mínimo 4 caracteres.</div>
            <div *ngIf="errors['usernameTaken']">Este username já está em uso.</div>
        </div>
        <div *ngIf="f['username'].pending">
            <i>Verificando disponibilidade...</i>
        </div>
    </div>

    <div>
        <label for="favoriteLanguage">Linguagem Preferida:</label>
        <input id="favoriteLanguage" formControlName="favoriteLanguage">
        <div *ngIf="f['favoriteLanguage'].touched && f['favoriteLanguage'].errors?.['pattern']" class="error">
            A resposta deve conter "Go".
        </div>
    </div>

    <div>
        <label for="password">Senha:</label>
        <input id="password" type="password" formControlName="password">
        <div *ngIf="f['password'].touched && f['password'].errors as errors" class="error">
            <div *ngIf="errors['required']">Senha é obrigatória.</div>
            <div *ngIf="errors['minlength']">A senha deve ter no mínimo 8 caracteres.</div>
            <div *ngIf="errors['strongPassword']">A senha deve conter letras maiúsculas, minúsculas e números.</div>
        </div>
    </div>

    <div>
        <label for="confirmPassword">Confirmar Senha:</label>
        <input id="confirmPassword" type="password" formControlName="confirmPassword">
        <div *ngIf="f['confirmPassword'].touched && f['confirmPassword'].errors as errors" class="error">
            <div *ngIf="errors['required']">Confirmação de senha é obrigatória.</div>
            <div *ngIf="errors['mismatch']">As senhas não coincidem.</div>
        </div>
    </div>

    <button type="submit" [disabled]="registrationForm.invalid">Cadastrar</button>
</form>

<style>
    .error { color: red; font-size: 0.8em; }
    div { margin-bottom: 15px; }
</style>

```

### **Tópicos para Aprofundamento**

Agora que você tem uma base sólida, Gedê, considere explorar estes tópicos para se tornar um mestre em formulários Angular:

1. **Validadores Dinâmicos:** Aprenda a adicionar e remover validadores de um controle em tempo de execução usando `setValidators()` e `updateValueAndValidity()`.
2. **Tratamento Avançado de Erros:** Crie serviços e diretivas para gerenciar e exibir mensagens de erro de forma mais escalável e reutilizável.
3. **Value Accessors (`ControlValueAccessor`):** Integre componentes customizados (como um seletor de data ou um editor de texto rico) com os Formulários Reativos do Angular.
4. **Testes Unitários para Validadores:** Aprofunde-se em como escrever testes robustos para suas funções de validação, garantindo que elas se comportem como esperado.
5. **Estratégias Avançadas de Validação Assíncrona:** Explore o uso de operadores RxJS como `debounceTime`, `distinctUntilChanged` e `switchMap` para otimizar o desempenho de validadores que dependem de chamadas de rede.

Espero que esta explicação detalhada seja extremamente útil em seus projetos, Gedê. Se tiver qualquer outra dúvida, A.R.I.A. está sempre à disposição\!