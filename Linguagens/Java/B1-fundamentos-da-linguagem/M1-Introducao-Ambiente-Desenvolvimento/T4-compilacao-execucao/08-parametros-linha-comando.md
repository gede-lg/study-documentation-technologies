# Parâmetros de Linha de Comando

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Parâmetros de Linha de Comando** são **argumentos passados para aplicação Java quando invocada** via comando `java`, permitindo customizar comportamento da aplicação e da JVM sem modificar código-fonte. Conceitualmente, são **configurações dinâmicas** que ajustam execução em runtime — seja comportamento da JVM (memória, GC, otimizações) ou dados de entrada para a aplicação.

Existem **duas categorias distintas**:

1. **JVM Options (Flags):** Parâmetros precedem nome da classe, controlam JVM (heap size, GC algorithm, verbosity)
   ```bash
   java -Xmx2g -XX:+UseG1GC MyApp
   ```

2. **Application Arguments:** Parâmetros seguem nome da classe, passados para array `String[] args` em `main()`
   ```bash
   java MyApp arg1 arg2
   ```

Essa separação reflete **separação de responsabilidades**: JVM flags configuram plataforma (abstração); application args configuram lógica de negócio (aplicação).

### Contexto Histórico e Motivação

**Origem Unix:**

Convenção de parâmetros de linha de comando vem de Unix (anos 1970), onde programas aceitam argumentos para customização:

```bash
ls -la /home/user        # -la são flags, /home/user é argumento
grep -i "pattern" file   # -i é flag, "pattern" e file são argumentos
```

**Adoção em Java:**

Java 1.0 (1996) adotou essa convenção, mas expandiu para incluir **JVM-specific flags** que não existem em linguagens compiladas nativas. Motivação:

- **Portabilidade:** Mesmo bytecode roda com configurações diferentes (heap grande em servidor, pequena em desktop)
- **Tuning:** Otimizar performance sem recompilar (escolher GC, tamanho de heap)
- **Debugging:** Habilitar verbosity, profiling, remote debugging sem modificar código

**Evolução:**

- **Java 1.0-1.2:** Flags básicas (-Xmx, -Xms, -verbose)
- **Java 1.3+:** HotSpot VM introduziu `-XX:` flags para tuning avançado
- **Java 5+:** Ergonomics — JVM escolhe defaults baseado em hardware
- **Java 9+:** Unified Logging (`-Xlog`), deprecação de flags obsoletas
- **Java 11+:** Flags experimentais para novos GCs (ZGC, Shenandoah)

**Motivação Principal:**

1. **Flexibilidade:** Mesmo .jar roda diferentemente em dev (low memory) vs produção (high memory)
2. **Observabilidade:** Habilitar logging, metrics, profiling em produção sem rebuild
3. **Performance Tuning:** Ajustar GC, compilation, memory para workload específico
4. **Compatibilidade:** Flags permitem manter compatibilidade backward (desabilitar features novas)

### Problema Fundamental que Resolve

**1. Configuração Estática vs Dinâmica:**

Sem parâmetros, configurações estariam hardcoded ou em arquivos. Parâmetros permitem **configuração ad-hoc** (mudar comportamento sem editar arquivos ou recompilar).

**2. Ambiente-Specific Settings:**

Mesma aplicação pode precisar configurações diferentes em dev, staging, produção. Parâmetros permitem essa diferenciação sem duplicar código.

**3. Debugging e Profiling:**

Habilitar verbosity, remote debugging, heap dumps sem modificar código-fonte.

**4. Resource Constraints:**

Hardware varia (laptop com 4GB vs servidor com 128GB). JVM flags permitem otimizar uso de recursos para ambiente específico.

### Importância no Ecossistema

Parâmetros de linha de comando são **fundamento operacional**:

- **DevOps:** Scripts de deployment configuram JVM flags dinamicamente
- **CI/CD:** Pipelines rodam testes com diferentes configurações via flags
- **Containers (Docker/Kubernetes):** Variáveis de ambiente transformadas em flags
- **Application Servers:** Tomcat, JBoss customizam JVM via flags em scripts de startup

**Abstração de Configuração** permite operadores (não-desenvolvedores) otimizar aplicações sem tocar em código.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Dualidade JVM vs Application:** Flags antes do classname configuram JVM; argumentos após configuram aplicação
2. **Tipos de Flags:** Standard (`-X`), Non-Standard (`-XX:`), Experimental
3. **Precedência:** Flags posteriores sobrescrevem anteriores
4. **Passagem de Argumentos:** Array `String[] args` em `main()` recebe argumentos
5. **Parsing:** Aplicação deve parsear/validar argumentos

### Pilares Fundamentais

- **Standard Options:** Definidas pela especificação Java, suportadas por todas as JVMs (`-cp`, `-version`)
- **Non-Standard Options:** Específicas da JVM (HotSpot), começam com `-X` (`-Xmx`, `-Xms`)
- **Advanced Options:** Flags avançadas, começam com `-XX:` (`-XX:+UseG1GC`)
- **Boolean Flags:** `-XX:+Flag` habilita, `-XX:-Flag` desabilita
- **Valued Flags:** `-XX:Name=Value` define valor

### Nuances Importantes

- **Deprecation:** Flags podem ser marcadas deprecated ou removidas entre versões
- **Experimental Flags:** Requerem `-XX:+UnlockExperimentalVMOptions`
- **Diagnostic Flags:** Requerem `-XX:+UnlockDiagnosticVMOptions`
- **Ergonomics:** JVM escolhe defaults inteligentes se flags não especificadas
- **Flag Validation:** `-XX:+PrintFlagsFinal` mostra valores efetivos de todas as flags

---

## 🧠 Fundamentos Teóricos

### Categorias de Parâmetros

#### 1. Standard Options

**Definição:** Flags definidas pela especificação Java, suportadas por **todas as JVMs** (HotSpot, OpenJ9, GraalVM).

**Sintaxe:** Começam com `-` (um hífen).

**Exemplos Comuns:**

```bash
java -version                    # Mostra versão da JVM
java -cp /path/to/classes MyApp  # Define classpath
java -D<name>=<value> MyApp      # Define system property
java --help                      # Mostra ajuda (Java 9+)
```

**Conceito:** Standard options são **portáveis** — funcionam em qualquer JVM conforme especificação.

#### 2. Non-Standard Options (`-X`)

**Definição:** Flags específicas da implementação da JVM, não garantidas pela especificação. Começam com `-X`.

**Exemplos Comuns:**

```bash
java -Xmx2g MyApp       # Heap máxima de 2GB
java -Xms512m MyApp     # Heap inicial de 512MB
java -Xss1m MyApp       # Tamanho da stack por thread = 1MB
```

**Conceito:** `-X` flags são **comuns entre JVMs** (maioria suporta `-Xmx`, `-Xms`) mas não **garantidas** pela especificação.

#### 3. Advanced Runtime Options (`-XX:`)

**Definição:** Flags avançadas para tuning detalhado da JVM. Específicas da implementação (HotSpot).

**Sintaxe:**

```bash
-XX:+FlagName    # Habilita flag booleana
-XX:-FlagName    # Desabilita flag booleana
-XX:Name=Value   # Define flag com valor
```

**Exemplos Comuns:**

```bash
java -XX:+UseG1GC MyApp                  # Usa G1 GC
java -XX:MaxGCPauseMillis=200 MyApp      # Target de pausa de GC = 200ms
java -XX:+PrintGCDetails MyApp           # Imprime detalhes de GC (deprecated)
java -XX:+HeapDumpOnOutOfMemoryError MyApp  # Gera heap dump se OOM
```

