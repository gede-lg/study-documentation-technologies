# Continue: Pular para Próxima Iteração

## 🎯 Introdução e Definição

### Definição Conceitual Clara

A palavra-chave `continue` em Java é uma **instrução de controle de fluxo** que provoca a **interrupção imediata da iteração atual** de um loop, pulando todo o código restante no corpo do loop e **avançando diretamente para a próxima iteração**. Diferentemente do `break`, que termina o loop completamente, o `continue` apenas "pula" a iteração corrente, permitindo que o loop prossiga com os próximos valores.

Conceitualmente, o `continue` representa uma decisão de **omissão seletiva** - você está dizendo ao programa: "não quero processar este item específico agora, mas quero continuar processando os demais". É como pular uma música em uma playlist sem parar de ouvir música completamente.

Na essência, `continue` é um mecanismo de **filtragem durante iteração** que permite ignorar elementos que não atendem a certos critérios, processando apenas aqueles relevantes, tudo dentro da mesma estrutura de loop.

### Contexto Histórico e Motivação

A palavra-chave `continue` tem origem nas mesmas linguagens estruturadas que introduziram o `break` - C, Pascal e suas sucessoras. Quando Java foi criado em 1995, seus projetistas na Sun Microsystems reconheceram que, além de terminar loops prematuramente (`break`), havia necessidade de **pular iterações individuais** mantendo o loop ativo.

A motivação fundamental para o `continue` nasceu de situações onde você precisa processar uma coleção de itens, mas **alguns itens devem ser ignorados** com base em critérios específicos. Antes de `continue`, isso exigiria estruturas condicionais complexas ou aninhamento profundo de `if` statements, tornando o código difícil de ler e manter.

O `continue` surgiu como uma forma de **inversão de lógica** - ao invés de envolver todo o código de processamento em um `if` positivo, você usa um `if` negativo com `continue` para descartar casos indesejados no início do loop, deixando o código principal menos aninhado e mais legível.

Com a evolução de Java, o `continue`, assim como o `break`, ganhou suporte a **labels**, permitindo pular para a próxima iteração de loops externos em estruturas aninhadas, expandindo significativamente sua expressividade.

### Problema Fundamental que Resolve

O `continue` resolve diversos problemas fundamentais de processamento de coleções:

**1. Filtragem Durante Iteração:** Quando você quer processar apenas elementos que atendem a certos critérios, `continue` permite descartar os demais de forma limpa, sem aumentar a complexidade ciclomática do código.

**2. Evitar Aninhamento Excessivo:** Sem `continue`, validações múltiplas resultariam em `if` aninhados profundamente. Com `continue`, você pode fazer validações sequenciais no topo do loop, mantendo o código principal no nível base de indentação.

**3. Tratamento de Casos Especiais:** Quando certos valores em uma coleção requerem tratamento especial (como pular zeros em cálculos matemáticos ou ignorar strings vazias em processamento de texto), `continue` oferece uma saída limpa.

**4. Validação de Entrada em Loops Interativos:** Em loops que coletam entrada do usuário, `continue` permite solicitar nova entrada quando a anterior é inválida, sem sair do loop de coleta.

**5. Otimização de Processamento Condicional:** Similar ao `break`, mas em escala menor - ao invés de processar todos os elementos e depois verificar se deveriam ter sido processados, você descarta os indesejados logo no início.

**6. Implementação de Filtros:** É a base conceitual para operações de filtro - processar apenas elementos que passam por critérios específicos, ignorando os demais.

### Importância no Ecossistema Java

O `continue` é uma palavra-chave fundamental que complementa o arsenal de controle de fluxo de Java. Sua importância vai além da sintaxe:

- **Legibilidade de Código:** Permite escrever código com menos níveis de aninhamento, seguindo o princípio de "guard clauses" - validar e descartar casos inválidos cedo.

- **Padrão Guard Clause:** É a implementação prática do padrão "fail fast" em loops - verifique condições de exclusão no início e descarte o item rapidamente, deixando o código principal limpo.

