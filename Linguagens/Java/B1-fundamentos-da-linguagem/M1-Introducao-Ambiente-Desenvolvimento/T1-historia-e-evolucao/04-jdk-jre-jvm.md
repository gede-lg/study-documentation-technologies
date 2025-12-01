# Diferenças Entre JDK, JRE e JVM

## 🎯 Introdução e Definição

### Definição Conceitual

**JDK (Java Development Kit)**, **JRE (Java Runtime Environment)** e **JVM (Java Virtual Machine)** formam uma hierarquia conceitual de componentes que, juntos, constituem a plataforma Java completa. Compreender as diferenças entre esses três elementos é fundamental para entender como Java funciona, desde o desenvolvimento até a execução de aplicações.

De forma conceitual simplificada:

- **JVM (Java Virtual Machine)**: O **motor de execução** - a máquina virtual que interpreta e executa bytecode Java
- **JRE (Java Runtime Environment)**: O **ambiente de execução** - JVM + bibliotecas padrão necessárias para executar aplicações Java
- **JDK (Java Development Kit)**: O **kit de desenvolvimento** - JRE + ferramentas para desenvolver aplicações Java (compilador, debugger, etc.)

Esta hierarquia representa **camadas de abstração e funcionalidade crescentes**:

```
┌─────────────────────────────────────────┐
│              JDK                        │  Kit Completo de Desenvolvimento
│  ┌───────────────────────────────────┐  │
│  │           JRE                     │  │  Ambiente de Execução
│  │  ┌─────────────────────────────┐  │  │
│  │  │         JVM                 │  │  │  Máquina Virtual
│  │  │  - Executa bytecode         │  │  │
│  │  │  - Garbage Collection       │  │  │
│  │  │  - JIT Compilation          │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  + Bibliotecas Java Padrão        │  │
│  │    (java.lang, java.util, etc)    │  │
│  └───────────────────────────────────┘  │
│  + Ferramentas de Desenvolvimento      │
│    (javac, javadoc, jar, jdb, etc)     │
└─────────────────────────────────────────┘
```

### Contexto Histórico e Motivação

A separação entre JDK, JRE e JVM não foi arbitrária - emergiu de **necessidades práticas e arquiteturais** ao longo da evolução de Java.

#### Nos Primórdios: Tudo Em Um (Java 1.0, 1996)

Quando Java foi lançado em 1996, a distinção entre componentes era menos clara. O **Java Development Kit 1.0** incluía tudo:
- Compilador (`javac`)
- Interpretador/runtime (`java`)
- Bibliotecas padrão
- Applet viewer
- Debugger rudimentar

**Problema**: Usuários finais que queriam apenas **executar** applets Java precisavam baixar kit completo de desenvolvimento (vários megabytes em era de modems discados lentos). Isso era desperdício - por que instalar compilador se você só quer rodar aplicações?

#### A Separação: JDK vs JRE (Final dos Anos 1990)

Sun Microsystems percebeu a necessidade de separar **ferramentas de desenvolvimento** de **ambiente de execução**:

**JRE (Java Runtime Environment)** foi criado como subconjunto de JDK:
- Contém JVM + bibliotecas padrão
- Tamanho menor (sem compilador e ferramentas de desenvolvimento)
- Suficiente para usuários finais executarem aplicações Java
- Distribuído separadamente para download

**JDK (Java Development Kit)** permaneceu como pacote completo:
- Inclui JRE inteiro
- Adiciona ferramentas de desenvolvimento (javac, javadoc, jar, etc.)
- Para desenvolvedores, não usuários finais

**Motivação Comercial/Prática**:
- **Browsers**: Netscape Navigator e Internet Explorer podiam incluir JRE para executar applets sem pesar com ferramentas de desenvolvimento
- **Distribuição de Software**: Empresas podiam empacotar JRE com aplicações, garantindo que clientes tivessem runtime necessário
- **Economia de Banda**: Downloads menores (importante em era pré-banda-larga)

#### JVM como Conceito Abstrato

**JVM (Java Virtual Machine)** sempre foi componente central, mas tornou-se **especificação formal** separada:
- **JVM Specification**: Documento que define como JVM deve se comportar
- **Múltiplas Implementações**: Vendors diferentes (Sun, IBM, BEA, etc.) criaram suas próprias JVMs conformes à especificação
- **Flexibilidade**: Permitiu otimizações específicas (HotSpot para throughput, J9 para footprint de memória)

### Problema Fundamental que Resolve

A separação JDK/JRE/JVM resolve problemas específicos:

