# Estrutura de Diretórios e Arquivos .java

## 🎯 Introdução e Definição

### Definição Conceitual

**Estrutura de diretórios** em projetos Java refere-se à **organização física de arquivos e pastas** no sistema de arquivos, espelhando a **estrutura lógica de pacotes**. Cada pacote Java corresponde a um diretório, e cada classe/interface/enum Java está em um arquivo `.java` com nome idêntico ao da classe pública que contém.

Essa correspondência **obrigatória** entre estrutura lógica (pacotes) e física (diretórios) é um **requisito do compilador Java** e permite que ferramentas (compiladores, IDEs, build tools) localizem arquivos automaticamente.

### Regras Fundamentais

1. **Um arquivo `.java` = Uma classe pública** (ou interface/enum público)
2. **Nome do arquivo = Nome da classe pública**
   - Arquivo: `Cliente.java` → Classe: `public class Cliente`
3. **Estrutura de diretórios = Estrutura de pacotes**
   - Pacote: `com.empresa.modelo` → Diretório: `com/empresa/modelo/`
4. **Case-sensitive**: `Cliente.java` ≠ `cliente.java` (em sistemas Unix/Linux)

### Contexto Histórico

**Primeiras Linguagens (1950-70s)**:
- **FORTRAN**, **COBOL**: Um programa = um arquivo monolítico
- **C**: Headers (`.h`) + Implementation (`.c`) separados
```
projeto/
├── programa.h
└── programa.c
```

**C++ (1983)**: Headers + Implementation, mas sem estrutura de diretórios obrigatória
```
projeto/
├── include/
│   └── MinhaClasse.h
└── src/
    └── MinhaClasse.cpp
```

**Java (1995)**: Estrutura de diretórios **obrigatória** espelhando pacotes
```
src/
└── com/
    └── empresa/
        └── projeto/
            └── MinhaClasse.java
```

**Vantagem Java**: 
- **Localização automática**: Compilador encontra classes sem configuração
- **Evita conflitos**: Estrutura única previne colisões de nomes
- **Escalabilidade**: Projetos com milhares de classes permanecem organizados

### Problema Fundamental que Resolve

#### Organização em Projetos Grandes

**Problema sem estrutura**:
```
projeto/
├── Cliente.java
├── Pedido.java
├── Produto.java
├── ClienteService.java
├── PedidoService.java
├── ProdutoService.java
├── ClienteRepository.java
├── ... (centenas de arquivos)
```

**Dificuldades**:
- Impossível encontrar arquivos específicos
- Nenhuma separação lógica entre camadas
- Alto risco de nomes duplicados

**Solução com estrutura de diretórios**:
```
src/
└── com/
    └── empresa/
        └── comercial/
            ├── modelo/
            │   ├── Cliente.java
            │   ├── Pedido.java
            │   └── Produto.java
            ├── servico/
            │   ├── ClienteService.java
            │   ├── PedidoService.java
            │   └── ProdutoService.java
            └── repositorio/
                ├── ClienteRepository.java
                ├── PedidoRepository.java
                └── ProdutoRepository.java
```

**Vantagens**:
- ✅ **Organização clara**: Separação por camadas (modelo, serviço, repositório)
- ✅ **Navegação fácil**: IDEs navegam automaticamente
- ✅ **Escalabilidade**: Estrutura suporta crescimento do projeto
- ✅ **Build automatizado**: Maven/Gradle processam estrutura automaticamente

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Correspondência Pacote-Diretório**: `com.empresa.modelo` → `com/empresa/modelo/`
2. **Nome de Arquivo**: Deve corresponder exatamente à classe pública
3. **Estrutura Maven/Gradle**: `src/main/java/` e `src/test/java/`
4. **Arquivos `.class`**: Bytecode gerado em estrutura paralela
5. **Source Root**: Diretório raiz onde pacotes começam

### Pilares Fundamentais

**Estrutura Básica**:
```
projeto/
├── src/             (Source root)
│   └── pacote/
│       └── Classe.java
├── bin/             (Bytecode - javac)
│   └── pacote/
│       └── Classe.class
└── lib/             (Bibliotecas externas .jar)
```

**Estrutura Maven/Gradle**:
```
projeto/
├── src/
│   ├── main/
│   │   ├── java/        (Código fonte)
│   │   └── resources/   (Recursos - configs, properties)
│   └── test/
│       ├── java/        (Testes)
│       └── resources/   (Recursos de teste)
├── target/              (Maven: bytecode compilado)
└── build/               (Gradle: bytecode compilado)
```

### Visão Geral das Nuances

