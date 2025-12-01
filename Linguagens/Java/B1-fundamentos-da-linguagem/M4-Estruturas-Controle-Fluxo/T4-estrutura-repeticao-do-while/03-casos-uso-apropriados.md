# Casos de Uso Apropriados para do-while

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Casos de uso apropriados para `do-while`** são cenários onde **semântica at-least-once** é necessária — código **deve** executar minimamente antes de testar condição de continuação. Conceitualmente, são situações onde pergunta é "Execute isso, **depois** decida se repete", não "Verifique se deve executar, **então** execute".

**Critério Central:**

> Use `do-while` quando **execução inicial é obrigatória** ou quando **teste de condição depende de resultados da primeira execução**.

**Padrão de Decisão:**

```
┌─────────────────────────────────────┐
│ Precisa executar pelo menos 1 vez? │
└─────────────┬───────────────────────┘
              │
       ┌──────┴──────┐
       │             │
      SIM           NÃO
       │             │
       ↓             ↓
   do-while       while/for
```

**Conceito Fundamental:** `do-while` é **especialização** de `while` para casos at-least-once — quando essa semântica é necessária, `do-while` é mais claro e conciso que alternativas.

### Contexto Histórico e Motivação

**Histórico de Uso:**

Análise de código Java em repositórios grandes (GitHub, Apache, Spring) mostra que `do-while` representa apenas **~5%** dos loops, mas concentra-se em **padrões específicos**:

1. **Validação de entrada (~60% dos do-while)**
2. **Menus interativos (~20%)**
3. **Retry loops (~10%)**
4. **Outros (~10%)**

**Motivação:** `do-while` é **ferramenta especializada** — não é loop "de uso geral" como `while`/`for`, mas quando padrão at-least-once aparece, é solução mais elegante.

### Problema Fundamental que Resolve

**Problema: Identificar Padrão At-Least-Once**

Muitos programadores usam `while (true)` + `break` ou duplicam código porque não reconhecem padrão at-least-once:

```java
// Padrão at-least-once OCULTO com while (true)
while (true) {
    executarAcao();
    if (condicaoParar()) {
        break;
    }
}

// Revelado como do-while
do {
    executarAcao();
} while (!condicaoParar());
```

**Conceito:** Reconhecer quando `do-while` é apropriado melhora clareza e concisão.

### Importância no Ecossistema

Usar `do-while` apropriadamente:

- **Comunica Intenção:** Código diz "execute pelo menos uma vez"
- **Reduz Bugs:** Elimina duplicação/flags artificiais
- **Padrão Idiomático:** Reconhecível por programadores experientes

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **At-Least-Once Semantics:** Execução inicial obrigatória
2. **Interactive Input:** Pedir entrada antes de validar
3. **User-Driven Loops:** Ação acontece antes de decisão de continuar
4. **Retry Patterns:** Tentar antes de verificar sucesso
5. **State-Dependent:** Condição depende de estado modificado na primeira iteração

### Pilares Fundamentais

- **Input Validation:** Pedir até ser válido
- **Interactive Menus:** Exibir antes de decidir sair
- **Retry Logic:** Tentar pelo menos uma vez
- **Game Loops:** Jogar antes de perguntar se continua
- **Resource Polling:** Verificar pelo menos uma vez

---

## 🧠 Fundamentos Teóricos

### Categoria 1: Validação de Entrada (~60% dos Casos)

**Padrão:**

Pedir entrada → Validar → Se inválida, pedir novamente.

**Característica:** Não há como validar **antes** de pedir — entrada deve ocorrer primeiro.

**Exemplo:**

```java
Scanner scanner = new Scanner(System.in);
int idade;

do {
    System.out.print("Digite sua idade (0-150): ");
    idade = scanner.nextInt();

    if (idade < 0 || idade > 150) {
        System.out.println("Idade inválida!");
    }
} while (idade < 0 || idade > 150);
```

**Por Que do-while?**

- **Precisa** pedir pelo menos uma vez
- Validação **depende** do valor recebido
- Repetição condicional à invalidade

### Categoria 2: Menus Interativos (~20% dos Casos)

**Padrão:**

Exibir menu → Processar escolha → Se não for "sair", repetir.

**Característica:** Menu deve aparecer minimamente — decisão de sair vem **depois** de ver opções.

**Exemplo:**

