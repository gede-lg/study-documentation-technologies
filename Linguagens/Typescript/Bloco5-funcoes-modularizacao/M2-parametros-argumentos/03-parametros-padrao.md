# Parâmetros Padrão no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Parâmetros padrão** (default parameters) são parâmetros de função que recebem um **valor inicial** definido na assinatura, o qual é automaticamente usado quando o argumento é omitido ou passa-se `undefined` explicitamente. Conceitualmente, representam **valores sensatos pré-definidos** que eliminam a necessidade de verificações manuais de `undefined` no corpo da função.

Na essência, parâmetros padrão materializam o princípio de **convenção sobre configuração**, onde comportamentos comuns são automatizados através de defaults inteligentes. É a evolução de parâmetros opcionais, eliminando boilerplate de verificação de `undefined` e inicialização manual.

### Problema Fundamental que Resolve

Parâmetros padrão resolvem o problema de **inicialização repetitiva de parâmetros opcionais**:

```typescript
// ❌ Sem parâmetros padrão - verificação manual necessária
function buscar(query: string, limite?: number, offset?: number): void {
  const limiteReal = limite ?? 10;      // Boilerplate
  const offsetReal = offset ?? 0;       // Boilerplate
  console.log(`Buscar: ${query}, limite: ${limiteReal}, offset: ${offsetReal}`);
}

// ✅ Com parâmetros padrão - limpo e direto
function buscarMelhor(query: string, limite: number = 10, offset: number = 0): void {
  // limite e offset já têm valores garantidos
  console.log(`Buscar: ${query}, limite: ${limite}, offset: ${offset}`);
}

buscarMelhor("typescript");           // limite=10, offset=0
buscarMelhor("typescript", 20);       // limite=20, offset=0
buscarMelhor("typescript", 20, 5);    // limite=20, offset=5
```

## 📋 Fundamentos

### Sintaxe Básica

```typescript
function nomeFuncao(parametro: Tipo = valorPadrao): TipoRetorno {
  // parametro tem tipo Tipo (NÃO Tipo | undefined)
}
```

**Diferença Crucial:** Parâmetro padrão **elimina `undefined`** do tipo.

### Tipo Inferido Automaticamente

```typescript
// Type annotation é opcional quando há valor padrão
function saudar(nome: string = "Visitante"): string {
  // nome tem tipo: string (inferido do default)
  return `Olá, ${nome}!`;
}

saudar();           // "Olá, Visitante!"
saudar("Ana");      // "Olá, Ana!"
saudar(undefined);  // "Olá, Visitante!" - undefined ativa default
```

**Conceito:** TypeScript infere tipo do parâmetro baseado no valor padrão.

### Valores Padrão Podem Ser Expressões

```typescript
function log(mensagem: string, timestamp: number = Date.now()): void {
  console.log(`[${timestamp}] ${mensagem}`);
}

log("Início"); // timestamp = valor atual de Date.now()
```

**Importante:** Expressão é **avaliada na chamada**, não na definição.

## 🔍 Análise Conceitual Profunda

### 1. Tipo Exato vs. Tipo com `undefined`

```typescript
// Parâmetro opcional - tipo inclui undefined
function opcional(x?: number): void {
  // x: number | undefined
  if (x !== undefined) {
    console.log(x.toFixed(2)); // Precisa verificar
  }
}

// Parâmetro padrão - tipo NÃO inclui undefined
function comPadrao(x: number = 0): void {
  // x: number (nunca undefined)
  console.log(x.toFixed(2)); // Seguro usar diretamente
}
```

**Conceito:** Padrões garantem tipo concreto, eliminando necessidade de type narrowing.

### 2. Múltiplos Parâmetros Padrão

```typescript
function criarServidor(
  host: string = "localhost",
  porta: number = 3000,
  ssl: boolean = false
): void {
  console.log(`Servidor em ${ssl ? "https" : "http"}://${host}:${porta}`);
}

criarServidor();                          // localhost:3000 (http)
criarServidor("0.0.0.0");                 // 0.0.0.0:3000 (http)
criarServidor("0.0.0.0", 8080);           // 0.0.0.0:8080 (http)
criarServidor("0.0.0.0", 8080, true);     // 0.0.0.0:8080 (https)
```

### 3. Parâmetros Padrão com Objetos

```typescript
function configurar(opcoes: {
  debug?: boolean;
  timeout?: number;
} = {}): void {
  const debug = opcoes.debug ?? false;
  const timeout = opcoes.timeout ?? 5000;
  console.log(`Debug: ${debug}, Timeout: ${timeout}`);
}

configurar();                            // Objeto vazio usado
configurar({ debug: true });             // debug=true, timeout=5000
configurar({ timeout: 10000 });          // debug=false, timeout=10000
```

**Conceito:** Objeto vazio como default permite omitir argumento completamente.

### 4. Destructuring com Defaults

```typescript
function criarUsuario({
  nome,
  idade = 18,
  ativo = true
}: {
  nome: string;
  idade?: number;
  ativo?: boolean;
}): void {
  console.log(`Usuário: ${nome}, ${idade} anos, ${ativo ? "ativo" : "inativo"}`);
}

criarUsuario({ nome: "João" });                    // idade=18, ativo=true
criarUsuario({ nome: "Ana", idade: 25 });          // idade=25, ativo=true
criarUsuario({ nome: "Pedro", ativo: false });     // idade=18, ativo=false
```

**Conceito:** Defaults podem ser aplicados em destructuring de parâmetros.

### 5. Defaults Calculados com Base em Outros Parâmetros

```typescript
function criarRange(inicio: number, fim: number = inicio + 10): number[] {
  const resultado: number[] = [];
  for (let i = inicio; i < fim; i++) {
    resultado.push(i);
  }
  return resultado;
}

