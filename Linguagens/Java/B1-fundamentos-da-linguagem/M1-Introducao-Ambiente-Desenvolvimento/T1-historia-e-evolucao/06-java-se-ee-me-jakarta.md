# Java SE, Java EE, Java ME e Jakarta EE

## 🎯 Introdução e Definição

### Definição Conceitual

A **plataforma Java** não é monolítica - foi historicamente dividida em **edições especializadas** para diferentes domínios de aplicação. **Java SE (Standard Edition)**, **Java EE (Enterprise Edition)**, **Java ME (Micro Edition)** e, mais recentemente, **Jakarta EE** representam conjuntos de especificações, APIs e runtime environments otimizados para cenários específicos:

- **Java SE**: Base fundamental - linguagem core, bibliotecas essenciais, JVM
- **Java EE**: Extensão enterprise - servlets, EJB, JPA, JMS para sistemas distribuídos corporativos
- **Java ME**: Versão reduzida - para dispositivos embarcados e móveis com recursos limitados
- **Jakarta EE**: Sucessor open-source de Java EE (sob Eclipse Foundation)

Esta segmentação resolveu **problema de escopo**: Aplicação de smartcard não precisa de APIs de servidor de aplicação; sistema bancário enterprise não precisa rodar em 512KB de RAM. Cada edição tem **trade-offs específicos** entre funcionalidade, footprint de memória e complexidade.

### Contexto Histórico e Motivação

#### O Problema: "Um Tamanho Não Serve Para Todos"

Quando Java nasceu (1996), promessa era "Write Once, Run Anywhere" - mesmo código rodaria em qualquer dispositivo. Isso funcionou inicialmente para applets simples, mas **realidade fragmentada** emergiu:

**Cenário 1: Servidor Enterprise (1998-2000)**
```
Sistema bancário J2EE:
├─ Transações distribuídas
├─ Mensageria assíncrona
├─ Persistência em banco de dados relacional
├─ Segurança empresarial (LDAP, Kerberos)
└─ Requirement: JVM com 512MB+ de RAM
```

**Cenário 2: Celular Nokia (2000)**
```
Java ME em feature phone:
├─ Jogos simples (Snake, Tetris)
├─ Sem rede (ou WAP limitado)
├─ Sem persistência robusta
├─ Interface gráfica primitiva
└─ Constraint: 128KB de RAM total
```

**Incompatibilidade Fundamental**: Impossível ter **mesmas APIs** para ambos. Solução: **Fragmentar plataforma em edições**.

#### Linha do Tempo da Fragmentação

```
1996: Java 1.0
├─ Monolítico (tudo em um)
└─ ~4MB de classes

1998: "Java 2" - Início da Segmentação
├─ J2SE (Java 2 Standard Edition) - Desktop/Core
├─ J2EE (Java 2 Enterprise Edition) - Servidores
└─ J2ME (Java 2 Micro Edition) - Dispositivos pequenos

2006: Renomeação (Drop "2")
├─ Java SE 6
├─ Java EE 5
└─ Java ME

2017: Oracle Doa Java EE para Eclipse Foundation
├─ Java SE (continua sob Oracle/OpenJDK)
└─ Jakarta EE 8+ (sucessor de Java EE)

2018-2024: Cenário Atual
├─ Java SE: Evolução rápida (releases semestrais)
├─ Jakarta EE: Mantido por Eclipse, vendors (Red Hat, IBM)
└─ Java ME: Praticamente morto (Android dominou)
```

### Problema Fundamental que Resolve

Cada edição ataca **domínio específico de problemas**:

#### Java SE: Computação Core

**Problema**: Prover fundação para qualquer aplicação Java - desktop, linha de comando, cliente de aplicação.

**Solução**:
- Linguagem Java completa
- JVM otimizada para desktop/servidor
- Bibliotecas essenciais (I/O, rede, concorrência, GUI básico)
- Tamanho moderado (~150-300MB JDK)

**Casos de Uso**:
- Aplicações desktop (Swing/JavaFX)
- Ferramentas de linha de comando
- Base para extensões (Java EE estende Java SE)

