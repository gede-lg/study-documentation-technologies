# if-else-if Encadeado

## 🎯 Introdução e Definição

### Definição Conceitual

O **if-else-if encadeado** (também chamado de **ladder** ou **cascata**) é uma estrutura de controle que permite avaliar **múltiplas condições** em sequência, executando apenas o primeiro bloco cuja condição seja **verdadeira**. É uma extensão do if-else para situações com **mais de duas alternativas**.

**Estrutura básica**:
```java
if (condição1) {
    // Executado se condição1 for true
} else if (condição2) {
    // Executado se condição1 for false E condição2 for true
} else if (condição3) {
    // Executado se condição1 e condição2 forem false E condição3 for true
} else {
    // Executado se TODAS as condições forem false (opcional)
}
```

**Analogia**: É como uma série de portas em sequência - você passa pela **primeira porta aberta** que encontrar e ignora as demais.

**Exemplo fundamental**:
```java
int nota = 75;

if (nota >= 90) {
    System.out.println("Conceito A");
} else if (nota >= 70) {
    System.out.println("Conceito B");  // EXECUTADO (75 >= 70)
} else if (nota >= 50) {
    System.out.println("Conceito C");  // NÃO AVALIADO
} else {
    System.out.println("Conceito D");
}
// Saída: "Conceito B"
```

**Importância**:
- ✅ **Múltiplas alternativas** em uma única estrutura
- ✅ **Primeira condição verdadeira** vence
- ✅ **Mais eficiente** que múltiplos ifs independentes
- ✅ **Mais legível** que ifs aninhados
- ✅ **Alternativa** ao switch para condições complexas

---

## 📋 Sumário Conceitual

### Componentes do if-else-if

**1. Cláusula if inicial**: Primeira condição avaliada
**2. Cláusulas else if**: Condições subsequentes (uma ou mais)
**3. Cláusula else final**: Caso padrão (opcional)
**4. Avaliação sequencial**: Para na primeira condição `true`
**5. Exclusividade mútua**: Apenas **um** bloco é executado

**Sintaxe completa**:
```java
if (expressão1) {
    // Bloco 1
} else if (expressão2) {
    // Bloco 2
} else if (expressão3) {
    // Bloco 3
} else {
    // Bloco padrão
}
```

---

## 🧠 Fundamentos Teóricos

### 1. Anatomia do if-else-if

**Estrutura completa**:
```java
if (condição1) {
//  ┬      ┬
//  │      └────── Condição 1 (avaliada SEMPRE)
//  └───────────── Palavra-chave if
    
    bloco1;
    
} else if (condição2) {
//  ┬  ┬      ┬
//  │  │      └──── Condição 2 (avaliada SÓ SE condição1 for false)
//  │  └─────────── Palavra-chave if
//  └────────────── Palavra-chave else
    
    bloco2;
    
} else if (condição3) {
//            ┬
//            └──── Condição 3 (avaliada SÓ SE condição1 E condição2 forem false)
    
    bloco3;
    
} else {
//  ┬
//  └───────────── else final (executado se TODAS as condições forem false)
    
    blocoDefault;
}
```

### 2. Fluxo de Avaliação Sequencial

**Diagrama de fluxo**:
```
         ┌─────────┐
         │ Início  │
         └────┬────┘
              │
       ┌──────▼──────┐
       │ if (cond1)  │
       └──┬───────┬──┘
     true │       │ false
          │       │
    ┌─────▼─┐ ┌──▼──────────┐
    │Bloco1 │ │ if (cond2)  │
    └───┬───┘ └──┬───────┬──┘
        │    true │       │ false
        │         │       │
        │   ┌─────▼─┐ ┌──▼──────────┐
        │   │Bloco2 │ │ if (cond3)  │
        │   └───┬───┘ └──┬───────┬──┘
        │       │    true │       │ false
        │       │         │       │
        │       │   ┌─────▼─┐ ┌──▼────┐
        │       │   │Bloco3 │ │ else  │
        │       │   └───┬───┘ └──┬────┘
        │       │       │         │
        └───┬───┴───┬───┴─────┬───┘
            │       │         │
         ┌──▼───────▼─────────▼──┐
         │         Fim           │
         └───────────────────────┘
```

