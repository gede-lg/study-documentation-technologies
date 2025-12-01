# T4.01 - Declaradas Dentro de Métodos

## Introdução

**Local class**: classe declarada **dentro de um método**.

```java
public class Exemplo {
    public void metodo() {
        // Local class declarada dentro do método
        class MinhaLocal {
            public void exibir() {
                System.out.println("Classe local");
            }
        }
        
        // Instanciar e usar
        MinhaLocal local = new MinhaLocal();
        local.exibir(); // Classe local
    }
}
```

**Escopo**: apenas dentro do método onde foi declarada.

---

## Fundamentos

### 1. Declaração Básica

**Sintaxe**: `class NomeLocal { }` dentro de método.

```java
public class Container {
    public void processar() {
        // Local class
        class Processador {
            public void executar() {
                System.out.println("Processando...");
            }
        }
        
        // Usar local class
        Processador proc = new Processador();
        proc.executar(); // Processando...
    }
}

// Uso
Container container = new Container();
container.processar();
```

### 2. Acesso a Membros da Classe Externa

**Acesso**: local class acessa membros da classe externa.

```java
public class Calculadora {
    private int valor = 10;
    
    public void calcular() {
        // Local class acessa 'valor'
        class Somador {
            public int somar(int numero) {
                return valor + numero; // Acessa campo da externa
            }
        }
        
        Somador somador = new Somador();
        int resultado = somador.somar(5);
        System.out.println("Resultado: " + resultado); // Resultado: 15
    }
}

// Uso
Calculadora calc = new Calculadora();
calc.calcular();
```

### 3. Acesso a Parâmetros do Método

**Parâmetros**: local class acessa parâmetros do método.

```java
public class Mensageiro {
    public void enviar(String destinatario, String mensagem) {
        // Local class acessa parâmetros
        class Email {
            public void enviarEmail() {
                System.out.println("Para: " + destinatario);
                System.out.println("Mensagem: " + mensagem);
            }
        }
        
        Email email = new Email();
        email.enviarEmail();
    }
}

// Uso
Mensageiro msg = new Mensageiro();
msg.enviar("joao@email.com", "Olá!");
// Para: joao@email.com
// Mensagem: Olá!
```

### 4. Acesso a Variáveis Locais

**Variáveis locais**: devem ser **efetivamente final**.

```java
public class Validador {
    public void validar(String texto) {
        final String prefixo = "VALIDADO: ";
        
        // Local class acessa variável local
        class ValidadorTexto {
            public void exibir() {
                System.out.println(prefixo + texto);
            }
        }
        
        ValidadorTexto validador = new ValidadorTexto();
        validador.exibir(); // VALIDADO: exemplo
    }
}
```

### 5. Múltiplas Instâncias

**Múltiplas instâncias**: criar várias instâncias da local class.

```java
public class Fabrica {
    public void criar() {
        class Item {
            private String nome;
            
            public Item(String nome) {
                this.nome = nome;
            }
            
            public void exibir() {
                System.out.println("Item: " + nome);
            }
        }
        
        // Criar múltiplas instâncias
        Item item1 = new Item("Item A");
        Item item2 = new Item("Item B");
        Item item3 = new Item("Item C");
        
        item1.exibir(); // Item: Item A
        item2.exibir(); // Item: Item B
        item3.exibir(); // Item: Item C
    }
}
```

### 6. Local Class com Construtor

**Construtor**: local class pode ter construtor.

```java
public class Sistema {
    public void inicializar() {
        class Configuracao {
            private String ambiente;
            private int porta;
            
            // Construtor
            public Configuracao(String ambiente, int porta) {
                this.ambiente = ambiente;
                this.porta = porta;
                System.out.println("Configuração criada: " + ambiente + ":" + porta);
            }
        }
        
        Configuracao config = new Configuracao("Produção", 8080);
        // Configuração criada: Produção:8080
    }
}
```

### 7. Local Class com Métodos

**Métodos**: local class pode ter múltiplos métodos.

```java
public class Processador {
    public void processar(int numero) {
        class Operacoes {
            public int dobrar() {
                return numero * 2;
            }
            
            public int triplicar() {
                return numero * 3;
            }
            
            public int quadruplicar() {
                return numero * 4;
            }
        }
        
        Operacoes ops = new Operacoes();
        System.out.println("Dobro: " + ops.dobrar());
        System.out.println("Triplo: " + ops.triplicar());
        System.out.println("Quádruplo: " + ops.quadruplicar());
    }
}

// Uso
Processador proc = new Processador();
proc.processar(5);
// Dobro: 10
// Triplo: 15
// Quádruplo: 20
```

