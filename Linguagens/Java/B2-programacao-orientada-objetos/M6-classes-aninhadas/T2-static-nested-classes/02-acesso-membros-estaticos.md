# T2.02 - Acesso a Membros Estáticos da Classe Externa

## Introdução

**Static nested class**: acessa apenas membros `static` da classe externa.

```java
public class Externa {
    private static String valorStatic = "Static";
    private String valorInstancia = "Instância";
    
    public static class Nested {
        public void acessar() {
            // ✅ OK: acessa membro static
            System.out.println(valorStatic);
            
            // ❌ ERRO: não acessa membro de instância
            // System.out.println(valorInstancia);
        }
    }
}
```

**Apenas static**: nested class não tem referência à instância externa.

---

## Fundamentos

### 1. Acesso a Atributos Static

**Atributos static**: acessíveis diretamente.

```java
public class Empresa {
    private static String razaoSocial = "Empresa XYZ Ltda";
    private static int totalFuncionarios = 0;
    private String nome = "Instância"; // Não acessível
    
    public static class Relatorio {
        public void gerar() {
            // ✅ Acessa atributos static
            System.out.println("Razão Social: " + razaoSocial);
            System.out.println("Total de Funcionários: " + totalFuncionarios);
            
            // ❌ ERRO: não acessa atributo de instância
            // System.out.println(nome);
        }
    }
}

// Uso
Empresa.Relatorio rel = new Empresa.Relatorio();
rel.gerar();
// Razão Social: Empresa XYZ Ltda
// Total de Funcionários: 0
```

### 2. Acesso a Métodos Static

**Métodos static**: chamados diretamente.

```java
public class Matematica {
    private static final double PI = 3.14159;
    
    private static double calcularAreaCirculo(double raio) {
        return PI * raio * raio;
    }
    
    public static class Calculadora {
        public void calcular(double raio) {
            // ✅ Chama método static privado
            double area = calcularAreaCirculo(raio);
            System.out.println("Área: " + area);
        }
    }
}

// Uso
Matematica.Calculadora calc = new Matematica.Calculadora();
calc.calcular(5); // Área: 78.53975
```

### 3. Modificar Atributos Static

**Modificação**: nested class pode alterar atributos static.

```java
public class Contador {
    private static int valor = 0;
    
    public static class Operacoes {
        public void incrementar() {
            valor++; // Modifica atributo static
        }
        
        public void decrementar() {
            valor--;
        }
        
        public void zerar() {
            valor = 0;
        }
        
        public int obterValor() {
            return valor;
        }
    }
}

// Uso
Contador.Operacoes op = new Contador.Operacoes();
op.incrementar();
op.incrementar();
System.out.println(op.obterValor()); // 2
op.decrementar();
System.out.println(op.obterValor()); // 1
```

### 4. Acesso a Constantes Static

**Constantes**: `static final` acessíveis.

```java
public class Sistema {
    private static final String VERSAO = "1.0.0";
    private static final int MAX_CONEXOES = 100;
    private static final boolean DEBUG = true;
    
    public static class Informacoes {
        public void exibir() {
            System.out.println("Versão: " + VERSAO);
            System.out.println("Max Conexões: " + MAX_CONEXOES);
            System.out.println("Debug: " + (DEBUG ? "Ativo" : "Inativo"));
        }
    }
}

// Uso
Sistema.Informacoes info = new Sistema.Informacoes();
info.exibir();
```

### 5. Acesso Private Static

**Private static**: nested class acessa membros privados.

```java
public class BancoDeDados {
    private static String connectionString = "jdbc:mysql://localhost:3306";
    private static String usuario = "admin";
    private static String senha = "senha123";
    
    public static class Conexao {
        public void conectar() {
            // ✅ Acessa atributos private static
            System.out.println("Conectando...");
            System.out.println("URL: " + connectionString);
            System.out.println("Usuário: " + usuario);
            // senha não é exibida por segurança
        }
    }
}
```

### 6. Compartilhamento de Estado Static

