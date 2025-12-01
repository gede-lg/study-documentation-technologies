# Parâmetros e Argumentos

## 🎯 Introdução e Definição

**Parâmetros** são **variáveis declaradas** na assinatura do método que **recebem valores** quando o método é chamado. **Argumentos** são os **valores reais** passados para o método durante a chamada. Parâmetros definem **o que** o método espera receber; argumentos são **o que** efetivamente enviamos.

**Conceito central**: **Parâmetro** é a **especificação** (molde), **argumento** é o **valor concreto** (dado). Pense em parâmetro como **espaço reservado** na declaração e argumento como **dado real** na chamada. É a diferença entre **variável de entrada** (parâmetro) e **valor de entrada** (argumento).

**Analogia completa**:
- **Método**: Função matemática f(x, y)
- **Parâmetros**: x, y (variáveis da função)
- **Argumentos**: 10, 20 (valores concretos quando calculamos f(10, 20))
- **Chamada**: f(10, 20) = resultado

**Diferença fundamental**:
```java
// DECLARAÇÃO DO MÉTODO
public int somar(int a, int b) {
//               ↑       ↑
//           PARÂMETROS (variáveis que receberão valores)
    return a + b;
}

// CHAMADA DO MÉTODO
int resultado = somar(10, 20);
//                    ↑   ↑
//                ARGUMENTOS (valores reais passados)

// EXPLICAÇÃO:
// - Parâmetros: a, b (declarados no método)
// - Argumentos: 10, 20 (passados na chamada)
// - Na execução: a recebe 10, b recebe 20
```

**Exemplo completo**:
```java
public class Calculadora {
    // DECLARAÇÃO - define PARÂMETROS
    public double calcularDesconto(double preco, double percentual) {
        //                          ↑            ↑
        //                      PARÂMETRO 1   PARÂMETRO 2
        //                      (tipo double) (tipo double)
        
        return preco * (percentual / 100);
    }
}

// USO - passa ARGUMENTOS
Calculadora calc = new Calculadora();
double resultado = calc.calcularDesconto(100.0, 10.0);
//                                       ↑      ↑
//                                   ARGUMENTO1 ARGUMENTO2
//                                   (valor: 100.0) (valor: 10.0)

// EXECUÇÃO:
// 1. preco recebe 100.0 (argumento 1)
// 2. percentual recebe 10.0 (argumento 2)
// 3. Calcula: 100.0 * (10.0 / 100) = 10.0
// 4. Retorna 10.0
```

**Terminologia**:
```
PARÂMETRO (parameter):
- Variável na DECLARAÇÃO do método
- Define TIPO e NOME
- "Formal parameter" (parâmetro formal)
- Existe apenas na definição

ARGUMENTO (argument):
- Valor na CHAMADA do método
- Valor real passado
- "Actual parameter" (parâmetro real)
- Existe apenas na execução
```

## 📋 Fundamentos Teóricos

### 1️⃣ Declaração de Parâmetros

**Sintaxe**:
```java
modificador tipoRetorno nomeMetodo(tipo1 nome1, tipo2 nome2, ...) {
//                                 ↑           ↑
//                              PARÂMETRO 1  PARÂMETRO 2
}
```

**Sem parâmetros**:
```java
public void metodoSemParametros() {
    // Não recebe entrada
    System.out.println("Sem parâmetros");
}

// Chamada:
metodoSemParametros();  // Sem argumentos
```

**Um parâmetro**:
```java
public void exibir(String mensagem) {
    //             ↑      ↑
    //          tipo   nome
    System.out.println(mensagem);
}

// Chamada:
exibir("Hello");  // "Hello" é o argumento
```

**Múltiplos parâmetros**:
```java
public void registrar(String nome, int idade, double altura, boolean ativo) {
    //                   ↑          ↑          ↑             ↑
    //                 param1     param2     param3       param4
    System.out.println(nome + " - " + idade + " - " + altura + " - " + ativo);
}

// Chamada:
registrar("João", 30, 1.75, true);
//         ↑      ↑    ↑     ↑
//        arg1   arg2  arg3  arg4
```

