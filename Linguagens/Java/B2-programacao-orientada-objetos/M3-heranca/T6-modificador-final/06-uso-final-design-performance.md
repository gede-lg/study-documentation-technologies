# T6.06 - Uso de final em Design e Performance

## Introdução

**final** influencia **design** e **performance** (limitadamente).

**Design**: documenta **intenção**, previne **erros**, garante **imutabilidade**.

**Performance**: impacto **mínimo** (JVM moderna otimiza automaticamente).

**Uso principal**: **clareza**, **segurança**, **manutenibilidade**.

```java
// Design: documenta imutabilidade
public final class Usuario {
    private final String id;
    private final String nome;
    
    public Usuario(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }
}
```

```java
// Design: previne sobrescrita acidental
public class Configuracao {
    public final void validar() {
        // Lógica crítica que não pode ser alterada
    }
}
```

---

## Fundamentos

### 1. final Para Imutabilidade

**Classes imutáveis**: thread-safe, mais simples.

```java
public final class Pessoa {
    private final String nome;
    private final int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Apenas getters, sem setters
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}
```

**Vantagens**:
- Thread-safe sem sincronização
- Simplificação de raciocínio
- Sem efeitos colaterais
- Segura para compartilhamento

### 2. final Para Segurança

**Previne alteração** de lógica crítica.

```java
public class Autenticacao {
    public final boolean autenticar(String usuario, String senha) {
        // Lógica de segurança que não pode ser alterada
        return validarUsuario(usuario) && verificarSenha(senha);
    }
}
```

### 3. final Para Documentar Intenção

**Comunica ao desenvolvedor**: "não modifique".

```java
// Variável
public void processar(final int limite) {
    // limite não deve mudar
}

// Método
public final void inicializar() {
    // Não sobrescreva
}

// Classe
public final class Configuracao {
    // Não estenda
}
```

### 4. Performance: Mito vs Realidade

**Mito**: final melhora performance significativamente.

**Realidade**: JIT compiler otimiza automaticamente.

```java
// ❌ Mito: final melhora performance
public final void calcular() {
    // JVM moderna otimiza com ou sem final
}
```

**Pequenas otimizações**:
- Constantes primitivas: **inline** pelo compilador
- Métodos final: **possível inline** (mas JVM faz sem final também)
- Classes final: sem **vtable lookup** (mínimo)

### 5. final em Variáveis Locais

**Previne reatribuição** acidental.

```java
public void processar(List<String> itens) {
    final int tamanho = itens.size();
    
    for (int i = 0; i < tamanho; i++) {
        // tamanho não muda (evita bug)
    }
}
```

### 6. final em Parâmetros

**Effectively final** para lambdas.

```java
public void processar(final String texto) {
    // texto é effectively final
    executar(() -> System.out.println(texto)); // ✅ Funciona
}

public void processar(String texto) {
    texto = texto.toUpperCase(); // Modifica
    executar(() -> System.out.println(texto)); // ❌ Erro
}
```

### 7. final em Collections

**Referência constante**, mas **conteúdo mutável**.

```java
private final List<String> nomes = new ArrayList<>();

public void adicionar(String nome) {
    nomes.add(nome); // ✅ Permitido
}

public void substituir() {
    nomes = new ArrayList<>(); // ❌ Erro
}
```

### 8. Imutabilidade Real

**Combine** final com **coleções imutáveis**.

```java
// ❌ Não é imutável
private final List<String> nomes = new ArrayList<>();

// ✅ Imutável
private final List<String> nomes = List.of("João", "Maria");

// ✅ Defensive copy
public Pessoa(List<String> telefones) {
    this.telefones = Collections.unmodifiableList(new ArrayList<>(telefones));
}
```

### 9. Template Method Pattern

**Estrutura final**, **passos flexíveis**.

```java
public abstract class ProcessadorDados {
    public final void processar() { // Template (final)
        carregar();
        validar();
        processar();
        salvar();
    }
    
    protected abstract void carregar();
    protected abstract void validar();
    protected abstract void processar();
    protected abstract void salvar();
}
```

### 10. Sealed Classes vs final

**final**: sem herança.

**sealed**: herança controlada (Java 17+).

```java
// final: sem herança
public final class Circulo {
    // ...
}

// sealed: herança controlada
public sealed class Forma permits Circulo, Quadrado {
    // ...
}

public final class Circulo extends Forma { }
public final class Quadrado extends Forma { }
```

---

## Aplicabilidade

### Design

**Use final para**:
- **Imutabilidade**: value objects, DTOs
- **Segurança**: lógica crítica
- **Template Method**: estrutura fixa
- **Documentação**: intenção clara
- **Prevenir bugs**: reatribuição acidental

### Performance

**Não use final para**:
- **Otimização**: JVM otimiza automaticamente
- **"Tornar código mais rápido"**: impacto mínimo

**Exceção**: Constantes primitivas (inline garantido).

---

## Armadilhas

### 1. Usar final Para Performance

```java
// ❌ Motivação errada
public final void calcular() {
    // JVM moderna otimiza sem final
}
```

### 2. final em Tudo (Poluição)

```java
// ❌ Excesso de final
public void metodo(final int a, final int b, final int c) {
    final int soma = a + b + c;
    final String mensagem = "Soma: " + soma;
}
```

**Use com moderação**.

### 3. Confundir final com Imutabilidade

