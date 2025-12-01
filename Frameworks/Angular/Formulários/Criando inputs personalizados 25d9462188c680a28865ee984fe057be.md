# Criando inputs personalizados

Olá Gedê\! Como A.R.I.A (Assistente Rápida para Idiotas Atarefados), preparei um guia completo e extremamente detalhado sobre a criação de inputs personalizados com `ControlValueAccessor` em formulários reativos do Angular, exatamente como você pediu. Vamos mergulhar fundo neste tópico essencial para o desenvolvimento de aplicações Angular robustas e flexíveis.

---

### **Título: Dominando o ControlValueAccessor: A Ponte Entre Componentes Personalizados e Formulários Reativos no Angular**

### **Introdução**

No ecossistema do Angular, a criação de formulários é uma tarefa central. Os Formulários Reativos (Reactive Forms) nos oferecem um modelo poderoso e escalável para gerenciar o estado de um formulário ao longo do tempo. No entanto, frequentemente nos deparamos com a necessidade de criar componentes de formulário que vão além dos inputs HTML padrão (`<input>`, `<select>`, `<textarea>`). Pode ser um seletor de data customizado, um campo de máscara monetária, um componente de avaliação por estrelas ou qualquer outro elemento de UI que precise se comportar como um campo de formulário nativo. É exatamente aqui que a interface `ControlValueAccessor` entra em cena, atuando como uma ponte crucial que permite que nossos componentes personalizados se comuniquem de forma bidirecional com a API de formulários do Angular.

### **Sumário**

- **Conceitos Fundamentais:** Entendendo o que é o `ControlValueAccessor` (CVA) e por que ele é indispensável para integrar componentes customizados aos `FormControl`s do Angular.
- **A Interface em Detalhes:** Uma análise profunda dos quatro métodos que compõem a interface: `writeValue`, `registerOnChange`, `registerOnTouched` e `setDisabledState`.
- **Sintaxe e Implementação:** Como implementar a interface em um componente e registrá-lo como um provedor `NG_VALUE_ACCESSOR`.
- **Elementos Associados:** O papel fundamental do `NG_VALUE_ACCESSOR`, `forwardRef`, `HostListener` e outras peças-chave no quebra-cabeça.
- **Restrições de Uso:** Quando a complexidade do CVA pode não ser a melhor solução e alternativas a serem consideradas.
- **Melhores Práticas e Casos de Uso:** Aplicações práticas e dicas para criar componentes de formulário reutilizáveis, eficientes e acessíveis.
- **Exemplo Completo:** Um guia passo a passo para criar um componente de input numérico com botões de incremento e decremento, totalmente integrado a um formulário reativo.
- **Tópicos para Aprofundamento:** Sugestões para expandir seu conhecimento sobre formulários avançados no Angular.

### **Conceitos Fundamentais**

### O que é o ControlValueAccessor?

O `ControlValueAccessor` é uma interface do Angular que cria um contrato entre um componente de UI personalizado e a API de formulários do Angular (tanto reativos quanto template-driven). Pense nele como um tradutor ou um adaptador.

De um lado, temos o "mundo do Angular Forms", onde um `FormControl` gerencia um valor, seu estado de validação (`valid`, `invalid`), seu estado de interação (`touched`, `untouched`, `dirty`, `pristine`) e desabilitação.

Do outro lado, temos o "mundo do seu componente", com sua própria lógica interna, seu template HTML e os eventos do DOM (como `input`, `click`, `blur`).

A interface `ControlValueAccessor` define um conjunto de métodos que permite que essas duas partes conversem. Ela diz ao Angular como:

1. **Escrever um valor** do `FormControl` para dentro do seu componente (ex: quando o formulário é inicializado com dados).
2. **Informar o `FormControl`** sempre que o valor dentro do seu componente mudar (ex: quando o usuário digita algo).
3. **Informar o `FormControl`** que o componente foi "tocado" (ex: quando o usuário clica e depois sai do campo, acionando validações on-blur).
4. **Atualizar o estado visual** do seu componente quando o `FormControl` for desabilitado programaticamente.

Sem o `ControlValueAccessor`, o `FormControl` não teria ideia de como interagir com a lógica interna do seu componente personalizado.

### **Sintaxe e Uso: Implementando a Interface**

Para que um componente possa atuar como um `ControlValueAccessor`, ele precisa seguir dois passos cruciais:

1. **Implementar a interface `ControlValueAccessor`:** Isso obriga o componente a ter os quatro métodos necessários.
2. **Registrar um provedor `NG_VALUE_ACCESSOR`:** Isso informa à Injeção de Dependência do Angular que este componente específico pode ser usado como um `ControlValueAccessor`.

