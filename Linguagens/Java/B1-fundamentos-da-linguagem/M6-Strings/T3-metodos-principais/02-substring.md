# substring() - Extração de Substrings

## 🎯 Introdução e Definição

**substring()** permite **extrair partes de uma String**, criando uma **nova String** a partir de uma porção da original. É um dos métodos mais utilizados para manipulação de texto em Java.

**Conceito central**: Como String é **imutável**, substring() **não modifica** a String original, mas retorna uma **nova String** contendo os caracteres especificados.

**Exemplo fundamental**:
```java
String s = "Java Programming";

// substring(beginIndex) - do índice até o fim
String sub1 = s.substring(5);  // "Programming"

// substring(beginIndex, endIndex) - intervalo [begin, end)
String sub2 = s.substring(0, 4);  // "Java"
String sub3 = s.substring(5, 16); // "Programming"

// Índices:  0123456789...
// String:   Java Programming
//           ^^^^           (0, 4) - não inclui índice 4
//               ^^^^^^^^^^^  (5, 16)
```

**Características**:
- Retorna nova String (original não muda)
- Dois overloads: `substring(int)` e `substring(int, int)`
- endIndex é **exclusivo** (não incluído)
- Lança `StringIndexOutOfBoundsException` se índices inválidos

## 📋 Fundamentos Teóricos

### 1️⃣ substring(int beginIndex)

**Extrai do índice até o fim**:

```java
String s = "Hello World";

String sub1 = s.substring(0);  // "Hello World" (cópia completa)
String sub2 = s.substring(6);  // "World"
String sub3 = s.substring(10); // "d"
String sub4 = s.substring(11); // "" (String vazia)

// Índice:  0123456789...
// String:  Hello World
//                ^^^^^  substring(6)
```

**Assinatura**:
```java
public String substring(int beginIndex)
// Retorna: substring de beginIndex até o fim
// Lança: StringIndexOutOfBoundsException se beginIndex < 0 ou > length()
```

**Casos extremos**:
```java
String s = "Test";

s.substring(0);          // "Test" (toda a String)
s.substring(4);          // "" (vazia - beginIndex = length é válido!)
s.substring(5);          // StringIndexOutOfBoundsException
s.substring(-1);         // StringIndexOutOfBoundsException
```

### 2️⃣ substring(int beginIndex, int endIndex)

**Extrai intervalo [beginIndex, endIndex)**:

```java
String s = "Programming";

String sub1 = s.substring(0, 4);   // "Prog"
String sub2 = s.substring(3, 7);   // "gram"
String sub3 = s.substring(7, 11);  // "ming"

// Índice:  0 1 2 3 4 5 6 7 8 9 10
// String:  P r o g r a m m i n g
//          ^^^^^^^              (0, 4) - 'P','r','o','g'
//                ^^^^^^^        (3, 7) - 'g','r','a','m'
//                        ^^^^^  (7, 11) - 'm','i','n','g'
```

**Assinatura**:
```java
public String substring(int beginIndex, int endIndex)
// Retorna: substring de [beginIndex, endIndex)
// endIndex é EXCLUSIVO (não incluído)
// Lança: StringIndexOutOfBoundsException se índices inválidos
```

**endIndex é exclusivo**:
```java
String s = "ABCDE";

s.substring(0, 1);  // "A" (não "AB")
s.substring(0, 2);  // "AB" (não "ABC")
s.substring(1, 4);  // "BCD" (índices 1, 2, 3 - NÃO 4)

// Tamanho da substring = endIndex - beginIndex
s.substring(2, 5);  // "CDE" - tamanho = 5 - 2 = 3
```

### 3️⃣ Índices e Validação

**Índices válidos**:

```java
String s = "Hello";  // length = 5, índices 0-4

// ✓ Válidos
s.substring(0, 5);   // "Hello" (endIndex pode ser = length)
s.substring(0, 0);   // "" (vazia - beginIndex = endIndex)
s.substring(5);      // "" (vazia - beginIndex = length)
s.substring(2, 2);   // "" (vazia)

// ❌ Inválidos
s.substring(-1);           // StringIndexOutOfBoundsException
s.substring(6);            // StringIndexOutOfBoundsException
s.substring(0, 6);         // StringIndexOutOfBoundsException
s.substring(3, 2);         // StringIndexOutOfBoundsException (begin > end)
```

**Regras de validação**:
```java
// Para substring(beginIndex):
// - beginIndex >= 0
// - beginIndex <= length()

// Para substring(beginIndex, endIndex):
// - beginIndex >= 0
// - endIndex <= length()
// - beginIndex <= endIndex
```

