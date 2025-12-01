# T4.02 - Escopo Limitado ao Bloco

## Introdução

**Local class**: escopo **limitado ao bloco** onde foi declarada.

```java
public class Exemplo {
    public void metodo() {
        // Local class: escopo apenas dentro do método
        class MinhaLocal {
            public void executar() {
                System.out.println("Executando");
            }
        }
        
        MinhaLocal local = new MinhaLocal();
        local.executar(); // ✅ OK
    }
    
    public void outroMetodo() {
        // ❌ ERRO: MinhaLocal não é visível aqui
        // MinhaLocal local = new MinhaLocal();
    }
}
```

**Visibilidade**: apenas dentro do bloco declarado.

---

## Fundamentos

### 1. Escopo em Método

**Escopo**: local class visível apenas no método.

```java
public class Calculadora {
    public void somar(int a, int b) {
        // Local class declarada aqui
        class Somador {
            public int calcular() {
                return a + b;
            }
        }
        
        // Visível dentro do método
        Somador somador = new Somador();
        System.out.println("Soma: " + somador.calcular());
    } // Fim do escopo de Somador
    
    public void subtrair(int a, int b) {
        // ❌ ERRO: Somador não é visível aqui
        // Somador somador = new Somador();
    }
}
```

### 2. Escopo em Bloco if

**Bloco if**: local class visível apenas dentro do if.

```java
public class Validador {
    public void validar(boolean condicao) {
        if (condicao) {
            // Local class dentro de if
            class ValidadorEspecial {
                public boolean processar() {
                    return true;
                }
            }
            
            ValidadorEspecial validador = new ValidadorEspecial();
            System.out.println(validador.processar()); // ✅ OK
        }
        
        // ❌ ERRO: ValidadorEspecial não é visível fora do if
        // ValidadorEspecial validador = new ValidadorEspecial();
    }
}
```

### 3. Escopo em Bloco for

**Bloco for**: local class visível apenas dentro do loop.

```java
public class Processador {
    public void processar() {
        for (int i = 0; i < 3; i++) {
            // Local class dentro de for
            class Item {
                private int numero;
                
                public Item(int numero) {
                    this.numero = numero;
                }
                
                public void exibir() {
                    System.out.println("Item: " + numero);
                }
            }
            
            Item item = new Item(i);
            item.exibir(); // ✅ OK
        }
        
        // ❌ ERRO: Item não é visível fora do for
        // Item item = new Item(0);
    }
}

// Saída:
// Item: 0
// Item: 1
// Item: 2
```

### 4. Escopo em Bloco while

**Bloco while**: local class visível apenas dentro do while.

```java
public class Contador {
    public void contar() {
        int i = 0;
        
        while (i < 3) {
            // Local class dentro de while
            class Incrementador {
                public void incrementar() {
                    System.out.println("Contagem: " + i);
                }
            }
            
            Incrementador inc = new Incrementador();
            inc.incrementar(); // ✅ OK
            i++;
        }
        
        // ❌ ERRO: Incrementador não é visível fora do while
        // Incrementador inc = new Incrementador();
    }
}
```

### 5. Escopo em Bloco try-catch

**Bloco try**: local class visível apenas dentro do try.

```java
public class LeitorArquivo {
    public void ler() {
        try {
            // Local class dentro de try
            class ProcessadorLeitura {
                public void processar() {
                    System.out.println("Processando leitura...");
                }
            }
            
            ProcessadorLeitura proc = new ProcessadorLeitura();
            proc.processar(); // ✅ OK
            
        } catch (Exception e) {
            // ❌ ERRO: ProcessadorLeitura não é visível no catch
            // ProcessadorLeitura proc = new ProcessadorLeitura();
        }
    }
}
```

### 6. Múltiplas Local Classes em Blocos Diferentes

**Blocos diferentes**: cada bloco pode ter sua própria local class.

```java
public class Exemplo {
    public void processar(boolean condicao) {
        if (condicao) {
            // Local class no if
            class ProcessadorA {
                public void executar() {
                    System.out.println("Processador A");
                }
            }
            
            ProcessadorA procA = new ProcessadorA();
            procA.executar();
        } else {
            // Local class no else (nome pode ser repetido)
            class ProcessadorB {
                public void executar() {
                    System.out.println("Processador B");
                }
            }
            
            ProcessadorB procB = new ProcessadorB();
            procB.executar();
        }
    }
}
```

### 7. Local Class com Mesmo Nome em Blocos Diferentes

