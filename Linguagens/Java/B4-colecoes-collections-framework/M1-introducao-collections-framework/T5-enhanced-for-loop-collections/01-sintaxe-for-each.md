# T5.01 - Sintaxe for-each

## Introdução

**Enhanced for loop (for-each)**: itera elementos sem índice. **for (Tipo elemento : colecao)**. Simplifica iteração.

```java
import java.util.*;

// ✅ For-each
public class ForEach {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");
        nomes.add("Carlos");
        
        // ✅ FOR-EACH
        for (String nome : nomes) {
            System.out.println(nome);
        }
        
        // SINTAXE:
        // for (TipoElemento variavel : colecao) {
        //     // usar variavel
        // }
    }
}

// ❌ For tradicional
public class ForTradicional {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");
        nomes.add("Carlos");
        
        // ❌ FOR TRADICIONAL (verbose)
        for (int i = 0; i < nomes.size(); i++) {
            String nome = nomes.get(i);
            System.out.println(nome);
        }
    }
}
```

**For-each**: for (Tipo elemento : colecao). Simplifica iteração. Sem índice.

---

## Fundamentos

### 1. Sintaxe Básica

```java
// ✅ Sintaxe for-each
public class SintaxeBasica {
    public static void main(String[] args) {
        // SINTAXE:
        // for (TipoElemento variavel : colecao) {
        //     // código
        // }
        
        // COMPONENTES:
        // for              - palavra-chave
        // TipoElemento     - tipo elemento coleção
        // variavel         - nome variável temporária
        // :                - separador
        // colecao          - coleção a iterar
        
        // ✅ EXEMPLO List<String>
        List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
        
        for (String nome : nomes) {
            System.out.println(nome);
        }
        
        // ✅ EXEMPLO Set<Integer>
        Set<Integer> numeros = Set.of(10, 20, 30);
        
        for (Integer numero : numeros) {
            System.out.println(numero);
        }
        
        // ✅ EXEMPLO Queue<String>
        Queue<String> fila = new LinkedList<>(Arrays.asList("A", "B", "C"));
        
        for (String item : fila) {
            System.out.println(item);
        }
    }
}

/*
 * SINTAXE:
 * 
 * for (TipoElemento variavel : colecao) {
 *     // usar variavel
 * }
 * 
 * COMPONENTES:
 * - TipoElemento: tipo parametrizado coleção
 * - variavel: nome temporário elemento
 * - colecao: Collection, Iterable, ou array
 * 
 * EXEMPLO:
 * for (String nome : listaDeNomes) {
 *     System.out.println(nome);
 * }
 */
```

**Sintaxe**: for (TipoElemento variavel : colecao). Componentes tipo variavel colecao.

### 2. Com Diferentes Collections

```java
// ✅ For-each com diferentes Collections
public class DiferentesCollections {
    public static void main(String[] args) {
        // ✅ List
        List<String> lista = Arrays.asList("A", "B", "C");
        for (String s : lista) {
            System.out.println(s);
        }
        
        // ✅ Set
        Set<Integer> conjunto = Set.of(1, 2, 3);
        for (Integer num : conjunto) {
            System.out.println(num);
        }
        
        // ✅ Queue
        Queue<String> fila = new LinkedList<>(Arrays.asList("X", "Y", "Z"));
        for (String item : fila) {
            System.out.println(item);
        }
        
        // ✅ Deque
        Deque<String> deque = new ArrayDeque<>(Arrays.asList("P", "Q", "R"));
        for (String elemento : deque) {
            System.out.println(elemento);
        }
        
        // ✅ Array (também funciona)
        String[] array = {"Java", "Python", "C++"};
        for (String linguagem : array) {
            System.out.println(linguagem);
        }
    }
}

/*
 * FOR-EACH FUNCIONA:
 * 
 * COLLECTIONS:
 * - List
 * - Set
 * - Queue
 * - Deque
 * - Qualquer Collection
 * 
 * ARRAYS:
 * - String[]
 * - int[]
 * - Object[]
 * - Qualquer array
 * 
 * ITERABLE:
 * - Qualquer classe que implementa Iterable
 */
```

**Collections**: List, Set, Queue, Deque, arrays. Qualquer Iterable.

### 3. Comparação For-each vs For Tradicional

