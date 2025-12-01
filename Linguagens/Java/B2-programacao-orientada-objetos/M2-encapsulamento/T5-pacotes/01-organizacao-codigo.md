# T5.01 - Organização de Código em Pacotes

## Introdução

**Pacotes** (packages) organizam classes relacionadas em **namespaces**, evitando conflitos de nomes e facilitando manutenção.

**Problemas sem pacotes**:
- Centenas de classes no mesmo namespace
- Conflito de nomes (duplicação)
- Difícil localização de classes
- Sem controle de acesso entre módulos

**Solução**: Agrupar classes em pacotes lógicos.

---

## Fundamentos

### 1. Definição de Pacote

**Pacote** = Agrupamento lógico de classes, interfaces e enums.

**Analogia**: Pastas no sistema de arquivos.

```java
// Pacote: br.com.empresa.ecommerce.modelo
package br.com.empresa.ecommerce.modelo;

public class Produto {
    private String nome;
    private double preco;
}
```

**Estrutura**:
```
br/
  com/
    empresa/
      ecommerce/
        modelo/
          Produto.java
        servico/
          ProdutoService.java
        repositorio/
          ProdutoRepository.java
```

### 2. Namespace e Conflito de Nomes

**Sem pacotes**: Nome completo = `Produto`

**Com pacotes**: Nome completo = `br.com.empresa.ecommerce.modelo.Produto`

**Evita conflitos**:
```java
// Duas classes "Produto" em pacotes diferentes
package br.com.empresa.ecommerce.modelo;
public class Produto {} // E-commerce

package br.com.empresa.estoque.modelo;
public class Produto {} // Estoque

// Uso simultâneo
import br.com.empresa.ecommerce.modelo.Produto as ProdutoEcommerce;
import br.com.empresa.estoque.modelo.Produto as ProdutoEstoque;
// (Java não suporta alias, usar nome completo)
```

**Resolução de conflito**:
```java
br.com.empresa.ecommerce.modelo.Produto produtoEcommerce = new br.com.empresa.ecommerce.modelo.Produto();
br.com.empresa.estoque.modelo.Produto produtoEstoque = new br.com.empresa.estoque.modelo.Produto();
```

### 3. Hierarquia de Pacotes

**Pacotes seguem estrutura hierárquica** (separados por `.`):

```
br.com.empresa
  ├─ ecommerce
  │   ├─ modelo
  │   ├─ servico
  │   └─ repositorio
  ├─ financeiro
  │   ├─ modelo
  │   └─ servico
  └─ estoque
      ├─ modelo
      └─ controle
```

**Importante**: `br.com.empresa.ecommerce` **NÃO** é pai de `br.com.empresa.ecommerce.modelo` (relação é apenas nomenclatura).

### 4. Organização por Camadas

**Padrão MVC/3 camadas**:

```
br.com.empresa.ecommerce
  ├─ controller    (apresentação)
  ├─ service       (lógica de negócio)
  ├─ repository    (acesso a dados)
  └─ model         (entidades)
```

**Exemplo**:
```java
// Model
package br.com.empresa.ecommerce.model;
public class Usuario {}

// Repository
package br.com.empresa.ecommerce.repository;
public class UsuarioRepository {}

// Service
package br.com.empresa.ecommerce.service;
import br.com.empresa.ecommerce.model.Usuario;
import br.com.empresa.ecommerce.repository.UsuarioRepository;
public class UsuarioService {}

// Controller
package br.com.empresa.ecommerce.controller;
import br.com.empresa.ecommerce.service.UsuarioService;
public class UsuarioController {}
```

### 5. Organização por Funcionalidade

**Alternativa**: Agrupar por módulo de negócio:

```
br.com.empresa.ecommerce
  ├─ usuario
  │   ├─ Usuario.java
  │   ├─ UsuarioService.java
  │   └─ UsuarioRepository.java
  ├─ produto
  │   ├─ Produto.java
  │   ├─ ProdutoService.java
  │   └─ ProdutoRepository.java
  └─ pedido
      ├─ Pedido.java
      ├─ PedidoService.java
      └─ PedidoRepository.java
```

