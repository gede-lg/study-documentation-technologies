# indexOf() e lastIndexOf() - Busca de Substrings

## 🎯 Introdução e Definição

**indexOf()** e **lastIndexOf()** são métodos para **localizar a posição de caracteres ou substrings** dentro de uma String. Retornam o **índice** da primeira ou última ocorrência encontrada, ou **-1** se não encontrado.

**Conceito central**: Esses métodos realizam **busca linear** (O(n)) pela String, retornando a **posição** (índice) onde o padrão foi encontrado, permitindo localizar e extrair dados de forma eficiente.

**Exemplo fundamental**:
```java
String s = "Java Programming in Java";

// indexOf() - primeira ocorrência
int pos1 = s.indexOf("Java");        // 0 (primeiro "Java")
int pos2 = s.indexOf('P');           // 5 (letra 'P')
int pos3 = s.indexOf("Python");      // -1 (não encontrado)

// lastIndexOf() - última ocorrência
int pos4 = s.lastIndexOf("Java");    // 20 (último "Java")
int pos5 = s.lastIndexOf('a');       // 23 (último 'a')

// Índices: 0123456789...
// String:  Java Programming in Java
//          ^^^^                ^^^^
//          0 (indexOf)         20 (lastIndexOf)
```

**Retorno**:
- **Índice** (0 até length-1) se encontrado
- **-1** se NÃO encontrado

## 📋 Fundamentos Teóricos

### 1️⃣ indexOf(char ch)

**Busca primeira ocorrência de caractere**:

```java
String s = "Hello World";

int pos1 = s.indexOf('H');   // 0 (primeiro caractere)
int pos2 = s.indexOf('o');   // 4 (primeiro 'o')
int pos3 = s.indexOf('l');   // 2 (primeiro 'l', não último)
int pos4 = s.indexOf('z');   // -1 (não encontrado)

// Índices:  0 1 2 3 4 5 6 7 8 9 10
// String:   H e l l o   W o r l d
//               ^     (indexOf('l') = 2)
//                   ^   (indexOf('o') = 4)
```

**Assinatura**:
```java
public int indexOf(int ch)
// Parâmetro: int ch (code point do caractere)
// Retorna: índice da primeira ocorrência, ou -1 se não encontrado
```

**Aceita int (code point)**:
```java
String s = "Test";

// char é convertido para int automaticamente
int pos1 = s.indexOf('e');    // 1

// Pode passar int diretamente (code point Unicode)
int pos2 = s.indexOf(101);    // 1 ('e' = 101 em ASCII)
```

### 2️⃣ indexOf(String str)

**Busca primeira ocorrência de substring**:

```java
String s = "Java Programming Language";

int pos1 = s.indexOf("Java");         // 0
int pos2 = s.indexOf("Programming");  // 5
int pos3 = s.indexOf("Language");     // 17
int pos4 = s.indexOf("Python");       // -1 (não encontrado)
int pos5 = s.indexOf("");             // 0 (String vazia sempre em 0)

// Índices:  0123456789...
// String:   Java Programming Language
//           ^^^^         (indexOf("Java") = 0)
//                ^^^^^^^  (indexOf("Programming") = 5)
```

**Assinatura**:
```java
public int indexOf(String str)
// Retorna: índice do início da substring, ou -1 se não encontrada
```

**Case-sensitive**:
```java
String s = "Hello World";

int pos1 = s.indexOf("hello");  // -1 (case-sensitive!)
int pos2 = s.indexOf("Hello");  // 0 (exato)

// Para ignorar case:
int pos3 = s.toLowerCase().indexOf("hello");  // 0
```

### 3️⃣ indexOf(char ch, int fromIndex)

**Busca a partir de índice específico**:

```java
String s = "banana";

int pos1 = s.indexOf('a');       // 1 (primeiro 'a')
int pos2 = s.indexOf('a', 2);    // 3 (primeiro 'a' a partir do índice 2)
int pos3 = s.indexOf('a', 4);    // 5 (primeiro 'a' a partir do índice 4)
int pos4 = s.indexOf('a', 6);    // -1 (nenhum 'a' após índice 6)

// Índices:  0 1 2 3 4 5
// String:   b a n a n a
//             ^   ^   ^  (posições de 'a')
//               ^        indexOf('a', 2) começa aqui
```

**Assinatura**:
```java
public int indexOf(int ch, int fromIndex)
// Busca a partir de fromIndex (inclusive)
// fromIndex negativo = busca desde 0
```

