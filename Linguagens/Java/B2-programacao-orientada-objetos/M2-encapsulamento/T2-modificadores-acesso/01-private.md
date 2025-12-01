# T2.01 - Modificador de Acesso private

## Introdução e Definição

O modificador de acesso **`private`** é o **mais restritivo** dos quatro modificadores de acesso em Java. Quando um membro (atributo, método, construtor ou classe interna) é declarado como `private`, ele só pode ser acessado **dentro da própria classe** onde foi declarado.

O `private` é fundamental para o **encapsulamento**, um dos pilares da Programação Orientada a Objetos. Ele permite que você **esconda** detalhes internos de implementação, expondo apenas o que é necessário através de métodos públicos (getters/setters/operações).

**Características principais**:
- **Acesso restrito à própria classe**
- **Invisível** para subclasses (mesmo que herdem a classe)
- **Invisível** para outras classes do mesmo pacote
- **Invisível** para classes de outros pacotes
- Usado para **proteger dados** e **implementações internas**
- Base do **information hiding** (ocultação de informação)

**Exemplo Básico**:
```java
public class ContaBancaria {
    private double saldo;  // Atributo privado
    private String senha;  // Atributo privado

    // Método privado (auxiliar interno)
    private boolean validarSenha(String senhaFornecida) {
        return this.senha.equals(senhaFornecida);
    }

    // Métodos públicos que acessam membros privados
    public void sacar(double valor, String senhaFornecida) {
        if (!validarSenha(senhaFornecida)) {
            throw new SecurityException("Senha inválida");
        }
        if (valor > saldo) {
            throw new IllegalArgumentException("Saldo insuficiente");
        }
        saldo -= valor;
    }

    public double consultarSaldo(String senhaFornecida) {
        if (!validarSenha(senhaFornecida)) {
            throw new SecurityException("Senha inválida");
        }
        return saldo;
    }
}

// Uso:
ContaBancaria conta = new ContaBancaria();
// conta.saldo = 1000;  // ERRO: saldo tem acesso private
// conta.senha = "123"; // ERRO: senha tem acesso private
// conta.validarSenha("123"); // ERRO: validarSenha é private
conta.sacar(100, "minhasenha");  // OK: método público
```

---

## 10 Fundamentos Teóricos

### 1. Acesso Restrito à Própria Classe

Membros `private` são acessíveis **APENAS** dentro da própria classe onde foram declarados.

```java
public class Pessoa {
    private String cpf;  // Atributo privado
    private int idade;   // Atributo privado

    // Método privado auxiliar
    private void validarIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida");
        }
    }

    // Construtor (pode acessar membros privados)
    public Pessoa(String cpf, int idade) {
        validarIdade(idade);  // OK: mesmo dentro da classe
        this.cpf = cpf;       // OK: acesso a atributo privado
        this.idade = idade;   // OK: acesso a atributo privado
    }

    // Métodos públicos podem acessar membros privados
    public void fazerAniversario() {
        this.idade++;  // OK: acesso a atributo privado
    }

    public String getCpf() {
        return cpf;  // OK: retorna atributo privado
    }
}

// Fora da classe:
Pessoa p = new Pessoa("123.456.789-00", 30);
// p.cpf = "000.000.000-00";  // ERRO: cpf é private
// p.validarIdade(25);        // ERRO: validarIdade é private
String cpf = p.getCpf();      // OK: método público
```

**Regra**: `private` = acesso **EXCLUSIVO** da própria classe.

---

### 2. Invisível para Subclasses

Membros `private` **NÃO são visíveis** para subclasses, mesmo que herdem a superclasse.

