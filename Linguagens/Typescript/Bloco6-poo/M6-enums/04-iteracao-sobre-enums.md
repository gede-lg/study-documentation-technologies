# Iteração sobre Enums

## 🎯 Introdução e Definição

### Definição Conceitual

**Iteração sobre enums** é o processo de **percorrer dinamicamente** os membros de um enum em TypeScript para obter suas **chaves (nomes)** e **valores**. Como enums compilam para objetos JavaScript em runtime, podem ser iterados usando métodos de objetos como `Object.keys()`, `Object.values()`, `Object.entries()`, `for...in`, etc. Esta capability permite **processar enums genericamente** - criar dropdowns, validar inputs, gerar documentação, implementar utilities.

Conceitualmente, iteração sobre enums trata enums como **coleções dinâmicas** ao invés de tipos estáticos. Enquanto TypeScript conhece membros de enum em compile-time, iteração acessa enum como **estrutura de dados runtime**, permitindo operações como filter, map, reduce sobre seus membros.

### Contexto Histórico e Motivação

A evolução de iteração sobre enums:

**JavaScript Tradicional:** Objetos sempre foram iteráveis com `for...in`, `Object.keys()`, etc.

**TypeScript Enums:** Como compilam para objetos JavaScript, herdam iterabilidade. Porém, **numeric enums** têm peculiaridade - **reverse mapping** cria entradas duplicadas (nome→valor e valor→nome), complicando iteração.

**Problema que motivou soluções:**
```typescript
enum Cor { Vermelho, Verde, Azul }

Object.keys(Cor);  
// ["0", "1", "2", "Vermelho", "Verde", "Azul"] - duplicado!
```

**Solução:** Filtrar chaves numéricas vs string para separar nomes de valores.

**String Enums (TypeScript 2.4+):** Simplificaram iteração - sem reverse mapping, `Object.keys()` retorna apenas nomes.

**Motivação para iterar:**
- **UI Generation:** Popular dropdowns com valores enum
- **Validation:** Verificar se valor pertence a enum
- **Documentation:** Gerar listas de valores possíveis
- **Testing:** Iterar sobre todos cases de enum

### Problema Fundamental que Resolve

Iteração sobre enums resolve problemas práticos:

**1. Dynamic UI Generation**
```typescript
enum Status {
  Ativo = "ativo",
  Inativo = "inativo",
  Pendente = "pendente"
}

// Gerar <select> options dinamicamente
const options = Object.values(Status).map(valor => 
  `<option value="${valor}">${valor}</option>`
);
```

**2. Runtime Validation**
```typescript
enum Permissao {
  Ler = "ler",
  Escrever = "escrever"
}

function isPermissao(valor: string): valor is Permissao {
  return Object.values(Permissao).includes(valor as Permissao);
}

isPermissao("ler");     // true
isPermissao("deletar"); // false
```

**3. Enum Conversion**
```typescript
enum Prioridade {
  Baixa = 1,
  Media = 5,
  Alta = 10
}

function fromNumero(n: number): Prioridade | undefined {
  return Object.values(Prioridade).find(v => v === n);
}
```

**4. Iteration for Processing**
```typescript
enum TipoArquivo {
  Texto = ".txt",
  Imagem = ".jpg",
  Video = ".mp4"
}

// Obter todas extensões
const extensoes = Object.values(TipoArquivo);  
// [".txt", ".jpg", ".mp4"]
```

### Importância no Ecossistema

Iteração sobre enums é importante porque:

- **Dynamic Forms:** Frameworks frontend iteram enums para criar form controls
- **API Documentation:** Tools geram docs listando valores possíveis de enums
- **Testing:** Testes parametrizados iteram sobre valores enum
- **Validation Libraries:** Bibliotecas validam inputs contra enums
- **Code Generation:** Generators iteram enums para criar boilerplate

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Runtime Object:** Enums são objetos JavaScript em runtime
2. **Numeric Reverse Mapping:** Numeric enums têm entradas bidirecionais
3. **String Simplicity:** String enums têm apenas nome→valor
4. **Standard Methods:** `Object.keys()`, `Object.values()`, `Object.entries()`
5. **Filtering:** Numeric enums requerem filtering para separar nomes/valores

