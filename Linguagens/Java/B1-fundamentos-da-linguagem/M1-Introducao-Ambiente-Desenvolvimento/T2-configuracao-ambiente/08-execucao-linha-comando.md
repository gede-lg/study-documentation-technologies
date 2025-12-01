# Execução via Linha de Comando (java)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Execução via linha de comando** é o processo de iniciar e rodar aplicações Java compiladas utilizando o comando `java` diretamente do terminal, invocando a JVM (Java Virtual Machine) para interpretar e executar bytecode. Conceitualmente, é a **interação direta com o runtime Java**, expondo o desenvolvedor ao mecanismo fundamental de como programas Java são executados.

O comando `java` é o launcher da JVM incluído no JDK e JRE. Ele **carrega classes**, **verifica bytecode**, **inicializa JVM**, **invoca método main**, e **gerencia execução** até o programa terminar. Executar via linha de comando revela o processo que IDEs automatizam ao clicar no botão "Run".

Dominar execução manual é **essencial para deployment**, **troubleshooting de runtime**, e **compreensão de performance**. Quando aplicação falha em produção com erro obscuro, entender flags e opções da JVM permite diagnosticar problemas de memória, threading, classloading que abstrações ocultam.

### Contexto Histórico e Motivação

Desde o lançamento de Java em 1995, o comando `java` é interface primária para executar aplicações. Antes de servidores de aplicação e containers modernos, aplicações Java rodavam diretamente via `java -jar app.jar` em servidores.

Com evolução do ecossistema (Tomcat, JBoss, Docker, Kubernetes), execução direta tornou-se menos visível, mas permanece **fundamental em:**

1. **Desenvolvimento Local:** Testar aplicações antes de empacotar em containers
2. **Scripts de Automação:** Executar jobs batch, utilitários
3. **Debugging:** Rodar com flags de debug remotas
4. **Performance Tuning:** Ajustar heap, garbage collector via flags JVM
5. **Troubleshooting:** Reproduzir problemas de produção localmente

### Problema Fundamental que Resolve

**1. Transformação de Bytecode em Execução:**
Bytecode (.class) é estático. JVM transforma em processo vivo que executa instruções, aloca memória, gerencia threads.

**2. Abstração de Plataforma:**
Mesmo bytecode executa em Windows, Linux, macOS através de JVMs específicas. `java` é interface universal.

**3. Gerenciamento de Recursos:**
JVM aloca heap, gerencia garbage collection, cria threads. Comando `java` permite configurar esses recursos via flags.

**4. Carregamento Dinâmico:**
ClassLoader carrega classes sob demanda. `java` inicia processo configurando classloaders.

**5. Integração com Sistema Operacional:**
JVM conecta programa Java ao OS: acessa sistema de arquivos, rede, threads nativas.

### Importância no Ecossistema

Execução via linha de comando é **skill crítica** para operação de aplicações Java:

- **Deployment:** Produção frequentemente roda JARs via `java -jar`
- **Performance Tuning:** Flags JVM (-Xmx, -XX:+UseG1GC) são essenciais para otimização
- **Debugging Remoto:** `-agentlib:jdwp` permite debuggers conectarem a aplicações rodando
- **Monitoramento:** `java` expõe JMX para ferramentas de monitoring

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sintaxe Básica:** `java [options] <mainclass> [args]` ou `java [options] -jar <jarfile> [args]`
2. **Flags JVM:** `-Xmx`, `-Xms`, `-XX:+UseG1GC`, `-Dproperties`
3. **Classpath:** Como JVM localiza classes em runtime
4. **Processo de Execução:** ClassLoading → Linking → Initialization → Invocação de main
5. **Garbage Collection:** Gerenciamento automático de memória

### Pilares Fundamentais

- **JVM como Ambiente de Execução:** Isola aplicação do OS, fornece serviços (GC, JIT)
- **ClassLoading Dinâmico:** Classes carregadas sob demanda
- **Bytecode Verification:** Segurança via verificação antes de execução
- **JIT Compilation:** Hotspots compilados para código nativo em runtime
- **Garbage Collection:** Memória gerenciada automaticamente

### Nuances Importantes

- **Heap vs Stack:** Heap para objetos, Stack para métodos/variáveis locais
- **GC Algorithms:** Serial, Parallel, G1, ZGC, Shenandoah
- **System Properties:** `-D` define propriedades acessíveis via `System.getProperty()`
- **Exit Codes:** main retorna (0 = sucesso, ≠0 = erro)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Fases da Execução

**1. Inicialização da JVM:**
- Aloca memória para heap e stack
- Inicializa garbage collector
- Cria ClassLoaders (Bootstrap, Extension, Application)

**2. ClassLoading (Carregamento):**
- Localiza Main.class via classpath
- Lê bytecode do arquivo .class
- Cria estrutura `Class<Main>` em memória

**3. Linking (Ligação):**
- **Verification:** Verifica que bytecode é válido e seguro
- **Preparation:** Aloca memória para variáveis static, inicializa com valores padrão
- **Resolution:** Resolve referências simbólicas (ex.: System.out) para referências diretas

