## O que são interfaces funcionais?

Interfaces funcionais são um conceito central na programação funcional dentro do Java. Uma interface funcional é uma interface que possui exatamente um método abstrato. Esse conceito é crucial para expressões lambda, pois permite passar blocos de código de maneira concisa.

## Características

- **Único Método Abstrato**: Apenas um método abstrato é permitido. Isso facilita a implementação de expressões lambda.
- **Anotação `@FunctionalInterface`**: Embora não obrigatória, a anotação `@FunctionalInterface` ajuda a garantir que a interface não tenha mais de um método abstrato. Se uma segunda é adicionada, ocorre um erro de compilação.

#### Exemplo de Interface Funcional

```java
@FunctionalInterface
public interface SimpleFunctionalInterface {
    void execute();
}
```

## Estruturas de uma Interface Funcional

#### `Métodos em Interfaces Funcionais`
- **Métodos Abstratos**: Deve ter exatamente um método abstrato.
- **Métodos Default**: Pode conter um ou mais métodos 'default', que são métodos com implementação padrão.
- **Métodos Estáticos**: Também pode ter métodos estáticos com implementação.

#### Exemplo Com Método Default
```java
@FunctionalInterface
public interface AdvancedFunctionalInterface {
    void performAction();

    default void defaultMethod() {
        System.out.println("Este é um método default.");
    }
}
```

#### `Métodos Default e Estáticos`
Métodos default e estáticos não afetam a natureza "funcional" de uma interface, pois não são abstratos. Eles são utilizados para fornecer implementações padrão e funcionalidades adicionais, respectivamente.

### 1.4. Uso Prático das Interfaces Funcionais

#### Exemplo: `java.util.function` Package
O pacote `java.util.function` no Java 8 introduziu várias interfaces funcionais prontas para uso, como `Predicate<T>`, `Function<T,R>`, e `Consumer<T>`. Cada uma destas é destinada a um tipo específico de operação, facilitando a programação funcional.

#### Exemplo de Uso de `Function<T,R>`
```java
Function<String, Integer> lengthFunction = String::length;
System.out.println(lengthFunction.apply("Hello")); // Saída: 5
```

### 1.5. Benefícios e Limitações
#### `Benefícios`
- **Código Mais Conciso**: As expressões lambda tornam o código mais legível e conciso.
- **Facilidade de Uso com APIs**: Melhora a integração com APIs que suportam programação funcional.

#### `Limitações`
- **Curva de Aprendizado**: Pode ser um conceito difícil de entender para novos programadores.
- **Compatibilidade**: Questões de compatibilidade com código Java mais antigo.


### 1.6. Considerações Adicionais
- **`Performance`**: Discussão sobre o impacto no desempenho ao usar expressões lambda e interfaces funcionais.
- **`Refatoração de Código Legado`**: Como converter código Java antigo para usar expressões lambda e interfaces funcionais, aumentando a legibilidade e eficiência.