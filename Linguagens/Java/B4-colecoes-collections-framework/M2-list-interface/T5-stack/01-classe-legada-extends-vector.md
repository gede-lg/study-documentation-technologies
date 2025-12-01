# Stack: Classe Legada que Estende Vector: Análise Conceitual

## 🎯 Introdução e Definição

### Definição Conceitual

**Stack** é classe legada do Java 1.0 que implementa estrutura de dados **pilha** (LIFO - Last In, First Out). Conceitualmente, é **especialização de Vector** adicionando operações específicas de pilha (push, pop, peek) sobre array dinâmico sincronizado.

**Definição Formal:**
```java
public class Stack<E> extends Vector<E> {
    // Adiciona métodos push(), pop(), peek(), empty(), search()
    // Herda todos métodos de Vector (incluindo sincronização)
}
```

**Status:** Classe **legada** - mantida por compatibilidade retroativa mas **desencorajada** em código moderno.

### Contexto Histórico e Motivação

**Java 1.0 (1996):** Stack foi uma das primeiras estruturas especializadas do Java, criada para fornecer abstração de pilha thread-safe. Design refletia filosofias da época:
- Herança como principal mecanismo de especialização
- Thread-safety universal (todos métodos synchronized via Vector)
- API simples e direta

**Problema de Design:** Stack **estende Vector** ao invés de **compor Vector**. Isso viola princípio de design "favor composition over inheritance" e expõe métodos de Vector que quebram invariante LIFO.

**Java 1.2+ (1998):** Collections Framework introduziu interface **Deque** (Double-Ended Queue) que suporta operações de pilha de forma mais adequada, sem herança problemática.

### Problema Fundamental

**Problema Original (1996):** Como fornecer estrutura de pilha thread-safe com operações LIFO?

**Solução Stack (1996):** Estender Vector e adicionar métodos push(), pop(), peek().

**Problema Descoberto:** Herança de Vector permite operações que violam LIFO:

```java
Stack<String> pilha = new Stack<>();
pilha.push("A");  // Topo
pilha.push("B");  // Topo
pilha.push("C");  // Topo

// ❌ Métodos herdados de Vector quebram LIFO:
pilha.add(0, "X");      // Insere no FUNDO da pilha
pilha.remove(1);        // Remove do MEIO da pilha
pilha.get(0);           // Acessa FUNDO da pilha
// Invariante LIFO violado!
```

**Solução Moderna:** Interface Deque + implementação com ArrayDeque ou LinkedList - sem herança problemática.

### Por Que É Legada

**Razões para Evitar Stack:**

1. **Herança Inadequada:** Estende Vector, herdando comportamentos que quebram semântica de pilha
2. **Overhead de Sincronização:** Herda synchronized de Vector, mesmo quando desnecessário
3. **API Inconsistente:** Métodos push/pop convivem com métodos de Vector
4. **Alternativa Superior:** Deque com ArrayDeque é mais eficiente e semanticamente correta
5. **Design Antigo:** Viola princípios modernos de orientação a objetos

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Herança de Vector:** Stack é subclasse, herda tudo (array dinâmico, sincronização, métodos)
2. **Invariante LIFO:** Conceitualmente pilha, mas herança permite violação
3. **Thread-Safety Herdada:** Todos métodos synchronized via Vector
4. **Legacy Class:** Mantida por compatibilidade, não recomendada para código novo
5. **Alternativa Moderna:** Deque interface com ArrayDeque/LinkedList

### Pilares Fundamentais

- **LIFO:** Last In, First Out - último elemento adicionado é primeiro removido
- **extends Vector:** Herança traz array dinâmico, sincronização e problemas
- **synchronized:** Todos métodos sincronizados (herdado)
- **Composition over Inheritance:** Stack viola este princípio
- **Interface Deque:** Substituta moderna sem herança problemática

### Visão Geral das Nuances

- **Métodos Duplos:** push() vs add(), pop() vs remove() - confusão de API
- **Exposição Excessiva:** Métodos de Vector que não deveriam estar em pilha
- **EmptyStackException:** Exceção específica lançada por pop()/peek() em pilha vazia
- **search():** Método peculiar que retorna distância do topo (1-indexed)
- **Deque Superiority:** Interface Deque é mais flexível e semanticamente correta

---

## 🧠 Fundamentos Teóricos

### Definição de Stack

**Hierarquia de Classes:**

```java
Object
  └── AbstractCollection<E>
       └── AbstractList<E>
            └── Vector<E>
                 └── Stack<E>
```

**Implicação:** Stack herda TUDO de Vector:
- Array dinâmico interno (`elementData`)
- Sincronização (`synchronized`)
- Métodos: `add()`, `remove()`, `get()`, `set()`, `indexOf()`, etc.

### Estrutura Interna

**Stack não adiciona campos, apenas métodos:**

