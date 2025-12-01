# Uso em Atribuições Condicionais

## 🎯 Introdução e Definição

### Definição Conceitual

**Atribuições condicionais** são situações onde o valor atribuído a uma variável depende de uma condição. O **operador ternário** é especialmente projetado para este propósito, oferecendo uma sintaxe concisa para escolher entre dois valores baseado em uma condição booleana.

**Padrão fundamental**:
```java
tipo variavel = (condição) ? valor_se_true : valor_se_false;
```

Esta é uma das aplicações mais comuns e idiomáticas do operador ternário em Java, transformando o padrão verboso de `if-else` em uma **expressão única** que pode ser atribuída diretamente.

---

## 📋 Sumário Conceitual

### Comparação: if-else vs Operador Ternário

```java
// Padrão tradicional com if-else
String status;
if (pontos >= 100) {
    status = "Aprovado";
} else {
    status = "Reprovado";
}

// Padrão com operador ternário
String status = (pontos >= 100) ? "Aprovado" : "Reprovado";
```

**Vantagens do operador ternário em atribuições**:
- ✅ **Concisão**: Menos linhas de código
- ✅ **Imutabilidade**: Permite uso de `final`
- ✅ **Expressividade**: Intenção clara de atribuição condicional
- ✅ **Funcional**: Alinha com paradigma de programação funcional

---

## 🧠 Fundamentos Teóricos

### 1. Atribuição Simples Condicional

O caso mais básico: escolher entre dois valores literais.

**Sintaxe**:
```java
tipo variavel = (condição) ? valorA : valorB;
```

**Exemplos**:
```java
// Strings
String mensagem = (sucesso) ? "OK" : "Erro";
String genero = (isMasculino) ? "M" : "F";
String resposta = (aceito) ? "Sim" : "Não";

// Números
int sinal = (numero >= 0) ? 1 : -1;
double taxa = (isVIP) ? 0.05 : 0.10;
int bonus = (metaAtingida) ? 1000 : 0;

// Caracteres
char nota = (aprovado) ? 'A' : 'F';
char simbolo = (positivo) ? '+' : '-';

// Booleanos (geralmente redundante)
boolean resultado = (x > 0) ? true : false;  // ❌ Melhor: boolean resultado = (x > 0);
```

### 2. Atribuição com Expressões

Valores podem ser expressões complexas, não apenas literais.

**Com operações matemáticas**:
```java
int idade = 25;
int preco = (idade < 18) ? basePrice * 0.5 : basePrice;

int desconto = (isCliente) ? valorTotal * 0.1 : 0;

double final = (temCupom) ? preco - (preco * cupom.getDesconto()) : preco;
```

**Com chamadas de método**:
```java
String nome = (usuario != null) ? usuario.getNome() : getDefaultName();

int tamanho = (lista != null) ? lista.size() : 0;

Date data = (agendado) ? getDataAgendamento() : new Date();
```

**Com operações de string**:
```java
String saudacao = (isManha) ? "Bom dia, " + nome : "Boa tarde, " + nome;

String mensagem = (erro) ? "Erro: " + erro.getMessage() : "Sucesso";
```

### 3. Atribuição com Objetos

Atribuir diferentes objetos baseado em condição.

**Seleção de objeto**:
```java
Usuario usuario = (isAdmin) ? adminUser : normalUser;

Config config = (isDev) ? devConfig : prodConfig;

Logger logger = (verbose) ? new DetailedLogger() : new SimpleLogger();
```

**Criação condicional**:
```java
List<String> lista = (usarArrayList) 
    ? new ArrayList<>() 
    : new LinkedList<>();

Map<String, Integer> mapa = (pequeno) 
    ? new HashMap<>(16) 
    : new HashMap<>(1024);
```

**Null handling**:
```java
String valor = (obj != null) ? obj.getValor() : null;

Integer numero = (valido) ? Integer.valueOf(str) : null;

Usuario usuario = (encontrado) ? repository.find(id) : null;
```

### 4. Atribuição de Variáveis Final

Uma das maiores vantagens: permite variáveis `final` com valor condicional.