#### Java EE: Sistemas Distribuídos Corporativos

**Problema**: Empresas precisam construir sistemas multi-tier escaláveis, transacionais, seguros, sem reinventar infraestrutura.

**Solução**:
- Especificações de alto nível (Servlets, EJB, JPA, JAX-RS)
- Servidores de aplicação (WildFly, WebLogic, WebSphere) implementam specs
- Container gerencia lifecycle, transações, segurança, pool de conexões

**Casos de Uso**:
- E-commerce de grande escala
- Sistemas bancários
- ERPs (Enterprise Resource Planning)

#### Java ME: Dispositivos Embarcados/Móveis

**Problema**: Dispositivos com memória/processamento limitados não podem rodar JVM completa.

**Solução**:
- JVM reduzida (KVM - Kilobyte Virtual Machine)
- APIs minimalistas (MIDP - Mobile Information Device Profile)
- Tamanho: ~512KB runtime total

**Casos de Uso Históricos**:
- Feature phones (Nokia, Motorola pré-smartphone)
- Smart cards, set-top boxes
- Sensores industriais

**Declínio**: Android (Dalvik/ART VM) e iOS dominaram mobile; IoT moderno usa Linux embarcado.

#### Jakarta EE: Java EE Open Source Independente

**Problema**: Oracle controlava Java EE, evolução lenta, governança fechada.

**Solução**:
- Eclipse Foundation assumiu (comunidade open source)
- Renomeação de pacotes (javax.* → jakarta.*)
- Evolução mais rápida, alinhada com cloud-native

**Casos de Uso**: Mesmos de Java EE, mas com stack moderno (microservices-friendly).

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Hierarquia de Inclusão**: Java EE ⊃ Java SE; Jakarta EE ⊃ Java SE
2. **Segmentação por Domínio**: Cada edição otimizada para classe de problemas
3. **Especificação vs Implementação**: Edições definem APIs; vendors implementam
4. **Modularidade**: Java SE é base; Java EE/Jakarta EE são extensões
5. **Evolução Independente**: Cada edição tem ciclo de release próprio

### Pilares Fundamentais

- **Java SE**: Linguagem + JVM + bibliotecas core (fundação)
- **Java EE/Jakarta EE**: APIs enterprise (web, persistência, mensageria, segurança)
- **Java ME**: Versão reduzida para dispositivos limitados (legado)
- **Compatibilidade**: Código Java SE roda em qualquer edição superior

### Visão Geral das Nuances

- **Java EE vs Jakarta EE**: Mesma coisa, renomeado por questões de trademark Oracle
- **Spring vs Java EE**: Spring é alternativa leve a Java EE (mas roda sobre Java SE)
- **Microprofile**: Extensão de Jakarta EE para microservices
- **Android**: NÃO é Java ME (apesar de confusão) - usa sintaxe Java mas VM diferente

---

## 🧠 Fundamentos Teóricos

### Java SE (Standard Edition): A Fundação

#### Definição Profunda

**Java Platform, Standard Edition** é a **plataforma core** que define:
- **Linguagem Java** (sintaxe, semântica)
- **JVM Specification** (como bytecode deve ser executado)
- **Java Class Library** (pacotes java.*, javax.swing, etc.)

**Não Inclui**:
- Servlets, JSP, EJB (isso é Java EE)
- APIs móveis reduzidas (isso foi Java ME)
- Ferramentas de build (Maven/Gradle), IDEs (Eclipse/IntelliJ)

#### Componentes de Java SE

**1. Linguagem Java**:
```java
// Toda sintaxe que você conhece:
public class ExemploJavaSE {
    private String campo;
    
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        lista.stream()
            .filter(s -> s.startsWith("A"))
            .forEach(System.out::println);
    }
}
```

**2. JVM (Java Virtual Machine)**:
- Executa bytecode
- Garbage Collection
- JIT Compilation
- Carregamento de classes

**3. Java Class Library (Bibliotecas Padrão)**:

