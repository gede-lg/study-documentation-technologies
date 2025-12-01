# empty() e search() em Stack: Análise Conceitual

## 🎯 Introdução e Definição

### Definição Conceitual

**empty()** e **search()** são métodos auxiliares de Stack que complementam operações LIFO. Conceitualmente, fornecem **inspeção de estado** (vazia?) e **busca de posição** (onde está elemento?).

**Definições:**
- **empty():** Retorna `true` se pilha não contém elementos
- **search(Object o):** Retorna distância do elemento ao topo (1-indexed)

### Contexto Histórico e Motivação

**Java 1.0 (1996):** Estes métodos foram incluídos para fornecer funcionalidade completa de pilha:
- **empty():** Evitar EmptyStackException ao verificar antes de pop/peek
- **search():** Encontrar posição de elemento na pilha

**Motivação de empty():** Fornecer maneira idiomática de verificar se pilha vazia, comum em loops de processamento.

**Motivação de search():** Permitir localizar elemento sem desempilhar, útil para algoritmos que precisam saber profundidade.

### Problema Fundamental

**Problema de empty():** Como verificar seguramente se pilha está vazia antes de operações que falham em pilha vazia?

**Solução:** Método `empty()` retorna boolean - idiomático para condicionais.

**Problema de search():** Como encontrar posição de elemento em pilha sem desempilhar?

**Solução:** Método `search(Object o)` retorna distância do topo (1 = topo, 2 = segundo, etc.).

### Por Que Estes Métodos

**empty() vs size() == 0:**

```java
// Ambos equivalentes:
if (pilha.empty()) { /* ... */ }
if (pilha.size() == 0) { /* ... */ }

// empty() é mais legível/idiomático para pilhas
```

**search() - Caso Específico:**

```java
// Saber profundidade sem desempilhar
int profundidade = pilha.search("elemento");
// Útil em algoritmos como avaliação de expressões
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **empty():** Verifica se pilha vazia (size == 0)
2. **search():** Busca elemento e retorna distância do topo
3. **Indexação 1-Based:** search() usa índice começando em 1, não 0
4. **Retorno -1:** search() retorna -1 se elemento não encontrado
5. **Não Modificam:** Ambos métodos apenas consultam, não alteram pilha

### Pilares Fundamentais

- **empty() Idiomático:** Forma clara de verificar vazio
- **search() 1-Indexed:** Topo = 1 (não 0)
- **Equivalência:** empty() ≡ (size() == 0)
- **Busca Linear:** search() percorre pilha de cima para baixo
- **Complexidade:** empty() O(1), search() O(n)

### Visão Geral das Nuances

- **empty() vs isEmpty():** Stack herda isEmpty() de Vector, mas também tem empty()
- **search() vs indexOf():** search() conta do topo (1-indexed), indexOf() do fundo (0-indexed)
- **Inconsistência de Índice:** search() é 1-based, resto do Java é 0-based
- **Não Sincronizado:** empty() não é synchronized (mas chama size() que é)

---

## 🧠 Fundamentos Teóricos

### empty() - Verificar Vazio

**Assinatura:**
```java
public boolean empty();
```

**Contrato:**
- Retorna `true` se pilha não contém elementos
- Retorna `false` se pilha tem ao menos um elemento
- Equivalente a `size() == 0`
- Não lança exceção
- **Não é synchronized** (mas chama size() que é)

**Implementação:**

```java
public boolean empty() {
    return size() == 0;  // size() é herdado de Vector (synchronized)
}
```

**Exemplo:**

```java
Stack<String> pilha = new Stack<>();

boolean vazia1 = pilha.empty();
// vazia1 = true

pilha.push("A");
boolean vazia2 = pilha.empty();
// vazia2 = false

pilha.pop();
boolean vazia3 = pilha.empty();
// vazia3 = true novamente
```

**Complexidade:** O(1) - apenas verifica contador de tamanho.

### search(Object o) - Buscar Posição

**Assinatura:**
```java
public synchronized int search(Object o);
```

**Contrato:**
- Retorna posição **1-based** do elemento a partir do topo
- Topo = 1, segundo = 2, terceiro = 3, etc.
- Retorna -1 se elemento não encontrado
- Usa `equals()` para comparação
- Se múltiplas ocorrências, retorna posição da mais próxima do topo
- É synchronized

**Implementação Conceitual:**

```java
public synchronized int search(Object o) {
    int i = lastIndexOf(o);  // Vector.lastIndexOf() - busca do fim
    if (i >= 0) {
        return size() - i;  // Converte índice array para distância do topo
    }
    return -1;
}
```

**Exemplo:**

```java
Stack<String> pilha = new Stack<>();
pilha.push("A");  // Fundo
pilha.push("B");
pilha.push("C");  // Topo

