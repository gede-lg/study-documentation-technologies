# T7.03 - Métodos Abstratos

## Introdução

**Métodos abstratos**: apenas assinatura, sem implementação.

**Modificador**: `abstract` na declaração do método.

**Propósito**: definir **contrato** que subclasses devem implementar.

**Características**:
- Sem corpo (sem `{}`)
- Apenas em classes abstratas ou interfaces
- Subclasses concretas devem implementar
- Não podem ser `static`, `final` ou `private`

```java
public abstract class Animal {
    // Método abstrato: sem corpo
    public abstract void som();
    
    // Método concreto: com corpo
    public void dormir() {
        System.out.println("Dormindo...");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() { // Implementação obrigatória
        System.out.println("Au au");
    }
}
```

```java
public abstract class Forma {
    public abstract double calcularArea(); // Sem {}
    public abstract double calcularPerimetro();
    
    public void exibir() {
        System.out.println("Área: " + calcularArea());
        System.out.println("Perímetro: " + calcularPerimetro());
    }
}
```

---

## Fundamentos

### 1. Declaração de Método Abstrato

**Sintaxe**: `abstract` + **sem corpo** (sem `{}`)

```java
public abstract class Animal {
    public abstract void som(); // Sem implementação
}
```

### 2. Método Abstrato Não Tem Implementação

```java
// ✅ Correto: sem corpo
public abstract void som();

// ❌ Erro: método abstrato com corpo
public abstract void som() {
    System.out.println("Som");
}
```

### 3. Apenas em Classes Abstratas ou Interfaces

```java
// ✅ Correto: classe abstrata
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro: classe concreta
public class Animal {
    public abstract void som();
}
```

### 4. Subclasse Concreta Deve Implementar

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro: faltando implementar som()
public class Cachorro extends Animal {
}

// ✅ Correto: implementa som()
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 5. Subclasse Abstrata Não Precisa Implementar

```java
public abstract class Animal {
    public abstract void som();
}

// ✅ OK: subclasse abstrata
public abstract class Mamifero extends Animal {
    // Não implementa som()
}

// Subclasse concreta implementa
public class Cachorro extends Mamifero {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 6. Métodos Abstratos Podem Ter Parâmetros

```java
public abstract class Calculadora {
    public abstract int calcular(int a, int b);
    public abstract double calcular(double x, double y);
}
```

### 7. Métodos Abstratos Podem Retornar Valores

```java
public abstract class Forma {
    public abstract double calcularArea();
    public abstract String getNome();
    public abstract boolean ehValida();
}
```

### 8. Métodos Abstratos Podem Lançar Exceções

```java
public abstract class Arquivo {
    public abstract void ler() throws IOException;
    public abstract void escrever(String conteudo) throws IOException;
}
```

### 9. Métodos Abstratos Não Podem Ser static

```java
// ❌ Erro: abstract + static
public abstract static void metodo();

// Motivo: static não pode ser sobrescrito
```

### 10. Métodos Abstratos Não Podem Ser final

```java
// ❌ Erro: abstract + final
public abstract final void metodo();

// Motivo: final não pode ser sobrescrito
```

---

## Aplicabilidade

**Use métodos abstratos quando**:
- **Impossível** fornecer implementação padrão
- **Forçar** subclasses a implementar comportamento
- **Contrato** que todas as subclasses devem seguir
- **Template Method Pattern**: estrutura fixa com passos variáveis
- **Polimorfismo**: processar diferentes subclasses uniformemente

**Exemplos**:
```java
// Template Method
public abstract class Processador {
    public final void processar() {
        carregar();
        validar();
        executar();
        salvar();
    }
    
    protected abstract void carregar();
    protected abstract void validar();
    protected abstract void executar();
    protected abstract void salvar();
}
```

---

## Armadilhas

### 1. Método Abstrato Com Corpo

```java
// ❌ Erro: método abstrato não pode ter corpo
public abstract void som() {
    System.out.println("Som");
}

// ✅ Correto: sem corpo
public abstract void som();
```

### 2. Método Abstrato em Classe Concreta

```java
// ❌ Erro: classe deve ser abstrata
public class Animal {
    public abstract void som();
}

// ✅ Correto
public abstract class Animal {
    public abstract void som();
}
```

### 3. abstract com static (Conflito)

```java
// ❌ Erro: abstract + static
public abstract static void metodo();

// Motivo: static não pode ser sobrescrito
```

### 4. abstract com final (Conflito)

```java
// ❌ Erro: abstract + final
public abstract final void metodo();

// Motivo: final não pode ser sobrescrito
```

### 5. abstract com private (Conflito)

```java
// ❌ Erro: abstract + private
private abstract void metodo();

// Motivo: private não pode ser sobrescrito
```

### 6. Esquecer @Override

```java
public abstract class Animal {
    public abstract void som();
}

// ⚠️ Funciona, mas sem @Override
public class Cachorro extends Animal {
    public void som() {
        System.out.println("Au au");
    }
}

// ✅ Melhor: com @Override
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 7. Modificar Assinatura na Implementação

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro: assinatura diferente
public class Cachorro extends Animal {
    @Override
    public void som(String tipo) { // Parâmetro extra
        System.out.println(tipo);
    }
}