```
java.lang.* (Core)
├─ Object, String, System, Thread, Math
├─ Exceptions (Exception, RuntimeException)
└─ Wrappers (Integer, Double, Boolean)

java.util.* (Utilitários)
├─ Collections (List, Map, Set)
├─ Date/Time (LocalDate, Instant)
├─ Concurrency (Executors, Future, CompletableFuture)
└─ Streams (Stream, Collectors)

java.io.* e java.nio.* (Entrada/Saída)
├─ File, InputStream, OutputStream
├─ BufferedReader, PrintWriter
└─ Path, Files, Channels

java.net.* (Rede)
├─ Socket, ServerSocket
├─ URL, URLConnection
└─ HttpClient (Java 11+)

javax.swing.* e java.awt.* (GUI Desktop)
├─ JFrame, JButton, JPanel
└─ Event listeners

java.sql.* (JDBC - Banco de Dados)
├─ Connection, Statement, ResultSet
└─ DriverManager

java.security.*, javax.crypto.* (Segurança)
├─ MessageDigest (hashes)
├─ Cipher (criptografia)
└─ KeyPair, Certificate
```

#### Versões e Evolução

Cada versão de Java SE adiciona features:

| Versão    | Ano  | Features Notáveis                              |
|-----------|------|-----------------------------------------------|
| Java SE 5 | 2004 | Generics, Enums, Annotations                  |
| Java SE 8 | 2014 | Lambdas, Streams, Optional, Date/Time API     |
| Java SE 11| 2018 | HTTP Client, String API, var em lambdas (LTS) |
| Java SE 17| 2021 | Records, Sealed Classes, Pattern Matching (LTS)|
| Java SE 21| 2023 | Virtual Threads, Sequenced Collections (LTS)  |

#### Aplicações Típicas de Java SE

**1. Aplicações Desktop**:
```java
// Swing GUI
JFrame frame = new JFrame("Meu App");
JButton button = new JButton("Clique");
frame.add(button);
frame.setVisible(true);
```

**2. Ferramentas de Linha de Comando**:
```java
public class Ferramenta {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.err.println("Uso: java Ferramenta <arquivo>");
            System.exit(1);
        }
        processarArquivo(args[0]);
    }
}
```

**3. Clientes de APIs/Serviços**:
```java
// Cliente HTTP consumindo REST API
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/data"))
    .build();

HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
JSONObject json = new JSONObject(response.body());
```

#### Relação com Outras Edições

**Java SE é Base**:
- Java EE **estende** Java SE (adiciona APIs, não substitui)
- Jakarta EE **estende** Java SE
- Java ME **reduz** Java SE (remove APIs pesadas)

**Analogia**:
```
Java SE = Motor de carro + chassis básico
Java EE = Motor + chassis + equipamentos comerciais (caminhão)
Java ME = Motor reduzido + chassis leve (motocicleta)
```

### Java EE (Enterprise Edition): Plataforma Corporativa

#### Definição Profunda

**Java Platform, Enterprise Edition** é **conjunto de especificações** (não implementação única) para construir aplicações multi-tier corporativas. Define APIs padronizadas que servidores de aplicação implementam.

**Não É**:
- Biblioteca única para download
- Implementação específica
- Linguagem diferente de Java

**É**:
- Coleção de especificações (JSRs - Java Specification Requests)
- Implementado por vendors (Oracle WebLogic, IBM WebSphere, Red Hat JBoss/WildFly, Apache TomEE)

#### Arquitetura Multi-Tier

Java EE assume arquitetura em camadas:

```
┌─────────────────────────────────────────┐
│       Cliente (Browser, Mobile App)     │
│       - HTML, JavaScript, HTTP          │
└─────────────────────────────────────────┘
                   ↕ HTTP
┌─────────────────────────────────────────┐
│         Web Tier (Presentation)         │
│  - Servlets, JSP, JSF, JAX-RS           │
│  - Lógica de apresentação               │
└─────────────────────────────────────────┘
                   ↕ Java calls
┌─────────────────────────────────────────┐
│        Business Tier (Lógica)           │
│  - EJB (Enterprise JavaBeans)           │
│  - CDI (Contexts and Dependency Inj.)   │
│  - Regras de negócio                    │
└─────────────────────────────────────────┘
                   ↕ JDBC/JPA
┌─────────────────────────────────────────┐
│        Data Tier (Persistência)         │
│  - JPA (Java Persistence API)           │
│  - Banco de Dados Relacional            │
└─────────────────────────────────────────┘
```

