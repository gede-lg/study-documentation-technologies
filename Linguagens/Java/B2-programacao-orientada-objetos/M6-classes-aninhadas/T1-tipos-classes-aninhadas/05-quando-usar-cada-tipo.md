# 🎯 Quando Usar Cada Tipo de Classe Aninhada

## 🎯 Introdução e Definição

A decisão sobre **qual tipo de classe aninhada utilizar** é uma questão fundamental de design que impacta **clareza**, **manutenibilidade**, **performance** e **semântica** do código. Java oferece quatro tipos distintos de classes aninhadas — **static nested classes**, **inner classes (non-static)**, **local classes** e **anonymous classes** — cada uma com características, vantagens, limitações e casos de uso específicos. A escolha correta depende de fatores como **necessidade de acesso à instância externa**, **escopo de uso**, **reutilização**, **necessidade de nome**, **complexidade da implementação** e **intenção semântica** do design.

Conceitualmente, a progressão de static nested → inner → local → anonymous representa uma **redução gradual de escopo e formalidade**: static nested classes são quase classes independentes apenas agrupadas logicamente; inner classes estabelecem forte relação com a instância externa; local classes restringem uso a um método específico; anonymous classes são tão localizadas e descartáveis que nem nome possuem. Compreender essas gradações e seus trade-offs é essencial para design orientado a objetos eficaz em Java, permitindo expressar intenção com clareza, manter código limpo e aproveitar as capacidades únicas de cada tipo.

### Contexto Histórico e Motivação

**Evolução das Classes Aninhadas em Java:**

**Java 1.0 (1995)**: Apenas classes top-level. Classes auxiliares poluíam namespace dos pacotes.

**Java 1.1 (1997)**: Adição simultânea de todos os quatro tipos de classes aninhadas:
- **Static nested**: Para organização e encapsulamento sem dependência de instância
- **Inner classes**: Para componentes fortemente acoplados à instância externa
- **Local classes**: Para implementações localizadas a um método
- **Anonymous classes**: Para implementações descartáveis inline (crítico para GUI programming)

**Java 8 (2014)**: Lambdas oferecem alternativa concisa para anonymous classes simples, mas não as substituem completamente.

**Princípio Norteador:**

Cada tipo foi projetado para um **nicho específico**. Usar o tipo errado funciona tecnicamente, mas compromete clareza e intenção do design.

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Critérios de Decisão**: Acesso à outer, escopo de uso, reutilização, complexidade
2. **Trade-offs**: Cada tipo equilibra diferentemente flexibilidade, simplicidade e clareza
3. **Intenção Semântica**: Tipo escolhido comunica intenção do design
4. **Progressão de Escopo**: Static (amplo) → Inner (classe) → Local (método) → Anonymous (inline)
5. **Alternativas Modernas**: Lambdas e method references competem com anonymous/local classes

### Pilares Fundamentais

- **Acesso à Outer Instance**: Determinante chave (precisa? Use inner/local/anonymous; não precisa? Use static nested)
- **Escopo de Visibilidade**: Classe inteira? Inner. Um método? Local. Inline? Anonymous.
- **Reutilização**: Múltiplos métodos? Inner. Um método? Local/Anonymous.
- **Complexidade**: Simples? Anonymous/Lambda. Complexo? Inner/Static nested.
- **Nome Necessário?**: Sim? Static nested/Inner/Local. Não? Anonymous.

## 🧠 Fundamentos Teóricos

### Árvore de Decisão

```
┌─ Precisa acessar membros de INSTÂNCIA da outer?
│
├─ NÃO → STATIC NESTED CLASS
│         • Independente da outer instance
│         • Apenas acessa membros static
│         • Instanciação: new Outer.Nested()
│
└─ SIM → Precisa de nome ou será usada em múltiplos métodos?
         │
         ├─ SIM → INNER CLASS (non-static)
         │         • Referência à outer instance
         │         • Visível em toda a classe
         │         • Instanciação: outer.new Inner()
         │
         └─ NÃO → Usada em apenas um método/bloco?
                   │
                   ├─ SIM → Precisa de nome ou tem múltiplos métodos/construtores?
                   │         │
                   │         ├─ SIM → LOCAL CLASS
                   │         │         • Declarada dentro do método
                   │         │         • Captura variáveis effectively final
                   │         │
                   │         └─ NÃO → ANONYMOUS CLASS
                   │                   • Declaração + instanciação inline
                   │                   • Sem nome
                   │                   • Uso único
                   │
                   └─ NÃO → Reconsiderar se inner class não seria melhor
```

### Tabela Comparativa Completa

