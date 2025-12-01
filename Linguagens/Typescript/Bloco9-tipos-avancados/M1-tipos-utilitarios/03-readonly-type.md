# Readonly<T>: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`Readonly<T>`** é tipo utilitário built-in que **transforma todas as propriedades de tipo** `T` em **readonly** (somente leitura), impedindo reatribuição após inicialização. Conceitualmente, representa **imutabilidade estrutural em nível de tipo**, onde compilador garante que propriedades não serão modificadas, ideal para dados que não devem mudar após criação.

Na essência, `Readonly<T>` materializa o princípio de **imutabilidade por contrato**, onde sistema de tipos impede mutações acidentais, criando objetos "congelados" conceitualmente, melhorando previsibilidade e segurança.

## 📋 Fundamentos

### Sintaxe e Comportamento

```typescript
// Tipo original mutável
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

// Readonly torna tudo imutável
type UsuarioReadonly = Readonly<Usuario>;
// Equivale a:
// {
//   readonly id: number;
//   readonly nome: string;
//   readonly email: string;
// }

// Uso
const usuario: UsuarioReadonly = {
  id: 1,
  nome: "Ana",
  email: "ana@example.com"
};

console.log(usuario.nome); // ✅ Leitura OK

usuario.nome = "Novo Nome"; // ❌ Erro: readonly property
usuario.email = "outro@example.com"; // ❌ Erro: readonly property
```

**Conceito-chave:** `Readonly<T>` adiciona modifier `readonly` em todas as propriedades - leitura permitida, escrita proibida.

### Implementação Interna

```typescript
// Definição real do Readonly (built-in TypeScript)
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Explicação:
// - readonly: modifier que impede reatribuição
// - [P in keyof T]: itera sobre todas as chaves de T
// - T[P]: mantém o tipo original da propriedade
```

**Mecanismo:** Usa **mapped types** para adicionar modifier `readonly` em cada propriedade.

## 🔍 Análise Conceitual

### 1. Dados Imutáveis

```typescript
interface Configuracao {
  apiKey: string;
  ambiente: "dev" | "prod";
  versao: string;
}

// Configuração carregada uma vez, nunca muda
const config: Readonly<Configuracao> = {
  apiKey: "abc123",
  ambiente: "prod",
  versao: "1.0.0"
};

// Uso seguro
console.log(config.ambiente); // ✅ "prod"

// Tentativa de modificação bloqueada em tempo de compilação
config.apiKey = "nova-key"; // ❌ Erro: Cannot assign to 'apiKey'
config.versao = "2.0.0"; // ❌ Erro: Cannot assign to 'versao'
```

**Conceito:** Readonly garante que dados não serão acidentalmente modificados após criação.

### 2. Parâmetros de Função: Garantia de Não-Mutação

```typescript
interface Produto {
  id: number;
  nome: string;
  preco: number;
}

// Função promete não modificar produto recebido
function calcularDesconto(produto: Readonly<Produto>, percentual: number): number {
  // produto.preco = produto.preco * (1 - percentual); // ❌ Erro: readonly

  // ✅ Apenas leitura
  return produto.preco * (1 - percentual);
}

const produto: Produto = {
  id: 1,
  nome: "Notebook",
  preco: 2000
};

const precoComDesconto = calcularDesconto(produto, 0.1);

// produto permanece intacto
console.log(produto.preco); // 2000 (original)
console.log(precoComDesconto); // 1800 (calculado)
```

**Conceito:** Readonly em parâmetros documenta e garante que função não tem side effects no argumento.

### 3. Estado Imutável (Redux/State Management)

```typescript
interface AppState {
  usuario: Usuario | null;
  tema: "claro" | "escuro";
  contador: number;
}

// Estado sempre imutável
function reducer(
  state: Readonly<AppState>,
  action: Action
): AppState {
  // state.contador++; // ❌ Erro: readonly

  // ✅ Criar novo estado
  switch (action.type) {
    case "INCREMENTAR":
      return {
        ...state,
        contador: state.contador + 1
      };

    case "ALTERAR_TEMA":
      return {
        ...state,
        tema: action.payload
      };

    default:
      return state;
  }
}
```

