# T5.03 - Limitações do for-each

## Introdução

**Limitações for-each**: sem índice, não modificar coleção, não múltiplas simultaneamente, somente leitura.

```java
import java.util.*;

// ❌ Limitações for-each
public class LimitacoesForEach {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C"));
        
        // ❌ LIMITAÇÃO 1: Sem índice
        for (String s : lista) {
            // Não sabe posição elemento
            // System.out.println("Índice: ???");
        }
        
        // ❌ LIMITAÇÃO 2: Não modificar coleção
        for (String s : lista) {
            // lista.remove(s);  // ConcurrentModificationException
        }
        
        // ❌ LIMITAÇÃO 3: Não múltiplas coleções
        List<String> lista2 = Arrays.asList("X", "Y", "Z");
        for (String s : lista) {
            // Não acessa lista2 simultaneamente
        }
        
        // ❌ LIMITAÇÃO 4: Somente leitura
        for (String s : lista) {
            s = "Novo";  // NÃO modifica coleção (só variável local)
        }
        System.out.println(lista);  // [A, B, C] (inalterado)
    }
}
```

**Limitações**: sem índice, não modificar, não múltiplas, somente leitura.

---

## Fundamentos

### 1. Sem Índice Disponível

```java
// ❌ Sem índice
public class SemIndice {
    public static void main(String[] args) {
        List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
        
        // ❌ FOR-EACH: sem índice
        for (String nome : nomes) {
            // Não sabe posição
            System.out.println(nome);
        }
        
        // ✅ FOR TRADICIONAL: com índice
        for (int i = 0; i < nomes.size(); i++) {
            String nome = nomes.get(i);
            System.out.println(i + ": " + nome);
        }
        
        // ✅ SOLUÇÃO: contador manual
        int indice = 0;
        for (String nome : nomes) {
            System.out.println(indice + ": " + nome);
            indice++;
        }
        
        // ❌ PROBLEMA: código verbose
        // Perde vantagem for-each
    }
}

/*
 * SEM ÍNDICE:
 * 
 * FOR-EACH:
 * for (T elemento : colecao) {
 *     // Sem acesso índice
 * }
 * 
 * FOR TRADICIONAL:
 * for (int i = 0; i < colecao.size(); i++) {
 *     T elemento = colecao.get(i);
 *     // Índice i disponível
 * }
 * 
 * SOLUÇÃO (verbose):
 * int i = 0;
 * for (T elemento : colecao) {
 *     // usar i
 *     i++;
 * }
 */
```

**Sem índice**: for-each não fornece posição. For tradicional quando precisa índice.

### 2. Não Modificar Coleção

```java
// ❌ Não modificar durante iteração
public class NaoModificar {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
        
        // ❌ ERRO: ConcurrentModificationException
        try {
            for (String s : lista) {
                if (s.equals("B")) {
                    lista.remove(s);  // ERRO RUNTIME
                }
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("ERRO: " + e.getClass().getSimpleName());
        }
        
        // ❌ ADICIONAR também erro
        try {
            for (String s : lista) {
                lista.add("Novo");  // ERRO RUNTIME
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("ERRO: " + e.getClass().getSimpleName());
        }
        
        // ✅ SOLUÇÃO 1: Iterator.remove()
        Iterator<String> it = lista.iterator();
        while (it.hasNext()) {
            String s = it.next();
            if (s.equals("B")) {
                it.remove();  // OK
            }
        }
        
        // ✅ SOLUÇÃO 2: removeIf (Java 8+)
        lista.removeIf(s -> s.equals("C"));
        
        // ✅ SOLUÇÃO 3: criar nova lista
        List<String> nova = new ArrayList<>();
        for (String s : lista) {
            if (!s.equals("D")) {
                nova.add(s);
            }
        }
    }
}

/*
 * NÃO MODIFICAR:
 * 
 * PROIBIDO:
 * for (T elemento : lista) {
 *     lista.remove(elemento);  ❌
 *     lista.add(novo);         ❌
 * }
 * 
 * LANÇA:
 * ConcurrentModificationException
 * 
 * SOLUÇÕES:
 * 1. Iterator.remove()
 * 2. removeIf()
 * 3. Criar nova lista
 */
```

