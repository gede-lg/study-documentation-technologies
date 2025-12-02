# Encapsulamento: Modificadores de acesso (public, private, protected, default), getters e setters

---

## Encapsulamento em Java: Protegendo Seus Dados

### 1\. Introdução

O encapsulamento é um dos quatro pilares da Programação Orientada a Objetos (POO), juntamente com Herança, Polimorfismo e Abstração. Em sua essência, o encapsulamento visa proteger os dados de uma classe, controlando o acesso direto a eles e expondo apenas o que é estritamente necessário.

**Relevância e Importância:**
No desenvolvimento backend, onde a integridade e a segurança dos dados são cruciais, o encapsulamento garante que os objetos da sua aplicação mantenham um estado consistente e válido. Ele evita que o estado interno de um objeto seja alterado de forma inesperada por código externo, promovendo a modularidade, a manutenibilidade e a segurança do software. É a base para a criação de APIs robustas e de fácil uso, pois as classes expõem apenas a interface de interação, escondendo os detalhes de implementação.

**Definição e Conceitos Fundamentais:**

- **Encapsulamento:** É o mecanismo de agrupar dados (atributos) e os métodos que operam sobre esses dados em uma única unidade (a classe), e de restringir o acesso direto a alguns dos componentes da classe. O objetivo é evitar que a parte externa de um objeto possa manipular diretamente seus dados internos, forçando que toda interação ocorra através de métodos controlados pela própria classe.
- **Modificadores de Acesso:** São palavras-chave em Java que definem a visibilidade de classes, atributos, métodos e construtores. Eles são a ferramenta principal para implementar o encapsulamento, controlando quem pode acessar o quê.
- **Getters e Setters:** São métodos públicos convencionais usados para ler (get) e modificar (set) o valor de atributos privados de uma classe. Eles servem como "portas de entrada e saída" controladas para os dados encapsulados, permitindo que a classe aplique validações ou lógica de negócio antes de expor ou alterar seus dados.

### 2\. Sumário

1. **Introdução ao Encapsulamento**
    - Definição e Importância
2. **Modificadores de Acesso em Detalhe**
    - `public`
    - `private`
    - `protected`
    - `default` (pacote)
3. **Getters e Setters**
    - Função e Implementação
    - Benefícios
4. **Exemplos de Código Otimizados**
    - Exemplo Básico de Encapsulamento
    - Exemplo com Validação em Setter
5. **Informações Adicionais**
    - Imutabilidade e Encapsulamento
    - Record Classes (Java 16+)
    - Frameworks e Encapsulamento
6. **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Modificadores de Acesso em Detalhe

Em Java, existem quatro modificadores de acesso que controlam a visibilidade de membros de uma classe:

- **`public`**
    - **Função:** O membro declarado como `public` é acessível de qualquer lugar, ou seja, de qualquer outra classe, dentro ou fora do pacote onde a classe está definida. É o modificador mais permissivo.
    - **Uso:** Geralmente usado para métodos que definem a interface pública da classe, ou para atributos constantes que devem ser acessíveis globalmente.
    - **Exemplo:**
        
        ```java
        public class MinhaClassePublica {
            public int atributoPublico; // Acessível de qualquer lugar
        
            public void metodoPublico() { // Acessível de qualquer lugar
                System.out.println("Método público.");
            }
        }
        
        ```
        
- **`private`**
    - **Função:** O membro declarado como `private` é acessível apenas dentro da própria classe onde foi declarado. É o modificador mais restritivo e o principal para implementar o encapsulamento.
    - **Uso:** Ideal para atributos (dados) e métodos auxiliares que não devem ser expostos ao mundo exterior, garantindo que o estado interno do objeto seja gerenciado apenas pela própria classe.
    - **Exemplo:**
        
        ```java
        public class Pessoa {
            private String nome; // Acessível apenas dentro da classe Pessoa
        
            private void metodoInterno() { // Acessível apenas dentro da classe Pessoa
                System.out.println("Método interno da Pessoa.");
            }
        }
        
        ```
        
