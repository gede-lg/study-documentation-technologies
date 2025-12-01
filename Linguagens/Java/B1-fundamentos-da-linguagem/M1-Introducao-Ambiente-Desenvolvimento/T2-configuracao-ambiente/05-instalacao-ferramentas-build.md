# Instalação e Configuração de Ferramentas de Build (Maven, Gradle)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Ferramentas de build** são sistemas de automação que gerenciam o ciclo completo de construção de aplicações Java: compilação de código-fonte, resolução e download de dependências, execução de testes, empacotamento em JARs/WARs, e deployment. Conceitualmente, são **orquestradores do processo de desenvolvimento** que transformam código-fonte disperso e bibliotecas externas em artefatos executáveis prontos para produção.

**Maven** e **Gradle** são as duas ferramentas de build dominantes no ecossistema Java. Maven, criado em 2004 pela Apache Software Foundation, introduziu o conceito de **gerenciamento declarativo de dependências** e **convenção sobre configuração**. Gradle, lançado em 2008, trouxe **flexibilidade através de DSL programável** (Groovy/Kotlin) e **build incremental** para performance superior.

Essas ferramentas não são meros compiladores. Elas representam **infraestrutura de automação** que padroniza estrutura de projetos, gerencia versões de bibliotecas, executa pipelines de qualidade (testes, análise estática), e integra-se a ambientes de CI/CD. Sem ferramentas de build modernas, projetos Java de médio/grande porte seriam praticamente impossíveis de gerenciar manualmente.

### Contexto Histórico e Motivação

Antes de Maven e Gradle, desenvolvimento Java enfrentava **caos de gerenciamento de dependências**:

**Era Pré-Maven (1995-2004):**
- Desenvolvedores baixavam JARs manualmente de sites
- JARs eram commitados no controle de versão (projetos inchavam)
- Conflitos de versão eram resolvidos manualmente
- Estrutura de projetos era inconsistente entre equipes
- Scripts Ant (XML imperativo) eram longos e difíceis de manter

**Apache Ant** (2000) automatizou compilação mas não gerenciava dependências. Projetos típicos tinham diretório `lib/` com dezenas de JARs versionados manualmente.

**Maven (2004)** revolucionou ao introduzir:

1. **Repositório Central:** Bibliotecas hospedadas em servidor central (repo.maven.apache.org)
2. **Declaração de Dependências:** Arquivo `pom.xml` lista dependências; Maven baixa automaticamente
3. **Convenção sobre Configuração:** Estrutura padrão (`src/main/java`, `src/test/java`) elimina configuração manual
4. **Lifecycle Padrão:** Fases universais (compile, test, package, install, deploy)

**Motivação:** Eliminar "dependency hell" e padronizar build process através de convenções.

**Gradle (2008)** surgiu para resolver limitações do Maven:

1. **Flexibilidade:** Maven é rígido (convenção forte). Gradle permite customização via scripts programáveis
2. **Performance:** Build incremental (recompila apenas o que mudou), daemon persistente, cache agressivo
3. **DSL Moderna:** Groovy/Kotlin DSL mais conciso que XML do Maven

**Motivação:** Combinar convenção do Maven com flexibilidade do Ant e adicionar performance moderna.

### Problema Fundamental que Resolve

**1. Gerenciamento Automatizado de Dependências:**
Projeto depende de Spring Framework 6.0.0, que depende de 20+ bibliotecas. Ferramenta de build resolve **dependências transitivas** automaticamente.

**2. Reprodutibilidade de Builds:**
Build bem configurado produz artefato idêntico em qualquer máquina (dev, CI, produção). Elimina "funciona na minha máquina".

**3. Padronização de Estrutura:**
Convenção (`src/main/java`, `src/main/resources`) torna projetos imediatamente familiares. Desenvolvedores mudam de projeto sem curva de aprendizado de estrutura.

**4. Automação de Tarefas Repetitivas:**
Executar testes, gerar relatórios de cobertura, criar JARs executáveis, publicar em repositórios — tudo automatizado via comandos simples.

**5. Integração com Ecossistema:**
IDEs (IntelliJ, Eclipse), CI/CD (Jenkins, GitLab CI), análise de qualidade (SonarQube) integram nativamente com Maven/Gradle.

