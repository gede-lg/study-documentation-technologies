# Previsibilidade e Testabilidade: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Previsibilidade** é propriedade onde comportamento de função pode ser **completamente determinado** olhando apenas sua assinatura e implementação, sem considerar contexto externo. **Testabilidade** é facilidade de escrever testes automatizados confiáveis e simples. Conceitualmente, funções puras oferecem **máxima previsibilidade e testabilidade** pois comportamento depende apenas de inputs, sem dependências ocultas.

Na essência, previsibilidade e testabilidade materializam o princípio de **código auto-contido**, onde função é unidade independente que pode ser compreendida, testada e reutilizada em isolamento completo.

## 📋 Fundamentos

### Previsibilidade em Funções Puras

```typescript
// ✅ Altamente previsível - comportamento óbvio
function somar(a: number, b: number): number {
  return a + b;
}

// Para prever resultado, basta olhar argumentos:
somar(2, 3); // 5 - sempre
somar(10, 5); // 15 - sempre

// ❌ Imprevisível - depende de estado externo
let fator = 2;

function multiplicar(n: number): number {
  return n * fator; // Resultado depende de 'fator' externo
}

multiplicar(5); // 10... ou não? Depende de 'fator'
fator = 3;
multiplicar(5); // 15 agora!

// ❌ Imprevisível - depende de tempo
function obterMensagem(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

obterMensagem(); // Resultado depende do horário atual
```

**Conceito-chave:** Previsibilidade permite **raciocínio equacional** - pode substituir chamada de função pelo resultado esperado.

### Testabilidade em Funções Puras

```typescript
// ✅ Fácil de testar - sem setup necessário
function calcularDesconto(preco: number, percentual: number): number {
  return preco * (1 - percentual / 100);
}

// Teste simples e direto
test("calcularDesconto", () => {
  expect(calcularDesconto(100, 10)).toBe(90);
  expect(calcularDesconto(200, 25)).toBe(150);
  expect(calcularDesconto(50, 0)).toBe(50);
});

// ❌ Difícil de testar - requer mocks e setup complexo
class PagamentoService {
  async processar(valor: number): Promise<void> {
    const usuario = await db.getUsuario();      // Depende de DB
    const taxa = await api.getTaxa();           // Depende de API
    const total = valor + taxa;

    await logger.log(`Processando ${total}`);   // Side effect
    await db.salvarTransacao(total);            // Side effect
    await email.enviar(usuario.email, total);   // Side effect
  }
}

// Teste complexo - precisa mockar db, api, logger, email
test("processar", async () => {
  const mockDb = { /* ... */ };
  const mockApi = { /* ... */ };
  const mockLogger = { /* ... */ };
  const mockEmail = { /* ... */ };
  // Setup complexo...
});
```

## 🔍 Análise Conceitual

### 1. Previsibilidade via Transparência Referencial

```typescript
// Função pura - transparência referencial
function area(largura: number, altura: number): number {
  return largura * altura;
}

// Pode fazer substituições seguras
const resultado1 = area(5, 10) + area(5, 10);
// É EQUIVALENTE a:
const resultado2 = 50 + 50;
// Ambos sempre 100

// Permite refatoração segura
const valor = area(5, 10);
const resultado3 = valor + valor; // Idêntico a resultado1

// Função impura - SEM transparência referencial
let contador = 0;
function incrementar(): number {
  return ++contador;
}

const x = incrementar() + incrementar();
// NÃO é equivalente a:
const y = 1 + 1;
// x = 3, y = 2 - diferentes!
```

**Conceito:** Transparência referencial permite **refatoração mecânica** sem alterar semântica.

### 2. Testabilidade sem Mocks

