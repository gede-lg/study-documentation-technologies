# T3.02 - Acesso a Todos os Membros da Classe Externa

## Introdução

**Inner class**: acessa TODOS os membros da classe externa (public, private, protected, default).

```java
public class Banco {
    private String nome = "Banco XYZ";
    private double taxaJuros = 0.05;
    
    public class Conta {
        private String numero;
        
        public void exibir() {
            // ✅ Acessa membros PRIVATE de Banco
            System.out.println("Banco: " + nome);
            System.out.println("Taxa: " + taxaJuros);
            System.out.println("Conta: " + numero);
        }
    }
}
```

**Privilégio especial**: inner class tem acesso total à classe externa.

---

## Fundamentos

### 1. Acesso a Atributos Private

**Private**: inner class acessa normalmente.

```java
public class Usuario {
    private String nome;
    private String email;
    private String senha; // Private
    private boolean ativo;
    
    public Usuario(String nome, String email, String senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.ativo = true;
    }
    
    // Inner class
    public class Validador {
        public boolean validarCredenciais(String emailInput, String senhaInput) {
            // ✅ Acessa 'email' e 'senha' privados
            return email.equals(emailInput) && senha.equals(senhaInput);
        }
        
        public boolean validarAtivo() {
            // ✅ Acessa 'ativo' privado
            return ativo;
        }
    }
}

// Uso
Usuario user = new Usuario("João", "joao@email.com", "senha123");
Usuario.Validador val = user.new Validador();

boolean valido = val.validarCredenciais("joao@email.com", "senha123");
System.out.println("Válido: " + valido); // true
```

### 2. Acesso a Métodos Private

**Métodos private**: inner class pode chamar.

```java
public class Calculadora {
    private double valor = 0;
    
    private void log(String operacao, double resultado) {
        System.out.println("[LOG] " + operacao + " = " + resultado);
    }
    
    private double calcular(double a, double b, String operador) {
        switch (operador) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return a / b;
            default: return 0;
        }
    }
    
    // Inner class
    public class Operacoes {
        public void somar(double a, double b) {
            // ✅ Chama método private
            valor = calcular(a, b, "+");
            log("Soma", valor);
        }
        
        public void multiplicar(double a, double b) {
            valor = calcular(a, b, "*");
            log("Multiplicação", valor);
        }
        
        public double getResultado() {
            return valor;
        }
    }
}

// Uso
Calculadora calc = new Calculadora();
Calculadora.Operacoes ops = calc.new Operacoes();

ops.somar(5, 3);
// [LOG] Soma = 8.0

ops.multiplicar(4, 2);
// [LOG] Multiplicação = 8.0
```

### 3. Modificação de Atributos Private

**Modificação**: inner class pode alterar atributos privados.

```java
public class ContaBancaria {
    private double saldo = 0;
    private List<String> historico = new ArrayList<>();
    
    // Inner class
    public class Operacao {
        public void depositar(double valor) {
            if (valor > 0) {
                // ✅ Modifica 'saldo' private
                saldo += valor;
                // ✅ Modifica 'historico' private
                historico.add("DEPOSITO: +" + valor);
                System.out.println("Saldo: " + saldo);
            }
        }
        
        public void sacar(double valor) {
            if (valor > 0 && valor <= saldo) {
                saldo -= valor;
                historico.add("SAQUE: -" + valor);
                System.out.println("Saldo: " + saldo);
            } else {
                System.out.println("Saldo insuficiente");
            }
        }
        
        public void exibirHistorico() {
            System.out.println("=== Histórico ===");
            for (String op : historico) {
                System.out.println(op);
            }
        }
    }
}

// Uso
ContaBancaria conta = new ContaBancaria();
ContaBancaria.Operacao op = conta.new Operacao();

op.depositar(1000);
op.sacar(300);
op.depositar(500);
op.exibirHistorico();
```

### 4. Acesso a Atributos Protected

**Protected**: inner class acessa.

```java
public class Veiculo {
    protected String marca;
    protected String modelo;
    protected int ano;
    
    public Veiculo(String marca, String modelo, int ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
    }
    
    // Inner class
    public class Informacoes {
        public void exibir() {
            // ✅ Acessa atributos protected
            System.out.println("Marca: " + marca);
            System.out.println("Modelo: " + modelo);
            System.out.println("Ano: " + ano);
        }
        
        public int calcularIdade() {
            int anoAtual = java.time.Year.now().getValue();
            return anoAtual - ano;
        }
    }
}

// Uso
Veiculo veiculo = new Veiculo("Toyota", "Corolla", 2020);
Veiculo.Informacoes info = veiculo.new Informacoes();

info.exibir();
System.out.println("Idade: " + info.calcularIdade() + " anos");
```

### 5. Acesso a Atributos Static

