# T2.03 - Herança de Atributos e Métodos

## Introdução

**Herança de membros**: Subclasse **herda atributos e métodos** da superclasse, podendo **reutilizá-los** sem duplicar código.

**Regras**:
- **Todos os membros** são herdados (incluindo `private`)
- Membros **`private` são herdados mas NÃO acessíveis** diretamente
- Membros **`public`, `protected` e package-private** são acessíveis

```java
public class Animal {
    protected String nome;        // ✅ Herdado e acessível
    private int energia;          // ✅ Herdado, NÃO acessível
    
    public void dormir() {}       // ✅ Herdado e acessível
    private void digerir() {}     // ✅ Herdado, NÃO acessível
}

public class Cachorro extends Animal {
    // Herda: nome, energia, dormir(), digerir()
    // Acessa: nome, dormir()
}
```

---

## Fundamentos

### 1. Herança de Atributos

**Subclasse herda todos os atributos** da superclasse.

```java
public class Pessoa {
    public String nome;
    protected int idade;
    String cpf;              // package-private
    private String senha;
}

public class Funcionario extends Pessoa {
    private double salario;
    
    public void exibir() {
        System.out.println(nome);   // ✅ Acessa (public)
        System.out.println(idade);  // ✅ Acessa (protected)
        System.out.println(cpf);    // ✅ Acessa (mesmo pacote)
        // System.out.println(senha); // ❌ NÃO acessa (private)
    }
}
```

**Funcionario** tem: `nome`, `idade`, `cpf`, `senha` (herdados) + `salario` (próprio).

### 2. Herança de Métodos

**Subclasse herda todos os métodos** da superclasse.

```java
public class Animal {
    public void respirar() {
        System.out.println("Respirando");
    }
    
    protected void comer() {
        System.out.println("Comendo");
    }
    
    private void digerir() {
        System.out.println("Digerindo");
    }
}

public class Cachorro extends Animal {
    public void teste() {
        respirar();  // ✅ Acessa (public)
        comer();     // ✅ Acessa (protected)
        // digerir(); // ❌ NÃO acessa (private)
    }
}

// Uso
Cachorro c = new Cachorro();
c.respirar(); // ✅ Método herdado
```

### 3. Visibilidade de Membros Herdados

**Modificadores de acesso** determinam acessibilidade.

```java
public class Base {
    public int a;        // ✅ Herdado, acessível em qualquer lugar
    protected int b;     // ✅ Herdado, acessível em subclasses
    int c;               // ✅ Herdado, acessível no mesmo pacote
    private int d;       // ✅ Herdado, NÃO acessível diretamente
}

public class Derivada extends Base {
    public void teste() {
        a = 1;  // ✅ public
        b = 2;  // ✅ protected
        c = 3;  // ✅ package-private (mesmo pacote)
        // d = 4; // ❌ private
    }
}
```

### 4. Atributos private: Herdados mas Não Acessíveis

**`private` é herdado**, mas só **acessível via getters/setters**.

```java
public class Conta {
    private double saldo; // Herdado mas não acessível
    
    public double getSaldo() {
        return saldo;
    }
    
    public void setSaldo(double saldo) {
        this.saldo = saldo;
    }
}

public class ContaCorrente extends Conta {
    public void depositar(double valor) {
        // saldo += valor; // ❌ NÃO acessa diretamente
        
        // ✅ Usa getter/setter
        setSaldo(getSaldo() + valor);
    }
}
```

### 5. Métodos Herdados e Sobrescritos

**Subclasse pode sobrescrever** métodos herdados.

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    // Sobrescreve
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

// Uso
Animal a = new Cachorro();
a.emitirSom(); // Au au! (versão sobrescrita)
```

### 6. Herança Acumulativa

**Subclasse herda de TODOS os ancestrais**.

```java
// Nível 1
public class Animal {
    protected String especie;
    
    public void respirar() {}
}

// Nível 2
public class Mamifero extends Animal {
    protected boolean pelagem;
    
    public void amamentar() {}
}

// Nível 3
public class Cachorro extends Mamifero {
    private String raca;
    
    // Herda: especie (Animal), pelagem (Mamifero), raca (próprio)
    // Herda: respirar() (Animal), amamentar() (Mamifero)
}
```

**Cachorro** herda de **Mamifero** e **Animal**.

### 7. Atributos com Mesmo Nome (Shadowing)

**Subclasse pode declarar atributo com mesmo nome** (não recomendado).

```java
public class Base {
    protected String nome = "Base";
}

public class Derivada extends Base {
    protected String nome = "Derivada"; // Shadowing
    
    public void exibir() {
        System.out.println(nome);        // Derivada
        System.out.println(super.nome);  // Base
    }
}
```

**Evite shadowing**: Confuso e propenso a erros.

### 8. Métodos Estáticos Herdados

**Métodos `static` são herdados**, mas **não sobrescritos** (são **ocultos**).

```java
public class Base {
    public static void metodo() {
        System.out.println("Base");
    }
}

