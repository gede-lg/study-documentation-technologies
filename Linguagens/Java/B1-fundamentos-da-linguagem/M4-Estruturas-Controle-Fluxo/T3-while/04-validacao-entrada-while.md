# Validação de Entrada com while

## 🎯 Introdução e Definição

### Definição Conceitual

**Validação de entrada com `while`** é o padrão de uso do loop `while` para **garantir** que o usuário forneça dados **válidos** antes de prosseguir com o processamento. O loop **repete a solicitação** até que uma entrada **aceitável** seja fornecida, implementando **robustez** e **tolerância a erros** na aplicação.

**Estrutura básica**:
```java
Scanner scanner = new Scanner(System.in);
int valor = -1;  // Valor inválido inicial

while (valor < 0 || valor > 100) {
    System.out.print("Digite um valor entre 0 e 100: ");
    valor = scanner.nextInt();
    
    if (valor < 0 || valor > 100) {
        System.out.println("❌ Valor inválido! Tente novamente.");
    }
}

System.out.println("✅ Valor válido: " + valor);
```

**Analogia**: É como um **segurança** na entrada de um evento - ele **continua pedindo** credenciais válidas até que você apresente uma entrada **autorizada**, não deixando você prosseguir com credenciais inválidas.

**Exemplo fundamental**:
```java
Scanner scanner = new Scanner(System.in);
String senha = "";

// Loop até senha correta
while (!senha.equals("1234")) {
    System.out.print("Digite a senha: ");
    senha = scanner.nextLine();
    
    if (!senha.equals("1234")) {
        System.out.println("Senha incorreta!");
    }
}

System.out.println("Acesso concedido!");
```

**Importância**:
- ✅ **Robustez**: Previne dados inválidos no sistema
- ✅ **UX**: Permite correção sem reiniciar programa
- ✅ **Segurança**: Valida antes de processar
- ✅ **Integridade**: Garante dados consistentes
- ✅ **Tolerância a erros**: Aceita múltiplas tentativas

---

## 📋 Sumário Conceitual

### Padrões de Validação

**1. Validação de Intervalo**: Número entre min e max
**2. Validação de Formato**: Email, telefone, CPF
**3. Validação de Tipo**: Garantir tipo correto (int, double)
**4. Validação de Lista**: Valor dentro de conjunto permitido
**5. Validação de Senha**: Credenciais corretas
**6. Validação de Confirmação**: Confirmação de ação (S/N)

**Sintaxe geral**:
```java
TipoEntrada entrada = valorInvalido;

while (!entradaValida(entrada)) {
    System.out.print("Solicitar entrada: ");
    entrada = lerEntrada();
    
    if (!entradaValida(entrada)) {
        System.out.println("Mensagem de erro");
    }
}
// entrada está válida aqui
```

---

## 🧠 Fundamentos Teóricos

### 1. Validação de Intervalo Numérico

**Padrão**: Valor entre mínimo e máximo.

```java
Scanner scanner = new Scanner(System.in);
int idade = -1;  // Inicializa com valor inválido

// Loop enquanto idade inválida
while (idade < 0 || idade > 150) {
    System.out.print("Digite sua idade (0-150): ");
    idade = scanner.nextInt();
    
    if (idade < 0 || idade > 150) {
        System.out.println("❌ Idade inválida! Deve estar entre 0 e 150.");
    }
}

System.out.println("✅ Idade válida: " + idade);
```

**Variação**: Apenas mínimo ou apenas máximo.
```java
// Apenas mínimo (valor positivo)
int quantidade = 0;
while (quantidade <= 0) {
    System.out.print("Digite quantidade (> 0): ");
    quantidade = scanner.nextInt();
}

// Apenas máximo
int desconto = 101;
while (desconto > 100) {
    System.out.print("Digite desconto (0-100%): ");
    desconto = scanner.nextInt();
}
```

### 2. Validação de Opções de Menu

**Padrão**: Valor dentro de conjunto de opções válidas.

```java
Scanner scanner = new Scanner(System.in);
int opcao = 0;

while (opcao < 1 || opcao > 4) {
    System.out.println("\n=== MENU ===");
    System.out.println("1 - Cadastrar");
    System.out.println("2 - Listar");
    System.out.println("3 - Editar");
    System.out.println("4 - Sair");
    System.out.print("Escolha uma opção: ");
    
    opcao = scanner.nextInt();
    
    if (opcao < 1 || opcao > 4) {
        System.out.println("❌ Opção inválida! Escolha entre 1 e 4.");
    }
}

System.out.println("✅ Opção selecionada: " + opcao);
```

