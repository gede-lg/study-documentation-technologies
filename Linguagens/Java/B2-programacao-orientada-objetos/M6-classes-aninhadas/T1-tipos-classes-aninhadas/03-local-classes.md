# 📍 Local Classes

## 🎯 Introdução e Definição

**Local classes** (classes locais) são classes declaradas **dentro do corpo de um método, construtor ou bloco de inicialização**, tendo **escopo limitado** exclusivamente ao bloco onde são definidas, invisíveis fora desse contexto. Conceitualmente, são uma forma ainda mais restrita de inner class (classe interna), compartilhando a característica de possuir **referência implícita à instância da classe envolvente**, mas adicionando a capacidade de **capturar variáveis locais** do método onde são declaradas, desde que essas variáveis sejam **efetivamente finais** (effectively final) — não modificadas após inicialização.

Local classes representam o conceito de **closures** (fechamentos) em Java — funções que "capturam" o ambiente léxico onde foram definidas. Diferentemente de inner classes normais que são membros da classe externa, local classes são **temporárias e localizadas**, existindo apenas durante a execução do método que as define, sendo descartadas ao término do escopo. Essa característica as torna ideais para **implementações descartáveis de interfaces**, **callbacks únicos**, **algoritmos localizados com estado** e outros cenários onde uma classe completa é necessária, mas apenas em um contexto muito específico e limitado.

### Contexto Histórico e Motivação

**Java 1.1 (1997): Adição Junto com Nested Classes**

Local classes foram introduzidas simultaneamente com inner classes e anonymous classes, fazendo parte do pacote de melhorias que tornaram Java mais expressivo para GUI programming e event-driven programming.

**Problema que Motivou Local Classes:**

Antes de Java 1.1, se você precisava de uma classe para uso exclusivo dentro de um método, tinha duas opções ruins:

1. **Criar classe top-level**: Poluía namespace e era visível globalmente mesmo sendo usada uma vez
2. **Criar inner class como membro**: Visível em toda a classe externa, mesmo sendo usada em um único método

**Exemplo do Problema:**

```java
// Java 1.0 - classe top-level para uso único
class ValidadorTemporario implements Validator {
    private String contexto;

    ValidadorTemporario(String contexto) {
        this.contexto = contexto;
    }

    public boolean validate(String input) {
        return input.contains(contexto);
    }
}

public class Formulario {
    public void validarCampo(String input, String contexto) {
        Validator v = new ValidadorTemporario(contexto);
        if (v.validate(input)) {
            // ...
        }
    }
}
```

**Solução com Local Class:**

```java
// Java 1.1+ - local class
public class Formulario {
    public void validarCampo(String input, String contexto) {
        // Local class - visível apenas neste método
        class ValidadorLocal implements Validator {
            public boolean validate(String input) {
                return input.contains(contexto);  // Captura variável local
            }
        }

        Validator v = new ValidadorLocal();
        if (v.validate(input)) {
            // ...
        }
    }
}
```

**Conceito de Effectively Final (Java 8+):**

Inicialmente (Java 1.1-7), variáveis capturadas precisavam ser explicitamente `final`:

```java
// Java 1.1-7
public void metodo(final String param) {  // final explícito
    final int local = 10;

    class Local {
        void usar() {
            System.out.println(param + local);
        }
    }
}
```

Java 8 (2014) introduziu **effectively final** — variáveis que não são modificadas após inicialização são tratadas como final automaticamente:

```java
// Java 8+
public void metodo(String param) {  // Effectively final
    int local = 10;  // Effectively final

    class Local {
        void usar() {
            System.out.println(param + local);  // ✅ OK
        }
    }
}
```

### Problema que Resolve

**1. Encapsulamento Ultra-Localizado**

Quando implementação é necessária apenas em um método:

```java
public void processarDados(List<String> dados, String filtro) {
    // Local class - existe apenas neste método
    class FiltroPersonalizado implements Predicate<String> {
        public boolean test(String s) {
            return s.contains(filtro);  // Captura filtro
        }
    }

    List<String> filtrados = dados.stream()
                                   .filter(new FiltroPersonalizado())
                                   .collect(Collectors.toList());
}
```

