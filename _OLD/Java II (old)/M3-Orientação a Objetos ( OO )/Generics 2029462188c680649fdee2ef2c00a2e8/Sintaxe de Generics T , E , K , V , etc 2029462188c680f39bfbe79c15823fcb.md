# Sintaxe de Generics: <T>, <E>, <K>, <V>, etc

**1. Introdução**
Generics em Java permitem que classes, interfaces e métodos operem sobre tipos especificados apenas no uso, fornecendo **type safety** em tempo de compilação e eliminando casts desnecessários. O **tema principal** aqui é a **sintaxe de Generics**—isto é, como usar as marcações `<T>`, `<E>`, `<K>`, `<V>` e similares em declarações de tipos genéricos. **Subtemas** envolvem wildcards (`? extends`, `? super`), type bounds (`<T extends Number>`) e o mecanismo de **type erasure**. Compreender essa sintaxe é fundamental para escrever APIs flexíveis, legíveis e robustas, especialmente ao lidar com coleções, frameworks e código reutilizável.

---

**2. Sumário**

- Sintaxe e Estrutura
- Componentes Principais
- Restrições de Uso
- Exemplos de Código Otimizados
- Informações Adicionais
- Referências para Estudo Independente

---

**3. Conteúdo Detalhado**

### Sintaxe e Estrutura

1. **Declaração de Tipos Genéricos**
    
    ```java
    public class Caixa<T> { … }
    public interface Fabrica<E> { E criar(); }
    public class Par<K, V> { private K chave; private V valor; … }
    
    ```
    
    - `<T>`: tipo genérico genérico “Tipo”.
    - `<E>`: geralmente usado em coleções para “Elemento”.
    - `<K, V>`: comumente “Key” e “Value” em mapas.
    - Vários parâmetros: separados por vírgula `<T, U, V>`.
2. **Métodos Genéricos**
    
    ```java
    public static <T> void imprimirArray(T[] arr) {
        for (T item : arr) System.out.println(item);
    }
    
    ```
    
    - O `<T>` antes do tipo de retorno indica que o método é genérico.
    - Parâmetros de tipo afetam apenas aquele método, não a classe envolvente.
3. **Type Bounds**
    
    ```java
    public class Numeros<T extends Number> { … }
    public <T extends Comparable<T>> T max(T a, T b) { … }
    
    ```
    
    - `extends`: T deve ser subclasse de `Number` ou implementar `Comparable<T>`.
    - Múltiplos bounds: `<T extends A & B>` (A classe + B interface).

### Componentes Principais

- **Parâmetro de Tipo (Type Parameter)**
Define o placeholder que será substituído por um tipo concreto.
- **Argumento de Tipo (Type Argument)**
Tipo real fornecido em tempo de uso, ex.: `Caixa<String> caixa = new Caixa<>();`.
- **Wildcards (`?`)**
    - `? extends T`: aceita subtipos de T (covariância).
    - `? super T`: aceita supertypos de T (contravariância).
    - `?`: equivalente a `? extends Object`.
- **Type Erasure**
Durante a compilação, informações de tipo genérico são removidas (“erased”), garantindo compatibilidade retroativa com bytecode pré-Java 5.

### Restrições de Uso

- **Não é possível instanciar um parâmetro de tipo**:
    
    ```java
    // Inválido:
    T instancia = new T();
    
    ```
    
- **Não é possível criar arrays de genéricos**:
    
    ```java
    // Inválido:
    List<String>[] listas = new List<String>[10];
    
    ```
    
- **Não se pode usar tipos primitivos** como argumentos genéricos (`List<int>` é inválido; use `List<Integer>`).
- **Type tokens**: para distinguir tipos genéricos em runtime, é necessário passar `Class<T>` como parâmetro.

---

**4. Exemplos de Código Otimizados**

```java
/** 1. Classe Genérica Simples */
public class Caixa<T> {
    private T conteudo;
    public void guardar(T conteudo) { this.conteudo = conteudo; }
    public T obter() { return conteudo; }
}

// Uso:
Caixa<String> caixaString = new Caixa<>();
caixaString.guardar("Olá, Generics!");
String texto = caixaString.obter(); // sem cast manual

/** 2. Método Genérico com Type Bound */
public class Util {
    public static <T extends Comparable<T>> T max(T a, T b) {
        return (a.compareTo(b) >= 0) ? a : b;
    }
}
// Uso:
int maior = Util.max(42, 17);
String maiorTexto = Util.max("Java", "Python");

/** 3. Uso de Wildcards em APIs */
public void copiarLista(List<? super Integer> destino, List<? extends Integer> origem) {
    for (Integer n : origem) {
        destino.add(n);
    }
}
// Permite copiar de List<Integer> para List<Number> ou List<Object>.

/** 4. Par<K, V> para Map-like Utility */
public class Par<K, V> {
    private final K chave;
    private final V valor;
    public Par(K chave, V valor) {
        this.chave = chave; this.valor = valor;
    }
    public K getChave() { return chave; }
    public V getValor() { return valor; }
}
// Exemplo real:
Par<String, Integer> contato = new Par<>("Gustavo", 27);

```

> Boas práticas:
> 
> - Prefira nomes semânticos: `<E>` em coleções, `<K,V>` em mapas, `<T>` para casos gerais.
> - Use **diamond operator** (`<>`) desde Java 7 para inferência de tipo no lado direito.
> - Mantenha bounds mínimos necessários para maximizar reutilização.

---

**5. Informações Adicionais**

- **PECS** (“Producer Extends, Consumer Super”): guia para wildcards.
- **Type tokens e reflexão**: use `Class<T>` ou `TypeReference<T>` (Jackson) para preservar informação de tipo em frameworks de serialização.
- **Generics e Performance**: type erasure significa que não há overhead de novos tipos em tempo de execução, mas atenção a autoboxing ao usar wrappers.
- **Covariância vs. Contravariância**: entender como List<Subclass> não é subtype de List<Superclass>, e como wildcards habilitam flexibilidade.

---

**6. Referências para Estudo Independente**

- **Documentação Oracle**:
[https://docs.oracle.com/javase/tutorial/java/generics/index.html](https://docs.oracle.com/javase/tutorial/java/generics/index.html)
- **Livro “Effective Java”** (Joshua Bloch), Capítulo sobre Generics
- **Artigos Baeldung**:
    - [https://www.baeldung.com/java-generics](https://www.baeldung.com/java-generics)
    - [https://www.baeldung.com/java-why-generics](https://www.baeldung.com/java-why-generics)
- **StackOverflow** (busque “PECS generics Java”)

---

Com essa base, você terá domínio completo da sintaxe de Generics em Java, capaz de projetar APIs seguras, flexíveis e alinhadas às melhores práticas.