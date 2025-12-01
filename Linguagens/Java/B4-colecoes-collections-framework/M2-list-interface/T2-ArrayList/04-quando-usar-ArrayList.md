# T2.04 - Quando Usar ArrayList

## Introdução

**ArrayList ideal**: acesso frequente índice, tamanho dinâmico, adicionar fim, leitura dominante.

```java
import java.util.*;

// QUANDO USAR ArrayList
public class QuandoUsarArrayList {
    public static void main(String[] args) {
        // ✅ IDEAL: acesso aleatório frequente
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");
        nomes.add("Carlos");
        
        // Acesso direto O(1) - muito eficiente
        String segundo = nomes.get(1);  // Bruno
        String primeiro = nomes.get(0);  // Ana
        
        // ✅ IDEAL: adicionar fim
        nomes.add("Diana");  // O(1) amortizado
        nomes.add("Eduardo");
        
        // ✅ IDEAL: iteração sequencial
        for (String nome : nomes) {
            System.out.println(nome);  // Cache-friendly
        }
        
        // ✅ IDEAL: modificar elementos
        nomes.set(2, "Carolina");  // O(1)
        
        // ❌ NÃO IDEAL: inserção início frequente
        // nomes.add(0, "Novo");  // O(n) desloca todos
        
        System.out.println(nomes);
    }
}
```

**ArrayList ideal**: acesso aleatório, adicionar fim, leitura, modificação. Não ideal: inserção início/meio frequente.

---

## Fundamentos

### 1. Acesso Aleatório Frequente

```java
// ✅ ArrayList IDEAL: acesso aleatório
public class AcessoAleatorio {
    public static void main(String[] args) {
        // CENÁRIO: sistema precisa acessar elementos
        // por índice frequentemente
        
        List<String> produtos = new ArrayList<>();
        produtos.add("Notebook");   // 0
        produtos.add("Mouse");      // 1
        produtos.add("Teclado");    // 2
        produtos.add("Monitor");    // 3
        produtos.add("Webcam");     // 4
        
        // ACESSO DIRETO O(1):
        // Cliente solicita produto índice 2
        String produto = produtos.get(2);  // Teclado - instantâneo
        
        // Acesso múltiplo aleatório
        System.out.println(produtos.get(4));  // Webcam
        System.out.println(produtos.get(0));  // Notebook
        System.out.println(produtos.get(3));  // Monitor
        
        // TODOS O(1) - muito rápido
        
        // ArrayList: acesso direto array
        // LinkedList: percorrer lista O(n)
        
        // VANTAGEM ArrayList:
        // Independente posição
        // Mesmo tempo início/meio/fim
        // Ideal quando precisa acesso índice
    }
}

/*
 * QUANDO USAR PARA ACESSO:
 * 
 * ✅ ArrayList:
 * - Acesso frequente por índice
 * - get(i) chamado muitas vezes
 * - Posições aleatórias
 * - Performance crítica acesso
 * 
 * EXEMPLOS:
 * - Sistema de produtos (ID -> índice)
 * - Cache em memória
 * - Tabela de dados
 * - Vetores matemáticos
 */
```

**Acesso aleatório**: ArrayList O(1) get(i) direto. LinkedList O(n) percorrer. Ideal produtos, cache, tabelas.

### 2. Tamanho Dinâmico

```java
// ✅ ArrayList IDEAL: tamanho dinâmico
public class TamanhoDinamico {
    public static void main(String[] args) {
        // CENÁRIO: não sabe quantos elementos terá
        
        // ❌ Array tradicional: tamanho fixo
        String[] arrayFixo = new String[5];
        // Limitado 5 elementos
        // Não pode adicionar mais
        
        // ✅ ArrayList: cresce automaticamente
        List<String> listaDinamica = new ArrayList<>();
        
        // Adicionar quantos quiser
        listaDinamica.add("Item 1");
        listaDinamica.add("Item 2");
        listaDinamica.add("Item 3");
        // ... adicionar 100, 1000, 10000
        
        // ArrayList cresce automático
        // Não precisa gerenciar tamanho
        // Redimensiona transparente
        
        // EXEMPLO REAL:
        // Ler arquivo linha por linha
        // Não sabe quantas linhas
        List<String> linhas = new ArrayList<>();
        // while (temProximaLinha()) {
        //     linhas.add(lerLinha());
        // }
        
        System.out.println("Total linhas: " + listaDinamica.size());
    }
}

/*
 * QUANDO USAR PARA TAMANHO DINÂMICO:
 * 
 * ✅ ArrayList:
 * - Não sabe tamanho inicial
 * - Cresce durante execução
 * - Não quer gerenciar capacidade
 * - Tamanho varia muito
 * 
 * EXEMPLOS:
 * - Ler arquivo (linhas desconhecidas)
 * - Resultados busca (quantidade variável)
 * - Lista compras (usuário adiciona)
 * - Log de eventos
 * 
 * ❌ Array:
 * - Tamanho fixo
 * - Não cresce
 * - Manual recriar
 */
```

