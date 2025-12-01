# Evitar Modificação de Estado Externo: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Evitar modificação de estado externo** significa função não altera variáveis, objetos ou estruturas fora de seu escopo local - **toda comunicação ocorre via parâmetros e valor de retorno**. Conceitualmente, representa **isolamento completo**, onde função opera em mundo próprio sem interferir no contexto que a chamou.

Na essência, não-modificação de estado externo materializa o princípio de **encapsulamento funcional**, onde função é caixa preta que recebe inputs, processa e retorna outputs, sem deixar "pegadas" no ambiente externo.

## 📋 Fundamentos

### O Que É Estado Externo?

```typescript
// Estado externo: variáveis globais
let contador = 0;

// ❌ Modifica estado externo
function incrementar(): void {
  contador++; // Modificação!
}

// ❌ Lê e modifica estado externo
function obterEIncrementar(): number {
  return contador++; // Lê E modifica
}

// ✅ Não modifica estado externo
function incrementarPuro(valor: number): number {
  return valor + 1; // Retorna novo valor
}

// Uso correto:
contador = incrementarPuro(contador); // Atualização explícita
```

**Conceito-chave:** Estado externo inclui: variáveis globais, propriedades de objetos recebidos, DOM, localStorage, console, arquivos, rede.

### Mutação de Argumentos

```typescript
// ❌ Modifica argumento (estado externo à função)
function adicionarItem(arr: number[], item: number): void {
  arr.push(item); // Mutação do array recebido!
}

const numeros = [1, 2, 3];
adicionarItem(numeros, 4);
console.log(numeros); // [1, 2, 3, 4] - modificado!

// ✅ Não modifica argumento
function adicionarItemPuro(arr: number[], item: number): number[] {
  return [...arr, item]; // Retorna novo array
}

const numeros2 = [1, 2, 3];
const novosNumeros = adicionarItemPuro(numeros2, 4);
console.log(numeros2);      // [1, 2, 3] - original intacto
console.log(novosNumeros);  // [1, 2, 3, 4] - novo array
```

## 🔍 Análise Conceitual

### 1. Variáveis Globais

```typescript
// ❌ Estado global mutável
let usuario: Usuario | null = null;
let configuracoes: Config = { tema: "claro" };

function fazerLogin(email: string, senha: string): void {
  usuario = buscarUsuario(email, senha); // Modifica global!
}

function alterarTema(novoTema: string): void {
  configuracoes.tema = novoTema; // Modifica global!
}

// ✅ Sem estado global - tudo via parâmetros e retorno
function fazerLoginPuro(
  email: string,
  senha: string
): Result<Usuario> {
  const usuario = buscarUsuario(email, senha);
  return { sucesso: true, dados: usuario };
}

function alterarTemaPuro(
  config: Config,
  novoTema: string
): Config {
  return { ...config, tema: novoTema };
}

// Uso: estado gerenciado explicitamente
let appState = {
  usuario: null,
  config: { tema: "claro" }
};

const loginResult = fazerLoginPuro("user@example.com", "senha");
if (loginResult.sucesso) {
  appState = { ...appState, usuario: loginResult.dados };
}

appState = {
  ...appState,
  config: alterarTemaPuro(appState.config, "escuro")
};
```

### 2. Propriedades de Objetos

```typescript
interface Pessoa {
  nome: string;
  idade: number;
}

// ❌ Modifica propriedades do objeto recebido
function envelhecer(pessoa: Pessoa): void {
  pessoa.idade++; // Mutação!
}

const ana = { nome: "Ana", idade: 25 };
envelhecer(ana);
console.log(ana.idade); // 26 - modificado!

// ✅ Retorna novo objeto
function envelhecerPuro(pessoa: Pessoa): Pessoa {
  return {
    ...pessoa,
    idade: pessoa.idade + 1
  };
}

const bob = { nome: "Bob", idade: 30 };
const bobMaisVelho = envelhecerPuro(bob);
console.log(bob.idade);         // 30 - original intacto
console.log(bobMaisVelho.idade); // 31 - novo objeto
```

### 3. Arrays - Imutabilidade

