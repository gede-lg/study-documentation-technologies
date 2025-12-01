# Caso default em Switch

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Caso `default`** é label especial em switch que atua como **catch-all** — executa quando **nenhum `case` corresponde** ao valor da expressão. Conceitualmente, é o **else final** da estrutura switch, fornecendo **caminho de execução alternativo** para valores não previstos.

**Sintaxe:**

```java
switch (expressao) {
    case valor1:
        // código
        break;
    case valor2:
        // código
        break;
    default:
        // Executa se expressao != valor1 E != valor2
        break;  // Opcional se default é último
}
```

**Exemplo Básico:**

```java
int opcao = 99;

switch (opcao) {
    case 1:
        System.out.println("Opção 1");
        break;
    case 2:
        System.out.println("Opção 2");
        break;
    case 3:
        System.out.println("Opção 3");
        break;
    default:
        System.out.println("Opção inválida: " + opcao);
}
```

**Saída:** `Opção inválida: 99`

**Conceito Fundamental:** `default` é **opcional** mas fortemente recomendado — garante tratamento de **todos os valores possíveis**, incluindo casos inesperados.

### Contexto Histórico e Motivação

**Origem em C:**

`default` vem de C (1972), inspirado por construções similares em ALGOL e FORTRAN (`ELSE` em computed GOTO). Nome "default" sugere "comportamento padrão" quando nada mais se aplica.

**Motivação:**

1. **Completude:** Garantir que switch trata **todos** os valores possíveis
2. **Robustez:** Detectar valores inesperados/inválidos
3. **Fail-Safe:** Comportamento definido para casos não previstos
4. **Debugging:** Capturar bugs onde valor não deveria ocorrer

**Trade-off:** `default` opcional permite flexibilidade (não tratar alguns valores), mas pode esconder bugs (valores não tratados silenciosamente ignorados).

### Problema Fundamental que Resolve

**Problema: Valores Não Tratados**

Sem `default`, valores não correspondentes simplesmente **não executam nada**:

```java
int opcao = 99;

switch (opcao) {
    case 1:
        System.out.println("Um");
        break;
    case 2:
        System.out.println("Dois");
        break;
}
// Se opcao = 99, switch é "pulado" completamente
System.out.println("Continuando...");
```

**Saída:** `Continuando...` (nada sobre opção inválida!)

**Solução: default**

```java
switch (opcao) {
    case 1:
        System.out.println("Um");
        break;
    case 2:
        System.out.println("Dois");
        break;
    default:
        System.out.println("Opção inválida: " + opcao);
}
```

**Saída:** `Opção inválida: 99` (usuário informado!)

### Importância no Ecossistema

`default` é **crítico** em:

- **Validação de Entrada:** Detectar valores inválidos de usuários
- **Protocol Parsing:** Tratar comandos desconhecidos
- **Enums Extensíveis:** Lidar com valores adicionados no futuro
- **Defensive Programming:** Assumir que código terá valores inesperados

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Catch-All:** Executa quando nenhum `case` corresponde
2. **Opcional:** Não é obrigatório, mas recomendado
3. **Posição Flexível:** Pode estar em qualquer lugar (convenção: final)
4. **Não Requer break:** Se é último, `break` redundante (mas recomendado)
5. **Executa Uma Vez:** Apenas um `default` permitido por switch

### Pilares Fundamentais

- **Fallback Behavior:** Comportamento padrão para valores não previstos
- **Completeness:** Garante que todos os valores são tratados
- **Error Handling:** Captura valores inválidos/inesperados
- **Defensive Programming:** Assume que coisas inesperadas acontecem
- **Optional but Recommended:** Não obrigatório, mas boa prática

---

## 🧠 Fundamentos Teóricos

### Quando `default` Executa

**Condição:** Nenhum `case` corresponde ao valor da expressão.

```java
int x = 10;

switch (x) {
    case 1:
        A();
        break;
    case 2:
        B();
        break;
    default:
        C();  // Executa porque x != 1 E x != 2
}
```

**Processo:**
1. Avalia `x` → `10`
2. Compara com `case 1` → não corresponde
3. Compara com `case 2` → não corresponde
4. Executa `default` → `C()`

### default Pode Estar em Qualquer Posição

**Convenção: Final (Mais Comum)**

```java
switch (x) {
    case 1: A(); break;
    case 2: B(); break;
    default: C(); break;  // Convenção: último
}
```

**Mas Funciona no Meio:**

```java
switch (x) {
    case 1: A(); break;
    default: C(); break;  // Funciona, mas incomum
    case 2: B(); break;
}
```

