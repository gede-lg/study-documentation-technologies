# Arrays de Objetos em TypeScript: Tipagem de Estruturas Complexas e Interfaces em Coleções

## 🎯 Introdução e Definição

### Definição Conceitual

Um **array de objetos** em TypeScript é uma coleção ordenada de elementos onde cada elemento é um **objeto com estrutura definida por interface, type alias ou tipo literal**. Conceitualmente, representa uma **tabela de dados** ou **coleção de registros** onde cada objeto (linha) possui propriedades tipadas (colunas).

A sintaxe fundamental combina declaração de array com tipo de objeto:

```typescript
// Com interface
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

let usuarios: Usuario[] = [
  { id: 1, nome: "Ana", email: "ana@email.com" },
  { id: 2, nome: "Bruno", email: "bruno@email.com" }
];

// Com type alias
type Produto = {
  codigo: string;
  preco: number;
};

let produtos: Produto[] = [
  { codigo: "ABC", preco: 50 },
  { codigo: "XYZ", preco: 100 }
];

// Com tipo literal inline
let pontos: { x: number; y: number }[] = [
  { x: 0, y: 0 },
  { x: 10, y: 20 }
];
```

**Conceito profundo**: Arrays de objetos são **estruturas de dados relacionais** em memória. TypeScript garante que:
- **Cada objeto** possui todas propriedades obrigatórias do tipo
- **Tipos das propriedades** são respeitados
- **Métodos de array** preservam type safety dos objetos

### Contexto Histórico e Motivação

Em **JavaScript**, arrays de objetos são padrão ubíquo para representar dados:

```javascript
// JavaScript: sem tipagem de estrutura
let usuarios = [
  { id: 1, nome: "Ana", email: "ana@email.com" },
  { id: 2, name: "Bruno" } // ERRO não detectado: 'name' vs 'nome', falta 'email'
];

usuarios[0].endereco; // undefined - sem erro
usuarios.push({ id: "3" }); // Tipo errado em 'id' - sem erro
```

**Problemas sem tipagem**:
- **Inconsistência de estrutura**: Objetos podem ter propriedades diferentes
- **Typos não detectados**: Erros de digitação em nomes de propriedades
- **Falta de documentação**: Não sabemos quais propriedades esperar
- **IntelliSense ausente**: Editor não sugere propriedades

**TypeScript** resolve com **tipagem de estrutura de objetos**:

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

let usuarios: Usuario[] = [
  { id: 1, nome: "Ana", email: "ana@email.com" },
  { id: 2, name: "Bruno" } 
  // ERRO: 'name' não existe em Usuario
  // ERRO: propriedade 'email' está faltando
];

usuarios[0].endereco; 
// ERRO: 'endereco' não existe em Usuario
```

**Motivação**:
1. **Validação de estrutura**: Garantir consistência de dados
2. **Documentação viva**: Interface documenta formato esperado
3. **IntelliSense robusto**: Editor sugere propriedades corretas
4. **Refatoração segura**: Mudanças em interface propagam por toda codebase

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Estrutura Tipada**: Cada objeto segue interface/type alias definido
2. **Propriedades Obrigatórias vs. Opcionais**: `property?:` para opcionais
3. **Readonly Properties**: `readonly property:` para imutabilidade
4. **Nested Objects**: Objetos aninhados com tipos recursivos
5. **Methods em Interfaces**: Objetos podem ter métodos tipados

### Pilares Fundamentais

- **Interface/Type Alias**: Define estrutura do objeto
- **Property Type Annotations**: Cada propriedade tem tipo
- **Structural Typing**: Compatibilidade baseada em estrutura, não nome
- **Excess Property Checking**: TypeScript detecta propriedades extras
- **Index Signatures**: Permitir propriedades dinâmicas

---

## 🧠 Fundamentos Teóricos

### Sintaxes para Tipagem de Arrays de Objetos

#### 1. Com Interface

```typescript
interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
}

