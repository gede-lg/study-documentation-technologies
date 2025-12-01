# Condição de Parada no while

## 🎯 Introdução e Definição

### Definição Conceitual

A **condição de parada** é a **expressão booleana** que determina **quando o loop while termina**. Ela é avaliada **ANTES de cada iteração** e, quando se torna **false**, o loop **encerra**. Definir corretamente a condição de parada é **crítico** para evitar loops infinitos ou execuções inadequadas.

**Estrutura básica**:
```java
while (condiçãoDeParada) {
    // código
    // atualização que eventualmente torna condição false
}
```

**Analogia**: A condição de parada é como um **semáforo** - enquanto está **verde (true)**, o trânsito (loop) **continua**; quando fica **vermelho (false)**, o trânsito **para**.

**Exemplo fundamental**:
```java
int contador = 0;

while (contador < 5) {  // ← Condição de parada: continua enquanto < 5
    System.out.println("Iteração: " + contador);
    contador++;  // Atualização: aproxima da parada
}

// Saída:
// Iteração: 0
// Iteração: 1
// Iteração: 2
// Iteração: 3
// Iteração: 4
// (Para quando contador = 5, pois 5 < 5 é false)
```

**Importância**:
- ✅ **Define quando parar**: Sem ela, loop infinito
- ✅ **Controla iterações**: Determina quantas vezes executa
- ✅ **Lógica do algoritmo**: Expressa objetivo do loop
- ⚠️ **Mal definida**: Causa bugs sutis
- ⚠️ **Nunca false**: Loop infinito

---

## 📋 Sumário Conceitual

### Tipos de Condições de Parada

**1. Comparação numérica**: `x < 10`, `i >= 0`
**2. Igualdade**: `entrada.equals("sair")`, `x == valor`
**3. Booleana direta**: `continuar`, `!concluido`
**4. Método que retorna boolean**: `hasNext()`, `isEmpty()`
**5. Combinação lógica**: `x < 10 && y > 0`
**6. Literal**: `true` (loop infinito), `false` (nunca executa)

**Componentes**:
- **Expressão**: Avaliada a cada iteração
- **Resultado**: Deve ser `true` (continua) ou `false` (para)
- **Atualização**: Código que modifica variáveis da condição

---

## 🧠 Fundamentos Teóricos

### 1. Como a Condição é Avaliada

**Ciclo de avaliação**:
```java
int i = 0;

while (i < 3) {  // Avalia ANTES de cada iteração
    System.out.println("Iteração " + i);
    i++;
}
```

**Passo a passo**:
1. **i=0**: Avalia `0 < 3` → `true` → Executa corpo → i=1
2. **i=1**: Avalia `1 < 3` → `true` → Executa corpo → i=2
3. **i=2**: Avalia `2 < 3` → `true` → Executa corpo → i=3
4. **i=3**: Avalia `3 < 3` → **false** → **PARA** (sai do loop)

### 2. Condições Numéricas (Mais Comuns)

#### **Menor que (`<`)**
```java
int i = 0;
while (i < 10) {  // Para quando i >= 10
    System.out.println(i);
    i++;
}
// Executa: i = 0, 1, 2, ..., 9 (10 iterações)
```

#### **Menor ou igual (`<=`)**
```java
int i = 1;
while (i <= 10) {  // Para quando i > 10
    System.out.println(i);
    i++;
}
// Executa: i = 1, 2, 3, ..., 10 (10 iterações)
```

#### **Maior que (`>`)**
```java
int i = 10;
while (i > 0) {  // Para quando i <= 0
    System.out.println(i);
    i--;
}
// Executa: i = 10, 9, 8, ..., 1 (10 iterações)
```

#### **Maior ou igual (`>=`)**
```java
int i = 10;
while (i >= 1) {  // Para quando i < 1
    System.out.println(i);
    i--;
}
// Executa: i = 10, 9, 8, ..., 1 (10 iterações)
```

#### **Diferente (`!=`)**
```java
int i = 0;
while (i != 5) {  // Para quando i == 5
    System.out.println(i);
    i++;
}
// Executa: i = 0, 1, 2, 3, 4 (5 iterações)
```

### 3. Condições Booleanas Diretas

