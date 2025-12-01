# Compilação via Linha de Comando (javac)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Compilação via linha de comando** é o processo de transformar código-fonte Java (arquivos `.java`) em bytecode executável (arquivos `.class`) utilizando o compilador `javac` diretamente do terminal, sem intermediação de IDEs ou ferramentas de build. Conceitualmente, é a **interação direta com o compilador Java**, expondo o desenvolvedor ao funcionamento fundamental do processo de compilação.

O comando `javac` (Java Compiler) é o compilador oficial incluído no JDK. Ele realiza **análise léxica, sintática e semântica** do código, verifica tipos, resolve dependências entre classes, e gera bytecode otimizado que a JVM pode executar. Compilar via linha de comando revela o processo que IDEs automatizam silenciosamente em background.

Dominar compilação manual é **essencial para troubleshooting** e compreensão profunda. Quando IDE apresenta erro de compilação obscuro, entender flags e opções do javac permite diagnosticar e resolver problemas que automatização oculta.

### Contexto Histórico e Motivação

Nos primórdios de Java (1995-2000), antes de IDEs sofisticadas, desenvolvedores compilavam exclusivamente via linha de comando. `javac` era ferramenta principal de desenvolvimento. Scripts de build (makefiles, Ant) invocavam javac com flags específicas para controlar compilação.

Com ascensão de IDEs (Eclipse, NetBeans, IntelliJ nos anos 2000), compilação manual tornou-se menos comum para desenvolvimento day-to-day, mas permanece **fundamental para:**

1. **Ambientes de CI/CD:** Pipelines automatizados invocam javac ou Maven/Gradle (que internamente usam javac)
2. **Scripts de Build:** Automatização de compilação em ambientes sem IDE
3. **Educação:** Ensinar fundamentos antes de introduzir abstrações de IDE
4. **Debugging de Problemas de Build:** Quando IDE falha misteriosamente, compilação manual revela causa raiz

### Problema Fundamental que Resolve

**1. Transformação de Código em Bytecode:**
Código-fonte é texto legível por humanos. JVM não executa texto; executa bytecode. `javac` é tradutor essencial.

**2. Verificação de Correção:**
Compilador detecta erros sintáticos (ponto-e-vírgula faltando), erros semânticos (tipo incompatível), erros de referência (classe não encontrada) antes de execução.

**3. Otimização:**
`javac` aplica otimizações básicas (constant folding, dead code elimination) ao gerar bytecode.

**4. Geração de Metadados:**
`.class` inclui metadados (annotations, assinaturas de métodos) usados por frameworks em runtime.

**5. Independência de IDE:**
Compilar via linha de comando funciona em qualquer ambiente (servidores, containers, ambientes minimalistas) sem depender de IDE instalada.

### Importância no Ecossistema

Compilação via linha de comando é **skill fundamental** que todo desenvolvedor Java deve dominar:

- **Troubleshooting:** Resolver problemas de classpath, dependências
- **Automação:** Escrever scripts de build customizados
- **Compreensão:** Entender o que IDE faz "por baixo dos panos"
- **Ambientes Restritos:** Trabalhar em servidores remotos, containers, ambientes CI sem GUI

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sintaxe Básica:** `javac [options] [source files]`
2. **Flags Comuns:** `-d`, `-cp`/`-classpath`, `-sourcepath`, `-g`, `-verbose`
3. **Processo de Compilação:** Parsing → Análise Semântica → Geração de Bytecode
4. **Classpath:** Como compilador localiza classes referenciadas
5. **Compilação de Múltiplos Arquivos:** Compilar projetos complexos

### Pilares Fundamentais

- **Detecção de Erros:** Compilador verifica correção antes de execução
- **Portabilidade:** Bytecode gerado é independente de plataforma
- **Otimização:** javac otimiza código (limitadamente; maior otimização ocorre em JIT)
- **Metadados:** .class inclui informações para reflection e frameworks

### Nuances Importantes

- **Compilação Incremental:** javac compila apenas arquivos modificados (com flags apropriadas)
- **Dependências Implícitas:** javac pode compilar classes referenciadas automaticamente
- **Encoding:** Especificar encoding de caracteres (`-encoding UTF-8`)
- **Target Version:** Compilar para versões antigas do Java (`--release 11`)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Fases da Compilação

**1. Análise Léxica (Lexing):**
Transforma caracteres em tokens:

```java
public class Hello {
```

Tokens: `public`, `class`, `Hello`, `{`

**2. Análise Sintática (Parsing):**
Constrói Abstract Syntax Tree (AST) verificando gramática:

```
ClassDeclaration
  ├─ Modifiers: public
  ├─ Name: Hello
  └─ Body: ...
```

**3. Análise Semântica:**
- Verifica tipos (método retorna String mas return int?)
- Resolve símbolos (classe Scanner existe?)
- Verifica acessibilidade (campo private acessível daqui?)

