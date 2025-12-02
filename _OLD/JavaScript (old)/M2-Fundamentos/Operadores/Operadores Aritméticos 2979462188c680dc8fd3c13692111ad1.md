# Operadores Aritméticos

## Fundamentos Conceituais e Teóricos Completos

---

## 🎯 Introdução e Definição

### Definição Conceitual

Os **operadores aritméticos** são símbolos especiais da linguagem JavaScript que representam operações matemáticas fundamentais. Eles são expressões que, quando aplicadas a valores numéricos (operandos), produzem novos valores numéricos como resultado. Conceitualmente, eles funcionam como **funções matemáticas especializadas** que foram elevadas ao status de sintaxe nativa da linguagem devido à sua universalidade e frequência de uso.

Diferentemente de funções convencionais que requerem invocação explícita através de parênteses, os operadores aritméticos utilizam **notação infixa** (o operador fica entre os operandos), tornando o código mais legível e natural, espelhando a notação matemática tradicional que usamos desde a escola.

### Contexto Histórico e Motivação

A inclusão de operadores aritméticos nas linguagens de programação remonta aos primórdios da computação. JavaScript, criada em 1995 por Brendan Eich para adicionar interatividade às páginas web, herdou esses operadores das linguagens predecessoras (especialmente C e Java), reconhecendo que **cálculos matemáticos são operações fundamentais** em qualquer programa computacional.

A decisão de implementar esses operadores como símbolos sintáticos especiais (em vez de métodos ou funções) reflete uma filosofia de design: operações matemáticas são tão universais e frequentes que merecem a sintaxe mais concisa e direta possível. Isso reduz a verbosidade do código e aumenta a expressividade.

### Problema Fundamental que Resolve

Os operadores aritméticos resolvem o problema central da **manipulação e transformação de valores numéricos** em programas. Sem eles, teríamos que implementar manualmente cada operação matemática usando algoritmos de baixo nível ou chamar funções verbosas, tornando o código menos legível e mais propenso a erros.

Eles abstraem a complexidade da aritmética ao nível de máquina (representação binária, operações de CPU, gerenciamento de tipos numéricos) e fornecem uma interface limpa e intuitiva para o desenvolvedor expressar cálculos matemáticos.

### Importância no Ecossistema JavaScript

No ecossistema JavaScript, os operadores aritméticos são fundamentais porque:

1. **Universalidade**: Praticamente todo programa JavaScript realiza algum tipo de cálculo numérico
2. **Performance**: São implementados nativamente no motor JavaScript, oferecendo execução otimizada
3. **Expressividade**: Permitem expressar intenções matemáticas de forma clara e concisa
4. **Interoperabilidade**: Comportam-se de forma consistente com outras linguagens, facilitando a transferência de conhecimento
5. **Base para abstração**: Servem como blocos de construção para operações mais complexas

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

Os operadores aritméticos em JavaScript podem ser compreendidos através de quatro dimensões conceituais principais:

**1. Dimensão Sintática**

- Notação infixa (operador entre operandos)
- Aridade (unários vs binários)
- Precedência e associatividade
- Símbolos e sua semântica

**2. Dimensão Semântica**

- O que cada operador representa matematicamente
- Comportamento com diferentes tipos de valores
- Coerção de tipos implícita
- Valores especiais (NaN, Infinity)

**3. Dimensão Operacional**

- Como o motor JavaScript processa esses operadores
- Ordem de avaliação
- Otimizações do compilador
- Impacto na performance

**4. Dimensão Pragmática**

- Casos de uso comuns
- Padrões e anti-padrões
- Considerações de legibilidade
- Compatibilidade entre ambientes

### Pilares Fundamentais

1. **Operadores Binários Básicos**: Os cinco operadores fundamentais (+, -, *, /, %) que implementam as operações aritméticas elementares
2. **Operador de Exponenciação**: Adição moderna (ES2016) para potenciação
3. **Operadores Unários de Mutação**: Incremento e decremento (++, --) que combinam leitura, operação e atribuição
4. **Sistema de Precedência**: Hierarquia que determina a ordem de avaliação em expressões complexas

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando o motor JavaScript encontra uma operação aritmética, ocorre um processo multi-etapas:

**1. Análise Léxica e Sintática**
O parser identifica o operador e seus operandos, construindo uma Árvore de Sintaxe Abstrata (AST). Por exemplo, a expressão `5 + 3 * 2` é transformada em uma estrutura hierárquica que respeita a precedência de operadores.