**Tipos diferentes**:
```java
public void processar(int numero, String texto, boolean flag, 
                     double valor, Produto produto, List<String> lista) {
    // Parâmetros de tipos primitivos e referências
}

// Chamada:
Produto p = new Produto();
List<String> l = new ArrayList<>();
processar(10, "texto", true, 99.9, p, l);
```

### 2️⃣ Passagem de Argumentos

**Conceito**: Java usa **passagem por valor** - copia o **valor** da variável para o parâmetro.

**Primitivos** (copia o valor):
```java
public void modificar(int numero) {
    numero = 100;  // Modifica CÓPIA local
    System.out.println("Dentro: " + numero);  // 100
}

// Uso:
int x = 10;
modificar(x);  // Passa VALOR de x (10)
System.out.println("Fora: " + x);  // 10 (NÃO mudou)

// EXPLICAÇÃO:
// 1. x = 10
// 2. modificar(x) copia valor 10 para parâmetro 'numero'
// 3. numero = 100 (apenas a cópia local)
// 4. x permanece 10 (original não afetado)
```

**Referências** (copia a referência, objeto compartilhado):
```java
public void modificarObjeto(Produto produto) {
    produto.preco = 200;  // Modifica OBJETO apontado
}

// Uso:
Produto p = new Produto();
p.preco = 100;
modificarObjeto(p);  // Passa REFERÊNCIA (copia endereço)
System.out.println(p.preco);  // 200 (MUDOU!)

// EXPLICAÇÃO:
// 1. p aponta para Produto@1a2b
// 2. modificarObjeto(p) copia referência 1a2b para parâmetro 'produto'
// 3. produto aponta para MESMO objeto (Produto@1a2b)
// 4. produto.preco = 200 modifica objeto original
// 5. p.preco mostra 200 (mesmo objeto)

// MAS NÃO pode trocar referência:
public void trocarObjeto(Produto produto) {
    produto = new Produto();  // Troca CÓPIA local da referência
    produto.preco = 300;
}

Produto p = new Produto();
p.preco = 100;
trocarObjeto(p);
System.out.println(p.preco);  // 100 (NÃO mudou)
// Troca de referência não afeta original
```

### 3️⃣ Tipos de Parâmetros

**Primitivos**:
```java
public void metodo(byte b, short s, int i, long l,
                   float f, double d, char c, boolean flag) {
    // Todos os tipos primitivos
}

// Chamada:
metodo((byte)1, (short)2, 3, 4L, 5.0f, 6.0, 'A', true);
```

**Referências** (objetos):
```java
public void processar(String texto, Produto produto, 
                     Cliente cliente, Pedido pedido) {
    // Parâmetros de objetos
}

// Chamada:
processar("texto", new Produto(), new Cliente(), new Pedido());
```

**Arrays**:
```java
public int somar(int[] numeros) {
    int soma = 0;
    for (int n : numeros) {
        soma += n;
    }
    return soma;
}

// Chamada:
int[] arr = {10, 20, 30};
int total = somar(arr);  // 60
```

**Varargs** (quantidade variável):
```java
public int somar(int... numeros) {
    //           ↑
    //      Varargs (0 ou mais inteiros)
    int soma = 0;
    for (int n : numeros) {
        soma += n;
    }
    return soma;
}

// Chamadas com diferentes quantidades:
somar();                    // 0 argumentos
somar(10);                  // 1 argumento
somar(10, 20);              // 2 argumentos
somar(10, 20, 30, 40, 50);  // 5 argumentos
```

**Objetos complexos**:
```java
public void processar(List<String> lista, Map<String, Integer> mapa,
                     Set<Produto> conjunto, Optional<Cliente> opcional) {
    // Coleções e genérics
}
```

### 4️⃣ Ordem e Quantidade de Argumentos

