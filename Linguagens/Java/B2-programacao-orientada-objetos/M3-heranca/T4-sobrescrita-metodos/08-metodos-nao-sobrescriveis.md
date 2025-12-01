# T4.08 - Métodos Que NÃO Podem Ser Sobrescritos

## Introdução

**Três tipos de métodos NÃO podem ser sobrescritos**:
1. **Métodos final**
2. **Métodos static**
3. **Métodos private**

```java
public class Base {
    // ❌ Não podem ser sobrescritos
    public final void metodoFinal() { }
    public static void metodoEstatico() { }
    private void metodoPrivado() { }
}

public class Derivada extends Base {
    // ❌ ERRO: não pode sobrescrever final
    // @Override
    // public void metodoFinal() { }
    
    // Não é sobrescrita, é "hiding"
    public static void metodoEstatico() { }
    
    // Não é sobrescrita, é NOVO método
    private void metodoPrivado() { }
}
```

---

## Fundamentos

### 1. Métodos final

**final** impede sobrescrita.

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando...");
    }
}

public class Cachorro extends Animal {
    // ❌ ERRO: não pode sobrescrever final
    /*
    @Override
    public void respirar() {
        System.out.println("Cachorro respirando");
    }
    */
}
```

**Por quê?**: Garantir que **comportamento não seja alterado**.

### 2. Por Que Usar final?

**Segurança**: Método **crítico** não pode ser modificado.

```java
public class ContaBancaria {
    private double saldo;
    
    // final: garantir validação sempre executada
    public final void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
        saldo += valor;
    }
}

public class ContaPoupanca extends ContaBancaria {
    // ❌ Não pode sobrescrever (evita burlar validação)
    /*
    @Override
    public void depositar(double valor) {
        saldo += valor; // Sem validação
    }
    */
}
```

### 3. Métodos static

**static** não usa polimorfismo, portanto **não é sobrescrito**.

```java
public class Base {
    public static void metodoEstatico() {
        System.out.println("Base");
    }
}

public class Derivada extends Base {
    // Não é sobrescrita, é "method hiding"
    public static void metodoEstatico() {
        System.out.println("Derivada");
    }
}

// Uso
Base.metodoEstatico();      // "Base"
Derivada.metodoEstatico();  // "Derivada"

Base b = new Derivada();
b.metodoEstatico();         // "Base" ← NÃO usa polimorfismo
```

**Method Hiding**: Método estático **esconde** (não sobrescreve) método da superclasse.

### 4. Por Que static Não É Sobrescrito?

**Métodos static** pertencem à **classe**, não à **instância**.

```java
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void info() {
        System.out.println("Cachorro");
    }
}

// Chamada via classe
Animal.info();    // "Animal"
Cachorro.info();  // "Cachorro"

// Polimorfismo NÃO funciona
Animal a = new Cachorro();
a.info(); // "Animal" ← Tipo da REFERÊNCIA, não do OBJETO
```

### 5. Métodos private

**private** não é herdado, logo **não pode ser sobrescrito**.

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

**Subclasse não tem acesso** a métodos private da superclasse.

### 6. Por Que private Não É Sobrescrito?

**private** não é **visível** para subclasse.

```java
public class Animal {
    private void processarInterno() {
        System.out.println("Processando...");
    }
    
    public void executar() {
        processarInterno(); // ✅ Acessa private da própria classe
    }
}

public class Cachorro extends Animal {
    // Não é sobrescrita (não tem acesso)
    private void processarInterno() {
        System.out.println("Cachorro processando");
    }
    
    public void testar() {
        // processarInterno(); // ❌ Qual? Base ou Cachorro?
        // Chama Cachorro.processarInterno()
    }
}

// Uso
Cachorro c = new Cachorro();
c.executar(); // Chama Animal.processarInterno() ← Base
```

### 7. final em Classes

**Classe final** não pode ser estendida (todos os métodos são implicitamente final).

```java
public final class String {
    // Todos os métodos são final implicitamente
}

// ❌ ERRO: não pode estender classe final
/*
public class MinhaString extends String {
}
*/
```

**Exemplos**: `String`, `Integer`, `Double`, `Math`.

### 8. final em Métodos static

**Método static pode ser final**.

```java
public class Util {
    public static final void metodo() {
        System.out.println("Método estático final");
    }
}

public class Derivada extends Util {
    // ❌ ERRO: não pode esconder método static final
    /*
    public static void metodo() {
        System.out.println("Tentando esconder");
    }
    */
}
```

### 9. @Override com static Gera Erro

```java
public class Base {
    public static void metodo() { }
}

public class Derivada extends Base {
    // ❌ ERRO: @Override não funciona com static
    /*
    @Override
    public static void metodo() { }
    */
    
