# T8.02 - Blocos de Inicialização Estática

## Introdução e Definição

**Blocos de inicialização estática** (static initialization blocks) são blocos de código marcados com a palavra-chave **`static`** e delimitados por chaves `{}`, declarados dentro de uma classe. Eles são executados **automaticamente** quando a classe é **carregada** pela JVM (Java Virtual Machine), **antes** de qualquer instância ser criada e **apenas uma vez** durante toda a execução do programa.

Esses blocos são usados para **inicializar membros estáticos** (atributos estáticos, constantes) de forma complexa, executar **configurações de classe** que precisam acontecer uma única vez, ou realizar **operações de setup** que são comuns a toda a classe, não a instâncias individuais.

**Sintaxe**:
```java
public class Exemplo {
    private static int contador;
    private static List<String> nomes;

    // Bloco de inicialização estática
    static {
        System.out.println("Bloco estático executado");
        contador = 0;
        nomes = new ArrayList<>();
        nomes.add("Padrão");
    }

    public Exemplo() {
        contador++;
        System.out.println("Construtor executado, contador = " + contador);
    }
}

// Ao usar a classe pela primeira vez:
Exemplo e1 = new Exemplo();
// Saída:
// Bloco estático executado
// Construtor executado, contador = 1

Exemplo e2 = new Exemplo();
// Saída:
// Construtor executado, contador = 2
// (Bloco estático NÃO é executado novamente)
```

**Características principais**:
- Executado **uma única vez** quando a classe é carregada
- Executado **antes** de qualquer instância ser criada
- Executado **antes** de qualquer método estático ser chamado
- Pode haver **múltiplos** blocos estáticos, executados na ordem
- Têm acesso apenas a **membros estáticos** (`static`)
- **Não** têm acesso a `this` (não há instância)
- Úteis para **inicialização complexa** de atributos estáticos

---

## 10 Fundamentos Teóricos

### 1. Sintaxe e Declaração

Um bloco de inicialização estática é declarado com a palavra-chave `static` seguida de um bloco de código `{}`.

```java
public class Config {
    private static String versao;
    private static Properties propriedades;

    // Bloco de inicialização estática
    static {
        System.out.println("Inicializando classe Config");
        versao = "1.0";
        propriedades = new Properties();
        propriedades.setProperty("app", "MeuApp");
    }
}
```

O bloco é executado automaticamente quando a classe `Config` é carregada.

---

### 2. Execução Única ao Carregar a Classe

O bloco estático é executado **apenas uma vez**, quando a classe é carregada pela JVM. Isso acontece na **primeira vez** que a classe é referenciada (criação de objeto, acesso a membro estático, etc.).

```java
public class Singleton {
    private static int contador = 0;

    static {
        System.out.println("Bloco estático: Classe carregada");
        contador = 100;
    }

    public static void metodo() {
        System.out.println("Método estático: contador = " + contador);
    }
}

// Primeira referência à classe
Singleton.metodo();
// Saída:
// Bloco estático: Classe carregada
// Método estático: contador = 100

// Segunda referência
Singleton.metodo();
// Saída:
// Método estático: contador = 100
// (Bloco estático NÃO executado novamente)
```

---

### 3. Carregamento de Classe (Class Loading)

A JVM carrega uma classe quando:
- Uma instância é criada (`new MinhaClasse()`)
- Um método estático é chamado (`MinhaClasse.metodo()`)
- Um atributo estático é acessado (`MinhaClasse.atributo`)
- A classe é referenciada por reflexão (`Class.forName("MinhaClasse")`)

O bloco estático é executado **no momento do carregamento**.

```java
public class Carregamento {
    static {
        System.out.println("Classe carregada!");
    }

    public static int CONSTANTE = 42;
}

// Acessando atributo estático
int x = Carregamento.CONSTANTE;
// Saída: Classe carregada!
```

---

### 4. Múltiplos Blocos Estáticos

Uma classe pode ter **múltiplos** blocos de inicialização estática. Eles são executados na **ordem em que aparecem** no código.

```java
public class MultiplosBlocos {
    private static int a, b, c;

    static {
        System.out.println("Bloco 1");
        a = 1;
    }

    static {
        System.out.println("Bloco 2");
        b = 2;
    }

    static {
        System.out.println("Bloco 3");
        c = 3;
    }

    public static void exibir() {
        System.out.println("a=" + a + ", b=" + b + ", c=" + c);
    }
}

// Primeira chamada
MultiplosBlocos.exibir();
// Saída:
// Bloco 1
// Bloco 2
// Bloco 3
// a=1, b=2, c=3
```

---

### 5. Inicialização de Atributos Estáticos

