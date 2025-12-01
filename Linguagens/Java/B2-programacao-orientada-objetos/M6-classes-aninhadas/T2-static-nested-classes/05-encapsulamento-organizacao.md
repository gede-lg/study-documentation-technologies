# T2.05 - Encapsulamento e Organização

## Introdução

**Encapsulamento**: agrupar classes relacionadas logicamente.

```java
public class BancoDeDados {
    
    // Nested: Conexão relacionada a BancoDeDados
    public static class Conexao {
        private String url;
        private String usuario;
        
        public Conexao(String url, String usuario) {
            this.url = url;
            this.usuario = usuario;
        }
    }
    
    // Nested: Query relacionada a BancoDeDados
    public static class Query {
        private String sql;
        
        public Query(String sql) {
            this.sql = sql;
        }
    }
}

// Organização clara: Conexao e Query pertencem a BancoDeDados
BancoDeDados.Conexao conn = new BancoDeDados.Conexao("jdbc:...", "admin");
BancoDeDados.Query query = new BancoDeDados.Query("SELECT * FROM users");
```

**Organização**: namespace lógico para classes auxiliares.

---

## Fundamentos

### 1. Agrupamento Lógico

**Relacionamento**: classes relacionadas juntas.

```java
public class HTTP {
    
    // Request relacionado a HTTP
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
    }
    
    // Response relacionado a HTTP
    public static class Response {
        private int statusCode;
        private String body;
        
        public Response(int statusCode, String body) {
            this.statusCode = statusCode;
            this.body = body;
        }
        
        public int getStatusCode() { return statusCode; }
        public String getBody() { return body; }
    }
}

// Uso: claro que Request/Response são de HTTP
HTTP.Request req = new HTTP.Request("GET", "/api/users");
HTTP.Response res = new HTTP.Response(200, "{...}");
```

### 2. Namespace Hierárquico

**Hierarquia**: organização em níveis.

```java
public class Sistema {
    
    public static class Usuario {
        private String nome;
        
        public static class Permissoes {
            private List<String> permissoes;
            
            public Permissoes() {
                this.permissoes = new ArrayList<>();
            }
            
            public void adicionar(String permissao) {
                permissoes.add(permissao);
            }
        }
        
        public static class Perfil {
            private String tipo;
            private int nivel;
            
            public Perfil(String tipo, int nivel) {
                this.tipo = tipo;
                this.nivel = nivel;
            }
        }
    }
}

// Hierarquia clara: Sistema → Usuario → Permissoes/Perfil
Sistema.Usuario.Permissoes perms = new Sistema.Usuario.Permissoes();
Sistema.Usuario.Perfil perfil = new Sistema.Usuario.Perfil("Admin", 5);
```

### 3. Encapsulamento de Implementação

**Private nested**: ocultar implementação.

```java
public class Cache {
    private static Armazenamento storage = new Armazenamento();
    
    // Private nested: implementação oculta
    private static class Armazenamento {
        private Map<String, Object> dados = new HashMap<>();
        
        public void adicionar(String chave, Object valor) {
            dados.put(chave, valor);
        }
        
        public Object obter(String chave) {
            return dados.get(chave);
        }
        
        public void limpar() {
            dados.clear();
        }
    }
    
    // API pública
    public static void put(String chave, Object valor) {
        storage.adicionar(chave, valor);
    }
    
    public static Object get(String chave) {
        return storage.obter(chave);
    }
    
    public static void clear() {
        storage.limpar();
    }
}

// Uso: apenas API pública visível
Cache.put("user", "João");
Object user = Cache.get("user");
```

### 4. DTOs Agrupados

**DTOs**: Data Transfer Objects relacionados.

```java
public class API {
    
    // Request DTOs
    public static class CriarUsuarioRequest {
        private String nome;
        private String email;
        
        // Getters/Setters
    }
    
    public static class AtualizarUsuarioRequest {
        private String nome;
        private String telefone;
        
        // Getters/Setters
    }
    
    // Response DTOs
    public static class UsuarioResponse {
        private String id;
        private String nome;
        private String email;
        
        // Getters/Setters
    }
    
    public static class ErroResponse {
        private int codigo;
        private String mensagem;
        
        // Getters/Setters
    }
}

// Uso: DTOs organizados por API
API.CriarUsuarioRequest req = new API.CriarUsuarioRequest();
API.UsuarioResponse res = new API.UsuarioResponse();
```

### 5. Configurações Relacionadas

**Config**: configurações agrupadas.

