# T6.04 - SAM (Single Abstract Method)

## Introdução

**SAM** (Single Abstract Method): interface com **exatamente um método abstrato**.

```java
// SAM interface
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b); // Single Abstract Method
}

// Lambda implementa SAM
Operacao soma = (a, b) -> a + b;
int resultado = soma.executar(5, 3); // 8
```

**SAM = Interface Funcional**: mesma coisa, termos sinônimos.

**Origem**: conceito pré-Java 8 (antes de lambdas).

---

## Fundamentos

### 1. Definição de SAM

**SAM**: **S**ingle **A**bstract **M**ethod (um único método abstrato).

```java
// ✅ SAM: 1 método abstrato
@FunctionalInterface
public interface Comparador {
    int comparar(String a, String b);
}

// ❌ Não SAM: mais de 1 abstrato
public interface NaoSAM {
    void metodo1();
    void metodo2();
}
```

### 2. SAM vs Interface Funcional

**SAM**: termo antigo (pré-Java 8).
**Interface Funcional**: termo moderno (Java 8+).

```java
// SAM interface (termo antigo)
public interface SAM {
    void executar();
}

// Functional interface (termo moderno)
@FunctionalInterface
public interface Funcional {
    void executar();
}

// Mesma coisa: 1 método abstrato
```

### 3. SAM Antes do Java 8

**Antes do Java 8**: classe anônima.

```java
public interface Comparador {
    int comparar(String a, String b);
}

// Java 7 e anterior: classe anônima
Comparador c = new Comparador() {
    @Override
    public int comparar(String a, String b) {
        return a.compareTo(b);
    }
};

int resultado = c.comparar("abc", "def");
```

### 4. SAM a Partir do Java 8

**Java 8+**: lambda.

```java
public interface Comparador {
    int comparar(String a, String b);
}

// Java 8+: lambda
Comparador c = (a, b) -> a.compareTo(b);

int resultado = c.comparar("abc", "def");
```

### 5. default e static Não Contam

**default/static**: não afetam SAM.

```java
@FunctionalInterface
public interface SAM {
    void executar(); // 1 abstrato (SAM)
    
    // Múltiplos default: OK
    default void executarComLog() {
        System.out.println("Executando...");
        executar();
    }
    
    // Múltiplos static: OK
    static void auxiliar() {
        System.out.println("Auxiliar");
    }
}
```

### 6. Métodos de Object Não Contam

**Métodos de Object**: não afetam SAM.

```java
@FunctionalInterface
public interface Comparador {
    int comparar(String a, String b); // 1 abstrato (SAM)
    
    // Métodos de Object: não contam
    boolean equals(Object obj);
    int hashCode();
    String toString();
}
```

### 7. Herança de SAM

**Interface filha** herda método abstrato.

```java
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}

// ✅ SAM: herda 1 abstrato
@FunctionalInterface
public interface OperacaoMatematica extends Operacao {
    // Herda executar(int, int)
}
```

### 8. Override Não Adiciona Método

**Override**: não adiciona método abstrato.

```java
@FunctionalInterface
public interface Base {
    void processar(String dados);
}

// ✅ SAM: override não adiciona
@FunctionalInterface
public interface Filha extends Base {
    @Override
    void processar(String dados); // Override (não adiciona)
}
```

### 9. SAM com Generic

**Generic**: permitido.

```java
@FunctionalInterface
public interface Conversor<T, R> {
    R converter(T valor); // SAM
}

// Uso
Conversor<Integer, String> intParaString = String::valueOf;
Conversor<String, Integer> stringParaInt = Integer::parseInt;
```

### 10. SAM e Target Typing

**Target typing**: tipo inferido pelo contexto.

```java
@FunctionalInterface
public interface Processador {
    void processar(String dados);
}

public void executar(Processador p) {
    p.processar("teste");
}

// Target typing: tipo inferido
executar(dados -> System.out.println(dados));

// Tipo explícito
Processador p = dados -> System.out.println(dados);
executar(p);
```

---

## Aplicabilidade

**SAM**:
- **Lambdas** (expressões lambda)
- **Method references**
- **Callbacks**
- **Event handlers**
- **Streams API**

**Benefícios**:
- Código conciso
- Programação funcional
- Menos boilerplate

