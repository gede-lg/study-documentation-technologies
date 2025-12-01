# T2.03 - Instanciação Independente

## Introdução

**Instanciação independente**: nested class não precisa de instância da classe externa.

```java
public class Externa {
    public static class Nested {
        public void metodo() {
            System.out.println("Nested independente");
        }
    }
}

// ✅ Instanciação direta (sem instância de Externa)
Externa.Nested obj = new Externa.Nested();
obj.metodo();
```

**Diferença de inner class**: inner class precisa de instância externa.

---

## Fundamentos

### 1. Sintaxe de Instanciação

**Sintaxe**: `Externa.Nested obj = new Externa.Nested()`.

```java
public class Empresa {
    public static class Departamento {
        private String nome;
        
        public Departamento(String nome) {
            this.nome = nome;
        }
        
        public void exibir() {
            System.out.println("Departamento: " + nome);
        }
    }
}

// Instanciação direta
Empresa.Departamento rh = new Empresa.Departamento("RH");
Empresa.Departamento ti = new Empresa.Departamento("TI");

rh.exibir(); // Departamento: RH
ti.exibir(); // Departamento: TI
```

### 2. Sem Instância Externa

**Independente**: não precisa criar instância de `Externa`.

```java
public class Sistema {
    private String nome = "Sistema XYZ";
    
    public static class Configuracao {
        private String valor;
        
        public Configuracao(String valor) {
            this.valor = valor;
        }
        
        public String getValor() {
            return valor;
        }
    }
}

// ✅ NÃO precisa de instância de Sistema
Sistema.Configuracao config = new Sistema.Configuracao("DEV");
System.out.println(config.getValor()); // DEV

// Não é necessário:
// Sistema sistema = new Sistema();
// Sistema.Configuracao config = sistema.new Configuracao("DEV");
```

### 3. Comparação com Inner Class

**Diferença**: inner class precisa de instância externa.

```java
public class Exemplo {
    
    // Static nested class (independente)
    public static class Nested {
        public void metodo() {
            System.out.println("Nested");
        }
    }
    
    // Inner class (depende de instância)
    public class Inner {
        public void metodo() {
            System.out.println("Inner");
        }
    }
}

// Static nested: instanciação direta
Exemplo.Nested nested = new Exemplo.Nested();
nested.metodo();

// Inner class: precisa de instância de Exemplo
Exemplo exemplo = new Exemplo();
Exemplo.Inner inner = exemplo.new Inner();
inner.metodo();
```

### 4. Múltiplas Instâncias

**Múltiplas instâncias**: cada uma independente.

```java
public class Banco {
    public static class Conta {
        private String numero;
        private double saldo;
        
        public Conta(String numero, double saldo) {
            this.numero = numero;
            this.saldo = saldo;
        }
        
        public void exibir() {
            System.out.println("Conta: " + numero + " - Saldo: " + saldo);
        }
    }
}

// Múltiplas instâncias independentes
Banco.Conta c1 = new Banco.Conta("001", 1000);
Banco.Conta c2 = new Banco.Conta("002", 2000);
Banco.Conta c3 = new Banco.Conta("003", 3000);

c1.exibir(); // Conta: 001 - Saldo: 1000.0
c2.exibir(); // Conta: 002 - Saldo: 2000.0
c3.exibir(); // Conta: 003 - Saldo: 3000.0
```

### 5. Instanciação com Construtor Parametrizado

**Construtores**: podem ter parâmetros como classe normal.

```java
public class API {
    public static class Request {
        private String metodo;
        private String url;
        private Map<String, String> headers;
        
        public Request(String metodo, String url) {
            this.metodo = metodo;
            this.url = url;
            this.headers = new HashMap<>();
        }
        
        public void addHeader(String chave, String valor) {
            headers.put(chave, valor);
        }
        
        public void enviar() {
            System.out.println(metodo + " " + url);
            headers.forEach((k, v) -> 
                System.out.println(k + ": " + v)
            );
        }
    }
}

// Instanciação com parâmetros
API.Request req = new API.Request("POST", "/api/usuarios");
req.addHeader("Content-Type", "application/json");
req.enviar();
```

### 6. Instanciação em Coleções

**Coleções**: nested classes em listas, sets, maps.

```java
public class Loja {
    public static class Produto {
        private String nome;
        private double preco;
        
        public Produto(String nome, double preco) {
            this.nome = nome;
            this.preco = preco;
        }
        
        public String getNome() { return nome; }
        public double getPreco() { return preco; }
    }
}

// Lista de produtos
List<Loja.Produto> produtos = new ArrayList<>();
produtos.add(new Loja.Produto("Notebook", 3000));
produtos.add(new Loja.Produto("Mouse", 50));
produtos.add(new Loja.Produto("Teclado", 150));

// Processar
for (Loja.Produto p : produtos) {
    System.out.println(p.getNome() + " - R$ " + p.getPreco());
}
```

