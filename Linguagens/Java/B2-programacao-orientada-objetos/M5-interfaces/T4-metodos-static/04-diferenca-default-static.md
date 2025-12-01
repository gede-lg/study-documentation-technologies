# T4.04 - Diferença entre Métodos Default e Static

## Introdução

**Métodos default vs static**: duas formas de adicionar implementação em interfaces.

```java
public interface Exemplo {
    // Método default: associado à instância
    default void metodoDefault() {
        System.out.println("Default");
    }
    
    // Método static: associado à interface
    static void metodoStatic() {
        System.out.println("Static");
    }
}

public class Impl implements Exemplo {
    // metodoDefault() herdado
    // metodoStatic() NÃO herdado
}

// Uso
Impl obj = new Impl();
obj.metodoDefault(); // OK (herdado)

Exemplo.metodoStatic(); // OK (via interface)
// obj.metodoStatic(); // ERRO (não herdado)
```

**Principal diferença**:
- **default**: herdado, pode ser sobrescrito, acesso via instância
- **static**: não herdado, não pode ser sobrescrito, acesso via interface

---

## Fundamentos

### 1. Herança

**default**: herdado por implementações.
**static**: **não** herdado.

```java
public interface Animal {
    default void respirar() {
        System.out.println("Respirando");
    }
    
    static void infoGeral() {
        System.out.println("Informações gerais");
    }
}

public class Cachorro implements Animal {
    // respirar() herdado (default)
    // infoGeral() NÃO herdado (static)
}

// Uso
Cachorro c = new Cachorro();
c.respirar(); // Respirando (herdado)

// c.infoGeral(); // ERRO (não herdado)
Animal.infoGeral(); // OK (via interface)
```

### 2. Sobrescrita

**default**: pode ser sobrescrito.
**static**: **não** pode ser sobrescrito.

```java
public interface Interface1 {
    default void metodoDefault() {
        System.out.println("Default");
    }
    
    static void metodoStatic() {
        System.out.println("Static");
    }
}

public class Classe implements Interface1 {
    // ✅ Sobrescreve default
    @Override
    public void metodoDefault() {
        System.out.println("Default sobrescrito");
    }
    
    // ❌ NÃO sobrescreve static (método diferente)
    public static void metodoStatic() {
        System.out.println("Static da classe");
    }
}

// Uso
Classe obj = new Classe();
obj.metodoDefault(); // Default sobrescrito (polimorfismo)

Classe.metodoStatic(); // Static da classe
Interface1.metodoStatic(); // Static (métodos independentes)
```

### 3. Acesso

**default**: via instância.
**static**: via nome da interface.

```java
public interface Exemplo {
    default void metodoDefault() {
        System.out.println("Default");
    }
    
    static void metodoStatic() {
        System.out.println("Static");
    }
}

public class Impl implements Exemplo { }

// Acesso default: via instância
Impl obj = new Impl();
obj.metodoDefault(); // OK

// Acesso static: via interface
Exemplo.metodoStatic(); // OK
```

### 4. Polimorfismo

**default**: suporta polimorfismo.
**static**: **não** suporta polimorfismo.

```java
public interface Animal {
    default void fazerBarulho() {
        System.out.println("Animal fazendo barulho");
    }
    
    static void info() {
        System.out.println("Informações de Animal");
    }
}

public class Cachorro implements Animal {
    @Override
    public void fazerBarulho() {
        System.out.println("Au au!");
    }
    
    public static void info() {
        System.out.println("Informações de Cachorro");
    }
}

// Polimorfismo default: funciona
Animal animal = new Cachorro();
animal.fazerBarulho(); // Au au! (polimorfismo)

// Polimorfismo static: não funciona
Animal.info(); // Informações de Animal
Cachorro.info(); // Informações de Cachorro (sem polimorfismo)
```

### 5. this

**default**: pode usar **this**.
**static**: **não** pode usar **this**.

```java
public interface Exemplo {
    String getNome(); // Método abstrato
    
    // default: pode usar this
    default void saudar() {
        System.out.println("Olá, " + this.getNome());
    }
    
    // static: não pode usar this
    static void mensagemGeral() {
        // System.out.println(this.getNome()); // ERRO
        System.out.println("Mensagem geral");
    }
}

public class Impl implements Exemplo {
    @Override
    public String getNome() {
        return "João";
    }
}

Impl obj = new Impl();
obj.saudar(); // Olá, João (usa this)
```

