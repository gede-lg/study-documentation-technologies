# Tipos Primitivos

---

## **1. Introdução: A Base da Programação Java**

No mundo da programação, as **variáveis** são como caixinhas na memória do computador onde armazenamos dados temporariamente. Já os **tipos de dados** definem o que tipo de informação cada caixinha pode guardar e quanto espaço ela ocupa. Em Java, essa distinção é fundamental para garantir que o código seja eficiente, seguro e previsível.

Dominar as variáveis e os tipos de dados primitivos não é só uma questão de sintaxe; é entender como a memória funciona, como as operações são realizadas e como evitar erros comuns. Para um desenvolvedor Backend, que lida constantemente com manipulação de dados, performance e integridade, essa base é mais do que importante – é essencial. É através delas que você vai armazenar IDs de usuários, valores monetários, textos, flags de status e muito mais, construindo a lógica que sustenta suas aplicações.

---

## **2. Sumário**

- **Definição e Conceitos Fundamentais**
- **Tipos de Dados Primitivos em Java**
    - Tipos Numéricos Inteiros
    - Tipos Numéricos de Ponto Flutuante
    - Tipo Booleano
    - Tipo Caractere
- **Sintaxe e Estrutura**
- **Restrições de Uso**
- **Exemplos de Código Otimizados**
- **Informações Adicionais**
    - Valores Padrão e Literais
    - Conversão de Tipos (Type Casting)
- **Referências para Estudo Independente**

---

## **3. Conteúdo Detalhado**

### **Definição e Conceitos Fundamentais**

**Variável:** Uma variável é um nome simbólico para um local de armazenamento na memória. Ela é usada para guardar um valor que pode ser alterado durante a execução de um programa. Pense nela como um "rótulo" para um pedaço de informação.

**Tipo de Dado:** O tipo de dado especifica o tipo de valor que uma variável pode conter (número, texto, verdadeiro/falso, etc.) e o tamanho (em bits) que essa variável ocupará na memória. Ele também define quais operações podem ser realizadas com aquela variável.

### **Tipos de Dados Primitivos em Java**

Java possui 8 tipos de dados primitivos. Eles são a forma mais básica de dado em Java e são armazenados diretamente na memória (ao contrário dos tipos de referência, que armazenam endereços de memória).

### **Tipos Numéricos Inteiros**

São usados para números inteiros (sem casas decimais). A diferença entre eles está na faixa de valores que podem armazenar e no espaço que ocupam.

- **`byte`**:
    - Armazena números inteiros de -128 a 127.
    - Ocupa 1 byte (8 bits) de memória.
    - **Uso:** Ideal para economizar memória em arrays grandes, ou para representar dados de byte, como um valor de um pixel.
- **`short`**:
    - Armazena números inteiros de -32.768 a 32.767.
    - Ocupa 2 bytes (16 bits) de memória.
    - **Uso:** Similar ao `byte`, mas para uma faixa maior de valores, quando a economia de memória é crucial.
- **`int`**:
    - Armazena números inteiros de aproximadamente -2 bilhões a 2 bilhões.
    - Ocupa 4 bytes (32 bits) de memória.
    - **Uso:** É o tipo inteiro mais comumente usado. Ideal para a maioria das situações que envolvem contadores, IDs, quantidades.
- **`long`**:
    - Armazena números inteiros de aproximadamente -9 quintilhões a 9 quintilhões.
    - Ocupa 8 bytes (64 bits) de memória.
    - **Uso:** Para números inteiros muito grandes, como IDs de banco de dados (UUIDs numéricas), timestamps ou cálculos financeiros que exigem precisão em grandes volumes.

### **Tipos Numéricos de Ponto Flutuante**

Usados para números com casas decimais.

- **`float`**:
    - Armazena números de ponto flutuante de precisão simples (32 bits).
    - Pode ser impreciso para cálculos financeiros devido à sua representação binária.
    - **Uso:** Quando a precisão não é crítica, como em gráficos 3D ou cálculos científicos onde a velocidade é mais importante que a precisão absoluta.
