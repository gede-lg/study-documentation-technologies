# T7.01 - Interfaces Sem Métodos

## Introdução

**Interface Marker** (Marcadora): interface **sem métodos**.

```java
// Interface Marker: sem métodos
public interface Serializable {
    // Vazia
}

public interface Cloneable {
    // Vazia
}

// Classe implementa interface marker
public class Usuario implements Serializable {
    private String nome;
    private int idade;
    
    // Não precisa implementar métodos (interface vazia)
}
```

**Objetivo**: **marcar** classes com uma **capacidade** ou **propriedade**.

**Termo**: Marker Interface, Tagging Interface.

---

## Fundamentos

### 1. Definição de Interface Marker

**Interface Marker**: interface sem membros (métodos, constantes).

```java
// ✅ Interface Marker: vazia
public interface Marker {
}

// ⚠️ Não é Marker: tem constante
public interface NaoMarker1 {
    String CONSTANTE = "valor";
}

// ⚠️ Não é Marker: tem método
public interface NaoMarker2 {
    void metodo();
}

// ⚠️ Não é Marker: tem método default
public interface NaoMarker3 {
    default void metodo() { }
}
```

### 2. Serializable

**Serializable**: marca classes que podem ser serializadas.

```java
import java.io.*;

// Marca classe como serializável
public class Usuario implements Serializable {
    private String nome;
    private int idade;
    
    // Construtores, getters, setters
}

// Serialização
Usuario usuario = new Usuario("João", 30);

// Salvar em arquivo
try (ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("usuario.ser"))) {
    oos.writeObject(usuario);
}

// Carregar de arquivo
try (ObjectInputStream ois = new ObjectInputStream(
        new FileInputStream("usuario.ser"))) {
    Usuario carregado = (Usuario) ois.readObject();
    System.out.println(carregado.getNome()); // João
}
```

### 3. Cloneable

**Cloneable**: marca classes que podem ser clonadas.

```java
public class Produto implements Cloneable {
    private String nome;
    private double preco;
    
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    @Override
    public Produto clone() {
        try {
            return (Produto) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError("Erro ao clonar", e);
        }
    }
}

// Uso
Produto original = new Produto("Notebook", 3000);
Produto copia = original.clone();

System.out.println(original == copia); // false (objetos diferentes)
System.out.println(original.getNome().equals(copia.getNome())); // true
```

### 4. Verificação com instanceof

**instanceof**: verificar se implementa marker.

```java
public interface Auditavel {
    // Marker: sem métodos
}

public class Usuario implements Auditavel {
    private String nome;
}

// Verificação
Object obj = new Usuario("João");

if (obj instanceof Auditavel) {
    System.out.println("Objeto é auditável");
    // Lógica de auditoria
}

// Verificação antes de serializar
if (obj instanceof Serializable) {
    // Pode serializar
}
```

### 5. Herança de Marker

**Herança**: subclasse herda marker.

```java
public interface Persistente {
    // Marker
}

public class Entidade implements Persistente {
    private Long id;
}

// Herança: Usuario também é Persistente
public class Usuario extends Entidade {
    private String nome;
}

// Verificação
Usuario usuario = new Usuario();
System.out.println(usuario instanceof Persistente); // true
```

### 6. Múltiplas Markers

**Múltiplas markers**: classe pode implementar várias.

```java
public interface Auditavel { }
public interface Versionavel { }
public interface Exportavel { }

// Múltiplas markers
public class Documento implements Serializable, Auditavel, 
                                  Versionavel, Exportavel {
    private String conteudo;
    private int versao;
}

// Verificações
Documento doc = new Documento();
if (doc instanceof Auditavel) { /* ... */ }
if (doc instanceof Versionavel) { /* ... */ }
if (doc instanceof Exportavel) { /* ... */ }
```

### 7. Marker com Herança de Interface

**Interface marker** pode estender outra.

```java
public interface Entidade { }

// Marker estende marker
public interface EntidadeAuditavel extends Entidade {
    // Vazia (marker)
}

public class Usuario implements EntidadeAuditavel {
    // É Entidade e EntidadeAuditavel
}

// Verificação
Usuario u = new Usuario();
System.out.println(u instanceof Entidade); // true
System.out.println(u instanceof EntidadeAuditavel); // true
```

### 8. Sem Implementação Obrigatória

**Interface Marker**: sem métodos para implementar.

```java
public interface Rastreavel {
    // Vazia
}

// Implementação: não precisa fazer nada
public class Pedido implements Rastreavel {
    private String numero;
    
    // Sem métodos obrigatórios
}
```

### 9. Verificação em Runtime

**Runtime**: verificação com instanceof ou reflection.

