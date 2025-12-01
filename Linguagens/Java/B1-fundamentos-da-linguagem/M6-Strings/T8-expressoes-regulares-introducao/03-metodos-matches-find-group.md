# Métodos matches(), find(), group()

## 🎯 Introdução e Definição

**matches(), find() e group() são os três métodos fundamentais** para trabalhar com expressões regulares em Java. **matches()** verifica se o **texto inteiro** corresponde ao padrão, **find()** **busca ocorrências parciais** no texto, e **group()** **retorna o texto encontrado**. Juntos, formam a base de praticamente todas as operações com regex.

**Conceito central**: **matches()** é para **validação** (email válido? CPF válido?), **find()** é para **busca** (encontrar números em texto), e **group()** é para **extração** (quais números foram encontrados?). Entender a diferença entre matches() (texto completo) e find() (busca parcial) é crucial.

**Exemplo fundamental**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Tenho 25 anos");

// matches() - texto INTEIRO é dígitos?
System.out.println(matcher.matches());  // false

// reset para reusar matcher
matcher.reset();

// find() - HÁ dígitos no texto?
if (matcher.find()) {
    // group() - QUAIS dígitos?
    System.out.println(matcher.group());  // "25"
}
```

**Características principais**:
- **matches()**: texto inteiro deve corresponder (validação)
- **find()**: busca parcial no texto (busca)
- **group()**: retorna texto encontrado (extração)
- **find()** pode ser chamado múltiplas vezes
- **group()** requer find() ou matches() antes

## 📋 Fundamentos Teóricos

### 1️⃣ matches() - Validação de Texto Completo

**Comportamento**:

```java
Pattern pattern = Pattern.compile("\\d+");  // Um ou mais dígitos

// Texto inteiro são dígitos?
Matcher m1 = pattern.matcher("123");
System.out.println(m1.matches());  // true

Matcher m2 = pattern.matcher("123abc");
System.out.println(m2.matches());  // false (tem letras)

Matcher m3 = pattern.matcher("abc");
System.out.println(m3.matches());  // false (nenhum dígito)
```

**matches() é equivalente a ^regex$**:
```java
// Estes são equivalentes:

// Opção 1: matches()
Pattern p1 = Pattern.compile("\\d+");
Matcher m1 = p1.matcher("123");
boolean r1 = m1.matches();

// Opção 2: find() com âncoras
Pattern p2 = Pattern.compile("^\\d+$");
Matcher m2 = p2.matcher("123");
boolean r2 = m2.find();

// r1 == r2 (ambos true)
```

**Uso típico - validação**:
```java
public static boolean validarCPF(String cpf) {
    Pattern pattern = Pattern.compile("\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}");
    Matcher matcher = pattern.matcher(cpf);
    return matcher.matches();  // Texto inteiro deve ser CPF
}

System.out.println(validarCPF("123.456.789-00"));  // true
System.out.println(validarCPF("123.456"));          // false
System.out.println(validarCPF("CPF: 123.456.789-00"));  // false (tem "CPF:")
```

**matches() vs String.matches()**:
```java
// Matcher.matches()
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("123");
boolean r1 = matcher.matches();

// String.matches() - conveniência
String texto = "123";
boolean r2 = texto.matches("\\d+");

// Mesmo resultado, mas String.matches() recompila Pattern a cada vez
```

**matches() depois de find()**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("123");

// find() primeiro
System.out.println(matcher.find());     // true
System.out.println(matcher.group());    // "123"

// matches() reseta posição e verifica texto inteiro
System.out.println(matcher.matches());  // true

// ⚠️ matches() afeta estado do matcher
```

### 2️⃣ find() - Busca Parcial

**Comportamento**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Tenho 25 anos e 180cm");

// Primeira chamada find() - busca a partir do início
boolean encontrou = matcher.find();
System.out.println(encontrou);          // true
System.out.println(matcher.group());    // "25"
System.out.println(matcher.start());    // 6 (posição de "25")

