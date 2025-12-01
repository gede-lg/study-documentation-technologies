# T2.05 - Modificador protected

## Introdução

**`protected`** é um **modificador de acesso** que permite acesso a membros em **subclasses** e **classes no mesmo pacote**.

**Visibilidade**:
- ✅ **Acessível em subclasses** (mesmo em pacotes diferentes)
- ✅ **Acessível no mesmo pacote**
- ❌ **NÃO acessível em outros pacotes** (exceto subclasses)

```java
// Pacote: com.animais
public class Animal {
    protected String nome; // Acessível em subclasses + mesmo pacote
}

// Pacote: com.mamiferos
public class Cachorro extends Animal {
    public void exibir() {
        System.out.println(nome); // ✅ Acessa (subclasse)
    }
}

// Pacote: com.animais
public class Cuidador {
    public void nomear(Animal a) {
        a.nome = "Rex"; // ✅ Acessa (mesmo pacote)
    }
}

// Pacote: com.outro
public class Externa {
    public void testar(Animal a) {
        // a.nome = "Rex"; // ❌ NÃO acessa (outro pacote, não é subclasse)
    }
}
```

---

## Fundamentos

### 1. Definição de protected

**Modificador intermediário** entre `private` e `public`.

```java
public class Pessoa {
    public String nome;       // ✅ Acesso total
    protected int idade;      // ✅ Subclasses + mesmo pacote
    String cpf;               // ✅ Apenas mesmo pacote
    private String senha;     // ❌ Apenas na classe
}
```

**`protected`**: Compartilha com **subclasses** e **mesmo pacote**.

### 2. Acesso em Subclasses

**Subclasses acessam membros `protected`**, mesmo em pacotes diferentes.

```java
// Pacote: com.base
public class Veiculo {
    protected String marca;
    protected int ano;
    
    protected void ligar() {
        System.out.println("Veículo ligado");
    }
}

// Pacote: com.derivadas
public class Carro extends Veiculo {
    public void exibir() {
        System.out.println(marca);  // ✅ Acessa
        System.out.println(ano);    // ✅ Acessa
        ligar();                    // ✅ Acessa
    }
}
```

### 3. Acesso no Mesmo Pacote

**Classes no mesmo pacote** acessam membros `protected`.

```java
// Pacote: com.exemplo
public class Animal {
    protected String nome;
}

// Pacote: com.exemplo
public class Veterinario {
    public void examinar(Animal a) {
        System.out.println(a.nome); // ✅ Acessa (mesmo pacote)
    }
}
```

### 4. Acesso Fora do Pacote (Não Subclasse)

**NÃO acessível** em outros pacotes se não for subclasse.

```java
// Pacote: com.animais
public class Animal {
    protected String nome;
}

// Pacote: com.outro
public class Externa {
    public void testar() {
        Animal a = new Animal();
        // a.nome = "Rex"; // ❌ ERRO (outro pacote, não é subclasse)
    }
}
```

### 5. protected em Atributos

**Atributos `protected`** são **herdados e acessíveis** em subclasses.

```java
public class Conta {
    protected double saldo; // Subclasses acessam
    
    protected void depositar(double valor) {
        saldo += valor;
    }
}

public class ContaCorrente extends Conta {
    private double limite;
    
    public void sacar(double valor) {
        if (saldo + limite >= valor) { // ✅ Acessa saldo
            saldo -= valor;
        }
    }
}
```

### 6. protected em Métodos

**Métodos `protected`** são **herdados e acessíveis** em subclasses.

```java
public class Animal {
    protected void comer() {
        System.out.println("Comendo...");
    }
}

public class Cachorro extends Animal {
    public void alimentar() {
        comer(); // ✅ Acessa método protected
    }
}
```

### 7. protected em Construtores

**Construtor `protected`** permite herança, mas **impede instanciação externa**.

```java
public class Animal {
    protected String nome;
    
    // Construtor protected
    protected Animal(String nome) {
        this.nome = nome;
    }
}

// ✅ Subclasse pode chamar
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome); // ✅ Chama construtor protected
    }
}

// ❌ NÃO pode instanciar de fora do pacote
// Animal a = new Animal("Rex"); // ERRO (se em pacote diferente)

// ✅ Pode instanciar subclasse
Cachorro c = new Cachorro("Rex");
```

**Uso**: Classes base que **não devem ser instanciadas diretamente**.

### 8. protected vs package-private

**Diferença**: `protected` é **acessível em subclasses de outros pacotes**.

```java
// Pacote: com.base
public class Base {
    protected String protegido;  // Acessível em subclasses (qualquer pacote)
    String padrao;               // Acessível apenas no mesmo pacote
}

// Pacote: com.derivadas
public class Derivada extends Base {
    public void teste() {
        protegido = "OK";  // ✅ protected (subclasse)
        // padrao = "OK";  // ❌ package-private (outro pacote)
    }
}
```

### 9. Sobrescrita e protected

