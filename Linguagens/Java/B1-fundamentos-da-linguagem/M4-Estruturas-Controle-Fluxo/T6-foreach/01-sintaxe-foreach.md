# Sintaxe do for-each

## 🎯 Introdução e Definição

### Definição Conceitual

O **for-each** (também chamado de **enhanced for loop** ou **for aprimorado**) é uma **sintaxe simplificada** introduzida no **Java 5** para **iterar** sobre elementos de **arrays** e **coleções** sem necessidade de índice ou iterador explícito. Ele percorre **todos os elementos** da estrutura de forma **sequencial** e **automática**.

**Estrutura básica**:
```java
for (TipoElemento elemento : colecao) {
    // Usa elemento diretamente
}
```

**Analogia**: É como passar por uma **fila de pessoas** onde você **automaticamente** vai de pessoa em pessoa, sem precisar contar "primeira, segunda, terceira..." - você simplesmente **pega a próxima** pessoa da fila.

**Exemplo fundamental**:
```java
// Array de números
int[] numeros = {10, 20, 30, 40, 50};

// for-each: itera automaticamente
for (int numero : numeros) {
    System.out.println(numero);
}

// Saída:
// 10
// 20
// 30
// 40
// 50
```

**Importância**:
- ✅ **Simplicidade**: Sintaxe mais limpa e legível
- ✅ **Menos erros**: Sem índices, menos erros de array bounds
- ✅ **Foco**: Concentra-se no elemento, não no índice
- ✅ **Segurança**: Não pode modificar índice acidentalmente
- ⚠️ **Read-only**: Ideal para leitura, limitado para modificação

---

## 📋 Sumário Conceitual

### Componentes da Sintaxe

```java
for (TipoElemento variavel : array_ou_colecao) {
    // corpo do loop
}
```

**1. `for`**: Palavra-chave do loop
**2. `TipoElemento`**: Tipo do elemento (deve corresponder ao tipo da coleção)
**3. `variavel`**: Nome da variável que recebe cada elemento
**4. `:`**: Separador (lê-se "em" ou "para cada")
**5. `array_ou_colecao`**: Estrutura a ser iterada

**Leitura**: "**Para cada** elemento **em** coleção"

---

## 🧠 Fundamentos Teóricos

### 1. Sintaxe Básica com Arrays

**Array de primitivos**:
```java
int[] numeros = {1, 2, 3, 4, 5};

for (int n : numeros) {
    System.out.print(n + " ");
}
// Saída: 1 2 3 4 5
```

**Array de objetos**:
```java
String[] nomes = {"Ana", "Bruno", "Carlos"};

for (String nome : nomes) {
    System.out.println("Olá, " + nome);
}

// Saída:
// Olá, Ana
// Olá, Bruno
// Olá, Carlos
```

**Array multidimensional**:
```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// for-each para array externo (retorna arrays internos)
for (int[] linha : matriz) {
    // for-each para array interno
    for (int elemento : linha) {
        System.out.print(elemento + " ");
    }
    System.out.println();
}

// Saída:
// 1 2 3
// 4 5 6
// 7 8 9
```

### 2. Sintaxe com Coleções (Collections)

**List**:
```java
List<String> frutas = new ArrayList<>();
frutas.add("Maçã");
frutas.add("Banana");
frutas.add("Laranja");

for (String fruta : frutas) {
    System.out.println(fruta);
}

// Saída:
// Maçã
// Banana
// Laranja
```

**Set**:
```java
Set<Integer> numeros = new HashSet<>();
numeros.add(10);
numeros.add(20);
numeros.add(30);

for (Integer numero : numeros) {
    System.out.println(numero);
}
// Saída: ordem não garantida (HashSet não ordena)
```

**Map (iterando chaves)**:
```java
Map<String, Integer> idades = new HashMap<>();
idades.put("Ana", 25);
idades.put("Bruno", 30);
idades.put("Carlos", 28);

// Iterar sobre keySet (conjunto de chaves)
for (String nome : idades.keySet()) {
    System.out.println(nome + " tem " + idades.get(nome) + " anos");
}
```