```java
public interface Cacheavel { }

public class Produto implements Cacheavel {
    private String nome;
}

// Verificação em runtime
public <T> void processar(T objeto) {
    if (objeto instanceof Cacheavel) {
        System.out.println("Objeto pode ser cacheado");
        // Adicionar ao cache
    } else {
        System.out.println("Objeto não cacheável");
    }
}

processar(new Produto()); // Objeto pode ser cacheado
processar("String"); // Objeto não cacheável
```

### 10. Reflection com Markers

**Reflection**: verificar marker em runtime.

```java
public interface Validavel { }

public class Usuario implements Validavel {
    private String nome;
}

// Verificação com reflection
public void processar(Object obj) {
    Class<?> classe = obj.getClass();
    
    if (Validavel.class.isAssignableFrom(classe)) {
        System.out.println("Objeto validável");
    }
    
    // Ou verificar todas as interfaces
    for (Class<?> iface : classe.getInterfaces()) {
        if (iface == Validavel.class) {
            System.out.println("Implementa Validavel");
        }
    }
}
```

---

## Aplicabilidade

**Interfaces Marker**:
- **Marcar capacidades** (Serializable, Cloneable)
- **Indicar propriedades** (Auditavel, Versionavel)
- **Metadados de tipos** (tipo possui característica)
- **Verificação em runtime** (instanceof)

**Quando usar**:
- Marcar tipos com capacidade
- Verificação em runtime necessária
- Sem comportamento específico

**Quando NÃO usar**:
- Annotations são alternativa moderna
- Necessita de comportamento (use métodos default)

---

## Armadilhas

### 1. Esquecer Implementar Marker

```java
public class Usuario {
    private String nome;
}

// ❌ ERRO: sem Serializable
try {
    ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("usuario.ser"));
    oos.writeObject(new Usuario()); // NotSerializableException
} catch (Exception e) {
    e.printStackTrace();
}

// ✅ Com Serializable
public class Usuario implements Serializable {
    private String nome;
}
```

### 2. Cloneable sem clone()

```java
// ⚠️ Cloneable sem sobrescrever clone()
public class Produto implements Cloneable {
    private String nome;
    
    // Não sobrescreve clone() (erro em runtime)
}

// ❌ ERRO: CloneNotSupportedException
// Produto p = new Produto();
// p.clone(); // ERRO: clone() protected em Object

// ✅ Sobrescrever clone()
public class Produto implements Cloneable {
    private String nome;
    
    @Override
    public Produto clone() {
        try {
            return (Produto) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}
```

### 3. Serializable e Campos Transient

```java
public class Usuario implements Serializable {
    private String nome;
    private transient String senha; // Não serializado
}

// ⚠️ senha será null após desserialização
Usuario u = new Usuario("João", "123456");
// Serializar e desserializar
// u.getSenha() == null (transient não serializado)
```

### 4. Marker vs Annotation

```java
// ⚠️ Marker: verificação em runtime
public interface Validavel { }

public class Usuario implements Validavel { }

if (usuario instanceof Validavel) { }

// ✅ Annotation: mais flexível (metadados)
@Retention(RetentionPolicy.RUNTIME)
public @interface Validavel { }

@Validavel
public class Usuario { }

if (Usuario.class.isAnnotationPresent(Validavel.class)) { }
```

### 5. Marker Vazia Mesmo

```java
// ⚠️ Não é marker: tem constante
public interface NaoMarker {
    String VALOR = "constante";
}

// ⚠️ Não é marker: tem método default
public interface NaoMarker2 {
    default void metodo() { }
}

// ✅ Marker: completamente vazia
public interface Marker {
}
```

### 6. SerialVersionUID

```java
// ⚠️ Sem serialVersionUID (gerado automaticamente)
public class Usuario implements Serializable {
    private String nome;
}

// ✅ Com serialVersionUID (compatibilidade)
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String nome;
}
```

### 7. Herança e Serializable

```java
// Superclasse não serializável
public class Pessoa {
    private String nome;
}

// Subclasse serializável
public class Usuario extends Pessoa implements Serializable {
    private int idade;
}

// ⚠️ Campos de Pessoa não serializados
// (a menos que Pessoa tenha construtor padrão)
```

---

## Boas Práticas

### 1. Naming Descritivo

```java
// ✅ Nome descritivo
public interface Auditavel { }
public interface Versionavel { }
public interface Exportavel { }
public interface Importavel { }
```

### 2. JavaDoc Explicativo

```java
/**
 * Interface marker que indica que objetos podem ser auditados.
 * 
 * <p>Classes que implementam esta interface serão automaticamente
 * incluídas no sistema de auditoria.
 * 
 * @since 1.0
 */
public interface Auditavel {
}
```

### 3. serialVersionUID em Serializable

```java
// ✅ Sempre definir serialVersionUID
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String nome;
    private int idade;
}
```

### 4. Sobrescrever clone() em Cloneable

```java
// ✅ Sempre sobrescrever clone()
public class Produto implements Cloneable {
    private String nome;
    
    @Override
    public Produto clone() {
        try {
            return (Produto) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}
```

