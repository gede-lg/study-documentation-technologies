# Otimização de Memória com Strings

## 🎯 Introdução e Definição

**Otimização de memória** com Strings envolve técnicas para **reduzir o consumo de RAM** e **melhorar performance** através do uso eficiente do String Pool, deduplicação e escolha adequada entre String e StringBuilder.

**Conceito central**: Strings idênticas podem **compartilhar a mesma instância** na memória, economizando significativamente recursos em aplicações que manipulam muitas strings.

**Exemplo fundamental**:
```java
// ❌ SEM otimização - 10.000 objetos
List<String> lista = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    lista.add(new String("CONSTANTE"));
}
// Memória: ~500KB

// ✓ COM otimização - 1 objeto compartilhado
List<String> lista = new ArrayList<>();
String constante = "CONSTANTE";  // Pool
for (int i = 0; i < 10000; i++) {
    lista.add(constante);
}
// Memória: ~200KB (60% de economia!)
```

**Benefícios**:
- Redução de uso de memória (até 80% em alguns casos)
- Menos pressão no Garbage Collector
- Melhor performance de comparação
- Cache mais eficiente

## 📋 Fundamentos Teóricos

### 1️⃣ String Pool e Reutilização

**String Pool permite compartilhamento**:

```java
String s1 = "Java";
String s2 = "Java";
String s3 = "Java";

// 1 objeto na memória, 3 referências
// Economia: ~66% vs criar 3 objetos separados
```

**Memória**:
```
String Pool:
┌────────┐
│ "Java" │ ← s1, s2, s3 (16 bytes)
└────────┘

Referências: 3 × 8 bytes = 24 bytes
Total: ~40 bytes

vs

3 Strings separadas: 3 × 48 bytes = 144 bytes
Economia: ~72%
```

**Em aplicações reais**:
```java
// Processar 100.000 usuários com países repetidos
List<Usuario> usuarios = lerUsuarios();

// SEM pool - ~200 países × 100.000 usuários = muita memória
for (Usuario u : usuarios) {
    u.setPais(new String(u.getPais()));  // ❌
}

// COM pool - apenas ~200 Strings únicas
for (Usuario u : usuarios) {
    u.setPais(u.getPais().intern());  // ✓
}
```

### 2️⃣ Deduplicação com intern()

**intern() remove duplicatas**:

```java
public class DadosUsuario {
    private String cidade;
    private String estado;
    private String pais;
    
    public void setCidade(String cidade) {
        this.cidade = cidade.intern();  // Deduplica
    }
    
    // Similar para estado e pais
}

// Exemplo: 1 milhão de usuários
// Sem intern(): ~1M Strings (cidades + estados + países)
// Com intern(): ~5000 Strings únicas (cidades + estados + países)
// Economia: ~99.5%!
```

**Cálculo de memória**:
```java
// 1.000.000 usuários
// Média de 50 cidades, 27 estados, 10 países

// Sem intern():
// 1M × (cidade + estado + país) × ~50 bytes ≈ 150MB

// Com intern():
// (50 cidades + 27 estados + 10 países) × ~50 bytes ≈ 4KB
// Economia: ~99.997%!
```

### 3️⃣ String Compaction (Java 9+)

**Java 9+ compacta Strings internamente**:

**Antes (Java 8)**:
```java
// Strings sempre usavam char[] (UTF-16)
String s = "abc";  // 6 bytes (2 bytes × 3 chars)
```

**Depois (Java 9+)**:
```java
// Strings usam byte[] com encoding Latin1 ou UTF-16
String s = "abc";  // 3 bytes (Latin1) - 50% de economia!
String s2 = "日本";  // 4 bytes (UTF-16 necessário)
```

**Implementação interna**:
```java
public final class String {
    private final byte[] value;  // Não char[]
    private final byte coder;    // LATIN1=0, UTF16=1
    
    // Escolhe encoding baseado no conteúdo
}
```

**Economia automática**:
```java
// Aplicação com muitos textos ASCII/Latin1
// Redução de ~50% no uso de memória das Strings
```

### 4️⃣ Evitar new String()

**new String() desperdiça memória**:

```java
// ❌ Cria 2 objetos: literal + heap
String s = new String("Java");
// Memória: ~96 bytes

// ✓ Usa pool - 1 objeto
String s = "Java";
// Memória: ~48 bytes
// Economia: 50%
```

**Em loops**:
```java
// ❌ Cria 10.000 objetos desnecessários
for (int i = 0; i < 10000; i++) {
    list.add(new String("STATUS"));
}
// Memória: ~480KB

// ✓ Reutiliza 1 String
String status = "STATUS";
for (int i = 0; i < 10000; i++) {
    list.add(status);
}
// Memória: ~80KB
// Economia: ~83%
```

### 5️⃣ substring() e Memória (Java 6 vs 7+)

**Java 6 - compartilha array interno**:

```java
// Java 6
String grande = lerArquivoGrande();  // 1MB
String pequena = grande.substring(0, 10);  // 10 chars

// 'pequena' mantém referência ao array de 1MB!
// Memory leak se 'grande' não for mais usado
```

**Java 7+ - copia array**:

```java
// Java 7+
String grande = lerArquivoGrande();  // 1MB
String pequena = grande.substring(0, 10);  // 10 chars

// 'pequena' tem próprio array (~20 bytes)
// 'grande' pode ser GC normalmente
// Sem memory leak
```

**Workaround Java 6**:
```java
// Forçar cópia no Java 6
String pequena = new String(grande.substring(0, 10));
```

### 6️⃣ StringBuilder vs String em Loops

**String em loop - desperdiça memória**:

```java
// ❌ Cria ~1000 Strings temporárias
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado += i;  // Nova String a cada iteração!
}
// Memória pico: ~1MB
// Pressão GC: alta
```

**StringBuilder - mutável**:

```java
// ✓ Modifica mesmo objeto
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);  // Sem criar novas Strings
}
String resultado = sb.toString();
// Memória pico: ~50KB
// Pressão GC: baixa
// Economia: ~95%
```

**Performance**:
```java
// Benchmark
// String concatenação: ~500ms
// StringBuilder: ~5ms
// 100x mais rápido!
```

### 7️⃣ Capacidade Inicial do StringBuilder

**StringBuilder cresce dinamicamente**:

```java
// Sem capacidade inicial
StringBuilder sb = new StringBuilder();  // Capacidade padrão: 16
for (int i = 0; i < 1000; i++) {
    sb.append("item" + i);  // Múltiplas expansões!
}
// Expansões: ~8-10 realocações de array interno
```

**Com capacidade inicial**:

```java
// ✓ Capacidade apropriada
StringBuilder sb = new StringBuilder(5000);  // Capacidade inicial
for (int i = 0; i < 1000; i++) {
    sb.append("item" + i);
}
// Expansões: 0-1 realocação
// Economia: menos cópias de array
```

**Cálculo de capacidade**:
```java
// Estimar tamanho final
int numItens = 1000;
int tamanhoMedio = 10;  // "item999" ≈ 10 chars
int capacidade = numItens * tamanhoMedio;

StringBuilder sb = new StringBuilder(capacidade);
```

### 8️⃣ Caching de Strings Frequentes

**Cache strings reutilizadas**:

```java
public class StatusCache {
    public static final String ATIVO = "ATIVO";
    public static final String INATIVO = "INATIVO";
    public static final String PENDENTE = "PENDENTE";
    
    // Uso
    usuario.setStatus(StatusCache.ATIVO);
    // vs
    usuario.setStatus(new String("ATIVO"));  // ❌ Desperdiça
}
```

**Map de cache**:
```java
public class StringCache {
    private static final Map<String, String> cache = new HashMap<>();
    
    public static String get(String key) {
        return cache.computeIfAbsent(key, k -> k.intern());
    }
}

// Uso
String pais = StringCache.get(entrada.getPais());
// Reutiliza Strings idênticas
```

### 9️⃣ String.format() vs Concatenação

**format() pode ser custoso**:

```java
// ❌ Overhead do parser de formato
for (int i = 0; i < 10000; i++) {
    String msg = String.format("ID: %d", i);
}
// Tempo: ~50ms
```

**Concatenação simples**:

```java
// ✓ Mais rápido para casos simples
for (int i = 0; i < 10000; i++) {
    String msg = "ID: " + i;
}
// Tempo: ~10ms
// 5x mais rápido
```

**Quando usar cada um**:
```java
// ✓ format() - strings complexas
String sql = String.format(
    "SELECT * FROM %s WHERE id = %d AND status = '%s'",
    tabela, id, status
);

// ✓ Concatenação - strings simples
String msg = "Erro: " + codigo;
```

### 🔟 Garbage Collection e Strings

**Strings temporárias pressionam GC**:

```java
// ❌ Muitas Strings temporárias
for (int i = 0; i < 100000; i++) {
    String temp = "temp" + i;  // 100.000 Strings criadas
    processar(temp);
    // temp elegível para GC
}
// GC precisa coletar 100.000 objetos
```

**Reutilização reduz GC**:

```java
// ✓ Reutiliza StringBuilder
StringBuilder sb = new StringBuilder(20);
for (int i = 0; i < 100000; i++) {
    sb.setLength(0);  // Limpa
    sb.append("temp").append(i);
    processar(sb.toString());
}
// Apenas 100.000 Strings finais (inevitável)
// Sem Strings temporárias de concatenação
```

**Monitorar GC**:
```bash
java -Xlog:gc* -Xmx512m MeuApp
```

## 🎯 Aplicabilidade

