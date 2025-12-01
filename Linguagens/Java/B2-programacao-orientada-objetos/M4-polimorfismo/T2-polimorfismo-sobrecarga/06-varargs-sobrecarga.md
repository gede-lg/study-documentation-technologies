# T2.06 - Varargs e Sobrecarga

## Introdução

**Varargs** (variable arguments): permite passar **número variável** de argumentos, usando `tipo...`.

```java
public void metodo(int... numeros) {
    // numeros é tratado como int[]
}

// Chamadas
metodo();           // 0 argumentos
metodo(1);          // 1 argumento
metodo(1, 2);       // 2 argumentos
metodo(1, 2, 3, 4); // 4 argumentos
```

**Sobrecarga com varargs**:
- **Compatível** com sobrecarga
- **Menor prioridade** que métodos com parâmetros fixos
- **Ambiguidade** possível com arrays

```java
public class Exemplo {
    public void metodo(int a) {
        System.out.println("Fixo: " + a);
    }
    
    public void metodo(int... numeros) {
        System.out.println("Varargs: " + numeros.length);
    }
}

Exemplo e = new Exemplo();
e.metodo(5);       // Chama fixo: 5
e.metodo(5, 10);   // Chama varargs: 2
e.metodo();        // Chama varargs: 0
```

**Varargs vs Array**: varargs é **sintaxe conveniente** para array, mas compilador trata diferente em sobrecarga.

---

## Fundamentos

### 1. Sintaxe Varargs

**Varargs**: `tipo... nome`.

```java
public class Calculadora {
    // Varargs
    public int somar(int... numeros) {
        int soma = 0;
        for (int n : numeros) {
            soma += n;
        }
        return soma;
    }
}

Calculadora calc = new Calculadora();
calc.somar();           // 0
calc.somar(5);          // 5
calc.somar(5, 10);      // 15
calc.somar(5, 10, 15);  // 30
```

### 2. Varargs é Array

Varargs é **tratado como array** internamente.

```java
public void metodo(int... numeros) {
    System.out.println(numeros.getClass().getName()); // [I (int array)
    System.out.println(numeros.length);
    
    for (int i = 0; i < numeros.length; i++) {
        System.out.println(numeros[i]);
    }
}
```

### 3. Sobrecarga: Fixo vs Varargs

Método com **parâmetros fixos** tem **prioridade** sobre varargs.

```java
public class Teste {
    public void metodo(int a) {
        System.out.println("Fixo: " + a);
    }
    
    public void metodo(int... numeros) {
        System.out.println("Varargs: " + numeros.length);
    }
}

Teste t = new Teste();
t.metodo(5);       // Fixo: 5 (prioridade)
t.metodo(5, 10);   // Varargs: 2
t.metodo();        // Varargs: 0
```

### 4. Varargs vs Array

**Ambiguidade** entre varargs e array.

```java
public class Teste {
    public void metodo(int... numeros) {
        System.out.println("Varargs");
    }
    
    // ❌ Erro: mesma assinatura que varargs
    // public void metodo(int[] numeros) {
    //     System.out.println("Array");
    // }
}

// Varargs e array têm MESMA ASSINATURA
```

### 5. Ordem de Preferência

Compilador escolhe método na seguinte ordem:
1. **Exact match** (parâmetros fixos)
2. **Widening** (int → long)
3. **Autoboxing** (int → Integer)
4. **Varargs**

```java
public class Teste {
    public void metodo(int a, int b) {
        System.out.println("Fixo");
    }
    
    public void metodo(int... numeros) {
        System.out.println("Varargs");
    }
}

Teste t = new Teste();
t.metodo(5, 10);   // Fixo (exact match)
t.metodo(5, 10, 15); // Varargs
```

### 6. Varargs com Outros Parâmetros

Varargs **deve ser último** parâmetro.

```java
// ✅ OK: varargs no final
public void metodo(String nome, int... numeros) {
    System.out.println(nome + ": " + numeros.length);
}

// ❌ Erro: varargs não é último
// public void metodo(int... numeros, String nome) { }
```

### 7. Apenas Um Varargs

Método pode ter **apenas um** varargs.

```java
// ✅ OK: um varargs
public void metodo(int... numeros) { }

// ❌ Erro: dois varargs
// public void metodo(int... numeros, String... textos) { }
```

### 8. Ambiguidade com Múltiplos Varargs

Sobrecarga com **múltiplos varargs** pode causar **ambiguidade**.