// Segunda chamada find() - continua de onde parou
encontrou = matcher.find();
System.out.println(encontrou);          // true
System.out.println(matcher.group());    // "180"
System.out.println(matcher.start());    // 17

// Terceira chamada - sem mais ocorrências
encontrou = matcher.find();
System.out.println(encontrou);          // false
```

**Loop com find()**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30 40 50");

List<String> numeros = new ArrayList<>();

while (matcher.find()) {
    numeros.add(matcher.group());
}

System.out.println(numeros);  // [10, 20, 30, 40, 50]
```

**find() com posição inicial**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

// Buscar a partir do índice 5 (depois de "10 ")
boolean encontrou = matcher.find(5);
System.out.println(encontrou);        // true
System.out.println(matcher.group());  // "20"

// Próximo find() continua normalmente
encontrou = matcher.find();
System.out.println(matcher.group());  // "30"
```

**find() vs matches()**:
```java
Pattern pattern = Pattern.compile("\\d+");

// find() - busca parcial
Matcher m1 = pattern.matcher("Idade: 25");
System.out.println(m1.find());     // true (encontrou "25")

// matches() - texto inteiro
Matcher m2 = pattern.matcher("Idade: 25");
System.out.println(m2.matches());  // false (texto não é só dígitos)

// Diferença crucial!
```

**Reset após find()**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

matcher.find();
System.out.println(matcher.group());  // "10"

matcher.find();
System.out.println(matcher.group());  // "20"

// Reset - volta ao início
matcher.reset();

matcher.find();
System.out.println(matcher.group());  // "10" (novamente)
```

### 3️⃣ group() - Extração do Texto Encontrado

**group() sem argumentos - texto completo**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Idade: 25");

if (matcher.find()) {
    String numero = matcher.group();  // Texto encontrado
    System.out.println(numero);  // "25"
}
```

**group(0) - equivalente a group()**:
```java
if (matcher.find()) {
    System.out.println(matcher.group());   // "25"
    System.out.println(matcher.group(0));  // "25" (mesmo resultado)
}
```

**IllegalStateException - chamar group() sem find()**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("123");

try {
    String resultado = matcher.group();  // ❌ IllegalStateException
} catch (IllegalStateException e) {
    System.err.println("Precisa chamar find() ou matches() primeiro!");
}

// ✓ Correto
if (matcher.find()) {
    String resultado = matcher.group();  // ✓ OK
}
```

**group() com grupos de captura**:
```java
// Padrão com grupos (parênteses)
Pattern pattern = Pattern.compile("(\\d{3})-(\\d{4})");
Matcher matcher = pattern.matcher("Tel: 123-4567");

if (matcher.find()) {
    System.out.println(matcher.group());   // "123-4567" (tudo)
    System.out.println(matcher.group(0));  // "123-4567" (grupo 0 = tudo)
    System.out.println(matcher.group(1));  // "123" (primeiro grupo)
    System.out.println(matcher.group(2));  // "4567" (segundo grupo)
}
```

**Grupos aninhados**:
```java
Pattern pattern = Pattern.compile("((\\d{3})-(\\d{4}))");
Matcher matcher = pattern.matcher("123-4567");

if (matcher.find()) {
    System.out.println(matcher.group(0));  // "123-4567" (tudo)
    System.out.println(matcher.group(1));  // "123-4567" (grupo externo)
    System.out.println(matcher.group(2));  // "123" (primeiro interno)
    System.out.println(matcher.group(3));  // "4567" (segundo interno)
}
```

**groupCount() - número de grupos**:
```java
Pattern pattern = Pattern.compile("(\\d{3})-(\\d{4})");
Matcher matcher = pattern.matcher("123-4567");

int totalGrupos = matcher.groupCount();
System.out.println("Total grupos: " + totalGrupos);  // 2

if (matcher.find()) {
    // Iterar sobre todos os grupos
    for (int i = 1; i <= matcher.groupCount(); i++) {
        System.out.println("Grupo " + i + ": " + matcher.group(i));
    }
}
// Output:
// Grupo 1: 123
// Grupo 2: 4567
```