**Conceito:** Ordem de `default` não afeta **quando** executa (sempre se nenhum case corresponde), mas afeta **fluxo** se houver fall-through.

**Fall-Through com default no Meio:**

```java
switch (x) {
    case 1:
        A();
        // Sem break! Fall-through
    default:
        C();  // Executa se x == 1 (fall-through) OU se nenhum case corresponde
        break;
    case 2:
        B();
        break;
}
```

**Conceito:** `default` no meio pode capturar **tanto** fall-through quanto valores não correspondentes — confuso! **Evitar.**

### default vs Último case

**Não São Equivalentes:**

```java
// Com default
switch (x) {
    case 1: A(); break;
    case 2: B(); break;
    default: C();  // Qualquer outro valor
}

// Sem default (apenas cases)
switch (x) {
    case 1: A(); break;
    case 2: B(); break;
    // Se x != 1 e != 2, nada executa
}
```

**Conceito:** `default` é semanticamente diferente — explicitamente trata "todos os outros valores".

### break em default

**Não Necessário se É Último:**

```java
switch (x) {
    case 1: A(); break;
    default: C();  // break redundante (já é final do switch)
}
```

**Mas Recomendado para Consistência:**

```java
switch (x) {
    case 1: A(); break;
    default: C(); break;  // Boa prática: consistência
}
```

**Necessário se Não É Último:**

```java
switch (x) {
    case 1: A(); break;
    default: C(); break;  // NECESSÁRIO (senão fall-through para case 2)
    case 2: B(); break;
}
```

---

## 🔍 Análise Conceitual Profunda

### default para Validação de Entrada

**Menu Interativo:**

```java
Scanner scanner = new Scanner(System.in);
System.out.println("1 - Novo");
System.out.println("2 - Abrir");
System.out.println("3 - Salvar");
System.out.print("Escolha: ");

int escolha = scanner.nextInt();

switch (escolha) {
    case 1:
        criarNovo();
        break;
    case 2:
        abrir();
        break;
    case 3:
        salvar();
        break;
    default:
        System.out.println("Opção inválida. Escolha 1-3.");
}
```

**Conceito:** `default` captura valores fora do range esperado (ex: usuário digita `99`).

### default com Enums (Defensivo)

**Enum:**

```java
enum Status {
    ATIVO, INATIVO, PENDENTE
}
```

**Switch sem default (Perigoso):**

```java
Status status = obterStatus();

switch (status) {
    case ATIVO:
        ativar();
        break;
    case INATIVO:
        desativar();
        break;
    case PENDENTE:
        aguardar();
        break;
    // Sem default!
}
```

**Problema:** Se futuramente adicionar `Status.SUSPENSO`, código compilará mas **não tratará** novo valor.

**Com default (Defensivo):**

```java
switch (status) {
    case ATIVO:
        ativar();
        break;
    case INATIVO:
        desativar();
        break;
    case PENDENTE:
        aguardar();
        break;
    default:
        throw new IllegalStateException("Status desconhecido: " + status);
}
```

**Conceito:** `default` com exceção **detecta** valores não previstos em runtime — fail-fast.

**Nota:** Compilador Java **não avisa** sobre enums não tratados em switch com `default`. Sem `default`, compilador pode avisar (depende do compilador/IDE).

### default para Logging/Debugging

**Capturar Valores Inesperados:**

```java
int codigo = processarRequisicao();

switch (codigo) {
    case 200:
        sucesso();
        break;
    case 404:
        naoEncontrado();
        break;
    case 500:
        erroServidor();
        break;
    default:
        logger.warn("Código HTTP inesperado: " + codigo);
        tratamentoGenerico();
}
```

**Conceito:** `default` registra valores anômalos para investigação posterior.

### default vs If-Else Final

**Switch com default:**

```java
switch (x) {
    case 1: A(); break;
    case 2: B(); break;
    default: C();
}
```

**Equivalente If-Else:**

```java
if (x == 1) {
    A();
} else if (x == 2) {
    B();
} else {
    C();  // Equivalente ao default
}
```

**Conceito:** `default` é análogo ao `else` final em cadeia if-else-if.

---

## 🎯 Aplicabilidade e Contextos

### 1. Validação de Opções de Menu

```java
switch (opcaoMenu) {
    case 1: novoArquivo(); break;
    case 2: abrirArquivo(); break;
    case 3: salvarArquivo(); break;
    default:
        System.out.println("Opção inválida!");
}
```

### 2. Protocol/Command Parsing

```java
char comando = lerComando();

switch (comando) {
    case 'N': criarNovo(); break;
    case 'O': abrir(); break;
    case 'S': salvar(); break;
    case 'Q': sair(); break;
    default:
        System.out.println("Comando desconhecido: " + comando);
}
```

