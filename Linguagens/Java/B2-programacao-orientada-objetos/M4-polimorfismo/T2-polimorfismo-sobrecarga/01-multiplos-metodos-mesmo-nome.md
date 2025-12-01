# T2.01 - Múltiplos Métodos com Mesmo Nome

## Introdução

**Sobrecarga (Overloading)**: permite declarar **múltiplos métodos com o mesmo nome** na mesma classe, diferenciados pela **assinatura**.

**Assinatura**: nome do método + **lista de parâmetros** (tipo, quantidade, ordem).

**Tipo de retorno NÃO faz parte da assinatura** para sobrecarga.

```java
public class Calculadora {
    // Mesmo nome: somar
    public int somar(int a, int b) {
        return a + b;
    }
    
    public double somar(double a, double b) {
        return a + b;
    }
    
    public int somar(int a, int b, int c) {
        return a + b + c;
    }
}

Calculadora calc = new Calculadora();
calc.somar(5, 10);          // Chama somar(int, int)
calc.somar(5.5, 10.2);      // Chama somar(double, double)
calc.somar(5, 10, 15);      // Chama somar(int, int, int)
```

**Benefícios**:
- **Flexibilidade**: mesma operação com diferentes tipos
- **Legibilidade**: nome consistente para operações similares
- **API intuitiva**: usuário não precisa lembrar nomes diferentes

---

## Fundamentos

### 1. Múltiplos Métodos na Mesma Classe

```java
public class Impressora {
    public void imprimir(String texto) {
        System.out.println("Texto: " + texto);
    }
    
    public void imprimir(int numero) {
        System.out.println("Número: " + numero);
    }
    
    public void imprimir(boolean valor) {
        System.out.println("Booleano: " + valor);
    }
    
    public void imprimir(Object objeto) {
        System.out.println("Objeto: " + objeto);
    }
}

// Uso
Impressora p = new Impressora();
p.imprimir("Java");      // Chama imprimir(String)
p.imprimir(42);          // Chama imprimir(int)
p.imprimir(true);        // Chama imprimir(boolean)
p.imprimir(new Date());  // Chama imprimir(Object)
```

### 2. Assinatura do Método

**Assinatura** = nome + **parâmetros** (tipo, quantidade, ordem).

```java
// ✅ Assinaturas diferentes (sobrecarga válida)
public void metodo(int a)           // Assinatura: metodo(int)
public void metodo(double a)        // Assinatura: metodo(double)
public void metodo(int a, int b)    // Assinatura: metodo(int, int)
public void metodo(String a)        // Assinatura: metodo(String)

// ❌ Mesma assinatura (erro de compilação)
public void metodo(int a)           // Assinatura: metodo(int)
public int metodo(int x)            // Assinatura: metodo(int) - DUPLICADO!
```

### 3. Tipo de Retorno Não Diferencia

```java
// ❌ Erro: apenas tipo de retorno diferente
public int calcular(int a, int b) {
    return a + b;
}

public double calcular(int a, int b) { // Erro de compilação
    return a + b;
}

// ✅ Correto: parâmetros diferentes
public int calcular(int a, int b) {
    return a + b;
}

public double calcular(double a, double b) { // OK
    return a + b;
}
```

### 4. Quantidade de Parâmetros

```java
public class Concatenador {
    public String concatenar(String a) {
        return a;
    }
    
    public String concatenar(String a, String b) {
        return a + b;
    }
    
    public String concatenar(String a, String b, String c) {
        return a + b + c;
    }
}

// Uso
Concatenador c = new Concatenador();
c.concatenar("A");              // 1 parâmetro
c.concatenar("A", "B");         // 2 parâmetros
c.concatenar("A", "B", "C");    // 3 parâmetros
```

### 5. Tipo dos Parâmetros

```java
public class Conversor {
    public int converter(String texto) {
        return Integer.parseInt(texto);
    }
    
    public String converter(int numero) {
        return String.valueOf(numero);
    }
    
    public double converter(float numero) {
        return (double) numero;
    }
}

// Uso
Conversor conv = new Conversor();
int i = conv.converter("123");      // String → int
String s = conv.converter(456);     // int → String
double d = conv.converter(7.5f);    // float → double
```

### 6. Ordem dos Parâmetros

```java
public class Processador {
    public void processar(int numero, String texto) {
        System.out.println("Int primeiro: " + numero + ", " + texto);
    }
    
    public void processar(String texto, int numero) {
        System.out.println("String primeiro: " + texto + ", " + numero);
    }
}

// Uso
Processador p = new Processador();
p.processar(10, "Java");    // Chama processar(int, String)
p.processar("Java", 10);    // Chama processar(String, int)
```

### 7. Métodos com Mesma Quantidade mas Tipos Diferentes

```java
public class Operador {
    // 2 parâmetros: int, int
    public int operar(int a, int b) {
        return a + b;
    }
    
    // 2 parâmetros: double, double
    public double operar(double a, double b) {
        return a * b;
    }
    
    // 2 parâmetros: String, String
    public String operar(String a, String b) {
        return a.concat(b);
    }
}
```

