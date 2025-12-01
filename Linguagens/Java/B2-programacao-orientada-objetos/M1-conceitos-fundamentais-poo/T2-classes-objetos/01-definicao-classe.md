# Definição de Classe

## 🎯 Introdução e Definição

**Classe é o conceito fundamental da POO** - é um **molde, blueprint ou template** que define a **estrutura e comportamento** de objetos. Uma classe especifica **o que um objeto terá (atributos)** e **o que um objeto fará (métodos)**.

**Conceito central**: Classe é a **abstração**, objeto é a **concretização**. Classe **define o tipo**, objetos são **instâncias** desse tipo. Uma classe é como uma **planta arquitetônica** de uma casa - define quartos, portas, janelas (estrutura), mas não é a casa em si. Objetos são as **casas construídas** a partir dessa planta.

**Analogia**: Classe é como **receita de bolo** (ingredientes e modo de preparo). Objeto é o **bolo feito** seguindo a receita. Você pode fazer **vários bolos** (objetos) a partir da **mesma receita** (classe).

**Definição formal**:
```
CLASSE = DADOS (atributos) + COMPORTAMENTOS (métodos)
```

**Exemplo fundamental**:
```java
// CLASSE Cachorro - define estrutura e comportamento
public class Cachorro {
    // ATRIBUTOS - características (dados)
    String nome;
    String raca;
    int idade;
    String cor;
    
    // MÉTODOS - ações (comportamentos)
    void latir() {
        System.out.println(nome + " está latindo: Au au!");
    }
    
    void comer(String alimento) {
        System.out.println(nome + " está comendo " + alimento);
    }
    
    void dormir() {
        System.out.println(nome + " está dormindo... Zzz");
    }
}

// OBJETOS - instâncias da classe Cachorro
Cachorro rex = new Cachorro();  // Objeto 1
rex.nome = "Rex";
rex.raca = "Labrador";
rex.idade = 3;
rex.cor = "Dourado";

Cachorro bob = new Cachorro();  // Objeto 2
bob.nome = "Bob";
bob.raca = "Poodle";
bob.idade = 5;
bob.cor = "Branco";

// Mesma classe, objetos diferentes
rex.latir();  // "Rex está latindo: Au au!"
bob.latir();  // "Bob está latindo: Au au!"
```

**Diferença crucial**:
- **Classe**: especificação, tipo, molde, abstração, **código**
- **Objeto**: instância, entidade concreta, **memória**

**Características de uma classe**:
1. **Nome** - identificador da classe (ex: `Cachorro`, `Pessoa`, `Conta`)
2. **Atributos** - variáveis que armazenam estado (ex: `nome`, `idade`)
3. **Métodos** - funções que definem comportamento (ex: `latir()`, `comer()`)
4. **Modificadores** - controlam acesso (ex: `public`, `private`)
5. **Construtores** - inicializam objetos

## 📋 Fundamentos Teóricos

### 1️⃣ Sintaxe de Declaração de Classe

**Estrutura básica**:
```java
[modificadores] class NomeDaClasse {
    // ATRIBUTOS (variáveis de instância)
    tipo nomeAtributo;
    
    // CONSTRUTOR
    public NomeDaClasse() {
        // Inicialização
    }
    
    // MÉTODOS
    tipoRetorno nomeMetodo(parametros) {
        // Corpo do método
    }
}
```

**Exemplo completo**:
```java
public class Pessoa {
    // ATRIBUTOS - estado do objeto
    String nome;
    int idade;
    String cpf;
    double altura;
    
    // CONSTRUTOR - inicializa objeto
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // MÉTODOS - comportamento do objeto
    void exibir() {
        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
    }
    
    void fazerAniversario() {
        this.idade++;
        System.out.println(nome + " fez " + idade + " anos!");
    }
    
    boolean isMaiorDeIdade() {
        return this.idade >= 18;
    }
}
```

