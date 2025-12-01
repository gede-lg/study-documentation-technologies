# T2.06 - ensureCapacity(), trimToSize()

## Introdução

**Métodos otimização**: ensureCapacity(min) aumenta capacidade evita expansões, trimToSize() reduz capacidade size economiza memória.

```java
import java.util.*;

// ensureCapacity() e trimToSize()
public class MetodosOtimizacao {
    public static void main(String[] args) {
        ArrayList<String> lista = new ArrayList<>();  // capacity 10
        
        // 1. ensureCapacity(min): aumentar capacidade
        lista.ensureCapacity(1000);
        // capacity agora >= 1000
        // Evita expansões adicionando <= 1000
        
        for (int i = 0; i < 1000; i++) {
            lista.add("Elemento " + i);  // Sem expansões
        }
        
        // 2. trimToSize(): reduzir capacidade
        lista.clear();                  // size = 0, capacity = 1000
        lista.add("A");
        lista.add("B");
        lista.add("C");                 // size = 3, capacity = 1000
        
        lista.trimToSize();             // capacity = size = 3
        // Libera memória desperdiçada
        
        System.out.println("Size: " + lista.size());
    }
}
```

**Métodos**: ensureCapacity(min) aumenta evita expansões performance. trimToSize() reduz economiza memória desperdício.

---

## Fundamentos

### 1. ensureCapacity() - Conceito

```java
// ensureCapacity(minCapacity): garantir capacidade mínima
public class EnsureCapacityConceito {
    public static void main(String[] args) {
        ArrayList<String> lista = new ArrayList<>();  // capacity 10
        
        // SINTAXE:
        lista.ensureCapacity(1000);
        // capacity agora >= 1000
        
        // OBJETIVO:
        // Evitar múltiplas expansões
        // Melhor performance
        // Pré-alocar memória necessária
        
        // SEM ensureCapacity():
        ArrayList<Integer> lista1 = new ArrayList<>();  // capacity 10
        
        for (int i = 0; i < 10000; i++) {
            lista1.add(i);
        }
        // Múltiplas expansões:
        // 10 -> 15 -> 22 -> 33 -> 49 ... ~20 expansões
        // Cada expansão: copiar array inteiro O(n)
        // LENTO
        
        // COM ensureCapacity():
        ArrayList<Integer> lista2 = new ArrayList<>();  // capacity 10
        lista2.ensureCapacity(10000);                   // capacity 10000
        
        for (int i = 0; i < 10000; i++) {
            lista2.add(i);
        }
        // ZERO expansões
        // MUITO MAIS RÁPIDO
        
        // DIFERENÇA PERFORMANCE:
        // Sem: ~20 cópias array
        // Com: 0 cópias
        
        System.out.println("Concluído");
    }
}

/*
 * ensureCapacity(minCapacity):
 * 
 * ASSINATURA:
 * public void ensureCapacity(int minCapacity)
 * 
 * PARÂMETRO:
 * minCapacity: capacidade mínima desejada
 * 
 * COMPORTAMENTO:
 * if (capacity < minCapacity)
 *     capacity = max(minCapacity, capacity * 1.5)
 * 
 * OBJETIVO:
 * Evitar expansões automáticas
 * Melhorar performance
 * Pré-alocar memória
 * 
 * QUANDO USAR:
 * - Sabe quantos elementos adicionar
 * - Adicionar muitos elementos
 * - Performance crítica
 * - Evitar overhead expansões
 * 
 * VANTAGEM:
 * Zero expansões
 * Sem cópias array
 * Muito mais rápido
 */
```

**ensureCapacity**: garantir capacidade >= min. capacity < min aumenta. Evita expansões zero cópias muito rápido.

### 2. ensureCapacity() - Implementação