### 8. Sobrecarga com Arrays

```java
public class Somador {
    public int somar(int a, int b) {
        return a + b;
    }
    
    public int somar(int[] numeros) {
        int soma = 0;
        for (int n : numeros) {
            soma += n;
        }
        return soma;
    }
}

// Uso
Somador s = new Somador();
s.somar(5, 10);                 // Chama somar(int, int)
s.somar(new int[]{5, 10, 15}); // Chama somar(int[])
```

### 9. Sobrecarga em Herança

```java
public class Animal {
    public void som(String tipo) {
        System.out.println(tipo + " faz som");
    }
}

public class Cachorro extends Animal {
    // Sobrecarga: adiciona novo método
    public void som() {
        System.out.println("Au au");
    }
    
    // Herdado: som(String)
}

// Uso
Cachorro c = new Cachorro();
c.som();         // Chama som() de Cachorro
c.som("Labrador"); // Chama som(String) herdado de Animal
```

### 10. Métodos Estáticos Podem Ser Sobrecarregados

```java
public class Matematica {
    public static int max(int a, int b) {
        return a > b ? a : b;
    }
    
    public static double max(double a, double b) {
        return a > b ? a : b;
    }
    
    public static long max(long a, long b) {
        return a > b ? a : b;
    }
}

// Uso
Matematica.max(10, 20);       // int
Matematica.max(10.5, 20.7);   // double
Matematica.max(100L, 200L);   // long
```

---

## Aplicabilidade

**Use sobrecarga quando**:
- **Mesma operação** em diferentes tipos de dados
- **API consistente**: usuário não precisa lembrar nomes diferentes
- **Construtores**: inicialização com diferentes conjuntos de parâmetros
- **Flexibilidade**: aceitar entrada em múltiplos formatos
- **Conversões**: processar diferentes tipos

**Exemplos**:
```java
// System.out.println() é sobrecarregado
System.out.println(int x)
System.out.println(double x)
System.out.println(String x)
System.out.println(Object x)
System.out.println(boolean x)
System.out.println(char x)

// String.valueOf() é sobrecarregado
String.valueOf(int)
String.valueOf(long)
String.valueOf(double)
String.valueOf(char)
String.valueOf(Object)
```

---

## Armadilhas

### 1. Tipo de Retorno Não Diferencia

```java
// ❌ Erro de compilação
public int processar(int a) {
    return a * 2;
}

public double processar(int a) { // Mesma assinatura!
    return a * 2.0;
}
```

### 2. Modificador de Acesso Não Diferencia

```java
// ❌ Erro: apenas modificador de acesso diferente
public void metodo(int a) { }
private void metodo(int a) { } // Mesma assinatura!
```

### 3. Nome de Parâmetro Não Diferencia

```java
// ❌ Erro: nomes de parâmetros diferentes, mas tipo igual
public void metodo(int numero) { }
public void metodo(int valor) { } // Mesma assinatura: metodo(int)
```

### 4. Ambiguidade com Promoção de Tipos

```java
public class Teste {
    public void metodo(int a) {
        System.out.println("int");
    }
    
    public void metodo(long a) {
        System.out.println("long");
    }
}

Teste t = new Teste();
t.metodo(10); // "int" - match exato
t.metodo(10L); // "long" - match exato

byte b = 5;
t.metodo(b); // "int" - promoção byte → int
```

### 5. Ambiguidade com Autoboxing

```java
public class Teste {
    public void metodo(int a) {
        System.out.println("int");
    }
    
    public void metodo(Integer a) {
        System.out.println("Integer");
    }
}

Teste t = new Teste();
t.metodo(10); // "int" - primitivo preferido
t.metodo(Integer.valueOf(10)); // "Integer"
```

### 6. Arrays e Varargs Conflitam

```java
// ❌ Erro: varargs é array
public void metodo(int... numeros) { }
public void metodo(int[] numeros) { } // Conflito com varargs
```

### 7. Exceções Declaradas Não Diferenciam

```java
// ❌ Erro: exceções não fazem parte da assinatura
public void metodo(int a) throws IOException { }
public void metodo(int a) throws SQLException { } // Mesma assinatura!
```

---

## Boas Práticas

### 1. Nome Consistente para Operações Similares

```java
// ✅ Bom: nome consistente
public class StringBuilder {
    public StringBuilder append(String str) { }
    public StringBuilder append(int i) { }
    public StringBuilder append(char c) { }
    public StringBuilder append(boolean b) { }
}

// ❌ Evite: nomes diferentes para mesma operação
public class MauExemplo {
    public void adicionarString(String str) { }
    public void anexarInteiro(int i) { }
    public void incluirCaractere(char c) { }
}
```

### 2. Implemente Hierarquia de Especificidade

```java
public class Logger {
    // Mais genérico
    public void log(Object mensagem) {
        log(mensagem.toString());
    }
    
    // Mais específico
    public void log(String mensagem) {
        System.out.println("[LOG] " + mensagem);
    }
    
    // Ainda mais específico
    public void log(String nivel, String mensagem) {
        System.out.println("[" + nivel + "] " + mensagem);
    }
}
```