**2. Coerção de Tipos**
JavaScript é dinamicamente tipado, então antes de realizar a operação, o motor verifica os tipos dos operandos. Se necessário, aplica **coerção de tipo** (type coercion) para converter valores não-numéricos em números. Isso explica por que `"5" - 2` resulta em `3` (a string é convertida para número).

**3. Execução da Operação**
O motor JavaScript delega a operação aritmética real para a camada de baixo nível (geralmente código nativo otimizado ou instruções de CPU). Para números inteiros pequenos, podem ser usadas operações aritméticas de inteiros rápidas. Para números de ponto flutuante, usa-se o padrão IEEE 754.

**4. Produção do Resultado**
O resultado é retornado como um novo valor, sem modificar os operandos originais (exceto nos operadores de incremento/decremento quando usados como efeitos colaterais).

### Princípios e Conceitos Subjacentes

**Imutabilidade de Valores Primitivos**
Os números em JavaScript são valores primitivos imutáveis. Quando fazemos `x + y`, não estamos modificando `x` ou `y`, mas criando um novo valor. Isso tem implicações importantes para como pensamos sobre cálculos e atribuições.

**Coerção de Tipos como Filosofia**
JavaScript prioriza a **flexibilidade sobre a rigidez de tipos**. A coerção automática é uma característica intencional que permite código mais conciso, mas exige compreensão profunda para evitar comportamentos inesperados.

**Notação Infixa e Legibilidade**
A escolha pela notação infixa (`a + b` em vez de `add(a, b)` ou `+(a, b)`) reflete um compromisso com a legibilidade humana. Nosso cérebro está condicionado pela notação matemática tradicional.

**Precedência como Sistema de Regras**
A precedência de operadores não é arbitrária, mas reflete convenções matemáticas universais (multiplicação antes de adição, por exemplo). Isso cria um "contrato social" entre a linguagem e o programador.

### Relação com Outros Conceitos da Linguagem

**Conexão com Expressões**
Operadores aritméticos são a base das **expressões aritméticas**, que são fragmentos de código que avaliam para um valor. Compreender operadores é essencial para dominar expressões, que por sua vez são usadas em praticamente todas as estruturas JavaScript (condicionais, loops, atribuições, etc.).

**Interação com Variáveis**
Operadores transformam valores armazenados em variáveis. A expressão `let resultado = a * b + c` demonstra como operadores conectam o conceito de armazenamento (variáveis) com o conceito de transformação (operações).

**Base para Operadores Compostos**
Os operadores de atribuição composta (`+=`, `-=`, etc.) são construídos sobre operadores aritméticos, demonstrando como conceitos simples podem ser combinados para criar abstrações mais convenientes.

**Relação com Coerção de Tipos**
Operadores aritméticos são um dos principais contextos onde a coerção de tipos ocorre em JavaScript, tornando-os fundamentais para compreender o sistema de tipos dinâmico da linguagem.

### Modelo Mental para Compreensão

Pense nos operadores aritméticos como **transformadores de valor**: eles recebem um ou dois valores de entrada e produzem um novo valor de saída, sem alterar as entradas originais (conceito funcional de pureza, exceto nos casos especiais de ++ e --).

Visualize uma **fábrica de processamento**:

- **Entrada**: Operandos (valores brutos)
- **Processo**: Aplicação da regra matemática do operador
- **Controle de Qualidade**: Coerção de tipos e validação
- **Saída**: Novo valor numérico

Este modelo ajuda a entender que:

- Operadores não modificam variáveis, apenas valores
- O resultado é sempre um novo valor
- A ordem de processamento importa (precedência)
- Tipos são automaticamente ajustados quando necessário

---

## 🔍 Análise Conceitual Profunda

### 1. Operadores Binários Básicos

### 1.1 Adição (+)

**Fundamento Conceitual**

O operador de adição é conceitualmente o mais simples, mas paradoxalmente o mais complexo em JavaScript devido à sua **sobrecarga semântica**: ele serve tanto para adição numérica quanto para concatenação de strings. Esta dupla função é uma decisão de design que prioriza a conveniência sobre a clareza de tipo.

**Comportamento e Características Teóricas**

A semântica do operador `+` depende fundamentalmente do tipo dos operandos:

1. **Contexto Numérico Puro**: Quando ambos os operandos são números (ou podem ser coagidos para números), realiza adição matemática tradicional.
2. **Contexto de String**: Se ao menos um operando é uma string, o operador muda completamente seu comportamento para concatenação. Isso reflete a filosofia JavaScript de "quando em dúvida, converta para string".
3. **Precedência de String**: A string tem "prioridade" na coerção. Isso significa que `"5" + 2` resulta em `"52"` (concatenação), não `7` (adição).

**Coerção Assimétrica**

Um aspecto teórico fascinante é que o operador `+` tem comportamento de coerção diferente dos outros operadores aritméticos. Enquanto `-`, `*`, `/` e `%` convertem strings para números, o `+` faz o oposto: converte números para strings quando há uma string presente.

Esta assimetria é uma fonte comum de bugs e exige compreensão profunda do sistema de tipos JavaScript.

**Sintaxe Básica e Exemplos**

```jsx
// Sintaxe básica: operando1 + operando2

// Adição numérica pura
let soma = 10 + 5;  // 15

// Concatenação de strings
let texto = "Java" + "Script";  // "JavaScript"

// Comportamento misto (coerção para string)
let resultado1 = "Tenho " + 25 + " anos";  // "Tenho 25 anos"
let resultado2 = 10 + 5 + " maçãs";        // "15 maçãs"
let resultado3 = "Total: " + (10 + 5);     // "Total: 15" (parênteses forçam adição primeiro)

// Coerção implícita
let exemplo1 = true + 1;      // 2 (true vira 1)
let exemplo2 = false + 5;     // 5 (false vira 0)
let exemplo3 = null + 10;     // 10 (null vira 0)
let exemplo4 = undefined + 5; // NaN (undefined não pode ser convertido)

```

### 1.2 Subtração (-)

**Fundamento Conceitual**

O operador de subtração representa a operação inversa da adição: dado um total e uma parte, encontra a diferença. Diferentemente do `+`, a subtração é **semanticamente não ambígua** - sempre realiza operação numérica, nunca manipulação de strings.

**Comportamento e Características Teóricas**

A subtração em JavaScript segue o princípio de **coerção numérica agressiva**: qualquer valor não-numérico é convertido para número antes da operação. Isso torna seu comportamento mais previsível que o da adição.

**Não-Comutatividade**

É fundamental compreender que a subtração é **não-comutativa**: `a - b ≠ b - a` (exceto quando a = b). A ordem dos operandos importa significativamente. Esta propriedade tem implicações importantes para como estruturamos expressões e algoritmos.

**Valores Negativos e Identidade**

A subtração pode produzir números negativos, expandindo o domínio de resultados além dos operandos originais. O conceito de "identidade aditiva" (subtrair zero não altera o valor) é preservado: `x - 0 === x`.

**Sintaxe Básica e Exemplos**

```jsx
// Sintaxe básica: operando1 - operando2

// Subtração numérica básica
let diferenca = 15 - 8;  // 7

// Coerção de strings para números
let calc1 = "20" - 5;     // 15 (string convertida para número)
let calc2 = "100" - "30"; // 70 (ambas strings convertidas)

// Valores negativos
let negativo = 5 - 10;  // -5

// Coerção com outros tipos
let exemplo1 = true - 1;      // 0 (true = 1, então 1 - 1 = 0)
let exemplo2 = false - 5;     // -5 (false = 0, então 0 - 5 = -5)
let exemplo3 = null - 10;     // -10 (null = 0)
let exemplo4 = "abc" - 5;     // NaN (string não-numérica não pode ser convertida)

```

### 1.3 Multiplicação (*)

**Fundamento Conceitual**

A multiplicação é conceitualmente uma **adição repetida**: `a * b` significa "somar `a` consigo mesmo `b` vezes". Em termos mais abstratos, representa o cálculo de área (produto de dimensões) ou escalonamento (ampliar um valor proporcionalmente).

**Comportamento e Características Teóricas**

**Comutatividade e Associatividade**

A multiplicação preserva duas propriedades matemáticas fundamentais:

- **Comutatividade**: `a * b === b * a`
- **Associatividade**: `(a * b) * c === a * (b * c)`

Estas propriedades permitem ao motor JavaScript reordenar e reagrupar operações de multiplicação para otimização, sem alterar o resultado final.

**Elemento Identidade**