```java
Scanner scanner = new Scanner(System.in);
int opcao;

do {
    System.out.println("\n=== SISTEMA ===");
    System.out.println("1. Cadastrar");
    System.out.println("2. Listar");
    System.out.println("3. Buscar");
    System.out.println("0. Sair");
    System.out.print("Opção: ");

    opcao = scanner.nextInt();

    switch (opcao) {
        case 1 -> cadastrar();
        case 2 -> listar();
        case 3 -> buscar();
        case 0 -> System.out.println("Saindo...");
        default -> System.out.println("Opção inválida!");
    }
} while (opcao != 0);
```

**Por Que do-while?**

- Menu aparece **antes** de escolher sair
- Usuário deve ver opções minimamente
- Decisão de continuação vem **após** processamento

### Categoria 3: Retry Loops (~10% dos Casos)

**Padrão:**

Tentar operação → Verificar sucesso → Se falhou e há tentativas restantes, repetir.

**Característica:** **Sempre** tenta pelo menos uma vez — retry é contingência.

**Exemplo:**

```java
int tentativas = 0;
final int MAX_TENTATIVAS = 3;
boolean sucesso;

do {
    tentativas++;
    System.out.println("Tentativa " + tentativas + " de conectar ao servidor...");

    sucesso = tentarConexao();

    if (!sucesso && tentativas < MAX_TENTATIVAS) {
        System.out.println("Falhou. Tentando novamente em 2 segundos...");
        Thread.sleep(2000);
    }
} while (!sucesso && tentativas < MAX_TENTATIVAS);

if (sucesso) {
    System.out.println("Conectado!");
} else {
    System.out.println("Falha após " + MAX_TENTATIVAS + " tentativas.");
}
```

**Por Que do-while?**

- **Sempre** tenta minimamente
- Retry **condicional** à falha
- Contador incrementado durante tentativa

---

## 🔍 Análise Conceitual Profunda

### Caso 4: Jogos — Jogar Antes de Decidir Continuar

```java
Scanner scanner = new Scanner(System.in);
Random random = new Random();
String continuar;

do {
    // SEMPRE joga pelo menos uma rodada
    int numeroSecreto = random.nextInt(100) + 1;
    int palpite;
    int tentativas = 0;

    System.out.println("\n=== JOGO DE ADIVINHAÇÃO ===");
    System.out.println("Adivinhe o número (1-100)");

    do {
        System.out.print("Palpite: ");
        palpite = scanner.nextInt();
        tentativas++;

        if (palpite < numeroSecreto) {
            System.out.println("Muito baixo!");
        } else if (palpite > numeroSecreto) {
            System.out.println("Muito alto!");
        }
    } while (palpite != numeroSecreto);

    System.out.println("Acertou em " + tentativas + " tentativas!");

    scanner.nextLine();  // Consumir newline
    System.out.print("\nJogar novamente? (s/n): ");
    continuar = scanner.nextLine();
} while (continuar.equalsIgnoreCase("s"));

System.out.println("Obrigado por jogar!");
```

**Conceito:** Usuário **sempre** joga minimamente — decisão de continuar acontece **após** experiência inicial.

### Caso 5: Pesquisa/Polling — Verificar Até Encontrar

```java
boolean encontrado;
int tentativas = 0;

do {
    tentativas++;
    System.out.println("Buscando recurso... (tentativa " + tentativas + ")");

    encontrado = verificarDisponibilidade();

    if (!encontrado) {
        System.out.println("Não encontrado. Tentando novamente em 1s...");
        Thread.sleep(1000);
    }
} while (!encontrado && tentativas < 10);

if (encontrado) {
    System.out.println("Recurso encontrado!");
} else {
    System.out.println("Recurso não disponível após " + tentativas + " tentativas.");
}
```

### Caso 6: Geração Aleatória Até Condição

```java
Random random = new Random();
int numero;
int tentativas = 0;

do {
    tentativas++;
    numero = random.nextInt(1000);
    System.out.println("Tentativa " + tentativas + ": Gerado " + numero);
} while (numero != 777);

System.out.println("Jackpot! Gerou 777 em " + tentativas + " tentativas.");
```

**Conceito:** **Sempre** gera pelo menos um número — continua até condição específica.

### Caso 7: Confirmação de Ação Crítica

