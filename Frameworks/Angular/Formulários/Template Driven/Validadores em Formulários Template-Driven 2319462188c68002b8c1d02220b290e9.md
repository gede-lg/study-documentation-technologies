# Validadores em Formulários Template-Driven

---

## Introdução

No desenvolvimento de aplicações *web*, a coleta e validação de dados fornecidos pelos usuários são etapas fundamentais para garantir a integridade, a segurança e a usabilidade do sistema. No Angular, os formulários são uma parte central da interação com o usuário, e a validação desempenha um papel crucial para garantir que os dados inseridos sigam as regras de negócio definidas.

Este guia se aprofundará nos **validadores em formulários *Template-Driven*** no Angular, uma abordagem declarativa e poderosa para gerenciar o estado e a validação de formulários diretamente no *template* HTML. Exploraremos os conceitos fundamentais, a sintaxe, o uso prático, os componentes chave e as melhores práticas para que você, Gedê, possa dominar essa técnica e criar formulários robustos e eficientes.

## Sumário

- Conceitos Fundamentais: O que são Validadores e por que são Importantes
- Validadores Padrão do Angular: Tipos e Uso
- Sintaxe Detalhada e Uso Prático
- Exibição de Mensagens de Erro
- Validadores Personalizados
- Cenários de Restrição ou Não Aplicação
- Componentes Chave Associados (`NgForm`, `NgModel`, `FormControl`, `FormGroup`, `ValidationErrors`)
- Melhores Práticas e Padrões de Uso
- Exemplo Prático Completo

---

## Conceitos Fundamentais: O que são Validadores e por que são Importantes

### O que são Validadores?

No contexto de formulários, **validadores** são funções que verificam se o valor de um controle de formulário (como um campo de entrada de texto, uma *checkbox* ou um *select*) atende a determinadas regras ou condições. Eles retornam um objeto contendo erros de validação (se houver) ou `null` se o valor for válido.

### Por que são Importantes?

A validação de formulários é vital por várias razões:

1. **Integridade dos Dados:** Garante que os dados enviados ao *backend* estejam no formato e conteúdo esperados, evitando dados corrompidos ou inconsistentes no banco de dados.
2. **Experiência do Usuário (UX):** Fornece *feedback* imediato ao usuário sobre a correção dos dados inseridos, evitando frustrações e ajudando-o a corrigir erros antes do envio do formulário. Isso melhora significativamente a usabilidade da aplicação.
3. **Segurança:** Ajuda a prevenir ataques comuns como injeção de SQL ou *cross-site scripting* (XSS) ao garantir que os dados de entrada sejam limpos e seguros.
4. **Lógica de Negócio:** Enforça as regras de negócio da aplicação diretamente no *frontend*, reduzindo a carga do *backend* e fornecendo uma camada de validação inicial.

---

## Validadores Padrão do Angular: Tipos e Uso

O Angular fornece um conjunto de validadores embutidos que cobrem os cenários de validação mais comuns. Eles são importados do módulo `@angular/forms`.

| Validador | Descrição |
| --- | --- |
| `required` | O campo deve ter um valor. |
| `minlength` | O valor deve ter um comprimento mínimo. |
| `maxlength` | O valor deve ter um comprimento máximo. |
| `pattern` | O valor deve corresponder a uma expressão regular. |
| `email` | O valor deve ser um formato de e-mail válido (básico). |
| `min` | O valor numérico deve ser maior ou igual a um valor mínimo. |
| `max` | O valor numérico deve ser menor ou igual a um valor máximo. |
| `requiredTrue` | O valor de uma *checkbox* ou *radio button* deve ser `true` (útil para termos e condições). |

---

## Sintaxe Detalhada e Uso Prático

Em formulários *Template-Driven*, os validadores são aplicados diretamente aos elementos HTML do formulário usando diretivas. Para usar formulários *Template-Driven*, você precisa importar o `FormsModule` no seu `AppModule` (ou no módulo onde o componente do formulário está declarado).