```java
// IMPLEMENTAÇÃO ensureCapacity()
public class EnsureCapacityImplementacao {
    public static void main(String[] args) {
        ArrayList<String> lista = new ArrayList<>();  // capacity 10
        
        // CHAMADA:
        lista.ensureCapacity(100);
        
        // IMPLEMENTAÇÃO SIMPLIFICADA:
        // public void ensureCapacity(int minCapacity) {
        //     if (minCapacity > elementData.length) {
        //         grow(minCapacity);
        //     }
        // }
        // 
        // private void grow(int minCapacity) {
        //     int oldCapacity = elementData.length;
        //     int newCapacity = oldCapacity + (oldCapacity >> 1);  // 1.5x
        //     
        //     if (newCapacity < minCapacity) {
        //         newCapacity = minCapacity;
        //     }
        //     
        //     elementData = Arrays.copyOf(elementData, newCapacity);
        // }
        
        // PROCESSO:
        // 1. Verificar se minCapacity > capacity atual
        // 2. Se SIM: calcular nova capacidade
        //    - Tentar 1.5x atual
        //    - Se ainda < minCapacity, usar minCapacity
        // 3. Criar novo array newCapacity
        // 4. Copiar elementos
        // 5. Substituir array
        
        // EXEMPLO:
        // capacity = 10
        // ensureCapacity(100)
        // 
        // 1. 100 > 10? SIM
        // 2. newCapacity = 10 * 1.5 = 15
        // 3. 15 < 100? SIM
        // 4. newCapacity = 100
        // 5. elementData = new Object[100]
        
        // EXEMPLO 2:
        // capacity = 100
        // ensureCapacity(50)
        // 
        // 1. 50 > 100? NÃO
        // 2. NÃO FAZ NADA
        // capacity continua 100
        
        System.out.println("Capacity ajustado");
    }
}

/*
 * IMPLEMENTAÇÃO:
 * 
 * VERIFICAÇÃO:
 * if (minCapacity > capacity atual)
 *     aumentar
 * else
 *     nada
 * 
 * CÁLCULO NOVA CAPACIDADE:
 * nova = max(minCapacity, capacity * 1.5)
 * 
 * GARANTIA:
 * capacity >= minCapacity sempre
 * 
 * SEM REDUÇÃO:
 * ensureCapacity() NUNCA reduz
 * Só aumenta
 */
```

**Implementação**: verifica minCapacity > capacity. SIM calcula max(min, 1.5x) cria array copia. NÃO nada. NUNCA reduz.

### 3. ensureCapacity() - Performance

```java
// PERFORMANCE ensureCapacity()
public class EnsureCapacityPerformance {
    public static void main(String[] args) {
        int N = 100_000;
        
        // TESTE 1: SEM ensureCapacity()
        ArrayList<Integer> lista1 = new ArrayList<>();
        
        long inicio1 = System.nanoTime();
        for (int i = 0; i < N; i++) {
            lista1.add(i);
        }
        long fim1 = System.nanoTime();
        
        long tempo1 = fim1 - inicio1;
        System.out.println("Sem ensureCapacity: " + tempo1 + "ns");
        
        // TESTE 2: COM ensureCapacity()
        ArrayList<Integer> lista2 = new ArrayList<>();
        lista2.ensureCapacity(N);
        
        long inicio2 = System.nanoTime();
        for (int i = 0; i < N; i++) {
            lista2.add(i);
        }
        long fim2 = System.nanoTime();
        
        long tempo2 = fim2 - inicio2;
        System.out.println("Com ensureCapacity: " + tempo2 + "ns");
        
        // DIFERENÇA:
        double melhora = (double) tempo1 / tempo2;
        System.out.println("Melhora: " + melhora + "x mais rápido");
        
        // RESULTADO TÍPICO:
        // Sem: ~50ms
        // Com: ~10ms
        // Melhora: ~5x mais rápido
        
        // MOTIVO:
        // Sem: ~20 expansões, múltiplas cópias
        // Com: 0 expansões, zero cópias
        
        // CONCLUSÃO:
        // ensureCapacity() SIGNIFICATIVO quando:
        // - Muitos elementos (> 1000)
        // - Performance crítica
        // - Tamanho conhecido
    }
}

/*
 * PERFORMANCE:
 * 
 * SEM ensureCapacity():
 * - Múltiplas expansões (~20 para 100k)
 * - Múltiplas cópias array
 * - O(n log n) total
 * - LENTO
 * 
 * COM ensureCapacity():
 * - Zero expansões
 * - Zero cópias
 * - O(n) total
 * - RÁPIDO
 * 
 * MELHORA:
 * 3x a 10x mais rápido
 * Depende quantidade elementos
 * 
 * QUANDO VALE:
 * > 1000 elementos
 * Performance importante
 * Tamanho conhecido
 */
```

