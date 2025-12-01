# Upcasting Implícito e Polimorfismo por Substituição

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Upcasting** é conversão **implícita** (automática) de referência de subtipo para supertipo na hierarquia de herança. "Up" significa "subir" na hierarquia: `Cachorro` (específico) → `Animal` (genérico). Java permite atribuir objeto de subclasse a variável de superclasse sem cast explícito. **Polimorfismo por substituição** é princípio de que subtipo pode substituir supertipo em qualquer contexto - base de polimorfismo.

Conceitualmente, upcasting é **generalização segura**: todo Cachorro **é-um** Animal (relação is-a), então Cachorro pode ser tratado como Animal sem risco. Compilador permite porque subtipo **tem tudo** que supertipo tem (herda atributos/métodos) + potencialmente mais. Analogia: mamífero é categoria mais geral que cachorro - todo cachorro é mamífero, posso dizer "esse mamífero" apontando para cachorro.

Propósito fundamental é **abstração e reutilização**: código trabalha com tipos abstratos/genéricos (Animal, Forma), executa em concretos/específicos (Cachorro, Círculo). Método `void alimentar(Animal a)` aceita qualquer animal - não precisa `alimentarCachorro`, `alimentarGato`, `alimentarPassaro`. É **programar para interface, não implementação**.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Implícito:** Não requer cast `(Tipo)`, acontece automaticamente
2. **Seguro:** Sempre válido - subtipo tem tudo que supertipo tem
3. **Polimorfismo:** Permite código genérico trabalhar com especializações
4. **Restrição de Interface:** Variável de supertipo só acessa membros do supertipo
5. **Binding Dinâmico:** Método executado é da classe real (runtime)
6. **Liskov Substitution Principle:** Subtipo substitui supertipo sem quebrar

---

## 🧠 Fundamentos Teóricos

### Sintaxe e Segurança de Upcasting

```java
class Animal {
    private String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public void emitirSom() {
        System.out.println("Som genérico");
    }

    public String getNome() {
        return nome;
    }
}

class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }

    @Override
    public void emitirSom() {
        System.out.println(getNome() + " faz: Au au!");
    }

    public void abanarRabo() {
        System.out.println(getNome() + " está abanando o rabo");
    }
}

// ========== UPCASTING IMPLÍCITO ==========
Cachorro cachorro = new Cachorro("Rex");

// ✅ Upcasting: Cachorro → Animal (IMPLÍCITO, sem cast)
Animal animal = cachorro;  // Automático, sempre seguro

// Referência é Animal, objeto real é Cachorro
animal.emitirSom();  // "Rex faz: Au au!" (método de Cachorro)
animal.getNome();    // "Rex" (método herdado)

// ❌ Variável Animal não pode acessar membros de Cachorro
// animal.abanarRabo();  // ERRO de compilação
// Animal não tem abanarRabo() - interface restrita

// ✅ Objeto real ainda é Cachorro
System.out.println(animal instanceof Cachorro);  // true
System.out.println(animal.getClass().getName()); // "Cachorro"
```

**Fundamento:**
- **Upcasting é implícito**: `Animal a = cachorro;` sem cast explícito
- **Sempre seguro**: Cachorro herda tudo de Animal, tem interface compatível
- **Referência restringe**: Variável `Animal` só acessa membros de `Animal`
- **Objeto real preservado**: `animal` aponta para Cachorro, não Animal genérico
- **Binding dinâmico**: `emitirSom()` executa versão de Cachorro (runtime)

### Upcasting em Atribuições

```java
class Forma {
    public void desenhar() {
        System.out.println("Desenhando forma");
    }
}

class Circulo extends Forma {
    private double raio;

    public Circulo(double raio) {
        this.raio = raio;
    }

    @Override
    public void desenhar() {
        System.out.println("Desenhando círculo com raio " + raio);
    }

    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

class Quadrado extends Forma {
    private double lado;

    public Quadrado(double lado) {
        this.lado = lado;
    }

    @Override
    public void desenhar() {
        System.out.println("Desenhando quadrado com lado " + lado);
    }

    public double calcularArea() {
        return lado * lado;
    }
}

// ✅ Upcasting em variáveis
Forma f1 = new Circulo(5);      // Circulo → Forma
Forma f2 = new Quadrado(4);     // Quadrado → Forma

f1.desenhar();  // "Desenhando círculo com raio 5.0"
f2.desenhar();  // "Desenhando quadrado com lado 4.0"

// ✅ Upcasting em arrays
Forma[] formas = new Forma[3];
formas[0] = new Circulo(3);     // Upcasting
formas[1] = new Quadrado(5);    // Upcasting
formas[2] = new Circulo(7);     // Upcasting

// ✅ Upcasting em coleções
List<Forma> listaFormas = new ArrayList<>();
listaFormas.add(new Circulo(2));   // Upcasting
listaFormas.add(new Quadrado(6));  // Upcasting
```