**Vantagem**: Coesão por contexto de negócio.

### 6. Pacotes e Controle de Acesso

**Modificador `default` (package-private)**: Acesso apenas no mesmo pacote.

```java
// Pacote: br.com.empresa.ecommerce.modelo
package br.com.empresa.ecommerce.modelo;

class ValidadorCPF { // default (package-private)
    boolean validar(String cpf) {
        return cpf.length() == 11;
    }
}

public class Usuario {
    private String cpf;

    public void setCpf(String cpf) {
        ValidadorCPF validador = new ValidadorCPF(); // OK (mesmo pacote)
        if (validador.validar(cpf)) {
            this.cpf = cpf;
        }
    }
}
```

```java
// Pacote: br.com.empresa.ecommerce.service
package br.com.empresa.ecommerce.service;

import br.com.empresa.ecommerce.modelo.ValidadorCPF; // ERRO: não visível

public class UsuarioService {
    public void processar() {
        ValidadorCPF validador = new ValidadorCPF(); // ERRO
    }
}
```

### 7. Unidade de Compilação

**1 arquivo .java = 1 classe pública** (regra geral).

```java
// Arquivo: Produto.java
package br.com.empresa.ecommerce.modelo;

public class Produto {} // Pública, nome = arquivo

class ProdutoHelper {} // Package-private, mesmo arquivo OK
```

**❌ Erro**: Múltiplas classes públicas no mesmo arquivo.

```java
// Arquivo: Produto.java
package br.com.empresa.ecommerce.modelo;

public class Produto {}
public class Categoria {} // ERRO: apenas 1 classe pública por arquivo
```

### 8. Modularidade e Reutilização

**Pacotes facilitam reutilização**:

```java
// Biblioteca compartilhada
br.com.empresa.comum
  ├─ util
  │   ├─ StringUtils.java
  │   └─ DateUtils.java
  └─ validacao
      ├─ ValidadorCPF.java
      └─ ValidadorEmail.java

// Projeto 1
br.com.empresa.ecommerce
  └─ (importa br.com.empresa.comum)

// Projeto 2
br.com.empresa.financeiro
  └─ (importa br.com.empresa.comum)
```

### 9. Separação de Responsabilidades

**Cada pacote = 1 responsabilidade**:

```java
br.com.empresa.ecommerce
  ├─ model         // Apenas entidades de domínio
  ├─ repository    // Apenas acesso a dados
  ├─ service       // Apenas lógica de negócio
  ├─ controller    // Apenas controle de requisições
  └─ util          // Apenas utilitários
```

**Princípio SRP** (Single Responsibility Principle): Cada pacote deve ter apenas um motivo para mudar.

### 10. Pacotes em Bibliotecas e Frameworks

**Java padrão**:
```
java.lang     // Classes fundamentais (String, Object, System)
java.util     // Utilitários (List, Map, Collections)
java.io       // Entrada/Saída
java.nio      // Nova I/O
java.time     // Data e hora (Java 8+)
```

**Spring Framework**:
```
org.springframework.boot
org.springframework.context
org.springframework.web
org.springframework.data
```

**Padrão**: Domínio invertido (`org.springframework`, `com.google`, `br.com.empresa`).

---

## Aplicabilidade

**Use pacotes quando**:
- Projeto com **múltiplas classes** (mais de 5-10)
- Organizar **camadas** (MVC, hexagonal)
- Evitar **conflitos de nomes**
- Agrupar **funcionalidades relacionadas**
- Criar **bibliotecas reutilizáveis**

**Estrutura pequena** (projeto aprendizado):
```
aprendizado
  ├─ Usuario.java
  └─ Main.java
// Pacote padrão (não recomendado para produção)
```

