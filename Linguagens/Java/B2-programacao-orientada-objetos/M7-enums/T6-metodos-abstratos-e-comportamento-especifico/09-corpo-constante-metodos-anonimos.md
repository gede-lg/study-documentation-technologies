# T6.09 - Corpo da Constante com Métodos Anônimos

## Introdução

**Corpo da constante**: similar a **classe anônima**.

```java
public enum Operacao {
    SOMA {
        // Corpo = classe anônima
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
        
        // Método adicional (não abstrato)
        private double validar(double valor) {
            return Math.abs(valor);
        }
    };
    
    public abstract double calcular(double a, double b);
}

// ✅ Cada constante = subclasse anônima do enum
// Similar a: new Operacao() { ... }
```

**Constante com corpo** = **classe anônima** que estende o enum.

---

## Fundamentos

### 1. Anatomia do Corpo

```java
public enum Status {
    ATIVO {  // ← Nome da constante
        // ↓ Corpo = classe anônima
        @Override
        public boolean podeEditar() {
            return true;
        }
        
        // Método privado (só desta constante)
        private void log() {
            System.out.println("Status ativo");
        }
    },  // ← Vírgula
    
    INATIVO {
        @Override
        public boolean podeEditar() {
            return false;
        }
    };  // ← Ponto-e-vírgula
    
    public abstract boolean podeEditar();
}

// ✅ Equivalente conceitual:
// ATIVO = new Status() {
//     @Override
//     public boolean podeEditar() { return true; }
// };
```

### 2. Métodos Privados na Constante

```java
public enum Calculadora {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            double resultadoA = validarEntrada(a);
            double resultadoB = validarEntrada(b);
            return resultadoA + resultadoB;
        }
        
        // ✅ Método privado: só SOMA tem acesso
        private double validarEntrada(double valor) {
            if (Double.isNaN(valor)) {
                throw new IllegalArgumentException("Valor inválido");
            }
            return valor;
        }
    },
    
    MULTIPLICACAO {
        @Override
        public double calcular(double a, double b) {
            return a * b;
        }
        
        // ✅ Método privado diferente
        private void logResultado(double resultado) {
            System.out.println("Resultado: " + resultado);
        }
    };
    
    public abstract double calcular(double a, double b);
}

// ✅ Cada constante pode ter métodos auxiliares próprios
```

### 3. Variáveis Locais

```java
public enum Conversor {
    CELSIUS_FAHRENHEIT {
        @Override
        public double converter(double valor) {
            // ✅ Variáveis locais dentro da implementação
            double multiplicador = 9.0 / 5.0;
            double adicao = 32;
            return (valor * multiplicador) + adicao;
        }
    },
    
    FAHRENHEIT_CELSIUS {
        @Override
        public double converter(double valor) {
            double subtracao = 32;
            double multiplicador = 5.0 / 9.0;
            return (valor - subtracao) * multiplicador;
        }
    };
    
    public abstract double converter(double valor);
}
```

### 4. Blocos de Inicialização

```java
public enum Cache {
    INSTANCIA {
        // ✅ Bloco de inicialização
        {
            System.out.println("Inicializando cache");
            cache.put("key1", "value1");
            cache.put("key2", "value2");
        }
        
        private Map<String, String> cache = new HashMap<>();
        
        @Override
        public String get(String key) {
            return cache.get(key);
        }
        
        @Override
        public void put(String key, String value) {
            cache.put(key, value);
        }
    };
    
    public abstract String get(String key);
    public abstract void put(String key, String value);
}

// ✅ Bloco executado na criação da constante
```

### 5. Atributos de Instância na Constante

```java
public enum ProcessadorArquivo {
    CSV {
        // ✅ Atributo privado da constante
        private final String separador = ";";
        
        @Override
        public void processar(String linha) {
            String[] partes = linha.split(separador);
            System.out.println("Processando CSV: " + partes.length + " campos");
        }
        
        private String getSeparador() {
            return separador;
        }
    },
    
    JSON {
        private final boolean formatado = true;
        
        @Override
        public void processar(String linha) {
            if (formatado) {
                System.out.println("Processando JSON formatado");
            } else {
                System.out.println("Processando JSON compacto");
            }
        }
    };
    
    public abstract void processar(String linha);
}

// ✅ Cada constante pode ter atributos próprios
```

