# Classe Matcher

## 🎯 Introdução e Definição

**Matcher é a classe que executa operações** de busca, validação e substituição usando **expressões regulares**. Criado a partir de um **Pattern compilado**, o Matcher **mantém estado** da busca e permite múltiplas operações sobre o texto: encontrar ocorrências, verificar correspondência completa, extrair grupos, substituir conteúdo.

**Conceito central**: Matcher é um **motor de busca stateful** (com estado). Ele mantém **posição atual** no texto e **resultado da última busca**. Métodos como find() **avançam a posição**, enquanto group() **retorna o que foi encontrado**. Matcher **NÃO é thread-safe** e deve ser usado por uma única thread.

**Exemplo fundamental**:
```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Tenho 25 anos e 180cm");

// find() - buscar próxima ocorrência
while (matcher.find()) {
    System.out.println("Encontrado: " + matcher.group());
    System.out.println("Posição: " + matcher.start() + "-" + matcher.end());
}
// Output:
// Encontrado: 25
// Posição: 6-8
// Encontrado: 180
// Posição: 17-20
```

**Características principais**:
- **Stateful**: mantém posição e resultado da busca
- **find()**: busca próxima ocorrência no texto
- **matches()**: verifica se texto inteiro corresponde
- **group()**: retorna texto encontrado
- **Substituição**: replaceAll(), replaceFirst()

## 📋 Fundamentos Teóricos

### 1️⃣ Criando Matcher

**Pattern.matcher() - criar Matcher**:

```java
Pattern pattern = Pattern.compile("\\d+");

// Criar matcher para texto
Matcher matcher = pattern.matcher("Idade: 25");

// Matcher é ligado ao texto
// Pronto para executar buscas
```

**Matcher está ligado ao texto e padrão**:
```java
Pattern pattern = Pattern.compile("java");
Matcher matcher = pattern.matcher("Java é legal");

// Matcher conhece:
// - O Pattern (java)
// - O texto (Java é legal)
// - Posição atual (início)
```

**reset() - reutilizar com novo texto**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10");

matcher.find();
System.out.println(matcher.group());  // "10"

// Reusar com novo texto
matcher.reset("20");
matcher.find();
System.out.println(matcher.group());  // "20"

// Ou reset sem novo texto (volta ao início)
matcher.reset();
matcher.find();
System.out.println(matcher.group());  // "20" (mesmo texto)
```

### 2️⃣ Métodos de Busca

**matches() - texto inteiro deve corresponder**:

```java
Pattern pattern = Pattern.compile("\\d+");

Matcher m1 = pattern.matcher("123");
System.out.println(m1.matches());  // true (texto inteiro é dígitos)

Matcher m2 = pattern.matcher("123abc");
System.out.println(m2.matches());  // false (tem letras)

// matches() é equivalente a ^regex$
Pattern pattern2 = Pattern.compile("^\\d+$");
Matcher m3 = pattern2.matcher("123");
System.out.println(m3.find());  // true (mesmo resultado)
```

**find() - buscar próxima ocorrência**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Tenho 25 anos");

// Primeira chamada - encontra "25"
boolean encontrou = matcher.find();
System.out.println(encontrou);  // true
System.out.println(matcher.group());  // "25"

// Segunda chamada - não há mais ocorrências
encontrou = matcher.find();
System.out.println(encontrou);  // false
```

**find() com múltiplas ocorrências**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

while (matcher.find()) {
    System.out.println(matcher.group());
}
// Output:
// 10
// 20
// 30
```

**find(int start) - buscar a partir de posição**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

// Buscar a partir do índice 5
boolean encontrou = matcher.find(5);
System.out.println(encontrou);  // true
System.out.println(matcher.group());  // "20"
```

**lookingAt() - início do texto**:
```java
Pattern pattern = Pattern.compile("\\d+");

Matcher m1 = pattern.matcher("123abc");
System.out.println(m1.lookingAt());  // true (começa com dígitos)

Matcher m2 = pattern.matcher("abc123");
System.out.println(m2.lookingAt());  // false (não começa com dígitos)

// lookingAt() é equivalente a ^regex
```

### 3️⃣ Métodos de Extração

**group() - texto encontrado**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Idade: 25");

