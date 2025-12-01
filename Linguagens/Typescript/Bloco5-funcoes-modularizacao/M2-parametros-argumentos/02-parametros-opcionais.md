# Parâmetros Opcionais no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Parâmetros opcionais** (optional parameters) são parâmetros de função marcados com `?` que podem ser omitidos durante a chamada, assumindo automaticamente o valor `undefined` quando não fornecidos. Conceitualmente, representam **flexibilidade controlada** no contrato de função, permitindo que certos dados sejam fornecidos opcionalmente sem comprometer type safety.

Na essência, parâmetros opcionais materializam o princípio de **design for optionality**, onde funções podem aceitar configurações adicionais sem tornar todas as chamadas verbosas. É a ponte entre a rigidez de parâmetros obrigatórios e a flexibilidade de valores padrão.

### Problema Fundamental que Resolve

Parâmetros opcionais resolvem o problema de **funções com comportamento configurável mas com defaults sensatos**:

```typescript
// ❌ Sem parâmetros opcionais - sempre verboso
function buscar(query: string, limite: number, offset: number): void {
  // ...
}
buscar("teste", 10, 0); // Sempre precisa passar todos, mesmo defaults comuns

// ✅ Com parâmetros opcionais - conciso quando defaults são OK
function buscarMelhor(query: string, limite?: number, offset?: number): void {
  const limiteReal = limite ?? 10;
  const offsetReal = offset ?? 0;
  // ...
}
buscarMelhor("teste");           // Usa defaults
buscarMelhor("teste", 20);       // Customiza limite
buscarMelhor("teste", 20, 5);    // Customiza ambos
```

## 📋 Fundamentos

### Sintaxe Básica

```typescript
function nomeFuncao(
  parametroObrigatorio: Tipo1,
  parametroOpcional?: Tipo2
): TipoRetorno {
  // parametroOpcional tem tipo: Tipo2 | undefined
}
```

**Símbolo:** `?` após o nome do parâmetro indica opcionalidade.

### Tipo Implícito: `T | undefined`

```typescript
function saudar(nome: string, titulo?: string): string {
  // titulo tem tipo: string | undefined
  if (titulo) {
    return `${titulo} ${nome}`;
  }
  return nome;
}

saudar("Ana");              // "Ana"
saudar("Ana", "Dra.");      // "Dra. Ana"
```

**Conceito:** Parâmetro opcional automaticamente aceita `undefined`.

### Ordem: Obrigatórios Primeiro

```typescript
// ✅ Correto - opcionais após obrigatórios
function criar(nome: string, idade: number, cidade?: string): void {}

// ❌ Erro - obrigatório após opcional
// function errado(nome: string, cidade?: string, idade: number): void {}
```

**Regra:** Todos os parâmetros opcionais devem estar no final da lista.

## 🔍 Análise Conceitual Profunda

### 1. Verificação de Valor

```typescript
function exibir(mensagem: string, prefixo?: string): void {
  if (prefixo !== undefined) {
    console.log(`${prefixo}: ${mensagem}`);
  } else {
    console.log(mensagem);
  }
}

exibir("Olá");              // "Olá"
exibir("Olá", "INFO");      // "INFO: Olá"
```

**Conceito:** Verificação explícita de `undefined` necessária para distinguir casos.

### 2. Nullish Coalescing

```typescript
function processar(valor: string, config?: { debug: boolean }): void {
  const debugMode = config?.debug ?? false;
  if (debugMode) {
    console.log(`Processando: ${valor}`);
  }
}

processar("dados");                      // debugMode = false
processar("dados", { debug: true });     // debugMode = true
```

**Conceito:** `??` fornece default quando parâmetro é `undefined` ou `null`.

### 3. Múltiplos Parâmetros Opcionais

```typescript
function criarUsuario(
  nome: string,
  email?: string,
  telefone?: string,
  endereco?: string
): void {
  console.log(`Usuário: ${nome}`);
  if (email) console.log(`Email: ${email}`);
  if (telefone) console.log(`Telefone: ${telefone}`);
  if (endereco) console.log(`Endereço: ${endereco}`);
}

criarUsuario("João");
criarUsuario("João", "joao@example.com");
criarUsuario("João", "joao@example.com", "123456789");
```

### 4. Parâmetros Opcionais com Union Types

```typescript
function formatar(valor: string, opcoes?: { maiuscula: boolean; trim: boolean }): string {
  let resultado = valor;

  if (opcoes?.trim) {
    resultado = resultado.trim();
  }
  if (opcoes?.maiuscula) {
    resultado = resultado.toUpperCase();
  }

  return resultado;
}

formatar("  hello  ");                           // "  hello  "
formatar("  hello  ", { trim: true, maiuscula: false }); // "hello"
```

**Conceito:** Optional chaining (`?.`) acessa propriedades de parâmetro opcional com segurança.

### 5. Type Narrowing com Opcionais

```typescript
function calcular(base: number, multiplicador?: number): number {
  if (multiplicador !== undefined) {
    // Aqui multiplicador é: number (não undefined)
    return base * multiplicador;
  }
  return base;
}

calcular(10);      // 10
calcular(10, 5);   // 50
```

**Conceito:** Type guards reduzem tipo de `number | undefined` para `number`.

### 6. Opcionais em Callbacks

```typescript
function filtrarArray(
  array: number[],
  predicado?: (valor: number) => boolean
): number[] {
  if (predicado) {
    return array.filter(predicado);
  }
  return array; // Sem filtro, retorna tudo
}

filtrarArray([1, 2, 3, 4]);                    // [1, 2, 3, 4]
filtrarArray([1, 2, 3, 4], x => x > 2);        // [3, 4]
```

