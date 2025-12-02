# Modularização de Projetos Existentes: Como migrar

Olá, Gedê\! Como um desenvolvedor Backend Java, sei que o tema de modularização é super relevante para você. A.R.I.A. vai te guiar por todo o processo de migração para o JPMS, o Java Platform Module System, de forma bem detalhada. Vamos lá\!

## JPMS - Modularização de Projetos Existentes: Como Migrar

### 1\. Introdução

O Java Platform Module System (JPMS), introduzido no Java 9, representa uma das maiores mudanças arquitetônicas na plataforma Java desde a sua criação. Ele visa resolver problemas como a "classpath hell" (inferno da classpath), a encapsulamento fraco de pacotes e a dificuldade de criar runtimes menores e mais eficientes. A modularização de projetos existentes, embora não seja trivial, oferece benefícios significativos em termos de confiabilidade, segurança e desempenho.

No contexto do desenvolvimento de software, especialmente para um desenvolvedor backend Java como você, Gedê, a modularização é crucial para construir sistemas robustos e escaláveis. Ela permite um encapsulamento mais forte, evitando dependências não intencionais e garantindo que apenas as APIs públicas sejam expostas. Isso facilita a manutenção, o reuso de código e a compreensão da arquitetura do sistema. Além disso, o JPMS permite a criação de imagens de runtime personalizadas com apenas os módulos necessários, resultando em aplicações menores e mais rápidas para implantação.

O JPMS define um novo tipo de componente de programação, o *módulo*. Um módulo é um agrupamento nomeado e auto-descritivo de código e dados. Ele encapsula pacotes Java e recursos, declarando quais outros módulos ele *depende* e quais pacotes ele *exporta* para uso por outros módulos. Essencialmente, um módulo serve para:

- **Encapsulamento Forte:** Controla estritamente quais pacotes são acessíveis externamente, prevenindo acesso não autorizado a implementações internas.
- **Confiabilidade Aprimorada:** O sistema de módulos verifica dependências em tempo de compilação e de execução, garantindo que todas as dependências estejam presentes.
- **Configurabilidade Flexível:** Permite a criação de runtimes personalizados, incluindo apenas os módulos da plataforma e da aplicação que são estritamente necessários.
- **Melhor Desempenho:** Imagens de runtime menores resultam em inicializações mais rápidas e menor consumo de memória.

### 2\. Sumário

A seguir, os tópicos que abordaremos para entender a migração de projetos existentes para o JPMS:

- **Conceitos Fundamentais do JPMS**
- **O Desafio da Migração**
- **Estratégias de Migração**
    - Fase 1: O Caminho Automático do Módulo (Automatic Module)
    - Fase 2: Modularização Explicita
- **Sintaxe e Estrutura do `module-info.java`**
- **Componentes Principais de um Módulo**
- **Restrições de Uso e Armadilhas Comuns**
- **Exemplos Práticos de Migração**
- **Informações Adicionais: Considerações Avançadas**

### 3\. Conteúdo Detalhado

### Conceitos Fundamentais do JPMS

Antes de mergulharmos na migração, é fundamental solidificar os conceitos do JPMS:

- **Módulo (Module):** Uma unidade nomeada e organizada de código, dados e recursos. Contém um arquivo `module-info.java` que define suas características.
- **Descritor de Módulo (`module-info.java`):** Um arquivo Java especial que declara o nome do módulo, suas dependências (módulos que ele *requer*), os pacotes que ele *exporta* (torna acessíveis a outros módulos), e outras diretivas.
- **Sistema de Módulos (Module System):** O runtime do Java que gerencia e resolve os módulos.
- **Caminho do Módulo (Module Path):** Um novo mecanismo, análogo ao classpath, para especificar a localização dos módulos durante a compilação e execução. Ao contrário do classpath, o module path impõe o encapsulamento forte.
- **Módulo Automático (Automatic Module):** Um JAR que é colocado no caminho do módulo, mas não possui um descritor de módulo. Ele se comporta como um módulo que exporta todos os seus pacotes e lê todos os outros módulos (incluindo o classpath). É uma ponte de compatibilidade para a migração.
- **Módulo Inominado (Unnamed Module):** O módulo especial ao qual o código no classpath pertence. Ele lê todos os módulos e não exporta nenhum pacote.
- **JRT (Java Runtime Image):** O ambiente de execução do Java, que agora é modularizado.