**Passo a passo**:
```java
int x = 15;

System.out.println("1. Início");

if (x > 20) {
    System.out.println("X. Maior que 20 (NÃO executado)");
} else if (x > 10) {
    System.out.println("2. Maior que 10 (EXECUTADO)");
} else if (x > 5) {
    System.out.println("X. Maior que 5 (NÃO AVALIADO)");
} else {
    System.out.println("X. 5 ou menos (NÃO AVALIADO)");
}

System.out.println("3. Fim");

// Saída:
// 1. Início
// 2. Maior que 10
// 3. Fim
```

### 3. Primeira Condição True Vence

**⚡ IMPORTANTE**: Apenas a **primeira** condição verdadeira é executada, mesmo que outras sejam verdadeiras.

```java
int idade = 25;

if (idade > 10) {
    System.out.println("Maior que 10");  // EXECUTADO
} else if (idade > 20) {
    System.out.println("Maior que 20");  // NÃO AVALIADO (mesmo sendo true!)
} else if (idade > 18) {
    System.out.println("Maior que 18");  // NÃO AVALIADO
}
// Saída: "Maior que 10"
```

**Por isso a ordem importa**:
```java
// ❌ Ordem errada: condições específicas após genéricas
if (nota >= 0) {      // SEMPRE executado para notas válidas
    System.out.println("Nota válida");
} else if (nota >= 90) {
    System.out.println("Conceito A");  // NUNCA executado!
}

// ✅ Ordem correta: condições específicas primeiro
if (nota >= 90) {
    System.out.println("Conceito A");
} else if (nota >= 0) {
    System.out.println("Nota válida");
}
```

### 4. else Final como Default

O `else` final é **opcional**, mas útil para casos padrão ou inesperados:

```java
// ✅ Com else (trata todos os casos)
if (dia == 1) {
    System.out.println("Domingo");
} else if (dia == 2) {
    System.out.println("Segunda");
} else {
    System.out.println("Dia inválido");  // Default
}

// ⚠️ Sem else (não trata casos inesperados)
if (dia == 1) {
    System.out.println("Domingo");
} else if (dia == 2) {
    System.out.println("Segunda");
}
// Se dia for 3, nada acontece!
```

### 5. if-else-if vs Múltiplos ifs Independentes

**❌ Múltiplos ifs independentes (avalia TODAS as condições)**:
```java
int nota = 85;

if (nota >= 90) {
    System.out.println("A");
}
if (nota >= 70) {  // Avaliado mesmo se nota >= 90 foi false
    System.out.println("B");  // EXECUTADO
}
if (nota >= 50) {  // Também avaliado
    System.out.println("C");  // EXECUTADO
}
// Saída: B \n C (INCORRETO!)
```

**✅ if-else-if (para na primeira condição true)**:
```java
int nota = 85;

if (nota >= 90) {
    System.out.println("A");
} else if (nota >= 70) {
    System.out.println("B");  // EXECUTADO
} else if (nota >= 50) {
    System.out.println("C");  // NÃO AVALIADO
}
// Saída: B (CORRETO!)
```

### 6. Quando Usar if-else-if

**✅ Use if-else-if quando**:
- Condições são **mutuamente exclusivas**
- Apenas **um** caso deve ser executado
- Condições envolvem **faixas ou categorias**
- Condições são **complexas** (não apenas valores)

**❌ NÃO use if-else-if quando**:
- **Múltiplas** ações podem ocorrer simultaneamente
- Verificando valores **constantes** (use switch)
- Condições são **independentes**

### 7. Faixas de Valores

**Classificação de notas**:
```java
if (nota >= 90) {
    System.out.println("A");
} else if (nota >= 80) {
    System.out.println("B");
} else if (nota >= 70) {
    System.out.println("C");
} else if (nota >= 60) {
    System.out.println("D");
} else {
    System.out.println("F");
}
```