Veja a estrutura básica de um componente que implementa a interface:

```tsx
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: ``,
  styleUrls: ['./custom-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {

  // Métodos da interface serão implementados aqui
  writeValue(obj: any): void {
    // Lógica para receber valor do FormControl
  }

  registerOnChange(fn: any): void {
    // Lógica para registrar a função de callback para mudanças de valor
  }

  registerOnTouched(fn: any): void {
    // Lógica para registrar a função de callback para o evento "touched"
  }

  setDisabledState?(isDisabled: boolean): void {
    // Lógica para lidar com o estado de desabilitação
  }
}

```

Vamos quebrar o `providers`:

- `provide: NG_VALUE_ACCESSOR`: É um *token de injeção* opaco que o Angular usa para encontrar todos os `ControlValueAccessor`s.
- `useExisting: forwardRef(() => CustomInputComponent)`: Isso é o mais complexo.
    - `useExisting` diz ao injetor para usar uma instância já existente de um token.
    - `forwardRef` é necessário porque, no momento em que estamos definindo o provedor, a classe `CustomInputComponent` ainda não foi totalmente definida (ela se refere a si mesma). `forwardRef` quebra essa referência circular, permitindo que a referência seja resolvida posteriormente.
- `multi: true`: Indica que podemos ter múltiplos provedores para o mesmo token `NG_VALUE_ACCESSOR`. Isso é crucial, pois permite que o Angular colete todos os CVAs registrados na aplicação.

### **Métodos/Propriedades: A Interface em Detalhes**

Aqui está o coração do `ControlValueAccessor`. Vamos dissecar cada método.

| Método | Propósito | Parâmetros | Detalhes de Implementação |
| --- | --- | --- | --- |
| `writeValue(obj: any): void` | **Receber Valor:** O Angular chama este método para passar o valor do `FormControl` para o seu componente. Isso acontece quando o `FormControl` é inicializado (`new FormControl('valor')`) ou quando seu valor é alterado programaticamente (`formControl.setValue('novoValor')`). | `obj: any`: O novo valor vindo do modelo (do `FormControl`). | Dentro deste método, você deve atualizar o estado interno do seu componente e, consequentemente, a sua view. Por exemplo, definir o valor de uma propriedade interna que está ligada ao `<input>` do seu template. |
| `registerOnChange(fn: any): void` | **Registrar Callback de Mudança:** O Angular passa uma função de callback para este método. Seu componente deve chamar essa função sempre que o valor interno mudar devido à interação do usuário. | `fn: any`: A função que você deve armazenar e chamar para notificar o Angular sobre uma mudança de valor. | Armazene esta função em uma propriedade privada (ex: `onChange: (value: any) => void`). Quando o usuário interagir com seu componente (ex: no evento `(input)` de um elemento), chame `this.onChange(novoValor)` para propagar a mudança de volta para o `FormControl`. |
| `registerOnTouched(fn: any): void` | **Registrar Callback de "Toque":** Similar ao `registerOnChange`, o Angular passa uma função de callback para ser chamada quando o componente deve ser marcado como "tocado" (`touched`). | `fn: any`: A função que você deve armazenar e chamar para marcar o controle como `touched`. | Armazene esta função em uma propriedade privada (ex: `onTouched: () => void`). Tipicamente, você chamará `this.onTouched()` no evento `(blur)` do seu elemento principal de formulário. Isso é fundamental para que validações que dependem do estado `touched` funcionem corretamente. |
| `setDisabledState?(isDisabled: boolean): void` | **Gerenciar Estado de Desabilitação:** Este método (opcional) é chamado pelo Angular quando o estado de desabilitação do `FormControl` muda (`formControl.disable()` ou `formControl.enable()`). | `isDisabled: boolean`: Um booleano indicando se o controle está sendo desabilitado (`true`) ou habilitado (`false`). | Dentro deste método, você deve atualizar a UI do seu componente para refletir o estado de desabilitação. Isso pode significar adicionar o atributo `[disabled]` a um input nativo ou aplicar classes CSS para um estilo visual de "desabilitado". |

### **Restrições de Uso**

Embora extremamente poderoso, o `ControlValueAccessor` pode ser excessivo em alguns cenários:

1. **Componentes de Apresentação Simples:** Se um componente apenas exibe dados e não precisa interagir com a API de formulários do Angular (ou seja, não precisa de validação, status `dirty`/`pristine`, etc.), usar `@Input()` e `@Output()` é uma abordagem muito mais simples e direta.
2. **Lógica de Formulário Complexa e Aninhada:** Para formulários muito complexos com múltiplos níveis de aninhamento, gerenciar o fluxo de dados através de CVAs pode se tornar verboso. Em alguns casos, pode ser mais claro usar um serviço compartilhado para gerenciar o estado ou explorar outras bibliotecas de gerenciamento de estado.
3. **Curva de Aprendizagem:** Para desenvolvedores novos no Angular, o conceito de `providers`, `forwardRef` e o fluxo de dados do CVA pode apresentar uma curva de aprendizagem íngreme. Se um componente de uma biblioteca de UI de terceiros já resolve o problema, pode ser mais produtivo usá-lo.

