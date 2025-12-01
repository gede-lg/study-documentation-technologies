# T6.02 - Métodos final

## Introdução

**Métodos final** não podem ser **sobrescritos** (overridden).

**Subclasses** não podem modificar implementação.

**Uso**: garantir comportamento imutável, segurança, performance.

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando...");
    }
}

public class Cachorro extends Animal {
    @Override
    public void respirar() { // ❌ Erro de compilação
        System.out.println("Cachorro respirando");
    }
}
```

```java
public class Configuracao {
    public final void validar() {
        // Lógica crítica que não pode ser alterada
        if (valor < 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
    }
}
```

---

## Fundamentos

### 1. Método final Não Pode Ser Sobrescrito

```java
public class Pai {
    public final void metodoFinal() {
        System.out.println("Método final");
    }
}

public class Filho extends Pai {
    @Override
    public void metodoFinal() { // ❌ Erro de compilação
        System.out.println("Tentando sobrescrever");
    }
}
```

### 2. Métodos final em Subclasses

**Subclasses herdam** método final, mas **não podem sobrescrever**.

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

public class Cachorro extends Animal {
    // Herda respirar(), mas não pode sobrescrever
}

Cachorro c = new Cachorro();
c.respirar(); // "Respirando" ✅
```

### 3. Métodos private São Implicitamente final

**Métodos private** não são herdados, portanto não podem ser sobrescritos.

```java
public class Pai {
    private void metodoPrivado() {
        System.out.println("Privado");
    }
}

public class Filho extends Pai {
    // Não sobrescreve, é método NOVO
    private void metodoPrivado() {
        System.out.println("Outro método privado");
    }
}
```

### 4. Métodos static Não Podem Ser final (Conceito)

**Métodos static** não são sobrescritos, são **ocultos** (hidden).

```java
public class Pai {
    public static void metodoStatic() {
        System.out.println("Pai");
    }
}

public class Filho extends Pai {
    public static void metodoStatic() { // Não é override, é hiding
        System.out.println("Filho");
    }
}
```

**final em static** é redundante (mas permitido).

### 5. final vs @Override

**@Override** detecta sobrescrita.

**final** impede sobrescrita.

```java
public class Pai {
    public final void metodo() {
        System.out.println("Pai");
    }
}

public class Filho extends Pai {
    @Override
    public void metodo() { // ❌ Erro: final não pode ser sobrescrito
        System.out.println("Filho");
    }
}
```

### 6. final em Métodos Abstratos (Inválido)

**Métodos abstratos** devem ser implementados, não podem ser final.

```java
public abstract class Animal {
    public abstract final void som(); // ❌ Erro: conflito
}
```

### 7. final em Interfaces

**Métodos de interface** são **public abstract** por padrão (não podem ser final).

**Métodos default/static** podem ser usados, mas **não podem ser final** explicitamente.

```java
public interface Exemplo {
    void metodo(); // abstract, não pode ser final
    
    default void metodoDefault() {
        // Pode ser sobrescrito (não pode ser final)
    }
}
```

### 8. Performance de Métodos final

**Antigo**: JVM podia **inlining** de métodos final.

**Moderno**: JIT compiler otimiza automaticamente (final não melhora performance significativamente).

```java
// Mito: final melhora performance
public final void calcular() {
    // JVM moderna otimiza com ou sem final
}
```

### 9. Segurança com final

**Previne alteração** de lógica crítica por subclasses.

```java
public class Usuario {
    public final boolean validarSenha(String senha) {
        // Lógica de segurança que não pode ser alterada
        return senha.length() >= 8;
    }
}
```

### 10. final em Template Method Pattern

**Template Method**: método final define estrutura, métodos abstratos implementam passos.

```java
public abstract class ProcessadorDados {
    public final void processar() { // Template method (final)
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

---

## Aplicabilidade

**Use métodos final quando**:
- **Lógica crítica** não deve ser alterada (segurança, validação)
- **Invariantes** devem ser mantidos
- **Template Method Pattern**: estrutura fixa, passos variáveis
- **Documentar intenção**: "não sobrescreva este método"

**Não use final quando**:
- Espera-se **polimorfismo** (sobrescrita necessária)
- **Flexibilidade** para subclasses é desejada

---

## Armadilhas

### 1. Impedir Polimorfismo Necessário

```java
public class Animal {
    public final void som() { // ❌ Muito restritivo
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() { // ❌ Erro: não pode sobrescrever
        System.out.println("Au au");
    }
}
```

**Solução**: Não use final se polimorfismo é esperado.

### 2. Confundir final com static

```java
// ❌ Confusão
public static final void metodo() { } // Redundante

// static não pode ser sobrescrito (hiding, não override)
```

### 3. final em Métodos Abstratos

```java
public abstract class Exemplo {
    public abstract final void metodo(); // ❌ Erro: conflito
}
```

### 4. Usar final Por Padrão

```java
// ❌ Excesso de final (sem necessidade)
public final void metodo1() { }
public final void metodo2() { }
public final void metodo3() { }
```

**Use final** apenas quando **necessário**.

### 5. Esquecer de Documentar

```java
// ❌ Sem explicação
public final void validar() {
    // Por que final?
}

// ✅ Documentado
/**
 * Valida entrada. Método final para garantir segurança.
 */
public final void validar() {
    // ...
}
```

### 6. final em Construtores (Inválido)

```java
public class Exemplo {
    public final Exemplo() { } // ❌ Erro: construtores não podem ser final
}
```

---

## Boas Práticas

### 1. Use final Para Lógica Crítica

```java
public class Autenticacao {
    public final boolean autenticar(String usuario, String senha) {
        // Lógica de autenticação que não pode ser alterada
        return validarUsuario(usuario) && validarSenha(senha);
    }
}
```

### 2. Template Method Pattern

```java
public abstract class RelatorioGenerator {
    public final void gerar() { // Estrutura fixa
        inicializar();
        carregarDados();
        processar();
        salvar();
    }
    
