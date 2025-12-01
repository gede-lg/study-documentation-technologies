# Quando Anotar Tipos: Guia de Melhores Práticas e Decisões Estratégicas

## 🎯 Introdução e Definição

"Quando anotar tipos" é **framework de decisão estratégica** para determinar quando usar anotações explícitas vs. confiar em inferência do TypeScript, baseado em **contexto, propósito, visibilidade e complexidade** do código. Conceitualmente, representa **balanceamento entre custos e benefícios**: anotações adicionam verbosidade e manutenção, mas oferecem documentação, contratos rígidos e prevenção de erros. Decisão ótima depende de **superfície de API, ciclo de vida do código, clareza necessária e garantias desejadas**.

## 📋 Sumário Conceitual

**Fatores de Decisão:**
1. **Visibilidade:** Público vs. Privado
2. **Complexidade:** Simples vs. Complexo
3. **Clareza:** Óbvio vs. Ambíguo
4. **Vida Útil:** Temporário vs. Duradouro
5. **Refatoração:** Estável vs. Volátil
6. **Documentação:** Autodescritivo vs. Requer Explicação

**Conceito Central:** Anotar estrategicamente - **máximo benefício, mínima verbosidade**.

## 🧠 Fundamentos Teóricos

### Matriz de Decisão

**Anotar SEMPRE:**
- ✅ Parâmetros de função
- ✅ APIs públicas (exports)
- ✅ Declarações sem inicialização
- ✅ Propriedades de classe
- ✅ Dados externos (JSON, APIs)

**Anotar FREQUENTEMENTE:**
- 🟡 Retornos de funções públicas
- 🟡 Tipos complexos (unions, tuples)
- 🟡 Variáveis de longa vida
- 🟡 Estado mutável

**Inferência OK:**
- ⚪ Primitivos com inicialização óbvia
- ⚪ Variáveis locais de escopo curto
- ⚪ Retorno de funções simples
- ⚪ Implementações privadas

**NUNCA Anotar (redundante):**
- ❌ Primitivos óbvios: `const x: number = 42`
- ❌ Duplicação de tipos: anotação idêntica à inferência

## 🔍 Análise Detalhada por Contexto

### 1. Parâmetros de Função

**Regra:** **SEMPRE anotar parâmetros.**

**Justificativa:** TypeScript não pode inferir tipos de argumentos futuros.

```typescript
// ❌ NUNCA - parâmetros são 'any'
function processar(dados, opcoes) {
  // Sem type safety
}

// ✅ SEMPRE - type-safe
function processar(dados: string, opcoes: Opcoes) {
  // Compilador valida argumentos
}
```

**Exceção:** Callbacks com contextual typing.

```typescript
// Inferência OK - tipo conhecido pelo contexto
[1, 2, 3].map(n => n * 2);  // 'n' inferido como number

// Mas explícito também é válido
[1, 2, 3].map((n: number) => n * 2);
```

### 2. Retornos de Função

**Regra:** **Anotar APIs públicas; inferência OK para privadas.**

**APIs Públicas:**
```typescript
// ✅ Explícito - contrato claro
export function calcular(x: number, y: number): number {
  return x + y;
}

export async function buscarUsuario(id: string): Promise<Usuario> {
  // ...
}
```

**Implementações Privadas:**
```typescript
class Processador {
  // Inferência OK - método privado
  private helper(x: number) {
    return x * 2;  // Inferido: number
  }

  // ✅ Explícito - método público
  public processar(dados: string[]): Resultado {
    // ...
  }
}
```

**Funções Complexas:**
```typescript
// ✅ Anotar - múltiplos caminhos de retorno
function processar(condicao: boolean): string | number {
  if (condicao) {
    return "sucesso";
  } else {
    return 404;
  }
}
```

### 3. Variáveis

**Primitivos com Inicialização:**
```typescript
// Inferência OK - tipo óbvio
const nome = "João";          // string
const idade = 30;             // number
const ativo = true;           // boolean

// ❌ REDUNDANTE
const nome: string = "João";
```

**Declaração sem Inicialização:**
```typescript
// ✅ SEMPRE anotar - previne 'any'
let token: string;
if (autenticado) {
  token = gerarToken();
}

// ❌ Perigoso - 'any' inferido
let token;
```

**Tipos Mais Restritos:**
```typescript
// ✅ Anotar - restringir além de inferência
let status: "ativo" | "inativo" | "pendente" = "ativo";
// Sem anotação, seria: string (muito amplo)

const cores: readonly string[] = ["vermelho", "azul", "verde"];
// Sem anotação, seria: string[] (mutável)
```

