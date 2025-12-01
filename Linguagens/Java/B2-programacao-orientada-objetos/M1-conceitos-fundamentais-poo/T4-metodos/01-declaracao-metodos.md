# Declaração de Métodos

## 🎯 Introdução e Definição

**Método é um bloco de código** que define **comportamento** (ação) que um objeto pode realizar. Métodos são **funções associadas a classes** que operam sobre os dados (atributos) do objeto. Um método **encapsula lógica reutilizável**, pode **receber dados de entrada** (parâmetros), **processar** e **retornar resultado**.

**Conceito central**: Se **atributos definem o QUE o objeto É** (estado), **métodos definem o QUE o objeto FAZ** (comportamento). Métodos são os **verbos** da classe - ações como `calcular()`, `validar()`, `processar()`, `enviar()`.

**Analogia completa**:
- **Classe**: Controle remoto
- **Atributos**: Canal atual, volume, ligado/desligado (estado)
- **Métodos**: Ligar, desligar, mudar canal, aumentar volume (ações)
- **Chamar método**: Apertar botão do controle (executar ação)

**Estrutura fundamental de um método**:
```java
modificadores tipoRetorno nomeMetodo(parametros) {
    // Corpo do método
    // Instruções
    return valor;  // Se tipoRetorno != void
}

// COMPONENTES:
// - modificadores: public, private, static, final, etc
// - tipoRetorno: int, String, void, Produto, etc
// - nomeMetodo: identificador (camelCase)
// - parametros: lista de parâmetros (tipo nome)
// - corpo: instruções entre { }
// - return: retorna valor (se não void)
```

**Exemplo básico**:
```java
public class Calculadora {
    // MÉTODO 1 - Sem parâmetros, retorna int
    public int getAnoAtual() {
        return 2025;
    }
    
    // MÉTODO 2 - Com parâmetros, retorna int
    public int somar(int a, int b) {
        return a + b;
    }
    
    // MÉTODO 3 - Sem retorno (void)
    public void exibir(String mensagem) {
        System.out.println(mensagem);
    }
    
    // MÉTODO 4 - Retorna objeto
    public String concatenar(String s1, String s2) {
        return s1 + s2;
    }
}

// USO:
Calculadora calc = new Calculadora();

int ano = calc.getAnoAtual();           // 2025
int soma = calc.somar(10, 20);          // 30
calc.exibir("Hello");                   // Imprime "Hello"
String texto = calc.concatenar("A","B"); // "AB"
```

**Exemplo com classe de domínio**:
```java
public class ContaBancaria {
    private double saldo;
    private String titular;
    
    // MÉTODO - depositar (modifica estado)
    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
        }
    }
    
    // MÉTODO - sacar (modifica estado, retorna boolean)
    public boolean sacar(double valor) {
        if (valor > 0 && saldo >= valor) {
            saldo -= valor;
            return true;  // Sucesso
        }
        return false;  // Falha
    }
    
    // MÉTODO - consultar saldo (retorna estado)
    public double getSaldo() {
        return saldo;
    }
    
    // MÉTODO - transferir (chama outros métodos)
    public boolean transferir(double valor, ContaBancaria destino) {
        if (this.sacar(valor)) {
            destino.depositar(valor);
            return true;
        }
        return false;
    }
}

// USO:
ContaBancaria conta = new ContaBancaria();
conta.depositar(1000);        // Chama método
conta.sacar(200);             // Chama método
double saldo = conta.getSaldo();  // 800
```

## 📋 Fundamentos Teóricos

### 1️⃣ Anatomia Completa de um Método

**Sintaxe completa**:
```java
[modificadores] tipoRetorno nomeMetodo([parametros]) [throws exceções] {
    // Corpo do método
    [return valor;]
}
```