**Validação preventiva**:
```java
String s = "Example";
int inicio = 2;
int fim = 10;

// ✓ Validar antes de chamar
if (inicio >= 0 && fim <= s.length() && inicio <= fim) {
    String sub = s.substring(inicio, fim);
} else {
    System.out.println("Índices inválidos");
}
```

### 4️⃣ Retorno e Imutabilidade

**Sempre retorna nova String**:

```java
String original = "Java Programming";
String sub = original.substring(0, 4);  // "Java"

System.out.println(original);  // "Java Programming" (não mudou)
System.out.println(sub);       // "Java" (nova String)

// Referências diferentes
System.out.println(original == sub);  // false
```

**Comparação de referências**:
```java
String s = "Test";

String sub1 = s.substring(0, 4);  // "Test"
String sub2 = s.substring(0, 4);  // "Test"

// sub1 e sub2 são Strings diferentes
System.out.println(sub1 == sub2);      // false (objetos diferentes)
System.out.println(sub1.equals(sub2)); // true (mesmo conteúdo)

// Mas se substring retorna String original completa:
String sub3 = s.substring(0);  // Pode retornar referência a 's'
System.out.println(s == sub3); // Pode ser true (otimização JVM)
```

**Otimização JVM**:
```java
String s = "Example";

// Se substring abrange toda a String, JVM pode retornar 's'
String sub = s.substring(0);
System.out.println(s == sub);  // Pode ser true (mesma referência)

// Mas não confie nisso - use equals()
```

### 5️⃣ Casos de Uso Práticos

**Extrair extensão de arquivo**:
```java
String arquivo = "document.pdf";

int pontoIndice = arquivo.lastIndexOf('.');
String extensao = arquivo.substring(pontoIndice + 1);  // "pdf"

// ou
String nome = arquivo.substring(0, pontoIndice);  // "document"
```

**Extrair nome de usuário de email**:
```java
String email = "usuario@example.com";

int arrobaIndice = email.indexOf('@');
String usuario = email.substring(0, arrobaIndice);  // "usuario"
String dominio = email.substring(arrobaIndice + 1); // "example.com"
```

**Pegar primeiros N caracteres**:
```java
String texto = "Este é um texto longo";

String resumo = texto.substring(0, Math.min(10, texto.length()));
// "Este é um " (máximo 10 caracteres)

// Math.min() evita StringIndexOutOfBoundsException se texto < 10
```

**Remover prefixo/sufixo**:
```java
String s = "Mr. Smith";

// Remover "Mr. " (4 caracteres)
String nome = s.substring(4);  // "Smith"

// Remover último caractere
String s2 = "Hello!";
String semPontuacao = s2.substring(0, s2.length() - 1);  // "Hello"
```

### 6️⃣ Performance de substring()

**Java 7+ - cria novo array**:

```java
// Java 7+: substring() cria novo array char[]
String grande = "A".repeat(1_000_000);  // 1 milhão de caracteres
String pequena = grande.substring(0, 10);  // 10 caracteres

// 'pequena' tem array de 10 chars
// 'grande' pode ser GC se não usado
// Memória: ~20 bytes para 'pequena'
```

**Java 6 - compartilhava array (memory leak)**:

```java
// Java 6 (ANTIGO): substring() compartilhava array interno
String grande = lerArquivoGrande();  // 1 MB
String pequena = grande.substring(0, 10);
grande = null;

// Em Java 6: 'pequena' mantinha referência ao array de 1MB!
// Memory leak se 'pequena' ficasse em memória por muito tempo

// Java 7+ corrigiu isso - copia array
```

**Complexidade**:
```java
// substring(begin, end)
// Tempo: O(n) onde n = end - begin (precisa copiar caracteres)
// Espaço: O(n) (novo array alocado)

String s = "Example";
String sub = s.substring(2, 5);  // O(3) - copia 3 caracteres
```

**Benchmark**:
```java
String s = "A".repeat(1000);

// Teste: 1 milhão de substrings
long inicio = System.currentTimeMillis();
for (int i = 0; i < 1_000_000; i++) {
    String sub = s.substring(0, 10);
}
long tempo = System.currentTimeMillis() - inicio;
// Tempo: ~200ms
// Por substring: ~200 nanossegundos
```

### 7️⃣ substring() vs Alternativas

**substring() vs split()**:
```java
String s = "A,B,C,D";

// substring() - mais controle
int virgula = s.indexOf(',');
String primeiro = s.substring(0, virgula);  // "A"

// split() - mais conveniente
String[] partes = s.split(",");
String primeiro = partes[0];  // "A"

// substring(): mais rápido (sem regex)
// split(): mais fácil para múltiplas divisões
```

