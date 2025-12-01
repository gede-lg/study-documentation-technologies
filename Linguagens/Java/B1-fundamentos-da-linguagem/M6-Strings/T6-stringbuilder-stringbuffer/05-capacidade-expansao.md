# Capacidade e Expansão Automática

## 🎯 Introdução e Definição

**StringBuilder gerencia um array de caracteres interno** com **capacidade** (tamanho do array) que pode ser **maior que o número de caracteres** efetivamente armazenados (length). Quando a capacidade é excedida, o StringBuilder **expande automaticamente** o array, permitindo construção eficiente de Strings sem realocar a cada append.

**Conceito central**: **Capacidade** é o tamanho total do array interno, **length** é quantos caracteres estão em uso. O StringBuilder **dobra a capacidade** quando necessário, minimizando realocações e mantendo performance O(1) amortizada para append().

**Exemplo fundamental**:
```java
StringBuilder sb = new StringBuilder();

System.out.println("Capacity: " + sb.capacity());  // 16 (padrão)
System.out.println("Length: " + sb.length());      // 0

sb.append("Hello");
System.out.println("Capacity: " + sb.capacity());  // 16 (sem expansão)
System.out.println("Length: " + sb.length());      // 5

sb.append(" World Programming");  // Total 23 chars
System.out.println("Capacity: " + sb.capacity());  // 34 (expandiu!)
System.out.println("Length: " + sb.length());      // 23

// Array interno cresceu automaticamente
```

**Características principais**:
- **Capacidade inicial**: 16 por padrão, ou especificada
- **Expansão automática**: (oldCapacity * 2) + 2
- **Performance**: O(1) amortizada para append()
- **Controle**: ensureCapacity(), trimToSize()
- **Otimização**: definir capacidade inicial evita expansões

## 📋 Fundamentos Teóricos

### 1️⃣ Estrutura Interna

**Array mutável**:

```java
// Estrutura interna simplificada do StringBuilder
class StringBuilder {
    char[] value;      // Array de caracteres (mutável)
    int count;         // Número de caracteres usados (length)
    
    // capacity = value.length (tamanho do array)
    // length = count (caracteres efetivamente usados)
}
```

**Visualização**:
```java
StringBuilder sb = new StringBuilder();
sb.append("Hi");

// Internamente:
// value = ['H', 'i', '\0', '\0', '\0', ... '\0']  // 16 posições
//          ^^^^^ usado      ^^^^^^^^^^^^^ disponível
// count = 2
// capacity = 16
// length = 2
```

**Diferença entre capacity e length**:
```java
StringBuilder sb = new StringBuilder();

System.out.println(sb.capacity());  // 16 - tamanho do array
System.out.println(sb.length());    // 0  - caracteres usados

sb.append("Java");

System.out.println(sb.capacity());  // 16 - array ainda tem espaço
System.out.println(sb.length());    // 4  - 4 caracteres em uso

// capacity >= length (sempre)
// capacity - length = espaço disponível
```

### 2️⃣ Capacidade Inicial

**Construtores**:

```java
// 1. Sem parâmetro - capacidade 16
StringBuilder sb1 = new StringBuilder();
System.out.println(sb1.capacity());  // 16

// 2. Com capacidade específica
StringBuilder sb2 = new StringBuilder(100);
System.out.println(sb2.capacity());  // 100

// 3. A partir de String - length da String + 16
StringBuilder sb3 = new StringBuilder("Hello");  // length=5
System.out.println(sb3.capacity());  // 21 (5 + 16)
System.out.println(sb3.length());    // 5

// 4. A partir de CharSequence
CharSequence cs = "World";
StringBuilder sb4 = new StringBuilder(cs);
System.out.println(sb4.capacity());  // 21 (5 + 16)
```

**Por que +16 no construtor com String?**
```java
// Design: assume que você vai adicionar mais conteúdo
StringBuilder sb = new StringBuilder("Hello");
// Capacity = 5 + 16 = 21

// Permite append sem expansão imediata
sb.append(" World");      // 11 chars total
sb.append(" Java");       // 16 chars total
sb.append(" 2024");       // 21 chars total - ainda cabe!
// Nenhuma expansão necessária até aqui
```

**Capacidade 0 (caso especial)**:
```java
StringBuilder sb = new StringBuilder(0);
System.out.println(sb.capacity());  // 0
System.out.println(sb.length());    // 0

// Primeiro append força expansão
sb.append("A");
System.out.println(sb.capacity());  // 2 (0*2+2 = 2)
System.out.println(sb.length());    // 1
```

### 3️⃣ Algoritmo de Expansão

