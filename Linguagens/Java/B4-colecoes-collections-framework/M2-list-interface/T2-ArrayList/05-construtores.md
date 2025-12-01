# T2.05 - Construtores

## Introdução

**Construtores ArrayList**: vazio padrão 10, capacidade inicial customizada, coleção copia elementos.

```java
import java.util.*;

// CONSTRUTORES ArrayList
public class ConstrutoresArrayList {
    public static void main(String[] args) {
        // 1. CONSTRUTOR VAZIO: capacidade padrão 10
        List<String> lista1 = new ArrayList<>();
        // Inicia vazio size=0, capacity=10
        
        // 2. CONSTRUTOR CAPACIDADE: customizada
        List<String> lista2 = new ArrayList<>(100);
        // Inicia vazio size=0, capacity=100
        // Evita expansões
        
        // 3. CONSTRUTOR COLEÇÃO: copia elementos
        List<String> original = Arrays.asList("A", "B", "C");
        List<String> lista3 = new ArrayList<>(original);
        // Copia elementos: size=3, capacity=3
        
        // DEMONSTRAÇÃO:
        lista1.add("Item 1");           // Usa capacity 10
        lista2.add("Item 2");           // Usa capacity 100
        System.out.println(lista3);     // [A, B, C]
    }
}
```

**Construtores**: vazio ArrayList() padrão 10, ArrayList(capacidade) customizada evita expansões, ArrayList(coleção) copia.

---

## Fundamentos

### 1. Construtor Vazio

```java
// 1. CONSTRUTOR VAZIO: new ArrayList<>()
public class ConstrutorVazio {
    public static void main(String[] args) {
        // SINTAXE:
        List<String> lista = new ArrayList<>();
        
        // ESTADO INICIAL:
        // size = 0 (vazio)
        // capacity = 10 (DEFAULT_CAPACITY)
        // elementData = array vazio especial
        
        System.out.println("Size: " + lista.size());        // 0
        System.out.println("Vazio: " + lista.isEmpty());    // true
        
        // LAZY INITIALIZATION:
        // Array NÃO criado imediatamente
        // Criado no primeiro add()
        // Economiza memória listas não usadas
        
        // PRIMEIRA ADIÇÃO:
        lista.add("Primeiro");
        // Agora capacity = 10
        // elementData = new Object[10]
        // size = 1
        
        // EXPANSÃO:
        // 11º elemento: capacity 10 -> 15
        for (int i = 2; i <= 11; i++) {
            lista.add("Elemento " + i);
        }
        // capacity agora 15
        
        // QUANDO USAR:
        // - Não sabe tamanho
        // - Poucos elementos (<10)
        // - Tamanho muito variável
        // - Padrão mais comum
        
        System.out.println(lista);
    }
}

/*
 * CONSTRUTOR VAZIO:
 * 
 * ASSINATURA:
 * public ArrayList()
 * 
 * ESTADO INICIAL:
 * size = 0
 * capacity = 10 (DEFAULT_CAPACITY)
 * elementData = EMPTY_ELEMENTDATA
 * 
 * LAZY INITIALIZATION:
 * Array criado primeiro add()
 * Economiza memória
 * 
 * PRIMEIRA ADIÇÃO:
 * elementData = new Object[10]
 * 
 * CAPACIDADE PADRÃO:
 * 10 elementos
 * Balanço memória/expansões
 * 
 * USO:
 * Tamanho desconhecido
 * Poucos elementos
 * Padrão comum
 */
```

**Vazio**: new ArrayList<>() size 0 capacity 10. Lazy initialization array criado primeiro add(). Padrão comum.

### 2. Construtor Capacidade Inicial

