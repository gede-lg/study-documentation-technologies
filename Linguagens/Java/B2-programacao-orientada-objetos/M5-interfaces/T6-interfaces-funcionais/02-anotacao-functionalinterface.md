# T6.02 - Anotação @FunctionalInterface

## Introdução

**@FunctionalInterface**: anotação que **valida** interface funcional em **compile-time**.

```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b); // Único método abstrato
}

// ❌ ERRO de compilação: mais de 1 método abstrato
// @FunctionalInterface // ERRO
public interface Invalida {
    void metodo1();
    void metodo2(); // Mais de 1
}
```

**Objetivo**: garantir que a interface tenha **exatamente 1 método abstrato**.

**Opcional**: interface funcional sem @FunctionalInterface ainda funciona com lambdas.

```java
// Funciona sem anotação, mas não valida
public interface SemAnotacao {
    void executar();
}

// Lambda funciona mesmo sem anotação
SemAnotacao obj = () -> System.out.println("OK");
```

---

## Fundamentos

### 1. Validação em Compile-Time

**@FunctionalInterface**: erro de compilação se inválida.

```java
// ✅ Válida: 1 método abstrato
@FunctionalInterface
public interface Valida {
    void executar();
}

// ❌ ERRO: mais de 1 abstrato
// @FunctionalInterface // ERRO de compilação
public interface Invalida1 {
    void metodo1();
    void metodo2();
}

// ❌ ERRO: zero abstratos
// @FunctionalInterface // ERRO de compilação
public interface Invalida2 {
    default void metodo() { }
}
```

### 2. Opcional mas Recomendada

**Opcional**: interface funcional sem anotação funciona.

```java
// Funciona sem @FunctionalInterface
public interface SemAnotacao {
    void executar();
}

// Lambda funciona
SemAnotacao obj = () -> System.out.println("Executando");
obj.executar();

// ✅ Recomendado: com anotação (valida + documenta)
@FunctionalInterface
public interface ComAnotacao {
    void executar();
}
```

### 3. Documenta Intenção

**@FunctionalInterface**: documenta que interface é funcional.

```java
/**
 * Interface funcional para operações matemáticas.
 * 
 * <p>Pode ser usada com lambdas:
 * <pre>{@code
 * Operacao soma = (a, b) -> a + b;
 * }</pre>
 */
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}
```

### 4. Previne Quebra Acidental

**@FunctionalInterface**: previne adicionar método abstrato acidentalmente.

```java
@FunctionalInterface
public interface Processador {
    void processar(String dados);
    
    // ❌ ERRO: adicionar outro abstrato quebra
    // void validar(String dados); // ERRO de compilação
    
    // ✅ OK: default não quebra
    default void processarComLog(String dados) {
        System.out.println("Processando: " + dados);
        processar(dados);
    }
}
```

### 5. Herança com @FunctionalInterface

**Herança**: interface filha também pode ser funcional.

```java
@FunctionalInterface
public interface Base {
    void executar();
}

// ✅ Funcional: herda 1 abstrato
@FunctionalInterface
public interface Filha extends Base {
    // Herda executar()
}

// ❌ ERRO: adiciona abstrato
// @FunctionalInterface // ERRO
public interface NaoFuncional extends Base {
    void outro(); // Total = 2 abstratos
}
```

### 6. Override não Adiciona Abstrato

**Override**: não adiciona método abstrato.

```java
@FunctionalInterface
public interface Base {
    void executar(String dados);
}

// ✅ OK: override não adiciona
@FunctionalInterface
public interface Filha extends Base {
    @Override
    void executar(String dados); // Override (não adiciona)
}
```

### 7. Métodos default e static Permitidos

**default/static**: não afetam @FunctionalInterface.

```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b); // 1 abstrato
    
    // ✅ Múltiplos default: OK
    default int somar(int a, int b) {
        return a + b;
    }
    
    default int subtrair(int a, int b) {
        return a - b;
    }
    
    // ✅ Múltiplos static: OK
    static int multiplicar(int a, int b) {
        return a * b;
    }
    
    static int dividir(int a, int b) {
        return a / b;
    }
}
```

### 8. Métodos de Object Permitidos

**Métodos de Object**: não afetam @FunctionalInterface.