**Fórmula de expansão**:

```java
// Quando capacity é excedida:
int newCapacity = (oldCapacity * 2) + 2;

// Se ainda não for suficiente:
newCapacity = Math.max(newCapacity, minimumNeeded);
```

**Demonstração**:
```java
StringBuilder sb = new StringBuilder(10);  // capacity=10

System.out.println("Inicial: " + sb.capacity());  // 10

// append 11 caracteres - excede capacidade
sb.append("12345678901");

// Nova capacidade: (10 * 2) + 2 = 22
System.out.println("Após expansão: " + sb.capacity());  // 22

// append mais 12 caracteres (total 23)
sb.append("123456789012");

// Nova capacidade: (22 * 2) + 2 = 46
System.out.println("Após 2ª expansão: " + sb.capacity());  // 46
```

**Sequência de expansões**:
```java
StringBuilder sb = new StringBuilder(1);

System.out.println("0: " + sb.capacity());  // 1

sb.append("XX");    // Excede 1
System.out.println("1: " + sb.capacity());  // 4 (1*2+2)

sb.append("XXX");   // Excede 4
System.out.println("2: " + sb.capacity());  // 10 (4*2+2)

sb.append("XXXXXXX");  // Excede 10
System.out.println("3: " + sb.capacity());  // 22 (10*2+2)

// Crescimento exponencial: 1 -> 4 -> 10 -> 22 -> 46 -> ...
```

**Caso especial - append grande**:
```java
StringBuilder sb = new StringBuilder(10);  // capacity=10

// append 100 caracteres de uma vez
String grande = "A".repeat(100);
sb.append(grande);

// capacity calculada: (10 * 2) + 2 = 22
// Mas 22 < 100 (mínimo necessário)
// Então usa Math.max(22, 100) = 100
System.out.println(sb.capacity());  // 100
```

### 4️⃣ Métodos de Capacidade

**capacity() - retorna capacidade atual**:

```java
StringBuilder sb = new StringBuilder(50);

System.out.println(sb.capacity());  // 50

sb.append("Hello");
System.out.println(sb.capacity());  // 50 (não mudou)

sb.append("A".repeat(100));  // Total 105 chars
System.out.println(sb.capacity());  // 105+ (expandiu)
```

**ensureCapacity(int minimumCapacity) - garantir capacidade**:
```java
StringBuilder sb = new StringBuilder(10);

System.out.println(sb.capacity());  // 10

// ensureCapacity força expansão se necessário
sb.ensureCapacity(50);
System.out.println(sb.capacity());  // 50+ (expandiu)

// ensureCapacity menor que capacity atual não faz nada
sb.ensureCapacity(20);
System.out.println(sb.capacity());  // 50 (não diminuiu)
```

**trimToSize() - reduzir capacidade ao length**:
```java
StringBuilder sb = new StringBuilder(1000);
sb.append("Hello");  // length=5, capacity=1000

System.out.println("Antes trimToSize:");
System.out.println("  capacity: " + sb.capacity());  // 1000
System.out.println("  length: " + sb.length());      // 5

// trimToSize() reduz capacity para length
sb.trimToSize();

System.out.println("Após trimToSize:");
System.out.println("  capacity: " + sb.capacity());  // 5
System.out.println("  length: " + sb.length());      // 5

// Libera memória não utilizada
```

**setLength() - alterar length**:
```java
StringBuilder sb = new StringBuilder("Hello World");

System.out.println("Inicial:");
System.out.println("  capacity: " + sb.capacity());  // 27 (11+16)
System.out.println("  length: " + sb.length());      // 11

// Truncar - reduz length
sb.setLength(5);
System.out.println("Após setLength(5):");
System.out.println("  capacity: " + sb.capacity());  // 27 (não muda)
System.out.println("  length: " + sb.length());      // 5
System.out.println("  valor: " + sb);                // "Hello"

// Expandir - aumenta length (preenche com \0)
sb.setLength(10);
System.out.println("Após setLength(10):");
System.out.println("  capacity: " + sb.capacity());  // 27
System.out.println("  length: " + sb.length());      // 10
// chars 5-9 são '\0'

// Limpar - setLength(0)
sb.setLength(0);
System.out.println("Após setLength(0):");
System.out.println("  capacity: " + sb.capacity());  // 27 (não muda)
System.out.println("  length: " + sb.length());      // 0
System.out.println("  valor: '" + sb + "'");         // ""
```

### 5️⃣ Impacto na Performance

**Número de expansões**:

