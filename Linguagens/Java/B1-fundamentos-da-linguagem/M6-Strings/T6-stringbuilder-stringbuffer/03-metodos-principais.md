# Métodos Principais: append(), insert(), delete(), replace()

## 🎯 Introdução e Definição

**StringBuilder oferece métodos poderosos** para modificar Strings de forma **eficiente e flexível**. Os quatro métodos principais - **append()**, **insert()**, **delete()** e **replace()** - permitem adicionar, inserir, remover e substituir conteúdo no array interno mutável.

**Conceito central**: Todos esses métodos **modificam o objeto existente** (mutabilidade) e **retornam this** (permitindo encadeamento). Diferente de String, não criam novos objetos, resultando em **performance superior** para construção e manipulação de Strings.

**Exemplo fundamental**:
```java
StringBuilder sb = new StringBuilder("Java");

// append() - adiciona ao final
sb.append(" Programming");
System.out.println(sb);  // "Java Programming"

// insert() - insere em posição específica
sb.insert(4, " 17");
System.out.println(sb);  // "Java 17 Programming"

// delete() - remove range de caracteres
sb.delete(5, 8);
System.out.println(sb);  // "Java Programming"

// replace() - substitui range
sb.replace(5, 16, "Development");
System.out.println(sb);  // "Java Development"

// Todos modificam MESMO objeto
```

**Características principais**:
- **append()**: adiciona ao final, aceita múltiplos tipos
- **insert()**: insere em índice específico
- **delete()**: remove range [start, end)
- **replace()**: substitui range com nova String
- **Retornam this**: encadeamento de chamadas possível

## 📋 Fundamentos Teóricos

### 1️⃣ append() - Adicionar ao Final

**Assinaturas sobrecarregadas**:

```java
StringBuilder append(String str)
StringBuilder append(int i)
StringBuilder append(long l)
StringBuilder append(double d)
StringBuilder append(float f)
StringBuilder append(boolean b)
StringBuilder append(char c)
StringBuilder append(char[] str)
StringBuilder append(char[] str, int offset, int len)
StringBuilder append(CharSequence s)
StringBuilder append(CharSequence s, int start, int end)
StringBuilder append(Object obj)
```

**Uso básico**:
```java
StringBuilder sb = new StringBuilder();

// String
sb.append("Hello");
sb.append(" ");
sb.append("World");

// int
sb.append(2024);

// double
sb.append(3.14);

// boolean
sb.append(true);

// char
sb.append('!');

System.out.println(sb);  // "Hello World20243.14true!"
```

**Encadeamento**:
```java
// append() retorna this - permite encadear
StringBuilder sb = new StringBuilder();
sb.append("Nome: ")
  .append("João")
  .append(", Idade: ")
  .append(30)
  .append(", Ativo: ")
  .append(true);

String resultado = sb.toString();
// "Nome: João, Idade: 30, Ativo: true"
```

**Array de caracteres**:
```java
char[] chars = {'J', 'a', 'v', 'a'};

// Append array completo
StringBuilder sb1 = new StringBuilder();
sb1.append(chars);
System.out.println(sb1);  // "Java"

// Append parte do array
StringBuilder sb2 = new StringBuilder();
sb2.append(chars, 1, 2);  // offset=1, length=2
System.out.println(sb2);  // "av"
```

**CharSequence e substring**:
```java
String texto = "Hello World";

// Append CharSequence completo
StringBuilder sb1 = new StringBuilder();
sb1.append((CharSequence)texto);
System.out.println(sb1);  // "Hello World"

// Append parte da CharSequence
StringBuilder sb2 = new StringBuilder();
sb2.append(texto, 6, 11);  // start=6, end=11
System.out.println(sb2);  // "World"
```

**Null handling**:
```java
StringBuilder sb = new StringBuilder();

// null é convertido para "null"
sb.append((String)null);
System.out.println(sb);  // "null"

sb.setLength(0);  // Limpar
sb.append((Object)null);
System.out.println(sb);  // "null"

// Não lança NullPointerException
```

