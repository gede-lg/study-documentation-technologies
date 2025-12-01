# T1.02 - Polimorfismo de Sobrecarga (Overloading)

## Introdução

**Sobrecarga (Overloading)**: múltiplos métodos com **mesmo nome**, **parâmetros diferentes**.

**Polimorfismo de compile-time**: decisão de qual método chamar acontece em **tempo de compilação**.

**Diferenciação por**:
- **Quantidade** de parâmetros
- **Tipo** de parâmetros
- **Ordem** de parâmetros

**Não diferencia por**:
- Tipo de retorno
- Modificadores de acesso
- Exceções lançadas

```java
public class Calculadora {
    // Sobrecarga: mesmo nome, parâmetros diferentes
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

// Uso
Calculadora calc = new Calculadora();
calc.somar(5, 3);        // int somar(int, int)
calc.somar(5.5, 3.2);    // double somar(double, double)
calc.somar(1, 2, 3);     // int somar(int, int, int)
```

---

## Fundamentos

### 1. Mesmo Nome, Parâmetros Diferentes

```java
public class Impressora {
    public void imprimir(String texto) {
        System.out.println(texto);
    }
    
    public void imprimir(int numero) {
        System.out.println(numero);
    }
    
    public void imprimir(String texto, int vezes) {
        for (int i = 0; i < vezes; i++) {
            System.out.println(texto);
        }
    }
}
```

### 2. Diferenciação por Quantidade de Parâmetros

```java
public class Matematica {
    public int max(int a, int b) {
        return a > b ? a : b;
    }
    
    public int max(int a, int b, int c) {
        return max(max(a, b), c);
    }
    
    public int max(int a, int b, int c, int d) {
        return max(max(a, b), max(c, d));
    }
}
```

### 3. Diferenciação por Tipo de Parâmetros

```java
public class Conversor {
    public String converter(int numero) {
        return String.valueOf(numero);
    }
    
    public String converter(double numero) {
        return String.format("%.2f", numero);
    }
    
    public String converter(boolean valor) {
        return valor ? "Verdadeiro" : "Falso";
    }
}
```

### 4. Diferenciação por Ordem de Parâmetros

```java
public class Formata {
    public void exibir(String nome, int idade) {
        System.out.println(nome + " tem " + idade + " anos");
    }
    
    public void exibir(int idade, String nome) {
        System.out.println(idade + " anos: " + nome);
    }
}

// Uso
Formata f = new Formata();
f.exibir("João", 25);  // String, int
f.exibir(25, "João");  // int, String
```

### 5. Resolução em Tempo de Compilação

**Compilador decide qual método chamar** baseado nos argumentos.

```java
Calculadora calc = new Calculadora();

// Compilador escolhe método baseado em argumentos
calc.somar(5, 3);      // Escolhe: int somar(int, int)
calc.somar(5.5, 3.2);  // Escolhe: double somar(double, double)
```

### 6. Sobrecarga de Construtores

```java
public class Pessoa {
    private String nome;
    private int idade;
    private String email;
    
    // Construtor padrão
    public Pessoa() {
        this("Desconhecido", 0);
    }
    
    // Construtor com nome
    public Pessoa(String nome) {
        this(nome, 0);
    }
    
    // Construtor com nome e idade
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
        this.email = "";
    }
    
    // Construtor completo
    public Pessoa(String nome, int idade, String email) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }
}
```

### 7. Tipo de Retorno Não Diferencia

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

public double calcular(double a, double b) {
    return a + b;
}
```

### 8. Promoção de Tipos Primitivos

**Widening conversion** automática.

```java
public class Teste {
    public void metodo(int x) {
        System.out.println("int: " + x);
    }
    
    public void metodo(long x) {
        System.out.println("long: " + x);
    }
}

// Uso
Teste t = new Teste();
byte b = 5;
t.metodo(b);  // byte → int (promoção)

short s = 10;
t.metodo(s);  // short → int (promoção)

int i = 15;
t.metodo(i);  // int exato

long l = 20;
t.metodo(l);  // long exato
```

### 9. Ambiguidade em Sobrecarga

```java
public class Ambiguo {
    public void metodo(int a, double b) {
        System.out.println("int, double");
    }
    
    public void metodo(double a, int b) {
        System.out.println("double, int");
    }
}

// ❌ Erro: ambiguidade
Ambiguo a = new Ambiguo();
a.metodo(5, 10); // Qual método chamar?

