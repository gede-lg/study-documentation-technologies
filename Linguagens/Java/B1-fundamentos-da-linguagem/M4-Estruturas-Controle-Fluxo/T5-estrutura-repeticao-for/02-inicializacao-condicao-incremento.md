# Inicialização, Condição e Incremento

## 🎯 Introdução e Definição

### Definição Conceitual

**Inicialização, condição e incremento** são os **três componentes fundamentais** da estrutura **for tradicional**, formando a **anatomia** do loop. A **inicialização** define o **estado inicial** (geralmente contador), a **condição** determina **quando o loop continua** (expressão booleana), e o **incremento** modifica **variáveis de controle** ao final de cada iteração. Esses três elementos, separados por **ponto-e-vírgula** (`;`), formam o **header** do for.

**Estrutura visual**:
```java
for (inicialização; condição; incremento) {
     // ^^^^^^^^^^^^  ^^^^^^^^  ^^^^^^^^^^
     //     1º           2º         3º
     //  Executa     Testa       Executa
     //  UMA VEZ     ANTES       APÓS
     //             de CADA     CADA
     //            iteração   iteração
    
    // Corpo do loop (executa se condição true)
}
```

**Ordem de execução**:
1. **Inicialização** (executa UMA VEZ no início)
2. **Condição** (testa ANTES de cada iteração)
3. Se condição `true`: executa **corpo**
4. **Incremento** (executa APÓS corpo)
5. Volta ao passo 2 (testa condição novamente)
6. Se condição `false`: sai do loop

**Exemplo fundamental**:
```java
//       1º        2º       3º
//       ↓         ↓        ↓
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// Execução passo a passo:
// 1. int i = 0          (inicialização: i = 0)
// 2. i < 5?  0 < 5? true  → corpo (imprime 0)
// 3. i++               (incremento: i = 1)
// 4. i < 5?  1 < 5? true  → corpo (imprime 1)
// 5. i++               (incremento: i = 2)
// 6. i < 5?  2 < 5? true  → corpo (imprime 2)
// 7. i++               (incremento: i = 3)
// 8. i < 5?  3 < 5? true  → corpo (imprime 3)
// 9. i++               (incremento: i = 4)
// 10. i < 5?  4 < 5? true  → corpo (imprime 4)
// 11. i++              (incremento: i = 5)
// 12. i < 5?  5 < 5? false → SAIR
```

---

## 📋 Sumário Conceitual

### Componentes do for

| Componente | Sintaxe | Executa | Propósito |
|------------|---------|---------|-----------|
| **Inicialização** | `int i = 0` | 1 vez (início) | Define estado inicial |
| **Condição** | `i < 5` | Antes de cada iteração | Testa se continua |
| **Incremento** | `i++` | Após cada iteração | Modifica variável |

### Separadores

- **Ponto-e-vírgula** (`;`): Separa os três componentes
- **Parênteses** `()`: Envolvem o header completo
- **Chaves** `{}`: Envolvem o corpo (opcional para 1 instrução)

---

## 🧠 Fundamentos Teóricos

### 1. Inicialização

**Definição**: Declaração e/ou atribuição inicial de **variáveis de controle**, executada **UMA ÚNICA VEZ** no início do for.

**Sintaxes válidas**:
```java
// 1. Declaração + inicialização (MAIS COMUM)
for (int i = 0; ...; ...) { }

// 2. Apenas inicialização (variável já declarada)
int i;
for (i = 0; ...; ...) { }

// 3. Múltiplas inicializações (mesmo tipo)
for (int i = 0, j = 10; ...; ...) { }

// 4. Sem inicialização (válido mas raro)
for (; ...; ...) { }
```

**Escopo da variável**:
```java
// Variável declarada no for: escopo LOCAL ao for
for (int i = 0; i < 5; i++) {
    System.out.println(i);  // OK
}
System.out.println(i);  // ERRO: i não existe aqui

// Variável declarada fora: escopo EXTERNO
int i;
for (i = 0; i < 5; i++) {
    System.out.println(i);  // OK
}
System.out.println(i);  // OK: i = 5 (valor após loop)
```

**Tipos comuns**:
```java
// int (MAIS COMUM)
for (int i = 0; i < 10; i++) { }

// long
for (long l = 0L; l < 1000000000L; l++) { }

// char
for (char c = 'a'; c <= 'z'; c++) { }

// double (menos comum em loops)
for (double d = 0.0; d < 1.0; d += 0.1) { }

// Objeto
for (Iterator<String> it = lista.iterator(); it.hasNext(); ) {
    String s = it.next();
}
```