### 2️⃣ insert() - Inserir em Posição

**Assinaturas principais**:

```java
StringBuilder insert(int offset, String str)
StringBuilder insert(int offset, char[] str)
StringBuilder insert(int offset, CharSequence s)
StringBuilder insert(int offset, CharSequence s, int start, int end)
StringBuilder insert(int offset, boolean b)
StringBuilder insert(int offset, char c)
StringBuilder insert(int offset, int i)
StringBuilder insert(int offset, long l)
StringBuilder insert(int offset, float f)
StringBuilder insert(int offset, double d)
StringBuilder insert(int offset, Object obj)
```

**Uso básico**:
```java
StringBuilder sb = new StringBuilder("Java Programming");

// insert(int offset, String str)
sb.insert(4, " 17");
System.out.println(sb);  // "Java 17 Programming"

// insert no início
sb = new StringBuilder("World");
sb.insert(0, "Hello ");
System.out.println(sb);  // "Hello World"

// insert no final (equivale a append)
sb = new StringBuilder("Hello");
sb.insert(sb.length(), " World");
System.out.println(sb);  // "Hello World"
```

**Tipos primitivos**:
```java
StringBuilder sb = new StringBuilder("Version  is awesome");

// insert int
sb.insert(8, 17);
System.out.println(sb);  // "Version 17 is awesome"

// insert char
sb = new StringBuilder("HelloWorld");
sb.insert(5, ' ');
System.out.println(sb);  // "Hello World"

// insert boolean
sb = new StringBuilder("Active: ");
sb.insert(8, true);
System.out.println(sb);  // "Active: true"
```

**CharSequence parcial**:
```java
StringBuilder sb = new StringBuilder("I  Java");
String palavra = "love";

// insert(offset, CharSequence, start, end)
sb.insert(2, palavra, 0, 4);  // Insere "love"
System.out.println(sb);  // "I love Java"
```

**IndexOutOfBoundsException**:
```java
StringBuilder sb = new StringBuilder("Test");

// ✓ Índices válidos: 0 a sb.length() (inclusivo)
sb.insert(0, "A");    // ✓ OK - início
sb.insert(5, "B");    // ✓ OK - final
sb.insert(3, "C");    // ✓ OK - meio

// ❌ Índice inválido
try {
    sb.insert(-1, "X");  // ❌ offset < 0
} catch (IndexOutOfBoundsException e) {
    System.err.println("Índice negativo");
}

try {
    sb.insert(100, "X");  // ❌ offset > length
} catch (IndexOutOfBoundsException e) {
    System.err.println("Índice além do fim");
}
```

### 3️⃣ delete() - Remover Range de Caracteres

**Assinatura**:

```java
StringBuilder delete(int start, int end)
// Remove caracteres no intervalo [start, end)
// start: índice inicial (inclusivo)
// end: índice final (exclusivo)
```

**Uso básico**:
```java
StringBuilder sb = new StringBuilder("Hello World!");

// delete(int start, int end)
sb.delete(5, 11);  // Remove " World"
System.out.println(sb);  // "Hello!"

// delete do início
sb = new StringBuilder("XXXHello");
sb.delete(0, 3);  // Remove "XXX"
System.out.println(sb);  // "Hello"

// delete até o final
sb = new StringBuilder("HelloXXX");
sb.delete(5, sb.length());  // Remove "XXX"
System.out.println(sb);  // "Hello"
```

**Range semântico [start, end)**:
```java
StringBuilder sb = new StringBuilder("0123456789");

// delete(2, 5) - remove índices 2, 3, 4 (não inclui 5)
sb.delete(2, 5);
System.out.println(sb);  // "0156789"

// Visualização:
// Antes:  0 1 2 3 4 5 6 7 8 9
//              ^     ^
//            start  end
// Depois: 0 1 5 6 7 8 9
```

