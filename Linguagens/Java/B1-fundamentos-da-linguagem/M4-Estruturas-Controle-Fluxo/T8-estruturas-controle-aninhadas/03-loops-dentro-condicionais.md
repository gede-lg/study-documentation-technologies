# Loops dentro de Condicionais

## 🎯 Introdução e Definição

### Definição Conceitual

**Loops dentro de condicionais** são estruturas de repetição (for, while, do-while, for-each) **colocadas dentro do corpo** de estruturas de decisão (if, else, switch). Essa composição permite **executar iterações condicionalmente**, realizar **loops diferentes** conforme cenários, e implementar **lógica de repetição seletiva** baseada em condições avaliadas **antes** da repetição iniciar.

**Estrutura visual**:
```java
if (condicao) {                        // Decisão
    for (tipo elemento : colecao) {    // Repetição apenas se true
        // Processa elementos
    }
} else {
    // Outra lógica ou outro loop
}
```

**Exemplo fundamental**:
```java
Scanner sc = new Scanner(System.in);
System.out.print("Processar dados? (s/n): ");
String resposta = sc.nextLine();

if (resposta.equalsIgnoreCase("s")) {
    // Loop executa APENAS se usuário confirmar
    for (int i = 1; i <= 5; i++) {
        System.out.println("Processando item " + i);
    }
    System.out.println("Processamento concluído");
} else {
    System.out.println("Processamento cancelado");
}
```

---

## 📋 Sumário Conceitual

### Padrões de Uso

| Padrão | Estrutura | Finalidade |
|--------|-----------|------------|
| **Loop condicional** | `if (cond) { for(...) }` | Executar iteração apenas se condição satisfeita |
| **Loops alternativos** | `if {...} else { for(...) }` | Loops diferentes conforme cenário |
| **Switch com loops** | `case: for(...) break;` | Loop específico para cada caso |
| **Validação prévia** | `if (valido) { while(...) }` | Validar antes de iterar |
| **Iteração seletiva** | `if (modo) { for } else { while }` | Tipo de loop baseado em configuração |

---

## 🧠 Fundamentos Teóricos

### 1. for dentro de if

**Execução condicional simples**:
```java
int[] numeros = {10, 23, 45, 67, 89};
boolean exibir = true;

if (exibir) {
    for (int num : numeros) {
        System.out.println(num);
    }
}

// Se exibir=false, loop não executa
```

**Processamento baseado em flag**:
```java
boolean debug = true;
String[] logs = {"INFO", "DEBUG", "ERROR", "WARNING"};

if (debug) {
    System.out.println("=== MODO DEBUG ===");
    for (String log : logs) {
        System.out.println("[DEBUG] " + log);
    }
}
```

**Validação antes de iterar**:
```java
int[] valores = {5, 10, 15, 20};

if (valores != null && valores.length > 0) {
    // Loop seguro, array válido
    for (int valor : valores) {
        processar(valor);
    }
} else {
    System.out.println("Array vazio ou nulo");
}
```

### 2. for dentro de if-else

**Loops diferentes por cenário**:
```java
int[] numeros = {1, 2, 3, 4, 5};
boolean crescente = true;

if (crescente) {
    // Itera ordem normal
    for (int i = 0; i < numeros.length; i++) {
        System.out.print(numeros[i] + " ");
    }
} else {
    // Itera ordem reversa
    for (int i = numeros.length - 1; i >= 0; i--) {
        System.out.print(numeros[i] + " ");
    }
}
System.out.println();

// crescente=true: 1 2 3 4 5
// crescente=false: 5 4 3 2 1
```

**Processamento diferente**:
```java
double[] valores = {100.0, 200.0, 300.0};
boolean aplicarDesconto = true;

if (aplicarDesconto) {
    System.out.println("COM DESCONTO:");
    for (double valor : valores) {
        double desconto = valor * 0.10;
        System.out.printf("R$%.2f → R$%.2f%n", valor, valor - desconto);
    }
} else {
    System.out.println("SEM DESCONTO:");
    for (double valor : valores) {
        System.out.printf("R$%.2f%n", valor);
    }
}
```

**Range diferente**:
```java
Scanner sc = new Scanner(System.in);
System.out.print("Modo resumido? (s/n): ");
String modo = sc.nextLine();

if (modo.equalsIgnoreCase("s")) {
    // Exibe apenas primeiros 5
    for (int i = 0; i < 5 && i < itens.length; i++) {
        System.out.println(itens[i]);
    }
} else {
    // Exibe todos
    for (String item : itens) {
        System.out.println(item);
    }
}
```

