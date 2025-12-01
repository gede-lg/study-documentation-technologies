# Tamanho Fixo de Arrays

## 🎯 Introdução e Definição

**Arrays em Java são estruturas de tamanho fixo**: o número de elementos é **definido na criação** e **nunca muda**. Diferente de estruturas dinâmicas como `ArrayList`, arrays **não suportam** operações de adição ou remoção de elementos.

**Conceito central**: uma vez criado com `new tipo[n]`, o array **sempre terá exatamente `n` elementos** até ser descartado pelo Garbage Collector.

**Implicação fundamental**:
```java
int[] arr = new int[5];  // Sempre terá 5 elementos
// Não existe arr.add(), arr.remove(), arr.resize()
```

**Comparação com estruturas dinâmicas**:
- **Array**: tamanho fixo, alta performance, baixo overhead
- **ArrayList**: tamanho dinâmico, overhead de gerenciamento, mais flexível

A imutabilidade do tamanho é uma **característica fundamental** da implementação de arrays em Java e na maioria das linguagens.

## 📋 Fundamentos Teóricos

### 1️⃣ Imutabilidade do Campo length

O campo `length` é **`public final int`**, tornando o tamanho permanente:

```java
int[] arr = new int[3];
System.out.println(arr.length);  // 3

// Tentativa de modificação
// arr.length = 5;  // ❌ ERRO: cannot assign value to final variable

// length nunca muda
arr[0] = 100;  // Modifica elemento
System.out.println(arr.length);  // 3 (inalterado)
```

**Razão técnica**: `length` armazenado no **header do array** na memória, imutável por design.

### 2️⃣ Ausência de Operações de Redimensionamento

Arrays **não possuem** métodos para adicionar/remover elementos:

```java
int[] arr = new int[5];

// ❌ Todos causam ERRO DE COMPILAÇÃO
// arr.add(10);         // método não existe
// arr.remove(2);       // método não existe
// arr.resize(10);      // método não existe
// arr.push(5);         // método não existe
// arr.pop();           // método não existe

// ✅ Apenas acesso e modificação de elementos existentes
arr[0] = 10;  // OK: modifica elemento 0
int x = arr[2];  // OK: lê elemento 2
```

**Contraste com ArrayList**:
```java
ArrayList<Integer> lista = new ArrayList<>();
lista.add(10);     // ✅ Adiciona elemento
lista.remove(0);   // ✅ Remove elemento
lista.clear();     // ✅ Remove todos
```

### 3️⃣ "Redimensionamento" via Criação de Novo Array

Para simular redimensionamento, é necessário **criar novo array e copiar elementos**:

```java
int[] arr = {1, 2, 3};  // Tamanho 3

// "Expandir" para tamanho 5
int[] novoArr = new int[5];  // Novo array maior
for (int i = 0; i < arr.length; i++) {
    novoArr[i] = arr[i];  // Copia elementos
}
// novoArr = [1, 2, 3, 0, 0]

arr = novoArr;  // Reatribui referência (antigo array descartado)
```

**Custo**: operação **O(n)** - requer cópia de todos os elementos.

### 4️⃣ Arrays.copyOf() - Método Utilitário para Expansão

Java fornece `Arrays.copyOf()` para **criar cópia com novo tamanho**:

```java
int[] arr = {1, 2, 3};

// Expandir para tamanho 5
arr = Arrays.copyOf(arr, 5);  // [1, 2, 3, 0, 0]

// Reduzir para tamanho 2
arr = Arrays.copyOf(arr, 2);  // [1, 2] (elementos extras descartados)

// Mesmo tamanho (cópia)
int[] copia = Arrays.copyOf(arr, arr.length);
```

**Internamente**: cria novo array e usa `System.arraycopy()` (nativo, otimizado).

### 5️⃣ System.arraycopy() - Cópia de Baixo Nível

Método nativo para **cópia eficiente entre arrays**:

```java
int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[10];

// Copiar elementos 1-3 de origem para posição 2 de destino
System.arraycopy(origem, 1, destino, 2, 3);
// destino = [0, 0, 2, 3, 4, 0, 0, 0, 0, 0]
//               índices: 2, 3, 4
```

**Assinatura**:
```java
System.arraycopy(Object src, int srcPos, Object dest, int destPos, int length)
```

### 6️⃣ Collections para Tamanho Dinâmico

Quando tamanho varia frequentemente, **ArrayList** é mais apropriado:

```java
// Array: tamanho fixo
int[] arr = new int[5];
// Não pode crescer ou diminuir

// ArrayList: tamanho dinâmico
ArrayList<Integer> lista = new ArrayList<>();
lista.add(10);      // Cresce automaticamente
lista.add(20);
lista.remove(0);    // Remove e reorganiza
// Tamanho ajusta conforme necessário
```

**Tradeoff**:
- **Array**: performance superior, memória fixa, sem flexibilidade
- **ArrayList**: overhead de gerenciamento, memória dinâmica, totalmente flexível

### 7️⃣ Realocação Manual - Padrão de Crescimento

Implementações de estruturas dinâmicas sobre arrays usam **estratégia de duplicação**:

```java
public class DynamicArray {
    private int[] arr;
    private int size;
    
    public void add(int valor) {
        if (size == arr.length) {
            // Array cheio: duplica capacidade
            arr = Arrays.copyOf(arr, arr.length * 2);
        }
        arr[size++] = valor;
    }
}
```

**Estratégia**: duplicar capacidade quando cheio minimiza realocações (amortizado O(1)).

### 8️⃣ Garbage Collection de Arrays Antigos

