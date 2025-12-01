# T2.01 - Implementação com Array Dinâmico

## Introdução

**ArrayList**: implementação **List** com **array dinâmico** interno. Redimensiona automaticamente quando necessário.

```java
import java.util.*;

// ✅ ArrayList: array dinâmico
public class ArrayListArrayDinamico {
    public static void main(String[] args) {
        // ArrayList usa array interno
        List<String> lista = new ArrayList<>();
        
        // INTERNAMENTE:
        // Object[] elementData;
        // int size;
        
        lista.add("A");  // elementData[0] = "A", size = 1
        lista.add("B");  // elementData[1] = "B", size = 2
        lista.add("C");  // elementData[2] = "C", size = 3
        
        // Array cresce automaticamente quando cheio
        
        System.out.println(lista);  // [A, B, C]
    }
}

// Array estático vs ArrayList
public class ArrayVsArrayList {
    public static void main(String[] args) {
        // ❌ Array estático: tamanho fixo
        String[] array = new String[3];
        array[0] = "A";
        array[1] = "B";
        array[2] = "C";
        // array[3] = "D";  // ERRO: ArrayIndexOutOfBoundsException
        
        // ✅ ArrayList: tamanho dinâmico
        List<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        lista.add("D");  // OK: array redimensiona automaticamente
        lista.add("E");  // OK
        
        System.out.println(lista.size());  // 5
    }
}
```

**ArrayList**: array interno **dinâmico**. Redimensiona automaticamente. Tamanho variável.

---

## Fundamentos

### 1. Estrutura Interna ArrayList

```java
// Estrutura interna ArrayList (simplificada)
public class EstruturaInterna {
    public static void main(String[] args) {
        // ARRAYLIST INTERNAMENTE:
        
        // class ArrayList<E> {
        //     private Object[] elementData;  // Array interno
        //     private int size;              // Número elementos
        //     
        //     public ArrayList() {
        //         elementData = new Object[10];  // Capacidade inicial padrão
        //         size = 0;
        //     }
        // }
        
        // CAMPOS:
        // elementData: array armazena elementos
        // size: quantidade elementos (diferente capacidade)
        
        List<String> lista = new ArrayList<>();
        
        // INICIAL:
        // elementData = [null, null, null, ..., null]  (10 posições)
        // size = 0
        
        lista.add("A");
        // elementData = [A, null, null, ..., null]
        // size = 1
        
        lista.add("B");
        // elementData = [A, B, null, ..., null]
        // size = 2
        
        lista.add("C");
        // elementData = [A, B, C, null, ..., null]
        // size = 3
    }
}

/*
 * ESTRUTURA INTERNA:
 * 
 * CAMPOS:
 * private Object[] elementData;  // Array interno
 * private int size;              // Tamanho lógico
 * 
 * SIZE VS CAPACIDADE:
 * size: elementos armazenados
 * capacity: tamanho array interno
 * 
 * EXEMPLO:
 * ArrayList com 3 elementos
 * size = 3
 * capacity = 10 (array interno tem 10 posições)
 */
```

**Estrutura**: Object[] elementData (array interno), int size (elementos). Size ≠ capacidade.

### 2. Array Dinâmico Conceito

```java
// ✅ Array dinâmico: cresce automaticamente
public class ArrayDinamico {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        
        // CAPACIDADE INICIAL: 10 (padrão)
        // elementData.length = 10
        // size = 0
        
        // Adicionar 10 elementos
        for (int i = 1; i <= 10; i++) {
            lista.add("Elemento " + i);
        }
        
        // size = 10
        // capacity = 10 (array cheio)
        
        // Adicionar 11º elemento
        lista.add("Elemento 11");
        
        // REDIMENSIONAMENTO:
        // 1. Criar novo array maior
        // 2. Copiar elementos antigos
        // 3. Adicionar novo elemento
        // 
        // Nova capacidade: ~15 (10 * 1.5)
        // size = 11
        
        System.out.println(lista.size());  // 11
        
        // VANTAGEM:
        // Usuário não precisa gerenciar tamanho
        // ArrayList redimensiona automaticamente
    }
}

/*
 * ARRAY DINÂMICO:
 * 
 * PROCESSO:
 * 1. Array interno capacidade inicial
 * 2. add() incrementa size
 * 3. Quando size == capacity
 * 4. Criar array maior
 * 5. Copiar elementos
 * 6. Substituir array interno
 * 
 * CRESCIMENTO:
 * Nova capacidade ≈ capacidade antiga * 1.5
 * 
 * EXEMPLO:
 * 10 -> 15 -> 22 -> 33 -> 49 -> ...
 */
```