### Importância no Ecossistema

Ferramentas de build são **infraestrutura invisível mas essencial** do desenvolvimento Java moderno:

- **Adoção Universal:** >95% de projetos Java usam Maven ou Gradle
- **Padrão de Facto:** Maven Central Repository hospeda >10 milhões de artefatos
- **Base de CI/CD:** Pipelines de integração contínua dependem de builds reproduzíveis
- **Facilitador de Open-Source:** Bibliotecas Java são distribuídas via Maven Central, simplificando consumo

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Gerenciamento de Dependências:** Declaração, resolução transitiva, repositórios
2. **Lifecycle de Build:** Fases padronizadas (compile, test, package)
3. **Convenção sobre Configuração:** Estrutura padrão de diretórios
4. **Plugins/Tasks:** Extensibilidade através de plugins (Maven) ou tasks (Gradle)
5. **Build Incremental:** Recompilar apenas mudanças (Gradle)

### Pilares Fundamentais

- **Declaratividade (Maven):** Descrever "o quê" construir, não "como"
- **Programabilidade (Gradle):** Flexibilidade para lógica customizada
- **Reprodutibilidade:** Builds determinísticos através de dependency locking
- **Caching e Performance:** Daemon, build cache, execução paralela
- **Integração Universal:** Suporte nativo em IDEs, CI/CD, ferramentas de análise

### Nuances Importantes

- **Maven vs Gradle:** Maven é opinativo (convenção forte), Gradle é flexível (programável)
- **Repositórios:** Central (Maven Central) vs locais (~/.m2/repository)
- **Scopes de Dependência:** compile, runtime, test, provided
- **Plugins vs Tasks:** Maven usa plugins XML, Gradle usa tasks programáveis
- **Wrapper:** `mvnw`/`gradlew` garantem versão consistente da ferramenta

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Resolução de Dependências

Quando declaramos dependência:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
</dependency>
```

Ferramenta de build:

1. **Consulta Repositório:** Verifica cache local (~/.m2/repository), depois repositório remoto (Maven Central)
2. **Download do POM:** Baixa `spring-boot-starter-web-3.2.0.pom` (metadados)
3. **Resolução Transitiva:** Lê dependências do POM baixado, repete processo recursivamente
4. **Resolução de Conflitos:** Se múltiplas versões da mesma biblioteca são requisitadas, aplica estratégia (nearest wins em Maven, customizável em Gradle)
5. **Download de JARs:** Baixa JARs de todas dependências resolvidas
6. **Construção de Classpath:** Adiciona JARs ao classpath de compilação/execução

**Conceito Profundo:** Árvore de dependências pode ter centenas de nós. Algoritmo garante que cada JAR aparece apenas uma vez no classpath, resolvendo conflitos determinísticamente.

#### Lifecycle de Build (Maven)

Maven define lifecycle com fases sequenciais:

```
validate → compile → test → package → verify → install → deploy
```

Executar `mvn package`:
1. Executa `validate` (valida projeto)
2. Executa `compile` (compila src/main/java)
3. Executa `test` (roda testes em src/test/java)
4. Executa `package` (cria JAR/WAR em target/)

Cada fase vincula **goals** de plugins. Ex.: fase `compile` executa `maven-compiler-plugin:compile`.

**Conceito:** Lifecycle é sequencial. Não é possível pular fases (executar package sem compilar).

#### Build Incremental (Gradle)

Gradle analisa inputs/outputs de tasks:

```groovy
task compileJava {
  inputs.files(sourceSets.main.java)
  outputs.dir("$buildDir/classes")
}
```

Quando task é executada:
1. Gradle calcula hash dos inputs
2. Compara com hash de execução anterior (armazenado em cache)
3. Se inputs não mudaram, **pula task** (UP-TO-DATE)
4. Se mudaram, executa e atualiza cache

**Benefício:** Rebuilds são drasticamente mais rápidos. Mudar um arquivo recompila apenas classes afetadas.

### Princípios Subjacentes

#### Convenção sobre Configuração (Maven)

Estrutura padrão:
```
projeto/
  src/
    main/
      java/        # Código-fonte
      resources/   # Arquivos de configuração, properties
    test/
      java/        # Testes
      resources/   # Recursos de teste
  pom.xml          # Configuração Maven
