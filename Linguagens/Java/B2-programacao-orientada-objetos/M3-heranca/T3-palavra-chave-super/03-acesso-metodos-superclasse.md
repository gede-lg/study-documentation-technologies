# T3.03 - Acesso a Métodos da Superclasse

## Introdução

**`super.metodo()`** chama **método da superclasse**, útil quando método foi **sobrescrito** na subclasse.

**Sintaxe**: `super.nomeDoMetodo(parametros)`

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        super.emitirSom(); // Chama versão de Animal
        System.out.println("Au au!");
    }
}

// Uso
Cachorro c = new Cachorro();
c.emitirSom();
// Saída:
// Som genérico
// Au au!
```

**`super`** permite **reutilizar lógica** da superclasse em método sobrescrito.

---

## Fundamentos

### 1. Chamada de Método Sobrescrito

**Método sobrescrito substitui versão da superclasse**, `super` acessa a original.

```java
public class Base {
    public void processar() {
        System.out.println("Processando na Base");
    }
}

public class Derivada extends Base {
    @Override
    public void processar() {
        System.out.println("Antes");
        super.processar(); // Chama versão de Base
        System.out.println("Depois");
    }
}

// Uso
Derivada d = new Derivada();
d.processar();
// Saída:
// Antes
// Processando na Base
// Depois
```

### 2. Reutilização de Lógica

**Comum em métodos sobrescritos**: Chama `super` para reutilizar e estender.

```java
public class ContaBancaria {
    protected double saldo;
    
    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
            System.out.println("Depósito: " + valor);
        }
    }
}

public class ContaPremium extends ContaBancaria {
    @Override
    public void depositar(double valor) {
        super.depositar(valor); // Reutiliza lógica base
        
        // Adiciona bônus
        double bonus = valor * 0.01;
        saldo += bonus;
        System.out.println("Bônus: " + bonus);
    }
}
```

### 3. Acesso a Métodos Não Sobrescritos

**Sem sobrescrita**: `super` é **opcional** (acesso direto funciona).

```java
public class Animal {
    public void respirar() {
        System.out.println("Respirando");
    }
}

public class Cachorro extends Animal {
    public void testar() {
        respirar();       // ✅ Acesso direto
        super.respirar(); // ✅ super também funciona (redundante)
    }
}
```

### 4. super em Métodos com Parâmetros

**`super.metodo()` aceita parâmetros**.

```java
public class Forma {
    public void desenhar(String cor, int tamanho) {
        System.out.println("Desenhando: " + cor + ", tamanho " + tamanho);
    }
}

public class Circulo extends Forma {
    @Override
    public void desenhar(String cor, int tamanho) {
        super.desenhar(cor, tamanho); // Passa parâmetros
        System.out.println("Círculo específico");
    }
}
```

### 5. super em Métodos com Retorno

**`super.metodo()` pode retornar valor**.

```java
public class Base {
    public int calcular(int a, int b) {
        return a + b;
    }
}

public class Derivada extends Base {
    @Override
    public int calcular(int a, int b) {
        int resultado = super.calcular(a, b); // Chama e armazena
        return resultado * 2; // Modifica resultado
    }
}

// Uso
Derivada d = new Derivada();
System.out.println(d.calcular(5, 3)); // 16 ((5+3)*2)
```

### 6. super Apenas para Superclasse Imediata

**`super` acessa apenas superclasse direta**.

```java
// Nível 1
public class A {
    public void metodo() {
        System.out.println("A");
    }
}

// Nível 2
public class B extends A {
    @Override
    public void metodo() {
        System.out.println("B");
    }
}

// Nível 3
public class C extends B {
    @Override
    public void metodo() {
        super.metodo(); // Chama B.metodo(), NÃO A.metodo()
        System.out.println("C");
    }
}

// Uso
C c = new C();
c.metodo();
// Saída:
// B
// C
```

**Não há `super.super.metodo()`**.

### 7. super em Métodos protected

**Métodos `protected` acessíveis** com `super`.

```java
public class Animal {
    protected void comer() {
        System.out.println("Comendo");
    }
}

public class Cachorro extends Animal {
    public void alimentar() {
        super.comer(); // ✅ protected acessível
    }
}
```

### 8. super em Métodos private

**Métodos `private` NÃO acessíveis**, mesmo com `super`.

```java
public class Base {
    private void interno() {
        System.out.println("Interno");
    }
}

