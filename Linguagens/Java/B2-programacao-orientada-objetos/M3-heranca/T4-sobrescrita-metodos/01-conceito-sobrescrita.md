# T4.01 - Conceito de Sobrescrita de Métodos (Override)

## Introdução

**Sobrescrita (Override)** é quando **subclasse redefine método da superclasse**.

**Objetivo**: **Alterar ou estender comportamento** herdado.

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    // Sobrescrita
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

// Uso
Animal animal = new Animal();
animal.emitirSom();  // "Som genérico"

Cachorro cachorro = new Cachorro();
cachorro.emitirSom(); // "Au au!" ← Método sobrescrito
```

---

## Fundamentos

### 1. Definição de Sobrescrita

**Subclasse fornece nova implementação** para método herdado.

```java
public class Veiculo {
    public void acelerar() {
        System.out.println("Acelerando...");
    }
}

public class Carro extends Veiculo {
    @Override
    public void acelerar() {
        System.out.println("Carro acelerando rapidamente!");
    }
}
```

**Polimorfismo**: Método executado depende do **tipo real** do objeto.

### 2. Por Que Sobrescrever?

**Especializar comportamento** da superclasse.

```java
public class Funcionario {
    protected String nome;
    protected double salarioBase;
    
    public double calcularSalario() {
        return salarioBase;
    }
}

public class Gerente extends Funcionario {
    private double bonus;
    
    @Override
    public double calcularSalario() {
        return salarioBase + bonus; // Comportamento especializado
    }
}
```

### 3. Vinculação Dinâmica (Dynamic Binding)

**Método executado é decidido em runtime**, não compile-time.

```java
Funcionario f1 = new Funcionario();
Funcionario f2 = new Gerente(); // Polimorfismo

f1.calcularSalario(); // Chama Funcionario.calcularSalario()
f2.calcularSalario(); // Chama Gerente.calcularSalario() ← Runtime
```

**JVM determina** qual método executar baseado no **tipo real** do objeto.

### 4. Assinatura Deve Ser Idêntica

**Nome, parâmetros e tipo de retorno** (ou covariante) devem corresponder.

```java
public class Animal {
    public void mover(int velocidade) {
        System.out.println("Movendo a " + velocidade);
    }
}

public class Cachorro extends Animal {
    // ✅ Sobrescrita correta
    @Override
    public void mover(int velocidade) {
        System.out.println("Cachorro correndo a " + velocidade);
    }
    
    // ❌ NÃO é sobrescrita (parâmetro diferente) - é SOBRECARGA
    public void mover(double velocidade) {
        System.out.println("Movendo...");
    }
}
```

### 5. Anotação @Override

**@Override indica intenção** de sobrescrever. Compilador **valida**.

```java
public class Gato extends Animal {
    // ✅ Compilador verifica se existe emitirSom() em Animal
    @Override
    public void emitirSom() {
        System.out.println("Miau!");
    }
    
    // ❌ ERRO: método não existe na superclasse
    /*
    @Override
    public void fazerBarulho() {
        System.out.println("Barulho");
    }
    */
}
```

**Benefícios**:
- Detecta erros de digitação
- Garante que superclasse possui o método
- Facilita refatoração

### 6. Modificador de Acesso

**Modificador de acesso NÃO pode ser mais restritivo**.

```java
public class Base {
    public void metodo() { }
}

public class Derivada extends Base {
    // ✅ CORRETO: public → public
    @Override
    public void metodo() { }
    
    // ❌ ERRO: public → private (mais restritivo)
    /*
    @Override
    private void metodo() { }
    */
}
```

**Ordem de restrição**: `private` < `default` < `protected` < `public`

### 7. Chamar Método da Superclasse com super

**super.metodo()** chama versão da superclasse.

```java
public class Empregado {
    protected double salario;
    
    public void aumentarSalario(double percentual) {
        salario += salario * percentual;
        System.out.println("Salário aumentado");
    }
}

public class Gerente extends Empregado {
    @Override
    public void aumentarSalario(double percentual) {
        super.aumentarSalario(percentual); // Reutiliza lógica
        System.out.println("Bônus adicional de gerente");
    }
}
```

### 8. Sobrescrita em Múltiplos Níveis

**Cada nível** da hierarquia pode sobrescrever.

```java
public class Animal {
    public void dormir() {
        System.out.println("Animal dormindo");
    }
}

public class Mamifero extends Animal {
    @Override
    public void dormir() {
        System.out.println("Mamífero dormindo profundamente");
    }
}

public class Cachorro extends Mamifero {
    @Override
    public void dormir() {
        System.out.println("Cachorro dormindo em posição engraçada");
    }
}

// Uso
Animal a = new Cachorro();
a.dormir(); // "Cachorro dormindo em posição engraçada"
```

### 9. Métodos Que NÃO Podem Ser Sobrescritos

**final, static, private** não podem ser sobrescritos.

```java
public class Base {
    // ❌ Não pode sobrescrever
    public final void metodoFinal() { }
    
    // ❌ Não pode sobrescrever (static não usa polimorfismo)
    public static void metodoEstatico() { }
    
    // ❌ Não pode sobrescrever (não é herdado)
    private void metodoPrivado() { }
}

public class Derivada extends Base {
    // ❌ ERRO: não pode sobrescrever final
    /*
    @Override
    public void metodoFinal() { }
    */
    