O número `1` é o elemento identidade multiplicativo: `x * 1 === x`. Esta propriedade é fundamental em algoritmos de escalonamento e normalização.

**Comportamento com Zero**

Multiplicar qualquer número por zero resulta em zero (propriedade absorvente). Multiplicar por valores entre 0 e 1 reduz o valor (conceito de "escala descendente"), enquanto multiplicar por valores maiores que 1 aumenta o valor.

**Precedência sobre Adição/Subtração**

Um conceito teórico crucial é que a multiplicação tem precedência maior que adição e subtração, refletindo a convenção matemática universal (ordem de operações PEMDAS/BODMAS).

**Sintaxe Básica e Exemplos**

```jsx
// Sintaxe básica: operando1 * operando2

// Multiplicação numérica básica
let produto = 7 * 6;  // 42

// Coerção de tipos
let calc1 = "5" * 3;     // 15 (string convertida)
let calc2 = "4" * "2";   // 8 (ambas convertidas)

// Propriedade de identidade
let identidade = 25 * 1;  // 25

// Propriedade absorvente do zero
let zero = 100 * 0;  // 0

// Escalamento
let metade = 10 * 0.5;    // 5
let dobro = 10 * 2;       // 20

// Valores booleanos
let bool1 = true * 5;   // 5 (true = 1)
let bool2 = false * 10; // 0 (false = 0)

// Precedência (multiplicação antes de adição)
let expr = 2 + 3 * 4;  // 14, não 20 (primeiro 3*4=12, depois 2+12=14)

```

### 1.4 Divisão (/)

**Fundamento Conceitual**

A divisão é a operação inversa da multiplicação: dado um produto e um fator, encontra o outro fator. Conceitualmente, representa **particionamento** (dividir um todo em partes iguais) ou **taxa** (quantas vezes um valor cabe em outro).

**Comportamento e Características Teóricas**

**Não-Comutatividade e Não-Associatividade**

A divisão é ainda mais sensível à ordem que a subtração:

- Não-comutativa: `a / b ≠ b / a`
- Não-associativa: `(a / b) / c ≠ a / (b / c)`

Estas propriedades exigem atenção cuidadosa à estrutura de expressões complexas.

**Divisão por Zero**

Um conceito fundamental em JavaScript é que divisão por zero não causa erro, mas produz valores especiais:

- `x / 0` resulta em `Infinity` (se x > 0)
- `x / 0` resulta em `Infinity` (se x < 0)
- `0 / 0` resulta em `NaN`

Esta abordagem reflete a filosofia JavaScript de "nunca parar a execução" por erros matemáticos, mas exige verificações explícitas pelo desenvolvedor.

**Divisão Inteira vs Decimal**

JavaScript não distingue entre divisão inteira e decimal - sempre retorna número de ponto flutuante. Isso difere de muitas linguagens. Para obter divisão inteira, é necessário aplicar truncamento explicitamente (Math.floor, Math.trunc, etc.).

**Precisão de Ponto Flutuante**

A divisão expõe as limitações da aritmética de ponto flutuante. Divisões que deveriam resultar em decimais finitos podem produzir aproximações: `1 / 3` resulta em `0.3333333333333333`, não uma fração exata.

**Sintaxe Básica e Exemplos**

```jsx
// Sintaxe básica: operando1 / operando2

// Divisão numérica básica
let quociente = 20 / 4;  // 5

// Divisão com resultado decimal
let decimal = 10 / 3;  // 3.3333333333333335

// Coerção de tipos
let calc1 = "20" / 5;    // 4
let calc2 = "100" / "4"; // 25

// Divisão por zero (valores especiais)
let inf = 5 / 0;        // Infinity
let negInf = -5 / 0;    // -Infinity
let notANumber = 0 / 0; // NaN

// Divisão de booleanos
let bool1 = 10 / true;  // 10 (true = 1, então 10/1)
let bool2 = 10 / false; // Infinity (false = 0, então 10/0)

// Questão de precedência (mesmo nível que multiplicação)
let expr = 10 + 20 / 5;  // 14 (primeiro 20/5=4, depois 10+4=14)

```

### 1.5 Módulo/Resto (%)

**Fundamento Conceitual**

O operador módulo (ou resto) retorna o **resto da divisão inteira** entre dois números. Conceptualmente, responde à pergunta: "Depois de dividir A por B o máximo possível usando divisão inteira, quanto sobra?"