**Ordem importa**:
```java
public void registrar(String nome, int idade) {
    System.out.println(nome + " - " + idade);
}

// ✓ Correto:
registrar("João", 30);  // "João - 30"

// ❌ Errado (ordem invertida):
registrar(30, "João");  // Erro de compilação
// Esperado: (String, int)
// Recebido: (int, String)
```

**Quantidade deve corresponder**:
```java
public void metodo(int a, int b, int c) {
    // Espera 3 argumentos
}

// ✓ Correto:
metodo(10, 20, 30);  // 3 argumentos

// ❌ Errado (faltam argumentos):
metodo(10, 20);  // Erro: esperado 3, recebido 2

// ❌ Errado (argumentos extras):
metodo(10, 20, 30, 40);  // Erro: esperado 3, recebido 4
```

**Varargs permite variação**:
```java
public void metodo(String prefixo, int... numeros) {
    //                               ↑
    //                    Aceita 0 ou mais inteiros
}

// Todas válidas:
metodo("A");              // 1 String, 0 ints
metodo("A", 10);          // 1 String, 1 int
metodo("A", 10, 20, 30);  // 1 String, 3 ints
```

### 5️⃣ Nomes de Parâmetros

**Convenções**:
```
1. camelCase (minúscula inicial)
2. Descritivo (indica propósito)
3. Sem prefixos (como p_, param_)
4. Singular para valores únicos
5. Plural para coleções
```

**Bons nomes**:
```java
public void criar(String nome, int idade, double altura) { }
public void processar(Pedido pedido, Cliente cliente) { }
public void calcular(double valorInicial, double percentualDesconto) { }
public void filtrar(List<Produto> produtos, Predicate<Produto> criterio) { }
```

**Maus nomes** (evitar):
```java
// ❌ NÃO descritivo:
public void metodo(int x, String s, double d) { }

// ❌ Abreviações obscuras:
public void proc(Prod p, Cli c) { }

// ❌ Genérico demais:
public void fazer(Object obj, Object obj2) { }

// ❌ Com prefixo:
public void criar(String p_nome, int p_idade) { }
```

### 6️⃣ Argumentos Literais vs Variáveis

**Literais**:
```java
public void exibir(String texto, int numero, boolean flag) { }

// Argumentos LITERAIS:
exibir("Hello", 42, true);
//      ↑       ↑   ↑
//    String  int  boolean (valores diretos)
```

**Variáveis**:
```java
String mensagem = "Hello";
int valor = 42;
boolean ativo = true;

// Argumentos VARIÁVEIS:
exibir(mensagem, valor, ativo);
//      ↑        ↑      ↑
//    Passa valores DAS variáveis
```

**Expressões**:
```java
public int calcular(int a, int b) {
    return a + b;
}

// Argumentos como EXPRESSÕES:
int resultado = calcular(10 + 5, 20 * 2);
//                       ↑       ↑
//                      15       40
// Expressões avaliadas ANTES da chamada
```

**Chamadas de métodos**:
```java
public String concatenar(String s1, String s2) {
    return s1 + s2;
}

public String getText() {
    return "World";
}

// Argumento como chamada de método:
String resultado = concatenar("Hello ", getText());
//                                      ↑
//                            getText() retorna "World"
// resultado = "Hello World"
```

### 7️⃣ Parâmetros como Variáveis Locais

**Conceito**: Parâmetros são **variáveis locais** do método.

**Escopo**:
```java
public void metodo(int parametro) {
    // 'parametro' existe apenas aqui dentro
    System.out.println(parametro);
    
    parametro = 100;  // Pode modificar (cópia local)
}
// 'parametro' não existe aqui (fora do método)
```

**Reutilização**:
```java
public int calcular(int valor) {
    // 'valor' é parâmetro (variável local)
    valor = valor * 2;  // Pode reutilizar
    valor = valor + 10;
    return valor;
}

int x = 5;
int resultado = calcular(x);  // resultado = 20
System.out.println(x);  // 5 (original não mudou)
```

