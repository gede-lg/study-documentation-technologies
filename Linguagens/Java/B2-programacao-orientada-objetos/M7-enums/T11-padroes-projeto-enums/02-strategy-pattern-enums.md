# 🎯 Strategy Pattern com Enums

## 🎯 Introdução

O **Strategy Pattern** com enums oferece uma implementação **concisa, type-safe e eficiente** do padrão comportamental Strategy (GoF), eliminando a necessidade de múltiplas classes concretas de estratégias. Ao invés de criar uma interface `Strategy` e várias classes implementadoras, utilizamos enum com **constant-specific method implementation** ou **métodos abstratos**, resultando em código mais compacto, verificável em tempo de compilação e com melhor performance (dispatch via ordinal ao invés de polimorfismo tradicional).

### Contexto Histórico

**Strategy Pattern Clássico (GoF):**

```java
// ❌ Implementação tradicional - verbosa
interface EstrategiaOrdenacao {
    <T> void ordenar(List<T> lista, Comparator<T> comparator);
}

class BubbleSort implements EstrategiaOrdenacao {
    public <T> void ordenar(List<T> lista, Comparator<T> comparator) {
        // Implementação bubble sort
    }
}

class QuickSort implements EstrategiaOrdenacao {
    public <T> void ordenar(List<T> lista, Comparator<T> comparator) {
        // Implementação quick sort
    }
}

class MergeSort implements EstrategiaOrdenacao {
    public <T> void ordenar(List<T> lista, Comparator<T> comparator) {
        // Implementação merge sort
    }
}

// Uso
EstrategiaOrdenacao estrategia = new QuickSort();
estrategia.ordenar(lista, comparator);
```

**Problemas:**
- 4 arquivos separados (1 interface + 3 classes)
- Verbosidade excessiva
- Sem verificação de completude
- Performance inferior (polimorfismo via vtable)

**Strategy com Enum:**

```java
// ✅ Implementação concisa com enum
public enum EstrategiaOrdenacao {
    BUBBLE_SORT {
        public <T> void ordenar(List<T> lista, Comparator<T> comparator) {
            // Bubble sort
        }
    },
    QUICK_SORT {
        public <T> void ordenar(List<T> lista, Comparator<T> comparator) {
            // Quick sort
        }
    },
    MERGE_SORT {
        public <T> void ordenar(List<T> lista, Comparator<T> comparator) {
            // Merge sort
        }
    };

    public abstract <T> void ordenar(List<T> lista, Comparator<T> comparator);
}

// Uso
EstrategiaOrdenacao.QUICK_SORT.ordenar(lista, comparator);
```

**Vantagens:**
- ✅ Tudo em 1 arquivo
- ✅ Type-safe e compilador verifica completude
- ✅ Conciso e legível
- ✅ Performance superior

## 📋 Fundamentos Teóricos

### Como Funciona

**1. Método Abstrato no Enum**

Declarar um método abstrato no enum **força cada constante** a implementar o método, criando comportamentos específicos por estratégia.

```java
public enum Operacao {
    // Cada constante implementa calcular()
    SOMA {
        double calcular(double a, double b) { return a + b; }
    },
    SUBTRACAO {
        double calcular(double a, double b) { return a - b; }
    };

    // Método abstrato - OBRIGA implementação
    abstract double calcular(double a, double b);
}
```

**2. Polimorfismo com Enums**

Quando invocamos `Operacao.SOMA.calcular(5, 3)`, a JVM executa a implementação específica de `SOMA`, similar a polimorfismo tradicional mas com dispatch otimizado.

**3. Conjunto Fechado de Estratégias**

Ao contrário do Strategy clássico onde novas estratégias podem ser adicionadas via novas classes, enum define um **conjunto fechado e finito** de estratégias conhecidas em tempo de compilação.

## 🔍 Exemplos Práticos

### Estratégias de Desconto

```java
public enum EstrategiaDesconto {
    SEM_DESCONTO {
        public double aplicar(double valor) {
            return valor;
        }
    },
    DESCONTO_10 {
        public double aplicar(double valor) {
            return valor * 0.9;
        }
    },
    DESCONTO_25 {
        public double aplicar(double valor) {
            return valor * 0.75;
        }
    },
    BLACK_FRIDAY {
        public double aplicar(double valor) {
            return valor * 0.5;
        }
    };

    public abstract double aplicar(double valor);
}

// Uso
double preco = 100.0;
double comDesconto = EstrategiaDesconto.BLACK_FRIDAY.aplicar(preco);  // 50.0
```