### 3. Validação de Tipo com try-catch

**Problema**: `scanner.nextInt()` lança exceção se entrada não for int.

**Solução**: `try-catch` dentro do while.

```java
Scanner scanner = new Scanner(System.in);
int numero = 0;
boolean valido = false;

while (!valido) {
    System.out.print("Digite um número inteiro: ");
    
    try {
        numero = scanner.nextInt();
        valido = true;  // Sucesso: marca como válido
        
    } catch (InputMismatchException e) {
        System.out.println("❌ Entrada inválida! Digite apenas números.");
        scanner.nextLine();  // Limpa buffer (importante!)
    }
}

System.out.println("✅ Número válido: " + numero);
```

**⚠️ IMPORTANTE**: `scanner.nextLine()` no catch limpa buffer!

### 4. Validação de String (Formato)

**Padrão**: String atende critério (não vazio, regex, tamanho).

```java
Scanner scanner = new Scanner(System.in);
String nome = "";

// Loop enquanto nome vazio ou só espaços
while (nome.trim().isEmpty()) {
    System.out.print("Digite seu nome: ");
    nome = scanner.nextLine();
    
    if (nome.trim().isEmpty()) {
        System.out.println("❌ Nome não pode ser vazio!");
    }
}

System.out.println("✅ Nome válido: " + nome);
```

**Validação com tamanho mínimo**:
```java
String senha = "";

while (senha.length() < 6) {
    System.out.print("Digite senha (mín. 6 caracteres): ");
    senha = scanner.nextLine();
    
    if (senha.length() < 6) {
        System.out.println("❌ Senha muito curta! Mínimo 6 caracteres.");
    }
}
```

**Validação com regex (email)**:
```java
String email = "";
String regexEmail = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$";

while (!email.matches(regexEmail)) {
    System.out.print("Digite seu email: ");
    email = scanner.nextLine();
    
    if (!email.matches(regexEmail)) {
        System.out.println("❌ Email inválido! Formato: exemplo@dominio.com");
    }
}

System.out.println("✅ Email válido: " + email);
```

### 5. Validação de Confirmação (S/N)

**Padrão**: Aceitar apenas "S" ou "N" (case insensitive).

```java
Scanner scanner = new Scanner(System.in);
String confirmacao = "";

while (!confirmacao.equalsIgnoreCase("S") && 
       !confirmacao.equalsIgnoreCase("N")) {
    
    System.out.print("Deseja continuar? (S/N): ");
    confirmacao = scanner.nextLine().trim();
    
    if (!confirmacao.equalsIgnoreCase("S") && 
        !confirmacao.equalsIgnoreCase("N")) {
        System.out.println("❌ Resposta inválida! Digite S ou N.");
    }
}

if (confirmacao.equalsIgnoreCase("S")) {
    System.out.println("Continuando...");
} else {
    System.out.println("Operação cancelada.");
}
```

**Alternativa**: Comparar primeiro caractere.
```java
char resposta = ' ';

while (resposta != 'S' && resposta != 'N') {
    System.out.print("Confirma operação? (S/N): ");
    String entrada = scanner.nextLine().trim().toUpperCase();
    
    if (!entrada.isEmpty()) {
        resposta = entrada.charAt(0);
    }
    
    if (resposta != 'S' && resposta != 'N') {
        System.out.println("❌ Digite S para Sim ou N para Não.");
    }
}
```

### 6. Validação com Múltiplas Condições

**Padrão**: Valor deve atender TODAS as condições.

```java
Scanner scanner = new Scanner(System.in);
String usuario = "";

// Validações: não vazio, mín 4 chars, máx 20 chars, só letras/números
while (usuario.trim().isEmpty() || 
       usuario.length() < 4 || 
       usuario.length() > 20 || 
       !usuario.matches("^[a-zA-Z0-9]+$")) {
    
    System.out.print("Digite nome de usuário (4-20 chars, só letras/números): ");
    usuario = scanner.nextLine().trim();
    
    // Mensagens específicas por erro
    if (usuario.isEmpty()) {
        System.out.println("❌ Usuário não pode ser vazio!");
    } else if (usuario.length() < 4) {
        System.out.println("❌ Usuário muito curto! Mínimo 4 caracteres.");
    } else if (usuario.length() > 20) {
        System.out.println("❌ Usuário muito longo! Máximo 20 caracteres.");
    } else if (!usuario.matches("^[a-zA-Z0-9]+$")) {
        System.out.println("❌ Use apenas letras e números!");
    }
}

System.out.println("✅ Usuário válido: " + usuario);
```

