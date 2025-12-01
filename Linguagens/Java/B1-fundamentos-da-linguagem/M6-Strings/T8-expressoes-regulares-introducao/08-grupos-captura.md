# Grupos de Captura

## 🎯 Introdução e Definição

**Grupos de captura** são **parênteses ( )** em expressões regulares que **capturam** parte do texto encontrado para **reutilização**. Grupos permitem **extrair dados** específicos, criar **backreferences** (referências ao próprio grupo dentro do regex ou na substituição) e **agrupar elementos** para aplicar quantificadores. São numerados automaticamente a partir de 1, com grupo 0 representando o match completo.

**Conceito central**: Grupos transformam regex de simples validação em **ferramenta de extração e transformação**. Com **backreferences** você pode referenciar grupos capturados usando **\\1, \\2** (no regex) ou **$1, $2** (na substituição). **Grupos nomeados** (?<name>...) tornam o código mais legível. **Grupos não-capturantes** (?:...) agrupam sem consumir memória.

**Exemplo fundamental**:
```java
String telefone = "(11) 98765-4321";

// Grupos com parênteses
Pattern pattern = Pattern.compile("\\((\\d{2})\\) (\\d{5})-(\\d{4})");
Matcher matcher = pattern.matcher(telefone);

if (matcher.matches()) {
    System.out.println(matcher.group());   // "(11) 98765-4321" (tudo - grupo 0)
    System.out.println(matcher.group(1));  // "11" (DDD - grupo 1)
    System.out.println(matcher.group(2));  // "98765" (primeira parte - grupo 2)
    System.out.println(matcher.group(3));  // "4321" (segunda parte - grupo 3)
}
```

**Características principais**:
- **( )** cria grupo de captura
- **Numeração automática** (1, 2, 3...)
- **Grupo 0** = match completo
- **Backreferences**: \\1 (regex), $1 (substituição)
- **Grupos nomeados**: (?<name>...)
- **Não-capturantes**: (?:...)

## 📋 Fundamentos Teóricos

### 1️⃣ Grupos Numerados - ( )

**Parênteses criam grupos capturados automaticamente**:

```java
String texto = "João Silva";

// (\\w+) (\\w+) = dois grupos
Pattern pattern = Pattern.compile("(\\w+) (\\w+)");
Matcher matcher = pattern.matcher(texto);

if (matcher.matches()) {
    System.out.println("Grupo 0: " + matcher.group(0));  // "João Silva" (tudo)
    System.out.println("Grupo 1: " + matcher.group(1));  // "João"
    System.out.println("Grupo 2: " + matcher.group(2));  // "Silva"
}
```

**groupCount() - número de grupos**:
```java
Pattern pattern = Pattern.compile("(\\d{3})-(\\d{4})");
Matcher matcher = pattern.matcher("123-4567");

System.out.println("Total grupos: " + matcher.groupCount());  // 2

if (matcher.matches()) {
    for (int i = 0; i <= matcher.groupCount(); i++) {
        System.out.println("Grupo " + i + ": " + matcher.group(i));
    }
}
// Grupo 0: 123-4567
// Grupo 1: 123
// Grupo 2: 4567
```

