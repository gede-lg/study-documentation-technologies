# Sintaxe do while

## 🎯 Introdução e Definição

### Definição Conceitual

O **while** é uma **estrutura de repetição** que executa um **bloco de código repetidamente** enquanto uma **condição booleana** for **verdadeira**. A condição é **verificada ANTES** de cada iteração, o que significa que o código pode **nunca ser executado** se a condição for falsa desde o início.

**Estrutura básica**:
```java
while (condição) {
    // código executado enquanto condição for true
}
```

**Analogia**: É como uma **porta com sensor** - você só entra (executa) **se o sensor detectar** (condição true). Se o sensor não detectar desde o início, você **nunca entra**.

**Exemplo fundamental**:
```java
int contador = 0;

while (contador < 3) {
    System.out.println("Contador: " + contador);
    contador++;
}

// Saída:
// Contador: 0
// Contador: 1
// Contador: 2
```

**Importância**:
- ✅ **Repetição controlada**: Executa código múltiplas vezes
- ✅ **Condição pré-verificada**: Testa ANTES de executar
- ✅ **Flexibilidade**: Condição pode ser qualquer expressão booleana
- ✅ **Zero execuções**: Pode não executar nenhuma vez
- ⚠️ **Loop infinito**: Se condição sempre true, nunca para

---

## 📋 Sumário Conceitual

### Componentes do while

**1. Palavra-chave `while`**: Inicia a estrutura
**2. Condição**: Expressão booleana entre parênteses `()`
**3. Bloco**: Código entre chaves `{}`
**4. Corpo**: Instruções executadas a cada iteração

**Sintaxe completa**:
```java
while (condiçãoBooleana) {
    // statement 1
    // statement 2
    // ...
    // atualização da condição (importante!)
}
```

**Fluxo de execução**:
1. **Avalia condição** → Se `true`, vai para passo 2; se `false`, pula para passo 4
2. **Executa corpo** do while
3. **Volta ao passo 1** (reavalia condição)
4. **Continua** após o while

---

## 🧠 Fundamentos Teóricos

### 1. Anatomia Completa do while

```java
// ┌─ Palavra-chave
// │     ┌─ Parênteses obrigatórios
// │     │  ┌─ Condição booleana
// │     │  │
while (contador < 10) {  // ← Cabeçalho
    System.out.println(contador);  // ← Corpo (pode ter N instruções)
    contador++;  // ← Atualização (importante!)
}
// ← Continua aqui após condição false
```

**Componentes**:
- **`while`**: Palavra-chave (reservada)
- **`(condição)`**: Expressão que resulta em `boolean`
- **`{...}`**: Bloco de código (chaves opcionais para 1 statement)
- **Atualização**: Modificação que eventualmente tornará condição `false`

### 2. Condição Booleana

**A condição DEVE resultar em `true` ou `false`**:

```java
// ✅ Condições válidas
while (x < 10) { }           // Comparação
while (continuar) { }        // Variável boolean
while (x < 10 && y > 0) { }  // Expressão complexa
while (lista.hasNext()) { }  // Método que retorna boolean
while (true) { }             // Literal (loop infinito)
while (!concluido) { }       // Negação

// ❌ Condições INVÁLIDAS
while (x) { }           // ERRO: int não é boolean
while (10) { }          // ERRO: int não é boolean
while ("texto") { }     // ERRO: String não é boolean
```

### 3. Execução Pré-testada

**Condição verificada ANTES de executar**:

```java
// Exemplo: condição falsa desde o início
int x = 10;

while (x < 5) {  // false logo de início
    System.out.println("Nunca executado");
}

System.out.println("Continua aqui");

// Saída:
// Continua aqui
// (bloco while NÃO executado)
```

**Comparação: 0 vs N execuções**:
```java
// Caso 1: ZERO execuções
int a = 10;
while (a < 5) {
    System.out.println(a);  // NUNCA executado
}

// Caso 2: MÚLTIPLAS execuções
int b = 0;
while (b < 3) {
    System.out.println(b);  // Executado 3 vezes
    b++;
}
```

### 4. Atualização da Condição

**⚠️ CRÍTICO**: O corpo do while DEVE modificar a condição, caso contrário, loop infinito!

