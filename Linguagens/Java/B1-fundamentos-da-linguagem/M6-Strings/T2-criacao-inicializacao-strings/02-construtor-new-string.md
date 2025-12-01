# Construtor new String()

## 🎯 Introdução e Definição

### Definição Conceitual Clara

O **construtor `new String()`** é o mecanismo explícito de criar objetos String através da invocação direta do construtor da classe `java.lang.String`, contornando o String Pool e forçando a criação de uma nova instância na heap regular, mesmo que string idêntica já exista no pool. Conceitualmente, é a escolha consciente de "quero um objeto String completamente novo e independente", ao invés de aceitar a otimização automática de reutilização que literais oferecem.

É o reconhecimento de que, embora literais sejam preferíveis na maioria dos casos por otimização e simplicidade, existem situações específicas onde controle fino sobre criação de objetos é necessário - seja para garantir separação de referências, conversão de outros tipos (char[], byte[]), ou requisitos especiais de APIs legadas.

### Contexto Histórico e Motivação

A classe String existe desde Java 1.0 (1996) com múltiplos construtores para diferentes fontes de dados. A motivação para construtores explícitos:

1. **Conversão de Dados:** Transformar arrays (char[], byte[]) em Strings
2. **Compatibilidade:** Trabalhar com APIs que fornecem dados em formatos não-String
3. **Controle Fino:** Casos raros onde compartilhamento via pool é indesejável
4. **Codificação:** Especificar charset ao converter bytes em caracteres

**Evolução:** Java moderno desencoraja `new String(String)` por desperdício, mas mantém construtores de conversão (char[], byte[]) como essenciais.

### Problema Fundamental que Resolve

#### Problema 1: Conversão de Arrays

**Sem construtores:**
```java
char[] chars = {'J', 'a', 'v', 'a'};
// Como transformar em String? Impossível sem construtor!
```

**Com construtor:**
```java
char[] chars = {'J', 'a', 'v', 'a'};
String s = new String(chars);  // "Java"
```

#### Problema 2: Dados Externos (Bytes)

**Leitura de arquivo/rede retorna bytes:**
```java
byte[] bytes = lerArquivo();  // bytes UTF-8
String conteudo = new String(bytes, StandardCharsets.UTF_8);
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Bypassa String Pool:** Objetos criados via `new` não vão automaticamente para o pool.

2. **Múltiplas Sobrecargas:** Construtores para String, char[], byte[], StringBuilder, etc.

3. **Cópia vs Referência:** Alguns construtores copiam dados, outros apenas referenciam.

4. **Especificação de Encoding:** Construtores byte[] permitem especificar charset.

5. **Geralmente Desnecessário:** Literais são preferíveis na maioria dos casos.

### Pilares Fundamentais

- **Sintaxe:** `new String(fonte)` - palavra-chave `new` obrigatória
- **Heap Regular:** Não usa String Pool (exceto se chamar `intern()`)
- **Construtores Úteis:** `String(char[])`, `String(byte[])`
- **Construtor Problemático:** `String(String)` - desperdício de memória

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### new String(String) - Criação Fora do Pool

```java
String literal = "Java";        // Pool
String objeto = new String("Java");  // Heap regular
```

**Memória:**

```
String Pool:
  "Java" (1 objeto) ←── literal

Heap Regular:
  String("Java") ←── objeto
