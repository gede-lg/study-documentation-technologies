# T2.06 - containsAll()

## Introdução

**containsAll()**: verifica se coleção contém **todos** elementos de outra coleção.

```java
import java.util.*;

// ✅ Uso básico
public class ExemploBasico {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        lista.add("D");
        
        Collection<String> elementos = Arrays.asList("B", "C");
        
        // ✅ containsAll(): verifica se contém TODOS
        boolean contemTodos = lista.containsAll(elementos);
        
        System.out.println("Contém B e C? " + contemTodos);  // true
        
        // ✅ Verificar com elemento ausente
        Collection<String> elementos2 = Arrays.asList("B", "X");
        boolean contemTodos2 = lista.containsAll(elementos2);
        
        System.out.println("Contém B e X? " + contemTodos2);  // false (X ausente)
    }
}
```

**Regra**: containsAll() retorna **true** se contém **todos** elementos, **false** se **algum** falta.

---

## Fundamentos

### 1. Método containsAll()

```java
// ✅ containsAll(): verificar se contém todos
public class MetodoContainsAll {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("Java");
        lista.add("Python");
        lista.add("C++");
        lista.add("JavaScript");
        
        // ✅ Verificar múltiplos elementos
        Collection<String> verificar1 = Arrays.asList("Java", "Python");
        boolean contemTodos1 = lista.containsAll(verificar1);
        System.out.println("Contém Java e Python? " + contemTodos1);  // true
        
        // ✅ Verificar com elemento ausente
        Collection<String> verificar2 = Arrays.asList("Java", "Ruby");
        boolean contemTodos2 = lista.containsAll(verificar2);
        System.out.println("Contém Java e Ruby? " + contemTodos2);  // false
        
        // ✅ Verificar coleção vazia (sempre true)
        Collection<String> vazia = new ArrayList<>();
        boolean contemTodos3 = lista.containsAll(vazia);
        System.out.println("Contém vazia? " + contemTodos3);  // true
        
        // ✅ Verificar com duplicados
        Collection<String> duplicados = Arrays.asList("Java", "Java");
        boolean contemTodos4 = lista.containsAll(duplicados);
        System.out.println("Contém Java, Java? " + contemTodos4);  // true
    }
}

/*
 * containsAll():
 * 
 * ASSINATURA:
 * boolean containsAll(Collection<?> c)
 * 
 * RETORNO:
 * - true: se contém TODOS elementos de c
 * - false: se ALGUM elemento de c está ausente
 * 
 * COMPORTAMENTO:
 * - Verifica se CADA elemento de c está presente
 * - Usa contains() internamente
 * - Usa equals() para comparar
 * 
 * CASOS ESPECIAIS:
 * - Coleção vazia: SEMPRE true
 * - Duplicados em c: conta apenas uma vez
 * - null em c: verifica se contém null
 * 
 * PERFORMANCE:
 * - ArrayList: O(n*m) - contains() O(n)
 * - HashSet: O(m) - contains() O(1)
 * 
 * EXCEÇÃO:
 * - NullPointerException: se c é null
 * - ClassCastException: tipo incompatível
 */
```

**containsAll()**: verifica **todos** elementos. Coleção vazia sempre **true**. Usa **equals()**.

### 2. Comparação com equals()

```java
// ✅ containsAll() usa equals()
public class ComparacaoEquals {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("Java");
        lista.add("Python");
        
        // ✅ String: equals() compara CONTEÚDO
        Collection<String> verificar1 = Arrays.asList(new String("Java"));
        boolean contemTodos1 = lista.containsAll(verificar1);
        System.out.println("Contém? " + contemTodos1);  // true (equals())
        
        // ✅ Objetos customizados: precisa implementar equals()
        class Pessoa {
            String nome;
            Pessoa(String nome) { this.nome = nome; }
            
            @Override
            public boolean equals(Object obj) {
                if (obj instanceof Pessoa) {
                    return this.nome.equals(((Pessoa) obj).nome);
                }
                return false;
            }
            
            @Override
            public int hashCode() {
                return nome.hashCode();
            }
        }
        
        Collection<Pessoa> pessoas = new ArrayList<>();
        pessoas.add(new Pessoa("Ana"));
        pessoas.add(new Pessoa("Bruno"));
        
        Collection<Pessoa> verificar2 = Arrays.asList(new Pessoa("Ana"));
        boolean contemTodos2 = pessoas.containsAll(verificar2);
        System.out.println("Contém Ana? " + contemTodos2);  // true (equals())
    }
}

/*
 * COMPARAÇÃO equals():
 * 
 * - containsAll() usa contains()
 * - contains() usa equals()
 * - NÃO usa identidade (==)
 * 
 * STRING:
 * - equals() compara CONTEÚDO
 * - Objetos diferentes, mesmo conteúdo → equals
 * 
 * OBJETOS CUSTOMIZADOS:
 * - Deve implementar equals()
 * - Caso contrário, Object.equals() (identidade ==)
 * 
 * HASH-BASED (HashSet):
 * - Deve implementar equals() E hashCode()
 */
```

