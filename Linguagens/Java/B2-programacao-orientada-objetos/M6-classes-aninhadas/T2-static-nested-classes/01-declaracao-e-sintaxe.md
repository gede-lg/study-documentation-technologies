# T2.01 - Declaração e Sintaxe

## Introdução

**Static nested class**: classe declarada dentro de outra com `static`.

```java
public class Externa {
    
    // Static nested class
    public static class Interna {
        public void metodo() {
            System.out.println("Classe interna estática");
        }
    }
}

// Uso
Externa.Interna obj = new Externa.Interna();
obj.metodo(); // Classe interna estática
```

**Independente**: não precisa de instância da classe externa.

---

## Fundamentos

### 1. Declaração Básica

**Sintaxe**: `static class` dentro de outra classe.

```java
public class Universidade {
    private String nome;
    
    // Static nested class
    public static class Curso {
        private String nome;
        private int duracao;
        
        public Curso(String nome, int duracao) {
            this.nome = nome;
            this.duracao = duracao;
        }
        
        public void exibir() {
            System.out.println("Curso: " + nome);
            System.out.println("Duração: " + duracao + " anos");
        }
    }
}

// Uso
Universidade.Curso curso = new Universidade.Curso("Engenharia", 5);
curso.exibir();
```

### 2. Modificadores de Acesso

**Todos os modificadores**: public, protected, default, private.

```java
public class Empresa {
    
    // Public: acesso externo
    public static class Departamento {
        private String nome;
    }
    
    // Private: apenas dentro de Empresa
    private static class ConfiguracaoInterna {
        private String chave;
    }
    
    // Protected: pacote + subclasses
    protected static class Relatorio {
        private String tipo;
    }
    
    // Default (sem modificador): apenas no pacote
    static class Cache {
        private Map<String, Object> dados;
    }
}

// Uso
Empresa.Departamento dept = new Empresa.Departamento(); // ✅ OK
// Empresa.ConfiguracaoInterna cfg = new ...; // ❌ ERRO (private)
```

### 3. Múltiplas Nested Classes

**Várias nested classes**: organização lógica.

```java
public class Banco {
    private String nome;
    
    public static class Conta {
        private String numero;
        private double saldo;
        
        public Conta(String numero) {
            this.numero = numero;
        }
    }
    
    public static class Cliente {
        private String nome;
        private String cpf;
        
        public Cliente(String nome, String cpf) {
            this.nome = nome;
            this.cpf = cpf;
        }
    }
    
    public static class Transacao {
        private String tipo;
        private double valor;
        
        public Transacao(String tipo, double valor) {
            this.tipo = tipo;
            this.valor = valor;
        }
    }
}

// Uso
Banco.Conta conta = new Banco.Conta("12345");
Banco.Cliente cliente = new Banco.Cliente("João", "123.456.789-00");
Banco.Transacao trans = new Banco.Transacao("DEPOSITO", 100);
```

### 4. Nested Class com Atributos

**Atributos**: como classe normal.

```java
public class Sistema {
    
    public static class Configuracao {
        private String host;
        private int porta;
        private boolean ssl;
        
        public Configuracao(String host, int porta, boolean ssl) {
            this.host = host;
            this.porta = porta;
            this.ssl = ssl;
        }
        
        public String getHost() { return host; }
        public int getPorta() { return porta; }
        public boolean isSsl() { return ssl; }
        
        @Override
        public String toString() {
            return host + ":" + porta + (ssl ? " (SSL)" : "");
        }
    }
}

// Uso
Sistema.Configuracao config = new Sistema.Configuracao("localhost", 8080, true);
System.out.println(config); // localhost:8080 (SSL)
```

### 5. Nested Class com Métodos Static

**Métodos static**: independentes de instância.

```java
public class Matematica {
    
    public static class Calculadora {
        
        public static int somar(int a, int b) {
            return a + b;
        }
        
        public static int multiplicar(int a, int b) {
            return a * b;
        }
        
        public static double media(int... numeros) {
            int soma = 0;
            for (int n : numeros) {
                soma += n;
            }
            return (double) soma / numeros.length;
        }
    }
}

// Uso sem instanciar
int resultado = Matematica.Calculadora.somar(5, 3); // 8
double media = Matematica.Calculadora.media(10, 20, 30); // 20.0
```

