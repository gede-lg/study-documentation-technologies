# Iteração de Coleções com for-each

## 🎯 Introdução e Definição

### Definição Conceitual

**Iteração de coleções com for-each** é o uso do **enhanced for loop** para percorrer elementos de **Collections** (List, Set, Map, etc) implementando a interface **Iterable**. É a forma mais **idiomática** e **legível** de iterar coleções em Java, abstraindo completamente o mecanismo de **Iterator**.

**Estrutura básica**:
```java
Collection<Tipo> colecao = // ...

for (Tipo elemento : colecao) {
    // Processa elemento
}
```

**Analogia**: É como receber **cada item** de uma esteira transportadora - você **pega automaticamente** o próximo item sem precisar acionar botões ou controlar a esteira manualmente.

**Exemplo fundamental**:
```java
List<String> frutas = new ArrayList<>();
frutas.add("Maçã");
frutas.add("Banana");
frutas.add("Laranja");

// for-each: itera automaticamente
for (String fruta : frutas) {
    System.out.println(fruta);
}

// Saída:
// Maçã
// Banana
// Laranja
```

**Importância**:
- ✅ **Abstração**: Esconde complexidade do Iterator
- ✅ **Polimorfismo**: Funciona com qualquer Iterable
- ✅ **Legibilidade**: Código mais expressivo
- ✅ **Segurança**: Evita erros de iteração manual
- ⚠️ **Read-only**: Não pode remover durante iteração

---

## 📋 Sumário Conceitual

### Coleções Suportadas

**1. List**: ArrayList, LinkedList, Vector
**2. Set**: HashSet, LinkedHashSet, TreeSet
**3. Queue**: PriorityQueue, ArrayDeque
**4. Deque**: ArrayDeque, LinkedList
**5. Map**: KeySet, Values, EntrySet (não diretamente Map)

**Requisito**: Implementar **Iterable<T>**

---

## 🧠 Fundamentos Teóricos

### 1. Iteração de List

**ArrayList**:
```java
List<String> nomes = new ArrayList<>();
nomes.add("Ana");
nomes.add("Bruno");
nomes.add("Carlos");

for (String nome : nomes) {
    System.out.println(nome);
}

// Saída:
// Ana
// Bruno
// Carlos
```

**LinkedList**:
```java
List<Integer> numeros = new LinkedList<>();
numeros.add(10);
numeros.add(20);
numeros.add(30);

for (Integer numero : numeros) {
    System.out.println(numero);
}

// Saída:
// 10
// 20
// 30
```

**List de objetos**:
```java
class Produto {
    String nome;
    double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
}

List<Produto> produtos = new ArrayList<>();
produtos.add(new Produto("Notebook", 3000.0));
produtos.add(new Produto("Mouse", 50.0));
produtos.add(new Produto("Teclado", 150.0));

for (Produto produto : produtos) {
    System.out.printf("%s: R$ %.2f%n", produto.nome, produto.preco);
}

// Saída:
// Notebook: R$ 3000.00
// Mouse: R$ 50.00
// Teclado: R$ 150.00
```

### 2. Iteração de Set

**HashSet** (sem ordem garantida):
```java
Set<String> cores = new HashSet<>();
cores.add("Vermelho");
cores.add("Verde");
cores.add("Azul");

for (String cor : cores) {
    System.out.println(cor);
}

// Saída: ORDEM NÃO GARANTIDA
// Verde
// Azul
// Vermelho
```

**LinkedHashSet** (ordem de inserção):
```java
Set<Integer> numeros = new LinkedHashSet<>();
numeros.add(30);
numeros.add(10);
numeros.add(20);

for (Integer numero : numeros) {
    System.out.println(numero);
}

// Saída: ORDEM DE INSERÇÃO
// 30
// 10
// 20
```

