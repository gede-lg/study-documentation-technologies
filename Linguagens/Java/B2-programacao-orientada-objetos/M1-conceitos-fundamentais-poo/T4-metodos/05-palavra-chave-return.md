# Palavra-chave return

## 🎯 Introdução e Definição

**return** é a **palavra-chave** que **encerra** a execução de um método e **devolve** um valor ao chamador. Tem **duas funções**: (1) **terminar** o método imediatamente, interrompendo qualquer código subsequente, e (2) **retornar** um valor compatível com o tipo declarado. Em métodos `void`, pode ser usado sem valor apenas para sair antecipadamente.

**Conceito central**: `return` é o **ponto de saída** do método - quando executado, o controle **retorna** ao chamador com o valor especificado. É como **encerrar** uma função matemática f(x) = resultado - o `return` é o `=` que **entrega** o resultado. Código após `return` é **inalcançável** (unreachable) e causa erro de compilação.

**Analogia completa**:
- **Método**: Consulta médica
- **Parâmetros**: Sintomas do paciente (entrada)
- **return**: Diagnóstico e saída do consultório (resultado + fim)
- **Valor retornado**: Receita médica (o que é entregue)
- **Após return**: Nada mais acontece no consultório (paciente saiu)

**Estrutura básica**:
```java
public TIPO metodo() {
    // Código
    return valor;  // ENCERRA método e RETORNA valor
    // ⚠️ Código aqui é INALCANÇÁVEL (erro de compilação)
}

// EXEMPLOS:
public int somar(int a, int b) {
    return a + b;  // Retorna soma e SAI
}

public void exibir(String msg) {
    System.out.println(msg);
    return;  // Sai (opcional em void ao final)
}

public boolean isPositivo(int x) {
    if (x > 0) {
        return true;  // Retorna true e SAI
    }
    return false;  // Retorna false se não entrou no if
}
```

**Exemplo completo**:
```java
public class Calculadora {
    // Return simples
    public int multiplicar(int a, int b) {
        int resultado = a * b;
        return resultado;  // Retorna resultado e encerra
        // System.out.println("Fim");  // ❌ ERRO: código inalcançável
    }
    
    // Return com expressão
    public double dividir(int a, int b) {
        return (double) a / b;  // Expressão avaliada e retornada
    }
    
    // Múltiplos returns (early return)
    public String classificar(int nota) {
        if (nota >= 90) {
            return "A";  // Retorna e SAI (não executa resto)
        }
        if (nota >= 80) {
            return "B";  // Retorna e SAI
        }
        if (nota >= 70) {
            return "C";  // Retorna e SAI
        }
        return "F";  // Retorno padrão (obrigatório)
    }
    
    // Return void (sem valor)
    public void processar(int valor) {
        if (valor < 0) {
            return;  // Sai do método (sem retornar valor)
        }
        
        // Continua se não retornou
        System.out.println("Processando " + valor);
        // return; no final é opcional (implícito em void)
    }
}

// USO:
Calculadora calc = new Calculadora();

int mult = calc.multiplicar(5, 10);  // Recebe 50
double div = calc.dividir(10, 3);    // Recebe 3.333...
String nota = calc.classificar(85);  // Recebe "B" (retornou no 2º if)
calc.processar(-5);                  // Sai no return (não imprime)
calc.processar(10);                  // Não entra no if, imprime "Processando 10"
```

## 📋 Fundamentos Teóricos

### 1️⃣ Sintaxe do return

**Com valor** (métodos não-void):
```java
public TIPO metodo() {
    return expressão;  // Expressão deve resultar em TIPO compatível
}

// Exemplos:
public int getIdade() {
    return 30;  // Literal
}

public double calcular() {
    return 10.5 * 2;  // Expressão aritmética
}

public String getNome() {
    String nome = "João";
    return nome;  // Variável
}

public boolean verificar() {
    return x > 10;  // Expressão booleana
}

public Produto criar() {
    return new Produto();  // Objeto novo
}
```

**Sem valor** (métodos void):
```java
public void metodo() {
    return;  // Sai sem retornar valor
}

// Exemplo:
public void exibir(String msg) {
    if (msg == null) {
        return;  // Sai se null
    }
    System.out.println(msg);
    // return; aqui é opcional (implícito ao final)
}
```

### 2️⃣ Encerramento Imediato da Execução

**Conceito**: `return` **interrompe** execução do método instantaneamente.

