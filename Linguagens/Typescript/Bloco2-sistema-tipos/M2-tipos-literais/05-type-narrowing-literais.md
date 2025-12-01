# Type Narrowing com Literais: Refinamento Progressivo de Unions

## 🎯 Introdução e Definição

Type narrowing com literais é **processo pelo qual TypeScript refina automaticamente tipos union de literais** para literais específicos através de análise de fluxo de controle, comparações de igualdade e pattern matching. Conceitualmente, representa **eliminação progressiva de possibilidades**: união começa com N valores possíveis; cada verificação condicional elimina opções incompatíveis, **refinando tipo até literal único** em cada branch. Narrowing com literais é especialmente poderoso porque comparações de igualdade (`===`) são **precisas e inequívocas** para valores primitivos.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Comparação de Igualdade:** `===` elimina todos os valores exceto um
2. **Discriminated Unions:** Propriedade literal refina union de objetos
3. **Switch Statements:** Pattern matching exaustivo
4. **Type Guards:** Verificações que compilador rastreia
5. **Control Flow Analysis:** TypeScript rastreia tipo em cada branch
6. **Exhaustiveness Checking:** Garantir todos os casos cobertos

**Conceito Central:** Cada comparação com literal **divide universo de possibilidades**, refinando tipo progressivamente.

## 🧠 Fundamentos Teóricos

### Narrowing com Comparação de Igualdade

**Pattern Básico:**
```typescript
type Status = "ativo" | "inativo" | "pendente";

function processar(status: Status) {
  // status: "ativo" | "inativo" | "pendente"

  if (status === "ativo") {
    // status: "ativo" (narrowed)
    console.log("Sistema ativo");
  } else {
    // status: "inativo" | "pendente" (resto da union)
  }
}
```

**Conceito:** `===` com literal elimina **todos os outros valores** da union.

### Múltiplas Comparações

**Refinamento Progressivo:**
```typescript
type Direcao = "norte" | "sul" | "leste" | "oeste";

function mover(direcao: Direcao) {
  // direcao: "norte" | "sul" | "leste" | "oeste"

  if (direcao === "norte") {
    // direcao: "norte"
    console.log("Indo para norte");
  } else if (direcao === "sul") {
    // direcao: "sul"
    console.log("Indo para sul");
  } else if (direcao === "leste") {
    // direcao: "leste"
    console.log("Indo para leste");
  } else {
    // direcao: "oeste" (única opção restante)
    console.log("Indo para oeste");
  }
}
```

**Conceito:** Cada `else if` **reduz conjunto de possibilidades**; `else` final contém **única opção não verificada**.

### Switch Statement Narrowing

**Pattern Matching Exaustivo:**
```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function request(method: HttpMethod) {
  switch (method) {
    case "GET":
      // method: "GET"
      return fetch();
    case "POST":
      // method: "POST"
      return fetch({ method: "POST" });
    case "PUT":
      // method: "PUT"
      return fetch({ method: "PUT" });
    case "DELETE":
      // method: "DELETE"
      return fetch({ method: "DELETE" });
    case "PATCH":
      // method: "PATCH"
      return fetch({ method: "PATCH" });
    default:
      // method: never (todos os casos cobertos)
      const _exhaustive: never = method;
      throw new Error(`Método não tratado: ${_exhaustive}`);
  }
}
```

**Vantagem:** Switch agrupa lógica por valor; `default` com `never` garante **exhaustiveness checking**.

## 🔍 Discriminated Unions

### Conceito Fundamental

**Discriminated union** é union de objetos com **propriedade literal comum** (discriminante) que identifica unicamente cada tipo.

**Estrutura:**
```typescript
type Sucesso = {
  status: "sucesso";  // Discriminante
  dados: string[];
};

type Erro = {
  status: "erro";     // Discriminante
  mensagem: string;
};

type Resultado = Sucesso | Erro;
```

**Narrowing Automático:**
```typescript
function processar(resultado: Resultado) {
  if (resultado.status === "sucesso") {
    // resultado: Sucesso (narrowed automaticamente!)
    console.log(resultado.dados);
  } else {
    // resultado: Erro
    console.log(resultado.mensagem);
  }
}
```

**Conceito:** TypeScript rastreia que `status === "sucesso"` só é verdadeiro para tipo `Sucesso`; automaticamente narrowa tipo completo.

### Discriminante com Múltiplos Tipos