- **Filtragem Imperativa:** Antes da programação funcional e Streams, `continue` era a forma primária de filtrar elementos durante iteração.

- **Clareza de Intenção:** Torna explícito que certos itens devem ser ignorados, ao invés de envolvê-los em condicionais negativas complexas.

- **Complementaridade com Break:** Juntos, `break` e `continue` oferecem controle granular sobre loops - terminar completamente ou pular seletivamente.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Interrupção Parcial:** Continue interrompe apenas a iteração atual, não o loop inteiro.

2. **Continuidade do Loop:** Após o `continue`, o loop não termina - a condição é reavaliada e, se verdadeira, a próxima iteração começa.

3. **Transferência de Controle:** O fluxo salta para o **final do corpo do loop**, onde, no caso de `for`, o incremento ocorre, e então a condição é reavaliada.

4. **Escopo de Atuação:** Por padrão, afeta apenas o loop imediatamente circundante. Com labels, pode afetar loops externos.

5. **Uso em Filtragem:** Fundamental para implementar lógica de "processar apenas elementos que atendem critério X".

### Pilares Fundamentais

- **Palavra-Chave Reservada:** `continue` é reservada e não pode ser usada como identificador.

- **Instrução de Salto:** Pertence à categoria de "jump statements", mas diferente de `break`, não sai da estrutura.

- **Fluxo de Volta ao Início:** Após `continue`, a execução retorna ao ponto de verificação da condição do loop (após executar incremento em `for`).

- **Sintaxe Simples:** Forma básica é apenas `continue;`

- **Extensão com Labels:** Pode especificar qual loop em aninhamento deve ter iteração pulada: `continue nomeDoLabel;`

### Visão Geral das Nuances

- **Continue vs Break:** `continue` pula iteração; `break` termina loop.

- **Continue em Diferentes Loops:** Comportamento ligeiramente diferente em `for`, `while`, e `do-while` em relação ao que é executado após o continue.

- **Código Após Continue:** Qualquer código após `continue` no mesmo bloco é inalcançável, gerando warning de compilação.

- **Continue em Loops Aninhados:** Sem labels, só afeta o loop mais interno.

- **Padrão Guard Clause:** Continue permite implementar validações no início do loop, mantendo o código principal limpo.

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Para compreender o `continue` profundamente, é essencial visualizar o que acontece quando essa instrução é encontrada durante a execução.

#### O Fluxo Normal de um Loop

Em um loop normal sem `continue`:

1. **Avaliação da Condição:** Verificar se o loop deve continuar.
2. **Execução do Corpo:** Executar todas as instruções no corpo do loop sequencialmente.
3. **Atualização:** Em `for`, executar a expressão de incremento.
4. **Retorno:** Voltar à avaliação da condição.

#### Interrupção com Continue

Quando `continue` é executado:

1. **Interrupção Imediata:** O resto do corpo do loop é pulado instantaneamente.
2. **Ir para Atualização/Condição:**
   - Em `for`: Executa a expressão de incremento, depois reavalia a condição.
   - Em `while/do-while`: Vai direto para reavaliação da condição.
3. **Próxima Iteração ou Fim:** Se a condição ainda é verdadeira, inicia próxima iteração; se falsa, termina o loop.

#### Diferenças Entre Tipos de Loop

**Em Loop For:**
```java
for (int i = 0; i < 10; i++) { // i++ ainda executa após continue
    if (i % 2 == 0) {
        continue; // Pula iteração, mas i++ ocorre
    }
    System.out.println(i);
}
```

Após `continue`, a expressão `i++` ainda é executada antes de reavaliar `i < 10`.

**Em Loop While:**
```java
int i = 0;
while (i < 10) {
    if (i % 2 == 0) {
        i++; // CRUCIAL: deve incrementar ANTES do continue
        continue;
    }
    System.out.println(i);
    i++;
}
```

Aqui, você deve manualmente garantir que o contador seja incrementado antes do `continue`, caso contrário pode criar loop infinito.

#### Nível de Bytecode

