# T2.04 - Uso como Helper Classes

## Introdução

**Helper classes**: classes auxiliares para funcionalidades relacionadas.

```java
public class String {
    // String é a classe principal
    
    // Helper: comparador case-insensitive
    public static class CaseInsensitiveComparator 
            implements Comparator<String> {
        
        @Override
        public int compare(String s1, String s2) {
            return s1.compareToIgnoreCase(s2);
        }
    }
}

// Uso
List<String> nomes = Arrays.asList("João", "ana", "PEDRO");
Collections.sort(nomes, new String.CaseInsensitiveComparator());
// [ana, João, PEDRO]
```

**Organização**: helper class próxima da classe que auxilia.

---

## Fundamentos

### 1. Comparator Helper

**Comparator**: ordenação customizada.

```java
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    
    public Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }
    
    // Helper: comparar por preço
    public static class PrecoComparator implements Comparator<Produto> {
        @Override
        public int compare(Produto p1, Produto p2) {
            return Double.compare(p1.preco, p2.preco);
        }
    }
    
    // Helper: comparar por estoque
    public static class EstoqueComparator implements Comparator<Produto> {
        @Override
        public int compare(Produto p1, Produto p2) {
            return Integer.compare(p1.estoque, p2.estoque);
        }
    }
    
    // Getters
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public int getEstoque() { return estoque; }
}

// Uso
List<Produto> produtos = Arrays.asList(
    new Produto("Mouse", 50, 100),
    new Produto("Teclado", 150, 50),
    new Produto("Monitor", 800, 20)
);

// Ordenar por preço
Collections.sort(produtos, new Produto.PrecoComparator());
produtos.forEach(p -> System.out.println(p.getNome() + " - R$ " + p.getPreco()));

// Ordenar por estoque
Collections.sort(produtos, new Produto.EstoqueComparator());
produtos.forEach(p -> System.out.println(p.getNome() + " - Estoque: " + p.getEstoque()));
```

### 2. Builder Helper

**Builder**: construção fluente de objetos.

```java
public class Usuario {
    private String nome;
    private String email;
    private int idade;
    private String telefone;
    
    private Usuario(Builder builder) {
        this.nome = builder.nome;
        this.email = builder.email;
        this.idade = builder.idade;
        this.telefone = builder.telefone;
    }
    
    // Helper: Builder
    public static class Builder {
        private String nome;
        private String email;
        private int idade;
        private String telefone;
        
        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder idade(int idade) {
            this.idade = idade;
            return this;
        }
        
        public Builder telefone(String telefone) {
            this.telefone = telefone;
            return this;
        }
        
        public Usuario build() {
            if (nome == null || email == null) {
                throw new IllegalStateException("Nome e email são obrigatórios");
            }
            return new Usuario(this);
        }
    }
    
    @Override
    public String toString() {
        return "Usuario{nome='" + nome + "', email='" + email + "'}";
    }
}

// Uso
Usuario user = new Usuario.Builder()
    .nome("João")
    .email("joao@email.com")
    .idade(30)
    .telefone("11999999999")
    .build();

System.out.println(user);
```

### 3. Validator Helper

**Validator**: validação de dados.

```java
public class Usuario {
    private String nome;
    private String email;
    private int idade;
    
    public Usuario(String nome, String email, int idade) {
        this.nome = nome;
        this.email = email;
        this.idade = idade;
    }
    
    // Helper: Validador
    public static class Validator {
        public static boolean validarNome(String nome) {
            return nome != null && nome.length() >= 3;
        }
        
        public static boolean validarEmail(String email) {
            return email != null && email.contains("@");
        }
        
        public static boolean validarIdade(int idade) {
            return idade >= 18 && idade <= 120;
        }
        
        public static void validar(Usuario usuario) {
            if (!validarNome(usuario.nome)) {
                throw new IllegalArgumentException("Nome inválido");
            }
            if (!validarEmail(usuario.email)) {
                throw new IllegalArgumentException("Email inválido");
            }
            if (!validarIdade(usuario.idade)) {
                throw new IllegalArgumentException("Idade inválida");
            }
        }
    }
    
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public int getIdade() { return idade; }
}

// Uso
Usuario user = new Usuario("João", "joao@email.com", 30);
Usuario.Validator.validar(user); // OK

Usuario userInvalido = new Usuario("Jo", "invalido", 15);
// Usuario.Validator.validar(userInvalido); // Exceção
```