**Performance**: sem 20 expansões múltiplas cópias lento. Com zero expansões cópias rápido. Melhora 3x-10x mais rápido.

### 4. trimToSize() - Conceito

```java
// trimToSize(): reduzir capacidade para size
public class TrimToSizeConceito {
    public static void main(String[] args) {
        ArrayList<String> lista = new ArrayList<>(1000);  // capacity 1000
        
        // Adicionar apenas 3 elementos
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // ESTADO:
        // size = 3
        // capacity = 1000
        // DESPERDÍCIO: 997 posições vazias
        
        System.out.println("Antes trimToSize():");
        System.out.println("Size: " + lista.size());              // 3
        // capacity não acessível diretamente
        
        // SINTAXE:
        lista.trimToSize();
        
        // ESTADO APÓS:
        // size = 3
        // capacity = 3
        // DESPERDÍCIO: 0
        
        System.out.println("\nApós trimToSize():");
        System.out.println("Size: " + lista.size());              // 3
        // capacity agora = size
        
        // OBJETIVO:
        // Liberar memória não utilizada
        // Reduzir desperdício
        // Otimizar uso memória
        
        // QUANDO USAR:
        // - capacity >> size
        // - Lista não crescerá mais
        // - Memória limitada
        // - Armazenar longo prazo
        
        // EXEMPLO REAL:
        // Carregar dados arquivo
        ArrayList<String> configuracoes = new ArrayList<>(10000);
        // Arquivo tinha apenas 50 linhas
        // ... ler arquivo
        configuracoes.trimToSize();  // capacity 10000 -> 50
        // Libera 9950 posições
        
        System.out.println("Memória otimizada");
    }
}

/*
 * trimToSize():
 * 
 * ASSINATURA:
 * public void trimToSize()
 * 
 * COMPORTAMENTO:
 * capacity = size
 * 
 * OBJETIVO:
 * Liberar memória desperdiçada
 * capacity > size
 * 
 * QUANDO USAR:
 * - Capacidade muito maior size
 * - Lista não crescerá
 * - Memória limitada
 * - Cache longo prazo
 * 
 * CUSTO:
 * O(n) copiar array
 * Uma vez apenas
 * 
 * BENEFÍCIO:
 * Libera memória
 * Reduz footprint
 */
```

**trimToSize**: reduz capacity = size. Libera memória desperdiçada. capacity >> size não crescer memória limitada.

### 5. trimToSize() - Implementação

```java
// IMPLEMENTAÇÃO trimToSize()
public class TrimToSizeImplementacao {
    public static void main(String[] args) {
        ArrayList<String> lista = new ArrayList<>(100);
        lista.add("A");
        lista.add("B");
        // size = 2, capacity = 100
        
        lista.trimToSize();
        // size = 2, capacity = 2
        
        // IMPLEMENTAÇÃO SIMPLIFICADA:
        // public void trimToSize() {
        //     if (size < elementData.length) {
        //         elementData = (size == 0)
        //             ? EMPTY_ELEMENTDATA
        //             : Arrays.copyOf(elementData, size);
        //     }
        // }
        
        // PROCESSO:
        // 1. Verificar se size < capacity
        // 2. Se SIM:
        //    - Se size == 0: usar array vazio
        //    - Senão: criar array tamanho size
        //    - Copiar elementos
        //    - Substituir array
        // 3. Se NÃO: nada
        
        // EXEMPLO:
        // size = 3, capacity = 1000
        // 
        // 1. 3 < 1000? SIM
        // 2. size == 0? NÃO
        // 3. elementData = Arrays.copyOf(elementData, 3)
        // 4. capacity agora 3
        
        // EXEMPLO 2:
        // size = 50, capacity = 50
        // 
        // 1. 50 < 50? NÃO
        // 2. NÃO FAZ NADA
        
        System.out.println("Capacidade ajustada");
    }
}

/*
 * IMPLEMENTAÇÃO:
 * 
 * VERIFICAÇÃO:
 * if (size < capacity)
 *     reduzir
 * else
 *     nada
 * 
 * REDUÇÃO:
 * elementData = Arrays.copyOf(elementData, size)
 * 
 * CUSTO:
 * O(n) copiar elementos
 * 
 * SEM AUMENTO:
 * trimToSize() NUNCA aumenta
 * Só reduz
 */
```