---

## Armadilhas

### 1. Confundir SAM com Interface Normal

```java
// ✅ SAM: pode usar lambda
@FunctionalInterface
public interface SAM {
    void executar();
}

SAM s = () -> System.out.println("OK");

// ❌ Não SAM: não pode usar lambda
public interface NaoSAM {
    void metodo1();
    void metodo2();
}

// NaoSAM n = () -> ...; // ERRO
```

### 2. Mais de Um Método Abstrato

```java
// ❌ Não SAM: mais de 1 abstrato
// @FunctionalInterface // ERRO
public interface NaoSAM {
    void metodo1();
    void metodo2();
}
```

### 3. Zero Métodos Abstratos

```java
// ❌ Não SAM: zero abstratos
// @FunctionalInterface // ERRO
public interface SemAbstrato {
    default void metodo() { }
    static void outro() { }
}
```

### 4. Adicionar Método na Herança

```java
@FunctionalInterface
public interface Base {
    void executar();
}

// ❌ Não SAM: adiciona abstrato
// @FunctionalInterface // ERRO
public interface Filha extends Base {
    void outro(); // Total = 2 abstratos
}
```

### 5. Contar default como Abstrato

```java
// ⚠️ Confusão: default não conta
@FunctionalInterface
public interface SAM {
    void executar(); // 1 abstrato
    
    default void outro() { } // Não conta
    default void mais() { } // Não conta
}
```

### 6. Contar static como Abstrato

```java
// ⚠️ Confusão: static não conta
@FunctionalInterface
public interface SAM {
    void executar(); // 1 abstrato
    
    static void auxiliar() { } // Não conta
    static void helper() { } // Não conta
}
```

### 7. SAM vs Marker Interface

```java
// ⚠️ Confusão: Marker não é SAM
public interface Serializable {
    // Sem métodos (Marker interface)
}

// ✅ SAM: 1 método abstrato
@FunctionalInterface
public interface SAM {
    void executar();
}
```

---

## Boas Práticas

### 1. Usar @FunctionalInterface

```java
// ✅ @FunctionalInterface valida SAM
@FunctionalInterface
public interface SAM {
    void executar();
}
```

### 2. Naming Descritivo

```java
// ✅ Nome claro
@FunctionalInterface
public interface ProcessadorDeDados {
    void processar(String dados);
}

@FunctionalInterface
public interface ValidadorDeEmail {
    boolean validar(String email);
}
```

### 3. JavaDoc com Exemplo

```java
/**
 * SAM interface para operações matemáticas.
 * 
 * <p>Exemplo com lambda:
 * <pre>{@code
 * Operacao soma = (a, b) -> a + b;
 * int resultado = soma.executar(5, 3); // 8
 * }</pre>
 */
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}
```

### 4. Generic para Reutilização

```java
// ✅ Generic para múltiplos tipos
@FunctionalInterface
public interface Transformador<T> {
    T transformar(T valor);
}

// Uso
Transformador<String> maiusculas = String::toUpperCase;
Transformador<Integer> dobro = n -> n * 2;
```

### 5. default para Composição

```java
@FunctionalInterface
public interface Predicado<T> {
    boolean testar(T valor);
    
    // Composição com default
    default Predicado<T> and(Predicado<T> outro) {
        return valor -> this.testar(valor) && outro.testar(valor);
    }
    
    default Predicado<T> or(Predicado<T> outro) {
        return valor -> this.testar(valor) || outro.testar(valor);
    }
}
```

### 6. static para Factory Methods

```java
@FunctionalInterface
public interface Validador {
    boolean validar(String valor);
    
    // Factory methods
    static Validador naoNull() {
        return valor -> valor != null;
    }
    
    static Validador naoVazio() {
        return valor -> valor != null && !valor.isEmpty();
    }
}
```

### 7. Documentar SAM

```java
/**
 * SAM interface para conversão de tipos.
 * 
 * <p>Esta é uma interface funcional (SAM) e pode ser usada
 * com expressões lambda ou method references.
 * 
 * @param <T> tipo de entrada
 * @param <R> tipo de saída
 */
@FunctionalInterface
public interface Conversor<T, R> {
    R converter(T valor);
}
```

### 8. Evitar SAM Complexo

