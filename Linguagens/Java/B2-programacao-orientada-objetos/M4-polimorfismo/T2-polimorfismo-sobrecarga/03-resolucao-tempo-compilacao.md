# T2.03 - Resolução em Tempo de Compilação

## Introdução

**Resolução em tempo de compilação (Compile-time Resolution)**: decisão de **qual método sobrecarregado** executar acontece durante a **compilação**, não em runtime.

**Sobrecarga = Polimorfismo estático** (Static Polymorphism).

**Compilador analisa**:
- Tipo dos **argumentos passados**
- **Assinatura** dos métodos disponíveis
- **Melhor match** (exact, widening, boxing)

```java
public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }
    
    public double somar(double a, double b) {
        return a + b;
    }
}

// Compilação: compilador decide qual método chamar
Calculadora calc = new Calculadora();
calc.somar(5, 10);     // Compilador: somar(int, int)
calc.somar(5.5, 10.2); // Compilador: somar(double, double)
```

**Diferença de Sobrescrita (Runtime)**:
- **Sobrecarga**: compile-time (early binding)
- **Sobrescrita**: runtime (late binding)

---

## Fundamentos

### 1. Compile-Time vs Runtime

```java
// Sobrecarga: compile-time
public class Teste {
    public void metodo(int a) {
        System.out.println("int");
    }
    
    public void metodo(double a) {
        System.out.println("double");
    }
}

Teste t = new Teste();
t.metodo(10);   // Compilador decide: metodo(int)
t.metodo(10.5); // Compilador decide: metodo(double)

// Sobrescrita: runtime
Animal a = new Cachorro(); // Tipo da referência: Animal
a.som(); // Runtime: JVM decide qual som() executar
```

### 2. Análise da Assinatura

**Compilador analisa assinatura** (nome + parâmetros).

```java
public class Processador {
    public void processar(int valor) {
        System.out.println("int: " + valor);
    }
    
    public void processar(String texto) {
        System.out.println("String: " + texto);
    }
}

// Compilação
Processador p = new Processador();
p.processar(42);      // Compilador: assinatura = processar(int)
p.processar("Java");  // Compilador: assinatura = processar(String)
```

### 3. Match Exato (Exact Match)

**Preferência**: match **exato** dos tipos.

```java
public class Teste {
    public void metodo(int a) {
        System.out.println("int");
    }
    
    public void metodo(long a) {
        System.out.println("long");
    }
    
    public void metodo(double a) {
        System.out.println("double");
    }
}

Teste t = new Teste();
t.metodo(10);    // "int" - match exato
t.metodo(10L);   // "long" - match exato
t.metodo(10.5);  // "double" - match exato
```

### 4. Widening (Promoção de Tipos)

Se **não há match exato**, compilador tenta **widening** (conversão implícita).

```java
public class Teste {
    public void metodo(int a) {
        System.out.println("int");
    }
    
    public void metodo(double a) {
        System.out.println("double");
    }
}

Teste t = new Teste();
byte b = 5;
t.metodo(b); // "int" - widening: byte → int

short s = 10;
t.metodo(s); // "int" - widening: short → int

float f = 5.5f;
t.metodo(f); // "double" - widening: float → double
```

### 5. Boxing/Unboxing

Se **não há match exato ou widening**, compilador tenta **boxing/unboxing**.

```java
public class Teste {
    public void metodo(Integer a) {
        System.out.println("Integer");
    }
}

Teste t = new Teste();
t.metodo(10); // Autoboxing: int → Integer

// Ordem de preferência:
// 1. Exact match: metodo(int)
// 2. Widening: metodo(long)
// 3. Boxing: metodo(Integer)
```

### 6. Varargs (Última Opção)

**Varargs** tem **menor prioridade**.

```java
public class Teste {
    public void metodo(int a) {
        System.out.println("int");
    }
    
    public void metodo(int... a) {
        System.out.println("varargs");
    }
}

Teste t = new Teste();
t.metodo(10);       // "int" - exact match
t.metodo(10, 20);   // "varargs" - múltiplos argumentos
t.metodo();         // "varargs" - sem argumentos
```

### 7. Tipo da Referência, Não do Objeto

**Compilador usa tipo da REFERÊNCIA**, não do objeto.

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

