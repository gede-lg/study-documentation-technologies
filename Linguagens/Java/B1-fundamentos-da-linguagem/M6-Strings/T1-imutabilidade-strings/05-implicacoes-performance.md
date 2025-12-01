# Implicações da Imutabilidade em Performance

## 🎯 Introdução e Definição

**Imutabilidade de Strings** tem **impacto dual na performance**: **beneficia** através de cache, thread-safety e String Pool, mas **penaliza** quando há muitas modificações devido à criação de múltiplos objetos.

**Conceito central**: Entender **quando a imutabilidade ajuda** (compartilhamento, segurança) e **quando prejudica** (concatenações em loop, muitas transformações) é essencial para otimizar código Java.

**Exemplo comparativo**:
```java
// Cenário 1: BENEFICIA (compartilhamento)
String status = "ATIVO";
for (Usuario u : usuarios) {
    u.setStatus(status);  // Reutiliza mesma String
}
// Performance: Excelente (sem alocações)

// Cenário 2: PREJUDICA (muitas modificações)
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado += i;  // Cria 1000 Strings novas!
}
// Performance: Ruim (O(n²) tempo e memória)
```

**Implicações principais**:
- Concatenação em loops: O(n²) vs O(n) com StringBuilder
- Thread-safety gratuita (sem custo de sincronização)
- Garbage Collection: muitos objetos temporários
- Cache eficiente através do String Pool

## 📋 Fundamentos Teóricos

### 1️⃣ Concatenação - O Maior Gargalo

**String + em loops é O(n²)**:

```java
// ❌ Performance PÉSSIMA
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado += i;  // Cria nova String a cada iteração
}

// Iteração 1: "" + "0" = "0" (copia 0 chars + 1 char)
// Iteração 2: "0" + "1" = "01" (copia 1 char + 1 char)
// Iteração 3: "01" + "2" = "012" (copia 2 chars + 1 char)
// ...
// Iteração 1000: copia 999 chars + 1 char

// Total de cópias: 0+1+2+...+999 = 499.500 operações
// Complexidade: O(n²)
```

**Diagrama de memória**:
```
Iteração 1:  [0]           (1 char copiado)
Iteração 2:  [01]          (2 chars copiados)
Iteração 3:  [012]         (3 chars copiados)
...
Iteração 1000: [0123...999] (1000 chars copiados)

Total de Strings criadas: 1000
Total de chars copiados: ~500.000
Memória desperdiçada: ~500KB
```

**StringBuilder é O(n)**:

```java
// ✓ Performance ÓTIMA
StringBuilder sb = new StringBuilder(5000);
for (int i = 0; i < 1000; i++) {
    sb.append(i);  // Modifica array interno
}
String resultado = sb.toString();

// Complexidade: O(n)
// Objetos criados: 1 (resultado final)
// Cópias: mínimas (apenas expansões do array interno)
```

**Benchmark**:
```java
// Teste com 10.000 concatenações
// String +:        ~5000ms (5 segundos)
// StringBuilder:   ~5ms
// Diferença:       1000x mais rápido!
```

### 2️⃣ Quando Imutabilidade AJUDA

**Thread-safety sem custo**:

```java
// String é thread-safe automaticamente
public class Cache {
    private static final String MENSAGEM = "Bem-vindo";
    
    public String getMensagem() {
        return MENSAGEM;  // Sem sincronização necessária
    }
}

// vs StringBuilder (NÃO thread-safe)
public class CacheMutavel {
    private StringBuilder sb = new StringBuilder("Bem-vindo");
    
    public synchronized String getMensagem() {  // Precisa sincronizar!
        return sb.toString();
    }
}

// String: sem overhead de sincronização
// StringBuilder: custo de lock/unlock
```

**String Pool - cache gratuito**:

