# T7.02 - Indicação de Capacidade ou Propriedade

## Introdução

**Interface Marker**: indica que classe possui uma **capacidade** ou **propriedade**.

```java
// Capacidade: pode ser serializado
public interface Serializable { }

public class Usuario implements Serializable {
    private String nome;
    // Classe TEM a capacidade de ser serializada
}

// Propriedade: é auditável
public interface Auditavel { }

public class Pedido implements Auditavel {
    private String numero;
    // Classe TEM a propriedade de ser auditável
}
```

**Capacidade**: classe **pode fazer** algo (serializar, clonar).
**Propriedade**: classe **é** algo (auditável, versionável).

**Verificação**: em **runtime** com instanceof.

---

## Fundamentos

### 1. Capacidade: Pode Fazer

**Capacidade**: classe **pode** realizar uma ação.

```java
// Capacidade: pode ser serializado
public interface Serializable { }

// Capacidade: pode ser clonado
public interface Cloneable { }

// Capacidade: pode ser exportado
public interface Exportavel { }

// Capacidade: pode ser importado
public interface Importavel { }

// Uso
public class Produto implements Serializable, Cloneable, 
                                Exportavel, Importavel {
    private String nome;
    private double preco;
    
    // Produto PODE:
    // - Ser serializado
    // - Ser clonado
    // - Ser exportado
    // - Ser importado
}
```

### 2. Propriedade: É Algo

**Propriedade**: classe **é** ou **tem** uma característica.

```java
// Propriedade: é auditável
public interface Auditavel { }

// Propriedade: é versionável
public interface Versionavel { }

// Propriedade: é rastreável
public interface Rastreavel { }

// Propriedade: é deletável (soft delete)
public interface Deletavel { }

// Uso
public class Documento implements Auditavel, Versionavel, 
                                   Rastreavel, Deletavel {
    private String conteudo;
    private int versao;
    private boolean deletado;
    
    // Documento É:
    // - Auditável (registra alterações)
    // - Versionável (tem versões)
    // - Rastreável (pode ser rastreado)
    // - Deletável (soft delete)
}
```

### 3. Verificação de Capacidade

**Verificação**: usar instanceof.

```java
public interface Exportavel { }

public class Relatorio implements Exportavel {
    private String dados;
}

// Verificação de capacidade
public void processar(Object obj) {
    if (obj instanceof Exportavel) {
        System.out.println("Objeto PODE ser exportado");
        exportar(obj);
    } else {
        System.out.println("Objeto NÃO pode ser exportado");
    }
}

private void exportar(Object obj) {
    // Lógica de exportação
    System.out.println("Exportando: " + obj);
}
```

### 4. Verificação de Propriedade

**Verificação**: usar instanceof.

```java
public interface Auditavel { }

public class Usuario implements Auditavel {
    private String nome;
}

// Verificação de propriedade
public void salvar(Object obj) {
    // Salvar objeto
    
    if (obj instanceof Auditavel) {
        System.out.println("Objeto É auditável");
        registrarAuditoria(obj);
    }
}

private void registrarAuditoria(Object obj) {
    // Registrar log de auditoria
    System.out.println("Auditoria: salvando " + obj);
}
```

### 5. Framework Detecta Capacidade

**Framework**: detecta capacidade em runtime.

```java
public interface Cacheavel { }

public class Produto implements Cacheavel {
    private String nome;
}

// Framework de cache
public class CacheManager {
    private Map<String, Object> cache = new HashMap<>();
    
    public void adicionar(String chave, Object obj) {
        if (obj instanceof Cacheavel) {
            cache.put(chave, obj);
            System.out.println("Objeto adicionado ao cache");
        } else {
            System.out.println("Objeto NÃO é cacheável");
        }
    }
}

// Uso
CacheManager cache = new CacheManager();
cache.adicionar("produto1", new Produto()); // Adicionado
cache.adicionar("string", "teste"); // NÃO é cacheável
```

### 6. Framework Detecta Propriedade

**Framework**: detecta propriedade em runtime.