- **`protected`**
    - **Função:** O membro declarado como `protected` é acessível dentro da própria classe, por classes no mesmo pacote, e por subclasses (classes que herdam) em *qualquer* pacote.
    - **Uso:** Usado quando você quer que certos membros sejam acessíveis por classes que herdam, mas não por outras classes não relacionadas.
    - **Exemplo:**
        
        ```java
        package com.exemplo.base;
        
        public class Animal {
            protected String especie; // Acessível por subclasses e classes no mesmo pacote
        
            protected void fazerSom() { // Acessível por subclasses e classes no mesmo pacote
                System.out.println("Som de animal.");
            }
        }
        
        ```
        
        ```java
        package com.exemplo.derivada; // Pacote diferente
        
        import com.exemplo.base.Animal;
        
        public class Cachorro extends Animal {
            public void latir() {
                this.fazerSom(); // Acessa método protected da superclasse
                System.out.println("Latido: Au Au!");
            }
        }
        
        ```
        
- **`default` (pacote)**
    - **Função:** Se nenhum modificador de acesso é especificado, o membro tem visibilidade `default` ou "package-private". Ele é acessível apenas dentro do mesmo pacote onde a classe está definida.
    - **Uso:** Utilizado para membros que precisam ser compartilhados entre classes que fazem parte da mesma unidade lógica (o mesmo pacote), mas não devem ser expostos para fora desse pacote.
    - **Exemplo:***Restrição de Uso:* Se a classe `GerenciadorDeConfig` estivesse em um pacote diferente, ela não conseguiria acessar `Configuracao`, `chaveInterna` ou `carregarPropriedades`.
        
        ```java
        package com.exemplo.util;
        
        class Configuracao { // Classe default (acessível apenas dentro de com.exemplo.util)
            String chaveInterna; // Atributo default (acessível apenas dentro de com.exemplo.util)
        
            void carregarPropriedades() { // Método default (acessível apenas dentro de com.exemplo.util)
                System.out.println("Carregando propriedades...");
            }
        }
        
        ```
        
        ```java
        package com.exemplo.util;
        
        public class GerenciadorDeConfig {
            public void iniciar() {
                Configuracao config = new Configuracao();
                config.chaveInterna = "valor123";
                config.carregarPropriedades();
            }
        }
        
        ```
        

### Getters e Setters

Getters e setters (também conhecidos como métodos de acesso e métodos de modificação) são a forma padrão de interagir com atributos privados em uma classe Java.

- **Função e Implementação:**
    - **Getter (método de acesso):** Responsável por retornar o valor de um atributo privado. Geralmente nomeado como `get<NomeDoAtributo>()`.
    - **Setter (método de modificação):** Responsável por definir ou alterar o valor de um atributo privado. Geralmente nomeado como `set<NomeDoAtributo>(valor)`.
    - **Sintaxe e Estrutura:**
        
        ```java
        public class Produto {
            private String nome; // Atributo encapsulado
            private double preco;
        
            // Getter para nome
            public String getNome() {
                return nome;
            }
        
            // Setter para nome
            public void setNome(String nome) {
                this.nome = nome;
            }
        
            // Getter para preco
            public double getPreco() {
                return preco;
            }
        
            // Setter para preco
            public void setPreco(double preco) {
                // Exemplo de validação no setter
                if (preco > 0) {
                    this.preco = preco;
                } else {
                    System.out.println("Preço não pode ser negativo ou zero.");
                }
            }
        }
        
        ```
        
- **Benefícios:**
    - **Controle de Acesso:** Permitem que a classe tenha controle total sobre como seus dados são acessados e modificados.
    - **Validação:** É possível adicionar lógica de validação nos setters para garantir que os dados sejam sempre válidos (por exemplo, um preço não pode ser negativo).
    - **Flexibilidade:** A implementação interna de um atributo pode mudar sem afetar o código externo que o utiliza, desde que os getters e setters mantenham a mesma assinatura.
    - **Manutenção:** Facilita a depuração e manutenção, pois as alterações nos dados devem passar por um ponto de controle conhecido (os setters).

### 4\. Exemplos de Código Otimizados

### Exemplo Básico de Encapsulamento

Este exemplo demonstra como o encapsulamento protege o estado de um objeto `ContaBancaria`.

