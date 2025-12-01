# T5.03 - Método equals()

## Introdução

**equals()** compara **conteúdo** de objetos.

**== compara referências** (endereços de memória).

**equals() deve ser sobrescrito** para comparação lógica.

```java
String s1 = new String("Java");
String s2 = new String("Java");

// ❌ == compara referências
s1 == s2;      // false (objetos diferentes)

// ✅ equals() compara conteúdo
s1.equals(s2); // true (conteúdo igual)
```

```java
public class Pessoa {
    private String cpf;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Pessoa)) return false;
        Pessoa p = (Pessoa) obj;
        return cpf.equals(p.cpf);
    }
}
```

---

## Fundamentos

### 1. equals() em Object

**Implementação padrão**: compara referências (mesmo que ==).

```java
public class Object {
    public boolean equals(Object obj) {
        return this == obj; // Compara referências
    }
}
```

### 2. Problema de equals() Padrão

**Sem sobrescrita**, compara endereços de memória.

```java
public class Pessoa {
    private String nome;
    
    // Sem sobrescrita de equals()
}

Pessoa p1 = new Pessoa("João");
Pessoa p2 = new Pessoa("João");

p1.equals(p2); // false ❌ (objetos diferentes)
p1 == p2;      // false (mesma coisa)
```

### 3. Sobrescrita de equals()

**Comparar conteúdo** em vez de referência.

```java
public class Pessoa {
    private String cpf;
    
    @Override
    public boolean equals(Object obj) {
        // 1. Verifica se é o mesmo objeto
        if (this == obj) return true;
        
        // 2. Verifica se obj é null ou tipo diferente
        if (!(obj instanceof Pessoa)) return false;
        
        // 3. Cast e compara atributos
        Pessoa p = (Pessoa) obj;
        return cpf.equals(p.cpf);
    }
}

Pessoa p1 = new Pessoa("123.456.789-00");
Pessoa p2 = new Pessoa("123.456.789-00");

p1.equals(p2); // true ✅ (mesmo CPF)
```

### 4. Assinatura de equals()

**Parâmetro deve ser Object**.

```java
// ✅ CORRETO
@Override
public boolean equals(Object obj) {
    // ...
}

// ❌ ERRO: não sobrescreve (é sobrecarga)
public boolean equals(Pessoa p) {
    // ...
}
```

### 5. Contrato de equals()

**Propriedades obrigatórias**:

1. **Reflexiva**: `x.equals(x)` deve ser `true`
2. **Simétrica**: Se `x.equals(y)` então `y.equals(x)`
3. **Transitiva**: Se `x.equals(y)` e `y.equals(z)` então `x.equals(z)`
4. **Consistente**: Múltiplas chamadas retornam mesmo resultado
5. **Null**: `x.equals(null)` deve ser `false`

### 6. equals() com Múltiplos Atributos

**Comparar todos os atributos relevantes**.

```java
public class Pessoa {
    private String nome;
    private int idade;
    private String cpf;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Pessoa)) return false;
        Pessoa p = (Pessoa) obj;
        return idade == p.idade &&
               Objects.equals(nome, p.nome) &&
               Objects.equals(cpf, p.cpf);
    }
}
```

**Objects.equals()**: null-safe.

### 7. equals() com Herança

**Cuidado com subclasses**.

```java
public class Animal {
    private String nome;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Animal a = (Animal) obj;
        return nome.equals(a.nome);
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    @Override
    public boolean equals(Object obj) {
        if (!super.equals(obj)) return false;
        Cachorro c = (Cachorro) obj;
        return raca.equals(c.raca);
    }
}
```

**getClass()** em vez de **instanceof** para evitar violação de simetria.

### 8. equals() em Collections

**Collections** usam equals() para busca.

```java
List<Pessoa> pessoas = new ArrayList<>();
pessoas.add(new Pessoa("João"));

// contains() usa equals()
boolean contem = pessoas.contains(new Pessoa("João")); // true
```

### 9. equals() com null

**Sempre retornar false** para null.

```java
@Override
public boolean equals(Object obj) {
    if (obj == null) return false; // ✅
    // ... ou
    if (!(obj instanceof Pessoa)) return false; // ✅ (trata null)
}
```

### 10. Pattern Matching com instanceof (Java 16+)

```java
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Pessoa p)) return false; // Pattern matching
    return Objects.equals(nome, p.nome) &&
           idade == p.idade;
}
```

---

## Aplicabilidade

**Sobrescreva equals() quando**:
- Objetos com **mesmo conteúdo** devem ser considerados **iguais**
- Usar em **Collections** (List, Set)
- Usar como **chave** em HashMap

**Não sobrescreva quando**:
- Cada instância é **única** (identity matters)
- Classe é **singleton**
- Comparação por referência é **suficiente**

---

## Armadilhas

### 1. Usar == Para Comparar Conteúdo

```java
String s1 = new String("Java");
String s2 = new String("Java");

// ❌ Compara referências
if (s1 == s2) { } // false

// ✅ Compara conteúdo
if (s1.equals(s2)) { } // true
```

### 2. Não Sobrescrever equals()

```java
public class Pessoa {
    private String cpf;
    // Sem equals()
}

Pessoa p1 = new Pessoa("123");
Pessoa p2 = new Pessoa("123");

p1.equals(p2); // false ❌ (usa equals() de Object)
```

### 3. Assinatura Errada (Sobrecarga)

