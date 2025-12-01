# T7.01 - Conceito de abstract

## Introdução

**abstract** define **abstração** em Java.

**Classes abstratas**: não podem ser instanciadas.

**Métodos abstratos**: sem implementação (apenas assinatura).

**Subclasses concretas** devem implementar métodos abstratos.

```java
public abstract class Animal {
    public abstract void som(); // Sem implementação
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

// Uso
Animal a = new Animal(); // ❌ Erro: classe abstrata
Animal c = new Cachorro(); // ✅ OK
c.som(); // "Au au"
```

```java
public abstract class Forma {
    public abstract double calcularArea();
    
    public void exibir() { // Método concreto
        System.out.println("Área: " + calcularArea());
    }
}
```

---

## Fundamentos

### 1. Palavra-chave abstract

**Modificador** para classes e métodos.

```java
// Classe abstrata
public abstract class Animal {
    // ...
}

// Método abstrato
public abstract void metodo();
```

### 2. Abstração

**Ocultar detalhes** de implementação, expor apenas **interface**.

```java
// Animal define "o que" (interface)
public abstract class Animal {
    public abstract void som();
}

// Cachorro define "como" (implementação)
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 3. Classe Abstrata Não Pode Ser Instanciada

```java
public abstract class Forma {
    public abstract double calcularArea();
}

// ❌ Erro de compilação
Forma f = new Forma();

// ✅ OK: instanciar subclasse concreta
Forma c = new Circulo(5);
```

### 4. Método Abstrato Sem Implementação

**Apenas assinatura** (sem corpo).

```java
public abstract class Animal {
    public abstract void som(); // Sem {}
}
```

### 5. Classe com Método Abstrato Deve Ser Abstrata

```java
// ❌ Erro: método abstrato em classe concreta
public class Animal {
    public abstract void som();
}

// ✅ Correto
public abstract class Animal {
    public abstract void som();
}
```

### 6. Classe Abstrata Pode Ter Métodos Concretos

```java
public abstract class Animal {
    public abstract void som(); // Abstrato
    
    public void dormir() { // Concreto
        System.out.println("Dormindo...");
    }
}
```

### 7. Subclasse Concreta Deve Implementar Métodos Abstratos

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro: faltando implementar som()
public class Cachorro extends Animal {
}

// ✅ Correto
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 8. Subclasse Abstrata Não Precisa Implementar

```java
public abstract class Animal {
    public abstract void som();
}

// ✅ OK: subclasse abstrata
public abstract class Mamifero extends Animal {
    // Não precisa implementar som()
}

// Subclasse concreta deve implementar
public class Cachorro extends Mamifero {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 9. Classe Abstrata Sem Métodos Abstratos

**Permitido**, mas incomum.

```java
public abstract class Base {
    public void metodo() {
        System.out.println("Base");
    }
}

// Não pode instanciar, mas não tem métodos abstratos
```

### 10. abstract vs interface

**Classe abstrata**: pode ter estado (atributos), métodos concretos.

**Interface**: apenas métodos abstratos (antes Java 8), sem estado.

```java
// Classe abstrata
public abstract class Animal {
    protected String nome; // Estado
    
    public abstract void som();
    
    public void setNome(String nome) {
        this.nome = nome;
    }
}

// Interface
public interface Voador {
    void voar(); // Apenas métodos abstratos
}
```

---

## Aplicabilidade

**Use abstract quando**:
- **Comportamento comum** + **detalhes específicos**
- Definir **template** (estrutura) para subclasses
- **Impossível** ter implementação genérica
- **Compartilhar código** entre subclasses
- **Impedir instanciação** de classe base

**Exemplos**:
```java
// Template para relatórios
public abstract class Relatorio {
    public final void gerar() {
        carregar();
        processar();
        salvar();
    }
    
    protected abstract void carregar();
    protected abstract void processar();
    protected abstract void salvar();
}
```

---

## Armadilhas

### 1. Tentar Instanciar Classe Abstrata

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro de compilação
Animal a = new Animal();
```

### 2. Método Abstrato em Classe Concreta

```java
// ❌ Erro: classe deve ser abstrata
public class Animal {
    public abstract void som();
}
```

### 3. Esquecer de Implementar Métodos Abstratos

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro: faltando implementar som()
public class Cachorro extends Animal {
}
```

### 4. Método Abstrato com Corpo

```java
// ❌ Erro: método abstrato não pode ter corpo
public abstract void som() {
    System.out.println("Som");
}

// ✅ Correto
public abstract void som();
```

### 5. abstract com final (Conflito)

```java
// ❌ Erro: abstract não pode ser final
public abstract final class Animal {
}

// ❌ Erro: método abstrato não pode ser final
public abstract final void som();
```

### 6. abstract com private (Conflito)

```java
// ❌ Erro: método abstrato não pode ser private
public abstract class Animal {
    private abstract void som();
}
```

### 7. abstract com static (Conflito)

```java
// ❌ Erro: método abstrato não pode ser static
public abstract class Animal {
    public abstract static void som();
}
```

---

## Boas Práticas

### 1. Use Para Hierarquias com Comportamento Comum

```java
public abstract class Funcionario {
    protected String nome;
    protected double salarioBase;
    
    public abstract double calcularSalario();
    
    public void exibirInfo() {
        System.out.println(nome + ": R$ " + calcularSalario());
    }
}

public class Gerente extends Funcionario {
    private double bonus;
    
    @Override
    public double calcularSalario() {
        return salarioBase + bonus;
    }
}
```

### 2. Template Method Pattern

```java
public abstract class ProcessadorDados {
    public final void processar() {
        carregar();
        validar();
        executar();
        salvar();
    }
    
    protected abstract void carregar();
    protected abstract void validar();
    protected abstract void executar();
    protected abstract void salvar();
}
```

### 3. Combine Métodos Abstratos e Concretos

```java
public abstract class Conta {
    protected double saldo;
    
    public abstract void calcularRendimento();
    
    public void depositar(double valor) {
        saldo += valor;
    }
    
    public void sacar(double valor) {
        if (saldo >= valor) {
            saldo -= valor;
        }
    }
}
```

### 4. Use @Override em Implementações

```java
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 5. protected Para Métodos Auxiliares

```java
public abstract class Relatorio {
    public final void gerar() {
        inicializar();
        processar();
        finalizar();
    }
    