**TreeSet** (ordem natural):
```java
Set<String> palavras = new TreeSet<>();
palavras.add("Zebra");
palavras.add("Abacaxi");
palavras.add("Maçã");

for (String palavra : palavras) {
    System.out.println(palavra);
}

// Saída: ORDEM ALFABÉTICA
// Abacaxi
// Maçã
// Zebra
```

### 3. Iteração de Queue

**PriorityQueue**:
```java
Queue<Integer> fila = new PriorityQueue<>();
fila.add(50);
fila.add(10);
fila.add(30);

for (Integer numero : fila) {
    System.out.println(numero);
}

// Saída: ORDEM DA PRIORITY (heap)
// 10
// 50
// 30
```

**ArrayDeque**:
```java
Deque<String> deque = new ArrayDeque<>();
deque.add("Primeiro");
deque.add("Segundo");
deque.add("Terceiro");

for (String elemento : deque) {
    System.out.println(elemento);
}

// Saída:
// Primeiro
// Segundo
// Terceiro
```

### 4. Iteração de Map (Indireta)

**Map NÃO implementa Iterable**, mas oferece **views iteráveis**:

#### **Iterar sobre Chaves (keySet)**

```java
Map<String, Integer> idades = new HashMap<>();
idades.put("Ana", 25);
idades.put("Bruno", 30);
idades.put("Carlos", 28);

// Iterar sobre keySet (Set<K>)
for (String nome : idades.keySet()) {
    System.out.println(nome + " tem " + idades.get(nome) + " anos");
}

// Saída:
// Bruno tem 30 anos
// Ana tem 25 anos
// Carlos tem 28 anos
```

#### **Iterar sobre Valores (values)**

```java
// Iterar sobre values (Collection<V>)
for (Integer idade : idades.values()) {
    System.out.println("Idade: " + idade);
}

// Saída:
// Idade: 30
// Idade: 25
// Idade: 28
```

#### **Iterar sobre Entradas (entrySet)**

```java
// Iterar sobre entrySet (Set<Entry<K,V>>)
for (Map.Entry<String, Integer> entrada : idades.entrySet()) {
    String nome = entrada.getKey();
    Integer idade = entrada.getValue();
    System.out.println(nome + " tem " + idade + " anos");
}

// Saída:
// Bruno tem 30 anos
// Ana tem 25 anos
// Carlos tem 28 anos
```

**entrySet é mais eficiente** que keySet quando precisa de chave E valor:

```java
// ❌ Menos eficiente: busca valor 2 vezes
for (String nome : idades.keySet()) {
    System.out.println(nome + ": " + idades.get(nome));  // get() é O(1) mas adiciona overhead
}

// ✅ Mais eficiente: acessa chave e valor diretamente
for (Map.Entry<String, Integer> entry : idades.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

### 5. Modificação de Elementos

#### **⚠️ NÃO Pode Remover da Coleção**

```java
List<String> palavras = new ArrayList<>(Arrays.asList("Java", "Python", "C++", "Ruby"));

// ❌ ConcurrentModificationException
for (String palavra : palavras) {
    if (palavra.length() < 4) {
        palavras.remove(palavra);  // ERRO!
    }
}
```

**Solução 1: Usar Iterator.remove()**:
```java
Iterator<String> it = palavras.iterator();
while (it.hasNext()) {
    String palavra = it.next();
    if (palavra.length() < 4) {
        it.remove();  // OK com Iterator
    }
}
```

**Solução 2: removeIf (Java 8+)**:
```java
palavras.removeIf(palavra -> palavra.length() < 4);
```

**Solução 3: Criar nova lista**:
```java
List<String> filtradas = new ArrayList<>();
for (String palavra : palavras) {
    if (palavra.length() >= 4) {
        filtradas.add(palavra);
    }
}
```

#### **✅ PODE Modificar Propriedades de Objetos**

```java
class Conta {
    String titular;
    double saldo;
    
    Conta(String titular, double saldo) {
        this.titular = titular;
        this.saldo = saldo;
    }
}