**Dinâmico**: cresce automaticamente quando cheio. Nova capacidade ≈ antiga * 1.5. Redimensiona transparente.

### 3. Redimensionamento Processo

```java
// Redimensionamento passo a passo
public class RedimensionamentoProcesso {
    public static void main(String[] args) {
        // SIMULAÇÃO REDIMENSIONAMENTO
        
        // PASSO 1: ArrayList vazio
        List<String> lista = new ArrayList<>(2);  // Capacidade 2
        
        // elementData = [null, null]
        // size = 0
        // capacity = 2
        
        // PASSO 2: Adicionar elementos
        lista.add("A");
        // elementData = [A, null]
        // size = 1
        
        lista.add("B");
        // elementData = [A, B]
        // size = 2
        // capacity = 2 (CHEIO)
        
        // PASSO 3: Adicionar quando cheio
        lista.add("C");
        
        // PROCESSO REDIMENSIONAMENTO:
        // 1. Detectar size == capacity
        // 2. Calcular nova capacidade: 2 * 1.5 = 3
        // 3. Criar novo array: new Object[3]
        // 4. Copiar elementos: [A, B, null]
        // 5. Adicionar novo: [A, B, C]
        // 6. Substituir elementData
        
        // elementData = [A, B, C]
        // size = 3
        // capacity = 3
        
        lista.add("D");
        
        // NOVO REDIMENSIONAMENTO:
        // 3 * 1.5 = 4
        // elementData = [A, B, C, D]
        // size = 4
        // capacity = 4
    }
}

/*
 * REDIMENSIONAMENTO:
 * 
 * TRIGGER:
 * size == capacity
 * 
 * PROCESSO:
 * 1. Detectar array cheio
 * 2. Calcular nova capacidade
 * 3. Criar novo array
 * 4. Copiar elementos (System.arraycopy)
 * 5. Substituir array interno
 * 6. Adicionar elemento
 * 
 * FÓRMULA:
 * novaCapacidade = capacidadeAtual + (capacidadeAtual >> 1)
 * Equivale: capacidade * 1.5
 * 
 * CUSTO:
 * O(n) copiar elementos
 * Amortizado O(1) adicionar
 */
```

**Redimensionamento**: detecta cheio, nova capacidade * 1.5, cria array, copia System.arraycopy, substitui. O(n) cópia, O(1) amortizado.

### 4. Vantagens Array Dinâmico

```java
// ✅ Vantagens array dinâmico
public class VantagensArrayDinamico {
    public static void main(String[] args) {
        // ✅ VANTAGEM 1: Tamanho automático
        List<String> lista = new ArrayList<>();
        
        // Adicionar quantos quiser
        for (int i = 0; i < 1000; i++) {
            lista.add("Elemento " + i);
        }
        // Não precisa especificar tamanho inicial
        
        // ✅ VANTAGEM 2: Sem ArrayIndexOutOfBoundsException
        // (ao adicionar, não ao acessar)
        lista.add("Novo");  // Sempre funciona
        
        // ✅ VANTAGEM 3: Acesso rápido por índice
        String elemento = lista.get(500);  // O(1)
        
        // ✅ VANTAGEM 4: Memória contígua
        // Elementos consecutivos memória
        // Cache-friendly
        // Acesso sequencial eficiente
        
        // ✅ VANTAGEM 5: Métodos List
        lista.add(0, "Primeiro");     // Adicionar início
        lista.remove(10);             // Remover por índice
        lista.set(5, "Modificado");   // Modificar
        String buscar = lista.get(3); // Buscar
        
        System.out.println(lista.size());
    }
}

/*
 * VANTAGENS:
 * 
 * 1. TAMANHO DINÂMICO:
 *    Cresce automaticamente
 *    Não precisa especificar tamanho
 * 
 * 2. ACESSO O(1):
 *    get(índice) tempo constante
 *    Array subjacente
 * 
 * 3. CACHE-FRIENDLY:
 *    Memória contígua
 *    Acesso sequencial rápido
 * 
 * 4. MÉTODOS LIST:
 *    add, remove, get, set, etc
 *    Interface rica
 * 
 * 5. ITERAÇÃO EFICIENTE:
 *    For-each rápido
 *    Iterator otimizado
 */
```

