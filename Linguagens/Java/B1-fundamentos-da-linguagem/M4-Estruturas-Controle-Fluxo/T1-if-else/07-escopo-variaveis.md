# Escopo de Variáveis em Blocos if

## 🎯 Introdução e Definição

### Definição Conceitual

**Escopo de variáveis** refere-se à **região do código** onde uma variável é **visível** e pode ser **acessada**. Em estruturas `if`, o escopo é determinado pelos **blocos** delimitados por chaves `{}`, seguindo o princípio de **block scope** (escopo de bloco) do Java.

**Conceito fundamental**:
```java
if (condição) {
    int x = 10;  // 'x' existe APENAS neste bloco
    System.out.println(x);  // OK
}
// System.out.println(x);  // ERRO: 'x' não existe aqui
```

**Analogia**: É como **quartos em uma casa** - o que está dentro de um quarto (bloco) não é visível do lado de fora, mas o que está na sala comum (escopo externo) é visível em todos os quartos.

**Importância**:
- ✅ **Organização**: Variáveis limitadas onde são necessárias
- ✅ **Segurança**: Previne acesso indevido
- ✅ **Memória**: Variáveis liberadas ao sair do bloco
- ✅ **Manutenção**: Reduz acoplamento
- ⚠️ **Pode causar erros** se não compreendido

---

## 📋 Sumário Conceitual

### Regras de Escopo em if

**1. Variável declarada no if**: Visível APENAS dentro do bloco if
**2. Variável declarada antes do if**: Visível no if e após
**3. Variável declarada no else**: Visível APENAS no bloco else
**4. Escopo não se estende**: Variável do if NÃO existe no else
**5. Shadowing**: Variável interna pode "esconder" externa (evite!)
**6. Inicialização condicional**: Cuidado com variáveis não inicializadas

---

## 🧠 Fundamentos Teóricos

### 1. Escopo de Bloco em Java

**Princípio**: Variáveis declaradas em um **bloco** `{}` existem **apenas nesse bloco**.

```java
public void exemplo() {
    // Escopo do método
    
    if (true) {
        // Escopo do if
        int x = 10;
        System.out.println(x);  // OK: x existe aqui
    }
    
    // System.out.println(x);  // ERRO: x não existe aqui
}
```

**Diagrama de escopo**:
```
Método exemplo() {
    ┌─────────────────────────────────┐
    │ Escopo do método                │
    │                                 │
    │  if (...) {                     │
    │    ┌─────────────────────┐      │
    │    │ Escopo do if        │      │
    │    │ int x = 10;         │      │
    │    │ x é visível aqui    │      │
    │    └─────────────────────┘      │
    │                                 │
    │  x NÃO é visível aqui           │
    └─────────────────────────────────┘
}
```

### 2. Variável Declarada DENTRO do if

**Exemplo**:
```java
if (idade >= 18) {
    String mensagem = "Maior de idade";
    System.out.println(mensagem);  // OK
}
// System.out.println(mensagem);  // ERRO: mensagem não existe aqui
```

**Regra**: Variável declarada no if existe **apenas no bloco if**.

**Caso prático**:
```java
if (usuario.isPremium()) {
    double desconto = 0.20;
    double valorFinal = valor * (1 - desconto);
    System.out.println("Valor: " + valorFinal);
}
// System.out.println(desconto);  // ERRO: desconto não existe aqui
```

### 3. Variável Declarada ANTES do if

**Exemplo**:
```java
String mensagem;  // Declarada antes do if

if (idade >= 18) {
    mensagem = "Maior de idade";  // Atribui valor
} else {
    mensagem = "Menor de idade";
}

System.out.println(mensagem);  // OK: mensagem existe aqui
```

**Regra**: Variável declarada **antes** do if é visível **dentro e depois** do if.

**Caso prático**:
```java
double desconto;  // Declarada antes

if (cliente.isPremium()) {
    desconto = 0.20;
} else {
    desconto = 0.10;
}

double total = valor * (1 - desconto);  // OK: desconto existe aqui
```

### 4. Escopo de if e else São Separados

**Importante**: Variável declarada no `if` NÃO existe no `else` (e vice-versa).