**2. Acesso a Contexto Local + Outer Instance**

Local class pode acessar:
- Variáveis locais (se effectively final)
- Parâmetros do método
- Membros da classe externa

```java
public class Processador {
    private String prefixo = "[PROC]";

    public void processar(String mensagem, int nivel) {
        class LoggerLocal {
            void log(String msg) {
                // Acessa prefixo (outer), mensagem e nivel (locais)
                System.out.println(prefixo + " [Nivel " + nivel + "] " + mensagem + ": " + msg);
            }
        }

        LoggerLocal logger = new LoggerLocal();
        logger.log("Iniciando");
        // processamento
        logger.log("Concluído");
    }
}
```

**3. Implementações Descartáveis de Interfaces**

Quando precisa implementar interface apenas uma vez:

```java
public void ordenar(List<Pessoa> pessoas, final String criterio) {
    class ComparadorPersonalizado implements Comparator<Pessoa> {
        public int compare(Pessoa p1, Pessoa p2) {
            if ("nome".equals(criterio)) {
                return p1.getNome().compareTo(p2.getNome());
            } else if ("idade".equals(criterio)) {
                return Integer.compare(p1.getIdade(), p2.getIdade());
            }
            return 0;
        }
    }

    Collections.sort(pessoas, new ComparadorPersonalizado());
}
```

### Importância no Ecossistema Java

**Antes de Lambdas (Java 1.1-7):**

Local classes e anonymous classes eram a principal forma de criar callbacks e implementações descartáveis.

**Após Lambdas (Java 8+):**

Muitos usos de local classes foram substituídos por lambdas:

```java
// Java 7 - Local class
public void processar(List<String> lista, String filtro) {
    class Filtro implements Predicate<String> {
        public boolean test(String s) {
            return s.contains(filtro);
        }
    }
    lista.removeIf(new Filtro());
}

// Java 8+ - Lambda
public void processar(List<String> lista, String filtro) {
    lista.removeIf(s -> s.contains(filtro));
}
```

**Quando Local Classes Ainda São Necessárias:**

- Quando precisa de múltiplos métodos (lambdas têm apenas um)
- Quando precisa de estado mutável na classe
- Quando precisa implementar múltiplas interfaces
- Quando precisa de construtores

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Escopo de Método**: Declaradas e visíveis apenas dentro do método/bloco
2. **Captura de Variáveis**: Acessa variáveis locais effectively final
3. **Referência à Outer**: Mantém referência implícita à instância da classe externa
4. **Ciclo de Vida Limitado**: Existe apenas durante execução do método
5. **Closure Behavior**: Comportamento de fechamento (closure) capturando ambiente

### Pilares Fundamentais

- **Declaração Local**: Dentro de método, construtor ou bloco de inicialização
- **Effectively Final**: Variáveis capturadas não podem ser modificadas
- **Não Pode Ser `static`**: Local classes são sempre non-static (ligadas à instância)
- **Acesso Triplo**: Outer members + parâmetros do método + variáveis locais
- **Sem Modificadores de Acesso**: Não pode ter public, private, protected (apenas default)

### Visão Geral das Nuances

- **Não Pode Ter Membros Static**: Exceto constantes `static final`
- **Pode Estender e Implementar**: Pode estender classe e implementar interfaces
- **Shadowing**: Pode sombrear nomes da outer class e do método
- **Inicialização**: Pode ter construtores normais
- **Nome**: Deve ter nome (diferente de anonymous classes)

## 🧠 Fundamentos Teóricos

### Anatomia de Local Class