### 3. while dentro de if

**Loop com condição externa**:
```java
int tentativas = 0;
int maxTentativas = 3;
boolean permitirRetentativa = true;

if (permitirRetentativa) {
    while (tentativas < maxTentativas) {
        System.out.println("Tentativa " + (tentativas + 1));
        // Tenta conectar
        boolean sucesso = tentarConectar();
        if (sucesso) {
            System.out.println("Conectado!");
            break;
        }
        tentativas++;
    }
    
    if (tentativas >= maxTentativas) {
        System.out.println("Falha após " + maxTentativas + " tentativas");
    }
} else {
    System.out.println("Retentativa desabilitada");
}
```

**Leitura condicional**:
```java
Scanner sc = new Scanner(System.in);
boolean lerDados = true;

if (lerDados) {
    System.out.println("Digite valores (0 para parar):");
    int valor;
    while ((valor = sc.nextInt()) != 0) {
        System.out.println("Você digitou: " + valor);
    }
}
```

### 4. do-while dentro de if

**Menu condicional**:
```java
boolean exibirMenu = true;

if (exibirMenu) {
    int opcao;
    do {
        System.out.println("1 - Opção A");
        System.out.println("2 - Opção B");
        System.out.println("0 - Sair");
        System.out.print("Escolha: ");
        opcao = sc.nextInt();
        
        if (opcao == 1) {
            System.out.println("Executando A");
        } else if (opcao == 2) {
            System.out.println("Executando B");
        }
    } while (opcao != 0);
}
```

**Validação obrigatória**:
```java
if (validarEntrada) {
    int idade;
    do {
        System.out.print("Digite sua idade (0-120): ");
        idade = sc.nextInt();
        if (idade < 0 || idade > 120) {
            System.out.println("Idade inválida!");
        }
    } while (idade < 0 || idade > 120);
    
    System.out.println("Idade aceita: " + idade);
}
```

### 5. switch com for em Cada case

**Loops diferentes por caso**:
```java
System.out.print("Escolha o formato (1-Lista, 2-Tabela, 3-JSON): ");
int formato = sc.nextInt();

switch (formato) {
    case 1:
        // Formato lista
        System.out.println("LISTA:");
        for (String item : itens) {
            System.out.println("- " + item);
        }
        break;
        
    case 2:
        // Formato tabela
        System.out.println("TABELA:");
        for (int i = 0; i < itens.length; i++) {
            System.out.printf("%2d | %s%n", i + 1, itens[i]);
        }
        break;
        
    case 3:
        // Formato JSON
        System.out.println("[");
        for (int i = 0; i < itens.length; i++) {
            System.out.print("  \"" + itens[i] + "\"");
            if (i < itens.length - 1) System.print(",");
            System.out.println();
        }
        System.out.println("]");
        break;
        
    default:
        System.out.println("Formato inválido");
}
```

**Processamento por categoria**:
```java
System.out.print("Tipo de relatório (V-Vendas, E-Estoque, F-Financeiro): ");
char tipo = sc.next().toUpperCase().charAt(0);

switch (tipo) {
    case 'V':
        System.out.println("=== VENDAS ===");
        for (Venda venda : vendas) {
            System.out.println(venda);
        }
        break;
        
    case 'E':
        System.out.println("=== ESTOQUE ===");
        for (Produto produto : produtos) {
            System.out.println(produto.getNome() + ": " + produto.getQuantidade());
        }
        break;
        
    case 'F':
        System.out.println("=== FINANCEIRO ===");
        for (Transacao transacao : transacoes) {
            System.out.println(transacao);
        }
        break;
        
    default:
        System.out.println("Tipo inválido");
}
```

### 6. if-else if com Loops

**Múltiplas condições, loops diferentes**:
```java
int quantidade = produtos.size();

if (quantidade == 0) {
    System.out.println("Nenhum produto");
} else if (quantidade <= 5) {
    // Poucos: exibe detalhado
    System.out.println("DETALHADO:");
    for (Produto p : produtos) {
        System.out.println("Nome: " + p.getNome());
        System.out.println("Preço: R$" + p.getPreco());
        System.out.println("Estoque: " + p.getQuantidade());
        System.out.println("---");
    }
} else {
    // Muitos: exibe resumido
    System.out.println("RESUMO:");
    for (Produto p : produtos) {
        System.out.println(p.getNome() + " - R$" + p.getPreco());
    }
}
```