**4. Geração de Bytecode:**
Traduz AST para instruções JVM:

```java
System.out.println("Hello");
```

Bytecode:
```
getstatic java/lang/System.out
ldc "Hello"
invokevirtual java/io/PrintStream.println
```

#### Classpath e Resolução de Dependências

Quando javac encontra referência a classe (ex.: `Scanner scanner`), ele:

1. **Procura .class existente:** Busca em classpath
2. **Procura .java correspondente:** Se não encontra .class, busca .java e compila
3. **Falha:** Se não encontra nem .class nem .java, erro "cannot find symbol"

**Conceito:** Classpath é lista de diretórios/JARs onde javac busca classes. Configuração incorreta causa erros de compilação.

### Princípios Subjacentes

#### Compilação é Transformação de Representação

Código-fonte é representação humana de lógica. Bytecode é representação que máquina (JVM) executa eficientemente. Compilador traduz entre representações preservando semântica.

#### Verificação Estática vs Runtime

Compilador detecta erros que podem ser determinados estaticamente (tipos incompatíveis). Erros que dependem de valores em runtime (divisão por zero, null pointer) não são detectados em compilação.

#### Bytecode como Alvo Intermediário

javac não gera código de máquina nativo (x86, ARM). Gera bytecode intermediário. JVM traduz bytecode para código nativo (via JIT). Isso garante portabilidade.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica do javac

**Comando Mais Simples:**

```bash
javac HelloWorld.java
```

Compila `HelloWorld.java`, gera `HelloWorld.class` no mesmo diretório.

**Sintaxe Completa:**

```bash
javac [options] [source-files] [@argfiles]
```

- **options:** Flags que controlam compilação
- **source-files:** Arquivos .java a compilar
- **@argfiles:** Arquivo contendo lista de opções/arquivos

### Flags e Opções Essenciais

#### `-d <directory>` (Destination Directory)

Especifica onde .class serão gerados:

```bash
javac -d bin src/HelloWorld.java
```

Cria `bin/HelloWorld.class`.

**Conceito:** Separar .class de .java mantém projeto organizado. Padrão Maven/Gradle: compilar src/ para target/classes ou build/classes.

#### `-cp` ou `-classpath` (Classpath)

Especifica onde buscar classes referenciadas:

```bash
javac -cp lib/commons-lang3-3.12.0.jar src/Main.java
```

**Conceito:** Se Main.java usa `org.apache.commons.lang3.StringUtils`, javac precisa encontrar essa classe. `-cp` indica JAR que a contém.

**Múltiplos JARs (Windows):**
```cmd
javac -cp "lib\A.jar;lib\B.jar" src\Main.java
```

**Múltiplos JARs (Linux/macOS):**
```bash
javac -cp lib/A.jar:lib/B.jar src/Main.java
```

#### `-sourcepath <path>` (Source Path)

Especifica onde buscar arquivos .java de classes referenciadas:

```bash
javac -sourcepath src -d bin src/Main.java
```

Se Main.java referencia `Helper`, javac busca `src/Helper.java` e compila automaticamente.

#### `--release <version>`

Compila para versão específica do Java (cross-compilation):

```bash
javac --release 11 Main.java
```

Gera bytecode compatível com Java 11, mesmo compilando em Java 17.

**Conceito:** Garante que código não usa APIs disponíveis apenas em versões mais recentes.

#### `-g` (Generate Debug Info)

Inclui informações de debug (números de linha, variáveis locais) em .class:

```bash
javac -g HelloWorld.java
```

**Uso:** Permite debuggers (jdb, IDEs) mostrarem código-fonte durante debugging.

**Variantes:**
- `-g:none`: Sem debug info
- `-g:lines`: Apenas números de linha
- `-g:vars`: Números de linha + variáveis locais

#### `-verbose`

Mostra informações detalhadas durante compilação:

```bash
javac -verbose HelloWorld.java
```

**Output:**
```
[parsing started HelloWorld.java]
[parsing completed 15ms]
[search path for source files: .]
[loading java/lang/Object.class]
[loading java/lang/String.class]
...
[wrote HelloWorld.class]
```

**Uso:** Debugging de problemas de classpath, entender quais classes são carregadas.

#### `-encoding <encoding>`

Especifica encoding de arquivos-fonte:

```bash
javac -encoding UTF-8 Main.java
```

**Conceito:** Se .java contém caracteres não-ASCII (acentos, símbolos) e encoding não é especificado, compilador pode interpretar incorretamente.

### Compilação de Múltiplos Arquivos

#### Arquivos Separados

```bash
javac Main.java Helper.java Utils.java
```

Compila três arquivos, gera três .class.

#### Wildcard (Unix)

```bash
javac *.java
```

Compila todos .java no diretório.

**Windows:** Wildcard não funciona nativamente. Use PowerShell ou liste arquivos explicitamente.

