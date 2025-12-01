# T4.02 - Não Podem Ser Sobrescritos

## Introdução

**Métodos static**: **não podem ser sobrescritos** (não há polimorfismo).

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1.metodo()");
    }
}

public class Classe implements Interface1 {
    // ❌ NÃO sobrescreve (método diferente)
    public static void metodo() {
        System.out.println("Classe.metodo()");
    }
}

// Uso: métodos diferentes (não polimorfismo)
Interface1.metodo(); // Interface1.metodo()
Classe.metodo();     // Classe.metodo()
```

**Diferença de métodos de instância**:
- **Métodos de instância**: podem ser sobrescritos (polimorfismo)
- **Métodos static**: **não podem** ser sobrescritos (sem polimorfismo)

**Razão**: métodos static pertencem à **interface/classe**, não à **instância**.

---

## Fundamentos

### 1. Não Há Polimorfismo

**static**: sem polimorfismo (sem @Override).

```java
public interface Animal {
    static void info() {
        System.out.println("Interface Animal");
    }
}

public class Cachorro implements Animal {
    // Método diferente (não sobrescreve)
    public static void info() {
        System.out.println("Classe Cachorro");
    }
}

// Uso: sem polimorfismo
Animal.info();    // Interface Animal
Cachorro.info(); // Classe Cachorro
```

### 2. @Override Não Funciona

**@Override**: não funciona com static.

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1");
    }
}

public class Classe implements Interface1 {
    // ❌ ERRO: @Override em static
    // @Override // ERRO: não sobrescreve
    public static void metodo() {
        System.out.println("Classe");
    }
}
```

### 3. Métodos Independentes

Interface e classe: métodos static **independentes**.

```java
public interface Utils {
    static void log(String mensagem) {
        System.out.println("[INTERFACE] " + mensagem);
    }
}

public class MinhaClasse implements Utils {
    // Método diferente (independente)
    public static void log(String mensagem) {
        System.out.println("[CLASSE] " + mensagem);
    }
}

// Uso: métodos independentes
Utils.log("teste");        // [INTERFACE] teste
MinhaClasse.log("teste"); // [CLASSE] teste
```

### 4. Hiding vs Overriding

**Hiding** (ocultação): método static "oculta" outro static na superclasse.

**Overriding** (sobrescrita): método de instância sobrescreve outro na superclasse.

```java
// Hiding (classes)
public class Superclasse {
    public static void metodoStatic() {
        System.out.println("Superclasse.metodoStatic()");
    }
}

public class Subclasse extends Superclasse {
    // Hiding (oculta, não sobrescreve)
    public static void metodoStatic() {
        System.out.println("Subclasse.metodoStatic()");
    }
}

// Uso: sem polimorfismo
Superclasse.metodoStatic(); // Superclasse.metodoStatic()
Subclasse.metodoStatic();   // Subclasse.metodoStatic()

// Overriding (instância)
public class Animal {
    public void fazerBarulho() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    @Override
    public void fazerBarulho() { // Sobrescreve
        System.out.println("Au au!");
    }
}

// Uso: com polimorfismo
Animal animal = new Cachorro();
animal.fazerBarulho(); // Au au! (polimorfismo)
```

### 5. Não Herdado

Implementações **não herdam** métodos static.

```java
public interface Repositorio {
    static void validar(Object obj) {
        if (obj == null) {
            throw new IllegalArgumentException("Objeto null");
        }
    }
}

public class UsuarioRepositorio implements Repositorio {
    public void salvar(Usuario usuario) {
        // ❌ ERRO: não herdado
        // validar(usuario); // ERRO
        
        // ✅ Acesso via interface
        Repositorio.validar(usuario);
    }
}
```

### 6. Interface Extends Interface

Interface filha: **não herda** static da interface pai.

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1");
    }
}

public interface Interface2 extends Interface1 {
    // Não herda metodo() de Interface1
}

// Uso
Interface1.metodo(); // OK
// Interface2.metodo(); // ERRO: não herdado
```

### 7. Múltiplas Interfaces com Mesmo Static

Classe implementa múltiplas interfaces: métodos static **independentes**.

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1");
    }
}

public interface Interface2 {
    static void metodo() {
        System.out.println("Interface2");
    }
}

public class Classe implements Interface1, Interface2 {
    // Não há conflito (métodos independentes)
}

// Uso: sem conflito
Interface1.metodo(); // Interface1
Interface2.metodo(); // Interface2
```

### 8. Static vs Default

**static**: não sobrescrito.
**default**: pode ser sobrescrito.