```java
// 2. CONSTRUTOR CAPACIDADE: new ArrayList<>(capacidade)
public class ConstrutorCapacidade {
    public static void main(String[] args) {
        // SINTAXE:
        List<String> lista = new ArrayList<>(100);
        
        // ESTADO INICIAL:
        // size = 0 (vazio)
        // capacity = 100 (especificado)
        // elementData = new Object[100]
        
        System.out.println("Size: " + lista.size());        // 0
        System.out.println("Vazio: " + lista.isEmpty());    // true
        
        // VANTAGEM:
        // Evita expansões se adicionar <= 100
        
        // ADICIONAR 100 ELEMENTOS:
        for (int i = 0; i < 100; i++) {
            lista.add("Elemento " + i);
        }
        // ZERO expansões
        // Muito mais rápido
        // Sem cópias array
        
        // COMPARAÇÃO:
        
        // Sem capacidade inicial:
        List<Integer> lista1 = new ArrayList<>();
        long inicio1 = System.nanoTime();
        for (int i = 0; i < 100_000; i++) {
            lista1.add(i);
        }
        long fim1 = System.nanoTime();
        System.out.println("Sem capacidade: " + (fim1 - inicio1) + "ns");
        // ~20 expansões, múltiplas cópias
        
        // Com capacidade inicial:
        List<Integer> lista2 = new ArrayList<>(100_000);
        long inicio2 = System.nanoTime();
        for (int i = 0; i < 100_000; i++) {
            lista2.add(i);
        }
        long fim2 = System.nanoTime();
        System.out.println("Com capacidade: " + (fim2 - inicio2) + "ns");
        // Zero expansões, sem cópias
        
        // Com capacidade MUITO MAIS RÁPIDO
        
        // QUANDO USAR:
        // - Sabe tamanho aproximado
        // - Adicionar muitos elementos
        // - Performance crítica
        // - Evitar expansões
        
        System.out.println(lista.size());
    }
}

/*
 * CONSTRUTOR CAPACIDADE:
 * 
 * ASSINATURA:
 * public ArrayList(int initialCapacity)
 * 
 * PARÂMETRO:
 * initialCapacity: tamanho inicial array
 * 
 * ESTADO INICIAL:
 * size = 0
 * capacity = initialCapacity
 * elementData = new Object[initialCapacity]
 * 
 * EXCEÇÃO:
 * IllegalArgumentException se capacity < 0
 * 
 * VANTAGEM:
 * Zero expansões se add <= capacity
 * Melhor performance
 * Sem cópias array
 * 
 * USO:
 * Tamanho conhecido/estimado
 * Adicionar muitos elementos
 * Performance importante
 * 
 * EXEMPLO:
 * new ArrayList<>(1000)  // 1000 elementos
 */
```

**Capacidade**: new ArrayList<>(capacidade) size 0 capacity especificada. Zero expansões se add <= capacidade. Muito rápido.

### 3. Construtor Coleção

