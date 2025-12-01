# Métodos Abstratos e Implementação Obrigatória

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Método abstrato** é método declarado com `abstract` que **não tem implementação** (sem corpo `{}`), apenas assinatura. Obriga **subclasses concretas a implementar** - se subclasse não implementar todos métodos abstratos herdados, também deve ser abstrata. É **contrato forçado** pela linguagem: "subclasse deve fornecer esta funcionalidade".

Conceitualmente, método abstrato é **lacuna intencional** em classe abstrata: superclasse define "o que" deve existir (assinatura), subclasses definem "como" funciona (implementação). Analogia: planta arquitetônica especifica "deve ter sistema elétrico" mas não detalha fios/tomadas - cada construtor implementa à sua maneira, seguindo especificação.

Propósito fundamental é **polimorfismo com garantias**: cliente usa tipo abstrato sabendo que método existe (compilador verifica), mas implementação varia por subtipo. Superclasse **força estrutura** sem ditar implementação - subclasses têm liberdade de implementar, mas não liberdade de omitir.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sem Implementação:** Apenas assinatura, terminada com `;` (sem `{}`)
2. **Classe Deve Ser Abstrata:** Método `abstract` exige classe `abstract`
3. **Implementação Obrigatória:** Subclasse concreta deve implementar TODOS
4. **Polimorfismo Garantido:** Compilador garante que método existe
5. **Assinatura Idêntica:** Implementação deve respeitar assinatura exata
6. **Cannot Be:** `private`, `static`, `final` - incompatíveis com `abstract`

---

## 🧠 Fundamentos Teóricos

### Sintaxe e Implementação Obrigatória

```java
// Classe abstrata com método abstrato
abstract class Animal {
    private String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    // ✅ Método abstrato: sem corpo, termina com ;
    public abstract void emitirSom();
    // Declara "todo Animal emite som, mas SOM varia por tipo"
}

// ✅ Subclasse concreta: DEVE implementar método abstrato
class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }

    // ✅ Implementação obrigatória
    @Override
    public void emitirSom() {
        System.out.println(getNome() + " faz: Au au!");
    }
}

class Gato extends Animal {
    public Gato(String nome) {
        super(nome);
    }

    // ✅ Implementação obrigatória
    @Override
    public void emitirSom() {
        System.out.println(getNome() + " faz: Miau!");
    }
}

// ❌ ERRO: subclasse concreta sem implementar abstrato
class Passaro extends Animal {
    public Passaro(String nome) {
        super(nome);
    }
    // ❌ ERRO de compilação: emitirSom() não implementado
    // "Passaro is not abstract and does not override abstract method emitirSom()"
}

// ✅ Alternativa: subclasse também abstrata
abstract class Passaro extends Animal {
    public Passaro(String nome) {
        super(nome);
    }
    // OK - abstrata não precisa implementar
}

// Uso polimórfico:
Animal a1 = new Cachorro("Rex");
Animal a2 = new Gato("Mimi");

a1.emitirSom();  // "Rex faz: Au au!"
a2.emitirSom();  // "Mimi faz: Miau!"
```

**Fundamento:**
- Método abstrato é declarado com `abstract` e **sem corpo** (só assinatura + `;`)
- Subclasse **concreta** deve implementar **todos** métodos abstratos herdados
- Se não implementar, subclasse também deve ser `abstract`
- Compilador **força** implementação - não é opcional

### Método Abstrato Força Estrutura

