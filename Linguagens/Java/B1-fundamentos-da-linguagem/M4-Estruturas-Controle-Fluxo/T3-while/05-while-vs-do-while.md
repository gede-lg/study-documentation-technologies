# while vs do-while

## 🎯 Introdução e Definição

### Definição Conceitual

**`while` vs `do-while`** são duas **variações** de loops em Java que diferem no **momento** em que a **condição** é verificada: `while` verifica **ANTES** de executar o bloco (loop com **pré-condição**), enquanto `do-while` verifica **DEPOIS** de executar o bloco (loop com **pós-condição**), garantindo **pelo menos uma execução**.

**Comparação visual**:
```java
// WHILE: verifica ANTES
while (condicao) {
    // Pode NÃO executar (se condição falsa)
}

// DO-WHILE: verifica DEPOIS
do {
    // SEMPRE executa pelo menos 1 vez
} while (condicao);
```

**Analogia**: 
- **while**: É como verificar se **tem combustível ANTES** de ligar o carro - se não tiver, o carro nem liga.
- **do-while**: É como ligar o carro **PRIMEIRO** e só **DEPOIS** verificar o combustível - o carro liga pelo menos uma vez, independente do combustível.

**Exemplo fundamental**:
```java
int x = 10;

// while: NÃO executa (condição falsa)
while (x < 5) {
    System.out.println("while: " + x);  // NUNCA executado
}

// do-while: EXECUTA 1 vez (condição falsa, mas executa antes de testar)
do {
    System.out.println("do-while: " + x);  // EXECUTADO 1 vez
} while (x < 5);

// Saída:
// do-while: 10
```

**Diferença-chave**: `do-while` garante **execução mínima de 1 vez**.

---

## 📋 Sumário Conceitual

### Comparação Direta

| Aspecto | while | do-while |
|---------|-------|----------|
| **Verificação** | ANTES do bloco | DEPOIS do bloco |
| **Execuções mínimas** | 0 (pode não executar) | 1 (sempre executa) |
| **Sintaxe** | `while (cond) { }` | `do { } while (cond);` |
| **Ponto-e-vírgula** | Não tem após `)` | Tem após `);` |
| **Caso de uso** | Condição pode ser falsa desde início | Necessário executar pelo menos 1 vez |

**Quando usar cada um**:
- **while**: Quando execução pode ser **pulada** se condição inicial for falsa
- **do-while**: Quando **pelo menos 1 execução** é necessária (menus, validação)

---

## 🧠 Fundamentos Teóricos

### 1. Sintaxe Comparada

**while**:
```java
// Estrutura while
while (condicao) {
    // bloco de código
    // executado 0 ou mais vezes
}
// SEM ponto-e-vírgula após )
```

**do-while**:
```java
// Estrutura do-while
do {
    // bloco de código
    // executado 1 ou mais vezes
} while (condicao);  // COM ponto-e-vírgula após )
```

**⚠️ IMPORTANTE**: `do-while` exige **ponto-e-vírgula** após `while (condicao)`.

### 2. Fluxo de Execução

**while (pré-condição)**:
```
1. Verifica condição
2. Se VERDADEIRA: executa bloco → volta para 1
3. Se FALSA: pula bloco e sai
```

**do-while (pós-condição)**:
```
1. Executa bloco (SEMPRE, primeira vez)
2. Verifica condição
3. Se VERDADEIRA: volta para 1
4. Se FALSA: sai
```

**Exemplo ilustrativo**:
```java
int contador = 5;

// while: NÃO executa (5 não é < 5)
System.out.println("=== while ===");
while (contador < 5) {
    System.out.println("Contador while: " + contador);
    contador++;
}
System.out.println("Final while: " + contador);

// Saída:
// === while ===
// Final while: 5

contador = 5;  // Reseta

// do-while: EXECUTA 1 vez (depois verifica)
System.out.println("=== do-while ===");
do {
    System.out.println("Contador do-while: " + contador);
    contador++;
} while (contador < 5);
System.out.println("Final do-while: " + contador);

// Saída:
// === do-while ===
// Contador do-while: 5
// Final do-while: 6
```

### 3. Caso de Uso: Menu Interativo

