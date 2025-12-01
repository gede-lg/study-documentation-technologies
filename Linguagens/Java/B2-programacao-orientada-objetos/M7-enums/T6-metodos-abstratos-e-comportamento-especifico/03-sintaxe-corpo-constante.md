# T6.03 - Sintaxe: CONSTANTE { Implementação }

## Introdução

**Corpo da constante**: sintaxe para implementar métodos abstratos.

```java
public enum Operacao {
    SOMA {  // ← Abre chave após constante
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },  // ← Vírgula após fechar chave
    SUBTRACAO {
        @Override
        public double calcular(double a, double b) {
            return a - b;
        }
    };  // ← Ponto-e-vírgula após última constante
    
    public abstract double calcular(double a, double b);
}

// ✅ Sintaxe:
// CONSTANTE { implementações }
```

**Chaves** após constante = corpo de classe anônima.

---

## Fundamentos

### 1. Sintaxe Básica

```java
public enum Status {
    ATIVO {
        @Override
        public boolean isAtivo() {
            return true;
        }
    },
    INATIVO {
        @Override
        public boolean isAtivo() {
            return false;
        }
    };
    
    public abstract boolean isAtivo();
}

// Sintaxe:
// CONSTANTE {
//     @Override
//     public TipoRetorno metodo() {
//         // implementação
//     }
// },
```

### 2. Constante sem Parâmetros

```java
public enum DiaSemana {
    SEGUNDA {  // Sem parênteses
        @Override
        public boolean isUtil() {
            return true;
        }
    },
    DOMINGO {
        @Override
        public boolean isUtil() {
            return false;
        }
    };
    
    public abstract boolean isUtil();
}
```

### 3. Constante com Parâmetros

```java
public enum Prioridade {
    BAIXA(1) {  // Com parênteses e chaves
        @Override
        public String getDescricao() {
            return "Prioridade baixa";
        }
    },
    ALTA(5) {
        @Override
        public String getDescricao() {
            return "Prioridade alta";
        }
    };
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() {
        return nivel;
    }
    
    public abstract String getDescricao();
}

// Sintaxe:
// CONSTANTE(argumentos) {
//     @Override
//     public TipoRetorno metodo() { }
// }
```

### 4. Múltiplos Métodos

```java
public enum TipoArquivo {
    TEXTO {
        @Override
        public String getExtensao() {
            return ".txt";
        }
        
        @Override
        public String getMimeType() {
            return "text/plain";
        }
        
        @Override
        public boolean isEditavel() {
            return true;
        }
    },
    IMAGEM {
        @Override
        public String getExtensao() {
            return ".jpg";
        }
        
        @Override
        public String getMimeType() {
            return "image/jpeg";
        }
        
        @Override
        public boolean isEditavel() {
            return false;
        }
    };
    
    public abstract String getExtensao();
    public abstract String getMimeType();
    public abstract boolean isEditavel();
}
```

### 5. Vírgula e Ponto-e-Vírgula

```java
public enum Status {
    NOVO {
        @Override
        public void processar() {
            System.out.println("Processando novo");
        }
    },  // ← Vírgula entre constantes
    
    APROVADO {
        @Override
        public void processar() {
            System.out.println("Processando aprovado");
        }
    },  // ← Vírgula
    
    FINALIZADO {
        @Override
        public void processar() {
            System.out.println("Processando finalizado");
        }
    };  // ← Ponto-e-vírgula após última constante
    
    public abstract void processar();
}
```

### 6. Métodos Auxiliares Privados

```java
public enum Conversor {
    CELSIUS_PARA_FAHRENHEIT {
        @Override
        public double converter(double valor) {
            return celsiusParaFahrenheit(valor);
        }
        
        // ✅ Método privado dentro do corpo da constante
        private double celsiusParaFahrenheit(double celsius) {
            return (celsius * 9/5) + 32;
        }
    },
    FAHRENHEIT_PARA_CELSIUS {
        @Override
        public double converter(double valor) {
            return fahrenheitParaCelsius(valor);
        }
        
        private double fahrenheitParaCelsius(double fahrenheit) {
            return (fahrenheit - 32) * 5/9;
        }
    };
    
    public abstract double converter(double valor);
}

// ✅ Cada constante pode ter métodos auxiliares privados
```

### 7. Variáveis Locais

```java
public enum Calculadora {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            // ✅ Variáveis locais dentro da implementação
            double resultado = a + b;
            System.out.println("Soma: " + resultado);
            return resultado;
        }
    },
    MEDIA {
        @Override
        public double calcular(double a, double b) {
            double soma = a + b;
            double media = soma / 2;
            return media;
        }
    };
    
    public abstract double calcular(double a, double b);
}
```

### 8. Blocos de Código

```java
public enum Validador {
    CPF {
        @Override
        public boolean validar(String documento) {
            if (documento == null || documento.length() != 11) {
                return false;
            }
            
            // Lógica de validação CPF
            int soma = 0;
            for (int i = 0; i < 9; i++) {
                soma += Character.getNumericValue(documento.charAt(i)) * (10 - i);
            }
            
            int primeiroDigito = 11 - (soma % 11);
            if (primeiroDigito >= 10) primeiroDigito = 0;
            
            // Validar primeiro dígito
            if (Character.getNumericValue(documento.charAt(9)) != primeiroDigito) {
                return false;
            }
            
            return true;
        }
    },
    CNPJ {
        @Override
        public boolean validar(String documento) {
            if (documento == null || documento.length() != 14) {
                return false;
            }
            // Lógica de validação CNPJ
            return true;
        }
    };
    
    public abstract boolean validar(String documento);
}
```