```java
public class Aplicacao {
    
    public static class BancoDadosConfig {
        private String url;
        private String usuario;
        private String senha;
        private int maxConexoes;
        
        public BancoDadosConfig(String url, String usuario, String senha) {
            this.url = url;
            this.usuario = usuario;
            this.senha = senha;
            this.maxConexoes = 10;
        }
        
        // Getters/Setters
    }
    
    public static class EmailConfig {
        private String host;
        private int porta;
        private String remetente;
        
        public EmailConfig(String host, int porta, String remetente) {
            this.host = host;
            this.porta = porta;
            this.remetente = remetente;
        }
        
        // Getters/Setters
    }
}

// Uso: configurações organizadas
Aplicacao.BancoDadosConfig dbConfig = 
    new Aplicacao.BancoDadosConfig("jdbc:...", "admin", "senha");

Aplicacao.EmailConfig emailConfig = 
    new Aplicacao.EmailConfig("smtp.gmail.com", 587, "app@email.com");
```

### 6. Enums e Constants Agrupados

**Enums/Constants**: valores relacionados.

```java
public class Pedido {
    private String status;
    
    // Enum nested
    public static enum Status {
        PENDENTE, APROVADO, ENVIADO, ENTREGUE, CANCELADO
    }
    
    // Constants nested
    public static class Constantes {
        public static final int MAX_ITENS = 100;
        public static final double DESCONTO_MAXIMO = 0.5;
        public static final int DIAS_ENTREGA = 7;
    }
    
    public Pedido(Status status) {
        this.status = status.name();
    }
}

// Uso: organizado
Pedido pedido = new Pedido(Pedido.Status.PENDENTE);
int maxItens = Pedido.Constantes.MAX_ITENS;
```

### 7. Exceptions Personalizadas

**Exceptions**: exceções relacionadas.

```java
public class UsuarioService {
    
    public static class UsuarioException extends Exception {
        public UsuarioException(String mensagem) {
            super(mensagem);
        }
    }
    
    public static class UsuarioNaoEncontradoException extends UsuarioException {
        public UsuarioNaoEncontradoException(String id) {
            super("Usuário não encontrado: " + id);
        }
    }
    
    public static class EmailDuplicadoException extends UsuarioException {
        public EmailDuplicadoException(String email) {
            super("Email já cadastrado: " + email);
        }
    }
    
    public void criar(String email) throws EmailDuplicadoException {
        // Verificar se email existe
        throw new EmailDuplicadoException(email);
    }
}

// Uso: exceções organizadas
try {
    service.criar("email@exemplo.com");
} catch (UsuarioService.EmailDuplicadoException e) {
    System.err.println(e.getMessage());
}
```

### 8. Builders Complexos

**Builder**: construção de objetos complexos.

```java
public class Relatorio {
    private String titulo;
    private List<String> secoes;
    private Map<String, Object> dados;
    private String formato;
    
    private Relatorio(Builder builder) {
        this.titulo = builder.titulo;
        this.secoes = builder.secoes;
        this.dados = builder.dados;
        this.formato = builder.formato;
    }
    
    public static class Builder {
        private String titulo;
        private List<String> secoes = new ArrayList<>();
        private Map<String, Object> dados = new HashMap<>();
        private String formato = "PDF";
        
        public Builder titulo(String titulo) {
            this.titulo = titulo;
            return this;
        }
        
        public Builder addSecao(String secao) {
            this.secoes.add(secao);
            return this;
        }
        
        public Builder addDado(String chave, Object valor) {
            this.dados.put(chave, valor);
            return this;
        }
        
        public Builder formato(String formato) {
            this.formato = formato;
            return this;
        }
        
        public Relatorio build() {
            if (titulo == null) {
                throw new IllegalStateException("Título obrigatório");
            }
            return new Relatorio(this);
        }
    }
}

// Uso: construção organizada
Relatorio relatorio = new Relatorio.Builder()
    .titulo("Vendas Mensais")
    .addSecao("Resumo")
    .addSecao("Detalhes")
    .addDado("total", 10000)
    .formato("PDF")
    .build();
```

### 9. Strategies Agrupadas

**Strategy**: estratégias relacionadas.

