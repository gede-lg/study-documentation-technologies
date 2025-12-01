# Método intern()

## 🎯 Introdução e Definição

### Definição Conceitual Clara

O **método `intern()`** é a operação que força uma String a ser adicionada ao String Pool (ou retorna versão já existente no pool), garantindo que apenas uma cópia de cada sequência de caracteres única exista na memória, transformando Strings criadas via `new` (heap regular) em referências pool-based compartilháveis. Conceitualmente, é a interning manual - "JVM, pegue esta String que criei fora do pool e me dê a versão canônica do pool, criando-a se necessário".

É o reconhecimento de que, enquanto literais vão automaticamente para o pool, Strings criadas dinamicamente (concatenação runtime, leitura de arquivos, construtores) não vão - e `intern()` permite recuperar benefícios do pool (economia de memória via compartilhamento) mesmo para Strings geradas programaticamente.

### Contexto Histórico e Motivação

String pooling existe desde primórdios de Java (1996) como otimização de memória. `intern()` foi adicionado para permitir que programadores apliquem mesma otimização a Strings runtime. Motivação: aplicações processando grandes volumes de texto repetitivo (logs, dados estruturados) desperdiçavam memória com Strings duplicadas.

**Caso histórico:** Parsers XML/JSON criavam milhares de Strings idênticas (nomes de tags/chaves) - intern() reduzia uso de memória dramaticamente.

### Problema Fundamental que Resolve

**Problema:** Strings criadas dinamicamente duplicam memória:

```java
String s1 = new String("Java");
String s2 = new String("Java");
String s3 = new String("Java");
// 3 objetos distintos com conteúdo idêntico "Java" - desperdício!
```

**Solução:** Interning deduplica:

```java
String s1 = new String("Java").intern();
String s2 = new String("Java").intern();
String s3 = new String("Java").intern();
// s1, s2, s3 apontam para MESMO objeto no pool - economia!
System.out.println(s1 == s2 && s2 == s3);  // true
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Canonicalização:** intern() retorna versão "canônica" (única) de cada String.

2. **Pool Lookup:** Verifica se String idêntica já existe no pool.

3. **Adição Condicional:** Adiciona ao pool apenas se ausente.

4. **Retorno de Referência:** Sempre retorna referência do pool, nunca do heap regular.

5. **Trade-off:** Economiza memória, mas consome CPU (lookup) e pode vazar memória (pool cresce indefinidamente até Java 7).

### Pilares Fundamentais

- **Sintaxe:** `string.intern()` - retorna String
- **Retorno:** Referência do String Pool (pode ser mesmo objeto ou diferente)
- **Pool:** Area especial da heap (Java 7+) ou PermGen (Java 6-)
- **Uso:** Deduplicação de Strings repetitivas geradas dinamicamente

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Processo de Interning

```java
String s1 = new String("Java");  // Heap regular
String s2 = s1.intern();         // Pool
```

**Passos:**
1. **Lookup:** JVM busca "Java" no String Pool
2. **Decisão:**
   - Se encontrado: Retorna referência existente
   - Se não encontrado: Adiciona s1 ao pool, retorna nova referência
3. **Retorno:** s2 recebe referência do pool

**Diagrama de Memória:**

```
Antes de intern():
  Heap Regular: String("Java") ←── s1
  String Pool: (vazio ou outros)

Após s2 = s1.intern():
  Heap Regular: String("Java") ←── s1 (ainda existe!)
  String Pool: "Java" ←── s2 (referência do pool)
```

#### Comparação: Literal vs intern()

```java
// Literal - automaticamente no pool
String lit = "Java";

// new - heap regular
String obj = new String("Java");

// intern - força para pool
String interned = obj.intern();

System.out.println(lit == obj);       // false (pool vs heap)
System.out.println(lit == interned);  // true (ambos pool!)
System.out.println(obj == interned);  // false (heap vs pool)
```

**Análise:** `intern()` retorna mesma referência que literal - ambos no pool.

### Princípios e Conceitos Subjacentes

#### Princípio da Canonicalização

intern() garante "uma cópia única por valor":

```java
String a = new String("teste").intern();
String b = new String("teste").intern();
String c = "teste";

// Todos apontam para MESMO objeto
System.out.println(a == b);  // true
System.out.println(b == c);  // true
System.out.println(a == c);  // true
```

**Benefício:** Comparação rápida com `==` ao invés de `equals()`.

#### Princípio da Tabela Global

String Pool é estrutura global compartilhada por toda JVM:

```java
// Thread 1
String s1 = "shared".intern();

// Thread 2
String s2 = "shared".intern();

// s1 e s2 são MESMO objeto - pool é global
```

---

## 🔍 Análise Conceitual Profunda

### Casos de Uso Detalhados

#### Caso 1: Deduplicação de Dados Repetitivos

```java
List<String> nomes = new ArrayList<>();

