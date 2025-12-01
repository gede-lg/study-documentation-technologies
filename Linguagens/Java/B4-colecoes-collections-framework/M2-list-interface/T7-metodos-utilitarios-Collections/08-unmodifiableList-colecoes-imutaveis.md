# T7.08 - unmodifiableList(): Coleções Imutáveis

## Introdução

**Collections.unmodifiableList()**: cria wrapper read-only List imutável UnsupportedOperationException tentativa modificação proteção dados compartilhados.

```java
import java.util.*;

public class UnmodifiableIntro {
    public static void main(String[] args) {
        List<String> original = new ArrayList<>(Arrays.asList("A", "B", "C"));
        
        List<String> imutavel = Collections.unmodifiableList(original);
        
        System.out.println("Imutável: " + imutavel);
        
        // LEITURA: OK
        System.out.println("get(0): " + imutavel.get(0));
        System.out.println("size(): " + imutavel.size());
        
        // MODIFICAÇÃO: ERRO
        try {
            imutavel.add("D");
        } catch (UnsupportedOperationException e) {
            System.out.println("\nErro add: " + e.getClass().getSimpleName());
        }
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Leitura: permitida");
        System.out.println("Modificação: bloqueada");
    }
}
```

**unmodifiableList**: wrapper read-only leitura OK modificação UnsupportedOperationException.

---

## Fundamentos

### 1. Wrapper Básico

```java
public class UnmodifiableBasico {
    public static void main(String[] args) {
        // CRIAR IMUTÁVEL:
        
        List<Integer> original = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        
        List<Integer> imutavel = Collections.unmodifiableList(original);
        
        System.out.println("=== Original vs Imutável ===");
        System.out.println("Original: " + original);
        System.out.println("Imutável: " + imutavel);
        
        
        // OPERAÇÕES LEITURA (permitidas):
        
        System.out.println("\n=== Leitura ===");
        System.out.println("get(2): " + imutavel.get(2));
        System.out.println("size(): " + imutavel.size());
        System.out.println("isEmpty(): " + imutavel.isEmpty());
        System.out.println("contains(3): " + imutavel.contains(3));
        System.out.println("indexOf(4): " + imutavel.indexOf(4));
        
        
        // OPERAÇÕES MODIFICAÇÃO (bloqueadas):
        
        System.out.println("\n=== Modificação ===");
        
        try {
            imutavel.add(6);
        } catch (UnsupportedOperationException e) {
            System.out.println("add(): bloqueado");
        }
        
        try {
            imutavel.remove(0);
        } catch (UnsupportedOperationException e) {
            System.out.println("remove(): bloqueado");
        }
        
        try {
            imutavel.set(0, 99);
        } catch (UnsupportedOperationException e) {
            System.out.println("set(): bloqueado");
        }
        
        try {
            imutavel.clear();
        } catch (UnsupportedOperationException e) {
            System.out.println("clear(): bloqueado");
        }
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Wrapper: não cópia");
        System.out.println("Leitura: OK");
        System.out.println("Modificação: exception");
    }
}
```

**Básico**: wrapper não cópia referência mesma lista. Leitura get size contains permitida. Modificação add remove set clear bloqueada UnsupportedOperationException.

### 2. View vs Cópia