```java
public class Stack<E> extends Vector<E> {
    // Nenhum campo adicional
    // Usa elementData de Vector

    public E push(E item) {
        addElement(item);  // Método de Vector
        return item;
    }

    public synchronized E pop() {
        E obj = peek();
        removeElementAt(size() - 1);  // Método de Vector
        return obj;
    }

    public synchronized E peek() {
        int len = size();
        if (len == 0)
            throw new EmptyStackException();
        return elementAt(len - 1);  // Método de Vector
    }

    public boolean empty() {
        return size() == 0;
    }

    public synchronized int search(Object o) {
        int i = lastIndexOf(o);  // Método de Vector
        if (i >= 0)
            return size() - i;
        return -1;
    }
}
```

**Conceito:** Stack é **wrapper fino** sobre Vector - delega tudo para métodos herdados.

### Princípio LIFO

**Definição:** Last In, First Out - estrutura onde último elemento adicionado é primeiro removido.

**Analogia:** Pilha de pratos - você adiciona pratos no topo e remove do topo (não do meio ou fundo).

**Representação:**

```
push("A"):  [A]         Topo: A
push("B"):  [A, B]      Topo: B
push("C"):  [A, B, C]   Topo: C
pop():      [A, B]      Retorna: C
pop():      [A]         Retorna: B
```

**Invariante LIFO:** Operações permitidas apenas no topo - adicionar (push) e remover (pop).

### Problema da Herança

**Violação do Princípio de Substituição de Liskov:**

```java
// Stack é-um Vector (herança)
Stack<String> pilha = new Stack<>();
Vector<String> vector = pilha;  // Upcast legal

// Mas Vector permite operações que Stack não deveria:
vector.add(0, "X");      // Insere no fundo
vector.remove(1);        // Remove do meio
vector.set(0, "Y");      // Modifica fundo

// Pilha não é mais LIFO!
```

**Conceito:** Herança expõe interface completa de Vector, permitindo violação de invariante LIFO.

**Design Correto (Composição):**

```java
// Hipotético - Stack deveria COMPOR Vector, não ESTENDER
public class BetterStack<E> {
    private List<E> data = new ArrayList<>();  // Composição

    public void push(E item) {
        data.add(item);
    }

    public E pop() {
        return data.remove(data.size() - 1);
    }

    // Métodos de List NÃO expostos - invariante LIFO protegido
}
```

---

## 🔍 Análise Conceitual Profunda

### Overhead de Sincronização Herdado

**Todos Métodos São Synchronized:**

```java
Stack<Integer> pilha = new Stack<>();

pilha.push(1);   // synchronized (herda de Vector.addElement)
pilha.pop();     // synchronized (declarado explicitamente)
pilha.peek();    // synchronized (declarado explicitamente)
pilha.empty();   // NÃO synchronized, mas chama size() que é synchronized
```

**Custo em Single-Thread:**

```java
// Benchmark conceitual (1 milhão operações)
Stack<Integer> stack = new Stack<>();
for (int i = 0; i < 1_000_000; i++) {
    stack.push(i);
}
// Overhead de synchronized mesmo sem concorrência

ArrayDeque<Integer> deque = new ArrayDeque<>();
for (int i = 0; i < 1_000_000; i++) {
    deque.push(i);  // Sem synchronized
}
// ~30% mais rápido
```

**Conceito:** Herda overhead de Vector sem opção de desabilitar.

### API Confusa: Métodos Duplos

**Stack Expõe Múltiplas Formas de Fazer Mesma Coisa:**

```java
Stack<String> pilha = new Stack<>();

// Adicionar ao topo - 3 formas equivalentes:
pilha.push("A");          // Método de Stack
pilha.add("A");           // Herdado de Vector/List
pilha.addElement("A");    // Herdado de Vector (legado)

// Remover do topo - múltiplas formas:
pilha.pop();              // Método de Stack
pilha.remove(pilha.size() - 1);  // Herdado de List
pilha.removeElementAt(pilha.size() - 1);  // Herdado de Vector
```

**Problema:** Confusão sobre qual método usar - API não tem clareza semântica.

### Exposição de Métodos Problemáticos

**Métodos Herdados Que Quebram LIFO:**

```java
Stack<String> pilha = new Stack<>();
pilha.push("Fundo");
pilha.push("Meio");
pilha.push("Topo");

// ❌ Operações que violam invariante LIFO:
pilha.add(0, "Novo Fundo");      // Insere abaixo do fundo original
pilha.remove(1);                 // Remove elemento do meio
pilha.set(0, "Modificado");      // Altera fundo diretamente
pilha.get(0);                    // Acessa fundo (não topo)
pilha.clear();                   // OK, mas não é operação típica de pilha

// Pilha não é mais LIFO - estrutura corrompida
```

**Conceito:** Herança torna impossível proteger invariante LIFO - encapsulamento quebrado.

### EmptyStackException

**Exceção Específica:**

```java
import java.util.EmptyStackException;

Stack<String> pilha = new Stack<>();

try {
    pilha.pop();   // Pilha vazia
} catch (EmptyStackException e) {
    // Exceção específica de Stack
}

try {
    pilha.peek();  // Pilha vazia
} catch (EmptyStackException e) {
    // Mesmo tipo de exceção
}
```