List<Conta> contas = new ArrayList<>();
contas.add(new Conta("Ana", 1000.0));
contas.add(new Conta("Bruno", 2000.0));

// ✅ Funciona: modifica propriedades dos objetos
for (Conta conta : contas) {
    conta.saldo = conta.saldo * 1.05;  // Aumenta 5%
}

for (Conta conta : contas) {
    System.out.printf("%s: R$ %.2f%n", conta.titular, conta.saldo);
}

// Saída:
// Ana: R$ 1050.00
// Bruno: R$ 2100.00
```

### 6. Operações Comuns com Coleções

#### **Soma de Elementos**

```java
List<Integer> numeros = Arrays.asList(10, 20, 30, 40, 50);
int soma = 0;

for (Integer numero : numeros) {
    soma += numero;
}

System.out.println("Soma: " + soma);
// Saída: Soma: 150
```

#### **Filtrar Elementos**

```java
List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
List<Integer> pares = new ArrayList<>();

for (Integer numero : numeros) {
    if (numero % 2 == 0) {
        pares.add(numero);
    }
}

System.out.println("Pares: " + pares);
// Saída: Pares: [2, 4, 6, 8, 10]
```

#### **Buscar Elemento**

```java
List<String> frutas = Arrays.asList("Maçã", "Banana", "Laranja", "Uva");
String procurada = "Banana";
boolean encontrada = false;

for (String fruta : frutas) {
    if (fruta.equals(procurada)) {
        encontrada = true;
        break;
    }
}

System.out.println(procurada + (encontrada ? " encontrada" : " não encontrada"));
// Saída: Banana encontrada
```

#### **Contar Ocorrências**

```java
List<String> palavras = Arrays.asList("java", "python", "java", "c++", "java");
String alvo = "java";
int contador = 0;

for (String palavra : palavras) {
    if (palavra.equals(alvo)) {
        contador++;
    }
}

System.out.println("Ocorrências de '" + alvo + "': " + contador);
// Saída: Ocorrências de 'java': 3
```

#### **Transformar Elementos**

```java
List<String> palavras = Arrays.asList("java", "python", "javascript");
List<String> maiusculas = new ArrayList<>();

for (String palavra : palavras) {
    maiusculas.add(palavra.toUpperCase());
}

System.out.println("Maiúsculas: " + maiusculas);
// Saída: Maiúsculas: [JAVA, PYTHON, JAVASCRIPT]
```

### 7. Coleções Aninhadas

**List de Lists**:
```java
List<List<Integer>> matriz = new ArrayList<>();
matriz.add(Arrays.asList(1, 2, 3));
matriz.add(Arrays.asList(4, 5, 6));
matriz.add(Arrays.asList(7, 8, 9));

for (List<Integer> linha : matriz) {
    for (Integer elemento : linha) {
        System.out.print(elemento + " ");
    }
    System.out.println();
}

// Saída:
// 1 2 3
// 4 5 6
// 7 8 9
```

**Set de Lists**:
```java
Set<List<String>> grupos = new HashSet<>();
grupos.add(Arrays.asList("Ana", "Bruno"));
grupos.add(Arrays.asList("Carlos", "Diana"));

for (List<String> grupo : grupos) {
    System.out.print("Grupo: ");
    for (String nome : grupo) {
        System.out.print(nome + " ");
    }
    System.out.println();
}

// Saída:
// Grupo: Carlos Diana
// Grupo: Ana Bruno
```

### 8. Collections Vazias e Null

**Coleção vazia**:
```java
List<String> lista = new ArrayList<>();  // Vazia

// for-each NÃO executa
for (String item : lista) {
    System.out.println(item);  // Nunca executado
}

System.out.println("Lista vazia processada");
// Saída: Lista vazia processada
```

**Coleção null**:
```java
List<String> lista = null;

// ❌ NullPointerException
for (String item : lista) {  // NPE!
    System.out.println(item);
}

