# module-info.java: Estrutura e diretivas (requires, exports, opens, uses, provides)

Olá, Gedê\! Entendo sua necessidade de aprofundar seus conhecimentos em Java, especialmente com o Java Platform Module System (JPMS), visto que você já é um desenvolvedor Java Backend e busca uma transição para Go. A.R.I.A está aqui para te ajudar com uma explicação bem detalhada sobre `module-info.java`, suas diretivas e a importância delas para o desenvolvimento moderno em Java.

## JPMS - `module-info.java`: Estrutura e Diretivas

### 1\. Introdução

O Java Platform Module System (JPMS), introduzido no Java 9 como parte do Project Jigsaw, representa uma das maiores mudanças na plataforma Java desde sua criação. Seu principal objetivo é modularizar o JDK e, por consequência, permitir que desenvolvedores criem aplicações mais robustas, seguras e eficientes, com dependências bem definidas e menor superfície de ataque.

No centro do JPMS está o arquivo `module-info.java`. Ele atua como o descritor de um módulo, definindo explicitamente o que o módulo precisa (dependências) e o que ele expõe (APIs públicas) para outros módulos. Antes do JPMS, o gerenciamento de dependências em Java era baseado no classpath, um mecanismo flexível, porém propenso a problemas como o "JAR Hell", onde conflitos de versão e classes ocultas causavam comportamentos inesperados em tempo de execução. O JPMS resolve isso aplicando encapsulamento forte e dependências explícitas, garantindo que o código se comporte de maneira mais previsível e segura.

Para você, Gedê, que trabalha com desenvolvimento Backend Java, entender o JPMS é crucial. Ele não apenas otimiza o uso de memória e a performance das aplicações (especialmente em microsserviços), mas também melhora a segurança e a manutenibilidade do código, facilitando a construção de sistemas complexos e distribuídos. Com a modularização, é possível criar *runtimes* menores e mais compactos, incluindo apenas os módulos da plataforma Java que são realmente necessários para sua aplicação.

### 2\. Sumário

Nesta explicação detalhada, abordaremos os seguintes tópicos:

- **Definição e Conceitos Fundamentais:** O que é um módulo Java e qual o papel do `module-info.java`.
- **Sintaxe e Estrutura do `module-info.java`:** A estrutura básica de um descritor de módulo.
- **Diretivas do `module-info.java`:**
    - `requires`: Declarando dependências de módulos.
    - `exports`: Expondo pacotes públicos.
    - `opens`: Permitindo acesso reflexivo a pacotes.
    - `uses`: Declarando o uso de serviços.
    - `provides ... with`: Fornecendo implementações de serviços.
- **Restrições de Uso e Melhores Práticas:** Limitações e recomendações.
- **Exemplos de Código Otimizados:** Aplicações práticas das diretivas.
- **Informações Adicionais:** Reflexão e módulos automáticos.
- **Referências para Estudo Independente:** Links para aprofundamento.

### 3\. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

Um **módulo Java** é uma nova unidade de organização de código e dados no Java. Ele agrupa pacotes e recursos relacionados, juntamente com um descritor de módulo (`module-info.java`), que define suas dependências explícitas e quais pacotes ele expõe para outros módulos.

O arquivo **`module-info.java`** é o coração de um módulo. Ele é um arquivo de texto simples que contém declarações que descrevem as características do módulo, como:

- **Nome do módulo:** Um nome único que identifica o módulo.
- **Dependências:** Quais outros módulos este módulo requer para compilar e executar.
- **APIs exportadas:** Quais pacotes dentro do módulo são acessíveis por outros módulos.
- **Acesso reflexivo:** Quais pacotes podem ser acessados via reflexão por outros módulos.
- **Serviços consumidos:** Quais interfaces de serviço o módulo espera usar.
- **Serviços fornecidos:** Quais implementações de serviço o módulo oferece.