```java
public class ClasseExterna {
    private String atributoExterno = "Externo";

    public void metodo(String parametro) {
        String variavel Local = "Local";

        // ========== LOCAL CLASS ==========

        class ClasseLocal {
            private String atributoLocal = "Interno";

            public void mostrar() {
                // ✅ Acessa membro da outer class
                System.out.println(atributoExterno);

                // ✅ Acessa parâmetro do método
                System.out.println(parametro);

                // ✅ Acessa variável local (effectively final)
                System.out.println(variavelLocal);

                // ✅ Acessa próprio atributo
                System.out.println(atributoLocal);

                // ✅ Referência explícita à outer
                System.out.println(ClasseExterna.this.atributoExterno);
            }
        }

        // Usar local class
        ClasseLocal obj = new ClasseLocal();
        obj.mostrar();

    }  // ClasseLocal não existe além deste ponto
}
```

### Effectively Final: Regra Fundamental

**Conceito:**

Uma variável é **effectively final** se ela não é modificada após sua inicialização, mesmo sem ser declarada `final`.

**Válido:**

```java
public void metodo() {
    String nome = "João";  // Effectively final - não muda
    int idade = 30;        // Effectively final - não muda

    class Local {
        void mostrar() {
            System.out.println(nome + ", " + idade);  // ✅ OK
        }
    }
}
```

**Inválido:**

```java
public void metodo() {
    String nome = "João";
    nome = "Maria";  // ❌ Não é effectively final

    class Local {
        void mostrar() {
            System.out.println(nome);  // ❌ ERRO de compilação
        }
    }
}
```

**Razão da Restrição:**

Local classes podem sobreviver ao método onde foram criadas (se instância é retornada). Variáveis locais vivem na stack e são destruídas ao fim do método. Java copia valores de variáveis capturadas para a instância da local class. Se variável pudesse mudar, haveria inconsistência.

**Visualização:**

```java
public Runnable criarRunnable(int valor) {
    class RunnableLocal implements Runnable {
        public void run() {
            System.out.println(valor);  // Cópia de "valor" é armazenada
        }
    }
    return new RunnableLocal();
}

Runnable r = criarRunnable(42);
// Método terminou, stack foi destruída, mas "valor" (cópia) persiste em r
r.run();  // Imprime 42
```

### Escopo e Visibilidade

```java
public class Exemplo {
    public void metodo1() {
        class ClasseLocal1 {
            void metodo() { }
        }

        ClasseLocal1 obj = new ClasseLocal1();  // ✅ OK
    }

    public void metodo2() {
        // ClasseLocal1 obj = new ClasseLocal1();  // ❌ ERRO - não visível aqui

        class ClasseLocal2 {
            void metodo() { }
        }
    }
}
```

**Conceito**: Cada método tem suas próprias local classes, invisíveis entre si.

## 🔍 Análise Conceitual Profunda

### Caso 1: Comparator Personalizado

```java
public class GerenciadorPessoas {
    private List<Pessoa> pessoas;

    public List<Pessoa> ordenarPor(String criterio, boolean crescente) {
        // Local class captura criterio e crescente
        class ComparadorDinamico implements Comparator<Pessoa> {

            @Override
            public int compare(Pessoa p1, Pessoa p2) {
                int resultado;

                switch (criterio) {
                    case "nome":
                        resultado = p1.getNome().compareTo(p2.getNome());
                        break;
                    case "idade":
                        resultado = Integer.compare(p1.getIdade(), p2.getIdade());
                        break;
                    case "salario":
                        resultado = Double.compare(p1.getSalario(), p2.getSalario());
                        break;
                    default:
                        resultado = 0;
                }

                // Usa variável capturada "crescente"
                return crescente ? resultado : -resultado;
            }
        }

        List<Pessoa> copia = new ArrayList<>(pessoas);
        Collections.sort(copia, new ComparadorDinamico());
        return copia;
    }
}

// Uso
GerenciadorPessoas gp = new GerenciadorPessoas();
List<Pessoa> porNome = gp.ordenarPor("nome", true);
List<Pessoa> porIdadeDesc = gp.ordenarPor("idade", false);
```

**Análise:**
- `ComparadorDinamico` captura `criterio` e `crescente`
- Implementação completa de interface com lógica complexa
- Descartável — não polui namespace da classe

### Caso 2: Validator com Contexto

