# Diferença entre Classe Abstrata e Interface

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Classe abstrata** é classe que pode ter **estado** (atributos), **implementação** (métodos concretos), **construtores**, e métodos abstratos, usada via herança simples (`extends`). **Interface** (pré-Java 8) é contrato puro com apenas **métodos abstratos** (sem implementação), sem estado, implementada via `implements`, com suporte a herança múltipla. A partir do Java 8+, interfaces podem ter métodos `default` e `static` com implementação, borrando parcialmente a distinção.

Conceitualmente, diferença fundamental é **"é-um"** vs **"pode-fazer"**: classe abstrata representa **hierarquia de tipos** (Cachorro é-um Animal), interface representa **capacidade/comportamento** (Pato pode-fazer Voar, pode-fazer Nadar). Analogia: classe abstrata é "família biológica" (compartilha DNA/características hereditárias), interface é "habilidade adquirida" (dirigir, tocar piano - não herdada, aprendida).

Propósito de distinguir é **escolher ferramenta certa**: classe abstrata quando há **código compartilhado** e **relação is-a** forte, interface quando há **contrato sem implementação** ou **múltiplas capacidades** independentes (classe pode implementar múltiplas interfaces, mas só estender uma classe).

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Estado:** Abstrata tem atributos, interface não (pré-Java 8)
2. **Implementação:** Abstrata tem métodos concretos, interface só abstratos (pré-Java 8)
3. **Construtores:** Abstrata tem construtores, interface não
4. **Herança:** Abstrata = herança simples, interface = implementação múltipla
5. **Semântica:** Abstrata = is-a (tipo), interface = can-do (capacidade)
6. **Evolução:** Java 8+ adicionou `default` methods a interfaces

---

## 🧠 Fundamentos Teóricos

### Comparação Direta: Classe Abstrata vs Interface

```java
// ========== CLASSE ABSTRATA ==========
abstract class Animal {
    // ✅ PODE ter atributos (estado)
    private String nome;
    private int idade;

    // ✅ PODE ter construtor
    public Animal(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    // ✅ PODE ter métodos concretos (implementação)
    public String getNome() {
        return nome;
    }

    public void dormir() {
        System.out.println(nome + " está dormindo");
    }

    // ✅ PODE ter métodos abstratos
    public abstract void emitirSom();
}

// ========== INTERFACE (Pré-Java 8) ==========
interface Voador {
    // ❌ NÃO pode ter atributos de instância
    // private int altitude;  // ERRO!

    // ✅ Pode ter constantes (public static final implícito)
    int ALTITUDE_MAXIMA = 10000;

    // ❌ NÃO pode ter construtor
    // public Voador() { }  // ERRO!

    // ❌ NÃO pode ter métodos concretos (pré-Java 8)
    // public void preparar() { }  // ERRO!

    // ✅ Apenas métodos abstratos (public abstract implícito)
    void voar();
    void pousar();
}

// ========== USO ==========
class Passaro extends Animal implements Voador {
    public Passaro(String nome, int idade) {
        super(nome, idade);  // Chama construtor de Animal
    }

    @Override
    public void emitirSom() {
        System.out.println("Piu piu");
    }

    @Override
    public void voar() {
        System.out.println(getNome() + " está voando");
    }

    @Override
    public void pousar() {
        System.out.println(getNome() + " está pousando");
    }
}

// Passaro "é-um" Animal (herança)
// Passaro "pode-fazer" Voar (capacidade)
```

**Fundamento:**
- Classe abstrata: **estado + implementação + contrato**
- Interface: **apenas contrato** (pré-Java 8)
- Classe abstrata: herança simples (`extends`)
- Interface: implementação múltipla (`implements`)

### Herança Simples vs Múltipla

```java
// ❌ Java NÃO permite herança múltipla de classes
abstract class Animal { }
abstract class Veiculo { }

class AnfibioErrado extends Animal, Veiculo { }  // ❌ ERRO!

// ✅ Java PERMITE implementação múltipla de interfaces
interface Nadador { void nadar(); }
interface Voador { void voar(); }
interface Corredor { void correr(); }

class Pato extends Animal implements Nadador, Voador, Corredor {
    @Override
    public void nadar() { }

    @Override
    public void voar() { }

    @Override
    public void correr() { }
}

// Pato "é-um" Animal (1 superclasse)
// Pato "pode" nadar, voar, correr (3 interfaces)
```

**Fundamento:** Classe só pode estender **uma** superclasse (simples), mas pode implementar **múltiplas** interfaces. Interfaces resolvem problema de "herança múltipla" sem ambiguidade de estado (diamond problem) porque interfaces não têm estado.