**4. Initialization (Inicialização):**
- Executa blocos static e inicializadores de variáveis static
- Prepara classe para uso

**5. Invocação de main:**
- JVM invoca `public static void main(String[] args)`
- Passa argumentos de linha de comando via `args`

**6. Execução:**
- Interpretador executa bytecode
- JIT Compiler compila hotspots (código executado frequentemente) para código nativo
- Threads são gerenciadas
- Garbage Collector libera objetos não referenciados

**7. Shutdown:**
- main retorna ou `System.exit()` é chamado
- Shutdown hooks executam (se configurados)
- JVM termina, libera recursos do OS

#### ClassPath e ClassLoading

Quando `java Main` é executado:

1. JVM procura `Main.class` em classpath
2. ClassLoader lê bytecode
3. Se Main referencia `Helper`, ClassLoader carrega Helper.class
4. Processo continua recursivamente

**Conceito:** ClassLoading é lazy (sob demanda). Classes não usadas não são carregadas.

#### Garbage Collection

Objetos criados (`new Object()`) vivem no heap. Quando não há mais referências, GC recupera memória.

**Algoritmos:**
- **Serial GC:** Single-threaded, ideal para aplicações pequenas
- **Parallel GC:** Multi-threaded, maximiza throughput
- **G1 GC:** Balanceia throughput e latência, padrão em Java 9+
- **ZGC/Shenandoah:** Low-latency GC para aplicações grandes

**Flags:**
```bash
# G1 GC (padrão em Java 9+)
java -XX:+UseG1GC Main

# ZGC (baixa latência)
java -XX:+UseZGC Main
```

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

**Executar Classe:**

```bash
java Main
```

Executa `Main.class` (assumindo que está em diretório atual ou classpath).

**Executar JAR:**

```bash
java -jar app.jar
```

Executa JAR com Main-Class especificado no MANIFEST.MF.

**Sintaxe Completa:**

```bash
java [options] <mainclass> [args]
java [options] -jar <jarfile> [args]
```

### Flags e Opções Essenciais

#### `-cp` ou `-classpath` (Classpath)

Especifica onde JVM busca classes:

```bash
java -cp bin Main
```

Se Main.class está em `bin/`, JVM encontra e executa.

**Múltiplos Diretórios/JARs (Linux/macOS):**
```bash
java -cp bin:lib/commons-lang3.jar Main
```

**Múltiplos Diretórios/JARs (Windows):**
```cmd
java -cp "bin;lib\commons-lang3.jar" Main
```

**Conceito:** Classpath em runtime pode diferir de compilação. Deve incluir todas dependências.

#### `-Xmx` e `-Xms` (Heap Memory)

- **-Xms:** Heap inicial
- **-Xmx:** Heap máximo

```bash
java -Xms512m -Xmx2g Main
```

Inicia com 512MB heap, permite crescer até 2GB.

**Conceito:** Se aplicação usa mais memória que -Xmx, lança `OutOfMemoryError`.

**Recomendação:** Produção geralmente define -Xms = -Xmx (evita redimensionamentos de heap).

#### `-D<property>=<value>` (System Properties)

Define propriedades acessíveis via `System.getProperty()`:

```bash
java -Dapp.env=production -Dapp.port=8080 Main
```

**No código:**
```java
String env = System.getProperty("app.env");  // "production"
String port = System.getProperty("app.port"); // "8080"
```

**Uso:** Configuração de aplicação sem hardcoding.

#### `-verbose:class` (Verbose ClassLoading)

Mostra classes sendo carregadas:

```bash
java -verbose:class Main
```

**Output:**
```
[Loaded java.lang.Object from .../rt.jar]
[Loaded java.lang.String from .../rt.jar]
[Loaded Main from file:.../bin/]
```

**Uso:** Debugging de problemas de classloading.

#### `-agentlib:jdwp` (Remote Debugging)

Habilita debugging remoto:

```bash
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 Main
```

IDE (IntelliJ, Eclipse) pode conectar na porta 5005 e debugar.

**Flags:**
- `server=y`: JVM espera debugger conectar
- `suspend=y`: Suspende execução até debugger conectar
- `address=5005`: Porta de debug

#### `-XX` Flags (Advanced JVM Options)

**Garbage Collector:**
```bash
java -XX:+UseG1GC Main          # G1 GC
java -XX:+UseZGC Main           # ZGC (Java 11+)
java -XX:+UseSerialGC Main      # Serial GC
```

**GC Logging:**
```bash
java -Xlog:gc* Main  # Java 9+ unified logging
```

**Print JVM Flags:**
```bash
java -XX:+PrintFlagsFinal -version
```

### Executando com Argumentos

**Código:**
```java
public class Args {
    public static void main(String[] args) {
        for (int i = 0; i < args.length; i++) {
            System.out.println("args[" + i + "] = " + args[i]);
        }
    }
}
```

**Execução:**
```bash
java Args hello world 123
```

**Output:**
```
args[0] = hello
args[1] = world
args[2] = 123
```