```java
// 3. CONSTRUTOR COLEÇÃO: new ArrayList<>(coleção)
public class ConstrutorColecao {
    public static void main(String[] args) {
        // CRIAR COLEÇÃO ORIGINAL:
        List<String> original = Arrays.asList("A", "B", "C", "D", "E");
        
        // SINTAXE:
        List<String> copia = new ArrayList<>(original);
        
        // ESTADO INICIAL:
        // size = 5 (tamanho original)
        // capacity = 5 (tamanho original)
        // elementData = cópia elementos
        
        System.out.println("Cópia: " + copia);              // [A, B, C, D, E]
        System.out.println("Size: " + copia.size());        // 5
        
        // INDEPENDÊNCIA:
        // Modificar cópia NÃO afeta original
        copia.add("F");
        copia.set(0, "Z");
        
        System.out.println("Original: " + original);        // [A, B, C, D, E]
        System.out.println("Cópia: " + copia);              // [Z, B, C, D, E, F]
        
        // CÓPIA RASA (SHALLOW COPY):
        // Elementos NÃO copiados
        // Referências copiadas
        
        class Pessoa {
            String nome;
            Pessoa(String nome) { this.nome = nome; }
            public String toString() { return nome; }
        }
        
        List<Pessoa> pessoas1 = new ArrayList<>();
        pessoas1.add(new Pessoa("Ana"));
        
        List<Pessoa> pessoas2 = new ArrayList<>(pessoas1);
        
        // Modificar OBJETO afeta ambas
        pessoas2.get(0).nome = "Bruno";
        
        System.out.println("pessoas1: " + pessoas1);  // [Bruno]
        System.out.println("pessoas2: " + pessoas2);  // [Bruno]
        // MESMO objeto
        
        // QUANDO USAR:
        // - Converter coleção -> ArrayList
        // - Criar cópia modificável
        // - Inicializar com dados existentes
        // - Combinar coleções
        
        // CONVERSÕES:
        
        // Set -> ArrayList
        Set<String> conjunto = new HashSet<>(Arrays.asList("X", "Y", "Z"));
        List<String> listaSet = new ArrayList<>(conjunto);
        
        // Array -> ArrayList
        String[] array = {"M", "N", "O"};
        List<String> listaArray = new ArrayList<>(Arrays.asList(array));
        
        // LinkedList -> ArrayList
        List<String> linked = new LinkedList<>(Arrays.asList("P", "Q"));
        List<String> arrayList = new ArrayList<>(linked);
        
        System.out.println(listaSet);
    }
}

/*
 * CONSTRUTOR COLEÇÃO:
 * 
 * ASSINATURA:
 * public ArrayList(Collection<? extends E> c)
 * 
 * PARÂMETRO:
 * c: coleção copiar
 * 
 * ESTADO INICIAL:
 * size = c.size()
 * capacity = c.size()
 * elementData = array elementos copiados
 * 
 * PROCESSO:
 * 1. Converter coleção array: c.toArray()
 * 2. Copiar elementos
 * 3. Definir size e capacity
 * 
 * CÓPIA RASA:
 * Elementos não duplicados
 * Referências copiadas
 * Modificar objeto afeta ambas
 * 
 * INDEPENDÊNCIA ESTRUTURAL:
 * Modificar estrutura (add/remove) não afeta
 * 
 * USO:
 * Converter coleção
 * Criar cópia
 * Inicializar dados
 * 
 * EXCEÇÃO:
 * NullPointerException se c == null
 */
```

**Coleção**: new ArrayList<>(coleção) copia elementos size e capacity igual coleção. Cópia rasa referências objetos.

### 4. Capacidade Zero

```java
// CAPACIDADE ZERO: new ArrayList<>(0)
public class CapacidadeZero {
    public static void main(String[] args) {
        // SINTAXE:
        List<String> lista = new ArrayList<>(0);
        
        // ESTADO INICIAL:
        // size = 0
        // capacity = 0
        // elementData = EMPTY_ELEMENTDATA
        
        System.out.println("Vazio: " + lista.isEmpty());    // true
        
        // PRIMEIRA ADIÇÃO:
        lista.add("Primeiro");
        // capacity 0 -> 10 (DEFAULT_CAPACITY)
        // Expande para padrão
        
        // QUANDO USAR:
        // - Lista possivelmente vazia
        // - Economizar memória máxima
        // - Placeholder
        
        // EXEMPLO:
        // Pode ou não adicionar elementos
        List<String> opcoes = new ArrayList<>(0);
        
        boolean temOpcoes = false;  // Configuração
        if (temOpcoes) {
            opcoes.add("Opção 1");
            opcoes.add("Opção 2");
        }
        // Lista fica vazia capacity 0
        // Sem desperdício memória
        
        System.out.println(lista);
    }
}

/*
 * CAPACIDADE ZERO:
 * 
 * SINTAXE:
 * new ArrayList<>(0)
 * 
 * ESTADO:
 * size = 0
 * capacity = 0
 * elementData = EMPTY_ELEMENTDATA
 * 
 * PRIMEIRA ADIÇÃO:
 * Expande para DEFAULT_CAPACITY (10)
 * 
 * USO:
 * Lista possivelmente vazia
 * Economizar memória
 * Placeholder
 * 
 * RARO:
 * Pouco usado prática
 * Construtor vazio mais comum
 */
```

**Capacidade zero**: new ArrayList<>(0) capacity 0 primeira adição expande 10. Economiza memória placeholder raro.

