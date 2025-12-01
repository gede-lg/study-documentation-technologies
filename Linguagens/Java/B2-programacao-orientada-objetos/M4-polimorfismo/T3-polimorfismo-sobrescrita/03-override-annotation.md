# T3.03 - @Override Annotation

## Introdução

**@Override**: annotation que indica que método **sobrescreve** método da superclasse ou **implementa** método de interface.

```java
public class Animal {
    public void som() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

**Benefícios**:
- **Detecção de erros** em compile-time
- **Documentação** (indica intenção)
- **Segurança** contra typos
- **Refactoring** (compilador valida)

**Opcional mas fortemente recomendada**.

---

## Fundamentos

### 1. Sintaxe Básica

**@Override** antes da declaração do método.

```java
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 2. Detecção de Erros

Compilador **valida** que método realmente sobrescreve.

```java
public class Animal {
    public void som() { }
}

public class Cachorro extends Animal {
    @Override
    public void soM() { // ❌ Erro: typo (M maiúsculo)
        System.out.println("Au au");
    }
}

// Erro de compilação: método não sobrescreve
```

### 3. Typo no Nome do Método

```java
public class Animal {
    public void mover() { }
}

public class Cachorro extends Animal {
    // Sem @Override: cria novo método (typo não detectado)
    public void moveR() { // Typo
        System.out.println("Movendo");
    }
}

public class Gato extends Animal {
    // Com @Override: erro detectado
    @Override
    public void moveR() { // ❌ Erro de compilação
        System.out.println("Movendo");
    }
}
```

### 4. Parâmetros Diferentes

```java
public class Animal {
    public void mover(int distancia) { }
}

public class Cachorro extends Animal {
    @Override
    public void mover(double distancia) { // ❌ Erro: parâmetros diferentes
        System.out.println("Movendo");
    }
}

// Erro: método não sobrescreve (parâmetros diferentes)
```

### 5. Refactoring Seguro

@Override **protege contra quebra** durante refactoring.

```java
public class Animal {
    public void som() { } // Renomeado para emitirSom()
}

public class Cachorro extends Animal {
    @Override
    public void som() { // ❌ Erro: método não existe mais
        System.out.println("Au au");
    }
}

// Erro detectado: desenvolvedor atualiza Cachorro
```

### 6. Interfaces (Java 6+)

A partir do **Java 6**, @Override funciona com **interfaces**.

```java
public interface Voador {
    void voar();
}

public class Passaro implements Voador {
    @Override
    public void voar() { // OK: implementa interface
        System.out.println("Voando");
    }
}
```

### 7. Métodos de Object

@Override valida sobrescrita de métodos de **Object**.

```java
public class Pessoa {
    private String nome;
    
    @Override
    public boolean equals(Object obj) { // OK
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Pessoa pessoa = (Pessoa) obj;
        return Objects.equals(nome, pessoa.nome);
    }
    
    @Override
    public int hashCode() { // OK
        return Objects.hash(nome);
    }
    
    @Override
    public String toString() { // OK
        return "Pessoa[nome=" + nome + "]";
    }
}
```

### 8. Métodos static Não Podem Usar @Override

```java
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    @Override // ❌ Erro: static não é sobrescrita
    public static void info() {
        System.out.println("Cachorro");
    }
}
```

### 9. Métodos final Não Podem Ser Sobrescritos

```java
public class Animal {
    public final void respirar() { }
}

public class Cachorro extends Animal {
    @Override // ❌ Erro: não pode sobrescrever final
    public void respirar() { }
}
```

### 10. Documentação de Intenção

@Override **documenta** intenção do desenvolvedor.

```java
public class Cachorro extends Animal {
    // ✅ Intenção clara: sobrescrever método herdado
    @Override
    public void som() {
        System.out.println("Au au");
    }
    
    // ⚠️ Intenção não clara: novo método ou typo?
    public void latir() {
        System.out.println("Latindo");
    }
}
```

---

## Aplicabilidade

**Use @Override sempre que**:
- **Sobrescrever** método de superclasse
- **Implementar** método de interface
- **Sobrescrever** método de Object (equals, hashCode, toString)
- **Garantir** refactoring seguro

**Não use @Override quando**:
- Criar **novo método** (não sobrescreve)
- Método **static** (hiding, não sobrescrita)
- **Java 5** com interfaces (não suportado)

---

## Armadilhas

### 1. Esquecer @Override

```java
public class Animal {
    public void som() { }
}

public class Cachorro extends Animal {
    // ⚠️ Sem @Override: typo não detectado
    public void soM() { // Typo
        System.out.println("Au au");
    }
}

Cachorro c = new Cachorro();
c.som(); // Chama Animal.som() - não sobrescreveu
```

### 2. @Override com Parâmetros Diferentes

```java
public class Animal {
    public void mover(int distancia) { }
}

public class Cachorro extends Animal {
    @Override
    public void mover(double distancia) { // ❌ Erro
        System.out.println("Movendo");
    }
}
```

### 3. @Override com Métodos static

```java
public class Animal {
    public static void categoria() { }
}

public class Cachorro extends Animal {
    @Override // ❌ Erro: static não é sobrescrita
    public static void categoria() { }
}
```

### 4. @Override com Métodos private