**Deletar tudo**:
```java
StringBuilder sb = new StringBuilder("Hello World");

// delete(0, length) - remove tudo
sb.delete(0, sb.length());
System.out.println(sb);  // "" (vazio)
System.out.println(sb.length());  // 0

// Equivalente a setLength(0) (mais eficiente)
sb = new StringBuilder("Hello World");
sb.setLength(0);
System.out.println(sb);  // "" (vazio)
```

**IndexOutOfBoundsException**:
```java
StringBuilder sb = new StringBuilder("Hello");

// ✓ Válido
sb.delete(0, 5);        // ✓ Remove tudo
sb = new StringBuilder("Hello");
sb.delete(1, 4);        // ✓ Remove "ell"

// ❌ Inválido
try {
    sb.delete(-1, 2);   // ❌ start < 0
} catch (IndexOutOfBoundsException e) {}

try {
    sb.delete(0, 100);  // ⚠️ OK! end > length é ajustado para length
    // Não lança exceção, ajusta end automaticamente
} catch (IndexOutOfBoundsException e) {}

try {
    sb.delete(3, 2);    // ❌ start > end
} catch (IndexOutOfBoundsException e) {}
```

**Padrão: remover espaços**:
```java
StringBuilder sb = new StringBuilder("  Hello World  ");

// Remover espaços do início
while (sb.length() > 0 && sb.charAt(0) == ' ') {
    sb.delete(0, 1);
}

// Remover espaços do final
while (sb.length() > 0 && sb.charAt(sb.length() - 1) == ' ') {
    sb.delete(sb.length() - 1, sb.length());
}

System.out.println(sb);  // "Hello World"

// Ou use trim/strip + StringBuilder
```

### 4️⃣ replace() - Substituir Range

**Assinatura**:

```java
StringBuilder replace(int start, int end, String str)
// Substitui caracteres no intervalo [start, end) por str
```

**Uso básico**:
```java
StringBuilder sb = new StringBuilder("Hello World");

// replace(start, end, str)
sb.replace(6, 11, "Java");
System.out.println(sb);  // "Hello Java"

// Range pode ser diferente de String substituta
sb = new StringBuilder("I like X");
sb.replace(7, 8, "Java");  // Substitui 1 char por 4
System.out.println(sb);  // "I like Java"

// Substituir múltiplos chars por 1
sb = new StringBuilder("I like XXX");
sb.replace(7, 10, "X");  // Substitui 3 chars por 1
System.out.println(sb);  // "I like X"
```

**Substituir do início ao fim**:
```java
StringBuilder sb = new StringBuilder("Old Text");

// Substituir do início
sb.replace(0, 3, "New");
System.out.println(sb);  // "New Text"

// Substituir até o fim
sb = new StringBuilder("Hello World");
sb.replace(6, sb.length(), "Java");
System.out.println(sb);  // "Hello Java"

// Substituir tudo
sb = new StringBuilder("Old");
sb.replace(0, sb.length(), "New");
System.out.println(sb);  // "New"
```

**vs delete() + insert()**:
```java
StringBuilder sb1 = new StringBuilder("Hello World");
StringBuilder sb2 = new StringBuilder("Hello World");

// replace() - 1 chamada
sb1.replace(6, 11, "Java");

// delete() + insert() - 2 chamadas
sb2.delete(6, 11);
sb2.insert(6, "Java");

// Ambos produzem: "Hello Java"
// replace() é mais conciso e eficiente
```

**IndexOutOfBoundsException**:
```java
StringBuilder sb = new StringBuilder("Hello");

// ✓ Válido
sb.replace(0, 5, "Hi");      // ✓ "Hi"
sb = new StringBuilder("Hello");
sb.replace(0, 2, "J");       // ✓ "Jllo"

// ❌ Inválido
try {
    sb.replace(-1, 2, "X");  // ❌ start < 0
} catch (IndexOutOfBoundsException e) {}

try {
    sb.replace(0, 100, "X"); // ⚠️ OK! end ajustado para length
} catch (IndexOutOfBoundsException e) {}

try {
    sb.replace(3, 2, "X");   // ❌ start > end
} catch (IndexOutOfBoundsException e) {}
```

