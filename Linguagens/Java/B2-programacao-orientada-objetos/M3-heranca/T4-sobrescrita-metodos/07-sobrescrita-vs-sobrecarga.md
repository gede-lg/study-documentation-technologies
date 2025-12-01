# T4.07 - Sobrescrita vs Sobrecarga

## Introdução

**Sobrescrita (Override)** e **Sobrecarga (Overload)** são conceitos **diferentes**.

**Sobrescrita**: Subclasse **redefine** método herdado (mesma assinatura).

**Sobrecarga**: Mesma classe possui **múltiplos métodos** com mesmo nome (assinaturas diferentes).

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    // SOBRESCRITA: redefine método da superclasse
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
    
    // SOBRECARGA: mesmo nome, parâmetros diferentes
    public void emitirSom(int intensidade) {
        System.out.println("Au au! (intensidade: " + intensidade + ")");
    }
}
```

---

## Fundamentos

### 1. Sobrescrita (Override)

**Características**:
- **Herança** requerida (subclasse)
- **Assinatura idêntica**
- **Runtime** (polimorfismo)
- **@Override**

```java
public class Base {
    public void metodo() {
        System.out.println("Base");
    }
}

public class Derivada extends Base {
    @Override
    public void metodo() { // Sobrescrita
        System.out.println("Derivada");
    }
}

// Uso
Base b = new Derivada();
b.metodo(); // "Derivada" ← Runtime
```

### 2. Sobrecarga (Overload)

**Características**:
- **Mesma classe** (ou herdada)
- **Assinaturas diferentes** (parâmetros)
- **Compile-time**
- Sem @Override

```java
public class Calculadora {
    // Sobrecarga: mesmo nome, parâmetros diferentes
    public int somar(int a, int b) {
        return a + b;
    }
    
    public double somar(double a, double b) {
        return a + b;
    }
    
    public int somar(int a, int b, int c) {
        return a + b + c;
    }
}

// Uso
Calculadora c = new Calculadora();
c.somar(1, 2);       // somar(int, int)
c.somar(1.5, 2.5);   // somar(double, double)
c.somar(1, 2, 3);    // somar(int, int, int)
```

### 3. Diferenças Principais

| Aspecto | Sobrescrita | Sobrecarga |
|---------|-------------|------------|
| **Relação** | Herança (superclasse/subclasse) | Mesma classe |
| **Assinatura** | Idêntica | Diferente |
| **Resolução** | Runtime (polimorfismo) | Compile-time |
| **@Override** | Sim | Não |
| **Tipo retorno** | Idêntico ou covariante | Qualquer |
| **Modificador** | ≥ superclasse | Qualquer |

### 4. Sobrescrita: Polimorfismo em Runtime

**Método executado** depende do **tipo real** do objeto.

```java
Animal a1 = new Animal();
Animal a2 = new Cachorro(); // Polimorfismo

a1.emitirSom(); // Animal.emitirSom()
a2.emitirSom(); // Cachorro.emitirSom() ← Runtime
```

### 5. Sobrecarga: Resolução em Compile-Time

**Método executado** depende dos **parâmetros**.

```java
Calculadora c = new Calculadora();

c.somar(1, 2);     // int, int    → somar(int, int)
c.somar(1.0, 2.0); // double, double → somar(double, double)
```

Compilador **escolhe método** baseado em **tipos de argumentos**.

### 6. Sobrescrita Requer Herança

```java
public class A {
    public void metodo() { }
}

public class B extends A {
    @Override
    public void metodo() { } // ✅ Sobrescrita (herança)
}

// Sem herança
public class C {
    public void metodo() { } // Não é sobrescrita
}
```

### 7. Sobrecarga Pode Estar na Mesma Classe

```java
public class Impressora {
    public void imprimir(String texto) { }
    public void imprimir(int numero) { }
    public void imprimir(String texto, int copias) { }
}
```

### 8. Sobrecarga em Hierarquia

**Subclasse pode sobrecarregar** método herdado.

```java
public class Animal {
    public void mover(int velocidade) {
        System.out.println("Movendo a " + velocidade);
    }
}

public class Cachorro extends Animal {
    // SOBRESCRITA
    @Override
    public void mover(int velocidade) {
        System.out.println("Cachorro correndo a " + velocidade);
    }
    
    // SOBRECARGA (parâmetros diferentes)
    public void mover(String direcao) {
        System.out.println("Movendo para " + direcao);
    }
}
```

### 9. Sobrecarga: Tipo de Retorno Irrelevante

**Tipo de retorno** não diferencia sobrecarga.

```java
public class Calculadora {
    public int calcular(int x) {
        return x * 2;
    }
    
    // ❌ ERRO: mesma assinatura (tipo de retorno não importa)
    /*
    public double calcular(int x) {
        return x * 2.0;
    }
    */
    
    // ✅ CORRETO: parâmetro diferente
    public double calcular(double x) {
        return x * 2.0;
    }
}
```

### 10. Ambos Podem Coexistir

**Mesma classe** pode ter **sobrescrita E sobrecarga**.

```java
public class Animal {
    public void fazer(String acao) {
        System.out.println("Animal fazendo: " + acao);
    }
}

