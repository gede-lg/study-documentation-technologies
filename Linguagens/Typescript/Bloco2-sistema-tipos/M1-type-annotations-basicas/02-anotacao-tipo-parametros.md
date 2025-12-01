# Anotação de Tipo de Parâmetros: Contratos de Entrada de Funções

## 🎯 Introdução e Definição

Anotação de tipo de parâmetro é **especificação explícita do tipo** que argumentos de função devem ter, declarada através de sintaxe `: Tipo` após cada parâmetro na assinatura da função. Conceitualmente, representa **interface de contrato** entre chamador e função: chamador promete fornecer valores do tipo especificado; função confia nessa garantia para operar seguramente. TypeScript **valida chamadas em compile-time**, prevenindo passagem de argumentos incompatíveis e erros de tipo em runtime.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Sintaxe:** `function nome(param: Tipo) { }`
2. **Validação de Chamada:** Compilador verifica argumentos em cada invocação
3. **Type Safety Bidirecional:** Protege implementação da função E chamadores
4. **Documentação Automática:** IDEs mostram tipos esperados
5. **Inferência Contextual:** Tipos de parâmetros influenciam inferência no corpo da função

**Conceito Central:** Parâmetros tipados transformam funções em **contratos type-safe** - entrada garantida, comportamento previsível.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Function Declaration:**
```typescript
function somar(a: number, b: number) {
  return a + b;
}
```

**Function Expression:**
```typescript
const multiplicar = function(x: number, y: number) {
  return x * y;
};
```

**Arrow Function:**
```typescript
const subtrair = (a: number, b: number) => a - b;
```

**Validação:**
```typescript
somar(10, 20);      // OK
somar(10, "20");    // ERRO: Argument of type 'string' is not assignable to parameter of type 'number'
```

### Múltiplos Parâmetros

**Cada Parâmetro Anotado Independentemente:**
```typescript
function registrar(
  nome: string,
  idade: number,
  ativo: boolean
) {
  console.log(`${nome}, ${idade} anos, ativo: ${ativo}`);
}

registrar("João", 30, true);  // OK
```

**Types Diferentes:**
```typescript
function processar(
  id: number,
  dados: string[],
  callback: (resultado: string) => void
) {
  const resultado = dados.join(",");
  callback(resultado);
}
```

### Parâmetros com Union Types

**Aceitar Múltiplos Tipos:**
```typescript
function exibir(valor: string | number) {
  console.log(valor);
}

exibir("texto");  // OK
exibir(42);       // OK
// exibir(true);  // ERRO: Argument of type 'boolean' is not assignable
```

**Type Narrowing Necessário:**
```typescript
function formatar(valor: string | number): string {
  if (typeof valor === "string") {
    return valor.toUpperCase();
  } else {
    return valor.toFixed(2);
  }
}
```

### Parâmetros Opcionais

**Sintaxe `param?: Tipo`:**
```typescript
function saudar(nome: string, titulo?: string) {
  if (titulo) {
    return `Olá, ${titulo} ${nome}`;
  }
  return `Olá, ${nome}`;
}

saudar("João");              // OK - titulo é undefined
saudar("Maria", "Dra.");     // OK
```

**Tipo Inferido:**
```typescript
function exemplo(opcional?: number) {
  // opcional: number | undefined
  if (opcional !== undefined) {
    console.log(opcional.toFixed(2));
  }
}
```

**Regra:** Parâmetros opcionais devem vir **após** obrigatórios.

```typescript
// ❌ ERRO: A required parameter cannot follow an optional parameter
function invalido(opcional?: string, obrigatorio: number) { }

// ✅ OK
function valido(obrigatorio: number, opcional?: string) { }
```

### Parâmetros com Valor Padrão

**Sintaxe `param: Tipo = valor`:**
```typescript
function calcularDesconto(preco: number, desconto: number = 0.1) {
  return preco * (1 - desconto);
}

calcularDesconto(100);      // 90 (usa desconto padrão 0.1)
calcularDesconto(100, 0.2); // 80 (sobrescreve padrão)
```