#### 1. Separação de Responsabilidades

**Problema**: Misturar ferramentas de desenvolvimento com runtime cria confusão e desperdício.

**Solução**:
- **Desenvolvedores** instalam JDK (tem tudo)
- **Usuários finais** instalam apenas JRE (leve, suficiente)
- **JVM** é núcleo compartilhado por ambos

#### 2. Flexibilidade de Distribuição

**Problema**: Aplicações Java precisam de runtime, mas não devem forçar usuários a instalar ferramentas de desenvolvimento.

**Solução**: JRE pode ser:
- Instalado separadamente pelo usuário
- Empacotado com aplicação (bundled JRE)
- Compartilhado entre múltiplas aplicações (instalação global)

#### 3. Otimizações de JVM

**Problema**: Diferentes cenários (desktop, servidor, embarcado) têm requisitos diferentes.

**Solução**: Múltiplas JVMs otimizadas:
- **HotSpot** (Oracle): Throughput e baixa latência para servidores
- **OpenJ9** (IBM/Eclipse): Footprint de memória reduzido
- **GraalVM**: Polyglot (suporta múltiplas linguagens) e compilação AOT

#### 4. Evolução Independente

**Problema**: Ferramentas de desenvolvimento, bibliotecas padrão e VM evoluem em ritmos diferentes.

**Solução**: Componentização permite:
- Atualizar JVM sem tocar ferramentas de desenvolvimento
- Adicionar features a linguagem (javac) sem mudar runtime
- Vendors competirem em implementações de JVM mantendo compatibilidade

### Importância no Ecossistema

A tríade JDK/JRE/JVM é fundamental para sucesso de Java:

#### Adoção em Massa

**JRE Separado** permitiu:
- Browsers embutir Java para applets (Netscape, IE nos anos 1990-2000)
- Usuários comuns executar aplicações Java sem serem desenvolvedores
- Redução de barreira de entrada

#### Ecossistema de Vendors

**JVM como Especificação** permitiu:
- IBM, Oracle, Azul, Amazon criar JVMs competitivas
- Inovação (GCs diferentes, JIT otimizados)
- Evitar monopólio - open specification previne lock-in

#### Ferramentas de Terceiros

**JDK Bem Definido** permitiu:
- IDEs (IntelliJ, Eclipse, NetBeans) integrar com ferramentas Java
- Ferramentas de build (Maven, Gradle) invocar javac, jar programaticamente
- Profilers, debuggers acessar internals de JVM

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Hierarquia de Inclusão**: JDK ⊃ JRE ⊃ JVM (cada nível contém o anterior)
2. **Separação de Público-Alvo**: Desenvolvedores vs Usuários Finais vs Implementadores de JVM
3. **Abstração de Camadas**: JVM (execução) → JRE (runtime completo) → JDK (desenvolvimento completo)
4. **Modularidade**: Componentes podem evoluir independentemente
5. **Especificação vs Implementação**: JVM é especificação; existem múltiplas implementações

### Pilares Fundamentais

- **JVM**: Motor de execução universal (bytecode → código nativo)
- **JRE**: Ambiente pronto para executar aplicações (JVM + bibliotecas)
- **JDK**: Kit completo para desenvolver aplicações (JRE + ferramentas)
- **Interoperabilidade**: Componentes de diferentes vendors podem interoperar (bytecode padrão)
- **Distribuibilidade**: JRE pode ser distribuído com aplicações

### Visão Geral das Nuances

- **Java 9+**: Modularização (JPMS) mudou estrutura interna de JDK/JRE
- **Java 11+**: Oracle não distribui JRE separado (apenas JDK); usar jlink para criar runtime customizado
- **Vendors**: OpenJDK, Oracle JDK, Amazon Corretto, Azul Zulu - variações com mesma base
- **Licenciamento**: Diferenças entre Oracle JDK (comercial) e OpenJDK (GPL)

---

## 🧠 Fundamentos Teóricos

### JVM (Java Virtual Machine): O Coração da Execução

#### Definição Profunda

**Java Virtual Machine** é uma **máquina abstrata** - uma especificação de computador que não existe fisicamente, mas é emulada em software. Conceitualmente, JVM é um processador virtual com seu próprio conjunto de instruções (bytecode), modelo de memória, e arquitetura de execução.

**JVM NÃO é**:
- Programa específico (é especificação; HotSpot, OpenJ9 são implementações)
- Exclusiva de Java (outras linguagens JVM: Scala, Kotlin, Groovy, Clojure)
- Interpretador puro (usa JIT compilation para performance)