```java
int n = 10000;

// Sem especificar capacidade - múltiplas expansões
long inicio = System.nanoTime();
StringBuilder sb1 = new StringBuilder();  // capacity=16
for (int i = 0; i < n; i++) {
    sb1.append("X");  // Vai expandir ~13 vezes
}
long tempo1 = (System.nanoTime() - inicio) / 1000;

// Com capacidade adequada - sem expansões
inicio = System.nanoTime();
StringBuilder sb2 = new StringBuilder(n);  // capacity=10000
for (int i = 0; i < n; i++) {
    sb2.append("X");  // Nunca expande
}
long tempo2 = (System.nanoTime() - inicio) / 1000;

System.out.println("Sem capacity: " + tempo1 + "µs");    // ~600µs
System.out.println("Com capacity: " + tempo2 + "µs");    // ~300µs
// ~2x mais rápido com capacidade inicial adequada!
```

**Custo de cópia durante expansão**:
```java
// Cada expansão copia TODO o conteúdo atual
// Custo: O(n) para copiar n caracteres

// Capacidades: 16 -> 34 -> 70 -> 142 -> 286 -> 574 -> ...
// Cópias:      16    34    70    142    286   (caracteres copiados)
// Total copiado: 16+34+70+142+286+... ≈ 2n (amortizado)
// Complexidade amortizada: O(1) por append

// Mas com capacidade inicial correta: 0 cópias!
```

**Benchmark detalhado**:
```java
int[] tamanhos = {100, 1000, 10000};

for (int n : tamanhos) {
    // Sem capacidade inicial
    long inicio = System.nanoTime();
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < n; i++) sb.append("X");
    long tempoSem = (System.nanoTime() - inicio) / 1000;
    
    // Com capacidade inicial
    inicio = System.nanoTime();
    sb = new StringBuilder(n);
    for (int i = 0; i < n; i++) sb.append("X");
    long tempoCom = (System.nanoTime() - inicio) / 1000;
    
    double melhora = (double)tempoSem / tempoCom;
    
    System.out.printf("n=%5d: Sem=%4dµs  Com=%4dµs  Melhora=%.2fx\n",
                      n, tempoSem, tempoCom, melhora);
}

// Saída típica:
// n=  100: Sem=  50µs  Com=  30µs  Melhora=1.67x
// n= 1000: Sem= 300µs  Com= 150µs  Melhora=2.00x
// n=10000: Sem=3000µs  Com=1500µs  Melhora=2.00x
```

### 6️⃣ Estimando Capacidade Ideal

**Tamanho conhecido antecipadamente**:

```java
// Construir SQL com tamanho aproximado conhecido
int estimativa = 200;  // Estimar tamanho final
StringBuilder sql = new StringBuilder(estimativa);

sql.append("SELECT id, nome, email, idade, cidade ");
sql.append("FROM usuarios ");
sql.append("WHERE ativo = true ");
sql.append("AND idade > 18 ");
sql.append("ORDER BY nome");

// Nenhuma expansão se estimativa correta
```

**Loop conhecido**:
```java
int elementos = lista.size();
int charsPorElemento = 20;  // Estimativa
int estimativa = elementos * charsPorElemento;

StringBuilder sb = new StringBuilder(estimativa);
for (Item item : lista) {
    sb.append(item.toString()).append("\n");
}
```

**Concatenação com delimitador**:
```java
List<String> palavras = List.of("Java", "Python", "C++", "Go");

// Estimar: soma dos lengths + delimitadores
int estimativa = palavras.stream()
                         .mapToInt(String::length)
                         .sum() + (palavras.size() - 1) * 2;  // ", "

StringBuilder sb = new StringBuilder(estimativa);
for (int i = 0; i < palavras.size(); i++) {
    if (i > 0) sb.append(", ");
    sb.append(palavras.get(i));
}
```

**Sobrestimar vs subestimar**:
```java
// Sobrestimar um pouco é melhor que subestimar
int estimativa = tamanhoEsperado * 1.2;  // +20% margem

StringBuilder sb = new StringBuilder((int)estimativa);

// Pequeno desperdício de memória (melhor que múltiplas cópias)
```

### 7️⃣ Padrão de Crescimento

**Visualização do crescimento**:

```java
StringBuilder sb = new StringBuilder(1);
List<Integer> capacidades = new ArrayList<>();

capacidades.add(sb.capacity());  // 1

for (int i = 0; i < 10; i++) {
    sb.append("X".repeat((int)Math.pow(2, i)));
    capacidades.add(sb.capacity());
}

System.out.println("Sequência de capacidades:");
System.out.println(capacidades);

// Saída: [1, 4, 10, 22, 46, 94, 190, 382, 766, 1534, 3070]
// Crescimento ~exponencial (dobra a cada expansão)
```