// ✅ Correto: mesma assinatura
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 8. Aumentar Restrição de Acesso

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro: reduzindo visibilidade
public class Cachorro extends Animal {
    @Override
    protected void som() { // public → protected
        System.out.println("Au au");
    }
}

// ✅ Correto: mesma ou maior visibilidade
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

---

## Boas Práticas

### 1. Use @Override em Implementações

```java
public abstract class Animal {
    public abstract void som();
}

public class Cachorro extends Animal {
    @Override // Detecta erros em tempo de compilação
    public void som() {
        System.out.println("Au au");
    }
}
```

### 2. Template Method Pattern

```java
public abstract class Relatorio {
    public final void gerar() {
        inicializar();
        carregarDados();
        processar();
        formatar();
        salvar();
    }
    
    protected void inicializar() {
        System.out.println("Inicializando");
    }
    
    protected abstract void carregarDados();
    protected abstract void processar();
    protected abstract void formatar();
    
    protected void salvar() {
        System.out.println("Salvando");
    }
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
    
    @Override
    protected void formatar() {
        System.out.println("Formatando relatório");
    }
}
```

### 3. protected Para Métodos Abstratos de Template

```java
public abstract class Processador {
    public final void executar() {
        passo1();
        passo2();
        passo3();
    }
    
    protected abstract void passo1(); // protected: só subclasses
    protected abstract void passo2();
    protected abstract void passo3();
}
```

### 4. Documente Métodos Abstratos

```java
/**
 * Calcula a área da forma geométrica.
 * @return área em unidades quadradas
 */
public abstract double calcularArea();

/**
 * Processa os dados do arquivo.
 * @throws IOException se erro de leitura
 */
public abstract void processar() throws IOException;
```

### 5. Métodos Abstratos Para Polimorfismo

```java
public abstract class Forma {
    public abstract double calcularArea();
}

public void exibirAreas(List<Forma> formas) {
    for (Forma forma : formas) {
        System.out.println("Área: " + forma.calcularArea());
    }
}

// Uso
List<Forma> formas = Arrays.asList(
    new Circulo(5),
    new Retangulo(4, 6),
    new Triangulo(3, 4)
);
exibirAreas(formas);
```

### 6. Combine Métodos Abstratos e Concretos

```java
public abstract class Conta {
    protected double saldo;
    
    public abstract void calcularRendimento(); // Abstrato
    
    public void depositar(double valor) { // Concreto
        saldo += valor;
    }
    
    public void sacar(double valor) { // Concreto
        if (saldo >= valor) {
            saldo -= valor;
        }
    }
}
```

### 7. Evite Muitos Métodos Abstratos

```java
// ❌ Muitos métodos abstratos
public abstract class Complexo {
    public abstract void metodo1();
    public abstract void metodo2();
    public abstract void metodo3();
    public abstract void metodo4();
    public abstract void metodo5();
}

// ✅ Melhor: agrupar responsabilidades
public abstract class Processador {
    public abstract void processar();
}

public abstract class Validador {
    public abstract boolean validar();
}
```

### 8. Factory Method Pattern

```java
public abstract class DocumentoFactory {
    public Documento criar(String tipo) {
        Documento doc = criarDocumento(tipo);
        doc.inicializar();
        return doc;
    }
    
    protected abstract Documento criarDocumento(String tipo);
}

public class PDFFactory extends DocumentoFactory {
    @Override
    protected Documento criarDocumento(String tipo) {
        return new DocumentoPDF(tipo);
    }
}
```

### 9. Strategy Pattern

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

---

## Resumo

**Declaração**:
```java
public abstract void som(); // Sem corpo
```

**Implementação obrigatória**:
```java
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

**Subclasse abstrata não precisa**:
```java
public abstract class Mamifero extends Animal {
    // Não implementa som()
}
```

**Com parâmetros e retorno**:
```java
public abstract int calcular(int a, int b);
public abstract String getNome();
```

**Com exceções**:
```java
public abstract void ler() throws IOException;
```

**Conflitos**:
```java
// ❌ abstract + static
public abstract static void metodo();

// ❌ abstract + final
public abstract final void metodo();

// ❌ abstract + private
private abstract void metodo();

// ❌ abstract com corpo
public abstract void metodo() { }
```

**Template Method**:
```java
public abstract class Processador {
    public final void executar() {
        passo1();
        passo2();
        passo3();
    }
    
    protected abstract void passo1();
    protected abstract void passo2();
    protected abstract void passo3();
}
```

**Polimorfismo**:
```java
public abstract class Forma {
    public abstract double calcularArea();
}

public void processar(List<Forma> formas) {
    for (Forma f : formas) {
        System.out.println(f.calcularArea());
    }
}
```

**Visibilidade**:
```java
// ✅ OK: public → public
public abstract void metodo();
public void metodo() { }

// ❌ Erro: public → protected
public abstract void metodo();
protected void metodo() { }
```

**Quando usar**:
- ✅ Impossível implementação padrão
- ✅ Forçar contrato em subclasses
- ✅ Template Method Pattern
- ✅ Polimorfismo
- ❌ Implementação padrão possível (use método concreto)

**Regra de Ouro**: **Métodos abstratos** definem **contrato** sem implementação. **Subclasses concretas** devem implementar. Use `@Override`. Não podem ser **static**, **final** ou **private**. Combine com **métodos concretos** para Template Method.
