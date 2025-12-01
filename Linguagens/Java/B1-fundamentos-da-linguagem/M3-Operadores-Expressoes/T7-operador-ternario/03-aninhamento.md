# Aninhamento de Operadores Ternários

## 🎯 Introdução e Definição

### Definição Conceitual

**Aninhamento de operadores ternários** ocorre quando um ou ambos os valores de um operador ternário são, eles próprios, operadores ternários. Isso cria uma **estrutura hierárquica de decisões** que pode expressar lógica condicional de múltiplas vias em uma única expressão.

**Forma geral**:
```java
// Ternário aninhado
resultado = condicao1 ? valor1 : (condicao2 ? valor2 : valor3);

// Equivalente if-else-if
if (condicao1) {
    resultado = valor1;
} else if (condicao2) {
    resultado = valor2;
} else {
    resultado = valor3;
}
```

Embora tecnicamente válido e às vezes útil, o aninhamento de ternários é uma das construções mais **controversas** em Java, exigindo **cuidado extremo** com legibilidade e manutenibilidade.

---

## 📋 Sumário Conceitual

### Tipos de Aninhamento

**1. Aninhamento à direita (mais comum)**:
```java
String nota = (pontos >= 90) ? "A" :
              (pontos >= 80) ? "B" :
              (pontos >= 70) ? "C" : "F";
```

**2. Aninhamento à esquerda**:
```java
int resultado = (condicao1 ? (subCondicao ? 1 : 2) : 3);
```

**3. Aninhamento em ambos os lados**:
```java
int r = (c1 ? (c2 ? 1 : 2) : (c3 ? 3 : 4));
```

---

## 🧠 Fundamentos Teóricos

### 1. Aninhamento à Direita (Right-Nested)

O padrão mais comum, simula estrutura `if-else-if`.

**Sintaxe**:
```java
resultado = (cond1) ? val1 :
            (cond2) ? val2 :
            (cond3) ? val3 :
            valorPadrao;
```

**Exemplo: Sistema de notas**:
```java
String nota = (pontos >= 90) ? "A" :
              (pontos >= 80) ? "B" :
              (pontos >= 70) ? "C" :
              (pontos >= 60) ? "D" : "F";

// Equivalente if-else-if
String nota;
if (pontos >= 90) {
    nota = "A";
} else if (pontos >= 80) {
    nota = "B";
} else if (pontos >= 70) {
    nota = "C";
} else if (pontos >= 60) {
    nota = "D";
} else {
    nota = "F";
}
```

**Exemplo: Categoria de idade**:
```java
String categoria = (idade < 12) ? "Criança" :
                   (idade < 18) ? "Adolescente" :
                   (idade < 60) ? "Adulto" : "Idoso";
```

**Exemplo: Faixa de preço**:
```java
String faixa = (preco < 50) ? "Barato" :
               (preco < 200) ? "Médio" :
               (preco < 1000) ? "Caro" : "Premium";
```

### 2. Aninhamento à Esquerda (Left-Nested)

Menos comum, avalia sub-condições primeiro.

**Sintaxe**:
```java
resultado = (condicaoPrincipal) 
    ? (subCondicao ? valorA : valorB) 
    : valorC;
```

**Exemplo: Desconto progressivo**:
```java
double desconto = (isCliente) 
    ? (isVIP ? 0.20 : 0.10)  // Cliente: VIP=20%, normal=10%
    : 0.0;                    // Não cliente: sem desconto
```

**Exemplo: Mensagem personalizada**:
```java
String mensagem = (autenticado) 
    ? (isAdmin ? "Admin Panel" : "User Dashboard")
    : "Login Required";
```

**Exemplo: Valor com fallback**:
```java
int valor = (temDados) 
    ? (dadosValidos ? dados.getValor() : 0)
    : valorPadrao;
```

### 3. Aninhamento Bilateral (Both-Sided)

O mais complexo, com ternários em ambos os branches.

**Sintaxe**:
```java
resultado = (cond1) 
    ? (cond2 ? valA : valB) 
    : (cond3 ? valC : valD);
```

**Exemplo: Classificação de temperatura**:
```java
String clima = (celsius > 0) 
    ? (celsius > 30 ? "Quente" : "Agradável")
    : (celsius > -10 ? "Frio" : "Congelante");
```

