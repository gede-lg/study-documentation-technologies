# Criando uma Referência de Form Group com NgModelGroup

---

### Introdução

Ao desenvolver aplicações Angular, é comum nos depararmos com a necessidade de gerenciar formulários complexos. Para manter o código organizado e a lógica de validação coesa, o Angular oferece duas abordagens principais: **Template Driven Forms** e **Reactive Forms**. Nesta explicação, vamos focar nos **Template Driven Forms**, que dependem do uso de diretivas no template HTML para construir e gerenciar o formulário.

Especificamente, abordaremos o uso da diretiva `NgModelGroup` para agrupar controles de formulário relacionados. Isso permite que você crie um `FormGroup` aninhado dentro do seu formulário principal, facilitando o trabalho com seções de dados relacionadas, como um endereço, por exemplo, que contém rua, número, bairro, etc. Vamos explorar como referenciar esse `NgModelGroup` para acessar seu estado e valores.

### Sumário

Esta explicação detalhada cobrirá os seguintes pontos:

- **Conceitos Fundamentais:** Entendimento do que são formulários Template Driven, `NgModelGroup` e `FormGroup` no contexto de aninhamento.
- **Sintaxe Detalhada e Uso Prático:** Como usar `NgModelGroup` e criar uma referência local para ele.
- **Cenários de Restrição ou Não Aplicação:** Quando o `NgModelGroup` pode não ser a melhor escolha.
- **Componentes Chave Associados:** Análise de `NgModelGroup`, `NgForm`, `ngModel` e `FormGroup`.
- **Melhores Práticas e Padrões de Uso:** Dicas e recomendações para usar `NgModelGroup` de forma eficaz.
- **Exemplo Prático Completo:** Um cenário de ponta a ponta para ilustrar o uso.

---

### Conceitos Fundamentais

### Formulários Template Driven

Nos **Template Driven Forms**, o formulário é construído diretamente no template HTML usando diretivas do Angular. O Angular cria internamente objetos do tipo `FormControl`, `FormGroup` e `FormArray` para espelhar a estrutura do seu HTML. A diretiva `ngModel` é fundamental, pois ela cria e gerencia um `FormControl` para cada elemento de input do formulário e vincula os dados em ambas as direções.

### NgModelGroup

A diretiva `NgModelGroup` é uma ferramenta poderosa para organizar seus formulários Template Driven. Ela permite que você agrupe um conjunto de controles de formulário relacionados em um **`FormGroup` aninhado**. Pense nela como uma maneira de criar "subformulários" dentro do seu formulário principal.

**Propósito e Importância:**

- **Organização:** Estrutura o formulário de forma lógica, especialmente útil para dados complexos ou seções repetitivas.
- **Validação em Grupo:** Permite aplicar validações a um grupo de campos como um todo, por exemplo, um grupo de campos de endereço que deve ser preenchido completamente.
- **Reuso de Código:** Facilita a criação de componentes para seções de formulário, onde o `NgModelGroup` pode ser usado para encapsular a lógica de um subconjunto de campos.
- **Acesso ao Estado Aninhado:** Permite acessar o estado (válido, inválido, sujo, tocado) e os valores de um grupo específico de campos, independentemente do restante do formulário.

### FormGroup

No Angular, um `FormGroup` é uma coleção de `FormControls` e/ou outros `FormGroups`. Ele representa uma unidade de formulário e é usado para gerenciar um grupo de entradas de formulário. Quando você usa `NgModelGroup`, o Angular cria um `FormGroup` subjacente para representar aquele grupo de controles.

---

### Sintaxe Detalhada e Uso Prático

Para criar uma referência de `Form Group` com `NgModelGroup`, você precisa seguir os seguintes passos:

1. **Importar `FormsModule`:** Certifique-se de que o `FormsModule` esteja importado no seu `AppModule` ou no módulo do seu componente. Este módulo fornece as diretivas para trabalhar com formulários Template Driven, incluindo `ngModel` e `NgModelGroup`.
    
    ```tsx
    // app.module.ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { FormsModule } from '@angular/forms'; // Importar FormsModule
    
    import { AppComponent } from './app.component';
    import { MeuFormularioComponent } from './meu-formulario/meu-formulario.component';
    
    @NgModule({
      declarations: [
        AppComponent,
        MeuFormularioComponent
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
    
2. **Usar a Diretiva `NgModelGroup` no Template:** Envolva os controles de formulário que você deseja agrupar com um elemento HTML (geralmente um `div` ou `fieldset`) e aplique a diretiva `NgModelGroup` a ele.
    
    ```html
    <form #meuForm="ngForm" (ngSubmit)="onSubmit(meuForm)">
      <h3>Dados Pessoais</h3>
      <label for="nome">Nome:</label>
      <input type="text" id="nome" name="nome" [(ngModel)]="usuario.nome" required>
    
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" [(ngModel)]="usuario.email" email>
    
      <div ngModelGroup="endereco" #enderecoGroup="ngModelGroup">
        <h3>Endereço</h3>
        <label for="rua">Rua:</label>
        <input type="text" id="rua" name="rua" [(ngModel)]="usuario.endereco.rua" required>
    
        <label for="numero">Número:</label>
        <input type="text" id="numero" name="numero" [(ngModel)]="usuario.endereco.numero" required>
    
        <label for="cidade">Cidade:</label>
        <text type="text" id="cidade" name="cidade" [(ngModel)]="usuario.endereco.cidade" required>
      </div>
    
      <p>Estado do Endereço: {{ enderecoGroup.valid ? 'Válido' : 'Inválido' }}</p>
      <p>Endereço Tocado: {{ enderecoGroup.touched ? 'Sim' : 'Não' }}</p>
      <p>Valores do Endereço: {{ enderecoGroup.value | json }}</p>
    
      <button type="submit" [disabled]="!meuForm.valid">Enviar</button>
    </form>
    
    ```
    
3. **Criar uma Referência Local (Template Reference Variable):** Para acessar o `FormGroup` criado pelo `NgModelGroup`, você precisa criar uma referência local para ele no template. Isso é feito usando a sintaxe `#nomeDaVariavel="ngModelGroup"`. No exemplo acima, `#enderecoGroup="ngModelGroup"` cria uma variável de template chamada `enderecoGroup` que faz referência ao `FormGroup` aninhado.
    
    **Explicação dos marcadores:**
    
    - `ngModelGroup="endereco"`: Esta é a diretiva `NgModelGroup`. O valor `"endereco"` será usado como a chave para o `FormGroup` aninhado dentro do `FormGroup` principal do formulário. Isso significa que, ao inspecionar os valores do formulário, você terá um objeto como `{ nome: '...', email: '...', endereco: { rua: '...', numero: '...', cidade: '...' } }`.
    - `#enderecoGroup="ngModelGroup"`: Esta é a **variável de referência de template** que aponta para a instância do `NgModelGroup` (e, consequentemente, para o `FormGroup` que ele representa). Através desta variável, você pode acessar as propriedades e métodos do `FormGroup` aninhado, como `valid`, `invalid`, `touched`, `dirty`, `value`, etc.
4. **Acessar a Referência no Componente (Opcional, mas comum):** Embora o exemplo acima mostre o acesso direto no template, você também pode passar a referência para um método no seu componente.
    
    ```tsx
    // meu-formulario.component.ts
    import { Component } from '@angular/core';
    import { NgForm } from '@angular/forms';
    
    @Component({
      selector: 'app-meu-formulario',
      templateUrl: './meu-formulario.component.html',
      styleUrls: ['./meu-formulario.component.css']
    })
    export class MeuFormularioComponent {
      usuario = {
        nome: '',
        email: '',
        endereco: {
          rua: '',
          numero: '',
          cidade: ''
        }
      };
    
      onSubmit(form: NgForm) {
        console.log('Formulário Enviado!', form.value);
        // Você pode acessar o FormGroup do endereco assim:
        // console.log('Valores do Endereço:', form.controls['endereco']?.value);
        // ou se você passar a referência diretamente:
        // console.log('Valores do Endereço (direto do NgModelGroup):', form.form.get('endereco')?.value);
    
        // Para acessar o FormGroup específico do NgModelGroup, você pode usar:
        const enderecoGroup = form.controls['endereco'];
        if (enderecoGroup) {
          console.log('Estado do Endereço (no componente):', enderecoGroup.valid);
          console.log('Valores do Endereço (no componente):', enderecoGroup.value);
        }
      }
    }
    
    ```
    