// Ler 1 milhão de registros, muitos com mesmos nomes
for (int i = 0; i < 1_000_000; i++) {
    String nome = lerNomeDoBanco();  // "João", "Maria", "José" repetem muito
    nomes.add(nome.intern());  // Deduplica
}

// Sem intern: ~1M objetos String
// Com intern: ~100 objetos únicos (economia massiva!)
```

**Análise:** Quando dados têm alta repetição, intern() reduz drasticamente uso de memória.

#### Caso 2: Comparação Rápida

```java
// Configurações com valores repetitivos
Map<String, String> config = new HashMap<>();

String chave1 = lerChave().intern();
String chave2 = lerChave().intern();

// Comparação O(1) ao invés de O(n)
if (chave1 == chave2) {  // Rápido - compara referências
    // Mesma chave
}
```

**Análise:** `==` é mais rápido que `equals()`, mas só funciona com Strings internadas.

**Cuidado:** Só use `==` se TODAS Strings foram internadas. Misturar internadas e não-internadas causa bugs!

#### Caso 3: Parsing de Formatos Estruturados

```java
// Parser XML/JSON - tag/key names repetem muito
class XMLParser {
    private String parseTagName(byte[] bytes) {
        String tagName = new String(bytes, StandardCharsets.UTF_8);
        return tagName.intern();  // "div", "span", "p" aparecem milhares de vezes
    }
}
```

**Análise:** Tag names são fixos - intern() evita duplicatas.

#### Caso 4: Símbolos em Compiladores

```java
class Compiler {
    private Map<String, Symbol> symbolTable = new HashMap<>();

    public void addSymbol(String name, Symbol symbol) {
        String internedName = name.intern();  // Nomes de variáveis repetem
        symbolTable.put(internedName, symbol);
    }
}
```

**Análise:** Compiladores usam intern() extensivamente para tabelas de símbolos.

### Quando NÃO Usar

#### Anti-Padrão 1: Strings Únicas

```java
// MAL - Strings são sempre únicas
for (int i = 0; i < 100000; i++) {
    String uid = UUID.randomUUID().toString().intern();  // Desperdício!
    // Cada UUID é único - intern não deduplica nada
}
```

**Análise:** intern() tem custo (lookup) sem benefício se Strings não repetem.

#### Anti-Padrão 2: Strings de Usuário

```java
// MAL - poluir pool com input arbitrário
String userInput = scanner.nextLine().intern();  // Perigoso!
```

**Problema:** Usuário pode criar milhões de Strings únicas, inflando pool sem limite.

**Java 6:** Pool em PermGen (fixo) - OutOfMemoryError
**Java 7+:** Pool na heap - GC pode coletar, mas ainda problemático

#### Anti-Padrão 3: Strings Grandes

```java
// MAL - internar string grande
String largeText = readEntireFile().intern();  // Arquivo de 10MB
```

**Problema:** Pool é otimizado para Strings pequenas e repetitivas, não grandes e únicas.

### Comparação: Com e Sem intern()

**Cenário:** 1 milhão de Strings, 100 valores únicos

**Sem intern():**
```java
List<String> lista = new ArrayList<>();
for (int i = 0; i < 1_000_000; i++) {
    lista.add(new String("valor" + (i % 100)));
}
// Memória: ~1M objetos String (~40MB)
```

**Com intern():**
```java
List<String> lista = new ArrayList<>();
for (int i = 0; i < 1_000_000; i++) {
    lista.add(("valor" + (i % 100)).intern());
}
// Memória: 100 objetos String únicos (~4KB) + 1M referências (8MB)
// Economia: ~32MB (~80%)
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar intern()

✅ **Use intern() quando:**

1. **Alta Repetição:** Muitas Strings com poucos valores únicos
2. **Dados Estruturados:** Tag names, field names, enums
3. **Símbolos:** Compiladores, interpretadores
4. **Comparação Frequente:** Muitas comparações de igualdade
5. **Conhecido Limitado:** Conjunto de valores possíveis é pequeno

**Exemplo típico:** Parsing CSV com colunas fixas:
```java
String[] headers = {"nome", "idade", "cidade"};  // Repetem em cada linha
// Internar headers economiza memória
```

### Quando NÃO Usar

❌ **Não use intern() quando:**

1. **Valores Únicos:** UUIDs, timestamps únicos
2. **Input de Usuário:** Texto arbitrário e imprevisível
3. **Strings Grandes:** Textos longos (documentos, logs completos)
4. **Valores Descartáveis:** Strings temporárias de curta duração

---

## ⚠️ Limitações e Considerações

### Armadilhas Comuns