```java
public class UnmodifiableView {
    public static void main(String[] args) {
        // VIEW (não é cópia):
        
        List<String> original = new ArrayList<>(Arrays.asList("A", "B", "C"));
        List<String> imutavel = Collections.unmodifiableList(original);
        
        System.out.println("=== View ===");
        System.out.println("Original: " + original);
        System.out.println("Imutável: " + imutavel);
        
        // Modificar original afeta imutável:
        original.add("D");
        
        System.out.println("\nApós original.add('D'):");
        System.out.println("Original: " + original);
        System.out.println("Imutável: " + imutavel);  // Também tem "D"!
        
        
        // VERDADEIRA IMUTÁVEL (cópia):
        
        List<String> dados = new ArrayList<>(Arrays.asList("X", "Y", "Z"));
        List<String> copiaImutavel = Collections.unmodifiableList(
            new ArrayList<>(dados)  // Cópia defensiva
        );
        
        System.out.println("\n=== Cópia Defensiva ===");
        System.out.println("Dados: " + dados);
        System.out.println("Cópia: " + copiaImutavel);
        
        dados.add("W");
        
        System.out.println("\nApós dados.add('W'):");
        System.out.println("Dados: " + dados);
        System.out.println("Cópia: " + copiaImutavel);  // Não mudou!
        
        
        // List.of() Java 9 (verdadeira imutável):
        
        List<Integer> imutavelJava9 = List.of(1, 2, 3);
        
        System.out.println("\n=== List.of() Java 9 ===");
        System.out.println("Lista: " + imutavelJava9);
        
        try {
            imutavelJava9.add(4);
        } catch (UnsupportedOperationException e) {
            System.out.println("add(): bloqueado");
        }
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("View: mudanças refletem");
        System.out.println("Cópia: independente");
        System.out.println("List.of(): verdadeira imutável");
    }
}
```

**View**: wrapper referência mudanças original refletem imutável. Cópia defensiva new ArrayList() independente não afeta. List.of() Java 9 verdadeira imutável sem original.

### 3. Casos de Uso

```java
public class UnmodifiableCasos {
    // CASO 1: API pública
    
    class Biblioteca {
        private List<String> livros = new ArrayList<>();
        
        public Biblioteca() {
            livros.add("Java Básico");
            livros.add("Design Patterns");
        }
        
        // ❌ ERRADO: expõe lista mutável
        public List<String> getLivrosErrado() {
            return livros;
        }
        
        // ✅ CORRETO: retorna imutável
        public List<String> getLivros() {
            return Collections.unmodifiableList(livros);
        }
    }
    
    
    // CASO 2: Constantes
    
    class Config {
        public static final List<String> AMBIENTES = 
            Collections.unmodifiableList(Arrays.asList("dev", "test", "prod"));
        
        public static final List<Integer> PORTAS_VALIDAS =
            Collections.unmodifiableList(Arrays.asList(80, 443, 8080));
    }
    
    
    // CASO 3: Builder pattern
    
    class Pedido {
        private List<String> itens;
        
        public static class Builder {
            private List<String> itens = new ArrayList<>();
            
            public Builder addItem(String item) {
                itens.add(item);
                return this;
            }
            
            public Pedido build() {
                return new Pedido(this);
            }
        }
        
        private Pedido(Builder builder) {
            this.itens = Collections.unmodifiableList(
                new ArrayList<>(builder.itens)  // Cópia defensiva
            );
        }
        
        public List<String> getItens() {
            return itens;  // Já imutável
        }
    }
    
    
    public static void main(String[] args) {
        // CASO 1:
        
        System.out.println("=== Caso 1: API ===");
        Biblioteca bib = new Biblioteca();
        List<String> livros = bib.getLivros();
        
        try {
            livros.add("Novo Livro");
        } catch (UnsupportedOperationException e) {
            System.out.println("Proteção OK: não pode modificar");
        }
        
        
        // CASO 2:
        
        System.out.println("\n=== Caso 2: Constantes ===");
        System.out.println("Ambientes: " + Config.AMBIENTES);
        
        try {
            Config.AMBIENTES.add("local");
        } catch (UnsupportedOperationException e) {
            System.out.println("Constante protegida");
        }
        
        
        // CASO 3:
        
        System.out.println("\n=== Caso 3: Builder ===");
        Pedido pedido = new Pedido.Builder()
            .addItem("Item 1")
            .addItem("Item 2")
            .build();
        
        System.out.println("Itens: " + pedido.getItens());
        
        try {
            pedido.getItens().add("Item 3");
        } catch (UnsupportedOperationException e) {
            System.out.println("Pedido imutável após build");
        }
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("API: proteger estado interno");
        System.out.println("Constantes: valores fixos");
        System.out.println("Builder: imutável após build");
    }
}
```

**Casos**: API pública retornar imutável proteger estado interno. Constantes valores fixos configuração. Builder imutável após build cópia defensiva garantia.

### 4. Variantes