O principal objetivo do `module-info.java` é aplicar um **encapsulamento forte**. Isso significa que, por padrão, tudo dentro de um módulo é encapsulado e não acessível por outros módulos, a menos que explicitamente exportado. Isso contrasta fortemente com o classpath tradicional, onde todas as classes públicas em qualquer JAR eram acessíveis.

### Sintaxe e Estrutura do `module-info.java`

A sintaxe básica de um `module-info.java` é simples:

```java
module meu.modulo.exemplo {
    // Diretivas do módulo
}

```

- `module`: palavra-chave para declarar um módulo.
- `meu.modulo.exemplo`: o nome do módulo. Por convenção, nomes de módulos seguem a mesma convenção de nomes de pacotes reversos (e.g., `com.example.mymodule`).
- `{}`: bloco onde as diretivas do módulo são declaradas.

**Exemplo de declaração e utilização:**

Vamos imaginar um módulo simples para uma biblioteca de utilitários:

```java
// src/com.example.utils/module-info.java
module com.example.utils {
    exports com.example.utils.math;
    exports com.example.utils.text;
}

// src/com.example.utils/com/example/utils/math/Calculator.java
package com.example.utils.math;

public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }
}

// src/com.example.app/module-info.java
module com.example.app {
    requires com.example.utils; // Depende do módulo de utilitários
}

// src/com.example.app/com/example/app/Main.java
package com.example.app;

import com.example.utils.math.Calculator;

public class Main {
    public static void main(String[] args) {
        System.out.println("2 + 3 = " + Calculator.add(2, 3));
    }
}

```

Neste exemplo, o módulo `com.example.app` pode acessar `Calculator` porque o pacote `com.example.utils.math` foi explicitamente exportado pelo módulo `com.example.utils`.

### Componentes Principais (Diretivas)

As diretivas são as instruções dentro do bloco `module-info.java` que definem o comportamento e as interações do módulo.

### `requires`

A diretiva `requires` declara que o módulo atual depende de outro módulo. Isso significa que o código dentro do módulo atual pode acessar os pacotes exportados pelo módulo requerido.

- **Função:** Estabelece uma dependência de tempo de compilação e tempo de execução entre módulos.
- **Sintaxe:**
    
    ```java
    requires nome.do.modulo;
    
    ```
    
- **Variações:**
    - `requires transitive nome.do.modulo;`: Além de declarar a dependência, `transitive` faz com que qualquer módulo que dependa do módulo atual também dependa implicitamente de `nome.do.modulo`. Isso é útil para bibliotecas que expõem tipos de suas dependências em suas próprias APIs.
    - `requires static nome.do.modulo;`: Declara uma dependência em tempo de compilação, mas não em tempo de execução. O módulo `nome.do.modulo` é opcional em tempo de execução. Usado para dependências opcionais ou para ferramentas de compilação.

**Exemplo:**

```java
// Módulo de persistência que depende de um módulo de banco de dados
module com.example.persistence {
    requires com.example.database; // Declara que precisa do módulo de banco de dados
    exports com.example.persistence.api;
}

// Módulo principal que precisa do módulo de persistência, e transitivamente do banco de dados
module com.example.mainapp {
    requires transitive com.example.persistence; // Se com.example.persistence expõe tipos de com.example.database
}

```

### `exports`

A diretiva `exports` especifica quais pacotes de um módulo são acessíveis (públicos) para outros módulos. Apenas os pacotes explicitamente exportados podem ser acessados por outros módulos. Todos os outros pacotes dentro do módulo permanecem encapsulados.

- **Função:** Torna um pacote e suas classes públicas acessíveis a outros módulos.
- **Sintaxe:**
    
    ```java
    exports nome.do.pacote;
    
    ```
    
- **Variação:**
    - `exports nome.do.pacote to nome.do.modulo.alvo;`: Exporta o pacote apenas para módulos específicos (um ou mais). Isso é chamado de **exportação qualificada** e oferece um controle de acesso mais granular.