```java
if (condicao) {
    int x = 10;
    System.out.println(x);  // OK
} else {
    // System.out.println(x);  // ERRO: x não existe aqui
    int y = 20;
    System.out.println(y);  // OK
}

// System.out.println(x);  // ERRO
// System.out.println(y);  // ERRO
```

**Diagrama**:
```
if (condicao) {
    ┌───────────┐
    │ Escopo if │
    │ int x;    │
    └───────────┘
} else {
    ┌─────────────┐
    │ Escopo else │
    │ int y;      │
    └─────────────┘
}
```

### 5. Variável Não Inicializada

**Problema**: Variável declarada antes do if pode não ser inicializada em todos os caminhos.

```java
// ❌ ERRO: variável pode não ser inicializada
String mensagem;

if (idade >= 18) {
    mensagem = "Maior de idade";
}
// Se idade < 18, mensagem NÃO foi inicializada!

System.out.println(mensagem);  // ERRO DE COMPILAÇÃO
```

**Solução 1**: Inicializar com valor padrão.

```java
// ✅ Inicialização padrão
String mensagem = "Indefinido";

if (idade >= 18) {
    mensagem = "Maior de idade";
}

System.out.println(mensagem);  // OK: sempre inicializada
```

**Solução 2**: Garantir inicialização em todos os caminhos.

```java
// ✅ else garante inicialização
String mensagem;

if (idade >= 18) {
    mensagem = "Maior de idade";
} else {
    mensagem = "Menor de idade";
}

System.out.println(mensagem);  // OK: sempre inicializada
```

### 6. Shadowing (Sombreamento)

**Definição**: Variável **interna** com mesmo nome de **externa** "esconde" a externa.

```java
int x = 10;  // Variável externa

if (true) {
    int x = 20;  // ERRO DE COMPILAÇÃO: não pode redeclarar 'x' no mesmo escopo
    System.out.println(x);
}
```

**⚠️ Java NÃO permite** redeclarar variável no **mesmo método** (mesmo em blocos diferentes).

**Exemplo válido** (escopos completamente separados):
```java
public void metodo1() {
    int x = 10;
}

public void metodo2() {
    int x = 20;  // OK: métodos diferentes
}
```

**Shadowing válido** (campo vs variável local):
```java
public class Exemplo {
    private int x = 10;  // Campo
    
    public void metodo() {
        int x = 20;  // Variável local (COMPILA, mas não recomendado)
        System.out.println(x);  // 20 (local esconde campo)
        System.out.println(this.x);  // 10 (acessa campo)
    }
}
```

### 7. Escopo em if Aninhado

**Hierarquia de escopos**:
```java
int a = 1;  // Escopo do método

if (condicao1) {
    int b = 2;  // Escopo do if externo
    System.out.println(a);  // OK: 'a' visível aqui
    
    if (condicao2) {
        int c = 3;  // Escopo do if interno
        System.out.println(a);  // OK: 'a' visível
        System.out.println(b);  // OK: 'b' visível
        System.out.println(c);  // OK: 'c' visível
    }
    
    // System.out.println(c);  // ERRO: 'c' não visível aqui
}

// System.out.println(b);  // ERRO: 'b' não visível aqui
// System.out.println(c);  // ERRO: 'c' não visível aqui
```

**Regra**: Blocos **internos** veem variáveis de blocos **externos**, mas NÃO o contrário.

### 8. Variáveis final em Blocos

**Variável final**: Não pode ser reatribuída após inicialização.

```java
if (condicao) {
    final int x = 10;
    // x = 20;  // ERRO: x é final
    System.out.println(x);
}
```

**final em variável externa**:
```java
final int x;

if (condicao) {
    x = 10;  // Primeira atribuição (OK)
} else {
    x = 20;  // Primeira atribuição (OK)
}

// x = 30;  // ERRO: x já foi inicializada
```

### 9. Escopo e Garbage Collection

**Importante**: Variáveis saem de escopo ao **fim do bloco**, permitindo que o Garbage Collector as libere.

```java
if (condicao) {
    String grandeString = new String(new char[1000000]);
    // Usa grandeString
}
// grandeString não existe mais, memória pode ser liberada
```

### 10. Exemplos Práticos Completos

#### **Cálculo de Desconto com Variável Local**