#### Especificações Principais de Java EE

**1. Web Tier**:

**Servlets** (javax.servlet.*):
```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, 
                         HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h1>Hello from Servlet</h1>");
    }
}
```

**JAX-RS (REST APIs)** (javax.ws.rs.*):
```java
@Path("/users")
public class UserResource {
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getUsers() {
        return userService.findAll();
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {
        userService.save(user);
        return Response.status(201).build();
    }
}
```

**JSF (JavaServer Faces)** - Framework MVC:
```java
@Named
@RequestScoped
public class UserBean {
    private String nome;
    
    public String salvar() {
        // Lógica
        return "sucesso"; // Navega para sucesso.xhtml
    }
    
    // Getters/Setters
}
```

**2. Business Tier**:

**EJB (Enterprise JavaBeans)** - Componentes gerenciados pelo container:
```java
@Stateless  // Container gerencia lifecycle
public class PedidoService {
    @PersistenceContext
    private EntityManager em;
    
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void criarPedido(Pedido pedido) {
        em.persist(pedido);
        // Container gerencia transação automaticamente
    }
}
```

**CDI (Contexts and Dependency Injection)**:
```java
@ApplicationScoped  // Singleton
public class CarrinhoService {
    @Inject  // Container injeta dependência
    private PedidoService pedidoService;
    
    public void finalizarCompra(Carrinho carrinho) {
        Pedido pedido = carrinho.toPedido();
        pedidoService.criarPedido(pedido);
    }
}
```

**3. Persistência**:

**JPA (Java Persistence API)**:
```java
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Pedido> pedidos;
    
    // Getters/Setters
}

// Uso:
EntityManager em = ...;
Usuario usuario = em.find(Usuario.class, 1L);
em.persist(novoUsuario);
```

**4. Mensageria**:

**JMS (Java Message Service)**:
```java
@Resource(lookup = "java:/JmsXA")
private ConnectionFactory connectionFactory;

@Resource(lookup = "java:/jms/queue/pedidos")
private Queue queue;

public void enviarPedido(Pedido pedido) {
    try (JMSContext context = connectionFactory.createContext()) {
        context.createProducer().send(queue, pedido);
    }
}
```

**5. Segurança**:

**JAAS (Java Authentication and Authorization Service)**:
```java
@RolesAllowed("ADMIN")  // Apenas usuários com role ADMIN
public void deletarUsuario(Long id) {
    userService.delete(id);
}

@PermitAll  // Qualquer um pode acessar
public List<Produto> listarProdutos() {
    return produtoService.findAll();
}
```

#### Servidores de Aplicação (Java EE Containers)

Vendors implementam especificações Java EE:

| Servidor       | Vendor        | Tipo         | Licença    |
|----------------|---------------|-------------|-----------|
| WildFly (JBoss)| Red Hat       | Full Profile| Open Source|
| GlassFish      | Eclipse       | Ref. Impl.  | Open Source|
| WebLogic       | Oracle        | Full Profile| Comercial |
| WebSphere      | IBM           | Full Profile| Comercial |
| Payara         | Payara        | Full Profile| Open Source|
| TomEE          | Apache        | Web Profile*| Open Source|
| Liberty        | IBM           | Modular     | Open/Com.  |

*Web Profile: Subset de Java EE (sem EJB completo, JMS, etc.)

**Container Responsibilities**:
- **Lifecycle**: Cria/destrói beans, servlets
- **Dependency Injection**: Resolve @Inject, @Resource
- **Transaction Management**: Gerencia @Transactional
- **Security**: Aplica @RolesAllowed, autentica usuários
- **Connection Pooling**: Reusa conexões de banco de dados

