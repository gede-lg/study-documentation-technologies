# Anotação de Tipo de Retorno: Contratos de Saída de Funções

## 🎯 Introdução e Definição

Anotação de tipo de retorno é **declaração explícita do tipo** que função produzirá ao completar execução, especificada através de sintaxe `: Tipo` após parênteses dos parâmetros e antes do corpo da função. Conceitualmente, representa **garantia de saída** que função oferece a chamadores: função promete retornar valor do tipo especificado; compilador **valida todos caminhos de retorno** e garante que promessa seja cumprida. TypeScript usa anotação de retorno para **type checking bidirecional** e **documentação automática**.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Sintaxe:** `function nome(): Tipo { return valor; }`
2. **Validação de Implementação:** Compilador verifica que todos `return` são compatíveis
3. **Inferência vs. Explícito:** TypeScript infere retorno, mas anotação pode ser útil
4. **Tipos Especiais:** `void`, `never`, `Promise<T>` para casos específicos
5. **Documentação de Contrato:** Torna claro o que função produz

**Conceito Central:** Retorno tipado completa contrato de função - entrada (parâmetros) + processamento (corpo) + **saída garantida** (retorno).

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Function Declaration:**
```typescript
function somar(a: number, b: number): number {
  return a + b;
}
```

**Function Expression:**
```typescript
const multiplicar = function(x: number, y: number): number {
  return x * y;
};
```

**Arrow Function:**
```typescript
const subtrair = (a: number, b: number): number => a - b;
```

**Validação:**
```typescript
function dobrar(n: number): number {
  return n * 2;        // OK - retorna number
  // return String(n); // ERRO: Type 'string' is not assignable to type 'number'
}
```

### Inferência de Retorno

**TypeScript Infere Automaticamente:**
```typescript
function somar(a: number, b: number) {
  return a + b;  // Retorno inferido: number
}

const resultado = somar(10, 20);  // resultado: number
```

**Quando Confiar em Inferência:**
- Funções simples, expressões óbvias
- Implementações privadas/internas
- Retorno óbvio do código

**Quando Anotar Explicitamente:**
- APIs públicas (contratos claros)
- Funções complexas com múltiplos `return`
- Prevenir erros de refatoração
- Documentação de intenção

### Tipos Primitivos de Retorno

```typescript
function obterNome(): string {
  return "João";
}

function obterIdade(): number {
  return 30;
}

function estaAtivo(): boolean {
  return true;
}

function obterIdentificador(): symbol {
  return Symbol("id");
}
```

### Retorno de Objetos

**Objeto Literal:**
```typescript
function criarUsuario(): { nome: string; idade: number } {
  return {
    nome: "Maria",
    idade: 25
  };
}
```

**Com Type Alias:**
```typescript
type Usuario = {
  nome: string;
  email: string;
  ativo: boolean;
};

function buscarUsuario(id: number): Usuario {
  return {
    nome: "João",
    email: "joao@exemplo.com",
    ativo: true
  };
}
```

**Com Interface:**
```typescript
interface Produto {
  id: number;
  nome: string;
  preco: number;
}

function criarProduto(nome: string, preco: number): Produto {
  return {
    id: Math.random(),
    nome,
    preco
  };
}
```

### Retorno de Arrays

```typescript
function obterNumeros(): number[] {
  return [1, 2, 3, 4, 5];
}

function obterNomes(): string[] {
  return ["Ana", "Bruno", "Carlos"];
}

function obterMistos(): (string | number)[] {
  return ["texto", 42, "outro", 99];
}
```

### Union Types em Retorno

**Múltiplos Tipos Possíveis:**
```typescript
function processar(sucesso: boolean): string | number {
  if (sucesso) {
    return "Operação concluída";
  }
  return 404;
}

const resultado = processar(true);  // resultado: string | number
```

**Nullable Returns:**
```typescript
function buscar(id: number): Usuario | null {
  const usuario = database.find(id);
  if (usuario) {
    return usuario;
  }
  return null;
}
```

