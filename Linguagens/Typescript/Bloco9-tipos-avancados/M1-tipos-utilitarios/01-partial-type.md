# Partial<T>: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`Partial<T>`** é tipo utilitário built-in que **transforma todas as propriedades de tipo** `T` em **opcionais**, criando nova versão do tipo onde cada campo pode estar presente ou ausente. Conceitualmente, representa **relaxamento de obrigatoriedade**, permitindo objetos parcialmente preenchidos sem violar type safety.

Na essência, `Partial<T>` materializa o princípio de **flexibilidade estrutural controlada**, onde você mantém shape do tipo original mas remove requirement de completude, ideal para atualizações parciais, objetos em construção e configurações opcionais.

## 📋 Fundamentos

### Sintaxe e Comportamento

```typescript
// Tipo original
interface Usuario {
  id: number;
  nome: string;
  email: string;
  idade: number;
}

// Partial torna tudo opcional
type UsuarioParcial = Partial<Usuario>;
// Equivale a:
// {
//   id?: number;
//   nome?: string;
//   email?: string;
//   idade?: number;
// }

// Uso
const usuario1: UsuarioParcial = { id: 1 }; // ✅ OK
const usuario2: UsuarioParcial = { nome: "Ana", email: "ana@example.com" }; // ✅ OK
const usuario3: UsuarioParcial = {}; // ✅ OK - objeto vazio válido!
```

**Conceito-chave:** `Partial<T>` mantém estrutura do tipo mas remove requirement - todas propriedades tornam-se opcionais.

### Implementação Interna

```typescript
// Definição real do Partial (built-in TypeScript)
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Explicação:
// - [P in keyof T]: itera sobre todas as chaves de T
// - ?: torna a propriedade opcional
// - T[P]: mantém o tipo original da propriedade
```

**Mecanismo:** Usa **mapped types** para iterar propriedades e adicionar modifier `?`.

## 🔍 Análise Conceitual

### 1. Atualizações Parciais

```typescript
interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
}

// Função de atualização aceita dados parciais
function atualizarProduto(
  id: number,
  atualizacao: Partial<Produto>
): Produto {
  const produtoExistente = buscarProduto(id);

  return {
    ...produtoExistente,
    ...atualizacao // Sobrescreve apenas campos presentes
  };
}

// Uso: atualizar apenas alguns campos
atualizarProduto(1, { preco: 150 }); // Só muda preço
atualizarProduto(2, { nome: "Novo Nome", estoque: 100 }); // Muda nome e estoque
atualizarProduto(3, {}); // Nenhuma mudança (válido)
```

**Conceito:** Partial permite modificar subconjunto de propriedades sem exigir objeto completo.

### 2. Objetos em Construção (Builder Pattern)

```typescript
interface ConfiguracaoCompleta {
  tema: "claro" | "escuro";
  idioma: string;
  notificacoes: boolean;
  volume: number;
  autoSalvar: boolean;
}

class ConfigBuilder {
  private config: Partial<ConfiguracaoCompleta> = {};

  setTema(tema: "claro" | "escuro"): this {
    this.config.tema = tema;
    return this;
  }

  setIdioma(idioma: string): this {
    this.config.idioma = idioma;
    return this;
  }

  setNotificacoes(ativo: boolean): this {
    this.config.notificacoes = ativo;
    return this;
  }

  build(): ConfiguracaoCompleta {
    // Validação: garantir que todos os campos foram preenchidos
    if (!this.config.tema || !this.config.idioma ||
        this.config.notificacoes === undefined ||
        this.config.volume === undefined ||
        this.config.autoSalvar === undefined) {
      throw new Error("Configuração incompleta");
    }

    return this.config as ConfiguracaoCompleta;
  }
}

// Uso
const config = new ConfigBuilder()
  .setTema("escuro")
  .setIdioma("pt-BR")
  .setNotificacoes(true)
  .build();
```