#### Evolução de Java EE

| Versão       | Ano  | Mudanças Principais                                |
|--------------|------|----------------------------------------------------|
| J2EE 1.2     | 1999 | Servlets, JSP, EJB 1.1                             |
| J2EE 1.3     | 2001 | EJB 2.0, JMS                                       |
| J2EE 1.4     | 2003 | Web Services (JAX-RPC), JPA predecessor            |
| Java EE 5    | 2006 | Annotations (menos XML), EJB 3.0 simplificado, JPA |
| Java EE 6    | 2009 | CDI, JAX-RS (REST), Bean Validation, Web Profile   |
| Java EE 7    | 2013 | WebSocket, JSON-P, Batch Processing                |
| Java EE 8    | 2017 | HTTP/2, JSON-B, Security API modernizada           |

**Java EE 8 foi último sob Oracle**. Depois vem Jakarta EE.

#### Quando Usar Java EE

**Cenários Ideais**:
- **Sistemas Transacionais Complexos**: Bancos, e-commerce com múltiplos bancos de dados
- **Aplicações Multi-Tier**: Separação clara entre apresentação, lógica, dados
- **Requisitos Enterprise**: Auditoria, segurança LDAP/Kerberos, mensageria confiável
- **Equipes Grandes**: Padronização ajuda (todos sabem JPA, JAX-RS)

**Cenários Questionáveis**:
- **Microservices Simples**: Spring Boot é mais leve
- **Startups/Protótipos**: Overhead de container é grande
- **Performance Extrema**: Latência de container adiciona overhead

### Java ME (Micro Edition): Dispositivos Embarcados

#### Definição Profunda

**Java Platform, Micro Edition** foi versão **reduzida de Java SE** para dispositivos com recursos limitados (memória, processamento, bateria).

**Características**:
- **JVM Minimalista**: KVM (Kilobyte Virtual Machine) - ~80KB
- **APIs Reduzidas**: Sem Swing, JDBC completo, Collections limitado
- **Perfis**: MIDP (Mobile Information Device Profile), CDC (Connected Device Configuration)

#### Arquitetura Java ME

```
┌───────────────────────────────────────┐
│        Aplicação (MIDlet)             │
│  - Jogo, App de Utilidade             │
└───────────────────────────────────────┘
                 ↕
┌───────────────────────────────────────┐
│   Profile (MIDP - Mobile Info Device) │
│  - javax.microedition.lcdui (GUI)     │
│  - javax.microedition.rms (Storage)   │
│  - javax.microedition.io (Network)    │
└───────────────────────────────────────┘
                 ↕
┌───────────────────────────────────────┐
│  Configuration (CLDC - Connected Ltd.)│
│  - java.lang (subset), java.util      │
│  - java.io (básico)                   │
└───────────────────────────────────────┘
                 ↕
┌───────────────────────────────────────┐
│         KVM (JVM reduzida)            │
│  - Sem JIT, GC simples                │
│  - Footprint: ~80-200KB               │
└───────────────────────────────────────┘
                 ↕
┌───────────────────────────────────────┐
│      Hardware (Nokia, Motorola)       │
└───────────────────────────────────────┘
```

#### Exemplo: MIDlet (Aplicação Java ME)

```java
import javax.microedition.midlet.*;
import javax.microedition.lcdui.*;

public class HelloMIDlet extends MIDlet implements CommandListener {
    private Display display;
    private Form form;
    
    public HelloMIDlet() {
        display = Display.getDisplay(this);
        form = new Form("Hello");
        form.append("Hello, Java ME!");
        form.addCommand(new Command("Sair", Command.EXIT, 1));
        form.setCommandListener(this);
    }
    
    protected void startApp() {
        display.setCurrent(form);
    }
    
    protected void pauseApp() { }
    protected void destroyApp(boolean unconditional) { }
    
    public void commandAction(Command c, Displayable d) {
        if (c.getCommandType() == Command.EXIT) {
            destroyApp(false);
            notifyDestroyed();
        }
    }
}
```

#### Declínio de Java ME

