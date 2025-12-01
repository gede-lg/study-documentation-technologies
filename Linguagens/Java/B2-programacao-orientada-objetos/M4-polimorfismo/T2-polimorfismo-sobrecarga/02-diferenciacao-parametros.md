# T2.02 - Diferenciação por Parâmetros (Quantidade, Tipo, Ordem)

## Introdução

**Diferenciação por parâmetros**: sobrecarga usa **lista de parâmetros** para distinguir métodos com mesmo nome.

**Três formas de diferenciação**:
1. **Quantidade** de parâmetros
2. **Tipo** dos parâmetros
3. **Ordem** dos parâmetros

**Assinatura do método** = nome + **parâmetros** (quantidade, tipo, ordem).

```java
public class Exemplo {
    // Diferenciação por QUANTIDADE
    public void metodo(int a) { }
    public void metodo(int a, int b) { }
    public void metodo(int a, int b, int c) { }
    
    // Diferenciação por TIPO
    public void processar(int valor) { }
    public void processar(double valor) { }
    public void processar(String valor) { }
    
    // Diferenciação por ORDEM
    public void criar(String nome, int idade) { }
    public void criar(int idade, String nome) { }
}
```

**Regra**: compilador escolhe método baseado nos **argumentos passados**.

---

## Fundamentos

### 1. Diferenciação por Quantidade de Parâmetros

**Diferentes quantidades** = assinaturas diferentes.

```java
public class Somador {
    // 2 parâmetros
    public int somar(int a, int b) {
        return a + b;
    }
    
    // 3 parâmetros
    public int somar(int a, int b, int c) {
        return a + b + c;
    }
    
    // 4 parâmetros
    public int somar(int a, int b, int c, int d) {
        return a + b + c + d;
    }
}

// Uso
Somador s = new Somador();
s.somar(5, 10);          // Chama somar(int, int)
s.somar(5, 10, 15);      // Chama somar(int, int, int)
s.somar(5, 10, 15, 20);  // Chama somar(int, int, int, int)
```

### 2. Diferenciação por Tipo de Parâmetros

**Diferentes tipos** = assinaturas diferentes.

```java
public class Conversor {
    // int
    public String converter(int numero) {
        return String.valueOf(numero);
    }
    
    // double
    public String converter(double numero) {
        return String.valueOf(numero);
    }
    
    // boolean
    public String converter(boolean valor) {
        return String.valueOf(valor);
    }
    
    // char
    public String converter(char caractere) {
        return String.valueOf(caractere);
    }
}

// Uso
Conversor c = new Conversor();
c.converter(42);        // Chama converter(int)
c.converter(3.14);      // Chama converter(double)
c.converter(true);      // Chama converter(boolean)
c.converter('A');       // Chama converter(char)
```

### 3. Diferenciação por Ordem de Parâmetros

**Ordem diferente** = assinaturas diferentes.

```java
public class Cadastro {
    // String primeiro, int segundo
    public void cadastrar(String nome, int idade) {
        System.out.println("Nome: " + nome + ", Idade: " + idade);
    }
    
    // int primeiro, String segundo
    public void cadastrar(int idade, String nome) {
        System.out.println("Idade: " + idade + ", Nome: " + nome);
    }
}

// Uso
Cadastro cad = new Cadastro();
cad.cadastrar("João", 25);  // Chama cadastrar(String, int)
cad.cadastrar(25, "João");  // Chama cadastrar(int, String)
```

### 4. Combinação: Quantidade + Tipo

```java
public class Formatador {
    // 1 parâmetro: String
    public String formatar(String texto) {
        return texto.toUpperCase();
    }
    
    // 1 parâmetro: int
    public String formatar(int numero) {
        return String.format("%05d", numero);
    }
    
    // 2 parâmetros: String, int
    public String formatar(String texto, int largura) {
        return String.format("%" + largura + "s", texto);
    }
    
    // 2 parâmetros: int, int
    public String formatar(int numero, int casasDecimais) {
        return String.format("%." + casasDecimais + "f", (double) numero);
    }
}
```

### 5. Combinação: Tipo + Ordem

```java
public class Relatorio {
    // String, int
    public void gerar(String titulo, int paginas) {
        System.out.println("Relatório: " + titulo + " (" + paginas + " páginas)");
    }
    
    // int, String
    public void gerar(int codigo, String descricao) {
        System.out.println("Código: " + codigo + ", " + descricao);
    }
    
    // String, String
    public void gerar(String autor, String conteudo) {
        System.out.println("Autor: " + autor + ", Conteúdo: " + conteudo);
    }
}
```

### 6. Primitivos vs Wrapper Classes

```java
public class Teste {
    // Primitivo
    public void processar(int valor) {
        System.out.println("Primitivo int: " + valor);
    }
    
    // Wrapper
    public void processar(Integer valor) {
        System.out.println("Wrapper Integer: " + valor);
    }
}

// Uso
Teste t = new Teste();
t.processar(10);                    // Primitivo
t.processar(Integer.valueOf(10));  // Wrapper
```