```java
// COMPARAÇÃO for-each vs for tradicional
public class ComparacaoFor {
    public static void main(String[] args) {
        List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
        
        // ❌ FOR TRADICIONAL (verbose)
        for (int i = 0; i < nomes.size(); i++) {
            String nome = nomes.get(i);
            System.out.println(nome);
        }
        
        // ✅ FOR-EACH (conciso)
        for (String nome : nomes) {
            System.out.println(nome);
        }
        
        // VANTAGENS FOR-EACH:
        // - Menos código (1 linha vs 3)
        // - Mais legível (intenção clara)
        // - Sem índice manual (menos erro)
        // - Sem get() (mais limpo)
        
        // QUANDO USAR FOR TRADICIONAL:
        // - Precisa índice
        // - Modificar coleção durante iteração
        // - Iterar múltiplas coleções simultaneamente
        // - Controle preciso iteração
    }
}

/*
 * COMPARAÇÃO:
 * 
 * FOR TRADICIONAL:
 * for (int i = 0; i < lista.size(); i++) {
 *     String elemento = lista.get(i);
 *     // usar elemento
 * }
 * Linhas: 3
 * Verbosidade: alta
 * Índice: disponível
 * 
 * FOR-EACH:
 * for (String elemento : lista) {
 *     // usar elemento
 * }
 * Linhas: 1
 * Verbosidade: baixa
 * Índice: não disponível
 */
```

**Comparação**: for tradicional verbose 3 linhas índice disponível, for-each conciso 1 linha sem índice.

### 4. Inferência Tipo (var - Java 10+)

```java
// ✅ Inferência tipo com var (Java 10+)
public class InferenciaTipo {
    public static void main(String[] args) {
        List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
        
        // ✅ Tipo explícito
        for (String nome : nomes) {
            System.out.println(nome);
        }
        
        // ✅ Var (Java 10+) - tipo inferido
        for (var nome : nomes) {
            System.out.println(nome);  // nome é String
        }
        
        // INFERÊNCIA:
        Set<Integer> numeros = Set.of(1, 2, 3);
        
        for (var numero : numeros) {
            System.out.println(numero);  // numero é Integer
        }
        
        // VANTAGEM:
        // Menos código quando tipo longo
        Map<String, List<Integer>> mapa = new HashMap<>();
        mapa.put("A", Arrays.asList(1, 2, 3));
        
        for (var entry : mapa.entrySet()) {
            // entry é Map.Entry<String, List<Integer>>
            System.out.println(entry.getKey() + " = " + entry.getValue());
        }
    }
}

/*
 * VAR (JAVA 10+):
 * 
 * TIPO EXPLÍCITO:
 * for (String nome : lista) { }
 * 
 * VAR (INFERIDO):
 * for (var nome : lista) { }
 * 
 * VANTAGEM:
 * Menos código com tipos longos
 * Map.Entry<String, List<Integer>> -> var
 * 
 * DESVANTAGEM:
 * Menos explícito
 * Precisa inferir tipo mentalmente
 */
```

**Var**: Java 10+ tipo inferido. for (var elemento : colecao). Menos código tipos longos.

### 5. Múltiplas Operações

```java
// ✅ Múltiplas operações for-each
public class MultiplasOperacoes {
    public static void main(String[] args) {
        List<String> palavras = Arrays.asList("java", "python", "c++");
        
        // ✅ Transformar e imprimir
        for (String palavra : palavras) {
            String maiuscula = palavra.toUpperCase();
            System.out.println(maiuscula);
        }
        
        // ✅ Filtrar e processar
        List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5, 6);
        for (Integer num : numeros) {
            if (num % 2 == 0) {  // Filtro: pares
                System.out.println("Par: " + num);
            }
        }
        
        // ✅ Acumular
        int soma = 0;
        for (Integer num : numeros) {
            soma += num;
        }
        System.out.println("Soma: " + soma);
        
        // ✅ Construir nova coleção
        List<String> maiusculas = new ArrayList<>();
        for (String palavra : palavras) {
            maiusculas.add(palavra.toUpperCase());
        }
    }
}

/*
 * OPERAÇÕES:
 * 
 * TRANSFORMAR:
 * for (String s : lista) {
 *     String transformado = s.toUpperCase();
 *     System.out.println(transformado);
 * }
 * 
 * FILTRAR:
 * for (Integer n : numeros) {
 *     if (n % 2 == 0) {
 *         System.out.println(n);
 *     }
 * }
 * 
 * ACUMULAR:
 * int soma = 0;
 * for (Integer n : numeros) {
 *     soma += n;
 * }
 * 
 * CONSTRUIR:
 * List<String> nova = new ArrayList<>();
 * for (String s : original) {
 *     nova.add(s.toUpperCase());
 * }
 */
```