```java
// ✅ CORRETO: atualiza contador (condição muda)
int i = 0;
while (i < 3) {
    System.out.println(i);
    i++;  // ← Atualização: eventualmente i >= 3
}

// ❌ LOOP INFINITO: condição nunca muda
int j = 0;
while (j < 3) {
    System.out.println(j);
    // ESQUECEU j++: j sempre 0, condição sempre true
}
```

### 5. Bloco de Código (Chaves)

**Chaves `{}` são opcionais para 1 statement**, mas **sempre recomendadas**:

```java
// ✅ Recomendado: SEMPRE use chaves
int i = 0;
while (i < 3) {
    System.out.println(i);  // Apenas 1 statement
    i++;
}

// ⚠️ Válido, mas PERIGOSO: sem chaves (apenas próximo statement)
int j = 0;
while (j < 3)
    System.out.println(j);  // Apenas este pertence ao while
    j++;  // ERRO: fora do while (loop infinito!)

// ❌ Bug comum: sem chaves, múltiplos statements
int k = 0;
while (k < 3)
    System.out.println(k);
    k++;  // FORA do while! (indentação engana)
```

### 6. Variáveis de Controle

**Declaração antes do while**:
```java
// ✅ Declaração antes do loop
int contador = 0;  // Visível antes, durante e após
while (contador < 5) {
    System.out.println(contador);
    contador++;
}
System.out.println("Final: " + contador);  // Acessível

// ❌ ERRO: declaração dentro da condição
while (int i = 0; i < 5; i++) {  // ERRO: sintaxe inválida
    // ...
}
```

**Escopo da variável de controle**:
```java
int i = 0;  // Escopo: de aqui até fim do método/bloco
while (i < 5) {
    int x = i * 2;  // Escopo: apenas dentro do while
    System.out.println(x);
    i++;
}
// System.out.println(x);  // ERRO: x não existe aqui
System.out.println(i);  // OK: i existe aqui (valor 5)
```

### 7. Padrões de Iteração

#### **Padrão 1: Contador Crescente**
```java
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;  // Incremento
}
```

#### **Padrão 2: Contador Decrescente**
```java
int i = 10;
while (i > 0) {
    System.out.println(i);
    i--;  // Decremento
}
```

#### **Padrão 3: Condição Complexa**
```java
int x = 0, y = 10;
while (x < 5 && y > 0) {
    System.out.println("x=" + x + ", y=" + y);
    x++;
    y -= 2;
}
```

#### **Padrão 4: Flag Booleano**
```java
boolean continuar = true;
int tentativas = 0;

while (continuar) {
    tentativas++;
    if (tentativas >= 3) {
        continuar = false;  // Atualiza flag
    }
}
```

#### **Padrão 5: Leitura de Dados**
```java
Scanner scanner = new Scanner(System.in);
String entrada = "";

while (!entrada.equals("sair")) {
    System.out.print("Comando: ");
    entrada = scanner.nextLine();
    System.out.println("Você digitou: " + entrada);
}
```

### 8. Múltiplas Instruções no Corpo

```java
int i = 0;
int soma = 0;

while (i < 5) {
    // Múltiplas instruções
    System.out.println("Iteração: " + i);
    soma += i;
    int quadrado = i * i;
    System.out.println("Quadrado: " + quadrado);
    i++;
}

System.out.println("Soma total: " + soma);
```

### 9. while vs for

**while**: Quando número de iterações é **desconhecido** ou condição é **complexa**.
```java
// ✅ while apropriado: número de iterações desconhecido
Scanner scanner = new Scanner(System.in);
String entrada = "";
while (!entrada.equals("sair")) {
    entrada = scanner.nextLine();
}
```

**for**: Quando número de iterações é **conhecido** ou **contável**.
```java
// ✅ for apropriado: número de iterações conhecido
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

**Conversão while ↔ for**:
```java
// while
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}

// for equivalente
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

### 10. Exemplos Práticos Completos

#### **Soma de Números**
```java
public int somarAteN(int n) {
    int soma = 0;
    int i = 1;
    
    while (i <= n) {
        soma += i;
        i++;
    }
    
    return soma;
}

// Uso:
somarAteN(5);  // 1+2+3+4+5 = 15
```