**Tamanho dinâmico**: ArrayList cresce automático. Array fixo não cresce. Ideal arquivo, busca, log eventos.

### 3. Adicionar Fim

```java
// ✅ ArrayList IDEAL: adicionar fim
public class AdicionarFim {
    public static void main(String[] args) {
        // CENÁRIO: adicionar elementos fim lista
        
        List<String> tarefas = new ArrayList<>();
        
        // ADICIONAR FIM: O(1) amortizado - muito eficiente
        tarefas.add("Tarefa 1");   // elementData[0]
        tarefas.add("Tarefa 2");   // elementData[1]
        tarefas.add("Tarefa 3");   // elementData[2]
        
        // Cada add() fim:
        // 1. elementData[size++] = elemento
        // 2. Sem deslocamento
        // 3. O(1) maioria das vezes
        // 4. Raramente O(n) expansão
        
        // EXEMPLO REAL:
        // Sistema de fila processamento
        List<String> fila = new ArrayList<>();
        
        for (int i = 0; i < 10000; i++) {
            fila.add("Processo " + i);  // Muito rápido
        }
        
        // 10000 add() fim:
        // ArrayList: ~O(10000) = O(n)
        // LinkedList: ~O(10000) = O(n)
        // Ambos eficientes
        
        // MAS ArrayList:
        // - Cache-friendly (memória contígua)
        // - Menos overhead memória
        // - Acesso posterior O(1)
        
        System.out.println(tarefas);
    }
}

/*
 * QUANDO USAR PARA ADICIONAR FIM:
 * 
 * ✅ ArrayList:
 * - add(elemento) frequente
 * - Sempre adiciona fim
 * - Não adiciona meio/início
 * - Leitura posterior frequente
 * 
 * EXEMPLOS:
 * - Log eventos (append)
 * - Histórico ações
 * - Coletar resultados
 * - Acumular dados
 * 
 * VANTAGENS:
 * - O(1) amortizado
 * - Cache-friendly
 * - Menos memória
 * - Acesso rápido depois
 */
```

**Adicionar fim**: ArrayList O(1) amortizado add(elemento). Sem deslocamento. Cache-friendly. Ideal log, histórico.

### 4. Leitura Dominante

```java
// ✅ ArrayList IDEAL: leitura > escrita
public class LeituraDominante {
    public static void main(String[] args) {
        // CENÁRIO: muito mais leitura que escrita
        
        // CARREGAR DADOS UMA VEZ
        List<String> configuracoes = new ArrayList<>();
        configuracoes.add("config1=valor1");
        configuracoes.add("config2=valor2");
        configuracoes.add("config3=valor3");
        // ... carregar 100 configurações
        
        // LER MUITAS VEZES
        for (int i = 0; i < 1000; i++) {
            // Ler configuração índice 50
            String config = configuracoes.get(50);  // O(1) - instantâneo
            // Processar...
        }
        
        // OPERAÇÕES:
        // Escrita: 100 add() = ~100 operações
        // Leitura: 1000 get() = 1000 * O(1) = muito rápido
        
        // ArrayList IDEAL:
        // - get() O(1) extremamente rápido
        // - Cache-friendly iteração
        // - Baixo overhead memória
        
        // LinkedList PIOR:
        // - get(i) O(n) percorrer
        // - 1000 * O(n) = muito lento
        
        // OUTRO EXEMPLO:
        // Cache em memória
        List<String> cache = new ArrayList<>();
        // Carregar dados
        // ... milhares leituras
        // Raramente modificar
        
        System.out.println(configuracoes.size());
    }
}

/*
 * QUANDO USAR PARA LEITURA DOMINANTE:
 * 
 * ✅ ArrayList:
 * - Muitas leituras
 * - Poucas escritas
 * - get(i) frequente
 * - Iteração frequente
 * - Dados relativamente estáveis
 * 
 * EXEMPLOS:
 * - Configurações sistema
 * - Cache em memória
 * - Tabela lookup
 * - Dados referência
 * - Catálogo produtos
 * 
 * VANTAGENS:
 * - get() O(1)
 * - Iteração cache-friendly
 * - Baixa latência
 * - Alta throughput
 */
```

