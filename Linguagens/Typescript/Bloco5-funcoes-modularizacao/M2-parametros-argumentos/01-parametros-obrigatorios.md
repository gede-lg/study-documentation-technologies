# Parâmetros Obrigatórios no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Parâmetros obrigatórios** (required parameters) são parâmetros de função que devem ser fornecidos durante a chamada da função, com valores do tipo esperado. Conceitualmente, representam o **contrato mínimo** que uma função estabelece com seus chamadores - os dados essenciais sem os quais a função não pode operar corretamente.

Na essência, parâmetros obrigatórios materializam o princípio de **design by contract** no nível de assinaturas de função, onde o TypeScript garante em tempo de compilação que todas as dependências necessárias são fornecidas, eliminando uma categoria inteira de erros de runtime relacionados a parâmetros faltantes.

### Contexto Histórico e Motivação

**Problema histórico em JavaScript:**

JavaScript puro permite chamar funções com qualquer número de argumentos, independente da assinatura:

```javascript
// JavaScript puro
function somar(a, b) {
  return a + b;
}

somar(5);        // NaN - b é undefined
somar(5, 10, 20); // 15 - terceiro argumento ignorado
somar();         // NaN - ambos undefined
```

**Motivação do TypeScript:**

1. **Type Safety:** Garantir que argumentos necessários sejam fornecidos
2. **Documentação Viva:** Assinatura indica claramente o que é obrigatório
3. **Autocomplete:** IDEs sabem exatamente quais parâmetros são necessários
4. **Detecção Precoce:** Erros de argumentos faltantes são capturados em compile-time
5. **Refatoração Segura:** Mudanças em assinaturas são propagadas automaticamente

**Evolução:**

- **TypeScript 1.0:** Parâmetros obrigatórios básicos
- **TypeScript 2.0:** Melhoria na verificação de aridade (número de argumentos)
- **TypeScript 3.0+:** Strict function types

### Problema Fundamental que Resolve

Parâmetros obrigatórios resolvem o problema de **chamadas de função com argumentos faltantes**:

```typescript
// ❌ JavaScript - comportamento imprevisível
function calcular(preco, desconto) {
  return preco - desconto; // desconto pode ser undefined!
}

calcular(100); // NaN - erro silencioso

// ✅ TypeScript - erro em compile-time
function calcularTS(preco: number, desconto: number): number {
  return preco - desconto;
}

// calcularTS(100); // Erro: Expected 2 arguments, but got 1
calcularTS(100, 10); // OK
```

## 📋 Fundamentos

### Sintaxe Básica

```typescript
function nomeFuncao(parametro1: Tipo1, parametro2: Tipo2): TipoRetorno {
  // corpo
}
```

**Regra:** Todos os parâmetros sem `?` ou valor padrão são obrigatórios.

### Type Annotations em Parâmetros

```typescript
function saudar(nome: string, idade: number): string {
  return `Olá, ${nome}! Você tem ${idade} anos.`;
}

saudar("Ana", 25); // OK
// saudar("Ana");  // Erro: Expected 2 arguments, but got 1
```

**Conceito:** TypeScript verifica tanto o **número** quanto os **tipos** dos argumentos.

### Verificação de Aridade

O TypeScript verifica que o número exato de argumentos é fornecido:

```typescript
function multiplicar(a: number, b: number): number {
  return a * b;
}

multiplicar(5, 3);    // OK - 2 argumentos
// multiplicar(5);    // Erro - falta 1 argumento
// multiplicar(5, 3, 2); // Erro - 1 argumento extra (em strict mode)
```

## 🔍 Análise Conceitual Profunda

### 1. Parâmetros de Tipos Primitivos

```typescript
function calcularArea(largura: number, altura: number): number {
  return largura * altura;
}

calcularArea(10, 5); // 50
// calcularArea(10, "5"); // Erro: Argument of type 'string' is not assignable to 'number'
```

**Conceito:** Type safety garante que operações no corpo da função são válidas.

### 2. Parâmetros de Tipos Complexos

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

function registrarUsuario(usuario: Usuario): void {
  console.log(`Usuário ${usuario.nome} registrado.`);
}

registrarUsuario({ id: 1, nome: "João", email: "joao@example.com" }); // OK
// registrarUsuario({ nome: "João" }); // Erro - falta id e email
```

**Conceito:** Parâmetros complexos exigem estrutura completa conforme tipo.

### 3. Ordem dos Parâmetros

Parâmetros obrigatórios devem vir **antes** de opcionais:

```typescript
// ✅ Correto - obrigatórios antes de opcionais
function criar(nome: string, idade: number, cidade?: string): void {}

// ❌ Erro - obrigatório após opcional
// function errado(nome: string, cidade?: string, idade: number): void {}
```

**Conceito:** Garante que argumentos posicionais sejam não-ambíguos.

### 4. Múltiplos Parâmetros Obrigatórios

```typescript
function criarPedido(
  clienteId: number,
  produtoId: number,
  quantidade: number,
  preco: number
): void {
  console.log(`Pedido: ${quantidade}x produto ${produtoId} para cliente ${clienteId}`);
}