**Cenário ideal para do-while**: Menu deve ser exibido **pelo menos 1 vez**.

**Com do-while (recomendado)**:
```java
Scanner scanner = new Scanner(System.in);
int opcao;

do {
    System.out.println("\n=== MENU ===");
    System.out.println("1 - Cadastrar");
    System.out.println("2 - Listar");
    System.out.println("3 - Editar");
    System.out.println("0 - Sair");
    System.out.print("Opção: ");
    
    opcao = scanner.nextInt();
    
    switch (opcao) {
        case 1: cadastrar(); break;
        case 2: listar(); break;
        case 3: editar(); break;
        case 0: System.out.println("Saindo..."); break;
        default: System.out.println("Opção inválida!");
    }
    
} while (opcao != 0);  // Repete até usuário escolher 0
```

**Com while (gambiarra)**:
```java
Scanner scanner = new Scanner(System.in);
int opcao = -1;  // Valor inicial artificial para entrar no loop

while (opcao != 0) {
    System.out.println("\n=== MENU ===");
    // ... resto do código
}
// Funciona, mas inicialização de opcao é artificial
```

**Vantagem do-while**: Não precisa de **valor inicial artificial**.

### 4. Caso de Uso: Validação de Entrada

**Cenário**: Solicitar entrada até válida (pelo menos 1 solicitação).

**Com do-while (natural)**:
```java
Scanner scanner = new Scanner(System.in);
int idade;

do {
    System.out.print("Digite sua idade (0-150): ");
    idade = scanner.nextInt();
    
    if (idade < 0 || idade > 150) {
        System.out.println("❌ Idade inválida! Tente novamente.");
    }
    
} while (idade < 0 || idade > 150);

System.out.println("✅ Idade válida: " + idade);
```

**Com while (requer inicialização)**:
```java
Scanner scanner = new Scanner(System.in);
int idade = -1;  // Valor inválido inicial

while (idade < 0 || idade > 150) {
    System.out.print("Digite sua idade (0-150): ");
    idade = scanner.nextInt();
    
    if (idade < 0 || idade > 150) {
        System.out.println("❌ Idade inválida!");
    }
}
```

**Vantagem do-while**: Não precisa inicializar com valor inválido.

### 5. Caso de Uso: Processamento de Lote (Batch)

**Cenário**: Processar itens até acabar (pode não ter itens).

**Com while (adequado)**:
```java
List<Item> itens = obterItens();  // Pode retornar lista vazia
int indice = 0;

while (indice < itens.size()) {  // Se lista vazia, não executa
    Item item = itens.get(indice);
    processar(item);
    indice++;
}

System.out.println("Processados: " + indice + " itens");
```

**Com do-while (inadequado)**:
```java
List<Item> itens = obterItens();
int indice = 0;

do {
    if (indice < itens.size()) {  // Verificação DENTRO do loop (ruim)
        Item item = itens.get(indice);
        processar(item);
        indice++;
    }
} while (indice < itens.size());
// Se lista vazia, executa 1 vez desnecessariamente
```

**Vantagem while**: Evita execução desnecessária quando lista vazia.

### 6. Conversão entre while e do-while

**Qualquer do-while pode ser convertido em while**:
```java
// do-while original
do {
    statement;
} while (condicao);

// Equivalente em while (executar bloco antes do loop)
statement;  // Primeira execução fora do loop
while (condicao) {
    statement;  // Repetições subsequentes
}
```

**Exemplo**:
```java
// do-while
int x = 1;
do {
    System.out.println(x);
    x++;
} while (x <= 3);

// Equivalente em while
int x = 1;
System.out.println(x);  // Primeira execução
x++;
while (x <= 3) {
    System.out.println(x);
    x++;
}
```

**Mas do-while é mais conciso** quando necessário executar pelo menos 1 vez.

### 7. Erros Comuns: Esquecer Ponto-e-Vírgula

**❌ ERRO**: Esquecer `;` após `while (condicao)` no do-while.

```java
// ❌ ERRO: falta ponto-e-vírgula
do {
    System.out.println("Teste");
} while (condicao)  // ERRO: falta ;

// ✅ Correto
do {
    System.out.println("Teste");
} while (condicao);  // OK: com ;
```