```java
public class Animal {
    private void metabolismo() { }
}

public class Cachorro extends Animal {
    @Override // ❌ Erro: private não é herdado
    private void metabolismo() { }
}
```

### 5. Modificador de Acesso Incompatível

```java
public class Animal {
    public void mover() { }
}

public class Cachorro extends Animal {
    @Override
    protected void mover() { } // ❌ Erro: reduz visibilidade
}
```

### 6. Tipo de Retorno Incompatível

```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    @Override
    public String criar() { // ❌ Erro: tipo incompatível
        return "Cachorro";
    }
}
```

### 7. Exception Incompatível

```java
public class Repositorio {
    public void salvar() throws IOException { }
}

public class RepositorioArquivo extends Repositorio {
    @Override
    public void salvar() throws Exception { // ❌ Erro: Exception mais ampla
        // Implementação
    }
}
```

---

## Boas Práticas

### 1. Sempre Use @Override

```java
// ✅ Sempre
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

// ❌ Evite
public class Gato extends Animal {
    public void som() { // Sem @Override
        System.out.println("Miau");
    }
}
```

### 2. @Override com Equals e HashCode

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Pessoa pessoa = (Pessoa) obj;
        return idade == pessoa.idade && 
               Objects.equals(nome, pessoa.nome);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(nome, idade);
    }
}
```

### 3. @Override com ToString

```java
public class Animal {
    protected String especie;
    
    @Override
    public String toString() {
        return "Animal[especie=" + especie + "]";
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    @Override
    public String toString() {
        return "Cachorro[especie=" + especie + ", raca=" + raca + "]";
    }
}
```

### 4. @Override com Comparable

```java
public class Funcionario implements Comparable<Funcionario> {
    private String nome;
    private double salario;
    
    @Override
    public int compareTo(Funcionario outro) {
        return Double.compare(this.salario, outro.salario);
    }
}
```

### 5. @Override com Clone

```java
public class Pessoa implements Cloneable {
    private String nome;
    private int idade;
    
    @Override
    public Pessoa clone() {
        try {
            return (Pessoa) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```

### 6. @Override com Finalize (Depreciado)

```java
public class Recurso {
    // ⚠️ Depreciado desde Java 9
    @Override
    protected void finalize() throws Throwable {
        try {
            // Liberar recursos
        } finally {
            super.finalize();
        }
    }
}

// ✅ Prefira: try-with-resources
public class Recurso implements AutoCloseable {
    @Override
    public void close() {
        // Liberar recursos
    }
}
```

### 7. IDE Configuração

Configure IDE para **avisar** quando @Override está faltando.

```java
// Eclipse: Preferences → Java → Compiler → Errors/Warnings
// IntelliJ: Settings → Editor → Inspections → Java → Probable bugs

// Ativar: "Missing @Override annotation"
```

### 8. Checkstyle Rule

```xml
<!-- checkstyle.xml -->
<module name="MissingOverride">
    <property name="javaFiveCompatibility" value="false"/>
</module>
```

### 9. SuppressWarnings com @Override

```java
public class Teste {
    @Override
    @SuppressWarnings("deprecation") // Suprime warning de método depreciado
    public void metodoDepreciado() {
        // Implementação
    }
}
```

### 10. @Override em Hierarquias Profundas

```java
public class Animal {
    public void som() { }
}

public class Mamifero extends Animal {
    @Override
    public void som() { } // Sobrescreve Animal.som()
}

public class Cachorro extends Mamifero {
    @Override
    public void som() { } // Sobrescreve Mamifero.som()
}
```

---

## Resumo

**@Override**: annotation que valida **sobrescrita** de método em compile-time.

```java
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

**Benefícios**:
- **Detecção de erros** (typos, parâmetros, refactoring)
- **Documentação** (indica intenção)
- **Segurança** (validação em compile-time)

**Detecção de typos**:
```java
public class Animal {
    public void som() { }
}

public class Cachorro extends Animal {
    @Override
    public void soM() { // ❌ Erro detectado
        System.out.println("Au au");
    }
}
```

**Refactoring seguro**:
```java
// Animal.som() renomeado para emitirSom()

public class Cachorro extends Animal {
    @Override
    public void som() { // ❌ Erro: método não existe mais
        System.out.println("Au au");
    }
}
```

**Interfaces (Java 6+)**:
```java
public class Passaro implements Voador {
    @Override
    public void voar() { // OK
        System.out.println("Voando");
    }
}
```

**Métodos de Object**:
```java
@Override
public boolean equals(Object obj) { }

@Override
public int hashCode() { }

@Override
public String toString() { }
```

**Restrições**:
- **Não funciona** com métodos static (hiding)
- **Não funciona** com métodos final (não podem ser sobrescritos)
- **Não funciona** com métodos private (não herdados)

**Quando usar**:
- **Sempre** ao sobrescrever método
- **Sempre** ao implementar interface
- **Sempre** ao sobrescrever Object (equals, hashCode, toString)

**Configure IDE**:
- Aviso quando @Override está faltando
- Checkstyle rule: MissingOverride

**Regra de Ouro**: **Sempre use @Override** ao sobrescrever métodos. Protege contra **typos**, **refactoring quebrado**, e **parâmetros incorretos**. É **documentação executável** da intenção do desenvolvedor.
