# Composição de Map, Filter e Reduce: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Composição de métodos** é encadeamento de operações `map`, `filter` e `reduce` em **pipeline declarativo**, onde saída de operação alimenta entrada da seguinte. Conceitualmente, representa **processamento em fluxo**, onde transformações são aplicadas sequencialmente criando pipelines de dados expressivos e legíveis.

Na essência, composição materializa o princípio de **programação declarativa**, especificando "o quê" fazer ao invés de "como" fazer.

## 📋 Fundamentos

### Pipeline Básico

```typescript
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Composição: filter → map → reduce
const resultado = numeros
  .filter(n => n % 2 === 0)     // [2, 4, 6, 8, 10]
  .map(n => n ** 2)             // [4, 16, 36, 64, 100]
  .reduce((acc, n) => acc + n, 0); // 220

// vs. Imperativo
let soma = 0;
for (const n of numeros) {
  if (n % 2 === 0) {
    soma += n ** 2;
  }
}
// Mesmo resultado, mas menos declarativo
```

**Conceito-chave:** Cada método retorna novo array, permitindo encadeamento natural.

## 🔍 Análise Conceitual

### 1. Padrões Comuns

```typescript
interface Produto {
  nome: string;
  preco: number;
  categoria: string;
  estoque: number;
}

const produtos: Produto[] = [
  { nome: "A", preco: 100, categoria: "Tech", estoque: 5 },
  { nome: "B", preco: 50, categoria: "Casa", estoque: 0 },
  { nome: "C", preco: 200, categoria: "Tech", estoque: 10 }
];

// Padrão: Filter → Map
const nomesDisponiveis = produtos
  .filter(p => p.estoque > 0)
  .map(p => p.nome);
// ["A", "C"]

// Padrão: Map → Filter
const precosAltos = produtos
  .map(p => p.preco)
  .filter(preco => preco > 100);
// [200]

// Padrão: Filter → Reduce
const totalTech = produtos
  .filter(p => p.categoria === "Tech")
  .reduce((acc, p) => acc + p.preco, 0);
// 300
```

### 2. Transformação e Agregação

```typescript
const vendas = [
  { produto: "A", quantidade: 2, precoUnitario: 50 },
  { produto: "B", quantidade: 1, precoUnitario: 100 },
  { produto: "C", quantidade: 3, precoUnitario: 30 }
];

// Calcular faturamento total
const faturamento = vendas
  .map(v => v.quantidade * v.precoUnitario) // [100, 100, 90]
  .reduce((acc, total) => acc + total, 0);   // 290

// Com uma etapa só (mais eficiente)
const faturamento2 = vendas
  .reduce((acc, v) => acc + v.quantidade * v.precoUnitario, 0);
// 290
```

### 3. Pipeline Complexo

```typescript
interface Usuario {
  nome: string;
  idade: number;
  ativo: boolean;
  pontos: number;
}

const usuarios: Usuario[] = [
  { nome: "Ana", idade: 25, ativo: true, pontos: 100 },
  { nome: "Bob", idade: 17, ativo: false, pontos: 50 },
  { nome: "Carol", idade: 30, ativo: true, pontos: 200 },
  { nome: "David", idade: 20, ativo: true, pontos: 150 }
];

// Pipeline: filtrar → mapear → reduzir
const mediaPontosAtivos = usuarios
  .filter(u => u.ativo && u.idade >= 18)  // Apenas ativos adultos
  .map(u => u.pontos)                      // Extrair pontos
  .reduce((acc, p, i, arr) =>             // Calcular média
    i === arr.length - 1 ? (acc + p) / arr.length : acc + p, 0
  );
// 150 (média de 100, 200, 150)
```

### 4. Method Chaining vs. Variáveis Intermediárias

