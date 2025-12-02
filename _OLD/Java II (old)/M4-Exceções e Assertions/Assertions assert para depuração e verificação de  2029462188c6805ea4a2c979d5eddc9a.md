# Assertions: assert para depuração e verificação de condições

**1. Introdução**

As **assertions** em Java são instrumentos de verificação de hipóteses durante a execução de um programa. Elas permitem que o desenvolvedor declare condições que **sempre deveriam ser verdadeiras** em pontos críticos do código. Se uma assertion falhar (isto é, a condição for falsa), o programa lança um `AssertionError`, interrompendo a execução e sinalizando imediatamente o problema.

- **Relevância:**
    - **Depuração rápida:** Detecta inconsistências em tempo de execução sem poluir o código de produção com verificações manuais.
    - **Contratos de código:** Funciona como documentação executável de pré e pós-condições.
    - **Qualidade de software:** Ajuda a encontrar bugs lógicos logo durante testes, antes de chegarem a ambientes de produção.
- **Definição e Conceitos Fundamentais:**
    - **Tema principal:** Uso da palavra-chave `assert` para depuração e verificação de condições em Java.
    - **Subtemas:**
        1. **Ativação/desativação de assertions:** Como ligar e desligar no runtime.
        2. **Declarações simples vs. com mensagem:** Diferenças e melhores usos.
        3. **Boas práticas:** Quando e onde inserir assertions.

---

**2. Sumário**

1. Introdução
2. Sumário
3. Conteúdo Detalhado
    1. Sintaxe e Estrutura
    2. Componentes Principais
    3. Restrições de Uso
4. Exemplos de Código Otimizados
5. Informações Adicionais
6. Referências para Estudo Independente

---

## 3. Conteúdo Detalhado

### 3.1 Sintaxe e Estrutura

- **Declaração básica:**
    
    ```java
    assert condição;
    
    ```
    
    Se `condição` for `false`, lança `AssertionError` sem mensagem.
    
- **Declaração com mensagem:**
    
    ```java
    assert condição : expressãoInformativa;
    
    ```
    
    Onde `expressãoInformativa` pode ser `String` ou qualquer objeto cujo `toString()` será mostrado no erro.
    
- **Exemplo:**
    
    ```java
    int divisor = computeDivisor();
    // Garantir que não dividir por zero
    assert divisor != 0 : "Divisor deve ser diferente de zero: " + divisor;
    int resultado = 100 / divisor;
    
    ```
    
- **Ativação de assertions no runtime:**
    - **Desabilitadas por padrão**.
    - Para ativar em todo o aplicativo:
        
        ```
        java -ea MinhaClasse
        
        ```
        
    - Para ativar apenas em um pacote/classe:
        
        ```
        java -ea:meu.pacote... -ea:outra.Classe MinhaClasse
        
        ```
        
    - Para desativar em uma classe específica (se ativadas globalmente):
        
        ```
        java -ea -da:alguma.Classe MinhaClasse
        
        ```
        

### 3.2 Componentes Principais

1. **O comando `assert`:**
    - Palavra-chave reservada desde Java 1.4.
    - Sintaticamente similar a uma expressão, não um bloco de controle (como `if`).
2. **`AssertionError`:**
    - Subclasse de `Error`, não de `Exception`.
    - Normalmente **não deve** ser capturado em blocos `catch`.
    - Indica falha grave de hipótese, sinal de bug de programação.
3. **Expressão de mensagem:**
    - Pode ser qualquer tipo de dado.
    - Executada **só** quando a assertion falha—útil para construir mensagens pesadas sem custo em runtime com assertions desabilitadas.
4. **Interação com profiling e production:**
    - Em produção, geralmente deixamos assertions desabilitadas para **não impactar performance**.
    - Em ambientes de teste/desenvolvimento, recomenda-se **sempre ativar**.

### 3.3 Restrições de Uso

- **Não substituir validações de input do usuário:**
Assertions são para checar **hipóteses internas**, não para lidar com entradas inválidas vindas de fora do sistema—ali, deve-se usar exceções controladas (por exemplo, `IllegalArgumentException`, validações de dados).
- **Não ter efeitos colaterais:**
A expressão dentro de `assert` não deve alterar estado. Exemplo **evite**:
    
    ```java
    assert lista.clear() == null; // NÃO faça isso!
    
    ```
    
    Porque, se assertions estiverem desligadas, a lista nunca será limpa.
    