**Convenções**:
- Nome de variável: `i`, `j`, `k` (loops simples)
- Nomes descritivos: `indice`, `linha`, `coluna` (código complexo)
- Inicialização mais comum: `i = 0` (arrays/listas começam em 0)

### 2. Condição

**Definição**: Expressão **booleana** testada **ANTES** de cada iteração. Se `true`, executa corpo; se `false`, **sai do loop**.

**Sintaxes válidas**:
```java
// 1. Comparação simples (MAIS COMUM)
for (int i = 0; i < 10; i++) { }  // Menor que

// 2. Menor ou igual
for (int i = 0; i <= 9; i++) { }  // Equivalente a i < 10

// 3. Maior que (contagem regressiva)
for (int i = 10; i > 0; i--) { }

// 4. Diferente de
for (int i = 0; i != 10; i++) { }

// 5. Condição complexa
for (int i = 0; i < arr.length && arr[i] != null; i++) { }

// 6. Loop infinito (sem condição = true)
for (int i = 0; ; i++) { }  // Equivale a while(true)
```

**Momento da avaliação**:
```java
for (int i = 0; i < 5; i++) {
    // Condição testada ANTES de entrar aqui
    System.out.println(i);
    // Não testa condição aqui
}
// Condição testada novamente antes de próxima iteração
```

**Condição falsa desde o início**:
```java
for (int i = 10; i < 5; i++) {
    System.out.println("Nunca executa");
}
// Corpo não executa nenhuma vez (condição já é false)
```

**Variáveis na condição**:
```java
// Usar variável de controle
for (int i = 0; i < 10; i++) { }

// Usar propriedade de objeto
for (int i = 0; i < lista.size(); i++) { }

// ATENÇÃO: size() calculado a cada iteração (considere cache)
int tamanho = lista.size();
for (int i = 0; i < tamanho; i++) { }  // Mais eficiente
```

**Comparação com array/lista**:
```java
int[] arr = {10, 20, 30};

// array.length: propriedade (sem parênteses)
for (int i = 0; i < arr.length; i++) { }

// lista.size(): método (com parênteses)
for (int i = 0; i < lista.size(); i++) { }
```

### 3. Incremento

**Definição**: Expressão executada **APÓS** cada iteração (após corpo), geralmente para **modificar** a variável de controle.

**Formas comuns**:
```java
// 1. Incremento de 1 (MAIS COMUM)
for (int i = 0; i < 10; i++) { }     // i++
for (int i = 0; i < 10; ++i) { }     // ++i (equivalente aqui)

// 2. Decremento de 1
for (int i = 10; i > 0; i--) { }     // i--
for (int i = 10; i > 0; --i) { }     // --i

// 3. Incremento customizado
for (int i = 0; i < 10; i += 2) { }  // Pares: 0, 2, 4, 6, 8
for (int i = 0; i < 10; i += 3) { }  // 0, 3, 6, 9

// 4. Decremento customizado
for (int i = 10; i > 0; i -= 2) { }  // 10, 8, 6, 4, 2

// 5. Multiplicação/divisão (raro)
for (int i = 1; i < 1000; i *= 2) { }  // 1, 2, 4, 8, 16, 32...

// 6. Múltiplas expressões (separadas por vírgula)
for (int i = 0, j = 10; i < j; i++, j--) { }

// 7. Sem incremento (atualização no corpo)
for (int i = 0; i < 10; ) {
    System.out.println(i);
    i++;  // Incremento manual
}
```

**i++ vs ++i no incremento**:
```java
// No incremento do for: SEM DIFERENÇA (valor não usado)
for (int i = 0; i < 10; i++) { }   // OK
for (int i = 0; i < 10; ++i) { }   // OK (equivalente)

// Diferença só importa quando valor é usado:
int i = 0;
int a = i++;  // a = 0, i = 1 (pós-incremento: usa depois incrementa)
int b = ++i;  // b = 2, i = 2 (pré-incremento: incrementa depois usa)
```

**Incremento no corpo vs no header**:
```java
// Incremento no header (PREFERÍVEL: mais claro)
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// Incremento no corpo (menos comum)
for (int i = 0; i < 10; ) {
    System.out.println(i);
    i++;  // Menos óbvio
}
```

