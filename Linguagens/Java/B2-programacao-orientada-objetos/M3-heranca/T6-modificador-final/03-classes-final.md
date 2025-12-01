# T6.03 - Classes final

## Introdução

**Classes final** não podem ser **estendidas** (herdadas).

**Nenhuma subclasse** pode ser criada.

**Uso**: imutabilidade, segurança, design intencional.

```java
public final class String {
    // Ninguém pode estender String
}

public class MinhaString extends String { // ❌ Erro de compilação
}
```

```java
public final class Matematica {
    private Matematica() { } // Construtor privado
    
    public static double calcular(double x) {
        return x * 2;
    }
}
```

---

## Fundamentos

### 1. Classe final Não Pode Ser Estendida

```java
public final class Animal {
    public void som() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal { // ❌ Erro de compilação
}
```

### 2. Métodos de Classes final

**Todos os métodos** são implicitamente final (não podem ser sobrescritos).

```java
public final class Configuracao {
    public void validar() { // Implicitamente final
        // ...
    }
}
```

Declarar método como final é **redundante** em classe final.

```java
public final class Exemplo {
    public final void metodo() { // Redundante
        // ...
    }
}
```

### 3. Classes final em Java

**Exemplos padrão**:
- `String`
- `Integer`, `Double`, `Long` (wrapper classes)
- `Math`
- `System`
- `LocalDate`, `LocalTime`, `LocalDateTime` (Java 8+)

```java
String s = "Java";
// String é final, não pode estender

Integer i = 10;
// Integer é final
```

### 4. final vs abstract (Conflito)

**Classe abstrata** deve ser estendida.

**Classe final** não pode ser estendida.

```java
public abstract final class Exemplo { // ❌ Erro: conflito
}
```

### 5. Imutabilidade com final

**Classe final** facilita **imutabilidade**.

```java
public final class Pessoa {
    private final String nome;
    private final int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Apenas getters, sem setters
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}
```

### 6. Segurança com Classes final

**Previne alteração** de comportamento por subclasses.

```java
public final class Autenticacao {
    public boolean autenticar(String usuario, String senha) {
        // Lógica de segurança que não pode ser alterada
        return validar(usuario) && verificarSenha(senha);
    }
}
```

### 7. Utility Classes com final

**Classes utilitárias** (apenas métodos static) devem ser final.

```java
public final class StringUtils {
    private StringUtils() { } // Construtor privado
    
    public static String capitalize(String texto) {
        return texto.substring(0, 1).toUpperCase() + texto.substring(1);
    }
}
```

### 8. Enums São Implicitamente final

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

// Não pode estender enum
public class MeuDia extends DiaSemana { // ❌ Erro
}
```

### 9. Records São Implicitamente final (Java 14+)

```java
public record Pessoa(String nome, int idade) { }

// Não pode estender record
public class MinhaRecord extends Pessoa { // ❌ Erro
}
```

### 10. final em Classes Anônimas

**Classes anônimas** são implicitamente final.

```java
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Executando");
    }
};

// Não pode estender classe anônima
```

---

## Aplicabilidade

**Use classes final quando**:
- **Imutabilidade** é desejada (String, LocalDate)
- **Segurança**: comportamento não deve ser alterado
- **Utility classes**: apenas métodos static
- **Design intencional**: herança não faz sentido
- **Performance** (mínima, JVM moderna otimiza)

**Evite final quando**:
- **Extensibilidade** é desejada
- **Testes**: mockar classe final é difícil (sem PowerMock)
- **Frameworks**: podem precisar criar proxies (Hibernate, Spring)

---

## Armadilhas

### 1. Impedir Extensibilidade Necessária

```java
// ❌ Muito restritivo
public final class Animal {
    public void som() {
        System.out.println("Som");
    }
}

// Não pode criar Cachorro, Gato, etc.
```

**Solução**: Não use final se herança é esperada.

### 2. Dificultar Testes

**Mockito** não consegue mockar classes final (sem PowerMock).

```java
public final class Servico {
    public String buscarDados() {
        // ...
    }
}