**Componentes detalhados**:
```java
public static final int calcular(int x, double y) throws Exception {
//  ↑      ↑      ↑    ↑     ↑       ↑      ↑           ↑
//  │      │      │    │     │       │      │           └─ Exceções que pode lançar
//  │      │      │    │     │       └──────┴───────────── Lista de parâmetros
//  │      │      │    │     └─────────────────────────── Nome do método
//  │      │      │    └───────────────────────────────── Tipo de retorno
//  │      │      └────────────────────────────────────── Modificador final
//  │      └───────────────────────────────────────────── Modificador static
//  └──────────────────────────────────────────────────── Modificador de acesso
    
    int resultado = (int)(x + y);  // Corpo
    return resultado;              // Retorno
}
```

**Exemplo completo**:
```java
public class Produto {
    private String nome;
    private double preco;
    
    // Método COMPLETO
    /**
     * Calcula preço com desconto.
     * @param percentualDesconto Desconto entre 0 e 100
     * @return Preço após aplicar desconto
     * @throws IllegalArgumentException se desconto inválido
     */
    public double calcularPrecoComDesconto(double percentualDesconto) 
            throws IllegalArgumentException {
        
        // Validação
        if (percentualDesconto < 0 || percentualDesconto > 100) {
            throw new IllegalArgumentException("Desconto deve estar entre 0 e 100");
        }
        
        // Cálculo
        double desconto = preco * (percentualDesconto / 100);
        double precoFinal = preco - desconto;
        
        // Retorno
        return precoFinal;
    }
}
```

### 2️⃣ Modificadores de Acesso

**Visibilidade de métodos**:

| Modificador | Classe | Pacote | Subclasse | Outros |
|-------------|--------|--------|-----------|--------|
| `public` | ✓ | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| *default* | ✓ | ✓ | ✗ | ✗ |
| `private` | ✓ | ✗ | ✗ | ✗ |

**Exemplos**:
```java
public class Exemplo {
    // PUBLIC - acessível de qualquer lugar
    public void metodoPublico() {
        System.out.println("Público");
    }
    
    // PROTECTED - acessível no pacote e subclasses
    protected void metodoProtegido() {
        System.out.println("Protegido");
    }
    
    // DEFAULT (sem modificador) - apenas no pacote
    void metodoDefault() {
        System.out.println("Default");
    }
    
    // PRIVATE - apenas dentro da classe
    private void metodoPrivado() {
        System.out.println("Privado");
    }
}

// Outro arquivo:
Exemplo ex = new Exemplo();
ex.metodoPublico();    // ✓ OK
ex.metodoProtegido();  // ✓ OK (se mesmo pacote)
ex.metodoDefault();    // ✓ OK (se mesmo pacote)
ex.metodoPrivado();    // ❌ Erro de compilação
```

**Boas práticas**:
```java
public class ContaBancaria {
    private double saldo;
    
    // Métodos PUBLIC - interface pública da classe
    public void depositar(double valor) {
        validarValor(valor);  // Chama método privado
        saldo += valor;
    }
    
    public void sacar(double valor) {
        validarValor(valor);
        validarSaldo(valor);
        saldo -= valor;
    }
    
    // Métodos PRIVATE - implementação interna
    private void validarValor(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
    }
    
    private void validarSaldo(double valor) {
        if (saldo < valor) {
            throw new IllegalStateException("Saldo insuficiente");
        }
    }
}
```

### 3️⃣ Tipo de Retorno

**Conceito**: Tipo de dado que o método **devolve** ao chamador.

**Tipos primitivos**:
```java
public class Calculadora {
    public int somar(int a, int b) {
        return a + b;  // Retorna int
    }
    
    public double calcularMedia(int a, int b) {
        return (a + b) / 2.0;  // Retorna double
    }
    
    public boolean ehPar(int numero) {
        return numero % 2 == 0;  // Retorna boolean
    }
    
    public char primeiraLetra(String texto) {
        return texto.charAt(0);  // Retorna char
    }
}
```