### 6. Múltiplos Métodos Auxiliares

```java
public enum Validador {
    EMAIL {
        @Override
        public boolean validar(String valor) {
            return temArroba(valor) && temDominio(valor) && naoTemEspacos(valor);
        }
        
        // Métodos auxiliares privados
        private boolean temArroba(String email) {
            return email.contains("@");
        }
        
        private boolean temDominio(String email) {
            int posArroba = email.indexOf("@");
            return posArroba > 0 && posArroba < email.length() - 1;
        }
        
        private boolean naoTemEspacos(String email) {
            return !email.contains(" ");
        }
    },
    
    CPF {
        @Override
        public boolean validar(String valor) {
            return temTamanhoCorreto(valor) && somenteNumeros(valor);
        }
        
        private boolean temTamanhoCorreto(String cpf) {
            return cpf.length() == 11;
        }
        
        private boolean somenteNumeros(String cpf) {
            return cpf.matches("\\d{11}");
        }
    };
    
    public abstract boolean validar(String valor);
}
```

### 7. Exceções Locais

```java
public enum Operacao {
    DIVISAO {
        @Override
        public double calcular(double a, double b) {
            validarDivisor(b);
            return a / b;
        }
        
        // Método auxiliar que lança exceção
        private void validarDivisor(double divisor) {
            if (divisor == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            if (Double.isInfinite(divisor) || Double.isNaN(divisor)) {
                throw new IllegalArgumentException("Divisor inválido");
            }
        }
    },
    
    RAIZ_QUADRADA {
        @Override
        public double calcular(double a, double b) {
            validarPositivo(a);
            return Math.sqrt(a);
        }
        
        private void validarPositivo(double valor) {
            if (valor < 0) {
                throw new IllegalArgumentException("Valor deve ser não-negativo");
            }
        }
    };
    
    public abstract double calcular(double a, double b);
}
```

### 8. Lambda e Functional Interfaces

```java
public enum TipoProcessamento {
    SINCRONO {
        @Override
        public void processar(List<String> itens) {
            // ✅ Lambda dentro da constante
            itens.forEach(item -> processarItem(item));
        }
        
        private void processarItem(String item) {
            System.out.println("Processando: " + item);
        }
    },
    
    ASSINCRONO {
        @Override
        public void processar(List<String> itens) {
            // Lambda com CompletableFuture
            itens.stream()
                 .map(item -> CompletableFuture.runAsync(() -> processarAsync(item)))
                 .forEach(CompletableFuture::join);
        }
        
        private void processarAsync(String item) {
            System.out.println("Processando async: " + item);
        }
    };
    
    public abstract void processar(List<String> itens);
}
```

### 9. Try-Catch Local

```java
public enum ConversorArquivo {
    JSON {
        @Override
        public String converter(String arquivo) {
            try {
                return lerArquivo(arquivo);
            } catch (IOException e) {
                return handleErro(e);
            }
        }
        
        private String lerArquivo(String arquivo) throws IOException {
            // Lógica de leitura
            return "conteudo";
        }
        
        private String handleErro(IOException e) {
            System.err.println("Erro ao ler JSON: " + e.getMessage());
            return "{}";
        }
    },
    
    XML {
        @Override
        public String converter(String arquivo) {
            try {
                return lerXml(arquivo);
            } catch (Exception e) {
                logErro(e);
                return "<root/>";
            }
        }
        
        private String lerXml(String arquivo) throws Exception {
            return "<root></root>";
        }
        
        private void logErro(Exception e) {
            System.err.println("Erro XML: " + e);
        }
    };
    
    public abstract String converter(String arquivo);
}
```

### 10. Complexidade Controlada

