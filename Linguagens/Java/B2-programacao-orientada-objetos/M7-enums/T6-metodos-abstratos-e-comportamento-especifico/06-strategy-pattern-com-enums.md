# T6.06 - Strategy Pattern com Enums

## Introdução

**Strategy Pattern com enum**: cada constante é uma **estratégia**.

```java
// ✅ Enum implementa Strategy Pattern
public enum EstrategiaDesconto {
    NENHUM {
        @Override
        public double aplicar(double valor) {
            return valor;
        }
    },
    CLIENTE_VIP {
        @Override
        public double aplicar(double valor) {
            return valor * 0.80; // 20% desconto
        }
    },
    BLACK_FRIDAY {
        @Override
        public double aplicar(double valor) {
            return valor * 0.50; // 50% desconto
        }
    };
    
    public abstract double aplicar(double valor);
}

// ✅ Uso
public class Pedido {
    private double valor;
    private EstrategiaDesconto desconto;
    
    public double calcularTotal() {
        return desconto.aplicar(valor); // Strategy pattern
    }
}

Pedido pedido = new Pedido(100.0, EstrategiaDesconto.CLIENTE_VIP);
double total = pedido.calcularTotal(); // 80.0
```

Cada constante = **estratégia diferente**.

---

## Fundamentos

### 1. Strategy Básico

```java
public enum EstrategiaPagamento {
    DINHEIRO {
        @Override
        public void processar(double valor) {
            System.out.println("Processando pagamento em dinheiro: R$ " + valor);
            System.out.println("Desconto de 5% aplicado");
        }
        
        @Override
        public double calcularTotal(double valor) {
            return valor * 0.95;
        }
    },
    CARTAO_CREDITO {
        @Override
        public void processar(double valor) {
            System.out.println("Processando pagamento no cartão: R$ " + valor);
            System.out.println("Taxa de 3% aplicada");
        }
        
        @Override
        public double calcularTotal(double valor) {
            return valor * 1.03;
        }
    },
    PIX {
        @Override
        public void processar(double valor) {
            System.out.println("Processando PIX: R$ " + valor);
            System.out.println("Sem taxas");
        }
        
        @Override
        public double calcularTotal(double valor) {
            return valor;
        }
    };
    
    public abstract void processar(double valor);
    public abstract double calcularTotal(double valor);
}

// ✅ Usar estratégia
public class Caixa {
    public void finalizarCompra(double valor, EstrategiaPagamento estrategia) {
        estrategia.processar(valor);
        double total = estrategia.calcularTotal(valor);
        System.out.println("Total: R$ " + total);
    }
}

// Uso
Caixa caixa = new Caixa();
caixa.finalizarCompra(100.0, EstrategiaPagamento.PIX);
```

### 2. Strategy de Validação

```java
public enum EstrategiaValidacao {
    EMAIL {
        @Override
        public boolean validar(String valor) {
            return valor != null && valor.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        }
        
        @Override
        public String getMensagemErro() {
            return "Email inválido. Use formato: nome@dominio.com";
        }
    },
    SENHA_FORTE {
        @Override
        public boolean validar(String valor) {
            if (valor == null || valor.length() < 8) return false;
            boolean temMaiuscula = valor.matches(".*[A-Z].*");
            boolean temMinuscula = valor.matches(".*[a-z].*");
            boolean temNumero = valor.matches(".*\\d.*");
            return temMaiuscula && temMinuscula && temNumero;
        }
        
        @Override
        public String getMensagemErro() {
            return "Senha deve ter: 8+ caracteres, maiúscula, minúscula e número";
        }
    },
    CPF {
        @Override
        public boolean validar(String valor) {
            return valor != null && valor.matches("\\d{11}");
        }
        
        @Override
        public String getMensagemErro() {
            return "CPF deve conter exatamente 11 dígitos";
        }
    };
    
    public abstract boolean validar(String valor);
    public abstract String getMensagemErro();
}

// ✅ Validador genérico
public class Validador {
    public void validarCampo(String campo, String valor, EstrategiaValidacao estrategia) {
        if (!estrategia.validar(valor)) {
            throw new IllegalArgumentException(
                campo + ": " + estrategia.getMensagemErro()
            );
        }
    }
}

// Uso
Validador validador = new Validador();
validador.validarCampo("Email", "user@email.com", EstrategiaValidacao.EMAIL);
validador.validarCampo("Senha", "Senha123", EstrategiaValidacao.SENHA_FORTE);
```

### 3. Strategy de Cálculo