**Fundamento:** Upcasting ocorre em **atribuições** (variáveis), **arrays** (`Forma[]`), **coleções** (`List<Forma>`). Sempre implícito e seguro.

### Upcasting em Parâmetros de Métodos

```java
class Animal {
    private String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public void dormir() {
        System.out.println(nome + " está dormindo");
    }
}

class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}

class Gato extends Animal {
    public Gato(String nome) {
        super(nome);
    }
}

// ✅ Método aceita tipo genérico
void alimentar(Animal animal) {
    System.out.println("Alimentando " + animal.getNome());
    animal.dormir();
}

void cuidarAnimais(Animal[] animais) {
    for (Animal a : animais) {
        alimentar(a);  // Polimórfico
    }
}

// Uso: upcasting em passagem de parâmetros
Cachorro cachorro = new Cachorro("Rex");
Gato gato = new Gato("Mimi");

alimentar(cachorro);  // ✅ Upcasting: Cachorro → Animal
alimentar(gato);      // ✅ Upcasting: Gato → Animal

Animal[] pets = {
    new Cachorro("Bob"),   // Upcasting
    new Gato("Luna"),      // Upcasting
    new Cachorro("Max")    // Upcasting
};

cuidarAnimais(pets);
// "Alimentando Bob"
// "Bob está dormindo"
// "Alimentando Luna"
// "Luna está dormindo"
// "Alimentando Max"
// "Max está dormindo"
```

**Fundamento:** Método que aceita `Animal` aceita **qualquer subtipo** (Cachorro, Gato, Passaro). Upcasting acontece **automaticamente** ao passar argumento. É base de **polimorfismo paramétrico** - um método, muitos tipos.

---

## 🔍 Análise Conceitual Profunda

### Polimorfismo por Substituição (Liskov Substitution Principle)

```java
abstract class Pagamento {
    protected double valor;

    public Pagamento(double valor) {
        this.valor = valor;
    }

    public boolean processar() {
        if (validar()) {
            executar();
            return true;
        }
        return false;
    }

    protected abstract boolean validar();
    protected abstract void executar();
}

class PagamentoCartao extends Pagamento {
    private String numeroCartao;

    public PagamentoCartao(double valor, String numeroCartao) {
        super(valor);
        this.numeroCartao = numeroCartao;
    }

    @Override
    protected boolean validar() {
        return numeroCartao != null && numeroCartao.length() == 16;
    }

    @Override
    protected void executar() {
        System.out.println("Processando cartão: " + valor);
    }
}

class PagamentoBoleto extends Pagamento {
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
        System.out.println("Processando boleto: " + valor);
    }
}

// ✅ Sistema de processamento polimórfico
class SistemaPagamento {
    private List<Pagamento> filaProcessamento = new ArrayList<>();

    // Aceita qualquer tipo de Pagamento (upcasting)
    public void adicionarPagamento(Pagamento pagamento) {
        filaProcessamento.add(pagamento);
    }

    public void processarTodos() {
        for (Pagamento p : filaProcessamento) {
            // Não sabe se é Cartão, Boleto, PIX
            // Não importa - todos têm processar()
            p.processar();
        }
    }
}

// Uso: código cliente não conhece tipos específicos
SistemaPagamento sistema = new SistemaPagamento();

sistema.adicionarPagamento(new PagamentoCartao(100, "1234567890123456"));
sistema.adicionarPagamento(new PagamentoBoleto(200, "12345678901234567890123456789012345678901234567"));
sistema.adicionarPagamento(new PagamentoCartao(50, "9876543210987654"));

sistema.processarTodos();
// "Processando cartão: 100.0"
// "Processando boleto: 200.0"
// "Processando cartão: 50.0"
```

**Análise:** **Liskov Substitution Principle (LSP)**: objetos de subclasses devem substituir objetos de superclasse sem quebrar programa. `SistemaPagamento` trabalha com `Pagamento` abstrato - qualquer subtipo pode ser usado sem modificar código. Upcasting permite **extensibilidade** - adicionar `PagamentoPix` sem alterar `processarTodos()`.

### Restrição de Interface (Perda de Acesso)

```java
class Funcionario {
    protected String nome;

    public Funcionario(String nome) {
        this.nome = nome;
    }

    public void trabalhar() {
        System.out.println(nome + " está trabalhando");
    }
}

class Gerente extends Funcionario {
    private double bonus;

    public Gerente(String nome, double bonus) {
        super(nome);
        this.bonus = bonus;
    }

    public void aprovarOrcamento() {
        System.out.println(nome + " aprovando orçamento");
    }

    public double getBonus() {
        return bonus;
    }
}

// Upcasting: Gerente → Funcionario
Gerente gerente = new Gerente("Maria", 5000);
Funcionario funcionario = gerente;  // Upcasting

// ✅ Pode acessar membros de Funcionario
funcionario.trabalhar();  // OK

// ❌ NÃO pode acessar membros específicos de Gerente
// funcionario.aprovarOrcamento();  // ERRO de compilação
// funcionario.getBonus();           // ERRO de compilação

// Tipo da variável determina interface disponível
// Referência é Funcionario - só vê Funcionario
// Objeto real é Gerente, mas interface está restrita
```

