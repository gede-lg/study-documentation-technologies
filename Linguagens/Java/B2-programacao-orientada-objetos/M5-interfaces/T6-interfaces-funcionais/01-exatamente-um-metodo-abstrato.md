# T6.01 - Exatamente Um Método Abstrato

## Introdução

**Interface funcional**: interface com **exatamente um método abstrato**.

```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b); // Único método abstrato
}

// Pode ter default e static
@FunctionalInterface
public interface CalculadoraCompleta {
    int calcular(int a, int b); // Único abstrato
    
    default int somar(int a, int b) {
        return a + b;
    }
    
    static int multiplicar(int a, int b) {
        return a * b;
    }
}
```

**SAM** (Single Abstract Method): interface com um único método abstrato.

**Uso**: base para **expressões lambda** e **method references**.

---

## Fundamentos

### 1. Definição

**Interface funcional**: **exatamente 1** método abstrato.

```java
// ✅ Interface funcional (1 método abstrato)
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}

// ✅ Interface funcional (1 método abstrato + default/static)
@FunctionalInterface
public interface Conversor {
    String converter(int valor); // Abstrato
    
    default String converterComPrefixo(int valor) {
        return "Valor: " + converter(valor);
    }
    
    static String converterDireto(int valor) {
        return String.valueOf(valor);
    }
}
```

### 2. Não Conta default

**default**: não conta como abstrato.

```java
@FunctionalInterface
public interface Processador {
    void processar(String dados); // Abstrato (conta)
    
    default void processarComLog(String dados) { // Não conta
        System.out.println("Processando: " + dados);
        processar(dados);
    }
    
    default void validar(String dados) { // Não conta
        if (dados == null) {
            throw new IllegalArgumentException("Dados null");
        }
    }
}
```

### 3. Não Conta static

**static**: não conta como abstrato.

```java
@FunctionalInterface
public interface Validador {
    boolean validar(String valor); // Abstrato (conta)
    
    static boolean validarNaoNull(String valor) { // Não conta
        return valor != null;
    }
    
    static boolean validarNaoVazio(String valor) { // Não conta
        return valor != null && !valor.isEmpty();
    }
}
```

### 4. Métodos de Object

**Métodos de Object**: não contam como abstratos.

```java
@FunctionalInterface
public interface Comparador {
    int comparar(String a, String b); // Abstrato (conta)
    
    // Métodos de Object: não contam
    boolean equals(Object obj);
    int hashCode();
    String toString();
}
```

### 5. Mais de Um Método Abstrato: Erro

**Mais de 1** método abstrato: **não** é funcional.

```java
// ❌ ERRO: mais de 1 método abstrato
// @FunctionalInterface // ERRO de compilação
public interface NaoFuncional {
    void metodo1(); // Abstrato
    void metodo2(); // Abstrato (mais de 1)
}
```

### 6. Zero Métodos Abstratos: Erro

**Zero** métodos abstratos: **não** é funcional.

```java
// ❌ ERRO: zero métodos abstratos
// @FunctionalInterface // ERRO de compilação
public interface SemMetodo {
    default void metodoDefault() {
        System.out.println("Default");
    }
    
    static void metodoStatic() {
        System.out.println("Static");
    }
}
```

### 7. Herança de Interface Funcional

Interface filha herda método abstrato.

```java
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}

// ✅ Funcional (herda 1 método abstrato)
@FunctionalInterface
public interface OperacaoMatematica extends Operacao {
    // Herda executar(int, int)
}

// ❌ ERRO: adiciona outro abstrato
// @FunctionalInterface // ERRO
public interface NaoFuncional extends Operacao {
    int outro(int a); // Mais de 1 abstrato (total = 2)
}
```

### 8. Override de Método Abstrato

Override: **não adiciona** método abstrato.

```java
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}

// ✅ Funcional (override não adiciona)
@FunctionalInterface
public interface OperacaoEspecifica extends Operacao {
    @Override
    int executar(int a, int b); // Override (não adiciona)
}
```

### 9. Generic em Interface Funcional

**Generic**: pode usar.

```java
@FunctionalInterface
public interface Conversor<T, R> {
    R converter(T valor);
}

// Uso
Conversor<Integer, String> intParaString = valor -> String.valueOf(valor);
Conversor<String, Integer> stringParaInt = valor -> Integer.parseInt(valor);
```

### 10. Uso com Lambda

**Lambda**: implementa interface funcional.

