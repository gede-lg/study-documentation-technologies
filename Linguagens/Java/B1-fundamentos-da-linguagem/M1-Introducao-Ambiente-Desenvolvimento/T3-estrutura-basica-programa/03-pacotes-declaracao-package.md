# Pacotes (Packages) e Declaração Package

## 🎯 Introdução e Definição

### Definição Conceitual

**Pacotes (packages)** em Java são mecanismos de **organização hierárquica de classes** que funcionam como **namespaces** - espaços de nomes que agrupam classes relacionadas e evitam conflitos de nomenclatura. São análogos a diretórios/pastas no sistema de arquivos: assim como pastas organizam arquivos, pacotes organizam classes.

Um pacote define **escopo** e **contexto** - duas classes podem ter mesmo nome se estiverem em pacotes diferentes. Além de organização, pacotes controlam **visibilidade** através do modificador de acesso package-private (default), criando **fronteiras de encapsulamento** entre módulos de software.

### Contexto Histórico e Motivação

#### O Problema: Conflito de Nomes (Name Collision)

Antes de pacotes, linguagens tinham **namespace global único**:

**C (sem namespaces)**:
```c
// Biblioteca A define:
void print() { /* implementação A */ }

// Biblioteca B também define:
void print() { /* implementação B */ }

// CONFLITO! Ambas não podem coexistir no mesmo programa
```

**Solução Arcaica**: Prefixos manuais
```c
void libA_print() { }  // Prefixo libA_
void libB_print() { }  // Prefixo libB_
```

**Problema**: Sem suporte da linguagem, convenção frágil (desenvolvedores podem esquecer).

#### Java: Pacotes como Namespaces

**Java (1995)** introduziu pacotes inspirado em módulos de **Modula-2** e **Ada**:

```java
// Biblioteca A
package com.empresaA.util;
public class StringHelper { }

// Biblioteca B
package com.empresaB.util;
public class StringHelper { }

// SEM CONFLITO! Pacotes diferentes = classes diferentes
```

**Acesso Completo (Fully Qualified Name)**:
```java
com.empresaA.util.StringHelper helperA = new com.empresaA.util.StringHelper();
com.empresaB.util.StringHelper helperB = new com.empresaB.util.StringHelper();
```

#### Convenção de Domínio Invertido

**Java estabeleceu convenção** (não obrigatória, mas universal): usar **domínio internet invertido** como prefixo.

**Razão**: Garantir unicidade global.

**Exemplos**:
```
Oracle (oracle.com)       → package com.oracle.database
Google (google.com)       → package com.google.maps
Apache (apache.org)       → package org.apache.commons
```

**Vantagem**: Probabilidade de colisão global ~zero (domínios são únicos).

### Problema Fundamental que Resolve

Pacotes resolvem **quatro problemas arquiteturais**:

#### 1. Organização de Código

**Problema**: Projeto com 500 classes - como encontrar classe específica?

**Solução**: Hierarquia de pacotes
```
com.empresa.projeto
├── modelo/        (Classes de domínio)
│   ├── Cliente
│   ├── Pedido
│   └── Produto
├── servico/       (Lógica de negócio)
│   ├── ClienteService
│   └── PedidoService
├── repositorio/   (Acesso a dados)
│   └── ClienteRepository
└── util/          (Utilitários)
    └── ValidadorCPF
```

#### 2. Evitar Conflito de Nomes

**Cenário**: Duas bibliotecas definem classe `Date`.

```java
// JDK
package java.util;
public class Date { }

// Biblioteca externa
package org.joda.time;
public class Date { }

// Uso:
java.util.Date dataJDK = new java.util.Date();
org.joda.time.Date dataJoda = new org.joda.time.Date();
```

#### 3. Controle de Acesso (Encapsulamento)

**Package-private** (default): Visível apenas no mesmo pacote.

```java
// Arquivo: com/empresa/util/Helper.java
package com.empresa.util;

class Helper {  // Sem public - package-private
    static void metodoInterno() { }
}

// Arquivo: com/empresa/util/Usuario.java
package com.empresa.util;

public class Usuario {
    void usar() {
        Helper.metodoInterno();  // ✅ OK: mesmo pacote
    }
}

// Arquivo: com/empresa/Main.java
package com.empresa;

public class Main {
    void usar() {
        // Helper.metodoInterno();  // ❌ ERRO: pacote diferente
    }
}
```

