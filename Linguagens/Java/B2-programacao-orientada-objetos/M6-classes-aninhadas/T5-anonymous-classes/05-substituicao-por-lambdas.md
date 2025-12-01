# T5.05 - Substituição por Lambdas

## Introdução

**Java 8+**: introduziu **lambdas** para substituir anonymous classes.

```java
// Antes (Java 7) - Anonymous class
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
};

// Depois (Java 8+) - Lambda
Runnable r = () -> System.out.println("Running");
```

**Lambda**: mais concisa, menos verbosa.  
**Interface funcional**: apenas UM método abstrato.

---

## Fundamentos

### 1. Interface Funcional vs Anonymous Class

**Interface funcional**: 1 método abstrato.

```java
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b); // Apenas 1 método
}

// Anonymous class (Java 7)
Operacao soma = new Operacao() {
    @Override
    public int executar(int a, int b) {
        return a + b;
    }
};

// Lambda (Java 8+)
Operacao soma2 = (a, b) -> a + b;

System.out.println(soma.executar(10, 5));  // 15
System.out.println(soma2.executar(10, 5)); // 15
```

### 2. Runnable com Lambda

**Runnable**: sem parâmetros, sem retorno.

```java
// Anonymous class
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
};

// Lambda
Runnable r2 = () -> System.out.println("Running");

// Lambda com bloco
Runnable r3 = () -> {
    System.out.println("Linha 1");
    System.out.println("Linha 2");
};

r1.run(); // Running
r2.run(); // Running
r3.run(); // Linha 1 \n Linha 2
```

### 3. Comparator com Lambda

**Comparator**: 2 parâmetros, retorna int.

```java
import java.util.*;

// Anonymous class
Comparator<String> comp1 = new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
};

// Lambda
Comparator<String> comp2 = (a, b) -> a.length() - b.length();

// Usar
List<String> nomes = Arrays.asList("João", "Maria", "Ana");
Collections.sort(nomes, comp2);
System.out.println(nomes); // [Ana, João, Maria]
```

### 4. ActionListener com Lambda

**ActionListener**: 1 parâmetro, sem retorno.

```java
import javax.swing.*;
import java.awt.event.*;

JButton button = new JButton("Click");

// Anonymous class
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("Clicado!");
    }
});

// Lambda
button.addActionListener(e -> System.out.println("Clicado!"));
```

### 5. Callback com Lambda

**Callback**: customizado, 1 método.

```java
@FunctionalInterface
public interface Callback {
    void onComplete(String resultado);
}

public class Processador {
    public void processar(String dados, Callback callback) {
        String resultado = dados.toUpperCase();
        callback.onComplete(resultado);
    }
}

Processador proc = new Processador();

// Anonymous class
proc.processar("teste", new Callback() {
    @Override
    public void onComplete(String resultado) {
        System.out.println("Resultado: " + resultado);
    }
});

// Lambda
proc.processar("teste", resultado -> System.out.println("Resultado: " + resultado));
```

### 6. Predicate com Lambda

**Predicate**: testa condição.

```java
import java.util.function.Predicate;

// Anonymous class
Predicate<Integer> ehPar = new Predicate<Integer>() {
    @Override
    public boolean test(Integer n) {
        return n % 2 == 0;
    }
};

// Lambda
Predicate<Integer> ehPar2 = n -> n % 2 == 0;

System.out.println(ehPar.test(10));  // true
System.out.println(ehPar2.test(11)); // false
```

### 7. Function com Lambda

**Function**: recebe tipo T, retorna tipo R.

```java
import java.util.function.Function;

// Anonymous class
Function<String, Integer> tamanho = new Function<String, Integer>() {
    @Override
    public Integer apply(String s) {
        return s.length();
    }
};

// Lambda
Function<String, Integer> tamanho2 = s -> s.length();

System.out.println(tamanho.apply("teste"));  // 5
System.out.println(tamanho2.apply("teste")); // 5
```

### 8. Consumer com Lambda

**Consumer**: recebe parâmetro, sem retorno.

