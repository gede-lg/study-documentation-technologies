# T4.03 - Acesso a Variáveis Locais Efetivamente Final

## Introdução

**Local class**: pode acessar variáveis locais **efetivamente final**.

```java
public class Exemplo {
    public void processar(String mensagem) {
        final String prefixo = "LOG: "; // final explícito
        String sufixo = " [OK]";        // efetivamente final
        
        // Local class acessa variáveis locais
        class Logger {
            public void log() {
                System.out.println(prefixo + mensagem + sufixo);
            }
        }
        
        Logger logger = new Logger();
        logger.log(); // LOG: teste [OK]
        
        // ❌ ERRO: modificar 'sufixo' quebra 'efetivamente final'
        // sufixo = " [ERRO]";
    }
}
```

**Efetivamente final**: variável não modificada após inicialização.

---

## Fundamentos

### 1. Variável final Explícita

**final**: palavra-chave indica variável imutável.

```java
public class Exemplo {
    public void processar() {
        final int numero = 10; // final explícito
        
        class Calculadora {
            public int dobrar() {
                return numero * 2; // ✅ Acessa variável final
            }
        }
        
        Calculadora calc = new Calculadora();
        System.out.println(calc.dobrar()); // 20
        
        // ❌ ERRO: não pode modificar final
        // numero = 20;
    }
}
```

### 2. Variável Efetivamente Final

**Efetivamente final**: não modificada, mas sem palavra-chave `final`.

```java
public class Exemplo {
    public void processar() {
        int numero = 10; // Efetivamente final (não modificada)
        
        class Calculadora {
            public int triplicar() {
                return numero * 3; // ✅ OK: efetivamente final
            }
        }
        
        Calculadora calc = new Calculadora();
        System.out.println(calc.triplicar()); // 30
        
        // ❌ Se descomentar, 'numero' deixa de ser efetivamente final
        // numero = 20;
    }
}
```

### 3. Parâmetros do Método

**Parâmetros**: são efetivamente final se não modificados.

```java
public class Validador {
    public void validar(String texto, int tamanho) {
        // Parâmetros são efetivamente final
        
        class ValidadorTexto {
            public boolean ehValido() {
                return texto != null && texto.length() >= tamanho;
            }
        }
        
        ValidadorTexto validador = new ValidadorTexto();
        System.out.println("Válido: " + validador.ehValido());
        
        // ❌ ERRO: modificar parâmetro quebra efetivamente final
        // texto = "novo";
        // tamanho = 5;
    }
}
```

### 4. Múltiplas Variáveis Locais

**Múltiplas**: local class acessa várias variáveis.

```java
public class Exemplo {
    public void processar() {
        String nome = "João";
        int idade = 30;
        String cidade = "São Paulo";
        
        class Pessoa {
            public void exibir() {
                System.out.println("Nome: " + nome);
                System.out.println("Idade: " + idade);
                System.out.println("Cidade: " + cidade);
            }
        }
        
        Pessoa pessoa = new Pessoa();
        pessoa.exibir();
        // Nome: João
        // Idade: 30
        // Cidade: São Paulo
    }
}
```

### 5. Variável Modificada Antes da Local Class

**Modificação antes**: OK se modificar ANTES de declarar local class.

```java
public class Exemplo {
    public void processar() {
        int numero = 10;
        numero = 20; // Modificar ANTES da local class
        numero = 30; // Modificar ANTES da local class
        
        // Local class declarada DEPOIS das modificações
        class Calculadora {
            public int obter() {
                return numero; // ✅ OK: captura valor final (30)
            }
        }
        
        Calculadora calc = new Calculadora();
        System.out.println(calc.obter()); // 30
        
        // ❌ ERRO: modificar DEPOIS da local class
        // numero = 40;
    }
}
```

### 6. Variável Não Efetivamente Final

**Erro**: modificar variável APÓS captura.

```java
public class Exemplo {
    public void processar() {
        int numero = 10;
        
        class Calculadora {
            public int obter() {
                return numero; // Captura 'numero'
            }
        }
        
        // ❌ ERRO: modificar 'numero' APÓS captura
        // numero = 20; // Compilador: variable 'numero' is accessed from within inner class; needs to be final or effectively final
    }
}
```

### 7. Array Efetivamente Final

**Array**: referência efetivamente final, mas elementos podem mudar.

