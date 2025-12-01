## 1. Introdução ao Tratamento de Exceções

O tratamento de exceções é uma parte fundamental da programação em Java. Exceções são eventos que ocorrem durante a execução de um programa e podem interromper o fluxo normal do programa. Para lidar com exceções de maneira adequada, é importante entender como lançá-las e como indicar que um método pode lançar exceções usando `throw` e `throws`.

### 1.1. O que são Exceções?

Em Java, uma exceção é um objeto que representa um erro ou uma condição excepcional que ocorreu durante a execução de um programa. As exceções são usadas para lidar com situações imprevisíveis ou erros durante a execução do código. Existem duas categorias principais de exceções em Java: exceções verificadas (checked exceptions) e exceções não verificadas (unchecked exceptions).

- Exceções Verificadas: São exceções que o compilador obriga o programador a tratar ou declarar. Elas normalmente derivam da classe `Exception` ou de suas subclasses, exceto `RuntimeException` e suas subclasses.

- Exceções Não Verificadas: Também conhecidas como exceções de tempo de execução, não são verificadas em tempo de compilação. Normalmente derivam da classe `RuntimeException`.

## 2. Lançando Exceções com `throw`

A palavra-chave `throw` é usada para lançar uma exceção manualmente em Java. Isso permite que o programador indique explicitamente que uma condição excepcional ocorreu e interrompa o fluxo normal do programa.

### 2.1. Sintaxe para `throw`

```java
throw exception;
```

Onde `exception` é uma instância de uma classe que herda de `Throwable`, como `Exception` ou suas subclasses.

### 2.2. Exemplo de Lançamento de Exceção com `throw`

Vamos considerar um exemplo em que queremos lançar uma exceção se um número for negativo:

```java
public class ExemploThrow {
    public static void main(String[] args) {
        int numero = -5;
        
        if (numero < 0) {
            throw new IllegalArgumentException("Número não pode ser negativo.");
        }
        
        System.out.println("Programa continua após o lançamento da exceção.");
    }
}
```

Neste exemplo, usamos `throw` para lançar uma exceção do tipo `IllegalArgumentException` se `numero` for negativo.

## 3. Indicando Exceções com `throws`

A palavra-chave `throws` é usada para indicar que um método pode lançar exceções específicas. Isso informa aos chamadores do método que eles devem tratar essas exceções ou propagá-las para cima na cadeia de chamadas.

### 3.1. Sintaxe para `throws`

```java
return_type method_name(parameter_list) throws exception_type1, exception_type2, ... {
    // Método pode lançar exceções
}
```

### 3.2. Exemplo de Indicação de Exceções com `throws`

Vamos considerar um método que divide dois números e pode lançar uma exceção se o divisor for zero:

```java
public class ExemploThrows {
    public static double divide(double numerador, double divisor) throws ArithmeticException {
        if (divisor == 0) {
            throw new ArithmeticException("Divisão por zero não é permitida.");
        }
        return numerador / divisor;
    }
    
    public static void main(String[] args) {
        try {
            double resultado = divide(10, 0);
            System.out.println("Resultado da divisão: " + resultado);
        } catch (ArithmeticException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
}
```

Neste exemplo, o método `divide` indica que pode lançar uma `ArithmeticException` se o divisor for zero. O método de chamada no `main` lida com a exceção usando um bloco `try-catch`.

## 4. Pilha de Execução e Propagação de Exceções

Quando uma exceção é lançada em um método e não é tratada localmente, ela é propagada para métodos chamadores na pilha de execução. Essa propagação continua até que a exceção seja tratada por um bloco `try-catch` apropriado ou até que atinja o método `main`, onde o programa pode encerrar com uma mensagem de erro.

### 4.1. Ilustrando a Propagação de Exceções

Suponha que temos uma série de métodos chamados em sequência:

```java
public class PropagacaoExcecoes {
    public static void main(String[] args) {
        try {
            metodo1();
        } catch (Exception e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    public static void metodo1() throws Exception {
        metodo2();
    }
    
    public static void metodo2() throws Exception {
        throw new Exception("Exceção em metodo2");
    }
}
```

Neste exemplo, uma exceção é lançada em `metodo2` e propagada até que seja tratada em `main`.

## 5. Conclusão

Neste módulo, você aprendeu como lançar exceções manualmente usando `throw` e como indicar exceções que um método pode lançar usando `throws`. Também discutimos a propagação de exceções na pilha de execução. O tratamento adequado de exceções é fundamental para escrever código robusto e confiável em Java. Certifique-se de compreender esses conceitos e praticar o tratamento de exceções em seus programas.