### 7. Diferença: Opcional vs. `undefined` Explícito

```typescript
// Parâmetro opcional
function opcional(x?: number): void {
  // x: number | undefined
}

opcional();      // OK - omitido
opcional(5);     // OK - número
opcional(undefined); // OK - undefined explícito

// Parâmetro com union explícita
function explicito(x: number | undefined): void {
  // x: number | undefined
}

// explicito();     // Erro - deve passar algo (mesmo que undefined)
explicito(5);       // OK
explicito(undefined); // OK - mas deve passar explicitamente
```

**Conceito:** Opcional permite **omissão**, union com `undefined` exige **argumento explícito**.

## 🎯 Aplicabilidade e Contextos

### 1. Configurações Opcionais

```typescript
function conectar(
  host: string,
  porta?: number,
  timeout?: number
): void {
  const portaReal = porta ?? 3000;
  const timeoutReal = timeout ?? 5000;
  console.log(`Conectando em ${host}:${portaReal} (timeout: ${timeoutReal}ms)`);
}

conectar("localhost");              // Usa defaults
conectar("localhost", 8080);        // Porta customizada
conectar("localhost", 8080, 10000); // Ambos customizados
```

### 2. Métodos de Classe

```typescript
class Logger {
  log(mensagem: string, nivel?: "INFO" | "WARN" | "ERROR"): void {
    const nivelReal = nivel ?? "INFO";
    console.log(`[${nivelReal}] ${mensagem}`);
  }
}

const logger = new Logger();
logger.log("Aplicação iniciada");            // [INFO]
logger.log("Atenção!", "WARN");              // [WARN]
logger.log("Falha crítica", "ERROR");        // [ERROR]
```

### 3. Funções de Formatação

```typescript
function formatarData(
  data: Date,
  incluirHora?: boolean,
  formato?: "DD/MM/YYYY" | "YYYY-MM-DD"
): string {
  const formatoReal = formato ?? "DD/MM/YYYY";
  let resultado = data.toLocaleDateString();

  if (incluirHora) {
    resultado += ` ${data.toLocaleTimeString()}`;
  }

  return resultado;
}

formatarData(new Date());                    // Apenas data
formatarData(new Date(), true);              // Data + hora
```

### 4. APIs e Serviços

```typescript
async function buscarProdutos(
  categoria: string,
  limite?: number,
  ordenarPor?: "preco" | "nome"
): Promise<Produto[]> {
  const params = new URLSearchParams({ categoria });

  if (limite) params.set("limite", limite.toString());
  if (ordenarPor) params.set("ordenar", ordenarPor);

  const response = await fetch(`/api/produtos?${params}`);
  return response.json();
}

buscarProdutos("eletronicos");
buscarProdutos("eletronicos", 10);
buscarProdutos("eletronicos", 10, "preco");
```

## ⚠️ Limitações e Considerações

### 1. Ordem Fixa é Limitante

Se você tem muitos opcionais, ordem posicional se torna problema:

```typescript
function criar(
  nome: string,
  email?: string,
  telefone?: string,
  endereco?: string,
  cep?: string
): void {}

// Para passar cep, precisa passar todos anteriores
criar("João", undefined, undefined, undefined, "12345-678");
```

**Solução:** Usar objeto de opções:

```typescript
function criarMelhor(
  nome: string,
  opcoes?: {
    email?: string;
    telefone?: string;
    endereco?: string;
    cep?: string;
  }
): void {}

criarMelhor("João", { cep: "12345-678" }); // Muito melhor!
```

### 2. Confusão com Parâmetros Padrão

```typescript
// Opcional sem default
function opcional(x?: number): number {
  return x ?? 0; // Precisa lidar com undefined manualmente
}

// Parâmetro padrão (mais conveniente)
function comPadrao(x: number = 0): number {
  return x; // Nunca é undefined
}
```

**Diferença:** Padrões eliminam `undefined` do tipo automaticamente.

### 3. Type Safety Reduzido

Parâmetros opcionais exigem verificações adicionais:

```typescript
function processar(config?: { debug: boolean }): void {
  // Precisa verificar se config existe antes de acessar
  if (config?.debug) {
    console.log("Debug mode");
  }
}
```

## 🔗 Interconexões Conceituais

Parâmetros opcionais conectam-se com:

- **Parâmetros Padrão:** Alternativa com valores automáticos
- **Optional Properties:** Conceito similar em interfaces
- **Nullish Coalescing (`??`):** Fornecer defaults para opcionais
- **Optional Chaining (`?.`):** Acessar propriedades de opcionais com segurança
- **Type Narrowing:** Refinar tipo de `T | undefined` para `T`

## 🚀 Evolução e Próximos Conceitos

Dominar parâmetros opcionais prepara para:

1. **Parâmetros Padrão:** Valores automáticos ao invés de `undefined`
2. **Rest Parameters:** Número variável de argumentos
3. **Destructuring em Parâmetros:** Extrair propriedades de objetos opcionais
4. **Function Overloading:** Múltiplas assinaturas com diferentes opcionais

## 📚 Conclusão

Parâmetros opcionais oferecem flexibilidade controlada em assinaturas de função, permitindo que chamadores omitam argumentos quando apropriado sem sacrificar type safety. São essenciais para:

- APIs ergonômicas com defaults sensatos
- Funções configuráveis sem verbosidade
- Compatibilidade retroativa ao adicionar parâmetros
- Design de interfaces amigáveis

Compreender parâmetros opcionais é dominar o equilíbrio entre rigidez de contratos e flexibilidade de uso, criando APIs que são ao mesmo tempo type-safe e convenientes para chamar.