**Map (iterando entradas)**:
```java
// Iterar sobre entrySet (pares chave-valor)
for (Map.Entry<String, Integer> entrada : idades.entrySet()) {
    System.out.println(entrada.getKey() + " tem " + entrada.getValue() + " anos");
}
```

### 3. Tipo da Variável de Iteração

**Tipo DEVE corresponder** ao tipo do elemento:

```java
// ✅ Correto: int para array de int
int[] numeros = {1, 2, 3};
for (int n : numeros) {
    System.out.println(n);
}

// ✅ Correto: String para List<String>
List<String> palavras = Arrays.asList("A", "B", "C");
for (String palavra : palavras) {
    System.out.println(palavra);
}

// ❌ ERRO: tipo incompatível
int[] valores = {1, 2, 3};
for (String v : valores) {  // ERRO: int não é String
    System.out.println(v);
}
```

**Autoboxing/Unboxing**:
```java
// ✅ Autoboxing: Integer → int
List<Integer> numeros = Arrays.asList(1, 2, 3);
for (int n : numeros) {  // Integer automaticamente convertido para int
    System.out.println(n);
}

// ✅ Wrapper explícito
for (Integer n : numeros) {
    System.out.println(n);
}
```

### 4. Variável de Iteração é Final (Implicitamente)

**Variável NÃO pode ser reatribuída**:
```java
int[] numeros = {1, 2, 3};

for (int n : numeros) {
    n = n * 2;  // ✅ OK: altera CÓPIA local
    System.out.println(n);  // 2, 4, 6
}

System.out.println(Arrays.toString(numeros));
// Saída: [1, 2, 3]  (array original NÃO modificado)
```

**Não pode reatribuir variável**:
```java
List<String> nomes = Arrays.asList("Ana", "Bruno");

for (String nome : nomes) {
    nome = "Novo";  // ✅ OK: altera CÓPIA, não a lista
}
// Lista original não muda
```

### 5. Equivalência com for Tradicional

**for-each**:
```java
int[] numeros = {10, 20, 30};

for (int n : numeros) {
    System.out.println(n);
}
```

**Equivalente em for tradicional**:
```java
int[] numeros = {10, 20, 30};

for (int i = 0; i < numeros.length; i++) {
    int n = numeros[i];
    System.out.println(n);
}
```

**for-each é açúcar sintático** (syntactic sugar) para simplificar iteração.

### 6. Iteração sobre Iterable

**for-each funciona com qualquer Iterable**:
```java
// Collection (implementa Iterable)
Collection<String> colecao = Arrays.asList("A", "B", "C");
for (String item : colecao) {
    System.out.println(item);
}

// Custom Iterable
class MinhaColecao implements Iterable<String> {
    private List<String> elementos = new ArrayList<>();
    
    public void adicionar(String elemento) {
        elementos.add(elemento);
    }
    
    @Override
    public Iterator<String> iterator() {
        return elementos.iterator();
    }
}

MinhaColecao colecao = new MinhaColecao();
colecao.adicionar("X");
colecao.adicionar("Y");

for (String item : colecao) {  // Funciona porque implementa Iterable
    System.out.println(item);
}
```

### 7. Limitações: Não Há Índice

**for-each NÃO fornece índice**:
```java
String[] nomes = {"Ana", "Bruno", "Carlos"};

// ❌ Não há como obter índice no for-each
for (String nome : nomes) {
    // Não sei que nome é o primeiro, segundo, etc
    System.out.println(nome);
}

// ✅ Se precisa de índice, use for tradicional
for (int i = 0; i < nomes.length; i++) {
    System.out.println("Índice " + i + ": " + nomes[i]);
}
```

**Solução com contador manual** (desencorajada):
```java
int indice = 0;
for (String nome : nomes) {
    System.out.println("Índice " + indice + ": " + nome);
    indice++;
}
// Funciona, mas perde vantagem do for-each
```

### 8. Modificação de Elementos (Objetos Mutáveis)

**for-each NÃO modifica primitivos** (cópia):
```java
int[] numeros = {1, 2, 3};

for (int n : numeros) {
    n = n * 2;  // Altera CÓPIA
}

System.out.println(Arrays.toString(numeros));
// Saída: [1, 2, 3]  (ORIGINAL não muda)
```

