# T5.05 - Contrato entre equals() e hashCode()

## Introdução

**equals()** e **hashCode()** devem ser **consistentes**.

**Contrato obrigatório**: objetos iguais → mesmo hashCode().

**Violar contrato** quebra **HashMap, HashSet**.

```java
public class Pessoa {
    private String cpf;
    
    // ✅ equals() e hashCode() consistentes
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Pessoa p)) return false;
        return cpf.equals(p.cpf);
    }
    
    @Override
    public int hashCode() {
        return cpf.hashCode(); // Mesmo atributo
    }
}
```

```java
Pessoa p1 = new Pessoa("123");
Pessoa p2 = new Pessoa("123");

// equals() → hashCode()
p1.equals(p2);                    // true
p1.hashCode() == p2.hashCode();   // true ✅ (contrato respeitado)
```

---

## Fundamentos

### 1. Regra Principal do Contrato

**Se `x.equals(y)` então `x.hashCode() == y.hashCode()`**

```java
Pessoa p1 = new Pessoa("123");
Pessoa p2 = new Pessoa("123");

// p1.equals(p2) == true
p1.hashCode() == p2.hashCode(); // DEVE ser true ✅
```

**Inverso NÃO é verdadeiro**:
```java
// p1.hashCode() == p2.hashCode()
p1.equals(p2); // Pode ser false (colisão de hash)
```

### 2. Baseie em Mesmos Atributos

**equals()** e **hashCode()** devem usar **mesmos atributos**.

```java
public class Pessoa {
    private String cpf;
    private String nome;
    
    // ✅ CORRETO: ambos usam cpf
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Pessoa p)) return false;
        return cpf.equals(p.cpf); // Usa cpf
    }
    
    @Override
    public int hashCode() {
        return cpf.hashCode(); // Usa cpf ✅
    }
}
```

```java
// ❌ ERRO: atributos diferentes
@Override
public boolean equals(Object obj) {
    return cpf.equals(((Pessoa) obj).cpf); // Usa cpf
}

@Override
public int hashCode() {
    return nome.hashCode(); // Usa nome ❌
}
```

### 3. Problema: Sobrescrever Apenas equals()

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

Pessoa p1 = new Pessoa("123");
Pessoa p2 = new Pessoa("123");

p1.equals(p2); // true

// hashCode() usa implementação de Object (baseada em memória)
p1.hashCode() == p2.hashCode(); // false ❌ (viola contrato)
```

### 4. Problema em HashMap

**HashMap** usa hashCode() para localizar objetos.

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
mapa.get(p2); // null ❌ (hashCode diferente, bucket errado)
```

### 5. Problema em HashSet

**HashSet** usa equals() e hashCode() para detectar duplicatas.

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

Set<Pessoa> set = new HashSet<>();
set.add(new Pessoa("123"));
set.add(new Pessoa("123"));

set.size(); // 2 ❌ (duplicata não detectada)
```

### 6. Colisão de Hash (Válida)

**hashCode() iguais** não garantem **equals() true**.

```java
Pessoa p1 = new Pessoa("123");
Pessoa p2 = new Pessoa("456");

// Colisão (hashCode igual, mas objetos diferentes)
p1.hashCode() == p2.hashCode(); // true (colisão)
p1.equals(p2);                  // false ✅ (válido)
```

**HashMap** trata colisões usando **equals()**.

### 7. Implementação Consistente

**Objects.hash()** garante consistência.

```java
import java.util.Objects;

public class Pessoa {
    private String nome;
    private int idade;
    private String cpf;
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Pessoa p)) return false;
        return Objects.equals(nome, p.nome) &&
               idade == p.idade &&
               Objects.equals(cpf, p.cpf);
    }
    
    @Override
    public int hashCode() {
        // ✅ Mesmos atributos
        return Objects.hash(nome, idade, cpf);
    }
}
```

### 8. Subclasses e Contrato

**Subclasses** devem manter contrato.

```java
public class Animal {
    private String nome;
    
    @Override
    public boolean equals(Object obj) {
        if (obj == null || getClass() != obj.getClass()) return false;
        Animal a = (Animal) obj;
        return nome.equals(a.nome);
    }
    
    @Override
    public int hashCode() {
        return nome.hashCode();
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
    
    @Override
    public int hashCode() {
        // ✅ Incluir super.hashCode()
        int result = super.hashCode();
        result = 31 * result + raca.hashCode();
        return result;
    }
}
```

### 9. Atributos Mutáveis (Problema)

**Modificar atributos** altera hashCode().

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
p.setNome("Maria");

set.contains(p); // false ❌ (hashCode mudou, bucket errado)
```

**Solução**: Use **atributos imutáveis** (final).

### 10. Teste de Contrato

```java
@Test
void testContratoEqualsHashCode() {
    Pessoa p1 = new Pessoa("123");
    Pessoa p2 = new Pessoa("123");
    
    // Se equals() == true
    if (p1.equals(p2)) {
        // hashCode() DEVE ser igual
        assertEquals(p1.hashCode(), p2.hashCode());
    }
}
```

---

## Aplicabilidade

**Sempre respeite contrato quando**:
- Sobrescrever **equals()**
- Usar objetos em **HashMap, HashSet, Hashtable**
- Trabalhar com **collections** baseadas em hash

**Contrato é obrigatório** para:
- Funcionamento correto de **HashMap, HashSet**
- Detectar **duplicatas** em Set
- Buscar objetos em **hash-based collections**

---

## Armadilhas

### 1. Sobrescrever Apenas equals()

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
mapa.put(new Pessoa("123"), "João");
mapa.get(new Pessoa("123")); // null ❌
```

### 2. Sobrescrever Apenas hashCode()

```java
public class Pessoa {
    private String cpf;
    