**Não modificar**: remove/add lança ConcurrentModificationException. Usar Iterator.remove() ou removeIf().

### 3. Não Múltiplas Coleções

```java
// ❌ Não múltiplas coleções simultaneamente
public class NaoMultiplas {
    public static void main(String[] args) {
        List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
        List<Integer> idades = Arrays.asList(25, 30, 28);
        
        // ❌ FOR-EACH: não acessa duas simultaneamente
        for (String nome : nomes) {
            // Não acessa idades[i] correspondente
        }
        
        // ✅ FOR TRADICIONAL: índice comum
        for (int i = 0; i < nomes.size(); i++) {
            String nome = nomes.get(i);
            Integer idade = idades.get(i);
            System.out.println(nome + " tem " + idade + " anos");
        }
        
        // ✅ SOLUÇÃO: combinar em Map
        Map<String, Integer> pessoasIdades = new HashMap<>();
        for (int i = 0; i < nomes.size(); i++) {
            pessoasIdades.put(nomes.get(i), idades.get(i));
        }
        
        for (var entry : pessoasIdades.entrySet()) {
            System.out.println(entry.getKey() + " tem " + entry.getValue() + " anos");
        }
        
        // ✅ SOLUÇÃO: criar classe
        class Pessoa {
            String nome;
            int idade;
            Pessoa(String nome, int idade) {
                this.nome = nome;
                this.idade = idade;
            }
        }
        
        List<Pessoa> pessoas = Arrays.asList(
            new Pessoa("Ana", 25),
            new Pessoa("Bruno", 30),
            new Pessoa("Carlos", 28)
        );
        
        for (Pessoa p : pessoas) {
            System.out.println(p.nome + " tem " + p.idade + " anos");
        }
    }
}

/*
 * NÃO MÚLTIPLAS:
 * 
 * FOR-EACH:
 * for (T elemento : colecao1) {
 *     // Não acessa colecao2[i]
 * }
 * 
 * FOR TRADICIONAL:
 * for (int i = 0; i < colecao1.size(); i++) {
 *     T1 elemento1 = colecao1.get(i);
 *     T2 elemento2 = colecao2.get(i);
 * }
 * 
 * SOLUÇÕES:
 * 1. For tradicional índice
 * 2. Combinar em Map
 * 3. Criar classe dados
 */
```

**Não múltiplas**: for-each itera uma coleção. For tradicional para múltiplas simultâneas.

### 4. Somente Leitura

```java
// ❌ Somente leitura (não modifica elementos)
public class SomenteLeitura {
    public static void main(String[] args) {
        // ❌ PRIMITIVOS/Wrappers: não modificável
        List<String> lista = new ArrayList<>(Arrays.asList("a", "b", "c"));
        
        for (String s : lista) {
            s = s.toUpperCase();  // Modifica APENAS variável local
        }
        System.out.println(lista);  // [a, b, c] (INALTERADO)
        
        // ✅ FOR TRADICIONAL: modificar com set()
        for (int i = 0; i < lista.size(); i++) {
            lista.set(i, lista.get(i).toUpperCase());
        }
        System.out.println(lista);  // [A, B, C] (MODIFICADO)
        
        // ✅ OBJETOS: modificar atributos OK
        class Pessoa {
            String nome;
            Pessoa(String nome) { this.nome = nome; }
            @Override
            public String toString() { return nome; }
        }
        
        List<Pessoa> pessoas = new ArrayList<>(Arrays.asList(
            new Pessoa("Ana"),
            new Pessoa("Bruno")
        ));
        
        // ✅ Modificar ATRIBUTOS OK
        for (Pessoa p : pessoas) {
            p.nome = p.nome.toUpperCase();  // OK (modifica objeto)
        }
        System.out.println(pessoas);  // [ANA, BRUNO] (MODIFICADO)
        
        // ❌ Reatribuir variável NÃO afeta lista
        for (Pessoa p : pessoas) {
            p = new Pessoa("Novo");  // NÃO afeta lista
        }
        System.out.println(pessoas);  // [ANA, BRUNO] (INALTERADO)
    }
}

/*
 * SOMENTE LEITURA:
 * 
 * VARIÁVEL LOCAL:
 * for (T elemento : lista) {
 *     elemento = novo;  // NÃO afeta lista
 * }
 * 
 * MODIFICAR LISTA:
 * for (int i = 0; i < lista.size(); i++) {
 *     lista.set(i, novo);  // Modifica lista
 * }
 * 
 * OBJETOS:
 * for (Objeto obj : lista) {
 *     obj.atributo = novo;  // OK (modifica objeto)
 *     obj = new Objeto();   // NÃO afeta lista
 * }
 */
```