**Exemplo:**

```java
// src/com.example.service/module-info.java
module com.example.service {
    exports com.example.service.core; // Acessível por qualquer módulo
    exports com.example.service.admin to com.example.adminapp; // Apenas o módulo adminapp pode acessar
}

```

### `opens`

A diretiva `opens` é semelhante a `exports`, mas lida especificamente com acesso reflexivo em tempo de execução. Pacotes `opened` podem ser acessados via APIs de reflexão (como `Class.forName()`, `Field.setAccessible(true)`) por outros módulos, mesmo que as classes e membros não sejam publicamente acessíveis. Isso é crucial para frameworks que usam injeção de dependência, ORMs (como Hibernate) ou serialização/desserialização.

- **Função:** Permite acesso reflexivo a classes dentro de um pacote, mesmo se ele não for exportado.
- **Sintaxe:**
    
    ```java
    opens nome.do.pacote;
    
    ```
    
- **Variação:**
    - `opens nome.do.pacote to nome.do.modulo.alvo;`: Permite acesso reflexivo apenas para módulos específicos (abertura qualificada).

**Exemplo:**

```java
// src/com.example.data/module-info.java
module com.example.data {
    // O pacote de entidades é aberto para permitir que um framework ORM acesse campos privados via reflexão.
    opens com.example.data.entities;
    // Ou, se soubermos qual framework usará, podemos qualificar:
    // opens com.example.data.entities to org.hibernate.core;
}

```

**Diferença entre `exports` e `opens`:**

- `exports`: Permite acesso direto ao código em tempo de compilação e tempo de execução (compilação e chamada de métodos).
- `opens`: Permite apenas acesso reflexivo em tempo de execução. O compilador não terá acesso direto aos tipos do pacote.

### `uses`

A diretiva `uses` declara que o módulo usa uma interface de serviço específica. Ela não declara uma dependência direta em uma implementação concreta, mas sim que o módulo espera encontrar e utilizar serviços que implementem essa interface. Isso é parte do mecanismo de **ServiceLoader** do Java.

- **Função:** Declara que o módulo "consome" uma interface de serviço, mas não especifica qual implementação.
- **Sintaxe:**
    
    ```java
    uses nome.completo.da.interface.de.servico;
    
    ```
    
- **Exemplo:**

<!-- end list -->

```java
// src/com.example.app/module-info.java
module com.example.app {
    uses com.example.processor.TextProcessor; // Este módulo espera usar um TextProcessor
}

// src/com.example.processor/com/example/processor/TextProcessor.java
package com.example.processor;

public interface TextProcessor {
    String process(String text);
}

```

### `provides ... with`

A diretiva `provides ... with` declara que o módulo fornece uma implementação de uma interface de serviço específica. Essa implementação é então descoberta em tempo de execução pelo `ServiceLoader` quando um módulo usa a diretiva `uses` para a mesma interface de serviço.

- **Função:** Anuncia que o módulo oferece uma implementação concreta para uma interface de serviço.
- **Sintaxe:**
    
    ```java
    provides nome.completo.da.interface.de.servico with nome.completo.da.implementacao.concreta;
    
    ```
    
- **Exemplo:**

<!-- end list -->

```java
// src/com.example.processor.uppercase/module-info.java
module com.example.processor.uppercase {
    requires com.example.processor; // Precisa da interface TextProcessor
    provides com.example.processor.TextProcessor with com.example.processor.uppercase.UpperCaseProcessor;
}

// src/com.example.processor.uppercase/com/example/processor/uppercase/UpperCaseProcessor.java
package com.example.processor.uppercase;

import com.example.processor.TextProcessor;

public class UpperCaseProcessor implements TextProcessor {
    @Override
    public String process(String text) {
        return text.toUpperCase();
    }
}

```

### Restrições de Uso