### 5. Validação Capacidade

```java
// VALIDAÇÃO CAPACIDADE
public class ValidacaoCapacidade {
    public static void main(String[] args) {
        // CAPACIDADE VÁLIDA: >= 0
        
        // ✅ VÁLIDO:
        List<String> lista1 = new ArrayList<>(0);        // OK
        List<String> lista2 = new ArrayList<>(10);       // OK
        List<String> lista3 = new ArrayList<>(1000);     // OK
        
        // ❌ INVÁLIDO: < 0
        try {
            List<String> listaInvalida = new ArrayList<>(-1);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
            // "Illegal Capacity: -1"
        }
        
        // IMPLEMENTAÇÃO:
        // public ArrayList(int initialCapacity) {
        //     if (initialCapacity > 0) {
        //         this.elementData = new Object[initialCapacity];
        //     } else if (initialCapacity == 0) {
        //         this.elementData = EMPTY_ELEMENTDATA;
        //     } else {
        //         throw new IllegalArgumentException(
        //             "Illegal Capacity: " + initialCapacity);
        //     }
        // }
        
        // VALIDAÇÃO NECESSÁRIA:
        int capacidade = obterCapacidade();  // Pode ser negativo
        
        if (capacidade < 0) {
            capacidade = 10;  // Padrão
        }
        
        List<String> lista = new ArrayList<>(capacidade);
        
        System.out.println("Criado com capacidade: " + capacidade);
    }
    
    static int obterCapacidade() {
        return -5;  // Simulação
    }
}

/*
 * VALIDAÇÃO:
 * 
 * CAPACIDADE VÁLIDA:
 * >= 0
 * 
 * CAPACIDADE INVÁLIDA:
 * < 0
 * Lança IllegalArgumentException
 * 
 * VERIFICAÇÃO:
 * if (capacidade < 0)
 *     throw new IllegalArgumentException(...)
 * 
 * BOA PRÁTICA:
 * Validar antes criar
 * Usar valor padrão se inválido
 */
```

**Validação**: capacidade >= 0 válida. < 0 IllegalArgumentException. Validar antes criar usar padrão inválido.

### 6. Coleção Null

```java
// COLEÇÃO NULL
public class ColecaoNull {
    public static void main(String[] args) {
        // ❌ COLEÇÃO NULL: exceção
        
        try {
            List<String> colecaoNull = null;
            List<String> lista = new ArrayList<>(colecaoNull);
        } catch (NullPointerException e) {
            System.out.println("Erro: coleção null");
        }
        
        // IMPLEMENTAÇÃO:
        // public ArrayList(Collection<? extends E> c) {
        //     Object[] a = c.toArray();  // c.toArray() -> NPE se c == null
        //     ...
        // }
        
        // VALIDAÇÃO NECESSÁRIA:
        List<String> origem = obterColecao();  // Pode retornar null
        
        List<String> destino;
        if (origem != null) {
            destino = new ArrayList<>(origem);
        } else {
            destino = new ArrayList<>();  // Vazio
        }
        
        // OU:
        List<String> destino2 = new ArrayList<>(
            origem != null ? origem : Collections.emptyList()
        );
        
        System.out.println(destino);
    }
    
    static List<String> obterColecao() {
        return null;  // Simulação
    }
}

/*
 * COLEÇÃO NULL:
 * 
 * COMPORTAMENTO:
 * new ArrayList<>(null)
 * Lança NullPointerException
 * 
 * MOTIVO:
 * c.toArray() chamado sem verificação
 * 
 * BOA PRÁTICA:
 * Verificar null antes
 * Usar coleção vazia alternativa
 * 
 * EXEMPLO:
 * if (c != null)
 *     new ArrayList<>(c)
 * else
 *     new ArrayList<>()
 */
```

**Coleção null**: new ArrayList<>(null) NullPointerException. Verificar null antes usar vazio alternativa.

### 7. Inicialização Inline

