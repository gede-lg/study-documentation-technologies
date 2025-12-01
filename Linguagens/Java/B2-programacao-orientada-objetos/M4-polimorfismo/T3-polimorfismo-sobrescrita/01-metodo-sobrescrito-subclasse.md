# T3.01 - Método Sobrescrito na Subclasse

## Introdução

**Sobrescrita (Overriding)**: subclasse **redefine** método da superclasse com **mesma assinatura**.

```java
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

Animal a = new Cachorro();
a.som(); // "Au au" - método da subclasse
```

**Mesma assinatura**:
- **Mesmo nome**
- **Mesmos parâmetros** (quantidade, tipo, ordem)
- **Tipo de retorno igual ou subtipo** (covariância)

**Objetivo**: especializar comportamento herdado, implementar **polimorfismo dinâmico**.

---

## Fundamentos

### 1. Mesma Assinatura

Método sobrescrito deve ter **mesma assinatura**.

```java
public class Forma {
    public double calcularArea() {
        return 0.0;
    }
}

public class Circulo extends Forma {
    private double raio;
    
    // ✅ Mesma assinatura
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}
```

### 2. Herança Necessária

Sobrescrita requer **herança** (extends).

```java
// ✅ Com herança
public class Animal {
    public void mover() { }
}

public class Cachorro extends Animal {
    @Override
    public void mover() { } // OK
}

// ❌ Sem herança
public class Gato {
    // Não pode sobrescrever sem extends Animal
}
```

### 3. Comportamento Especializado

Subclasse **especializa** comportamento da superclasse.

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
        return salarioBase + bonus; // Comportamento especializado
    }
}

public class Vendedor extends Funcionario {
    private double comissao;
    
    @Override
    public double calcularSalario() {
        return salarioBase + comissao; // Comportamento especializado
    }
}
```

### 4. Tipo de Retorno Covariante

Método sobrescrito pode retornar **subtipo** (covariância).

```java
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

### 5. Modificador de Acesso Igual ou Mais Permissivo

Método sobrescrito **não pode reduzir** visibilidade.

```java
public class Animal {
    protected void respirar() { }
}

public class Cachorro extends Animal {
    // ✅ OK: protected → public
    @Override
    public void respirar() { }
    
    // ❌ Erro: protected → private
    // @Override
    // private void respirar() { }
}
```

### 6. Polimorfismo Dinâmico

Método chamado é **determinado em runtime** pelo tipo do objeto.

```java
Animal a1 = new Cachorro();
Animal a2 = new Gato();
Animal a3 = new Passaro();

a1.som(); // Runtime: Cachorro.som()
a2.som(); // Runtime: Gato.som()
a3.som(); // Runtime: Passaro.som()
```

### 7. Métodos final Não Podem Ser Sobrescritos

Método **final** impede sobrescrita.

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

public class Cachorro extends Animal {
    // ❌ Erro: não pode sobrescrever final
    // @Override
    // public void respirar() { }
}
```

### 8. Métodos static Não São Sobrescritos

Método **static** não participa de polimorfismo (hiding).

```java
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

### 9. Métodos private Não São Herdados

Método **private** não é visível para subclasse.

```java
public class Animal {
    private void metabolismo() {
        System.out.println("Metabolismo");
    }
}

public class Cachorro extends Animal {
    // ⚠️ NÃO é sobrescrita (método não herdado)
    private void metabolismo() {
        System.out.println("Metabolismo cachorro");
    }
}
```

### 10. Exception em Sobrescrita

Método sobrescrito pode declarar **mesmas exceptions ou subtipos**, mas **não pode adicionar** checked exceptions mais amplas.

```java
public class Repositorio {
    public void salvar() throws IOException {
        // Salvar dados
    }
}

public class RepositorioArquivo extends Repositorio {
    // ✅ OK: subtipo de IOException
    @Override
    public void salvar() throws FileNotFoundException {
        // Implementação
    }
    
    // ❌ Erro: Exception mais ampla
    // @Override
    // public void salvar() throws Exception { }
}
```

---

## Aplicabilidade

**Use sobrescrita quando**:
- **Especializar** comportamento herdado
- **Polimorfismo** (processar diferentes tipos uniformemente)
- **Implementar** métodos abstratos
- **Template Method Pattern**
- **Strategy Pattern**

**Evite sobrescrita quando**:
- Método é **final** (não pode)
- Método é **static** (hiding, não sobrescrita)
- Método é **private** (não herdado)
- **Composição** é mais apropriada

---

## Armadilhas

### 1. Esquecer @Override

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

Cachorro c = new Cachorro();
c.som(); // Chama Animal.som() - não sobrescreveu
```

### 2. Reduzir Visibilidade

```java
public class Animal {
    public void mover() { }
}

public class Cachorro extends Animal {
    // ❌ Erro: reduzir visibilidade
    @Override
    protected void mover() { }
}
```

### 3. Parâmetros Diferentes

```java
public class Animal {
    public void mover(int distancia) { }
}