**Faixas etárias**:
```java
if (idade < 12) {
    categoria = "Criança";
} else if (idade < 18) {
    categoria = "Adolescente";
} else if (idade < 60) {
    categoria = "Adulto";
} else {
    categoria = "Idoso";
}
```

### 8. Condições Complexas

**Combinação de critérios**:
```java
if (salario > 10000 && tempoEmpresa > 5) {
    nivel = "Sênior";
} else if (salario > 5000 || tempoEmpresa > 3) {
    nivel = "Pleno";
} else if (salario > 2000) {
    nivel = "Júnior";
} else {
    nivel = "Estagiário";
}
```

**Tipo de objeto**:
```java
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println("String: " + s);
} else if (obj instanceof Integer) {
    Integer i = (Integer) obj;
    System.out.println("Integer: " + i);
} else if (obj instanceof Double) {
    Double d = (Double) obj;
    System.out.println("Double: " + d);
} else {
    System.out.println("Tipo desconhecido");
}
```

### 9. Retorno em Cláusulas

**Early return elimina else if**:
```java
// ✅ Com early return (mais limpo)
public String getConceito(int nota) {
    if (nota >= 90) {
        return "A";
    }
    if (nota >= 70) {
        return "B";
    }
    if (nota >= 50) {
        return "C";
    }
    return "D";
}

// ✅ Com else if (explícito)
public String getConceito(int nota) {
    if (nota >= 90) {
        return "A";
    } else if (nota >= 70) {
        return "B";
    } else if (nota >= 50) {
        return "C";
    } else {
        return "D";
    }
}
```

### 10. Exemplos Práticos Completos

#### **Sistema de Descontos por Faixa de Valor**

```java
public double calcularDesconto(double valor) {
    double desconto;
    
    if (valor >= 1000) {
        desconto = 0.20;  // 20% desconto
        System.out.println("Desconto Platinum");
    } else if (valor >= 500) {
        desconto = 0.15;  // 15% desconto
        System.out.println("Desconto Gold");
    } else if (valor >= 200) {
        desconto = 0.10;  // 10% desconto
        System.out.println("Desconto Silver");
    } else {
        desconto = 0.05;  // 5% desconto
        System.out.println("Desconto Bronze");
    }
    
    return valor * (1 - desconto);
}
```

#### **Classificação de IMC**

```java
public void classificarIMC(double imc) {
    if (imc < 18.5) {
        System.out.println("Abaixo do peso");
    } else if (imc < 25) {
        System.out.println("Peso normal");
    } else if (imc < 30) {
        System.out.println("Sobrepeso");
    } else if (imc < 35) {
        System.out.println("Obesidade Grau I");
    } else if (imc < 40) {
        System.out.println("Obesidade Grau II");
    } else {
        System.out.println("Obesidade Grau III");
    }
}
```

#### **Menu de Opções**

```java
public void processarOpcao(int opcao) {
    if (opcao == 1) {
        cadastrarCliente();
    } else if (opcao == 2) {
        consultarCliente();
    } else if (opcao == 3) {
        atualizarCliente();
    } else if (opcao == 4) {
        excluirCliente();
    } else if (opcao == 0) {
        System.out.println("Saindo...");
    } else {
        System.out.println("Opção inválida!");
    }
}
```

#### **Cálculo de Imposto Progressivo**

```java
public double calcularImposto(double renda) {
    double imposto;
    
    if (renda <= 2000) {
        imposto = 0;  // Isento
    } else if (renda <= 3000) {
        imposto = (renda - 2000) * 0.075;  // 7.5%
    } else if (renda <= 4500) {
        imposto = 1000 * 0.075 + (renda - 3000) * 0.15;  // 15%
    } else {
        imposto = 1000 * 0.075 + 1500 * 0.15 + (renda - 4500) * 0.225;  // 22.5%
    }
    
    return imposto;
}
```

---

## 🔍 Análise Conceitual Profunda

### Por Que if-else-if em Vez de switch?