---

### Cenários de Restrição ou Não Aplicação

Embora `NgModelGroup` seja útil, existem situações em que ele pode não ser a melhor escolha:

- **Formulários Muito Complexos e Dinâmicos:** Para formulários com lógica complexa, validações personalizadas ou que mudam dinamicamente com base nas interações do usuário, os **Reactive Forms** geralmente oferecem mais controle e testabilidade. Em Reactive Forms, você constrói o modelo do formulário programaticamente no componente, o que é mais adequado para cenários avançados.
- **Performance em Larga Escala (raro, mas possível):** Em cenários de formulários extremamente grandes com muitos `NgModelGroups` aninhados e validações pesadas, a detecção de mudanças do Angular em Template Driven Forms pode ter um impacto marginal na performance. No entanto, para a maioria das aplicações, isso não será um problema significativo.
- **Testabilidade:** Reactive Forms são geralmente mais fáceis de testar de forma unitária, pois o modelo do formulário é uma estrutura de dados explícita que pode ser manipulada programaticamente.
- **Criação de Formulários Totalmente Dinâmicos:** Se você precisa construir um formulário inteiro com base em metadados de uma API, por exemplo, os Reactive Forms são a abordagem mais robusta e flexível.

---

### Componentes Chave Associados

Vamos analisar os componentes cruciais envolvidos:

- **`NgModelGroup` (Diretiva):**
    - **Propósito:** Agrupa controles de formulário dentro de um `FormGroup` aninhado.
    - **Uso:** Aplicado a um elemento HTML (`<div ngModelGroup="nomeDoGrupo">`).
    - **Sintaxe Específica:**
        - `ngModelGroup="nomeDoGrupo"`: Define o nome da propriedade no objeto de valor do formulário que representará este grupo.
        - `#minhaReferencia="ngModelGroup"`: Cria uma variável de template que aponta para a instância do `NgModelGroup`, permitindo acesso às suas propriedades (ex: `valid`, `invalid`, `value`).
- **`NgForm` (Diretiva):**
    - **Propósito:** Criada implicitamente quando você usa a tag `<form>` e importa o `FormsModule`. Ela gerencia o `FormGroup` de nível superior para todo o seu formulário.
    - **Uso:** Atuando na tag `<form>`.
    - **Sintaxe Específica:**
        - `#meuForm="ngForm"`: Cria uma variável de template que aponta para a instância do `NgForm`, permitindo acessar o `FormGroup` principal do formulário e suas propriedades (ex: `meuForm.valid`, `meuForm.value`).
        - `(ngSubmit)="onSubmit(meuForm)"`: Evento para lidar com o envio do formulário.
- **`ngModel` (Diretiva):**
    - **Propósito:** Cria e gerencia um `FormControl` individual para um elemento de input e vincula os dados bidirecionalmente.
    - **Uso:** Aplicado a elementos de input (`<input type="text" name="campo" [(ngModel)]="valor">`).
    - **Sintaxe Específica:**
        - `name="campo"`: É **obrigatório** para que o `ngModel` possa registrar o controle no `FormGroup`.
        - `[(ngModel)]="propriedade"`: Vinculação de dados bidirecional.
        - `#campoRef="ngModel"`: Cria uma variável de template para o `FormControl` individual.