Blocos estáticos são usados para inicializar atributos estáticos de forma **complexa**, quando a inicialização direta não é suficiente.

```java
public class Database {
    private static Connection conexao;
    private static boolean conectado;

    // Inicialização complexa
    static {
        try {
            System.out.println("Conectando ao banco de dados...");
            Class.forName("com.mysql.jdbc.Driver");
            conexao = DriverManager.getConnection("jdbc:mysql://localhost/db", "user", "pass");
            conectado = true;
            System.out.println("Conexão estabelecida");
        } catch (Exception e) {
            System.err.println("Erro ao conectar: " + e.getMessage());
            conectado = false;
        }
    }

    public static boolean isConectado() {
        return conectado;
    }
}
```

A conexão é estabelecida uma vez quando a classe é carregada.

---

### 6. Acesso Apenas a Membros Estáticos

Blocos estáticos têm acesso apenas a **membros estáticos** (`static`). Não podem acessar atributos de instância nem usar `this`.

```java
public class Restricoes {
    private static int valorEstatico = 10;
    private int valorInstancia = 20;

    static {
        System.out.println(valorEstatico);   // OK: membro estático
        // System.out.println(valorInstancia); // ERRO: membro de instância
        // System.out.println(this.valorEstatico); // ERRO: this não existe em contexto estático
    }
}
```

**Razão**: Blocos estáticos executam **antes** de qualquer instância existir, então não há `this`.

---

### 7. Ordem com Inicialização Direta de Atributos Estáticos

Se atributos estáticos são inicializados diretamente (`static int x = 5;`) **e** em blocos estáticos, a ordem é:
1. Inicialização direta de atributos estáticos
2. Blocos de inicialização estática
3. (Depois, ao criar objetos: inicialização de instância)

```java
public class OrdemEstatica {
    private static int valor = 5; // 1. Inicialização direta

    // 2. Bloco estático
    static {
        System.out.println("Bloco estático: valor = " + valor); // 5
        valor = 10;
    }

    public static void exibir() {
        System.out.println("Método: valor = " + valor); // 10
    }
}

OrdemEstatica.exibir();
// Saída:
// Bloco estático: valor = 5
// Método: valor = 10
```

---

### 8. Tratamento de Exceções

Blocos estáticos podem lançar exceções. Se lançarem uma **checked exception**, ela deve ser tratada dentro do bloco, pois blocos estáticos não podem declarar `throws`.

```java
public class ComExcecao {
    private static Properties config;

    static {
        try {
            config = new Properties();
            config.load(new FileInputStream("config.properties"));
            System.out.println("Configuração carregada");
        } catch (IOException e) {
            // DEVE tratar aqui, não pode declarar throws
            System.err.println("Erro ao carregar config: " + e.getMessage());
            config = new Properties(); // Fallback
        }
    }
}
```

Se uma **unchecked exception** for lançada e não tratada, a classe **não será carregada** e um `ExceptionInInitializerError` será lançado.

```java
static {
    throw new RuntimeException("Erro crítico");
}

// Ao tentar usar a classe:
// Exception in thread "main" java.lang.ExceptionInInitializerError
```

---

### 9. Uso em Enums

Enums podem ter blocos estáticos para inicialização de recursos compartilhados entre todas as constantes.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE;

    private static Map<String, Status> mapa;

    // Bloco estático do enum
    static {
        mapa = new HashMap<>();
        for (Status s : values()) {
            mapa.put(s.name(), s);
        }
        System.out.println("Mapa de Status inicializado");
    }

    public static Status buscar(String nome) {
        return mapa.get(nome);
    }
}
```

---

### 10. Blocos Estáticos em Herança

Em hierarquias de herança, blocos estáticos da **superclasse** são executados **antes** dos blocos estáticos da subclasse.

```java
class Pai {
    static {
        System.out.println("Bloco estático Pai");
    }
}

class Filho extends Pai {
    static {
        System.out.println("Bloco estático Filho");
    }
}

