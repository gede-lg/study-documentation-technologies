# Formatação de Datas

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Formatação de datas** é o processo de converter valores temporais (Date, Calendar, LocalDateTime) em representação textual controlada - especificando ordem (DD/MM/YYYY vs MM/DD/YYYY vs YYYY-MM-DD), separadores (/ vs - vs .), componentes (data completa vs apenas mês/ano), idioma (mês por extenso localizado), timezone, e precisão (incluir milissegundos ou apenas data). Conceitualmente, é a transformação de timestamp interno (milissegundos desde epoch Unix 1970, ou campos separados) em String legível para humanos (`"24/11/2025"`, `"November 24, 2025"`, `"2025-11-24T14:30:45"`), permitindo que mesmo instante temporal seja apresentado em formatos culturalmente apropriados.

É o reconhecimento de que representação interna de tempo (número ou objeto complexo) é incompreensível - usuários brasileiros esperam `"24/11/2025 14:30"`, americanos `"11/24/2025 2:30 PM"`, ISO 8601 exige `"2025-11-24T14:30:45Z"`, e logs técnicos podem precisar milissegundos e timezone.

### Contexto Histórico e Motivação

Datas são desafio de internacionalização - ordem (dia/mês/ano vs mês/dia/ano), separadores, nomes de meses/dias, calendários (gregoriano, juliano, islâmico), eras (AC/DC, AH), fusos horários. Java 1.0 tinha `Date` com formatação limitada. Java 1.1 (1997) introduziu `SimpleDateFormat` com patterns (`"yyyy-MM-dd"`). Java 8 (2014) revolucionou com `java.time` - `DateTimeFormatter` imutável, thread-safe, API fluente, suporte ISO-8601, parsing robusto.

**Motivação:** Mesma data é escrita diferentemente globalmente - 03/04/2025 é "3 de abril" (US) ou "4 de março" (BR)? Formatação evita ambiguidade, garante comunicação clara, e respeita convenções culturais.

### Problema Fundamental que Resolve

**Problema:** toString() de Date é fixo e verbose:

```java
Date agora = new Date();
System.out.println(agora);
// "Sun Nov 24 14:30:45 BRT 2025" - não customizável, não localizado!
```

**Solução:** Formatação customizada:

```java
// SimpleDateFormat (Java 6-)
SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy HH:mm");
System.out.println(fmt.format(agora));  // "24/11/2025 14:30"

// DateTimeFormatter (Java 8+)
LocalDateTime agora8 = LocalDateTime.now();
DateTimeFormatter fmt8 = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
System.out.println(agora8.format(fmt8));  // "24/11/2025 14:30"

// printf-style
System.out.printf("%tF %<tT%n", agora);  // "2025-11-24 14:30:45"
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Múltiplas APIs:** Date/SimpleDateFormat (legado), Calendar, java.time/DateTimeFormatter (moderno).

2. **Patterns:** Símbolos representam componentes (`y`=ano, `M`=mês, `d`=dia, `H`=hora, `m`=minuto, `s`=segundo).

3. **Locale-Aware:** Nomes de meses/dias em idioma local, ordem de componentes.

4. **Timezone-Aware:** ZonedDateTime preserva fuso, formatação pode incluir offset.

5. **Parsing Bidirecional:** Formatar (objeto→String) e parsear (String→objeto).

### Pilares Fundamentais

- **SimpleDateFormat:** Pattern-based, mutável, não thread-safe (legado)
- **DateTimeFormatter:** Pattern/predefined, imutável, thread-safe (Java 8+)
- **Printf-Style:** %t com sufixos (%tF, %tT, %tD) para datas
- **Locale:** Idioma de meses/dias, ordem de componentes
- **Uso:** UIs, relatórios, logs, APIs REST (ISO-8601), internacionalização

---

## 🧠 Fundamentos Teóricos

### Abordagens de Formatação de Datas

#### 1. Printf-Style (String.format/printf)

**Vantagens:** Conciso para output direto.

```java
Date data = new Date();

// Data
System.out.printf("%tF%n", data);       // "2025-11-24" (ISO)
System.out.printf("%tD%n", data);       // "11/24/25" (US)