**JVM É**:
- Abstração de hardware/SO
- Runtime que executa bytecode
- Gerenciador de memória (garbage collection)
- Otimizador dinâmico (profiling-guided JIT)

#### Arquitetura Interna da JVM

```
┌────────────────────────────────────────────────────────┐
│                 Java Virtual Machine                   │
├────────────────────────────────────────────────────────┤
│  ClassLoader Subsystem                                 │
│  - Bootstrap ClassLoader (classes core: java.lang.*)   │
│  - Extension ClassLoader (extensões)                   │
│  - Application ClassLoader (classpath)                 │
├────────────────────────────────────────────────────────┤
│  Runtime Data Areas (Áreas de Memória)                 │
│  ┌──────────────┐  ┌─────────────────────────────┐    │
│  │ Method Area  │  │         Heap                │    │
│  │ (metadata)   │  │  (objetos, arrays)          │    │
│  └──────────────┘  └─────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐     │
│  │  Java Stacks (uma por thread)                │     │
│  │  - Stack frames (variáveis locais, operandos)│     │
│  └──────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐     │
│  │  PC Registers (Program Counter por thread)   │     │
│  └──────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐     │
│  │  Native Method Stacks (para métodos nativos) │     │
│  └──────────────────────────────────────────────┘     │
├────────────────────────────────────────────────────────┤
│  Execution Engine                                      │
│  - Interpreter (interpreta bytecode)                   │
│  - JIT Compiler (compila hotspots para nativo)         │
│  - Garbage Collector (gerencia memória heap)           │
├────────────────────────────────────────────────────────┤
│  Native Method Interface (JNI)                         │
│  - Interface para código C/C++                         │
└────────────────────────────────────────────────────────┘
```

#### Responsabilidades da JVM

**1. Carregamento de Classes**:
```java
// Quando você escreve:
MyClass obj = new MyClass();

// JVM internamente:
// 1. Procura MyClass.class no classpath
// 2. Lê bytecode do arquivo .class
// 3. Verifica bytecode (bytecode verification)
// 4. Carrega classe na Method Area
// 5. Executa inicializadores estáticos (static {})
// 6. Aloca objeto no heap
```

**2. Execução de Bytecode**:
- **Interpretação**: Ler bytecode instrução por instrução e executar
- **JIT Compilation**: Compilar bytecode "quente" (frequentemente executado) para código nativo
- **Profiling**: Monitorar execução para identificar hotspots

**3. Gerenciamento de Memória**:
- **Alocação**: Criar objetos no heap quando `new` é chamado
- **Garbage Collection**: Identificar objetos sem referências e liberar memória
- **Organização**: Compactar heap para evitar fragmentação

**4. Segurança e Verificação**:
- **Bytecode Verification**: Garantir que bytecode não viola regras (acessa memória ilegal, viola tipos)
- **Security Manager**: Aplicar políticas de segurança (pode ler arquivo X? pode conectar a host Y?)

#### Especificação vs Implementação

**Java Virtual Machine Specification** é documento oficial (mantido por Oracle/Java Community Process) que define:
- Set de instruções de bytecode
- Formato de arquivo .class
- Comportamento esperado de cada instrução
- Modelo de memória (como threads veem memória compartilhada)
- Regras de verificação de bytecode

**Implementações de JVM** são programas concretos que seguem especificação:

| Implementação | Vendor         | Características                                   |
|---------------|----------------|--------------------------------------------------|
| HotSpot       | Oracle/OpenJDK | Mais popular, JIT agressivo, múltiplos GCs       |
| OpenJ9        | IBM/Eclipse    | Footprint de memória pequeno, startup rápido     |
| GraalVM       | Oracle Labs    | Polyglot (Java, JS, Python, Ruby), AOT          |
| Azul Zing     | Azul Systems   | GC pauseless (C4), para baixa latência          |
| Zulu          | Azul Systems   | Build de OpenJDK certificado, suporte comercial |

**Conformidade**: Todas devem passar TCK (Technology Compatibility Kit) - suite de testes que verifica se implementação está conforme especificação.

### JRE (Java Runtime Environment): Ambiente de Execução Completo

#### Definição Profunda

**Java Runtime Environment** é o **conjunto mínimo de componentes necessários para executar aplicações Java**. Não é apenas JVM - inclui bibliotecas padrão (Java Class Library) que formam a API Java.

**Componentes do JRE**:

```
JRE
├── JVM (bin/java ou bin/java.exe)
│   └── Implementação específica de plataforma
│
├── Java Class Library (Bibliotecas Padrão)
│   ├── java.lang.* (Object, String, System, Thread, etc)
│   ├── java.util.* (Collections, Date, etc)
│   ├── java.io.* (File, InputStream, OutputStream, etc)
│   ├── java.net.* (Socket, URL, etc)
│   ├── java.math.* (BigDecimal, BigInteger)
│   ├── javax.swing.* (GUI - desktop)
│   ├── java.sql.* (JDBC - banco de dados)
│   └── Centenas de outros pacotes
│
├── Arquivos de Configuração
│   ├── lib/security/java.policy (políticas de segurança)
│   ├── lib/security/java.security (configuração de segurança)
│   └── lib/logging.properties (configuração de logs)
│
└── Recursos Adicionais
    ├── Fontes (para renderização de texto)
    ├── Certificados de Segurança (para SSL/TLS)
    └── Arquivos de propriedades (locales, timezones, etc)
```

#### Por Que JRE Não É Apenas JVM?

Imagine tentar executar código Java com apenas JVM pura (sem bibliotecas):

```java
// Este código PARECE simples:
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**O que acontece quando executa**:
1. JVM carrega classe `Hello`
2. `System` é classe em `java.lang` - JVM precisa carregar `java.lang.System`
3. `System.out` é objeto `PrintStream` - precisa carregar `java.io.PrintStream`
4. `println` usa internamente `String` - precisa carregar `java.lang.String`
5. `String` usa arrays, `Object` (superclasse de tudo) - precisa carregar essas classes

**Cascata de Dependências**: Mesmo programa trivial depende de dezenas de classes da biblioteca padrão.

**Sem JRE (apenas JVM)**: Você teria JVM que sabe executar bytecode, mas não teria implementação de `System`, `String`, `Object` - programa não rodaria.

**Com JRE**: Todas essas classes estão pré-empacotadas. JVM as carrega conforme necessário.

#### Quando Você Precisa de JRE

**Cenário 1: Usuário Final de Aplicação Desktop Java**
```
Desenvolvedor distribui: myapp.jar
Usuário precisa ter: JRE instalado
Execução: java -jar myapp.jar
```

**Cenário 2: Servidor de Aplicações**
```
Servidor (Tomcat, JBoss): precisa de JRE para executar
Deploy: .war files (Web Applications)
JRE executa servlet container, que executa aplicação
```

**Cenário 3: Aplicação com Bundled JRE**
```
Desenvolvedor empacota: myapp.exe (Windows) que inclui JRE
Usuário não precisa instalar Java separadamente
Aplicação usa JRE privado (não conflita com outras versões Java)
```

### JDK (Java Development Kit): Kit Completo de Desenvolvimento

#### Definição Profunda

**Java Development Kit** é o **conjunto completo de ferramentas para desenvolver, compilar, debugar e empacotar aplicações Java**. É JRE completo + ferramentas de desenvolvimento.

**Estrutura do JDK**:

```
JDK
├── JRE (inteiro - JVM + bibliotecas)
│   └── (tudo descrito na seção JRE)
│
├── Compilador (bin/javac)
│   └── Compila .java → .class (bytecode)
│
├── Ferramentas de Empacotamento
│   ├── jar (cria arquivos .jar)
│   ├── jlink (Java 9+: cria runtime customizado)
│   └── jpackage (Java 14+: cria instaladores nativos)
│
├── Ferramentas de Análise/Debugging
│   ├── jdb (debugger de linha de comando)
│   ├── jconsole (monitor de JVM - GUI)
│   ├── jvisualvm (profiler visual)
│   ├── jps (lista processos Java)
│   ├── jstack (dump de stack traces)
│   ├── jmap (dump de heap)
│   └── jstat (estatísticas de GC)
│
├── Ferramentas de Documentação
│   └── javadoc (gera documentação HTML de código)
│
├── Ferramentas de Internacionalização
│   └── native2ascii (converte caracteres nativos)
│
├── Utilitários
│   ├── javap (disassembler - mostra bytecode)
│   ├── keytool (gerenciamento de certificados)
│   └── jdeps (analisa dependências de classes)
│
└── Código-Fonte (src.zip)
    └── Source code das bibliotecas padrão (para referência)
```

#### Ferramentas Essenciais do JDK

**javac (Compilador Java)**:
```bash
# Compila arquivo fonte para bytecode
javac HelloWorld.java
# Gera HelloWorld.class

