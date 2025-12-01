# Readonly Properties no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Readonly properties** (propriedades somente leitura) são propriedades marcadas com o modificador `readonly` que só podem ser atribuídas durante a inicialização do objeto e não podem ser modificadas posteriormente. Conceitualmente, representam o princípio de **imutabilidade** aplicado a propriedades específicas de objetos, garantindo que certos valores permaneçam constantes após a criação.

Na essência, `readonly` transforma propriedades em **valores imutáveis**, prevenindo modificações acidentais e tornando o código mais previsível e seguro. É a materialização do conceito de "escrita uma vez, leitura muitas" (write-once, read-many).

## 📋 Fundamentos

### Sintaxe Básica

```typescript
interface Pessoa {
  readonly id: number;      // Não pode ser modificado
  readonly cpf: string;     // Não pode ser modificado
  nome: string;             // Pode ser modificado
  idade: number;            // Pode ser modificado
}

const pessoa: Pessoa = {
  id: 1,
  cpf: "123.456.789-00",
  nome: "João",
  idade: 30
};

// OK - leitura permitida
console.log(pessoa.id);

// OK - modificação de propriedades não-readonly
pessoa.nome = "João Silva";
pessoa.idade = 31;

// Erro - tentativa de modificação de readonly
// pessoa.id = 2; // Cannot assign to 'id' because it is a read-only property
// pessoa.cpf = "999.999.999-99"; // Erro
```

### Readonly em Type Aliases

```typescript
type Configuracao = {
  readonly apiUrl: string;
  readonly apiKey: string;
  timeout: number;
};

const config: Configuracao = {
  apiUrl: "https://api.example.com",
  apiKey: "secret-key-123",
  timeout: 5000
};

config.timeout = 10000; // OK
// config.apiUrl = "https://other.com"; // Erro - readonly
```

## 🔍 Casos de Uso

### 1. Identificadores Únicos

```typescript
interface Usuario {
  readonly id: number;           // ID nunca muda
  readonly dataCriacao: Date;    // Data de criação imutável
  nome: string;
  email: string;
}

const usuario: Usuario = {
  id: 1,
  dataCriacao: new Date(),
  nome: "Ana",
  email: "ana@example.com"
};

// usuario.id = 2; // Erro - ID é imutável
usuario.nome = "Ana Silva"; // OK - nome pode mudar
```

### 2. Constantes de Configuração

```typescript
interface DatabaseConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  poolSize: number; // Pode ser ajustado
}

const dbConfig: DatabaseConfig = {
  host: "localhost",
  port: 5432,
  database: "myapp",
  username: "admin",
  poolSize: 10
};

dbConfig.poolSize = 20; // OK - ajuste permitido
// dbConfig.host = "192.168.1.1"; // Erro - host é readonly
```

### 3. Dados Imutáveis de Domínio

```typescript
interface Transacao {
  readonly id: string;
  readonly tipo: "credito" | "debito";
  readonly valor: number;
  readonly data: Date;
  descricao: string; // Pode ser atualizada
}
```

## 🎯 Readonly vs Const

**Diferença fundamental:**

```typescript
// const - variável não pode ser reatribuída
const obj = { valor: 10 };
obj.valor = 20; // OK - const protege a variável, não o objeto

// readonly - propriedade não pode ser modificada
const obj2: { readonly valor: number } = { valor: 10 };
// obj2.valor = 20; // Erro - propriedade é readonly
```

**Combinação:**

```typescript
const config: {
  readonly apiUrl: string;
} = {
  apiUrl: "https://api.example.com"
};

// config = { apiUrl: "outro" };      // Erro - const impede reatribuição
// config.apiUrl = "outro";           // Erro - readonly impede modificação
```

## 🔧 Readonly Utility Type

TypeScript fornece `Readonly<T>` para tornar todas as propriedades readonly:

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

// Todas as propriedades se tornam readonly
type UsuarioReadonly = Readonly<Usuario>;

const user: UsuarioReadonly = {
  id: 1,
  nome: "João",
  email: "joao@example.com"
};

// user.nome = "Pedro"; // Erro - todas propriedades são readonly
```

### Readonly em Arrays

```typescript
// Array readonly
const numeros: readonly number[] = [1, 2, 3, 4, 5];

console.log(numeros[0]); // OK - leitura permitida
// numeros[0] = 10;      // Erro - não pode modificar
// numeros.push(6);      // Erro - métodos mutantes não disponíveis

// ReadonlyArray<T>
const frutas: ReadonlyArray<string> = ["maçã", "banana"];
// frutas.push("laranja"); // Erro
```

## ⚠️ Limitações

### Readonly é Superficial (Shallow)

```typescript
interface Obj {
  readonly config: {
    timeout: number;
  };
}

const obj: Obj = {
  config: { timeout: 5000 }
};

// obj.config = { timeout: 10000 }; // Erro - config é readonly

// Mas propriedades aninhadas NÃO são readonly!
obj.config.timeout = 10000; // OK - readonly não é profundo
```

**Solução para readonly profundo:**

```typescript
interface ObjDeep {
  readonly config: {
    readonly timeout: number;
  };
}

const obj2: ObjDeep = {
  config: { timeout: 5000 }
};

// obj2.config.timeout = 10000; // Erro - agora timeout também é readonly
```

### Readonly em Tempo de Compilação

```typescript
const obj: { readonly valor: number } = { valor: 10 };

// TypeScript previne em compile time
// obj.valor = 20; // Erro TS

// Mas em JavaScript runtime, nada impede:
(obj as any).valor = 20; // Funciona - readonly é apenas compile time
console.log(obj.valor); // 20
```

**Conceito:** `readonly` é verificação de tipo do TypeScript, não é imutabilidade de JavaScript runtime. Para imutabilidade real, use `Object.freeze()`.

## 📚 Conclusão

Readonly properties são essenciais para garantir imutabilidade em nível de tipo, prevenindo modificações acidentais de valores que devem permanecer constantes. São fundamentais para:

- Proteger identificadores e valores críticos
- Documentar intenção de imutabilidade
- Prevenir bugs de modificação acidental
- Facilitar raciocínio sobre código (valores não mudam)

Dominar readonly é entender como aplicar princípios de programação funcional e imutabilidade em TypeScript de forma type-safe.