**Somente leitura**: reatribuir variável não afeta lista. Modificar atributos objetos OK. Usar set() modificar elementos.

### 5. Sem Controle Iteração

```java
// ❌ Sem controle iteração
public class SemControle {
    public static void main(String[] args) {
        List<String> lista = Arrays.asList("A", "B", "C", "D", "E");
        
        // ❌ FOR-EACH: sem break customizado
        // Itera TODOS elementos
        for (String s : lista) {
            System.out.println(s);
            // break funciona, mas apenas break simples
        }
        
        // ❌ FOR-EACH: sem skip (continuar próximo)
        for (String s : lista) {
            if (s.equals("C")) {
                continue;  // Pula apenas C
            }
            System.out.println(s);
        }
        
        // ❌ FOR-EACH: sem começar do meio
        // Sempre começa primeiro elemento
        
        // ✅ FOR TRADICIONAL: controle total
        for (int i = 2; i < lista.size(); i++) {  // Começa índice 2
            String s = lista.get(i);
            System.out.println(s);
        }
        
        // ✅ FOR TRADICIONAL: step customizado
        for (int i = 0; i < lista.size(); i += 2) {  // Pula de 2 em 2
            String s = lista.get(i);
            System.out.println(s);
        }
    }
}

/*
 * SEM CONTROLE:
 * 
 * FOR-EACH:
 * - Começa primeiro elemento
 * - Itera sequencial
 * - Step 1
 * - break/continue funcionam
 * 
 * FOR TRADICIONAL:
 * - Começa qualquer índice
 * - Step customizado (i++, i+=2)
 * - Controle total
 * 
 * FOR-EACH LIMITADO:
 * - Não começar meio
 * - Não step customizado
 * - Não reverso
 */
```

**Sem controle**: for-each sempre começa primeiro, step 1, sequencial. For tradicional controle total.

### 6. List vs Set Comportamento

```java
// Comportamento diferente List vs Set
public class ListVsSet {
    public static void main(String[] args) {
        // ✅ LIST: ordem previsível
        List<String> lista = Arrays.asList("A", "B", "C");
        for (String s : lista) {
            System.out.println(s);  // A, B, C (ordem inserção)
        }
        
        // ❌ HASHSET: ordem imprevisível
        Set<String> hashSet = new HashSet<>(Arrays.asList("A", "B", "C"));
        for (String s : hashSet) {
            System.out.println(s);  // Ordem aleatória
        }
        
        // ✅ LINKEDHASHSET: ordem inserção
        Set<String> linkedSet = new LinkedHashSet<>(Arrays.asList("A", "B", "C"));
        for (String s : linkedSet) {
            System.out.println(s);  // A, B, C (ordem inserção)
        }
        
        // ✅ TREESET: ordem natural
        Set<String> treeSet = new TreeSet<>(Arrays.asList("C", "A", "B"));
        for (String s : treeSet) {
            System.out.println(s);  // A, B, C (ordenado)
        }
    }
}

/*
 * ORDEM ITERAÇÃO:
 * 
 * LIST:
 * - Ordem inserção garantida
 * - Previsível
 * 
 * HASHSET:
 * - Ordem NÃO garantida
 * - Imprevisível
 * 
 * LINKEDHASHSET:
 * - Ordem inserção
 * - Previsível
 * 
 * TREESET:
 * - Ordem natural/comparator
 * - Ordenado
 */
```

**Ordem**: List garantida, HashSet imprevisível, LinkedHashSet inserção, TreeSet ordenado.

### 7. Performance Considerações

