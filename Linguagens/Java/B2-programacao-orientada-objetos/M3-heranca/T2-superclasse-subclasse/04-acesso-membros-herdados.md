# T2.04 - Acesso a Membros Herdados

## Introdução

**Acesso a membros herdados** depende do **modificador de acesso** usado na superclasse.

**Regras de visibilidade**:
- **`public`**: Acessível em **qualquer lugar**
- **`protected`**: Acessível em **subclasses** e **mesmo pacote**
- **package-private** (sem modificador): Acessível no **mesmo pacote**
- **`private`**: **NÃO acessível** diretamente (use getters/setters)

```java
public class Animal {
    public String especie;       // ✅ Acessível em qualquer lugar
    protected String nome;       // ✅ Acessível em subclasses
    String habitat;              // ✅ Acessível no mesmo pacote
    private int energia;         // ❌ NÃO acessível diretamente
}

public class Cachorro extends Animal {
    public void teste() {
        especie = "Canis";       // ✅
        nome = "Rex";            // ✅
        habitat = "Casa";        // ✅ (se mesmo pacote)
        // energia = 100;        // ❌
    }
}
```

---

## Fundamentos

### 1. Membros public

**Acessíveis em qualquer lugar**.

```java
public class Pessoa {
    public String nome; // Acessível em qualquer lugar
}

public class Funcionario extends Pessoa {
    public void exibir() {
        System.out.println(nome); // ✅ Acessa
    }
}

// De fora da hierarquia
Funcionario f = new Funcionario();
f.nome = "João"; // ✅ Acessa
```

### 2. Membros protected

**Acessíveis em subclasses e mesmo pacote**.

```java
// Pacote: com.exemplo
public class Animal {
    protected String nome; // Acessível em subclasses
}

// Pacote: com.exemplo.mamiferos
public class Cachorro extends Animal {
    public void exibir() {
        System.out.println(nome); // ✅ Acessa (subclasse)
    }
}

// Pacote: com.exemplo
public class OutraClasse {
    public void teste() {
        Animal a = new Animal();
        a.nome = "Rex"; // ✅ Acessa (mesmo pacote)
    }
}

// Pacote: com.outro
public class ClasseExterna {
    public void teste() {
        Animal a = new Animal();
        // a.nome = "Rex"; // ❌ NÃO acessa (outro pacote, não é subclasse)
    }
}
```

### 3. Membros Package-Private (Default)

**Acessíveis apenas no mesmo pacote**.

```java
// Pacote: com.exemplo
public class Animal {
    String habitat; // package-private
}

// Pacote: com.exemplo
public class Cachorro extends Animal {
    public void exibir() {
        System.out.println(habitat); // ✅ Acessa (mesmo pacote)
    }
}

// Pacote: com.outro
public class OutroPacote extends Animal {
    public void exibir() {
        // System.out.println(habitat); // ❌ NÃO acessa (outro pacote)
    }
}
```

### 4. Membros private

**NÃO acessíveis diretamente** (use getters/setters).

```java
public class Conta {
    private double saldo; // NÃO acessível diretamente
    
    public double getSaldo() {
        return saldo;
    }
    
    public void setSaldo(double saldo) {
        this.saldo = saldo;
    }
}

public class ContaCorrente extends Conta {
    public void depositar(double valor) {
        // saldo += valor; // ❌ NÃO acessa
        
        // ✅ Usa getter/setter
        setSaldo(getSaldo() + valor);
    }
}
```

### 5. Acesso com super

**`super` acessa membros da superclasse**.

```java
public class Animal {
    protected String nome = "Animal";
    
    public void exibir() {
        System.out.println("Animal: " + nome);
    }
}

public class Cachorro extends Animal {
    protected String nome = "Cachorro"; // Shadowing
    
    public void mostrar() {
        System.out.println(nome);        // Cachorro
        System.out.println(super.nome);  // Animal
        
        exibir();        // Chama versão de Animal
        super.exibir();  // Chama versão de Animal (redundante)
    }
}
```

### 6. Acesso a Métodos Herdados

**Métodos são acessados normalmente**.

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
    public void testar() {
        respirar();  // ✅ public
        comer();     // ✅ protected
        // digerir(); // ❌ private
    }
}

// De fora
Cachorro c = new Cachorro();
c.respirar(); // ✅ public
// c.comer();  // ❌ protected (não acessível de fora do pacote)
```

### 7. Acesso em Diferentes Pacotes

**Visibilidade varia entre pacotes**.

```java
// Pacote: com.animais
public class Animal {
    public String a;       // ✅ Acessível em qualquer pacote
    protected String b;    // ✅ Acessível em subclasses (qualquer pacote)
    String c;              // ❌ NÃO acessível em outro pacote
    private String d;      // ❌ NÃO acessível
}

