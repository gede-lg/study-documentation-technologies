# Garbage Collector: Conceitos Iniciais

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Garbage Collector (GC)** é o subsistema automatizado da JVM responsável por **gerenciar memória dinamicamente**, identificando e liberando objetos que não são mais acessíveis pelo programa. Conceitualmente, é o **zelador automático da memória heap** que continuamente identifica "lixo" (objetos inacessíveis) e o remove, reciclando esse espaço para novas alocações.

Diferentemente de linguagens como C/C++ onde o programador deve explicitamente alocar (`malloc`) e liberar (`free`) memória, Java abstrai esse processo. Quando você cria objetos (`new MyClass()`), memória é alocada automaticamente. Quando objetos não são mais referenciados, **GC automaticamente os libera** sem intervenção do programador.

GC é processo **não-determinístico**: você não controla exatamente quando ele executa. JVM decide autonomamente, baseada em heurísticas, quando executar coleta. Isso contrasta com gerenciamento manual onde o programador controla timing de desalocação.

### Contexto Histórico e Motivação

**Origem do Conceito:**

Garbage Collection foi inventado por **John McCarthy em 1959** para Lisp, uma das primeiras linguagens de alto nível. McCarthy percebeu que gerenciamento manual de memória era fonte constante de bugs (memory leaks, dangling pointers, double frees) e que computadores poderiam automatizar isso.

**Evolução em Java:**

- **Java 1.0 (1995):** GC básico, single-threaded, pausava toda aplicação (Stop-The-World)
- **Java 1.2 (1998):** GC Geracional introduzido, otimizando para objetos de curta vida
- **Java 1.4 (2002):** Parallel GC, usava múltiplas threads para coletar
- **Java 5 (2004):** Concurrent Mark-Sweep (CMS), reduz pausas
- **Java 7 (2011):** G1 GC introduzido (experimental)
- **Java 9 (2017):** G1 se torna padrão
- **Java 11 (2018):** ZGC e Shenandoah (low-latency collectors)
- **Java 15+ (2020+):** Melhorias contínuas em GC de baixa latência

**Motivação Principal:**

Programas Java criam/destroem milhões de objetos. Gerenciar isso manualmente seria:

1. **Propenso a Erros:** Memory leaks (esquecer de liberar), dangling pointers (usar memória já liberada), double frees (liberar duas vezes)
2. **Complexo:** Difícil saber quando é seguro liberar objetos compartilhados
3. **Não-Portável:** Estratégias de memória variam por plataforma

GC resolve trocando **previsibilidade de timing** (quando memória é liberada) por **segurança e simplicidade** (não há erros de gerenciamento manual).

### Problema Fundamental que Resolve

**1. Memory Leaks:**

Sem GC, programador deve explicitamente liberar cada objeto. Esquecer uma chamada causa memory leak — memória alocada mas nunca liberada, eventualmente esgotando memória disponível.

**GC Resolve:** Automaticamente identifica objetos inacessíveis e os libera.

**2. Dangling Pointers:**

Liberar memória prematuramente enquanto ainda há ponteiros para ela cria dangling pointers — acessar essa memória causa comportamento indefinido (crashes, corrupção de dados).

**GC Resolve:** Só libera objetos provadamente inacessíveis. Se há referência viva, objeto não é coletado.

**3. Double Frees:**

Liberar a mesma memória duas vezes corrompe estruturas internas do alocador de memória, causando crashes.

**GC Resolve:** Programador não libera memória manualmente, eliminando possibilidade de double frees.

**4. Fragmentação de Memória:**

Alocações/desalocações aleatórias fragmentam memória — muito espaço livre total, mas não contíguo o suficiente para grandes alocações.

**GC Resolve:** Muitos GCs compactam memória, movendo objetos vivos para formar blocos contíguos.

**5. Complexidade de Compartilhamento:**

Determinar quando é seguro liberar objeto compartilhado por múltiplas partes do código é difícil (requer reference counting ou lógica complexa).

**GC Resolve:** Algoritmo de alcançabilidade (reachability) determina automaticamente se objeto é acessível.

### Importância no Ecossistema

GC é **fundamento arquitetural** que permite:

- **Produtividade:** Desenvolvedores focam em lógica de negócio, não gerenciamento de memória
- **Segurança:** Elimina classes inteiras de vulnerabilidades (buffer overflows via use-after-free, etc.)
- **Portabilidade:** Aplicação Java roda em qualquer JVM sem modificar gerenciamento de memória
- **Frameworks Complexos:** Spring, Hibernate criam/destroem objetos massivamente; GC torna isso prático

