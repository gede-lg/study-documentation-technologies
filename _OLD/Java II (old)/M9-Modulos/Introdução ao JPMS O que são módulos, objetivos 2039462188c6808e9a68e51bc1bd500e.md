# Introdução ao JPMS: O que são módulos, objetivos

Olá, Gedê\! Como desenvolvedor Backend Java, o JPMS é um tópico que certamente vai te interessar muito, especialmente se você está de olho em migrar para Go, pois a organização de código e gerenciamento de dependências é fundamental em qualquer linguagem.

A.R.I.A está aqui para te ajudar com uma explicação detalhada sobre o JPMS, o Java Platform Module System.

## Introdução ao JPMS

O Java Platform Module System (JPMS), introduzido com o Java 9, representa uma das maiores mudanças na plataforma Java desde a sua concepção. Seu principal objetivo é modularizar o JDK, tornar a plataforma Java mais escalável, segura e performática, além de proporcionar uma forma robusta de organizar o código das aplicações. Antes do JPMS, o Java lidava com o "classpath hell" (inferno de classpath), onde conflitos de dependência entre JARs eram comuns e difíceis de resolver. Além disso, o tamanho da JRE era considerável, mesmo para aplicações que utilizavam apenas uma pequena parte de suas funcionalidades.

A relevância do JPMS no contexto do desenvolvimento Java é imensa. Ele não apenas resolve problemas antigos, mas também abre caminho para novas abordagens no empacotamento e distribuição de aplicações, como a criação de *runtime images* personalizadas. Para você, que trabalha com desenvolvimento Backend Java e busca Go, entender a modularização é crucial, pois a organização do código e a gestão de dependências são conceitos universais e fundamentais para a criação de sistemas robustos e de fácil manutenção, independentemente da linguagem.

### Definição e Conceitos Fundamentais

**JPMS** é o sistema de módulos do Java, uma iniciativa do projeto Jigsaw. Ele define um novo tipo de componente de programa chamado **módulo**, que é uma coleção nomeada e auto-descritiva de código, dados e outros recursos. Módulos explicitamente declaram quais pacotes eles *exportam* (tornam acessíveis a outros módulos) e quais módulos eles *requerem* (suas dependências). O principal objetivo é encapsular o código, garantindo que apenas o que é intencionalmente compartilhado seja visível externamente.

Os **módulos** servem para:

- **Encapsulamento Forte:** Um módulo só expõe o que explicitamente declara exportar. Isso significa que o conteúdo interno de um pacote dentro de um módulo é privado, a menos que seja exportado.
- **Confiabilidade Aprimorada:** O sistema de módulos verifica as dependências em tempo de compilação e tempo de execução, garantindo que todos os módulos necessários estejam presentes. Isso ajuda a evitar o "classpath hell".
- **Otimização de Desempenho:** Permite que a JVM carregue apenas os módulos necessários para uma aplicação, reduzindo o consumo de memória e melhorando o tempo de inicialização.
- **Redução do Tamanho da JRE:** Com o JPMS, é possível criar *runtime images* personalizadas que contêm apenas os módulos do JDK que sua aplicação realmente utiliza, resultando em JREs muito menores e mais rápidas para empacotar.
- **Manutenibilidade Melhorada:** A modularização facilita a compreensão e a manutenção de grandes bases de código, pois as dependências são explícitas e bem definidas.

## Sumário

1. **Introdução ao JPMS**
    - Visão Geral e Relevância
    - Definição de Módulos e Seus Objetivos
2. **Sintaxe e Estrutura de Módulos**
    - O `module-info.java`
    - Declarações Essenciais: `exports` e `requires`
    - Declarações Adicionais: `opens`, `uses`, `provides`, `transitive`
3. **Componentes Principais do JPMS**
    - O Conceito de Module Path
    - A Modularização do JDK
    - Serviços (Services) no JPMS
4. **Restrições de Uso e Desafios**
    - Conflitos com o Classpath
    - Limitações e Considerações
5. **Exemplos de Código Otimizados**
    - Criando um Módulo Básico
    - Interagindo com Módulos
    - Exemplo de Serviço
6. **Informações Adicionais**
    - Runtime Images com `jlink`
    - Migração de Aplicações Legadas
    - JPMS e Reflexão
