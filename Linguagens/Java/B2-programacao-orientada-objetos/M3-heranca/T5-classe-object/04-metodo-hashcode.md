# T5.04 - Método hashCode()

## Introdução

**hashCode()** retorna **código hash** do objeto.

**Usado em collections** baseadas em hash (HashMap, HashSet).

**Objetos iguais** (equals()) devem ter **mesmo hashCode()**.

```java
public class Pessoa {
    private String cpf;
    
    @Override
    public int hashCode() {
        return cpf.hashCode();
    }
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Pessoa p)) return false;
        return cpf.equals(p.cpf);
    }
}
```

```java
// HashMap usa hashCode() para localizar objetos
Map<Pessoa, String> mapa = new HashMap<>();
Pessoa p = new Pessoa("123.456.789-00");
mapa.put(p, "João");

// Localiza usando hashCode()
String nome = mapa.get(new Pessoa("123.456.789-00")); // "João"
```

---

## Fundamentos

### 1. hashCode() em Object

**Implementação padrão**: baseada em endereço de memória.

```java
public class Object {
    public native int hashCode();
}
```

**Retorna int único** para cada objeto.

### 2. Propósito de hashCode()

**Otimizar busca** em estruturas de hash.

```java
// HashSet usa hashCode() para organizar objetos
Set<Pessoa> pessoas = new HashSet<>();
pessoas.add(new Pessoa("123"));
pessoas.add(new Pessoa("456"));

// hashCode() determina "bucket" onde objeto é armazenado
```

**Algoritmo de busca**:
1. Calcular hashCode()
2. Localizar bucket
3. Usar equals() para comparar

### 3. Contrato de hashCode()

**Regras obrigatórias**:

1. **Consistente**: Múltiplas chamadas retornam mesmo valor
2. **equals() → hashCode()**: Se `x.equals(y)` então `x.hashCode() == y.hashCode()`
3. **hashCode() ≠ equals()**: `x.hashCode() == y.hashCode()` **não garante** `x.equals(y)`

```java
Pessoa p1 = new Pessoa("123");
Pessoa p2 = new Pessoa("123");

// p1.equals(p2) == true
p1.hashCode() == p2.hashCode(); // true ✅ (obrigatório)

// p1.hashCode() == p2.hashCode()
p1.equals(p2); // Pode ser true ou false (não garantido)
```

### 4. Implementação Simples

**Baseada em atributo principal**.

```java
public class Pessoa {
    private String cpf;
    
    @Override
    public int hashCode() {
        return cpf.hashCode();
    }
}
```

### 5. Múltiplos Atributos

**Combinar hash codes** de múltiplos atributos.

```java
public class Pessoa {
    private String nome;
    private int idade;
    private String cpf;
    
    @Override
    public int hashCode() {
        int result = nome != null ? nome.hashCode() : 0;
        result = 31 * result + idade;
        result = 31 * result + (cpf != null ? cpf.hashCode() : 0);
        return result;
    }
}
```

**31**: número primo (distribui melhor valores).

### 6. Objects.hash() (Java 7+)

**Método utilitário** para calcular hashCode().

```java
import java.util.Objects;

public class Pessoa {
    private String nome;
    private int idade;
    private String cpf;
    
    @Override
    public int hashCode() {
        return Objects.hash(nome, idade, cpf);
    }
}
```

**Objects.hash()**: null-safe, usa algoritmo padrão.

### 7. hashCode() em Collections

**HashMap, HashSet, Hashtable** usam hashCode().

```java
Map<Pessoa, String> mapa = new HashMap<>();
Pessoa p1 = new Pessoa("123");
mapa.put(p1, "João");

// get() usa hashCode() para localizar
Pessoa p2 = new Pessoa("123");
String nome = mapa.get(p2); // "João" (mesmo hashCode e equals)
```

### 8. hashCode() com Herança

**Incluir atributos da superclasse**.

```java
public class Animal {
    private String nome;
    
    @Override
    public int hashCode() {
        return nome.hashCode();
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + raca.hashCode();
        return result;
    }
}
```

### 9. hashCode() Constante (Válido)

**Sempre retornar mesmo valor** (válido, mas ineficiente).

```java
@Override
public int hashCode() {
    return 42; // Válido ✅ (mas todos objetos no mesmo bucket)
}
```

**Problema**: Todos objetos no **mesmo bucket** (lento).

### 10. hashCode() de Arrays

**Arrays.hashCode()** para arrays.

```java
import java.util.Arrays;

public class Turma {
    private String[] alunos;
    
    @Override
    public int hashCode() {
        return Arrays.hashCode(alunos);
    }
}
```

---

## Aplicabilidade

**Sobrescreva hashCode() quando**:
- Sobrescrever **equals()**
- Usar em **HashMap, HashSet, Hashtable**
- Armazenar em **collections** baseadas em hash

**Não sobrescreva quando**:
- Nunca usar em **hash-based collections**
- Classe é **singleton** ou **imutável sem equals()**

---

## Armadilhas

### 1. Sobrescrever equals() Sem hashCode()

```java
public class Pessoa {
    private String cpf;
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Pessoa p)) return false;
        return cpf.equals(p.cpf);
    }
    
    // ❌ FALTANDO hashCode()
}

Map<Pessoa, String> mapa = new HashMap<>();
Pessoa p1 = new Pessoa("123");
mapa.put(p1, "João");

Pessoa p2 = new Pessoa("123");
mapa.get(p2); // null ❌ (hashCode() diferente)
```

### 2. Usar Atributos Mutáveis

