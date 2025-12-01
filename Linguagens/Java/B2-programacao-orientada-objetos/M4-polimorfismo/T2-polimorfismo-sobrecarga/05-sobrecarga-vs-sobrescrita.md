# T2.05 - Sobrecarga vs Sobrescrita

## Introdução

**Sobrecarga (Overloading)**: múltiplos métodos com **mesmo nome**, diferentes **parâmetros**, **mesma classe**.

**Sobrescrita (Overriding)**: método na **subclasse** redefine método da **superclasse**, **mesma assinatura**.

```java
// SOBRECARGA: mesmo nome, parâmetros diferentes
public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }
    
    public double somar(double a, double b) { // Sobrecarga
        return a + b;
    }
}

// SOBRESCRITA: subclasse redefine método da superclasse
public class Animal {
    public void som() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() { // Sobrescrita
        System.out.println("Au au");
    }
}
```

**Diferenças principais**:
- **Sobrecarga**: compile-time, mesma classe, parâmetros diferentes
- **Sobrescrita**: runtime, herança, mesma assinatura

---

## Fundamentos

### 1. Sobrecarga: Mesma Classe

**Sobrecarga** ocorre na **mesma classe**.

```java
public class Impressora {
    // Sobrecarga: mesma classe, parâmetros diferentes
    public void imprimir(String texto) {
        System.out.println("Texto: " + texto);
    }
    
    public void imprimir(int numero) {
        System.out.println("Número: " + numero);
    }
    
    public void imprimir(String texto, int vezes) {
        for (int i = 0; i < vezes; i++) {
            System.out.println(texto);
        }
    }
}
```

### 2. Sobrescrita: Herança

**Sobrescrita** requer **herança** (extends).

```java
public class Veiculo {
    public void mover() {
        System.out.println("Veículo se movendo");
    }
}

public class Carro extends Veiculo {
    @Override
    public void mover() { // Sobrescrita
        System.out.println("Carro dirigindo");
    }
}

public class Aviao extends Veiculo {
    @Override
    public void mover() { // Sobrescrita
        System.out.println("Avião voando");
    }
}
```

### 3. Parâmetros: Diferentes vs Idênticos

**Sobrecarga**: parâmetros **diferentes**.
**Sobrescrita**: parâmetros **idênticos**.

```java
// SOBRECARGA
public class Teste {
    public void metodo(int a) { }
    public void metodo(double a) { } // Parâmetros diferentes
}

// SOBRESCRITA
public class Animal {
    public void som() { }
}
public class Cachorro extends Animal {
    @Override
    public void som() { } // Parâmetros idênticos (nenhum)
}
```

### 4. Resolução: Compile-Time vs Runtime

**Sobrecarga**: compile-time (early binding).
**Sobrescrita**: runtime (late binding).

```java
// SOBRECARGA: compile-time
Calculadora calc = new Calculadora();
calc.somar(5, 10);     // Compilador: somar(int, int)
calc.somar(5.5, 10.2); // Compilador: somar(double, double)

// SOBRESCRITA: runtime
Animal a = new Cachorro(); // Tipo referência: Animal
a.som(); // Runtime: Cachorro.som()
```

### 5. Tipo de Retorno

**Sobrecarga**: tipo de retorno **pode** ser diferente, mas **não diferencia**.
**Sobrescrita**: tipo de retorno **igual ou subtipo** (covariância).

```java
// SOBRECARGA
public class Teste {
    public int metodo(int a) { return a; }
    public double metodo(double a) { return a; } // Tipo diferente OK
    
    // ❌ Erro: apenas tipo de retorno diferente
    public double metodo(int a) { return a; } // Erro!
}

// SOBRESCRITA
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}
public class Cachorro extends Animal {
    @Override
    public Cachorro criar() { // Tipo covariante OK
        return new Cachorro();
    }
}
```

### 6. Modificador de Acesso

**Sobrecarga**: modificador **não importa**.
**Sobrescrita**: modificador **igual ou mais permissivo**.

```java
// SOBRECARGA
public class Teste {
    public void metodo(int a) { }
    private void metodo(double a) { } // OK: diferentes parâmetros
}

// SOBRESCRITA
public class Animal {
    protected void som() { }
}
public class Cachorro extends Animal {
    @Override
    public void som() { } // OK: protected → public
    
    // ❌ Erro: reduzir visibilidade
    // @Override
    // private void som() { } // Erro: public → private
}
```

### 7. Palavra-chave @Override

**Sobrecarga**: @Override **não** é usada.
**Sobrescrita**: @Override **recomendada**.