```java
public class Exemplo {
    public void processar() {
        final int[] numeros = {10, 20, 30}; // Referência final
        
        class Calculadora {
            public int somar() {
                int soma = 0;
                for (int n : numeros) {
                    soma += n;
                }
                return soma;
            }
        }
        
        Calculadora calc = new Calculadora();
        System.out.println("Soma: " + calc.somar()); // Soma: 60
        
        // ✅ OK: modificar elementos do array
        numeros[0] = 100;
        System.out.println("Soma: " + calc.somar()); // Soma: 150
        
        // ❌ ERRO: modificar referência do array
        // numeros = new int[]{1, 2, 3};
    }
}
```

### 8. Objeto Efetivamente Final

**Objeto**: referência efetivamente final, mas atributos podem mudar.

```java
public class Pessoa {
    private String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public String getNome() {
        return nome;
    }
}

public class Exemplo {
    public void processar() {
        final Pessoa pessoa = new Pessoa("João"); // Referência final
        
        class Exibidor {
            public void exibir() {
                System.out.println("Nome: " + pessoa.getNome());
            }
        }
        
        Exibidor exibidor = new Exibidor();
        exibidor.exibir(); // Nome: João
        
        // ✅ OK: modificar atributos do objeto
        pessoa.setNome("Maria");
        exibidor.exibir(); // Nome: Maria
        
        // ❌ ERRO: modificar referência
        // pessoa = new Pessoa("Pedro");
    }
}
```

### 9. Loop com Variável Final

**Loop**: cada iteração tem variável final diferente.

```java
public class Exemplo {
    public void processar() {
        for (int i = 0; i < 3; i++) {
            final int numero = i; // final em cada iteração
            
            class Item {
                public void exibir() {
                    System.out.println("Número: " + numero);
                }
            }
            
            Item item = new Item();
            item.exibir();
        }
        
        // Número: 0
        // Número: 1
        // Número: 2
    }
}
```

### 10. Captura de this

**this**: referência à instância da classe externa (sempre final).

```java
public class Calculadora {
    private int valor = 100;
    
    public void processar() {
        class Helper {
            public void exibir() {
                // 'this' da classe externa (sempre final)
                System.out.println("Valor: " + Calculadora.this.valor);
            }
        }
        
        Helper helper = new Helper();
        helper.exibir(); // Valor: 100
    }
}
```

---

## Aplicabilidade

**Variáveis efetivamente final são úteis para**:
- Capturar estado do método
- Passar configuração para local class
- Callbacks com contexto
- Factory methods com parâmetros
- Iteradores com estado

---

## Armadilhas

### 1. Modificar Variável Após Captura

```java
public class Exemplo {
    public void processar() {
        int numero = 10;
        
        class Local {
            public int obter() {
                return numero;
            }
        }
        
        // ❌ ERRO: modificar após captura
        // numero = 20;
    }
}
```

### 2. Tentar Modificar na Local Class

```java
public class Exemplo {
    public void processar() {
        int contador = 0;
        
        class Incrementador {
            public void incrementar() {
                // ❌ ERRO: não pode modificar variável local
                // contador++;
            }
        }
    }
}
```

### 3. Confundir Referência com Conteúdo

```java
public class Exemplo {
    public void processar() {
        final List<String> lista = new ArrayList<>(); // Referência final
        
        class Helper {
            public void adicionar(String item) {
                // ✅ OK: modificar conteúdo da lista
                lista.add(item);
            }
        }
        
        // ❌ ERRO: modificar referência
        // lista = new ArrayList<>();
    }
}
```

### 4. Loop sem final

```java
public class Exemplo {
    public void processar() {
        // ❌ ERRO: 'i' é modificado no loop
        for (int i = 0; i < 3; i++) {
            class Item {
                public void exibir() {
                    // System.out.println(i); // ERRO
                }
            }
        }
        
        // ✅ Correto: copiar para variável final
        for (int i = 0; i < 3; i++) {
            final int numero = i; // Cópia final
            
            class Item {
                public void exibir() {
                    System.out.println(numero); // ✅ OK
                }
            }
        }
    }
}
```

### 5. Variável em Bloco Externo

```java
public class Exemplo {
    public void processar() {
        int numero = 10;
        
        {
            // Bloco interno
            class Local {
                public void exibir() {
                    System.out.println(numero); // ✅ Captura 'numero'
                }
            }
        }
        
        // ❌ ERRO: modificar 'numero' após bloco
        // numero = 20;
    }
}
```

---

## Boas Práticas

### 1. Usar final Explícito para Clareza