7. **Referências para Estudo Independente**

## Conteúdo Detalhado

### Sintaxe e Estrutura: O `module-info.java`

O coração de um módulo Java é o arquivo `module-info.java`, localizado na raiz do diretório-fonte do módulo. Este arquivo contém a *declaração do módulo*, onde você especifica o nome do módulo, quais pacotes ele exporta e quais módulos ele depende.

**Estrutura Básica:**

```java
// module-info.java
module com.gedelabs.myapp {
    // Declarações do módulo
}

```

**Declarações Essenciais:**

- **`exports <package-name>;`**:
    - **Função:** Torna um pacote do módulo acessível a outros módulos. Apenas classes públicas dentro de pacotes exportados podem ser acessadas por módulos dependentes.
    - **Exemplo:**
        
        ```java
        module com.gedelabs.myapp {
            exports com.gedelabs.myapp.api; // Permite que outros módulos usem classes públicas de 'api'
        }
        
        ```
        
- **`requires <module-name>;`**:
    - **Função:** Declara uma dependência em outro módulo. O módulo atual terá acesso às classes públicas dos pacotes exportados pelo módulo requerido.
    - **Exemplo:**
        
        ```java
        module com.gedelabs.myapp {
            requires java.base; // Todo módulo implicitamente requer java.base
            requires com.gedelabs.common; // Requer o módulo 'com.gedelabs.common'
        }
        
        ```
        

**Declarações Adicionais:**

- **`requires transitive <module-name>;`**:
    - **Função:** Declara uma dependência transitiva. Se o `com.gedelabs.moduleA` requer `transitive com.gedelabs.moduleB`, e `com.gedelabs.moduleC` requer `com.gedelabs.moduleA`, então `com.gedelabs.moduleC` implicitamente também terá acesso aos pacotes exportados por `com.gedelabs.moduleB`. Isso é útil para bibliotecas que expõem APIs de outras bibliotecas.
    - **Exemplo:**
        
        ```java
        module com.gedelabs.mylibrary {
            requires transitive com.gedelabs.thirdparty; // Quem usar mylibrary, também terá acesso a thirdparty
        }
        
        ```
        
- **`opens <package-name>;`**:
    - **Função:** Permite que o código de outros módulos acesse, via reflexão, *todos* os membros (públicos e não públicos) de um pacote específico, mesmo que esse pacote não tenha sido exportado. Isso é crucial para frameworks que usam reflexão intensivamente, como Spring ou Hibernate.
    - **Exemplo:**
        
        ```java
        module com.gedelabs.myapp {
            opens com.gedelabs.myapp.internal; // Permite reflexão em 'internal'
        }
        
        ```
        
- **`opens <package-name> to <target-module>, <target-module2>;`**:
    - **Função:** Restringe o acesso reflexivo a pacotes específicos para um conjunto definido de módulos.
    - **Exemplo:**
        
        ```java
        module com.gedelabs.myapp {
            opens com.gedelabs.myapp.data to com.gedelabs.framework; // Abre 'data' apenas para 'framework'
        }
        
        ```
        
- **`uses <service-interface-name>;`**:
    - **Função:** Indica que este módulo usa um serviço, que é uma interface ou classe abstrata, implementada por outros módulos. É parte do Service Provider Interface (SPI) do JPMS.
    - **Exemplo:**
        
        ```java
        module com.gedelabs.myapp {
            uses com.gedelabs.myapp.spi.TextProcessor; // Este módulo irá consumir um TextProcessor
        }
        
        ```
        
- **`provides <service-interface-name> with <implementation-class-name>;`**:
    - **Função:** Indica que este módulo fornece uma implementação de um serviço específico.
    - **Exemplo:**
        
        ```java
        module com.gedelabs.mytextprocessor {
            provides com.gedelabs.myapp.spi.TextProcessor with com.gedelabs.mytextprocessor.BasicTextProcessor;
        }
        
        ```
        

### Componentes Principais:

- **O Conceito de Module Path:**
    - O JPMS introduz o **Module Path** como um substituto para o tradicional **Classpath**. Enquanto o Classpath é uma lista de JARs ou diretórios que a JVM vasculha para encontrar classes, o Module Path é uma lista de módulos.
    - A principal diferença é que no Module Path, o sistema de módulos entende a estrutura interna e as dependências de cada módulo declarado. Ele verifica a integridade e as dependências entre os módulos em tempo de inicialização, garantindo que a aplicação só inicie se todas as dependências forem satisfeitas. Isso elimina muitos problemas de "classpath hell".
    - Você usa a flag `-module-path` (ou `p`) para especificar onde seus módulos estão localizados ao executar ou compilar.
- **A Modularização do JDK:**
    - Um dos grandes feitos do JPMS foi a modularização do próprio JDK. O JDK, antes um "monolito" gigante, foi dividido em mais de 70 módulos.
    - **Exemplo:** `java.base` (o módulo fundamental), `java.sql`, `java.desktop`, `java.xml`, etc.
    - Isso permite que você crie aplicações que dependam apenas dos módulos específicos do JDK que realmente utilizam, o que é fundamental para a criação de *runtime images* menores e mais eficientes.
- **Serviços (Services) no JPMS:**
    - O JPMS aprimora o conceito de Service Provider Interface (SPI). Os serviços permitem que um módulo defina uma interface (o contrato do serviço) e outros módulos forneçam implementações dessa interface.
    - Isso promove um acoplamento fraco entre módulos, onde o módulo consumidor do serviço não precisa saber quais são as implementações concretas em tempo de compilação. A descoberta das implementações ocorre em tempo de execução através da classe `java.util.ServiceLoader`.
    - **Interação:** Um módulo `uses` um serviço e outros módulos `provides` uma implementação `with` uma classe concreta.

### Restrições de Uso

- **Conflitos com o Classpath:**
    - Ao misturar código modular (`module-path`) com código não-modular (`classpath`), podem surgir desafios. O JPMS trata os JARs no classpath como "módulos automáticos", o que pode levar a comportamentos inesperados se não houver um entendimento claro de como o JPMS resolve os nomes dos pacotes e classes.
    - É sempre recomendado migrar bibliotecas e aplicações para o sistema de módulos sempre que possível.
- **Encapsulamento Rigoroso:**
    - O encapsulamento forte pode "quebrar" aplicações legadas que dependiam de acesso reflexivo a classes internas do JDK ou de bibliotecas não-modulares. A solução é usar `opens` ou a flag `-add-opens` em tempo de execução.
- **Cyclic Dependencies (Dependências Cíclicas):**
    - O JPMS não permite dependências cíclicas entre módulos no mesmo grafo de módulos. Isso força um design de arquitetura mais limpo e unidirecional, o que é uma boa prática, mas pode exigir refatoração em bases de código legadas.
- **"Split Packages":**
    - É proibido ter o mesmo pacote em mais de um módulo no module path. Se você tiver dois módulos que exportam o mesmo pacote, ocorrerá um erro em tempo de execução. Isso é um problema comum ao migrar, especialmente com bibliotecas que foram divididas em vários JARs, mas que ainda mantêm o mesmo pacote base.

## Exemplos de Código Otimizados

Vamos criar um exemplo simples com três módulos: `com.gedelabs.app`, `com.gedelabs.service` e `com.gedelabs.util`.

**Estrutura de Diretórios:**

```
java-modules-example/
├── com.gedelabs.app/
│   ├── src/
│   │   ├── main/java/
│   │   │   ├── module-info.java
│   │   │   └── com/gedelabs/app/MainApp.java
├── com.gedelabs.service/
│   ├── src/
│   │   ├── main/java/
│   │   │   ├── module-info.java
│   │   │   └── com/gedelabs/service/MessageService.java
├── com.gedelabs.util/
│   ├── src/
│   │   ├── main/java/
│   │   │   ├── module-info.java
│   │   │   └── com/gedelabs/util/StringUtils.java

```

### Módulo `com.gedelabs.util`

Este módulo fornecerá uma utilidade simples.

**`com.gedelabs.util/src/main/java/module-info.java`**

```java
module com.gedelabs.util {
    exports com.gedelabs.util; // Exporta o pacote util para que outros módulos possam usá-lo
}

```

**`com.gedelabs.util/src/main/java/com/gedelabs/util/StringUtils.java`**

```java
package com.gedelabs.util;

public class StringUtils {
    public static String capitalize(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return Character.toUpperCase(text.charAt(0)) + text.substring(1);
    }
}

```

