# Grade de Aprendizado Java - Completa e Detalhada

## **BLOCO 1: FUNDAMENTOS DA LINGUAGEM JAVA**

### **M1: Introdução ao Java e Ambiente de Desenvolvimento**

#### Tópicos:

**T1 - História e Evolução do Java**
   - Origem do Java na Sun Microsystems (1995)
   - Filosofia "Write Once, Run Anywhere" (WORA)
   - Características principais: orientação a objetos, portabilidade, segurança
   - Diferenças entre JDK, JRE e JVM
   - Evolução das versões do Java (Java 1.0 até Java 21+)
   - Java SE, Java EE, Java ME e Jakarta EE
   - Licenciamento e Oracle vs OpenJDK

**T2 - Configuração do Ambiente de Desenvolvimento**
   - Download e instalação do JDK (Oracle JDK vs OpenJDK)
   - Configuração de variáveis de ambiente (JAVA_HOME, PATH)
   - Escolha e instalação de IDEs (IntelliJ IDEA, Eclipse, NetBeans, VS Code)
   - Configuração básica da IDE escolhida
   - Instalação e configuração de ferramentas de build (Maven, Gradle)
   - Primeiro programa: Hello World
   - Compilação via linha de comando (javac)
   - Execução via linha de comando (java)

**T3 - Estrutura Básica de um Programa Java**
   - Anatomia de uma classe Java
   - Método main como ponto de entrada
   - Pacotes (packages) e declaração package
   - Imports e organização de código
   - Comentários (linha única, múltiplas linhas, Javadoc)
   - Convenções de nomenclatura (CamelCase, snake_case)
   - Indentação e formatação de código
   - Estrutura de diretórios e arquivos .java

**T4 - Compilação e Execução**
   - Processo de compilação (código-fonte para bytecode)
   - Arquivos .class e bytecode
   - JVM: arquitetura e funcionamento
   - ClassLoader e carregamento de classes
   - JIT Compiler (Just-In-Time)
   - Garbage Collector: conceitos iniciais
   - Execução de programas Java
   - Parâmetros de linha de comando

---

### **M2: Tipos de Dados e Variáveis**

#### Tópicos:

**T1 - Tipos Primitivos**
   - byte: tamanho, faixa de valores, uso
   - short: tamanho, faixa de valores, uso
   - int: tamanho, faixa de valores, uso (tipo padrão para inteiros)
   - long: tamanho, faixa de valores, uso, sufixo L
   - float: tamanho, precisão, uso, sufixo f
   - double: tamanho, precisão, uso (tipo padrão para ponto flutuante)
   - char: representação Unicode, aspas simples, valores especiais
   - boolean: true e false, uso em expressões lógicas
   - Tamanhos em memória de cada tipo primitivo
   - Valores padrão (default) para tipos primitivos

**T2 - Declaração e Inicialização de Variáveis**
   - Sintaxe de declaração
   - Inicialização inline e separada
   - Múltiplas declarações na mesma linha
   - Escopo de variáveis (local, instância, classe)
   - Variáveis locais e obrigatoriedade de inicialização
   - Variáveis de instância e valores padrão
   - Variáveis de classe (static)
   - Shadowing de variáveis

**T3 - Literais e Constantes**
   - Literais inteiros (decimal, hexadecimal, octal, binário)
   - Literais de ponto flutuante
   - Literais de caracteres e sequências de escape
   - Literais de String
   - Literais booleanos
   - Uso de underscores em literais numéricos (Java 7+)
   - Palavra-chave final para constantes
   - Convenção de nomenclatura para constantes (UPPER_CASE)

**T4 - Conversão de Tipos (Type Casting)**
   - Conversão implícita (widening)
   - Conversão explícita (narrowing)
   - Promoção numérica em expressões
   - Riscos de perda de dados em narrowing
   - Casting entre tipos primitivos
   - Operador de casting
   - Conversão de String para tipos primitivos (wrapper classes)
   - Autoboxing e unboxing (conceito introdutório)

**T5 - Wrapper Classes**
   - Byte, Short, Integer, Long
   - Float, Double
   - Character
   - Boolean
   - Diferença entre tipos primitivos e wrappers
   - Métodos úteis das wrapper classes
   - Imutabilidade das wrapper classes
   - Cache de valores (Integer cache -128 a 127)
   - Autoboxing e unboxing detalhado
   - Performance: primitivos vs wrappers

---

### **M3: Operadores e Expressões**

#### Tópicos:

**T1 - Operadores Aritméticos**
   - Adição (+)
   - Subtração (-)
   - Multiplicação (*)
   - Divisão (/)
   - Módulo (%)
   - Precedência de operadores aritméticos
   - Divisão inteira vs divisão de ponto flutuante
   - Overflow e underflow em operações aritméticas

**T2 - Operadores de Atribuição**
   - Atribuição simples (=)
   - Atribuições compostas (+=, -=, *=, /=, %=)
   - Atribuição múltipla
   - Expressões de atribuição como valores

**T3 - Operadores Unários**
   - Incremento pré-fixado (++variavel)
   - Incremento pós-fixado (variavel++)
   - Decremento pré-fixado (--variavel)
   - Decremento pós-fixado (variavel--)
   - Negação aritmética (-)
   - Negação lógica (!)
   - Diferença entre pré e pós incremento/decremento

**T4 - Operadores Relacionais**
   - Igual a (==)
   - Diferente de (!=)
   - Maior que (>)
   - Menor que (<)
   - Maior ou igual a (>=)
   - Menor ou igual a (<=)
   - Comparação de tipos primitivos
   - Problema da comparação de objetos com ==

**T5 - Operadores Lógicos**
   - AND lógico (&&)
   - OR lógico (||)
   - NOT lógico (!)
   - Short-circuit evaluation
   - Tabelas verdade
   - Combinação de expressões lógicas
   - Precedência de operadores lógicos

**T6 - Operadores Bit a Bit**
   - AND bit a bit (&)
   - OR bit a bit (|)
   - XOR bit a bit (^)
   - NOT bit a bit (~)
   - Deslocamento à esquerda (<<)
   - Deslocamento à direita com sinal (>>)
   - Deslocamento à direita sem sinal (>>>)
   - Aplicações práticas de operadores bit a bit

**T7 - Operador Ternário**
   - Sintaxe: condição ? valor_se_true : valor_se_false
   - Uso em atribuições condicionais
   - Aninhamento de operadores ternários
   - Legibilidade vs concisão

**T8 - Operador instanceof**
   - Verificação de tipo em runtime
   - Sintaxe e uso
   - Hierarquia de classes e instanceof
   - Pattern matching com instanceof (Java 14+)

**T9 - Precedência e Associatividade**
   - Tabela completa de precedência de operadores
   - Associatividade da esquerda para direita
   - Associatividade da direita para esquerda
   - Uso de parênteses para controlar avaliação
   - Boas práticas de legibilidade

---

### **M4: Estruturas de Controle de Fluxo**

#### Tópicos:

**T1 - Estrutura Condicional if-else**
   - Sintaxe do if simples
   - Bloco if-else
   - if-else-if encadeado
   - if aninhado
   - Boas práticas: evitar ifs aninhados profundos
   - Condições booleanas complexas
   - Escopo de variáveis em blocos if

**T2 - Estrutura switch-case**
   - Sintaxe tradicional do switch
   - Uso de break
   - Caso default
   - Fall-through behavior
   - Switch com tipos suportados (int, char, String, enum)
   - Switch expressions (Java 12+)
   - Pattern matching no switch (Java 17+)
   - Yield em switch expressions
   - Arrow syntax (Java 14+)

**T3 - Estrutura de Repetição while**
   - Sintaxe do while
   - Condição de parada
   - Loop infinito com while
   - Uso de while para validação de entrada
   - Comparação while vs do-while

**T4 - Estrutura de Repetição do-while**
   - Sintaxe do do-while
   - Diferença fundamental: execução garantida da primeira iteração
   - Casos de uso apropriados
   - Validação de entrada com do-while

**T5 - Estrutura de Repetição for**
   - Sintaxe do for tradicional
   - Inicialização, condição, incremento
   - Múltiplas variáveis no for
   - For aninhado
   - Loop infinito com for
   - Omissão de partes do for

**T6 - Enhanced for (for-each)**
   - Sintaxe do for-each
   - Iteração sobre arrays
   - Iteração sobre coleções
   - Limitações do for-each (sem acesso ao índice)
   - Quando usar for vs for-each

**T7 - Palavras-chave de Controle de Loop**
   - break: saída imediata do loop
   - continue: pular para próxima iteração
   - Labels com break e continue
   - Return dentro de loops
   - Boas práticas no uso de break e continue

**T8 - Estruturas de Controle Aninhadas**
   - Loops aninhados
   - Condicionais dentro de loops
   - Loops dentro de condicionais
   - Complexidade e legibilidade
   - Refatoração de estruturas complexas

---

### **M5: Arrays**

#### Tópicos:

**T1 - Declaração e Criação de Arrays**
   - Sintaxe de declaração
   - Criação com operador new
   - Tamanho fixo de arrays
   - Arrays de tipos primitivos
   - Arrays de objetos
   - Inicialização inline
   - Arrays anônimos

**T2 - Acesso e Modificação de Elementos**
   - Índices baseados em zero
   - Operador de índice []
   - Atribuição de valores
   - Leitura de valores
   - ArrayIndexOutOfBoundsException
   - Propriedade length

**T3 - Inicialização de Arrays**
   - Inicialização com valores padrão
   - Inicialização explícita com chaves {}
   - Inicialização em duas etapas
   - Arrays.fill() para preenchimento
   - Inicialização de arrays de objetos

**T4 - Arrays Multidimensionais**
   - Arrays bidimensionais (matrizes)
   - Declaração de arrays 2D
   - Acesso a elementos em matrizes
   - Arrays irregulares (jagged arrays)
   - Arrays tridimensionais e além
   - Iteração em arrays multidimensionais
   - Aplicações práticas de matrizes

**T5 - Iteração sobre Arrays**
   - For tradicional com índice
   - Enhanced for (for-each)
   - While e do-while
   - Iteração em arrays multidimensionais
   - Percorrer arrays de trás para frente

**T6 - Classe Arrays (java.util.Arrays)**
   - Arrays.toString() para impressão
   - Arrays.sort() para ordenação
   - Arrays.binarySearch() para busca binária
   - Arrays.equals() para comparação
   - Arrays.fill() para preenchimento
   - Arrays.copyOf() e Arrays.copyOfRange()
   - Arrays.asList() para conversão em lista
   - Arrays.stream() (introdução ao Stream API)

**T7 - Cópia de Arrays**
   - Cópia superficial vs profunda
   - Atribuição de referência (não é cópia)
   - System.arraycopy()
   - Arrays.copyOf()
   - Clone de arrays
   - Cópia manual com loops

**T8 - Varargs (Argumentos Variáveis)**
   - Sintaxe de varargs (...)
   - Uso em métodos
   - Varargs como array
   - Limitações: apenas um vararg por método, deve ser último parâmetro
   - Ambiguidade com sobrecarga

---

### **M6: Strings**

#### Tópicos:

**T1 - Imutabilidade de Strings**
   - Conceito de imutabilidade
   - String pool (intern pool)
   - Criação de Strings: literal vs new
   - Otimização de memória
   - Implicações da imutabilidade em performance

**T2 - Criação e Inicialização de Strings**
   - Literais de String
   - Construtor new String()
   - Construtor a partir de char array
   - Construtor a partir de byte array
   - Método intern()
   - Comparação: == vs equals()

**T3 - Métodos Principais da Classe String**
   - length(): obter tamanho
   - charAt(): acessar caractere por índice
   - substring(): extrair substring
   - indexOf() e lastIndexOf(): buscar substring
   - startsWith() e endsWith(): verificar início/fim
   - contains(): verificar presença de substring
   - replace(), replaceAll(), replaceFirst(): substituição
   - toLowerCase() e toUpperCase(): conversão de caso
   - trim(), strip(), stripLeading(), stripTrailing(): remover espaços
   - split(): dividir string em array
   - join(): juntar strings com delimitador (Java 8+)
   - repeat(): repetir string (Java 11+)
   - isBlank() e isEmpty(): verificar vazio

**T4 - Comparação de Strings**
   - equals(): comparação de conteúdo
   - equalsIgnoreCase(): ignorar case
   - compareTo(): comparação lexicográfica
   - compareToIgnoreCase()
   - Problema de usar == com Strings
   - Null-safety em comparações

**T5 - Concatenação de Strings**
   - Operador +
   - Método concat()
   - Performance de concatenação
   - StringBuilder para concatenações em loop
   - String.join() e String.format()
   - Text blocks (Java 15+)

**T6 - StringBuilder e StringBuffer**
   - Mutabilidade vs imutabilidade
   - Quando usar StringBuilder
   - Métodos principais: append(), insert(), delete(), replace()
   - reverse(), setCharAt(), deleteCharAt()
   - Capacidade e expansão automática
   - StringBuilder vs StringBuffer (thread-safety)
   - Performance: String vs StringBuilder vs StringBuffer

**T7 - Formatação de Strings**
   - String.format() e especificadores de formato
   - Printf-style formatting
   - Formatação de números
   - Formatação de datas
   - Classe Formatter
   - System.out.printf()

**T8 - Expressões Regulares (Regex) - Introdução**
   - Classe Pattern
   - Classe Matcher
   - Métodos matches(), find(), group()
   - replaceAll() e replaceFirst() com regex
   - split() com regex
   - Metacaracteres básicos
   - Quantificadores
   - Grupos de captura

