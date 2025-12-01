# Condicionais dentro de Loops

## 🎯 Introdução e Definição

### Definição Conceitual

**Condicionais dentro de loops** combinam **estruturas de decisão** (if, if-else, switch) **dentro do corpo** de estruturas de repetição (for, while, do-while, for-each). Essa composição permite **processar seletivamente** elementos, **filtrar dados**, **validar condições** a cada iteração, e **executar ações diferentes** conforme regras dinâmicas durante a repetição.

**Estrutura visual**:
```java
for (tipo elemento : colecao) {        // Repetição
    if (condicao) {                    // Decisão condicional
        // Ação A
    } else {
        // Ação B
    }
}
```

**Exemplo fundamental**:
```java
int[] numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

for (int num : numeros) {
    if (num % 2 == 0) {
        System.out.println(num + " é PAR");
    } else {
        System.out.println(num + " é ÍMPAR");
    }
}

// Saída:
// 1 é ÍMPAR
// 2 é PAR
// 3 é ÍMPAR
// 4 é PAR
// ...
```

---

## 📋 Sumário Conceitual

### Padrões de Uso

| Padrão | Estrutura | Finalidade |
|--------|-----------|------------|
| **Filtro simples** | `if (condicao) { processar() }` | Processar apenas elementos que atendem critério |
| **Ação dual** | `if-else` | Uma ação para true, outra para false |
| **Múltiplas condições** | `if-else if-else` | Classificar em categorias |
| **Switch em loop** | `switch (valor)` | Decisão multi-caminho a cada iteração |
| **Validação** | `if (!valido) continue;` | Pular elementos inválidos |
| **Saída antecipada** | `if (encontrado) break;` | Parar quando objetivo alcançado |

---

## 🧠 Fundamentos Teóricos

### 1. if Simples em Loop

**Processamento condicional**:
```java
int[] numeros = {10, 23, 45, 12, 67, 34, 89, 5};

// Exibir apenas números maiores que 30
for (int num : numeros) {
    if (num > 30) {
        System.out.println(num);
    }
}

// Saída: 45, 67, 34, 89
```

**Acumulação condicional**:
```java
int[] valores = {15, -8, 22, -3, 10, -12, 7};
int somaPositivos = 0;

for (int valor : valores) {
    if (valor > 0) {
        somaPositivos += valor;
    }
}

System.out.println("Soma dos positivos: " + somaPositivos);  // 54
```

**Modificação condicional de array**:
```java
int[] notas = {85, 92, 45, 78, 55, 90};

// Arredondar notas abaixo de 50 para 50
for (int i = 0; i < notas.length; i++) {
    if (notas[i] < 50) {
        notas[i] = 50;
    }
}

// Resultado: [85, 92, 50, 78, 55, 90]
```

### 2. if-else em Loop

**Classificação binária**:
```java
int[] idades = {25, 17, 32, 14, 45, 16, 28};
int maiores = 0, menores = 0;

for (int idade : idades) {
    if (idade >= 18) {
        maiores++;
    } else {
        menores++;
    }
}

System.out.println("Maiores: " + maiores + ", Menores: " + menores);
// Maiores: 4, Menores: 3
```

**Processamento dual**:
```java
int[] valores = {10, -5, 8, -12, 3, -7, 15};

for (int valor : valores) {
    if (valor >= 0) {
        System.out.println(valor + " → positivo, dobro: " + (valor * 2));
    } else {
        System.out.println(valor + " → negativo, absoluto: " + Math.abs(valor));
    }
}
```

**Contadores separados**:
```java
String[] respostas = {"sim", "não", "sim", "sim", "não", "sim"};
int contaSim = 0, contaNao = 0;

for (String resposta : respostas) {
    if (resposta.equals("sim")) {
        contaSim++;
    } else {
        contaNao++;
    }
}

System.out.println("Sim: " + contaSim + ", Não: " + contaNao);
```

### 3. if-else if-else (Múltiplas Condições)

**Classificação em categorias**:
```java
int[] notas = {85, 92, 45, 78, 55, 90, 35, 67};

for (int nota : notas) {
    if (nota >= 90) {
        System.out.println(nota + " - Excelente");
    } else if (nota >= 70) {
        System.out.println(nota + " - Bom");
    } else if (nota >= 50) {
        System.out.println(nota + " - Regular");
    } else {
        System.out.println(nota + " - Insuficiente");
    }
}
```