**Modificadores de classe**:
```java
// public - acessível de qualquer lugar
public class Publica {
    // Pode ser usada em qualquer pacote
}

// Sem modificador (default/package-private) - acessível só no mesmo pacote
class PacotePrivada {
    // Só classes do mesmo pacote podem usar
}

// abstract - não pode ser instanciada
public abstract class Abstrata {
    // Serve como base para outras classes
}

// final - não pode ser estendida (herança)
public final class Final {
    // Não pode ter subclasses
}
```

**Convenções de nomenclatura**:
```java
// ✓ PascalCase - primeira letra maiúscula
public class ContaBancaria { }
public class PedidoVenda { }
public class ClienteEspecial { }

// ❌ Evitar
public class conta_bancaria { }  // snake_case
public class pedidovenda { }      // tudo minúsculo
public class PEDIDO { }           // tudo maiúsculo
```

### 2️⃣ Classe como Molde - Template Pattern

**Conceito**: Classe define **estrutura comum** que todos os objetos desse tipo compartilham.

**Exemplo - classe Livro**:
```java
public class Livro {
    // MOLDE - todos os livros têm estes atributos
    String titulo;
    String autor;
    String isbn;
    int anoPublicacao;
    double preco;
    int numeroPaginas;
    boolean disponivel;
    
    // MOLDE - todos os livros podem fazer isso
    void emprestar() {
        if (this.disponivel) {
            this.disponivel = false;
            System.out.println("Livro '" + titulo + "' emprestado");
        } else {
            System.out.println("Livro indisponível");
        }
    }
    
    void devolver() {
        this.disponivel = true;
        System.out.println("Livro '" + titulo + "' devolvido");
    }
    
    void exibirInfo() {
        System.out.println("Título: " + titulo);
        System.out.println("Autor: " + autor);
        System.out.println("Ano: " + anoPublicacao);
        System.out.println("Páginas: " + numeroPaginas);
    }
}

// OBJETOS criados a partir do MOLDE
Livro livro1 = new Livro();
livro1.titulo = "Clean Code";
livro1.autor = "Robert Martin";
livro1.isbn = "978-0132350884";
livro1.anoPublicacao = 2008;
livro1.numeroPaginas = 464;
livro1.disponivel = true;

Livro livro2 = new Livro();
livro2.titulo = "Design Patterns";
livro2.autor = "Gang of Four";
livro2.isbn = "978-0201633610";
livro2.anoPublicacao = 1994;
livro2.numeroPaginas = 395;
livro2.disponivel = true;

// Mesma estrutura, dados diferentes
livro1.exibirInfo();
livro2.exibirInfo();
```

**Classe define tipo**:
```java
// Classe Carro define novo TIPO de dado
public class Carro {
    String marca;
    String modelo;
    int ano;
    
    void ligar() {
        System.out.println("Carro ligado");
    }
}

// Agora "Carro" é um tipo, como int, String
Carro meuCarro;  // Declaração de variável do tipo Carro
int numero;      // Declaração de variável do tipo int
String texto;    // Declaração de variável do tipo String
```

### 3️⃣ Componentes de uma Classe

**1. Atributos (Estado)**:
```java
public class Produto {
    // Atributos - características do produto
    String nome;          // Nome do produto
    double preco;         // Preço em reais
    int quantidadeEstoque;  // Quantidade disponível
    String categoria;     // Categoria do produto
    boolean ativo;        // Se está ativo no catálogo
}
```

**2. Métodos (Comportamento)**:
```java
public class Produto {
    String nome;
    double preco;
    int quantidadeEstoque;
    
    // Métodos - ações que o produto pode realizar
    void adicionarEstoque(int quantidade) {
        this.quantidadeEstoque += quantidade;
        System.out.println("Estoque adicionado: " + quantidade);
    }
    
    boolean removerEstoque(int quantidade) {
        if (this.quantidadeEstoque >= quantidade) {
            this.quantidadeEstoque -= quantidade;
            return true;
        }
        return false;
    }
    
    double calcularPrecoComDesconto(double percentual) {
        return this.preco * (1 - percentual / 100);
    }
    
    void exibirInfo() {
        System.out.println("Produto: " + nome);
        System.out.println("Preço: R$ " + preco);
        System.out.println("Estoque: " + quantidadeEstoque);
    }
}
```