```java
// ✅ final explícito deixa intenção clara
public class Exemplo {
    public void processar(String mensagem) {
        final String prefixo = "INFO: ";
        final String sufixo = " [OK]";
        
        class Logger {
            public void log() {
                System.out.println(prefixo + mensagem + sufixo);
            }
        }
        
        Logger logger = new Logger();
        logger.log();
    }
}
```

### 2. Copiar para Variável final em Loop

```java
// ✅ Copiar variável do loop para final
public class Exemplo {
    public void processar(List<String> itens) {
        for (String item : itens) {
            final String itemFinal = item; // Cópia final
            
            class Processador {
                public void processar() {
                    System.out.println("Processando: " + itemFinal);
                }
            }
            
            Processador proc = new Processador();
            proc.processar();
        }
    }
}
```

### 3. Encapsular Estado Mutável

```java
// ✅ Encapsular estado mutável em objeto
public class Contador {
    private int valor = 0;
    
    public void incrementar() {
        valor++;
    }
    
    public int getValor() {
        return valor;
    }
}

public class Exemplo {
    public void processar() {
        final Contador contador = new Contador(); // Referência final
        
        class Incrementador {
            public void incrementar() {
                // ✅ OK: modificar estado do objeto
                contador.incrementar();
            }
        }
        
        Incrementador inc = new Incrementador();
        inc.incrementar();
        inc.incrementar();
        
        System.out.println("Contador: " + contador.getValor()); // 2
    }
}
```

### 4. Usar Array para Estado Mutável

```java
// ✅ Array com um elemento para estado mutável
public class Exemplo {
    public void processar() {
        final int[] contador = {0}; // Array final, elemento mutável
        
        class Incrementador {
            public void incrementar() {
                contador[0]++; // ✅ OK: modificar elemento
            }
        }
        
        Incrementador inc = new Incrementador();
        inc.incrementar();
        inc.incrementar();
        
        System.out.println("Contador: " + contador[0]); // 2
    }
}
```

### 5. AtomicInteger para Contador

```java
// ✅ AtomicInteger para contador thread-safe
import java.util.concurrent.atomic.AtomicInteger;

public class Exemplo {
    public void processar() {
        final AtomicInteger contador = new AtomicInteger(0);
        
        class Incrementador {
            public void incrementar() {
                contador.incrementAndGet(); // ✅ Thread-safe
            }
        }
        
        Incrementador inc = new Incrementador();
        inc.incrementar();
        inc.incrementar();
        
        System.out.println("Contador: " + contador.get()); // 2
    }
}
```

### 6. Factory Method com Parâmetros

```java
// ✅ Factory method captura parâmetros
public interface Validador {
    boolean validar(String texto);
}

public class ValidadorFactory {
    public static Validador criarValidadorTamanho(int tamanhoMinimo) {
        // Parâmetro efetivamente final
        
        class ValidadorTamanho implements Validador {
            @Override
            public boolean validar(String texto) {
                return texto != null && texto.length() >= tamanhoMinimo;
            }
        }
        
        return new ValidadorTamanho();
    }
}

// Uso
Validador validador = ValidadorFactory.criarValidadorTamanho(5);
System.out.println(validador.validar("teste")); // true (5 caracteres)
System.out.println(validador.validar("abc"));   // false (3 caracteres)
```

### 7. Callback com Contexto

```java
// ✅ Callback captura contexto do método
public interface Callback {
    void executar(String resultado);
}

public class Service {
    public void processar(String entrada, Callback callback) {
        // Processar...
        callback.executar("Processado: " + entrada);
    }
}

public class App {
    public void executar(String id) {
        final String contexto = "ID: " + id; // Contexto final
        
        Service service = new Service();
        
        class MeuCallback implements Callback {
            @Override
            public void executar(String resultado) {
                System.out.println(contexto + " - " + resultado);
            }
        }
        
        service.processar("dados", new MeuCallback());
        // ID: 123 - Processado: dados
    }
}
```

### 8. Configuração Imutável

```java
// ✅ Configuração imutável capturada
public class Configuracao {
    private final String ambiente;
    private final int porta;
    
    public Configuracao(String ambiente, int porta) {
        this.ambiente = ambiente;
        this.porta = porta;
    }
    
    public String getAmbiente() { return ambiente; }
    public int getPorta() { return porta; }
}

public class ServidorFactory {
    public Runnable criar(Configuracao config) {
        // Referência final a configuração imutável
        
        class Servidor implements Runnable {
            @Override
            public void run() {
                System.out.println("Servidor iniciado");
                System.out.println("Ambiente: " + config.getAmbiente());
                System.out.println("Porta: " + config.getPorta());
            }
        }
        
        return new Servidor();
    }
}
```

