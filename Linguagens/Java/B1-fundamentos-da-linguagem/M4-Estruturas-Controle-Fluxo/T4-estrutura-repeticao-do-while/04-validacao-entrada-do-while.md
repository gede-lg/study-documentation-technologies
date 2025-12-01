# Validação de Entrada com do-while

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Validação de entrada com `do-while`** é padrão idiomático onde loop **pede entrada do usuário** e **repete até valor ser válido**. Conceitualmente, implementa **retry interativo** — dá ao usuário múltiplas chances de fornecer input correto, com feedback sobre erros.

**Padrão Essencial:**

```java
TipoValor valor;

do {
    // 1. Solicitar entrada
    valor = lerEntrada();

    // 2. Validar
    if (!valido(valor)) {
        // 3. Feedback de erro
        exibirErro();
    }
} while (!valido(valor));  // 4. Repetir se inválido

// 5. Usar valor válido
processar(valor);
```

**Conceito Fundamental:** `do-while` é estrutura **perfeita** para validação porque **precisa pedir antes de validar** — não há como validar input que ainda não foi fornecido. Semântica at-least-once elimina duplicação de código (pedir fora + dentro do loop).

### Contexto Histórico e Motivação

**Problema Histórico:**

Antes de reconhecer padrão do-while, programadores duplicavam código de entrada:

```java
// Padrão antigo (duplicação)
System.out.print("Digite idade: ");
int idade = scanner.nextInt();  // Primeira vez FORA do loop

while (idade < 0 || idade > 150) {
    System.out.println("Idade inválida!");
    System.out.print("Digite idade: ");  // DUPLICADO
    idade = scanner.nextInt();  // DUPLICADO
}
```

**Solução Moderna (do-while):**

```java
int idade;

do {
    System.out.print("Digite idade: ");
    idade = scanner.nextInt();

    if (idade < 0 || idade > 150) {
        System.out.println("Idade inválida!");
    }
} while (idade < 0 || idade > 150);
```

**Motivação:**

1. **Eliminar Duplicação:** Código entrada aparece uma vez
2. **User Experience:** Feedback imediato + retry ilimitado
3. **Robustez:** Garante valor válido antes de prosseguir
4. **Clareza:** Padrão idiomático reconhecível

### Problema Fundamental que Resolve

**Problema: Garantir Entrada Válida**

Aplicações interativas **devem** garantir que dados do usuário atendam requisitos antes de processar:

- **Range:** Valor entre min-max
- **Formato:** Padrão específico (email, CPF, telefone)
- **Tipo:** Número quando esperado, não texto
- **Lógica:** Senha correta, opção válida

**Sem Validação (Perigoso):**

```java
System.out.print("Digite sua idade: ");
int idade = scanner.nextInt();
// E se usuário digitou -5? Ou 999?

calcularSeguroVida(idade);  // Lógica quebra com valor inválido
```

**Com Validação (Robusto):**

```java
int idade;

do {
    System.out.print("Digite sua idade (0-150): ");
    idade = scanner.nextInt();

    if (idade < 0 || idade > 150) {
        System.out.println("❌ Idade deve estar entre 0 e 150!");
    }
} while (idade < 0 || idade > 150);

calcularSeguroVida(idade);  // Garante valor válido
```

### Importância no Ecossistema

Validação de entrada é **crítica** em:

- **Aplicações Interativas:** CLI, jogos, sistemas de menu
- **Segurança:** Prevenir SQL injection, XSS (validar antes de usar)
- **Integridade de Dados:** Garantir consistência de banco de dados
- **User Experience:** Feedback claro e imediato

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Input-Validate-Retry:** Pedir → Validar → Se inválido, pedir novamente
2. **Feedback Imediato:** Informar erro assim que detectado
3. **Retry Ilimitado:** Loop continua até válido (ou timeout/limite)
4. **Eliminação de Duplicação:** Código entrada em um lugar
5. **Garantia de Validade:** Após loop, valor **sempre** válido

### Pilares Fundamentais