### 7. Validação com Tentativas Limitadas

**Padrão**: Limitar número de tentativas (segurança).

```java
Scanner scanner = new Scanner(System.in);
String senhaCorreta = "1234";
String senha = "";
int tentativas = 0;
int maxTentativas = 3;

while (!senha.equals(senhaCorreta) && tentativas < maxTentativas) {
    System.out.print("Digite a senha: ");
    senha = scanner.nextLine();
    tentativas++;
    
    if (!senha.equals(senhaCorreta)) {
        int restantes = maxTentativas - tentativas;
        
        if (restantes > 0) {
            System.out.println("❌ Senha incorreta! " + restantes + " tentativa(s) restante(s).");
        } else {
            System.out.println("❌ Número máximo de tentativas excedido!");
            System.out.println("Acesso bloqueado.");
        }
    }
}

if (senha.equals(senhaCorreta)) {
    System.out.println("✅ Acesso concedido!");
}
```

### 8. Validação com Método Auxiliar

**Boa prática**: Extrair lógica de validação para método.

```java
public class ValidadorEntrada {
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int idade = -1;
        
        while (!idadeValida(idade)) {
            System.out.print("Digite sua idade (18-100): ");
            idade = scanner.nextInt();
            
            if (!idadeValida(idade)) {
                System.out.println("❌ Idade inválida! Deve estar entre 18 e 100.");
            }
        }
        
        System.out.println("✅ Idade válida: " + idade);
    }
    
    // Método de validação
    private static boolean idadeValida(int idade) {
        return idade >= 18 && idade <= 100;
    }
}
```

**Validação complexa com mensagem**:
```java
public class ValidadorSenha {
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String senha = "";
        
        while (!senhaValida(senha)) {
            System.out.print("Digite senha: ");
            senha = scanner.nextLine();
            
            String mensagemErro = obterMensagemErro(senha);
            if (mensagemErro != null) {
                System.out.println("❌ " + mensagemErro);
            }
        }
        
        System.out.println("✅ Senha válida!");
    }
    
    private static boolean senhaValida(String senha) {
        return senha.length() >= 8 &&
               senha.matches(".*[A-Z].*") &&  // Pelo menos 1 maiúscula
               senha.matches(".*[a-z].*") &&  // Pelo menos 1 minúscula
               senha.matches(".*\\d.*");       // Pelo menos 1 número
    }
    
    private static String obterMensagemErro(String senha) {
        if (senha.length() < 8) {
            return "Senha deve ter no mínimo 8 caracteres.";
        }
        if (!senha.matches(".*[A-Z].*")) {
            return "Senha deve conter pelo menos 1 letra maiúscula.";
        }
        if (!senha.matches(".*[a-z].*")) {
            return "Senha deve conter pelo menos 1 letra minúscula.";
        }
        if (!senha.matches(".*\\d.*")) {
            return "Senha deve conter pelo menos 1 número.";
        }
        return null;  // Sem erro
    }
}
```

### 9. Validação de Lista de Valores Permitidos

**Padrão**: Valor deve estar em conjunto predefinido.

```java
Scanner scanner = new Scanner(System.in);
String[] estadosValidos = {"SP", "RJ", "MG", "RS", "PR"};
String estado = "";
boolean valido = false;

while (!valido) {
    System.out.print("Digite a sigla do estado (SP, RJ, MG, RS, PR): ");
    estado = scanner.nextLine().toUpperCase().trim();
    
    // Verifica se estado está na lista
    for (String estadoValido : estadosValidos) {
        if (estado.equals(estadoValido)) {
            valido = true;
            break;
        }
    }
    
    if (!valido) {
        System.out.println("❌ Estado inválido! Use: SP, RJ, MG, RS ou PR.");
    }
}

System.out.println("✅ Estado válido: " + estado);
```