// ✅ Verificar null
if (lista != null) {
    for (String item : lista) {
        System.out.println(item);
    }
}
```

### 9. Break e Continue

**Break**:
```java
List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

for (Integer numero : numeros) {
    if (numero > 5) {
        break;  // SAI do loop
    }
    System.out.print(numero + " ");
}
// Saída: 1 2 3 4 5
```

**Continue**:
```java
for (Integer numero : numeros) {
    if (numero % 2 == 0) {
        continue;  // PULA pares
    }
    System.out.print(numero + " ");
}
// Saída: 1 3 5 7 9
```

### 10. Exemplos Práticos Completos

#### **Sistema de Biblioteca**

```java
class Livro {
    String titulo;
    String autor;
    int ano;
    boolean disponivel;
    
    Livro(String titulo, String autor, int ano) {
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.disponivel = true;
    }
}

List<Livro> biblioteca = new ArrayList<>();
biblioteca.add(new Livro("Clean Code", "Robert Martin", 2008));
biblioteca.add(new Livro("Effective Java", "Joshua Bloch", 2017));
biblioteca.add(new Livro("Design Patterns", "Gang of Four", 1994));

// Buscar livros disponíveis
System.out.println("=== LIVROS DISPONÍVEIS ===");
for (Livro livro : biblioteca) {
    if (livro.disponivel) {
        System.out.printf("%s - %s (%d)%n", livro.titulo, livro.autor, livro.ano);
    }
}

// Saída:
// === LIVROS DISPONÍVEIS ===
// Clean Code - Robert Martin (2008)
// Effective Java - Joshua Bloch (2017)
// Design Patterns - Gang of Four (1994)
```

#### **Processamento de Pedidos**

```java
class Pedido {
    String codigo;
    List<String> itens;
    double valorTotal;
    String status;
    
    Pedido(String codigo, List<String> itens, double valorTotal, String status) {
        this.codigo = codigo;
        this.itens = itens;
        this.valorTotal = valorTotal;
        this.status = status;
    }
}

List<Pedido> pedidos = new ArrayList<>();
pedidos.add(new Pedido("P001", Arrays.asList("Notebook", "Mouse"), 3050.0, "PAGO"));
pedidos.add(new Pedido("P002", Arrays.asList("Teclado"), 150.0, "PENDENTE"));
pedidos.add(new Pedido("P003", Arrays.asList("Monitor", "Webcam"), 1200.0, "PAGO"));

double totalPago = 0;
int pedidosPagos = 0;

System.out.println("=== PEDIDOS PAGOS ===");
for (Pedido pedido : pedidos) {
    if (pedido.status.equals("PAGO")) {
        System.out.printf("%s - R$ %.2f - Itens: %d%n",
            pedido.codigo, pedido.valorTotal, pedido.itens.size());
        
        totalPago += pedido.valorTotal;
        pedidosPagos++;
    }
}

System.out.printf("%nTotal de pedidos pagos: %d%n", pedidosPagos);
System.out.printf("Valor total arrecadado: R$ %.2f%n", totalPago);

// Saída:
// === PEDIDOS PAGOS ===
// P001 - R$ 3050.00 - Itens: 2
// P003 - R$ 1200.00 - Itens: 2
//
// Total de pedidos pagos: 2
// Valor total arrecadado: R$ 4250.00
```

#### **Análise de Dados com Map**

```java
Map<String, List<Double>> notasPorAluno = new HashMap<>();
notasPorAluno.put("Ana", Arrays.asList(8.0, 7.5, 9.0));
notasPorAluno.put("Bruno", Arrays.asList(6.0, 5.5, 6.5));
notasPorAluno.put("Carlos", Arrays.asList(9.5, 10.0, 8.5));