// ❌ Dificulta testes
@Mock
private Servico servico; // Mockito não funciona com final
```

**Solução**: Use interfaces ou evite final em código testável.

### 3. Conflito com abstract

```java
public abstract final class Exemplo { // ❌ Erro: conflito
}
```

### 4. Usar final Por Padrão

```java
// ❌ Excesso de final sem necessidade
public final class ClasseSimples {
    // ...
}
```

**Use final** apenas com **razão clara**.

### 5. Problemas com Frameworks

**Hibernate**, **Spring AOP** criam **proxies** via herança.

```java
// ❌ Hibernate não consegue criar proxy
@Entity
public final class Usuario {
    // ...
}
```

**Solução**: Evite final em entidades de frameworks.

### 6. Esquecer Construtor Privado em Utility Classes

```java
// ❌ Sem construtor privado
public final class Utils {
    public static void metodo() { }
}

// ✅ Com construtor privado
public final class Utils {
    private Utils() { } // Previne instanciação
    
    public static void metodo() { }
}
```

---

## Boas Práticas

### 1. Imutabilidade: Classe final + Atributos final

```java
public final class Pessoa {
    private final String nome;
    private final int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}
```

### 2. Utility Classes: final + Construtor Privado

```java
public final class MathUtils {
    private MathUtils() { } // Previne instanciação
    
    public static double calcular(double x, double y) {
        return x * y;
    }
}
```

### 3. Value Objects: final + Imutável

```java
public final class Dinheiro {
    private final BigDecimal valor;
    private final String moeda;
    
    public Dinheiro(BigDecimal valor, String moeda) {
        this.valor = valor;
        this.moeda = moeda;
    }
    
    public Dinheiro adicionar(Dinheiro outro) {
        return new Dinheiro(valor.add(outro.valor), moeda);
    }
}
```

### 4. Documente Por Que final

```java
/**
 * Classe final para garantir imutabilidade e segurança.
 * Não deve ser estendida.
 */
public final class Configuracao {
    // ...
}
```

### 5. Use Records Para Imutabilidade (Java 14+)

```java
// ✅ Record é implicitamente final e imutável
public record Pessoa(String nome, int idade) { }
```

### 6. Evite final em APIs Públicas (Bibliotecas)

**Bibliotecas**: Evite final (permite extensão por usuários).

**Código interno**: Use final para garantir invariantes.

### 7. final em Classes de Segurança

```java
public final class Criptografia {
    public static String encriptar(String texto) {
        // Lógica de segurança que não pode ser alterada
        return AES.encrypt(texto);
    }
}
```

### 8. Combine com Sealed Classes (Java 17+)

**Sealed**: controle de subclasses.

**Final**: sem subclasses.

```java
public sealed class Forma permits Circulo, Quadrado { }

public final class Circulo extends Forma { }
public final class Quadrado extends Forma { }
```

### 9. Preferir Composição a Herança

**Em vez de herança**, use **composição**.

```java
// ❌ Herança
public class MeuServico extends ServicoBase {
    // ...
}

// ✅ Composição (ServicoBase pode ser final)
public class MeuServico {
    private final ServicoBase servico;
    
    public MeuServico(ServicoBase servico) {
        this.servico = servico;
    }
}
```

---

## Resumo

**Classe final**:
```java
public final class Exemplo {
    // Não pode ser estendida
}
```

**Erro ao estender**:
```java
public final class Pai { }

public class Filho extends Pai { } // ❌ Erro
```

**Classes final em Java**:
```java
String // final
Integer, Double, Long // final
Math // final
LocalDate, LocalDateTime // final
```

**final vs abstract (inválido)**:
```java
public abstract final class Exemplo { } // ❌ Erro
```

**Imutabilidade**:
```java
public final class Pessoa {
    private final String nome;
    private final int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Apenas getters
}
```

**Utility class**:
```java
public final class Utils {
    private Utils() { } // Construtor privado
    
    public static void metodo() { }
}
```

**Enums e Records (implicitamente final)**:
```java
public enum Dia { SEGUNDA, TERCA }

public record Pessoa(String nome, int idade) { }
```

**Segurança**:
```java
public final class Autenticacao {
    public boolean autenticar(String usuario, String senha) {
        // Lógica crítica que não pode ser alterada
    }
}
```

**Sealed classes (Java 17+)**:
```java
public sealed class Forma permits Circulo, Quadrado { }

public final class Circulo extends Forma { }
public final class Quadrado extends Forma { }
```

**Regra de Ouro**: Use **classes final** para **imutabilidade** e **segurança**. **Não use** por padrão. **Evite em APIs públicas** (limita extensibilidade). Considere **impacto em testes** e **frameworks**.