```java
abstract class Forma {
    private String cor;

    public Forma(String cor) {
        this.cor = cor;
    }

    public String getCor() {
        return cor;
    }

    // ✅ Métodos abstratos: contrato obrigatório
    public abstract double calcularArea();
    public abstract double calcularPerimetro();

    // ✅ Método concreto que USA abstratos
    public void exibirInformacoes() {
        System.out.println("Forma " + cor);
        System.out.println("Área: " + calcularArea());
        System.out.println("Perímetro: " + calcularPerimetro());
    }
}

class Circulo extends Forma {
    private double raio;

    public Circulo(String cor, double raio) {
        super(cor);
        this.raio = raio;
    }

    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }

    @Override
    public double calcularPerimetro() {
        return 2 * Math.PI * raio;
    }
}

class Retangulo extends Forma {
    private double largura;
    private double altura;

    public Retangulo(String cor, double largura, double altura) {
        super(cor);
        this.largura = largura;
        this.altura = altura;
    }

    @Override
    public double calcularArea() {
        return largura * altura;
    }

    @Override
    public double calcularPerimetro() {
        return 2 * (largura + altura);
    }
}

// Uso:
Forma f1 = new Circulo("vermelho", 5);
Forma f2 = new Retangulo("azul", 4, 6);

f1.exibirInformacoes();
// "Forma vermelho"
// "Área: 78.54" (PI * 5²)
// "Perímetro: 31.42" (2 * PI * 5)

f2.exibirInformacoes();
// "Forma azul"
// "Área: 24.0" (4 * 6)
// "Perímetro: 20.0" (2 * (4 + 6))
```

**Fundamento:** Método concreto (`exibirInformacoes`) **chama** métodos abstratos (`calcularArea`, `calcularPerimetro`). Superclasse define **algoritmo** usando métodos abstratos como "placeholders". Subclasses implementam placeholders, algoritmo funciona. É **Template Method pattern**.

### Múltiplos Métodos Abstratos

```java
abstract class Relatorio {
    protected String titulo;

    public Relatorio(String titulo) {
        this.titulo = titulo;
    }

    // ✅ Múltiplos métodos abstratos
    protected abstract void gerarCabecalho();
    protected abstract void gerarCorpo();
    protected abstract void gerarRodape();
    protected abstract String getFormato();

    // ✅ Método concreto orquestra abstratos
    public final void gerar() {  // final: não pode ser sobrescrito
        System.out.println("=== Gerando relatório " + getFormato() + " ===");
        gerarCabecalho();
        gerarCorpo();
        gerarRodape();
        System.out.println("=== Relatório concluído ===");
    }
}

class RelatorioPDF extends Relatorio {
    public RelatorioPDF(String titulo) {
        super(titulo);
    }

    @Override
    protected void gerarCabecalho() {
        System.out.println("[PDF] Cabeçalho: " + titulo);
    }

    @Override
    protected void gerarCorpo() {
        System.out.println("[PDF] Corpo do relatório...");
    }

    @Override
    protected void gerarRodape() {
        System.out.println("[PDF] Rodapé com data");
    }

    @Override
    protected String getFormato() {
        return "PDF";
    }
}

class RelatorioHTML extends Relatorio {
    public RelatorioHTML(String titulo) {
        super(titulo);
    }

    @Override
    protected void gerarCabecalho() {
        System.out.println("<h1>" + titulo + "</h1>");
    }

    @Override
    protected void gerarCorpo() {
        System.out.println("<body>Conteúdo...</body>");
    }

    @Override
    protected void gerarRodape() {
        System.out.println("<footer>Rodapé</footer>");
    }

    @Override
    protected String getFormato() {
        return "HTML";
    }
}

// Uso:
Relatorio r1 = new RelatorioPDF("Vendas Mensais");
r1.gerar();
// === Gerando relatório PDF ===
// [PDF] Cabeçalho: Vendas Mensais
// [PDF] Corpo do relatório...
// [PDF] Rodapé com data
// === Relatório concluído ===

Relatorio r2 = new RelatorioHTML("Vendas Anuais");
r2.gerar();
// === Gerando relatório HTML ===
// <h1>Vendas Anuais</h1>
// <body>Conteúdo...</body>
// <footer>Rodapé</footer>
// === Relatório concluído ===
```