**Alternativa com List.contains()**:
```java
List<String> estadosValidos = Arrays.asList("SP", "RJ", "MG", "RS", "PR");
String estado = "";

while (!estadosValidos.contains(estado)) {
    System.out.print("Digite a sigla do estado: ");
    estado = scanner.nextLine().toUpperCase().trim();
    
    if (!estadosValidos.contains(estado)) {
        System.out.println("❌ Estado inválido!");
    }
}
```

### 10. Validação com Feedback Detalhado

**Padrão**: Mostrar QUAL validação falhou.

```java
Scanner scanner = new Scanner(System.in);
double preco = -1;

while (preco <= 0 || preco > 10000) {
    System.out.print("Digite o preço do produto (R$ 0.01 - R$ 10.000,00): ");
    
    try {
        preco = scanner.nextDouble();
        
        // Feedback específico
        if (preco <= 0) {
            System.out.println("❌ Preço deve ser maior que zero!");
        } else if (preco > 10000) {
            System.out.println("❌ Preço não pode exceder R$ 10.000,00!");
        }
        
    } catch (InputMismatchException e) {
        System.out.println("❌ Formato inválido! Digite um número (ex: 99.90)");
        scanner.nextLine();  // Limpa buffer
        preco = -1;  // Mantém inválido
    }
}

System.out.printf("✅ Preço válido: R$ %.2f%n", preco);
```

---

## 🔍 Análise Conceitual Profunda

### Por Que Validar com while?

**1. Loop natural**: Repetição até entrada válida é conceito do while.

**2. Controle do usuário**: Usuário tenta quantas vezes necessário.

**3. Sem reinício**: Não precisa reiniciar programa após erro.

**4. Robustez**: Aplicação tolera erros de entrada.

**5. UX**: Feedback imediato e oportunidade de correção.

### Padrões de Design

**Padrão 1: Inicializar Inválido**
```java
int valor = -1;  // Inválido: garante entrada no loop
while (valor < 0) {
    // solicitar valor
}
```

**Padrão 2: Flag Booleano**
```java
boolean valido = false;
while (!valido) {
    // tentar validar
    if (validacao_ok) {
        valido = true;
    }
}
```

**Padrão 3: Try-Catch**
```java
boolean valido = false;
while (!valido) {
    try {
        // tentar ler/validar
        valido = true;
    } catch (Exception e) {
        // mensagem de erro
    }
}
```

### Validação Client-Side vs Server-Side

**Client-side (Java desktop/console)**:
- Valida ANTES de enviar ao servidor
- Economiza banda/processamento
- Feedback imediato ao usuário
- **MAS**: Nunca confie APENAS em validação client-side

**Server-side (Backend)**:
- SEMPRE valide novamente no servidor
- Segurança: cliente pode ser manipulado
- Integridade: dados devem ser validados na origem

**Ambos**: Validação em camadas (defense in depth).

---

## 🎯 Aplicabilidade e Contextos

### 1. **Sistemas de Login**

```java
String usuario = "";
String senha = "";

// Validar usuário
while (usuario.trim().isEmpty()) {
    System.out.print("Usuário: ");
    usuario = scanner.nextLine();
}

// Validar senha
while (senha.length() < 6) {
    System.out.print("Senha (mín. 6 chars): ");
    senha = scanner.nextLine();
}

autenticar(usuario, senha);
```

### 2. **Cadastros e Formulários**

```java
// Validar CPF (11 dígitos)
String cpf = "";
while (!cpf.matches("\\d{11}")) {
    System.out.print("CPF (11 dígitos): ");
    cpf = scanner.nextLine().replaceAll("[^0-9]", "");
}

// Validar email
String email = "";
while (!email.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
    System.out.print("Email: ");
    email = scanner.nextLine();
}
```

### 3. **Menus Interativos**

```java
int opcao = 0;
while (opcao < 1 || opcao > 5) {
    exibirMenu();
    opcao = lerOpcao();
}
processarOpcao(opcao);
```

### 4. **Jogos (Adivinhação)**

```java
int palpite = -1;
while (palpite != numeroSecreto) {
    System.out.print("Palpite (1-100): ");
    palpite = scanner.nextInt();
    
    if (palpite < numeroSecreto) {
        System.out.println("Maior!");
    } else if (palpite > numeroSecreto) {
        System.out.println("Menor!");
    }
}
System.out.println("Acertou!");
```

