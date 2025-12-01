# T4.03 - Anotação @Override

## Introdução

**@Override** é anotação que **indica intenção de sobrescrever** método.

**Compilador valida** se método realmente sobrescreve método da superclasse.

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    // ✅ @Override valida sobrescrita
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
    
    // ❌ ERRO: método não existe na superclasse
    /*
    @Override
    public void latir() {
        System.out.println("Au au!");
    }
    */
}
```

---

## Fundamentos

### 1. Propósito de @Override

**Indicar intenção** de sobrescrever e **validar** em compile-time.

```java
public class Funcionario {
    public double calcularSalario() {
        return 1000.0;
    }
}

public class Gerente extends Funcionario {
    @Override
    public double calcularSalario() { // ✅ Compilador valida
        return 5000.0;
    }
}
```

**Sem @Override**: Erro de digitação pode criar **novo método**.

```java
public class Gerente extends Funcionario {
    // ❌ Erro de digitação: método NOVO (não sobrescreve)
    public double calcularSalaryo() { // "Salaryo" em vez de "Salario"
        return 5000.0;
    }
}
```

**Com @Override**: Compilador **detecta erro**.

```java
public class Gerente extends Funcionario {
    // ✅ ERRO de compilação: método não existe em Funcionario
    @Override
    public double calcularSalaryo() { // Compilador recusa
        return 5000.0;
    }
}
```

### 2. @Override É Opcional

**Sobrescrita funciona** sem @Override, mas **não é recomendado**.

```java
public class Cachorro extends Animal {
    // ✅ Funciona (mas não recomendado)
    public void emitirSom() {
        System.out.println("Au au!");
    }
}
```

**Problema**: **Sem validação** do compilador.

### 3. Validações de @Override

**Compilador verifica**:
1. Método existe na superclasse ou interface
2. Assinatura é idêntica
3. Tipo de retorno é compatível
4. Modificador de acesso é válido
5. Exceções são compatíveis

```java
public class Animal {
    public void mover(int velocidade) { }
}

public class Cachorro extends Animal {
    // ✅ ERRO detectado: parâmetro diferente
    @Override
    public void mover(double velocidade) { } // ERRO de compilação
}
```

### 4. @Override com Interfaces

**@Override valida** implementação de métodos de **interface**.

```java
public interface Voador {
    void voar();
}

public class Passaro implements Voador {
    @Override
    public void voar() { // ✅ Valida implementação
        System.out.println("Voando...");
    }
}
```

### 5. @Override com Múltiplos Níveis de Herança

**@Override valida** em **qualquer nível** da hierarquia.

```java
public class Animal {
    public void respirar() {
        System.out.println("Respirando...");
    }
}

public class Mamifero extends Animal {
    @Override
    public void respirar() {
        System.out.println("Respirando profundamente");
    }
}

public class Cachorro extends Mamifero {
    @Override
    public void respirar() { // Valida contra Mamifero e Animal
        System.out.println("Cachorro respirando");
    }
}
```

### 6. Erro Comum: Método Não Existe

```java
public class Funcionario {
    public void trabalhar() { }
}

public class Gerente extends Funcionario {
    // ❌ ERRO: método não existe em Funcionario
    @Override
    public void gerenciar() { } // Compilador recusa
}
```

### 7. Erro: Assinatura Diferente

```java
public class Base {
    public void processar(String texto) { }
}

public class Derivada extends Base {
    // ❌ ERRO: parâmetro diferente (int vs String)
    @Override
    public void processar(int numero) { } // Compilador recusa
}
```

### 8. Mudança na Superclasse

**@Override detecta refatoração** na superclasse.

```java
// Versão 1
public class Animal {
    public void emitirSom() { }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() { } // ✅ OK
}

// Versão 2: método renomeado
public class Animal {
    public void fazerSom() { } // Renomeado
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() { } // ❌ ERRO: método não existe mais
}
```

**@Override força refatoração** na subclasse também.

### 9. @Override com Métodos default de Interface (Java 8+)

```java
public interface Falante {
    default void falar() {
        System.out.println("Falando...");
    }
}