```

**Princípio:** Seguir convenção elimina configuração. Maven assume que código está em `src/main/java` sem configuração explícita.

#### Dependency Scopes

Escopo determina quando dependência está disponível:

- **compile (padrão):** Disponível em compile, runtime, test
- **runtime:** Apenas runtime e test (ex.: JDBC drivers)
- **test:** Apenas test (ex.: JUnit)
- **provided:** Compilação e test, mas não incluída em WAR (fornecida por servidor)

**Conceito:** Scopes minimizam JARs no artefato final e evitam conflitos.

---

## 🔍 Análise Conceitual Profunda

### Maven

#### Instalação

**Download:**
```
Site: maven.apache.org/download.cgi
Arquivo: apache-maven-3.9.5-bin.zip
```

**Instalação Linux/macOS:**
```bash
# Extrair
tar -xvf apache-maven-3.9.5-bin.tar.gz
sudo mv apache-maven-3.9.5 /opt/maven

# Configurar variáveis
export M2_HOME=/opt/maven
export PATH=$M2_HOME/bin:$PATH

# Adicionar a ~/.bashrc para persistência
echo 'export M2_HOME=/opt/maven' >> ~/.bashrc
echo 'export PATH=$M2_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Instalação Windows:**
```
1. Extrair ZIP para C:\Program Files\Apache\maven
2. Adicionar variável M2_HOME: C:\Program Files\Apache\maven
3. Adicionar %M2_HOME%\bin ao PATH
```

**Verificação:**
```bash
mvn -version
```

**Saída esperada:**
```
Apache Maven 3.9.5
Maven home: /opt/maven
Java version: 17.0.1, vendor: Oracle Corporation
```

#### Estrutura do pom.xml

**Exemplo Básico:**

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- Coordenadas do projeto -->
    <groupId>com.exemplo</groupId>
    <artifactId>meu-app</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Dependência de produção -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>3.2.0</version>
        </dependency>

        <!-- Dependência de teste -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
            </plugin>
        </plugins>
    </build>
</project>
```

**Análise Conceitual:**

- **groupId:** Identificador da organização (convenção: domínio reverso)
- **artifactId:** Nome do projeto
- **version:** Versão (SNAPSHOT indica desenvolvimento)
- **properties:** Configurações reutilizáveis
- **dependencies:** Bibliotecas necessárias
- **build/plugins:** Customização do processo de build

#### Comandos Maven Essenciais

**Lifecycle:**

```bash
# Compilar código
mvn compile

# Executar testes
mvn test

# Criar JAR/WAR (limpa, compila, testa, empacota)
mvn clean package

# Instalar no repositório local (~/.m2/repository)
mvn install

# Limpar artefatos anteriores
mvn clean
```

**Dependências:**

```bash
# Listar árvore de dependências
mvn dependency:tree

# Baixar dependências sem compilar
mvn dependency:resolve

# Analisar dependências não usadas
mvn dependency:analyze
```

#### Maven Wrapper

Garante versão consistente de Maven no projeto:

**Instalação:**
```bash
mvn wrapper:wrapper
```

Cria:
```
.mvn/
  wrapper/
    maven-wrapper.properties
mvnw       # Unix
mvnw.cmd   # Windows
```

**Uso:**
```bash
./mvnw clean package  # Usa versão especificada em maven-wrapper.properties
```

**Conceito:** Desenvolvedores não precisam instalar Maven globalmente. Wrapper baixa versão correta automaticamente.

### Gradle

#### Instalação

**Download:**
```
Site: gradle.org/releases
Arquivo: gradle-8.5-bin.zip
```

**Instalação Linux/macOS:**
```bash
# Extrair
unzip gradle-8.5-bin.zip
sudo mv gradle-8.5 /opt/gradle

# Configurar variáveis
export GRADLE_HOME=/opt/gradle
export PATH=$GRADLE_HOME/bin:$PATH

# Persistência em ~/.bashrc
echo 'export GRADLE_HOME=/opt/gradle' >> ~/.bashrc
echo 'export PATH=$GRADLE_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Verificação:**
```bash
gradle -version
```

#### Estrutura do build.gradle

**Groovy DSL:**

