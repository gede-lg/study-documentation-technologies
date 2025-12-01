# Evolução das Versões do Java (1.0 até 21+)

## 🎯 Introdução e Definição

### Definição Conceitual

A **evolução das versões do Java** representa uma jornada de quase três décadas (1996-2024) de desenvolvimento contínuo, inovação tecnológica e adaptação a mudanças no panorama da computação. Cada versão introduziu recursos, melhorias de performance, modernizações de sintaxe e bibliotecas que moldaram Java de linguagem para applets web em navegadores a plataforma empresarial dominante para sistemas distribuídos, cloud computing e microserviços.

Compreender essa evolução não é apenas memorizar datas e features - é entender **como Java sobreviveu e prosperou** enquanto linguagens contemporâneas (como C++Builder, Delphi dominantes nos anos 1990) declinaram, e como novos paradigmas (programação funcional, async/await, tipagem estática moderna) foram gradualmente incorporados mantendo compatibilidade com código legado.

### Contexto Histórico

#### O Desafio da Evolução

Quando Java foi lançado em 1996, Sun Microsystems enfrentava dilema que todas plataformas bem-sucedidas enfrentam: **como evoluir sem quebrar código existente?**

**Compromisso Original**: "Write Once, Run Anywhere" prometia que código compilado para Java 1.0 rodaria em qualquer versão futura de JVM. Isso criou **restrição arquitetural** - mudanças na linguagem precisavam ser **retrocompatíveis**.

**Tensão Entre Inovação e Estabilidade**:
- **Inovação**: Desenvolvedores queriam features modernas (generics, lambdas, pattern matching)
- **Estabilidade**: Empresas com milhões de linhas de código legado não podiam migrar facilmente
- **Solução**: Compatibilidade de bytecode + deprecation gradual + opções de compilação

#### Eras da Evolução Java

A história de Java pode ser dividida em **cinco eras distintas**:

```
1996-2004: ERA DOS FUNDAMENTOS (Java 1.0 → 1.4)
├─ Foco: Estabelecer linguagem e ecossistema
├─ Características: Applets, AWT/Swing, JDBC, Servlets
└─ Cadência: Releases espaçados (~2-3 anos)

2004-2011: ERA DA MATURIDADE (Java 5 → 7)
├─ Foco: Modernização da linguagem (generics, annotations)
├─ Características: Transformação em linguagem empresarial
└─ Cadência: ~2-3 anos, começando a desacelerar

2011-2014: ERA DA ESTAGNAÇÃO (Apenas Java 8 planejado)
├─ Foco: Programação funcional (lambdas, streams)
├─ Problemas: Delays massivos (Java 8 atrasou anos)
└─ Contexto: Oracle adquiriu Sun (2010), reorganização

2014-2017: ERA DA RENOVAÇÃO (Java 8 → 9)
├─ Foco: Modularização (Project Jigsaw/JPMS)
├─ Características: Mudança disruptiva na estrutura interna
└─ Impacto: Java 9 quebrou muitas bibliotecas (reflection issues)

2017-Presente: ERA DA CADÊNCIA RÁPIDA (Java 10+)
├─ Foco: Releases previsíveis, features incrementais
├─ Características: Release a cada 6 meses, LTS a cada 3 anos
└─ Filosofia: Evoluir rápido sem features massivas que atrasam
```

### Problema Fundamental que Resolve

#### Antes de Java: Fragmentação de Linguagens

**Anos 1980-1990**: Linguagens evoluíam lentamente ou fragmentavam em dialetos incompatíveis:
- **C**: C89 → C99 (10 anos entre padrões principais)
- **C++**: C++98 → C++11 (13 anos!)
- **Fortran**: Fortran 77 → Fortran 90 (13 anos)

**Consequência**: Código tornava-se obsoleto, mas migrar era caro. Empresas ficavam "presas" em versões antigas.

#### Modelo de Evolução Java

Java introduziu modelo diferente:

**1. Compatibilidade de Bytecode**:
```
Código compilado em Java 1.0 roda em JVM 21
(com raras exceções de APIs removidas)
```

**2. Source Compatibility (Maioria)**:
```java
// Código Java 1.0 ainda compila em javac 21
public class HelloWorld {
    public static void main(String args[]) {
        System.out.println("Hello, World!");
    }
}
```

