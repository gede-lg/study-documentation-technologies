# Bloco if-else

## 🎯 Introdução e Definição

### Definição Conceitual

O **bloco if-else** é uma estrutura de controle que permite executar **dois caminhos alternativos** de código: um quando a condição é **verdadeira** (`true`) e outro quando é **falsa** (`false`). É uma extensão do if simples que garante que **exatamente um** dos dois blocos será executado.

**Estrutura básica**:
```java
if (condição) {
    // Bloco 1: executado se condição for true
} else {
    // Bloco 2: executado se condição for false
}
```

**Analogia**: É como uma bifurcação na estrada - você sempre toma **um** dos dois caminhos, nunca os dois ou nenhum.

**Exemplo fundamental**:
```java
int idade = 15;

if (idade >= 18) {
    System.out.println("Maior de idade");
} else {
    System.out.println("Menor de idade");
}
// Saída: "Menor de idade"
```

**Importância**:
- ✅ **Garante** que uma ação será tomada (true ou false)
- ✅ **Evita** código duplicado para verificação inversa
- ✅ **Mais eficiente** que dois ifs separados
- ✅ **Mais legível** que condições negadas
- ✅ **Base** para decisões binárias (sim/não, ativo/inativo, etc.)

---

## 📋 Sumário Conceitual

### Componentes do if-else

**1. Cláusula if**: Bloco executado quando condição é `true`
**2. Palavra-chave else**: Introduz alternativa
**3. Cláusula else**: Bloco executado quando condição é `false`
**4. Exclusividade mútua**: Apenas **um** bloco é executado

**Sintaxe completa**:
```java
if (expressão_booleana) {
    // Bloco if (true)
} else {
    // Bloco else (false)
}
```

---

## 🧠 Fundamentos Teóricos

### 1. Anatomia do if-else

**Estrutura completa**:
```java
if (condição) {
    //  ┬      ┬      ┬
    //  │      │      └─ Bloco executado se true
    //  │      └──────── Condição booleana
    //  └─────────────── Palavra-chave if
    
    statement1;
    statement2;
} else {
//  ┬
//  └─ Palavra-chave else (sem condição!)
    
    statement3;
    statement4;
}
```

**Exemplo anotado**:
```java
int temperatura = 28;

if (temperatura > 30) {
    System.out.println("Dia quente");     // NÃO executado (false)
} else {
    System.out.println("Dia agradável");  // EXECUTADO (else)
}
```

### 2. Fluxo de Execução

**Diagrama de fluxo**:
```
    ┌─────────────┐
    │   Início    │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │ if (cond)   │
    └──┬───────┬──┘
       │       │
    true│      │false
       │       │
    ┌──▼───┐ ┌▼────┐
    │Bloco │ │Bloco│
    │ if  │ │else │
    └──┬───┘ └┬────┘
       │       │
       └───┬───┘
           │
    ┌──────▼──────┐
    │     Fim     │
    └─────────────┘
```

**Passo a passo (condição true)**:
```java
System.out.println("1. Antes");

int x = 10;
if (x > 5) {
    System.out.println("2. Bloco if");
} else {
    System.out.println("X. Bloco else (NÃO executado)");
}

System.out.println("3. Depois");

// Saída:
// 1. Antes
// 2. Bloco if
// 3. Depois
```

**Passo a passo (condição false)**:
```java
System.out.println("1. Antes");

int x = 3;
if (x > 5) {
    System.out.println("X. Bloco if (NÃO executado)");
} else {
    System.out.println("2. Bloco else");
}

System.out.println("3. Depois");

// Saída:
// 1. Antes
// 2. Bloco else
// 3. Depois
```

### 3. if-else vs Dois ifs Separados

**❌ Dois ifs separados (ineficiente)**:
```java
int idade = 20;

if (idade >= 18) {
    System.out.println("Maior de idade");
}

if (idade < 18) {  // Avalia condição mesmo se primeira foi true!
    System.out.println("Menor de idade");
}
// Problema: avalia DUAS condições sempre
```

**✅ if-else (eficiente)**:
```java
int idade = 20;

if (idade >= 18) {
    System.out.println("Maior de idade");
} else {
    System.out.println("Menor de idade");
}
// Vantagem: avalia apenas UMA condição
```

**Comparação de eficiência**:
| Abordagem | Condições Avaliadas | Performance |
|-----------|-------------------|-------------|
| Dois ifs | Sempre 2 | Menor |
| if-else | Apenas 1 | Maior |