**Inferência de Tipo:**
```typescript
function criar(nome: string, ativo = true) {
  // ativo inferido como boolean
  return { nome, ativo };
}
```

**Combinação com Anotação:**
```typescript
function conectar(timeout: number = 5000): void {
  // timeout: number com padrão 5000
}
```

**Conceito:** Parâmetro com padrão é **implicitamente opcional** - chamador pode omitir.

### Rest Parameters (Parâmetros Rest)

**Sintaxe `...param: Tipo[]`:**
```typescript
function somar(...numeros: number[]): number {
  return numeros.reduce((acc, n) => acc + n, 0);
}

somar(1, 2, 3);        // 6
somar(10, 20, 30, 40); // 100
somar();               // 0 (array vazio)
```

**Type Safety:**
```typescript
function concatenar(...textos: string[]): string {
  return textos.join(" ");
}

concatenar("Hello", "World");  // OK
// concatenar("Hello", 42);    // ERRO: Argument of type 'number' is not assignable
```

**Conceito:** Rest parameter captura **0 ou mais** argumentos em array tipado.

## 🔍 Análise Conceitual Profunda

### Destructuring em Parâmetros

**Objetos Destructured:**
```typescript
function exibir({ nome, idade }: { nome: string; idade: number }) {
  console.log(`${nome} tem ${idade} anos`);
}

exibir({ nome: "João", idade: 30 });
```

**Com Type Alias:**
```typescript
type Usuario = {
  nome: string;
  idade: number;
  email?: string;
};

function registrar({ nome, idade, email }: Usuario) {
  console.log(nome, idade, email);
}
```

**Arrays Destructured:**
```typescript
function processar([primeiro, segundo]: [string, number]) {
  console.log(primeiro, segundo);
}

processar(["texto", 42]);
```

### Parâmetros de Função como Tipo

**Callbacks:**
```typescript
function executar(callback: (resultado: number) => void) {
  const resultado = 42;
  callback(resultado);
}

executar((valor) => {
  // valor inferido como number
  console.log(valor.toFixed(2));
});
```

**Type Alias para Callbacks:**
```typescript
type Callback = (erro: Error | null, dados?: string) => void;

function buscarDados(url: string, callback: Callback) {
  // Implementação
}
```

### Parâmetros Genéricos

**Introdução:**
```typescript
function identidade<T>(valor: T): T {
  return valor;
}

identidade<number>(42);    // T = number
identidade<string>("oi");  // T = string
identidade(true);          // T inferido como boolean
```

**Array Genérico:**
```typescript
function primeiro<T>(array: T[]): T | undefined {
  return array[0];
}

const num = primeiro([1, 2, 3]);      // num: number | undefined
const texto = primeiro(["a", "b"]);   // texto: string | undefined
```

**Conceito:** Generics permitem funções polimórficas mantendo type safety.

### This Parameter

**Especificar Tipo de `this`:**
```typescript
interface BancoDados {
  conectar(): void;
}

function executarQuery(this: BancoDados, query: string) {
  this.conectar();  // Type-safe: this é BancoDados
  console.log(query);
}

const db: BancoDados = {
  conectar() { console.log("Conectado"); }
};

executarQuery.call(db, "SELECT *");
```

**Conceito:** `this` como primeiro parâmetro (especial) declara tipo esperado de contexto.

## 🎯 Aplicabilidade

### Quando Anotar Parâmetros

**Sempre Anotar:**
Diferente de variáveis (inferência possível), **parâmetros devem sempre ser anotados** - compilador não pode inferir tipo de argumentos que serão passados.

```typescript
// ❌ SEM ANOTAÇÃO - parâmetros são 'any'
function somar(a, b) {
  return a + b;
}

// ✅ COM ANOTAÇÃO - type-safe
function somar(a: number, b: number): number {
  return a + b;
}
```