```java
public class UnmodifiableVariantes {
    public static void main(String[] args) {
        // COLLECTION:
        
        Collection<String> col = new ArrayList<>(Arrays.asList("A", "B"));
        Collection<String> imutCol = Collections.unmodifiableCollection(col);
        
        System.out.println("=== Collection ===");
        System.out.println(imutCol);
        
        
        // SET:
        
        Set<Integer> set = new HashSet<>(Arrays.asList(1, 2, 3));
        Set<Integer> imutSet = Collections.unmodifiableSet(set);
        
        System.out.println("\n=== Set ===");
        System.out.println(imutSet);
        
        
        // MAP:
        
        Map<String, Integer> map = new HashMap<>();
        map.put("A", 1);
        map.put("B", 2);
        Map<String, Integer> imutMap = Collections.unmodifiableMap(map);
        
        System.out.println("\n=== Map ===");
        System.out.println(imutMap);
        
        try {
            imutMap.put("C", 3);
        } catch (UnsupportedOperationException e) {
            System.out.println("Map bloqueado");
        }
        
        
        // SORTED SET:
        
        SortedSet<String> sorted = new TreeSet<>(Arrays.asList("C", "A", "B"));
        SortedSet<String> imutSorted = Collections.unmodifiableSortedSet(sorted);
        
        System.out.println("\n=== SortedSet ===");
        System.out.println(imutSorted);
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("unmodifiableCollection");
        System.out.println("unmodifiableSet");
        System.out.println("unmodifiableMap");
        System.out.println("unmodifiableSortedSet");
        System.out.println("unmodifiableSortedMap");
    }
}
```

**Variantes**: unmodifiableCollection genérico. unmodifiableSet HashSet TreeSet. unmodifiableMap HashMap. unmodifiableSortedSet TreeSet. unmodifiableSortedMap TreeMap.

---

## Aplicabilidade

**unmodifiableList usar**: proteger lista retorno API getters constantes configuração builder imutável. Wrapper view não cópia cópia defensiva verdadeira imutável. Java 9 List.of() preferir.

---

## Armadilhas

```java
// ❌ View reflete mudanças
List<String> original = new ArrayList<>(Arrays.asList("A"));
List<String> imutavel = Collections.unmodifiableList(original);
original.add("B");  // imutavel também vê "B"!

// ✅ Cópia defensiva
List<String> imutavel = Collections.unmodifiableList(
    new ArrayList<>(original)
);

// ❌ Objetos mutáveis internos
class Pessoa { String nome; }
List<Pessoa> pessoas = ...;
List<Pessoa> imut = Collections.unmodifiableList(pessoas);
imut.get(0).nome = "Mudou";  // PERMITE!

// ✅ Objetos imutáveis
record Pessoa(String nome) {}  // Java 14+
```

---

## Boas Práticas

```java
// ✅ Cópia defensiva API
public List<T> getItems() {
    return Collections.unmodifiableList(
        new ArrayList<>(items)
    );
}

// ✅ Constantes
public static final List<String> VALORES =
    Collections.unmodifiableList(Arrays.asList("A", "B"));

// ✅ Java 9+
List<String> imutavel = List.of("A", "B", "C");
```

---

## Resumo

**Collections.unmodifiableList**: cria wrapper read-only List imutável leitura permitida get size contains modificação bloqueada add remove set clear UnsupportedOperationException proteção dados.

**View vs Cópia**: wrapper view referência mesma lista mudanças original refletem imutável não verdadeira imutável. Cópia defensiva new ArrayList() independente não afeta isolada. Java 9 List.of() verdadeira imutável sem original criação direta preferir moderna.

**Casos uso**: API pública retornar imutável proteger estado interno getters encapsulamento. Constantes valores fixos configuração ambientes portas. Builder imutável após build cópia defensiva garantia não modificação. Thread-safety compartilhar read-only entre threads seguro.

**Variantes**: unmodifiableCollection genérico qualquer. unmodifiableSet HashSet TreeSet. unmodifiableMap HashMap chave valor. unmodifiableSortedSet TreeSet ordenado. unmodifiableSortedMap ordenado chave. Todos wrapper view mesma característica cópia defensiva verdadeira.

