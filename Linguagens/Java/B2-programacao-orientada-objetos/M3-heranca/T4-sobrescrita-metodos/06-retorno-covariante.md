# T4.06 - Tipo de Retorno Covariante

## Introdução

**Tipo de retorno covariante** permite método sobrescrito retornar **subclasse** do tipo original.

**Java 5+** permite **covariância** de tipo de retorno.

```java
public class Animal {
    public Animal reproduzir() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    // ✅ Retorno covariante: Cachorro extends Animal
    @Override
    public Cachorro reproduzir() {
        return new Cachorro();
    }
}

// Uso
Cachorro c = new Cachorro();
Cachorro filhote = c.reproduzir(); // ✅ Sem casting
```

**Antes do Java 5**: Tipo de retorno **tinha que ser idêntico**.

---

## Fundamentos

### 1. Covariância Definida

**Covariância**: Retorno pode ser **tipo mais específico** (subclasse).

```java
public class Veiculo {
    public Veiculo criar() {
        return new Veiculo();
    }
}

public class Carro extends Veiculo {
    @Override
    public Carro criar() { // ✅ Carro é subclasse de Veiculo
        return new Carro();
    }
}
```

### 2. Benefício: Elimina Casting

**Sem covariância** (antes Java 5):
```java
public class Animal {
    public Animal reproduzir() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    @Override
    public Animal reproduzir() { // ✅ Tipo idêntico
        return new Cachorro();
    }
}

// Uso
Cachorro c = new Cachorro();
Cachorro filhote = (Cachorro) c.reproduzir(); // ❌ Casting necessário
```

**Com covariância** (Java 5+):
```java
public class Cachorro extends Animal {
    @Override
    public Cachorro reproduzir() { // ✅ Tipo covariante
        return new Cachorro();
    }
}

// Uso
Cachorro c = new Cachorro();
Cachorro filhote = c.reproduzir(); // ✅ Sem casting
```

### 3. Tipo Deve Ser Subclasse

**Retorno deve estender** o tipo original.

```java
public class Forma {
    public Forma copiar() {
        return new Forma();
    }
}

public class Circulo extends Forma {
    @Override
    public Circulo copiar() { // ✅ Circulo extends Forma
        return new Circulo();
    }
}

public class Quadrado extends Forma {
    // ❌ ERRO: Quadrado não é subclasse de Circulo
    /*
    @Override
    public Circulo copiar() {
        return new Circulo();
    }
    */
}
```

### 4. Retorno Idêntico Continua Válido

**Não é obrigatório** usar covariância.

```java
public class Animal {
    public Animal reproduzir() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    // ✅ Tipo idêntico (sempre válido)
    @Override
    public Animal reproduzir() {
        return new Cachorro();
    }
    
    // ✅ Tipo covariante (também válido)
    @Override
    public Cachorro reproduzir() {
        return new Cachorro();
    }
}
```

### 5. Hierarquia Profunda

**Covariância funciona** em múltiplos níveis.

```java
public class Animal {
    public Animal reproduzir() {
        return new Animal();
    }
}

public class Mamifero extends Animal {
    @Override
    public Mamifero reproduzir() { // Mamifero extends Animal ✅
        return new Mamifero();
    }
}

public class Cachorro extends Mamifero {
    @Override
    public Cachorro reproduzir() { // Cachorro extends Mamifero ✅
        return new Cachorro();
    }
}
```

### 6. Tipos Primitivos NÃO São Covariantes

**Primitivos devem ser idênticos**.

```java
public class Base {
    public int calcular() {
        return 10;
    }
}

public class Derivada extends Base {
    // ✅ int idêntico
    @Override
    public int calcular() {
        return 20;
    }
    
    // ❌ ERRO: long não é covariante de int
    /*
    @Override
    public long calcular() {
        return 20L;
    }
    */
}
```

### 7. Wrapper Classes NÃO São Covariantes de Primitivos

```java
public class Base {
    public int calcular() {
        return 10;
    }
}

public class Derivada extends Base {
    // ❌ ERRO: Integer não é covariante de int
    /*
    @Override
    public Integer calcular() {
        return 10;
    }
    */
}
```

### 8. Arrays Não São Covariantes em Retorno

```java
public class Base {
    public Object[] obter() {
        return new Object[0];
    }
}

public class Derivada extends Base {
    // ❌ ERRO: String[] não é covariante de Object[]
    /*
    @Override
    public String[] obter() {
        return new String[0];
    }
    */
    
    // ✅ Tipo idêntico
    @Override
    public Object[] obter() {
        return new String[0]; // Retorna String[] como Object[]
    }
}
```

### 9. Generics e Covariância

**Generics são invariantes**, não covariantes.