### 5. Verificação com instanceof

```java
// ✅ instanceof para verificação
public void processar(Object obj) {
    if (obj instanceof Auditavel) {
        // Lógica de auditoria
    }
    
    if (obj instanceof Serializable) {
        // Pode serializar
    }
}
```

### 6. Markers para Frameworks

```java
// ✅ Markers para frameworks (ORM, serialização)
public interface Entidade { }
public interface Persistente { }

public class Usuario implements Entidade, Persistente {
    private Long id;
    private String nome;
}

// Framework verifica markers
public class Framework {
    public void salvar(Object obj) {
        if (obj instanceof Persistente) {
            // Salvar no banco
        }
    }
}
```

### 7. Considerar Annotations

```java
// ⚠️ Marker: limitado
public interface Auditavel { }

// ✅ Annotation: mais flexível (com metadados)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditavel {
    String usuario() default "";
    String[] campos() default {};
}

@Auditavel(usuario = "admin", campos = {"nome", "email"})
public class Usuario { }
```

### 8. Evitar Markers Desnecessários

```java
// ❌ Evitar: marker sem propósito
public interface MinhaMarker { }

// ✅ Marker com propósito claro
public interface Exportavel { }

public void exportar(Object obj) {
    if (obj instanceof Exportavel) {
        // Exportar para arquivo
    }
}
```

### 9. Markers em Hierarquias

```java
// ✅ Marker em interface base
public interface Entidade extends Serializable {
    Long getId();
}

// Todas as entidades são serializáveis
public class Usuario implements Entidade {
    private Long id;
    private String nome;
    
    @Override
    public Long getId() {
        return id;
    }
}
```

### 10. Deep Clone em Cloneable

```java
// ✅ Deep clone quando necessário
public class Pedido implements Cloneable {
    private String numero;
    private List<Item> itens;
    
    @Override
    public Pedido clone() {
        try {
            Pedido clone = (Pedido) super.clone();
            // Deep clone da lista
            clone.itens = new ArrayList<>();
            for (Item item : this.itens) {
                clone.itens.add(item.clone());
            }
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}
```

---

## Resumo

**Interface Marker**: interface **sem métodos**.

```java
public interface Marker {
    // Vazia
}

public class MinhaClasse implements Marker {
    // Sem métodos obrigatórios
}
```

**Objetivo**: **marcar** classes com capacidade/propriedade.

**Exemplos clássicos**:
- **Serializable**: pode ser serializado
- **Cloneable**: pode ser clonado
- **Remote**: objeto remoto (RMI)

**Serializable**:
```java
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    private String nome;
}
```

**Cloneable**:
```java
public class Produto implements Cloneable {
    @Override
    public Produto clone() {
        try {
            return (Produto) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}
```

**Verificação**:
```java
if (obj instanceof Marker) {
    // Objeto tem a capacidade/propriedade
}
```

**Herança**: subclasse herda marker.
```java
public class Base implements Marker { }
public class Filha extends Base { }

Filha f = new Filha();
System.out.println(f instanceof Marker); // true
```

**Múltiplas markers**:
```java
public class Classe implements Marker1, Marker2, Marker3 {
}
```

**Reflection**:
```java
if (Marker.class.isAssignableFrom(classe)) {
    // Implementa Marker
}
```

**Boas práticas**:
- Naming descritivo (Auditavel, Versionavel)
- JavaDoc explicativo
- serialVersionUID em Serializable
- Sobrescrever clone() em Cloneable
- Verificação com instanceof
- Markers para frameworks
- Considerar annotations (mais flexíveis)
- Evitar markers desnecessários
- Markers em hierarquias
- Deep clone quando necessário

**Armadilhas**:
- ❌ Esquecer implementar marker (NotSerializableException)
- ❌ Cloneable sem clone()
- ❌ Serializable e transient
- ❌ Marker vs Annotation
- ❌ Marker não vazia (constante/método)
- ❌ SerialVersionUID
- ❌ Herança e Serializable

**Marker vs Annotation**:

| Aspecto | Marker | Annotation |
|---------|--------|------------|
| **Definição** | Interface vazia | @interface |
| **Herança** | Sim (implements) | Não |
| **Metadados** | Não | Sim |
| **Flexibilidade** | Limitada | Alta |
| **Runtime** | instanceof | isAnnotationPresent() |

**Regra de Ouro**: **Interface Marker** é uma interface **completamente vazia** (sem métodos, constantes, default, static). Serve para **marcar** classes com uma **capacidade** ou **propriedade**. Verificada em **runtime** com **instanceof**. Exemplos clássicos: **Serializable**, **Cloneable**, **Remote**. **Annotations** são alternativa **moderna** (mais flexíveis, com metadados). Use markers quando precisa de **herança** ou **verificação simples**. Use annotations quando precisa de **metadados**.