```typescript
const original = [1, 2, 3, 4, 5];

// ❌ Métodos que modificam array original
original.push(6);       // Modifica
original.pop();         // Modifica
original.shift();       // Modifica
original.unshift(0);    // Modifica
original.sort();        // Modifica
original.reverse();     // Modifica
original.splice(1, 2);  // Modifica

// ✅ Alternativas imutáveis
function push<T>(arr: T[], item: T): T[] {
  return [...arr, item];
}

function pop<T>(arr: T[]): T[] {
  return arr.slice(0, -1);
}

function shift<T>(arr: T[]): T[] {
  return arr.slice(1);
}

function unshift<T>(arr: T[], item: T): T[] {
  return [item, ...arr];
}

function sort<T>(arr: T[]): T[] {
  return [...arr].sort();
}

function reverse<T>(arr: T[]): T[] {
  return [...arr].reverse();
}

function splice<T>(arr: T[], start: number, deleteCount: number, ...items: T[]): T[] {
  return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)];
}
```

### 4. Objetos Aninhados

```typescript
interface Usuario {
  nome: string;
  endereco: {
    rua: string;
    cidade: string;
  };
}

// ❌ Modificação profunda
function mudarCidade(usuario: Usuario, novaCidade: string): void {
  usuario.endereco.cidade = novaCidade; // Mutação aninhada!
}

// ✅ Cópia profunda
function mudarCidadePuro(usuario: Usuario, novaCidade: string): Usuario {
  return {
    ...usuario,
    endereco: {
      ...usuario.endereco,
      cidade: novaCidade
    }
  };
}

// Uso
const user = {
  nome: "Ana",
  endereco: { rua: "Rua A", cidade: "São Paulo" }
};

const userAtualizado = mudarCidadePuro(user, "Rio de Janeiro");
console.log(user.endereco.cidade);           // "São Paulo" - original
console.log(userAtualizado.endereco.cidade); // "Rio de Janeiro" - novo
```

### 5. Closures e Estado Capturado

```typescript
// ❌ Closure que modifica estado capturado
function criarContador() {
  let contador = 0; // Estado capturado

  return {
    incrementar: () => ++contador,    // Modifica capturado!
    getValor: () => contador
  };
}

const c1 = criarContador();
c1.incrementar(); // 1
c1.incrementar(); // 2 - estado modificado

// ✅ Closure imutável
function criarContadorPuro(inicial: number = 0) {
  return {
    incrementar: (valor: number) => valor + 1,
    decrementar: (valor: number) => valor - 1
  };
}

const c2 = criarContadorPuro();
let estado = 0;
estado = c2.incrementar(estado); // 1
estado = c2.incrementar(estado); // 2
// Estado gerenciado externamente
```

## 🎯 Padrões para Imutabilidade

### 1. Spread Operator para Objetos

```typescript
interface Config {
  tema: string;
  idioma: string;
  notificacoes: boolean;
}

// Atualizar uma propriedade
function setTema(config: Config, tema: string): Config {
  return { ...config, tema };
}

// Atualizar múltiplas propriedades
function atualizarConfig(
  config: Config,
  updates: Partial<Config>
): Config {
  return { ...config, ...updates };
}
```

### 2. Spread Operator para Arrays

```typescript
// Adicionar ao final
const adicionar = <T>(arr: T[], item: T): T[] =>
  [...arr, item];

// Adicionar no início
const adicionarInicio = <T>(arr: T[], item: T): T[] =>
  [item, ...arr];

// Remover por índice
const removerIndice = <T>(arr: T[], indice: number): T[] =>
  [...arr.slice(0, indice), ...arr.slice(indice + 1)];

// Atualizar por índice
const atualizarIndice = <T>(arr: T[], indice: number, novoValor: T): T[] =>
  [...arr.slice(0, indice), novoValor, ...arr.slice(indice + 1)];
```

### 3. Map/Filter/Reduce (Métodos Imutáveis)

```typescript
const numeros = [1, 2, 3, 4, 5];

// Transformar
const dobrados = numeros.map(n => n * 2); // [2, 4, 6, 8, 10]

// Filtrar
const pares = numeros.filter(n => n % 2 === 0); // [2, 4]

// Reduzir
const soma = numeros.reduce((acc, n) => acc + n, 0); // 15

// Original intacto
console.log(numeros); // [1, 2, 3, 4, 5]
```

