# Sintaxe Tradicional do Switch

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Estrutura `switch`** é mecanismo de **seleção múltipla** que permite executar diferentes blocos de código baseado no valor de uma **expressão**. Conceitualmente, é uma **tabela de decisão** — avalia expressão uma vez e a compara contra múltiplos casos (`case`), executando bloco correspondente.

**Sintaxe Básica:**

```java
switch (expressao) {
    case valor1:
        // Código executado se expressao == valor1
        break;
    case valor2:
        // Código executado se expressao == valor2
        break;
    default:
        // Código executado se nenhum case corresponder
}
```

**Exemplo Simples:**

```java
int dia = 3;

switch (dia) {
    case 1:
        System.out.println("Segunda");
        break;
    case 2:
        System.out.println("Terça");
        break;
    case 3:
        System.out.println("Quarta");  // Executa este caso
        break;
    default:
        System.out.println("Dia inválido");
}
```

**Conceito Fundamental:** `switch` avalia expressão **uma vez**, depois compara resultado contra cada `case` usando **igualdade** (`==`). Primeiro `case` que corresponde executa seu bloco até encontrar `break` ou fim do switch.

### Contexto Histórico e Motivação

**Origem em C:**

`switch` vem de C (1972), baseado em conceito de "jump table" — tabela de endereços que permite saltar diretamente para código correspondente. FORTRAN tinha construções similares (`COMPUTED GOTO`).

**Motivação:**

1. **Legibilidade:** `switch` é mais claro que `if-else-if` encadeado para múltiplas comparações
2. **Performance:** Compilador pode otimizar com jump tables (O(1) vs O(n) para if-else)
3. **Intenção Explícita:** Sinaliza "seleção entre valores específicos"

**Trade-off:** Mais legível para muitos casos, mas tem limitações (tipos suportados, fall-through confuso).

### Problema Fundamental que Resolve

**Alternativa Verbosa (if-else-if encadeado):**

```java
int opcao = 2;

if (opcao == 1) {
    System.out.println("Novo");
} else if (opcao == 2) {
    System.out.println("Abrir");
} else if (opcao == 3) {
    System.out.println("Salvar");
} else if (opcao == 4) {
    System.out.println("Sair");
} else {
    System.out.println("Opção inválida");
}
```

**Com switch (Mais Legível):**

```java
int opcao = 2;

switch (opcao) {
    case 1:
        System.out.println("Novo");
        break;
    case 2:
        System.out.println("Abrir");
        break;
    case 3:
        System.out.println("Salvar");
        break;
    case 4:
        System.out.println("Sair");
        break;
    default:
        System.out.println("Opção inválida");
}
```

**Vantagens:**
- Menos repetição de `opcao ==`
- Estrutura visual mais clara
- Compilador pode otimizar melhor

### Importância no Ecossistema

`switch` é essencial em:

- **Menus e Navegação:** Sistemas interativos com opções numeradas
- **State Machines:** Transições de estado baseadas em enum
- **Protocol Parsing:** Interpretar comandos/mensagens (ex: `case 'A': processar tipo A`)
- **Command Pattern:** Dispatcher de comandos

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Expressão Avaliada Uma Vez:** Eficiência — não reavalia a cada `case`
2. **Comparação por Igualdade:** Usa `==`, não `.equals()`
3. **Tipos Restritos:** Apenas tipos específicos suportados (int, char, String, enum)
4. **Execução Sequencial:** Após `case` correspondente, executa até `break`
5. **Fall-through:** Ausência de `break` causa execução contínua

### Pilares Fundamentais

- **Multi-Way Selection:** Escolha entre múltiplas opções
- **Single Evaluation:** Expressão avaliada uma vez
- **Jump Table Optimization:** Compilador pode otimizar para O(1)
- **Fall-Through Behavior:** Execução contínua entre cases (controlado por `break`)
- **Default Case:** Catch-all para valores não correspondentes

### Nuances Importantes

- **Constantes Compile-Time:** Valores `case` devem ser literais ou `final` (Java 7+: String)
- **Sem Ranges:** Não suporta intervalos (`case 1-5:` inválido)
- **Sem Expressões Complexas:** `case x > 5:` inválido
- **Switch Expression (Java 12+):** Nova sintaxe sem fall-through

---

## 🧠 Fundamentos Teóricos

### Anatomia Completa do Switch

**Componentes:**

```java
switch (selectorExpression) {   // Expressão seletor
    case constantValue1:         // Rótulo case
        statements1;             // Bloco de código
        break;                   // Palavra-chave break
    case constantValue2:
        statements2;
        break;
    default:                     // Rótulo default (opcional)
        defaultStatements;
}
```

**1. Expressão Seletor:** Avaliada uma vez, resultado comparado contra cases
**2. Rótulos `case`:** Valores constantes para comparação
**3. Bloco de Código:** Instruções executadas quando case corresponde
**4. `break`:** Sai do switch (sem ele, fall-through)
**5. `default`:** Executado se nenhum case corresponder (opcional)

