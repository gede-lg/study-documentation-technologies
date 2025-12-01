# Métodos push(), pop(), peek() em Stack: Análise Conceitual

## 🎯 Introdução e Definição

### Definição Conceitual

**push()**, **pop()** e **peek()** são métodos fundamentais que implementam operações LIFO em Stack. Conceitualmente, representam **interface mínima** de pilha: adicionar ao topo, remover do topo, consultar topo.

**Definições:**
- **push(E item):** Insere elemento no topo da pilha (empilhar)
- **pop():** Remove e retorna elemento do topo (desempilhar)
- **peek():** Retorna elemento do topo sem remover (espiar)

### Contexto Histórico e Motivação

**Java 1.0 (1996):** Stack foi introduzida com estes três métodos como operações essenciais de pilha, modelando comportamento presente em:
- **Arquitetura de CPU:** Instruções PUSH/POP em assembly
- **Teoria de Estruturas de Dados:** Operações clássicas de pilha
- **Linguagens Anteriores:** C, Pascal tinham abstrações similares

**Motivação:** Fornecer API clara e intuitiva para operações LIFO, mapeando diretamente para conceitos estabelecidos em ciência da computação.

### Problema Fundamental

**Problema:** Como fornecer interface simples e segura para manipular pilha LIFO?

**Solução:** Três operações ortogonais:
1. **push:** Adicionar (modificação)
2. **pop:** Remover e consultar (modificação + leitura)
3. **peek:** Apenas consultar (leitura)

**Conceito:** Separação entre consulta (peek) e remoção (pop) oferece flexibilidade sem comprometer simplicidade.

### Por Que Três Métodos

**Mínimo Necessário para Pilha:**

```java
// push - NECESSÁRIO para adicionar
pilha.push("A");

// pop - NECESSÁRIO para remover
String removido = pilha.pop();

// peek - ÚTIL mas pode ser simulado (pop + push de volta)
String consultado = pilha.peek();
```

**Conceito:** push e pop são essenciais; peek é conveniência (evita pop + push).

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **push:** Adiciona ao topo, aumenta tamanho
2. **pop:** Remove do topo, diminui tamanho, retorna elemento
3. **peek:** Consulta topo sem modificar, não altera tamanho
4. **EmptyStackException:** pop/peek lançam exceção se pilha vazia
5. **Complexidade O(1):** Todas operações acessam apenas topo

### Pilares Fundamentais

- **Acesso ao Topo:** Todas operações manipulam apenas última posição
- **Modificação vs Consulta:** push/pop modificam, peek apenas lê
- **Exceção em Vazia:** pop/peek falham em pilha vazia
- **Retorno de Valor:** pop e peek retornam elemento do topo
- **Sincronização:** Métodos são synchronized (herdado de Vector)

### Visão Geral das Nuances

- **push Retorna Item:** Peculiaridade - retorna elemento inserido
- **EmptyStackException vs null:** Exceção ao invés de retornar null
- **Sincronização Herdada:** Overhead de synchronized mesmo em single-thread
- **Delegação a Vector:** Implementação delega para métodos herdados

---

## 🧠 Fundamentos Teóricos

### push(E item) - Empilhar

**Assinatura:**
```java
public E push(E item);
```

**Contrato:**
- Adiciona `item` ao topo da pilha
- Tamanho aumenta em 1
- Retorna `item` (o elemento inserido)
- Nunca lança exceção (exceto OutOfMemoryError se memória esgotar)
- É synchronized

**Implementação Conceitual:**

```java
public E push(E item) {
    addElement(item);  // Método de Vector - adiciona ao final
    return item;
}
```

**Exemplo:**

```java
Stack<String> pilha = new Stack<>();

// Estado inicial: []

String retorno = pilha.push("A");
// Estado: [A]
// retorno = "A"

pilha.push("B");
// Estado: [A, B]

pilha.push("C");
// Estado: [A, B, C] ← C no topo
```

**Complexidade:** O(1) amortizado - adiciona ao final do array (Vector).

### pop() - Desempilhar

**Assinatura:**
```java
public synchronized E pop();
```

**Contrato:**
- Remove elemento do topo
- Tamanho diminui em 1
- Retorna elemento removido
- Lança `EmptyStackException` se pilha vazia
- É synchronized

**Implementação Conceitual:**

```java
public synchronized E pop() {
    E obj = peek();  // Consulta topo (lança exceção se vazio)
    removeElementAt(size() - 1);  // Remove último elemento (Vector)
    return obj;
}
```

**Exemplo:**

```java
Stack<String> pilha = new Stack<>();
pilha.push("A");
pilha.push("B");
pilha.push("C");
// Estado: [A, B, C]

String primeiro = pilha.pop();
// Estado: [A, B]
// primeiro = "C" (era o topo)

String segundo = pilha.pop();
// Estado: [A]
// segundo = "B"

String terceiro = pilha.pop();
// Estado: []
// terceiro = "A"

pilha.pop();  // EmptyStackException - pilha vazia!
```