### O Desafio da Migração

Migrar um projeto existente para o JPMS pode ser desafiador, especialmente para projetos legados com muitas dependências. Os principais desafios incluem:

- **Dependências Transmíssivas:** Entender e declarar corretamente as dependências de terceiros.
- **Split Packages:** Quando o mesmo pacote reside em múltiplos módulos, o JPMS proíbe isso, pois causa ambiguidades.
- **Reflexão:** Acesso reflexivo a campos e métodos que não estão exportados por um módulo.
- **Ferramentas de Build:** Atualizar Maven, Gradle, etc., para suportar o module path e as novas diretivas do JPMS.

### Estratégias de Migração

A migração para o JPMS geralmente segue uma abordagem faseada, para minimizar o impacto e facilitar a transição.

### Fase 1: O Caminho Automático do Módulo (Automatic Module)

Esta é a fase inicial e mais simples, ideal para projetos que dependem de muitas bibliotecas não modularizadas.

1. **Mover JARs para o Caminho do Módulo:** Em vez de colocar todos os JARs no classpath, mova-os para o module path. Qualquer JAR sem um `module-info.java` se tornará um Módulo Automático.
    - **Benefício:** Seus módulos existentes (do código-fonte) podem depender desses módulos automáticos.
    - **Restrição:** Módulos automáticos exportam *todos* os seus pacotes, o que enfraquece o encapsulamento e não resolve problemas de *split packages*. O nome do módulo automático é derivado do nome do JAR (por exemplo, `meu-lib.jar` se torna `meu.lib`).
2. **Identificar e Resolver Dependências:**
    - Comece a compilar seu projeto no Java 9+. Observe as mensagens de erro relacionadas a dependências.
    - **Com o `jdeps`:** Use a ferramenta `jdeps` do JDK para analisar as dependências dos seus JARs e classes. Isso pode ajudar a identificar quais módulos da plataforma ou bibliotecas de terceiros são necessários.
        
        ```bash
        jdeps --module-path <caminho-para-suas-libs> -s <seu-jar>
        
        ```
        
    - **`-add-modules ALL-MODULE-PATH` (para execução):** Em tempo de execução, você pode usar esta flag para adicionar todos os módulos do module path ao sistema de módulos, facilitando a inicialização enquanto você ainda está no processo de identificar as dependências exatas. No entanto, o objetivo final é remover essa flag.

### Fase 2: Modularização Explícita

Uma vez que seu projeto compila e executa como módulos automáticos, a próxima fase é começar a criar descritores de módulo explícitos (`module-info.java`) para suas próprias partes do código e, eventualmente, para bibliotecas de terceiros (se elas não tiverem um `module-info.java` e você precisar de controle mais fino).

1. **Modularizar Seus Próprios Projetos/Módulos:**
    - Para cada subprojeto ou componente lógico do seu sistema, crie um arquivo `module-info.java` na raiz do código-fonte (geralmente `src/main/java`).
    - **Declare o Nome do Módulo:** Escolha um nome de módulo que siga a convenção de nomenclatura de domínio reverso (por exemplo, `com.gedelabs.minhaaplicacao`).
    - **Declare os Pacotes Exportados:** Para cada pacote que você deseja que outros módulos acessem, use a diretiva `exports`.
        
        ```java
        module com.gedelabs.minhaaplicacao.core {
            exports com.gedelabs.minhaaplicacao.core.api;
            // ...
        }
        
        ```
        
    - **Declare as Dependências Requeridas:** Para cada módulo de que você depende (seja da plataforma Java, de outras partes do seu projeto ou de bibliotecas de terceiros já modularizadas), use a diretiva `requires`.
        
        ```java
        module com.gedelabs.minhaaplicacao.service {
            requires com.gedelabs.minhaaplicacao.core; // Depende do seu módulo core
            requires java.sql; // Depende do módulo de JDBC do Java
            requires org.slf4j.api; // Depende do SLF4J (se já modularizado)
            // ...
        }
        
        ```
        
