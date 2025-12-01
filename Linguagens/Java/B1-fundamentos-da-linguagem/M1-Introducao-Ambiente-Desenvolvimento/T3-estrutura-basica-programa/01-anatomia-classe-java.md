# Anatomia de uma Classe Java

## 🎯 Introdução e Definição

### Definição Conceitual

A **anatomia de uma classe Java** refere-se à **estrutura formal e sintática** que define como uma classe deve ser construída, incluindo seus componentes obrigatórios e opcionais, ordem de declaração, modificadores de acesso e elementos constituintes. Uma classe Java é a **unidade fundamental de organização de código** - um blueprint (molde) que encapsula dados (atributos) e comportamentos (métodos) relacionados em uma única entidade coesa.

Compreender a anatomia de uma classe não é memorizar sintaxe mecanicamente, mas entender **princípios arquiteturais** que governam como Java organiza código de forma modular, reutilizável e orientada a objetos. Cada elemento de uma classe tem **propósito específico** e **regras de posicionamento** que garantem clareza, manutenibilidade e compilação correta.

### Contexto Histórico e Motivação

#### O Problema: Programação Procedural Sem Organização

Antes de linguagens orientadas a objetos dominarem (anos 1970-1980), programas eram escritos em **paradigma procedural** (C, Pascal, FORTRAN):

**Estrutura Típica em C**:
```c
// Tudo misturado: variáveis globais + funções
int saldo = 1000;
char titular[50] = "João Silva";

void depositar(int valor) {
    saldo += valor;
}

void sacar(int valor) {
    if (saldo >= valor) {
        saldo -= valor;
    }
}

int main() {
    depositar(500);
    sacar(200);
    return 0;
}
```

**Problemas**:
- **Dados Desprotegidos**: Qualquer função pode modificar `saldo` diretamente
- **Sem Encapsulamento**: Não há relação formal entre dados (`saldo`, `titular`) e funções (`depositar`, `sacar`)
- **Escalabilidade Ruim**: Para 1000 contas, precisaria de 1000 variáveis globais separadas
- **Manutenção Difícil**: Mudanças em estrutura de dados afetam todo programa

#### A Solução: Classes como Unidades de Organização

Java (1995) herdou conceito de **classes** de Smalltalk (1972) e C++ (1983):

**Mesma Lógica em Java**:
```java
public class ContaBancaria {
    // Dados encapsulados dentro da classe
    private int saldo = 1000;
    private String titular = "João Silva";
    
    // Comportamentos associados aos dados
    public void depositar(int valor) {
        saldo += valor;
    }
    
    public void sacar(int valor) {
        if (saldo >= valor) {
            saldo -= valor;
        }
    }
}

// Uso: Criar múltiplas instâncias
public class Main {
    public static void main(String[] args) {
        ContaBancaria conta1 = new ContaBancaria();
        ContaBancaria conta2 = new ContaBancaria();
        conta1.depositar(500);
        conta2.sacar(100);
    }
}
```

**Vantagens**:
- **Encapsulamento**: Dados (`saldo`) protegidos por modificador `private`
- **Organização**: Tudo relacionado a conta bancária está em **uma unidade**
- **Reutilização**: Criar 1000 contas = criar 1000 objetos
- **Manutenção**: Mudanças em `ContaBancaria` não afetam outras classes

### Problema Fundamental que Resolve

A anatomia estruturada de classes Java resolve **três problemas fundamentais**:

#### 1. Organização Lógica de Código

**Problema**: Em arquivos com milhares de linhas, como encontrar código relacionado?

**Solução**: Classes agrupam **dados e comportamentos relacionados**:
```java
// Tudo sobre "Pessoa" está aqui
class Pessoa {
    String nome;
    int idade;
    void envelhecer() { idade++; }
}

// Tudo sobre "Produto" está aqui
class Produto {
    String nome;
    double preco;
    void aplicarDesconto(double percentual) {
        preco *= (1 - percentual/100);
    }
}
```

#### 2. Proteção de Dados (Encapsulamento)

**Problema**: Como evitar que código externo corrompa dados internos?

**Solução**: Modificadores de acesso (`private`, `public`) controlam visibilidade:
```java
class ContaBancaria {
    private double saldo;  // Ninguém de fora pode acessar diretamente
    
    public void depositar(double valor) {
        if (valor > 0) {  // Validação
            saldo += valor;
        }
    }
    
    public double getSaldo() {
        return saldo;  // Leitura controlada
    }
}
```