#### **Fatorial**
```java
public long fatorial(int n) {
    long resultado = 1;
    int i = 1;
    
    while (i <= n) {
        resultado *= i;
        i++;
    }
    
    return resultado;
}

// Uso:
fatorial(5);  // 5! = 120
```

#### **Contagem de Dígitos**
```java
public int contarDigitos(int numero) {
    int count = 0;
    
    while (numero > 0) {
        numero /= 10;  // Remove último dígito
        count++;
    }
    
    return count;
}

// Uso:
contarDigitos(12345);  // 5 dígitos
```

#### **Inversão de Número**
```java
public int inverterNumero(int numero) {
    int invertido = 0;
    
    while (numero > 0) {
        int digito = numero % 10;  // Último dígito
        invertido = invertido * 10 + digito;
        numero /= 10;  // Remove último dígito
    }
    
    return invertido;
}

// Uso:
inverterNumero(1234);  // 4321
```

#### **Busca em Lista**
```java
public boolean buscar(int[] array, int valor) {
    int i = 0;
    
    while (i < array.length) {
        if (array[i] == valor) {
            return true;  // Encontrou
        }
        i++;
    }
    
    return false;  // Não encontrou
}

// Uso:
int[] numeros = {10, 20, 30, 40};
buscar(numeros, 30);  // true
buscar(numeros, 50);  // false
```

#### **Máximo Divisor Comum (MDC)**
```java
public int mdc(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Uso:
mdc(48, 18);  // 6
```

#### **Geração de Fibonacci**
```java
public void imprimirFibonacci(int n) {
    int a = 0, b = 1;
    int count = 0;
    
    while (count < n) {
        System.out.print(a + " ");
        int proximo = a + b;
        a = b;
        b = proximo;
        count++;
    }
}

// Uso:
imprimirFibonacci(8);  // 0 1 1 2 3 5 8 13
```

#### **Validação com Tentativas Limitadas**
```java
public boolean autenticar() {
    Scanner scanner = new Scanner(System.in);
    int tentativas = 0;
    final int MAX_TENTATIVAS = 3;
    
    while (tentativas < MAX_TENTATIVAS) {
        System.out.print("Senha: ");
        String senha = scanner.nextLine();
        
        if (senha.equals("1234")) {
            System.out.println("Acesso permitido");
            return true;
        }
        
        tentativas++;
        System.out.println("Senha incorreta. Tentativas restantes: " 
                          + (MAX_TENTATIVAS - tentativas));
    }
    
    System.out.println("Acesso bloqueado");
    return false;
}
```

---

## 🔍 Análise Conceitual Profunda

### Pré-condição vs Pós-condição

**while**: Pré-condição (testa ANTES de executar)
```java
int x = 10;
while (x < 5) {  // Testa ANTES: false
    System.out.println("Nunca executado");
}
// Resultado: 0 execuções
```

**do-while**: Pós-condição (testa DEPOIS de executar)
```java
int x = 10;
do {
    System.out.println("Executado uma vez");  // Executa ANTES de testar
} while (x < 5);  // Testa DEPOIS: false
// Resultado: 1 execução
```

### Fluxo de Controle Detalhado

```java
int i = 0;

// Passo 1: Declara variável (fora do loop)
// i = 0

while (i < 3) {  // Passo 2: Avalia condição
    // Passo 3: Se true, executa corpo
    System.out.println(i);
    i++;
    // Passo 4: Volta ao Passo 2
}

// Passo 5: Se false, continua aqui
System.out.println("Fim");
```

**Execução detalhada**:
1. **i=0**: Avalia `0 < 3` → `true` → Imprime 0, i=1
2. **i=1**: Avalia `1 < 3` → `true` → Imprime 1, i=2
3. **i=2**: Avalia `2 < 3` → `true` → Imprime 2, i=3
4. **i=3**: Avalia `3 < 3` → `false` → Sai do loop
5. Imprime "Fim"

### Equivalência com goto (conceitual)

```java
// while em Java
int i = 0;
while (i < 3) {
    System.out.println(i);
    i++;
}

// Equivalente com goto (pseudocódigo)
int i = 0;
inicio:
    if (i >= 3) goto fim;
    System.out.println(i);
    i++;
    goto inicio;
fim:
```

### Quando Usar while