    protected abstract void carregarDados();
    protected abstract void processar();
    protected abstract void salvar();
    
    private void inicializar() { }
}
```

### 3. Documente Por Que final

```java
/**
 * Calcula hash de senha. Método final para evitar
 * alteração de algoritmo de segurança.
 */
public final String calcularHash(String senha) {
    return SHA256.hash(senha);
}
```

### 4. Não Use final Por Padrão

**Use final** apenas quando há **razão clara**.

```java
// ❌ Sem necessidade
public final void metodoSimples() {
    return valor * 2;
}

// ✅ Com justificativa
public final void validarRegrasNegocio() {
    // Lógica crítica que não pode ser alterada
}
```

### 5. Combine com protected Para Flexibilidade

```java
public class Processador {
    public final void processar() {
        inicializar();
        executar(); // Pode ser sobrescrito
        finalizar();
    }
    
    protected void inicializar() { } // Pode ser sobrescrito
    protected void executar() { }    // Pode ser sobrescrito
    private void finalizar() { }     // Não pode ser sobrescrito
}
```

### 6. Evite final em APIs Públicas

**Bibliotecas**: Evite final (limita extensibilidade).

**Código interno**: Use final para garantir invariantes.

### 7. Use final com Métodos Utilitários

```java
public class StringUtils {
    public static final String capitalize(String texto) {
        // Lógica que não deve ser alterada
        return texto.substring(0, 1).toUpperCase() + texto.substring(1);
    }
}
```

### 8. final em Callbacks

```java
public abstract class EventHandler {
    public final void handle(Event event) {
        validarEvento(event);
        processar(event);
    }
    
    private void validarEvento(Event event) {
        // Validação que não pode ser pulada
    }
    
    protected abstract void processar(Event event);
}
```

### 9. Testes: Considere Mockabilidade

**Mockito** não consegue mockar métodos final (sem PowerMock).

```java
// ❌ Dificulta testes
public final void buscarDados() {
    // ...
}

// ✅ Facilita testes
public void buscarDados() {
    // ...
}
```

---

## Resumo

**Método final**:
```java
public final void metodo() {
    // Não pode ser sobrescrito
}
```

**Erro ao sobrescrever**:
```java
public class Pai {
    public final void metodo() { }
}

public class Filho extends Pai {
    @Override
    public void metodo() { } // ❌ Erro
}
```

**Métodos private implicitamente final**:
```java
private void metodo() {
    // Não herdado, não pode ser sobrescrito
}
```

**final em abstract (inválido)**:
```java
public abstract final void metodo(); // ❌ Erro
```

**Template Method Pattern**:
```java
public final void processar() { // Estrutura fixa
    passo1();
    passo2();
    passo3();
}

protected abstract void passo1();
protected abstract void passo2();
protected abstract void passo3();
```

**Segurança**:
```java
public final boolean validarSenha(String senha) {
    // Lógica crítica que não pode ser alterada
    return senha.length() >= 8;
}
```

**Performance (mito)**:
```java
// JVM moderna otimiza sem final
public void metodo() { }
```

**Documentação**:
```java
/**
 * Valida entrada. Final para garantir integridade.
 */
public final void validar() { }
```

**Regra de Ouro**: Use **métodos final** para **lógica crítica** que **não deve ser alterada**. **Não use** por padrão. **Documente** razão do final. Considere **impacto em testes** (mockabilidade).
