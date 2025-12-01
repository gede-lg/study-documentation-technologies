# Const Enums no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Const enums** são enums marcados com o modificador `const` que são completamente **removidos durante compilação**, sendo substituídos por seus valores literais inline. Conceitualmente, são uma **otimização de performance** que elimina o overhead de runtime dos enums tradicionais, mantendo type safety em compile time.

Na essência, const enums são "enums fantasma" - existem apenas no TypeScript, desaparecendo completamente no JavaScript compilado.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
const enum Direcao {
  Norte,
  Sul,
  Leste,
  Oeste
}

const direcao = Direcao.Norte;
```

### Compilação (Inlining)

```typescript
// TypeScript
const enum Cor {
  Vermelho = 0,
  Verde = 1,
  Azul = 2
}

const corFavorita = Cor.Verde;

// JavaScript compilado
const corFavorita = 1; // Valor inline, enum desapareceu!
```

**Diferença de enum normal:**

```typescript
// Enum normal
enum CorNormal {
  Vermelho, Verde, Azul
}
const cor = CorNormal.Verde;

// JavaScript compilado - gera objeto
var CorNormal;
(function (CorNormal) {
  CorNormal[0] = "Vermelho";
  CorNormal[1] = "Verde";
  CorNormal[2] = "Azul";
})(CorNormal || (CorNormal = {}));
const cor = CorNormal.Verde;
```

## 🎯 Vantagens

### 1. Zero Runtime Overhead

```typescript
const enum Status {
  Ativo = "ATIVO",
  Inativo = "INATIVO"
}

function verificar(status: Status) {
  if (status === Status.Ativo) {
    // ...
  }
}

// Compila para:
// function verificar(status) {
//   if (status === "ATIVO") {
//     // ...
//   }
// }
```

**Benefício:** Nenhum código JavaScript adicional gerado.

### 2. Bundle Size Menor

Ideal para bibliotecas e aplicações onde tamanho importa:

```typescript
const enum CodigoErro {
  NaoAutorizado = 401,
  NaoEncontrado = 404,
  ErroServidor = 500
}

// Uso é substituído por valores literais
throw new Error(`Código ${CodigoErro.NaoEncontrado}`);
// Compila para:
// throw new Error(`Código ${404}`);
```

### 3. Type Safety Mantida

```typescript
const enum Prioridade {
  Baixa, Media, Alta
}

function definir(p: Prioridade) { }

definir(Prioridade.Alta); // OK
// definir(999); // Erro de tipo
```

## ⚠️ Limitações

### 1. Sem Objeto Runtime

```typescript
const enum Animal {
  Cachorro, Gato
}

// ❌ Erro - Animal não existe em runtime
// console.log(Animal);
// Object.keys(Animal); // Erro
```

### 2. Sem Acesso Computed

```typescript
const enum Nivel {
  Um = 1,
  Dois = 2
}

const chave = "Um";
// ❌ Erro - acesso deve ser estático
// const valor = Nivel[chave];

// ✅ Apenas acesso direto
const valor = Nivel.Um;
```

### 3. Não Exportável em .d.ts

```typescript
// library.ts
export const enum Config {
  Timeout = 5000
}

// Consumidor externo não pode usar se --isolatedModules ou --preserveConstEnums não estiver ativado
```

### 4. Não Iterável

```typescript
const enum Fruta {
  Maca, Banana, Laranja
}

// ❌ Impossível iterar - não existe em runtime
// for (const fruta in Fruta) { }
```

## 🔧 Configurações do Compilador

### preserveConstEnums

```json
// tsconfig.json
{
  "compilerOptions": {
    "preserveConstEnums": true
  }
}
```

Com essa flag, const enum gera objeto (como enum normal) mas ainda faz inlining.

### isolatedModules

```json
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

Babel e outros transpiladores não suportam const enums. Esta flag gera erro se você usar const enums.

## 📊 Const Enum vs Enum Normal vs Union Type

```typescript
// 1. Enum normal - gera objeto runtime
enum StatusNormal {
  Ativo, Inativo
}

// 2. Const enum - sem runtime, inlining
const enum StatusConst {
  Ativo, Inativo
}

// 3. Union type - sem runtime, mais idiomático
type StatusUnion = "ATIVO" | "INATIVO";
```

**Comparação:**

| Feature | Enum Normal | Const Enum | Union Type |
|---------|-------------|------------|------------|
| Runtime object | Sim | Não | Não |
| Type safety | Sim | Sim | Sim |
| Iterável | Sim | Não | Não |
| Bundle size | Maior | Menor | Menor |
| Reverse mapping | Sim (numérico) | Não | Não |
| Exportável | Sim | Limitado | Sim |

## 🎯 Quando Usar Const Enums

### Use quando:

1. **Performance crítica** - Zero overhead é importante
2. **Bundle size** - Cada byte importa
3. **Uso interno** - Não será exportado de biblioteca
4. **Valores conhecidos** em compile time

### Evite quando:

1. **Biblioteca pública** - Consumidores podem ter problemas
2. **Precisa iterar** sobre membros
3. **Acesso dinâmico** necessário
4. **Babel/transpiladores** são usados

## 📚 Conclusão

Const enums são otimização poderosa que elimina runtime overhead de enums mantendo type safety. São essenciais para:

- Código onde performance e bundle size são críticos
- Uso interno em aplicações (não bibliotecas públicas)
- Situações onde objeto runtime não é necessário

Dominar const enums é entender o trade-off entre funcionalidades runtime e otimização, escolhendo a ferramenta certa para cada contexto.
