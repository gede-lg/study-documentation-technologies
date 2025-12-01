## O que é POO e quais suas vantagens?

### Programação Orientada a Objetos (POO)

**Conceito:**
A Programação Orientada a Objetos (POO) é um paradigma de programação que se baseia no conceito de "objetos". Esses objetos são instâncias de "classes", as quais encapsulam um conjunto de atributos (dados) e métodos (ações) que operam nesses dados.

**Características Principais:**
1. **Encapsulamento:** Agrupa dados e métodos relacionados em unidades chamadas classes, ocultando detalhes internos do objeto do mundo externo.
2. **Abstração:** Foca nas características essenciais de um objeto, ignorando detalhes irrelevantes ou acidentais.
3. **Herança:** Permite a criação de novas classes a partir de classes existentes, herdando atributos e métodos e permitindo a extensão ou modificação de comportamentos.
4. **Polimorfismo:** Capacidade de um objeto ser referenciado de várias formas, principalmente através de interfaces ou classes base.

#### Exemplo em C#:
```csharp
using System;

public class Carro
{
    private string modelo;
    private int ano;

    public Carro(string modelo, int ano)
    {
        this.modelo = modelo;
        this.ano = ano;
    }

    public void ExibirInfo()
    {
        Console.WriteLine("Modelo: " + modelo + ", Ano: " + ano);
    }
}
```

## Classes e Objetos

### Classes
Uma classe é um modelo que define o estado (atributos) e o comportamento (métodos) de um objeto. Ela serve como um template para criar objetos.

```csharp
public class Pessoa
{
    public string Nome { get; set; }
    public int Idade { get; set; }

    public void DizerOla()
    {
        Console.WriteLine("Olá, meu nome é " + Nome);
    }
}
```

### Objetos
Um objeto é uma instância de uma classe. Ele é criado a partir do blueprint fornecido pela classe e possui seu próprio conjunto de valores de atributos.

```csharp
class Program
{
    static void Main(string[] args)
    {
        Pessoa pessoa1 = new Pessoa();
        pessoa1.Nome = "João";
        pessoa1.DizerOla(); // Saída: Olá, meu nome é João
    }
}
```

## Métodos e Atributos

### Atributos
Atributos são variáveis que definem as características de um objeto. Eles representam o estado de um objeto.

```csharp
public class Livro
{
    public string Titulo { get; set; }
    public string Autor { get; set; }
}
```
#### O que são e para que servem as propriedades?

As propriedades em C# servem para controlar o acesso aos dados de uma classe. Por meio das propriedades, é possível implementar a leitura (`get`) e a escrita (`set`) de valores de maneira controlada. Isso significa que, em vez de expor os campos (variáveis) da classe diretamente, você oferece métodos que permitem manipular esses campos de forma segura, validando os dados antes de armazená-los ou modificando-os de alguma maneira ao serem acessados.
#### Propriedade com `get` e `set`

A sintaxe básica de uma propriedade inclui um bloco `get` para retornar o valor da propriedade e um bloco `set` para atribuir um novo valor. Esses blocos podem conter qualquer lógica adicional necessária para a obtenção ou definição do valor.

```csharp
public class Pessoa
{
    private string nome;

    public string Nome
    {
        get { return nome; }
        set { nome = value; }
    }
}
```

Neste exemplo, `Nome` é uma propriedade da classe `Pessoa`. O campo `nome` é um campo privado, o que significa que só pode ser acessado diretamente dentro da classe `Pessoa`. A propriedade `Nome` permite acessar esse campo de forma controlada.

#### Propriedades Automáticas

C# também oferece uma sintaxe simplificada para propriedades que não requerem lógica adicional nos acessadores `get` e `set`. Essas são chamadas de propriedades automáticas e são úteis quando você simplesmente quer expor um campo com segurança, sem nenhuma lógica extra.

```csharp
public class Pessoa
{
    public string Nome { get; set; }
}
```

Neste caso, o compilador de C# gera automaticamente um campo privado anônimo que é acessado pelos acessadores `get` e `set` da propriedade `Nome`. Isso reduz a quantidade de código necessária para definir propriedades simples.

#### Uso de `get` e `set` para validação e lógica

Um dos principais benefícios das propriedades é a capacidade de adicionar validação ou outras lógicas nos acessadores. Por exemplo, você pode querer garantir que um nome não seja atribuído como uma string vazia ou nula.

```csharp
public class Pessoa
{
    private string nome;

    public string Nome
    {
        get { return nome; }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Nome não pode ser nulo ou vazio.");
            }
            nome = value;
        }
    }
}
```

#### Propriedades Somente Leitura e Somente Escrita

Você pode criar propriedades que sejam somente leitura ou somente escrita usando apenas um dos acessadores (`get` ou `set`).

- **Somente leitura:**

  ```csharp
  public class Pessoa
  {
      public string Nome { get; }
  }
  ```

- **Somente escrita:** (menos comum, pois limita a capacidade de ler o valor externamente)

  ```csharp
  public class Pessoa
  {
      private string nome;
      public string Nome
      {
          set { nome = value; }
      }
  }
  ```

### Métodos
Métodos são funções definidas dentro de uma classe que descrevem o comportamento do objeto. Eles representam as ações que um objeto pode executar.