```java
// Performance for-each
public class PerformanceForEach {
    public static void main(String[] args) {
        // ✅ ARRAYLIST: for-each eficiente
        List<String> arrayList = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            arrayList.add("Elemento " + i);
        }
        
        // For-each usa Iterator
        // ArrayList.Iterator é O(1) por elemento
        for (String s : arrayList) {
            // Eficiente
        }
        
        // ❌ LINKEDLIST: for tradicional ineficiente
        List<String> linkedList = new LinkedList<>();
        for (int i = 0; i < 10000; i++) {
            linkedList.add("Elemento " + i);
        }
        
        // ❌ For tradicional: O(n²) (get é O(n))
        // for (int i = 0; i < linkedList.size(); i++) {
        //     String s = linkedList.get(i);  // LENTO
        // }
        
        // ✅ For-each: O(n) (Iterator é O(1))
        for (String s : linkedList) {
            // Eficiente
        }
    }
}

/*
 * PERFORMANCE:
 * 
 * ARRAYLIST:
 * - For-each: O(n) (Iterator)
 * - For tradicional: O(n) (get O(1))
 * - Ambos eficientes
 * 
 * LINKEDLIST:
 * - For-each: O(n) (Iterator O(1))
 * - For tradicional: O(n²) (get O(n))
 * - For-each PREFERÍVEL
 * 
 * REGRA:
 * For-each geralmente eficiente
 * Usa Iterator (otimizado)
 */
```

**Performance**: for-each usa Iterator (geralmente eficiente). LinkedList for-each O(n), for tradicional O(n²).

### 8. Resumo Visual

```java
/*
 * LIMITAÇÕES FOR-EACH
 * 
 * 1. SEM ÍNDICE:
 * for (T elemento : lista) {
 *     // Não sabe posição
 * }
 * 
 * Solução: for tradicional
 * for (int i = 0; i < lista.size(); i++) {
 *     T elemento = lista.get(i);
 *     // Índice i disponível
 * }
 * 
 * 2. NÃO MODIFICAR COLEÇÃO:
 * for (T elemento : lista) {
 *     lista.remove(elemento);  ❌ ConcurrentModificationException
 *     lista.add(novo);         ❌ ConcurrentModificationException
 * }
 * 
 * Soluções:
 * - Iterator.remove()
 * - removeIf()
 * - Criar nova lista
 * 
 * 3. NÃO MÚLTIPLAS SIMULTANEAMENTE:
 * for (T elemento : lista1) {
 *     // Não acessa lista2[i]
 * }
 * 
 * Solução: for tradicional
 * for (int i = 0; i < lista1.size(); i++) {
 *     T1 e1 = lista1.get(i);
 *     T2 e2 = lista2.get(i);
 * }
 * 
 * 4. SOMENTE LEITURA:
 * for (T elemento : lista) {
 *     elemento = novo;  // NÃO afeta lista
 * }
 * 
 * Solução: set()
 * for (int i = 0; i < lista.size(); i++) {
 *     lista.set(i, novo);
 * }
 * 
 * Objetos: modificar atributos OK
 * for (Objeto obj : lista) {
 *     obj.atributo = novo;  ✅ OK
 *     obj = new Objeto();   ❌ NÃO afeta lista
 * }
 * 
 * 5. SEM CONTROLE ITERAÇÃO:
 * - Sempre começa primeiro
 * - Step 1 (não customizado)
 * - Sequencial (não reverso)
 * 
 * For tradicional:
 * for (int i = 2; i < lista.size(); i += 2) {
 *     // Começa índice 2, step 2
 * }
 * 
 * 6. ORDEM DEPENDE IMPLEMENTAÇÃO:
 * List: ordem inserção
 * HashSet: imprevisível
 * LinkedHashSet: inserção
 * TreeSet: ordenado
 * 
 * 7. PERFORMANCE:
 * ArrayList: for-each eficiente
 * LinkedList: for-each PREFERÍVEL (for tradicional O(n²))
 * 
 * QUANDO USAR FOR TRADICIONAL:
 * ✅ Precisa índice
 * ✅ Modificar coleção (set)
 * ✅ Múltiplas coleções
 * ✅ Controle iteração (começo, step)
 * 
 * QUANDO USAR FOR-EACH:
 * ✅ Leitura apenas
 * ✅ Não precisa índice
 * ✅ Uma coleção
 * ✅ Sequencial simples
 */

// RESUMO LIMITAÇÕES
public class ResumoLimitacoes {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C"));
        
        // ❌ SEM índice
        // ❌ NÃO modificar (remove/add)
        // ❌ NÃO múltiplas simultaneamente
        // ❌ SOMENTE leitura (reatribuição)
        // ❌ SEM controle (começo, step)
        
        for (String s : lista) {
            System.out.println(s);
        }
    }
}
```

