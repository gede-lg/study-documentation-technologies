## O que é e para que serve?

- #### Abstração:
	A abstração permite modelar objetos do mundo real de forma mais precisa no código, isolando o comportamento essencial de um objeto e ocultando os detalhes de implementação. Isso promove a reutilização de código, simplifica a manutenção e aumenta a flexibilidade do sistema.
	
	Por exemplo, considere um sistema de gerenciamento de veículos. Podemos abstrair um conceito de veículo, identificando as características essenciais que todos os veículos compartilham, como a capacidade de se locomover e a capacidade de transportar passageiros. Ao criar uma classe abstrata ou uma interface para representar essa abstração, podemos definir métodos como `Mover()` e `TransportarPassageiros()` que todas as classes de veículos devem implementar. Isso nos permite tratar todos os tipos de veículos de forma uniforme, sem se preocupar com os detalhes específicos de cada tipo.
## Abstração de Classes

#### O que é e para que serve?

Em C#, uma classe abstrata é uma classe que não pode ser instanciada diretamente e pode conter métodos abstratos, ou seja, métodos sem implementação. Para criar uma classe abstrata, utilizamos a palavra-chave `abstract`. Os métodos abstratos são declarados sem corpo e devem ser implementados por classes derivadas.

#### Sintaxe de Uso:

```csharp
public abstract class Veiculo
{
	// Método abstrato para mover o veículo
	public abstract void Mover();

	// Método abstrato para transportar passageiros
	public abstract void TransportarPassageiros();
}

// Classe concreta que herda da classe abstrata Veiculo
public class Carro : Veiculo
{
	public override void Mover()
	{
		Console.WriteLine("Carro se locomovendo...");
	}

	public override void TransportarPassageiros()
	{
		Console.WriteLine("Carro transportando passageiros...");
	}
}
```

#### Vantagens da Abstração

- **Reutilização de código:** Classes abstratas e interfaces permitem que o código seja reutilizado em diferentes contextos.
- **Flexibilidade:** A abstração permite que diferentes classes implementem o mesmo contrato, facilitando a substituição de implementações.
- **Manutenibilidade:** Ao focar nos aspectos essenciais dos objetos, a abstração torna o código mais fácil de entender e dar manutenção.
## Herança
#### O que é e para que serve?

A herança é um dos pilares da programação orientada a objetos (POO) e é usada para criar uma hierarquia entre classes. Ela permite que uma classe (chamada de classe derivada ou subclasse) herde características (métodos e propriedades) de outra classe (chamada de classe base ou superclasse). Isso significa que a classe derivada pode reutilizar o código da classe base e também estender ou modificar seu comportamento, adicionando novos métodos ou propriedades.

Em termos simples, a herança permite modelar relacionamentos "é um", onde uma classe derivada é uma versão especializada da classe base. Por exemplo, se tivermos uma classe `Animal` como classe base e uma classe `Cachorro` como classe derivada, podemos dizer que um cachorro é um animal.

#### Sintaxe de Uso:

A sintaxe para implementar herança em C# é bastante simples. Para que uma classe herde de outra, utilizamos o operador `:` seguido do nome da classe base, e para acessar atributos da classe mãe, basta usar o `base` Aqui está a estrutura básica:

```csharp
class ClasseBase
{
	public int tamanho;
	// membros da classe base
}

class ClasseDerivada : ClasseBase
{
	base.tamanho = 3;
	// membros adicionais ou sobrescritos da classe derivada
}
```

- `ClasseBase`: É a classe da qual estamos herdando.
- `ClasseDerivada`: É a classe que está herdando da classe base.

#### Exemplo de Uso:

Vamos criar um exemplo simples com uma classe base `Veiculo` e uma classe derivada `Carro`:

```csharp
using System;

class Veiculo
{
	public string Marca { get; set; }
	public string Modelo { get; set; }

	public void Ligar()
	{
		Console.WriteLine("Veículo ligado.");
	}

	public void Desligar()
	{
		Console.WriteLine("Veículo desligado.");
	}
}

class Carro : Veiculo
{
	public int Ano { get; set; }
	public string Cor { get; set; }

	public void Acelerar()
	{
		Console.WriteLine("Carro acelerando.");
	}

	public void Frear()
	{
		Console.WriteLine("Carro freando.");
	}
}

class Program
{
	static void Main(string[] args)
	{
		Carro meuCarro = new Carro();
		meuCarro.Marca = "Toyota";
		meuCarro.Modelo = "Corolla";
		meuCarro.Ano = 2020;
		meuCarro.Cor = "Prata";

		meuCarro.Ligar();
		meuCarro.Acelerar();
		meuCarro.Frear();
		meuCarro.Desligar();
	}
}
```

Neste exemplo, a classe `Carro` herda os membros (propriedades e métodos) da classe `Veiculo`. Isso significa que um objeto da classe `Carro` pode acessar tanto os membros de `Carro` quanto os membros de `Veiculo`. Além disso, a classe `Carro` também define seus próprios membros específicos (`Ano`, `Cor`, `Acelerar()` e `Frear()`).

#### Observações Adicionais:

- **Métodos Virtuais e Sobrescrita**: Uma classe derivada pode substituir (sobrescrever) um método da classe base usando a palavra-chave `override`. Isso é útil quando queremos alterar o comportamento de um método na classe derivada.
- **Modificadores de Acesso**: Os membros herdados de uma classe base podem ter diferentes modificadores de acesso na classe derivada, como `public`, `protected` ou `private`.
- **Herança Múltipla**: Em C#, uma classe só pode herdar de uma única classe base, mas pode implementar múltiplas interfaces para alcançar funcionalidades semelhantes à herança múltipla.
- **Construtores**: Ao herdar de uma classe base, é possível que a classe derivada chame o construtor da classe base usando a palavra-chave `base()`, garantindo que a inicialização da classe base seja realizada corretamente.
- **Cuidados ao Usar Herança**: Embora a herança seja uma ferramenta poderosa, é importante usá-la com moderação e cuidado, evitando a criação de hierarquias muito profundas e complexas que dificultem a manutenção do código. Em alguns casos, a composição (usando objetos como membros) pode ser uma alternativa melhor à herança.