| Característica | Static Nested | Inner (Non-Static) | Local | Anonymous |
|----------------|---------------|-------------------|-------|-----------|
| **Acesso à outer instance** | ❌ Não | ✅ Sim (implícito) | ✅ Sim (implícito) | ✅ Sim (implícito) |
| **Acesso a membros private da outer** | ✅ Sim (apenas static) | ✅ Sim (todos) | ✅ Sim (todos) | ✅ Sim (todos) |
| **Captura variáveis locais** | ❌ Não | ❌ Não | ✅ Sim (effectively final) | ✅ Sim (effectively final) |
| **Escopo de visibilidade** | Classe inteira | Classe inteira | Método/bloco | Ponto de criação |
| **Pode ter nome** | ✅ Sim (obrigatório) | ✅ Sim (obrigatório) | ✅ Sim (obrigatório) | ❌ Não |
| **Pode ter modificadores de acesso** | ✅ Sim | ✅ Sim | ❌ Não | ❌ Não |
| **Pode ter membros static** | ✅ Sim | ❌ Não (só final) | ❌ Não (só final) | ❌ Não (só final) |
| **Instanciação** | `new Outer.Nested()` | `outer.new Inner()` | `new Local()` | `new Type() { }` |
| **Substituível por lambda?** | ❌ Não | ❌ Geralmente não | 🟡 Às vezes | 🟡 Se funcional interface |
| **Uso típico** | Helper classes, Builders | Iterators, Views | Algoritmos locais | Callbacks, Listeners |

## 🔍 Análise Conceitual Profunda

### Static Nested Class: Quando Usar

**Use quando:**

1. **Agrupamento Lógico Sem Dependência de Instância**

```java
public class Calculadora {

    // Static nested - helper sem dependência de instância de Calculadora
    public static class ResultadoCompleto {
        public final double valor;
        public final String operacao;
        public final long timestamp;

        public ResultadoCompleto(double valor, String operacao) {
            this.valor = valor;
            this.operacao = operacao;
            this.timestamp = System.currentTimeMillis();
        }
    }

    public static ResultadoCompleto somar(double a, double b) {
        return new ResultadoCompleto(a + b, "soma");
    }
}

// Uso independente
Calculadora.ResultadoCompleto resultado = Calculadora.somar(10, 5);
```

**Razão**: `ResultadoCompleto` está logicamente relacionado a `Calculadora`, mas não precisa de instância dela.

2. **Builder Pattern**

```java
public class Usuario {
    private final String nome;
    private final String email;

    private Usuario(Builder builder) {
        this.nome = builder.nome;
        this.email = builder.email;
    }

    public static class Builder {
        private String nome;
        private String email;

        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public Usuario build() {
            return new Usuario(this);
        }
    }
}
```

**Razão**: Builder cria `Usuario`, mas não depende de instância existente de `Usuario`.

3. **Entry/Node em Estruturas de Dados**

```java
public class HashMap<K, V> {
    static class Node<K, V> {
        final int hash;
        final K key;
        V value;
        Node<K, V> next;
    }
}
```

**Razão**: `Node` não precisa acessar instância específica de `HashMap`.

**Não use quando:**
- Precisa acessar membros de instância da outer → Use **inner class**

---

### Inner Class (Non-Static): Quando Usar

**Use quando:**

1. **Iterator Pattern**

```java
public class MinhaLista<T> {
    private T[] elementos;
    private int tamanho;

    // Inner class - precisa acessar elementos[] e tamanho
    private class Iterador implements Iterator<T> {
        private int posicao = 0;

        public boolean hasNext() {
            return posicao < tamanho;  // Acessa tamanho da outer
        }

        public T next() {
            return elementos[posicao++];  // Acessa elementos da outer
        }
    }

    public Iterator<T> iterator() {
        return new Iterador();
    }
}
```

**Razão**: Iterador precisa acessar estrutura interna (`elementos`, `tamanho`) da lista específica.

2. **Views/Projections de Dados**

```java
public class Produto {
    private String nome;
    private double preco;
    private String detalhesInternos;

    // Inner class - view pública sem detalhes internos
    public class VisaoPublica {
        public String getNome() {
            return nome;  // Acessa outer
        }

        public double getPreco() {
            return preco;  // Acessa outer
        }

        // Não expõe detalhesInternos
    }

    public VisaoPublica criarVisao() {
        return new VisaoPublica();
    }
}
```

**Razão**: View precisa acessar dados da instância específica de `Produto`.

3. **Event Handlers com Estado da Outer**

```java
public class Formulario {
    private JTextField campo;
    private int tentativas = 0;

    public Formulario() {
        campo = new JTextField();

        // Inner class - acessa e modifica estado do formulário
        campo.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                    tentativas++;  // Modifica outer
                    validar();     // Chama método outer
                }
            }
        });
    }

    private void validar() { /* ... */ }
}
```

**Razão**: Listener precisa modificar estado (`tentativas`) e chamar métodos da instância de `Formulario`.

