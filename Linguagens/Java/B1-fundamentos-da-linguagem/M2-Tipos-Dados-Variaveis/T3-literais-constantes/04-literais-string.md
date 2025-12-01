# Literais de String

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Literais de String** são **sequências de caracteres delimitadas por aspas duplas** (`"`) no código-fonte Java, representando texto imutável tipo `String`. Conceitualmente, são **constantes textuais hardcoded** que o compilador transforma em objetos `String` armazenados no **String Pool** (área especial de memória para otimização).

Diferentemente de `char` (um caractere, aspas simples `'A'`), `String` é **sequência de zero ou mais caracteres** (`"Hello"`, `"Java"`, `""`). `String` é **tipo referência** (objeto), não primitivo, mas tem sintaxe especial de literal para conveniência.

**Sintaxe:**

```java
String saudacao = "Olá, mundo!";
String vazia = "";                // String vazia (zero caracteres)
String comEscape = "Linha 1\nLinha 2\tTab";
String unicode = "Símbolo: \u00A9";  // © (copyright)
String aspas = "Ele disse: \"Olá\"";
```

**Conceito Fundamental:** Strings em Java são **imutáveis** — uma vez criadas, não podem ser modificadas. Operações que "modificam" String na verdade criam novas Strings.

### Contexto Histórico e Motivação

**Strings em Linguagens de Programação:**

Desde linguagens antigas (COBOL, FORTRAN nos anos 1950-60), manipulação de texto era crítica. C (1972) representava strings como arrays de `char` terminados em `\0` (null-terminated) — eficiente mas propenso a bugs (buffer overflow, esquecer null terminator).

**Java e Imutabilidade:**

Java 1.0 (1996) fez escolha radical: **Strings imutáveis por design**. Influências:

- **Smalltalk:** Objetos imutáveis para segurança
- **Experiência com C:** Mutabilidade de strings causava bugs (corrupção de memória)

**Motivação para Imutabilidade:**

1. **Thread-Safety:** Strings compartilhadas entre threads sem sincronização
2. **Security:** Strings usadas em autenticação, paths — imutabilidade previne modificação maliciosa
3. **String Pool:** Permite compartilhar strings idênticas, economizando memória
4. **Hashing:** Hash code pode ser cacheado (usado em HashMap, HashSet)

**String Pool (Intern Pool):**

Otimização onde literais String idênticos compartilham mesma instância em memória:

```java
String a = "Java";
String b = "Java";
System.out.println(a == b);  // true (mesma instância no pool)
```

**Evolução:**

- **Java 1.0-6:** String pool em PermGen (tamanho fixo)
- **Java 7 (2011):** String pool movido para heap (tamanho dinâmico)
- **Java 9 (2017):** Compact Strings (otimização interna: Latin-1 = 1 byte/char vs UTF-16 = 2 bytes)
- **Java 15 (2020):** Text Blocks (`"""..."""`) para strings multi-linha

### Problema Fundamental que Resolve

**1. Representação de Texto:**

Aplicações precisam manipular texto — nomes, mensagens, logs, dados. Strings fornecem abstração de alto nível.

**2. Imutabilidade = Segurança:**

```java
String senha = "secret123";
// Ninguém pode modificar 'senha' depois de criada
autenticar(senha);  // Seguro — senha não pode ser alterada pela função
```

**3. String Pool = Economia de Memória:**

```java
String a = "Java";
String b = "Java";
String c = "Java";
// Apenas UMA instância "Java" em memória, compartilhada por a, b, c
```

**4. Concatenação e Manipulação:**

Java provê operadores e métodos ricos para trabalhar com texto (`+`, `concat()`, `substring()`, `replace()`, etc.).

### Importância no Ecossistema

Strings são **onipresentes** em Java:

- **I/O:** Leitura/escrita de arquivos, rede
- **UI:** Exibição de texto em interfaces
- **Logs:** Mensagens de debug, erro
- **Dados:** JSON, XML, SQL — tudo é manipulado como String
- **Identificadores:** Nomes, paths, URLs

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Delimitação por Aspas Duplas:** `"texto"` (duplas), não `'texto'` (simples = erro)
2. **Tipo Referência:** `String` é classe, não primitivo
3. **Imutabilidade:** Strings não podem ser modificadas após criação
4. **String Pool:** Literais armazenados em pool compartilhado
5. **Suporte a Escape:** `\n`, `\t`, `\"`, `\\`, `\uXXXX` funcionam em Strings