**Estado compartilhado**: múltiplas instâncias compartilham estado static.

```java
public class Cache {
    private static Map<String, Object> dados = new HashMap<>();
    
    public static class Gerenciador {
        public void adicionar(String chave, Object valor) {
            dados.put(chave, valor);
        }
        
        public Object obter(String chave) {
            return dados.get(chave);
        }
        
        public int tamanho() {
            return dados.size();
        }
    }
}

// Uso
Cache.Gerenciador g1 = new Cache.Gerenciador();
Cache.Gerenciador g2 = new Cache.Gerenciador();

g1.adicionar("user", "João");
g2.adicionar("token", "abc123");

System.out.println(g1.tamanho()); // 2 (compartilhado)
System.out.println(g2.obter("user")); // João (mesmo Map)
```

### 7. Acesso a Static Blocks

**Static block**: executado antes de nested class.

```java
public class Configuracao {
    private static String ambiente;
    
    static {
        // Executado primeiro
        ambiente = System.getProperty("ambiente", "DEV");
        System.out.println("Ambiente carregado: " + ambiente);
    }
    
    public static class Carregador {
        public void exibir() {
            System.out.println("Ambiente atual: " + ambiente);
        }
    }
}

// Uso
Configuracao.Carregador loader = new Configuracao.Carregador();
// Output:
// Ambiente carregado: DEV
loader.exibir(); // Ambiente atual: DEV
```

### 8. Acesso a Enums Static

**Enums static**: acessíveis pela nested class.

```java
public class Pedido {
    public static enum Status {
        PENDENTE, APROVADO, ENVIADO, ENTREGUE, CANCELADO
    }
    
    private static Status statusPadrao = Status.PENDENTE;
    
    public static class Processador {
        public void processar() {
            System.out.println("Status padrão: " + statusPadrao);
            
            // Acessa enum
            for (Status status : Status.values()) {
                System.out.println("- " + status);
            }
        }
    }
}
```

### 9. Acesso a Classes Static Aninhadas

**Nested dentro de nested**: acesso a membros static.

```java
public class Sistema {
    private static String versao = "1.0";
    
    public static class Modulo {
        private static int numeroModulos = 0;
        
        public static class Componente {
            public void info() {
                // Acessa static de Sistema
                System.out.println("Versão Sistema: " + versao);
                
                // Acessa static de Modulo
                System.out.println("Número Módulos: " + numeroModulos);
            }
        }
    }
}

// Uso
Sistema.Modulo.Componente comp = new Sistema.Modulo.Componente();
comp.info();
```

### 10. Não Acessa Membros de Instância

**Restrição**: não acessa membros não-static.

```java
public class Empresa {
    private String nome; // Instância
    private static String cnpj; // Static
    
    public static class Validador {
        public void validar() {
            // ✅ OK: acessa static
            if (cnpj != null && cnpj.length() == 14) {
                System.out.println("CNPJ válido");
            }
            
            // ❌ ERRO: não acessa instância
            // if (nome != null) { }
        }
    }
}
```

---

## Aplicabilidade

**Acesso a static útil para**:
- Configurações globais
- Constantes compartilhadas
- Contadores/Estatísticas
- Cache compartilhado
- Factory methods
- Utility methods

---

## Armadilhas

### 1. Tentar Acessar Instância

```java
public class Usuario {
    private String nome; // Instância
    private static int totalUsuarios; // Static
    
    public static class Contador {
        public void contar() {
            totalUsuarios++; // ✅ OK
            
            // ❌ ERRO: não pode acessar 'nome'
            // System.out.println(nome);
        }
    }
}
```

### 2. Confundir Static com Final

```java
public class Config {
    private final String valor = "final"; // Instância (final ≠ static)
    private static final String VERSAO = "1.0"; // Static
    
    public static class Leitor {
        public void ler() {
            System.out.println(VERSAO); // ✅ OK (static final)
            
            // ❌ ERRO: 'valor' não é static
            // System.out.println(valor);
        }
    }
}
```