```typescript
// ✅ Função pura - teste direto
function filtrarPares(numeros: number[]): number[] {
  return numeros.filter(n => n % 2 === 0);
}

test("filtrarPares retorna apenas números pares", () => {
  expect(filtrarPares([1, 2, 3, 4, 5])).toEqual([2, 4]);
  expect(filtrarPares([1, 3, 5])).toEqual([]);
  expect(filtrarPares([2, 4, 6])).toEqual([2, 4, 6]);
});

// ❌ Função impura - requer mocks
function salvarUsuario(usuario: Usuario): void {
  db.insert(usuario);           // Side effect
  logger.info("Usuário salvo"); // Side effect
}

test("salvarUsuario", () => {
  // Precisa mockar db e logger
  const mockDb = jest.fn();
  const mockLogger = jest.fn();

  // Substituir implementações globais
  global.db = { insert: mockDb };
  global.logger = { info: mockLogger };

  salvarUsuario({ nome: "Ana" });

  expect(mockDb).toHaveBeenCalledWith({ nome: "Ana" });
  expect(mockLogger).toHaveBeenCalled();
});
```

### 3. Testes Baseados em Propriedades

```typescript
// Função pura permite testes baseados em propriedades
function inverter<T>(arr: T[]): T[] {
  return [...arr].reverse();
}

// Propriedade: inverter duas vezes retorna original
test("inverter duas vezes retorna original", () => {
  const original = [1, 2, 3, 4, 5];
  const resultado = inverter(inverter(original));
  expect(resultado).toEqual(original);
});

// Propriedade: tamanho permanece o mesmo
test("inverter preserva tamanho", () => {
  const arr = [1, 2, 3];
  expect(inverter(arr).length).toBe(arr.length);
});

// Propriedade: primeiro vira último
test("primeiro elemento vira último", () => {
  const arr = [1, 2, 3];
  const invertido = inverter(arr);
  expect(invertido[invertido.length - 1]).toBe(arr[0]);
});
```

### 4. Debugging Simplificado

```typescript
// ✅ Função pura - fácil debugar
function calcular(x: number, y: number, z: number): number {
  const a = x + y;
  const b = a * z;
  return b - x;
}

// Debug: insere console.log e vê valores
calcular(2, 3, 4); // Pode reproduzir exatamente

// ❌ Função impura - difícil debugar
let estado = 0;

function processar(valor: number): number {
  estado += valor;
  const resultado = estado * 2;
  console.log("Estado atual:", estado); // Debug depende de histórico
  return resultado;
}

// Debug: resultado depende de TODAS as chamadas anteriores
processar(5);  // Estado: 5, retorna 10
processar(3);  // Estado: 8, retorna 16 - depende da chamada anterior!
```

### 5. Composição Previsível

```typescript
// Funções puras compõem-se previsivelmente
const dobrar = (n: number): number => n * 2;
const incrementar = (n: number): number => n + 1;
const quadrado = (n: number): number => n ** 2;

// Composição
const processar = (n: number) =>
  quadrado(incrementar(dobrar(n)));

// Previsível: pode rastrear transformações
processar(3);
// dobrar(3) = 6
// incrementar(6) = 7
// quadrado(7) = 49

test("processar", () => {
  expect(processar(3)).toBe(49);
  expect(processar(5)).toBe(121);
});
```

## 🎯 Padrões de Teste para Funções Puras

### 1. Arrange-Act-Assert (AAA)

```typescript
function calcularMedia(numeros: number[]): number {
  return numeros.reduce((a, b) => a + b, 0) / numeros.length;
}

test("calcularMedia", () => {
  // Arrange - prepara dados
  const numeros = [10, 20, 30];

  // Act - executa função
  const media = calcularMedia(numeros);

  // Assert - verifica resultado
  expect(media).toBe(20);
});
```

### 2. Casos de Borda (Edge Cases)

```typescript
function dividir(a: number, b: number): number | null {
  if (b === 0) return null;
  return a / b;
}

test("dividir - casos de borda", () => {
  expect(dividir(10, 2)).toBe(5);      // Caso normal
  expect(dividir(10, 0)).toBeNull();   // Divisão por zero
  expect(dividir(0, 5)).toBe(0);       // Zero dividido
  expect(dividir(-10, 2)).toBe(-5);    // Números negativos
  expect(dividir(1, 3)).toBeCloseTo(0.333, 2); // Dízima
});
```

### 3. Testes Parametrizados

