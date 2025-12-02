# Métodos Genéricos: Criação e uso de métodos que aceitam ou retornam tipos genéricos

## 1. Introdução

**Visão Geral:**
Métodos genéricos em Java são funções que permitem definir um ou mais parâmetros de tipo, tornando-as capazes de operar sobre diferentes tipos de dados com segurança de tipo em tempo de compilação. Ao invés de escrever várias sobrecargas do mesmo método para cada tipo, você escreve uma única definição genérica.

**Relevância e Importância:**

- **Reuso de Código:** Reduz duplicação, pois um único método atende múltiplos tipos.
- **Segurança de Tipo:** Erros de tipo são detectados em tempo de compilação, evitando `ClassCastException` em tempo de execução.
- **Flexibilidade:** Facilita a criação de APIs e bibliotecas que funcionam com distintos tipos de dados.

**Definições e Conceitos Fundamentais:**

- **Tema Principal:** Métodos genéricos—sintaxe, uso e melhores práticas.
- **Subtemas:**
    - Parâmetros de tipo (`<T>`, `<E>`, `<K,V>`)
    - Limites de tipo (bounded type parameters)
    - Retorno genérico
    - Wildcards (`? extends`, `? super`)
- **Para que servem:** Garantir que um método seja aplicável a múltiplos tipos, mantendo segurança e clareza de código.

---

## 2. Sumário

1. [Sintaxe e Estrutura](M%C3%A9todos%20Gen%C3%A9ricos%20Cria%C3%A7%C3%A3o%20e%20uso%20de%20m%C3%A9todos%20que%20ace%202029462188c6803d8fa2fbafb61f80c2.md)
2. [Componentes Principais](M%C3%A9todos%20Gen%C3%A9ricos%20Cria%C3%A7%C3%A3o%20e%20uso%20de%20m%C3%A9todos%20que%20ace%202029462188c6803d8fa2fbafb61f80c2.md)
3. [Restrições de Uso](M%C3%A9todos%20Gen%C3%A9ricos%20Cria%C3%A7%C3%A3o%20e%20uso%20de%20m%C3%A9todos%20que%20ace%202029462188c6803d8fa2fbafb61f80c2.md)
4. [Exemplos de Código Otimizados](M%C3%A9todos%20Gen%C3%A9ricos%20Cria%C3%A7%C3%A3o%20e%20uso%20de%20m%C3%A9todos%20que%20ace%202029462188c6803d8fa2fbafb61f80c2.md)
5. [Informações Adicionais](M%C3%A9todos%20Gen%C3%A9ricos%20Cria%C3%A7%C3%A3o%20e%20uso%20de%20m%C3%A9todos%20que%20ace%202029462188c6803d8fa2fbafb61f80c2.md)
6. [Referências para Estudo Independente](M%C3%A9todos%20Gen%C3%A9ricos%20Cria%C3%A7%C3%A3o%20e%20uso%20de%20m%C3%A9todos%20que%20ace%202029462188c6803d8fa2fbafb61f80c2.md)

---

## 3. Conteúdo Detalhado

### 3.1 Sintaxe e Estrutura

- **Declaração de Método Genérico:**
    
    ```java
    public <T> Retorno métodoGenérico(T parâmetro) { ... }
    
    ```
    
    - `<T>` antes do tipo de retorno indica o parâmetro de tipo.
    - `T` pode ser qualquer identificador, mas por convenção usa-se letras maiúsculas:
        - `T` (Type)
        - `E` (Element, em coleções)
        - `K`, `V` (Key, Value em maps)
- **Exemplo Básico:**
    
    ```java
    public class Util {
        public static <T> void imprimirArray(T[] array) {
            for (T elemento : array) {
                System.out.println(elemento);
            }
        }
    }
    
    ```
    
    Aqui, `imprimirArray` aceita arrays de inteiros, strings, objetos, etc.
    

### 3.2 Componentes Principais

1. **Parâmetro de Tipo (`<T>`):**
    - Define um placeholder que será substituído por um tipo concreto na invocação.
    - Pode declarar múltiplos parâmetros: `<K, V>`.
2. **Tipo de Retorno Genérico:**
    
    ```java
    public static <T> T obterPrimeiro(T[] array) {
        return array.length > 0 ? array[0] : null;
    }
    
    ```
    
3. **Limites de Tipo (Bounded Type Parameters):**
    - **Upper bound (`extends`):** restringe `T` a subtipos de uma classe/interface.
        
        ```java
        public <T extends Number> double soma(T a, T b) {
            return a.doubleValue() + b.doubleValue();
        }
        
        ```
        
    - **Multiple bounds:**
        
        ```java
        public <T extends Number & Comparable<T>> T max(T a, T b) { … }
        
        ```
        
