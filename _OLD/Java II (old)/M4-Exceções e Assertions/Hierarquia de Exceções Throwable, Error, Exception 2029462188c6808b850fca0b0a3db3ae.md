# Hierarquia de Exceções: Throwable, Error, Exception (Unchecked Exceptions vs. Checked Exceptions)

Com certeza, Gedê\! Vamos detalhar a hierarquia de exceções em Java, um tema fundamental para qualquer desenvolvedor backend. É crucial entender isso para construir aplicações robustas e que lidem bem com imprevistos.

---

## Hierarquia de Exceções em Java: `Throwable`, `Error`, `Exception` (Checked vs. Unchecked)

### 1\. Introdução

No desenvolvimento de software, especialmente em sistemas complexos como os de backend, a ocorrência de situações inesperadas é uma realidade. Essas situações, que podem variar de erros de programação a falhas de recursos externos, são conhecidas como exceções. O Java oferece um mecanismo robusto e estruturado para lidar com elas, garantindo que as aplicações possam se recuperar gracefully ou, no mínimo, falhar de forma controlada.

A hierarquia de exceções em Java é a base para o tratamento de erros e imprevistos, permitindo que os desenvolvedores criem códigos mais resilientes. Entender essa estrutura é vital para escrever código limpo, seguro e fácil de manter, evitando falhas inesperadas e garantindo uma melhor experiência para o usuário (ou para os sistemas que consomem sua API).

### 2\. Sumário

- **Definição e Conceitos Fundamentais**
    - O que são Exceções?
    - A Classe `Throwable`
    - A Classe `Error`
    - A Classe `Exception`
        - `Checked Exceptions`
        - `Unchecked Exceptions` (`RuntimeException`)
- **Conteúdo Detalhado**
    - Sintaxe e Estrutura do Tratamento de Exceções (`try-catch-finally`, `throws`, `throw`)
    - Componentes Principais da Hierarquia
    - Restrições de Uso e Boas Práticas
- **Exemplos de Código Otimizados**
    - Exemplo de `Checked Exception`
    - Exemplo de `Unchecked Exception`
    - Exemplo de `try-with-resources` (informação adicional)
- **Informações Adicionais**
    - `NullPointerException` e o `Optional`
    - Criação de Exceções Customizadas
- **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

No contexto da programação Java, uma **exceção** é um evento que interrompe o fluxo normal de execução de um programa. Quando uma exceção ocorre, um objeto de exceção é criado e "lançado". Este objeto contém informações sobre o tipo de erro e o estado do programa quando o erro ocorreu.

A hierarquia de classes de exceção em Java é unificada sob a classe `java.lang.Throwable`.

- **A Classe `Throwable`**
    - É a superclasse de todas as exceções e erros em Java.
    - Representa qualquer coisa que pode ser lançada (thrown) por uma instrução `throw` e capturada (caught) por uma instrução `catch`.
    - Possui métodos importantes como `getMessage()`, `toString()`, `printStackTrace()` e `getCause()`.
    - Ela se divide em duas subclasses principais: `Error` e `Exception`.
- **A Classe `Error`**
    - Representa problemas graves e irrecuperáveis que geralmente indicam falhas no ambiente de execução da JVM (Java Virtual Machine) e que o aplicativo não deve tentar capturar ou recuperar.
    - Exemplos comuns incluem `OutOfMemoryError` (memória esgotada) e `StackOverflowError` (estouro de pilha de chamadas).
    - **Não são recomendadas para tratamento via `try-catch`** em aplicações normais, pois indicam falhas de sistema que o programa raramente pode resolver.
