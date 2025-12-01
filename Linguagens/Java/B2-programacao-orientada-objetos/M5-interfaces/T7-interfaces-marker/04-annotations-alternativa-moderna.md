# T7.04 - Annotations como Alternativa Moderna

## Introdução

**Annotations**: alternativa moderna a markers.

```java
// Marker interface (tradicional)
public interface Auditavel { }

public class Usuario implements Auditavel {
    private String nome;
}

// ✅ Annotation (moderno)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditavel { }

@Auditavel
public class Usuario {
    private String nome;
}
```

**Annotations**: mais flexíveis que markers.

---

## Fundamentos

### 1. Marker vs Annotation

**Diferenças**:

```java
// MARKER INTERFACE
public interface Exportavel { }

public class Produto implements Exportavel {
    private String nome;
}

// Verificação
if (produto instanceof Exportavel) {
    // exportar
}

// ANNOTATION
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Exportavel { }

@Exportavel
public class Produto {
    private String nome;
}

// Verificação
if (Produto.class.isAnnotationPresent(Exportavel.class)) {
    // exportar
}
```

**Comparação**:

| Aspecto | Marker Interface | Annotation |
|---------|-----------------|------------|
| Herança | ✅ Sim (implements) | ❌ Não |
| Metadados | ❌ Não | ✅ Sim (atributos) |
| Reflection | ✅ isAssignableFrom() | ✅ isAnnotationPresent() |
| instanceof | ✅ Funciona | ❌ Não funciona |
| Flexibilidade | ❌ Limitado | ✅ Alto (atributos) |
| Múltiplas | ✅ Sim (múltiplas interfaces) | ✅ Sim (múltiplas annotations) |
| Retrocompatibilidade | ❌ Difícil | ✅ Fácil |

### 2. Annotation com Metadados

**Metadados**: informações adicionais.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Exportavel {
    String formato() default "CSV";
    boolean compactado() default false;
}

@Exportavel(formato = "EXCEL", compactado = true)
public class Produto {
    private String nome;
    private double preco;
}

// Leitura de metadados
Exportavel exp = Produto.class.getAnnotation(Exportavel.class);
System.out.println("Formato: " + exp.formato()); // EXCEL
System.out.println("Compactado: " + exp.compactado()); // true
```

### 3. Annotation em Métodos

**Target**: onde aplicar annotation.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Validar { }

public class Usuario {
    private String nome;
    
    @Validar
    public void setNome(String nome) {
        this.nome = nome;
    }
}

// Processar métodos anotados
for (Method method : Usuario.class.getDeclaredMethods()) {
    if (method.isAnnotationPresent(Validar.class)) {
        System.out.println("Validar: " + method.getName());
    }
}
```

### 4. Annotation em Campos

**Target.FIELD**: annotation em campos.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Obrigatorio { }

public class Usuario {
    @Obrigatorio
    private String nome;
    
    private String email;
}

// Validação
for (Field field : Usuario.class.getDeclaredFields()) {
    if (field.isAnnotationPresent(Obrigatorio.class)) {
        field.setAccessible(true);
        Object valor = field.get(usuario);
        if (valor == null) {
            throw new IllegalStateException(
                "Campo obrigatório: " + field.getName()
            );
        }
    }
}
```

### 5. Múltiplos Targets

**Multiple targets**: annotation em vários locais.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface Auditavel { }

@Auditavel // Em classe
public class Usuario {
    
    @Auditavel // Em método
    public void alterar() { }
}
```

### 6. Annotation com Arrays

**Array**: múltiplos valores.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Permissoes {
    String[] value();
}

@Permissoes({"LEITURA", "ESCRITA", "EXCLUSAO"})
public class Usuario {
    private String nome;
}

// Leitura
Permissoes perms = Usuario.class.getAnnotation(Permissoes.class);
for (String perm : perms.value()) {
    System.out.println("Permissão: " + perm);
}
```

### 7. Annotation Aninhadas

**Annotations compostas**:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Validacao {
    int min() default 0;
    int max() default Integer.MAX_VALUE;
    String mensagem() default "Valor inválido";
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Validacoes {
    Validacao[] value();
}

public class Usuario {
    @Validacao(min = 3, max = 50, mensagem = "Nome inválido")
    private String nome;
    
    @Validacao(min = 18, max = 120, mensagem = "Idade inválida")
    private int idade;
}
```

### 8. Annotation como Marker

**Marker annotation**: sem atributos.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Singleton { }

@Singleton
public class ConfigManager {
    private static ConfigManager instance;
    
    private ConfigManager() { }
    
    public static ConfigManager getInstance() {
        if (instance == null) {
            instance = new ConfigManager();
        }
        return instance;
    }
}