**Conceito:** Argumentos após nome da classe são passados para `main(String[] args)`.

### Executando JARs

**Criar JAR com Main-Class:**

**MANIFEST.MF:**
```
Manifest-Version: 1.0
Main-Class: com.example.Main
```

**Criar JAR:**
```bash
jar cvfm app.jar MANIFEST.MF -C bin .
```

**Executar:**
```bash
java -jar app.jar
```

**Conceito:** `-jar` ignora classpath e usa JAR como único source. Dependências devem estar dentro do JAR ou especificadas em Class-Path do manifesto.

### Estrutura com Pacotes

**Código:**
```java
package com.example;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from package!");
    }
}
```

**Estrutura:**
```
bin/
  com/
    example/
      Main.class
```

**Executar:**
```bash
java -cp bin com.example.Main
```

**Conceito:** Fully qualified name inclui pacote. JVM busca `bin/com/example/Main.class`.

### Exemplo Completo com Dependências

**Estrutura:**
```
projeto/
  bin/
    com/example/Main.class
  lib/
    commons-lang3.jar
```

**Executar (Linux/macOS):**
```bash
java -cp bin:lib/commons-lang3.jar com.example.Main
```

**Executar (Windows):**
```cmd
java -cp "bin;lib\commons-lang3.jar" com.example.Main
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Executar via Linha de Comando

**Cenário 1: Deployment em Produção**
Servidores rodam JARs via `java -jar` com flags JVM otimizadas.

**Raciocínio:** Controle total sobre memória, GC, propriedades do sistema.

**Cenário 2: Scripts Batch/Cron Jobs**
Tarefas agendadas executam utilitários Java.

**Cenário 3: Performance Tuning**
Testar diferentes configurações de heap, GC.

**Exemplo:**
```bash
# Testar G1 vs ZGC
java -XX:+UseG1GC -Xmx4g -jar app.jar
java -XX:+UseZGC -Xmx4g -jar app.jar
```

**Cenário 4: Debugging Remoto**
Iniciar aplicação com debug port para IDE conectar.

---

## ⚠️ Limitações e Considerações

### Erros Comuns

**Erro 1: NoClassDefFoundError**

```bash
java Main
```

**Erro:**
```
Error: Could not find or load main class Main
Caused by: java.lang.ClassNotFoundException: Main
```

**Causa:** Main.class não está em classpath.

**Solução:** Adicionar `-cp`:
```bash
java -cp bin Main
```

**Erro 2: OutOfMemoryError**

```
java.lang.OutOfMemoryError: Java heap space
```

**Causa:** Heap insuficiente.

**Solução:** Aumentar -Xmx:
```bash
java -Xmx2g Main
```

**Erro 3: Executar JAR sem Main-Class**

```bash
java -jar app.jar
```

**Erro:**
```
no main manifest attribute, in app.jar
```

**Causa:** MANIFEST.MF não especifica Main-Class.

**Solução:** Adicionar ao manifesto ou executar classe diretamente:
```bash
java -cp app.jar com.example.Main
```

### Armadilhas

**Armadilha 1: Classpath Incorreto**

```bash
java -cp lib/commons-lang3.jar Main  # Main.class também precisa estar no classpath!
```

**Correto:**
```bash
java -cp .:lib/commons-lang3.jar Main  # Adiciona diretório atual
```

**Armadilha 2: Flags Após Main**

```bash
java Main -Xmx2g  # ERRADO: -Xmx é tratado como argumento para Main
```

**Correto:**
```bash
java -Xmx2g Main  # Flags JVM antes do main class
```

---

## 🔗 Interconexões Conceituais

### Relação com Compilação

Execução depende de compilação prévia. `java` executa bytecode gerado por `javac`.

### Relação com JVM

`java` é launcher que inicializa JVM. Entender JVM internals (heap, GC, JIT) otimiza uso de flags.

### Relação com Containers

Dockerfiles executam aplicações via `java -jar`:

```dockerfile
CMD ["java", "-Xmx512m", "-jar", "app.jar"]
```

### Relação com Application Servers

Tomcat, WildFly são processos Java iniciados via scripts que invocam `java` com configurações específicas.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. Profiling (jvisualvm, jconsole)
2. Heap dumps e análise de memória
3. Thread dumps e debugging de concorrência
4. JMX e monitoramento
5. Flight Recorder e análise de performance

### Conceitos Avançados

- GC tuning avançado
- JVM internals (bytecode, JIT)
- Native memory tracking
- Container awareness (Java 10+)

---

## 📚 Conclusão

**Execução via linha de comando** com `java` é habilidade essencial que expõe funcionamento do runtime Java. Dominar flags JVM (`-Xmx`, `-XX:+UseG1GC`, `-D`, `-agentlib:jdwp`) permite otimizar performance, debugar problemas complexos e operar aplicações em produção eficientemente. Embora IDEs automatizem execução, entender `java` profundamente capacita desenvolvedor a configurar ambientes de deployment, troubleshootar problemas de runtime e maximizar performance através de tuning de JVM. É fundação para operação profissional de aplicações Java em qualquer ambiente.
