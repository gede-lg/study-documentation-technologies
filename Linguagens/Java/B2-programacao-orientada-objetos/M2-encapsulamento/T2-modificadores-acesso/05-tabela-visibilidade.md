# T2.05 - Tabela de Visibilidade dos Modificadores de Acesso

## Introdução e Definição

A **tabela de visibilidade** é uma representação consolidada que mostra **onde** cada modificador de acesso (`private`, default, `protected`, `public`) permite que membros sejam acessados. Esta tabela é fundamental para:
- **Compreender rapidamente** as diferenças entre modificadores
- **Tomar decisões** sobre qual modificador usar
- **Resolver problemas** de acesso em hierarquias de classes
- **Projetar APIs** com encapsulamento adequado

A visibilidade cresce na ordem:
**private** < **default** < **protected** < **public**

Cada modificador **inclui** os contextos de acesso dos anteriores e **adiciona** novos:
- `private`: apenas própria classe
- `default`: `private` + mesmo pacote
- `protected`: `default` + subclasses de outros pacotes
- `public`: `protected` + qualquer classe de qualquer pacote

**Exemplo Visual**:
```
private    [■ Classe]
default    [■ Classe][■ Pacote]
protected  [■ Classe][■ Pacote][■ Subclasses]
public     [■ Classe][■ Pacote][■ Subclasses][■ Mundo]
```

---

## Tabela Completa de Visibilidade

| **Modificador** | **Mesma Classe** | **Mesmo Pacote** | **Subclasse (outro pacote)** | **Qualquer Classe (outro pacote)** |
|-----------------|:----------------:|:----------------:|:----------------------------:|:----------------------------------:|
| **private**     | ✅ SIM           | ❌ NÃO           | ❌ NÃO                       | ❌ NÃO                             |
| **default**     | ✅ SIM           | ✅ SIM           | ❌ NÃO                       | ❌ NÃO                             |
| **protected**   | ✅ SIM           | ✅ SIM           | ✅ SIM (via herança)         | ❌ NÃO                             |
| **public**      | ✅ SIM           | ✅ SIM           | ✅ SIM                       | ✅ SIM                             |

### Legenda

- **✅ SIM**: Membro **é acessível** neste contexto
- **❌ NÃO**: Membro **não é acessível** neste contexto
- **Mesma Classe**: Dentro da própria classe onde foi declarado
- **Mesmo Pacote**: Classes no mesmo package (independente de herança)
- **Subclasse (outro pacote)**: Subclasse em pacote diferente (acesso via herança)
- **Qualquer Classe (outro pacote)**: Qualquer classe em qualquer pacote

---

## 10 Fundamentos Teóricos

### 1. Private - Acesso Exclusivo da Classe

```java
package com.exemplo;

public class Classe {
    private int valor;  // private

    public void teste() {
        valor = 10;  // ✅ OK: mesma classe
    }
}

class OutraClasseMesmoPacote {
    void teste() {
        Classe c = new Classe();
        // c.valor = 20;  // ❌ ERRO: private não acessível
    }
}
```

```java
package com.outro;

import com.exemplo.Classe;

public class Subclasse extends Classe {
    void teste() {
        // valor = 30;  // ❌ ERRO: private não acessível (mesmo em subclasse)
    }
}
```

**Visibilidade**: ✅ Mesma classe | ❌ Mesmo pacote | ❌ Subclasse | ❌ Mundo

---

### 2. Default - Acesso no Mesmo Pacote

```java
package com.exemplo;

public class Classe {
    int valor;  // default

    void metodo() {  // default
        valor = 10;  // ✅ OK: mesma classe
    }
}

class OutraClasseMesmoPacote {
    void teste() {
        Classe c = new Classe();
        c.valor = 20;  // ✅ OK: mesmo pacote
        c.metodo();    // ✅ OK: mesmo pacote
    }
}
```

```java
package com.outro;

import com.exemplo.Classe;

public class Subclasse extends Classe {
    void teste() {
        // valor = 30;  // ❌ ERRO: default não acessível em outro pacote
        // metodo();    // ❌ ERRO: default não acessível (mesmo sendo subclasse)
    }
}
```

**Visibilidade**: ✅ Mesma classe | ✅ Mesmo pacote | ❌ Subclasse (outro pacote) | ❌ Mundo

---

### 3. Protected - Acesso no Pacote e Subclasses