**Erro de compilação**: `';' expected`.

### 8. Exemplo Completo: Jogo de Adivinhação

**Com do-while (ideal para jogos)**:
```java
import java.util.Random;
import java.util.Scanner;

public class JogoAdivinhacao {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        String jogarNovamente;
        
        do {
            int numeroSecreto = random.nextInt(100) + 1;
            int tentativas = 0;
            int palpite;
            
            System.out.println("\n=== JOGO DA ADIVINHAÇÃO ===");
            System.out.println("Adivinhe o número (1-100)");
            
            do {
                System.out.print("Palpite: ");
                palpite = scanner.nextInt();
                tentativas++;
                
                if (palpite < numeroSecreto) {
                    System.out.println("⬆️ Maior!");
                } else if (palpite > numeroSecreto) {
                    System.out.println("⬇️ Menor!");
                } else {
                    System.out.println("🎉 Acertou em " + tentativas + " tentativa(s)!");
                }
                
            } while (palpite != numeroSecreto);
            
            scanner.nextLine();  // Limpa buffer
            System.out.print("Jogar novamente? (S/N): ");
            jogarNovamente = scanner.nextLine();
            
        } while (jogarNovamente.equalsIgnoreCase("S"));
        
        System.out.println("Obrigado por jogar!");
    }
}
```

**Por que do-while?**:
1. Jogo deve executar **pelo menos 1 vez**
2. Pergunta "jogar novamente?" vem **DEPOIS** do jogo
3. Palpites devem ser solicitados **pelo menos 1 vez**

### 9. Exemplo Completo: Calculadora Interativa

**Com do-while (menu executado pelo menos 1 vez)**:
```java
import java.util.Scanner;

public class Calculadora {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;
        
        do {
            System.out.println("\n=== CALCULADORA ===");
            System.out.println("1 - Somar");
            System.out.println("2 - Subtrair");
            System.out.println("3 - Multiplicar");
            System.out.println("4 - Dividir");
            System.out.println("0 - Sair");
            System.out.print("Opção: ");
            
            opcao = scanner.nextInt();
            
            if (opcao >= 1 && opcao <= 4) {
                System.out.print("Primeiro número: ");
                double num1 = scanner.nextDouble();
                
                System.out.print("Segundo número: ");
                double num2 = scanner.nextDouble();
                
                double resultado = 0;
                
                switch (opcao) {
                    case 1:
                        resultado = num1 + num2;
                        System.out.printf("Resultado: %.2f + %.2f = %.2f%n", num1, num2, resultado);
                        break;
                    case 2:
                        resultado = num1 - num2;
                        System.out.printf("Resultado: %.2f - %.2f = %.2f%n", num1, num2, resultado);
                        break;
                    case 3:
                        resultado = num1 * num2;
                        System.out.printf("Resultado: %.2f × %.2f = %.2f%n", num1, num2, resultado);
                        break;
                    case 4:
                        if (num2 != 0) {
                            resultado = num1 / num2;
                            System.out.printf("Resultado: %.2f ÷ %.2f = %.2f%n", num1, num2, resultado);
                        } else {
                            System.out.println("❌ Erro: divisão por zero!");
                        }
                        break;
                }
            } else if (opcao != 0) {
                System.out.println("❌ Opção inválida!");
            }
            
        } while (opcao != 0);
        
        System.out.println("Calculadora encerrada.");
    }
}
```

### 10. Quando Usar Cada Estrutura

**Use while quando**:
- Condição pode ser **falsa** desde o início
- Execução pode ser **pulada** completamente
- Processamento de listas/arrays (pode estar vazio)
- Leitura de arquivos (pode não ter linhas)
- Loop com contador conhecido

**Use do-while quando**:
- **Pelo menos 1 execução** é necessária
- Menus interativos (devem aparecer pelo menos 1 vez)
- Validação de entrada (solicitar pelo menos 1 vez)
- Jogos (rodada inicial sempre acontece)
- Confirmações (perguntar pelo menos 1 vez)