**Comportamento e Características Teóricas**

**Não é Módulo Matemático Verdadeiro**

É crucial entender que o operador `%` em JavaScript é tecnicamente um **operador de resto**, não um módulo matemático verdadeiro. A diferença aparece com números negativos:

- Resto: preserva o sinal do dividendo
- Módulo: sempre retorna valor não-negativo

**Ciclicidade e Padrões**

O operador módulo cria **padrões cíclicos**: os resultados de `n % k` sempre ficam no intervalo [0, k-1] para números positivos. Esta propriedade é fundamental para:

- Criar índices circulares (arrays rotacionais)
- Implementar comportamentos periódicos
- Determinar paridade (par/ímpar)

**Aplicações Conceituais**

O módulo é mais que uma operação aritmética simples - é uma ferramenta de **análise divisibilidade**:

- `n % 2 === 0`: n é par
- `n % 3 === 0`: n é divisível por 3
- `n % k`: posição em ciclo de tamanho k

**Comportamento com Decimais**

Ao contrário de muitas linguagens que limitam módulo a inteiros, JavaScript permite módulo com decimais: `5.5 % 2.0` é válido e retorna `1.5`. Isso amplia suas aplicações mas pode causar surpresas devido à imprecisão de ponto flutuante.

**Sintaxe Básica e Exemplos**

```jsx
// Sintaxe básica: operando1 % operando2

// Resto de divisão básico
let resto1 = 10 % 3;  // 1 (10 = 3*3 + 1)
let resto2 = 15 % 4;  // 3 (15 = 4*3 + 3)

// Detectar paridade
let ehPar = 8 % 2;    // 0 (par)
let ehImpar = 7 % 2;  // 1 (ímpar)

// Índices circulares (aplicação comum)
let indice = 13 % 5;  // 3 (volta ao início após 5)

// Com números negativos (preserva sinal do dividendo)
let neg1 = -10 % 3;   // -1 (não 2!)
let neg2 = 10 % -3;   // 1

// Com decimais
let decimal = 5.5 % 2;  // 1.5

// Coerção de tipos
let calc = "17" % 5;  // 2

// Verificar divisibilidade
let divisivelPor3 = 12 % 3;  // 0 (é divisível)
let naoDivisivel = 13 % 3;   // 1 (não é divisível)

```

### 2. Operador de Exponenciação (**)

**Fundamento Conceitual**

O operador de exponenciação `**` é uma adição relativamente recente ao JavaScript (ES2016/ES7), projetado para calcular **potências**: elevar um número (base) a outro número (expoente). Conceitualmente, representa **multiplicação repetida**: `a ** b` significa "multiplicar `a` por si mesmo `b` vezes".

Antes deste operador, os desenvolvedores precisavam usar `Math.pow(base, expoente)`, o que era mais verboso e menos intuitivo.

**Comportamento e Características Teóricas**

**Não-Comutatividade Extrema**

A exponenciação é profundamente não-comutativa: `2 ** 3 = 8`, mas `3 ** 2 = 9`. A ordem dos operandos altera radicalmente o resultado, mais do que em qualquer outro operador aritmético.

**Crescimento Explosivo**

A exponenciação produz **crescimento exponencial**, que é extraordinariamente rápido. `2 ** 10 = 1024`, mas `2 ** 20 = 1048576`. Esta propriedade tem implicações importantes para performance e limites numéricos.

**Casos Especiais Matemáticos**

JavaScript implementa convenções matemáticas para casos especiais:

- `x ** 0 = 1` (qualquer número elevado a 0 é 1, incluindo 0)
- `x ** 1 = x` (identidade)
- `x ** -n = 1 / (x ** n)` (expoentes negativos)
- `x ** 0.5 = √x` (raiz quadrada)
- `x ** (1/n) = ⁿ√x` (raiz n-ésima)

**Associatividade à Direita**

Diferentemente da maioria dos operadores binários, `**` é **associativo à direita**: `2 ** 3 ** 2` é avaliado como `2 ** (3 ** 2) = 2 ** 9 = 512`, não `(2 ** 3) ** 2 = 8 ** 2 = 64`. Esta é uma propriedade matemática fundamental da exponenciação.

**Precedência Elevada**

O operador `**` tem precedência maior que operadores unários como negação, mas é única entre os operadores binários por sua associatividade à direita.