**Tipos de referência** (objetos):
```java
public class ProdutoService {
    // Retorna objeto Produto
    public Produto buscarPorId(int id) {
        Produto p = new Produto();
        p.setNome("Produto " + id);
        return p;  // Retorna referência
    }
    
    // Retorna String
    public String getDescricao(Produto p) {
        return p.getNome() + " - " + p.getPreco();
    }
    
    // Retorna array
    public int[] getPrecos() {
        return new int[]{10, 20, 30};
    }
    
    // Retorna lista
    public List<Produto> listarTodos() {
        List<Produto> lista = new ArrayList<>();
        // Preencher lista
        return lista;
    }
}
```

**Retorno void** (sem retorno):
```java
public class Impressora {
    // void = não retorna nada
    public void imprimir(String texto) {
        System.out.println(texto);
        // Sem return (ou return; sem valor)
    }
    
    public void processar() {
        // Processar algo
        if (erro) {
            return;  // Retorno vazio (sai do método)
        }
        // Continua processamento
    }
}
```

### 4️⃣ Parâmetros

**Conceito**: **Dados de entrada** que o método recebe para processar.

**Declaração de parâmetros**:
```java
// SEM parâmetros
public void metodo1() {
    // Sem entrada
}

// UM parâmetro
public void metodo2(int numero) {
    System.out.println(numero);
}

// MÚLTIPLOS parâmetros
public void metodo3(String nome, int idade, double altura) {
    System.out.println(nome + " - " + idade + " - " + altura);
}

// Parâmetros de diferentes tipos
public void metodo4(int x, String texto, boolean flag, Produto produto) {
    // Usa parâmetros
}
```

**Uso de parâmetros**:
```java
public class Pessoa {
    private String nome;
    private int idade;
    
    // Parâmetros usados para modificar estado
    public void setDados(String nome, int idade) {
        this.nome = nome;    // Parâmetro atribuído ao atributo
        this.idade = idade;
    }
    
    // Parâmetros usados em cálculo
    public int calcularIdadeEm(int ano) {
        int anoAtual = 2025;
        int idadeAtual = idade;
        int anosAFrente = ano - anoAtual;
        return idadeAtual + anosAFrente;
    }
    
    // Parâmetros objetos
    public void copiarDados(Pessoa outra) {
        this.nome = outra.nome;
        this.idade = outra.idade;
    }
}

// Chamadas:
Pessoa p = new Pessoa();
p.setDados("João", 30);       // Passa 2 argumentos
int idade = p.calcularIdadeEm(2030);  // Passa 1 argumento
```

**Varargs** (quantidade variável de parâmetros):
```java
public class Utilitarios {
    // Varargs - recebe 0 ou mais inteiros
    public int somar(int... numeros) {
        int soma = 0;
        for (int num : numeros) {
            soma += num;
        }
        return soma;
    }
}

// Uso:
Utilitarios util = new Utilitarios();
int s1 = util.somar();              // 0 argumentos
int s2 = util.somar(10);            // 1 argumento
int s3 = util.somar(10, 20);        // 2 argumentos
int s4 = util.somar(10, 20, 30, 40);  // 4 argumentos

// Internamente, varargs é um array:
public int somar(int... numeros) {
    // 'numeros' é int[]
    System.out.println(numeros.length);
}
```

### 5️⃣ Palavra-chave `return`

**Conceito**: `return` **encerra execução** do método e **devolve valor** ao chamador.

**Retorno de valor**:
```java
public int multiplicar(int a, int b) {
    int resultado = a * b;
    return resultado;  // Retorna valor e termina método
    // Código aqui nunca executa (unreachable)
}

// Retorno direto (sem variável intermediária)
public int somar(int a, int b) {
    return a + b;  // Calcula e retorna direto
}
```

**Múltiplos returns** (retorno condicional):
```java
public String classificarNota(int nota) {
    if (nota >= 90) {
        return "A";  // Retorna e SAI do método
    } else if (nota >= 80) {
        return "B";
    } else if (nota >= 70) {
        return "C";
    } else if (nota >= 60) {
        return "D";
    } else {
        return "F";
    }
    // Todos os caminhos retornam algo
}
```

