# Event Handlers com Tipos no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Event handlers tipados** (manipuladores de eventos tipados) são funções que respondem a eventos do DOM com **type annotations específicas** para o tipo de evento e elemento alvo. Conceitualmente, representam **contratos de manipulação de eventos** que garantem acesso type-safe a propriedades do evento e do elemento, eliminando erros comuns de manipulação de DOM.

Na essência, event handlers tipados materializam o princípio de **type safety em interação com DOM**, onde TypeScript conhece exatamente quais propriedades e métodos estão disponíveis em cada tipo de evento (click, keypress, submit, etc.) e elemento (button, input, form, etc.).

### Problema Fundamental que Resolve

Event handlers tipados resolvem o problema de **acesso não type-safe a eventos DOM**:

```typescript
// ❌ JavaScript - sem type safety
document.querySelector("button").addEventListener("click", function(event) {
  console.log(event.target.value); // Erro de runtime - button não tem value
  event.preventDefault(); // OK, mas TypeScript não verifica
});

// ✅ TypeScript - type safe
const botao = document.querySelector("button")!;

botao.addEventListener("click", (event: MouseEvent) => {
  // event.target.value; // Erro de compilação - target é genérico
  const alvo = event.currentTarget as HTMLButtonElement;
  console.log(alvo.textContent); // Type-safe
  event.preventDefault(); // OK e verificado
});
```

## 📋 Fundamentos

### Tipos de Eventos DOM

TypeScript fornece tipos específicos para cada evento:

```typescript
// MouseEvent - eventos de mouse
const handleClick = (event: MouseEvent): void => {
  console.log(event.clientX, event.clientY);
  console.log(event.button); // 0 = esquerdo, 1 = meio, 2 = direito
};

// KeyboardEvent - eventos de teclado
const handleKeyPress = (event: KeyboardEvent): void => {
  console.log(event.key);
  console.log(event.code);
  console.log(event.ctrlKey, event.shiftKey);
};

// FocusEvent - eventos de foco
const handleFocus = (event: FocusEvent): void => {
  console.log(event.relatedTarget);
};

// InputEvent - eventos de input
const handleInput = (event: InputEvent): void => {
  console.log(event.data);
  console.log(event.inputType);
};

// SubmitEvent - eventos de submit
const handleSubmit = (event: SubmitEvent): void => {
  event.preventDefault();
  console.log(event.submitter);
};
```

### Generic Event Listener

```typescript
// HTMLElement com tipo genérico de evento
const botao = document.querySelector<HTMLButtonElement>("button")!;

// addEventListener é genérico
botao.addEventListener<"click">("click", (event: MouseEvent) => {
  console.log(event.clientX);
});
```

## 🔍 Análise Conceitual Profunda

### 1. Event Target vs. CurrentTarget

```typescript
const container = document.querySelector<HTMLDivElement>("#container")!;

container.addEventListener("click", (event: MouseEvent) => {
  // target - elemento que disparou o evento (pode ser filho)
  const target = event.target as HTMLElement;
  console.log(target.tagName);

  // currentTarget - elemento com o listener (sempre o container)
  const currentTarget = event.currentTarget as HTMLDivElement;
  console.log(currentTarget.id); // "container"
});
```

**Conceito:** `target` é genérico (`EventTarget`), `currentTarget` pode ser tipado com o elemento específico.

### 2. Type Assertions para Elementos Específicos

```typescript
const formulario = document.querySelector<HTMLFormElement>("form")!;

formulario.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  // Type assertion para acessar propriedades específicas
  const alvo = event.target as HTMLFormElement;
  const formData = new FormData(alvo);

  // Acessar inputs específicos
  const inputNome = alvo.querySelector<HTMLInputElement>("#nome")!;
  console.log(inputNome.value);
});
```

### 3. Event Handlers em React

```typescript
// React synthetic events
import React from "react";

const Componente: React.FC = () => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log(event.currentTarget.textContent);
    event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
  };

  return (
    <div>
      <button onClick={handleClick}>Clique</button>
      <input onChange={handleChange} />
      <form onSubmit={handleSubmit}>...</form>
    </div>
  );
};
```

### 4. Custom Event Types

```typescript
// Evento customizado
interface CustomEventDetail {
  mensagem: string;
  timestamp: number;
}

// Disparar evento customizado
const dispararCustom = () => {
  const evento = new CustomEvent<CustomEventDetail>("meuEvento", {
    detail: {
      mensagem: "Olá!",
      timestamp: Date.now()
    }
  });

  document.dispatchEvent(evento);
};

// Listener para evento customizado
document.addEventListener("meuEvento", (event: Event) => {
  const customEvent = event as CustomEvent<CustomEventDetail>;
  console.log(customEvent.detail.mensagem);
  console.log(customEvent.detail.timestamp);
});
```

### 5. Event Delegation com Tipos

```typescript
const lista = document.querySelector<HTMLUListElement>("#lista")!;

lista.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  // Type guard para verificar tipo de elemento
  if (target.tagName === "LI") {
    const item = target as HTMLLIElement;
    console.log(item.textContent);
  }

  // Ou usar matches
  if (target.matches("button.delete")) {
    const botao = target as HTMLButtonElement;
    botao.parentElement?.remove();
  }
});
```

### 6. Event Handler com Arrow Function em Classes

