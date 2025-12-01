# Alternativa Moderna: Deque: Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Deque** (Double-Ended Queue, pronuncia-se "deck") é **interface moderna** que generaliza pilha e fila, permitindo inserção e remoção em **ambas extremidades**. Conceitualmente, é substituta superior de Stack, oferecendo operações LIFO sem herança problemática.

**Definição Formal:**
```java
public interface Deque<E> extends Queue<E> {
    // Operações em ambas pontas
    void addFirst(E e);
    void addLast(E e);
    E removeFirst();
    E removeLast();
    E getFirst();
    E getLast();

    // Métodos de pilha (LIFO):
    void push(E e);    // = addFirst()
    E pop();           // = removeFirst()
    E peek();          // = getFirst()
}
```

**Status:** Interface **moderna** (Java 6, 2006) - recomendada para código novo.

### Contexto Histórico e Motivação

**Java 1.0 (1996):** Stack - implementação concreta com herança de Vector.

**Java 1.2 (1998):** Collections Framework introduzido, mas sem interface específica para pilha.

**Java 6 (2006):** Deque introduzida reconhecendo que:
1. Stack tem problemas de design (herança de Vector)
2. Pilha e fila dupla compartilham padrão (acesso nas pontas)
3. Interface é preferível a classe concreta
4. Flexibilidade (double-ended) é mais poderosa que restrição (stack)

**Motivação:** Fornecer abstração moderna, flexível e semanticamente correta para pilhas e filas duplas, sem bagagem legada de Stack.

### Problema Fundamental

**Problema com Stack:**
- Herda Vector, expondo métodos que violam LIFO
- Sincronização obrigatória (overhead)
- Classe concreta (não interface) - menos flexível

**Solução Deque:**
- Interface sem implementação específica
- Múltiplas implementações (ArrayDeque, LinkedList)
- Suporta pilha (LIFO) E fila dupla
- Sem herança problemática

### Por Que Deque É Superior

**Razões Técnicas:**

1. **Interface, Não Classe:** Flexibilidade de implementação
2. **Sem Herança Problemática:** Apenas métodos de deque, não expõe Vector
3. **Sem Sincronização Forçada:** Implementações não sincronizadas por padrão (mais rápidas)
4. **Generalização:** Suporta pilha, fila e fila dupla
5. **Design Moderno:** Segue princípios do Collections Framework

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Double-Ended:** Operações em ambas pontas (first e last)
2. **Interface:** Abstração sem implementação específica
3. **Substitui Stack:** Métodos push/pop/peek idênticos
4. **Implementações:** ArrayDeque (array circular), LinkedList (lista encadeada)
5. **Sem Sincronização:** Performance superior em single-thread

### Pilares Fundamentais

- **Deque Interface:** Contrato de operações em pontas
- **ArrayDeque:** Implementação eficiente com array circular
- **LinkedList:** Implementação com lista duplamente encadeada
- **LIFO e FIFO:** Suporta ambos padrões de acesso
- **Null-Hostile:** Deque não permite elementos null (diferente de LinkedList)

### Visão Geral das Nuances

- **Métodos Dual:** addFirst/offerFirst, removeFirst/pollFirst, etc.
- **Exceções vs null:** Métodos que lançam exceção vs retornam null
- **Capacity:** ArrayDeque cresce dinamicamente, sem limite fixo
- **Thread-Safety:** Não sincronizada - usar ConcurrentLinkedDeque se necessário
- **Performance:** ArrayDeque geralmente superior para pilhas

---

## 🧠 Fundamentos Teóricos

### Hierarquia de Deque

**Interfaces:**

```
Collection<E>
  └── Queue<E>
       └── Deque<E>
```

**Implementações Principais:**

```
Deque<E>
  ├── ArrayDeque<E>      (array circular)
  └── LinkedList<E>       (lista duplamente encadeada)
```

### Métodos de Pilha em Deque

**API Compatível com Stack:**

```java
Deque<String> pilha = new ArrayDeque<>();

// Métodos de pilha (idênticos a Stack):
pilha.push("A");      // Adiciona ao topo
String topo = pilha.pop();      // Remove do topo
String consulta = pilha.peek(); // Consulta topo

// Internamente:
// push(e)  = addFirst(e)
// pop()    = removeFirst()
// peek()   = peekFirst()
```