let produtos: Produto[] = [
  { id: 1, nome: "Mouse", preco: 50, estoque: 10 },
  { id: 2, nome: "Teclado", preco: 150, estoque: 5 }
];
```

**Vantagens de interfaces**:
- Reutilizáveis em múltiplos locais
- Podem ser estendidas
- Podem declarar métodos e propriedades computed

#### 2. Com Type Alias

```typescript
type Usuario = {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
};

let usuarios: Usuario[] = [
  { id: 1, nome: "Ana", email: "ana@email.com", ativo: true },
  { id: 2, nome: "Bruno", email: "bruno@email.com", ativo: false }
];
```

**Type alias vs. Interface**: Funcionalmente equivalentes para objetos simples.

#### 3. Com Tipo Literal Inline

```typescript
// Tipo definido diretamente na declaração
let coordenadas: { x: number; y: number; z?: number }[] = [
  { x: 0, y: 0 },
  { x: 10, y: 20, z: 30 }
];
```

**Uso**: Conveniente para tipos usados uma única vez, mas menos reutilizável.

### Propriedades Opcionais

```typescript
interface Config {
  host: string;
  porta: number;
  ssl?: boolean;        // Opcional
  timeout?: number;     // Opcional
}

let configs: Config[] = [
  { host: "localhost", porta: 3000 },                    // OK: opcionais ausentes
  { host: "api.com", porta: 443, ssl: true },           // OK: ssl presente
  { host: "db.com", porta: 5432, timeout: 5000 }        // OK: timeout presente
];

// Acessar propriedade opcional requer verificação
configs.forEach(config => {
  if (config.ssl) {
    console.log("SSL habilitado");
  }
  
  // Ou use optional chaining
  console.log(config.timeout?.toFixed(2));
});
```

### Propriedades Readonly

```typescript
interface Transacao {
  readonly id: string;
  readonly data: Date;
  valor: number;
  descricao: string;
}

let transacoes: Transacao[] = [
  { id: "T001", data: new Date(), valor: 100, descricao: "Compra" }
];

// ❌ ERRO: não pode modificar readonly
// transacoes[0].id = "T002";
// transacoes[0].data = new Date();

// ✅ OK: propriedades não-readonly podem ser modificadas
transacoes[0].valor = 200;
transacoes[0].descricao = "Venda";
```

### Objetos Aninhados

```typescript
interface Endereco {
  rua: string;
  cidade: string;
  cep: string;
}

interface Pessoa {
  nome: string;
  idade: number;
  endereco: Endereco;  // Objeto aninhado
}

let pessoas: Pessoa[] = [
  {
    nome: "Ana",
    idade: 25,
    endereco: {
      rua: "Rua A",
      cidade: "São Paulo",
      cep: "01000-000"
    }
  },
  {
    nome: "Bruno",
    idade: 30,
    endereco: {
      rua: "Rua B",
      cidade: "Rio de Janeiro",
      cep: "20000-000"
    }
  }
];

// Acesso a propriedades aninhadas
pessoas.forEach(p => {
  console.log(`${p.nome} mora em ${p.endereco.cidade}`);
});
```

### Arrays Aninhados

```typescript
interface Pedido {
  id: number;
  cliente: string;
  itens: {
    produto: string;
    quantidade: number;
    preco: number;
  }[];  // Array aninhado
}

let pedidos: Pedido[] = [
  {
    id: 1,
    cliente: "Ana",
    itens: [
      { produto: "Mouse", quantidade: 2, preco: 50 },
      { produto: "Teclado", quantidade: 1, preco: 150 }
    ]
  },
  {
    id: 2,
    cliente: "Bruno",
    itens: [
      { produto: "Monitor", quantidade: 1, preco: 800 }
    ]
  }
];

