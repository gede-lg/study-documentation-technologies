# Function Declaration em TypeScript

## 🎯 Introdução

**Function declaration** é a forma mais tradicional de definir funções em TypeScript, usando a palavra-chave `function` seguida de nome, parâmetros tipados e tipo de retorno, oferecendo **hoisting** e sintaxe clara e declarativa.

## 📋 Conceitos Fundamentais

### Sintaxe Básica

```typescript
// Template de function declaration
function nomeDaFuncao(parametro1: Tipo1, parametro2: Tipo2): TipoRetorno {
  // corpo da função
  return valor;
}

// Exemplo
function somar(a: number, b: number): number {
  return a + b;
}

const resultado = somar(5, 3); // 8
```

### Componentes da Declaração

```typescript
function calcular(x: number, y: number): number {
  // ^^^^^^^^ nome da função
  //         ^       ^       ^ parâmetros com tipos
  //                           ^^^^^^ tipo de retorno
  return x + y;
}
```

## 🧠 Fundamentos Teóricos

### Hoisting (Elevação)

```typescript
// ✅ Funciona! Function declaration tem hoisting
console.log(saudar("Ana")); // "Olá, Ana"

function saudar(nome: string): string {
  return `Olá, ${nome}`;
}

// Declaração é "elevada" para o topo do escopo durante compilação
```

### Named Function vs Anonymous

```typescript
// Named: tem nome próprio
function processar(valor: number): number {
  return valor * 2;
}

// Anonymous: sem nome (não é function declaration)
const processar2 = function(valor: number): number {
  return valor * 2;
};
```

### Tipo de Retorno Explícito vs Inferido

```typescript
// Explícito: tipo declarado
function multiplicar(a: number, b: number): number {
  return a * b;
}

// Inferido: TypeScript deduz tipo de retorno
function dividir(a: number, b: number) {
  return a / b; // TypeScript infere: number
}

// ✅ Boas práticas: sempre declarar tipo de retorno
// Melhora legibilidade e previne erros
```

## 🔍 Análise Conceitual Profunda

### Tipagem de Parâmetros

#### Tipos Primitivos

```typescript
function imprimirNumero(valor: number): void {
  console.log(valor);
}

function concatenar(texto1: string, texto2: string): string {
  return texto1 + texto2;
}

function inverter(flag: boolean): boolean {
  return !flag;
}
```

#### Tipos Complexos

```typescript
// Arrays
function somar(numeros: number[]): number {
  return numeros.reduce((acc, n) => acc + n, 0);
}

// Objetos
function criarUsuario(nome: string, idade: number): { nome: string; idade: number } {
  return { nome, idade };
}

// Type alias para clareza
type Usuario = { nome: string; idade: number };

function criarUsuarioTipado(nome: string, idade: number): Usuario {
  return { nome, idade };
}
```

#### Union Types

```typescript
function processar(entrada: string | number): string {
  if (typeof entrada === "string") {
    return entrada.toUpperCase();
  } else {
    return entrada.toString();
  }
}

processar("texto"); // "TEXTO"
processar(123); // "123"
```

### Void e Never como Retorno

#### void: Função Sem Retorno

```typescript
function logar(mensagem: string): void {
  console.log(mensagem);
  // não retorna valor explícito
}

// Pode retornar undefined implicitamente
function processar(): void {
  // operações...
  return; // OK
}
```

#### never: Função Que Nunca Retorna

```typescript
// Lança exceção: nunca chega ao fim
function lancarErro(mensagem: string): never {
  throw new Error(mensagem);
}

// Loop infinito: nunca termina
function loopInfinito(): never {
  while (true) {
    console.log("executando...");
  }
}

// never é subtipo de todos os tipos
function processar(valor: string | number): number {
  if (typeof valor === "string") {
    return parseInt(valor);
  } else if (typeof valor === "number") {
    return valor;
  }
  
  // Se chegou aqui, algo está errado
  return lancarErro("Tipo inesperado"); // never é compatível com number
}
```

### Type Narrowing em Funções

