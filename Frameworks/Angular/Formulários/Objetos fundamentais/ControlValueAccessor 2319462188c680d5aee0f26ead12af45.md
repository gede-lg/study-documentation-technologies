# ControlValueAccessor

Com certeza, Gedê\! A.R.I.A. vai te ajudar a desmistificar o **ControlValueAccessor** no Angular. É um tema super importante para desenvolvedores backend como você que estão migrando para o frontend, especialmente quando lidamos com formulários. Vamos mergulhar fundo para entender cada detalhe.

---

# Entendendo o ControlValueAccessor no Angular: Uma Explicação Detalhada

## Introdução

No universo dos formulários no Angular, especialmente quando trabalhamos com componentes personalizados que precisam interagir com os `FormsModule` (formulários baseados em template) ou `ReactiveFormsModule` (formulários reativos), surge a necessidade de uma ponte. Essa ponte é o **ControlValueAccessor**. Ele permite que um componente personalizado atue como um controle de formulário, reportando suas mudanças de valor e recebendo valores do modelo de dados do formulário do Angular.

## Sumário

Nesta explicação detalhada, abordaremos os seguintes pontos:

- Conceitos Fundamentais do ControlValueAccessor.
- A necessidade e o propósito dessa interface.
- Sintaxe detalhada e uso prático para implementar um `ControlValueAccessor`.
- Exploração de todos os métodos e propriedades da interface.
- Cenários onde o `ControlValueAccessor` pode não ser a melhor escolha.
- Componentes chave associados e como eles se interligam.
- Melhores práticas e padrões de uso.
- Um exemplo prático completo para solidificar o entendimento.

---

## Conceitos Fundamentais

O `ControlValueAccessor` é uma **interface** fornecida pelo Angular, parte do pacote `@angular/forms`. Sua principal função é atuar como um **adaptador** entre a API de formulários do Angular (seja `FormsModule` ou `ReactiveFormsModule`) e um elemento nativo do DOM ou um componente personalizado.

### Por que ele é importante?

Imagine que você está criando um componente de seleção de data ou um campo de entrada com formatação específica (como um CPF ou CNPJ). Se você usar um `<input type="text">` simples, o Angular já sabe como interagir com ele. No entanto, para o seu componente personalizado, o Angular não tem essa "receita". É aqui que o `ControlValueAccessor` entra. Ele fornece um conjunto de métodos que o Angular pode chamar para:

1. **Escrever valores** do modelo do formulário para o seu componente (`writeValue`).
2. **Registrar uma função** que o Angular pode chamar quando o valor do seu componente mudar (`registerOnChange`).
3. **Registrar uma função** que o Angular pode chamar quando o controle for "tocado" (blurred) (`registerOnTouched`).
4. **Desabilitar ou habilitar** o seu componente (`setDisabledState`).

Sem o `ControlValueAccessor`, seus componentes personalizados não seriam capazes de se integrar perfeitamente com os recursos de validação, estado (`valid`, `invalid`, `dirty`, `touched`), e controle de valor dos formulários do Angular.

---

## Sintaxe Detalhada e Uso Prático

Para implementar o `ControlValueAccessor`, seu componente personalizado deve implementar a interface `ControlValueAccessor` e fornecer os métodos exigidos por ela. Além disso, é necessário registrar o componente como um `NG_VALUE_ACCESSOR` no provedor de injetores do Angular.

Vamos criar um exemplo de um componente `CustomInputComponent` que implementa o `ControlValueAccessor`.