    @Override
    public int hashCode() {
        return cpf.hashCode();
    }
    
    // ❌ FALTANDO equals()
}

Set<Pessoa> set = new HashSet<>();
set.add(new Pessoa("123"));
set.add(new Pessoa("123"));

set.size(); // 2 ❌ (duplicata não detectada)
```

### 3. Atributos Diferentes

```java
public class Pessoa {
    private String cpf;
    private String nome;
    
    @Override
    public boolean equals(Object obj) {
        return cpf.equals(((Pessoa) obj).cpf); // Usa cpf
    }
    
    @Override
    public int hashCode() {
        return nome.hashCode(); // ❌ Usa nome
    }
}

Pessoa p1 = new Pessoa("123", "João");
Pessoa p2 = new Pessoa("123", "Maria");

p1.equals(p2); // true
p1.hashCode() == p2.hashCode(); // false ❌ (viola contrato)
```

### 4. Modificar Objeto em HashSet

```java
Pessoa p = new Pessoa("João");
Set<Pessoa> set = new HashSet<>();
set.add(p);

// ❌ Modificar altera hashCode()
p.setNome("Maria");

set.contains(p); // false ❌ (objeto em bucket errado)
set.remove(p);   // false ❌ (não consegue remover)
```

### 5. hashCode() Inconsistente

```java
@Override
public int hashCode() {
    // ❌ Retorna valor diferente a cada chamada
    return new Random().nextInt();
}

Pessoa p = new Pessoa("123");
Map<Pessoa, String> mapa = new HashMap<>();
mapa.put(p, "João");

mapa.get(p); // null ❌ (hashCode mudou)
```

### 6. Subclasse Não Sobrescreve hashCode()

```java
public class Animal {
    private String nome;
    
    @Override
    public boolean equals(Object obj) {
        return nome.equals(((Animal) obj).nome);
    }
    
    @Override
    public int hashCode() {
        return nome.hashCode();
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    @Override
    public boolean equals(Object obj) {
        return super.equals(obj) && raca.equals(((Cachorro) obj).raca);
    }
    
    // ❌ FALTANDO hashCode()
}

Cachorro c1 = new Cachorro("Rex", "Labrador");
Cachorro c2 = new Cachorro("Rex", "Poodle");

c1.equals(c2); // false
c1.hashCode() == c2.hashCode(); // true ❌ (inconsistente)
```

---

## Boas Práticas

### 1. Sempre Sobrescreva Ambos

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

### 2. Use Objects.hash() e Objects.equals()

```java
import java.util.Objects;

@Override
public boolean equals(Object obj) {
    if (!(obj instanceof Pessoa p)) return false;
    return Objects.equals(cpf, p.cpf);
}

@Override
public int hashCode() {
    return Objects.hash(cpf);
}
```

### 3. Use Mesmos Atributos

```java
// ✅ equals() e hashCode() usam cpf, nome, idade
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof Pessoa p)) return false;
    return Objects.equals(cpf, p.cpf) &&
           Objects.equals(nome, p.nome) &&
           idade == p.idade;
}

@Override
public int hashCode() {
    return Objects.hash(cpf, nome, idade); // Mesmos atributos
}
```

### 4. Use Atributos Imutáveis

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

### 6. Teste Contrato

```java
@Test
void testContratoEqualsHashCode() {
    Pessoa p1 = new Pessoa("123");
    Pessoa p2 = new Pessoa("123");
    
    assertTrue(p1.equals(p2));
    assertEquals(p1.hashCode(), p2.hashCode());
}
```

### 7. Não Modifique Objetos em HashSet/HashMap

```java
// ❌ EVITE
Pessoa p = new Pessoa("João");
set.add(p);
p.setNome("Maria"); // Altera hashCode()

// ✅ FAÇA
set.remove(p); // Remove antes
p.setNome("Maria");
set.add(p);    // Adiciona novamente
```

### 8. Subclasses: Chame super.hashCode()

```java
@Override
public int hashCode() {
    int result = super.hashCode();
    result = 31 * result + atributoSubclasse.hashCode();
    return result;
}
```

---

## Resumo

**Contrato equals() e hashCode()**:
```java
// Regra: x.equals(y) → x.hashCode() == y.hashCode()

@Override
public boolean equals(Object obj) {
    if (!(obj instanceof Pessoa p)) return false;
    return cpf.equals(p.cpf);
}

@Override
public int hashCode() {
    return cpf.hashCode(); // Mesmo atributo ✅
}
```

**Problema: Só equals()**:
```java
// ❌ Faltando hashCode()
Map<Pessoa, String> mapa = new HashMap<>();
mapa.put(new Pessoa("123"), "João");
mapa.get(new Pessoa("123")); // null ❌
```

**Objects.hash()**:
```java
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof Pessoa p)) return false;
    return Objects.equals(cpf, p.cpf) && idade == p.idade;
}

@Override
public int hashCode() {
    return Objects.hash(cpf, idade); // Mesmos atributos
}
```

**Colisão de hash (válida)**:
```java
p1.hashCode() == p2.hashCode(); // true
p1.equals(p2);                  // false ✅ (válido)
```

**Subclasses**:
```java
@Override
public int hashCode() {
    int result = super.hashCode();
    result = 31 * result + atributo.hashCode();
    return result;
}
```

**Teste de contrato**:
```java
if (p1.equals(p2)) {
    assertEquals(p1.hashCode(), p2.hashCode());
}
```

**Atributos imutáveis**:
```java
private final String cpf; // ✅ Nunca muda hashCode()
```

**Regra de Ouro**: **Sempre sobrescreva equals() e hashCode() juntos**. Use **mesmos atributos**. Use **Objects.hash()** e **Objects.equals()**. **Não modifique** objetos em HashSet/HashMap.
