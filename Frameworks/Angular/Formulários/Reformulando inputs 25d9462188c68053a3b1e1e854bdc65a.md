# Reformulando inputs

Olá Gedê, A.R.I.A. aqui.

Peço desculpas se a explicação anterior pareceu um manual técnico desconexo. Você está coberto de razão. A melhor forma de entender um conceito não é listando todas as suas partes, mas construindo uma história do começo ao fim.

Vamos recomeçar com uma abordagem muito mais intuitiva, partindo de um problema real e construindo a solução passo a passo.

---

### **O Guia Intuitivo para Componentes de Atributo no Angular**

### **O Problema: Nossos Formulários Estão Repetitivos**

Imagine que estamos construindo um formulário de cadastro. Temos vários campos de input. Para cada um, queremos:

1. Um estilo padrão (bordas, padding, etc.).
2. Um estilo especial quando o campo é inválido (borda vermelha).
3. Um `label` associado.
4. Um local para mostrar mensagens de erro.

O nosso HTML começa a ficar assim, repetindo a mesma estrutura várias vezes:

```html
<div class="form-field">
  <label for="name">Nome</label>
  <input type="text" formControlName="name" class="form-control"
         [class.is-invalid]="form.get('name')?.invalid && form.get('name')?.touched">
  <div class="error-message" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
    Campo obrigatório.
  </div>
</div>

<div class="form-field">
  <label for="email">E-mail</label>
  <input type="email" formControlName="email" class="form-control"
         [class.is-invalid]="form.get('email')?.invalid && form.get('email')?.touched">
  <div class="error-message" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
    E-mail inválido.
  </div>
</div>

```

Isso é feio, repetitivo e difícil de manter. Como podemos simplificar isso?

### **A Primeira Ideia (Comum, mas com uma falha): Criar um `<app-input>`**

A primeira coisa que pensamos é: "Vou criar um componente\!".

```tsx
// app-input.component.ts
@Component({
  selector: 'app-input',
  template: `<input ...>`
})
export class AppInputComponent {}

```

Mas aqui surge um problema chato. Um `<input>` normal tem dezenas de atributos: `type`, `placeholder`, `id`, `autocomplete`, `maxlength`... Teríamos que criar um `@Input()` no nosso componente para cada um deles e repassá-los para o `input` interno. Fica inviável.

Além disso, `<app-input>` não é uma tag HTML de verdade. Perdemos a semântica e a acessibilidade de um `<input>` nativo.

**Conclusão:** Substituir a tag `<input>` é complicado. E se, em vez de substituir, a gente pudesse... **aprimorar**?

### **A Solução Elegante: Aprimorar o `<input>` com um Seletor de Atributo**

É aqui que a mágica acontece. Em vez de criar uma nova tag, vamos dizer ao Angular: "Ei, quando você vir um `<input>` com um atributo especial que eu inventei, chamado `app-input`, quero que você anexe a lógica do meu componente a ele."

É exatamente isso que `selector: 'input[app-input]'` faz.

Agora, nosso HTML fica limpo e semântico novamente. Todos os atributos nativos (`type`, `placeholder`, etc.) funcionam sem esforço, pois o elemento *continua sendo um `<input>`*.

```html
<input app-input type="text" formControlName="name" placeholder="Seu nome aqui">

```

Agora que temos o nosso "input aprimorado", vamos dar a ele os superpoderes que queríamos.

---

### **Passo 1: Deixando o Input Bonito (Estilização com `:host`)**

Nosso `InputComponent` precisa de um CSS. Mas como dizemos no CSS "aplique estes estilos ao elemento que meu componente está anexado"?

Usamos a pseudo-classe especial `:host`. Pense em `:host` como um apelido para "o elemento hospedeiro".

