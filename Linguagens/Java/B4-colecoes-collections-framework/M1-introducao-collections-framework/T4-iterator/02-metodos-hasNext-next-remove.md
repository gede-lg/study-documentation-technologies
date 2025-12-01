# Métodos hasNext(), next() e remove() do Iterator: Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

Os três métodos fundamentais da interface `Iterator` - **hasNext()**, **next()** e **remove()** - formam um **protocolo de navegação sequencial** que permite percorrer e opcionalmente modificar coleções de forma controlada e segura. Conceitualmente, esses métodos representam um **tripé de funcionalidades**: verificação de presença, acesso com avanço, e remoção segura.

Na essência, cada método tem responsabilidade específica:
- **hasNext()**: Predicado que verifica existência de próximo elemento (read-only, idempotente)
- **next()**: Accessor que retorna elemento e **avança** cursor (mutante de estado do Iterator)
- **remove()**: Modificador que elimina último elemento retornado (mutante da coleção)

### Contexto Histórico e Motivação

Esses três métodos foram cuidadosamente projetados no Java 1.2 (1998) baseados em experiências com:

**Enumeration (pré-Iterator):** Tinha apenas `hasMoreElements()` e `nextElement()` - sem capacidade de remoção

**STL do C++ (inspiração):** Iteradores C++ têm operadores `++` (avançar), `*` (dereferenciar), comparações - conceitos adaptados para Java orientado a objetos

**Necessidades Práticas:** Desenvolvedores frequentemente precisavam remover elementos durante iteração - fazê-lo com loop tradicional era propenso a erros (índices deslocados)

A motivação era criar API minimalista mas suficiente:
- **hasNext()**: Evitar `NoSuchElementException` ao chamar `next()`
- **next()**: Combinar acesso + avanço em operação atômica
- **remove()**: Permitir modificação segura sem corromper estrutura

### Problema Fundamental que Resolve

**Problema 1: Remoção Durante Iteração Manual**

```java
// ❌ Problemático com índices
List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C"));
for (int i = 0; i < lista.size(); i++) {
    if (lista.get(i).equals("B")) {
        lista.remove(i);  // Remove, índices shift
        // i++ avança, pula próximo elemento!
    }
}
```

**Problema 2: Verificação de Fim Antes de Acesso**

```java
// ❌ Sem hasNext(), precisa catch exception
try {
    while (true) {
        String s = it.next();  // Eventualmente lança NoSuchElementException
    }
} catch (NoSuchElementException e) {
    // Fim da iteração - anti-pattern
}
```

**Solução:** Protocolo hasNext() + next() + remove()

### Importância no Ecossistema

Esses três métodos são **fundação da iteração** em Java:
- **hasNext()**: Condição universal de loop (`while (it.hasNext())`)
- **next()**: Único modo de avançar Iterator
- **remove()**: Único modo seguro de remover durante iteração com Iterator

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Protocolo de Estado:** Métodos coordenam transição de estados do Iterator
2. **Idempotência vs Mutação:** hasNext() é idempotente; next() e remove() mutam estado
3. **Precondições e Pós-condições:** Cada método tem contratos sobre quando pode ser chamado
4. **Operação Atômica:** next() combina "obter elemento" + "avançar cursor"
5. **Remoção Condicional:** remove() só funciona após next(), pode ser chamado no máximo uma vez por next()

### Pilares Fundamentais

- **hasNext():** Verifica se há próximo elemento sem mudar estado
- **next():** Retorna próximo elemento E avança cursor atomicamente
- **remove():** Remove último elemento retornado por next()
- **Coordenação:** Métodos devem ser usados em sequência específica
- **Exceções:** Violações de contrato lançam exceções específicas

### Visão Geral das Nuances

- **hasNext() Múltiplas Chamadas:** Pode chamar várias vezes sem efeito colateral
- **next() sem hasNext():** Válido mas arriscado (pode lançar NoSuchElementException)
- **remove() sem next():** IllegalStateException
- **remove() Duas Vezes:** IllegalStateException (precisa next() entre elas)
- **Opcional:** remove() pode lançar UnsupportedOperationException se não suportado