### 7. Instanciação via Factory

**Factory method**: criar instâncias de nested class.

```java
public class Usuario {
    public static class Token {
        private String valor;
        private long expiracao;
        
        private Token(String valor, long expiracao) {
            this.valor = valor;
            this.expiracao = expiracao;
        }
        
        // Factory method
        public static Token criar(String usuario) {
            String valor = gerarToken(usuario);
            long expiracao = System.currentTimeMillis() + 3600000; // 1 hora
            return new Token(valor, expiracao);
        }
        
        private static String gerarToken(String usuario) {
            return usuario + "_" + System.currentTimeMillis();
        }
        
        public String getValor() { return valor; }
        public boolean isValido() {
            return System.currentTimeMillis() < expiracao;
        }
    }
}

// Uso via factory
Usuario.Token token = Usuario.Token.criar("joao");
System.out.println("Token: " + token.getValor());
System.out.println("Válido: " + token.isValido());
```

### 8. Builder Pattern

**Builder**: nested class para construção fluente.

```java
public class Pedido {
    private String numero;
    private String cliente;
    private List<String> itens;
    private double total;
    
    private Pedido(Builder builder) {
        this.numero = builder.numero;
        this.cliente = builder.cliente;
        this.itens = builder.itens;
        this.total = builder.total;
    }
    
    public static class Builder {
        private String numero;
        private String cliente;
        private List<String> itens = new ArrayList<>();
        private double total;
        
        public Builder numero(String numero) {
            this.numero = numero;
            return this;
        }
        
        public Builder cliente(String cliente) {
            this.cliente = cliente;
            return this;
        }
        
        public Builder addItem(String item, double preco) {
            itens.add(item);
            total += preco;
            return this;
        }
        
        public Pedido build() {
            return new Pedido(this);
        }
    }
    
    public void exibir() {
        System.out.println("Pedido: " + numero);
        System.out.println("Cliente: " + cliente);
        System.out.println("Itens: " + itens);
        System.out.println("Total: " + total);
    }
}

// Uso do Builder
Pedido pedido = new Pedido.Builder()
    .numero("001")
    .cliente("João")
    .addItem("Notebook", 3000)
    .addItem("Mouse", 50)
    .build();

pedido.exibir();
```

### 9. Instanciação em Métodos

**Retorno**: métodos podem retornar nested class.

```java
public class RelatorioService {
    
    public static class Relatorio {
        private String titulo;
        private String conteudo;
        private LocalDateTime dataGeracao;
        
        public Relatorio(String titulo, String conteudo) {
            this.titulo = titulo;
            this.conteudo = conteudo;
            this.dataGeracao = LocalDateTime.now();
        }
        
        public void exibir() {
            System.out.println("=== " + titulo + " ===");
            System.out.println(conteudo);
            System.out.println("Gerado em: " + dataGeracao);
        }
    }
    
    public Relatorio gerarRelatorio(String tipo) {
        String titulo = "Relatório de " + tipo;
        String conteudo = "Dados do relatório...";
        return new Relatorio(titulo, conteudo);
    }
}

// Uso
RelatorioService service = new RelatorioService();
RelatorioService.Relatorio rel = service.gerarRelatorio("Vendas");
rel.exibir();
```

### 10. Instanciação com Genéricos

**Genéricos**: nested class pode ser genérica.

```java
public class Resultado {
    
    public static class Resposta<T> {
        private T dado;
        private int codigo;
        private String mensagem;
        
        public Resposta(T dado, int codigo, String mensagem) {
            this.dado = dado;
            this.codigo = codigo;
            this.mensagem = mensagem;
        }
        
        public T getDado() { return dado; }
        public int getCodigo() { return codigo; }
        public String getMensagem() { return mensagem; }
    }
}

// Instanciação com diferentes tipos
Resultado.Resposta<String> resp1 = 
    new Resultado.Resposta<>("João", 200, "OK");

Resultado.Resposta<Integer> resp2 = 
    new Resultado.Resposta<>(42, 200, "OK");

Resultado.Resposta<List<String>> resp3 = 
    new Resultado.Resposta<>(
        Arrays.asList("A", "B", "C"), 
        200, 
        "OK"
    );

System.out.println(resp1.getDado()); // João
System.out.println(resp2.getDado()); // 42
System.out.println(resp3.getDado()); // [A, B, C]
```