```java
public interface Persistente { }

public class Usuario implements Persistente {
    private Long id;
    private String nome;
}

// Framework de persistência
public class PersistenceManager {
    public void salvar(Object obj) {
        if (obj instanceof Persistente) {
            System.out.println("Objeto É persistente");
            // Salvar no banco de dados
            salvarNoBanco(obj);
        } else {
            throw new IllegalArgumentException(
                "Objeto não é persistente"
            );
        }
    }
    
    private void salvarNoBanco(Object obj) {
        System.out.println("Salvando no banco: " + obj);
    }
}
```

### 7. Múltiplas Capacidades

**Classe** pode ter **múltiplas capacidades**.

```java
public interface Serializable { }
public interface Cloneable { }
public interface Exportavel { }

public class Produto implements Serializable, Cloneable, Exportavel {
    private String nome;
    
    // Produto PODE:
    // - Ser serializado
    // - Ser clonado
    // - Ser exportado
}

// Verificações
Produto p = new Produto();
System.out.println(p instanceof Serializable); // true
System.out.println(p instanceof Cloneable); // true
System.out.println(p instanceof Exportavel); // true
```

### 8. Múltiplas Propriedades

**Classe** pode ter **múltiplas propriedades**.

```java
public interface Auditavel { }
public interface Versionavel { }
public interface Rastreavel { }

public class Documento implements Auditavel, Versionavel, Rastreavel {
    private String conteudo;
    
    // Documento É:
    // - Auditável
    // - Versionável
    // - Rastreável
}

// Verificações
Documento doc = new Documento();
System.out.println(doc instanceof Auditavel); // true
System.out.println(doc instanceof Versionavel); // true
System.out.println(doc instanceof Rastreavel); // true
```

### 9. Herança de Capacidade

**Herança**: subclasse herda capacidade.

```java
public interface Exportavel { }

public class Documento implements Exportavel {
    private String conteudo;
}

// Usuario herda capacidade de Documento
public class Relatorio extends Documento {
    private String titulo;
}

// Verificação
Relatorio r = new Relatorio();
System.out.println(r instanceof Exportavel); // true (herdado)
```

### 10. Capacidade vs Propriedade em API

**API**: usa markers para controle.

```java
public interface Validavel { }
public interface Processavel { }

public class Pedido implements Validavel, Processavel {
    private String numero;
}

// API usa markers
public class ProcessadorAPI {
    public void processar(Object obj) {
        // Verificar propriedade
        if (obj instanceof Validavel) {
            validar(obj);
        }
        
        // Verificar capacidade
        if (obj instanceof Processavel) {
            processar(obj);
        } else {
            throw new IllegalArgumentException(
                "Objeto não pode ser processado"
            );
        }
    }
    
    private void validar(Object obj) {
        System.out.println("Validando: " + obj);
    }
    
    private void processar(Object obj) {
        System.out.println("Processando: " + obj);
    }
}
```

---

## Aplicabilidade

**Capacidades**:
- **Serialização** (Serializable)
- **Clonagem** (Cloneable)
- **Exportação** (Exportavel)
- **Importação** (Importavel)
- **Cache** (Cacheavel)

**Propriedades**:
- **Auditoria** (Auditavel)
- **Versionamento** (Versionavel)
- **Rastreamento** (Rastreavel)
- **Persistência** (Persistente)
- **Soft Delete** (Deletavel)

**Benefícios**:
- Verificação em runtime
- Framework detecta automaticamente
- Sem comportamento obrigatório
- Herança automática

---

## Armadilhas

### 1. Confundir Capacidade com Propriedade

```java
// ⚠️ Capacidade: PODE fazer
public interface Exportavel { } // Pode ser exportado

// ⚠️ Propriedade: É algo
public interface Auditavel { } // É auditável

// Ambos funcionam igual (markers)
// Diferença é semântica
```

### 2. Marker sem Lógica Associada

```java
// ⚠️ Marker sem propósito
public interface MinhaMarker { }

public class MinhaClasse implements MinhaMarker {
}

// Ninguém verifica a marker
// Marker inútil

// ✅ Marker com lógica
public interface Exportavel { }

public void exportar(Object obj) {
    if (obj instanceof Exportavel) {
        // Lógica de exportação
    }
}
```

### 3. Esquecer Verificação

```java
public interface Validavel { }

public class Pedido implements Validavel {
}

// ⚠️ Marker não verificada
public void processar(Pedido pedido) {
    // Não verifica se é Validavel
    // Marker ignorada
}

// ✅ Verificar marker
public void processar(Object obj) {
    if (obj instanceof Validavel) {
        validar(obj);
    }
}
```

