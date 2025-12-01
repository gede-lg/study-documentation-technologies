# T4.03 - Acesso via Nome da Interface

## Introdução

**Métodos static**: acesso via **nome da interface** (não por instância).

```java
public interface Matematica {
    static int somar(int a, int b) {
        return a + b;
    }
    
    static int multiplicar(int a, int b) {
        return a * b;
    }
}

// ✅ Acesso via nome da interface
int resultado = Matematica.somar(5, 3); // 8
int resultado2 = Matematica.multiplicar(4, 2); // 8

// ❌ ERRO: não pode acessar via instância
// Matematica mat = ...; // Interface não pode ser instanciada
```

**Razão**: métodos static pertencem à **interface**, não à **instância**.

**Sintaxe**:
```java
NomeDaInterface.metodoStatic(argumentos);
```

---

## Fundamentos

### 1. Sintaxe Básica

**Acesso**: nome da interface + ponto + método.

```java
public interface StringUtils {
    static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }
    
    static String reverse(String str) {
        if (str == null) return null;
        return new StringBuilder(str).reverse().toString();
    }
}

// Acesso via nome da interface
boolean vazio = StringUtils.isNullOrEmpty(""); // true
String reverso = StringUtils.reverse("abc"); // "cba"
```

### 2. Não Pode Acessar via Instância

Interface **não pode ser instanciada**.

```java
public interface Calculadora {
    static double pi() {
        return 3.14159;
    }
}

// ❌ ERRO: interface não pode ser instanciada
// Calculadora calc = new Calculadora(); // ERRO

// ✅ Acesso via nome da interface
double pi = Calculadora.pi();
```

### 3. Implementação Não Herda

Implementações **não herdam** métodos static.

```java
public interface Repositorio {
    static void validar(Object obj) {
        if (obj == null) {
            throw new IllegalArgumentException("Objeto null");
        }
    }
}

public class UsuarioRepositorio implements Repositorio {
    public void salvar(Usuario usuario) {
        // ❌ ERRO: não herdado
        // validar(usuario); // ERRO
        
        // ✅ Acesso via nome da interface
        Repositorio.validar(usuario);
    }
}
```

### 4. Dentro da Própria Interface

Dentro da interface: pode **omitir** o nome (opcional).

```java
public interface Calculadora {
    static double pi() {
        return 3.14159;
    }
    
    static double areaCirculo(double raio) {
        // Dentro da interface: pode omitir nome
        return pi() * raio * raio; // ou Calculadora.pi()
    }
    
    default double circunferencia(double raio) {
        // Dentro de default: pode omitir nome
        return 2 * pi() * raio; // ou Calculadora.pi()
    }
}
```

### 5. Fora da Interface

Fora da interface: **deve qualificar** com nome.

```java
public interface Utils {
    static void log(String mensagem) {
        System.out.println("LOG: " + mensagem);
    }
}

// Fora da interface: deve qualificar
public class MinhaClasse {
    public void executar() {
        Utils.log("Executando"); // Deve qualificar
    }
}
```

### 6. Import Static

**import static**: importar método static.

```java
public interface Matematica {
    static int somar(int a, int b) {
        return a + b;
    }
    
    static int subtrair(int a, int b) {
        return a - b;
    }
}

// Import static
import static pacote.Matematica.somar;
import static pacote.Matematica.subtrair;

public class Teste {
    public void executar() {
        // Sem qualificar (import static)
        int soma = somar(5, 3); // 8
        int sub = subtrair(10, 4); // 6
    }
}

// Ou import static *
import static pacote.Matematica.*;

public class Teste2 {
    public void executar() {
        int soma = somar(5, 3);
        int sub = subtrair(10, 4);
    }
}
```

### 7. Evitar Conflitos de Nomes

**Qualificar** evita conflitos.

```java
public interface Utils1 {
    static void log(String msg) {
        System.out.println("Utils1: " + msg);
    }
}

public interface Utils2 {
    static void log(String msg) {
        System.out.println("Utils2: " + msg);
    }
}

public class Teste {
    public void executar() {
        // Qualificar evita conflito
        Utils1.log("mensagem"); // Utils1: mensagem
        Utils2.log("mensagem"); // Utils2: mensagem
    }
}
```

### 8. Collections Factory Methods

**Collections**: acesso via nome da interface.

```java
// List.of()
List<String> lista = List.of("A", "B", "C");

// Set.of()
Set<Integer> conjunto = Set.of(1, 2, 3);

// Map.of()
Map<String, Integer> mapa = Map.of("A", 1, "B", 2);

// Stream.of()
Stream<String> stream = Stream.of("X", "Y", "Z");
```

### 9. Comparator Factory Methods

**Comparator**: acesso via nome da interface.

