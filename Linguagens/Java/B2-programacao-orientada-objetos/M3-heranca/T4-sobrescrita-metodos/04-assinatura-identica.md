# T4.04 - Assinatura Idêntica em Sobrescrita

## Introdução

**Assinatura do método** deve ser **exatamente igual** à da superclasse.

**Assinatura** = **nome** + **lista de parâmetros** (tipos, ordem, quantidade).

```java
public class Animal {
    public void mover(String direcao, int velocidade) { }
}

public class Cachorro extends Animal {
    // ✅ Assinatura idêntica
    @Override
    public void mover(String direcao, int velocidade) { }
    
    // ❌ NÃO é sobrescrita (parâmetros diferentes) - é SOBRECARGA
    public void mover(int velocidade) { }
}
```

**Tipo de retorno NÃO faz parte da assinatura** (mas deve ser compatível).

---

## Fundamentos

### 1. Componentes da Assinatura

**Assinatura** = **nome do método** + **parâmetros**.

```java
// Assinatura: processar(String, int)
public void processar(String texto, int numero) { }

// Assinatura: processar(int, String)  ← Diferente
public void processar(int numero, String texto) { }

// Assinatura: processar(String, int, boolean)  ← Diferente
public void processar(String texto, int numero, boolean flag) { }
```

### 2. Nome Idêntico

**Nome deve ser exatamente igual**.

```java
public class Base {
    public void calcular() { }
}

public class Derivada extends Base {
    // ✅ Nome idêntico
    @Override
    public void calcular() { }
    
    // ❌ Nome diferente (não é sobrescrita)
    public void calcula() { } // Sem @Override
}
```

### 3. Quantidade de Parâmetros Idêntica

**Número de parâmetros** deve ser igual.

```java
public class Animal {
    public void mover(int velocidade) { }
}

public class Cachorro extends Animal {
    // ✅ 1 parâmetro
    @Override
    public void mover(int velocidade) { }
    
    // ❌ 2 parâmetros (não é sobrescrita)
    public void mover(int velocidade, String direcao) { }
    
    // ❌ 0 parâmetros (não é sobrescrita)
    public void mover() { }
}
```

### 4. Tipo de Parâmetros Idêntico

**Tipos devem corresponder exatamente**.

```java
public class Base {
    public void processar(String texto) { }
}

public class Derivada extends Base {
    // ✅ String (tipo idêntico)
    @Override
    public void processar(String texto) { }
    
    // ❌ Object (tipo diferente, mesmo sendo superclasse)
    public void processar(Object texto) { }
    
    // ❌ Integer (tipo diferente)
    public void processar(Integer numero) { }
}
```

### 5. Ordem de Parâmetros Idêntica

**Ordem importa**.

```java
public class Calculadora {
    public int dividir(int dividendo, int divisor) {
        return dividendo / divisor;
    }
}

public class CalculadoraAvancada extends Calculadora {
    // ✅ Ordem correta
    @Override
    public int dividir(int dividendo, int divisor) {
        return dividendo / divisor;
    }
    
    // ❌ Ordem invertida (não é sobrescrita)
    public int dividir(int divisor, int dividendo) {
        return dividendo / divisor;
    }
}
```

### 6. Nomes de Parâmetros NÃO Importam

**Nomes** podem ser diferentes (não fazem parte da assinatura).

```java
public class Animal {
    public void mover(int velocidade) { }
}

public class Cachorro extends Animal {
    // ✅ Nome do parâmetro diferente (OK)
    @Override
    public void mover(int vel) { }
    
    // ✅ Nome diferente também
    @Override
    public void mover(int v) { }
}
```

### 7. Tipo de Retorno NÃO Faz Parte da Assinatura

**Tipo de retorno** não identifica assinatura, mas **deve ser compatível**.

```java
public class Animal {
    public Animal reproduzir() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    // ✅ Tipo de retorno covariante (permitido)
    @Override
    public Cachorro reproduzir() {
        return new Cachorro();
    }
}
```

**Mas assinatura continua sendo** `reproduzir()` (sem parâmetros).

### 8. Modificadores NÃO Fazem Parte da Assinatura

**public, protected, private, final, static** não são parte da assinatura.

```java
public class Base {
    public void metodo() { }
}

public class Derivada extends Base {
    // ✅ Modificador diferente (permitido se mais permissivo)
    @Override
    public void metodo() { } // Assinatura idêntica
}
```

### 9. Exceções NÃO Fazem Parte da Assinatura

**throws** não faz parte da assinatura.

```java
import java.io.*;

public class Leitor {
    public void ler() throws IOException { }
}

public class LeitorSeguro extends Leitor {
    // ✅ Sem throws (assinatura continua idêntica)
    @Override
    public void ler() { }
}
```

### 10. Varargs e Assinatura