```java
public class Pagamento {
    
    public interface Estrategia {
        void processar(double valor);
    }
    
    public static class CartaoCredito implements Estrategia {
        @Override
        public void processar(double valor) {
            System.out.println("Processando cartão de crédito: R$ " + valor);
        }
    }
    
    public static class Boleto implements Estrategia {
        @Override
        public void processar(double valor) {
            System.out.println("Gerando boleto: R$ " + valor);
        }
    }
    
    public static class PIX implements Estrategia {
        @Override
        public void processar(double valor) {
            System.out.println("Processando PIX: R$ " + valor);
        }
    }
    
    private Estrategia estrategia;
    
    public Pagamento(Estrategia estrategia) {
        this.estrategia = estrategia;
    }
    
    public void executar(double valor) {
        estrategia.processar(valor);
    }
}

// Uso: estratégias organizadas
Pagamento pag1 = new Pagamento(new Pagamento.CartaoCredito());
pag1.executar(100);

Pagamento pag2 = new Pagamento(new Pagamento.PIX());
pag2.executar(200);
```

### 10. Factory Complexo

**Factory**: criação organizada.

```java
public class Documento {
    private String tipo;
    private String conteudo;
    
    private Documento(String tipo, String conteudo) {
        this.tipo = tipo;
        this.conteudo = conteudo;
    }
    
    public static class Factory {
        
        public static Documento criarPDF(String conteudo) {
            return new Documento("PDF", conteudo);
        }
        
        public static Documento criarWord(String conteudo) {
            return new Documento("DOCX", conteudo);
        }
        
        public static Documento criarTexto(String conteudo) {
            return new Documento("TXT", conteudo);
        }
        
        public static Documento criar(String tipo, String conteudo) {
            switch (tipo.toUpperCase()) {
                case "PDF":
                    return criarPDF(conteudo);
                case "WORD":
                    return criarWord(conteudo);
                case "TEXTO":
                    return criarTexto(conteudo);
                default:
                    throw new IllegalArgumentException("Tipo inválido: " + tipo);
            }
        }
    }
    
    public String getTipo() { return tipo; }
    public String getConteudo() { return conteudo; }
}

// Uso: factory organizada
Documento doc1 = Documento.Factory.criarPDF("Conteúdo PDF");
Documento doc2 = Documento.Factory.criar("WORD", "Conteúdo Word");
```

---

## Aplicabilidade

**Encapsulamento e organização úteis para**:
- Agrupamento lógico
- Namespace hierárquico
- Ocultar implementação
- DTOs relacionados
- Configurações
- Enums/Constants
- Exceptions
- Builders
- Strategies
- Factories

---

## Armadilhas

### 1. Aninhamento Excessivo

```java
// ⚠️ Aninhamento profundo demais
public class A {
    public static class B {
        public static class C {
            public static class D {
                public static class E {
                    // Muito profundo
                }
            }
        }
    }
}

// ✅ Máximo 2-3 níveis
public class Sistema {
    public static class Modulo {
        public static class Componente { }
    }
}
```

### 2. Nested sem Relacionamento

```java
// ⚠️ Nested sem relação lógica
public class Usuario {
    // HttpClient não tem relação com Usuario
    public static class HttpClient { }
}

// ✅ Classes separadas
public class Usuario { }
public class HttpClient { }
```

### 3. Public Desnecessário

```java
// ⚠️ Public sem necessidade
public class Cache {
    // Detalhes de implementação não devem ser públicos
    public static class Node {
        public Object valor;
    }
}

// ✅ Private para detalhes
public class Cache {
    private static class Node {
        private Object valor;
    }
}
```

### 4. Múltiplas Nested Desorganizadas

```java
// ⚠️ Muitas nested sem organização
public class Sistema {
    public static class A { }
    public static class B { }
    public static class C { }
    public static class D { }
    public static class E { }
    public static class F { }
}

// ✅ Agrupamento lógico
public class Sistema {
    public static class Config { }
    public static class Builder { }
    public static class Validator { }
}
```

### 5. Nomes Genéricos

```java
// ⚠️ Nomes genéricos
public class API {
    public static class Dados { }
    public static class Info { }
    public static class Item { }
}

// ✅ Nomes específicos
public class API {
    public static class UsuarioRequest { }
    public static class UsuarioResponse { }
    public static class ErroResponse { }
}
```

---

## Boas Práticas

### 1. Agrupamento por Domínio

```java
// ✅ Agrupar por domínio
public class Usuario {
    public static class Request { }
    public static class Response { }
    public static class Builder { }
    public static class Validator { }
}
```

### 2. Private para Implementação

```java
// ✅ Private para detalhes internos
public class Fila {
    // Implementação oculta
    private static class No {
        private Object valor;
        private No proximo;
    }
    
    private No primeiro;
    private No ultimo;
    
    public void adicionar(Object valor) {
        No novo = new No();
        novo.valor = valor;
        // ...
    }
}
```

