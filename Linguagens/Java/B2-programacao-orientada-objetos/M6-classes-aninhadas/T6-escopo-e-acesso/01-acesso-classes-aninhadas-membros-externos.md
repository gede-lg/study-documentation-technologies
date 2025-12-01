# T6.01 - Acesso de Classes Aninhadas a Membros da Classe Externa

## Introdução

**Classes aninhadas**: podem acessar membros da classe externa.

```java
public class Externa {
    private int valor = 10;
    
    class Interna {
        void mostrar() {
            System.out.println(valor); // Acessa private da externa
        }
    }
}
```

**Acesso**: depende do tipo de classe aninhada.

---

## Fundamentos

### 1. Inner Class - Acessa Membros Private

**Inner class**: acessa todos os membros (public, protected, private).

```java
public class Pessoa {
    private String nome = "João";
    private int idade = 30;
    
    class Detalhes {
        void exibir() {
            System.out.println("Nome: " + nome);   // private OK
            System.out.println("Idade: " + idade); // private OK
        }
    }
}

Pessoa p = new Pessoa();
Pessoa.Detalhes det = p.new Detalhes();
det.exibir();
// Nome: João
// Idade: 30
```

### 2. Inner Class - Acessa Métodos Private

**Métodos private**: inner class acessa.

```java
public class Calculadora {
    private int somar(int a, int b) {
        return a + b;
    }
    
    class Operacao {
        void executar() {
            int resultado = somar(10, 5); // Chama private
            System.out.println("Resultado: " + resultado);
        }
    }
}

Calculadora calc = new Calculadora();
Calculadora.Operacao op = calc.new Operacao();
op.executar(); // Resultado: 15
```

### 3. Static Nested Class - NÃO Acessa Membros de Instância

**Static nested**: acessa apenas membros **static** da externa.

```java
public class Externa {
    private int valorInstancia = 10;
    private static int valorStatic = 20;
    
    static class Aninhada {
        void mostrar() {
            // ❌ ERRO: não acessa membro de instância
            // System.out.println(valorInstancia);
            
            // ✅ OK: acessa membro static
            System.out.println(valorStatic); // 20
        }
    }
}

Externa.Aninhada an = new Externa.Aninhada();
an.mostrar(); // 20
```

### 4. Static Nested Class - Acessa Static Private

**Static private**: static nested acessa.

```java
public class Config {
    private static String chave = "ABC123";
    
    static class Validador {
        boolean validar(String entrada) {
            return entrada.equals(chave); // Acessa private static
        }
    }
}

Config.Validador val = new Config.Validador();
System.out.println(val.validar("ABC123")); // true
System.out.println(val.validar("XYZ"));    // false
```

### 5. Local Class - Acessa Membros da Classe Externa

**Local class**: acessa membros da classe que a contém.

```java
public class Processador {
    private String prefixo = "[LOG] ";
    
    void processar() {
        class Logger {
            void log(String msg) {
                System.out.println(prefixo + msg); // Acessa private
            }
        }
        
        Logger logger = new Logger();
        logger.log("Processando");
    }
}

Processador proc = new Processador();
proc.processar(); // [LOG] Processando
```

### 6. Local Class - Acessa Variáveis Locais Efetivamente Final

**Variáveis locais**: devem ser efetivamente final.

```java
public void processar() {
    final String prefixo = ">> "; // final
    int contador = 0;             // efetivamente final (não modificado)
    
    class Helper {
        void exibir() {
            System.out.println(prefixo + contador);
        }
    }
    
    Helper h = new Helper();
    h.exibir(); // >> 0
    
    // contador++; // ❌ Se descomentar, erro: não é mais efetivamente final
}
```

### 7. Anonymous Class - Acessa Membros da Classe Externa

**Anonymous class**: acessa membros da classe externa.

```java
public class Botao {
    private int cliques = 0;
    
    public Runnable criarListener() {
        return new Runnable() {
            @Override
            public void run() {
                cliques++; // Acessa private da externa
                System.out.println("Cliques: " + cliques);
            }
        };
    }
}

Botao btn = new Botao();
Runnable listener = btn.criarListener();
listener.run(); // Cliques: 1
listener.run(); // Cliques: 2
```

### 8. Inner Class - Referência Implícita à Externa

**this**: referência implícita.

```java
public class Externa {
    private int valor = 100;
    
    class Interna {
        void mostrar() {
            System.out.println(valor);              // Implícito
            System.out.println(this.getClass());    // Interna
            System.out.println(Externa.this.valor); // Explícito
        }
    }
}

Externa ext = new Externa();
Externa.Interna int = ext.new Interna();
int.mostrar();
// 100
// class Externa$Interna
// 100
```