```csharp
public class Calculadora
{
    public int Somar(int a, int b)
    {
        return a + b;
    }
}
```

### Exemplo Integrado:

```csharp
public class ContaBancaria
{
    // Atributos
    private string titular;
    private double saldo;

    // Construtor
    public ContaBancaria(string titular, double saldoInicial)
    {
        this.titular = titular;
        this.saldo = saldoInicial;
    }

    // Métodos
    public void Depositar(double valor)
    {
        saldo += valor;
    }

    public bool Sacar(double valor)
    {
        if (saldo >= valor)
        {
            saldo -= valor;
            return true;
        }
        return false;
    }

    public double ConsultarSaldo()
    {
        return saldo;
    }
}
```

Este módulo deve ser seguido por exercícios práticos para consolidar o aprendizado, como a criação de classes representando diferentes entidades e a implementação de métodos para manipulá-las.

## Construtores

Em C#, um constructor (construtor) é um método especial da classe utilizado para inicializar novos objetos da classe. Ele é chamado automaticamente quando um novo objeto da classe é criado. Os construtores são fundamentais para garantir que o objeto comece sua existência em um estado válido e consistente. Vamos explorar os diferentes tipos de construtores em C# e suas sintaxes, proporcionando uma compreensão aprofundada e exemplos de código para ilustrar cada conceito.

### **1. Construtores Padrão (Default Constructors)**

#### **O que são e para que servem?**

Um construtor padrão é aquele sem parâmetros. Ele é automaticamente implementado por C# se nenhum construtor é explicitamente definido na classe. O construtor padrão inicializa todos os membros do objeto para os valores padrão do tipo (por exemplo, 0 para inteiros, `false` para booleanos, `null` para objetos, etc.).

#### **Sintaxe**

```csharp
public class MinhaClasse
{
    public MinhaClasse()
    {
        // Inicializações padrão, se necessário
    }
}
```

#### **Exemplo**

```csharp
public class Pessoa
{
    public string Nome;
    public int Idade;

    // Construtor padrão
    public Pessoa()
    {
        Nome = "Nome padrão";
        Idade = 0;
    }
}
```

### **2. Construtores Parametrizados**

#### **O que são e para que servem?**

Construtores parametrizados permitem a passagem de argumentos no momento da criação do objeto, possibilitando a inicialização do objeto com valores específicos fornecidos pelo usuário.

#### **Sintaxe**

```csharp
public class MinhaClasse
{
    public MinhaClasse(tipo param1, tipo param2, ...)
    {
        // Inicializações com parâmetros
    }
}
```

#### **Exemplo**

```csharp
public class Pessoa
{
    public string Nome;
    public int Idade;

    public Pessoa(string nome, int idade)
    {
        Nome = nome;
        Idade = idade;
    }
}
```

### **3. Construtores Estáticos**

#### **O que são e para que servem?**

Um construtor estático é usado para inicializar dados estáticos da classe ou para executar uma ação particular que precisa ser realizada apenas uma vez. Ele é chamado automaticamente antes da primeira instância ser criada ou qualquer membro estático ser referenciado.

#### **Sintaxe**

```csharp
public class MinhaClasse
{
    static MinhaClasse()
    {
        // Inicializações estáticas ou ações a serem executadas uma vez
    }
}
```

#### **Exemplo**

```csharp
public class Contador
{
    public static int ContagemAtual;
    
    static Contador()
    {
        ContagemAtual = 0;
    }
    
    public static void IncrementarContagem()
    {
        ContagemAtual++;
    }
}
```

### **4. Construtores de Cópia**

#### **O que são e para que servem?**

Um construtor de cópia é um tipo de construtor parametrizado que inicializa um objeto usando outro objeto da mesma classe. Ele é útil para criar uma cópia de um objeto existente.

#### **Sintaxe**

```csharp
public class MinhaClasse
{
    public MinhaClasse(MinhaClasse outro)
    {
        // Inicialização baseada no objeto 'outro'
    }
}
```

#### **Exemplo**

```csharp
public class Pessoa
{
    public string Nome;
    public int Idade;

    // Construtor de cópia
    public Pessoa(Pessoa outraPessoa)
    {
        Nome = outraPessoa.Nome;
        Idade = outraPessoa.Idade;
    }
}
```

### **Informações Adicionais**

- **Inicializadores de Objeto:** Em C#, você também pode inicializar objetos sem a necessidade de definir um construtor parametrizado, utilizando inicializadores de objeto. Isso permite que você especifique valores para qualquer campo ou propriedade acessível no momento da criação do objeto.
  
- **Encadeamento de Construtores:** C# suporta o encadeamento de construtores, onde um construtor pode chamar outro na mesma classe usando a palavra-chave `this` ou um construtor da classe base usando `base`.

- **Destrutores:** Embora não sejam construtores, é importante mencionar que C# também suporta destrutores, que são métodos chamados quando um objeto está sendo coletado pelo garbage collector. Eles são usados para limpeza de recursos, se necessário.

Entendendo e utilizando adequadamente os diferentes tipos de construtores em C#, você pode garantir que seus objetos sejam inicializados de maneira apropriada, promovendo uma programação mais segura e eficiente.