**Modificação da variável de controle no corpo**:
```java
// ⚠️ Cuidado: modificar i no corpo E no incremento
for (int i = 0; i < 10; i++) {
    System.out.println(i);
    i++;  // i incrementa 2 vezes: 0, 2, 4, 6, 8
}

// Recomendação: evite modificar no corpo se já tem incremento
```

### 4. Execução Passo a Passo

**Loop simples**:
```java
for (int i = 0; i < 3; i++) {
    System.out.println("i = " + i);
}

// Execução detalhada:
// PASSO 1: int i = 0          (inicialização)
// PASSO 2: i < 3? 0 < 3? true
// PASSO 3:   System.out.println("i = 0")
// PASSO 4: i++                (i = 1)
// PASSO 5: i < 3? 1 < 3? true
// PASSO 6:   System.out.println("i = 1")
// PASSO 7: i++                (i = 2)
// PASSO 8: i < 3? 2 < 3? true
// PASSO 9:   System.out.println("i = 2")
// PASSO 10: i++               (i = 3)
// PASSO 11: i < 3? 3 < 3? false → SAIR

// Saída:
// i = 0
// i = 1
// i = 2
```

**Contagem regressiva**:
```java
for (int i = 3; i > 0; i--) {
    System.out.println(i);
}

// Execução:
// int i = 3
// i > 0? 3 > 0? true → imprime 3 → i-- (i = 2)
// i > 0? 2 > 0? true → imprime 2 → i-- (i = 1)
// i > 0? 1 > 0? true → imprime 1 → i-- (i = 0)
// i > 0? 0 > 0? false → SAIR

// Saída:
// 3
// 2
// 1
```

**Step de 2**:
```java
for (int i = 0; i < 10; i += 2) {
    System.out.println(i);
}

// Execução:
// int i = 0
// i < 10? 0 < 10? true → imprime 0 → i += 2 (i = 2)
// i < 10? 2 < 10? true → imprime 2 → i += 2 (i = 4)
// i < 10? 4 < 10? true → imprime 4 → i += 2 (i = 6)
// i < 10? 6 < 10? true → imprime 6 → i += 2 (i = 8)
// i < 10? 8 < 10? true → imprime 8 → i += 2 (i = 10)
// i < 10? 10 < 10? false → SAIR

// Saída: 0 2 4 6 8
```

### 5. Iteração sobre Arrays

**Array de primitivos**:
```java
int[] numeros = {10, 20, 30, 40, 50};

// for tradicional: acesso por índice
for (int i = 0; i < numeros.length; i++) {
    System.out.println("numeros[" + i + "] = " + numeros[i]);
}

// Saída:
// numeros[0] = 10
// numeros[1] = 20
// numeros[2] = 30
// numeros[3] = 40
// numeros[4] = 50
```

**Array de objetos**:
```java
String[] nomes = {"Ana", "Bruno", "Carlos"};

for (int i = 0; i < nomes.length; i++) {
    System.out.println((i + 1) + "º: " + nomes[i]);
}

// Saída:
// 1º: Ana
// 2º: Bruno
// 3º: Carlos
```

**Modificação de array**:
```java
int[] valores = {1, 2, 3, 4, 5};

// Dobrar cada valor
for (int i = 0; i < valores.length; i++) {
    valores[i] = valores[i] * 2;
}

System.out.println(Arrays.toString(valores));
// Saída: [2, 4, 6, 8, 10]
```

### 6. Iteração sobre Listas

**ArrayList com get(i)**:
```java
List<String> frutas = Arrays.asList("Maçã", "Banana", "Laranja");

for (int i = 0; i < frutas.size(); i++) {
    String fruta = frutas.get(i);
    System.out.println(i + ": " + fruta);
}

// Saída:
// 0: Maçã
// 1: Banana
// 2: Laranja
```

**Cache de size() (otimização)**:
```java
List<Integer> numeros = // lista grande

// ⚠️ size() calculado a cada iteração
for (int i = 0; i < numeros.size(); i++) {
    processar(numeros.get(i));
}

// ✅ Cache do tamanho (pequena otimização)
int tamanho = numeros.size();
for (int i = 0; i < tamanho; i++) {
    processar(numeros.get(i));
}
// JVM geralmente otimiza isso, mas é boa prática
```