// Tipo da referência: String
String s = "Java";
t.metodo(s); // "String" - tipo da referência

// Tipo da referência: Object, objeto: String
Object obj = "Java";
t.metodo(obj); // "Object" - tipo da REFERÊNCIA
```

### 8. Erro de Compilação em Ambiguidade

**Compilador detecta ambiguidade** e gera erro.

```java
public class Teste {
    public void metodo(int a, double b) {
        System.out.println("int, double");
    }
    
    public void metodo(double a, int b) {
        System.out.println("double, int");
    }
}

Teste t = new Teste();
t.metodo(10, 20); // ❌ Erro de compilação: ambíguo
// Poderia ser metodo(int, double) com widening em 20
// Poderia ser metodo(double, int) com widening em 10
```

### 9. Bytecode Contém Chamada Específica

**Bytecode** já contém qual método chamar.

```java
public class Main {
    public static void main(String[] args) {
        Teste t = new Teste();
        t.metodo(10);
    }
}

// Bytecode (simplificado):
// invokevirtual #2 // Teste.metodo:(I)V
// (I) = int, (V) = void
// Compilador já decidiu qual método
```

### 10. Compilador vs JVM

```java
// Sobrecarga: COMPILADOR decide
public class Teste {
    public void metodo(int a) { }
    public void metodo(double a) { }
}
Teste t = new Teste();
t.metodo(10); // Compilador: metodo(int)

// Sobrescrita: JVM decide
public class Animal {
    public void som() { }
}
public class Cachorro extends Animal {
    @Override
    public void som() { }
}
Animal a = new Cachorro();
a.som(); // JVM (runtime): Cachorro.som()
```

---

## Aplicabilidade

**Resolução em compile-time**:
- ✅ **Detecção precoce** de erros
- ✅ **Performance**: sem overhead de runtime
- ✅ **Type safety**: compilador verifica tipos
- ✅ **IDE support**: autocomplete preciso

**Quando usar sobrecarga**:
- Mesma operação com diferentes tipos
- Valores padrão (delegação)
- APIs amigáveis

---

## Armadilhas

### 1. Tipo da Referência vs Tipo do Objeto

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

String s = "Java";
t.metodo(s); // "String" - tipo da referência

Object obj = "Java"; // Objeto é String, referência é Object
t.metodo(obj); // "Object" - compilador usa tipo da REFERÊNCIA
```

### 2. Ambiguidade Não Detectada em Runtime

```java
public class Teste {
    public void metodo(int a, double b) { }
    public void metodo(double a, int b) { }
}

Teste t = new Teste();
t.metodo(10, 20); // ❌ Erro de COMPILAÇÃO, não runtime
```

### 3. Null e Sobrecarga

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

// ✅ Cast explícito
t.metodo((String) null); // "String"
```

### 4. Promoção de Tipos Pode Surpreender

```java
public class Teste {
    public void metodo(long a) {
        System.out.println("long");
    }
}

Teste t = new Teste();
int i = 10;
t.metodo(i); // "long" - widening: int → long

// ⚠️ Se adicionar metodo(int):
public void metodo(int a) {
    System.out.println("int");
}
// Agora t.metodo(i) chama metodo(int) - exact match
```

### 5. Boxing vs Widening

```java
public class Teste {
    public void metodo(long a) {
        System.out.println("long");
    }
    
    public void metodo(Integer a) {
        System.out.println("Integer");
    }
}

Teste t = new Teste();
int i = 10;
t.metodo(i); // "long" - widening preferido sobre boxing
```

### 6. Varargs Última Prioridade

```java
public class Teste {
    public void metodo(int a) {
        System.out.println("int");
    }
    
    public void metodo(int... a) {
        System.out.println("varargs");
    }
}

Teste t = new Teste();
t.metodo(10); // "int" - exact match preferido
```

### 7. Generics e Type Erasure

```java
// ❌ Erro: type erasure torna métodos idênticos
public void metodo(List<String> lista) { }
public void metodo(List<Integer> lista) { }
// Após erasure: ambos são metodo(List)
```

---

## Boas Práticas

### 1. Prefira Match Exato

```java
// ✅ Bom: match exato evita surpresas
Teste t = new Teste();
t.metodo(10);      // int → metodo(int)
t.metodo(10L);     // long → metodo(long)
t.metodo(10.5);    // double → metodo(double)
```

### 2. Evite Ambiguidade

```java
// ❌ Evite: ambíguo
public void metodo(int a, double b) { }
public void metodo(double a, int b) { }

