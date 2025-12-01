# Método main como Ponto de Entrada

## 🎯 Introdução e Definição

### Definição Conceitual

O **método main** é o **ponto de entrada** (entry point) de toda aplicação Java standalone - o primeiro método executado pela JVM (Java Virtual Machine) quando um programa Java é iniciado. É análogo à função `main()` em C/C++ ou ao `if __name__ == "__main__":` em Python: marca o início da execução sequencial de instruções.

Conceitualmente, o método main atua como **porta de entrada** pela qual a JVM "entra" no código da aplicação. Sem ele, a JVM não sabe por onde começar a executar o programa. Sua **assinatura específica e obrigatória** (`public static void main(String[] args)`) não é arbitrária - cada elemento tem propósito técnico relacionado a como JVM carrega classes e inicia execução.

### Contexto Histórico e Motivação

#### O Problema: Como Iniciar Execução?

Linguagens compiladas para código nativo (C, C++) têm conceito de **função de entrada**:

**C/C++**:
```c
int main(int argc, char *argv[]) {
    printf("Hello, World!\n");
    return 0;
}
// Compilador sabe: "main" é onde começar
```

**Problema em Java**: Java compila para **bytecode**, não código nativo. Bytecode é executado por **JVM**, não diretamente pelo SO. JVM precisa saber:
1. Qual classe carregar primeiro?
2. Qual método executar primeiro nessa classe?

**Solução**: Convenção do método `main` com assinatura padronizada.

#### Evolução do Conceito

**Java 1.0 (1996)**: Método main já existia com assinatura atual
```java
public static void main(String args[]) { }
```

**Java 1.5 (2004)**: Varargs permitiram sintaxe alternativa
```java
public static void main(String... args) { }  // Equivalente
```

**Java 21 (2023)**: Unnamed classes simplificam Hello World
```java
// Antes (verboso):
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello!");
    }
}

// Java 21+ (simplificado para iniciantes):
void main() {
    println("Hello!");
}
// Compilador gera classe automática e importações
```

### Problema Fundamental que Resolve

O método main resolve **três problemas técnicos**:

#### 1. Ponto de Início Determinístico

**Problema**: JVM recebe arquivo `.class`. Como saber qual método executar primeiro?

**Solução**: Procurar método com assinatura exata `public static void main(String[])`.

```java
// Arquivo: Programa.java
public class Programa {
    public void metodoA() { }  // JVM ignora
    public void metodoB() { }  // JVM ignora
    
    public static void main(String[] args) {  // JVM EXECUTA ESTE
        System.out.println("Início!");
    }
}
```

#### 2. Execução Sem Instanciar Classe

**Problema**: Para chamar método de instância, precisa criar objeto:
```java
class Exemplo {
    void metodo() { }
}
// Precisa: new Exemplo().metodo();
```

Mas quem criaria o primeiro objeto? (Problema do ovo e galinha)

**Solução**: `main` é **static** - JVM pode chamá-lo sem criar objeto.

```java
public class App {
    public static void main(String[] args) {
        // JVM chama: App.main(...)
        // SEM fazer: new App().main(...)
    }
}
```

#### 3. Passar Argumentos da Linha de Comando

**Problema**: Como programa recebe parâmetros externos?

**Solução**: Parâmetro `String[] args` contém argumentos.

```bash
java Programa arg1 arg2 arg3
```