**Faixas de valores**:
```java
int[] salarios = {1500, 3500, 7000, 12000, 2800};

for (int salario : salarios) {
    double imposto;
    
    if (salario <= 2000) {
        imposto = 0;
    } else if (salario <= 5000) {
        imposto = salario * 0.10;
    } else if (salario <= 10000) {
        imposto = salario * 0.20;
    } else {
        imposto = salario * 0.30;
    }
    
    System.out.printf("Salário: R$%.2f, Imposto: R$%.2f%n", 
                      (double) salario, imposto);
}
```

**Contadores múltiplos**:
```java
int[] idades = {15, 25, 35, 45, 55, 65, 20, 40, 60};
int criancas = 0, jovens = 0, adultos = 0, idosos = 0;

for (int idade : idades) {
    if (idade < 18) {
        criancas++;
    } else if (idade < 30) {
        jovens++;
    } else if (idade < 60) {
        adultos++;
    } else {
        idosos++;
    }
}

System.out.println("Crianças: " + criancas);
System.out.println("Jovens: " + jovens);
System.out.println("Adultos: " + adultos);
System.out.println("Idosos: " + idosos);
```

### 4. switch dentro de Loop

**Decisão multi-caminho**:
```java
char[] comandos = {'A', 'D', 'R', 'L', 'A', 'L'};

for (char comando : comandos) {
    switch (comando) {
        case 'A':
            System.out.println("Adicionar item");
            break;
        case 'R':
            System.out.println("Remover item");
            break;
        case 'L':
            System.out.println("Listar itens");
            break;
        case 'D':
            System.out.println("Detalhar item");
            break;
        default:
            System.out.println("Comando inválido: " + comando);
    }
}
```

**Processamento por tipo**:
```java
String[] tipos = {"pdf", "jpg", "txt", "png", "doc", "exe"};

for (String tipo : tipos) {
    switch (tipo) {
        case "pdf":
        case "doc":
        case "txt":
            System.out.println(tipo + " → Documento");
            break;
        case "jpg":
        case "png":
        case "gif":
            System.out.println(tipo + " → Imagem");
            break;
        case "mp4":
        case "avi":
            System.out.println(tipo + " → Vídeo");
            break;
        default:
            System.out.println(tipo + " → Tipo desconhecido");
    }
}
```

**Contagem por categoria**:
```java
String[] transacoes = {"C", "D", "C", "C", "D", "T", "C"};
int creditos = 0, debitos = 0, transferencias = 0;

for (String tipo : transacoes) {
    switch (tipo) {
        case "C":
            creditos++;
            break;
        case "D":
            debitos++;
            break;
        case "T":
            transferencias++;
            break;
    }
}

System.out.println("Créditos: " + creditos);
System.out.println("Débitos: " + debitos);
System.out.println("Transferências: " + transferencias);
```

### 5. continue com if (Pular Elementos)

**Filtrar elementos indesejados**:
```java
int[] numeros = {10, 0, 25, 0, 15, 0, 30};

for (int num : numeros) {
    if (num == 0) {
        continue;  // Pula zeros
    }
    System.out.println("Processando: " + num);
}

// Saída: Processando: 10, 25, 15, 30
```

**Validação antecipada**:
```java
String[] emails = {"ana@email.com", "invalido", "bob@email.com", "", "carol@email.com"};

for (String email : emails) {
    if (email == null || email.isEmpty() || !email.contains("@")) {
        System.out.println("Email inválido, pulando...");
        continue;
    }
    
    System.out.println("Enviando para: " + email);
}
```

**Performance: Evitar processamento desnecessário**:
```java
int[] valores = {5, -10, 8, -3, 12, -7};

for (int valor : valores) {
    if (valor < 0) {
        continue;  // Não processa negativos
    }
    
    // Processamento pesado apenas para positivos
    double resultado = Math.sqrt(valor) * Math.log(valor + 1);
    System.out.printf("Valor: %d, Resultado: %.2f%n", valor, resultado);
}
```

### 6. break com if (Saída Antecipada)

**Busca com parada**:
```java
int[] numeros = {10, 23, 45, 67, 89, 12, 34};
int procurado = 67;
boolean encontrado = false;

for (int num : numeros) {
    if (num == procurado) {
        System.out.println("Encontrado: " + num);
        encontrado = true;
        break;  // Para imediatamente
    }
}

if (!encontrado) {
    System.out.println("Não encontrado");
}
```

