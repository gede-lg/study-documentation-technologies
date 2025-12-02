## Coleções

- **Definição**: Uma coleção é uma estrutura de dados que armazena elementos, como listas, conjuntos e mapas.
- **Estado**: Uma coleção tem um estado fixo, o que significa que seus elementos estão armazenados nela e podem ser acessados a qualquer momento.
- **Modificação**: Você pode adicionar, remover ou modificar elementos diretamente em uma coleção.

Exemplo de uma coleção (List):
```java
List<String> lista = new ArrayList<>();
lista.add("a");
lista.add("b");
lista.add("c");
```

## Streams

- **Definição**: Um stream é uma sequência de elementos que pode ser processada de forma funcional e sequencial. Ele não armazena elementos.
- **Sem Estado**: Streams não têm estado fixo. Eles são apenas uma visão dos dados que são processados conforme necessário.
- **Imutável**: Uma vez criado, um stream não pode ser modificado. Qualquer operação em um stream resulta em um novo stream.
- **Uso Único**: Streams são consumíveis. Uma vez que uma operação terminal é chamada, o stream não pode mais ser usado.

Exemplo de um stream:
```java
List<String> lista = Arrays.asList("a", "b", "c");
Stream<String> stream = lista.stream().filter(s -> s.startsWith("a"));
stream.forEach(System.out::println); // Processa e imprime os elementos
```

## Diferenças Principais

1. **Armazenamento de Dados**:
   - Coleções armazenam dados.
   - Streams processam dados, mas não os armazenam.

2. **Estado**:
   - Coleções têm um estado fixo (os elementos estão dentro da coleção).
   - Streams não têm estado fixo; eles são apenas uma sequência de operações nos dados.

3. **Modificabilidade**:
   - Coleções podem ser modificadas (adicionar, remover, atualizar elementos).
   - Streams são imutáveis e só podem ser consumidos uma vez.

4. **Consumo Único**:
   - Coleções podem ser iteradas várias vezes.
   - Streams só podem ser consumidos uma vez. Após uma operação terminal, eles não podem ser reutilizados.

### Exemplo Prático

Vamos ver um exemplo completo que mostra a diferença entre coleção e stream:

```java
// Coleção
List<String> lista = Arrays.asList("a", "b", "c", "d");
System.out.println(lista); // Output: [a, b, c, d]

// Stream
Stream<String> stream = lista.stream()
                             .filter(s -> s.startsWith("a"))
                             .map(String::toUpperCase);

// Operação Terminal no Stream
List<String> resultado = stream.collect(Collectors.toList());
System.out.println(resultado); // Output: [A]

// Tentando reutilizar o Stream
// Isso lançará IllegalStateException, porque o stream já foi consumido
// stream.forEach(System.out::println); // Exception
```

## Resumo

- **Coleções**: Estruturas de dados que armazenam elementos com estado fixo e são modificáveis.
- **Streams**: Sequências de operações em dados, sem estado fixo, imutáveis e consumíveis apenas uma vez.