// Hora
System.out.printf("%tT%n", data);       // "14:30:45" (24h)
System.out.printf("%tr%n", data);       // "02:30:45 PM" (12h)

// Combinado
System.out.printf("%tF %<tT%n", data);  // "2025-11-24 14:30:45"
```

**Desvantagens:** Limitado, não retorna String facilmente, menos controle.

#### 2. SimpleDateFormat (Legado Java 6-)

**Vantagens:** Flexível via patterns customizados.

```java
Date data = new Date();
SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
String resultado = fmt.format(data);  // "24/11/2025 14:30:45"
```

**Desvantagens:** Mutável, não thread-safe, API confusa.

#### 3. DateTimeFormatter (Moderno Java 8+)

**Vantagens:** Imutável, thread-safe, API clara, suporte ISO-8601.

```java
LocalDateTime data = LocalDateTime.now();
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
String resultado = data.format(fmt);  // "24/11/2025 14:30:45"
```

**Desvantagens:** Requer Java 8+ (não funciona com Date legado sem conversão).

### Princípios e Conceitos Subjacentes

#### Princípio da Locale-Awareness

```java
Date data = new Date();  // 24 Nov 2025

// Inglês (US)
SimpleDateFormat fmtUS = new SimpleDateFormat("EEEE, MMMM d, yyyy", Locale.US);
fmtUS.format(data);  // "Sunday, November 24, 2025"

// Português (BR)
SimpleDateFormat fmtBR = new SimpleDateFormat("EEEE, d 'de' MMMM 'de' yyyy", new Locale("pt", "BR"));
fmtBR.format(data);  // "domingo, 24 de novembro de 2025"

// Francês
SimpleDateFormat fmtFR = new SimpleDateFormat("EEEE d MMMM yyyy", Locale.FRANCE);
fmtFR.format(data);  // "dimanche 24 novembre 2025"
```

#### Princípio do ISO-8601

Padrão internacional para data/hora:

```java
// ISO-8601: YYYY-MM-DDTHH:mm:ss.sssZ
LocalDateTime data = LocalDateTime.now();

DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(data);
// "2025-11-24T14:30:45.123"

DateTimeFormatter.ISO_DATE.format(data.toLocalDate());
// "2025-11-24"
```

**Vantagens:** Não ambíguo, ordenável lexicograficamente, universalmente compreendido.

---

## 🔍 Análise Conceitual Profunda

### Formatação com Printf-Style

#### Especificadores de Data (%t)

**Componentes de data:**

```java
Date data = new Date();  // 24 Nov 2025 (domingo)

// Ano
System.out.printf("%tY%n", data);     // "2025" (4 dígitos)
System.out.printf("%ty%n", data);     // "25" (2 dígitos)
System.out.printf("%tC%n", data);     // "20" (século)

// Mês
System.out.printf("%tm%n", data);     // "11" (número 01-12)
System.out.printf("%tB%n", data);     // "November" (nome completo)
System.out.printf("%tb%n", data);     // "Nov" (abreviado)
System.out.printf("%th%n", data);     // "Nov" (mesmo que %tb)

// Dia
System.out.printf("%td%n", data);     // "24" (dia do mês 01-31)
System.out.printf("%te%n", data);     // "24" (sem zero leading)
System.out.printf("%tj%n", data);     // "328" (dia do ano 001-366)

// Dia da semana
System.out.printf("%tA%n", data);     // "Sunday" (nome completo)
System.out.printf("%ta%n", data);     // "Sun" (abreviado)
```

**Componentes de hora:**

```java
Date hora = new Date();  // 14:30:45 (2:30:45 PM)

// Hora
System.out.printf("%tH%n", hora);     // "14" (24h, 00-23)
System.out.printf("%tI%n", hora);     // "02" (12h, 01-12)
System.out.printf("%tk%n", hora);     // "14" (24h sem zero leading)
System.out.printf("%tl%n", hora);     // " 2" (12h sem zero leading, com espaço)

// Minuto/Segundo
System.out.printf("%tM%n", hora);     // "30" (minuto 00-59)
System.out.printf("%tS%n", hora);     // "45" (segundo 00-60)
System.out.printf("%tL%n", hora);     // "123" (milissegundos 000-999)
System.out.printf("%tN%n", hora);     // "123000000" (nanossegundos)