**substring() vs charAt() em loop**:
```java
String s = "Example";

// substring() - cria nova String
String sub = s.substring(2, 5);  // "amp"

// charAt() - acessa sem alocar
for (int i = 2; i < 5; i++) {
    char c = s.charAt(i);  // 'a', 'm', 'p'
}

// substring(): conveniente, aloca memória
// charAt(): eficiente, sem alocação
```

### 8️⃣ Substrings Vazias

**Quando substring() retorna String vazia**:

```java
String s = "Test";

s.substring(0, 0);  // "" (início = fim)
s.substring(4, 4);  // "" (início = fim)
s.substring(2, 2);  // "" (qualquer índice igual)
s.substring(4);     // "" (do fim até o fim)

// Verificar vazia
String sub = s.substring(x, y);
if (sub.isEmpty()) {
    // substring vazia
}
```

**Tamanho da substring**:
```java
String s = "Programming";

// Tamanho = endIndex - beginIndex
String sub1 = s.substring(0, 5);  // Tamanho = 5 - 0 = 5
System.out.println(sub1.length());  // 5

String sub2 = s.substring(3, 3);  // Tamanho = 3 - 3 = 0
System.out.println(sub2.length());  // 0 (vazia)
```

### 9️⃣ Encadeamento de Métodos

**substring() retorna String - pode encadear**:

```java
String s = "  Hello World  ";

// Encadear com outros métodos
String resultado = s.substring(2, 13)  // "Hello World "
                    .trim()            // "Hello World"
                    .toUpperCase();    // "HELLO WORLD"

// Cada método retorna nova String
```

**Exemplo prático**:
```java
String url = "https://example.com/path/file.html";

// Extrair nome do arquivo sem extensão
String arquivo = url.substring(url.lastIndexOf('/') + 1)  // "file.html"
                    .substring(0, url.lastIndexOf('.') - url.lastIndexOf('/') - 1);

// Melhor: separar em passos
int barraPos = url.lastIndexOf('/');
int pontoPos = url.lastIndexOf('.');
String nomeArquivo = url.substring(barraPos + 1, pontoPos);  // "file"
```

### 🔟 Tratamento de Exceções

**Capturar StringIndexOutOfBoundsException**:

```java
String s = "Test";
int inicio = 10;  // Inválido

try {
    String sub = s.substring(inicio);
    System.out.println(sub);
} catch (StringIndexOutOfBoundsException e) {
    System.out.println("Índice inicial fora dos limites: " + inicio);
    System.out.println("Tamanho da String: " + s.length());
}
```

**Validação vs Try-Catch**:
```java
String s = "Example";
int inicio = obterIndice();
int fim = obterFim();

// Opção 1: Validação (PREFERÍVEL)
if (inicio >= 0 && fim <= s.length() && inicio <= fim) {
    String sub = s.substring(inicio, fim);
} else {
    // Tratar índices inválidos
}

// Opção 2: Try-Catch (menos performático)
try {
    String sub = s.substring(inicio, fim);
} catch (StringIndexOutOfBoundsException e) {
    // Tratar exceção
}

// Validação é melhor: mais clara e mais rápida
```

**Casos especiais**:
```java
String s = "Data";

// Garantir que índices são válidos
int inicio = Math.max(0, indiceInicio);
int fim = Math.min(s.length(), indiceFim);

if (inicio <= fim) {
    String sub = s.substring(inicio, fim);
} else {
    // início > fim - retornar vazia ou erro
    String sub = "";
}
```

## 🎯 Aplicabilidade

**1. Extrair Partes de Strings Estruturadas**:
```java
String cpf = "123.456.789-00";
String primeiraParte = cpf.substring(0, 3);   // "123"
String segundaParte = cpf.substring(4, 7);    // "456"
String terceiraParte = cpf.substring(8, 11);  // "789"
String digitoVerificador = cpf.substring(12); // "00"
```

**2. Processar Linhas de Arquivo**:
```java
String linha = "Nome      Idade Cidade    ";
String nome = linha.substring(0, 10).trim();   // "Nome"
String idade = linha.substring(10, 15).trim(); // "Idade"
String cidade = linha.substring(15).trim();    // "Cidade"
```

**3. Extrair Tokens**:
```java
String comando = "GET /api/users HTTP/1.1";
int primeiroEspaco = comando.indexOf(' ');
int segundoEspaco = comando.indexOf(' ', primeiroEspaco + 1);

String metodo = comando.substring(0, primeiroEspaco);  // "GET"
String path = comando.substring(primeiroEspaco + 1, segundoEspaco);  // "/api/users"
String protocolo = comando.substring(segundoEspaco + 1);  // "HTTP/1.1"
```