**✅ Use if-else-if quando**:
- Condições envolvem **faixas** (>, <, >=, <=)
- Condições são **complexas** (combinam &&, ||)
- Comparações com **objetos** (equals, instanceof)
- Condições **não constantes**

```java
// ✅ if-else-if (faixas)
if (nota >= 90) {
    conceito = "A";
} else if (nota >= 70) {
    conceito = "B";
}
```

**✅ Use switch quando**:
- Valores são **constantes** (int, String, enum)
- **Muitos** casos (5+)
- Casos são **valores exatos**, não faixas

```java
// ✅ switch (valores exatos)
switch (dia) {
    case 1: nome = "Domingo"; break;
    case 2: nome = "Segunda"; break;
    // ...
}
```

### Ordem das Condições

**⚡ A ordem importa** quando condições podem sobrepor:

```java
// ❌ Ordem errada: específico APÓS genérico
if (idade > 0) {
    System.out.println("Idade válida");  // SEMPRE executado
} else if (idade >= 18) {
    System.out.println("Maior de idade");  // NUNCA executado!
}

// ✅ Ordem correta: específico ANTES de genérico
if (idade >= 18) {
    System.out.println("Maior de idade");
} else if (idade > 0) {
    System.out.println("Menor de idade válido");
}
```

**Regra**: Condições mais **específicas** ou **restritivas** primeiro.

### Otimização: Condições Mais Frequentes Primeiro

```java
// ✅ Otimizado: caso mais comum primeiro
if (status.equals("ATIVO")) {      // 90% dos casos
    processarAtivo();
} else if (status.equals("INATIVO")) {  // 8% dos casos
    processarInativo();
} else if (status.equals("PENDENTE")) {  // 2% dos casos
    processarPendente();
}
```

### if-else-if vs Polimorfismo

Para **tipos**, considere **polimorfismo**:

```java
// ❌ if-else-if para tipos
if (animal instanceof Cachorro) {
    ((Cachorro) animal).latir();
} else if (animal instanceof Gato) {
    ((Gato) animal).miar();
}

// ✅ Polimorfismo
animal.emitirSom();  // Cada classe implementa seu som
```

---

## 🎯 Aplicabilidade e Contextos

### 1. **Classificação de Valores em Faixas**

```java
if (temperatura < 0) {
    condicao = "Congelante";
} else if (temperatura < 15) {
    condicao = "Frio";
} else if (temperatura < 25) {
    condicao = "Agradável";
} else if (temperatura < 35) {
    condicao = "Quente";
} else {
    condicao = "Muito quente";
}
```

### 2. **Sistema de Permissões**

```java
if (usuario.isAdmin()) {
    liberarTodasFuncionalidades();
} else if (usuario.isModerador()) {
    liberarFuncionalidadesModerador();
} else if (usuario.isPremium()) {
    liberarFuncionalidadesPremium();
} else {
    liberarFuncionalidadesBasicas();
}
```

### 3. **Validação Progressiva**

```java
if (email == null || email.isEmpty()) {
    erro = "Email obrigatório";
} else if (!email.contains("@")) {
    erro = "Email inválido";
} else if (emailJaCadastrado(email)) {
    erro = "Email já existe";
} else {
    erro = null;  // Válido
}
```

### 4. **Cálculos com Regras Diferentes**

```java
if (horasTrabalhadas <= 40) {
    salario = horasTrabalhadas * valorHora;
} else if (horasTrabalhadas <= 50) {
    salario = 40 * valorHora + (horasTrabalhadas - 40) * valorHora * 1.5;
} else {
    salario = 40 * valorHora + 10 * valorHora * 1.5 + (horasTrabalhadas - 50) * valorHora * 2;
}
```

### 5. **Roteamento de Requisições**

```java
if (url.startsWith("/api/users")) {
    handleUsers(request);
} else if (url.startsWith("/api/products")) {
    handleProducts(request);
} else if (url.startsWith("/api/orders")) {
    handleOrders(request);
} else {
    send404(request);
}
```

### 6. **Formatação Condicional**