// AM/PM
System.out.printf("%tp%n", hora);     // "pm" (minúsculo)
System.out.printf("%Tp%n", hora);     // "PM" (maiúsculo)

// Timezone
System.out.printf("%tz%n", hora);     // "-0300" (offset numérico)
System.out.printf("%tZ%n", hora);     // "BRT" (nome timezone)
```

**Composições:**

```java
Date timestamp = new Date();

// Data ISO
System.out.printf("%tF%n", timestamp);    // "2025-11-24" (YYYY-MM-DD)

// Data US
System.out.printf("%tD%n", timestamp);    // "11/24/25" (MM/DD/YY)

// Hora ISO
System.out.printf("%tT%n", timestamp);    // "14:30:45" (HH:MM:SS)

// Hora 12h com AM/PM
System.out.printf("%tr%n", timestamp);    // "02:30:45 PM"

// Hora 24h sem segundos
System.out.printf("%tR%n", timestamp);    // "14:30"

// Timestamp completo
System.out.printf("%tc%n", timestamp);    // "Sun Nov 24 14:30:45 BRT 2025"

// Segundos desde epoch
System.out.printf("%ts%n", timestamp);    // "1732467045" (Unix timestamp)
System.out.printf("%tQ%n", timestamp);    // "1732467045123" (millis desde epoch)
```

**Reutilização de argumento:**

```java
Date data = new Date();

// Passar data uma vez, usar múltiplas vezes com %<
System.out.printf("%tF %<tT %<tZ%n", data);
// "2025-11-24 14:30:45 BRT"

// Equivalente (sem reutilização):
System.out.printf("%tF %tT %tZ%n", data, data, data);
```

### Formatação com SimpleDateFormat

#### Sintaxe de Pattern

**Símbolos de data:**

| Símbolo | Significado | Exemplo |
|---------|-------------|---------|
| `y` | Ano | `yy`=25, `yyyy`=2025 |
| `M` | Mês | `M`=11, `MM`=11, `MMM`=Nov, `MMMM`=November |
| `d` | Dia do mês | `d`=24, `dd`=24 |
| `D` | Dia do ano | `D`=328, `DDD`=328 |
| `E` | Dia da semana | `E`=Sun, `EEEE`=Sunday |
| `w` | Semana do ano | `w`=47 |
| `W` | Semana do mês | `W`=4 |

**Símbolos de hora:**

| Símbolo | Significado | Exemplo |
|---------|-------------|---------|
| `H` | Hora 24h | `H`=14, `HH`=14 |
| `h` | Hora 12h | `h`=2, `hh`=02 |
| `m` | Minuto | `m`=30, `mm`=30 |
| `s` | Segundo | `s`=45, `ss`=45 |
| `S` | Milissegundo | `S`=123, `SSS`=123 |
| `a` | AM/PM | `a`=PM |
| `z` | Timezone | `z`=BRT, `zzzz`=Brazil Time |
| `Z` | Offset | `Z`=-0300 |

**Texto literal:**

```java
SimpleDateFormat fmt;

// Texto entre aspas simples
fmt = new SimpleDateFormat("'Data:' dd/MM/yyyy");
fmt.format(new Date());  // "Data: 24/11/2025"

// Escape de aspa simples
fmt = new SimpleDateFormat("'Today''s date:' dd/MM/yyyy");
fmt.format(new Date());  // "Today's date: 24/11/2025"
```

#### Patterns Comuns

```java
Date data = new Date();  // 24 Nov 2025, 14:30:45
SimpleDateFormat fmt;

// Brasil - curto
fmt = new SimpleDateFormat("dd/MM/yyyy");
fmt.format(data);  // "24/11/2025"

// Brasil - completo
fmt = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
fmt.format(data);  // "24/11/2025 14:30:45"

// US - curto
fmt = new SimpleDateFormat("MM/dd/yyyy");
fmt.format(data);  // "11/24/2025"

// ISO-8601
fmt = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
fmt.format(data);  // "2025-11-24T14:30:45"

// Extenso (locale-aware)
fmt = new SimpleDateFormat("EEEE, d 'de' MMMM 'de' yyyy", new Locale("pt", "BR"));
fmt.format(data);  // "domingo, 24 de novembro de 2025"