**Operações**: transformar, filtrar, acumular, construir nova coleção.

### 6. For-each com Map

```java
// ✅ For-each com Map
public class ForEachMap {
    public static void main(String[] args) {
        Map<String, Integer> idades = new HashMap<>();
        idades.put("Ana", 25);
        idades.put("Bruno", 30);
        idades.put("Carlos", 28);
        
        // ✅ Iterar entrySet (chave + valor)
        for (Map.Entry<String, Integer> entry : idades.entrySet()) {
            String nome = entry.getKey();
            Integer idade = entry.getValue();
            System.out.println(nome + " tem " + idade + " anos");
        }
        
        // ✅ Iterar keySet (apenas chaves)
        for (String nome : idades.keySet()) {
            System.out.println("Nome: " + nome);
        }
        
        // ✅ Iterar values (apenas valores)
        for (Integer idade : idades.values()) {
            System.out.println("Idade: " + idade);
        }
        
        // ✅ Com var (Java 10+)
        for (var entry : idades.entrySet()) {
            System.out.println(entry.getKey() + " = " + entry.getValue());
        }
    }
}

/*
 * MAP FOR-EACH:
 * 
 * ENTRYSET (chave + valor):
 * for (Map.Entry<K, V> entry : map.entrySet()) {
 *     K chave = entry.getKey();
 *     V valor = entry.getValue();
 * }
 * 
 * KEYSET (apenas chaves):
 * for (K chave : map.keySet()) {
 *     // usar chave
 * }
 * 
 * VALUES (apenas valores):
 * for (V valor : map.values()) {
 *     // usar valor
 * }
 */
```

**Map**: entrySet (chave+valor), keySet (chaves), values (valores).

### 7. Aninhamento For-each

```java
// ✅ For-each aninhado
public class ForEachAninhado {
    public static void main(String[] args) {
        // ✅ Lista de listas
        List<List<Integer>> matriz = Arrays.asList(
            Arrays.asList(1, 2, 3),
            Arrays.asList(4, 5, 6),
            Arrays.asList(7, 8, 9)
        );
        
        for (List<Integer> linha : matriz) {
            for (Integer numero : linha) {
                System.out.print(numero + " ");
            }
            System.out.println();
        }
        
        // ✅ Map de Lists
        Map<String, List<String>> grupos = new HashMap<>();
        grupos.put("Equipe A", Arrays.asList("Ana", "Bruno"));
        grupos.put("Equipe B", Arrays.asList("Carlos", "Diana"));
        
        for (var entry : grupos.entrySet()) {
            String equipe = entry.getKey();
            List<String> membros = entry.getValue();
            
            System.out.println(equipe + ":");
            for (String membro : membros) {
                System.out.println("  - " + membro);
            }
        }
    }
}

/*
 * ANINHAMENTO:
 * 
 * LISTA DE LISTAS:
 * for (List<Integer> linha : matriz) {
 *     for (Integer num : linha) {
 *         // usar num
 *     }
 * }
 * 
 * MAP DE LISTAS:
 * for (var entry : map.entrySet()) {
 *     for (var item : entry.getValue()) {
 *         // usar item
 *     }
 * }
 */
```

**Aninhamento**: lista de listas, Map de Lists. For-each dentro for-each.

### 8. Resumo Visual

```java
/*
 * SINTAXE FOR-EACH
 * 
 * SINTAXE:
 * for (TipoElemento variavel : colecao) {
 *     // usar variavel
 * }
 * 
 * COMPONENTES:
 * - for: palavra-chave
 * - TipoElemento: tipo elemento
 * - variavel: nome temporário
 * - :: separador
 * - colecao: Collection/Iterable/array
 * 
 * EXEMPLOS:
 * 
 * List:
 * for (String nome : listaNomes) {
 *     System.out.println(nome);
 * }
 * 
 * Set:
 * for (Integer num : conjuntoNumeros) {
 *     System.out.println(num);
 * }
 * 
 * Array:
 * for (String s : arrayStrings) {
 *     System.out.println(s);
 * }
 * 
 * COMPARAÇÃO:
 * 
 * FOR TRADICIONAL:
 * for (int i = 0; i < lista.size(); i++) {
 *     String elemento = lista.get(i);
 *     System.out.println(elemento);
 * }
 * Linhas: 3
 * Índice: disponível
 * 
 * FOR-EACH:
 * for (String elemento : lista) {
 *     System.out.println(elemento);
 * }
 * Linhas: 1
 * Índice: não disponível
 * 
 * VAR (JAVA 10+):
 * for (var elemento : lista) {
 *     System.out.println(elemento);
 * }
 * Tipo inferido
 * 
 * MAP:
 * 
 * EntrySet:
 * for (Map.Entry<K, V> entry : map.entrySet()) {
 *     K chave = entry.getKey();
 *     V valor = entry.getValue();
 * }
 * 
 * KeySet:
 * for (K chave : map.keySet()) { }
 * 
 * Values:
 * for (V valor : map.values()) { }
 * 
 * FUNCIONA:
 * - List, Set, Queue, Deque
 * - Arrays
 * - Qualquer Iterable
 * 
 * VANTAGENS:
 * - Conciso (1 linha)
 * - Legível
 * - Sem índice manual
 * - Menos erro
 * 
 * QUANDO USAR FOR TRADICIONAL:
 * - Precisa índice
 * - Modificar durante iteração
 * - Múltiplas coleções simultâneas
 */

// ✅ EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
        
        for (String nome : nomes) {
            System.out.println(nome);
        }
    }
}
```