**Validação com falha**:
```java
String[] senhas = {"abc123", "senha@456", "senha_segura#789"};
boolean todasValidas = true;

for (String senha : senhas) {
    if (senha.length() < 8) {
        System.out.println("Senha inválida (curta): " + senha);
        todasValidas = false;
        break;  // Para na primeira inválida
    }
}

if (todasValidas) {
    System.out.println("Todas as senhas são válidas");
}
```

**Limite de processamento**:
```java
int[] valores = {5, 12, 18, 23, 30, 45, 67};
int limite = 20;

for (int valor : valores) {
    if (valor > limite) {
        System.out.println("Limite excedido em: " + valor);
        break;
    }
    System.out.println("Processando: " + valor);
}

// Saída:
// Processando: 5
// Processando: 12
// Processando: 18
// Limite excedido em: 23
```

### 7. Condições Compostas

**if com && (AND)**:
```java
int[] numeros = {10, 15, 20, 25, 30, 35, 40};

for (int num : numeros) {
    if (num > 15 && num < 35) {
        System.out.println(num + " está entre 15 e 35");
    }
}

// Saída: 20, 25, 30
```

**if com || (OR)**:
```java
int[] valores = {5, 10, 15, 20, 25};

for (int valor : valores) {
    if (valor < 10 || valor > 20) {
        System.out.println(valor + " está fora do intervalo [10, 20]");
    }
}

// Saída: 5, 25
```

**if com ! (NOT)**:
```java
String[] palavras = {"java", "python", "c++", "javascript"};

for (String palavra : palavras) {
    if (!palavra.startsWith("java")) {
        System.out.println(palavra + " não começa com 'java'");
    }
}

// Saída: python, c++
```

### 8. if Aninhado em Loop

**Validação em múltiplos níveis**:
```java
int[] notas = {85, 45, 92, 55, 78, 35};

for (int nota : notas) {
    if (nota >= 50) {
        if (nota >= 90) {
            System.out.println(nota + " - Aprovado com distinção");
        } else if (nota >= 70) {
            System.out.println(nota + " - Aprovado");
        } else {
            System.out.println(nota + " - Aprovado, mas abaixo da média");
        }
    } else {
        System.out.println(nota + " - Reprovado");
    }
}
```

**Condições hierárquicas**:
```java
String[] usuarios = {"admin:ativo", "user:inativo", "moderador:ativo"};

for (String usuario : usuarios) {
    String[] partes = usuario.split(":");
    String tipo = partes[0];
    String status = partes[1];
    
    if (status.equals("ativo")) {
        if (tipo.equals("admin")) {
            System.out.println("Admin ativo - Acesso total");
        } else if (tipo.equals("moderador")) {
            System.out.println("Moderador ativo - Acesso moderado");
        } else {
            System.out.println("Usuário ativo - Acesso básico");
        }
    } else {
        System.out.println(tipo + " inativo - Sem acesso");
    }
}
```

### 9. Operador Ternário em Loop

**Atribuição condicional**:
```java
int[] numeros = {10, 23, 45, 12, 67};

for (int num : numeros) {
    String tipo = (num % 2 == 0) ? "PAR" : "ÍMPAR";
    System.out.println(num + " é " + tipo);
}
```

**Cálculo condicional**:
```java
int[] valores = {100, 200, 300, 400};

for (int valor : valores) {
    double desconto = (valor > 250) ? valor * 0.10 : 0;
    System.out.printf("Valor: %d, Desconto: %.2f%n", valor, desconto);
}
```

### 10. Padrões Avançados

**Múltiplos contadores condicionais**:
```java
int[] valores = {10, -5, 20, -3, 0, 15, -8};
int positivos = 0, negativos = 0, zeros = 0;

for (int valor : valores) {
    if (valor > 0) {
        positivos++;
    } else if (valor < 0) {
        negativos++;
    } else {
        zeros++;
    }
}

System.out.println("Positivos: " + positivos);
System.out.println("Negativos: " + negativos);
System.out.println("Zeros: " + zeros);
```

**Acumulação separada**:
```java
double[] vendas = {100.50, 250.75, 180.20, 320.00, 150.30};
double pequenas = 0, grandes = 0;

for (double venda : vendas) {
    if (venda < 200) {
        pequenas += venda;
    } else {
        grandes += venda;
    }
}

System.out.printf("Vendas pequenas: R$%.2f%n", pequenas);
System.out.printf("Vendas grandes: R$%.2f%n", grandes);
```