```java
public class Veiculo {
    private String chassi;  // Atributo privado

    private void validarChassi() {  // Método privado
        // Lógica de validação
    }

    public Veiculo(String chassi) {
        this.chassi = chassi;
        validarChassi();
    }
}

public class Carro extends Veiculo {
    private int numeroPortas;

    public Carro(String chassi, int numeroPortas) {
        super(chassi);  // OK: chama construtor da superclasse
        this.numeroPortas = numeroPortas;
    }

    public void exibirInfo() {
        System.out.println("Portas: " + numeroPortas);  // OK: atributo próprio
        // System.out.println("Chassi: " + chassi);     // ERRO: chassi é private na superclasse
        // validarChassi();                              // ERRO: método private não é herdado
    }
}
```

**Importante**: Membros `private` **EXISTEM** na subclasse (foram herdados internamente), mas **NÃO SÃO ACESSÍVEIS** diretamente. A subclasse só pode acessá-los através de métodos públicos ou protected da superclasse.

---

### 3. Atributos Privados e Encapsulamento

A prática recomendada é declarar **atributos como `private`** e fornecer acesso controlado via **getters/setters**.

```java
public class Produto {
    private String nome;
    private double preco;
    private int estoque;

    // Construtor
    public Produto(String nome, double preco, int estoque) {
        setNome(nome);      // Usa setter para validação
        setPreco(preco);    // Usa setter para validação
        setEstoque(estoque); // Usa setter para validação
    }

    // Getters (leitura controlada)
    public String getNome() {
        return nome;
    }

    public double getPreco() {
        return preco;
    }

    public int getEstoque() {
        return estoque;
    }

    // Setters (escrita controlada com validação)
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        this.nome = nome;
    }

    public void setPreco(double preco) {
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }
        this.preco = preco;
    }

    public void setEstoque(int estoque) {
        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo");
        }
        this.estoque = estoque;
    }

    // Método de negócio que acessa atributos privados
    public void vender(int quantidade) {
        if (quantidade > estoque) {
            throw new IllegalArgumentException("Estoque insuficiente");
        }
        this.estoque -= quantidade;
    }
}

// Uso:
Produto p = new Produto("Notebook", 3000.0, 10);
// p.preco = -100;  // ERRO: preco é private
p.setPreco(2800);   // OK: usa setter com validação
p.vender(2);        // OK: método público
```

**Benefícios**:
- **Validação** centralizada
- **Controle** sobre como dados são modificados
- **Flexibilidade** para mudar implementação interna sem afetar código cliente

---

### 4. Métodos Privados (Métodos Auxiliares)

Métodos `private` são usados como **métodos auxiliares** (helper methods) para lógica interna.

```java
public class Calculadora {
    // Método público (interface pública)
    public double calcularImpostoTotal(double valor, String estado) {
        double impostoEstadual = calcularImpostoEstadual(valor, estado);
        double impostoFederal = calcularImpostoFederal(valor);
        double impostoMunicipal = calcularImpostoMunicipal(valor, estado);
        return impostoEstadual + impostoFederal + impostoMunicipal;
    }

    // Métodos privados (implementação interna)
    private double calcularImpostoEstadual(double valor, String estado) {
        switch (estado) {
            case "SP": return valor * 0.18;
            case "RJ": return valor * 0.19;
            default: return valor * 0.17;
        }
    }

    private double calcularImpostoFederal(double valor) {
        return valor * 0.15;
    }

    private double calcularImpostoMunicipal(double valor, String estado) {
        if (estado.equals("SP")) {
            return valor * 0.05;
        }
        return 0;
    }
}

// Uso:
Calculadora calc = new Calculadora();
double imposto = calc.calcularImpostoTotal(1000, "SP");  // OK: método público
// calc.calcularImpostoEstadual(1000, "SP");  // ERRO: método private
```

**Vantagens**:
- **Organização** do código em funções menores
- **Reutilização** interna sem expor implementação
- **Mudanças** internas não afetam código externo

---

### 5. Construtores Privados

Construtores `private` impedem a **criação de instâncias** fora da classe.