### Estratégias de Pagamento

```java
public enum MetodoPagamento {
    CARTAO_CREDITO {
        public boolean processar(double valor, String dados) {
            System.out.println("Processando cartão de crédito: " + valor);
            // Integração com gateway de pagamento
            return validarCartao(dados) && cobrarCartao(valor, dados);
        }
    },
    PIX {
        public boolean processar(double valor, String dados) {
            System.out.println("Gerando QR Code PIX: " + valor);
            // Gerar QR Code e aguardar pagamento
            return gerarQRCode(dados) && aguardarConfirmacao();
        }
    },
    BOLETO {
        public boolean processar(double valor, String dados) {
            System.out.println("Gerando boleto: " + valor);
            // Gerar boleto bancário
            return gerarBoleto(valor, dados);
        }
    };

    public abstract boolean processar(double valor, String dados);

    // Métodos auxiliares privados (simulados)
    private static boolean validarCartao(String dados) { return true; }
    private static boolean cobrarCartao(double v, String d) { return true; }
    private static boolean gerarQRCode(String d) { return true; }
    private static boolean aguardarConfirmacao() { return true; }
    private static boolean gerarBoleto(double v, String d) { return true; }
}

// Uso
MetodoPagamento metodo = MetodoPagamento.PIX;
boolean sucesso = metodo.processar(150.0, "chave-pix");
```

### Estratégias de Compressão

```java
public enum AlgoritmoCompressao {
    GZIP {
        public byte[] comprimir(byte[] dados) {
            // Implementação GZIP
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try (GZIPOutputStream gzip = new GZIPOutputStream(baos)) {
                gzip.write(dados);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return baos.toByteArray();
        }

        public byte[] descomprimir(byte[] dados) {
            // Implementação descompressão GZIP
            return new byte[0]; // Simplificado
        }
    },
    ZIP {
        public byte[] comprimir(byte[] dados) {
            // Implementação ZIP
            return new byte[0]; // Simplificado
        }

        public byte[] descomprimir(byte[] dados) {
            return new byte[0]; // Simplificado
        }
    },
    LZ4 {
        public byte[] comprimir(byte[] dados) {
            // Implementação LZ4 (rápido)
            return new byte[0]; // Simplificado
        }

        public byte[] descomprimir(byte[] dados) {
            return new byte[0]; // Simplificado
        }
    };

    public abstract byte[] comprimir(byte[] dados);
    public abstract byte[] descomprimir(byte[] dados);
}
```

### Estratégias de Validação

```java
public enum ValidadorSenha {
    BASICO {
        public boolean validar(String senha) {
            return senha != null && senha.length() >= 6;
        }

        public String obterRegras() {
            return "Mínimo 6 caracteres";
        }
    },
    MEDIO {
        public boolean validar(String senha) {
            if (senha == null || senha.length() < 8) return false;
            boolean temLetra = senha.matches(".*[a-zA-Z].*");
            boolean temNumero = senha.matches(".*\\d.*");
            return temLetra && temNumero;
        }

        public String obterRegras() {
            return "Mínimo 8 caracteres, letras e números";
        }
    },
    FORTE {
        public boolean validar(String senha) {
            if (senha == null || senha.length() < 12) return false;
            boolean temMinuscula = senha.matches(".*[a-z].*");
            boolean temMaiuscula = senha.matches(".*[A-Z].*");
            boolean temNumero = senha.matches(".*\\d.*");
            boolean temEspecial = senha.matches(".*[!@#$%^&*].*");
            return temMinuscula && temMaiuscula && temNumero && temEspecial;
        }

        public String obterRegras() {
            return "Mínimo 12 caracteres, maiúsculas, minúsculas, números e caracteres especiais";
        }
    };

    public abstract boolean validar(String senha);
    public abstract String obterRegras();
}

// Uso
ValidadorSenha validador = ValidadorSenha.FORTE;
if (!validador.validar("abc123")) {
    System.out.println("Senha inválida. " + validador.obterRegras());
}
```

## 🎯 Padrão: Contexto com Estratégia