criarPedido(101, 202, 3, 49.99); // Todos os 4 argumentos necessários
```

### 5. Parâmetros com Union Types

```typescript
function processar(valor: string | number): void {
  if (typeof valor === "string") {
    console.log(valor.toUpperCase());
  } else {
    console.log(valor.toFixed(2));
  }
}

processar("hello"); // OK
processar(42);      // OK
// processar(true); // Erro: Argument of type 'boolean' is not assignable
```

**Conceito:** Parâmetro obrigatório pode aceitar múltiplos tipos via union.

### 6. Parâmetros com Literal Types

```typescript
function definirModo(modo: "leitura" | "escrita" | "admin"): void {
  console.log(`Modo definido: ${modo}`);
}

definirModo("leitura"); // OK
// definirModo("outro");  // Erro: não está no union literal
```

**Conceito:** Literal types restringem valores aceitos a conjunto específico.

### 7. Parâmetros em Arrow Functions

```typescript
const somar = (a: number, b: number): number => a + b;

somar(5, 3); // 8
// somar(5);  // Erro
```

**Conceito:** Arrow functions seguem mesmas regras de parâmetros obrigatórios.

## 🎯 Aplicabilidade e Contextos

### 1. Funções Utilitárias

```typescript
function formatarMoeda(valor: number, moeda: string): string {
  return `${moeda} ${valor.toFixed(2)}`;
}

formatarMoeda(49.99, "R$"); // "R$ 49.99"
```

### 2. Métodos de Classe

```typescript
class Calculadora {
  somar(a: number, b: number): number {
    return a + b;
  }

  dividir(dividendo: number, divisor: number): number {
    if (divisor === 0) throw new Error("Divisão por zero");
    return dividendo / divisor;
  }
}

const calc = new Calculadora();
calc.somar(10, 5);    // 15
calc.dividir(10, 2);  // 5
```

### 3. Callbacks com Parâmetros Obrigatórios

```typescript
function filtrar(
  array: number[],
  predicado: (valor: number, indice: number) => boolean
): number[] {
  return array.filter(predicado);
}

filtrar([1, 2, 3, 4], (valor, indice) => valor > 2); // [3, 4]
```

### 4. Funções de API/Serviços

```typescript
async function buscarUsuario(id: number): Promise<Usuario> {
  const response = await fetch(`/api/usuarios/${id}`);
  return response.json();
}

buscarUsuario(123); // Promise<Usuario>
```

## ⚠️ Limitações e Considerações

### 1. Rigidez em Excesso

Muitos parâmetros obrigatórios tornam função difícil de usar:

```typescript
// ❌ Difícil de usar - muitos parâmetros
function criarConfiguracao(
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
  timeout: number,
  retry: number
): void {}

// ✅ Melhor - objeto de configuração
function criarConfiguracaoMelhor(config: {
  host: string;
  port: number;
  credentials: { user: string; password: string };
  database: string;
  options?: { timeout?: number; retry?: number };
}): void {}
```

### 2. Ordem Importa

Parâmetros posicionais exigem ordem específica:

```typescript
function criar(nome: string, idade: number): void {}

criar(25, "João"); // Erro - ordem invertida
criar("João", 25); // OK
```

**Solução:** Usar objetos para maior flexibilidade.

### 3. Refatoração Pode Quebrar Código

Adicionar parâmetro obrigatório quebra todas as chamadas existentes:

```typescript
// Versão 1
function enviar(mensagem: string): void {}

// Versão 2 - quebra código existente
function enviar(mensagem: string, destinatario: string): void {}
// Todas as chamadas antigas de enviar() agora são erros
```

**Solução:** Adicionar como opcional ou com valor padrão.

## 🔗 Interconexões Conceituais

Parâmetros obrigatórios conectam-se com:

- **Parâmetros Opcionais:** Definem flexibilidade vs. contrato rígido
- **Parâmetros Padrão:** Alternativa para fornecer valores sensatos
- **Function Overloading:** Múltiplas assinaturas com diferentes parâmetros obrigatórios
- **Type Guards:** Validação de tipos dentro da função
- **Interfaces:** Definir estrutura de parâmetros complexos

## 🚀 Evolução e Próximos Conceitos

Dominar parâmetros obrigatórios prepara para:

1. **Parâmetros Opcionais (`param?: type`):** Flexibilidade controlada
2. **Parâmetros Padrão (`param = valor`):** Valores sensatos automáticos
3. **Rest Parameters (`...args`):** Número variável de argumentos
4. **Destructuring em Parâmetros:** Extrair propriedades de objetos
5. **Function Overloading:** Múltiplas assinaturas

## 📚 Conclusão

Parâmetros obrigatórios são a fundação do contrato de função no TypeScript, garantindo que todas as dependências necessárias sejam fornecidas em compile-time. São essenciais para:

- Type safety rigoroso
- APIs claras e bem documentadas
- Detecção precoce de erros
- Refatoração segura

Compreender parâmetros obrigatórios é entender o contrato fundamental entre função e chamador, onde o TypeScript atua como garantidor que todas as promessas são cumpridas antes mesmo do código executar.