---

## Aplicabilidade

**Instanciação independente útil para**:
- DTOs e value objects
- Builder pattern
- Factory methods
- Result/Response wrappers
- Helper classes
- Configurações

---

## Armadilhas

### 1. Confundir com Inner Class

```java
public class Exemplo {
    // Static nested (independente)
    public static class Nested { }
    
    // Inner class (depende de instância)
    public class Inner { }
}

// ✅ Nested: instanciação direta
Exemplo.Nested nested = new Exemplo.Nested();

// ❌ ERRO: Inner precisa de instância
// Exemplo.Inner inner = new Exemplo.Inner();

// ✅ Inner: instanciação via externa
Exemplo ex = new Exemplo();
Exemplo.Inner inner = ex.new Inner();
```

### 2. Esquecer Nome Qualificado

```java
public class Sistema {
    public static class Config { }
}

// ❌ ERRO: nome não qualificado
// Config config = new Config();

// ✅ Nome qualificado
Sistema.Config config = new Sistema.Config();

// ✅ Ou com import
import com.exemplo.Sistema.Config;
// ...
Config config = new Config();
```

### 3. Tentar Acessar Instância Externa

```java
public class Externa {
    private String valor = "Externa";
    
    public static class Nested {
        public void metodo() {
            // ❌ ERRO: não há instância de Externa
            // System.out.println(valor);
            // System.out.println(Externa.this.valor);
        }
    }
}
```

### 4. Private Inacessível

```java
public class Sistema {
    private static class ConfigInterna { }
    
    public ConfigInterna getConfig() {
        return new ConfigInterna();
    }
}

// ❌ ERRO: ConfigInterna é private
// Sistema.ConfigInterna config = new Sistema.ConfigInterna();

// ✅ Retorno tipado como Object ou interface
public class Sistema {
    private static class ConfigInterna { }
    
    public Object getConfig() {
        return new ConfigInterna();
    }
}
```

### 5. Construtor Privado

```java
public class Usuario {
    public static class Token {
        private Token() { } // Construtor privado
    }
}

// ❌ ERRO: construtor privado
// Usuario.Token token = new Usuario.Token();

// ✅ Factory method
public class Usuario {
    public static class Token {
        private Token() { }
        
        public static Token criar() {
            return new Token();
        }
    }
}

Usuario.Token token = Usuario.Token.criar();
```

---

## Boas Práticas

### 1. Import para Simplificar

```java
// Arquivo: Sistema.java
package com.exemplo;

public class Sistema {
    public static class Configuracao {
        private String valor;
        
        public Configuracao(String valor) {
            this.valor = valor;
        }
    }
}

// Arquivo: App.java
package com.exemplo.app;

import com.exemplo.Sistema.Configuracao;

public class App {
    public static void main(String[] args) {
        // Uso simplificado
        Configuracao config = new Configuracao("DEV");
    }
}
```

### 2. Factory Methods

```java
// ✅ Factory methods para instanciação controlada
public class Pedido {
    public static class Status {
        private String nome;
        
        private Status(String nome) {
            this.nome = nome;
        }
        
        public static Status pendente() {
            return new Status("PENDENTE");
        }
        
        public static Status aprovado() {
            return new Status("APROVADO");
        }
        
        public static Status cancelado() {
            return new Status("CANCELADO");
        }
    }
}

// Uso
Pedido.Status status = Pedido.Status.aprovado();
```

### 3. Validação no Construtor

```java
// ✅ Validar parâmetros no construtor
public class API {
    public static class Request {
        private String url;
        
        public Request(String url) {
            if (url == null || url.isEmpty()) {
                throw new IllegalArgumentException("URL não pode ser vazia");
            }
            this.url = url;
        }
    }
}
```

### 4. Imutabilidade

```java
// ✅ Nested class imutável
public class Dados {
    public static class Coordenada {
        private final double latitude;
        private final double longitude;
        
        public Coordenada(double latitude, double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }
        
        public double getLatitude() { return latitude; }
        public double getLongitude() { return longitude; }
        
        // Sem setters
    }
}

// Instâncias imutáveis
Dados.Coordenada coord = new Dados.Coordenada(-23.5505, -46.6333);
```

### 5. Builder para Muitos Parâmetros

```java
// ✅ Builder quando há muitos parâmetros
public class Usuario {
    private String nome;
    private String email;
    private int idade;
    private String telefone;
    private String endereco;
    
    private Usuario(Builder builder) {
        this.nome = builder.nome;
        this.email = builder.email;
        this.idade = builder.idade;
        this.telefone = builder.telefone;
        this.endereco = builder.endereco;
    }
    
    public static class Builder {
        private String nome;
        private String email;
        private int idade;
        private String telefone;
        private String endereco;
        
        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        // ... outros setters
        
        public Usuario build() {
            return new Usuario(this);
        }
    }
}
```