### 7. Índices Customizados

**Começar de 1**:
```java
// Ranking (começar de 1)
String[] competidores = {"João", "Maria", "Pedro"};

for (int i = 1; i <= competidores.length; i++) {
    System.out.println(i + "º lugar: " + competidores[i - 1]);
}

// Saída:
// 1º lugar: João
// 2º lugar: Maria
// 3º lugar: Pedro
```

**Índices pares/ímpares**:
```java
int[] arr = {10, 20, 30, 40, 50, 60};

// Apenas índices pares
for (int i = 0; i < arr.length; i += 2) {
    System.out.println("Índice par " + i + ": " + arr[i]);
}
// Saída: 0: 10, 2: 30, 4: 50

// Apenas índices ímpares
for (int i = 1; i < arr.length; i += 2) {
    System.out.println("Índice ímpar " + i + ": " + arr[i]);
}
// Saída: 1: 20, 3: 40, 5: 60
```

**Ao contrário**:
```java
String[] palavras = {"Java", "Python", "C++", "Ruby"};

// Último → Primeiro
for (int i = palavras.length - 1; i >= 0; i--) {
    System.out.println(palavras[i]);
}

// Saída: Ruby, C++, Python, Java
```

### 8. Condições Complexas

**Múltiplas condições**:
```java
int[] arr = {10, 20, 0, 30, 40};

// Iterar até encontrar 0 OU fim do array
for (int i = 0; i < arr.length && arr[i] != 0; i++) {
    System.out.println(arr[i]);
}

// Saída: 10, 20 (para quando encontra 0)
```

**Condição com método**:
```java
String texto = "Java é incrível";

// Percorrer até encontrar espaço
for (int i = 0; i < texto.length() && texto.charAt(i) != ' '; i++) {
    System.out.print(texto.charAt(i));
}

// Saída: Java
```

### 9. Incrementos Não Lineares

**Exponencial**:
```java
// Potências de 2
for (int i = 1; i < 1000; i *= 2) {
    System.out.println(i);
}

// Saída: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512
```

**Fibonacci (variação)**:
```java
// Dois contadores
for (int i = 0, j = 1; i < 100; ) {
    System.out.println(i);
    int temp = i + j;
    i = j;
    j = temp;
}

// Saída: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
```

### 10. Comparação: for vs while

**Equivalência**:
```java
// for
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// while equivalente
int i = 0;              // Inicialização
while (i < 5) {         // Condição
    System.out.println(i);
    i++;                // Incremento
}
```

**Quando usar cada um**:
- **for**: Número de iterações **conhecido** ou **contável** (índices, ranges)
- **while**: Número de iterações **desconhecido** (até condição, validação de entrada)

---

## 🔍 Análise Conceitual Profunda

### Filosofia do for

**Design**: for é **açúcar sintático** para while, organizando **inicialização**, **condição** e **incremento** em um só lugar.

**Vantagens**:
- Todos os componentes de controle **visíveis** no header
- Variável de controle com **escopo local** (se declarada no for)
- **Legibilidade**: clara intenção de loop contado

**Estrutura mental**:
```
for = "PARA cada valor de i DE 0 ATÉ n, faça..."
```

### Ordem de Avaliação

**Regra fundamental**:
1. **Inicialização**: UMA vez
2. **Condição → Corpo → Incremento**: Repetidamente
3. Condição testada **ANTES** de cada execução do corpo

**Implicação**: Se condição é `false` desde o início, corpo **nunca** executa.

---

## 🎯 Aplicabilidade e Contextos

### Cenário 1: Soma de Array

```java
int[] numeros = {10, 20, 30, 40, 50};
int soma = 0;

for (int i = 0; i < numeros.length; i++) {
    soma += numeros[i];
}

System.out.println("Soma: " + soma);  // 150
```

### Cenário 2: Busca em Array

```java
String[] nomes = {"Ana", "Bruno", "Carlos", "Diana"};
String procurado = "Carlos";
int indice = -1;

for (int i = 0; i < nomes.length; i++) {
    if (nomes[i].equals(procurado)) {
        indice = i;
        break;  // Encontrou, sai do loop
    }
}

if (indice != -1) {
    System.out.println("Encontrado no índice: " + indice);
} else {
    System.out.println("Não encontrado");
}
```

### Cenário 3: Contagem Regressiva