### 4. Converter Helper

**Converter**: conversão entre tipos.

```java
public class Usuario {
    private String nome;
    private String email;
    
    public Usuario(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
    
    // Helper: Converter
    public static class Converter {
        public static UsuarioDTO toDTO(Usuario usuario) {
            UsuarioDTO dto = new UsuarioDTO();
            dto.setNome(usuario.nome);
            dto.setEmail(usuario.email);
            return dto;
        }
        
        public static Usuario fromDTO(UsuarioDTO dto) {
            return new Usuario(dto.getNome(), dto.getEmail());
        }
        
        public static List<UsuarioDTO> toDTOList(List<Usuario> usuarios) {
            return usuarios.stream()
                .map(Converter::toDTO)
                .collect(Collectors.toList());
        }
    }
    
    public String getNome() { return nome; }
    public String getEmail() { return email; }
}

// DTO
class UsuarioDTO {
    private String nome;
    private String email;
    
    // Getters/Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

// Uso
Usuario user = new Usuario("João", "joao@email.com");
UsuarioDTO dto = Usuario.Converter.toDTO(user);
```

### 5. Factory Helper

**Factory**: criação de instâncias.

```java
public class Pedido {
    private String numero;
    private String cliente;
    private double total;
    private String status;
    
    private Pedido(String numero, String cliente, double total, String status) {
        this.numero = numero;
        this.cliente = cliente;
        this.total = total;
        this.status = status;
    }
    
    // Helper: Factory
    public static class Factory {
        private static int proximoNumero = 1;
        
        public static Pedido novo(String cliente, double total) {
            String numero = String.format("PED%05d", proximoNumero++);
            return new Pedido(numero, cliente, total, "PENDENTE");
        }
        
        public static Pedido aprovado(String cliente, double total) {
            String numero = String.format("PED%05d", proximoNumero++);
            return new Pedido(numero, cliente, total, "APROVADO");
        }
        
        public static Pedido cancelado(String cliente) {
            String numero = String.format("PED%05d", proximoNumero++);
            return new Pedido(numero, cliente, 0, "CANCELADO");
        }
    }
    
    @Override
    public String toString() {
        return "Pedido{numero='" + numero + "', status='" + status + "'}";
    }
}

// Uso
Pedido p1 = Pedido.Factory.novo("João", 100);
Pedido p2 = Pedido.Factory.aprovado("Maria", 200);
Pedido p3 = Pedido.Factory.cancelado("Pedro");

System.out.println(p1); // Pedido{numero='PED00001', status='PENDENTE'}
System.out.println(p2); // Pedido{numero='PED00002', status='APROVADO'}
```

### 6. Formatter Helper

**Formatter**: formatação de dados.

```java
public class Telefone {
    private String ddd;
    private String numero;
    
    public Telefone(String ddd, String numero) {
        this.ddd = ddd;
        this.numero = numero;
    }
    
    // Helper: Formatter
    public static class Formatter {
        public static String formatarCompleto(Telefone telefone) {
            return "(" + telefone.ddd + ") " + telefone.numero;
        }
        
        public static String formatarInternacional(Telefone telefone) {
            return "+55 " + telefone.ddd + " " + telefone.numero;
        }
        
        public static String formatarSomenteNumeros(Telefone telefone) {
            return telefone.ddd + telefone.numero;
        }
    }
    
    public String getDdd() { return ddd; }
    public String getNumero() { return numero; }
}

// Uso
Telefone tel = new Telefone("11", "99999-9999");

System.out.println(Telefone.Formatter.formatarCompleto(tel));
// (11) 99999-9999

System.out.println(Telefone.Formatter.formatarInternacional(tel));
// +55 11 99999-9999

System.out.println(Telefone.Formatter.formatarSomenteNumeros(tel));
// 1199999-9999
```

### 7. Parser Helper

**Parser**: análise e conversão de strings.