```typescript
function processarValor(valor: string | number | null): string {
  // Narrowing com typeof
  if (typeof valor === "string") {
    return valor.toUpperCase(); // valor é string aqui
  }
  
  // Narrowing com typeof
  if (typeof valor === "number") {
    return valor.toFixed(2); // valor é number aqui
  }
  
  // Narrowing por eliminação
  return "Nulo"; // valor é null aqui
}
```

### Funções com Side Effects

```typescript
// Função pura: sem side effects
function somar(a: number, b: number): number {
  return a + b; // apenas retorna resultado
}

// Função impura: tem side effects
let contador = 0;

function incrementar(): number {
  contador++; // modifica estado externo (side effect)
  return contador;
}

// Side effect de I/O
function salvarArquivo(conteudo: string): void {
  // modifica sistema de arquivos
  console.log("Salvando:", conteudo);
}
```

## 🎯 Aplicabilidade

### Validação de Dados

```typescript
type Email = string;

function validarEmail(email: Email): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarSenha(senha: string): { valida: boolean; erro?: string } {
  if (senha.length < 8) {
    return { valida: false, erro: "Senha muito curta" };
  }
  
  if (!/[A-Z]/.test(senha)) {
    return { valida: false, erro: "Falta letra maiúscula" };
  }
  
  return { valida: true };
}

// Uso
const resultadoEmail = validarEmail("teste@email.com"); // true
const resultadoSenha = validarSenha("Abc123!@");
if (!resultadoSenha.valida) {
  console.error(resultadoSenha.erro);
}
```

### Transformação de Dados

```typescript
type Usuario = { id: number; nome: string; email: string };
type UsuarioDTO = { nome: string; email: string };

function converterParaDTO(usuario: Usuario): UsuarioDTO {
  return {
    nome: usuario.nome,
    email: usuario.email
  };
}

function normalizarNome(nome: string): string {
  return nome.trim().toLowerCase();
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}
```

### Cálculos e Operações

```typescript
function calcularArea(largura: number, altura: number): number {
  return largura * altura;
}

function calcularIMC(peso: number, altura: number): number {
  return peso / (altura * altura);
}

function calcularDesconto(preco: number, percentual: number): number {
  return preco - (preco * percentual / 100);
}

// Funções compostas
function precoFinal(preco: number, desconto: number, taxa: number): number {
  const comDesconto = calcularDesconto(preco, desconto);
  const comTaxa = comDesconto + taxa;
  return comTaxa;
}
```

### Utilitários de Array

```typescript
function primeiro<T>(array: T[]): T | undefined {
  return array[0];
}

function ultimo<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

function contem<T>(array: T[], elemento: T): boolean {
  return array.includes(elemento);
}

function removerDuplicados<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// Uso
const numeros = [1, 2, 2, 3, 3, 3];
const unicos = removerDuplicados(numeros); // [1, 2, 3]
```

### Predicados (Type Guards)

```typescript
function isString(valor: unknown): valor is string {
  return typeof valor === "string";
}

function isNumber(valor: unknown): valor is number {
  return typeof valor === "number";
}

function isArray<T>(valor: unknown): valor is T[] {
  return Array.isArray(valor);
}

// Uso com type narrowing
function processar(valor: unknown): string {
  if (isString(valor)) {
    return valor.toUpperCase(); // TypeScript sabe que é string
  }
  
  if (isNumber(valor)) {
    return valor.toFixed(2); // TypeScript sabe que é number
  }
  
  return "Tipo desconhecido";
}
```

## ⚠️ Limitações

### Hoisting Pode Causar Confusão

```typescript
// ⚠️ Funciona, mas pode ser confuso
console.log(calcular(5)); // 10

function calcular(x: number): number {
  return x * 2;
}

// ✅ Melhor: declarar antes de usar
function processar(x: number): number {
  return x * 2;
}

console.log(processar(5)); // 10
```

### Não Pode Ser Usada em Expressões Diretamente