#### Armadilha 1: Misturar Internadas e Não-Internadas

```java
String a = "Java";  // Pool (literal)
String b = new String("Java");  // Heap

if (a == b) {  // false - uma pool, outra heap
    System.out.println("Iguais");  // Nunca executa
}

String c = b.intern();
if (a == c) {  // true - ambas pool
    System.out.println("Iguais");  // Executa!
}
```

**Lição:** Só use `==` se GARANTE que ambas foram internadas.

#### Armadilha 2: Poluir Pool com Dados Dinâmicos

```java
// PERIGOSO
while (true) {
    String userInput = readInput().intern();  // Pool cresce indefinidamente!
}
```

**Java 6:** OutOfMemoryError (PermGen fixo)
**Java 7+:** GC pode coletar, mas pool incha antes de GC

#### Armadilha 3: Presumir Melhor Performance Sempre

```java
// Pode ser MAIS LENTO
for (String s : millions OfUniqueStrings) {
    s.intern();  // Lookup falha sempre, desperdiça CPU
}
```

**Análise:** intern() tem custo - só vale a pena se deduplicação compensa lookup.

### Considerações de Performance

**Benchmark (aproximado):**

```java
// Sem intern - rápido criar, memória alta
String s = "value";  // ~5ns

// Com intern - lookup hash, mais lento
String s = "value".intern();  // ~50ns (10x mais lento)

// MAS: economia de memória e comparação rápida compensam em cenários corretos
```

**Guideline:** Use quando economia de memória > custo de CPU.

### Mudanças entre Versões Java

**Java 6 e anterior:**
- Pool em **PermGen** (tamanho fixo)
- `-XX:MaxPermSize` para ajustar
- Risky para dados runtime

**Java 7+:**
- Pool movido para **heap regular**
- Garbage collectible
- Mais seguro usar com dados runtime (mas ainda cuidado!)

**Java 8+:**
- PermGen removido completamente
- Metaspace substitui (com GC)

---

## 🔗 Interconexões Conceituais

### Relação com String Pool

intern() é API programática para String Pool:

```java
// Literal - automático
String a = "texto";

// Programático - manual
String b = new String("texto").intern();

System.out.println(a == b);  // true - ambos pool
```

### Relação com equals()

```java
String a = "Java";
String b = new String("Java");

// Sem intern - usar equals()
if (a.equals(b)) {  // O(n) comparação de caracteres
    // true
}

// Com intern - usar ==
String c = b.intern();
if (a == c) {  // O(1) comparação de referências
    // true, MAIS RÁPIDO
}
```

**Trade-off:** Custo de intern() uma vez vs custo de equals() múltiplas vezes.

### Relação com WeakHashMap

Alternativa moderna para deduplicação:

```java
// Ao invés de intern(), usar cache com weak refs
Map<String, WeakReference<String>> cache = new WeakHashMap<>();

String dedupe(String s) {
    WeakReference<String> ref = cache.get(s);
    if (ref != null) {
        String cached = ref.get();
        if (cached != null) return cached;
    }
    cache.put(s, new WeakReference<>(s));
    return s;
}
```

**Vantagem:** GC pode coletar quando não mais usado (diferente de intern que persiste).

---

## 🚀 Evolução e Próximos Conceitos

### Alternativas Modernas

**String Deduplication (Java 8u20+):**
```bash
java -XX:+UseStringDeduplication -XX:+UseG1GC MeuApp
```

**Análise:** G1 GC automaticamente deduplica Strings no heap - menos necessidade de intern() manual.

### Conceitos Relacionados

- **String Pool:** Area de armazenamento
- **WeakReference:** Referências coletáveis por GC
- **Flyweight Pattern:** Padrão de design para compartilhamento de objetos
- **String Deduplication:** Feature automática do G1 GC

---

## 📚 Conclusão

O método `intern()` força String a ir para String Pool, retornando versão canônica compartilhada, economizando memória quando muitas Strings têm valores repetitivos. É ferramenta poderosa mas especializada - use apenas quando dados têm alta repetição (tag names, field names, símbolos).

Dominar intern() significa:
- Usar para deduplicar Strings com poucos valores únicos repetidos muitas vezes
- Compreender que retorna referência do pool - pode usar `==` para comparação rápida
- Evitar internar input de usuário ou valores únicos (UUIDs, timestamps)
- Saber que Java 7+ moveu pool para heap (GC-able) vs Java 6 PermGen (fixo)
- Considerar String Deduplication do G1 GC como alternativa automática moderna
- Balancear custo de lookup vs economia de memória

intern() é otimização de nicho - maioria das aplicações não precisa. Mas para parsers, compiladores, e sistemas processando grandes volumes de dados estruturados repetitivos, pode reduzir uso de memória dramaticamente (50-90%).
