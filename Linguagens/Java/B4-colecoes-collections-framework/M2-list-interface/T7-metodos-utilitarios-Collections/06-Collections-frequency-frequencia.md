# T7.06 - Collections.frequency(): Contagem de Elementos

## Introdução

**Collections.frequency()**: conta ocorrências elemento Collection O(n) percorre todos equals verificação útil estatísticas duplicatas.

```java
import java.util.*;

public class FrequencyIntro {
    public static void main(String[] args) {
        List<String> frutas = Arrays.asList("maçã", "banana", "maçã", "laranja", "maçã");
        
        int count = Collections.frequency(frutas, "maçã");
        
        System.out.println("Lista: " + frutas);
        System.out.println("Frequência 'maçã': " + count);  // 3
        
        System.out.println("\n=== Resumo ===");
        System.out.println("frequency: conta ocorrências");
        System.out.println("Usa: equals()");
        System.out.println("O(n): percorre todos");
    }
}
```

**frequency**: conta ocorrências O(n) equals percorre todos retorna int quantidade.

---

## Fundamentos

### 1. Frequency Básico

```java
public class FrequencyBasico {
    public static void main(String[] args) {
        // NÚMEROS:
        
        List<Integer> nums = Arrays.asList(1, 2, 3, 2, 4, 2, 5, 2);
        
        System.out.println("=== Números ===");
        System.out.println("Lista: " + nums);
        System.out.println("Freq 2: " + Collections.frequency(nums, 2));  // 4
        System.out.println("Freq 5: " + Collections.frequency(nums, 5));  // 1
        System.out.println("Freq 9: " + Collections.frequency(nums, 9));  // 0
        
        
        // STRINGS:
        
        List<String> palavras = Arrays.asList("java", "python", "java", "c++", "java");
        
        System.out.println("\n=== Strings ===");
        System.out.println("Lista: " + palavras);
        System.out.println("Freq 'java': " + Collections.frequency(palavras, "java"));  // 3
        System.out.println("Freq 'python': " + Collections.frequency(palavras, "python"));  // 1
        
        
        // OBJETOS:
        
        class Cor {
            String nome;
            Cor(String n) { nome = n; }
            
            public boolean equals(Object o) {
                if (!(o instanceof Cor)) return false;
                return this.nome.equals(((Cor)o).nome);
            }
            
            public int hashCode() { return nome.hashCode(); }
        }
        
        List<Cor> cores = Arrays.asList(
            new Cor("vermelho"),
            new Cor("azul"),
            new Cor("vermelho"),
            new Cor("verde"),
            new Cor("vermelho")
        );
        
        System.out.println("\n=== Objetos ===");
        System.out.println("Freq vermelho: " + Collections.frequency(cores, new Cor("vermelho")));  // 3
        
        
        // ALGORITMO:
        /*
         * int frequency(Collection c, Object o) {
         *     int result = 0;
         *     for (Object e : c) {
         *         if (o == null ? e == null : o.equals(e))
         *             result++;
         *     }
         *     return result;
         * }
         */
        
        System.out.println("\n=== Resumo ===");
        System.out.println("O(n): percorre uma vez");
        System.out.println("Usa: equals()");
        System.out.println("Null-safe: permite null");
    }
}
```

**Básico**: conta ocorrências Integer String Object equals O(n) percorre null-safe permite null retorna 0 ausente.

### 2. Contagem Múltipla

```java
public class FrequencyMultipla {
    public static void main(String[] args) {
        // CONTAR TODOS DISTINTOS:
        
        List<String> votos = Arrays.asList(
            "A", "B", "A", "C", "B", "A", "D", "B", "A"
        );
        
        System.out.println("=== Votos ===");
        System.out.println("Total: " + votos.size());
        
        Set<String> opcoes = new HashSet<>(votos);  // Distintos
        
        for (String opcao : opcoes) {
            int freq = Collections.frequency(votos, opcao);
            System.out.println(opcao + ": " + freq + " votos");
        }
        
        
        // MAPA FREQUÊNCIA:
        
        Map<String, Integer> frequencias = new HashMap<>();
        for (String voto : votos) {
            frequencias.put(voto, frequencias.getOrDefault(voto, 0) + 1);
        }
        
        System.out.println("\n=== Mapa ===");
        System.out.println(frequencias);
        
        
        // ELEMENTO MAIS FREQUENTE:
        
        String maisFrequente = null;
        int maxFreq = 0;
        
        for (String opcao : opcoes) {
            int freq = Collections.frequency(votos, opcao);
            if (freq > maxFreq) {
                maxFreq = freq;
                maisFrequente = opcao;
            }
        }
        
        System.out.println("\n=== Mais Frequente ===");
        System.out.println("Opção: " + maisFrequente);
        System.out.println("Votos: " + maxFreq);
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Set: elementos distintos");
        System.out.println("Loop: contar todos");
        System.out.println("Mapa: alternativa eficiente");
    }
}
```

**Múltipla**: Set distintos loop contar todos. Mapa frequência alternativa. Mais frequente max loop comparação.

### 3. Casos de Uso