```java
// SOBRECARGA: sem @Override
public class Calculadora {
    public int somar(int a, int b) { return a + b; }
    public double somar(double a, double b) { return a + b; }
}

// SOBRESCRITA: com @Override
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 8. Métodos static

**Sobrecarga**: métodos static **podem** ser sobrecarregados.
**Sobrescrita**: métodos static **não** são sobrescritos (hiding).

```java
// SOBRECARGA: OK
public class Teste {
    public static void metodo(int a) { }
    public static void metodo(double a) { } // OK
}

// SOBRESCRITA: Hiding (não é sobrescrita)
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}
public class Cachorro extends Animal {
    public static void info() { // Hiding, não sobrescrita
        System.out.println("Cachorro");
    }
}

Animal.info();    // "Animal"
Cachorro.info();  // "Cachorro"
Animal a = new Cachorro();
a.info(); // "Animal" - tipo da referência, não polimorfismo
```

### 9. Métodos final

**Sobrecarga**: métodos final **podem** ser sobrecarregados.
**Sobrescrita**: métodos final **não** podem ser sobrescritos.

```java
// SOBRECARGA: OK
public class Teste {
    public final void metodo(int a) { }
    public final void metodo(double a) { } // OK
}

// SOBRESCRITA: Erro
public class Animal {
    public final void respirar() { }
}
public class Cachorro extends Animal {
    // ❌ Erro: não pode sobrescrever final
    // @Override
    // public void respirar() { }
}
```

### 10. Polimorfismo

**Sobrecarga**: polimorfismo **estático** (compile-time).
**Sobrescrita**: polimorfismo **dinâmico** (runtime).

```java
// SOBRECARGA: estático
Calculadora calc = new Calculadora();
calc.somar(5, 10);     // Tipo conhecido em compile-time
calc.somar(5.5, 10.2); // Tipo conhecido em compile-time

// SOBRESCRITA: dinâmico
Animal a1 = new Cachorro();
Animal a2 = new Gato();
Animal a3 = new Passaro();

a1.som(); // Runtime: Cachorro.som()
a2.som(); // Runtime: Gato.som()
a3.som(); // Runtime: Passaro.som()
```

---

## Aplicabilidade

**Use sobrecarga quando**:
- **Mesma operação** com diferentes tipos de entrada
- **Mesma classe**
- **Flexibilidade** na chamada
- **API consistente** (mesmo nome)

**Use sobrescrita quando**:
- **Especializar comportamento** em subclasses
- **Polimorfismo** (processar diferentes tipos uniformemente)
- **Implementar métodos abstratos**
- **Template Method Pattern**

---

## Armadilhas

### 1. Confundir Sobrecarga com Sobrescrita

```java
public class Animal {
    public void som() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    // ⚠️ Sobrecarga (não sobrescrita)
    public void som(String tipo) {
        System.out.println(tipo + ": Au au");
    }
}

Cachorro c = new Cachorro();
c.som();        // Chama Animal.som() - herdado
c.som("Latido"); // Chama Cachorro.som(String) - sobrecarga
```

### 2. Esquecer @Override

```java
public class Animal {
    public void som() { }
}

public class Cachorro extends Animal {
    // ⚠️ Sem @Override: erro não detectado
    public void soM() { // Typo (M maiúsculo)
        System.out.println("Au au");
    }
}

// Resultado: método não sobrescrito, criou novo método
```

### 3. Modificador de Acesso em Sobrescrita

```java
public class Animal {
    public void som() { }
}

public class Cachorro extends Animal {
    // ❌ Erro: reduzir visibilidade
    @Override
    protected void som() { }
}
```

### 4. Métodos static Não São Sobrescritos

```java
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void info() { // Hiding
        System.out.println("Cachorro");
    }
}

Animal a = new Cachorro();
a.info(); // "Animal" - não é polimorfismo
```

### 5. Tipo de Retorno em Sobrecarga

```java
// ❌ Erro: apenas tipo de retorno diferente
public class Teste {
    public int metodo(int a) { return a; }
    public double metodo(int a) { return a; } // Erro!
}
```

### 6. Sobrescrita Requer Mesma Assinatura

```java
public class Animal {
    public void mover(int distancia) { }
}

public class Cachorro extends Animal {
    // ⚠️ Sobrecarga (não sobrescrita)
    public void mover(double distancia) { } // Tipo diferente
}
```

---

## Boas Práticas

### 1. Use @Override para Sobrescrita

```java
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 2. Delegação em Sobrecarga