**Três ou Mais Estados:**
```typescript
type Carregando = {
  estado: "carregando";
  progresso?: number;
};

type Sucesso = {
  estado: "sucesso";
  dados: string[];
};

type Erro = {
  estado: "erro";
  mensagem: string;
  codigo: number;
};

type Estado = Carregando | Sucesso | Erro;

function renderizar(estado: Estado) {
  switch (estado.estado) {
    case "carregando":
      // estado: Carregando
      return `Carregando... ${estado.progresso ?? 0}%`;
    case "sucesso":
      // estado: Sucesso
      return `Dados: ${estado.dados.join(", ")}`;
    case "erro":
      // estado: Erro
      return `Erro ${estado.codigo}: ${estado.mensagem}`;
    default:
      const _exhaustive: never = estado;
      return _exhaustive;
  }
}
```

### Discriminante Numérico

**Com Numbers:**
```typescript
type Evento =
  | { tipo: 1; x: number; y: number }
  | { tipo: 2; tecla: string }
  | { tipo: 3; delta: number };

function processar(evento: Evento) {
  switch (evento.tipo) {
    case 1:
      // evento: { tipo: 1; x: number; y: number }
      console.log(`Click em (${evento.x}, ${evento.y})`);
      break;
    case 2:
      // evento: { tipo: 2; tecla: string }
      console.log(`Tecla: ${evento.tecla}`);
      break;
    case 3:
      // evento: { tipo: 3; delta: number }
      console.log(`Scroll: ${evento.delta}`);
      break;
  }
}
```

### Discriminante Booleano

**Com Booleans:**
```typescript
type Autenticado = {
  autenticado: true;
  usuario: Usuario;
  token: string;
};

type NaoAutenticado = {
  autenticado: false;
};

type EstadoAuth = Autenticado | NaoAutenticado;

function verificar(estado: EstadoAuth) {
  if (estado.autenticado) {
    // estado: Autenticado
    console.log(`Usuário: ${estado.usuario.nome}`);
    console.log(`Token: ${estado.token}`);
  } else {
    // estado: NaoAutenticado
    console.log("Não autenticado");
  }
}
```

**Conceito:** Boolean literal (`true`/`false`) funciona perfeitamente como discriminante para divisão binária.

## 🎯 Narrowing Avançado

### Múltiplos Discriminantes

**Nested Discriminated Unions:**
```typescript
type EventoMouse = {
  categoria: "mouse";
  tipo: "click" | "move";
  x: number;
  y: number;
};

type EventoTeclado = {
  categoria: "teclado";
  tipo: "keydown" | "keyup";
  tecla: string;
};

type Evento = EventoMouse | EventoTeclado;

function processar(evento: Evento) {
  if (evento.categoria === "mouse") {
    // evento: EventoMouse
    if (evento.tipo === "click") {
      // evento.tipo: "click"
      console.log("Click");
    } else {
      // evento.tipo: "move"
      console.log("Move");
    }
  } else {
    // evento: EventoTeclado
    if (evento.tipo === "keydown") {
      // evento.tipo: "keydown"
      console.log("Key down");
    } else {
      // evento.tipo: "keyup"
      console.log("Key up");
    }
  }
}
```

### `in` Operator com Discriminante

**Verificação de Propriedade:**
```typescript
type Circulo = {
  tipo: "circulo";
  raio: number;
};

type Quadrado = {
  tipo: "quadrado";
  lado: number;
};

type Forma = Circulo | Quadrado;

function calcularArea(forma: Forma): number {
  // Método 1: Discriminante direto
  if (forma.tipo === "circulo") {
    return Math.PI * forma.raio ** 2;
  } else {
    return forma.lado ** 2;
  }

  // Método 2: 'in' operator (menos comum com discriminantes)
  if ("raio" in forma) {
    return Math.PI * forma.raio ** 2;
  } else {
    return forma.lado ** 2;
  }
}
```

**Preferir discriminante direto:** Mais explícito e claro.

### Type Predicates com Literais

**User-Defined Type Guards:**
```typescript
type Status = "ativo" | "inativo" | "pendente";

function isAtivo(status: Status): status is "ativo" {
  return status === "ativo";
}

function processar(status: Status) {
  if (isAtivo(status)) {
    // status: "ativo"
    console.log("Sistema está ativo");
  } else {
    // status: "inativo" | "pendente"
  }
}
```

**Conceito:** Type predicate `status is "ativo"` informa TypeScript que se função retorna `true`, `status` é definitivamente `"ativo"`.

## 🎯 Exhaustiveness Checking

### Pattern com `never`