### 7. Arrays vs Elementos Individuais

```java
public class Processador {
    // Elemento individual
    public int processar(int numero) {
        return numero * 2;
    }
    
    // Array
    public int[] processar(int[] numeros) {
        int[] resultado = new int[numeros.length];
        for (int i = 0; i < numeros.length; i++) {
            resultado[i] = numeros[i] * 2;
        }
        return resultado;
    }
}

// Uso
Processador p = new Processador();
int r1 = p.processar(5);                    // Elemento
int[] r2 = p.processar(new int[]{1, 2, 3}); // Array
```

### 8. Tipos Genéricos

```java
public class Container {
    // String
    public void adicionar(String item) {
        System.out.println("String: " + item);
    }
    
    // Integer
    public void adicionar(Integer item) {
        System.out.println("Integer: " + item);
    }
    
    // List<String>
    public void adicionar(List<String> itens) {
        System.out.println("List<String>: " + itens);
    }
    
    // List<Integer>
    public void adicionar(List<Integer> itens) {
        System.out.println("List<Integer>: " + itens);
    }
}
```

### 9. Superclasse vs Subclasse

```java
public class Handler {
    // Superclasse
    public void tratar(Object obj) {
        System.out.println("Object: " + obj);
    }
    
    // Subclasse
    public void tratar(String str) {
        System.out.println("String: " + str);
    }
    
    // Subclasse
    public void tratar(Integer num) {
        System.out.println("Integer: " + num);
    }
}

// Uso
Handler h = new Handler();
h.tratar(new Object());  // Chama tratar(Object)
h.tratar("Java");        // Chama tratar(String)
h.tratar(42);            // Chama tratar(Integer)
```

### 10. Interfaces vs Implementações

```java
public class Executor {
    // Interface
    public void executar(Runnable tarefa) {
        System.out.println("Runnable");
        tarefa.run();
    }
    
    // Interface
    public void executar(Callable<String> tarefa) throws Exception {
        System.out.println("Callable");
        String resultado = tarefa.call();
    }
}
```

---

## Aplicabilidade

**Use diferenciação por parâmetros quando**:
- **Mesma operação** aceita diferentes tipos de entrada
- **Valores padrão**: métodos com menos parâmetros chamam com mais
- **Flexibilidade**: usuário escolhe como chamar
- **Conversões**: processar diferentes representações
- **APIs amigáveis**: nome consistente

**Exemplos**:
```java
// System.out.println()
println(int)
println(double)
println(String)
println(Object)

// String.valueOf()
valueOf(int)
valueOf(long)
valueOf(double)
valueOf(char)
valueOf(Object)
```

---

## Armadilhas

### 1. Ordem Invertida Pode Confundir

```java
public class Exemplo {
    public void metodo(String nome, int idade) {
        System.out.println(nome + ": " + idade);
    }
    
    public void metodo(int idade, String nome) {
        System.out.println(idade + ": " + nome);
    }
}

// ⚠️ Fácil inverter argumentos
Exemplo e = new Exemplo();
e.metodo("João", 25);  // OK
e.metodo(25, "João");  // OK, mas ordem diferente
```

### 2. Ambiguidade com Tipos Compatíveis

```java
public class Teste {
    public void metodo(int a, double b) {
        System.out.println("int, double");
    }
    
    public void metodo(double a, int b) {
        System.out.println("double, int");
    }
}

// ❌ Erro de compilação: ambíguo
Teste t = new Teste();
t.metodo(5, 10); // int, int - qual método chamar?
```

### 3. Promoção de Tipos Primitivos

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
byte b = 5;
t.metodo(b); // Chama metodo(int) - promoção byte → int
```

### 4. Autoboxing Pode Causar Ambiguidade

```java
public class Teste {
    public void metodo(Integer a) {
        System.out.println("Integer");
    }
    
    public void metodo(int a) {
        System.out.println("int");
    }
}

Teste t = new Teste();
t.metodo(10); // Chama metodo(int) - primitivo preferido
```

### 5. Null e Sobrecarga

```java
public class Teste {
    public void metodo(String s) {
        System.out.println("String");
    }
    
    public void metodo(Integer i) {
        System.out.println("Integer");
    }
}

Teste t = new Teste();
t.metodo(null); // ❌ Erro: ambíguo (String e Integer aceitam null)
```

### 6. Varargs vs Array

```java
// ❌ Conflito: varargs = array
public void metodo(int... numeros) { }
public void metodo(int[] numeros) { } // Erro!
```

### 7. Generics e Type Erasure

```java
// ❌ Erro: type erasure torna assinaturas iguais
public void metodo(List<String> lista) { }
public void metodo(List<Integer> lista) { } // Erro em runtime
```

---

## Boas Práticas

### 1. Priorize Clareza sobre Quantidade

```java
// ❌ Evite: muitas combinações confusas
public void processar(int a, String b) { }
public void processar(String a, int b) { }
public void processar(int a, int b) { }
public void processar(String a, String b) { }