// Processador
if (ConfigManager.class.isAnnotationPresent(Singleton.class)) {
    System.out.println("ConfigManager é singleton");
}
```

### 9. Retention Policy

**Retention**: quando annotation está disponível.

```java
// SOURCE: descartada após compilação
@Retention(RetentionPolicy.SOURCE)
@Target(ElementType.METHOD)
public @interface DeprecatedCustom { }

// CLASS: em bytecode, mas não em runtime
@Retention(RetentionPolicy.CLASS)
@Target(ElementType.TYPE)
public @interface Compilador { }

// RUNTIME: disponível em runtime (reflection)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditavel { }
```

### 10. Meta-Annotations

**Meta-annotations**: annotations em annotations.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Framework { }

@Framework
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Componente { }

@Componente
public class MinhaClasse { }

// Verificar meta-annotation
Componente comp = MinhaClasse.class.getAnnotation(Componente.class);
Framework fw = comp.annotationType().getAnnotation(Framework.class);
if (fw != null) {
    System.out.println("É componente de framework");
}
```

---

## Aplicabilidade

**Quando usar Annotations**:
- Metadados necessários
- Flexibilidade alta
- Retrocompatibilidade
- Configuração declarativa
- Frameworks (Spring, JPA, etc.)

**Quando usar Markers**:
- Simples indicação
- Herança necessária
- instanceof importante
- API legada
- Performance crítica

---

## Armadilhas

### 1. Esquecer Retention

```java
// ❌ ERRO: sem @Retention (padrão CLASS)
@Target(ElementType.TYPE)
public @interface Auditavel { }

@Auditavel
public class Usuario { }

// Reflection não funciona (não disponível em runtime)
Usuario.class.isAnnotationPresent(Auditavel.class); // false

// ✅ Com RUNTIME
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditavel { }
```

### 2. Target Incorreto

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Validar { }

// ❌ ERRO: annotation em classe (target é METHOD)
// @Validar
// public class Usuario { }

// ✅ Annotation em método
public class Usuario {
    @Validar
    public void validar() { }
}
```

### 3. Atributo sem Default

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Exportavel {
    String formato(); // Sem default
}

// ❌ ERRO: falta atributo
// @Exportavel
// public class Produto { }

// ✅ Com atributo
@Exportavel(formato = "CSV")
public class Produto { }
```

### 4. Reflection sem Verificação

```java
// ❌ NullPointerException se não tiver annotation
Exportavel exp = Produto.class.getAnnotation(Exportavel.class);
System.out.println(exp.formato()); // NPE se não anotado

// ✅ Verificar antes
if (Produto.class.isAnnotationPresent(Exportavel.class)) {
    Exportavel exp = Produto.class.getAnnotation(Exportavel.class);
    System.out.println(exp.formato());
}
```

### 5. instanceof com Annotation

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditavel { }

@Auditavel
public class Usuario { }

// ❌ instanceof não funciona com annotation
// if (usuario instanceof Auditavel) { } // ERRO

// ✅ isAnnotationPresent
if (Usuario.class.isAnnotationPresent(Auditavel.class)) {
    // processar
}
```

### 6. Herança de Annotation

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditavel { }

@Auditavel
public class Pessoa { }

// ⚠️ Subclasse NÃO herda annotation (por padrão)
public class Usuario extends Pessoa { }

Usuario.class.isAnnotationPresent(Auditavel.class); // false

// ✅ @Inherited para herança
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface Auditavel { }
```

### 7. Annotation em Interface

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditavel { }

@Auditavel
public interface Entidade { }

// ⚠️ Implementação NÃO herda annotation
public class Usuario implements Entidade { }

Usuario.class.isAnnotationPresent(Auditavel.class); // false
```

---

## Boas Práticas

### 1. RUNTIME para Reflection

```java
// ✅ Sempre RUNTIME para processar em runtime
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditavel { }
```

### 2. Default para Atributos

```java
// ✅ Fornecer defaults para facilitar uso
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Exportavel {
    String formato() default "CSV";
    boolean compactado() default false;
}

// Uso simples
@Exportavel
public class Produto { }

// Uso customizado
@Exportavel(formato = "EXCEL", compactado = true)
public class Cliente { }
```

### 3. value() para Atributo Principal

```java
// ✅ value() para atributo principal
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Permissoes {
    String[] value();
}

// Uso simplificado
@Permissoes({"LEITURA", "ESCRITA"})
public class Usuario { }
```

### 4. Documented para Javadoc

```java
// ✅ @Documented para incluir em Javadoc
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
public @interface Auditavel { }
```

### 5. Inherited para Herança

```java
// ✅ @Inherited para herança
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface Auditavel { }