### 6. Equals e HashCode

```java
// ✅ Implementar equals/hashCode quando necessário
public class Dados {
    public static class Ponto {
        private final int x;
        private final int y;
        
        public Ponto(int x, int y) {
            this.x = x;
            this.y = y;
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (!(obj instanceof Ponto)) return false;
            Ponto outro = (Ponto) obj;
            return x == outro.x && y == outro.y;
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }
    }
}
```

### 7. ToString Descritivo

```java
// ✅ toString para debugging
public class Loja {
    public static class Produto {
        private String nome;
        private double preco;
        
        public Produto(String nome, double preco) {
            this.nome = nome;
            this.preco = preco;
        }
        
        @Override
        public String toString() {
            return "Produto{nome='" + nome + "', preco=" + preco + "}";
        }
    }
}

Loja.Produto p = new Loja.Produto("Mouse", 50);
System.out.println(p); // Produto{nome='Mouse', preco=50.0}
```

### 8. Documentar Uso

```java
/**
 * Configuração do sistema.
 * 
 * <p>Exemplo de uso:
 * <pre>
 * Sistema.Config config = new Sistema.Config("localhost", 8080);
 * config.conectar();
 * </pre>
 */
public class Sistema {
    public static class Config {
        private String host;
        private int porta;
        
        public Config(String host, int porta) {
            this.host = host;
            this.porta = porta;
        }
    }
}
```

### 9. Encadeamento Fluente

```java
// ✅ API fluente
public class QueryBuilder {
    public static class Query {
        private String tabela;
        private List<String> campos = new ArrayList<>();
        private String condicao;
        
        public Query from(String tabela) {
            this.tabela = tabela;
            return this;
        }
        
        public Query select(String... campos) {
            this.campos.addAll(Arrays.asList(campos));
            return this;
        }
        
        public Query where(String condicao) {
            this.condicao = condicao;
            return this;
        }
        
        public String build() {
            return "SELECT " + String.join(", ", campos) +
                   " FROM " + tabela +
                   " WHERE " + condicao;
        }
    }
}

// Uso fluente
String sql = new QueryBuilder.Query()
    .select("nome", "email")
    .from("usuarios")
    .where("idade > 18")
    .build();
```

### 10. Construtores Múltiplos

```java
// ✅ Sobrecarga de construtores
public class API {
    public static class Request {
        private String url;
        private String metodo;
        private Map<String, String> headers;
        
        public Request(String url) {
            this(url, "GET");
        }
        
        public Request(String url, String metodo) {
            this(url, metodo, new HashMap<>());
        }
        
        public Request(String url, String metodo, Map<String, String> headers) {
            this.url = url;
            this.metodo = metodo;
            this.headers = headers;
        }
    }
}

// Uso
API.Request r1 = new API.Request("/api/users");
API.Request r2 = new API.Request("/api/users", "POST");
```

---

## Resumo

**Instanciação independente**: nested class não precisa de instância externa.

```java
public class Externa {
    public static class Nested {
        public void metodo() { }
    }
}

// ✅ Instanciação direta
Externa.Nested obj = new Externa.Nested();
```

**Sintaxe**: `Externa.Nested obj = new Externa.Nested()`.

**Diferença de inner class**:
- Static nested: independente
- Inner class: precisa de instância externa

**Características**:
- Múltiplas instâncias independentes
- Construtores parametrizados
- Uso em coleções
- Factory methods
- Builder pattern
- Genéricos

**Aplicabilidade**:
- DTOs/Value objects
- Builders
- Factories
- Wrappers
- Helpers

**Boas práticas**:
- Import para simplificar
- Factory methods
- Validação no construtor
- Imutabilidade
- Builder para muitos parâmetros
- Equals/hashCode
- ToString descritivo
- Documentar uso
- Encadeamento fluente
- Construtores múltiplos

**Armadilhas**:
- ❌ Confundir com inner class
- ❌ Esquecer nome qualificado
- ❌ Tentar acessar instância externa
- ❌ Private inacessível
- ❌ Construtor privado sem factory

**Regra de Ouro**: **Static nested classes** têm **instanciação independente** (não precisam de instância da classe externa). Use `Externa.Nested obj = new Externa.Nested()`. Ideal para **DTOs**, **builders**, **factories** e **wrappers**. Sempre considere **imutabilidade**, **validação** no construtor e **factory methods** para instanciação controlada.