### 6. Métodos Abstratos

**default**: pode chamar métodos abstratos (via this).
**static**: **não** pode chamar métodos abstratos.

```java
public interface Calculadora {
    // Método abstrato
    double getValor();
    
    // default: pode chamar abstrato
    default double dobro() {
        return this.getValor() * 2;
    }
    
    // static: não pode chamar abstrato
    static double triplo(double valor) {
        // return this.getValor() * 3; // ERRO
        return valor * 3; // Recebe por parâmetro
    }
}
```

### 7. Conflito de Múltiplas Interfaces

**default**: pode gerar conflito (deve resolver).
**static**: **não** gera conflito (métodos independentes).

```java
public interface Interface1 {
    default void metodo() {
        System.out.println("Interface1");
    }
    
    static void metodoStatic() {
        System.out.println("Static Interface1");
    }
}

public interface Interface2 {
    default void metodo() {
        System.out.println("Interface2");
    }
    
    static void metodoStatic() {
        System.out.println("Static Interface2");
    }
}

// Conflito default: deve resolver
public class Classe implements Interface1, Interface2 {
    @Override
    public void metodo() { // Resolve conflito
        Interface1.super.metodo();
    }
}

// static: sem conflito (métodos independentes)
Interface1.metodoStatic(); // Static Interface1
Interface2.metodoStatic(); // Static Interface2
```

### 8. Uso de Campos da Interface

**default**: pode acessar constantes da interface.
**static**: pode acessar constantes da interface.

```java
public interface Configuracao {
    String URL_BASE = "https://api.exemplo.com";
    
    // default: acessa constante
    default String getUrlCompleta(String endpoint) {
        return URL_BASE + endpoint;
    }
    
    // static: acessa constante
    static String getUrlPadrao() {
        return URL_BASE + "/padrao";
    }
}
```

### 9. Visibilidade Private

**default**: pode ser **private** (Java 9+).
**static**: pode ser **private** (Java 9+).

```java
public interface Exemplo {
    // default público: herdado
    default void metodoPublico() {
        metodoPrivado(); // Usa private
    }
    
    // default privado: auxiliar interno
    private void metodoPrivado() {
        System.out.println("Private default");
    }
    
    // static público: acesso externo
    static void metodoStaticPublico() {
        metodoStaticPrivado(); // Usa private static
    }
    
    // static privado: auxiliar interno
    private static void metodoStaticPrivado() {
        System.out.println("Private static");
    }
}
```

### 10. Quando Usar Cada Um

**default**:
- Comportamento padrão para implementações
- Pode ser sobrescrito
- Precisa de acesso a estado (this)
- Polimorfismo

**static**:
- Utilitários sem estado
- Factory methods
- Não precisa de instância
- Não pode ser sobrescrito

```java
public interface Configuracao {
    String getUrl(); // Abstrato
    
    // default: comportamento padrão (usa this)
    default void imprimirUrl() {
        System.out.println("URL: " + this.getUrl());
    }
    
    // static: factory method
    static Configuracao desenvolvimento() {
        return () -> "http://localhost:8080";
    }
    
    static Configuracao producao() {
        return () -> "https://api.producao.com";
    }
}
```

---

## Aplicabilidade

**Métodos default**:
- Comportamento padrão para implementações
- Retrocompatibilidade (adicionar método sem quebrar código)
- Polimorfismo
- Template Method pattern

**Métodos static**:
- Utilitários sem estado
- Factory methods
- Validadores
- Helpers

---

## Armadilhas

### 1. Esperar Herança em Static

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

public class MinhaClasse implements Utils {
    public void testar() {
        // ❌ ERRO: static não herdado
        // log("teste"); // ERRO
        
        // ✅ Via interface
        Utils.log("teste");
    }
}
```

### 2. Esperar Polimorfismo em Static

```java
public interface Animal {
    static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro implements Animal {
    public static void info() {
        System.out.println("Cachorro");
    }
}

// ⚠️ Sem polimorfismo
Animal.info();    // Animal
Cachorro.info(); // Cachorro (métodos independentes)
```

### 3. Usar this em Static

```java
public interface Exemplo {
    String getNome();
    