```java
// INICIALIZAÇÃO INLINE
public class InicializacaoInline {
    public static void main(String[] args) {
        // 1. Arrays.asList() + construtor
        List<String> lista1 = new ArrayList<>(
            Arrays.asList("A", "B", "C")
        );
        
        // 2. List.of() + construtor (Java 9+)
        List<String> lista2 = new ArrayList<>(
            List.of("X", "Y", "Z")
        );
        
        // 3. Double brace initialization (NÃO RECOMENDADO)
        List<String> lista3 = new ArrayList<>() {{
            add("M");
            add("N");
            add("O");
        }};
        // Cria classe anônima
        // Overhead desnecessário
        // EVITAR
        
        // 4. Stream + collect (Java 8+)
        List<String> lista4 = Stream.of("P", "Q", "R")
            .collect(Collectors.toCollection(ArrayList::new));
        
        // ✅ RECOMENDADO:
        // Arrays.asList() ou List.of()
        
        // Arrays.asList():
        // - Retorna lista fixa tamanho
        // - Pode modificar elementos
        // - NÃO pode add/remove
        
        // List.of():
        // - Imutável completa
        // - NÃO pode modificar
        // - NÃO aceita null
        
        // CONVERTER ArrayList:
        List<String> mutavel = new ArrayList<>(List.of("A", "B"));
        mutavel.add("C");  // OK
        mutavel.remove(0);  // OK
        
        System.out.println(lista1);
    }
}

/*
 * INICIALIZAÇÃO:
 * 
 * ARRAYS.ASLIST:
 * new ArrayList<>(Arrays.asList(...))
 * ✅ Recomendado
 * Modificável
 * 
 * LIST.OF:
 * new ArrayList<>(List.of(...))
 * ✅ Recomendado Java 9+
 * Imutável original
 * 
 * DOUBLE BRACE:
 * new ArrayList<>() {{ add(...); }}
 * ❌ Não recomendado
 * Cria classe anônima
 * Overhead
 * 
 * STREAM:
 * Stream.of(...).collect(...)
 * ✅ OK para processamento
 * Verbose inicialização simples
 */
```

**Inicialização**: Arrays.asList() ou List.of() + construtor recomendado. Double brace overhead evitar.

### 8. Resumo Construtores

```java
/*
 * CONSTRUTORES ARRAYLIST
 * 
 * 1. VAZIO:
 * new ArrayList<>()
 * size = 0, capacity = 10
 * Lazy initialization
 * Uso: tamanho desconhecido
 * 
 * 2. CAPACIDADE:
 * new ArrayList<>(capacidade)
 * size = 0, capacity = capacidade
 * Evita expansões
 * Uso: tamanho conhecido
 * 
 * 3. COLEÇÃO:
 * new ArrayList<>(coleção)
 * size = c.size(), capacity = c.size()
 * Copia elementos
 * Uso: converter coleção
 * 
 * VALIDAÇÃO:
 * Capacidade >= 0, senão IllegalArgumentException
 * Coleção != null, senão NullPointerException
 * 
 * QUANDO USAR:
 * 
 * VAZIO:
 * - Tamanho desconhecido
 * - Poucos elementos
 * - Padrão comum
 * 
 * CAPACIDADE:
 * - Tamanho conhecido
 * - Adicionar muitos
 * - Performance crítica
 * 
 * COLEÇÃO:
 * - Converter coleção
 * - Criar cópia
 * - Inicializar dados
 * 
 * PERFORMANCE:
 * Sem capacidade: ~20 expansões 100k elementos
 * Com capacidade: zero expansões
 * Muito mais rápido
 */

// EXEMPLO COMPLETO
public class ExemploConstrutores {
    public static void main(String[] args) {
        // Vazio: tamanho desconhecido
        List<String> lista1 = new ArrayList<>();
        
        // Capacidade: 1000 elementos
        List<Integer> lista2 = new ArrayList<>(1000);
        
        // Coleção: converter
        Set<String> conjunto = new HashSet<>(Arrays.asList("A", "B", "C"));
        List<String> lista3 = new ArrayList<>(conjunto);
        
        // Inicialização
        List<String> lista4 = new ArrayList<>(List.of("X", "Y", "Z"));
        
        System.out.println(lista3);
    }
}
```