// ✅ OK: sem ambiguidade
a.metodo(5, 10.0);    // int, double
a.metodo(5.0, 10);    // double, int
```

### 10. Varargs e Sobrecarga

```java
public class VarargsTest {
    public void metodo(int... numeros) {
        System.out.println("varargs: " + numeros.length);
    }
    
    public void metodo(int a, int b) {
        System.out.println("dois ints");
    }
}

// Uso
VarargsTest v = new VarargsTest();
v.metodo(1, 2);        // Chama: metodo(int, int) - mais específico
v.metodo(1, 2, 3);     // Chama: metodo(int...)
v.metodo();            // Chama: metodo(int...)
```

---

## Aplicabilidade

**Use sobrecarga quando**:
- **Mesma operação** com **diferentes tipos** de entrada
- **Múltiplas formas** de inicializar objeto (construtores)
- **Métodos utilitários** que aceitam vários tipos
- **API mais flexível** e conveniente
- **Diferentes quantidades** de parâmetros para mesma operação

**Exemplos**:
```java
// String.valueOf() - sobrecarregado para múltiplos tipos
String.valueOf(42);
String.valueOf(3.14);
String.valueOf(true);
String.valueOf('A');

// System.out.println() - sobrecarregado
System.out.println(42);
System.out.println(3.14);
System.out.println("texto");
System.out.println(true);

// Arrays.asList() - sobrecarregado com varargs
Arrays.asList(1, 2, 3);
Arrays.asList("a", "b", "c");
```

---

## Armadilhas

### 1. Apenas Tipo de Retorno Diferente

```java
// ❌ Erro de compilação
public int processar(String texto) {
    return texto.length();
}

public String processar(String texto) {
    return texto.toUpperCase();
}
```

### 2. Ambiguidade com Autoboxing

```java
public class Teste {
    public void metodo(Integer x) {
        System.out.println("Integer");
    }
    
    public void metodo(int x) {
        System.out.println("int");
    }
}

Teste t = new Teste();
t.metodo(5);        // Chama: metodo(int) - primitivo preferido
t.metodo(Integer.valueOf(5)); // Chama: metodo(Integer)
```

### 3. Ambiguidade com Null

```java
public class Teste {
    public void metodo(String s) {
        System.out.println("String");
    }
    
    public void metodo(Integer i) {
        System.out.println("Integer");
    }
}

// ❌ Erro: ambiguidade
Teste t = new Teste();
t.metodo(null); // Qual método?

// ✅ Correto: casting explícito
t.metodo((String) null);
t.metodo((Integer) null);
```

### 4. Varargs Menos Específico

```java
public void metodo(int a, int b) { }
public void metodo(int... numeros) { }

metodo(1, 2); // Chama: metodo(int, int) - mais específico
```

### 5. Confusão com Sobrescrita

```java
// Sobrecarga (overloading): mesmo nome, parâmetros diferentes
public void metodo(int x) { }
public void metodo(double x) { }

// Sobrescrita (overriding): redefinir em subclasse
@Override
public void metodo() { }
```

### 6. Modificadores Não Diferenciam

```java
// ❌ Erro: apenas modificador diferente
public void metodo(int x) { }
private void metodo(int x) { } // Erro

// ❌ Erro: apenas exceção diferente
public void metodo(int x) { }
public void metodo(int x) throws Exception { } // Erro
```

---

## Boas Práticas

### 1. Nomes Descritivos Para Comportamentos Diferentes

```java
// ❌ Ruim: sobrecarga com comportamentos muito diferentes
public void processar(String arquivo) {
    // Lê arquivo
}

public void processar(int numero) {
    // Faz cálculo matemático
}

// ✅ Bom: nomes diferentes para comportamentos diferentes
public void lerArquivo(String arquivo) { }
public void calcular(int numero) { }
```

### 2. Use Sobrecarga Para Conveniência

```java
public class DateFormatter {
    public String formatar(LocalDate data) {
        return formatar(data, "dd/MM/yyyy");
    }
    
    public String formatar(LocalDate data, String padrao) {
        return data.format(DateTimeFormatter.ofPattern(padrao));
    }
}
```

### 3. Construtores Com Delegação

```java
public class Produto {
    private String nome;
    private double preco;
    private String categoria;
    
    public Produto(String nome) {
        this(nome, 0.0);
    }
    
    public Produto(String nome, double preco) {
        this(nome, preco, "Geral");
    }
    