**Conceito:** `-XX:` flags são **altamente específicas** da JVM. Podem mudar ou ser removidas entre versões.

### Flags de Memória

#### Heap Size

**Conceito:** Heap é onde objetos Java são alocados. Tamanho impacta performance e uso de memória.

**Flags:**

```bash
-Xms<size>    # Heap inicial (start)
-Xmx<size>    # Heap máxima (max)
```

**Unidades:**
- `k` ou `K`: Kilobytes
- `m` ou `M`: Megabytes
- `g` ou `G`: Gigabytes

**Exemplo:**

```bash
java -Xms1g -Xmx4g MyApp
```

**Significado:**
- Heap inicial = 1GB (alocado no startup)
- Heap máxima = 4GB (pode crescer até isso)

**Raciocínio de Uso:**

- **Xms = Xmx:** Evita overhead de resize de heap (útil em produção com carga previsível)
- **Xms < Xmx:** Permite heap crescer sob demanda (útil em ambiente com memória limitada)

**Trade-off:**
- **Heap grande:** Menos GCs, mas GCs mais longos; mais memória usada
- **Heap pequena:** GCs frequentes, mas rápidos; menos memória usada

#### Metaspace / Permanent Generation

**Conceito:** Área de memória para **metadados de classes** (Class objects, method data, constant pools).

**Java 7 e anteriores: PermGen**

```bash
-XX:PermSize=128m        # PermGen inicial
-XX:MaxPermSize=256m     # PermGen máxima
```

**Java 8+: Metaspace**

```bash
-XX:MetaspaceSize=128m      # Threshold inicial para Full GC de Metaspace
-XX:MaxMetaspaceSize=256m   # Metaspace máxima (padrão: ilimitada)
```

**Diferença Conceitual:**

- **PermGen:** Parte do heap da JVM, tamanho fixo
- **Metaspace:** Usa memória nativa (fora do heap), tamanho dinâmico

**Quando Ajustar:**

Aplicações que carregam muitas classes dinamicamente (application servers com hot deployment, frameworks que usam bytecode generation).

#### Stack Size

**Conceito:** Cada thread tem stack privada para variáveis locais e call frames. Stack overflow ocorre se recursão é muito profunda.

```bash
-Xss<size>    # Stack size por thread
```

**Exemplo:**

```bash
java -Xss512k MyApp    # Stack de 512KB por thread
```

**Trade-off:**
- **Stack grande:** Suporta recursão profunda, mas mais memória por thread
- **Stack pequena:** Economiza memória, mas limita profundidade de recursão

**Default:** ~1MB (varia por plataforma)

### Flags de Garbage Collection

#### Escolhendo GC

```bash
-XX:+UseSerialGC           # Serial GC (single-threaded)
-XX:+UseParallelGC         # Parallel GC (default até Java 8)
-XX:+UseG1GC               # G1 GC (default desde Java 9)
-XX:+UseConcMarkSweepGC    # CMS GC (deprecated Java 9, removido Java 14)
-XX:+UseZGC                # ZGC (low-latency, Java 11+)
-XX:+UseShenandoahGC       # Shenandoah GC (low-latency, Java 12+)
```

**Conceito:** Cada GC tem trade-offs de throughput, latência, overhead de CPU.

#### Tuning de GC

**G1 GC:**

```bash
-XX:MaxGCPauseMillis=200       # Target de pausa (não garantia!)
-XX:G1HeapRegionSize=16m       # Tamanho de região do G1
-XX:InitiatingHeapOccupancyPercent=45  # Threshold para iniciar marking cycle
```

**Parallel GC:**

```bash
-XX:ParallelGCThreads=8        # Número de threads para GC
-XX:MaxGCPauseMillis=100       # Target de pausa
```

**Conceito:** Tuning de GC é **arte empírica** — testar com carga real, medir, ajustar.

### Flags de JIT Compiler

#### Tiered Compilation