### Interface Como Contrato Puro

```java
// Interface define "o que", não "como"
interface Comparavel {
    int comparar(Object outro);
}

// Classes diferentes implementam mesmo contrato
class Pessoa implements Comparavel {
    private int idade;

    @Override
    public int comparar(Object outro) {
        Pessoa p = (Pessoa) outro;
        return this.idade - p.idade;  // Compara por idade
    }
}

class Produto implements Comparavel {
    private double preco;

    @Override
    public int comparar(Object outro) {
        Produto p = (Produto) outro;
        return Double.compare(this.preco, p.preco);  // Compara por preço
    }
}

// Não há relação "is-a" entre Pessoa e Produto
// Mas ambas "podem-ser-comparadas"
```

**Fundamento:** Interface é **contrato sem hierarquia de tipos** - classes sem relação is-a podem implementar mesma interface. Pessoa e Produto não são relacionadas, mas ambas podem ser comparáveis.

---

## 🔍 Análise Conceitual Profunda

### Quando Usar Classe Abstrata

**✅ Use classe abstrata quando:**

1. **Há código compartilhado (implementação comum)**
```java
abstract class Funcionario {
    protected String nome;
    protected double salarioBase;

    // Implementação compartilhada
    public void exibirDados() {
        System.out.println("Nome: " + nome);
        System.out.println("Salário: " + calcularSalario());
    }

    // Cada tipo calcula diferente
    public abstract double calcularSalario();
}
```

2. **Há estado compartilhado (atributos)**
```java
abstract class Forma {
    protected String cor;  // Estado compartilhado
    protected int espessuraLinha;

    // Construtores para inicializar estado
    public Forma(String cor, int espessuraLinha) {
        this.cor = cor;
        this.espessuraLinha = espessuraLinha;
    }
}
```

3. **Relação "is-a" forte (hierarquia de tipos)**
```java
abstract class Animal { }
class Cachorro extends Animal { }  // Cachorro IS-A Animal
class Gato extends Animal { }      // Gato IS-A Animal
```

4. **Quer controlar modificadores de acesso**
```java
abstract class Base {
    protected abstract void metodoProtegido();  // Só subclasses
    public abstract void metodoPublico();        // Todos
}
```

### Quando Usar Interface

**✅ Use interface quando:**

1. **Não há implementação compartilhada (apenas contrato)**
```java
interface Serializable {
    byte[] serializar();
    void desserializar(byte[] dados);
}
// Diferentes classes serializam de formas totalmente diferentes
```

2. **Representa capacidade/comportamento, não tipo**
```java
interface Voador {
    void voar();
}
// Avião pode voar, Pássaro pode voar - não são relacionados tipologicamente
```

3. **Precisa de "herança múltipla"**
```java
interface Nadador { void nadar(); }
interface Corredor { void correr(); }

class Triatleta implements Nadador, Corredor {
    // Triatleta PODE nadar E correr
}
```

4. **Quer definir constantes globais**
```java
interface Constantes {
    int MAX_TENTATIVAS = 3;
    String VERSAO = "1.0.0";
    // public static final implícito
}
```

### Java 8+: Default Methods Borram a Linha

```java
// Java 8+ permite implementação em interfaces
interface Processador {
    // ✅ Método abstrato tradicional
    void processar();

    // ✅ Default method: implementação padrão
    default void antes() {
        System.out.println("Preparando processamento...");
    }

    default void depois() {
        System.out.println("Finalizando processamento...");
    }

    // ✅ Template method em interface!
    default void executar() {
        antes();
        processar();  // Abstrato
        depois();
    }
}

class ProcessadorConcreto implements Processador {
    @Override
    public void processar() {
        System.out.println("Processando...");
    }

    // antes() e depois() herdados - não precisa implementar
}

// Uso:
Processador p = new ProcessadorConcreto();
p.executar();
// "Preparando processamento..."
// "Processando..."
// "Finalizando processamento..."
```

**Análise:** Java 8+ adiciona `default` methods a interfaces - métodos com implementação. Aproxima interfaces de classes abstratas, mas **ainda sem estado** (atributos de instância). Interface pode ter **comportamento**, mas não **estado**.

### Tabela Comparativa Completa