**equals()**: containsAll() usa equals() para comparar. **Não** identidade (==).

### 3. Performance

```java
// ✅ Performance containsAll()
public class PerformanceContainsAll {
    public static void main(String[] args) {
        int tamanho = 10000;
        
        // ✅ ArrayList: O(n*m) LENTO
        Collection<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < tamanho; i++) {
            arrayList.add(i);
        }
        
        Collection<Integer> verificar = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            verificar.add(i);
        }
        
        long inicio1 = System.nanoTime();
        boolean contemTodos1 = arrayList.containsAll(verificar);
        long fim1 = System.nanoTime();
        System.out.println("ArrayList: " + (fim1 - inicio1) / 1_000_000 + " ms");
        
        // ✅ HashSet: O(m) RÁPIDO
        Collection<Integer> hashSet = new HashSet<>();
        for (int i = 0; i < tamanho; i++) {
            hashSet.add(i);
        }
        
        long inicio2 = System.nanoTime();
        boolean contemTodos2 = hashSet.containsAll(verificar);
        long fim2 = System.nanoTime();
        System.out.println("HashSet: " + (fim2 - inicio2) / 1_000_000 + " ms");
    }
}

/*
 * PERFORMANCE:
 * 
 * ArrayList:
 * - containsAll(): O(n*m)
 * - Para cada elemento de c: contains() O(n)
 * - LENTO para grandes coleções
 * 
 * HashSet:
 * - containsAll(): O(m)
 * - Para cada elemento de c: contains() O(1)
 * - RÁPIDO (100-1000x mais rápido)
 * 
 * TreeSet:
 * - containsAll(): O(m * log n)
 * - contains() O(log n)
 * 
 * RECOMENDAÇÃO:
 * - Se containsAll() frequente: usar HashSet
 * - Converter ArrayList → HashSet temporariamente
 */
```

**Performance**: ArrayList O(n*m) lento, HashSet O(m) **rápido** (100-1000x).

### 4. Casos Especiais

```java
// ✅ Casos especiais
public class CasosEspeciais {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // ✅ Coleção vazia: SEMPRE true
        Collection<String> vazia = new ArrayList<>();
        boolean contemTodos1 = lista.containsAll(vazia);
        System.out.println("Contém vazia? " + contemTodos1);  // true
        
        // ✅ Duplicados na coleção de verificação
        Collection<String> duplicados = Arrays.asList("A", "A", "B");
        boolean contemTodos2 = lista.containsAll(duplicados);
        System.out.println("Contém A, A, B? " + contemTodos2);  // true
        
        // ✅ Mesma coleção: SEMPRE true
        boolean contemTodos3 = lista.containsAll(lista);
        System.out.println("Contém a si mesma? " + contemTodos3);  // true
        
        // ✅ null na coleção
        Collection<String> comNull = new ArrayList<>();
        comNull.add("A");
        comNull.add(null);
        
        Collection<String> verificarNull = Arrays.asList("A", null);
        boolean contemTodos4 = comNull.containsAll(verificarNull);
        System.out.println("Contém A e null? " + contemTodos4);  // true
        
        // ❌ null como argumento: NullPointerException
        try {
            lista.containsAll(null);
        } catch (NullPointerException e) {
            System.out.println("Não pode passar null como argumento");
        }
    }
}

/*
 * CASOS ESPECIAIS:
 * 
 * COLEÇÃO VAZIA:
 * - containsAll(vazia) → SEMPRE true
 * - Trivialmente verdadeiro
 * 
 * DUPLICADOS:
 * - Conta apenas uma vez
 * - containsAll([A, A]) → verifica apenas A
 * 
 * MESMA COLEÇÃO:
 * - containsAll(this) → SEMPRE true
 * 
 * NULL:
 * - Pode verificar se contém null
 * - containsAll([null]) → verifica null
 * 
 * NULL ARGUMENTO:
 * - containsAll(null) → NullPointerException
 */
```

**Casos especiais**: vazia sempre true, duplicados conta uma vez, null argumento exceção.

### 5. Subset (Subconjunto)