System.out.println("=== RELATÓRIO DE NOTAS ===");
for (Map.Entry<String, List<Double>> entry : notasPorAluno.entrySet()) {
    String aluno = entry.getKey();
    List<Double> notas = entry.getValue();
    
    double soma = 0;
    for (Double nota : notas) {
        soma += nota;
    }
    double media = soma / notas.size();
    
    String status = media >= 7.0 ? "APROVADO" : "REPROVADO";
    System.out.printf("%s - Média: %.2f - %s%n", aluno, media, status);
}

// Saída:
// === RELATÓRIO DE NOTAS ===
// Bruno - Média: 6.00 - REPROVADO
// Ana - Média: 8.17 - APROVADO
// Carlos - Média: 9.33 - APROVADO
```

---

## 🔍 Análise Conceitual Profunda

### Interface Iterable

**for-each funciona com qualquer Iterable**:
```java
public interface Iterable<T> {
    Iterator<T> iterator();
}
```

**Collections implementam Iterable**:
- List, Set, Queue, Deque
- Todas as implementações (ArrayList, HashSet, etc)

**Map NÃO implementa Iterable**:
- Use keySet(), values(), ou entrySet()

### Internamente: Iterator

**for-each usa Iterator por baixo**:
```java
// for-each
for (String item : lista) {
    System.out.println(item);
}