// Pacote: com.mamiferos
public class Cachorro extends Animal {
    public void teste() {
        a = "A";  // ✅ public
        b = "B";  // ✅ protected (subclasse)
        // c = "C"; // ❌ package-private (outro pacote)
        // d = "D"; // ❌ private
    }
}
```

### 8. Acesso a Atributos Sobrescritos (Shadowing)

**Atributo da subclasse oculta o da superclasse**.

```java
public class Base {
    protected int valor = 10;
}

public class Derivada extends Base {
    protected int valor = 20; // Shadowing
    
    public void mostrar() {
        System.out.println(valor);        // 20 (Derivada)
        System.out.println(super.valor);  // 10 (Base)
    }
}
```

**Evite shadowing**: Confuso e propenso a erros.

### 9. Acesso a Métodos Sobrescritos

**Método sobrescrito substitui o herdado**.

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
    
    public void testar() {
        emitirSom();       // Au au! (versão de Cachorro)
        super.emitirSom(); // Som genérico (versão de Animal)
    }
}
```

### 10. Acesso a Constantes (final static)

**Constantes são acessíveis** conforme modificador.

```java
public class Configuracao {
    public static final int MAX_PUBLICO = 100;      // ✅ Acessível em qualquer lugar
    protected static final int MAX_PROTEGIDO = 200; // ✅ Acessível em subclasses
    static final int MAX_PACOTE = 300;              // ✅ Acessível no mesmo pacote
    private static final int MAX_PRIVADO = 400;     // ❌ NÃO acessível
}

public class SubConfiguracao extends Configuracao {
    public void teste() {
        System.out.println(MAX_PUBLICO);    // ✅
        System.out.println(MAX_PROTEGIDO);  // ✅
        System.out.println(MAX_PACOTE);     // ✅ (se mesmo pacote)
        // System.out.println(MAX_PRIVADO); // ❌
    }
}
```

---

## Aplicabilidade

**Use modificadores apropriados**:
- **`public`**: API pública, acessível em qualquer lugar
- **`protected`**: Membros para subclasses
- **package-private**: Membros internos do pacote
- **`private`**: Detalhes de implementação

**Regra**: Use o **modificador mais restritivo** possível.

---

## Armadilhas

### 1. Acessar private de Fora

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

### 2. Confundir protected com package-private

```java
// Pacote: com.exemplo
public class Base {
    protected String a; // Acessível em subclasses (qualquer pacote)
    String b;           // Acessível apenas no mesmo pacote
}

// Pacote: com.outro
public class Derivada extends Base {
    public void teste() {
        a = "A"; // ✅ protected (subclasse)
        // b = "B"; // ❌ package-private (outro pacote)
    }
}
```

### 3. Shadowing de Atributos

```java
public class Base {
    protected int valor = 10;
}

public class Derivada extends Base {
    protected int valor = 20; // ❌ Confuso
    
    public void mostrar() {
        System.out.println(valor);       // 20 ou 10?
        System.out.println(super.valor); // 10 (clareza)
    }
}
```

---

## Boas Práticas

### 1. Use protected Para Membros de Subclasses

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
protected int valor; // Mesmo nome que superclasse

// ✅ Nome diferente
protected int valorEspecifico;
```

### 4. Use Modificador Mais Restritivo

```java
// ✅ Private por padrão
private String interno;

// ✅ Protected se subclasses precisam
protected String compartilhado;

// ✅ Public apenas para API pública
public String publico;
```

### 5. Documente Visibilidade

```java
/**
 * @param nome Nome do animal (protected, acessível em subclasses)
 */
protected String nome;
```

---

## Resumo

**Acesso a membros herdados**:

**Tabela de visibilidade**:
```
Modificador       | Subclasse | Mesmo Pacote | Outro Pacote
------------------|-----------|--------------|-------------
public            |    ✅     |      ✅      |      ✅
protected         |    ✅     |      ✅      |      ❌
package-private   |    ✅*    |      ✅      |      ❌
private           |    ❌     |      ❌      |      ❌

* Apenas se subclasse estiver no mesmo pacote
```

**Exemplo**:
```java
public class Animal {
    public String a;       // ✅ Acesso total
    protected String b;    // ✅ Subclasses + mesmo pacote
    String c;              // ✅ Mesmo pacote
    private String d;      // ❌ Apenas na classe
}

public class Cachorro extends Animal {
    public void teste() {
        a = "A";  // ✅
        b = "B";  // ✅
        c = "C";  // ✅ (se mesmo pacote)
        // d = "D"; // ❌
    }
}
```

**Acesso com super**:
```java
super.atributo;  // Atributo da superclasse
super.metodo();  // Método da superclasse
```

**Membros private**:
```java
// ❌ Acesso direto
// energia = 100;

// ✅ Usar getter/setter
setEnergia(100);
```

**Regra de Ouro**: Use **`protected`** para membros que **subclasses devem acessar**. Use **`private`** para **detalhes de implementação** e forneça **getters/setters** quando necessário. Evite **shadowing** de atributos.
