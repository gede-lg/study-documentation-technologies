# Operador + para Concatenação

## 🎯 Introdução e Definição

O **operador +** é a forma mais comum e idiomática de **concatenar (unir) Strings** em Java. Quando usado com Strings, une os operandos em uma **nova String**.

**Conceito central**: O operador + é **sobrecarregado** em Java - serve tanto para **adição aritmética** (com números) quanto para **concatenação de Strings**. Quando pelo menos um operando é String, realiza concatenação.

**Exemplo fundamental**:
```java
// Concatenação de Strings
String s1 = "Hello";
String s2 = "World";
String resultado = s1 + " " + s2;
System.out.println(resultado);  // "Hello World"

// vs adição numérica
int a = 5;
int b = 3;
int soma = a + b;
System.out.println(soma);  // 8

// Misto: String + número = concatenação
String msg = "Total: " + 42;
System.out.println(msg);  // "Total: 42"
```

**Características principais**:
- **Sobrecarga de operador**: + funciona diferente com Strings vs números
- **Conversão automática**: tipos primitivos e objetos são convertidos para String
- **Null-safe**: null é convertido para "null" (não lança NPE)
- **Otimizado**: Java 9+ usa invokedynamic + StringConcatFactory (muito eficiente)

## 📋 Fundamentos Teóricos

### 1️⃣ Concatenação Básica com +

**Une Strings em uma nova String**:

```java
// Duas Strings
String s1 = "Java";
String s2 = "Script";
String resultado = s1 + s2;
System.out.println(resultado);  // "JavaScript"

// Múltiplas Strings
String completo = "Hello" + " " + "World" + "!";
System.out.println(completo);  // "Hello World!"

// Variáveis e literais
String nome = "João";
String saudacao = "Olá, " + nome + "!";
System.out.println(saudacao);  // "Olá, João!"
```

**Diferença com adição numérica**:
```java
// Números - adição aritmética
int resultado1 = 5 + 3;
System.out.println(resultado1);  // 8

// Strings - concatenação
String resultado2 = "5" + "3";
System.out.println(resultado2);  // "53"

// String + número - concatenação (String "ganha")
String resultado3 = "Total: " + 5 + 3;
System.out.println(resultado3);  // "Total: 53" (não é "Total: 8"!)

// Parênteses para forçar adição primeiro
String resultado4 = "Total: " + (5 + 3);
System.out.println(resultado4);  // "Total: 8"
```

### 2️⃣ Conversão Automática de Tipos

**Primitivos são convertidos automaticamente**:

```java
// int
String s1 = "Number: " + 42;
// "Number: 42"

// double
String s2 = "Pi: " + 3.14159;
// "Pi: 3.14159"

// boolean
String s3 = "Active: " + true;
// "Active: true"

// char
String s4 = "Letter: " + 'A';
// "Letter: A"

// long
String s5 = "Big: " + 9999999999L;
// "Big: 9999999999"
```

**Objetos usam toString()**:
```java
// Object - chama toString()
class Pessoa {
    String nome;
    Pessoa(String nome) { this.nome = nome; }
    
    @Override
    public String toString() {
        return "Pessoa[" + nome + "]";
    }
}

Pessoa p = new Pessoa("João");
String s = "Info: " + p;
System.out.println(s);  // "Info: Pessoa[João]"

// Sem toString() customizado
Object obj = new Object();
String s2 = "Objeto: " + obj;
// "Objeto: java.lang.Object@15db9742" (hashcode)
```

**Arrays NÃO têm conversão útil**:
```java
int[] numeros = {1, 2, 3};

// ❌ Não funciona como esperado
String s = "Array: " + numeros;
System.out.println(s);  // "Array: [I@15db9742" (referência)

// ✓ Use Arrays.toString()
String s2 = "Array: " + Arrays.toString(numeros);
System.out.println(s2);  // "Array: [1, 2, 3]"
```

### 3️⃣ Comportamento com null

**null é convertido para "null"**:

```java
String s = null;

// Concatenação com null
String resultado = "Value: " + s;
System.out.println(resultado);  // "Value: null"

// Não lança NullPointerException!
// Diferente de concat() que lança NPE

// null em ambos os lados
String s2 = null;
String resultado2 = s + s2;
System.out.println(resultado2);  // "nullnull"
```

**vs concat() que lança NPE**:
```java
String s1 = "Hello";
String s2 = null;

// + trata null
String r1 = s1 + s2;
System.out.println(r1);  // "Hellonull" ✓

// concat() lança NPE
try {
    String r2 = s1.concat(s2);  // ❌ NullPointerException
} catch (NullPointerException e) {
    System.err.println("concat() não aceita null");
}
```

