# Sintaxe do do-while

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Loop `do-while`** é estrutura de repetição que **executa bloco de código** e **depois testa condição** — garante que código execute **pelo menos uma vez**, independente da condição inicial. Conceitualmente, é **loop com verificação posterior** (post-test loop) — inverso do `while` que verifica antes (pre-test loop).

**Sintaxe:**

```java
do {
    // Bloco de código
    // Executa PELO MENOS uma vez
} while (condicao);  // Testa DEPOIS da execução
```

**Fluxo:**

1. **Executa** bloco `do { ... }`
2. **Testa** condição `while (condicao)`
3. Se `true`: **repete** (volta ao passo 1)
4. Se `false`: **termina** loop

**Exemplo Básico:**

```java
int i = 0;

do {
    System.out.println("Iteração: " + i);
    i++;
} while (i < 3);

// Saída:
// Iteração: 0
// Iteração: 1
// Iteração: 2
```

**Conceito Fundamental:** Diferença crítica com `while`: `do-while` **sempre executa pelo menos uma vez**, mesmo se condição for `false` inicialmente.

**Comparação:**

```java
// while (condição falsa desde início)
int x = 10;
while (x < 5) {
    System.out.println("Nunca executa");  // Nunca imprime
}

// do-while (condição falsa desde início)
int y = 10;
do {
    System.out.println("Executa uma vez");  // Imprime UMA VEZ
} while (y < 5);
```

### Contexto Histórico e Motivação

**Origem:**