**3. Deprecation Gradual**:
```java
// Java 1.1: Thread.stop() funciona
// Java 2: Thread.stop() marcado @Deprecated
// Java 8: Thread.stop() ainda existe mas emite warning
// Java 21: Ainda presente, nunca removido (compatibilidade)
```

Isso resolveu **problema de adoção**: Empresas podiam atualizar JVM para ganhar performance/segurança sem reescrever código.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Compatibilidade Retroativa**: Prioridade máxima - código antigo deve rodar em JVMs novas
2. **Evolução Incremental**: Features adicionadas gradualmente, não revoluções
3. **Mudança de Governança**: Sun → Oracle → OpenJDK/JCP (Java Community Process)
4. **Cadência de Releases**: Mudou de "quando estiver pronto" para "a cada 6 meses"
5. **LTS (Long-Term Support)**: Algumas versões recebem suporte estendido (8, 11, 17, 21)

### Marcos Históricos Principais

- **Java 1.0 (1996)**: Nascimento - applets e WORA
- **Java 1.2 (1998)**: "Java 2" - Collections Framework, Swing
- **Java 5 (2004)**: Revolução sintática - Generics, Annotations, Enums
- **Java 8 (2014)**: Programação funcional - Lambdas, Streams
- **Java 9 (2017)**: Modularização - JPMS, quebra interna de compatibilidade
- **Java 10+ (2018+)**: Cadência rápida - var, records, pattern matching, virtual threads

### Tendências de Evolução

- **Sintaxe**: Menos verbosa (var, records, switch expressions)
- **Performance**: GCs melhores (G1, ZGC, Shenandoah), JIT otimizado
- **Funcional**: Incorporação de paradigmas funcionais (lambdas, streams, optional)
- **Moderna**: Features de linguagens modernas (pattern matching, sealed classes)

---

## 🧠 Fundamentos Teóricos

### Java 1.0 (Janeiro 1996): O Início

**Contexto de Lançamento**: Era dos navegadores (Netscape dominante), internet crescendo exponencialmente.

#### Features Originais

**1. Linguagem**:
```java
// Java 1.0 tinha sintaxe básica OOP:
class Animal {
    void fazerSom() {
        System.out.println("Som genérico");
    }
}

class Cachorro extends Animal {
    void fazerSom() {
        System.out.println("Au au!");
    }
}
```

**2. Bibliotecas Core**:
- **java.lang**: Object, String, System, Thread, Math
- **java.util**: Date, Vector, Hashtable (sem Collections Framework ainda)
- **java.io**: File, InputStream, OutputStream
- **java.net**: Socket, URL
- **java.awt**: Applet, Frame, Button (GUI primitivo)

**3. Applets**:
```java
import java.applet.Applet;
import java.awt.Graphics;

public class HelloApplet extends Applet {
    public void paint(Graphics g) {
        g.drawString("Hello, World!", 50, 25);
    }
}
```

**Limitações**:
- Sem generics (tudo era Object)
- Sem Collections Framework (apenas Vector, Hashtable)
- AWT primitivo (GUI feia comparada a Windows nativo)
- Performance fraca (interpretador puro)

### Java 1.1 (Fevereiro 1997): Correções Essenciais

**Principais Adições**:

**1. Inner Classes**:
```java
class Externa {
    class Interna {
        void metodo() {
            // Acessa membros de Externa
        }
    }
}
```

**2. JavaBeans**: Convenções para componentes reutilizáveis
```java
public class PessoaBean {
    private String nome;
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
```

**3. JDBC**: Acesso a bancos de dados
```java
Connection conn = DriverManager.getConnection(
    "jdbc:mysql://localhost/db", "user", "pass"
);
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM users");
```

**4. RMI (Remote Method Invocation)**: Chamadas remotas entre JVMs

**5. Reflection API**: Introspecção de classes em runtime

**Impacto**: Java começou a ser viável para aplicações empresariais (não apenas applets).

### Java 1.2 (Dezembro 1998): "Java 2" - Plataforma Madura

**Rebranding**: Sun renomeou para "Java 2 Platform" para marcar maturidade.

#### Collections Framework

Substituiu estruturas antigas (Vector, Hashtable) por hierarquia moderna:

```java
// Java 1.0/1.1: Apenas tipos concretos, sem interfaces
Vector v = new Vector();
v.addElement("item");

// Java 1.2: Interfaces e implementações
List lista = new ArrayList();  // List é interface
lista.add("item");

Map mapa = new HashMap();
mapa.put("chave", "valor");

Set conjunto = new HashSet();
conjunto.add("único");
```