**Variáveis Complexas:**
```typescript
// ✅ Anotar - documenta estrutura
const configuracao: AppConfig = {
  api: { url: "...", timeout: 5000 },
  cache: { enabled: true, ttl: 3600 }
};

// vs. Inferência (menos claro ao ler)
const configuracao = {
  api: { url: "...", timeout: 5000 },
  cache: { enabled: true, ttl: 3600 }
};
```

### 4. Propriedades de Classe

**Regra:** **SEMPRE anotar propriedades de classe.**

```typescript
class Usuario {
  // ✅ Sempre anotar
  id: number;
  nome: string;
  email: string;
  ativo: boolean = true;  // Pode ter inicialização

  // ✅ Propriedades opcionais
  telefone?: string;

  // ✅ Readonly
  readonly criadoEm: Date = new Date();

  constructor(id: number, nome: string, email: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
  }
}
```

**Property Parameter Shorthand:**
```typescript
class Produto {
  // Parâmetros do construtor viram propriedades
  constructor(
    public id: number,
    public nome: string,
    private preco: number
  ) {}
}
```

### 5. Arrays

**Elementos Homogêneos:**
```typescript
// Inferência OK - tipo claro
const numeros = [1, 2, 3, 4, 5];  // number[]
const nomes = ["Ana", "Bruno"];   // string[]

// ✅ Anotar quando vazio (documenta intenção)
const usuarios: Usuario[] = [];
```

**Arrays Heterogêneos:**
```typescript
// ✅ Anotar - clarifica union
const misto: (string | number)[] = ["texto", 42];

// Inferência OK se tipos óbvios
const valores = [1, "dois", 3];  // (number | string)[]
```

**Tuplas:**
```typescript
// ✅ SEMPRE anotar tuplas - estrutura fixa
const coordenada: [number, number] = [10, 20];
const usuario: [string, number] = ["João", 30];
```

### 6. Objetos

**Objetos Simples:**
```typescript
// Inferência OK - estrutura óbvia
const pessoa = {
  nome: "Maria",
  idade: 25
};
// Inferido: { nome: string; idade: number }

// ✅ Anotar se tipo reutilizável
const pessoa: Pessoa = {
  nome: "Maria",
  idade: 25
};
```

**Objetos Complexos:**
```typescript
// ✅ Anotar - documenta estrutura complexa
const config: ConfigAPI = {
  endpoints: {
    usuarios: "/api/users",
    produtos: "/api/products"
  },
  autenticacao: {
    tipo: "bearer",
    headerName: "Authorization"
  },
  retry: {
    maxTentativas: 3,
    delay: 1000
  }
};
```

### 7. Dados Externos

**Regra:** **SEMPRE validar e tipar dados externos.**

**APIs:**
```typescript
// ❌ Perigoso - tipo 'any'
const dados = await fetch("/api/users").then(r => r.json());

// ✅ Anotar ou validar
const dados: Usuario[] = await fetch("/api/users").then(r => r.json());

// ✅✅ MELHOR - validar com library (Zod, io-ts)
const dados = UsuarioSchema.parse(
  await fetch("/api/users").then(r => r.json())
);
```

**Inputs do Usuário:**
```typescript
// ✅ Sempre tipar e validar
const idadeInput = document.querySelector<HTMLInputElement>("#idade")!;
const idade: number = Number(idadeInput.value);

if (isNaN(idade)) {
  throw new Error("Idade inválida");
}
```

**LocalStorage/SessionStorage:**
```typescript
// ✅ Validar dados recuperados
const dadosSalvos = localStorage.getItem("usuario");
let usuario: Usuario | null = null;

if (dadosSalvos) {
  const parsed = JSON.parse(dadosSalvos);
  usuario = validarUsuario(parsed);  // Validação runtime
}
```

### 8. Callbacks e Event Handlers

**Contextual Typing:**
```typescript
// Inferência OK - tipo conhecido pelo contexto
button.addEventListener("click", (event) => {
  // 'event' inferido como MouseEvent
  console.log(event.clientX);
});

// Explícito também válido (redundante)
button.addEventListener("click", (event: MouseEvent) => {
  console.log(event.clientX);
});
```

**Callbacks Customizados:**
```typescript
// ✅ Tipo de callback deve ser explícito
type Callback = (erro: Error | null, dados?: string) => void;

function executar(callback: Callback) {
  // ...
}

// Parâmetro de callback inferido
executar((erro, dados) => {
  // 'erro' e 'dados' inferidos pelo tipo Callback
});
```

