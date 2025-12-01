# Formatação de Números

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Formatação de números** é o processo de converter valores numéricos (int, long, double, BigDecimal) em representação textual controlada - especificando casas decimais fixas, separadores de milhares, alinhamento, padding, sinal, notação científica, base (decimal/hex/octal), prefixos/sufixos. Conceitualmente, é a ponte entre representação interna binária (imprecisa para humanos: `1234.5` é apenas bytes) e representação textual formatada (precisa e legível: `"R$ 1.234,50"`, `"1,234.50"`, `"1.23E+03"`), permitindo que mesma informação numérica seja apresentada em formatos diferentes conforme contexto (monetário, científico, percentual, contador).

É o reconhecimento de que números brutos são insuficientes para apresentação - dinheiro precisa 2 decimais fixas, percentuais precisam símbolo `%`, grandes números precisam agrupamento visual (milhares/milhões), valores negativos podem usar parênteses `(10)` ao invés de sinal `-10`, e precisão científica exige notação exponencial.

### Contexto Histórico e Motivação

Formatação numérica é desafio antigo - línguas humanas usam diferentes separadores decimais (ponto vs vírgula), agrupamento de dígitos (milhares/lakhs), símbolos monetários ($, €, ¥, R$), e ordem de magnitude (mil, milhão vs lakh, crore). Java 1.1 (1997) introduziu `NumberFormat` e `DecimalFormat` para internacionalização. Java 5 (2004) adicionou printf-style (`%.2f`, `%,d`) para formatação rápida. Java 8+ trouxe `NumberFormatter` moderno.

**Motivação:** Interfaces de usuário, relatórios financeiros, logs científicos exigem números formatados corretamente - `1234567.89` é ilegível, `"1,234,567.89"` é claro, `"R$ 1.234.567,89"` comunica valor monetário brasileiro, `"1.23E+06"` é ideal para astronomia.

### Problema Fundamental que Resolve

**Problema:** Conversão simples (`toString()`) não controla formato:

```java
double preco = 1234.5;
System.out.println("Preço: " + preco);  // "Preço: 1234.5"
// Problemas:
// - Falta segundo decimal (.50)
// - Sem separador de milhares
// - Sem símbolo monetário
```

**Solução:** Formatação controlada:

```java
// printf-style
System.out.printf("Preço: R$ %,.2f%n", preco);  // "Preço: R$ 1.234,50" (locale BR)

// DecimalFormat
DecimalFormat fmt = new DecimalFormat("¤ #,##0.00");  // ¤ = símbolo moeda
System.out.println("Preço: " + fmt.format(preco));    // "Preço: R$ 1.234,50"
```

**Outro exemplo - científico:**

```java
double distancia = 149600000.0;  // Distância Terra-Sol em km
System.out.println(distancia);                       // "1.496E8" (padrão - ruim)
System.out.printf("%.2e km%n", distancia);            // "1.50e+08 km"
System.out.printf("%.0f km%n", distancia);            // "149600000 km"
System.out.printf("%,.0f km%n", distancia);           // "149,600,000 km" (legível!)
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Controle de Precisão:** Casas decimais fixas (2 para dinheiro, 6 para científico, 0 para contadores).

2. **Separadores Locale-Aware:** Ponto vs vírgula decimal, vírgula vs ponto milhares (US: `1,234.56` vs BR: `1.234,56`).

3. **Múltiplos Formatos:** Decimal, científico, hexadecimal, octal, percentual.

4. **Alinhamento e Padding:** Width mínimo, zero-padding, alinhamento esquerda/direita.

5. **Internacionalização:** Locale define símbolos (moeda, decimal, milhares).

### Pilares Fundamentais

- **Printf-Style:** `%d` (int), `%f` (float), `%e` (científico), `%x` (hex), flags `,.+0#`
- **DecimalFormat:** Pattern-based (`#,##0.00`, `0.###E0`)
- **NumberFormat:** Factory methods locale-aware (getCurrencyInstance, getPercentInstance)
- **Locale:** Define símbolos e agrupamento
- **Uso:** Interfaces, relatórios, logs, internacionalização