**Grupos aninhados - numerados pela abertura (**:
```java
// Grupo 1: tudo
// Grupo 2: primeiro \\d{3}
// Grupo 3: segundo \\d{4}
Pattern pattern = Pattern.compile("((\\d{3})-(\\d{4}))");
Matcher matcher = pattern.matcher("123-4567");

if (matcher.matches()) {
    System.out.println("Grupo 1: " + matcher.group(1));  // "123-4567" (externo)
    System.out.println("Grupo 2: " + matcher.group(2));  // "123" (primeiro interno)
    System.out.println("Grupo 3: " + matcher.group(3));  // "4567" (segundo interno)
}
```

**Múltiplos grupos**:
```java
String email = "usuario@example.com";

// 3 grupos: usuário, domínio, extensão
Pattern pattern = Pattern.compile("([a-z]+)@([a-z]+)\\.([a-z]+)");
Matcher matcher = pattern.matcher(email);

if (matcher.matches()) {
    String usuario = matcher.group(1);   // "usuario"
    String dominio = matcher.group(2);   // "example"
    String extensao = matcher.group(3);  // "com"
    
    System.out.println("Usuário: " + usuario);
    System.out.println("Domínio: " + dominio);
    System.out.println("Extensão: " + extensao);
}
```

### 2️⃣ Backreferences no Regex - \\1, \\2

**\\1 referencia o grupo 1 dentro do próprio regex**:

```java
// (\\w+)\\s+\\1 = palavra repetida
Pattern pattern = Pattern.compile("(\\w+)\\s+\\1");

System.out.println(pattern.matcher("java java").matches());      // true
System.out.println(pattern.matcher("java python").matches());    // false
System.out.println(pattern.matcher("teste teste").matches());    // true

// (\\w+) captura primeira palavra
// \\s+ = espaços
// \\1 = MESMA palavra capturada no grupo 1
```

**Detectar palavras duplicadas**:
```java
String texto = "O o sistema sistema está funcionando";

Pattern pattern = Pattern.compile("\\b(\\w+)\\s+\\1\\b");
Matcher matcher = pattern.matcher(texto);

while (matcher.find()) {
    System.out.println("Duplicada: " + matcher.group(1));
}
// Duplicada: o
// Duplicada: sistema
```

**Backreference com múltiplos grupos**:
```java
// (\\d{2})/(\\d{2})/\\1 = MM/DD/MM (mês repete)
Pattern pattern = Pattern.compile("(\\d{2})/(\\d{2})/\\1");

System.out.println(pattern.matcher("12/25/12").matches());  // true (12 repete)
System.out.println(pattern.matcher("12/25/11").matches());  // false (12 ≠ 11)
```

**Validar tags HTML balanceadas**:
```java
// <(\\w+)>.*?</\\1> = <tag>conteúdo</tag>
Pattern pattern = Pattern.compile("<(\\w+)>.*?</\\1>");

System.out.println(pattern.matcher("<b>texto</b>").matches());    // true
System.out.println(pattern.matcher("<b>texto</i>").matches());    // false (b ≠ i)
System.out.println(pattern.matcher("<div>conteúdo</div>").matches());  // true
```

### 3️⃣ Backreferences na Substituição - $1, $2

**$1 referencia grupo 1 no replacement de replaceAll()**:

```java
String texto = "João Silva";

// Trocar ordem: (nome) (sobrenome) → (sobrenome), (nome)
Pattern pattern = Pattern.compile("(\\w+) (\\w+)");
Matcher matcher = pattern.matcher(texto);

String invertido = matcher.replaceAll("$2, $1");
System.out.println(invertido);  // "Silva, João"

// $2 = grupo 2 (sobrenome)
// $1 = grupo 1 (nome)
```

**Formatar data - DD/MM/YYYY para YYYY-MM-DD**:
```java
String data = "25/12/2024";

// (dia)/(mês)/(ano) → (ano)-(mês)-(dia)
String iso = data.replaceAll("(\\d{2})/(\\d{2})/(\\d{4})", "$3-$2-$1");
System.out.println(iso);  // "2024-12-25"
```

**Formatar telefone**:
```java
String telefone = "11987654321";

// (DDD)(5 dígitos)(4 dígitos) → (DDD) XXXXX-XXXX
String formatado = telefone.replaceAll("(\\d{2})(\\d{5})(\\d{4})", "($1) $2-$3");
System.out.println(formatado);  // "(11) 98765-4321"
```

**Mascarar CPF - manter primeiros dígitos**:
```java
String cpf = "123.456.789-00";

// Manter grupo 1, mascarar restante
String mascarado = cpf.replaceAll("(\\d{3})\\.(\\d{3})\\.(\\d{3})-(\\d{2})", "$1.***.***-**");
System.out.println(mascarado);  // "123.***.***-**"
```

**$0 - match completo**:
```java
String texto = "10 20 30";

// Adicionar colchetes ao redor de cada número
String resultado = texto.replaceAll("\\d+", "[$0]");
System.out.println(resultado);  // "[10] [20] [30]"

// $0 = grupo 0 (match completo)
```

### 4️⃣ Grupos Nomeados - (?<name>...)

**(?<name>...) cria grupo com nome**:

```java
String data = "2024-12-25";

// Grupos nomeados: (?<ano>\\d{4})-(?<mes>\\d{2})-(?<dia>\\d{2})
Pattern pattern = Pattern.compile("(?<ano>\\d{4})-(?<mes>\\d{2})-(?<dia>\\d{2})");
Matcher matcher = pattern.matcher(data);

if (matcher.matches()) {
    String ano = matcher.group("ano");    // "2024"
    String mes = matcher.group("mes");    // "12"
    String dia = matcher.group("dia");    // "25"
    
    System.out.println("Ano: " + ano);
    System.out.println("Mês: " + mes);
    System.out.println("Dia: " + dia);
}

// Também funciona com números
System.out.println("Grupo 1: " + matcher.group(1));  // "2024"
System.out.println("Grupo 2: " + matcher.group(2));  // "12"
System.out.println("Grupo 3: " + matcher.group(3));  // "25"
```

**Parsing de log estruturado**:
```java
String log = "[2024-01-15 10:30:45] INFO: Sistema iniciado";

Pattern pattern = Pattern.compile(
    "\\[(?<timestamp>.+?)\\]\\s+(?<nivel>\\w+):\\s+(?<mensagem>.+)"
);
Matcher matcher = pattern.matcher(log);

if (matcher.matches()) {
    String timestamp = matcher.group("timestamp");  // "2024-01-15 10:30:45"
    String nivel = matcher.group("nivel");          // "INFO"
    String mensagem = matcher.group("mensagem");    // "Sistema iniciado"
    
    System.out.println("Timestamp: " + timestamp);
    System.out.println("Nível: " + nivel);
    System.out.println("Mensagem: " + mensagem);
}
```

**Email com grupos nomeados**:
```java
String email = "usuario@example.com";

Pattern pattern = Pattern.compile(
    "(?<usuario>[a-z]+)@(?<dominio>[a-z]+)\\.(?<extensao>[a-z]+)"
);
Matcher matcher = pattern.matcher(email);

if (matcher.matches()) {
    System.out.println("Usuário: " + matcher.group("usuario"));    // "usuario"
    System.out.println("Domínio: " + matcher.group("dominio"));    // "example"
    System.out.println("Extensão: " + matcher.group("extensao"));  // "com"
}
```

**Backreference com nome - \\k<name>**:
```java
// Palavra repetida com grupo nomeado
Pattern pattern = Pattern.compile("(?<palavra>\\w+)\\s+\\k<palavra>");

System.out.println(pattern.matcher("java java").matches());    // true
System.out.println(pattern.matcher("java python").matches());  // false

// \\k<palavra> = backreference ao grupo "palavra"
```

### 5️⃣ Grupos Não-Capturantes - (?:...)

**(?:...) agrupa mas NÃO captura**:

```java
// Com captura (padrão)
Pattern p1 = Pattern.compile("(\\d+)-(\\d+)");
Matcher m1 = p1.matcher("123-456");

if (m1.matches()) {
    System.out.println("Total grupos: " + m1.groupCount());  // 2
    System.out.println("Grupo 1: " + m1.group(1));           // "123"
    System.out.println("Grupo 2: " + m1.group(2));           // "456"
}

// Sem captura (?:...)
Pattern p2 = Pattern.compile("(?:\\d+)-(\\d+)");
Matcher m2 = p2.matcher("123-456");

if (m2.matches()) {
    System.out.println("Total grupos: " + m2.groupCount());  // 1 (só o segundo)
    System.out.println("Grupo 1: " + m2.group(1));           // "456"
    // m2.group(0) ainda funciona = "123-456"
}
```

**Quando usar não-capturantes**:
```java
// Alternação sem capturar
Pattern pattern = Pattern.compile("(?:http|https)://.*");

System.out.println(pattern.matcher("http://example.com").matches());   // true
System.out.println(pattern.matcher("https://example.com").matches());  // true

Matcher matcher = pattern.matcher("https://example.com");
if (matcher.matches()) {
    System.out.println("Grupos: " + matcher.groupCount());  // 0 (não capturou http|https)
}
```

**Performance - grupos não-capturantes**:
```java
// Captura desnecessária
Pattern p1 = Pattern.compile("(\\d+)-(\\d+)-(\\d+)");

// Melhor - só capturar o que precisa
Pattern p2 = Pattern.compile("(?:\\d+)-(?:\\d+)-(\\d+)");

// Se só precisa do último grupo, não capturar os outros economiza memória
```

**Agrupamento para quantificador**:
```java
// (ab)+ = "ab" repetido (com captura)
Pattern p1 = Pattern.compile("(ab)+");
Matcher m1 = p1.matcher("ababab");
if (m1.matches()) {
    System.out.println(m1.group(1));  // "ab" (última captura)
}

// (?:ab)+ = "ab" repetido (sem captura)
Pattern p2 = Pattern.compile("(?:ab)+");
Matcher m2 = p2.matcher("ababab");
if (m2.matches()) {
    System.out.println(m2.groupCount());  // 0 (não capturou)
}
```

### 6️⃣ Grupos Atômicos - (?>...)

**(?>..) grupo atômico - sem backtracking**:

```java
// Grupo normal - COM backtracking
Pattern normal = Pattern.compile("(\\d+)5");
System.out.println(normal.matcher("12345").matches());  // true

// Grupo atômico - SEM backtracking
Pattern atomic = Pattern.compile("(?>\\d+)5");
System.out.println(atomic.matcher("12345").matches());  // false

// Explicação atômico:
// 1. (?>\\d+) pega "12345" (tudo)
// 2. Tenta "5" - falha (não sobrou nada)
// 3. NÃO retrocede - falha imediatamente
```

**Uso - performance em regex complexos**:
```java
// Evitar backtracking catastrófico
Pattern pattern = Pattern.compile("(?>\\d+)[a-z]");

// Sem grupo atômico poderia fazer backtracking desnecessário
// Com grupo atômico falha mais rápido se não houver letra após dígitos
```

### 7️⃣ Casos de Uso Práticos

**Extrair e validar data**:

```java
String texto = "Nascimento: 25/12/2024";

Pattern pattern = Pattern.compile("(\\d{2})/(\\d{2})/(\\d{4})");
Matcher matcher = pattern.matcher(texto);

if (matcher.find()) {
    int dia = Integer.parseInt(matcher.group(1));
    int mes = Integer.parseInt(matcher.group(2));
    int ano = Integer.parseInt(matcher.group(3));
    
    // Validar
    if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12) {
        System.out.println("Data válida: " + dia + "/" + mes + "/" + ano);
    }
}
```

**Parsing de URL**:
```java
String url = "https://example.com:8080/path/to/resource?key=value";

Pattern pattern = Pattern.compile(
    "(?<protocolo>https?)://(?<dominio>[^:/]+)(:(?<porta>\\d+))?(?<caminho>/[^?]*)?(\\?(?<query>.*))?"
);
Matcher matcher = pattern.matcher(url);

if (matcher.matches()) {
    System.out.println("Protocolo: " + matcher.group("protocolo"));  // "https"
    System.out.println("Domínio: " + matcher.group("dominio"));      // "example.com"
    System.out.println("Porta: " + matcher.group("porta"));          // "8080"
    System.out.println("Caminho: " + matcher.group("caminho"));      // "/path/to/resource"
    System.out.println("Query: " + matcher.group("query"));          // "key=value"
}
```

**Extrair citações com autor**:
```java
String texto = "Ele disse \"Olá mundo\" -- João Silva";

Pattern pattern = Pattern.compile("\"([^\"]+)\"\\s*--\\s*(.+)");
Matcher matcher = pattern.matcher(texto);

if (matcher.find()) {
    String citacao = matcher.group(1);  // "Olá mundo"
    String autor = matcher.group(2);    // "João Silva"
    
    System.out.println("Citação: " + citacao);
    System.out.println("Autor: " + autor);
}
```

**Parsing de código - imports**:
```java
String codigo = "import java.util.List;\nimport java.io.File;";

Pattern pattern = Pattern.compile("import ([a-z.]+)\\.([A-Z]\\w+);");
Matcher matcher = pattern.matcher(codigo);

while (matcher.find()) {
    String pacote = matcher.group(1);   // "java.util" ou "java.io"
    String classe = matcher.group(2);   // "List" ou "File"
    
    System.out.println("Pacote: " + pacote + ", Classe: " + classe);
}
// Pacote: java.util, Classe: List
// Pacote: java.io, Classe: File
```

**Mascarar dados sensíveis seletivamente**:
```java
String texto = "CPF: 123.456.789-00, Conta: 12345-6";

Pattern pattern = Pattern.compile("(\\d{3})\\.(\\d{3})\\.(\\d{3})-(\\d{2})");
Matcher matcher = pattern.matcher(texto);

StringBuffer sb = new StringBuffer();

while (matcher.find()) {
    // Manter primeiro grupo, mascarar resto
    String replacement = matcher.group(1) + ".***.***-**";
    matcher.appendReplacement(sb, replacement);
}

matcher.appendTail(sb);
System.out.println(sb);  // "CPF: 123.***.***-**, Conta: 12345-6"
```

### 8️⃣ Erros Comuns

**Esquecer escape de parênteses literais**:

```java
// ❌ Parênteses capturam
Pattern p = Pattern.compile("(11) 98765-4321");

// ✓ Escapar para literal
Pattern p = Pattern.compile("\\(11\\) 98765-4321");
```

**Confundir \\1 e $1**:
```java
// \\1 = no regex
Pattern.compile("(\\w+)\\s+\\1");  // backreference no regex

// $1 = na substituição
text.replaceAll("(\\w+) (\\w+)", "$2 $1");  // backreference na substituição
```

**Grupo inexistente**:
```java
Pattern pattern = Pattern.compile("(\\d+)");
Matcher matcher = pattern.matcher("123");

if (matcher.matches()) {
    // matcher.group(2);  // ❌ IndexOutOfBoundsException (só tem grupo 1)
    
    // ✓ Verificar groupCount() primeiro
    if (matcher.groupCount() >= 2) {
        String g2 = matcher.group(2);
    }
}
```

**Numeração de grupos aninhados**:
```java
// ((a)(b)) tem grupos 1=(ab), 2=(a), 3=(b)
// Numeração pela ordem de abertura (

Pattern pattern = Pattern.compile("((\\d{2})-(\\d{2}))");
Matcher matcher = pattern.matcher("12-34");

if (matcher.matches()) {
    System.out.println(matcher.group(1));  // "12-34"
    System.out.println(matcher.group(2));  // "12"
    System.out.println(matcher.group(3));  // "34"
}
```

### 9️⃣ Boas Práticas

**Use grupos nomeados para clareza**:

```java
// ❌ Difícil ler
Pattern p = Pattern.compile("(\\d{2})/(\\d{2})/(\\d{4})");

// ✓ Claro
Pattern p = Pattern.compile("(?<dia>\\d{2})/(?<mes>\\d{2})/(?<ano>\\d{4})");
```

**Não-capturante quando não precisar extrair**:
```java
// ✓ Só captura o que precisa
Pattern p = Pattern.compile("(?:http|https)://([a-z.]+)");

// ❌ Captura desnecessária
Pattern p = Pattern.compile("(http|https)://([a-z.]+)");
```

**Validar groupCount() antes de acessar**:
```java
if (matcher.matches() && matcher.groupCount() >= 2) {
    String grupo2 = matcher.group(2);
}
```

**Documentar grupos complexos**:
```java
Pattern pattern = Pattern.compile(
    "(?<ano>\\d{4})" +       // Grupo 1: ano
    "-(?<mes>\\d{2})" +      // Grupo 2: mês
    "-(?<dia>\\d{2})"        // Grupo 3: dia
);
```

### 🔟 Resumo de Tipos de Grupos

**Tabela completa**:

| Sintaxe | Tipo | Captura? | Backreference | Uso |
|---------|------|----------|---------------|-----|
| **(...)** | Normal | Sim | \\1, $1 | Extrair dados |
| **(?<name>...)** | Nomeado | Sim | \\k<name> | Clareza |
| **(?:...)** | Não-capturante | Não | - | Agrupar sem capturar |
| **(?>...)** | Atômico | Não | - | Performance |

**Numeração**:
- **Grupo 0**: match completo (sempre)
- **Grupos 1+**: ordem de abertura (
- **Nomeados**: também numerados

## 🎯 Aplicabilidade

**1. Extração**:
```java
matcher.group(1)  // Extrair parte
```

**2. Transformação**:
```java
replaceAll("(\\w+) (\\w+)", "$2, $1")
```

**3. Validação**:
```java
"(\\w+)\\s+\\1"  // Palavra duplicada
```

**4. Clareza**:
```java
"(?<ano>\\d{4})"  // Grupo nomeado
```

**5. Performance**:
```java
"(?:http|https)"  // Não-capturante
```

## ⚠️ Armadilhas Comuns

**1. Esquecer escape**:
```java
"(11)"  // ❌ grupo
"\\(11\\)"  // ✓ literal
```

**2. \\1 vs $1**:
```java
"(\\w+)\\s+\\1"  // \\1 no regex
replaceAll("...", "$1")  // $1 na substituição
```

**3. Grupo inexistente**:
```java
matcher.group(5)  // Verifica groupCount() primeiro
```

**4. Numeração aninhados**:
```java
"((a)(b))"  // 1=(ab), 2=(a), 3=(b)
```

**5. Captura desnecessária**:
```java
"(http|https)"  // ❌ captura sem usar
"(?:http|https)"  // ✓ não-capturante
```

## ✅ Boas Práticas

**1. Grupos nomeados**:
```java
"(?<nome>\\w+)"  // Clara intenção
```

**2. Não-capturante**:
```java
"(?:...)"  // Se não precisar extrair
```

**3. Validar groupCount()**:
```java
if (matcher.groupCount() >= 2) { }
```

**4. Documentar**:
```java
// Grupo 1: ano, 2: mês, 3: dia
```

**5. Backreferences**:
```java
"(\\w+)\\s+\\1"  // Palavra repetida
```

## 📚 Resumo Executivo

**Quatro tipos de grupos**.

**Normal ( )**:
```java
"(\\d+)"  // Captura e numera
matcher.group(1)
```

**Nomeado (?<name>...)**:
```java
"(?<ano>\\d{4})"
matcher.group("ano")
```

**Não-capturante (?:...)**:
```java
"(?:http|https)"  // Agrupa sem capturar
```

**Atômico (?>...)**:
```java
"(?>\\d+)"  // Sem backtracking
```

**Backreferences**:
```java
// No regex
"(\\w+)\\s+\\1"  // \\1, \\2, etc.

// Na substituição
replaceAll("(\\w+) (\\w+)", "$2, $1")  // $1, $2, etc.
```

**Numeração**:
```java
// Grupo 0: match completo
// Grupo 1+: ordem de ( abertura
// Nomeados: também têm número
```

**Uso típico**:
```java
// Extrair data
"(\\d{2})/(\\d{2})/(\\d{4})"
String dia = matcher.group(1);

// Formatar telefone
"(\\d{2})(\\d{5})(\\d{4})"
replaceAll(..., "($1) $2-$3")

// Email com nomes
"(?<usuario>\\w+)@(?<dominio>\\w+\\.\\w+)"
matcher.group("usuario")
```

**Recomendação**: Use **grupos nomeados** para clareza. Use **não-capturantes** (?:...) quando não precisar extrair. **Valide groupCount()** antes de acessar grupos. Use **backreferences** para validação (\\1) e transformação ($1). **Documente** grupos complexos.