### Avaliação e Comparação

**Processo:**

1. **Avaliação:** `expressao` avaliada, resultado armazenado temporariamente
2. **Comparação:** Resultado comparado contra cada `case` (ordem textual)
3. **Match:** Primeiro `case` que corresponde executa
4. **Execução:** Código executado até `break`, `return`, ou fim do switch

**Exemplo:**

```java
String dia = obterDia();  // Avaliado UMA vez

switch (dia) {           // Resultado armazenado
    case "Segunda":      // dia.equals("Segunda")? Não
    case "Terça":        // dia.equals("Terça")? Não
    case "Quarta":       // dia.equals("Quarta")? SIM → executa
        System.out.println("Meio de semana");
        break;
    // ...
}
```

**Conceito:** Expressão avaliada **uma vez** — eficiente para chamadas de método caras.

### Tipos Suportados (Tradicional)

**Java 5-:**
- `byte`, `short`, `char`, `int`
- **NÃO:** `long`, `float`, `double`, `boolean`

**Java 5+ (Enums):**
- `enum` types

**Java 7+ (Strings):**
- `String` (internamente usa `hashCode()` + `equals()`)

**Exemplo Multi-Tipo:**

```java
// int
int numero = 2;
switch (numero) {
    case 1: System.out.println("Um"); break;
    case 2: System.out.println("Dois"); break;
}

// char
char letra = 'A';
switch (letra) {
    case 'A': System.out.println("A"); break;
    case 'B': System.out.println("B"); break;
}

// String (Java 7+)
String cor = "vermelho";
switch (cor) {
    case "vermelho": System.out.println("Red"); break;
    case "azul": System.out.println("Blue"); break;
}

// enum
DayOfWeek dia = DayOfWeek.MONDAY;
switch (dia) {
    case MONDAY: System.out.println("Segunda"); break;
    case TUESDAY: System.out.println("Terça"); break;
}
```

### Valores `case` Devem Ser Constantes

**Compile-Time Constants:**

```java
final int UM = 1;
final int DOIS = 2;
int tres = 3;  // NÃO final

int x = 2;

switch (x) {
    case UM:    // OK (final)
    case DOIS:  // OK (final)
    case tres:  // ERRO de compilação! (não é constante)
}
```

**Conceito:** Compilador precisa conhecer valores `case` em compile-time para construir jump table. `final` garante que valor não muda.

**Literais (Sempre OK):**

```java
switch (x) {
    case 1:    // OK (literal)
    case 2:    // OK
    case 10:   // OK
}
```

---

## 🔍 Análise Conceitual Profunda

### Switch vs If-Else-If

**Quando Usar Switch:**

1. **Múltiplas Comparações de Igualdade:** 5+ valores específicos
2. **Valores Discretos:** Enums, códigos de status, opcodes
3. **Legibilidade:** Intenção clara de "escolha entre valores"

**Quando Usar If-Else:**

1. **Ranges:** `if (x >= 10 && x <= 20)`
2. **Expressões Complexas:** `if (x > y && z.isValid())`
3. **Diferentes Variáveis:** `if (a == 1) ... else if (b == 2)`

**Comparação:**

```java
// If-else: Expressões complexas
if (idade < 18) {
    System.out.println("Menor");
} else if (idade >= 18 && idade < 60) {
    System.out.println("Adulto");
} else {
    System.out.println("Idoso");
}

// Switch: Valores específicos
switch (codigo) {
    case 200: System.out.println("OK"); break;
    case 404: System.out.println("Not Found"); break;
    case 500: System.out.println("Error"); break;
}
```

### Exemplo Prático: Menu

```java
Scanner scanner = new Scanner(System.in);
System.out.println("1. Novo arquivo");
System.out.println("2. Abrir arquivo");
System.out.println("3. Salvar arquivo");
System.out.println("4. Sair");
System.out.print("Escolha: ");

int opcao = scanner.nextInt();

switch (opcao) {
    case 1:
        System.out.println("Criando novo arquivo...");
        criarNovoArquivo();
        break;
    case 2:
        System.out.println("Abrindo arquivo...");
        abrirArquivo();
        break;
    case 3:
        System.out.println("Salvando arquivo...");
        salvarArquivo();
        break;
    case 4:
        System.out.println("Saindo...");
        System.exit(0);
        break;
    default:
        System.out.println("Opção inválida!");
}
```

### Exemplo com Enum

```java
enum Operacao {
    SOMA, SUBTRACAO, MULTIPLICACAO, DIVISAO
}

Operacao op = Operacao.SOMA;
int a = 10, b = 5;
int resultado;

switch (op) {
    case SOMA:
        resultado = a + b;
        break;
    case SUBTRACAO:
        resultado = a - b;
        break;
    case MULTIPLICACAO:
        resultado = a * b;
        break;
    case DIVISAO:
        resultado = a / b;
        break;
    default:
        throw new IllegalStateException("Operação desconhecida: " + op);
}

System.out.println("Resultado: " + resultado);
```