```java
public class Programa {
    public static void main(String[] args) {
        // args[0] = "arg1"
        // args[1] = "arg2"
        // args[2] = "arg3"
    }
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Assinatura Obrigatória**: `public static void main(String[] args)` - cada palavra tem razão de ser
2. **Ponto de Entrada Único**: Apenas um método main é executado (na classe especificada)
3. **Método Estático**: JVM chama sem instanciar classe
4. **Argumentos de Linha de Comando**: Array de Strings recebe parâmetros externos
5. **Retorno void**: Programa termina quando main retorna (exit code via System.exit())

### Pilares Fundamentais

- **public**: JVM (externa à classe) precisa acessar
- **static**: Chamado sem criar objeto
- **void**: Não retorna valor (usa System.exit() para código de saída)
- **main**: Nome reconhecido pela JVM
- **String[] args**: Argumentos da linha de comando

### Visão Geral das Nuances

- **Múltiplos mains**: Cada classe pode ter seu main (útil para testar)
- **Ordem de Parâmetros**: Modificadores podem variar ordem, mas convenção é fixa
- **Varargs**: `String... args` é equivalente a `String[] args`
- **Unnamed Classes (Java 21+)**: Simplificação para casos simples

---

## 🧠 Fundamentos Teóricos

### Anatomia do Método main

```java
public static void main(String[] args) {
    // Corpo do método
}
```

#### Dissecando Cada Elemento

**1. `public`** (Modificador de Acesso)

**Por que**: JVM está **fora da classe** - precisa de acesso irrestrito.

```java
// ✅ Correto
public static void main(String[] args) { }

// ❌ ERRO: JVM não consegue acessar
private static void main(String[] args) { }

// ❌ ERRO: JVM pode estar em pacote diferente
static void main(String[] args) { }  // package-private
```

**2. `static`** (Membro de Classe)

**Por que**: JVM precisa chamar método **sem instanciar classe**.

**Processo de Execução**:
```java
// Ao executar: java MinhaClasse
// JVM faz internamente:
// 1. Carrega classe MinhaClasse
// 2. Procura método: public static void main(String[])
// 3. Chama: MinhaClasse.main(argumentos)
// NÃO faz: new MinhaClasse().main(argumentos)
```

**Implicação**: Dentro de `main`, só pode acessar membros static diretamente.

```java
public class Exemplo {
    int varInstancia = 10;        // Instância
    static int varEstatica = 20;  // Estática
    
    public static void main(String[] args) {
        // System.out.println(varInstancia);  // ❌ ERRO: main é static
        System.out.println(varEstatica);      // ✅ OK: static acessa static
        
        // Para acessar varInstancia, precisa criar objeto:
        Exemplo obj = new Exemplo();
        System.out.println(obj.varInstancia); // ✅ OK
    }
}
```

**3. `void`** (Sem Retorno)

**Por que**: JVM não espera valor de retorno de `main`.

**Como indicar sucesso/falha**: Use `System.exit(codigo)`.

```java
public static void main(String[] args) {
    if (args.length == 0) {
        System.err.println("Erro: argumentos faltando");
        System.exit(1);  // Código 1 = erro
        return;
    }
    
    System.out.println("Sucesso!");
    // Retorno implícito: System.exit(0) - código 0 = sucesso
}
```

**Verificação em Shell**:
```bash
java Programa
echo $?  # Linux/Mac: mostra código de saída (0, 1, etc.)

java Programa
echo %ERRORLEVEL%  # Windows
```

**4. `main`** (Nome do Método)

**Por que**: **Convenção** reconhecida pela JVM.

```java
public static void main(String[] args) { }    // ✅ JVM reconhece
public static void inicio(String[] args) { }  // ❌ JVM ignora
```

**Nome fixo**: Não pode ser `Main`, `MAIN`, `principal` - deve ser exatamente `main`.

**5. `String[] args`** (Parâmetro)

**Por que**: Receber argumentos da linha de comando.

**Tipo**: Array de Strings (`String[]`)

**Nome**: `args` é convenção (pode ser qualquer nome).

```java
public static void main(String[] argumentos) { }  // ✅ Válido
public static void main(String[] a) { }           // ✅ Válido
public static void main(String[] xyz) { }         // ✅ Válido
```

**Sintaxe Alternativa** (Varargs - Java 5+):
```java
public static void main(String... args) { }  // ✅ Equivalente a String[]
```

### Argumentos de Linha de Comando

#### Como Funcionam

**Execução**:
```bash
java MinhaClasse arg1 arg2 "argumento com espaços" arg4
```

**Array `args` resultante**:
```java
args[0] = "arg1"
args[1] = "arg2"
args[2] = "argumento com espaços"  // Aspas agrupam
args[3] = "arg4"
args.length = 4
```

#### Exemplos Práticos

**Calculadora Simples**:
```java
public class Calculadora {
    public static void main(String[] args) {
        if (args.length != 3) {
            System.out.println("Uso: java Calculadora <num1> <op> <num2>");
            System.out.println("Exemplo: java Calculadora 10 + 5");
            return;
        }
        
        double num1 = Double.parseDouble(args[0]);
        String operador = args[1];
        double num2 = Double.parseDouble(args[2]);
        
        double resultado = switch (operador) {
            case "+" -> num1 + num2;
            case "-" -> num1 - num2;
            case "*" -> num1 * num2;
            case "/" -> num1 / num2;
            default -> {
                System.out.println("Operador inválido");
                yield 0;
            }
        };
        
        System.out.println("Resultado: " + resultado);
    }
}
```

**Execução**:
```bash
java Calculadora 10 + 5
# Saída: Resultado: 15.0