**Retorno antecipado** (early return):
```java
public void processar(Pedido pedido) {
    // Validações com retorno antecipado
    if (pedido == null) {
        return;  // Sai do método sem processar
    }
    
    if (pedido.getItens().isEmpty()) {
        return;  // Sai se sem itens
    }
    
    // Código principal só executa se passar validações
    pedido.calcularTotal();
    pedido.enviar();
}
```

**Erro de compilação** (falta return):
```java
public int metodo(int x) {
    if (x > 0) {
        return x;
    }
    // ❌ ERRO: falta return para caso x <= 0
}

// ✓ CORRETO:
public int metodo(int x) {
    if (x > 0) {
        return x;
    }
    return 0;  // Garante retorno em todos os caminhos
}
```

### 6️⃣ Nome de Métodos

**Convenções**:
```
1. camelCase (primeira minúscula, demais maiúsculas)
2. Verbo ou verbo + substantivo
3. Descritivo (indica o que faz)
4. Sem underscores (exceto testes)
```

**Bons nomes**:
```java
public class Exemplos {
    // Verbos de ação
    public void calcular() { }
    public void processar() { }
    public void validar() { }
    public void enviar() { }
    
    // Verbo + substantivo
    public void calcularTotal() { }
    public void processarPedido() { }
    public void validarCpf() { }
    public void enviarEmail() { }
    
    // Getters (obter valor)
    public String getNome() { }
    public int getIdade() { }
    
    // Setters (definir valor)
    public void setNome(String nome) { }
    public void setIdade(int idade) { }
    
    // Boolean (is/has/can/should)
    public boolean isAtivo() { }
    public boolean hasPermissao() { }
    public boolean canEdit() { }
    public boolean shouldProcess() { }
    
    // Conversão/criação
    public String toString() { }
    public int toInt() { }
    public Produto criarProduto() { }
    public List<String> gerarLista() { }
}
```

**Maus nomes** (evitar):
```java
// ❌ NÃO descritivo
public void fazer() { }
public void metodo1() { }
public void x() { }

// ❌ Muito genérico
public void processar() { }  // Processar o quê?
public void get() { }        // Get o quê?

// ❌ Muito longo
public void calcularTotalDoPedidoComDescontoEImpostos() { }

// ❌ Abreviações obscuras
public void calcTot() { }
public void procPed() { }
```

### 7️⃣ Sobrecarga de Métodos (Overloading)

**Conceito**: **Múltiplos métodos** com **mesmo nome** mas **parâmetros diferentes**.

**Regras**:
```
1. Mesmo nome
2. Parâmetros DIFERENTES (quantidade ou tipos)
3. Tipo de retorno pode ser igual ou diferente
4. Modificadores podem ser iguais ou diferentes
```

**Exemplo**:
```java
public class Calculadora {
    // Sobrecarga - MESMO nome, parâmetros diferentes
    
    // 1. Dois inteiros
    public int somar(int a, int b) {
        return a + b;
    }
    
    // 2. Três inteiros (quantidade diferente)
    public int somar(int a, int b, int c) {
        return a + b + c;
    }
    
    // 3. Dois doubles (tipo diferente)
    public double somar(double a, double b) {
        return a + b;
    }
    
    // 4. String (tipo completamente diferente)
    public String somar(String a, String b) {
        return a + b;
    }
}

// Uso - compilador escolhe método correto:
Calculadora calc = new Calculadora();
int r1 = calc.somar(10, 20);          // Chama método 1
int r2 = calc.somar(10, 20, 30);      // Chama método 2
double r3 = calc.somar(10.5, 20.5);   // Chama método 3
String r4 = calc.somar("A", "B");     // Chama método 4
```

**Sobrecarga prática**:
```java
public class Produto {
    private String nome;
    private double preco;
    private String descricao;
    
    // Construtores sobrecarregados
    public Produto(String nome) {
        this.nome = nome;
    }
    
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    public Produto(String nome, double preco, String descricao) {
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
    }
    
    // Métodos sobrecarregados
    public void exibir() {
        System.out.println(nome);
    }
    
    public void exibir(boolean comPreco) {
        if (comPreco) {
            System.out.println(nome + " - R$ " + preco);
        } else {
            System.out.println(nome);
        }
    }
}
```

