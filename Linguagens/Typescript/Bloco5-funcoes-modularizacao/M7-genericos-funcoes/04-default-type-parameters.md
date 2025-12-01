# Default Type Parameters: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Default type parameters** (parâmetros de tipo padrão) permitem especificar **tipo padrão** para parâmetro genérico usando sintaxe `<T = TipoPadrão>`, que é usado quando tipo não é explicitamente fornecido nem pode ser inferido. Conceitualmente, representam **valores padrão para metaprogramação de tipos**, similar a parâmetros padrão em funções.

Na essência, default type parameters materializam o princípio de **configuração por convenção**, onde comportamento padrão razoável é fornecido mas pode ser sobrescrito quando necessário.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Sem default - T deve ser especificado ou inferido
function criar<T>(valor?: T): T | undefined {
  return valor;
}

criar<number>(42);  // OK
criar<string>();    // OK - undefined
// criar();         // Erro - T desconhecido

// Com default - T padrão é string
function criarComDefault<T = string>(valor?: T): T | undefined {
  return valor;
}

criarComDefault<number>(42);  // T = number
criarComDefault("hello");     // T = string (inferido)
criarComDefault();            // T = string (default)
```

### Problema que Resolve

```typescript
// Biblioteca com comportamento comum mas customizável
interface Opcoes<T = any> {
  dados?: T;
  timeout?: number;
}

// Usuário pode especificar tipo
const opcoes1: Opcoes<{ nome: string }> = {
  dados: { nome: "Ana" }
};

// Ou usar default (any)
const opcoes2: Opcoes = {
  dados: 42 // OK - any aceita qualquer coisa
};
```

## 🔍 Análise Conceitual

### 1. Default com Constraints

```typescript
// Default deve satisfazer constraint
function processar<T extends object = {}>(obj: T): T {
  return { ...obj };
}

processar({ nome: "Ana" });  // T = { nome: string }
processar();                  // T = {} (default)
// processar(42);             // Erro - number não é object
```

**Conceito:** Default type parameter `{}` satisfaz constraint `extends object`, provendo tipo vazio como padrão seguro.

### 2. Múltiplos Defaults

```typescript
// Múltiplos parâmetros com defaults
function transformar<T = string, U = number>(
  valor: T,
  fn?: (x: T) => U
): U | undefined {
  return fn ? fn(valor) : undefined;
}

transformar("42", s => parseInt(s));  // T=string, U=number (inferido)
transformar<string, boolean>("yes", s => s === "yes"); // Explícito
transformar("hello");                 // T=string, U=number (defaults)
```

### 3. Default Dependente de Outro Parâmetro

```typescript
// U padrão depende de T
function emparelhar<T, U = T>(primeiro: T, segundo?: U): [T, U] {
  return [primeiro, (segundo ?? primeiro) as U];
}

emparelhar(42, 100);    // [number, number] - U inferido
emparelhar(42);         // [number, number] - U default é T
emparelhar<number, string>(42, "texto"); // [number, string]
```

**Conceito:** Default type parameter pode referenciar outros parâmetros genéricos declarados anteriormente.

### 4. Default em Classes

```typescript
class Repositorio<T = any> {
  private items: T[] = [];

  adicionar(item: T): void {
    this.items.push(item);
  }

  listar(): T[] {
    return this.items;
  }
}

// Com tipo específico
const repoNumeros = new Repositorio<number>();
repoNumeros.adicionar(42); // OK
// repoNumeros.adicionar("42"); // Erro

// Usando default (any)
const repoGenerico = new Repositorio();
repoGenerico.adicionar(42);      // OK
repoGenerico.adicionar("hello"); // OK - any aceita tudo
```

### 5. Default em Type Aliases

```typescript
type Resposta<T = unknown> = {
  sucesso: boolean;
  dados: T;
  mensagem?: string;
};

const resposta1: Resposta<number> = {
  sucesso: true,
  dados: 42
};

const resposta2: Resposta = {
  sucesso: false,
  dados: "qualquer coisa" // unknown aceita, mas precisa type guard
};
```

## 🎯 Aplicabilidade

### API com Configuração Flexível

```typescript
interface Config<T = Record<string, any>> {
  metadados: T;
  versao: string;
}

function inicializar<T = Record<string, any>>(config: Config<T>): void {
  console.log(config.metadados);
}

// Tipo específico
inicializar<{ autor: string }>({
  metadados: { autor: "Ana" },
  versao: "1.0"
});

// Default
inicializar({
  metadados: { qualquer: "coisa" },
  versao: "1.0"
});
```

### Promise com Default

```typescript
function buscar<T = any>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}

// Tipo específico
interface Usuario { nome: string; }
buscar<Usuario>("/api/usuario").then(u => console.log(u.nome));

// Default any
buscar("/api/dados").then(dados => console.log(dados)); // any
```

### Factory Pattern

```typescript
class Factory<T = object> {
  criar(props: Partial<T>): T {
    return { ...props } as T;
  }
}

interface Produto { nome: string; preco: number; }

const produtoFactory = new Factory<Produto>();
produtoFactory.criar({ nome: "Item" }); // Produto

const genericFactory = new Factory();
genericFactory.criar({ qualquer: "prop" }); // object
```

## ⚠️ Limitações

### 1. Default Não Sobrescreve Inferência

```typescript
function processar<T = string>(valor: T): T {
  return valor;
}

processar(42); // T = number (inferido), NÃO string (default)
```

**Conceito:** Default só é usado quando tipo não pode ser inferido E não é explicitamente fornecido.

### 2. Ordem Importa

```typescript
// ✅ Correto - defaults no final
function fn1<T, U = string>(a: T, b?: U) {}

// ❌ Erro - default não pode vir antes de não-default
// function fn2<T = string, U>(a: T, b: U) {}

// ✅ Correto - todos têm default
function fn3<T = number, U = string>(a?: T, b?: U) {}
```

### 3. Default Deve Satisfazer Constraints

```typescript
// ✅ Correto - string satisfaz extends string | number
function processar<T extends string | number = string>(valor: T): T {
  return valor;
}

// ❌ Erro - boolean não satisfaz extends string | number
// function errado<T extends string | number = boolean>(valor: T): T {}
```

## 🔗 Interconexões Conceituais

- **Parâmetros Opcionais**: Conceito similar aplicado a valores
- **Type Inference**: Default usado quando inferência falha
- **Constraints**: Default deve satisfazer constraints do parâmetro
- **Utility Types**: Muitos utility types usam defaults (`Partial<T>`, `Record<K, V>`)

## 📚 Conclusão

Default type parameters fornecem valores padrão para genéricos quando tipo não é especificado nem inferido. São essenciais para criar APIs flexíveis que funcionam "out of the box" mas permitem customização quando necessária, equilibrando conveniência com precisão de tipos.