```java
package com.exemplo;

public class Classe {
    protected int valor;  // protected

    protected void metodo() {  // protected
        valor = 10;  // ✅ OK: mesma classe
    }
}

class OutraClasseMesmoPacote {
    void teste() {
        Classe c = new Classe();
        c.valor = 20;  // ✅ OK: mesmo pacote
        c.metodo();    // ✅ OK: mesmo pacote
    }
}
```

```java
package com.outro;

import com.exemplo.Classe;

public class Subclasse extends Classe {
    void teste() {
        valor = 30;  // ✅ OK: protected acessível em subclasse (via herança)
        metodo();    // ✅ OK: protected acessível em subclasse
    }
}

public class ClasseQualquer {
    void teste() {
        Classe c = new Classe();
        // c.valor = 40;  // ❌ ERRO: protected não acessível (não é subclasse)
        // c.metodo();    // ❌ ERRO: protected não acessível
    }
}
```

**Visibilidade**: ✅ Mesma classe | ✅ Mesmo pacote | ✅ Subclasse | ❌ Mundo

---

### 4. Public - Acesso Irrestrito

```java
package com.exemplo;

public class Classe {
    public int valor;  // public

    public void metodo() {  // public
        valor = 10;  // ✅ OK: mesma classe
    }
}

class OutraClasseMesmoPacote {
    void teste() {
        Classe c = new Classe();
        c.valor = 20;  // ✅ OK: mesmo pacote
        c.metodo();    // ✅ OK: mesmo pacote
    }
}
```

```java
package com.outro;

import com.exemplo.Classe;

public class Subclasse extends Classe {
    void teste() {
        valor = 30;  // ✅ OK: public acessível
        metodo();    // ✅ OK: public acessível
    }
}

public class ClasseQualquer {
    void teste() {
        Classe c = new Classe();
        c.valor = 40;  // ✅ OK: public acessível de qualquer lugar
        c.metodo();    // ✅ OK: public acessível
    }
}
```

**Visibilidade**: ✅ Mesma classe | ✅ Mesmo pacote | ✅ Subclasse | ✅ Mundo

---

### 5. Comparação: Default vs Protected

**Diferença-Chave**: `protected` adiciona acesso em **subclasses de outros pacotes**.

```java
package com.base;

public class Base {
    int atributoDefault;       // default
    protected int atributoProtected;  // protected
}
```

```java
package com.derivada;

import com.base.Base;

public class Derivada extends Base {
    void teste() {
        // atributoDefault = 10;  // ❌ ERRO: default não acessível em outro pacote
        atributoProtected = 20;   // ✅ OK: protected acessível em subclasse
    }
}
```

**Resumo**:
- **Default**: apenas **mesmo pacote**
- **Protected**: **mesmo pacote** + **subclasses de qualquer pacote**

---

### 6. Hierarquia de Visibilidade Crescente

A visibilidade cresce na ordem:

```
private → default → protected → public
  (menos visível)      →      (mais visível)
```

**Cada nível inclui o anterior**:
- `default` = `private` + mesmo pacote
- `protected` = `default` + subclasses
- `public` = `protected` + qualquer classe

```java
public class Exemplo {
    private int a;     // Visibilidade: 1 (apenas esta classe)
    int b;             // Visibilidade: 2 (pacote)
    protected int c;   // Visibilidade: 3 (pacote + subclasses)
    public int d;      // Visibilidade: 4 (todos)
}
```

---

### 7. Protected em Subclasses: Acesso via Herança

**Importante**: Em outro pacote, subclasse acessa `protected` **apenas através de `this`** (herança), não através de instância da superclasse.

```java
package com.base;

public class Animal {
    protected String nome;
}
```

```java
package com.derivada;

import com.base.Animal;

public class Cachorro extends Animal {
    void teste() {
        this.nome = "Rex";  // ✅ OK: acessa via this (herança)

        Cachorro c = new Cachorro();
        c.nome = "Bobby";  // ✅ OK: instância da mesma subclasse

        Animal a = new Animal();
        // a.nome = "Qualquer";  // ❌ ERRO: não pode acessar protected de instância da superclasse
    }
}
```

---

### 8. Tabela Para Classes Top-Level

Classes de nível superior (top-level) **só podem ser** `public` ou `default`.

| **Modificador**        | **Permitido em Classe Top-Level** |
|------------------------|:----------------------------------:|
| **private**            | ❌ NÃO                             |
| **default** (sem modificador) | ✅ SIM                      |
| **protected**          | ❌ NÃO                             |
| **public**             | ✅ SIM                             |

