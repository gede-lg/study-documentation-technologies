# 🏭 Factory Pattern com Enums

## 🎯 Introdução

O **Factory Pattern** com enums oferece uma forma elegante de centralizar criação de objetos, onde cada **constante enum representa um tipo de objeto a ser criado** através de métodos factory. Esta abordagem elimina verbosidade de factory classes tradicionais, oferece **type-safety** através do sistema de tipos do enum, e permite **seleção via switch expressions** de forma concisa e verificável em tempo de compilação.

### Contexto Histórico

**Factory Tradicional (GoF):**

```java
// ❌ Factory tradicional - verboso
public abstract class Forma {
    abstract void desenhar();
}

public class Circulo extends Forma {
    void desenhar() { System.out.println("Círculo"); }
}

public class Quadrado extends Forma {
    void desenhar() { System.out.println("Quadrado"); }
}

public class FormaFactory {
    public static Forma criar(String tipo) {
        switch (tipo) {
            case "CIRCULO":
                return new Circulo();
            case "QUADRADO":
                return new Quadrado();
            default:
                throw new IllegalArgumentException("Tipo inválido: " + tipo);
        }
    }
}

// Uso
Forma forma = FormaFactory.criar("CIRCULO");  // Sem type-safety na String!
```

**Problemas:**
- String como tipo: sem verificação em tempo de compilação
- Pode passar tipo inválido ("CIRC", "circulo", etc.)
- Verboso e repetitivo

**Factory com Enum:**

```java
// ✅ Factory com enum - type-safe e conciso
public enum TipoForma {
    CIRCULO {
        public Forma criar() {
            return new Circulo();
        }
    },
    QUADRADO {
        public Forma criar() {
            return new Quadrado();
        }
    };

    public abstract Forma criar();
}

// Uso
Forma forma = TipoForma.CIRCULO.criar();  // Type-safe!
```

## 📋 Fundamentos Teóricos

### Como Funciona

**1. Enum como Catálogo de Tipos**

Cada constante enum representa um **tipo de produto** que pode ser criado.

```java
public enum TipoVeiculo {
    CARRO, MOTO, CAMINHAO
}
```

**2. Método Factory Abstrato**

Enum declara método abstrato que retorna instância do produto, forçando cada constante a implementar lógica de criação.

```java
public enum TipoVeiculo {
    CARRO {
        public Veiculo criar() {
            return new Carro();
        }
    };

    public abstract Veiculo criar();
}
```

**3. Parametrização Opcional**

Métodos factory podem aceitar parâmetros para configurar objetos criados.

```java
public enum TipoRelatorio {
    PDF {
        public Relatorio criar(String titulo, List<Dado> dados) {
            return new RelatorioPDF(titulo, dados);
        }
    };

    public abstract Relatorio criar(String titulo, List<Dado> dados);
}
```

## 🔍 Exemplos Práticos

### Factory de Conexões de Banco de Dados

```java
public enum TipoBancoDados {
    MYSQL {
        public Connection criar(String url, String user, String pass) throws SQLException {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection("jdbc:mysql://" + url, user, pass);
        }

        public String getDriverClass() {
            return "com.mysql.cj.jdbc.Driver";
        }
    },
    POSTGRESQL {
        public Connection criar(String url, String user, String pass) throws SQLException {
            Class.forName("org.postgresql.Driver");
            return DriverManager.getConnection("jdbc:postgresql://" + url, user, pass);
        }

        public String getDriverClass() {
            return "org.postgresql.Driver";
        }
    },
    H2 {
        public Connection criar(String url, String user, String pass) throws SQLException {
            Class.forName("org.h2.Driver");
            return DriverManager.getConnection("jdbc:h2:" + url, user, pass);
        }

        public String getDriverClass() {
            return "org.h2.Driver";
        }
    };

    public abstract Connection criar(String url, String user, String pass) throws SQLException;
    public abstract String getDriverClass();
}

// Uso
Connection conn = TipoBancoDados.POSTGRESQL.criar(
    "localhost:5432/mydb",
    "user",
    "password"
);
```

### Factory de Parsers

```java
public enum TipoParser {
    JSON {
        public Parser<JsonNode> criar() {
            return new JsonParser();
        }

        public <T> T parsear(String conteudo, Class<T> tipo) {
            return new ObjectMapper().readValue(conteudo, tipo);
        }
    },
    XML {
        public Parser<Document> criar() {
            return new XmlParser();
        }

        public <T> T parsear(String conteudo, Class<T> tipo) {
            return new XmlMapper().readValue(conteudo, tipo);
        }
    },
    YAML {
        public Parser<Object> criar() {
            return new YamlParser();
        }

        public <T> T parsear(String conteudo, Class<T> tipo) {
            return new Yaml().loadAs(conteudo, tipo);
        }
    };

    public abstract Parser<?> criar();
    public abstract <T> T parsear(String conteudo, Class<T> tipo);
}

// Uso
TipoParser parser = TipoParser.JSON;
Usuario usuario = parser.parsear(jsonString, Usuario.class);
```

### Factory de Validadores