**Estrutura média** (aplicação real):
```
br.com.empresa.ecommerce
  ├─ model
  ├─ service
  ├─ repository
  └─ controller
```

**Estrutura grande** (enterprise):
```
br.com.empresa.ecommerce
  ├─ usuario
  │   ├─ model
  │   ├─ service
  │   └─ repository
  ├─ produto
  │   ├─ model
  │   ├─ service
  │   └─ repository
  └─ comum
      └─ util
```

---

## Armadilhas

### 1. Pacotes Muito Profundos

```java
// ❌ Hierarquia excessiva
br.com.empresa.divisao.setor.departamento.area.sistema.modulo.submodulo.classe.Usuario

// ✅ Simplificar
br.com.empresa.ecommerce.usuario.Usuario
```

### 2. Pacotes Muito Genéricos

```java
// ❌ Nomes vagos
br.com.empresa.util
br.com.empresa.comum
br.com.empresa.outros

// ✅ Específicos
br.com.empresa.ecommerce.validacao
br.com.empresa.ecommerce.formatacao
```

### 3. Misturar Responsabilidades

```java
// ❌ Service + Repository no mesmo pacote
br.com.empresa.ecommerce.dados
  ├─ UsuarioService.java    // Lógica de negócio
  └─ UsuarioRepository.java // Acesso a dados

// ✅ Separar
br.com.empresa.ecommerce.service
  └─ UsuarioService.java
br.com.empresa.ecommerce.repository
  └─ UsuarioRepository.java
```

### 4. Pacote Padrão (Default Package)

```java
// ❌ Sem declaração package
public class Usuario {} // Pacote padrão

// ✅ Sempre declare pacote
package br.com.empresa.ecommerce.model;
public class Usuario {}
```

**Problema**: Classes no pacote padrão **não podem ser importadas** por classes em pacotes nomeados.

---

## Boas Práticas

### 1. Domínio Invertido

```java
// ✅ Empresa: empresa.com.br
package br.com.empresa.ecommerce;

// ✅ Projeto open-source: github.com/usuario/projeto
package com.github.usuario.projeto;
```

### 2. Lowercase

```java
// ✅ Pacotes em minúsculas
package br.com.empresa.ecommerce.modelo;

// ❌ Evitar maiúsculas
package br.com.empresa.Ecommerce.Modelo;
```

### 3. Sem Underscores ou Caracteres Especiais

```java
// ✅
package br.com.empresa.ecommerce;

// ❌
package br.com.empresa.e_commerce;
package br.com.empresa.e-commerce; // ERRO: hífen inválido
```

### 4. Agrupar Classes Relacionadas

```java
// ✅ Validações juntas
br.com.empresa.ecommerce.validacao
  ├─ ValidadorCPF.java
  ├─ ValidadorEmail.java
  └─ ValidadorCEP.java
```

### 5. Documentar Estrutura

```
README.md ou ARCHITECTURE.md

## Estrutura de Pacotes

- `model`: Entidades de domínio
- `service`: Lógica de negócio
- `repository`: Acesso a dados
- `controller`: Endpoints REST
- `config`: Configurações Spring
- `util`: Utilitários gerais
```

---

## Resumo

**Pacotes organizam código**:

**Sintaxe**:
```java
package br.com.empresa.ecommerce.modelo;
```

**Estrutura de diretórios** reflete pacotes:
```
br/com/empresa/ecommerce/modelo/Produto.java
```

**Benefícios**:
- **Namespace**: Evita conflitos de nomes
- **Organização**: Agrupa classes relacionadas
- **Modularidade**: Reutilização entre projetos
- **Controle de acesso**: Package-private
- **Manutenibilidade**: Código estruturado

**Boas práticas**:
- Domínio invertido (`br.com.empresa`)
- Lowercase
- Hierarquia clara (não excessiva)
- Separação de responsabilidades
- Evitar pacote padrão

**Regra de Ouro**: Organize pacotes por **camadas** (MVC) ou **funcionalidades** (DDD), nunca misture responsabilidades.
