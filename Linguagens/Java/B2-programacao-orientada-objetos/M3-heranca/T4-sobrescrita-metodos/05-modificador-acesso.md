# T4.05 - Modificador de Acesso em Sobrescrita

## Introdução

**Modificador de acesso** do método sobrescrito **NÃO pode ser mais restritivo** que o da superclasse.

**Pode ser**:
- **Igual**
- **Mais permissivo**

**NÃO pode ser mais restritivo**.

```java
public class Animal {
    protected void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    // ✅ CORRETO: protected → public (mais permissivo)
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
    
    // ❌ ERRO: protected → private (mais restritivo)
    /*
    @Override
    private void emitirSom() {
        System.out.println("Au au!");
    }
    */
}
```

---

## Fundamentos

### 1. Hierarquia de Modificadores

**Ordem de restrição** (do mais restritivo ao mais permissivo):

```
private < default (package-private) < protected < public
```

**Regra**: Pode **aumentar** visibilidade, **nunca diminuir**.

### 2. protected → protected (Igual)

**Mantém mesmo nível** de acesso.

```java
public class Veiculo {
    protected void acelerar() {
        System.out.println("Acelerando...");
    }
}

public class Carro extends Veiculo {
    @Override
    protected void acelerar() { // ✅ protected → protected
        System.out.println("Carro acelerando");
    }
}
```

### 3. protected → public (Mais Permissivo)

**Aumenta visibilidade**.

```java
public class Animal {
    protected void dormir() {
        System.out.println("Dormindo...");
    }
}

public class Cachorro extends Animal {
    @Override
    public void dormir() { // ✅ protected → public
        System.out.println("Cachorro dormindo");
    }
}
```

### 4. default → protected ou public

**default** pode tornar-se **protected** ou **public**.

```java
public class Base {
    void metodo() { } // default (package-private)
}

public class Derivada extends Base {
    @Override
    protected void metodo() { } // ✅ default → protected
    
    // OU
    @Override
    public void metodo() { } // ✅ default → public
}
```

### 5. public → public (Obrigatório)

**public** deve **permanecer public**.

```java
public class Funcionario {
    public void trabalhar() {
        System.out.println("Trabalhando...");
    }
}

public class Gerente extends Funcionario {
    @Override
    public void trabalhar() { // ✅ public → public
        System.out.println("Gerenciando...");
    }
    
    // ❌ ERRO: public → protected (mais restritivo)
    /*
    @Override
    protected void trabalhar() { }
    */
}
```

### 6. Erro: Tornar Mais Restritivo

```java
public class Base {
    public void metodo() { }
}

public class Derivada extends Base {
    // ❌ ERRO: public → protected
    @Override
    protected void metodo() { }
    
    // ❌ ERRO: public → default
    @Override
    void metodo() { }
    
    // ❌ ERRO: public → private
    @Override
    private void metodo() { }
}
```

### 7. Por Que Esta Regra?

**Princípio de Substituição de Liskov**: Subclasse deve ser **substituível** por superclasse.

```java
Animal animal = new Cachorro();
animal.emitirSom(); // ✅ Deve funcionar
```

Se **emitirSom()** fosse **private** em `Cachorro`:
```java
Animal animal = new Cachorro();
animal.emitirSom(); // ❌ Não compilaria (private não acessível)
```

### 8. Modificadores em Hierarquia Complexa

**Cada nível** pode aumentar visibilidade, **nunca diminuir**.

```java
public class A {
    protected void metodo() { }
}

public class B extends A {
    @Override
    public void metodo() { } // protected → public ✅
}

public class C extends B {
    // ❌ ERRO: não pode voltar para protected
    /*
    @Override
    protected void metodo() { }
    */
    
    @Override
    public void metodo() { } // ✅ Mantém public
}
```

### 9. Interfaces: Sempre public

**Métodos de interface** são **public** implicitamente.

```java
public interface Voador {
    void voar(); // public implícito
}

public class Passaro implements Voador {
    @Override
    public void voar() { // ✅ Deve ser public
        System.out.println("Voando...");
    }
    
    // ❌ ERRO: não pode ser menos visível
    /*
    @Override
    void voar() { } // default
    */
}
```

