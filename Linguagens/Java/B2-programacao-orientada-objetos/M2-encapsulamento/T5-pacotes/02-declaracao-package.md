# T5.02 - Declaração de Package

## Introdução

**Declaração `package`** define o namespace da classe, **obrigatória** em projetos profissionais.

**Sintaxe**:
```java
package nome.do.pacote;
```

**Regra**: Primeira instrução do arquivo (exceto comentários).

---

## Fundamentos

### 1. Sintaxe de Declaração

**Estrutura básica**:
```java
package br.com.empresa.ecommerce.modelo;

public class Produto {
    private String nome;
    private double preco;
}
```

**Elementos**:
- `package`: palavra-chave
- `br.com.empresa.ecommerce.modelo`: nome completo do pacote
- `.`: separador de níveis hierárquicos
- `;`: termina declaração

### 2. Posição no Arquivo

**Ordem obrigatória**:
```java
// 1. Comentários (opcional)
/**
 * Classe Produto do sistema de e-commerce
 */

// 2. Package (obrigatório, primeira instrução não-comentário)
package br.com.empresa.ecommerce.modelo;

// 3. Imports (opcional)
import java.time.LocalDate;
import java.math.BigDecimal;

// 4. Classe
public class Produto {
    // ...
}
```

**❌ Erro**: Package após import ou classe
```java
import java.util.List;
package br.com.empresa; // ERRO: package deve vir antes
```

### 3. Uma Declaração Por Arquivo

**Regra**: 1 arquivo `.java` = 1 declaração `package` (ou nenhuma).

```java
// ✅ Válido
package br.com.empresa.ecommerce.modelo;
public class Produto {}
```

```java
// ❌ Inválido
package br.com.empresa.ecommerce.modelo;
package br.com.empresa.ecommerce.servico; // ERRO: duplicado
```

### 4. Pacote Padrão (Default Package)

**Sem declaração `package`**: Classe fica no **pacote padrão**.

```java
// Sem package (pacote padrão)
public class Usuario {
    // ...
}
```

**Problema**: Classes no pacote padrão **não podem ser importadas**.

```java
// Outra classe
package br.com.empresa.ecommerce;

import Usuario; // ERRO: não funciona com pacote padrão
```

**Uso**: Apenas em testes rápidos ou aprendizado, **nunca em produção**.

### 5. Nome Totalmente Qualificado (Fully Qualified Name)

**FQN** = `pacote` + `.` + `classe`

```java
package br.com.empresa.ecommerce.modelo;
public class Produto {}

// FQN: br.com.empresa.ecommerce.modelo.Produto
```

**Uso do FQN**:
```java
// Sem import, usar FQN
br.com.empresa.ecommerce.modelo.Produto produto = new br.com.empresa.ecommerce.modelo.Produto();

// Com import, usar nome simples
import br.com.empresa.ecommerce.modelo.Produto;
Produto produto = new Produto();
```

### 6. Declaração e Estrutura de Diretórios

**Package deve refletir estrutura de pastas**:

```java
package br.com.empresa.ecommerce.modelo;
```

**Estrutura obrigatória**:
```
src/
  br/
    com/
      empresa/
        ecommerce/
          modelo/
            Produto.java
```

**❌ Erro**: Arquivo em diretório diferente do package
```
src/
  modelo/
    Produto.java  // ERRO: esperado src/br/com/empresa/ecommerce/modelo/
```

### 7. Nomenclatura de Pacotes

**Convenção**: Letras minúsculas, sem underscores.

```java
// ✅ Correto
package br.com.empresa.ecommerce.modelo;

// ❌ Evitar
package br.com.empresa.Ecommerce.Modelo; // Maiúsculas
package br.com.empresa.e_commerce;        // Underscore
```

**Palavras-chave Java**: Evitar (class, int, public, etc.)

```java
// ❌ Evitar
package br.com.empresa.public; // 'public' é palavra-chave
```

### 8. Subpacotes (Independência)

**Importante**: `br.com.empresa.ecommerce` ≠ pai de `br.com.empresa.ecommerce.modelo`.

```java
// Pacote: br.com.empresa.ecommerce
package br.com.empresa.ecommerce;
class Utils {} // package-private

// Pacote: br.com.empresa.ecommerce.modelo
package br.com.empresa.ecommerce.modelo;

public class Produto {
    public void metodo() {
        Utils utils = new Utils(); // ERRO: pacotes diferentes
    }
}
```

**Cada pacote é independente**, mesmo com hierarquia nominal.

### 9. Declaração em Classes Internas

**Classes internas** herdam package da classe externa:

```java
package br.com.empresa.ecommerce.modelo;

public class Produto {
    // Classe interna
    class Categoria {
        // Mesmo package: br.com.empresa.ecommerce.modelo
    }
}
```