**Conceito:** Enum + switch é combinação poderosa — compilador avisa se faltam cases.

### Exemplo com String (Java 7+)

```java
String comando = "listar";

switch (comando) {
    case "criar":
        System.out.println("Criando...");
        break;
    case "listar":
        System.out.println("Listando...");
        break;
    case "deletar":
        System.out.println("Deletando...");
        break;
    default:
        System.out.println("Comando desconhecido: " + comando);
}
```

**Implementação Interna (String):**

Java usa `hashCode()` primeiro (jump table), depois `equals()` para confirmar:

```java
// Equivalente interno (simplificado)
int hash = comando.hashCode();
switch (hash) {
    case 94746189:  // hashCode de "criar"
        if (comando.equals("criar")) {
            // código
        }
        break;
    // ...
}
```

---

## 🎯 Aplicabilidade e Contextos

### 1. Menus de Console

```java
switch (escolha) {
    case 1: iniciarJogo(); break;
    case 2: carregarJogo(); break;
    case 3: configuracoes(); break;
    case 4: sair(); break;
    default: System.out.println("Opção inválida");
}
```

### 2. State Machines

```java
enum Estado {
    AGUARDANDO, PROCESSANDO, CONCLUIDO, ERRO
}

Estado estadoAtual = Estado.AGUARDANDO;

switch (estadoAtual) {
    case AGUARDANDO:
        iniciarProcessamento();
        estadoAtual = Estado.PROCESSANDO;
        break;
    case PROCESSANDO:
        continuar();
        break;
    case CONCLUIDO:
        notificar();
        break;
    case ERRO:
        logar();
        break;
}
```

### 3. Parsing de Comandos

```java
char comando = buffer.read();

switch (comando) {
    case 'N':  // New
        criarNovo();
        break;
    case 'O':  // Open
        abrir();
        break;
    case 'S':  // Save
        salvar();
        break;
    case 'Q':  // Quit
        sair();
        break;
}
```

---

## ⚠️ Limitações e Considerações

### 1. Tipos Não Suportados

```java
// ERRO: long não suportado
long x = 100L;
switch (x) {  // Compile error
    case 1L: break;
}

// ERRO: boolean não suportado
boolean flag = true;
switch (flag) {  // Compile error
    case true: break;
}

// ERRO: double não suportado
double d = 1.5;
switch (d) {  // Compile error
    case 1.5: break;
}
```

**Solução:** Converter para tipo suportado ou usar if-else.

### 2. Valores `case` Duplicados

```java
switch (x) {
    case 1: break;
    case 1: break;  // ERRO de compilação: duplicate case label
}
```

### 3. `case` Não Pode Ser Variável

```java
int variavel = 10;
switch (x) {
    case variavel: break;  // ERRO: constant expression required
}

// OK com final
final int CONSTANTE = 10;
switch (x) {
    case CONSTANTE: break;  // OK
}
```

### 4. Null Safety

```java
String s = null;
switch (s) {  // NullPointerException em runtime!
    case "abc": break;
}
```

**Mitigação:**

```java
if (s != null) {
    switch (s) {
        case "abc": break;
    }
} else {
    // tratar null
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Enums

`switch` + enum é padrão — compilador avisa sobre cases faltantes.

### Relação com Pattern Matching (Java 17+)

Nova sintaxe permite tipos complexos e guards.

### Relação com If-Else

`switch` é especialização de if-else para igualdade em valores discretos.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Uso de `break`:** Controle de fall-through
2. **Caso `default`:** Catch-all para valores não correspondentes
3. **Fall-Through Behavior:** Execução contínua entre cases
4. **Switch Expressions (Java 12+):** Nova sintaxe sem fall-through
5. **Pattern Matching (Java 17+):** Tipos complexos em switch

---

## 📚 Conclusão

**Sintaxe tradicional do `switch`** é mecanismo de seleção múltipla que avalia expressão uma vez e compara contra múltiplos `case` usando igualdade (`==`). Suporta tipos restritos: inteiros pequenos (`byte`, `short`, `char`, `int`), `String` (Java 7+), e `enum`. Valores `case` devem ser constantes compile-time (literais ou `final`). Compilador pode otimizar com jump tables (O(1)). Mais legível que if-else-if para múltiplas comparações de igualdade, mas tem limitações: não suporta ranges, expressões complexas, ou tipos como `long`/`double`/`boolean`. Combinação com `enum` é padrão — compilador avisa sobre cases faltantes. `break` controla fall-through (execução contínua entre cases). `default` é catch-all opcional. Java 12+ introduziu switch expressions que eliminam necessidade de `break` e retornam valores diretamente. Compreender sintaxe tradicional é essencial para entender evolução para switch moderno.