### 9. Acesso a Membros Herdados

**Herança**: inner class acessa membros herdados.

```java
class Base {
    protected int valorBase = 50;
}

public class Derivada extends Base {
    private int valorDerivada = 100;
    
    class Interna {
        void mostrar() {
            System.out.println("Base: " + valorBase);         // Herdado
            System.out.println("Derivada: " + valorDerivada); // Próprio
        }
    }
}

Derivada d = new Derivada();
Derivada.Interna i = d.new Interna();
i.mostrar();
// Base: 50
// Derivada: 100
```

### 10. Múltiplas Classes Aninhadas

**Múltiplas**: cada uma acessa a externa.

```java
public class Pessoa {
    private String nome = "João";
    private int idade = 30;
    
    class Detalhes {
        void exibirNome() {
            System.out.println(nome); // Acessa nome
        }
    }
    
    class Info {
        void exibirIdade() {
            System.out.println(idade); // Acessa idade
        }
    }
}

Pessoa p = new Pessoa();
Pessoa.Detalhes det = p.new Detalhes();
Pessoa.Info info = p.new Info();

det.exibirNome();  // João
info.exibirIdade(); // 30
```

---

## Aplicabilidade

**Inner class**: acessa todos os membros (private, protected, public).  
**Static nested**: acessa apenas membros static.  
**Local class**: acessa membros da classe + variáveis locais efetivamente final.  
**Anonymous class**: acessa membros da classe + variáveis locais efetivamente final.

---

## Armadilhas

### 1. Static Nested Tentar Acessar Instância

```java
public class Externa {
    private int valor = 10;
    
    static class Aninhada {
        void mostrar() {
            // ❌ ERRO: static nested não acessa membro de instância
            // System.out.println(valor);
        }
    }
}
```

### 2. Modificar Variável Local em Local/Anonymous Class

```java
public void processar() {
    int contador = 0;
    
    class Helper {
        void incrementar() {
            // ❌ ERRO: contador não é efetivamente final
            // contador++;
        }
    }
}
```

### 3. Confundir this

```java
public class Externa {
    private int valor = 10;
    
    class Interna {
        private int valor = 20;
        
        void mostrar() {
            System.out.println(this.valor);         // 20 (Interna)
            System.out.println(Externa.this.valor); // 10 (Externa)
        }
    }
}
```

---

## Boas Práticas

### 1. Inner Class para Acesso Completo

```java
// ✅ Inner class quando precisa acessar membros de instância
public class Lista {
    private Node primeiro;
    
    class Iterator {
        void iterar() {
            Node atual = primeiro; // Acessa private
            // ...
        }
    }
}
```

### 2. Static Nested para Independência

```java
// ✅ Static nested quando NÃO precisa acessar instância
public class Config {
    private static String chave = "ABC";
    
    static class Validador {
        boolean validar(String s) {
            return s.equals(chave); // Acessa static
        }
    }
}
```

### 3. Usar Externa.this para Clareza

```java
// ✅ Externa.this para acesso explícito
public class Externa {
    private int valor = 10;
    
    class Interna {
        void mostrar() {
            System.out.println(Externa.this.valor); // Explícito
        }
    }
}
```

### 4. Final Explícito em Variáveis Locais

```java
// ✅ final explícito
public void processar() {
    final String prefixo = ">> ";
    
    class Helper {
        void exibir() {
            System.out.println(prefixo);
        }
    }
}
```

---

## Resumo

**Acesso de classes aninhadas a membros da classe externa**:

| Tipo | Acessa Instância | Acessa Static | Acessa Private |
|------|------------------|---------------|----------------|
| Inner class | ✅ | ✅ | ✅ |
| Static nested | ❌ | ✅ | ✅ (static) |
| Local class | ✅ | ✅ | ✅ |
| Anonymous class | ✅ | ✅ | ✅ |

**Inner class**:
- Acessa TODOS os membros (private, protected, public)
- Acessa membros de instância e static
- Referência implícita à externa

**Static nested**:
- Acessa APENAS membros static
- NÃO acessa membros de instância
- Sem referência à instância externa

**Local/Anonymous class**:
- Acessa membros da classe externa
- Acessa variáveis locais efetivamente final
- Referência implícita à externa

**Externa.this**: acessa explicitamente a classe externa.

**Regra de Ouro**: **Inner class** acessa todos os membros da externa (incluindo private). **Static nested** acessa apenas membros static. **Local/Anonymous** acessa membros da classe + variáveis locais efetivamente final. Use **Externa.this** para acesso explícito.