```java
import java.util.function.Consumer;

// Anonymous class
Consumer<String> imprimir = new Consumer<String>() {
    @Override
    public void accept(String s) {
        System.out.println(s);
    }
};

// Lambda
Consumer<String> imprimir2 = s -> System.out.println(s);

// Method reference (ainda mais conciso)
Consumer<String> imprimir3 = System.out::println;

imprimir.accept("Teste");  // Teste
imprimir2.accept("Teste"); // Teste
imprimir3.accept("Teste"); // Teste
```

### 9. Supplier com Lambda

**Supplier**: sem parâmetro, retorna valor.

```java
import java.util.function.Supplier;

// Anonymous class
Supplier<Double> random = new Supplier<Double>() {
    @Override
    public Double get() {
        return Math.random();
    }
};

// Lambda
Supplier<Double> random2 = () -> Math.random();

// Method reference
Supplier<Double> random3 = Math::random;

System.out.println(random.get());  // 0.xyz
System.out.println(random2.get()); // 0.xyz
System.out.println(random3.get()); // 0.xyz
```

### 10. Quando NÃO Usar Lambda

**Múltiplos métodos**: lambda não funciona.

```java
public interface Calculadora {
    int somar(int a, int b);
    int subtrair(int a, int b); // 2 métodos!
}

// ❌ ERRO: não é interface funcional (2 métodos)
// Calculadora calc = (a, b) -> a + b; // Não compila

// ✅ Usar anonymous class
Calculadora calc = new Calculadora() {
    @Override
    public int somar(int a, int b) {
        return a + b;
    }
    
    @Override
    public int subtrair(int a, int b) {
        return a - b;
    }
};
```

---

## Aplicabilidade

**Usar lambda quando**:
- Interface funcional (1 método)
- Código conciso
- Java 8+

**Usar anonymous class quando**:
- Múltiplos métodos
- Campos próprios
- Bloco de inicialização
- Java 7 ou anterior

---

## Armadilhas

### 1. Tentar Lambda com Múltiplos Métodos

```java
public interface Teste {
    void metodo1();
    void metodo2(); // 2 métodos!
}

// ❌ ERRO: não é interface funcional
// Teste t = () -> { /* ... */ }; // Não compila

// ✅ Usar anonymous class
Teste t = new Teste() {
    @Override
    public void metodo1() { }
    
    @Override
    public void metodo2() { }
};
```

### 2. Confundir Sintaxe de Lambda

```java
// ❌ ERRO: sintaxe incorreta
// Runnable r = -> System.out.println("Teste"); // Falta ()

// ✅ 0 parâmetros = ()
Runnable r = () -> System.out.println("Teste");

// ✅ 1 parâmetro = sem ()
Consumer<String> c = s -> System.out.println(s);

// ✅ 2+ parâmetros = com ()
Comparator<String> comp = (a, b) -> a.compareTo(b);
```

### 3. Esquecer Chaves para Múltiplas Linhas

```java
// ❌ ERRO: múltiplas linhas sem {}
// Runnable r = () ->
//     System.out.println("Linha 1");
//     System.out.println("Linha 2"); // Erro

// ✅ {} para múltiplas linhas
Runnable r = () -> {
    System.out.println("Linha 1");
    System.out.println("Linha 2");
};
```

### 4. Esquecer return em Lambda com Bloco

```java
// ❌ ERRO: bloco sem return
// Function<String, Integer> f = s -> {
//     s.length(); // Falta return
// };

// ✅ return em bloco
Function<String, Integer> f = s -> {
    return s.length(); // ✅
};

// ✅ Sem bloco = return implícito
Function<String, Integer> f2 = s -> s.length();
```

### 5. Tentar Acessar this de Forma Incorreta

```java
public class Teste {
    private String nome = "Teste";
    
    public void metodo() {
        // Anonymous class: this = instância da anonymous class
        Runnable r1 = new Runnable() {
            @Override
            public void run() {
                // this = Runnable
                // Teste.this.nome para acessar classe externa
                System.out.println(Teste.this.nome);
            }
        };
        
        // Lambda: this = instância da classe externa
        Runnable r2 = () -> {
            // this = Teste
            System.out.println(this.nome); // ✅
        };
    }
}
```

---

## Boas Práticas