// ✅ Melhor: métodos distintos
public void metodoIntDouble(int a, double b) { }
public void metodoDoubleInt(double a, int b) { }
```

### 3. Documente Ordem de Preferência

```java
/**
 * Processa número inteiro.
 * Preferido quando argumento é int.
 */
public void processar(int numero) { }

/**
 * Processa número de ponto flutuante.
 * Usado quando argumento é double ou float.
 */
public void processar(double numero) { }

/**
 * Processa qualquer objeto.
 * Fallback para outros tipos.
 */
public void processar(Object obj) { }
```

### 4. Use Cast Explícito para Desambiguar

```java
public class Teste {
    public void metodo(String s) { }
    public void metodo(Integer i) { }
}

Teste t = new Teste();
t.metodo((String) null);  // Chama metodo(String)
t.metodo((Integer) null); // Chama metodo(Integer)
```

### 5. Ordem de Preferência do Compilador

```java
// 1. Exact match
// 2. Widening
// 3. Autoboxing
// 4. Varargs

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
    
    public void metodo(int... a) {
        System.out.println("4. Varargs");
    }
}
```

### 6. Sobrecarga em Herança

```java
public class Animal {
    public void som(String tipo) {
        System.out.println(tipo + " faz som");
    }
}

public class Cachorro extends Animal {
    // Sobrecarga (não sobrescrita)
    public void som() {
        System.out.println("Au au");
    }
}

// Compilador decide em compile-time
Cachorro c = new Cachorro();
c.som();        // Compile-time: som()
c.som("Cachorro"); // Compile-time: som(String)
```

### 7. Type Safety

```java
// ✅ Compilador detecta erro
public class Teste {
    public void metodo(int a) { }
}

Teste t = new Teste();
t.metodo("Java"); // ❌ Erro de compilação: String não é int
```

### 8. IDE Autocomplete

```java
// IDE sugere métodos baseado em tipo
Calculadora calc = new Calculadora();
calc.somar(5, 10);     // IDE: somar(int, int)
calc.somar(5.5, 10.2); // IDE: somar(double, double)
```

---

## Resumo

**Resolução em compile-time**:
```java
// Compilador decide qual método chamar
Teste t = new Teste();
t.metodo(10);   // Compile-time: metodo(int)
t.metodo(10.5); // Compile-time: metodo(double)
```

**Análise da assinatura**:
```java
// Compilador verifica: nome + parâmetros
metodo(int)
metodo(double)
metodo(String)
```

**Ordem de preferência**:
```java
1. Exact match
2. Widening (byte→int, int→long, float→double)
3. Autoboxing (int→Integer)
4. Varargs
```

**Tipo da referência**:
```java
Object obj = "Java"; // Objeto: String, Referência: Object
t.metodo(obj); // Compilador usa tipo da REFERÊNCIA (Object)
```

**Ambiguidade**:
```java
// ❌ Erro de compilação
public void metodo(int a, double b) { }
public void metodo(double a, int b) { }

t.metodo(10, 20); // Ambíguo
```

**Bytecode**:
```java
// Bytecode já contém método específico
invokevirtual #2 // Teste.metodo:(I)V
// Compilador decidiu: metodo(int)
```

**Sobrecarga vs Sobrescrita**:
- **Sobrecarga**: compile-time (early binding)
- **Sobrescrita**: runtime (late binding)

**Vantagens**:
- ✅ Detecção precoce de erros
- ✅ Performance (sem overhead)
- ✅ Type safety
- ✅ IDE autocomplete

**Evitar**:
- ❌ Ambiguidade
- ❌ Confiar em tipo do objeto (use tipo da referência)

**Regra de Ouro**: **Sobrecarga** é resolvida em **compile-time** baseada no **tipo da referência** dos argumentos. Compilador usa **ordem de preferência**: exact match → widening → boxing → varargs. **Type safety** garantida em tempo de compilação.