---

## 🧠 Fundamentos Teóricos

### Abordagens de Formatação Numérica

Java oferece 3 abordagens principais:

#### 1. Printf-Style (String.format/printf)

**Vantagens:** Conciso, inline, familiar (C/Python).

```java
System.out.printf("%d", 42);           // "42"
System.out.printf("%.2f", 123.456);    // "123.46"
System.out.printf("%,d", 1000000);     // "1,000,000"
System.out.printf("%+.2f", 12.5);      // "+12.50"
```

**Desvantagens:** Menos controle que DecimalFormat, locale implícito.

#### 2. DecimalFormat (Pattern-Based)

**Vantagens:** Máximo controle via patterns, configurável.

```java
DecimalFormat fmt = new DecimalFormat("#,##0.00");
fmt.format(1234.5);  // "1,234.50"

fmt.applyPattern("0.###E0");  // Mudar para científico
fmt.format(1234.5);  // "1.235E3"
```

**Desvantagens:** Mais verboso, sintaxe de pattern complexa.

#### 3. NumberFormat (Factory Methods)

**Vantagens:** Locale-aware por padrão, tipos especializados (currency, percent).

```java
NumberFormat currency = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
currency.format(1234.5);  // "R$ 1.234,50"

NumberFormat percent = NumberFormat.getPercentInstance();
percent.format(0.75);  // "75%"
```

**Desvantagens:** Menos flexível que DecimalFormat para formatos customizados.

### Princípios e Conceitos Subjacentes

#### Princípio da Locale-Awareness

Números são apresentados diferentemente por cultura:

```java
double valor = 1234.56;

// US: 1,234.56 (vírgula = milhares, ponto = decimal)
System.out.printf(Locale.US, "%,.2f%n", valor);  // "1,234.56"

// BR: 1.234,56 (ponto = milhares, vírgula = decimal)
System.out.printf(new Locale("pt", "BR"), "%,.2f%n", valor);  // "1.234,56"

// FR: 1 234,56 (espaço = milhares, vírgula = decimal)
System.out.printf(Locale.FRANCE, "%,.2f%n", valor);  // "1 234,56"
```

#### Princípio da Precisão Fixa

Dinheiro exige precisão consistente:

```java
double[] precos = {10.0, 10.5, 10.99};

// Inconsistente (toString)
for (double p : precos) {
    System.out.println(p);  // "10.0", "10.5", "10.99" - decimais variáveis!
}

// Consistente (formatação)
for (double p : precos) {
    System.out.printf("%.2f%n", p);  // "10.00", "10.50", "10.99" - sempre 2 decimais
}
```

---

## 🔍 Análise Conceitual Profunda

### Formatação com Printf-Style

#### Especificador %d - Inteiros

```java
// Básico
System.out.printf("%d%n", 42);              // "42"
System.out.printf("%d%n", -42);             // "-42"

// Width (largura mínima)
System.out.printf("%5d%n", 42);             // "   42" (3 espaços + 42)
System.out.printf("%5d%n", 12345);          // "12345" (>= width, sem truncar)

// Zero-padding
System.out.printf("%05d%n", 42);            // "00042"

// Alinhamento esquerda
System.out.printf("%-5d|%n", 42);           // "42   |"

// Separador de milhares
System.out.printf("%,d%n", 1000000);        // "1,000,000"

// Sinal sempre
System.out.printf("%+d%n", 42);             // "+42"
System.out.printf("%+d%n", -42);            // "-42"

// Espaço para positivos
System.out.printf("% d%n", 42);             // " 42" (espaço antes)
System.out.printf("% d%n", -42);            // "-42" (sinal menos)

// Negativos com parênteses (contabilidade)
System.out.printf("%(d%n", -42);            // "(42)"
System.out.printf("%(d%n", 42);             // "42"

// Combinação
System.out.printf("%,10d%n", 1000000);      // " 1,000,000" (width 10 + separador)
System.out.printf("%+,10d%n", 1000000);     // "+1,000,000" (sinal + width + separador)
```