**Não é possível** declarar package diferente em classe interna.

### 10. Package e Módulos (Java 9+)

**Módulos** (`module-info.java`) agrupam pacotes:

```java
// module-info.java
module br.com.empresa.ecommerce {
    exports br.com.empresa.ecommerce.modelo; // Expõe pacote
    requires java.sql;
}
```

**Package continua sendo declarado normalmente**:
```java
package br.com.empresa.ecommerce.modelo;
public class Produto {}
```

---

## Aplicabilidade

**Declare package quando**:
- Projeto profissional (sempre)
- Múltiplas classes
- Evitar conflitos de nomes
- Controle de visibilidade (package-private)

**Omita package apenas em**:
- Scripts de teste rápido
- Exemplos de aprendizado isolados
- **Nunca em produção**

---

## Armadilhas

### 1. Package Após Import

```java
import java.util.List;
package br.com.empresa; // ERRO: package deve vir antes

// ✅ Correto
package br.com.empresa;
import java.util.List;
```

### 2. Diretório Não Corresponde ao Package

**Declaração**:
```java
package br.com.empresa.ecommerce.modelo;
```

**Arquivo localizado**:
```
src/modelo/Produto.java  // ERRO
```

**Correto**:
```
src/br/com/empresa/ecommerce/modelo/Produto.java
```

**Erro de compilação**: `class is public, should be declared in a file named Produto.java`

### 3. Usar Maiúsculas em Pacote

```java
// ❌ Evitar
package Br.Com.Empresa.Ecommerce;

// ✅ Correto
package br.com.empresa.ecommerce;
```

**Convenção Java**: Pacotes lowercase, classes PascalCase.

### 4. Esquecer Ponto-e-vírgula

```java
package br.com.empresa.ecommerce.modelo // ERRO: falta ;

// ✅ Correto
package br.com.empresa.ecommerce.modelo;
```

### 5. Declarar Package em Múltiplas Linhas

```java
// ❌ Inválido
package br.com.empresa
         .ecommerce.modelo;

// ✅ Correto (1 linha)
package br.com.empresa.ecommerce.modelo;
```

---

## Boas Práticas

### 1. Sempre Declare Package

```java
// ✅ Sempre
package br.com.empresa.ecommerce.modelo;
public class Produto {}

// ❌ Nunca em produção
public class Produto {} // Pacote padrão
```

### 2. Use Domínio Invertido

```java
// ✅ Empresa: empresa.com.br
package br.com.empresa.ecommerce;

// ✅ GitHub: github.com/usuario/projeto
package com.github.usuario.projeto;
```

### 3. Lowercase e Sem Underscores

```java
// ✅
package br.com.empresa.ecommerce;

// ❌
package br.com.empresa.Ecommerce;
package br.com.empresa.e_commerce;
```

### 4. Organize por Camadas ou Funcionalidades

**Camadas**:
```java
package br.com.empresa.ecommerce.model;
package br.com.empresa.ecommerce.service;
package br.com.empresa.ecommerce.repository;
```

**Funcionalidades**:
```java
package br.com.empresa.ecommerce.usuario;
package br.com.empresa.ecommerce.produto;
package br.com.empresa.ecommerce.pedido;
```

### 5. Comentários Javadoc no Package

**Arquivo `package-info.java`** documenta pacote:

```java
/**
 * Modelo de domínio do sistema de e-commerce.
 * Contém entidades como Produto, Usuario, Pedido.
 */
package br.com.empresa.ecommerce.modelo;
```

**Útil para**:
- Documentação
- Anotações no pacote (`@NonNullApi`, `@Nullable`)

---

## Resumo

**Declaração package**:

**Sintaxe**:
```java
package nome.do.pacote;
```

**Regras**:
- **Primeira instrução** (após comentários)
- **Lowercase**, sem underscores
- **Reflete estrutura de diretórios**
- **Uma por arquivo**
- **Obrigatória em produção**

**Exemplo completo**:
```java
// Comentário
/**
 * Classe Produto
 */

// 1. Package
package br.com.empresa.ecommerce.modelo;

// 2. Imports
import java.math.BigDecimal;
import java.time.LocalDate;

// 3. Classe
public class Produto {
    private String nome;
    private BigDecimal preco;
    private LocalDate dataCadastro;
}
```

**Diretório correspondente**:
```
src/br/com/empresa/ecommerce/modelo/Produto.java
```

**FQN** (Fully Qualified Name):
```
br.com.empresa.ecommerce.modelo.Produto
```

**Regra de Ouro**: **Sempre declare `package`** em código profissional, usando domínio invertido e lowercase.