**Faixas de valores**:
```java
int nivel = usuario.getNivel();

if (nivel == 1) {
    // Admin: acesso total
    for (String recurso : todosRecursos) {
        System.out.println("Acesso: " + recurso);
    }
} else if (nivel == 2) {
    // Moderador: recursos limitados
    for (String recurso : recursosModerador) {
        System.out.println("Acesso: " + recurso);
    }
} else {
    // Usuário: básico
    for (String recurso : recursosBasicos) {
        System.out.println("Acesso: " + recurso);
    }
}
```

### 7. Loop Aninhado dentro de if

**Matriz condicional**:
```java
boolean exibirMatriz = true;

if (exibirMatriz) {
    int[][] matriz = {{1,2,3}, {4,5,6}, {7,8,9}};
    
    for (int i = 0; i < matriz.length; i++) {
        for (int j = 0; j < matriz[i].length; j++) {
            System.out.print(matriz[i][j] + " ");
        }
        System.out.println();
    }
}
```

**Processamento bidimensional seletivo**:
```java
if (calcularMedias) {
    double[][] notas = {{7.5, 8.0}, {6.0, 9.0}, {8.5, 7.5}};
    
    for (int i = 0; i < notas.length; i++) {
        double soma = 0;
        for (int j = 0; j < notas[i].length; j++) {
            soma += notas[i][j];
        }
        double media = soma / notas[i].length;
        System.out.printf("Aluno %d: %.2f%n", i + 1, media);
    }
}
```

### 8. Validação Complexa Antes de Loop

**Múltiplas validações**:
```java
String[] dados = lerDados();

if (dados != null && dados.length > 0) {
    boolean todosValidos = true;
    
    // Valida todos antes de processar
    for (String dado : dados) {
        if (dado == null || dado.isEmpty()) {
            todosValidos = false;
            break;
        }
    }
    
    if (todosValidos) {
        // Loop de processamento
        for (String dado : dados) {
            processar(dado);
        }
    } else {
        System.out.println("Dados inválidos detectados");
    }
} else {
    System.out.println("Nenhum dado para processar");
}
```

**Permissões**:
```java
if (usuario.isAutenticado()) {
    if (usuario.temPermissao("LEITURA")) {
        System.out.println("REGISTROS:");
        for (Registro registro : registros) {
            System.out.println(registro);
        }
    } else {
        System.out.println("Sem permissão de leitura");
    }
} else {
    System.out.println("Usuário não autenticado");
}
```

### 9. Loops de Configuração

**Loop baseado em configuração**:
```java
Configuracao config = carregarConfig();

if (config.isVerbose()) {
    // Modo verboso: muitos detalhes
    for (int i = 0; i < processos.size(); i++) {
        System.out.println("Processo " + i + ":");
        System.out.println("  Nome: " + processos.get(i).getNome());
        System.out.println("  Status: " + processos.get(i).getStatus());
        System.out.println("  Tempo: " + processos.get(i).getTempo());
    }
} else {
    // Modo normal: apenas essencial
    for (Processo p : processos) {
        System.out.println(p.getNome() + " - " + p.getStatus());
    }
}
```

**Limites dinâmicos**:
```java
int limite = config.getLimiteExibicao();

if (limite > 0) {
    // Exibe apenas 'limite' itens
    for (int i = 0; i < Math.min(limite, itens.size()); i++) {
        System.out.println(itens.get(i));
    }
} else {
    // Exibe todos
    for (String item : itens) {
        System.out.println(item);
    }
}
```

### 10. Padrões de Retry e Fallback

**Retry com fallback**:
```java
boolean sucesso = false;

if (tentarConexaoPrimaria) {
    for (int i = 0; i < 3 && !sucesso; i++) {
        sucesso = conectarPrimario();
        if (!sucesso) {
            System.out.println("Tentativa " + (i + 1) + " falhou");
        }
    }
}

if (!sucesso && tentarConexaoSecundaria) {
    System.out.println("Tentando servidor secundário...");
    for (int i = 0; i < 3 && !sucesso; i++) {
        sucesso = conectarSecundario();
    }
}

if (!sucesso) {
    System.out.println("Todas as tentativas falharam");
}
```

**Loop com timeout**:
```java
if (usarTimeout) {
    long inicio = System.currentTimeMillis();
    long timeout = 5000;  // 5 segundos
    
    while (!concluido && (System.currentTimeMillis() - inicio) < timeout) {
        processar();
        Thread.sleep(100);
    }
    
    if (!concluido) {
        System.out.println("Timeout: processo não concluído em 5s");
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Cenário 1: Relatório Condicional

```java
boolean gerarRelatorio = true;
boolean incluirDetalhes = false;

