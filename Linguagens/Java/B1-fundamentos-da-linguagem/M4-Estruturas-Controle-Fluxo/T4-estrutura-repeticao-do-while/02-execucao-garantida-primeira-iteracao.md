# Execução Garantida da Primeira Iteração

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Execução garantida da primeira iteração** é característica fundamental de `do-while` que assegura que bloco de código execute **pelo menos uma vez**, independente do valor inicial da condição. Conceitualmente, é **semântica at-least-once** — código roda **antes** do primeiro teste, garantindo execução mínima mesmo se condição for `false` desde o início.

**Essência:**

```java
// Condição falsa desde início
int x = 10;

do {
    System.out.println("Executa: " + x);  // SEMPRE executa
    x++;
} while (x < 5);  // false na primeira verificação, mas já executou

// Saída: "Executa: 10"
```

**vs while (Não Garante):**

```java
// Condição falsa desde início
int x = 10;

while (x < 5) {  // false ANTES de executar
    System.out.println("Nunca executa: " + x);  // NUNCA roda
    x++;
}

// Sem saída
```

**Conceito Fundamental:** `do-while` **inverte ordem** — executa primeiro, depois verifica. Isso transforma casos onde você **sempre quer executar pelo menos uma vez** de "código duplicado + loop" em "apenas loop".

### Contexto Histórico e Motivação

**Problema Histórico:**

Antes de loops post-test (do-while em C, repeat-until em Pascal), programadores precisavam:

```java
// Padrão antigo: código duplicado
fazerAlgo();  // Primeira vez (fora do loop)

while (condicao) {
    fazerAlgo();  // Repetições
}
```

**Motivação do do-while:**

1. **Eliminar Duplicação:** Código aparece apenas uma vez
2. **Semântica Clara:** "Execute pelo menos uma vez, depois repita se..."
3. **Validação de Entrada:** Padrão comum (pedir até ser válido)

**Trade-off:** Menos genérico que `while` (que cobre ambos os casos), mas mais expressivo quando semântica at-least-once é necessária.

### Problema Fundamental que Resolve

**Problema: Código Deve Rodar Antes de Teste**

Cenários comuns onde execução inicial é obrigatória:

**1. Validação de Entrada — Usuário Deve Tentar pelo Menos Uma Vez:**

```java
// SEM do-while (duplicação)
Scanner scanner = new Scanner(System.in);

System.out.print("Digite senha: ");
String senha = scanner.nextLine();  // Primeira vez

while (!senhaValida(senha)) {
    System.out.print("Senha inválida! Digite novamente: ");
    senha = scanner.nextLine();  // Código REPETIDO
}

// COM do-while (sem duplicação)
String senha;

do {
    System.out.print("Digite senha: ");
    senha = scanner.nextLine();

    if (!senhaValida(senha)) {
        System.out.println("Senha inválida!");
    }
} while (!senhaValida(senha));
```

**2. Menu — Deve Exibir pelo Menos Uma Vez:**

```java
// SEM do-while (awkward)
boolean primeiraVez = true;

while (primeiraVez || opcao != 0) {
    exibirMenu();
    opcao = lerOpcao();
    primeiraVez = false;
}

// COM do-while (natural)
do {
    exibirMenu();
    opcao = lerOpcao();
} while (opcao != 0);
```

**Conceito:** `do-while` é solução **natural** para at-least-once — sem flags artificiais ou duplicação.

### Importância no Ecossistema

Execução garantida é **crítica** em:

- **Entrada Interativa:** Pedir input obrigatoriamente
- **Retry Logic:** Tentar operação pelo menos uma vez
- **State Initialization:** Inicializar estado antes de testar
- **User Experience:** Dar ao usuário uma chance antes de validar

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **At-Least-Once Semantics:** Sempre executa minimamente
2. **Post-Test Evaluation:** Testa **depois** da execução
3. **Inverte while:** while = test-first; do-while = execute-first
4. **Elimina Duplicação:** Código aparece uma vez
5. **Condição Inicial Irrelevante:** Executa mesmo se `false` desde início

### Pilares Fundamentais

- **Guaranteed First Execution:** Sempre roda pelo menos uma vez
- **Execute-Then-Test:** Ordem invertida de while
- **At-Least-Once Pattern:** Padrão comum em I/O e validação
- **No Initial Check:** Não verifica condição antes da primeira iteração
- **Post-Condition Loop:** Classe de loops com verificação posterior

---

## 🧠 Fundamentos Teóricos

### Semântica de Execução