**Undefined Returns:**
```typescript
function primeiro<T>(array: T[]): T | undefined {
  return array[0];  // undefined se array vazio
}
```

## 🔍 Análise Conceitual Profunda

### Tipo `void` - Sem Retorno de Valor

**Conceito:** Função executada por **efeito colateral**, não retorna valor útil.

```typescript
function exibir(mensagem: string): void {
  console.log(mensagem);
  // Sem return, ou return vazio
}

function atualizar(id: number, dados: any): void {
  database.update(id, dados);
  return;  // Return vazio OK
}
```

**`void` vs. `undefined`:**
```typescript
function retornaVoid(): void {
  // Pode não ter return
  console.log("executou");
}

function retornaUndefined(): undefined {
  return undefined;  // Deve retornar undefined explicitamente
}
```

**Conceito:** `void` permite omitir `return`; `undefined` exige `return undefined`.

### Tipo `never` - Nunca Retorna

**Conceito:** Função **nunca completa normalmente** - lança erro ou loop infinito.

**Lançar Erro:**
```typescript
function lancarErro(mensagem: string): never {
  throw new Error(mensagem);
  // Nunca atinge fim da função
}
```

**Loop Infinito:**
```typescript
function loopInfinito(): never {
  while (true) {
    // Loop sem fim
  }
}
```

**Exhaustiveness Checking:**
```typescript
type Forma = "circulo" | "quadrado";

function calcularArea(forma: Forma): number {
  switch (forma) {
    case "circulo":
      return Math.PI * 10 ** 2;
    case "quadrado":
      return 10 ** 2;
    default:
      const _exhaustiveCheck: never = forma;
      return _exhaustiveCheck;
  }
}
```

**Conceito:** `never` em `default` garante que todos os casos foram cobertos - se novo tipo adicionado a union, compilador detecta.

### Retorno de Promises

**Funções Assíncronas:**
```typescript
async function buscarDados(): Promise<string> {
  const resposta = await fetch("/api/dados");
  return resposta.text();  // Retorna string, wrapped em Promise
}
```

**Promise Manual:**
```typescript
function aguardar(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

**Promise com Tipo Genérico:**
```typescript
function carregarUsuario(id: number): Promise<Usuario> {
  return fetch(`/api/users/${id}`)
    .then(res => res.json());
}
```

**Conceito:** `async function` sempre retorna `Promise<T>`; tipo anotado é `T` (valor unwrapped).

### Múltiplos Caminhos de Retorno

**Validação de Todos os Paths:**
```typescript
function classificar(nota: number): string {
  if (nota >= 90) {
    return "A";
  } else if (nota >= 80) {
    return "B";
  } else if (nota >= 70) {
    return "C";
  } else {
    return "F";
  }
  // Todos os caminhos retornam string - OK
}
```

**Erro se Path sem Retorno:**
```typescript
function processar(valor: number): string {
  if (valor > 0) {
    return "positivo";
  }
  // ERRO: Function lacks ending return statement and return type does not include 'undefined'
}

// ✅ Corrigido
function processar(valor: number): string {
  if (valor > 0) {
    return "positivo";
  }
  return "não positivo";  // Path padrão
}
```

### Tuple Returns

**Retornar Múltiplos Valores:**
```typescript
function dividir(a: number, b: number): [number, number] {
  const quociente = Math.floor(a / b);
  const resto = a % b;
  return [quociente, resto];
}

const [q, r] = dividir(10, 3);  // q: number, r: number
```

**Tuple com Tipos Diferentes:**
```typescript
function analisar(texto: string): [boolean, number] {
  const valido = texto.length > 0;
  const tamanho = texto.length;
  return [valido, tamanho];
}
```

### Generics em Retorno

**Função Genérica:**
```typescript
function identidade<T>(valor: T): T {
  return valor;
}

const num = identidade(42);      // num: number
const texto = identidade("oi");  // texto: string
```

**Array Genérico:**
```typescript
function ultimo<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