```java
public class FrequencyCasos {
    public static void main(String[] args) {
        // CASO 1: Votação
        
        List<String> votos = Arrays.asList("Ana", "Bruno", "Ana", "Carlos", "Ana", "Bruno");
        
        System.out.println("=== Caso 1: Votação ===");
        Set<String> candidatos = new HashSet<>(votos);
        for (String candidato : candidatos) {
            int votos_candidato = Collections.frequency(votos, candidato);
            System.out.println(candidato + ": " + votos_candidato + " votos");
        }
        
        
        // CASO 2: Análise dados
        
        List<Integer> notas = Arrays.asList(7, 8, 7, 9, 10, 7, 8, 6, 7);
        
        System.out.println("\n=== Caso 2: Notas ===");
        System.out.println("Nota 7: " + Collections.frequency(notas, 7) + " alunos");
        System.out.println("Nota 10: " + Collections.frequency(notas, 10) + " alunos");
        
        
        // CASO 3: Duplicatas
        
        List<String> itens = Arrays.asList("A", "B", "C", "A", "D", "B");
        
        System.out.println("\n=== Caso 3: Duplicatas ===");
        Set<String> unicos = new HashSet<>();
        Set<String> duplicados = new HashSet<>();
        
        for (String item : itens) {
            if (Collections.frequency(itens, item) > 1) {
                duplicados.add(item);
            } else {
                unicos.add(item);
            }
        }
        
        System.out.println("Únicos: " + unicos);
        System.out.println("Duplicados: " + duplicados);
        
        
        // CASO 4: Validação
        
        List<String> respostas = Arrays.asList("sim", "não", "sim", "sim", "não");
        
        int sim = Collections.frequency(respostas, "sim");
        int nao = Collections.frequency(respostas, "não");
        
        System.out.println("\n=== Caso 4: Validação ===");
        System.out.println("Sim: " + sim);
        System.out.println("Não: " + nao);
        System.out.println("Maioria: " + (sim > nao ? "Sim" : "Não"));
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Votação: contar votos");
        System.out.println("Análise: frequência valores");
        System.out.println("Duplicatas: > 1");
        System.out.println("Validação: maioria");
    }
}
```

**Casos**: votação contar votos candidato. Análise notas frequência valores. Duplicatas freq > 1 identificar. Validação maioria comparar sim não.

### 4. Performance

```java
public class FrequencyPerformance {
    public static void main(String[] args) {
        System.out.println("=== Performance ===");
        
        for (int size : new int[]{1000, 10_000, 100_000}) {
            List<Integer> lista = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                lista.add(i % 100);  // 100 valores distintos
            }
            
            long t1 = System.nanoTime();
            Collections.frequency(lista, 50);
            long t2 = System.nanoTime();
            
            System.out.printf("Size %6d: %4dms\n", size, (t2-t1)/1_000_000);
        }
        
        // RESULTADO:
        // Size   1000:    0ms
        // Size  10000:    0ms
        // Size 100000:    2ms
        
        // O(n) linear
        
        
        // COMPARAÇÃO: frequency vs Map
        
        List<Integer> lista = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            lista.add(i % 100);
        }
        
        // Frequency (múltiplas consultas):
        long t1 = System.nanoTime();
        for (int i = 0; i < 100; i++) {
            Collections.frequency(lista, i);
        }
        long t2 = System.nanoTime();
        
        // Map (uma passada):
        long t3 = System.nanoTime();
        Map<Integer, Integer> map = new HashMap<>();
        for (Integer num : lista) {
            map.put(num, map.getOrDefault(num, 0) + 1);
        }
        long t4 = System.nanoTime();
        
        System.out.println("\n=== Comparação ===");
        System.out.printf("Frequency (100x): %dms\n", (t2-t1)/1_000_000);
        System.out.printf("Map (1x): %dms\n", (t4-t3)/1_000_000);
        
        // Frequency: ~200ms (100 consultas)
        // Map: ~10ms (uma passada)
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Uma consulta: frequency OK");
        System.out.println("Múltiplas: Map melhor");
    }
}
```

**Performance**: O(n) linear 2ms 100K. Uma consulta frequency OK. Múltiplas consultas Map melhor uma passada 10ms vs 200ms 100 consultas.

---

## Aplicabilidade

**frequency usar**: contar ocorrências elemento votação análise duplicatas validação. O(n) percorre equals. Uma consulta frequency múltiplas Map melhor.

---

## Armadilhas

```java
// ❌ Múltiplas consultas ineficiente
for (String elem : distintos) {
    int freq = Collections.frequency(lista, elem);  // O(n) cada!
}
// Total: O(n×m)

// ✅ Map eficiente
Map<String, Integer> freqs = new HashMap<>();
for (String elem : lista) {
    freqs.put(elem, freqs.getOrDefault(elem, 0) + 1);
}
// Total: O(n)

// ❌ Equals incorreto
class Obj {
    // Sem equals(): identidade
}
// frequency não funciona corretamente

// ✅ Equals correto
class Obj {
    public boolean equals(Object o) { ... }
    public int hashCode() { ... }
}
```

---

## Boas Práticas

```java
// ✅ Uma consulta
int freq = Collections.frequency(lista, elemento);

// ✅ Múltiplas: Map
Map<T, Integer> freqs = new HashMap<>();
for (T elem : lista) {
    freqs.merge(elem, 1, Integer::sum);
}

// ✅ Equals e hashCode
@Override
public boolean equals(Object o) { ... }

@Override
public int hashCode() { ... }
```

---

## Resumo

**Collections.frequency**: conta ocorrências elemento Collection O(n) percorre todos equals verificação null-safe permite null retorna 0 ausente. Simples contar quantidade elemento lista.

**Múltiplas consultas**: Set distintos loop contar todos O(n×m) ineficiente. Map frequência alternativa O(n) uma passada melhor múltiplas consultas getOrDefault merge. Elemento mais frequente max loop comparação.

**Casos uso**: votação contar votos candidato vencedor. Análise dados frequência valores notas. Duplicatas freq > 1 identificar únicos. Validação maioria sim não comparar respostas. Estatísticas distribuição valores.

**Performance**: O(n) linear percorre 2ms 100K uma consulta OK. Múltiplas consultas Map melhor 10ms vs 200ms 100 consultas O(n) vs O(n×m). Equals hashCode correto funcionamento Object identidade não funciona usar equals valor.