**Exemplo**:
```java
public int metodo() {
    System.out.println("1 - Antes do return");
    return 10;  // ENCERRA aqui
    System.out.println("2 - Depois do return");  // ❌ ERRO: unreachable
}

// Saída:
// "1 - Antes do return"
// (método termina, nunca imprime "2")
```

**Com condição**:
```java
public void processar(int x) {
    System.out.println("Início");
    
    if (x < 0) {
        System.out.println("Negativo");
        return;  // SAI se x < 0
    }
    
    // Continua se x >= 0
    System.out.println("Processando " + x);
    System.out.println("Fim");
}

// Chamadas:
processar(-5);
// Saída: "Início" → "Negativo" (para aqui)

processar(10);
// Saída: "Início" → "Processando 10" → "Fim"
```

**Em loop**:
```java
public int buscar(int[] array, int valor) {
    for (int i = 0; i < array.length; i++) {
        if (array[i] == valor) {
            return i;  // ENCONTROU - retorna índice e SAI do método
        }
    }
    return -1;  // Não encontrou (percorreu todo array)
}

// Uso:
int[] arr = {10, 20, 30, 40, 50};
int indice = buscar(arr, 30);  // Retorna 2 (para no i=2, não continua loop)
```

### 3️⃣ Early Return (Retorno Antecipado)

**Conceito**: Retornar **cedo** ao validar condições, evitando aninhamento.

**SEM early return** (aninhamento excessivo):
```java
public boolean processar(Pedido pedido) {
    if (pedido != null) {
        if (pedido.getTotal() > 0) {
            if (pedido.getCliente() != null) {
                // Lógica principal aninhada 3 níveis
                pedido.calcular();
                pedido.enviar();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}
```

**COM early return** (guard clauses):
```java
public boolean processar(Pedido pedido) {
    // Validações com retorno antecipado
    if (pedido == null) {
        return false;  // SAI imediatamente
    }
    
    if (pedido.getTotal() <= 0) {
        return false;  // SAI se inválido
    }
    
    if (pedido.getCliente() == null) {
        return false;  // SAI se sem cliente
    }
    
    // Lógica principal sem aninhamento
    pedido.calcular();
    pedido.enviar();
    return true;
}
```

**Vantagens**:
```
✓ Menos aninhamento (código mais plano)
✓ Validações explícitas no início
✓ Lógica principal não aninhada
✓ Mais legível e manutenível
```

**Pattern guard clauses**:
```java
public void executar(Tarefa tarefa) {
    // Guard clause 1
    if (tarefa == null) {
        return;
    }
    
    // Guard clause 2
    if (!tarefa.isValida()) {
        return;
    }
    
    // Guard clause 3
    if (tarefa.isConcluida()) {
        return;
    }
    
    // Execução principal (sem aninhamento)
    tarefa.executar();
    tarefa.salvar();
}
```

### 4️⃣ Múltiplos Returns

**Conceito**: Método pode ter **vários** `return` em caminhos diferentes.

**Exemplo**:
```java
public String getDiaSemana(int dia) {
    if (dia == 1) return "Domingo";
    if (dia == 2) return "Segunda";
    if (dia == 3) return "Terça";
    if (dia == 4) return "Quarta";
    if (dia == 5) return "Quinta";
    if (dia == 6) return "Sexta";
    if (dia == 7) return "Sábado";
    return "Inválido";  // Padrão
}
```

**Switch com return**:
```java
public String getCategoria(char grau) {
    switch (grau) {
        case 'A':
            return "Excelente";
        case 'B':
            return "Bom";
        case 'C':
            return "Regular";
        case 'D':
            return "Ruim";
        default:
            return "Inválido";
    }
    // Não precisa return aqui (todos os casos já retornam)
}
```

**Switch expression** (Java 14+):
```java
public String getCategoria(char grau) {
    return switch (grau) {
        case 'A' -> "Excelente";
        case 'B' -> "Bom";
        case 'C' -> "Regular";
        case 'D' -> "Ruim";
        default -> "Inválido";
    };  // Um único return
}
```

### 5️⃣ Return com Expressões

**Conceito**: `return` aceita qualquer **expressão** que resulte no tipo esperado.

**Expressões aritméticas**:
```java
public int somar(int a, int b) {
    return a + b;  // Expressão avaliada
}

public double calcular(int x, int y) {
    return (x + y) / 2.0;  // Cálculo direto
}

public int absoluto(int x) {
    return x < 0 ? -x : x;  // Operador ternário
}
```

