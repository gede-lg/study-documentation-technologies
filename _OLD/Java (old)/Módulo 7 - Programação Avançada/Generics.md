### 1. O que é Generics?
Generics, em Java, são um mecanismo que permite criar classes, interfaces e métodos que operam com tipos parametrizados. Em outras palavras, eles permitem que você escreva código que funcione com diferentes tipos de dados de forma flexível e segura em tempo de compilação.

#### Exemplo de Classe Genérica:
```java
public class Box<T> {
    private T content;
    
    public void put(T item) {
        this.content = item;
    }
    
    public T get() {
        return content;
    }
}
```

Neste exemplo, `T` é um tipo genérico que será substituído por um tipo concreto quando você criar uma instância da classe `Box`. Isso permite que a mesma classe seja usada para armazenar diferentes tipos de objetos de forma segura.

### 2. Quando e por que usar Generics?

#### a. Reutilização de código:
Generics permitem criar estruturas de dados e algoritmos que funcionam com diversos tipos de dados sem duplicação de código. Isso promove a reutilização e a manutenção eficiente do código.

#### b. Segurança de tipo em tempo de compilação:
Usar Generics ajuda a detectar erros de tipo em tempo de compilação, tornando o código mais seguro e menos propenso a erros em tempo de execução.

#### Exemplo de Erro de Tipo sem Generics:
```java
List lista = new ArrayList();
lista.add("texto");
Integer numero = (Integer) lista.get(0); // Isso lança uma exceção ClassCastException em tempo de execução
```

#### Exemplo com Generics:
```java
List<String> lista = new ArrayList<>();
lista.add("texto");
Integer numero = lista.get(0); // Erro de compilação, pois o tipo não corresponde
```

#### c. Maior clareza e legibilidade:
O uso de Generics torna o código mais claro e legível, pois indica explicitamente os tipos envolvidos em operações.

#### d. Evitar castings (conversões explícitas):
Com Generics, não é necessário realizar conversões explícitas de tipos, tornando o código mais conciso.

#### e. Coleções Genéricas:
As classes de coleções padrão, como `ArrayList`, `LinkedList` e `HashMap`, são genericamente parametrizadas para permitir armazenar qualquer tipo de objeto de forma segura.

```java
List<String> nomes = new ArrayList<>();
nomes.add("Alice");
nomes.add("Bob");
```

### 3. Sintaxe de Generics

#### a. Declaração de classes e interfaces genéricas:
```java
public class NomeDaClasse<T> { ... }
public interface NomeDaInterface<T> { ... }
```

#### b. Uso de métodos genéricos:
```java
public <T> T metodoGenerico(T parametro) { ... }
```

### 4. Limitações dos Generics

#### a. Não é possível criar instâncias diretas de tipos genéricos:
```java
T objeto = new T(); // Inválido
```

#### b. Não é possível criar arrays genéricos:
```java
T[] array = new T[10]; // Inválido
```

### 5. Wildcards (?)

#### a. O que é um wildcard?
Wildcards são usados para representar tipos desconhecidos em Generics. Existem três tipos de wildcards em Java: `?`, `? extends Tipo` e `? super Tipo`.

#### b. Uso de wildcards em métodos e coleções:
```java
public void imprimeLista(List<?> lista) { ... }
public void adicionaElemento(List<? extends Number> lista) { ... }
public void removeElemento(List<? super Integer> lista) { ... }
```

### 6. Type Erasure

#### a. O que é type erasure?
Type erasure é um processo pelo qual os tipos genéricos são substituídos por Object durante a compilação. Isso é feito para garantir a compatibilidade com o código Java mais antigo, que não suporta Generics.

### 7. Exercícios Práticos

#### a. Criar classes genéricas para armazenar diferentes tipos de dados.
#### b. Escrever métodos genéricos que operem com tipos desconhecidos.
#### c. Utilizar wildcards para aumentar a flexibilidade de seus métodos e classes genéricas.

Generics são uma parte fundamental da linguagem Java, e seu entendimento é essencial para escrever código seguro, flexível e reutilizável. Certifique-se de que os alunos compreendam a sintaxe, os benefícios e as limitações dos Generics, e proporcionem oportunidades práticas para aplicar esses conceitos em projetos e exercícios.