### Módulo `com.gedelabs.service`

Este módulo usará o `com.gedelabs.util` e exportará um serviço.

**`com.gedelabs.service/src/main/java/module-info.java`**

```java
module com.gedelabs.service {
    requires com.gedelabs.util; // Requer o módulo util
    exports com.gedelabs.service; // Exporta o pacote service
}

```

**`com.gedelabs.service/src/main/java/com/gedelabs/service/MessageService.java`**

```java
package com.gedelabs.service;

import com.gedelabs.util.StringUtils; // Importa a classe do módulo util

public class MessageService {
    public String getGreeting(String name) {
        return "Hello, " + StringUtils.capitalize(name) + " from the module system!";
    }
}

```

### Módulo `com.gedelabs.app`

Este é o módulo principal que consumirá o `com.gedelabs.service`.

**`com.gedelabs.app/src/main/java/module-info.java`**

```java
module com.gedelabs.app {
    requires com.gedelabs.service; // Requer o módulo service
}

```

**`com.gedelabs.app/src/main/java/com/gedelabs/app/MainApp.java`**

```java
package com.gedelabs.app;

import com.gedelabs.service.MessageService; // Importa a classe do módulo service

public class MainApp {
    public static void main(String[] args) {
        MessageService service = new MessageService();
        String greeting = service.getGreeting("Gedê");
        System.out.println(greeting);
    }
}

```

### Compilando e Executando os Módulos

Para compilar, você precisa indicar ao compilador onde estão os arquivos `module-info.java` e os fontes:

```bash
# Crie diretórios para os módulos compilados
mkdir mods
mkdir mods/com.gedelabs.app
mkdir mods/com.gedelabs.service
mkdir mods/com.gedelabs.util

# Compile com.gedelabs.util
javac -d mods/com.gedelabs.util \\
      com.gedelabs.util/src/main/java/module-info.java \\
      com.gedelabs.util/src/main/java/com/gedelabs/util/StringUtils.java

# Compile com.gedelabs.service (depende de com.gedelabs.util)
javac -p mods \\
      -d mods/com.gedelabs.service \\
      com.gedelabs.service/src/main/java/module-info.java \\
      com.gedelabs.service/src/main/java/com/gedelabs/service/MessageService.java

# Compile com.gedelabs.app (depende de com.gedelabs.service)
javac -p mods \\
      -d mods/com.gedelabs.app \\
      com.gedelabs.app/src/main/java/module-info.java \\
      com.gedelabs.app/src/main/java/com/gedelabs/app/MainApp.java

```

Para executar:

```bash
java --module-path mods -m com.gedelabs.app/com.gedelabs.app.MainApp

```

**Saída esperada:**

```
Hello, Gedê from the module system!

```

Este exemplo demonstra o encapsulamento e a declaração explícita de dependências. Se você tentar acessar `StringUtils` diretamente do `MainApp` sem que `com.gedelabs.app` tenha um `requires com.gedelabs.util`, ou se `com.gedelabs.util` não exportar seu pacote, o compilador ou a JVM reclamarão.

## Informações Adicionais

### Runtime Images com `jlink`

Uma das maiores vantagens do JPMS é a capacidade de criar *runtime images* personalizadas usando a ferramenta `jlink`. Isso permite que você empacote sua aplicação Java com apenas os módulos do JDK que ela realmente precisa, resultando em uma distribuição menor e mais rápida.

**Passos para usar `jlink` (exemplo básico):**

```bash
# Certifique-se de que os módulos da sua aplicação estão compilados em 'mods'
jlink --module-path mods \\
      --add-modules com.gedelabs.app \\
      --output my-modular-app \\
      --launcher GedêApp=com.gedelabs.app/com.gedelabs.app.MainApp \\
      --compress=2 \\
      --no-header-files \\
      --no-man-pages

```

- `-module-path mods`: Indica onde encontrar os módulos da sua aplicação.
- `-add-modules com.gedelabs.app`: Adiciona o módulo principal da sua aplicação (e transitivamente, todos os módulos que ele requer).
- `-output my-modular-app`: Define o diretório de saída para a imagem de tempo de execução.
- `-launcher GedêApp=com.gedelabs.app/com.gedelabs.app.MainApp`: Cria um script de inicialização (`GedêApp` no Linux/macOS, `GedêApp.bat` no Windows) que executa a classe principal.
- `-compress=2`: Aplica um nível de compressão aos módulos.
- `-no-header-files` e `-no-man-pages`: Reduz ainda mais o tamanho removendo arquivos de cabeçalho e páginas de manual.