**Comparação com NoSuchElementException:**

```java
// Deque moderna lança NoSuchElementException:
Deque<String> deque = new ArrayDeque<>();
try {
    deque.pop();  // Deque vazio
} catch (NoSuchElementException e) {
    // Exceção genérica de coleções
}
```

**Conceito:** EmptyStackException é específica de Stack - outro indicador de design legado.

### search() - Método Peculiar

**Comportamento:**

```java
Stack<String> pilha = new Stack<>();
pilha.push("A");  // Fundo
pilha.push("B");
pilha.push("C");  // Topo

int pos1 = pilha.search("C");  // 1 (topo = 1)
int pos2 = pilha.search("B");  // 2
int pos3 = pilha.search("A");  // 3 (fundo)
int pos4 = pilha.search("X");  // -1 (não encontrado)
```

**Peculiaridades:**
- Índice baseado em 1 (não 0) - inconsistente com resto do Java
- Conta distância do topo (não índice no array)
- Retorna -1 se não encontrado

**Conceito:** search() tem semântica diferente de indexOf() - mais confusão na API.

---

## 🎯 Aplicabilidade e Contextos

### Quando Stack Era Usada (Historicamente)

**Java 1.0/1.1 (antes de 1998):**

```java
// Única opção para pilha thread-safe
Stack<Integer> pilha = new Stack<>();
pilha.push(1);
pilha.push(2);
int topo = pilha.pop();
```

**Casos de Uso Clássicos:**
- Avaliação de expressões matemáticas (notação polonesa)
- Algoritmos de recursão (call stack simulada)
- Navegação (histórico de navegador)
- Desfazer/Refazer (undo/redo)

### Quando NÃO Usar (Atualmente)

**❌ Evite Stack em código novo:**

```java
// ❌ NÃO faça isso
Stack<String> pilha = new Stack<>();
```

**Razões:**
1. Herança problemática expõe métodos que violam LIFO
2. Overhead de sincronização desnecessário
3. API confusa com métodos duplicados
4. Alternativas melhores disponíveis

### Alternativa Moderna: Deque

**✅ Use Deque com ArrayDeque:**

```java
Deque<String> pilha = new ArrayDeque<>();

// API clara e consistente:
pilha.push("A");       // Adiciona ao topo
pilha.push("B");       // Adiciona ao topo
String topo = pilha.pop();    // Remove do topo
String peek = pilha.peek();   // Consulta topo
boolean vazia = pilha.isEmpty();  // Verifica vazio
```

**Vantagens:**
- Sem herança problemática - apenas métodos de pilha expostos
- Sem overhead de sincronização (mais rápido)
- API consistente com Collections Framework
- Mais eficiente (ArrayDeque)

---

## ⚠️ Limitações e Considerações

**1. Quebra de Encapsulamento:**
Herança de Vector permite violação de invariante LIFO.

**2. Overhead Sempre Presente:**
Sincronização herdada tem custo mesmo em single-thread.

**3. API Redundante:**
Múltiplas formas de fazer mesma operação causam confusão.

**4. Não Escalável:**
Performance degrada com contenção (herança de Vector).

**5. search() Inconsistente:**
Usa índice 1-based, diferente do resto do Java.

---

## 🔗 Interconexões Conceituais

**Relação com Vector:** Subclasse direta - herda tudo (estrutura, sincronização, problemas).

**Relação com Deque:** Interface moderna que substitui Stack funcionalmente.

**Relação com ArrayDeque:** Implementação eficiente de Deque, alternativa preferida.

**Relação com Composition vs Inheritance:** Exemplo clássico de violação do princípio "favor composition".

---

## 🚀 Evolução e Próximos Conceitos

**Evolução de Pilhas em Java:**

1. **Stack (1996):** Primeira implementação - herança de Vector
2. **Deque Interface (2006):** Interface genérica para double-ended queues
3. **ArrayDeque (2006):** Implementação eficiente sem sincronização
4. **LinkedList (1998):** Também implementa Deque

**Migração: Stack → Deque:**

```java
// Antes (Stack):
Stack<String> pilha = new Stack<>();
pilha.push("A");
String topo = pilha.pop();

// Depois (Deque):
Deque<String> pilha = new ArrayDeque<>();
pilha.push("A");
String topo = pilha.pop();
// API idêntica para operações de pilha!
```

---

## 📚 Conclusão

Stack é classe legada do Java 1.0 que estende Vector para implementar pilha LIFO. Herança expõe métodos de Vector que violam invariante LIFO, quebrando encapsulamento. Herda overhead de sincronização de Vector mesmo quando desnecessário. API confusa com métodos duplicados (push vs add). Em código moderno, **sempre preferir Deque interface com ArrayDeque** - semanticamente correta, mais eficiente, sem herança problemática. Stack é exemplo clássico de violação de "composition over inheritance" mantido apenas por compatibilidade retroativa.