#### Especificador %f - Floats/Doubles

```java
// Básico (6 decimais padrão)
System.out.printf("%f%n", 123.456);         // "123.456000"

// Precisão (casas decimais)
System.out.printf("%.2f%n", 123.456);       // "123.46" (arredonda)
System.out.printf("%.0f%n", 123.456);       // "123" (sem decimais)
System.out.printf("%.5f%n", 123.4);         // "123.40000" (adiciona zeros)

// Width + Precisão
System.out.printf("%10.2f%n", 123.45);      // "    123.45" (width 10, 2 decimais)

// Separador de milhares
System.out.printf("%,.2f%n", 1234567.89);   // "1,234,567.89"

// Alinhamento
System.out.printf("%-10.2f|%n", 123.45);    // "123.45    |" (esquerda)

// Sinal
System.out.printf("%+.2f%n", 123.45);       // "+123.45"

// Zero-padding
System.out.printf("%08.2f%n", 123.45);      // "00123.45" (width 8 total)

// Parênteses para negativos
System.out.printf("(%,.2f%n", -1234.56);    // "(1,234.56)"
```

#### Especificador %e - Notação Científica

```java
// Básico (6 decimais padrão na mantissa)
System.out.printf("%e%n", 1234.56);         // "1.234560e+03"

// Precisão (decimais na mantissa)
System.out.printf("%.2e%n", 1234.56);       // "1.23e+03"
System.out.printf("%.0e%n", 1234.56);       // "1e+03"

// Maiúsculo
System.out.printf("%E%n", 1234.56);         // "1.234560E+03"

// Width
System.out.printf("%15.2e%n", 1234.56);     // "       1.23e+03" (width 15)

// Uso para valores muito grandes/pequenos
System.out.printf("%.2e%n", 0.0000123);     // "1.23e-05"
System.out.printf("%.2e%n", 12300000.0);    // "1.23e+07"
```

#### Especificador %g - Formato Geral

Escolhe automaticamente entre `%f` e `%e` baseado em magnitude:

```java
System.out.printf("%g%n", 123.456);         // "123.456" (usa %f)
System.out.printf("%g%n", 0.0001234);       // "0.0001234" (usa %f)
System.out.printf("%g%n", 0.00001234);      // "1.23400e-05" (usa %e)
System.out.printf("%g%n", 1234567.0);       // "1.23457e+06" (usa %e)

// Precisão controla dígitos significativos (não decimais!)
System.out.printf("%.3g%n", 123.456);       // "123" (3 sig figs)
System.out.printf("%.5g%n", 123.456);       // "123.46" (5 sig figs)
```

#### Especificadores de Base (Hexadecimal/Octal)

```java
int valor = 255;

// Hexadecimal
System.out.printf("%x%n", valor);           // "ff" (minúsculo)
System.out.printf("%X%n", valor);           // "FF" (maiúsculo)
System.out.printf("%#x%n", valor);          // "0xff" (com prefixo)
System.out.printf("%#X%n", valor);          // "0XFF"

// Octal
System.out.printf("%o%n", 8);               // "10"
System.out.printf("%#o%n", 8);              // "010" (com prefixo)

// Width e zero-padding
System.out.printf("%08x%n", valor);         // "000000ff"
```

### Formatação com DecimalFormat

#### Sintaxe de Pattern

**Símbolos:**
- `0`: Dígito obrigatório (adiciona zero se necessário)
- `#`: Dígito opcional (omitido se zero à esquerda)
- `.`: Separador decimal
- `,`: Separador de agrupamento (milhares)
- `-`: Sinal de menos
- `E`: Separador de expoente (científico)
- `;`: Separador entre padrão positivo e negativo
- `¤`: Símbolo de moeda

#### Patterns Básicos