public class Cachorro extends Animal {
    // SOBRESCRITA: redefine fazer(String)
    @Override
    public void fazer(String acao) {
        System.out.println("Cachorro fazendo: " + acao);
    }
    
    // SOBRECARGA: novo método fazer(String, int)
    public void fazer(String acao, int vezes) {
        for (int i = 0; i < vezes; i++) {
            fazer(acao);
        }
    }
}
```

---

## Aplicabilidade

**Use Sobrescrita quando**:
- Alterar comportamento herdado
- Implementar polimorfismo
- Especializar método para subclasse

**Use Sobrecarga quando**:
- Mesma operação com diferentes parâmetros
- Múltiplas formas de fazer a mesma coisa
- Construtores com diferentes inicializações

---

## Armadilhas

### 1. Confundir Sobrecarga com Sobrescrita

```java
public class Animal {
    public void mover(int velocidade) { }
}

public class Cachorro extends Animal {
    // ❌ NÃO é sobrescrita (parâmetro diferente)
    public void mover(double velocidade) { } // Sobrecarga
    
    // ✅ Sobrescrita
    @Override
    public void mover(int velocidade) { }
}
```

### 2. Esquecer @Override

```java
public class Cachorro extends Animal {
    // ❌ Erro de digitação não detectado
    public void emitirSon() { } // "Son" em vez de "Som"
    
    // ✅ @Override detecta erro
    @Override
    public void emitirSom() { }
}
```

### 3. Sobrecarga: Tipo de Retorno Diferente

```java
public class Calculadora {
    public int calcular(int x) { return x; }
    
    // ❌ ERRO: mesma assinatura
    // public double calcular(int x) { return x; }
}
```

---

## Boas Práticas

### 1. Use @Override Para Sobrescrita

```java
@Override
public void metodo() {
    // Valida sobrescrita
}
```

### 2. Documente Sobrecarga

```java
/**
 * Processa texto simples.
 */
public void processar(String texto) { }

/**
 * Processa texto com opções.
 */
public void processar(String texto, boolean maiusculas) { }
```

### 3. Nomeie Sobrecarga de Forma Clara

```java
// ✅ Claro
public void imprimir(String texto) { }
public void imprimirComCopias(String texto, int copias) { }

// ❌ Confuso (sobrecarga excessiva)
public void processar(String s) { }
public void processar(int i) { }
public void processar(String s, int i) { }
```

### 4. Combine Sobrescrita e Sobrecarga com Cuidado

```java
public class Base {
    public void metodo(String s) { }
}

public class Derivada extends Base {
    @Override
    public void metodo(String s) { } // Sobrescrita
    
    public void metodo(int i) { }    // Sobrecarga
}
```

### 5. Sobrecarga: Delegue Para Método Mais Completo

```java
public void processar(String texto) {
    processar(texto, false); // Delega
}

public void processar(String texto, boolean maiusculas) {
    // Implementação completa
}
```

---

## Resumo

**Sobrescrita (Override)**:
```java
public class Animal {
    public void mover() { }
}

public class Cachorro extends Animal {
    @Override
    public void mover() { } // Mesma assinatura
}
```

**Características**:
- **Herança** requerida
- **Assinatura idêntica**
- **Runtime** (polimorfismo)
- **@Override**

**Sobrecarga (Overload)**:
```java
public class Calculadora {
    public int somar(int a, int b) { }
    public double somar(double a, double b) { }
    public int somar(int a, int b, int c) { }
}
```

**Características**:
- **Mesma classe**
- **Assinaturas diferentes**
- **Compile-time**
- Sem @Override

**Tabela Comparativa**:
```
┌─────────────┬──────────────┬─────────────┐
│ Aspecto     │ Sobrescrita  │ Sobrecarga  │
├─────────────┼──────────────┼─────────────┤
│ Herança     │ Necessária   │ Opcional    │
│ Assinatura  │ Idêntica     │ Diferente   │
│ Resolução   │ Runtime      │ Compile-time│
│ @Override   │ Sim          │ Não         │
│ Polimorfismo│ Sim          │ Não         │
└─────────────┴──────────────┴─────────────┘
```

**Exemplo Combinado**:
```java
public class Animal {
    public void fazer(String acao) { }
}

public class Cachorro extends Animal {
    @Override
    public void fazer(String acao) { }        // Sobrescrita
    
    public void fazer(String acao, int x) { } // Sobrecarga
}
```

**Runtime vs Compile-time**:
```java
// Sobrescrita: Runtime
Animal a = new Cachorro();
a.metodo(); // Cachorro.metodo() ← Runtime

// Sobrecarga: Compile-time
Calculadora c = new Calculadora();
c.somar(1, 2);    // somar(int, int)    ← Compile-time
c.somar(1.0, 2.0); // somar(double, double) ← Compile-time
```

**Regra de Ouro**: **Sobrescrita = mesma assinatura + herança + polimorfismo**. **Sobrecarga = mesmo nome + assinaturas diferentes**.