- **Source Root**: Onde compilador inicia busca de pacotes
- **Classpath**: Caminho onde JVM busca classes compiladas
- **JAR**: Archive com estrutura de diretórios compactada
- **Module Path** (Java 9+): JPMS adiciona `module-info.java`

---

## 🧠 Fundamentos Teóricos

### Regra: Um Arquivo, Uma Classe Pública

**Obrigatório**: Arquivo pode ter apenas **uma classe pública** (top-level).

**Válido**:
```java
// Arquivo: Cliente.java
package com.empresa.modelo;

public class Cliente {  // ✅ Uma classe pública
    // ...
}
```

**Inválido**:
```java
// Arquivo: Multiplas.java
package com.empresa;

public class Cliente {  // ❌ ERRO: mais de uma classe pública
    // ...
}

public class Pedido {   // ❌ ERRO: segunda classe pública
    // ...
}
```

**Erro de Compilação**:
```
Multiplas.java:7: error: class Pedido is public, should be declared in a file named Pedido.java
public class Pedido {
       ^
```

**Classes Não-Públicas no Mesmo Arquivo** (permitido, mas desencorajado):
```java
// Arquivo: Cliente.java
package com.empresa.modelo;

public class Cliente {  // ✅ Classe pública
    // ...
}

class ClienteHelper {   // ✅ Classe package-private (não pública)
    // Usada apenas internamente
}
```

**Problema**: `ClienteHelper` "invisível" - difícil de encontrar. **Preferir**: Arquivo separado.

### Correspondência Nome de Arquivo e Classe

**Regra**: Nome do arquivo **deve ser exatamente** nome da classe pública + `.java`.

**Correto**:
```java
// Arquivo: ContaBancaria.java
public class ContaBancaria {  // ✅ Nome corresponde
    // ...
}
```

**Incorreto**:
```java
// Arquivo: conta.java
public class ContaBancaria {  // ❌ ERRO: nome não corresponde
    // ...
}
```

**Erro**:
```
conta.java:1: error: class ContaBancaria is public, should be declared in a file named ContaBancaria.java
public class ContaBancaria {
       ^
```

**Case-Sensitivity**: Em sistemas Unix/Linux, `Cliente.java` ≠ `cliente.java`
```bash
# Linux/Mac:
$ javac cliente.java  # ❌ ERRO se classe é Cliente
$ javac Cliente.java  # ✅ OK

# Windows (geralmente case-insensitive, mas não recomendado):
$ javac cliente.java  # Pode funcionar, mas NÃO portável
```

### Correspondência Pacote-Diretório

**Regra Obrigatória**: Estrutura de diretórios **deve espelhar** estrutura de pacotes.

**Pacote**:
```java
package com.empresa.comercial.modelo;

public class Cliente {
    // ...
}
```

**Diretório Obrigatório**:
```
src/
└── com/
    └── empresa/
        └── comercial/
            └── modelo/
                └── Cliente.java  ← Deve estar exatamente aqui
```

**Compilação**:
```bash
# Compilar especificando source root
javac -d bin src/com/empresa/comercial/modelo/Cliente.java

# Estrutura gerada em bin/:
bin/
└── com/
    └── empresa/
        └── comercial/
            └── modelo/
                └── Cliente.class
```

**Erro Comum**: Arquivo em diretório errado
```
src/
└── com/
    └── empresa/
        └── Cliente.java  ← ❌ ERRADO: deveria estar em com/empresa/comercial/modelo/
```

**Erro ao Executar**:
```
Error: Could not find or load main class com.empresa.comercial.modelo.Cliente
```

### Source Root (Diretório Raiz)

**Source Root**: Diretório onde estrutura de pacotes **inicia**.

**Exemplo**:
```
projeto/
├── src/               ← Source root
│   └── com/
│       └── empresa/
│           └── Cliente.java
```

**Configuração IDE**:
- **IntelliJ**: Marca diretório como "Sources Root"
- **Eclipse**: Marca como "Source Folder"

**Compilação Manual**:
```bash
# Sem source root definido (erro):
$ javac Cliente.java  # ❌ ERRO: não encontra pacote

# Com source root (-sourcepath):
$ javac -sourcepath src -d bin src/com/empresa/Cliente.java  # ✅ OK
```

### Arquivos `.class` (Bytecode)

**Compilação gera `.class`** (bytecode Java):
```
src/com/empresa/Cliente.java  →  bin/com/empresa/Cliente.class
```

**Estrutura Paralela**:
```
projeto/
├── src/               (Código-fonte)
│   └── com/
│       └── empresa/
│           └── Cliente.java
└── bin/               (Bytecode compilado)
    └── com/
        └── empresa/
            └── Cliente.class
```