**Null safety em expressões**:
```java
String nome = null;
int idade = 30;

// Funciona sem problema
String info = "Nome: " + nome + ", Idade: " + idade;
System.out.println(info);  // "Nome: null, Idade: 30"

// Verificar null se quiser evitar "null" na String
String info2 = "Nome: " + (nome != null ? nome : "N/A") + ", Idade: " + idade;
System.out.println(info2);  // "Nome: N/A, Idade: 30"
```

### 4️⃣ Ordem de Avaliação e Precedência

**Avaliação da esquerda para a direita**:

```java
// Números primeiro, depois String
String s1 = 5 + 3 + " resultado";
System.out.println(s1);  // "8 resultado" (5+3=8, depois +"")

// String primeiro, resto vira concatenação
String s2 = "resultado " + 5 + 3;
System.out.println(s2);  // "resultado 53" (não é 8!)

// Parênteses para controlar
String s3 = "resultado " + (5 + 3);
System.out.println(s3);  // "resultado 8"
```

**Exemplos complexos**:
```java
// Teste 1
System.out.println(1 + 2 + "3");  // "33" (1+2=3, 3+"3"="33")

// Teste 2
System.out.println("1" + 2 + 3);  // "123" ("1"+2="12", "12"+3="123")

// Teste 3
System.out.println("1" + (2 + 3));  // "15" (2+3=5, "1"+5="15")

// Teste 4
System.out.println(1 + 2 + "3" + 4 + 5);  // "3345"
// 1+2=3, 3+"3"="33", "33"+4="334", "334"+5="3345"
```

**Precedência de operadores**:
```java
// * e / têm precedência sobre +
String s1 = "Result: " + 5 + 3 * 2;
System.out.println(s1);  // "Result: 56" (3*2=6, ""+5="5", "5"+6="56")

// Parênteses para clareza
String s2 = "Result: " + (5 + 3 * 2);
System.out.println(s2);  // "Result: 11" (3*2=6, 5+6=11)
```

### 5️⃣ Implementação Interna e Otimizações

**Java 8 e anterior - StringBuilder**:

```java
// Código fonte (Java 8)
String s = "Hello" + " " + "World";

// Compilado para (aproximadamente):
String s = new StringBuilder()
    .append("Hello")
    .append(" ")
    .append("World")
    .toString();

// Eficiente para concatenações em sequência
```

**Java 9+ - invokedynamic + StringConcatFactory**:
```java
// Código fonte (Java 9+)
String s = "Hello" + " " + "World";

// Compilado usa invokedynamic com StringConcatFactory
// Muito mais eficiente - JVM escolhe melhor estratégia em runtime
// Pode usar:
// - StringBuilder
// - Arrays de char
// - MethodHandles
// - Outras otimizações

// ~30% mais rápido que Java 8
```

**Constantes em tempo de compilação**:
```java
// Literais concatenadas em compile-time
String s1 = "Hello" + " " + "World";
// Compilador otimiza para:
String s1 = "Hello World";

// Variáveis final também podem ser otimizadas
final String A = "Hello";
final String B = "World";
String s2 = A + " " + B;
// Pode ser otimizado para "Hello World" pelo compilador

// Variáveis não-final - runtime concatenation
String a = "Hello";
String b = "World";
String s3 = a + " " + b;
// Usa StringBuilder/StringConcatFactory em runtime
```

### 6️⃣ Performance: + em Loops

**❌ NUNCA usar + em loops**:

```java
// ❌ PÉSSIMO - quadrático O(n²)
String resultado = "";
for (int i = 0; i < 10000; i++) {
    resultado = resultado + i;  // Cria nova String a cada iteração
}

// Cada iteração:
// - Cria StringBuilder
// - Copia resultado anterior
// - Adiciona i
// - Converte para String
// Total: ~100ms para 10.000 iterações
```

**✓ Use StringBuilder em loops**:
```java
// ✓ BOM - linear O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String resultado = sb.toString();

// Muito mais eficiente
// Total: ~2ms para 10.000 iterações (50x mais rápido!)
```

**Benchmark comparativo**:
```java
// + em loop - ~100ms (10.000 iterações)
long inicio = System.nanoTime();
String s = "";
for (int i = 0; i < 10000; i++) {
    s = s + i;
}
long tempo1 = System.nanoTime() - inicio;
System.out.println("+ em loop: " + tempo1 / 1_000_000 + "ms");

// StringBuilder - ~2ms
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String resultado = sb.toString();
long tempo2 = System.nanoTime() - inicio;
System.out.println("StringBuilder: " + tempo2 / 1_000_000 + "ms");

// StringBuilder é ~50x mais rápido!
```