```typescript
// ✅ Method chaining - fluente
const resultado1 = numeros
  .filter(n => n > 3)
  .map(n => n * 2)
  .reduce((acc, n) => acc + n, 0);

// ✅ Variáveis intermediárias - mais debugável
const maioresQue3 = numeros.filter(n => n > 3);
const dobrados = maioresQue3.map(n => n * 2);
const soma = dobrados.reduce((acc, n) => acc + n, 0);

// Mesmo resultado, trade-off: fluência vs. debugabilidade
```

## 🎯 Aplicabilidade

### Processamento de Dados

```typescript
const transacoes = [
  { tipo: "compra", valor: 100, data: "2024-01-01" },
  { tipo: "venda", valor: 150, data: "2024-01-02" },
  { tipo: "compra", valor: 80, data: "2024-01-03" },
  { tipo: "venda", valor: 200, data: "2024-01-04" }
];

// Lucro total de vendas
const lucroVendas = transacoes
  .filter(t => t.tipo === "venda")
  .map(t => t.valor)
  .reduce((acc, v) => acc + v, 0);

// Saldo (vendas - compras)
const saldo = transacoes
  .reduce((acc, t) => {
    return t.tipo === "venda" ? acc + t.valor : acc - t.valor;
  }, 0);
```

### Normalização e Indexação

```typescript
const usuarios = [
  { id: 1, nome: "Ana", email: "ana@example.com" },
  { id: 2, nome: "Bob", email: "bob@example.com" }
];

// Criar índice por ID
const porId = usuarios
  .reduce((acc, u) => {
    acc[u.id] = u;
    return acc;
  }, {} as Record<number, typeof usuarios[0]>);
// { 1: { id: 1, ... }, 2: { id: 2, ... } }

// Lista de emails
const emails = usuarios
  .map(u => u.email);
// ["ana@example.com", "bob@example.com"]
```

### Estatísticas

```typescript
const notas = [7.5, 8.0, 6.5, 9.0, 7.0];

// Média
const media = notas.reduce((acc, n) => acc + n, 0) / notas.length;

// Acima da média
const acimaMedia = notas
  .filter(n => n >= media)
  .length;

// Resumo completo
const resumo = notas.reduce((acc, nota) => ({
  soma: acc.soma + nota,
  min: Math.min(acc.min, nota),
  max: Math.max(acc.max, nota),
  count: acc.count + 1
}), { soma: 0, min: Infinity, max: -Infinity, count: 0 });

const estatisticas = {
  ...resumo,
  media: resumo.soma / resumo.count
};
```

## ⚠️ Considerações de Performance

### 1. Múltiplas Passagens

```typescript
// ❌ Menos eficiente - 3 passagens pelo array
const resultado = numeros
  .filter(n => n % 2 === 0)  // Passagem 1
  .map(n => n ** 2)          // Passagem 2
  .reduce((acc, n) => acc + n, 0); // Passagem 3

// ✅ Mais eficiente - 1 passagem
const resultado2 = numeros.reduce((acc, n) => {
  if (n % 2 === 0) {
    return acc + n ** 2;
  }
  return acc;
}, 0);
```

### 2. Arrays Intermediários

```typescript
// Cada método cria novo array
const grande = Array(1_000_000).fill(0).map((_, i) => i);

// Cria 2 arrays intermediários
const resultado = grande
  .filter(n => n % 2 === 0)  // Array de 500k elementos
  .map(n => n * 2)           // Array de 500k elementos
  .reduce((acc, n) => acc + n, 0); // Resultado único

// Alternativa: reduce puro (sem arrays intermediários)
const resultado2 = grande.reduce((acc, n) => {
  if (n % 2 === 0) return acc + n * 2;
  return acc;
}, 0);
```

## 📚 Conclusão

Composição de map/filter/reduce cria pipelines declarativos para processamento de dados. Permite transformações expressivas e legíveis através de encadeamento de métodos. Trade-off entre clareza (múltiplas passagens) e performance (reduce único). Ideal para transformações de dados, agregações e processamento funcional.