```java
// Comparator.naturalOrder()
List<String> nomes = Arrays.asList("João", "Maria", "Ana");
nomes.sort(Comparator.naturalOrder());

// Comparator.reverseOrder()
nomes.sort(Comparator.reverseOrder());

// Comparator.comparing()
List<Pessoa> pessoas = ...;
pessoas.sort(Comparator.comparing(Pessoa::getNome));
```

### 10. Acesso de Private Static

**private static**: acesso **apenas** dentro da interface.

```java
public interface Validador {
    static boolean validarEmail(String email) {
        return isNotEmpty(email) && email.contains("@");
    }
    
    // private static: acesso apenas interno
    private static boolean isNotEmpty(String str) {
        return str != null && !str.isEmpty();
    }
}

// Uso
boolean valido = Validador.validarEmail("test@example.com");

// ❌ ERRO: private não acessível
// Validador.isNotEmpty("test"); // ERRO
```

---

## Aplicabilidade

**Acesso via nome da interface**:
- **Utilitários** (funções auxiliares)
- **Factory methods** (criação de instâncias)
- **Validadores** (validação de dados)
- **Helpers** (métodos auxiliares)

**Benefícios**:
- **Clareza** (sabe de onde vem o método)
- **Namespace** (organização)
- **Evita conflitos** (múltiplas interfaces com mesmo método)

---

## Armadilhas

### 1. Tentar Acessar via Instância

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

// ❌ ERRO: interface não pode ser instanciada
// Utils utils = new Utils(); // ERRO

// ✅ Via nome da interface
Utils.log("mensagem");
```

### 2. Esperar Herança

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

public class MinhaClasse implements Utils {
    public void testar() {
        // ❌ ERRO: não herdado
        // log("teste"); // ERRO
        
        // ✅ Via nome da interface
        Utils.log("teste");
    }
}
```

### 3. Esquecer Qualificar Fora da Interface

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

public class Teste {
    public void executar() {
        // ❌ ERRO: deve qualificar
        // log("mensagem"); // ERRO
        
        // ✅ Qualificar
        Utils.log("mensagem");
    }
}
```

### 4. Import Static Sem Necessidade

```java
// ⚠️ Import static desnecessário (confuso)
import static pacote.Utils.log;

public class Teste {
    public void executar() {
        log("mensagem"); // De onde vem?
    }
}

// ✅ Qualificar (mais claro)
public class Teste2 {
    public void executar() {
        Utils.log("mensagem"); // Claro
    }
}
```

### 5. Conflito de Import Static

```java
import static pacote.Utils1.log;
import static pacote.Utils2.log; // ERRO: conflito

// ✅ Qualificar
public class Teste {
    public void executar() {
        Utils1.log("mensagem");
        Utils2.log("mensagem");
    }
}
```

### 6. Static via Referência de Instância

```java
// ⚠️ Confuso: static via referência (possível em classes, não interfaces)
public class MinhaClasse {
    public static void metodoStatic() { }
}

MinhaClasse obj = new MinhaClasse();
obj.metodoStatic(); // Confuso (possível mas não recomendado)

// ✅ Via nome da classe
MinhaClasse.metodoStatic();
```

### 7. Private Static Externamente

```java
public interface Validador {
    private static boolean isNotEmpty(String str) {
        return str != null && !str.isEmpty();
    }
}

// ❌ ERRO: private não acessível
// Validador.isNotEmpty("teste"); // ERRO
```

---

## Boas Práticas

### 1. Sempre Qualificar

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

// ✅ Sempre qualificar (claro)
public class Teste {
    public void executar() {
        Utils.log("mensagem");
    }
}
```

### 2. Evitar Import Static Desnecessário

```java
// ❌ Import static desnecessário
import static pacote.Utils.*;

public class Teste {
    public void executar() {
        log("mensagem"); // De onde vem?
    }
}

// ✅ Qualificar
public class Teste2 {
    public void executar() {
        Utils.log("mensagem"); // Claro
    }
}
```

### 3. Import Static para APIs Conhecidas

```java
// ✅ Import static para APIs conhecidas (Math, Collections, etc.)
import static java.lang.Math.*;
import static java.util.Collections.*;

public class Teste {
    public void executar() {
        double raiz = sqrt(16); // Math.sqrt()
        List<String> lista = emptyList(); // Collections.emptyList()
    }
}
```

### 4. Documentar Acesso

```java
public interface Matematica {
    /**
     * Soma dois números.
     * 
     * <p>Acesso: {@code Matematica.somar(a, b)}
     * 
     * @param a primeiro número
     * @param b segundo número
     * @return soma de a e b
     */
    static int somar(int a, int b) {
        return a + b;
    }
}
```

### 5. Naming Convention

```java
// ✅ Naming claro
public interface StringUtils {
    static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }
}

// Uso claro
boolean vazio = StringUtils.isNullOrEmpty("");
```

### 6. Factory Methods