**Shadowing** (sombreamento de atributos):
```java
public class Pessoa {
    private String nome;  // Atributo
    
    public void setNome(String nome) {
        //                    ↑
        //              Parâmetro (sombreia atributo)
        
        // 'nome' aqui se refere ao PARÂMETRO
        this.nome = nome;  // this.nome = atributo, nome = parâmetro
    }
}
```

### 8️⃣ Validação de Argumentos

**Verificações defensivas**:
```java
public void setIdade(int idade) {
    // Validar argumento
    if (idade < 0) {
        throw new IllegalArgumentException("Idade não pode ser negativa");
    }
    if (idade > 150) {
        throw new IllegalArgumentException("Idade inválida");
    }
    this.idade = idade;
}

// Chamada inválida:
setIdade(-5);  // IllegalArgumentException
```

**Null checking**:
```java
public void processar(Produto produto) {
    // Verificar null
    if (produto == null) {
        throw new IllegalArgumentException("Produto não pode ser null");
    }
    
    // Ou usar Objects.requireNonNull:
    Objects.requireNonNull(produto, "Produto obrigatório");
    
    // Processar produto
    produto.calcular();
}
```

**Validação de range**:
```java
public void setPercentual(double percentual) {
    if (percentual < 0 || percentual > 100) {
        throw new IllegalArgumentException("Percentual deve estar entre 0 e 100");
    }
    this.percentual = percentual;
}
```

**Validação de coleções**:
```java
public void processar(List<String> lista) {
    if (lista == null || lista.isEmpty()) {
        throw new IllegalArgumentException("Lista não pode ser null ou vazia");
    }
    
    for (String item : lista) {
        // Processar
    }
}
```

### 9️⃣ Argumentos Padrão (Workaround)

**Conceito**: Java **não suporta** argumentos padrão nativamente.

**Solução 1 - Sobrecarga**:
```java
public class Produto {
    // Método completo
    public void exibir(String formato, boolean detalhado) {
        // Implementação
    }
    
    // Sobrecarga com valores padrão
    public void exibir(String formato) {
        exibir(formato, false);  // detalhado = false (padrão)
    }
    
    // Sobrecarga sem argumentos
    public void exibir() {
        exibir("JSON", false);  // Ambos com padrão
    }
}

// Uso:
Produto p = new Produto();
p.exibir("JSON", true);   // Todos argumentos
p.exibir("JSON");         // detalhado usa padrão false
p.exibir();               // Ambos usam padrão
```

**Solução 2 - Null e verificação**:
```java
public void configurar(String nome, Integer timeout) {
    if (timeout == null) {
        timeout = 30;  // Valor padrão
    }
    
    System.out.println("Nome: " + nome + ", Timeout: " + timeout);
}

// Uso:
configurar("Serviço", 60);    // timeout = 60
configurar("Serviço", null);  // timeout = 30 (padrão)
```

**Solução 3 - Builder Pattern**:
```java
public class Configuracao {
    private String nome;
    private int timeout = 30;  // Padrão
    private boolean ativo = true;  // Padrão
    
    public Configuracao setNome(String nome) {
        this.nome = nome;
        return this;
    }
    
    public Configuracao setTimeout(int timeout) {
        this.timeout = timeout;
        return this;
    }
    
    public Configuracao setAtivo(boolean ativo) {
        this.ativo = ativo;
        return this;
    }
}

// Uso (define apenas o que quer, resto usa padrão):
Configuracao config = new Configuracao()
    .setNome("Serviço");  // timeout e ativo usam padrão
```

### 🔟 Varargs - Parâmetros Variáveis

**Conceito**: `tipo...` permite **quantidade variável** de argumentos.

**Declaração**:
```java
public void metodo(int... numeros) {
    //             ↑
    //      Aceita 0 ou mais ints
    
    // Internamente, 'numeros' é int[]
    for (int n : numeros) {
        System.out.println(n);
    }
}

// Chamadas:
metodo();              // 0 argumentos
metodo(10);            // 1 argumento
metodo(10, 20, 30);    // 3 argumentos
```