**Não é sobrecarga** (apenas tipo de retorno diferente):
```java
// ❌ ERRO - não compila
public int calcular(int x) {
    return x * 2;
}

public double calcular(int x) {  // ❌ ERRO: apenas retorno diferente
    return x * 2.0;
}

// Assinatura idêntica: calcular(int)
// Tipo de retorno NÃO faz parte da assinatura
```

### 8️⃣ Corpo do Método

**Conceito**: **Bloco de código** entre `{ }` que contém as **instruções** do método.

**Estrutura**:
```java
public void metodo(int parametro) {
    // Declaração de variáveis locais
    int x = 10;
    String texto = "Hello";
    
    // Estruturas de controle
    if (parametro > 0) {
        // Código condicional
    }
    
    // Loops
    for (int i = 0; i < 10; i++) {
        // Código repetido
    }
    
    // Chamadas a outros métodos
    outroMetodo();
    
    // Retorno (se não void)
    return;
}
```

**Exemplo completo**:
```java
public class ContaBancaria {
    private double saldo;
    private List<String> historico;
    
    public boolean sacar(double valor) {
        // 1. Variáveis locais
        String operacao = "SAQUE";
        boolean sucesso = false;
        
        // 2. Validação
        if (valor <= 0) {
            registrarHistorico("Tentativa de saque inválido: " + valor);
            return false;
        }
        
        // 3. Lógica principal
        if (saldo >= valor) {
            saldo -= valor;
            sucesso = true;
            
            // 4. Chamada a outros métodos
            registrarHistorico(operacao + " de " + valor);
            notificarOperacao(operacao, valor);
        } else {
            registrarHistorico("Saldo insuficiente para saque de " + valor);
        }
        
        // 5. Retorno
        return sucesso;
    }
    
    private void registrarHistorico(String msg) {
        historico.add(msg);
    }
    
    private void notificarOperacao(String tipo, double valor) {
        System.out.println("Operação: " + tipo + " - Valor: " + valor);
    }
}
```

### 9️⃣ Chamada de Métodos

**Sintaxe**:
```java
objeto.nomeMetodo(argumentos);
```

**Exemplos**:
```java
public class Teste {
    public static void main(String[] args) {
        // Criar objeto
        Pessoa pessoa = new Pessoa();
        
        // Chamar método SEM parâmetros
        pessoa.exibir();
        
        // Chamar método COM parâmetros
        pessoa.setNome("João");
        pessoa.setIdade(30);
        
        // Chamar método que RETORNA valor
        String nome = pessoa.getNome();
        int idade = pessoa.getIdade();
        
        // Usar retorno em expressão
        if (pessoa.isMaiorDeIdade()) {
            System.out.println("Maior de idade");
        }
        
        // Encadear chamadas (se retorna this)
        pessoa.setNome("João")
              .setIdade(30)
              .setEmail("joao@email.com");
    }
}
```

**Chamada de métodos dentro da própria classe**:
```java
public class Calculadora {
    public int calcularTotal(int a, int b, int c) {
        // Chamar métodos da própria classe (sem objeto.metodo)
        int soma = somar(a, b);
        soma = somar(soma, c);
        return aplicarDesconto(soma);
    }
    
    private int somar(int x, int y) {
        return x + y;
    }
    
    private int aplicarDesconto(int valor) {
        return (int)(valor * 0.9);
    }
}
```

### 🔟 Métodos e Encapsulamento

**Conceito**: Métodos **expõem funcionalidade** sem revelar implementação.