**Não use quando:**
- Não precisa acessar instância da outer → Use **static nested class**
- Usada apenas em um método → Use **local class**

---

### Local Class: Quando Usar

**Use quando:**

1. **Implementação Complexa Localizada a Um Método**

```java
public void ordenar(List<Pessoa> pessoas, String criterio, boolean crescente, boolean ignorarNulos) {

    // Local class - complexa demais para anonymous, usada só aqui
    class ComparadorPersonalizado implements Comparator<Pessoa> {
        @Override
        public int compare(Pessoa p1, Pessoa p2) {
            if (ignorarNulos) {
                if (p1 == null && p2 == null) return 0;
                if (p1 == null) return 1;
                if (p2 == null) return -1;
            }

            int resultado;
            switch (criterio) {
                case "nome":
                    resultado = p1.getNome().compareTo(p2.getNome());
                    break;
                case "idade":
                    resultado = Integer.compare(p1.getIdade(), p2.getIdade());
                    break;
                default:
                    resultado = 0;
            }

            return crescente ? resultado : -resultado;
        }
    }

    Collections.sort(pessoas, new ComparadorPersonalizado());
}
```

**Razão**: Implementação é complexa, captura múltiplas variáveis locais, mas só faz sentido neste método.

2. **Algoritmos com Estado que Captura Contexto**

```java
public int calcularFibonacci(int n, boolean useCache) {

    class CalculadoraFib {
        private Map<Integer, Integer> cache = new HashMap<>();

        int calcular(int num) {
            if (num <= 1) return num;

            if (useCache && cache.containsKey(num)) {
                return cache.get(num);
            }

            int resultado = calcular(num - 1) + calcular(num - 2);

            if (useCache) {
                cache.put(num, resultado);
            }

            return resultado;
        }
    }

    return new CalculadoraFib().calcular(n);
}
```

**Razão**: Calculadora tem estado (`cache`), captura `useCache`, e só é relevante neste método.

3. **Validators/Processors Descartáveis com Múltiplos Métodos**

```java
public boolean validarFormulario(Map<String, String> campos, Map<String, String> regras) {

    class ValidadorComplexo {
        private List<String> erros = new ArrayList<>();

        boolean validarCampo(String nome, String valor) {
            String regra = regras.get(nome);  // Captura regras

            if (regra == null) return true;

            // Lógica complexa de validação
            if (regra.equals("obrigatorio") && valor.isEmpty()) {
                erros.add(nome + " é obrigatório");
                return false;
            }

            // Mais validações...
            return true;
        }

        boolean validarTodos() {
            for (Map.Entry<String, String> entry : campos.entrySet()) {
                validarCampo(entry.getKey(), entry.getValue());
            }
            return erros.isEmpty();
        }

        List<String> getErros() {
            return erros;
        }
    }

    ValidadorComplexo validador = new ValidadorComplexo();
    boolean valido = validador.validarTodos();

    if (!valido) {
        System.out.println("Erros: " + validador.getErros());
    }

    return valido;
}
```

**Razão**: Validador tem múltiplos métodos e estado, mas só faz sentido neste método.

**Não use quando:**
- Implementação simples (1 método, sem estado) → Use **anonymous class** ou **lambda**
- Usada em múltiplos métodos → Use **inner class**

---

### Anonymous Class: Quando Usar

**Use quando:**

1. **Callbacks/Listeners Simples**

```java
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        JOptionPane.showMessageDialog(null, "Clicado!");
    }
});
```

**Razão**: Implementação inline, uso único, não precisa de nome.

2. **Threads com Runnable**

```java
Thread thread = new Thread() {
    @Override
    public void run() {
        System.out.println("Executando thread");
    }
};
thread.start();
```

**Razão**: Customização descartável de `Thread`.

3. **Comparators Simples (pré-Java 8)**

```java
Collections.sort(lista, new Comparator<String>() {
    @Override
    public int compare(String s1, String s2) {
        return s1.length() - s2.length();
    }
});
```

**Razão**: Implementação simples, uso único.

4. **Implementação de Interfaces com Múltiplos Métodos** (quando lambda não serve)

```java
interface Lifecycle {
    void onStart();
    void onStop();
}

Lifecycle lifecycle = new Lifecycle() {
    @Override
    public void onStart() {
        System.out.println("Iniciado");
    }

    @Override
    public void onStop() {
        System.out.println("Parado");
    }
};
```

**Razão**: Interface tem múltiplos métodos — lambda não serve.

**Não use quando:**
- Interface funcional (1 método abstrato) → Use **lambda** (Java 8+)
- Implementação complexa com muitos métodos/estado → Use **local class**
- Precisa de nome para reuso → Use **inner class** ou **local class**

---

## 🎯 Aplicabilidade e Contextos: Casos Práticos

### Cenário 1: Estrutura de Dados Customizada