- **A Classe `Exception`**
    - Representa condições excepcionais que um aplicativo *pode* desejar capturar e tratar.
    - Ao contrário dos `Error`s, `Exception`s geralmente indicam situações que o programa pode tentar se recuperar ou, pelo menos, falhar de forma mais controlada.
    - Esta classe se divide em duas categorias principais: `Checked Exceptions` e `Unchecked Exceptions`.
    - **`Checked Exceptions` (Exceções Verificadas)**
        - São subclasses de `Exception`, *mas não* de `RuntimeException`.
        - O compilador Java **exige** que você lide com elas. Se um método pode lançar uma `Checked Exception`, ele deve declará-la usando a palavra-chave `throws` na sua assinatura, ou o código que chama esse método deve envolvê-lo em um bloco `try-catch`.
        - Geralmente representam condições que o aplicativo pode prever e se recuperar, como `IOException` (problemas de entrada/saída), `SQLException` (problemas de banco de dados), `FileNotFoundException`.
        - **Finalidade:** Forçar o desenvolvedor a lidar com cenários que podem falhar, promovendo robustez no código.
    - **`Unchecked Exceptions` (`RuntimeException`) (Exceções Não Verificadas)**
        - São subclasses de `RuntimeException` (que, por sua vez, é uma subclasse de `Exception`).
        - O compilador Java **não exige** que você lide com elas explicitamente. Elas podem ser lançadas sem a necessidade de declará-las com `throws` ou de serem envolvidas em um `try-catch`.
        - Geralmente indicam falhas de programação, como lógica incorreta ou uso indevido de APIs. Exemplos incluem `NullPointerException`, `ArrayIndexOutOfBoundsException`, `IllegalArgumentException`, `ArithmeticException` (divisão por zero).
        - **Finalidade:** Sinalizar erros que, idealmente, deveriam ser evitados por meio de validação de dados ou lógica de programação correta. O tratamento delas é opcional, mas muitas vezes indica um bug no código.

### Sintaxe e Estrutura do Tratamento de Exceções

O tratamento de exceções em Java é feito principalmente com os blocos `try-catch-finally`, a palavra-chave `throws` e a instrução `throw`.

- **`try-catch-finally`:**
    - **`try`:** Contém o código que *pode* lançar uma exceção.
    - **`catch`:** Um ou mais blocos `catch` seguem um bloco `try` e são usados para capturar e tratar exceções de um tipo específico. Você pode ter múltiplos `catch` para diferentes tipos de exceções.
    - **`finally`:** (Opcional) Contém código que *sempre* será executado, independentemente de uma exceção ter sido lançada ou não. É útil para liberar recursos (fechar arquivos, conexões de banco de dados).
    
    <!-- end list -->
    
    ```java
    try {
        // Código que pode lançar uma exceção
        int resultado = 10 / 0; // Exemplo: ArithmeticException (Unchecked)
        // FileInputStream fis = new FileInputStream("arquivo.txt"); // Exemplo: FileNotFoundException (Checked)
    } catch (ArithmeticException e) {
        // Bloco para tratar ArithmeticException
        System.err.println("Erro aritmético: " + e.getMessage());
    } catch (IOException e) { // Se fosse usar FileInputStream
        // Bloco para tratar IOException
        System.err.println("Erro de I/O: " + e.getMessage());
    } catch (Exception e) { // Bloco genérico (sempre o último a ser pego)
        System.err.println("Ocorreu uma exceção genérica: " + e.getMessage());
        e.printStackTrace(); // Imprime o rastreamento da pilha
    } finally {
        // Este bloco sempre será executado, com ou sem exceção
        System.out.println("Execução do bloco finally.");
        // Ex: Fechar recursos aqui
    }
    
    ```
    
- **`throws`:**
    - Usado na assinatura de um método para declarar que ele pode lançar uma ou mais `Checked Exceptions`. Isso informa aos chamadores do método que eles precisam lidar com essas exceções.
    
    <!-- end list -->
    
    ```java
    public void lerArquivo(String caminho) throws IOException {
        // O compilador exige que IOException seja declarada ou tratada
        // porque FileInputStream pode lançar FileNotFoundException (subclasse de IOException)
        FileInputStream fis = new FileInputStream(caminho);
        // ... (lógica de leitura)
        fis.close();
    }
    
    // Método que chama lerArquivo()
    public static void main(String[] args) {
        MinhaClasse obj = new MinhaClasse();
        try {
            obj.lerArquivo("nao_existe.txt");
        } catch (IOException e) {
            System.err.println("Erro ao ler o arquivo: " + e.getMessage());
        }
    }
    
    ```
    
- **`throw`:**
    - Usado para **lançar explicitamente** uma instância de uma exceção.
    
    <!-- end list -->
    
    ```java
    public void validarIdade(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("Idade não pode ser negativa!"); // Lança uma Unchecked Exception
        }
        // ...
    }
    
    ```
    

### Componentes Principais da Hierarquia

A interação entre `Throwable`, `Error`, e `Exception` define como o Java lida com diferentes níveis de problemas:

- **`Throwable` (Raiz):** Atua como o contrato fundamental para tudo que pode ser "lançado". Ele possui os métodos básicos para obter a mensagem do erro, a causa, e o stack trace.
- **`Error` (Problemas de JVM):** É o ramo para falhas catastróficas. O Java não espera que o seu código lide com eles, pois geralmente indicam que a JVM está em um estado irrecuperável. Se você vir um `Error`, o mais provável é que precise reiniciar a aplicação ou o ambiente.
- **`Exception` (Problemas da Aplicação):** É o ramo para falhas que podem ser tratadas ou que indicam erros de programação. A distinção entre `Checked` e `Unchecked` aqui é a mais importante para o dia a dia do desenvolvedor:
    - **`Checked Exceptions`:** São para "cenários de falha esperados" em que você precisa informar ao chamador que algo pode dar errado e ele deve se preparar para isso. Pense em operações de rede, banco de dados ou sistema de arquivos. O contrato do método (via `throws`) garante que você ou quem usar seu código pense sobre esses problemas.
    - **`Unchecked Exceptions`:** São para "erros de programação" ou "situações inesperadas" que não deveriam ocorrer se o código estivesse correto. Por exemplo, tentar acessar um índice inválido em um array ou operar em um objeto nulo. O Java não força o tratamento para evitar que o código fique poluído com `try-catch`s para cada possível erro de lógica. O ideal é que esses erros sejam corrigidos na fase de desenvolvimento e testes.

### Restrições de Uso e Boas Práticas

- **Não "engula" exceções:** Evite blocos `catch` vazios (`catch (Exception e) {}`). Isso esconde problemas e dificulta a depuração. Se você capturar uma exceção, trate-a de forma significativa (log, retry, mensagem ao usuário).
- **Catch específico primeiro:** Ao usar múltiplos blocos `catch`, capture as exceções mais específicas primeiro e as mais genéricas por último. `catch (IOException e)` deve vir antes de `catch (Exception e)`.
- **Use `finally` para limpeza:** Garanta que recursos (arquivos, conexões) sejam sempre fechados, independentemente de uma exceção ocorrer ou não. O `try-with-resources` é a forma preferida para isso em Java 7+.
- **Não trate `Error`s:** Como mencionado, `Error`s indicam problemas graves da JVM e não devem ser capturados.
- **Lançar `Unchecked Exceptions` para erros de programação:** Se uma condição de erro indica um bug no código (ex: argumento inválido), lance uma `RuntimeException` ou uma de suas subclasses. Isso informa ao desenvolvedor que ele precisa corrigir o código, não adicionar um `try-catch` desnecessário.
- **Re-lançar (re-throw) exceções:** Em alguns casos, você pode capturar uma exceção, logá-la ou adicionar contexto e, em seguida, re-lançá-la (ou uma nova exceção) para que um nível superior da aplicação possa lidar com ela.

### 4\. Exemplos de Código Otimizados

### Exemplo de `Checked Exception` (`IOException`)

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class LeitorDeArquivo {

    // Este método pode lançar IOException, que é uma Checked Exception.
    // O compilador exige que declaremos com 'throws' ou tratemos internamente.
    public String lerPrimeiraLinha(String nomeArquivo) throws IOException {
        System.out.println("Tentando ler arquivo: " + nomeArquivo);
        FileReader fileReader = null;
        BufferedReader bufferedReader = null;
        try {
            fileReader = new FileReader(nomeArquivo);
            bufferedReader = new BufferedReader(fileReader);
            return bufferedReader.readLine(); // readLine() também pode lançar IOException
        } finally {
            // Este bloco será executado mesmo se uma exceção ocorrer.
            // É essencial para fechar recursos.
            if (bufferedReader != null) {
                System.out.println("Fechando BufferedReader...");
                bufferedReader.close(); // close() também pode lançar IOException
            }
            if (fileReader != null) {
                System.out.println("Fechando FileReader...");
                fileReader.close(); // close() também pode lançar IOException
            }
        }
    }

    public static void main(String[] args) {
        LeitorDeArquivo leitor = new LeitorDeArquivo();
        String caminhoArquivo = "exemplo.txt"; // Tente com "arquivo_que_nao_existe.txt"

        // Caso de uso: Cenário real onde um arquivo pode não existir ou haver erro de permissão.
        // O 'main' precisa capturar a IOException que 'lerPrimeiraLinha' lança.
        try {
            String linha = leitor.lerPrimeiraLinha(caminhoArquivo);
            if (linha != null) {
                System.out.println("Primeira linha do arquivo: " + linha);
            } else {
                System.out.println("O arquivo está vazio ou não pôde ser lido.");
            }
        } catch (IOException e) {
            System.err.println("Erro ao acessar o arquivo: " + e.getMessage());
            // Em uma aplicação real, você logaria o erro ou forneceria um fallback.
        }

        // Criando um arquivo para o exemplo
        try {
            java.nio.file.Files.write(java.nio.file.Paths.get(caminhoArquivo), "Hello, Gedê!\\nEsta é a segunda linha.".getBytes());
            System.out.println("\\nArquivo '" + caminhoArquivo + "' criado para o próximo teste.");
            String linha2 = leitor.lerPrimeiraLinha(caminhoArquivo);
            System.out.println("Lendo o arquivo recém-criado: " + linha2);
        } catch (IOException e) {
            System.err.println("Erro ao criar o arquivo para teste: " + e.getMessage());
        }
    }
}