### Pilares Fundamentais

- **Object.keys():** Retorna array de chaves (nomes)
- **Object.values():** Retorna array de valores
- **Object.entries():** Retorna array de pares [chave, valor]
- **for...in:** Itera sobre chaves enumeráveis
- **Filtering:** `isNaN(Number(key))` filtra nomes vs valores

### Visão Geral das Nuances

- **Numeric Enum:** Retorna nomes E valores (reverse mapping)
- **String Enum:** Retorna apenas nomes
- **Type Safety:** Iteração é runtime, perde type safety
- **Order:** Ordem de iteração é ordem de declaração
- **Const Enum:** Não pode ser iterado (não existe em runtime)

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Numeric Enum Structure

```typescript
enum Direcao {
  Cima,     // 0
  Baixo,    // 1
  Esquerda, // 2
  Direita   // 3
}

// Objeto JavaScript resultante:
{
  0: "Cima",
  1: "Baixo",
  2: "Esquerda",
  3: "Direita",
  Cima: 0,
  Baixo: 1,
  Esquerda: 2,
  Direita: 3
}
```

**Análise profunda:**
- **8 propriedades:** 4 nome→valor + 4 valor→nome
- **Keys:** `["0", "1", "2", "3", "Cima", "Baixo", "Esquerda", "Direita"]`
- **Values:** `["Cima", "Baixo", "Esquerda", "Direita", 0, 1, 2, 3]`

**Desafio:** Como separar nomes de valores?

**Solução:** Filtrar por tipo de chave:
```typescript
const nomes = Object.keys(Direcao).filter(k => isNaN(Number(k)));
// ["Cima", "Baixo", "Esquerda", "Direita"]

const valores = Object.keys(Direcao).filter(k => !isNaN(Number(k)));
// ["0", "1", "2", "3"]
```

#### String Enum Structure

```typescript
enum Status {
  Ativo = "ativo",
  Inativo = "inativo"
}

// Objeto JavaScript resultante:
{
  Ativo: "ativo",
  Inativo: "inativo"
}
```

**Análise profunda:**
- **2 propriedades:** Apenas nome→valor
- **Keys:** `["Ativo", "Inativo"]`
- **Values:** `["ativo", "inativo"]`

**Simplicidade:** Sem reverse mapping, iteração é direta.

### Princípios e Conceitos Subjacentes

#### Object.keys() - Array de Chaves

```typescript
enum Cor {
  Vermelho = 0,
  Verde = 1,
  Azul = 2
}

const chaves = Object.keys(Cor);
console.log(chaves);
// ["0", "1", "2", "Vermelho", "Verde", "Azul"]

// Filtrar para obter apenas nomes
const nomes = Object.keys(Cor).filter(k => isNaN(Number(k)));
console.log(nomes);  // ["Vermelho", "Verde", "Azul"]
```

**Conceito crucial:** `Object.keys()` retorna todas chaves - tanto nomes quanto valores numéricos (como strings).

#### Object.values() - Array de Valores

```typescript
enum Status {
  Ativo = "ativo",
  Inativo = "inativo"
}

const valores = Object.values(Status);
console.log(valores);  // ["ativo", "inativo"]
```

**Para numeric enum:**
```typescript
enum Prioridade {
  Baixa = 1,
  Media = 5,
  Alta = 10
}

const todosValores = Object.values(Prioridade);
console.log(todosValores);  
// ["Baixa", "Media", "Alta", 1, 5, 10] - nomes E números

// Filtrar apenas números
const apenasNumeros = Object.values(Prioridade).filter(v => typeof v === "number");
console.log(apenasNumeros);  // [1, 5, 10]
```

**Análise profunda:** `Object.values()` retorna mix de nomes e valores em numeric enums.

#### Object.entries() - Array de Pares

```typescript
enum Tamanho {
  P = "pequeno",
  M = "medio",
  G = "grande"
}

const entradas = Object.entries(Tamanho);
console.log(entradas);
// [["P", "pequeno"], ["M", "medio"], ["G", "grande"]]

// Usar para criar Map
const mapa = new Map(entradas);
console.log(mapa.get("M"));  // "medio"
```