**Caso de Uso 1: Padrão Singleton**
```java
public class Configuracao {
    private static Configuracao instanciaUnica;

    // Construtor privado
    private Configuracao() {
        // Inicialização
    }

    public static Configuracao getInstance() {
        if (instanciaUnica == null) {
            instanciaUnica = new Configuracao();
        }
        return instanciaUnica;
    }
}

// Uso:
// Configuracao c = new Configuracao();  // ERRO: construtor é private
Configuracao c = Configuracao.getInstance();  // OK: método estático
```

**Caso de Uso 2: Classe Utilitária (Apenas Métodos Estáticos)**
```java
public class Matematica {
    // Construtor privado para impedir instanciação
    private Matematica() {
        throw new UnsupportedOperationException("Classe utilitária não pode ser instanciada");
    }

    public static int somar(int a, int b) {
        return a + b;
    }

    public static int multiplicar(int a, int b) {
        return a * b;
    }
}

// Uso:
int resultado = Matematica.somar(5, 3);  // OK: método estático
// Matematica m = new Matematica();      // ERRO: construtor é private
```

**Caso de Uso 3: Factory Pattern**
```java
public class Usuario {
    private String nome;
    private String tipo;

    // Construtor privado
    private Usuario(String nome, String tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }

    // Factory methods públicos
    public static Usuario criarAdmin(String nome) {
        return new Usuario(nome, "ADMIN");
    }

    public static Usuario criarCliente(String nome) {
        return new Usuario(nome, "CLIENTE");
    }
}

// Uso:
// Usuario u = new Usuario("João", "ADMIN");  // ERRO: construtor private
Usuario admin = Usuario.criarAdmin("Maria");   // OK: factory method
```

---

### 6. Classes Internas Privadas (Private Nested Classes)

Classes internas podem ser `private`, visíveis apenas na classe externa.

```java
public class ListaEncadeada {
    private No cabeca;

    // Classe interna privada
    private class No {
        int valor;
        No proximo;

        No(int valor) {
            this.valor = valor;
            this.proximo = null;
        }
    }

    public void adicionar(int valor) {
        No novoNo = new No(valor);  // OK: acessa classe privada No
        if (cabeca == null) {
            cabeca = novoNo;
        } else {
            No atual = cabeca;
            while (atual.proximo != null) {
                atual = atual.proximo;
            }
            atual.proximo = novoNo;
        }
    }

    public void exibir() {
        No atual = cabeca;
        while (atual != null) {
            System.out.print(atual.valor + " ");
            atual = atual.proximo;
        }
    }
}

// Fora da classe:
ListaEncadeada lista = new ListaEncadeada();
lista.adicionar(10);
lista.adicionar(20);
lista.exibir();
// ListaEncadeada.No no = lista.new No(5);  // ERRO: No é private
```

**Benefício**: Encapsula estruturas de dados internas, impedindo uso incorreto.

---

### 7. Private e Reflection API

Mesmo membros `private` podem ser acessados via **Reflection** (com permissões adequadas).

```java
public class Segredo {
    private String mensagem = "Informação confidencial";

    private void revelar() {
        System.out.println(mensagem);
    }
}

// Uso de Reflection para acessar membros privados:
public class TestReflection {
    public static void main(String[] args) throws Exception {
        Segredo s = new Segredo();

        // Acessar atributo privado
        Field campo = Segredo.class.getDeclaredField("mensagem");
        campo.setAccessible(true);  // Quebra encapsulamento
        String valor = (String) campo.get(s);
        System.out.println("Valor: " + valor);  // Informação confidencial

        // Chamar método privado
        Method metodo = Segredo.class.getDeclaredMethod("revelar");
        metodo.setAccessible(true);  // Quebra encapsulamento
        metodo.invoke(s);  // Informação confidencial
    }
}
```

**Atenção**: Reflection pode contornar `private`, mas:
- Requer permissões especiais em ambientes com SecurityManager
- Quebra encapsulamento (use com cautela)
- É necessário em frameworks (Spring, Hibernate), mas evite em código de aplicação

