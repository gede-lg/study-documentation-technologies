# Métodos Adicionais de List: get(), set(), add(index): Análise Conceitual

## 🎯 Introdução

List adiciona métodos **posicionais** além dos herdados de Collection. Esses métodos operam em **índices específicos**, habilitando controle fino sobre posição de elementos.

## 📋 Métodos Principais

### get(int index) - Acesso

**Assinatura:**
```java
E get(int index);
```

**Contrato:**
- Retorna elemento na posição `index`
- Lança `IndexOutOfBoundsException` se `index < 0` ou `index >= size()`
- Não modifica lista

**Exemplo:**
```java
List<String> lista = Arrays.asList("A", "B", "C");
String elemento = lista.get(1);  // "B"
```

**Complexidade:**
- **ArrayList:** O(1) - acesso direto
- **LinkedList:** O(n) - percorre nós

### set(int index, E element) - Substituição

**Assinatura:**
```java
E set(int index, E element);
```

**Contrato:**
- Substitui elemento em `index` por `element`
- Retorna elemento **anterior** (que foi substituído)
- Tamanho da lista não muda
- Lança `IndexOutOfBoundsException` se índice inválido
- Lança `UnsupportedOperationException` se lista imutável

**Exemplo:**
```java
List<Integer> numeros = new ArrayList<>(Arrays.asList(1, 2, 3));
Integer antigo = numeros.set(1, 20);  // Retorna 2
// numeros = [1, 20, 3]
```

**Use Case:** Atualizar valor em posição conhecida sem alterar estrutura.

### add(int index, E element) - Inserção Posicional

**Assinatura:**
```java
void add(int index, E element);
```

**Contrato:**
- Insere `element` na posição `index`
- Shift elementos de `index` até `size-1` uma posição à direita
- Tamanho aumenta em 1
- Índice válido: `0 ≤ index ≤ size()` (pode adicionar ao final)
- Lança `IndexOutOfBoundsException` se `index < 0` ou `index > size()`

**Exemplo:**
```java
List<String> lista = new ArrayList<>(Arrays.asList("A", "C"));
lista.add(1, "B");  // Insere "B" entre "A" e "C"
// Resultado: ["A", "B", "C"]
```

**Análise:**
```
Antes:  ["A", "C"]
         0    1

add(1, "B"):
- Shift "C" de índice 1 → 2
- Insere "B" em índice 1

Depois: ["A", "B", "C"]
          0    1    2
```

**Complexidade:**
- **ArrayList:** O(n) - shift de elementos no array
- **LinkedList:** O(n) - localizar posição, O(1) inserir nó

## 🧠 Análise Conceitual

### Diferença: add(E) vs add(int, E)

```java
List<String> lista = new ArrayList<>();

// add(E) - adiciona ao FINAL
lista.add("A");  // [A]
lista.add("B");  // [A, B]

// add(int, E) - adiciona em POSIÇÃO
lista.add(1, "X");  // [A, X, B] - insere entre A e B
```

**Conceito:** `add(E)` é especialização de `add(size(), E)` - ambas adicionam ao final.

### get() vs Iterator

**get() - Acesso Aleatório:**
```java
String elemento = lista.get(5);  // Acesso direto
```

**Iterator - Sequencial:**
```java
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String elemento = it.next();  // Sequencial
}
```

**Quando usar cada:**
- **get():** Acesso a posição específica conhecida
- **Iterator:** Percorrer todos elementos sequencialmente

### set() vs remove() + add()

**set() - Eficiente:**
```java
lista.set(2, "Novo");  // O(1) em ArrayList - apenas atribui
```

**remove() + add() - Ineficiente:**
```java
lista.remove(2);      // O(n) - shift
lista.add(2, "Novo"); // O(n) - shift novamente
```

**Conceito:** `set()` é atualização in-place; `remove()+add()` modifica estrutura.

## 🔍 Padrões de Uso

### Substituir Todos de Valor

```java
void substituir(List<String> lista, String antigo, String novo) {
    for (int i = 0; i < lista.size(); i++) {
        if (lista.get(i).equals(antigo)) {
            lista.set(i, novo);
        }
    }
}
```

### Inserir Ordenadamente

```java
void inserirOrdenado(List<Integer> lista, Integer elemento) {
    int i = 0;
    while (i < lista.size() && lista.get(i) < elemento) {
        i++;
    }
    lista.add(i, elemento);
}
```

### Preencher Lista

```java
List<String> lista = new ArrayList<>(Collections.nCopies(10, "X"));
// Cria lista com 10 "X"

for (int i = 0; i < lista.size(); i++) {
    lista.set(i, "Elemento " + i);
}
```

## ⚠️ Considerações

**UnsupportedOperationException:**
```java
List<String> imutavel = Arrays.asList("A", "B", "C");
imutavel.set(0, "X");  // OK - set suportado
imutavel.add("D");     // UnsupportedOperationException - size fixo
```

**IndexOutOfBoundsException:**
```java
List<String> lista = Arrays.asList("A");
lista.get(1);     // EXCEÇÃO - índice 1 não existe
lista.set(-1, "X");  // EXCEÇÃO - índice negativo
lista.add(5, "X");   // EXCEÇÃO - index > size()
```

## 📚 Conclusão

`get()`, `set()` e `add(int, E)` são métodos posicionais exclusivos de List. `get()` acessa sem modificar, `set()` substitui mantendo tamanho, `add(int, E)` insere causando shift. Complexidade varia por implementação (ArrayList favorece acesso, LinkedList favorece inserção nas pontas). Essenciais para operações que requerem controle fino sobre posições.