2. **Resolver Problemas de *Split Packages*:** Se você encontrar erros de *split packages*, significa que o mesmo pacote está presente em dois módulos distintos.
    - **Solução:** Refatorar o código para que o pacote esteja em apenas um módulo. Isso pode exigir a criação de um novo módulo para abrigar o pacote conflitante ou a consolidação de classes.
3. **Lidar com Reflexão:** Se seu código usa reflexão para acessar campos ou métodos não exportados por um módulo, você enfrentará erros.
    - **`-add-opens` (temporário):** Para fins de compatibilidade e durante a transição, você pode usar a flag `-add-opens` na linha de comando Java para "abrir" um pacote de um módulo para outro, permitindo acesso reflexivo.
    Isso é um *workaround* e deve ser usado com cautela, pois enfraquece o encapsulamento. A solução ideal é refatorar o código para usar APIs públicas.
        
        ```bash
        java --add-opens java.base/java.lang.reflect=ALL-UNNAMED ...
        
        ```
        
    - **`opens` (no `module-info.java`):** Se um módulo precisa ser acessível via reflexão para *todos* os outros módulos, você pode usar `opens` em seu `module-info.java`. Se o acesso for para módulos específicos, use `opens <package> to <module_name>;`.
4. **Atualizar Ferramentas de Build:**
    - **Maven:** No `pom.xml`, você precisará configurar o `maven-compiler-plugin` e o `maven-surefire-plugin` (para testes) para usar o module path.
        
        ```xml
        <build>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.13.0</version>
                    <configuration>
                        <release>17</release> <compilerArgs>
                            <arg>--module-path</arg>
                            <arg>${settings.localRepository}</arg> <arg>--add-modules</arg>
                            <arg>ALL-MODULE-PATH</arg> </compilerArgs>
                    </configuration>
                </plugin>
                <plugin>
                    <groupId>org.codehaus.mojo</groupId>
                    <artifactId>exec-maven-plugin</artifactId>
                    <version>3.2.0</version>
                    <configuration>
                        <executable>java</executable>
                        <arguments>
                            <argument>--module-path</argument>
                            <argument>${project.build.outputDirectory}</argument>
                            <argument>--module</argument>
                            <argument>com.gedelabs.minhaaplicacao.main/com.gedelabs.minhaaplicacao.main.App</argument>
                        </arguments>
                    </configuration>
                </plugin>
            </plugins>
        </build>
        
        ```
        
    - **Gradle:** No `build.gradle`, o Gradle 6+ tem suporte nativo para o JPMS. Você usará a configuração `java.modularity.inferModulePath = true` para que o Gradle infira o module path, ou configurará explicitamente as dependências como `module` ou `not-module` (para jars legados).
        
        ```
        java {
            modularity.inferModulePath = true // Habilita inferência do module path
        }
        
        dependencies {
            implementation 'org.slf4j:slf4j-api:2.0.13' // Dependência normal, Gradle tentará inferir como módulo
            // Se uma dependência não é um módulo (i.e. não tem module-info.java),
            // você pode explicitamente marcá-la para ir no classpath
            // runtimeClasspath enforcedPlatform(library('my.old.library')).withoutModuleInfo()
        }
        
        ```
        

### Sintaxe e Estrutura do `module-info.java`

O descritor de módulo (`module-info.java`) é o coração da modularização. Ele usa uma sintaxe simples:

```java
module com.gedelabs.minhaaplicacao.servico {
    // Declara dependências de outros módulos
    requires com.gedelabs.minhaaplicacao.dominio; // Requer o módulo de domínio
    requires java.sql; // Requer o módulo java.sql do JDK
    requires transitive org.slf4j.api; // Requer SLF4J, e quem depender deste módulo também dependerá de SLF4J

    // Exporta pacotes para outros módulos
    exports com.gedelabs.minhaaplicacao.servico.impl; // Exporta o pacote de implementação
    exports com.gedelabs.minhaaplicacao.servico.api; // Exporta o pacote de API

    // Abre pacotes para reflexão (opcional, usar com cautela)
    opens com.gedelabs.minhaaplicacao.servico.config to spring.core; // Abre para o módulo Spring Core
    opens com.gedelabs.minhaaplicacao.servico.internal; // Abre para todos os módulos (via reflexão)

    // Fornece implementações de serviços (ServiceLoader)
    provides com.gedelabs.minhaaplicacao.servico.api.MyService with com.gedelabs.minhaaplicacao.servico.impl.MyServiceImpl;

    // Consome serviços de outros módulos (ServiceLoader)
    uses com.gedelabs.minhaaplicacao.servico.api.AnotherService;
}

```

- **`module <module_name>`:** Declara o nome do módulo.
- **`requires <module_name>`:** Declara uma dependência estática em outro módulo. O módulo atual pode usar os pacotes exportados pelo módulo dependente.
- **`requires transitive <module_name>`:** Declara uma dependência transitiva. Qualquer módulo que dependa do *seu* módulo também dependerá implicitamente de `<module_name>`. Útil para bibliotecas que expõem APIs de outras bibliotecas.
- **`exports <package_name>`:** Torna os tipos públicos de um pacote acessíveis a outros módulos.
- **`exports <package_name> to <module_name>, <module_name>...`:** Exporta um pacote apenas para módulos específicos (exportação qualificada).
- **`opens <package_name>`:** Permite que o código de *todos* os módulos acesse os tipos e membros não públicos do pacote via reflexão em tempo de execução.
- **`opens <package_name> to <module_name>, <module_name>...`:** Permite acesso reflexivo a um pacote apenas para módulos específicos (abertura qualificada).
- **`uses <service_interface>`:** Indica que este módulo *consome* serviços de um tipo específico, usando o `ServiceLoader` do Java.
- **`provides <service_interface> with <service_implementation_class>`:** Indica que este módulo *fornece* uma implementação para uma interface de serviço, para ser usada pelo `ServiceLoader`.

### Componentes Principais de um Módulo

Além do `module-info.java`, os componentes principais de um módulo são seus pacotes e classes. A interação entre eles é regida pelas diretivas do descritor de módulo:

- **Encapsulamento:** Por padrão, todos os pacotes dentro de um módulo são encapsulados. Apenas os pacotes explicitamente declarados com `exports` no `module-info.java` são visíveis para outros módulos. Isso significa que mesmo classes `public` dentro de pacotes não exportados não podem ser acessadas de fora do módulo.
- **Visibilidade de Tipos:** A visibilidade de classes e interfaces é controlada pela combinação de modificadores de acesso Java (`public`, `private`, `protected`, default/package-private) e pelas diretivas de `exports` no `module-info.java`. Para um tipo ser visível externamente, ele deve ser `public` E o pacote que o contém deve ser `exported`.
- **ServiceLoader:** O mecanismo `ServiceLoader` do Java é fundamental para o padrão Inversão de Controle (IoC) em um ambiente modular. Módulos podem `provide` implementações de serviços e outros módulos podem `use` esses serviços, permitindo uma arquitetura extensível e desacoplada.

### Restrições de Uso