A regra geral é: **use `ControlValueAccessor` quando você precisa que um componente personalizado se comporte como um elemento de formulário nativo dentro de um `FormGroup` ou `FormControl`**.

### **Elementos Associados**

Para que o `ControlValueAccessor` funcione, ele depende de um ecossistema de outras funcionalidades do Angular.

| Elemento | Propósito | Sintaxe de Uso |
| --- | --- | --- |
| **`NG_VALUE_ACCESSOR`** | Token de Injeção de Dependência. | `{ provide: NG_VALUE_ACCESSOR, ... }` |
| **`forwardRef()`** | Função Utilitária. | `useExisting: forwardRef(() => MyComponent)` |
| **`FormControl` / `FormGroup`** | Classes do Reactive Forms. | `new FormControl('')` |
| **`formControlName` / `[formControl]`** | Diretivas. | `<app-custom-input formControlName="meuCampo"></app-custom-input>` |
| **`@HostListener`** | Decorator. | `@HostListener('blur') onBlur() { this.onTouched(); }` |

### **Melhores Práticas e Casos de Uso**

### Casos de Uso Comuns:

1. **Inputs com Máscara:** Criar um componente `<masked-input>` para CPF, CNPJ, telefone, ou valores monetários. O CVA gerencia o valor "cru" (ex: `12345678900`) enquanto a view exibe o valor formatado (`123.456.789-00`).
2. **Seletores de Data/Hora Customizados:** Construir um calendário ou seletor de horário com uma UI específica, que se integra perfeitamente com os formulários do Angular.
3. **Componentes de UI Complexos:** Um componente de "avaliação por estrelas", um seletor de cores, um editor de rich-text, ou um slider de intervalo.
4. **Encapsulamento de Bibliotecas de Terceiros:** Envolver uma biblioteca JavaScript de terceiros (como um seletor de tags ou um editor de código) em um componente Angular, usando o CVA para torná-la compatível com os formulários do Angular.

### Melhores Práticas:

- **Mantenha a Lógica de UI Separada:** A classe do seu componente deve focar em implementar a lógica do CVA e gerenciar o estado. O template deve ser responsável pela apresentação.
- **Propague o Estado de Desabilitação:** Sempre implemente o método `setDisabledState` para garantir uma experiência de usuário consistente quando o controle for desabilitado programaticamente.
- **Acessibilidade (A11y):** Garanta que seu componente personalizado seja acessível. Se você estiver envolvendo um input nativo, associe `labels`, use atributos ARIA apropriados e certifique-se de que ele seja navegável pelo teclado.
- **Validação:** Seu componente CVA não deve conter lógica de validação. A validação é responsabilidade do `FormControl`. O componente apenas fornece o valor; o formulário decide se ele é válido ou não.
- **Reutilização:** Crie componentes genéricos e configuráveis através de `@Input()`s. Por exemplo, um componente de input numérico pode aceitar inputs para `min`, `max` e `step`.

### **Exemplos Completos: Criando um Input Numérico (`quantity-input`)**

Vamos criar um componente que renderiza um campo de número com botões de "+" e "-".

**1. Gerar o Componente**

```bash
ng generate component quantity-input

```

**2. O Código do Componente (`quantity-input.component.ts`)**

```tsx
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantityInputComponent),
      multi: true,
    },
  ],
})
export class QuantityInputComponent implements ControlValueAccessor {
  // Inputs para tornar o componente configurável
  @Input() step: number = 1;
  @Input() min: number = 0;
  @Input() max: number = 100;

  // Propriedade interna para armazenar o valor
  value: number = 0;

  // Propriedade para controlar o estado de desabilitação
  isDisabled: boolean = false;

  // Funções de callback que serão fornecidas pelo Angular
  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  // 1. Método writeValue: Angular escreve no nosso componente
  writeValue(value: number): void {
    // Garante que o valor inicial esteja dentro dos limites min/max
    this.value = Math.max(this.min, Math.min(value || this.min, this.max));
  }

  // 2. Método registerOnChange: Angular nos dá uma função para chamarmos quando o valor mudar
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3. Método registerOnTouched: Angular nos dá uma função para chamarmos quando o componente for "tocado"
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // 4. Método setDisabledState: Angular nos informa sobre o estado de desabilitação
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Métodos internos do nosso componente para manipular o valor
  increment() {
    if (this.value < this.max) {
      this.updateValue(this.value + this.step);
    }
  }

  decrement() {
    if (this.value > this.min) {
      this.updateValue(this.value - this.step);
    }
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let newValue = parseInt(inputElement.value, 10);

    if (isNaN(newValue)) {
      newValue = this.min;
    }

    // Garante que o valor digitado esteja dentro dos limites
    const clampedValue = Math.max(this.min, Math.min(newValue, this.max));
    this.updateValue(clampedValue);
  }

  // Método central para atualizar e propagar o valor
  private updateValue(newValue: number) {
    if (this.value !== newValue) {
      this.value = newValue;
      this.onChange(this.value); // Notifica o Angular sobre a mudança
      this.onTouched(); // Marca o controle como "tocado" em qualquer mudança
    }
  }
}

```