#### 3. Reutilização e Escalabilidade

**Problema**: Como criar múltiplas "cópias" de estrutura de dados sem duplicar código?

**Solução**: Classes são **moldes** para criar objetos:
```java
class Livro {
    String titulo;
    String autor;
    int paginas;
}

// Criar biblioteca inteira sem duplicar estrutura
Livro livro1 = new Livro();
livro1.titulo = "1984";

Livro livro2 = new Livro();
livro2.titulo = "O Senhor dos Anéis";

// 1000 livros = 1000 objetos da mesma classe
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Classe como Blueprint**: Molde que define estrutura, não é objeto concreto
2. **Componentes Obrigatórios**: Palavra-chave `class`, nome da classe, corpo `{}`
3. **Componentes Opcionais**: Modificadores, pacote, imports, superclasse, interfaces
4. **Ordem de Declaração**: Pacote → Imports → Classe → Membros
5. **Arquivo .java**: Uma classe pública por arquivo, nome do arquivo = nome da classe

### Pilares Fundamentais

- **Declaração de Classe**: `[modificadores] class NomeDaClasse { ... }`
- **Membros da Classe**: Atributos (dados) + Métodos (comportamentos)
- **Modificadores de Acesso**: `public`, `private`, `protected`, default (package-private)
- **Membros Estáticos vs Instância**: `static` (compartilhado) vs não-static (individual)
- **Construtores**: Métodos especiais para inicializar objetos

### Visão Geral das Nuances

- **Classe Pública**: Apenas uma por arquivo, nome deve coincidir com arquivo
- **Classes Internas**: Classes dentro de classes (nested classes)
- **Blocos de Inicialização**: Código executado antes de construtores
- **Ordem de Execução**: Blocos estáticos → Blocos de instância → Construtor

---

## 🧠 Fundamentos Teóricos

### Estrutura Completa de uma Classe Java

Uma classe Java tem **estrutura hierárquica bem definida**:

```java
// 1. DECLARAÇÃO DE PACOTE (opcional mas recomendado)
package com.empresa.projeto.modulo;

// 2. IMPORTS (opcional)
import java.util.ArrayList;
import java.util.List;

// 3. COMENTÁRIO DE DOCUMENTAÇÃO (opcional mas recomendado)
/**
 * Classe que representa um cliente do sistema.
 * 
 * @author João Silva
 * @version 1.0
 * @since 2024-01-15
 */
// 4. MODIFICADORES DA CLASSE + PALAVRA-CHAVE class + NOME
public class Cliente {
    
    // 5. ATRIBUTOS ESTÁTICOS (VARIÁVEIS DE CLASSE)
    private static int contadorClientes = 0;
    public static final String TIPO_PADRAO = "COMUM";
    
    // 6. BLOCO DE INICIALIZAÇÃO ESTÁTICO
    static {
        System.out.println("Classe Cliente carregada");
        contadorClientes = 0;
    }
    
    // 7. ATRIBUTOS DE INSTÂNCIA (VARIÁVEIS DE INSTÂNCIA)
    private String nome;
    private String cpf;
    private int idade;
    private List<String> telefones;
    
    // 8. BLOCO DE INICIALIZAÇÃO DE INSTÂNCIA
    {
        telefones = new ArrayList<>();
        contadorClientes++;
    }
    
    // 9. CONSTRUTORES
    // Construtor padrão
    public Cliente() {
        this.nome = "Cliente Sem Nome";
    }
    
    // Construtor parametrizado
    public Cliente(String nome, String cpf, int idade) {
        this.nome = nome;
        this.cpf = cpf;
        this.idade = idade;
    }
    
    // 10. MÉTODOS DE INSTÂNCIA (COMPORTAMENTOS)
    public void adicionarTelefone(String telefone) {
        telefones.add(telefone);
    }
    
    public void exibirInformacoes() {
        System.out.println("Nome: " + nome);
        System.out.println("CPF: " + cpf);
        System.out.println("Idade: " + idade);
    }
    
    // 11. GETTERS E SETTERS
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    // 12. MÉTODOS ESTÁTICOS (UTILITÁRIOS)
    public static int getContadorClientes() {
        return contadorClientes;
    }
    
    public static boolean validarCPF(String cpf) {
        return cpf != null && cpf.length() == 11;
    }
    