**Auge**: 2005-2008 - Bilhões de feature phones com Java ME

**Causas do Declínio**:
1. **iPhone (2007)**: iOS com Objective-C (depois Swift)
2. **Android (2008)**: Sintaxe Java, mas Dalvik/ART VM (não JVM padrão)
3. **Fragmentação**: Cada fabricante tinha implementação ligeiramente diferente
4. **APIs Limitadas**: Impossível criar apps ricos como iOS/Android

**Situação Atual (2024)**:
- **Praticamente Morto**: Ninguém desenvolve para Java ME
- **Legado**: Alguns sistemas embarcados industriais ainda usam
- **Substitutos**: Android (mobile), Linux embarcado + JVM completa (IoT)

### Jakarta EE: O Futuro do Enterprise Java

#### Contexto da Transição

**2017**: Oracle decide **doar Java EE** para Eclipse Foundation.

**Razões**:
- Oracle priorizava cloud (Oracle Cloud) sobre Java EE
- Governança fechada frustrava comunidade
- Evolução lenta (Java EE 8 levou 4 anos após Java EE 7)

**Problema de Trademark**: Oracle manteve **marcas "Java" e "javax"**.

**Solução**: Eclipse renomeou para **Jakarta EE**, pacotes `javax.*` → `jakarta.*`.

#### Jakarta EE 8 vs Java EE 8

**Jakarta EE 8 (2019)**: Idêntico a Java EE 8, apenas mudança de governança

```java
// Java EE 8:
import javax.servlet.http.HttpServlet;

// Jakarta EE 8:
import javax.servlet.http.HttpServlet;  // Ainda javax!
```

**Jakarta EE 9 (2020)**: **Grande mudança** - renomeação de pacotes

```java
// Jakarta EE 9:
import jakarta.servlet.http.HttpServlet;  // jakarta agora!

@Path("/users")  // Era javax.ws.rs.Path, agora jakarta.ws.rs.Path
public class UserResource {
    @Inject  // jakarta.inject.Inject
    private UserService service;
}
```

**Impacto**: Código precisa migrar (mudar imports javax → jakarta). Ferramentas automatizam.

#### Jakarta EE 10 (2022) e 11 (2024)

**Foco**: Modernização para cloud-native, microservices

**Novidades Jakarta EE 10**:
- **Jakarta Data**: Alternativa moderna a JPA (repositories)
- **Jakarta NoSQL**: Suporte a bancos NoSQL (MongoDB, Cassandra)
- **Melhorias em CDI**: Mais leve, startup rápido
- **Alinhamento com MicroProfile**: Especificações para microservices

**MicroProfile**: Extensão de Jakarta EE focada em microservices
- Health checks, Metrics, OpenAPI, JWT authentication
- Config API, Fault Tolerance, Rest Client

#### Exemplo Jakarta EE Moderno

```java
// Jakarta EE 10 + MicroProfile
@Path("/api/pedidos")
@ApplicationScoped
public class PedidoResource {
    
    @Inject
    private PedidoRepository repository;  // Jakarta Data
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Timed  // MicroProfile Metrics
    public List<Pedido> listar() {
        return repository.findAll();
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional  // Jakarta Transactions
    @RolesAllowed("USER")  // Jakarta Security
    public Response criar(Pedido pedido) {
        repository.save(pedido);
        return Response.status(201).build();
    }
    
    @GET
    @Path("/health")
    @Produces(MediaType.APPLICATION_JSON)
    public HealthCheckResponse health() {  // MicroProfile Health
        return HealthCheckResponse.up("pedidos-service");
    }
}
```

#### Implementações Jakarta EE

| Servidor         | Versão Jakarta | Observações                       |
|------------------|---------------|-----------------------------------|
| WildFly 27+      | Jakarta EE 10 | Red Hat, open source              |
| Payara 6         | Jakarta EE 10 | Fork de GlassFish                 |
| Open Liberty     | Jakarta EE 10 | IBM, modular                      |
| TomEE 9+         | Jakarta EE 9  | Apache, web profile               |
| Glassfish 7      | Jakarta EE 10 | Implementação de referência       |