### 3. State Machine com Estado Inválido

```java
Estado estado = obterEstado();

switch (estado) {
    case INICIAL: inicializar(); break;
    case PROCESSANDO: processar(); break;
    case FINALIZADO: finalizar(); break;
    default:
        throw new IllegalStateException("Estado inválido: " + estado);
}
```

### 4. Conversão de Códigos

```java
int codigoErro = obterCodigo();
String mensagem;

switch (codigoErro) {
    case 1: mensagem = "Arquivo não encontrado"; break;
    case 2: mensagem = "Permissão negada"; break;
    case 3: mensagem = "Disco cheio"; break;
    default:
        mensagem = "Erro desconhecido: " + codigoErro;
}

System.out.println(mensagem);
```

---

## ⚠️ Limitações e Considerações

### 1. Apenas Um default Permitido

```java
switch (x) {
    case 1: A(); break;
    default: B(); break;
    default: C(); break;  // ERRO de compilação: duplicate default label
}
```

### 2. default Não Captura null

```java
String s = null;

switch (s) {  // NullPointerException aqui!
    case "abc": A(); break;
    default: B();  // Nunca executa (exceção antes)
}
```

**Conceito:** `default` não trata `null` — `null` causa `NullPointerException` **antes** do switch avaliar cases.

**Mitigação:**

```java
if (s != null) {
    switch (s) {
        case "abc": A(); break;
        default: B();
    }
} else {
    tratarNull();
}
```

### 3. default com Enums: Trade-Off

**Sem default (Compilador Avisa):**

```java
enum Cor { VERMELHO, AZUL, VERDE }

Cor cor = Cor.VERMELHO;

switch (cor) {
    case VERMELHO: break;
    case AZUL: break;
    // Compilador pode avisar: missing case VERDE
}
```

**Com default (Compilador Não Avisa):**

```java
switch (cor) {
    case VERMELHO: break;
    case AZUL: break;
    default: break;  // Oculta VERDE faltante do compilador
}
```

**Conceito:** Adicionar `default` em enum switch pode **esconder** valores não tratados. Usar `default` com exceção se defensivo:

```java
switch (cor) {
    case VERMELHO: break;
    case AZUL: break;
    default:
        throw new IllegalArgumentException("Cor não tratada: " + cor);
}
```

### 4. default Não Implica "Inválido"

`default` captura **qualquer valor não correspondente** — pode ser válido ou inválido, depende da semântica:

```java
// default = inválido
switch (diaSemana) {
    case 1: case 2: case 3: case 4: case 5:
        trabalhar();
        break;
    case 6: case 7:
        descansar();
        break;
    default:
        System.out.println("Dia inválido");  // Valores como 99
}

// default = categoria "outros"
switch (categoria) {
    case "frutas": case "vegetais":
        secaoOrganicos();
        break;
    case "carnes":
        secaoFrigorífico();
        break;
    default:
        secaoGeral();  // Tudo mais (válido, mas não específico)
}
```

---

## 🔗 Interconexões Conceituais

### Relação com If-Else

`default` é equivalente ao `else` final em cadeia if-else-if.

### Relação com Enums

Switch + enum sem `default` permite compilador avisar sobre valores não tratados.

### Relação com Defensive Programming

`default` com exceção é técnica de fail-fast — detecta estados inválidos cedo.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Fall-Through Behavior:** Execução contínua entre cases
2. **Switch Expressions (Java 12+):** `default` obrigatório se switch retorna valor
3. **Pattern Matching (Java 17+):** `default` com types complexos

---

## 📚 Conclusão

**Caso `default`** é label especial em switch que atua como **catch-all** — executa quando **nenhum `case` corresponde**. É **opcional** mas fortemente recomendado para garantir **completude** (todos os valores tratados) e **robustez** (detectar valores inesperados). Pode estar em qualquer posição, mas **convenção** é final. `break` em `default` é redundante se é último, mas recomendado para consistência. Essencial em **validação de entrada** (menus, comandos), **protocol parsing**, e **defensive programming** (fail-fast com exceção). Não trata `null` (causa `NullPointerException` antes da avaliação). Trade-off com enums: adicionar `default` pode **esconder** valores não tratados do compilador — usar `default` com exceção (`throw new IllegalStateException()`) para fail-fast. Não implica necessariamente "inválido" — pode ser categoria "outros" válida. Equivalente ao `else` final em if-else-if. Java 12+ switch expressions requerem `default` (ou casos exaustivos) para garantir que expressão sempre retorna valor. Compreender `default` é essencial para switches robustos e completos.