```java
// ❌ NÃO é imutável
private final List<String> lista = new ArrayList<>();

// ✅ Imutável
private final List<String> lista = List.of("A", "B");
```

### 4. final em APIs Públicas

**Limita extensibilidade** de bibliotecas.

```java
// ❌ Biblioteca
public final class MinhaClasse {
    // Usuários não podem estender
}

// ✅ Biblioteca
public class MinhaClasse {
    // Flexibilidade para usuários
}
```

### 5. Dificultar Testes

**Mockito** não mocka final sem PowerMock.

```java
// ❌ Dificulta testes
public final class Servico {
    public String buscar() { }
}

// ✅ Interface ou sem final
public interface Servico {
    String buscar();
}
```

### 6. Problemas com Frameworks

**Hibernate**, **Spring AOP** criam proxies via herança.

```java
// ❌ Hibernate não consegue
@Entity
public final class Usuario { }

// ✅ Sem final
@Entity
public class Usuario { }
```

---

## Boas Práticas

### 1. final Para Imutabilidade

```java
public final class Dinheiro {
    private final BigDecimal valor;
    private final String moeda;
    
    public Dinheiro(BigDecimal valor, String moeda) {
        this.valor = valor;
        this.moeda = moeda;
    }
    
    public Dinheiro adicionar(Dinheiro outro) {
        return new Dinheiro(valor.add(outro.valor), moeda);
    }
}
```

### 2. final em Constantes

```java
public static final double PI = 3.14159265359;
public static final int MAX_TENTATIVAS = 3;
```

### 3. Template Method Pattern

```java
public abstract class RelatorioGenerator {
    public final void gerar() {
        carregar();
        processar();
        salvar();
    }
    
    protected abstract void carregar();
    protected abstract void processar();
    protected abstract void salvar();
}
```

### 4. Effectively Final Para Lambdas

```java
public void processar(String texto) {
    // texto é effectively final
    lista.forEach(item -> System.out.println(texto + item));
}
```

### 5. Defensive Copying

```java
public class Pessoa {
    private final List<String> telefones;
    
    public Pessoa(List<String> telefones) {
        this.telefones = new ArrayList<>(telefones);
    }
    
    public List<String> getTelefones() {
        return Collections.unmodifiableList(telefones);
    }
}
```

### 6. Documente Razão do final

```java
/**
 * Classe final para garantir imutabilidade e thread-safety.
 */
public final class Usuario { }

/**
 * Método final para prevenir alteração de lógica de segurança.
 */
public final void autenticar() { }
```

### 7. Não Use final Por Padrão

**Use** quando há **razão clara** (design, não performance).

### 8. Considere Sealed Classes

**Java 17+**: controle de hierarquia.

```java
public sealed class Resultado permits Sucesso, Erro {
    // ...
}

public final class Sucesso extends Resultado { }
public final class Erro extends Resultado { }
```

### 9. Combine com Records (Java 14+)

```java
// Record é implicitamente final e imutável
public record Pessoa(String nome, int idade) { }
```

### 10. Prefira Composição a Herança

```java
// ❌ Herança (limita final)
public class MeuServico extends ServicoBase {
    // ...
}

// ✅ Composição (ServicoBase pode ser final)
public class MeuServico {
    private final ServicoBase servico;
    
    public MeuServico(ServicoBase servico) {
        this.servico = servico;
    }
}
```

---

## Resumo

**Design: Imutabilidade**:
```java
public final class Pessoa {
    private final String nome;
    private final int idade;
    
    // Apenas getters
}
```

**Design: Segurança**:
```java
public final void autenticar() {
    // Lógica crítica que não pode ser alterada
}
```

**Design: Template Method**:
```java
public final void processar() {
    passo1();
    passo2();
    passo3();
}

protected abstract void passo1();
protected abstract void passo2();
protected abstract void passo3();
```

**Performance: Mito**:
```java
// JVM moderna otimiza sem final
public void metodo() { }
```

**Performance: Realidade**:
```java
// Constantes: inline garantido
public static final int MAX = 100;
```

**Effectively final**:
```java
String texto = "Java";
lista.forEach(item -> System.out.println(texto + item));
```

**Imutabilidade real**:
```java
private final List<String> nomes = List.of("João", "Maria");
```

**Defensive copying**:
```java
public Pessoa(List<String> telefones) {
    this.telefones = new ArrayList<>(telefones);
}

public List<String> getTelefones() {
    return Collections.unmodifiableList(telefones);
}
```

**Sealed classes (Java 17+)**:
```java
public sealed class Forma permits Circulo, Quadrado { }

public final class Circulo extends Forma { }
public final class Quadrado extends Forma { }
```

**Records (Java 14+)**:
```java
// Implicitamente final e imutável
public record Pessoa(String nome, int idade) { }
```

**Quando usar final**:
- ✅ **Imutabilidade** (value objects)
- ✅ **Segurança** (lógica crítica)
- ✅ **Documentar intenção**
- ✅ **Template Method**
- ✅ **Constantes**
- ❌ **Performance** (mito)
- ❌ **Por padrão** (poluição)

**Quando evitar final**:
- APIs públicas (bibliotecas)
- Código testável (mocking)
- Frameworks (proxies)

**Regra de Ouro**: Use **final** para **design** (imutabilidade, segurança, clareza), **não para performance**. **Não use por padrão**. **Documente** razão do final. Considere **impacto** em extensibilidade e testes.
