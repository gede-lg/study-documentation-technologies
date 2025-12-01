# Iterator

## O que é e para que serve?

O `Iterator` é uma interface no Java que fornece um meio para acessar os elementos de uma coleção (como listas, conjuntos) de maneira sequencial, sem expor a representação interna da coleção. É uma parte fundamental do Java Collections Framework.

### Principais Utilizações:
- **Navegação:** Permite percorrer uma coleção elemento por elemento.
- **Remoção de Elementos:** Oferece uma maneira segura de remover elementos de uma coleção durante a iteração.

## Principais Métodos

A interface `Iterator` inclui alguns métodos essenciais para a manipulação e navegação através de coleções:

### `boolean hasNext()`
- **Descrição:** Verifica se há mais elementos na coleção.
- **Uso:** Comumente usado em um loop para iterar sobre uma coleção.
- **Exemplo:**

```java
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    String elemento = iterator.next();
    System.out.println(elemento);
}
```

### `E next()`
- **Descrição:** Retorna o próximo elemento na coleção.
- **Uso:** Deve ser usado após verificar `hasNext()`.
- **Exemplo:**

```java
// Continuação do exemplo anterior
String elemento = iterator.next();
```

### `void remove()`
- **Descrição:** Remove da coleção o último elemento retornado por `next()`.
- **Uso:** Deve ser chamado após `next()`. Uma chamada subsequente a `next()` é necessária para remover outro elemento.
- **Exemplo:**

```java
while (iterator.hasNext()) {
    String elemento = iterator.next();
    if (elemento.equals("elementoASerRemovido"))

        iterator.remove();
    }
}
```

### `default void forEachRemaining(Consumer<? super E> action)`
- **Descrição:** Realiza a ação fornecida para cada elemento restante na coleção até que todos os elementos tenham sido processados ou a ação lance uma exceção.
- **Uso:** Útil para realizar operações em todos os elementos remanescentes. A ação é uma expressão lambda que define o que será feito com cada elemento.
- **Exemplo:**

```java
Iterator<String> iterator = list.iterator();
iterator.forEachRemaining(elemento -> System.out.println(elemento));
```

## Outras Considerações

### Tipos de Iterators
- **Iterators Simples:** O mais comum, permite navegar e remover elementos.
- **ListIterator:** Específico para listas, oferece funcionalidades adicionais, como iteração bidirecional e adição de elementos.

### Concorrência
- O comportamento de um iterator é indefinido se a coleção subjacente for modificada enquanto a iteração estiver em progresso de maneira não sincronizada.
- Coleções que suportam iteradores "fail-fast" lançam uma `ConcurrentModificationException` nessas circunstâncias.

### Iteração em Coleções Modernas
- Com o Java 8, a introdução de `Stream`s e métodos como `forEach` tornaram algumas utilizações de `Iterator` menos comuns, mas ainda é uma ferramenta fundamental para iteração personalizada e controle detalhado.

## Conclusão

O `Iterator` é uma interface crucial no Java, permitindo a iteração segura e eficiente sobre coleções. Seus métodos oferecem controle detalhado sobre o processo de iteração, tornando-o uma ferramenta valiosa para qualquer desenvolvedor Java. Com a evolução da linguagem, alternativas como `Stream`s e `forEach` complementam, mas não substituem completamente, a funcionalidade e flexibilidade proporcionadas pelo `Iterator`.