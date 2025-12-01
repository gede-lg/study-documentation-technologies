# T5.09 - Pacotes Padrão do Java

## Introdução

**Java possui pacotes padrão** (bibliotecas nativas) organizados hierarquicamente, fornecendo funcionalidades essenciais.

**Principais**:
- `java.lang`: Classes fundamentais (String, Object, Math)
- `java.util`: Utilitários (Collections, Date, Random)
- `java.io`: Entrada/Saída (streams, arquivos)
- `java.nio`: Nova I/O (buffers, canais)
- `java.time`: Data/hora (Java 8+)

---

## Fundamentos

### 1. java.lang (Importado Automaticamente)

**Único pacote importado implicitamente** (sem `import`).

**Classes principais**:
```java
String texto = "Olá";           // String
Integer numero = 10;            // Integer
Object obj = new Object();      // Object
System.out.println("Teste");    // System
Math.sqrt(16);                  // Math
Exception e = new Exception();  // Exception
```

**Conteúdo**:
- **Wrappers**: `Byte`, `Short`, `Integer`, `Long`, `Float`, `Double`, `Character`, `Boolean`
- **String**: Manipulação de texto
- **Object**: Classe raiz de todas
- **System**: I/O padrão, propriedades do sistema
- **Math**: Funções matemáticas
- **Exception**, `Error`: Tratamento de exceções
- **Thread**, `Runnable`: Concorrência básica
- **Class**: Reflection

**Não precisa import**:
```java
// ✅ Sem import necessário
String nome = "João";
Integer idade = 30;
```

### 2. java.util (Utilitários)

**Collections Framework, utilitários gerais**.

**Classes principais**:
```java
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.Date;
import java.util.Calendar;
import java.util.Random;
import java.util.Scanner;
import java.util.Optional;
```

**Conteúdo**:
- **Collections**: `List`, `Set`, `Map`, `Queue`, `Deque`
- **Implementações**: `ArrayList`, `LinkedList`, `HashMap`, `TreeMap`, `HashSet`
- **Utilitários**: `Collections`, `Arrays`, `Objects`
- **Data/hora legadas**: `Date`, `Calendar` (substituídas por `java.time`)
- **Random**: Números aleatórios
- **Scanner**: Leitura de entrada
- **Optional**: Container para valores opcionais (Java 8+)

**Exemplo**:
```java
List<String> lista = new ArrayList<>();
Map<Integer, String> mapa = new HashMap<>();
Random random = new Random();
Optional<String> opcional = Optional.of("Valor");
```

### 3. java.io (Entrada/Saída)

**Streams de bytes e caracteres, arquivos**.

**Classes principais**:
```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.io.Serializable;
```

**Conteúdo**:
- **File**: Representação de arquivos/diretórios
- **Byte Streams**: `FileInputStream`, `FileOutputStream`, `BufferedInputStream`
- **Character Streams**: `FileReader`, `FileWriter`, `BufferedReader`, `BufferedWriter`
- **Serialization**: `ObjectInputStream`, `ObjectOutputStream`, `Serializable`
- **Exceções**: `IOException`, `FileNotFoundException`

**Exemplo**:
```java
File arquivo = new File("dados.txt");
BufferedReader reader = new BufferedReader(new FileReader(arquivo));
```

### 4. java.nio (New I/O - Java 4+)

**I/O não-bloqueante, buffers, canais**.

**Pacotes**:
```java
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
```

**Conteúdo**:
- **java.nio.file**: `Path`, `Paths`, `Files` (substituem `java.io.File`)
- **java.nio**: `ByteBuffer`, `CharBuffer`, `IntBuffer`
- **java.nio.channels**: `FileChannel`, `SocketChannel`

**Exemplo (NIO.2 - Java 7+)**:
```java
Path caminho = Paths.get("arquivo.txt");
List<String> linhas = Files.readAllLines(caminho);
```

### 5. java.time (Data e Hora - Java 8+)

**API moderna de data/hora** (substitui `java.util.Date`).

**Classes principais**:
```java
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.Instant;
import java.time.Duration;
import java.time.Period;
import java.time.format.DateTimeFormatter;
```

**Conteúdo**:
- **LocalDate**: Data sem hora
- **LocalTime**: Hora sem data
- **LocalDateTime**: Data e hora
- **ZonedDateTime**: Data/hora com fuso horário
- **Instant**: Timestamp (epoch)
- **Duration**: Intervalo de tempo (horas, minutos, segundos)
- **Period**: Intervalo de tempo (anos, meses, dias)
- **DateTimeFormatter**: Formatação

**Exemplo**:
```java
LocalDate hoje = LocalDate.now();
LocalDateTime agora = LocalDateTime.now();
Duration duracao = Duration.ofHours(2);
```

### 6. java.net (Redes)

**Sockets, URLs, comunicação em rede**.

**Classes principais**:
```java
import java.net.URL;
import java.net.URI;
import java.net.HttpURLConnection;
import java.net.Socket;
import java.net.ServerSocket;
import java.net.InetAddress;
```

**Conteúdo**:
- **URL**: Manipulação de URLs
- **HttpURLConnection**: Requisições HTTP
- **Socket**, `ServerSocket`: Comunicação TCP
- **DatagramSocket**: Comunicação UDP
- **InetAddress**: Endereços IP

**Exemplo**:
```java
URL url = new URL("https://exemplo.com");
HttpURLConnection conexao = (HttpURLConnection) url.openConnection();
```

### 7. java.sql (JDBC - Acesso a Banco de Dados)