```tsx
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { AppComponent } from './app.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    CadastroUsuarioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // Adicionar ao array de imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

Agora, vamos ver como aplicar os validadores no *template* HTML.

```html
<form #usuarioForm="ngForm" (ngSubmit)="onSubmit(usuarioForm)">
  <div class="form-group">
    <label for="nome">Nome:</label>
    <input
      type="text"
      id="nome"
      name="nome"
      [(ngModel)]="usuario.nome"
      #nome="ngModel"
      required
      minlength="3"
      class="form-control"
    />
    <div *ngIf="nome.invalid && (nome.dirty || nome.touched)" class="alert alert-danger">
      <div *ngIf="nome.errors?.['required']">
        Nome é obrigatório.
      </div>
      <div *ngIf="nome.errors?.['minlength']">
        Nome deve ter pelo menos {{ nome.errors?.['minlength'].requiredLength }} caracteres.
        (Atualmente: {{ nome.errors?.['minlength'].actualLength }})
      </div>
    </div>
  </div>

  <div class="form-group">
    <label for="email">Email:</label>
    <input
      type="email"
      id="email"
      name="email"
      [(ngModel)]="usuario.email"
      #email="ngModel"
      required
      email
      class="form-control"
    />
    <div *ngIf="email.invalid && (email.dirty || email.touched)" class="alert alert-danger">
      <div *ngIf="email.errors?.['required']">
        Email é obrigatório.
      </div>
      <div *ngIf="email.errors?.['email']">
        Formato de email inválido.
      </div>
    </div>
  </div>

  <div class="form-group">
    <label for="senha">Senha:</label>
    <input
      type="password"
      id="senha"
      name="senha"
      [(ngModel)]="usuario.senha"
      #senha="ngModel"
      required
      minlength="6"
      maxlength="10"
      pattern="^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"
      class="form-control"
    />
    <div *ngIf="senha.invalid && (senha.dirty || senha.touched)" class="alert alert-danger">
      <div *ngIf="senha.errors?.['required']">
        Senha é obrigatória.
      </div>
      <div *ngIf="senha.errors?.['minlength']">
        Senha deve ter pelo menos {{ senha.errors?.['minlength'].requiredLength }} caracteres.
      </div>
      <div *ngIf="senha.errors?.['maxlength']">
        Senha deve ter no máximo {{ senha.errors?.['maxlength'].requiredLength }} caracteres.
      </div>
      <div *ngIf="senha.errors?.['pattern']">
        Senha deve conter letras e números.
      </div>
    </div>
  </div>

  <div class="form-group">
    <label for="idade">Idade:</label>
    <input
      type="number"
      id="idade"
      name="idade"
      [(ngModel)]="usuario.idade"
      #idade="ngModel"
      required
      min="18"
      max="99"
      class="form-control"
    />
    <div *ngIf="idade.invalid && (idade.dirty || idade.touched)" class="alert alert-danger">
      <div *ngIf="idade.errors?.['required']">
        Idade é obrigatória.
      </div>
      <div *ngIf="idade.errors?.['min']">
        Idade mínima é {{ idade.errors?.['min'].min }}.
      </div>
      <div *ngIf="idade.errors?.['max']">
        Idade máxima é {{ idade.errors?.['max'].max }}.
      </div>
    </div>
  </div>

  <div class="form-group form-check">
    <input
      type="checkbox"
      id="termos"
      name="termos"
      [(ngModel)]="usuario.termosAceitos"
      #termos="ngModel"
      requiredTrue
      class="form-check-input"
    />
    <label class="form-check-label" for="termos">Aceito os termos e condições</label>
    <div *ngIf="termos.invalid && (termos.dirty || termos.touched)" class="alert alert-danger">
      <div *ngIf="termos.errors?.['requiredTrue']">
        Você deve aceitar os termos e condições.
      </div>
    </div>
  </div>

  <button type="submit" class="btn btn-primary" [disabled]="usuarioForm.invalid">Cadastrar</button>
</form>

<p>
  Formulário Válido: {{ usuarioForm.valid }}
</p>
<pre>
  {{ usuario | json }}
</pre>

```

No componente:

```tsx
// cadastro-usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {

  usuario = {
    nome: '',
    email: '',
    senha: '',
    idade: null,
    termosAceitos: false
  };

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Formulário enviado com sucesso!', this.usuario);
      // Aqui você enviaria os dados para um serviço ou API
    } else {
      console.log('Formulário inválido. Verifique os campos.');
      // Opcional: Marcar todos os campos como "touched" para exibir erros
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

}

```

Nesse exemplo, observe:

- `[(ngModel)]="usuario.nome"`: Faz a vinculação de dados bidirecional.
- `#nome="ngModel"`: Cria uma referência local para o controle `ngModel` do campo, permitindo acessar seu estado de validação (`valid`, `invalid`, `dirty`, `touched`, `errors`).
- `required`, `minlength="3"`, `email`, etc.: São os atributos HTML que o Angular interpreta como validadores.
- `ngIf="nome.invalid && (nome.dirty || nome.touched)"`: Esta diretiva `ngIf` exibe as mensagens de erro somente se o campo for inválido E o usuário já interagiu com ele (digitou algo - `dirty`) ou saiu do campo (`touched`). Isso evita que todas as mensagens de erro apareçam assim que o formulário é carregado.
- `nome.errors?.['required']`: Acessa o objeto `errors` do controle `nome` para verificar se o erro `required` está presente.