**3. Construtores (Inicialização)**:
```java
public class Produto {
    String nome;
    double preco;
    int quantidadeEstoque;
    
    // Construtor - inicializa objeto
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
        this.quantidadeEstoque = 0;  // Valor padrão
    }
    
    // Sobrecarga de construtor
    public Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.quantidadeEstoque = estoque;
    }
}

// Uso
Produto p1 = new Produto("Notebook", 3000);
Produto p2 = new Produto("Mouse", 50, 100);
```

### 4️⃣ Classe vs Objeto - Diferenças Fundamentais

**Comparação**:

| Aspecto | Classe | Objeto |
|---------|--------|--------|
| **Natureza** | Abstração, molde, tipo | Instância concreta |
| **Existência** | Tempo de compilação | Tempo de execução |
| **Localização** | Arquivo .java | Memória heap |
| **Quantidade** | Uma classe | Muitos objetos |
| **Memória** | Não ocupa memória de dados | Ocupa memória heap |
| **Declaração** | `class Nome { }` | `new Nome()` |

**Exemplo demonstrativo**:
```java
// CLASSE - definição (código-fonte)
public class Conta {
    double saldo;
    String titular;
    
    void depositar(double valor) {
        saldo += valor;
    }
}

// OBJETOS - instâncias (memória)
Conta conta1 = new Conta();  // Objeto 1 na memória
conta1.saldo = 1000;
conta1.titular = "João";

Conta conta2 = new Conta();  // Objeto 2 na memória
conta2.saldo = 2000;
conta2.titular = "Maria";

Conta conta3 = new Conta();  // Objeto 3 na memória
conta3.saldo = 500;
conta3.titular = "Pedro";

// 1 classe Conta (código)
// 3 objetos Conta (memória)
// Cada objeto tem seu próprio saldo e titular
```

**Memória - visualização**:
```
CÓDIGO (Classe):
┌─────────────────┐
│ class Conta {   │
│   double saldo; │
│   String tit;   │
│   void dep() {} │
│ }               │
└─────────────────┘

HEAP (Objetos):
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Conta@1a2b      │  │ Conta@3c4d      │  │ Conta@5e6f      │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ saldo: 1000     │  │ saldo: 2000     │  │ saldo: 500      │
│ titular: "João" │  │ titular: "Maria"│  │ titular: "Pedro"│
└─────────────────┘  └─────────────────┘  └─────────────────┘
     conta1               conta2               conta3
```

### 5️⃣ Encapsulamento em Classes

**Conceito**: Classes **encapsulam** (escondem) detalhes internos.

**Sem encapsulamento**:
```java
// ❌ Dados públicos - qualquer código pode modificar
public class ContaRuim {
    public double saldo;  // Exposto
    public String titular;
    
    public void sacar(double valor) {
        saldo -= valor;  // Sem validação
    }
}

// Uso perigoso
ContaRuim conta = new ContaRuim();
conta.saldo = 1000;
conta.saldo = -500;  // ❌ Saldo negativo!
conta.saldo = 999999999;  // ❌ Sem validação
```

**Com encapsulamento**:
```java
// ✓ Dados privados - acesso controlado
public class ContaBoa {
    private double saldo;  // Protegido
    private String titular;
    
    public ContaBoa(String titular) {
        this.titular = titular;
        this.saldo = 0.0;
    }
    
    // Acesso controlado com validação
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
        } else {
            System.out.println("Valor deve ser positivo");
        }
    }
    
    public boolean sacar(double valor) {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            return true;
        }
        return false;
    }
    
    public double getSaldo() {
        return this.saldo;  // Read-only
    }
}

// Uso seguro
ContaBoa conta = new ContaBoa("João");
conta.depositar(1000);  // ✓ Validado
// conta.saldo = -500;  // ❌ Não compila - saldo é private
conta.sacar(200);  // ✓ Validado
```

