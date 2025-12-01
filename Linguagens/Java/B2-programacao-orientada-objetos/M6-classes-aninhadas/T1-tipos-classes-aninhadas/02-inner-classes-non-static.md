# 🔗 Inner Classes (Non-Static)

## 🎯 Introdução e Definição

**Inner classes** (classes internas não-estáticas) são classes declaradas **dentro de outra classe sem o modificador `static`**, criando uma relação de **dependência de instância** onde cada objeto da classe interna está **intrinsecamente associado** a uma instância específica da classe externa (envolvente ou outer class). Diferentemente de static nested classes, uma inner class possui uma **referência implícita oculta** à instância da classe que a contém, acessível através da sintaxe especial `ClasseExterna.this`, permitindo acesso direto e irrestrito a **todos os membros da classe externa** (incluindo private), mesmo membros de instância, criando uma ligação comportamental estreita entre os objetos.

Conceitualmente, inner classes representam **objetos que não fazem sentido existir independentemente** de uma instância da classe externa — são **componentes internos** ou **partes constituintes** que dependem do contexto fornecido pelo objeto envolvente. A relação é de **composição forte**: a inner class é uma "parte de" ou "aspecto de" a outer class. Essa dependência estrutural e comportamental as torna ideais para implementar **iteradores**, **event handlers**, **callbacks**, **views de dados** e outros padrões onde o objeto interno precisa manter estado relacionado ao objeto externo e acessar sua implementação interna.

### Contexto Histórico e Motivação

**Java 1.1 (1997): Inner Classes como Resposta a Limitações**

Inner classes foram introduzidas junto com static nested classes, mas com motivação diferente:

**Problemas Antes de Inner Classes:**

1. **Impossibilidade de Callbacks Tipados**: Sem classes anônimas/inner, callbacks requeriam classes top-level verbosas
2. **Iteradores Complexos**: Implementar iteradores personalizados exigia classes separadas sem acesso aos internals
3. **Event Handling Verboso**: GUI programming (AWT/Swing) era extremamente verboso
4. **Quebra de Encapsulamento**: Classes auxiliares não podiam acessar membros private da principal

**Solução com Inner Classes:**

```java
// Antes (Java 1.0) - Iterador externo sem acesso aos internals
public class MinhaLista {
    private Object[] elementos;

    // Tinha que expor elementos ou criar métodos auxiliares
    Object[] getElementosParaIterador() { return elementos; }  // ❌ Quebra encapsulamento
}

class MinhaListaIterador {
    MinhaLista lista;
    int indice = 0;

    MinhaListaIterador(MinhaLista lista) {
        this.lista = lista;
    }

    boolean hasNext() {
        return indice < lista.getElementosParaIterador().length;  // Acesso indireto
    }
}

// Depois (Java 1.1+) - Inner class com acesso direto
public class MinhaLista {
    private Object[] elementos;

    public Iterator iterator() {
        return new Iterador();  // Inner class
    }

    private class Iterador implements Iterator {
        int indice = 0;

        public boolean hasNext() {
            return indice < elementos.length;  // ✅ Acesso direto a private!
        }

        public Object next() {
            return elementos[indice++];
        }
    }
}
```

**Influência de Outras Linguagens:**

Inner classes foram inspiradas por conceitos similares em:
- **Beta** (linguagem dos anos 1970): nested classes com acesso ao contexto externo
- **Simula**: Block structure com acesso a escopo envolvente

### Problema que Resolve

**1. Iteradores Sem Quebra de Encapsulamento**

```java
public class ListaPersonalizada<T> {
    private T[] elementos;
    private int tamanho;

    // Inner class Iterator com acesso total aos internals
    private class MeuIterador implements Iterator<T> {
        private int posicao = 0;

        @Override
        public boolean hasNext() {
            return posicao < tamanho;  // Acessa tamanho diretamente
        }

        @Override
        public T next() {
            return elementos[posicao++];  // Acessa elementos diretamente
        }
    }

    public Iterator<T> iterator() {
        return new MeuIterador();
    }
}
```