```java
if (quantidade == 0) {
    mensagem = "Nenhum item";
} else if (quantidade == 1) {
    mensagem = "1 item";
} else if (quantidade < 10) {
    mensagem = quantidade + " itens";
} else {
    mensagem = "Muitos itens (" + quantidade + ")";
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Ordem Incorreta das Condições**

```java
// ❌ Condições amplas antes de específicas
if (x > 0) {
    System.out.println("Positivo");  // SEMPRE executado para x > 10
} else if (x > 10) {
    System.out.println("Maior que 10");  // NUNCA executado!
}

// ✅ Condições específicas primeiro
if (x > 10) {
    System.out.println("Maior que 10");
} else if (x > 0) {
    System.out.println("Positivo até 10");
}
```

### 2. **Esquecer else Final**

```java
// ⚠️ Sem else: casos inesperados não tratados
if (dia == 1) {
    nome = "Domingo";
} else if (dia == 2) {
    nome = "Segunda";
}
// Se dia for 5, "nome" pode ficar null ou com valor antigo!

// ✅ Com else: trata casos inesperados
if (dia == 1) {
    nome = "Domingo";
} else if (dia == 2) {
    nome = "Segunda";
} else {
    nome = "Dia inválido";
}
```

### 3. **Usar == para Strings**

```java
// ❌ Compara referências
String tipo = getTipo();
if (tipo == "ADMIN") {  // Pode falhar!
    liberarAdmin();
} else if (tipo == "USER") {
    liberarUser();
}

// ✅ Compara conteúdo
if ("ADMIN".equals(tipo)) {  // Seguro contra null
    liberarAdmin();
} else if ("USER".equals(tipo)) {
    liberarUser();
}
```

### 4. **Condições Sobrepostas**

```java
// ❌ Condições sobrepostas: segunda nunca executada
if (nota >= 70) {
    System.out.println("Aprovado");
} else if (nota >= 90) {  // Impossível: se nota >= 90, primeira já executou!
    System.out.println("Aprovado com louvor");
}

// ✅ Condições corretas
if (nota >= 90) {
    System.out.println("Aprovado com louvor");
} else if (nota >= 70) {
    System.out.println("Aprovado");
}
```

### 5. **Muitas Condições (código smell)**

```java
// ❌ 10+ else if: difícil de manter
if (opcao == 1) {
    // ...
} else if (opcao == 2) {
    // ...
} else if (opcao == 3) {
    // ...
// ... 7 mais ...
} else {
    // ...
}

// ✅ Use switch, Map, ou polimorfismo
switch (opcao) {
    case 1: /* ... */ break;
    case 2: /* ... */ break;
    // ...
}
```

### 6. **Bloco sem Chaves**

```java
// ❌ Sem chaves: perigoso
if (x > 10)
    System.out.println("Maior que 10");
else if (x > 5)
    System.out.println("Maior que 5");
    System.out.println("Linha extra");  // NÃO está no else if!

// ✅ Com chaves: claro
if (x > 10) {
    System.out.println("Maior que 10");
} else if (x > 5) {
    System.out.println("Maior que 5");
    System.out.println("Linha extra");
}
```

---

## 🔗 Interconexões Conceituais

### Relacionamento com Outros Conceitos

- **if simples**: Base do if-else-if
- **if-else**: Extensão para 2+ alternativas
- **switch**: Alternativa para valores constantes
- **Operador ternário**: Não permite múltiplas condições
- **Polimorfismo**: Alternativa OO para tipos
- **Map/Dictionary**: Alternativa para mapeamento valor → ação
- **Strategy Pattern**: Alternativa para comportamentos complexos
- **Short-circuit**: && e || evitam avaliação desnecessária

---

## 🚀 Boas Práticas

### 1. ✅ Condições Mais Específicas Primeiro

```java
// ✅ Específico → Genérico
if (salario > 10000 && bonus > 5000) {
    nivel = "Executivo";
} else if (salario > 10000) {
    nivel = "Gerente";
} else if (salario > 5000) {
    nivel = "Sênior";
} else {
    nivel = "Júnior";
}
```

### 2. ✅ Sempre Inclua else Final

```java
// ✅ else trata casos inesperados
if (tipo.equals("A")) {
    processoA();
} else if (tipo.equals("B")) {
    processoB();
} else {
    throw new IllegalArgumentException("Tipo inválido: " + tipo);
}
```

### 3. ✅ Use equals() para Strings

```java
// ✅ equals com literal primeiro (null-safe)
if ("ADMIN".equals(role)) {
    liberarAdmin();
} else if ("USER".equals(role)) {
    liberarUser();
}
```

### 4. ✅ Limite Número de else if (máximo 5)

```java
// ❌ Muitos else if (use switch ou Map)
if (x == 1) { /* ... */ }
else if (x == 2) { /* ... */ }
else if (x == 3) { /* ... */ }
// ... 10 mais ...