**Leitura dominante**: ArrayList get() O(1) muito rápido. LinkedList get(i) O(n) lento. Ideal configurações, cache.

### 5. Iteração Sequencial

```java
// ✅ ArrayList IDEAL: iteração sequencial
public class IteracaoSequencial {
    public static void main(String[] args) {
        List<Integer> numeros = new ArrayList<>();
        
        // Adicionar 100000 elementos
        for (int i = 0; i < 100000; i++) {
            numeros.add(i);
        }
        
        // ITERAÇÃO SEQUENCIAL: muito eficiente
        long inicio = System.nanoTime();
        
        for (Integer num : numeros) {
            // Processar elemento
        }
        
        long fim = System.nanoTime();
        System.out.println("Tempo: " + (fim - inicio) + "ns");
        
        // VANTAGEM ArrayList:
        // 
        // CACHE-FRIENDLY:
        // Elementos memória contígua
        // CPU cache carrega blocos
        // Acesso sequencial muito rápido
        // 
        // BAIXO OVERHEAD:
        // Sem ponteiros next/prev
        // Menos saltos memória
        // 
        // LinkedList:
        // Elementos espalhados memória
        // Cache miss frequente
        // Seguir ponteiros lento
        
        // EXEMPLO REAL:
        // Processar todos elementos
        List<String> logs = new ArrayList<>();
        // ... adicionar logs
        
        // Analisar cada log
        for (String log : logs) {
            // Analisar...
        }
        // ArrayList: cache-friendly, rápido
    }
}

/*
 * QUANDO USAR PARA ITERAÇÃO:
 * 
 * ✅ ArrayList:
 * - Percorrer todos elementos
 * - Processamento sequencial
 * - For-each frequente
 * - Ordem importante
 * - Performance iteração crítica
 * 
 * EXEMPLOS:
 * - Processar logs
 * - Análise dados
 * - Relatórios
 * - Transformações
 * - Filtragem
 * 
 * VANTAGENS:
 * - Cache-friendly
 * - Memória contígua
 * - Baixo overhead
 * - Alta velocidade
 */
```

**Iteração**: ArrayList cache-friendly memória contígua rápido. LinkedList ponteiros cache miss lento. Ideal processar logs.

### 6. Modificação Elementos

```java
// ✅ ArrayList IDEAL: modificar elementos
public class ModificacaoElementos {
    public static void main(String[] args) {
        List<String> tarefas = new ArrayList<>(Arrays.asList(
            "Tarefa A - Pendente",
            "Tarefa B - Pendente",
            "Tarefa C - Pendente"
        ));
        
        // MODIFICAR ELEMENTO: set() O(1)
        tarefas.set(1, "Tarefa B - Concluída");  // Direto
        
        // IMPLEMENTAÇÃO set():
        // public E set(int index, E element) {
        //     E oldValue = (E) elementData[index];
        //     elementData[index] = element;
        //     return oldValue;
        // }
        
        // O(1) - acesso direto array
        // Sem deslocamento
        // Muito rápido
        
        // EXEMPLO REAL:
        // Sistema de status
        List<String> pedidos = new ArrayList<>();
        pedidos.add("Pedido 1 - Processando");
        pedidos.add("Pedido 2 - Processando");
        
        // Atualizar status pedido índice 0
        pedidos.set(0, "Pedido 1 - Enviado");  // O(1)
        
        // VANTAGEM ArrayList:
        // Modificação in-place
        // O(1) constante
        // Estrutura mantém
        
        System.out.println(tarefas);
    }
}

/*
 * QUANDO USAR PARA MODIFICAÇÃO:
 * 
 * ✅ ArrayList:
 * - set(i, elemento) frequente
 * - Atualizar valores
 * - Substituir elementos
 * - Manter estrutura
 * 
 * EXEMPLOS:
 * - Atualizar status
 * - Modificar valores
 * - Flags/sinalizadores
 * - Estados objetos
 * 
 * VANTAGENS:
 * - set() O(1)
 * - In-place
 * - Sem realocação
 */
```

**Modificação**: ArrayList set(i, elemento) O(1) direto. In-place sem realocação. Ideal atualizar status.