**Conceito:** Deque oferece mesma API de pilha que Stack, sem herança problemática.

### Comparação: Stack vs Deque

**Stack (Legada):**

```java
Stack<String> stack = new Stack<>();
stack.push("A");           // synchronized
stack.push("B");           // synchronized
String item = stack.pop(); // synchronized

// Herda Vector:
stack.add(0, "X");  // ❌ Viola LIFO - mas permitido
stack.get(0);       // ❌ Acessa fundo - mas permitido
```

**Deque (Moderna):**

```java
Deque<String> deque = new ArrayDeque<>();
deque.push("A");           // Não synchronized - mais rápido
deque.push("B");           // Não synchronized
String item = deque.pop(); // Não synchronized

// NÃO herda Vector:
// deque.add(0, "X");  // ❌ Método não existe
// deque.get(0);       // ❌ Método não existe
// Invariante LIFO protegido!
```

**Vantagens de Deque:**
- Sem overhead de sincronização (~30% mais rápida)
- Sem métodos que violam LIFO
- Interface (flexível) ao invés de classe (rígida)

### ArrayDeque - Implementação Preferida

**Estrutura Interna:**

```java
public class ArrayDeque<E> implements Deque<E> {
    transient Object[] elements;  // Array circular
    transient int head;           // Índice do primeiro
    transient int tail;           // Índice após último

    public void addFirst(E e) {
        elements[head = (head - 1) & (elements.length - 1)] = e;
        // Array circular - head decrementa com wrap-around
    }

    public E removeFirst() {
        E result = elements[head];
        elements[head] = null;
        head = (head + 1) & (elements.length - 1);
        return result;
    }
}
```

**Conceito:** Array circular permite O(1) em ambas pontas sem realocação frequente.

**Características:**
- **Capacidade Dinâmica:** Cresce quando necessário (dobra tamanho)
- **Array Circular:** Evita shift de elementos
- **Sem Sincronização:** Rápido em single-thread
- **Null-Hostile:** Não aceita null

### LinkedList - Implementação Alternativa

**Estrutura:**

```java
public class LinkedList<E> implements Deque<E>, List<E> {
    transient Node<E> first;  // Primeiro nó
    transient Node<E> last;   // Último nó

    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;
    }

    public void addFirst(E e) {
        Node<E> f = first;
        Node<E> newNode = new Node<>(null, e, f);
        first = newNode;
        if (f == null)
            last = newNode;
        else
            f.prev = newNode;
        size++;
    }
}
```

**Características:**
- **Lista Duplamente Encadeada:** O(1) em ambas pontas
- **Sem Capacidade Fixa:** Cresce elemento a elemento
- **Permite null:** Diferente de ArrayDeque
- **Implementa List:** Mais flexível, mas overhead de memória

---

## 🔍 Análise Conceitual Profunda

### Deque Suporta LIFO e FIFO

**Como Pilha (LIFO):**

```java
Deque<Integer> pilha = new ArrayDeque<>();
pilha.push(1);  // addFirst(1)
pilha.push(2);  // addFirst(2)
pilha.push(3);  // addFirst(3)

// Deque interna: [3, 2, 1]
//                  ↑ first (topo da pilha)

pilha.pop();  // removeFirst() → 3
pilha.pop();  // removeFirst() → 2
pilha.pop();  // removeFirst() → 1
// Ordem LIFO: 3, 2, 1
```

**Como Fila (FIFO):**

```java
Deque<Integer> fila = new ArrayDeque<>();
fila.offer(1);    // addLast(1)
fila.offer(2);    // addLast(2)
fila.offer(3);    // addLast(3)

// Deque interna: [1, 2, 3]
//                  ↑ first

fila.poll();  // removeFirst() → 1
fila.poll();  // removeFirst() → 2
fila.poll();  // removeFirst() → 3
// Ordem FIFO: 1, 2, 3
```

**Conceito:** Deque unifica pilha e fila - mesma estrutura, padrões de acesso diferentes.

