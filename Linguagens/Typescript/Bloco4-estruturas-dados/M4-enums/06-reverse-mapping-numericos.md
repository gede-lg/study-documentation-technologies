# Reverse Mapping em Enums Numéricos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Reverse mapping** (mapeamento reverso) é uma característica exclusiva de enums numéricos no TypeScript onde o objeto compilado contém mapeamentos bidirecionais: tanto nome → valor quanto valor → nome. Conceitualmente, é a capacidade de **acessar o nome de um membro enum a partir de seu valor numérico**, criando uma estrutura de dados que funciona em ambas as direções.

Na essência, reverse mapping transforma enums numéricos em dicionários bidirecionais, permitindo navegar tanto de identificadores simbólicos para números quanto de números de volta para seus nomes originais - uma feature única que não existe em enums de string.

## 📋 Fundamentos

### Estrutura do Objeto Runtime

```typescript
enum Direcao {
  Norte,
  Sul,
  Leste,
  Oeste
}

// Objeto JavaScript gerado (runtime):
// {
//   0: "Norte",
//   1: "Sul",
//   2: "Leste",
//   3: "Oeste",
//   Norte: 0,
//   Sul: 1,
//   Leste: 2,
//   Oeste: 3
// }
```

**Conceito:** Cada membro gera **duas propriedades** no objeto - uma para nome→valor e outra para valor→nome.

### Acesso Bidirecional

```typescript
enum Status {
  Inativo,
  Ativo,
  Pendente
}

// Forward mapping (nome → valor)
console.log(Status.Ativo); // 1

// Reverse mapping (valor → nome)
console.log(Status[1]); // "Ativo"
```

## 🔍 Como Funciona Internamente

### Compilação para JavaScript

```typescript
// TypeScript
enum Cor {
  Vermelho,
  Verde,
  Azul
}

// JavaScript compilado
var Cor;
(function (Cor) {
  Cor[Cor["Vermelho"] = 0] = "Vermelho";
  Cor[Cor["Verde"] = 1] = "Verde";
  Cor[Cor["Azul"] = 2] = "Azul";
})(Cor || (Cor = {}));
```

**Análise da expressão `Cor[Cor["Vermelho"] = 0] = "Vermelho"`:**

1. `Cor["Vermelho"] = 0` - Define propriedade `Vermelho: 0` e retorna `0`
2. `Cor[0] = "Vermelho"` - Define propriedade `0: "Vermelho"`

Resultado: Duas propriedades criadas em uma única expressão.

### Valores Explícitos

```typescript
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}

// Objeto runtime:
// {
//   200: "OK",
//   404: "NotFound",
//   500: "ServerError",
//   OK: 200,
//   NotFound: 404,
//   ServerError: 500
// }

console.log(HttpStatus[200]); // "OK"
console.log(HttpStatus.OK);   // 200
```

## 🎯 Casos de Uso

### 1. Logging e Debugging

```typescript
enum TipoEvento {
  Click,
  Scroll,
  KeyPress,
  Submit
}

function registrarEvento(tipo: TipoEvento) {
  const nomeEvento = TipoEvento[tipo];
  console.log(`Evento registrado: ${nomeEvento}`);
}

registrarEvento(TipoEvento.Click);
// "Evento registrado: Click"

// Útil ao receber valores numéricos de APIs
const eventoApi = 2; // Vem da API como número
console.log(`Tipo: ${TipoEvento[eventoApi]}`); // "KeyPress"
```

### 2. Conversão de Valores API

```typescript
enum CodigoResposta {
  Sucesso = 0,
  ErroValidacao = 1,
  ErroServidor = 2,
  NaoAutorizado = 3
}

interface RespostaAPI {
  codigo: number;
  mensagem: string;
}

function processarResposta(resposta: RespostaAPI) {
  const nomeCodigo = CodigoResposta[resposta.codigo];
  console.log(`Status: ${nomeCodigo}`);

  if (resposta.codigo === CodigoResposta.Sucesso) {
    // Processar sucesso
  }
}

// API retorna { codigo: 1, mensagem: "Erro de validação" }
processarResposta({ codigo: 1, mensagem: "..." });
// "Status: ErroValidacao"
```

### 3. Serialização/Deserialização

```typescript
enum Prioridade {
  Baixa,
  Media,
  Alta
}

// Dados vêm do banco como números
const tarefasBD = [
  { titulo: "Bug", prioridade: 2 },
  { titulo: "Feature", prioridade: 1 }
];

tarefasBD.forEach(tarefa => {
  const nomePrioridade = Prioridade[tarefa.prioridade];
  console.log(`${tarefa.titulo} - ${nomePrioridade}`);
});
// "Bug - Alta"
// "Feature - Media"
```