| Aspecto | Classe Abstrata | Interface (Pré-Java 8) | Interface (Java 8+) |
|---------|-----------------|------------------------|---------------------|
| **Atributos de instância** | ✅ Sim | ❌ Não | ❌ Não |
| **Constantes** | ✅ Sim | ✅ Sim (static final) | ✅ Sim (static final) |
| **Métodos abstratos** | ✅ Sim | ✅ Sim (apenas) | ✅ Sim |
| **Métodos concretos** | ✅ Sim | ❌ Não | ✅ Sim (default/static) |
| **Construtores** | ✅ Sim | ❌ Não | ❌ Não |
| **Herança múltipla** | ❌ Não (extends 1) | ✅ Sim (implements N) | ✅ Sim (implements N) |
| **Modificadores de acesso** | ✅ Todos (public, protected, private) | ❌ Apenas public | ❌ Apenas public/private (static) |
| **Palavra-chave** | `extends` | `implements` | `implements` |
| **Semântica** | is-a (tipo) | can-do (capacidade) | can-do (capacidade) |

### Exemplo Prático: Sistema de Pagamentos

```java
// ========== CLASSE ABSTRATA: Estado + Implementação ==========
abstract class Pagamento {
    protected double valor;
    protected LocalDateTime data;
    protected StatusPagamento status;

    public Pagamento(double valor) {
        this.valor = valor;
        this.data = LocalDateTime.now();
        this.status = StatusPagamento.PENDENTE;
    }

    // Método concreto compartilhado
    public boolean processar() {
        if (validar()) {
            executar();
            this.status = StatusPagamento.APROVADO;
            return true;
        }
        this.status = StatusPagamento.REJEITADO;
        return false;
    }

    // Métodos abstratos - cada tipo implementa
    protected abstract boolean validar();
    protected abstract void executar();

    public double getValor() { return valor; }
    public StatusPagamento getStatus() { return status; }
}

// ========== INTERFACES: Capacidades Opcionais ==========
interface Cancelavel {
    void cancelar();
}

interface Reembolsavel {
    void reembolsar(double valor);
}

interface Parcelavel {
    void parcelar(int numParcelas);
}

// ========== IMPLEMENTAÇÕES CONCRETAS ==========
class PagamentoCartao extends Pagamento implements Cancelavel, Parcelavel {
    private String numeroCartao;

    public PagamentoCartao(double valor, String numeroCartao) {
        super(valor);  // Inicializa estado compartilhado
        this.numeroCartao = numeroCartao;
    }

    @Override
    protected boolean validar() {
        return numeroCartao != null && numeroCartao.length() == 16;
    }

    @Override
    protected void executar() {
        System.out.println("Processando pagamento cartão: " + valor);
    }

    @Override
    public void cancelar() {
        status = StatusPagamento.CANCELADO;
    }

    @Override
    public void parcelar(int numParcelas) {
        System.out.println("Parcelando em " + numParcelas + "x");
    }
}

class PagamentoBoleto extends Pagamento implements Cancelavel {
    private String codigoBarras;

    public PagamentoBoleto(double valor, String codigoBarras) {
        super(valor);
        this.codigoBarras = codigoBarras;
    }

    @Override
    protected boolean validar() {
        return codigoBarras != null && codigoBarras.length() == 47;
    }

    @Override
    protected void executar() {
        System.out.println("Processando pagamento boleto: " + valor);
    }

    @Override
    public void cancelar() {
        status = StatusPagamento.CANCELADO;
    }
    // Boleto não é parcelável
}

class PagamentoPix extends Pagamento {
    private String chave;

    public PagamentoPix(double valor, String chave) {
        super(valor);
        this.chave = chave;
    }

    @Override
    protected boolean validar() {
        return chave != null && !chave.isEmpty();
    }

    @Override
    protected void executar() {
        System.out.println("Processando pagamento PIX: " + valor);
    }
    // PIX não é cancelável nem parcelável
}

// Uso polimórfico:
Pagamento p1 = new PagamentoCartao(100, "1234567890123456");
Pagamento p2 = new PagamentoBoleto(200, "12345678901234567890123456789012345678901234567");
Pagamento p3 = new PagamentoPix(50, "chave@email.com");

// Todos são Pagamento (is-a)
p1.processar();
p2.processar();
p3.processar();

// Mas capacidades variam:
if (p1 instanceof Cancelavel) {
    ((Cancelavel) p1).cancelar();  // Cartão pode cancelar
}

if (p1 instanceof Parcelavel) {
    ((Parcelavel) p1).parcelar(3);  // Cartão pode parcelar
}
```

**Análise:**
- **Classe abstrata `Pagamento`:** Estado compartilhado (valor, data, status), implementação compartilhada (processar), template method
- **Interfaces:** Capacidades opcionais - nem todo pagamento é cancelável ou parcelável
- Cartão: cancelável + parcelável
- Boleto: cancelável
- PIX: nenhuma capacidade adicional

---

## 🎯 Aplicabilidade e Contextos