**2. Event Handlers com Contexto**

```java
public class BotaoPersonalizado {
    private String label;
    private int clickCount = 0;

    // Inner class para event handler
    private class ClickListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            clickCount++;  // Acessa estado da outer class
            System.out.println(label + " clicado " + clickCount + " vezes");
        }
    }

    public BotaoPersonalizado(String label) {
        this.label = label;
        button.addActionListener(new ClickListener());
    }
}
```

**3. Views de Dados Dependentes**

```java
public class Usuario {
    private String nomeCompleto;
    private String email;
    private String senha;  // Sensível

    // Inner class: view pública sem dados sensíveis
    public class ViewPublica {
        public String getNome() {
            return nomeCompleto;  // Acessa dados da outer
        }

        public String getEmail() {
            return email;
        }

        // Não expõe senha
    }

    public ViewPublica criarViewPublica() {
        return new ViewPublica();
    }
}
```

### Importância no Ecossistema Java

**Collections Framework:**

```java
// ArrayList.Itr é inner class
public class ArrayList<E> {
    private class Itr implements Iterator<E> {
        int cursor;
        int lastRet = -1;

        public boolean hasNext() {
            return cursor != size;  // Acessa size de ArrayList
        }

        public E next() {
            return elementData[cursor++];  // Acessa elementData
        }
    }
}
```

**Swing/AWT (GUI):**

```java
button.addActionListener(new ActionListener() {  // Anonymous inner class
    public void actionPerformed(ActionEvent e) {
        // Acessa variáveis da classe envolvente
    }
});
```

**Padrões de Design:**

- **Iterator Pattern**: Implementação padrão usa inner classes
- **Strategy Pattern**: Inner classes como estratégias com contexto
- **Observer Pattern**: Listeners como inner classes

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Dependência de Instância**: Inner class só existe em associação com instância da outer class
2. **Referência Implícita**: Mantém referência oculta à outer instance (`OuterClass.this`)
3. **Acesso Total**: Pode acessar TODOS os membros da outer (incluindo private)
4. **Instanciação Dependente**: Requer instância da outer para criar inner
5. **Forte Acoplamento**: Comportamento entrelaçado com a outer class

### Pilares Fundamentais

- **Sem `static`**: Ausência do modificador static é essencial
- **Sintaxe `Outer.this`**: Referência explícita à instância externa
- **Instanciação**: `outer.new InnerClass()`
- **Acesso Bidirecional a Private**: Ambas veem membros private uma da outra
- **Não Pode Ter Membros Static**: Inner classes não podem declarar membros static (exceto constantes final)

### Visão Geral das Nuances

- **Shadowing**: Inner class pode ter membros com mesmo nome da outer
- **Qualificação**: Usar `OuterClass.this.membro` para desambiguar
- **Modificadores de Acesso**: Pode ser private, protected, public, default
- **Herda de Qualquer Classe**: Pode estender classe e implementar interfaces
- **Serialização Complexa**: Serializar inner class serializa outer implicitamente

## 🧠 Fundamentos Teóricos

### Anatomia de Inner Class

```java
public class ClasseExterna {

    // Membros da classe externa
    private String atributoExterno = "Externo";
    private static String atributoEstatico = "Estático";

    // ========== INNER CLASS (NON-STATIC) ==========

    public class ClasseInterna {

        private String atributoInterno = "Interno";

        public void metodoInterno() {
            // ✅ Acessa membros de instância da outer
            System.out.println(atributoExterno);

            // ✅ Acessa membros static da outer
            System.out.println(atributoEstatico);

            // ✅ Referência explícita à outer instance
            System.out.println(ClasseExterna.this.atributoExterno);

            // ✅ Acessa próprios membros
            System.out.println(atributoInterno);
        }

        // ❌ NÃO PODE declarar membros static (exceto final)
        // private static int contador;  // ERRO!

        // ✅ Constantes final são permitidas
        private static final int CONSTANTE = 100;
    }

    public void metodoExterno() {
        // Criar instância de inner class
        ClasseInterna interna = new ClasseInterna();
        interna.metodoInterno();

        // ✅ Outer pode acessar membros private da inner
        System.out.println(interna.atributoInterno);
    }
}
```