java Calculadora 20 / 4
# Saída: Resultado: 5.0
```

**Processamento de Arquivos**:
```java
public class ProcessadorArquivo {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Uso: java ProcessadorArquivo <arquivo1> [arquivo2] ...");
            return;
        }
        
        for (String nomeArquivo : args) {
            System.out.println("Processando: " + nomeArquivo);
            // Lógica de processamento...
        }
    }
}
```

**Execução**:
```bash
java ProcessadorArquivo dados.txt log.txt config.properties
# Processando: dados.txt
# Processando: log.txt
# Processando: config.properties
```

### Variações de Assinatura (Aceitas pela JVM)

#### Ordem de Modificadores

```java
// Todas são VÁLIDAS (compilam e executam):
public static void main(String[] args) { }        // ✅ Convenção
static public void main(String[] args) { }        // ✅ Válido mas incomum
public static final void main(String[] args) { }  // ✅ final é opcional
public static synchronized void main(String[] args) { } // ✅ synchronized opcional
```

**Convenção Recomendada**: `public static void main(String[] args)`

#### Array de Strings: Sintaxes Aceitas

```java
public static void main(String[] args) { }   // ✅ Convenção
public static void main(String args[]) { }   // ✅ Estilo C (válido)
public static void main(String... args) { }  // ✅ Varargs (Java 5+)
```

### Múltiplos Métodos main

Cada classe pode ter seu próprio `main` - útil para **testes**:

```java
// Arquivo: Pessoa.java
public class Pessoa {
    private String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
    
    public String getNome() {
        return nome;
    }
    
    // main para testar esta classe isoladamente
    public static void main(String[] args) {
        Pessoa p = new Pessoa("João");
        System.out.println("Teste: " + p.getNome());
    }
}

// Arquivo: App.java
public class App {
    public static void main(String[] args) {
        Pessoa p1 = new Pessoa("Maria");
        Pessoa p2 = new Pessoa("José");
        System.out.println(p1.getNome());
        System.out.println(p2.getNome());
    }
}
```

**Execução**:
```bash
java Pessoa
# Saída: Teste: João

java App
# Saída: Maria
#        José
```

**Apenas um main executa** - aquele da classe especificada no comando `java`.

### Fluxo de Execução Detalhado

**Comando**:
```bash
java com.exemplo.MinhaApp arg1 arg2
```

**Processo Interno da JVM**:
```
1. ClassLoader carrega classe com.exemplo.MinhaApp
   - Verifica se arquivo .class existe
   - Lê bytecode
   
2. Inicialização estática de com.exemplo.MinhaApp
   - Executa blocos static { }
   - Inicializa variáveis static
   
3. Procura método com assinatura exata:
   - public
   - static
   - void
   - nome "main"
   - parâmetro String[]
   
4. Cria array String com argumentos:
   - String[] args = {"arg1", "arg2"}
   
5. Invoca método:
   - MinhaApp.main(args)
   
6. Executa corpo do método main
   - Instrução por instrução
   
7. Quando main retorna:
   - Se threads não-daemon criadas, programa continua
   - Senão, JVM termina com exit code 0