**Trade-off Fundamental:** GC sacrifica controle fino (quando exatamente memória é liberada) e performance previsível (pausas de GC) por segurança, simplicidade e produtividade.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Gerenciamento Automático:** Programador não controla explicitamente quando memória é liberada
2. **Algoritmo de Alcançabilidade:** Objetos alcançáveis de GC Roots são vivos; demais são lixo
3. **GC Geracional:** Hipótese de que objetos jovens morrem rápido; objetos velhos vivem muito
4. **Stop-The-World vs Concurrent:** Trade-off entre pausar aplicação ou coletar concorrentemente
5. **Compactação:** Mover objetos vivos para eliminar fragmentação

### Pilares Fundamentais

- **GC Roots:** Pontos de partida para determinação de alcançabilidade (threads ativas, variáveis locais, static fields, JNI references)
- **Hipótese Geracional:** Maioria dos objetos morre jovem (weak generational hypothesis)
- **Pausas (STW):** GC precisa parar aplicação em certos momentos para garantir consistência
- **Throughput vs Latency:** GCs otimizam ou para máximo processamento (throughput) ou mínimas pausas (latency)
- **Tunability:** JVM oferece flags para customizar comportamento de GC

### Nuances Importantes

- **Finalization:** Método `finalize()` permite cleanup antes de coleção (deprecated Java 9+)
- **Reference Types:** Soft, Weak, Phantom references permitem controle sobre coleta
- **OutOfMemoryError:** Quando GC não consegue liberar memória suficiente
- **GC Tuning:** Balancear heap size, generações, algoritmo de GC para workload específico

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Algoritmo de Alcançabilidade (Reachability)

**Conceito Central:** Objeto é considerado **vivo** se é alcançável a partir de **GC Roots** através de cadeia de referências. Objetos não alcançáveis são **lixo elegível para coleta**.

**GC Roots são:**

1. **Variáveis Locais:** Referências em stack frames de threads ativas
2. **Static Fields:** Campos static de classes carregadas
3. **Active Threads:** Próprios objetos Thread ativos
4. **JNI References:** Referências criadas por código nativo (JNI)

**Processo Conceitual:**

```
1. Marcar todos os GC Roots
2. Percorrer recursivamente todas as referências de objetos marcados
3. Objetos alcançados também são marcados
4. Após percorrer tudo, objetos não-marcados são lixo
5. Liberar memória dos não-marcados
6. Opcionalmente, compactar memória movendo objetos vivos
```

**Exemplo Conceitual:**

```java
class Node {
    Node next;
}

public static void main(String[] args) {
    Node a = new Node();  // 'a' é GC Root (variável local)
    Node b = new Node();
    a.next = b;           // 'b' é alcançável via 'a'

    Node c = new Node();  // 'c' é GC Root

    b = null;             // 'b' ainda alcançável via a.next
    c = null;             // 'c' não é mais alcançável → elegível para GC
    a = null;             // 'a' e o objeto apontado por a.next não são mais alcançáveis
}
```

Quando `c = null`, objeto não tem mais referências alcançáveis de GC Roots → lixo.

### GC Geracional: Fundamento Arquitetural

**Hipótese Geracional (Weak Generational Hypothesis):**

Observação empírica: **maioria dos objetos morre jovem**. Objetos recém-criados tendem a se tornar inacessíveis rapidamente (variáveis locais temporárias, objetos intermediários). Objetos que sobrevivem múltiplas coletas tendem a viver muito tempo (estruturas de dados globais, caches).

**Implicação de Design:**

Dividir heap em **gerações**:

1. **Young Generation:** Objetos recém-criados
2. **Old Generation (Tenured):** Objetos que sobreviveram múltiplas coletas
3. **Permanent Generation / Metaspace:** Metadados de classes (não é geração de objetos, mas região separada)

**Vantagem:**

- **Coletar Young Generation com frequência:** Maioria dos objetos lá está morto, coleta é rápida
- **Coletar Old Generation raramente:** Poucos objetos morrem lá, coleta é mais cara mas menos frequente

#### Estrutura da Young Generation

**Subdivisões:**

- **Eden Space:** Onde novos objetos são alocados
- **Survivor Spaces (S0, S1):** Onde objetos que sobreviveram coleta vão temporariamente

**Processo de Minor GC (Young Generation Collection):**

```
1. Novos objetos alocados em Eden
2. Quando Eden enche, Minor GC é disparado
3. Objetos vivos em Eden são copiados para Survivor Space (S0)
4. Objetos já em S0 são copiados para S1 (ou vice-versa)
5. Objetos que sobreviveram N coletas (threshold, default ~15) são promovidos para Old Gen
6. Eden e Survivor space "from" são limpos (toda memória liberada de uma vez)
```