**Variável boolean**:
```java
boolean continuar = true;
int count = 0;

while (continuar) {  // Continua enquanto true
    count++;
    if (count >= 5) {
        continuar = false;  // ← Atualiza condição para parar
    }
}
```

**Negação**:
```java
boolean concluido = false;

while (!concluido) {  // Continua enquanto NÃO concluído
    // processamento
    if (verificarConclusao()) {
        concluido = true;  // ← Para quando true
    }
}
```

### 4. Condições de Igualdade (Strings)

**Comparação de String**:
```java
Scanner scanner = new Scanner(System.in);
String comando = "";

while (!comando.equals("sair")) {  // Para quando == "sair"
    System.out.print("Digite comando: ");
    comando = scanner.nextLine();
    System.out.println("Comando: " + comando);
}
```

**Múltiplas opções de saída**:
```java
String entrada = "";

while (!entrada.equals("sair") && !entrada.equals("exit") && !entrada.equals("q")) {
    entrada = scanner.nextLine();
}
// Para quando entrada for "sair" OU "exit" OU "q"
```

### 5. Condições com Métodos

**Métodos que retornam boolean**:
```java
// Iterator
Iterator<String> iterator = lista.iterator();
while (iterator.hasNext()) {  // Para quando não há próximo
    String elemento = iterator.next();
    System.out.println(elemento);
}

// Scanner
Scanner scanner = new Scanner(arquivo);
while (scanner.hasNextLine()) {  // Para quando não há próxima linha
    String linha = scanner.nextLine();
    processarLinha(linha);
}

// Lista vazia
while (!lista.isEmpty()) {  // Para quando lista fica vazia
    Object item = lista.remove(0);
    processar(item);
}
```

### 6. Condições Compostas (AND, OR)

#### **AND (`&&`)**: Todas devem ser true
```java
int x = 0, y = 10;

while (x < 5 && y > 0) {  // Para quando x >= 5 OU y <= 0
    System.out.println("x=" + x + ", y=" + y);
    x++;
    y -= 2;
}
// Para na primeira condição que fica false
```

#### **OR (`||`)**: Pelo menos uma true
```java
boolean condicao1 = true;
boolean condicao2 = true;

while (condicao1 || condicao2) {  // Para quando AMBAS forem false
    // processamento
    if (algumEvento()) {
        condicao1 = false;
    }
    if (outroEvento()) {
        condicao2 = false;
    }
}
```

### 7. Condições Sempre True/False

#### **Loop infinito (`true`)**
```java
while (true) {  // NUNCA para naturalmente
    System.out.println("Infinito");
    // Precisa de break, return ou throw para parar
}

// Com break
while (true) {
    String entrada = scanner.nextLine();
    if (entrada.equals("sair")) {
        break;  // ← Saída explícita
    }
}
```

#### **Nunca executa (`false`)**
```java
while (false) {  // NUNCA entra
    System.out.println("Nunca executado");
}
// Inútil (código morto)
```

### 8. Atualização da Condição

**⚠️ CRÍTICO**: A condição DEVE ser modificada no corpo do loop!

#### **Atualização correta**:
```java
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;  // ← Atualiza i: eventualmente i >= 10
}
```

#### **ERRO: Sem atualização (loop infinito)**:
```java
int i = 0;
while (i < 10) {
    System.out.println(i);
    // ESQUECEU i++: i sempre 0, condição sempre true
}
```

#### **Múltiplas variáveis**:
```java
int x = 0, y = 10;
while (x < 5 && y > 0) {
    x++;    // Atualiza x
    y -= 2; // Atualiza y
}
// Para quando x >= 5 OU y <= 0
```

### 9. Condições com Efeitos Colaterais

**Atribuição dentro da condição**:
```java
BufferedReader reader = new BufferedReader(new FileReader("arquivo.txt"));
String linha;

while ((linha = reader.readLine()) != null) {  // Atribui E testa
    System.out.println(linha);
}
```

**Explicação**:
- `linha = reader.readLine()`: Atribui valor a `linha`
- `!= null`: Testa se leitura foi bem-sucedida
- Parênteses externos necessários para precedência

### 10. Exemplos Práticos Completos