```java
public enum TipoValidador {
    EMAIL {
        public Validator criar() {
            return new Validator() {
                public boolean validar(String valor) {
                    return valor != null && valor.matches("^[A-Za-z0-9+_.-]+@(.+)$");
                }

                public String getMensagemErro() {
                    return "Email inválido";
                }
            };
        }
    },
    CPF {
        public Validator criar() {
            return new Validator() {
                public boolean validar(String valor) {
                    return valor != null && valor.matches("\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}");
                }

                public String getMensagemErro() {
                    return "CPF inválido";
                }
            };
        }
    },
    TELEFONE {
        public Validator criar() {
            return new Validator() {
                public boolean validar(String valor) {
                    return valor != null && valor.matches("\\(\\d{2}\\) \\d{4,5}-\\d{4}");
                }

                public String getMensagemErro() {
                    return "Telefone inválido";
                }
            };
        }
    };

    public abstract Validator criar();
}

// Interface
interface Validator {
    boolean validar(String valor);
    String getMensagemErro();
}

// Uso
Validator validador = TipoValidador.EMAIL.criar();
if (!validador.validar("usuario@exemplo")) {
    System.out.println(validador.getMensagemErro());
}
```

### Factory de HTTP Clients

```java
public enum TipoHttpClient {
    APACHE_HTTP_CLIENT {
        public HttpClient criar() {
            return HttpClients.custom()
                .setConnectionManager(new PoolingHttpClientConnectionManager())
                .build();
        }

        public Response executarGet(String url) {
            // Implementação com Apache HttpClient
            return new Response();
        }
    },
    OK_HTTP {
        public HttpClient criar() {
            return new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .build();
        }

        public Response executarGet(String url) {
            // Implementação com OkHttp
            return new Response();
        }
    },
    JAVA_NET_HTTP {
        public HttpClient criar() {
            return HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .build();
        }

        public Response executarGet(String url) {
            // Implementação com java.net.http
            return new Response();
        }
    };

    public abstract HttpClient criar();
    public abstract Response executarGet(String url);
}
```

## 🎯 Factory com Switch Expression

```java
public enum TipoNotificacao {
    EMAIL, SMS, PUSH;

    public static Notificador criarNotificador(TipoNotificacao tipo, Map<String, String> config) {
        return switch (tipo) {
            case EMAIL -> new EmailNotificador(
                config.get("smtp.host"),
                config.get("smtp.port")
            );
            case SMS -> new SmsNotificador(
                config.get("api.key"),
                config.get("api.url")
            );
            case PUSH -> new PushNotificador(
                config.get("fcm.key")
            );
        };
    }
}

// Uso
Map<String, String> config = Map.of(
    "smtp.host", "smtp.gmail.com",
    "smtp.port", "587"
);
Notificador notificador = TipoNotificacao.criarNotificador(TipoNotificacao.EMAIL, config);
```

## 💡 Factory com Registro e Lookup

```java
public enum TipoExportador {
    CSV {
        public Exportador criar() {
            return new CsvExportador();
        }

        public String getExtensao() {
            return ".csv";
        }

        public String getContentType() {
            return "text/csv";
        }
    },
    PDF {
        public Exportador criar() {
            return new PdfExportador();
        }

        public String getExtensao() {
            return ".pdf";
        }

        public String getContentType() {
            return "application/pdf";
        }
    },
    EXCEL {
        public Exportador criar() {
            return new ExcelExportador();
        }

        public String getExtensao() {
            return ".xlsx";
        }

        public String getContentType() {
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }
    };

    // Lookup map estático para busca por extensão
    private static final Map<String, TipoExportador> POR_EXTENSAO;

    static {
        POR_EXTENSAO = new HashMap<>();
        for (TipoExportador tipo : values()) {
            POR_EXTENSAO.put(tipo.getExtensao(), tipo);
        }
    }

    public abstract Exportador criar();
    public abstract String getExtensao();
    public abstract String getContentType();

    public static TipoExportador porExtensao(String extensao) {
        TipoExportador tipo = POR_EXTENSAO.get(extensao);
        if (tipo == null) {
            throw new IllegalArgumentException("Extensão não suportada: " + extensao);
        }
        return tipo;
    }
}

// Uso
String arquivo = "relatorio.pdf";
String extensao = arquivo.substring(arquivo.lastIndexOf('.'));
TipoExportador tipo = TipoExportador.porExtensao(extensao);
Exportador exportador = tipo.criar();
```

## ⚡ Vantagens sobre Factory Tradicional

**1. Type-Safety**
```java
// ❌ Factory tradicional aceita String inválida
Forma f = FormaFactory.criar("CIRC");  // Erro em runtime

// ✅ Enum só aceita valores válidos
Forma f = TipoForma.CIRCULO.criar();  // Erro de compilação se inválido
```

**2. Verificação de Completude**
```java
// Compilador avisa se alguma constante não implementa o factory method
```

**3. Facilita Switch/Pattern Matching**
```java
String descricao = switch (tipo) {
    case CIRCULO -> "Forma circular";
    case QUADRADO -> "Forma quadrada";
    // Compilador avisa se falta algum caso
};
```

**4. Menos Classes**
- Factory tradicional: 1 interface + N classes + 1 factory class
- Enum factory: 1 enum apenas

## ⚠️ Limitações

**1. Conjunto Fechado de Tipos**
```java
// ❌ Não é possível adicionar novos tipos em runtime
// Tipos são fixos no enum
```

**2. Criação Simples Preferível**
```java
// Se criação é trivial, factory pode ser overkill
// Prefira: new Circulo() ao invés de TipoForma.CIRCULO.criar()
```

**Quando Usar:**
- Múltiplos tipos de objetos relacionados
- Lógica de criação complexa
- Seleção de tipo baseada em configuração/input
- Necessidade de catalogar tipos disponíveis

## 🔗 Interconexões

**Relação com Constant-Specific Methods**: Factory usa implementação específica por constante

**Relação com Abstract Factory**: Enum factory pode ser parte de Abstract Factory maior

**Relação com Builder**: Factory pode retornar Builders configurados