**Sintaxe Básica e Exemplos**

```jsx
// Sintaxe básica: base ** expoente

// Exponenciação básica
let quadrado = 5 ** 2;      // 25 (5 × 5)
let cubo = 2 ** 3;          // 8 (2 × 2 × 2)
let grande = 2 ** 10;       // 1024

// Expoentes especiais
let identidade = 7 ** 1;    // 7
let zero = 5 ** 0;          // 1 (qualquer número elevado a 0)

// Raízes (expoentes fracionários)
let raizQuadrada = 16 ** 0.5;    // 4 (√16)
let raizCubica = 27 ** (1/3);    // 3 (∛27)

// Expoentes negativos (inverso)
let inverso = 2 ** -1;      // 0.5 (1/2)
let pequeno = 10 ** -3;     // 0.001

// Associatividade à direita
let direita = 2 ** 3 ** 2;  // 512 (2 ** (3 ** 2))
let explicito = 2 ** (3 ** 2);  // 512
let diferente = (2 ** 3) ** 2;  // 64

// Coerção de tipos
let texto = "2" ** "3";     // 8

// Crescimento exponencial
let rapido = 2 ** 20;       // 1048576

```

### 3. Operadores de Incremento (++) e Decremento (--)

**Fundamento Conceitual**

Os operadores de incremento `++` e decremento `--` são **operadores unários de mutação** que combinam três operações em uma: leitura do valor, modificação (adicionar ou subtrair 1), e atribuição do novo valor. Eles representam uma otimização sintática para uma operação extremamente comum: aumentar ou diminuir uma variável em 1.

Conceitualmente, são **atalhos** inspirados pela linguagem C, projetados para tornar loops e contadores mais concisos.

**Comportamento e Características Teóricas**

**Efeito Colateral (Side Effect)**

Diferentemente de todos os outros operadores aritméticos discutidos até agora, `++` e `--` não são **puros** - eles modificam a variável operanda. Isso os torna diferentes da expressão `x = x + 1`, que parece equivalente mas enfatiza a natureza de efeito colateral.

Esta quebra de pureza tem implicações importantes:

- Afeta o estado do programa
- Ordem de avaliação importa
- Pode causar bugs sutis se mal compreendido

**Prefixo vs Sufixo: Dualidade Semântica**

A característica mais teoricamente rica desses operadores é que sua **posição** em relação à variável altera fundamentalmente seu comportamento:

**Prefixo (`++x` ou `--x`)**

- Incrementa/decrementa PRIMEIRO
- Depois retorna o novo valor
- Mnemônico: "antes de usar, modifica"

**Sufixo (`x++` ou `x--`)**

- Retorna o valor original PRIMEIRO
- Depois incrementa/decrementa
- Mnemônico: "usa, depois modifica"

Esta dualidade cria dois operadores logicamente distintos a partir do mesmo símbolo, dependendo apenas do posicionamento.

**Modelo Mental de Avaliação**

Para prefixo (`++x`):

```
1. Ler valor atual de x
2. Adicionar 1
3. Armazenar novo valor em x
4. Retornar novo valor

```

Para sufixo (`x++`):

```
1. Ler valor atual de x
2. Guardar valor original temporariamente
3. Adicionar 1 ao valor de x
4. Armazenar novo valor em x
5. Retornar valor original guardado

```

**Contexto de Uso**

Esses operadores são mais comumente encontrados em:

- **Loops**: `for (let i = 0; i < 10; i++)`
- **Contadores**: rastrear número de ocorrências
- **Índices**: navegar por estruturas de dados

**Limitações Conceituais**

Importante: esses operadores só funcionam com **variáveis** (lvalues), não com expressões arbitrárias:

- `x++` é válido
- `(x + y)++` é INVÁLIDO
- `5++` é INVÁLIDO

**Sintaxe Básica e Exemplos**

```jsx
// Sintaxe básica:
// Prefixo: ++variavel ou --variavel
// Sufixo: variavel++ ou variavel--

// Incremento básico
let a = 5;
a++;  // a agora é 6 (sufixo)

let b = 5;
++b;  // b agora é 6 (prefixo)

// Decremento básico
let c = 10;
c--;  // c agora é 9

let d = 10;
--d;  // d agora é 9

// DIFERENÇA CRUCIAL: valor de retorno

// Sufixo: ret

```