# Pick<T, K> e Omit<T, K>: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`Pick<T, K>`** e **`Omit<T, K>`** são tipos utilitários built-in complementares que **selecionam subconjunto de propriedades** de tipo existente. `Pick` **inclui apenas** propriedades especificadas em `K`, enquanto `Omit` **exclui** propriedades em `K`. Conceitualmente, representam **projeção** (Pick) e **filtragem inversa** (Omit), criando tipos derivados focados.

Na essência, materializam o princípio de **composição seletiva de tipos**, permitindo reutilizar estruturas existentes extraindo apenas partes relevantes ou removendo campos sensíveis/desnecessários.

## 📋 Fundamentos

### Pick<T, K>

```typescript
// Pick: seleciona apenas propriedades especificadas
interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  dataNascimento: Date;
}

// Selecionar apenas id e nome
type UsuarioBasico = Pick<Usuario, "id" | "nome">;
// Equivale a:
// {
//   id: number;
//   nome: string;
// }

const user: UsuarioBasico = {
  id: 1,
  nome: "Ana"
  // Apenas esses campos são permitidos
};
```

### Omit<T, K>

```typescript
// Omit: remove propriedades especificadas
type UsuarioPublico = Omit<Usuario, "senha" | "dataNascimento">;
// Equivale a:
// {
//   id: number;
//   nome: string;
//   email: string;
// }

const publicUser: UsuarioPublico = {
  id: 1,
  nome: "Ana",
  email: "ana@example.com"
  // senha e dataNascimento não são permitidos
};
```

**Conceito-chave:** Pick **inclui**, Omit **exclui**.

### Implementação Interna

```typescript
// Pick (built-in)
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit (built-in)
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Explicação:
// Pick: itera apenas sobre chaves em K
// Omit: usa Exclude para remover K de keyof T, depois aplica Pick
```

## 🔍 Análise Conceitual

### 1. DTOs (Data Transfer Objects)

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: "admin" | "user";
  criadoEm: Date;
  atualizadoEm: Date;
}

// DTO para criação: sem id, criadoEm, atualizadoEm (gerados pelo servidor)
type CriarUsuarioDTO = Omit<Usuario, "id" | "criadoEm" | "atualizadoEm">;

// DTO público: sem senha
type UsuarioPublicoDTO = Omit<Usuario, "senha">;

// DTO resumido: apenas essencial
type UsuarioResumoDTO = Pick<Usuario, "id" | "nome" | "email">;

// Uso
async function criarUsuario(dados: CriarUsuarioDTO): Promise<UsuarioPublicoDTO> {
  const usuario: Usuario = {
    ...dados,
    id: gerarId(),
    criadoEm: new Date(),
    atualizadoEm: new Date()
  };

  await salvar(usuario);

  // Retorna sem senha
  const { senha, ...publico } = usuario;
  return publico;
}
```

### 2. Formulários e Atualizações

```typescript
interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  ativo: boolean;
}

// Formulário de criação: sem id (gerado automaticamente)
type FormCriarProduto = Omit<Produto, "id">;

// Formulário de edição: pode atualizar tudo exceto id
type FormEditarProduto = Omit<Produto, "id">;

// Ou: apenas alguns campos editáveis
type FormEditarProdutoLimitado = Pick<Produto, "nome" | "preco" | "estoque">;

function editarProduto(
  id: number,
  dados: FormEditarProdutoLimitado
): Produto {
  const produtoAtual = buscarProduto(id);

  return {
    ...produtoAtual,
    ...dados
  };
}
```

### 3. APIs: Request vs Response

```typescript
interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  autorId: number;
  publicado: boolean;
  criadoEm: Date;
  visualizacoes: number;
}

// Request de criação: cliente não envia id, criadoEm, visualizacoes
type CriarPostRequest = Omit<Post, "id" | "criadoEm" | "visualizacoes">;

// Response pública: inclui tudo
type PostResponse = Post;

// Request de atualização: apenas campos editáveis
type AtualizarPostRequest = Pick<Post, "titulo" | "conteudo" | "publicado">;

// API
async function criarPost(req: CriarPostRequest): Promise<PostResponse> {
  const post: Post = {
    ...req,
    id: gerarId(),
    criadoEm: new Date(),
    visualizacoes: 0
  };

  await salvar(post);
  return post;
}
```

### 4. Composição de Tipos

```typescript
interface Pessoa {
  nome: string;
  idade: number;
  cpf: string;
  email: string;
  telefone: string;
}

// Dados essenciais
type DadosEssenciais = Pick<Pessoa, "nome" | "cpf">;

// Dados de contato
type DadosContato = Pick<Pessoa, "email" | "telefone">;

// Pessoa sem documento (para menor de idade)
type PessoaSemCPF = Omit<Pessoa, "cpf">;

// Combinar: dados essenciais + contato + idade
type CadastroCurso = DadosEssenciais & DadosContato & Pick<Pessoa, "idade">;
// Equivale a: { nome, cpf, email, telefone, idade }
```

### 5. Versionamento de Tipos

```typescript
interface UsuarioV1 {
  id: number;
  username: string;
  password: string;
}

// V2: adiciona email, remove password exposto
interface UsuarioV2 extends Omit<UsuarioV1, "password"> {
  email: string;
  passwordHash: string;
}

// V3: adiciona perfil completo
interface UsuarioV3 extends UsuarioV2 {
  nome: string;
  avatar?: string;
  bio?: string;
}
```

## 🎯 Aplicabilidade

### Segurança: Remover Dados Sensíveis

```typescript
interface UsuarioCompleto {
  id: number;
  nome: string;
  email: string;
  senha: string;
  token: string;
  cartaoCredito?: string;
}