    protected abstract void processar();
    
    protected void inicializar() {
        // Método auxiliar
    }
    
    protected void finalizar() {
        // Método auxiliar
    }
}
```

### 6. Documente Métodos Abstratos

```java
/**
 * Calcula área da forma geométrica.
 * @return área em unidades quadradas
 */
public abstract double calcularArea();
```

### 7. Prefira Interfaces Para Contratos Simples

```java
// ✅ Interface para contrato simples
public interface Comparable<T> {
    int compareTo(T other);
}

// ✅ Classe abstrata para comportamento comum
public abstract class Animal {
    protected String nome;
    
    public abstract void som();
    
    public void setNome(String nome) {
        this.nome = nome;
    }
}
```

### 8. Evite Hierarquias Muito Profundas

```java
// ❌ Hierarquia profunda
Animal → Mamifero → Carnivoro → Canideo → Cachorro

// ✅ Mais simples
Animal → Cachorro
```

### 9. Use Para Factory Method Pattern

```java
public abstract class DocumentoFactory {
    public abstract Documento criarDocumento();
    
    public void processar() {
        Documento doc = criarDocumento();
        doc.abrir();
        doc.processar();
        doc.salvar();
    }
}
```

---

## Resumo

**Classe abstrata**:
```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Não pode instanciar
Animal a = new Animal();
```

**Método abstrato**:
```java
public abstract void som(); // Sem corpo
```

**Implementação**:
```java
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

**Métodos concretos em classe abstrata**:
```java
public abstract class Animal {
    public abstract void som(); // Abstrato
    
    public void dormir() { // Concreto
        System.out.println("Dormindo");
    }
}
```

**Subclasse abstrata**:
```java
public abstract class Mamifero extends Animal {
    // Não precisa implementar som()
}
```

**Conflitos**:
```java
// ❌ abstract + final
public abstract final class Animal { }

// ❌ abstract + private
private abstract void som();

// ❌ abstract + static
public abstract static void som();
```

**Template Method**:
```java
public abstract class Processador {
    public final void processar() {
        passo1();
        passo2();
        passo3();
    }
    
    protected abstract void passo1();
    protected abstract void passo2();
    protected abstract void passo3();
}
```

**abstract vs interface**:
```java
// Classe abstrata: estado + comportamento
public abstract class Animal {
    protected String nome; // Estado
    public abstract void som();
}

// Interface: apenas contrato
public interface Voador {
    void voar();
}
```

**Quando usar**:
- ✅ Comportamento comum + detalhes específicos
- ✅ Template Method Pattern
- ✅ Hierarquia de classes relacionadas
- ✅ Compartilhar código
- ❌ Contrato simples (use interface)

**Regra de Ouro**: Use **abstract** para **compartilhar comportamento** entre classes relacionadas. **Subclasses concretas** devem implementar **métodos abstratos**. **Não pode instanciar** classe abstrata. **Combine** métodos abstratos e concretos.