```java
import java.math.BigDecimal;

public class ContaBancaria {
    private String numeroConta;
    private String titular;
    private BigDecimal saldo; // Usando BigDecimal para precisão em valores monetários

    public ContaBancaria(String numeroConta, String titular, BigDecimal saldoInicial) {
        // Construtor para inicializar a conta de forma controlada
        if (numeroConta == null || numeroConta.trim().isEmpty()) {
            throw new IllegalArgumentException("Número da conta não pode ser vazio.");
        }
        if (titular == null || titular.trim().isEmpty()) {
            throw new IllegalArgumentException("Titular da conta não pode ser vazio.");
        }
        if (saldoInicial.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo.");
        }
        this.numeroConta = numeroConta;
        this.titular = titular;
        this.saldo = saldoInicial;
    }

    // Getter para numeroConta (não há setter, pois o número da conta não deve mudar)
    public String getNumeroConta() {
        return numeroConta;
    }

    // Getter e Setter para titular
    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        if (titular == null || titular.trim().isEmpty()) {
            throw new IllegalArgumentException("Titular não pode ser vazio.");
        }
        this.titular = titular;
    }

    // Getter para saldo (não há setter direto para saldo, pois o saldo é alterado por métodos de depósito/saque)
    public BigDecimal getSaldo() {
        return saldo;
    }

    // Método de negócio para depósito
    public void depositar(BigDecimal valor) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor para depósito deve ser positivo.");
        }
        this.saldo = this.saldo.add(valor);
        System.out.println("Depósito de R$" + valor + " realizado. Saldo atual: R$" + this.saldo);
    }

    // Método de negócio para saque
    public void sacar(BigDecimal valor) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor para saque deve ser positivo.");
        }
        if (this.saldo.compareTo(valor) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente para o saque de R$" + valor + ". Saldo atual: R$" + this.saldo);
        }
        this.saldo = this.saldo.subtract(valor);
        System.out.println("Saque de R$" + valor + " realizado. Saldo atual: R$" + this.saldo);
    }

    public static void main(String[] args) {
        try {
            ContaBancaria minhaConta = new ContaBancaria("12345-6", "Luiz Gustavo Gomes Damasceno", new BigDecimal("1000.00"));
            System.out.println("Conta criada para: " + minhaConta.getTitular() + ", Número: " + minhaConta.getNumeroConta() + ", Saldo: R$" + minhaConta.getSaldo());

            minhaConta.depositar(new BigDecimal("250.00"));
            minhaConta.sacar(new BigDecimal("100.00"));

            // Tentativa de acesso ou alteração direta (não permitido devido ao private)
            // minhaConta.saldo = new BigDecimal("-500.00"); // Erro de compilação: saldo tem acesso private

            // Tentativa de saque indevido
            minhaConta.sacar(new BigDecimal("2000.00")); // Lançará uma IllegalArgumentException

        } catch (IllegalArgumentException e) {
            System.err.println("Erro na operação: " + e.getMessage());
        }
    }
}

```

**Caso de uso no dia a dia de um desenvolvedor:** Gedê, você como desenvolvedor Backend, está acostumado a lidar com entidades de negócio. O encapsulamento em um objeto `ContaBancaria` garante que o saldo seja sempre gerenciado pelos métodos `depositar` e `sacar`, que contêm a lógica de negócio e validações (como não permitir saldo negativo ou depósito de valor zero). Isso impede que um código externo altere o saldo de forma arbitrária, o que seria um risco enorme para a integridade dos dados financeiros.

### Exemplo com Validação em Setter

Aqui, a validação é aplicada no setter para o atributo `idade` de uma `Pessoa`.