**✅ Use while quando**:
- Número de iterações é **desconhecido**
- Condição de parada é **complexa** ou **não numérica**
- Leitura de dados até **fim de arquivo** ou **entrada específica**
- Processamento até **condição externa** ser satisfeita

**❌ Evite while quando**:
- Número de iterações é **conhecido** → Use `for`
- Precisa executar **pelo menos 1 vez** → Use `do-while`
- Iteração sobre **array/coleção** → Use `for-each`

---

## 🎯 Aplicabilidade e Contextos

### 1. **Validação de Entrada**

```java
Scanner scanner = new Scanner(System.in);
int numero = -1;

while (numero < 0 || numero > 100) {
    System.out.print("Digite um número entre 0 e 100: ");
    numero = scanner.nextInt();
}
```

### 2. **Leitura de Arquivo/Stream**

```java
BufferedReader reader = new BufferedReader(new FileReader("arquivo.txt"));
String linha;

while ((linha = reader.readLine()) != null) {
    System.out.println(linha);
}
```

### 3. **Processamento de Coleções com Iterador**

```java
Iterator<String> iterator = lista.iterator();

while (iterator.hasNext()) {
    String elemento = iterator.next();
    System.out.println(elemento);
}
```

### 4. **Jogos e Simulações**

```java
boolean jogoAtivo = true;

while (jogoAtivo) {
    exibirTabuleiro();
    processarJogada();
    verificarVitoria();
    if (vencedor != null) {
        jogoAtivo = false;
    }
}
```

### 5. **Servidores e Event Loops**

```java
ServerSocket server = new ServerSocket(8080);

while (true) {  // Loop infinito (servidor sempre ativo)
    Socket cliente = server.accept();
    processarCliente(cliente);
}
```

### 6. **Algoritmos Numéricos**

```java
// Aproximação de raiz quadrada (método de Newton)
double x = numero;
double anterior;

while (Math.abs(x * x - numero) > precisao) {
    anterior = x;
    x = (x + numero / x) / 2;
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Loop Infinito (Esqueceu Atualização)**

```java
// ❌ BUG: loop infinito
int i = 0;
while (i < 10) {
    System.out.println(i);
    // ESQUECEU i++: i sempre 0
}

// ✅ Correto: atualiza variável
int j = 0;
while (j < 10) {
    System.out.println(j);
    j++;  // Atualização
}
```

### 2. **Condição Sempre Falsa (Nunca Executa)**

```java
// ⚠️ Nunca entra no loop
int x = 10;
while (x < 5) {  // false logo de início
    System.out.println("Nunca executado");
}
```

### 3. **Condição Sempre Verdadeira (Infinito)**

```java
// ❌ Loop infinito intencional (sem break)
while (true) {
    System.out.println("Infinito");
    // Nunca para
}

// ✅ Loop infinito com break
while (true) {
    String entrada = scanner.nextLine();
    if (entrada.equals("sair")) {
        break;  // Sai do loop
    }
}
```

### 4. **Sem Chaves (Apenas 1 Statement)**

```java
// ❌ BUG: sem chaves, apenas próximo statement
int i = 0;
while (i < 10)
    System.out.println(i);
    i++;  // FORA do while! (loop infinito)

// ✅ Com chaves
int j = 0;
while (j < 10) {
    System.out.println(j);
    j++;
}
```

### 5. **Modificação Incorreta da Condição**

```java
// ❌ Modifica variável errada
int i = 0;
int j = 0;
while (i < 10) {
    System.out.println(i);
    j++;  // ERRO: modifica j, não i (loop infinito)
}

// ✅ Modifica variável correta
int k = 0;
while (k < 10) {
    System.out.println(k);
    k++;  // Correto
}
```

### 6. **Condição Não Booleana**

```java
// ❌ ERRO: int não é boolean
int x = 10;
while (x) {  // ERRO: x é int, não boolean
    x--;
}

// ✅ Condição booleana
int y = 10;
while (y > 0) {  // OK: y > 0 é boolean
    y--;
}
```

---

## 🔗 Interconexões Conceituais

- **if**: while é como if que se repete
- **do-while**: Variante que testa DEPOIS
- **for**: Estrutura equivalente para iterações contáveis
- **break**: Saída antecipada do loop
- **continue**: Pula para próxima iteração
- **return**: Sai do método (e do loop)
- **boolean**: Tipo da condição do while
- **Iteradores**: Padrão comum com while

---

## 🚀 Boas Práticas

### 1. ✅ SEMPRE Use Chaves (mesmo para 1 statement)

```java
// ✅ Recomendado
while (condicao) {
    statement;
}