**Garantir Todos os Casos:**
```typescript
type Comando = "iniciar" | "pausar" | "parar";

function executar(comando: Comando): void {
  switch (comando) {
    case "iniciar":
      console.log("Iniciando...");
      break;
    case "pausar":
      console.log("Pausando...");
      break;
    case "parar":
      console.log("Parando...");
      break;
    default:
      // Se todos os casos cobertos, comando é 'never'
      const _exhaustive: never = comando;
      throw new Error(`Comando não tratado: ${_exhaustive}`);
  }
}
```

**Adicionando Novo Valor:**
```typescript
type Comando = "iniciar" | "pausar" | "parar" | "retomar";
// Erro de compilação em executar() - "retomar" não tratado
```

**Benefício:** Refatoração segura - adicionar valor à union força atualização de todos os switches.

### Helper Function para Exhaustiveness

```typescript
function assertNever(value: never): never {
  throw new Error(`Valor não esperado: ${value}`);
}

function processar(comando: Comando): void {
  switch (comando) {
    case "iniciar":
      break;
    case "pausar":
      break;
    case "parar":
      break;
    default:
      assertNever(comando);
  }
}
```

## 🎯 Aplicabilidade Prática

### State Machines

**Modelagem Type-Safe:**
```typescript
type EstadoPedido =
  | { status: "carrinho"; itens: Item[] }
  | { status: "pagamento"; total: number }
  | { status: "processando"; idTransacao: string }
  | { status: "enviado"; codigoRastreio: string }
  | { status: "entregue"; dataEntrega: Date };

function obterProximaAcao(pedido: EstadoPedido): string {
  switch (pedido.status) {
    case "carrinho":
      return "Finalizar compra";
    case "pagamento":
      return `Pagar R$ ${pedido.total}`;
    case "processando":
      return "Aguardar processamento";
    case "enviado":
      return `Rastrear: ${pedido.codigoRastreio}`;
    case "entregue":
      return "Avaliar pedido";
    default:
      const _exhaustive: never = pedido;
      return _exhaustive;
  }
}
```

### APIs e Respostas

**Modelagem de Resultado:**
```typescript
type ApiResponse<T> =
  | { ok: true; status: 200 | 201; data: T }
  | { ok: false; status: 400 | 401 | 404 | 500; error: string };

async function buscar<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);

  if (response.ok) {
    return {
      ok: true,
      status: response.status as 200 | 201,
      data: await response.json()
    };
  } else {
    return {
      ok: false,
      status: response.status as 400 | 401 | 404 | 500,
      error: await response.text()
    };
  }
}

// Uso com narrowing
const resultado = await buscar<Usuario>("/api/user");

if (resultado.ok) {
  // resultado: { ok: true; status: 200 | 201; data: Usuario }
  console.log(resultado.data.nome);
} else {
  // resultado: { ok: false; status: 400 | 401 | 404 | 500; error: string }
  console.error(resultado.error);
}
```

## ⚠️ Armadilhas Comuns

### 1. Comparação Loose (`==`)

```typescript
type Status = "ativo" | "inativo";

function processar(status: Status) {
  if (status == "ativo") {  // ⚠️ Funciona, mas menos preciso
    // Narrowed, mas '==' pode ser confuso
  }

  // ✅ Preferir '==='
  if (status === "ativo") {
    // Mais claro e preciso
  }
}
```

### 2. Narrowing Perdido em Callbacks

```typescript
type Status = "ativo" | "inativo";

function processar(status: Status) {
  if (status === "ativo") {
    // status: "ativo"

    setTimeout(() => {
      // status: "ativo" | "inativo" (narrowing NÃO persiste!)
    }, 1000);
  }
}
```

**Solução:** Capturar em variável local ou usar type guard novamente.

### 3. Mutação Após Narrowing

```typescript
let status: "ativo" | "inativo" = "ativo";

if (status === "ativo") {
  // status: "ativo"

  status = "inativo";  // Reatribuição muda tipo

  // status: "inativo" (narrowing anterior perdido)
}
```

## 📚 Conclusão

**Type narrowing com literais** é mecanismo central do TypeScript: permite trabalhar com **unions flexíveis** mas operar com **type safety de tipos específicos**. Discriminated unions + switch statements + exhaustiveness checking = **pattern matching type-safe** comparável a linguagens funcionais.

**Conceitos Fundamentais:**
1. **Comparação `===`:** Refina union para literal único
2. **Discriminated Unions:** Propriedade literal narrowa objeto completo
3. **Switch Exhaustivo:** Pattern matching com todos os casos
4. **`never` em default:** Garante cobertura completa
5. **Control Flow Analysis:** Compilador rastreia tipo em cada branch
6. **Type Predicates:** Narrowing customizado com funções

**Narrowing com literais = flexibilidade de unions + precisão de tipos específicos + pattern matching elegante.**