### 9. Stream com Local Class

```java
// ✅ Stream captura variáveis finais
import java.util.*;
import java.util.stream.*;

public class Exemplo {
    public void processar() {
        final String prefixo = "ITEM: ";
        
        List<String> itens = Arrays.asList("A", "B", "C");
        
        List<String> resultado = itens.stream()
            .map(item -> {
                class Formatador {
                    public String formatar() {
                        return prefixo + item;
                    }
                }
                return new Formatador().formatar();
            })
            .collect(Collectors.toList());
        
        System.out.println(resultado);
        // [ITEM: A, ITEM: B, ITEM: C]
    }
}
```

### 10. Builder com Estado Capturado

```java
// ✅ Builder captura estado da classe externa
public class Pedido {
    private String cliente;
    private List<String> itens = new ArrayList<>();
    
    private Pedido() { }
    
    public static class Builder {
        private String cliente;
        
        public Builder cliente(String cliente) {
            this.cliente = cliente;
            return this;
        }
        
        public AdicionadorItem adicionarItens() {
            final Pedido pedido = new Pedido();
            pedido.cliente = this.cliente;
            
            // Local class para adicionar itens
            class AdicionadorItemImpl implements AdicionadorItem {
                @Override
                public AdicionadorItem item(String item) {
                    pedido.itens.add(item);
                    return this;
                }
                
                @Override
                public Pedido build() {
                    return pedido;
                }
            }
            
            return new AdicionadorItemImpl();
        }
    }
    
    public interface AdicionadorItem {
        AdicionadorItem item(String item);
        Pedido build();
    }
    
    @Override
    public String toString() {
        return "Pedido{cliente='" + cliente + "', itens=" + itens + "}";
    }
}

// Uso
Pedido pedido = new Pedido.Builder()
    .cliente("João")
    .adicionarItens()
        .item("Item A")
        .item("Item B")
        .item("Item C")
        .build();

System.out.println(pedido);
// Pedido{cliente='João', itens=[Item A, Item B, Item C]}
```

---

## Resumo

**Local class**: acessa variáveis locais **efetivamente final**.

```java
public void metodo() {
    final int a = 10;     // final explícito
    int b = 20;           // efetivamente final
    
    class Local {
        public void exibir() {
            System.out.println(a + b); // ✅ OK
        }
    }
    
    // ❌ Se descomentar, 'b' deixa de ser efetivamente final
    // b = 30;
}
```

**Efetivamente final**: variável não modificada após inicialização.

**Regras**:
- Variável com `final`: sempre efetivamente final
- Variável sem `final`: efetivamente final se não modificada
- Parâmetros do método: efetivamente final se não modificados
- Array/objeto: referência final, conteúdo mutável

**Captura**:
- Local class captura valor da variável
- Modificar após captura: erro de compilação
- Loop: copiar para variável final em cada iteração

**Estado mutável**:
- Array com 1 elemento: `final int[] contador = {0}`
- Objeto com setter: `final Contador c = new Contador()`
- AtomicInteger: `final AtomicInteger c = new AtomicInteger(0)`

**Aplicabilidade**:
- Capturar estado do método
- Factory methods com parâmetros
- Callbacks com contexto
- Configuração imutável
- Iteradores com estado

**Boas práticas**:
- Usar final explícito para clareza
- Copiar para final em loop
- Encapsular estado mutável em objeto
- Array para estado mutável simples
- AtomicInteger para contador thread-safe
- Factory method com parâmetros
- Callback com contexto
- Configuração imutável
- Stream com local class
- Builder com estado capturado

**Armadilhas**:
- ❌ Modificar variável após captura
- ❌ Tentar modificar na local class
- ❌ Confundir referência com conteúdo
- ❌ Loop sem final
- ❌ Variável em bloco externo modificada

**Regra de Ouro**: **Local classes** acessam apenas variáveis **efetivamente final** (não modificadas após inicialização). Use **final explícito** para clareza. Para estado mutável, use **objeto** (referência final, atributos mutáveis), **array** de 1 elemento, ou **AtomicInteger**. **Não modifique** variáveis locais após serem capturadas. Em **loops**, copie para variável final. Variáveis **efetivamente final** permitem capturar contexto do método de forma segura.