**Comportamento com fromIndex**:
```java
String s = "Test";

s.indexOf('e', 0);    // 1 (busca desde início)
s.indexOf('e', 1);    // 1 (encontra no próprio índice 1)
s.indexOf('e', 2);    // -1 (não há 'e' após índice 2)
s.indexOf('e', -5);   // 1 (fromIndex negativo = 0)
s.indexOf('e', 100);  // -1 (fromIndex > length = -1)
```

### 4️⃣ indexOf(String str, int fromIndex)

**Busca substring a partir de índice**:

```java
String s = "Java is fun, Java is powerful";

int pos1 = s.indexOf("Java");       // 0 (primeiro)
int pos2 = s.indexOf("Java", 5);    // 13 (segundo "Java")
int pos3 = s.indexOf("Java", 14);   // -1 (nenhum após índice 14)

// Índices:  0123456789...
// String:   Java is fun, Java is powerful
//           ^^^^         ^^^^
//           0            13 (indexOf("Java", 5))
```

**Encontrar todas as ocorrências**:
```java
String s = "banana";
char procurar = 'a';

int pos = s.indexOf(procurar);
while (pos != -1) {
    System.out.println("Encontrado 'a' no índice: " + pos);
    pos = s.indexOf(procurar, pos + 1);  // Buscar próximo
}

// Saída:
// Encontrado 'a' no índice: 1
// Encontrado 'a' no índice: 3
// Encontrado 'a' no índice: 5
```

### 5️⃣ lastIndexOf(char ch)

**Busca última ocorrência de caractere**:

```java
String s = "Hello World";

int pos1 = s.lastIndexOf('o');  // 7 (último 'o', não primeiro)
int pos2 = s.lastIndexOf('l');  // 9 (último 'l')
int pos3 = s.lastIndexOf('H');  // 0 (único 'H')
int pos4 = s.lastIndexOf('z');  // -1 (não encontrado)

// Índices:  0 1 2 3 4 5 6 7 8 9 10
// String:   H e l l o   W o r l d
//                 ^       (lastIndexOf('l') = 9)
//                       ^ (lastIndexOf('o') = 7)
```

**Assinatura**:
```java
public int lastIndexOf(int ch)
// Busca de trás para frente
// Retorna: índice da última ocorrência, ou -1
```

**Diferença indexOf vs lastIndexOf**:
```java
String s = "programming";

int primeiro = s.indexOf('m');      // 6 (primeiro 'm')
int ultimo = s.lastIndexOf('m');    // 7 (último 'm')

// Índices:  0123456789...
// String:   programming
//                 ^^    (dois 'm' em 6 e 7)
```

### 6️⃣ lastIndexOf(String str)

**Busca última ocorrência de substring**:

```java
String s = "Java is great, Java is powerful";

int pos1 = s.lastIndexOf("Java");  // 15 (último "Java")
int pos2 = s.lastIndexOf("is");    // 20 (último "is")
int pos3 = s.indexOf("Java");      // 0 (primeiro "Java")

// Comparação:
// indexOf():     retorna 0 (primeiro)
// lastIndexOf(): retorna 15 (último)
```

**String vazia**:
```java
String s = "Test";

s.lastIndexOf("");  // 4 (length) - última posição vazia
s.indexOf("");      // 0 - primeira posição vazia
```

### 7️⃣ lastIndexOf com fromIndex

**Busca para trás até fromIndex**:

```java
String s = "banana";

int pos1 = s.lastIndexOf('a');       // 5 (último 'a')
int pos2 = s.lastIndexOf('a', 4);    // 3 (último 'a' até índice 4)
int pos3 = s.lastIndexOf('a', 2);    // 1 (último 'a' até índice 2)
int pos4 = s.lastIndexOf('a', 0);    // -1 (nenhum 'a' em/antes de 0)

// Índices:  0 1 2 3 4 5
// String:   b a n a n a
//             ^   ^   ^  ('a' em 1, 3, 5)
//             ^          lastIndexOf('a', 2) busca até aqui
```

**Assinaturas**:
```java
public int lastIndexOf(int ch, int fromIndex)
public int lastIndexOf(String str, int fromIndex)
// Busca de trás para frente ATÉ fromIndex (inclusive)
```

**Exemplo com substring**:
```java
String s = "Java, Java, Java";

int pos1 = s.lastIndexOf("Java");       // 12 (último)
int pos2 = s.lastIndexOf("Java", 11);   // 6 (penúltimo)
int pos3 = s.lastIndexOf("Java", 5);    // 0 (primeiro)
```

### 8️⃣ Retorno -1 e Verificação

**Sempre verificar retorno -1**:

```java
String s = "Hello World";
int pos = s.indexOf("Python");

// ❌ ERRO - usar sem verificar
char c = s.charAt(pos);  // StringIndexOutOfBoundsException se pos = -1

// ✓ CORRETO - verificar primeiro
if (pos != -1) {
    char c = s.charAt(pos);
    System.out.println("Encontrado no índice: " + pos);
} else {
    System.out.println("Não encontrado");
}
```

**Uso em condições**:
```java
String email = "user@example.com";

// Verificar se contém '@'
if (email.indexOf('@') != -1) {
    System.out.println("Email válido");
}

// Ou usar contains() - mais claro
if (email.contains("@")) {
    System.out.println("Email válido");
}
```

**Extrair partes após busca**:
```java
String path = "/home/user/documents/file.txt";

int ultimaBarra = path.lastIndexOf('/');
if (ultimaBarra != -1) {
    String nomeArquivo = path.substring(ultimaBarra + 1);  // "file.txt"
    String diretorio = path.substring(0, ultimaBarra);     // "/home/user/documents"
}
```

### 9️⃣ Performance e Complexidade

**Complexidade temporal**:
```java
// indexOf() e lastIndexOf()
// Tempo: O(n × m)
//   n = tamanho da String
//   m = tamanho do padrão buscado

String texto = "A".repeat(10000);    // 10.000 caracteres
int pos = texto.indexOf("ZZZZZ");    // Percorre toda String

// Pior caso: O(n × m)
// Caso médio: O(n) (padrão encontrado cedo)
```

**Benchmark**:
```java
String s = "A".repeat(1_000_000);  // 1 milhão de caracteres

// Teste: buscar caractere inexistente
long inicio = System.nanoTime();
int pos = s.indexOf('Z');  // Percorre toda String
long tempo = System.nanoTime() - inicio;
// Tempo: ~2-5ms (depende da JVM)

// indexOf() é otimizado na JVM (usa intrinsics)
```

**indexOf() vs contains()**:
```java
String s = "Example";

// contains() usa indexOf() internamente
public boolean contains(CharSequence s) {
    return indexOf(s.toString()) >= 0;
}

// Performance idêntica
s.indexOf("amp") != -1;  // Retorna índice
s.contains("amp");       // Retorna boolean

// Escolha: indexOf() se precisa da posição, contains() se só verificar
```

### 🔟 Casos de Uso Práticos

**Dividir String em partes**:
```java
String s = "nome:valor";

int separador = s.indexOf(':');
if (separador != -1) {
    String chave = s.substring(0, separador);       // "nome"
    String valor = s.substring(separador + 1);      // "valor"
}
```

**Extrair extensão de arquivo**:
```java
String arquivo = "documento.backup.pdf";

int ultimoPonto = arquivo.lastIndexOf('.');
if (ultimoPonto != -1) {
    String extensao = arquivo.substring(ultimoPonto + 1);  // "pdf"
    String nome = arquivo.substring(0, ultimoPonto);       // "documento.backup"
}
```

**Contar ocorrências**:
```java
public int contarOcorrencias(String texto, String padrao) {
    int count = 0;
    int pos = texto.indexOf(padrao);
    
    while (pos != -1) {
        count++;
        pos = texto.indexOf(padrao, pos + 1);
    }
    
    return count;
}

String s = "banana";
int ocorrencias = contarOcorrencias(s, "an");  // 2
```

**Validar formato**:
```java
public boolean emailValido(String email) {
    int arroba = email.indexOf('@');
    int ponto = email.lastIndexOf('.');
    
    // '@' deve existir, '.' deve existir após '@'
    return arroba > 0 && ponto > arroba + 1 && ponto < email.length() - 1;
}

System.out.println(emailValido("user@example.com"));  // true
System.out.println(emailValido("invalid"));           // false
```

**Substituir entre delimitadores**:
```java
String s = "Valor atual: {placeholder}";

int inicio = s.indexOf('{');
int fim = s.indexOf('}');

if (inicio != -1 && fim != -1 && fim > inicio) {
    String antes = s.substring(0, inicio);
    String depois = s.substring(fim + 1);
    String resultado = antes + "123" + depois;
    // "Valor atual: 123"
}
```

## 🎯 Aplicabilidade

**1. Parsing de Strings Estruturadas**:
```java
String linha = "ID:123,Nome:João,Idade:30";
int pos = 0;
while ((pos = linha.indexOf(':', pos)) != -1) {
    int fim = linha.indexOf(',', pos);
    if (fim == -1) fim = linha.length();
    String valor = linha.substring(pos + 1, fim);
    System.out.println(valor);
    pos = fim + 1;
}
```

**2. Navegação em Paths**:
```java
String path = "/home/user/file.txt";
int ultimaBarra = path.lastIndexOf('/');
String nomeArquivo = path.substring(ultimaBarra + 1);
```