### 4. Alternativas Mutuamente Exclusivas

**if-else** garante que **exatamente um** bloco será executado:

```java
boolean logado = usuario.isLogado();

if (logado) {
    mostrarDashboard();
} else {
    mostrarLogin();
}
// Sempre mostra UM: dashboard OU login, nunca ambos ou nenhum
```

**Aplicação prática**:
```java
double saldo = conta.getSaldo();
double valorCompra = 100.0;

if (saldo >= valorCompra) {
    System.out.println("Compra aprovada");
    saldo -= valorCompra;
} else {
    System.out.println("Saldo insuficiente");
}
```

### 5. Bloco else sem Condição

**⚠️ IMPORTANTE**: `else` não tem condição própria - é o "caso contrário".

```java
// ✅ Correto: else sem condição
if (x > 0) {
    System.out.println("Positivo");
} else {
    System.out.println("Zero ou negativo");
}

// ❌ ERRO: else não aceita condição
// if (x > 0) {
//     System.out.println("Positivo");
// } else (x < 0) {  // ERRO DE SINTAXE!
//     System.out.println("Negativo");
// }
```

### 6. Tipos de Alternativas Binárias

**Booleanos diretos**:
```java
boolean isAtivo = true;

if (isAtivo) {
    System.out.println("Status: Ativo");
} else {
    System.out.println("Status: Inativo");
}
```

**Comparações**:
```java
int nota = 75;

if (nota >= 60) {
    System.out.println("Aprovado");
} else {
    System.out.println("Reprovado");
}
```

**Verificação de null**:
```java
String nome = usuario.getNome();

if (nome != null) {
    System.out.println("Nome: " + nome);
} else {
    System.out.println("Nome não informado");
}
```

**Tipo de objeto**:
```java
Object obj = getValue();

if (obj instanceof String) {
    String s = (String) obj;
    System.out.println("String: " + s.toUpperCase());
} else {
    System.out.println("Não é String");
}
```

### 7. Retorno em Blocos if-else

**Retornos diferentes**:
```java
public String getStatus(boolean ativo) {
    if (ativo) {
        return "Ativo";
    } else {
        return "Inativo";
    }
}
```

**Early return (alternativa)**:
```java
public String getStatus(boolean ativo) {
    if (ativo) {
        return "Ativo";
    }
    return "Inativo";  // Não precisa else se retornar antes
}
```

### 8. Atribuição Condicional com if-else

**Atribuição de valores**:
```java
int idade = 25;
String categoria;

if (idade >= 18) {
    categoria = "Adulto";
} else {
    categoria = "Menor";
}

System.out.println("Categoria: " + categoria);
```

**Alternativa com operador ternário**:
```java
int idade = 25;
String categoria = (idade >= 18) ? "Adulto" : "Menor";
```

### 9. Modificação de Variáveis

**Incremento condicional**:
```java
int pontos = 100;
boolean venceu = true;

if (venceu) {
    pontos += 50;  // Adiciona bônus
} else {
    pontos -= 10;  // Penalidade
}

System.out.println("Pontos: " + pontos);
```

**Cálculos diferentes**:
```java
double valor = 1000.0;
boolean cliente premium = true;
double desconto;

if (premiumCliente) {
    desconto = valor * 0.20;  // 20% desconto
} else {
    desconto = valor * 0.10;  // 10% desconto
}

double total = valor - desconto;
```

### 10. Exemplos Práticos Completos

#### **Validação com Feedback**

```java
public void validarIdade(int idade) {
    if (idade >= 0 && idade <= 120) {
        System.out.println("Idade válida: " + idade);
    } else {
        System.out.println("Idade inválida!");
    }
}
```

#### **Autenticação**

```java
public void autenticar(String senha) {
    if (senha.equals(SENHA_CORRETA)) {
        System.out.println("Login realizado com sucesso");
        usuario.setLogado(true);
    } else {
        System.out.println("Senha incorreta");
        tentativasErradas++;
    }
}
```

#### **Cálculo de Desconto**

```java
public double calcularTotal(double valor, boolean temCupom) {
    double total;
    
    if (temCupom) {
        total = valor * 0.85;  // 15% desconto
        System.out.println("Desconto aplicado!");
    } else {
        total = valor;
        System.out.println("Sem desconto");
    }
    
    return total;
}
```

#### **Processamento Alternativo**