#### 4. Modularização Lógica

**Separação de Responsabilidades**:
```java
com.empresa.ecommerce
├── pagamento/    (Tudo sobre pagamentos)
│   ├── CartaoCredito
│   ├── Boleto
│   └── Pix
├── frete/        (Tudo sobre frete)
│   ├── Correios
│   └── TransportadoraPrivada
└── notificacao/  (Tudo sobre notificações)
    ├── EmailService
    └── SMSService
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Namespace Hierárquico**: Organização em árvore (com.empresa.projeto.modulo)
2. **Correspondência com Diretórios**: Estrutura de pacotes = estrutura de pastas
3. **Declaração package**: Primeira linha de código (exceto comentários)
4. **Fully Qualified Name**: nome.completo.do.pacote.NomeDaClasse
5. **Convenção de Domínio Invertido**: Unicidade global

### Pilares Fundamentais

- **Declaração**: `package nome.do.pacote;`
- **Separador**: Ponto (`.`) - níveis hierárquicos
- **Correspondência Física**: `com.exemplo.util` → diretório `com/exemplo/util/`
- **Package-private**: Modificador de acesso padrão (sem public/private/protected)
- **Default Package**: Sem declaração package (não recomendado)

### Visão Geral das Nuances

- **Subpacotes NÃO herdam acesso**: `com.empresa` e `com.empresa.util` são independentes
- **Importar pacote NÃO importa subpacotes**: `import com.empresa.*` não importa `com.empresa.util.*`
- **java.lang**: Único pacote importado automaticamente
- **Modularização (Java 9+)**: JPMS adiciona camada acima de pacotes

---

## 🧠 Fundamentos Teóricos

### Sintaxe da Declaração Package

**Formato**:
```java
package identificador[.identificador]*;
```

**Regras**:
- **Primeira instrução** do arquivo (exceto comentários)
- **Uma única declaração** por arquivo
- **Identificadores** seguem regras de nomes Java

**Exemplo Completo**:
```java
// 1. Comentários (opcional) - PODEM vir antes
/*
 * Arquivo: Cliente.java
 * Versão: 1.0
 */

// 2. PACKAGE (primeira instrução de código)
package com.empresa.comercial.modelo;

// 3. Imports (depois de package)
import java.util.Date;

// 4. Classe
public class Cliente {
    // ...
}
```

### Estrutura Hierárquica

**Níveis Hierárquicos**:
```java
package com.empresa.projeto.modulo.submodulo;
//      └─1─┘ └──2──┘ └─3──┘ └──4──┘ └───5────┘
```

**Interpretação**:
- **Nível 1 (com)**: Domínio de alto nível (comercial)
- **Nível 2 (empresa)**: Organização
- **Nível 3 (projeto)**: Nome do projeto
- **Nível 4 (modulo)**: Módulo funcional
- **Nível 5 (submodulo)**: Submódulo específico

**Mapeamento para Diretórios**:
```
src/main/java/
└── com/
    └── empresa/
        └── projeto/
            └── modulo/
                └── submodulo/
                    └── MinhaClasse.java