### Pilares Fundamentais

- **Immutability:** Toda "modificação" cria nova String
- **String Interning:** Pool automático para literais
- **Rich API:** Centenas de métodos para manipulação
- **Operator Overloading:** `+` para concatenação (única exceção em Java)
- **Unicode Support:** Suporte completo a caracteres mundiais

### Nuances Importantes

- **`==` vs `equals()`:** `==` compara referências, `equals()` compara conteúdo
- **String Pool:** `"Java" == "Java"` (true), mas `new String("Java") == "Java"` (false)
- **Concatenação:** `+` é conveniente mas cria objetos temporários (usar `StringBuilder` em loops)
- **Empty vs Null:** `""` (string vazia) ≠ `null` (ausência de objeto)

---

## 🧠 Fundamentos Teóricos

### Literais de String Básicos

**Sintaxe:**

```java
String nome = "João";
String frase = "Olá, mundo!";
String vazia = "";
String comEspacos = "   texto   ";
String multiPalavras = "Java é uma linguagem poderosa";
```

**Conceito:** Aspas duplas delimitam início e fim. Tudo entre aspas é parte da String.

**String Vazia vs Null:**

```java
String vazia = "";      // String com zero caracteres (objeto válido)
String nula = null;     // Ausência de objeto

System.out.println(vazia.length());  // 0 (OK)
// System.out.println(nula.length());   // NullPointerException
```

**Conceito:** `""` é objeto String válido (comprimento 0); `null` não é objeto.

### Sequências de Escape em Strings

**Todas as sequências de `char` funcionam em String:**

```java
String novaLinha = "Linha 1\nLinha 2";
String tab = "Nome\tIdade";
String aspas = "Ele disse: \"Olá\"";
String barra = "Caminho: C:\\Users\\Documents";
String unicode = "Copyright \u00A9 2024";
```

**Exemplo Completo:**

```java
String exemplo = "Título\n\tSubtítulo\n\t\tDetalhe";
System.out.println(exemplo);
```

**Output:**
```
Título
	Subtítulo
		Detalhe
```

**Conceito:** Escapes são interpretados quando String é criada. `\n` vira caractere newline (não dois caracteres `\` e `n`).

### String Pool e Interning

**Conceito:** JVM mantém pool de strings únicas. Literais idênticos compartilham mesma instância.

**Exemplo:**

```java
String a = "Java";
String b = "Java";
String c = "Ja" + "va";  // Concatenação em compile-time

System.out.println(a == b);  // true (mesma instância no pool)
System.out.println(a == c);  // true (compilador otimiza "Ja" + "va" → "Java")
```

**Conceito:** `==` compara **referências** (endereços de memória). Se apontam para mesma instância no pool, são `==`.

**Criação Explícita com `new`:**

```java
String a = "Java";          // Pool
String b = new String("Java");  // Heap (nova instância)

System.out.println(a == b);      // false (instâncias diferentes)
System.out.println(a.equals(b)); // true (conteúdo idêntico)
```

**Conceito:** `new String()` força criação de **nova instância** no heap, ignorando pool.

**Interning Manual:**

```java
String a = "Java";
String b = new String("Java").intern();  // Coloca no pool

System.out.println(a == b);  // true (agora ambos apontam para pool)
```

**Conceito:** `intern()` adiciona String ao pool (ou retorna existente se já está lá).

**Por Que Importa:**

- **Economia de Memória:** `"Java"` aparece 1000 vezes → apenas 1 instância em memória
- **Comparação Rápida:** `==` é mais rápido que `equals()` (mas perigoso — ver limitações)

### Concatenação de Strings

**Operador `+`:**

```java
String nome = "João";
String saudacao = "Olá, " + nome + "!";  // "Olá, João!"
```

**Conceito:** `+` é **único operador sobrecarregado** em Java (funciona com String além de números).

**Concatenação Compile-Time:**

```java
String a = "Ja" + "va";  // Compilador otimiza → "Java" (literal único)
```

**Concatenação Runtime:**

```java
String nome = getNome();  // Runtime
String mensagem = "Olá, " + nome;  // Runtime, cria StringBuilder internamente
```

**Internamente (após Java 9):**

Compilador transforma:
```java
"Olá, " + nome
```

Em algo equivalente a:
```java
new StringBuilder().append("Olá, ").append(nome).toString()
```

**Conceito:** `+` é conveniente, mas em loops cria muitos objetos temporários.

**Performance em Loops:**

```java
// ❌ INEFICIENTE
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado += i;  // Cria 1000 Strings intermediárias
}