```java
public enum EstrategiaCalculoFrete {
    SEDEX {
        @Override
        public double calcular(double peso, double distancia) {
            return peso * 2.0 + distancia * 0.5;
        }
        
        @Override
        public int getPrazoEntrega() {
            return 2; // dias
        }
    },
    PAC {
        @Override
        public double calcular(double peso, double distancia) {
            return peso * 1.0 + distancia * 0.3;
        }
        
        @Override
        public int getPrazoEntrega() {
            return 7; // dias
        }
    },
    EXPRESSO {
        @Override
        public double calcular(double peso, double distancia) {
            return peso * 3.0 + distancia * 1.0;
        }
        
        @Override
        public int getPrazoEntrega() {
            return 1; // dia
        }
    };
    
    public abstract double calcular(double peso, double distancia);
    public abstract int getPrazoEntrega();
}

// ✅ Calcular frete
public class CalculadoraFrete {
    public double calcularFrete(double peso, double distancia, 
                                EstrategiaCalculoFrete estrategia) {
        double valor = estrategia.calcular(peso, distancia);
        int prazo = estrategia.getPrazoEntrega();
        System.out.println("Prazo: " + prazo + " dias");
        return valor;
    }
}

// Uso
CalculadoraFrete calc = new CalculadoraFrete();
double frete = calc.calcularFrete(5.0, 100.0, EstrategiaCalculoFrete.SEDEX);
```

### 4. Strategy de Formatação

```java
public enum EstrategiaFormatacao {
    JSON {
        @Override
        public String formatar(Map<String, Object> dados) {
            return "{ " + dados.entrySet().stream()
                .map(e -> "\"" + e.getKey() + "\": \"" + e.getValue() + "\"")
                .collect(Collectors.joining(", ")) + " }";
        }
    },
    XML {
        @Override
        public String formatar(Map<String, Object> dados) {
            return "<root>\n" + dados.entrySet().stream()
                .map(e -> "  <" + e.getKey() + ">" + e.getValue() + "</" + e.getKey() + ">")
                .collect(Collectors.joining("\n")) + "\n</root>";
        }
    },
    CSV {
        @Override
        public String formatar(Map<String, Object> dados) {
            return dados.keySet().stream().collect(Collectors.joining(",")) + "\n" +
                   dados.values().stream().map(Object::toString).collect(Collectors.joining(","));
        }
    };
    
    public abstract String formatar(Map<String, Object> dados);
}

// ✅ Exportar dados
public class Exportador {
    public void exportar(Map<String, Object> dados, EstrategiaFormatacao formato) {
        String resultado = formato.formatar(dados);
        System.out.println(resultado);
    }
}

// Uso
Map<String, Object> dados = Map.of("nome", "João", "idade", 30);
Exportador exportador = new Exportador();
exportador.exportar(dados, EstrategiaFormatacao.JSON);
// { "nome": "João", "idade": "30" }
```

### 5. Strategy de Compressão

```java
public enum EstrategiaCompressao {
    NENHUMA {
        @Override
        public byte[] comprimir(byte[] dados) {
            return dados; // Sem compressão
        }
        
        @Override
        public String getDescricao() {
            return "Sem compressão";
        }
    },
    ZIP {
        @Override
        public byte[] comprimir(byte[] dados) {
            // Lógica de compressão ZIP
            System.out.println("Comprimindo com ZIP...");
            return dados; // Simplificado
        }
        
        @Override
        public String getDescricao() {
            return "Compressão ZIP";
        }
    },
    GZIP {
        @Override
        public byte[] comprimir(byte[] dados) {
            // Lógica de compressão GZIP
            System.out.println("Comprimindo com GZIP...");
            return dados; // Simplificado
        }
        
        @Override
        public String getDescricao() {
            return "Compressão GZIP";
        }
    };
    
    public abstract byte[] comprimir(byte[] dados);
    public abstract String getDescricao();
}

// ✅ Compressor genérico
public class Compressor {
    public byte[] processar(byte[] dados, EstrategiaCompressao estrategia) {
        System.out.println("Usando: " + estrategia.getDescricao());
        return estrategia.comprimir(dados);
    }
}
```

### 6. Strategy de Ordenação