**Análise:** Variável de supertipo (`Funcionario`) tem **interface restrita** - só acessa membros declarados em `Funcionario`, mesmo que objeto real seja `Gerente`. Compilador verifica baseado em **tipo da variável**, não tipo do objeto. Upcasting **esconde** membros específicos da subclasse.

### Binding Dinâmico com Upcasting

```java
class Animal {
    public void emitirSom() {
        System.out.println("Som genérico de animal");
    }

    public void identificar() {
        System.out.println("Sou um animal genérico");
    }
}

class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }

    @Override
    public void identificar() {
        System.out.println("Sou um cachorro");
    }
}

class Gato extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Miau!");
    }

    @Override
    public void identificar() {
        System.out.println("Sou um gato");
    }
}

// Upcasting + binding dinâmico
Animal a1 = new Cachorro();  // Tipo: Animal, Objeto: Cachorro
Animal a2 = new Gato();      // Tipo: Animal, Objeto: Gato

a1.emitirSom();    // "Au au!" (versão de Cachorro)
a1.identificar();  // "Sou um cachorro" (versão de Cachorro)

a2.emitirSom();    // "Miau!" (versão de Gato)
a2.identificar();  // "Sou um gato" (versão de Gato)

// Método executado é determinado em RUNTIME pelo objeto real
// Não pela variável (compile-time)
```

**Análise:** Mesmo com upcasting (variável é `Animal`), métodos sobrescritos executam **versão da classe real** (Cachorro, Gato). É **dynamic binding** (late binding): decisão de qual método executar acontece em **runtime**, baseado em tipo real do objeto, não tipo da variável.

### Upcasting em Hierarquias Multinível

```java
class Veiculo {
    public void mover() {
        System.out.println("Veículo movendo");
    }
}

class VeiculoTerrestre extends Veiculo {
    @Override
    public void mover() {
        System.out.println("Veículo terrestre movendo por terra");
    }
}

class Carro extends VeiculoTerrestre {
    @Override
    public void mover() {
        System.out.println("Carro movendo na estrada");
    }
}

// Upcasting em múltiplos níveis
Carro carro = new Carro();

// ✅ Carro → VeiculoTerrestre
VeiculoTerrestre terrestre = carro;
terrestre.mover();  // "Carro movendo na estrada"

// ✅ Carro → Veiculo (pula nível)
Veiculo veiculo = carro;
veiculo.mover();    // "Carro movendo na estrada"

// ✅ VeiculoTerrestre → Veiculo
Veiculo v2 = terrestre;
v2.mover();         // "Carro movendo na estrada"

// Em todos casos, método executado é de Carro (objeto real)
```

**Análise:** Upcasting pode **pular níveis** - `Carro` pode ser convertido diretamente para `Veiculo` sem passar explicitamente por `VeiculoTerrestre`. Qualquer ancestral na hierarquia é válido. Binding dinâmico sempre executa método da **classe real** (`Carro`), independente de quantos níveis de upcasting.

---

## 🎯 Aplicabilidade e Contextos

### Padrão Strategy com Upcasting

```java
interface EstrategiaDesconto {
    double calcular(double valorOriginal);
}

class DescontoPercentual implements EstrategiaDesconto {
    private double percentual;

    public DescontoPercentual(double percentual) {
        this.percentual = percentual;
    }

    @Override
    public double calcular(double valorOriginal) {
        return valorOriginal * (percentual / 100);
    }
}

class DescontoFixo implements EstrategiaDesconto {
    private double valorFixo;

    public DescontoFixo(double valorFixo) {
        this.valorFixo = valorFixo;
    }

    @Override
    public double calcular(double valorOriginal) {
        return Math.min(valorFixo, valorOriginal);
    }
}

class Carrinho {
    private double total;
    private EstrategiaDesconto estrategia;

    public Carrinho(double total) {
        this.total = total;
    }

    // ✅ Aceita qualquer estratégia (upcasting)
    public void setEstrategiaDesconto(EstrategiaDesconto estrategia) {
        this.estrategia = estrategia;
    }

    public double calcularTotal() {
        if (estrategia == null) {
            return total;
        }
        return total - estrategia.calcular(total);
    }
}

// Uso:
Carrinho c = new Carrinho(100);

// Upcasting: DescontoPercentual → EstrategiaDesconto
c.setEstrategiaDesconto(new DescontoPercentual(10));
System.out.println(c.calcularTotal());  // 90.0

// Upcasting: DescontoFixo → EstrategiaDesconto
c.setEstrategiaDesconto(new DescontoFixo(15));
System.out.println(c.calcularTotal());  // 85.0
```

