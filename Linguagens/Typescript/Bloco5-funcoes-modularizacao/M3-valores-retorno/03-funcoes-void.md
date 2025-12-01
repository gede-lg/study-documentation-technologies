# Funções que Não Retornam: void

## 🎯 Introdução e Definição

### Definição Conceitual

O tipo **`void`** em TypeScript representa a **ausência intencional de um valor de retorno** em uma função. É um tipo especial que indica que a função realiza alguma ação ou efeito colateral (side effect), mas não produz nenhum valor significativo que deva ser usado pelo código chamador.

Conceitualmente, `void` não significa "nada existe", mas sim "nada de valor é retornado". A função executa, possivelmente modifica estado externo, mas o resultado da execução não é um valor utilizável - é efetivamente descartado ou ignorado.

### Contexto Histórico e Motivação

O tipo `void` tem raízes profundas em linguagens de programação:

**C (1972):** Introduziu `void` como tipo de retorno para funções que não retornam valor, diferenciando-as de funções que retornam inteiros (padrão na época).

**Java e C#:** Herdaram e expandiram o conceito, tornando `void` parte fundamental da assinatura de métodos.

**TypeScript:** Adotou `void` mantendo compatibilidade conceitual com essas linguagens, facilitando migração de desenvolvedores e representação de padrões comuns.

A motivação é **clareza semântica**: distinguir funções chamadas por seus efeitos (logging, atualização de UI, I/O) de funções chamadas por seus valores retornados (cálculos, transformações).

### Problema Fundamental que Resolve

`void` resolve problemas críticos de expressividade e segurança:

**1. Documentação de Intenção:** Deixa explícito que a função não deve ser usada em expressões que esperam valor.

**2. Prevenção de Uso Incorreto:** TypeScript impede atribuir resultado de função `void` a variáveis tipadas, evitando bugs.

**3. Distinção de Propósito:** Separa funções com efeitos colaterais de funções puras que produzem valores.

**4. Callback Type Safety:** Permite especificar callbacks que não devem retornar valores significativos (ex: event handlers).

**5. Compatibilidade com JavaScript:** Mapeia naturalmente para funções JavaScript que não têm `return` ou retornam `undefined`.

### Importância no Ecossistema

`void` é fundamental em TypeScript porque:

- **Modelagem de Side Effects:** Expressa ações imperativas que modificam estado
- **Event Handling:** Maioria dos event handlers não retorna valores
- **Programação Assíncrona:** Funções async podem ter `Promise<void>` quando não produzem valor
- **APIs Fluentes:** Métodos de configuração geralmente retornam `void`

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Ausência vs. Indefinição:** `void` é ausência intencional, diferente de `undefined` (ausência acidental)
2. **Unit Type:** `void` é conceptualmente um "unit type" - tipo com único valor implícito
3. **Subtyping:** `undefined` é subtipo de `void`, mas não vice-versa
4. **Efeitos Colaterais:** Funções `void` existem para seus side effects, não valores

### Pilares Fundamentais

- **Tipo de Não-Valor:** Indica explicitamente que nenhum valor útil é produzido
- **Semântica de Ação:** Função é chamada pela ação que executa
- **Descarte de Resultado:** Resultado pode ser ignorado sem perda de informação
- **Callback Pattern:** Comum em callbacks que não precisam retornar dados

### Visão Geral das Nuances

- **void vs. undefined:** Sutis diferenças semânticas e de uso
- **Return Statements Opcionais:** Funções `void` podem omitir `return` ou retornar sem valor
- **Permissividade:** TypeScript permite `return undefined` em função `void`

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando uma função é declarada com retorno `void`:

**1. Type Checking:** TypeScript verifica que a função não retorna valores significativos. `return` sem valor ou `return undefined` são permitidos.

**2. Usage Checking:** Ao chamar a função, TypeScript trata o resultado como não-utilizável em contextos que esperam valores.

**3. Runtime Behavior:** Em JavaScript gerado, funções `void` são funções normais. `void` é puramente compile-time.

**4. Coerção:** Em contextos onde valor é esperado, tentar usar resultado de função `void` causa erro de compilação.

### Princípios e Conceitos Subjacentes

