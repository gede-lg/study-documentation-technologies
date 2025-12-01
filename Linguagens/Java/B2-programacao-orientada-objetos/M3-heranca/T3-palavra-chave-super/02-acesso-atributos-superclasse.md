# T3.02 - Acesso a Atributos da Superclasse

## Introdução

**`super.atributo`** acessa **atributo da superclasse**, útil quando há **shadowing** (atributo com mesmo nome na subclasse).

**Sintaxe**: `super.nomeDoAtributo`

```java
public class Base {
    protected int valor = 10;
}

public class Derivada extends Base {
    protected int valor = 20; // Shadowing
    
    public void exibir() {
        System.out.println(valor);       // 20 (this.valor)
        System.out.println(this.valor);  // 20 (Derivada)
        System.out.println(super.valor); // 10 (Base)
    }
}
```

**`super`** desambigua quando **subclasse e superclasse** têm atributo com **mesmo nome**.

---

## Fundamentos

### 1. Acesso Direto vs super

**Sem shadowing**: Acesso direto funciona.
**Com shadowing**: Use `super` para acessar versão da superclasse.

```java
// Sem shadowing
public class Animal {
    protected String especie;
}

public class Cachorro extends Animal {
    public void exibir() {
        System.out.println(especie);       // ✅ Acesso direto
        System.out.println(super.especie); // ✅ super também funciona
    }
}

// Com shadowing
public class Animal {
    protected String nome = "Animal";
}

public class Cachorro extends Animal {
    protected String nome = "Cachorro"; // Shadowing
    
    public void exibir() {
        System.out.println(nome);       // Cachorro (this.nome)
        System.out.println(super.nome); // Animal (necessário)
    }
}
```

### 2. Shadowing de Atributos

**Shadowing**: Subclasse declara atributo com **mesmo nome** da superclasse.

```java
public class Pessoa {
    protected String nome = "Pessoa";
    protected int idade = 0;
}

public class Funcionario extends Pessoa {
    protected String nome = "Funcionario"; // Shadowing
    // idade NÃO tem shadowing
    
    public void mostrar() {
        System.out.println(nome);        // Funcionario
        System.out.println(super.nome);  // Pessoa
        
        System.out.println(idade);       // 0 (acesso direto)
        System.out.println(super.idade); // 0 (mesmo valor)
    }
}
```

**Evite shadowing**: Confuso e propenso a erros.

### 3. Acesso a Atributos protected

**`protected` permite acesso** em subclasses.

```java
public class Veiculo {
    protected String marca;
    protected int ano;
}

public class Carro extends Veiculo {
    public void exibir() {
        System.out.println(super.marca); // ✅ protected acessível
        System.out.println(super.ano);   // ✅ protected acessível
    }
}
```

### 4. Acesso a Atributos public

**`public` sempre acessível**.

```java
public class Animal {
    public String especie;
}

public class Cachorro extends Animal {
    public void exibir() {
        System.out.println(super.especie); // ✅ public acessível
    }
}
```

### 5. Atributos private Não Acessíveis com super

**`private` NÃO é acessível**, mesmo com `super`.

```java
public class Base {
    private int secreto = 42;
}

public class Derivada extends Base {
    public void tentar() {
        // System.out.println(super.secreto); // ❌ ERRO (private)
    }
}
```

**Solução**: Use getter/setter.

```java
public class Base {
    private int secreto = 42;
    
    protected int getSecreto() {
        return secreto;
    }
}

public class Derivada extends Base {
    public void exibir() {
        System.out.println(super.getSecreto()); // ✅
    }
}
```

### 6. Modificação de Atributos da Superclasse

**`super` pode modificar** atributos da superclasse.

```java
public class Conta {
    protected double saldo;
}

public class ContaCorrente extends Conta {
    public void depositar(double valor) {
        super.saldo += valor; // Modifica atributo da superclasse
    }
}
```

### 7. Atributos static com super

**Atributos `static` pertencem à classe**, não à instância.

```java
public class Base {
    protected static int contador = 0;
}

public class Derivada extends Base {
    public void incrementar() {
        super.contador++; // ✅ Funciona, mas não recomendado
        Base.contador++;  // ✅ Recomendado (mais claro)
    }
}
```

**Prefira acesso via nome da classe** para `static`.

### 8. Atributos final com super

**Atributos `final` não podem ser modificados**.

```java
public class Base {
    protected final int MAXIMO = 100;
}

public class Derivada extends Base {
    public void teste() {
        System.out.println(super.MAXIMO); // ✅ Acessa
        // super.MAXIMO = 200; // ❌ ERRO (final)
    }
}
```

### 9. super em Hierarquias Profundas

**`super` acessa apenas superclasse imediata**.