---

## 🎯 Aplicabilidade e Contextos

### Cenário 1: Validação de Dados

```java
String[] cpfs = {"123.456.789-00", "invalid", "987.654.321-00", ""};

for (String cpf : cpfs) {
    if (cpf == null || cpf.isEmpty()) {
        System.out.println("CPF vazio");
        continue;
    }
    
    if (cpf.matches("\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}")) {
        System.out.println("CPF válido: " + cpf);
    } else {
        System.out.println("CPF inválido: " + cpf);
    }
}
```

### Cenário 2: Processamento de Estoque

```java
int[] quantidades = {15, 3, 25, 0, 8, 1, 30};
String[] produtos = {"A", "B", "C", "D", "E", "F", "G"};

for (int i = 0; i < quantidades.length; i++) {
    if (quantidades[i] == 0) {
        System.out.println("Produto " + produtos[i] + " - ESGOTADO");
    } else if (quantidades[i] < 5) {
        System.out.println("Produto " + produtos[i] + " - ESTOQUE BAIXO (" + quantidades[i] + ")");
    } else {
        System.out.println("Produto " + produtos[i] + " - OK (" + quantidades[i] + ")");
    }
}
```

### Cenário 3: Cálculo de Média Ignorando Extremos

```java
int[] notas = {85, 92, 45, 95, 78, 88, 50};
int soma = 0;
int contador = 0;

for (int nota : notas) {
    if (nota < 50 || nota > 95) {
        continue;  // Ignora extremos
    }
    soma += nota;
    contador++;
}

double media = (contador > 0) ? (double) soma / contador : 0;
System.out.printf("Média (sem extremos): %.2f%n", media);
```

---

## ⚠️ Armadilhas Comuns

### 1. **if Vazio sem else**

```java
// ❌ Não faz nada quando false (confuso)
for (int num : numeros) {
    if (num > 10) {
        // ...
    }
    // E se num <= 10? Nada acontece
}

// ✅ Explicite o else se relevante
for (int num : numeros) {
    if (num > 10) {
        processar(num);
    } else {
        // Intencionalmente não processa
    }
}
```

### 2. **continue/break Mal Colocado**

```java
// ❌ Código após break nunca executa
for (int num : numeros) {
    if (num == 0) {
        break;
        System.out.println("Nunca executado");  // Unreachable
    }
}
```

### 3. **Múltiplos if Independentes (Deveria Ser if-else if)**

```java
// ❌ Testa TODAS as condições mesmo se primeira for true
for (int nota : notas) {
    if (nota >= 90) {
        System.out.println("Excelente");
    }
    if (nota >= 70) {  // Também executado se nota >= 90!
        System.out.println("Bom");
    }
}

// ✅ Use else if para exclusão mútua
for (int nota : notas) {
    if (nota >= 90) {
        System.out.println("Excelente");
    } else if (nota >= 70) {
        System.out.println("Bom");
    }
}
```

---

## 🚀 Boas Práticas

### 1. ✅ Use continue para Validação Antecipada

```java
// ✅ Reduz aninhamento
for (String email : emails) {
    if (!validar(email)) continue;
    
    enviar(email);
}
```

### 2. ✅ Use break para Busca Eficiente

```java
// ✅ Para quando encontra
for (int num : numeros) {
    if (num == procurado) {
        System.out.println("Encontrado");
        break;
    }
}
```

### 3. ✅ Prefira switch para Múltiplas Igualdades

```java
// ✅ Mais claro que vários if (tipo.equals(...))
for (String tipo : tipos) {
    switch (tipo) {
        case "pdf": // ...
        case "doc": // ...
    }
}
```

---

## 📚 Resumo

**Condicionais dentro de loops** combinam **decisão** (if/switch) com **repetição** (for/while), permitindo **processar seletivamente**. **if simples**: Processa apenas se condição verdadeira. **if-else**: Ação para true, outra para false. **if-else if**: Múltiplas categorias. **switch**: Multi-caminho (tipos, comandos). **continue + if**: **Pula** elementos inválidos. **break + if**: **Para** quando objetivo alcançado. **Padrões**: Filtros, classificação, validação, busca, acumulação condicional, contadores múltiplos. **Boas práticas**: Use continue para validação antecipada, break para busca eficiente, switch para múltiplas igualdades, evite if aninhados excessivos, use else if para exclusão mútua, explicite else quando relevante.