// Primeira referência à classe Filho
Filho f = new Filho();
// Saída:
// Bloco estático Pai
// Bloco estático Filho
```

A classe pai é carregada **antes** da classe filha.

---

## Aplicabilidade

### Quando Usar Blocos de Inicialização Estática

1. **Inicialização Complexa de Atributos Estáticos**: Quando a inicialização direta não é suficiente.
   ```java
   static {
       conexao = conectarBanco();
   }
   ```

2. **Carregar Configurações**: Carregar propriedades, arquivos de configuração, recursos.
   ```java
   static {
       config.load(new FileInputStream("app.properties"));
   }
   ```

3. **Inicializar Coleções Estáticas**: Preencher `List`, `Map`, `Set` estáticos com valores.
   ```java
   static {
       CORES.add("Vermelho");
       CORES.add("Azul");
   }
   ```

4. **Carregar Drivers ou Bibliotecas Nativas**: Registrar drivers JDBC, carregar JNI.
   ```java
   static {
       Class.forName("com.mysql.jdbc.Driver");
   }
   ```

5. **Caching e Pré-computação**: Calcular ou cachear valores que são usados por toda a classe.
   ```java
   static {
       FATORIAL_CACHE = calcularFatoriais(100);
   }
   ```

6. **Logging e Monitoramento**: Registrar o carregamento da classe.
   ```java
   static {
       logger.info("Classe " + MinhaClasse.class.getName() + " carregada");
   }
   ```

### Quando NÃO Usar

1. **Inicialização Simples**: Use inicialização direta (`static int x = 10;`).
2. **Lógica de Instância**: Use blocos de inicialização de instância ou construtores.
3. **Operações Pesadas**: Evite operações demoradas em blocos estáticos, pois bloqueiam o carregamento da classe.

---

## Armadilhas Comuns

### 1. Exceções Não Tratadas Impedem Carregamento

Se um bloco estático lançar uma exceção não tratada, a classe **não será carregada**.

```java
public class Problema {
    static {
        throw new RuntimeException("Erro!");
    }
}

// Tentando usar:
Problema p = new Problema();
// Exception in thread "main" java.lang.ExceptionInInitializerError
```

**Solução**: Sempre trate exceções em blocos estáticos.

```java
static {
    try {
        // Código que pode lançar exceção
    } catch (Exception e) {
        // Tratar ou usar fallback
    }
}
```

---

### 2. Ordem de Carregamento em Herança

Esquecer que blocos estáticos da superclasse executam antes dos da subclasse pode causar erros.

```java
class Pai {
    static int valor = inicializar();
    static int inicializar() {
        System.out.println("Pai inicializar");
        return 10;
    }
}

class Filho extends Pai {
    static {
        System.out.println("Filho bloco estático: valor Pai = " + valor);
    }
}

new Filho();
// Saída:
// Pai inicializar
// Filho bloco estático: valor Pai = 10
```

---

### 3. Acesso a Membros de Instância

Blocos estáticos não podem acessar membros de instância nem `this`.

```java
public class Erro {
    private int instancia = 10;

    static {
        // System.out.println(instancia); // ERRO: não pode acessar membro de instância
    }
}
```

---

### 4. Ordem de Inicialização de Atributos Estáticos

Se atributos estáticos dependem uns dos outros, a **ordem** de declaração importa.

```java
public class OrdemProblema {
    static int b = a + 1; // a ainda é 0 (valor padrão)
    static int a = 10;

    static {
        System.out.println("a = " + a); // 10
        System.out.println("b = " + b); // 1 (não 11!)
    }
}
```

**Solução**: Declare atributos na ordem de dependência ou use blocos estáticos.

```java
static int a = 10;
static int b = a + 1; // Agora b = 11
```

---

### 5. Performance: Operações Pesadas

Blocos estáticos executam durante o carregamento da classe, bloqueando a thread. Evite operações demoradas.

```java
// Evitar
static {
    // Operação que leva 10 segundos
    carregarDadosMassivos();
}

// Preferir: Lazy loading
private static Data dados;
public static Data getDados() {
    if (dados == null) {
        dados = carregarDadosMassivos();
    }
    return dados;
}
```

---

## Boas Práticas

### 1. Use Para Inicialização Complexa de Membros Estáticos

Quando a inicialização direta não é suficiente, use blocos estáticos.

```java
// Simples: inicialização direta
private static final int MAX = 100;

// Complexa: bloco estático
private static Map<String, String> config;
static {
    config = carregarConfig();
}
```

---

### 2. Trate Exceções Adequadamente

Sempre trate exceções em blocos estáticos para evitar `ExceptionInInitializerError`.

```java
static {
    try {
        recurso = inicializar();
    } catch (Exception e) {
        logger.error("Erro na inicialização", e);
        recurso = fallback();
    }
}
```

---

### 3. Evite Lógica Complexa Demais

Mantenha blocos estáticos simples. Lógica complexa deve estar em métodos privados estáticos.

```java
static {
    inicializarConfig();
    carregarRecursos();
}

private static void inicializarConfig() { ... }
private static void carregarRecursos() { ... }
```

---

### 4. Documente Blocos Não Óbvios

Se um bloco estático realiza operações importantes, documente.

```java
/**
 * Inicializa a conexão com o banco de dados.
 * Executado uma vez ao carregar a classe.
 */
static {
    conectarBanco();
}
```

---

### 5. Use final em Constantes Inicializadas em Blocos

Se um atributo estático não muda após inicialização, declare-o `final`.

```java
private static final Map<String, String> CONFIG;