**Número de expansões para n elementos**:
```java
// Capacidade inicial: c
// Após k expansões: c * (2^k) + algum offset

// Para n elementos:
// k ≈ log₂(n / c)

// Exemplo: c=16, n=10000
// k ≈ log₂(10000 / 16) = log₂(625) ≈ 9.3 ≈ 10 expansões

int capacidade = 16;
int expansoes = 0;

while (capacidade < 10000) {
    capacidade = (capacidade * 2) + 2;
    expansoes++;
}

System.out.println("Expansões necessárias: " + expansoes);  // ~10
```

### 8️⃣ Uso de Memória

**Overhead de capacidade**:

```java
StringBuilder sb = new StringBuilder(1000);
sb.append("Hi");  // length=2

// Memória usada: 1000 chars * 2 bytes = 2000 bytes
// Memória útil: 2 chars * 2 bytes = 4 bytes
// Desperdício: 1996 bytes (99.8%)

// trimToSize() para economizar
sb.trimToSize();
// Agora: 2 chars * 2 bytes = 4 bytes (sem desperdício)
```

**Quando usar trimToSize()**:
```java
// Construir String que será mantida por longo tempo
StringBuilder sb = new StringBuilder(10000);

// ... muitas operações ...

sb.append("conteúdo final");

// Vai armazenar por muito tempo - economizar memória
sb.trimToSize();

String resultado = sb.toString();
```

**Comparação de memória**:
```java
// 10000 Strings de 5 chars cada
List<String> strings = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    StringBuilder sb = new StringBuilder();  // capacity=16
    sb.append("Hello");  // length=5
    strings.add(sb.toString());
}

// Cada StringBuilder: 16 chars * 2 bytes = 32 bytes
// Usado: 5 chars * 2 bytes = 10 bytes
// Desperdício total: (32 - 10) * 10000 = 220KB

// Com capacidade adequada:
strings = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    StringBuilder sb = new StringBuilder(5);  // capacity=5
    sb.append("Hello");
    strings.add(sb.toString());
}
// Desperdício: 0 bytes
```

### 9️⃣ Boas Práticas

**Estimar capacidade quando possível**:

```java
// ✓ Tamanho conhecido
StringBuilder sb = new StringBuilder(estimativa);

// vs ⚠️ Deixar padrão (múltiplas expansões)
StringBuilder sb = new StringBuilder();
```

**ensureCapacity() antes de loop**:
```java
StringBuilder sb = new StringBuilder();

// ✓ Garantir capacidade antes do loop
sb.ensureCapacity(lista.size() * 50);

for (Item item : lista) {
    sb.append(item);
}
```

**trimToSize() para long-lived**:
```java
StringBuilder sb = new StringBuilder(10000);
// ... operações ...
sb.trimToSize();  // Economizar memória
String resultado = sb.toString();
```

**setLength(0) para reusar**:
```java
StringBuilder sb = new StringBuilder(1000);

for (Grupo grupo : grupos) {
    sb.setLength(0);  // Limpar, mantém capacity
    
    for (Item item : grupo) {
        sb.append(item);
    }
    
    processar(sb.toString());
}
// Não realoca array a cada grupo
```

**Não sobre-otimizar**:
```java
// ⚠️ Não vale a pena para pequenos StringBuilder
StringBuilder sb = new StringBuilder(5);  // Economiza ~22 bytes
sb.append("Hi");

// ✓ Padrão é OK para uso pontual
StringBuilder sb = new StringBuilder();
sb.append("Hi");
```

### 🔟 Comparação: Com vs Sem Capacidade Inicial

**Cenário: construir String com 10000 caracteres**:

```java
// Sem capacidade inicial
StringBuilder sb1 = new StringBuilder();  // capacity=16
for (int i = 0; i < 10000; i++) {
    sb1.append("X");
}

// Expansões: 16->34->70->142->286->574->1150->2302->4606->9214->18430
// Total: ~10 expansões, cada uma copia todo conteúdo anterior
// Caracteres copiados: ~20000 (amortizado 2n)

// Com capacidade inicial
StringBuilder sb2 = new StringBuilder(10000);  // capacity=10000
for (int i = 0; i < 10000; i++) {
    sb2.append("X");
}

// Expansões: 0
// Caracteres copiados: 0
```

