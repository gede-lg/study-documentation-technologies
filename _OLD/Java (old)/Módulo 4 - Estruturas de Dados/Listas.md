# Módulo 4: Estruturas de Dados em Java

## 1. Estruturas de Listas em Collection

### `List`
- Interface `List` é uma coleção ordenada (também conhecida como sequência).
- Permite elementos duplicados e mantém a ordem de inserção.
- Oferece controle preciso sobre onde cada elemento é inserido e pode acessar elementos por seus índices.

#### `ArrayList`
- Baseada em um array redimensionável.
- Melhor para armazenar e acessar dados.
- **Exemplo de Código:**
  ```java
  List<String> arrayList = new ArrayList<>();
  arrayList.add("Apple");
  arrayList.add("Banana");
  System.out.println(arrayList.get(0)); // Saída: Apple
  ```

#### `LinkedList`
- Implementada como uma lista duplamente encadeada.
- Melhor para manipulação de dados, como inserção e remoção.
- **Exemplo de Código:**
  ```java
  List<String> linkedList = new LinkedList<>();
  linkedList.add("Carrot");
  linkedList.add("Beetroot");
  linkedList.remove("Carrot");
  ```

#### `Vector`
- Similar ao `ArrayList`, mas sincronizado.
- Cada método é encapsulado em um bloco sincronizado, o que o torna thread-safe.
- **Exemplo de Código:**
  ```java
  List<String> vector = new Vector<>();
  vector.add("Dog");
  vector.add("Cat");
  System.out.println(vector.get(1)); // Saída: Cat
  ```

## 2. Uso e Diferenças de Cada Estrutura

### Comparação

| Característica   | ArrayList        | LinkedList      | Vector            |
|------------------|------------------|-----------------|-------------------|
| Implementação    | Array Dinâmico   | Lista Duplamente Encadeada | Array Dinâmico Sincronizado |
| Acesso a Elementos | Rápido (indexado) | Mais lento (percorre a lista) | Rápido (indexado) |
| Inserção e Remoção | Mais lento no meio da lista | Rápido | Mais lento no meio da lista, mas thread-safe |
| Consumo de Memória | Menos memória | Mais memória (armazena referências adicionais) | Semelhante ao ArrayList, mas com sobrecarga de sincronização |
| Uso Recomendado | Listas com acesso predominante por índice | Listas com frequentes inserções e remoções | Ambientes multithread onde a sincronização é necessária |

### Uso de `List` como Tipo

- Usar `List` como o tipo de uma estrutura de dados (ao invés de `ArrayList`, `LinkedList`, etc.) oferece flexibilidade.
- Facilita a mudança do tipo de lista sem alterar o código que a utiliza.
- Promove o uso do princípio da programação para interface, não para implementação.

**Exemplo de Código Usando List:

```java
public class ListExample {
    public static void main(String[] args) {
        // Usando ArrayList
        List<String> myList = new ArrayList<>();
        myList.add("Hello");
        myList.add("World");

        processList(myList);

        // Mudando para LinkedList sem alterar o resto do código
        myList = new LinkedList<>();
        myList.add("Goodbye");
        myList.add("World");

        processList(myList);
    }

    public static void processList(List<String> list) {
        for(String item : list) {
            System.out.println(item);
        }
    }
}
```

Neste exemplo, `myList` é inicialmente uma `ArrayList`, mas depois muda para uma `LinkedList`. O método `processList` aceita um `List` e funciona independentemente do tipo específico de lista. Isso ilustra a flexibilidade e a reutilização de código proporcionada pela programação para uma interface (`List`) em vez de uma implementação específica (`ArrayList` ou `LinkedList`).