### 5. **Calculadoras (Divisor Não-Zero)**

```java
double divisor = 0;
while (divisor == 0) {
    System.out.print("Digite o divisor (não pode ser 0): ");
    divisor = scanner.nextDouble();
    
    if (divisor == 0) {
        System.out.println("❌ Divisor não pode ser zero!");
    }
}

double resultado = dividendo / divisor;
```

### 6. **E-commerce (Quantidade de Produtos)**

```java
int quantidade = 0;
int estoque = 100;

while (quantidade <= 0 || quantidade > estoque) {
    System.out.printf("Quantidade (1-%d): ", estoque);
    quantidade = scanner.nextInt();
    
    if (quantidade <= 0) {
        System.out.println("❌ Quantidade deve ser maior que zero!");
    } else if (quantidade > estoque) {
        System.out.println("❌ Estoque insuficiente! Máximo: " + estoque);
    }
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Esquecer de Limpar Buffer (try-catch)**

```java
// ❌ BUG: buffer não limpo
while (!valido) {
    try {
        numero = scanner.nextInt();
        valido = true;
    } catch (InputMismatchException e) {
        System.out.println("Erro");
        // FALTA: scanner.nextLine()
    }
}
// Loop infinito se entrada inválida!

// ✅ Correto
while (!valido) {
    try {
        numero = scanner.nextInt();
        valido = true;
    } catch (InputMismatchException e) {
        System.out.println("Erro");
        scanner.nextLine();  // Limpa buffer!
    }
}
```

### 2. **Condição de Validação Invertida**

```java
// ❌ BUG: condição invertida
int idade = -1;
while (idade >= 18 && idade <= 100) {  // ERRADO!
    System.out.print("Digite idade: ");
    idade = scanner.nextInt();
}
// Loop enquanto VÁLIDO (oposto do desejado)

// ✅ Correto
while (idade < 18 || idade > 100) {  // Enquanto INVÁLIDO
    System.out.print("Digite idade: ");
    idade = scanner.nextInt();
}
```

### 3. **Não Inicializar com Valor Inválido**

```java
// ⚠️ Problema: inicialização válida
int opcao = 1;  // JÁ é válido!
while (opcao < 1 || opcao > 5) {  // Não entra no loop
    System.out.print("Opção: ");
    opcao = scanner.nextInt();
}
// Pula validação se usuário não digitar nada!

// ✅ Correto
int opcao = 0;  // Inválido: força entrada no loop
while (opcao < 1 || opcao > 5) {
    System.out.print("Opção: ");
    opcao = scanner.nextInt();
}
```

### 4. **Loop Infinito com Flag Mal Gerenciado**

```java
// ❌ BUG: flag nunca muda
boolean valido = false;
while (!valido) {
    System.out.print("Digite número par: ");
    int num = scanner.nextInt();
    
    if (num % 2 == 0) {
        System.out.println("Correto!");
        // FALTA: valido = true;
    }
}
// Loop infinito mesmo com entrada válida!

// ✅ Correto
boolean valido = false;
while (!valido) {
    System.out.print("Digite número par: ");
    int num = scanner.nextInt();
    
    if (num % 2 == 0) {
        System.out.println("Correto!");
        valido = true;  // Atualiza flag
    }
}
```

### 5. **Mensagem de Erro Fora do Loop**

```java
// ❌ Ruim: mensagem única fora do loop
System.out.println("Digite valor válido:");
while (valor < 0 || valor > 100) {
    valor = scanner.nextInt();
}
// Usuário não sabe se errou

// ✅ Melhor: feedback a cada tentativa
while (valor < 0 || valor > 100) {
    System.out.print("Digite valor (0-100): ");
    valor = scanner.nextInt();
    
    if (valor < 0 || valor > 100) {
        System.out.println("❌ Inválido! Tente novamente.");
    }
}
```

### 6. **Validação de String com equals() Sem trim()**

```java
// ⚠️ Problema: espaços não tratados
String resposta = "";
while (!resposta.equals("SIM")) {
    System.out.print("Digite SIM: ");
    resposta = scanner.nextLine();
}
// "SIM " (com espaço) não passa!