**Static**: inner class acessa atributos static da externa.

```java
public class Configuracao {
    private static String ambiente = "DEV";
    private static int maxConexoes = 100;
    private String nome;
    
    public Configuracao(String nome) {
        this.nome = nome;
    }
    
    // Inner class
    public class Leitor {
        public void exibir() {
            // ✅ Acessa static
            System.out.println("Ambiente: " + ambiente);
            System.out.println("Max Conexões: " + maxConexoes);
            
            // ✅ Acessa instância
            System.out.println("Nome: " + nome);
        }
    }
}

// Uso
Configuracao config = new Configuracao("Config1");
Configuracao.Leitor leitor = config.new Leitor();
leitor.exibir();
```

### 6. Acesso a Constantes Private

**Constantes**: inner class acessa constantes privadas.

```java
public class Sistema {
    private static final String VERSAO = "1.0.0";
    private static final int MAX_TENTATIVAS = 3;
    private static final long TIMEOUT_MS = 5000;
    
    private String nome;
    
    public Sistema(String nome) {
        this.nome = nome;
    }
    
    // Inner class
    public class Info {
        public void exibir() {
            // ✅ Acessa constantes private
            System.out.println("Sistema: " + nome);
            System.out.println("Versão: " + VERSAO);
            System.out.println("Max Tentativas: " + MAX_TENTATIVAS);
            System.out.println("Timeout: " + TIMEOUT_MS + "ms");
        }
    }
}

// Uso
Sistema sistema = new Sistema("Sistema Principal");
Sistema.Info info = sistema.new Info();
info.exibir();
```

### 7. Acesso Bidirecional

**Bidirecional**: classe externa também acessa membros private da inner.

```java
public class Container {
    private String nome;
    
    public Container(String nome) {
        this.nome = nome;
    }
    
    // Inner class
    public class Item {
        private String descricao;
        
        public Item(String descricao) {
            this.descricao = descricao;
        }
    }
    
    public void exibirItem(Item item) {
        // ✅ Externa acessa 'descricao' private de Inner
        System.out.println("Container: " + nome);
        System.out.println("Item: " + item.descricao);
    }
}

// Uso
Container container = new Container("Container A");
Container.Item item = container.new Item("Item 1");
container.exibirItem(item);
// Container: Container A
// Item: Item 1
```

### 8. Acesso a Métodos Sobrescritos

**Override**: inner class acessa versão original.

```java
public class Base {
    protected String obterNome() {
        return "Base";
    }
}

public class Derivada extends Base {
    @Override
    protected String obterNome() {
        return "Derivada";
    }
    
    // Inner class
    public class Helper {
        public void exibir() {
            // Acessa método sobrescrito de Derivada
            String nome = obterNome();
            System.out.println("Nome: " + nome); // Derivada
            
            // Acessa método da Base via super
            String nomeBase = Derivada.super.obterNome();
            System.out.println("Nome Base: " + nomeBase); // Base
        }
    }
}

// Uso
Derivada obj = new Derivada();
Derivada.Helper helper = obj.new Helper();
helper.exibir();
// Nome: Derivada
// Nome Base: Base
```

### 9. Acesso em Hierarquia

**Herança**: inner class acessa hierarquia completa.

```java
public class Animal {
    protected String especie;
    
    public Animal(String especie) {
        this.especie = especie;
    }
}

public class Cachorro extends Animal {
    private String raca;
    private int idade;
    
    public Cachorro(String raca, int idade) {
        super("Canino");
        this.raca = raca;
        this.idade = idade;
    }
    
    // Inner class
    public class Ficha {
        public void exibir() {
            // ✅ Acessa 'especie' de Animal (protected)
            System.out.println("Espécie: " + especie);
            
            // ✅ Acessa 'raca' e 'idade' de Cachorro (private)
            System.out.println("Raça: " + raca);
            System.out.println("Idade: " + idade);
        }
    }
}

// Uso
Cachorro dog = new Cachorro("Labrador", 3);
Cachorro.Ficha ficha = dog.new Ficha();
ficha.exibir();
```

### 10. Acesso a Enums Private

**Enum private**: inner class acessa.

```java
public class Pedido {
    private enum Status {
        PENDENTE, APROVADO, ENVIADO, ENTREGUE, CANCELADO
    }
    
    private Status status = Status.PENDENTE;
    
    // Inner class
    public class Processador {
        public void aprovar() {
            // ✅ Acessa enum private
            status = Status.APROVADO;
            System.out.println("Status: " + status);
        }
        
        public void enviar() {
            if (status == Status.APROVADO) {
                status = Status.ENVIADO;
                System.out.println("Status: " + status);
            } else {
                System.out.println("Pedido não aprovado");
            }
        }
        
        public boolean isPendente() {
            return status == Status.PENDENTE;
        }
    }
}

// Uso
Pedido pedido = new Pedido();
Pedido.Processador proc = pedido.new Processador();

proc.aprovar(); // Status: APROVADO
proc.enviar();  // Status: ENVIADO
```