**Nome repetido**: local classes com mesmo nome em blocos diferentes.

```java
public class Fabrica {
    public void criar(int opcao) {
        if (opcao == 1) {
            // Local class chamada "Item"
            class Item {
                public void processar() {
                    System.out.println("Item tipo 1");
                }
            }
            
            Item item = new Item();
            item.processar();
        }
        
        if (opcao == 2) {
            // Outra local class também chamada "Item" (OK, escopo diferente)
            class Item {
                public void processar() {
                    System.out.println("Item tipo 2");
                }
            }
            
            Item item = new Item();
            item.processar();
        }
    }
}
```

### 8. Retornar Instância de Local Class

**Retorno**: retornar instância de local class via interface.

```java
public interface Processador {
    void processar();
}

public class Factory {
    public Processador criar() {
        // Local class
        class ProcessadorImpl implements Processador {
            @Override
            public void processar() {
                System.out.println("Processando...");
            }
        }
        
        // ✅ OK: retornar via interface (escapa do escopo)
        return new ProcessadorImpl();
    }
}

// Uso
Factory factory = new Factory();
Processador proc = factory.criar();
proc.processar(); // Processando...
```

### 9. Array de Local Class

**Array**: criar array de local class.

```java
public class Exemplo {
    public void processar() {
        class Item {
            private int numero;
            
            public Item(int numero) {
                this.numero = numero;
            }
            
            public void exibir() {
                System.out.println("Item: " + numero);
            }
        }
        
        // Array de local class
        Item[] itens = new Item[3];
        itens[0] = new Item(10);
        itens[1] = new Item(20);
        itens[2] = new Item(30);
        
        for (Item item : itens) {
            item.exibir();
        }
    } // Fim do escopo: itens[] não é visível fora do método
}
```

### 10. Local Class em Lambda

**Lambda**: local class dentro de lambda (raro).

```java
import java.util.*;

public class Exemplo {
    public void executar() {
        List<String> nomes = Arrays.asList("João", "Maria", "Pedro");
        
        nomes.forEach(nome -> {
            // Local class dentro de lambda
            class Formatador {
                public String formatar() {
                    return nome.toUpperCase();
                }
            }
            
            Formatador fmt = new Formatador();
            System.out.println(fmt.formatar());
        });
    }
}

// Saída:
// JOÃO
// MARIA
// PEDRO
```

---

## Aplicabilidade

**Escopo limitado é útil para**:
- Encapsular lógica temporária
- Evitar poluir namespace da classe
- Criar classes helper descartáveis
- Implementar lógica específica de bloco
- Reutilizar nomes em blocos diferentes

---

## Armadilhas

### 1. Tentar Acessar Fora do Escopo

```java
public class Exemplo {
    public void metodo1() {
        class Local {
            public void executar() { }
        }
        
        Local local = new Local(); // ✅ OK
    }
    
    public void metodo2() {
        // ❌ ERRO: Local não é visível aqui
        // Local local = new Local();
    }
}
```

### 2. Confundir com Inner Class

```java
public class Exemplo {
    // Inner class (visível em toda a classe)
    private class Inner {
        public void executar() { }
    }
    
    public void metodo() {
        // Local class (visível apenas no método)
        class Local {
            public void executar() { }
        }
        
        Inner inner = new Inner();   // ✅ OK (inner class)
        Local local = new Local();    // ✅ OK (local class)
    }
    
    public void outroMetodo() {
        Inner inner = new Inner();   // ✅ OK (inner class)
        // Local local = new Local(); // ❌ ERRO (local class)
    }
}
```

### 3. Local Class em Bloco Não Executado

```java
public class Exemplo {
    public void processar(boolean condicao) {
        if (condicao) {
            class ProcessadorA {
                public void executar() { }
            }
            
            ProcessadorA proc = new ProcessadorA();
            proc.executar();
        }
        
        // ❌ Se condicao = false, ProcessadorA nunca existe
    }
}
```

### 4. Escopo de Variável Local vs Local Class

```java
public class Exemplo {
    public void metodo() {
        {
            // Bloco interno
            int numero = 10; // Variável local
            
            class Local {
                public void exibir() {
                    System.out.println(numero); // ✅ OK
                }
            }
            
            Local local = new Local();
            local.exibir();
        }
        
        // ❌ 'numero' não é visível aqui
        // System.out.println(numero);
        
        // ❌ Local também não é visível
        // Local local = new Local();
    }
}
```

### 5. Captura de Variável Modificada