### 4️⃣ Combinando matches(), find() e group()

**Validar e extrair**:

```java
public static void processar(String texto) {
    Pattern pattern = Pattern.compile("\\d+");
    Matcher matcher = pattern.matcher(texto);
    
    // Verificar se há números
    if (matcher.find()) {
        // Extrair primeiro número
        String numero = matcher.group();
        System.out.println("Primeiro número: " + numero);
        
        // Extrair demais números
        while (matcher.find()) {
            System.out.println("Próximo: " + matcher.group());
        }
    } else {
        System.out.println("Nenhum número encontrado");
    }
}

processar("10 20 30");
// Output:
// Primeiro número: 10
// Próximo: 20
// Próximo: 30

processar("Sem números");
// Output:
// Nenhum número encontrado
```

**Validar formato específico**:
```java
public static Map<String, String> extrairTelefone(String texto) {
    Pattern pattern = Pattern.compile("(\\d{3})-(\\d{4})");
    Matcher matcher = pattern.matcher(texto);
    
    if (matcher.matches()) {  // Texto inteiro é telefone?
        Map<String, String> partes = new HashMap<>();
        partes.put("completo", matcher.group());
        partes.put("prefixo", matcher.group(1));
        partes.put("numero", matcher.group(2));
        return partes;
    }
    
    return null;  // Formato inválido
}

Map<String, String> tel = extrairTelefone("123-4567");
System.out.println(tel);  // {completo=123-4567, prefixo=123, numero=4567}

Map<String, String> tel2 = extrairTelefone("Tel: 123-4567");
System.out.println(tel2);  // null (tem "Tel:")
```

**Buscar e validar cada ocorrência**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 abc 20 xyz 30");

while (matcher.find()) {
    String numero = matcher.group();
    int valor = Integer.parseInt(numero);
    
    if (valor % 10 == 0) {
        System.out.println(valor + " é múltiplo de 10");
    }
}
// Output:
// 10 é múltiplo de 10
// 20 é múltiplo de 10
// 30 é múltiplo de 10
```

### 5️⃣ Casos de Uso Práticos

**Validar email**:

```java
public static boolean validarEmail(String email) {
    Pattern pattern = Pattern.compile(
        "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
        Pattern.CASE_INSENSITIVE
    );
    Matcher matcher = pattern.matcher(email);
    return matcher.matches();  // Texto inteiro deve ser email
}

System.out.println(validarEmail("user@example.com"));  // true
System.out.println(validarEmail("invalid"));            // false
```

**Extrair URLs de texto**:
```java
public static List<String> extrairURLs(String texto) {
    List<String> urls = new ArrayList<>();
    
    Pattern pattern = Pattern.compile(
        "https?://[a-z0-9.-]+\\.[a-z]{2,}[^\\s]*",
        Pattern.CASE_INSENSITIVE
    );
    Matcher matcher = pattern.matcher(texto);
    
    while (matcher.find()) {
        urls.add(matcher.group());
    }
    
    return urls;
}

String texto = "Visite https://example.com e http://test.org";
List<String> urls = extrairURLs(texto);
System.out.println(urls);  // [https://example.com, http://test.org]
```

**Extrair e formatar datas**:
```java
public static String formatarDatas(String texto) {
    Pattern pattern = Pattern.compile("(\\d{2})/(\\d{2})/(\\d{4})");
    Matcher matcher = pattern.matcher(texto);
    
    StringBuffer sb = new StringBuffer();
    
    while (matcher.find()) {
        String dia = matcher.group(1);
        String mes = matcher.group(2);
        String ano = matcher.group(3);
        
        // Converter DD/MM/YYYY para YYYY-MM-DD
        String novaData = ano + "-" + mes + "-" + dia;
        
        matcher.appendReplacement(sb, novaData);
    }
    
    matcher.appendTail(sb);
    return sb.toString();
}