public class Derivada extends Base {
    public void testar() {
        // super.interno(); // ❌ ERRO (private)
    }
}
```

### 9. super em Métodos static

**Métodos `static` podem ser acessados**, mas use nome da classe.

```java
public class Base {
    public static void metodoEstatico() {
        System.out.println("Estático");
    }
}

public class Derivada extends Base {
    public void testar() {
        super.metodoEstatico(); // ✅ Funciona, mas não recomendado
        Base.metodoEstatico();  // ✅ Recomendado (mais claro)
    }
}
```

**Métodos `static` não são sobrescritos**, são **ocultos**.

### 10. this vs super Para Métodos

**`this`**: Método da **classe atual**.
**`super`**: Método da **superclasse**.

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au");
    }
    
    public void testar() {
        this.emitirSom();  // Au au (versão de Cachorro)
        super.emitirSom(); // Som (versão de Animal)
        
        emitirSom();       // Au au (this.emitirSom())
    }
}
```

---

## Aplicabilidade

**Use `super.metodo()` quando**:
- **Reutilizar lógica** da superclasse em método sobrescrito
- **Estender comportamento** (chamar super + adicionar código)
- **Acessar versão original** de método sobrescrito

**Não use quando**:
- **Método não foi sobrescrito** (acesso direto funciona)
- **Método é `private`** (não acessível)

---

## Armadilhas

### 1. Esquecer super em Métodos Sobrescritos

```java
@Override
public void processar() {
    // super.processar(); // ❌ Esqueceu de chamar
    System.out.println("Processando");
}

// Lógica da superclasse é perdida
```

**Solução**: Chame `super` quando precisar reutilizar lógica.

### 2. Tentar super.super

```java
public class C extends B {
    @Override
    public void metodo() {
        // super.super.metodo(); // ❌ ERRO
        super.metodo(); // ✅ Chama B.metodo()
    }
}
```

### 3. Acessar Métodos private

```java
public class Base {
    private void interno() {}
}

public class Derivada extends Base {
    public void teste() {
        // super.interno(); // ❌ ERRO
    }
}
```

---

## Boas Práticas

### 1. Chame super Para Reutilizar Lógica

```java
@Override
public void metodo() {
    super.metodo(); // Reutiliza lógica base
    // Código adicional
}
```

### 2. Documente Quando Sobrescrever Sem super

```java
/**
 * Sobrescreve completamente sem chamar super
 * (implementação totalmente diferente).
 */
@Override
public void metodo() {
    // Nova implementação
}
```

### 3. Use @Override

```java
@Override
public void metodo() {
    super.metodo();
}
```

### 4. Evite super Desnecessário

```java
// ❌ Redundante (método não sobrescrito)
public void metodo() {
    super.outroMetodo();
}

// ✅ Acesso direto
public void metodo() {
    outroMetodo();
}
```

### 5. Organize Chamadas de super

```java
@Override
public void processar() {
    // 1. Chamar super primeiro (geralmente)
    super.processar();
    
    // 2. Código adicional
    System.out.println("Processamento adicional");
}
```

---

## Resumo

**Acesso a métodos da superclasse**:

**Sintaxe**:
```java
super.metodo(parametros); // Chama método da superclasse
```

**Exemplo**:
```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        super.emitirSom(); // Chama Animal.emitirSom()
        System.out.println("Au au!");
    }
}
```

**Reutilização de lógica**:
```java
@Override
public void depositar(double valor) {
    super.depositar(valor); // Reutiliza lógica base
    saldo += valor * 0.01;  // Adiciona bônus
}
```

**Com retorno**:
```java
@Override
public int calcular(int a, int b) {
    int resultado = super.calcular(a, b);
    return resultado * 2;
}
```

**this vs super**:
```java
this.metodo()  → Versão da classe atual (sobrescrita)
super.metodo() → Versão da superclasse (original)
```

**Visibilidade**:
```java
public    → ✅ Acessível com super
protected → ✅ Acessível com super
default   → ✅ Acessível com super (mesmo pacote)
private   → ❌ NÃO acessível
```

**Limitações**:
- ❌ Não acessa métodos **`private`**
- ❌ Não existe **`super.super`**
- ✅ Acessa apenas **superclasse imediata**

**Padrão comum**:
```java
@Override
public void metodo() {
    super.metodo();     // 1. Chama versão base
    // Código adicional  // 2. Adiciona comportamento
}
```

**Regra de Ouro**: Use **`super.metodo()`** para **reutilizar lógica** da superclasse em métodos sobrescritos, permitindo **extensão sem duplicação** de código.