- **Encapsulamento Forte por Padrão:** Lembre-se que, por padrão, tudo dentro de um módulo é encapsulado. Apenas o que é explicitamente `exports` ou `opens` é acessível.
- **Um `module-info.java` por Módulo:** Cada módulo deve ter exatamente um arquivo `module-info.java` na raiz do seu diretório de origem.
- **Pacotes Únicos por Módulo:** Um pacote não pode ser dividido em vários módulos. Ou seja, se o pacote `com.example.util` existe no Módulo A, ele não pode existir no Módulo B. Isso é crucial para evitar o "split package problem" que ocorria no classpath.
- **Nomes de Módulos Válidos:** Nomes de módulos devem ser válidos como identificadores Java e, por convenção, seguem a mesma regra de nomes de pacotes reversos.
- **Modularização do JDK:** Você não pode modificar módulos do JDK. Você apenas os `requires`.
- **Módulos Automáticos:** JARs que não são módulos (não possuem `module-info.java`) podem ser colocados no module path e são tratados como **módulos automáticos**. Eles exportam implicitamente todos os seus pacotes e seu nome de módulo é derivado do nome do JAR. Isso é uma ponte importante para a compatibilidade com o ecossistema Java existente. No entanto, é preferível que as bibliotecas sejam migradas para módulos explícitos.

### 4\. Exemplos de Código Otimizados

Vamos construir um exemplo mais completo que ilustra o uso de várias diretivas em um cenário comum de backend.

Imagine que estamos construindo uma aplicação de gerenciamento de usuários.

**Estrutura de diretórios:**

```
project-root/
├── src/
│   ├── user.domain/
│   │   ├── module-info.java
│   │   └── com/example/user/domain/
│   │       └── User.java
│   │       └── UserValidator.java
│   ├── user.repository/
│   │   ├── module-info.java
│   │   └── com/example/user/repository/
│   │       └── UserRepository.java
│   │       └── UserDao.java
│   ├── user.service/
│   │   ├── module-info.java
│   │   └── com/example/user/service/
│   │       └── UserService.java
│   ├── user.app/
│   │   ├── module-info.java
│   │   └── com/example/user/app/
│   │       └── Main.java

```

**Módulo `user.domain`:** Define as entidades e regras de negócio básicas.

```java
// src/user.domain/module-info.java
module user.domain {
    exports com.example.user.domain; // Exporta o pacote User e UserValidator para outros módulos
}

// src/user.domain/com/example/user/domain/User.java
package com.example.user.domain;

public class User {
    private Long id;
    private String username;
    private String email;

    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

    // Getters e Setters (omitidos para brevidade)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

// src/user.domain/com/example/user/domain/UserValidator.java
package com.example.user.domain;

public class UserValidator {
    public static boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }
}

```

**Módulo `user.repository`:** Lida com a persistência de dados.

```java
// src/user.repository/module-info.java
module user.repository {
    requires user.domain; // Precisa do módulo de domínio para User
    // Se usássemos um framework ORM como Hibernate, poderíamos ter:
    // requires hibernate.core;
    // opens com.example.user.repository.entities to hibernate.core; // Abrir entidades para reflexão
    exports com.example.user.repository; // Exporta o repositório
}

// src/user.repository/com/example/user/repository/UserRepository.java
package com.example.user.repository;

import com.example.user.domain.User;

public class UserRepository {
    public void save(User user) {
        System.out.println("Saving user: " + user.getUsername() + " to DB...");
        // Simula salvamento em banco de dados
    }

    public User findByUsername(String username) {
        System.out.println("Finding user: " + username + " in DB...");
        // Simula busca no banco de dados
        if ("gedev".equals(username)) {
            return new User("gedev", "gedev@example.com");
        }
        return null;
    }
}

```

**Módulo `user.service`:** Contém a lógica de negócio e orquestra operações.