### 3. Modificação Concorrente

```java
public class Contador {
    private static int valor = 0; // Não thread-safe
    
    public static class Incrementador {
        public void incrementar() {
            valor++; // ⚠️ Problema em multi-thread
        }
    }
}

// ✅ Thread-safe
public class ContadorSeguro {
    private static AtomicInteger valor = new AtomicInteger(0);
    
    public static class Incrementador {
        public void incrementar() {
            valor.incrementAndGet();
        }
    }
}
```

### 4. Estado Compartilhado Inesperado

```java
public class Cache {
    private static List<String> dados = new ArrayList<>();
    
    public static class Gerenciador {
        public void adicionar(String item) {
            dados.add(item);
        }
    }
}

// ⚠️ Todas as instâncias compartilham 'dados'
Cache.Gerenciador g1 = new Cache.Gerenciador();
Cache.Gerenciador g2 = new Cache.Gerenciador();

g1.adicionar("A");
g2.adicionar("B");

// dados = ["A", "B"] (compartilhado)
```

### 5. Null em Static

```java
public class Sistema {
    private static String config; // null por padrão
    
    public static class Inicializador {
        public void usar() {
            // ⚠️ NullPointerException
            // System.out.println(config.toUpperCase());
            
            // ✅ Verificar null
            if (config != null) {
                System.out.println(config.toUpperCase());
            }
        }
    }
}
```

---

## Boas Práticas

### 1. Encapsular Acesso Static

```java
// ✅ Encapsular acesso a membros static
public class Configuracao {
    private static String ambiente = "DEV";
    
    public static class Manager {
        public String getAmbiente() {
            return ambiente;
        }
        
        public void setAmbiente(String amb) {
            if (amb != null && !amb.isEmpty()) {
                ambiente = amb;
            }
        }
    }
}
```

### 2. Thread-Safety quando Necessário

```java
// ✅ Thread-safe para estado compartilhado
public class Estatisticas {
    private static final AtomicInteger totalAcessos = new AtomicInteger(0);
    
    public static class Contador {
        public void registrar() {
            totalAcessos.incrementAndGet();
        }
        
        public int obterTotal() {
            return totalAcessos.get();
        }
    }
}
```

### 3. Constantes Bem Definidas

```java
// ✅ Constantes static final
public class Sistema {
    private static final String VERSAO = "1.0.0";
    private static final int MAX_TENTATIVAS = 3;
    private static final long TIMEOUT_MS = 5000L;
    
    public static class Configuracoes {
        public void exibir() {
            System.out.println("Versão: " + VERSAO);
            System.out.println("Max Tentativas: " + MAX_TENTATIVAS);
            System.out.println("Timeout: " + TIMEOUT_MS + "ms");
        }
    }
}
```

### 4. Inicialização Static

```java
// ✅ Inicialização em static block
public class BancoDeDados {
    private static Properties propriedades;
    
    static {
        propriedades = new Properties();
        try {
            propriedades.load(new FileInputStream("db.properties"));
        } catch (IOException e) {
            // Configuração padrão
            propriedades.setProperty("host", "localhost");
            propriedades.setProperty("port", "3306");
        }
    }
    
    public static class Conexao {
        public void conectar() {
            String host = propriedades.getProperty("host");
            String port = propriedades.getProperty("port");
            System.out.println("Conectando a " + host + ":" + port);
        }
    }
}
```

### 5. Factory com Static

```java
// ✅ Factory usando membros static
public class Usuario {
    private static int proximoId = 1;
    
    private int id;
    private String nome;
    
    private Usuario(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    
    public static class Factory {
        public static Usuario criar(String nome) {
            int id = proximoId++;
            return new Usuario(id, nome);
        }
    }
}

// Uso
Usuario u1 = Usuario.Factory.criar("João"); // id = 1
Usuario u2 = Usuario.Factory.criar("Maria"); // id = 2
```

### 6. Singleton via Nested