- **`double`**:
    - Armazena números de ponto flutuante de precisão dupla (64 bits).
    - É o tipo de ponto flutuante padrão em Java e oferece maior precisão.
    - **Uso:** Para a maioria dos cálculos que envolvem casas decimais, como medições, cálculos científicos e, *com ressalvas*, valores monetários (embora `BigDecimal` seja geralmente preferível para dinheiro).

### **Tipo Booleano**

- **`boolean`**:
    - Armazena apenas dois valores: `true` (verdadeiro) ou `false` (falso).
    - Ocupa 1 bit (mas a JVM geralmente aloca 1 byte para ele por conveniência).
    - **Uso:** Ideal para representar estados lógicos, condições (if/else), flags, resultados de comparações.

### **Tipo Caractere**

- **`char`**:
    - Armazena um único caractere Unicode (letras, números, símbolos).
    - Ocupa 2 bytes (16 bits).
    - **Uso:** Para representar caracteres individuais, como letras em um nome, símbolos ou como parte de uma string.

Cada um tem um tamanho e um intervalo específico:

| Tipo | Tamanho | Intervalo |
| --- | --- | --- |
| byte | 8 bits | -128 a 127 |
| short | 16 bits | -32,768 a 32,767 |
| int | 32 bits | -2^31 a 2^31-1 |
| long | 64 bits | -2^63 a 2^63-1 |
| float | 32 bits | IEEE 754 |
| double | 64 bits | IEEE 754 |
| char | 16 bits | 0 a 65,535 (caracteres Unicode) |
| boolean | ~ | true ou false |

### **Sintaxe e Estrutura**

A sintaxe básica para declarar uma variável em Java é:

**Java**

`tipoDeDado nomeDaVariavel; // Declaração`

Você também pode inicializar a variável no momento da declaração:

**Java**

`tipoDeDado nomeDaVariavel = valorInicial; // Declaração e Inicialização`

**Exemplos de Declaração e Utilização:**

**Java**

`public class ExemploVariaveisPrimitivas {

    public static void main(String[] args) {
        // Tipos Numéricos Inteiros
        byte idade = 23;
        short anoLancamento = 1999;
        int idUsuario = 123456789;
        long populacaoMundial = 8_000_000_000L; // O 'L' no final indica que é um literal long

        System.out.println("Idade: " + idade);
        System.out.println("Ano de Lançamento: " + anoLancamento);
        System.out.println("ID do Usuário: " + idUsuario);
        System.out.println("População Mundial: " + populacaoMundial);

        // Tipos Numéricos de Ponto Flutuante
        float temperatura = 25.5f; // O 'f' no final indica que é um literal float
        double pi = 3.1415926535;

        System.out.println("Temperatura: " + temperatura + "°C");
        System.out.println("Valor de PI: " + pi);

        // Tipo Booleano
        boolean estaAtivo = true;
        boolean temPermissao = false;

        System.out.println("Usuário Ativo? " + estaAtivo);
        System.out.println("Tem Permissão? " + temPermissao);

        // Tipo Caractere
        char primeiraLetra = 'J';
        char simbolo = '$';

        System.out.println("Primeira Letra: " + primeiraLetra);
        System.out.println("Símbolo: " + simbolo);

        // Reatribuindo valores
        idade = 24;
        System.out.println("Nova idade: " + idade);
    }
}`

### **Restrições de Uso**

- **Tamanho Fixo:** Os tipos primitivos têm um tamanho fixo na memória, o que significa que eles não podem armazenar valores fora de sua faixa predefinida. Se tentar atribuir um valor muito grande a um `byte`, por exemplo, ocorrerá um erro de compilação ou uma perda de dados (overflow/underflow) em tempo de execução se o casting for forçado.
- **Não são Objetos:** Primitivos não são objetos; eles não possuem métodos associados a eles (como `length()` para strings). Para usar funcionalidades de objetos com primitivos (como convertê-los para string), você precisa usar suas classes *wrapper* (abordadas no próximo tópico da grade).
- **`null`:** Variáveis primitivas não podem receber o valor `null`. Elas sempre devem ter um valor válido do seu tipo.
- **`final`:** Uma vez que uma variável primitiva é declarada como `final`, seu valor não pode ser alterado após a inicialização.