**Fundamento teórico:** `Object.entries()` retorna pares [chave, valor], útil para transformações.

### Modelo Mental para Compreensão

Pense em enum como **objeto dicionário**:

**String Enum:**
```
Dicionário Inglês→Português
{
  "Hello": "Olá",
  "Goodbye": "Tchau"
}
```
- **Keys:** Palavras em inglês
- **Values:** Traduções em português
- **Iteração:** Direta sobre chaves ou valores

**Numeric Enum:**
```
Dicionário Bidirecional
{
  "Zero": 0,
  0: "Zero",
  "Um": 1,
  1: "Um"
}
```
- **Keys:** Mix de palavras e números
- **Values:** Mix de números e palavras
- **Iteração:** Requer filtering para separar

## 🔍 Análise Conceitual Profunda

### Iterar Nomes de String Enum

```typescript
enum Metodo {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

// Obter todos os nomes (chaves)
const nomes = Object.keys(Metodo);
console.log(nomes);  // ["GET", "POST", "PUT", "DELETE"]

// Iterar com forEach
Object.keys(Metodo).forEach(nome => {
  console.log(`Nome: ${nome}`);
});

// Iterar com for...of
for (const nome of Object.keys(Metodo)) {
  console.log(nome);
}
```

**Análise teórica:** String enums têm iteração simples - `Object.keys()` retorna apenas nomes.

### Iterar Valores de String Enum

```typescript
enum TipoArquivo {
  Texto = ".txt",
  Imagem = ".jpg",
  Video = ".mp4"
}

// Obter todos os valores
const extensoes = Object.values(TipoArquivo);
console.log(extensoes);  // [".txt", ".jpg", ".mp4"]

// Usar em operações
const temTxt = extensoes.includes(".txt");  // true
const uppercase = extensoes.map(ext => ext.toUpperCase());
```

**Fundamento conceitual:** `Object.values()` extrai valores para processamento.

### Iterar Numeric Enum - Apenas Nomes

```typescript
enum Direcao {
  Cima,
  Baixo,
  Esquerda,
  Direita
}

// Método 1: Filtrar com isNaN
const nomes1 = Object.keys(Direcao).filter(k => isNaN(Number(k)));
console.log(nomes1);  // ["Cima", "Baixo", "Esquerda", "Direita"]

// Método 2: Filtrar com typeof
const nomes2 = Object.keys(Direcao).filter(k => typeof Direcao[k as any] === "number");
console.log(nomes2);  // ["Cima", "Baixo", "Esquerda", "Direita"]
```

**Análise profunda:** Filtering é necessário porque `Object.keys()` retorna tanto nomes quanto valores numéricos.

### Iterar Numeric Enum - Apenas Valores

```typescript
enum Status {
  Pendente = 0,
  Ativo = 1,
  Inativo = 2
}

// Obter apenas valores numéricos
const valores = Object.values(Status).filter(v => typeof v === "number");
console.log(valores);  // [0, 1, 2]

// Ou filtrar keys numéricas
const valores2 = Object.keys(Status)
  .filter(k => !isNaN(Number(k)))
  .map(k => Number(k));
console.log(valores2);  // [0, 1, 2]
```

**Conceito avançado:** Múltiplas abordagens para extrair valores numéricos.

### for...in Loop

```typescript
enum Cor {
  Vermelho = "red",
  Verde = "green",
  Azul = "blue"
}

// Iterar com for...in
for (const chave in Cor) {
  console.log(`${chave}: ${Cor[chave as keyof typeof Cor]}`);
}
// Vermelho: red
// Verde: green
// Azul: blue
```

**Fundamento teórico:** `for...in` itera sobre propriedades enumeráveis, incluindo enums.

### Object.entries() para Map/Reduce

