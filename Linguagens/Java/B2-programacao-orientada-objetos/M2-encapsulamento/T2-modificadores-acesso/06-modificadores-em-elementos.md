# T2.06 - Modificadores de Acesso em Diferentes Elementos Java

## Introdução e Definição

Os modificadores de acesso (`private`, default, `protected`, `public`) podem ser aplicados a diferentes **elementos** da linguagem Java. Porém, cada tipo de elemento tem **regras específicas** sobre quais modificadores são permitidos.

Esta seção detalha:
- **Quais modificadores** podem ser usados em cada elemento
- **Restrições** e regras específicas
- **Casos especiais** (classes internas, interfaces, enums)
- **Boas práticas** por tipo de elemento

**Elementos Java**:
1. **Classes Top-Level** (nível superior)
2. **Classes Internas** (nested classes)
3. **Interfaces**
4. **Enums**
5. **Atributos** (campos/variáveis de instância)
6. **Métodos**
7. **Construtores**
8. **Blocos de Inicialização**

---

## 10 Fundamentos Teóricos

### 1. Classes Top-Level (Nível Superior)

**Modificadores Permitidos**: `public` ou **default** (sem modificador)

**NÃO Permitidos**: `private`, `protected`

```java
// ✅ VÁLIDO: classe pública
public class ClassePublica {
}

// ✅ VÁLIDO: classe default (sem modificador)
class ClasseDefault {
}

// ❌ INVÁLIDO: private não permitido em top-level
// private class ClassePrivada { }  // ERRO de compilação

// ❌ INVÁLIDO: protected não permitido em top-level
// protected class ClasseProtegida { }  // ERRO de compilação
```

**Regra**: Apenas **uma** classe `public` por arquivo `.java`, e seu nome deve corresponder ao nome do arquivo.

```java
// Arquivo: MinhaClasse.java
public class MinhaClasse { }  // ✅ OK: nome corresponde

class Helper { }  // ✅ OK: pode ter outras classes default

// public class OutraClasse { }  // ❌ ERRO: apenas uma pública
```

**Quando Usar**:
- **`public`**: classe faz parte da API pública (acessível de outros pacotes)
- **`default`**: classe é implementação interna do pacote

---

### 2. Classes Internas (Nested Classes)

**Modificadores Permitidos**: `private`, `default`, `protected`, `public`

Classes internas **podem ter qualquer** modificador de acesso.

#### Static Nested Classes

```java
public class Externa {
    private static class PrivadaEstatica { }       // ✅ Privada
    static class DefaultEstatica { }                // ✅ Default
    protected static class ProtegidaEstatica { }    // ✅ Protected
    public static class PublicaEstatica { }         // ✅ Pública
}
```

#### Inner Classes (Non-Static)

```java
public class Externa {
    private class PrivadaInterna { }       // ✅ Privada
    class DefaultInterna { }                // ✅ Default
    protected class ProtegidaInterna { }    // ✅ Protected
    public class PublicaInterna { }         // ✅ Pública
}
```

**Uso Comum**:
- **`private`**: implementação interna (Node em lista encadeada)
- **`public`**: parte da API (Entry em Map)
- **`protected`**: extensível por subclasses
- **`default`**: uso no pacote

---

### 3. Interfaces

**Modificadores Permitidos** (classes de interface): `public` ou **default**

**NÃO Permitidos**: `private`, `protected`

```java
// ✅ VÁLIDO: interface pública
public interface InterfacePublica {
}

// ✅ VÁLIDO: interface default
interface InterfaceDefault {
}

// ❌ INVÁLIDO: private não permitido em interface top-level
// private interface InterfacePrivada { }  // ERRO

// ❌ INVÁLIDO: protected não permitido
// protected interface InterfaceProtegida { }  // ERRO
```

**Membros de Interface**:
- **Métodos abstratos**: implicitamente `public abstract`
- **Métodos default**: implicitamente `public`
- **Métodos static**: implicitamente `public`
- **Métodos private** (Java 9+): explicitamente `private`
- **Constantes**: implicitamente `public static final`

```java
public interface MinhaInterface {
    // Implicitamente public abstract
    void metodo();

    // Implicitamente public
    default void metodoDefault() { }

    // Implicitamente public
    static void metodoStatic() { }

    // Java 9+: pode ser private
    private void metodoPrivado() { }

    // Implicitamente public static final
    int CONSTANTE = 100;
}
```

---

### 4. Enums

**Modificadores Permitidos** (enum top-level): `public` ou **default**