---

### 8. Private em Interfaces (Java 9+)

A partir do **Java 9**, interfaces podem ter **métodos privados** para reutilização interna.

```java
public interface Calculavel {
    default double calcularDescontoSimples(double valor) {
        return aplicarDesconto(valor, 0.10);  // Usa método privado
    }

    default double calcularDescontoEspecial(double valor) {
        return aplicarDesconto(valor, 0.20);  // Usa método privado
    }

    // Método privado (Java 9+)
    private double aplicarDesconto(double valor, double taxa) {
        return valor - (valor * taxa);
    }
}

public class Produto implements Calculavel {
    private double preco;

    public Produto(double preco) {
        this.preco = preco;
    }

    public void exibirDescontos() {
        System.out.println("Desconto simples: " + calcularDescontoSimples(preco));
        System.out.println("Desconto especial: " + calcularDescontoEspecial(preco));
        // aplicarDesconto(preco, 0.15);  // ERRO: método privado da interface
    }
}
```

**Benefício**: Evita duplicação de código entre métodos default/static na interface.

---

### 9. Private e Imutabilidade

Atributos `private final` são essenciais para criar **objetos imutáveis**.

```java
public final class Ponto {
    private final int x;
    private final int y;

    public Ponto(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Apenas getters (sem setters)
    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    // Métodos que retornam NOVA instância (não modificam a atual)
    public Ponto mover(int deltaX, int deltaY) {
        return new Ponto(this.x + deltaX, this.y + deltaY);
    }
}

// Uso:
Ponto p1 = new Ponto(10, 20);
Ponto p2 = p1.mover(5, 5);  // Novo objeto
// p1.x = 30;  // ERRO: x é private final
System.out.println(p1.getX());  // 10 (p1 não mudou)
System.out.println(p2.getX());  // 15 (p2 é novo)
```

**Benefícios de Objetos Imutáveis**:
- **Thread-safe** (não precisam sincronização)
- **Seguros** em coleções (HashSet, HashMap)
- **Previsíveis** (estado não muda)

---

### 10. Controle de Acesso Total com Private

Combinação de atributos `private`, construtor `private` e métodos `private` permite **controle total**.

```java
public class SistemaSeguro {
    private static SistemaSeguro instancia;
    private List<String> logs;
    private boolean inicializado;

    // Construtor privado
    private SistemaSeguro() {
        this.logs = new ArrayList<>();
        this.inicializado = false;
    }

    // Singleton
    public static SistemaSeguro getInstance() {
        if (instancia == null) {
            instancia = new SistemaSeguro();
        }
        return instancia;
    }

    // Método público com validação
    public void inicializar(String chave) {
        if (validarChave(chave)) {  // Método privado
            this.inicializado = true;
            registrarLog("Sistema inicializado");  // Método privado
        } else {
            throw new SecurityException("Chave inválida");
        }
    }

    // Método privado de validação
    private boolean validarChave(String chave) {
        return "chave-secreta-123".equals(chave);
    }

    // Método privado de logging
    private void registrarLog(String mensagem) {
        logs.add(LocalDateTime.now() + ": " + mensagem);
    }

    public void executarOperacao(String chave, String operacao) {
        if (!inicializado) {
            throw new IllegalStateException("Sistema não inicializado");
        }
        if (!validarChave(chave)) {
            throw new SecurityException("Chave inválida");
        }
        processarOperacao(operacao);  // Método privado
        registrarLog("Operação executada: " + operacao);
    }

    // Método privado de processamento
    private void processarOperacao(String operacao) {
        // Lógica complexa interna
        System.out.println("Processando: " + operacao);
    }

    // Método público para auditoria (leitura apenas)
    public List<String> obterLogs(String chave) {
        if (!validarChave(chave)) {
            throw new SecurityException("Chave inválida");
        }
        return new ArrayList<>(logs);  // Cópia defensiva
    }
}

// Uso:
SistemaSeguro sistema = SistemaSeguro.getInstance();
sistema.inicializar("chave-secreta-123");
sistema.executarOperacao("chave-secreta-123", "backup");
List<String> logs = sistema.obterLogs("chave-secreta-123");
// sistema.validarChave("teste");  // ERRO: método private
// sistema.logs.clear();           // ERRO: atributo private
```