**Passo a Passo:**

```java
int x = 10;

do {
    System.out.println("x = " + x);  // 1. EXECUTA (sem testar antes)
    x++;                              // 2. Modifica estado
} while (x < 5);                      // 3. TESTA pela primeira vez
```

**Execução:**
1. Entra no bloco **sem verificar** condição
2. Imprime `x = 10`
3. Incrementa `x` para `11`
4. **Agora** testa: `11 < 5`? → `false`
5. Termina loop (executou uma vez)

**Conceito:** Primeira iteração é **incondicional** — acontece sem teste prévio.

### Comparação Direta: while vs do-while

**Cenário: Condição Falsa Inicialmente**

```java
// while (ZERO execuções)
int a = 10;

while (a < 5) {          // Testa ANTES: 10 < 5? false
    System.out.println("while: " + a);  // NUNCA executa
    a++;
}
System.out.println("Final while: a = " + a);  // 10

// do-while (UMA execução)
int b = 10;

do {
    System.out.println("do-while: " + b);  // EXECUTA: imprime "10"
    b++;                                    // b vira 11
} while (b < 5);         // Testa DEPOIS: 11 < 5? false

System.out.println("Final do-while: b = " + b);  // 11
```

**Saída:**
```
do-while: 10
Final while: a = 10
Final do-while: b = 11
```

**Conceito:** `while` executa **0 vezes**, `do-while` executa **1 vez** — diferença crítica.

### Tabela Verdade de Execuções

| Condição Inicial | while (Pre-Test) | do-while (Post-Test) |
|------------------|------------------|----------------------|
| `true` | Executa (1+ vezes) | Executa (1+ vezes) |
| `false` | **Não executa (0 vezes)** | **Executa (1 vez)** |

**Conceito:** Comportamentos diferem apenas quando condição é `false` inicialmente.

### Garantia Incondicional

**Exemplo Extremo: Condição Sempre Falsa**

```java
do {
    System.out.println("Sempre executa uma vez");
} while (false);  // Condição sempre falsa

// Saída: "Sempre executa uma vez"
```

**Uso (Raro mas Válido):** Executar código exatamente uma vez com sintaxe de loop (útil em macros/geração de código).

---

## 🔍 Análise Conceitual Profunda

### Caso Prático: Validação Deve Ocorrer Após Entrada

**Problema:**

Você **não pode** validar entrada antes de recebê-la — precisa pedir primeiro, depois validar.

```java
Scanner scanner = new Scanner(System.in);
int numero;

// do-while é NATURAL para este padrão
do {
    System.out.print("Digite número entre 1 e 10: ");
    numero = scanner.nextInt();

    if (numero < 1 || numero > 10) {
        System.out.println("Número fora do intervalo!");
    }
} while (numero < 1 || numero > 10);

System.out.println("Número válido: " + numero);
```

**Fluxo:**
1. **Primeira iteração:** Pede número (execução garantida)
2. Lê número
3. **Testa:** Válido?
4. Se não: **Repete** (pede novamente)
5. Se sim: **Termina**

**Alternativa com while (Duplicação):**

```java
// Pedir FORA do loop (duplicação)
System.out.print("Digite número entre 1 e 10: ");
int numero = scanner.nextInt();

// Repetir se inválido
while (numero < 1 || numero > 10) {
    System.out.println("Número fora do intervalo!");
    System.out.print("Digite número entre 1 e 10: ");  // DUPLICADO
    numero = scanner.nextInt();  // DUPLICADO
}
```

**Conceito:** `do-while` elimina duplicação — código de entrada aparece **uma vez**.

### Jogo: Executar Rodada Antes de Decidir Continuar

```java
Scanner scanner = new Scanner(System.in);
String jogarNovamente;

do {
    // SEMPRE joga pelo menos uma rodada
    jogarRodada();

    System.out.print("Jogar novamente? (s/n): ");
    jogarNovamente = scanner.nextLine();
} while (jogarNovamente.equalsIgnoreCase("s"));
```

**Conceito:** Usuário **sempre** joga minimamente — decisão de continuar vem **depois**.

### Retry Loop: Tentar pelo Menos Uma Vez

```java
int tentativas = 0;
boolean sucesso;

do {
    tentativas++;
    System.out.println("Tentando conectar... (tentativa " + tentativas + ")");

    sucesso = tentarConectar();

    if (!sucesso && tentativas < 3) {
        System.out.println("Falhou, tentando novamente em 1s...");
        Thread.sleep(1000);
    }
} while (!sucesso && tentativas < 3);

if (sucesso) {
    System.out.println("Conectado com sucesso!");
} else {
    System.out.println("Falha após " + tentativas + " tentativas.");
}
```