@Auditavel
public class Pessoa { }

// Subclasse herda
public class Usuario extends Pessoa { }

Usuario.class.isAnnotationPresent(Auditavel.class); // true
```

### 6. Validação de Atributos

```java
// ✅ Validar atributos
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Cache {
    int ttl() default 60;
    String unidade() default "SEGUNDOS";
}

// Validação
Cache cache = MinhaClasse.class.getAnnotation(Cache.class);
if (cache.ttl() < 0) {
    throw new IllegalArgumentException("TTL inválido");
}
```

### 7. Enum em Annotations

```java
// ✅ Enum para valores fixos
public enum Formato {
    CSV, JSON, XML, EXCEL
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Exportavel {
    Formato formato() default Formato.CSV;
}

@Exportavel(formato = Formato.EXCEL)
public class Produto { }
```

### 8. Combinar com Marker

```java
// ✅ Annotation + Marker para compatibilidade
public interface Auditavel { }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface AuditavelConfig {
    String responsavel() default "";
}

@AuditavelConfig(responsavel = "Sistema")
public class Usuario implements Auditavel {
    // instanceof funciona
    // Annotation fornece metadados
}
```

### 9. Processador de Annotation

```java
// ✅ Criar processador centralizado
public class ProcessadorAuditoria {
    public static void processar(Object obj) {
        Class<?> classe = obj.getClass();
        
        if (classe.isAnnotationPresent(Auditavel.class)) {
            Auditavel aud = classe.getAnnotation(Auditavel.class);
            System.out.println("Auditando: " + classe.getName());
            
            // Processar métodos
            for (Method method : classe.getDeclaredMethods()) {
                if (method.isAnnotationPresent(Auditavel.class)) {
                    System.out.println("  Método: " + method.getName());
                }
            }
        }
    }
}
```

### 10. Documentar Annotations

```java
/**
 * Marca classes que devem ser auditadas.
 * 
 * <p>Classes anotadas com {@code @Auditavel} terão
 * todas as operações registradas no log de auditoria.
 * 
 * <p>Exemplo:
 * <pre>
 * &#64;Auditavel
 * public class Usuario {
 *     // ...
 * }
 * </pre>
 * 
 * @see ProcessadorAuditoria
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
public @interface Auditavel { }
```

---

## Resumo

**Annotation**: alternativa moderna a marker.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditavel { }

@Auditavel
public class Usuario { }
```

**Marker vs Annotation**:
- Marker: herança, instanceof
- Annotation: metadados, flexibilidade

**Metadados**:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Exportavel {
    String formato() default "CSV";
}

@Exportavel(formato = "EXCEL")
public class Produto { }
```

**Multiple targets**:

```java
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface Auditavel { }
```

**Retention Policy**:
- SOURCE: descartada após compilação
- CLASS: em bytecode (padrão)
- RUNTIME: disponível em runtime

**Meta-annotations**:
- @Retention: quando disponível
- @Target: onde aplicar
- @Documented: incluir em Javadoc
- @Inherited: herança

**Verificação**:

```java
if (classe.isAnnotationPresent(Auditavel.class)) {
    Auditavel aud = classe.getAnnotation(Auditavel.class);
}
```

**Boas práticas**:
- RUNTIME para reflection
- Default para atributos
- value() para atributo principal
- @Documented para Javadoc
- @Inherited para herança
- Validação de atributos
- Enum em annotations
- Combinar com marker
- Processador centralizado
- Documentar annotations

**Armadilhas**:
- ❌ Esquecer @Retention(RUNTIME)
- ❌ Target incorreto
- ❌ Atributo sem default
- ❌ Reflection sem verificação
- ❌ instanceof com annotation
- ❌ Herança sem @Inherited
- ❌ Annotation em interface

**Quando usar**:
- Annotations: metadados, flexibilidade
- Markers: herança, instanceof

**Regra de Ouro**: **Annotations** são a **alternativa moderna** a **marker interfaces**. Fornecem **metadados** (atributos) e maior **flexibilidade**. Use **@Retention(RUNTIME)** para processar em runtime. Use **@Target** para definir onde aplicar. Use **@Inherited** para herança. Annotations **NÃO funcionam** com **instanceof** (use **isAnnotationPresent()**). Forneça **defaults** para atributos opcionais. Use **value()** para atributo principal. **Combine** com marker interfaces quando necessário (herança + metadados). **Documente** annotations com JavaDoc. Considere **processadores centralizados** para lógica de annotation. Annotations são ideais para **frameworks** (Spring, JPA) e **configuração declarativa**.