**Implementação**: verifica size < capacity. SIM cria array size copia elementos. NÃO nada. Custo O(n) uma vez. NUNCA aumenta.

### 6. Cenários Uso

```java
// CENÁRIOS USO ensureCapacity() e trimToSize()
public class CenariosUso {
    public static void main(String[] args) {
        // CENÁRIO 1: Carregar muitos dados
        ArrayList<String> dados = new ArrayList<>();
        
        // ✅ ensureCapacity() antes carregar
        dados.ensureCapacity(10000);
        
        // Carregar 10000 registros
        for (int i = 0; i < 10000; i++) {
            dados.add("Registro " + i);
        }
        // Zero expansões, muito rápido
        
        // CENÁRIO 2: Capacidade excessiva após remoções
        ArrayList<String> lista = new ArrayList<>(1000);
        
        for (int i = 0; i < 1000; i++) {
            lista.add("Item " + i);
        }
        // size = 1000, capacity = 1000
        
        // Remover 950 elementos
        for (int i = 0; i < 950; i++) {
            lista.remove(0);
        }
        // size = 50, capacity = 1000
        // DESPERDÍCIO: 950 posições
        
        // ✅ trimToSize() após remoções
        lista.trimToSize();
        // capacity = 50
        // Libera memória
        
        // CENÁRIO 3: Cache longo prazo
        ArrayList<String> cache = new ArrayList<>(5000);
        
        // Carregar dados
        // ... apenas 200 itens carregados
        
        // ✅ trimToSize() antes armazenar
        cache.trimToSize();
        // Reduz de 5000 para 200
        // Cache ficará memória longo tempo
        
        // CENÁRIO 4: Processamento batch
        ArrayList<Integer> batch = new ArrayList<>();
        
        // ✅ ensureCapacity() início batch
        int BATCH_SIZE = 1000;
        batch.ensureCapacity(BATCH_SIZE);
        
        for (int i = 0; i < BATCH_SIZE; i++) {
            batch.add(processar(i));
        }
        
        // Processar batch...
        
        // ✅ trimToSize() se armazenar resultado
        batch.trimToSize();
        
        System.out.println("Otimizado");
    }
    
    static int processar(int i) {
        return i * 2;
    }
}

/*
 * CENÁRIOS:
 * 
 * ensureCapacity():
 * 1. Carregar muitos dados
 * 2. Processamento batch
 * 3. Performance crítica
 * 4. Tamanho conhecido
 * 
 * trimToSize():
 * 1. Após remoções massivas
 * 2. Cache longo prazo
 * 3. Memória limitada
 * 4. Capacidade >> size
 * 
 * COMBINAÇÃO:
 * ensureCapacity() -> adicionar -> trimToSize()
 */
```

**Cenários**: ensureCapacity carregar dados batch performance conhecido. trimToSize após remoções cache longo prazo memória limitada.

### 7. Trade-offs