```java
public class FormularioValidator {
    private Map<String, String> regras;

    public boolean validarCampo(String nomeCampo, String valor, int tentativa) {
        String regra = regras.get(nomeCampo);

        // Local class com contexto complexo
        class ValidadorContextual {
            private String mensagemErro;

            boolean validar() {
                if (regra == null) {
                    mensagemErro = "Campo sem regra de validação";
                    return false;
                }

                if (regra.equals("obrigatorio") && valor.isEmpty()) {
                    mensagemErro = "Campo obrigatório (tentativa " + tentativa + ")";
                    return false;
                }

                if (regra.equals("email") && !valor.contains("@")) {
                    mensagemErro = "Email inválido";
                    return false;
                }

                if (regra.startsWith("minLength:")) {
                    int min = Integer.parseInt(regra.substring(10));
                    if (valor.length() < min) {
                        mensagemErro = "Mínimo " + min + " caracteres";
                        return false;
                    }
                }

                return true;
            }

            String getMensagemErro() {
                return mensagemErro;
            }
        }

        ValidadorContextual validador = new ValidadorContextual();
        boolean valido = validador.validar();

        if (!valido) {
            System.out.println("Erro em " + nomeCampo + ": " + validador.getMensagemErro());
        }

        return valido;
    }
}
```

**Análise:**
- Local class com múltiplos métodos e estado interno
- Captura variáveis locais (`regra`, `valor`, `tentativa`)
- Lógica complexa encapsulada localmente

### Caso 3: Iterator com Filtro

```java
public class ColecaoFiltrada<T> {
    private List<T> elementos;

    public Iterator<T> iteratorComFiltro(Predicate<T> filtro) {
        // Local class implementando Iterator
        class IteradorFiltrado implements Iterator<T> {
            private int indice = 0;
            private T proximo = encontrarProximo();

            private T encontrarProximo() {
                while (indice < elementos.size()) {
                    T elemento = elementos.get(indice++);
                    if (filtro.test(elemento)) {  // Usa filtro capturado
                        return elemento;
                    }
                }
                return null;
            }

            @Override
            public boolean hasNext() {
                return proximo != null;
            }

            @Override
            public T next() {
                if (proximo == null) {
                    throw new NoSuchElementException();
                }
                T atual = proximo;
                proximo = encontrarProximo();
                return atual;
            }
        }

        return new IteradorFiltrado();
    }
}

// Uso
ColecaoFiltrada<Integer> colecao = new ColecaoFiltrada<>(Arrays.asList(1, 2, 3, 4, 5, 6));
Iterator<Integer> pares = colecao.iteratorComFiltro(n -> n % 2 == 0);

while (pares.hasNext()) {
    System.out.println(pares.next());  // 2, 4, 6
}
```

**Análise:**
- Local class com estado complexo (indice, proximo)
- Captura `filtro` do método
- Implementação completa de Iterator

### Caso 4: Builder Temporário

```java
public class RelatórioGenerator {

    public Relatorio gerarRelatorio(List<Dado> dados, String titulo, String formato) {
        final StringBuilder conteudo = new StringBuilder();

        // Local class: Builder temporário
        class RelatorioBuilder {
            private String cabecalho;
            private String corpo;
            private String rodape;

            RelatorioBuilder adicionarCabecalho() {
                cabecalho = "===== " + titulo + " =====\n";  // Usa titulo capturado
                cabecalho += "Formato: " + formato + "\n\n";   // Usa formato capturado
                return this;
            }

            RelatorioBuilder adicionarCorpo() {
                corpo = "Dados:\n";
                for (Dado d : dados) {  // Usa dados capturados
                    corpo += "  - " + d.toString() + "\n";
                }
                return this;
            }

            RelatorioBuilder adicionarRodape() {
                rodape = "\nTotal de itens: " + dados.size();
                return this;
            }

            Relatorio build() {
                conteudo.append(cabecalho)
                       .append(corpo)
                       .append(rodape);

                return new Relatorio(conteudo.toString());
            }
        }

        return new RelatorioBuilder()
                .adicionarCabecalho()
                .adicionarCorpo()
                .adicionarRodape()
                .build();
    }
}
```