```typescript
function ehPar(n: number): boolean {
  return n % 2 === 0;
}

test.each([
  [2, true],
  [3, false],
  [0, true],
  [-4, true],
  [-3, false],
])("ehPar(%i) retorna %s", (numero, esperado) => {
  expect(ehPar(numero)).toBe(esperado);
});
```

### 4. Snapshot Testing

```typescript
interface Pessoa {
  nome: string;
  idade: number;
}

function formatarPessoa(pessoa: Pessoa): string {
  return `${pessoa.nome} tem ${pessoa.idade} anos`;
}

test("formatarPessoa snapshot", () => {
  const pessoa = { nome: "Ana", idade: 25 };
  expect(formatarPessoa(pessoa)).toMatchSnapshot();
});
```

## 🎯 Benefícios Práticos

### 1. Testes Rápidos

```typescript
// Função pura - teste instantâneo (microsegundos)
function fatorial(n: number): number {
  if (n <= 1) return 1;
  return n * fatorial(n - 1);
}

test("fatorial", () => {
  expect(fatorial(5)).toBe(120);
  expect(fatorial(0)).toBe(1);
  expect(fatorial(10)).toBe(3628800);
});
// Executa em < 1ms

// Função impura - teste lento (I/O, network)
async function buscarDados(): Promise<any> {
  return fetch("/api/data").then(r => r.json());
}

test("buscarDados", async () => {
  // Mock necessário
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ data: "mock" })
  }));

  const result = await buscarDados();
  expect(result).toEqual({ data: "mock" });
});
// Executa em > 10ms (mesmo mockado)
```

### 2. Cobertura de Código Significativa

```typescript
// Função pura - cobertura = confiança
function calcularIMC(peso: number, altura: number): number {
  return peso / (altura ** 2);
}

// Teste com 100% de cobertura
test("calcularIMC", () => {
  expect(calcularIMC(70, 1.75)).toBeCloseTo(22.86, 2);
  expect(calcularIMC(80, 1.80)).toBeCloseTo(24.69, 2);
});

// 100% cobertura = alta confiança (sem dependências externas)
```

### 3. Testes como Documentação

```typescript
// Funções puras + testes = documentação viva
function validarCPF(cpf: string): boolean {
  // Implementação...
  return true; // simplificado
}

describe("validarCPF", () => {
  it("aceita CPF válido com pontuação", () => {
    expect(validarCPF("123.456.789-00")).toBe(true);
  });

  it("aceita CPF válido sem pontuação", () => {
    expect(validarCPF("12345678900")).toBe(true);
  });

  it("rejeita CPF com dígitos repetidos", () => {
    expect(validarCPF("111.111.111-11")).toBe(false);
  });

  it("rejeita CPF com comprimento incorreto", () => {
    expect(validarCPF("123")).toBe(false);
  });
});
// Testes documentam comportamento esperado
```

## ⚠️ Funções Impuras vs. Puras - Comparação

```typescript
// ❌ IMPURA - Difícil prever e testar
class ContaBancaria {
  private saldo = 0;

  depositar(valor: number): void {
    this.saldo += valor;
  }

  getSaldo(): number {
    return this.saldo;
  }
}

test("conta bancária", () => {
  const conta = new ContaBancaria();
  conta.depositar(100);
  conta.depositar(50);
  expect(conta.getSaldo()).toBe(150);
  // Teste depende da ordem e estado
});

// ✅ PURA - Fácil prever e testar
interface Conta {
  saldo: number;
}

function depositar(conta: Conta, valor: number): Conta {
  return { saldo: conta.saldo + valor };
}

test("depositar", () => {
  const conta = { saldo: 0 };
  const resultado1 = depositar(conta, 100);
  const resultado2 = depositar(resultado1, 50);

  expect(resultado2.saldo).toBe(150);
  expect(conta.saldo).toBe(0); // Original intacto
});
```

## 📚 Conclusão

Funções puras oferecem máxima previsibilidade (comportamento determinado apenas por inputs) e testabilidade (testes simples sem mocks). Permitem transparência referencial, raciocínio equacional, debugging simplificado e composição previsível. Testes são rápidos, diretos e servem como documentação viva do comportamento esperado.