```

---

## 🔍 Análise Conceitual Profunda

### Por Que Não Pode Ser Método de Instância?

**Tentativa Hipotética**:
```java
public class Programa {
    public void main(String[] args) {  // ❌ NÃO É STATIC
        System.out.println("Hello");
    }
}
```

**Problema**: JVM precisaria fazer:
```java
Programa obj = new Programa();  // Quem chama este construtor?
obj.main(argumentos);
```

**Dilema**: Quem cria a primeira instância? JVM não sabe como (construtor pode ter parâmetros, lógica complexa).

**Solução**: `static` elimina necessidade de instância.

### System.exit() vs return

**return**: Sai do método main, mas JVM pode continuar se há threads ativas.

```java
public class ComThreads {
    public static void main(String[] args) {
        // Criar thread daemon=false (padrão)
        new Thread(() -> {
            while (true) {
                System.out.println("Thread rodando...");
                try { Thread.sleep(1000); } catch (Exception e) { }
            }
        }).start();
        
        System.out.println("main retornando...");
        return;  // main termina, mas programa continua (thread ativa)
    }
}
```

**System.exit(codigo)**: Termina JVM imediatamente (mata todas threads).

```java
public class ComExit {
    public static void main(String[] args) {
        new Thread(() -> {
            while (true) {
                System.out.println("Thread rodando...");
                try { Thread.sleep(1000); } catch (Exception e) { }
            }
        }).start();
        
        System.out.println("Chamando System.exit(0)...");
        System.exit(0);  // JVM termina, thread é morta
    }
}
```

**Códigos de Saída Convencionais**:
- `0`: Sucesso
- `1`: Erro genérico
- `2+`: Erros específicos (definidos por desenvolvedor)

### Unnamed Classes (Java 21+ - Preview/Incubator)

**Objetivo**: Simplificar Hello World para iniciantes.

**Antiga (Java 1-20)**:
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**Nova (Java 21+)**:
```java
void main() {
    println("Hello, World!");
}
```

**O Que Mudou**:
- **Classe implícita**: Compilador gera classe wrapper automaticamente
- **main simplificado**: Não precisa ser `static`, `public`, `String[] args`
- **Imports implícitos**: `System.out.println` vira `println`

**Limitações**: Apenas para programas simples (aprendizado). Projetos reais usam sintaxe tradicional.

---

## 🎯 Aplicabilidade e Contextos

### Aplicações Standalone vs Servlets/Jakarta EE

**Standalone (Desktop, CLI)**: main é ponto de entrada.
```java
public class AppDesktop {
    public static void main(String[] args) {
        // Inicia GUI, processa argumentos, etc.
    }
}
```

**Servlet/Jakarta EE**: Servidor de aplicação gerencia lifecycle.
```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    // SEM método main - servidor chama doGet/doPost
    protected void doGet(HttpServletRequest req, HttpServletResponse res) {
        // ...
    }
}
```

### Testes Unitários

**JUnit**: Não usa main - framework gerencia execução.
```java
public class CalculadoraTest {
    // SEM método main
    @Test
    public void testSomar() {
        assertEquals(5, Calculadora.somar(2, 3));
    }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Erros Comuns

**1. Assinatura Incorreta**:
```java
public void main(String[] args) { }        // ❌ Falta static
public static void Main(String[] args) { } // ❌ Main != main (case-sensitive)
public static void main(String args) { }   // ❌ args deve ser array
public static int main(String[] args) { }  // ❌ Deve ser void
```

**Erro na execução**:
```
Error: Main method not found in class MinhaClasse, please define the main method as:
   public static void main(String[] args)
```

**2. Argumentos Incorretos**:
```bash
java Programa arg1 arg2
```
```java
public static void main(String[] args) {
    int valor = Integer.parseInt(args[10]);  // ❌ ArrayIndexOutOfBoundsException
}
```

**Proteção**:
```java
if (args.length > 10) {
    int valor = Integer.parseInt(args[10]);
} else {
    System.err.println("Argumentos insuficientes");
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Conceitos

- **Classes**: main precisa estar dentro de uma classe
- **Métodos Estáticos**: main é static, relacionado a membros de classe
- **Arrays**: args é array de Strings
- **Exceções**: main pode lançar exceções (throws)

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Estudar **pacotes** (organização de classes em namespaces) e **imports** (uso de classes de outros pacotes).