### 4. Marker com Comportamento

```java
// ❌ Não é marker: tem método
public interface NaoMarker {
    void metodo();
}

// ✅ Marker: sem métodos
public interface Marker { }
```

### 5. Dependência de Implementação Específica

```java
// ⚠️ Evitar: assume implementação
public void processar(Object obj) {
    if (obj instanceof Exportavel) {
        // ❌ Assume método específico
        // ((MinhaClasse) obj).exportar(); // Ruim
        
        // ✅ Lógica genérica
        exportar(obj);
    }
}
```

### 6. Herança Inesperada

```java
public interface Deletavel { }

public class Entidade implements Deletavel {
}

// Herança: todas subclasses são Deletavel
public class Usuario extends Entidade {
    // É Deletavel (herdado)
}

public class Config extends Entidade {
    // É Deletavel (pode não fazer sentido)
}
```

### 7. Marker Muito Genérica

```java
// ⚠️ Evitar: marker muito genérica
public interface Processavel { }

// Tudo pode ser "processável"
// Marker sem significado claro

// ✅ Marker específica
public interface ExportavelParaPDF { }
```

---

## Boas Práticas

### 1. Naming Claro

```java
// ✅ Nome indica capacidade
public interface Exportavel { } // PODE ser exportado
public interface Importavel { } // PODE ser importado
public interface Serializavel { } // PODE ser serializado

// ✅ Nome indica propriedade
public interface Auditavel { } // É auditável
public interface Versionavel { } // É versionável
public interface Persistente { } // É persistente
```

### 2. JavaDoc Explicativo

```java
/**
 * Interface marker que indica que objetos podem ser exportados.
 * 
 * <p>Classes que implementam esta interface serão automaticamente
 * elegíveis para exportação pelo {@link ExportadorService}.
 * 
 * @see ExportadorService
 * @since 1.0
 */
public interface Exportavel {
}
```

### 3. Verificação Consistente

```java
// ✅ Sempre verificar marker antes de usar
public void processar(Object obj) {
    if (obj instanceof Cacheavel) {
        adicionarAoCache(obj);
    }
    
    if (obj instanceof Auditavel) {
        registrarAuditoria(obj);
    }
    
    if (obj instanceof Validavel) {
        validar(obj);
    }
}
```

### 4. Framework Detecta Automaticamente

```java
// ✅ Framework detecta e processa
public class FrameworkService {
    public void salvar(Object obj) {
        // Auditoria automática
        if (obj instanceof Auditavel) {
            registrarAuditoria(obj);
        }
        
        // Versionamento automático
        if (obj instanceof Versionavel) {
            incrementarVersao(obj);
        }
        
        // Persistência
        salvarNoBanco(obj);
    }
}
```

### 5. Markers em Hierarquias

```java
// ✅ Marker em base
public interface Entidade extends Serializable {
    Long getId();
}

// Todas as entidades são serializáveis
public class Usuario implements Entidade {
    private Long id;
    
    @Override
    public Long getId() {
        return id;
    }
}

public class Produto implements Entidade {
    private Long id;
    
    @Override
    public Long getId() {
        return id;
    }
}
```

### 6. Múltiplas Markers Relacionadas

```java
// ✅ Markers relacionadas
public interface Entidade extends Serializable, Auditavel, 
                                   Versionavel, Persistente {
    Long getId();
}

// Todas as entidades têm essas capacidades/propriedades
public class Usuario implements Entidade {
    private Long id;
    
    @Override
    public Long getId() {
        return id;
    }
}
```

### 7. Reflection para Descoberta

```java
// ✅ Reflection para processar markers
public void processar(Object obj) {
    Class<?> classe = obj.getClass();
    
    for (Class<?> iface : classe.getInterfaces()) {
        if (iface == Auditavel.class) {
            registrarAuditoria(obj);
        }
        if (iface == Cacheavel.class) {
            adicionarAoCache(obj);
        }
    }
}
```

### 8. Markers para Aspectos