```java
// ❌ ERRO: não sobrescreve (parâmetro diferente)
public boolean equals(Pessoa p) {
    return this.cpf.equals(p.cpf);
}

// ✅ CORRETO
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof Pessoa)) return false;
    Pessoa p = (Pessoa) obj;
    return this.cpf.equals(p.cpf);
}
```

### 4. Esquecer @Override

```java
// ❌ Sem @Override (erro não detectado)
public boolean equals(Object obj) {
    // ... erro de lógica não detectado
}

// ✅ Com @Override
@Override
public boolean equals(Object obj) {
    // ... compilador valida
}
```

### 5. Não Verificar null

```java
// ❌ NullPointerException se obj for null
@Override
public boolean equals(Object obj) {
    Pessoa p = (Pessoa) obj; // NPE se obj == null
    return cpf.equals(p.cpf);
}

// ✅ Verificar null
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof Pessoa)) return false; // Trata null
    Pessoa p = (Pessoa) obj;
    return cpf.equals(p.cpf);
}
```

### 6. Violar Contrato de equals() com Herança

```java
public class Animal {
    String nome;
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Animal)) return false;
        return nome.equals(((Animal) obj).nome);
    }
}

public class Cachorro extends Animal {
    String raca;
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Cachorro)) return false;
        return super.equals(obj) && raca.equals(((Cachorro) obj).raca);
    }
}

// Viola simetria
Animal a = new Animal("Rex");
Cachorro c = new Cachorro("Rex", "Labrador");

a.equals(c); // true  (instanceof Animal)
c.equals(a); // false (instanceof Cachorro) ❌ Viola simetria
```

**Solução**: Use **getClass()** em vez de **instanceof**.

---

## Boas Práticas

### 1. Sempre Use @Override

```java
@Override
public boolean equals(Object obj) {
    // ...
}
```

### 2. Siga Padrão de Implementação

```java
@Override
public boolean equals(Object obj) {
    // 1. Otimização: mesmo objeto
    if (this == obj) return true;
    
    // 2. Verificar tipo (e null)
    if (!(obj instanceof Pessoa)) return false;
    
    // 3. Cast
    Pessoa p = (Pessoa) obj;
    
    // 4. Comparar atributos
    return Objects.equals(cpf, p.cpf);
}
```

### 3. Use Objects.equals() Para null-safety

```java
import java.util.Objects;

@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Pessoa)) return false;
    Pessoa p = (Pessoa) obj;
    return Objects.equals(nome, p.nome) &&
           Objects.equals(cpf, p.cpf) &&
           idade == p.idade;
}
```

### 4. Use IDE Para Gerar equals()

**IntelliJ IDEA**: `Alt+Insert` → `equals() and hashCode()`

**Eclipse**: `Source` → `Generate hashCode() and equals()`

### 5. Sempre Sobrescreva hashCode() Junto

```java
@Override
public boolean equals(Object obj) {
    // ...
}

@Override
public int hashCode() {
    return Objects.hash(cpf);
}
```

### 6. getClass() vs instanceof

**instanceof**: permite comparação entre tipos relacionados (menos restritivo)

**getClass()**: exige mesmo tipo exato (mais restritivo)

```java
// instanceof
if (!(obj instanceof Pessoa)) return false;

// getClass()
if (obj == null || getClass() != obj.getClass()) return false;
```

### 7. Documente equals()

```java
/**
 * Compara pessoas por CPF.
 * @param obj objeto a comparar
 * @return true se CPFs são iguais
 */
@Override
public boolean equals(Object obj) {
    // ...
}
```

---

## Resumo

**equals()**:
```java
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof MinhaClasse)) return false;
    MinhaClasse other = (MinhaClasse) obj;
    return Objects.equals(atributo, other.atributo);
}
```

**== vs equals()**:
```java
String s1 = new String("Java");
String s2 = new String("Java");

s1 == s2;      // false (referências diferentes)
s1.equals(s2); // true  (conteúdo igual)
```

**Contrato de equals()**:
1. **Reflexiva**: `x.equals(x) == true`
2. **Simétrica**: `x.equals(y) == y.equals(x)`
3. **Transitiva**: `x.equals(y) && y.equals(z)` → `x.equals(z)`
4. **Consistente**: mesmo resultado em múltiplas chamadas
5. **Null**: `x.equals(null) == false`

**Padrão de implementação**:
```java
@Override
public boolean equals(Object obj) {
    // 1. Mesma referência
    if (this == obj) return true;
    
    // 2. Tipo e null
    if (!(obj instanceof Pessoa p)) return false;
    
    // 3. Comparar atributos
    return Objects.equals(cpf, p.cpf);
}
```

**Objects.equals() (null-safe)**:
```java
Objects.equals(a, b) // true se ambos null ou a.equals(b)
```

**Com herança**:
```java
// Preferir getClass()
if (obj == null || getClass() != obj.getClass()) return false;

// Chamar super.equals()
if (!super.equals(obj)) return false;
```

**Collections**:
```java
List<Pessoa> pessoas = new ArrayList<>();
pessoas.contains(p); // Usa equals()

Set<Pessoa> set = new HashSet<>();
set.add(p); // Usa equals() e hashCode()
```

**Regra de Ouro**: **Sobrescreva equals()** para **comparação de conteúdo**. **Sempre sobrescreva hashCode()** junto. Use **@Override** e **Objects.equals()**.