```java
// Literais são automaticamente cacheados
String s1 = "Java";
String s2 = "Java";
String s3 = "Java";

// s1 == s2 == s3 (mesma instância)
// Comparação: O(1) vs O(n) com equals()

// Performance:
if (s1 == s2) {  // Comparação de referência: ~1ns
    // ...
}

vs

if (s1.equals(s2)) {  // Comparação de conteúdo: ~10ns
    // ...
}

// == é 10x mais rápido!
```

**HashMap keys - hashCode constante**:

```java
Map<String, Integer> map = new HashMap<>();

String chave = "usuario123";
map.put(chave, 1);

// hashCode calculado 1 vez e cacheado
// Buscas subsequentes: O(1) sem recalcular hash

vs

// Objeto mutável - hashCode pode mudar
// Viola contrato de HashMap (não deve mudar após put)
```

### 3️⃣ Quando Imutabilidade PREJUDICA

**Muitas transformações**:

```java
// ❌ Muitas Strings temporárias
String texto = "hello world";
String resultado = texto.toUpperCase()    // String 1
                        .replace("O", "0") // String 2
                        .trim()            // String 3
                        .substring(0, 5);  // String 4

// 4 Strings criadas
// 3 descartadas (garbage)
```

**Concatenação com +**:

```java
// ❌ Ineficiente em loops
List<String> items = Arrays.asList("a", "b", "c", ...);  // 1000 items
String resultado = "";
for (String item : items) {
    resultado += item + ",";  // 2000 Strings criadas!
}

// Cada += cria nova String
// Cada + dentro do loop também cria String temporária
```

**format() repetido**:

```java
// ❌ Overhead de parsing
for (int i = 0; i < 10000; i++) {
    String msg = String.format("ID: %d, Status: %s", i, "OK");
    // Parser de formato executado 10.000 vezes
}

// ✓ Mais eficiente
for (int i = 0; i < 10000; i++) {
    String msg = "ID: " + i + ", Status: OK";
    // Concatenação simples (compilador otimiza)
}
```

### 4️⃣ StringBuilder vs String - Benchmarks

**Teste de concatenação**:

```java
// Teste: concatenar 10.000 números

// String +
long inicio = System.currentTimeMillis();
String s = "";
for (int i = 0; i < 10000; i++) {
    s += i;
}
long tempo = System.currentTimeMillis() - inicio;
// Resultado: ~3000ms

// StringBuilder
inicio = System.currentTimeMillis();
StringBuilder sb = new StringBuilder(50000);
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String resultado = sb.toString();
tempo = System.currentTimeMillis() - inicio;
// Resultado: ~3ms

// Diferença: 1000x mais rápido!
```

**Comparação de memória**:

```java
// String +: pico de ~5MB (muitos objetos temporários)
// StringBuilder: pico de ~50KB (1 array interno)
// Diferença: 100x menos memória
```

**Tabela de performance**:

| Operação | String + | StringBuilder | Ganho |
|----------|----------|---------------|-------|
| 100 concatenações | ~10ms | ~0.1ms | 100x |
| 1.000 concatenações | ~500ms | ~1ms | 500x |
| 10.000 concatenações | ~3000ms | ~3ms | 1000x |

### 5️⃣ Otimizações do Compilador

**Concatenação literal - otimizada**:

```java
// Código escrito:
String s = "a" + "b" + "c";

// Compilado como:
String s = "abc";  // Compilador junta literais

// Bytecode:
ldc "abc"  // Carrega literal único
```

**Concatenação em statement único**:

```java
// Código:
String nome = "João";
int idade = 30;
String msg = "Nome: " + nome + ", Idade: " + idade;

// Compilado (Java 9+) usando invokedynamic:
String msg = makeConcatWithConstants("Nome: \u0001, Idade: \u0001", nome, idade);

// Compilado (Java 8-):
String msg = new StringBuilder().append("Nome: ")
                                .append(nome)
                                .append(", Idade: ")
                                .append(idade)
                                .toString();
```