**T9 - Text Blocks (Java 15+)**
   - Sintaxe de text blocks com """
   - Indentação automática
   - Sequências de escape em text blocks
   - Uso para SQL, JSON, HTML
   - Métodos stripIndent() e translateEscapes()

---

## **BLOCO 2: PROGRAMAÇÃO ORIENTADA A OBJETOS (POO)**

### **M1: Conceitos Fundamentais de POO**

#### Tópicos:

**T1 - Paradigma Orientado a Objetos**
   - Diferença entre programação procedural e OO
   - Vantagens da POO
   - Conceitos centrais: abstração, encapsulamento, herança, polimorfismo
   - Modelagem do mundo real através de objetos
   - Relacionamento entre objetos

**T2 - Classes e Objetos**
   - Definição de classe
   - Classe como blueprint (molde)
   - Definição de objeto
   - Instanciação de objetos com new
   - Referências vs objetos
   - Múltiplas referências para o mesmo objeto
   - Null reference
   - Garbage collection e objetos sem referência

**T3 - Atributos de classes (Campos/Variáveis de Instância)**
   - Declaração de atributos
   - Atributos de instância vs atributos de classe
   - Modificadores de acesso em atributos
   - Valores padrão de atributos
   - Inicialização de atributos
   - Atributos final
   - Convenções de nomenclatura

**T4 - Métodos de classes**
   - Declaração de métodos
   - Assinatura de método
   - Parâmetros e argumentos
   - Tipos de retorno
   - Palavra-chave return
   - Métodos void
   - Sobrecarga de métodos (overloading)
   - Passagem de parâmetros por valor
   - Variáveis locais vs atributos
   - Palavra-chave this

**T5 - Construtores de classes**
   - Definição e propósito
   - Construtor padrão (default)
   - Construtores parametrizados
   - Sobrecarga de construtores
   - Chamada entre construtores com this()
   - Inicialização de atributos no construtor
   - Construtor privado
   - Ordem de inicialização em Java

**T6 - Palavra-chave this**
   - Referência ao objeto atual
   - Uso para diferenciar atributos de parâmetros
   - Chamada de construtores com this()
   - Passagem do próprio objeto como argumento
   - Retorno de this para method chaining

**T7 - Palavra-chave static**
   - Membros estáticos vs membros de instância
   - Atributos estáticos (variáveis de classe)
   - Métodos estáticos
   - Blocos de inicialização estática
   - Acesso a membros estáticos
   - Limitações de métodos estáticos
   - Uso de static em constantes
   - Classe Math e métodos utilitários estáticos

**T8 - Blocos de Inicialização (Factories)**
   - Blocos de inicialização de instância
   - Blocos de inicialização estática
   - Ordem de execução: blocos estáticos → blocos de instância → construtor
   - Uso prático de blocos de inicialização
---

### **M2: Encapsulamento**

#### Tópicos:

**T1 - Conceito de Encapsulamento**
   - Definição: esconder detalhes de implementação
   - Proteção de dados
   - Interface pública vs implementação privada
   - Benefícios: manutenibilidade, flexibilidade, segurança

**T2 - Modificadores de Acesso**
   - private: acesso apenas dentro da própria classe
   - default (package-private): acesso no mesmo pacote
   - protected: acesso no pacote e subclasses
   - public: acesso irrestrito
   - Tabela de visibilidade
   - Modificadores em classes, atributos, métodos, construtores
   - Boas práticas de visibilidade

**T3 - Getters e Setters**
   - Padrão JavaBeans
   - Nomenclatura: get/set + NomeDoAtributo
   - Getters para leitura de atributos
   - Setters para modificação de atributos
   - Validação em setters
   - Getters/setters para boolean: is/set
   - Geração automática por IDEs
   - Discussão: DTOs e records como alternativa

**T4 - Imutabilidade**
   - Objetos imutáveis
   - Benefícios: thread-safety, simplicidade
   - Como criar classes imutáveis
   - Atributos final
   - Sem setters
   - Defensive copying
   - Exemplos: String, Integer, LocalDate

**T5 - Pacotes (Packages)**
   - Organização de código em pacotes
   - Declaração package
   - Convenção de nomenclatura (domínio invertido)
   - Importação de classes: import
   - Import estático
   - Wildcard imports (*)
   - Estrutura de diretórios
   - Acesso default (package-private)
   - Pacotes padrão do Java: java.lang, java.util, java.io

---

### **M3: Herança**

#### Tópicos:

**T1 - Conceito de Herança**
   - Reutilização de código
   - Hierarquia de classes
   - Superclasse (classe pai) e subclasse (classe filha)
   - Relação "é-um" (is-a)
   - Palavra-chave extends
   - Java não suporta herança múltipla de classes

**T2 - Superclasse e Subclasse**
   - Definição de superclasse
   - Definição de subclasse
   - Herança de atributos e métodos
   - Acesso a membros herdados
   - Modificador protected
   - Construtores não são herdados

**T3 - Palavra-chave super**
   - Referência à superclasse
   - Acesso a atributos da superclasse
   - Acesso a métodos da superclasse
   - Chamada ao construtor da superclasse: super()
   - super() deve ser primeira instrução no construtor
   - Chamada implícita vs explícita de super()

**T4 - Sobrescrita de Métodos (Override)**
   - Conceito de sobrescrita
   - Regras para sobrescrita
   - Anotação @Override
   - Assinatura idêntica
   - Modificador de acesso igual ou mais permissivo
   - Tipo de retorno covariante (Java 5+)
   - Sobrescrita vs sobrecarga
   - Métodos que não podem ser sobrescritos (final, static, private)

**T5 - Classe Object**
   - Todas as classes herdam de Object
   - Métodos principais: toString(), equals(), hashCode()
   - clone(), finalize() (deprecated)
   - getClass(), notify(), notifyAll(), wait()
   - Sobrescrita de toString()
   - Sobrescrita de equals() e hashCode()
   - Contrato entre equals() e hashCode()

**T6 - Modificador final**
   - Variáveis final: constantes
   - Métodos final: não podem ser sobrescritos
   - Classes final: não podem ser herdadas
   - Blank final variables
   - Static final: constantes de classe
   - Uso de final para performance e design

**T7 - Classes e Métodos Abstratos**
   - Palavra-chave abstract
   - Classes abstratas: não podem ser instanciadas
   - Métodos abstratos: sem implementação
   - Subclasses concretas devem implementar métodos abstratos
   - Diferença: classe abstrata vs interface
   - Quando usar classes abstratas
   - Construtores em classes abstratas

**T8 - Upcasting e Downcasting**
   - Polimorfismo por substituição
   - Upcasting implícito
   - Downcasting explícito
   - ClassCastException
   - Uso de instanceof antes de casting
   - Pattern matching com instanceof (Java 16+)

---

### **M4: Polimorfismo**

#### Tópicos:

**T1 - Conceito de Polimorfismo**
   - Definição: muitas formas
   - Polimorfismo de sobrecarga (compile-time)
   - Polimorfismo de sobrescrita (runtime)
   - Benefícios: flexibilidade, extensibilidade
   - Acoplamento fraco

**T2 - Polimorfismo de Sobrecarga (Overloading)**
   - Múltiplos métodos com mesmo nome
   - Diferenciação por parâmetros (quantidade, tipo, ordem)
   - Resolução em tempo de compilação
   - Sobrecarga de construtores
   - Sobrecarga vs sobrescrita
   - Varargs e sobrecarga

**T3 - Polimorfismo de Sobrescrita (Overriding)**
   - Método sobrescrito na subclasse
   - Resolução em tempo de execução (dynamic binding)
   - @Override annotation
   - Invocação do método da superclasse com super
   - Covariância de tipo de retorno

**T4 - Binding Dinâmico (Late Binding)**
   - Ligação de método em runtime
   - Virtual method invocation
   - Tabela de métodos virtuais (vtable)
   - Performance de polimorfismo
   - Métodos static e final não usam binding dinâmico

**T5 - Polimorfismo com Interfaces**
   - Referência de interface apontando para implementação
   - Contratos e implementações
   - Múltiplas implementações de interface
   - Collections e polimorfismo (List, Set, Map)

**T6 - Covariance e Contravariance**
   - Covariância em tipos de retorno
   - Contravariância em parâmetros (não suportado nativamente)
   - Arrays covariantes
   - ArrayStoreException
   - Generics e invariância

---

### **M5: Interfaces**

#### Tópicos:

**T1 - Conceito de Interface**
   - Definição: contrato de comportamento
   - Interface vs classe abstrata
   - Palavra-chave interface
   - Múltiplas interfaces (herança múltipla de tipo)
   - Métodos abstratos implícitos
   - Constantes em interfaces (public static final)

**T2 - Implementação de Interfaces**
   - Palavra-chave implements
   - Implementação de todos os métodos abstratos
   - Múltiplas interfaces implementadas
   - Classe abstrata implementando interface parcialmente
   - Herança e implementação simultâneas

**T3 - Métodos Default (Java 8+)**
   - Palavra-chave default
   - Implementação padrão em interfaces
   - Sobrescrita de métodos default
   - Resolução de conflitos: diamond problem
   - Uso de super para chamar método default de interface específica
   - Evolução de APIs com métodos default

**T4 - Métodos Static em Interfaces (Java 8+)**
   - Métodos utilitários em interfaces
   - Não podem ser sobrescritos
   - Acesso via nome da interface
   - Diferença entre métodos default e static

**T5 - Métodos Private em Interfaces (Java 9+)**
   - Métodos auxiliares privados
   - Reutilização de código entre métodos default
   - Private static methods
   - Encapsulamento dentro da interface

**T6 - Interfaces Funcionais**
   - Exatamente um método abstrato
   - Anotação @FunctionalInterface
   - Base para expressões lambda
   - SAM (Single Abstract Method)
   - Exemplos: Runnable, Callable, Comparator
   - Pacote java.util.function

**T7 - Interfaces Marker**
   - Interfaces sem métodos
   - Indicação de capacidade ou propriedade
   - Exemplos: Serializable, Cloneable, Remote
   - Uso de annotations como alternativa moderna

**T8 - Herança de Interfaces**
   - Interface estendendo outra interface
   - Palavra-chave extends em interfaces
   - Múltiplas interfaces pai
   - Acumulação de métodos abstratos

---

### **M6: Classes Aninhadas (Nested Classes)**

#### Tópicos:

**T1 - Tipos de Classes Aninhadas**
   - Static nested classes
   - Inner classes (non-static)
   - Local classes
   - Anonymous classes
   - Quando usar cada tipo

**T2 - Static Nested Classes**
   - Declaração e sintaxe
   - Acesso a membros estáticos da classe externa
   - Instanciação independente
   - Uso como helper classes
   - Encapsulamento e organização

**T3 - Inner Classes (Non-Static)**
   - Referência implícita à instância externa
   - Acesso a todos os membros da classe externa
   - Instanciação requer instância externa
   - Sintaxe: Externa.new Interna()
   - Uso em padrões como Iterator

**T4 - Local Classes**
   - Declaradas dentro de métodos
   - Escopo limitado ao bloco
   - Acesso a variáveis locais efetivamente final
   - Uso em situações específicas e limitadas

**T5 - Anonymous Classes (Classes Anônimas)**
   - Declaração e instanciação simultâneas
   - Implementação de interface ou extensão de classe
   - Uso em callbacks e event handlers
   - Sintaxe e limitações
   - Substituição por lambdas (Java 8+)
   - Uso com Swing, JavaFX, threads

**T6 - Escopo e Acesso**
   - Acesso de classes aninhadas a membros da classe externa
   - Acesso da classe externa a membros de classes aninhadas
   - Variáveis efetivamente final
   - Shadowing em classes aninhadas

### **M7: Enums**

#### Tópicos:

**T1 - Introdução a Enums**
   - Definição: tipo especial de classe para constantes
   - Declaração de enum (enum NomeTipo)
   - Enums como tipos seguros (type-safe)
   - Vantagens sobre constantes int/String
   - Enum como classe final implícita
   - Construtores privados implícitos
   - Namespace próprio para cada enum
   - Comparação com == (segura)
   - Compilação: cada constante é instância única
   - Uso em switch statements

**T2 - Declaração e Uso Básico**
   - Sintaxe: enum Dia { SEGUNDA, TERCA, ... }
   - Declarar constantes enum
   - Acessar constantes: Dia.SEGUNDA
   - Tipos enum como parâmetros de métodos
   - Variáveis do tipo enum
   - Atribuição e comparação
   - Enum em coleções (Set, Map)
   - Import static de constantes enum
   - Convenção de nomenclatura (maiúsculas)
   - Declaração dentro e fora de classes

**T3 - Métodos Automáticos de Enum**
   - values(): retorna array de todas as constantes
   - valueOf(String): converte String para enum
   - name(): retorna nome da constante
   - ordinal(): retorna posição (índice)
   - toString(): representação em String
   - compareTo(): comparação por ordinal
   - equals(): comparação de igualdade
   - hashCode(): código hash
   - getDeclaringClass(): retorna Class do enum
   - Iteração com values() em loop

**T4 - Construtores em Enums**
   - Declaração de construtores
   - Construtores sempre private (implícito)
   - Passar argumentos para constantes
   - Inicialização de atributos via construtor
   - Múltiplos construtores (sobrecarga)
   - Construtores chamados na declaração
   - Exemplo: enum com nome e valor
   - Construtores executados apenas uma vez por constante
   - Sintaxe: CONSTANTE(args)
   - Validação no construtor

**T5 - Atributos e Métodos em Enums**
   - Declarar atributos de instância
   - Atributos final (recomendado)
   - Métodos getter para atributos
   - Métodos de instância customizados
   - Métodos static em enums
   - Encapsulamento de dados
   - Lógica de negócio em métodos
   - Atributos calculados
   - Métodos utilitários
   - Enum com múltiplos atributos

**T6 - Métodos Abstratos e Comportamento Específico**
   - Declarar métodos abstratos em enum
   - Implementação obrigatória em cada constante
   - Sintaxe: CONSTANTE { implementação }
   - Constant-specific method implementation
   - Polimorfismo com enums
   - Strategy pattern com enums
   - Sobrescrita de métodos por constante
   - Métodos concretos como padrão
   - Corpo da constante com métodos anônimos
   - Aplicação: operações matemáticas, cálculos

**T7 - Enum em Switch**
   - Sintaxe do switch com enum
   - Uso sem qualificação (sem NomeEnum.)
   - Case para cada constante
   - Default case
   - Switch expression com enum (Java 14+)
   - Pattern matching com enums
   - Validação de completude
   - Vantagens sobre switch com int/String
   - Exemplo prático: máquina de estados
   - Refatoração de if-else para switch

**T8 - Enums com Interfaces**
   - Enum implementando interface
   - Sintaxe: enum Nome implements Interface
   - Implementação de métodos da interface
   - Polimorfismo: enum como tipo da interface
   - Interface com métodos default
   - Múltiplas interfaces
   - Segregação de comportamento
   - Enum em hierarquias de tipos
   - Exemplo: Calculadora com operações
   - Vantagens da composição

**T9 - EnumSet e EnumMap**
   - EnumSet: Set especializado para enums
   - Criação: EnumSet.of(), allOf(), noneOf(), range()
   - Performance otimizada (bit vector)
   - Operações de conjunto (união, interseção)
   - EnumMap: Map com chave enum
   - Criação: new EnumMap<>(Enum.class)
   - Performance superior a HashMap
   - Ordem natural das chaves (ordinal)
   - Uso em configurações e flags
   - Iteração eficiente

**T10 - Comparação e Serialização**
   - Comparação com == (segura e eficiente)
   - equals() vs == em enums
   - compareTo(): ordem por ordinal
   - Comparator customizado para enums
   - Serialização de enums (singleton garantido)
   - Enum e readResolve()
   - Desserialização segura
   - Enum em JSON (Jackson, Gson)
   - @JsonValue, @JsonCreator
   - Conversão String ↔ Enum

**T11 - Padrões de Projeto com Enums**
   - Singleton pattern (enum com uma constante)
   - Strategy pattern
   - State pattern (máquina de estados)
   - Factory pattern
   - Command pattern
   - Enum como registro de configuração
   - Lookup map para valueOf customizado
   - Reverse lookup (valor → enum)
   - Enum com cache
   - Substituição de constantes com switch

**T12 - Boas Práticas e Anti-Padrões**
   - Usar enum em vez de constantes int
   - Preferir enum a boolean em flags múltiplos
   - Atributos devem ser final
   - Evitar ordinal() para lógica
   - Documentar significado de cada constante
   - Enum extensível via interface
   - Não usar enum para grandes conjuntos dinâmicos
   - Evitar lógica complexa em construtores
   - valueOf() pode lançar IllegalArgumentException
   - Tratar exceções ao converter String

---

## **BLOCO 3: TRATAMENTO DE EXCEÇÕES**

### **M1: Fundamentos de Exceções**

#### Tópicos:

**T1 - Conceito de Exceção**
   - Definição: evento anormal durante execução
   - Diferença entre erro e exceção
   - Hierarquia de exceções: Throwable
   - Error vs Exception
   - Checked vs Unchecked exceptions
   - Benefícios do tratamento de exceções

**T2 - Hierarquia de Classes de Exceção**
   - Throwable (raiz)
   - Error: erros graves do sistema (OutOfMemoryError, StackOverflowError)
   - Exception: exceções verificadas
   - RuntimeException: exceções não verificadas
   - Principais exceções: NullPointerException, ArrayIndexOutOfBoundsException, IllegalArgumentException, NumberFormatException

**T3 - Checked vs Unchecked Exceptions**
   - Checked: verificadas em tempo de compilação
   - Obrigatoriedade de tratamento ou declaração
   - Unchecked: RuntimeException e subclasses
   - Não requerem tratamento obrigatório
   - Quando usar cada tipo
   - Exemplos de cada categoria

**T4 - Bloco try-catch**
   - Sintaxe básica
   - Captura de exceções
   - Ordem de cláusulas catch (mais específica primeiro)
   - Múltiplos blocos catch
   - Multi-catch (Java 7+): pipe (|)
   - Variável implicitamente final em catch

**T5 - Bloco finally**
   - Execução garantida
   - Uso para liberação de recursos
   - Finally com e sem catch
   - Finally e return
   - Exceções em bloco finally
   - Supressão de exceções

**T6 - Try-with-Resources (Java 7+)**
   - Gestão automática de recursos
   - Interface AutoCloseable
   - Sintaxe do try-with-resources
   - Múltiplos recursos
   - Supressão de exceções
   - Effectively final resources (Java 9+)

**T7 - Throw vs Throws**
   - throw: lançar exceção manualmente
   - throws: declarar exceções no método
   - Sintaxe e uso de throw
   - Sintaxe e uso de throws
   - Múltiplas exceções em throws
   - Relançamento de exceções

**T8 - Criação de Exceções Personalizadas**
   - Estender Exception (checked)
   - Estender RuntimeException (unchecked)
   - Construtores padrão
   - Mensagens de erro
   - Informações adicionais
   - Boas práticas em exceções customizadas

**T9 - Stack Trace**
   - printStackTrace()
   - Leitura e interpretação de stack traces
   - Linha de origem do erro
   - Chamadas de métodos em sequência
   - Causa raiz (root cause)

**T10 - Boas Práticas**
    - Capturar exceções específicas
    - Não capturar Exception ou Throwable genérico
    - Não usar exceções para controle de fluxo
    - Logar exceções apropriadamente
    - Limpar recursos em finally ou try-with-resources
    - Documentar exceções com @throws no Javadoc
    - Fail-fast vs fail-safe

---

## **BLOCO 4: COLEÇÕES (COLLECTIONS FRAMEWORK)**

### **M1: Introdução ao Collections Framework**

#### Tópicos:

**T1 - Visão Geral do Framework**
   - Pacote java.util
   - Interfaces principais: Collection, List, Set, Queue, Map
   - Hierarquia de interfaces
   - Implementações principais
   - Vantagens sobre arrays
   - Generics e type safety

**T2 - Interface Collection**
   - Métodos principais: add(), remove(), contains()
   - size(), isEmpty(), clear()
   - Iterator e iteração
   - toArray()
   - Operações em massa: addAll(), removeAll(), retainAll()
   - containsAll()

**T3 - Generics em Collections**
   - Parametrização de tipo
   - Type safety
   - Eliminação de casting
   - Sintaxe: ArrayList<String>
   - Raw types (evitar)
   - Diamond operator <> (Java 7+)

**T4 - Iterator**
   - Interface Iterator
   - Métodos: hasNext(), next(), remove()
   - Iteração segura
   - ConcurrentModificationException
   - fail-fast vs fail-safe iterators
   - forEach com lambda (Java 8+)

**T5 - Enhanced for Loop com Collections**
   - Sintaxe for-each
   - Uso com Collection e Iterable
   - Limitações do for-each
   - Remoção durante iteração

---

### **M2: List Interface**

#### Tópicos:

**T1 - Características de List**
   - Ordenação por inserção
   - Permite duplicatas
   - Acesso por índice
   - Métodos adicionais: get(), set(), add(index, element)
   - indexOf(), lastIndexOf()
   - subList()

**T2 - ArrayList**
   - Implementação com array dinâmico
   - Capacidade inicial e expansão
   - Performance: acesso O(1), inserção/remoção O(n)
   - Quando usar ArrayList
   - Construtores
   - ensureCapacity(), trimToSize()

**T3 - LinkedList**
   - Implementação com lista duplamente encadeada
   - Performance: acesso O(n), inserção/remoção O(1) nas pontas
   - Métodos adicionais: addFirst(), addLast(), getFirst(), getLast()
   - removeFirst(), removeLast()
   - Implementa Queue e Deque
   - Quando usar LinkedList

**T4 - Vector**
   - Classe legada (synchronized)
   - Diferença para ArrayList
   - Thread-safe mas com overhead
   - Capacidade e incremento
   - Evitar em código moderno (usar Collections.synchronizedList())

**T5 - Stack**
   - Classe legada que estende Vector
   - LIFO (Last In, First Out)
   - Métodos: push(), pop(), peek()
   - empty(), search()
   - Alternativa moderna: Deque

**T6 - Comparação: ArrayList vs LinkedList**
   - Estrutura interna
   - Performance em diferentes operações
   - Uso de memória
   - Casos de uso ideais para cada

**T7 - Métodos Utilitários: Collections**
   - Collections.sort()
   - Collections.reverse()
   - Collections.shuffle()
   - Collections.binarySearch()
   - Collections.min() e Collections.max()
   - Collections.frequency()
   - Collections.disjoint()
   - Coleções imutáveis: unmodifiableList()
   - Coleções sincronizadas: synchronizedList()

---

### **M3: Set Interface**

#### Tópicos:

**T1 - Características de Set**
   - Não permite duplicatas
   - Baseado em equals() e hashCode()
   - Sem garantia de ordem (exceto LinkedHashSet e TreeSet)
   - Métodos de Collection
   - Operações de conjunto: união, interseção, diferença

**T2 - HashSet**
   - Implementação com hash table
   - Performance O(1) para operações básicas
   - Ordem não determinística
   - Permite null
   - Capacidade inicial e fator de carga
   - Quando usar HashSet

**T3 - LinkedHashSet**
   - Mantém ordem de inserção
   - Lista duplamente encadeada + hash table
   - Performance similar a HashSet
   - Overhead de memória
   - Iteração previsível

**T4 - TreeSet**
   - Implementação com árvore Red-Black
   - Elementos ordenados (natural ou Comparator)
   - Performance O(log n)
   - Não permite null (exceção em comparação)
   - NavigableSet: métodos de navegação
   - first(), last(), higher(), lower()
   - subSet(), headSet(), tailSet()

**T5 - EnumSet**
   - Otimizado para enums
   - Implementação com bit vector
   - Performance excepcional
   - Métodos de fábrica: allOf(), noneOf(), of(), range()

**T6 - Comparação: HashSet vs TreeSet vs LinkedHashSet**
   - Performance
   - Ordenação
   - Uso de memória
   - Casos de uso apropriados

---

### **M4: Queue e Deque Interfaces**

#### Tópicos:

**T1 - Queue Interface**
   - FIFO (First In, First Out)
   - Métodos: offer(), poll(), peek()
   - add(), remove(), element() (lançam exceções)
   - Diferença entre métodos com/sem exceção
   - Uso em processamento de tarefas

**T2 - PriorityQueue**
   - Heap binário
   - Ordenação por prioridade (natural ou Comparator)
   - Não é thread-safe
   - Performance O(log n) para inserção/remoção
   - peek() retorna menor elemento
   - Permite null? Não

**T3 - Deque Interface**
   - Double Ended Queue
   - Operações em ambas as extremidades
   - Pode ser usada como Stack ou Queue
   - Métodos: addFirst(), addLast(), offerFirst(), offerLast()
   - removeFirst(), removeLast(), pollFirst(), pollLast()
   - getFirst(), getLast(), peekFirst(), peekLast()

**T4 - ArrayDeque**
   - Implementação com array redimensionável
   - Mais eficiente que LinkedList para Stack e Queue
   - Não permite null
   - Performance superior para operações em pilha/fila
   - Crescimento dinâmico

**T5 - BlockingQueue (java.util.concurrent)**
   - Interface para filas thread-safe
   - Operações bloqueantes: put(), take()
   - Uso em produtor-consumidor
   - Implementações: ArrayBlockingQueue, LinkedBlockingQueue, PriorityBlockingQueue

---

### **M5: Map Interface**

#### Tópicos:

**T1 - Características de Map**
   - Pares chave-valor
   - Chaves únicas
   - Valores podem duplicar
   - Não estende Collection
   - Métodos principais: put(), get(), remove()
   - containsKey(), containsValue()
   - keySet(), values(), entrySet()

**T2 - HashMap**
   - Hash table implementation
   - Performance O(1) para operações básicas
   - Permite null key (apenas uma) e null values
   - Ordem não garantida
   - Capacidade inicial e fator de carga (0.75 padrão)
   - Colisões e buckets
   - Árvores para buckets grandes (Java 8+)

**T3 - LinkedHashMap**
   - Mantém ordem de inserção
   - Ou ordem de acesso (modo access-order)
   - Útil para cache LRU
   - Performance similar a HashMap
   - Overhead de memória adicional

**T4 - TreeMap**
   - Árvore Red-Black (NavigableMap)
   - Chaves ordenadas
   - Performance O(log n)
   - Não permite null keys
   - Métodos de navegação: firstKey(), lastKey()
   - higherKey(), lowerKey(), ceilingKey(), floorKey()
   - subMap(), headMap(), tailMap()

**T5 - Hashtable**
   - Classe legada
   - Synchronized (thread-safe)
   - Não permite null key ou null value
   - Performance inferior (overhead de sincronização)
   - Usar ConcurrentHashMap em vez disso

**T6 - ConcurrentHashMap (java.util.concurrent)**
   - Thread-safe sem bloquear toda a tabela
   - Segmentação
   - Performance superior a Hashtable
   - Não permite null key ou null value
   - Operações atômicas: putIfAbsent(), replace()

**T7 - EnumMap**
   - Otimizado para chaves enum
   - Array interno
   - Performance excepcional
   - Ordem natural dos enums
   - Não permite null keys

**T8 - WeakHashMap**
   - Chaves com weak references
   - Entries removidas automaticamente quando chave não é mais usada
   - Útil para caches
   - Garbage collection

**T9 - Iteração sobre Maps**
   - keySet() + loop
   - values() + loop
   - entrySet() + loop (mais eficiente)
   - forEach com lambda (Java 8+)
   - Streams API (Java 8+)

**T10 - Métodos Utilitários em Map (Java 8+)**
    - getOrDefault()
    - putIfAbsent()
    - replace() e replaceAll()
    - remove(key, value)
    - compute(), computeIfAbsent(), computeIfPresent()
    - merge()

---

### **M6: Comparable e Comparator**

#### Tópicos:

**T1 - Interface Comparable**
   - Ordenação natural
   - Método compareTo()
   - Contrato: consistência com equals()
   - Implementação em classes próprias
   - Uso em TreeSet, TreeMap, Collections.sort()

**T2 - Interface Comparator**
   - Ordenação customizada
   - Método compare()
   - Múltiplos comparadores para mesma classe
   - Comparator como classe separada
   - Comparator como classe anônima
   - Comparator com lambda (Java 8+)

**T3 - Comparator com Métodos Default (Java 8+)**
   - comparing()
   - thenComparing()
   - reversed()
   - nullsFirst(), nullsLast()
   - comparingInt(), comparingLong(), comparingDouble()
   - Chaining de comparadores

**T4 - Collections.sort() e List.sort()**
   - Ordenação com Comparable
   - Ordenação com Comparator
   - Algoritmo de ordenação (TimSort)
   - Estabilidade de ordenação

---

## **BLOCO 5: ENTRADA E SAÍDA (I/O)**

### **M1: I/O Básico**

#### Tópicos:

**T1 - Conceitos de I/O**
   - Streams de bytes vs streams de caracteres
   - Input streams e Output streams
   - Readers e Writers
   - Bufferização
   - Pacote java.io

**T2 - Byte Streams**
   - InputStream (abstrata)
   - OutputStream (abstrata)
   - FileInputStream
   - FileOutputStream
   - ByteArrayInputStream
   - ByteArrayOutputStream
   - Leitura e escrita de bytes
   - Fechamento de streams
   - Try-with-resources

**T3 - Character Streams**
   - Reader (abstrata)
   - Writer (abstrata)
   - FileReader
   - FileWriter
   - CharArrayReader
   - CharArrayWriter
   - StringReader
   - StringWriter
   - Encoding de caracteres

**T4 - Buffered Streams**
   - BufferedInputStream
   - BufferedOutputStream
   - BufferedReader
   - BufferedWriter
   - Melhoria de performance
   - readLine() em BufferedReader
   - flush()

**T5 - Classe File**
   - Representação de arquivos e diretórios
   - Construtores
   - Métodos: exists(), isFile(), isDirectory()
   - getName(), getPath(), getAbsolutePath()
   - length(), lastModified()
   - mkdir(), mkdirs()
   - delete(), renameTo()
   - listFiles()
   - File separators (portabilidade)

**T6 - PrintStream e PrintWriter**
   - System.out e System.err
   - Métodos print(), println(), printf()
   - Formatação de saída
   - Auto-flush
   - Redirecionamento de saída

**T7 - Scanner**
   - Leitura formatada
   - next(), nextLine(), nextInt(), nextDouble()
   - Delimitadores
   - hasNext() e variantes
   - Uso com arquivos, strings, System.in

**T8 - Console (java.io.Console)**
   - Interação com console
   - readLine(), readPassword()
   - format(), printf()
   - Disponibilidade (não disponível em IDEs)

---

### **M2: NIO.2 (New I/O - Java 7+)**

#### Tópicos:

**T1 - Pacote java.nio.file**
   - Path interface
   - Paths class (fábrica)
   - Files class (operações)
   - Vantagens sobre java.io.File

**T2 - Path**
   - Criação: Paths.get(), Path.of() (Java 11+)
   - Métodos: getFileName(), getParent(), getRoot()
   - toAbsolutePath(), normalize()
   - resolve(), relativize()
   - Comparação de paths

**T3 - Files**
   - Operações de leitura: readAllBytes(), readAllLines()
   - Operações de escrita: write()
   - Cópia: copy()
   - Movimentação: move()
   - Deleção: delete(), deleteIfExists()
   - Criação: createFile(), createDirectory(), createDirectories()
   - Verificação: exists(), notExists(), isRegularFile(), isDirectory()
   - Atributos: size(), getLastModifiedTime(), setLastModifiedTime()
   - Streams: lines(), list(), walk()

**T4 - File Attributes**
   - BasicFileAttributes
   - DosFileAttributes
   - PosixFileAttributes
   - Leitura de atributos
   - Modificação de atributos
   - File permissions (POSIX)

**T5 - DirectoryStream**
   - Iteração eficiente sobre diretórios
   - Filtros e globs
   - Try-with-resources

**T6 - WatchService**
   - Monitoramento de mudanças em diretórios
   - Registro de paths
   - Eventos: ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY
   - Polling de eventos
   - Uso em aplicações de sincronização

---

### **M3: Serialização**

#### Tópicos:

**T1 - Conceito de Serialização**
   - Conversão de objetos para bytes
   - Persistência e transmissão
   - Interface Serializable (marker)
   - serialVersionUID

**T2 - ObjectOutputStream e ObjectInputStream**
   - Escrita de objetos: writeObject()
   - Leitura de objetos: readObject()
   - Tratamento de exceções
   - Casting após desserialização

**T3 - Personalização da Serialização**
   - Palavra-chave transient
   - Métodos writeObject() e readObject() privados
   - Externalizable interface
   - writeExternal() e readExternal()

**T4 - Versionamento de Classes**
   - serialVersionUID
   - Compatibilidade entre versões
   - InvalidClassException

**T5 - Segurança e Alternativas**
   - Riscos de segurança
   - Alternativas modernas: JSON, XML, Protocol Buffers
   - Bibliotecas: Jackson, Gson, JAXB

---

## **BLOCO 6: PROGRAMAÇÃO FUNCIONAL (JAVA 8+)**

### **M1: Expressões Lambda**

#### Tópicos:

**T1 - Conceito de Lambda**
   - Funções anônimas
   - Sintaxe concisa
   - Substituição de classes anônimas
   - Programação funcional em Java

**T2 - Sintaxe de Lambda**
   - (parâmetros) -> expressão
   - (parâmetros) -> { bloco de código }
   - Inferência de tipo
   - Parâmetro único sem parênteses
   - Lambda sem parâmetros: () ->

**T3 - Interfaces Funcionais**
   - Exatamente um método abstrato
   - @FunctionalInterface
   - Métodos default e static não contam
   - Lambda como implementação

**T4 - Interfaces Funcionais Principais (java.util.function)**
   - Predicate<T>: test(T) -> boolean
   - Function<T,R>: apply(T) -> R
   - Consumer<T>: accept(T) -> void
   - Supplier<T>: get() -> T
   - BiPredicate, BiFunction, BiConsumer
   - UnaryOperator<T>, BinaryOperator<T>
   - Variantes primitivas: IntPredicate, IntFunction, etc.

**T5 - Escopo de Variáveis em Lambda**
   - Effectively final
   - Acesso a variáveis locais
   - Acesso a atributos de instância
   - this dentro de lambda

**T6 - Method References**
   - Referência a métodos estáticos: Classe::metodo
   - Referência a métodos de instância: objeto::metodo
   - Referência a métodos de instância de tipo específico: Classe::metodo
   - Referência a construtores: Classe::new
   - Array constructor references

---

### **M2: Streams API (Java 8+) - Introdução**

#### Tópicos:

**T1 - Conceito de Streams**
   - Sequências de elementos
   - Não é uma estrutura de dados
   - Operações funcionais
   - Lazy evaluation
   - Pipeline de operações
   - Diferença entre Collection e Stream

**T2 - Criação de Streams**
   - collection.stream()
   - Arrays.stream()
   - Stream.of()
   - Stream.generate()
   - Stream.iterate()
   - IntStream, LongStream, DoubleStream

**T3 - Operações Intermediárias**
   - filter()
   - map()
   - flatMap()
   - distinct()
   - sorted()
   - peek()
   - limit()
   - skip()
   - Retornam Stream (encadeáveis)

**T4 - Operações Terminais**
   - forEach()
   - collect()
   - reduce()
   - count()
   - anyMatch(), allMatch(), noneMatch()
   - findFirst(), findAny()
   - min(), max()
   - Retornam resultado ou efeito colateral

**T5 - Collectors**
   - toList(), toSet(), toMap()
   - joining()
   - groupingBy()
   - partitioningBy()
   - counting(), summingInt()
   - averagingDouble()
   - Custom collectors

**T6 - Streams Paralelos**
   - parallelStream()
   - Processamento paralelo
   - Fork/Join framework
   - Quando usar
   - Cuidados com operações stateful

---

### **M3: Streams API Avançado**

#### Tópicos:

**T1 - Operações Intermediárias Avançadas**
   - flatMap() e achatamento de streams
   - mapToInt(), mapToLong(), mapToDouble()
   - flatMapToInt(), flatMapToLong(), flatMapToDouble()
   - distinct() e hashCode()/equals()
   - sorted() com Comparator
   - peek() para debugging

**T2 - Operações Terminais Avançadas**
   - reduce() com acumulador
   - reduce() com identidade e acumulador
   - reduce() com identidade, acumulador e combiner
   - collect() com Collector customizado
   - toArray() com generator

**T3 - Collectors Avançados**
   - groupingBy() com downstream collectors
   - partitioningBy()
   - mapping(), filtering() (Java 9+)
   - flatMapping() (Java 9+)
   - collectingAndThen()
   - teeing() (Java 12+)
   - Collectors customizados: Collector.of()

**T4 - Streams Numéricos**
   - IntStream, LongStream, DoubleStream
   - range() e rangeClosed()
   - sum(), average(), max(), min()
   - summaryStatistics()
   - Boxing e unboxing: boxed(), mapToObj()

**T5 - Streams Paralelos**
   - parallelStream() vs stream().parallel()
   - ForkJoinPool
   - Quando usar streams paralelos
   - Overhead de paralelização
   - Operações stateful e stateless
   - Ordem de processamento
   - Cuidados com thread-safety

**T6 - Optional**
   - Conceito: container para valor possivelmente nulo
   - Criação: Optional.of(), Optional.ofNullable(), Optional.empty()
   - Verificação: isPresent(), isEmpty() (Java 11+)
   - Extração: get(), orElse(), orElseGet(), orElseThrow()
   - Transformação: map(), flatMap()
   - Filtragem: filter()
   - Ações condicionais: ifPresent(), ifPresentOrElse() (Java 9+)
   - or() (Java 9+)
   - Boas práticas e antipadrões

---

## **BLOCO 7: GENERICS**

### **M1: Fundamentos de Generics**

#### Tópicos:

**T1 - Motivação para Generics**
   - Type safety em tempo de compilação
   - Eliminação de casting
   - Reutilização de código
   - Problema antes do Java 5

**T2 - Classes Genéricas**
   - Declaração: class Nome<T>
   - Type parameter
   - Uso de T no corpo da classe
   - Instanciação: new Nome<String>()
   - Diamond operator <> (Java 7+)
   - Múltiplos type parameters: <T, U>

**T3 - Métodos Genéricos**
   - Declaração: <T> T metodo(T param)
   - Type parameter no método
   - Inferência de tipo
   - Métodos genéricos em classes não genéricas
   - Métodos genéricos estáticos

**T4 - Interfaces Genéricas**
   - Declaração: interface Nome<T>
   - Implementação com tipo concreto
   - Implementação mantendo genericidade
   - Exemplo: List<E>, Comparable<T>

**T5 - Raw Types**
   - Uso sem type parameter
   - Compatibilidade com código legado
   - Avisos de compilador
   - Evitar raw types em código novo

**T6 - Bounded Type Parameters**
   - Upper bound: <T extends Number>
   - Múltiplas bounds: <T extends Class & Interface>
   - Acesso a métodos da bound
   - Recursive bounds: <T extends Comparable<T>>

**T7 - Wildcards**
   - Unbounded wildcard: <?>
   - Upper bounded wildcard: <? extends Type>
   - Lower bounded wildcard: <? super Type>
   - PECS: Producer Extends, Consumer Super
   - Limitações de wildcards

**T8 - Type Erasure**
   - Remoção de informações de tipo em runtime
   - Substituição por Object ou bound
   - Bridge methods
   - Limitações devido ao erasure
   - Impossibilidade de: new T(), instanceof com generics, arrays de tipos genéricos

**T9 - Restrições de Generics**
   - Não pode usar tipos primitivos
   - Não pode criar instância de tipo genérico
   - Não pode usar instanceof com tipos parametrizados
   - Não pode criar arrays de tipos parametrizados
   - Não pode usar static com type parameters de classe

---

## **BLOCO 8: ANOTAÇÕES (ANNOTATIONS)**

### **M1: Uso de Anotações**

#### Tópicos:

**T1 - Conceito de Anotações**
   - Metadados
   - Informações para compilador, ferramentas, runtime
   - Sintaxe: @NomeDaAnotacao
   - Anotações predefinidas

**T2 - Anotações Padrão**
   - @Override
   - @Deprecated
   - @SuppressWarnings
   - @SafeVarargs
   - @FunctionalInterface

**T3 - Anotações de Metadados**
   - @Retention: SOURCE, CLASS, RUNTIME
   - @Target: TYPE, FIELD, METHOD, PARAMETER, etc.
   - @Documented
   - @Inherited
   - @Repeatable (Java 8+)

---

### **M2: Criação de Anotações Customizadas**

#### Tópicos:

**T1 - Declaração de Anotação**
   - @interface
   - Elementos (métodos abstratos)
   - Tipos suportados para elementos
   - Valores padrão: default

**T2 - Processamento de Anotações**
   - Reflection API
   - Class.getAnnotation()
   - Method.getAnnotation()
   - AnnotatedElement
   - isAnnotationPresent()

**T3 - Annotation Processing**
   - Annotation Processor
   - Processamento em tempo de compilação
   - Geração de código
   - Ferramentas: APT, Pluggable Annotation Processing API

---

## **BLOCO 9: MULTITHREADING E CONCORRÊNCIA**

### **M1: Fundamentos de Threads**

#### Tópicos:

**T1 - Conceitos de Concorrência**
   - Processos vs threads
   - Thread scheduling
   - Context switching
   - Concorrência vs paralelismo
   - Benefícios e desafios de multithreading

**T2 - Criação de Threads**
   - Estender Thread
   - Implementar Runnable
   - Lambda com Runnable
   - start() vs run()
   - Múltiplas threads

**T3 - Ciclo de Vida de uma Thread**
   - NEW
   - RUNNABLE
   - BLOCKED
   - WAITING
   - TIMED_WAITING
   - TERMINATED
   - Métodos que afetam estado

**T4 - Métodos da Classe Thread**
   - start()
   - run()
   - sleep()
   - join()
   - interrupt()
   - isInterrupted()
   - getName(), setName()
   - getPriority(), setPriority()
   - isDaemon(), setDaemon()
   - currentThread()

**T5 - Sincronização**
   - Problema de condição de corrida (race condition)
   - Palavra-chave synchronized
   - Blocos sincronizados
   - Métodos sincronizados
   - Sincronização de métodos estáticos
   - Locks intrínsecos (monitor locks)

**T6 - Problemas de Concorrência**
   - Race conditions
   - Deadlock
   - Livelock
   - Starvation
   - Visibility problems
   - Atomicity problems

**T7 - Palavra-chave volatile**
   - Visibilidade entre threads
   - Happens-before relationship
   - Não garante atomicidade
   - Quando usar volatile

**T8 - Wait, Notify, NotifyAll**
   - Inter-thread communication
   - Método wait()
   - Método notify()
   - Método notifyAll()
   - Uso em blocos synchronized
   - Padrão produtor-consumidor

---

### **M2: java.util.concurrent**

#### Tópicos:

**T1 - Executor Framework**
   - Interface Executor
   - ExecutorService
   - Executors: métodos fábrica
   - newFixedThreadPool()
   - newCachedThreadPool()
   - newSingleThreadExecutor()
   - newScheduledThreadPool()
   - submit() vs execute()
   - shutdown() vs shutdownNow()

**T2 - Callable e Future**
   - Interface Callable<V>
   - Retorno de valores
   - Interface Future<V>
   - Métodos: get(), cancel(), isDone(), isCancelled()
   - Timeout em get()
   - ExecutorService.submit(Callable)

**T3 - Locks (java.util.concurrent.locks)**
   - Interface Lock
   - ReentrantLock
   - lock() e unlock()
   - tryLock()
   - lockInterruptibly()
   - Vantagens sobre synchronized
   - ReadWriteLock
   - ReentrantReadWriteLock

**T4 - Atomic Variables**
   - Pacote java.util.concurrent.atomic
   - AtomicInteger, AtomicLong, AtomicBoolean
   - AtomicReference
   - Operações atômicas: get(), set(), getAndSet()
   - compareAndSet() (CAS)
   - incrementAndGet(), decrementAndGet()
   - Lock-free algorithms

**T5 - Concurrent Collections**
   - ConcurrentHashMap
   - CopyOnWriteArrayList
   - CopyOnWriteArraySet
   - ConcurrentLinkedQueue
   - ConcurrentLinkedDeque
   - BlockingQueue: ArrayBlockingQueue, LinkedBlockingQueue
   - PriorityBlockingQueue
   - SynchronousQueue

**T6 - CountDownLatch**
   - Sincronização de múltiplas threads
   - await() e countDown()
   - Uso em inicialização paralela

**T7 - CyclicBarrier**
   - Ponto de sincronização
   - await()
   - Barreira reutilizável
   - Ação ao atingir barreira

**T8 - Semaphore**
   - Controle de acesso a recursos
   - acquire() e release()
   - Permits
   - Fairness

**T9 - Phaser (Java 7+)**
   - Barreira mais flexível que CyclicBarrier
   - Fases dinâmicas
   - Registro dinâmico de parties
   - arrive(), arriveAndAwaitAdvance()

**T10 - CompletableFuture (Java 8+)**
    - Programação assíncrona
    - supplyAsync(), runAsync()
    - thenApply(), thenAccept(), thenRun()
    - thenCompose(), thenCombine()
    - exceptionally(), handle()
    - allOf(), anyOf()
    - join() vs get()

---

## **BLOCO 10: DATA E HORA (JAVA 8+ Date/Time API)**

### **M1: java.time Package**

#### Tópicos:

**T1 - Problemas com java.util.Date e Calendar**
   - Mutabilidade
   - Design ruim
   - Thread-unsafe
   - Meses baseados em zero
   - API confusa

**T2 - LocalDate**
   - Data sem horário
   - Criação: now(), of(), parse()
   - Métodos get: getYear(), getMonth(), getDayOfMonth()
   - Manipulação: plusDays(), minusMonths(), withYear()
   - Comparação: isBefore(), isAfter(), equals()
   - Cálculo: until(), Period.between()

**T3 - LocalTime**
   - Horário sem data
   - Criação: now(), of(), parse()
   - Métodos get: getHour(), getMinute(), getSecond()
   - Manipulação: plusHours(), minusMinutes()
   - Comparação
   - Precisão de nanossegundos

**T4 - LocalDateTime**
   - Data e horário
   - Criação: now(), of(), parse()
   - Combinação: LocalDate.atTime(), LocalTime.atDate()
   - Métodos de LocalDate e LocalTime
   - toLocalDate(), toLocalTime()

**T5 - ZonedDateTime**
   - Data, horário e fuso horário
   - ZoneId e ZoneOffset
   - Criação: now(), of(), ofInstant()
   - Conversão entre fusos
   - Daylight Saving Time

**T6 - Instant**
   - Timestamp (epoch time)
   - Precisão de nanossegundos
   - Criação: now(), ofEpochSecond(), ofEpochMilli()
   - toEpochMilli()
   - Comparação
   - Cálculo de duração

**T7 - Duration**
   - Intervalo de tempo (horas, minutos, segundos)
   - Criação: between(), of(), ofHours()
   - Métodos get: toHours(), toMinutes(), getSeconds()
   - Adição/subtração a temporals
   - Comparação

**T8 - Period**
   - Intervalo de tempo (anos, meses, dias)
   - Criação: between(), of(), ofYears()
   - Métodos get: getYears(), getMonths(), getDays()
   - Adição/subtração a datas
   - normalized()

**T9 - DateTimeFormatter**
   - Formatação e parsing
   - Formatters predefinidos: ISO_LOCAL_DATE, ISO_LOCAL_TIME
   - Padrões customizados: ofPattern()
   - Localização
   - format() e parse()

**T10 - TemporalAdjusters**
    - Ajustes complexos de data
    - firstDayOfMonth(), lastDayOfMonth()
    - nextOrSame(), previousOrSame()
    - Custom adjusters

**T11 - Conversão entre APIs Antigas e Novas**
    - Date.from(), Date.toInstant()
    - Calendar.toInstant()
    - Timestamp, java.sql.Date

---

## **BLOCO 11: REFLECTION API**

### **M1: Introspecção e Manipulação**

#### Tópicos:

**T1 - Conceito de Reflection**
   - Examinar e modificar estruturas em runtime
   - Classe Class
   - Pacote java.lang.reflect
   - Uso em frameworks

**T2 - Classe Class**
   - Obtenção: .class, getClass(), Class.forName()
   - Métodos: getName(), getSimpleName(), getPackage()
   - getSuperclass(), getInterfaces()
   - Modifiers: getModifiers(), Modifier.isPublic()

**T3 - Construtores**
   - getConstructors(), getDeclaredConstructors()
   - Constructor<T>
   - newInstance()
   - Parâmetros do construtor
   - setAccessible() para construtores privados

**T4 - Campos (Fields)**
   - getFields(), getDeclaredFields()
   - Field
   - get(), set()
   - Tipo do campo: getType()
   - setAccessible() para campos privados

**T5 - Métodos**
   - getMethods(), getDeclaredMethods()
   - Method
   - invoke()
   - Parâmetros: getParameterTypes()
   - Tipo de retorno: getReturnType()
   - setAccessible() para métodos privados

**T6 - Anotações via Reflection**
   - getAnnotations(), getDeclaredAnnotations()
   - getAnnotation(Class)
   - isAnnotationPresent()
   - Leitura de valores de anotações

**T7 - Arrays via Reflection**
   - Array class
   - newInstance() para criar arrays
   - get() e set() para acessar elementos
   - getLength()

**T8 - Generics e Reflection**
   - Type erasure
   - ParameterizedType
   - getGenericSuperclass()
   - getGenericInterfaces()
   - Limitações

**T9 - Performance e Segurança**
   - Overhead de reflection
   - Quebra de encapsulamento
   - SecurityManager
   - Quando usar reflection

---

## **BLOCO 12: MÓDULOS (JAVA 9+)**

### **M1: Java Platform Module System (JPMS)**

#### Tópicos:

**T1 - Motivação para Módulos**
   - Problemas com classpath
   - Encapsulamento forte
   - Dependências explícitas
   - Otimização de JRE

**T2 - Conceito de Módulo**
   - Agrupamento de pacotes
   - module-info.java
   - Descritor de módulo
   - Módulos nomeados vs automáticos vs não nomeados

**T3 - Declaração de Módulo**
   - module nome.do.modulo { }
   - exports: tornar pacotes acessíveis
   - requires: declarar dependências
   - opens: reflection runtime
   - provides e uses: services
   - Transitive dependencies: requires transitive

**T4 - Módulos do JDK**
   - java.base (implícito)
   - java.sql, java.xml, java.logging
   - Lista de módulos: java --list-modules
   - jdeps para análise de dependências

**T5 - Migração para Módulos**
   - Bottom-up vs top-down
   - Módulos automáticos
   - Classpath vs module path
   - Compatibilidade com código não modular

**T6 - Ferramentas**
   - jdeps: análise de dependências
   - jlink: criação de runtime customizado
   - jmod: formato de módulo

---

## **BLOCO 13: FEATURES MODERNAS DO JAVA (10-21)**

### **M1: Java 10-11**

#### Tópicos:

**T1 - Local Variable Type Inference (var) - Java 10**
   - Palavra-chave var
   - Inferência de tipo local
   - Limitações: apenas variáveis locais
   - Não usar com null, lambdas ambíguos
   - Boas práticas de legibilidade

**T2 - Novos Métodos de String - Java 11**
   - isBlank()
   - lines()
   - strip(), stripLeading(), stripTrailing()
   - repeat()

**T3 - Novos Métodos de Collection - Java 11**
   - Collection.toArray(IntFunction)

**T4 - HttpClient - Java 11**
   - java.net.http
   - HttpClient, HttpRequest, HttpResponse
   - Requisições síncronas e assíncronas
   - WebSocket support

**T5 - Outras Features Java 11**
   - Execução direta de arquivos .java (shebang)
   - Nest-Based Access Control
   - Epsilon GC (no-op garbage collector)

---

### **M2: Java 12-15**

#### Tópicos:

**T1 - Switch Expressions - Java 12-14**
   - Arrow syntax
   - Yield
   - Múltiplos cases
   - Retorno de valores
   - Pattern matching (preview)

**T2 - Text Blocks - Java 13-15**
   - Strings multilinha com """
   - Indentação automática
   - Escape sequences
   - Métodos: stripIndent(), translateEscapes()