### 3. Evite Muitos Métodos Sobrecarregados

```java
// ❌ Evite: muita sobrecarga confunde
public void processar(int a) { }
public void processar(int a, int b) { }
public void processar(int a, int b, int c) { }
public void processar(int a, int b, int c, int d) { }
public void processar(int a, int b, int c, int d, int e) { }

// ✅ Melhor: use varargs ou Builder
public void processar(int... numeros) { }

// Ou Builder Pattern
public class ProcessadorBuilder {
    private List<Integer> numeros = new ArrayList<>();
    
    public ProcessadorBuilder adicionar(int n) {
        numeros.add(n);
        return this;
    }
    
    public void processar() {
        // Processar todos os números
    }
}
```

### 4. StringBuilder Pattern

```java
public class StringBuilder {
    public StringBuilder append(String str) {
        // Adicionar string
        return this;
    }
    
    public StringBuilder append(int i) {
        // Adicionar int
        return this;
    }
    
    public StringBuilder append(char c) {
        // Adicionar char
        return this;
    }
}

// Uso: method chaining
StringBuilder sb = new StringBuilder()
    .append("Java ")
    .append(17)
    .append(' ')
    .append("LTS");
```

### 5. Valores Padrão com Sobrecarga

```java
public class Conexao {
    private static final String HOST_PADRAO = "localhost";
    private static final int PORTA_PADRAO = 8080;
    
    // Mais completo
    public void conectar(String host, int porta, int timeout) {
        System.out.println("Conectando a " + host + ":" + porta);
    }
    
    // Padrão: timeout
    public void conectar(String host, int porta) {
        conectar(host, porta, 5000);
    }
    
    // Padrão: porta e timeout
    public void conectar(String host) {
        conectar(host, PORTA_PADRAO, 5000);
    }
    
    // Padrão: host, porta e timeout
    public void conectar() {
        conectar(HOST_PADRAO, PORTA_PADRAO, 5000);
    }
}
```

### 6. Wrapper Classes

```java
// Integer.valueOf() é sobrecarregado
public final class Integer {
    public static Integer valueOf(int i) {
        // Retorna Integer do cache ou novo
    }
    
    public static Integer valueOf(String s) throws NumberFormatException {
        return valueOf(parseInt(s, 10));
    }
    
    public static Integer valueOf(String s, int radix) {
        return valueOf(parseInt(s, radix));
    }
}
```

### 7. Arrays.asList()

```java
// ✅ Exemplo real: Arrays.asList()
public class Arrays {
    @SafeVarargs
    public static <T> List<T> asList(T... a) {
        return new ArrayList<>(a);
    }
}

// Uso
List<String> lista1 = Arrays.asList("A", "B", "C");
List<Integer> lista2 = Arrays.asList(1, 2, 3);
```

### 8. Factory Methods

```java
public class LocalDate {
    // Factory methods sobrecarregados
    public static LocalDate of(int year, int month, int dayOfMonth) {
        // Criar LocalDate
    }
    
    public static LocalDate of(int year, Month month, int dayOfMonth) {
        // Criar LocalDate com enum Month
    }
    
    public static LocalDate ofYearDay(int year, int dayOfYear) {
        // Criar LocalDate a partir do dia do ano
    }
    
    public static LocalDate ofEpochDay(long epochDay) {
        // Criar LocalDate a partir de epoch
    }
}
```

---

## Resumo

**Sobrecarga**:
```java
// Múltiplos métodos com mesmo nome
public void metodo(int a) { }
public void metodo(double a) { }
public void metodo(int a, int b) { }
```

**Assinatura**:
```java
// nome + parâmetros (tipo, quantidade, ordem)
metodo(int)
metodo(double)
metodo(int, int)
```

**Tipo de retorno NÃO diferencia**:
```java
// ❌ Erro: mesma assinatura
public int metodo(int a) { }
public double metodo(int a) { } // Erro!
```

**Quantidade de parâmetros**:
```java
public void metodo(int a) { }
public void metodo(int a, int b) { }
public void metodo(int a, int b, int c) { }
```

**Tipo dos parâmetros**:
```java
public void metodo(int a) { }
public void metodo(double a) { }
public void metodo(String a) { }
```

**Ordem dos parâmetros**:
```java
public void metodo(int a, String b) { }
public void metodo(String a, int b) { }
```

**Benefícios**:
- ✅ Flexibilidade
- ✅ API consistente
- ✅ Legibilidade
- ✅ Mesma operação em diferentes tipos

**Quando usar**:
- ✅ Construtores
- ✅ Conversões
- ✅ Diferentes tipos de entrada
- ✅ Valores padrão

**Evitar**:
- ❌ Muitos métodos sobrecarregados (use varargs ou Builder)
- ❌ Ambiguidade
- ❌ Nomes inconsistentes

**Regra de Ouro**: **Sobrecarga** permite **múltiplos métodos com mesmo nome** diferenciados pela **assinatura** (nome + parâmetros). **Tipo de retorno NÃO faz parte da assinatura**. Use para **operações similares com diferentes tipos de entrada**.