// 12 horas com AM/PM
fmt = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss a");
fmt.format(data);  // "24/11/2025 02:30:45 PM"

// Com timezone
fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
fmt.format(data);  // "2025-11-24 14:30:45 BRT"

// Apenas mês/ano
fmt = new SimpleDateFormat("MMMM/yyyy", new Locale("pt", "BR"));
fmt.format(data);  // "novembro/2025"

// Timestamp para log
fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
fmt.format(data);  // "2025-11-24 14:30:45.123"
```

#### Parsing (String → Date)

```java
SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");

try {
    Date data = fmt.parse("24/11/2025");
    System.out.println(data);  // Date object
} catch (ParseException e) {
    System.err.println("Formato inválido!");
}

// Parsing estrito
fmt.setLenient(false);  // Rejeita datas inválidas como 32/13/2025
```

### Formatação com DateTimeFormatter (Java 8+)

#### Formatters Predefinidos

```java
LocalDateTime data = LocalDateTime.now();  // 2025-11-24T14:30:45

// ISO-8601 formats
DateTimeFormatter.ISO_LOCAL_DATE.format(data.toLocalDate());
// "2025-11-24"

DateTimeFormatter.ISO_LOCAL_TIME.format(data.toLocalTime());
// "14:30:45"

DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(data);
// "2025-11-24T14:30:45"

DateTimeFormatter.ISO_DATE_TIME.format(data.atZone(ZoneId.systemDefault()));
// "2025-11-24T14:30:45-03:00[America/Sao_Paulo]"

// RFC-1123
DateTimeFormatter.RFC_1123_DATE_TIME.format(ZonedDateTime.now());
// "Sun, 24 Nov 2025 14:30:45 -0300"

// Basic ISO
DateTimeFormatter.BASIC_ISO_DATE.format(data.toLocalDate());
// "20251124"
```

#### Patterns Customizados

```java
LocalDateTime data = LocalDateTime.now();
DateTimeFormatter fmt;

// Mesmo padrão de SimpleDateFormat
fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
data.format(fmt);  // "24/11/2025 14:30:45"

// Com locale
fmt = DateTimeFormatter.ofPattern("EEEE, d 'de' MMMM 'de' yyyy", new Locale("pt", "BR"));
data.format(fmt);  // "domingo, 24 de novembro de 2025"

// Builder fluente
fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                       .withLocale(new Locale("pt", "BR"));
data.format(fmt);
```

#### Parsing com DateTimeFormatter

```java
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

// Parsing
LocalDateTime data = LocalDateTime.parse("24/11/2025 14:30", fmt);
System.out.println(data);  // 2025-11-24T14:30

// Parsing com diferentes tipos
LocalDate date = LocalDate.parse("24/11/2025", DateTimeFormatter.ofPattern("dd/MM/yyyy"));
LocalTime time = LocalTime.parse("14:30:45", DateTimeFormatter.ISO_LOCAL_TIME);
```

#### Formatação com Timezone

```java
ZonedDateTime dataComZone = ZonedDateTime.now();

DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z");
dataComZone.format(fmt);  // "2025-11-24 14:30:45 BRT"

// Com offset
fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss XXX");
dataComZone.format(fmt);  // "2025-11-24 14:30:45 -03:00"
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Abordagem

#### Printf-Style

✅ **Use quando:**
- Output console/log direto
- Formato simples (ISO, US standard)
- Não precisar da String formatada

```java
System.out.printf("Log: %tF %<tT - %s%n", new Date(), mensagem);
```

#### SimpleDateFormat

⚠️ **Use apenas se:**
- Projeto legado Java 6- (sem java.time disponível)
- Integração com código existente usando Date

```java
// Legado
SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");
String texto = fmt.format(legacyDate);
```

#### DateTimeFormatter

✅ **Use quando:**
- Java 8+ disponível (sempre prefira!)
- Thread-safety necessária
- API moderna e clara

```java
// Moderno
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
String texto = LocalDate.now().format(fmt);
```

---

## ⚠️ Limitações e Considerações

### Thread-Safety