### 10. Modificador package-private (default)

**default** permite acesso apenas no **mesmo pacote**.

```java
// Pacote: com.exemplo
public class Base {
    void metodo() { } // default (package-private)
}

public class Derivada extends Base {
    @Override
    void metodo() { } // ✅ default → default
    
    @Override
    protected void metodo() { } // ✅ default → protected
    
    @Override
    public void metodo() { } // ✅ default → public
}
```

---

## Aplicabilidade

**Regra aplica-se a**:
- Métodos de instância
- Todos os níveis de herança
- Implementações de interfaces

**Objetivo**:
- Garantir **substituibilidade**
- Manter **contrato** da superclasse
- Evitar **quebra de polimorfismo**

---

## Armadilhas

### 1. Diminuir Visibilidade

```java
public class Base {
    public void metodo() { }
}

public class Derivada extends Base {
    // ❌ ERRO: public → private
    @Override
    private void metodo() { }
}
```

### 2. Interface: Esquecer public

```java
public interface Processador {
    void processar();
}

public class ProcessadorImpl implements Processador {
    // ❌ ERRO: default (menos visível que public)
    @Override
    void processar() { }
    
    // ✅ CORRETO
    @Override
    public void processar() { }
}
```

### 3. Hierarquia: Tentar Reduzir Após Aumentar

```java
public class A {
    protected void metodo() { }
}

public class B extends A {
    @Override
    public void metodo() { } // protected → public ✅
}

public class C extends B {
    // ❌ ERRO: não pode reduzir de public
    @Override
    protected void metodo() { }
}
```

---

## Boas Práticas

### 1. Mantenha Mesmo Modificador Quando Possível

```java
public class Base {
    public void metodo() { }
}

public class Derivada extends Base {
    @Override
    public void metodo() { } // ✅ Mantém public
}
```

### 2. Aumente Visibilidade Apenas Quando Necessário

```java
public class Animal {
    protected void processarInterno() { }
}

public class Cachorro extends Animal {
    // Se necessário tornar público
    @Override
    public void processarInterno() { }
}
```

### 3. Use @Override Para Validar

```java
@Override
public void metodo() {
    // Compilador valida modificador
}
```

### 4. Documente Mudança de Visibilidade

```java
/**
 * Torna público o método protegido da superclasse
 * para permitir uso externo.
 */
@Override
public void metodo() {
    super.metodo();
}
```

### 5. Interface: Sempre Declare public Explicitamente

```java
public interface Servico {
    void executar();
}

public class ServicoImpl implements Servico {
    @Override
    public void executar() { // ✅ Explícito
        // ...
    }
}
```

---

## Resumo

**Hierarquia de Modificadores**:
```
private < default < protected < public
  (mais restritivo → mais permissivo)
```

**Regra**: Modificador sobrescrito **deve ser igual ou mais permissivo**.

**Transições permitidas**:
```java
private   → não pode sobrescrever (não é herdado)
default   → default ✅
default   → protected ✅
default   → public ✅
protected → protected ✅
protected → public ✅
public    → public ✅
```

**Transições NÃO permitidas**:
```java
public    → protected ❌
public    → default ❌
public    → private ❌
protected → default ❌
protected → private ❌
default   → private ❌
```

**Exemplos**:
```java
// Superclasse
protected void metodo() { }

// Subclasse
@Override
protected void metodo() { } // ✅ Igual
@Override
public void metodo() { }    // ✅ Mais permissivo

// ❌ ERRO
@Override
private void metodo() { }   // Mais restritivo
```

**Interfaces**:
```java
public interface I {
    void metodo(); // public implícito
}

public class C implements I {
    @Override
    public void metodo() { } // ✅ Deve ser public
}
```

**Hierarquia**:
```java
protected → public → public
  A          B        C
           (✅ pode aumentar)
           (❌ não pode diminuir)
```

**Por quê?**: **Princípio de Substituição de Liskov**
```java
Animal a = new Cachorro();
a.metodo(); // Deve funcionar sem erros de visibilidade
```

**Regra de Ouro**: **Nunca reduza visibilidade**. Mantenha igual ou aumente.