```java
// src/user.service/module-info.java
module user.service {
    requires user.domain;     // Precisa das entidades e validadores do domínio
    requires user.repository; // Precisa do repositório para persistência

    exports com.example.user.service; // Exporta o serviço para a aplicação principal
}

// src/user.service/com/example/user/service/UserService.java
package com.example.user.service;

import com.example.user.domain.User;
import com.example.user.domain.UserValidator;
import com.example.user.repository.UserRepository;

public class UserService {
    private final UserRepository userRepository;

    public UserService() {
        this.userRepository = new UserRepository();
    }

    public void registerUser(String username, String email) {
        if (!UserValidator.isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format.");
        }
        User user = new User(username, email);
        userRepository.save(user);
        System.out.println("User " + username + " registered successfully.");
    }

    public User getUserDetails(String username) {
        return userRepository.findByUsername(username);
    }
}

```

**Módulo `user.app`:** O ponto de entrada da aplicação.

```java
// src/user.app/module-info.java
module user.app {
    requires user.service; // Precisa do serviço de usuário
}

// src/user.app/com/example/user/app/Main.java
package com.example.user.app;

import com.example.user.domain.User; // Note que user.app não precisa de requires user.domain
import com.example.user.service.UserService;

public class Main {
    public static void main(String[] args) {
        UserService userService = new UserService();

        System.out.println("--- Registering Users ---");
        userService.registerUser("gedev", "gedev@mail.com");
        userService.registerUser("ju", "ju@mail.com");
        try {
            userService.registerUser("invalid", "invalid-email");
        } catch (IllegalArgumentException e) {
            System.err.println("Error registering user: " + e.getMessage());
        }

        System.out.println("\\n--- Fetching User Details ---");
        User gedev = userService.getUserDetails("gedev");
        if (gedev != null) {
            System.out.println("Found Gedev: " + gedev.getUsername() + ", Email: " + gedev.getEmail());
        } else {
            System.out.println("Gedev not found.");
        }

        User unknown = userService.getUserDetails("unknown");
        if (unknown == null) {
            System.out.println("Unknown user not found as expected.");
        }
    }
}

```

**Compilação e Execução (Exemplo via linha de comando):**

1. **Compilar módulos:**
    
    ```bash
    # Crie um diretório para os módulos compilados
    mkdir mods
    
    # Compile user.domain
    javac -d mods/user.domain src/user.domain/module-info.java src/user.domain/com/example/user/domain/*.java
    
    # Compile user.repository
    javac --module-path mods -d mods/user.repository src/user.repository/module-info.java src/user.repository/com/example/user/repository/*.java
    
    # Compile user.service
    javac --module-path mods -d mods/user.service src/user.service/module-info.java src/user.service/com/example/user/service/*.java
    
    # Compile user.app
    javac --module-path mods -d mods/user.app src/user.app/module-info.java src/user.app/com/example/user/app/*.java
    
    ```
    
2. **Executar a aplicação:**
    
    ```bash
    java --module-path mods -m user.app/com.example.user.app.Main
    
    ```
    

Este exemplo demonstra como os módulos se dependem (`requires`) e como eles expõem partes de seu código (`exports`). O `user.app` não precisa explicitamente requerer `user.domain` porque `user.service` já faz isso e `user.app` interage apenas com `user.service`. No entanto, como `User` é um tipo de domínio exportado e usado na API de `UserService`, `user.app` pode usar `User` através da dependência em `user.service`.

### 5\. Informações Adicionais

### Reflexão em Módulos

Um ponto importante para você como desenvolvedor Backend, Gedê, é a forma como frameworks como Spring, Hibernate e Jakarta EE lidam com a reflexão. No mundo do classpath, eles tinham acesso total a todas as classes em tempo de execução via reflexão. Com o JPMS, isso não é mais o caso por padrão.