```bash
-XX:+TieredCompilation         # Habilita tiered compilation (default)
-XX:TieredStopAtLevel=1        # Para em C1 (sem C2 optimizations)
```

**Conceito:** Tiered compilation usa C1 (rápido, otimizações leves) e C2 (lento, otimizações agressivas).

#### Compilation Threshold

```bash
-XX:CompileThreshold=10000     # Número de invocações antes de compilar (C2)
```

**Trade-off:**
- **Baixo threshold:** Compila cedo, menos tempo interpretando (melhor para long-running apps)
- **Alto threshold:** Compila tarde, melhor profiling data (melhor para short-lived apps)

### Flags de Logging e Debugging

#### Verbosity

```bash
-verbose:class       # Log de carregamento de classes
-verbose:gc          # Log básico de GC
```

#### GC Logging (Java 8)

```bash
-XX:+PrintGCDetails                # Detalhes de GC
-XX:+PrintGCDateStamps             # Timestamps
-Xloggc:/path/to/gc.log            # Output para arquivo
```

#### Unified Logging (Java 9+)

```bash
-Xlog:gc*:file=/path/to/gc.log:time,level,tags
-Xlog:class+load=info              # Log de carregamento de classes
-Xlog:all=warning:file=/path/to/vm.log  # Todos os logs warning+
```

**Conceito:** `-Xlog` unificou todos os mecanismos de logging da JVM.

#### Remote Debugging

```bash
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
```

**Significado:**
- `transport=dt_socket`: Usa sockets TCP
- `server=y`: JVM é servidor (IDE conecta a ela)
- `suspend=n`: Não suspende no startup (use `y` para debug desde início)
- `address=*:5005`: Escuta em todas as interfaces, porta 5005

**Uso:**

1. Inicie app com flag acima
2. Configure IDE para conectar em `localhost:5005`
3. Set breakpoints, debug normalmente

#### Heap Dump

```bash
-XX:+HeapDumpOnOutOfMemoryError          # Gera dump se OOM
-XX:HeapDumpPath=/path/to/dump.hprof     # Local do dump
```

**Uso:** Diagnosticar memory leaks analisando heap dump com ferramentas (Eclipse MAT, VisualVM).

### System Properties (`-D`)

**Sintaxe:**

```bash
java -Dname=value MyApp
```

**Acesso em Código:**

```java
String value = System.getProperty("name");
```

**Exemplo:**

```bash
java -Denv=production -Dlog.level=INFO MyApp
```

```java
// Em MyApp
public static void main(String[] args) {
    String env = System.getProperty("env");         // "production"
    String logLevel = System.getProperty("log.level");  // "INFO"

    if ("production".equals(env)) {
        // Configuração de produção
    }
}
```

**Uso Comum:**

- Configurar ambiente (dev/staging/prod)
- Passar configurações sem hardcoding
- Frameworks usam properties (ex: `spring.profiles.active`)

---

## 🔍 Análise Conceitual Profunda

### Application Arguments

**Passagem e Acesso:**

```bash
java MyApp arg1 arg2 "arg with spaces"
```

```java
public class MyApp {
    public static void main(String[] args) {
        // args = ["arg1", "arg2", "arg with spaces"]

        System.out.println("Número de argumentos: " + args.length);

        for (int i = 0; i < args.length; i++) {
            System.out.println("args[" + i + "] = " + args[i]);
        }
    }
}
```

**Output:**

```
Número de argumentos: 3
args[0] = arg1
args[1] = arg2
args[2] = arg with spaces
```

**Conceito:** JVM popula array `args` com argumentos após nome da classe. Aplicação é responsável por interpretar significado.

### Parsing de Argumentos

**Abordagem Manual:**

```java
public class FileProcessor {
    public static void main(String[] args) {
        if (args.length < 2) {
            System.err.println("Uso: FileProcessor <input> <output>");
            System.exit(1);
        }

        String inputFile = args[0];
        String outputFile = args[1];

        processFile(inputFile, outputFile);
    }
}
```