**Padrão sem ternário (não pode ser final)**:
```java
String ambiente;
if (System.getenv("ENV").equals("prod")) {
    ambiente = "PRODUCAO";
} else {
    ambiente = "DESENVOLVIMENTO";
}
// ambiente não pode ser final
```

**Com ternário (pode ser final)**:
```java
final String ambiente = (System.getenv("ENV").equals("prod")) 
    ? "PRODUCAO" 
    : "DESENVOLVIMENTO";
// ambiente é final - imutável após inicialização
```

**Mais exemplos**:
```java
public class Config {
    private final int maxConnections = (isProducao) ? 100 : 10;
    
    private final String dbUrl = (isProducao) 
        ? "jdbc:mysql://prod.db.com" 
        : "jdbc:mysql://localhost";
    
    private final Logger logger = (debug) 
        ? LoggerFactory.getLogger("debug") 
        : LoggerFactory.getLogger("standard");
}
```

### 5. Atribuição em Declaração vs Posterior

**Atribuição na declaração**:
```java
// Declaração e atribuição em uma linha
String status = (conectado) ? "Online" : "Offline";
int idade = (nascimento != null) ? calcularIdade(nascimento) : 0;
```

**Atribuição posterior**:
```java
String resultado;

// ... código intermediário ...

resultado = (condicao) ? "A" : "B";  // Atribuição posterior
```

**Quando cada padrão é apropriado**:
- **Declaração**: Quando a variável pode ser inicializada imediatamente
- **Posterior**: Quando a condição só é conhecida mais tarde no código

### 6. Atribuição com Conversão de Tipo

Java realiza conversões automáticas quando necessário.

**Widening (promoção)**:
```java
// int → double
double valor = (positivo) ? 10 : 3.14;  // 10 promovido para 10.0

// byte → int
byte b = 5;
int resultado = (condicao) ? b : 100;  // byte promovido para int
```

**Boxing e Unboxing**:
```java
// Boxing: int → Integer
Integer numero = (valido) ? 42 : null;

// Unboxing: Integer → int
Integer x = 100;
int valor = (usar) ? x : 0;  // x unboxed para int
```

**Tipo comum**:
```java
// String e String → String
Object obj = (condicao) ? "Texto" : "Outro";  // Tipo: String

// Integer e Double → Number
Number num = (condicao) ? 42 : 3.14;  // Tipo: Number
```

### 7. Atribuição Múltipla (Pattern Decomposition)

Embora não seja direto, pode simular atribuição múltipla.

**Usando classe wrapper**:
```java
record Resultado(int valor, String mensagem) {}

Resultado resultado = (sucesso) 
    ? new Resultado(100, "OK") 
    : new Resultado(0, "Erro");

int valor = resultado.valor();
String msg = resultado.mensagem();
```

**Usando array (desencorajado)**:
```java
// ❌ Não idiomático
Object[] resultado = (condicao) 
    ? new Object[]{10, "A"} 
    : new Object[]{20, "B"};
```

### 8. Atribuição com Validação

Combinar verificação de null/validade com atribuição.

**Null safety**:
```java
String nome = (usuario != null) ? usuario.getNome() : "Anônimo";

int tamanho = (array != null) ? array.length : 0;

Date data = (str != null && !str.isEmpty()) 
    ? parseDate(str) 
    : new Date();
```

**Validação de intervalo**:
```java
int idade = (idadeInput >= 0 && idadeInput <= 150) 
    ? idadeInput 
    : 0;

int percentual = (valor >= 0 && valor <= 100) 
    ? valor 
    : 50;  // Valor padrão
```

**Validação de string**:
```java
String texto = (input != null && !input.trim().isEmpty()) 
    ? input.trim() 
    : "Padrão";

String email = (isValidEmail(input)) 
    ? input.toLowerCase() 
    : null;
```

### 9. Atribuição em Contextos Especiais

**Em construtores**:
```java
public class Usuario {
    private final String nome;
    private final int idade;
    
    public Usuario(String nomeInput, int idadeInput) {
        this.nome = (nomeInput != null) ? nomeInput : "Desconhecido";
        this.idade = (idadeInput > 0) ? idadeInput : 18;
    }
}
```

