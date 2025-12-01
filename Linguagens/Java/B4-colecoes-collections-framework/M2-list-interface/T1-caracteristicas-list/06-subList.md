# subList() em List: Análise Conceitual Profunda

## 🎯 Introdução

**subList()** retorna **view** (visualização) de porção da lista original, representando sublista dos elementos entre índices especificados. Conceitualmente, é **janela** para segmento contíguo da lista, não cópia.

**Assinatura:**
```java
List<E> subList(int fromIndex, int toIndex);
```

## 📋 Fundamentos

### Conceito de View

**View (não cópia):**
```java
List<String> original = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
List<String> sub = original.subList(1, 4);  // [B, C, D]

// Modificar sub afeta original:
sub.set(0, "X");
System.out.println(original);  // [A, X, C, D, E]

// Modificar original afeta sub:
original.set(2, "Y");
System.out.println(sub);  // [X, Y, D]
```

**Conceito:** subList retorna **view backed** pela lista original - mudanças são bidirecionais.

### Parâmetros: fromIndex e toIndex

```java
List<E> subList(int fromIndex, int toIndex);
```

- **fromIndex:** Índice inicial (inclusivo)
- **toIndex:** Índice final (exclusivo)
- **Range:** `[fromIndex, toIndex)` - inclui fromIndex, exclui toIndex
- **Tamanho:** `toIndex - fromIndex`

**Exemplo:**
```java
List<Integer> lista = Arrays.asList(0, 1, 2, 3, 4, 5);
List<Integer> sub = lista.subList(2, 5);  // [2, 3, 4]
// Inclui índice 2, 3, 4
// Exclui índice 5
```

### IndexOutOfBoundsException

```java
List<String> lista = Arrays.asList("A", "B", "C");

// ❌ Exceções:
lista.subList(-1, 2);      // fromIndex < 0
lista.subList(0, 5);       // toIndex > size
lista.subList(2, 1);       // fromIndex > toIndex
lista.subList(0, 0);       // ✅ OK - sublist vazia
lista.subList(3, 3);       // ✅ OK - sublist vazia
```

## 🧠 Análise Conceitual

### Operações em SubList

**Modificação:**
```java
List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
List<String> sub = lista.subList(1, 3);  // [B, C]

sub.set(0, "X");  // Modifica original em índice 1
// lista = [A, X, C, D]
```

**Adição:**
```java
sub.add("Y");  // Adiciona ao final da sublista
// sub = [X, C, Y]
// lista = [A, X, C, Y, D]
```

**Remoção:**
```java
sub.remove(0);  // Remove primeiro elemento da sublista
// sub = [C, Y]
// lista = [A, C, Y, D]
```

**Limpar SubList:**
```java
List<Integer> lista = new ArrayList<>(Arrays.asList(0, 1, 2, 3, 4, 5));
lista.subList(2, 5).clear();  // Remove elementos [2, 3, 4]
// lista = [0, 1, 5]
```

### ConcurrentModificationException

**Modificar original invalida subList:**
```java
List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
List<String> sub = lista.subList(1, 3);

lista.add("E");  // Modifica original estruturalmente
// sub.get(0);  // ConcurrentModificationException!
```

**Conceito:** Modificação estrutural da lista original (add/remove direto) invalida subList.

## 🔍 Casos de Uso

### Processar Segmento

```java
List<Integer> numeros = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8));

// Processar apenas elementos 3-6
List<Integer> segmento = numeros.subList(2, 6);
segmento.replaceAll(n -> n * 2);
// numeros = [1, 2, 6, 8, 10, 12, 7, 8]
```

### Remover Range

```java
void removerRange(List<E> lista, int from, int to) {
    lista.subList(from, to).clear();
}

List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
removerRange(lista, 1, 4);  // Remove B, C, D
// lista = [A, E]
```

### Dividir Lista

```java
void dividirEmBatches(List<E> lista, int tamanhoBatch) {
    for (int i = 0; i < lista.size(); i += tamanhoBatch) {
        int fim = Math.min(i + tamanhoBatch, lista.size());
        List<E> batch = lista.subList(i, fim);
        processar(batch);
    }
}
```

### Substituir Segmento

```java
List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
List<String> substitutos = Arrays.asList("X", "Y");

lista.subList(1, 3).clear();  // Remove [B, C]
lista.addAll(1, substitutos);  // Insere [X, Y] em posição 1
// lista = [A, X, Y, D, E]
```

## ⚠️ Armadilhas

**1. SubList É View, Não Cópia:**
```java
List<String> original = new ArrayList<>(Arrays.asList("A", "B"));
List<String> sub = original.subList(0, 1);

// Modificar um afeta outro:
sub.set(0, "X");
System.out.println(original);  // [X, B]
```

**2. Modificação Externa Invalida:**
```java
List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C"));
List<String> sub = lista.subList(0, 2);

lista.remove(0);  // Modifica estrutura
// sub.get(0);  // ConcurrentModificationException
```

**3. SubList de SubList:**
```java
List<String> lista = Arrays.asList("A", "B", "C", "D", "E");
List<String> sub1 = lista.subList(1, 4);  // [B, C, D]
List<String> sub2 = sub1.subList(1, 2);   // [C]
// Modificar sub2 afeta sub1 e lista
```

## 🎯 Quando Usar

**Use subList quando:**
- Processar segmento específico da lista
- Remover range de elementos (`subList(from, to).clear()`)
- Modificar porção mantendo view da original
- Dividir lista em batches

**Evite quando:**
- Precisa de cópia independente (use `new ArrayList<>(original.subList(...))`)
- Lista original será modificada estruturalmente
- Performance de acesso aleatório crítica (subList tem overhead)

## 📚 Conclusão

`subList(fromIndex, toIndex)` retorna **view** de range `[fromIndex, toIndex)`. Modificações são bidirecionais entre subList e original. Modificar estrutura da original invalida subList (ConcurrentModificationException). Útil para operações em range (clear, replaceAll, processar batches). Para cópia independente, envolver em `new ArrayList<>()`.