### Referência Implícita: `OuterClass.this`

**Mecanismo Interno:**

Quando você cria uma inner class, o compilador Java adiciona automaticamente:

1. **Campo oculto** na inner class que referencia a outer instance
2. **Parâmetro adicional** nos construtores da inner class recebendo outer reference

**Visualização:**

```java
// Código fonte (o que você escreve)
public class Outer {
    private int x = 10;

    public class Inner {
        public void mostrar() {
            System.out.println(x);  // Acesso implícito
        }
    }
}

// Bytecode aproximado (o que o compilador gera)
public class Outer {
    private int x = 10;

    public class Inner {
        final Outer this$0;  // Campo sintético oculto

        Inner(Outer outer) {  // Construtor sintético
            this.this$0 = outer;
        }

        public void mostrar() {
            System.out.println(this$0.x);  // Acesso via referência oculta
        }
    }
}
```

**Uso Explícito:**

```java
public class Outer {
    private String nome = "Outer";

    public class Inner {
        private String nome = "Inner";  // Shadowing

        public void mostrar() {
            System.out.println(nome);              // "Inner" - inner's nome
            System.out.println(this.nome);         // "Inner" - inner's nome
            System.out.println(Outer.this.nome);   // "Outer" - outer's nome
        }
    }
}
```

### Instanciação de Inner Classes

**Instanciação Normal (dentro da outer):**

```java
public class Outer {
    public class Inner { }

    public void metodo() {
        Inner inner = new Inner();  // Simples - "this" implícito
    }
}
```

**Instanciação Externa (fora da outer):**

```java
public class Teste {
    public static void main(String[] args) {
        // 1. Criar instância da outer class
        Outer outer = new Outer();

        // 2. Usar outer instance para criar inner
        Outer.Inner inner = outer.new Inner();
        //                  ^^^^^ Sintaxe especial

        // Cada outer instance pode ter múltiplas inner instances
        Outer.Inner inner2 = outer.new Inner();
    }
}
```

**Sintaxe Completa:**

```
outerInstance.new InnerClass(argumentos)
```

**Múltiplas Outer Instances, Múltiplas Inner Instances:**

```java
Outer outer1 = new Outer();
Outer outer2 = new Outer();

Outer.Inner inner1 = outer1.new Inner();  // Associada a outer1
Outer.Inner inner2 = outer2.new Inner();  // Associada a outer2

// inner1 acessa estado de outer1
// inner2 acessa estado de outer2
```

## 🔍 Análise Conceitual Profunda

### Caso 1: Iterator Pattern

```java
public class ListaCustomizada<T> {
    private No<T> primeiro;
    private int tamanho = 0;

    // Classe Node (static nested - não precisa de outer instance)
    private static class No<T> {
        T valor;
        No<T> proximo;

        No(T valor) {
            this.valor = valor;
        }
    }

    public void adicionar(T elemento) {
        No<T> novo = new No<>(elemento);
        if (primeiro == null) {
            primeiro = novo;
        } else {
            No<T> atual = primeiro;
            while (atual.proximo != null) {
                atual = atual.proximo;
            }
            atual.proximo = novo;
        }
        tamanho++;
    }

    // ========== INNER CLASS: ITERATOR ==========

    private class IteradorLista implements Iterator<T> {
        private No<T> atual = primeiro;  // Acessa "primeiro" da outer

        @Override
        public boolean hasNext() {
            return atual != null;
        }

        @Override
        public T next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            T valor = atual.valor;
            atual = atual.proximo;
            return valor;
        }
    }

    public Iterator<T> iterator() {
        return new IteradorLista();  // Nova inner instance
    }
}

// Uso
ListaCustomizada<String> lista = new ListaCustomizada<>();
lista.adicionar("A");
lista.adicionar("B");
lista.adicionar("C");

Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    System.out.println(it.next());  // A B C
}
```