**Fundamento:** Subclasse concreta deve implementar **TODOS** métodos abstratos (4 no exemplo). Método `gerar()` é **template** que chama abstratos em ordem específica. Cada subclasse implementa passos à sua maneira, mas sequência é definida pela superclasse.

---

## 🔍 Análise Conceitual Profunda

### Método Abstrato Como Contrato Forçado

```java
abstract class ProcessadorPagamento {
    protected double valor;

    public ProcessadorPagamento(double valor) {
        this.valor = valor;
    }

    // ✅ Contrato: toda subclasse DEVE validar
    protected abstract boolean validar();

    // ✅ Contrato: toda subclasse DEVE executar transação
    protected abstract void executarTransacao();

    // ✅ Contrato: toda subclasse DEVE registrar log
    protected abstract void registrarLog();

    // Método público que usa abstratos
    public final boolean processar() {
        System.out.println("Iniciando processamento...");

        if (!validar()) {
            System.out.println("Validação falhou");
            return false;
        }

        executarTransacao();
        registrarLog();

        System.out.println("Processamento concluído");
        return true;
    }
}

class ProcessadorCartao extends ProcessadorPagamento {
    private String numeroCartao;

    public ProcessadorCartao(double valor, String numeroCartao) {
        super(valor);
        this.numeroCartao = numeroCartao;
    }

    @Override
    protected boolean validar() {
        return numeroCartao != null && numeroCartao.length() == 16;
    }

    @Override
    protected void executarTransacao() {
        System.out.println("Transação cartão: " + valor);
    }

    @Override
    protected void registrarLog() {
        System.out.println("Log: Pagamento cartão " + numeroCartao);
    }
}

class ProcessadorBoleto extends ProcessadorPagamento {
    private String codigoBarras;

    public ProcessadorBoleto(double valor, String codigoBarras) {
        super(valor);
        this.codigoBarras = codigoBarras;
    }

    @Override
    protected boolean validar() {
        return codigoBarras != null && codigoBarras.length() == 47;
    }

    @Override
    protected void executarTransacao() {
        System.out.println("Transação boleto: " + valor);
    }

    @Override
    protected void registrarLog() {
        System.out.println("Log: Pagamento boleto " + codigoBarras);
    }
}
```

**Análise:** Métodos abstratos são **contrato verificado em compilação** - subclasse não compila se não implementar. Cliente chama `processar()` sabendo que `validar()`, `executarTransacao()`, `registrarLog()` existem, mesmo sem saber implementação específica. Compilador garante estrutura.

### Herança de Abstratos em Múltiplos Níveis

```java
// Nível 1: Abstrata com 2 abstratos
abstract class Animal {
    public abstract void emitirSom();
    public abstract void mover();
}

// Nível 2: Abstrata intermediária implementa 1, deixa 1
abstract class AnimalTerrestre extends Animal {
    // ✅ Implementa mover
    @Override
    public void mover() {
        System.out.println("Andando...");
    }

    // ❌ Não implementa emitirSom - continua abstrato
    // emitirSom() ainda é abstrato neste nível
}

// Nível 3: Concreta DEVE implementar restantes
class Cachorro extends AnimalTerrestre {
    // ✅ Implementa o único abstrato restante
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }

    // mover() já implementado em AnimalTerrestre - herdado
}

// Uso:
Cachorro c = new Cachorro();
c.emitirSom();  // "Au au!" (implementado em Cachorro)
c.mover();      // "Andando..." (implementado em AnimalTerrestre)
```

**Análise:** Hierarquia pode **gradualmente implementar** abstratos. Abstrata intermediária implementa alguns, deixa outros. Concreta final deve implementar **todos restantes**. Permite **refinamento incremental**.

### Sobrescrita de Concreto Para Abstrato (Raro)