```java
public double calcularTotal(double valor, boolean isPremium) {
    if (isPremium) {
        double desconto = 0.20;  // Existe apenas neste bloco
        double valorComDesconto = valor * (1 - desconto);
        System.out.println("Desconto aplicado: " + (desconto * 100) + "%");
        return valorComDesconto;
    }
    
    // 'desconto' não existe aqui
    return valor;
}
```

#### **Formatação com Variável Compartilhada**

```java
public String formatarMensagem(int quantidade) {
    String mensagem;  // Declarada antes (visível em todos os blocos)
    
    if (quantidade == 0) {
        mensagem = "Nenhum item";
    } else if (quantidade == 1) {
        mensagem = "1 item";
    } else {
        mensagem = quantidade + " itens";
    }
    
    return mensagem;  // OK: sempre inicializada
}
```

#### **Validação com Variável Temporária**

```java
public boolean validarUsuario(Usuario usuario) {
    if (usuario == null) {
        return false;
    }
    
    if (usuario.getNome() != null) {
        String nome = usuario.getNome().trim();  // Variável local
        
        if (nome.length() >= 3) {
            System.out.println("Nome válido: " + nome);
            return true;
        }
    }
    
    // 'nome' não existe aqui
    return false;
}
```

#### **Processamento com Variáveis em Níveis Diferentes**

```java
public void processarPedido(Pedido pedido) {
    double total = 0;  // Escopo do método
    
    if (pedido.hasItens()) {
        int quantidadeItens = pedido.getItens().size();  // Escopo do if externo
        
        for (Item item : pedido.getItens()) {
            double valorItem = item.getPreco() * item.getQuantidade();  // Escopo do for
            total += valorItem;
        }
        
        // 'valorItem' não existe aqui
        System.out.println("Total de " + quantidadeItens + " itens");
    }
    
    // 'quantidadeItens' não existe aqui
    System.out.println("Total geral: " + total);
}
```

#### **Guard Clauses com Variáveis Locais**

```java
public void processar(String entrada) {
    if (entrada == null) {
        return;  // Saída antecipada
    }
    
    // 'entrada' não é null aqui (garantido pela guard clause)
    String entradaTrimmed = entrada.trim();
    
    if (entradaTrimmed.isEmpty()) {
        return;
    }
    
    // 'entradaTrimmed' não é vazio aqui
    String entradaUpper = entradaTrimmed.toUpperCase();
    System.out.println(entradaUpper);
}
```

---

## 🔍 Análise Conceitual Profunda

### Por Que Escopo de Bloco?

**1. Encapsulamento**
- Variáveis limitadas onde são necessárias
- Reduz acoplamento
- Facilita refatoração

**2. Segurança**
- Previne uso acidental de variáveis
- Evita conflitos de nomes
- Reduz bugs

**3. Memória**
- Variáveis liberadas ao sair do bloco
- Garbage Collector pode atuar
- Otimização de recursos

**4. Legibilidade**
- Escopo menor = mais fácil entender
- Variáveis próximas ao uso
- Intenção clara

### Escopo vs Lifetime

**Escopo**: Onde a variável é **visível** no código.
**Lifetime**: Quando a variável **existe** na memória.

```java
public void exemplo() {
    if (true) {
        int x = 10;
        // Escopo de x: daqui...
    }
    // ...até aqui
    
    // Lifetime de x: da criação até garbage collection
}
```

### Quando Declarar Variável Antes vs Dentro do if

**Declarar ANTES quando**:
- Valor é usado **após o if**
- Valor é atribuído em **múltiplos caminhos** (if/else)
- Variável representa **resultado** da decisão

```java
// ✅ Declarar antes: valor usado após
String status;
if (ativo) {
    status = "Ativo";
} else {
    status = "Inativo";
}
System.out.println(status);  // Usado aqui
```

**Declarar DENTRO quando**:
- Valor é usado **apenas no bloco**
- **Cálculo intermediário**
- **Variável temporária**

```java
// ✅ Declarar dentro: valor usado apenas no bloco
if (isPremium) {
    double desconto = 0.20;  // Usado apenas aqui
    double valorFinal = valor * (1 - desconto);
    System.out.println(valorFinal);
}
```

---

## 🎯 Aplicabilidade e Contextos

### 1. **Cálculos Condicionais**

```java
if (temDesconto) {
    double percentualDesconto = 0.15;  // Apenas neste bloco
    double valorDesconto = valor * percentualDesconto;
    total = valor - valorDesconto;
} else {
    total = valor;
}
```