### 7️⃣ Concatenação em Linha vs Múltiplas Linhas

**Uma expressão - otimizado**:

```java
// ✓ Tudo em uma expressão - otimizado
String s = "A" + "B" + "C" + "D" + "E";
// Java 9+ usa StringConcatFactory - eficiente

// Compilador vê toda a expressão e otimiza
// ~50 nanossegundos
```

**Múltiplas atribuições - não otimizado**:
```java
// ⚠️ Múltiplas atribuições - menos eficiente
String s = "A";
s = s + "B";
s = s + "C";
s = s + "D";
s = s + "E";

// Cada linha cria nova String
// ~200 nanossegundos (4x mais lento)

// Preferir uma única expressão ou StringBuilder
```

### 8️⃣ += Operador Composto

**+= para concatenar e atribuir**:

```java
String s = "Hello";

// += equivale a: s = s + "..."
s += " World";
System.out.println(s);  // "Hello World"

s += "!";
System.out.println(s);  // "Hello World!"

// Múltiplas adições
s += " How";
s += " are";
s += " you";
System.out.println(s);  // "Hello World! How are you"
```

**Performance de +=**:
```java
// += em sequência - cada linha cria nova String
String s = "A";
s += "B";  // nova String "AB"
s += "C";  // nova String "ABC"
s += "D";  // nova String "ABCD"

// ⚠️ Menos eficiente que uma única expressão
// Melhor:
String s2 = "A" + "B" + "C" + "D";  // Otimizado

// ❌ NUNCA em loop
for (int i = 0; i < 1000; i++) {
    s += i;  // Muito ineficiente
}

// ✓ Use StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
```

### 9️⃣ Casos de Uso Práticos

**Construir mensagens**:

```java
String nome = "João";
int idade = 30;
String cidade = "São Paulo";

String perfil = "Nome: " + nome + ", Idade: " + idade + ", Cidade: " + cidade;
System.out.println(perfil);
// "Nome: João, Idade: 30, Cidade: São Paulo"
```

**Concatenar com quebras de linha**:
```java
String relatorio = "=== RELATÓRIO ===" + "\n" +
                   "Total: " + 100 + "\n" +
                   "Média: " + 85.5 + "\n" +
                   "Status: Aprovado";
System.out.println(relatorio);
// === RELATÓRIO ===
// Total: 100
// Média: 85.5
// Status: Aprovado
```

**Construir URLs**:
```java
String baseUrl = "https://api.example.com";
String endpoint = "/users";
String userId = "123";

String url = baseUrl + endpoint + "/" + userId;
System.out.println(url);  // "https://api.example.com/users/123"

// Com query parameters
String url2 = baseUrl + endpoint + "?id=" + userId + "&active=true";
// "https://api.example.com/users?id=123&active=true"
```

**Formatar valores**:
```java
double preco = 19.99;
int quantidade = 3;
double total = preco * quantidade;

String resumo = quantidade + " itens × R$ " + preco + " = R$ " + total;
System.out.println(resumo);  // "3 itens × R$ 19.99 = R$ 59.97"
```

**Construir JSON simples**:
```java
String nome = "João";
int idade = 30;

String json = "{" +
    "\"nome\": \"" + nome + "\", " +
    "\"idade\": " + idade +
"}";
System.out.println(json);  // {"nome": "João", "idade": 30}

// Para JSON real, use biblioteca (Jackson, Gson)
```

### 🔟 Comparação com Alternativas

**+ vs concat()**:

```java
String s1 = "Hello";
String s2 = "World";

// Operador +
String r1 = s1 + " " + s2;  // "Hello World"

// concat()
String r2 = s1.concat(" ").concat(s2);  // "Hello World"

// + é mais legível e idiomático
// + trata null, concat() lança NPE
// Performance similar para 2-3 Strings
```

**+ vs StringBuilder**:
```java
// + para concatenações simples
String s1 = "A" + "B" + "C";  // Simples e legível

// StringBuilder para múltiplas ou loops
StringBuilder sb = new StringBuilder();
sb.append("A").append("B").append("C");
String s2 = sb.toString();

// + é preferível para código simples
// StringBuilder para performance crítica
```