```java
// TRADE-OFFS ensureCapacity() e trimToSize()
public class TradeOffs {
    public static void main(String[] args) {
        // ensureCapacity() TRADE-OFFS:
        
        // VANTAGEM:
        // + Zero expansões
        // + Muito mais rápido
        // + Sem overhead cópias
        
        // DESVANTAGEM:
        // - Aloca memória antecipado
        // - Pode desperdiçar se estimar errado
        // - Overhead inicial alocação
        
        ArrayList<String> lista1 = new ArrayList<>();
        lista1.ensureCapacity(10000);
        // Alocou 10000 posições
        
        // Se adicionar apenas 100:
        for (int i = 0; i < 100; i++) {
            lista1.add("Item");
        }
        // DESPERDÍCIO: 9900 posições
        
        // trimToSize() TRADE-OFFS:
        
        // VANTAGEM:
        // + Libera memória
        // + Reduz desperdício
        // + Melhor footprint
        
        // DESVANTAGEM:
        // - Custo O(n) copiar
        // - Se adicionar depois, expansão novamente
        // - Overhead realocação
        
        ArrayList<String> lista2 = new ArrayList<>(1000);
        lista2.add("A");
        lista2.add("B");
        lista2.trimToSize();  // O(n) copiar
        // capacity agora 2
        
        // Se adicionar mais:
        lista2.add("C");  // Expansão: 2 -> 3
        lista2.add("D");  // Expansão: 3 -> 4
        // Múltiplas expansões novamente
        
        // REGRA:
        // ensureCapacity(): usar quando CERTEZA adicionar muitos
        // trimToSize(): usar quando CERTEZA não crescer mais
        
        System.out.println("Trade-offs considerados");
    }
}

/*
 * TRADE-OFFS:
 * 
 * ensureCapacity():
 * ✅ Performance adicionar
 * ❌ Desperdiça se estimar errado
 * ❌ Overhead inicial
 * 
 * trimToSize():
 * ✅ Economiza memória
 * ❌ Custo O(n) copiar
 * ❌ Expansões se adicionar depois
 * 
 * QUANDO USAR:
 * ensureCapacity(): certeza tamanho
 * trimToSize(): certeza não crescer
 * 
 * QUANDO EVITAR:
 * ensureCapacity(): incerteza quantidade
 * trimToSize(): pode adicionar depois
 */
```

**Trade-offs**: ensureCapacity performance adicionar desperdício estimar errado. trimToSize economiza memória custo copiar expansões depois.

### 8. Resumo Métodos

```java
/*
 * ensureCapacity() vs trimToSize()
 * 
 * ensureCapacity(minCapacity):
 * - AUMENTA capacidade
 * - Evita expansões
 * - Melhora performance adicionar
 * - Custo: O(n) uma vez
 * - Uso: antes adicionar muitos
 * 
 * trimToSize():
 * - REDUZ capacidade
 * - Libera memória
 * - Economiza desperdício
 * - Custo: O(n) uma vez
 * - Uso: após parar crescer
 * 
 * OPOSTOS:
 * ensureCapacity(): PRÉ-alocação
 * trimToSize(): DES-alocação
 * 
 * COMPLEMENTARES:
 * 1. ensureCapacity() antes carregar
 * 2. Adicionar elementos
 * 3. trimToSize() após finalizar
 * 
 * PERFORMANCE:
 * ensureCapacity(): 3x-10x mais rápido
 * trimToSize(): economiza memória
 * 
 * QUANDO USAR:
 * ensureCapacity():
 * - Tamanho conhecido
 * - Adicionar muitos
 * - Performance crítica
 * 
 * trimToSize():
 * - capacity >> size
 * - Não crescer mais
 * - Memória limitada
 * - Cache longo prazo
 * 
 * QUANDO EVITAR:
 * ensureCapacity():
 * - Tamanho desconhecido
 * - Poucos elementos
 * 
 * trimToSize():
 * - Pode adicionar depois
 * - capacity ≈ size
 */

// EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        ArrayList<String> lista = new ArrayList<>();
        
        // 1. Pré-alocar antes carregar
        lista.ensureCapacity(10000);
        
        // 2. Carregar dados
        for (int i = 0; i < 10000; i++) {
            lista.add("Dado " + i);
        }
        // Zero expansões
        
        // 3. Processar...
        
        // 4. Remover alguns
        for (int i = 0; i < 5000; i++) {
            lista.remove(0);
        }
        // size = 5000, capacity = 10000
        
        // 5. Otimizar memória
        lista.trimToSize();
        // capacity = 5000
        
        System.out.println("Size: " + lista.size());
    }
}
```

---

## Aplicabilidade