```java
public class MinhaArvore<T> {

    // STATIC NESTED - Node não precisa de acesso à árvore específica
    private static class No<T> {
        T valor;
        No<T> esquerda;
        No<T> direita;

        No(T valor) {
            this.valor = valor;
        }
    }

    private No<T> raiz;

    // INNER CLASS - Iterator precisa acessar raiz da árvore específica
    private class IteradorEmOrdem implements Iterator<T> {
        private Stack<No<T>> pilha = new Stack<>();

        IteradorEmOrdem() {
            empilharEsquerda(raiz);  // Acessa raiz da outer
        }

        private void empilharEsquerda(No<T> no) {
            while (no != null) {
                pilha.push(no);
                no = no.esquerda;
            }
        }

        @Override
        public boolean hasNext() {
            return !pilha.isEmpty();
        }

        @Override
        public T next() {
            No<T> no = pilha.pop();
            empilharEsquerda(no.direita);
            return no.valor;
        }
    }

    public Iterator<T> iterator() {
        return new IteradorEmOrdem();
    }
}
```

**Decisão**:
- `No`: Static nested (independente, não precisa da árvore)
- `IteradorEmOrdem`: Inner class (depende da raiz da árvore específica)

### Cenário 2: Event Handling Complexo

```java
public class FormularioCadastro extends JPanel {
    private JTextField campoNome;
    private JTextField campoEmail;
    private JButton botaoSalvar;
    private int tentativasSalvamento = 0;

    public FormularioCadastro() {
        // ... inicialização

        // INNER CLASS - Validator usado em múltiplos lugares
        EmailValidator emailValidator = new EmailValidator();

        botaoSalvar.addActionListener(new ActionListener() {  // ANONYMOUS
            @Override
            public void actionPerformed(ActionEvent e) {
                tentativasSalvamento++;  // Acessa outer

                if (emailValidator.validar(campoEmail.getText())) {
                    salvar();
                } else {
                    mostrarErro("Email inválido (tentativa " + tentativasSalvamento + ")");
                }
            }
        });
    }

    // INNER CLASS - precisa acessar campos da outer
    private class EmailValidator {
        private Pattern pattern = Pattern.compile("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");

        boolean validar(String email) {
            return pattern.matcher(email).matches();
        }
    }

    private void salvar() { /* ... */ }
    private void mostrarErro(String msg) { /* ... */ }
}
```

**Decisão**:
- `EmailValidator`: Inner class (usado em múltiplos métodos, acessa estado se necessário)
- ActionListener: Anonymous (implementação simples inline)

## ⚠️ Armadilhas e Anti-Patterns

### Anti-Pattern 1: Static Nested Quando Inner É Necessária

```java
// ❌ Ruim - static nested não pode acessar instância
public class Lista {
    private Object[] elementos;

    public static class Iterador {  // Static - ERRO conceitual!
        public Object next() {
            // return elementos[i++];  // ❌ NÃO COMPILA - elementos é de instância
        }
    }
}

// ✅ Correto - inner class
public class Lista {
    private Object[] elementos;

    public class Iterador {  // Non-static
        public Object next() {
            return elementos[i++];  // ✅ Acessa outer
        }
    }
}
```

### Anti-Pattern 2: Inner Class Quando Static Nested Bastaria

```java
// ❌ Desperdício - inner class desnecessária
public class Util {
    public class Resultado {  // Non-static - mas não usa outer!
        private int valor;
        public Resultado(int valor) {
            this.valor = valor;
        }
    }
}

// ✅ Correto - static nested
public class Util {
    public static class Resultado {  // Static - sem overhead
        private int valor;
        public Resultado(int valor) {
            this.valor = valor;
        }
    }
}
```

**Problema**: Inner class mantém referência oculta à outer (overhead de memória), mesmo não usando.

## 🔗 Interconexões Conceituais

**Relação com Encapsulamento**: Classes aninhadas fortalecem encapsulamento (acesso a private).

**Relação com Closures**: Local e anonymous classes implementam closures.

**Relação com Lambdas**: Lambdas substituem anonymous classes simples.

**Relação com Design Patterns**: Iterator, Builder, Strategy usam classes aninhadas.

## 🚀 Evolução e Boas Práticas Modernas

**Java 8+**: Prefira lambdas para interfaces funcionais:

```java
// Pré-Java 8
Collections.sort(lista, new Comparator<String>() {
    public int compare(String s1, String s2) {
        return s1.compareTo(s2);
    }
});

// Java 8+
lista.sort((s1, s2) -> s1.compareTo(s2));
// Ou ainda melhor:
lista.sort(String::compareTo);
```

**Guideline Final**: "Use o tipo mais restritivo que atenda suas necessidades" — se anonymous serve, não use local; se local serve, não use inner; se static nested serve, não use inner.