**Complexidade:** O(1) - remove do final do array.

### peek() - Espiar Topo

**Assinatura:**
```java
public synchronized E peek();
```

**Contrato:**
- Retorna elemento do topo **sem remover**
- Tamanho não muda
- Lança `EmptyStackException` se pilha vazia
- É synchronized

**Implementação Conceitual:**

```java
public synchronized E peek() {
    int len = size();
    if (len == 0)
        throw new EmptyStackException();
    return elementAt(len - 1);  // Retorna último elemento (Vector)
}
```

**Exemplo:**

```java
Stack<Integer> pilha = new Stack<>();
pilha.push(10);
pilha.push(20);
pilha.push(30);
// Estado: [10, 20, 30]

Integer topo = pilha.peek();
// Estado: [10, 20, 30] (NÃO modificou)
// topo = 30

Integer topoNovamente = pilha.peek();
// Estado: [10, 20, 30]
// topoNovamente = 30 (mesmo elemento)

pilha.pop();
// Estado: [10, 20]

Integer novoTopo = pilha.peek();
// Estado: [10, 20]
// novoTopo = 20
```

**Complexidade:** O(1) - acesso ao final do array.

---

## 🔍 Análise Conceitual Profunda

### Diferença: pop() vs peek()

**pop() - Destrutivo:**

```java
Stack<String> pilha = new Stack<>();
pilha.push("A");
pilha.push("B");

String elemento = pilha.pop();
// Pilha foi modificada: [A]
// elemento = "B"
```

**peek() - Não Destrutivo:**

```java
Stack<String> pilha = new Stack<>();
pilha.push("A");
pilha.push("B");

String elemento = pilha.peek();
// Pilha NÃO foi modificada: [A, B]
// elemento = "B"
```

**Conceito:** pop remove, peek apenas consulta - permite decidir se quer remover ou não.

### Peculiaridade: push() Retorna Elemento

**Comportamento:**

```java
String item = pilha.push("X");
// item = "X" (push retorna o elemento inserido)
```

**Utilidade Questionável:**

```java
// Pode encadear:
String x = pilha.push("X");
System.out.println(x);  // "X"

// Mas raramente útil - geralmente ignorado:
pilha.push("Y");  // Retorno não usado
```

**Conceito:** Design choice peculiar - maioria das coleções (List.add()) retorna boolean, não elemento.

### EmptyStackException

**Tipo de Exceção:**

```java
import java.util.EmptyStackException;

// EmptyStackException extends RuntimeException
// É unchecked - não requer try-catch
```

**Quando Lançada:**

```java
Stack<String> pilha = new Stack<>();

pilha.pop();   // EmptyStackException
pilha.peek();  // EmptyStackException
```

**Tratamento:**

```java
// Opção 1: Verificar antes
if (!pilha.empty()) {
    String item = pilha.pop();
}

// Opção 2: Tratar exceção
try {
    String item = pilha.pop();
} catch (EmptyStackException e) {
    System.out.println("Pilha vazia");
}
```

**Conceito:** Exceção sinaliza erro de lógica - tentar remover de pilha vazia é bug.

### Sincronização dos Métodos

**Todos São Synchronized:**

```java
public E push(E item) {
    // Adquire lock em 'this'
    addElement(item);
    // Libera lock
    return item;
}

public synchronized E pop() {
    // Adquire lock
    E obj = peek();
    removeElementAt(size() - 1);
    // Libera lock
    return obj;
}

public synchronized E peek() {
    // Adquire lock
    int len = size();
    if (len == 0)
        throw new EmptyStackException();
    return elementAt(len - 1);
    // Libera lock
}
```

**Implicação:**

```java
// Thread-safe para operações individuais:
pilha.push("A");  // Atômico
pilha.pop();      // Atômico

// MAS não para operações compostas:
if (!pilha.empty()) {  // synchronized
    // Outra thread pode esvaziar pilha AQUI
    pilha.pop();       // synchronized - pode lançar exceção
}

// Solução:
synchronized(pilha) {
    if (!pilha.empty()) {
        pilha.pop();
    }
}
```

**Conceito:** Sincronização de métodos individuais insuficiente para operações compostas.

### Delegação a Vector

**push Delega a addElement:**

```java
// Stack.push():
public E push(E item) {
    addElement(item);  // Vector.addElement()
    return item;
}

// Vector.addElement():
public synchronized void addElement(E obj) {
    modCount++;
    ensureCapacityHelper(elementCount + 1);
    elementData[elementCount++] = obj;
}
```

**pop Delega a removeElementAt:**