```java
public interface Configuracao {
    String getUrl();
    
    // Factory methods: acesso via nome
    static Configuracao desenvolvimento() {
        return () -> "http://localhost:8080";
    }
    
    static Configuracao producao() {
        return () -> "https://api.producao.com";
    }
}

// Uso claro
Configuracao config = Configuracao.desenvolvimento();
```

### 7. Agrupar Utilitários Relacionados

```java
// ✅ Utilitários relacionados
public interface ValidationUtils {
    static boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }
    
    static boolean isValidCPF(String cpf) {
        return cpf != null && cpf.length() == 11;
    }
    
    static boolean isValidCNPJ(String cnpj) {
        return cnpj != null && cnpj.length() == 14;
    }
}

// Uso
boolean emailValido = ValidationUtils.isValidEmail("test@example.com");
```

### 8. Comparator Helper Methods

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    // Getters
}

// ✅ Helper methods para comparadores
public interface PessoaComparators {
    static Comparator<Pessoa> porNome() {
        return Comparator.comparing(Pessoa::getNome);
    }
    
    static Comparator<Pessoa> porIdade() {
        return Comparator.comparing(Pessoa::getIdade);
    }
}

// Uso claro
List<Pessoa> pessoas = ...;
pessoas.sort(PessoaComparators.porNome());
```

### 9. Dentro da Interface: Opcional

```java
public interface Calculadora {
    static double pi() {
        return 3.14159;
    }
    
    static double areaCirculo(double raio) {
        // Dentro da interface: pode omitir
        return pi() * raio * raio;
        // ou Calculadora.pi() * raio * raio;
    }
}
```

### 10. Private Static para Reutilização

```java
public interface Validador {
    static boolean validarEmail(String email) {
        return isNotEmpty(email) && email.contains("@");
    }
    
    static boolean validarTelefone(String telefone) {
        return isNotEmpty(telefone) && telefone.length() >= 10;
    }
    
    // Private static: reutilização interna
    private static boolean isNotEmpty(String str) {
        return str != null && !str.isEmpty();
    }
}

// Uso: apenas métodos públicos
boolean emailValido = Validador.validarEmail("test@example.com");
```

---

## Resumo

**Acesso**: via **nome da interface**.

```java
public interface Matematica {
    static int somar(int a, int b) {
        return a + b;
    }
}

// Acesso via nome da interface
int resultado = Matematica.somar(5, 3);
```

**Não via instância**:
```java
// ❌ ERRO: interface não pode ser instanciada
// Matematica mat = new Matematica();
```

**Não herdado**:
```java
public class Impl implements Interface {
    public void testar() {
        Interface.metodoStatic(); // Deve qualificar
    }
}
```

**Dentro da interface**: pode omitir.
```java
public interface Calc {
    static double pi() {
        return 3.14;
    }
    
    static double area(double r) {
        return pi() * r * r; // Pode omitir nome
    }
}
```

**Fora da interface**: deve qualificar.
```java
public class Teste {
    public void executar() {
        Calc.pi(); // Deve qualificar
    }
}
```

**Import static**:
```java
import static pacote.Matematica.somar;

int soma = somar(5, 3); // Sem qualificar
```

**Evitar conflitos**:
```java
Utils1.log("mensagem");
Utils2.log("mensagem");
```

**Collections**:
```java
List<String> lista = List.of("A", "B");
Set<Integer> conjunto = Set.of(1, 2);
Map<String, Integer> mapa = Map.of("A", 1);
```

**Comparator**:
```java
nomes.sort(Comparator.naturalOrder());
nomes.sort(Comparator.reverseOrder());
```

**Private static**: acesso apenas interno.
```java
private static void auxiliar() { }
```

**Boas práticas**:
- Sempre qualificar (clareza)
- Evitar import static desnecessário
- Import static para APIs conhecidas (Math, Collections)
- Documentar acesso
- Naming convention claro
- Factory methods
- Agrupar utilitários relacionados
- Helper methods
- Dentro da interface: opcional omitir
- Private static para reutilização

**Armadilhas**:
- ❌ Tentar acessar via instância
- ❌ Esperar herança
- ❌ Esquecer qualificar fora da interface
- ❌ Import static sem necessidade
- ❌ Conflito de import static
- ❌ Static via referência de instância
- ❌ Private static externamente

**Sintaxe**:
```java
NomeDaInterface.metodoStatic(argumentos);
```

**Regra de Ouro**: Acesse métodos **static** via **nome da interface**. **Não via instância** (interface não pode ser instanciada). **Não herdado** por implementações (deve qualificar). Dentro da interface pode **omitir** o nome (opcional). Fora da interface **deve qualificar**. Use **import static** apenas para APIs conhecidas. **Private static** acessível apenas internamente. **Qualificar evita conflitos** entre interfaces com métodos de mesmo nome.