**Segurança em Camadas**:
- Construtor privado → controla criação
- Atributos privados → protege estado
- Métodos privados → esconde implementação
- Métodos públicos → interface controlada com validação

---

## Aplicabilidade

### Quando Usar `private`

1. **Atributos de Instância (Regra Geral)**:
   ```java
   private String nome;
   private int idade;
   private double salario;
   ```

2. **Métodos Auxiliares** (Implementação Interna):
   ```java
   private void validar() { }
   private double calcular() { }
   ```

3. **Construtores** (Singleton, Factory, Classe Utilitária):
   ```java
   private MinhaClasse() { }
   ```

4. **Classes Internas** (Estruturas de Dados Internas):
   ```java
   private class No { }
   ```

5. **Constantes Internas** (Não Parte da API Pública):
   ```java
   private static final int BUFFER_SIZE = 1024;
   ```

### Quando NÃO Usar `private`

1. **Métodos de API Pública** → use `public`
2. **Atributos Acessíveis a Subclasses** → use `protected`
3. **Membros Acessíveis no Pacote** → use default (package-private)
4. **Constantes Públicas** → use `public static final`

---

## Armadilhas Comuns

### 1. Esquecer Getters/Setters

```java
public class Usuario {
    private String nome;
    // Falta getter/setter
}

// Erro:
Usuario u = new Usuario();
// u.nome = "João";  // ERRO: private
// String n = u.nome; // ERRO: private
```

**Solução**: Adicione getters/setters ou use IDE para gerar automaticamente.

---

### 2. Expor Referências Mutáveis

```java
public class Agenda {
    private List<String> contatos;

    public Agenda() {
        this.contatos = new ArrayList<>();
    }

    // PROBLEMA: retorna referência interna
    public List<String> getContatos() {
        return contatos;  // Perigoso!
    }
}

// Código cliente pode modificar lista interna:
Agenda a = new Agenda();
a.getContatos().add("Contato indevido");  // Quebra encapsulamento
```

**Solução**: Retornar cópia defensiva
```java
public List<String> getContatos() {
    return new ArrayList<>(contatos);  // Cópia
}

// Ou lista imutável (Java 10+)
public List<String> getContatos() {
    return List.copyOf(contatos);  // Imutável
}
```

---

### 3. Usar Reflection Desnecessariamente

```java
// EVITAR: quebrar encapsulamento com reflection
Field campo = MinhaClasse.class.getDeclaredField("atributoPrivado");
campo.setAccessible(true);
campo.set(objeto, novoValor);
```

**Solução**: Use métodos públicos. Reflection apenas quando absolutamente necessário (frameworks).

---

### 4. Validação Apenas em Setters

```java
public class Produto {
    private double preco;

    public Produto(double preco) {
        this.preco = preco;  // SEM validação
    }

    public void setPreco(double preco) {
        if (preco < 0) throw new IllegalArgumentException();
        this.preco = preco;
    }
}

// Problema:
Produto p = new Produto(-10);  // Cria objeto inválido
```

**Solução**: Validar no construtor também
```java
public Produto(double preco) {
    setPreco(preco);  // Usa setter com validação
}
```

---

### 5. Classes Internas Públicas com Membros Privados

```java
public class Externa {
    public class Interna {
        private int valor;  // Confuso: classe pública com atributo privado
    }
}
```

**Solução**: Se classe interna é parte da implementação, declare-a `private`.

---

## Boas Práticas

### 1. Atributos Sempre Privados (Por Padrão)