public class Derivada extends Base {
    // Oculta (não sobrescreve)
    public static void metodo() {
        System.out.println("Derivada");
    }
}

// Uso
Base.metodo();     // Base
Derivada.metodo(); // Derivada

Base b = new Derivada();
b.metodo();        // Base (tipo da referência, não do objeto)
```

### 9. Construtores NÃO São Herdados

**Construtores não são herdados**, mas podem ser chamados.

```java
public class Pessoa {
    protected String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

public class Funcionario extends Pessoa {
    // ❌ Não herda construtor de Pessoa
    // Deve criar próprio construtor
    public Funcionario(String nome, double salario) {
        super(nome); // Chama construtor de Pessoa
    }
}
```

### 10. Membros final Herdados

**Atributos `final` herdados** não podem ser modificados (são constantes).

```java
public class Base {
    protected final int MAXIMO = 100;
}

public class Derivada extends Base {
    public void teste() {
        System.out.println(MAXIMO); // ✅ Acessa
        // MAXIMO = 200; // ❌ ERRO (final)
    }
}
```

**Métodos `final` herdados** não podem ser sobrescritos.

```java
public class Base {
    public final void metodo() {}
}

public class Derivada extends Base {
    // ❌ ERRO: não pode sobrescrever final
    // @Override
    // public void metodo() {}
}
```

---

## Aplicabilidade

**Use herança de membros quando**:
- **Reutilizar código** comum
- **Compartilhar estado** (atributos) entre classes
- **Especializar comportamento** (sobrescrever métodos)

**Cuidados**:
- **Membros `private`**: Use getters/setters para acesso
- **Evite shadowing**: Não declare atributos com mesmo nome
- **Documente visibilidade**: Deixe claro o que é herdável

---

## Armadilhas

### 1. Acessar Membros private

```java
public class Animal {
    private int energia;
}

public class Cachorro extends Animal {
    public void gastar() {
        // energia -= 10; // ❌ ERRO
    }
}

// Solução: protected ou getter/setter
protected int energia;
```

### 2. Shadowing de Atributos

```java
public class Base {
    protected String nome = "Base";
}

public class Derivada extends Base {
    protected String nome = "Derivada"; // ❌ Confuso
}

// Solução: use nomes diferentes
protected String nomeDaClasse = "Derivada";
```

### 3. Confundir Métodos static

```java
public class Base {
    public static void metodo() {}
}

public class Derivada extends Base {
    public static void metodo() {} // Oculta, não sobrescreve
}
```

---

## Boas Práticas

### 1. Use protected Para Membros Compartilhados

```java
public class Animal {
    protected String nome; // Subclasses acessam
}
```

### 2. Forneça Getters/Setters Para private

```java
public class Conta {
    private double saldo;
    
    protected double getSaldo() { return saldo; }
    protected void setSaldo(double s) { saldo = s; }
}
```

### 3. Evite Shadowing

```java
// ❌ Shadowing
public class Derivada extends Base {
    protected String nome; // Mesmo nome que Base
}

// ✅ Nome diferente
public class Derivada extends Base {
    protected String nomeCompleto;
}
```

### 4. Documente Membros Herdáveis

```java
/**
 * @param nome Nome do animal (protected, herdável)
 */
protected String nome;
```

### 5. Use @Override Para Métodos Sobrescritos

```java
@Override
public void metodo() {} // Compilador verifica
```

---

## Resumo

**Herança de atributos e métodos**:

**Regra geral**: **Tudo é herdado**, mas visibilidade varia.

**Visibilidade**:
```java
public    → ✅ Herdado e acessível
protected → ✅ Herdado e acessível
default   → ✅ Herdado e acessível (mesmo pacote)
private   → ✅ Herdado mas NÃO acessível diretamente
```

**Exemplo**:
```java
public class Animal {
    public String especie;     // ✅ Herdado, acessível
    protected String nome;     // ✅ Herdado, acessível
    private int energia;       // ✅ Herdado, NÃO acessível
    
    public void dormir() {}    // ✅ Herdado, acessível
    private void digerir() {}  // ✅ Herdado, NÃO acessível
}

public class Cachorro extends Animal {
    public void teste() {
        especie = "Canis";     // ✅
        nome = "Rex";          // ✅
        // energia = 100;      // ❌ (use getter/setter)
        
        dormir();              // ✅
        // digerir();          // ❌ (use método público)
    }
}
```

**Sobrescrita**:
```java
@Override
public void metodo() {} // Substitui versão herdada
```

**Herança acumulativa**:
```java
Animal → Mamifero → Cachorro
// Cachorro herda de Mamifero E Animal
```

**Regra de Ouro**: Subclasse herda **todos os membros**, mas só **acessa** os que não são `private` diretamente. Use **`protected`** para membros que subclasses devem acessar. Evite **shadowing** de atributos.