**T3 - Records - Java 14-16**
   - Classe de dados imutável
   - record Pessoa(String nome, int idade)
   - Geração automática: construtor, getters, equals, hashCode, toString
   - Construtores customizados: compact e canonical
   - Implementação de interfaces
   - Métodos adicionais

**T4 - Pattern Matching para instanceof - Java 14-16**
   - if (obj instanceof String s) { }
   - Redução de casting
   - Escopo da variável pattern

**T5 - Sealed Classes - Java 15-17**
   - sealed, non-sealed, permits
   - Hierarquia controlada
   - Uso com pattern matching
   - Exhaustiveness checking

---

### **M3: Java 17-21 (LTS e Beyond)**

#### Tópicos:

**T1 - Pattern Matching for switch - Java 17-21**
   - case String s
   - Guarded patterns: case String s when s.length() > 5
   - Null case
   - Sealed classes e exhaustiveness

**T2 - Record Patterns - Java 19-21**
   - Deconstrução de records
   - if (obj instanceof Point(int x, int y))
   - Nested patterns
   - Uso em switch

**T3 - Virtual Threads - Java 19-21**
   - Project Loom
   - Threads leves (green threads)
   - Thread.ofVirtual()
   - Executors.newVirtualThreadPerTaskExecutor()
   - Escalabilidade massiva
   - Blocking sem custo