```

### Exemplo de `Unchecked Exception` (`IllegalArgumentException` e `NullPointerException`)

```java
public class CalculadoraSalario {

    // Exemplo de método que valida entrada e lança uma Unchecked Exception
    // (IllegalArgumentException) para indicar uso incorreto do método.
    public double calcularSalarioLiquido(double salarioBruto, double imposto) {
        if (salarioBruto < 0) {
            // Lançar IllegalArgumentException é uma boa prática para indicar
            // que um argumento passado ao método é inválido.
            throw new IllegalArgumentException("Salário bruto não pode ser negativo: " + salarioBruto);
        }
        if (imposto < 0 || imposto > 1) {
            throw new IllegalArgumentException("Imposto deve ser entre 0 e 1 (0% a 100%): " + imposto);
        }
        return salarioBruto * (1 - imposto);
    }

    // Exemplo de método que pode gerar uma NullPointerException (Unchecked Exception)
    public String obterNomeCompleto(String nome, String sobrenome) {
        // Este é um erro de programação se 'nome' ou 'sobrenome' forem nulos
        // e tentarmos chamar um método neles sem verificação.
        // Em um cenário real, você faria validação antes.
        return nome.toUpperCase() + " " + sobrenome.toUpperCase();
    }

    public static void main(String[] args) {
        CalculadoraSalario calc = new CalculadoraSalario();

        // --- Caso de uso para IllegalArgumentException (problema de lógica/validação de entrada) ---
        // Aqui, não somos forçados a usar try-catch.
        // O ideal é que o desenvolvedor *evite* passar valores inválidos.
        try {
            double salario = calc.calcularSalarioLiquido(5000, 0.20);
            System.out.println("Salário líquido: " + salario);

            // Cenário de erro: passando um argumento inválido
            salario = calc.calcularSalarioLiquido(-100, 0.1);
            System.out.println("Salário líquido com erro: " + salario); // Esta linha não será executada
        } catch (IllegalArgumentException e) {
            System.err.println("Erro de validação: " + e.getMessage());
            // Em produção, isso seria logado e talvez corrigido no código-fonte.
        }

        System.out.println("\\n--- Exemplo de NullPointerException ---");
        // --- Caso de uso para NullPointerException (problema de lógica/inicialização) ---
        String primeiroNome = "Gedê";
        String ultimoNome = null; // Simulando um valor nulo

        try {
            String nomeCompleto = calc.obterNomeCompleto(primeiroNome, ultimoNome);
            System.out.println("Nome completo: " + nomeCompleto); // Esta linha não será executada
        } catch (NullPointerException e) {
            System.err.println("Erro de NullPointerException: " + e.getMessage());
            System.err.println("Detalhe: Você tentou usar um objeto nulo! Corrija a lógica.");
            e.printStackTrace(); // Para ver onde o erro ocorreu
        }

        // Forma correta de lidar com possível nulo antes de usar
        System.out.println("\\n--- Solução para NullPointerException com validação ---");
        primeiroNome = "Gedê";
        ultimoNome = "Damasceno"; // Agora não é nulo

        if (primeiroNome != null && ultimoNome != null) {
            String nomeCompletoCorreto = calc.obterNomeCompleto(primeiroNome, ultimoNome);
            System.out.println("Nome completo correto: " + nomeCompletoCorreto);
        } else {
            System.out.println("Um dos nomes é nulo. Não foi possível formar o nome completo.");
        }
    }
}