**Análise:**
- Builder pattern implementado com local class
- Captura múltiplas variáveis (`dados`, `titulo`, `formato`)
- API fluente para construção

## 🎯 Aplicabilidade e Contextos

### Quando Usar Local Classes

**1. Implementação Única em Método Específico**

Quando precisa de classe apenas neste método:

```java
public void processar(List<String> lista, String prefixo) {
    class ProcessadorPrefixo {
        String processar(String item) {
            return prefixo + item;
        }
    }

    ProcessadorPrefixo proc = new ProcessadorPrefixo();
    lista.replaceAll(proc::processar);
}
```

**2. Captura de Múltiplas Variáveis com Lógica Complexa**

Quando lambda não é suficiente (múltiplos métodos, estado):

```java
public void validar(String input, int min, int max, String contexto) {
    class Validador {
        private List<String> erros = new ArrayList<>();

        boolean validarTamanho() {
            if (input.length() < min) {
                erros.add("Tamanho mínimo: " + min);
                return false;
            }
            if (input.length() > max) {
                erros.add("Tamanho máximo: " + max);
                return false;
            }
            return true;
        }

        List<String> getErros() {
            return erros;
        }
    }
}
```

**3. Algoritmos Localizados com Estado**

Quando algoritmo tem estado que deve ser encapsulado:

```java
public int calcularFibonacci(int n) {
    class CalculadoraFib {
        private Map<Integer, Integer> cache = new HashMap<>();

        int calcular(int num) {
            if (num <= 1) return num;
            if (cache.containsKey(num)) return cache.get(num);

            int resultado = calcular(num - 1) + calcular(num - 2);
            cache.put(num, resultado);
            return resultado;
        }
    }

    return new CalculadoraFib().calcular(n);
}
```

### Quando NÃO Usar Local Classes

**Use Lambda Se:**
- Apenas um método abstrato
- Sem estado mutável
- Lógica simples

```java
// ❌ Desnecessário - local class
class Filtro implements Predicate<String> {
    public boolean test(String s) {
        return s.length() > 5;
    }
}

// ✅ Melhor - lambda
lista.removeIf(s -> s.length() > 5);
```

**Use Inner Class Se:**
- Usada em múltiplos métodos
- Faz parte da API da classe

**Use Anonymous Class Se:**
- Não precisa de nome
- Instanciação única inline

## ⚠️ Limitações e Considerações Teóricas

### Limitação 1: Variáveis Capturadas Devem Ser Effectively Final

```java
public void metodo() {
    int contador = 0;

    class Local {
        void incrementar() {
            // contador++;  // ❌ ERRO - tentando modificar variável capturada
        }
    }
}
```

**Solução**: Use array ou wrapper mutável:

```java
final int[] contador = {0};

class Local {
    void incrementar() {
        contador[0]++;  // ✅ OK - modifica conteúdo, não referência
    }
}
```

### Limitação 2: Não Pode Ter Membros Static

```java
class Local {
    // private static int id;  // ❌ ERRO
    private static final int MAX = 100;  // ✅ OK - constante
}
```

### Limitação 3: Sem Modificadores de Acesso

```java
// public class Local { }  // ❌ ERRO
// private class Local { }  // ❌ ERRO
class Local { }  // ✅ OK - apenas default (sem modificador)
```

## 🔗 Interconexões Conceituais

**Relação com Inner Classes**: Local classes são inner classes com escopo de método.

**Relação com Anonymous Classes**: Anonymous classes são local classes sem nome.

**Relação com Lambdas (Java 8+)**: Lambdas substituem local classes simples.

**Relação com Closures**: Local classes implementam conceito de closure em Java.

## 🚀 Evolução e Próximos Conceitos

Com domínio de local classes, você está preparado para:

**Anonymous Classes**: Local classes sem nome

**Lambda Expressions**: Sintaxe concisa para single-method interfaces

**Method References**: Referências a métodos como valores

**Effectively Final**: Conceito aplicado também em lambdas