```java
public void processarPagamento(String tipo) {
    if (tipo.equals("CREDITO")) {
        processarCartaoCredito();
    } else {
        processarOutraFormaPagamento();
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Por Que if-else em Vez de Dois ifs?

**1. Eficiência**

```java
// ❌ Dois ifs: avalia duas condições
if (x > 0) {
    positivo();
}
if (x <= 0) {  // Avalia mesmo se primeira foi true
    naoPositivo();
}

// ✅ if-else: avalia apenas uma
if (x > 0) {
    positivo();
} else {
    naoPositivo();  // Só entra se condição foi false
}
```

**2. Garantia de Exclusividade**

```java
// ❌ Dois ifs: pode executar ambos se houver erro lógico
if (aprovado) {
    aprovar();
}
if (!aprovado) {  // Se "aprovado" mudar entre os ifs?
    reprovar();
}

// ✅ if-else: garante que apenas um será executado
if (aprovado) {
    aprovar();
} else {
    reprovar();
}
```

**3. Legibilidade**

```java
// ❌ Condição negada (menos claro)
if (idade >= 18) {
    maiorIdade();
}
if (!(idade >= 18)) {  // Negação complica
    menorIdade();
}

// ✅ else (mais claro)
if (idade >= 18) {
    maiorIdade();
} else {
    menorIdade();
}
```

### if-else vs Operador Ternário

| Aspecto | if-else | Operador Ternário |
|---------|---------|------------------|
| **Uso** | Qualquer statement | Apenas atribuição/retorno |
| **Legibilidade** | Mais clara para lógica complexa | Mais conciso para simples |
| **Múltiplas linhas** | Sim | Não recomendado |
| **Exemplo** | `if (x) { a(); } else { b(); }` | `y = x ? 10 : 20` |

```java
// ✅ if-else para múltiplas ações
if (logado) {
    mostrarDashboard();
    carregarDados();
    atualizarUltimoAcesso();
} else {
    mostrarLogin();
    registrarTentativa();
}