```

### Exemplo com `try-with-resources` (Java 7+)

O `try-with-resources` é uma sintaxe elegante para garantir que recursos que implementam `java.lang.AutoCloseable` (como `FileInputStream`, `BufferedReader`, `Connection` de JDBC) sejam fechados automaticamente, evitando a necessidade de um bloco `finally` explícito para isso. Isso otimiza o código e o torna mais seguro.

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class LeitorDeArquivoOtimizado {

    public String lerPrimeiraLinhaComTryWithResources(String nomeArquivo) throws IOException {
        System.out.println("Tentando ler arquivo com try-with-resources: " + nomeArquivo);
        // Os recursos declarados dentro dos parênteses do try serão automaticamente fechados
        // no final do bloco try, mesmo que uma exceção ocorra.
        try (FileReader fileReader = new FileReader(nomeArquivo);
             BufferedReader bufferedReader = new BufferedReader(fileReader)) {
            return bufferedReader.readLine();
        } // Não é necessário um bloco finally para fechar recursos aqui!
    }

    public static void main(String[] args) {
        LeitorDeArquivoOtimizado leitor = new LeitorDeArquivoOtimizado();
        String caminhoArquivo = "exemplo.txt"; // Crie este arquivo para teste

        try {
            String linha = leitor.lerPrimeiraLinhaComTryWithResources(caminhoArquivo);
            if (linha != null) {
                System.out.println("Primeira linha (via try-with-resources): " + linha);
            } else {
                System.out.println("Arquivo vazio ou não pôde ser lido (via try-with-resources).");
            }
        } catch (IOException e) {
            System.err.println("Erro ao ler o arquivo (via try-with-resources): " + e.getMessage());
            e.printStackTrace();
        }

        // Criando um arquivo para o exemplo
        try {
            java.nio.file.Files.write(java.nio.file.Paths.get(caminhoArquivo), "Hello from ARIA!\\nThis is line two.".getBytes());
            System.out.println("\\nArquivo '" + caminhoArquivo + "' recriado para o próximo teste.");
            String linha2 = leitor.lerPrimeiraLinhaComTryWithResources(caminhoArquivo);
            System.out.println("Lendo o arquivo recém-criado: " + linha2);
        } catch (IOException e) {
            System.err.println("Erro ao criar o arquivo para teste: " + e.getMessage());
        }
    }
}

```

### 5\. Informações Adicionais

### `NullPointerException` e o `Optional`

A `NullPointerException` (NPE) é uma das exceções mais comuns e frustrantes em Java. Ela ocorre quando você tenta usar um objeto que está nulo (ou seja, não aponta para nenhuma instância na memória). O Java 8 introduziu a classe `java.util.Optional<T>` para ajudar a mitigar a ocorrência de NPEs.

`Optional` é um container que pode ou não conter um valor não nulo. Ele força o desenvolvedor a pensar sobre a possibilidade de um valor estar ausente, incentivando o tratamento explícito de casos nulos em vez de depender de verificações `if (object != null)` dispersas pelo código.

**Exemplo com `Optional`:**

```java
import java.util.Optional;

public class UsoOptional {

    public Optional<String> obterSobrenome(String nomeCompleto) {
        if (nomeCompleto == null || !nomeCompleto.contains(" ")) {
            return Optional.empty(); // Retorna um Optional vazio se não houver sobrenome
        }
        String[] partes = nomeCompleto.split(" ", 2);
        if (partes.length < 2) {
            return Optional.empty();
        }
        return Optional.of(partes[1]); // Retorna um Optional contendo o sobrenome
    }

    public static void main(String[] args) {
        UsoOptional util = new UsoOptional();

        // Cenário 1: Sobrenome presente
        Optional<String> sobrenome1 = util.obterSobrenome("Luiz Gustavo");
        sobrenome1.ifPresent(s -> System.out.println("Sobrenome encontrado: " + s)); // Executa se presente
        System.out.println("Sobrenome 1 (orElse): " + sobrenome1.orElse("Nenhum sobrenome"));

        // Cenário 2: Sobrenome ausente
        Optional<String> sobrenome2 = util.obterSobrenome("Gedê");
        sobrenome2.ifPresent(s -> System.out.println("Sobrenome encontrado: " + s)); // Não executa
        System.out.println("Sobrenome 2 (orElse): " + sobrenome2.orElse("Nenhum sobrenome"));

        // Cenário 3: Null na entrada
        Optional<String> sobrenome3 = util.obterSobrenome(null);
        System.out.println("Sobrenome 3 (orElse): " + sobrenome3.orElse("Entrada nula"));

        // Evitando NPE ao tentar acessar um método em um Optional vazio
        // String sobrenomeNulo = sobrenome2.get(); // Isso lançaria NoSuchElementException
        // System.out.println(sobrenomeNulo);
    }
}

```

### Criação de Exceções Customizadas