### 8. Local Class Implementando Interface

**Interface**: local class pode implementar interface.

```java
public interface Comparavel {
    int comparar(int a, int b);
}

public class ComparadorFactory {
    public Comparavel criarComparador(String tipo) {
        if (tipo.equals("MAIOR")) {
            // Local class implementa interface
            class ComparadorMaior implements Comparavel {
                @Override
                public int comparar(int a, int b) {
                    return Integer.compare(a, b);
                }
            }
            return new ComparadorMaior();
        }
        return null;
    }
}

// Uso
ComparadorFactory factory = new ComparadorFactory();
Comparavel comp = factory.criarComparador("MAIOR");
int resultado = comp.comparar(10, 5);
System.out.println(resultado); // 1 (positivo, 10 > 5)
```

### 9. Local Class Estendendo Classe

**Herança**: local class pode estender classe.

```java
public class Animal {
    protected String especie;
    
    public Animal(String especie) {
        this.especie = especie;
    }
}

public class Zoo {
    public void criarAnimal() {
        // Local class estende Animal
        class Cachorro extends Animal {
            public Cachorro() {
                super("Cachorro");
            }
            
            public void latir() {
                System.out.println("Au au! - " + especie);
            }
        }
        
        Cachorro cachorro = new Cachorro();
        cachorro.latir(); // Au au! - Cachorro
    }
}
```

### 10. Local Class em Diferentes Blocos

**Blocos**: local class em if, for, while, try.

```java
public class Exemplo {
    public void executar(boolean condicao) {
        if (condicao) {
            // Local class dentro de if
            class Handler {
                public void processar() {
                    System.out.println("Processando...");
                }
            }
            
            Handler handler = new Handler();
            handler.processar();
        }
        
        // Local class dentro de for
        for (int i = 0; i < 3; i++) {
            final int numero = i;
            
            class Contador {
                public void exibir() {
                    System.out.println("Contador: " + numero);
                }
            }
            
            Contador contador = new Contador();
            contador.exibir();
        }
        // Contador: 0
        // Contador: 1
        // Contador: 2
    }
}
```

---

## Aplicabilidade

**Local classes são úteis para**:
- Encapsular lógica usada apenas em um método
- Implementar interfaces ou estender classes localmente
- Acessar variáveis locais e parâmetros
- Criar classes helper temporárias
- Implementar callbacks específicos

---

## Armadilhas

### 1. Visibilidade Limitada

```java
public class Exemplo {
    public void metodo1() {
        class Local { }
        Local local = new Local(); // ✅
    }
    
    public void metodo2() {
        // ❌ ERRO: Local não é visível aqui
        // Local local = new Local();
    }
}
```

### 2. Variável Local Não-Final

```java
public class Exemplo {
    public void metodo() {
        int numero = 10;
        
        class Local {
            public void exibir() {
                // ✅ OK: numero é efetivamente final
                System.out.println(numero);
            }
        }
        
        // ❌ ERRO: modificar 'numero' quebra 'efetivamente final'
        // numero = 20;
    }
}
```

### 3. Não Pode Ser Static

```java
public class Exemplo {
    public void metodo() {
        // ❌ ERRO: local class não pode ser static
        // static class Local { }
    }
}
```

### 4. Não Pode Ter Membros Static

```java
public class Exemplo {
    public void metodo() {
        class Local {
            // ❌ ERRO: local class não pode ter membros static
            // public static int CONSTANTE = 10;
            
            // ❌ ERRO: método static não permitido
            // public static void metodoStatic() { }
        }
    }
}
```

### 5. Modificadores de Acesso Inválidos

```java
public class Exemplo {
    public void metodo() {
        // ❌ ERRO: local class não pode ser public, private, protected
        // public class Local { }
        // private class Local { }
        // protected class Local { }
        
        // ✅ OK: apenas default (sem modificador)
        class Local { }
    }
}
```

---

## Boas Práticas

### 1. Nome Descritivo