**Hierarquia**:
```
Collection (interface)
├── List (ArrayList, LinkedList)
├── Set (HashSet, TreeSet)
└── Queue (adicionado depois)

Map (não herda Collection)
├── HashMap
├── TreeMap
└── LinkedHashMap
```

#### Swing GUI Framework

Substituiu AWT com componentes mais ricos:
```java
// Swing: Look-and-feel personalizável
JFrame frame = new JFrame("Meu App");
JButton botao = new JButton("Clique");
frame.add(botao);
```

#### JIT Compiler (HotSpot)

- Substituiu interpretador puro
- Compilação Just-In-Time de bytecode para código nativo
- **Impacto**: Performance 10-20x melhor em loops intensivos

### Java 1.3 (Maio 2000) e 1.4 (Fevereiro 2002): Incrementais

**Java 1.3**:
- HotSpot como JVM padrão
- JNDI (Java Naming and Directory Interface)
- Melhorias em performance

**Java 1.4** (Último antes de Java 5):
- **assert**: Verificações de debug
```java
assert idade >= 0 : "Idade não pode ser negativa";
```
- **Logging API** (java.util.logging)
- **NIO** (New I/O): Buffers, Channels, Selectors
```java
FileChannel canal = new FileInputStream("arquivo.txt").getChannel();
ByteBuffer buffer = ByteBuffer.allocate(1024);
canal.read(buffer);
```
- **XML processing**: Parsers DOM/SAX embutidos
- **Regex**: java.util.regex
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Tenho 25 anos");
```

**Contexto Histórico**: Java 1.4 foi último "Java clássico" - sintaxe não mudaria drasticamente até Java 5.

### Java 5 (Setembro 2004): A Grande Revolução

**Renomeação**: Voltaram a numeração simples (5, não 1.5).

Java 5 foi **mudança mais radical na sintaxe Java** até então. Introduziu features que desenvolvedores de outras linguagens já tinham (C# tinha generics desde 2002).

#### 1. Generics (Tipos Parametrizados)

**Problema Antes**:
```java
// Java 1.4: Sem generics
List lista = new ArrayList();
lista.add("String");
lista.add(123);  // Compila! Runtime explode
String s = (String) lista.get(0);  // Cast manual sempre
```

**Solução Java 5**:
```java
List<String> lista = new ArrayList<String>();
lista.add("String");
lista.add(123);  // ERRO DE COMPILAÇÃO!
String s = lista.get(0);  // Sem cast
```

**Type Erasure**: Generics só existem em compile-time; bytecode usa Object
```java
// Compile-time: List<String>
// Runtime (bytecode): List (Object)
```

#### 2. Enhanced For Loop

```java
// Antes:
for (Iterator it = lista.iterator(); it.hasNext(); ) {
    String item = (String) it.next();
    System.out.println(item);
}

// Java 5:
for (String item : lista) {
    System.out.println(item);
}
```

#### 3. Autoboxing/Unboxing

```java
// Antes:
Integer obj = new Integer(10);
int primitivo = obj.intValue();

// Java 5:
Integer obj = 10;  // Autoboxing
int primitivo = obj;  // Unboxing
```

#### 4. Enums

```java
// Antes: constantes int perigosas
public static final int SEGUNDA = 1;
public static final int TERCA = 2;

// Java 5: Enums type-safe
enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

DiaSemana dia = DiaSemana.SEGUNDA;
```

#### 5. Varargs

```java
// Antes: array manual
void imprimir(String[] args) { ... }
imprimir(new String[] {"a", "b", "c"});

// Java 5: varargs
void imprimir(String... args) { ... }
imprimir("a", "b", "c");
```

#### 6. Annotations

```java
@Override
public String toString() {
    return "Exemplo";
}

@Deprecated
void metodoAntigo() { }