```

**Análise:** DOIS objetos criados com conteúdo idêntico - desperdício!

**Verificação:**
```java
System.out.println(literal == objeto);       // false - objetos diferentes
System.out.println(literal.equals(objeto));  // true - conteúdo igual
```

#### Processo de Criação

**Código:**
```java
String s = new String("Hello");
```

**Passos:**
1. **Literal "Hello":** Compilador cria/reutiliza "Hello" no String Pool
2. **new String():** Construtor cria NOVO objeto String na heap regular
3. **Cópia de Dados:** Novo objeto copia caracteres do literal do pool
4. **Referência:** Variável `s` aponta para objeto novo (não o do pool)

**Resultado:** Dois objetos "Hello" - um no pool, um na heap regular.

### Princípios e Conceitos Subjacentes

#### Princípio da Criação Forçada

**Literal (lazy - reutiliza):**
```java
String s = "teste";  // Verifica pool primeiro, reutiliza se existir
```

**Construtor (eager - sempre cria):**
```java
String s = new String("teste");  // SEMPRE cria novo objeto
```

**Trade-off:** Controle vs Eficiência.

#### Princípio da Independência

Objeto criado via `new` é independente do pool:

```java
String pooled = "Java";
String independent = new String(pooled);

// Mesmo que pooled fosse mutável (não é), independent seria separado
// Mas como Strings são imutáveis, independência é acadêmica
```

**Análise:** Em prática, independência não tem benefício real - Strings são imutáveis.

---

## 🔍 Análise Conceitual Profunda

### Construtores Principais

#### 1. String(String original) - Cópia (Evitar!)

```java
String s1 = "Java";
String s2 = new String(s1);  // Cria cópia

System.out.println(s1 == s2);       // false
System.out.println(s1.equals(s2));  // true
```

**Análise Crítica:**
- **Desperdício:** Cria objeto desnecessário
- **Sem Benefício:** Strings são imutáveis - cópia não adiciona segurança
- **Guideline:** **NUNCA USE** este construtor - sempre prefira literal ou referência direta

**Exceção (raríssima):**
```java
// Defensivamente copiar string de fonte não confiável para evitar substring memory leak (Java <7)
// Problema já não existe em Java 7+, então mesmo esta exceção é obsoleta
```

#### 2. String(char[] value) - Conversão de Array

```java
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String s = new String(chars);
System.out.println(s);  // "Hello"
```

**Análise:** **Uso legítimo** - não há forma de criar String de char[] sem construtor.

**Variações:**
```java
// Substring de char array
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String s = new String(chars, 1, 3);  // offset=1, count=3
System.out.println(s);  // "ell"
```

**Cuidado - Cópia Defensiva:**
```java
char[] chars = {'J', 'a', 'v', 'a'};
String s = new String(chars);

// Modificar array NÃO afeta string (cópia foi feita)
chars[0] = 'X';
System.out.println(s);  // Ainda "Java"
```

#### 3. String(byte[] bytes) - Conversão de Bytes

**Encoding padrão da plataforma:**
```java
byte[] bytes = {72, 101, 108, 108, 111};  // "Hello" em ASCII
String s = new String(bytes);
System.out.println(s);  // "Hello"
```

**Encoding específico (recomendado):**
```java
byte[] bytes = {72, 101, 108, 108, 111};
String s = new String(bytes, StandardCharsets.UTF_8);
System.out.println(s);  // "Hello"
```

**Análise:** **Uso essencial** - leitura de arquivos, rede, bancos de dados retornam bytes.

**Exemplo Prático - Leitura de Arquivo:**
```java
byte[] arquivoBytes = Files.readAllBytes(Paths.get("dados.txt"));
String conteudo = new String(arquivoBytes, StandardCharsets.UTF_8);
```

**Encoding UTF-8 com BOM:**
```java
byte[] bytes = {(byte)0xEF, (byte)0xBB, (byte)0xBF, 72, 101};  // BOM + "He"
String s = new String(bytes, StandardCharsets.UTF_8);
// BOM pode ou não ser removido dependendo da implementação
```

**Variação - Substring:**
```java
byte[] bytes = {72, 101, 108, 108, 111};
String s = new String(bytes, 1, 3, StandardCharsets.UTF_8);  // offset, length
System.out.println(s);  // "ell"
```

#### 4. String(StringBuilder sb) - Conversão de Builder

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");

String s = new String(sb);
System.out.println(s);  // "Hello World"
```

