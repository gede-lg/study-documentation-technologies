# Optional Properties no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Optional properties** (propriedades opcionais) são propriedades de objetos que podem existir ou não, marcadas com o operador `?` após o nome da propriedade. Conceitualmente, representam campos que não são obrigatórios na estrutura do objeto, permitindo flexibilidade na modelagem de dados onde certos campos são condicionais ou contextuais.

Na essência, propriedades opcionais transformam o tipo de uma propriedade de `T` para `T | undefined`, indicando que o valor pode ser do tipo especificado ou pode não existir. É a manifestação do conceito de "campos facultativos" em estruturas de dados tipadas.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
interface Usuario {
  nome: string;        // Obrigatório
  email: string;       // Obrigatório
  telefone?: string;   // Opcional - pode existir ou não
  idade?: number;      // Opcional
}

// Válido - propriedades opcionais podem ser omitidas
const user1: Usuario = {
  nome: "Ana",
  email: "ana@example.com"
};

// Válido - propriedades opcionais podem ser incluídas
const user2: Usuario = {
  nome: "Bruno",
  email: "bruno@example.com",
  telefone: "(11) 98765-4321",
  idade: 30
};
```

### Como Funciona Internamente

Propriedade opcional `telefone?: string` é equivalente a `telefone: string | undefined`:

```typescript
// Estas duas formas são equivalentes
interface Exemplo1 {
  opcional?: string;
}

interface Exemplo2 {
  opcional: string | undefined;
}
```

**Diferença sutil:** `?` permite omitir completamente a propriedade; `| undefined` requer incluir a propriedade com valor `undefined`.

```typescript
const obj1: { prop?: string } = {};                    // OK
const obj2: { prop: string | undefined } = {};         // Erro - prop é obrigatória
const obj3: { prop: string | undefined } = { prop: undefined }; // OK
```

## 🔍 Casos de Uso

### 1. Configurações Opcionais

```typescript
interface ConfigAPI {
  url: string;          // Sempre necessário
  timeout?: number;     // Opcional - usa padrão se não fornecido
  retryAttempts?: number;
  enableLogging?: boolean;
}

const config: ConfigAPI = {
  url: "https://api.example.com"
  // Outras propriedades usam valores padrão
};
```

### 2. Dados Parciais de Formulários

```typescript
interface FormularioCadastro {
  nome: string;
  email: string;
  telefone?: string;           // Telefone opcional
  complementoEndereco?: string; // Complemento opcional
}
```

### 3. Resposta de API com Campos Condicionais

```typescript
interface APIResponse {
  sucesso: boolean;
  dados: any;
  erro?: string;        // Só existe se sucesso === false
  timestamp?: number;   // Incluído apenas em modo debug
}

const resposta1: APIResponse = {
  sucesso: true,
  dados: { id: 1 }
  // erro não existe pois sucesso é true
};

const resposta2: APIResponse = {
  sucesso: false,
  dados: null,
  erro: "Usuário não encontrado"
};
```

### 4. Objetos com Propriedades Calculadas

```typescript
interface Produto {
  id: number;
  nome: string;
  preco: number;
  desconto?: number;     // Nem todos produtos têm desconto
  precoFinal?: number;   // Calculado apenas se desconto existe
}
```

## 🎯 Type Safety com Opcionais

### Narrowing de Tipo

```typescript
interface Usuario {
  nome: string;
  telefone?: string;
}

function enviarSMS(usuario: Usuario) {
  // Erro: Object is possibly 'undefined'
  // console.log(usuario.telefone.length);

  // ✅ Correto - verificar antes
  if (usuario.telefone) {
    console.log(usuario.telefone.length); // TypeScript sabe que telefone existe aqui
  }

  // ✅ Optional chaining
  console.log(usuario.telefone?.length);

  // ✅ Nullish coalescing
  const tel = usuario.telefone ?? "Não informado";
}
```

### Valores Padrão

```typescript
interface Config {
  timeout?: number;
}

function processar(config: Config) {
  const timeout = config.timeout ?? 5000; // Padrão se undefined
  console.log(`Timeout: ${timeout}ms`);
}
```

## ⚠️ Diferença: Optional vs Union com Undefined

```typescript
// Optional property - pode omitir
interface A {
  prop?: string;
}
const a1: A = {};                // OK
const a2: A = { prop: "valor" }; // OK
const a3: A = { prop: undefined }; // OK

// Union com undefined - propriedade obrigatória, valor pode ser undefined
interface B {
  prop: string | undefined;
}
const b1: B = {};                // Erro - propriedade obrigatória
const b2: B = { prop: "valor" }; // OK
const b3: B = { prop: undefined }; // OK - explicitamente undefined
```

## 📚 Conclusão

Optional properties são essenciais para modelar dados onde certos campos não são sempre necessários. Permitem:

- Flexibilidade em estruturas de dados
- Modelagem precisa de APIs e formulários
- Type safety com verificações adequadas
- Código mais limpo sem propriedades desnecessárias

Dominar propriedades opcionais é entender como representar dados parciais ou condicionais de forma type-safe em TypeScript.