```java
public class Pessoa {
    private String nome;
    private int idade;

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        setIdade(idade); // Usando o setter para garantir validação na construção
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        if (idade >= 0 && idade <= 150) { // Validação: idade deve ser entre 0 e 150
            this.idade = idade;
        } else {
            System.err.println("Idade inválida: " + idade + ". A idade deve estar entre 0 e 150.");
            // Em uma aplicação real, você lançaria uma exceção aqui
            // throw new IllegalArgumentException("Idade inválida.");
        }
    }

    public static void main(String[] args) {
        Pessoa p1 = new Pessoa("Juliana", 24); // Idade válida
        System.out.println(p1.getNome() + " tem " + p1.getIdade() + " anos.");

        Pessoa p2 = new Pessoa("João", -5); // Idade inválida na construção
        System.out.println(p2.getNome() + " tem " + p2.getIdade() + " anos (esperado 0, pois setter invalidou).");
        // Nota: Neste caso, a idade de João será 0 porque o setter não a alterou e o valor padrão de int é 0.
        // Em um sistema real, um erro seria lançado para impedir a criação de um objeto com estado inválido.

        p1.setIdade(170); // Tentando definir uma idade inválida
        System.out.println(p1.getNome() + " ainda tem " + p1.getIdade() + " anos (idade não foi alterada).");

        p1.setIdade(25); // Definindo uma idade válida
        System.out.println(p1.getNome() + " agora tem " + p1.getIdade() + " anos.");
    }
}

```

**Caso de uso no dia a dia de um desenvolvedor:** No backend, ao receber dados de um formulário de cadastro de usuário, por exemplo, você precisa garantir que a idade informada seja válida. O setter para `idade` encapsula essa regra de negócio, garantindo que o objeto `Pessoa` nunca terá uma idade inconsistente. Isso simplifica o código que interage com o objeto, pois a validação já está embutida.

### 5\. Informações Adicionais

- **Imutabilidade e Encapsulamento:**
Classes imutáveis são uma excelente aplicação do encapsulamento. Nelas, todos os atributos são `private` e `final`, e não existem métodos setters. Uma vez que o objeto é criado, seu estado não pode ser alterado. Isso é extremamente útil em concorrência, pois objetos imutáveis são naturalmente thread-safe. As `String` em Java são o exemplo mais comum de classe imutável.
- **Record Classes (Java 16+):**
As `record` classes, introduzidas no Java 16, são uma forma concisa de criar classes para manter dados imutáveis. Elas automaticamente geram um construtor canônico, getters para todos os componentes, métodos `equals()`, `hashCode()` e `toString()`. Embora simplifiquem a criação de classes de dados, elas ainda promovem o encapsulamento, pois os campos são implicitamente `private` e `final`.
    
    ```java
    public record Ponto(int x, int y) {
        // Record já implementa implicitamente getters (x(), y()) e construtor
        // Você pode adicionar métodos customizados, validações no construtor compacto, etc.
    }
    
    ```
    
    Isso é ótimo para economizar código e garantir a imutabilidade, Gedê\!
    
- **Frameworks e Encapsulamento:**
Frameworks como o Spring, que você já usa, Gedê, dependem fortemente do encapsulamento e da Injeção de Dependência (DI). Quando você anota uma classe com `@Component`, `@Service`, `@Repository` ou `@Controller`, o Spring gerencia a criação de instâncias (Beans) e a injeção de dependências. Embora você possa ter atributos que representam dependências (`@Autowired`), a maioria dos atributos de estado da sua lógica de negócio continuará sendo `private`, com acesso controlado por getters e setters ou por métodos que encapsulam a lógica de negócio.

### 6\. Referências para Estudo Independente

- **Documentação Oficial Java:**
    - [Controlling Access to Members of a Class](https://www.google.com/search?q=https://docs.oracle.com/javase/tutorial/java/javaOO/accessmodifers.html)
    - [The Java™ Tutorials - Classes and Objects](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)
    - [Records (Java 16 Feature)](https://docs.oracle.com/en/java/javase/16/language/records.html)
- **Artigos e Tutoriais:**
    - [GeeksforGeeks - Encapsulation in Java](https://www.geeksforgeeks.org/encapsulation-in-java/)
    - [Baeldung - A Guide to the Java `record` Type](https://www.google.com/search?q=%5Bhttps://www.baeldung.com/java-record-keyword%5D%5C(https://www.baeldung.com/java-record-keyword%5C))
- **Livros:**
    - **"Effective Java" por Joshua Bloch:** Um clássico para qualquer desenvolvedor Java. O Item 15, "Minimize mutability", e o Item 50, "Make defensive copies when necessary", são muito relevantes para o encapsulamento e imutabilidade.
    - **"Clean Code" por Robert C. Martin:** Embora não seja focado apenas em Java, os princípios de design de classes e ocultação de detalhes de implementação se aplicam diretamente ao encapsulamento.

---