// Equivalente com Iterator
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String item = it.next();
    System.out.println(item);
}
```

### Por Que Não Pode Remover?

**ConcurrentModificationException**: Collection detecta modificação durante iteração.

**Fail-fast iterator**: Falha rapidamente ao detectar modificação.

**Solução**: Use Iterator.remove() ou crie nova coleção.

---

## 🎯 Aplicabilidade e Contextos

### 1. **Processamento de Listas**

```java
for (Objeto obj : lista) {
    processar(obj);
}
```

### 2. **Validação de Dados**

```java
for (Dado dado : dados) {
    validar(dado);
}
```

### 3. **Relatórios e Exibição**

```java
for (Registro registro : registros) {
    exibir(registro);
}
```

### 4. **Busca e Filtro**

```java
for (Item item : itens) {
    if (condicao(item)) {
        resultado.add(item);
    }
}
```

### 5. **Cálculos Agregados**

```java
for (Valor valor : valores) {
    soma += valor.getQuantidade();
}
```

### 6. **Iteração de Map**

```java
for (Map.Entry<K, V> entry : map.entrySet()) {
    processar(entry.getKey(), entry.getValue());
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Remover Durante Iteração (ConcurrentModificationException)**

```java
// ❌ ERRO
List<Integer> lista = new ArrayList<>(Arrays.asList(1, 2, 3));
for (Integer n : lista) {
    if (n == 2) {
        lista.remove(n);  // ConcurrentModificationException!
    }
}

// ✅ Use removeIf
lista.removeIf(n -> n == 2);
```

### 2. **Coleção Null (NullPointerException)**

```java
// ❌ NPE
List<String> lista = null;
for (String item : lista) {  // NPE!
    System.out.println(item);
}

// ✅ Verificar null
if (lista != null) {
    for (String item : lista) {
        System.out.println(item);
    }
}
```

### 3. **Map Não É Iterable**

```java
// ❌ ERRO: Map não implementa Iterable
Map<String, Integer> map = new HashMap<>();
for (??? entry : map) {  // ERRO
}

// ✅ Use entrySet, keySet ou values
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    // OK
}
```

### 4. **Ordem Não Garantida (HashSet, HashMap)**

```java
// ⚠️ Ordem imprevisível
Set<Integer> set = new HashSet<>(Arrays.asList(3, 1, 2));
for (Integer n : set) {
    System.out.println(n);
}
// Saída: pode ser 1 2 3, ou 3 1 2, etc

// ✅ Use TreeSet para ordem natural
Set<Integer> sorted = new TreeSet<>(set);
```

### 5. **Sem Índice**

```java
// ❌ Não há índice
List<String> lista = Arrays.asList("A", "B", "C");
for (String item : lista) {
    // Qual o índice atual? (desconhecido)
}

// ✅ Use for tradicional
for (int i = 0; i < lista.size(); i++) {
    System.out.println(i + ": " + lista.get(i));
}
```

---

## 🔗 Interconexões Conceituais

- **Collections Framework**: List, Set, Queue, Map
- **Iterable**: Interface que permite for-each
- **Iterator**: Usado internamente por for-each
- **Generics**: Tipo seguro em coleções
- **Streams (Java 8+)**: Alternativa funcional
- **Lambda (Java 8+)**: forEach com lambda
- **ConcurrentModificationException**: Erro ao modificar durante iteração

---

## 🚀 Boas Práticas

### 1. ✅ Use for-each para Leitura

```java
// ✅ Ideal para leitura
for (Objeto obj : objetos) {
    processar(obj);
}
```

### 2. ✅ Use entrySet para Map

```java
// ✅ entrySet mais eficiente
for (Map.Entry<K, V> entry : map.entrySet()) {
    K chave = entry.getKey();
    V valor = entry.getValue();
}
```

### 3. ✅ Verifique Null

```java
// ✅ Previne NPE
if (colecao != null) {
    for (Tipo item : colecao) {
        processar(item);
    }
}
```

### 4. ✅ Use removeIf para Remoção (Java 8+)

```java
// ✅ removeIf seguro
lista.removeIf(item -> condicao(item));
```

### 5. ✅ Prefira Streams para Operações Complexas (Java 8+)

```java
// ✅ Stream para filter/map
lista.stream()
    .filter(item -> item.getValor() > 100)
    .map(Item::getNome)
    .forEach(System.out::println);
```

### 6. ✅ Nomes Descritivos

```java
// ✅ Nome descritivo no singular
for (Produto produto : produtos) {
    processar(produto);
}
```

### 7. ✅ Evite Modificar Coleção Original

```java
// ✅ Criar nova coleção
List<String> filtrados = new ArrayList<>();
for (String item : original) {
    if (condicao(item)) {
        filtrados.add(item);
    }
}
```

### 8. ✅ Use break para Busca Eficiente

```java
// ✅ break ao encontrar
for (Item item : itens) {
    if (item.equals(procurado)) {
        encontrado = true;
        break;
    }
}
```

### 9. ✅ Considere LinkedHashSet/TreeSet para Ordem

```java
// ✅ LinkedHashSet mantém ordem de inserção
Set<String> ordenado = new LinkedHashSet<>();

// ✅ TreeSet ordena naturalmente
Set<String> alfabetico = new TreeSet<>();
```

### 10. ✅ Documente Ordem Esperada

```java
// ✅ Comentário explica ordem
// Ordem de inserção mantida por LinkedHashSet
for (String item : linkedHashSet) {
    processar(item);
}
```

---

## 📚 Resumo

**for-each** é a forma mais **idiomática** de iterar **Collections** (List, Set, Queue, etc) que implementam **Iterable**. Sintaxe: `for (Tipo elemento : colecao) { }`. Funciona com **List** (ArrayList, LinkedList), **Set** (HashSet, TreeSet), **Queue**, e **views de Map** (keySet, values, entrySet). **Map não é Iterable diretamente** - use entrySet (pares chave-valor), keySet (chaves), ou values (valores). **Vantagem**: abstrai **Iterator**, código mais **limpo** e **legível**. **Limitação principal**: **não pode remover** da coleção durante iteração (ConcurrentModificationException) - use **removeIf** ou **Iterator.remove()**. **PODE modificar propriedades** de objetos (via referência). **SEMPRE verifique null** antes de iterar. **entrySet é mais eficiente** que keySet quando precisa de chave E valor. **Ordem**: ArrayList/LinkedHashSet (previsível), HashSet/HashMap (não garantida), TreeSet (natural). for-each usa **Iterator internamente**. Suporta **break** e **continue**. Prefira **Streams (Java 8+)** para operações funcionais complexas.

