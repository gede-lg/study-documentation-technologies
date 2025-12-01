# Enums Heterogêneos no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Enums heterogêneos** (heterogeneous enums) são enumerações que misturam membros numéricos e string no mesmo enum. Conceitualmente, representam uma **quebra da uniformidade** típica de enums, permitindo flexibilidade ao custo de complexidade e menor previsibilidade.

Na essência, enums heterogêneos sacrificam homogeneidade em prol de casos específicos onde alguns membros precisam ser números e outros strings, embora essa prática seja geralmente **desencorajada**.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
enum Misto {
  Nao = 0,
  Sim = "SIM"
}

console.log(Misto.Nao); // 0
console.log(Misto.Sim); // "SIM"
```

### Exemplo Mais Complexo

```typescript
enum RespotaAPI {
  Sucesso = 1,
  Erro = 0,
  MensagemSucesso = "Operação concluída",
  MensagemErro = "Falha na operação"
}
```

## ⚠️ Por Que São Desencorajados

### 1. Complexidade Desnecessária

Misturar tipos torna código menos previsível:

```typescript
enum Confuso {
  A = 1,
  B = "B",
  C = 2,
  D = "D"
}

// Difícil raciocinar sobre tipo de retorno
function processar(valor: Confuso) {
  // valor pode ser number ou string - requer verificação
  if (typeof valor === "number") {
    // ...
  } else {
    // ...
  }
}
```

### 2. Perda de Benefícios

Enums heterogêneos perdem vantagens de enums puros:

- **Numéricos:** Auto-incremento, reverse mapping
- **String:** Serialização consistente legível

### 3. Alternativas Melhores

```typescript
// ❌ Enum heterogêneo
enum Ruim {
  Codigo = 200,
  Mensagem = "OK"
}

// ✅ Dois enums separados ou objeto
enum CodigoHTTP { OK = 200, Erro = 500 }
enum MensagemHTTP { OK = "OK", Erro = "Erro Interno" }

// ✅ Ou objeto tipado
const HTTP = {
  codigo: { OK: 200, Erro: 500 },
  mensagem: { OK: "OK", Erro: "Erro Interno" }
} as const;
```

## 🔍 Casos de Uso (Raros)

### Compatibilidade com APIs Legadas

```typescript
// API antiga retorna mix de number/string
enum StatusLegado {
  Ativo = 1,
  Inativo = 0,
  Pendente = "PENDING",  // API retorna string para este caso
  Bloqueado = "BLOCKED"
}
```

**Melhor alternativa:** Union type

```typescript
type StatusLegado = 1 | 0 | "PENDING" | "BLOCKED";
```

## 📊 Reverse Mapping

Apenas membros numéricos têm reverse mapping:

```typescript
enum Misto {
  A = 1,
  B = "B"
}

console.log(Misto[1]);   // "A" (reverse mapping funciona)
console.log(Misto["B"]); // undefined (sem reverse mapping para strings)
```

## 📚 Conclusão

Enums heterogêneos existem por completude da linguagem, mas são **raramente úteis** e geralmente indicam design problems. Quase sempre há alternativas melhores:

- Enums separados (numérico e string)
- Union types
- Objetos const

Entender enums heterogêneos é conhecer a feature completa, mas a sabedoria está em evitá-los na prática.