---

## 🧠 Fundamentos Teóricos

### Método hasNext(): Verificação de Presença

**Assinatura:**
```java
boolean hasNext();
```

**Contrato Conceitual:**
- **Retorna:** `true` se iteração tem mais elementos; `false` se fim alcançado
- **Side Effects:** NENHUM - método puramente funcional (getter)
- **Idempotência:** Múltiplas chamadas consecutivas retornam mesmo resultado
- **Complexidade:** Tipicamente **O(1)** - verifica estado interno

**Comportamento Interno Típico:**

```java
// ArrayList.Itr
private class Itr implements Iterator<E> {
    int cursor;  // Índice do próximo elemento

    public boolean hasNext() {
        return cursor != size();  // Simples comparação
    }
}
```

**Conceito:** hasNext() apenas **consulta** se há próximo elemento, sem modificar posição do cursor.

**Uso Padrão:**

```java
Iterator<String> it = lista.iterator();

if (it.hasNext()) {  // Verificar antes de consumir
    String primeiro = it.next();
}

// Pattern de loop
while (it.hasNext()) {  // Condição de continuação
    String elemento = it.next();
    // processar
}
```

**Idempotência Demonstrada:**

```java
Iterator<String> it = lista.iterator();

boolean temProximo1 = it.hasNext();  // true (assumindo lista não vazia)
boolean temProximo2 = it.hasNext();  // true (mesma resposta)
boolean temProximo3 = it.hasNext();  // true (sem side effect)

// Cursor não mudou - próximo next() retorna mesmo elemento
```

### Método next(): Acesso e Avanço

**Assinatura:**
```java
E next();
```

**Contrato Conceitual:**
- **Retorna:** Próximo elemento na iteração
- **Side Effect:** Avança cursor para próxima posição
- **Pré-condição:** Deve haver próximo elemento (verificar com hasNext())
- **Exceção:** `NoSuchElementException` se não há próximo elemento
- **Complexidade:** Tipicamente **O(1)**

**Comportamento Interno Típico:**

```java
// ArrayList.Itr
public E next() {
    checkForComodification();  // Verifica modificação concorrente

    int i = cursor;  // Posição atual
    if (i >= size())  // Pré-condição: há elemento?
        throw new NoSuchElementException();

    Object[] elementData = ArrayList.this.elementData;
    cursor = i + 1;  // Avança cursor (side effect!)

    return (E) elementData[lastRet = i];  // Retorna elemento, salva lastRet
}
```

**Conceitos Fundamentais:**

1. **Operação Atômica:** Retornar + Avançar é indivisível - não pode obter elemento sem avançar

2. **Estado "lastRet":** Salva índice do elemento retornado (usado por `remove()`)

3. **Verificação de Fim:** Lança `NoSuchElementException` se cursor ultrapassou tamanho

**Uso Correto e Incorreto:**

```java
// ✅ Correto: verificar antes
Iterator<String> it = lista.iterator();
while (it.hasNext()) {  // Verifica presença
    String s = it.next();  // Consome seguramente
}

// ❌ Arriscado: não verificar
Iterator<String> it = lista.iterator();
String s1 = it.next();  // OK se lista não vazia
String s2 = it.next();  // OK se lista tem >= 2 elementos
String s3 = it.next();  // NoSuchElementException se lista tem < 3!

// ✅ Defensivo com if
if (it.hasNext()) {
    String s = it.next();  // Seguro
}
```

**Sequência de Chamadas:**