// ✅ Melhor: nomes descritivos ou Builder
public void processarComCodigo(int codigo, String descricao) { }
public void processarComNome(String nome, int quantidade) { }
```

### 2. Delegação para Método Mais Completo

```java
public class Conexao {
    // Mais completo
    public void conectar(String host, int porta, int timeout) {
        System.out.println("Conectando: " + host + ":" + porta);
    }
    
    // Delega com valor padrão
    public void conectar(String host, int porta) {
        conectar(host, porta, 5000);
    }
    
    // Delega com valores padrão
    public void conectar(String host) {
        conectar(host, 8080, 5000);
    }
}
```

### 3. Match Exato Preferido

```java
public class Teste {
    public void metodo(Object obj) {
        System.out.println("Object");
    }
    
    public void metodo(String str) {
        System.out.println("String");
    }
}

Teste t = new Teste();
t.metodo("Java"); // "String" - match exato preferido
t.metodo(new Object()); // "Object"
```

### 4. StringBuilder: Múltiplos Tipos

```java
public class StringBuilder {
    public StringBuilder append(String str) { return this; }
    public StringBuilder append(int i) { return this; }
    public StringBuilder append(long lng) { return this; }
    public StringBuilder append(double d) { return this; }
    public StringBuilder append(char c) { return this; }
    public StringBuilder append(boolean b) { return this; }
    public StringBuilder append(Object obj) { return this; }
}

// Uso
new StringBuilder()
    .append("Java ")
    .append(17)
    .append(' ')
    .append(true);
```

### 5. Construtores com Valores Padrão

```java
public class Usuario {
    private String nome;
    private int idade;
    private String email;
    
    // Construtor completo
    public Usuario(String nome, int idade, String email) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }
    
    // Construtor sem email
    public Usuario(String nome, int idade) {
        this(nome, idade, "sem-email@exemplo.com");
    }
    
    // Construtor mínimo
    public Usuario(String nome) {
        this(nome, 0, "sem-email@exemplo.com");
    }
}
```

### 6. Arrays.asList() com Varargs

```java
// Arrays.asList usa varargs
public static <T> List<T> asList(T... a) {
    return new ArrayList<>(a);
}

// Chamadas válidas
Arrays.asList("A", "B", "C");        // 3 parâmetros
Arrays.asList("A");                  // 1 parâmetro
Arrays.asList();                     // 0 parâmetros
Arrays.asList(new String[]{"A", "B"}); // Array
```

### 7. Math: Múltiplos Tipos

```java
public final class Math {
    public static int max(int a, int b) {
        return (a >= b) ? a : b;
    }
    
    public static long max(long a, long b) {
        return (a >= b) ? a : b;
    }
    
    public static float max(float a, float b) {
        return (a >= b) ? a : b;
    }
    
    public static double max(double a, double b) {
        return (a >= b) ? a : b;
    }
}
```

### 8. Collections.sort()

```java
public class Collections {
    // Com Comparator
    public static <T> void sort(List<T> list, Comparator<? super T> c) {
        list.sort(c);
    }
    
    // Sem Comparator (ordem natural)
    public static <T extends Comparable<? super T>> void sort(List<T> list) {
        list.sort(null);
    }
}
```

---

## Resumo

**Três formas de diferenciação**:

**1. Quantidade**:
```java
public void metodo(int a) { }
public void metodo(int a, int b) { }
public void metodo(int a, int b, int c) { }
```

**2. Tipo**:
```java
public void metodo(int a) { }
public void metodo(double a) { }
public void metodo(String a) { }
```

**3. Ordem**:
```java
public void metodo(String a, int b) { }
public void metodo(int a, String b) { }
```

**Assinatura**:
```java
// nome + parâmetros
metodo(int)
metodo(double)
metodo(String)
metodo(int, int)
metodo(String, int)
metodo(int, String)
```

**Compilador escolhe**:
```java
Teste t = new Teste();
t.metodo(10);        // metodo(int)
t.metodo(10.5);      // metodo(double)
t.metodo("Java");    // metodo(String)
t.metodo(10, 20);    // metodo(int, int)
```

**Combinações**:
- ✅ Quantidade + Tipo
- ✅ Tipo + Ordem
- ✅ Quantidade + Tipo + Ordem

**Preferência**:
1. Match exato
2. Promoção de tipos (widening)
3. Autoboxing/unboxing
4. Varargs

**Evitar**:
- ❌ Ambiguidade
- ❌ Ordem invertida confusa
- ❌ Muitas combinações

**Regra de Ouro**: Use **quantidade**, **tipo** ou **ordem** de parâmetros para diferenciar métodos sobrecarregados. Compilador escolhe baseado nos **argumentos passados**. Prefira **delegação** para valores padrão. Evite **ambiguidade**.