**Vantagens**: tamanho automático, acesso O(1), cache-friendly contíguo, métodos List, iteração eficiente.

### 5. Desvantagens Array Dinâmico

```java
// ❌ Desvantagens array dinâmico
public class DesvantagensArrayDinamico {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        
        // ❌ DESVANTAGEM 1: Inserção/remoção meio O(n)
        lista.addAll(Arrays.asList("A", "B", "C", "D", "E"));
        
        lista.add(2, "X");  // Inserir índice 2
        // Precisa deslocar: C, D, E -> direita
        // O(n)
        
        lista.remove(1);    // Remover índice 1
        // Precisa deslocar: X, C, D, E -> esquerda
        // O(n)
        
        // ❌ DESVANTAGEM 2: Redimensionamento custoso
        List<Integer> grande = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            grande.add(i);  // Múltiplos redimensionamentos
            // Copia array inteiro cada vez
        }
        
        // ❌ DESVANTAGEM 3: Desperdício memória
        List<String> pequena = new ArrayList<>(100);
        pequena.add("A");
        pequena.add("B");
        // capacity = 100, size = 2
        // 98 posições vazias (desperdício)
        
        // ❌ DESVANTAGEM 4: Não eficiente início
        lista.add(0, "Inicio");  // Desloca TODOS
        lista.remove(0);         // Desloca TODOS
        // Use LinkedList para operações início
    }
}

/*
 * DESVANTAGENS:
 * 
 * 1. INSERÇÃO/REMOÇÃO MEIO:
 *    O(n) deslocar elementos
 *    Ineficiente
 * 
 * 2. REDIMENSIONAMENTO:
 *    O(n) copiar array
 *    Múltiplas cópias ao crescer
 * 
 * 3. DESPERDÍCIO MEMÓRIA:
 *    Capacidade > size
 *    Espaço não utilizado
 * 
 * 4. OPERAÇÕES INÍCIO:
 *    add(0, elemento) O(n)
 *    remove(0) O(n)
 *    LinkedList melhor
 */
```

**Desvantagens**: inserção/remoção meio O(n) desloca, redimensionamento O(n) copia, desperdício capacidade > size, início ineficiente.

### 6. Comparação Array Estático vs ArrayList

```java
// Array estático vs ArrayList
public class ArrayVsArrayList {
    public static void main(String[] args) {
        // ❌ ARRAY ESTÁTICO
        String[] arrayEstatico = new String[3];
        arrayEstatico[0] = "A";
        arrayEstatico[1] = "B";
        arrayEstatico[2] = "C";
        
        // Problemas:
        // - Tamanho fixo
        // - Não pode adicionar além
        // - Sem métodos auxiliares
        
        // ✅ ARRAYLIST
        List<String> arrayList = new ArrayList<>();
        arrayList.add("A");
        arrayList.add("B");
        arrayList.add("C");
        arrayList.add("D");  // OK: cresce automaticamente
        
        // Vantagens:
        // - Tamanho dinâmico
        // - Métodos add, remove, contains
        // - Implementa List
        
        // CONVERSÃO:
        // Array -> ArrayList
        String[] array = {"X", "Y", "Z"};
        List<String> listaArray = new ArrayList<>(Arrays.asList(array));
        
        // ArrayList -> Array
        List<String> lista = new ArrayList<>(Arrays.asList("P", "Q", "R"));
        String[] arrayLista = lista.toArray(new String[0]);
    }
}

/*
 * COMPARAÇÃO:
 * 
 * ARRAY ESTÁTICO:
 * - Tamanho fixo
 * - Acesso O(1)
 * - Sem métodos
 * - Sintaxe simples: array[i]
 * 
 * ARRAYLIST:
 * - Tamanho dinâmico
 * - Acesso O(1): get(i)
 * - Métodos List
 * - Redimensiona automaticamente
 * 
 * QUANDO USAR:
 * Array: tamanho conhecido fixo
 * ArrayList: tamanho variável dinâmico
 */
```