```java
// Lançamento de foguete
for (int i = 10; i > 0; i--) {
    System.out.println(i + "...");
    Thread.sleep(1000);  // 1 segundo
}
System.out.println("Lançamento!");
```

### Cenário 4: Tabela de Multiplicação

```java
int numero = 7;

for (int i = 1; i <= 10; i++) {
    System.out.println(numero + " x " + i + " = " + (numero * i));
}

// Saída:
// 7 x 1 = 7
// 7 x 2 = 14
// ...
// 7 x 10 = 70
```

### Cenário 5: Processamento de String

```java
String texto = "Java";

// Imprimir cada caractere
for (int i = 0; i < texto.length(); i++) {
    char c = texto.charAt(i);
    System.out.println("Posição " + i + ": " + c);
}

// Saída:
// Posição 0: J
// Posição 1: a
// Posição 2: v
// Posição 3: a
```

---

## ⚠️ Armadilhas Comuns

### 1. **Off-by-One Error**

```java
int[] arr = {1, 2, 3, 4, 5};

// ❌ i <= arr.length: ArrayIndexOutOfBoundsException
for (int i = 0; i <= arr.length; i++) {
    System.out.println(arr[i]);  // ERRO: arr[5] não existe
}

// ✅ i < arr.length
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);  // OK
}
```

### 2. **Condição Infinita**

```java
// ❌ i sempre < 10 (nunca incrementa)
for (int i = 0; i < 10; ) {
    System.out.println(i);
    // Faltou i++ aqui ou no incremento
}
// Loop infinito!

// ✅ Incremento no header
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

### 3. **Modificar Tamanho Durante Iteração**

```java
List<Integer> lista = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));

// ❌ size() muda durante loop
for (int i = 0; i < lista.size(); i++) {
    lista.remove(i);  // Remove e altera size()
}
// Comportamento imprevisível

// ✅ Cache tamanho ou itere ao contrário
int tamanho = lista.size();
for (int i = tamanho - 1; i >= 0; i--) {
    lista.remove(i);
}
```

### 4. **Vírgula vs Ponto-e-Vírgula**

```java
// ❌ Ponto-e-vírgula errado
for (int i = 0; i < 10; i++;) {  // ERRO: i++; não é válido
}

// ✅ Sem ponto-e-vírgula no incremento
for (int i = 0; i < 10; i++) {  // OK
}

// ✅ Vírgula para múltiplas inicializações
for (int i = 0, j = 10; i < j; i++, j--) {  // OK
}
```

### 5. **Escopo de Variável**

```java
// ❌ i não existe fora do for
for (int i = 0; i < 10; i++) {
    // ...
}
System.out.println(i);  // ERRO: cannot find symbol

// ✅ Declarar fora se precisar depois
int i;
for (i = 0; i < 10; i++) {
    // ...
}
System.out.println(i);  // OK: i = 10
```

### 6. **size() vs length**

```java
int[] arr = {1, 2, 3};
List<Integer> lista = Arrays.asList(1, 2, 3);

// ❌ Confundir sintaxe
for (int i = 0; i < arr.size(); i++) { }     // ERRO: array não tem size()
for (int i = 0; i < lista.length; i++) { }   // ERRO: List não tem length

// ✅ Sintaxe correta
for (int i = 0; i < arr.length; i++) { }     // OK: array.length (propriedade)
for (int i = 0; i < lista.size(); i++) { }   // OK: lista.size() (método)
```

---

## 🔗 Interconexões Conceituais

- **while**: Equivalente com inicialização + incremento separados
- **do-while**: Difere pois testa condição APÓS corpo
- **for-each**: Abstrai índice, itera diretamente sobre elementos
- **Arrays**: Acesso via índice `arr[i]`
- **ArrayList**: Acesso via `get(i)`
- **break**: Sai do loop imediatamente
- **continue**: Pula para próxima iteração (executa incremento)
- **Escopo de variáveis**: Variável declarada no for é local

---

## 🚀 Boas Práticas

### 1. ✅ Declare Variável no for

```java
// ✅ Escopo local
for (int i = 0; i < 10; i++) {
    // i só existe aqui
}
// i não existe mais
```

### 2. ✅ Use Nomes Descritivos

```java
// ⚠️ OK para loops simples
for (int i = 0; i < arr.length; i++) { }