- **`FormGroup` (Classe, subjacente):**
    - **Propósito:** Representa uma coleção de `FormControls` e/ou outros `FormGroups`. Tanto `NgForm` quanto `NgModelGroup` criam instâncias de `FormGroup` internamente.
    - **Acesso:** Você não interage diretamente com a classe `FormGroup` em Template Driven Forms da mesma forma que em Reactive Forms. Em vez disso, você acessa as propriedades e métodos do `FormGroup` através das referências de template criadas por `NgForm` e `NgModelGroup`.
    - **Propriedades Comuns (acessíveis via variáveis de template):**
        - `value`: O objeto JavaScript que representa os valores de todos os controles no grupo.
        - `valid`: Booleano, `true` se todos os controles no grupo são válidos.
        - `invalid`: Booleano, `true` se pelo menos um controle no grupo é inválido.
        - `touched`: Booleano, `true` se o grupo ou qualquer um de seus controles foi tocado pelo usuário.
        - `untouched`: Booleano, `true` se o grupo e todos os seus controles não foram tocados.
        - `dirty`: Booleano, `true` se o grupo ou qualquer um de seus controles teve seu valor alterado pelo usuário.
        - `pristine`: Booleano, `true` se o grupo e todos os seus controles não tiveram seu valor alterado.
        - `controls`: Um objeto que contém os `FormControls` e `FormGroups` filhos.

---

### Melhores Práticas e Padrões de Uso

- **Nomes Descritivos:** Dê nomes significativos aos seus `ngModelGroup` (ex: `endereco`, `dadosContato`) para facilitar a leitura e o entendimento do código.
- **Estrutura Coerente:** Agrupe os campos de forma lógica. Seção de endereço, seção de informações de contato, etc.
- **Validação Granular:** Use `NgModelGroup` para aplicar validações a um grupo de campos. Por exemplo, você pode verificar se todos os campos dentro de um `NgModelGroup` são válidos antes de permitir o envio de uma parte do formulário.
- **Componentes Reutilizáveis:** Encapsule `NgModelGroup` em componentes filhos para reutilizar seções de formulário. Por exemplo, um componente `AddressFormComponent` que internamente usa um `NgModelGroup`.
- **Mensagens de Erro por Grupo:** Utilize a referência do `NgModelGroup` para exibir mensagens de erro para o grupo como um todo, ou para campos individuais dentro do grupo, baseando-se no estado de validação do `NgModelGroup`.
- **Evite Aninhamento Excessivo:** Embora seja possível aninhar `NgModelGroups`, evite níveis excessivos de aninhamento, pois pode tornar o formulário mais difícil de gerenciar e depurar.
- **Escolha a Abordagem Certa:** Lembre-se que `NgModelGroup` é para Template Driven Forms. Se a complexidade do seu formulário aumentar significativamente ou se você precisar de testes unitários mais robustos, considere migrar para Reactive Forms.

---

### Exemplo Prático Completo

Vamos criar um exemplo mais completo para um formulário de registro de usuário que inclui dados pessoais e informações de endereço, usando `NgModelGroup`.

### `src/app/app.module.ts`

```tsx
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importante!

import { AppComponent } from './app.component';
import { UsuarioRegistroComponent } from './usuario-registro/usuario-registro.component';

@NgModule({
  declarations: [
    AppComponent,
    UsuarioRegistroComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // Adicionar o FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### `src/app/usuario-registro/usuario-registro.component.ts`

```tsx
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
}

interface Usuario {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  endereco: Endereco;
}

@Component({
  selector: 'app-usuario-registro',
  templateUrl: './usuario-registro.component.html',
  styleUrls: ['./usuario-registro.component.css']
})
export class UsuarioRegistroComponent {
  usuario: Usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      cep: ''
    }
  };

  registroSucesso = false;

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Formulário Enviado com Sucesso!', form.value);
      console.log('Dados do Usuário:', this.usuario);
      this.registroSucesso = true;

      // Você pode acessar o FormGroup do endereço assim:
      const enderecoGroup = form.controls['endereco'];
      if (enderecoGroup) {
        console.log('Estado de Validação do Endereço:', enderecoGroup.valid);
        console.log('Valores do Endereço:', enderecoGroup.value);
      }
      // Limpar formulário ou redirecionar
      // form.resetForm();
    } else {
      console.log('Formulário Inválido!', form);
      // Opcional: Marcar todos os campos como "tocados" para exibir erros
      this.markAllAsTouched(form);
    }
  }

  // Função auxiliar para marcar todos os controles como tocados (útil para exibir erros)
  markAllAsTouched(form: NgForm) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
      // Se for um FormGroup aninhado (NgModelGroup), marcar seus controles também
      if (control instanceof Object && 'controls' in control) {
        Object.values((control as any).controls).forEach((nestedControl: any) => {
          nestedControl.markAsTouched();
        });
      }
    });
  }
}