```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b);
}

// Lambda implementa interface funcional
Calculadora soma = (a, b) -> a + b;
Calculadora multiplicacao = (a, b) -> a * b;

int resultado1 = soma.calcular(5, 3); // 8
int resultado2 = multiplicacao.calcular(4, 2); // 8
```

---

## Aplicabilidade

**Interfaces funcionais**:
- **Lambdas** (expressões lambda)
- **Method references** (referências a métodos)
- **Streams** (operações em streams)
- **Callbacks** (funções de retorno)
- **Event handlers** (manipuladores de eventos)

**Benefícios**:
- **Código conciso** (lambdas)
- **Programação funcional**
- **Streams API**
- **Flexibilidade**

---

## Armadilhas

### 1. Mais de Um Método Abstrato

```java
// ❌ ERRO: mais de 1 abstrato
// @FunctionalInterface // ERRO
public interface Errado {
    void metodo1();
    void metodo2(); // Mais de 1
}
```

### 2. Zero Métodos Abstratos

```java
// ❌ ERRO: zero abstratos
// @FunctionalInterface // ERRO
public interface SemAbstrato {
    default void metodo() { }
}
```

### 3. Esquecer @FunctionalInterface

```java
// ⚠️ Funcional, mas sem anotação (não valida)
public interface SemAnotacao {
    void metodo();
}

// ✅ Com anotação (valida)
@FunctionalInterface
public interface ComAnotacao {
    void metodo();
}
```

### 4. Adicionar Método Abstrato na Herança

```java
@FunctionalInterface
public interface Base {
    void metodo();
}

// ❌ ERRO: adiciona abstrato
// @FunctionalInterface // ERRO
public interface Filha extends Base {
    void outro(); // Total = 2 abstratos
}
```

### 5. Contar default como Abstrato

```java
// ⚠️ Confusão: default não conta
@FunctionalInterface
public interface Correto {
    void metodo(); // 1 abstrato
    
    default void outro() { } // Não conta
    default void mais() { } // Não conta
}
```

### 6. Contar static como Abstrato

```java
// ⚠️ Confusão: static não conta
@FunctionalInterface
public interface Correto {
    void metodo(); // 1 abstrato
    
    static void auxiliar() { } // Não conta
    static void helper() { } // Não conta
}
```

### 7. Contar Métodos de Object

```java
// ⚠️ Confusão: métodos de Object não contam
@FunctionalInterface
public interface Correto {
    int comparar(String a, String b); // 1 abstrato
    
    boolean equals(Object obj); // Não conta (Object)
    int hashCode(); // Não conta (Object)
}
```

---

## Boas Práticas

### 1. Sempre Usar @FunctionalInterface

```java
// ✅ Anotação valida em compile-time
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}
```

### 2. Naming Descritivo

```java
// ✅ Nome descritivo
@FunctionalInterface
public interface ValidadorDeEmail {
    boolean validar(String email);
}

@FunctionalInterface
public interface ConversorStringParaInt {
    int converter(String valor);
}
```

### 3. JavaDoc Claro

```java
/**
 * Interface funcional para operações matemáticas.
 * 
 * <p>Exemplo:
 * <pre>{@code
 * Operacao soma = (a, b) -> a + b;
 * int resultado = soma.executar(5, 3); // 8
 * }</pre>
 */
@FunctionalInterface
public interface Operacao {
    /**
     * Executa a operação.
     * 
     * @param a primeiro operando
     * @param b segundo operando
     * @return resultado da operação
     */
    int executar(int a, int b);
}
```

### 4. Generic para Reutilização

```java
// ✅ Generic para múltiplos tipos
@FunctionalInterface
public interface Conversor<T, R> {
    R converter(T valor);
}

// Uso
Conversor<Integer, String> intParaString = String::valueOf;
Conversor<String, Integer> stringParaInt = Integer::parseInt;
```

### 5. default para Comportamento Padrão

```java
@FunctionalInterface
public interface Processador {
    void processar(String dados);
    
    // default: comportamento padrão
    default void processarComLog(String dados) {
        System.out.println("Processando: " + dados);
        processar(dados);
    }
}
```

### 6. static para Utilitários

```java
@FunctionalInterface
public interface Validador {
    boolean validar(String valor);
    
    // static: factory method
    static Validador naoNull() {
        return valor -> valor != null;
    }
    
    static Validador naoVazio() {
        return valor -> valor != null && !valor.isEmpty();
    }
}
```

### 7. Evitar Interface Complexa