// ⚠️ Evite (perigoso)
while (condicao)
    statement;
```

### 2. ✅ Inicialize Variável de Controle ANTES do Loop

```java
// ✅ Correto
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}

// ❌ Erro comum
while (i < 10) {  // ERRO: i não declarado
    int i = 0;  // Dentro do loop (errado)
    i++;
}
```

### 3. ✅ Garanta que Condição Eventualmente Seja False

```java
// ✅ Condição muda (evita infinito)
int i = 0;
while (i < 10) {
    i++;  // Eventualmente i >= 10
}

// ❌ Loop infinito
int j = 0;
while (j < 10) {
    // ESQUECEU j++
}
```

### 4. ✅ Use Nomes Descritivos para Flags

```java
// ✅ Nome claro
boolean autenticado = false;
while (!autenticado) {
    autenticado = tentarAutenticar();
}

// ❌ Nome confuso
boolean f = false;
while (!f) {
    f = check();
}
```

### 5. ✅ Limite Iterações para Evitar Infinito

```java
// ✅ Limite de segurança
int i = 0;
final int MAX_ITERACOES = 1000;

while (i < MAX_ITERACOES && condicao) {
    // processamento
    i++;
}

if (i >= MAX_ITERACOES) {
    System.err.println("AVISO: Limite de iterações atingido");
}
```

### 6. ✅ Prefira for para Contadores Simples

```java
// ⚠️ while para contador (verboso)
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}

// ✅ for para contador (mais conciso)
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

### 7. ✅ Use while para Condições Complexas

```java
// ✅ while apropriado (condição complexa)
Scanner scanner = new Scanner(System.in);
String entrada = "";

while (!entrada.equals("sair") && !entrada.equals("exit")) {
    entrada = scanner.nextLine();
}
```

### 8. ✅ Documente Loops Infinitos Intencionais

```java
// ✅ Comentário explica loop infinito
// Loop infinito: servidor sempre ativo (use Ctrl+C para parar)
while (true) {
    processarRequisicao();
}
```

### 9. ✅ Evite Modificar Variável de Controle em Múltiplos Locais

```java
// ❌ Confuso (modifica i em 2 lugares)
int i = 0;
while (i < 10) {
    if (condicao) {
        i++;  // Local 1
    }
    i++;  // Local 2
}

// ✅ Modifica em 1 local apenas
int j = 0;
while (j < 10) {
    if (condicao) {
        j += 2;
    } else {
        j++;
    }
}
```

### 10. ✅ Teste Casos Extremos

```java
@Test
void testWhileZeroIteracoes() {
    int count = 0;
    int i = 10;
    while (i < 5) {  // Nunca entra
        count++;
    }
    assertEquals(0, count);  // 0 iterações
}

@Test
void testWhileUmaIteracao() {
    int count = 0;
    int i = 0;
    while (i < 1) {
        count++;
        i++;
    }
    assertEquals(1, count);  // 1 iteração
}
```

---

## 📚 Resumo

O **while** é uma **estrutura de repetição pré-testada** que executa código **enquanto** uma **condição booleana** for **verdadeira**. A condição é verificada **ANTES** de cada iteração, podendo resultar em **zero execuções** se falsa desde o início. **Sintaxe**: `while (condição) { corpo }`. O **corpo** deve **modificar** a condição para evitar **loop infinito**. **SEMPRE use chaves** `{}` mesmo para 1 statement. Use while quando o **número de iterações é desconhecido** ou a **condição é complexa**. Para iterações **contáveis**, prefira **for**. Para executar **pelo menos 1 vez**, use **do-while**. Garanta que a condição **eventualmente seja false**. Inicialize variáveis de controle **antes** do loop. Use **break** para saída antecipada e **continue** para pular iteração. Documente **loops infinitos intencionais** (`while (true)`). Teste casos extremos: **zero iterações**, **uma iteração**, **múltiplas iterações**.

