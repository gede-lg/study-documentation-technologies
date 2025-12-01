# T1.05 - Enum como Classe Final Implícita

## Introdução

**Enum**: implicitamente `final` - não pode ser estendido.

```java
public enum Status {
    ATIVO, INATIVO
}

// ❌ ERRO: não pode estender enum
// public enum StatusExtendido extends Status { }
```

**final implícito**: compilador adiciona automaticamente.

---

## Fundamentos

### 1. Enum é final

```java
// Declaração
public enum Cor {
    VERMELHO, VERDE, AZUL
}

// Compilador gera (aproximadamente):
// public final class Cor extends Enum<Cor> {
//     public static final Cor VERMELHO = new Cor();
//     public static final Cor VERDE = new Cor();
//     public static final Cor AZUL = new Cor();
// }
```

### 2. Não Pode Ser Estendido

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

// ❌ ERRO: cannot inherit from final enum
// class DiaUtil extends DiaSemana { }
```

### 3. Enum Estende Enum<T>

```java
public enum Status {
    ATIVO, INATIVO
}

// Internamente:
// public final class Status extends Enum<Status> { }

// Por isso não pode estender outra classe
// ❌ Java não permite herança múltipla
```

### 4. Não Pode Estender Outra Classe

```java
class Base { }

// ❌ ERRO: enum não pode estender classe
// public enum MeuEnum extends Base {
//     A, B, C
// }
```

### 5. Pode Implementar Interfaces

```java
interface Descritivel {
    String getDescricao();
}

// ✅ Enum pode implementar interface
public enum Status implements Descritivel {
    ATIVO, INATIVO;
    
    @Override
    public String getDescricao() {
        return "Status: " + this.name();
    }
}

System.out.println(Status.ATIVO.getDescricao());
// Status: ATIVO
```

### 6. Constantes São final

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

// Internamente:
// public static final Cor VERMELHO = new Cor();

Cor cor = Cor.VERMELHO;
// cor = new Cor(); // ❌ ERRO: construtor é private
```

### 7. Garantia de Singleton

```java
public enum Database {
    INSTANCE;
    
    public void conectar() {
        System.out.println("Conectado");
    }
}

// Sempre mesma instância
Database db1 = Database.INSTANCE;
Database db2 = Database.INSTANCE;

System.out.println(db1 == db2); // true
```

### 8. Serialização Segura

```java
public enum Status {
    ATIVO, INATIVO
}

// Enum serializado por nome, não por estado
// Garante instância única após deserialização

// Singleton com classe:
// - Pode ter múltiplas instâncias após deserialização
// Enum:
// - Sempre instância única (final + serialização especial)
```

### 9. Reflection Limitado

```java
import java.lang.reflect.*;

public enum Cor {
    VERMELHO, VERDE, AZUL
}

// ❌ Reflection não pode criar instâncias
// Constructor<Cor> c = Cor.class.getDeclaredConstructor();
// c.newInstance(); // IllegalArgumentException
```

### 10. Imutabilidade Garantida

```java
public enum Direcao {
    NORTE, SUL, LESTE, OESTE
}

// - Enum é final (não pode ser estendido)
// - Constantes são final (não podem ser reatribuídas)
// - Atributos devem ser final (boa prática)
// = Imutabilidade garantida
```

---

## Aplicabilidade

**Enum final significa**:
- Não pode ser estendido (subclasses)
- Constantes são instâncias finais
- Singleton garantido por constante
- Serialização segura
- Imutabilidade

---

## Armadilhas

### 1. Tentar Estender Enum

```java
public enum Base {
    A, B
}

// ❌ ERRO
// public enum Derivado extends Base {
//     C, D
// }
```

### 2. Tentar Estender Classe com Enum

```java
class MinhaClasse { }

// ❌ ERRO
// public enum MeuEnum extends MinhaClasse {
//     A, B
// }
```

### 3. Esquecer que Constantes São final

```java
public enum Status {
    ATIVO, INATIVO
}

Status s = Status.ATIVO;
// s = new Status(); // ❌ ERRO: construtor private
```

---

## Boas Práticas

### 1. Enum para Singleton

```java
// ✅ Singleton thread-safe com enum
public enum Logger {
    INSTANCE;
    
    public void log(String msg) {
        System.out.println("[LOG] " + msg);
    }
}

Logger.INSTANCE.log("Teste");
```

### 2. Atributos final em Enum

```java
// ✅ Atributos final = imutável
public enum Planeta {
    TERRA(5.972e24, 6.371e6);
    
    private final double massa;
    private final double raio;
    
    Planeta(double massa, double raio) {
        this.massa = massa;
        this.raio = raio;
    }
    
    public double getMassa() { return massa; }
}
```

### 3. Implementar Interfaces

```java
// ✅ Enum pode implementar interfaces
interface Operacao {
    int executar(int a, int b);
}

public enum Calc implements Operacao {
    SOMA, SUBTRACAO;
    
    @Override
    public int executar(int a, int b) {
        return switch (this) {
            case SOMA -> a + b;
            case SUBTRACAO -> a - b;
        };
    }
}
```

---

## Resumo

**Enum é final implicitamente**:

```java
// Declaração
public enum Status { ATIVO, INATIVO }

// Compilador gera
public final class Status extends Enum<Status> { }
```

**Características**:
- `final` implícito (não pode ser estendido)
- Estende `Enum<T>` (por isso não pode estender outras classes)
- Constantes são `static final`
- Construtor é `private`
- Singleton garantido por constante
- Serialização segura (por nome)
- Reflection bloqueado para criar instâncias

**Restrições**:
- ❌ Não pode ser estendido
- ❌ Não pode estender classes
- ✅ Pode implementar interfaces

**Vantagens de ser final**:
- Singleton garantido
- Serialização segura
- Imutabilidade
- Thread-safe por padrão
- Sem surpresas (ninguém pode estender)

**Regra de Ouro**: Enum é **final implicitamente** - não pode ser estendido. Estende `Enum<T>` internamente. Constantes são **singleton** (instância única). Pode **implementar interfaces**, mas **não pode estender classes**. Ideal para **singleton thread-safe**.