**for-each PODE modificar objetos** (referência):
```java
class Pessoa {
    String nome;
    int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

List<Pessoa> pessoas = new ArrayList<>();
pessoas.add(new Pessoa("Ana", 25));
pessoas.add(new Pessoa("Bruno", 30));

// ✅ Modifica objetos (altera propriedades)
for (Pessoa p : pessoas) {
    p.idade++;  // Incrementa idade do OBJETO original
}

for (Pessoa p : pessoas) {
    System.out.println(p.nome + ": " + p.idade);
}
// Saída:
// Ana: 26
// Bruno: 31
```

### 9. Break e Continue

**for-each suporta break**:
```java
int[] numeros = {1, 2, 3, 4, 5};

for (int n : numeros) {
    if (n == 3) {
        break;  // SAI do loop
    }
    System.out.println(n);
}
// Saída: 1 2
```

**for-each suporta continue**:
```java
int[] numeros = {1, 2, 3, 4, 5};

for (int n : numeros) {
    if (n % 2 == 0) {
        continue;  // PULA pares
    }
    System.out.println(n);
}
// Saída: 1 3 5
```

### 10. Exemplos Práticos Completos

#### **Soma de Array**

```java
int[] valores = {10, 20, 30, 40, 50};
int soma = 0;

for (int valor : valores) {
    soma += valor;
}

System.out.println("Soma: " + soma);
// Saída: Soma: 150
```

#### **Encontrar Máximo**

```java
int[] numeros = {15, 42, 8, 23, 56, 11};
int maximo = Integer.MIN_VALUE;

for (int n : numeros) {
    if (n > maximo) {
        maximo = n;
    }
}

System.out.println("Máximo: " + maximo);
// Saída: Máximo: 56
```

#### **Filtrar Elementos**

```java
List<String> palavras = Arrays.asList("casa", "apartamento", "sala", "quarto");
List<String> curtas = new ArrayList<>();

for (String palavra : palavras) {
    if (palavra.length() <= 5) {
        curtas.add(palavra);
    }
}

System.out.println("Palavras curtas: " + curtas);
// Saída: Palavras curtas: [casa, sala]
```

#### **Processamento de Objetos**

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

double total = 0;

for (Produto produto : produtos) {
    System.out.printf("%s: R$ %.2f%n", produto.nome, produto.preco);
    total += produto.preco;
}

System.out.printf("Total: R$ %.2f%n", total);

// Saída:
// Notebook: R$ 3000.00
// Mouse: R$ 50.00
// Teclado: R$ 150.00
// Total: R$ 3200.00
```

#### **Busca em Lista**

```java
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos", "Diana");
String nomeProcurado = "Carlos";
boolean encontrado = false;

for (String nome : nomes) {
    if (nome.equals(nomeProcurado)) {
        encontrado = true;
        break;
    }
}

if (encontrado) {
    System.out.println(nomeProcurado + " encontrado!");
} else {
    System.out.println(nomeProcurado + " não encontrado.");
}
// Saída: Carlos encontrado!
```

#### **Conversão de Tipos**

```java
List<String> numerosTexto = Arrays.asList("10", "20", "30");
List<Integer> numerosInt = new ArrayList<>();

for (String texto : numerosTexto) {
    numerosInt.add(Integer.parseInt(texto));
}

System.out.println("Números convertidos: " + numerosInt);
// Saída: Números convertidos: [10, 20, 30]
```

---

## 🔍 Análise Conceitual Profunda

### Por Que for-each Foi Introduzido?

**Problema com for tradicional**:
- Verboso: `for (int i = 0; i < array.length; i++)`
- Propenso a erros: off-by-one, `IndexOutOfBoundsException`
- Foco no índice, não no elemento
- Mais difícil de ler

**Solução do for-each**:
- Conciso: `for (int elemento : array)`
- Seguro: sem índices, sem erros de bounds
- Foco no elemento
- Mais legível

### Limitações do for-each

**1. Sem acesso ao índice**:
```java
// ❌ Não funciona: índice desconhecido
for (String nome : nomes) {
    // Não sei qual é o índice atual
}
```

**2. Sem modificação de elementos primitivos**:
```java
// ❌ Não funciona: modifica cópia
for (int n : numeros) {
    n = n * 2;  // Array original não muda
}
```

**3. Sem remoção durante iteração** (ConcurrentModificationException):
```java
// ❌ ERRO: não pode remover da coleção durante for-each
List<Integer> numeros = new ArrayList<>(Arrays.asList(1, 2, 3, 4));