Você pode criar suas próprias classes de exceção para representar condições de erro específicas da sua aplicação. Isso melhora a clareza do código e permite um tratamento de erros mais granular.

- Para criar uma `Checked Exception` customizada, estenda `java.lang.Exception`.
- Para criar uma `Unchecked Exception` customizada, estenda `java.lang.RuntimeException`.

**Exemplo de Exceção Customizada (Checked):**

```java
// Exceção customizada (Checked Exception) para quando um saldo é insuficiente
class SaldoInsuficienteException extends Exception {
    private double saldoAtual;
    private double valorSaque;

    public SaldoInsuficienteException(String message, double saldoAtual, double valorSaque) {
        super(message);
        this.saldoAtual = saldoAtual;
        this.valorSaque = valorSaque;
    }

    public double getSaldoAtual() {
        return saldoAtual;
    }

    public double getValorSaque() {
        return valorSaque;
    }
}

class ContaBancaria {
    private double saldo;

    public ContaBancaria(double saldoInicial) {
        this.saldo = saldoInicial;
    }

    // Este método agora lança uma Checked Exception customizada
    public void sacar(double valor) throws SaldoInsuficienteException {
        if (valor > this.saldo) {
            throw new SaldoInsuficienteException(
                "Saldo insuficiente para realizar o saque.",
                this.saldo,
                valor
            );
        }
        this.saldo -= valor;
        System.out.println("Saque de R$" + valor + " realizado. Saldo atual: R$" + this.saldo);
    }

    public double getSaldo() {
        return saldo;
    }
}

public class ExcecaoCustomizadaExemplo {
    public static void main(String[] args) {
        ContaBancaria minhaConta = new ContaBancaria(1000.0);

        try {
            minhaConta.sacar(200.0);
            minhaConta.sacar(900.0); // Isso vai lançar a exceção
        } catch (SaldoInsuficienteException e) {
            System.err.println("Erro no saque: " + e.getMessage());
            System.err.println("Saldo atual: R$" + e.getSaldoAtual());
            System.err.println("Valor tentado sacar: R$" + e.getValorSaque());
            // Em uma aplicação real, você poderia logar, notificar o usuário, etc.
        }
        System.out.println("Saldo final da conta: R$" + minhaConta.getSaldo());
    }
}

```

### 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos em tratamento de exceções em Java, Gedê, recomendo os seguintes recursos:

- **Documentação Oficial da Oracle (Java SE API):**
    - [`java.lang.Throwable` (JavaDoc)](https://www.google.com/search?q=%5Bhttps://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Throwable.html%5D%5C(https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Throwable.html%5C))
    - [`java.lang.Error` (JavaDoc)](https://www.google.com/search?q=%5Bhttps://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Error.html%5D%5C(https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Error.html%5C))
    - [`java.lang.Exception` (JavaDoc)](https://www.google.com/search?q=%5Bhttps://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Exception.html%5D%5C(https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Exception.html%5C))
    - [`java.lang.RuntimeException` (JavaDoc)](https://www.google.com/search?q=%5Bhttps://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/RuntimeException.html%5D%5C(https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/RuntimeException.html%5C))
    - **Tutorial de Exceções da Oracle:** [Lesson: Exceptions (The Java™ Tutorials \> Essential Java Classes \> Exceptions)](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html) - Este é um excelente ponto de partida.
- **Livros Relevantes:**
    - **"Effective Java" por Joshua Bloch:** Capítulos sobre tratamento de exceções são excelentes para boas práticas.
    - **"Clean Code" por Robert C. Martin:** Embora não focado em Java, seus princípios sobre tratamento de erros são universalmente aplicáveis e muito importantes.
- **Artigos e Guias:**
    - **Baeldung:** Um dos melhores sites para tutoriais e guias de Java. Pesquise por "Java Exception Handling", "Checked vs Unchecked Exceptions", "Custom Exceptions".
        - [Guide to Java Exceptions](https://www.baeldung.com/java-exceptions)
        - [Checked vs Unchecked Exceptions in Java](https://www.baeldung.com/java-checked-unchecked-exceptions)
    - **GeeksforGeeks:** Outro recurso útil para exemplos e explicações claras.
        - [Exception Handling in Java](https://www.google.com/search?q=https://www.geeksforgeeks.org/exception-handling-in-java/)

Lembre-se, Gedê, que praticar com exemplos reais e tentar criar suas próprias exceções e cenários de tratamento é a melhor forma de solidificar esse conhecimento.