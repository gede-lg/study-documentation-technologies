# Required<T>: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`Required<T>`** é tipo utilitário built-in que **transforma todas as propriedades de tipo** `T` em **obrigatórias**, removendo modifier `?` opcional. Conceitualmente, representa **fortalecimento de obrigatoriedade**, inverso de `Partial<T>`, garantindo que objeto possui todas as propriedades definidas.

Na essência, `Required<T>` materializa o princípio de **completude estrutural**, onde você garante que nenhuma propriedade está ausente, ideal para validação de dados, transformação de tipos parciais em completos e garantias de configuração.

## 📋 Fundamentos

### Sintaxe e Comportamento

```typescript
// Tipo com propriedades opcionais
interface ConfigOpcional {
  host?: string;
  port?: number;
  timeout?: number;
  debug?: boolean;
}

// Required torna tudo obrigatório
type ConfigCompleta = Required<ConfigOpcional>;
// Equivale a:
// {
//   host: string;
//   port: number;
//   timeout: number;
//   debug: boolean;
// }

// Uso
const config1: ConfigCompleta = {
  host: "localhost",
  port: 3000,
  timeout: 5000,
  debug: true
}; // ✅ OK - todas as propriedades presentes

const config2: ConfigCompleta = {
  host: "localhost",
  port: 3000
  // ❌ Erro: faltam timeout e debug
};
```

**Conceito-chave:** `Required<T>` remove opcionality - todas as propriedades tornam-se obrigatórias.

### Implementação Interna

```typescript
// Definição real do Required (built-in TypeScript)
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Explicação:
// - [P in keyof T]: itera sobre todas as chaves de T
// - -?: remove o modifier opcional (oposto de ?)
// - T[P]: mantém o tipo original da propriedade
```

**Mecanismo:** Usa **mapped types** com **modifier removal** (`-?`) para forçar obrigatoriedade.

## 🔍 Análise Conceitual

### 1. Validação e Transformação

```typescript
interface FormularioParcial {
  nome?: string;
  email?: string;
  idade?: number;
  telefone?: string;
}

// Função que valida e retorna formulário completo
function validarFormulario(
  dados: FormularioParcial
): Required<FormularioParcial> | null {
  // Verificação: todas as propriedades presentes?
  if (dados.nome && dados.email && dados.idade && dados.telefone) {
    return dados as Required<FormularioParcial>;
  }
  return null;
}

// Uso
const parcial: FormularioParcial = { nome: "Ana", email: "ana@example.com" };
const completo = validarFormulario(parcial);

if (completo) {
  // Aqui temos certeza: todas propriedades estão presentes
  console.log(completo.nome.toUpperCase()); // ✅ Safe
  console.log(completo.idade + 1); // ✅ Safe
} else {
  console.log("Formulário incompleto");
}
```

**Conceito:** Required permite transformar tipo parcial em completo após validação.

### 2. Default Values + Required

```typescript
interface OpcoesAPI {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

const opcoesDefault: Required<OpcoesAPI> = {
  baseURL: "https://api.example.com",
  timeout: 5000,
  retries: 3,
  cache: true
};

// Merge: valores fornecidos sobrescrevem defaults
function criarCliente(opcoes: OpcoesAPI = {}): Required<OpcoesAPI> {
  return {
    ...opcoesDefault,
    ...opcoes
  };
}

// Uso
const cliente1 = criarCliente(); // Usa todos os defaults
const cliente2 = criarCliente({ timeout: 10000 }); // Override apenas timeout
const cliente3 = criarCliente({ baseURL: "https://outro.com", cache: false });

// Retorno sempre completo
console.log(cliente1.timeout); // ✅ 5000 (garantido)
console.log(cliente2.retries); // ✅ 3 (garantido)
```

### 3. Builder Pattern: Validação Final

```typescript
interface Produto {
  id?: number;
  nome?: string;
  preco?: number;
  estoque?: number;
}

class ProdutoBuilder {
  private produto: Produto = {};

  setId(id: number): this {
    this.produto.id = id;
    return this;
  }

  setNome(nome: string): this {
    this.produto.nome = nome;
    return this;
  }

  setPreco(preco: number): this {
    this.produto.preco = preco;
    return this;
  }

  setEstoque(estoque: number): this {
    this.produto.estoque = estoque;
    return this;
  }

  // Build retorna Required - garante completude
  build(): Required<Produto> {
    const { id, nome, preco, estoque } = this.produto;

    if (id === undefined || !nome || preco === undefined || estoque === undefined) {
      throw new Error("Produto incompleto - faltam propriedades obrigatórias");
    }

    return { id, nome, preco, estoque };
  }
}

// Uso
const produto = new ProdutoBuilder()
  .setId(1)
  .setNome("Notebook")
  .setPreco(2000)
  .setEstoque(10)
  .build(); // Retorna Required<Produto>

// produto.nome é garantido (não opcional)
console.log(produto.nome.toUpperCase()); // ✅ Safe
```

### 4. Type Guard com Required

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string; // Opcional
  endereco?: string; // Opcional
}

// Type guard: verifica se propriedades opcionais estão presentes
function temDadosCompletos(u: Usuario): u is Required<Usuario> {
  return u.telefone !== undefined && u.endereco !== undefined;
}

const usuario: Usuario = {
  id: 1,
  nome: "Ana",
  email: "ana@example.com",
  telefone: "123456789",
  endereco: "Rua A"
};