No nível de bytecode da JVM, `continue` é implementado como um `goto` que salta para o ponto do loop onde a condição é reavaliada (ou onde o incremento ocorre em `for`). É essencialmente um salto para trás, em contraste com `break`, que é um salto para frente (após o loop).

### Princípios e Conceitos Subjacentes

#### 1. Filtragem Imperativa

O `continue` é a implementação imperativa do conceito de **filtro**:

- **Programação Funcional:** `lista.filter(elemento -> elemento.cumpreCriterio())`
- **Programação Imperativa:** Loop com `if (!elemento.cumpreCriterio()) continue;`

Ambos expressam "processar apenas elementos que atendem critério", mas em paradigmas diferentes.

#### 2. Guard Clauses (Cláusulas de Guarda)

O padrão de usar `continue` para validações no início do loop implementa o princípio de **guard clauses**:

```java
for (Usuario usuario : usuarios) {
    if (usuario == null) continue; // Guard 1
    if (!usuario.isAtivo()) continue; // Guard 2
    if (usuario.getIdade() < 18) continue; // Guard 3

    // Código principal aqui, sem aninhamento
    processarUsuario(usuario);
}
```

Este padrão reduz complexidade ciclomática e aninhamento, tornando o código mais legível.

#### 3. Inversão de Lógica

`continue` permite **inverter a lógica condicional** de positiva para negativa:

**Sem continue (lógica positiva):**
```java
for (int numero : numeros) {
    if (numero > 0 && numero < 100 && numero % 2 == 0) {
        // Processamento
        System.out.println(numero);
    }
}
```

**Com continue (lógica negativa):**
```java
for (int numero : numeros) {
    if (numero <= 0) continue;
    if (numero >= 100) continue;
    if (numero % 2 != 0) continue;

    // Processamento - menos indentado
    System.out.println(numero);
}
```

A segunda versão é mais legível quando há múltiplas condições ou quando o processamento é extenso.

### Relação com Outros Conceitos da Linguagem

#### Relação com Break

`continue` e `break` são complementares mas opostos:

- **break:** "Terminei com todo o loop"
- **continue:** "Terminei com este item, próximo por favor"

Ambos interrompem o fluxo sequencial, mas `break` sai da estrutura enquanto `continue` permanece nela.

#### Relação com If-Else

`continue` pode substituir `else` em certas situações:

**Com else:**
```java
for (String palavra : palavras) {
    if (palavra.length() > 5) {
        System.out.println(palavra);
    } else {
        // else implícito - nada acontece
    }
}
```

**Com continue:**
```java
for (String palavra : palavras) {
    if (palavra.length() <= 5) continue;
    System.out.println(palavra);
}
```

O padrão com `continue` é mais limpo quando a condição de exclusão é simples.

#### Relação com Streams e Filter

Em Java 8+, Streams oferecem operação `filter` que é o equivalente funcional de `continue`:

**Imperativo com continue:**
```java
for (int numero : numeros) {
    if (numero < 0) continue;
    System.out.println(numero);
}
```

**Funcional com filter:**
```java
numeros.stream()
    .filter(numero -> numero >= 0)
    .forEach(System.out::println);
```

Ambos expressam "processar apenas números não-negativos", mas em paradigmas diferentes.

### Modelo Mental para Compreensão

#### O Modelo da "Fila de Atendimento"

Imagine uma fila de clientes sendo atendidos:

- **Sem continue:** Você atende todos os clientes, mesmo os que não têm documentos necessários (desperdiça tempo).
- **Com continue:** Você verifica rapidamente se o cliente tem o necessário. Se não, pede para ele sair da fila e chama o próximo (eficiente).

#### O Modelo de "Filtro de Café"

Pense no `continue` como um filtro de café:

- **Elementos do Loop:** Grãos de café (alguns bons, alguns ruins)
- **Continue:** O filtro que deixa passar apenas os bons
- **Código Após Continue:** A xícara que recebe apenas café filtrado

Grãos ruins (que ativam `continue`) são descartados; apenas os bons passam para processamento.

#### O Modelo de "Playlist"

Visualize um player de música com playlist:

- **Loop:** Tocar todas as músicas da playlist
- **Continue:** Botão "próxima música" - pula a atual, mas não para de tocar
- **Break:** Botão "parar" - para completamente

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

#### Forma Mais Simples

```java
continue;
```

Apenas a palavra-chave seguida de ponto e vírgula.

#### Uso em Loop For

```java
// Imprimir apenas números ímpares
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue; // Pula números pares
    }
    System.out.println(i); // Só executa para ímpares
}
// Saída: 1, 3, 5, 7, 9
```

**Análise conceitual:** A cada iteração, se `i` é par, `continue` pula o `println`, mas o loop continua. O `i++` do `for` ainda executa, garantindo progressão do contador.

#### Uso em Loop While

```java
// Processar apenas valores positivos
int i = -5;
while (i <= 5) {
    i++; // Incrementar ANTES do continue
    if (i <= 0) {
        continue; // Pula valores não-positivos
    }
    System.out.println("Processando: " + i);
}
```

**Análise conceitual:** No `while`, é **crucial** incrementar o contador antes do `continue`, caso contrário o loop pode ficar infinito. Se `i` fosse incrementado após o `continue`, quando `i <= 0`, o `continue` pularia o incremento, travando o loop.

#### Uso em Loop Do-While

```java
// Validação de entrada com continue
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);
int numero;

do {
    System.out.print("Digite um número positivo: ");
    numero = scanner.nextInt();

    if (numero <= 0) {
        System.out.println("Número inválido!");
        continue; // Pede novo número
    }

    // Processar número válido
    System.out.println("Você digitou: " + numero);

} while (numero != -999); // Sentinela para sair
```

**Análise conceitual:** No `do-while`, `continue` pula para a verificação da condição no fim do loop. Isso é útil para validação de entrada onde você quer repetir a solicitação sem processar entradas inválidas.

### Mergulho Teórico em Cada Aspecto

#### 1. Filtragem de Elementos em Arrays

**Conceito:** Processar apenas elementos que atendem critérios específicos, ignorando os demais.

```java
// Processar apenas strings não vazias
String[] palavras = {"hello", "", "world", null, "java", ""};

for (String palavra : palavras) {
    if (palavra == null || palavra.isEmpty()) {
        continue; // Pular strings vazias ou nulas
    }

    // Processar apenas palavras válidas
    String processada = palavra.toUpperCase();
    System.out.println(processada);
}
// Saída: HELLO, WORLD, JAVA
```

**Explicação profunda:**

As guard clauses no início (`if (palavra == null || palavra.isEmpty())`) filtram elementos inválidos. Sem `continue`, seria necessário:

```java
for (String palavra : palavras) {
    if (palavra != null && !palavra.isEmpty()) {
        String processada = palavra.toUpperCase();
        System.out.println(processada);
    }
}
```

Essa versão funciona, mas envolve todo o código de processamento em um `if`. Para processamento complexo, isso aumenta o nível de aninhamento. A versão com `continue` mantém o código principal no nível base de indentação, melhorando legibilidade.

**Princípio:** "Valide e rejeite cedo, processe depois" - conhecido como **early return** ou **guard clause** pattern.

#### 2. Somar Apenas Valores Válidos

**Conceito:** Acumular apenas valores que atendem critérios, ignorando outliers ou valores inválidos.

```java
// Somar apenas números entre 1 e 100
int[] numeros = {5, 150, 23, -10, 87, 200, 45};
int soma = 0;

for (int numero : numeros) {
    if (numero < 1 || numero > 100) {
        continue; // Ignorar números fora do intervalo
    }
    soma += numero;
}

System.out.println("Soma dos válidos: " + soma); // 5 + 23 + 87 + 45 = 160
```

**Explicação profunda:**

Este padrão é comum em **processamento de dados com outliers**. Dados reais frequentemente contêm valores inválidos ou fora de faixas esperadas. O `continue` permite filtrar esses valores de forma limpa durante a acumulação.

**Alternativa sem continue:**
```java
for (int numero : numeros) {
    if (numero >= 1 && numero <= 100) {
        soma += numero;
    }
}
```