```java
// BOM
public class Pessoa {
    private String nome;  // Privado
    private int idade;    // Privado

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}

// EVITAR
public class Pessoa {
    public String nome;  // Público direto
    public int idade;    // Público direto
}
```

---

### 2. Métodos Auxiliares Privados

```java
public class Relatorio {
    public void gerar() {
        carregarDados();    // Privado
        processar();        // Privado
        formatarSaida();    // Privado
    }

    private void carregarDados() { }
    private void processar() { }
    private void formatarSaida() { }
}
```

---

### 3. Validação em Setters

```java
public void setIdade(int idade) {
    if (idade < 0 || idade > 150) {
        throw new IllegalArgumentException("Idade inválida: " + idade);
    }
    this.idade = idade;
}
```

---

### 4. Cópia Defensiva

```java
private List<String> itens;

public List<String> getItens() {
    return new ArrayList<>(itens);  // Cópia
}

public void setItens(List<String> itens) {
    this.itens = new ArrayList<>(itens);  // Cópia
}
```

---

### 5. Construtores Privados Para Singletons

```java
public class Configuracao {
    private static final Configuracao INSTANCIA = new Configuracao();

    private Configuracao() { }  // Privado

    public static Configuracao getInstance() {
        return INSTANCIA;
    }
}
```

---

### 6. Classes Utilitárias com Construtor Privado

```java
public final class StringUtils {
    private StringUtils() {  // Impede instanciação
        throw new UnsupportedOperationException();
    }

    public static boolean isNullOrEmpty(String s) {
        return s == null || s.isEmpty();
    }
}
```

---

### 7. Uso Consciente de Reflection

Evite quebrar encapsulamento. Use apenas quando necessário (frameworks, testes).

---

### 8. Documente Decisões de Design

```java
/**
 * Construtor privado para implementar padrão Singleton.
 * Use getInstance() para obter a instância.
 */
private Configuracao() { }
```

---

### 9. Imutabilidade com Private Final

```java
public final class Ponto {
    private final int x;
    private final int y;

    public Ponto(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }
}
```

---

### 10. Revise Modificadores Regularmente

Questione se cada membro precisa ser `private` ou pode ter outra visibilidade.

---

## Resumo Executivo

O modificador **`private`** é o **mais restritivo** dos modificadores de acesso em Java:

**Características**:
- Acesso **EXCLUSIVO** da própria classe
- **Invisível** para subclasses, mesmo pacote, outros pacotes
- **Fundamental** para encapsulamento (information hiding)
- Protege **dados** e **implementação** interna

**Aplicações**:
1. **Atributos de instância** (regra padrão)
2. **Métodos auxiliares** (helper methods)
3. **Construtores** (Singleton, Factory, classe utilitária)
4. **Classes internas** (estruturas de dados internas)
5. **Constantes internas** (não parte da API pública)
6. **Métodos privados em interfaces** (Java 9+)

**Benefícios**:
- **Encapsulamento**: protege dados
- **Controle**: validação centralizada
- **Flexibilidade**: mudança interna sem afetar código externo
- **Segurança**: acesso controlado
- **Manutenibilidade**: interface pública clara

**Padrões de Uso**:
- **Singleton**: construtor privado + instância estática
- **Factory**: construtor privado + métodos estáticos de criação
- **Classe Utilitária**: construtor privado + métodos estáticos
- **Imutabilidade**: atributos `private final` sem setters

**Boas Práticas**:
- Atributos **sempre privados** (padrão)
- Acesso via **getters/setters** com validação
- Métodos auxiliares **privados**
- **Cópia defensiva** para objetos mutáveis
- Documentar decisões de design
- Evitar quebrar encapsulamento com Reflection

**Armadilhas**:
- Esquecer getters/setters
- Expor referências mutáveis
- Validação apenas em setters (validar no construtor também)
- Uso desnecessário de Reflection

**Regra de Ouro**: **Sempre comece com `private`** e relaxe a visibilidade **apenas quando necessário** para a API pública.