```typescript
class ComponenteDOM {
  private elemento: HTMLButtonElement;
  private cliques = 0;

  constructor(seletor: string) {
    this.elemento = document.querySelector<HTMLButtonElement>(seletor)!;
    this.configurarEventos();
  }

  // Arrow function preserva this
  private handleClick = (event: MouseEvent): void => {
    this.cliques++;
    console.log(`Cliques: ${this.cliques}`);
    console.log(`Posição: ${event.clientX}, ${event.clientY}`);
  };

  private configurarEventos(): void {
    // Arrow function pode ser passada diretamente
    this.elemento.addEventListener("click", this.handleClick);
  }

  destruir(): void {
    // Remove event listener
    this.elemento.removeEventListener("click", this.handleClick);
  }
}
```

### 7. Multiple Event Types

```typescript
// Handler que aceita múltiplos tipos de evento
type EventosMouse = MouseEvent | TouchEvent;

const handleInteracao = (event: EventosMouse): void => {
  if (event instanceof MouseEvent) {
    console.log(`Mouse: ${event.clientX}, ${event.clientY}`);
  } else if (event instanceof TouchEvent) {
    const touch = event.touches[0];
    console.log(`Touch: ${touch.clientX}, ${touch.clientY}`);
  }
};

const elemento = document.querySelector<HTMLDivElement>("#area")!;
elemento.addEventListener("mousedown", handleInteracao);
elemento.addEventListener("touchstart", handleInteracao);
```

## 🎯 Aplicabilidade e Contextos

### 1. Form Handling

```typescript
const form = document.querySelector<HTMLFormElement>("#formulario")!;

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget as HTMLFormElement);

  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;

  console.log({ nome, email });
});

// Input change
const input = document.querySelector<HTMLInputElement>("#email")!;

input.addEventListener("input", (event: Event) => {
  const target = event.target as HTMLInputElement;
  console.log(target.value);
});
```

### 2. Keyboard Navigation

```typescript
document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    fecharModal();
  }

  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();
    salvar();
  }

  // Arrow keys
  switch (event.key) {
    case "ArrowUp":
      moverParaCima();
      break;
    case "ArrowDown":
      moverParaBaixo();
      break;
  }
});
```

### 3. Drag and Drop

```typescript
const draggable = document.querySelector<HTMLDivElement>(".draggable")!;
const dropzone = document.querySelector<HTMLDivElement>(".dropzone")!;

draggable.addEventListener("dragstart", (event: DragEvent) => {
  event.dataTransfer?.setData("text/plain", "dados");
});

dropzone.addEventListener("dragover", (event: DragEvent) => {
  event.preventDefault();
});

dropzone.addEventListener("drop", (event: DragEvent) => {
  event.preventDefault();
  const dados = event.dataTransfer?.getData("text/plain");
  console.log(dados);
});
```

### 4. Scroll Handling

```typescript
window.addEventListener("scroll", (event: Event) => {
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  console.log(`Scroll: ${scrollX}, ${scrollY}`);
});

// Scroll em elemento específico
const container = document.querySelector<HTMLDivElement>("#container")!;

container.addEventListener("scroll", (event: Event) => {
  const target = event.target as HTMLDivElement;
  console.log(target.scrollTop);
});
```

## ⚠️ Limitações e Considerações

### 1. EventTarget é Genérico

```typescript
// target é EventTarget (muito genérico)
element.addEventListener("click", (event: MouseEvent) => {
  // event.target.value; // Erro - EventTarget não tem value
  const target = event.target as HTMLInputElement; // Precisa cast
  console.log(target.value);
});
```

### 2. Null Checks Necessários

```typescript
const botao = document.querySelector<HTMLButtonElement>("#botao");

// Pode ser null - precisa verificar
if (botao) {
  botao.addEventListener("click", (event: MouseEvent) => {
    console.log("Clicado!");
  });
}

// Ou non-null assertion (se tiver certeza)
const botaoGarantido = document.querySelector<HTMLButtonElement>("#botao")!;
```

### 3. Memory Leaks com Event Listeners

```typescript
class Componente {
  private handleClick = (event: MouseEvent) => {
    console.log("Clicado");
  };

  montar(elemento: HTMLElement) {
    elemento.addEventListener("click", this.handleClick);
  }

  // IMPORTANTE: remover listener ao destruir
  desmontar(elemento: HTMLElement) {
    elemento.removeEventListener("click", this.handleClick);
  }
}
```

## 🔗 Interconexões Conceituais

Event handlers tipados conectam-se com:

- **Arrow Functions:** Sintaxe concisa e lexical `this`
- **DOM Types:** HTMLElement, MouseEvent, etc.
- **Type Assertions:** Converter EventTarget para tipo específico
- **Event Delegation:** Manipular eventos em parent
- **React Events:** Synthetic events do React

## 🚀 Evolução e Próximos Conceitos

Dominar event handlers tipados prepara para:

1. **Custom Events:** Criar e disparar eventos customizados
2. **Event Delegation Patterns:** Padrões avançados
3. **React Event System:** Eventos sintéticos do React
4. **Observable Patterns:** RxJS e reactive programming
5. **Framework Integration:** Vue, Angular event handling

## 📚 Conclusão

Event handlers tipados garantem type safety em manipulação de eventos DOM, especificando tipos corretos para eventos e elementos. São essenciais para:

- Acesso type-safe a propriedades de eventos
- Prevenção de erros em runtime
- Autocomplete em IDEs
- Código mais maintentável e seguro

Compreender event handlers tipados é dominar a interação type-safe com DOM no TypeScript, onde cada evento e elemento tem tipos específicos que previnem erros comuns e tornam código mais robusto.