**Equivalente (preferido):**
```java
String s = sb.toString();  // Mais idiomático
```

**Análise:** Raramente necessário - `toString()` é mais limpo.

#### 5. String(StringBuffer sb) - Conversão de Buffer

```java
StringBuffer sb = new StringBuffer("Thread-safe");
String s = new String(sb);
```

**Análise:** Mesma situação que StringBuilder - `toString()` preferível.

### Comparação: Literal vs new String()

| Aspecto | Literal `"texto"` | `new String("texto")` |
|---------|-------------------|----------------------|
| String Pool | Sim - reutiliza | Não - heap regular |
| Objetos Criados | 1 (compartilhado) | 2 (pool + heap) |
| Performance | Ótima | Inferior |
| Memória | Eficiente | Desperdiçadora |
| `==` entre iguais | `true` | `false` |
| Uso Recomendado | Sim - padrão | Não - evitar |

**Exemplo Comparativo:**
```java
// Literal - eficiente
String s1 = "Java";
String s2 = "Java";
// 1 objeto total

// Construtor - ineficiente
String s3 = new String("Java");
String s4 = new String("Java");
// 3 objetos total (1 pool + 2 heap)
```

### Casos de Uso Legítimos

#### Caso 1: Conversão char[] → String

```java
char[] senha = {'s', 'e', 'n', 'h', 'a', '1', '2', '3'};
String senhaString = new String(senha);

// Limpar array original por segurança
Arrays.fill(senha, '\0');
```

**Análise:** Construtor faz cópia - array pode ser limpo depois sem afetar String.

#### Caso 2: Leitura de Dados Binários

```java
// Ler arquivo binário
FileInputStream fis = new FileInputStream("dados.bin");
byte[] buffer = new byte[1024];
int bytesLidos = fis.read(buffer);

// Converter para String
String texto = new String(buffer, 0, bytesLidos, StandardCharsets.UTF_8);
```

#### Caso 3: Dados de Rede

```java
Socket socket = new Socket("servidor.com", 8080);
InputStream in = socket.getInputStream();
byte[] dados = in.readAllBytes();

String mensagem = new String(dados, StandardCharsets.UTF_8);
```

#### Caso 4: Interoperabilidade com C/JNI

```java
// Dados de biblioteca nativa (JNI)
byte[] dadosNativos = metodoNativo();
String resultado = new String(dadosNativos, StandardCharsets.ISO_8859_1);
```

### Anti-Padrões - O Que NÃO Fazer

#### Anti-Padrão 1: new String(literal)

```java
// MAL - desperdiça memória
String s = new String("Java");

// BOM - usa pool
String s = "Java";
```

#### Anti-Padrão 2: Cópia Desnecessária

```java
String original = "texto";

// MAL - cópia inútil
String copia = new String(original);

// BOM - reutilizar referência
String referencia = original;  // Strings são imutáveis, seguro compartilhar
```

#### Anti-Padrão 3: Conversão Indireta

```java
char[] chars = {'t', 'e', 's', 't', 'e'};

// MAL - conversão desnecessária
String s = new String(new String(chars));

// BOM - conversão direta
String s = new String(chars);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar new String()

✅ **Use construtores quando:**

1. **Conversão char[]:** `new String(charArray)`
2. **Conversão byte[]:** `new String(byteArray, charset)`
3. **Leitura de Arquivos/Rede:** Dados binários → String
4. **APIs que Retornam Arrays:** char[] ou byte[]

### Quando NÃO Usar

❌ **Não use quando:**

1. **Texto Literal:** Use `"texto"` ao invés de `new String("texto")`
2. **Já é String:** Não copie String existente
3. **Concatenação:** Use `+` ou StringBuilder, não construtor
4. **Conversão de Primitivos:** Use `String.valueOf()` ou `Integer.toString()`

---

## ⚠️ Limitações e Considerações

### Armadilhas Comuns

#### Armadilha 1: Criar Objetos Desnecessários

```java
// Cria 1001 objetos desnecessários!
for (int i = 0; i < 1000; i++) {
    String s = new String("constante");  // Novo objeto a cada iteração
}

