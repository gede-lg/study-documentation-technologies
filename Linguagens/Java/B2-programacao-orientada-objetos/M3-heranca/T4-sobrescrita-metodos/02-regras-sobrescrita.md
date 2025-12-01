# T4.02 - Regras para Sobrescrita de Métodos

## Introdução

**Sobrescrita possui regras rígidas** que devem ser seguidas.

**Regras principais**:
1. Assinatura idêntica
2. Modificador de acesso igual ou mais permissivo
3. Tipo de retorno idêntico ou covariante
4. Exceções não podem ser mais genéricas
5. Método não pode ser final, static ou private

```java
public class Animal {
    public String emitirSom() {
        return "Som genérico";
    }
}

public class Cachorro extends Animal {
    // ✅ Segue todas as regras
    @Override
    public String emitirSom() { // Assinatura idêntica, acesso público
        return "Au au!";
    }
}
```

---

## Fundamentos

### 1. Regra 1: Assinatura Idêntica

**Nome e lista de parâmetros** devem ser **exatamente iguais**.

```java
public class Base {
    public void processar(String texto, int numero) { }
}

public class Derivada extends Base {
    // ✅ CORRETO: assinatura idêntica
    @Override
    public void processar(String texto, int numero) { }
    
    // ❌ NÃO é sobrescrita (parâmetros diferentes) - é SOBRECARGA
    public void processar(String texto) { }
    
    // ❌ NÃO é sobrescrita (ordem diferente)
    public void processar(int numero, String texto) { }
}
```

### 2. Regra 2: Modificador de Acesso

**Modificador NÃO pode ser mais restritivo**.

```java
public class Veiculo {
    protected void acelerar() { }
}

public class Carro extends Veiculo {
    // ✅ CORRETO: protected → public (mais permissivo)
    @Override
    public void acelerar() { }
    
    // ✅ CORRETO: protected → protected (igual)
    @Override
    protected void acelerar() { }
    
    // ❌ ERRO: protected → private (mais restritivo)
    /*
    @Override
    private void acelerar() { }
    */
}
```

**Ordem de permissividade**: `private` < `default` < `protected` < `public`

### 3. Regra 3: Tipo de Retorno

**Tipo de retorno deve ser idêntico** ou **covariante** (subclasse).

```java
public class Animal {
    public Animal reproduzir() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    // ✅ CORRETO: tipo idêntico
    @Override
    public Animal reproduzir() {
        return new Cachorro();
    }
    
    // ✅ CORRETO: tipo covariante (Cachorro é subclasse de Animal)
    @Override
    public Cachorro reproduzir() {
        return new Cachorro();
    }
    
    // ❌ ERRO: String não é covariante de Animal
    /*
    @Override
    public String reproduzir() {
        return "Cachorro";
    }
    */
}
```

**Covariância**: Retorno pode ser **tipo mais específico** (Java 5+).

### 4. Regra 4: Exceções Checked

**Exceções checked NÃO podem ser mais genéricas**.

```java
import java.io.*;

public class Leitor {
    public void ler() throws IOException { }
}

public class LeitorArquivo extends Leitor {
    // ✅ CORRETO: sem exceção
    @Override
    public void ler() { }
    
    // ✅ CORRETO: mesma exceção
    @Override
    public void ler() throws IOException { }
    
    // ✅ CORRETO: subclasse (FileNotFoundException extends IOException)
    @Override
    public void ler() throws FileNotFoundException { }
    
    // ❌ ERRO: Exception é mais genérica que IOException
    /*
    @Override
    public void ler() throws Exception { }
    */
}
```

**Exceções unchecked** (RuntimeException): **sem restrição**.

```java
public class Base {
    public void processar() { }
}

public class Derivada extends Base {
    // ✅ CORRETO: pode lançar unchecked mesmo se superclasse não lança
    @Override
    public void processar() throws NullPointerException { }
}
```

### 5. Regra 5: Métodos final NÃO Podem Ser Sobrescritos

```java
public class Base {
    public final void metodoFinal() {
        System.out.println("Final");
    }
}

public class Derivada extends Base {
    // ❌ ERRO: não pode sobrescrever final
    /*
    @Override
    public void metodoFinal() {
        System.out.println("Tentando sobrescrever");
    }
    */
}
```

### 6. Regra 6: Métodos static NÃO São Sobrescritos

**Métodos static NÃO usam polimorfismo**.

```java
public class Base {
    public static void metodoEstatico() {
        System.out.println("Base");
    }
}

public class Derivada extends Base {
    // Não é sobrescrita, é "hiding"
    public static void metodoEstatico() {
        System.out.println("Derivada");
    }
}

// Uso
Base b = new Derivada();
b.metodoEstatico(); // "Base" ← NÃO usa polimorfismo
```

**Method Hiding**: Método estático **esconde** (não sobrescreve) método da superclasse.

### 7. Regra 7: Métodos private NÃO Podem Ser Sobrescritos

**Métodos private não são herdados**.

```java
public class Base {
    private void metodoPrivado() {
        System.out.println("Base privado");
    }
}

public class Derivada extends Base {
    // Não é sobrescrita, é NOVO método
    private void metodoPrivado() {
        System.out.println("Derivada privado");
    }
}
```

### 8. Regra 8: Construtores NÃO São Sobrescritos

**Construtores não são métodos** e **não são herdados**.