// ✅ EFICIENTE
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String resultado = sb.toString();
```

**Conceito:** Cada `+=` cria nova String (imutabilidade). `StringBuilder` é mutável e eficiente para concatenações múltiplas.

### Comparação de Strings

**`==` vs `equals()`:**

```java
String a = "Java";
String b = "Java";
String c = new String("Java");

System.out.println(a == b);      // true (mesma instância no pool)
System.out.println(a == c);      // false (instâncias diferentes)
System.out.println(a.equals(c)); // true (conteúdo idêntico)
```

**Regra de Ouro:** **SEMPRE use `equals()` para comparar conteúdo de Strings.**

**`equalsIgnoreCase()`:**

```java
String a = "Java";
String b = "JAVA";

System.out.println(a.equals(b));           // false
System.out.println(a.equalsIgnoreCase(b)); // true
```

**`compareTo()`:**

```java
String a = "apple";
String b = "banana";

System.out.println(a.compareTo(b));  // Negativo (a < b lexicograficamente)
System.out.println(b.compareTo(a));  // Positivo (b > a)
System.out.println(a.compareTo("apple"));  // 0 (iguais)
```

**Conceito:** `compareTo()` retorna:
- **Negativo** se `this < other`
- **Zero** se `this == other`
- **Positivo** se `this > other`

Comparação é **lexicográfica** (ordem de dicionário, baseada em códigos Unicode).

### Métodos Comuns de String

**Tamanho:**

```java
String s = "Java";
System.out.println(s.length());  // 4
```

**Acesso a Caracteres:**

```java
String s = "Java";
char c = s.charAt(0);  // 'J'
```

**Substring:**

```java
String s = "Java Programming";
String sub1 = s.substring(5);     // "Programming" (do índice 5 ao fim)
String sub2 = s.substring(0, 4);  // "Java" (do 0 até 4, exclusivo)
```

**Busca:**

```java
String s = "Java Programming";
int pos = s.indexOf("Pro");      // 5 (índice onde "Pro" começa)
boolean contem = s.contains("gram");  // true
boolean comeca = s.startsWith("Java"); // true
boolean termina = s.endsWith("ing");   // true
```

**Transformação:**

```java
String s = "Java";
String upper = s.toUpperCase();  // "JAVA"
String lower = s.toLowerCase();  // "java"
String replaced = s.replace('a', 'o');  // "Jovo"
```

**Remoção de Espaços:**

```java
String s = "  Java  ";
String trimmed = s.trim();   // "Java" (remove espaços início/fim)
String stripped = s.strip(); // "Java" (Java 11+, Unicode-aware)
```

**Split:**

```java
String csv = "João,25,São Paulo";
String[] partes = csv.split(",");  // ["João", "25", "São Paulo"]
```

---

## 🔍 Análise Conceitual Profunda

### Imutabilidade: Conceito e Implicações

**Conceito:**

```java
String s = "Java";
s.toUpperCase();  // Cria nova String "JAVA", mas 's' não muda
System.out.println(s);  // "Java" (original inalterado)