// Processar arrays aninhados
pedidos.forEach(pedido => {
  let total = pedido.itens.reduce((sum, item) => {
    return sum + (item.quantidade * item.preco);
  }, 0);
  console.log(`Pedido ${pedido.id}: R$ ${total}`);
});
```

---

## 🔍 Análise Conceitual Profunda

### Métodos de Array com Objetos

#### map(): Transformar Objetos

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

let usuarios: Usuario[] = [
  { id: 1, nome: "Ana Silva", email: "ana@email.com" },
  { id: 2, nome: "Bruno Costa", email: "bruno@email.com" }
];

// Extrair apenas nomes
let nomes: string[] = usuarios.map(u => u.nome);
// ["Ana Silva", "Bruno Costa"]

// Transformar para nova estrutura
interface UsuarioSimples {
  id: number;
  nome: string;
}

let simples: UsuarioSimples[] = usuarios.map(u => ({
  id: u.id,
  nome: u.nome
}));

// Adicionar propriedade calculada
interface UsuarioComNomeUpper {
  id: number;
  nome: string;
  nomeUpper: string;
}

let comUpper: UsuarioComNomeUpper[] = usuarios.map(u => ({
  ...u,
  nomeUpper: u.nome.toUpperCase()
}));
```

#### filter(): Filtrar por Propriedades

```typescript
interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
}

let produtos: Produto[] = [
  { id: 1, nome: "Mouse", preco: 50, estoque: 0 },
  { id: 2, nome: "Teclado", preco: 150, estoque: 5 },
  { id: 3, nome: "Monitor", preco: 800, estoque: 2 }
];

// Produtos em estoque
let disponiveis: Produto[] = produtos.filter(p => p.estoque > 0);

// Produtos baratos (preço < 100)
let baratos: Produto[] = produtos.filter(p => p.preco < 100);

// Múltiplas condições
let disponiveisEBaratos: Produto[] = produtos.filter(p => 
  p.estoque > 0 && p.preco < 100
);
```

#### find(): Buscar por Propriedade

```typescript
// Buscar por ID
let produto = produtos.find(p => p.id === 2);
// { id: 2, nome: "Teclado", preco: 150, estoque: 5 } | undefined

// Buscar por nome
let mouse = produtos.find(p => p.nome === "Mouse");

// Com verificação
if (mouse) {
  console.log(`Preço do mouse: R$ ${mouse.preco}`);
}
```

#### sort(): Ordenar por Propriedades

```typescript
// Ordenar por preço (crescente)
let porPreco = [...produtos].sort((a, b) => a.preco - b.preco);

// Ordenar por nome (alfabético)
let porNome = [...produtos].sort((a, b) => 
  a.nome.localeCompare(b.nome)
);

// Ordenar por estoque (decrescente)
let porEstoque = [...produtos].sort((a, b) => b.estoque - a.estoque);
```

#### reduce(): Agregar Dados de Objetos

```typescript
// Soma total de preços
let precoTotal: number = produtos.reduce((sum, p) => sum + p.preco, 0);

// Agrupar por propriedade
interface ProdutosPorEstoque {
  emEstoque: Produto[];
  foraDe Estoque: Produto[];
}

let agrupados = produtos.reduce((acc, p) => {
  if (p.estoque > 0) {
    acc.emEstoque.push(p);
  } else {
    acc.foraDeEstoque.push(p);
  }
  return acc;
}, { emEstoque: [], foraDeEstoque: [] } as ProdutosPorEstoque);

// Converter array em objeto indexado por ID
let porId: Record<number, Produto> = produtos.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<number, Produto>);
// { 1: {...}, 2: {...}, 3: {...} }
```

### Padrões Comuns

#### Pattern 1: CRUD em Arrays de Objetos

```typescript
interface Item {
  id: number;
  nome: string;
  valor: number;
}

class ListaItens {
  private itens: Item[] = [];

  // CREATE
  adicionar(item: Item): void {
    this.itens.push(item);
  }

  // READ
  buscarPorId(id: number): Item | undefined {
    return this.itens.find(i => i.id === id);
  }

  listarTodos(): Item[] {
    return [...this.itens]; // Retorna cópia
  }

  // UPDATE
  atualizar(id: number, dados: Partial<Item>): boolean {
    const index = this.itens.findIndex(i => i.id === id);
    if (index === -1) return false;
    
    this.itens[index] = { ...this.itens[index], ...dados };
    return true;
  }

  // DELETE
  remover(id: number): boolean {
    const index = this.itens.findIndex(i => i.id === id);
    if (index === -1) return false;
    
    this.itens.splice(index, 1);
    return true;
  }
}
```