#### **Soma até Limite**
```java
public int somarAte(int limite) {
    int soma = 0;
    int numero = 1;
    
    while (soma < limite) {  // Para quando soma >= limite
        soma += numero;
        numero++;
    }
    
    return soma;
}

// somarAte(20) → 1+2+3+4+5+6 = 21 (>= 20, para)
```

#### **Validação com Máximo de Tentativas**
```java
public boolean validar() {
    Scanner scanner = new Scanner(System.in);
    int tentativas = 0;
    final int MAX = 3;
    
    while (tentativas < MAX) {  // Para quando tentativas >= 3
        System.out.print("Senha: ");
        String senha = scanner.nextLine();
        
        if (senha.equals("1234")) {
            return true;  // ← Saída antecipada (sucesso)
        }
        
        tentativas++;
    }
    
    return false;  // Esgotou tentativas
}
```

#### **Busca Linear (para quando encontra)**
```java
public int buscar(int[] array, int valor) {
    int i = 0;
    
    while (i < array.length && array[i] != valor) {
        // Para quando: i >= length OU array[i] == valor
        i++;
    }
    
    if (i < array.length) {
        return i;  // Encontrou
    }
    return -1;  // Não encontrou
}
```

#### **Leitura Até Fim de Arquivo**
```java
public void processarArquivo(String caminho) throws IOException {
    BufferedReader reader = new BufferedReader(new FileReader(caminho));
    String linha;
    
    while ((linha = reader.readLine()) != null) {  // Para no EOF
        processarLinha(linha);
    }
    
    reader.close();
}
```

#### **Contagem de Dígitos Pares**
```java
public int contarDigitosPares(int numero) {
    int count = 0;
    
    while (numero > 0) {  // Para quando numero == 0
        int digito = numero % 10;
        if (digito % 2 == 0) {
            count++;
        }
        numero /= 10;  // Remove último dígito
    }
    
    return count;
}

// contarDigitosPares(24681) → 5 (todos pares)
```

#### **Potência de 2 Mais Próxima**
```java
public int proximaPotenciaDe2(int n) {
    int potencia = 1;
    
    while (potencia < n) {  // Para quando potencia >= n
        potencia *= 2;
    }
    
    return potencia;
}

// proximaPotenciaDe2(100) → 128 (2^7)
```

#### **Menu com Múltiplas Opções de Saída**
```java
public void menu() {
    Scanner scanner = new Scanner(System.in);
    String opcao = "";
    
    while (!opcao.equals("0") && !opcao.equals("sair")) {
        // Para quando opcao == "0" OU == "sair"
        System.out.println("1 - Opção 1");
        System.out.println("2 - Opção 2");
        System.out.println("0 - Sair");
        System.out.print("Escolha: ");
        
        opcao = scanner.nextLine();
        processarOpcao(opcao);
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Condição de Continuação vs Condição de Parada

**Continuação**: "Enquanto X for true, continue"
```java
while (i < 10) {  // Continua enquanto i < 10
    i++;
}
```

**Parada**: "Pare quando X for true"
```java
while (!(i >= 10)) {  // Para quando i >= 10
    i++;
}
// Equivalente ao anterior (De Morgan)
```

**Mentalmente, é mais natural pensar em continuação**, mas compreender quando o loop **para** é crucial.

### Condições de Curto-Circuito

**AND (`&&`)**: Avalia esquerda → direita, para no primeiro `false`
```java
while (x < 10 && array[x] != 0) {
    // Se x >= 10, NÃO avalia array[x] (evita ArrayIndexOutOfBoundsException)
    x++;
}
```

**OR (`||`)**: Avalia esquerda → direita, para no primeiro `true`
```java
while (x < 10 || y > 0) {
    // Se x < 10 é true, NÃO avalia y > 0
    x++;
    y--;
}
```

### Complexidade da Condição

**Simples** (preferível):
```java
while (count < max) {
    count++;
}
```

**Complexa** (dificulta leitura):
```java
while (x < 10 && y > 0 && !flag && lista.size() > 5 && z != valor) {
    // Difícil entender quando para
}

