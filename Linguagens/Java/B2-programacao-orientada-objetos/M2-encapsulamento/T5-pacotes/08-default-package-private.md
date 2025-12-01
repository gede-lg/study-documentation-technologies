# T5.08 - Acesso Default (Package-Private)

## Introdução

**Modificador default** (package-private) permite acesso apenas **dentro do mesmo pacote**.

**Sem modificador explícito** = default.

```java
package br.com.empresa.ecommerce.modelo;

class ValidadorCPF { // default (package-private)
    boolean validar(String cpf) {
        return cpf.length() == 11;
    }
}
```

**Acesso**: Apenas classes no pacote `br.com.empresa.ecommerce.modelo`.

---

## Fundamentos

### 1. Definição de Default (Package-Private)

**Default** = Sem modificador de acesso (`public`, `private`, `protected`).

```java
class MinhaClasse {} // default

void meuMetodo() {} // default

int meuAtributo; // default
```

**Visibilidade**: Apenas **mesmo pacote**.

### 2. Tabela de Modificadores de Acesso

| Modificador        | Classe | Pacote | Subclasse | Global |
|--------------------|--------|--------|-----------|--------|
| `public`           | ✅      | ✅      | ✅         | ✅      |
| `protected`        | ✅      | ✅      | ✅         | ❌      |
| **default**        | ✅      | ✅      | ❌         | ❌      |
| `private`          | ✅      | ❌      | ❌         | ❌      |

**Default**: Acesso na classe e no pacote, mas **não** em subclasses de outros pacotes.

### 3. Classes com Modificador Default

**Sintaxe**:
```java
// Sem public
class ValidadorCPF {}
```

**Uso**:
```java
// Mesmo pacote: br.com.empresa.ecommerce.modelo
package br.com.empresa.ecommerce.modelo;

class ValidadorCPF {}

public class Usuario {
    void metodo() {
        ValidadorCPF validador = new ValidadorCPF(); // ✅ OK (mesmo pacote)
    }
}
```

```java
// Outro pacote: br.com.empresa.ecommerce.service
package br.com.empresa.ecommerce.service;

import br.com.empresa.ecommerce.modelo.ValidadorCPF; // ERRO: não visível

public class UsuarioService {
    void metodo() {
        ValidadorCPF validador = new ValidadorCPF(); // ERRO
    }
}
```

### 4. Métodos com Modificador Default

```java
package br.com.empresa.ecommerce.modelo;

public class Produto {
    void calcularDesconto() { // default
        // Lógica interna
    }
}
```

**Acesso**:
```java
// Mesmo pacote
package br.com.empresa.ecommerce.modelo;

public class Categoria {
    void processar() {
        Produto p = new Produto();
        p.calcularDesconto(); // ✅ OK (mesmo pacote)
    }
}
```

```java
// Outro pacote
package br.com.empresa.ecommerce.service;

import br.com.empresa.ecommerce.modelo.Produto;

public class ProdutoService {
    void processar() {
        Produto p = new Produto();
        p.calcularDesconto(); // ERRO: não visível
    }
}
```

### 5. Atributos com Modificador Default

```java
package br.com.empresa.ecommerce.modelo;

public class Produto {
    String codigo; // default
    double preco;  // default
}
```

**Acesso**:
```java
// Mesmo pacote
package br.com.empresa.ecommerce.modelo;

public class Estoque {
    void consultar() {
        Produto p = new Produto();
        p.codigo = "ABC123"; // ✅ OK
        p.preco = 99.99;     // ✅ OK
    }
}
```

```java
// Outro pacote
package br.com.empresa.ecommerce.service;

public class ProdutoService {
    void processar() {
        Produto p = new Produto();
        p.codigo = "XYZ"; // ERRO: não visível
    }
}
```

### 6. Default vs Protected em Herança

**Default**: Subclasse em **outro pacote** NÃO acessa.

```java
// Pacote: br.com.empresa.ecommerce.modelo
package br.com.empresa.ecommerce.modelo;

public class Animal {
    void respirar() {} // default
}
```

```java
// Pacote: br.com.empresa.ecommerce.dominio
package br.com.empresa.ecommerce.dominio;

import br.com.empresa.ecommerce.modelo.Animal;

public class Cachorro extends Animal {
    void metodo() {
        respirar(); // ERRO: default não visível em outro pacote
    }
}
```

**Protected**: Subclasse em outro pacote **acessa**.

```java
public class Animal {
    protected void respirar() {} // protected
}

// Subclasse em outro pacote
public class Cachorro extends Animal {
    void metodo() {
        respirar(); // ✅ OK (protected)
    }
}
```

### 7. Uso de Default para Encapsulamento

**Classe auxiliar interna** (não expor para fora do pacote):

