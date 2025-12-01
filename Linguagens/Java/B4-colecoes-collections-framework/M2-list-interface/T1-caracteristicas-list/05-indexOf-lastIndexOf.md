# indexOf() e lastIndexOf() em List: Análise Conceitual

## 🎯 Introdução

**indexOf()** e **lastIndexOf()** são métodos de busca que retornam **posição (índice)** de elemento na lista. Permitem localizar onde elemento está, não apenas se existe (`contains()`).

## 📋 Definições

### indexOf(Object o)

**Assinatura:**
```java
int indexOf(Object o);
```

**Contrato:**
- Retorna índice da **primeira ocorrência** de `o`
- Retorna `-1` se elemento não encontrado
- Usa `equals()` para comparação
- Busca da esquerda para direita (índice 0 → size-1)

**Exemplo:**
```java
List<String> frutas = Arrays.asList("Maçã", "Banana", "Maçã", "Laranja");

int indice1 = frutas.indexOf("Maçã");     // 0 (primeira)
int indice2 = frutas.indexOf("Banana");   // 1
int indice3 = frutas.indexOf("Uva");      // -1 (não existe)
```

### lastIndexOf(Object o)

**Assinatura:**
```java
int lastIndexOf(Object o);
```

**Contrato:**
- Retorna índice da **última ocorrência** de `o`
- Retorna `-1` se elemento não encontrado
- Usa `equals()` para comparação
- Busca da direita para esquerda (size-1 → 0)

**Exemplo:**
```java
List<String> frutas = Arrays.asList("Maçã", "Banana", "Maçã", "Laranja");

int ultimoIndice = frutas.lastIndexOf("Maçã");  // 2 (última)
int indice = frutas.lastIndexOf("Banana");      // 1 (apenas uma)
int inexistente = frutas.lastIndexOf("Uva");    // -1
```

## 🧠 Análise Conceitual

### Comparação com equals()

```java
List<String> lista = new ArrayList<>();
lista.add(new String("Hello"));
lista.add(new String("World"));

String busca = new String("Hello");  // Objeto diferente
int indice = lista.indexOf(busca);   // 0 - equals() retorna true
```

**Conceito:** indexOf/lastIndexOf usam `equals()`, não `==` (identidade de objeto).

### indexOf vs lastIndexOf com Duplicatas

```java
List<Integer> numeros = Arrays.asList(5, 3, 5, 8, 5, 2);
//                                     0  1  2  3  4  5

int primeiro = numeros.indexOf(5);       // 0
int ultimo = numeros.lastIndexOf(5);     // 4

// Se elemento aparece uma vez, ambos retornam mesmo índice:
int primeiroUnico = numeros.indexOf(8);      // 3
int ultimoUnico = numeros.lastIndexOf(8);    // 3
```

### Busca com null

```java
List<String> lista = Arrays.asList("A", null, "B", null);

int indiceNull = lista.indexOf(null);         // 1 (primeiro null)
int ultimoNull = lista.lastIndexOf(null);     // 3 (último null)
```

**Conceito:** indexOf/lastIndexOf tratam `null` corretamente (comparam com `==` ao invés de `equals()`).

## 🔍 Casos de Uso

### Verificar Existência e Posição

```java
String elemento = "Banana";
int indice = lista.indexOf(elemento);

if (indice != -1) {
    System.out.println(elemento + " está na posição " + indice);
} else {
    System.out.println(elemento + " não encontrado");
}
```

### Contar Ocorrências

```java
int contarOcorrencias(List<?> lista, Object elemento) {
    int count = 0;
    int indice = lista.indexOf(elemento);

    while (indice != -1) {
        count++;
        indice = lista.indexOf(elemento, indice + 1);  // Não existe em List!
    }
    return count;
}

// Solução correta:
int count = Collections.frequency(lista, elemento);
```

**Limitação:** List não tem `indexOf(Object, int fromIndex)` como String.

### Remover Primeira/Última Ocorrência

```java
// Remover primeira ocorrência
int indice = lista.indexOf("Elemento");
if (indice != -1) {
    lista.remove(indice);
}

// Remover última ocorrência
int ultimoIndice = lista.lastIndexOf("Elemento");
if (ultimoIndice != -1) {
    lista.remove(ultimoIndice);
}
```

### Encontrar Todas Ocorrências

```java
List<Integer> encontrarIndices(List<String> lista, String elemento) {
    List<Integer> indices = new ArrayList<>();
    for (int i = 0; i < lista.size(); i++) {
        if (lista.get(i).equals(elemento)) {
            indices.add(i);
        }
    }
    return indices;
}
```

## ⚠️ Considerações de Performance

**Complexidade:**
- **ArrayList:** O(n) - busca linear
- **LinkedList:** O(n) - percorre nós

**Não há otimização para listas ordenadas:** Mesmo que lista esteja ordenada, indexOf faz busca linear (não binária).

**Collections.binarySearch() para listas ordenadas:**
```java
List<Integer> ordenada = Arrays.asList(1, 3, 5, 7, 9);
int indice = Collections.binarySearch(ordenada, 5);  // O(log n)
```

## 🎯 Quando Usar

**Use indexOf/lastIndexOf quando:**
- Precisa saber posição de elemento
- Diferenciar primeira vs última ocorrência
- Verificar existência E obter posição simultaneamente

**Use contains() quando:**
- Apenas verificar existência (boolean)
- Não precisa da posição

**Use Collections.frequency() quando:**
- Contar ocorrências

## 📚 Conclusão

`indexOf()` retorna primeira ocorrência, `lastIndexOf()` retorna última. Ambos retornam `-1` se não encontrado, usam `equals()` para comparação. Complexidade O(n) - busca linear. Úteis para localizar posição de elementos, especialmente com duplicatas. Para listas ordenadas e performance crítica, considerar `Collections.binarySearch()`.