**Conceito:** Readonly força padrão imutável - toda mudança cria novo objeto.

### 4. Valores Constantes

```typescript
interface ConstantesApp {
  MAX_TENTATIVAS: number;
  TIMEOUT_PADRAO: number;
  API_BASE_URL: string;
}

const CONSTANTES: Readonly<ConstantesApp> = {
  MAX_TENTATIVAS: 3,
  TIMEOUT_PADRAO: 5000,
  API_BASE_URL: "https://api.example.com"
};

// Uso
if (tentativas > CONSTANTES.MAX_TENTATIVAS) {
  throw new Error("Limite excedido");
}

// CONSTANTES.MAX_TENTATIVAS = 5; // ❌ Erro: readonly
```

### 5. Readonly em Arrays

```typescript
// Array readonly - não pode adicionar/remover/modificar
const numeros: readonly number[] = [1, 2, 3, 4, 5];

console.log(numeros[0]); // ✅ Leitura OK
console.log(numeros.length); // ✅ OK

numeros.push(6); // ❌ Erro: push não existe em readonly array
numeros.pop(); // ❌ Erro: pop não existe
numeros[0] = 10; // ❌ Erro: index assignment não permitido

// Métodos não-mutantes funcionam
const dobrados = numeros.map(n => n * 2); // ✅ OK
const pares = numeros.filter(n => n % 2 === 0); // ✅ OK

// Alternativa: usar tipo utilitário ReadonlyArray<T>
const letras: ReadonlyArray<string> = ["a", "b", "c"];
// letras.push("d"); // ❌ Erro
```

## 🎯 Aplicabilidade

### Funções Puras: Garantia de Imutabilidade

```typescript
interface Pessoa {
  nome: string;
  idade: number;
}

// ❌ Função impura - pode modificar argumento
function envelhecer(pessoa: Pessoa): Pessoa {
  pessoa.idade++; // Mutação!
  return pessoa;
}

// ✅ Função pura - readonly impede mutação
function envelhecerPuro(pessoa: Readonly<Pessoa>): Pessoa {
  // pessoa.idade++; // ❌ Erro: readonly

  return {
    ...pessoa,
    idade: pessoa.idade + 1
  };
}

const ana = { nome: "Ana", idade: 25 };
const anaVelha = envelhecerPuro(ana);

console.log(ana.idade); // 25 (original intacto)
console.log(anaVelha.idade); // 26 (novo objeto)
```

### Cache e Memoização

```typescript
interface ResultadoCache {
  chave: string;
  valor: any;
  timestamp: number;
}

class Cache {
  private dados: Map<string, Readonly<ResultadoCache>> = new Map();

  set(chave: string, valor: any): void {
    const resultado: Readonly<ResultadoCache> = {
      chave,
      valor,
      timestamp: Date.now()
    };

    this.dados.set(chave, resultado);
  }

  get(chave: string): Readonly<ResultadoCache> | undefined {
    return this.dados.get(chave);
  }
}

// Uso
const cache = new Cache();
cache.set("user:1", { nome: "Ana" });

const cached = cache.get("user:1");
if (cached) {
  console.log(cached.valor); // ✅ Leitura OK
  // cached.valor = { nome: "Bob" }; // ❌ Erro: readonly
}
```

### Configuração Injetada

```typescript
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

class DatabaseService {
  constructor(private config: Readonly<DatabaseConfig>) {}

  connect(): void {
    // this.config.host = "outro-host"; // ❌ Erro: readonly

    // ✅ Apenas usa configuração
    console.log(`Conectando a ${this.config.host}:${this.config.port}`);
  }
}

const dbConfig: Readonly<DatabaseConfig> = {
  host: "localhost",
  port: 5432,
  database: "mydb",
  user: "admin",
  password: "secret"
};

const dbService = new DatabaseService(dbConfig);
```