```java
package br.com.empresa.ecommerce.modelo;

// Pública, acessível globalmente
public class Usuario {
    private String cpf;

    public void setCpf(String cpf) {
        if (ValidadorCPF.validar(cpf)) { // Usa classe package-private
            this.cpf = cpf;
        }
    }
}

// Package-private, apenas para uso interno no pacote
class ValidadorCPF {
    static boolean validar(String cpf) {
        return cpf != null && cpf.length() == 11;
    }
}
```

**Benefício**: `ValidadorCPF` não fica exposto para outros pacotes.

### 8. Construtores Default

**Construtor sem modificador** = package-private.

```java
package br.com.empresa.ecommerce.modelo;

public class Produto {
    Produto() { // default (package-private)
        // Apenas classes do mesmo pacote podem instanciar
    }
}
```

**Uso**:
```java
// Mesmo pacote
package br.com.empresa.ecommerce.modelo;

public class Estoque {
    void criar() {
        Produto p = new Produto(); // ✅ OK
    }
}
```

```java
// Outro pacote
package br.com.empresa.ecommerce.service;

public class ProdutoService {
    void criar() {
        Produto p = new Produto(); // ERRO: construtor não visível
    }
}
```

### 9. Interfaces e Métodos Default

**Interfaces**: Métodos são `public` por padrão (não podem ser package-private).

```java
interface MinhaInterface {
    void metodo(); // public implícito
}
```

**❌ Não é possível**: Método package-private em interface.

```java
interface MinhaInterface {
    void metodo(); // Sempre public, não pode ser default (package-private)
}
```

### 10. Quando Usar Default

**Use default quando**:
- **Classe auxiliar** interna ao pacote
- **Método/atributo de uso interno** no pacote
- **Encapsular implementação** sem expor para fora

**Exemplo**:
```java
package br.com.empresa.ecommerce.modelo;

public class Pedido {
    private List<Item> itens;

    void adicionarItem(Item item) { // default, uso interno
        itens.add(item);
    }
}

class Item { // default, classe interna ao pacote
    String nome;
    double preco;
}
```

---

## Aplicabilidade

**Use default para**:
- **Classes auxiliares** (helpers, validators)
- **Métodos internos** de pacote
- **Encapsular implementação**

**Evite default quando**:
- Classe precisa ser **acessível globalmente** (use `public`)
- Subclasses em outros pacotes precisam acessar (use `protected`)

---

## Armadilhas

### 1. Subclasse em Outro Pacote Não Acessa

```java
// Pacote A
public class Animal {
    void respirar() {} // default
}

// Pacote B
public class Cachorro extends Animal {
    void metodo() {
        respirar(); // ERRO: default não visível
    }
}
```

**Solução**: Use `protected` se subclasses em outros pacotes precisarem acessar.

### 2. Confundir Default com Protected

**Default**: Mesmo pacote apenas
**Protected**: Mesmo pacote + subclasses em outros pacotes

### 3. Esquecer que Default é o Padrão

```java
class MinhaClasse {} // Sem public = default (não acessível de fora)
```

**Erro comum**: Esperar que classe seja pública, mas é package-private.

---

## Boas Práticas

### 1. Use Default para Classes Auxiliares

```java
// Pública
public class Usuario {}

// Package-private (auxiliar)
class ValidadorCPF {}
```

### 2. Prefira Menor Visibilidade Possível

**Ordem de preferência**: `private` → `default` → `protected` → `public`

```java
private void metodoPrivado() {}      // 1ª escolha
void metodoDefault() {}              // 2ª escolha
protected void metodoProtected() {}  // 3ª escolha
public void metodoPublico() {}       // Último recurso
```

### 3. Documente Classes Default

```java
/**
 * Classe interna para validação de CPF.
 * Não deve ser usada fora do pacote modelo.
 */
class ValidadorCPF {}
```

### 4. Evite Default em APIs Públicas

**Bibliotecas**: Use `public` para expor, `private` para ocultar (não default).

### 5. Use Default para Encapsular Implementação

```java
public class Facade {
    public void operacaoPublica() {
        Helper.ajudar(); // Usa classe package-private
    }
}

class Helper { // Default, encapsulado
    static void ajudar() {}
}
```

---

## Resumo

**Default (package-private)**:

**Definição**: Sem modificador de acesso explícito.

**Visibilidade**: Apenas **mesmo pacote**.

**Sintaxe**:
```java
class MinhaClasse {}        // Classe default
void meuMetodo() {}         // Método default
int meuAtributo;            // Atributo default
```

**Tabela de acesso**:

| Modificador | Classe | Pacote | Subclasse | Global |
|-------------|--------|--------|-----------|--------|
| public      | ✅      | ✅      | ✅         | ✅      |
| protected   | ✅      | ✅      | ✅         | ❌      |
| **default** | ✅      | ✅      | ❌         | ❌      |
| private     | ✅      | ❌      | ❌         | ❌      |

**Uso**:
- Classes auxiliares internas ao pacote
- Métodos/atributos de uso interno
- Encapsular implementação

**Regra de Ouro**: Use **default** para **encapsular implementação** dentro do pacote, sem expor para outros pacotes.