### 6. Nested Class Implementando Interface

**Interface**: nested class pode implementar.

```java
public interface Comparable<T> {
    int compareTo(T outro);
}

public class Dados {
    
    public static class Pessoa implements Comparable<Pessoa> {
        private String nome;
        private int idade;
        
        public Pessoa(String nome, int idade) {
            this.nome = nome;
            this.idade = idade;
        }
        
        @Override
        public int compareTo(Pessoa outra) {
            return Integer.compare(this.idade, outra.idade);
        }
        
        public String getNome() { return nome; }
        public int getIdade() { return idade; }
    }
}

// Uso
Dados.Pessoa p1 = new Dados.Pessoa("João", 30);
Dados.Pessoa p2 = new Dados.Pessoa("Maria", 25);

int comp = p1.compareTo(p2);
System.out.println(comp > 0 ? "João é mais velho" : "Maria é mais velha");
```

### 7. Nested Class Estendendo Classe

**Herança**: nested class pode estender outra classe.

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Zoo {
    
    public static class Cachorro extends Animal {
        public Cachorro(String nome) {
            super(nome);
        }
        
        @Override
        public void emitirSom() {
            System.out.println(nome + " faz: Au au!");
        }
    }
}

// Uso
Zoo.Cachorro dog = new Zoo.Cachorro("Rex");
dog.emitirSom(); // Rex faz: Au au!
```

### 8. Nested Class com Genéricos

**Genéricos**: nested class pode ser genérica.

```java
public class Repositorio {
    
    public static class Resultado<T> {
        private T dado;
        private boolean sucesso;
        private String mensagem;
        
        public Resultado(T dado, boolean sucesso, String mensagem) {
            this.dado = dado;
            this.sucesso = sucesso;
            this.mensagem = mensagem;
        }
        
        public T getDado() { return dado; }
        public boolean isSucesso() { return sucesso; }
        public String getMensagem() { return mensagem; }
    }
}

// Uso
Repositorio.Resultado<String> res1 = 
    new Repositorio.Resultado<>("João", true, "Encontrado");

Repositorio.Resultado<Integer> res2 = 
    new Repositorio.Resultado<>(null, false, "Não encontrado");

System.out.println(res1.getDado()); // João
System.out.println(res2.isSucesso()); // false
```

### 9. Nested Class Aninhada em Nested Class

**Aninhamento múltiplo**: nested class dentro de nested class.

```java
public class Sistema {
    
    public static class Modulo {
        private String nome;
        
        public static class Componente {
            private String tipo;
            
            public static class Propriedade {
                private String chave;
                private String valor;
                
                public Propriedade(String chave, String valor) {
                    this.chave = chave;
                    this.valor = valor;
                }
                
                public String getChave() { return chave; }
                public String getValor() { return valor; }
            }
        }
    }
}

// Uso
Sistema.Modulo.Componente.Propriedade prop = 
    new Sistema.Modulo.Componente.Propriedade("cor", "azul");

System.out.println(prop.getChave() + " = " + prop.getValor());
```

### 10. Import para Simplificar

**Import static**: simplificar nome.

```java
// Sem import
public class Teste1 {
    public static void main(String[] args) {
        Sistema.Configuracao config = 
            new Sistema.Configuracao("localhost", 8080, true);
    }
}

// Com import
import static com.exemplo.Sistema.Configuracao;

public class Teste2 {
    public static void main(String[] args) {
        Configuracao config = 
            new Configuracao("localhost", 8080, true);
    }
}
```

---

## Aplicabilidade

**Static nested classes**:
- Helper classes relacionadas
- Agrupamento lógico
- Encapsulamento de implementação
- Organização de código
- DTOs e value objects

**Exemplos**:
- `Map.Entry<K,V>` (Java Collections)
- Builder pattern
- Result/Response wrappers
- Configurações relacionadas

---

## Armadilhas

### 1. Confundir com Inner Class

```java
public class Externa {
    // Static nested class (sem referência à Externa)
    public static class Nested {
        public void metodo() {
            // ❌ ERRO: não pode acessar membros não-static de Externa
            // System.out.println(nome); // ERRO
        }
    }
    