**T4 - Structured Concurrency - Java 19-21 (Incubator/Preview)**
   - StructuredTaskScope
   - Gerenciamento de subtarefas
   - Propagação de erros
   - Cancelamento coordenado

**T5 - Sequenced Collections - Java 21**
   - Interfaces: SequencedCollection, SequencedSet, SequencedMap
   - Métodos: addFirst(), addLast(), getFirst(), getLast()
   - reversed()
   - Ordem bem definida

**T6 - String Templates - Java 21 (Preview)**
   - Interpolação de strings
   - STR."Hello, \{name}"
   - Processadores customizados
   - Type-safe

**T7 - Unnamed Patterns and Variables - Java 21**
   - Underscore _ para valores não usados
   - switch, catch, try-with-resources
   - Melhoria de legibilidade

**T8 - Foreign Function & Memory API - Java 19-22**
   - Project Panama
   - Interoperabilidade com código nativo
   - Substituição de JNI
   - Acesso direto à memória

---

## **BLOCO 14: TESTES**

### **M1: JUnit 5**

#### Tópicos:

**T1 - Fundamentos de Testes Unitários**
   - Importância de testes
   - Pirâmide de testes
   - Testes unitários, integração, E2E
   - TDD (Test-Driven Development)
   - BDD (Behavior-Driven Development)