// ✅ Correto
while (!resposta.trim().equalsIgnoreCase("SIM")) {
    System.print("Digite SIM: ");
    resposta = scanner.nextLine();
}
```

---

## 🔗 Interconexões Conceituais

- **while**: Estrutura de loop fundamental
- **Scanner**: Leitura de entrada do usuário
- **try-catch**: Tratamento de exceções em validação de tipo
- **Regex**: Validação de formato (email, CPF, telefone)
- **Métodos auxiliares**: Extrair lógica de validação
- **do-while**: Alternativa quando garantir pelo menos 1 execução
- **InputMismatchException**: Exceção ao ler tipo incorreto
- **String.trim()**: Remover espaços em validação de String
- **equalsIgnoreCase()**: Comparação case-insensitive

---

## 🚀 Boas Práticas

### 1. ✅ Inicialize com Valor Inválido

```java
// ✅ Garante entrada no loop
int valor = -1;  // Inválido
while (valor < 0 || valor > 100) {
    // validar
}
```

### 2. ✅ Sempre Limpe Buffer em try-catch

```java
// ✅ scanner.nextLine() no catch
try {
    numero = scanner.nextInt();
    valido = true;
} catch (InputMismatchException e) {
    System.out.println("Erro");
    scanner.nextLine();  // Essencial!
}
```

### 3. ✅ Forneça Feedback Específico

```java
// ✅ Mensagens diferentes por erro
if (valor < 0) {
    System.out.println("❌ Valor não pode ser negativo!");
} else if (valor > 100) {
    System.out.println("❌ Valor não pode exceder 100!");
}
```

### 4. ✅ Use Métodos de Validação

```java
// ✅ Validação em método separado
while (!emailValido(email)) {
    System.out.print("Digite email: ");
    email = scanner.nextLine();
}

private static boolean emailValido(String email) {
    return email.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");
}
```

### 5. ✅ Trim e Case Insensitive em Strings

```java
// ✅ Aceita variações
while (!resposta.trim().equalsIgnoreCase("SIM")) {
    // aceita: "SIM", "sim", " SIM ", etc
}
```

### 6. ✅ Limite Tentativas (Segurança)

```java
// ✅ Máximo 3 tentativas
int tentativas = 0;
while (!senhaCorreta && tentativas < 3) {
    // validar
    tentativas++;
}
```

### 7. ✅ Use Constantes para Limites

```java
// ✅ Constantes para valores mágicos
private static final int IDADE_MINIMA = 18;
private static final int IDADE_MAXIMA = 100;

while (idade < IDADE_MINIMA || idade > IDADE_MAXIMA) {
    // validar
}
```

### 8. ✅ Validação em Camadas

```java
// ✅ Validações progressivas
while (senha.isEmpty() ||       // 1. Não vazio
       senha.length() < 8 ||    // 2. Tamanho mínimo
       !senhaSegura(senha)) {   // 3. Critérios complexos
    // solicitar senha
}
```

### 9. ✅ Documente Formato Esperado

```java
// ✅ Instrução clara
System.out.print("Digite CPF (somente números, 11 dígitos): ");
```

### 10. ✅ Teste Casos Limites

```java
@Test
void testValidacaoIdade() {
    assertEquals(true, idadeValida(18));   // Mínimo
    assertEquals(true, idadeValida(100));  // Máximo
    assertEquals(false, idadeValida(17));  // Abaixo
    assertEquals(false, idadeValida(101)); // Acima
}
```

---

## 📚 Resumo

**Validação de entrada com `while`** garante que o usuário forneça **dados válidos** antes de prosseguir, implementando **robustez** e **tolerância a erros**. O padrão básico é: **inicializar com valor inválido**, **loop enquanto entrada inválida**, **solicitar nova entrada**, **validar**, e **fornecer feedback**. Use **try-catch** para validação de tipo, sempre **limpando buffer** com `scanner.nextLine()` no catch. **Extraia validações complexas** para métodos auxiliares. Forneça **feedback específico** sobre qual validação falhou. Use `trim()` e `equalsIgnoreCase()` ao validar Strings. **Limite tentativas** em contextos de segurança (senhas). **Sempre valide no servidor** também (validação em camadas). Inicialize variáveis com **valores inválidos** para garantir entrada no loop. **Documente formato esperado** na mensagem ao usuário. Teste **casos limites** (mínimo, máximo, valores adjacentes). Validação de entrada com while é **fundamental** para criar aplicações robustas e com boa experiência de usuário.