```

### `src/app/usuario-registro/usuario-registro.component.html`

```html
<div class="container">
  <h2>Formulário de Registro de Usuário</h2>

  <form #registroForm="ngForm" (ngSubmit)="onSubmit(registroForm)">

    <div class="form-section">
      <h3>Dados Pessoais</h3>
      <div class="form-group">
        <label for="nome">Nome Completo:</label>
        <input type="text" id="nome" name="nome" [(ngModel)]="usuario.nome" required minlength="3" #nomeControl="ngModel">
        <div *ngIf="nomeControl.invalid && (nomeControl.dirty || nomeControl.touched)" class="error-message">
          <div *ngIf="nomeControl.errors?.['required']">Nome é obrigatório.</div>
          <div *ngIf="nomeControl.errors?.['minlength']">Nome deve ter no mínimo 3 caracteres.</div>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" [(ngModel)]="usuario.email" required email #emailControl="ngModel">
        <div *ngIf="emailControl.invalid && (emailControl.dirty || emailControl.touched)" class="error-message">
          <div *ngIf="emailControl.errors?.['required']">Email é obrigatório.</div>
          <div *ngIf="emailControl.errors?.['email']">Email inválido.</div>
        </div>
      </div>

      <div class="form-group">
        <label for="senha">Senha:</label>
        <input type="password" id="senha" name="senha" [(ngModel)]="usuario.senha" required minlength="6" #senhaControl="ngModel">
        <div *ngIf="senhaControl.invalid && (senhaControl.dirty || senhaControl.touched)" class="error-message">
          <div *ngIf="senhaControl.errors?.['required']">Senha é obrigatória.</div>
          <div *ngIf="senhaControl.errors?.['minlength']">Senha deve ter no mínimo 6 caracteres.</div>
        </div>
      </div>

      <div class="form-group">
        <label for="confirmarSenha">Confirmar Senha:</label>
        <input type="password" id="confirmarSenha" name="confirmarSenha" [(ngModel)]="usuario.confirmarSenha" required #confirmarSenhaControl="ngModel">
        <div *ngIf="confirmarSenhaControl.invalid && (confirmarSenhaControl.dirty || confirmarSenhaControl.touched)" class="error-message">
          <div *ngIf="confirmarSenhaControl.errors?.['required']">Confirmação de senha é obrigatória.</div>
        </div>
        <div *ngIf="usuario.senha !== usuario.confirmarSenha && confirmarSenhaControl.dirty && confirmarSenhaControl.touched" class="error-message">
          As senhas não coincidem.
        </div>
      </div>
    </div>

    <hr>

    <div class="form-section" ngModelGroup="endereco" #enderecoGroup="ngModelGroup">
      <h3>Informações de Endereço</h3>
      <p>Status do Endereço: <span [ngClass]="{'valid-text': enderecoGroup.valid, 'invalid-text': enderecoGroup.invalid && enderecoGroup.touched}">{{ enderecoGroup.valid ? 'Válido' : 'Inválido' }}</span></p>
      <p>Endereço Tocado: {{ enderecoGroup.touched ? 'Sim' : 'Não' }}</p>
      <p>Endereço Sujo: {{ enderecoGroup.dirty ? 'Sim' : 'Não' }}</p>

      <div class="form-group">
        <label for="rua">Rua:</label>
        <input type="text" id="rua" name="rua" [(ngModel)]="usuario.endereco.rua" required #ruaControl="ngModel">
        <div *ngIf="ruaControl.invalid && (ruaControl.dirty || ruaControl.touched)" class="error-message">
          Rua é obrigatória.
        </div>
      </div>

      <div class="form-group">
        <label for="numero">Número:</label>
        <input type="text" id="numero" name="numero" [(ngModel)]="usuario.endereco.numero" required #numeroControl="ngModel">
        <div *ngIf="numeroControl.invalid && (numeroControl.dirty || numeroControl.touched)" class="error-message">
          Número é obrigatório.
        </div>
      </div>

      <div class="form-group">
        <label for="bairro">Bairro:</label>
        <input type="text" id="bairro" name="bairro" [(ngModel)]="usuario.endereco.bairro" required #bairroControl="ngModel">
        <div *ngIf="bairroControl.invalid && (bairroControl.dirty || bairroControl.touched)" class="error-message">
          Bairro é obrigatório.
        </div>
      </div>

      <div class="form-group">
        <label for="cidade">Cidade:</label>
        <input type="text" id="cidade" name="cidade" [(ngModel)]="usuario.endereco.cidade" required #cidadeControl="ngModel">
        <div *ngIf="cidadeControl.invalid && (cidadeControl.dirty || cidadeControl.touched)" class="error-message">
          Cidade é obrigatória.
        </div>
      </div>

      <div class="form-group">
        <label for="cep">CEP:</label>
        <input type="text" id="cep" name="cep" [(ngModel)]="usuario.endereco.cep" required pattern="^\\d{5}-\\d{3}$" #cepControl="ngModel">
        <div *ngIf="cepControl.invalid && (cepControl.dirty || cepControl.touched)" class="error-message">
          <div *ngIf="cepControl.errors?.['required']">CEP é obrigatório.</div>
          <div *ngIf="cepControl.errors?.['pattern']">Formato de CEP inválido (Ex: 12345-678).</div>
        </div>
      </div>
    </div>

    <hr>

    <p>Status Geral do Formulário: <span [ngClass]="{'valid-text': registroForm.valid, 'invalid-text': registroForm.invalid && registroForm.touched}">{{ registroForm.valid ? 'Válido' : 'Inválido' }}</span></p>
    <p>Valores do Formulário: {{ registroForm.value | json }}</p>

    <button type="submit" [disabled]="!registroForm.valid">Registrar</button>

    <div *ngIf="registroSucesso" class="success-message">
      Usuário registrado com sucesso!
    </div>
  </form>