**Exemplos de escolha**:
```java
// ✅ while: lista pode estar vazia
while (!lista.isEmpty()) {
    processar(lista.remove(0));
}

// ✅ do-while: menu deve aparecer pelo menos 1 vez
do {
    exibirMenu();
    opcao = lerOpcao();
} while (opcao != 0);

// ✅ while: arquivo pode estar vazio
while (scanner.hasNextLine()) {
    String linha = scanner.nextLine();
    processar(linha);
}

// ✅ do-while: solicitar entrada pelo menos 1 vez
do {
    System.out.print("Digite idade: ");
    idade = scanner.nextInt();
} while (idade < 0 || idade > 150);
```

---

## 🔍 Análise Conceitual Profunda

### Performance: while vs do-while

**Desempenho**: Praticamente **idêntico**.
- Compilador otimiza ambos da mesma forma
- Diferença apenas na **ordem** das verificações
- Não há ganho de performance em escolher um ou outro

**Escolha baseada em**: **Semântica** (significado/intenção), NÃO performance.

### Legibilidade e Manutenção

**do-while é mais legível** quando:
- Intenção é executar pelo menos 1 vez
- Evita inicialização artificial de variáveis
- Código expressa claramente: "faça... enquanto..."

**while é mais legível** quando:
- Condição pode ser falsa desde início
- Execução pode ser pulada
- Código expressa: "enquanto... faça..."

### Popularidade: while > do-while

**while é mais comum** porque:
1. Maioria dos casos pode pular execução inicial
2. Programadores mais familiarizados com while
3. Loops com contadores geralmente usam while ou for

**do-while é raro**, mas **ideal** para casos específicos (menus, validação).

---

## 🎯 Aplicabilidade e Contextos

### 1. **Menus e Sistemas Interativos**

**Ideal: do-while**
```java
do {
    exibirMenu();
    opcao = scanner.nextInt();
    processarOpcao(opcao);
} while (opcao != 0);
```

### 2. **Validação de Entrada**

**Ideal: do-while**
```java
do {
    System.out.print("Digite valor: ");
    valor = scanner.nextInt();
} while (valor < 0);
```

### 3. **Processamento de Coleções**

**Ideal: while**
```java
while (iterator.hasNext()) {
    processar(iterator.next());
}
```

### 4. **Leitura de Arquivos**

**Ideal: while**
```java
while (scanner.hasNextLine()) {
    String linha = scanner.nextLine();
    processar(linha);
}
```

### 5. **Jogos (Rodadas)**

**Ideal: do-while**
```java
do {
    jogarRodada();
    System.out.print("Continuar? (S/N): ");
    resposta = scanner.next();
} while (resposta.equalsIgnoreCase("S"));
```

### 6. **Confirmações**

**Ideal: do-while**
```java
do {
    System.out.print("Confirma exclusão? (S/N): ");
    confirmacao = scanner.next();
} while (!confirmacao.equalsIgnoreCase("S") && 
         !confirmacao.equalsIgnoreCase("N"));
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Esquecer Ponto-e-Vírgula no do-while**

```java
// ❌ ERRO: falta ;
do {
    statement;
} while (condicao)  // ERRO

// ✅ Correto
do {
    statement;
} while (condicao);
```

### 2. **Usar do-while Quando Pode Pular Execução**

```java
// ❌ Ruim: do-while com lista que pode estar vazia
List<Item> itens = obterItens();
int i = 0;

do {
    if (i < itens.size()) {  // Verifica dentro (ineficiente)
        processar(itens.get(i));
        i++;
    }
} while (i < itens.size());

// ✅ Melhor: while
while (i < itens.size()) {
    processar(itens.get(i));
    i++;
}
```

### 3. **Usar while com Inicialização Artificial**

```java
// ❌ Ruim: while com inicialização artificial
int opcao = -1;  // Valor artificial
while (opcao != 0) {
    exibirMenu();
    opcao = scanner.nextInt();
}

// ✅ Melhor: do-while (natural)
do {
    exibirMenu();
    opcao = scanner.nextInt();
} while (opcao != 0);
```

### 4. **Confundir Sintaxe while e do-while**

```java
// ❌ ERRO: while com ; após condição
while (condicao);  // Loop vazio infinito se condição true
{
    statement;  // Bloco separado, não faz parte do loop!
}