```java
public class Data {
    private int dia;
    private int mes;
    private int ano;
    
    public Data(int dia, int mes, int ano) {
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
    }
    
    // Helper: Parser
    public static class Parser {
        public static Data parse(String texto) {
            // Formato: DD/MM/YYYY
            String[] partes = texto.split("/");
            if (partes.length != 3) {
                throw new IllegalArgumentException("Formato inválido");
            }
            
            int dia = Integer.parseInt(partes[0]);
            int mes = Integer.parseInt(partes[1]);
            int ano = Integer.parseInt(partes[2]);
            
            return new Data(dia, mes, ano);
        }
        
        public static Data parseISO(String texto) {
            // Formato: YYYY-MM-DD
            String[] partes = texto.split("-");
            if (partes.length != 3) {
                throw new IllegalArgumentException("Formato inválido");
            }
            
            int ano = Integer.parseInt(partes[0]);
            int mes = Integer.parseInt(partes[1]);
            int dia = Integer.parseInt(partes[2]);
            
            return new Data(dia, mes, ano);
        }
    }
    
    @Override
    public String toString() {
        return String.format("%02d/%02d/%04d", dia, mes, ano);
    }
}

// Uso
Data d1 = Data.Parser.parse("25/12/2024");
Data d2 = Data.Parser.parseISO("2024-12-25");

System.out.println(d1); // 25/12/2024
System.out.println(d2); // 25/12/2024
```

### 8. Cache Helper

**Cache**: armazenamento em cache.

```java
public class Usuario {
    private String id;
    private String nome;
    
    public Usuario(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    
    // Helper: Cache
    public static class Cache {
        private static Map<String, Usuario> cache = new HashMap<>();
        
        public static void adicionar(Usuario usuario) {
            cache.put(usuario.id, usuario);
        }
        
        public static Usuario buscar(String id) {
            return cache.get(id);
        }
        
        public static void remover(String id) {
            cache.remove(id);
        }
        
        public static void limpar() {
            cache.clear();
        }
        
        public static int tamanho() {
            return cache.size();
        }
    }
    
    public String getId() { return id; }
    public String getNome() { return nome; }
}

// Uso
Usuario user = new Usuario("1", "João");
Usuario.Cache.adicionar(user);

Usuario cached = Usuario.Cache.buscar("1");
System.out.println(cached.getNome()); // João
```

### 9. Constants Helper

**Constants**: constantes relacionadas.

```java
public class Pedido {
    private String status;
    
    public Pedido(String status) {
        this.status = status;
    }
    
    // Helper: Constantes
    public static class Status {
        public static final String PENDENTE = "PENDENTE";
        public static final String APROVADO = "APROVADO";
        public static final String ENVIADO = "ENVIADO";
        public static final String ENTREGUE = "ENTREGUE";
        public static final String CANCELADO = "CANCELADO";
        
        public static boolean isValido(String status) {
            return status.equals(PENDENTE) ||
                   status.equals(APROVADO) ||
                   status.equals(ENVIADO) ||
                   status.equals(ENTREGUE) ||
                   status.equals(CANCELADO);
        }
    }
    
    public String getStatus() { return status; }
}

// Uso
Pedido pedido = new Pedido(Pedido.Status.PENDENTE);

if (pedido.getStatus().equals(Pedido.Status.APROVADO)) {
    System.out.println("Pedido aprovado");
}
```

### 10. Utils Helper

**Utils**: utilitários diversos.

```java
public class Texto {
    private String valor;
    
    public Texto(String valor) {
        this.valor = valor;
    }
    
    // Helper: Utils
    public static class Utils {
        public static boolean isEmpty(String texto) {
            return texto == null || texto.isEmpty();
        }
        
        public static boolean isBlank(String texto) {
            return isEmpty(texto) || texto.trim().isEmpty();
        }
        
        public static String capitalize(String texto) {
            if (isEmpty(texto)) return texto;
            return texto.substring(0, 1).toUpperCase() + 
                   texto.substring(1).toLowerCase();
        }
        
        public static String reverse(String texto) {
            if (isEmpty(texto)) return texto;
            return new StringBuilder(texto).reverse().toString();
        }
        
        public static int contarPalavras(String texto) {
            if (isBlank(texto)) return 0;
            return texto.trim().split("\\s+").length;
        }
    }
    
    public String getValor() { return valor; }
}

// Uso
System.out.println(Texto.Utils.capitalize("joão")); // João
System.out.println(Texto.Utils.reverse("abc")); // cba
System.out.println(Texto.Utils.contarPalavras("Olá mundo Java")); // 3
```