```tsx
// custom-input.component.ts
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: `
    <label>{{ label }}:</label>
    <input
      [type]="type"
      [(ngModel)]="value"
      (blur)="onTouched()"
      [disabled]="isDisabled"
      (input)="onChange(value)"
    />
  `,
  // O provide: NG_VALUE_ACCESSOR registra este componente como um ControlValueAccessor.
  // O useExisting: forwardRef(() => CustomInputComponent) evita problemas de referência circular.
  // O multi: true indica que pode haver múltiplos NG_VALUE_ACCESSORs, permitindo que a injeção seja uma array de provedores.
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ],
  styleUrls: ['./custom-input.component.css']
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label: string = 'Campo';
  @Input() type: string = 'text';

  // O valor interno do nosso componente.
  // O underscore indica que é uma propriedade privada, mas pode ser acessada via getter/setter.
  _value: any = '';

  // Getter para o valor do componente.
  get value(): any {
    return this._value;
  }

  // Setter para o valor do componente.
  // Quando o valor é alterado internamente, notificamos o Angular.
  set value(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val); // Notifica o Angular sobre a mudança
    }
  }

  // Funções que o Angular registrará para nos notificar.
  // onChange: Chamado quando o valor do componente muda.
  onChange: any = () => {};
  // onTouched: Chamado quando o controle perde o foco (blur).
  onTouched: any = () => {};

  // Estado de desabilitado.
  isDisabled: boolean = false;

  // --- Implementação dos métodos da interface ControlValueAccessor ---

  /**
   * writeValue(obj: any): void
   * É chamado pelo Angular quando ele quer que o controle escreva um novo valor para o DOM.
   * Por exemplo, quando você define um valor inicial para um FormControl, ou quando chama formGroup.patchValue().
   * @param obj O valor a ser escrito.
   */
  writeValue(obj: any): void {
    this._value = obj;
  }

  /**
   * registerOnChange(fn: any): void
   * É chamado pelo Angular para registrar uma função de retorno de chamada (callback) que
   * deve ser acionada quando o valor do controle muda no DOM.
   * Esta função deve ser chamada dentro do seu componente sempre que o valor interno mudar.
   * @param fn A função de callback a ser registrada.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * registerOnTouched(fn: any): void
   * É chamado pelo Angular para registrar uma função de retorno de chamada (callback) que
   * deve ser acionada quando o controle é "tocado" (por exemplo, quando o usuário tira o foco do campo).
   * @param fn A função de callback a ser registrada.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * setDisabledState(isDisabled: boolean): void
   * É chamado pelo Angular para notificar o controle sobre a mudança de estado de desabilitado.
   * Seu componente deve reagir a essa mudança, desabilitando ou habilitando o elemento apropriado no DOM.
   * @param isDisabled true se o controle deve ser desabilitado, false caso contrário.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}

```

Para usar este componente em um formulário reativo:

```tsx
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <h2>Exemplo de Uso do CustomInputComponent</h2>
    <form [formGroup]="myForm">
      <app-custom-input
        label="Nome"
        type="text"
        formControlName="nome"
      ></app-custom-input>

      <app-custom-input
        label="Email"
        type="email"
        formControlName="email"
      ></app-custom-input>

      <button type="submit" [disabled]="myForm.invalid">Enviar</button>
    </form>
    <p>Form Status: {{ myForm.status }}</p>
    <p>Form Value: {{ myForm.value | json }}</p>
    <button (click)="patchValue()">Patch Value</button>
  `
})
export class AppComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  patchValue(): void {
    this.myForm.patchValue({
      nome: 'Gedê',
      email: 'gede@example.com'
    });
  }
}

```

E para não esquecer de importar no `AppModule`:

```tsx
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Importar ReactiveFormsModule e FormsModule

import { AppComponent } from './app.component';
import { CustomInputComponent } from './custom-input/custom-input.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomInputComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, // Adicionar ReactiveFormsModule
    FormsModule // Adicionar FormsModule se for usar ngModel diretamente
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

---

## Métodos/Propriedades da Interface ControlValueAccessor

A interface `ControlValueAccessor` define os seguintes métodos:

- `writeValue(obj: any): void`
    - **Conceito:** Este método é invocado pelo Angular para escrever um novo valor do modelo para o controle do DOM. Sempre que o valor do `FormControl` associado ao seu componente mudar programaticamente (por exemplo, via `setValue()`, `patchValue()`, ou `reset()`), o Angular chamará este método no seu `ControlValueAccessor`.
    - **Uso:** Seu componente deve usar o valor fornecido (`obj`) para atualizar seu próprio estado interno e refletir essa mudança na sua UI (interface do usuário).
    - **Sintaxe de Uso Básica:**
        
        ```tsx
        writeValue(obj: any): void {
          this._value = obj; // Atualiza a propriedade interna do componente
          // Opcionalmente, atualize a UI do componente se ela não for diretamente vinculada a _value
        }
        
        ```
        