```java
public class Teste {
    public void metodo(int... numeros) {
        System.out.println("int");
    }
    
    public void metodo(String... textos) {
        System.out.println("String");
    }
}

Teste t = new Teste();
t.metodo(5, 10);       // int
t.metodo("a", "b");    // String

// ❌ Ambiguidade
// t.metodo(); // Erro: qual método?
```

### 9. Null com Varargs

**Null** pode causar **ambiguidade**.

```java
public class Teste {
    public void metodo(int... numeros) {
        System.out.println("int");
    }
    
    public void metodo(String... textos) {
        System.out.println("String");
    }
}

Teste t = new Teste();
// ❌ Ambiguidade
// t.metodo(null); // Erro: qual método?

// Solução: cast explícito
t.metodo((int[]) null);    // int
t.metodo((String[]) null); // String
```

### 10. Varargs com Generics

**Generics** com varargs gera **warning** (heap pollution).

```java
// ⚠️ Warning: heap pollution
@SafeVarargs
public final <T> void metodo(T... elementos) {
    for (T e : elementos) {
        System.out.println(e);
    }
}

metodo(1, 2, 3);
metodo("a", "b", "c");
```

---

## Aplicabilidade

**Use varargs quando**:
- **Número variável** de argumentos do **mesmo tipo**
- **Quantidade desconhecida** em tempo de desenvolvimento
- **API mais limpa** que passar array
- **Último parâmetro** (pode combinar com fixos)

**Evite varargs quando**:
- **Número fixo** de argumentos
- **Performance crítica** (varargs cria array)
- **Tipos diferentes** (use sobrecarga)
- **Múltiplos grupos** variáveis (impossível)

---

## Armadilhas

### 1. Ambiguidade com Chamada Vazia

```java
public class Teste {
    public void metodo(int... numeros) {
        System.out.println("int");
    }
    
    public void metodo(String... textos) {
        System.out.println("String");
    }
}

Teste t = new Teste();
// ❌ Erro: ambiguidade
// t.metodo(); // Qual método?
```

**Solução**:
```java
// Adicionar método sem parâmetros
public void metodo() {
    System.out.println("Sem parâmetros");
}

t.metodo(); // OK: método sem parâmetros
```

### 2. Varargs vs Array (mesma assinatura)

```java
public class Teste {
    public void metodo(int... numeros) { }
    
    // ❌ Erro: mesma assinatura
    // public void metodo(int[] numeros) { }
}
```

### 3. Varargs Não É Último

```java
// ❌ Erro: varargs deve ser último
// public void metodo(int... numeros, String nome) { }

// ✅ OK
public void metodo(String nome, int... numeros) { }
```

### 4. Múltiplos Varargs

```java
// ❌ Erro: apenas um varargs
// public void metodo(int... numeros, String... textos) { }
```

### 5. Performance: Array Desnecessário

```java
// ⚠️ Cria array mesmo para 0 argumentos
public void metodo(int... numeros) { }

metodo(); // Cria array vazio
```

**Otimização**:
```java
// Sobrecarga para casos comuns
public void metodo() { }
public void metodo(int a) { }
public void metodo(int a, int b) { }
public void metodo(int... numeros) { } // Apenas para 3+
```

### 6. Null Ambiguidade

```java
public void metodo(int... numeros) { }
public void metodo(String... textos) { }

// ❌ Erro
// metodo(null); // Ambiguidade

// ✅ Solução
metodo((int[]) null);
```

### 7. Generics Warning

```java
// ⚠️ Warning: unchecked, heap pollution
public <T> void metodo(T... elementos) { }

// ✅ Solução: @SafeVarargs
@SafeVarargs
public final <T> void metodo(T... elementos) { }
```

---

## Boas Práticas

### 1. Priorize Parâmetros Fixos

```java
// ✅ Melhor: parâmetros fixos
public void metodo(int a, int b) { }

// ⚠️ Varargs apenas se necessário
public void metodo(int... numeros) { }
```

### 2. Valide Varargs Vazio

```java
public void metodo(int... numeros) {
    if (numeros.length == 0) {
        throw new IllegalArgumentException("Pelo menos um número");
    }
}
```

### 3. Sobrecarga para Casos Comuns

```java
// Sobrecarga para 0-2 argumentos (performance)
public void log() {
    log(new Object[0]);
}

public void log(Object msg) {
    log(new Object[]{msg});
}

public void log(Object msg1, Object msg2) {
    log(new Object[]{msg1, msg2});
}

// Varargs para 3+ argumentos
public void log(Object... msgs) {
    for (Object msg : msgs) {
        System.out.println(msg);
    }
}
```