```

### Convenções de Nomenclatura

**Regras Oficiais (Oracle)**:

1. **Lowercase**: Sempre minúsculas
```java
package com.exemplo.util;      // ✅ Correto
package com.Exemplo.Util;      // ❌ Evitar (convenção)
```

2. **Domínio Invertido**: Usar domínio da organização
```java
// Empresa: minhaempresa.com.br
package br.com.minhaempresa.projeto;  // ✅ Correto
```

3. **Sem Underscore/Hífen**: Usar camelCase se necessário
```java
package com.empresa.meuProjeto;     // ✅ OK (mas evitar camelCase)
package com.empresa.meuprojeto;     // ✅ Preferível
package com.empresa.meu_projeto;    // ❌ Evitar underscores
```

4. **Palavras Reservadas**: Não usar palavras-chave
```java
package com.empresa.class;    // ❌ ERRO: "class" é palavra-chave
package com.empresa.klass;    // ✅ Alternativa válida
```

**Estrutura Típica de Projeto**:
```
com.empresa.nomedoprojeto
├── modelo          (ou domain, entity)
├── servico         (ou service)
├── repositorio     (ou repository, dao)
├── controlador     (ou controller, web)
├── dto             (Data Transfer Objects)
├── excecao         (ou exception)
├── util            (ou utils, helper)
└── config          (Configurações)
```

### Default Package (Sem Declaração)

**Código Sem Package**:
```java
// Arquivo: MinhaClasse.java (sem package)
public class MinhaClasse {
    public static void main(String[] args) {
        System.out.println("Sem pacote");
    }
}
```

**Compilação e Execução**:
```bash
javac MinhaClasse.java
java MinhaClasse  # Funciona
```

**Problemas**:

1. **Não pode ser importado**:
```java
// Arquivo em outro pacote:
package com.exemplo;
// import MinhaClasse;  // ❌ ERRO: classes em default package não podem ser importadas
```

2. **Namespace global poluído**: Alto risco de colisões

3. **Não profissional**: Código de produção SEMPRE deve ter package

**Quando Usar**: **Nunca em produção**. Apenas para:
- Exemplos didáticos muito simples
- Testes rápidos (throwaway code)

### Fully Qualified Name (FQN)

**Definição**: Nome completo de classe incluindo pacote.

**Formato**: `pacote.completo.NomeDaClasse`

**Uso**:
```java
// Sem import - usar FQN:
java.util.ArrayList<String> lista = new java.util.ArrayList<>();
java.util.Date data = new java.util.Date();

// Com import - nome simples:
import java.util.ArrayList;
import java.util.Date;

ArrayList<String> lista = new ArrayList<>();
Date data = new Date();
```

**Disambiguação**:
```java
// Ambiguidade: duas classes Date
import java.util.Date;
import java.sql.Date;  // ❌ ERRO: conflito

// Solução: usar FQN para uma delas
import java.util.Date;

java.util.Date dataUtil = new Date();       // Importado
java.sql.Date dataSql = new java.sql.Date(0);  // FQN
```

### Correspondência com Sistema de Arquivos

**Regra Obrigatória**: Estrutura de pacotes **deve corresponder** à estrutura de diretórios.

**Exemplo**:
```java
// Arquivo Java
package com.empresa.projeto.util;

public class StringHelper {
    // ...
}
```

**Localização Obrigatória**:
```
src/
└── com/
    └── empresa/
        └── projeto/
            └── util/
                └── StringHelper.java  ← DEVE estar aqui
```

**Compilação**:
```bash
# Compilar com javac
javac -d bin src/com/empresa/projeto/util/StringHelper.java

# Estrutura gerada em bin/:
bin/
└── com/
    └── empresa/
        └── projeto/
            └── util/
                └── StringHelper.class
```

**Execução**:
```bash
# Se StringHelper tem main:
cd bin
java com.empresa.projeto.util.StringHelper
# Ou:
java -cp bin com.empresa.projeto.util.StringHelper
```

---

## 🔍 Análise Conceitual Profunda

### Subpacotes NÃO Herdam Acesso

**Conceito Importante**: Pacotes são **independentes**, mesmo que hierárquicos.

```java
// Pacote pai
package com.empresa;
class Helper {  // package-private
    static void metodo() { }
}

// Subpacote (tecnicamente pacote DIFERENTE)
package com.empresa.util;
class Usuario {
    void usar() {
        // Helper.metodo();  // ❌ ERRO: com.empresa.util NÃO tem acesso a com.empresa
    }
}
```

**Analogia**: `com.empresa` e `com.empresa.util` são tão independentes quanto `com.empresa` e `org.apache`.

**Hierarquia é Apenas Nomenclatura**: Não cria relação de herança/acesso.

### Package-Private: Modificador de Acesso Padrão

**Sem Modificador de Acesso** = package-private:

```java
package com.exemplo.util;

// Classe package-private (sem public)
class Helper {
    // Método package-private (sem modificador)
    void metodoInterno() { }
    
    // Atributo package-private
    int valor;
}

public class Usuario {
    void usar() {
        Helper h = new Helper();    // ✅ OK: mesmo pacote
        h.metodoInterno();          // ✅ OK
        h.valor = 10;               // ✅ OK
    }
}
```

```java
package com.exemplo;  // Pacote DIFERENTE

import com.exemplo.util.Helper;  // ❌ ERRO: Helper não é public