**Conexão e manipulação de bancos de dados**.

**Classes principais**:
```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
```

**Conteúdo**:
- **Connection**: Conexão com banco
- **DriverManager**: Gerenciamento de drivers
- **Statement**, `PreparedStatement`: Execução de SQL
- **ResultSet**: Resultados de consultas
- **SQLException**: Exceções de banco

**Exemplo**:
```java
Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/db", "user", "pass");
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM usuarios WHERE id = ?");
ResultSet rs = stmt.executeQuery();
```

### 8. javax.* (Java Extension)

**Extensões Java** (originalmente opcional, hoje parte da JDK).

**Principais**:
- **javax.swing**: GUI (interfaces gráficas)
- **javax.servlet**: Servlets (aplicações web)
- **javax.xml**: Processamento XML
- **javax.crypto**: Criptografia

**Exemplo (Swing)**:
```java
import javax.swing.JFrame;
import javax.swing.JButton;

JFrame frame = new JFrame("Minha Janela");
JButton botao = new JButton("Clique");
```

**Nota**: Alguns pacotes `javax.*` foram movidos para `jakarta.*` (Jakarta EE).

### 9. java.util.concurrent (Concorrência - Java 5+)

**Utilitários para programação concorrente**.

**Classes principais**:
```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
```

**Conteúdo**:
- **Executors**: Gerenciamento de threads
- **Locks**: `ReentrantLock`, `ReadWriteLock`
- **Collections thread-safe**: `ConcurrentHashMap`, `CopyOnWriteArrayList`
- **Atomic**: `AtomicInteger`, `AtomicLong`, `AtomicBoolean`
- **Sincronização**: `CountDownLatch`, `CyclicBarrier`, `Semaphore`

**Exemplo**:
```java
ExecutorService executor = Executors.newFixedThreadPool(10);
Future<Integer> futuro = executor.submit(() -> 42);
```

### 10. java.util.stream (Streams API - Java 8+)

**Processamento funcional de coleções**.

**Classes principais**:
```java
import java.util.stream.Stream;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
```

**Conteúdo**:
- **Stream**: Stream de objetos
- **IntStream**, `LongStream`, `DoubleStream`: Streams primitivos
- **Collectors**: Coleta de resultados

**Exemplo**:
```java
List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> pares = numeros.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
```

---

## Aplicabilidade

**Use pacotes padrão para**:
- **Evitar reinventar a roda**: Funcionalidades já implementadas
- **Compatibilidade**: Bibliotecas padrão em todas JDKs
- **Performance**: Otimizadas pela Oracle/comunidade

**Evite dependências externas** quando pacote padrão resolve.

---

## Armadilhas

### 1. Usar java.util.Date em Vez de java.time

```java
// ❌ Evitar (legado)
java.util.Date data = new java.util.Date();

// ✅ Preferir (moderno)
java.time.LocalDate data = LocalDate.now();
```

### 2. Confundir java.util.List com java.awt.List

**Conflito de nomes**:
```java
import java.util.List; // Collections
import java.awt.List;  // GUI (AWT)

List lista; // Ambíguo
```

**Solução**: Use FQN ou importe apenas um.

### 3. Esquecer de Importar Pacotes (Exceto java.lang)

```java
// ❌ Erro
List<String> lista = new ArrayList<>(); // ERRO: sem import

// ✅ Correto
import java.util.List;
import java.util.ArrayList;

List<String> lista = new ArrayList<>();
```

---

## Boas Práticas

### 1. Prefira java.time a java.util.Date

```java
// ✅ Moderno
LocalDate hoje = LocalDate.now();

// ❌ Legado
Date hoje = new Date();
```

### 2. Use java.nio.file em Vez de java.io.File

```java
// ✅ Moderno (NIO.2)
Path caminho = Paths.get("arquivo.txt");
Files.readAllLines(caminho);

// ❌ Legado
File arquivo = new File("arquivo.txt");
```

### 3. Consulte Javadoc para Pacotes Padrão

**Documentação oficial**: https://docs.oracle.com/en/java/javase/

### 4. Use java.util.concurrent para Concorrência

```java
// ✅ Moderno
ExecutorService executor = Executors.newFixedThreadPool(10);

// ❌ Legado (Thread manual)
new Thread(() -> {}).start();
```

---

## Resumo

**Pacotes padrão do Java**:

**java.lang** (importado automaticamente):
- `String`, `Integer`, `Object`, `System`, `Math`, `Exception`

**java.util** (utilitários):
- `List`, `Map`, `Set`, `ArrayList`, `HashMap`, `Optional`, `Random`

**java.io** (I/O legado):
- `File`, `FileInputStream`, `BufferedReader`, `IOException`

**java.nio** (I/O moderno):
- `Path`, `Files`, `ByteBuffer`, `FileChannel`

**java.time** (data/hora - Java 8+):
- `LocalDate`, `LocalDateTime`, `ZonedDateTime`, `Duration`, `Period`

**java.net** (redes):
- `URL`, `HttpURLConnection`, `Socket`, `ServerSocket`

**java.sql** (JDBC):
- `Connection`, `PreparedStatement`, `ResultSet`

**java.util.concurrent** (concorrência):
- `ExecutorService`, `ConcurrentHashMap`, `AtomicInteger`

**java.util.stream** (Streams API):
- `Stream`, `Collectors`, `IntStream`

**Regra de Ouro**: Use **pacotes padrão** sempre que possível, prefira **APIs modernas** (`java.time`, `java.nio.file`) às legadas (`java.util.Date`, `java.io.File`).