```java
public enum EstrategiaCache {
    LRU {
        // Atributo
        private final int capacidadeMaxima = 100;
        private final LinkedHashMap<String, String> cache = 
            new LinkedHashMap<>(capacidadeMaxima, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(Map.Entry<String, String> eldest) {
                    return size() > capacidadeMaxima;
                }
            };
        
        // Bloco de inicialização
        {
            System.out.println("Inicializando cache LRU");
        }
        
        @Override
        public void put(String key, String value) {
            validarChave(key);
            cache.put(key, value);
            logOperacao("PUT", key);
        }
        
        @Override
        public String get(String key) {
            String valor = cache.get(key);
            if (valor != null) {
                logOperacao("HIT", key);
            } else {
                logOperacao("MISS", key);
            }
            return valor;
        }
        
        // Métodos auxiliares
        private void validarChave(String key) {
            if (key == null || key.isEmpty()) {
                throw new IllegalArgumentException("Chave inválida");
            }
        }
        
        private void logOperacao(String tipo, String key) {
            System.out.println("[" + tipo + "] " + key);
        }
    };
    
    public abstract void put(String key, String value);
    public abstract String get(String key);
}
```

---

## Aplicabilidade

**Corpo da constante** para:
- Implementar métodos abstratos
- Adicionar métodos auxiliares privados
- Variáveis locais
- Blocos de inicialização
- Lógica específica da constante

**Similar a**:
- Classe anônima
- Subclasse do enum

---

## Armadilhas

### 1. Muita Complexidade

```java
// ⚠️ Corpo muito grande (> 50 linhas)
CONSTANTE {
    @Override
    public void metodo() {
        // 100 linhas de código ⚠️
    }
    
    private void aux1() { }
    private void aux2() { }
    // ... muitos métodos
};

// ✅ Extrair para classe separada se muito complexo
```

### 2. Métodos Públicos Não-Abstratos

```java
// ⚠️ Método público só em uma constante
CONSTANTE {
    public void metodoEspecifico() { } // ⚠️ Outros não têm
};

// ✅ Usar método abstrato se outras constantes precisam
```

### 3. Estado Mutável

```java
// ⚠️ Atributo mutável em constante
CONSTANTE {
    private int contador = 0; // ⚠️ Mutável
    
    @Override
    public void incrementar() {
        contador++; // ⚠️ Estado compartilhado
    }
};

// ✅ Usar final ou gerenciar com cuidado
```

---

## Boas Práticas

### 1. Métodos Privados para Auxiliares

```java
CONSTANTE {
    @Override
    public void metodo() {
        auxiliar(); // ✅ Chamar auxiliar privado
    }
    
    private void auxiliar() {
        // lógica auxiliar
    }
};
```

### 2. Variáveis Locais

```java
CONSTANTE {
    @Override
    public double calcular() {
        double resultado = 0;
        // cálculo
        return resultado;
    }
};
```

### 3. Documentar Lógica Complexa

```java
/**
 * Calcula desconto progressivo.
 */
CONSTANTE {
    @Override
    public double calcular() {
        // lógica complexa documentada
    }
};
```

### 4. Manter Simplicidade

```java
// ✅ Simples e direto
CONSTANTE {
    @Override
    public String get() {
        return "valor";
    }
};
```

---

## Resumo

**Corpo da constante = classe anônima**:

```java
public enum Operacao {
    SOMA {  // ← Corpo = classe anônima
        // Método abstrato obrigatório
        @Override
        public double calcular(double a, double b) {
            return validar(a) + validar(b);
        }
        
        // ✅ Método privado auxiliar
        private double validar(double valor) {
            if (Double.isNaN(valor)) {
                throw new IllegalArgumentException("Valor inválido");
            }
            return valor;
        }
        
        // ✅ Variáveis locais OK
        // ✅ Try-catch OK
        // ✅ Lambdas OK
    };
    
    public abstract double calcular(double a, double b);
}
```

**Características**:
- Similar a **classe anônima**
- Pode ter **métodos privados**
- Pode ter **atributos privados**
- Pode ter **blocos de inicialização**
- Pode usar **lambdas**, **try-catch**, etc.
- **Escopo** limitado à constante

**Regra de Ouro**: **Corpo da constante** = **subclasse anônima** do enum. Use para implementar métodos abstratos e adicionar **métodos auxiliares privados**. Mantenha **simplicidade**. Se muito complexo (> 50 linhas), considere **classe separada**. **Métodos privados** só visíveis na própria constante.