**3. O Template do Componente (`quantity-input.component.html`)**

```html
<div class="quantity-container">
  <button
    type="button"
    [disabled]="isDisabled || value <= min"
    (click)="decrement()">
    -
  </button>
  <input
    type="number"
    [value]="value"
    [min]="min"
    [max]="max"
    [disabled]="isDisabled"
    (change)="onInputChange($event)"
    (blur)="onTouched()"
  />
  <button
    type="button"
    [disabled]="isDisabled || value >= max"
    (click)="increment()">
    +
  </button>
</div>

```

**4. O CSS do Componente (`quantity-input.component.css`)**

```css
.quantity-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

input[type='number'] {
  border: none;
  text-align: center;
  width: 60px;
  font-size: 1rem;
  -moz-appearance: textfield; /* Firefox */
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

button {
  border: none;
  background-color: #f0f0f0;
  color: #333;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

button:disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

```

**5. Usando o Componente em um Formulário Reativo (`app.component.ts`)**

```tsx
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      productName: ['Maçã', Validators.required],
      quantity: [5, [Validators.required, Validators.min(1), Validators.max(20)]],
    });
  }

  onSubmit() {
    console.log('Form Submitted:', this.productForm.value);
  }

  disableQuantity() {
    this.productForm.get('quantity').disabled
      ? this.productForm.get('quantity').enable()
      : this.productForm.get('quantity').disable();
  }
}

```

**6. O Template do Formulário (`app.component.html`)**

```html
<form [formGroup]="productForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="productName">Nome do Produto:</label>
    <input id="productName" type="text" formControlName="productName" />
  </div>

  <div style="margin-top: 20px;">
    <label for="quantity">Quantidade:</label>
    <app-quantity-input
      id="quantity"
      formControlName="quantity"
      [step]="1"
      [min]="0"
      [max]="20"
    ></app-quantity-input>

    <div *ngIf="productForm.get('quantity')?.invalid && productForm.get('quantity')?.touched">
        <small style="color: red;">
            A quantidade deve estar entre 1 e 20.
        </small>
    </div>
  </div>

  <button type="submit" [disabled]="productForm.invalid">Enviar</button>
  <button type="button" (click)="disableQuantity()">Habilitar/Desabilitar Quantidade</button>
</form>

<pre>{{ productForm.value | json }}</pre>
<pre>Estado de Validade da Quantidade: {{ productForm.get('quantity')?.status | json }}</pre>

```

Com isso, você tem um componente `quantity-input` totalmente funcional e reutilizável que se integra perfeitamente ao sistema de formulários reativos do Angular, suportando validação, estado de "tocado" e desabilitação.

### **Tópicos para Aprofundamento**

1. **Validadores Personalizados (Custom Validators):** Aprenda a criar suas próprias funções de validação para lógicas complexas que podem ser aplicadas a qualquer `FormControl`, incluindo seus componentes CVA.
2. **`ControlContainer`:** Entenda como criar componentes que podem encapsular um `FormGroup` ou `FormArray` inteiro, permitindo a criação de seções de formulário complexas e reutilizáveis.
3. **Formulários Dinâmicos:** Explore como construir formulários cuja estrutura não é conhecida em tempo de compilação, baseando-se em uma configuração JSON, por exemplo.
4. **Acessibilidade (A11y) em Formulários:** Aprofunde-se nas práticas recomendadas e nos atributos ARIA (`aria-labelledby`, `aria-describedby`, etc.) para garantir que seus componentes de formulário personalizados sejam utilizáveis por todos.

Espero que esta explicação super detalhada seja extremamente útil para você, Gedê\! É um conceito fundamental que, uma vez dominado, abre um leque de possibilidades para criar UIs ricas e interativas no Angular. Se tiver qualquer outra dúvida, estou à disposição\!