### 5️⃣ Encadeamento de Métodos

**Todos retornam this**:

```java
StringBuilder sb = new StringBuilder();

// Encadear append()
sb.append("Hello").append(" ").append("World");

// Encadear métodos diferentes
sb = new StringBuilder("Java")
    .append(" Programming")
    .insert(4, " 17")
    .delete(5, 8)
    .replace(5, 16, "Development");

System.out.println(sb);  // "Java Development"
```

**Construção complexa encadeada**:
```java
StringBuilder html = new StringBuilder()
    .append("<div>")
    .append("<h1>").append("Título").append("</h1>")
    .append("<p>").append("Conteúdo").append("</p>")
    .append("</div>");

String resultado = html.toString();
// "<div><h1>Título</h1><p>Conteúdo</p></div>"
```

**Combinar com condicionais**:
```java
StringBuilder sql = new StringBuilder("SELECT * FROM users WHERE ");

boolean primeiro = true;

if (ativo != null) {
    if (!primeiro) sql.append(" AND ");
    sql.append("ativo = ").append(ativo);
    primeiro = false;
}

if (idade != null) {
    if (!primeiro) sql.append(" AND ");
    sql.append("idade > ").append(idade);
    primeiro = false;
}

if (primeiro) {
    sql.append("1=1");  // WHERE vazio
}
```

### 6️⃣ Comparação de Performance

**append() vs String +**:

```java
int n = 1000;

// String + - ~50ms
long inicio = System.nanoTime();
String s = "";
for (int i = 0; i < n; i++) {
    s = s + i;
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuilder.append() - ~100µs
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(i);
}
String resultado = sb.toString();
long tempo2 = (System.nanoTime() - inicio) / 1_000;

System.out.println("String +: " + tempo1 + "ms");       // ~50ms
System.out.println("StringBuilder: " + tempo2 + "µs");  // ~100µs
// 500x mais rápido!
```

**insert() vs StringBuilder manual**:
```java
String original = "Hello World";
String insercao = "Beautiful ";

// StringBuilder.insert() - ~100ns
StringBuilder sb = new StringBuilder(original);
long inicio = System.nanoTime();
sb.insert(6, insercao);
long tempo1 = System.nanoTime() - inicio;

// String substring - ~200ns
inicio = System.nanoTime();
String resultado = original.substring(0, 6) + insercao + original.substring(6);
long tempo2 = System.nanoTime() - inicio;

// insert() é ~2x mais rápido
```

**delete() vs substring**:
```java
String original = "Hello World";

// StringBuilder.delete() - ~80ns
StringBuilder sb = new StringBuilder(original);
long inicio = System.nanoTime();
sb.delete(5, 11);
String r1 = sb.toString();
long tempo1 = System.nanoTime() - inicio;

// String substring - ~100ns
inicio = System.nanoTime();
String r2 = original.substring(0, 5);
long tempo2 = System.nanoTime() - inicio;

// delete() + toString() similar a substring para operação única
// Vantagem em múltiplas operações
```

### 7️⃣ Casos de Uso Práticos

**Construir SQL dinâmico**:

```java
StringBuilder sql = new StringBuilder("SELECT ");
sql.append("id, nome, email ");
sql.append("FROM usuarios ");
sql.append("WHERE ativo = true");

if (minIdade != null) {
    sql.append(" AND idade >= ").append(minIdade);
}

if (cidade != null) {
    sql.append(" AND cidade = '").append(cidade).append("'");
}

sql.append(" ORDER BY nome");

String query = sql.toString();
```

**Formatar relatório**:
```java
StringBuilder relatorio = new StringBuilder();

relatorio.append("=".repeat(60)).append("\n");
relatorio.append("RELATÓRIO DE VENDAS\n");
relatorio.append("=".repeat(60)).append("\n\n");

for (Venda venda : vendas) {
    relatorio.append("Cliente: ").append(venda.getCliente()).append("\n");
    relatorio.append("Valor: R$ ").append(String.format("%.2f", venda.getValor())).append("\n");
    relatorio.append("-".repeat(60)).append("\n");
}

String resultado = relatorio.toString();
```