Ambas funcionam, mas quando há múltiplas condições de exclusão, a versão com `continue` escala melhor:

```java
for (Pedido pedido : pedidos) {
    if (pedido == null) continue;
    if (pedido.isCancelado()) continue;
    if (pedido.getValor() <= 0) continue;
    if (!pedido.isPago()) continue;

    totalVendas += pedido.getValor(); // Código principal limpo
}
```

Versus:

```java
for (Pedido pedido : pedidos) {
    if (pedido != null && !pedido.isCancelado() &&
        pedido.getValor() > 0 && pedido.isPago()) {
        totalVendas += pedido.getValor();
    } // Condição complexa, hard to read
}
```

#### 3. Pular Divisores em Cálculos Matemáticos

**Conceito:** Em cálculos que envolvem divisão, pular divisores que causariam erro (como zero).

```java
// Calcular médias, pulando zeros
double[] valores = {10.5, 0, 20.3, 0, 15.7, 30.2};
double somaDivisoes = 0;
int countValidos = 0;

for (double valor : valores) {
    if (valor == 0) {
        continue; // Pular zeros para evitar divisão por zero
    }

    somaDivisoes += 100 / valor;
    countValidos++;
}

double media = somaDivisoes / countValidos;
System.out.println("Média: " + media);
```

**Explicação profunda:**

Aqui, `continue` serve como **proteção contra operações inválidas**. Dividir por zero causaria `ArithmeticException` (para inteiros) ou `Infinity` (para doubles). O `continue` descarta esses valores problemáticos logo no início, garantindo que o cálculo proceda apenas com valores válidos.

Este é um exemplo do princípio de **defensive programming** - proteger o código contra entradas que causariam erros ou resultados inválidos.

#### 4. Continue em Loops Aninhados (Sem Labels)

**Conceito:** Em loops aninhados, `continue` sem label afeta apenas o loop mais interno.

```java
// Imprimir matriz, pulando elementos negativos
int[][] matriz = {
    {1, -2, 3},
    {4, 5, -6},
    {-7, 8, 9}
};

for (int i = 0; i < matriz.length; i++) {
    System.out.print("Linha " + i + ": ");

    for (int j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] < 0) {
            continue; // Pula apenas este elemento, não a linha
        }
        System.out.print(matriz[i][j] + " ");
    }

    System.out.println(); // Nova linha após cada linha da matriz
}
```

**Saída:**
```
Linha 0: 1 3
Linha 1: 4 5
Linha 2: 8 9
```

**Explicação profunda:**

O `continue` no loop interno pula apenas o elemento negativo atual, mas o loop interno continua com os próximos elementos da mesma linha. O loop externo não é afetado - todas as linhas são processadas.

**Escopo de influência:** Cada `continue` só conhece seu loop imediatamente circundante. Isso é o princípio de **localidade** - comportamento é previsível e limitado ao contexto imediato.

#### 5. Validação Múltipla com Continue

**Conceito:** Aplicar múltiplas validações sequencialmente, descartando elementos que falham em qualquer validação.

```java
// Processar usuários válidos
for (Usuario usuario : usuarios) {
    // Validação 1: Não nulo
    if (usuario == null) {
        System.out.println("Usuário nulo ignorado");
        continue;
    }

    // Validação 2: Ativo
    if (!usuario.isAtivo()) {
        System.out.println("Usuário inativo: " + usuario.getNome());
        continue;
    }

    // Validação 3: Maior de idade
    if (usuario.getIdade() < 18) {
        System.out.println("Usuário menor de idade: " + usuario.getNome());
        continue;
    }

    // Validação 4: Email válido
    if (!usuario.hasEmailValido()) {
        System.out.println("Email inválido: " + usuario.getNome());
        continue;
    }

    // Código principal - só executa se todas validações passarem
    enviarNotificacao(usuario);
    System.out.println("Notificação enviada para: " + usuario.getNome());
}
```

**Explicação profunda:**

Este padrão demonstra **validação em cascata** - cada `continue` representa um ponto de saída precoce para um caso inválido. As vantagens:

1. **Baixa Complexidade Ciclomática:** Cada validação é uma decisão simples (if + continue), não um if aninhado.

2. **Legibilidade:** Fica claro quais condições descartam um elemento e por quê.

3. **Manutenibilidade:** Adicionar nova validação é simples - apenas mais um par if+continue.

4. **Depuração:** Cada validação pode ter mensagem específica, facilitando diagnóstico.

**Alternativa sem continue (aninhamento profundo):**
```java
for (Usuario usuario : usuarios) {
    if (usuario != null) {
        if (usuario.isAtivo()) {
            if (usuario.getIdade() >= 18) {
                if (usuario.hasEmailValido()) {
                    // Código principal aqui, com 4 níveis de indentação!
                    enviarNotificacao(usuario);
                }
            }
        }
    }
}
```

A versão aninhada tem **complexidade visual** muito maior e é mais difícil de manter.

### Diferenças Conceituais Entre Variações

#### Continue em For vs While

**Em For:**
- Expressão de incremento (`i++`) ainda executa após `continue`
- Menos propensa a loops infinitos acidentais
- Estrutura mais previsível

**Em While:**
- Incremento manual necessário antes do `continue`
- Maior risco de loop infinito se esquecer incremento
- Mais flexível para lógicas complexas de atualização

#### Continue Simples vs Continue com Label

**Continue Simples:**
```java
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (j == 2) continue; // Pula apenas iteração do loop interno
    }
}
```

**Continue com Label:**
```java
externo:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (j == 2) continue externo; // Pula iteração do loop externo
    }
}
```

A versão com label permite controlar qual loop tem iteração pulada, atravessando camadas de aninhamento.

### Implicações e Consequências