```java
public class Animal {
    public Animal(String nome) { }
}

public class Cachorro extends Animal {
    // Não é sobrescrita, é NOVO construtor
    public Cachorro(String nome) {
        super(nome);
    }
}
```

### 9. Anotação @Override É Obrigatória?

**NÃO**, mas **altamente recomendada**.

```java
public class Cachorro extends Animal {
    // ✅ Funciona sem @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
    
    // ✅ MELHOR: com @Override (detecta erros)
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}
```

**@Override** detecta:
- Erro de digitação no nome
- Mudança na assinatura da superclasse
- Método inexistente

### 10. Regras de Visibilidade em Hierarquia

**Subclasse pode tornar método mais visível**, **nunca menos**.

```java
// Superclasse
public class A {
    protected void metodo() { }
}

// Subclasse nível 1
public class B extends A {
    @Override
    public void metodo() { } // protected → public ✅
}

// Subclasse nível 2
public class C extends B {
    // ❌ ERRO: não pode voltar para protected
    /*
    @Override
    protected void metodo() { }
    */
    
    // ✅ CORRETO: mantém public
    @Override
    public void metodo() { }
}
```

---

## Aplicabilidade

**Regras aplicam-se a**:
- Métodos de instância herdados
- Métodos protected e public
- Todos os níveis de hierarquia

**Não aplicam-se a**:
- Métodos static (hiding)
- Métodos private (não herdados)
- Métodos final (não sobrescrevíveis)
- Construtores (não são métodos)

---

## Armadilhas

### 1. Modificador Mais Restritivo

```java
public class Base {
    public void metodo() { }
}

public class Derivada extends Base {
    // ❌ ERRO: public → protected
    @Override
    protected void metodo() { }
}
```

### 2. Exceção Mais Genérica

```java
public class Base {
    public void metodo() throws IOException { }
}

public class Derivada extends Base {
    // ❌ ERRO: Exception > IOException
    @Override
    public void metodo() throws Exception { }
}
```

### 3. Tipo de Retorno Incompatível

```java
public class Base {
    public Number metodo() {
        return 10;
    }
}

public class Derivada extends Base {
    // ✅ CORRETO: Integer extends Number (covariante)
    @Override
    public Integer metodo() {
        return 10;
    }
    
    // ❌ ERRO: String não é covariante de Number
    /*
    @Override
    public String metodo() {
        return "10";
    }
    */
}
```

### 4. Assinatura Diferente (Sobrecarga, Não Sobrescrita)

```java
public class Base {
    public void processar(String texto) { }
}

public class Derivada extends Base {
    // ❌ NÃO é sobrescrita (parâmetro diferente)
    public void processar(int numero) { }
    
    // ✅ Sobrescrita
    @Override
    public void processar(String texto) { }
}
```

---

## Boas Práticas

### 1. Sempre Use @Override

```java
@Override
public void metodo() {
    // Compilador valida todas as regras
}
```

### 2. Mantenha ou Aumente Visibilidade

```java
// Superclasse
protected void metodo() { }

// Subclasse: protected ou public
@Override
public void metodo() { } // ✅
```

### 3. Documente Mudanças de Comportamento

```java
/**
 * Sobrescreve calcularSalario() adicionando bônus.
 * @return salário base + bônus
 */
@Override
public double calcularSalario() {
    return super.calcularSalario() + bonus;
}
```

### 4. Respeite Princípio de Liskov

```java
// Superclasse: retorna positivo ou zero
public int calcular() {
    return Math.abs(valor);
}

// Subclasse: deve manter contrato
@Override
public int calcular() {
    return Math.abs(valor * 2); // Ainda retorna >= 0 ✅
}
```

### 5. Use Retorno Covariante Para Type Safety

```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    // Retorno covariante evita casting
    @Override
    public Cachorro criar() {
        return new Cachorro();
    }
}

// Uso
Cachorro c = new Cachorro().criar(); // Sem casting ✅
```

---

## Resumo

**Regras para Sobrescrita**:

**1. Assinatura idêntica**:
```java
public void metodo(String s, int i) { } // Superclasse
@Override
public void metodo(String s, int i) { } // Subclasse ✅
```

**2. Modificador de acesso: igual ou mais permissivo**:
```java
protected → protected ✅
protected → public    ✅
public    → protected ❌
```

**3. Tipo de retorno: idêntico ou covariante**:
```java
public Animal metodo() { }    // Superclasse
@Override
public Cachorro metodo() { }  // Subclasse ✅ (covariante)
```

**4. Exceções: não podem ser mais genéricas**:
```java
throws IOException           // Superclasse
throws FileNotFoundException ✅ (subclasse)
throws Exception             ❌ (mais genérica)
```

**5. Não podem ser sobrescritos**:
```java
public final void metodo() { }      // final ❌
public static void metodo() { }     // static ❌
private void metodo() { }           // private ❌
```

**6. @Override recomendado**:
```java
@Override  // Detecta erros em compile-time
public void metodo() { }
```

**Tabela de Visibilidade**:
```
private   → não herdado
default   → default, protected, public ✅
protected → protected, public ✅
public    → public ✅
```

**Exceções Unchecked**: sem restrição
**Exceções Checked**: mesma ou subclasse

**Regra de Ouro**: **@Override + assinatura idêntica + acesso >= superclasse + retorno covariante + exceções <= superclasse**.