**Comparação**: array fixo sem métodos, ArrayList dinâmico métodos List. ArrayList preferível maioria casos.

### 7. Simulação Simples ArrayList

```java
// Simulação simples ArrayList
public class SimulacaoArrayList<E> {
    private Object[] elementData;
    private int size;
    
    public SimulacaoArrayList() {
        elementData = new Object[10];  // Capacidade inicial
        size = 0;
    }
    
    public void add(E elemento) {
        // Verificar se precisa redimensionar
        if (size == elementData.length) {
            redimensionar();
        }
        
        elementData[size] = elemento;
        size++;
    }
    
    @SuppressWarnings("unchecked")
    public E get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        return (E) elementData[index];
    }
    
    private void redimensionar() {
        int novaCapacidade = elementData.length + (elementData.length >> 1);  // * 1.5
        Object[] novoArray = new Object[novaCapacidade];
        
        // Copiar elementos
        System.arraycopy(elementData, 0, novoArray, 0, size);
        
        elementData = novoArray;
    }
    
    public int size() {
        return size;
    }
    
    public static void main(String[] args) {
        SimulacaoArrayList<String> lista = new SimulacaoArrayList<>();
        
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        System.out.println(lista.get(0));  // A
        System.out.println(lista.size());  // 3
    }
}

/*
 * SIMULAÇÃO:
 * 
 * CAMPOS:
 * elementData: array interno
 * size: número elementos
 * 
 * MÉTODOS:
 * add(): adiciona, redimensiona se necessário
 * get(): acessa por índice
 * redimensionar(): cria array maior, copia
 * 
 * LÓGICA:
 * size == length -> redimensionar
 * Nova capacidade: length * 1.5
 * System.arraycopy: copiar eficiente
 */
```

**Simulação**: Object[] elementData, int size, add() redimensiona, get() acessa, redimensionar() copia.

### 8. Resumo Visual

```java
/*
 * IMPLEMENTAÇÃO ARRAY DINÂMICO
 * 
 * ESTRUTURA INTERNA:
 * class ArrayList<E> {
 *     private Object[] elementData;  // Array interno
 *     private int size;              // Elementos armazenados
 * }
 * 
 * SIZE VS CAPACIDADE:
 * size: elementos armazenados (lógico)
 * capacity: tamanho array interno (físico)
 * 
 * EXEMPLO:
 * lista.add("A");
 * lista.add("B");
 * lista.add("C");
 * 
 * elementData = [A, B, C, null, null, ..., null]
 * size = 3
 * capacity = 10
 * 
 * REDIMENSIONAMENTO:
 * 
 * TRIGGER:
 * size == capacity (array cheio)
 * 
 * PROCESSO:
 * 1. Calcular nova capacidade: capacity * 1.5
 * 2. Criar novo array: new Object[novaCapacidade]
 * 3. Copiar elementos: System.arraycopy(old, new)
 * 4. Substituir elementData
 * 5. Adicionar elemento
 * 
 * CRESCIMENTO:
 * 10 -> 15 -> 22 -> 33 -> 49 -> 73 -> ...
 * 
 * VANTAGENS:
 * 
 * 1. Tamanho dinâmico (cresce automaticamente)
 * 2. Acesso O(1) por índice
 * 3. Cache-friendly (memória contígua)
 * 4. Métodos List (add, remove, get, set)
 * 5. Iteração eficiente
 * 
 * DESVANTAGENS:
 * 
 * 1. Inserção/remoção meio O(n) (deslocar)
 * 2. Redimensionamento O(n) (copiar)
 * 3. Desperdício memória (capacity > size)
 * 4. Operações início O(n) (usar LinkedList)
 * 
 * ARRAY ESTÁTICO VS ARRAYLIST:
 * 
 * ARRAY:
 * - Tamanho fixo
 * - Sem métodos
 * - array[i]
 * 
 * ARRAYLIST:
 * - Tamanho dinâmico
 * - Métodos List
 * - get(i), add(), remove()
 * 
 * COMPLEXIDADE:
 * 
 * get(i): O(1)
 * add(elemento): O(1) amortizado
 * add(i, elemento): O(n)
 * remove(i): O(n)
 * contains(elemento): O(n)
 */

// EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        // ArrayList: array dinâmico
        List<String> lista = new ArrayList<>();
        
        // Adicionar elementos
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // Acesso O(1)
        String elemento = lista.get(1);  // B
        
        // Tamanho dinâmico
        for (int i = 0; i < 100; i++) {
            lista.add("Elemento " + i);
        }
        // Redimensiona automaticamente
        
        System.out.println(lista.size());  // 103
    }
}
```