    // 13. MÉTODOS SOBRESCRITOS DE Object
    @Override
    public String toString() {
        return "Cliente{nome='" + nome + "', cpf='" + cpf + "'}";
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Cliente cliente = (Cliente) obj;
        return cpf.equals(cliente.cpf);
    }
    
    // 14. CLASSES INTERNAS (NESTED CLASSES)
    public class Endereco {
        private String rua;
        private String cidade;
        
        public Endereco(String rua, String cidade) {
            this.rua = rua;
            this.cidade = cidade;
        }
    }
}
```

### Dissecando Cada Componente

#### 1. Declaração de Pacote

**Sintaxe**: `package nome.do.pacote;`

**Propósito**: Organizar classes em namespaces hierárquicos

**Regras**:
- Deve ser **primeira linha de código** (exceto comentários)
- Apenas **uma declaração** package por arquivo
- Convenção: domínio invertido (ex: `com.google.maps`)
- Corresponde a estrutura de diretórios

**Exemplo**:
```java
package com.empresa.financeiro.contas;
// Arquivo deve estar em: com/empresa/financeiro/contas/ContaBancaria.java
```

**Sem Pacote (Default Package)**:
```java
// Sem declaração package
class MinhaClasse { }
// Classe fica em "default package" (não recomendado)
```

#### 2. Imports

**Sintaxe**: `import pacote.Classe;` ou `import pacote.*;`

**Propósito**: Usar classes de outros pacotes sem qualificar nome completo

**Tipos**:
```java
// Import específico (recomendado)
import java.util.ArrayList;
import java.util.List;

// Import wildcard (menos específico)
import java.util.*;

// Import estático (para membros static)
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;
```

**Sem Import** (Fully Qualified Name):
```java
// Sem import, usa nome completo
java.util.ArrayList<String> lista = new java.util.ArrayList<>();
```

**Pacote java.lang** (Importado Automaticamente):
```java
// Não precisa importar: String, System, Math, Integer, etc.
String texto = "Hello";
System.out.println(texto);
```

#### 3. Modificadores de Classe

**Modificadores de Acesso**:

| Modificador | Visibilidade                                     |
|-------------|--------------------------------------------------|
| `public`    | Acessível de qualquer lugar                     |
| (padrão)    | Acessível apenas no mesmo pacote (package-private) |

```java
// Pública: acessível de qualquer pacote
public class ClassePublica { }

// Package-private: acessível apenas no mesmo pacote
class ClassePackagePrivate { }
```

**Outros Modificadores**:

```java
// Abstrata: não pode ser instanciada
abstract class ClasseAbstrata {
    abstract void metodoAbstrato();
}

// Final: não pode ser herdada
final class ClasseFinal { }

// Não pode ser abstract E final simultaneamente (contradição)
```

#### 4. Palavra-chave `class`

**Obrigatória**: Define que estamos declarando uma classe

**Sintaxe**: `class NomeDaClasse`

**Variações**:
```java
class Simples { }                    // Classe simples
class Filha extends Pai { }          // Herança
class Impl implements Interface { }  // Implementação de interface
class Multi extends Pai implements I1, I2 { }  // Herança + Múltiplas interfaces
```

#### 5. Nome da Classe

**Convenções (PascalCase)**:
```java
class Produto { }           // ✅ Correto
class ProdutoAlimenticio { } // ✅ Correto
class HTTPServer { }        // ✅ Acrônimos em maiúsculas (aceitável)

class produto { }           // ❌ Evitar: minúscula
class produto_alimenticio { } // ❌ Evitar: snake_case
```

**Regras Sintáticas**:
- Deve começar com **letra, underscore (_) ou cifrão ($)**
- Pode conter letras, dígitos, `_`, `$`
- Não pode ser palavra-chave (`class`, `int`, `public`)
- Case-sensitive: `Pessoa` ≠ `pessoa`

**Relação com Nome de Arquivo**:
```java
// Arquivo: ContaBancaria.java
public class ContaBancaria { }  // ✅ Correto

// Arquivo: ContaBancaria.java
public class Conta { }  // ❌ ERRO: nome não coincide

// Arquivo: Util.java
public class Util { }           // ✅ Classe pública
class Helper { }                // ✅ Classe package-private no mesmo arquivo
class Calculator { }            // ✅ Várias classes não-públicas OK
```

#### 6. Corpo da Classe `{}`

**Obrigatório**: Delimitadores do corpo da classe

```java
class Vazia { }  // Classe vazia é válida