---

## Aplicabilidade

**For-each**:
- **Iterar** coleções completas
- **Leitura** elementos
- **Processamento** sequencial
- **Transformação** construindo nova coleção

**Quando usar**:
- **Sempre** que não precisa índice
- **Sempre** que não modifica coleção
- **Leitura** apenas

---

## Armadilhas

### 1. Sem Índice

```java
// ❌ Não tem índice
for (String nome : lista) {
    // Não sabe posição
}

// ✅ For tradicional quando precisa índice
for (int i = 0; i < lista.size(); i++) {
    System.out.println(i + ": " + lista.get(i));
}
```

### 2. Não Modificar Coleção

```java
// ❌ ConcurrentModificationException
List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C"));
for (String s : lista) {
    lista.remove(s);  // ERRO
}

// ✅ Iterator.remove()
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    it.next();
    it.remove();
}
```

---

## Boas Práticas

### 1. Preferir For-each

```java
// ✅ For-each quando não precisa índice
for (String nome : nomes) {
    System.out.println(nome);
}

// ❌ For tradicional desnecessário
for (int i = 0; i < nomes.size(); i++) {
    System.out.println(nomes.get(i));
}
```

### 2. Usar var Tipos Longos

```java
// ✅ Var tipos complexos
for (var entry : map.entrySet()) {
    System.out.println(entry);
}

// ❌ Tipo explícito longo
for (Map.Entry<String, List<Integer>> entry : map.entrySet()) {
    System.out.println(entry);
}
```

### 3. Nome Variável Significativo

```java
// ✅ Nome claro
for (String nome : listaNomes) { }

// ❌ Nome genérico
for (String s : listaNomes) { }
```

---

## Resumo

**Sintaxe**:
- for (**TipoElemento variavel : colecao**)
- Itera elementos sem índice
- Simplifica iteração

**Componentes**:
- **TipoElemento**: tipo parametrizado
- **variavel**: nome temporário
- **colecao**: Collection/Iterable/array

**Collections**:
- List, Set, Queue, Deque
- Arrays
- Qualquer Iterable

**Comparação**:
- **For tradicional**: 3 linhas, índice disponível, verbose
- **For-each**: 1 linha, sem índice, conciso

**Var (Java 10+)**:
- for (**var elemento : colecao**)
- Tipo inferido
- Menos código tipos longos

**Map**:
- **entrySet()**: chave + valor
- **keySet()**: apenas chaves
- **values()**: apenas valores

**Vantagens**:
- Conciso (1 linha)
- Legível (intenção clara)
- Sem índice manual (menos erro)
- Sem get() (mais limpo)

**Limitações**:
- Sem índice disponível
- Não modificar coleção durante iteração
- Não múltiplas coleções simultâneas

**Regra de Ouro**: PREFERIR for-each quando não precisa índice modificar coleção. for TipoElemento variavel colecao sintaxe concisa 1 linha legível sem índice manual get menos erro. Funciona List Set Queue Deque arrays Iterable. Comparação for tradicional 3 linhas verbose índice disponível for-each 1 linha conciso sem índice. Var Java 10 tipo inferido menos código tipos longos Map.Entry var. Map entrySet chave valor keySet chaves values valores. Operações transformar filtrar acumular construir. Aninhamento lista listas Map Lists for-each dentro for-each. Vantagens conciso legível sem índice menos erro. Limitações sem índice não modificar ConcurrentModificationException usar Iterator.remove. SEMPRE for-each leitura apenas NUNCA modificar durante iteração.