```java
// Nível 1
public class A {
    protected int valor = 1;
}

// Nível 2
public class B extends A {
    protected int valor = 2; // Shadowing
}

// Nível 3
public class C extends B {
    protected int valor = 3; // Shadowing
    
    public void mostrar() {
        System.out.println(valor);       // 3 (C)
        System.out.println(super.valor); // 2 (B, não A)
        
        // Não há super.super.valor
    }
}
```

### 10. this vs super Para Atributos

**`this`**: Atributo da **classe atual**.
**`super`**: Atributo da **superclasse**.

```java
public class Base {
    protected int valor = 10;
}

public class Derivada extends Base {
    protected int valor = 20; // Shadowing
    
    public void comparar() {
        System.out.println(this.valor);  // 20 (Derivada)
        System.out.println(super.valor); // 10 (Base)
        
        // Sem prefixo, assume this
        System.out.println(valor);       // 20 (this.valor)
    }
}
```

---

## Aplicabilidade

**Use `super.atributo` quando**:
- **Shadowing** existe (mesmo nome em super e subclasse)
- **Desambiguar** acesso ao atributo da superclasse
- **Acessar versão original** do atributo

**Não use quando**:
- **Não há shadowing** (acesso direto funciona)
- **Atributo é `private`** (use getter/setter)

---

## Armadilhas

### 1. Acessar Atributos private

```java
public class Base {
    private int secreto;
}

public class Derivada extends Base {
    public void teste() {
        // super.secreto; // ❌ ERRO (private)
    }
}

// Solução: getter/setter
protected int getSecreto() { return secreto; }
```

### 2. Shadowing Confuso

```java
public class Base {
    protected int valor = 10;
}

public class Derivada extends Base {
    protected int valor = 20; // ❌ Confuso
    
    public void processar() {
        // Qual valor usar?
        System.out.println(valor);       // 20
        System.out.println(super.valor); // 10
    }
}

// ✅ Melhor: use nomes diferentes
protected int valorDer ivada = 20;
```

### 3. Tentar super.super

```java
public class C extends B {
    public void teste() {
        // super.super.valor; // ❌ ERRO (não existe)
    }
}
```

---

## Boas Práticas

### 1. Evite Shadowing

```java
// ❌ Shadowing
public class Derivada extends Base {
    protected int valor; // Mesmo nome que Base
}

// ✅ Nomes diferentes
public class Derivada extends Base {
    protected int valorDerivada;
}
```

### 2. Use super Quando Necessário

```java
// Com shadowing
public void exibir() {
    System.out.println(super.nome); // Necessário
}
```

### 3. Prefira Métodos a Atributos protected

```java
// ❌ Atributo exposto
protected List<String> itens;

// ✅ Métodos controlados
private List<String> itens;

protected void adicionarItem(String item) {
    itens.add(item);
}

protected List<String> getItens() {
    return new ArrayList<>(itens);
}
```

### 4. Use Acesso Direto Quando Não Há Shadowing

```java
// Sem shadowing
public class Cachorro extends Animal {
    public void exibir() {
        System.out.println(especie); // ✅ Acesso direto (mais claro)
    }
}
```

### 5. Documente Shadowing

```java
/**
 * Nome da funcionário.
 * Shadow de Pessoa.nome.
 */
protected String nome;
```

---

## Resumo

**Acesso a atributos da superclasse**:

**Sintaxe**:
```java
super.atributo; // Acessa atributo da superclasse
```

**Exemplo**:
```java
public class Base {
    protected int valor = 10;
}

public class Derivada extends Base {
    protected int valor = 20; // Shadowing
    
    public void exibir() {
        System.out.println(valor);       // 20 (this.valor)
        System.out.println(this.valor);  // 20 (Derivada)
        System.out.println(super.valor); // 10 (Base)
    }
}
```

**Quando usar**:
- **Shadowing**: Atributo com mesmo nome
- **Desambiguação**: Clarear qual versão

**Visibilidade**:
```java
public    → ✅ Acessível com super
protected → ✅ Acessível com super
default   → ✅ Acessível com super (mesmo pacote)
private   → ❌ NÃO acessível (use getter/setter)
```

**this vs super**:
```java
this.valor  → Atributo da classe atual
super.valor → Atributo da superclasse
```

**Modificação**:
```java
super.atributo = valor; // ✅ Modifica atributo da superclasse
```

**Limitações**:
- ❌ Não acessa atributos **`private`**
- ❌ Não existe **`super.super`**
- ✅ Acessa apenas **superclasse imediata**

**Evite shadowing**:
```java
// ❌ Confuso
protected int valor; // Mesmo nome que superclasse

// ✅ Claro
protected int valorEspecifico; // Nome diferente
```

**Regra de Ouro**: Use **`super.atributo`** apenas quando há **shadowing** ou quando precisar **desambiguar** acesso. **Evite shadowing** sempre que possível usando **nomes diferentes**.