```java
// SimpleDateFormat NÃO é thread-safe!
SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy");

// PERIGOSO em ambiente multithreaded
executorService.submit(() -> fmt.format(date1));
executorService.submit(() -> fmt.format(date2));
// Pode causar resultados incorretos ou exceção!

// CORRETO - instância por thread
ThreadLocal<SimpleDateFormat> fmtThreadLocal = ThreadLocal.withInitial(
    () -> new SimpleDateFormat("dd/MM/yyyy")
);

// DateTimeFormatter É thread-safe
DateTimeFormatter fmt8 = DateTimeFormatter.ofPattern("dd/MM/yyyy");
// Pode ser compartilhado entre threads com segurança
```

### Timezone

```java
// Date não armazena timezone!
Date data = new Date();  // Sempre UTC internamente

SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
fmt.setTimeZone(TimeZone.getTimeZone("America/Sao_Paulo"));
fmt.format(data);  // Converte UTC para timezone especificado

// java.time tem tipos específicos
LocalDateTime.now();           // Sem timezone
ZonedDateTime.now();           // Com timezone
OffsetDateTime.now();          // Com offset
Instant.now();                 // UTC sempre
```

### Ambiguidade de Parsing

```java
// 03/04/2025 é 3 de abril (US) ou 4 de março (BR)?
SimpleDateFormat fmtUS = new SimpleDateFormat("MM/dd/yyyy", Locale.US);
SimpleDateFormat fmtBR = new SimpleDateFormat("dd/MM/yyyy", new Locale("pt", "BR"));

Date dataUS = fmtUS.parse("03/04/2025");  // 3 de abril
Date dataBR = fmtBR.parse("03/04/2025");  // 4 de março
// Diferentes! Sempre especifique Locale e pattern claramente!
```

---

## 🔗 Interconexões Conceituais

### Conversão entre APIs

```java
// Date → LocalDateTime
Date date = new Date();
LocalDateTime ldt = date.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime();

// LocalDateTime → Date
LocalDateTime ldt2 = LocalDateTime.now();
Date date2 = Date.from(ldt2.atZone(ZoneId.systemDefault()).toInstant());
```

### Relação com Locale

```java
// Locale afeta nomes de meses/dias
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMMM", Locale.US);
LocalDate.now().format(fmt);  // "November"

fmt = DateTimeFormatter.ofPattern("MMMM", new Locale("pt", "BR"));
LocalDate.now().format(fmt);  // "novembro"
```

---

## 🚀 Evolução e Próximos Conceitos

### Java 8+ (java.time)

**Vantagens sobre Date/SimpleDateFormat:**
- Imutável e thread-safe
- API clara e fluente
- Tipos específicos (LocalDate, LocalTime, LocalDateTime, ZonedDateTime)
- Suporte nativo ISO-8601
- Parsing robusto

**Sempre prefira java.time para novos projetos!**

---

## 📚 Conclusão

Formatação de datas transforma valores temporais em representação textual controlada - ordem de componentes, separadores, idioma, timezone, precisão. Java oferece printf-style (conciso), SimpleDateFormat (legado, mutável), e DateTimeFormatter (moderno, imutável, thread-safe).

Dominar formatação de datas significa:
- Printf: %t com sufixos (%tF=ISO date, %tT=ISO time, %tD=US date, %tr=12h)
- SimpleDateFormat: patterns `yyyy-MM-dd HH:mm:ss`, símbolos `y` (ano), `M` (mês), `d` (dia), `H` (hora 24h), `m` (minuto), `s` (segundo)
- DateTimeFormatter: mesmos patterns, imutável, thread-safe, preferir sempre no Java 8+
- Sempre especificar Locale explícito para evitar ambiguidade
- SimpleDateFormat NÃO é thread-safe - usar DateTimeFormatter ou ThreadLocal
- Usar ISO-8601 (`yyyy-MM-dd'T'HH:mm:ss`) para APIs/logs - não ambíguo, ordenável
- Aplicar em UIs (formato local), APIs (ISO-8601), logs (timestamp preciso)

Formatação de datas é ponte entre timestamp interno e apresentação cultural - `Date` vira `"24/11/2025"` (BR), `"11/24/2025"` (US), `"2025-11-24"` (ISO). É diferença entre dado temporal bruto e informação temporal compreensível e culturalmente apropriada.