```java
public class Base {
    public List<Object> obter() {
        return new ArrayList<>();
    }
}

public class Derivada extends Base {
    // ❌ ERRO: List<String> não é covariante de List<Object>
    /*
    @Override
    public List<String> obter() {
        return new ArrayList<>();
    }
    */
    
    // ✅ Tipo idêntico
    @Override
    public List<Object> obter() {
        return new ArrayList<>();
    }
}
```

### 10. Clone e Covariância

**clone()** é exemplo clássico de covariância.

```java
public class Animal implements Cloneable {
    @Override
    public Animal clone() {
        try {
            return (Animal) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}

public class Cachorro extends Animal {
    @Override
    public Cachorro clone() { // ✅ Covariante
        return (Cachorro) super.clone();
    }
}

// Uso
Cachorro c = new Cachorro();
Cachorro copia = c.clone(); // ✅ Sem casting
```

---

## Aplicabilidade

**Use covariância quando**:
- Método retorna instância da própria classe
- Quer evitar casting no código cliente
- Método fábrica ou builder
- Clone, copiar, duplicar

**Exemplos práticos**:
- `clone()`
- `criar()`, `copiar()`
- Factory methods
- Builder pattern

---

## Armadilhas

### 1. Tipo Não Relacionado

```java
public class Animal {
    public Animal reproduzir() {
        return new Animal();
    }
}

public class Carro {
    // ❌ ERRO: Carro não extends Animal
    @Override
    public Carro reproduzir() {
        return new Carro();
    }
}
```

### 2. Usar Superclasse Como Retorno

```java
public class Forma {
    public Forma copiar() {
        return new Forma();
    }
}

public class Circulo extends Forma {
    // ❌ ERRO: Forma é superclasse de Circulo
    /*
    @Override
    public Forma copiar() {
        return new Forma(); // Não é covariante
    }
    */
    
    // ✅ CORRETO: Circulo é subclasse
    @Override
    public Circulo copiar() {
        return new Circulo();
    }
}
```

### 3. Generics Invariantes

```java
public class Base {
    public List<Number> obter() {
        return new ArrayList<>();
    }
}

public class Derivada extends Base {
    // ❌ ERRO: List<Integer> ≠ List<Number>
    /*
    @Override
    public List<Integer> obter() {
        return new ArrayList<>();
    }
    */
}
```

---

## Boas Práticas

### 1. Use Covariância Para Eliminar Casting

```java
// ✅ Com covariância
public Cachorro reproduzir() {
    return new Cachorro();
}

// Uso
Cachorro filhote = c.reproduzir(); // Sem casting
```

### 2. Clone Sempre Covariante

```java
@Override
public MinhaClasse clone() {
    return (MinhaClasse) super.clone();
}
```

### 3. Factory Methods com Covariância

```java
public abstract class Forma {
    public abstract Forma criar();
}

public class Circulo extends Forma {
    @Override
    public Circulo criar() { // ✅ Covariante
        return new Circulo();
    }
}
```

### 4. Documente Covariância

```java
/**
 * Retorna nova instância de Cachorro.
 * @return nova instância (tipo covariante)
 */
@Override
public Cachorro reproduzir() {
    return new Cachorro();
}
```

### 5. Builder Pattern com Covariância

```java
public abstract class Builder<T> {
    public abstract T build();
}

public class CarroBuilder extends Builder<Carro> {
    @Override
    public Carro build() { // ✅ Covariante
        return new Carro();
    }
}
```

---

## Resumo

**Tipo de Retorno Covariante** (Java 5+):
```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    @Override
    public Cachorro criar() { // ✅ Cachorro extends Animal
        return new Cachorro();
    }
}
```

**Benefício**:
```java
// Sem casting
Cachorro c = new Cachorro().criar();
```

**Regras**:
1. Retorno deve ser **subclasse** do tipo original
2. Tipo **idêntico** sempre válido
3. **Primitivos** devem ser idênticos
4. **Generics** são invariantes (List<String> ≠ List<Object>)
5. **Arrays** não são covariantes em retorno

**Exemplos válidos**:
```java
Animal   → Animal   ✅
Animal   → Cachorro ✅ (Cachorro extends Animal)
Number   → Integer  ✅ (Integer extends Number)
Object   → String   ✅ (String extends Object)
```

**Exemplos inválidos**:
```java
Cachorro → Animal   ❌ (superclasse)
int      → long     ❌ (primitivos devem ser idênticos)
List<Object> → List<String> ❌ (generics invariantes)
Object[] → String[] ❌ (arrays não covariantes)
```

**Clone covariante**:
```java
@Override
public MinhaClasse clone() {
    return (MinhaClasse) super.clone();
}

// Uso sem casting
MinhaClasse copia = obj.clone();
```

**Hierarquia**:
```java
Animal → Mamifero → Cachorro
  ↓         ↓          ↓
Animal  Mamifero  Cachorro  (retornos covariantes)
```

**Regra de Ouro**: Retorno pode ser **tipo mais específico** (subclasse), nunca **mais genérico** (superclasse). Use para **eliminar casting**.
