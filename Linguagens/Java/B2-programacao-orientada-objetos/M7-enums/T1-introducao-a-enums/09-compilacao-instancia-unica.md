# T1.09 - Compilação: Cada Constante é Instância Única

## Introdução

**Compilação**: enum gera classe com instâncias únicas (singleton).

```java
// Código
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Compilador gera (aproximadamente):
public final class Status extends Enum<Status> {
    public static final Status ATIVO = new Status("ATIVO", 0);
    public static final Status INATIVO = new Status("INATIVO", 1);
    public static final Status PENDENTE = new Status("PENDENTE", 2);
    
    private static final Status[] VALUES = {ATIVO, INATIVO, PENDENTE};
    
    private Status(String name, int ordinal) {
        super(name, ordinal);
    }
    
    public static Status[] values() {
        return VALUES.clone();
    }
    
    public static Status valueOf(String name) {
        // ...
    }
}
```

**Singleton**: cada constante é instância única.

---

## Fundamentos

### 1. Cada Constante = Instância Única

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor c1 = Cor.VERMELHO;
Cor c2 = Cor.VERMELHO;

System.out.println(c1 == c2); // true (mesma instância)
System.out.println(System.identityHashCode(c1) == 
                   System.identityHashCode(c2)); // true
```

### 2. Estende Enum<T>

```java
// Código
public enum DiaSemana {
    SEGUNDA, TERCA
}

// Compilador gera
public final class DiaSemana extends Enum<DiaSemana> {
    // ...
}
```

### 3. Constantes São static final

```java
// Código
public enum Status {
    ATIVO, INATIVO
}

// Gerado
public static final Status ATIVO = new Status("ATIVO", 0);
public static final Status INATIVO = new Status("INATIVO", 1);
```

### 4. Construtor Chamado Automaticamente

```java
public enum Planeta {
    TERRA(5.972e24),
    MARTE(6.39e23);
    
    private final double massa;
    
    Planeta(double massa) {
        this.massa = massa;
        System.out.println("Criando " + this.name());
    }
}

// Ao carregar classe:
// Criando TERRA
// Criando MARTE
```

### 5. Ordem de Inicialização

```java
public enum Config {
    INSTANCE;
    
    private String valor;
    
    // 1. Construtor executado
    Config() {
        System.out.println("1. Construtor");
        valor = "config";
    }
    
    // 2. Bloco de inicialização
    {
        System.out.println("2. Bloco instância");
    }
    
    // 3. Bloco estático
    static {
        System.out.println("3. Bloco estático");
    }
}

// Saída ao carregar:
// 1. Construtor
// 2. Bloco instância
// 3. Bloco estático
```

### 6. Array values() Gerado

```java
public enum Numero {
    UM, DOIS, TRES
}

// Gerado
private static final Numero[] VALUES = {UM, DOIS, TRES};

public static Numero[] values() {
    return VALUES.clone(); // Clone para segurança
}
```

### 7. valueOf() Gerado

```java
public enum Status {
    ATIVO, INATIVO
}

// Gerado
public static Status valueOf(String name) {
    return (Status) Enum.valueOf(Status.class, name);
}

Status s = Status.valueOf("ATIVO"); // Retorna ATIVO (mesma instância)
```

### 8. name() e ordinal() Herdados

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

Prioridade p = Prioridade.MEDIA;

System.out.println(p.name());    // MEDIA
System.out.println(p.ordinal()); // 1 (índice)
```

### 9. Serialização Especial

```java
// Enum serializado por name(), não por estado
// Garante mesma instância após deserialização

public enum Status {
    ATIVO, INATIVO
}

// Serializar e deserializar
Status s1 = Status.ATIVO;
// ... serialização ...
Status s2 = // ... deserialização ...

System.out.println(s1 == s2); // true (mesma instância)
```

### 10. Lazy Loading

```java
public enum Logger {
    INSTANCE;
    
    Logger() {
        System.out.println("Logger criado");
    }
}

// Enum só é carregado quando primeiro usado
public static void main(String[] args) {
    System.out.println("Início");
    Logger.INSTANCE.log("Teste"); // Aqui carrega
}

// Saída:
// Início
// Logger criado
```

---

## Aplicabilidade

**Compilação gera**:
- Classe final estendendo Enum<T>
- Constantes static final
- Construtor private
- Método values()
- Método valueOf()
- name() e ordinal() herdados

---

## Armadilhas

### 1. Modificar Array de values()

```java
Cor[] cores = Cor.values();
cores[0] = null; // ✅ Modifica clone, não original

Cor[] cores2 = Cor.values();
System.out.println(cores2[0]); // ✅ VERMELHO (original intacto)
```

### 2. valueOf() com Nome Inválido

```java
// ❌ IllegalArgumentException
try {
    Status s = Status.valueOf("INVALIDO");
} catch (IllegalArgumentException e) {
    System.out.println("Status inválido");
}
```

### 3. Ordem de Inicialização

```java
public enum Erro {
    A, B;
    
    // ❌ ERRO: não pode referenciar constante antes de declarar
    // static {
    //     System.out.println(A); // A ainda não existe
    // }
}
```

---

## Boas Práticas

### 1. Entender Lazy Loading

```java
// ✅ Enum carregado quando primeiro usado
public enum Database {
    INSTANCE;
    
    Database() {
        // Conexão só criada quando necessário
    }
}
```

### 2. Singleton Thread-Safe

```java
// ✅ Singleton thread-safe garantido
public enum Config {
    INSTANCE;
    
    private String valor;
    
    public void setValor(String v) {
        valor = v;
    }
}
```

### 3. Não Modificar values()

```java
// ❌ Evitar modificar
Cor[] cores = Cor.values();
// cores[0] = null; // Não faça

// ✅ Apenas ler
for (Cor cor : Cor.values()) {
    System.out.println(cor);
}
```

---

## Resumo

**Compilação de enum**:

```java
// Código
public enum Status {
    ATIVO, INATIVO
}

// Gerado
public final class Status extends Enum<Status> {
    public static final Status ATIVO = new Status("ATIVO", 0);
    public static final Status INATIVO = new Status("INATIVO", 1);
    
    private static final Status[] VALUES = {ATIVO, INATIVO};
    
    private Status(String name, int ordinal) {
        super(name, ordinal);
    }
    
    public static Status[] values() {
        return VALUES.clone();
    }
    
    public static Status valueOf(String name) {
        return (Status) Enum.valueOf(Status.class, name);
    }
}
```

**Características**:
- Cada constante = `static final` (singleton)
- Estende `Enum<T>`
- Construtor `private`
- `values()` retorna array (clone)
- `valueOf()` converte String
- `name()` e `ordinal()` herdados
- Serialização por nome
- Lazy loading (carregado quando usado)

**Singleton garantido**:
```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;
s1 == s2 // true (mesma instância)
```

**Regra de Ouro**: Compilador gera classe `final` com constantes `static final` (singleton por constante). Cada constante é **instância única** criada automaticamente. `values()` retorna **clone** do array. `valueOf()` retorna instância existente (mesma referência). Enum é **thread-safe** e **serialização segura** por padrão.