```java
// ❌ Evitar: muitos default/static
@FunctionalInterface
public interface Complexo {
    void executar();
    
    default void d1() { }
    default void d2() { }
    default void d3() { }
}

// ✅ Simples e focado
@FunctionalInterface
public interface Simples {
    void executar();
}
```

### 9. Usar java.util.function

```java
// ⚠️ Evitar criar quando já existe
// @FunctionalInterface
// public interface Predicado<T> {
//     boolean testar(T valor);
// }

// ✅ Usar java.util.function.Predicate
import java.util.function.Predicate;

Predicate<String> naoVazio = s -> !s.isEmpty();
```

### 10. SAM em APIs

```java
// ✅ SAM para callbacks
public class ProcessadorAssincrono {
    @FunctionalInterface
    public interface Callback {
        void aoConcluir(String resultado);
    }
    
    public void processar(String dados, Callback callback) {
        // Processamento...
        callback.aoConcluir("Resultado");
    }
}

// Uso
processador.processar("dados", resultado -> {
    System.out.println("Concluído: " + resultado);
});
```

---

## Resumo

**SAM**: **S**ingle **A**bstract **M**ethod.

```java
@FunctionalInterface
public interface SAM {
    void executar(); // Single Abstract Method
}
```

**SAM = Interface Funcional**: termos sinônimos.

**SAM**: termo antigo (pré-Java 8).
**Interface Funcional**: termo moderno (Java 8+).

**Antes do Java 8**: classe anônima.
```java
SAM s = new SAM() {
    @Override
    public void executar() {
        System.out.println("OK");
    }
};
```

**Java 8+**: lambda.
```java
SAM s = () -> System.out.println("OK");
```

**Não contam como abstratos**:
- Métodos **default**
- Métodos **static**
- Métodos de **Object**

**Exemplo completo**:
```java
@FunctionalInterface
public interface SAM {
    void executar(); // 1 abstrato
    
    default void comLog() { } // Não conta
    static void auxiliar() { } // Não conta
    boolean equals(Object obj); // Não conta (Object)
}
```

**Herança**:
```java
@FunctionalInterface
public interface Base {
    void executar();
}

// ✅ SAM: herda 1 abstrato
@FunctionalInterface
public interface Filha extends Base { }
```

**Override**: não adiciona.
```java
@FunctionalInterface
public interface Filha extends Base {
    @Override
    void executar(); // Override (não adiciona)
}
```

**Generic**:
```java
@FunctionalInterface
public interface Conversor<T, R> {
    R converter(T valor);
}
```

**Target typing**:
```java
executar(dados -> System.out.println(dados));
```

**Aplicabilidade**:
- Lambdas
- Method references
- Callbacks
- Event handlers
- Streams API

**Boas práticas**:
- Usar @FunctionalInterface
- Naming descritivo
- JavaDoc com exemplo
- Generic para reutilização
- default para composição
- static para factory methods
- Documentar SAM
- Evitar SAM complexo
- Usar java.util.function
- SAM em APIs (callbacks)

**Armadilhas**:
- ❌ Confundir SAM com interface normal
- ❌ Mais de 1 método abstrato
- ❌ Zero métodos abstratos
- ❌ Adicionar método na herança
- ❌ Contar default como abstrato
- ❌ Contar static como abstrato
- ❌ SAM vs Marker interface

**Diferenças**:

| Aspecto | SAM | Não SAM |
|---------|-----|---------|
| **Métodos abstratos** | Exatamente 1 | 0 ou 2+ |
| **Lambda** | ✅ Sim | ❌ Não |
| **@FunctionalInterface** | ✅ Válido | ❌ Erro |
| **Classe anônima** | ✅ Sim | ✅ Sim |

**Regra de Ouro**: **SAM** (Single Abstract Method) é sinônimo de **Interface Funcional**. Tem **exatamente 1 método abstrato** (não conta default, static, métodos de Object). Termo **SAM** é mais antigo (pré-Java 8). Termo **Interface Funcional** é mais moderno (Java 8+). **SAM** permite uso de **lambdas** e **method references**. Antes do Java 8, SAM usava **classe anônima**. Java 8+ usa **lambda** (mais conciso). Use **@FunctionalInterface** para validar SAM.