```java
// ✅ Verificar se é subconjunto
public class SubconjuntoVerificacao {
    public static void main(String[] args) {
        Set<String> conjunto = new HashSet<>();
        conjunto.add("A");
        conjunto.add("B");
        conjunto.add("C");
        conjunto.add("D");
        
        Set<String> subconjunto1 = new HashSet<>();
        subconjunto1.add("B");
        subconjunto1.add("C");
        
        // ✅ Verificar se subconjunto1 ⊆ conjunto
        boolean isSubset1 = conjunto.containsAll(subconjunto1);
        System.out.println("{B, C} ⊆ {A, B, C, D}? " + isSubset1);  // true
        
        Set<String> subconjunto2 = new HashSet<>();
        subconjunto2.add("B");
        subconjunto2.add("X");
        
        // ✅ Verificar se subconjunto2 ⊆ conjunto
        boolean isSubset2 = conjunto.containsAll(subconjunto2);
        System.out.println("{B, X} ⊆ {A, B, C, D}? " + isSubset2);  // false
        
        // ✅ Conjunto vazio é subconjunto de qualquer conjunto
        Set<String> vazio = new HashSet<>();
        boolean isSubset3 = conjunto.containsAll(vazio);
        System.out.println("∅ ⊆ {A, B, C, D}? " + isSubset3);  // true
    }
}

/*
 * SUBCONJUNTO:
 * 
 * DEFINIÇÃO:
 * A ⊆ B se todos elementos de A estão em B
 * 
 * VERIFICAÇÃO:
 * B.containsAll(A)
 * 
 * PROPRIEDADES:
 * - ∅ ⊆ A (vazio é subconjunto de qualquer)
 * - A ⊆ A (conjunto é subconjunto de si mesmo)
 * - Se A ⊆ B e B ⊆ C, então A ⊆ C (transitividade)
 */
```

**Subconjunto**: A ⊆ B se B.containsAll(A). Vazio é subconjunto de qualquer.

### 6. Exemplos Práticos

```java
// ✅ Exemplos práticos
public class ExemplosPraticos {
    
    // ✅ Exemplo 1: Validar permissões
    public static boolean temTodasPermissoes(Collection<String> usuario,
                                             Collection<String> necessarias) {
        return usuario.containsAll(necessarias);
    }
    
    // ✅ Exemplo 2: Verificar dependências
    public static boolean dependenciasInstaladas(Collection<String> instaladas,
                                                  Collection<String> requeridas) {
        return instaladas.containsAll(requeridas);
    }
    
    // ✅ Exemplo 3: Validar configuração completa
    public static boolean configuracaoCompleta(Collection<String> configurados,
                                               Collection<String> obrigatorios) {
        return configurados.containsAll(obrigatorios);
    }
    
    // ✅ Exemplo 4: Encontrar elementos faltantes
    public static <E> Collection<E> encontrarFaltantes(Collection<E> atual,
                                                       Collection<E> esperados) {
        Collection<E> faltantes = new ArrayList<>(esperados);
        faltantes.removeAll(atual);
        return faltantes;
    }
    
    public static void main(String[] args) {
        // Exemplo 1
        Collection<String> permissoesUsuario = Arrays.asList("READ", "WRITE", "EXECUTE");
        Collection<String> permissoesNecessarias = Arrays.asList("READ", "WRITE");
        
        boolean temPermissoes = temTodasPermissoes(permissoesUsuario, permissoesNecessarias);
        System.out.println("Tem todas permissões? " + temPermissoes);  // true
        
        // Exemplo 2
        Collection<String> instaladas = Arrays.asList("java", "python", "git");
        Collection<String> requeridas = Arrays.asList("java", "git");
        
        boolean depOk = dependenciasInstaladas(instaladas, requeridas);
        System.out.println("Dependências OK? " + depOk);  // true
        
        // Exemplo 3
        Collection<String> configurados = Arrays.asList("host", "port", "database");
        Collection<String> obrigatorios = Arrays.asList("host", "port", "database", "user");
        
        boolean configOk = configuracaoCompleta(configurados, obrigatorios);
        System.out.println("Configuração completa? " + configOk);  // false
        
        // Exemplo 4
        Collection<String> faltantes = encontrarFaltantes(configurados, obrigatorios);
        System.out.println("Faltantes: " + faltantes);  // [user]
    }
}
```

**Exemplos**: validar permissões, verificar dependências, encontrar faltantes.

### 7. Resumo Visual