**Limitação:** Não suporta flags (`-v`, `--verbose`), opções (`--output=file`).

**Bibliotecas de Parsing:**

- **Apache Commons CLI:** Parsing robusto de argumentos
- **JCommander:** Annotations-based parsing
- **Picocli:** Moderno, annotations, auto-completion

**Exemplo com Picocli:**

```java
import picocli.CommandLine;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;

@Command(name = "fileprocessor", description = "Processa arquivos")
class FileProcessor implements Runnable {

    @Parameters(index = "0", description = "Arquivo de entrada")
    private String inputFile;

    @Parameters(index = "1", description = "Arquivo de saída")
    private String outputFile;

    @Option(names = {"-v", "--verbose"}, description = "Modo verbose")
    private boolean verbose;

    @Option(names = {"-f", "--format"}, description = "Formato de saída")
    private String format = "text";  // Default

    public void run() {
        if (verbose) {
            System.out.println("Processando " + inputFile + " -> " + outputFile);
            System.out.println("Formato: " + format);
        }

        // Lógica de processamento...
    }

    public static void main(String[] args) {
        int exitCode = new CommandLine(new FileProcessor()).execute(args);
        System.exit(exitCode);
    }
}
```

**Uso:**

```bash
java FileProcessor input.txt output.txt -v --format=json
```

**Conceito:** Bibliotecas de parsing abstraem complexidade de flags, validação, help generation.

### Ordem e Precedência de Flags

**Regra Geral:** Flags posteriores sobrescrevem anteriores.

**Exemplo:**

```bash
java -Xmx1g -Xmx2g MyApp
```

**Resultado:** Heap máxima = 2GB (segundo `-Xmx` sobrescreve primeiro).

**Uso Prático:**

Scripts podem ter defaults, usuário sobrescreve:

```bash
# script.sh
JAVA_OPTS="-Xmx1g -XX:+UseG1GC"
java $JAVA_OPTS -Xmx4g MyApp  # User override: heap = 4GB
```

### Flags Experimentais e Diagnostic

**Experimental Flags:**

Flags não-estáveis, podem mudar semanticamente entre versões.

**Habilitação:**

```bash
-XX:+UnlockExperimentalVMOptions -XX:+UseZGC
```

**Diagnostic Flags:**

Flags para debugging interno da JVM.

**Habilitação:**

```bash
-XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining
```

**Conceito:** Unlock flags são "safety check" — usuario aceita instabilidade/não-documentação.

### Validando Flags Efetivas

**Ver Todos os Valores:**

```bash
java -XX:+PrintFlagsFinal -version
```

**Output (exemplo parcial):**

```
bool UseG1GC                   = true
uintx MaxHeapSize              = 4294967296
uintx InitialHeapSize          = 268435456
```

**Uso:** Diagnosticar quais defaults foram aplicados, confirmar flags customizadas.

**Filtrar Flags Específicas:**

```bash
java -XX:+PrintFlagsFinal -version | grep HeapSize
```

---

## 🎯 Aplicabilidade e Contextos

### Cenário 1: Desenvolvimento Local

**Requisito:** Rápido startup, baixo uso de memória

**Flags:**

```bash
java -Xmx512m -Xms512m -XX:TieredStopAtLevel=1 MyApp
```

**Raciocínio:**
- Heap pequena (economiza memória)
- Tier 1 apenas (startup mais rápido, sem C2 optimizations)

### Cenário 2: Produção Web Application

**Requisito:** Baixa latência, alta disponibilidade

**Flags:**

```bash
java -Xms4g -Xmx4g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=100 \
     -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/var/log/heapdump.hprof \
     -Xlog:gc*:file=/var/log/gc.log:time \
     MyApp
```