```typescript
enum Prioridade {
  Baixa = 1,
  Media = 5,
  Alta = 10
}

// Filtrar entries para numeric values
const entries = Object.entries(Prioridade)
  .filter(([k, v]) => typeof v === "number");

console.log(entries);
// [["Baixa", 1], ["Media", 5], ["Alta", 10]]

// Criar objeto invertido (valor→nome)
const invertido = Object.fromEntries(
  entries.map(([k, v]) => [v, k])
);
console.log(invertido);  // { 1: "Baixa", 5: "Media", 10: "Alta" }
```

**Análise profunda:** `Object.entries()` permite transformações complexas.

### Map/Filter/Reduce sobre Enums

```typescript
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalError = 500
}

// Filtrar apenas erros (4xx, 5xx)
const codigosErro = Object.values(HttpStatus)
  .filter(v => typeof v === "number" && v >= 400);

console.log(codigosErro);  // [400, 401, 404, 500]

// Map para criar mensagens
const mensagens = Object.entries(HttpStatus)
  .filter(([k, v]) => typeof v === "number")
  .map(([nome, codigo]) => `${codigo}: ${nome}`);

console.log(mensagens);
// ["200: OK", "201: Created", "400: BadRequest", ...]
```

**Conceito avançado:** Enums podem ser processados com array methods.

### Criar Array de Objetos

```typescript
enum TipoConta {
  Corrente = "corrente",
  Poupanca = "poupanca",
  Salario = "salario"
}

// Gerar array de options para <select>
const options = Object.entries(TipoConta).map(([nome, valor]) => ({
  label: nome,
  value: valor
}));

console.log(options);
// [
//   { label: "Corrente", value: "corrente" },
//   { label: "Poupanca", value: "poupanca" },
//   { label: "Salario", value: "salario" }
// ]
```

**Análise profunda:** Iteração permite gerar estruturas para UIs.

### Validation com Iteração

```typescript
enum Role {
  Admin = "admin",
  User = "user",
  Guest = "guest"
}

function isValidRole(valor: string): valor is Role {
  return Object.values(Role).includes(valor as Role);
}

console.log(isValidRole("admin"));    // true
console.log(isValidRole("superuser")); // false

// Type guard em ação
function processRole(valor: string) {
  if (isValidRole(valor)) {
    const role: Role = valor;  // ✅ Type narrowing
    console.log(`Role válido: ${role}`);
  }
}
```

**Fundamento teórico:** Iteração sobre valores permite validação runtime com type guard.

### Enum Length (Count)

```typescript
enum Tamanho {
  P, M, G, GG
}

// Contar membros de numeric enum
const count = Object.keys(Tamanho).filter(k => isNaN(Number(k))).length;
console.log(count);  // 4

// String enum - direto
enum Cor {
  Vermelho = "red",
  Verde = "green"
}

const count2 = Object.keys(Cor).length;
console.log(count2);  // 2
```

**Conceito avançado:** Obter quantidade de membros dinamicamente.

### Reverse Lookup Helper

```typescript
enum Nivel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3
}

// Helper para obter nome a partir de valor
function getNomeNivel(valor: number): string | undefined {
  return Nivel[valor];  // Reverse mapping built-in
}

console.log(getNomeNivel(2));  // "Warn"

// Para string enum (sem reverse mapping), criar helper:
enum Status {
  Ativo = "ativo",
  Inativo = "inativo"
}

function getNomeStatus(valor: string): string | undefined {
  return Object.entries(Status).find(([k, v]) => v === valor)?.[0];
}

console.log(getNomeStatus("ativo"));  // "Ativo"
```

**Análise profunda:** Numeric enums têm reverse mapping nativo; string enums precisam helper.

### Iterate para Generate Types

```typescript
enum Permissao {
  Ler = "ler",
  Escrever = "escrever",
  Executar = "executar"
}

// Gerar union type de valores
type PermissaoValor = `${Permissao}`;  
// "ler" | "escrever" | "executar"

// Gerar mapped type
type PermissaoFlags = {
  [K in keyof typeof Permissao]: boolean;
};
// { Ler: boolean; Escrever: boolean; Executar: boolean }
```

**Conceito avançado:** Iteração conceitual em types (não runtime).

### Const Enum - Não Iterável

```typescript
const enum Tamanho {
  P, M, G
}

// ❌ Não pode iterar - enum não existe em runtime
// Object.keys(Tamanho);  // Erro: 'Tamanho' only refers to a type
```