```java
/*
 * containsAll()
 * 
 * ASSINATURA:
 * boolean containsAll(Collection<?> c)
 * 
 * RETORNO:
 * - true: se contém TODOS elementos de c
 * - false: se ALGUM elemento de c está ausente
 * 
 * COMPORTAMENTO:
 * - Verifica se CADA elemento de c está presente
 * - Usa contains() internamente
 * - Usa equals() para comparar (NÃO ==)
 * 
 * CASOS ESPECIAIS:
 * - Coleção vazia: SEMPRE true
 * - Duplicados: conta uma vez
 * - Mesma coleção: SEMPRE true
 * - null elementos: OK (verifica null)
 * - null argumento: NullPointerException
 * 
 * PERFORMANCE:
 * 
 * ArrayList:
 * - O(n*m) - contains() O(n)
 * - LENTO
 * 
 * HashSet:
 * - O(m) - contains() O(1)
 * - RÁPIDO (100-1000x)
 * 
 * TreeSet:
 * - O(m * log n) - contains() O(log n)
 * 
 * SUBCONJUNTO:
 * A ⊆ B se B.containsAll(A)
 * 
 * EQUIVALENTE A:
 * for (E elemento : c) {
 *     if (!this.contains(elemento)) {
 *         return false;
 *     }
 * }
 * return true;
 * 
 * EXCEÇÃO:
 * - NullPointerException: se c é null
 * - ClassCastException: tipo incompatível
 */

public class ExemploContainsAll {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // ✅ Verificar múltiplos
        Collection<String> verificar = Arrays.asList("A", "B");
        boolean contemTodos = lista.containsAll(verificar);
        System.out.println("Contém A e B? " + contemTodos);  // true
        
        // ✅ Elemento ausente
        Collection<String> verificar2 = Arrays.asList("A", "X");
        boolean contemTodos2 = lista.containsAll(verificar2);
        System.out.println("Contém A e X? " + contemTodos2);  // false
        
        // ✅ Coleção vazia
        boolean contemTodos3 = lista.containsAll(new ArrayList<>());
        System.out.println("Contém vazia? " + contemTodos3);  // true
    }
}
```

---

## Aplicabilidade

**containsAll()**:
- Verificar se contém **múltiplos** elementos
- Validar **permissões** (tem todas necessárias?)
- Verificar **dependências** (todas instaladas?)
- Validar **configuração** completa
- Verificar **subconjunto** (A ⊆ B)

---

## Armadilhas

### 1. Performance ArrayList

```java
// ❌ ArrayList: O(n*m) LENTO
arrayList.containsAll(verificar);

// ✅ Converter para HashSet
Set<String> set = new HashSet<>(arrayList);
set.containsAll(verificar);  // O(m) RÁPIDO
```

### 2. NullPointerException

```java
// ❌ null argumento
lista.containsAll(null);  // NullPointerException

// ✅ Verificar null
if (outra != null && lista.containsAll(outra)) {
    // ...
}
```

---

## Boas Práticas

### 1. Usar HashSet Para Performance

```java
// ✅ HashSet para containsAll frequente
Set<String> set = new HashSet<>(lista);
boolean contemTodos = set.containsAll(verificar);  // Rápido
```

### 2. Validar Null

```java
// ✅ Verificar null antes
if (outra != null) {
    boolean contemTodos = lista.containsAll(outra);
}
```

### 3. Encontrar Faltantes

```java
// ✅ Se containsAll false, encontrar faltantes
if (!lista.containsAll(esperados)) {
    Collection<String> faltantes = new ArrayList<>(esperados);
    faltantes.removeAll(lista);
    System.out.println("Faltantes: " + faltantes);
}
```

---

## Resumo

**containsAll()**:
- Verifica se contém **todos** elementos
- Retorna **true** se todos presentes, **false** se algum ausente
- Usa **contains()** internamente
- Usa **equals()** para comparar (não ==)

**Casos especiais**:
- Coleção **vazia**: sempre **true**
- **Duplicados**: conta apenas uma vez
- **Mesma** coleção: sempre true
- null **elementos**: OK (verifica null)
- null **argumento**: NullPointerException

**Performance**:
- ArrayList: **O(n*m)** (lento)
- HashSet: **O(m)** (rápido - 100-1000x)
- TreeSet: **O(m * log n)**

**Subconjunto**:
- A ⊆ B se B.containsAll(A)
- Vazio é subconjunto de qualquer
- Conjunto é subconjunto de si mesmo

**Uso**:
- Validar **permissões**
- Verificar **dependências**
- Validar **configuração** completa
- Encontrar elementos **faltantes**

**Regra de Ouro**: containsAll verifica todos elementos retorna true todos presentes false algum ausente. Usa equals comparar não identidade. Coleção vazia sempre true duplicados conta uma vez null argumento exceção. Performance ArrayList O(n*m) lento HashSet O(m) rápido 100-1000x preferir HashSet verificações frequentes. Subconjunto A ⊆ B se B.containsAll(A). Validar permissões dependências configuração encontrar faltantes removeAll.