**NÃO Permitidos**: `private`, `protected`

```java
// ✅ VÁLIDO: enum público
public enum StatusPublico {
    ATIVO, INATIVO
}

// ✅ VÁLIDO: enum default
enum StatusDefault {
    ATIVO, INATIVO
}

// ❌ INVÁLIDO: private não permitido
// private enum StatusPrivado { }  // ERRO
```

**Membros de Enum**:

```java
public enum Status {
    ATIVO(1), INATIVO(2);

    private final int codigo;  // ✅ Atributo privado

    // Construtor implicitamente private
    Status(int codigo) {
        this.codigo = codigo;
    }

    public int getCodigo() {  // ✅ Método público
        return codigo;
    }

    protected void metodoProtected() { }  // ✅ Método protected
}
```

**Construtores de Enum**: **sempre private** (implícito ou explícito)

---

### 5. Atributos (Campos/Variáveis de Instância)

**Modificadores Permitidos**: `private`, `default`, `protected`, `public`

```java
public class Exemplo {
    private String atributoPrivado;          // ✅ Privado
    String atributoDefault;                  // ✅ Default
    protected String atributoProtected;      // ✅ Protected
    public String atributoPublico;           // ✅ Público
}
```

**Recomendação**: Atributos de instância geralmente devem ser **`private`**, com acesso via getters/setters.

```java
public class Pessoa {
    private String nome;  // ✅ BOM: privado

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
```

**Constantes**:

```java
public class Config {
    public static final String VERSAO = "1.0";  // ✅ Constante pública
    private static final int BUFFER_SIZE = 1024; // ✅ Constante privada interna
}
```

---

### 6. Métodos

**Modificadores Permitidos**: `private`, `default`, `protected`, `public`

```java
public class Exemplo {
    private void metodoPrivado() { }      // ✅ Privado
    void metodoDefault() { }              // ✅ Default
    protected void metodoProtected() { }  // ✅ Protected
    public void metodoPublico() { }       // ✅ Público
}
```

**Uso Por Tipo**:

```java
public class Servico {
    // API pública
    public void executar() {
        preparar();   // Chama private
        processar();  // Chama protected
    }

    // Implementação privada
    private void preparar() { }

    // Extensível por subclasses
    protected void processar() { }

    // Uso no pacote
    void finalizar() { }
}
```

**Sobrescrita**: Visibilidade pode **aumentar**, nunca **reduzir**

```java
class Base {
    protected void metodo() { }
}

class Derivada extends Base {
    @Override
    public void metodo() { }  // ✅ OK: aumenta de protected para public

    // @Override
    // private void metodo() { }  // ❌ ERRO: não pode reduzir visibilidade
}
```

---

### 7. Construtores

**Modificadores Permitidos**: `private`, `default`, `protected`, `public`

```java
public class Exemplo {
    private Exemplo() { }      // ✅ Construtor privado
    Exemplo(int x) { }          // ✅ Construtor default
    protected Exemplo(String s) { }  // ✅ Construtor protected
    public Exemplo(double d) { }     // ✅ Construtor público
}
```

**Uso Por Modificador**:

#### Private

```java
public class Singleton {
    private static Singleton instancia;

    private Singleton() { }  // ✅ Impede instanciação externa

    public static Singleton getInstance() {
        if (instancia == null) {
            instancia = new Singleton();
        }
        return instancia;
    }
}
```

#### Default

```java
package com.sistema;

public class Configuracao {
    Configuracao() { }  // ✅ Apenas pacote pode instanciar
}
```

#### Protected

```java
public abstract class Template {
    protected Template() { }  // ✅ Apenas subclasses instanciam
}

public class Implementacao extends Template {
    public Implementacao() {
        super();  // Chama construtor protected
    }
}
```

#### Public

```java
public class Usuario {
    public Usuario(String nome) { }  // ✅ Qualquer um pode instanciar
}
```

**Enums**: Construtores **sempre private** (implícito)

```java
public enum Status {
    ATIVO(1);

    private final int codigo;

    // Implicitamente private
    Status(int codigo) {
        this.codigo = codigo;
    }
}
```

---

### 8. Blocos de Inicialização

Blocos de inicialização **não podem ter** modificadores de acesso.

```java
public class Exemplo {
    // Bloco de inicialização de instância (sem modificador)
    {
        System.out.println("Bloco de inicialização de instância");
    }

    // Bloco estático (sem modificador além de static)
    static {
        System.out.println("Bloco de inicialização estática");
    }

    // ❌ INVÁLIDO: não pode ter modificador de acesso
    // public { }  // ERRO
    // private static { }  // ERRO
}
```