---

## Aplicabilidade

**Construtor vazio**:
- Tamanho desconhecido
- Poucos elementos
- Padrão comum

**Construtor capacidade**:
- Tamanho conhecido estimado
- Adicionar muitos elementos
- Performance crítica evitar expansões

**Construtor coleção**:
- Converter coleção ArrayList
- Criar cópia modificável
- Inicializar dados existentes

---

## Armadilhas

### 1. Capacidade Negativa

```java
// ❌ IllegalArgumentException
List<String> lista = new ArrayList<>(-1);

// ✅ Validar antes
if (capacidade >= 0) {
    lista = new ArrayList<>(capacidade);
}
```

### 2. Coleção Null

```java
// ❌ NullPointerException
List<String> lista = new ArrayList<>(null);

// ✅ Verificar null
if (colecao != null) {
    lista = new ArrayList<>(colecao);
}
```

### 3. Confundir Capacidade Size

```java
// ❌ NÃO adiciona elementos
List<String> lista = new ArrayList<>(10);
// size = 0, capacity = 10

// ✅ Inicializar elementos
List<String> lista = new ArrayList<>(List.of("A", "B", "C"));
// size = 3
```

---

## Boas Práticas

### 1. Especificar Capacidade Conhecida

```java
// ✅ Evita expansões
List<String> alunos = new ArrayList<>(30);
```

### 2. Inicializar Com Dados

```java
// ✅ Arrays.asList ou List.of
List<String> lista = new ArrayList<>(List.of("A", "B", "C"));
```

### 3. Validar Parâmetros

```java
// ✅ Verificar null e negativo
if (colecao != null && capacidade >= 0) {
    // OK
}
```

---

## Resumo

**Construtores**:
- **Vazio**: new ArrayList<>() size 0 capacity 10 lazy initialization primeiro add() cria array padrão tamanho desconhecido
- **Capacidade**: new ArrayList<>(capacidade) size 0 capacity especificada evita expansões zero cópias muito rápido conhecido
- **Coleção**: new ArrayList<>(coleção) copia elementos size e capacity igual coleção cópia rasa referências converter

**Validação**:
- **Capacidade negativa**: < 0 IllegalArgumentException validar antes >= 0
- **Coleção null**: NullPointerException verificar null antes usar vazio alternativa

**Performance**:
- **Sem capacidade**: 100k elementos ~20 expansões múltiplas cópias lento
- **Com capacidade**: 100k elementos zero expansões sem cópias muito rápido
- **Diferença**: significativa muitos elementos especificar sempre conhecido

**Quando usar**:
- **Vazio**: tamanho desconhecido poucos elementos padrão comum maioria casos
- **Capacidade**: tamanho conhecido estimado adicionar muitos performance crítica evitar expansões
- **Coleção**: converter coleção ArrayList criar cópia modificável inicializar dados existentes

**Inicialização**:
- **Arrays.asList**: new ArrayList<>(Arrays.asList(...)) modificável recomendado
- **List.of**: new ArrayList<>(List.of(...)) Java 9+ imutável original converter modificável
- **Double brace**: new ArrayList<>() {{ add() }} overhead classe anônima evitar

**Regra de Ouro**: Construtor VAZIO new ArrayList padrão size 0 capacity 10 lazy initialization tamanho desconhecido comum. CAPACIDADE new ArrayList capacidade especificada evita expansões zero cópias muito rápido tamanho conhecido estimado adicionar muitos performance crítica. COLEÇÃO new ArrayList coleção copia elementos converter criar cópia inicializar. VALIDAR capacidade maior igual 0 negativo IllegalArgumentException coleção null NullPointerException verificar antes. ESPECIFICAR capacidade inicial SEMPRE conhecido evita expansões melhor performance. INICIALIZAR Arrays.asList List.of recomendado double brace evitar overhead.