### Evolução de Design: Interface → Abstrata

```java
// ❌ Design ruim: interface com implementação duplicada
interface Animal {
    String getNome();
    void setNome(String nome);
    void dormir();
}

class Cachorro implements Animal {
    private String nome;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public void dormir() {
        System.out.println(nome + " dormindo");  // Duplicado!
    }
}

class Gato implements Animal {
    private String nome;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public void dormir() {
        System.out.println(nome + " dormindo");  // Duplicado!
    }
}

// ✅ Design melhor: abstrata com código compartilhado
abstract class Animal {
    private String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public String getNome() { return nome; }

    public void dormir() {
        System.out.println(nome + " dormindo");  // Uma vez!
    }

    public abstract void emitirSom();  // Varia por tipo
}

class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }

    @Override
    public void emitirSom() {
        System.out.println("Au au");
    }
}
```

**Contexto:** Se implementações duplicam código, classe abstrata é melhor escolha.

---

## ⚠️ Limitações e Considerações

### Diamond Problem em Interfaces (Java 8+)

```java
interface A {
    default void metodo() {
        System.out.println("A");
    }
}

interface B {
    default void metodo() {
        System.out.println("B");
    }
}

// ❌ Ambiguidade: qual metodo() usar?
class C implements A, B {
    // ❌ ERRO: classe C herda métodos default conflitantes
    // Deve resolver explicitamente:

    @Override
    public void metodo() {
        A.super.metodo();  // Escolhe A
        // Ou: B.super.metodo();  // Escolhe B
        // Ou: própria implementação
    }
}
```

**Limitação:** Default methods podem criar **ambiguidade** se duas interfaces têm mesmo método. Classe deve resolver conflito explicitamente.

### Mudança em Interface Quebra Todos Clientes

```java
// Versão 1
interface Servico {
    void executar();
}

// 100 classes implementam Servico

// Versão 2: adiciona método
interface Servico {
    void executar();
    void validar();  // ❌ QUEBRA todas 100 classes!
}

// ✅ Solução Java 8+: default method
interface Servico {
    void executar();

    default void validar() {
        // Implementação padrão - não quebra clientes
    }
}
```

**Consideração:** Adicionar método abstrato a interface **quebra retrocompatibilidade**. Default methods (Java 8+) resolvem isso.

---

## 🔗 Interconexões Conceituais

### Relação com Herança

Classe abstrata usa **herança** (`extends`), interface usa **implementação** (`implements`). Ambas criam hierarquias, mas semanticamente diferentes.

### Relação com Polimorfismo

Ambas permitem **polimorfismo** - referência é tipo abstrato/interface, objeto é concreto.

### Relação com Design Patterns

- **Template Method:** Classe abstrata
- **Strategy:** Interfaces
- **Adapter:** Interfaces
- **Factory:** Abstratas ou interfaces

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Interfaces Funcionais (Java 8+)

Interfaces com **um método abstrato** são funcionais - podem usar lambdas.

### Direção: Composição vs Herança

"Favor composition over inheritance" - usar interfaces + composição ao invés de hierarquias profundas.

### Caminho: Sealed Classes (Java 17+)

Classes/interfaces seladas restringem quem pode estender/implementar.

---

## 📚 Conclusão

Classe abstrata tem estado, implementação, construtores, herança simples. Interface (pré-Java 8) é contrato puro, sem estado/implementação, herança múltipla. Java 8+ adiciona default methods a interfaces, borrando distinção, mas interfaces ainda não têm estado. Escolha: abstrata para hierarquia is-a com código compartilhado, interface para capacidade can-do sem implementação.

Dominar diferença significa:
- Usar abstrata quando há estado ou implementação compartilhada
- Usar interface quando é capacidade pura ou precisa herança múltipla
- Reconhecer semântica: is-a (abstrata) vs can-do (interface)
- Aplicar default methods (Java 8+) para evolução de interfaces
- Combinar abstratas + interfaces (extends + implements)
- Entender que interface não tem construtores nem atributos instância
- Saber resolver ambiguidade de default methods
- Preferir interface quando não há código compartilhado

Distinção não é "abstrata é melhor" ou "interface é melhor" - são ferramentas para problemas diferentes. Animal abstrato captura generalização biológica com DNA compartilhado (atributos, métodos). Voador interface captura capacidade adquirida sem herança (pássaros, aviões). Java 8+ borrou linha com default methods, mas princípio permanece: estado + hierarquia = abstrata, contrato + capacidades = interface. Use ambas: `class Pato extends Animal implements Voador, Nadador` - é-um Animal, pode Voar, pode Nadar.
