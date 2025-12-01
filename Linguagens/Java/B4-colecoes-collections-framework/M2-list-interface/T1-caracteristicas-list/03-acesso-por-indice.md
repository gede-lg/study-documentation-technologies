# Acesso por Índice em List: Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Acesso por índice** é característica que permite recuperar, modificar ou inserir elementos em **posições específicas** usando números inteiros (índices) baseados em zero. Conceitualmente, trata List como **array lógico** onde cada elemento tem endereço numérico.

**Índice:** Número inteiro `i` onde `0 ≤ i < size()` que identifica posição única de elemento na sequência.

## 📋 Fundamentos

### Índice Baseado em Zero

```
Lista: ["Ana", "Bruno", "Carlos", "Diana"]
Índice:   0       1        2        3

Primeiro elemento: índice 0
Último elemento: índice size()-1 = 3
```

### Métodos de Acesso por Índice

```java
public interface List<E> extends Collection<E> {
    E get(int index);              // Acessa elemento em índice
    E set(int index, E element);   // Substitui elemento em índice
    void add(int index, E element);// Insere em índice
    E remove(int index);           // Remove de índice
}
```

## 🧠 Análise Conceitual

### get(int index) - Leitura

```java
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");

String primeiro = nomes.get(0);  // "Ana"
String segundo = nomes.get(1);   // "Bruno"
String ultimo = nomes.get(nomes.size() - 1);  // "Carlos"

// nomes.get(3);  // IndexOutOfBoundsException
```

**Complexidade:**
- **ArrayList:** O(1) - acesso direto a array interno
- **LinkedList:** O(n) - percorre nós até índice

### set(int index, E element) - Atualização

```java
List<String> frutas = new ArrayList<>(Arrays.asList("Maçã", "Banana", "Laranja"));

String antiga = frutas.set(1, "Morango");  // Retorna "Banana"
// frutas = ["Maçã", "Morango", "Laranja"]
```

**Conceito:** Substitui elemento SEM mudar tamanho da lista.

### add(int index, E element) - Inserção

```java
List<String> lista = new ArrayList<>(Arrays.asList("A", "C"));
lista.add(1, "B");  // Insere "B" em índice 1
// Resultado: ["A", "B", "C"]
// "C" shift de índice 1 → 2
```

**Complexidade:**
- **ArrayList:** O(n) - shift de elementos
- **LinkedList:** O(n) - localizar posição, O(1) inserir

### remove(int index) - Remoção

```java
List<Integer> numeros = new ArrayList<>(Arrays.asList(10, 20, 30, 40));
Integer removido = numeros.remove(2);  // Retorna 30
// numeros = [10, 20, 40]
// 40 shift de índice 3 → 2
```

**Atenção:** `remove(int)` remove por ÍNDICE; `remove(Object)` remove por VALOR.

```java
List<Integer> lista = new ArrayList<>(Arrays.asList(1, 2, 3));
lista.remove(1);  // Remove elemento em índice 1 → [1, 3]
lista.remove(Integer.valueOf(1));  // Remove elemento com valor 1 → [2, 3]
```

## 🔍 Uso Avançado

### Iterar com Índice

```java
for (int i = 0; i < lista.size(); i++) {
    System.out.println(i + ": " + lista.get(i));
}
// 0: Ana
// 1: Bruno
// 2: Carlos
```

### Acesso Reverso

```java
for (int i = lista.size() - 1; i >= 0; i--) {
    System.out.println(lista.get(i));
}
// Imprime de trás para frente
```

### Trocar Elementos

```java
void trocar(List<E> lista, int i, int j) {
    E temp = lista.get(i);
    lista.set(i, lista.get(j));
    lista.set(j, temp);
}
```

## ⚠️ Limitações

**IndexOutOfBoundsException:**
```java
List<String> lista = Arrays.asList("A", "B");
lista.get(5);  // EXCEÇÃO - índice >= size()
lista.get(-1); // EXCEÇÃO - índice negativo
```

**Performance Variável:**
- ArrayList: acesso O(1), inserção/remoção O(n)
- LinkedList: acesso O(n), inserção/remoção nas pontas O(1)

## 🎯 Quando Usar

**Use acesso por índice quando:**
- Precisa acessar elemento específico por posição
- Iterar com controle fino (skip, reverse)
- Modificar elementos em posições conhecidas

**Evite quando:**
- Apenas percorrer todos elementos (use enhanced for)
- Performance de acesso aleatório crítica com LinkedList

## 📚 Conclusão

Acesso por índice diferencia List de outras Collections, permitindo operações posicionais diretas. `get()`, `set()`, `add(index)`, `remove(index)` operam em posições numéricas. Complexidade varia por implementação (ArrayList O(1) acesso vs LinkedList O(n)). Índices baseados em zero, exceção se fora de limites `[0, size()-1]`.
