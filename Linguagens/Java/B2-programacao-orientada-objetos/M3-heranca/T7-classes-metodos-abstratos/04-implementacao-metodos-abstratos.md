# T7.04 - Implementação de Métodos Abstratos

## Introdução

**Implementação**: subclasse concreta fornece corpo para métodos abstratos.

**Obrigação**: toda subclasse **concreta** deve implementar **todos** os métodos abstratos herdados.

**Subclasses abstratas**: podem deixar métodos abstratos sem implementação.

**Características**:
- `@Override` recomendado
- Mesma assinatura (nome, parâmetros, tipo de retorno)
- Visibilidade igual ou maior
- Pode lançar menos exceções (ou nenhuma)

```java
public abstract class Animal {
    public abstract void som();
    public abstract void mover();
}

public class Cachorro extends Animal {
    @Override
    public void som() { // Implementação obrigatória
        System.out.println("Au au");
    }
    
    @Override
    public void mover() { // Implementação obrigatória
        System.out.println("Correndo");
    }
}
```

```java
public abstract class Forma {
    public abstract double calcularArea();
}

public class Circulo extends Forma {
    private double raio;
    
    public Circulo(double raio) {
        this.raio = raio;
    }
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}
```

---

## Fundamentos

### 1. Subclasse Concreta Deve Implementar Todos

```java
public abstract class Animal {
    public abstract void som();
    public abstract void mover();
}

// ❌ Erro: faltando implementar mover()
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

// ✅ Correto: implementa todos
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
    
    @Override
    public void mover() {
        System.out.println("Correndo");
    }
}
```

### 2. Use @Override

```java
public abstract class Animal {
    public abstract void som();
}

// ⚠️ Funciona, mas sem verificação
public class Cachorro extends Animal {
    public void som() {
        System.out.println("Au au");
    }
}

// ✅ Melhor: detecta erros
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 3. Mesma Assinatura

```java
public abstract class Calculadora {
    public abstract int calcular(int a, int b);
}

// ❌ Erro: assinatura diferente
public class Soma extends Calculadora {
    @Override
    public int calcular(double a, double b) { // Tipos diferentes
        return (int) (a + b);
    }
}

// ✅ Correto: mesma assinatura
public class Soma extends Calculadora {
    @Override
    public int calcular(int a, int b) {
        return a + b;
    }
}
```

### 4. Visibilidade Igual ou Maior

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

// ✅ Correto: mesma visibilidade
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 5. Tipo de Retorno Compatível

```java
public abstract class Animal {
    public abstract Object getInfo();
}

// ✅ OK: String é subtipo de Object (covariância)
public class Cachorro extends Animal {
    @Override
    public String getInfo() {
        return "Cachorro";
    }
}
```

### 6. Exceções Menos Restritivas

```java
public abstract class Arquivo {
    public abstract void ler() throws IOException;
}

// ✅ OK: sem exceção
public class ArquivoLocal extends Arquivo {
    @Override
    public void ler() {
        System.out.println("Lendo arquivo");
    }
}

// ✅ OK: exceção mais específica
public class ArquivoRemoto extends Arquivo {
    @Override
    public void ler() throws FileNotFoundException {
        System.out.println("Lendo arquivo remoto");
    }
}

// ❌ Erro: exceção mais genérica
public class ArquivoDB extends Arquivo {
    @Override
    public void ler() throws Exception {
        System.out.println("Lendo banco");
    }
}
```

### 7. Subclasse Abstrata Não Precisa Implementar

```java
public abstract class Animal {
    public abstract void som();
    public abstract void mover();
}

// ✅ OK: subclasse abstrata
public abstract class Mamifero extends Animal {
    @Override
    public void mover() { // Implementa apenas mover()
        System.out.println("Movendo");
    }
    // som() permanece abstrato
}