### 4. Bibliotecas de Imutabilidade

```typescript
// Usando Immer (exemplo conceitual)
import produce from "immer";

interface Estado {
  usuarios: Usuario[];
  config: Config;
}

const estadoInicial: Estado = {
  usuarios: [],
  config: { tema: "claro", idioma: "pt" }
};

// Atualização imutável com Immer
const novoEstado = produce(estadoInicial, draft => {
  draft.config.tema = "escuro"; // Parece mutação, mas cria cópia
  draft.usuarios.push({ nome: "Ana", idade: 25 });
});

console.log(estadoInicial.config.tema); // "claro" - original intacto
console.log(novoEstado.config.tema);    // "escuro" - novo estado
```

## 🎯 Benefícios Práticos

### 1. Histórico de Estado (Undo/Redo)

```typescript
// Estado imutável permite histórico trivial
interface AppState {
  contador: number;
  texto: string;
}

class App {
  private historico: AppState[] = [];
  private indice = -1;

  atualizar(novoEstado: AppState): void {
    // Remove futuros se desfez ações
    this.historico = this.historico.slice(0, this.indice + 1);

    // Adiciona novo estado
    this.historico.push(novoEstado);
    this.indice++;
  }

  undo(): AppState | null {
    if (this.indice > 0) {
      this.indice--;
      return this.historico[this.indice];
    }
    return null;
  }

  redo(): AppState | null {
    if (this.indice < this.historico.length - 1) {
      this.indice++;
      return this.historico[this.indice];
    }
    return null;
  }
}
```

### 2. Time Travel Debugging

```typescript
// Redux DevTools permite "viajar no tempo" porque estado é imutável
const acoes = [
  { tipo: "INCREMENTAR" },
  { tipo: "INCREMENTAR" },
  { tipo: "DECREMENTAR" }
];

function reducer(estado: number, acao: { tipo: string }): number {
  switch (acao.tipo) {
    case "INCREMENTAR":
      return estado + 1; // Retorna novo estado
    case "DECREMENTAR":
      return estado - 1;
    default:
      return estado;
  }
}

let estadoAtual = 0;
const historico = [estadoAtual];

acoes.forEach(acao => {
  estadoAtual = reducer(estadoAtual, acao);
  historico.push(estadoAtual);
});

console.log(historico); // [0, 1, 2, 1] - cada estado preservado
```

### 3. Comparação Eficiente (Shallow Equality)

```typescript
// Com imutabilidade, pode comparar referências
const estado1 = { contador: 1, texto: "a" };
const estado2 = { contador: 1, texto: "a" };
const estado3 = estado1;

console.log(estado1 === estado2); // false - objetos diferentes
console.log(estado1 === estado3); // true - mesma referência

// React usa isso para otimizar re-renders
function shouldUpdate(prevState: any, nextState: any): boolean {
  return prevState !== nextState; // Comparação rápida de referência
}
```

## ⚠️ Quando Mutação é Aceitável

### 1. Dentro do Escopo Local

```typescript
// ✅ Mutação local (dentro da função) é OK
function calcularMedia(numeros: number[]): number {
  let soma = 0; // Variável local mutável

  for (let i = 0; i < numeros.length; i++) {
    soma += numeros[i]; // Mutação local
  }

  return soma / numeros.length;
}

// Não vaza para fora - encapsulado
```

### 2. Performance Crítica

```typescript
// Em algoritmos de performance crítica, mutação local pode ser necessária
function ordenarGrande(arr: number[]): number[] {
  const copia = [...arr];

  // Mutação local para performance
  quickSortInPlace(copia, 0, copia.length - 1);

  return copia; // Retorna resultado, original intacto
}
```

## 📚 Conclusão

Evitar modificação de estado externo significa função não altera variáveis globais, propriedades de objetos recebidos ou qualquer estrutura fora de seu escopo. Toda comunicação ocorre via parâmetros e retorno. Torna código previsível, testável, permite histórico de estado, time travel debugging e comparação eficiente. Imutabilidade é alcançada com spread operators, métodos imutáveis (map/filter/reduce) e bibliotecas especializadas.