`do-while` vem de C (1972), que herdou de B. Estrutura existe em praticamente todas as linguagens imperativas (C++, Java, C#, JavaScript). Algumas linguagens modernas (Rust, Swift) não têm equivalente direto — preferem `loop` + `break`.

**Motivação:**

1. **Garantia de Execução:** Cenários onde código **deve** executar pelo menos uma vez
2. **Validação de Entrada:** Pedir input até ser válido
3. **Menu Interativo:** Exibir menu pelo menos uma vez
4. **Simetria:** Complementa `while` (pre-test vs post-test)

**Trade-off:** Uso é **mais raro** que `while` (maioria dos loops não garante execução inicial) — mas quando necessário, é mais claro que alternativas (`while (true)` + `break`).

### Problema Fundamental que Resolve

**Problema: Loop Deve Executar Antes de Testar**

Cenário comum: pedir entrada do usuário até ser válida.

**Sem do-while (Repetição de Código):**

```java
Scanner scanner = new Scanner(System.in);

// Primeira vez (fora do loop)
System.out.print("Digite número positivo: ");
int numero = scanner.nextInt();

// Repetir se inválido
while (numero <= 0) {
    System.out.print("Inválido! Digite número positivo: ");
    numero = scanner.nextInt();  // Código REPETIDO
}

System.out.println("Número válido: " + numero);
```

**Com do-while (Sem Repetição):**

```java
Scanner scanner = new Scanner(System.in);
int numero;

do {
    System.out.print("Digite número positivo: ");
    numero = scanner.nextInt();
} while (numero <= 0);

System.out.println("Número válido: " + numero);
```

**Conceito:** `do-while` elimina duplicação — código de entrada aparece **apenas uma vez**.

### Importância no Ecossistema

`do-while` é essencial em:

- **Validação de Entrada:** Loops até input válido
- **Menus Interativos:** Exibir pelo menos uma vez
- **Retry Loops:** Tentar operação até sucesso
- **At-Least-Once Semantics:** Quando código deve executar minimamente

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Post-Test Loop:** Condição testada **depois** da execução
2. **Execução Garantida:** Bloco executa **pelo menos uma vez**
3. **Semicolon Obrigatório:** `while (condicao);` termina com `;`
4. **Escopo de Variáveis:** Variáveis declaradas em `do` não visíveis em `while`
5. **Inverso de while:** Pre-test (`while`) vs post-test (`do-while`)

### Pilares Fundamentais

- **Post-Test Semantics:** Executa → testa
- **At-Least-Once Execution:** Sempre executa minimamente
- **Loop Condition:** Mesma semântica de `while` (repetir se `true`)
- **Statement Terminator:** Semicolon obrigatório após `while (condicao)`
- **Variable Scope:** Variáveis em `do` não acessíveis em condição `while`

---

## 🧠 Fundamentos Teóricos

### Anatomia Completa

```java
do {                          // Palavra-chave 'do'
    // Bloco de código         // Executa primeiro
    statement1;
    statement2;
    ...
} while (condicao);          // 'while' + condição + ';'
//                 ↑
//          Semicolon obrigatório!
```

**Componentes:**

1. **`do`:** Palavra-chave inicia loop
2. **Bloco `{ ... }`:** Código a repetir
3. **`while (condicao)`:** Teste de continuação
4. **`;`:** Terminador obrigatório

### Fluxo de Controle Detalhado

**Diagrama:**

```
   ┌─────────────┐
   │   do {      │
   │   código    │ ← Executa
   │   }         │
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │ while(cond)?│ ← Testa
   └──────┬──────┘
          ↓
    true ╱│╲ false
        ╱ │ ╲
       ↙  ↓  ↘
   Volta  Termina
```

**Execução:**

```java
int i = 0;

do {
    System.out.println(i);  // 1. Executa (i=0 → imprime 0)
    i++;                    // 2. Incrementa (i=1)
} while (i < 3);            // 3. Testa (1 < 3? true → repete)

// Iteração 2: imprime 1, i=2, testa (2 < 3? true → repete)
// Iteração 3: imprime 2, i=3, testa (3 < 3? false → termina)
```

### Diferença Crucial com while

**while (Pre-Test):**

```java
int x = 10;

while (x < 5) {          // Testa ANTES
    System.out.println(x);  // NUNCA executa
    x++;
}
```

**do-while (Post-Test):**

```java
int x = 10;

do {
    System.out.println(x);  // Executa UMA VEZ (imprime 10)
    x++;
} while (x < 5);         // Testa DEPOIS (11 < 5? false → termina)
```

**Conceito:** `while` pode executar **zero vezes**; `do-while` executa **pelo menos uma vez**.

### Semicolon Obrigatório

**Correto:**

```java
do {
    System.out.println("Ok");
} while (false);  // Semicolon presente
```

**Erro:**

```java
do {
    System.out.println("Erro");
} while (false)  // ERRO: esperado ';'
```

**Conceito:** `while (condicao);` é **statement completo** — precisa de terminador.

### Escopo de Variáveis

**Problema: Variável em do Não Visível em while**

```java
do {
    int x = 10;  // Declarada dentro do do
    System.out.println(x);
} while (x < 5);  // ERRO: x não está no escopo
```

**Solução: Declarar Antes**

```java
int x;  // Declarada fora

do {
    x = 10;  // Atribuída dentro
    System.out.println(x);
} while (x < 5);  // OK: x visível
```

**Conceito:** Variáveis declaradas dentro de `do { ... }` têm escopo **apenas no bloco** — não visíveis em `while (condicao)`.

---

## 🔍 Análise Conceitual Profunda

### Loop Infinito com do-while

**Condição Sempre Verdadeira:**

```java
do {
    System.out.println("Loop infinito");
} while (true);

// Nunca termina (a menos que break/return)
```

**Uso com break:**

```java
do {
    System.out.print("Digite 'sair' para terminar: ");
    String input = scanner.nextLine();

    if (input.equals("sair")) {
        break;  // Sai do loop
    }

    System.out.println("Você digitou: " + input);
} while (true);
```

### Contadores em do-while

**Padrão Comum:**

```java
int contador = 1;

do {
    System.out.println("Contagem: " + contador);
    contador++;
} while (contador <= 5);

// Saída: 1, 2, 3, 4, 5
```

**Conceito:** Similar a `for`, mas menos conciso — `for` preferido para contadores conhecidos.

### Loop Controlado por Flag

```java
boolean continuar;

do {
    System.out.print("Processar item? (s/n): ");
    String resposta = scanner.nextLine();

    if (resposta.equals("s")) {
        processarItem();
        continuar = true;
    } else {
        continuar = false;
    }
} while (continuar);
```

---

## 🎯 Aplicabilidade e Contextos

### 1. Validação de Entrada

```java
Scanner scanner = new Scanner(System.in);
int idade;

do {
    System.out.print("Digite sua idade (1-150): ");
    idade = scanner.nextInt();

    if (idade < 1 || idade > 150) {
        System.out.println("Idade inválida!");
    }
} while (idade < 1 || idade > 150);

System.out.println("Idade válida: " + idade);
```

### 2. Menu Interativo

```java
Scanner scanner = new Scanner(System.in);
int opcao;

do {
    System.out.println("\n=== MENU ===");
    System.out.println("1. Novo");
    System.out.println("2. Abrir");
    System.out.println("3. Salvar");
    System.out.println("0. Sair");
    System.out.print("Opção: ");

    opcao = scanner.nextInt();

    switch (opcao) {
        case 1 -> criarNovo();
        case 2 -> abrir();
        case 3 -> salvar();
        case 0 -> System.out.println("Saindo...");
        default -> System.out.println("Opção inválida!");
    }
} while (opcao != 0);
```

### 3. Retry Loop (Tentativas)

```java
int tentativas = 0;
boolean sucesso;

do {
    tentativas++;
    System.out.println("Tentativa " + tentativas + " de conectar...");

    sucesso = tentarConectar();

    if (!sucesso && tentativas < 3) {
        System.out.println("Falhou. Tentando novamente...");
        Thread.sleep(1000);  // Aguarda 1 segundo
    }
} while (!sucesso && tentativas < 3);

if (sucesso) {
    System.out.println("Conectado!");
} else {
    System.out.println("Falha após " + tentativas + " tentativas.");
}
```

### 4. Jogo Simples

```java
Scanner scanner = new Scanner(System.in);
Random random = new Random();
int numeroSecreto = random.nextInt(100) + 1;
int palpite;
int tentativas = 0;

System.out.println("Adivinhe o número (1-100)");

do {
    tentativas++;
    System.out.print("Palpite: ");
    palpite = scanner.nextInt();

    if (palpite < numeroSecreto) {
        System.out.println("Muito baixo!");
    } else if (palpite > numeroSecreto) {
        System.out.println("Muito alto!");
    }
} while (palpite != numeroSecreto);

System.out.println("Acertou em " + tentativas + " tentativas!");
```

---

## ⚠️ Limitações e Considerações

### 1. Uso Menos Comum

`do-while` é **menos usado** que `while` ou `for` — apenas ~5% dos loops em código típico.

**Razão:** Maioria dos loops não garante execução inicial.

### 2. Pode Ser Substituído por while

```java
// do-while
do {
    codigo();
} while (condicao);

// Equivalente com while
codigo();  // Executa uma vez fora do loop
while (condicao) {
    codigo();  // Repete
}
```

**Conceito:** `do-while` é **mais conciso** quando necessário, mas `while` é mais geral.

### 3. Semicolon Esquecido

```java
// Bug comum (compilador detecta)
do {
    System.out.println("Bug");
} while (true)  // Faltou ';'
```

### 4. Condição Nunca True

```java
// Inútil: executa uma vez e termina
do {
    System.out.println("Uma vez só");
} while (false);

// Melhor: Apenas executar diretamente
System.out.println("Uma vez só");
```

---

## 🔗 Interconexões Conceituais

### Relação com while

`do-while` é variante post-test de `while` (pre-test).

### Relação com for

Todos são loops, mas `for` é preferido para contadores conhecidos.

### Relação com break/continue

Funcionam igual em `do-while` — `break` sai, `continue` pula para teste de condição.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Diferença while vs do-while:** Comparação detalhada
2. **Casos de uso apropriados:** Quando preferir cada loop
3. **Validação de entrada:** Padrões com do-while
4. **break/continue:** Controle de fluxo em loops

---

## 📚 Conclusão

**Loop `do-while`** é estrutura de repetição **post-test** que **executa bloco primeiro** e **testa condição depois** — garante execução **pelo menos uma vez**, mesmo se condição for `false` inicialmente. Sintaxe: `do { codigo } while (condicao);` com semicolon obrigatório. Diferença crítica com `while`: pre-test (testa antes) pode executar zero vezes; post-test (`do-while`) executa mínimo uma vez. Essencial em **validação de entrada** (pedir até ser válido), **menus interativos** (exibir pelo menos uma vez), **retry loops** (tentar até sucesso). Variáveis declaradas em `do { ... }` não visíveis em `while (condicao)` — declarar antes do loop. Menos comum que `while`/`for` (~5% dos loops) — mas quando necessário, é mais conciso que alternativas (`while` + código duplicado ou `while(true)` + `break`). Pode criar loop infinito com `while (true)`. Compreender `do-while` e diferença com `while` é essencial para escolher estrutura correta baseada em semântica necessária (at-least-once vs zero-or-more).