---

### 9. Local Classes (Classes Locais)

Classes declaradas **dentro de métodos** **não podem ter** modificadores de acesso.

```java
public class Externa {
    public void metodo() {
        // Classe local (sem modificador de acesso)
        class ClasseLocal {
            void executar() {
                System.out.println("Classe local");
            }
        }

        ClasseLocal local = new ClasseLocal();
        local.executar();

        // ❌ INVÁLIDO: não pode ter modificador
        // public class ClasseLocalPublica { }  // ERRO
    }
}
```

**Regra**: Classes locais e anônimas não podem ter modificadores de acesso.

---

### 10. Tabela Resumida de Modificadores Por Elemento

| **Elemento**                | **private** | **default** | **protected** | **public** |
|-----------------------------|:-----------:|:-----------:|:-------------:|:----------:|
| **Classe Top-Level**        | ❌          | ✅          | ❌            | ✅         |
| **Interface Top-Level**     | ❌          | ✅          | ❌            | ✅         |
| **Enum Top-Level**          | ❌          | ✅          | ❌            | ✅         |
| **Classe Interna**          | ✅          | ✅          | ✅            | ✅         |
| **Classe Local**            | ❌          | ❌          | ❌            | ❌         |
| **Atributo**                | ✅          | ✅          | ✅            | ✅         |
| **Método**                  | ✅          | ✅          | ✅            | ✅         |
| **Construtor**              | ✅          | ✅          | ✅            | ✅         |
| **Bloco de Inicialização**  | ❌          | ❌          | ❌            | ❌         |

**Legenda**:
- ✅ Permitido
- ❌ Não permitido

---

## Aplicabilidade

### Quando Usar Cada Modificador Por Elemento

**Classes Top-Level**:
- `public`: API pública do pacote
- `default`: implementação interna

**Classes Internas**:
- `private`: estruturas de dados internas (Node)
- `public`: parte da API (Map.Entry)
- `protected`: extensível
- `default`: uso no pacote

**Atributos**:
- `private`: regra padrão (encapsulamento)
- `public`: apenas constantes (`public static final`)

**Métodos**:
- `public`: API pública
- `protected`: extensível (Template Method)
- `private`: auxiliares internos
- `default`: uso no pacote

**Construtores**:
- `public`: instanciação pública
- `protected`: apenas subclasses (classes abstratas)
- `private`: Singleton, Factory, classes utilitárias
- `default`: controle no pacote

---

## Boas Práticas

### 1. Classes Top-Level: Public ou Default

```java
// API pública
public class UsuarioService { }

// Implementação interna
class UsuarioValidator { }
```

### 2. Atributos Sempre Privados

```java
public class Pessoa {
    private String nome;  // ✅ Privado

    public String getNome() { return nome; }
}
```

### 3. Construtores Privados Para Singleton

```java
public class Singleton {
    private Singleton() { }  // ✅ Impede instanciação
}
```

### 4. Métodos Protected Para Template Method

```java
public abstract class Template {
    protected abstract void executar();  // ✅ Subclasses implementam
}
```

### 5. Classes Internas Privadas Para Implementação

```java
public class ListaEncadeada {
    private class No {  // ✅ Encapsula estrutura interna
        int valor;
        No proximo;
    }
}
```

---

## Resumo Executivo

**Modificadores Por Elemento**:

**Classes/Interfaces/Enums Top-Level**: `public` ou `default` apenas

**Classes Internas**: todos os 4 modificadores

**Classes Locais**: nenhum modificador de acesso

**Atributos/Métodos/Construtores**: todos os 4 modificadores

**Blocos de Inicialização**: nenhum modificador de acesso

**Regras Especiais**:
- **Uma** classe `public` por arquivo
- **Nome da classe pública** = nome do arquivo
- **Construtores de enum**: sempre `private`
- **Membros de interface**: implicitamente `public` (exceto `private` Java 9+)
- **Sobrescrita de métodos**: pode aumentar visibilidade, nunca reduzir

**Boas Práticas**:
- Classes top-level: `public` (API) ou `default` (interno)
- Atributos: **sempre `private`**
- Métodos: `public` (API), `protected` (extensão), `private` (auxiliar)
- Construtores: `public` (instanciação pública), `private` (Singleton)
- Classes internas: `private` (implementação), `public` (API)

**Regra de Ouro**: Cada elemento tem restrições específicas. Consulte a tabela e escolha o modificador mais restritivo que atenda às necessidades.