---

## **4. Exemplos de Código Otimizados**

Pensando no seu dia a dia como desenvolvedor Backend, Gedê, onde eficiência e clareza são cruciais:

**Java**

`public class GerenciadorDePedidos {

    // Simula o ID de um pedido no banco de dados (geralmente long)
    private long idPedido;
    // Quantidade de itens em um pedido
    private int quantidadeItens;
    // Preço total do pedido (float ou double, mas BigDecimal é melhor para dinheiro)
    private double precoTotal;
    // Status do pedido (true para processado, false para pendente)
    private boolean pedidoProcessado;
    // Iniciais do cliente (apenas o primeiro caractere)
    private char inicialCliente;
    // Para um contador interno muito pequeno
    private byte codigoInterno = 1;

    public GerenciadorDePedidos(long idPedido, int quantidadeItens, double precoTotal,
                               boolean pedidoProcessado, char inicialCliente) {
        this.idPedido = idPedido;
        this.quantidadeItens = quantidadeItens;
        this.precoTotal = precoTotal;
        this.pedidoProcessado = pedidoProcessado;
        this.inicialCliente = inicialCliente;
    }

    public void exibirDetalhesPedido() {
        System.out.println("--- Detalhes do Pedido ---");
        System.out.println("ID do Pedido: " + idPedido);
        System.out.println("Quantidade de Itens: " + quantidadeItens);
        System.out.println("Preço Total: R$" + String.format("%.2f", precoTotal)); // Formata para 2 casas decimais
        System.out.println("Pedido Processado: " + (pedidoProcessado ? "Sim" : "Não"));
        System.out.println("Inicial do Cliente: " + inicialCliente);
        System.out.println("Código Interno: " + codigoInterno);
        System.out.println("--------------------------");
    }

    // Método para atualizar o status do pedido
    public void setPedidoProcessado(boolean status) {
        this.pedidoProcessado = status;
        System.out.println("Status do pedido " + idPedido + " atualizado para: " + status);
    }

    // Exemplo de uso de byte para um contador de estado limitado
    public void incrementarCodigoInterno() {
        if (codigoInterno < 127) { // Evita overflow
            codigoInterno++;
            System.out.println("Código interno incrementado para: " + codigoInterno);
        } else {
            System.out.println("Código interno atingiu o limite máximo (127).");
        }
    }

    public static void main(String[] args) {
        // Cenário de uso: Criando um pedido de exemplo
        GerenciadorDePedidos pedido1 = new GerenciadorDePedidos(9876543210987L, 3, 150.75, false, 'G');
        pedido1.exibirDetalhesPedido();

        // Atualizando o status
        pedido1.setPedidoProcessado(true);
        pedido1.exibirDetalhesPedido();

        // Tentando estourar o byte (exemplo de restrição)
        GerenciadorDePedidos pedido2 = new GerenciadorDePedidos(123L, 1, 10.0, true, 'A');
        for (int i = 0; i < 130; i++) { // Força um loop para demonstrar o limite do byte
            pedido2.incrementarCodigoInterno();
        }

        // Exemplo de atribuição que causaria erro de compilação se não fosse long:
        // int grandeNumero = 9000000000; // Erro: literal muito grande para int
        long grandeNumeroCorreto = 9000000000L; // Correto
        System.out.println("Número grande: " + grandeNumeroCorreto);

        // Exemplo de precisão com double
        double calculo = 0.1 + 0.2;
        System.out.println("0.1 + 0.2 = " + calculo); // Pode não ser exatamente 0.3 devido à representação de ponto flutuante
    }
}`