```java
public enum TipoRelatorio {
    PDF {
        public void gerar(Relatorio relatorio, OutputStream out) {
            // Gerar PDF usando iText ou similar
            System.out.println("Gerando PDF: " + relatorio.getTitulo());
        }
    },
    EXCEL {
        public void gerar(Relatorio relatorio, OutputStream out) {
            // Gerar Excel usando Apache POI
            System.out.println("Gerando Excel: " + relatorio.getTitulo());
        }
    },
    HTML {
        public void gerar(Relatorio relatorio, OutputStream out) {
            // Gerar HTML
            System.out.println("Gerando HTML: " + relatorio.getTitulo());
        }
    };

    public abstract void gerar(Relatorio relatorio, OutputStream out);
}

// Classe de contexto
public class GeradorRelatorio {
    private TipoRelatorio tipo;

    public GeradorRelatorio(TipoRelatorio tipo) {
        this.tipo = tipo;
    }

    public void gerarRelatorio(Relatorio relatorio, OutputStream out) {
        tipo.gerar(relatorio, out);
    }

    public void setTipo(TipoRelatorio tipo) {
        this.tipo = tipo;
    }
}

// Uso
Relatorio relatorio = new Relatorio("Vendas Q1 2024");
GeradorRelatorio gerador = new GeradorRelatorio(TipoRelatorio.PDF);
gerador.gerarRelatorio(relatorio, outputStream);

// Trocar estratégia dinamicamente
gerador.setTipo(TipoRelatorio.EXCEL);
gerador.gerarRelatorio(relatorio, outputStream);
```

## 💡 Estratégia com Dados Adicionais

```java
public enum FormatoData {
    CURTO("dd/MM/yy") {
        public String formatar(LocalDate data) {
            return data.format(DateTimeFormatter.ofPattern(getPattern()));
        }
    },
    MEDIO("dd/MM/yyyy") {
        public String formatar(LocalDate data) {
            return data.format(DateTimeFormatter.ofPattern(getPattern()));
        }
    },
    LONGO("dd 'de' MMMM 'de' yyyy", Locale.forLanguageTag("pt-BR")) {
        public String formatar(LocalDate data) {
            return data.format(DateTimeFormatter.ofPattern(getPattern(), getLocale()));
        }
    },
    ISO_8601("yyyy-MM-dd") {
        public String formatar(LocalDate data) {
            return data.format(DateTimeFormatter.ofPattern(getPattern()));
        }
    };

    private final String pattern;
    private final Locale locale;

    FormatoData(String pattern) {
        this(pattern, Locale.getDefault());
    }

    FormatoData(String pattern, Locale locale) {
        this.pattern = pattern;
        this.locale = locale;
    }

    public abstract String formatar(LocalDate data);

    public String getPattern() { return pattern; }
    public Locale getLocale() { return locale; }
}

// Uso
LocalDate hoje = LocalDate.now();
System.out.println(FormatoData.CURTO.formatar(hoje));      // 26/01/25
System.out.println(FormatoData.LONGO.formatar(hoje));      // 26 de janeiro de 2025
System.out.println(FormatoData.ISO_8601.formatar(hoje));   // 2025-01-26
```

## ⚡ Vantagens sobre Strategy Clássico

**1. Concisão**
- Enum: 1 arquivo
- Clássico: N+1 arquivos (interface + N classes)

**2. Type-Safety e Verificação de Completude**
```java
// ✅ Compilador avisa se falta implementação
public enum Estrategia {
    A, B, C;  // ERRO: falta implementar metodoAbstrato()
    abstract void metodoAbstrato();
}
```

**3. Performance**
- Enum: dispatch otimizado (ordinal-based)
- Clássico: dispatch via virtual table

**4. Facilita Switch/Pattern Matching**
```java
String descricao = switch (MetodoPagamento.CARTAO_CREDITO) {
    case CARTAO_CREDITO -> "Paga com cartão";
    case PIX -> "Paga com PIX";
    case BOLETO -> "Paga com boleto";
};
```

## ⚠️ Limitações

**1. Conjunto Fechado**
```java
// ❌ Não é possível adicionar estratégias em runtime
// Enum é fixo em tempo de compilação
```

**2. Extensibilidade Limitada**
```java
// ❌ Enum não pode ser estendido
// Não é possível: class NovaEstrategia extends MinhaEstrategia
```

**Quando Preferir Strategy Clássico:**
- Estratégias fornecidas por plugins externos
- Necessidade de adicionar estratégias em runtime
- Estratégias com lógica muito complexa (melhor separar em classes)

## 🔗 Interconexões

**Relação com Constant-Specific Methods**: Base do Strategy com enums

**Relação com Switch Expression**: Facilita seleção de estratégias

**Relação com Polimorfismo**: Strategy é polimorfismo aplicado