static {
    CONFIG = new HashMap<>();
    CONFIG.put("versao", "1.0");
    // CONFIG não pode ser reatribuído depois
}
```

---

### 6. Prefira Inicialização Direta Para Valores Simples

Para valores simples, use inicialização direta em vez de blocos.

```java
// Simples: Prefira
private static final String VERSAO = "1.0";

// Desnecessário
static {
    VERSAO = "1.0";
}
```

---

### 7. Considere Lazy Initialization

Para recursos pesados, considere **lazy initialization** (inicializar sob demanda) em vez de blocos estáticos.

```java
private static Connection conexao;

public static Connection getConexao() {
    if (conexao == null) {
        conexao = conectar(); // Inicializa sob demanda
    }
    return conexao;
}
```

---

### 8. Use Holder Pattern Para Singleton Thread-Safe

O padrão **Initialization-on-demand holder idiom** usa blocos estáticos de forma elegante para Singletons thread-safe.

```java
public class Singleton {
    private Singleton() {}

    // Holder interno
    private static class Holder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return Holder.INSTANCE; // Carregamento lazy e thread-safe
    }
}
```

O bloco estático do `Holder` só executa quando `getInstance()` é chamado pela primeira vez.

---

### 9. Evite Dependências Circulares Entre Classes

Blocos estáticos podem causar deadlocks se houver dependências circulares entre classes.

```java
// Evitar
class A {
    static B b = new B();
}

class B {
    static A a = new A(); // Dependência circular!
}
```

---

### 10. Log o Carregamento da Classe

Para debugging, registre o carregamento da classe.

```java
static {
    logger.debug("Classe {} carregada", MinhaClasse.class.getName());
}
```

---

## Resumo Executivo

**Blocos de inicialização estática** são blocos de código marcados com `static {}`, executados **uma única vez** quando a classe é **carregada** pela JVM, **antes** de qualquer instância ser criada.

**Sintaxe**:
```java
public class Exemplo {
    private static int valor;

    static {
        // Código executado UMA VEZ ao carregar a classe
        valor = 100;
    }
}
```

**Características**:
- Executado **apenas uma vez** (ao carregar a classe)
- Executado **antes** de qualquer instância ser criada
- Múltiplos blocos executam na **ordem de declaração**
- Têm acesso apenas a **membros estáticos**
- **Não** têm acesso a `this` (contexto estático)
- Úteis para **inicialização complexa** de atributos estáticos

**Carregamento de Classe** (quando blocos estáticos executam):
- Primeira criação de instância (`new MinhaClasse()`)
- Primeira chamada a método estático (`MinhaClasse.metodo()`)
- Primeiro acesso a atributo estático (`MinhaClasse.atributo`)
- Reflexão (`Class.forName("MinhaClasse")`)

**Ordem de Execução**:
1. Inicialização direta de atributos estáticos (`static int x = 5;`)
2. Blocos de inicialização estática (na ordem de declaração)
3. (Ao criar objetos: inicialização de instância + construtor)

**Ordem em Herança**:
- Blocos estáticos da **superclasse** executam **antes** dos da subclasse

**Quando Usar**:
- Inicialização **complexa** de atributos estáticos
- Carregar **configurações** e recursos
- Inicializar **coleções estáticas** com valores
- Carregar **drivers** (JDBC) ou bibliotecas nativas
- **Caching** e pré-computação de valores
- Logging de carregamento da classe

**Quando NÃO Usar**:
- Inicialização **simples** (use inicialização direta)
- Lógica de **instância** (use blocos de instância ou construtores)
- Operações **pesadas** (considere lazy initialization)

**Boas Práticas**:
- **Trate exceções** adequadamente (evite `ExceptionInInitializerError`)
- Mantenha blocos **simples**; lógica complexa em métodos privados
- Use **`final`** em constantes inicializadas
- Prefira **inicialização direta** para valores simples
- Considere **lazy initialization** para recursos pesados
- **Documente** blocos não óbvios
- Use **Holder Pattern** para Singletons thread-safe
- **Log** o carregamento da classe para debugging

**Armadilhas**:
- Exceções não tratadas impedem carregamento da classe (`ExceptionInInitializerError`)
- Ordem de carregamento em herança (superclasse primeiro)
- Não pode acessar membros de instância nem `this`
- Ordem de inicialização de atributos estáticos importa
- Operações pesadas bloqueiam carregamento da classe
- Dependências circulares entre classes podem causar deadlocks

Blocos de inicialização estática são essenciais para **configurar classes** antes de qualquer uso, garantindo que recursos compartilhados estejam prontos de forma **centralizada** e **automática**.