```java
// Stack.pop():
public synchronized E pop() {
    E obj = peek();
    removeElementAt(size() - 1);  // Vector.removeElementAt()
    return obj;
}

// Vector.removeElementAt():
public synchronized void removeElementAt(int index) {
    modCount++;
    elementCount--;
    elementData[index] = null;
}
```

**Conceito:** Stack é wrapper fino - toda lógica vem de Vector.

---

## 🎯 Aplicabilidade e Contextos

### Uso Típico: Sequência de Operações

**Padrão Clássico:**

```java
Stack<Integer> pilha = new Stack<>();

// Empilhar dados
pilha.push(1);
pilha.push(2);
pilha.push(3);

// Processar em ordem LIFO
while (!pilha.empty()) {
    Integer item = pilha.pop();
    processar(item);  // 3, 2, 1
}
```

### peek() para Decisões

**Consultar Antes de Remover:**

```java
Stack<String> comandos = new Stack<>();
comandos.push("SAVE");
comandos.push("EDIT");
comandos.push("DELETE");

// Verificar próximo comando sem remover
String proximo = comandos.peek();  // "DELETE"

if (proximo.equals("DELETE")) {
    // Confirmar antes de executar
    if (confirmar()) {
        comandos.pop();  // Agora remove
        executarDelete();
    }
}
```

### Encadeamento de push (Raro)

**Usando Retorno de push:**

```java
// push retorna elemento - pode atribuir
String item = pilha.push("X");
System.out.println("Empilhei: " + item);

// Mas geralmente desnecessário:
pilha.push("Y");  // Retorno ignorado
```

### Implementação de Desfazer

**Histórico de Ações:**

```java
class Editor {
    private Stack<Acao> historico = new Stack<>();

    void executar(Acao acao) {
        acao.executar();
        historico.push(acao);  // Guarda para desfazer
    }

    void desfazer() {
        if (!historico.empty()) {
            Acao ultima = historico.pop();  // Remove e retorna
            ultima.reverter();
        }
    }

    Acao proximaDesfazer() {
        if (!historico.empty()) {
            return historico.peek();  // Consulta sem remover
        }
        return null;
    }
}
```

---

## ⚠️ Limitações e Considerações

**1. EmptyStackException em Pilha Vazia:**

```java
Stack<String> pilha = new Stack<>();
pilha.pop();   // EXCEÇÃO
pilha.peek();  // EXCEÇÃO
```

**2. Sincronização Inadequada para Compostas:**

```java
// ❌ Race condition
if (!pilha.empty()) {
    pilha.pop();  // Pode lançar exceção
}

// ✅ Thread-safe
synchronized(pilha) {
    if (!pilha.empty()) {
        pilha.pop();
    }
}
```

**3. Overhead de synchronized:**

```java
// Mesmo em single-thread, há custo de lock
pilha.push("A");  // Adquire/libera lock
pilha.pop();      // Adquire/libera lock
```

**4. push Retorna Elemento (Inconsistente):**

```java
// List.add() retorna boolean:
boolean ok = lista.add("X");

// Stack.push() retorna elemento:
String item = pilha.push("X");

// Inconsistência na API
```

---

## 🔗 Interconexões Conceituais

**Relação com Vector:** Métodos delegam para addElement(), removeElementAt(), elementAt().

**Relação com Deque:** Interface moderna tem métodos equivalentes (push/pop/peek).

**Relação com LIFO:** push/pop implementam disciplina LIFO.

**Relação com Call Stack:** Espelham operações de call stack em processadores.

---

## 🚀 Evolução e Próximos Conceitos

**Evolução de API de Pilha:**

1. **Stack (1996):** push/pop/peek
2. **Deque (2006):** push/pop/peek + addFirst/removeFirst/peekFirst
3. **ArrayDeque (2006):** Implementação eficiente sem synchronized

**Comparação com Deque:**

```java
// Stack (legada):
Stack<String> stack = new Stack<>();
stack.push("A");
String topo = stack.pop();
String consulta = stack.peek();

// Deque (moderna):
Deque<String> deque = new ArrayDeque<>();
deque.push("A");
String topo = deque.pop();
String consulta = deque.peek();
// API idêntica para operações de pilha!
```

---

## 📚 Conclusão

**push(E item)** adiciona elemento ao topo da pilha retornando o item (O(1)). **pop()** remove e retorna elemento do topo, lançando EmptyStackException se vazia (O(1)). **peek()** retorna topo sem remover, também lança exceção se vazia (O(1)). Todos métodos são synchronized (herdado de Vector) causando overhead mesmo em single-thread. Delegam implementação para métodos de Vector. Em código moderno, preferir Deque interface com ArrayDeque que oferece mesma API (push/pop/peek) sem overhead de sincronização e sem herança problemática.