- **Split Packages:** É a restrição mais comum e difícil de resolver. Dois módulos não podem conter o mesmo pacote Java. Isso é para evitar ambiguidades e garantir a integridade do grafo de módulos. A solução é refatorar para que o pacote esteja em apenas um módulo.
- **Acesso Reflexivo:** O acesso reflexivo a campos e métodos `private` ou `protected` em pacotes não abertos ou exportados não é mais permitido por padrão. É necessário usar `opens` ou `add-opens` para permitir isso.
- **Jars no Classpath vs. Module Path:** Jars no classpath operam no módulo inominado, que tem acesso a *todos* os módulos (incluindo os da plataforma e os da aplicação). Jars no module path são módulos nomeados (explícitos ou automáticos). Misturar os dois requer um entendimento claro das regras de leitura. Módulos nomeados não leem o módulo inominado por padrão.
- **Dependências Cíclicas:** O JPMS suporta dependências cíclicas entre módulos, mas é geralmente uma má prática de design que deve ser evitada. O compilador Java não reclama, mas pode indicar uma arquitetura com coesão baixa.

### 4\. Exemplos de Código Otimizados

Vamos simular a migração de um projeto simples de "Biblioteca" que tem um módulo de `core` e um módulo de `service`.

### Estrutura do Projeto Original (Antes da Modularização)

```
meu-projeto-biblioteca/
├── core/
│   ├── src/main/java/
│   │   └── com/gedelabs/biblioteca/core/
│   │       ├── model/
│   │       │   └── Livro.java
│   │       └── util/
│   │           └── ISBNValidator.java
│   └── pom.xml
└── service/
    ├── src/main/java/
    │   └── com/gedelabs/biblioteca/service/
    │       ├── LivroService.java
    │       └── impl/
    │           └── LivroServiceImpl.java
    └── pom.xml

```

### Passo 1: Adicionar `module-info.java` aos módulos do seu projeto

**`meu-projeto-biblioteca/core/src/main/java/module-info.java`:**

```java
module com.gedelabs.biblioteca.core {
    // Exporta o pacote model para que outros módulos possam usar a classe Livro
    exports com.gedelabs.biblioteca.core.model;
    // Exporta o pacote util para que outros módulos possam usar o ISBNValidator
    exports com.gedelabs.biblioteca.core.util;
}

```

**`meu-projeto-biblioteca/service/src/main/java/module-info.java`:**

```java
module com.gedelabs.biblioteca.service {
    // Este módulo requer o módulo core para usar Livro e ISBNValidator
    requires com.gedelabs.biblioteca.core;
    // Se LivroService usar alguma API do pacote java.sql, por exemplo,
    // requires java.sql;
    // se você precisar de logs, requires transitive org.slf4j.api; (se a lib estiver modularizada)

    // Exporta o pacote da API de serviço para outros módulos usarem LivroService
    exports com.gedelabs.biblioteca.service;
    // Exporta o pacote de implementação para que o ponto de entrada da aplicação
    // possa instanciar LivroServiceImpl (se a aplicação não usar ServiceLoader)
    // Se você usar ServiceLoader, pode querer remover esta exportação e usar 'provides'
    exports com.gedelabs.biblioteca.service.impl;
}

```

### Passo 2: Atualizar os `pom.xml`

**`meu-projeto-biblioteca/pom.xml` (Parent POM):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="<http://maven.apache.org/POM/4.0.0>"
         xmlns:xsi="<http://www.w3.org/2001/XMLSchema-instance>"
         xsi:schemaLocation="<http://maven.apache.org/POM/4.0.0> <http://maven.apache.org/xsd/maven-4.0.0.xsd>">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.gedelabs</groupId>
    <artifactId>meu-projeto-biblioteca</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <modules>
        <module>core</module>
        <module>service</module>
    </modules>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>${maven.compiler.source}</release>
                    </configuration>
            </plugin>
        </plugins>
    </build>
</project>

```

**`meu-projeto-biblioteca/core/pom.xml`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="<http://maven.apache.org/POM/4.0.0>"
         xmlns:xsi="<http://www.w3.org/2001/XMLSchema-instance>"
         xsi:schemaLocation="<http://maven.apache.org/POM/4.0.0> <http://maven.apache.org/xsd/maven-4.0.0.xsd>">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.gedelabs</groupId>
        <artifactId>meu-projeto-biblioteca</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>core</artifactId>

    </project>

```