**Conceito:** Durante construção, objeto é parcial. Apenas no final (build) garantimos completude.

### 3. Formulários e Validação Progressiva

```typescript
interface FormularioCadastro {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone: string;
  endereco: string;
}

// Estado do formulário: parcial enquanto usuário preenche
type EstadoFormulario = Partial<FormularioCadastro>;

class Formulario {
  private dados: EstadoFormulario = {};

  atualizarCampo<K extends keyof FormularioCadastro>(
    campo: K,
    valor: FormularioCadastro[K]
  ): void {
    this.dados[campo] = valor;
  }

  validarCompleto(): FormularioCadastro | null {
    // Verifica se todos os campos foram preenchidos
    if (this.dados.nome && this.dados.email && this.dados.senha &&
        this.dados.confirmarSenha && this.dados.telefone &&
        this.dados.endereco) {
      return this.dados as FormularioCadastro;
    }
    return null;
  }
}

// Uso
const form = new Formulario();
form.atualizarCampo("nome", "Ana"); // Preenche parcialmente
form.atualizarCampo("email", "ana@example.com");
// ... usuário continua preenchendo
```

### 4. Merge de Configurações

```typescript
interface ConfigPadrao {
  timeout: number;
  retries: number;
  cache: boolean;
  debug: boolean;
}

const configPadrao: ConfigPadrao = {
  timeout: 5000,
  retries: 3,
  cache: true,
  debug: false
};

// Usuário fornece apenas overrides
function criarConfig(overrides: Partial<ConfigPadrao>): ConfigPadrao {
  return {
    ...configPadrao,
    ...overrides
  };
}

// Uso
const config1 = criarConfig({ timeout: 10000 }); // Só muda timeout
const config2 = criarConfig({ debug: true, cache: false }); // Muda debug e cache
const config3 = criarConfig({}); // Usa todos os padrões
```

### 5. Partial Aninhado (Deep Partial)

```typescript
interface Endereco {
  rua: string;
  numero: number;
  cidade: string;
}

interface Pessoa {
  nome: string;
  idade: number;
  endereco: Endereco;
}

// Partial padrão: apenas nível superior fica opcional
type PessoaParcial = Partial<Pessoa>;
// {
//   nome?: string;
//   idade?: number;
//   endereco?: Endereco; // ← Opcional, mas se presente, deve ser completo!
// }

const p1: PessoaParcial = {
  endereco: { rua: "Rua A", numero: 100, cidade: "SP" } // ✅ OK
};

const p2: PessoaParcial = {
  endereco: { rua: "Rua A" } // ❌ Erro: falta numero e cidade
};

// Para partial recursivo, criar tipo customizado:
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type PessoaDeepParcial = DeepPartial<Pessoa>;
// Agora endereco também pode ser parcial:
const p3: PessoaDeepParcial = {
  endereco: { rua: "Rua A" } // ✅ OK com DeepPartial
};
```

## 🎯 Aplicabilidade

### API de Atualização

```typescript
interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  concluida: boolean;
  prioridade: "baixa" | "media" | "alta";
  dataLimite: Date;
}

// PATCH endpoint: aceita atualizações parciais
async function patchTarefa(
  id: number,
  dados: Partial<Tarefa>
): Promise<Tarefa> {
  // Busca tarefa existente
  const tarefaAtual = await buscarTarefa(id);

  // Merge: mantém dados antigos + sobrescreve com novos
  const tarefaAtualizada = {
    ...tarefaAtual,
    ...dados
  };

  // Salva e retorna
  return await salvarTarefa(tarefaAtualizada);
}

// Uso
await patchTarefa(1, { concluida: true }); // Só marca como concluída
await patchTarefa(2, { titulo: "Novo Título", prioridade: "alta" });
```

### Estado de Aplicação (React/Redux)

