# Record<K, T>: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`Record<K, T>`** é tipo utilitário built-in que **constrói tipo objeto** com conjunto de chaves `K` (keys) e valores do tipo `T`. Conceitualmente, representa **mapeamento estruturado**, onde você define explicitamente domínio de chaves e tipo uniforme de valores, criando dicionários/mapas tipados.

Na essência, `Record<K, T>` materializa o princípio de **estruturas de lookup tipadas**, onde cada chave do conjunto `K` mapeia para valor do tipo `T`, ideal para índices, dicionários, mapas e objetos de configuração homogêneos.

## 📋 Fundamentos

### Sintaxe e Comportamento

```typescript
// Sintaxe: Record<Chaves, TipoValor>

// Exemplo 1: String keys, number values
type Pontuacoes = Record<string, number>;

const pontos: Pontuacoes = {
  ana: 100,
  bob: 85,
  carol: 95
};

// Exemplo 2: Union de literais como keys
type DiaSemana = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
type HorarioTrabalho = Record<DiaSemana, string>;

const horarios: HorarioTrabalho = {
  seg: "9h-18h",
  ter: "9h-18h",
  qua: "9h-18h",
  qui: "9h-18h",
  sex: "9h-17h",
  sab: "Fechado",
  dom: "Fechado"
};

// Todas as chaves da union devem estar presentes!
// Se faltar alguma, TypeScript dá erro
```

**Conceito-chave:** `Record<K, T>` cria objeto onde **todas as chaves do tipo K** devem mapear para valores do tipo `T`.

### Implementação Interna

```typescript
// Definição real do Record (built-in TypeScript)
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// Explicação:
// - K extends keyof any: K deve ser tipo válido para chave (string | number | symbol)
// - [P in K]: itera sobre todas as possíveis chaves em K
// - T: tipo uniforme para todos os valores
```

**Mecanismo:** Usa **mapped types** para criar propriedade para cada membro de `K`.

## 🔍 Análise Conceitual

### 1. Dicionários e Índices

```typescript
// Mapeamento ID → Usuário
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

type UsuarioPorId = Record<number, Usuario>;

const usuarios: UsuarioPorId = {
  1: { id: 1, nome: "Ana", email: "ana@example.com" },
  2: { id: 2, nome: "Bob", email: "bob@example.com" },
  3: { id: 3, nome: "Carol", email: "carol@example.com" }
};

// Acesso direto por ID
const usuario = usuarios[1];
console.log(usuario.nome); // "Ana"

// Mapeamento string → objeto
type ProdutoPorCodigo = Record<string, { nome: string; preco: number }>;

const produtos: ProdutoPorCodigo = {
  "ABC123": { nome: "Notebook", preco: 2000 },
  "DEF456": { nome: "Mouse", preco: 50 }
};
```

**Conceito:** Record permite criar índices eficientes para lookup O(1).

### 2. Configurações e Constantes

```typescript
type Ambiente = "dev" | "staging" | "prod";

type ConfigPorAmbiente = Record<Ambiente, {
  apiUrl: string;
  debug: boolean;
}>;

const configs: ConfigPorAmbiente = {
  dev: {
    apiUrl: "http://localhost:3000",
    debug: true
  },
  staging: {
    apiUrl: "https://staging.example.com",
    debug: true
  },
  prod: {
    apiUrl: "https://api.example.com",
    debug: false
  }
};

// Uso
const ambiente: Ambiente = "prod";
const config = configs[ambiente];
console.log(config.apiUrl); // "https://api.example.com"
```

### 3. Tradução/i18n

```typescript
type Idioma = "pt" | "en" | "es";

type Traducoes = Record<Idioma, {
  bemVindo: string;
  sair: string;
  configuracoes: string;
}>;

const textos: Traducoes = {
  pt: {
    bemVindo: "Bem-vindo",
    sair: "Sair",
    configuracoes: "Configurações"
  },
  en: {
    bemVindo: "Welcome",
    sair: "Logout",
    configuracoes: "Settings"
  },
  es: {
    bemVindo: "Bienvenido",
    sair: "Salir",
    configuracoes: "Configuraciones"
  }
};

function traduzir(chave: keyof Traducoes["pt"], idioma: Idioma): string {
  return textos[idioma][chave];
}

console.log(traduzir("bemVindo", "en")); // "Welcome"
```

### 4. Estado de Features (Feature Flags)

```typescript
type Feature = "darkMode" | "notifications" | "analytics" | "betaFeatures";

type FeatureFlags = Record<Feature, boolean>;

const flags: FeatureFlags = {
  darkMode: true,
  notifications: false,
  analytics: true,
  betaFeatures: false
};

function isFeatureEnabled(feature: Feature): boolean {
  return flags[feature];
}

if (isFeatureEnabled("darkMode")) {
  aplicarTemaEscuro();
}
```

### 5. Normalização de Dados

```typescript
interface Post {
  id: number;
  titulo: string;
  autorId: number;
}

interface Autor {
  id: number;
  nome: string;
}

// Estrutura normalizada
interface EstadoNormalizado {
  posts: Record<number, Post>;
  autores: Record<number, Autor>;
}

const estado: EstadoNormalizado = {
  posts: {
    1: { id: 1, titulo: "Post 1", autorId: 10 },
    2: { id: 2, titulo: "Post 2", autorId: 11 }
  },
  autores: {
    10: { id: 10, nome: "Ana" },
    11: { id: 11, nome: "Bob" }
  }
};

// Lookup eficiente
const post = estado.posts[1];
const autor = estado.autores[post.autorId];
console.log(`${post.titulo} por ${autor.nome}`); // "Post 1 por Ana"
```

