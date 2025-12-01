### Sobrecarga (Overloading)

**O que é e para que serve?**

A sobrecarga de métodos permite que uma classe tenha múltiplas versões de um método com o mesmo nome, mas com diferentes listas de parâmetros (diferindo em número, tipo, ou ambos). Isso aumenta a flexibilidade da programação, permitindo que métodos realizem operações semelhantes para diferentes tipos de dados ou quantidades de argumentos.

**Quando usar:**

Use a sobrecarga quando quiser que um método execute ações semelhantes, mas com diferentes tipos ou quantidades de argumentos. Isso melhora a legibilidade do código e a experiência do desenvolvedor.

**Sintaxe de uso:**

A chave para a sobrecarga é definir métodos com o mesmo nome na mesma classe, mas com diferentes assinaturas de parâmetros.

```csharp
public class Calculator
{
    public int Add(int a, int b)
    {
        return a + b;
    }

    public int Add(int a, int b, int c)
    {
        return a + b + c;
    }

    public double Add(double a, double b)
    {
        return a + b;
    }
}
```

### Sobreposição (Overloading vs. Overriding Confusion)

A terminologia "sobreposição" não é comumente usada em C# no contexto de métodos. Pode haver uma confusão entre "sobrecarga" (overloading) e "sobrescrita" (overriding). Vou focar em explicar a sobrescrita, que é o conceito relevante.

### Sobrescrita (Overriding)

**O que é e para que serve?**

Sobrescrita de métodos é um recurso da programação orientada a objetos que permite a uma classe derivada fornecer uma implementação específica de um método que é já definido em sua classe base. O método na classe base deve ser marcado com o modificador `virtual`, e o método na classe derivada deve ser marcado como `override`. Isso é usado para modificar o comportamento de métodos herdados conforme as necessidades das subclasses.

**Quando usar:**

Use sobrescrita quando precisar modificar ou estender o comportamento de um método herdado da classe base na classe derivada.

**Sintaxe de uso:**

```csharp
public class BaseClass
{
    public virtual void Display()
    {
        Console.WriteLine("Display: Base Class");
    }
}

public class DerivedClass : BaseClass
{
    public override void Display()
    {
        Console.WriteLine("Display: Derived Class");
    }
}
```

### Exemplo Prático Unindo os Conceitos

```csharp
public class Animal
{
    public virtual void Speak()
    {
        Console.WriteLine("Some generic animal sound");
    }
}

public class Dog : Animal
{
    public override void Speak()
    {
        Console.WriteLine("Bark");
    }

    // Sobrecarga do método Speak no contexto de Dog
    public void Speak(int times)
    {
        for (int i = 0; i < times; i++)
        {
            Console.WriteLine("Bark");
        }
    }
}
```

Neste exemplo, `Speak` é sobrescrito na classe `Dog` para fornecer uma implementação específica para cães, além de ser sobrecarregado para permitir que o cão lata várias vezes.

### Considerações Finais

- **Legibilidade e Manutenibilidade:** A utilização correta de