**4. Truncar Texto**:
```java
public String truncar(String texto, int maxCaracteres) {
    if (texto.length() <= maxCaracteres) {
        return texto;
    }
    return texto.substring(0, maxCaracteres) + "...";
}

String longo = "Este é um texto muito longo";
String curto = truncar(longo, 10);  // "Este é um ..."
```

**5. Remover Prefixo/Sufixo**:
```java
String s = "prefixo_dados_sufixo";

if (s.startsWith("prefixo_")) {
    s = s.substring(8);  // "dados_sufixo"
}

if (s.endsWith("_sufixo")) {
    s = s.substring(0, s.length() - 7);  // "dados"
}
```

## ⚠️ Armadilhas Comuns

**1. Esquecer que endIndex é Exclusivo**:
```java
String s = "ABCDE";
String sub = s.substring(0, 3);  // "ABC", não "ABCD"
```

**2. Índices Fora dos Limites**:
```java
String s = "Test";
String sub = s.substring(0, 10);  // ❌ StringIndexOutOfBoundsException
```

**3. beginIndex > endIndex**:
```java
String sub = s.substring(5, 2);  // ❌ Exceção
```

**4. Não Verificar String Vazia**:
```java
String s = "";
String sub = s.substring(0, 1);  // ❌ Exceção (s.length() = 0)
```

**5. Memory Leak em Java 6**:
```java
// ❌ Java 6 - memory leak
String grande = lerArquivo();  // 10 MB
String pequena = grande.substring(0, 10);
grande = null;
// 'pequena' ainda mantém 10 MB em Java 6!

// ✓ Java 7+ - sem problema (copia array)
```

## ✅ Boas Práticas

**1. Validar Índices**:
```java
if (inicio >= 0 && fim <= s.length() && inicio <= fim) {
    String sub = s.substring(inicio, fim);
}
```

**2. Usar Math.min() para Limitar**:
```java
String resumo = s.substring(0, Math.min(100, s.length()));
```

**3. Verificar Vazio**:
```java
if (!s.isEmpty()) {
    String sub = s.substring(1);  // Seguro
}
```

**4. Armazenar indexOf() em Variável**:
```java
int pos = s.indexOf(',');
if (pos != -1) {
    String antes = s.substring(0, pos);
    String depois = s.substring(pos + 1);
}
```

**5. Preferir Métodos Específicos**:
```java
// ✗ substring() para verificar início
if (s.substring(0, 6).equals("prefix")) { }

// ✓ startsWith() - mais claro e eficiente
if (s.startsWith("prefix")) { }
```

## 📚 Resumo Executivo

**substring()**: extrai parte de uma String, criando **nova String**.

**Dois overloads**:

```java
// 1. substring(beginIndex) - do índice até o fim
String s = "Java Programming";
String sub = s.substring(5);  // "Programming"

// 2. substring(beginIndex, endIndex) - intervalo [begin, end)
String sub2 = s.substring(0, 4);  // "Java"
```

**endIndex é EXCLUSIVO**:
```java
String s = "ABCDE";
s.substring(0, 3);  // "ABC" (índices 0, 1, 2 - NÃO 3)
```

**Tamanho da substring**: `endIndex - beginIndex`

**Casos especiais**:
```java
s.substring(0);      // Cópia completa
s.substring(n, n);   // "" (vazia)
s.substring(0, 0);   // "" (vazia)
s.substring(s.length());  // "" (vazia)
```

**Exceções**:
```java
s.substring(-1);      // ❌ StringIndexOutOfBoundsException
s.substring(100);     // ❌ StringIndexOutOfBoundsException
s.substring(5, 2);    // ❌ Exceção (begin > end)
```

**Imutabilidade**:
```java
String original = "Hello";
String sub = original.substring(0, 2);  // "He"
System.out.println(original);  // "Hello" (não mudou)
```

**Performance**:
- Tempo: O(n) onde n = tamanho da substring
- Espaço: O(n) - cria novo array (Java 7+)
- Java 6: compartilhava array (memory leak potencial)

**Validação**:
```java
// Sempre validar índices
if (inicio >= 0 && fim <= s.length() && inicio <= fim) {
    String sub = s.substring(inicio, fim);  // Seguro
}
```

**Uso típico**:
```java
// Extrair extensão
String ext = arquivo.substring(arquivo.lastIndexOf('.') + 1);

// Truncar
String resumo = texto.substring(0, Math.min(50, texto.length()));

// Remover prefixo
String sem = s.substring(prefixo.length());
```