**`meu-projeto-biblioteca/service/pom.xml`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="<http://maven.apache.org/POM/4.0.0>"
         xmlns:xsi="<http://www.w3.org/2001/XMLSchema-instance>"
         xsi:schemaLocation="<http://maven.apache.org/POM/4.0.0> <http://maven.apache.org/xsd/maven-4.0.0.xsd>">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.gedelabs</groupId>
        <artifactId>meu-projeto-biblioteca</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>service</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.gedelabs</groupId>
            <artifactId>core</artifactId>
            <version>${project.version}</version>
        </dependency>
        </dependencies>
</project>

```

### Cenário de Uso (Main Application Module)

Vamos criar um módulo `app` que usa `service`, que por sua vez usa `core`.

**`meu-projeto-biblioteca/app/src/main/java/module-info.java`:**

```java
module com.gedelabs.biblioteca.app {
    // Requer o módulo de serviço para usar suas funcionalidades
    requires com.gedelabs.biblioteca.service;
    // Se o app precisar usar Livro ou ISBNValidator diretamente do core, também precisaria:
    // requires com.gedelabs.biblioteca.core; // Mas geralmente não é necessário se o serviço já abstrai
}

```

**`meu-projeto-biblioteca/app/src/main/java/com/gedelabs/biblioteca/app/Main.java`:**

```java
package com.gedelabs.biblioteca.app;

import com.gedelabs.biblioteca.core.model.Livro;
import com.gedelabs.biblioteca.service.LivroService;
import com.gedelabs.biblioteca.service.impl.LivroServiceImpl; // Acessível porque o service exporta impl

public class Main {
    public static void main(String[] args) {
        // Instancia o serviço
        LivroService livroService = new LivroServiceImpl();

        // Cria um livro
        Livro livro = new Livro("978-85-7888-292-8", "Java Efetivo", "Joshua Bloch");

        // Adiciona o livro
        livroService.adicionarLivro(livro);

        System.out.println("Livro adicionado: " + livro.getTitulo());

        // Busca o livro (exemplo simplificado)
        Livro encontrado = livroService.buscarLivroPorISBN("978-85-7888-292-8");
        if (encontrado != null) {
            System.out.println("Livro encontrado: " + encontrado.getAutor());
        }
    }
}

```

### Execução da Aplicação Modularizada

Para compilar e executar o projeto com Maven, você primeiro faria um `mvn clean install` no diretório raiz do projeto.

Para executar o módulo principal:

```bash
cd meu-projeto-biblioteca/app
mvn exec:java -Dexec.mainClass=com.gedelabs.biblioteca.app.Main \\
              -Dexec.executable=java \\
              -Dexec.args="--module-path ${project.build.directory}/classes:${project.build.directory}/../service/target/service-${project.version}.jar:${project.build.directory}/../core/target/core-${project.version}.jar --module com.gedelabs.biblioteca.app/com.gedelabs.biblioteca.app.Main"