// Correto - 1 objeto reutilizado
String constante = "constante";
for (int i = 0; i < 1000; i++) {
    String s = constante;  // Reutiliza mesma referência
}
```

#### Armadilha 2: Comparação com ==

```java
String s1 = new String("Java");
String s2 = new String("Java");

if (s1 == s2) {  // false - objetos diferentes!
    // Nunca executa
}

if (s1.equals(s2)) {  // true - conteúdo igual
    // Correto
}
```

#### Armadilha 3: Encoding Default

```java
// PERIGOSO - usa encoding padrão da plataforma (pode variar!)
byte[] bytes = lerArquivo();
String s = new String(bytes);  // Windows=Windows-1252, Linux=UTF-8

// SEGURO - especifica encoding explicitamente
String s = new String(bytes, StandardCharsets.UTF_8);
```

### Considerações de Performance

**Benchmark (aproximado):**
```java
// Literal - rápido (reutilização)
for (int i = 0; i < 1_000_000; i++) {
    String s = "Java";  // ~10ms
}

// Construtor - lento (criação + GC)
for (int i = 0; i < 1_000_000; i++) {
    String s = new String("Java");  // ~150ms
}
```

**Análise:** Construtor é ~15x mais lento por criação de objetos e pressão no GC.

---

## 🔗 Interconexões Conceituais

### Relação com String Pool

```java
String s1 = "Java";              // Pool
String s2 = new String("Java");  // Heap
String s3 = s2.intern();         // Retorna versão do pool

System.out.println(s1 == s2);  // false
System.out.println(s1 == s3);  // true - s3 é do pool
```

### Relação com Conversão de Tipos

```java
// String → char[]
String s = "Java";
char[] chars = s.toCharArray();

// char[] → String
String s2 = new String(chars);

// String → byte[]
byte[] bytes = s.getBytes(StandardCharsets.UTF_8);

// byte[] → String
String s3 = new String(bytes, StandardCharsets.UTF_8);
```

### Relação com StringBuilder

```java
// Construção eficiente
StringBuilder sb = new StringBuilder();
sb.append("Hello").append(" ").append("World");

// Conversão final
String s = sb.toString();  // Preferível a new String(sb)
```

---

## 🚀 Evolução e Próximos Conceitos

### Deprecações e Mudanças

**Java 9+:** Alguns construtores foram deprecados por segurança/performance:
```java
@Deprecated(since="9")
public String(byte[] ascii, int hibyte)
```

### Conceitos Relacionados

- **String.valueOf():** Conversão de primitivos
- **String.format():** Formatação com templates
- **StringBuilder:** Construção eficiente
- **Charset:** Codificações de caracteres

---

## 📚 Conclusão

O construtor `new String()` é ferramenta essencial para converter dados de outros formatos (char[], byte[]) em Strings, mas deve ser evitado ao criar Strings de literais ou outras Strings. A forma `new String(String)` desperdiça memória criando objetos desnecessários fora do String Pool.

Dominar construtores de String significa:
- Usar `new String(char[])` e `new String(byte[])` para conversões legítimas
- Sempre especificar charset em `new String(byte[], charset)` para portabilidade
- **EVITAR** `new String("literal")` - usar literal direto
- Compreender que objetos criados via `new` não vão para String Pool
- Preferir literais, `String.valueOf()`, ou `toString()` sobre construtores quando possível
- Reconhecer que Strings são imutáveis - cópias via construtor raramente necessárias

Construtores de String têm casos de uso específicos e importantes (conversão de bytes/chars), mas na maioria das vezes, literais simples (`"texto"`) são a escolha correta, eficiente e idiomática.