// Subclasse concreta implementa restante
public class Cachorro extends Mamifero {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 8. Múltiplas Implementações Diferentes

```java
public abstract class Forma {
    public abstract double calcularArea();
}

public class Circulo extends Forma {
    private double raio;
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

public class Retangulo extends Forma {
    private double largura, altura;
    
    @Override
    public double calcularArea() {
        return largura * altura;
    }
}
```

### 9. Implementação Pode Chamar super

```java
public abstract class Animal {
    public void dormir() {
        System.out.println("Dormindo");
    }
}

public class Cachorro extends Animal {
    @Override
    public void dormir() {
        super.dormir(); // Chama implementação da superclasse
        System.out.println("Em sua caminha");
    }
}
```

### 10. Implementação Pode Ser Diferente Por Subclasse

```java
public abstract class Funcionario {
    public abstract double calcularSalario();
}

public class Gerente extends Funcionario {
    private double salarioBase;
    private double bonus;
    
    @Override
    public double calcularSalario() {
        return salarioBase + bonus;
    }
}

public class Vendedor extends Funcionario {
    private double salarioBase;
    private double comissao;
    
    @Override
    public double calcularSalario() {
        return salarioBase + comissao;
    }
}
```

---

## Aplicabilidade

**Use implementações diferentes quando**:
- **Comportamento varia** por subclasse
- **Polimorfismo**: processar diferentes tipos uniformemente
- **Strategy Pattern**: diferentes algoritmos
- **Template Method**: passos específicos em estrutura fixa

**Exemplos**:
```java
public abstract class OrdenacaoStrategy {
    public abstract void ordenar(int[] array);
}

public class BubbleSort extends OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação Bubble Sort
        for (int i = 0; i < array.length - 1; i++) {
            for (int j = 0; j < array.length - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    int temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
    }
}

public class QuickSort extends OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação Quick Sort
        quickSort(array, 0, array.length - 1);
    }
    
    private void quickSort(int[] array, int baixo, int alto) {
        // ...
    }
}
```

---

## Armadilhas

### 1. Esquecer @Override

```java
public abstract class Animal {
    public abstract void som();
}

// ⚠️ Erro não detectado: nome diferente
public class Cachorro extends Animal {
    public void soM() { // 'M' maiúsculo
        System.out.println("Au au");
    }
}

// ✅ Erro detectado com @Override
public class Cachorro extends Animal {
    @Override
    public void soM() { // Erro de compilação
        System.out.println("Au au");
    }
}
```

### 2. Assinatura Diferente

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro: parâmetro extra
public class Cachorro extends Animal {
    @Override
    public void som(String tipo) {
        System.out.println(tipo);
    }
}
```

### 3. Reduzir Visibilidade

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro: public → protected
public class Cachorro extends Animal {
    @Override
    protected void som() {
        System.out.println("Au au");
    }
}
```

### 4. Exceção Mais Genérica

```java
public abstract class Arquivo {
    public abstract void ler() throws IOException;
}

// ❌ Erro: IOException → Exception
public class ArquivoDB extends Arquivo {
    @Override
    public void ler() throws Exception {
        System.out.println("Lendo");
    }
}
```

### 5. Esquecer de Implementar Todos

```java
public abstract class Animal {
    public abstract void som();
    public abstract void mover();
}

// ❌ Erro: faltando mover()
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 6. Tipo de Retorno Incompatível

```java
public abstract class Animal {
    public abstract String getInfo();
}

// ❌ Erro: String → int
public class Cachorro extends Animal {
    @Override
    public int getInfo() {
        return 42;
    }
}
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

### 2. Documente Implementações Complexas

```java
/**
 * Calcula área do círculo usando π * r².
 * @return área em unidades quadradas
 */
@Override
public double calcularArea() {
    return Math.PI * raio * raio;
}
```

### 3. Validação em Implementações

```java
public class ContaCorrente extends Conta {
    @Override
    public void sacar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
        if (saldo < valor) {
            throw new IllegalStateException("Saldo insuficiente");
        }
        saldo -= valor;
    }
}
```

### 4. Implementações Específicas Por Tipo

```java
public abstract class Relatorio {
    public abstract void gerar();
}

public class RelatorioPDF extends Relatorio {
    @Override
    public void gerar() {
        System.out.println("Gerando PDF...");
        criarPDF();
        adicionarCabecalho();
        adicionarConteudo();
        salvarPDF();
    }
    
    private void criarPDF() { }
    private void adicionarCabecalho() { }
    private void adicionarConteudo() { }
    private void salvarPDF() { }
}
```

### 5. Reutilizar Código Com super

```java
public abstract class Funcionario {
    protected double salarioBase;
    
    public double calcularSalario() {
        return salarioBase;
    }
}

public class Gerente extends Funcionario {
    private double bonus;
    
    @Override
    public double calcularSalario() {
        return super.calcularSalario() + bonus;
    }
}
```

### 6. Strategy Pattern

```java
public abstract class PagamentoStrategy {
    public abstract void pagar(double valor);
}

public class CartaoCredito extends PagamentoStrategy {
    @Override
    public void pagar(double valor) {
        System.out.println("Pagando R$ " + valor + " com cartão");
    }
}

public class Boleto extends PagamentoStrategy {
    @Override
    public void pagar(double valor) {
        System.out.println("Gerando boleto de R$ " + valor);
    }
}

// Uso
PagamentoStrategy pagamento = new CartaoCredito();
pagamento.pagar(100.0);
```

### 7. Template Method Com Implementações

```java
public abstract class ProcessadorDados {
    public final void processar() {
        carregar();
        validar();
        executar();
        salvar();
    }
    
    protected abstract void carregar();
    protected abstract void executar();
    
    protected void validar() {
        System.out.println("Validando dados");
    }
    
    protected void salvar() {
        System.out.println("Salvando dados");
    }
}

public class ProcessadorCSV extends ProcessadorDados {
    @Override
    protected void carregar() {
        System.out.println("Carregando CSV");
    }
    
    @Override
    protected void executar() {
        System.out.println("Processando CSV");
    }
}
```

### 8. Factory Method

```java
public abstract class DocumentoFactory {
    protected abstract Documento criarDocumento();
    
    public void processar() {
        Documento doc = criarDocumento();
        doc.abrir();
        doc.processar();
        doc.salvar();
    }
}

public class PDFFactory extends DocumentoFactory {
    @Override
    protected Documento criarDocumento() {
        return new DocumentoPDF();
    }
}
```

### 9. Implementações Com Estado

```java
public abstract class Conta {
    protected double saldo;
    
    public abstract void calcularRendimento();
}

public class ContaPoupanca extends Conta {
    private double taxaRendimento = 0.005;
    
    @Override
    public void calcularRendimento() {
        saldo += saldo * taxaRendimento;
    }
}
```

---

## Resumo

**Implementação obrigatória**:
```java
public abstract class Animal {
    public abstract void som();
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

**Todos os métodos abstratos**:
```java
// ❌ Erro: faltando mover()
public class Cachorro extends Animal {
    @Override
    public void som() { }
}

// ✅ Correto
public class Cachorro extends Animal {
    @Override
    public void som() { }
    