public class Cachorro extends Animal {
    // ⚠️ NÃO é sobrescrita (parâmetros diferentes)
    public void mover(double distancia) { }
}

Cachorro c = new Cachorro();
c.mover(10);   // Animal.mover(int)
c.mover(10.5); // Cachorro.mover(double)
```

### 4. Tipo de Retorno Incompatível

```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    // ❌ Erro: String não é subtipo de Animal
    // @Override
    // public String criar() { }
}
```

### 5. Checked Exception Mais Ampla

```java
public class Repositorio {
    public void salvar() throws IOException { }
}

public class RepositorioArquivo extends Repositorio {
    // ❌ Erro: Exception mais ampla
    // @Override
    // public void salvar() throws Exception { }
}
```

### 6. Confundir Sobrescrita com Sobrecarga

```java
public class Animal {
    public void som() { }
}

public class Cachorro extends Animal {
    // ⚠️ Sobrecarga (não sobrescrita)
    public void som(String tipo) {
        System.out.println(tipo);
    }
}

Cachorro c = new Cachorro();
c.som();        // Animal.som() - herdado
c.som("Latido"); // Cachorro.som(String) - sobrecarga
```

### 7. Métodos static

```java
public class Animal {
    public static void categoria() {
        System.out.println("Mamífero");
    }
}

public class Cachorro extends Animal {
    // ⚠️ Hiding (não sobrescrita)
    public static void categoria() {
        System.out.println("Canino");
    }
}

Animal a = new Cachorro();
a.categoria(); // "Mamífero" - não é polimorfismo
```

---

## Boas Práticas

### 1. Sempre Use @Override

```java
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 2. Reutilize Código da Superclasse

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

### 3. Template Method Pattern

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

### 4. Strategy Pattern

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

public class Contexto {
    private OrdenacaoStrategy strategy;
    
    public void executar(int[] array) {
        strategy.ordenar(array); // Polimorfismo
    }
}
```

### 5. Documentação com Javadoc

```java
public class Animal {
    /**
     * Emite som característico do animal.
     */
    public void som() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    /**
     * {@inheritDoc}
     * <p>
     * Implementação específica para cachorro.
     */
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 6. Validação em Métodos Sobrescritos

```java
public class Forma {
    public void setLado(double lado) {
        this.lado = lado;
    }
}

public class Quadrado extends Forma {
    @Override
    public void setLado(double lado) {
        if (lado <= 0) {
            throw new IllegalArgumentException("Lado deve ser > 0");
        }
        super.setLado(lado);
    }
}
```

### 7. Equals e HashCode

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Pessoa pessoa = (Pessoa) obj;
        return idade == pessoa.idade && 
               Objects.equals(nome, pessoa.nome);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(nome, idade);
    }
}
```

### 8. ToString

```java
public class Animal {
    protected String especie;
    
    @Override
    public String toString() {
        return "Animal[especie=" + especie + "]";
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    @Override
    public String toString() {
        return "Cachorro[especie=" + especie + ", raca=" + raca + "]";
    }
}
```

### 9. Comparable

```java
public class Funcionario implements Comparable<Funcionario> {
    private String nome;
    private double salario;
    
    @Override
    public int compareTo(Funcionario outro) {
        return Double.compare(this.salario, outro.salario);
    }
}
```

### 10. Clone

```java
public class Pessoa implements Cloneable {
    private String nome;
    private int idade;
    
    @Override
    public Pessoa clone() {
        try {
            return (Pessoa) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```

---

## Resumo

**Sobrescrita**: subclasse **redefine** método da superclasse com **mesma assinatura**.

```java
public class Animal {
    public void som() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

**Requisitos**:
- **Herança** (extends)
- **Mesma assinatura** (nome + parâmetros)
- **Tipo de retorno igual ou subtipo** (covariância)
- **Modificador de acesso igual ou mais permissivo**

**Polimorfismo dinâmico**:
```java
Animal a = new Cachorro();
a.som(); // Runtime: Cachorro.som()
```

**Restrições**:
- Métodos **final** não podem ser sobrescritos
- Métodos **static** não participam (hiding)
- Métodos **private** não são herdados
- **Não pode reduzir** visibilidade
- **Não pode adicionar** checked exceptions mais amplas

**@Override**:
```java
@Override
public void metodo() { } // Recomendado
```

**Exceptions**:
```java
// ✅ OK: subtipo
public void salvar() throws FileNotFoundException { }

// ❌ Erro: mais ampla
// public void salvar() throws Exception { }
```

**Reutilizar superclasse**:
```java
@Override
public double calcularSalario() {
    return super.calcularSalario() + bonus;
}
```

**Quando usar**:
- Especializar comportamento
- Polimorfismo dinâmico
- Implementar métodos abstratos
- Template Method Pattern

**Regra de Ouro**: Use **@Override** sempre. Mantenha **mesma assinatura**. **Não reduza** visibilidade. **Reutilize** código da superclasse com **super**. Sobrescrita é **polimorfismo dinâmico**.