```java
public class ClassePublica { }  // ✅ OK

class ClasseDefault { }  // ✅ OK (sem modificador)

// private class ClassePrivada { }  // ❌ ERRO

// protected class ClasseProtegida { }  // ❌ ERRO
```

---

### 9. Tabela Para Membros de Classe

Membros (atributos, métodos, construtores, classes internas) **podem ter qualquer** modificador.

| **Tipo de Membro**    | **private** | **default** | **protected** | **public** |
|-----------------------|:-----------:|:-----------:|:-------------:|:----------:|
| **Atributo**          | ✅          | ✅          | ✅            | ✅         |
| **Método**            | ✅          | ✅          | ✅            | ✅         |
| **Construtor**        | ✅          | ✅          | ✅            | ✅         |
| **Classe Interna**    | ✅          | ✅          | ✅            | ✅         |

```java
public class Exemplo {
    private int atributoPrivado;
    int atributoDefault;
    protected int atributoProtected;
    public int atributoPublico;

    private void metodoPrivado() { }
    void metodoDefault() { }
    protected void metodoProtected() { }
    public void metodoPublico() { }

    private Exemplo() { }  // Construtor privado

    private class ClasseInternaPrivada { }
    class ClasseInternaDefault { }
    protected class ClasseInternaProtected { }
    public class ClasseInternaPublic { }
}
```

---

### 10. Tabela Resumida de Decisão

| **Caso de Uso**                                      | **Modificador Recomendado** |
|------------------------------------------------------|-----------------------------||
| Implementação interna (ninguém deve acessar)         | `private`                   |
| Compartilhado no pacote (helper interno)             | `default`                   |
| Extensível por subclasses (herança)                  | `protected`                 |
| API pública (acessível a todos)                      | `public`                    |
| Atributos de instância                               | `private` (+ getters/setters) |
| Métodos auxiliares                                   | `private`                   |
| Constantes compartilhadas                            | `public static final`       |
| Construtor de Singleton                              | `private`                   |
| Construtor de classe abstrata/template               | `protected`                 |
| Interface pública de serviço                         | `public`                    |
| Template Method (método hook)                        | `protected`                 |

---

## Aplicabilidade

### Quando Usar Cada Modificador

**Private**:
- Atributos de instância
- Métodos auxiliares
- Construtores de Singleton
- Implementação interna

**Default**:
- Classes helper internas do pacote
- Métodos para uso no pacote
- Construtores para controle no pacote

**Protected**:
- Métodos/atributos para extensão
- Template Method pattern
- Construtores de classes abstratas
- Getters/setters para subclasses

**Public**:
- API pública de classes
- Interfaces e contratos
- Constantes globais
- Métodos de serviço
- Getters/setters públicos

---

## Boas Práticas

### 1. Princípio do Menor Privilégio

Comece com `private`, aumente visibilidade **apenas quando necessário**.

```java
public class BomExemplo {
    private String dado;  // Comece privado

    public String getDado() {  // Torne público apenas o necessário
        return dado;
    }
}
```

### 2. Use a Tabela Para Tomar Decisões

Consulte a tabela ao definir visibilidade:
- Precisa acessar de outro pacote? → `public` ou `protected`
- Apenas subclasses? → `protected`
- Apenas pacote? → `default`
- Apenas esta classe? → `private`

### 3. Revise Decisões ao Mudar Estrutura

Ao mover classes entre pacotes ou alterar hierarquia, revise modificadores.

---

## Resumo Executivo

**Tabela de Visibilidade Completa**:

| Modificador  | Mesma Classe | Mesmo Pacote | Subclasse (outro pacote) | Qualquer Classe |
|--------------|:------------:|:------------:|:------------------------:|:---------------:|
| **private**  | ✅           | ❌           | ❌                       | ❌              |
| **default**  | ✅           | ✅           | ❌                       | ❌              |
| **protected**| ✅           | ✅           | ✅ (via herança)         | ❌              |
| **public**   | ✅           | ✅           | ✅                       | ✅              |

**Hierarquia de Visibilidade**:
```
private < default < protected < public
(menos visível)  →  (mais visível)
```

**Classes Top-Level**: `public` ou `default` apenas

**Membros de Classe**: todos os 4 modificadores permitidos

**Regra de Ouro**: **Comece com `private`**, aumente visibilidade apenas quando necessário para API pública, extensão, ou colaboração em pacote.

**Decisão Rápida**:
- Ninguém acessa? → `private`
- Só pacote? → `default`
- Subclasses também? → `protected`
- Todos acessam? → `public`