### Métodos Dual: Exceção vs null

**Métodos que Lançam Exceção:**

```java
Deque<String> deque = new ArrayDeque<>();

deque.addFirst("A");    // Lança exceção se capacidade esgotada (raro)
deque.removeFirst();    // Lança NoSuchElementException se vazia
deque.getFirst();       // Lança NoSuchElementException se vazia
```

**Métodos que Retornam null:**

```java
Deque<String> deque = new ArrayDeque<>();

deque.offerFirst("A");  // Retorna false se falha (raro em ArrayDeque)
String item = deque.pollFirst();   // Retorna null se vazia
String peek = deque.peekFirst();   // Retorna null se vazia
```

**Escolha:**
- **Exceção:** Quando vazio é erro de lógica
- **null:** Quando vazio é caso normal a tratar

**Pilha Geralmente Usa Exceção:**

```java
// Stack original:
pilha.pop();   // EmptyStackException se vazia

// Deque equivalente:
pilha.pop();   // NoSuchElementException se vazia
// Ou:
pilha.pollFirst();  // null se vazia
```

### Performance: ArrayDeque vs Stack

**Benchmark Conceitual (1 milhão operações):**

```
Operação         Stack      ArrayDeque   Diferença
push/pop         130ms      95ms         ~37% mais rápido
peek             40ms       30ms         ~33% mais rápido
isEmpty          5ms        5ms          Igual

Stack: Overhead de synchronized
ArrayDeque: Sem overhead
```

**Conceito:** ArrayDeque é significativamente mais rápida em single-thread.

### ArrayDeque vs LinkedList para Pilha

**ArrayDeque (Recomendada):**

```java
Deque<Integer> pilha = new ArrayDeque<>();

// Vantagens:
// - Mais rápida (~2x em operações de pilha)
// - Menos memória (sem overhead de nós)
// - Cache-friendly (dados contíguos)

// Desvantagens:
// - Não aceita null
// - Realocação ocasional (rara)
```

**LinkedList:**

```java
Deque<Integer> pilha = new LinkedList<>();

// Vantagens:
// - Aceita null
// - Sem realocação (cresce elemento a elemento)
// - Implementa List (mais métodos)

// Desvantagens:
// - Mais lenta (~2x)
// - Mais memória (3 referências por nó: item, next, prev)
// - Cache-unfriendly (nós espalhados na heap)
```

**Recomendação:** ArrayDeque para pilhas, exceto se precisar de null.

---

## 🎯 Aplicabilidade e Contextos

### Migração: Stack → Deque

**Passo 1: Trocar Declaração**

```java
// Antes:
Stack<String> pilha = new Stack<>();

// Depois:
Deque<String> pilha = new ArrayDeque<>();
```

**Passo 2: API de Pilha Permanece Idêntica**

```java
// Código continua funcionando:
pilha.push("A");
pilha.push("B");
String topo = pilha.pop();
String consulta = pilha.peek();
boolean vazia = pilha.isEmpty();  // empty() → isEmpty()
```

**Passo 3: Ajustar empty() → isEmpty()**

```java
// Antes (Stack):
if (pilha.empty()) { /* ... */ }

// Depois (Deque):
if (pilha.isEmpty()) { /* ... */ }
```

**Passo 4: Remover search() se Usado**

```java
// Antes (Stack):
int pos = pilha.search("item");  // 1-indexed

// Depois (Deque) - não tem search():
// Opção 1: Usar contains()
if (pilha.contains("item")) { /* ... */ }

// Opção 2: Iterar manualmente
int pos = 1;
for (String item : pilha) {
    if (item.equals("item")) break;
    pos++;
}
```

### Casos de Uso Típicos

**Pilha de Execução (Call Stack Simulado):**

```java
Deque<StackFrame> callStack = new ArrayDeque<>();

void chamarFuncao(String nome) {
    callStack.push(new StackFrame(nome));
    executar();
    callStack.pop();
}
```

**Desfazer/Refazer:**