# Compilação com classpath
javac -classpath lib/mylib.jar MyApp.java
```

**Processo de Compilação**:
1. Análise léxica (tokenização)
2. Parsing (construção de AST - Abstract Syntax Tree)
3. Análise semântica (verificação de tipos)
4. Geração de bytecode

**jar (Java Archive)**:
```bash
# Criar JAR executável
jar cvfe myapp.jar com.example.Main *.class

# Extrair conteúdo de JAR
jar xvf myapp.jar

# Listar conteúdo
jar tvf myapp.jar
```

**javadoc (Gerador de Documentação)**:
```bash
# Gerar documentação HTML
javadoc -d docs -sourcepath src -subpackages com.example
```

**jdb (Debugger)**:
```bash
# Debugar aplicação
jdb -classpath . MyApp

# Comandos no debugger:
# stop at MyClass:10  (breakpoint na linha 10)
# run                 (executar)
# step                (próxima linha)
# print variable      (mostrar valor de variável)
```

#### Quando Você Precisa de JDK

**Desenvolvimento**:
- Escrever código Java
- Compilar (.java → .class)
- Gerar JARs/WARs
- Criar documentação
- Debugar problemas

**Build Automation**:
- Maven, Gradle invocam `javac` internamente
- Precisam de JDK no ambiente de CI/CD

**IDEs**:
- IntelliJ IDEA, Eclipse, NetBeans precisam de JDK
- Usam ferramentas como javac, javadoc programaticamente

**Produção (às vezes)**:
- Se aplicação gera código dinamicamente (ex: compilar Java em runtime)
- Ferramentas como Jasper Reports compilam templates para classes Java

---

## 🔍 Análise Conceitual Profunda

### Comparação Lado a Lado

| Aspecto                  | JVM                          | JRE                           | JDK                          |
|--------------------------|------------------------------|-------------------------------|------------------------------|
| **Definição**            | Máquina virtual que executa bytecode | Ambiente de execução completo | Kit de desenvolvimento       |
| **Contém**               | Motor de execução apenas     | JVM + bibliotecas padrão      | JRE + ferramentas de dev     |
| **Tamanho Típico**       | ~10-20 MB (núcleo)           | ~70-150 MB                    | ~200-300 MB                  |
| **Público-Alvo**         | Implementadores de JVM       | Usuários finais               | Desenvolvedores              |
| **Pode Compilar Java?**  | Não                          | Não                           | Sim (javac)                  |
| **Pode Executar .class?**| Sim (mas precisa bibliotecas)| Sim                           | Sim                          |
| **Inclui javac?**        | Não                          | Não                           | Sim                          |
| **Inclui java.lang.*?**  | Não (precisa JRE)            | Sim                           | Sim                          |
| **Instalação Separada?** | Não (embutido em JRE/JDK)    | Sim (Java 8 e anteriores)     | Sim                          |

### Cenários Práticos de Uso

#### Cenário 1: Desenvolvedor Java

**Situação**: Você está desenvolvendo aplicação Spring Boot.

**Precisa de**: **JDK**

**Por quê**:
- Escrever código `.java` → precisa compilar com `javac`
- Executar testes → precisa JRE para rodar
- Gerar JAR → precisa ferramenta `jar`
- Debugar → precisa `jdb` ou debugger de IDE (que usa JDK)

**Instalação**:
```bash
# Download JDK (OpenJDK, Oracle JDK, etc.)
# Configurar JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/jdk-17
export PATH=$JAVA_HOME/bin:$PATH

# Verificar
javac -version  # Deve mostrar versão
java -version   # Deve mostrar versão
```

#### Cenário 2: Usuário Final de Aplicação Desktop

**Situação**: Você baixou aplicação Java (ex: IntelliJ IDEA Community Edition como JAR).

**Precisa de**: **JRE** (ou aplicação com JRE bundled)

**Por quê**:
- Apenas quer executar aplicação, não desenvolver
- JRE tem tudo necessário para rodar (JVM + bibliotecas)
- JDK seria desperdício de espaço

**Instalação**:
```bash
# Java 8 e anteriores: Download JRE separado
# Java 11+: Usar JDK (Oracle não distribui JRE separado) OU
# Aplicação pode vir com JRE embutido (comum hoje)