if (temDadosCompletos(usuario)) {
  // Aqui TypeScript sabe que telefone e endereco existem
  console.log(usuario.telefone.length); // ✅ OK
  console.log(usuario.endereco.toUpperCase()); // ✅ OK
} else {
  console.log("Dados incompletos");
}
```

### 5. Configurações: Partial → Required

```typescript
interface ConfigApp {
  tema?: "claro" | "escuro";
  idioma?: string;
  notificacoes?: boolean;
  autoSalvar?: boolean;
}

// Carregar configuração do usuário (parcial)
function carregarConfigUsuario(): ConfigApp {
  const saved = localStorage.getItem("config");
  return saved ? JSON.parse(saved) : {};
}

// Aplicar defaults e retornar completa
function obterConfigFinal(
  configUsuario: ConfigApp
): Required<ConfigApp> {
  const defaults: Required<ConfigApp> = {
    tema: "claro",
    idioma: "pt-BR",
    notificacoes: true,
    autoSalvar: true
  };

  return {
    ...defaults,
    ...configUsuario
  };
}

// Uso
const configParcial = carregarConfigUsuario(); // Partial
const configCompleta = obterConfigFinal(configParcial); // Required

// configCompleta.tema é garantido
if (configCompleta.tema === "escuro") {
  aplicarTemaEscuro();
}
```

## 🎯 Aplicabilidade

### APIs: Resposta Completa vs Parcial

```typescript
interface Tarefa {
  id?: number;
  titulo?: string;
  descricao?: string;
  concluida?: boolean;
}

// POST cria nova tarefa - dados parciais do cliente
async function criarTarefa(dados: Tarefa): Promise<Required<Tarefa>> {
  const id = gerarId();
  const tarefaCompleta: Required<Tarefa> = {
    id,
    titulo: dados.titulo || "Sem título",
    descricao: dados.descricao || "",
    concluida: dados.concluida ?? false
  };

  await salvarNoBanco(tarefaCompleta);
  return tarefaCompleta; // Resposta sempre completa
}

// Uso
const novaTarefa = await criarTarefa({ titulo: "Estudar TypeScript" });
console.log(novaTarefa.id); // ✅ Garantido
console.log(novaTarefa.concluida); // ✅ Garantido (false por default)
```

### Estado Global Inicializado

```typescript
interface EstadoApp {
  usuario?: Usuario | null;
  tema?: "claro" | "escuro";
  carregando?: boolean;
  erro?: string | null;
}

// Estado inicial: Required garante que tudo está definido
const estadoInicial: Required<EstadoApp> = {
  usuario: null,
  tema: "claro",
  carregando: false,
  erro: null
};

// Reducer sempre trabalha com estado completo
function reducer(
  state: Required<EstadoApp> = estadoInicial,
  action: any
): Required<EstadoApp> {
  // state.tema sempre existe
  // state.carregando sempre existe
  return state;
}
```

### Normalização de Dados Externos

```typescript
interface DadosAPI {
  name?: string;
  age?: number;
  email?: string;
}

interface DadosInternos {
  name: string;
  age: number;
  email: string;
}

// Função que normaliza dados da API
function normalizarDados(dados: DadosAPI): DadosInternos {
  // Validação + defaults
  const normalizado: Required<DadosAPI> = {
    name: dados.name || "Desconhecido",
    age: dados.age ?? 0,
    email: dados.email || "sem@email.com"
  };

  return normalizado; // Required<DadosAPI> é compatível com DadosInternos
}
```

## ⚠️ Considerações

### 1. Required é Shallow (Não Recursivo)

```typescript
interface Config {
  servidor?: {
    host?: string;
    port?: number;
  };
  debug?: boolean;
}

type ConfigRequired = Required<Config>;
// {
//   servidor: { host?: string; port?: number }; // ← Propriedades internas ainda opcionais!
//   debug: boolean;
// }

// Para required profundo, criar tipo customizado:
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

type ConfigDeepRequired = DeepRequired<Config>;
// {
//   servidor: { host: string; port: number }; // ← Agora obrigatórias!
//   debug: boolean;
// }
```

### 2. Combinar com Partial para Controle Granular

```typescript
interface Formulario {
  nome: string;
  email: string;
  telefone: string;
  observacoes: string;
}

// Tornar tudo opcional exceto nome e email
type FormularioParcial = Partial<Formulario> & Required<Pick<Formulario, "nome" | "email">>;

const form1: FormularioParcial = {
  nome: "Ana",
  email: "ana@example.com"
  // telefone e observacoes opcionais
}; // ✅ OK

const form2: FormularioParcial = {
  nome: "Bob"
  // ❌ Erro: falta email (obrigatório)
};
```

### 3. undefined vs null

```typescript
interface Dados {
  valor?: number;
}

type DadosRequired = Required<Dados>;
// { valor: number }

const d1: DadosRequired = { valor: 10 }; // ✅ OK
const d2: DadosRequired = { valor: undefined }; // ✅ OK! (propriedade existe, valor é undefined)
const d3: DadosRequired = { valor: null }; // ❌ Erro (se strictNullChecks)

// Required remove ?, mas não remove undefined do tipo union
// Se quer proibir undefined, use NonNullable:
type DadosNaoNulos = {
  [P in keyof Required<Dados>]: NonNullable<Required<Dados>[P]>
};
```

## 📚 Conclusão

`Required<T>` transforma todas as propriedades opcionais em obrigatórias, removendo modifier `?`. Inverso de `Partial<T>`. Ideal para validação de dados parciais, transformação após aplicar defaults, garantir completude em builders, normalizar dados externos e definir estado inicial completo. Usa mapped types com modifier removal (`-?`). Lembre-se: Required é shallow (apenas nível superior), não proíbe `undefined` como valor (apenas torna propriedade obrigatória), combine com `NonNullable` se necessário.