```java
// ❌ Evitar: muitos default/static (confuso)
@FunctionalInterface
public interface Complexo {
    void metodo();
    
    default void d1() { }
    default void d2() { }
    default void d3() { }
    default void d4() { }
    default void d5() { }
    
    static void s1() { }
    static void s2() { }
    static void s3() { }
}

// ✅ Simples e focado
@FunctionalInterface
public interface Simples {
    void executar();
}
```

### 8. Usar java.util.function

```java
// ⚠️ Evitar criar quando já existe
// @FunctionalInterface
// public interface Conversor<T, R> {
//     R converter(T valor);
// }

// ✅ Usar java.util.function.Function
import java.util.function.Function;

Function<Integer, String> conversor = String::valueOf;
```

### 9. Checked Exceptions

```java
// Interface funcional com checked exception
@FunctionalInterface
public interface LeitorArquivo {
    String ler(String caminho) throws IOException;
}

// Ou wrapper para unchecked
@FunctionalInterface
public interface LeitorArquivoSafe {
    String ler(String caminho);
    
    static LeitorArquivoSafe wrap(LeitorArquivo leitor) {
        return caminho -> {
            try {
                return leitor.ler(caminho);
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        };
    }
}
```

### 10. Composição de Funções

```java
@FunctionalInterface
public interface Transformador<T> {
    T transformar(T valor);
    
    // Composição: depois de transformar
    default Transformador<T> depois(Transformador<T> outro) {
        return valor -> outro.transformar(this.transformar(valor));
    }
    
    // Composição: antes de transformar
    default Transformador<T> antes(Transformador<T> outro) {
        return valor -> this.transformar(outro.transformar(valor));
    }
}

// Uso
Transformador<String> maiusculas = String::toUpperCase;
Transformador<String> exclamacao = s -> s + "!";

Transformador<String> composto = maiusculas.depois(exclamacao);
String resultado = composto.transformar("hello"); // HELLO!
```

---

## Resumo

**Interface funcional**: **exatamente 1** método abstrato.

```java
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b); // Único abstrato
}
```

**@FunctionalInterface**: anotação opcional (valida).

**Não contam como abstratos**:
- Métodos **default**
- Métodos **static**
- Métodos de **Object** (equals, hashCode, toString)

**Exemplo completo**:
```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b); // 1 abstrato
    
    default int somar(int a, int b) { // Não conta
        return a + b;
    }
    
    static int multiplicar(int a, int b) { // Não conta
        return a * b;
    }
    
    boolean equals(Object obj); // Não conta (Object)
}
```

**Mais de 1 abstrato**: erro.
```java
// ❌ ERRO
// @FunctionalInterface
public interface Errado {
    void metodo1();
    void metodo2(); // Mais de 1
}
```

**Zero abstratos**: erro.
```java
// ❌ ERRO
// @FunctionalInterface
public interface SemAbstrato {
    default void metodo() { }
}
```

**Herança**:
```java
@FunctionalInterface
public interface Base {
    void metodo();
}

// ✅ OK (herda 1 abstrato)
@FunctionalInterface
public interface Filha extends Base {
    // Herda metodo()
}
```

**Override**: não adiciona abstrato.
```java
@FunctionalInterface
public interface Filha extends Base {
    @Override
    void metodo(); // Override (não adiciona)
}
```

**Generic**:
```java
@FunctionalInterface
public interface Conversor<T, R> {
    R converter(T valor);
}
```

**Lambda**:
```java
Calculadora soma = (a, b) -> a + b;
int resultado = soma.calcular(5, 3); // 8
```

**Boas práticas**:
- Sempre usar @FunctionalInterface
- Naming descritivo
- JavaDoc claro
- Generic para reutilização
- default para comportamento padrão
- static para utilitários
- Evitar interface complexa
- Usar java.util.function quando possível
- Checked exceptions (wrapper)
- Composição de funções

**Armadilhas**:
- ❌ Mais de 1 método abstrato
- ❌ Zero métodos abstratos
- ❌ Esquecer @FunctionalInterface
- ❌ Adicionar abstrato na herança
- ❌ Contar default como abstrato
- ❌ Contar static como abstrato
- ❌ Contar métodos de Object

**Regra de Ouro**: Interface funcional tem **exatamente 1 método abstrato** (não conta default, static, métodos de Object). Use **@FunctionalInterface** para validação. Base para **lambdas** e **method references**. Pode ter **múltiplos default/static**. **SAM** (Single Abstract Method). Interface funcional **permite programação funcional** em Java.