    // Inner class (com referência à Externa)
    public class Inner {
        public void metodo() {
            // ✅ OK: pode acessar membros de Externa
            System.out.println(Externa.this.nome);
        }
    }
    
    private String nome = "Externa";
}
```

### 2. Esquecer `static`

```java
// ❌ ERRO: sem static (inner class, não nested)
public class Empresa {
    public class Departamento { // Precisa de instância de Empresa
    }
}

// Uso complicado
Empresa emp = new Empresa();
Empresa.Departamento dept = emp.new Departamento();

// ✅ COM static (nested class)
public class Empresa {
    public static class Departamento { // Independente
    }
}

// Uso simples
Empresa.Departamento dept = new Empresa.Departamento();
```

### 3. Private sem Necessidade

```java
// ⚠️ Private: só acessível dentro de Externa
public class Sistema {
    private static class Config {
        private String valor;
    }
    
    public Config getConfig() {
        return new Config();
    }
}

// ❌ ERRO: Config é private
// Sistema.Config config = new Sistema.Config();

// ✅ Public quando necessário acesso externo
public class Sistema {
    public static class Config {
        private String valor;
    }
}
```

### 4. Nome Confuso

```java
// ⚠️ Nome genérico (pouco descritivo)
public class Sistema {
    public static class Dados { }
    public static class Info { }
    public static class Item { }
}

// ✅ Nome específico
public class Sistema {
    public static class Configuracao { }
    public static class Resultado { }
    public static class Credencial { }
}
```

### 5. Nested Desnecessária

```java
// ⚠️ Nested sem relação forte com Externa
public class Usuario {
    public static class HttpClient { // Não tem relação com Usuario
    }
}

// ✅ Classe separada (sem aninhamento)
public class HttpClient {
}

public class Usuario {
}
```

---

## Boas Práticas

### 1. Usar para Helper Classes

```java
// ✅ Helper class relacionada
public class String {
    public static class CaseInsensitiveComparator 
            implements Comparator<String> {
        @Override
        public int compare(String s1, String s2) {
            return s1.compareToIgnoreCase(s2);
        }
    }
}
```

### 2. Builder Pattern

```java
// ✅ Builder como nested class
public class Usuario {
    private String nome;
    private String email;
    private int idade;
    
    private Usuario(Builder builder) {
        this.nome = builder.nome;
        this.email = builder.email;
        this.idade = builder.idade;
    }
    
    public static class Builder {
        private String nome;
        private String email;
        private int idade;
        
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
        
        public Usuario build() {
            return new Usuario(this);
        }
    }
}

// Uso
Usuario user = new Usuario.Builder()
    .nome("João")
    .email("joao@email.com")
    .idade(30)
    .build();
```

### 3. Result/Response Wrappers

```java
// ✅ Wrapper para resultados
public class UsuarioService {
    
    public static class Resultado {
        private boolean sucesso;
        private String mensagem;
        private Usuario usuario;
        
        public static Resultado sucesso(Usuario usuario) {
            return new Resultado(true, "OK", usuario);
        }
        
        public static Resultado erro(String mensagem) {
            return new Resultado(false, mensagem, null);
        }
        
        private Resultado(boolean sucesso, String mensagem, Usuario usuario) {
            this.sucesso = sucesso;
            this.mensagem = mensagem;
            this.usuario = usuario;
        }
        
        public boolean isSucesso() { return sucesso; }
        public String getMensagem() { return mensagem; }
        public Usuario getUsuario() { return usuario; }
    }
    
    public Resultado buscar(String id) {
        Usuario usuario = // ... buscar
        if (usuario != null) {
            return Resultado.sucesso(usuario);
        } else {
            return Resultado.erro("Usuário não encontrado");
        }
    }
}
```

### 4. DTOs Relacionados

```java
// ✅ DTOs agrupados logicamente
public class UsuarioAPI {
    