// ✅ Melhor: extrair para método
while (deveContinar(x, y, flag, lista, z, valor)) {
    // Mais claro
}
```

### Invariantes de Loop

**Invariante**: Propriedade que é **verdadeira antes e depois** de cada iteração.

```java
// Invariante: soma contém a soma de 0 até i-1
int soma = 0;
int i = 0;

while (i < n) {
    // Antes: soma = 0+1+...+(i-1)
    soma += i;
    i++;
    // Depois: soma = 0+1+...+i, mas i já foi incrementado
}
// Pós-condição: soma = 0+1+...+(n-1)
```

---

## 🎯 Aplicabilidade e Contextos

### 1. **Contadores Simples**

```java
int i = 0;
while (i < 100) {
    processar(i);
    i++;
}
```

### 2. **Validação de Entrada**

```java
int numero = -1;
while (numero < 0 || numero > 100) {
    numero = scanner.nextInt();
}
```

### 3. **Processamento de Dados até Condição**

```java
while (!fila.isEmpty()) {
    Tarefa tarefa = fila.poll();
    executar(tarefa);
}
```

### 4. **Busca até Encontrar**

```java
int i = 0;
while (i < array.length && array[i] != alvo) {
    i++;
}
```

### 5. **Leitura de Stream**

```java
while (inputStream.available() > 0) {
    int byte = inputStream.read();
    processar(byte);
}
```

### 6. **Algoritmos Iterativos**

```java
// Aproximação numérica
while (Math.abs(estimativa - valorReal) > tolerancia) {
    estimativa = melhorarEstimativa(estimativa);
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Condição Nunca Fica False (Loop Infinito)**

```java
// ❌ Loop infinito: i nunca >= 10
int i = 0;
while (i < 10) {
    System.out.println(i);
    // ESQUECEU i++
}

// ✅ Correto: i eventualmente >= 10
int j = 0;
while (j < 10) {
    System.out.println(j);
    j++;  // Atualização
}
```

### 2. **Condição Sempre False (Nunca Executa)**

```java
// ⚠️ Nunca entra
int x = 10;
while (x < 5) {  // false logo de início
    System.out.println("Nunca executado");
}
```

### 3. **Operador Errado (`=` vs `==`)**

```java
// ❌ ERRO: atribuição em vez de comparação
int x = 0;
while (x = 10) {  // ERRO: atribui 10 a x, não compara
    // ...
}

// ✅ Correto: comparação
while (x == 10) {
    // ...
}
```

### 4. **Condição com Efeito Colateral Perigoso**

```java
// ⚠️ Modifica dentro da condição (confuso)
int i = 0;
while (++i < 10) {  // Incrementa ANTES de comparar
    System.out.println(i);  // 1, 2, ..., 9
}

// ✅ Mais claro: atualização separada
int j = 0;
while (j < 10) {
    j++;
    System.out.println(j);
}
```

### 5. **Comparação de Ponto Flutuante**

```java
// ❌ Perigoso: ponto flutuante impreciso
double x = 0.0;
while (x != 1.0) {  // Pode nunca ser exatamente 1.0
    x += 0.1;
}

// ✅ Use tolerância
double y = 0.0;
while (Math.abs(y - 1.0) > 0.0001) {
    y += 0.1;
}
```

### 6. **Negação Confusa**

```java
// ⚠️ Confuso: negação dupla
while (!!continuar) {  // Equivale a "while (continuar)"
    // ...
}

// ✅ Direto
while (continuar) {
    // ...
}
```

---

## 🔗 Interconexões Conceituais

- **boolean**: Tipo do resultado da condição
- **Operadores relacionais** (`<`, `>`, `==`, etc.): Constroem condições
- **Operadores lógicos** (`&&`, `||`, `!`): Combinam condições
- **break**: Saída antecipada (ignora condição)
- **continue**: Pula para próxima avaliação da condição
- **for**: Loop com condição implícita
- **do-while**: Avalia condição DEPOIS (pós-testado)

---

## 🚀 Boas Práticas

### 1. ✅ Condição Clara e Legível

```java
// ✅ Claro
while (contador < MAX_ITERACOES) {
    contador++;
}

// ❌ Confuso
while (c < M) {
    c++;
}
```

### 2. ✅ Garanta que Condição Eventualmente Seja False

```java
// ✅ i incrementa até >= 10
int i = 0;
while (i < 10) {
    i++;
}

// ❌ i nunca muda
int j = 0;
while (j < 10) {
    // ESQUECEU j++
}
```

### 3. ✅ Use Constantes para Limites

```java
// ✅ Constante nomeada
final int MAX_TENTATIVAS = 3;
int tentativas = 0;
while (tentativas < MAX_TENTATIVAS) {
    tentativas++;
}

// ❌ Magic number
while (tentativas < 3) {
    tentativas++;
}
```

### 4. ✅ Simplifique Condições Complexas

```java
// ❌ Complexo
while (x < 10 && y > 0 && !flag && z != valor) {
    // ...
}

// ✅ Extraia para método
private boolean deveContinar(int x, int y, boolean flag, int z, int valor) {
    return x < 10 && y > 0 && !flag && z != valor;
}

while (deveContinar(x, y, flag, z, valor)) {
    // ...
}
```

### 5. ✅ Evite Condições com Efeitos Colaterais

```java
// ⚠️ Efeito colateral na condição (confuso)
while (++i < 10) {
    // ...
}

// ✅ Efeito colateral no corpo (claro)
while (i < 10) {
    i++;
    // ...
}
```

### 6. ✅ Documente Loops Infinitos Intencionais

```java
// ✅ Comentário explica
// Loop infinito: servidor escuta requisições continuamente
while (true) {
    Socket cliente = serverSocket.accept();
    processarCliente(cliente);
}
```

### 7. ✅ Use Flags com Nomes Significativos

```java
// ✅ Nome descritivo
boolean autenticado = false;
while (!autenticado) {
    autenticado = tentarAutenticar();
}

// ❌ Nome genérico
boolean flag = false;
while (!flag) {
    flag = check();
}
```

### 8. ✅ Considere Limite de Segurança

```java
// ✅ Limite previne infinito
int iteracoes = 0;
final int MAX_ITERACOES = 10000;

while (condicao && iteracoes < MAX_ITERACOES) {
    // processamento
    iteracoes++;
}

if (iteracoes >= MAX_ITERACOES) {
    throw new RuntimeException("Loop excedeu limite");
}
```

### 9. ✅ Teste Casos Limites

```java
@Test
void testCondicaoFalsaInicial() {
    int count = 0;
    int i = 10;
    while (i < 5) {  // Nunca entra
        count++;
    }
    assertEquals(0, count);
}

@Test
void testUmaIteracao() {
    int count = 0;
    int i = 0;
    while (i < 1) {
        count++;
        i++;
    }
    assertEquals(1, count);
}
```

### 10. ✅ Prefira `while` para Condições Não Numéricas

```java
// ✅ while apropriado (condição não numérica)
while (!entrada.equals("sair")) {
    entrada = scanner.nextLine();
}

// ⚠️ for possível, mas menos claro
for (String e = ""; !e.equals("sair"); e = scanner.nextLine()) {
    // ...
}
```

---

## 📚 Resumo

A **condição de parada** é a **expressão booleana** que controla quando o **while termina**. Avaliada **ANTES de cada iteração**, quando fica **false**, o loop **encerra**. Tipos: **numéricas** (`i < 10`), **booleanas** (`continuar`), **igualdade** (`!entrada.equals("sair")`), **métodos** (`hasNext()`), **compostas** (`x < 5 && y > 0`). O **corpo do loop** DEVE **modificar** variáveis da condição para evitar **loop infinito**. Use **constantes nomeadas** para limites (`MAX_TENTATIVAS`). **Simplifique** condições complexas extraindo para método. Evite **efeitos colaterais** na condição (`++i`). Documente **loops infinitos intencionais** (`while (true)`). Use **operadores corretos**: `==` (comparação), não `=` (atribuição). Para **ponto flutuante**, use **tolerância** (`Math.abs(x - y) < 0.0001`), não igualdade exata. **Curto-circuito**: `&&` para no primeiro `false`, `||` no primeiro `true`. Teste **casos limites**: condição **false inicial** (0 iterações), **uma iteração**, **múltiplas**.