    // ✅ Sem @Override (method hiding)
    public static void metodo() { }
}
```

### 10. Construtores NÃO São Sobrescritos

**Construtores não são métodos** e **não são herdados**.

```java
public class Animal {
    public Animal(String nome) {
        System.out.println("Animal: " + nome);
    }
}

public class Cachorro extends Animal {
    // Não é sobrescrita, é NOVO construtor
    public Cachorro(String nome) {
        super(nome);
        System.out.println("Cachorro: " + nome);
    }
}
```

---

## Aplicabilidade

**Use final quando**:
- Método **crítico** não pode ser alterado
- Garantir **segurança** ou **invariância**
- **Performance** (JVM pode otimizar)

**Métodos static**:
- Métodos utilitários
- Não precisam de instância
- Não usam polimorfismo

**Métodos private**:
- Implementação interna
- Não devem ser visíveis para subclasses

---

## Armadilhas

### 1. Tentar Sobrescrever final

```java
public class Base {
    public final void metodo() { }
}

public class Derivada extends Base {
    // ❌ ERRO de compilação
    @Override
    public void metodo() { }
}
```

### 2. Confundir static com Sobrescrita

```java
public class Base {
    public static void metodo() {
        System.out.println("Base");
    }
}

public class Derivada extends Base {
    public static void metodo() {
        System.out.println("Derivada");
    }
}

// ❌ Polimorfismo NÃO funciona
Base b = new Derivada();
b.metodo(); // "Base" ← Tipo da referência
```

### 3. Usar @Override com static

```java
public class Derivada extends Base {
    // ❌ ERRO: @Override com static
    @Override
    public static void metodo() { }
}
```

### 4. Acreditar Que private É Sobrescrito

```java
public class Base {
    private void metodo() {
        System.out.println("Base");
    }
}

public class Derivada extends Base {
    // Não sobrescreve (novo método)
    private void metodo() {
        System.out.println("Derivada");
    }
}
```

---

## Boas Práticas

### 1. Use final Para Métodos Críticos

```java
public class Seguranca {
    public final boolean validar(String senha) {
        // Validação crítica que não pode ser alterada
        return senha != null && senha.length() >= 8;
    }
}
```

### 2. Documente Por Que É final

```java
/**
 * Método final para garantir validação sempre executada.
 * NÃO sobrescrever para evitar bypass de segurança.
 */
public final void validar(String entrada) {
    // ...
}
```

### 3. Prefira Composição a Herança com Classes final

```java
// ❌ Não pode estender String
// public class MinhaString extends String { }

// ✅ Use composição
public class MinhaString {
    private final String texto;
    
    public MinhaString(String texto) {
        this.texto = texto;
    }
}
```

### 4. static Para Métodos Utilitários

```java
public class Util {
    // Método utilitário (não precisa de instância)
    public static int somar(int a, int b) {
        return a + b;
    }
}
```

### 5. private Para Implementação Interna

```java
public class Processador {
    private void validarInterno() {
        // Implementação interna (não visível para subclasses)
    }
    
    public void processar() {
        validarInterno();
        // ...
    }
}
```

---

## Resumo

**Métodos que NÃO podem ser sobrescritos**:

**1. Métodos final**:
```java
public final void metodo() { } // ❌ Não sobrescrevível

// ❌ ERRO
@Override
public void metodo() { }
```

**2. Métodos static**:
```java
public static void metodo() { } // Method hiding, não sobrescrita

// Polimorfismo NÃO funciona
Base b = new Derivada();
b.metodo(); // ← Tipo da REFERÊNCIA
```

**3. Métodos private**:
```java
private void metodo() { } // Não herdado

// Subclasse: NOVO método (não sobrescreve)
private void metodo() { }
```

**Tabela**:
```
┌──────────┬───────────────┬───────────────────┐
│ Tipo     │ Sobrescrevível│ Razão             │
├──────────┼───────────────┼───────────────────┤
│ final    │ ❌            │ Impede modificação│
│ static   │ ❌            │ Sem polimorfismo  │
│ private  │ ❌            │ Não herdado       │
│ public   │ ✅            │ Herdado e visível │
│ protected│ ✅            │ Herdado e visível │
│ default  │ ✅            │ Herdado (pacote)  │
└──────────┴───────────────┴───────────────────┘
```

**Classes final**:
```java
public final class String { } // Não pode ser estendida

// ❌ ERRO
public class MinhaString extends String { }
```

**Construtores**:
```java
public Animal(String nome) { } // Não é método, não é sobrescrito
```

**Method Hiding (static)**:
```java
Base.metodo();     // Base
Derivada.metodo(); // Derivada (hiding)

Base b = new Derivada();
b.metodo(); // Base ← Tipo da referência
```

**Uso de final**:
```java
// Segurança
public final void validar() { }

// Classe imutável
public final class Imutavel { }

// Performance (JVM otimiza)
public final int calcular() { }
```

**Regra de Ouro**: **final = não sobrescrevível**, **static = sem polimorfismo**, **private = não herdado**.