---

## Aplicabilidade

**Acesso total útil para**:
- Iterator (acessa estrutura interna)
- Builder (modifica objeto sendo construído)
- Validator (verifica estado privado)
- Helper (processa dados privados)
- Observer (monitora estado)

---

## Armadilhas

### 1. Quebra de Encapsulamento

```java
// ⚠️ Inner class expõe dados privados
public class Usuario {
    private String senha;
    
    public class Expositor {
        public String getSenha() {
            return senha; // Expõe senha
        }
    }
}

// Acesso indireto à senha
Usuario user = new Usuario();
Usuario.Expositor exp = user.new Expositor();
String senha = exp.getSenha(); // ⚠️ Quebra encapsulamento
```

### 2. Acoplamento Forte

```java
// ⚠️ Inner class muito acoplada
public class Documento {
    private List<String> linhas;
    private String titulo;
    private String autor;
    
    public class Editor {
        // Acessa TUDO de Documento
        public void processar() {
            // Fortemente acoplado
        }
    }
}
```

### 3. Modificação Não Controlada

```java
// ⚠️ Inner class modifica sem validação
public class Conta {
    private double saldo;
    
    public class Modificador {
        public void alterar(double novoSaldo) {
            // ⚠️ Sem validação
            saldo = novoSaldo;
        }
    }
}
```

### 4. Acesso Circular

```java
// ⚠️ Acesso circular confuso
public class A {
    private B.Inner innerB;
    
    public class Inner {
        public void metodo() {
            // Acessa innerB que é de B.Inner
        }
    }
}

public class B {
    private A.Inner innerA;
    
    public class Inner {
        public void metodo() {
            // Acessa innerA que é de A.Inner
        }
    }
}
```

### 5. Confusão com Shadowing

```java
public class Externa {
    private String nome = "Externa";
    
    public class Interna {
        private String nome = "Interna";
        
        public void exibir() {
            // ⚠️ Qual nome?
            System.out.println(nome); // Interna (shadowing)
            
            // ✅ Explícito
            System.out.println(Externa.this.nome); // Externa
        }
    }
}
```

---

## Boas Práticas

### 1. Encapsular Lógica Relacionada

```java
// ✅ Inner class para lógica relacionada
public class Lista {
    private Object[] elementos;
    private int tamanho;
    
    // Inner class tem acesso total (necessário)
    public class Iterador implements Iterator<Object> {
        private int indice = 0;
        
        @Override
        public boolean hasNext() {
            return indice < tamanho;
        }
        
        @Override
        public Object next() {
            return elementos[indice++];
        }
    }
}
```

### 2. Validação Interna

```java
// ✅ Validador com acesso aos privados
public class Usuario {
    private String nome;
    private String email;
    private int idade;
    
    public class Validator {
        public boolean validar() {
            // Acessa todos os campos para validar
            return nome != null && nome.length() >= 3 &&
                   email != null && email.contains("@") &&
                   idade >= 18;
        }
        
        public List<String> obterErros() {
            List<String> erros = new ArrayList<>();
            
            if (nome == null || nome.length() < 3) {
                erros.add("Nome inválido");
            }
            if (email == null || !email.contains("@")) {
                erros.add("Email inválido");
            }
            if (idade < 18) {
                erros.add("Idade mínima: 18");
            }
            
            return erros;
        }
    }
}
```

### 3. Builder com Validação

```java
// ✅ Builder modificando objeto com validação
public class Pedido {
    private String numero;
    private String cliente;
    private double total;
    
    private Pedido() { }
    
    public class Builder {
        public Builder numero(String numero) {
            if (numero == null || numero.isEmpty()) {
                throw new IllegalArgumentException("Número inválido");
            }
            Pedido.this.numero = numero;
            return this;
        }
        
        public Builder cliente(String cliente) {
            if (cliente == null) {
                throw new IllegalArgumentException("Cliente obrigatório");
            }
            Pedido.this.cliente = cliente;
            return this;
        }
        
        public Builder total(double total) {
            if (total < 0) {
                throw new IllegalArgumentException("Total inválido");
            }
            Pedido.this.total = total;
            return this;
        }
        
        public Pedido build() {
            if (numero == null || cliente == null) {
                throw new IllegalStateException("Dados incompletos");
            }
            return Pedido.this;
        }
    }
}
```

### 4. Documentar Acesso

```java
/**
 * Conta bancária.
 */
public class Conta {
    private double saldo;
    
    /**
     * Operações de conta.
     * 
     * <p>Esta inner class tem acesso direto ao saldo
     * para realizar operações de forma eficiente.
     */
    public class Operacoes {
        public void depositar(double valor) {
            // Acessa e modifica 'saldo' diretamente
            saldo += valor;
        }
    }
}
```