criarRange(0);      // [0, 1, 2, ..., 9] - fim = 0 + 10
criarRange(5);      // [5, 6, 7, ..., 14] - fim = 5 + 10
criarRange(0, 5);   // [0, 1, 2, 3, 4] - fim explícito
```

**Conceito:** Default pode referenciar parâmetros anteriores.

### 6. `undefined` Ativa Default, `null` Não

```typescript
function exibir(valor: string = "padrão"): void {
  console.log(valor);
}

exibir();           // "padrão" - omitido
exibir(undefined);  // "padrão" - undefined ativa default
exibir(null as any); // "null" - null NÃO ativa default
```

**Importante:** Apenas `undefined` (explícito ou omissão) aciona valor padrão.

### 7. Parâmetros Padrão em Posições Intermediárias

```typescript
function criar(nome: string, idade: number = 18, cidade: string = "São Paulo"): void {
  console.log(`${nome}, ${idade} anos, ${cidade}`);
}

criar("João");                        // idade=18, cidade="São Paulo"
criar("Ana", undefined, "Rio");       // idade=18 (default), cidade="Rio"
criar("Pedro", 25);                   // idade=25, cidade="São Paulo"
```

**Conceito:** Passar `undefined` explicitamente usa default mesmo em posições intermediárias.

## 🎯 Aplicabilidade e Contextos

### 1. Configurações de Sistema

```typescript
function inicializarApp(
  ambiente: "dev" | "prod" = "dev",
  porta: number = 3000,
  logLevel: "debug" | "info" | "error" = "info"
): void {
  console.log(`Iniciando em ${ambiente} na porta ${porta} (log: ${logLevel})`);
}

inicializarApp();                              // Todos os defaults
inicializarApp("prod", 8080, "error");         // Todos customizados
```

### 2. Funções Utilitárias

```typescript
function arredondar(valor: number, casasDecimais: number = 2): number {
  const fator = Math.pow(10, casasDecimais);
  return Math.round(valor * fator) / fator;
}

arredondar(3.14159);        // 3.14 (2 casas padrão)
arredondar(3.14159, 3);     // 3.142
arredondar(3.14159, 0);     // 3
```

### 3. APIs de Biblioteca

```typescript
function fetch(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  headers: Record<string, string> = {},
  timeout: number = 5000
): Promise<Response> {
  return window.fetch(url, { method, headers, signal: AbortSignal.timeout(timeout) });
}

fetch("/api/users");                           // GET, sem headers
fetch("/api/users", "POST", { "Content-Type": "application/json" });
```

### 4. Métodos de Classe

```typescript
class Logger {
  log(
    mensagem: string,
    nivel: "INFO" | "WARN" | "ERROR" = "INFO",
    incluirTimestamp: boolean = true
  ): void {
    const prefix = incluirTimestamp ? `[${new Date().toISOString()}]` : "";
    console.log(`${prefix} [${nivel}] ${mensagem}`);
  }
}

const logger = new Logger();
logger.log("App iniciado");                    // INFO com timestamp
logger.log("Atenção!", "WARN");                // WARN com timestamp
logger.log("Erro crítico", "ERROR", false);    // ERROR sem timestamp
```

## ⚠️ Limitações e Considerações

### 1. Avaliação na Chamada (Não na Definição)

```typescript
let contador = 0;

function incrementar(valor: number = ++contador): number {
  return valor;
}

console.log(incrementar()); // 1 - contador incrementa
console.log(incrementar()); // 2 - contador incrementa novamente
console.log(incrementar(5)); // 5 - default não usado
```

**Conceito:** Default é avaliado **cada vez** que função é chamada sem argumento.

### 2. Ordem com Opcionais

Parâmetros padrão podem estar antes de opcionais:

```typescript
function criar(
  nome: string,
  idade: number = 18,
  email?: string  // Opcional APÓS parâmetro padrão - OK
): void {}

criar("João");           // OK
criar("João", 25);       // OK
criar("João", undefined, "joao@example.com"); // Precisa passar undefined
```

### 3. Type Safety com Defaults Dinâmicos

```typescript
// ⚠️ Cuidado: default complexo pode ter tipo diferente do esperado
function processar(config: Config = obterConfigPadrao()): void {
  // Precisa garantir que obterConfigPadrao() retorna Config válido
}
```

## 🔗 Interconexões Conceituais

Parâmetros padrão conectam-se com:

- **Parâmetros Opcionais:** Evolução que elimina `undefined` do tipo
- **Type Inference:** TypeScript infere tipo do default
- **Destructuring:** Defaults aplicados em destructuring
- **Function Overloading:** Defaults simplificam necessidade de overloads
- **Default Properties:** Conceito similar em interfaces

## 🚀 Evolução e Próximos Conceitos

Dominar parâmetros padrão prepara para:

1. **Rest Parameters (`...args`):** Número variável de argumentos
2. **Destructuring em Parâmetros:** Extrair propriedades com defaults
3. **Function Overloading:** Múltiplas assinaturas (menos necessário com defaults)
4. **Builder Pattern:** Alternativa para funções com muitos parâmetros

## 📚 Conclusão

Parâmetros padrão oferecem a forma mais elegante de lidar com argumentos opcionais, eliminando boilerplate de verificação de `undefined` e fornecendo valores sensatos automaticamente. São essenciais para:

- APIs ergonômicas e concisas
- Eliminação de type narrowing desnecessário
- Código mais limpo e legível
- Convenção sobre configuração

Compreender parâmetros padrão é dominar a arte de criar funções que são ao mesmo tempo flexíveis e convenientes, onde defaults inteligentes tornam o caso comum trivial sem sacrificar customização quando necessário.