**Análise:**
- `IteradorLista` é inner class — precisa de acesso a `primeiro`
- Cada chamada a `iterator()` cria nova inner instance
- Cada iterador mantém próprio estado (`atual`) mas acessa estrutura compartilhada da lista

### Caso 2: Event Handling

```java
public class Formulario {
    private JTextField campoNome;
    private JButton botaoSubmit;
    private int tentativasSubmit = 0;

    public Formulario() {
        campoNome = new JTextField(20);
        botaoSubmit = new JButton("Enviar");

        // Inner class como ActionListener
        botaoSubmit.addActionListener(new SubmitListener());
    }

    // ========== INNER CLASS: EVENT LISTENER ==========

    private class SubmitListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            tentativasSubmit++;  // Acessa contador da outer

            String nome = campoNome.getText();  // Acessa campo da outer

            if (nome == null || nome.trim().isEmpty()) {
                JOptionPane.showMessageDialog(null,
                    "Nome obrigatório! Tentativa " + tentativasSubmit);
            } else {
                JOptionPane.showMessageDialog(null,
                    "Formulário enviado por: " + nome);
                tentativasSubmit = 0;  // Reseta contador
            }
        }
    }
}
```

**Análise:**
- `SubmitListener` precisa acessar estado do formulário
- Inner class mantém acoplamento natural com outer
- Pode modificar estado da outer (tentativasSubmit)

### Caso 3: Views de Dados

```java
public class ContaBancaria {
    private String titular;
    private double saldo;
    private List<String> transacoes;

    public ContaBancaria(String titular, double saldoInicial) {
        this.titular = titular;
        this.saldo = saldoInicial;
        this.transacoes = new ArrayList<>();
        transacoes.add("Saldo inicial: " + saldoInicial);
    }

    public void depositar(double valor) {
        saldo += valor;
        transacoes.add("Depósito: +" + valor);
    }

    public void sacar(double valor) {
        if (saldo >= valor) {
            saldo -= valor;
            transacoes.add("Saque: -" + valor);
        }
    }

    // ========== INNER CLASS: VIEW PÚBLICA ==========

    public class ExtratoView {
        public String getTitular() {
            return titular;  // Acessa outer
        }

        public double getSaldoAtual() {
            return saldo;  // Acessa outer
        }

        public List<String> getTransacoes() {
            return new ArrayList<>(transacoes);  // Cópia defensiva
        }

        public void imprimirExtrato() {
            System.out.println("===== EXTRATO =====");
            System.out.println("Titular: " + titular);
            System.out.println("Saldo: R$ " + saldo);
            System.out.println("\nTransações:");
            transacoes.forEach(t -> System.out.println("  " + t));
            System.out.println("===================");
        }
    }

    public ExtratoView gerarExtrato() {
        return new ExtratoView();
    }
}

// Uso
ContaBancaria conta = new ContaBancaria("João Silva", 1000.0);
conta.depositar(500.0);
conta.sacar(200.0);

ContaBancaria.ExtratoView extrato = conta.gerarExtrato();
extrato.imprimirExtrato();
```

**Análise:**
- `ExtratoView` é inner class — acessa dados sensíveis da conta
- Cada view está ligada a uma conta específica
- Encapsula lógica de apresentação separada da lógica de negócio

### Caso 4: Strategy Pattern com Contexto