**Não otimizado - múltiplos statements**:

```java
// ❌ Compilador NÃO otimiza
String s = "a";
s += "b";  // Novo StringBuilder
s += "c";  // Novo StringBuilder
s += "d";  // Novo StringBuilder

// 3 StringBuilders criados e descartados
```

### 6️⃣ Garbage Collection - Impacto

**Strings temporárias pressionam GC**:

```java
// ❌ Cria 100.000 Strings temporárias
for (int i = 0; i < 100000; i++) {
    String temp = "valor" + i;
    processar(temp);
    // temp elegível para GC
}

// Young Generation GC frequente
// Pausas: ~10-50ms a cada 1000 iterações
```

**Monitorar GC**:
```bash
java -Xlog:gc* -Xmx512m App

# Saída:
[0.123s][info][gc] GC(0) Pause Young (Normal) 102M->25M(512M) 15.234ms
[0.234s][info][gc] GC(1) Pause Young (Normal) 127M->30M(512M) 18.123ms
# Muitas pausas = muitas Strings temporárias
```

**Reduzir pressão GC**:

```java
// ✓ Reutiliza StringBuilder
StringBuilder sb = new StringBuilder(50);
for (int i = 0; i < 100000; i++) {
    sb.setLength(0);  // Limpa sem realocar
    sb.append("valor").append(i);
    processar(sb.toString());  // Apenas String final é criada
}

// GC reduzido em ~90%
```

### 7️⃣ String.concat() vs + vs StringBuilder

**Desempenho comparativo**:

```java
// Teste: concatenar 2 Strings 1.000.000 vezes

// String.concat()
String s = "a";
for (int i = 0; i < 1000000; i++) {
    s = s.concat("b");
}
// Tempo: ~800ms

// Operador +
s = "a";
for (int i = 0; i < 1000000; i++) {
    s = s + "b";
}
// Tempo: ~850ms (similar, compilador usa concat/StringBuilder)

// StringBuilder
StringBuilder sb = new StringBuilder("a");
for (int i = 0; i < 1000000; i++) {
    sb.append("b");
}
String resultado = sb.toString();
// Tempo: ~15ms

// StringBuilder: 50x mais rápido!
```

**Quando usar cada um**:

```java
// + : concatenações simples (2-3 strings)
String nome = "Sr. " + primeiroNome + " " + sobrenome;

// concat(): concatenação de 2 strings (sem tipos primitivos)
String completo = prefixo.concat(sufixo);

// StringBuilder: loops, muitas concatenações
StringBuilder sql = new StringBuilder(500);
sql.append("SELECT * FROM users WHERE ");
for (Filtro f : filtros) {
    sql.append(f.getCampo()).append(" = ? AND ");
}
```

### 8️⃣ Método replace() e Performance

**replace() cria nova String**:

```java
String texto = "O rato roeu a roupa do rei de Roma";

// Múltiplos replaces em cadeia
String resultado = texto.replace("rato", "gato")
                        .replace("roeu", "comeu")
                        .replace("roupa", "comida");

// 3 Strings intermediárias criadas
```

**Otimização com Pattern**:

```java
// ✓ Mais eficiente para múltiplas substituições
Pattern pattern = Pattern.compile("rato|roeu|roupa");
Matcher matcher = pattern.matcher(texto);

StringBuffer sb = new StringBuffer();
while (matcher.find()) {
    String substituicao = obterSubstituicao(matcher.group());
    matcher.appendReplacement(sb, substituicao);
}
matcher.appendTail(sb);
String resultado = sb.toString();

// 1 String final, menos intermediárias
```

### 9️⃣ split() - Custo Oculto

**split() usa regex**:

```java
// ❌ Overhead de Pattern
for (int i = 0; i < 10000; i++) {
    String[] partes = linha.split(",");
    // Compila regex a cada iteração
}
// Tempo: ~100ms
```

**Otimização**:

```java
// ✓ Compila Pattern uma vez
Pattern pattern = Pattern.compile(",");
for (int i = 0; i < 10000; i++) {
    String[] partes = pattern.split(linha);
}
// Tempo: ~10ms (10x mais rápido)

// ou

// ✓ Ainda mais rápido para delimitadores simples
for (int i = 0; i < 10000; i++) {
    String[] partes = linha.split(",", -1);  // Dica ao compilador
}
```

**StringTokenizer - alternativa**:

```java
// ✓ Mais rápido que split() para casos simples
StringTokenizer st = new StringTokenizer(linha, ",");
while (st.hasMoreTokens()) {
    String parte = st.nextToken();
    // processar
}
// Tempo: ~5ms (20x mais rápido que split)
```

### 🔟 Estratégias de Otimização

**1. StringBuilder com capacidade inicial**:

```java
// ❌ Sem capacidade
StringBuilder sb = new StringBuilder();  // cap=16
for (int i = 0; i < 1000; i++) {
    sb.append("item");  // Múltiplas expansões
}

// ✓ Com capacidade
int tamanho = 1000 * 4;  // "item" = 4 chars
StringBuilder sb = new StringBuilder(tamanho);
for (int i = 0; i < 1000; i++) {
    sb.append("item");  // Sem expansões
}
// 30% mais rápido
```

**2. Reutilizar StringBuilder**:

```java
// ✓ Reutiliza entre iterações
StringBuilder sb = new StringBuilder(100);
for (Item item : items) {
    sb.setLength(0);  // Limpa sem realocar
    sb.append(item.getId()).append(": ").append(item.getNome());
    String linha = sb.toString();
    processar(linha);
}
```

**3. Cache de Strings computadas**:

```java
// ✓ Evita recomputação
Map<Integer, String> cache = new HashMap<>();
for (int id : ids) {
    String desc = cache.computeIfAbsent(id, this::gerarDescricao);
    usar(desc);
}
```

**4. Preferir literais**:

```java
// ✓ Pool (reutilização)
String status = "ATIVO";

// ✗ Heap (sem reutilização)
String status = new String("ATIVO");
```

**5. Avaliar necessidade de imutabilidade**:

```java
// String - imutável (quando necessário compartilhar)
public class Usuario {
    private final String nome;  // Imutável, compartilhável
}

// StringBuilder - mutável (quando construir incrementalmente)
public String gerarRelatorio() {
    StringBuilder sb = new StringBuilder(10000);
    // construir relatório
    return sb.toString();
}
```

## 🎯 Aplicabilidade

**1. Loops de Concatenação**:
```java
StringBuilder sb = new StringBuilder(capacidadeEstimada);
for (Item item : items) {
    sb.append(item.toString()).append("\n");
}
return sb.toString();
```

**2. Compartilhamento Thread-Safe**:
```java
public static final String CONSTANTE = "VALOR";
// Múltiplas threads podem usar sem sincronização
```

**3. Cache de Computações**:
```java
Map<Key, String> cache = new ConcurrentHashMap<>();
String valor = cache.computeIfAbsent(key, this::computarCaro);
```

**4. Comparações com ==**:
```java
String status = usuario.getStatus();
if (status == StatusCache.ATIVO) {  // Rápido (pool)
    // ...
}
```

**5. Minimizar Temporários**:
```java
// ✓ Uma expressão
return prefixo + meio + sufixo;  // Compilador otimiza

// ✗ Múltiplos statements
String temp = prefixo + meio;
return temp + sufixo;  // Menos eficiente
```

## ⚠️ Armadilhas Comuns

**1. String + em Loop**:
```java
// ❌ O(n²)
String s = "";
for (int i = 0; i < n; i++) {
    s += i;
}
```

**2. Concatenar sem Capacidade**:
```java
// ❌ Múltiplas expansões
StringBuilder sb = new StringBuilder();
for (...1000 iterações...) {
    sb.append(texto);
}
```