**Conceito de Cópia:**

Young Gen usa **copy collection** (Copying GC): objetos vivos são copiados para nova região, região antiga é completamente descartada. Isso elimina fragmentação automaticamente e é eficiente quando maioria dos objetos está morta (pouco a copiar).

#### Old Generation

**Características:**

- Objetos de longa vida
- Coleta menos frequente (Major GC ou Full GC)
- Usa algoritmos diferentes (Mark-Sweep-Compact)

**Major GC:**

Quando Old Gen enche, **Major GC** (ou Full GC) é disparado. Isso geralmente é **Stop-The-World** e mais lento que Minor GC.

**Algoritmo Típico (Mark-Sweep-Compact):**

1. **Mark:** Percorre todas as referências de GC Roots, marca objetos alcançáveis
2. **Sweep:** Percorre heap, libera objetos não-marcados
3. **Compact:** Move objetos vivos para início do heap, eliminando fragmentação

### Stop-The-World (STW)

**Conceito:**

Para garantir consistência, GC precisa "parar o mundo" — suspender todas as threads da aplicação. Durante STW, nenhum código de aplicação executa, apenas GC.

**Por Que Necessário:**

Se aplicação continua executando enquanto GC coleta, referências mudam constanticamente — GC pode:
- Coletar objeto ainda vivo (corrupção)
- Perder objetos (memory leak)
- Ver estado inconsistente (crash)

**Trade-off:**

- **STW Completo:** Simples, seguro, mas pausa toda aplicação (ruim para latência)
- **Concurrent GC:** Coleta enquanto aplicação roda (pausas menores), mas mais complexo e overhead de sincronização

### Algoritmos de GC Principais

#### Serial GC

**Características:**

- Single-threaded
- STW para coletas
- Simples e eficiente para heaps pequenos (<100MB)

**Uso:** Aplicações desktop simples, ambientes com CPU única

**Flag:** `-XX:+UseSerialGC`

#### Parallel GC (Throughput Collector)

**Características:**

- Multi-threaded (usa múltiplas threads para coletar)
- STW para coletas
- Otimizado para **throughput** (máximo processamento)

**Uso:** Aplicações batch, processamento em lote onde pausas são aceitáveis

**Flag:** `-XX:+UseParallelGC`

#### Concurrent Mark-Sweep (CMS)

**Características:**

- Minimiza pausas coletando concorrentemente com aplicação
- Maioria do trabalho é feito concorrentemente (apenas fases curtas são STW)
- Não compacta heap (fragmentação pode ser problema)

**Uso:** Aplicações web com requisitos de baixa latência

**Flag:** `-XX:+UseConcMarkSweepGC` (deprecated Java 9, removed Java 14)

#### G1 GC (Garbage-First)

**Características:**

- Padrão desde Java 9
- Divide heap em regiões pequenas (~2000 regiões)
- Coleta regiões com mais lixo primeiro (daí "garbage-first")
- Balanço entre throughput e latency
- Pausas previsíveis (pode configurar target de pausa: `-XX:MaxGCPauseMillis`)

**Uso:** Heaps grandes (>4GB), aplicações com requisitos balanceados de throughput/latency

**Flag:** `-XX:+UseG1GC`

#### ZGC e Shenandoah

**Características:**

- **Ultra-low latency:** Pausas <10ms mesmo para heaps multi-terabyte
- Coleta quase totalmente concorrente
- Usa técnicas avançadas (colored pointers, load barriers)

**Uso:** Aplicações com SLAs estritos de latência, heaps muito grandes

**Flags:** `-XX:+UseZGC`, `-XX:+UseShenandoahGC`

---

## 🔍 Análise Conceitual Profunda

### Ciclo de Vida de Objetos

#### Alocação

```java
MyClass obj = new MyClass();
```

**O Que Acontece:**

1. JVM determina tamanho necessário para objeto (fields + header)
2. **Tenta alocar em TLAB** (Thread-Local Allocation Buffer) — buffer privado de cada thread em Eden para alocações lock-free
3. Se TLAB cheio, aloca diretamente em Eden (com lock)
4. Se Eden cheio, dispara **Minor GC**
5. Após GC, tenta novamente
6. Se falhar, tenta alocar diretamente em Old Gen
7. Se falhar, dispara **Full GC**
8. Se ainda falhar, lança `OutOfMemoryError`

**Conceito de TLAB:**

TLAB permite alocações rápidas sem contenção entre threads. Cada thread tem buffer privado; quando esgota, requisita novo.