**ensureCapacity(min)**:
- **Tamanho conhecido**: sabe quantos adicionar
- **Muitos elementos**: > 1000 significativo
- **Performance crítica**: evitar overhead expansões
- **Batch processing**: carregar dados lote

**trimToSize()**:
- **Capacidade >> size**: desperdício grande
- **Não crescer**: lista finalizada
- **Memória limitada**: economizar recursos
- **Cache longo prazo**: armazenar memória

---

## Armadilhas

### 1. ensureCapacity Estimar Errado

```java
// ❌ Desperdiça memória
lista.ensureCapacity(100000);
// Adiciona apenas 100
// Desperdício: 99900 posições

// ✅ Estimar correto
lista.ensureCapacity(estimativaRealista);
```

### 2. trimToSize Adicionar Depois

```java
// ❌ Expansões novamente
lista.trimToSize();
lista.add(elemento);  // Expansão

// ✅ trimToSize quando finalizado
// Não adicionar depois
```

### 3. Usar Sem Necessidade

```java
// ❌ Poucos elementos
ArrayList<String> pequena = new ArrayList<>();
pequena.ensureCapacity(10);  // Desnecessário
// Padrão já 10

// ✅ Usar quando significativo
ArrayList<String> grande = new ArrayList<>();
grande.ensureCapacity(10000);  // Útil
```

---

## Boas Práticas

### 1. ensureCapacity Antes Carregar

```java
// ✅ Pré-alocar conhecido
lista.ensureCapacity(tamanhoConhecido);
// Carregar dados
```

### 2. trimToSize Após Finalizar

```java
// ✅ Otimizar memória
// Carregar processar
lista.trimToSize();
// Armazenar cache
```

### 3. Estimar Realisticamente

```java
// ✅ Estimativa realista conservadora
int estimativa = calcularEstimativa();
lista.ensureCapacity(estimativa);
```

---

## Resumo

**ensureCapacity(min)**:
- **Objetivo**: aumentar capacidade >= min evitar expansões melhorar performance
- **Comportamento**: capacity < min aumenta max(min, 1.5x). >= min nada. NUNCA reduz
- **Custo**: O(n) copiar array uma vez
- **Performance**: sem 20 expansões múltiplas cópias lento. Com zero expansões cópias rápido. Melhora 3x-10x
- **Quando usar**: tamanho conhecido adicionar muitos > 1000 performance crítica batch processing
- **Quando evitar**: tamanho desconhecido poucos elementos desperdício

**trimToSize()**:
- **Objetivo**: reduzir capacity = size liberar memória desperdiçada economizar
- **Comportamento**: size < capacity reduz cria array size copia. size >= capacity nada. NUNCA aumenta
- **Custo**: O(n) copiar elementos uma vez
- **Benefício**: libera memória reduz footprint otimiza uso recursos
- **Quando usar**: capacity >> size não crescer mais memória limitada cache longo prazo após remoções
- **Quando evitar**: pode adicionar depois capacity ≈ size overhead desnecessário

**Trade-offs**:
- **ensureCapacity**: performance adicionar rápido. Desperdiça estimar errado overhead inicial
- **trimToSize**: economiza memória footprint menor. Custo O(n) copiar expansões adicionar depois

**Combinação**:
1. ensureCapacity(tamanho) antes carregar
2. Adicionar elementos zero expansões
3. Processar dados
4. trimToSize() após finalizar
5. Armazenar cache otimizado

**Regra de Ouro**: ensureCapacity AUMENTA capacidade min evita expansões melhor performance tamanho conhecido adicionar muitos crítica batch custo On uma vez melhora 3x-10x rápido usar SEMPRE conhecido. trimToSize REDUZ capacity size libera memória desperdício economiza recursos custo On copiar usar capacity muito maior size não crescer memória limitada cache longo prazo. TRADE-OFFS ensureCapacity performance desperdiça estimar errado trimToSize economiza custo expansões depois. COMBINAR ensureCapacity antes carregar adicionar processar trimToSize finalizar armazenar otimizado. EVITAR ensureCapacity desconhecido poucos trimToSize adicionar depois capacity igual size.