**Interface pública**:
```java
public class ContaBancaria {
    private double saldo;         // Atributo PRIVADO
    private String numeroConta;
    
    // Métodos PÚBLICOS (interface)
    public void depositar(double valor) {
        validarValorPositivo(valor);  // Método privado
        saldo += valor;
        registrarTransacao("DEPÓSITO", valor);
    }
    
    public boolean sacar(double valor) {
        validarValorPositivo(valor);
        if (saldo >= valor) {
            saldo -= valor;
            registrarTransacao("SAQUE", valor);
            return true;
        }
        return false;
    }
    
    public double getSaldo() {
        return saldo;  // Controla acesso ao atributo privado
    }
    
    // Métodos PRIVADOS (implementação interna)
    private void validarValorPositivo(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
    }
    
    private void registrarTransacao(String tipo, double valor) {
        // Lógica interna de registro
        System.out.println(tipo + ": " + valor);
    }
}

// Usuário da classe NÃO vê implementação interna:
ContaBancaria conta = new ContaBancaria();
conta.depositar(100);  // Usa interface pública
// conta.saldo = 1000;  // ❌ ERRO - atributo privado
// conta.validarValorPositivo(50);  // ❌ ERRO - método privado
```

## 🎯 Aplicabilidade

**1. Definir comportamento de objetos**
**2. Encapsular lógica reutilizável**
**3. Validar e processar dados**
**4. Fornecer interface pública da classe**
**5. Implementar operações complexas**

## ⚠️ Armadilhas Comuns

**1. Método muito longo**:
```java
public void processar() {
    // 500 linhas...  ⚠️ Quebrar em métodos menores
}
```

**2. Muitos parâmetros**:
```java
public void criar(String a, String b, int c, int d, boolean e, double f) {
    // ⚠️ Usar objeto como parâmetro
}
```

**3. Falta de validação**:
```java
public void setIdade(int idade) {
    this.idade = idade;  // ⚠️ E se idade < 0?
}
```

**4. Método fazendo muitas coisas**:
```java
public void processarPedido() {
    validar();
    calcular();
    enviarEmail();
    atualizarEstoque();
    gerarRelatorio();
    // ⚠️ Responsabilidades demais
}
```

**5. Nome não descritivo**:
```java
public void fazer() { }  // ⚠️ Fazer o quê?
```

## ✅ Boas Práticas

**1. Método pequeno e focado**:
```java
public double calcularDesconto(double valor) {
    return valor * 0.1;  // Uma responsabilidade
}
```

**2. Validar parâmetros**:
```java
public void setIdade(int idade) {
    if (idade < 0) throw new IllegalArgumentException();
    this.idade = idade;
}
```

**3. Nome descritivo**:
```java
public boolean validarCpf(String cpf) { }
```

**4. Evitar efeitos colaterais**:
```java
public int somar(int a, int b) {
    return a + b;  // Sem modificar estado
}
```

**5. Documentar comportamento**:
```java
/**
 * Calcula total com desconto.
 * @param valor Valor original
 * @return Valor com 10% desconto
 */
public double calcularComDesconto(double valor) {
    return valor * 0.9;
}
```

## 📚 Resumo Executivo

**Método = comportamento**.

**Estrutura**:
```java
modificador tipo nome(params) {
    // Corpo
    return valor;
}
```

**Modificadores**:
- `public` - acessível externamente
- `private` - interno à classe
- `protected` - pacote + subclasses
- *default* - apenas pacote

**Retorno**:
```java
public int metodo() {
    return 10;  // Tipo primitivo
}

public String metodo() {
    return "texto";  // Objeto
}

public void metodo() {
    // Sem retorno
}
```

**Parâmetros**:
```java
public void metodo(int x, String s) {
    // Usa x e s
}
```

**Sobrecarga**:
```java
public void metodo(int x) { }
public void metodo(int x, int y) { }
public void metodo(String s) { }
```

**Chamada**:
```java
objeto.metodo(argumentos);
```

**Convenções**:
- camelCase
- Verbo + substantivo
- Descritivo
- Focado

**Recomendação**: Métodos **pequenos** e **focados**, **validar** parâmetros, usar **nomes descritivos**, **encapsular** lógica, preferir métodos **sem efeitos colaterais**.