**Regras**:
```
1. Apenas UM varargs por método
2. Varargs deve ser o ÚLTIMO parâmetro
3. Varargs é tratado como array
```

**Varargs com outros parâmetros**:
```java
// ✓ Correto (varargs por último):
public void metodo(String prefixo, int... numeros) { }

// ❌ Errado (varargs não é último):
public void metodo(int... numeros, String sufixo) { }
// Erro de compilação

// ❌ Errado (múltiplos varargs):
public void metodo(int... nums1, String... textos) { }
// Erro de compilação
```

**Exemplo prático**:
```java
public class Logger {
    public void log(String nivel, String mensagem, Object... args) {
        //                                          ↑
        //                                   Parâmetros opcionais
        
        String msg = String.format(mensagem, args);
        System.out.println("[" + nivel + "] " + msg);
    }
}

// Uso:
Logger logger = new Logger();
logger.log("INFO", "Sistema iniciado");
logger.log("WARN", "Conexão lenta: %d ms", 1500);
logger.log("ERROR", "Erro ao processar %s para %s", "arquivo", "usuario");
```

## 🎯 Aplicabilidade

**1. Entrada de dados para métodos**
**2. Configuração de comportamento**
**3. Passagem de objetos entre métodos**
**4. Implementação de algoritmos parametrizados**
**5. Flexibilidade com sobrecarga e varargs**

## ⚠️ Armadilhas Comuns

**1. Ordem incorreta**:
```java
metodo(30, "João");  // ❌ Ordem errada
```

**2. Modificar primitivo esperando alterar original**:
```java
void modificar(int x) { x = 100; }
int n = 10;
modificar(n);  // n ainda é 10
```

**3. Não validar null**:
```java
void processar(Produto p) {
    p.calcular();  // ❌ NPE se p == null
}
```

**4. Muitos parâmetros**:
```java
void criar(String a, int b, double c, boolean d, String e, int f) {
    // ⚠️ Difícil de usar
}
```

**5. Varargs no meio**:
```java
void metodo(int... nums, String s) { }  // ❌ Erro
```

## ✅ Boas Práticas

**1. Validar argumentos**:
```java
if (valor < 0) throw new IllegalArgumentException();
```

**2. Nomes descritivos**:
```java
calcular(double valorInicial, double percentualDesconto)
```

**3. Limitar quantidade**:
```java
// Máximo 3-4 parâmetros
// Se mais, usar objeto
```

**4. Usar sobrecarga para padrões**:
```java
void metodo(String s) { metodo(s, 10); }
void metodo(String s, int n) { }
```

**5. Documentar**:
```java
/**
 * @param produto Produto a processar (não pode ser null)
 * @param quantidade Quantidade (deve ser > 0)
 */
void processar(Produto produto, int quantidade) { }
```

## 📚 Resumo Executivo

**Parâmetro ≠ Argumento**.

**Parâmetro**:
```java
void metodo(int x) {  // x é parâmetro
//          ↑ tipo e nome declarados
}
```

**Argumento**:
```java
metodo(10);  // 10 é argumento
//     ↑ valor real passado
```

**Passagem**:
```java
// Primitivo - copia valor
void metodo(int x) { x = 100; }  // Não afeta original

// Referência - copia referência
void metodo(Produto p) { p.preco = 100; }  // Afeta objeto
```

**Varargs**:
```java
void metodo(int... numeros) { }
metodo(10, 20, 30);  // Aceita vários
```

**Validação**:
```java
if (param == null) throw new IllegalArgumentException();
```

**Ordem e quantidade**:
```java
void metodo(String s, int n) { }
metodo("A", 10);  // ✓ Correto
metodo(10, "A");  // ❌ Ordem errada
```

**Boas práticas**:
- Validar entradas
- Nomes descritivos
- Limitar quantidade (≤ 4)
- Documentar restrições
- Sobrecarga para flexibilidade

**Recomendação**: **Valide** argumentos sempre, use **nomes claros**, limite **quantidade de parâmetros**, prefira **sobrecarga** a muitos parâmetros opcionais, documente **restrições**.