```java
List<String> lista = Arrays.asList("A", "B", "C");
Iterator<String> it = lista.iterator();

// Estado inicial: cursor = 0, lastRet = -1
System.out.println(it.hasNext());  // true (cursor < size)

String el1 = it.next();  // Retorna "A", cursor = 1, lastRet = 0
System.out.println(el1);  // "A"
System.out.println(it.hasNext());  // true

String el2 = it.next();  // Retorna "B", cursor = 2, lastRet = 1
System.out.println(el2);  // "B"

String el3 = it.next();  // Retorna "C", cursor = 3, lastRet = 2
System.out.println(el3);  // "C"
System.out.println(it.hasNext());  // false (cursor == size)

// it.next();  // NoSuchElementException!
```

### Método remove(): Remoção Segura

**Assinatura:**
```java
default void remove() {
    throw new UnsupportedOperationException("remove");
}
```

**Contrato Conceitual:**
- **Operação:** Remove da coleção o **último elemento retornado por next()**
- **Pré-condição:** next() deve ter sido chamado desde último remove() ou início
- **Exceção IllegalStateException:** Se next() não foi chamado ou remove() já chamado
- **Exceção UnsupportedOperationException:** Se Iterator não suporta remoção (implementação default)
- **Side Effect:** Modifica coleção subjacente
- **Opcional:** Implementação pode não suportar (coleções imutáveis)

**Comportamento Interno Típico:**

```java
// ArrayList.Itr
public void remove() {
    if (lastRet < 0)  // Verifica se next() foi chamado
        throw new IllegalStateException();
    checkForComodification();

    try {
        ArrayList.this.remove(lastRet);  // Remove da lista
        cursor = lastRet;  // Ajusta cursor (elemento foi removido, índices shifted)
        lastRet = -1;  // Invalida lastRet (prevent duplicate remove)
        expectedModCount = modCount;  // Atualiza modCount esperado
    } catch (IndexOutOfBoundsException ex) {
        throw new ConcurrentModificationException();
    }
}
```

**Conceitos Críticos:**

1. **lastRet < 0:** Indica que next() não foi chamado ou remove() já foi chamado desde último next()

2. **Ajuste de Cursor:** Após remoção, cursor aponta para posição correta considerando shift

3. **Sincronização de modCount:** Atualiza `expectedModCount` para refletir modificação legítima

**Regras de Uso:**

```java
Iterator<String> it = lista.iterator();

// ❌ Erro: remover antes de next()
// it.remove();  // IllegalStateException

String primeiro = it.next();  // OK: "A"
it.remove();  // ✅ OK: remove "A"

// ❌ Erro: remover duas vezes consecutivas
// it.remove();  // IllegalStateException (precisa next() entre removes)

String segundo = it.next();  // OK: "B"
it.remove();  // ✅ OK: remove "B"
it.remove();  // ❌ IllegalStateException
```

**Exemplo Prático: Filtrar Elementos**

```java
List<Integer> numeros = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6));

// Remover números pares
Iterator<Integer> it = numeros.iterator();
while (it.hasNext()) {
    Integer num = it.next();
    if (num % 2 == 0) {
        it.remove();  // Remove 2, 4, 6
    }
}

System.out.println(numeros);  // [1, 3, 5]
```

**Por Que remove() É Necessário?**

**Alternativa Ingênua (Problemática):**

```java
List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C"));

// ❌ ConcurrentModificationException
for (String s : lista) {
    if (s.equals("B")) {
        lista.remove(s);  // Modifica coleção durante iteração!
    }
}
```

**Solução com Iterator.remove():**

```java
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (s.equals("B")) {
        it.remove();  // ✅ Remoção segura
    }
}
```

**Conceito:** `Iterator.remove()` é o **único modo seguro** de modificar coleção durante iteração com Iterator. Remove coordena com estado interno do Iterator, evitando `ConcurrentModificationException`.

---

## 🔍 Análise Conceitual Profunda

### Coordenação Entre Métodos

**Máquina de Estados do Iterator:**