**T2 - Estrutura do JUnit 5**
   - JUnit Platform, Jupiter, Vintage
   - Dependências Maven/Gradle
   - Estrutura de um teste
   - Classe de teste
   - Método de teste

**T3 - Anotações Principais**
   - @Test
   - @BeforeEach e @AfterEach
   - @BeforeAll e @AfterAll
   - @Disabled
   - @DisplayName
   - @Nested
   - @Tag
   - @ParameterizedTest
   - @RepeatedTest

**T4 - Asserções**
   - assertEquals(), assertNotEquals()
   - assertTrue(), assertFalse()
   - assertNull(), assertNotNull()
   - assertSame(), assertNotSame()
   - assertArrayEquals()
   - assertThrows()
   - assertTimeout(), assertTimeoutPreemptively()
   - assertAll() para asserções agrupadas

**T5 - Assumptions**
   - assumeTrue(), assumeFalse()
   - assumingThat()
   - Execução condicional de testes

**T6 - Testes Parametrizados**
   - @ParameterizedTest
   - @ValueSource
   - @EnumSource
   - @MethodSource
   - @CsvSource, @CsvFileSource
   - @ArgumentsSource
   - Conversão de argumentos

**T7 - Testes Dinâmicos**
   - @TestFactory
   - DynamicTest
   - Geração programática de testes

**T8 - Extensions**
   - @ExtendWith
   - Customização do comportamento
   - Mockito integration

---

### **M2: Mockito**

#### Tópicos:

**T1 - Conceito de Mocking**
   - Test doubles: mocks, stubs, fakes, spies
   - Isolamento de unidade
   - Dependências externas

**T2 - Criação de Mocks**
   - Mockito.mock()
   - @Mock annotation
   - @InjectMocks
   - MockitoExtension

**T3 - Stubbing**
   - when().thenReturn()
   - when().thenThrow()
   - doReturn().when()
   - doThrow().when()
   - Stubbing de métodos void

**T4 - Verificação**
   - verify()
   - Número de invocações: times(), never(), atLeast()
   - Ordem de invocações: inOrder()
   - Verificação de argumentos

**T5 - Argument Matchers**
   - any(), anyInt(), anyString()
   - eq(), same()
   - Custom matchers
   - ArgumentCaptor

**T6 - Spies**
   - Mockito.spy()
   - @Spy
   - Objetos reais parcialmente mockados

**T7 - BDD Style**
   - given().willReturn()
   - then().should()
   - Sintaxe BDD com Mockito

---

## **BLOCO 15: BUILD TOOLS E GERENCIAMENTO DE DEPENDÊNCIAS**

### **M1: Maven**

#### Tópicos:

**T1 - Introdução ao Maven**
   - Build automation
   - Gerenciamento de dependências
   - Convenção sobre configuração
   - Estrutura de diretórios padrão

**T2 - POM (Project Object Model)**
   - pom.xml
   - Elementos principais: groupId, artifactId, version
   - packaging
   - properties
   - Herança de POMs

**T3 - Dependências**
   - <dependencies>
   - <dependency>: groupId, artifactId, version
   - scope: compile, provided, runtime, test, system
   - Dependências transitivas
   - Exclusões
   - Maven Central Repository

**T4 - Build Lifecycle**
   - Fases: validate, compile, test, package, install, deploy
   - Plugins e goals
   - mvn clean install
   - mvn package
   - mvn test

**T5 - Plugins**
   - maven-compiler-plugin
   - maven-surefire-plugin (testes)
   - maven-jar-plugin
   - maven-war-plugin
   - maven-shade-plugin (uber jar)
   - Configuração de plugins

**T6 - Profiles**
   - Ativação condicional
   - Ambientes: dev, test, prod
   - Propriedades específicas de profile

**T7 - Multi-module Projects**
   - Módulos parent e child
   - Agregação
   - Herança
   - Gerenciamento centralizado

---

### **M2: Gradle**

#### Tópicos:

**T1 - Introdução ao Gradle**
   - Build tool baseado em Groovy/Kotlin
   - Flexibilidade vs convenção
   - Performance (incremental builds, cache)
   - Integração com Maven

**T2 - Build Scripts**
   - build.gradle (Groovy) ou build.gradle.kts (Kotlin)
   - Estrutura básica
   - plugins { }
   - repositories { }
   - dependencies { }

**T3 - Dependências**
   - Configurações: implementation, api, compileOnly, runtimeOnly, testImplementation
   - Repositórios: mavenCentral(), jcenter()
   - Versões e notação
   - Dependências transitivas

**T4 - Tasks**
   - Definição de tasks customizadas
   - dependsOn
   - doFirst, doLast
   - gradle tasks

**T5 - Build Lifecycle**
   - Initialization, configuration, execution
   - ./gradlew build
   - ./gradlew clean test

**T6 - Multi-project Builds**
   - settings.gradle
   - include
   - Dependências entre projetos
   - Configuração compartilhada

---

## **BLOCO 16: JAVA ENTERPRISE (JAKARTA EE - ANTIGO JAVA EE)**

### **M1: Servlets e JSP**

#### Tópicos:

**T1 - Servlets**
   - HttpServlet
   - Métodos: doGet(), doPost(), doPut(), doDelete()
   - HttpServletRequest e HttpServletResponse
   - Ciclo de vida: init(), service(), destroy()
   - web.xml e anotações (@WebServlet)
   - Request forwarding e redirecting
   - Session management

**T2 - JSP (JavaServer Pages)**
   - Sintaxe JSP
   - Scriptlets, expressions, declarations
   - Diretivas: page, include, taglib
   - Objetos implícitos: request, response, session, application
   - JSTL (JSP Standard Tag Library)
   - EL (Expression Language)

**T3 - Filters**
   - Interface Filter
   - doFilter()
   - FilterChain
   - Uso: logging, autenticação, compressão

**T4 - Listeners**
   - ServletContextListener
   - HttpSessionListener
   - Eventos de ciclo de vida

---

### **M2: JPA (Jakarta Persistence API)**

#### Tópicos:

**T1 - Conceitos de ORM**
   - Object-Relational Mapping
   - Mapeamento de objetos para tabelas
   - Providers: Hibernate, EclipseLink

**T2 - Entidades**
   - @Entity
   - @Table
   - @Id e estratégias de geração
   - @GeneratedValue: AUTO, IDENTITY, SEQUENCE, TABLE
   - @Column
   - @Transient

**T3 - Relacionamentos**
   - @OneToOne
   - @OneToMany e @ManyToOne
   - @ManyToMany
   - Bidirecionalidade: mappedBy
   - Fetch types: EAGER vs LAZY
   - Cascade types

**T4 - EntityManager**
   - persist(), merge(), remove()
   - find(), getReference()
   - Detached, managed, removed states
   - flush(), clear(), detach()

**T5 - JPQL (Java Persistence Query Language)**
   - Consultas orientadas a objetos
   - SELECT, FROM, WHERE
   - JOIN, JOIN FETCH
   - Named queries: @NamedQuery
   - TypedQuery

**T6 - Criteria API**
   - Construção programática de queries
   - Type-safe
   - CriteriaBuilder, CriteriaQuery
   - Root, Predicate

**T7 - Transações**
   - @Transactional
   - EntityTransaction
   - begin(), commit(), rollback()
   - Isolamento e propagação

---

### **M3: Spring Framework (Introdução)**

#### Tópicos:

**T1 - Introdução ao Spring**
   - Inversão de Controle (IoC)
   - Injeção de Dependência (DI)
   - Spring vs Jakarta EE
   - Módulos do Spring

**T2 - Spring Core**
   - ApplicationContext
   - BeanFactory
   - Beans
   - @Component, @Service, @Repository
   - @Autowired
   - @Qualifier
   - Java Configuration: @Configuration, @Bean

**T3 - Spring Boot**
   - Convenção sobre configuração
   - Auto-configuration
   - Starters
   - application.properties / application.yml
   - @SpringBootApplication
   - Embedded server

**T4 - Spring MVC**
   - @Controller, @RestController
   - @RequestMapping, @GetMapping, @PostMapping
   - @PathVariable, @RequestParam, @RequestBody
   - ResponseEntity
   - Model, ModelAndView

**T5 - Spring Data JPA**
   - JpaRepository
   - CrudRepository
   - Query methods
   - @Query
   - Paginação e ordenação

**T6 - Spring Security (Introdução)**
   - Autenticação e autorização
   - SecurityFilterChain
   - UserDetailsService
   - Password encoding

---

## **BLOCO 17: BANCOS DE DADOS**

### **M1: JDBC**

#### Tópicos:

**T1 - Introdução ao JDBC**
   - Java Database Connectivity
   - Drivers JDBC (Type 1-4)
   - Pacote java.sql

**T2 - Conexão com Banco de Dados**
   - DriverManager.getConnection()
   - Connection
   - URL de conexão
   - Propriedades de conexão
   - Fechamento de conexões

**T3 - Statement**
   - Statement interface
   - executeQuery() para SELECT
   - executeUpdate() para INSERT, UPDATE, DELETE
   - execute() genérico
   - SQL Injection vulnerability

**T4 - PreparedStatement**
   - Prevenção de SQL Injection
   - Placeholders (?)
   - setInt(), setString(), setDate()
   - Performance (pré-compilação)

**T5 - CallableStatement**
   - Chamada de stored procedures
   - registerOutParameter()
   - Parâmetros IN, OUT, INOUT

**T6 - ResultSet**
   - Navegação: next(), previous(), first(), last()
   - Extração de dados: getInt(), getString(), getDate()
   - Tipos de ResultSet: TYPE_FORWARD_ONLY, TYPE_SCROLL_INSENSITIVE
   - Concorrência: CONCUR_READ_ONLY, CONCUR_UPDATABLE
   - Atualização via ResultSet

**T7 - Metadata**
   - DatabaseMetaData
   - ResultSetMetaData
   - Informações sobre banco e resultados

**T8 - Transações**
   - Auto-commit
   - setAutoCommit(false)
   - commit(), rollback()
   - Savepoints

**T9 - Connection Pooling**
   - Conceito de pool de conexões
   - HikariCP, Apache DBCP
   - Configuração
   - Performance

---

## **BLOCO 18: FERRAMENTAS DE DESENVOLVIMENTO**

### **M1: Controle de Versão - Git**

#### Tópicos:

**T1 - Fundamentos do Git**
   - Sistema distribuído
   - Repositório local vs remoto
   - Working directory, staging area, repository
   - Commits e SHA

**T2 - Comandos Básicos**
   - git init
   - git clone
   - git add
   - git commit
   - git status
   - git log
   - git diff

**T3 - Branches**
   - git branch
   - git checkout / git switch
   - git merge
   - Fast-forward vs recursive merge
   - Resolução de conflitos

**T4 - Repositórios Remotos**
   - git remote
   - git push
   - git pull
   - git fetch
   - GitHub, GitLab, Bitbucket

**T5 - Workflows**
   - Git Flow
   - GitHub Flow
   - Feature branches
   - Pull requests / Merge requests

**T6 - Comandos Avançados**
   - git rebase
   - git cherry-pick
   - git stash
   - git reset
   - git revert
   - git tag

---

### **M2: IDEs e Ferramentas**

#### Tópicos:

**T1 - IntelliJ IDEA**
   - Navegação de código
   - Refactoring tools
   - Debugging
   - Integração com build tools
   - Plugins

**T2 - Eclipse**
   - Workspace
   - Perspectives
   - Debugging
   - Plugins

**T3 - VS Code**
   - Java Extension Pack
   - Debugging
   - Integração com build tools

**T4 - Debugging**
   - Breakpoints
   - Step over, step into, step out
   - Watch variables
   - Evaluate expressions
   - Conditional breakpoints

**T5 - Profiling**
   - VisualVM
   - JProfiler
   - Análise de memória
   - Análise de CPU
   - Thread dumps

---

## **BLOCO 19: DESIGN PATTERNS**

### **M1: Padrões Criacionais**

#### Tópicos:

**T1 - Singleton**
   - Instância única
   - Implementações: eager, lazy, thread-safe
   - Double-checked locking
   - Enum singleton

**T2 - Factory Method**
   - Criação de objetos via método
   - Subclasses decidem qual classe instanciar
   - Acoplamento reduzido

**T3 - Abstract Factory**
   - Famílias de objetos relacionados
   - Fábricas concretas
   - Independência de implementação

**T4 - Builder**
   - Construção passo a passo
   - Fluent interface
   - Imutabilidade
   - Lombok @Builder

**T5 - Prototype**
   - Clonagem de objetos
   - Cópia superficial vs profunda
   - Cloneable interface

---

### **M2: Padrões Estruturais**

#### Tópicos:

**T1 - Adapter**
   - Conversão de interface
   - Wrapper
   - Class adapter vs object adapter

**T2 - Decorator**
   - Adicionar responsabilidades dinamicamente
   - Alternativa a herança
   - Exemplo: Java I/O streams

**T3 - Proxy**
   - Substituto ou placeholder
   - Tipos: virtual, remote, protection
   - Lazy initialization

**T4 - Facade**
   - Interface simplificada
   - Subsistemas complexos
   - Redução de acoplamento

**T5 - Composite**
   - Hierarquia parte-todo
   - Tratamento uniforme
   - Estruturas em árvore

**T6 - Bridge**
   - Separação de abstração e implementação
   - Variação independente

---

### **M3: Padrões Comportamentais**

#### Tópicos:

**T1 - Strategy**
   - Família de algoritmos
   - Intercambiabilidade
   - Comportamento em tempo de execução

**T2 - Observer**
   - Dependentes notificados automaticamente
   - Subject e observers
   - Exemplo: event listeners

**T3 - Template Method**
   - Esqueleto de algoritmo
   - Subclasses definem passos
   - Hook methods

**T4 - Command**
   - Encapsulamento de requisição
   - Parametrização de clientes
   - Undo/redo

**T5 - Iterator**
   - Acesso sequencial
   - Ocultação de representação interna
   - Interface Iterator

**T6 - State**
   - Comportamento baseado em estado
   - Transições de estado
   - Objetos de estado

**T7 - Chain of Responsibility**
   - Cadeia de handlers
   - Desacoplamento de sender e receiver
   - Logging, autenticação

---

## **BLOCO 20: BOAS PRÁTICAS E CLEAN CODE**

### **M1: Princípios SOLID**

#### Tópicos:

**T1 - Single Responsibility Principle (SRP)**
   - Uma única razão para mudar
   - Coesão
   - Separação de responsabilidades

**T2 - Open/Closed Principle (OCP)**
   - Aberto para extensão, fechado para modificação
   - Abstração
   - Polimorfismo

**T3 - Liskov Substitution Principle (LSP)**
   - Subtipos substituíveis
   - Contratos de comportamento
   - Violações comuns

**T4 - Interface Segregation Principle (ISP)**
   - Interfaces específicas
   - Não forçar implementação de métodos não usados
   - Múltiplas interfaces pequenas

**T5 - Dependency Inversion Principle (DIP)**
   - Depender de abstrações
   - Inversão de controle
   - Injeção de dependência

---

### **M2: Clean Code**

#### Tópicos:

**T1 - Nomenclatura**
   - Nomes significativos
   - Evitar abreviações
   - Contexto e clareza
   - Convenções Java

**T2 - Funções/Métodos**
   - Pequenos e focados
   - Um nível de abstração
   - Poucos parâmetros
   - Sem efeitos colaterais

**T3 - Comentários**
   - Código auto-explicativo
   - Quando comentar
   - Javadoc
   - Evitar comentários obsoletos

**T4 - Formatação**
   - Indentação consistente
   - Espaçamento
   - Organização de código
   - Limites de linha

**T5 - Tratamento de Erros**
   - Exceções em vez de códigos de erro
   - Contexto em exceções
   - Não retornar null
   - Fail-fast