---

## Exibição de Mensagens de Erro

A exibição de mensagens de erro é crucial para a usabilidade. O Angular facilita isso através das propriedades de estado de cada controle de formulário.

| Propriedade | Descrição |
| --- | --- |
| `valid` | `true` se o controle tiver um valor válido. |
| `invalid` | `true` se o controle tiver um valor inválido. |
| `pristine` | `true` se o usuário não alterou o valor desde que ele foi inicializado. |
| `dirty` | `true` se o usuário alterou o valor desde que ele foi inicializado. |
| `untouched` | `true` se o usuário não interagiu com o controle (não recebeu foco nem perdeu). |
| `touched` | `true` se o usuário interagiu com o controle (recebeu foco e perdeu). |
| `errors` | Um objeto que contém os erros de validação (ex: `{ required: true }`). |

Você usa essas propriedades com `*ngIf` para mostrar mensagens de erro condicionais, como visto no exemplo anterior.

---

## Validadores Personalizados

Quando os validadores embutidos não são suficientes para suas regras de negócio, você pode criar **validadores personalizados**. Em formulários *Template-Driven*, isso envolve a criação de uma diretiva personalizada que implementa a interface `Validator` e registra-se no `NG_VALIDATORS`.

Um validador personalizado é uma função que recebe um `AbstractControl` e retorna `ValidationErrors | null`.

Vamos criar um validador para verificar se duas senhas são iguais (confirmação de senha).

```tsx
// shared/match-password.directive.ts
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appMatchPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MatchPasswordDirective, multi: true }]
})
export class MatchPasswordDirective implements Validator {
  @Input('appMatchPassword') controlNameToCompare: string = ''; // Nome do controle que queremos comparar

  validate(control: AbstractControl): ValidationErrors | null {
    const controlToCompare = control.root.get(this.controlNameToCompare); // Acessa o outro campo pelo nome
    if (controlToCompare && controlToCompare.value !== control.value) {
      return { 'matchPassword': true }; // Retorna um erro se não houver correspondência
    }
    return null; // Retorna null se for válido
  }
}

```

Para usar este validador, primeiro importe-o no seu `AppModule` e adicione-o às declarações:

```tsx
// app.module.ts
import { MatchPasswordDirective } from './shared/match-password.directive'; // Importar diretiva

@NgModule({
  declarations: [
    AppComponent,
    CadastroUsuarioComponent,
    MatchPasswordDirective // Adicionar às declarações
  ],
  // ...
})
export class AppModule { }

```

Agora, use-o no seu *template*:

```html
<div class="form-group">
  <label for="senha">Senha:</label>
  <input
    type="password"
    id="senha"
    name="senha"
    [(ngModel)]="usuario.senha"
    #senha="ngModel"
    required
    minlength="6"
    class="form-control"
  />
  </div>

<div class="form-group">
  <label for="confirmaSenha">Confirmar Senha:</label>
  <input
    type="password"
    id="confirmaSenha"
    name="confirmaSenha"
    [(ngModel)]="usuario.confirmaSenha"
    #confirmaSenha="ngModel"
    required
    appMatchPassword="senha" class="form-control"
  />
  <div *ngIf="confirmaSenha.invalid && (confirmaSenha.dirty || confirmaSenha.touched)" class="alert alert-danger">
    <div *ngIf="confirmaSenha.errors?.['required']">
      Confirmação de senha é obrigatória.
    </div>
    <div *ngIf="confirmaSenha.errors?.['matchPassword']">
      As senhas não coincidem.
    </div>
  </div>
</div>

```

E no seu componente, atualize o modelo `usuario`:

```tsx
// cadastro-usuario.component.ts
export class CadastroUsuarioComponent implements OnInit {
  usuario = {
    // ...
    senha: '',
    confirmaSenha: '', // Adicionar este campo
    // ...
  };
  // ...
}

```

---

## Cenários de Restrição ou Não Aplicação

Embora os formulários *Template-Driven* com validadores sejam excelentes para muitos casos, existem cenários onde eles podem não ser a melhor escolha:

1. **Formulários Complexos e Dinâmicos:** Para formulários com muitos campos, validações complexas, dependências entre campos (como validação condicional) ou campos que são adicionados/removidos dinamicamente, a abordagem *Template-Driven* pode se tornar difícil de gerenciar. A lógica de validação fica dispersa no HTML, dificultando a depuração e manutenção.
2. **Testes Unitários:** Testar a lógica de validação em formulários *Template-Driven* pode ser mais desafiador, pois a maior parte da lógica está no *template* e é menos acessível programaticamente.
3. **Grandes Formulários:** Em formulários com dezenas ou centenas de campos, o desempenho pode ser um problema, pois o Angular precisa processar mais lógica no *template*.