**Exemplo: Status de pedido**:
```java
String status = (pago) 
    ? (enviado ? "Enviado" : "Processando")
    : (cancelado ? "Cancelado" : "Aguardando Pagamento");
```

**Exemplo: Escolha de cor**:
```java
String cor = (isDark) 
    ? (isError ? "red-dark" : "green-dark")
    : (isError ? "red-light" : "green-light");
```

### 4. Associatividade e Ordem de Avaliação

Operador ternário associa **da direita para esquerda**.

**Demonstração**:
```java
// Expressão
int r = a ? 1 : b ? 2 : 3;

// Interpretado como (associatividade à direita)
int r = a ? 1 : (b ? 2 : 3);

// NÃO como
// int r = (a ? 1 : b) ? 2 : 3;  // ERRO! (a ? 1 : b) não é boolean
```

**Exemplo de avaliação**:
```java
boolean a = false;
boolean b = true;

int resultado = a ? 10 : b ? 20 : 30;

// Avaliação:
// 1. a é false, então vai para parte direita do :
// 2. Avalia b ? 20 : 30
// 3. b é true, então retorna 20
// resultado = 20
```

### 5. Profundidade de Aninhamento

Aninhamento pode ter múltiplos níveis.

**Nível 2 (dois ternários)**:
```java
String r = (a) ? "A" : (b) ? "B" : "C";
```

**Nível 3 (três ternários)**:
```java
String r = (a) ? "A" : (b) ? "B" : (c) ? "C" : "D";
```

**Nível 4+ (não recomendado)**:
```java
// ❌ Muito complexo!
String r = (a) ? "A" : 
           (b) ? "B" : 
           (c) ? "C" : 
           (d) ? "D" : 
           (e) ? "E" : "F";

// ✅ Use if-else ou switch
```

### 6. Precedência com Outros Operadores

Ternário tem baixa precedência - cuidado com outras operações.

**Com operadores aritméticos**:
```java
// Expressão
int r = x + y > 10 ? a : b * 2;

// Interpretado como
int r = ((x + y) > 10) ? a : (b * 2);

// Parênteses explícitos melhoram clareza
int r = ((x + y) > 10) ? a : (b * 2);
```

**Com operadores lógicos**:
```java
// Cuidado com precedência
boolean r = a && b ? true : false;

// Interpretado como
boolean r = (a && b) ? true : false;

// Simplificável para
boolean r = a && b;
```

### 7. Aninhamento com Expressões Complexas

Cada parte pode ser uma expressão complexa.

**Condições complexas**:
```java
String resultado = (usuario != null && usuario.isAtivo() && usuario.temPermissao("ADMIN")) 
    ? "Admin Ativo" 
    : (usuario != null && usuario.isAtivo()) 
        ? "Usuário Ativo" 
        : "Sem Acesso";
```

**Valores complexos**:
```java
String mensagem = (erro) 
    ? "Erro: " + erro.getMessage() + " (Código: " + erro.getCode() + ")"
    : (aviso) 
        ? "Aviso: " + aviso.getDescricao()
        : "Operação concluída com sucesso";
```

**Chamadas de método**:
```java
int resultado = (condicao) 
    ? (subCondicao ? calcularA() : calcularB())
    : (outraCondicao ? calcularC() : calcularD());
```

### 8. Tipo Unificado em Aninhamento

Todas as possíveis saídas devem ter tipo compatível.

**Mesmo tipo**:
```java
// Todos String - OK
String s = (a) ? "A" : (b) ? "B" : "C";
```

**Tipos compatíveis**:
```java
// int e double → double
double d = (a) ? 10 : (b) ? 3.14 : 2.5;

// Integer e int → Integer (boxing)
Integer i = (a) ? 10 : (b) ? Integer.valueOf(20) : 30;
```

**Tipo comum**:
```java
// String e StringBuilder → CharSequence (ancestral comum)
CharSequence cs = (a) ? "String" : (b) ? new StringBuilder("Builder") : "Outro";
```

### 9. Curto-Circuito em Aninhamento

Apenas o caminho escolhido é avaliado.

**Demonstração**:
```java
int x = 0;

int resultado = (true) 
    ? x++           // Este é executado, x = 1
    : (false) 
        ? x += 10   // NÃO executado
        : x += 100; // NÃO executado

// resultado = 0 (valor de x antes do incremento)
// x = 1 (apenas x++ foi executado)
```