**1. Deduplicar Dados Repetitivos**:
```java
List<Produto> produtos = lerProdutos();
for (Produto p : produtos) {
    p.setCategoria(p.getCategoria().intern());
    p.setFabricante(p.getFabricante().intern());
}
// Economia: ~90% em strings de categoria/fabricante
```

**2. StringBuilder em Concatenações**:
```java
StringBuilder html = new StringBuilder(10000);
html.append("<html><body>");
for (Item item : itens) {
    html.append("<div>").append(item.getNome()).append("</div>");
}
html.append("</body></html>");
String resultado = html.toString();
```

**3. Constantes Compartilhadas**:
```java
public interface HttpStatus {
    String OK = "200 OK";
    String NOT_FOUND = "404 Not Found";
    String ERROR = "500 Internal Server Error";
}
```

**4. Cache de Strings Computadas**:
```java
Map<Integer, String> cache = new HashMap<>();
String descricao = cache.computeIfAbsent(codigo, 
    k -> gerarDescricao(k).intern()
);
```

**5. Capacidade Inicial em Builders**:
```java
int tamanhoEstimado = calcularTamanho();
StringBuilder sb = new StringBuilder(tamanhoEstimado);
// Evita realocações
```

## ⚠️ Armadilhas Comuns

**1. Abusar de intern()**:
```java
// ❌ Strings únicas não beneficiam
for (int i = 0; i < 1000000; i++) {
    String id = UUID.randomUUID().toString().intern();
}
// Pool cresce muito, sem reutilização
```

**2. Concatenação em Loop**:
```java
// ❌ O(n²) em tempo e memória
String resultado = "";
for (String item : milhares) {
    resultado += item;
}
```

**3. new String() Desnecessário**:
```java
// ❌ Duplica memória
Map<String, Integer> map = new HashMap<>();
map.put(new String("chave"), 1);
```

**4. StringBuilder Muito Pequeno**:
```java
// ❌ Muitas expansões
StringBuilder sb = new StringBuilder();  // cap=16
for (int i = 0; i < 10000; i++) {
    sb.append("longTexto...");
}
```

**5. format() em Loop**:
```java
// ❌ Overhead de parsing
for (int i = 0; i < 100000; i++) {
    String msg = String.format("ID: %d", i);
}
```

## ✅ Boas Práticas

**1. Use Literais para Constantes**:
```java
// ✓ Pool automático
public static final String STATUS = "ATIVO";
```

**2. intern() com Strings Repetitivas**:
```java
// ✓ Deduplica valores
usuario.setPais(pais.intern());
```

**3. StringBuilder com Capacidade**:
```java
// ✓ Evita realocações
StringBuilder sb = new StringBuilder(tamanhoEstimado);
```

**4. Evite new String()**:
```java
// ✓ Usa pool
String s = "literal";

// ✗ Desperdiça
String s = new String("literal");
```

**5. Cache Strings Computadas**:
```java
Map<Key, String> cache = new HashMap<>();
String valor = cache.computeIfAbsent(key, this::computar);
```

**6. Monitore Uso de Memória**:
```bash
java -Xmx512m -XX:+PrintStringTableStatistics App
```

## 📚 Resumo Executivo

**Otimização de memória** com Strings: técnicas para reduzir RAM e melhorar performance.

**Técnicas principais**:

**1. String Pool**:
```java
String s = "literal";  // Pool (reutilizado)
// vs
String s = new String("literal");  // Heap (desperdiça)
```

**2. intern()** - deduplicação:
```java
usuario.setPais(pais.intern());  // Remove duplicatas
// Economia: até 99% com dados repetitivos
```

**3. StringBuilder** - concatenações:
```java
StringBuilder sb = new StringBuilder(capacidade);
for (...) {
    sb.append(item);  // Sem criar Strings temporárias
}
```

**4. Capacidade inicial**:
```java
StringBuilder sb = new StringBuilder(tamanhoEstimado);
// Evita realocações (economia de CPU e memória)
```

**5. Compactação (Java 9+)**:
```java
String s = "abc";  // Latin1 - 3 bytes
String s2 = "日本";  // UTF-16 - 4 bytes
// Automático, ~50% economia em textos ASCII
```

**Comparação de economia**:

| Técnica | Economia de Memória |
|---------|---------------------|
| Pool vs new | 50% |
| intern() (dados repetitivos) | 90-99% |
| StringBuilder vs + | 90-95% |
| Compactação Java 9+ | 50% (ASCII) |

**Medições**:
```java
// 10.000 "CONST"
// new String(): ~480KB
// Literal: ~80KB (83% economia)

// 1M usuários com países
// Sem intern(): ~150MB
// Com intern(): ~4KB (99.997% economia!)
```

**Regra geral**:
- Use **literais** sempre que possível
- **intern()** para dados repetitivos
- **StringBuilder** para concatenações
- **Capacidade inicial** para builders
- **Evite** new String() sem necessidade