### 4. Validação de Valores

```typescript
enum Status {
  Rascunho,
  Publicado,
  Arquivado
}

function ehStatusValido(valor: number): boolean {
  return Status[valor] !== undefined;
}

console.log(ehStatusValido(1));  // true (Publicado)
console.log(ehStatusValido(99)); // false
```

## ⚠️ Apenas Enums Numéricos

### String Enums Não Têm Reverse Mapping

```typescript
enum Cor {
  Vermelho = "RED",
  Verde = "GREEN",
  Azul = "BLUE"
}

// Objeto runtime:
// {
//   Vermelho: "RED",
//   Verde: "GREEN",
//   Azul: "BLUE"
// }

console.log(Cor.Vermelho);  // "RED" ✅
console.log(Cor["RED"]);    // undefined ❌ (sem reverse mapping)
```

**Motivo:** String enums não criam mapeamento reverso porque causaria ambiguidade e conflitos de chaves.

### Enums Heterogêneos

```typescript
enum Misto {
  Numero = 1,
  Texto = "TEXTO"
}

// Apenas membro numérico tem reverse mapping
console.log(Misto[1]);       // "Numero" ✅
console.log(Misto["TEXTO"]); // undefined ❌
```

## 🔧 Técnicas Avançadas

### Obter Todos os Nomes

```typescript
enum DiaSemana {
  Domingo,
  Segunda,
  Terca,
  Quarta,
  Quinta,
  Sexta,
  Sabado
}

function obterNomesEnum(enumObj: any): string[] {
  return Object.keys(enumObj)
    .filter(key => isNaN(Number(key)));
}

console.log(obterNomesEnum(DiaSemana));
// ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"]
```

### Obter Todos os Valores

```typescript
function obterValoresEnum(enumObj: any): number[] {
  return Object.keys(enumObj)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));
}

console.log(obterValoresEnum(DiaSemana));
// [0, 1, 2, 3, 4, 5, 6]
```

### Conversão Segura

```typescript
enum Nivel {
  Facil,
  Medio,
  Dificil
}

function obterNomeNivel(valor: number): string {
  const nome = Nivel[valor];
  if (nome === undefined) {
    throw new Error(`Valor inválido: ${valor}`);
  }
  return nome;
}

console.log(obterNomeNivel(1)); // "Medio"
// obterNomeNivel(99); // Erro: "Valor inválido: 99"
```

## 📊 Comparação: Com vs Sem Reverse Mapping

```typescript
// Enum numérico - COM reverse mapping
enum StatusNum {
  Ativo,
  Inativo
}

const codigo = 0;
console.log(StatusNum[codigo]); // "Ativo" ✅

// String enum - SEM reverse mapping
enum StatusStr {
  Ativo = "ATIVO",
  Inativo = "INATIVO"
}

const valor = "ATIVO";
// console.log(StatusStr[valor]); // undefined ❌

// Solução para string enums: Object.entries
const entrada = Object.entries(StatusStr)
  .find(([key, val]) => val === valor);
console.log(entrada ? entrada[0] : undefined); // "Ativo"
```

## ⚠️ Limitações e Cuidados

### 1. Poluição do Objeto

Reverse mapping dobra o número de propriedades:

```typescript
enum Pequeno { A, B, C }
// Gera 6 propriedades (3 nomes + 3 valores)

console.log(Object.keys(Pequeno));
// ["0", "1", "2", "A", "B", "C"]
```

### 2. Valores Não-Únicos Causam Sobrescrita

```typescript
enum Duplicado {
  A = 1,
  B = 1  // Mesmo valor
}

// Objeto runtime:
// { 1: "B", A: 1, B: 1 }

console.log(Duplicado[1]); // "B" (último sobrescreve)
```

### 3. Const Enums Não Têm Reverse Mapping

```typescript
const enum SemRuntime {
  A, B, C
}

// Código compilado inline - sem objeto runtime
const valor = SemRuntime.A; // Compila para: const valor = 0;

// ❌ Não funciona - SemRuntime não existe em runtime
// console.log(SemRuntime[0]);
```

## 📚 Conclusão

Reverse mapping é feature exclusiva de enums numéricos que cria mapeamentos bidirecionais, essencial para:

- Logging e debugging de valores numéricos recebidos de APIs/BDs
- Conversão entre representações numéricas e textuais
- Validação de valores numéricos
- Serialização/deserialização de dados

Compreender reverse mapping é dominar a natureza dual de enums numéricos no TypeScript - tanto tipos compile-time quanto objetos runtime bidirecionais, diferenciando-os fundamentalmente de enums de string e const enums.