**Exemplo com métodos**:
```java
String r = (condicao1) 
    ? metodo1()      // Executado se condicao1 = true
    : (condicao2) 
        ? metodo2()  // Executado se condicao1 = false e condicao2 = true
        : metodo3(); // Executado se ambas false

// Apenas UM dos três métodos será chamado
```

### 10. Formatação e Legibilidade

Formatação adequada é crucial para ternários aninhados.

**❌ Formatação ruim (ilegível)**:
```java
String r = (a) ? "A" : (b) ? "B" : (c) ? "C" : "D";
```

**✅ Formatação em cascata**:
```java
String r = (a) ? "A" :
           (b) ? "B" :
           (c) ? "C" : "D";
```

**✅ Formatação com indentação**:
```java
String r = (a) 
    ? "A" 
    : (b) 
        ? "B" 
        : (c) 
            ? "C" 
            : "D";
```

**✅ Formatação alinhada**:
```java
String nota = (pontos >= 90) ? "A" :
              (pontos >= 80) ? "B" :
              (pontos >= 70) ? "C" :
              (pontos >= 60) ? "D" : "F";
```

---

## 🔍 Análise Conceitual Profunda

### Quando Aninhamento é Aceitável?

**1. Casos Simples (2-3 níveis)**

Aninhamento moderado pode ser legível:

```java
// ✅ Aceitável: 3 opções claras
String tamanho = (bytes < 1024) ? bytes + "B" :
                 (bytes < 1048576) ? (bytes / 1024) + "KB" :
                 (bytes / 1048576) + "MB";

// ✅ Aceitável: lógica hierárquica clara
double taxa = (isPremium) 
    ? (isVIP ? 0.01 : 0.03)
    : 0.05;
```

**2. Lógica Hierárquica Natural**

Quando a decisão é naturalmente hierárquica:

```java
// ✅ Hierarquia natural de permissões
String nivel = (isOwner) 
    ? "Owner" 
    : (isAdmin) 
        ? "Admin" 
        : (isModerator) 
            ? "Moderator" 
            : "User";
```

**3. Padrão Estabelecido no Código**

Se o padrão já é usado consistentemente na base de código.

### Quando Evitar Aninhamento?

**1. Mais de 3 níveis**

```java
// ❌ Muito profundo
String r = (a) ? "A" : (b) ? "B" : (c) ? "C" : (d) ? "D" : (e) ? "E" : "F";

// ✅ Use if-else ou switch
String r = determinarResultado(a, b, c, d, e);
```

**2. Lógica Complexa em Cada Nível**

```java
// ❌ Condições muito complexas
String s = (usuario != null && usuario.isAtivo() && !usuario.isBloqueado()) 
    ? (usuario.getPontos() > 1000 && usuario.isVerificado() ? "Gold" : "Silver")
    : "None";

// ✅ Extraia para método
String s = determinarStatus(usuario);
```

**3. Aninhamento Bilateral Profundo**

```java
// ❌ Confuso
int r = (a) ? (b ? (c ? 1 : 2) : (d ? 3 : 4)) : (e ? (f ? 5 : 6) : 7);

// ✅ Use estrutura de controle tradicional
int r = calcularResultado(a, b, c, d, e, f);
```

### Alternativas ao Aninhamento

**1. if-else-if (mais legível)**:
```java
// Ternário aninhado
String nota = (p >= 90) ? "A" : (p >= 80) ? "B" : (p >= 70) ? "C" : "F";

// if-else-if (mais claro)
String nota;
if (p >= 90) {
    nota = "A";
} else if (p >= 80) {
    nota = "B";
} else if (p >= 70) {
    nota = "C";
} else {
    nota = "F";
}
```

**2. switch expression (Java 12+)**:
```java
// Ternário aninhado
String dia = (d == 1) ? "Seg" : (d == 2) ? "Ter" : (d == 3) ? "Qua" : "Outro";

// Switch expression (mais limpo)
String dia = switch (d) {
    case 1 -> "Seg";
    case 2 -> "Ter";
    case 3 -> "Qua";
    default -> "Outro";
};
```

**3. Map lookup**:
```java
// Ternário aninhado
String cor = (n == 1) ? "Vermelho" : (n == 2) ? "Verde" : (n == 3) ? "Azul" : "Preto";

// Map (mais extensível)
Map<Integer, String> cores = Map.of(
    1, "Vermelho",
    2, "Verde",
    3, "Azul"
);
String cor = cores.getOrDefault(n, "Preto");
```