    public static class UsuarioRequest {
        private String nome;
        private String email;
        
        // Getters/Setters
    }
    
    public static class UsuarioResponse {
        private String id;
        private String nome;
        private String email;
        
        // Getters/Setters
    }
    
    public UsuarioResponse criar(UsuarioRequest request) {
        // Criar usuário
        return new UsuarioResponse();
    }
}
```

### 5. Modificador Adequado

```java
// ✅ Public: acesso externo necessário
public class Sistema {
    public static class Configuracao { }
}

// ✅ Private: apenas uso interno
public class Sistema {
    private static class Cache { }
    
    private Cache cache = new Cache();
}
```

### 6. Nome Qualificado Claro

```java
// ✅ Nome claro e descritivo
public class Pedido {
    public static class Item { }
    public static class Status { }
}

// Uso claro
Pedido.Item item = new Pedido.Item();
Pedido.Status status = Pedido.Status.PENDENTE;
```

### 7. Documentar Relacionamento

```java
/**
 * Representa um pedido no sistema.
 */
public class Pedido {
    
    /**
     * Item de um pedido.
     * 
     * <p>Esta classe é uma static nested class de {@link Pedido}
     * e representa um item individual dentro de um pedido.
     */
    public static class Item {
        private String produto;
        private int quantidade;
    }
}
```

### 8. Evitar Aninhamento Excessivo

```java
// ⚠️ Aninhamento profundo (confuso)
public class A {
    public static class B {
        public static class C {
            public static class D {
                public static class E { }
            }
        }
    }
}

// ✅ Máximo 2 níveis
public class Sistema {
    public static class Modulo {
        public static class Componente { }
    }
}
```

### 9. Considerar Record (Java 14+)

```java
// ✅ Record para DTOs simples
public class API {
    public record Request(String nome, String email) { }
    public record Response(String id, String status) { }
}

// Uso
API.Request req = new API.Request("João", "joao@email.com");
```

### 10. Import Static quando Apropriado

```java
// Arquivo 1: definição
package com.exemplo;

public class Cores {
    public static class RGB {
        public final int r, g, b;
        
        public RGB(int r, int g, int b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }
}

// Arquivo 2: uso
package com.exemplo.app;

import static com.exemplo.Cores.RGB;

public class App {
    public static void main(String[] args) {
        RGB vermelho = new RGB(255, 0, 0);
    }
}
```

---

## Resumo

**Static nested class**: classe com `static` dentro de outra.

```java
public class Externa {
    public static class Interna {
        public void metodo() { }
    }
}

// Uso
Externa.Interna obj = new Externa.Interna();
```

**Independente**: não precisa de instância da classe externa.

**Modificadores**: public, private, protected, default.

**Características**:
- Acesso apenas a membros static da externa
- Instanciação: `new Externa.Interna()`
- Pode ter métodos static
- Pode implementar interfaces
- Pode estender classes
- Pode ser genérica
- Pode ter nested classes

**Aplicabilidade**:
- Helper classes
- Builder pattern
- Result/Response wrappers
- DTOs relacionados
- Encapsulamento

**Boas práticas**:
- Helper classes relacionadas
- Builder pattern
- Result/Response wrappers
- DTOs agrupados
- Modificador adequado
- Nome qualificado claro
- Documentar relacionamento
- Evitar aninhamento excessivo
- Considerar record (Java 14+)
- Import static apropriado

**Armadilhas**:
- ❌ Confundir com inner class
- ❌ Esquecer `static`
- ❌ Private sem necessidade
- ❌ Nome confuso
- ❌ Nested desnecessária

**Regra de Ouro**: **Static nested classes** são classes **independentes** declaradas dentro de outra para **organização lógica**. Use quando a nested class tem **relação forte** com a classe externa, mas **não precisa** de sua instância. Ideal para **helper classes**, **builders**, **DTOs** e **result wrappers**. Sempre considere se o aninhamento é **realmente necessário** ou se classes separadas são mais claras.