if (gerarRelatorio) {
    System.out.println("=== RELATÓRIO ===");
    
    for (Venda venda : vendas) {
        System.out.println("Venda #" + venda.getId());
        
        if (incluirDetalhes) {
            System.out.println("  Cliente: " + venda.getCliente());
            System.out.println("  Data: " + venda.getData());
            System.out.println("  Itens:");
            for (Item item : venda.getItens()) {
                System.out.println("    - " + item);
            }
        }
    }
}
```

### Cenário 2: Processamento por Modo

```java
String modo = args.length > 0 ? args[0] : "normal";

switch (modo) {
    case "teste":
        System.out.println("MODO TESTE:");
        for (int i = 0; i < 5; i++) {
            System.out.println("Teste " + i);
        }
        break;
        
    case "producao":
        System.out.println("MODO PRODUÇÃO:");
        for (Tarefa tarefa : tarefas) {
            executar(tarefa);
        }
        break;
        
    default:
        System.out.println("MODO NORMAL:");
        for (int i = 0; i < tarefas.size(); i++) {
            System.out.println("Processando " + (i + 1) + "/" + tarefas.size());
            executar(tarefas.get(i));
        }
}
```

### Cenário 3: Validação Multi-Nível

```java
if (arquivo.exists()) {
    if (arquivo.canRead()) {
        try (BufferedReader br = new BufferedReader(new FileReader(arquivo))) {
            String linha;
            while ((linha = br.readLine()) != null) {
                System.out.println(linha);
            }
        }
    } else {
        System.out.println("Sem permissão de leitura");
    }
} else {
    System.out.println("Arquivo não existe");
}
```

---

## ⚠️ Armadilhas Comuns

### 1. **Loop Sempre Executado (Falta if)**

```java
// ❌ Loop sempre executa
for (int i = 0; i < dados.length; i++) {
    processar(dados[i]);  // E se dados estiver vazio/nulo?
}

// ✅ Valide antes
if (dados != null && dados.length > 0) {
    for (int i = 0; i < dados.length; i++) {
        processar(dados[i]);
    }
}
```

### 2. **if Desnecessário (Loop Já Valida)**

```java
// ❌ Redundante
if (lista.size() > 0) {
    for (int i = 0; i < lista.size(); i++) {
        // for já não executaria se size() == 0
    }
}

// ✅ Simplificado
for (int i = 0; i < lista.size(); i++) {
    // ...
}
```

### 3. **Loops Duplicados**

```java
// ❌ Código duplicado
if (modo == 1) {
    for (String item : itens) {
        System.out.println(item);
    }
} else {
    for (String item : itens) {
        System.out.println(item);  // Mesmo loop!
    }
}

// ✅ Extraia o comum
for (String item : itens) {
    if (modo == 1) {
        System.out.println("Modo 1: " + item);
    } else {
        System.out.println("Modo 2: " + item);
    }
}
```

---

## 🚀 Boas Práticas

### 1. ✅ Valide Antes de Iterar

```java
// ✅ Evita NullPointerException
if (array != null && array.length > 0) {
    for (int elemento : array) {
        processar(elemento);
    }
}
```

### 2. ✅ Use switch para Múltiplos Loops Distintos

```java
// ✅ Claro e organizado
switch (formato) {
    case "csv": for (...) { csv(); } break;
    case "json": for (...) { json(); } break;
}
```

### 3. ✅ Evite if Redundante

```java
// ❌ Redundante
if (lista.size() > 0) {
    for (Item item : lista) { ... }
}

// ✅ for-each já lida com lista vazia
for (Item item : lista) { ... }
```

---

## 📚 Resumo

**Loops dentro de condicionais** executam **iterações condicionalmente**, baseando-se em **validações prévias**. **if + for**: Loop executa apenas se condição true. **if-else + for**: Loops diferentes por cenário (ordem normal/reversa, detalhado/resumido). **switch + for**: Loop específico para cada caso (formato, categoria). **Validação prévia**: `if (array != null)` antes de iterar. **Padrões**: Relatórios condicionais, modos de execução, retry/fallback, limites dinâmicos, permissões. **Vantagens**: Evita erros (NullPointerException), permite lógica seletiva, melhora legibilidade. **Boas práticas**: Valide antes de iterar, use switch para múltiplos loops distintos, evite if redundante (for-each já lida com vazio), extraia loops comuns, prefira validação prévia a muitos if internos.
