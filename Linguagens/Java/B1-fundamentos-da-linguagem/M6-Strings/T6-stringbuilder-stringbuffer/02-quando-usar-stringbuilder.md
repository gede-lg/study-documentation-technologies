# Quando Usar StringBuilder

## 🎯 Introdução e Definição

**StringBuilder** deve ser usado quando você precisa **modificar Strings repetidamente** ou **construir Strings de forma incremental**. É **essencial** para performance em loops e construções complexas, oferecendo **100x a 1000x melhor performance** que String em cenários de múltiplas concatenações.

**Conceito central**: String é **imutável** - cada concatenação cria um **novo objeto**. StringBuilder é **mutável** - modifica o **array interno** sem criar novos objetos. A escolha entre String e StringBuilder não é questão de preferência, mas de **necessidade de performance** e **natureza da operação**.

**Exemplo fundamental**:
```java
// ❌ NUNCA - String em loop (O(n²) - muito lento)
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado = resultado + i + ", ";  // 1000 alocações
}
// Tempo: ~50ms

// ✓ SEMPRE - StringBuilder em loop (O(n) - rápido)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(", ");  // Modifica array interno
}
String resultado = sb.toString();
// Tempo: ~100µs (500x mais rápido!)
```

**Características principais**:
- **Obrigatório em loops**: performance 100-1000x melhor que String
- **Construção incremental**: adicionar partes gradualmente
- **Modificações múltiplas**: append, insert, delete, replace
- **Capacidade configurável**: pode definir tamanho inicial para evitar realocações

## 📋 Fundamentos Teóricos

### 1️⃣ Cenário #1: Loops com Concatenação

**Por que String falha em loops**:

```java
// String em loop - O(n²) PÉSSIMO
String s = "";
for (int i = 0; i < 1000; i++) {
    s = s + i;
}

// O que acontece internamente:
// Iteração 0: cria String de tamanho 1 (copia 0 + adiciona 1)
// Iteração 1: cria String de tamanho 2 (copia 1 + adiciona 1)
// Iteração 2: cria String de tamanho 3 (copia 2 + adiciona 1)
// ...
// Iteração 999: cria String de tamanho 1000 (copia 999 + adiciona 1)

// Total de operações de cópia: 0+1+2+...+999 = 499.500
// Complexidade: O(n²) - QUADRÁTICA
// Memória: 1000 Strings criadas (999 viram garbage)
```

**StringBuilder resolve o problema**:
```java
// StringBuilder em loop - O(n) EXCELENTE
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}

// O que acontece internamente:
// - Array interno inicial: 16 caracteres
// - Append: adiciona ao array existente em O(1)
// - Se cheio, dobra tamanho (poucas vezes)
// Total de operações: 1000 appends + ~10 expansões
// Complexidade: O(n) - LINEAR
// Memória: 1 StringBuilder (poucas expansões de array)
```

**Benchmark comparativo**:
```java
// 100 iterações
// String: ~2ms
// StringBuilder: ~20µs (100x mais rápido)

// 1.000 iterações
// String: ~50ms
// StringBuilder: ~100µs (500x mais rápido)

// 10.000 iterações
// String: ~5000ms (5 segundos!)
// StringBuilder: ~5ms (1000x mais rápido)

// 100.000 iterações
// String: inviável (minutos)
// StringBuilder: ~50ms
```

### 2️⃣ Cenário #2: Construção Incremental Condicional

**Construir String com lógica**:

```java
// ❌ String - ineficiente
String sql = "SELECT * FROM usuarios WHERE ";
if (ativo != null) {
    sql = sql + "ativo = " + ativo + " AND ";
}
if (idade != null) {
    sql = sql + "idade > " + idade + " AND ";
}
if (cidade != null) {
    sql = sql + "cidade = '" + cidade + "' AND ";
}
sql = sql + "1=1";

// Cada += cria nova String
// Se todos filtros ativos: 4 Strings criadas

// ✓ StringBuilder - eficiente
StringBuilder sql = new StringBuilder("SELECT * FROM usuarios WHERE ");
if (ativo != null) {
    sql.append("ativo = ").append(ativo).append(" AND ");
}
if (idade != null) {
    sql.append("idade > ").append(idade).append(" AND ");
}
if (cidade != null) {
    sql.append("cidade = '").append(cidade).append("' AND ");
}
sql.append("1=1");

String query = sql.toString();
// 1 StringBuilder, 0 Strings temporárias
```

**Template HTML dinâmico**:
```java
// ✓ StringBuilder - ideal
StringBuilder html = new StringBuilder();
html.append("<html><body>");

html.append("<h1>").append(titulo).append("</h1>");

if (mostrarDescricao) {
    html.append("<p>").append(descricao).append("</p>");
}

html.append("<ul>");
for (String item : itens) {
    html.append("<li>").append(item).append("</li>");
}
html.append("</ul>");

if (mostrarRodape) {
    html.append("<footer>").append(rodape).append("</footer>");
}

html.append("</body></html>");

String documento = html.toString();
```

### 3️⃣ Cenário #3: Processar Coleções

**Juntar elementos de lista**:

```java
List<String> nomes = Arrays.asList("Ana", "João", "Maria", "Pedro");

// ❌ String em loop
String resultado = "";
for (String nome : nomes) {
    resultado += nome + ", ";
}
resultado = resultado.substring(0, resultado.length() - 2);  // Remove último ", "

// ✓ StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < nomes.size(); i++) {
    if (i > 0) sb.append(", ");
    sb.append(nomes.get(i));
}
String resultado = sb.toString();

// ✓ Ou String.join() (mais simples para este caso)
String resultado = String.join(", ", nomes);
```

**Processar linhas de arquivo**:
```java
BufferedReader reader = new BufferedReader(new FileReader("dados.txt"));
StringBuilder conteudo = new StringBuilder();

String linha;
while ((linha = reader.readLine()) != null) {
    conteudo.append(linha).append("\n");
}

String texto = conteudo.toString();
reader.close();

// StringBuilder essencial - número de linhas pode ser grande
// String seria O(n²) - muito lento
```

### 4️⃣ Cenário #4: Formatação Complexa

**Relatório formatado**:

```java
List<Produto> produtos = getProdutos();

StringBuilder relatorio = new StringBuilder();

// Cabeçalho
relatorio.append("=".repeat(60)).append("\n");
relatorio.append(String.format("%-30s %10s %15s\n", "Produto", "Qtd", "Preço"));
relatorio.append("=".repeat(60)).append("\n");

// Linhas de dados
double total = 0;
for (Produto p : produtos) {
    relatorio.append(String.format("%-30s %10d %15.2f\n",
                                   p.getNome(), p.getQtd(), p.getPreco()));
    total += p.getPreco() * p.getQtd();
}

// Rodapé
relatorio.append("=".repeat(60)).append("\n");
relatorio.append(String.format("Total: %44.2f\n", total));

String resultado = relatorio.toString();
System.out.println(resultado);
```

**Log estruturado**:
```java
StringBuilder log = new StringBuilder();
log.append("[").append(LocalDateTime.now()).append("] ");
log.append(nivel).append(" - ");
log.append(classe).append(".").append(metodo).append("(): ");
log.append(mensagem);

if (exception != null) {
    log.append("\n").append(exception.getClass().getSimpleName());
    log.append(": ").append(exception.getMessage());
}

String logEntry = log.toString();
```

### 5️⃣ Cenário #5: Manipulação de Strings

**Reverter String**:

```java
String original = "Hello World";

// ✓ StringBuilder tem reverse()
StringBuilder sb = new StringBuilder(original);
sb.reverse();
String reversa = sb.toString();  // "dlroW olleH"

// vs String - precisa loop manual
char[] chars = original.toCharArray();
for (int i = 0, j = chars.length - 1; i < j; i++, j--) {
    char temp = chars[i];
    chars[i] = chars[j];
    chars[j] = temp;
}
String reversa = new String(chars);
```

**Inserir no meio**:
```java
String texto = "Hello World";

// ✓ StringBuilder tem insert()
StringBuilder sb = new StringBuilder(texto);
sb.insert(6, "Beautiful ");
String resultado = sb.toString();  // "Hello Beautiful World"

// vs String - substring manual
String inicio = texto.substring(0, 6);
String fim = texto.substring(6);
String resultado = inicio + "Beautiful " + fim;
// Cria 3 Strings temporárias
```

**Deletar caracteres**:
```java
String texto = "Hello World";

// ✓ StringBuilder tem delete()
StringBuilder sb = new StringBuilder(texto);
sb.delete(5, 11);  // Remove " World"
String resultado = sb.toString();  // "Hello"

// vs String
String resultado = texto.substring(0, 5);
// Mais limitado, menos flexível
```

### 6️⃣ Quando NÃO Usar StringBuilder

**Poucas concatenações (2-5)**:

```java
String nome = "João";
int idade = 30;

// ✓ String + é melhor (mais simples)
String msg = "Nome: " + nome + ", Idade: " + idade;

// ⚠️ StringBuilder desnecessário
StringBuilder sb = new StringBuilder();
sb.append("Nome: ").append(nome).append(", Idade: ").append(idade);
String msg = sb.toString();

// + é mais legível e performance similar para poucas Strings
```

**Valores imutáveis**:
```java
// ✓ String - valor não muda
String nome = "João";
final String CONSTANTE = "valor";

// ❌ StringBuilder - desnecessário
StringBuilder nome = new StringBuilder("João");  // Confuso
```

**Thread-safety necessária**:
```java
// ❌ StringBuilder - não thread-safe
private StringBuilder buffer = new StringBuilder();

public void append(String s) {
    buffer.append(s);  // Múltiplas threads - race condition
}

// ✓ Alternativas:
// 1. StringBuffer (synchronized mas lento)
// 2. ThreadLocal<StringBuilder>
// 3. Sincronização manual
// 4. String imutável (thread-safe por natureza)
```

**Chave de Map/Set**:
```java
// ❌ StringBuilder - hashCode muda
Map<StringBuilder, Integer> map = new HashMap<>();
StringBuilder key = new StringBuilder("chave");
map.put(key, 100);
key.append("X");  // Modifica - hashCode muda
Integer valor = map.get(key);  // null (não encontra)

// ✓ String - hashCode estável
Map<String, Integer> map = new HashMap<>();
String key = "chave";
map.put(key, 100);
Integer valor = map.get(key);  // 100 (encontra)
```

### 7️⃣ Definir Capacidade Inicial

**Performance com capacidade adequada**:

```java
int n = 10000;

// ⚠️ Sem capacidade inicial - ~10ms
StringBuilder sb1 = new StringBuilder();  // Capacidade padrão 16
for (int i = 0; i < n; i++) {
    sb1.append(i);
}
// Array cresce ~13 vezes (16→34→70→142→286→574→1150→2302→4606→9214→18430→36862→73726)

// ✓ Com capacidade estimada - ~5ms (2x mais rápido)
StringBuilder sb2 = new StringBuilder(50000);  // Capacidade adequada
for (int i = 0; i < n; i++) {
    sb2.append(i);
}
// Array nunca precisa crescer
```

**Calcular capacidade**:
```java
// Conhece tamanho aproximado
int numItens = lista.size();
int tamanhoMedioPorItem = 20;
int capacidade = numItens * tamanhoMedioPorItem;
StringBuilder sb = new StringBuilder(capacidade);

// String grande esperada
StringBuilder sb = new StringBuilder(10000);

// Pequeno (padrão OK)
StringBuilder sb = new StringBuilder();  // 16 é suficiente
```