### 9. Exceções no Corpo

```java
public enum Operacao {
    DIVISAO {
        @Override
        public double calcular(double a, double b) {
            if (b == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            return a / b;
        }
    },
    RAIZ_QUADRADA {
        @Override
        public double calcular(double a, double b) {
            if (a < 0) {
                throw new IllegalArgumentException("Raiz de número negativo");
            }
            return Math.sqrt(a);
        }
    };
    
    public abstract double calcular(double a, double b);
}
```

### 10. Formatação e Indentação

```java
// ✅ Formatação clara
public enum Status {
    ATIVO {
        @Override
        public boolean isAtivo() {
            return true;
        }
        
        @Override
        public String getDescricao() {
            return "Status ativo";
        }
    },
    
    INATIVO {
        @Override
        public boolean isAtivo() {
            return false;
        }
        
        @Override
        public String getDescricao() {
            return "Status inativo";
        }
    };
    
    public abstract boolean isAtivo();
    public abstract String getDescricao();
}

// ❌ Formatação confusa (evitar)
public enum Status {
    ATIVO { @Override public boolean isAtivo() { return true; } },
    INATIVO { @Override public boolean isAtivo() { return false; } };
    public abstract boolean isAtivo();
}
```

---

## Aplicabilidade

**Corpo da constante** para:
- Implementar métodos abstratos
- Sobrescrever métodos concretos
- Adicionar métodos auxiliares privados
- Lógica específica por constante

**Sintaxe**:
- `CONSTANTE { implementação }`
- Vírgula entre constantes
- Ponto-e-vírgula após última

---

## Armadilhas

### 1. Esquecer Vírgula

```java
public enum Status {
    ATIVO {
        @Override
        public boolean isAtivo() { return true; }
    }  // ❌ Faltou vírgula
    INATIVO {
        @Override
        public boolean isAtivo() { return false; }
    };
}
// ❌ Erro de compilação
```

### 2. Ponto-e-Vírgula Errado

```java
public enum Status {
    ATIVO {
        @Override
        public boolean isAtivo() { return true; }
    },  // ← Vírgula OK
    INATIVO {
        @Override
        public boolean isAtivo() { return false; }
    },  // ❌ Deveria ser ponto-e-vírgula
    
    public abstract boolean isAtivo();
}
```

### 3. Misturar Sintaxes

```java
public enum Status {
    ATIVO,  // ❌ Sem corpo
    INATIVO {
        @Override
        public boolean isAtivo() { return false; }
    };  // ❌ Outras constantes também devem ter corpo
    
    public abstract boolean isAtivo();
}
```

---

## Boas Práticas

### 1. Formatação Consistente

```java
// ✅ Cada implementação em múltiplas linhas
CONSTANTE {
    @Override
    public TipoRetorno metodo() {
        return valor;
    }
},
```

### 2. Quebra de Linha

```java
// ✅ Quebrar linha após nome da constante
CONSTANTE_COM_NOME_LONGO {
    @Override
    public void metodo() {
        // implementação
    }
},
```

### 3. Agrupar Constantes

```java
// ✅ Agrupar constantes relacionadas
public enum DiaSemana {
    // Dias úteis
    SEGUNDA { /* ... */ },
    TERCA { /* ... */ },
    QUARTA { /* ... */ },
    QUINTA { /* ... */ },
    SEXTA { /* ... */ },
    
    // Fim de semana
    SABADO { /* ... */ },
    DOMINGO { /* ... */ };
    
    public abstract boolean isUtil();
}
```

### 4. Comentar Complexidade

```java
COMPLEXA {
    @Override
    public double calcular(double valor) {
        // Aplicar fórmula complexa:
        // resultado = (valor * 1.5) + (valor / 2) - 10
        double parte1 = valor * 1.5;
        double parte2 = valor / 2;
        return parte1 + parte2 - 10;
    }
},
```

---

## Resumo

**Sintaxe do corpo da constante**:

```java
public enum Operacao {
    SOMA {  // ← Abre chave
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },  // ← Fecha chave + vírgula
    
    SUBTRACAO {
        @Override
        public double calcular(double a, double b) {
            return a - b;
        }
    };  // ← Fecha chave + ponto-e-vírgula (última)
    
    public abstract double calcular(double a, double b);
}

// Com parâmetros:
CONSTANTE(argumentos) {
    @Override
    public TipoRetorno metodo() {
        return valor;
    }
},
```

**Regras**:
- Abrir `{` após nome da constante
- Implementar métodos abstratos com `@Override`
- Vírgula `,` entre constantes
- Ponto-e-vírgula `;` após última constante
- Pode ter métodos auxiliares privados
- Pode ter variáveis locais
- Formatar com quebras de linha

**Regra de Ouro**: **CONSTANTE { implementação }** é corpo de classe anônima. Vírgula entre constantes, ponto-e-vírgula após última. Formatar com **quebras de linha** para legibilidade. Cada constante é uma **subclasse** do enum.