- `registerOnChange(fn: any): void`
    - **Conceito:** O Angular chama este método para registrar uma função de callback (`fn`) que seu `ControlValueAccessor` deve chamar sempre que o valor do seu controle interno mudar. Esta função permite que o `FormControl` do Angular seja notificado sobre as mudanças no valor do seu componente.
    - **Uso:** Você deve armazenar a função `fn` e invocá-la com o novo valor do seu componente sempre que uma mudança relevante ocorrer (por exemplo, no evento `input` de um campo de texto, ou quando um item é selecionado em um dropdown personalizado).
    - **Sintaxe de Uso Básica:**
        
        ```tsx
        onChange: (value: any) => void = () => {}; // Declaração da função de callback
        
        registerOnChange(fn: any): void {
          this.onChange = fn; // Armazena a função de callback fornecida pelo Angular
        }
        
        // Em algum lugar no seu componente, quando o valor interno muda:
        updateInternalValue(newValue: any) {
          this._value = newValue;
          this.onChange(newValue); // Invoca o callback registrado
        }
        
        ```
        
- `registerOnTouched(fn: any): void`
    - **Conceito:** Similar ao `registerOnChange`, este método é chamado pelo Angular para registrar uma função de callback (`fn`) que seu `ControlValueAccessor` deve chamar quando o controle é "tocado" (por exemplo, quando o usuário interage com ele e depois tira o foco, causando um evento `blur`).
    - **Uso:** Seu componente deve armazenar a função `fn` e invocá-la quando o evento `blur` ou um evento equivalente ocorrer no seu controle interno. Isso permite que o `FormControl` do Angular saiba quando o controle foi interagido, atualizando seu estado `touched`.
    - **Sintaxe de Uso Básica:**
        
        ```tsx
        onTouched: () => void = () => {}; // Declaração da função de callback
        
        registerOnTouched(fn: any): void {
          this.onTouched = fn; // Armazena a função de callback fornecida pelo Angular
        }
        
        // Em algum lugar no seu componente, no evento blur:
        handleBlur() {
          this.onTouched(); // Invoca o callback registrado
        }
        
        ```
        
- `setDisabledState?(isDisabled: boolean): void`
    - **Conceito:** Este é um método opcional (indicado pelo `?`). O Angular o chama para notificar seu `ControlValueAccessor` sobre a mudança no estado de desabilitado do `FormControl` associado.
    - **Uso:** Seu componente deve reagir a esse valor `isDisabled` e habilitar ou desabilitar o elemento HTML correspondente no DOM (por exemplo, adicionando ou removendo o atributo `disabled` de um `<input>`).
    - **Sintaxe de Uso Básica:**
        
        ```tsx
        isDisabled: boolean = false; // Propriedade interna para controlar o estado de desabilitado
        
        setDisabledState?(isDisabled: boolean): void {
          this.isDisabled = isDisabled; // Atualiza a propriedade interna
          // Opcionalmente, aplique estilos ou lógicas para desabilitar visualmente o componente
        }
        
        ```
        

---

## Cenários de Restrição ou Não Aplicação

Embora o `ControlValueAccessor` seja extremamente poderoso, ele não é sempre a melhor escolha ou é desnecessário em alguns cenários:

- **Componentes de UI Puros:** Se seu componente é puramente de exibição de dados e não precisa interagir com formulários (ou seja, não precisa que seu valor seja parte do modelo de dados do formulário), então o `ControlValueAccessor` é um exagero. Use `@Input()` e `@Output()` para comunicação simples entre componentes.
- **Elementos Nativos do HTML:** Para elementos de formulário HTML nativos como `<input type="text">`, `<textarea>`, `<select>`, `<checkbox>`, etc., você não precisa implementar um `ControlValueAccessor`. O Angular já possui implementações padrão para eles.
- **Componentes de Terceiros que Já São Controles de Formulário:** Se você está usando uma biblioteca de componentes UI (como Angular Material, PrimeNG, NG-Zorro) e ela já fornece seus próprios componentes de formulário (ex: `<mat-input>`, `<p-calendar>`), eles geralmente já implementam seus próprios `ControlValueAccessor`s internamente. Você simplesmente os usa como usaria um `input` nativo com `formControlName` ou `ngModel`.
- **Múltiplos Valores em Um Único Controle:** Se seu componente customizado representa internamente múltiplos valores que você gostaria de tratar como controles de formulário separados, pode ser mais apropriado criar um `FormGroup` dentro do seu componente e expor esse `FormGroup` via `@Input()` ou usar `ControlContainer` e `NgControl` para injetar os controles filhos diretamente no formulário pai, em vez de implementar um único `ControlValueAccessor` para todo o componente.

---

## Componentes Chave Associados

A implementação do `ControlValueAccessor` não vive isolada. Ela se integra com outros componentes e mecanismos do sistema de formulários do Angular:

- `NG_VALUE_ACCESSOR` (Injection Token)
    - **Conceito:** É um `InjectionToken` especial que atua como um identificador para provedores de `ControlValueAccessor` no sistema de injeção de dependência do Angular.
    - **Uso:** Ao registrar seu componente como um `ControlValueAccessor`, você o associa a este token. Isso permite que o Angular encontre todos os `ControlValueAccessor`s disponíveis para um determinado controle de formulário.
    - **Sintaxe Específica:**
        
        ```tsx
        providers: [
          {
            provide: NG_VALUE_ACCESSOR,        // O token que estamos provendo
            useExisting: forwardRef(() => CustomInputComponent), // A instância da classe que implementa ControlValueAccessor
            multi: true                       // Importante: permite que múltiplos provedores existam para este token
          }
        ]
        
        ```
        
    - **Explicação:** O `forwardRef` é necessário porque `CustomInputComponent` ainda não foi totalmente definido quando o `providers` array é avaliado. O `multi: true` é crucial porque um único `NG_VALUE_ACCESSOR` pode ter múltiplos provedores (por exemplo, um para `DefaultValueAccessor` para inputs nativos e outro para seu componente customizado), e o Angular precisa ser capaz de injetar todos eles para determinar qual usar.
- `NgControl` (Classe Abstrata)
    - **Conceito:** É uma classe abstrata que representa um controle de formulário do Angular (como `FormControlName`, `FormControlDirective`, `NgModel`). Ele fornece uma API para interagir com o controle de formulário subjacente, incluindo acesso ao `ControlValueAccessor` associado.
    - **Uso:** Você raramente injetará `NgControl` diretamente em seus componentes. No entanto, o Angular usa internamente o `NgControl` para encontrar o `ControlValueAccessor` apropriado para o seu elemento de formulário. Ele age como um invólucro para os `FormControl`s.
    - **Componentes Relacionados:**
        - `FormControlDirective` (para `[formControl]`)
        - `FormControlName` (para `formControlName`)
        - `NgModel` (para `[(ngModel)]`)
    - Quando você usa `formControlName="myField"` ou `[(ngModel)]="myValue"` em um elemento ou componente, o Angular injeta uma instância de `NgControl` (especificamente `FormControlName` ou `NgModel`) nesse elemento/componente. Esta instância de `NgControl` então procura um `ControlValueAccessor` associado para gerenciar a comunicação.

---

## Melhores Práticas e Padrões de Uso

1. **Imutabilidade do Valor Interno:** Sempre que possível, trate o valor interno do seu componente de forma imutável ao passá-lo para `onChange`. Isso ajuda a evitar efeitos colaterais indesejados.
2. **Gerenciamento de Estado `disabled`:** Garanta que seu componente reaja corretamente ao método `setDisabledState` e desabilite/habilite os elementos da UI adequadamente.
3. **Gatilhos de `onChange` e `onTouched`:**
    - Chame `onChange()` sempre que o valor do seu componente mudar (por exemplo, no evento `input` para um campo de texto, ou `change` para um checkbox/select).
    - Chame `onTouched()` quando o controle "perde o foco" (evento `blur`). Isso é crucial para que o Angular possa marcar o controle como `touched` e exibir mensagens de validação apropriadas.
4. **Uso de `forwardRef` e `multi: true`:** Sempre use `forwardRef(() => MyComponent)` e `multi: true` ao registrar seu `ControlValueAccessor` para evitar problemas de referência circular e permitir que o Angular gerencie múltiplos provedores.
5. **Simplicidade:** Mantenha a lógica do seu `ControlValueAccessor` o mais simples possível, focando apenas na comunicação do valor. Lógicas de validação e regras de negócio devem residir nos `Validators` do `FormControl` ou em serviços.
6. **Validação:** Embora o `ControlValueAccessor` não se preocupe diretamente com validação, ele permite que seu componente personalizado seja integrado ao sistema de validação do Angular. Você pode injetar `NgControl` em seu componente para acessar o `FormControl` e suas propriedades de validação, mas a validação em si deve ser definida no `FormControl` no componente pai.
7. **Separar Lógica do Template:** Se seu componente for complexo, separe a lógica do `ControlValueAccessor` do template, usando getters/setters e eventos para interagir com os elementos internos.

---

## Exemplo Prático Completo: Um Componente de Slider Personalizado

Vamos criar um `SliderComponent` que se comporta como um controle de formulário e permite ao usuário selecionar um valor dentro de uma faixa.