**Expressões booleanas**:
```java
public boolean isAdulto(int idade) {
    return idade >= 18;  // Comparação
}

public boolean validar(String texto) {
    return texto != null && !texto.isEmpty();  // Lógica
}

public boolean ehPar(int x) {
    return x % 2 == 0;  // Módulo
}
```

**Chamadas de métodos**:
```java
public String getTexto() {
    return texto.toUpperCase();  // Retorna resultado de método
}

public int getIdade() {
    return pessoa.calcularIdade();  // Delega para outro método
}

public List<String> getLista() {
    return Collections.unmodifiableList(lista);  // Wrapper
}
```

**Operador ternário**:
```java
public String getStatus(boolean ativo) {
    return ativo ? "Ativo" : "Inativo";
}

public int max(int a, int b) {
    return a > b ? a : b;
}

public String getDesconto(double valor) {
    return valor > 100 ? "10%" : valor > 50 ? "5%" : "Sem desconto";
}
```

### 6️⃣ Return em Métodos void

**Conceito**: `void` usa `return;` **sem valor** apenas para **sair**.

**Return explícito**:
```java
public void processar(String texto) {
    if (texto == null || texto.isEmpty()) {
        return;  // Sai se inválido (sem valor)
    }
    
    // Processar texto válido
    System.out.println(texto.toUpperCase());
}
```

**Return implícito** (no final):
```java
public void exibir(String msg) {
    System.out.println(msg);
    // return; aqui é OPCIONAL (implícito em void)
}

// Equivalente a:
public void exibir(String msg) {
    System.out.println(msg);
    return;  // Explícito mas desnecessário
}
```

**Múltiplos returns em void**:
```java
public void notificar(Usuario usuario, String mensagem) {
    if (usuario == null) {
        return;  // Sai
    }
    
    if (mensagem == null || mensagem.isEmpty()) {
        return;  // Sai
    }
    
    if (!usuario.isAtivo()) {
        return;  // Sai
    }
    
    // Enviar notificação
    emailService.enviar(usuario.getEmail(), mensagem);
    // return; opcional aqui
}
```

### 7️⃣ Código Inalcançável (Unreachable Code)

**Conceito**: Código após `return` **nunca** executa - erro de compilação.

**Erro direto**:
```java
public int metodo() {
    return 10;
    System.out.println("Nunca executa");  // ❌ ERRO: unreachable statement
}
```

**Erro em bloco**:
```java
public int metodo(int x) {
    if (x > 0) {
        return 1;
    } else {
        return -1;
    }
    System.out.println("Fim");  // ❌ ERRO: todos os caminhos retornam antes
}
```

**✓ Código alcançável**:
```java
public int metodo(int x) {
    if (x > 0) {
        return 1;
    }
    // Se x <= 0, chega aqui
    System.out.println("Negativo ou zero");  // ✓ Alcançável
    return -1;
}
```

### 8️⃣ Return em Try-Catch-Finally

**Return em try**:
```java
public int metodo() {
    try {
        int x = 10 / 2;
        return x;  // Retorna 5
    } catch (Exception e) {
        return -1;
    }
}
```

**Finally executa após return**:
```java
public int metodo() {
    try {
        return 10;  // Prepara retorno
    } finally {
        System.out.println("Finally");  // Executa ANTES de retornar
    }
    // Saída: "Finally" → retorna 10
}
```

**Return em finally sobrescreve**:
```java
public int metodo() {
    try {
        return 10;  // Preparado
    } finally {
        return 20;  // ⚠️ SOBRESCREVE o return do try
    }
    // Retorna 20 (não 10)
}
```

**⚠️ Evitar return em finally**:
```java
// ❌ MÁ PRÁTICA:
public int metodo() {
    try {
        return calcular();
    } finally {
        return 0;  // Oculta resultado do try
    }
}

// ✓ BOA PRÁTICA:
public int metodo() {
    try {
        return calcular();
    } finally {
        // Limpeza, não return
        fecharRecursos();
    }
}
```

### 9️⃣ Return Obrigatório

**Conceito**: Método não-void **deve** retornar em **todos** os caminhos.

**❌ Erro - falta return**:
```java
public int metodo(int x) {
    if (x > 0) {
        return 1;
    }
    // ❌ ERRO: se x <= 0, não retorna nada
}
```

**✓ Correto - todos os caminhos retornam**:
```java
public int metodo(int x) {
    if (x > 0) {
        return 1;
    }
    return -1;  // Garante retorno em todos os casos
}

// Ou:
public int metodo(int x) {
    if (x > 0) {
        return 1;
    } else {
        return -1;
    }
    // Todos os caminhos cobertos
}
```