```java
public class Exemplo {
    public void processar() {
        int numero = 10;
        
        class Incrementador {
            public void incrementar() {
                // ❌ ERRO: não pode modificar variável local
                // numero++;
            }
        }
        
        // ❌ ERRO: modificar 'numero' após captura
        // numero = 20;
    }
}
```

---

## Boas Práticas

### 1. Declarar no Início do Bloco

```java
// ✅ Declarar local class no início para clareza
public class Exemplo {
    public void processar() {
        // Declarar logo no início
        class Processador {
            public void executar() {
                System.out.println("Processando...");
            }
        }
        
        // Código do método
        Processador proc = new Processador();
        proc.executar();
    }
}
```

### 2. Usar Interface para Retornar

```java
// ✅ Retornar via interface para escapar escopo
public interface Validador {
    boolean validar(String texto);
}

public class ValidadorFactory {
    public Validador criar(String tipo) {
        if (tipo.equals("EMAIL")) {
            class ValidadorEmail implements Validador {
                @Override
                public boolean validar(String texto) {
                    return texto.contains("@");
                }
            }
            return new ValidadorEmail();
        }
        return null;
    }
}
```

### 3. Evitar Local Class em Blocos Aninhados

```java
// ❌ Evitar local class em blocos muito aninhados
public class Exemplo {
    public void processar() {
        if (true) {
            for (int i = 0; i < 3; i++) {
                while (true) {
                    // ❌ Muito aninhado
                    class Local { }
                    break;
                }
            }
        }
    }
}

// ✅ Preferir local class no método principal
public class Exemplo {
    public void processar() {
        class Helper {
            public void executar() {
                // Lógica aqui
            }
        }
        
        Helper helper = new Helper();
        
        if (true) {
            for (int i = 0; i < 3; i++) {
                helper.executar();
            }
        }
    }
}
```

### 4. Documentar Escopo

```java
// ✅ Documentar escopo da local class
public class Exemplo {
    /**
     * Processa dados usando local class.
     */
    public void processar() {
        /**
         * Helper local para processamento.
         * ESCOPO: visível apenas dentro de processar()
         */
        class ProcessadorHelper {
            public void executar() {
                System.out.println("Executando");
            }
        }
        
        ProcessadorHelper helper = new ProcessadorHelper();
        helper.executar();
    }
}
```

### 5. Factory Method com Escopo Controlado

```java
// ✅ Factory method retorna instância que escapa do escopo
import java.util.*;

public interface Comparador {
    int comparar(int a, int b);
}

public class ComparadorFactory {
    public static Comparador criarCrescente() {
        // Local class: escopo do método
        class ComparadorCrescente implements Comparador {
            @Override
            public int comparar(int a, int b) {
                return Integer.compare(a, b);
            }
        }
        
        // Retorna via interface: escapa do escopo
        return new ComparadorCrescente();
    }
    
    public static Comparador criarDecrescente() {
        class ComparadorDecrescente implements Comparador {
            @Override
            public int comparar(int a, int b) {
                return Integer.compare(b, a);
            }
        }
        
        return new ComparadorDecrescente();
    }
}

// Uso
Comparador crescente = ComparadorFactory.criarCrescente();
System.out.println(crescente.comparar(10, 5)); // 1 (10 > 5)

Comparador decrescente = ComparadorFactory.criarDecrescente();
System.out.println(decrescente.comparar(10, 5)); // -1 (10 < 5 na ordem decrescente)
```

### 6. Strategy Pattern com Escopo

```java
// ✅ Strategy pattern usando local class
public interface Operacao {
    int executar(int a, int b);
}

public class Calculadora {
    public int calcular(int a, int b, String tipoOperacao) {
        Operacao operacao;
        
        switch (tipoOperacao) {
            case "SOMA":
                class Soma implements Operacao {
                    @Override
                    public int executar(int x, int y) {
                        return x + y;
                    }
                }
                operacao = new Soma();
                break;
                
            case "SUBTRACAO":
                class Subtracao implements Operacao {
                    @Override
                    public int executar(int x, int y) {
                        return x - y;
                    }
                }
                operacao = new Subtracao();
                break;
                
            default:
                throw new IllegalArgumentException("Operação inválida");
        }
        
        return operacao.executar(a, b);
    }
}
```

### 7. Template Method com Escopo