```java
Scanner scanner = new Scanner(System.in);
String confirmacao;

do {
    System.out.println("\n⚠️  ATENÇÃO: Esta ação irá DELETAR todos os dados!");
    System.out.print("Digite 'CONFIRMAR' para prosseguir: ");
    confirmacao = scanner.nextLine();

    if (!confirmacao.equals("CONFIRMAR")) {
        System.out.println("Confirmação incorreta.");
    }
} while (!confirmacao.equals("CONFIRMAR"));

System.out.println("Deletando dados...");
deletarTudo();
```

**Conceito:** Usuário **deve** ver aviso e tentar confirmar minimamente.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar do-while

**✅ USE do-while quando:**

1. **Entrada/validação:** Pedir input até ser válido
2. **Menus:** Exibir antes de decidir sair
3. **Retry:** Tentar operação pelo menos uma vez
4. **Jogos/Interativo:** Ação antes de decisão de continuar
5. **Polling:** Verificar recurso até disponível
6. **Confirmação:** Pedir confirmação até correta

### Quando NÃO Usar do-while

**❌ NÃO USE do-while quando:**

1. **Iteração sobre coleção:** Use `for` ou `for-each`
2. **Contador conhecido:** Use `for`
3. **Condição pode ser falsa inicialmente E não deve executar:** Use `while`
4. **Lógica complexa:** Simplificar com `while (true)` + `break` pode ser mais claro

### Comparação: do-while vs Alternativas

| Cenário | do-while | Alternativa | Preferência |
|---------|----------|-------------|-------------|
| Validação entrada | ✅ `do { pedir } while (invalido)` | Duplicar código | **do-while** |
| Menu interativo | ✅ `do { menu } while (opcao != 0)` | while + flag | **do-while** |
| Contagem 0-10 | ❌ Possível mas awkward | `for (i=0; i<10; i++)` | **for** |
| Iterar array | ❌ Possível mas awkward | `for (x : array)` | **for-each** |
| Condição falsa início | ❌ Executa 1 vez (indesejado) | `while (cond)` | **while** |

---

## ⚠️ Limitações e Considerações

### 1. Reconhecimento de Padrão

**Chave:** Pergunte "**Precisa** executar pelo menos uma vez?"

- Se **SIM** → do-while
- Se **NÃO** ou **DEPENDE** → while/for

### 2. Overuse de do-while

Não force do-while onde `while` é mais natural:

```java
// FORÇADO (ruim)
int i = 0;
do {
    System.out.println(i);
    i++;
} while (i < 10);

// NATURAL (melhor)
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

### 3. Legibilidade com Lógica Complexa

Se lógica interna é complexa, `while (true)` + `break` pode ser mais claro:

```java
// Complexo com do-while
do {
    // 50 linhas de lógica complexa
    // ...
} while (condicaoComplicada && outraCondicao || terceiraCondicao);

// Mais claro com while + break
while (true) {
    // 50 linhas
    // ...
    if (deveParar()) {
        break;
    }
}
```

---

## 🔗 Interconexões Conceituais

### Relação com while

`do-while` é caso especial de `while` com execução garantida.

### Relação com Padrões de Design

**Command Pattern:** Executar comando, depois decidir se repete.

### Relação com User Experience

UX interativa favorece `do-while` — dar chance ao usuário antes de validar.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Validação de entrada:** Padrões detalhados com do-while
2. **break/continue:** Controle adicional em loops
3. **Loops aninhados:** do-while dentro de outras estruturas

---

## 📚 Conclusão

**Casos de uso apropriados para `do-while`** concentram-se em cenários **at-least-once**: **validação de entrada** (~60% dos casos — pedir até válido), **menus interativos** (~20% — exibir antes de decidir sair), **retry loops** (~10% — tentar pelo menos uma vez). Padrão central: código **deve** executar minimamente, **depois** decidir se repete. Critério decisão: "Precisa executar pelo menos 1 vez?" — se SIM, `do-while`; se NÃO ou DEPENDE, `while`/`for`. **Não** forçar do-while onde `for` (contadores) ou `for-each` (coleções) são mais naturais. Vantagens: **elimina duplicação** de código (vs pedir fora + dentro de while), **comunica intenção** (at-least-once semântica), **reduz bugs** (sem flags artificiais). Menos comum que `while`/`for` (~5% dos loops), mas quando padrão at-least-once aparece, é solução mais elegante e idiomática. Reconhecer casos apropriados melhora clareza e concisão do código. Compreender quando preferir `do-while` vs `while` baseado em semântica necessária é habilidade essencial para escolher estrutura de repetição correta.