```typescript
// ❌ Erro: function declaration não é expressão
const resultado = (function somar(a: number, b: number): number {
  return a + b;
})(5, 3);

// ✅ Use function expression para isso
const resultado = (function(a: number, b: number): number {
  return a + b;
})(5, 3);
```

### Não Pode Ser Atribuída Condicionalmente

```typescript
// ❌ Erro: function declaration não pode estar em bloco condicional
if (true) {
  function processar(x: number): number {
    return x * 2;
  }
}

// ✅ Use function expression
let processar: (x: number) => number;

if (true) {
  processar = function(x: number): number {
    return x * 2;
  };
}
```

## 🔗 Interconexões

### Com Function Expression

```typescript
// Function declaration
function somar1(a: number, b: number): number {
  return a + b;
}

// Function expression (equivalente)
const somar2 = function(a: number, b: number): number {
  return a + b;
};

// Diferenças:
// - declaration tem hoisting
// - expression não tem hoisting
// - declaration sempre tem nome
// - expression pode ser anônima
```

### Com Arrow Functions

```typescript
// Function declaration
function multiplicar1(a: number, b: number): number {
  return a * b;
}

// Arrow function (equivalente)
const multiplicar2 = (a: number, b: number): number => {
  return a * b;
};

// Arrow function curta
const multiplicar3 = (a: number, b: number): number => a * b;
```

### Com Interfaces de Função

```typescript
// Interface define estrutura de função
interface Operacao {
  (a: number, b: number): number;
}

// Function declaration implementa interface
function somar(a: number, b: number): number {
  return a + b;
}

function subtrair(a: number, b: number): number {
  return a - b;
}

// Uso
const operacao: Operacao = somar;
console.log(operacao(10, 5)); // 15

const outraOperacao: Operacao = subtrair;
console.log(outraOperacao(10, 5)); // 5
```

### Com Genéricos

```typescript
// Function declaration com genéricos
function identidade<T>(valor: T): T {
  return valor;
}

function primeiroElemento<T>(array: T[]): T | undefined {
  return array[0];
}

function mapear<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}

// Uso
const num = identidade(42); // number
const str = identidade("texto"); // string
const primeiro = primeiroElemento([1, 2, 3]); // number | undefined
const dobrados = mapear([1, 2, 3], x => x * 2); // number[]
```

## 🚀 Evolução e Contexto Histórico

### JavaScript Tradicional

```javascript
// JavaScript puro: sem tipos
function somar(a, b) {
  return a + b;
}

somar(5, 3); // 8
somar("5", "3"); // "53" - concatenação! Bug comum
```

### TypeScript: Segurança de Tipo

```typescript
// TypeScript: tipos previnem bugs
function somar(a: number, b: number): number {
  return a + b;
}

somar(5, 3); // 8
somar("5", "3"); // ❌ Erro de compilação: tipo incorreto
```

### Evolução para Tipos Mais Expressivos

```typescript
// TypeScript moderno: tipos complexos
type Resultado<T> = { sucesso: true; valor: T } | { sucesso: false; erro: string };

function dividir(a: number, b: number): Resultado<number> {
  if (b === 0) {
    return { sucesso: false, erro: "Divisão por zero" };
  }
  
  return { sucesso: true, valor: a / b };
}

const resultado = dividir(10, 2);
if (resultado.sucesso) {
  console.log(resultado.valor); // TypeScript sabe que existe
} else {
  console.error(resultado.erro); // TypeScript sabe que existe
}
```

## 📚 Conclusão

**Function declaration** em TypeScript oferece:

✅ Sintaxe clara e tradicional  
✅ Hoisting para uso antes da declaração  
✅ Tipagem de parâmetros e retorno  
✅ Type safety em tempo de compilação  
✅ Suporte a genéricos e tipos complexos  

Use function declaration quando:
- Quer sintaxe declarativa clara
- Precisa de hoisting (usar antes de declarar)
- Função tem nome significativo
- Função é reutilizável em múltiplos contextos
- Quer separação clara de funções no código

Function declaration é **fundação de funções em TypeScript** e essencial para código estruturado e type-safe.