---

## Aplicabilidade

**ArrayList**:
- **Acesso** frequente por índice
- **Tamanho** variável
- **Iteração** sequencial
- **Leitura** dominante sobre inserção/remoção

**Quando usar**:
- **Get** frequente
- **Tamanho** dinâmico
- **Não** muita inserção/remoção meio

---

## Armadilhas

### 1. Capacidade vs Size

```java
// Capacidade ≠ size
List<String> lista = new ArrayList<>(100);
lista.add("A");
lista.add("B");

// capacity = 100
// size = 2
// 98 posições vazias (desperdício)
```

### 2. Inserção Meio Lenta

```java
// ❌ Inserção meio O(n)
lista.add(0, "Inicio");  // Desloca TODOS

// ✅ Inserção fim O(1)
lista.add("Fim");
```

### 3. Redimensionamento Custoso

```java
// ❌ Múltiplos redimensionamentos
List<Integer> lista = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    lista.add(i);  // Redimensiona várias vezes
}

// ✅ Capacidade inicial
List<Integer> lista = new ArrayList<>(10000);
for (int i = 0; i < 10000; i++) {
    lista.add(i);  // Sem redimensionamento
}
```

---

## Boas Práticas

### 1. Capacidade Inicial Conhecida

```java
// ✅ Especificar capacidade quando conhecida
List<String> lista = new ArrayList<>(1000);

// Evita redimensionamentos
```

### 2. Adicionar Fim

```java
// ✅ Adicionar fim O(1)
lista.add("Elemento");

// ❌ Evitar início O(n)
lista.add(0, "Elemento");
```

### 3. LinkedList Inserção Frequente

```java
// ❌ ArrayList inserção frequente meio
List<String> lista = new ArrayList<>();
lista.add(0, "X");  // O(n)

// ✅ LinkedList inserção início
List<String> lista = new LinkedList<>();
lista.add(0, "X");  // O(1)
```

---

## Resumo

**Implementação**:
- **Array interno**: Object[] elementData
- **Size**: int elementos armazenados
- **Dinâmico**: cresce automaticamente

**Estrutura**:
- elementData array interno
- size elementos lógicos
- capacity tamanho físico array

**Redimensionamento**:
- **Trigger**: size == capacity
- **Nova capacidade**: capacity * 1.5
- **Processo**: criar array, copiar System.arraycopy, substituir
- **Custo**: O(n) cópia, O(1) amortizado

**Vantagens**:
- Tamanho dinâmico automático
- Acesso O(1) por índice
- Cache-friendly contíguo
- Métodos List completo
- Iteração eficiente

**Desvantagens**:
- Inserção/remoção meio O(n) desloca
- Redimensionamento O(n) copia
- Desperdício memória capacity > size
- Operações início O(n) ineficiente

**Array vs ArrayList**:
- Array fixo sem métodos
- ArrayList dinâmico métodos List
- ArrayList preferível maioria

**Regra de Ouro**: ArrayList implementação List array dinâmico interno Object elementData int size. Redimensiona automaticamente size igual capacity nova capacidade 1.5 vezes cria array copia System.arraycopy substitui. Vantagens tamanho automático acesso O1 índice cache-friendly métodos List iteração rápida. Desvantagens inserção remoção meio On desloca redimensionamento On copia desperdício memória capacity maior size início On usar LinkedList. Array estático fixo sem métodos ArrayList dinâmico List preferível. Especificar capacidade inicial conhecida evita redimensionamentos adicionar fim O1 evitar início meio On. SEMPRE ArrayList acesso índice frequente tamanho variável leitura dominante.