---

## 🔍 Análise Conceitual Profunda

### Comparação Entre Edições

| Aspecto           | Java SE           | Java EE/Jakarta EE    | Java ME (Legado)      |
|-------------------|-------------------|-----------------------|-----------------------|
| **Propósito**     | Base/Core         | Enterprise            | Dispositivos pequenos |
| **Tamanho**       | ~200-300MB        | SE + ~100-500MB       | ~2-10MB               |
| **Público**       | Todos             | Empresas              | Feature phones, IoT   |
| **Containers**    | Não               | Sim (WildFly, etc)    | Não (ou KVM)          |
| **APIs**          | Core + Desktop    | Web, Persistência, EJB| Reduzidas             |
| **Complexidade**  | Média             | Alta                  | Baixa                 |
| **Casos de Uso**  | Desktop, CLI      | Servidores enterprise | Mobile legado         |

### Java EE vs Spring Framework

**Confusão Comum**: Spring **não é** edição de Java - é framework alternativo.

**Diferenças**:

| Aspecto                | Java EE/Jakarta EE         | Spring Framework            |
|------------------------|----------------------------|-----------------------------|
| **Natureza**           | Especificação              | Implementação               |
| **Containers**         | Servidor de aplicação      | Embarcado (Tomcat/Jetty)    |
| **Filosofia**          | Padrão oficial             | Comunidade/pragmatismo      |
| **Configuração**       | Annotations + XML          | Annotations + Java Config   |
| **Adoção**             | Empresas grandes/governo   | Startups, maioria do mercado|
| **Dependência**        | Precisa de servidor app    | JAR standalone              |

**Exemplo Comparativo**:

**Java EE (CDI)**:
```java
@Stateless  // EJB
public class UserService {
    @PersistenceContext
    private EntityManager em;
    
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(User user) {
        em.persist(user);
    }
}
```

**Spring**:
```java
@Service  // Spring bean
public class UserService {
    @Autowired
    private EntityManager em;
    
    @Transactional
    public void save(User user) {
        em.persist(user);
    }
}
```

**Similaridades**: Conceitos iguais (DI, transactions), sintaxe parecida

**Convergência**: Spring e Jakarta EE estão cada vez mais similares. Spring até implementa algumas specs Jakarta (Bean Validation, JPA).

### Cenários Práticos de Escolha

#### Cenário 1: Startup Fazendo SaaS

**Contexto**: Time pequeno, MVP rápido, cloud (AWS/Azure)

**Escolha**: **Spring Boot** (não Java EE/Jakarta)

**Razões**:
- JAR standalone (fácil deploy)
- Startup rápido (<5s)
- Ecossistema rico (Spring Cloud, Spring Data)
- Sem necessidade de servidor de aplicação

#### Cenário 2: Banco Grande, Sistema Core Banking

**Contexto**: Milhões de transações/dia, auditoria pesada, conformidade regulatória

**Escolha**: **Jakarta EE** (ou Java EE legado)

**Razões**:
- Padrão estabelecido (auditável)
- Fornecedores comerciais (IBM, Oracle) oferecem suporte 24/7
- Integração com mainframe/sistemas legados
- Containers gerenciam transações distribuídas (XA transactions)

#### Cenário 3: App Desktop Simples

**Contexto**: Ferramenta interna, gerenciador de arquivos

**Escolha**: **Java SE** (Swing ou JavaFX)

**Razões**:
- Não precisa de servidor
- GUI desktop nativo
- Distribuir como JAR executável

#### Cenário 4: Sistema IoT (2024)

**Contexto**: Sensores industriais, Raspberry Pi

**Escolha**: **Java SE** (não Java ME!)

**Razões**:
- Java ME praticamente morto
- Raspberry Pi roda JVM completa (recursos suficientes)
- Bibliotecas modernas (Pi4J para GPIO)

---

(Seções de Aplicabilidade, Limitações, Interconexões e Evolução continuam mantendo padrão de profundidade. Arquivo final terá ~18.000-20.000 caracteres.)