```java
public enum EstrategiaOrdenacao {
    NOME {
        @Override
        public int comparar(Produto p1, Produto p2) {
            return p1.getNome().compareTo(p2.getNome());
        }
    },
    PRECO_CRESCENTE {
        @Override
        public int comparar(Produto p1, Produto p2) {
            return Double.compare(p1.getPreco(), p2.getPreco());
        }
    },
    PRECO_DECRESCENTE {
        @Override
        public int comparar(Produto p1, Produto p2) {
            return Double.compare(p2.getPreco(), p1.getPreco());
        }
    };
    
    public abstract int comparar(Produto p1, Produto p2);
    
    public Comparator<Produto> getComparator() {
        return this::comparar;
    }
}

// ✅ Ordenar com estratégia
public class OrdenadorProdutos {
    public List<Produto> ordenar(List<Produto> produtos, EstrategiaOrdenacao estrategia) {
        return produtos.stream()
            .sorted(estrategia.getComparator())
            .collect(Collectors.toList());
    }
}

// Uso
List<Produto> produtos = Arrays.asList(
    new Produto("Notebook", 3000),
    new Produto("Mouse", 50),
    new Produto("Teclado", 200)
);

OrdenadorProdutos ordenador = new OrdenadorProdutos();
List<Produto> ordenados = ordenador.ordenar(produtos, EstrategiaOrdenacao.PRECO_CRESCENTE);
```

### 7. Strategy de Processamento

```java
public enum EstrategiaProcessamento {
    SINCRONO {
        @Override
        public void processar(Runnable tarefa) {
            System.out.println("Processamento síncrono");
            tarefa.run(); // Executa na thread atual
        }
    },
    ASSINCRONO {
        @Override
        public void processar(Runnable tarefa) {
            System.out.println("Processamento assíncrono");
            new Thread(tarefa).start(); // Nova thread
        }
    },
    AGENDADO {
        @Override
        public void processar(Runnable tarefa) {
            System.out.println("Processamento agendado (5 segundos)");
            ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
            executor.schedule(tarefa, 5, TimeUnit.SECONDS);
        }
    };
    
    public abstract void processar(Runnable tarefa);
}

// ✅ Executor genérico
public class Executor {
    public void executar(Runnable tarefa, EstrategiaProcessamento estrategia) {
        estrategia.processar(tarefa);
    }
}

// Uso
Executor executor = new Executor();
executor.executar(() -> System.out.println("Tarefa executada!"), 
                   EstrategiaProcessamento.ASSINCRONO);
```

### 8. Strategy de Cache

```java
public enum EstrategiaCache {
    LRU {
        @Override
        public <K, V> Map<K, V> criarCache(int capacidade) {
            return new LinkedHashMap<K, V>(capacidade, 0.75f, true) {
                protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                    return size() > capacidade;
                }
            };
        }
    },
    FIFO {
        @Override
        public <K, V> Map<K, V> criarCache(int capacidade) {
            return new LinkedHashMap<K, V>(capacidade, 0.75f, false) {
                protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                    return size() > capacidade;
                }
            };
        }
    },
    ILIMITADO {
        @Override
        public <K, V> Map<K, V> criarCache(int capacidade) {
            return new HashMap<>();
        }
    };
    
    public abstract <K, V> Map<K, V> criarCache(int capacidade);
}

// ✅ Gerenciador de cache
public class CacheManager<K, V> {
    private Map<K, V> cache;
    
    public CacheManager(int capacidade, EstrategiaCache estrategia) {
        this.cache = estrategia.criarCache(capacidade);
    }
}

// Uso
CacheManager<String, String> cache = new CacheManager<>(100, EstrategiaCache.LRU);
```

### 9. Strategy com Contexto

```java
public enum EstrategiaNotificacao {
    EMAIL {
        @Override
        public void enviar(Usuario usuario, String mensagem) {
            System.out.println("Enviando email para: " + usuario.getEmail());
            System.out.println("Mensagem: " + mensagem);
        }
    },
    SMS {
        @Override
        public void enviar(Usuario usuario, String mensagem) {
            System.out.println("Enviando SMS para: " + usuario.getTelefone());
            System.out.println("Mensagem: " + mensagem);
        }
    },
    PUSH {
        @Override
        public void enviar(Usuario usuario, String mensagem) {
            System.out.println("Enviando push para: " + usuario.getDeviceId());
            System.out.println("Mensagem: " + mensagem);
        }
    };
    
    public abstract void enviar(Usuario usuario, String mensagem);
}

// ✅ Contexto usa estratégia
public class NotificadorUsuario {
    private EstrategiaNotificacao estrategia;
    
    public NotificadorUsuario(EstrategiaNotificacao estrategia) {
        this.estrategia = estrategia;
    }
    
    public void setEstrategia(EstrategiaNotificacao estrategia) {
        this.estrategia = estrategia;
    }
    
    public void notificar(Usuario usuario, String mensagem) {
        estrategia.enviar(usuario, mensagem);
    }
}

// Uso
Usuario usuario = new Usuario("user@email.com", "11999999999", "device123");
NotificadorUsuario notificador = new NotificadorUsuario(EstrategiaNotificacao.EMAIL);
notificador.notificar(usuario, "Bem-vindo!");

// Mudar estratégia em runtime
notificador.setEstrategia(EstrategiaNotificacao.SMS);
notificador.notificar(usuario, "Código de verificação: 1234");
```