    // Não é sobrescrita, é NOVO método estático
    public static void metodoEstatico() { }
    
    // Não é sobrescrita, é NOVO método
    private void metodoPrivado() { }
}
```

### 10. Exceções em Sobrescrita

**Método sobrescrito pode**:
- Não lançar exceção
- Lançar **mesma** exceção
- Lançar **subclasse** da exceção
- **NÃO pode** lançar exceção **mais genérica**

```java
public class Base {
    public void metodo() throws IOException {
        // ...
    }
}

public class Derivada extends Base {
    // ✅ CORRETO: não lança exceção
    @Override
    public void metodo() {
        // ...
    }
    
    // ✅ CORRETO: lança mesma exceção
    @Override
    public void metodo() throws IOException {
        // ...
    }
    
    // ✅ CORRETO: lança subclasse (FileNotFoundException extends IOException)
    @Override
    public void metodo() throws FileNotFoundException {
        // ...
    }
    
    // ❌ ERRO: Exception é mais genérica que IOException
    /*
    @Override
    public void metodo() throws Exception {
        // ...
    }
    */
}
```

---

## Aplicabilidade

**Use sobrescrita quando**:
- Subclasse precisa **alterar comportamento** herdado
- Implementar **polimorfismo**
- Especializar método para **tipo específico**

**Exemplos práticos**:
- `toString()` em classes customizadas
- `equals()` e `hashCode()` para comparação
- Métodos de lógica de negócio (calcular, validar, processar)

---

## Armadilhas

### 1. Esquecer @Override

```java
public class Cachorro extends Animal {
    // ❌ PERIGO: erro de digitação não detectado
    public void emitirSon() { // "Son" em vez de "Som"
        System.out.println("Au au!");
    }
    
    // ✅ CORRETO: @Override detecta erro
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}
```

### 2. Modificador Mais Restritivo

```java
public class Base {
    public void metodo() { }
}

public class Derivada extends Base {
    // ❌ ERRO: public → protected
    @Override
    protected void metodo() { }
}
```

### 3. Sobrescrita vs Sobrecarga

```java
public class Animal {
    public void mover(int velocidade) { }
}

public class Cachorro extends Animal {
    // ❌ Não é sobrescrita (parâmetro diferente)
    public void mover(double velocidade) { }
    
    // ✅ Sobrescrita
    @Override
    public void mover(int velocidade) { }
}
```

### 4. Tentar Sobrescrever Método final

```java
public class Base {
    public final void metodo() { }
}

public class Derivada extends Base {
    // ❌ ERRO: não pode sobrescrever final
    @Override
    public void metodo() { }
}
```

---

## Boas Práticas

### 1. Sempre Use @Override

```java
@Override
public void metodo() {
    // Compilador valida sobrescrita
}
```

### 2. Reutilize Lógica com super

```java
@Override
public void processar() {
    super.processar(); // Reutiliza lógica da superclasse
    // Adiciona comportamento específico
}
```

### 3. Documente Mudanças de Comportamento

```java
/**
 * Sobrescreve calcularSalario() para adicionar bônus de gerente.
 */
@Override
public double calcularSalario() {
    return super.calcularSalario() + bonus;
}
```

### 4. Mantenha Assinatura Idêntica

```java
// Superclasse
public void processar(String dado) { }

// Subclasse
@Override
public void processar(String dado) { // Parâmetro idêntico
    // ...
}
```

### 5. Respeite Contrato da Superclasse

```java
public class Retangulo {
    public int calcularArea() {
        return largura * altura;
    }
}

public class Quadrado extends Retangulo {
    @Override
    public int calcularArea() {
        // Mantém contrato: retorna área
        return lado * lado;
    }
}
```

---

## Resumo

**Sobrescrita (Override)**:
```java
public class Superclasse {
    public void metodo() {
        System.out.println("Superclasse");
    }
}

public class Subclasse extends Superclasse {
    @Override  // ← Anotação obrigatória (boa prática)
    public void metodo() {
        System.out.println("Subclasse");
    }
}
```

**Características**:
- **Assinatura idêntica** (nome, parâmetros, tipo retorno ou covariante)
- **Modificador de acesso** igual ou mais permissivo
- **Vinculação dinâmica** (runtime)
- **@Override** valida sobrescrita
- **super.metodo()** chama versão da superclasse

**Não podem ser sobrescritos**:
```java
public final void metodoFinal() { }      // final
public static void metodoEstatico() { }  // static
private void metodoPrivado() { }         // private
```

**Sobrescrita vs Sobrecarga**:
```java
// Sobrescrita: mesma assinatura
@Override
public void metodo(int x) { }

// Sobrecarga: parâmetros diferentes
public void metodo(double x) { }
```

**Exceções**:
```java
// Superclasse
public void metodo() throws IOException { }

// Subclasse pode:
@Override
public void metodo() { }                           // Sem exceção
@Override
public void metodo() throws IOException { }        // Mesma exceção
@Override
public void metodo() throws FileNotFoundException { } // Subclasse

// ❌ NÃO pode:
// @Override
// public void metodo() throws Exception { }       // Mais genérica
```

**Polimorfismo**:
```java
Animal animal = new Cachorro();
animal.emitirSom(); // Chama Cachorro.emitirSom() ← Runtime
```

**Regra de Ouro**: **@Override sempre**, **assinatura idêntica**, **modificador igual ou mais permissivo**. Use **super** para reutilizar lógica da superclasse.