### 7. Tamanho Conhecido Estimado

```java
// ✅ ArrayList IDEAL: tamanho conhecido
public class TamanhoConhecido {
    public static void main(String[] args) {
        // CENÁRIO: sabe aproximadamente quantos elementos
        
        // ✅ Especificar capacidade inicial
        List<String> alunos = new ArrayList<>(30);
        // Evita expansões
        // Melhor performance
        
        // Adicionar ~30 alunos
        for (int i = 1; i <= 30; i++) {
            alunos.add("Aluno " + i);  // Sem expansão
        }
        
        // VANTAGEM:
        // Zero expansões
        // Sem cópias array
        // Muito mais rápido
        
        // COMPARAÇÃO:
        
        // Sem capacidade inicial:
        List<Integer> lista1 = new ArrayList<>();  // capacity 10
        for (int i = 0; i < 1000; i++) {
            lista1.add(i);
        }
        // ~10 expansões
        // Múltiplas cópias
        
        // Com capacidade inicial:
        List<Integer> lista2 = new ArrayList<>(1000);
        for (int i = 0; i < 1000; i++) {
            lista2.add(i);
        }
        // Zero expansões
        // Sem cópias
        // Muito mais rápido
        
        System.out.println("Alunos: " + alunos.size());
    }
}

/*
 * QUANDO USAR COM CAPACIDADE INICIAL:
 * 
 * ✅ ArrayList:
 * - Sabe tamanho aproximado
 * - Performance crítica
 * - Adicionar muitos elementos
 * - Evitar expansões
 * 
 * EXEMPLOS:
 * - Turma 30 alunos
 * - Processar arquivo conhecido
 * - Resultados paginados (página 100 itens)
 * - Batch processing
 * 
 * VANTAGENS:
 * - Zero expansões
 * - Melhor performance
 * - Menos realocações
 * - Menos desperdício inicial
 */
```

**Tamanho conhecido**: new ArrayList(capacidade) evita expansões. Zero cópias muito rápido. Ideal turma, arquivo.

### 8. Não Usar ArrayList

```java
// ❌ ArrayList NÃO IDEAL
public class NaoUsarArrayList {
    public static void main(String[] args) {
        // ❌ 1. INSERÇÃO/REMOÇÃO INÍCIO FREQUENTE
        List<String> fila = new ArrayList<>();
        
        // Inserção início: O(n) - LENTO
        for (int i = 0; i < 1000; i++) {
            fila.add(0, "Elemento " + i);  // Desloca todos
        }
        // Total: O(n²) - MUITO LENTO
        
        // ✅ USAR LinkedList:
        List<String> filaLinked = new LinkedList<>();
        for (int i = 0; i < 1000; i++) {
            filaLinked.add(0, "Elemento " + i);  // O(1)
        }
        
        // ❌ 2. BUSCA FREQUENTE
        List<String> lista = new ArrayList<>();
        // ... adicionar 10000 elementos
        
        // contains(): O(n) - LENTO
        for (int i = 0; i < 1000; i++) {
            lista.contains("Elemento X");  // Percorre todos
        }
        // Total: O(n * m) - MUITO LENTO
        
        // ✅ USAR Set:
        Set<String> conjunto = new HashSet<>();
        for (int i = 0; i < 1000; i++) {
            conjunto.contains("Elemento X");  // O(1)
        }
        
        // ❌ 3. INSERÇÃO MEIO FREQUENTE
        List<String> lista2 = new ArrayList<>();
        // ... elementos
        
        for (int i = 0; i < 500; i++) {
            lista2.add(lista2.size() / 2, "Meio");  // O(n)
        }
        // Total: O(n²)
        
        // ✅ USAR LinkedList:
        List<String> lista2Linked = new LinkedList<>();
        // Melhor para inserções meio
        
        System.out.println(fila.size());
    }
}

/*
 * QUANDO NÃO USAR ArrayList:
 * 
 * ❌ Inserção/remoção início/meio frequente:
 * ArrayList: O(n) desloca
 * Usar: LinkedList O(1)
 * 
 * ❌ Busca elemento frequente:
 * ArrayList: contains() O(n)
 * Usar: HashSet O(1)
 * 
 * ❌ Fila/Pilha operações específicas:
 * ArrayList: ineficiente
 * Usar: ArrayDeque, LinkedList
 * 
 * ❌ Acesso somente início/fim:
 * ArrayList: desperdício
 * Usar: Deque
 * 
 * ❌ Necessita ordenação automática:
 * ArrayList: manual sort()
 * Usar: TreeSet
 */
```