**Método `protected` pode ser sobrescrito** com visibilidade **igual ou maior**.

```java
public class Animal {
    protected void emitirSom() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    // ✅ protected ou public
    @Override
    protected void emitirSom() { // Ou public
        System.out.println("Au au");
    }
    
    // ❌ ERRO: não pode ser mais restritivo
    // @Override
    // private void emitirSom() {} // ERRO
}
```

### 10. protected e Encapsulamento

**`protected` quebra encapsulamento** (expõe detalhes).

```java
// ❌ Expõe implementação
public class Conta {
    protected List<Transacao> transacoes; // Subclasse pode modificar
}

// ✅ Encapsula
public class Conta {
    private List<Transacao> transacoes;
    
    protected void adicionarTransacao(Transacao t) {
        transacoes.add(t);
    }
    
    protected List<Transacao> getTransacoes() {
        return new ArrayList<>(transacoes); // Cópia defensiva
    }
}
```

**Use com cuidado**: `protected` expõe mais que `private`.

---

## Aplicabilidade

**Use `protected` quando**:
- **Subclasses precisam acessar** atributos/métodos
- **Compartilhar código** com subclasses
- **Permitir extensão** mas não acesso público
- **Construtor não deve ser público** (apenas herança)

**Não use `protected` quando**:
- **Detalhes de implementação** (use `private`)
- **API pública** (use `public`)
- **Apenas mesmo pacote** (use package-private)

---

## Armadilhas

### 1. Expor Detalhes Internos

```java
// ❌ Expõe implementação
public class Animal {
    protected List<String> orgaos; // Subclasse pode modificar
}

// ✅ Encapsula
public class Animal {
    private List<String> orgaos;
    
    protected void adicionarOrgao(String orgao) {
        orgaos.add(orgao);
    }
}
```

### 2. Confundir protected com package-private

```java
// Pacote: com.exemplo
public class Base {
    protected String a; // Subclasses em qualquer pacote
    String b;           // Apenas mesmo pacote
}

// Pacote: com.outro
public class Derivada extends Base {
    public void teste() {
        a = "A"; // ✅ protected
        // b = "B"; // ❌ package-private
    }
}
```

### 3. Usar protected Desnecessariamente

```java
// ❌ protected sem necessidade
public class Conta {
    protected double saldo; // Expõe demais
}

// ✅ private com getter/setter protected
public class Conta {
    private double saldo;
    
    protected double getSaldo() { return saldo; }
    protected void setSaldo(double s) { saldo = s; }
}
```

---

## Boas Práticas

### 1. Use protected Para Extensão

```java
public class Animal {
    protected String nome; // Subclasses acessam
}
```

### 2. Encapsule Coleções protected

```java
private List<String> lista;

protected List<String> getLista() {
    return new ArrayList<>(lista); // Cópia defensiva
}
```

### 3. Prefira Métodos protected a Atributos

```java
// ❌ Atributo exposto
protected double saldo;

// ✅ Métodos controlados
private double saldo;
protected double getSaldo() { return saldo; }
protected void depositar(double v) { saldo += v; }
```

### 4. Documente Membros protected

```java
/**
 * Nome do animal.
 * Protected para permitir acesso em subclasses.
 */
protected String nome;
```

### 5. Use protected em Construtores Para Herança

```java
// Construtor protected: apenas herança
protected Animal(String nome) {
    this.nome = nome;
}
```

---

## Resumo

**Modificador `protected`**:

**Visibilidade**:
```
Local         | Subclasse | Mesmo Pacote | Outro Pacote
--------------|-----------|--------------|-------------
protected     |    ✅     |      ✅      |      ❌
```

**Comparação**:
```java
public    → ✅ Acesso total
protected → ✅ Subclasses + mesmo pacote
default   → ✅ Apenas mesmo pacote
private   → ❌ Apenas na classe
```

**Exemplo**:
```java
// Pacote: com.animais
public class Animal {
    protected String nome; // Subclasses + mesmo pacote
}

// Pacote: com.mamiferos
public class Cachorro extends Animal {
    public void exibir() {
        System.out.println(nome); // ✅ Subclasse
    }
}

// Pacote: com.animais
public class Veterinario {
    public void examinar(Animal a) {
        System.out.println(a.nome); // ✅ Mesmo pacote
    }
}

// Pacote: com.outro
public class Externa {
    public void testar(Animal a) {
        // a.nome = "Rex"; // ❌ Outro pacote
    }
}
```

**Sobrescrita**:
```java
protected void metodo() {} // Pode sobrescrever com protected ou public
```

**Construtor protected**:
```java
protected Animal(String nome) {} // Permite herança, não instanciação externa
```

**Regra de Ouro**: Use **`protected`** para membros que **subclasses devem acessar**, mas **não exponha detalhes de implementação** desnecessariamente. Prefira **métodos `protected`** a **atributos `protected`** para manter encapsulamento.