**T6 - DRY (Don't Repeat Yourself)**
   - Evitar duplicação
   - Extração de métodos
   - Herança e composição

**T7 - KISS (Keep It Simple, Stupid)**
   - Simplicidade
   - Evitar over-engineering
   - Soluções diretas

**T8 - YAGNI (You Aren't Gonna Need It)**
   - Não adicionar funcionalidade prematura
   - Desenvolvimento incremental
   - Refatoração quando necessário

---

## **BLOCO 21: PERFORMANCE E OTIMIZAÇÃO**

### **M1: JVM e Garbage Collection**

#### Tópicos:

**T1 - Arquitetura da JVM**
   - Class Loader Subsystem
   - Runtime Data Areas: Heap, Stack, Method Area
   - Execution Engine: Interpreter, JIT Compiler
   - Native Method Interface
   - Native Method Libraries

**T2 - Memória da JVM**
   - Heap: Young Generation (Eden, Survivor), Old Generation
   - Stack: thread-local, frames de métodos
   - Method Area (Metaspace a partir do Java 8)
   - Program Counter Register
   - Native Method Stack

**T3 - Garbage Collection Básico**
   - Algoritmos: Mark and Sweep, Copying, Mark-Compact
   - Minor GC vs Major GC (Full GC)
   - Stop-the-World events
   - Reachability e referências

**T4 - Tipos de Garbage Collectors**
   - Serial GC
   - Parallel GC (Throughput GC)
   - CMS (Concurrent Mark Sweep) - deprecated
   - G1GC (Garbage First)
   - ZGC (Z Garbage Collector)
   - Shenandoah GC
   - Epsilon GC (No-Op)

**T5 - Tuning da JVM**
   - Parâmetros de heap: -Xms, -Xmx
   - -XX:NewRatio, -XX:SurvivorRatio
   - Seleção de GC: -XX:+UseG1GC
   - GC logging: -Xlog:gc
   - Análise de logs
   - Ferramentas: GCViewer, GCEasy

**T6 - Memory Leaks**
   - Identificação de vazamentos
   - Heap dumps
   - Análise com Eclipse MAT, VisualVM
   - Causas comuns: coleções estáticas, listeners não removidos
   - Weak, Soft, Phantom References

**T7 - JIT Compiler**
   - C1 (Client) e C2 (Server) compilers
   - Tiered Compilation
   - Hotspots e otimizações
   - Inlining, loop unrolling
   - Escape analysis
   - -XX:+PrintCompilation

---

### **M2: Otimização de Performance**

#### Tópicos:

**T1 - Profiling de Aplicações**
   - CPU profiling
   - Memory profiling
   - Thread profiling
   - Ferramentas: VisualVM, JProfiler, YourKit, Async Profiler
   - Flame graphs

**T2 - Microbenchmarking**
   - JMH (Java Microbenchmark Harness)
   - Warmup iterations
   - Measurement iterations
   - Evitar otimizações do compilador
   - Interpretação de resultados

**T3 - Otimização de Código**
   - Evitar criação desnecessária de objetos
   - String concatenation: StringBuilder vs +
   - Primitivos vs wrappers
   - Enhanced for vs índice
   - Lazy initialization
   - Caching de resultados computacionais

**T4 - Otimização de Coleções**
   - Escolha da estrutura adequada
   - Capacidade inicial adequada
   - ArrayList vs LinkedList em casos específicos
   - HashMap load factor
   - Streams vs loops (quando usar cada um)

**T5 - Otimização de I/O**
   - Bufferização
   - NIO vs IO tradicional
   - Memory-mapped files
   - Async I/O
   - Compressão

**T6 - Otimização de Banco de Dados**
   - Connection pooling
   - Batch operations
   - Prepared statements
   - Índices
   - N+1 query problem
   - Fetch strategies (LAZY vs EAGER)
   - Caching: primeiro nível, segundo nível

**T7 - Caching**
   - In-memory caching
   - Caffeine, Guava Cache
   - Distributed caching: Redis, Memcached
   - Cache eviction policies: LRU, LFU, FIFO
   - Cache-aside, read-through, write-through patterns

**T8 - Concorrência e Performance**
   - Thread pools dimensionados adequadamente
   - Lock contention
   - Lock-free algorithms
   - CompletableFuture para operações assíncronas
   - Virtual Threads (Java 21+) para I/O-bound tasks

---

## **BLOCO 22: SEGURANÇA**

### **M1: Fundamentos de Segurança em Java**

#### Tópicos:

**T1 - Conceitos de Segurança**
   - CIA Triad: Confidencialidade, Integridade, Disponibilidade
   - Autenticação vs Autorização
   - Princípio do menor privilégio
   - Defense in depth

**T2 - Java Security Manager**
   - SecurityManager (deprecated em Java 17)
   - Políticas de segurança
   - Permissions
   - java.policy files
   - Sandboxing

**T3 - Criptografia - Básico**
   - Pacote javax.crypto
   - Algoritmos simétricos: AES, DES, 3DES
   - Algoritmos assimétricos: RSA, ECC
   - Hash functions: MD5, SHA-256, SHA-512
   - MAC (Message Authentication Code)

**T4 - Criptografia - Classes Java**
   - Cipher
   - KeyGenerator
   - SecretKey
   - KeyPairGenerator
   - PublicKey e PrivateKey
   - MessageDigest
   - Signature

**T5 - SSL/TLS**
   - Certificados digitais
   - KeyStore e TrustStore
   - SSLSocket e SSLServerSocket
   - HTTPS connections
   - Certificados auto-assinados vs CA-signed

**T6 - Segurança em Aplicações Web**
   - Validação de entrada
   - Output encoding
   - SQL Injection: prevenção com PreparedStatement
   - XSS (Cross-Site Scripting): prevenção
   - CSRF (Cross-Site Request Forgery): tokens
   - Secure headers: CSP, X-Frame-Options, HSTS
   - HTTPS only
   - Secure cookies: HttpOnly, Secure, SameSite

**T7 - Autenticação e Autorização**
   - Basic Authentication
   - Token-based: JWT (JSON Web Tokens)
   - OAuth 2.0: fluxos e tokens
   - OpenID Connect
   - SAML
   - Multi-factor authentication (MFA)

**T8 - Gerenciamento de Senhas**
   - Nunca armazenar senhas em texto plano
   - Hashing: BCrypt, SCrypt, Argon2
   - Salt
   - Pepper
   - Password policies

**T9 - Vulnerabilidades Comuns**
   - OWASP Top 10
   - Injection flaws
   - Broken authentication
   - Sensitive data exposure
   - XML External Entities (XXE)
   - Broken access control
   - Security misconfiguration
   - Deserialization vulnerabilities
   - Dependency vulnerabilities

**T10 - Secure Coding Practices**
    - Input validation e sanitization
    - Principle of least privilege
    - Fail securely
    - Não confiar em dados do cliente
    - Logging (sem informações sensíveis)
    - Atualizações de dependências
    - SAST e DAST tools

---

## **BLOCO 23: LOGGING E MONITORAMENTO**

### **M1: Frameworks de Logging**

#### Tópicos:

**T1 - Importância do Logging**
   - Debugging
   - Auditoria
   - Monitoramento
   - Análise de problemas em produção
   - Compliance

**T2 - java.util.logging (JUL)**
   - Logger class
   - Níveis: SEVERE, WARNING, INFO, CONFIG, FINE, FINER, FINEST
   - Handlers: ConsoleHandler, FileHandler
   - Formatters
   - logging.properties

**T3 - SLF4J (Simple Logging Facade for Java)**
   - Abstração de logging
   - Desacoplamento de implementação
   - Placeholders: logger.info("User {} logged in", username)
   - Bindings para diferentes implementações

**T4 - Logback**
   - Implementação de SLF4J
   - logback.xml
   - Appenders: ConsoleAppender, FileAppender, RollingFileAppender
   - Encoders e Patterns
   - Níveis: ERROR, WARN, INFO, DEBUG, TRACE
   - Loggers hierárquicos
   - Filters
   - MDC (Mapped Diagnostic Context)

**T5 - Log4j 2**
   - Sucessor do Log4j
   - Async logging
   - log4j2.xml
   - Appenders
   - Layouts
   - Performance
   - Plugins

**T6 - Boas Práticas de Logging**
   - Níveis apropriados
   - Mensagens descritivas
   - Contexto adequado
   - Não logar informações sensíveis
   - Structured logging (JSON)
   - Correlation IDs
   - Performance: logging condicional, async
   - Log rotation
   - Centralização de logs

---

### **M2: Monitoramento e Observabilidade**

#### Tópicos:

**T1 - Métricas**
   - JMX (Java Management Extensions)
   - MBeans
   - Micrometer
   - Tipos de métricas: Counter, Gauge, Timer, Distribution Summary
   - Dimensões/Tags
   - Prometheus, Grafana

**T2 - Health Checks**
   - Liveness probes
   - Readiness probes
   - Spring Boot Actuator
   - Endpoints de saúde

**T3 - Distributed Tracing**
   - Trace, Span, Context propagation
   - OpenTelemetry
   - Jaeger, Zipkin
   - Correlação de requisições em microserviços

**T4 - APM (Application Performance Monitoring)**
   - New Relic, Dynatrace, AppDynamics
   - Instrumentação automática
   - Análise de transações
   - Identificação de gargalos

**T5 - Alertas**
   - Definição de thresholds
   - Alerting rules
   - Notificações: email, Slack, PagerDuty
   - On-call rotations

---

## **BLOCO 24: ARQUITETURA DE SOFTWARE**

### **M1: Arquiteturas Monolíticas**

#### Tópicos:

**T1 - Arquitetura em Camadas (Layered)**
   - Presentation Layer
   - Business Logic Layer
   - Data Access Layer
   - Separação de responsabilidades
   - Vantagens e desvantagens

**T2 - MVC (Model-View-Controller)**
   - Separação de concerns
   - Model: dados e lógica de negócio
   - View: interface do usuário
   - Controller: intermediário
   - Variações: MVP, MVVM

**T3 - Arquitetura Hexagonal (Ports and Adapters)**
   - Domínio no centro
   - Portas: interfaces
   - Adaptadores: implementações
   - Independência de frameworks
   - Testabilidade

**T4 - Clean Architecture**
   - Camadas concêntricas
   - Dependency Rule: dependências apontam para dentro
   - Entities, Use Cases, Interface Adapters, Frameworks
   - Independência de UI, DB, frameworks

---

### **M2: Microserviços**

#### Tópicos:

**T1 - Conceitos de Microserviços**
   - Serviços pequenos e independentes
   - Organização por capacidade de negócio
   - Autonomia
   - Comunicação via APIs
   - Descentralização
   - Falhas isoladas

**T2 - Comunicação entre Microserviços**
   - Síncrona: REST, gRPC
   - Assíncrona: mensageria (RabbitMQ, Kafka)
   - Event-driven architecture
   - CQRS (Command Query Responsibility Segregation)
   - Event Sourcing
   - Saga pattern para transações distribuídas

**T3 - Service Discovery**
   - Eureka
   - Consul
   - Registro e descoberta dinâmica
   - Client-side vs server-side discovery

**T4 - API Gateway**
   - Ponto único de entrada
   - Roteamento
   - Autenticação/Autorização centralizada
   - Rate limiting
   - Spring Cloud Gateway, Kong, Zuul

**T5 - Circuit Breaker**
   - Resilience4j
   - Hystrix (em manutenção)
   - Estados: Closed, Open, Half-Open
   - Fallbacks
   - Timeout e retry

**T6 - Configuração Centralizada**
   - Spring Cloud Config
   - Consul KV
   - Configurações externalizadas
   - Refresh dinâmico

**T7 - Distributed Tracing em Microserviços**
   - Correlação de requests
   - OpenTelemetry, Zipkin, Jaeger
   - Trace IDs através de serviços

**T8 - Containerização**
   - Docker
   - Dockerfile
   - Imagens e containers
   - Docker Compose
   - Kubernetes (orquestração)

**T9 - Desafios de Microserviços**
   - Complexidade operacional
   - Testes de integração
   - Transações distribuídas
   - Consistência eventual
   - Debugging
   - Overhead de comunicação

---

### **M3: DDD (Domain-Driven Design)**

#### Tópicos:

**T1 - Conceitos Fundamentais**
   - Linguagem ubíqua
   - Domínio e subdomínios
   - Core domain
   - Bounded contexts

**T2 - Building Blocks Táticos**
   - Entities
   - Value Objects
   - Aggregates e Aggregate Roots
   - Repositories
   - Domain Services
   - Domain Events
   - Factories

**T3 - Building Blocks Estratégicos**
   - Bounded Context
   - Context Map
   - Shared Kernel
   - Customer-Supplier
   - Conformist
   - Anticorruption Layer

---

## **BLOCO 25: MESSAGE BROKERS E STREAMING**

### **M1: Apache Kafka**

#### Tópicos:

**T1 - Conceitos do Kafka**
   - Event streaming platform
   - Tópicos e partições
   - Producers e Consumers
   - Brokers e clusters
   - Replicação
   - Offsets

**T2 - Produção de Mensagens**
   - KafkaProducer
   - Serialização (String, JSON, Avro)
   - Chaves e particionamento
   - Acks e garantias de entrega
   - Idempotência
   - Transações

**T3 - Consumo de Mensagens**
   - KafkaConsumer
   - Consumer Groups
   - Partition assignment
   - Commit de offsets: automático vs manual
   - Rebalanceamento
   - Poll loop

**T4 - Kafka Streams**
   - Stream processing
   - KStream e KTable
   - Transformações: map, filter, flatMap
   - Aggregações
   - Joins
   - Windowing
   - State stores

**T5 - Kafka Connect**
   - Integração com sistemas externos
   - Source connectors
   - Sink connectors
   - Configuração e deployment

**T6 - Tópicos Avançados**
   - Exatamente uma vez (exactly-once semantics)
   - Schema Registry (Avro, Protobuf)
   - Monitoring com JMX
   - Performance tuning
   - Retenção e compactação

---

### **M2: RabbitMQ**

#### Tópicos:

**T1 - Conceitos do RabbitMQ**
   - Message broker AMQP
   - Exchanges, Queues, Bindings
   - Routing keys
   - Producers e Consumers
   - Virtual hosts

**T2 - Tipos de Exchange**
   - Direct
   - Fanout
   - Topic
   - Headers

**T3 - Java Client**
   - ConnectionFactory e Connection
   - Channel
   - basicPublish()
   - basicConsume()
   - Acknowledgments: auto-ack vs manual

**T4 - Durabilidade e Persistência**
   - Queues duráveis
   - Mensagens persistentes
   - Confirmações de publisher

**T5 - Dead Letter Exchanges**
   - Mensagens não processadas
   - Reprocessamento
   - TTL (Time-To-Live)

**T6 - Spring AMQP**
   - RabbitTemplate
   - @RabbitListener
   - Configuração declarativa
   - Message converters

---

## **BLOCO 26: APIs E WEB SERVICES**

### **M1: REST APIs**

#### Tópicos:

**T1 - Princípios REST**
   - Representational State Transfer
   - Stateless
   - Client-Server
   - Cacheable
   - Uniform Interface
   - Layered System
   - HATEOAS (opcional)

**T2 - Recursos e URIs**
   - Identificação de recursos
   - Estrutura de URIs: /users, /users/{id}
   - Substantivos vs verbos
   - Singular vs plural
   - Hierarquia de recursos

**T3 - Métodos HTTP**
   - GET: leitura
   - POST: criação
   - PUT: atualização completa
   - PATCH: atualização parcial
   - DELETE: remoção
   - OPTIONS, HEAD
   - Idempotência e segurança

**T4 - Status Codes**
   - 2xx: sucesso (200 OK, 201 Created, 204 No Content)
   - 3xx: redirecionamento
   - 4xx: erro do cliente (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found)
   - 5xx: erro do servidor (500 Internal Server Error, 503 Service Unavailable)

**T5 - Content Negotiation**
   - Accept header
   - Content-Type header
   - JSON vs XML
   - Versionamento de API

**T6 - JAX-RS (Jakarta RESTful Web Services)**
   - @Path, @GET, @POST, @PUT, @DELETE
   - @PathParam, @QueryParam, @HeaderParam
   - @Produces, @Consumes
   - Response e ResponseBuilder
   - Implementações: Jersey, RESTEasy

**T7 - Spring REST**
   - @RestController
   - @RequestMapping e variações
   - @PathVariable, @RequestParam, @RequestBody
   - ResponseEntity
   - Exception handling: @ExceptionHandler, @ControllerAdvice
   - Validation: @Valid, @Validated

**T8 - Documentação de APIs**
   - OpenAPI (Swagger)
   - Springdoc OpenAPI
   - @ApiOperation, @ApiParam (Swagger 2)
   - swagger-ui

**T9 - Versionamento de APIs**
   - URI versioning: /v1/users
   - Header versioning
   - Query parameter versioning
   - Content negotiation versioning
   - Estratégias e trade-offs

**T10 - HATEOAS**
    - Hypermedia as the Engine of Application State
    - Navegabilidade via links
    - Spring HATEOAS
    - HAL (Hypertext Application Language)

**T11 - Autenticação e Autorização**
    - API Keys
    - OAuth 2.0
    - JWT (JSON Web Tokens)
    - Bearer tokens
    - Spring Security

**T12 - Rate Limiting**
    - Throttling
    - Quotas
    - Headers: X-RateLimit-*
    - Bucket4j

---

### **M2: GraphQL**

#### Tópicos:

**T1 - Conceitos de GraphQL**
   - Query language para APIs
   - Esquema tipado
   - Busca exata de dados (sem over/under-fetching)
   - Single endpoint

**T2 - Schema e Tipos**
   - Schema Definition Language (SDL)
   - Tipos escalares: Int, Float, String, Boolean, ID
   - Tipos de objeto
   - Queries e Mutations
   - Subscriptions
   - Input types

**T3 - Queries**
   - Sintaxe de queries
   - Seleção de campos
   - Argumentos
   - Aliases
   - Fragments
   - Variables

**T4 - Mutations**
   - Modificação de dados
   - Input objects
   - Retorno de dados atualizados

**T5 - Java e GraphQL**
   - GraphQL Java
   - Spring for GraphQL
   - Resolvers
   - DataFetchers
   - Schema-first vs code-first

**T6 - Subscriptions**
   - Real-time updates
   - WebSockets
   - Reactive Streams

---

### **M3: gRPC**

#### Tópicos:

**T1 - Conceitos de gRPC**
   - RPC framework
   - Protocol Buffers (Protobuf)
   - HTTP/2
   - Binário vs texto
   - Performance

**T2 - Protocol Buffers**
   - Definição de mensagens: .proto
   - Tipos de dados
   - Geração de código
   - Serialização eficiente

**T3 - Tipos de Comunicação**
   - Unary RPC
   - Server streaming
   - Client streaming
   - Bidirectional streaming

**T4 - Java e gRPC**
   - gRPC Java
   - Stubs: blocking, async, futures
   - Server implementation
   - Channel e ManagedChannel

**T5 - Comparação: REST vs GraphQL vs gRPC**
   - Casos de uso
   - Performance
   - Complexidade
   - Ecossistema

---

## **BLOCO 27: TESTES AVANÇADOS**

### **M1: Testes de Integração**

#### Tópicos:

**T1 - Conceito de Testes de Integração**
   - Teste de múltiplos componentes
   - Interação com recursos externos
   - Banco de dados, APIs, filas
   - Diferença de testes unitários

**T2 - TestContainers**
   - Containers Docker para testes
   - Bancos de dados: PostgreSQL, MySQL, MongoDB
   - Message brokers: Kafka, RabbitMQ
   - @Testcontainers
   - Configuração de containers
   - Performance considerations

**T3 - Spring Boot Test**
   - @SpringBootTest
   - @WebMvcTest, @DataJpaTest, @RestClientTest
   - @MockBean
   - TestRestTemplate
   - WebTestClient (WebFlux)

**T4 - Embedded Databases**
   - H2, HSQLDB
   - Configuração para testes
   - Limitações vs banco real

**T5 - Mocking de Serviços Externos**
   - WireMock
   - MockServer
   - Stubbing de APIs HTTP

---

### **M2: Testes de Performance**

#### Tópicos:

**T1 - Tipos de Testes de Performance**
   - Load testing
   - Stress testing
   - Spike testing
   - Endurance testing (soak testing)

**T2 - JMeter**
   - Thread Groups
   - Samplers (HTTP Request)
   - Listeners (resultados)
   - Assertions
   - Parameterização
   - Distributed testing

**T3 - Gatling**
   - Scala DSL
   - Scenarios e simulations
   - Feeders
   - Assertions
   - Relatórios HTML

**T4 - K6**
   - JavaScript para testes
   - Thresholds
   - Checks
   - Métricas

**T5 - Análise de Resultados**
   - Throughput (requisições/segundo)
   - Response time (p50, p95, p99)
   - Error rate
   - Identificação de gargalos

---

### **M3: TDD, BDD, Mutation Testing**

#### Tópicos:

**T1 - TDD (Test-Driven Development)**
   - Red-Green-Refactor cycle
   - Escrever teste antes do código
   - Benefícios: design, cobertura, confiança
   - Práticas e disciplina

**T2 - BDD (Behavior-Driven Development)**
   - Given-When-Then
   - Cucumber
   - Gherkin syntax
   - Feature files
   - Step definitions
   - Comunicação entre técnicos e não-técnicos

**T3 - Mutation Testing**
   - Qualidade dos testes
   - PITest
   - Mutantes e cobertura de mutação
   - Interpretar resultados

**T4 - Cobertura de Código**
   - JaCoCo
   - Line coverage, branch coverage
   - Métricas
   - Meta de cobertura (cuidado com foco excessivo)

---

## **BLOCO 28: CONTAINERIZAÇÃO E CLOUD**

### **M1: Docker**

#### Tópicos:

**T1 - Conceitos de Docker**
   - Containers vs VMs
   - Imagens e Containers
   - Docker Engine
   - Benefícios: portabilidade, isolamento, eficiência

**T2 - Dockerfile**
   - FROM, RUN, COPY, ADD
   - WORKDIR, EXPOSE, CMD, ENTRYPOINT
   - Layers e caching
   - Multi-stage builds
   - Best practices: imagens mínimas, .dockerignore

**T3 - Docker CLI**
   - docker build
   - docker run
   - docker ps, docker logs
   - docker exec, docker stop, docker rm
   - docker images, docker rmi
   - docker pull, docker push

**T4 - Volumes e Networking**
   - Volumes para persistência
   - Bind mounts
   - Networks: bridge, host, overlay
   - docker-compose para múltiplos containers

**T5 - Docker Compose**
   - docker-compose.yml
   - Services, networks, volumes
   - docker-compose up, down
   - Escalabilidade: scale

**T6 - Java em Docker**
   - Base images: openjdk, eclipse-temurin, amazoncorretto
   - JAVA_OPTS
   - Container-aware JVM (Java 10+)
   - Heap sizing
   - Jarfiles vs layers (Spring Boot layered jars)

---

### **M2: Kubernetes (Básico)**

#### Tópicos:

**T1 - Conceitos do Kubernetes**
   - Orquestração de containers
   - Cluster: Master (Control Plane) e Nodes
   - Declarativo vs imperativo
   - Desired state

**T2 - Objetos Principais**
   - Pods: unidade mínima
   - ReplicaSets
   - Deployments
   - Services: ClusterIP, NodePort, LoadBalancer
   - ConfigMaps e Secrets
   - Namespaces

**T3 - kubectl**
   - kubectl get, describe, logs
   - kubectl apply -f
   - kubectl exec, port-forward
   - kubectl scale, rollout

**T4 - YAML Manifests**
   - Estrutura: apiVersion, kind, metadata, spec
   - Deployment spec
   - Service spec
   - Labels e Selectors

**T5 - Java em Kubernetes**
   - Containerização (Docker)
   - Health checks: liveness, readiness
   - Resource limits e requests
   - ConfigMaps para configuração
   - Secrets para credenciais

---

### **M3: Cloud Platforms (AWS, Azure, GCP)**

#### Tópicos:

**T1 - Conceitos de Cloud Computing**
   - IaaS, PaaS, SaaS
   - Public, private, hybrid cloud
   - Vantagens: elasticidade, pay-as-you-go, global

**T2 - AWS (Amazon Web Services)**
   - EC2: máquinas virtuais
   - S3: armazenamento de objetos
   - RDS: bancos de dados relacionais
   - Lambda: serverless functions
   - ECS/EKS: containers (Docker/Kubernetes)
   - API Gateway, SQS, SNS
   - CloudWatch: monitoramento e logs

**T3 - Azure**
   - Virtual Machines
   - Azure Blob Storage
   - Azure SQL Database
   - Azure Functions
   - Azure Kubernetes Service (AKS)
   - Azure Service Bus

**T4 - GCP (Google Cloud Platform)**
   - Compute Engine
   - Cloud Storage
   - Cloud SQL
   - Cloud Functions
   - Google Kubernetes Engine (GKE)
   - Pub/Sub

**T5 - Serverless com Java**
   - AWS Lambda
   - Azure Functions
   - Google Cloud Functions
   - Cold start challenges
   - GraalVM native images para reduzir cold start

---

## **BLOCO 29: ARQUITETURAS REATIVAS**

### **M1: Programação Reativa**

#### Tópicos:

**T1 - Conceitos de Programação Reativa**
   - Reactive Manifesto: Responsive, Resilient, Elastic, Message Driven
   - Streams assíncronos
   - Backpressure
   - Non-blocking I/O

**T2 - Reactive Streams Specification**
   - Publisher
   - Subscriber
   - Subscription
   - Processor
   - Protocolo de sinalização

**T3 - Project Reactor**
   - Mono: 0 ou 1 elemento
   - Flux: 0 a N elementos
   - Operadores: map, filter, flatMap, zip, merge
   - Schedulers: parallel, elastic, bounded elastic
   - Error handling: onErrorReturn, onErrorResume, retry
   - Backpressure strategies

**T4 - RxJava**
   - Observable, Single, Maybe, Completable, Flowable
   - Operadores
   - Schedulers
   - Diferenças com Reactor

**T5 - Spring WebFlux**
   - Alternativa reativa ao Spring MVC
   - @RestController com Mono e Flux
   - Functional endpoints
   - WebClient (cliente HTTP reativo)
   - R2DBC (Reactive Relational Database Connectivity)

**T6 - Quando Usar Programação Reativa**
   - I/O-bound operations
   - Alta concorrência
   - Streaming de dados
   - Backpressure natural
   - Trade-offs: complexidade, debugging

---

## **BLOCO 30: TÓPICOS AVANÇADOS E ESPECIALIZADOS**

### **M1: GraalVM e Native Images**

#### Tópicos:

**T1 - GraalVM**
   - Polyglot VM
   - JIT compiler avançado
   - Suporte a múltiplas linguagens
   - Performance melhorada

**T2 - Native Image**
   - Compilação AOT (Ahead-Of-Time)
   - Binários nativos
   - Startup time reduzido
   - Menor consumo de memória
   - Limitações: reflection, dynamic class loading

**T3 - Spring Native**
   - Spring Boot com Native Image
   - Configuração e hints
   - Build e deployment

---

### **M2: Processamento de Dados em Larga Escala**

#### Tópicos:

**T1 - Apache Spark (com Java)**
   - Big Data processing
   - RDDs, DataFrames, Datasets
   - Transformações e ações
   - SparkSession
   - Spark SQL

**T2 - Apache Flink**
   - Stream processing
   - Batch processing
   - Stateful computations
   - Event time processing

---

### **M3: Machine Learning em Java**

#### Tópicos:

**T1 - Deeplearning4j**
   - Deep learning library
   - Neural networks
   - Training e inference

**T2 - Weka**
   - Machine learning algorithms
   - Data mining
   - Classificação, clustering, regressão

**T3 - Apache Mahout**
   - Scalable machine learning
   - Algoritmos distribuídos

---

### **M4: Blockchain e Criptomoedas**

#### Tópicos:

**T1 - Web3j**
   - Interação com Ethereum
   - Smart contracts em Java
   - Transações

---

### **M5: Desenvolvimento de Jogos**

#### Tópicos:

**T1 - LibGDX**
   - Framework cross-platform
   - 2D e 3D games
   - Rendering, physics, input

**T2 - jMonkeyEngine**
   - 3D game engine
   - Scene graph
   - Materials e lighting

---

## **BLOCO 31: SOFT SKILLS E CARREIRA**

### **M1: Metodologias Ágeis**

#### Tópicos:

**T1 - Scrum**
   - Sprints
   - Papéis: Product Owner, Scrum Master, Dev Team
   - Cerimônias: Planning, Daily, Review, Retrospective
   - Artefatos: Product Backlog, Sprint Backlog, Increment

**T2 - Kanban**
   - Visualização de trabalho
   - WIP limits
   - Fluxo contínuo
   - Métricas: lead time, cycle time

**T3 - Extreme Programming (XP)**
   - Pair programming
   - TDD
   - Continuous Integration
   - Refactoring
   - Collective ownership

---

### **M2: Desenvolvimento de Carreira**

#### Tópicos:

**T1 - Habilidades Técnicas**
   - Especialização vs generalização (T-shaped)
   - Aprendizado contínuo
   - Certificações: Oracle Certified, Spring Professional
   - Contribuições open source
   - Blog técnico, palestras

**T2 - Habilidades de Comunicação**
   - Documentação técnica
   - Apresentações
   - Code reviews
   - Feedback construtivo
   - Comunicação com não-técnicos

**T3 - Trabalho em Equipe**
   - Colaboração
   - Resolução de conflitos
   - Mentoria
   - Liderança técnica

**T4 - Gestão de Tempo e Priorização**
   - Eisenhower Matrix
   - Técnica Pomodoro
   - Evitar multitasking excessivo
   - Deep work

---

### **M3: Mercado e Tendências**

#### Tópicos:

**T1 - Tendências Atuais em Java**
   - Project Loom (Virtual Threads)
   - Project Panama (FFM API)
   - Project Valhalla (Value Types)
   - Pattern Matching evolution
   - Records e Sealed Classes

**T2 - Ecossistema Java**
   - Spring vs Jakarta EE vs Micronaut vs Quarkus
   - Microservices frameworks
   - Cloud-native Java
   - Serverless Java

**T3 - Áreas de Atuação**
   - Backend development
   - Full-stack (Java + frontend frameworks)
   - Data engineering
   - DevOps/SRE
   - Architecture
   - Big Data
   - Cloud engineering

---

## **CONCLUSÃO DA GRADE**

Esta grade de aprendizado cobre todos os aspectos fundamentais, intermediários e avançados da linguagem Java e seu ecossistema. A jornada de aprendizado deve ser incremental, começando pelos blocos fundamentais e progredindo conforme o domínio de cada área.

**Recomendações para o estudo:**

1. **Prática constante**: Implemente projetos para cada módulo
2. **Leitura de código**: Analise código de projetos open source
3. **Documentação oficial**: Consulte JavaDocs e especificações
4. **Comunidade**: Participe de fóruns, Stack Overflow, GitHub
5. **Projetos pessoais**: Construa aplicações reais
6. **Code reviews**: Peça e dê feedback em código
7. **Testes**: Sempre escreva testes para seu código
8. **Refatoração**: Melhore código continuamente

**Tempo estimado**: Com dedicação integral, esta grade pode levar de 12 a 24 meses para ser completamente dominada, dependendo da experiência prévia e do ritmo de estudo.

Boa sorte na sua jornada de aprendizado em Java! 🚀☕