**Execução**:
```bash
# Compilar
javac -d bin src/com/empresa/Cliente.java

# Executar (informar classpath)
java -cp bin com.empresa.Cliente
```

**Classes Internas Geram Múltiplos `.class`**:
```java
// Arquivo: Externa.java
public class Externa {
    class Interna { }
    static class InternaNested { }
}
```

**Bytecode Gerado**:
```
Externa.class
Externa$Interna.class
Externa$InternaNested.class
```

### Estrutura Maven/Gradle (Padrão Moderno)

**Maven Project Layout**:
```
meu-projeto/
├── pom.xml                    (Configuração Maven)
├── src/
│   ├── main/
│   │   ├── java/             (Source root - código principal)
│   │   │   └── com/
│   │   │       └── empresa/
│   │   │           └── Main.java
│   │   └── resources/        (Arquivos de configuração, properties, XML)
│   │       ├── application.properties
│   │       └── logback.xml
│   └── test/
│       ├── java/             (Source root - testes)
│       │   └── com/
│       │       └── empresa/
│       │           └── MainTest.java
│       └── resources/        (Recursos de teste)
└── target/                    (Bytecode compilado - gerado por Maven)
    ├── classes/              (Classes principais)
    └── test-classes/         (Classes de teste)
```

**Gradle Project Layout** (similar):
```
meu-projeto/
├── build.gradle              (Configuração Gradle)
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
│       ├── java/
│       └── resources/
└── build/                    (Bytecode compilado - gerado por Gradle)
    ├── classes/
    │   ├── java/
    │   │   └── main/
    │   └── test/
    └── resources/
```

**Vantagens**:
- ✅ **Padrão universal**: Todos projetos Maven/Gradle seguem mesma estrutura
- ✅ **Separação código/testes**: `main/` vs `test/`
- ✅ **Separação código/recursos**: `java/` vs `resources/`
- ✅ **Build automatizado**: `mvn compile`, `gradle build`

### Recursos (resources/)

**Arquivos não-.java** (configuração, properties, XML, imagens):
```
src/main/resources/
├── application.properties
├── log4j.xml
├── i18n/
│   ├── messages_pt_BR.properties
│   └── messages_en_US.properties
└── static/
    └── logo.png
```

**Acesso em Runtime**:
```java
// Carregar arquivo de resources/
InputStream input = getClass().getClassLoader()
    .getResourceAsStream("application.properties");

// Ou usando Path relativo ao pacote:
InputStream input = MinhaClasse.class
    .getResourceAsStream("/config/app.properties");
```

**Maven/Gradle**: Copia `resources/` para `target/classes/` ou `build/classes/` automaticamente.

---

## 🔍 Análise Conceitual Profunda

### Classpath vs Modulepath

**Classpath** (Java ≤ 8): Lista de diretórios/JARs onde JVM busca classes
```bash
java -cp bin:lib/biblioteca.jar com.empresa.Main
# Windows: java -cp bin;lib\biblioteca.jar com.empresa.Main
```

**Modulepath** (Java 9+): JPMS (Java Platform Module System)
```bash
java --module-path mods --module com.empresa.projeto/com.empresa.Main
```

**Diferença**: Modulepath adiciona **encapsulamento forte** entre módulos.

### Estrutura de JAR (Java Archive)

**JAR**: Arquivo ZIP contendo estrutura de diretórios compilada

**Criar JAR**:
```bash
jar cvf meuapp.jar -C bin .
```

**Estrutura Interna**:
```
meuapp.jar
├── META-INF/
│   └── MANIFEST.MF      (Metadados - Main-Class, Version, etc.)
└── com/
    └── empresa/
        └── Cliente.class
```

**Executar JAR**:
```bash
java -jar meuapp.jar  # Requer Main-Class no MANIFEST.MF
```

**MANIFEST.MF**:
```
Manifest-Version: 1.0
Main-Class: com.empresa.Main
```

### Arquivos `module-info.java` (Java 9+)

**JPMS**: Módulos adicionam camada acima de pacotes

**Localização**: Raiz do source root
```
src/
├── module-info.java     ← Define módulo
└── com/
    └── empresa/
        └── Main.java
```

**Conteúdo**:
```java
module com.empresa.projeto {
    exports com.empresa.projeto.api;  // Exporta pacote
    requires java.sql;                // Depende de módulo java.sql
}
```

**Compilação**:
```bash
javac -d mods --module-source-path src $(find src -name "*.java")
```