#### Consequência 1: Código Após Continue é Inalcançável

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        continue;
        System.out.println("Isto nunca executa"); // Erro: unreachable code
    }
}
```

O compilador detecta e rejeita código inalcançável após `continue` no mesmo bloco.

#### Consequência 2: Loop Infinito em While Mal Estruturado

```java
int i = 0;
while (i < 10) {
    if (i % 2 == 0) {
        continue; // PERIGO: i nunca é incrementado!
    }
    System.out.println(i);
    i++; // Este incremento é pulado quando i é par
}
// Loop infinito quando i == 0!
```

**Correção:**
```java
int i = 0;
while (i < 10) {
    i++; // Incrementar ANTES do continue
    if (i % 2 == 0) {
        continue;
    }
    System.out.println(i);
}
```

Esta é uma armadilha clássica: em `while`, garantir que variáveis de controle sejam atualizadas antes de qualquer `continue`.

#### Consequência 3: Redução de Aninhamento

**Sem continue:**
```java
for (Item item : items) {
    if (item.isValid()) {
        if (item.isAvailable()) {
            if (item.getPrice() > 0) {
                // Processamento com 3 níveis de indentação
                process(item);
            }
        }
    }
}
```

**Com continue:**
```java
for (Item item : items) {
    if (!item.isValid()) continue;
    if (!item.isAvailable()) continue;
    if (item.getPrice() <= 0) continue;

    // Processamento no nível base
    process(item);
}
```

A segunda versão segue o princípio de **flat is better than nested** do Zen of Python, aplicável também a Java.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Continue

**Resposta geral:** Use `continue` quando precisar processar seletivamente elementos de uma coleção, ignorando aqueles que não atendem a critérios específicos, mantendo o loop ativo para processar os demais.

### Cenários Ideais e Raciocínio

#### 1. Filtragem Durante Iteração

**Contexto:** Processar apenas elementos que atendem a condições específicas, descartando os demais.

**Por que funciona bem:** `continue` permite expressar "ignorar este, seguir com o próximo" de forma clara e concisa.

**Raciocínio:** Quando nem todos os elementos devem ser processados, filtrar com `continue` no início do loop é mais legível que envolver todo o processamento em um `if`.

#### 2. Validação Múltipla (Guard Clauses)

**Contexto:** Elementos devem passar por várias validações antes do processamento principal.

**Por que funciona bem:** Cada validação pode ter seu próprio `if + continue`, mantendo validações separadas e código principal limpo.

**Raciocínio:** Validações sequenciais com saída precoce reduzem complexidade ciclomática e aninhamento, melhorando manutenibilidade.

#### 3. Pular Valores Especiais

**Contexto:** Em cálculos matemáticos, pular valores que causariam erros (zeros em divisões, negativos em raízes, etc).

**Por que funciona bem:** `continue` serve como proteção, descartando valores problemáticos antes que causem exceções.

**Raciocínio:** Defensive programming - proteger código contra entradas que levariam a erros ou resultados inválidos.

#### 4. Processamento de Dados com Outliers

**Contexto:** Dados reais contêm valores anômalos que devem ser excluídos de análises.

**Por que funciona bem:** `continue` permite filtrar outliers durante acumulação/processamento, sem necessidade de pré-processamento.

**Raciocínio:** Processar e filtrar em uma única passada é mais eficiente que múltiplas passadas (uma para filtrar, outra para processar).

### Padrões Conceituais e Filosofias de Uso

#### Padrão 1: Guard Clause em Loops

```java
for (Transacao transacao : transacoes) {
    // Guards no topo
    if (transacao == null) continue;
    if (transacao.isCancelada()) continue;
    if (transacao.getValor() <= 0) continue;

    // Lógica principal limpa
    processarTransacao(transacao);
}
```

**Filosofia:** Validar e rejeitar cedo, deixando o caminho feliz (happy path) limpo e óbvio.

#### Padrão 2: Filtragem Complexa

```java
for (Produto produto : produtos) {
    // Filtro composto
    boolean naoDisponivel = !produto.isDisponivel();
    boolean semEstoque = produto.getEstoque() <= 0;
    boolean precoInvalido = produto.getPreco() <= 0;

    if (naoDisponivel || semEstoque || precoInvalido) {
        continue; // Pular produtos não processáveis
    }

    adicionarAoCarrinho(produto);
}
```

**Filosofia:** Quando múltiplas condições determinam exclusão, agrupe-as logicamente e use `continue` para clareza.

#### Padrão 3: Processamento Seletivo com Logging

```java
for (Usuario usuario : usuarios) {
    if (!usuario.aceitouTermos()) {
        logger.info("Usuário {} não aceitou termos", usuario.getId());
        continue;
    }

    if (!usuario.verificouEmail()) {
        logger.info("Usuário {} não verificou email", usuario.getId());
        continue;
    }

    // Processar apenas usuários completamente configurados
    enviarNewsletterSemanal(usuario);
}
```

**Filosofia:** Cada `continue` pode ter efeito colateral (logging, métricas) antes de pular, tornando o motivo da exclusão rastreável.

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais e de Uso

#### 1. Continue Só Funciona em Loops

**Limitação:** `continue` só pode ser usado dentro de estruturas de repetição. Usá-lo fora resulta em erro de compilação.

```java
if (condicao) {
    continue; // ERRO: "continue outside of loop"
}
```

**Por que existe:** `continue` significa "pular para próxima iteração", conceito que só existe em loops.

#### 2. Risco de Loop Infinito em While

**Limitação:** Em `while`, esquecer de atualizar variáveis de controle antes de `continue` pode causar loop infinito.

**Por que existe:** Diferentemente de `for`, onde a atualização é automática, `while` requer atualização manual.

#### 3. Continue Não Retorna Valores

**Limitação:** `continue` apenas pula iteração, não pode retornar valores ou afetar estado fora do loop diretamente.

**Por que existe:** `continue` é controle de fluxo, não operação de dados. Para afetar estado, use variáveis acumuladoras.

### Trade-offs e Compromissos

#### Trade-off 1: Continue vs If Aninhado

**Continue:**
- Menos aninhamento
- Código principal no nível base
- Mais pontos de saída no loop

**If Aninhado:**
- Estrutura mais tradicional
- Fluxo linear único
- Pode ter aninhamento profundo

**Compromisso:** Para 1-2 condições, ambos são ok. Para 3+, continue é mais legível.

#### Trade-off 2: Continue vs Filter (Streams)

**Continue (Imperativo):**
```java
for (int n : numeros) {
    if (n < 0) continue;
    processar(n);
}
```

**Filter (Funcional):**
```java
numeros.stream()
    .filter(n -> n >= 0)
    .forEach(this::processar);