// Custom annotations
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface MeuAnnotation {
    String value();
}
```

**Impacto de Java 5**: Transformou Java em linguagem moderna comparável a C# 2.0. Frameworks como Hibernate, Spring adotaram massivamente annotations.

### Java 6 (Dezembro 2006): Melhorias Incrementais

**Principais Features**:
- **Scripting API**: Executar JavaScript, Groovy dentro de Java
```java
ScriptEngine engine = new ScriptEngineManager().getEngineByName("javascript");
engine.eval("print('Hello from JS')");
```
- **JDBC 4.0**: Auto-loading de drivers
- **Compilador API**: Compilar Java programaticamente
- **Performance**: Melhorias no HotSpot (30% mais rápido em benchmarks)

**Contexto**: Java 6 ficou "velho" rapidamente - Java 7 atrasou 5 anos (deveria ser 2008, saiu em 2011).

### Java 7 (Julho 2011): Modernização Adiada

**Atraso**: Features planejadas para 2008 só chegaram em 2011 (Oracle adquiriu Sun em 2010, reorganização).

#### Project Coin (Pequenas Melhorias de Sintaxe)

**1. Diamond Operator**:
```java
// Java 6:
Map<String, List<Integer>> mapa = new HashMap<String, List<Integer>>();

// Java 7:
Map<String, List<Integer>> mapa = new HashMap<>();  // <> infere tipos
```

**2. Strings em Switch**:
```java
String dia = "SEGUNDA";
switch (dia) {
    case "SEGUNDA":
        System.out.println("Início da semana");
        break;
    case "SEXTA":
        System.out.println("Quase fim!");
        break;
}
```

**3. Try-With-Resources**:
```java
// Antes: Fechar recursos manualmente
BufferedReader br = new BufferedReader(new FileReader("file.txt"));
try {
    return br.readLine();
} finally {
    br.close();  // Pode lançar exceção
}

// Java 7: Automático
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    return br.readLine();
}  // br.close() chamado automaticamente
```

**4. Multi-Catch**:
```java
// Antes:
try {
    // código
} catch (IOException e) {
    logger.log(e);
} catch (SQLException e) {
    logger.log(e);
}

// Java 7:
try {
    // código
} catch (IOException | SQLException e) {
    logger.log(e);
}
```

**5. Underscores em Números**:
```java
int milhao = 1_000_000;
long cartaoCredito = 1234_5678_9012_3456L;
```

#### Outras Melhorias

- **invokedynamic**: Instrução bytecode para linguagens dinâmicas (usada por Kotlin, Scala)
- **NIO.2**: API moderna de I/O (Path, Files)
```java
Path path = Paths.get("arquivo.txt");
List<String> linhas = Files.readAllLines(path);
```
- **Fork/Join Framework**: Paralelismo (precursor de streams)

### Java 8 (Março 2014): A Revolução Funcional

**Atraso Massivo**: Deveria ser 2012, saiu em 2014. Motivo: Complexidade de lambdas + modularização (que foi removida e adiada para Java 9).

Java 8 é **versão mais importante desde Java 5**. Introduziu programação funcional.

#### 1. Lambdas e Functional Interfaces

**Antes (Java 7)**:
```java
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
Collections.sort(nomes, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
});
```

**Java 8**:
```java
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
Collections.sort(nomes, (a, b) -> a.compareTo(b));
// Ou mais simples:
nomes.sort(String::compareTo);  // Method reference
```

**Functional Interfaces**:
```java
@FunctionalInterface
interface Operacao {
    int calcular(int a, int b);
}

Operacao soma = (a, b) -> a + b;
Operacao multiplicacao = (a, b) -> a * b;
```

#### 2. Streams API

**Processamento declarativo de coleções**:
```java
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos", "Amanda");

// Antes: imperativo
List<String> resultado = new ArrayList<>();
for (String nome : nomes) {
    if (nome.startsWith("A")) {
        resultado.add(nome.toUpperCase());
    }
}

// Java 8: declarativo
List<String> resultado = nomes.stream()
    .filter(nome -> nome.startsWith("A"))
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

**Operações Comuns**:
```java
// Filter, map, reduce
int somaIdades = pessoas.stream()
    .filter(p -> p.getIdade() > 18)
    .mapToInt(Pessoa::getIdade)
    .sum();

// Grouping
Map<String, List<Pessoa>> porCidade = pessoas.stream()
    .collect(Collectors.groupingBy(Pessoa::getCidade));
```

#### 3. Optional

**Evitar NullPointerException**:
```java
// Antes:
public String getNomeCidade(Pessoa pessoa) {
    if (pessoa != null) {
        Endereco endereco = pessoa.getEndereco();
        if (endereco != null) {
            Cidade cidade = endereco.getCidade();
            if (cidade != null) {
                return cidade.getNome();
            }
        }
    }
    return "Desconhecido";
}

// Java 8:
public String getNomeCidade(Pessoa pessoa) {
    return Optional.ofNullable(pessoa)
        .map(Pessoa::getEndereco)
        .map(Endereco::getCidade)
        .map(Cidade::getNome)
        .orElse("Desconhecido");
}
```