---

## Aplicabilidade

**Helper classes úteis para**:
- Comparadores customizados
- Builders
- Validadores
- Conversores
- Factories
- Formatadores
- Parsers
- Cache
- Constantes
- Utilitários

---

## Armadilhas

### 1. Helper Genérica Demais

```java
// ⚠️ Helper genérica (sem relação com Usuario)
public class Usuario {
    public static class StringUtils {
        public static boolean isEmpty(String s) {
            return s == null || s.isEmpty();
        }
    }
}

// ✅ Helper específica
public class Usuario {
    public static class Validator {
        public static boolean validarNome(String nome) {
            return nome != null && nome.length() >= 3;
        }
    }
}
```

### 2. Helper com Estado Desnecessário

```java
// ⚠️ Helper com estado (desnecessário)
public class Produto {
    public static class Formatter {
        private String formato; // Estado
        
        public Formatter(String formato) {
            this.formato = formato;
        }
        
        public String formatar(Produto p) {
            // ...
        }
    }
}

// ✅ Helper sem estado (métodos static)
public class Produto {
    public static class Formatter {
        public static String formatarPreco(Produto p) {
            return "R$ " + p.getPreco();
        }
    }
}
```

### 3. Múltiplas Helpers Desorganizadas

```java
// ⚠️ Muitas helpers (confuso)
public class Usuario {
    public static class Helper1 { }
    public static class Helper2 { }
    public static class Helper3 { }
    public static class Helper4 { }
}

// ✅ Helpers com nomes claros
public class Usuario {
    public static class Validator { }
    public static class Builder { }
    public static class Converter { }
}
```

### 4. Helper Acessando Privados

```java
// ⚠️ Helper acessa atributos privados
public class Usuario {
    private String senha;
    
    public static class Utils {
        public static void alterarSenha(Usuario user, String nova) {
            // ❌ ERRO: não pode acessar 'senha' (é de instância)
            // user.senha = nova;
        }
    }
}
```

### 5. Helper como Inner Class

```java
// ❌ ERRO: Helper como inner class (desnecessário)
public class Produto {
    // Inner class (depende de instância)
    public class Validator {
        public boolean validar() {
            // ...
        }
    }
}

// ✅ Helper como static nested (independente)
public class Produto {
    public static class Validator {
        public static boolean validar(Produto p) {
            // ...
        }
    }
}
```

---

## Boas Práticas

### 1. Nome Descritivo

```java
// ✅ Nomes claros
public class Usuario {
    public static class Builder { }
    public static class Validator { }
    public static class Converter { }
}
```

### 2. Métodos Static quando Possível

```java
// ✅ Métodos static (sem estado)
public class Produto {
    public static class Formatter {
        public static String formatarPreco(Produto p) {
            return "R$ " + String.format("%.2f", p.getPreco());
        }
        
        public static String formatarNome(Produto p) {
            return p.getNome().toUpperCase();
        }
    }
}
```

### 3. Agrupar Funcionalidades Relacionadas

```java
// ✅ Agrupar validações
public class Usuario {
    public static class Validator {
        public static boolean validarNome(String nome) { }
        public static boolean validarEmail(String email) { }
        public static boolean validarIdade(int idade) { }
        public static void validar(Usuario u) { }
    }
}
```

### 4. Documentar Helper

```java
/**
 * Helper para validação de usuários.
 */
public class Usuario {
    /**
     * Validador de dados de usuário.
     * 
     * <p>Exemplo:
     * <pre>
     * Usuario user = new Usuario("João", "joao@email.com", 30);
     * Usuario.Validator.validar(user);
     * </pre>
     */
    public static class Validator {
        public static void validar(Usuario usuario) { }
    }
}
```

### 5. Construtores Privados para Utils

```java
// ✅ Construtor privado (apenas métodos static)
public class Texto {
    public static class Utils {
        private Utils() {
            throw new AssertionError("Classe utilitária");
        }
        
        public static boolean isEmpty(String s) { }
        public static String capitalize(String s) { }
    }
}
```