// Pilha: [A, B, C]
//         3  2  1  ← Distância do topo

int pos1 = pilha.search("C");  // 1 (topo)
int pos2 = pilha.search("B");  // 2 (segundo)
int pos3 = pilha.search("A");  // 3 (fundo)
int pos4 = pilha.search("X");  // -1 (não existe)
```

**Complexidade:** O(n) - percorre array procurando elemento.

### Indexação 1-Based de search()

**Conceito:** search() usa índice começando em 1, não 0.

**Comparação:**

```java
Stack<String> pilha = new Stack<>();
pilha.push("A");  // Índice array: 0, Distância topo: 3
pilha.push("B");  // Índice array: 1, Distância topo: 2
pilha.push("C");  // Índice array: 2, Distância topo: 1

// Índice array (0-based):
// [A:0, B:1, C:2]

// search() (1-based do topo):
pilha.search("C");  // 1
pilha.search("B");  // 2
pilha.search("A");  // 3

// Vector.indexOf() (0-based do fundo):
pilha.indexOf("A");  // 0
pilha.indexOf("B");  // 1
pilha.indexOf("C");  // 2
```

**Conversão:**

```
search(o) = size() - indexOf(o)

Se search("B") = 2:
   indexOf("B") = size() - 2 = 3 - 2 = 1 ✓
```

---

## 🔍 Análise Conceitual Profunda

### empty() vs isEmpty()

**Stack Tem Ambos:**

```java
Stack<String> pilha = new Stack<>();

// Método de Stack (não synchronized):
boolean vazia1 = pilha.empty();

// Herdado de Vector/Collection (synchronized):
boolean vazia2 = pilha.isEmpty();

// Ambos retornam mesmo valor
```

**Diferença:**
- **empty():** Específico de Stack, não sincronizado diretamente
- **isEmpty():** Padrão de Collection, synchronized (herdado)

**Convenção:** Para Stack, preferir `empty()` - mais idiomático para pilhas.

### search() vs indexOf()

**search() - 1-Based do Topo:**

```java
Stack<Integer> pilha = new Stack<>();
pilha.push(10);  // Fundo
pilha.push(20);
pilha.push(30);  // Topo

int pos = pilha.search(30);  // 1 (topo)
int pos = pilha.search(20);  // 2
int pos = pilha.search(10);  // 3 (fundo)
```

**indexOf() - 0-Based do Fundo:**

```java
// Mesmo pilha acima
int idx1 = pilha.indexOf(10);  // 0 (primeiro no array)
int idx2 = pilha.indexOf(20);  // 1
int idx3 = pilha.indexOf(30);  // 2 (último no array)
```

**Conversão:**

```java
// De search para indexOf:
int searchPos = pilha.search(elemento);
int indexOfPos = pilha.size() - searchPos;

// De indexOf para search:
int indexOfPos = pilha.indexOf(elemento);
int searchPos = pilha.size() - indexOfPos;
```

**Conceito:** search() é perspectiva de pilha (do topo), indexOf() é perspectiva de array (do início).

### Busca com Duplicatas

**search() Retorna Primeira Ocorrência do Topo:**

```java
Stack<String> pilha = new Stack<>();
pilha.push("A");  // Fundo
pilha.push("B");
pilha.push("A");  // Duplicata - mais próxima do topo
pilha.push("C");  // Topo

// Pilha: [A, B, A, C]
//         4  3  2  1  ← Distância do topo

int pos = pilha.search("A");  // 2 (não 4 - primeira do topo)
```

**Implementação Usa lastIndexOf:**

```java
public synchronized int search(Object o) {
    int i = lastIndexOf(o);  // Último índice no array = primeiro do topo
    if (i >= 0) {
        return size() - i;
    }
    return -1;
}
```

**Conceito:** lastIndexOf() encontra última ocorrência no array, que é primeira vindo do topo.

### empty() em Loops

**Padrão Clássico:**

```java
Stack<Integer> pilha = new Stack<>();
pilha.push(1);
pilha.push(2);
pilha.push(3);

// Processar todos elementos
while (!pilha.empty()) {
    Integer item = pilha.pop();
    processar(item);
}
// Pilha fica vazia ao final
```

**Alternativa com Exceção (Não Recomendado):**

```java
// Ruim - usar exceção para controle de fluxo
try {
    while (true) {
        Integer item = pilha.pop();
        processar(item);
    }
} catch (EmptyStackException e) {
    // Pilha vazia
}
```

**Conceito:** `empty()` permite verificação explícita e idiomática.

### search() em Algoritmos

**Verificar Profundidade:**

```java
Stack<String> pilha = new Stack<>();
pilha.push("(");
pilha.push("(");
pilha.push("(");