```

- `-module-path`: Especifica os diretórios ou JARs que contêm os módulos. Aqui, estamos apontando para os JARs gerados pelos módulos `core` e `service` e a saída de classes do módulo `app`.
- `-module`: Indica qual módulo e qual classe principal deve ser executada.

Este exemplo demonstra a estrutura básica e a interação entre módulos. Para bibliotecas de terceiros não modularizadas, você as colocaria no `--module-path` e elas se tornariam módulos automáticos.

### 5\. Informações Adicionais

- **JLink para Runtimes Customizados:** Uma das maiores vantagens do JPMS é a ferramenta `jlink`. Ela permite criar uma imagem de runtime Java personalizada que contém apenas os módulos da plataforma (JDK) e os módulos da sua aplicação necessários. Isso resulta em um runtime muito menor, ideal para conteineres Docker e implantações.
Isso gerará uma pasta `meu-runtime-personalizado` que contém um JDK otimizado para sua aplicação, com um binário `java` dentro, que você pode empacotar.
    
    ```bash
    jlink --module-path <caminho-para-seus-modulos>:<caminho-para-modulos-do-jdk> \\
          --add-modules <modulo-principal-da-sua-aplicacao> \\
          --output meu-runtime-personalizado
    
    ```
    
- **Módulos Automáticos e o `Automatic-Module-Name`:** Se você for o mantenedor de uma biblioteca que ainda não é modularizada, pode adicionar o atributo `Automatic-Module-Name` ao `MANIFEST.MF` do seu JAR. Isso permite que consumidores do seu JAR o usem como um módulo com um nome bem definido, em vez de um nome inferido do JAR, o que melhora a estabilidade em futuras migrações.
- **Encapsulamento e Acesso Reflexivo:** O JPMS reforça o encapsulamento. Se você depende de acessar internals (pacotes não exportados) de bibliotecas de terceiros via reflexão (comum em frameworks como Spring e Hibernate), você precisará usar `-add-opens` na linha de comando Java. Para a JVM, isso é um *hack* que contorna o encapsulamento do módulo. O ideal é que as bibliotecas e frameworks se adaptem e usem as diretivas `opens` ou APIs públicas.
- **`ServiceLoader` e Injeção de Dependência:** Em vez de frameworks de injeção de dependência pesados, o `ServiceLoader` do JPMS pode ser usado para um sistema de plugin leve e modular. Seu módulo pode `provide` uma implementação de serviço, e outros módulos podem `use` essa interface, permitindo a descoberta e carregamento dinâmico de implementações.

### 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos em JPMS, recomendo os seguintes recursos:

- **Documentação Oficial do Java (Oracle):**
    - [Java Platform Module System](https://www.google.com/search?q=https://docs.oracle.com/en/java/javase/17/docs/specs/jpms-overview.html)
    - [JEP 261: Module System](https://openjdk.org/jeps/261)
    - [JEP 220: Modular Run-Time Images](https://openjdk.org/jeps/220)
- **Livros:**
    - **"The Java Module System" por Nicolai Parlog:** Considerado uma das melhores referências para entender o JPMS em profundidade. Abrange desde os conceitos básicos até os cenários de migração mais complexos.
- **Artigos e Tutoriais:**
    - **Baeldung - Java 9 Modules:** Uma série de artigos muito bem detalhados sobre JPMS, cobrindo diversos aspectos da modularização e migração.
        - [Java 9 Modules: A Crash Course](https://www.google.com/search?q=https://www.baeldung.com/java-9-modules)
        - [Java 9 Jigsaw: Automatic Modules](https://www.google.com/search?q=https://www.baeldung.com/java-9-automatic-modules)
        - [Java 9 Jigsaw: Split Packages](https://www.google.com/search?q=https://www.baeldung.com/java-9-split-packages)
    - **InfoQ - Migrating to Java 9 Modules:** Artigos e apresentações sobre desafios e estratégias de migração.
        - [Migrating to Java 9 Modules: The Journey Continues](https://www.google.com/search?q=https://www.infoq.com/articles/migrating-java-9-modules-journey-continues/)
- **Vídeos e Palestras:**
    - Procure por palestras de Nicolai Parlog, Simon Ritter e outros especialistas em Java sobre JPMS em conferências como Devoxx, JavaOne (agora Oracle Code One) e JBCNConf. Eles frequentemente compartilham insights práticos sobre a migração.

A modularização é um passo importante para o futuro do Java. Leva tempo para ser dominada, mas os benefícios em termos de arquitetura, segurança e desempenho valem o investimento. Boa sorte na sua jornada de migração, Gedê\! Se precisar de mais detalhes ou tiver dúvidas específicas, A.R.A.I. está aqui para ajudar.