// ✅ Ternário para atribuição simples
String status = logado ? "Online" : "Offline";
```

---

## 🎯 Aplicabilidade e Contextos

### 1. **Decisões Binárias**

```java
if (usuario.isPremium()) {
    aplicarDescontoPremium();
} else {
    aplicarDescontoRegular();
}
```

### 2. **Validação com Tratamento**

```java
if (email.contains("@")) {
    enviarEmail(email);
} else {
    System.out.println("Email inválido");
}
```

### 3. **Autorização**

```java
if (usuario.hasPermission("ADMIN")) {
    exibirPainelAdmin();
} else {
    exibirPainelUsuario();
}
```

### 4. **Cálculos Condicionais**

```java
double frete;
if (valorCompra >= 100.0) {
    frete = 0.0;  // Frete grátis
} else {
    frete = 15.0;
}
```

### 5. **Fluxo Alternativo**

```java
if (arquivo.exists()) {
    processarArquivo(arquivo);
} else {
    criarArquivoNovo();
}
```

### 6. **Formatação Condicional**

```java
String mensagem;
if (quantidade == 1) {
    mensagem = quantidade + " item";
} else {
    mensagem = quantidade + " itens";
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **else Sem if**

```java
// ❌ ERRO: else sem if
// else {
//     statement;
// }

// ✅ else sempre após if
if (condicao) {
    statement1;
} else {
    statement2;
}
```

### 2. **Condição em else**

```java
// ❌ ERRO: else não aceita condição
// if (x > 0) {
//     positivo();
// } else (x < 0) {  // ERRO!
//     negativo();
// }

// ✅ Use else if para múltiplas condições
if (x > 0) {
    positivo();
} else if (x < 0) {
    negativo();
} else {
    zero();
}
```

### 3. **Bloco sem Chaves**

```java
// ❌ Perigoso
if (condicao)
    linha1();
else
    linha2();
    linha3();  // NÃO faz parte do else!

// ✅ Sempre use chaves
if (condicao) {
    linha1();
} else {
    linha2();
    linha3();
}
```

### 4. **Variável Não Inicializada**

```java
// ❌ Pode não ser inicializada
String status;
if (condicao) {
    status = "Ativo";
}
// System.out.println(status);  // ERRO se condicao for false!

// ✅ Garanta inicialização
String status;
if (condicao) {
    status = "Ativo";
} else {
    status = "Inativo";
}
System.out.println(status);  // OK
```

### 5. **Comparação de Referências**

```java
String s1 = new String("Java");
String s2 = new String("Java");

// ❌ Compara referências
if (s1 == s2) {
    System.out.println("Iguais");
} else {
    System.out.println("Diferentes");  // Executado (referências diferentes)
}

// ✅ Compara conteúdo
if (s1.equals(s2)) {
    System.out.println("Iguais");  // Executado (conteúdo igual)
} else {
    System.out.println("Diferentes");
}
```

---

## 🔗 Interconexões Conceituais

### Relacionamento com Outros Conceitos

- **if simples**: Base do if-else (adiciona cláusula else)
- **if-else-if**: Extensão para múltiplas condições
- **Operador ternário**: Alternativa para atribuição condicional
- **switch**: Alternativa para múltiplos valores
- **Escopo**: Variáveis em cada bloco têm escopo limitado
- **Short-circuit**: && e || podem evitar avaliação do else
- **Early return**: Alternativa ao else em alguns casos

---

## 🚀 Boas Práticas

### 1. ✅ Sempre Use Chaves

```java
// ✅ SEMPRE
if (condicao) {
    statement1;
} else {
    statement2;
}

// ❌ NUNCA
if (condicao)
    statement1;
else
    statement2;
```

### 2. ✅ Prefira Condições Positivas

```java
// ✅ Positivo (mais claro)
if (isAtivo) {
    processar();
} else {
    ignorar();
}

// ❌ Negativo (menos claro)
if (!isInativo) {
    processar();
} else {
    ignorar();
}
```

### 3. ✅ Early Return em vez de else

```java
// ✅ Early return (menos aninhamento)
public void processar(String valor) {
    if (valor == null) {
        return;
    }
    
    // Processamento normal
    System.out.println(valor.toUpperCase());
}

// ❌ else desnecessário
public void processar(String valor) {
    if (valor == null) {
        return;
    } else {  // else desnecessário
        System.out.println(valor.toUpperCase());
    }
}
```

### 4. ✅ Ternário para Atribuição Simples

```java
// ✅ Ternário (conciso)
String status = logado ? "Online" : "Offline";

// ❌ if-else para simples (verboso)
String status;
if (logado) {
    status = "Online";
} else {
    status = "Offline";
}
```

### 5. ✅ Formatação Consistente

```java
// ✅ Bem formatado
if (condicao) {
    statement1;
    statement2;
} else {
    statement3;
    statement4;
}

// ❌ Mal formatado
if(condicao){statement1;statement2;}else{statement3;statement4;}
```

### 6. ✅ Comentários em Lógica Complexa

```java
if (idade >= 18 && temCarteira) {
    // Permite dirigir: maior de idade COM carteira
    permitirDirigir();
} else {
    // Proíbe dirigir: menor de idade OU sem carteira
    proibirDirigir();
}
```

### 7. ✅ Evite Blocos Vazios

```java
// ❌ Bloco vazio
if (condicao) {
    processar();
} else {
    // Vazio
}

// ✅ Remova else se vazio
if (condicao) {
    processar();
}
```

### 8. ✅ Use Variáveis Descritivas

```java
// ✅ Variável descritiva
boolean podeAcessar = usuario.isAtivo() && usuario.isPago();
if (podeAcessar) {
    liberarAcesso();
} else {
    negarAcesso();
}

// ❌ Condição inline complexa
if (usuario.isAtivo() && usuario.isPago()) {
    liberarAcesso();
} else {
    negarAcesso();
}
```

### 9. ✅ Teste Ambos os Caminhos

```java
@Test
void testIfElse() {
    // Testa caminho if (true)
    assertTrue(valor >= 18);
    
    // Testa caminho else (false)
    assertFalse(valor < 18);
}
```

### 10. ✅ Consistência no Estilo

Escolha um estilo e mantenha em todo o projeto:
- Chaves sempre (mesmo para uma linha)
- else na mesma linha do `}` do if
- Indentação consistente (4 espaços ou tab)

---

## 📚 Resumo

O **bloco if-else** estende o if simples adicionando uma cláusula **else** que é executada quando a condição é **false**, garantindo que **exatamente um** dos dois blocos será executado. Isso é mais **eficiente** que dois ifs separados (avalia apenas uma condição), mais **legível** que condições negadas, e garante **exclusividade mútua** entre os caminhos. Use if-else para **decisões binárias** (aprovado/reprovado, ativo/inativo, etc.), **sempre com chaves** `{}` para evitar bugs, e prefira **condições positivas** para maior clareza. Para **atribuição simples**, considere o **operador ternário** como alternativa mais concisa. Em métodos, **early return** pode eliminar a necessidade de else, reduzindo aninhamento.