### 8️⃣ Padrões de Uso Comuns

**Padrão 1: Loop simples**:

```java
StringBuilder sb = new StringBuilder();
for (Item item : itens) {
    sb.append(item.getNome()).append(", ");
}
String resultado = sb.toString();
```

**Padrão 2: Loop com delimitador**:
```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < itens.size(); i++) {
    if (i > 0) sb.append(", ");
    sb.append(itens.get(i));
}
String resultado = sb.toString();
```

**Padrão 3: Construção condicional**:
```java
StringBuilder sb = new StringBuilder();
sb.append("Base");

if (condicao1) {
    sb.append(" parte1");
}
if (condicao2) {
    sb.append(" parte2");
}

String resultado = sb.toString();
```

**Padrão 4: Template com dados**:
```java
StringBuilder sb = new StringBuilder();
sb.append("<div>");
sb.append("<h1>").append(titulo).append("</h1>");
sb.append("<p>").append(conteudo).append("</p>");
sb.append("</div>");
String html = sb.toString();
```

**Padrão 5: Reutilizar StringBuilder**:
```java
StringBuilder sb = new StringBuilder(100);

for (Grupo grupo : grupos) {
    sb.setLength(0);  // Limpar
    
    for (Item item : grupo.getItens()) {
        sb.append(item).append(", ");
    }
    
    String resultado = sb.toString();
    processar(resultado);
}
// Evita criar novo StringBuilder a cada grupo
```

### 9️⃣ Decisão: String vs StringBuilder

**Árvore de decisão**:

```java
// 1. Operação em loop?
if (emLoop) {
    return "StringBuilder";  // SEMPRE
}

// 2. Múltiplas modificações (>5)?
if (modificacoes > 5) {
    return "StringBuilder";
}

// 3. Construção incremental condicional?
if (construcaoCondicional) {
    return "StringBuilder";
}

// 4. Valor final imutável?
if (valorFinal) {
    return "String";
}

// 5. Poucas concatenações (2-5)?
if (concatenacoes <= 5) {
    return "String com +";  // Mais simples
}

// 6. Thread-safety necessária?
if (threadSafety) {
    return "String ou StringBuffer";
}

// Padrão
return "String com +";
```

**Exemplos práticos**:
```java
// ✓ String: valor fixo
String nome = "João";

// ✓ String: poucas concatenações
String msg = "Hello " + nome + "!";

// ✓ StringBuilder: loop
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);

// ✓ StringBuilder: múltiplas modificações
StringBuilder html = new StringBuilder();
html.append("<div>");
html.append("<p>").append(texto).append("</p>");
html.append("</div>");

// ✓ String.join(): array com delimitador
String.join(", ", array);

// ✓ String.format(): formatação complexa
String.format("%.2f", valor);
```

### 🔟 Métricas de Performance

**Comparação por número de concatenações**:

| Concatenações | String + | StringBuilder | Diferença |
|---------------|----------|---------------|-----------|
| **2** | ~50ns | ~150ns | String 3x mais rápido |
| **5** | ~200ns | ~250ns | Similar |
| **10** | ~1µs | ~300ns | StringBuilder 3x mais rápido |
| **100** | ~2ms | ~20µs | StringBuilder 100x mais rápido |
| **1.000** | ~50ms | ~100µs | StringBuilder 500x mais rápido |
| **10.000** | ~5s | ~5ms | StringBuilder 1000x mais rápido |

**Ponto de virada**: ~5 concatenações
- Menos de 5: String + é OK (mais simples)
- 5 ou mais: StringBuilder recomendado
- Loop: StringBuilder OBRIGATÓRIO