```java
// ✅ Nome descritivo para local class
public class ValidadorFactory {
    public void validar(String email) {
        class ValidadorEmail {
            public boolean ehValido() {
                return email.contains("@");
            }
        }
        
        ValidadorEmail validador = new ValidadorEmail();
        if (validador.ehValido()) {
            System.out.println("Email válido");
        }
    }
}
```

### 2. Encapsular Lógica Complexa

```java
// ✅ Encapsular lógica complexa em local class
public class ProcessadorPedido {
    public void processar(List<Item> itens) {
        class CalculadoraDesconto {
            public double calcularDesconto() {
                double total = itens.stream()
                    .mapToDouble(Item::getPreco)
                    .sum();
                
                if (total > 1000) return total * 0.15;
                if (total > 500) return total * 0.10;
                if (total > 100) return total * 0.05;
                return 0;
            }
        }
        
        CalculadoraDesconto calc = new CalculadoraDesconto();
        double desconto = calc.calcularDesconto();
        System.out.println("Desconto: R$ " + desconto);
    }
}
```

### 3. Implementar Interface Localmente

```java
// ✅ Implementar interface apenas para uso local
import java.util.*;

public class OrdenadorFactory {
    public void ordenar(List<Pessoa> pessoas, String criterio) {
        if (criterio.equals("NOME")) {
            class ComparadorNome implements Comparator<Pessoa> {
                @Override
                public int compare(Pessoa p1, Pessoa p2) {
                    return p1.getNome().compareTo(p2.getNome());
                }
            }
            
            Collections.sort(pessoas, new ComparadorNome());
        } else if (criterio.equals("IDADE")) {
            class ComparadorIdade implements Comparator<Pessoa> {
                @Override
                public int compare(Pessoa p1, Pessoa p2) {
                    return Integer.compare(p1.getIdade(), p2.getIdade());
                }
            }
            
            Collections.sort(pessoas, new ComparadorIdade());
        }
    }
}
```

### 4. Usar para Callbacks

```java
// ✅ Local class para callback específico
public class Downloader {
    public interface DownloadListener {
        void onProgress(int progresso);
        void onComplete();
    }
    
    public void baixar(String url, DownloadListener listener) {
        // Simular download
        for (int i = 0; i <= 100; i += 10) {
            listener.onProgress(i);
        }
        listener.onComplete();
    }
}

public class App {
    public void iniciar() {
        Downloader downloader = new Downloader();
        
        // Local class para listener
        class MeuListener implements Downloader.DownloadListener {
            @Override
            public void onProgress(int progresso) {
                System.out.println("Progresso: " + progresso + "%");
            }
            
            @Override
            public void onComplete() {
                System.out.println("Download concluído!");
            }
        }
        
        downloader.baixar("http://exemplo.com/arquivo", new MeuListener());
    }
}
```

### 5. Evitar Local Class Muito Grande

```java
// ❌ Evitar local class muito grande
public class Exemplo {
    public void metodo() {
        class Local {
            private String campo1;
            private String campo2;
            private int campo3;
            // ... muitos campos
            
            public void metodo1() { }
            public void metodo2() { }
            public void metodo3() { }
            // ... muitos métodos (20+)
        }
    }
}

// ✅ Preferir classe top-level ou inner class
public class Exemplo {
    // Inner class (se precisa acessar membros da externa)
    private class Helper {
        // ...
    }
    
    public void metodo() {
        Helper helper = new Helper();
        helper.processar();
    }
}
```

### 6. Factory Method com Local Class

```java
// ✅ Factory method retorna instância de local class
public interface Validador {
    boolean validar(String texto);
}

public class ValidadorFactory {
    public static Validador criarValidadorEmail() {
        class ValidadorEmail implements Validador {
            @Override
            public boolean validar(String texto) {
                return texto != null && texto.contains("@");
            }
        }
        
        return new ValidadorEmail();
    }
    
    public static Validador criarValidadorTelefone() {
        class ValidadorTelefone implements Validador {
            @Override
            public boolean validar(String texto) {
                return texto != null && texto.matches("\\d{10,11}");
            }
        }
        
        return new ValidadorTelefone();
    }
}

// Uso
Validador emailValidator = ValidadorFactory.criarValidadorEmail();
System.out.println(emailValidator.validar("teste@email.com")); // true

Validador telefoneValidator = ValidadorFactory.criarValidadorTelefone();
System.out.println(telefoneValidator.validar("11987654321")); // true
```