Quando array é "redimensionado" (reatribuído), o antigo é **descartado** pelo GC:

```java
int[] arr = new int[1000];  // Array grande
arr = new int[5];  // Novo array pequeno
// Array de 1000 elementos torna-se elegível para GC (sem referências)
```

**Implicação**: "redimensionar" arrays grandes pode gerar **pressão de memória** temporária.

### 9️⃣ Limitações de Redimensionamento Parcial

Não é possível **redimensionar apenas parte** de um array multidimensional:

```java
int[][] matriz = new int[3][4];  // 3 linhas, 4 colunas cada

// ❌ Não pode mudar número de colunas de uma linha
// matriz[0].length = 5;  // ERRO

// ✅ Pode reatribuir linha inteira
matriz[0] = new int[5];  // Linha 0 agora tem 5 colunas
// matriz = [[0,0,0,0,0], [0,0,0,0], [0,0,0,0]]
```

### 🔟 Performance - Vantagens do Tamanho Fixo

Tamanho fixo permite **otimizações de performance**:

```java
// Array: acesso direto O(1), sem verificações
int[] arr = new int[1000];
int x = arr[500];  // Acesso direto via aritmética de ponteiros

// ArrayList: overhead de chamadas de método
ArrayList<Integer> lista = new ArrayList<>(1000);
int y = lista.get(500);  // Chamada de método, unboxing
```

**Vantagens**:
- Cache-friendly (memória contígua)
- Sem overhead de gerenciamento de capacidade
- Acesso direto sem indireção

## 🎯 Aplicabilidade

**1. Dados de Tamanho Conhecido e Estável**:
```java
int[] diasPorMes = new int[12];  // Sempre 12 meses
String[] diasSemana = new String[7];  // Sempre 7 dias
```

**2. Performance Crítica**:
```java
// Processamento de imagens: milhões de pixels
int[] pixels = new int[1920 * 1080];  // Tamanho fixo, acesso rápido
```

**3. Buffers de Tamanho Fixo**:
```java
byte[] buffer = new byte[8192];  // Buffer de I/O
```

**4. Algoritmos com Espaço Auxiliar Conhecido**:
```java
public void mergeSort(int[] arr) {
    int[] temp = new int[arr.length];  // Espaço auxiliar fixo
    // ...
}
```

**5. Estruturas de Dados Estáticas**:
```java
private static final String[] MESES = {
    "Janeiro", "Fevereiro", ..., "Dezembro"
};  // Tamanho nunca muda
```

## ⚠️ Armadilhas Comuns

**1. Tentar Adicionar Além da Capacidade**:
```java
int[] arr = new int[5];
for (int i = 0; i <= 10; i++) {  // ⚠️ Tenta acessar índices 0-10
    arr[i] = i;  // ❌ ArrayIndexOutOfBoundsException quando i >= 5
}
```

**2. Desperdiçar Memória com Arrays Grandes Demais**:
```java
int[] arr = new int[1_000_000];  // Aloca 4MB
// Se usar apenas 10 elementos, 99.999% desperdiçado
```

**3. Esquecer que length é Imutável**:
```java
int[] arr = new int[5];
arr[5] = 10;  // ❌ Não "adiciona" elemento, causa exceção
```

**4. Criar Novo Array em Loop (Ineficiente)**:
```java
int[] arr = new int[1];
for (int i = 0; i < 1000; i++) {
    arr = Arrays.copyOf(arr, arr.length + 1);  // ❌ O(n²) total!
    arr[arr.length - 1] = i;
}
// Use ArrayList para este caso!
```

## ✅ Boas Práticas

**1. Estime Tamanho Correto na Criação**:
```java
int quantidade = calcularQuantidade();
int[] arr = new int[quantidade];  // Tamanho exato
```

**2. Use ArrayList Quando Tamanho Varia**:
```java
// ❌ Ruim para tamanho variável
int[] arr = new int[estimativaMaxima];  // Desperdício

// ✅ Melhor
ArrayList<Integer> lista = new ArrayList<>();
```

**3. Arrays.copyOf() para Expansão Ocasional**:
```java
if (precisaMais) {
    arr = Arrays.copyOf(arr, arr.length * 2);
}
```

**4. Validar Limites Antes de Acessar**:
```java
if (indice >= 0 && indice < arr.length) {
    arr[indice] = valor;
}
```

**5. Usar Capacidade Inicial Apropriada**:
```java
// Se sabe que precisará de ~100 elementos
ArrayList<Integer> lista = new ArrayList<>(100);  // Evita realocações
```

**6. Constantes para Tamanhos Fixos**:
```java
private static final int TAMANHO_BUFFER = 8192;
byte[] buffer = new byte[TAMANHO_BUFFER];
```

## 📚 Resumo Executivo

Arrays em Java têm **tamanho fixo** definido na criação: `new tipo[n]` cria array de **exatamente `n` elementos**, imutável. O campo `length` é **`final`**, impossível de alterar.

**Sem operações dinâmicas**:
- ❌ Não existe `add()`, `remove()`, `resize()`
- ✅ Apenas acesso/modificação: `arr[i] = valor`

**"Redimensionamento"**: requer **criar novo array** e copiar:
- Manual: loop + cópia
- `Arrays.copyOf(arr, novoTamanho)`
- `System.arraycopy()` (baixo nível)

**Quando usar arrays**: tamanho conhecido, performance crítica, sem mudanças frequentes.
**Quando usar ArrayList**: tamanho dinâmico, adições/remoções frequentes.

Tamanho fixo é **design intencional** para **máxima performance** - tradeoff com flexibilidade.
