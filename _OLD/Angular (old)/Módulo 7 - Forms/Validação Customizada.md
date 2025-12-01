### O que é e para que serve?

No Angular, a validação customizada de formulários é uma técnica empregada para verificar se a entrada do usuário atende a critérios específicos antes de considerar o valor do campo como válido. Essa abordagem é essencial para garantir a integridade e a validade dos dados inseridos nos formulários, indo além das validações padrão oferecidas pelo Angular, como `required`, `minlength`, `maxlength`, etc. As validações customizadas permitem implementar regras de negócio complexas e específicas, como verificar se uma data está no futuro, se uma senha contém caracteres especiais, entre outros.

### Validação por classe "Validadores"

Você pode criar uma classe `Validadores` que contém métodos estáticos para serem usados como validadores customizados. Esses métodos devem receber um `AbstractControl` como argumento e retornar um objeto de erro ou `null` se o valor for válido.

```typescript
import { AbstractControl, ValidationErrors } from '@angular/forms';

export class Validadores {
  static nomeUsuarioUnico(control: AbstractControl): ValidationErrors | null {
    const nomeUsuario = control.value;
    // Aqui você pode adicionar a lógica para verificar se o nome de usuário é único,
    // por exemplo, fazendo uma chamada ao backend.
    // Para este exemplo, vamos simular uma validação que falha se o nome do usuário for "admin".
    if (nomeUsuario.toLowerCase() === 'admin') {
      return { nomeUsuarioUnico: true };
    }
    return null;
  }
}
```

Para usar essa validação em um formulário, você adiciona o método de validação ao `FormGroup` ou `FormControl`:

```typescript
this.meuFormulario = new FormGroup({
  nomeUsuario: new FormControl('', [Validadores.nomeUsuarioUnico])
});
```

### Validação por diretiva de atributo

Para criar uma diretiva de atributo que implemente uma validação customizada, você define uma diretiva que implementa a interface `Validator` e usa o decorador `@Directive` para registrá-la.

```typescript
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appValidadorCustomizado]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ValidadorCustomizadoDirective),
    multi: true
  }]
})
export class ValidadorCustomizadoDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    // Sua lógica de validação aqui, retornando um objeto de erro ou null.
    if (/* condição de erro */) {
      return { chaveErro: true };
    }
    return null;
  }
}
```

Para usar essa diretiva em um template de formulário, adicione o seletor da diretiva como um atributo do campo de formulário:

```html
<input type="text" formControlName="campoCustomizado" appValidadorCustomizado />
```

### Validação por função

Você também pode criar um método isolado que seja uma função de validação. Essa função segue a mesma assinatura dos exemplos anteriores, aceitando um `AbstractControl` e retornando `ValidationErrors | null`.

```typescript
export function validadorEmail(control: AbstractControl): ValidationErrors | null {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const valido = emailRegex.test(control.value);
  return valido ? null : { emailInvalido: true };
}
```

Para usar esse validador, você simplesmente o adiciona à lista de validadores de um `FormControl`:

```typescript
this.meuFormulario = new FormGroup({
  email: new FormControl('', [validadorEmail])
});
```

### Como mostrar erros no template dessas validações

Para exibir mensagens de erro de validação no template, você pode usar diretivas angulares para verificar se um campo foi tocado (`touched`) e se é inválido (`invalid`). Combinando essas checagens, você pode mostrar mensagens de erro de forma condicional.

```html
<form [formGroup]="meuFormulario">
  <input formControlName="nomeUsuario" />
  <div *ngIf="meuFormulario.get('nomeUsuario').

errors?.nomeUsuarioUnico && meuFormulario.get('nomeUsuario').touched">
    O nome de usuário "admin" não é permitido.
  </div>

  <input formControlName="email" />
  <div *ngIf="meuFormulario.get('email').errors?.emailInvalido && meuFormulario.get('email').touched">
    O e-mail inserido não é válido.
  </div>
</form>
```

Este exemplo mostra como você pode acessar os erros específicos de cada campo e exibir mensagens apropriadas baseadas nos erros retornados pelas funções de validação.

A validação customizada de formulários no Angular é uma ferramenta poderosa para garantir que os dados inseridos pelo usuário atendam a critérios específicos antes de serem processados ou enviados a um servidor. Angular fornece várias maneiras de implementar validações, sendo uma delas através da criação de validadores customizados. Isso é feito por meio da interface `Validators` e dos tipos de retorno `ValidatorFn` e `ValidationErrors`. Vamos explorar esses conceitos detalhadamente.

### Interface `Validators`

#### O que é e para que serve?

A interface `Validators` em Angular é uma parte do módulo `@angular/forms` e fornece uma série de funções validadoras prontas para uso, como `required`, `minLength`, `maxLength`, e `pattern`. Além dessas validações padrão, Angular permite que você crie suas próprias funções de validação customizadas para atender critérios específicos que não são cobertos pelas validações padrão. Essas funções customizadas são criadas implementando a interface `ValidatorFn`.

### Tipo de retorno: `ValidatorFn`, `ValidationErrors`

#### O que é e para que serve?

- **`ValidatorFn`**: É um tipo que representa uma função de validação em Angular. Essa função recebe um `AbstractControl` como argumento e retorna um objeto de erros (`ValidationErrors`) ou `null`, dependendo se o controle passa na validação ou não.

- **`ValidationErrors`**: É um objeto que contém as chaves e os valores dos erros. Cada chave é uma string que identifica o tipo de erro, e o valor pode ser qualquer informação adicional sobre o erro.

#### Quando utilizar cada um?

- **`ValidatorFn`** deve ser usado quando você precisa criar uma validação customizada. Você implementa uma função que segue a assinatura `ValidatorFn` e a utiliza como validador em seus formulários.

- **`ValidationErrors`** é utilizado dentro de suas funções `ValidatorFn` para retornar informações sobre os erros de validação. Você retorna `null` se o controle é válido, ou um objeto `ValidationErrors` se há um ou mais erros.

### Exemplo de Código

Vamos criar um exemplo de validador customizado que verifica se o valor inserido em um campo de formulário é um número par.

```typescript
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

// Função que cria o validador customizado
export function evenNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const isEven = value % 2 === 0;
    return isEven ? null : { evenNumber: { value: value, message: "O número deve ser par" } };
  };
}
```

Para usar este validador em um formulário, você o adicionaria da seguinte maneira:

```typescript
this.form = this.fb.group({
  evenNumber: ['', [evenNumberValidator()]] // Usando o validador customizado
});
```

### Observações Adicionais

- É importante testar suas funções de validação customizadas cuidadosamente para garantir que elas funcionem como esperado em diferentes cenários.
- Validadores customizados podem ser combinados com validadores padrão do Angular para criar regras de validação complexas.
- Além de validadores síncronos (como o exemplo acima), Angular também suporta validadores assíncronos, que são úteis para validações que requerem operações assíncronas, como verificar a disponibilidade de um nome de usuário em um banco de dados.
- A validação customizada é uma ferramenta poderosa no Angular para garantir a qualidade dos dados submetidos pelos usuários.
- É importante testar extensivamente suas funções de validação para garantir que elas se comportem conforme esperado em diferentes cenários.
- Lembre-se de que validações no lado do cliente são uma primeira linha de defesa para a integridade dos dados, mas validações no servidor também são necessárias para segurança e integridade de dados.