### 5. Métodos Helper Private

```java
// ✅ Helper methods para inner class
public class Calculadora {
    private double memoria = 0;
    
    private void validar(double valor) {
        if (Double.isNaN(valor) || Double.isInfinite(valor)) {
            throw new IllegalArgumentException("Valor inválido");
        }
    }
    
    public class Memoria {
        public void salvar(double valor) {
            validar(valor); // Usa método private da externa
            memoria = valor;
        }
        
        public double recuperar() {
            return memoria;
        }
        
        public void limpar() {
            memoria = 0;
        }
    }
}
```

### 6. Getter/Setter Controlados

```java
// ✅ Inner class com acesso controlado
public class Produto {
    private double preco;
    private double desconto = 0;
    
    public class Promocao {
        public void aplicarDesconto(double percentual) {
            if (percentual < 0 || percentual > 0.5) {
                throw new IllegalArgumentException(
                    "Desconto deve ser entre 0% e 50%"
                );
            }
            desconto = percentual;
        }
        
        public double calcularPrecoFinal() {
            return preco * (1 - desconto);
        }
    }
}
```

### 7. Observer Pattern

```java
// ✅ Observer com acesso ao estado
public class Temperatura {
    private double valor;
    private List<Observer> observers = new ArrayList<>();
    
    public interface Observer {
        void onChange(double novoValor);
    }
    
    // Inner observer pode acessar estado
    public class AlertaAlta implements Observer {
        private double limiteAlto = 30.0;
        
        @Override
        public void onChange(double novoValor) {
            if (novoValor > limiteAlto) {
                System.out.println("ALERTA: Temperatura alta! " + novoValor);
            }
        }
    }
    
    public void setValor(double valor) {
        this.valor = valor;
        notificar();
    }
    
    private void notificar() {
        for (Observer obs : observers) {
            obs.onChange(valor);
        }
    }
    
    public void addObserver(Observer obs) {
        observers.add(obs);
    }
}
```

### 8. Imutabilidade Parcial

```java
// ✅ Inner class modifica, mas externa é imutável externamente
public final class Contador {
    private int valor = 0;
    
    // Sem setter público
    
    public class Incrementador {
        public void incrementar() {
            valor++; // Modifica internamente
        }
        
        public void decrementar() {
            valor--;
        }
    }
    
    public int getValor() {
        return valor;
    }
}
```

### 9. Factory Interno

```java
// ✅ Factory que acessa construtor privado
public class Usuario {
    private String nome;
    private String email;
    
    private Usuario(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
    
    public static class Factory {
        public static Usuario criar(String nome, String email) {
            // Validação
            if (nome == null || email == null) {
                throw new IllegalArgumentException("Dados inválidos");
            }
            
            // Acessa construtor privado (mesma classe externa)
            return new Usuario(nome, email);
        }
    }
}
```

### 10. Template Method

```java
// ✅ Template method com inner class
public abstract class Processador {
    private String resultado;
    
    protected abstract String processar(String entrada);
    
    // Inner class usa template method
    public class Executor {
        public void executar(String entrada) {
            System.out.println("Iniciando...");
            
            // Chama método abstrato
            resultado = processar(entrada);
            
            System.out.println("Resultado: " + resultado);
        }
    }
    
    public String getResultado() {
        return resultado;
    }
}
```

---

## Resumo

**Inner class**: acessa TODOS os membros da classe externa.

```java
public class Externa {
    private String valor = "Private";
    
    public class Interna {
        public void metodo() {
            System.out.println(valor); // ✅ Acessa private
        }
    }
}
```

**Acesso total**:
- Private
- Protected
- Public
- Default
- Static
- Constantes
- Métodos
- Enums

**Acesso bidirecional**: externa também acessa private da inner.

**Usos apropriados**:
- Iterator
- Builder
- Validator
- Helper
- Observer

**Boas práticas**:
- Encapsular lógica relacionada
- Validação interna
- Builder com validação
- Documentar acesso
- Helper methods private
- Getter/setter controlados
- Observer pattern
- Imutabilidade parcial
- Factory interno
- Template method

**Armadilhas**:
- ❌ Quebra de encapsulamento
- ❌ Acoplamento forte
- ❌ Modificação não controlada
- ❌ Acesso circular
- ❌ Confusão com shadowing

**Regra de Ouro**: **Inner classes** têm **acesso total** a TODOS os membros da classe externa (incluindo **private**). Use esse privilégio com **responsabilidade** - não exponha dados sensíveis. Inner classes são ideais quando precisam **manipular estado interno** (Iterator, Builder, Validator). Documente o **relacionamento** e **justifique** o acesso privilegiado.
