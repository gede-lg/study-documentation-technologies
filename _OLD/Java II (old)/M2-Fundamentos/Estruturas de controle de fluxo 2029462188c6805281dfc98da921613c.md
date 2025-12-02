# Estruturas de controle de fluxo

## 1. Introdução

As **estruturas de controle de fluxo** em Java são fundamentais para direcionar a execução do programa, permitindo que diferentes blocos de código sejam executados de acordo com condições ou repetidos enquanto certas condições forem verdadeiras.

- **Relevância e importância:**
    - Permitem implementar lógica condicional e iteração — bases de qualquer aplicação, desde scripts simples até sistemas corporativos.
    - Garantem legibilidade e manutenibilidade, ao expressar claramente “quem faz o quê e quando”.
- **Definições e conceitos fundamentais:**
    - **Tema principal:** “Estruturas de Controle de Fluxo” — engloba mecanismos que alteram a ordem sequencial padrão de execução.
    - **Subtemas:**
        - **Condicionais:** `if/else`, `switch` — escolhem qual bloco executar.
        - **Laços de repetição:** `for`, `while`, `do-while` — repetem execução enquanto uma condição se mantém.
    - **Para que servem:** expressar decisões e repetições de forma clara, evitando duplicação de código e facilitando adaptações.

---

## 2. Sumário

1. [Introdução](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
2. [Sumário](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
3. [Conteúdo Detalhado](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
    1. [Sintaxe e Estrutura](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
    2. [Componentes Principais](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
    3. [Restrições de Uso](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
4. [Exemplos de Código Otimizados](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
    1. [if/else](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
    2. [switch](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
    3. [for](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
    4. [while](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
    5. [do-while](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
5. [Informações Adicionais](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)
6. [Referências para Estudo Independente](Estruturas%20de%20controle%20de%20fluxo%202029462188c6805281dfc98da921613c.md)

---

## 3. Conteúdo Detalhado

### 3.1 Sintaxe e Estrutura

### if / else

```java
if (condição) {
    // bloco executado se condição for true
} else if (outraCondição) {
    // executado se a primeira for false e esta for true
} else {
    // executado se todas as anteriores forem false
}

```

### switch

```java
switch (expressão) {
    case valor1:
        // ações
        break;
    case valor2:
        // ações
        break;
    default:
        // ações padrão
}

```

### for

```java
for (inicialização; condição; iteração) {
    // bloco repetido
}

```

### while

```java
while (condição) {
    // repetido enquanto condição for true
}

```

### do-while

```java
do {
    // executado ao menos uma vez
} while (condição);

```

---

### 3.2 Componentes Principais

- **Condições booleanas:** expressões retornando `true`/`false` (comparações, chamadas de método, variáveis booleanas).
- **Blocos de código:** delimitados por `{}` permitem agrupar múltiplas instruções.
- **Declarações de controle:**
    - `break`: interrompe `switch` ou laços (`for`, `while`, `do-while`).
    - `continue`: avança imediatamente para a próxima iteração do laço, ignorando o restante do bloco atual.
- **Escopo de variáveis:** variáveis declaradas dentro de um bloco `{}` só existem ali; fora dele, não são visíveis.

---

### 3.3 Restrições de uso

- **Expressão de `switch`:**
    - Até Java 12, só `byte`, `short`, `int`, `char`, `String` e enums.
    - A partir de Java 14, *switch expressions* com `yield`, suportando tipos mais ricos.
- **Evitar laços infinitos:** sempre garantir que a condição de término seja alcançada ou usar `break` com cautela.
- **Complexidade cognitiva:**
    - Múltiplos níveis de aninhamento dificultam a leitura. Prefira extrair métodos para blocos complexos.

---

## 4. Exemplos de Código Otimizados

### 4.1 if/else

```java
/**
 * Verifica se um número é positivo, negativo ou zero.
 */
public String avaliarNumero(int n) {
    if (n > 0) {
        return "Positivo";
    } else if (n < 0) {
        return "Negativo";
    } else {
        return "Zero";
    }
}

```

- **Uso real:** validações de entrada em APIs, fluxos de decisão simples.

### 4.2 switch

```java
/**
 * Converte dia da semana (1–7) em nome.
 */
public String nomeDia(int dia) {
    return switch (dia) {
        case 1 -> "Domingo";
        case 2 -> "Segunda-feira";
        case 3 -> "Terça-feira";
        case 4 -> "Quarta-feira";
        case 5 -> "Quinta-feira";
        case 6 -> "Sexta-feira";
        case 7 -> "Sábado";
        default -> throw new IllegalArgumentException("Dia inválido: " + dia);
    };
}

```

- **Vantagem do switch expression (Java 14+):** retorno direto, sintaxe concisa, sem necessidade de `break`.

### 4.3 for

```java
/**
 * Soma todos os elementos de uma lista.
 */
public int somaLista(List<Integer> lista) {
    int soma = 0;
    for (int valor : lista) {
        soma += valor;
    }
    return soma;
}

```

- **Dica:** use o laço “enhanced for” (`for-each`) para coleções, garantindo legibilidade.

### 4.4 while

```java
/**
 * Lê comandos até o usuário digitar "sair".
 */
public void processarComandos(Scanner scan) {
    String cmd;
    while (!(cmd = scan.nextLine()).equalsIgnoreCase("sair")) {
        executar(cmd);
    }
}

```

- **Caso de uso:** leitura interativa; laços cujo número de iterações não é conhecido previamente.

### 4.5 do-while

```java
/**
 * Exibe menu e retorna opção válida (1–4).
 */
public int lerOpcaoMenu(Scanner scan) {
    int opcao;
    do {
        System.out.println("1. Incluir\\n2. Editar\\n3. Excluir\\n4. Sair");
        opcao = scan.nextInt();
    } while (opcao < 1 || opcao > 4);
    return opcao;
}

```

- **Quando usar:** garantir execução mínima antes de verificar condição (menus, confirmações).

---

## 5. Informações Adicionais

- **Expressões Lambda e Streams:** reduzem a necessidade de laços explícitos; ex.:
    
    ```java
    int soma = lista.stream().mapToInt(Integer::intValue).sum();
    
    ```
    
- **Paralelismo:** coleções podem usar `.parallelStream()` para aproveitar múltiplos núcleos, mas cuidado com condições de corrida.
- **Ferramentas de análise estática:** IDEs (IntelliJ/Eclipse) e linters ajudam a detectar laços potencialmente infinitos ou condicionais sempre verdadeiras.

---

## 6. Referências para Estudo Independente

- **Oracle Java Tutorials – Control Flow Statements**[https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html)
- **Baeldung – Guide to Java Switch Expressions**[https://www.baeldung.com/java-switch-expression](https://www.baeldung.com/java-switch-expression)
- **Java Language Specification – §14 Statements**[https://docs.oracle.com/javase/specs/jls/se17/html/jls-14.html](https://docs.oracle.com/javase/specs/jls/se17/html/jls-14.html)
- **Effective Java (Joshua Bloch)** – Capítulo sobre boas práticas de estruturação de código

---