#### Pattern 2: Validação de Estrutura

```typescript
interface DadosAPI {
  id: number;
  name: string;
  email: string;
}

// Type guard para validar estrutura
function isDadosAPI(obj: any): obj is DadosAPI {
  return (
    typeof obj === "object" &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.email === "string"
  );
}

// Validar array de API
function processarDadosAPI(dados: unknown[]): DadosAPI[] {
  return dados.filter(isDadosAPI);
}
```

#### Pattern 3: Imutabilidade em Updates

```typescript
interface Estado {
  usuarios: Usuario[];
}

let estado: Estado = {
  usuarios: [
    { id: 1, nome: "Ana", email: "ana@email.com" },
    { id: 2, nome: "Bruno", email: "bruno@email.com" }
  ]
};

// ❌ Mutação direta (evitar)
// estado.usuarios[0].nome = "Ana Silva";

// ✅ Imutável: criar novo array
estado = {
  ...estado,
  usuarios: estado.usuarios.map(u =>
    u.id === 1 ? { ...u, nome: "Ana Silva" } : u
  )
};
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Arrays de Objetos

#### Cenário 1: Dados de Banco de Dados

```typescript
interface Registro {
  id: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface Produto extends Registro {
  nome: string;
  preco: number;
  categoria: string;
}

let produtos: Produto[] = await buscarDoBanco();
```

#### Cenário 2: Resposta de API

```typescript
interface UsuarioAPI {
  user_id: number;
  full_name: string;
  email_address: string;
}

async function buscarUsuarios(): Promise<UsuarioAPI[]> {
  const response = await fetch("/api/usuarios");
  return response.json();
}
```

#### Cenário 3: Estado de Aplicação

```typescript
interface Todo {
  id: string;
  texto: string;
  concluido: boolean;
  criadoEm: Date;
}

let todos: Todo[] = [];
```

---

## ⚠️ Limitações e Armadilhas

### Armadilha 1: Propriedades Faltando

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

let usuarios: Usuario[] = [
  { id: 1, nome: "Ana" }  // ERRO: falta 'email'
];
```

### Armadilha 2: Typos em Propriedades

```typescript
let usuarios: Usuario[] = [
  { id: 1, nome: "Ana", emial: "ana@email.com" }
  // ERRO: 'emial' não existe (typo)
];
```

### Armadilha 3: Mutação Acidental

```typescript
const original: Usuario[] = [{ id: 1, nome: "Ana", email: "ana@email.com" }];

// ❌ Referência compartilhada
let copia = original;
copia[0].nome = "Ana Silva"; // Modifica original também!

// ✅ Cópia profunda
let copiaReal = original.map(u => ({ ...u }));
```

---

## 🔗 Interconexões Conceituais

### Relação com Interfaces

Arrays de objetos **dependem** de interfaces/type aliases para definir estrutura.

### Relação com Generics

Métodos de array usam **generics** para preservar tipos:

```typescript
// map<U> transforma T[] em U[]
usuarios.map<string>(u => u.nome); // Usuario[] → string[]
```

---

## 🚀 Próximos Conceitos

1. **Readonly arrays** - Imutabilidade de coleções
2. **Tuplas** - Arrays com tipos fixos
3. **Index signatures** - Propriedades dinâmicas
4. **Utility types** - `Partial`, `Pick`, `Omit`

---

## 📚 Conclusão

Arrays de objetos são **fundamentais** em TypeScript para representar dados estruturados. **Interfaces e type aliases** garantem consistência de estrutura, enquanto **métodos de array** permitem transformações type-safe.

Domine **propriedades opcionais**, **readonly**, **objetos aninhados** e **padrões CRUD** para trabalhar eficientemente com dados complexos mantendo type safety completa.