java -jar myapp.jar
```

#### Cenário 3: Servidor de Produção

**Situação**: Deploy de aplicação Spring Boot em servidor Linux.

**Precisa de**: **JRE** (geralmente usa JDK por conveniência)

**Por quê**:
- Servidor apenas executa aplicação compilada (.jar/.war)
- Não compila código (feito em CI/CD)
- JRE seria suficiente, mas JDK é comum para ferramentas de diagnóstico

**Prática Comum**:
```dockerfile
# Dockerfile para produção
FROM openjdk:17-jre-slim  # Usa JRE para footprint menor
COPY target/myapp.jar /app/myapp.jar
CMD ["java", "-jar", "/app/myapp.jar"]
```

**Ou com JDK** (para ferramentas de diagnóstico):
```dockerfile
FROM openjdk:17-jdk-slim  # Usa JDK para ter jstack, jmap em produção
COPY target/myapp.jar /app/myapp.jar
CMD ["java", "-jar", "/app/myapp.jar"]
```

#### Cenário 4: Servidor de Build (CI/CD)

**Situação**: Jenkins/GitLab CI compilando e testando código Java.

**Precisa de**: **JDK**

**Por quê**:
- Pipeline compila código-fonte (`javac`)
- Executa testes (precisa JRE)
- Gera artefatos (JAR/WAR com ferramenta `jar`)
- Pode executar análise estática (ferramentas do JDK)

**Exemplo GitLab CI**:
```yaml
# .gitlab-ci.yml
build:
  image: openjdk:17-jdk  # JDK necessário
  script:
    - ./mvnw clean package  # mvnw usa javac internamente
```

### Mudanças Históricas na Estrutura

#### Java 8 e Anteriores: JRE Separado

**Estrutura**:
- Oracle distribuía **JDK** e **JRE** separadamente
- Downloads distintos: jdk-8u191-windows-x64.exe e jre-8u191-windows-x64.exe
- Instalação separada possível

**Vantagem**: Usuários finais podiam baixar apenas JRE (menor)

#### Java 9: Modularização (JPMS)

**Java Platform Module System** introduzido:
- JDK/JRE dividido em módulos (java.base, java.sql, java.xml, etc.)
- **jlink** permite criar runtime customizado com apenas módulos necessários

```bash
# Criar runtime customizado com apenas módulos necessários
jlink --module-path $JAVA_HOME/jmods \
      --add-modules java.base,java.logging \
      --output custom-jre

# Resultado: JRE minimalista (pode ser < 30 MB)
```

**Impacto**: Possível criar runtimes específicos para aplicação

#### Java 11+: Sem JRE Separado da Oracle

**Mudança**: Oracle parou de distribuir JRE standalone

**Razões**:
1. **jlink** permite criar runtime customizado (mais flexível que JRE genérico)
2. Simplificação de distribuição (apenas JDK)
3. Aplicações modernas tendem a bundlar JRE próprio

**Alternativas**:
- Usar JDK completo (mesmo para execução)
- Usar jlink para criar runtime customizado
- Usar builds de terceiros (AdoptOpenJDK/Adoptium fornece JRE)
- Usar JRE embutido em containers (imagens Docker oficiais têm variantes JRE)

### Relação com Vendors e Distribuições

**OpenJDK** (Referência Open Source):
- Código-fonte aberto (GPL v2 + Classpath Exception)
- Base para a maioria das distribuições

**Builds Derivados de OpenJDK**:

| Distribuição        | Vendor          | Licença     | Suporte Comercial | Características                |
|---------------------|-----------------|-------------|-------------------|--------------------------------|
| Oracle JDK          | Oracle          | Comercial*  | Sim (pago)        | Builds oficiais Oracle         |
| Oracle OpenJDK      | Oracle          | GPL         | Não               | Builds Oracle sem suporte      |
| Adoptium (Eclipse) | Eclipse Foundation | GPL      | Não (mas há vendors) | Ex-AdoptOpenJDK             |
| Amazon Corretto     | Amazon          | GPL         | Sim (gratuito)    | Otimizado para AWS             |
| Azul Zulu           | Azul Systems    | GPL         | Sim (pago)        | Builds certificados            |
| Red Hat OpenJDK     | Red Hat         | GPL         | Sim (RHEL)        | Para clientes Red Hat          |
| Microsoft OpenJDK   | Microsoft       | GPL         | Sim (Azure)       | Otimizado para Azure           |
| GraalVM             | Oracle Labs     | Varia       | Varia             | Polyglot, AOT compilation      |

*Oracle JDK mudou licenciamento várias vezes - GPL para uso geral desde Java 17.

---

(Continuação nos próximos arquivos devido ao limite de caracteres. Os arquivos restantes serão criados mantendo o mesmo padrão de profundidade teórica.)