if (matcher.find()) {
    String numero = matcher.group();
    System.out.println(numero);  // "25"
}
```

**group(int) - grupo de captura**:
```java
// Padrão com grupos (parênteses)
Pattern pattern = Pattern.compile("(\\d{3})-(\\d{4})");
Matcher matcher = pattern.matcher("Tel: 123-4567");

if (matcher.find()) {
    System.out.println(matcher.group());   // "123-4567" (tudo)
    System.out.println(matcher.group(0));  // "123-4567" (mesmo que group())
    System.out.println(matcher.group(1));  // "123" (primeiro grupo)
    System.out.println(matcher.group(2));  // "4567" (segundo grupo)
}
```

**Grupos nomeados**:
```java
// Padrão com grupos nomeados (?<nome>...)
Pattern pattern = Pattern.compile("(?<ddd>\\d{3})-(?<numero>\\d{4})");
Matcher matcher = pattern.matcher("123-4567");

if (matcher.find()) {
    System.out.println(matcher.group("ddd"));     // "123"
    System.out.println(matcher.group("numero"));  // "4567"
}
```

**groupCount() - número de grupos**:
```java
Pattern pattern = Pattern.compile("(\\d{3})-(\\d{4})");
Matcher matcher = pattern.matcher("123-4567");

System.out.println(matcher.groupCount());  // 2 (dois grupos)

if (matcher.find()) {
    for (int i = 1; i <= matcher.groupCount(); i++) {
        System.out.println("Grupo " + i + ": " + matcher.group(i));
    }
}
// Output:
// Grupo 1: 123
// Grupo 2: 4567
```

### 4️⃣ Métodos de Posição

**start() e end() - posição da ocorrência**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Tenho 25 anos");

if (matcher.find()) {
    System.out.println("Encontrado: " + matcher.group());  // "25"
    System.out.println("Início: " + matcher.start());      // 6
    System.out.println("Fim: " + matcher.end());           // 8
    
    // Extrair manualmente
    String texto = "Tenho 25 anos";
    String numero = texto.substring(matcher.start(), matcher.end());
    System.out.println(numero);  // "25"
}
```

**start(int) e end(int) - posição de grupo**:
```java
Pattern pattern = Pattern.compile("(\\d{3})-(\\d{4})");
Matcher matcher = pattern.matcher("Tel: 123-4567");

if (matcher.find()) {
    // Grupo 0 (tudo)
    System.out.println("Grupo 0: " + matcher.start() + "-" + matcher.end());  // 5-13
    
    // Grupo 1
    System.out.println("Grupo 1: " + matcher.start(1) + "-" + matcher.end(1));  // 5-8
    
    // Grupo 2
    System.out.println("Grupo 2: " + matcher.start(2) + "-" + matcher.end(2));  // 9-13
}
```

**region() - definir região de busca**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("0123456789");

// Buscar apenas entre índices 3 e 7
matcher.region(3, 7);

while (matcher.find()) {
    System.out.println(matcher.group());
}
// Output: 3456 (apenas dentro da região)
```

### 5️⃣ Métodos de Substituição

**replaceAll() - substituir todas**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Tenho 25 anos e 180cm");

String resultado = matcher.replaceAll("XX");
System.out.println(resultado);  // "Tenho XX anos e XXcm"

// String.replaceAll() usa Pattern/Matcher internamente
String resultado2 = "Tenho 25 anos".replaceAll("\\d+", "XX");
// Equivalente
```

**replaceFirst() - substituir primeira**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

String resultado = matcher.replaceFirst("XX");
System.out.println(resultado);  // "XX 20 30"
```

**Substituição com referências a grupos**:
```java
Pattern pattern = Pattern.compile("(\\d{3})-(\\d{4})");
Matcher matcher = pattern.matcher("Tel: 123-4567");

// $1, $2 referenciam grupos
String resultado = matcher.replaceAll("($1) $2");
System.out.println(resultado);  // "Tel: (123) 4567"
```

**appendReplacement() e appendTail() - substituição customizada**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

StringBuffer sb = new StringBuffer();

while (matcher.find()) {
    int numero = Integer.parseInt(matcher.group());
    int dobro = numero * 2;
    
    // Substituir por dobro
    matcher.appendReplacement(sb, String.valueOf(dobro));
}

matcher.appendTail(sb);  // Adicionar resto do texto

System.out.println(sb);  // "20 40 60"
```