**Em inicializadores de instância**:
```java
public class Config {
    private final String ambiente;
    
    {
        // Bloco inicializador
        ambiente = (System.getProperty("env") != null) 
            ? System.getProperty("env") 
            : "dev";
    }
}
```

**Em variáveis de classe**:
```java
public class App {
    private static final boolean DEBUG = 
        (System.getenv("DEBUG") != null) 
        ? Boolean.parseBoolean(System.getenv("DEBUG")) 
        : false;
    
    private static final int MAX_THREADS = (DEBUG) ? 1 : 10;
}
```

### 10. Atribuição Encadeada

Atribuir o mesmo valor condicional a múltiplas variáveis.

**Pattern**:
```java
String status1, status2;
status1 = status2 = (conectado) ? "Online" : "Offline";
```

**Com tipos diferentes (cuidado)**:
```java
Object obj;
String str;

// ❌ Tipo pode não ser compatível
// str = obj = (condicao) ? "Texto" : new Object();  // Erro se false

// ✅ Garantir tipo compatível
str = (String) (obj = (condicao) ? "Texto" : "Outro");
```

---

## 🔍 Análise Conceitual Profunda

### Por Que Usar Ternário em Atribuições?

**1. Imutabilidade e Final**

O maior benefício: permite variáveis `final`:

```java
// Sem ternário: não pode ser final
String modo;
if (isDev) {
    modo = "Desenvolvimento";
} else {
    modo = "Produção";
}
// modo pode ser reatribuído acidentalmente

// Com ternário: pode ser final
final String modo = (isDev) ? "Desenvolvimento" : "Produção";
// modo é imutável - seguro contra modificações acidentais
```

**2. Expressividade**

Comunica claramente a intenção de **atribuição condicional**:

```java
// Intenção: atribuir valor baseado em condição
String mensagem = (erro) ? "Falha" : "Sucesso";
// Leitura: "mensagem recebe 'Falha' se erro, senão 'Sucesso'"
```

**3. Alinhamento Funcional**

Promove estilo de programação funcional:

```java
// Funcional: expressões retornam valores
final int resultado = (x > 0) ? calcular(x) : 0;

// Imperativo: declarações modificam estado
int resultado;
if (x > 0) {
    resultado = calcular(x);
} else {
    resultado = 0;
}
```

### Quando Preferir if-else?

**Use if-else quando**:

1. **Múltiplas ações** além de atribuição:
```java
if (erro) {
    status = "Erro";
    log.error("Falha na operação");
    notificar();
} else {
    status = "OK";
}
```

2. **Lógica complexa** dificulta leitura:
```java
// ❌ Complexo com ternário
String nivel = (pontos > 1000) ? "Ouro" : (pontos > 500) ? "Prata" : "Bronze";

// ✅ Mais claro com if-else
String nivel;
if (pontos > 1000) {
    nivel = "Ouro";
} else if (pontos > 500) {
    nivel = "Prata";
} else {
    nivel = "Bronze";
}
```

3. **Debugging** é importante:
```java
// Difícil colocar breakpoint específico
String s = (condicao) ? metodoA() : metodoB();

// Fácil debugar cada branch
String s;
if (condicao) {
    s = metodoA();  // Breakpoint aqui
} else {
    s = metodoB();  // Breakpoint aqui
}
```

---

## 🎯 Aplicabilidade e Contextos

### 1. **Valores Padrão e Fallback**

```java
// Padrão para null
String nome = (usuario != null) ? usuario.getNome() : "Anônimo";

// Padrão para vazio
String titulo = (!texto.isEmpty()) ? texto : "Sem título";

// Padrão para inválido
int porta = (portaConfig > 0 && portaConfig < 65536) ? portaConfig : 8080;
```

### 2. **Configuração Baseada em Ambiente**

