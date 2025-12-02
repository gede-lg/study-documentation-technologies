# Classes e Objetos: Definição, instanciar objetos

**1. Introdução**

A Programação Orientada a Objetos (POO) em Java gira em torno de **classes** e **objetos**.

- **Visão Geral**: Uma *classe* é o molde que define atributos (estado) e métodos (comportamento). Um *objeto* é uma instância concreta desse molde, com seus próprios valores.
- **Relevância**: Quase toda aplicação Java utiliza POO para modularizar código, promover reuso e facilitar manutenção. Entender classes e objetos é essencial para projetar sistemas robustos e escaláveis.
- **Definição de Tema e Subtemas**
    - **Tema principal**: Classes e Objetos — o alicerce da POO em Java.
    - **Subtemas**: Declaração de classe, atributos, métodos, construtores, instanciação e ciclo de vida do objeto.
    - **Para que servem**: Organizar lógica em componentes independentes, melhorar legibilidade e aplicar princípios SOLID.

---

**2. Sumário**

1. Conteúdo Detalhado
    
    1.1 Sintaxe e Estrutura
    
    1.2 Componentes Principais
    
    1.3 Restrições de Uso
    
2. Exemplos de Código Otimizados
3. Informações Adicionais
4. Referências para Estudo Independente

---

**3. Conteúdo Detalhado**

### 3.1 Sintaxe e Estrutura

- **Declaração de Classe**
    
    ```java
    public class Pessoa {
        // atributos
        private String nome;
        private int idade;
        // construtor
        public Pessoa(String nome, int idade) {
            this.nome = nome;
            this.idade = idade;
        }
        // métodos
        public void apresentar() {
            System.out.println("Olá, sou " + nome + " e tenho " + idade + " anos.");
        }
    }
    
    ```
    
- **Instanciando Objetos**
    
    ```java
    Pessoa p = new Pessoa("Juliana", 24);
    p.apresentar();  // Olá, sou Juliana e tenho 24 anos.
    
    ```
    

### 3.2 Componentes Principais

- **Atributos (Campos)**: armazenam o estado do objeto.
- **Métodos**: definem comportamentos; podem modificar atributos e retornar valores.
- **Construtores**: inicializam objetos; podem ser sobrecarregados.
- **`this`**: referência à instância corrente, evita ambiguidade entre atributo e parâmetro.
- **Encapsulamento**: uso de `private` + getters/setters para proteger acesso.

### 3.3 Restrições de Uso

- Java não permite herança múltipla de classes (apenas via interfaces).
- Caso não defina construtor, o compilador gera um construtor padrão sem parâmetros.
- Convenções de nomenclatura:
    - Classes em `PascalCase` (ex.: `MinhaClasse`)
    - Métodos e atributos em `camelCase` (ex.: `minhaVariavel`)

---

**4. Exemplos de Código Otimizados**

```java
// Exemplo: modelando um produto em e-commerce
public class Produto {
    private final String sku;       // identificador único, imutável
    private String nome;
    private double preco;

    // Construtor principal
    public Produto(String sku, String nome, double preco) {
        this.sku = sku;
        setNome(nome);              // validação no setter
        setPreco(preco);            // validação no setter
    }

    // Getter para SKU (somente leitura)
    public String getSku() {
        return sku;
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome inválido.");
        }
        this.nome = nome;
    }

    public double getPreco() {
        return preco;
    }
    public void setPreco(double preco) {
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo.");
        }
        this.preco = preco;
    }

    public void aplicarDesconto(double percentual) {
        setPreco(this.preco * (1 - percentual/100));
    }

    @Override
    public String toString() {
        return String.format("Produto[sku=%s, nome=%s, preco=R$%.2f]", sku, nome, preco);
    }
}

// Uso em código cliente
public class Main {
    public static void main(String[] args) {
        Produto p = new Produto("ABC123", "Cadeira Gamer", 799.90);
        p.aplicarDesconto(10);
        System.out.println(p);
        // Produto[sku=ABC123, nome=Cadeira Gamer, preco=R$719.91]
    }
}

```

- **Boas práticas demonstradas**:
    - Validação em setters
    - Atributos `final` quando imutáveis
    - `toString()` para depuração e logs
    - Uso de `IllegalArgumentException` para erros de contrato

---

**5. Informações Adicionais**

- **Memória**: Objetos são alocados no heap; referências residem na stack.
- **Coleta de Lixo**: Objetos sem referências são elegíveis para GC, liberando memória automaticamente.
- **Design Patterns**: Muitos (Factory, Singleton, Builder) baseiam-se no controle de criação de objetos.
- **Ciclo de Vida**: Construtor → uso de métodos → pós-uso (referência liberada) → GC.

---

**6. Referências para Estudo Independente**

- **Documentação Oracle Java**
    
    [https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)
    
- **Artigos e Tutoriais**
    - Baeldung: “Java Classes and Objects” → [https://www.baeldung.com/java-classes-objects](https://www.baeldung.com/java-classes-objects)
    - Vogella: “Java Object-Oriented Programming” → [https://www.vogella.com/tutorials/JavaOOP/article.html](https://www.vogella.com/tutorials/JavaOOP/article.html)
- **Livros**
    - *Effective Java* (Joshua Bloch) – profundidade em boas práticas de POO
    - *Java: Como Programar* (Deitel & Deitel) – introdução e exemplos didáticos

---

Com este guia você tem uma base sólida para criar, instanciar e manipular objetos em Java, seguindo as melhores práticas de design orientado a objetos. Qualquer dúvida ou aprofundamento, me avise!