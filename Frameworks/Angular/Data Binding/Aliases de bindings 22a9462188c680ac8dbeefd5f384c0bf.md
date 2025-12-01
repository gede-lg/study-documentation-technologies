# Aliases de bindings

Segue uma explicação dos “aliases” de binding de template em Angular:

---

## 1. Property Binding com `bind-`

No Angular, toda propriedade DOM pode ser atualizada a partir do componente via *property binding*. Em vez da sintaxe abreviada:

```html
<!-- Abreviado -->
<input [disabled]="isDisabled">

```

você pode usar a forma longa:

```html
<!-- Equivalente via alias -->
<input bind-disabled="isDisabled">

```

- **bind-** é um prefixo que indica “estou ligando a propriedade do elemento HTML a esta expressão do componente”.
- Tudo que vai depois do hífen (`disabled` no exemplo) é o nome da propriedade DOM a ser atualizada.
- O valor entre aspas é qualquer expressão do seu componente (variável, chamada de método, etc.), avaliada e aplicada ao elemento quando muda.

---

## 2. Event Binding com `on-`

Para capturar eventos nativos do DOM (click, keyup, mouseover etc.), o Angular usa *event binding*. A forma abreviada é:

```html
<button (click)="onClick()">Clique</button>

```

Mas também existe a forma longa:

```html
<button on-click="onClick()">Clique</button>

```

- **on-** indica que estamos “ouvindo” um evento do elemento.
- A parte após o hífen (`click`) é o nome do evento DOM.
- A expressão entre aspas pode chamar métodos do componente, passar parâmetros e usar `$event` para obter o objeto do evento.

---

## 3. Two-Way Binding com `bindon-`

Quando você precisar de “two-way binding” (por exemplo, em formulários com `ngModel`), o Angular oferece o atalho `[(…)]`. Equivalente em alias longo:

```html
<!-- Abreviado: banana-in-a-box -->
<input [(ngModel)]="nome">

<!-- Forma longa -->
<input bindon-ngModel="nome">

```

- **bindon-** combina `bind-` e `on-` num único prefixo:
    1. **bind** — traz o valor de `nome` para o `value` do `<input>`.
    2. **on** — ouve o evento `ngModelChange` para atualizar `nome` sempre que o usuário digitar.
- Internamente, `[(ngModel)]` vira em tempo de compilação algo como:
    
    ```html
    <input [ngModel]="nome" (ngModelChange)="nome = $event">
    
    ```
    

---

### Resumo de correspondências

| Abreviado | Longo alias | Expande para |
| --- | --- | --- |
| `[prop]` | `bind-prop` | *property binding* |
| `(event)` | `on-event` | *event binding* |
| `[(prop)]` | `bindon-prop` | *two-way binding* (bind + on + change) |

---

### Quando usar qual forma

- **Forma abreviada** (`[ ]`, `( )`, `[( )]`)
    
    → Mais comum, sucinta e recomendada na maioria dos projetos.
    
- **Forma longa** (`bind-`, `on-`, `bindon-`)
    
    → Útil para ferramentas de template que não reconhecem colchetes/parênteses ou para quem prefere marcar explicitamente o tipo de binding.
    

---

Com isso, você tem à disposição tanto a forma curta quanto a “verbose” para trabalhar com bindings em Angular, garantindo flexibilidade conforme seu estilo ou necessidades de ferramenta.