```

**Compromisso:** Streams são mais declarativos mas têm overhead. Para loops simples, continue é mais performático.

### Armadilhas Comuns

#### Armadilha 1: Esquecer Incremento Antes de Continue em While

```java
int i = 0;
while (i < 10) {
    if (i % 2 == 0) {
        continue; // BUG: i nunca incrementa quando par!
    }
    System.out.println(i);
    i++;
}
// Loop infinito!
```

**Solução:** Sempre incremente antes de qualquer `continue` em `while`.

#### Armadilha 2: Continue em Loop Errado (Aninhamento)

```java
for (int i = 0; i < linhas; i++) {
    for (int j = 0; j < colunas; j++) {
        if (matriz[i][j] == 0) {
            continue; // Só pula elemento, não a linha inteira
        }
        processar(matriz[i][j]);
    }
}
```

Se a intenção era pular a linha inteira ao encontrar zero, `continue` simples não funciona - apenas pula o elemento zero.

#### Armadilha 3: Usar Continue Quando Break É Apropriado

```java
boolean encontrado = false;
for (int i = 0; i < 1000000; i++) {
    if (array[i] == procurado) {
        encontrado = true;
        continue; // INEFICIENTE: deveria usar break!
    }
}
```

Aqui, `continue` faz o loop percorrer TODOS os elementos mesmo após encontrar. Deveria ser `break`.

---

## 🔗 Interconexões Conceituais

### Relação com Break

- **continue:** Pula iteração atual, loop continua
- **break:** Termina loop completamente

Complementares - oferecem controle fino sobre fluxo de loops.

### Relação com Filter (Streams)

`continue` é o equivalente imperativo de `filter()`:

```java
// Imperativo
for (String s : lista) {
    if (s.length() < 5) continue;
    processar(s);
}

// Funcional
lista.stream()
    .filter(s -> s.length() >= 5)
    .forEach(this::processar);
```

### Relação com Guard Clauses

Continue em loops implementa o padrão guard clause:

```java
// Guard clause em método
public void processar(Objeto obj) {
    if (obj == null) return; // Guard
    // Lógica principal
}

// Guard clause em loop
for (Objeto obj : objetos) {
    if (obj == null) continue; // Guard
    // Lógica principal
}
```

### Dependências Conceituais

Para dominar `continue`:
1. Entender estruturas de repetição
2. Compreender escopo e blocos
3. Conhecer fluxo de controle
4. Entender a diferença entre validação positiva vs negativa

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

Após dominar `continue`:
1. **Labels com Continue:** Pular iterações de loops externos
2. **Combinação Break + Continue:** Usar ambos estrategicamente
3. **Programação Funcional:** Substituir continue por filter() em Streams
4. **Padrões de Filtragem:** Aplicar continue em algoritmos reais

### Conceitos Que Se Constroem

**Streams e Filter:** A evolução funcional de continue:
```java
lista.stream()
    .filter(criterio)  // Equivalente a "if (!criterio) continue"
    .forEach(this::processar);
```

**Pattern Matching:** Java futuro pode simplificar validações que hoje usam continue.

**Labels:** Expandir continue para loops aninhados.

---

## 📚 Conclusão

A palavra-chave `continue` é uma ferramenta essencial para **processamento seletivo** em loops - permitindo filtrar elementos durante iteração de forma limpa e eficiente. Representa o princípio de "ignorar o irrelevante e processar apenas o que importa", fundamental em manipulação de coleções e dados.

Dominar `continue` significa:
- Saber quando pular iterações é mais legível que aninhar ifs
- Entender como evitar loops infinitos em while
- Aplicar guard clauses para reduzir complexidade
- Reconhecer quando break seria mais apropriado

Investir em compreender `continue` profundamente é investir em código mais limpo, legível e eficiente - habilidades que permeiam toda a programação Java.