```tsx
// slider.component.ts
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-slider',
  template: `
    <div class="slider-container">
      <label>{{ label }}: {{ value }}</label>
      <input
        type="range"
        [min]="min"
        [max]="max"
        [step]="step"
        [(ngModel)]="_value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [disabled]="isDisabled"
        class="custom-slider"
      />
    </div>
  `,
  styles: [`
    .slider-container {
      margin-bottom: 15px;
    }
    .custom-slider {
      width: 100%;
      height: 25px;
      -webkit-appearance: none;
      background: #d3d3d3;
      outline: none;
      opacity: 0.7;
      -webkit-transition: .2s;
      transition: opacity .2s;
      border-radius: 5px;
    }
    .custom-slider:hover {
      opacity: 1;
    }
    .custom-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #4CAF50;
      cursor: pointer;
    }
    .custom-slider::-moz-range-thumb {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #4CAF50;
      cursor: pointer;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ]
})
export class SliderComponent implements ControlValueAccessor {
  @Input() label: string = 'Valor';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;

  _value: number = 0;
  isDisabled: boolean = false;

  // Funções de callback que o Angular registrará
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // Getter para expor o valor (_value) para o template
  get value(): number {
    return this._value;
  }

  // --- Implementação dos métodos da interface ControlValueAccessor ---

  // Chamado pelo Angular para escrever um novo valor para o componente
  writeValue(obj: any): void {
    if (typeof obj === 'number') {
      this._value = obj;
    } else {
      this._value = this.min; // Valor padrão se obj não for um número
    }
  }

  // Chamado pelo Angular para registrar a função de callback para mudanças de valor
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Chamado pelo Angular para registrar a função de callback para o estado "tocado"
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Chamado pelo Angular para definir o estado de desabilitado do componente
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // --- Funções internas do componente para lidar com eventos ---

  // Acionado no evento 'input' do slider nativo
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    this._value = newValue; // Atualiza o valor interno
    this.onChange(newValue); // Notifica o Angular sobre a mudança
  }
}

```

Para usar este `SliderComponent` em seu `AppComponent`:

```tsx
// app.component.ts (continuação do exemplo anterior)
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <h2>Exemplo de Uso do CustomInputComponent</h2>
    <form [formGroup]="myForm">
      <app-custom-input
        label="Nome"
        type="text"
        formControlName="nome"
      ></app-custom-input>

      <app-custom-input
        label="Email"
        type="email"
        formControlName="email"
      ></app-custom-input>

      <app-slider
        label="Nível de Satisfação"
        [min]="0"
        [max]="10"
        [step]="1"
        formControlName="satisfaction"
      ></app-slider>

      <button type="submit" [disabled]="myForm.invalid">Enviar</button>
    </form>
    <p>Form Status: {{ myForm.status }}</p>
    <p>Form Value: {{ myForm.value | json }}</p>
    <button (click)="patchValue()">Patch Value</button>
    <button (click)="disableSatisfaction()">Desabilitar Satisfação</button>
  `
})
export class AppComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      satisfaction: [5, [Validators.min(1), Validators.max(10)]] // Valor inicial e validação
    });
  }

  patchValue(): void {
    this.myForm.patchValue({
      nome: 'Gedê',
      email: 'gede@example.com',
      satisfaction: 8
    });
  }

  disableSatisfaction(): void {
    const satisfactionControl = this.myForm.get('satisfaction');
    if (satisfactionControl) {
      if (satisfactionControl.disabled) {
        satisfactionControl.enable();
      } else {
        satisfactionControl.disable();
      }
    }
  }
}

```

E não se esqueça de adicionar o `SliderComponent` às declarações do `AppModule`:

```tsx
// app.module.ts (continuação)
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { SliderComponent } from './slider/slider.component'; // Importar SliderComponent

@NgModule({
  declarations: [
    AppComponent,
    CustomInputComponent,
    SliderComponent // Adicionar SliderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

Neste exemplo, o `SliderComponent` age como um controle de formulário completo, interagindo perfeitamente com os formulários reativos do Angular, aceitando valores iniciais, reportando mudanças e respondendo a estados de desabilitação.

---

Espero que esta explicação detalhada, A.R.I.A., tenha te ajudado a entender profundamente o `ControlValueAccessor` no Angular, Gedê\! É uma ferramenta essencial para construir componentes de formulário reutilizáveis e robustos. Se tiver mais alguma dúvida, pode chamar\!