#### Arquivo de Lista (@file)

Para muitos arquivos, criar lista:

**sources.txt:**
```
src/com/example/Main.java
src/com/example/Helper.java
src/com/example/Utils.java
```

**Compilar:**
```bash
javac @sources.txt
```

**Conceito:** Evita limite de tamanho de linha de comando.

### Estrutura de Pacotes

**Código com Package:**

```java
package com.example;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from package!");
    }
}
```

**Estrutura de Diretórios:**
```
src/
  com/
    example/
      Main.java
```

**Compilar:**
```bash
javac -d bin src/com/example/Main.java
```

**Resultado:**
```
bin/
  com/
    example/
      Main.class
```

**Conceito:** javac cria estrutura de diretórios correspondente ao package. `-d bin` cria `bin/com/example/Main.class`.

### Exemplo Completo: Projeto com Dependências

**Estrutura:**
```
projeto/
  src/
    com/example/Main.java
  lib/
    commons-lang3-3.12.0.jar
  bin/
```

**Main.java:**
```java
package com.example;

import org.apache.commons.lang3.StringUtils;

public class Main {
    public static void main(String[] args) {
        String texto = StringUtils.capitalize("hello");
        System.out.println(texto);
    }
}
```

**Compilar (Linux/macOS):**
```bash
javac -cp lib/commons-lang3-3.12.0.jar \
      -d bin \
      src/com/example/Main.java
```

**Compilar (Windows):**
```cmd
javac -cp lib\commons-lang3-3.12.0.jar -d bin src\com\example\Main.java
```

**Resultado:**
```
bin/
  com/
    example/
      Main.class
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Compilar via Linha de Comando

**Cenário 1: Scripts de Automação**
Build scripts customizados para ambientes específicos.

**Raciocínio:** Controle total sobre processo, sem depender de Maven/Gradle.

**Cenário 2: Ambientes Restritos**
Servidores sem IDE, containers minimalistas.

**Raciocínio:** javac é tudo que está disponível.

**Cenário 3: Debugging de Problemas de Build**
IDE falha com erro vago. Compilar manualmente com `-verbose` revela causa.

**Cenário 4: Educação**
Ensinar fundamentos antes de introduzir ferramentas de alto nível.

---

## ⚠️ Limitações e Considerações

### Erros Comuns

**Erro 1: Class Not Found**

```bash
javac Main.java
```

**Erro:**
```
Main.java:3: error: cannot find symbol
import com.example.Helper;
               ^
  symbol:   class Helper
  location: package com.example
```

**Causa:** Helper.class não está em classpath.

**Solução:** Adicionar `-cp` ou `-sourcepath`.

**Erro 2: Package Structure Mismatch**

```java
package com.example;
public class Main { }
```

**Arquivo:** `src/Main.java` (sem diretório com/example)

**Compilar:**
```bash
javac src/Main.java
```

**Erro:**
```
error: class Main is public, should be declared in a file named Main.java
```

**Solução:** Mover para `src/com/example/Main.java`.

**Erro 3: Encoding Issues**

```java
String texto = "Olá"; // Arquivo salvo em ISO-8859-1
```

**Compilar sem especificar encoding:**
```bash
javac Main.java
```

**Resultado:** Caracteres acentuados podem ser corrompidos.

**Solução:**
```bash
javac -encoding UTF-8 Main.java
```

---

## 🔗 Interconexões Conceituais

### Relação com JDK

javac é parte do JDK (bin/javac). Requer JDK completo; JRE não inclui compilador.

### Relação com Bytecode

javac gera bytecode (.class) que JVM executa. Entender compilação ajuda entender bytecode.

### Relação com IDEs

IDEs invocam javac internamente. Configurações de IDE (project SDK, compiler options) mapeiam para flags javac.

### Relação com Ferramentas de Build

Maven, Gradle usam javac (ou compilador Eclipse ECJ). Plugin maven-compiler-plugin configura flags javac.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. Execução via linha de comando (java)
2. Criação de JARs (jar)
3. Debugging com jdb
4. Análise de bytecode com javap

### Conceitos Avançados

- Annotation processing
- Compilação modular (Java 9+)
- Compilação incremental
- Compiladores alternativos (Eclipse ECJ)

---

## 📚 Conclusão

**Compilação via linha de comando** com `javac` é habilidade fundamental que expõe funcionamento interno do processo de build Java. Dominar flags essenciais (`-d`, `-cp`, `--release`, `-verbose`) permite controle total sobre compilação, troubleshooting eficaz e automação de builds. Embora IDEs automatizem compilação, entender javac profundamente capacita desenvolvedor a resolver problemas complexos, trabalhar em ambientes restritos e compreender o que ferramentas de alto nível fazem implicitamente. É fundação para uso eficaz de Maven/Gradle e domínio completo do ecossistema Java.
