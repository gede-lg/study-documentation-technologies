## Módulo 4: Estruturas de Dados em Java

### 1. Estruturas de Set em Coleções

#### 1.1 Set

- Um Set é uma interface no Java que representa uma coleção não ordenada de elementos únicos.
- Os elementos não podem ser duplicados em um Set.
- A principal implementação da interface Set é o HashSet.
- A ordem dos elementos em um Set não é garantida.

#### 1.2 HashSet

- O HashSet é uma das implementações mais comuns da interface Set.
- Ele armazena os elementos em uma tabela hash, o que torna a recuperação dos elementos muito eficiente.
- A ordem dos elementos em um HashSet não é garantida.
- Exemplo de uso:

```java
Set<String> conjunto = new HashSet<>();
conjunto.add("Maçã");
conjunto.add("Banana");
conjunto.add("Maçã"); // Não adicionará outra "Maçã", pois Sets não permitem duplicatas.
```

#### 1.3 LinkedHashSet

- O LinkedHashSet é uma implementação do Set que mantém a ordem de inserção dos elementos.
- Ele armazena os elementos em uma tabela hash com uma lista vinculada que mantém a ordem.
- Isso significa que os elementos são recuperados na ordem em que foram inseridos.
- Exemplo de uso:

```java
Set<String> conjunto = new LinkedHashSet<>();
conjunto.add("Maçã");
conjunto.add("Banana");
conjunto.add("Maçã"); // Não adicionará outra "Maçã", mas a ordem da primeira "Maçã" será mantida.
```

#### 1.4 TreeSet

- O TreeSet é uma implementação do Set que armazena os elementos em uma árvore binária equilibrada.
- Os elementos em um TreeSet são automaticamente classificados em ordem natural ou com um Comparator fornecido.
- Isso significa que os elementos em um TreeSet são sempre ordenados.
- Exemplo de uso:

```java
Set<String> conjunto = new TreeSet<>();
conjunto.add("Maçã");
conjunto.add("Banana");
conjunto.add("Abacaxi");
// Os elementos serão recuperados em ordem alfabética.
```

### 2. Uso e as Diferenças de Cada Estrutura

- O uso de cada estrutura de Set depende dos requisitos específicos do seu programa:

   - Use HashSet quando a ordem dos elementos não importar e a eficiência de pesquisa for crucial.

   - Use LinkedHashSet quando a ordem de inserção dos elementos for importante.

   - Use TreeSet quando você precisa de uma ordem natural ou personalizada dos elementos.

- Diferenças principais:

   - HashSet: Não garante ordem dos elementos.
   
   - LinkedHashSet: Mantém a ordem de inserção.
   
   - TreeSet: Mantém os elementos em ordem natural ou personalizada.

Lembre-se de que a escolha da estrutura de dados dependerá das necessidades específicas do seu projeto, levando em consideração a eficiência, a ordem dos elementos e outros requisitos. Dominar essas estruturas de Set em Java é fundamental para um desenvolvedor Java eficaz.