    @Override
    public void mover() { }
}
```

**Mesma assinatura**:
```java
// ✅ OK
public abstract int calcular(int a, int b);
public int calcular(int a, int b) { }

// ❌ Erro
public abstract int calcular(int a, int b);
public int calcular(double a, double b) { }
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

**Exceções**:
```java
// ✅ OK: IOException → FileNotFoundException
public abstract void ler() throws IOException;
public void ler() throws FileNotFoundException { }

// ❌ Erro: IOException → Exception
public abstract void ler() throws IOException;
public void ler() throws Exception { }
```

**Subclasse abstrata**:
```java
public abstract class Mamifero extends Animal {
    // Não precisa implementar
}
```

**Múltiplas implementações**:
```java
public class Circulo extends Forma {
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

public class Retangulo extends Forma {
    @Override
    public double calcularArea() {
        return largura * altura;
    }
}
```

**Quando implementar**:
- ✅ Subclasse concreta: todos os métodos abstratos
- ✅ Subclasse abstrata: pode deixar métodos abstratos
- ✅ Use @Override sempre
- ✅ Mesma assinatura obrigatória
- ❌ Não reduza visibilidade
- ❌ Não lance exceções mais genéricas

**Regra de Ouro**: **Subclasses concretas** devem implementar **todos** os métodos abstratos. Use `@Override`. Mantenha **mesma assinatura**. **Visibilidade** igual ou maior. **Exceções** menos ou mais específicas.