// ✅ switch para valores
switch (x) {
    case 1: /* ... */ break;
    case 2: /* ... */ break;
    // ...
}
```

### 5. ✅ Extraia Condições Complexas

```java
// ✅ Variáveis descritivas
boolean isVIP = cliente.isPremium() && cliente.getCompras() > 10;
boolean temDesconto = isVIP || promocaoAtiva;

if (temDesconto) {
    aplicarDesconto();
} else {
    precoNormal();
}
```

### 6. ✅ Use Early Return em Métodos

```java
// ✅ Early return reduz aninhamento
public String categorizar(int valor) {
    if (valor < 0) {
        return "Inválido";
    }
    if (valor < 100) {
        return "Baixo";
    }
    if (valor < 500) {
        return "Médio";
    }
    return "Alto";
}
```

### 7. ✅ Formatação Clara

```java
// ✅ else if na mesma linha do } anterior
if (condicao1) {
    bloco1();
} else if (condicao2) {
    bloco2();
} else {
    blocoDefault();
}
```

### 8. ✅ Comentários em Condições Complexas

```java
if (idade >= 18 && temCarteira && semMultas) {
    // Pode dirigir: maior de idade, habilitado, sem restrições
    permitirDirigir();
} else if (idade >= 18 && temCarteira) {
    // Pode dirigir com restrições: maior de idade, habilitado, mas com multas
    permitirDirigirComRestricoes();
} else {
    // Não pode dirigir
    negarDirigir();
}
```

### 9. ✅ Evite Lógica Duplicada

```java
// ❌ Lógica duplicada
if (tipo.equals("A")) {
    calcularPreco();
    aplicarDesconto();
} else if (tipo.equals("B")) {
    calcularPreco();
    aplicarDesconto();
}

// ✅ Extraia lógica comum
calcularPreco();
aplicarDesconto();
if (tipo.equals("A")) {
    // Apenas lógica específica
} else if (tipo.equals("B")) {
    // Apenas lógica específica
}
```

### 10. ✅ Teste Todos os Caminhos

```java
@Test
void testIfElseIf() {
    // Testa cada caminho
    assertEquals("A", getConceito(95));   // if
    assertEquals("B", getConceito(85));   // else if 1
    assertEquals("C", getConceito(75));   // else if 2
    assertEquals("D", getConceito(55));   // else
}
```

---

## 📚 Resumo

O **if-else-if encadeado** permite avaliar **múltiplas condições** em sequência, executando apenas o **primeiro bloco** cuja condição seja `true`. É uma extensão do if-else para situações com **mais de duas alternativas**. A **ordem das condições importa**: condições mais **específicas** devem vir **antes** de genéricas para evitar que sejam ignoradas. O `else` final é **opcional**, mas recomendado para tratar casos **padrão** ou **inesperados**. Use if-else-if para **faixas de valores** (notas, idades), **condições complexas** (combinando &&, ||), ou quando **switch não é aplicável**. Para **muitos casos** (5+) de valores constantes, prefira **switch**. Para **tipos**, considere **polimorfismo**. **Sempre** use chaves `{}`, **limite** o número de else if (máximo 5), e **teste todos os caminhos** possíveis.