class ComMembros {
    int atributo;
    void metodo() { }
}
```

### Atributos (Campos/Variáveis de Instância)

#### Declaração de Atributos

**Sintaxe**: `[modificadores] tipo nomeDoAtributo [= valorInicial];`

```java
class Pessoa {
    // Atributos de instância (cada objeto tem sua cópia)
    private String nome;
    private int idade;
    private double altura = 1.70;  // Com valor inicial
    
    // Atributos estáticos (compartilhados por todos objetos)
    private static int contadorPessoas = 0;
    public static final String ESPECIE = "Homo Sapiens";  // Constante
}
```

**Modificadores de Acesso em Atributos**:

```java
class Exemplo {
    public int publico;        // Acessível de qualquer lugar (evitar)
    private int privado;       // Apenas dentro da classe (recomendado)
    protected int protegido;   // Mesmo pacote + subclasses
    int packagePrivate;        // Apenas mesmo pacote (sem modificador)
}
```

**Ordem de Declaração** (Convenção):
```java
class Organizada {
    // 1. Constantes públicas estáticas
    public static final int MAX_TENTATIVAS = 3;
    
    // 2. Variáveis estáticas privadas
    private static int contador = 0;
    
    // 3. Variáveis de instância privadas
    private String nome;
    private int idade;
    
    // 4. Construtores, métodos...
}
```

### Métodos

#### Declaração de Métodos

**Sintaxe Completa**:
```java
[modificadores] tipoDeRetorno nomeDoMetodo([parâmetros]) [throws exceções] {
    // Corpo do método
    [return valor;]
}
```

**Exemplos**:
```java
class Calculadora {
    // Método público que retorna int
    public int somar(int a, int b) {
        return a + b;
    }
    
    // Método privado sem retorno (void)
    private void validarEntrada(int valor) {
        if (valor < 0) {
            throw new IllegalArgumentException("Valor negativo");
        }
    }
    
    // Método estático (não precisa de objeto)
    public static double calcularMedia(double[] valores) {
        double soma = 0;
        for (double v : valores) {
            soma += v;
        }
        return soma / valores.length;
    }
    
    // Método que lança exceção
    public int dividir(int a, int b) throws ArithmeticException {
        if (b == 0) {
            throw new ArithmeticException("Divisão por zero");
        }
        return a / b;
    }
}
```

**Assinatura de Método**: Nome + Parâmetros (tipo e ordem)

```java
void metodo(int x) { }           // Assinatura: metodo(int)
void metodo(int x, String y) { } // Assinatura: metodo(int, String)
void metodo(String y, int x) { } // Assinatura: metodo(String, int) - DIFERENTE!
```

### Construtores

**Definição**: Métodos especiais para inicializar objetos

**Características**:
- **Nome idêntico** à classe
- **Sem tipo de retorno** (nem `void`)
- Chamado automaticamente ao criar objeto com `new`

```java
class Produto {
    private String nome;
    private double preco;
    
    // Construtor padrão (sem parâmetros)
    public Produto() {
        this.nome = "Produto Genérico";
        this.preco = 0.0;
    }
    
    // Construtor parametrizado
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    // Sobrecarga de construtores
    public Produto(String nome) {
        this(nome, 0.0);  // Chama outro construtor
    }
}

// Uso:
Produto p1 = new Produto();                    // Usa construtor padrão
Produto p2 = new Produto("Notebook", 2500.0);  // Usa construtor parametrizado
Produto p3 = new Produto("Mouse");             // Usa construtor com 1 parâmetro
```

**Construtor Padrão Automático**:
```java
class Simples {
    // Java gera automaticamente:
    // public Simples() { }
}

class ComConstrutor {
    public ComConstrutor(int x) { }
    // Java NÃO gera construtor padrão (você já definiu um)
}
```

### Blocos de Inicialização

#### Bloco de Inicialização Estático

**Executado**: Uma vez, quando classe é carregada pela JVM

```java
class Configuracao {
    private static Properties config;
    
    static {
        System.out.println("Carregando configurações...");
        config = new Properties();
        // Carregar arquivo de configuração
        // Este código roda ANTES de qualquer construtor
    }
}
```

#### Bloco de Inicialização de Instância

**Executado**: Antes do construtor, para cada objeto criado

```java
class Exemplo {
    private List<String> lista;
    