**Não usar**: inserção início/meio O(n), busca O(n), fila/pilha. Usar LinkedList, HashSet, ArrayDeque, TreeSet.

---

## Aplicabilidade

**ArrayList ideal**:
- **Acesso** aleatório índice frequente O(1)
- **Tamanho** dinâmico cresce automático
- **Adicionar** fim O(1) amortizado
- **Leitura** dominante > escrita
- **Iteração** sequencial cache-friendly
- **Modificação** set() in-place O(1)
- **Tamanho** conhecido especificar capacidade

**ArrayList não ideal**:
- **Inserção/remoção** início/meio frequente O(n) → LinkedList
- **Busca** elemento frequente O(n) → HashSet
- **Fila/pilha** operações específicas → ArrayDeque
- **Ordenação** automática → TreeSet

---

## Armadilhas

### 1. Inserção Início Loop

```java
// ❌ O(n²) muito lento
for (int i = 0; i < n; i++) {
    lista.add(0, elemento);
}

// ✅ LinkedList ou adicionar fim + reverse
```

### 2. Busca Loop

```java
// ❌ O(n * m) lento
for (String s : buscar) {
    lista.contains(s);  // O(n)
}

// ✅ Converter Set
Set<String> set = new HashSet<>(lista);
```

### 3. Usar Sem Capacidade

```java
// ❌ Múltiplas expansões
List<Integer> lista = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    lista.add(i);
}

// ✅ Especificar capacidade
List<Integer> lista = new ArrayList<>(10000);
```

---

## Boas Práticas

### 1. Especificar Capacidade Conhecida

```java
// ✅ Evita expansões
List<String> lista = new ArrayList<>(tamanhoConhecido);
```

### 2. Adicionar Fim

```java
// ✅ O(1) amortizado
lista.add(elemento);

// ❌ Evitar início
lista.add(0, elemento);  // O(n)
```

### 3. LinkedList Inserção Frequente

```java
// Inserção/remoção meio/início frequente
List<String> lista = new LinkedList<>();
```

### 4. HashSet Busca Frequente

```java
// Busca contains() frequente
Set<String> conjunto = new HashSet<>();
```

---

## Resumo

**ArrayList ideal**:
- **Acesso aleatório**: get(i) O(1) direto muito rápido
- **Tamanho dinâmico**: cresce automático redimensiona
- **Adicionar fim**: add(elemento) O(1) amortizado sem deslocamento
- **Leitura dominante**: muitas leituras poucas escritas get() rápido
- **Iteração sequencial**: cache-friendly memória contígua rápido
- **Modificação**: set(i, elemento) O(1) in-place
- **Tamanho conhecido**: new ArrayList(capacidade) evita expansões

**ArrayList não ideal**:
- **Inserção início/meio**: O(n) desloca usar LinkedList
- **Busca frequente**: contains() O(n) usar HashSet O(1)
- **Fila/pilha**: operações específicas usar ArrayDeque
- **Ordenação**: automática usar TreeSet

**Casos uso**:
- **Produtos**: acesso índice direto catálogo
- **Configurações**: carregar leitura frequente modificar raro
- **Cache**: memória leitura rápida get() O(1)
- **Log eventos**: adicionar fim append histórico
- **Processar arquivo**: tamanho conhecido iteração
- **Tabelas dados**: acesso aleatório modificar set()

**Alternativas**:
- **LinkedList**: inserção remoção início/meio O(1)
- **HashSet**: busca contains() O(1) sem duplicatas
- **TreeSet**: ordenação automática sorted
- **ArrayDeque**: fila pilha addFirst addLast

**Regra de Ouro**: ArrayList IDEAL acesso aleatório índice get(i) O1 muito rápido adicionar fim add O1 amortizado leitura dominante muitas leituras poucas escritas iteração sequencial cache-friendly memória contígua modificação set O1 in-place tamanho dinâmico cresce automático conhecido especificar capacidade evita expansões. NÃO IDEAL inserção remoção início meio frequente On desloca usar LinkedList O1 busca frequente contains On usar HashSet O1 fila pilha usar ArrayDeque. SEMPRE preferir quando acesso índice frequente adicionar fim leitura iteração. EVITAR quando inserção meio busca usar estruturas específicas. ESPECIFICAR capacidade inicial quando conhecido evita expansões melhor performance.