- **Não capturar `AssertionError`:**
Interceptar esse erro pode ocultar bugs de programação.
- **Uso moderado em loops de alto desempenho:**
Assert dentro de laços muito críticos pode degradar performance quando ativado.

---

## 4. Exemplos de Código Otimizados

1. **Checagem de invariantes de objeto**
    
    ```java
    public class ContaBancaria {
        private double saldo;
    
        public void sacar(double valor) {
            assert valor > 0 : "Valor de saque deve ser positivo: " + valor;
            assert saldo >= valor : "Saldo insuficiente. Saldo: " + saldo + ", Saque: " + valor;
            saldo -= valor;
        }
    
        public void depositar(double valor) {
            assert valor > 0 : "Valor de depósito deve ser positivo: " + valor;
            saldo += valor;
        }
    
        // Invariante: saldo não pode ser negativo
        public void verificaInvariante() {
            assert saldo >= 0 : "Saldo negativo: " + saldo;
        }
    }
    
    ```
    
    > As assertions documentam e garantem as regras de negócio de forma executável.
    > 
2. **Pré e pós-condições em métodos**
    
    ```java
    public static int buscaBinaria(int[] arr, int key) {
        // Pré-condição: array não nulo e ordenado
        assert arr != null : "Array não pode ser nulo";
        for (int i = 1; i < arr.length; i++) {
            assert arr[i-1] <= arr[i] : "Array deve estar ordenado";
        }
    
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = (low + high) >>> 1;
            if (arr[mid] == key) {
                // Pós-condição: encontrado
                assert arr[mid] == key;
                return mid;
            }
            if (arr[mid] < key) low = mid + 1;
            else high = mid - 1;
        }
        // Pós-condição: não encontrado devolve -1
        assert low > high;
        return -1;
    }
    
    ```
    
3. **Uso inteligente de mensagem pesada**
    
    ```java
    assert complexCalculation() < limit :
          () -> "Resultado de complexCalculation() ultrapassou limite " + limit;
    
    ```
    
    > A mensagem é construída só se a assertion falhar (Java 8+).
    > 

---

## 5. Informações Adicionais

- **Integração com Testes:**
Em frameworks de testes (JUnit, TestNG), recomenda-se manter assertions habilitadas para capturar erros de lógica não cobertos por casos de teste.
- **Java Modules e Assertions:**
Ao usar Java 9+ com módulos, assertions também seguem escopo de módulos. Pode-se ativar apenas em módulos específicos.
- **Ferramentas de Qualidade de Código:**
Linters e ferramentas de análise estática (Checkstyle, SonarQube) podem sinalizar uso inadequado de `assert`.
- **Projetos Futuros:**
Explore **Design by Contract** com bibliotecas externas (OVal, JContract), que oferecem pré/post-condições mais ricas.

---

## 6. Referências para Estudo Independente

1. **Documentação Oficial Oracle**
    - Assertions
    [https://docs.oracle.com/javase/tutorial/essential/exceptions/assert.html](https://docs.oracle.com/javase/tutorial/essential/exceptions/assert.html)
2. **Livro “Effective Java”, Joshua Bloch**
    - Capítulo sobre “Item 62: Use assertions to check your assumptions in code.”
3. **Artigo Baeldung**
    - “Guide to Java Assertions”
    [https://www.baeldung.com/java-assert](https://www.baeldung.com/java-assert)
4. **Stack Overflow Discussion**
    - “When should I use Java’s assert?”
    [https://stackoverflow.com/questions/254032](https://stackoverflow.com/questions/254032)
5. **Java Language Specification**
    - Seção 14.10 — The assert Statement
    [https://docs.oracle.com/javase/specs/jls/se17/html/jls-14.html#jls-14.10](https://docs.oracle.com/javase/specs/jls/se17/html/jls-14.html#jls-14.10)

---

> Dica prática: durante a fase de desenvolvimento, ative assertions por padrão em sua IDE (IntelliJ e Eclipse permitem isso nas configurações de execução), garantindo que todas as suas assumptions sejam continuamente validadas.
>