```java
public class Pessoa {
    private String nome; // Mutável
    
    @Override
    public int hashCode() {
        return nome.hashCode();
    }
}

Pessoa p = new Pessoa("João");
Set<Pessoa> set = new HashSet<>();
set.add(p);

// ❌ Modificar nome altera hashCode()
p.nome = "Maria";

set.contains(p); // false ❌ (hashCode mudou, objeto em bucket errado)
```

**Solução**: Use **atributos imutáveis** (final).

### 3. hashCode() Inconsistente

```java
public class Pessoa {
    private String cpf;
    
    @Override
    public int hashCode() {
        // ❌ Usa Random (valor muda)
        return new Random().nextInt();
    }
}

Pessoa p = new Pessoa("123");
p.hashCode(); // 42
p.hashCode(); // 87 ❌ (viola contrato)
```

### 4. Violar Contrato equals() → hashCode()

```java
public class Pessoa {
    private String cpf;
    
    @Override
    public boolean equals(Object obj) {
        return cpf.equals(((Pessoa) obj).cpf);
    }
    
    @Override
    public int hashCode() {
        // ❌ Baseado em outro atributo
        return idade; // Diferente de equals()
    }
}

Pessoa p1 = new Pessoa("123", 30);
Pessoa p2 = new Pessoa("123", 40);

p1.equals(p2); // true
p1.hashCode() == p2.hashCode(); // false ❌ (viola contrato)
```

### 5. Não Tratar null

```java
public class Pessoa {
    private String nome;
    
    @Override
    public int hashCode() {
        // ❌ NullPointerException se nome for null
        return nome.hashCode();
    }
}

// ✅ Tratar null
@Override
public int hashCode() {
    return nome != null ? nome.hashCode() : 0;
}

// ✅ Usar Objects.hash()
@Override
public int hashCode() {
    return Objects.hash(nome); // null-safe
}
```

### 6. hashCode() Muito Simples

```java
// ❌ Todos objetos mesmo hashCode
@Override
public int hashCode() {
    return 1;
}
```

**Problema**: Degrada performance (todos objetos no mesmo bucket).

---

## Boas Práticas

### 1. Sempre Sobrescreva Com equals()

```java
@Override
public boolean equals(Object obj) {
    // ...
}

@Override
public int hashCode() {
    // ...
}
```

### 2. Use Objects.hash()

```java
import java.util.Objects;

@Override
public int hashCode() {
    return Objects.hash(nome, idade, cpf);
}
```

### 3. Baseie em Mesmos Atributos de equals()

```java
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof Pessoa p)) return false;
    return cpf.equals(p.cpf); // Usa cpf
}

@Override
public int hashCode() {
    return cpf.hashCode(); // ✅ Mesmo atributo
}
```

### 4. Use Atributos Imutáveis (final)

```java
public class Pessoa {
    private final String cpf; // Imutável
    
    @Override
    public int hashCode() {
        return cpf.hashCode(); // ✅ Nunca muda
    }
}
```

### 5. Use IDE Para Gerar

**IntelliJ IDEA**: `Alt+Insert` → `equals() and hashCode()`

**Eclipse**: `Source` → `Generate hashCode() and equals()`

### 6. Documente hashCode()

```java
/**
 * Retorna hash code baseado em CPF.
 * @return hash code
 */
@Override
public int hashCode() {
    return Objects.hash(cpf);
}
```

### 7. Número Primo (31) Para Combinação

```java
@Override
public int hashCode() {
    int result = nome.hashCode();
    result = 31 * result + idade; // ✅ 31 distribui melhor
    return result;
}
```

### 8. Arrays.hashCode() Para Arrays

```java
import java.util.Arrays;

public class Turma {
    private String[] alunos;
    
    @Override
    public int hashCode() {
        return Arrays.hashCode(alunos);
    }
}
```

### 9. Cache hashCode() em Objetos Imutáveis

```java
public final class Pessoa {
    private final String cpf;
    private int hashCode; // Cache
    
    @Override
    public int hashCode() {
        if (hashCode == 0) {
            hashCode = cpf.hashCode();
        }
        return hashCode;
    }
}
```

---

## Resumo

**hashCode()**:
```java
@Override
public int hashCode() {
    return Objects.hash(atributo1, atributo2);
}
```

**Contrato de hashCode()**:
1. **Consistente**: Múltiplas chamadas → mesmo valor
2. **equals() → hashCode()**: `x.equals(y)` → `x.hashCode() == y.hashCode()`
3. **hashCode() ≠ equals()**: Mesmo hashCode **não garante** equals()

**Objects.hash()**:
```java
@Override
public int hashCode() {
    return Objects.hash(nome, idade, cpf); // null-safe
}
```

**Implementação manual**:
```java
@Override
public int hashCode() {
    int result = nome != null ? nome.hashCode() : 0;
    result = 31 * result + idade;
    result = 31 * result + (cpf != null ? cpf.hashCode() : 0);
    return result;
}
```

**HashMap usa hashCode()**:
```java
Map<Pessoa, String> mapa = new HashMap<>();
Pessoa p = new Pessoa("123");
mapa.put(p, "João");

// get() usa hashCode() e equals()
mapa.get(new Pessoa("123")); // "João"
```

**Arrays**:
```java
@Override
public int hashCode() {
    return Arrays.hashCode(array);
}
```

**Com herança**:
```java
@Override
public int hashCode() {
    int result = super.hashCode();
    result = 31 * result + atributoSubclasse.hashCode();
    return result;
}
```

**Cache (imutáveis)**:
```java
private int hashCode; // Cache

@Override
public int hashCode() {
    if (hashCode == 0) {
        hashCode = Objects.hash(atributos);
    }
    return hashCode;
}
```

**Regra de Ouro**: **Sempre sobrescreva hashCode()** ao sobrescrever **equals()**. Use **Objects.hash()** para simplificar. **Mesmos atributos** em equals() e hashCode().