    {
        System.out.println("Bloco de instância executado");
        lista = new ArrayList<>();
        lista.add("Item padrão");
    }
    
    public Exemplo() {
        System.out.println("Construtor executado");
    }
}

// Ordem de execução:
// 1. Bloco de instância
// 2. Construtor
```

### Ordem de Execução Completa

```java
class TesteOrdem {
    // 1. Variável estática com inicialização
    private static int varEstatica = inicializarEstatica();
    
    // 2. Bloco estático
    static {
        System.out.println("2. Bloco estático");
    }
    
    // 3. Variável de instância com inicialização
    private int varInstancia = inicializarInstancia();
    
    // 4. Bloco de instância
    {
        System.out.println("4. Bloco de instância");
    }
    
    // 5. Construtor
    public TesteOrdem() {
        System.out.println("5. Construtor");
    }
    
    private static int inicializarEstatica() {
        System.out.println("1. Inicialização estática");
        return 10;
    }
    
    private int inicializarInstancia() {
        System.out.println("3. Inicialização de instância");
        return 20;
    }
    
    public static void main(String[] args) {
        System.out.println("--- Criando primeiro objeto ---");
        new TesteOrdem();
        System.out.println("--- Criando segundo objeto ---");
        new TesteOrdem();
    }
}
```

**Saída**:
```
1. Inicialização estática
2. Bloco estático
--- Criando primeiro objeto ---
3. Inicialização de instância
4. Bloco de instância
5. Construtor
--- Criando segundo objeto ---
3. Inicialização de instância
4. Bloco de instância
5. Construtor
```

**Observação**: Blocos/variáveis estáticas executam **apenas uma vez** (primeira vez que classe é usada).

---

## 🔍 Análise Conceitual Profunda

### Classe vs Objeto: Diferença Fundamental

**Classe**: Blueprint (molde/planta)
**Objeto**: Instância concreta da classe

```java
// CLASSE: Definição abstrata
class Carro {
    String modelo;
    int ano;
    
    void acelerar() {
        System.out.println("Acelerando...");
    }
}

// OBJETOS: Instâncias concretas
Carro carro1 = new Carro();  // Objeto 1
carro1.modelo = "Civic";
carro1.ano = 2020;

Carro carro2 = new Carro();  // Objeto 2 (independente de carro1)
carro2.modelo = "Corolla";
carro2.ano = 2021;
```

**Analogia**:
- **Classe** = Planta de uma casa (papel com desenho)
- **Objeto** = Casa construída (estrutura física)
- Você pode construir 1000 casas a partir da mesma planta

### Membros Estáticos vs Membros de Instância

**Membros de Instância**: Cada objeto tem sua própria cópia

```java
class Contador {
    private int valor = 0;  // Instância
    
    public void incrementar() {
        valor++;
    }
}

Contador c1 = new Contador();
Contador c2 = new Contador();
c1.incrementar();  // c1.valor = 1
c2.incrementar();  // c2.valor = 1 (independente de c1)
```

**Membros Estáticos**: Compartilhados por todos objetos

```java
class ContadorGlobal {
    private static int valor = 0;  // Estático
    
    public void incrementar() {
        valor++;
    }
}

ContadorGlobal c1 = new ContadorGlobal();
ContadorGlobal c2 = new ContadorGlobal();
c1.incrementar();  // valor = 1
c2.incrementar();  // valor = 2 (compartilhado!)
```

**Acesso a Membros Estáticos**:
```java
class Exemplo {
    static int varEstatica = 10;
    int varInstancia = 20;
    
    static void metodoEstatico() {
        System.out.println(varEstatica);    // ✅ OK
        // System.out.println(varInstancia); // ❌ ERRO: não pode acessar instância
    }
    
    void metodoInstancia() {
        System.out.println(varEstatica);    // ✅ OK
        System.out.println(varInstancia);   // ✅ OK
    }
}

// Acesso sem criar objeto:
Exemplo.metodoEstatico();  // ✅ OK
System.out.println(Exemplo.varEstatica);  // ✅ OK
```

### Palavra-chave `this`

**Referência ao objeto atual**

**Uso 1: Diferenciar Atributo de Parâmetro**
```java
class Pessoa {
    private String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;  // this.nome = atributo, nome = parâmetro
    }
}
```

**Uso 2: Chamar Outro Construtor**
```java
class Produto {
    private String nome;
    private double preco;
    