```java
DecimalFormat fmt;

// Inteiros com agrupamento
fmt = new DecimalFormat("#,###");
fmt.format(1234567);        // "1,234,567"
fmt.format(123);            // "123" (# é opcional)

// Zeros à esquerda obrigatórios
fmt = new DecimalFormat("000000");
fmt.format(42);             // "000042"

// Decimais fixas
fmt = new DecimalFormat("#,##0.00");
fmt.format(1234.5);         // "1,234.50" (adiciona zero)
fmt.format(1234.567);       // "1,234.57" (arredonda)

// Decimais opcionais
fmt = new DecimalFormat("#,##0.##");
fmt.format(1234.5);         // "1,234.5" (sem zero extra)
fmt.format(1234.0);         // "1,234" (omite decimais se zero)

// Mistura obrigatório/opcional
fmt = new DecimalFormat("#,##0.0##");
fmt.format(1234.5);         // "1,234.5" (1 decimal obrigatório)
fmt.format(1234.0);         // "1,234.0" (sempre 1 decimal)
fmt.format(1234.567);       // "1,234.567" (até 3 decimais)
```

#### Patterns para Moeda

```java
DecimalFormat fmt;

// Símbolo de moeda (locale-dependent)
fmt = new DecimalFormat("¤ #,##0.00");
fmt.format(1234.5);         // "R$ 1.234,50" (locale BR)
                             // "$ 1,234.50" (locale US)

// Código de moeda
fmt = new DecimalFormat("¤¤ #,##0.00");
fmt.format(1234.5);         // "BRL 1.234,50" (locale BR)
                             // "USD 1,234.50" (locale US)

// Sufixo customizado
fmt = new DecimalFormat("#,##0.00 'reais'");
fmt.format(1234.5);         // "1.234,50 reais"
```

#### Patterns Positivo/Negativo Separados

```java
// Formato: padrão_positivo;padrão_negativo
DecimalFormat fmt;

// Parênteses para negativos
fmt = new DecimalFormat("#,##0.00;(#,##0.00)");
fmt.format(1234.5);         // "1,234.50"
fmt.format(-1234.5);        // "(1,234.50)"

// Prefixos diferentes
fmt = new DecimalFormat("'Crédito: '#,##0.00;'Débito: '#,##0.00");
fmt.format(1234.5);         // "Crédito: 1,234.50"
fmt.format(-1234.5);        // "Débito: 1,234.50"
```

#### Pattern Científico

```java
DecimalFormat fmt;

// Notação científica
fmt = new DecimalFormat("0.###E0");
fmt.format(1234.5);         // "1.235E3"
fmt.format(0.001234);       // "1.234E-3"

// Engenharia (expoente múltiplo de 3)
fmt = new DecimalFormat("##0.###E0");
fmt.format(1234.5);         // "1.235E3"
fmt.format(12345);          // "12.345E3" (expoente ajustado)
```

### Formatação com NumberFormat

#### Currency Formatting

```java
// Moeda locale-aware
NumberFormat currencyUS = NumberFormat.getCurrencyInstance(Locale.US);
currencyUS.format(1234.56);     // "$1,234.56"

NumberFormat currencyBR = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
currencyBR.format(1234.56);     // "R$ 1.234,56"

// Configurar decimais
currencyUS.setMinimumFractionDigits(3);
currencyUS.format(10.5);        // "$10.500"
```

#### Percent Formatting

```java
NumberFormat percent = NumberFormat.getPercentInstance();
percent.format(0.75);           // "75%"
percent.format(0.12345);        // "12%" (arredonda)

// Precisão
percent.setMaximumFractionDigits(2);
percent.format(0.12345);        // "12.35%"
```

#### Integer Formatting