4. **Wildcards em Métodos Genéricos:**
    - Embora mais comuns em coleções, você pode usar `? extends T` ou `? super T` em assinaturas de método.
    - Exemplo de leitura com wildcard:
        
        ```java
        public void processarList(List<? extends Number> lista) { … }
        
        ```
        
5. **Interação Entre Componentes:**
    - Parâmetros de tipo são independentes de parâmetros formais (variáveis): `<T> void método(T t)`.
    - Cada invocação resolve `T` com o tipo do argumento real, garantindo coerência.

### 3.3 Restrições de Uso

- **Type Erasure:**
    - Em tempo de execução, parâmetros genéricos são removidos (erased). Você não pode, por exemplo, instanciar arrays genéricos diretamente: `new T[10]` gera erro.
- **Instância de Parâmetros Genéricos:**
    - Não é permitido fazer `new T()` nem `T.class`.
- **Cast Seguro:**
    - Evitar casts desnecessários; prefira métodos genéricos para retorno tipado.
- **Exceções Genéricas:**
    - Não é permitido declarar `public <T> void lançarExcecao() throws T`.

---

## 4. Exemplos de Código Otimizados

### 4.1 Exemplo Básico: Reverter um Array

```java
public class ArrayUtils {
    /**
     * Reverte a ordem dos elementos de um array genérico.
     * @param array Array de elementos de tipo qualquer.
     * @param <T>  Tipo genérico.
     */
    public static <T> void reverter(T[] array) {
        int esquerda = 0, direita = array.length - 1;
        while (esquerda < direita) {
            T temp = array[esquerda];
            array[esquerda++] = array[direita];
            array[direita--] = temp;
        }
    }
}

```

**Uso no dia a dia:**

```java
String[] nomes = { "Ana", "Bruno", "Carlos" };
ArrayUtils.reverter(nomes);
// nomes agora é { "Carlos", "Bruno", "Ana" }

```

### 4.2 Exemplo Avançado: Método Genérico com Limites

```java
public class MathUtils {
    /**
     * Retorna o maior dentre dois elementos comparáveis.
     * @param a   Primeiro elemento.
     * @param b   Segundo elemento.
     * @param <T> Tipo que deve estender Comparable.
     * @return    O maior elemento.
     */
    public static <T extends Comparable<T>> T max(T a, T b) {
        return (a.compareTo(b) >= 0) ? a : b;
    }
}

```

**Uso com diferentes tipos numéricos:**

```java
Integer maiorInt = MathUtils.max(3, 7);      // retorna 7
Double maiorDouble = MathUtils.max(2.5, 1.8); // retorna 2.5

```

### 4.3 Exemplo de Factory Genérico

```java
public class Factory {
    /**
     * Cria instância de qualquer classe que possua construtor sem parâmetros.
     * @param clazz Classe a ser instanciada.
     * @param <T>   Tipo da classe.
     * @return       Nova instância de T.
     * @throws Exception se falhar na criação.
     */
    public static <T> T criarInstancia(Class<T> clazz) throws Exception {
        return clazz.getDeclaredConstructor().newInstance();
    }
}

```

**Uso prático em reflection:**

```java
MinhaClasse obj = Factory.criarInstancia(MinhaClasse.class);

```

---

## 5. Informações Adicionais

- **Métodos Genéricos vs. Classes Genéricas:**
    - Métodos genéricos podem existir em classes não genéricas (e vice-versa).
- **PECS (Producer Extends, Consumer Super):**
    - Princípio útil para wildcards em coleções, aplicável em assinaturas.
- **Performance:**
    - Generics não impactam performance em runtime devido ao type erasure; não há overhead adicional.
- **Boas Práticas:**
    - Use nomes de tipo significativos em APIs públicas (`<Key, Value>` em vez de `<K, V>` quando fizer sentido).
    - Documente bem limites de tipo para clareza.

---

## 6. Referências para Estudo Independente

1. **Documentação Oficial Oracle – Generics**[https://docs.oracle.com/javase/tutorial/java/generics/index.html](https://docs.oracle.com/javase/tutorial/java/generics/index.html)
2. **Livro “Effective Java” (Joshua Bloch)**
    - Capítulo sobre generics: itens “Favor genericizar APIs” e “Use limites de tipo com parcimônia”.
3. **Baeldung – Guide to Java Generics**[https://www.baeldung.com/java-generics](https://www.baeldung.com/java-generics)
4. **Vogella – Java Generics Tutorial**[https://www.vogella.com/tutorials/JavaGenerics/article.html](https://www.vogella.com/tutorials/JavaGenerics/article.html)
5. **StackOverflow – Discussões sobre type erasure**[https://stackoverflow.com/questions/2719262/generics-and-type-erasure-in-java](https://stackoverflow.com/questions/2719262/generics-and-type-erasure-in-java)

---

> Pronto! Esta explicação detalhada cobre desde a sintaxe básica até casos avançados e melhores práticas para métodos genéricos em Java. Se precisar de mais exemplos ou detalhes, é só avisar!
>