```tsx
// input.component.ts
@Component({
  selector: 'input[app-input]',
  standalone: true,
  template: ``, // Não precisamos de template, pois já estamos no <input>
  styles: [`
    /* 'host' aqui significa o 'input[app-input]' */
    :host {
      display: block;
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    /* Também podemos usar :host com outras condições! */
    :host(:focus) {
      border-color: blue;
      box-shadow: 0 0 5px rgba(0, 0, 255, 0.5);
    }
  `]
})
export class InputComponent {}

```

Com isso, todo `<input app-input>` no nosso projeto terá automaticamente um estilo base consistente e um efeito de foco, sem precisar adicionar nenhuma classe CSS no HTML.

---

### **Passo 2: Deixando o Input Inteligente (Adicionando Lógica com `@HostBinding`)**

Agora, a parte mais legal: como adicionamos a borda vermelha (`.is-invalid`) dinamicamente? Nosso componente precisa de uma forma de *controlar* o seu hospedeiro.

Usamos o decorator `@HostBinding`. O nome já diz tudo: ele **vincula** uma propriedade da nossa classe a uma propriedade do **host**.

Vamos vincular a classe `is-invalid` do host a uma propriedade `isInvalid` na nossa classe.

```tsx
// input.component.ts (continuação)
import { Component, HostBinding, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'input[app-input]',
  // ... styles do passo 1 ...
  styles: [`
    :host { /* ... */ }
    :host(:focus) { /* ... */ }

    /* Agora este estilo será ativado pelo @HostBinding! */
    :host.is-invalid {
      border-color: red;
    }
  `]
})
export class InputComponent {
  // Injetamos NgControl para "espiar" o formControlName associado a este input.
  constructor(@Self() public ngControl: NgControl) {}

  // A MÁGICA ACONTECE AQUI:
  @HostBinding('class.is-invalid')
  get isInvalid(): boolean {
    const control = this.ngControl.control;
    // Retorna true se o controle for inválido E já foi tocado pelo usuário.
    return control ? control.invalid && control.touched : false;
  }
}

```

Pronto\! Nosso componente agora observa o estado do `FormControl` e **automaticamente adiciona ou remove a classe `is-invalid` do `<input>`**. A lógica de validação está encapsulada e reutilizável.

*Nota rápida: Existe uma sintaxe alternativa chamada `host: {}` no `@Component` que faz a mesma coisa que `@HostBinding` e `@HostListener`. É apenas uma questão de preferência de estilo.*

---

### **Passo 3: Conectando com o Formulário (A Ponte `ControlValueAccessor`)**

Falta uma peça. Embora nosso componente já consiga *ler* o estado do `FormControl` (via `NgControl`), o Angular ainda não o reconhece oficialmente como um componente de formulário customizado. Para tornar essa conexão oficial e garantir que tudo funcione perfeitamente, precisamos construir uma "ponte".

Essa ponte é uma interface chamada `ControlValueAccessor`.

Pense nela como um "adaptador universal". Ao implementar essa interface, estamos dizendo: "Angular, pode confiar\! Eu sei como receber valores de você e como te avisar quando o usuário mudar algo."

A boa notícia? Para o nosso caso específico, onde o componente **é o próprio `<input>`**, a implementação é trivial. Nós só precisamos dizer ao Angular que existimos, mas não precisamos gerenciar os valores manualmente, pois o input nativo já faz isso.

```tsx
// input.component.ts (versão final)
import { Component, HostBinding, Self } from '@angular/core';
// Importamos o ControlValueAccessor e o NgControl
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'input[app-input]',
  standalone: true,
  template: ``,
  styles: [/* ... */]
})
// 1. Implementamos a interface
export class InputComponent implements ControlValueAccessor {

  constructor(@Self() public ngControl: NgControl) {
    // 2. Registramos este componente como o "adaptador" para o FormControl
    this.ngControl.valueAccessor = this;
  }

  @HostBinding('class.is-invalid')
  get isInvalid(): boolean {
    const control = this.ngControl.control;
    return control ? control.invalid && control.touched : false;
  }

  // 3. Implementamos os métodos da interface. Como estamos em um input nativo,
  // podemos deixá-los vazios. O Angular cuida do resto.
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}

```

E é isso. Agora nosso componente está completo, inteligente e totalmente integrado ao sistema de formulários do Angular.

### **O Resultado Final: HTML Limpo e Declarativo**

Depois de todo esse trabalho, nosso HTML de formulário original, que era grande e repetitivo, se transforma nisto:

```html
<app-form-field label="Nome">
  <input app-input type="text" formControlName="name">
</app-form-field>

<app-form-field label="E-mail">
  <input app-input type="email" formControlName="email">
</app-form-field>

```

Simples. Limpo. Reutilizável. Toda a complexidade de estilo e validação está encapsulada dentro do `InputComponent`.

### **Resumo Intuitivo**

- **Problema:** HTML de formulário repetitivo e difícil de manter.
- **Solução:** Não substitua o `<input>`, **aprimore-o** com um componente de atributo (`input[app-input]`).
- **Passo 1 (Estilo):** Use `:host` no seu CSS para estilizar o próprio elemento hospedeiro.
- **Passo 2 (Inteligência):** Use `@HostBinding` para controlar as propriedades do host (como `class`) a partir da lógica do seu componente.
- **Passo 3 (Integração):** Implemente o `ControlValueAccessor` para criar a "ponte" oficial com o sistema de formulários do Angular.

Espero que esta abordagem, Gedê, construindo a solução passo a passo, tenha tornado o conceito muito mais claro e intuitivo. Qualquer ponto que ainda não esteja 100%, é só me perguntar\!