#### Unit Type Theory

Na teoria de tipos, `void` é um **unit type** - tipo com exatamente um valor (implicitamente `undefined`). Diferente de tipos com múltiplos valores (`number`, `string`), unit types carregam zero informação.

**Analogia:** Se `boolean` tem dois valores possíveis (true/false), `void` tem um valor possível (nenhum valor significativo).

#### Efeitos Colaterais em Programação Funcional

Programação funcional pura evita side effects, mas programas reais precisam deles (I/O, state mutation). `void` marca explicitamente funções impuras:

```typescript
// Pura - retorna valor
function somar(a: number, b: number): number {
  return a + b;
}

// Impura - side effect (console.log)
function logar(mensagem: string): void {
  console.log(mensagem);
}
```

#### Subtyping e Assignability

TypeScript permite `undefined` onde `void` é esperado, mas não o contrário:

```typescript
const f1: () => void = () => undefined; // OK
const f2: () => undefined = () => { }; // Erro: void não é assignable a undefined
```

**Razão:** `void` é menos específico (significa "não me importo com o valor"). `undefined` é mais específico (deve ser exatamente undefined).

### Modelo Mental para Compreensão

Pense em funções `void` como **comandos imperativos**:

- **Funções com Retorno:** Perguntas que você faz ("quanto é 2+2?") - espera resposta
- **Funções void:** Ordens que você dá ("acenda a luz") - espera ação, não resposta

Você não "usa" o resultado de um comando; você observa seus efeitos no mundo.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```typescript
// Declaração explícita de void
function imprimir(texto: string): void {
  console.log(texto);
  // Sem return, ou return sem valor
}

// Arrow function com void
const alertar = (mensagem: string): void => {
  alert(mensagem);
};

// Método com void
class Logger {
  registrar(evento: string): void {
    console.log(`[LOG] ${evento}`);
  }
}
```

**Análise conceitual:** `: void` após parênteses declara que nenhum valor significativo é retornado. Funções são chamadas por seus efeitos.

### Return Statements em Funções void

```typescript
// Sem return - implicitamente retorna undefined
function executar(): void {
  console.log("Executando...");
  // Fim da função = return undefined implícito
}

// Return explícito sem valor
function processar(): void {
  console.log("Processando...");
  return; // Retorna early, mas sem valor
}

// Return undefined explícito (permitido)
function limpar(): void {
  console.log("Limpando...");
  return undefined; // OK em função void
}

// Retornar valor real - ERRO
function calcular(): void {
  return 42; // ❌ Erro: Type 'number' is not assignable to type 'void'
}
```

**Fundamento teórico:** `void` permite `return` vazio ou `return undefined`, mas proíbe retornar valores significativos. Isso preserva semântica de "sem valor útil".

### void em Callbacks

```typescript
// Event handler espera função void
const botao = document.getElementById("btn");
botao?.addEventListener("click", (event): void => {
  console.log("Clicado!");
  // Não precisa retornar nada
});

// Array.forEach espera callback void
const numeros = [1, 2, 3, 4, 5];
numeros.forEach((num): void => {
  console.log(num * 2);
  // Efeito colateral: imprimir. Não retorna valor.
});

// Timer callbacks
setTimeout((): void => {
  console.log("Timeout!");
}, 1000);
```

**Conceito crucial:** Callbacks que executam ações (logging, atualização de DOM) geralmente têm tipo `void`. Não há necessidade de valor de retorno.

### void vs undefined

```typescript
// Tipo void
function f1(): void {
  console.log("F1");
}

// Tipo undefined
function f2(): undefined {
  console.log("F2");
  return undefined; // DEVE retornar undefined explicitamente
}

// Diferença em uso
const resultado1 = f1(); // resultado1: void
const resultado2 = f2(); // resultado2: undefined

// void é mais permissivo em assignability
type VoidFn = () => void;
type UndefFn = () => undefined;

const voidFn: VoidFn = () => { }; // OK
const undefFn: UndefFn = () => { }; // ❌ Erro: void não assignable a undefined

const undefFn2: UndefFn = () => undefined; // ✅ OK
```