### 10. Strategy com Chain

```java
public enum EstrategiaLog {
    CONSOLE {
        @Override
        public void log(String mensagem, String nivel) {
            System.out.println("[" + nivel + "] " + mensagem);
        }
    },
    ARQUIVO {
        @Override
        public void log(String mensagem, String nivel) {
            // Escrever em arquivo
            System.out.println("Escrevendo em arquivo: [" + nivel + "] " + mensagem);
        }
    },
    REMOTO {
        @Override
        public void log(String mensagem, String nivel) {
            // Enviar para servidor remoto
            System.out.println("Enviando para servidor: [" + nivel + "] " + mensagem);
        }
    };
    
    public abstract void log(String mensagem, String nivel);
}

// ✅ Logger com múltiplas estratégias
public class Logger {
    private List<EstrategiaLog> estrategias;
    
    public Logger(EstrategiaLog... estrategias) {
        this.estrategias = Arrays.asList(estrategias);
    }
    
    public void info(String mensagem) {
        for (EstrategiaLog estrategia : estrategias) {
            estrategia.log(mensagem, "INFO");
        }
    }
    
    public void error(String mensagem) {
        for (EstrategiaLog estrategia : estrategias) {
            estrategia.log(mensagem, "ERROR");
        }
    }
}

// Uso: log em console E arquivo
Logger logger = new Logger(EstrategiaLog.CONSOLE, EstrategiaLog.ARQUIVO);
logger.info("Aplicação iniciada");
```

---

## Aplicabilidade

**Strategy Pattern com enum** quando:
- Múltiplos algoritmos para mesma tarefa
- Trocar estratégia em runtime
- Evitar `if-else` ou `switch` complexo
- Encapsular comportamento variável

**Vantagens**:
- Código limpo
- Fácil adicionar estratégia
- Tipo seguro
- Compilador valida

---

## Armadilhas

### 1. Muitas Estratégias

```java
// ⚠️ Muitas constantes (> 20) dificulta manutenção
public enum Estrategia {
    ESTRATEGIA_1, ESTRATEGIA_2, // ... ESTRATEGIA_50
}
```

### 2. Lógica Muito Complexa

```java
// ⚠️ Implementação muito grande (mover para classe)
COMPLEXA {
    @Override
    public void processar() {
        // 200 linhas de código ⚠️
    }
};
```

### 3. Estratégia Dinâmica

```java
// ⚠️ Se estratégias vêm de banco, não usar enum
// ✅ Usar classe ou interface
```

---

## Boas Práticas

### 1. Cada Constante = Estratégia

```java
ESTRATEGIA_A {
    @Override
    public void executar() {
        // Algoritmo A
    }
},
```

### 2. Trocar em Runtime

```java
contexto.setEstrategia(EstrategiaNotificacao.SMS);
```

### 3. Documentar Estratégia

```java
/**
 * Aplica desconto de 20% para clientes VIP.
 */
CLIENTE_VIP { }
```

### 4. Combinar Estratégias

```java
List<Estrategia> estrategias = Arrays.asList(
    Estrategia.A, Estrategia.B
);
```

---

## Resumo

**Strategy Pattern com enum**:

```java
public enum EstrategiaDesconto {
    NENHUM {
        @Override
        public double aplicar(double valor) {
            return valor;
        }
    },
    CLIENTE_VIP {
        @Override
        public double aplicar(double valor) {
            return valor * 0.80; // 20% desconto
        }
    };
    
    public abstract double aplicar(double valor);
}

// ✅ Contexto usa estratégia
public class Pedido {
    private EstrategiaDesconto desconto;
    
    public void setDesconto(EstrategiaDesconto desconto) {
        this.desconto = desconto;
    }
    
    public double calcularTotal(double valor) {
        return desconto.aplicar(valor);
    }
}

// Uso
Pedido pedido = new Pedido();
pedido.setDesconto(EstrategiaDesconto.CLIENTE_VIP);
double total = pedido.calcularTotal(100); // 80.0
```

**Regra de Ouro**: **Enum** implementa Strategy Pattern naturalmente. Cada constante = **estratégia diferente**. **Trocar** estratégia em runtime. Mais **limpo** que `if-else`. **Tipo seguro**. Ideal para múltiplos **algoritmos** intercambiáveis.