```typescript
interface AppState {
  usuario: Usuario | null;
  tema: "claro" | "escuro";
  idioma: string;
  carregando: boolean;
}

// Action para atualizar parcialmente o estado
type AtualizarEstadoAction = {
  type: "ATUALIZAR_ESTADO";
  payload: Partial<AppState>;
};

function reducer(
  state: AppState,
  action: AtualizarEstadoAction
): AppState {
  return {
    ...state,
    ...action.payload
  };
}

// Uso
dispatch({
  type: "ATUALIZAR_ESTADO",
  payload: { carregando: true } // Só muda loading
});

dispatch({
  type: "ATUALIZAR_ESTADO",
  payload: { usuario: dadosUsuario, carregando: false }
});
```

### Testes: Mock Parcial

```typescript
interface ServicoComplexo {
  autenticar(usuario: string, senha: string): Promise<boolean>;
  buscarDados(id: number): Promise<any>;
  salvar(dados: any): Promise<void>;
  enviarEmail(destinatario: string, mensagem: string): Promise<void>;
}

// Mock de teste: implementar apenas métodos necessários
function criarMock(overrides: Partial<ServicoComplexo>): ServicoComplexo {
  return {
    autenticar: async () => true, // Default
    buscarDados: async () => ({}),
    salvar: async () => {},
    enviarEmail: async () => {},
    ...overrides // Sobrescreve com implementações de teste
  };
}

// Uso em teste
const mockServico = criarMock({
  buscarDados: async (id) => ({ id, nome: "Teste" })
  // Outros métodos usam defaults
});
```

## ⚠️ Considerações

### 1. Partial Não Valida Completude

```typescript
interface Pessoa {
  nome: string;
  idade: number;
}

// ❌ Problema: Partial aceita objeto vazio
const p: Partial<Pessoa> = {}; // ✅ Válido, mas pode causar bugs

// Se precisa garantir ao menos um campo, use union:
type PessoaAtLeastOne =
  | { nome: string; idade?: number }
  | { nome?: string; idade: number };

const p1: PessoaAtLeastOne = {}; // ❌ Erro: precisa de pelo menos um
const p2: PessoaAtLeastOne = { nome: "Ana" }; // ✅ OK
```

### 2. Type Guards para Validação

```typescript
function isPessoaCompleta(p: Partial<Pessoa>): p is Pessoa {
  return p.nome !== undefined && p.idade !== undefined;
}

const parcial: Partial<Pessoa> = { nome: "Ana" };

if (isPessoaCompleta(parcial)) {
  // Aqui TypeScript sabe que é Pessoa completa
  console.log(parcial.nome.toUpperCase()); // ✅ OK
  console.log(parcial.idade + 1); // ✅ OK
} else {
  // Ainda Partial<Pessoa>
  // console.log(parcial.idade + 1); // ❌ Erro: pode ser undefined
}
```

### 3. Combinar com Required para Subset Obrigatório

```typescript
interface Config {
  host: string;
  port: number;
  usuario: string;
  senha: string;
  timeout?: number;
  retries?: number;
}

// Partial geral, mas host e port são obrigatórios
type ConfigMinima = Partial<Config> & Required<Pick<Config, "host" | "port">>;

const config1: ConfigMinima = {
  host: "localhost",
  port: 3000
  // Resto opcional
}; // ✅ OK

const config2: ConfigMinima = {
  host: "localhost"
  // ❌ Erro: falta port
};
```

## 📚 Conclusão

`Partial<T>` transforma todas as propriedades de tipo em opcionais, permitindo objetos parcialmente preenchidos. Ideal para atualizações parciais (PATCH APIs), objetos em construção (builders), formulários progressivos, merge de configurações e mocks de teste. Usa mapped types internamente para adicionar modifier `?` em cada propriedade. Lembre-se: Partial é shallow (apenas nível superior), não valida completude (aceita objeto vazio) e deve ser combinado com type guards para garantir dados necessários antes de uso.