## 🎯 Aplicabilidade

### Cache e Memoização

```typescript
type CacheKey = string;
type CacheValue = any;

class Cache {
  private storage: Record<CacheKey, CacheValue> = {};

  set(key: CacheKey, value: CacheValue): void {
    this.storage[key] = value;
  }

  get(key: CacheKey): CacheValue | undefined {
    return this.storage[key];
  }

  has(key: CacheKey): boolean {
    return key in this.storage;
  }

  clear(): void {
    this.storage = {};
  }
}
```

### Contadores e Estatísticas

```typescript
type EventoApp = "pageview" | "click" | "submit" | "error";

type Contador = Record<EventoApp, number>;

class Analytics {
  private contadores: Contador = {
    pageview: 0,
    click: 0,
    submit: 0,
    error: 0
  };

  registrar(evento: EventoApp): void {
    this.contadores[evento]++;
  }

  obterEstatisticas(): Contador {
    return { ...this.contadores };
  }
}

const analytics = new Analytics();
analytics.registrar("pageview");
analytics.registrar("click");
analytics.registrar("click");

console.log(analytics.obterEstatisticas());
// { pageview: 1, click: 2, submit: 0, error: 0 }
```

### Validação de Formulários

```typescript
type CampoFormulario = "nome" | "email" | "senha" | "confirmarSenha";

type ErrosValidacao = Record<CampoFormulario, string | null>;

function validarFormulario(dados: Record<CampoFormulario, string>): ErrosValidacao {
  const erros: ErrosValidacao = {
    nome: null,
    email: null,
    senha: null,
    confirmarSenha: null
  };

  if (dados.nome.length < 3) {
    erros.nome = "Nome muito curto";
  }

  if (!dados.email.includes("@")) {
    erros.email = "Email inválido";
  }

  if (dados.senha.length < 6) {
    erros.senha = "Senha muito curta";
  }

  if (dados.senha !== dados.confirmarSenha) {
    erros.confirmarSenha = "Senhas não coincidem";
  }

  return erros;
}
```

### Roteamento

```typescript
type Rota = "/" | "/sobre" | "/contato" | "/produtos";

type ConfigRota = {
  titulo: string;
  componente: string;
  requireAuth: boolean;
};

const rotas: Record<Rota, ConfigRota> = {
  "/": {
    titulo: "Início",
    componente: "Home",
    requireAuth: false
  },
  "/sobre": {
    titulo: "Sobre",
    componente: "About",
    requireAuth: false
  },
  "/contato": {
    titulo: "Contato",
    componente: "Contact",
    requireAuth: false
  },
  "/produtos": {
    titulo: "Produtos",
    componente: "Products",
    requireAuth: true
  }
};

function navegar(rota: Rota): void {
  const config = rotas[rota];
  if (config.requireAuth && !estaAutenticado()) {
    navegar("/");
    return;
  }
  renderizar(config.componente);
}
```

## ⚠️ Considerações

### 1. Record vs Interface/Type

```typescript
// ❌ Record não permite propriedades opcionais diretas
type Config1 = Record<"host" | "port", string>;
// Todas propriedades são obrigatórias

// Se quer opcionais, use Partial
type Config2 = Partial<Record<"host" | "port", string>>;

// Ou use interface/type para controle fino
interface Config3 {
  host: string;
  port?: string; // Opcional
}
```

### 2. String Index vs Union Literal

```typescript
// ❌ String genérico - aceita qualquer chave
type Dict1 = Record<string, number>;
const d1: Dict1 = { qualquer: 1, coisa: 2 };

// ✅ Union literal - apenas chaves específicas
type Cores = "red" | "green" | "blue";
type PaletaCores = Record<Cores, string>;

const paleta: PaletaCores = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF"
  // outra: "#123456" // ❌ Erro: chave não esperada
};
```

### 3. Record com Tipos Complexos

```typescript
// Chaves podem ser union
type StatusCode = 200 | 404 | 500;

type Resposta = Record<StatusCode, {
  mensagem: string;
  acao: () => void;
}>;

const respostas: Resposta = {
  200: { mensagem: "OK", acao: () => console.log("Sucesso") },
  404: { mensagem: "Não encontrado", acao: () => console.log("Redirecionar") },
  500: { mensagem: "Erro", acao: () => console.log("Logar erro") }
};
```

### 4. Partial Record (Chaves Opcionais)

```typescript
// Record exige todas as chaves
type Idioma = "pt" | "en" | "es";
type Texto1 = Record<Idioma, string>;

const t1: Texto1 = {
  pt: "Olá",
  en: "Hello"
  // ❌ Erro: falta "es"
};

// Partial Record permite chaves opcionais
type Texto2 = Partial<Record<Idioma, string>>;

const t2: Texto2 = {
  pt: "Olá",
  en: "Hello"
  // ✅ OK - "es" é opcional
};

// Acesso requer verificação
const espanhol = t2.es; // string | undefined
```

## 📚 Conclusão

`Record<K, T>` constrói tipo objeto com chaves do tipo `K` e valores do tipo `T`, criando dicionários/mapas tipados. Ideal para índices, configurações por ambiente/idioma, feature flags, normalização de dados, cache e roteamento. Usa mapped types para iterar sobre conjunto de chaves. Quando `K` é union literal, todas as chaves devem estar presentes (use `Partial<Record>` para opcionais). Quando `K` é `string`, aceita qualquer chave string (menos restritivo). Record garante homogeneidade de valores.