```
    [INÍCIO]
       |
       | iterator()
       ↓
   [INITIAL]
       |
       | hasNext() (pode repetir)
       ↓
   [VERIFYING]
       |
       | next()
       ↓
   [POSITIONED]
       |
       ├─→ hasNext() → [VERIFYING]
       ├─→ next() → [POSITIONED]
       └─→ remove() → [INITIAL]
```

**Estados:**
- **INITIAL:** Cursor antes do primeiro elemento ou após remove()
- **VERIFYING:** hasNext() chamado (não muda estado)
- **POSITIONED:** next() retornou elemento, pode chamar remove()

### Exceções e Condições de Erro

**NoSuchElementException:**
```java
List<String> lista = Arrays.asList("A");
Iterator<String> it = lista.iterator();

it.next();  // "A"
it.next();  // NoSuchElementException (sem mais elementos)
```

**IllegalStateException:**
```java
Iterator<String> it = lista.iterator();

it.remove();  // IllegalStateException (next() não chamado)

it.next();  // "A"
it.remove();  // OK
it.remove();  // IllegalStateException (já removeu, precisa next() novamente)
```

**UnsupportedOperationException:**
```java
List<String> imutavel = List.of("A", "B", "C");
Iterator<String> it = imutavel.iterator();

it.next();
it.remove();  // UnsupportedOperationException (lista imutável)
```

### Comparação: Enhanced for vs Iterator Explícito

**Enhanced for (internamente usa Iterator):**
```java
for (String s : lista) {
    System.out.println(s);
    // NÃO pode chamar remove()
}

// Compilador gera aproximadamente:
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    System.out.println(s);
}
```

**Iterator Explícito (controle total):**
```java
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    System.out.println(s);
    if (condicao) {
        it.remove();  // ✅ Possível com Iterator explícito
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar hasNext() + next()

**Percorrer Todos Elementos:**
```java
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    processar(s);
}
```

**Processar Até Condição:**
```java
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (s.equals("STOP")) break;
    processar(s);
}
```

### Quando Usar remove()

**Filtrar Elementos:**
```java
Iterator<Usuario> it = usuarios.iterator();
while (it.hasNext()) {
    Usuario u = it.next();
    if (!u.isAtivo()) {
        it.remove();
    }
}
```

**Remover Condicional Complexa:**
```java
Iterator<Pedido> it = pedidos.iterator();
while (it.hasNext()) {
    Pedido p = it.next();
    if (p.getStatus() == CANCELADO && p.getIdade() > 30) {
        it.remove();
        log.info("Pedido " + p.getId() + " removido");
    }
}
```

---

## ⚠️ Limitações e Considerações

**remove() É Opcional:** Coleções imutáveis lançam UnsupportedOperationException

**Modificação Externa Invalida Iterator:** Usar `lista.remove()` durante iteração causa ConcurrentModificationException

**Não Há "Peek":** Não pode ver próximo elemento sem avançar (next() sempre avança)

**Single Remove:** Apenas um remove() por next() - para remover múltiplos, precisa loop

---

## 🔗 Interconexões Conceituais

**Relação com fail-fast:** remove() sincroniza modCount, evitando ConcurrentModificationException

**Relação com Streams:** Stream não tem remove() - operações são funcionais, não modificam fonte

**Relação com ListIterator:** Adiciona `previous()`, `hasPrevious()`, `add()`, `set()`

---

## 🚀 Evolução e Próximos Conceitos

1. **forEachRemaining():** Método Java 8+ para processar elementos restantes
2. **ListIterator:** Iteração bidirecional com métodos adicionais
3. **Spliterator:** Iteração paralela para Streams
4. **removeIf():** Alternativa funcional em Collections

---

## 📚 Conclusão

Os métodos hasNext(), next() e remove() formam protocolo elegante e seguro para iteração em Java. hasNext() verifica presença sem side effects, next() acessa e avança atomicamente, remove() permite modificação segura. Compreender coordenação entre esses métodos, suas pré/pós-condições e exceções é essencial para usar Iterator corretamente e evitar armadilhas comuns como ConcurrentModificationException.