```java
class Base {
    // ✅ Método concreto na base
    public void metodo() {
        System.out.println("Implementação padrão");
    }
}

// Subclasse torna método abstrato
abstract class Derivada extends Base {
    // ✅ Sobrescreve concreto como abstrato
    @Override
    public abstract void metodo();
    // Força subclasses de Derivada a reimplementar
}

class Concreta extends Derivada {
    // ✅ Deve implementar (metodo é abstrato em Derivada)
    @Override
    public void metodo() {
        System.out.println("Nova implementação");
    }
}
```

**Análise:** Subclasse pode **tornar abstrato** método que era concreto na superclasse. Raro, mas válido - força subclasses posteriores a reimplementar ao invés de herdar implementação original.

### Template Method Pattern

```java
abstract class AlgoritmoOrdenacao {
    // ✅ Método template: define esqueleto do algoritmo
    public final void ordenar(int[] array) {
        System.out.println("Início da ordenação");

        if (array.length <= 1) {
            return;
        }

        executarOrdenacao(array);  // Passo abstrato
        verificarOrdenacao(array);   // Passo concreto

        System.out.println("Ordenação concluída");
    }

    // ✅ Método abstrato: passo variável
    protected abstract void executarOrdenacao(int[] array);

    // ✅ Método concreto: passo comum
    private void verificarOrdenacao(int[] array) {
        for (int i = 0; i < array.length - 1; i++) {
            if (array[i] > array[i + 1]) {
                throw new IllegalStateException("Array não ordenado corretamente");
            }
        }
        System.out.println("Verificação: array ordenado corretamente");
    }
}

class BubbleSort extends AlgoritmoOrdenacao {
    @Override
    protected void executarOrdenacao(int[] array) {
        System.out.println("Executando Bubble Sort");
        for (int i = 0; i < array.length - 1; i++) {
            for (int j = 0; j < array.length - 1 - i; j++) {
                if (array[j] > array[j + 1]) {
                    int temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
    }
}

class QuickSort extends AlgoritmoOrdenacao {
    @Override
    protected void executarOrdenacao(int[] array) {
        System.out.println("Executando Quick Sort");
        quickSort(array, 0, array.length - 1);
    }

    private void quickSort(int[] array, int low, int high) {
        // Implementação quicksort
    }
}
```

**Análise:** Template Method é **padrão clássico** com métodos abstratos: superclasse define **estrutura do algoritmo** (`ordenar`), passos fixos são concretos (`verificarOrdenacao`), passos variáveis são abstratos (`executarOrdenacao`). Subclasses preenchem lacunas sem alterar estrutura.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Métodos Abstratos

**✅ Use método abstrato quando:**

1. **Comportamento DEVE existir mas implementação varia**
```java
abstract class Animal {
    public abstract void emitirSom();  // Todo animal emite som, mas SOM varia
}
```

2. **Quer forçar subclasses a implementar**
```java
abstract class Validador {
    public abstract boolean validar();  // Toda subclasse DEVE validar
}
```

3. **Template Method pattern - algoritmo com passos variáveis**
```java
abstract class Processador {
    public final void processar() {
        carregar();     // Abstrato
        transformar();  // Abstrato
        salvar();       // Abstrato
    }

    protected abstract void carregar();
    protected abstract void transformar();
    protected abstract void salvar();
}
```

4. **Polimorfismo com garantia de método**
```java
List<Forma> formas = ...;
for (Forma f : formas) {
    f.calcularArea();  // Compilador garante que método existe
}
```

---

## ⚠️ Limitações e Considerações

### Método Abstrato Não Pode Ser `private`

```java
abstract class Base {
    // ❌ ERRO: abstract e private incompatíveis
    private abstract void metodo();
    // abstract = deve ser sobrescrito
    // private = não visível para subclasses
    // Contradição!

    // ✅ Deve ser protected ou public
    protected abstract void metodo();
}
```

**Limitação:** Método abstrato deve ser **visível** para subclasses (`protected` ou `public`). `private` esconde de subclasses, tornando sobrescrita impossível.

### Método Abstrato Não Pode Ser `final`