// ❌ ERRO: do-while sem ;
do {
    statement;
} while (condicao)  // ERRO de compilação
```

### 5. **Condição Complexa em do-while**

```java
// ⚠️ Difícil de ler: condição complexa no final
do {
    // 50 linhas de código
} while (a > 0 && b < 10 || c != 5 && d.isEmpty());
// Condição longe do início dificulta entendimento

// ✅ Melhor: extrair para variável/método
do {
    // código
    boolean deveContinuar = verificarContinuacao(a, b, c, d);
} while (deveContinuar);
```

---

## 🔗 Interconexões Conceituais

- **for**: Terceiro tipo de loop (com inicialização/incremento)
- **break**: Sai do loop (while ou do-while)
- **continue**: Pula para próxima iteração
- **Scanner**: Usado em validação/menus com do-while
- **Menu**: Caso de uso ideal para do-while
- **Validação**: Padrão comum com do-while
- **Condição**: Verificada ANTES (while) ou DEPOIS (do-while)

---

## 🚀 Boas Práticas

### 1. ✅ Use do-while para Menus

```java
// ✅ do-while natural para menus
do {
    exibirMenu();
    opcao = lerOpcao();
} while (opcao != 0);
```

### 2. ✅ Use do-while para Validação

```java
// ✅ Solicita pelo menos 1 vez
do {
    System.out.print("Digite senha: ");
    senha = scanner.nextLine();
} while (senha.length() < 6);
```

### 3. ✅ Use while Quando Pode Pular

```java
// ✅ while quando lista pode estar vazia
while (!lista.isEmpty()) {
    processar(lista.remove(0));
}
```

### 4. ✅ Não Esqueça ; no do-while

```java
// ✅ Sempre ; após while (condicao)
do {
    statement;
} while (condicao);  // ;
```

### 5. ✅ Evite Inicialização Artificial

```java
// ❌ Evite valores artificiais
int opcao = -999;  // Artificial
while (opcao != 0) { }

// ✅ Use do-while
do { } while (opcao != 0);
```

### 6. ✅ Documente Escolha do do-while

```java
// ✅ Comentário explica por que do-while
// Usando do-while porque menu deve aparecer pelo menos 1 vez
do {
    exibirMenu();
    opcao = lerOpcao();
} while (opcao != 0);
```

### 7. ✅ Extraia Condições Complexas

```java
// ✅ Método para condição complexa
do {
    processarDados();
} while (deveProcessarNovamente());

private boolean deveProcessarNovamente() {
    return temDados() && !erroEncontrado() && tentativas < MAX;
}
```

### 8. ✅ Use while para Iteradores

```java
// ✅ while com iterators/streams
Iterator<Item> it = lista.iterator();
while (it.hasNext()) {
    processar(it.next());
}
```

### 9. ✅ Prefira for para Loops com Contador

```java
// ❌ while para contador (verboso)
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}

// ✅ for para contador (conciso)
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

### 10. ✅ Teste Ambas as Estruturas

```java
@Test
void testWhileZeroIteracoes() {
    int contador = 0;
    while (false) {  // Nunca executa
        contador++;
    }
    assertEquals(0, contador);
}

@Test
void testDoWhileUmaIteracao() {
    int contador = 0;
    do {
        contador++;  // Executa 1 vez
    } while (false);
    assertEquals(1, contador);
}
```

---

## 📚 Resumo

**`while`** verifica condição **ANTES** de executar o bloco (pode executar **0 vezes**), enquanto **`do-while`** verifica **DEPOIS** (executa **pelo menos 1 vez**). Use **while** quando execução pode ser **pulada** (listas vazias, arquivos vazios, contadores). Use **do-while** quando **pelo menos 1 execução** é necessária (menus, validação de entrada, jogos, confirmações). **do-while** exige **ponto-e-vírgula** após `while (condicao);`, **while** não. Evite inicializar variáveis com **valores artificiais** para forçar entrada em while - prefira **do-while**. **Performance** é idêntica - escolha baseada em **semântica** (intenção/significado). **while é mais comum**, mas **do-while é ideal** para casos específicos. Extraia **condições complexas** para métodos auxiliares. **Documente** escolha do do-while quando não for óbvio. **for** é preferível para loops com contador conhecido.