```groovy
plugins {
    id 'java'
    id 'application'
}

group = 'com.exemplo'
version = '1.0.0'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    // Produção
    implementation 'org.springframework.boot:spring-boot-starter-web:3.2.0'

    // Teste
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}

application {
    mainClass = 'com.exemplo.Main'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

**Kotlin DSL (build.gradle.kts):**

```kotlin
plugins {
    java
    application
}

group = "com.exemplo"
version = "1.0.0"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web:3.2.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}

application {
    mainClass.set("com.exemplo.Main")
}

tasks.test {
    useJUnitPlatform()
}
```

**Análise Conceitual:**

- **plugins:** Aplicam funcionalidades (java, application)
- **repositories:** Onde buscar dependências (mavenCentral, jcenter, custom)
- **dependencies:** Bibliotecas (implementation, testImplementation)
- **tasks:** Customização de tarefas de build

#### Comandos Gradle Essenciais

```bash
# Compilar
gradle build

# Executar testes
gradle test

# Limpar e compilar
gradle clean build

# Executar aplicação
gradle run

# Listar tasks disponíveis
gradle tasks

# Árvore de dependências
gradle dependencies
```

#### Gradle Wrapper

**Instalação:**
```bash
gradle wrapper
```

Cria:
```
gradle/
  wrapper/
    gradle-wrapper.properties
gradlew       # Unix
gradlew.bat   # Windows
```

**Uso:**
```bash
./gradlew build  # Usa versão especificada em gradle-wrapper.properties
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Maven

**Cenário 1: Projetos Corporativos Tradicionais**
Empresas com padrões estabelecidos há anos usam Maven.

**Raciocínio:** Migração de Maven para Gradle tem custo. Se Maven atende, não há motivo para mudar.

**Cenário 2: Conformidade com Padrões**
Maven é opinativo. Força estrutura consistente.

**Raciocínio:** Ideal para organizações que valorizam padronização sobre flexibilidade.

### Quando Usar Gradle

**Cenário 1: Projetos Android**
Android Studio usa Gradle como build tool padrão.

**Cenário 2: Builds Complexos e Customizados**
Projetos com lógica de build não convencional.

**Raciocínio:** Gradle permite programação de tasks customizadas facilmente.

**Cenário 3: Performance Crítica**
Projetos grandes com tempos de build longos.

**Raciocínio:** Build incremental e cache do Gradle reduzem drasticamente tempo de rebuild.

---

## ⚠️ Limitações e Considerações

### Maven

**Limitações:**
- Rigidez: Customizações complexas são verbosas em XML
- Performance: Builds completos são mais lentos que Gradle

**Mitigação:** Para maioria dos projetos, convenção Maven é suficiente.

### Gradle

**Limitações:**
- Curva de aprendizado: Groovy/Kotlin DSL requer conhecimento de programação
- Build scripts podem tornar-se complexos demais

**Mitigação:** Seguir best practices, evitar lógica excessiva em scripts.

---

## 🔗 Interconexões Conceituais

### Relação com JDK

Ferramentas de build invocam `javac` e `java` do JDK configurado. Dependem de JAVA_HOME.

### Relação com IDEs

IntelliJ, Eclipse, VS Code importam projetos Maven/Gradle automaticamente, lendo pom.xml/build.gradle.

### Relação com CI/CD

Pipelines Jenkins, GitLab CI executam `mvn clean package` ou `./gradlew build` para construir artefatos.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. Criar primeiro projeto Maven/Gradle
2. Adicionar dependências
3. Executar testes
4. Gerar JAR executável
5. Publicar artefato em repositório

### Conceitos Avançados

- Multi-module projects
- Dependency management (BOM)
- Build cache e performance tuning
- Custom plugins/tasks

---

## 📚 Conclusão

Ferramentas de build **Maven** e **Gradle** são infraestrutura essencial do ecossistema Java moderno. **Maven** oferece convenção forte e simplicidade declarativa. **Gradle** combina convenção com flexibilidade programável e performance superior. Dominar instalação, configuração e uso básico dessas ferramentas é pré-requisito para desenvolvimento Java profissional. Elas transformam gerenciamento manual de dependências e compilação em processo automatizado, reproduzível e integrado ao ecossistema de desenvolvimento.