for (Integer n : numeros) {
    if (n % 2 == 0) {
        numeros.remove(n);  // ConcurrentModificationException!
    }
}
```

**4. Iteração unidirecional**:
- Sempre do início ao fim
- Não pode iterar ao contrário
- Não pode pular elementos arbitrariamente

### Quando NÃO Usar for-each

- Precisa de índice
- Precisa modificar elementos primitivos do array
- Precisa remover elementos da coleção
- Precisa iterar múltiplas coleções simultaneamente
- Precisa iterar ao contrário

---

## 🎯 Aplicabilidade e Contextos

### 1. **Processamento de Arrays**

```java
double[] precos = {10.5, 20.0, 15.75};
double total = 0;

for (double preco : precos) {
    total += preco;
}
```

### 2. **Iteração de Listas**

```java
List<String> tarefas = getTarefas();

for (String tarefa : tarefas) {
    processar(tarefa);
}
```

### 3. **Leitura de Propriedades**

```java
for (Pessoa pessoa : pessoas) {
    System.out.println(pessoa.getNome());
}
```

### 4. **Filtragem de Dados**

```java
for (Produto p : produtos) {
    if (p.getPreco() > 100) {
        produtosCaros.add(p);
    }
}
```

### 5. **Validação de Elementos**

```java
boolean todosPositivos = true;