Nestes casos, os **Formulários Reativos (Reactive Forms)** do Angular geralmente oferecem uma solução mais robusta e testável. Eles permitem que você defina e gerencie seu modelo de formulário e validações programaticamente no componente TypeScript, o que é ideal para formulários mais complexos.

---

## Componentes Chave Associados

A compreensão dos validadores em formulários *Template-Driven* é aprimorada ao entender os componentes e diretivas do Angular que os suportam:

- **`FormsModule`**: O módulo que você importa para habilitar os formulários *Template-Driven*. Ele fornece as diretivas `NgForm` e `NgModel`.
- **`NgForm` (Diretiva)**: Esta diretiva é automaticamente aplicada a qualquer `<form>` tag quando `FormsModule` é importado. Ela cria e gerencia um `FormGroup` implícito para todo o formulário. O `NgForm` rastreia o estado geral do formulário (válido, inválido, *dirty*, *touched*) e dos seus controles filhos. Você pode obter uma referência a ele usando uma variável de *template* local (ex: `#usuarioForm="ngForm"`).
- **`NgModel` (Diretiva)**: Aplicada a elementos de entrada com a diretiva `ngModel` (usada com `[(ngModel)]`). Esta diretiva cria um `FormControl` implícito para o elemento de entrada, rastreando seu valor, estado e erros de validação. A referência local (ex: `#nome="ngModel"`) permite acessar as propriedades desse `FormControl` no *template*.
- **`FormControl`**: Representa um controle de formulário individual (um campo de entrada, *select*, *textarea* etc.). É a unidade básica de um formulário Angular. Em *Template-Driven*, ele é criado implicitamente pelo `NgModel`.
- **`FormGroup`**: Representa um grupo de `FormControl`s (ou outros `FormGroup`s). Ele agrega os valores e estados de seus controles filhos. Em *Template-Driven*, o `NgForm` representa o `FormGroup` raiz do formulário.
- **`ValidationErrors`**: É o tipo de objeto que um validador retorna se o controle for inválido. É um objeto que mapeia o nome do erro (uma string) para um valor booleano ou outro objeto que contenha detalhes sobre o erro.
    - Exemplo para `required`: `{ required: true }`
    - Exemplo para `minlength`: `{ minlength: { requiredLength: 3, actualLength: 1 } }`

---

## Melhores Práticas e Padrões de Uso

1. **Validação Imediata vs. Após Interação:** Evite exibir todas as mensagens de erro assim que o formulário é carregado. Use as propriedades `dirty` ou `touched` dos controles para exibir mensagens apenas depois que o usuário interagiu com o campo. `ngIf="control.invalid && (control.dirty || control.touched)"` é o padrão recomendado.
2. **Mensagens de Erro Claras e Úteis:** As mensagens de erro devem ser específicas e orientar o usuário sobre como corrigir o problema. Em vez de "Inválido", use "Nome é obrigatório" ou "Email deve ser um formato válido".
3. **Desabilitar Botão de Envio:** Desabilite o botão de envio do formulário (`[disabled]="form.invalid"`) até que todos os campos obrigatórios e válidos tenham sido preenchidos. Isso impede o envio de dados incompletos ou inválidos.
4. **Feedback Visual:** Além das mensagens de texto, use classes CSS para indicar o estado de validação dos campos (por exemplo, borda vermelha para campos inválidos, borda verde para campos válidos). O Angular já adiciona classes como `ng-valid`, `ng-invalid`, `ng-pristine`, `ng-dirty`, `ng-touched`, `ng-untouched` aos elementos do formulário, que você pode estilizar.
5. **Validação no Backend:** Sempre realize a validação também no *backend*. A validação no *frontend* é para melhorar a UX; a validação no *backend* é para segurança e integridade dos dados, pois a validação do *frontend* pode ser contornada.
6. **Validadores Assíncronos:** Para validações que exigem uma chamada a um servidor (por exemplo, verificar se um nome de usuário já existe), use validadores assíncronos. Em *Template-Driven*, isso pode ser feito com uma diretiva personalizada que implementa `AsyncValidator`.
7. **Organização de Validadores Personalizados:** Mantenha seus validadores personalizados em arquivos ou pastas separadas (`shared/validators/` ou `directives/`).

---

## Exemplo Prático Completo