**replaceAll com função (Java 9+)**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

String resultado = matcher.replaceAll(match -> {
    int numero = Integer.parseInt(match.group());
    return String.valueOf(numero * 2);
});

System.out.println(resultado);  // "20 40 60"
```

### 6️⃣ Estado do Matcher

**Matcher mantém estado**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

// Estado inicial: posição 0, nenhuma busca
System.out.println("hitEnd: " + matcher.hitEnd());  // false

// Primeira busca
matcher.find();  // Encontra "10"
System.out.println("group: " + matcher.group());    // "10"
System.out.println("start: " + matcher.start());    // 0

// Segunda busca
matcher.find();  // Encontra "20"
System.out.println("group: " + matcher.group());    // "20"
System.out.println("start: " + matcher.start());    // 3

// Terceira busca
matcher.find();  // Encontra "30"
System.out.println("group: " + matcher.group());    // "30"

// Quarta busca - sem mais ocorrências
boolean encontrou = matcher.find();
System.out.println(encontrou);  // false
System.out.println("hitEnd: " + matcher.hitEnd());  // true
```

**reset() - resetar estado**:
```java
Matcher matcher = pattern.matcher("10 20");

matcher.find();
System.out.println(matcher.group());  // "10"

// Reset - volta ao início
matcher.reset();

matcher.find();
System.out.println(matcher.group());  // "10" (novamente)
```

### 7️⃣ Métodos de Estado

**hitEnd() - alcançou fim do texto**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("123");

matcher.find();
System.out.println(matcher.hitEnd());  // true (busca consumiu até o fim)

matcher = pattern.matcher("123abc");
matcher.find();
System.out.println(matcher.hitEnd());  // false (ainda há "abc")
```

**requireEnd() - match requer fim de texto**:
```java
Pattern pattern = Pattern.compile("\\d+$");  // $ requer fim
Matcher matcher = pattern.matcher("abc123");

matcher.find();
System.out.println(matcher.requireEnd());  // true ($ requer fim)
```

**pattern() - retornar Pattern associado**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("123");

Pattern p = matcher.pattern();
System.out.println(p.pattern());  // "\d+"
```

### 8️⃣ Casos de Uso Práticos

**Validar formato**:

```java
public static boolean validarEmail(String email) {
    Pattern pattern = Pattern.compile(
        "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
        Pattern.CASE_INSENSITIVE
    );
    Matcher matcher = pattern.matcher(email);
    return matcher.matches();
}

System.out.println(validarEmail("user@example.com"));  // true
System.out.println(validarEmail("invalid"));            // false
```

**Extrair todas ocorrências**:
```java
public static List<String> extrairNumeros(String texto) {
    List<String> numeros = new ArrayList<>();
    Pattern pattern = Pattern.compile("\\d+");
    Matcher matcher = pattern.matcher(texto);
    
    while (matcher.find()) {
        numeros.add(matcher.group());
    }
    
    return numeros;
}

List<String> nums = extrairNumeros("10 20 30");
System.out.println(nums);  // [10, 20, 30]
```

**Mascarar dados sensíveis**:
```java
public static String mascarar CPF(String texto) {
    Pattern pattern = Pattern.compile("(\\d{3})\\.(\\d{3})\\.(\\d{3})-(\\d{2})");
    Matcher matcher = pattern.matcher(texto);
    
    return matcher.replaceAll("$1.***.***-**");
}

String texto = "CPF: 123.456.789-00";
System.out.println(mascararCPF(texto));  // "CPF: 123.***.***-**"
```

**Converter formato**:
```java
public static String converterData(String data) {
    // De DD/MM/YYYY para YYYY-MM-DD
    Pattern pattern = Pattern.compile("(\\d{2})/(\\d{2})/(\\d{4})");
    Matcher matcher = pattern.matcher(data);
    
    return matcher.replaceAll("$3-$2-$1");
}

System.out.println(converterData("25/12/2024"));  // "2024-12-25"
```

### 9️⃣ Performance

**Reutilizar Matcher**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("");

// Reutilizar com reset()
for (String texto : textos) {
    matcher.reset(texto);  // ✓ Reutiliza Matcher
    
    if (matcher.find()) {
        System.out.println(matcher.group());
    }
}