public class Main {
    void usar() {
        // Helper h = new Helper();  // ❌ ERRO: não visível
    }
}
```

**Uso**: Criar classes **auxiliares internas** ao pacote (não expostas externamente).

### Compilação Multi-Pacote

**Estrutura**:
```
src/
├── com/
│   └── exemplo/
│       ├── Main.java
│       └── util/
│           └── Helper.java
```

**Compilar Tudo**:
```bash
# Opção 1: Compilar arquivos individualmente
javac -d bin src/com/exemplo/Main.java src/com/exemplo/util/Helper.java

# Opção 2: Usar wildcard (cuidado: só compila arquivos no diretório, não recursivo)
javac -d bin src/com/exemplo/*.java src/com/exemplo/util/*.java

# Opção 3: Usar find (Linux/Mac) para compilação recursiva
find src -name "*.java" -print | xargs javac -d bin

# Opção 4: Usar ferramenta de build (Maven, Gradle) - recomendado
mvn compile
```

---

## 🎯 Aplicabilidade e Contextos

### Projeto Maven/Gradle: Estrutura Padrão

**Maven**:
```
meu-projeto/
├── pom.xml
└── src/
    ├── main/
    │   └── java/
    │       └── com/
    │           └── empresa/
    │               └── projeto/
    │                   ├── Main.java
    │                   ├── modelo/
    │                   ├── servico/
    │                   └── util/
    └── test/
        └── java/
            └── com/
                └── empresa/
                    └── projeto/
                        └── MainTest.java
```

**Gradle**:
```
meu-projeto/
├── build.gradle
└── src/
    ├── main/
    │   └── java/
    │       └── com/
    │           └── empresa/
    │               └── projeto/
    └── test/
        └── java/
            └── com/
                └── empresa/
                    └── projeto/
```

### Exemplo Completo de Projeto

**Estrutura**:
```
src/com/empresa/loja/
├── Main.java
├── modelo/
│   ├── Produto.java
│   └── Cliente.java
├── servico/
│   └── VendaService.java
└── util/
    └── ValidadorCPF.java
```

**Produto.java**:
```java
package com.empresa.loja.modelo;

public class Produto {
    private String nome;
    private double preco;
    
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    // Getters/setters
}
```

**VendaService.java**:
```java
package com.empresa.loja.servico;

import com.empresa.loja.modelo.Produto;
import com.empresa.loja.modelo.Cliente;

public class VendaService {
    public void registrarVenda(Cliente cliente, Produto produto) {
        System.out.println("Vendendo " + produto.getNome() + " para " + cliente.getNome());
    }
}
```

**Main.java**:
```java
package com.empresa.loja;

import com.empresa.loja.modelo.Produto;
import com.empresa.loja.modelo.Cliente;
import com.empresa.loja.servico.VendaService;

public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("João");
        Produto produto = new Produto("Notebook", 2500.0);
        
        VendaService servico = new VendaService();
        servico.registrarVenda(cliente, produto);
    }
}
```

**Compilação**:
```bash
javac -d bin src/com/empresa/loja/**/*.java
java -cp bin com.empresa.loja.Main
```

---

## ⚠️ Limitações e Considerações Teóricas

### Erros Comuns

**1. Package Não Corresponde a Diretório**:
```java
// Arquivo: src/com/exemplo/util/Helper.java
package com.exemplo;  // ❌ ERRO: deveria ser com.exemplo.util
```

**Erro de Compilação**: `class Helper is public, should be declared in a file named Helper.java`

**2. Package Após Import**:
```java
import java.util.*;    // ❌ ERRO: import antes de package
package com.exemplo;
```

**Ordem Correta**: package → imports → classe

---

## 🔗 Interconexões Conceituais

### Relação com Imports

Pacotes e imports trabalham juntos:
- **package**: Define onde classe está
- **import**: Declara que classes externas serão usadas

Próximo tópico detalha imports.

---

## 🚀 Evolução e Próximos Conceitos

### Java Modules (JPMS - Java 9+)

**Camada Acima de Pacotes**: Módulos agrupam pacotes.

```java
// module-info.java
module com.empresa.projeto {
    exports com.empresa.projeto.api;  // Exporta pacote
    requires java.sql;                // Depende de módulo java.sql
}
```

**Vantagens**: Encapsulamento mais forte que pacotes.

### Próximos Passos

Estudar **imports** (como usar classes de outros pacotes) - próximo arquivo.