---

## 🎯 Aplicabilidade e Contextos

### Exemplo Completo: Projeto Maven

**Estrutura**:
```
ecommerce/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── empresa/
│   │   │           └── ecommerce/
│   │   │               ├── Main.java
│   │   │               ├── modelo/
│   │   │               │   ├── Cliente.java
│   │   │               │   ├── Pedido.java
│   │   │               │   └── Produto.java
│   │   │               ├── servico/
│   │   │               │   └── PedidoService.java
│   │   │               └── repositorio/
│   │   │                   └── PedidoRepository.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── logback.xml
│   └── test/
│       ├── java/
│       │   └── com/
│       │       └── empresa/
│       │           └── ecommerce/
│       │               └── servico/
│       │                   └── PedidoServiceTest.java
│       └── resources/
│           └── application-test.properties
└── target/              (gerado por Maven)
    ├── classes/
    │   └── com/
    │       └── empresa/
    │           └── ecommerce/
    └── test-classes/
```

**Cliente.java**:
```java
package com.empresa.ecommerce.modelo;

public class Cliente {
    private Long id;
    private String nome;
    private String cpf;
    
    // Construtor, getters, setters
}
```

**Main.java**:
```java
package com.empresa.ecommerce;

import com.empresa.ecommerce.modelo.Cliente;
import com.empresa.ecommerce.servico.PedidoService;

public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();
        cliente.setNome("João Silva");
        
        PedidoService servico = new PedidoService();
        servico.processar(cliente);
    }
}
```

**Compilação Maven**:
```bash
mvn compile       # Compila src/main/java → target/classes
mvn test          # Compila e executa testes
mvn package       # Gera JAR em target/
```

### Projeto Sem Ferramentas de Build

**Estrutura Simples**:
```
projeto/
├── src/
│   └── com/
│       └── exemplo/
│           ├── Main.java
│           └── util/
│               └── Helper.java
└── bin/
```

**Compilar Manualmente**:
```bash
# Compilar todas classes
javac -d bin src/com/exemplo/Main.java src/com/exemplo/util/Helper.java

# Ou recursivamente (Linux/Mac):
find src -name "*.java" | xargs javac -d bin

# Executar
java -cp bin com.exemplo.Main
```

---

## ⚠️ Limitações e Considerações Teóricas

### Múltiplas Source Roots

**Cenário**: Código gerado automaticamente em diretório separado

```
projeto/
├── src/              ← Source root 1
│   └── com/
│       └── empresa/
├── generated/        ← Source root 2 (código gerado)
│   └── com/
│       └── empresa/
│           └── Auto.java
```

**Compilação**:
```bash
javac -sourcepath src:generated -d bin src/**/*.java generated/**/*.java
```

**Maven/Gradle**: Suportam múltiplas source roots via configuração.

### Separador de Caminho (OS-Specific)

**Problema**: `/` (Unix) vs `\` (Windows)

**Java trata automaticamente**:
```java
// Java converte automaticamente para separador do SO
File arquivo = new File("src/com/empresa/Main.java");  // Funciona em ambos
```

**Classpath**: Separadores diferentes
```bash
# Linux/Mac: : (dois pontos)
java -cp bin:lib/biblioteca.jar com.empresa.Main

# Windows: ; (ponto-e-vírgula)
java -cp bin;lib\biblioteca.jar com.empresa.Main
```

---

## 🔗 Interconexões Conceituais

**Conceitos Relacionados**:
- **Pacotes**: Estrutura lógica (conceitual)
- **Diretórios**: Estrutura física (arquivos)
- **Classpath**: Onde JVM busca classes em runtime
- **Build Tools**: Maven/Gradle automatizam compilação seguindo estrutura padrão

---

## 🚀 Evolução e Próximos Conceitos

**Java Modules (JPMS - Java 9+)**:
- Adiciona `module-info.java`
- Encapsulamento mais forte que pacotes
- Requer estrutura específica

**Próximos Passos no Aprendizado**:
1. **Tipos de Dados Primitivos**: Fundamentos da linguagem
2. **Operadores**: Expressões e cálculos
3. **Estruturas de Controle**: if, for, while

**Conclusão T3 (Estrutura Básica)**:
- ✅ Anatomia de classes
- ✅ Método main (ponto de entrada)
- ✅ Pacotes e organização lógica
- ✅ Imports
- ✅ Comentários e documentação
- ✅ Convenções de nomenclatura
- ✅ Indentação e formatação
- ✅ **Estrutura de diretórios e arquivos** (este tópico)

**Base sólida** para avançar em conceitos de programação Java!