#### 4. Date/Time API (JSR 310)

Substituiu java.util.Date (terrível):
```java
// Antes: Date mutável, timezone confuso
Date data = new Date();
data.setYear(2024 - 1900);  // WTF?

// Java 8: Imutável, claro
LocalDate hoje = LocalDate.now();
LocalDate amanha = hoje.plusDays(1);
LocalDateTime agora = LocalDateTime.now();
ZonedDateTime emTokyo = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));
```

#### 5. Default Methods em Interfaces

**Problema**: Como adicionar métodos em interfaces sem quebrar implementações existentes?

**Solução**:
```java
interface MinhaInterface {
    void metodoExistente();
    
    // Java 8: Default method
    default void novoMetodo() {
        System.out.println("Implementação padrão");
    }
}
```

**Usado Massivamente**: Collections ganharam `.stream()`, `.forEach()` sem quebrar código legado.

**Impacto de Java 8**: Transformou Java em linguagem funcional-OO híbrida. Adoção massiva - muitas empresas "pularam" Java 9-10 e migraram direto 8 → 11.

### Java 9 (Setembro 2017): Modularização Disruptiva

**Project Jigsaw (JPMS - Java Platform Module System)**: Quebrou estrutura interna de Java.

#### Módulos

**Antes**: JDK era monolítico (rt.jar com 60+ MB de classes).

**Java 9**: JDK dividido em módulos:
```
java.base (módulo core - sempre presente)
java.sql (JDBC)
java.xml (XML processing)
java.desktop (AWT/Swing)
...
```

**Definir Módulo**:
```java
// module-info.java
module com.exemplo.meuapp {
    requires java.sql;  // Depende de módulo SQL
    exports com.exemplo.api;  // Exporta pacote
}
```

**Benefícios**:
- Runtime customizado (jlink) com apenas módulos necessários
- Encapsulamento forte (internals não acessíveis)
- Dependências explícitas

**Problemas**:
- **Quebrou Reflection**: Código que acessava internals (sun.* packages) parou de funcionar
- **Frameworks Sofreram**: Hibernate, Spring precisaram de atualizações massivas
- **Adoção Lenta**: Muitas empresas evitaram Java 9 por anos

#### Outras Features (Ofuscadas por JPMS)

- **JShell**: REPL para Java
```bash
jshell> int x = 10
x ==> 10
jshell> System.out.println(x * 2)
20
```
- **HTTP/2 Client** (incubator)
- **Melhorias em Streams**: takeWhile, dropWhile, ofNullable
- **Private Methods em Interfaces**

### Java 10 (Março 2018): Início da Cadência Rápida

**Mudança de Modelo**: A partir daqui, releases a cada 6 meses.

#### var (Local Variable Type Inference)

```java
// Antes:
Map<String, List<Integer>> mapa = new HashMap<>();

// Java 10:
var mapa = new HashMap<String, List<Integer>>();
// Tipo inferido pelo compilador
```

**Limitações**: Apenas variáveis locais, não funciona para:
```java
var x;  // ERRO: Precisa de inicializador
var metodo() { }  // ERRO: Não funciona em retorno de método
```

#### Outras Melhorias

- **G1 GC Parallel Full GC**: Melhoria no garbage collector
- **Application Class-Data Sharing**: Startup mais rápido

### Java 11 (Setembro 2018): Primeira LTS Pós-Java 8

**LTS**: Long-Term Support - suportada por 3+ anos (comercialmente até 8 anos com vendors).

#### Features Principais

**1. HTTP Client (Padronizado)**:
```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com"))
    .build();

HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
```

**2. String API Melhorada**:
```java
"  texto  ".isBlank();  // true para só whitespace
"linha1\nlinha2\nlinha3".lines()  // Stream<String>
    .forEach(System.out::println);

"Java ".repeat(3);  // "Java Java Java "
```

**3. var em Lambdas**:
```java
(var a, var b) -> a + b  // Pode usar var para parâmetros
```

**4. Executar .java Diretamente**:
```bash
# Sem compilar explicitamente
java HelloWorld.java  # Java compila e executa
```

**Importância**: Primeira LTS após Java 8 (3 anos depois). Muitas empresas migraram 8 → 11.

---

(Devido ao limite de caracteres, versões 12-21 e seções restantes serão criadas no próximo arquivo)