**Análise profunda:** 
- `void`: "Não me importo com o retorno, pode ser qualquer coisa (ou nada)"
- `undefined`: "Deve ser exatamente undefined"

Em prática, `void` é preferido para callbacks onde retorno é irrelevante.

### Permissividade Especial de void

```typescript
// Array.push retorna number (novo length)
// Mas TypeScript permite em contexto void
const numeros: number[] = [];
const adicionar: () => void = () => numeros.push(1);

adicionar(); // OK, mesmo que push retorne number

// Razão: void significa "ignoro o retorno"
// É seguro ignorar qualquer retorno
```

**Conceito avançado:** TypeScript permite atribuir funções que **retornam** valores a tipos de função que **esperam** `void`. Isso é pragmático: se o caller ignora o retorno, não há problema em retornar algo.

### void em Promises

```typescript
// Promise que não resolve com valor
async function salvarDados(): Promise<void> {
  await fetch("/api/salvar", { method: "POST" });
  // Não retorna valor, apenas executa ação
}

// Uso
salvarDados().then(() => {
  console.log("Salvo!");
  // Callback não recebe valor
});

// Comparação com Promise<T>
async function buscarDados(): Promise<string> {
  const res = await fetch("/api/dados");
  return res.text(); // Retorna string
}

buscarDados().then((dados) => {
  console.log(dados); // dados: string
});
```

**Fundamento teórico:** `Promise<void>` indica operação assíncrona sem resultado útil. Comum em operações de I/O que não retornam dados (POST, DELETE).

## 🎯 Aplicabilidade e Contextos

### Quando Usar void

**1. Event Handlers**
```typescript
// Click handlers não retornam valores
function handleClick(event: MouseEvent): void {
  event.preventDefault();
  console.log("Botão clicado");
}
```

**Raciocínio:** Handlers executam ações; retorno é irrelevante.

**2. Logging e Debug**
```typescript
function log(nivel: string, mensagem: string): void {
  console.log(`[${nivel}] ${mensagem}`);
}
```

**Raciocínio:** Função existe para side effect (console.log), não produz valor.

**3. Mutação de Estado**
```typescript
function incrementarContador(): void {
  contador++;
}
```

**Raciocínio:** Modifica variável externa; retorno não é significativo.

**4. APIs Fluentes (Setters)**
```typescript
class Configuracao {
  private porta: number = 3000;
  
  setPorta(porta: number): void {
    this.porta = porta;
  }
}
```

**Raciocínio:** Setter modifica estado interno, não retorna valor.

### Quando Não Usar void

Evite `void` se a função produz valor útil:

```typescript
// ❌ Ruim - função calcula valor mas declara void
function calcularTotal(): void {
  return 100; // Erro!
}

// ✅ Bom - tipo correto
function calcularTotal(): number {
  return 100;
}
```

## ⚠️ Limitações e Considerações Teóricas

### Confusão Semântica void vs undefined

Desenvolvedores confundem `void` com `undefined`. Regra prática:
- **void:** Tipo de retorno de função sem valor útil
- **undefined:** Valor literal ou tipo para variáveis que podem estar indefinidas

### void Não Impede Return

```typescript
function exemplo(): void {
  return; // Permitido
}
```

`void` permite `return` vazio. Se quiser proibir `return`, isso é comportamento, não tipo.

### Runtime: void é Invisível

```typescript
function f(): void {
  console.log("teste");
}

console.log(typeof f()); // "undefined"
```

Em runtime, `void` desaparece. Função retorna `undefined` em JavaScript.

## 🔗 Interconexões Conceituais

**Relação com undefined:** `undefined` é valor; `void` é tipo de ausência de valor.

**Relação com never:** `never` é para funções que nunca retornam (lançam erro ou loop infinito). `void` retorna, mas sem valor.

**Relação com Callbacks:** Tipo `void` é padrão para callbacks de side effects.

**Relação com Promises:** `Promise<void>` expressa operações assíncronas sem resultado.

## 🚀 Evolução e Próximos Conceitos

Dominar `void` prepara para:
- **Tipo never:** Funções que nunca retornam de fato
- **Promise<void>:** Async operations sem valor de retorno
- **Generics com void:** Funções genéricas que podem ou não retornar valores