```java
public class AppConfig {
    private final boolean isProducao = "prod".equals(System.getenv("ENV"));
    
    private final String dbUrl = (isProducao) 
        ? "jdbc:mysql://prod-server:3306/db" 
        : "jdbc:mysql://localhost:3306/dev_db";
    
    private final int poolSize = (isProducao) ? 50 : 5;
    
    private final boolean enableCache = (isProducao) ? true : false;
    
    private final LogLevel logLevel = (isProducao) 
        ? LogLevel.WARN 
        : LogLevel.DEBUG;
}
```

### 3. **Transformação de Dados**

```java
// Normalização
String nome = (input != null) ? input.trim().toLowerCase() : "";

// Conversão
int valor = (str != null && !str.isEmpty()) 
    ? Integer.parseInt(str) 
    : 0;

// Formatação
String display = (numero >= 1000) 
    ? String.format("%.1fk", numero / 1000.0) 
    : String.valueOf(numero);
```

### 4. **Seleção de Estratégia/Implementação**

```java
Comparator<String> comparador = (caseSensitive) 
    ? String::compareTo 
    : String::compareToIgnoreCase;

Serializer serializer = (formato.equals("JSON")) 
    ? new JsonSerializer() 
    : new XmlSerializer();

Cache cache = (distributed) 
    ? new RedisCache() 
    : new LocalCache();
```

### 5. **Cálculos Condicionais**

```java
// Desconto progressivo
double desconto = (valorTotal > 1000) 
    ? valorTotal * 0.15 
    : (valorTotal > 500) 
        ? valorTotal * 0.10 
        : 0;

// Taxa variável
double taxa = (isVIP) ? 0.02 : (isPremium) ? 0.05 : 0.08;

// Limite dinâmico
int maxTentativas = (isAdmin) ? Integer.MAX_VALUE : 3;
```

### 6. **Mensagens e Formatação**

```java
// Pluralização
String mensagem = "Você tem " + count + " item" 
    + ((count != 1) ? "s" : "");

// Status visual
String icone = (sucesso) ? "✓" : "✗";
String cor = (ativo) ? "verde" : "cinza";

// Saudação contextual
int hora = LocalTime.now().getHour();
String saudacao = (hora < 12) 
    ? "Bom dia" 
    : (hora < 18) 
        ? "Boa tarde" 
        : "Boa noite";
```

### 7. **Inicialização de Coleções**

```java
// Escolher implementação
List<String> lista = (needsThreadSafety) 
    ? new CopyOnWriteArrayList<>() 
    : new ArrayList<>();

// Capacidade inicial
Map<String, Integer> mapa = (isLarge) 
    ? new HashMap<>(10000) 
    : new HashMap<>();

// Coleção vazia ou preenchida
Set<String> conjunto = (hasDados) 
    ? new HashSet<>(dadosIniciais) 
    : Collections.emptySet();
```

---

## ⚠️ Limitações e Considerações

### 1. **Não Pode Ter Efeitos Colaterais Múltiplos**

```java
// ❌ Não é possível: múltiplas ações
// resultado = (condicao) ? (a++; b++) : (c++; d++);  // ERRO!

// ✅ Use if-else
if (condicao) {
    a++;
    b++;
    resultado = a;
} else {
    c++;
    d++;
    resultado = c;
}
```

### 2. **Tipos Devem Ser Compatíveis**

```java
// ❌ Tipos incompatíveis podem causar erro
// int x = (condicao) ? "String" : 42;  // ERRO!

// ✅ Tipo comum adequado
Object x = (condicao) ? "String" : 42;  // OK, mas não ideal
```

### 3. **NPE em Unboxing**

```java
Integer valor = null;

// ❌ NullPointerException se valor for null
// int r = (condicao) ? valor : 0;  // NPE ao unbox null!

// ✅ Verificar null
int r = (condicao && valor != null) ? valor : 0;
```

### 4. **Complexidade Oculta**

```java
// ❌ Chamadas de método custosas ocultas
String s = (condicao) 
    ? metodoMuitoCustosoA() 
    : metodoMuitoCustosoB();

// ✅ Mais óbvio o custo
String s;
if (condicao) {
    s = metodoMuitoCustosoA();  // Custo visível
} else {
    s = metodoMuitoCustosoB();
}
```

### 5. **Dificuldade em Refatoração**

Ternários complexos são difíceis de extrair para métodos:

```java
// Difícil refatorar
String r = (a && b) ? (c ? "X" : "Y") : (d ? "Z" : "W");

// Mais fácil refatorar
String r = calcularResultado(a, b, c, d);
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Conceitos

1. **Variáveis Final**: Ternário permite atribuição final condicional
2. **Null Safety**: Padrão comum para evitar null
3. **Optional**: Alternativa funcional moderna
4. **Factory Pattern**: Seleção de implementação
5. **Strategy Pattern**: Escolha de estratégia
6. **Immutability**: Promove objetos imutáveis

### Alternativas Modernas

**Optional.orElse()**:
```java
// Ternário
String nome = (obj != null) ? obj.getNome() : "Padrão";

// Optional
String nome = Optional.ofNullable(obj)
    .map(Usuario::getNome)
    .orElse("Padrão");
```

**Objects.requireNonNullElse() (Java 9+)**:
```java
// Ternário
String s = (input != null) ? input : "default";

// Objects helper
String s = Objects.requireNonNullElse(input, "default");
```

---

## 🚀 Boas Práticas

### 1. ✅ Prefira para Atribuições Simples

```java
// ✅ Excelente uso
String status = (conectado) ? "Online" : "Offline";
int max = (a > b) ? a : b;
```

### 2. ✅ Use `final` Sempre que Possível

```java
// ✅ Imutável
final String modo = (isDev) ? "DEV" : "PROD";
```

### 3. ✅ Quebre Linhas para Valores Longos

```java
// ✅ Legível
String mensagem = (usuario != null && usuario.isAtivo()) 
    ? "Bem-vindo, " + usuario.getNome() 
    : "Por favor, faça login";
```

### 4. ✅ Valide Null Antes de Usar

```java
// ✅ Seguro
String nome = (obj != null && obj.getNome() != null) 
    ? obj.getNome() 
    : "Desconhecido";
```

### 5. ✅ Evite Ternários Aninhados em Atribuições

```java
// ❌ Difícil de ler
String r = (a) ? (b ? "X" : "Y") : (c ? "Z" : "W");

// ✅ Use if-else ou método auxiliar
String r = determinarResultado(a, b, c);
```

### 6. ✅ Nomeie Variáveis Claramente

```java
// ✅ Nome descritivo
String mensagemSucesso = (salvou) ? "Dados salvos" : "Erro ao salvar";

// ❌ Nome genérico
String msg = (x) ? "A" : "B";
```

### 7. ✅ Considere Extrair para Método

```java
// Complexo
String nivel = (pontos > 1000 && vip) 
    ? "Ouro VIP" 
    : (pontos > 1000) 
        ? "Ouro" 
        : "Prata";

// ✅ Melhor
String nivel = determinarNivel(pontos, vip);
```

### 8. ✅ Use para Constantes Configuráveis

```java
public class Config {
    private static final int MAX_RETRY = (isDev()) ? 1 : 5;
    private static final Duration TIMEOUT = (isDev()) 
        ? Duration.ofSeconds(1) 
        : Duration.ofMinutes(5);
}
```

### 9. ✅ Documente Lógica Não Óbvia

```java
// Taxa reduzida para clientes antigos (mais de 2 anos)
double taxa = (cliente.getAnosCadastro() > 2) ? 0.03 : 0.05;
```

### 10. ✅ Teste Ambos os Branches

```java
@Test
void testAtribuicaoCondicional() {
    // Testa branch true
    String resultado1 = (true) ? "A" : "B";
    assertEquals("A", resultado1);
    
    // Testa branch false
    String resultado2 = (false) ? "A" : "B";
    assertEquals("B", resultado2);
}
```

---

## 📚 Resumo

O operador ternário é **ideal para atribuições condicionais** quando a escolha é **binária e simples**. Ele permite código mais **conciso**, suporta **imutabilidade** com `final`, e torna a **intenção clara**. No entanto, deve ser usado com **moderação** - prefira `if-else` para lógica complexa, múltiplas ações, ou quando debugging detalhado é importante. A regra de ouro: **se o ternário dificulta a leitura, use if-else**.