// vs criar novo Matcher a cada vez
for (String texto : textos) {
    Matcher m = pattern.matcher(texto);  // ⚠️ Menos eficiente
    if (m.find()) {
        System.out.println(m.group());
    }
}
```

**Evitar compilar Pattern repetidamente**:
```java
// ❌ Ineficiente
for (String texto : textos) {
    Pattern pattern = Pattern.compile("\\d+");  // Recompila!
    Matcher matcher = pattern.matcher(texto);
    // ...
}

// ✓ Eficiente
Pattern pattern = Pattern.compile("\\d+");  // Compila uma vez
for (String texto : textos) {
    Matcher matcher = pattern.matcher(texto);
    // ...
}
```

### 🔟 Thread-Safety

**Matcher NÃO é thread-safe**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("123");

// ❌ Compartilhar Matcher entre threads
new Thread(() -> {
    matcher.reset("456");  // ❌ Race condition!
    matcher.find();
    System.out.println(matcher.group());
}).start();

new Thread(() -> {
    matcher.reset("789");  // ❌ Race condition!
    matcher.find();
    System.out.println(matcher.group());
}).start();

// ✓ Cada thread cria seu Matcher
new Thread(() -> {
    Matcher m = pattern.matcher("456");  // ✓ Próprio Matcher
    m.find();
    System.out.println(m.group());
}).start();
```

## 🎯 Aplicabilidade

**1. Validar Texto Completo**:
```java
matcher.matches()
```

**2. Buscar Ocorrências**:
```java
while (matcher.find()) { ... }
```

**3. Extrair Grupos**:
```java
matcher.group(1)
```

**4. Substituir**:
```java
matcher.replaceAll("novo")
```

**5. Obter Posições**:
```java
matcher.start(), matcher.end()
```

## ⚠️ Armadilhas Comuns

**1. Chamar group() sem find()**:
```java
matcher.group();  // ❌ IllegalStateException
```

**2. Compartilhar entre Threads**:
```java
Matcher m = ...;  // ❌ Não thread-safe
```

**3. Confundir matches() e find()**:
```java
matcher.matches();  // Texto INTEIRO
matcher.find();     // Busca PARCIAL
```

**4. Esquecer reset()**:
```java
matcher.find();  // Primeira busca
matcher.find();  // ⚠️ Continua de onde parou
```

**5. Grupo Inexistente**:
```java
matcher.group(10);  // ❌ IndexOutOfBoundsException
```

## ✅ Boas Práticas

**1. Verificar find() Antes de group()**:
```java
if (matcher.find()) {
    String resultado = matcher.group();
}
```

**2. Usar while para Múltiplas Ocorrências**:
```java
while (matcher.find()) { ... }
```

**3. Matcher por Thread**:
```java
Matcher m = pattern.matcher(...);  // Por thread
```

**4. reset() para Reutilizar**:
```java
matcher.reset(novoTexto);
```

**5. Validar groupCount()**:
```java
if (i <= matcher.groupCount()) {
    matcher.group(i);
}
```

## 📚 Resumo Executivo

**Matcher - executa buscas regex**.

**Criar**:
```java
Matcher m = pattern.matcher("texto");
```

**Buscar**:
```java
m.matches()    // Texto inteiro corresponde?
m.find()       // Buscar próxima ocorrência
m.lookingAt()  // Início corresponde?
```

**Extrair**:
```java
m.group()      // Texto encontrado
m.group(1)     // Grupo 1
m.start()      // Posição início
m.end()        // Posição fim
```

**Substituir**:
```java
m.replaceAll("novo")   // Todas ocorrências
m.replaceFirst("novo") // Primeira ocorrência
```

**Estado**:
```java
m.reset()         // Resetar
m.reset("novo")   // Novo texto
```

**Uso típico**:
```java
Pattern p = Pattern.compile("\\d+");
Matcher m = p.matcher("10 20 30");

while (m.find()) {
    System.out.println(m.group());
}
```

**Recomendação**: Use **find() em loop** para múltiplas ocorrências. **Verifique find()** antes de group(). **Matcher não é thread-safe** - crie um por thread. Use **reset()** para reutilizar eficientemente.