#### Vida no Young Gen

```java
void processarPedido() {
    StringBuilder temp = new StringBuilder();  // Alocado em Eden
    temp.append("Pedido: ");
    temp.append(numeroPedido);

    String mensagem = temp.toString();  // StringBuilder pode virar lixo aqui
    enviarEmail(mensagem);

    // StringBuilder 'temp' não é mais referenciado → elegível para GC
}
```

**Comportamento:**

- `StringBuilder` alocado em Eden
- Quando método termina, `temp` sai de escopo
- `StringBuilder` não é mais alcançável de GC Roots
- Próximo Minor GC coleta esse objeto

**Conceito:** Objetos temporários (como `temp`) frequentemente morrem antes de Minor GC, sendo coletados sem custo (região inteira é limpa).

#### Promoção para Old Gen

```java
class Cache {
    private static Map<String, Data> cache = new HashMap<>();  // Static field = GC Root
}
```

**Comportamento:**

- `HashMap` sobrevive Minor GCs repetidos (pois é alcançável de static field)
- Após N sobrevivências (threshold), promovido para Old Gen
- Permanece lá indefinidamente (até aplicação terminar ou cache ser limpo)

**Conceito:** Objetos de longa vida naturalmente migram para Old Gen onde coletas são raras.

### Tipos de Coleta

#### Minor GC (Young Generation Collection)

**Quando Ocorre:** Eden space está cheio

**O Que Faz:**

- Copia objetos vivos de Eden para Survivor
- Copia objetos de um Survivor para outro
- Promove objetos antigos para Old Gen

**Características:**

- **Rápido:** Tipicamente <10ms
- **Frequente:** Pode acontecer centenas de vezes por segundo em aplicações intensivas
- **STW:** Para aplicação, mas pausa é curta

**Exemplo de Log:**

```
[GC (Allocation Failure) [PSYoungGen: 2048K->512K(2560K)] 2048K->600K(9728K), 0.0023456 secs]
```

Interpretação: Young Gen reduziu de 2048K para 512K; heap total de 2048K para 600K; levou 2.3ms.

#### Major GC / Full GC

**Quando Ocorre:** Old Gen está cheio ou espaço insuficiente para promoção

**O Que Faz:**

- Coleta Old Gen (e geralmente Young Gen também)
- Compacta memória

**Características:**

- **Lento:** Pode levar segundos em heaps grandes
- **Raro:** Idealmente acontece raramente
- **STW:** Pausa longa é impacto principal

**Exemplo de Log:**

```
[Full GC (Ergonomics) [PSYoungGen: 512K->0K(2560K)] [ParOldGen: 6000K->4500K(7168K)] 6512K->4500K(9728K), 0.1234567 secs]
```

Interpretação: Full GC coletou Young e Old; Old Gen reduziu de 6000K para 4500K; levou 123ms.

### Fragmentação e Compactação

**Problema da Fragmentação:**

```
Heap antes de alocações:
[                                  ] (vazio)

Após alocações/desalocações:
[Obj1][     ][Obj3][  ][Obj5][         ]
      ↑ livre     ↑ livre    ↑ livre
```

Muito espaço livre total, mas fragmentado. Alocação grande pode falhar mesmo havendo espaço total suficiente.

**Solução: Compactação**

```
Heap após compactação:
[Obj1][Obj3][Obj5][                    ]
                   ↑ espaço livre contíguo
```

Objetos vivos movidos para início, liberando bloco contíguo ao final.

**Trade-off:**

- **Vantagem:** Elimina fragmentação, alocações futuras são rápidas (pointer bump allocation)
- **Desvantagem:** Mover objetos é caro (copiar memória, atualizar referências)

**Algoritmos:**

- **Copying GC (Young Gen):** Compacta implicitamente ao copiar objetos vivos
- **Mark-Compact (Old Gen):** Fase explícita de compactação após sweep

### Referências Especiais

Java oferece tipos de referência além de strong references para controle fino sobre coleta.

#### Strong References (Padrão)

```java
MyClass obj = new MyClass();  // Strong reference
```

**Comportamento:** Objeto nunca é coletado enquanto strong reference existe.

#### Soft References

```java
SoftReference<MyClass> soft = new SoftReference<>(new MyClass());
```

**Comportamento:** GC pode coletar objeto se memória estiver baixa. Útil para **caches sensíveis a memória**.

**Uso:**

```java
// Cache que libera memória sob pressão
SoftReference<CachedData> cache = new SoftReference<>(loadData());

CachedData data = cache.get();  // Pode retornar null se GC coletou
if (data == null) {
    data = loadData();  // Recarregar se foi coletado
    cache = new SoftReference<>(data);
}
```