**+ vs String.format()**:
```java
String nome = "João";
int idade = 30;

// +
String s1 = "Nome: " + nome + ", Idade: " + idade;

// String.format()
String s2 = String.format("Nome: %s, Idade: %d", nome, idade);

// + mais simples
// format() melhor para formatação complexa (decimais, padding, etc.)
```

**+ vs String.join()**:
```java
String[] partes = {"A", "B", "C"};

// + em loop (❌ ineficiente)
String s1 = "";
for (String p : partes) {
    s1 = s1 + p;
}

// String.join() (✓ direto)
String s2 = String.join("", partes);  // "ABC"

// join() é melhor para unir arrays/listas
```

## 🎯 Aplicabilidade

**1. Concatenação Simples de Strings**:
```java
String completo = nome + " " + sobrenome;
```

**2. Construir Mensagens**:
```java
String msg = "Erro na linha " + linha + ": " + descricao;
```

**3. Concatenar com Números/Primitivos**:
```java
String info = "Total: " + total + " itens";
```

**4. URLs e Paths**:
```java
String url = baseUrl + "/" + endpoint + "?id=" + id;
```

**5. Expressões Curtas e Legíveis**:
```java
String s = "(" + x + ", " + y + ")";
```

## ⚠️ Armadilhas Comuns

**1. Ordem de Avaliação**:
```java
"Total: " + 5 + 3;  // "Total: 53" (não "Total: 8")
"Total: " + (5 + 3);  // "Total: 8" ✓
```

**2. Usar em Loops**:
```java
for (int i = 0; i < 1000; i++) {
    s = s + i;  // ❌ Muito ineficiente
}
// Use StringBuilder ✓
```

**3. Arrays sem Arrays.toString()**:
```java
int[] arr = {1, 2, 3};
"Array: " + arr;  // "Array: [I@15db9742" ❌
"Array: " + Arrays.toString(arr);  // "Array: [1, 2, 3]" ✓
```

**4. Múltiplas Atribuições**:
```java
String s = "A";
s = s + "B";
s = s + "C";
// ⚠️ Menos eficiente que: "A" + "B" + "C"
```

**5. null Virar "null"**:
```java
String nome = null;
"Nome: " + nome;  // "Nome: null"
// Verificar null se não quiser literal "null"
```

## ✅ Boas Práticas

**1. Use + para Concatenações Simples**:
```java
String s = a + " " + b;  // Claro e idiomático
```

**2. Parênteses para Clareza**:
```java
"Total: " + (a + b);  // Deixa intenção clara
```

**3. StringBuilder para Loops**:
```java
StringBuilder sb = new StringBuilder();
for (...) {
    sb.append(...);
}
```

**4. Verificar null se Necessário**:
```java
String s = "Nome: " + (nome != null ? nome : "N/A");
```

**5. Uma Expressão Quando Possível**:
```java
// ✓ Preferir
String s = "A" + "B" + "C";

// Ao invés de
String s = "A";
s += "B";
s += "C";
```

## 📚 Resumo Executivo

**Operador +** concatena Strings.

**Uso básico**:
```java
"Hello" + " " + "World";  // "Hello World"
"Total: " + 42;           // "Total: 42"
s1 + s2 + s3;             // Múltiplas Strings
```

**Conversão automática**:
```java
"Value: " + 42;     // int → String
"Pi: " + 3.14;      // double → String
"Flag: " + true;    // boolean → String
"Obj: " + objeto;   // Object.toString()
```

**null vira "null"**:
```java
"Value: " + null;  // "Value: null" (não NPE)
```

**Ordem de avaliação**:
```java
5 + 3 + " total";        // "8 total"
"total " + 5 + 3;        // "total 53"
"total " + (5 + 3);      // "total 8"
```

**Performance**:
```java
// ✓ OK para poucas Strings
"A" + "B" + "C";  // ~50ns

// ❌ NUNCA em loops
for (...) { s = s + i; }  // O(n²)

// ✓ Use StringBuilder
StringBuilder sb = new StringBuilder();
for (...) { sb.append(i); }  // O(n)
```

**Otimizações**:
- Java 8: usa StringBuilder
- Java 9+: usa invokedynamic + StringConcatFactory (~30% mais rápido)
- Literais concatenadas em compile-time

**Comparações**:
```java
// + vs concat(): + mais idiomático, trata null
// + vs StringBuilder: + para simples, StringBuilder para loops
// + vs format(): + para simples, format() para formatação complexa
```

**Recomendação**: Use **+** para concatenações simples e legíveis. Use **StringBuilder** em loops e situações críticas de performance.