```java
// ✅ Markers para aspectos (AOP)
public interface Transacional { }

@Aspect
public class TransacaoAspect {
    @Around("execution(* *(..)) && target(transacional)")
    public Object aoRedor(ProceedingJoinPoint pjp, 
                          Transacional transacional) throws Throwable {
        System.out.println("Iniciando transação");
        try {
            Object resultado = pjp.proceed();
            System.out.println("Commit");
            return resultado;
        } catch (Exception e) {
            System.out.println("Rollback");
            throw e;
        }
    }
}
```

### 9. Documentar Comportamento Esperado

```java
/**
 * Interface marker para objetos auditáveis.
 * 
 * <p>Objetos que implementam esta interface terão TODAS as operações
 * de criação, atualização e exclusão registradas no log de auditoria.
 * 
 * <p>O sistema de auditoria registra automaticamente:
 * <ul>
 *   <li>Usuário que realizou a operação</li>
 *   <li>Data e hora da operação</li>
 *   <li>Tipo de operação (CREATE, UPDATE, DELETE)</li>
 *   <li>Valores antes e depois (UPDATE)</li>
 * </ul>
 * 
 * @see AuditoriaService
 */
public interface Auditavel {
}
```

### 10. Considerar Annotations

```java
// ⚠️ Marker: limitado
public interface Exportavel { }

public class Relatorio implements Exportavel {
}

// ✅ Annotation: mais flexível
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Exportavel {
    String formato() default "PDF";
    String[] campos() default {};
}

@Exportavel(formato = "EXCEL", campos = {"nome", "data"})
public class Relatorio {
}
```

---

## Resumo

**Interface Marker**: indica **capacidade** ou **propriedade**.

**Capacidade**: classe **pode** fazer algo.
```java
public interface Exportavel { } // PODE ser exportado
public interface Cloneable { } // PODE ser clonado
```

**Propriedade**: classe **é** algo.
```java
public interface Auditavel { } // É auditável
public interface Versionavel { } // É versionável
```

**Verificação**:
```java
if (obj instanceof Exportavel) {
    // Objeto PODE ser exportado
}

if (obj instanceof Auditavel) {
    // Objeto É auditável
}
```

**Framework detecta**:
```java
public void salvar(Object obj) {
    if (obj instanceof Auditavel) {
        registrarAuditoria(obj);
    }
    
    if (obj instanceof Cacheavel) {
        adicionarAoCache(obj);
    }
}
```

**Múltiplas markers**:
```java
public class Produto implements Serializable, Cloneable, 
                                Exportavel, Auditavel {
    // Múltiplas capacidades e propriedades
}
```

**Herança**:
```java
public interface Entidade extends Serializable, Auditavel {
}

// Todas as entidades são Serializable e Auditavel
public class Usuario implements Entidade {
}
```

**Capacidades comuns**:
- Serializable (pode ser serializado)
- Cloneable (pode ser clonado)
- Exportavel (pode ser exportado)
- Importavel (pode ser importado)
- Cacheavel (pode ser cacheado)

**Propriedades comuns**:
- Auditavel (é auditável)
- Versionavel (é versionável)
- Rastreavel (é rastreável)
- Persistente (é persistente)
- Deletavel (é soft deletável)

**Boas práticas**:
- Naming claro (capacidade/propriedade)
- JavaDoc explicativo
- Verificação consistente
- Framework detecta automaticamente
- Markers em hierarquias
- Múltiplas markers relacionadas
- Reflection para descoberta
- Markers para aspectos (AOP)
- Documentar comportamento
- Considerar annotations (mais flexíveis)

**Armadilhas**:
- ❌ Confundir capacidade com propriedade (semântica)
- ❌ Marker sem lógica associada
- ❌ Esquecer verificação
- ❌ Marker com comportamento (não é marker)
- ❌ Dependência de implementação específica
- ❌ Herança inesperada
- ❌ Marker muito genérica

**Regra de Ouro**: **Interface Marker** indica que classe **tem capacidade** (pode fazer) ou **tem propriedade** (é algo). **Capacidade**: classe **pode** realizar ação (Exportavel, Cloneable). **Propriedade**: classe **é** ou **tem** característica (Auditavel, Versionavel). Verificada em **runtime** com **instanceof**. **Framework** detecta automaticamente. Use **naming claro** e **JavaDoc** para documentar significado. Considere **annotations** quando precisa **metadados**.