### Parâmetros Opcionais vs. Valor Padrão

**Opcional (`?`):**
Use quando parâmetro pode estar ausente e função trata `undefined`.

```typescript
function buscar(id: number, cache?: boolean) {
  if (cache === undefined) {
    // Lógica para decidir se usa cache
  }
}
```

**Valor Padrão (`=`):**
Use quando parâmetro deve ter valor específico se omitido.

```typescript
function conectar(timeout: number = 5000) {
  // timeout sempre é number, nunca undefined
}
```

### Overloading (Sobrecarga)

**Múltiplas Assinaturas:**
```typescript
function processar(valor: string): string;
function processar(valor: number): number;
function processar(valor: string | number): string | number {
  if (typeof valor === "string") {
    return valor.toUpperCase();
  } else {
    return valor * 2;
  }
}

const texto = processar("oi");   // texto: string
const numero = processar(10);    // numero: number
```

**Conceito:** Overloads permitem tipos de retorno diferentes baseados em tipos de parâmetros.

## 🎯 Padrões Recomendados

### Preferir Tipos Específicos sobre `any`

```typescript
// ❌ Evitar
function processar(dados: any) {
  // Perde type safety
}

// ✅ Preferir
function processar(dados: string | number | boolean) {
  // Type-safe
}

// ✅ Ou genérico
function processar<T>(dados: T) {
  // Preserva tipo
}
```

### Usar Tipos Restritivos

```typescript
// ❌ Muito amplo
function setStatus(status: string) { }

// ✅ Restritivo - apenas valores válidos
function setStatus(status: "ativo" | "inativo" | "pendente") { }
```

### Ordenar Parâmetros por Obrigatoriedade

```typescript
// ✅ Ordem correta
function criar(
  nome: string,              // Obrigatório
  idade: number,             // Obrigatório
  email?: string,            // Opcional
  telefone?: string          // Opcional
) { }
```

## ⚠️ Armadilhas Comuns

### 1. Esquecer Anotação

```typescript
function somar(a, b) {  // a: any, b: any (perigoso!)
  return a + b;
}
```

**Solução:** Sempre anotar parâmetros.

### 2. Ordem Incorreta de Parâmetros

```typescript
// ❌ ERRO
function exemplo(opcional?: string, obrigatorio: number) { }

// ✅ OK
function exemplo(obrigatorio: number, opcional?: string) { }
```

### 3. Confundir Opcional com Nullable

```typescript
// ❌ Não é o mesmo
function processar(valor?: number) {
  // valor: number | undefined
}

function processar(valor: number | null) {
  // valor: number | null (deve ser passado explicitamente)
}
```

### 4. Type Assertion em Argumentos

```typescript
function processar(valor: string) { }

// ❌ Perigoso - bypassa type checking
processar(42 as any);

// ✅ Correto - converter antes
processar(String(42));
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Anotação de Retorno:** Completa contrato da função (entrada + saída)
- **Type Guards:** Refinar tipos de parâmetros union no corpo da função
- **Generics:** Parâmetros de tipo parametrizados
- **Function Types:** Tipos que descrevem assinaturas de função

**Progressão:**
Parâmetros tipados → Retorno tipado → Função totalmente tipada → Function types reutilizáveis

## 📚 Conclusão

**Anotação de tipo de parâmetros** é essencial para type safety em TypeScript: cada parâmetro deve ter tipo explícito, criando **contrato verificável** entre chamador e função. Diferente de variáveis (inferência possível), parâmetros **sempre requerem anotação** pois compilador não pode inferir argumentos futuros.

**Regras Fundamentais:**
1. **Sempre anotar** parâmetros de função
2. **Parâmetros obrigatórios antes de opcionais**
3. **Usar tipos restritivos** (literais, unions) quando possível
4. **Preferir valor padrão** quando comportamento padrão existe
5. **Validação automática** - TypeScript previne chamadas incorretas

**Parâmetros tipados = entrada garantida = função confiável = código robusto.**