s = s.toUpperCase();  // Reatribuir para mudar 's'
System.out.println(s);  // "JAVA"
```

**Por Que Imutável?**

1. **Thread-Safety:** Múltiplas threads podem ler mesma String sem locks
2. **Segurança:** Strings usadas como paths, senhas — imutabilidade previne modificação acidental
3. **Hashing:** Hash code cacheado (performance em HashMap)
4. **String Pool:** Compartilhamento seguro de instâncias

**Trade-off:** Concatenação extensiva é ineficiente (cria muitos objetos) — usar `StringBuilder`.

### String Pool: Detalhes Internos

**Localização:**

- **Java 6 e anteriores:** PermGen (tamanho fixo, ~64MB, podia estourar)
- **Java 7+:** Heap normal (tamanho dinâmico, gerenciado por GC)

**Quando Strings Vão ao Pool:**

1. **Literais:** Automático (`"Java"`)
2. **Compile-time constants:** `"Ja" + "va"` → `"Java"`
3. **`intern()` manual:** `new String("Java").intern()`

**Quando NÃO Vão ao Pool:**

1. **Runtime concatenation:** `"Ja" + variavel`
2. **`new String()`:** Explicitamente cria nova instância

**Exemplo:**

```java
String a = "Java";
String b = "Java";
String c = "Ja" + "va";  // Compile-time
String d = "Ja" + getVa();  // Runtime

System.out.println(a == b);  // true (pool)
System.out.println(a == c);  // true (pool)
System.out.println(a == d);  // false (runtime, heap)
```

### Conversão para String

**Tipos Primitivos:**

```java
int x = 42;
String s1 = String.valueOf(x);  // "42"
String s2 = Integer.toString(x); // "42"
String s3 = "" + x;              // "42" (concatenação)
```

**Objetos:**

```java
Object obj = new Object();
String s = obj.toString();  // "java.lang.Object@1a2b3c"
```

**Arrays:**

```java
int[] arr = {1, 2, 3};
String s = Arrays.toString(arr);  // "[1, 2, 3]"
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar String vs StringBuilder

**Usar `String`:**

- Valores imutáveis (nomes, constantes)
- Concatenação ocasional (`"Olá, " + nome`)
- Thread-safety sem sincronização

**Usar `StringBuilder`:**

- Concatenação em loops
- Construção de strings complexas
- Performance crítica

**Exemplo:**

```java
// String OK (simples)
String saudacao = "Olá, " + nome + "!";

// StringBuilder melhor (loop)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(",");
}
String resultado = sb.toString();
```

---

## ⚠️ Limitações e Considerações

### 1. Erro Comum: `==` vs `equals()`

```java
String a = new String("Java");
String b = new String("Java");

if (a == b) {  // ❌ ERRADO: compara referências
    // Nunca executa
}

if (a.equals(b)) {  // ✅ CORRETO: compara conteúdo
    // Executa
}
```

**Mitigação:** Sempre `equals()` para strings.

### 2. NullPointerException

```java
String s = null;
// s.length();  // NPE!

// Seguro
if (s != null && s.length() > 0) {
    // ...
}
```

### 3. Performance de Concatenação

```java
// ❌ Lento
String s = "";
for (int i = 0; i < 10000; i++) {
    s += i;  // Cria 10.000 Strings
}

// ✅ Rápido
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
```

---

## 🔗 Interconexões Conceituais

### Relação com `char`

String é sequência de `char`. Internamente, array de `char` (Java 8) ou `byte` (Java 9+ Compact Strings).

### Relação com StringBuilder/StringBuffer

`StringBuilder` (não thread-safe) e `StringBuffer` (thread-safe) são alternativas mutáveis para construção eficiente.

### Relação com Pattern/Regex

Strings são input para expressões regulares (`Pattern`, `Matcher`).

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **StringBuilder/StringBuffer:** Construção eficiente de strings
2. **Formatação:** `String.format()`, `printf()`
3. **Regex:** Expressões regulares para parsing avançado
4. **Text Blocks (Java 15+):** Strings multi-linha

---

## 📚 Conclusão

**Literais de String** são sequências de caracteres delimitadas por aspas duplas, representando objetos `String` imutáveis em Java. String Pool otimiza memória compartilhando literais idênticos. Imutabilidade garante thread-safety, segurança e permite caching de hash codes, mas torna concatenação extensiva ineficiente (usar `StringBuilder`). Comparação deve usar `equals()`, não `==` (que compara referências). Strings suportam sequências de escape (`\n`, `\t`, `\"`) e Unicode (`\u00A9`). API rica oferece métodos para busca, transformação, comparação e parsing. Compreender strings é fundamental para qualquer aplicação Java — texto é onipresente em I/O, logs, dados, UI e lógica de negócio.