```java
class Editor {
    private Deque<Acao> desfazer = new ArrayDeque<>();
    private Deque<Acao> refazer = new ArrayDeque<>();

    void executar(Acao acao) {
        acao.executar();
        desfazer.push(acao);
        refazer.clear();  // Limpa histórico de refazer
    }

    void desfazer() {
        if (!desfazer.isEmpty()) {
            Acao acao = desfazer.pop();
            acao.reverter();
            refazer.push(acao);
        }
    }

    void refazer() {
        if (!refazer.isEmpty()) {
            Acao acao = refazer.pop();
            acao.executar();
            desfazer.push(acao);
        }
    }
}
```

**DFS (Busca em Profundidade):**

```java
void dfs(Grafo g, Node inicio) {
    Deque<Node> pilha = new ArrayDeque<>();
    Set<Node> visitados = new HashSet<>();

    pilha.push(inicio);

    while (!pilha.isEmpty()) {
        Node atual = pilha.pop();

        if (!visitados.contains(atual)) {
            visitados.add(atual);
            processar(atual);

            for (Node vizinho : atual.vizinhos) {
                pilha.push(vizinho);
            }
        }
    }
}
```

### Thread-Safety com Deque

**Deque Não É Thread-Safe:**

```java
// ❌ Unsafe em multi-thread
Deque<String> deque = new ArrayDeque<>();
// Múltiplas threads acessando
```

**Opção 1: Sincronização Externa**

```java
Deque<String> deque = new ArrayDeque<>();

synchronized(deque) {
    if (!deque.isEmpty()) {
        deque.pop();
    }
}
```

**Opção 2: ConcurrentLinkedDeque**

```java
Deque<String> deque = new ConcurrentLinkedDeque<>();
// Thread-safe sem locks explícitos
```

---

## ⚠️ Limitações e Considerações

**1. ArrayDeque Não Aceita null:**

```java
Deque<String> deque = new ArrayDeque<>();
deque.push(null);  // NullPointerException
```

**2. Deque Não Tem search():**

```java
// Stack tem:
int pos = stack.search("item");

// Deque não tem - usar contains() ou iterar
```

**3. Não É Thread-Safe por Padrão:**

```java
// Requer sincronização em multi-thread
// Ou usar ConcurrentLinkedDeque
```

**4. Não Implementa List:**

```java
// Deque não tem get(index), set(index)
// Se precisar, usar LinkedList (implementa Deque E List)
```

---

## 🔗 Interconexões Conceituais

**Relação com Stack:** Substituta moderna - mesma API para pilha, sem problemas.

**Relação com Queue:** Estende Queue, suporta FIFO além de LIFO.

**Relação com ArrayDeque:** Implementação preferida para pilhas.

**Relação com LinkedList:** Implementação alternativa, mais flexível mas mais lenta.

---

## 🚀 Evolução e Próximos Conceitos

**Timeline de Pilhas em Java:**

1. **Stack (1996):** Primeira implementação - problemas de herança
2. **LinkedList (1998):** Pode ser usada como pilha via Deque (desde 2006)
3. **Deque (2006):** Interface moderna para pilhas
4. **ArrayDeque (2006):** Implementação eficiente de Deque
5. **ConcurrentLinkedDeque (2011):** Thread-safe sem locks

**Best Practices Atuais:**

```java
// ✅ SEMPRE use Deque para pilhas novas:
Deque<String> pilha = new ArrayDeque<>();

// ✅ ArrayDeque para maioria dos casos
// ✅ LinkedList se precisar de null ou List
// ✅ ConcurrentLinkedDeque para multi-thread
```

---

## 📚 Conclusão

**Deque** é interface moderna (Java 6) que substitui Stack, oferecendo operações LIFO sem herança problemática de Vector. Suporta operações em ambas pontas (double-ended), unificando pilha e fila. Implementações principais: **ArrayDeque** (preferida - array circular, ~30% mais rápida que Stack) e **LinkedList** (lista encadeada, permite null). API de pilha é idêntica a Stack (push/pop/peek), facilitando migração. Não sincronizada por padrão (melhor performance), usar ConcurrentLinkedDeque se necessário. **Sempre preferir Deque com ArrayDeque ao invés de Stack** em código moderno - design superior, performance melhor, sem bagagem legada.