```java
public interface Exemplo {
    // static: não sobrescrito
    static void metodoStatic() {
        System.out.println("Static");
    }
    
    // default: pode ser sobrescrito
    default void metodoDefault() {
        System.out.println("Default");
    }
}

public class Classe implements Exemplo {
    // metodoStatic() não sobrescrito (independente)
    
    @Override
    public void metodoDefault() { // Sobrescreve
        System.out.println("Default sobrescrito");
    }
}

// Uso
Exemplo.metodoStatic(); // Static (não sobrescrito)

Classe obj = new Classe();
obj.metodoDefault(); // Default sobrescrito (polimorfismo)
```

### 9. Visibilidade em Static

**static**: pode ser **private** (Java 9+).

```java
public interface Exemplo {
    // public static: acessível externamente
    static void metodoPublico() {
        metodoPrivado(); // Usa private static
    }
    
    // private static: auxiliar interno
    private static void metodoPrivado() {
        System.out.println("Privado");
    }
}

// Uso
Exemplo.metodoPublico(); // OK
// Exemplo.metodoPrivado(); // ERRO: private
```

### 10. Final Implícito

**static**: **final** implícito (não pode ser sobrescrito).

```java
public interface Interface1 {
    static void metodo() { // Implicitamente final
        System.out.println("Interface1");
    }
}

// Não pode sobrescrever (final implícito)
public class Classe implements Interface1 {
    // Método diferente (não sobrescreve)
    public static void metodo() {
        System.out.println("Classe");
    }
}
```

---

## Aplicabilidade

**Métodos static não sobrescritíveis**:
- **Utilitários** (comportamento fixo)
- **Factory methods** (sem polimorfismo)
- **Validadores** (lógica imutável)
- **Helpers** (auxiliares fixos)

**Não usar quando**:
- Precisa de **polimorfismo**
- Comportamento varia entre implementações

---

## Armadilhas

### 1. Esperar Polimorfismo

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
Animal.info();    // Animal (não Cachorro)
Cachorro.info(); // Cachorro
```

### 2. Usar @Override

```java
public interface Interface1 {
    static void metodo() { }
}

public class Classe implements Interface1 {
    // ❌ ERRO: @Override em static
    // @Override
    public static void metodo() { }
}
```

### 3. Esperar Herança

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

public class MinhaClasse implements Utils {
    public void testar() {
        // ❌ ERRO: não herdado
        // log("teste"); // ERRO
        
        // ✅ Acesso via interface
        Utils.log("teste");
    }
}
```

### 4. Hiding Confuso

```java
public class Super {
    public static void metodo() {
        System.out.println("Super");
    }
}

public class Sub extends Super {
    // Hiding (oculta, não sobrescreve)
    public static void metodo() {
        System.out.println("Sub");
    }
}

// ⚠️ Confuso: parece polimorfismo, mas não é
Super ref = new Sub();
// ref.metodo(); // ERRO: static não deve ser chamado via instância

// ✅ Claro: via classe
Super.metodo(); // Super
Sub.metodo();   // Sub
```

### 5. Interface Extends

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1");
    }
}

public interface Interface2 extends Interface1 {
    // Não herda metodo()
}

// ❌ ERRO: Interface2 não herda
// Interface2.metodo(); // ERRO
```

### 6. Conflito Aparente

```java
public interface Interface1 {
    static void metodo() { }
}

public interface Interface2 {
    static void metodo() { }
}

public class Classe implements Interface1, Interface2 {
    // ⚠️ Sem conflito (métodos independentes)
}

// Uso: sem conflito
Interface1.metodo();
Interface2.metodo();
```

### 7. Static via Instância

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

// ❌ Evitar: static via instância (confuso)
// Utils utils = ...; // Interface não pode ser instanciada

// ✅ Via nome da interface
Utils.log("mensagem");
```

---

## Boas Práticas

### 1. Não Usar @Override

```java
public interface Interface1 {
    static void metodo() { }
}

// ✅ Sem @Override (não sobrescreve)
public class Classe implements Interface1 {
    public static void metodo() { } // Método diferente
}
```

### 2. Documentar Independência

```java
public interface Utils {
    /**
     * Método static utilitário.
     * 
     * <p>Não pode ser sobrescrito por implementações.
     */
    static void log(String mensagem) {
        System.out.println(mensagem);
    }
}
```

### 3. Acesso via Nome da Interface

```java
// ✅ Claro: via nome da interface
Utils.log("mensagem");

// ❌ Evitar: via instância (confuso)
// utils.log("mensagem"); // Confuso
```

### 4. Usar Default para Polimorfismo