### 6. Builder Validando

```java
// ✅ Builder com validação
public class Usuario {
    public static class Builder {
        private String nome;
        private String email;
        
        public Builder nome(String nome) {
            if (nome == null || nome.length() < 3) {
                throw new IllegalArgumentException("Nome inválido");
            }
            this.nome = nome;
            return this;
        }
        
        public Builder email(String email) {
            if (email == null || !email.contains("@")) {
                throw new IllegalArgumentException("Email inválido");
            }
            this.email = email;
            return this;
        }
        
        public Usuario build() {
            return new Usuario(this);
        }
    }
}
```

### 7. Converter Bidirecionais

```java
// ✅ Converter com ambas direções
public class Usuario {
    public static class Converter {
        public static UsuarioDTO toDTO(Usuario entity) { }
        public static Usuario fromDTO(UsuarioDTO dto) { }
        
        public static List<UsuarioDTO> toDTOList(List<Usuario> entities) { }
        public static List<Usuario> fromDTOList(List<UsuarioDTO> dtos) { }
    }
}
```

### 8. Factory com Validação

```java
// ✅ Factory validando parâmetros
public class Pedido {
    public static class Factory {
        public static Pedido criar(String cliente, double total) {
            if (cliente == null || cliente.isEmpty()) {
                throw new IllegalArgumentException("Cliente obrigatório");
            }
            if (total < 0) {
                throw new IllegalArgumentException("Total inválido");
            }
            return new Pedido(cliente, total);
        }
    }
}
```

### 9. Formatter com Locale

```java
// ✅ Formatter com internacionalização
public class Moeda {
    private double valor;
    
    public static class Formatter {
        public static String formatar(Moeda moeda, Locale locale) {
            NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
            return formatter.format(moeda.valor);
        }
        
        public static String formatarBR(Moeda moeda) {
            return formatar(moeda, new Locale("pt", "BR"));
        }
        
        public static String formatarUS(Moeda moeda) {
            return formatar(moeda, Locale.US);
        }
    }
}
```

### 10. Cache Thread-Safe

```java
// ✅ Cache thread-safe
public class Usuario {
    public static class Cache {
        private static final Map<String, Usuario> cache = 
            new ConcurrentHashMap<>();
        
        public static void adicionar(Usuario usuario) {
            cache.put(usuario.getId(), usuario);
        }
        
        public static Usuario buscar(String id) {
            return cache.get(id);
        }
        
        public static void remover(String id) {
            cache.remove(id);
        }
    }
}
```

---

## Resumo

**Helper classes**: auxiliares com funcionalidades relacionadas.

```java
public class Usuario {
    public static class Validator {
        public static void validar(Usuario u) { }
    }
    
    public static class Builder {
        public Usuario build() { }
    }
}
```

**Tipos comuns**:
- Comparator: ordenação
- Builder: construção fluente
- Validator: validação
- Converter: conversão
- Factory: criação
- Formatter: formatação
- Parser: análise
- Cache: armazenamento
- Constants: constantes
- Utils: utilitários

**Características**:
- Static nested class
- Métodos static (geralmente)
- Sem estado (preferível)
- Nome descritivo
- Funcionalidades agrupadas

**Aplicabilidade**:
- Organização de código
- Funcionalidades auxiliares
- Redução de acoplamento
- Reutilização

**Boas práticas**:
- Nome descritivo
- Métodos static
- Agrupar funcionalidades
- Documentar helper
- Construtor privado para utils
- Builder validando
- Converter bidirecionais
- Factory com validação
- Formatter com locale
- Cache thread-safe

**Armadilhas**:
- ❌ Helper genérica demais
- ❌ Helper com estado desnecessário
- ❌ Múltiplas helpers desorganizadas
- ❌ Helper como inner class
- ❌ Acessar membros privados de instância

**Regra de Ouro**: **Helper classes** são **static nested classes** que fornecem funcionalidades **auxiliares relacionadas** à classe externa. Use para **organizar código** (builders, validators, converters, formatters). Prefira **métodos static** e **sem estado**. Agrupe funcionalidades **logicamente relacionadas**. Nomes **descritivos** (Validator, Builder, Converter). Helpers mantêm código **limpo e organizado**.