```java
public class TextProcessor {
    private String texto;

    public TextProcessor(String texto) {
        this.texto = texto;
    }

    // ========== INNER CLASSES: STRATEGIES ==========

    public class UpperCaseStrategy implements ProcessingStrategy {
        @Override
        public String processar() {
            return texto.toUpperCase();  // Acessa texto da outer
        }
    }

    public class LowerCaseStrategy implements ProcessingStrategy {
        @Override
        public String processar() {
            return texto.toLowerCase();
        }
    }

    public class ReverseStrategy implements ProcessingStrategy {
        @Override
        public String processar() {
            return new StringBuilder(texto).reverse().toString();
        }
    }

    public String processar(ProcessingStrategy strategy) {
        return strategy.processar();
    }

    interface ProcessingStrategy {
        String processar();
    }
}

// Uso
TextProcessor processor = new TextProcessor("Hello World");

System.out.println(processor.processar(processor.new UpperCaseStrategy()));
// HELLO WORLD

System.out.println(processor.processar(processor.new ReverseStrategy()));
// dlroW olleH
```

**Análise:**
- Strategies são inner classes — cada uma opera sobre o texto da outer
- Padrão Strategy com contexto implícito

## 🎯 Aplicabilidade e Contextos

### Quando Usar Inner Classes

**1. Implementação de Iteradores**

Quando precisa acessar estrutura interna para iterar:

```java
public class MinhaColecao<T> {
    private T[] elementos;

    private class MeuIterador implements Iterator<T> {
        int indice = 0;

        public boolean hasNext() {
            return indice < elementos.length;
        }

        public T next() {
            return elementos[indice++];
        }
    }
}
```

**2. Event Listeners com Estado**

Quando listener precisa modificar estado da classe:

```java
private class BotaoListener implements ActionListener {
    public void actionPerformed(ActionEvent e) {
        contador++;  // Modifica estado da outer
        atualizarInterface();
    }
}
```

**3. Views/Projections de Dados**

Quando precisa criar "visões" de dados internos:

```java
public class DadosComplexos {
    private int[] dados;

    public class VisaoSomenteLeitura {
        public int get(int index) {
            return dados[index];
        }
        // Sem métodos de modificação
    }
}
```

**4. Implementações de Callback com Contexto**

Quando callback precisa de acesso ao contexto:

```java
private class ProcessamentoConcluido implements Callback {
    public void onComplete() {
        finalizarProcessamento();  // Método da outer
        notificarUsuario();
    }
}
```

## ⚠️ Limitações e Considerações Teóricas

### Limitação 1: Não Pode Ter Membros Static

```java
public class Outer {
    public class Inner {
        // private static int contador;  // ❌ ERRO!

        // ✅ Apenas constantes final são permitidas
        private static final int MAX = 100;
    }
}
```

**Razão**: Inner class está ligada a instância, static members pertencem à classe.

### Limitação 2: Serialização Complexa

```java
public class Outer implements Serializable {
    public class Inner implements Serializable {
        // Ao serializar Inner, Outer também é serializada!
    }
}
```

**Cuidado**: Serializar inner class serializa outer implicitamente.

### Limitação 3: Referência Oculta Pode Causar Memory Leaks

```java
public class Activity {
    private byte[] bigData = new byte[1000000];

    public Runnable criarRunnable() {
        return new Runnable() {  // Anonymous inner class
            public void run() {
                // Mesmo não usando bigData, referência à Activity persiste
            }
        };
    }
}
```

**Problema**: Inner class mantém referência à outer, impedindo GC.

## 🔗 Interconexões Conceituais

**Relação com Static Nested Classes (T1-M6)**: Inner classes têm referência à outer; static nested não têm.

**Relação com Iterator Pattern**: Padrão clássico implementado com inner classes.

**Relação com Encapsulamento**: Inner classes fortalecem encapsulamento ao acessar internals diretamente.

**Relação com Anonymous Classes (T5-M6)**: Anonymous classes são um tipo especial de inner class.

## 🚀 Evolução e Próximos Conceitos

Com domínio de inner classes, você está preparado para:

**Local Classes**: Classes declaradas dentro de métodos

**Anonymous Classes**: Inner classes sem nome

**Lambda Expressions (Java 8+)**: Substituem muitos usos de anonymous inner classes

**Method References**: Sintaxe concisa para callbacks