for (int n : numeros) {
    if (n <= 0) {
        todosPositivos = false;
        break;
    }
}
```

### 6. **Exibição de Dados**

```java
for (String mensagem : mensagens) {
    System.out.println(mensagem);
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Modificar Coleção Durante Iteração**

```java
// ❌ ERRO: ConcurrentModificationException
List<Integer> lista = new ArrayList<>(Arrays.asList(1, 2, 3));

for (Integer n : lista) {
    if (n == 2) {
        lista.remove(n);  // ERRO!
    }
}

// ✅ Use Iterator.remove()
Iterator<Integer> it = lista.iterator();
while (it.hasNext()) {
    Integer n = it.next();
    if (n == 2) {
        it.remove();  // OK
    }
}
```

### 2. **Tentar Modificar Array de Primitivos**

```java
// ❌ Não funciona: modifica cópia
int[] arr = {1, 2, 3};

for (int n : arr) {
    n = n * 2;  // Altera cópia local
}
// arr ainda é [1, 2, 3]

// ✅ Use for tradicional
for (int i = 0; i < arr.length; i++) {
    arr[i] = arr[i] * 2;  // Modifica array original
}
```

### 3. **Null Pointer Exception**

```java
// ❌ ERRO: NPE se array/coleção for null
int[] numeros = null;

for (int n : numeros) {  // NullPointerException!
    System.out.println(n);
}

// ✅ Verificar null antes
if (numeros != null) {
    for (int n : numeros) {
        System.out.println(n);
    }
}
```

### 4. **Tipo Incompatível**

```java
// ❌ ERRO: tipo incompatível
List<String> palavras = Arrays.asList("A", "B");

for (Integer palavra : palavras) {  // ERRO de compilação
    System.out.println(palavra);
}

// ✅ Tipo correto
for (String palavra : palavras) {
    System.out.println(palavra);
}
```

### 5. **Esquecer Dois Pontos**

```java
// ❌ ERRO: sintaxe incorreta
for (int n in numeros) {  // ERRO: 'in' não existe em Java (existe em Python)
    System.out.println(n);
}

// ✅ Use dois pontos (:)
for (int n : numeros) {
    System.out.println(n);
}
```

---

## 🔗 Interconexões Conceituais

- **for tradicional**: Forma mais versátil de loop
- **Iterator**: Usado internamente pelo for-each
- **Iterable**: Interface que permite for-each
- **Arrays**: Estrutura mais comum com for-each
- **Collections**: Framework de coleções compatível
- **Generics**: Tipo seguro em coleções
- **Autoboxing**: Conversão automática primitivo ↔ wrapper

---

## 🚀 Boas Práticas

### 1. ✅ Use for-each para Leitura

```java
// ✅ Ideal: ler elementos
for (String nome : nomes) {
    System.out.println(nome);
}
```

### 2. ✅ Nomes Descritivos no Singular

```java
// ✅ Nome descritivo
for (Produto produto : produtos) {
    processar(produto);
}

// ❌ Nome genérico
for (Produto p : produtos) {  // 'p' é vago
    processar(p);
}
```

### 3. ✅ Verificar Null Antes

```java
// ✅ Previne NPE
if (lista != null) {
    for (String item : lista) {
        processar(item);
    }
}
```

### 4. ✅ Use for Tradicional Se Precisa de Índice

```java
// ❌ Contador manual (ruim)
int i = 0;
for (String nome : nomes) {
    System.out.println(i + ": " + nome);
    i++;
}

// ✅ for tradicional
for (int i = 0; i < nomes.length; i++) {
    System.out.println(i + ": " + nomes[i]);
}
```

### 5. ✅ Prefira for-each para Arrays e Collections

```java
// ✅ for-each mais limpo
for (int n : numeros) {
    soma += n;
}

// ❌ for tradicional (verboso)
for (int i = 0; i < numeros.length; i++) {
    soma += numeros[i];
}
```

### 6. ✅ Use Iterator.remove() Para Remoção

```java
// ✅ Iterator para remover
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (devRemover(s)) {
        it.remove();
    }
}
```

### 7. ✅ Extraia Lógica Complexa

```java
// ✅ Método para lógica complexa
for (Produto produto : produtos) {
    processarProduto(produto);
}

private void processarProduto(Produto p) {
    // Lógica complexa aqui
}
```

### 8. ✅ Use Streams para Operações Funcionais (Java 8+)

```java
// ✅ Stream (Java 8+) para filter/map
produtos.stream()
    .filter(p -> p.getPreco() > 100)
    .forEach(p -> System.out.println(p));

// for-each ainda útil para lógica imperativa
for (Produto p : produtos) {
    if (p.getPreco() > 100) {
        System.out.println(p);
    }
}
```

### 9. ✅ Tipo Explícito vs var (Java 10+)

```java
// ✅ Tipo explícito (mais claro)
for (String nome : nomes) {
    System.out.println(nome);
}

// ✅ var (Java 10+, conciso)
for (var nome : nomes) {
    System.out.println(nome);
}
```

### 10. ✅ Documente Limitações

```java
// ✅ Comentário explica por que não usa for-each
// Usando for tradicional porque preciso do índice
for (int i = 0; i < array.length; i++) {
    System.out.println("Índice " + i + ": " + array[i]);
}
```

---

## 📚 Resumo

O **for-each** (enhanced for loop) é uma **sintaxe simplificada** introduzida no **Java 5** para **iterar** sobre **arrays** e **coleções** sem índice explícito. Sintaxe: `for (Tipo elemento : colecao) { }`, lida como "**para cada elemento em coleção**". **Vantagens**: código **mais limpo**, **menos propenso a erros**, **foco no elemento**. **Limitações**: **sem acesso ao índice**, **não modifica primitivos** (apenas cópia), **não pode remover** da coleção (ConcurrentModificationException), **iteração unidirecional** (início → fim). Use for-each para **leitura** de elementos; use **for tradicional** quando precisar de índice, modificar array, ou remover elementos. for-each funciona com **arrays** e qualquer **Iterable** (List, Set, etc). **Não modifica array de primitivos** (altera cópia), mas **pode modificar objetos** (altera propriedades via referência). Suporta **break** e **continue**. **Sempre verifique null** antes de iterar. for-each é **açúcar sintático** que usa **Iterator** internamente. Prefira **nomes descritivos no singular** para variável de iteração.