// ✅ Melhor para código complexo
for (int indiceAluno = 0; indiceAluno < alunos.length; indiceAluno++) {
    // Mais claro a intenção
}
```

### 3. ✅ Cache size() para Listas

```java
// ⚠️ size() calculado a cada iteração
for (int i = 0; i < lista.size(); i++) { }

// ✅ Cache
int tamanho = lista.size();
for (int i = 0; i < tamanho; i++) { }
```

### 4. ✅ Prefira i++ a ++i no Incremento

```java
// ✅ Convenção padrão (mais comum)
for (int i = 0; i < 10; i++) { }

// ⚠️ Funciona mas menos idiomático
for (int i = 0; i < 10; ++i) { }
```

### 5. ✅ Use for para Contagem Conhecida

```java
// ✅ for: número de iterações conhecido
for (int i = 0; i < 10; i++) {
    processar(i);
}

// ⚠️ while: número desconhecido
while (condicaoComplexaNaoContavel()) {
    processar();
}
```

### 6. ✅ Evite Modificar Variável no Corpo

```java
// ❌ Confuso: i incrementa 2 vezes
for (int i = 0; i < 10; i++) {
    System.out.println(i);
    i++;  // Não faça isso
}

// ✅ Incremento apenas no header
for (int i = 0; i < 10; i += 2) {
    System.out.println(i);
}
```

### 7. ✅ Condição Simples e Clara

```java
// ✅ Condição clara
for (int i = 0; i < arr.length; i++) { }

// ⚠️ Evite condições muito complexas
for (int i = 0; i < arr.length && arr[i] != null && !arr[i].isEmpty() && validar(arr[i]); i++) {
    // Difícil de entender
}

// ✅ Quebre em if dentro do corpo
for (int i = 0; i < arr.length; i++) {
    if (arr[i] == null || arr[i].isEmpty() || !validar(arr[i])) {
        break;
    }
    // ...
}
```

### 8. ✅ Use for-each Quando Não Precisa de Índice

```java
// ⚠️ for desnecessário se não usa índice
for (int i = 0; i < lista.size(); i++) {
    String item = lista.get(i);
    processar(item);  // Não usa i
}

// ✅ for-each mais limpo
for (String item : lista) {
    processar(item);
}
```

### 9. ✅ Sempre Use Chaves

```java
// ⚠️ Sem chaves (funciona mas perigoso)
for (int i = 0; i < 10; i++)
    System.out.println(i);

// ✅ Com chaves (mais seguro)
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

### 10. ✅ Comente Loops Complexos

```java
// ✅ Comentário explica intenção
// Percorre apenas índices pares do array
for (int i = 0; i < arr.length; i += 2) {
    processar(arr[i]);
}
```

---

## 📚 Resumo

**Inicialização, condição e incremento** são os **três pilares** do for tradicional. **Inicialização** (ex: `int i = 0`) executa **UMA VEZ** no início, definindo estado inicial. **Condição** (ex: `i < 10`) é testada **ANTES** de cada iteração; se `false`, loop termina. **Incremento** (ex: `i++`) executa **APÓS** cada iteração, modificando variável de controle. **Ordem de execução**: 1) Inicialização, 2) Testa condição, 3) Se `true` → corpo, 4) Incremento, 5) Volta ao passo 2. **Separadores**: ponto-e-vírgula (`;`) separa os três componentes. **Escopo**: Variável declarada no for é **local** ao loop. **Arrays**: Use `i < arr.length` (propriedade `length` sem parênteses). **Listas**: Use `i < lista.size()` (método `size()` com parênteses; considere cache). **Incremento comum**: `i++` (incremento de 1), `i += 2` (pares), `i--` (decremento). **i++ vs ++i**: No incremento do for, **sem diferença** (valor não usado). **Off-by-one**: Use `i < length`, não `i <= length`. **Condição infinita**: Garanta que condição eventualmente se torna `false` ou use `break`. **Modificação no corpo**: Evite modificar variável de controle no corpo se já tem incremento no header (confuso). **for vs while**: Use **for** para contagem conhecida, **while** para condição desconhecida. **for vs for-each**: Use **for** quando precisa de **índice** ou **modificar array**, **for-each** para leitura sequencial simples. **Boas práticas**: Declare variável no for (escopo local), use `i++` (convenção), cache `size()`, evite condições complexas, use chaves, comente loops não óbvios.