```java
abstract class Base {
    // ❌ ERRO: abstract e final incompatíveis
    public abstract final void metodo();
    // abstract = deve ser sobrescrito
    // final = não pode ser sobrescrito
    // Contradição!
}
```

**Limitação:** `abstract` requer sobrescrita, `final` proíbe sobrescrita - **mutuamente exclusivos**.

### Método Abstrato Não Pode Ser `static`

```java
abstract class Base {
    // ❌ ERRO: abstract e static incompatíveis
    public static abstract void metodo();
    // abstract = ligação dinâmica (runtime polymorphism)
    // static = ligação estática (compile-time)
    // Contradição conceitual!
}
```

**Limitação:** `static` pertence à classe, não instância. Métodos abstratos dependem de **polimorfismo de instância** - incompatíveis.

### Todas Abstratos Devem Ser Implementados

```java
abstract class Base {
    public abstract void metodo1();
    public abstract void metodo2();
    public abstract void metodo3();
}

// ❌ ERRO: não implementou todos
class Derivada extends Base {
    @Override
    public void metodo1() { }

    @Override
    public void metodo2() { }

    // Faltou metodo3() - ERRO!
}

// ✅ Implementou todos
class DerivadaCompleta extends Base {
    @Override
    public void metodo1() { }

    @Override
    public void metodo2() { }

    @Override
    public void metodo3() { }
}
```

**Consideração:** Subclasse concreta deve implementar **todos** abstratos herdados. Esquecer um gera erro de compilação.

---

## 🔗 Interconexões Conceituais

### Relação com Polimorfismo

Métodos abstratos permitem **polimorfismo garantido** - compilador assegura que método existe em todas subclasses, permitindo chamada via tipo abstrato.

### Relação com Template Method Pattern

Métodos abstratos são **mecanismo** do Template Method: superclasse define algoritmo, abstratos são "hooks" para subclasses customizarem.

### Relação com Interfaces

Ambos definem **métodos sem implementação**, mas interfaces (pré-Java 8) são **apenas contratos**, abstratas podem ter **métodos concretos + estado**.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Interfaces

Próximo passo é compreender **interfaces** - contratos puros com apenas métodos abstratos (pré-Java 8) ou default methods (Java 8+).

### Direção: Default Methods (Java 8+)

Java 8+ permite **métodos concretos em interfaces** via `default`, borrando linha entre interface e classe abstrata.

### Caminho: Strategy Pattern

Pattern que usa abstratas ou interfaces para **encapsular algoritmos** intercambiáveis.

---

## 📚 Conclusão

Método abstrato é método declarado com `abstract` sem implementação (só assinatura + `;`), que força subclasses concretas a implementar. Compilador garante que subclasse implementa todos abstratos herdados ou também é abstrata. Permite polimorfismo com garantias estruturais.

Dominar métodos abstratos significa:
- Declarar com `abstract` e sem corpo (`{ }`)
- Reconhecer que classe com método abstrato deve ser abstrata
- Implementar TODOS abstratos em subclasse concreta
- Usar `@Override` ao implementar (boa prática)
- Aplicar em Template Method pattern (algoritmo com passos variáveis)
- Entender que abstratos forçam estrutura sem ditar implementação
- Saber que `abstract` é incompatível com `private`, `final`, `static`
- Reconhecer que hierarquias podem gradualmente implementar abstratos
- Usar abstratos para garantir que método existe (polimorfismo seguro)

Método abstrato não é "método incompleto por preguiça" - é **contrato verificado em compilação** que força subclasses a fornecer funcionalidade. `Forma.calcularArea()` abstrato garante que todo Círculo, Quadrado, Triângulo implementa cálculo - cliente pode chamar `forma.calcularArea()` sem saber tipo específico, compilador garante que método existe. É fundamento de polimorfismo seguro - abstração que não quebra em runtime porque estrutura é verificada em compile-time.