#### Weak References

```java
WeakReference<MyClass> weak = new WeakReference<>(new MyClass());
```

**Comportamento:** Objeto é coletado no próximo GC, independentemente de memória disponível.

**Uso:** **WeakHashMap** para associações onde valor não deve impedir coleta de chave.

```java
WeakHashMap<Key, Value> map = new WeakHashMap<>();
Key key = new Key();
map.put(key, value);

key = null;  // Chave não é mais fortemente referenciada
// Próximo GC pode coletar entrada do map automaticamente
```

#### Phantom References

```java
PhantomReference<MyClass> phantom = new PhantomReference<>(new MyClass(), queue);
```

**Comportamento:** Objeto é enfileirado em ReferenceQueue após ser determinado como coletável, mas antes de memória ser liberada.

**Uso:** **Cleanup actions** mais confiáveis que `finalize()`.

---

## 🎯 Aplicabilidade e Contextos

### Quando Ajustar GC

**Cenário 1: Aplicação Web com SLA de Latência**

**Requisito:** Pausas de GC não podem exceder 100ms

**Raciocínio:** G1 GC com target de pausa configurado

```bash
java -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -Xmx4g MyApp
```

**Cenário 2: Processamento Batch de Alto Throughput**

**Requisito:** Máximo processamento possível, pausas são aceitáveis

**Raciocínio:** Parallel GC otimiza para throughput

```bash
java -XX:+UseParallelGC -Xmx8g BatchJob
```

**Cenário 3: Trading System Ultra-Low Latency**

**Requisito:** Pausas devem ser <10ms consistentemente

**Raciocínio:** ZGC para pausas ultra-baixas

```bash
java -XX:+UseZGC -Xmx16g TradingApp
```

### Monitoramento de GC

**Habilitar Logs de GC:**

```bash
# Java 8
java -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log MyApp

# Java 9+
java -Xlog:gc*:file=gc.log:time,uptime,level,tags MyApp
```

**Ferramentas de Análise:**

- **GCViewer:** Visualiza logs de GC
- **GCEasy:** Análise online de logs
- **JVisualVM:** Monitoramento em tempo real
- **Java Mission Control:** Profiling avançado

---

## ⚠️ Limitações e Considerações

### 1. Pausas Stop-The-World

**Limitação:** Mesmo GCs de baixa latência têm pausas

**Mitigação:** Escolher GC apropriado para requisitos de latência

### 2. Overhead de CPU

**Limitação:** GCs concorrentes usam CPU para coletar enquanto aplicação roda

**Trade-off:** Latência menor vs throughput menor

### 3. Não-Determinismo

**Limitação:** Não há garantia de quando GC executa ou quando `finalize()` é chamado

**Implicação:** Não confiar em `finalize()` para cleanup crítico (usar try-with-resources)

### 4. Tuning Complexo

**Limitação:** Otimizar GC para workload específico requer expertise

**Mitigação:** Começar com defaults; ajustar apenas se profiling mostrar problemas

---

## 🔗 Interconexões Conceituais

### Relação com JVM

GC é subsistema da JVM que gerencia Heap. Interage com:
- **ClassLoader:** Metadados de classes em Metaspace
- **Execution Engine:** Pausas STW afetam execução
- **JIT Compiler:** Código compilado pode ter barreiras de leitura/escrita para GC concorrente

### Relação com Performance

GC é fator dominante de performance em muitas aplicações. Pausas longas ou frequentes degradam latência e throughput.

### Relação com Segurança

GC elimina vulnerabilidades de gerenciamento manual (use-after-free, double-free) mas introduz não-determinismo.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Tuning de GC:** Flags e estratégias de otimização
2. **Análise de Heap Dumps:** Identificar memory leaks
3. **Profiling:** Identificar hotspots de alocação
4. **Weak/Soft/Phantom References:** Uso avançado

---

## 📚 Conclusão

**Garbage Collection** é fundamento que permite Java abstrair gerenciamento de memória, eliminando classes inteiras de bugs e simplificando desenvolvimento. Hipótese geracional (objetos jovens morrem rápido) embasa arquitetura de Young/Old Generations que otimiza para padrões comuns de alocação. Algoritmos variam de simples (Serial) a sofisticados (ZGC), cada um com trade-offs de throughput, latency e overhead. Compreender GC é essencial para diagnosticar problemas de performance, escolher JVM flags apropriados e escrever código memory-efficient. O custo é não-determinismo e pausas, mas benefício de segurança e produtividade supera largamente essas limitações para maioria das aplicações.