- **Request-Validate Pattern:** Padrão clássico de UI interativa
- **User Feedback:** Comunicar o que está errado
- **At-Least-Once:** Sempre pede minimamente
- **Validation Logic:** Condições claras de validade
- **Exit Guarantee:** Loop termina quando válido

---

## 🧠 Fundamentos Teóricos

### Estrutura Canônica de Validação

**Anatomia Completa:**

```java
Scanner scanner = new Scanner(System.in);
TipoValor entrada;
boolean valido;

do {
    // PASSO 1: Solicitar entrada
    System.out.print("Mensagem de prompt: ");
    entrada = scanner.nextTipo();

    // PASSO 2: Validar
    valido = validar(entrada);

    // PASSO 3: Feedback (se inválido)
    if (!valido) {
        System.out.println("Mensagem de erro clara");
    }
} while (!valido);

// PASSO 4: Usar valor válido
processar(entrada);
```

**Variante Comum (Validação na Condição):**

```java
int numero;

do {
    System.out.print("Digite número positivo: ");
    numero = scanner.nextInt();

    if (numero <= 0) {
        System.out.println("❌ Número deve ser positivo!");
    }
} while (numero <= 0);  // Validação direta na condição
```

### Tipos de Validação

**1. Range (Intervalo):**

```java
int idade;

do {
    System.out.print("Idade (18-100): ");
    idade = scanner.nextInt();

    if (idade < 18) {
        System.out.println("❌ Deve ter pelo menos 18 anos!");
    } else if (idade > 100) {
        System.out.println("❌ Idade máxima é 100!");
    }
} while (idade < 18 || idade > 100);
```

**2. Formato (Pattern):**

```java
String email;
Pattern pattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

do {
    System.out.print("Digite seu email: ");
    email = scanner.nextLine();

    if (!pattern.matcher(email).matches()) {
        System.out.println("❌ Email inválido! Use formato: nome@dominio.com");
    }
} while (!pattern.matcher(email).matches());
```

**3. Lista de Opções Válidas:**

```java
String resposta;

do {
    System.out.print("Confirma operação? (s/n): ");
    resposta = scanner.nextLine().toLowerCase();

    if (!resposta.equals("s") && !resposta.equals("n")) {
        System.out.println("❌ Digite apenas 's' ou 'n'!");
    }
} while (!resposta.equals("s") && !resposta.equals("n"));

boolean confirmado = resposta.equals("s");
```

**4. Validação Lógica/Customizada:**

```java
String senha;

do {
    System.out.print("Crie uma senha (8+ caracteres, 1 número, 1 maiúscula): ");
    senha = scanner.nextLine();

    if (!senhaForte(senha)) {
        System.out.println("❌ Senha fraca! Deve ter:");
        System.out.println("   - Pelo menos 8 caracteres");
        System.out.println("   - Pelo menos 1 número");
        System.out.println("   - Pelo menos 1 letra maiúscula");
    }
} while (!senhaForte(senha));

// Método auxiliar
boolean senhaForte(String s) {
    return s.length() >= 8 &&
           s.matches(".*\\d.*") &&  // Contém dígito
           s.matches(".*[A-Z].*");  // Contém maiúscula
}
```

---

## 🔍 Análise Conceitual Profunda

### Padrão: Validação Múltipla (AND)

**Todas as condições devem ser verdadeiras:**

```java
int numero;

do {
    System.out.print("Digite número par entre 10 e 100: ");
    numero = scanner.nextInt();

    if (numero < 10 || numero > 100) {
        System.out.println("❌ Número fora do intervalo (10-100)!");
    } else if (numero % 2 != 0) {
        System.out.println("❌ Número deve ser par!");
    }
} while (numero < 10 || numero > 100 || numero % 2 != 0);

// Após loop: número está entre 10-100 E é par
```

### Padrão: Limitar Tentativas

**Evitar Loop Infinito (Usuário Desistindo):**