```java
@FunctionalInterface
public interface Comparador {
    int comparar(String a, String b); // 1 abstrato
    
    // ✅ Métodos de Object: OK
    boolean equals(Object obj);
    int hashCode();
    String toString();
}
```

### 9. Generic com @FunctionalInterface

**Generic**: permitido.

```java
@FunctionalInterface
public interface Conversor<T, R> {
    R converter(T valor);
}

// Uso
Conversor<Integer, String> intParaString = String::valueOf;
Conversor<String, Integer> stringParaInt = Integer::parseInt;
```

### 10. Lambda sem @FunctionalInterface

**Lambda funciona** sem @FunctionalInterface.

```java
// Sem anotação
public interface SemAnotacao {
    void executar();
}

// Lambda funciona mesmo sem anotação
SemAnotacao obj = () -> System.out.println("OK");
obj.executar();

// Mas sem validação: pode quebrar depois
public interface SemAnotacao {
    void executar();
    void outro(); // Adicionado depois: quebra lambdas existentes
}
```

---

## Aplicabilidade

**@FunctionalInterface**:
- **Validação** em compile-time
- **Documentação** de intenção
- **Prevenção** de quebra acidental
- **Clareza** de código

**Usar quando**:
- Interface para lambdas
- API pública
- Evitar quebra futura

---

## Armadilhas

### 1. Esquecer Anotação

```java
// ⚠️ Funciona, mas sem validação
public interface SemAnotacao {
    void executar();
}

// Pode quebrar depois
public interface SemAnotacao {
    void executar();
    void outro(); // Quebra lambdas existentes
}

// ✅ Com anotação: erro ao adicionar método
@FunctionalInterface
public interface ComAnotacao {
    void executar();
    // void outro(); // ERRO de compilação
}
```

### 2. Mais de Um Método Abstrato

```java
// ❌ ERRO de compilação
// @FunctionalInterface // ERRO
public interface Invalida {
    void metodo1();
    void metodo2(); // Mais de 1
}
```

### 3. Zero Métodos Abstratos

```java
// ❌ ERRO de compilação
// @FunctionalInterface // ERRO
public interface SemAbstrato {
    default void metodo() { }
    static void outro() { }
}
```

### 4. Adicionar Abstrato em Herança

```java
@FunctionalInterface
public interface Base {
    void executar();
}

// ❌ ERRO: adiciona abstrato
// @FunctionalInterface // ERRO
public interface Filha extends Base {
    void outro(); // Total = 2 abstratos
}
```

### 5. Confundir default com Abstrato

```java
// ⚠️ Confusão: default não conta
@FunctionalInterface
public interface Correto {
    void executar(); // 1 abstrato
    
    default void outro() { } // Não conta
    default void mais() { } // Não conta
}
```

### 6. Confundir static com Abstrato

```java
// ⚠️ Confusão: static não conta
@FunctionalInterface
public interface Correto {
    void executar(); // 1 abstrato
    
    static void auxiliar() { } // Não conta
    static void helper() { } // Não conta
}
```

### 7. Adicionar Método Abstrato Sem Perceber

```java
@FunctionalInterface
public interface Processador {
    void processar(String dados);
    
    // ❌ ERRO: adicionar abstrato quebra
    // String validar(String dados); // ERRO de compilação
    
    // ✅ OK: default
    default String validar(String dados) {
        return dados != null ? dados : "";
    }
}
```

---

## Boas Práticas

### 1. Sempre Usar @FunctionalInterface

```java
// ✅ Sempre anotar interfaces funcionais
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}
```

### 2. JavaDoc Explicativo

```java
/**
 * Interface funcional para validação de strings.
 * 
 * <p>Exemplo de uso com lambda:
 * <pre>{@code
 * Validador naoVazio = s -> s != null && !s.isEmpty();
 * boolean valido = naoVazio.validar("teste"); // true
 * }</pre>
 * 
 * @since 1.0
 */
@FunctionalInterface
public interface Validador {
    /**
     * Valida o valor fornecido.
     * 
     * @param valor valor a ser validado
     * @return true se válido, false caso contrário
     */
    boolean validar(String valor);
}
```

### 3. Naming Descritivo