- Para que um framework possa usar reflexão para acessar membros não públicos (campos privados, métodos, construtores) de classes em um módulo, esse módulo precisa explicitamente `opens` o pacote contendo essas classes.
- Muitas bibliotecas e frameworks populares já foram modularizados ou fornecem módulos automáticos e adaptaram seu código para trabalhar com o JPMS. No entanto, em sistemas legados ou ao usar bibliotecas mais antigas, você pode precisar adicionar diretivas `opens` manualmente em seu `module-info.java` ou usar a opção `-add-opens` na linha de comando Java para contornar problemas de reflexão.

### Módulos Automáticos

Como mencionado brevemente, quando você coloca um JAR tradicional (sem `module-info.java`) no *module path* em vez do *classpath*, ele se torna um **módulo automático**.

- **Vantagens:** Permite que você comece a modularizar seu código enquanto ainda usa bibliotecas que não foram modularizadas. Todos os pacotes públicos do JAR são automaticamente exportados.
- **Desvantagens:**
    - **Nomenclatura Instável:** O nome do módulo automático é derivado do nome do JAR, o que pode não ser consistente ou único e pode mudar entre versões da biblioteca.
    - **Encapsulamento Fraco:** Exporta *tudo*, sem encapsulamento forte.
    - **Sem `requires` explícitos:** Não declara suas próprias dependências de módulo, o que pode levar a problemas em tempo de execução se as dependências não forem resolvidas corretamente.

Sempre que possível, é uma boa prática aguardar ou solicitar que as bibliotecas que você usa sejam modularizadas explicitamente. Para bibliotecas que ainda não o são, usar módulos automáticos é uma solução pragmática, mas com as ressalvas acima.

### O `java.base` Módulo

O módulo `java.base` é o módulo raiz de todo o JDK. Ele é implicitamente requerido por *todos* os outros módulos. Você nunca precisa (e não deve) declarar `requires java.base;` em seu `module-info.java`, pois o sistema de módulos Java o adiciona automaticamente. Ele contém as classes e interfaces fundamentais do Java, como `java.lang`, `java.util`, `java.io`, `java.net`, etc.

### 6\. Referências para Estudo Independente

Para aprofundar seu conhecimento sobre o JPMS, Gedê, A.R.I.A recomenda os seguintes recursos:

- **Documentação Oficial do Java (Oracle):**
    - [Modules - The Java Tutorials](https://www.google.com/search?q=https://docs.oracle.com/javase/tutorial/modules/index.html): Um excelente ponto de partida com exemplos e explicações claras.
    - [Java Platform Module System Whitepaper](https://www.google.com/search?q=https://openjdk.org/projects/jigsaw/docs/state-of-the-module-system/): Um documento mais técnico que detalha os objetivos e design do JPMS.
- **Livros:**
    - **"The Java Module System" por Nicolai Parlog:** Considerado uma referência essencial para entender o JPMS em profundidade. Aborda todos os aspectos, desde o básico até tópicos avançados.
    - **"Java 9 Modularity" por Sander Mak e Paul Bakker:** Outro livro muito bom que cobre a modularização e como aplicá-la em projetos reais.
- **Artigos e Tutoriais:**
    - **Baeldung - Java 9 Module System Tutorial:** (pesquise por "Baeldung Java 9 Module System") O Baeldung é um recurso fantástico para Java, e seus tutoriais sobre modularidade são muito práticos e detalhados.
    - **InfoQ - Migrating to Java 9 Modules:** (pesquise por "InfoQ migrating to Java 9 modules") Artigos da InfoQ frequentemente trazem insights valiosos sobre tecnologias emergentes e transições.
- **Vídeos e Cursos:**
    - Procure por palestras do **Nicolai Parlog** ou **Simon Ritter** sobre o Java Module System no YouTube ou em plataformas como a Devoxx. Eles são especialistas no assunto.

Ao estudar esses recursos, Gedê, você terá uma compreensão sólida do JPMS, o que certamente será um diferencial em sua carreira, seja no desenvolvimento Java ou na transição para outras linguagens e tecnologias de backend\!