### Dados de Resposta de API

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: number;
}

async function fetchUsuario(id: number): Promise<Readonly<ApiResponse<Usuario>>> {
  const response = await fetch(`/api/usuarios/${id}`);
  const data = await response.json();

  return {
    data,
    status: response.status,
    timestamp: Date.now()
  };
}

// Uso
const resposta = await fetchUsuario(1);
console.log(resposta.data); // ✅ OK
// resposta.status = 500; // ❌ Erro: readonly
```

## ⚠️ Considerações

### 1. Readonly é Shallow (Não Recursivo)

```typescript
interface Config {
  servidor: {
    host: string;
    port: number;
  };
  debug: boolean;
}

const config: Readonly<Config> = {
  servidor: { host: "localhost", port: 3000 },
  debug: false
};

config.debug = true; // ❌ Erro: readonly no nível superior
config.servidor = { host: "outro", port: 8080 }; // ❌ Erro: readonly

// Mas propriedades aninhadas NÃO são readonly!
config.servidor.host = "outro-host"; // ✅ Permitido! (problema)
config.servidor.port = 8080; // ✅ Permitido!

// Solução: Deep Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

const configProfundo: DeepReadonly<Config> = {
  servidor: { host: "localhost", port: 3000 },
  debug: false
};

configProfundo.servidor.host = "outro"; // ❌ Erro: readonly profundo
```

### 2. Readonly em Runtime vs Compile Time

```typescript
const obj: Readonly<{ valor: number }> = { valor: 10 };

obj.valor = 20; // ❌ Erro em COMPILE time

// Mas em runtime, JavaScript não tem readonly:
(obj as any).valor = 20; // ✅ Funciona em runtime (type assertion)
console.log(obj.valor); // 20

// Para verdadeiro readonly em runtime, use Object.freeze:
const objCongelado = Object.freeze({ valor: 10 });
objCongelado.valor = 20; // Silenciosamente falha (ou erro em strict mode)
console.log(objCongelado.valor); // 10
```

### 3. Combinar Readonly com Outros Utilitários

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

// Readonly + Pick: apenas alguns campos readonly
type UsuarioPublico = Readonly<Pick<Usuario, "id" | "nome">>;

const publico: UsuarioPublico = { id: 1, nome: "Ana" };
// publico.nome = "Bob"; // ❌ Erro: readonly

// Readonly + Partial: todos opcionais E readonly
type ConfigOpcionalImutavel = Readonly<Partial<Config>>;

const c: ConfigOpcionalImutavel = { debug: true };
// c.debug = false; // ❌ Erro: readonly
```

### 4. as const para Literais

```typescript
// Sem as const
const config1 = {
  host: "localhost",
  port: 3000
};
// Tipo: { host: string; port: number } - mutável

config1.host = "outro"; // ✅ OK

// Com as const
const config2 = {
  host: "localhost",
  port: 3000
} as const;
// Tipo: { readonly host: "localhost"; readonly port: 3000 } - readonly + literal

config2.host = "outro"; // ❌ Erro: readonly
config2.port = 8080; // ❌ Erro: readonly

// Array com as const
const numeros1 = [1, 2, 3]; // number[]
numeros1.push(4); // ✅ OK

const numeros2 = [1, 2, 3] as const; // readonly [1, 2, 3]
// numeros2.push(4); // ❌ Erro: readonly
```

## 📚 Conclusão

`Readonly<T>` transforma todas as propriedades em readonly (somente leitura), impedindo reatribuição em compile time. Ideal para dados imutáveis, parâmetros que não devem ser modificados, estado em state management, constantes e cache. Usa mapped types com modifier `readonly`. Lembre-se: Readonly é shallow (apenas nível superior), proteção é apenas em compile time (runtime não), combine com `Object.freeze()` para imutabilidade real, use `as const` para literais readonly.