### 6️⃣ Coesão de Classe

**Conceito**: Classe deve ter **responsabilidade única** e **bem definida**.

**Classe coesa (boa)**:
```java
// ✓ Classe foca apenas em Produto
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    
    // Métodos relacionados APENAS a Produto
    public void adicionarEstoque(int quantidade) { }
    public boolean removerEstoque(int quantidade) { }
    public double calcularPrecoComDesconto(double desc) { }
}
```

**Classe não coesa (ruim)**:
```java
// ❌ Classe faz coisas demais (God Class)
public class SistemaRuim {
    // Mistura responsabilidades
    public void cadastrarProduto() { }
    public void processarPedido() { }
    public void enviarEmail() { }
    public void calcularFrete() { }
    public void gerarRelatorio() { }
    public void validarCPF() { }
    public void conectarBancoDados() { }
    // Muitas responsabilidades diferentes!
}

// ✓ Separar em classes coesas
public class Produto { }
public class Pedido { }
public class EmailService { }
public class CalculadoraFrete { }
public class RelatorioService { }
public class ValidadorCPF { }
public class DatabaseConnection { }
```

### 7️⃣ Classes Aninhadas (Inner Classes)

**Classe dentro de classe**:
```java
// Classe externa
public class Carro {
    private String modelo;
    private Motor motor;
    
    public Carro(String modelo) {
        this.modelo = modelo;
        this.motor = new Motor();  // Classe interna
    }
    
    // Classe interna (inner class)
    private class Motor {
        private double cilindrada;
        private String tipo;
        
        public void ligar() {
            System.out.println("Motor do " + modelo + " ligado");
            // Pode acessar atributos da classe externa
        }
    }
    
    public void ligarCarro() {
        motor.ligar();
    }
}
```

**Classe estática aninhada**:
```java
public class Empresa {
    private String nome;
    
    // Classe estática aninhada
    public static class Departamento {
        private String nome;
        
        public Departamento(String nome) {
            this.nome = nome;
        }
    }
}

// Uso
Empresa.Departamento ti = new Empresa.Departamento("TI");
```

### 8️⃣ Classe Abstrata vs Concreta

**Classe concreta - pode ser instanciada**:
```java
public class Cachorro {
    String nome;
    
    void latir() {
        System.out.println("Au au!");
    }
}

// ✓ Pode criar objetos
Cachorro dog = new Cachorro();
```

**Classe abstrata - NÃO pode ser instanciada**:
```java
public abstract class Animal {
    String nome;
    
    // Método abstrato - sem implementação
    public abstract void emitirSom();
    
    // Método concreto
    public void dormir() {
        System.out.println(nome + " está dormindo");
    }
}

// ❌ Não pode instanciar
// Animal animal = new Animal();  // Erro!

// ✓ Deve criar subclasse concreta
public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

Cachorro dog = new Cachorro();  // ✓ OK
```

### 9️⃣ Classe Final - Não Pode Ser Estendida

**Classe final**:
```java
// Classe final - não permite herança
public final class String {
    // Implementação da classe String do Java
    // Não pode ser estendida
}

// ❌ Não pode estender classe final
// public class MinhaString extends String { }  // Erro!
```

**Quando usar final**:
```java
// ✓ Classes utilitárias
public final class MathUtils {
    // Métodos estáticos
    public static double calcular(double a, double b) {
        return a + b;
    }
}

// ✓ Classes de segurança
public final class SecurityManager {
    // Não permite sobrescrever segurança
}

// ✓ Classes imutáveis
public final class Cpf {
    private final String numero;
    
    public Cpf(String numero) {
        this.numero = numero;
    }
}
```

### 🔟 Organização de Classes em Pacotes