Vamos expandir o exemplo de cadastro de usuário para incluir um campo de **nome de usuário** que precisa ser único, simulando uma validação assíncrona. Para simplificar, vamos simular a chamada assíncrona com um `setTimeout`.

```tsx
// shared/unique-username.directive.ts
import { Directive } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// Simulação de um serviço de validação de username
function checkUsernameAvailability(username: string): Observable<boolean> {
  // Simula uma chamada HTTP para o backend
  const existingUsernames = ['gedemoura', 'juliana'];
  return new Observable(observer => {
    setTimeout(() => {
      if (existingUsernames.includes(username.toLowerCase())) {
        observer.next(false); // Username não disponível
      } else {
        observer.next(true); // Username disponível
      }
      observer.complete();
    }, 1000); // Simula um atraso de 1 segundo
  });
}

@Directive({
  selector: '[appUniqueUsername]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniqueUsernameDirective, multi: true }]
})
export class UniqueUsernameDirective implements AsyncValidator {
  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    // Retorna um observable que debounce, distinctUntilChanged e switchMap para evitar chamadas excessivas
    return control.valueChanges.pipe(
      debounceTime(500), // Espera 500ms após a última digitação
      distinctUntilChanged(), // Garante que só chame se o valor mudou
      switchMap(username => { // Cancela chamadas anteriores se uma nova digitação ocorrer
        if (!username) {
          return of(null); // Se o campo estiver vazio, é válido (outros validadores cuidarão de 'required')
        }
        return checkUsernameAvailability(username).pipe(
          map(isAvailable => (isAvailable ? null : { uniqueUsername: true })),
          catchError(() => of(null)) // Em caso de erro na API, considera válido por padrão ou trate como preferir
        );
      }),
      // Pegue apenas a primeira emissão para que o validador assíncrono seja executado apenas uma vez por alteração
      // A menos que você queira revalidar continuamente.
      // Para formulários Template-Driven, o Angular irá lidar com a revalidação automaticamente
      // quando o valor do controle mudar.
      map(errors => errors), // Retorna os erros mapeados
      take(1) // Pega apenas o primeiro valor emitido após a validação para completar o observable
    );
  }
}

```

Importe e declare-o no `AppModule`:

```tsx
// app.module.ts
import { UniqueUsernameDirective } from './shared/unique-username.directive';

@NgModule({
  declarations: [
    // ... outros componentes
    UniqueUsernameDirective
  ],
  // ...
})
export class AppModule { }

```

E no *template* HTML:

```html
<form #usuarioForm="ngForm" (ngSubmit)="onSubmit(usuarioForm)">
  <div class="form-group">
    <label for="username">Nome de Usuário:</label>
    <input
      type="text"
      id="username"
      name="username"
      [(ngModel)]="usuario.username"
      #username="ngModel"
      required
      appUniqueUsername class="form-control"
    />
    <div *ngIf="username.invalid && (username.dirty || username.touched)" class="alert alert-danger">
      <div *ngIf="username.errors?.['required']">
        Nome de usuário é obrigatório.
      </div>
      <div *ngIf="username.errors?.['uniqueUsername']">
        Nome de usuário já está em uso.
      </div>
      <div *ngIf="username.pending">
        Verificando disponibilidade...
      </div>
    </div>
  </div>

  </form>

```

No componente, adicione o `username` ao seu modelo:

```tsx
// cadastro-usuario.component.ts
export class CadastroUsuarioComponent implements OnInit {
  usuario = {
    // ...
    username: '', // Adicionar este campo
    // ...
  };
  // ...
}

```

Neste exemplo:

- A diretiva `UniqueUsernameDirective` é aplicada ao campo `username`.
- Ela implementa `AsyncValidator` e injeta `NG_ASYNC_VALIDATORS`.
- Dentro do método `validate`, usamos `control.valueChanges` para observar as alterações no campo.
- **`debounceTime(500)`**: Espera 500ms depois que o usuário para de digitar antes de emitir o valor, evitando chamadas desnecessárias à API a cada tecla pressionada.
- **`distinctUntilChanged()`**: Garante que a validação só ocorra se o valor realmente mudou.
- **`switchMap(username => ...)`**: Cancela qualquer validação assíncrona anterior que ainda esteja em andamento se o usuário digitar novamente, e então inicia uma nova validação.
- O *template* agora exibe uma mensagem "Verificando disponibilidade..." quando o campo está no estado `pending` (aguardando a resposta assíncrona).

---

Espero que esta explicação detalhada sobre validadores em formulários *Template-Driven* no Angular seja muito útil para você, Gedê\! Se tiver mais alguma dúvida ou quiser explorar outro tópico, A.R.I.A está à disposição\!