**Loops infinitos**:
```java
public int metodo() {
    while (true) {
        return 1;  // ✓ Compiler entende que sempre retorna
    }
    // Não exige return adicional
}
```

**Exceções**:
```java
public int metodo(int x) {
    if (x < 0) {
        throw new IllegalArgumentException();  // Lançar exceção = "retornar"
    }
    return x;  // Caminho normal
}
```

### 🔟 Return e Atribuição

**Conceito**: Valor retornado pode ser **atribuído** ou **usado** em expressões.

**Atribuição**:
```java
public int somar(int a, int b) {
    return a + b;
}

// Atribuir a variável:
int resultado = somar(10, 20);  // resultado = 30

// Usar em expressão:
int total = somar(5, 10) + somar(20, 30);  // 15 + 50 = 65

// Passar como argumento:
System.out.println(somar(10, 20));  // Imprime 30

// Condição:
if (somar(10, 20) > 25) {
    System.out.println("Maior que 25");
}
```

**Encadeamento**:
```java
public Produto setNome(String nome) {
    this.nome = nome;
    return this;  // Retorna próprio objeto
}

// Encadear:
produto.setNome("Mouse").setPreco(50.0).setEstoque(100);
//      ↑ retorna produto  ↑ retorna produto  ↑ retorna produto
```

**Comparações**:
```java
public boolean isValido() {
    return true;
}

// Em if:
if (isValido()) {  // Usa valor retornado (true)
    System.out.println("Válido");
}

// Em ternário:
String status = isValido() ? "OK" : "ERRO";
```

## 🎯 Aplicabilidade

**1. Retornar resultado de cálculos**
**2. Encerrar método após validação (guard clauses)**
**3. Fornecer valores para o chamador**
**4. Sair de loops antecipadamente**
**5. Implementar lógica condicional com múltiplos retornos**

## ⚠️ Armadilhas Comuns

**1. Esquecer return**:
```java
public int somar(int a, int b) {
    int soma = a + b;
    // ❌ ERRO: missing return statement
}
```

**2. Código inalcançável**:
```java
public void metodo() {
    return;
    System.out.println("Nunca executa");  // ❌ ERRO
}
```

**3. Return em finally**:
```java
try {
    return calcular();
} finally {
    return 0;  // ⚠️ Sobrescreve
}
```

**4. Falta return em algum caminho**:
```java
public int metodo(int x) {
    if (x > 0) {
        return 1;
    }
    // ❌ ERRO: falta return se x <= 0
}
```

**5. Return tipo incompatível**:
```java
public int getNumero() {
    return "texto";  // ❌ ERRO: String não é int
}
```

## ✅ Boas Práticas

**1. Early return para validações**:
```java
if (invalido) return;
```

**2. Um return por caminho lógico**:
```java
if (x > 0) return 1;
return -1;
```

**3. Evitar return em finally**:
```java
finally {
    fechar();  // Não usar return
}
```

**4. Expressões claras**:
```java
return x > 10 && y < 20;  // Clara
```

**5. Documentar valores retornados**:
```java
/**
 * @return idade em anos
 */
public int getIdade() {
    return idade;
}
```

## 📚 Resumo Executivo

**return = encerra + devolve**.

**Com valor**:
```java
public int metodo() {
    return 10;  // Retorna int
}
```

**Sem valor (void)**:
```java
public void metodo() {
    return;  // Apenas sai
}
```

**Early return**:
```java
if (invalido) {
    return;  // Sai cedo
}
// Continua se válido
```

**Múltiplos returns**:
```java
if (x > 0) return "Positivo";
if (x < 0) return "Negativo";
return "Zero";
```

**Com expressão**:
```java
return a + b;  // Avaliada antes
return x > 10;  // Booleano
return new Produto();  // Objeto
```

**Obrigatório**:
```java
public int metodo() {
    // Deve retornar em TODOS os caminhos
    return valor;
}
```

**Inalcançável**:
```java
return 10;
System.out.println();  // ❌ ERRO
```

**Try-finally**:
```java
try {
    return 10;
} finally {
    // Executa antes de retornar
    // Não usar return aqui
}
```

**Evitar**:
- Código após return
- Return em finally
- Esquecer return em algum caminho

**Preferir**:
- Early return
- Guard clauses
- Expressões claras
- Um return por caminho

**Recomendação**: Use **early return** para validações, evite **return em finally**, garanta **return em todos os caminhos**, prefira **guard clauses** a aninhamento, use **expressões claras** no return.