**Aplicabilidade:** Strategy pattern depende de upcasting - cliente usa interface (`EstrategiaDesconto`), estratégias concretas são upcast automaticamente.

### Collections Framework e Polimorfismo

```java
// ✅ Programar para interface (List), não implementação (ArrayList)
List<String> lista = new ArrayList<>();  // Upcasting: ArrayList → List

// Pode trocar implementação sem quebrar código
// List<String> lista = new LinkedList<>();  // Ainda List

lista.add("A");
lista.add("B");

// Método aceita interface
void processarLista(List<String> lista) {
    for (String s : lista) {
        System.out.println(s);
    }
}

processarLista(lista);  // Aceita ArrayList, LinkedList, etc
```

**Aplicabilidade:** Collections sempre usam **tipos de interface** (`List`, `Set`, `Map`) para permitir flexibilidade de implementação via upcasting.

---

## ⚠️ Limitações e Considerações

### Acesso Restrito Pós-Upcasting

```java
class Base {
    public void metodoBase() {
        System.out.println("Base");
    }
}

class Derivada extends Base {
    public void metodoDerivatido() {
        System.out.println("Derivada");
    }
}

Derivada d = new Derivada();
Base b = d;  // Upcasting

b.metodoBase();        // ✅ OK
// b.metododerivada();  // ❌ ERRO - Base não tem este método

// Solução: downcasting (próximo arquivo)
((Derivada) b).metodoDerivatido();  // ✅ OK com cast explícito
```

**Limitação:** Upcasting **restringe acesso** - membros específicos da subclasse ficam inacessíveis via variável de superclasse.

### Modificadores de Acesso Respeitados

```java
class Animal {
    protected void metodoProtegido() {
        System.out.println("Protegido");
    }
}

class Cachorro extends Animal {
    public void metodoPublico() {
        System.out.println("Público");
    }
}

Animal a = new Cachorro();  // Upcasting

// a.metodoProtegido();  // ❌ ERRO se não estiver no mesmo pacote ou subclasse
a.metodoPublico();       // ✅ OK - public acessível

// Upcasting não contorna modificadores de acesso
```

**Consideração:** Upcasting não altera **visibilidade** - modificadores de acesso (`private`, `protected`, `public`) continuam valendo.

---

## 🔗 Interconexões Conceituais

### Relação com Polimorfismo

Upcasting é **mecanismo** que permite polimorfismo - código trabalha com tipos abstratos, executa em concretos.

### Relação com Liskov Substitution Principle

LSP garante que upcasting é **seguro semanticamente** - subtipo pode substituir supertipo sem quebrar invariantes.

### Relação com Binding Dinâmico

Upcasting + binding dinâmico = polimorfismo de sobrescrita - método executado é da classe real, não da variável.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Downcasting

Próximo passo é **downcasting** - conversão explícita de supertipo para subtipo, com risco de `ClassCastException`.

### Direção: instanceof

Operador `instanceof` verifica tipo real antes de downcasting para evitar exceções.

### Caminho: Pattern Matching (Java 16+)

Pattern matching combina `instanceof` + cast em sintaxe concisa.

---

## 📚 Conclusão

Upcasting é conversão implícita (automática) de subtipo para supertipo - sempre segura porque subtipo tem tudo que supertipo tem. Permite polimorfismo por substituição: código trabalha com tipos abstratos (Animal, Forma), executa em concretos (Cachorro, Círculo). Binding dinâmico garante que métodos executados são da classe real, não da variável.

Dominar upcasting significa:
- Reconhecer que é implícito - não requer cast explícito
- Usar para polimorfismo - método aceita supertipo, recebe qualquer subtipo
- Entender restrição de interface - variável de supertipo só acessa membros do supertipo
- Aplicar em parâmetros, arrays, coleções para código genérico
- Confiar em binding dinâmico - método correto executado em runtime
- Seguir LSP - subtipo deve substituir supertipo sem quebrar
- Programar para interfaces/abstratas, não implementações concretas
- Combinar com design patterns (Strategy, Template Method)

Upcasting não é "perda de tipo" ou "conversão forçada" - é **abstração intencional** que permite raciocinar em alto nível sem se prender a detalhes. `void alimentar(Animal a)` funciona para qualquer animal existente ou futuro - extensibilidade sem modificação. É fundamento de polimorfismo: um método, muitos tipos. Liskov mostrou que subtipo bem projetado pode substituir supertipo em qualquer contexto - upcasting é implementação prática desse princípio.