### 7. Template Method com Local Class

```java
// ✅ Template method com local class
public abstract class Processador {
    public abstract void processar();
}

public class ProcessadorFactory {
    public Processador criar(String tipo) {
        if (tipo.equals("SIMPLES")) {
            class ProcessadorSimples extends Processador {
                @Override
                public void processar() {
                    System.out.println("Processamento simples");
                }
            }
            return new ProcessadorSimples();
        } else if (tipo.equals("COMPLEXO")) {
            class ProcessadorComplexo extends Processador {
                @Override
                public void processar() {
                    System.out.println("Processamento complexo");
                }
            }
            return new ProcessadorComplexo();
        }
        return null;
    }
}
```

### 8. Iterator com Local Class

```java
// ✅ Iterator implementado com local class
import java.util.*;

public class MinhaColecao<T> implements Iterable<T> {
    private List<T> elementos = new ArrayList<>();
    
    public void adicionar(T elemento) {
        elementos.add(elemento);
    }
    
    @Override
    public Iterator<T> iterator() {
        // Local class implementa Iterator
        class ColecaoIterator implements Iterator<T> {
            private int indice = 0;
            
            @Override
            public boolean hasNext() {
                return indice < elementos.size();
            }
            
            @Override
            public T next() {
                if (!hasNext()) {
                    throw new NoSuchElementException();
                }
                return elementos.get(indice++);
            }
        }
        
        return new ColecaoIterator();
    }
}
```

### 9. Documentar Propósito

```java
// ✅ Documentar propósito da local class
public class ProcessadorTexto {
    /**
     * Processa texto e retorna resultado.
     */
    public String processar(String texto) {
        /**
         * Helper local para processamento de texto.
         * Encapsula lógica de transformação.
         */
        class TransformadorTexto {
            public String transformar() {
                return texto.toUpperCase().trim();
            }
        }
        
        TransformadorTexto transformador = new TransformadorTexto();
        return transformador.transformar();
    }
}
```

### 10. Limitar Complexidade

```java
// ✅ Local class simples e focada
public class Calculadora {
    public double calcular(double valor, String operacao) {
        // Local class focada em uma tarefa
        class CalculadoraImposto {
            public double calcularImposto() {
                switch (operacao) {
                    case "FEDERAL": return valor * 0.15;
                    case "ESTADUAL": return valor * 0.10;
                    case "MUNICIPAL": return valor * 0.05;
                    default: return 0;
                }
            }
        }
        
        CalculadoraImposto calc = new CalculadoraImposto();
        return calc.calcularImposto();
    }
}
```

---

## Resumo

**Local class**: declarada **dentro de método**.

```java
public void metodo() {
    class MinhaLocal {
        public void executar() {
            System.out.println("Local class");
        }
    }
    
    MinhaLocal local = new MinhaLocal();
    local.executar();
}
```

**Escopo**: apenas dentro do método.

**Acesso**:
- Membros da classe externa
- Parâmetros do método
- Variáveis locais (efetivamente final)

**Características**:
- Pode ter construtor
- Pode ter múltiplos métodos
- Pode implementar interface
- Pode estender classe
- Múltiplas instâncias permitidas

**Restrições**:
- ❌ Não pode ser static
- ❌ Não pode ter membros static
- ❌ Não pode ter modificadores de acesso (public, private, protected)
- ❌ Variáveis locais acessadas devem ser efetivamente final

**Aplicabilidade**:
- Encapsular lógica usada apenas em um método
- Implementar interfaces localmente
- Criar classes helper temporárias
- Implementar callbacks
- Factory methods

**Boas práticas**:
- Nome descritivo
- Encapsular lógica complexa
- Implementar interface localmente
- Usar para callbacks
- Evitar local class muito grande
- Factory method com local class
- Template method
- Iterator
- Documentar propósito
- Limitar complexidade

**Regra de Ouro**: **Local classes** são declaradas **dentro de métodos** e têm **escopo limitado** a esse método. Úteis para **encapsular lógica** usada apenas localmente. Podem **acessar** membros da classe externa, parâmetros do método e variáveis locais (efetivamente final). **Não podem** ser static nem ter membros static. Use quando a classe é **específica** para o método e não precisa ser reutilizada. Prefira **lambdas** para interfaces funcionais simples (Java 8+).