### 1. Preferir Lambda para Interface Funcional

```java
// ❌ Anonymous class verbosa
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
};

// ✅ Lambda concisa
Runnable r2 = () -> System.out.println("Running");
```

### 2. Method Reference para Ainda Mais Conciso

```java
// Lambda
Consumer<String> c1 = s -> System.out.println(s);

// ✅ Method reference (ainda mais conciso)
Consumer<String> c2 = System.out::println;

// Lambda
Function<String, Integer> f1 = s -> s.length();

// ✅ Method reference
Function<String, Integer> f2 = String::length;
```

### 3. Usar Interfaces Funcionais do java.util.function

```java
import java.util.function.*;

// ✅ Predicate<T> - T -> boolean
Predicate<Integer> ehPar = n -> n % 2 == 0;

// ✅ Function<T, R> - T -> R
Function<String, Integer> tamanho = String::length;

// ✅ Consumer<T> - T -> void
Consumer<String> imprimir = System.out::println;

// ✅ Supplier<T> - () -> T
Supplier<Double> random = Math::random;

// ✅ BiFunction<T, U, R> - (T, U) -> R
BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;
```

### 4. Limitar Lambda a 1-3 Linhas

```java
// ❌ Lambda muito grande
Function<String, String> processar = s -> {
    // 20 linhas de código...
    // Difícil de ler
    return resultado;
};

// ✅ Extrair para método
Function<String, String> processar2 = this::processarString;

private String processarString(String s) {
    // Código complexo aqui
    return resultado;
}
```

### 5. Usar @FunctionalInterface

```java
// ✅ @FunctionalInterface documenta intenção
@FunctionalInterface
public interface Callback {
    void onComplete(String resultado);
    
    // ❌ ERRO: 2 métodos abstratos não compila
    // void onError(Exception e);
}
```

---

## Resumo

**Lambda**: substitui anonymous class para **interface funcional** (1 método).

```java
// Anonymous class (Java 7)
Interface var = new Interface() {
    @Override
    public Tipo metodo(Params params) {
        return resultado;
    }
};

// Lambda (Java 8+)
Interface var = params -> resultado;
```

**Sintaxe de lambda**:
- 0 parâmetros: `() -> corpo`
- 1 parâmetro: `p -> corpo` (sem `()`)
- 2+ parâmetros: `(p1, p2) -> corpo` (com `()`)
- 1 linha: `p -> resultado` (sem `{}`, return implícito)
- Múltiplas linhas: `p -> { linhas; return resultado; }` (com `{}`, return explícito)

**Interfaces funcionais comuns**:
- `Runnable` - `() -> void`
- `Comparator<T>` - `(T, T) -> int`
- `Predicate<T>` - `T -> boolean`
- `Function<T, R>` - `T -> R`
- `Consumer<T>` - `T -> void`
- `Supplier<T>` - `() -> T`
- `BiFunction<T, U, R>` - `(T, U) -> R`

**Anonymous class vs Lambda**:
| Aspecto | Anonymous Class | Lambda |
|---------|----------------|--------|
| Verbosidade | Alta | Baixa |
| Interface funcional | ✅ | ✅ |
| Múltiplos métodos | ✅ | ❌ |
| Campos próprios | ✅ | ❌ |
| `this` | Classe anônima | Classe externa |
| Java versão | 1.1+ | 8+ |

**Quando usar lambda**:
- Interface funcional (1 método)
- Código conciso (1-3 linhas)
- Java 8+

**Quando usar anonymous class**:
- Múltiplos métodos
- Campos próprios
- Bloco de inicialização
- Java 7 ou anterior

**Boas práticas**:
- Preferir lambda para interface funcional
- Method reference para mais conciso
- Usar interfaces do `java.util.function`
- Limitar lambda a 1-3 linhas
- `@FunctionalInterface` para documentar

**Regra de Ouro**: Para **interface funcional** (1 método) em **Java 8+**, use **lambda** em vez de anonymous class. Lambda = `params -> corpo` (mais concisa). Anonymous class = necessária para **múltiplos métodos** ou **campos próprios**. Use **method reference** (`Classe::metodo`) para ainda mais conciso.