**3. Criar Strings Desnecessárias**:
```java
// ❌ Strings intermediárias
String nome = usuario.getNome().trim().toUpperCase();
// 2 Strings temporárias (trim, toUpperCase)
```

**4. split() em Loop**:
```java
// ❌ Compila regex repetidamente
for (String linha : linhas) {
    String[] partes = linha.split(",");
}
```

**5. Múltiplos replaces**:
```java
// ❌ 3 Strings intermediárias
texto = texto.replace("a", "b")
             .replace("c", "d")
             .replace("e", "f");
```

## ✅ Boas Práticas

**1. StringBuilder em Loops**:
```java
StringBuilder sb = new StringBuilder(tamanhoEstimado);
for (...) {
    sb.append(item);
}
```

**2. Capacidade Inicial**:
```java
int capacidade = numItems * tamanhoMedio;
StringBuilder sb = new StringBuilder(capacidade);
```

**3. Reutilizar StringBuilder**:
```java
sb.setLength(0);  // Limpa para reutilizar
```

**4. Pattern.compile() Fora do Loop**:
```java
Pattern pattern = Pattern.compile(regex);
for (...) {
    Matcher m = pattern.matcher(texto);
}
```

**5. Cache Strings Repetidas**:
```java
Map<K, String> cache = new HashMap<>();
cache.computeIfAbsent(key, this::compute);
```

**6. Perfil e Medição**:
```java
// Benchmark antes de otimizar
long inicio = System.nanoTime();
// código
long duracao = System.nanoTime() - inicio;
```

## 📚 Resumo Executivo

**Imutabilidade**: impacto dual em performance - **ajuda** em alguns cenários, **prejudica** em outros.

**Quando AJUDA**:

1. **Thread-safety gratuita**: sem custo de sincronização
```java
// String compartilhada entre threads - sem locks
public static final String MENSAGEM = "OK";
```

2. **String Pool**: cache automático
```java
String s1 = "Java";
String s2 = "Java";  // s1 == s2 (comparação O(1))
```

3. **hashCode constante**: HashMap eficiente
```java
Map<String, V> map = new HashMap<>();
map.put("chave", valor);  // hashCode calculado 1 vez
```

**Quando PREJUDICA**:

1. **Concatenação em loop**: O(n²)
```java
// ❌ String +: ~3000ms para 10K iterações
// ✓ StringBuilder: ~3ms (1000x mais rápido)
```

2. **Muitas transformações**: objetos temporários
```java
texto.toUpperCase().trim().substring(0, 10);
// 3 Strings temporárias criadas
```

3. **Pressão no GC**: coleta frequente
```java
// Muitas Strings temporárias = GC frequente
```

**Benchmarks chave**:

| Operação | String + | StringBuilder | Diferença |
|----------|----------|---------------|-----------|
| 100 concatenações | 10ms | 0.1ms | 100x |
| 1.000 concatenações | 500ms | 1ms | 500x |
| 10.000 concatenações | 3000ms | 3ms | 1000x |

**Estratégias de otimização**:

1. **StringBuilder em loops**:
```java
StringBuilder sb = new StringBuilder(capacidade);
for (...) { sb.append(item); }
```

2. **Capacidade inicial**: evita realocações
```java
StringBuilder sb = new StringBuilder(tamanhoEstimado);
```

3. **Reutilizar**: menos alocações
```java
sb.setLength(0);  // Limpa para reutilizar
```

4. **Cache**: evita recomputação
```java
Map<K, String> cache = new HashMap<>();
```

5. **Literais**: String Pool
```java
String s = "literal";  // Pool, reutilizado
```

**Regra prática**:
- **String**: compartilhamento, constantes, poucos objetos
- **StringBuilder**: loops, muitas concatenações, construção incremental
- **Medição**: sempre benchmark antes de otimizar