    public Produto() {
        this("Produto Padrão", 0.0);  // Chama construtor abaixo
    }
    
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
}
```

**Uso 3: Retornar Objeto Atual (Method Chaining)**
```java
class Builder {
    private String nome;
    private int idade;
    
    public Builder setNome(String nome) {
        this.nome = nome;
        return this;  // Retorna próprio objeto
    }
    
    public Builder setIdade(int idade) {
        this.idade = idade;
        return this;
    }
}

// Uso encadeado:
Builder b = new Builder()
    .setNome("João")
    .setIdade(25);
```

### Modificadores de Acesso: Encapsulamento

**Níveis de Visibilidade**:

| Modificador  | Mesma Classe | Mesmo Pacote | Subclasse (outro pacote) | Qualquer Lugar |
|--------------|--------------|--------------|--------------------------|----------------|
| `private`    | ✅           | ❌           | ❌                       | ❌             |
| (default)    | ✅           | ✅           | ❌                       | ❌             |
| `protected`  | ✅           | ✅           | ✅                       | ❌             |
| `public`     | ✅           | ✅           | ✅                       | ✅             |

**Exemplo Prático**:
```java
package com.exemplo;

public class Banco {
    private double saldo;      // Apenas dentro de Banco
    String agencia;            // Apenas pacote com.exemplo
    protected String titular;  // com.exemplo + subclasses
    public String banco;       // Qualquer lugar
    
    public double getSaldo() { // ✅ Acesso controlado via método público
        return saldo;
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Criar Classe vs Usar Classe Existente

**Criar Nova Classe**:
- Representar **entidade de negócio** (Cliente, Pedido, Produto)
- Encapsular **lógica complexa** (Calculadora, Validador)
- Agrupar **funcionalidades relacionadas** (MathUtils, StringHelper)

**Usar Classe Existente**:
- Já existe em JDK (`ArrayList`, `HashMap`, `LocalDate`)
- Biblioteca de terceiros (Apache Commons, Google Guava)

### Estrutura de Projeto Real

```
src/main/java/
├── com/
│   └── empresa/
│       └── projeto/
│           ├── modelo/          (Classes de domínio)
│           │   ├── Cliente.java
│           │   ├── Pedido.java
│           │   └── Produto.java
│           ├── servico/         (Lógica de negócio)
│           │   ├── ClienteService.java
│           │   └── PedidoService.java
│           ├── repositorio/     (Acesso a dados)
│           │   └── ClienteRepository.java
│           └── util/            (Utilitários)
│               └── ValidadorCPF.java
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Sintáticas

**1. Uma Classe Pública por Arquivo**:
```java
// Arquivo: Main.java
public class Main { }
// public class Outra { }  // ❌ ERRO: segunda classe pública
class Helper { }           // ✅ OK: classe package-private
```

**2. Nome do Arquivo = Nome da Classe Pública**:
```java
// Arquivo: Exemplo.java
public class Exemplo { }   // ✅ Correto
// public class Teste { }  // ❌ ERRO: nome não coincide com arquivo
```

**3. Ordem de Declaração**:
```java
// import java.util.*;     // ❌ ERRO: import antes de package
package com.exemplo;       // ✅ Primeiro: package
import java.util.*;        // ✅ Segundo: imports
public class Exemplo { }   // ✅ Terceiro: classe
```

---

## 🔗 Interconexões Conceituais

### Relação com Próximos Tópicos

- **Método main**: Ponto de entrada (próximo arquivo)
- **Pacotes**: Organização de classes (arquivo 3)
- **Imports**: Uso de classes de outros pacotes (arquivo 4)
- **Convenções de Nomenclatura**: Padrões de nomes (arquivo 6)

---

## 🚀 Evolução e Próximos Conceitos

### Features Modernas

**Records (Java 14+)**: Classes simplificadas para dados
```java
// Antiga:
class Pessoa {
    private final String nome;
    private final int idade;
    // Construtor, getters, equals, hashCode, toString...
}

// Record:
record Pessoa(String nome, int idade) { }
// Gera automaticamente: construtor, getters, equals, hashCode, toString
```

**Sealed Classes (Java 17+)**: Controle de herança
```java
sealed class Forma permits Circulo, Quadrado { }
final class Circulo extends Forma { }
final class Quadrado extends Forma { }
// Apenas Circulo e Quadrado podem herdar de Forma
```

### Próximos Passos

Estudar **método main** (ponto de entrada de aplicações Java) - próximo arquivo desta sequência.