**Limitação:** `const enum` é inline em compile-time, desaparece em runtime.

## 🎯 Aplicabilidade e Contextos

### Populate Dropdown (React)

```typescript
enum Status {
  Ativo = "ativo",
  Inativo = "inativo",
  Pendente = "pendente"
}

function StatusSelect() {
  return (
    <select>
      {Object.entries(Status).map(([nome, valor]) => (
        <option key={valor} value={valor}>
          {nome}
        </option>
      ))}
    </select>
  );
}
```

**Raciocínio:** Iterar enum para gerar options dinamicamente.

### Validation Function

```typescript
enum TipoPagamento {
  Cartao = "cartao",
  Boleto = "boleto",
  Pix = "pix"
}

function validarTipoPagamento(tipo: string): boolean {
  return Object.values(TipoPagamento).includes(tipo as TipoPagamento);
}
```

**Raciocínio:** Validar input contra valores permitidos.

### Generate Documentation

```typescript
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT"
}

function gerarDocumentacao(): string {
  const metodos = Object.values(HttpMethod).join(", ");
  return `Métodos permitidos: ${metodos}`;
}

console.log(gerarDocumentacao());
// "Métodos permitidos: GET, POST, PUT"
```

**Raciocínio:** Gerar docs automaticamente a partir de enum.

### Testing - Parametrized Tests

```typescript
enum Operacao {
  Somar = "+",
  Subtrair = "-",
  Multiplicar = "*"
}

describe("Calculadora", () => {
  Object.entries(Operacao).forEach(([nome, simbolo]) => {
    it(`deve executar ${nome}`, () => {
      // Test logic usando simbolo
    });
  });
});
```

**Raciocínio:** Gerar testes para cada valor de enum.

### Convert to Array for UI Library

```typescript
enum Prioridade {
  Baixa = 1,
  Media = 5,
  Alta = 10
}

// Formato esperado por biblioteca UI
const prioridadeOptions = Object.entries(Prioridade)
  .filter(([k, v]) => typeof v === "number")
  .map(([label, value]) => ({ label, value }));

// [
//   { label: "Baixa", value: 1 },
//   { label: "Media", value: 5 },
//   { label: "Alta", value: 10 }
// ]
```

**Raciocínio:** Transformar enum em formato de biblioteca terceira.

## ⚠️ Limitações e Considerações Teóricas

### Numeric Enum Complexity

```typescript
enum Nivel { Debug, Info }

Object.keys(Nivel);  
// ["0", "1", "Debug", "Info"] - confuso
```

**Limitação:** Reverse mapping complica iteração. Requer filtering.

### Type Safety Loss

```typescript
enum Status { Ativo, Inativo }

const chave = Object.keys(Status)[0];  // string, não keyof typeof Status
```

**Limitação:** Iteração retorna `string[]`, não tipos enum específicos.

### Const Enum Not Iterable

```typescript
const enum Cor { Vermelho, Verde }

// Object.keys(Cor);  // ❌ Erro
```

**Limitação:** `const enum` não existe em runtime.

### Order Dependency

```typescript
enum Ordem { C = 3, A = 1, B = 2 }

Object.keys(Ordem);
// Ordem de declaração, não alfabética ou numérica
```

**Análise:** Iteração segue ordem de declaração, não sorting.

## 🔗 Interconexões Conceituais

**Relação com Object Methods:** Enums são objetos, herdam métodos de Object.

**Relação com Type Guards:** Iteração permite criar type guards para validação.

**Relação com UI Frameworks:** Frameworks iteram enums para gerar form controls.

**Relação com Validation Libraries:** Bibliotecas usam iteração para validar schemas.

## 🚀 Evolução e Próximos Conceitos

Dominar iteração sobre enums prepara para:
- **Generic Utilities:** Criar funções genéricas que operam em qualquer enum
- **Runtime Reflection:** Explorar estruturas de tipos em runtime
- **Code Generation:** Gerar código a partir de enums
- **Advanced Patterns:** Discriminated unions, type guards, validation schemas