    static void saudar() {
        // ❌ ERRO: static não pode usar this
        // System.out.println(this.getNome()); // ERRO
    }
}
```

### 4. Não Resolver Conflito Default

```java
public interface Interface1 {
    default void metodo() {
        System.out.println("Interface1");
    }
}

public interface Interface2 {
    default void metodo() {
        System.out.println("Interface2");
    }
}

// ❌ ERRO: conflito não resolvido
// public class Classe implements Interface1, Interface2 { } // ERRO

// ✅ Resolver conflito
public class Classe implements Interface1, Interface2 {
    @Override
    public void metodo() { // Resolve
        Interface1.super.metodo();
    }
}
```

### 5. Acessar Static via Instância

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

// ❌ Confuso: static via instância
// Utils utils = ...; // Interface não pode ser instanciada

// ✅ Via interface
Utils.log("mensagem");
```

### 6. Sobrescrever Static

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1");
    }
}

public class Classe implements Interface1 {
    // ❌ NÃO sobrescreve (método diferente)
    // @Override // ERRO
    public static void metodo() {
        System.out.println("Classe");
    }
}
```

### 7. Chamar Método Abstrato em Static

```java
public interface Exemplo {
    double getValor();
    
    static double dobro() {
        // ❌ ERRO: static não pode chamar abstrato
        // return this.getValor() * 2; // ERRO
        
        // ✅ Recebe por parâmetro
        return 0; // Placeholder
    }
    
    // ✅ Static recebe valor
    static double dobro(double valor) {
        return valor * 2;
    }
}
```

---

## Boas Práticas

### 1. Default para Comportamento Padrão

```java
// ✅ default: comportamento padrão
public interface Animal {
    default void respirar() {
        System.out.println("Respirando");
    }
}

public class Cachorro implements Animal {
    // Herda respirar() (pode sobrescrever se necessário)
}
```

### 2. Static para Utilitários

```java
// ✅ static: utilitários sem estado
public interface StringUtils {
    static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }
}

// Uso
boolean vazio = StringUtils.isNullOrEmpty("");
```

### 3. Default para Polimorfismo

```java
// ✅ default: polimorfismo
public interface Forma {
    double getArea();
    
    default void imprimirArea() {
        System.out.println("Área: " + this.getArea());
    }
}

public class Circulo implements Forma {
    private double raio;
    
    @Override
    public double getArea() {
        return Math.PI * raio * raio;
    }
}

Forma forma = new Circulo();
forma.imprimirArea(); // Polimorfismo
```

### 4. Static para Factory Methods

```java
// ✅ static: factory methods
public interface Configuracao {
    String getUrl();
    
    static Configuracao desenvolvimento() {
        return () -> "http://localhost:8080";
    }
    
    static Configuracao producao() {
        return () -> "https://api.producao.com";
    }
}

Configuracao config = Configuracao.desenvolvimento();
```

### 5. Default para Template Method

```java
// ✅ default: Template Method
public interface Processador {
    void processar();
    
    default void executar() {
        validar();
        processar();
        finalizar();
    }
    
    default void validar() {
        System.out.println("Validando");
    }
    
    default void finalizar() {
        System.out.println("Finalizando");
    }
}
```

### 6. Static para Validadores

```java
// ✅ static: validadores sem estado
public interface Validador {
    static void validarNaoNull(Object obj) {
        if (obj == null) {
            throw new IllegalArgumentException("Objeto null");
        }
    }
    
    static void validarPositivo(int valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser > 0");
        }
    }
}
```

### 7. Documentar Diferenças

```java
public interface Exemplo {
    /**
     * Método default: herdado por implementações.
     * Pode ser sobrescrito.
     */
    default void metodoDefault() { }
    
    /**
     * Método static: não herdado.
     * Acesso: {@code Exemplo.metodoStatic()}
     */
    static void metodoStatic() { }
}
```

### 8. Resolver Conflito Default Explicitamente

```java
public interface Interface1 {
    default void metodo() {
        System.out.println("Interface1");
    }
}

public interface Interface2 {
    default void metodo() {
        System.out.println("Interface2");
    }
}