</div>

```

### `src/app/usuario-registro/usuario-registro.component.css`

```css
.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h2, h3 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.form-section {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: calc(100% - 22px); /* Adjust for padding and border */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  font-size: 16px;
}

input.ng-invalid.ng-touched {
  border-color: #dc3545; /* Red border for invalid and touched fields */
}

.error-message {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 5px;
}

.valid-text {
  color: #28a745;
  font-weight: bold;
}

.invalid-text {
  color: #dc3545;
  font-weight: bold;
}

button {
  display: block;
  width: 100%;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

.success-message {
  text-align: center;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  margin-top: 20px;
}

hr {
  border: 0;
  height: 1px;
  background: #eee;
  margin: 30px 0;
}

```

Neste exemplo:

- O formulário principal é gerenciado pela diretiva `ngForm` com a referência de template `#registroForm`.
- As informações de endereço são agrupadas usando `<div ngModelGroup="endereco" #enderecoGroup="ngModelGroup">`. Isso cria um `FormGroup` aninhado chamado `endereco`.
- A referência de template `enderecoGroup` permite exibir o estado de validação (`valid`, `touched`, `dirty`) e os valores específicos do grupo de endereço diretamente no template.
- No método `onSubmit` do componente, você pode acessar os valores de todo o formulário (`form.value`) que incluirá o objeto `endereco` aninhado. Também demonstramos como acessar o `FormGroup` do endereço diretamente via `form.controls['endereco']`.
- Validações básicas (`required`, `minlength`, `email`, `pattern`) são aplicadas aos inputs.
- Mensagens de erro condicionais são exibidas com base no estado de validação de cada `FormControl` e do `FormGroup` aninhado.

---

Gedê, espero que esta explicação detalhada ajude você a entender e utilizar o `NgModelGroup` de forma eficaz em seus projetos Angular\! Se tiver mais alguma dúvida, é só perguntar\!