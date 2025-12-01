# String Pool (Intern Pool)

## 🎯 Introdução e Definição

**String Pool** (também chamado **Intern Pool** ou **String Constant Pool**) é uma **área especial de memória** onde a JVM armazena literais de String para **reutilização**, economizando memória e melhorando performance.

**Conceito central**: quando você cria uma String literal, a JVM verifica se já existe String idêntica no pool. Se sim, **reutiliza** a existente ao invés de criar nova.

**Exemplo fundamental**:
```java
String s1 = "Java";  // Cria "Java" no pool
String s2 = "Java";  // Reutiliza "Java" do pool

System.out.println(s1 == s2);  // true (MESMA instância!)
```

**Localização**: 
- **Java 6 e anteriores**: PermGen (Permanent Generation)
- **Java 7+**: Heap (memória principal)

**Por que String Pool existe?**
- **Economia de memória**: Strings idênticas compartilham mesma instância
- **Performance**: Criação de literais é extremamente rápida (lookup no pool)
- **Imutabilidade permite**: compartilhamento seguro

## 📋 Fundamentos Teóricos

### 1️⃣ Literais no Pool

**Literais são automaticamente internados**:

```java
String s1 = "Hello";  // Cria no pool
String s2 = "Hello";  // Reutiliza do pool
String s3 = "Hello";  // Reutiliza do pool

// Todas apontam para MESMA instância
System.out.println(s1 == s2);  // true
System.out.println(s2 == s3);  // true
System.out.println(s1 == s3);  // true
```

**Diagrama de memória**:
```
String Pool:
┌─────────┐
│ "Hello" │ ←── s1, s2, s3 (todos apontam aqui)
└─────────┘
```

**Economia de memória**:
```java
// Sem pool (hipotético)
// 3 Strings × ~50 bytes = ~150 bytes

// Com pool
// 1 String × ~50 bytes = ~50 bytes
// 3 referências × 8 bytes = 24 bytes
// Total: ~74 bytes (economia de ~50%)
```

### 2️⃣ new String() NÃO Usa Pool

**Construtor `new` cria objeto na heap**:

```java
String s1 = "Java";           // No pool
String s2 = new String("Java"); // Na heap (FORA do pool)

System.out.println(s1 == s2);  // false (objetos diferentes)
System.out.println(s1.equals(s2));  // true (conteúdo igual)
```

**Diagrama de memória**:
```
String Pool:
┌────────┐
│ "Java" │ ←── s1
└────────┘

Heap:
┌────────┐
│ "Java" │ ←── s2 (objeto separado)
└────────┘
```

**Por que evitar `new String()`**:
```java
String s = new String("Java");
// Cria 2 objetos:
// 1. "Java" literal no pool
// 2. novo objeto String na heap
```

### 3️⃣ Método intern()

**`intern()` adiciona String ao pool**:

```java
String s1 = "Java";
String s2 = new String("Java");
String s3 = s2.intern();  // Retorna instância do pool

System.out.println(s1 == s2);  // false (s2 não está no pool)
System.out.println(s1 == s3);  // true (s3 = versão do pool)
```

**Funcionamento de intern()**:
1. Verifica se String com mesmo conteúdo existe no pool
2. Se **existe**: retorna referência do pool
3. Se **não existe**: adiciona ao pool e retorna referência

**Exemplo prático**:
```java
String s1 = new String("Hello");
String s2 = new String("Hello");

System.out.println(s1 == s2);  // false (objetos diferentes)

String i1 = s1.intern();
String i2 = s2.intern();

System.out.println(i1 == i2);  // true (mesma instância do pool)
```

### 4️⃣ Concatenação de Literais

**Concatenação em tempo de compilação**:

```java
String s1 = "Java";
String s2 = "Java";  // Mesmo literal

String s3 = "Ja" + "va";  // Compilador concatena → "Java"

System.out.println(s1 == s2);  // true
System.out.println(s1 == s3);  // true (compilador otimiza)
```

**Otimização do compilador**:
```java
// Código fonte
String s = "Hello" + " " + "World";

// Bytecode (equivalente)
String s = "Hello World";  // Pré-concatenado no pool
```

**Apenas literais**:
```java
// ✓ Otimizado
String s1 = "Java" + " " + "17";  // → "Java 17" no pool

// ✗ Não otimizado (variável)
String a = "Java";
String s2 = a + " 17";  // Cria nova String na heap
```

### 5️⃣ final e String Pool

**`final` permite otimização**:

```java
// Com final
final String a = "Java";
String s1 = a + " 17";  // Compilador pode otimizar

// Sem final
String b = "Java";
String s2 = b + " 17";  // Não otimizado (b pode mudar)
```

**Constantes de compilação**:
```java
public static final String VERSAO = "17";

String s1 = "Java " + VERSAO;  // Pode ser otimizado
```

### 6️⃣ String Pool e Garbage Collection

**Strings no pool são coletadas**:

**Java 6 e anteriores**:
- Pool em PermGen
- Raramente coletado (apenas Full GC)
- Strings internadas permaneciam quase sempre

**Java 7+**:
- Pool na heap
- Coletado normalmente pelo GC
- Strings sem referências são removidas

**Exemplo**:
```java
String s = new String("Temporaria").intern();
// Adiciona "Temporaria" ao pool

s = null;  // Remove referência

// GC pode remover "Temporaria" do pool (se sem outras referências)
```

### 7️⃣ Tamanho do String Pool

**Configuração do tamanho**:

**Parâmetro JVM**:
```bash
-XX:StringTableSize=<numero>
```

**Exemplo**:
```bash
java -XX:StringTableSize=100000 MinhaAplicacao
```

**Tamanho padrão**:
- Java 7u40+: 60013
- Java 8+: Varia, geralmente maior

**Verificar tamanho**:
```bash
java -XX:+PrintStringTableStatistics MinhaAplicacao
```

**Impacto do tamanho**:
- **Maior**: lookup mais rápido, mais memória
- **Menor**: economiza memória, lookup mais lento

### 8️⃣ Performance de intern()

**intern() pode ser lento**:

```java
// ❌ Ineficiente
for (int i = 0; i < 100000; i++) {
    String s = ("String" + i).intern();
}
// Muitas inserções no pool
```

**Quando usar intern()**:
- ✓ Strings repetidas (deduplicação)
- ✓ Muitas comparações com `==`
- ✗ Strings únicas (overhead sem benefício)

**Exemplo de uso apropriado**:
```java
// Ler muitos nomes de um arquivo
// Muitos nomes podem se repetir
List<String> nomes = new ArrayList<>();
for (String linha : linhas) {
    nomes.add(linha.intern());  // Deduplica nomes repetidos
}
```

### 9️⃣ String Pool vs Heap

**Comparação**:

| Aspecto | String Pool | Heap (new String) |
|---------|-------------|-------------------|
| Criação | `"literal"` | `new String()` |
| Reutilização | ✓ Automática | ✗ Não |
| Comparação == | ✓ Funciona para literais | ✗ Não confiável |
| Performance | ✓ Rápida | Normal |
| Memória | ✓ Econômica | Mais memória |
| GC | Normal (Java 7+) | Normal |

**Exemplo**:
```java
// Pool - 1 objeto para ambas
String p1 = "Java";
String p2 = "Java";
System.out.println(p1 == p2);  // true

// Heap - 2 objetos distintos
String h1 = new String("Java");
String h2 = new String("Java");
System.out.println(h1 == h2);  // false
```

### 🔟 Concatenação Runtime vs Compile-Time

**Compile-time - no pool**:
```java
String s1 = "Hello" + " World";  // → "Hello World" no pool
String s2 = "Hello World";

System.out.println(s1 == s2);  // true
```

**Runtime - na heap**:
```java
String hello = "Hello";
String s1 = hello + " World";  // Concatena em runtime
String s2 = "Hello World";

System.out.println(s1 == s2);  // false (s1 na heap)

// Para comparar
String s3 = s1.intern();
System.out.println(s2 == s3);  // true
```

**StringBuilder implícito**:
```java
String a = "Hello";
String b = a + " World";

// Compilador usa StringBuilder:
// StringBuilder temp = new StringBuilder(a);
// temp.append(" World");
// String b = temp.toString();  // Nova String na heap
```

## 🎯 Aplicabilidade

**1. Comparação Rápida de Literais**:
```java
String tipoUsuario = "ADMIN";

if (tipoUsuario == "ADMIN") {  // Rápido com pool
    // Acesso administrativo
}
```

**2. Deduplicação de Strings**:
```java
// Processar arquivo com muitos valores repetidos
Set<String> unicos = new HashSet<>();
for (String linha : linhas) {
    unicos.add(linha.intern());  // Reduz uso de memória
}
```

**3. Constantes de Configuração**:
```java
public static final String ENV_PRODUCAO = "production";
public static final String ENV_TESTE = "test";

// Comparação com == funciona
if (ambiente == ENV_PRODUCAO) { }
```