```java
// ❌ static: sem polimorfismo
public interface Errado {
    static void processar() {
        System.out.println("Processando");
    }
}

// ✅ default: com polimorfismo
public interface Correto {
    default void processar() {
        System.out.println("Processando");
    }
}

public class Impl implements Correto {
    @Override
    public void processar() { // Sobrescreve
        System.out.println("Processando customizado");
    }
}
```

### 5. Factory Methods Final

```java
public interface Configuracao {
    String getUrl();
    
    // Factory method: final implícito (não sobrescrito)
    static Configuracao desenvolvimento() {
        return () -> "http://localhost:8080";
    }
    
    static Configuracao producao() {
        return () -> "https://api.producao.com";
    }
}
```

### 6. Naming Distinto

```java
// ✅ Nomes distintos (evita confusão)
public interface Animal {
    static void infoGeral() { // Static
        System.out.println("Informações gerais");
    }
}

public class Cachorro implements Animal {
    public static void infoCachorro() { // Diferente
        System.out.println("Informações do cachorro");
    }
}
```

### 7. Evitar Hiding

```java
// ❌ Evitar hiding (confuso)
public class Super {
    public static void metodo() { }
}

public class Sub extends Super {
    public static void metodo() { } // Hiding
}

// ✅ Nomes diferentes
public class SuperCorreto {
    public static void metodoSuper() { }
}

public class SubCorreto extends SuperCorreto {
    public static void metodoSub() { } // Nome diferente
}
```

### 8. Comentar Independência

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1");
    }
}

public class Classe implements Interface1 {
    // Método independente (não sobrescreve Interface1.metodo())
    public static void metodo() {
        System.out.println("Classe");
    }
}
```

### 9. Validadores Imutáveis

```java
public interface Validador {
    // Static: comportamento fixo (não sobrescrito)
    static void validarNaoNull(Object obj) {
        if (obj == null) {
            throw new IllegalArgumentException("Objeto null");
        }
    }
    
    static void validarPositivo(int valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
    }
}
```

### 10. Private Static para Helpers

```java
public interface Calculadora {
    static double areaCirculo(double raio) {
        validarPositivo(raio);
        return Math.PI * raio * raio;
    }
    
    static double areaQuadrado(double lado) {
        validarPositivo(lado);
        return lado * lado;
    }
    
    // Private static: helper (não sobrescrito)
    private static void validarPositivo(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser > 0");
        }
    }
}
```

---

## Resumo

**Métodos static**: **não podem ser sobrescritos**.

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1");
    }
}

public class Classe implements Interface1 {
    // Método diferente (não sobrescreve)
    public static void metodo() {
        System.out.println("Classe");
    }
}

// Sem polimorfismo
Interface1.metodo(); // Interface1
Classe.metodo();     // Classe
```

**@Override**: não funciona.
```java
// ❌ ERRO
// @Override
public static void metodo() { }
```

**Não herdado**:
```java
public class Impl implements Interface {
    public void testar() {
        // Interface.metodoStatic(); // Não herdado
    }
}
```

**Hiding vs Overriding**:
- **Hiding**: static "oculta" outro static (sem polimorfismo)
- **Overriding**: instância sobrescreve outro (com polimorfismo)

**Interface extends**:
```java
public interface Interface2 extends Interface1 {
    // Não herda static de Interface1
}
```

**Múltiplas interfaces**:
```java
public class Classe implements Interface1, Interface2 {
    // Sem conflito (métodos independentes)
}
```

**static vs default**:

| Aspecto | static | default |
|---------|--------|---------|
| **Sobrescrita** | Não pode | Pode |
| **Polimorfismo** | Não | Sim |
| **Herança** | Não | Sim |
| **@Override** | Não | Sim |

**Private static** (Java 9+):
```java
private static void auxiliar() { }
```

**Final implícito**:
```java
static void metodo() { } // Implicitamente final
```

**Boas práticas**:
- Não usar @Override
- Documentar independência
- Acesso via nome da interface
- Usar **default** para polimorfismo
- Factory methods final
- Naming distinto (evitar confusão)
- Evitar hiding
- Comentar independência
- Validadores imutáveis
- Private static para helpers

**Armadilhas**:
- ❌ Esperar polimorfismo
- ❌ Usar @Override
- ❌ Esperar herança
- ❌ Hiding confuso
- ❌ Interface extends (não herda)
- ❌ Conflito aparente (métodos independentes)
- ❌ Static via instância

**Regra de Ouro**: Métodos **static** **não podem ser sobrescritos** (sem polimorfismo). São **independentes** entre interface e classe/implementação. **Não herdados** por implementações. **Final implícito**. Use **default** quando precisa de polimorfismo. Acesse via **nome da interface**. Não use **@Override**. Métodos static de múltiplas interfaces são **independentes** (sem conflito).