```java
// ✅ Nome claro
@FunctionalInterface
public interface ConversorStringParaInt {
    int converter(String valor);
}

@FunctionalInterface
public interface ValidadorDeEmail {
    boolean validar(String email);
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
    
    // default: composição
    default Predicado<T> and(Predicado<T> outro) {
        return valor -> this.testar(valor) && outro.testar(valor);
    }
    
    default Predicado<T> or(Predicado<T> outro) {
        return valor -> this.testar(valor) || outro.testar(valor);
    }
    
    default Predicado<T> negate() {
        return valor -> !this.testar(valor);
    }
}

// Uso
Predicado<String> naoVazio = s -> !s.isEmpty();
Predicado<String> tamanhoMinimo = s -> s.length() >= 3;

Predicado<String> valido = naoVazio.and(tamanhoMinimo);
boolean resultado = valido.testar("abc"); // true
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
    
    static Validador tamanhoMinimo(int min) {
        return valor -> valor != null && valor.length() >= min;
    }
}

// Uso
Validador validador = Validador.naoVazio();
boolean valido = validador.validar("teste");
```

### 7. Documentar Exceções

```java
/**
 * Interface funcional para conversão de strings.
 * 
 * @throws NumberFormatException se a conversão falhar
 */
@FunctionalInterface
public interface ConversorNumerico {
    /**
     * Converte string para número.
     * 
     * @param valor string a ser convertida
     * @return número convertido
     * @throws NumberFormatException se não puder converter
     */
    int converter(String valor);
}
```

### 8. Usar java.util.function Quando Possível

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

### 9. Checked Exceptions com Wrapper

```java
@FunctionalInterface
public interface LeitorArquivo {
    String ler(String caminho) throws IOException;
}

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

### 10. Evitar Interfaces Complexas

```java
// ❌ Evitar: muitos default/static (confuso)
@FunctionalInterface
public interface Complexo {
    void executar();
    
    default void d1() { }
    default void d2() { }
    default void d3() { }
    default void d4() { }
    default void d5() { }
}

// ✅ Simples e focado
@FunctionalInterface
public interface Simples {
    void executar();
}
```

---

## Resumo

**@FunctionalInterface**: anotação para **validar** interface funcional.

```java
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}
```

**Validação**: erro de compilação se inválida.

```java
// ❌ ERRO: mais de 1 abstrato
// @FunctionalInterface // ERRO
public interface Invalida {
    void metodo1();
    void metodo2();
}
```

**Opcional**: funciona sem anotação.

```java
// Funciona sem @FunctionalInterface
public interface SemAnotacao {
    void executar();
}

// Lambda funciona
SemAnotacao obj = () -> System.out.println("OK");
```

**Benefícios**:
- Validação em compile-time
- Documenta intenção
- Previne quebra acidental
- Clareza de código

**Permitido**:
- Múltiplos **default**
- Múltiplos **static**
- Métodos de **Object**
- **Generic**

```java
@FunctionalInterface
public interface Calculadora<T> {
    T calcular(T a, T b); // 1 abstrato
    
    default T somar(T a, T b) { return null; } // OK
    static void log() { } // OK
    boolean equals(Object obj); // OK (Object)
}
```

**Herança**:

```java
@FunctionalInterface
public interface Base {
    void executar();
}

// ✅ OK: herda 1 abstrato
@FunctionalInterface
public interface Filha extends Base { }
```

**Override**: não adiciona abstrato.

```java
@FunctionalInterface
public interface Filha extends Base {
    @Override
    void executar(); // Override (não adiciona)
}
```

**Boas práticas**:
- Sempre usar @FunctionalInterface
- JavaDoc explicativo
- Naming descritivo
- Generic para reutilização
- default para composição
- static para factory methods
- Documentar exceções
- Usar java.util.function quando possível
- Checked exceptions com wrapper
- Evitar interfaces complexas

**Armadilhas**:
- ❌ Esquecer anotação
- ❌ Mais de 1 método abstrato
- ❌ Zero métodos abstratos
- ❌ Adicionar abstrato em herança
- ❌ Confundir default com abstrato
- ❌ Confundir static com abstrato
- ❌ Adicionar método abstrato sem perceber

**Regra de Ouro**: **Sempre** use **@FunctionalInterface** em interfaces funcionais. Valida em **compile-time** (exatamente 1 método abstrato). **Documenta intenção**. **Previne quebra** acidental. É **opcional** mas **altamente recomendada**. Permite **múltiplos default/static**. **Lambda funciona** mesmo sem anotação, mas anotação garante que interface **permanece funcional**.