**4. Cache de Strings**:
```java
// Strings frequentemente usadas
private static final String[] MESES = {
    "Janeiro", "Fevereiro", "Março", // ... no pool
};
```

**5. Economia de Memória em Aplicações**:
```java
// Aplicação com muitas strings repetidas
List<Usuario> usuarios = lerUsuarios();
for (Usuario u : usuarios) {
    u.setPais(u.getPais().intern());  // Deduplica países
    u.setCidade(u.getCidade().intern()); // Deduplica cidades
}
```

## ⚠️ Armadilhas Comuns

**1. Confiar em == com new String()**:
```java
String s1 = new String("Java");
String s2 = new String("Java");

if (s1 == s2) {  // ❌ false - objetos diferentes
    // Nunca executa
}
```

**2. Usar == ao invés de equals()**:
```java
String input = scanner.nextLine();  // String da heap
if (input == "admin") {  // ❌ Quase sempre false
    // Raramente funciona
}

// ✓ Correto
if ("admin".equals(input)) { }
```

**3. Abusar de intern()**:
```java
// ❌ Strings únicas - sem benefício
for (int i = 0; i < 1000000; i++) {
    String s = UUID.randomUUID().toString().intern();
}
// Pool cresce muito, sem reutilização
```

**4. Assumir Que Concatenação Usa Pool**:
```java
String a = "Hello";
String b = a + " World";  // Na heap, não no pool
String c = "Hello World"; // No pool

System.out.println(b == c);  // false
```

**5. Memory Leak com intern() (Java 6)**:
```java
// Java 6 - PermGen não é GC frequentemente
for (String linha : milhoesDeLinhas) {
    linha.intern();  // Enche PermGen
}
// OutOfMemoryError: PermGen space
```

## ✅ Boas Práticas

**1. Use Literais Quando Possível**:
```java
// ✓ Aproveita pool
String s = "Java";

// ✗ Evite (cria objeto desnecessário)
String s = new String("Java");
```

**2. Use equals() para Comparação**:
```java
// ✓ Sempre funciona
if (s1.equals(s2)) { }

// ✗ Apenas com literais garantidos
if (s1 == s2) { }  // Arriscado
```

**3. intern() com Strings Repetidas**:
```java
// ✓ Deduplica valores repetidos
Map<String, Integer> contador = new HashMap<>();
for (String palavra : palavras) {
    String chave = palavra.intern();
    contador.merge(chave, 1, Integer::sum);
}
```

**4. Constantes como Literais**:
```java
public static final String STATUS_ATIVO = "ATIVO";
public static final String STATUS_INATIVO = "INATIVO";
// No pool, comparação rápida
```

**5. Evite intern() com Strings Únicas**:
```java
// ❌ Evite
String id = gerarId().intern();  // IDs únicos

// ✓ Correto
String id = gerarId();  // Sem intern
```

**6. Configure String Pool para Aplicações Grandes**:
```bash
# Aplicação com muitas strings
java -XX:StringTableSize=200000 MeuApp
```

## 📚 Resumo Executivo

**String Pool** é área de memória que armazena e **reutiliza** literais de String.

**Criação no pool**:
```java
String s1 = "Java";  // No pool
String s2 = "Java";  // Reutiliza do pool

System.out.println(s1 == s2);  // true (mesma instância)
```

**Criação na heap**:
```java
String s1 = new String("Java");  // Na heap
String s2 = new String("Java");  // Na heap (outra instância)

System.out.println(s1 == s2);  // false (objetos diferentes)
```

**Método intern()**:
```java
String s1 = new String("Java");
String s2 = s1.intern();  // Retorna versão do pool
String s3 = "Java";

System.out.println(s2 == s3);  // true (ambos do pool)
```

**Localização**:
- Java 6: PermGen
- Java 7+: Heap

**Vantagens**:
- ✓ Economia de memória (reutilização)
- ✓ Comparação rápida com `==` (literais)
- ✓ Performance (lookup rápido)

**Quando usar intern()**:
- ✓ Strings repetidas (deduplicação)
- ✗ Strings únicas (overhead)

**Boas práticas**:
```java
// ✓ Use literais
String s = "Java";

// ✗ Evite new String()
String s = new String("Java");

// ✓ Use equals()
if (s1.equals(s2)) { }

// ✗ Cuidado com ==
if (s1 == s2) { }  // Só confiável com literais
```

**Configuração**:
```bash
java -XX:StringTableSize=100000 App
```

**Regra**: literais vão pro pool automaticamente, `new String()` vai pra heap, `intern()` adiciona ao pool manualmente.