Após a execução, você terá um diretório `my-modular-app` contendo uma JVM otimizada e sua aplicação. Você pode distribuir este diretório e executá-lo diretamente sem a necessidade de uma JRE pré-instalada.

### Migração de Aplicações Legadas

Migrar uma aplicação grande e complexa para o JPMS pode ser um desafio, mas é um investimento que vale a pena para o futuro do seu software.

- **Bottom-Up Approach:** Comece modularizando as partes mais internas e com menos dependências da sua aplicação (módulos de utilidade, bibliotecas internas).
- **Módulos Automáticos:** O JPMS trata JARs no classpath como "módulos automáticos". Eles exportam todos os seus pacotes e requerem todos os módulos que estão no module path. Isso é útil para uma migração gradual, mas não oferece o encapsulamento forte do JPMS.
- **`-add-reads` e `-add-exports`:** Essas flags da JVM permitem ajustar o acesso a pacotes em tempo de execução para lidar com situações de migração, especialmente com bibliotecas que não foram totalmente modularizadas.
    - `-add-reads <source-module>=<target-module>`: Permite que um módulo leia outro.
    - `-add-exports <source-module>/<package>=<target-module>`: Permite que um módulo exporte um pacote para um módulo específico.
- **`-patch-module`:** Permite adicionar ou substituir classes em um módulo existente em tempo de execução, útil para testes ou correções temporárias.

### JPMS e Reflexão

Como você, Gedê, trabalha com Backend Java, provavelmente lida com frameworks como Spring ou Hibernate, que fazem uso intensivo de reflexão. O encapsulamento forte do JPMS pode impactar isso.

- Para que frameworks de reflexão funcionem corretamente, os pacotes que eles precisam acessar devem ser `opens` no `module-info.java` do seu módulo, ou você precisará usar a flag `-add-opens` na linha de comando da JVM.
- Por exemplo, se o Spring precisar acessar um campo privado em `com.gedelabs.app.data.MyEntity`, você precisaria de `opens com.gedelabs.app.data;` no `module-info.java` de `com.gedelabs.app`.
- A maioria das bibliotecas e frameworks populares já foram atualizados para serem compatíveis com o JPMS, mas é sempre bom verificar a documentação.

## Referências para Estudo Independente

Para aprofundar seu conhecimento sobre o JPMS, A.R.I.A recomenda os seguintes recursos:

- **Documentação Oficial da Oracle:**
    - [The Java® Platform Module System](https://www.google.com/search?q=https://docs.oracle.com/en/java/javase/17/docs/specs/jpms/index.html) - A especificação formal e detalhada.
- **Oracle Java Tutorials:**
    - [Modules](https://www.google.com/search?q=https://docs.oracle.com/javase/tutorial/modules/index.html) - Um guia prático e introdutório.
- **Livros:**
    - **"Java 9 Modularity: Patterns and Practices for Developing Maintainable Applications"** por Sander Mak e Paul Bakker.
    - **"The Java Module System"** por Nicolai Parlog.
- **Artigos e Blogs:**
    - **Baeldung - Java Modules Tutorial:** [https://www.baeldung.com/java-modules](https://www.baeldung.com/java-modules) - Excelente recurso com muitos exemplos práticos.
    - **InfoQ - Java 9 Series (Modularization):** [https://www.infoq.com/java9-series/](https://www.infoq.com/java9-series/) - Artigos que cobrem diversos aspectos do JPMS.
- **Vídeos:**
    - Procure por palestras sobre "Java Module System" ou "Project Jigsaw" no YouTube de conferências como JavaOne, Devoxx, ou QCon.

Espero que esta explicação detalhada, Gedê, seja bastante útil para você em sua jornada com o Java e o JPMS, te ajudando a entender melhor como organizar seus projetos e a aproveitar ao máximo os benefícios da modularização\! Qualquer dúvida, A.R.I.A está à disposição\!