**Varargs** é tratado como **array** na assinatura.

```java
public class Base {
    public void processar(String... textos) { }
}

public class Derivada extends Base {
    // ✅ Varargs (idêntico)
    @Override
    public void processar(String... textos) { }
    
    // ✅ Array (equivalente a varargs)
    @Override
    public void processar(String[] textos) { }
}
```

**String...** ≡ **String[]**

---

## Aplicabilidade

**Assinatura idêntica garante**:
- Polimorfismo funciona corretamente
- Método correto é chamado em runtime
- Compatibilidade com código existente

**Validação**:
- Compilador verifica assinatura com **@Override**
- Evita erros de sobrecarga acidental

---

## Armadilhas

### 1. Ordem de Parâmetros Errada

```java
public class Base {
    public void metodo(String s, int i) { }
}

public class Derivada extends Base {
    // ❌ Ordem invertida (não é sobrescrita)
    public void metodo(int i, String s) { }
}
```

### 2. Tipo de Parâmetro Diferente

```java
public class Base {
    public void processar(String texto) { }
}

public class Derivada extends Base {
    // ❌ Object ≠ String (não é sobrescrita)
    public void processar(Object texto) { }
}
```

### 3. Quantidade de Parâmetros Diferente

```java
public class Base {
    public void metodo(int x) { }
}

public class Derivada extends Base {
    // ❌ 2 parâmetros vs 1 (não é sobrescrita)
    public void metodo(int x, int y) { }
}
```

### 4. Confundir com Sobrecarga

```java
public class Animal {
    public void mover(int velocidade) { }
}

public class Cachorro extends Animal {
    // Sobrescrita
    @Override
    public void mover(int velocidade) { }
    
    // Sobrecarga (método adicional)
    public void mover(String direcao) { }
}
```

---

## Boas Práticas

### 1. Use @Override Para Validar Assinatura

```java
@Override
public void metodo(String s, int i) {
    // Compilador valida assinatura
}
```

### 2. Copie Assinatura da Superclasse

**IDE**: Use **Ctrl+O** (IntelliJ/Eclipse) para **sobrescrever método**.

```java
// IDE gera automaticamente com assinatura correta
@Override
public void metodo(String texto, int numero) {
    super.metodo(texto, numero);
}
```

### 3. Documente Assinatura Complexa

```java
/**
 * Sobrescreve processar(String, int, boolean).
 * @param texto entrada textual
 * @param quantidade número de processamentos
 * @param ativo flag de ativação
 */
@Override
public void processar(String texto, int quantidade, boolean ativo) {
    // ...
}
```

### 4. Mantenha Nomes de Parâmetros Consistentes

```java
// Superclasse
public void calcular(int valorInicial, int valorFinal) { }

// Subclasse: mesmos nomes (legibilidade)
@Override
public void calcular(int valorInicial, int valorFinal) {
    // ...
}
```

### 5. Evite Sobrecarga Acidental

```java
public class Base {
    public void metodo(int x) { }
}

public class Derivada extends Base {
    // ✅ Sobrescrita (int)
    @Override
    public void metodo(int x) { }
    
    // ✅ Sobrecarga intencional (double)
    public void metodo(double x) {
        // Claramente diferente
    }
}
```

---

## Resumo

**Assinatura do Método**:
```
nome(tipo1, tipo2, tipo3, ...)
```

**Componentes da assinatura**:
1. **Nome do método**
2. **Quantidade de parâmetros**
3. **Tipo de cada parâmetro**
4. **Ordem dos parâmetros**

**NÃO fazem parte da assinatura**:
- Nome dos parâmetros
- Tipo de retorno
- Modificadores (public, protected, private)
- Exceções (throws)

**Exemplos**:
```java
// Assinatura: processar(String, int)
public void processar(String texto, int numero) { }
public int processar(String dado, int valor) { }   // Mesma assinatura ✅
public void processar(int numero, String texto) { } // Diferente ❌

// Assinatura: calcular()
public double calcular() { }
public int calcular() { }    // Mesma assinatura (ERRO) ❌
public void calcular(int x) { } // Diferente ✅
```

**Sobrescrita**:
```java
public class Animal {
    public void mover(String direcao, int velocidade) { }
}

public class Cachorro extends Animal {
    // ✅ Assinatura idêntica
    @Override
    public void mover(String direcao, int velocidade) { }
}
```

**Varargs**:
```java
public void metodo(String... args) { }
// Equivalente a:
public void metodo(String[] args) { }
```

**Validação**:
```java
@Override  // ← Compilador valida assinatura
public void metodo(String s, int i) { }
```

**Regra de Ouro**: **Nome + parâmetros (tipos, ordem, quantidade) devem ser EXATAMENTE iguais**. Use **@Override** para validar.