**Benchmark**:
```java
int n = 100000;

// Sem capacidade
long inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append("X");
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// Com capacidade
inicio = System.nanoTime();
sb = new StringBuilder(n);
for (int i = 0; i < n; i++) sb.append("X");
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("Sem capacity: " + tempo1 + "ms");  // ~15ms
System.out.println("Com capacity: " + tempo2 + "ms");  // ~7ms
// ~2x mais rápido!
```

**Tabela resumo**:

| Aspecto | Sem Capacidade | Com Capacidade |
|---------|---------------|---------------|
| **Capacity inicial** | 16 | n (estimado) |
| **Expansões (n=10k)** | ~10 | 0 |
| **Cópias** | ~20k chars | 0 |
| **Performance** | Baseline | ~2x mais rápido |
| **Complexidade** | O(n) amortizado | O(n) direto |
| **Uso memória** | Eventual | Imediato |

## 🎯 Aplicabilidade

**1. Especificar Capacidade Inicial**:
```java
StringBuilder sb = new StringBuilder(estimativa);
```

**2. ensureCapacity() Antes de Loop**:
```java
sb.ensureCapacity(tamanhoTotal);
```

**3. trimToSize() para Economizar**:
```java
sb.trimToSize();
```

**4. setLength(0) para Reutilizar**:
```java
sb.setLength(0);
```

**5. Monitorar Capacidade**:
```java
System.out.println(sb.capacity());
```

## ⚠️ Armadilhas Comuns

**1. Ignorar Capacidade em Loops**:
```java
StringBuilder sb = new StringBuilder();  // ⚠️ Vai expandir várias vezes
for (int i = 0; i < 10000; i++) sb.append("X");
```

**2. Capacidade Muito Pequena**:
```java
StringBuilder sb = new StringBuilder(10);
sb.append("X".repeat(10000));  // ⚠️ Ainda vai expandir
```

**3. Não Usar trimToSize() Long-Lived**:
```java
StringBuilder sb = new StringBuilder(10000);
sb.append("Hi");  // ⚠️ Desperdiça 9998 chars
// Deveria: sb.trimToSize();
```

**4. Sobrestimar Muito**:
```java
StringBuilder sb = new StringBuilder(1000000);  // ⚠️ 2MB desnecessários
sb.append("Hi");
```

**5. ensureCapacity() Após Loop**:
```java
for (int i = 0; i < 10000; i++) sb.append("X");
sb.ensureCapacity(10000);  // ⚠️ Tarde demais!
```

## ✅ Boas Práticas

**1. Estimar e Especificar Capacidade**:
```java
StringBuilder sb = new StringBuilder(estimativa);
```

**2. ensureCapacity() Preventivo**:
```java
sb.ensureCapacity(tamanhoNecessario);
```

**3. trimToSize() para Long-Lived**:
```java
sb.trimToSize();
```

**4. setLength(0) para Reutilizar**:
```java
sb.setLength(0);  // Mantém capacity
```

**5. Margem de Segurança na Estimativa**:
```java
int estimativa = (int)(tamanhoEsperado * 1.2);
```

## 📚 Resumo Executivo

**Capacidade e expansão** em StringBuilder.

**Conceitos**:
```java
capacity: tamanho do array interno
length: caracteres efetivamente usados
capacity >= length (sempre)
```

**Capacidade inicial**:
```java
new StringBuilder()         -> capacity = 16
new StringBuilder(100)      -> capacity = 100
new StringBuilder("Hello")  -> capacity = 21 (5+16)
```

**Expansão automática**:
```java
newCapacity = (oldCapacity * 2) + 2
Sequência: 16 -> 34 -> 70 -> 142 -> 286 -> ...
Crescimento ~exponencial
```

**Métodos**:
```java
capacity()            // Retorna capacity atual
ensureCapacity(min)   // Garante capacity mínima
trimToSize()          // Reduz capacity ao length
setLength(n)          // Altera length (truncar/expandir)
```

**Performance**:
```java
Sem capacity inicial (n=10k): ~10 expansões, ~20k cópias
Com capacity inicial (n=10k): 0 expansões, 0 cópias
Melhora: ~2x mais rápido
```

**Uso típico**:
```java
// Estimar tamanho
int estimativa = lista.size() * 50;

// Especificar capacity
StringBuilder sb = new StringBuilder(estimativa);

// Usar normalmente
for (Item item : lista) {
    sb.append(item);
}

// Sem expansões = máxima performance!
```

**Recomendação**: **Sempre especifique capacidade inicial** quando souber tamanho aproximado (2x mais rápido). Use **ensureCapacity()** antes de loops. Use **trimToSize()** para economizar memória em long-lived StringBuilder. Use **setLength(0)** para reutilizar mantendo capacity. Pequeno esforço, grande ganho de performance.