public class Pessoa implements Falante {
    @Override
    public void falar() { // ✅ Sobrescreve método default
        System.out.println("Pessoa falando");
    }
}
```

### 10. @Override NÃO Funciona com Métodos static

**Métodos static não são sobrescritos** (são "hidden").

```java
public class Base {
    public static void metodoEstatico() { }
}

public class Derivada extends Base {
    // ❌ ERRO: não pode usar @Override com static
    @Override
    public static void metodoEstatico() { } // Compilador recusa
}
```

---

## Aplicabilidade

**Use @Override sempre que**:
- Sobrescrever método de superclasse
- Implementar método de interface
- Sobrescrever método default de interface
- Trabalhar em hierarquias complexas

**Benefícios**:
- Detecta erros de digitação
- Valida refatoração
- Documenta intenção
- Melhora legibilidade
- Facilita manutenção

---

## Armadilhas

### 1. Esquecer @Override

```java
public class Cachorro extends Animal {
    // ❌ Erro de digitação não detectado
    public void emitirSon() { // "Son" em vez de "Som"
        System.out.println("Au au!");
    }
}
```

### 2. @Override com Método Inexistente

```java
public class Derivada extends Base {
    // ❌ ERRO de compilação
    @Override
    public void metodoInexistente() { }
}
```

### 3. @Override com Assinatura Errada

```java
public class Base {
    public void metodo(String s) { }
}

public class Derivada extends Base {
    // ❌ ERRO: parâmetro diferente
    @Override
    public void metodo(int i) { }
}
```

### 4. @Override com static

```java
public class Base {
    public static void metodo() { }
}

public class Derivada extends Base {
    // ❌ ERRO: @Override não funciona com static
    @Override
    public static void metodo() { }
}
```

---

## Boas Práticas

### 1. SEMPRE Use @Override

```java
// ✅ SEMPRE
@Override
public void metodo() {
    // ...
}

// ❌ NUNCA omita
public void metodo() {
    // ...
}
```

### 2. Configure IDE Para Avisar

**IntelliJ IDEA, Eclipse, VS Code**: Configurar para **avisar** quando @Override está faltando.

**Settings → Editor → Inspections → @Override annotation**

### 3. Use com Interfaces

```java
public interface Processador {
    void processar();
}

public class ProcessadorImpl implements Processador {
    @Override // ✅ Valida implementação
    public void processar() {
        // ...
    }
}
```

### 4. @Override em Todos os Níveis

```java
public class A {
    public void metodo() { }
}

public class B extends A {
    @Override
    public void metodo() { } // ✅
}

public class C extends B {
    @Override
    public void metodo() { } // ✅
}
```

### 5. Combine com super Para Reutilização

```java
@Override
public void processar() {
    super.processar(); // Reutiliza lógica
    // Adiciona comportamento específico
}
```

---

## Resumo

**@Override**:
```java
@Override
public void metodo() {
    // Compilador valida sobrescrita
}
```

**Propósito**:
- **Indicar intenção** de sobrescrever
- **Validar** em compile-time
- **Detectar erros** de digitação
- **Facilitar refatoração**

**Validações**:
1. Método existe na superclasse/interface
2. Assinatura idêntica
3. Tipo de retorno compatível
4. Modificador de acesso válido
5. Exceções compatíveis

**Funciona com**:
```java
// Métodos de superclasse
@Override
public void metodoSuper() { }

// Métodos de interface
@Override
public void metodoInterface() { }

// Métodos default de interface (Java 8+)
@Override
public void metodoDefault() { }
```

**NÃO funciona com**:
```java
// Métodos static
public static void metodo() { } // Sem @Override

// Métodos private (não herdados)
private void metodo() { } // Sem @Override
```

**Erros detectados**:
```java
// Método inexistente
@Override
public void metodoNaoExiste() { } // ❌ ERRO

// Assinatura errada
@Override
public void metodo(int x) { } // ❌ ERRO (se superclasse tem String)

// Modificador incompatível
@Override
private void metodo() { } // ❌ ERRO (se superclasse é public)
```

**Benefícios**:
- ✅ Detecta erros em compile-time
- ✅ Documenta intenção
- ✅ Facilita manutenção
- ✅ Valida refatoração
- ✅ Melhora legibilidade

**Regra de Ouro**: **SEMPRE use @Override** ao sobrescrever métodos. Configure IDE para avisar quando estiver faltando.