const n = ultimo([1, 2, 3]);      // n: number | undefined
const s = ultimo(["a", "b"]);     // s: string | undefined
```

## 🎯 Aplicabilidade

### Quando Anotar Retorno Explicitamente

**1. APIs Públicas:**
```typescript
// ✅ Exports devem ter tipos explícitos
export function calcular(x: number, y: number): number {
  return x + y;
}
```

**2. Funções Complexas:**
```typescript
function processarPedido(dados: any): Pedido | null {
  // Múltiplos caminhos, lógica complexa
  // Anotação clarifica intenção
}
```

**3. Prevenir Refatoração Acidental:**
```typescript
function obterConfig(): Config {
  // Se alguém mudar implementação, tipo garante compatibilidade
  return loadConfig();
}
```

**4. Callbacks e Higher-Order Functions:**
```typescript
function criarMultiplicador(fator: number): (n: number) => number {
  return (n) => n * fator;
}
```

### Quando Confiar em Inferência

**Funções Simples:**
```typescript
function dobrar(n: number) {
  return n * 2;  // Inferido: number
}
```

**Implementações Privadas:**
```typescript
class Calculadora {
  private somar(a: number, b: number) {
    return a + b;  // Inferência OK em método privado
  }
}
```

## 🎯 Padrões Recomendados

### Anotar APIs Públicas

```typescript
// ✅ Módulos exportados
export function processar(dados: string): Resultado {
  // ...
}

// Inferência OK para helpers internos
function helper(x: number) {
  return x * 2;
}
```

### Usar `void` para Efeitos Colaterais

```typescript
function salvar(dados: any): void {
  database.save(dados);
}

function atualizar(id: number): void {
  cache.invalidate(id);
}
```

### Usar `never` para Funções que Lançam

```typescript
function validar(condicao: boolean, mensagem: string): asserts condicao {
  if (!condicao) {
    throw new Error(mensagem);
  }
}
```

## ⚠️ Armadilhas Comuns

### 1. Esquecer Retorno em Algum Path

```typescript
function classificar(nota: number): string {
  if (nota >= 90) return "A";
  if (nota >= 80) return "B";
  // ERRO: Falta return padrão
}
```

### 2. Retornar Tipo Errado

```typescript
function obterIdade(): number {
  return "30";  // ERRO: Type 'string' is not assignable to type 'number'
}
```

### 3. Confundir `void` com `undefined`

```typescript
function executar(): void {
  console.log("executou");
}

// ❌ Não use retorno de função void
const resultado = executar();  // resultado: void (não útil)

// ✅ Função void é chamada por efeito colateral
executar();
```

### 4. Promessa Sem Tipo

```typescript
// ❌ any implícito
async function buscar() {
  return fetch("/api").then(r => r.json());
}

// ✅ Tipo explícito
async function buscar(): Promise<Usuario[]> {
  return fetch("/api").then(r => r.json());
}
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Anotação de Parâmetros:** Entrada + Retorno = Contrato completo
- **Generics:** Retornos parametrizados por tipos de entrada
- **Promises:** Tipos assíncronos wrapping valores
- **Type Narrowing:** Refinar tipo de retorno baseado em lógica

**Progressão:**
Parâmetros → Retorno → Assinatura completa → Function types → Callbacks tipados

## 📚 Conclusão

**Anotação de tipo de retorno** completa contrato de função, declarando **garantia de saída** que compilador verifica. TypeScript infere retornos automaticamente, mas anotação explícita oferece **documentação, prevenção de erros e contratos claros** para APIs públicas.

**Tipos Especiais:**
- **`void`:** Executada por efeito colateral, sem retorno útil
- **`never`:** Nunca completa (lança erro, loop infinito)
- **`Promise<T>`:** Retorno assíncrono de valor tipo `T`

**Princípios de Uso:**
1. **Anotar APIs públicas** explicitamente
2. **Confiar em inferência** para código interno simples
3. **Usar `void`** para funções de efeito colateral
4. **Garantir todos os paths** retornam tipo compatível
5. **Prevenir refatoração acidental** com tipos explícitos

**Retorno tipado + parâmetros tipados = função totalmente type-safe e autodocumentada.**