// Remove todos os dados sensíveis
type UsuarioSeguro = Omit<UsuarioCompleto, "senha" | "token" | "cartaoCredito">;

function enviarParaCliente(usuario: UsuarioCompleto): UsuarioSeguro {
  const { senha, token, cartaoCredito, ...seguro } = usuario;
  return seguro;
}
```

### Formulários Multi-Step

```typescript
interface CadastroCompleto {
  // Passo 1: Dados pessoais
  nome: string;
  email: string;
  telefone: string;

  // Passo 2: Endereço
  rua: string;
  numero: string;
  cidade: string;
  estado: string;

  // Passo 3: Preferências
  newsletter: boolean;
  notificacoes: boolean;
}

type Passo1 = Pick<CadastroCompleto, "nome" | "email" | "telefone">;
type Passo2 = Pick<CadastroCompleto, "rua" | "numero" | "cidade" | "estado">;
type Passo3 = Pick<CadastroCompleto, "newsletter" | "notificacoes">;

class FormularioCadastro {
  private passo1?: Passo1;
  private passo2?: Passo2;
  private passo3?: Passo3;

  salvarPasso1(dados: Passo1): void {
    this.passo1 = dados;
  }

  salvarPasso2(dados: Passo2): void {
    this.passo2 = dados;
  }

  salvarPasso3(dados: Passo3): void {
    this.passo3 = dados;
  }

  finalizar(): CadastroCompleto | null {
    if (!this.passo1 || !this.passo2 || !this.passo3) {
      return null;
    }

    return {
      ...this.passo1,
      ...this.passo2,
      ...this.passo3
    };
  }
}
```

### Testes: Mock Parcial

```typescript
interface ConfigCompleta {
  apiUrl: string;
  timeout: number;
  retries: number;
  cache: boolean;
  logLevel: "debug" | "info" | "error";
}

// Para testes, só precisa de alguns campos
type ConfigTeste = Pick<ConfigCompleta, "apiUrl" | "timeout">;

const configMock: ConfigTeste = {
  apiUrl: "http://localhost:3000",
  timeout: 1000
};
```

### Estado de Carregamento

```typescript
interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  concluida: boolean;
  prioridade: "baixa" | "media" | "alta";
}

// Durante criação, usuário não fornece id e concluida
type TarefaNova = Omit<Tarefa, "id" | "concluida">;

// Estado da UI
interface EstadoTarefa {
  carregando: boolean;
  erro?: string;
  dados?: TarefaNova; // Tarefa sendo criada
}
```

## ⚠️ Considerações

### 1. Pick vs Omit: Qual Usar?

```typescript
interface Grande {
  prop1: string;
  prop2: string;
  prop3: string;
  prop4: string;
  prop5: string;
  // ... muitas propriedades
}

// ✅ Use Pick quando quiser poucas propriedades
type Pequeno1 = Pick<Grande, "prop1" | "prop2">;

// ❌ Evite Omit quando remover muitas
type Pequeno2 = Omit<Grande, "prop3" | "prop4" | "prop5" | ...>;
// Verboso e frágil (se adicionar prop6, ela aparece automaticamente)

// ✅ Use Omit quando remover poucas propriedades
type QuaseTudo = Omit<Grande, "prop1">;

// ❌ Evite Pick quando selecionar muitas
type QuaseTudo2 = Pick<Grande, "prop2" | "prop3" | "prop4" | ...>;
```

### 2. Combinar Pick/Omit com Outros Utilitários

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
}

// Pick + Partial: apenas alguns campos, todos opcionais
type AtualizacaoParcial = Partial<Pick<Usuario, "nome" | "email">>;

const update: AtualizacaoParcial = { nome: "Novo Nome" }; // email opcional

// Omit + Required: remove senha, torna resto obrigatório
type UsuarioSemSenhaObrigatorio = Required<Omit<Usuario, "senha">>;
```

### 3. Pick/Omit com Union Types

```typescript
type A = { a: string; b: number };
type B = { b: number; c: boolean };

type Union = A | B;

// Pick em union aplica a TODOS os membros
type PickedUnion = Pick<Union, "b">; // { b: number }

// Omit em union aplica a TODOS
type OmittedUnion = Omit<Union, "b">; // { a: string } | { c: boolean }
```

### 4. Type Safety com Keyof

```typescript
interface Config {
  host: string;
  port: number;
}

// ✅ Type-safe: K extends keyof T
type SafePick = Pick<Config, "host">; // OK

// ❌ Erro: "invalido" não é chave de Config
// type UnsafePick = Pick<Config, "invalido">;

// Omit é mais permissivo (K extends keyof any)
type SafeOmit = Omit<Config, "host">; // OK
type AlsoOmit = Omit<Config, "naoexiste">; // ✅ OK (não gera erro, só não remove nada)
```

## 📚 Conclusão

`Pick<T, K>` seleciona apenas propriedades especificadas, `Omit<T, K>` remove propriedades especificadas. Complementares e essenciais para criar tipos derivados focados. Ideais para DTOs, formulários, APIs (request/response diferentes), remoção de dados sensíveis, testes e composição de tipos. Use Pick quando precisar de poucas propriedades, Omit quando remover poucas. Combine com Partial/Required/Readonly para controle fino. Pick é mais restritivo (K deve existir em T), Omit é permissivo.