### 2. **Formatação de Strings**

```java
String mensagem;

if (quantidade == 0) {
    mensagem = "Vazio";
} else if (quantidade == 1) {
    String item = itens.get(0);  // Apenas neste bloco
    mensagem = "1 item: " + item;
} else {
    mensagem = quantidade + " itens";
}
```

### 3. **Validação com Variáveis Temporárias**

```java
if (email != null) {
    String emailTrimmed = email.trim();  // Temporária
    
    if (emailTrimmed.contains("@")) {
        String[] partes = emailTrimmed.split("@");  // Temporária
        System.out.println("Domínio: " + partes[1]);
    }
}
```

### 4. **Processamento de Dados**

```java
if (arquivo.exists()) {
    BufferedReader reader = new BufferedReader(new FileReader(arquivo));
    String linha;
    
    while ((linha = reader.readLine()) != null) {
        String linhaTrimmed = linha.trim();  // Escopo do while
        processar(linhaTrimmed);
    }
    
    reader.close();
}
```

### 5. **Decisões com Resultado**

```java
int pontos;

if (vitoria) {
    pontos = 3;
} else if (empate) {
    pontos = 1;
} else {
    pontos = 0;
}

total += pontos;  // Usado aqui
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Variável Não Inicializada**

```java
// ❌ ERRO: pode não ser inicializada
String mensagem;

if (condicao) {
    mensagem = "Valor";
}

System.out.println(mensagem);  // ERRO se condicao for false

// ✅ Solução: else ou inicialização padrão
String mensagem = "Padrão";
if (condicao) {
    mensagem = "Valor";
}
System.out.println(mensagem);  // OK
```

### 2. **Tentar Acessar Variável Fora do Escopo**

```java
// ❌ ERRO
if (condicao) {
    int x = 10;
}
System.out.println(x);  // ERRO: x não existe

// ✅ Solução: declarar antes
int x = 0;
if (condicao) {
    x = 10;
}
System.out.println(x);  // OK
```

### 3. **Redeclaração de Variável**

```java
// ❌ ERRO: redeclaração
int x = 10;

if (condicao) {
    int x = 20;  // ERRO: x já declarada
}

// ✅ Solução: reatribuir ou usar nome diferente
int x = 10;
if (condicao) {
    x = 20;  // Reatribuição (OK)
}
```

### 4. **Shadowing Acidental**

```java
// ⚠️ Compila mas confuso
public class Exemplo {
    private int valor = 10;
    
    public void metodo() {
        int valor = 20;  // Esconde campo (não recomendado)
        System.out.println(valor);  // 20 (local)
        System.out.println(this.valor);  // 10 (campo)
    }
}

// ✅ Use nomes diferentes
public void metodo() {
    int valorLocal = 20;
    System.out.println(valorLocal);
    System.out.println(this.valor);
}
```

### 5. **Variável final Não Inicializada**

```java
// ❌ ERRO: final deve ser inicializada
final int x;

if (condicao) {
    x = 10;
}
// Se condicao for false, x não é inicializada!

// ✅ Solução: garantir inicialização
final int x;
if (condicao) {
    x = 10;
} else {
    x = 20;
}
```

### 6. **Escopo em Loop**

```java
// ⚠️ Variável recriada em cada iteração
for (int i = 0; i < 3; i++) {
    if (true) {
        int x = i;  // Nova variável em cada iteração
        System.out.println(x);
    }
}

// ✅ Declarar fora se precisar acumular
int x = 0;
for (int i = 0; i < 3; i++) {
    if (true) {
        x += i;  // Acumula
    }
}
System.out.println(x);
```

---

## 🔗 Interconexões Conceituais

- **Blocos de código**: Delimitados por `{}`
- **Estruturas de controle**: if, else, while, for
- **Variáveis locais**: Declaradas em métodos/blocos
- **Campos**: Declarados na classe
- **Garbage Collection**: Liberação de memória
- **Inicialização**: Atribuição de valor inicial
- **final**: Imutabilidade
- **Shadowing**: Variável esconde outra

---

## 🚀 Boas Práticas

### 1. ✅ Declare Variáveis o Mais Próximo Possível do Uso

```java
// ✅ Próximo ao uso
if (usuario.isPremium()) {
    double desconto = 0.20;  // Declarada e usada imediatamente
    aplicarDesconto(desconto);
}