```java
// ✅ Singleton usando nested class
public class ConfigManager {
    private static Properties config = new Properties();
    
    private ConfigManager() { }
    
    public static class Holder {
        private static final ConfigManager INSTANCE = new ConfigManager();
    }
    
    public static ConfigManager getInstance() {
        return Holder.INSTANCE;
    }
    
    public String getProperty(String key) {
        return config.getProperty(key);
    }
}
```

### 7. Registro Global

```java
// ✅ Registro global via static
public class EventoManager {
    private static final List<String> eventos = new ArrayList<>();
    
    public static class Registrador {
        public void registrar(String evento) {
            eventos.add(evento);
            System.out.println("Evento registrado: " + evento);
        }
        
        public List<String> listar() {
            return new ArrayList<>(eventos); // Cópia defensiva
        }
    }
}
```

### 8. Validação de Static

```java
// ✅ Validar valores static
public class Limite {
    private static int maximo = 100;
    
    public static class Configurador {
        public void setMaximo(int valor) {
            if (valor <= 0) {
                throw new IllegalArgumentException(
                    "Máximo deve ser positivo"
                );
            }
            maximo = valor;
        }
        
        public int getMaximo() {
            return maximo;
        }
    }
}
```

### 9. Documentar Compartilhamento

```java
/**
 * Gerenciador de cache global.
 * 
 * <p>ATENÇÃO: O estado do cache é compartilhado entre
 * todas as instâncias de Gerenciador.
 */
public class Cache {
    private static final Map<String, Object> dados = new ConcurrentHashMap<>();
    
    public static class Gerenciador {
        public void adicionar(String chave, Object valor) {
            dados.put(chave, valor);
        }
    }
}
```

### 10. Cleanup de Static

```java
// ✅ Método para limpar estado static
public class Sessao {
    private static final Map<String, Usuario> sessoes = new HashMap<>();
    
    public static class Manager {
        public void adicionar(String id, Usuario usuario) {
            sessoes.put(id, usuario);
        }
        
        public void remover(String id) {
            sessoes.remove(id);
        }
        
        public void limparTudo() {
            sessoes.clear();
        }
    }
}
```

---

## Resumo

**Static nested class**: acessa apenas membros `static` da classe externa.

```java
public class Externa {
    private static String valorStatic = "Static";
    private String valorInstancia = "Instância";
    
    public static class Nested {
        public void metodo() {
            System.out.println(valorStatic); // ✅ OK
            // System.out.println(valorInstancia); // ❌ ERRO
        }
    }
}
```

**Acesso permitido**:
- Atributos static (private, public, etc.)
- Métodos static
- Constantes static final
- Enums static
- Outras nested classes static

**Acesso NÃO permitido**:
- Atributos de instância
- Métodos de instância
- `this` da classe externa

**Modificação**:
- Nested class pode modificar atributos static
- Estado compartilhado entre instâncias
- Thread-safety importante

**Aplicabilidade**:
- Configurações globais
- Constantes compartilhadas
- Contadores/Estatísticas
- Cache compartilhado
- Factory methods

**Boas práticas**:
- Encapsular acesso static
- Thread-safety quando necessário
- Constantes bem definidas
- Inicialização static block
- Factory com static
- Singleton via nested
- Registro global
- Validação de valores
- Documentar compartilhamento
- Cleanup de estado

**Armadilhas**:
- ❌ Tentar acessar membros de instância
- ❌ Confundir static com final
- ❌ Modificação concorrente sem sincronização
- ❌ Estado compartilhado inesperado
- ❌ Null em atributos static

**Regra de Ouro**: **Static nested classes** acessam apenas membros **static** da classe externa porque **não têm referência** à instância externa. Use para encapsular lógica relacionada a **estado global** ou **constantes**. Lembre-se que **estado static é compartilhado** entre todas as instâncias. Para **multi-threading**, use estruturas **thread-safe** (AtomicInteger, ConcurrentHashMap). Sempre **documente** quando há compartilhamento de estado.