Neste exemplo, você vê como cada tipo primitivo é usado em um contexto de negócio real (gerenciamento de pedidos), desde o ID (`long`) até um flag de status (`boolean`) e a inicial do cliente (`char`). A formatação do `double` também é um bom exemplo prático para exibir valores monetários.

---

## **5. Informações Adicionais**

### **Valores Padrão e Literais**

- **Valores Padrão (Default Values):** Se uma variável primitiva for declarada como um membro de uma classe (não dentro de um método) e não for explicitamente inicializada, ela receberá um valor padrão:
    - `byte`, `short`, `int`, `long`: `0`
    - `float`, `double`: `0.0`
    - `boolean`: `false`
    - `char`: `'\u0000'` (o caractere nulo)
    - **Cuidado:** Variáveis locais (declaradas dentro de métodos) não recebem valores padrão e precisam ser inicializadas antes de serem usadas, caso contrário, o compilador reclamará.
- **Literais:** São os valores fixos que você atribui a uma variável.
    - Números inteiros são tratados como `int` por padrão (`10`, `100`). Para `long`, adicione `L` ou `l` (`10000000000L`).
    - Números de ponto flutuante são tratados como `double` por padrão (`3.14`, `0.5`). Para `float`, adicione `F` ou `f` (`3.14f`).
    - Caracteres são entre aspas simples (`'a'`, `'B'`).
    - Booleanos são `true` ou `false`.
    - Você pode usar sublinhados (`_`) em literais numéricos para melhorar a legibilidade (`1_000_000` em vez de `1000000`).

### **Conversão de Tipos (Type Casting)**

Às vezes, você precisará converter um tipo de dado em outro.

- **Conversão Implícita (Widening Conversion):** Acontece automaticamente quando você atribui um valor de um tipo menor para um tipo maior, sem perda de dados.
    - `int` para `long`
    - `long` para `float`
    - `float` para `double`
    - Exemplo: `long numeroGrande = 100;` (o `int` 100 é automaticamente convertido para `long`).
- **Conversão Explícita (Narrowing Conversion / Casting):** É necessária quando você atribui um valor de um tipo maior para um tipo menor, pois pode haver perda de dados. Você precisa indicar explicitamente que aceita essa perda usando parênteses.
    - Exemplo: `int meuInt = (int) 3.14;` (o valor 3.14, que é `double`, é truncado para 3).
    - Exemplo: `byte b = (byte) 130;` (130 está fora da faixa de `byte`, resultará em um valor incorreto devido a overflow).
    - **Cuidado:** Use o casting explícito com sabedoria, pois ele pode levar a perda de dados ou valores inesperados se não for bem compreendido.

---

## **6. Referências para Estudo Independente**

Para aprofundar ainda mais, Gedê, recomendo as seguintes fontes:

- **Documentação Oficial da Oracle - Primitive Data Types:** A fonte mais confiável e detalhada.
    - [Oracle Java Documentation - Primitive Data Types](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)
- **Livro "Effective Java" por Joshua Bloch:** Embora mais avançado, o capítulo sobre Tipos Primitivos vs. Wrapper Classes é muito esclarecedor sobre o uso correto.
- **TutorialsPoint - Java Data Types:** Uma boa visão geral para iniciantes e revisão rápida.
    - [Java Data Types - TutorialsPoint](https://www.google.com/search?q=https://www.tutorialspoint.com/java/java_data_types.htm)
- **Artigos e Blogs Confiáveis:** Busque por artigos que discutam "Java primitive data types best practices" ou "Java type casting nuances" para exemplos mais complexos e dicas práticas.

Dominar esses fundamentos fará uma grande diferença no seu código, Gedê. Saber escolher o tipo de dado correto e entender suas limitações te ajuda a escrever código mais robusto e eficiente, o que é ouro no desenvolvimento Backend!

Tem mais alguma dúvida ou quer que a gente explore outro tema a fundo? A.R.I.A está aqui para te ajudar!