### 3. Documentar Organização

```java
/**
 * Gerenciador de pedidos.
 * 
 * <p>Classes nested:
 * <ul>
 *   <li>{@link Request} - Requisições de pedido
 *   <li>{@link Response} - Respostas de pedido
 *   <li>{@link Status} - Status possíveis
 * </ul>
 */
public class Pedido {
    public static class Request { }
    public static class Response { }
    public static enum Status { }
}
```

### 4. Módulos Lógicos

```java
// ✅ Módulos bem definidos
public class Aplicacao {
    
    public static class Database {
        public static class Config { }
        public static class Conexao { }
    }
    
    public static class Email {
        public static class Config { }
        public static class Remetente { }
    }
}
```

### 5. Separar Concerns

```java
// ✅ Separar responsabilidades
public class Usuario {
    // Dados
    private String nome;
    private String email;
    
    // Validação
    public static class Validator {
        public static void validar(Usuario u) { }
    }
    
    // Conversão
    public static class Converter {
        public static DTO toDTO(Usuario u) { }
    }
    
    // Construção
    public static class Builder {
        public Usuario build() { }
    }
}
```

### 6. Namespace Consistente

```java
// ✅ Namespace consistente
public class API {
    // Todas as requests
    public static class CriarUsuarioRequest { }
    public static class AtualizarUsuarioRequest { }
    
    // Todas as responses
    public static class UsuarioResponse { }
    public static class ErroResponse { }
}
```

### 7. Encapsular Complexidade

```java
// ✅ Encapsular algoritmos complexos
public class Arvore {
    
    // Detalhes de implementação privados
    private static class No {
        private int valor;
        private No esquerda;
        private No direita;
    }
    
    private No raiz;
    
    // API pública simples
    public void adicionar(int valor) { }
    public boolean buscar(int valor) { }
    public void remover(int valor) { }
}
```

### 8. Import Seletivo

```java
// Arquivo: API.java
package com.exemplo;

public class API {
    public static class Request { }
    public static class Response { }
}

// Arquivo: App.java
package com.exemplo.app;

import com.exemplo.API.Request;
import com.exemplo.API.Response;

public class App {
    public void processar() {
        Request req = new Request();
        Response res = new Response();
    }
}
```

### 9. Factory Organizado

```java
// ✅ Factory com métodos organizados
public class Notificacao {
    
    public static class Factory {
        // Criação por tipo
        public static Notificacao email(String destinatario) { }
        public static Notificacao sms(String telefone) { }
        public static Notificacao push(String dispositivo) { }
        
        // Criação genérica
        public static Notificacao criar(String tipo, String destino) { }
    }
}
```

### 10. Versionamento

```java
// ✅ Versionamento de API
public class API {
    
    public static class V1 {
        public static class Request { }
        public static class Response { }
    }
    
    public static class V2 {
        public static class Request { }
        public static class Response { }
    }
}

// Uso
API.V1.Request reqV1 = new API.V1.Request();
API.V2.Request reqV2 = new API.V2.Request();
```

---

## Resumo

**Encapsulamento**: agrupar classes relacionadas.

```java
public class HTTP {
    public static class Request { }
    public static class Response { }
}
```

**Organização**: namespace lógico.

**Benefícios**:
- Agrupamento lógico
- Namespace hierárquico
- Encapsulamento de implementação
- Código mais limpo
- Manutenção facilitada

**Usos comuns**:
- DTOs relacionados
- Configurações
- Enums/Constants
- Exceptions
- Builders
- Strategies
- Factories

**Níveis de acesso**:
- Public: API pública
- Private: implementação interna
- Protected: herança
- Default: pacote

**Boas práticas**:
- Agrupamento por domínio
- Private para implementação
- Documentar organização
- Módulos lógicos
- Separar concerns
- Namespace consistente
- Encapsular complexidade
- Import seletivo
- Factory organizado
- Versionamento

**Armadilhas**:
- ❌ Aninhamento excessivo (máx 2-3 níveis)
- ❌ Nested sem relacionamento
- ❌ Public desnecessário
- ❌ Múltiplas nested desorganizadas
- ❌ Nomes genéricos

**Regra de Ouro**: Use **static nested classes** para **organizar** e **encapsular** classes **logicamente relacionadas**. Crie **namespaces claros** (API.Request, API.Response). Use **private** para detalhes de implementação. Limite aninhamento a **2-3 níveis**. Nomes **específicos e descritivos**. Nested classes mantêm código **organizado**, **limpo** e **fácil de manter**.