```java
NumberFormat integer = NumberFormat.getIntegerInstance();
integer.format(1234567);        // "1,234,567"
integer.format(1234.567);       // "1,235" (arredonda)

// Agrupamento locale-aware
NumberFormat intBR = NumberFormat.getIntegerInstance(new Locale("pt", "BR"));
intBR.format(1234567);          // "1.234.567" (ponto como separador)
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Abordagem

#### Printf-Style

✅ **Use quando:**
- Output console/arquivo direto
- Formatação inline e concisa
- Sem necessidade de reutilizar formatter

```java
System.out.printf("Total: R$ %,.2f%n", total);
```

#### DecimalFormat

✅ **Use quando:**
- Patterns complexos customizados
- Reutilizar formatter para múltiplos valores
- Precisar mudar pattern dinamicamente

```java
DecimalFormat fmt = new DecimalFormat("#,##0.00");
for (double valor : valores) {
    System.out.println(fmt.format(valor));
}
```

#### NumberFormat

✅ **Use quando:**
- Formatação locale-aware obrigatória
- Tipos especializados (moeda, percentual)
- Internacionalização

```java
NumberFormat currency = NumberFormat.getCurrencyInstance(userLocale);
label.setText(currency.format(preco));
```

---

## ⚠️ Limitações e Considerações

### Precisão de Ponto Flutuante

```java
// Floats têm erro de representação binária
double valor = 0.1 + 0.2;
System.out.println(valor);                  // "0.30000000000000004" (impreciso!)
System.out.printf("%.2f%n", valor);         // "0.30" (arredondado para apresentação)

// Para dinheiro, use BigDecimal
BigDecimal val1 = new BigDecimal("0.1");
BigDecimal val2 = new BigDecimal("0.2");
BigDecimal soma = val1.add(val2);
System.out.println(soma);                   // "0.3" (preciso!)
```

### Locale Implícito vs Explícito

```java
// Perigoso - usa Locale.getDefault() (varia por ambiente)
System.out.printf("%,.2f%n", 1234.56);  // "1,234.56" (US) ou "1.234,56" (BR)?

// Seguro - Locale explícito
System.out.printf(Locale.US, "%,.2f%n", 1234.56);  // Sempre "1,234.56"
```

### Performance

```java
// Printf - parsing em toda chamada
for (int i = 0; i < 10000; i++) {
    System.out.printf("%.2f%n", valores[i]);  // Lento
}

// DecimalFormat - reuso do formatter
DecimalFormat fmt = new DecimalFormat("0.00");
for (int i = 0; i < 10000; i++) {
    System.out.println(fmt.format(valores[i]));  // Mais rápido
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Locale

```java
// Símbolos variam por locale
DecimalFormatSymbols symbols = DecimalFormatSymbols.getInstance(new Locale("pt", "BR"));
symbols.getDecimalSeparator();      // ','
symbols.getGroupingSeparator();     // '.'
symbols.getCurrencySymbol();        // "R$"
```

### Relação com BigDecimal

```java
// BigDecimal para precisão exata
BigDecimal preco = new BigDecimal("1234.56");
DecimalFormat fmt = new DecimalFormat("R$ #,##0.00");
fmt.format(preco);  // "R$ 1.234,56" (sem erro de arredondamento)
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Locale e Internacionalização**: Adaptação cultural de formatos
- **BigDecimal**: Aritmética decimal precisa
- **DateTimeFormatter**: Formatação de datas (Java 8+)
- **MessageFormat**: Templates com formatação embutida

---

## 📚 Conclusão

Formatação de números transforma valores numéricos brutos em representação textual controlada - casas decimais, separadores, alinhamento, notação. Java oferece três abordagens: printf-style (conciso, inline), DecimalFormat (patterns customizados), NumberFormat (locale-aware especializado).

Dominar formatação numérica significa:
- Printf: `%d` (int), `%f` (float com `.2f` para decimais), `%e` (científico), flags `,.+0#(`
- DecimalFormat: patterns `#` (opcional), `0` (obrigatório), `,` (agrupamento), `.` (decimal), `¤` (moeda)
- NumberFormat: factory methods getCurrencyInstance, getPercentInstance para tipos especializados
- Sempre especificar Locale explícito quando formato deve ser previsível
- Usar BigDecimal para dinheiro (evita erro de float)
- Reutilizar DecimalFormat em loops para performance
- Aplicar em UIs, relatórios, logs, internacionalização

Formatação numérica é ponte entre precisão computacional e legibilidade humana - `1234.5` vira `"R$ 1.234,50"`, `"1,234.50"`, `"1.23E+03"` conforme contexto. É diferença entre dados brutos e informação apresentável.