// ✅ Resolver conflito explicitamente
public class Classe implements Interface1, Interface2 {
    @Override
    public void metodo() {
        // Escolhe qual usar
        Interface1.super.metodo();
        
        // Ou combina
        Interface1.super.metodo();
        Interface2.super.metodo();
        
        // Ou implementação própria
        System.out.println("Classe");
    }
}
```

### 9. Private Default/Static para Reutilização

```java
public interface Validador {
    // default público: usa private
    default boolean validarEmail(String email) {
        return isNotEmpty(email) && email.contains("@");
    }
    
    // static público: usa private static
    static boolean validarTelefone(String telefone) {
        return isNotEmpty(telefone) && telefone.length() >= 10;
    }
    
    // private: reutilização em default
    private boolean isNotEmpty(String str) {
        return str != null && !str.isEmpty();
    }
    
    // private static: reutilização em static
    private static boolean isNotEmpty(String str) {
        return str != null && !str.isEmpty();
    }
}
```

### 10. Comparação de Uso

```java
public interface Repositorio<T> {
    // Abstrato: implementação obrigatória
    void salvar(T obj);
    T buscarPorId(Long id);
    
    // default: comportamento padrão (usa this)
    default void salvarTodos(List<T> objetos) {
        objetos.forEach(this::salvar); // Usa método abstrato
    }
    
    // static: utilitário sem estado
    static <T> void validarNaoNull(T obj) {
        if (obj == null) {
            throw new IllegalArgumentException("Objeto null");
        }
    }
}
```

---

## Resumo

**Tabela Comparativa**:

| Aspecto | default | static |
|---------|---------|--------|
| **Herança** | Herdado | Não herdado |
| **Sobrescrita** | Pode | Não pode |
| **Acesso** | Via instância | Via nome da interface |
| **Polimorfismo** | Sim | Não |
| **this** | Pode usar | Não pode usar |
| **Métodos abstratos** | Pode chamar | Não pode chamar |
| **Conflito** | Pode gerar | Não gera |
| **@Override** | Sim | Não |
| **Visibilidade** | public ou private | public ou private |
| **Uso** | Comportamento padrão | Utilitários |

**default**:
```java
default void metodo() {
    System.out.println(this.getNome()); // Pode usar this
}
```

**static**:
```java
static void metodo() {
    System.out.println("Utilitário"); // Não pode usar this
}
```

**Herança**:
- **default**: herdado, pode ser sobrescrito
- **static**: não herdado

**Acesso**:
- **default**: `obj.metodo()`
- **static**: `Interface.metodo()`

**Polimorfismo**:
- **default**: suporta polimorfismo
- **static**: não suporta polimorfismo

**this**:
- **default**: pode usar this
- **static**: não pode usar this

**Conflito**:
- **default**: pode gerar conflito (deve resolver)
- **static**: não gera conflito (métodos independentes)

**Quando usar**:

**default**:
- Comportamento padrão para implementações
- Retrocompatibilidade
- Polimorfismo
- Template Method pattern
- Precisa de acesso a this

**static**:
- Utilitários sem estado
- Factory methods
- Validadores
- Helpers
- Não precisa de instância

**Exemplos**:

**default**:
```java
default void imprimirNome() {
    System.out.println(this.getNome());
}
```

**static**:
```java
static boolean isValid(String str) {
    return str != null && !str.isEmpty();
}
```

**Armadilhas**:
- ❌ Esperar herança em static
- ❌ Esperar polimorfismo em static
- ❌ Usar this em static
- ❌ Não resolver conflito default
- ❌ Acessar static via instância
- ❌ Sobrescrever static
- ❌ Chamar método abstrato em static

**Boas práticas**:
- default para comportamento padrão
- static para utilitários
- default para polimorfismo
- static para factory methods
- default para Template Method
- static para validadores
- Documentar diferenças
- Resolver conflito default explicitamente
- Private default/static para reutilização

**Regra de Ouro**: Use **default** quando precisa de **comportamento padrão herdado** e **polimorfismo** (acesso via instância, pode usar this, pode ser sobrescrito). Use **static** quando precisa de **utilitários sem estado** (acesso via interface, não usa this, não pode ser sobrescrito, não herdado). **default** para comportamento dependente de instância. **static** para comportamento independente de instância.