**3. Validação de Formato**:
```java
boolean temArroba = email.indexOf('@') != -1;
boolean temPonto = email.indexOf('.') != -1;
```

**4. Encontrar Todas Ocorrências**:
```java
List<Integer> posicoes = new ArrayList<>();
int pos = -1;
while ((pos = texto.indexOf(padrao, pos + 1)) != -1) {
    posicoes.add(pos);
}
```

**5. Extrair Tokens**:
```java
int virgula = s.indexOf(',');
if (virgula != -1) {
    String token1 = s.substring(0, virgula);
    String token2 = s.substring(virgula + 1);
}
```

## ⚠️ Armadilhas Comuns

**1. Não Verificar -1**:
```java
int pos = s.indexOf("x");
char c = s.charAt(pos);  // ❌ StringIndexOutOfBoundsException se -1
```

**2. Case Sensitivity**:
```java
"Hello".indexOf("hello");  // -1, não 0!
```

**3. Confundir indexOf e lastIndexOf**:
```java
String s = "test";
s.indexOf('t');      // 0 (primeiro)
s.lastIndexOf('t');  // 3 (último)
```

**4. fromIndex Fora dos Limites**:
```java
String s = "Test";
s.indexOf('e', 10);  // -1 (fromIndex > length)
```

**5. Assumir que String Vazia Retorna -1**:
```java
"Test".indexOf("");  // 0, não -1!
```

## ✅ Boas Práticas

**1. Sempre Verificar -1**:
```java
int pos = s.indexOf(ch);
if (pos != -1) {
    // usar pos
}
```

**2. Use contains() para Simples Verificação**:
```java
// ✗ Verboso
if (s.indexOf("x") != -1) { }

// ✓ Mais claro
if (s.contains("x")) { }
```

**3. Armazene indexOf em Variável**:
```java
// ✗ Chama indexOf() múltiplas vezes
if (s.indexOf(',') != -1) {
    String parte = s.substring(s.indexOf(',') + 1);
}

// ✓ Chama uma vez
int pos = s.indexOf(',');
if (pos != -1) {
    String parte = s.substring(pos + 1);
}
```

**4. Use lastIndexOf para Extensões**:
```java
// ✓ Pega última extensão
int ponto = arquivo.lastIndexOf('.');

// ✗ indexOf pega primeira
int ponto = arquivo.indexOf('.');  // Erro em "arquivo.backup.txt"
```

**5. Ignore Case com toLowerCase()**:
```java
String s = "Hello World";
int pos = s.toLowerCase().indexOf("world");  // 6
```

## 📚 Resumo Executivo

**indexOf()** e **lastIndexOf()**: localizam posição de caracteres/substrings.

**Métodos principais**:

```java
String s = "Java Programming in Java";

// indexOf() - primeira ocorrência
s.indexOf('a');              // 1
s.indexOf("Java");           // 0
s.indexOf('a', 5);           // 7 (a partir do índice 5)
s.indexOf("Java", 5);        // 20

// lastIndexOf() - última ocorrência
s.lastIndexOf('a');          // 23
s.lastIndexOf("Java");       // 20
s.lastIndexOf('a', 10);      // 9 (até índice 10)
s.lastIndexOf("Java", 10);   // 0
```

**Retorno**:
- **Índice** (0 até length-1) se encontrado
- **-1** se NÃO encontrado

**Verificação essencial**:
```java
int pos = s.indexOf("x");
if (pos != -1) {
    // Encontrado - seguro usar pos
} else {
    // Não encontrado
}
```

**Diferenças**:

| Método | Direção | Retorna |
|--------|---------|---------|
| indexOf() | Início → Fim | Primeira ocorrência |
| lastIndexOf() | Fim → Início | Última ocorrência |

**Performance**:
- Complexidade: O(n × m) no pior caso
- Otimizado pela JVM (intrinsics)
- contains() usa indexOf() internamente

**Casos especiais**:
```java
s.indexOf("");           // 0 (String vazia sempre em 0)
s.lastIndexOf("");       // s.length() (fim)
s.indexOf('x', -5);      // Trata -5 como 0
s.indexOf('x', 1000);    // -1 (fromIndex > length)
```

**Uso típico**:
```java
// Dividir
int pos = s.indexOf(':');
String antes = s.substring(0, pos);
String depois = s.substring(pos + 1);

// Extrair extensão
int ponto = arquivo.lastIndexOf('.');
String ext = arquivo.substring(ponto + 1);

// Contar
int count = 0, pos = -1;
while ((pos = s.indexOf('x', pos + 1)) != -1) {
    count++;
}
```