    public Produto(String nome, double preco, String categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
    }
}
```

### 4. Evite Ambiguidade

```java
// ❌ Ambíguo
public void metodo(int a, double b) { }
public void metodo(double a, int b) { }

// ✅ Claro
public void metodoIntDouble(int a, double b) { }
public void metodoDoubleInt(double a, int b) { }
```

### 5. Varargs Como Último Recurso

```java
public class Math {
    public int max(int a, int b) {
        return a > b ? a : b;
    }
    
    public int max(int a, int b, int c) {
        return max(max(a, b), c);
    }
    
    // Varargs para casos gerais
    public int max(int... numeros) {
        if (numeros.length == 0) {
            throw new IllegalArgumentException("Pelo menos um número");
        }
        int max = numeros[0];
        for (int n : numeros) {
            if (n > max) max = n;
        }
        return max;
    }
}
```

### 6. Sobrecarga com Tipos Wrapper e Primitivos

```java
public class Processador {
    // Primitivo: performance
    public void processar(int valor) {
        System.out.println("Primitivo: " + valor);
    }
    
    // Wrapper: null-safety
    public void processar(Integer valor) {
        if (valor == null) {
            System.out.println("Valor nulo");
        } else {
            processar(valor.intValue());
        }
    }
}
```

### 7. Builder Pattern Com Sobrecarga

```java
public class EmailBuilder {
    private String to;
    private String subject;
    private String body;
    
    public EmailBuilder to(String to) {
        this.to = to;
        return this;
    }
    
    public EmailBuilder subject(String subject) {
        this.subject = subject;
        return this;
    }
    
    public EmailBuilder body(String body) {
        this.body = body;
        return this;
    }
    
    public Email build() {
        return new Email(to, subject, body);
    }
}
```

### 8. Métodos Utilitários

```java
public class StringUtils {
    public static boolean isEmpty(String str) {
        return str == null || str.isEmpty();
    }
    
    public static boolean isEmpty(String str, boolean trim) {
        if (trim) {
            return str == null || str.trim().isEmpty();
        }
        return isEmpty(str);
    }
    
    public static String defaultString(String str) {
        return defaultString(str, "");
    }
    
    public static String defaultString(String str, String defaultValue) {
        return str == null ? defaultValue : str;
    }
}
```

### 9. Evite Muitas Sobrecargas

```java
// ❌ Confuso: muitas sobrecargas
public void metodo(int a) { }
public void metodo(int a, int b) { }
public void metodo(int a, int b, int c) { }
public void metodo(int a, int b, int c, int d) { }
public void metodo(int... numeros) { }

// ✅ Melhor: apenas essenciais
public void metodo(int a) { }
public void metodo(int a, int b) { }
public void metodo(int... numeros) { }
```

---

## Resumo

**Sobrecarga**:
```java
public class Calc {
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
```

**Diferenciação**:
- ✅ Quantidade de parâmetros
- ✅ Tipo de parâmetros
- ✅ Ordem de parâmetros
- ❌ Tipo de retorno
- ❌ Modificadores
- ❌ Exceções

**Compile-time**:
```java
calc.somar(5, 3);     // Compilador escolhe: int somar(int, int)
calc.somar(5.5, 3.2); // Compilador escolhe: double somar(double, double)
```

**Construtores**:
```java
public Pessoa() {
    this("Desconhecido", 0);
}

public Pessoa(String nome) {
    this(nome, 0);
}

public Pessoa(String nome, int idade) {
    this.nome = nome;
    this.idade = idade;
}
```

**Promoção**:
```java
public void metodo(int x) { }
public void metodo(long x) { }

byte b = 5;
metodo(b); // byte → int
```

**Ambiguidade**:
```java
// ❌ Ambíguo
public void metodo(int a, double b) { }
public void metodo(double a, int b) { }

metodo(5, 10); // Qual método?
```

**Varargs**:
```java
public void metodo(int a, int b) { }      // Mais específico
public void metodo(int... numeros) { }    // Menos específico

metodo(1, 2); // Chama: metodo(int, int)
```

**Quando usar**:
- ✅ Mesma operação, tipos diferentes
- ✅ Múltiplas formas de inicialização
- ✅ API mais conveniente
- ❌ Comportamentos muito diferentes (use nomes diferentes)

**Regra de Ouro**: Use **sobrecarga** para **mesma operação** com **diferentes tipos/quantidades** de parâmetros. Resolução em **compile-time**. Evite **ambiguidade** e **muitas sobrecargas**.