## 🎯 Princípios Orientadores

### Princípio 1: Superfície de API

**APIs Públicas → Sempre Explícito**
```typescript
// ✅ Módulos exportados
export function processar(entrada: Dados): Resultado {
  // ...
}

export const CONFIGURACAO: Config = loadConfig();
```

**Implementação Interna → Inferência OK**
```typescript
// Funções/variáveis privadas podem usar inferência
function helper(x: number) {
  const dobro = x * 2;  // Inferido: number
  return dobro;
}
```

### Princípio 2: Clareza ao Leitor

**Se tipo não é óbvio → Anotar**
```typescript
// ✅ Anotar - tipo não óbvio
const resultado: Resultado = processarDados(entrada);

// Inferência OK - tipo óbvio
const mensagem = "Operação concluída";
```

### Princípio 3: Prevenção de Erros

**Código crítico → Anotar**
```typescript
// ✅ Validação crítica - explicitar tipo
function transferir(
  origem: Conta,
  destino: Conta,
  valor: number
): ResultadoTransferencia {
  // Tipo explícito previne erros
}
```

### Princípio 4: Documentação

**Código autodocumentado → Menos anotações**
```typescript
// Inferência OK - nomes descritivos
const quantidadeItensCarrinho = 5;
const precoTotalComDesconto = 89.90;

// ✅ Anotar quando tipo agrega informação
const timeout: Milliseconds = 5000;  // Type alias documenta unidade
```

### Princípio 5: Ciclo de Vida

**Código temporário → Inferência OK**
```typescript
// Script de uso único
const temp = JSON.parse(data);
console.log(temp.value);
```

**Código de produção → Anotar estrategicamente**
```typescript
// Sistema de produção
export class UsuarioService {
  async buscar(id: string): Promise<Usuario | null> {
    // Contratos explícitos
  }
}
```

## 🎯 Checklist de Decisão

**Pergunte-se:**

1. **É parâmetro de função?** → ✅ Anotar
2. **É API pública (export)?** → ✅ Anotar
3. **Declaração sem inicialização?** → ✅ Anotar
4. **Propriedade de classe?** → ✅ Anotar
5. **Dados externos?** → ✅ Anotar + validar
6. **Tipo mais restrito que inferência?** → ✅ Anotar
7. **Tipo complexo/ambíguo?** → ✅ Anotar
8. **Primitivo óbvio?** → ⚪ Inferência OK
9. **Variável local temporária?** → ⚪ Inferência OK
10. **Implementação privada simples?** → ⚪ Inferência OK

## ⚠️ Armadilhas

### 1. Over-Annotation (Anotação Excessiva)

```typescript
// ❌ Redundante
const numero: number = 42;
const texto: string = "oi";
const flag: boolean = true;

// ✅ Conciso
const numero = 42;
const texto = "oi";
const flag = true;
```

### 2. Under-Annotation (Anotação Insuficiente)

```typescript
// ❌ Perigoso - parâmetros 'any'
function processar(dados, opcoes) {
  // ...
}

// ❌ Perigoso - 'any' inferido
let valor;
valor = fetchData();
```

### 3. Ignorar Dados Externos

```typescript
// ❌ Confiança cega
const usuario = JSON.parse(localStorage.getItem("user")!);
usuario.email.toLowerCase();  // Runtime error se estrutura errada

// ✅ Validar
const usuario: Usuario = validarUsuario(
  JSON.parse(localStorage.getItem("user")!)
);
```

## 📚 Conclusão

**Quando anotar tipos** é decisão estratégica baseada em **visibilidade, complexidade, clareza e propósito**. TypeScript oferece inferência poderosa, mas anotações explícitas agregam **documentação, contratos rígidos e prevenção de erros**.

**Regras de Ouro:**
1. **SEMPRE:** Parâmetros, APIs públicas, propriedades de classe
2. **FREQUENTEMENTE:** Retornos públicos, dados externos, tipos complexos
3. **RARAMENTE:** Primitivos óbvios, variáveis locais, implementações privadas simples
4. **NUNCA:** Redundâncias que duplicam inferência

**Balanceamento Ideal:**
- **APIs públicas:** Explícitas (contratos claros)
- **Implementação interna:** Inferência (concisão)
- **Dados externos:** Validação + tipagem (segurança)
- **Código crítico:** Explícito (prevenção de erros)

**Anotação estratégica = máxima type safety + mínima verbosidade + documentação viva.**