**Pacotes agrupam classes relacionadas**:
```java
// Arquivo: com/empresa/model/Produto.java
package com.empresa.model;

public class Produto {
    private String nome;
    private double preco;
}

// Arquivo: com/empresa/model/Cliente.java
package com.empresa.model;

public class Cliente {
    private String nome;
    private String cpf;
}

// Arquivo: com/empresa/service/ProdutoService.java
package com.empresa.service;

import com.empresa.model.Produto;  // Importa classe de outro pacote

public class ProdutoService {
    public void salvar(Produto produto) {
        // Lógica de negócio
    }
}
```

**Estrutura de diretórios**:
```
src/
  com/
    empresa/
      model/
        Produto.java
        Cliente.java
      service/
        ProdutoService.java
      controller/
        ProdutoController.java
```

## 🎯 Aplicabilidade

**1. Modelagem de entidades**:
```java
public class Cliente { }
public class Produto { }
public class Pedido { }
```

**2. Serviços**:
```java
public class EmailService { }
public class PagamentoService { }
```

**3. Utilitários**:
```java
public class StringUtils { }
public class DateUtils { }
```

**4. Controladores**:
```java
public class ProdutoController { }
```

**5. Modelos de dados**:
```java
public class ProdutoDTO { }
```

## ⚠️ Armadilhas Comuns

**1. God Class**:
```java
// ❌ Classe faz tudo
public class Sistema {
    // 100 métodos diferentes
}
```

**2. Classe anêmica**:
```java
// ❌ Só getters/setters
public class Produto {
    private String nome;
    public String getNome() { return nome; }
    public void setNome(String n) { nome = n; }
}
```

**3. Nomes genéricos**:
```java
// ❌ Nomes ruins
public class Manager { }
public class Helper { }
public class Util { }
public class Data { }
```

**4. Muitos atributos públicos**:
```java
// ❌ Sem encapsulamento
public class Conta {
    public double saldo;
    public String senha;
}
```

**5. Responsabilidades misturadas**:
```java
// ❌ Produto gerencia banco de dados?
public class Produto {
    public void salvarNoBanco() { }
}
```

## ✅ Boas Práticas

**1. Nome significativo**:
```java
public class ContaBancaria { }  // ✓ Claro
```

**2. Responsabilidade única**:
```java
public class Produto {
    // Só lida com Produto
}
```

**3. Encapsular dados**:
```java
private double saldo;
public double getSaldo() { }
```

**4. Construtores adequados**:
```java
public Produto(String nome, double preco) {
    this.nome = nome;
    this.preco = preco;
}
```

**5. Coesão alta**:
```java
// Métodos relacionados ao conceito da classe
```

**6. Comentários quando necessário**:
```java
/**
 * Representa um produto no catálogo.
 */
public class Produto { }
```

## 📚 Resumo Executivo

**Classe é o molde, objeto é a instância**.

**Definição**:
```java
public class NomeDaClasse {
    // Atributos
    tipo nomeAtributo;
    
    // Construtor
    public NomeDaClasse() { }
    
    // Métodos
    tipo nomeMetodo() { }
}
```

**Componentes**:
- **Atributos**: estado
- **Métodos**: comportamento
- **Construtores**: inicialização

**Classe vs Objeto**:
```java
class Carro { }  // Molde
Carro c1 = new Carro();  // Instância 1
Carro c2 = new Carro();  // Instância 2
```

**Modificadores**:
- `public` - acessível de qualquer lugar
- `abstract` - não pode instanciar
- `final` - não pode estender

**Encapsulamento**:
```java
private double saldo;  // Protegido
public double getSaldo() { return saldo; }
```

**Convenções**:
- PascalCase: `ContaBancaria`
- Um arquivo = uma classe pública
- Nome do arquivo = nome da classe

**Princípios**:
- Responsabilidade única
- Alta coesão
- Baixo acoplamento

**Recomendação**: Classes devem ser **coesas** (responsabilidade única), **encapsuladas** (dados privados), com **nomes significativos** do domínio. **Evite God Classes** que fazem tudo. Prefira **classes pequenas e focadas**.