### 4. Arrays.asList com Varargs

```java
// Arrays.asList usa varargs
List<String> lista = Arrays.asList("a", "b", "c");

// Ou array
String[] array = {"a", "b", "c"};
List<String> lista2 = Arrays.asList(array);
```

### 5. @SafeVarargs para Generics

```java
@SafeVarargs
public final <T> void metodo(T... elementos) {
    for (T e : elementos) {
        System.out.println(e);
    }
}

metodo(1, 2, 3);
metodo("a", "b", "c");
```

### 6. Varargs com Parâmetro Obrigatório

```java
// Pelo menos um parâmetro obrigatório
public void metodo(int primeiro, int... resto) {
    System.out.println("Primeiro: " + primeiro);
    System.out.println("Resto: " + resto.length);
}

metodo(5);          // OK
metodo(5, 10);      // OK
metodo(5, 10, 15);  // OK
// metodo();        // ❌ Erro: falta primeiro
```

### 7. Printf/Format Exemplo Real

```java
// printf usa varargs
System.out.printf("Nome: %s, Idade: %d%n", "João", 30);

// Implementação similar
public void printf(String format, Object... args) {
    System.out.println(String.format(format, args));
}
```

### 8. Exemplo StringBuilder

```java
public class StringUtil {
    public static String concatenar(String... strings) {
        StringBuilder sb = new StringBuilder();
        for (String s : strings) {
            sb.append(s);
        }
        return sb.toString();
    }
}

StringUtil.concatenar("a", "b", "c"); // "abc"
```

### 9. Ordem de Preferência Completa

```java
public class Teste {
    public void metodo(int a) {
        System.out.println("1. Exact match");
    }
    
    public void metodo(long a) {
        System.out.println("2. Widening");
    }
    
    public void metodo(Integer a) {
        System.out.println("3. Autoboxing");
    }
    
    public void metodo(int... numeros) {
        System.out.println("4. Varargs");
    }
}

Teste t = new Teste();
t.metodo(5); // 1. Exact match
```

### 10. Varargs com Streams

```java
public class Util {
    public static int somar(int... numeros) {
        return Arrays.stream(numeros).sum();
    }
    
    public static int max(int... numeros) {
        return Arrays.stream(numeros).max().orElse(0);
    }
}

Util.somar(1, 2, 3, 4, 5);     // 15
Util.max(10, 5, 20, 15);       // 20
```

---

## Resumo

**Varargs**: `tipo... nome` - número **variável** de argumentos.

```java
public void metodo(int... numeros) {
    // numeros é int[]
}

metodo();           // 0 argumentos
metodo(5);          // 1 argumento
metodo(5, 10, 15);  // 3 argumentos
```

**Sobrecarga com varargs**:
```java
public void metodo(int a) {
    System.out.println("Fixo");
}

public void metodo(int... numeros) {
    System.out.println("Varargs");
}

metodo(5);       // Fixo (prioridade)
metodo(5, 10);   // Varargs
```

**Ordem de preferência**:
1. **Exact match** (parâmetros fixos)
2. **Widening** (int → long)
3. **Autoboxing** (int → Integer)
4. **Varargs** (última opção)

**Restrições**:
- Varargs **deve ser último** parâmetro
- **Apenas um** varargs por método
- Varargs e array têm **mesma assinatura**

**Ambiguidade**:
```java
public void metodo(int... numeros) { }
public void metodo(String... textos) { }

metodo();    // ❌ Erro: ambiguidade
metodo(null); // ❌ Erro: ambiguidade

// Solução
metodo((int[]) null); // OK
```

**Generics**:
```java
@SafeVarargs
public final <T> void metodo(T... elementos) { }
```

**Quando usar**:
- Número **variável** de argumentos
- API mais **limpa** que array
- **Último** parâmetro

**Evite**:
- Performance **crítica**
- **Múltiplos** grupos variáveis
- **Tipos diferentes**

**Exemplo real**:
```java
// printf usa varargs
System.out.printf("Nome: %s, Idade: %d%n", "João", 30);

// Arrays.asList
List<String> lista = Arrays.asList("a", "b", "c");
```

**Regra de Ouro**: Varargs é **conveniente** para número variável de argumentos, mas tem **menor prioridade** em sobrecarga. **Valide** varargs vazio. Use **@SafeVarargs** com generics. Varargs **deve ser último** parâmetro.