```java
// ✅ Template method usando local class
public abstract class Processador {
    public abstract void processar();
}

public class ProcessadorFactory {
    public Processador criar(String tipo) {
        if (tipo.equals("RAPIDO")) {
            class ProcessadorRapido extends Processador {
                @Override
                public void processar() {
                    System.out.println("Processamento rápido");
                }
            }
            return new ProcessadorRapido();
        } else if (tipo.equals("DETALHADO")) {
            class ProcessadorDetalhado extends Processador {
                @Override
                public void processar() {
                    System.out.println("Processamento detalhado");
                }
            }
            return new ProcessadorDetalhado();
        }
        return null;
    }
}
```

### 8. Callback com Escopo Limitado

```java
// ✅ Callback com local class
public interface Callback {
    void executar(String resultado);
}

public class Service {
    public void processar(Callback callback) {
        // Processar...
        callback.executar("Concluído");
    }
}

public class App {
    public void iniciar() {
        Service service = new Service();
        
        // Local class para callback (escopo do método)
        class MeuCallback implements Callback {
            @Override
            public void executar(String resultado) {
                System.out.println("Resultado: " + resultado);
            }
        }
        
        service.processar(new MeuCallback());
    }
}
```

### 9. Iterator com Escopo

```java
// ✅ Iterator usando local class
import java.util.*;

public class MinhaLista<T> implements Iterable<T> {
    private List<T> elementos = new ArrayList<>();
    
    public void adicionar(T elemento) {
        elementos.add(elemento);
    }
    
    @Override
    public Iterator<T> iterator() {
        // Local class: escopo do método iterator()
        class ListaIterator implements Iterator<T> {
            private int indice = 0;
            
            @Override
            public boolean hasNext() {
                return indice < elementos.size();
            }
            
            @Override
            public T next() {
                return elementos.get(indice++);
            }
        }
        
        // Retorna via interface: escapa do escopo
        return new ListaIterator();
    }
}
```

### 10. Evitar Vazamento de Escopo

```java
// ❌ Evitar vazamento de referência
public class Exemplo {
    private Object referencia;
    
    public void processar() {
        class Local {
            public void executar() {
                System.out.println("Local");
            }
        }
        
        Local local = new Local();
        
        // ❌ Evitar armazenar referência que escapa do escopo
        // this.referencia = local;
    }
}

// ✅ Se precisa escapar, use interface
public interface Executavel {
    void executar();
}

public class Exemplo {
    private Executavel referencia;
    
    public void processar() {
        class Local implements Executavel {
            @Override
            public void executar() {
                System.out.println("Local");
            }
        }
        
        // ✅ OK: armazenar via interface
        this.referencia = new Local();
    }
}
```

---

## Resumo

**Local class**: escopo **limitado ao bloco** onde foi declarada.

```java
public void metodo() {
    class Local { }      // Escopo: apenas dentro de metodo()
    Local local = new Local(); // ✅ OK
}

public void outroMetodo() {
    // Local local = new Local(); // ❌ ERRO
}
```

**Visibilidade**:
- Apenas dentro do bloco (método, if, for, while, try)
- Não visível fora do bloco
- Cada bloco pode ter local class com mesmo nome

**Retornar instância**:
- Via interface (escapa do escopo)
- Via classe abstrata
- Via tipo genérico

**Características**:
- Escopo limitado evita poluir namespace
- Pode reutilizar nomes em blocos diferentes
- Ideal para lógica temporária
- Instâncias podem escapar via interface

**Aplicabilidade**:
- Encapsular lógica temporária
- Factory methods
- Strategy pattern
- Template method
- Callbacks
- Iterators

**Boas práticas**:
- Declarar no início do bloco
- Usar interface para retornar
- Evitar blocos muito aninhados
- Documentar escopo
- Factory method com escopo controlado
- Strategy pattern
- Template method
- Callback com escopo limitado
- Iterator com escopo
- Evitar vazamento de escopo

**Armadilhas**:
- ❌ Tentar acessar fora do escopo
- ❌ Confundir com inner class
- ❌ Local class em bloco não executado
- ❌ Escopo de variável vs local class
- ❌ Captura de variável modificada

**Regra de Ouro**: **Local classes** têm **escopo limitado** ao bloco onde foram declaradas (método, if, for, while, try). **Não são visíveis** fora desse bloco. Use **interfaces** para retornar instâncias que precisam escapar do escopo. **Escopo limitado** é uma vantagem - evita poluir namespace e permite reutilizar nomes. Ideal para **lógica temporária** que não precisa ser exposta. Se a classe precisa ser **reutilizada** em múltiplos métodos, prefira **inner class** ou **classe top-level**.