```java
Scanner scanner = new Scanner(System.in);
String senha;
final String SENHA_CORRETA = "admin123";
int tentativas = 0;
final int MAX_TENTATIVAS = 3;
boolean senhaCorreta;

do {
    tentativas++;
    System.out.print("Senha (tentativa " + tentativas + "/" + MAX_TENTATIVAS + "): ");
    senha = scanner.nextLine();

    senhaCorreta = senha.equals(SENHA_CORRETA);

    if (!senhaCorreta) {
        System.out.println("❌ Senha incorreta!");
    }
} while (!senhaCorreta && tentativas < MAX_TENTATIVAS);

if (senhaCorreta) {
    System.out.println("✅ Acesso concedido!");
} else {
    System.out.println("🔒 Conta bloqueada após " + MAX_TENTATIVAS + " tentativas.");
}
```

### Padrão: Tratamento de Exceção (Input Mismatch)

**Validação de Tipo (Scanner.nextInt() pode lançar exceção):**

```java
Scanner scanner = new Scanner(System.in);
int numero = 0;
boolean valido = false;

do {
    try {
        System.out.print("Digite um número inteiro: ");
        numero = scanner.nextInt();
        valido = true;  // Se chegou aqui, input é inteiro válido

        // Validação adicional de range
        if (numero < 0) {
            System.out.println("❌ Número deve ser positivo!");
            valido = false;
        }
    } catch (InputMismatchException e) {
        System.out.println("❌ Entrada inválida! Digite apenas números.");
        scanner.nextLine();  // Limpar buffer
        valido = false;
    }
} while (!valido);

System.out.println("✅ Número válido: " + numero);
```

### Padrão: Validação com Confirmação

**Dupla Entrada (Senhas, Emails Importantes):**

```java
Scanner scanner = new Scanner(System.in);
String senha;
String confirmacao;

do {
    System.out.print("Digite sua senha: ");
    senha = scanner.nextLine();

    System.out.print("Confirme sua senha: ");
    confirmacao = scanner.nextLine();

    if (!senha.equals(confirmacao)) {
        System.out.println("❌ Senhas não coincidem! Tente novamente.");
    } else if (senha.length() < 6) {
        System.out.println("❌ Senha muito curta! Mínimo 6 caracteres.");
    }
} while (!senha.equals(confirmacao) || senha.length() < 6);

System.out.println("✅ Senha cadastrada com sucesso!");
```

---

## 🎯 Aplicabilidade e Contextos

### 1. Cadastro de Usuário

```java
Scanner scanner = new Scanner(System.in);

// Nome
String nome;
do {
    System.out.print("Nome completo: ");
    nome = scanner.nextLine().trim();

    if (nome.length() < 3) {
        System.out.println("❌ Nome deve ter pelo menos 3 caracteres!");
    }
} while (nome.length() < 3);

// Idade
int idade;
do {
    System.out.print("Idade (18-100): ");
    idade = scanner.nextInt();

    if (idade < 18 || idade > 100) {
        System.out.println("❌ Idade deve estar entre 18 e 100!");
    }
} while (idade < 18 || idade > 100);

// Email
scanner.nextLine();  // Limpar buffer
String email;
do {
    System.out.print("Email: ");
    email = scanner.nextLine();

    if (!email.contains("@") || !email.contains(".")) {
        System.out.println("❌ Email inválido!");
    }
} while (!email.contains("@") || !email.contains("."));

System.out.println("\n✅ Cadastro realizado:");
System.out.println("Nome: " + nome);
System.out.println("Idade: " + idade);
System.out.println("Email: " + email);
```

### 2. Sistema de Notas

```java
Scanner scanner = new Scanner(System.in);
double nota;

do {
    System.out.print("Digite a nota (0.0 a 10.0): ");
    nota = scanner.nextDouble();

    if (nota < 0.0 || nota > 10.0) {
        System.out.println("❌ Nota deve estar entre 0.0 e 10.0!");
    }
} while (nota < 0.0 || nota > 10.0);

// Exibir conceito
String conceito;
if (nota >= 9.0) {
    conceito = "A";
} else if (nota >= 7.0) {
    conceito = "B";
} else if (nota >= 5.0) {
    conceito = "C";
} else {
    conceito = "D";
}

System.out.println("Nota: " + nota + " | Conceito: " + conceito);
```