**Conceito:** **Sempre** tenta pelo menos uma vez — retry é condicional à falha.

---

## 🎯 Aplicabilidade e Contextos

### 1. Senha: Usuário Deve Tentar pelo Menos Uma Vez

```java
Scanner scanner = new Scanner(System.in);
final String SENHA_CORRETA = "admin123";
String senha;

do {
    System.out.print("Digite a senha: ");
    senha = scanner.nextLine();

    if (!senha.equals(SENHA_CORRETA)) {
        System.out.println("Senha incorreta!");
    }
} while (!senha.equals(SENHA_CORRETA));

System.out.println("Acesso concedido!");
```

### 2. Menu: Exibir pelo Menos Uma Vez

```java
Scanner scanner = new Scanner(System.in);
int opcao;

do {
    System.out.println("\n=== MENU ===");
    System.out.println("1. Cadastrar");
    System.out.println("2. Listar");
    System.out.println("3. Buscar");
    System.out.println("0. Sair");
    System.out.print("Escolha: ");

    opcao = scanner.nextInt();

    processarOpcao(opcao);
} while (opcao != 0);

System.out.println("Programa encerrado.");
```

### 3. Geração de Valores até Condição

```java
Random random = new Random();
int numero;

do {
    numero = random.nextInt(100);  // Gera pelo menos um número
    System.out.println("Gerado: " + numero);
} while (numero != 42);  // Continua até gerar 42

System.out.println("Encontrou 42!");
```

### 4. Leitura de Arquivo: Processar pelo Menos Uma Linha

```java
BufferedReader reader = new BufferedReader(new FileReader("dados.txt"));
String linha;

do {
    linha = reader.readLine();  // Lê pelo menos uma linha

    if (linha != null) {
        processar(linha);
    }
} while (linha != null);

reader.close();
```

---

## ⚠️ Limitações e Considerações

### 1. Execução Indesejada

Se condição é `false` desde início mas você **não quer** executar, `do-while` é **errado**:

```java
// Condição falsa, MAS executa uma vez (pode não ser desejado)
int x = 10;

do {
    processarCaro();  // Executará uma vez mesmo x >= 5
} while (x < 5);
```

**Usar while:**

```java
while (x < 5) {
    processarCaro();  // Não executa se x >= 5
}
```

### 2. Lógica de Condição Deve Ser Calculável Após Primeira Execução

**Problema:**

```java
do {
    // Condição depende de variável não inicializada
} while (x > 0);  // x não foi definido ainda!
```

**Solução:** Inicializar antes ou dentro do loop.

### 3. Menos Intuitivo para Iniciantes

`while` é mais intuitivo ("enquanto condição, faça") — `do-while` requer entender inversão (faça, depois verifique).

---

## 🔗 Interconexões Conceituais

### Relação com while

`do-while` é variante post-test de `while` — diferem apenas na ordem teste/execução.

### Relação com Validação de Entrada

Padrão clássico de `do-while` — pedir entrada até válida.

### Relação com Estado Inicial

Execução garantida permite inicializar estado **dentro** do loop antes de testar.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Casos de uso apropriados:** Quando preferir do-while vs while
2. **Validação de entrada:** Padrões e boas práticas
3. **break/continue:** Controle adicional em do-while

---

## 📚 Conclusão

**Execução garantida da primeira iteração** é característica definidora de `do-while` — bloco **sempre executa pelo menos uma vez**, independente da condição inicial. Diferença crítica com `while`: pre-test (testa antes) pode executar **zero vezes** se condição for `false`; post-test (`do-while`) executa **uma vez** mesmo se condição for `false` desde início. Essencial para **validação de entrada** (pedir antes de validar), **menus interativos** (exibir antes de decidir continuar), **retry loops** (tentar antes de verificar sucesso). Elimina **código duplicado** — lógica aparece uma vez, não "primeira vez fora + repetições dentro". Semântica **at-least-once** é mais natural que alternativas (`while` com flag artificial ou código duplicado). Condição é testada **após** primeira execução — permite inicializar estado dentro do loop antes de testar. Menos comum que `while` (~5% dos loops), mas quando necessário, é solução mais clara e concisa. Compreender garantia de execução é essencial para escolher entre `while` (zero-or-more) e `do-while` (at-least-once) baseado em semântica necessária.