**Raciocínio:**
- Heap fixa 4GB (evita resize)
- G1 com target de pausa baixo
- Heap dump se OOM (post-mortem debugging)
- GC logging para análise

### Cenário 3: Batch Processing

**Requisito:** Máximo throughput, pausas aceitáveis

**Flags:**

```bash
java -Xms8g -Xmx8g \
     -XX:+UseParallelGC \
     -XX:ParallelGCThreads=16 \
     BatchJob
```

**Raciocínio:**
- Heap grande
- Parallel GC otimizado para throughput
- Muitas threads de GC (se servidor tem muitos cores)

### Cenário 4: Trading System (Ultra-Low Latency)

**Requisito:** Pausas <1ms consistentemente

**Flags:**

```bash
java -Xms16g -Xmx16g \
     -XX:+UseZGC \
     -XX:+AlwaysPreTouch \
     TradingApp
```

**Raciocínio:**
- ZGC para pausas ultra-baixas
- `-XX:+AlwaysPreTouch`: Pré-aloca toda a heap no startup (evita page faults)

---

## ⚠️ Limitações e Considerações

### 1. Flags Deprecated/Removed

**Limitação:** Flags podem ser removidas entre versões Java.

**Exemplo:**

- `-XX:+UseConcMarkSweepGC`: Deprecated Java 9, removed Java 14
- `-XX:+PrintGCDetails`: Deprecated Java 9, replaced by `-Xlog:gc*`

**Mitigação:** Consultar release notes ao atualizar Java, usar `-XX:+PrintFlagsFinal` para validar.

### 2. Complexidade de Tuning

**Limitação:** Centenas de flags, interações complexas, comportamento não-intuitivo.

**Mitigação:**
- Começar com defaults (ergonomics escolhe bem)
- Tunar apenas se profiling mostrar problemas específicos
- Documentar raciocínio de cada flag customizada

### 3. Portabilidade

**Limitação:** `-XX:` flags são específicas da JVM (HotSpot). Código pode rodar em outras JVMs (OpenJ9, GraalVM).

**Mitigação:** Usar flags portáveis quando possível; documentar dependências de JVM específica.

---

## 🔗 Interconexões Conceituais

### Relação com JVM

Flags configuram subsistemas da JVM: heap (memory management), GC (garbage collection), JIT (compilation), ClassLoader (class loading).

### Relação com Performance

Tuning de flags é principal forma de otimizar performance de aplicação Java sem modificar código.

### Relação com DevOps

Scripts de deployment, containers (Dockerfile), orchestrators (Kubernetes) usam flags para configurar aplicações dinamicamente.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **JVM Ergonomics:** Como JVM escolhe defaults automaticamente
2. **GC Tuning Avançado:** Análise de logs, ajuste fino de flags
3. **JMX e Monitoring:** Expor metrics via JMX
4. **AOT Compilation:** GraalVM Native Image

### Tendências Futuras

- **Simplificação:** Menos flags necessárias, melhores defaults
- **Observabilidade Integrada:** Logs estruturados, tracing built-in
- **Cloud-Native:** Flags otimizadas para containers, serverless

---

## 📚 Conclusão

**Parâmetros de Linha de Comando** são mecanismo fundamental para configurar JVM e aplicações Java sem modificar código-fonte. Flags JVM (`-X`, `-XX:`) controlam heap, GC, JIT, logging; application arguments configuram lógica de negócio. System properties (`-D`) permitem passar configurações customizadas. Categorias de flags (standard, non-standard, advanced) oferecem níveis crescentes de controle com trade-offs de portabilidade e estabilidade. Tuning de JVM via flags é arte empírica — começar com defaults, medir com profiling, ajustar iterativamente. Compreender flags é essencial para otimizar performance, diagnosticar problemas, e operar aplicações Java em produção. Trade-off fundamental é complexidade (centenas de flags, interações sutis) vs flexibilidade (customização fine-grained sem recompilar).