### 3. Confirmação de Ação Crítica

```java
Scanner scanner = new Scanner(System.in);
String confirmacao;

System.out.println("⚠️  ATENÇÃO: Você está prestes a DELETAR todos os dados!");

do {
    System.out.print("Digite 'CONFIRMAR' para prosseguir ou 'CANCELAR' para abortar: ");
    confirmacao = scanner.nextLine().toUpperCase();

    if (!confirmacao.equals("CONFIRMAR") && !confirmacao.equals("CANCELAR")) {
        System.out.println("❌ Opção inválida! Digite 'CONFIRMAR' ou 'CANCELAR'.");
    }
} while (!confirmacao.equals("CONFIRMAR") && !confirmacao.equals("CANCELAR"));

if (confirmacao.equals("CONFIRMAR")) {
    System.out.println("🗑️  Deletando todos os dados...");
    deletarTudo();
    System.out.println("✅ Dados deletados.");
} else {
    System.out.println("❌ Operação cancelada.");
}
```

---

## ⚠️ Limitações e Considerações

### 1. Buffer de Scanner

**Problema:** `nextInt()` não consome newline:

```java
Scanner scanner = new Scanner(System.in);

System.out.print("Digite número: ");
int num = scanner.nextInt();  // Não consome \n

System.out.print("Digite nome: ");
String nome = scanner.nextLine();  // Lê \n vazio!
```

**Solução:** Limpar buffer:

```java
int num = scanner.nextInt();
scanner.nextLine();  // Consumir newline residual

String nome = scanner.nextLine();  // Agora funciona
```

### 2. Validação Pode Ser Complexa

Se validação é muito complexa, extrair para método:

```java
// Limpo
do {
    email = lerEmail();
} while (!emailValido(email));

// Método auxiliar
boolean emailValido(String email) {
    // Lógica complexa de validação
    return Pattern.matches("...", email);
}
```

### 3. Feedback Claro é Essencial

Usuário precisa saber **por que** input foi rejeitado:

```java
// Ruim (genérico)
System.out.println("Entrada inválida!");

// Bom (específico)
System.out.println("❌ Senha deve ter pelo menos 8 caracteres, 1 número e 1 letra maiúscula!");
```

---

## 🔗 Interconexões Conceituais

### Relação com Segurança

Validação de entrada é **primeira linha de defesa** contra ataques (SQL injection, XSS).

### Relação com UX

Feedback claro e imediato melhora experiência do usuário.

### Relação com Robustez

Garante que dados atendem pré-condições antes de processar.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Regex avançado:** Validações complexas com expressões regulares
2. **Tratamento de exceções:** Try-catch em loops de validação
3. **Validação de objetos:** Bean Validation (JSR 303)

---

## 📚 Conclusão

**Validação de entrada com `do-while`** é padrão idiomático essencial para aplicações interativas — **pede entrada** e **repete até válida**. Estrutura canônica: solicitar → validar → se inválido, feedback + retry. `do-while` é **perfeito** porque precisa pedir **antes** de validar (semântica at-least-once). **Elimina duplicação** de código (vs pedir fora + dentro de while). Tipos comuns: **range** (intervalo), **formato** (regex), **opções** (lista fechada), **lógica customizada** (senha forte). Pode **limitar tentativas** para evitar loop infinito se usuário desiste. Tratar **exceções** (InputMismatchException) para validar tipo + range. **Feedback claro** é essencial — informar **por que** input foi rejeitado. Cuidado com **buffer de Scanner** (`nextInt()` não consome newline — usar `scanner.nextLine()` após). Extrair validação complexa para **métodos auxiliares** para clareza. Padrão **crítico** em segurança (prevenir SQL injection), integridade de dados (garantir consistência), e UX (feedback imediato + retry). Após loop, valor é **garantidamente válido** — pode processar com segurança. Compreender validação de entrada com `do-while` é habilidade essencial para escrever aplicações interativas robustas e user-friendly.