**4. Método auxiliar**:
```java
// Ternário complexo
String nivel = (pontos > 1000 && ativo) 
    ? "Ouro" 
    : (pontos > 500) 
        ? "Prata" 
        : "Bronze";

// Método auxiliar (testável, reutilizável)
String nivel = determinarNivel(pontos, ativo);

private String determinarNivel(int pontos, boolean ativo) {
    if (pontos > 1000 && ativo) return "Ouro";
    if (pontos > 500) return "Prata";
    return "Bronze";
}
```

### Impacto na Performance

Aninhamento de ternários **não afeta performance** - o bytecode gerado é similar a if-else:

```java
// Ternário aninhado
String r = (a) ? "A" : (b) ? "B" : "C";

// if-else equivalente
String r;
if (a) r = "A";
else if (b) r = "B";
else r = "C";

// Bytecode gerado é praticamente idêntico
```

A decisão entre ternário aninhado e if-else deve ser baseada em **legibilidade**, não performance.

---

## 🎯 Aplicabilidade e Contextos

### 1. **Sistema de Classificação**

```java
// Classificação de notas (aceitável)
String nota = (pontos >= 90) ? "A" :
              (pontos >= 80) ? "B" :
              (pontos >= 70) ? "C" :
              (pontos >= 60) ? "D" : "F";

// Classificação de IMC
String imc = (bmi < 18.5) ? "Abaixo do peso" :
             (bmi < 25.0) ? "Peso normal" :
             (bmi < 30.0) ? "Sobrepeso" : "Obesidade";

// Faixa etária
String faixa = (idade < 13) ? "Criança" :
               (idade < 18) ? "Adolescente" :
               (idade < 60) ? "Adulto" : "Idoso";
```

### 2. **Conversão de Unidades**

```java
// Formatação de tamanho de arquivo
String tamanho = (bytes < 1024) 
    ? bytes + " B" 
    : (bytes < 1048576) 
        ? String.format("%.2f KB", bytes / 1024.0)
        : String.format("%.2f MB", bytes / 1048576.0);

// Formatação de tempo
String tempo = (segundos < 60) 
    ? segundos + "s" 
    : (segundos < 3600) 
        ? (segundos / 60) + "m"
        : (segundos / 3600) + "h";
```

### 3. **Hierarquia de Permissões**

```java
// Nível de acesso (hierárquico)
String acesso = (isOwner) 
    ? "Full Control" 
    : (isAdmin) 
        ? "Admin" 
        : (isModerator) 
            ? "Moderator" 
            : "Read Only";

// Desconto por nível
double desconto = (isOwner) 
    ? 0.50 
    : (isPremium) 
        ? 0.20 
        : (isMember) 
            ? 0.10 
            : 0.0;
```

### 4. **Valores Padrão Condicionais**

```java
// Timeout progressivo
int timeout = (tentativas == 1) 
    ? 1000 
    : (tentativas == 2) 
        ? 5000 
        : 30000;

// Capacidade inicial
int capacidade = (tamanho.equals("pequeno")) 
    ? 10 
    : (tamanho.equals("medio")) 
        ? 100 
        : 1000;
```

### 5. **Formatação e Display**

```java
// Mensagem de saudação
int hora = LocalTime.now().getHour();
String saudacao = (hora < 12) 
    ? "Bom dia" 
    : (hora < 18) 
        ? "Boa tarde" 
        : "Boa noite";

// Ícone de status
String icone = (status.equals("success")) 
    ? "✓" 
    : (status.equals("warning")) 
        ? "⚠" 
        : "✗";
```

---

## ⚠️ Armadilhas Comuns

### 1. **Ordem de Condições Importa**

```java
// ❌ Ordem errada: nunca alcança 90+
String nota = (pontos >= 60) ? "D" :   // 90 >= 60 → retorna "D"!
              (pontos >= 70) ? "C" :
              (pontos >= 80) ? "B" :
              (pontos >= 90) ? "A" : "F";

// ✅ Ordem correta: do maior para o menor
String nota = (pontos >= 90) ? "A" :
              (pontos >= 80) ? "B" :
              (pontos >= 70) ? "C" :
              (pontos >= 60) ? "D" : "F";
```

### 2. **Esquecimento de Parênteses**