```java
public class Conexao {
    // Mais completo
    public void conectar(String host, int porta, int timeout) {
        System.out.println("Conectando...");
    }
    
    // Delegação
    public void conectar(String host, int porta) {
        conectar(host, porta, 5000);
    }
    
    public void conectar(String host) {
        conectar(host, 8080, 5000);
    }
}
```

### 3. Reutilize Código em Sobrescrita

```java
public class Funcionario {
    protected double salarioBase;
    
    public double calcularSalario() {
        return salarioBase;
    }
}

public class Gerente extends Funcionario {
    private double bonus;
    
    @Override
    public double calcularSalario() {
        return super.calcularSalario() + bonus; // Reutiliza
    }
}
```

### 4. Tabela Comparativa

| Aspecto | Sobrecarga | Sobrescrita |
|---------|-----------|-------------|
| **Classe** | Mesma classe | Subclasse |
| **Parâmetros** | Diferentes | Idênticos |
| **Tipo retorno** | Pode ser diferente | Igual ou subtipo |
| **Resolução** | Compile-time | Runtime |
| **Polimorfismo** | Estático | Dinâmico |
| **@Override** | Não usa | Recomendada |
| **Modificador acesso** | Não importa | Igual ou mais permissivo |
| **static** | Pode | Não (hiding) |
| **final** | Pode | Não pode |
| **private** | Pode | Não visível |

### 5. Exemplo Combinado

```java
public class Forma {
    // Sobrecarga
    public double calcularArea(double lado) {
        return lado * lado; // Quadrado
    }
    
    public double calcularArea(double largura, double altura) {
        return largura * altura; // Retângulo
    }
}

public class Circulo extends Forma {
    // Sobrescrita
    @Override
    public double calcularArea(double raio) {
        return Math.PI * raio * raio;
    }
}
```

### 6. Strategy Pattern com Sobrescrita

```java
public abstract class OrdenacaoStrategy {
    public abstract void ordenar(int[] array);
}

public class BubbleSort extends OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação Bubble Sort
    }
}

public class QuickSort extends OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação Quick Sort
    }
}
```

### 7. Template Method com Sobrescrita

```java
public abstract class Relatorio {
    // Template method (final)
    public final void gerar() {
        inicializar();
        carregarDados();   // Sobrescrito
        processar();       // Sobrescrito
        salvar();
    }
    
    protected void inicializar() { }
    protected abstract void carregarDados();
    protected abstract void processar();
    protected void salvar() { }
}

public class RelatorioVendas extends Relatorio {
    @Override
    protected void carregarDados() {
        System.out.println("Carregando vendas");
    }
    
    @Override
    protected void processar() {
        System.out.println("Processando vendas");
    }
}
```

---

## Resumo

**Sobrecarga**:
```java
// Mesma classe, parâmetros diferentes
public void metodo(int a) { }
public void metodo(double a) { }
public void metodo(int a, int b) { }
```

**Sobrescrita**:
```java
// Subclasse, mesma assinatura
public class Animal {
    public void som() { }
}
public class Cachorro extends Animal {
    @Override
    public void som() { }
}
```

**Diferenças principais**:

| Aspecto | Sobrecarga | Sobrescrita |
|---------|-----------|-------------|
| Classe | Mesma | Subclasse (herança) |
| Parâmetros | Diferentes | Idênticos |
| Resolução | Compile-time | Runtime |
| Polimorfismo | Estático | Dinâmico |
| @Override | Não | Sim (recomendada) |
| static | Pode sobrecarregar | Hiding (não sobrescrita) |
| final | Pode sobrecarregar | Não pode sobrescrever |

**Compile-time vs Runtime**:
```java
// Sobrecarga: compile-time
calc.somar(5, 10);     // Compilador decide
calc.somar(5.5, 10.2); // Compilador decide

// Sobrescrita: runtime
Animal a = new Cachorro();
a.som(); // JVM decide em runtime
```

**Tipo de retorno**:
```java
// Sobrecarga: pode ser diferente (mas não diferencia)
public int metodo(int a) { }
public double metodo(double a) { }

// Sobrescrita: igual ou subtipo (covariância)
public Animal criar() { }
@Override
public Cachorro criar() { } // OK: subtipo
```

**Quando usar**:
- **Sobrecarga**: mesma operação, tipos diferentes, mesma classe
- **Sobrescrita**: especializar comportamento, polimorfismo, herança

**Regra de Ouro**: **Sobrecarga** = mesma classe, parâmetros diferentes, compile-time. **Sobrescrita** = herança, mesma assinatura, runtime. Use **@Override** para sobrescrita. **Sobrecarga** é flexibilidade; **sobrescrita** é polimorfismo.