**Processar template**:
```java
String template = "Olá {nome}, você tem {qtd} mensagens.";
StringBuilder sb = new StringBuilder(template);

// replace() para substituir placeholders
int idx = sb.indexOf("{nome}");
if (idx >= 0) {
    sb.replace(idx, idx + 6, nome);
}

idx = sb.indexOf("{qtd}");
if (idx >= 0) {
    sb.replace(idx, idx + 5, String.valueOf(qtd));
}

String mensagem = sb.toString();
```

**Limpar formatação**:
```java
String texto = "  Hello   World  ";
StringBuilder sb = new StringBuilder(texto);

// Remover espaços extras
for (int i = 0; i < sb.length() - 1; i++) {
    if (sb.charAt(i) == ' ' && sb.charAt(i + 1) == ' ') {
        sb.delete(i, i + 1);
        i--;  // Verificar mesma posição novamente
    }
}

// Trim manual
while (sb.length() > 0 && sb.charAt(0) == ' ') {
    sb.delete(0, 1);
}
while (sb.length() > 0 && sb.charAt(sb.length() - 1) == ' ') {
    sb.delete(sb.length() - 1, sb.length());
}

String resultado = sb.toString();  // "Hello World"
```

### 8️⃣ Métodos Auxiliares

**setLength()**:

```java
StringBuilder sb = new StringBuilder("Hello World");

// Truncar
sb.setLength(5);
System.out.println(sb);  // "Hello"

// Limpar (equivale a delete(0, length))
sb.setLength(0);
System.out.println(sb);  // ""
System.out.println(sb.length());  // 0

// Expandir (preenche com \0)
sb = new StringBuilder("Hi");
sb.setLength(5);
System.out.println(sb.length());  // 5
System.out.println(sb.charAt(2));  // '\0'
```

**substring() - não modifica**:
```java
StringBuilder sb = new StringBuilder("Hello World");

// substring() retorna String, NÃO modifica StringBuilder
String sub = sb.substring(6, 11);
System.out.println(sub);  // "World"
System.out.println(sb);   // "Hello World" (não modificado)

// delete() modifica
sb.delete(6, 11);
System.out.println(sb);   // "Hello " (modificado)
```

### 9️⃣ Boas Práticas

**Encadear para legibilidade**:

```java
// ✓ Encadeamento
String html = new StringBuilder()
    .append("<div>")
    .append("<p>").append(texto).append("</p>")
    .append("</div>")
    .toString();

// vs linhas separadas (menos conciso)
StringBuilder sb = new StringBuilder();
sb.append("<div>");
sb.append("<p>").append(texto).append("</p>");
sb.append("</div>");
String html = sb.toString();
```

**Não concatenar ao append()**:
```java
// ⚠️ Evitar - cria String temporária
sb.append("Total: " + total);

// ✓ Melhor - append direto
sb.append("Total: ").append(total);
```

**Validar índices quando dinâmicos**:
```java
// ✓ Validar antes de insert/delete/replace
int pos = calcularPosicao();
if (pos >= 0 && pos <= sb.length()) {
    sb.insert(pos, texto);
} else {
    // Tratar erro
}
```

**Reutilizar StringBuilder**:
```java
StringBuilder sb = new StringBuilder(100);

for (Grupo grupo : grupos) {
    sb.setLength(0);  // Limpar
    
    for (Item item : grupo.getItens()) {
        sb.append(item).append(", ");
    }
    
    String resultado = sb.toString();
    processar(resultado);
}
```

### 🔟 Comparação Resumida

**Tabela de métodos**:

| Método | Ação | Retorno | Performance |
|--------|------|---------|-------------|
| **append(x)** | Adiciona x ao final | this | O(1) amortizado |
| **insert(i, x)** | Insere x no índice i | this | O(n) |
| **delete(s, e)** | Remove [s, e) | this | O(n) |
| **replace(s, e, x)** | Substitui [s, e) por x | this | O(n) |
| **setLength(n)** | Define tamanho n | void | O(1) |
| **substring(s, e)** | Extrai [s, e) | String | O(n) |

**Complexidade**:
- **append()**: O(1) amortizado (pode realocar array ocasionalmente)
- **insert()**: O(n) (precisa deslocar caracteres)
- **delete()**: O(n) (precisa deslocar caracteres)
- **replace()**: O(n) (delete + insert)

## 🎯 Aplicabilidade

**1. append() - Construção Sequencial**:
```java
sb.append("A").append("B").append("C");
```

**2. insert() - Inserir no Meio**:
```java
sb.insert(6, "Beautiful ");
```

**3. delete() - Remover Range**:
```java
sb.delete(5, 11);
```

**4. replace() - Substituir Range**:
```java
sb.replace(6, 11, "Java");
```

**5. Encadeamento**:
```java
sb.append(...).insert(...).delete(...);
```

## ⚠️ Armadilhas Comuns

**1. Índices Fora de Range**:
```java
sb.insert(-1, "X");  // ❌ IndexOutOfBoundsException
sb.delete(10, 5);    // ❌ start > end
```

**2. Concatenar ao append()**:
```java
sb.append("A" + b);  // ⚠️ Cria String temporária
sb.append("A").append(b);  // ✓
```

**3. Esquecer toString()**:
```java
return sb;  // ❌ Retorna StringBuilder
return sb.toString();  // ✓ Retorna String
```

**4. Modificar Durante Iteração**:
```java
for (int i = 0; i < sb.length(); i++) {
    sb.delete(i, i+1);  // ⚠️ length() muda
}
```

**5. Confundir end (exclusivo)**:
```java
sb.delete(2, 5);  // Remove índices 2, 3, 4 (não 5)
```

## ✅ Boas Práticas

**1. Encadear Métodos**:
```java
sb.append("A").append("B").append("C");
```

**2. append() Direto (sem concatenação)**:
```java
sb.append("Total: ").append(valor);
```

**3. Validar Índices Dinâmicos**:
```java
if (pos >= 0 && pos <= sb.length()) {
    sb.insert(pos, texto);
}
```

**4. Converter para String ao Finalizar**:
```java
String resultado = sb.toString();
```

**5. Reutilizar com setLength(0)**:
```java
sb.setLength(0);  // Limpar para reusar
```

## 📚 Resumo Executivo

**Métodos principais** de StringBuilder.

**append() - adicionar ao final**:
```java
sb.append("Hello").append(123).append(true);
// Aceita String, int, double, boolean, char, Object, etc.
```

**insert() - inserir em posição**:
```java
sb.insert(6, "Beautiful ");
// Insere no índice especificado
```

**delete() - remover range**:
```java
sb.delete(5, 11);
// Remove [start, end) - end exclusivo
```

**replace() - substituir range**:
```java
sb.replace(6, 11, "Java");
// Substitui [start, end) por String
```

**Encadeamento**:
```java
sb.append("A").insert(0, "B").delete(1, 2).replace(0, 1, "C");
// Todos retornam this
```

**Performance**:
```java
append():  O(1) amortizado  ✓ Muito rápido
insert():  O(n)             ⚠️ Deslocamento
delete():  O(n)             ⚠️ Deslocamento
replace(): O(n)             ⚠️ Delete + insert
```

**Uso típico**:
```java
StringBuilder sb = new StringBuilder();
sb.append("SELECT * FROM users WHERE ");
if (ativo) sb.append("ativo = true AND ");
sb.append("1=1");
String sql = sb.toString();
```

**Recomendação**: Use **append()** para construção sequencial (mais rápido). Use **insert/delete/replace** para modificações específicas. Encadeie métodos para código conciso. Sempre **toString()** ao finalizar.