---

## Aplicabilidade

**For-each ideal**:
- **Leitura** apenas
- **Uma** coleção
- **Sequencial** completo
- **Não** precisa índice

**For tradicional quando**:
- **Precisa** índice
- **Modificar** elementos (set)
- **Múltiplas** coleções
- **Controle** iteração

---

## Armadilhas

### 1. ConcurrentModificationException

```java
// ❌ Modificar durante iteração
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

### 2. Reatribuição Não Afeta

```java
// ❌ Não modifica lista
for (String s : lista) {
    s = "Novo";  // Apenas variável local
}

// ✅ Usar set()
for (int i = 0; i < lista.size(); i++) {
    lista.set(i, "Novo");
}
```

### 3. Ordem HashSet Imprevisível

```java
// ❌ Ordem aleatória
Set<String> set = new HashSet<>();
for (String s : set) {
    // Ordem NÃO garantida
}

// ✅ LinkedHashSet ordem
Set<String> linked = new LinkedHashSet<>();
```

---

## Boas Práticas

### 1. For-each Leitura

```java
// ✅ For-each leitura
for (String s : lista) {
    System.out.println(s);
}

// ❌ For tradicional desnecessário
for (int i = 0; i < lista.size(); i++) {
    System.out.println(lista.get(i));
}
```

### 2. For Tradicional Modificação

```java
// ✅ For tradicional modificar
for (int i = 0; i < lista.size(); i++) {
    lista.set(i, lista.get(i).toUpperCase());
}

// ❌ For-each não funciona
for (String s : lista) {
    s = s.toUpperCase();  // NÃO afeta lista
}
```

### 3. Iterator Remover

```java
// ✅ Iterator.remove()
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (condicao) {
        it.remove();
    }
}

// ❌ For-each remove
for (String s : lista) {
    lista.remove(s);  // ERRO
}
```

---

## Resumo

**Limitações**:
1. **Sem índice** disponível
2. **Não modificar** coleção (add/remove)
3. **Não múltiplas** coleções simultaneamente
4. **Somente leitura** (reatribuição não afeta)
5. **Sem controle** iteração (começo, step)

**Sem índice**:
- For-each não fornece posição
- For tradicional quando precisa índice
- Contador manual verbose

**Não modificar**:
- remove()/add() lança ConcurrentModificationException
- Usar Iterator.remove() ou removeIf()
- Criar nova lista alternativa

**Não múltiplas**:
- For-each itera uma coleção
- For tradicional índice comum múltiplas
- Combinar Map ou criar classe

**Somente leitura**:
- Reatribuir variável não afeta lista
- Modificar atributos objetos OK
- Usar set() modificar elementos

**Sem controle**:
- Sempre começa primeiro elemento
- Step 1 sequencial
- For tradicional controle total

**Ordem**:
- List garantida inserção
- HashSet imprevisível
- LinkedHashSet inserção
- TreeSet ordenado

**Performance**:
- For-each usa Iterator eficiente
- LinkedList for-each O(n), tradicional O(n²)
- Preferir for-each geralmente

**Regra de Ouro**: For-each LIMITADO sem índice não modificar não múltiplas somente leitura sem controle. Sem índice disponível for tradicional quando precisa posição. Não modificar remove add lança ConcurrentModificationException usar Iterator.remove removeIf criar nova. Não múltiplas simultaneamente for tradicional índice comum combinar Map classe. Somente leitura reatribuir variável não afeta set modifica objetos atributos OK. Sem controle sempre primeiro step 1 sequencial for tradicional começo step customizado. Ordem List garantida HashSet imprevisível LinkedHashSet TreeSet. Performance Iterator eficiente LinkedList for-each preferível. USAR for-each leitura uma coleção sequencial. USAR for tradicional índice modificar múltiplas controle.