String texto = "Nascimento: 25/12/2000, Formatura: 15/07/2024";
System.out.println(formatarDatas(texto));
// "Nascimento: 2000-12-25, Formatura: 2024-07-15"
```

**Contar ocorrências**:
```java
public static int contarPalavras(String texto) {
    Pattern pattern = Pattern.compile("\\b\\w+\\b");
    Matcher matcher = pattern.matcher(texto);
    
    int contador = 0;
    while (matcher.find()) {
        contador++;
    }
    
    return contador;
}

System.out.println(contarPalavras("Java é uma linguagem"));  // 4
```

### 6️⃣ Diferenças e Quando Usar

**matches() - quando usar**:

```java
// ✓ Validar formato completo
validarCPF(cpf)
validarEmail(email)
validarTelefone(telefone)

// ✓ Verificar se texto inteiro corresponde
if (texto.matches("\\d+")) {
    // Texto é apenas dígitos
}
```

**find() - quando usar**:
```java
// ✓ Buscar ocorrências em texto
extrairURLs(texto)
extrairNumeros(texto)

// ✓ Processar múltiplas ocorrências
while (matcher.find()) {
    processar(matcher.group());
}

// ✓ Verificar presença no texto
if (matcher.find()) {
    // Há email no texto
}
```

**group() - quando usar**:
```java
// ✓ Extrair texto encontrado
String numero = matcher.group();

// ✓ Extrair partes (grupos)
String ddd = matcher.group(1);
String telefone = matcher.group(2);

// ✓ Processar resultado
int valor = Integer.parseInt(matcher.group());
```

**Tabela comparativa**:

| Método | Propósito | Retorno | Uso Típico |
|--------|-----------|---------|------------|
| **matches()** | Validar texto inteiro | boolean | Validação de formato |
| **find()** | Buscar ocorrência | boolean | Busca parcial |
| **group()** | Extrair texto | String | Obter resultado |

### 7️⃣ Erros Comuns

**Confundir matches() e find()**:

```java
Pattern pattern = Pattern.compile("\\d+");

// ❌ Espera encontrar número, mas usa matches()
Matcher m = pattern.matcher("Idade: 25");
if (m.matches()) {  // false (texto não é só dígitos)
    System.out.println("Encontrou");
}

// ✓ Correto - usar find()
if (m.find()) {  // true (encontrou "25")
    System.out.println("Encontrou: " + m.group());
}
```

**Chamar group() sem verificar find()**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Sem números");

// ❌ Não verificou find()
try {
    String numero = matcher.group();  // IllegalStateException
} catch (IllegalStateException e) {
    System.err.println("Erro!");
}

// ✓ Correto
if (matcher.find()) {
    String numero = matcher.group();
}
```

**Esquecer reset() ao reusar**:
```java
Matcher matcher = pattern.matcher("10 20");

matcher.find();
System.out.println(matcher.group());  // "10"

// ❌ Esquecer reset
matcher.find();
System.out.println(matcher.group());  // "20" (não "10")

// ✓ Reset para voltar ao início
matcher.reset();
matcher.find();
System.out.println(matcher.group());  // "10"
```

### 8️⃣ Performance

**matches() vs find() + âncoras**:

```java
int n = 100000;

// matches()
Pattern p1 = Pattern.compile("\\d+");
long inicio = System.nanoTime();
for (int i = 0; i < n; i++) {
    Matcher m = p1.matcher("123");
    m.matches();
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// find() com âncoras ^$
Pattern p2 = Pattern.compile("^\\d+$");
inicio = System.nanoTime();
for (int i = 0; i < n; i++) {
    Matcher m = p2.matcher("123");
    m.find();
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

// Performance similar (~5ms cada)
```

**Reutilizar Matcher**:
```java
Pattern pattern = Pattern.compile("\\d+");
List<String> textos = List.of("10", "20", "30");

// ❌ Criar Matcher a cada vez
long inicio = System.nanoTime();
for (String texto : textos) {
    Matcher m = pattern.matcher(texto);
    m.find();
}
long tempo1 = System.nanoTime() - inicio;

// ✓ Reutilizar com reset()
inicio = System.nanoTime();
Matcher matcher = pattern.matcher("");
for (String texto : textos) {
    matcher.reset(texto);
    matcher.find();
}
long tempo2 = System.nanoTime() - inicio;

// Reutilizar ~20% mais rápido
```