// ❌ Longe do uso
double desconto = 0.20;
// 50 linhas de código...
if (usuario.isPremium()) {
    aplicarDesconto(desconto);
}
```

### 2. ✅ Use Nomes Descritivos

```java
// ✅ Descritivo
if (idade >= 18) {
    String mensagemMaioridade = "Maior de idade";
    exibir(mensagemMaioridade);
}

// ❌ Genérico
if (idade >= 18) {
    String msg = "Maior de idade";
    exibir(msg);
}
```

### 3. ✅ Inicialize Variáveis

```java
// ✅ Sempre inicializada
String resultado = "Padrão";
if (condicao) {
    resultado = "Específico";
}
System.out.println(resultado);  // OK

// ❌ Pode não ser inicializada
String resultado;
if (condicao) {
    resultado = "Específico";
}
System.out.println(resultado);  // ERRO
```

### 4. ✅ Evite Shadowing

```java
// ✅ Nomes diferentes
private int valorGlobal = 10;

public void metodo() {
    int valorLocal = 20;
    System.out.println(valorLocal);
    System.out.println(valorGlobal);
}

// ❌ Shadowing
private int valor = 10;

public void metodo() {
    int valor = 20;  // Esconde campo
    System.out.println(valor);  // Qual valor?
}
```

### 5. ✅ Use final para Variáveis Imutáveis

```java
// ✅ final previne reatribuição
if (isPremium) {
    final double DESCONTO = 0.20;
    // DESCONTO = 0.30;  // ERRO: não pode reatribuir
    aplicarDesconto(DESCONTO);
}
```

### 6. ✅ Limite Escopo ao Mínimo Necessário

```java
// ✅ Escopo mínimo
if (condicao) {
    String temp = calcular();
    processar(temp);
}
// temp não existe aqui (bom)

// ❌ Escopo desnecessário amplo
String temp = "";
if (condicao) {
    temp = calcular();
    processar(temp);
}
// temp ainda existe aqui (ruim)
```

### 7. ✅ Declare no Menor Escopo Possível

```java
// ✅ Declarada no loop
for (int i = 0; i < 10; i++) {
    int quadrado = i * i;  // Apenas nesta iteração
    System.out.println(quadrado);
}

// ❌ Declarada fora
int quadrado;
for (int i = 0; i < 10; i++) {
    quadrado = i * i;
    System.out.println(quadrado);
}
```

### 8. ✅ Use Blocos para Agrupar Variáveis Relacionadas

```java
// ✅ Bloco agrupa variáveis relacionadas
{
    double subtotal = calcularSubtotal();
    double taxa = calcularTaxa(subtotal);
    double total = subtotal + taxa;
    exibir(total);
}
// subtotal, taxa não existem aqui
```

### 9. ✅ Comente Variáveis com Escopo Específico

```java
if (usuario.isPremium()) {
    // Desconto exclusivo para premium
    double descontoPremium = 0.25;
    aplicar(descontoPremium);
}
```

### 10. ✅ Teste Inicialização de Variáveis

```java
@Test
void testInicializacao() {
    String resultado = metodo(true);
    assertNotNull(resultado);  // Garante inicialização
    
    resultado = metodo(false);
    assertNotNull(resultado);  // Testa todos os caminhos
}
```

---

## 📚 Resumo

**Escopo de variáveis** em blocos `if` segue o princípio de **block scope**: variáveis declaradas **dentro** de um bloco `{}` existem **apenas nesse bloco**. Variáveis declaradas **antes** do if são visíveis **dentro e depois** do if. Os escopos de `if` e `else` são **separados** - variável do if NÃO existe no else. **Cuidado** com variáveis não inicializadas: se declarada antes do if mas atribuída apenas em alguns caminhos, o compilador gerará erro. Use **else** ou **inicialização padrão** para garantir que a variável sempre tenha valor. **Evite shadowing** (redeclarar variável com mesmo nome). Blocos **internos** veem variáveis de blocos **externos**, mas NÃO o contrário. **Declare variáveis** o mais **próximo possível** do uso e no **menor escopo** possível. Variáveis saem de escopo ao fim do bloco, permitindo **garbage collection**. Use `final` para variáveis que não devem ser reatribuídas.