**Uso de memória**:
```java
// String - 1000 concatenações
// Objetos criados: 1000
// Memória alocada: ~500KB
// Garbage: ~495KB (99%)

// StringBuilder - 1000 concatenações
// Objetos criados: 1
// Memória alocada: ~10KB
// Garbage: ~5KB (50%, apenas crescimento de array)

// StringBuilder usa 50x menos memória
```

## 🎯 Aplicabilidade

**1. Loops com Concatenação (OBRIGATÓRIO)**:
```java
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);
```

**2. Construção Incremental**:
```java
StringBuilder sql = new StringBuilder("SELECT...");
if (...) sql.append("WHERE...");
```

**3. Processar Coleções Grandes**:
```java
for (Item item : itens) sb.append(item);
```

**4. Manipulações (reverse, insert, delete)**:
```java
sb.reverse();
sb.insert(pos, texto);
sb.delete(start, end);
```

**5. Performance Crítica**:
```java
// Quando cada microssegundo importa
```

## ⚠️ Armadilhas Comuns

**1. Usar String em Loop**:
```java
for (...) {
    s = s + i;  // ❌ NUNCA
}
```

**2. StringBuilder para Poucas Strings**:
```java
// ⚠️ Desnecessário
new StringBuilder().append("A").append("B").toString();
// ✓ Mais simples
"A" + "B";
```

**3. Esquecer toString()**:
```java
StringBuilder sb = ...;
return sb;  // ❌ Retorna StringBuilder (mutável)
return sb.toString();  // ✓ Retorna String (imutável)
```

**4. Não Definir Capacidade em Loops Grandes**:
```java
new StringBuilder();  // ⚠️ Crescerá várias vezes
new StringBuilder(tamanhoEstimado);  // ✓
```

**5. Concatenar ao append()**:
```java
sb.append("Total: " + valor);  // ⚠️ Cria String temporária
sb.append("Total: ").append(valor);  // ✓
```

## ✅ Boas Práticas

**1. SEMPRE Use em Loops**:
```java
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);
```

**2. Defina Capacidade se Conhecer Tamanho**:
```java
new StringBuilder(capacidadeEstimada);
```

**3. Converta para String ao Finalizar**:
```java
String resultado = sb.toString();
```

**4. Reutilize com setLength(0)**:
```java
sb.setLength(0);  // Limpar para reutilizar
```

**5. Use String para Poucas Concatenações**:
```java
"A" + "B" + "C";  // OK para 2-5 Strings
```

## 📚 Resumo Executivo

**StringBuilder quando modificações múltiplas ou loop**.

**Obrigatório em loops**:
```java
// ❌ String
for (...) s = s + i;  // O(n²) - muito lento

// ✓ StringBuilder
StringBuilder sb = new StringBuilder();
for (...) sb.append(i);  // O(n) - rápido
```

**Performance**:
```java
// 1000 concatenações:
String +:       ~50ms    ❌
StringBuilder:  ~100µs   ✓ (500x mais rápido)
```

**Quando usar**:
```java
// ✓ Loop
for (...) sb.append(...);

// ✓ Múltiplas modificações (>5)
sb.append(...).append(...).append(...);

// ✓ Construção incremental
if (...) sb.append(...);

// ✓ Manipulações
sb.reverse();
sb.insert(pos, text);
sb.delete(start, end);
```

**Quando NÃO usar**:
```java
// Poucas concatenações (2-5)
"A" + "B" + "C";  // String + é OK

// Valor imutável
String nome = "João";

// Thread-safety
// Use String ou StringBuffer
```

**Capacidade inicial**:
```java
new StringBuilder(tamanhoEstimado);  // 2x mais rápido
```

**Padrão comum**:
```java
StringBuilder sb = new StringBuilder(capacidade);
for (Item item : itens) {
    sb.append(item.getNome()).append(", ");
}
String resultado = sb.toString();
```

**Recomendação**: Use **StringBuilder** em **TODOS os loops** com concatenação. Use **String +** para 2-5 concatenações simples. Defina capacidade inicial quando possível.