### 9️⃣ Boas Práticas

**Sempre verificar find() antes de group()**:

```java
// ✓ Correto
if (matcher.find()) {
    String resultado = matcher.group();
}

// ❌ Perigoso
String resultado = matcher.group();  // Pode lançar exceção
```

**Usar while para múltiplas ocorrências**:
```java
// ✓ Extrair todas
while (matcher.find()) {
    processar(matcher.group());
}

// ❌ Só primeira
if (matcher.find()) {
    processar(matcher.group());
}
```

**matches() para validação, find() para busca**:
```java
// ✓ Validar
if (matcher.matches()) {
    // Formato válido
}

// ✓ Buscar
if (matcher.find()) {
    // Encontrou no texto
}
```

### 🔟 Resumo Comparativo

**Decisão: qual usar?**

```java
// Validar formato completo?
matcher.matches()  // ✓

// Buscar ocorrência em texto?
matcher.find()  // ✓

// Extrair texto encontrado?
matcher.group()  // ✓ (após find/matches)

// Verificar se contém padrão?
matcher.find()  // ✓

// Extrair múltiplas ocorrências?
while (matcher.find()) {
    matcher.group()  // ✓
}
```

## 🎯 Aplicabilidade

**1. Validação - matches()**:
```java
matcher.matches()  // Email válido?
```

**2. Busca - find()**:
```java
while (matcher.find()) { ... }
```

**3. Extração - group()**:
```java
String texto = matcher.group();
```

**4. Grupos - group(int)**:
```java
String parte = matcher.group(1);
```

**5. Combinado**:
```java
if (m.find()) { String r = m.group(); }
```

## ⚠️ Armadilhas Comuns

**1. Confundir matches() e find()**:
```java
m.matches()  // Texto INTEIRO
m.find()     // BUSCA parcial
```

**2. group() sem find()**:
```java
m.group();  // ❌ IllegalStateException
```

**3. Não Usar while**:
```java
if (m.find()) { }  // ⚠️ Só primeira
while (m.find()) { }  // ✓ Todas
```

**4. Esquecer reset()**:
```java
m.find(); m.find();  // ⚠️ Avança posição
```

**5. Grupo Inexistente**:
```java
m.group(10);  // ❌ IndexOutOfBoundsException
```

## ✅ Boas Práticas

**1. Validação com matches()**:
```java
if (m.matches()) { }
```

**2. Busca com find()**:
```java
while (m.find()) { }
```

**3. Verificar Antes de group()**:
```java
if (m.find()) { String r = m.group(); }
```

**4. Validar groupCount()**:
```java
if (i <= m.groupCount()) { m.group(i); }
```

**5. Documentar Grupos**:
```java
// Grupo 1: DDD, Grupo 2: Número
```

## 📚 Resumo Executivo

**Três métodos fundamentais**.

**matches() - validação**:
```java
m.matches()  // Texto INTEIRO corresponde?
```

**find() - busca**:
```java
m.find()  // HÁ ocorrência?
while (m.find()) { }  // Múltiplas
```

**group() - extração**:
```java
m.group()     // Texto encontrado
m.group(1)    // Grupo 1
```

**Diferença crucial**:
```java
"Idade: 25".matches("\\d+")  → false (texto não é só dígitos)
"Idade: 25" contém \\d+      → true (via find())
```

**Uso típico**:
```java
// Validar
if (matcher.matches()) {
    // Formato válido
}

// Buscar e extrair
while (matcher.find()) {
    String resultado = matcher.group();
    processar(resultado);
}
```

**Recomendação**: Use **matches()** para **validação** de formato completo. Use **find()** para **busca** parcial. **Sempre verifique find()** antes de group(). Use **while** para múltiplas ocorrências.