// Saber quantos parênteses abertos
int nivelAninhamento = pilha.search("(");
// nivelAninhamento = 1 (topo)

// Contar todos:
int total = 0;
int pos = 1;
while (pilha.search("(") == pos || pos <= pilha.size()) {
    // Lógica complexa - search() raramente usado assim
    pos++;
}
```

**Realidade:** search() tem casos de uso limitados - maioria dos algoritmos prefere pop/peek.

---

## 🎯 Aplicabilidade e Contextos

### Uso de empty() - Verificação Segura

**Evitar EmptyStackException:**

```java
Stack<String> pilha = new Stack<>();

// ❌ Sem verificação - risco de exceção
String item = pilha.pop();  // EmptyStackException se vazia

// ✅ Com verificação
if (!pilha.empty()) {
    String item = pilha.pop();  // Seguro
}
```

**Loop de Processamento:**

```java
Stack<Tarefa> tarefas = new Stack<>();
// ... preencher tarefas

while (!tarefas.empty()) {
    Tarefa tarefa = tarefas.pop();
    executar(tarefa);
}
```

### Uso de search() - Casos Limitados

**Verificar Presença sem Desempilhar:**

```java
Stack<String> historico = new Stack<>();
historico.push("pagina1.html");
historico.push("pagina2.html");
historico.push("pagina3.html");

// Verificar se página está no histórico
int pos = historico.search("pagina2.html");
if (pos != -1) {
    System.out.println("Página está " + pos + " níveis abaixo do topo");
}
```

**Limitação:** Na prática, `contains()` é mais claro:

```java
// Mais idiomático:
if (historico.contains("pagina2.html")) {
    // ...
}
```

### Quando NÃO Usar search()

**Iteração - Use Loop:**

```java
// ❌ Ruim - usar search() para iterar
for (int i = 1; i <= pilha.size(); i++) {
    // search() repetidamente é ineficiente
}

// ✅ Bom - usar iterator ou pop
while (!pilha.empty()) {
    String item = pilha.pop();
}
```

---

## ⚠️ Limitações e Considerações

**1. search() É 1-Indexed:**

```java
// Inconsistente com resto do Java (0-indexed)
int pos = pilha.search("item");
// pos = 1 significa topo (não 0)
```

**2. empty() Não É Synchronized Diretamente:**

```java
// empty() chama size() que é synchronized
// Mas empty() em si não tem synchronized
public boolean empty() {
    return size() == 0;  // size() synchronized
}
```

**3. search() Tem Complexidade O(n):**

```java
// Percorre array linearmente
int pos = pilha.search("item");  // O(n)
```

**4. search() Retorna -1, Não Exceção:**

```java
// Diferente de get() que lança exceção
int pos = pilha.search("inexistente");  // -1
// Precisa verificar retorno
```

---

## 🔗 Interconexões Conceituais

**Relação com size():** empty() é equivalente a `size() == 0`.

**Relação com indexOf():** search() é inverso conceitual - conta do topo, não fundo.

**Relação com contains():** search() != -1 equivale a contains().

**Relação com isEmpty():** Stack tem empty() e isEmpty() (herdado).

---

## 🚀 Evolução e Próximos Conceitos

**Alternativas Modernas:**

```java
// Stack (legada):
if (stack.empty()) { /* ... */ }
int pos = stack.search("item");

// Deque (moderna):
if (deque.isEmpty()) { /* ... */ }
// Deque não tem search() - usar contains() ou iterar
```

**Padrões Modernos:**

```java
// Preferir isEmpty() (padrão Collection):
if (pilha.isEmpty()) { /* ... */ }

// Preferir contains() ao invés de search():
if (pilha.contains("item")) { /* ... */ }
```

---

## 📚 Conclusão

**empty()** retorna `true` se pilha vazia (equivalente a `size() == 0`), usado idiomaticamente para verificar antes de pop/peek (O(1)). **search(Object o)** retorna distância 1-based do elemento ao topo, ou -1 se não encontrado (O(n)). Usa `lastIndexOf()` internamente, retornando primeira ocorrência vindo do topo. empty() é útil e idiomático em loops. search() tem casos de uso limitados - maioria dos cenários prefere contains() ou iteração. Indexação 1-based de search() é inconsistente com resto do Java (0-based), sendo peculiaridade histórica de Stack.