```java
// ❌ Ambíguo sem parênteses
String r = a ? "A" : b ? "B" : "C";

// ✅ Parênteses tornam intenção clara
String r = a ? "A" : (b ? "B" : "C");
```

### 3. **Tipo Incompatível**

```java
// ❌ Tipos não unificam
// Object o = (a) ? 10 : (b) ? "String" : 3.14;  // Confuso!

// ✅ Tipo comum explícito ou use if-else
```

### 4. **Complexidade Excessiva**

```java
// ❌ Impossível de debugar
String r = (a && b || c) 
    ? (d ? (e ? "X" : "Y") : "Z")
    : (f || g ? (h ? "A" : "B") : "C");

// ✅ Refatore para método
String r = determinarResultadoComplexo(a, b, c, d, e, f, g, h);
```

### 5. **Efeitos Colaterais Ocultos**

```java
int contador = 0;

// ❌ Efeito colateral não óbvio
String r = (contador++ > 5) 
    ? "Alto" 
    : (contador++ > 2) 
        ? "Médio" 
        : "Baixo";

// ✅ Evite efeitos colaterais em condições
```

---

## 🚀 Boas Práticas

### 1. ✅ Limite a 2-3 Níveis

```java
// ✅ Máximo 3 níveis
String r = (a) ? "A" : (b) ? "B" : "C";

// ❌ Evite mais de 3
// String r = (a) ? "A" : (b) ? "B" : (c) ? "C" : (d) ? "D" : "E";
```

### 2. ✅ Formate com Quebras de Linha

```java
// ✅ Legível com quebras
String resultado = (condicao1) ? "Valor 1" :
                   (condicao2) ? "Valor 2" :
                   (condicao3) ? "Valor 3" : "Padrão";
```

### 3. ✅ Use Parênteses Liberalmente

```java
// ✅ Parênteses explícitos
String r = (a) ? "A" : ((b) ? "B" : "C");
```

### 4. ✅ Considere Alternativas

```java
// Se ficou difícil de ler, use if-else ou switch
if (pontos >= 90) {
    nota = "A";
} else if (pontos >= 80) {
    nota = "B";
} else {
    nota = "C";
}
```

### 5. ✅ Extraia para Método se Complexo

```java
// ✅ Método nomeado é mais claro
String classificacao = classificarPontuacao(pontos);

private String classificarPontuacao(int pontos) {
    return (pontos >= 90) ? "Excelente" :
           (pontos >= 70) ? "Bom" :
           (pontos >= 50) ? "Regular" : "Insuficiente";
}
```

### 6. ✅ Documente Lógica Complexa

```java
/**
 * Determina faixa de imposto baseado na renda anual.
 * Faixas: 0-20k: 5%, 20k-50k: 15%, 50k+: 25%
 */
double imposto = (renda < 20000) ? 0.05 :
                 (renda < 50000) ? 0.15 : 0.25;
```

### 7. ✅ Teste Todos os Caminhos

```java
@Test
void testTernarioAninhado() {
    assertEquals("A", classificar(95));  // >= 90
    assertEquals("B", classificar(85));  // >= 80
    assertEquals("C", classificar(75));  // >= 70
    assertEquals("F", classificar(50));  // < 70
}
```

### 8. ✅ Prefira Constantes para Limites

```java
// ✅ Constantes nomeadas
private static final int NOTA_A = 90;
private static final int NOTA_B = 80;
private static final int NOTA_C = 70;

String nota = (pontos >= NOTA_A) ? "A" :
              (pontos >= NOTA_B) ? "B" :
              (pontos >= NOTA_C) ? "C" : "F";
```

### 9. ✅ Evite Aninhamento Bilateral

```java
// ❌ Difícil de rastrear
int r = (a) ? (b ? 1 : 2) : (c ? 3 : 4);

// ✅ Use if-else
int r;
if (a) {
    r = b ? 1 : 2;
} else {
    r = c ? 3 : 4;
}
```

### 10. ✅ Code Review Rigoroso

Ternários aninhados devem passar por revisão rigorosa de código para garantir clareza.

---

## 📚 Resumo

Aninhamento de operadores ternários é uma ferramenta poderosa mas **perigosa**. Use com **extrema moderação** - limite a **2-3 níveis**, formate com **quebras de linha claras**, e sempre priorize **legibilidade sobre concisão**. Quando em dúvida, **prefira if-else** ou extraia para um **método nomeado**. Lembre-se: código é lido muito mais vezes do que é escrito.

