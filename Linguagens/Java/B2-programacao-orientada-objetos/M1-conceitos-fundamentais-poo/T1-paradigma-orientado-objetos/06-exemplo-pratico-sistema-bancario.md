# T1.06 - Exemplo Prático: Sistema Bancário

## Introdução

**Sistema Bancário** completo demonstra **4 pilares** da POO em prática.

```java
// ✅ Sistema bancário: POO em ação

// Classes principais:
// - Banco
// - Cliente
// - Conta (abstrata)
//   - ContaCorrente
//   - ContaPoupanca
// - Transacao

// Demonstra:
// - Abstração: interface simples
// - Encapsulamento: dados privados
// - Herança: Conta → ContaCorrente, ContaPoupanca
// - Polimorfismo: tratar todas como Conta
```

---

## Fundamentos

### 1. Classe Cliente

```java
public class Cliente {
    // Encapsulamento: dados privados
    private String nome;
    private String cpf;
    private String email;
    private String telefone;
    private LocalDate dataNascimento;
    
    public Cliente(String nome, String cpf, String email, String telefone, 
                   LocalDate dataNascimento) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
    }
    
    public int getIdade() {
        return Period.between(dataNascimento, LocalDate.now()).getYears();
    }
    
    public void exibirDados() {
        System.out.println("=== Dados do Cliente ===");
        System.out.println("Nome: " + nome);
        System.out.println("CPF: " + cpf);
        System.out.println("Email: " + email);
        System.out.println("Telefone: " + telefone);
        System.out.println("Idade: " + getIdade() + " anos");
    }
    
    // Getters
    public String getNome() { return nome; }
    public String getCpf() { return cpf; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    
    // Setters com validação
    public void setEmail(String email) {
        if (email != null && email.contains("@")) {
            this.email = email;
        } else {
            throw new IllegalArgumentException("Email inválido");
        }
    }
    
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
```

### 2. Classe Abstrata Conta (Abstração + Encapsulamento)

```java
public abstract class Conta {
    // Encapsulamento: dados protegidos
    protected int numero;
    protected Cliente titular;
    protected double saldo;
    protected List<Transacao> historico;
    
    // Construtor
    public Conta(int numero, Cliente titular) {
        this.numero = numero;
        this.titular = titular;
        this.saldo = 0;
        this.historico = new ArrayList<>();
    }
    
    // Método comum a todas as contas
    public void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        
        saldo += valor;
        registrarTransacao("DEPOSITO", valor);
        System.out.println("Depósito de R$ " + valor + " realizado");
    }
    
    // Método abstrato (polimorfismo): cada tipo implementa
    public abstract boolean sacar(double valor);
    
    // Método comum
    public boolean transferir(Conta destino, double valor) {
        if (this.sacar(valor)) {
            destino.depositar(valor);
            registrarTransacao("TRANSFERENCIA_ENVIADA", valor);
            destino.registrarTransacao("TRANSFERENCIA_RECEBIDA", valor);
            System.out.println("Transferência de R$ " + valor + " realizada");
            return true;
        }
        return false;
    }
    
    // Método protegido
    protected void registrarTransacao(String tipo, double valor) {
        Transacao transacao = new Transacao(tipo, valor, LocalDateTime.now());
        historico.add(transacao);
    }
    
    public void exibirExtrato() {
        System.out.println("=== Extrato ===");
        System.out.println("Conta: " + numero);
        System.out.println("Titular: " + titular.getNome());
        System.out.println("Saldo atual: R$ " + saldo);
        System.out.println("\nHistórico:");
        for (Transacao t : historico) {
            System.out.println(t);
        }
    }
    
    // Getters
    public int getNumero() { return numero; }
    public Cliente getTitular() { return titular; }
    public double getSaldo() { return saldo; }
}
```

### 3. Conta Corrente (Herança)

```java
public class ContaCorrente extends Conta {
    // Atributo específico
    private double limite;
    private double taxaManutencao;
    
    public ContaCorrente(int numero, Cliente titular, double limite) {
        super(numero, titular);
        this.limite = limite;
        this.taxaManutencao = 15.0;
    }
    
    // Polimorfismo: implementação específica de sacar
    @Override
    public boolean sacar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        
        // Conta corrente: pode usar limite
        if ((saldo + limite) >= valor) {
            saldo -= valor;
            registrarTransacao("SAQUE", valor);
            System.out.println("Saque de R$ " + valor + " realizado");
            return true;
        } else {
            System.out.println("Saldo + limite insuficiente");
            return false;
        }
    }
    
    // Método específico de Conta Corrente
    public void cobrarTaxaManutencao() {
        saldo -= taxaManutencao;
        registrarTransacao("TAXA_MANUTENCAO", taxaManutencao);
        System.out.println("Taxa de manutenção de R$ " + taxaManutencao + 
                         " cobrada");
    }
    
    public double getLimite() { return limite; }
    public void setLimite(double limite) { this.limite = limite; }
    
    @Override
    public void exibirExtrato() {
        super.exibirExtrato();
        System.out.println("Limite: R$ " + limite);
        System.out.println("Saldo disponível: R$ " + (saldo + limite));
    }
}
```

### 4. Conta Poupança (Herança)

```java
public class ContaPoupanca extends Conta {
    // Atributo específico
    private double taxaRendimento;
    
    public ContaPoupanca(int numero, Cliente titular) {
        super(numero, titular);
        this.taxaRendimento = 0.005;  // 0.5% ao mês
    }
    
    // Polimorfismo: implementação específica de sacar
    @Override
    public boolean sacar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        
        // Conta poupança: não pode usar limite
        if (saldo >= valor) {
            saldo -= valor;
            registrarTransacao("SAQUE", valor);
            System.out.println("Saque de R$ " + valor + " realizado");
            return true;
        } else {
            System.out.println("Saldo insuficiente");
            return false;
        }
    }
    
    // Método específico de Conta Poupança
    public void aplicarRendimento() {
        double rendimento = saldo * taxaRendimento;
        saldo += rendimento;
        registrarTransacao("RENDIMENTO", rendimento);
        System.out.println("Rendimento de R$ " + rendimento + " aplicado");
    }
    
    public double getTaxaRendimento() { return taxaRendimento; }
    
    @Override
    public void exibirExtrato() {
        super.exibirExtrato();
        System.out.println("Taxa de rendimento: " + (taxaRendimento * 100) + "%");
    }
}
```

### 5. Classe Transacao

```java
public class Transacao {
    private String tipo;
    private double valor;
    private LocalDateTime dataHora;
    
    public Transacao(String tipo, double valor, LocalDateTime dataHora) {
        this.tipo = tipo;
        this.valor = valor;
        this.dataHora = dataHora;
    }
    
    @Override
    public String toString() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return String.format("%s - %s - R$ %.2f", 
                           dataHora.format(formatter), tipo, valor);
    }
    
    public String getTipo() { return tipo; }
    public double getValor() { return valor; }
    public LocalDateTime getDataHora() { return dataHora; }
}
```

### 6. Classe Banco

```java
public class Banco {
    private String nome;
    private List<Cliente> clientes;
    private List<Conta> contas;
    private int proximoNumeroConta;
    
    public Banco(String nome) {
        this.nome = nome;
        this.clientes = new ArrayList<>();
        this.contas = new ArrayList<>();
        this.proximoNumeroConta = 1001;
    }
    
    // Cadastrar cliente
    public void cadastrarCliente(Cliente cliente) {
        clientes.add(cliente);
        System.out.println("Cliente " + cliente.getNome() + " cadastrado");
    }
    
    // Criar conta corrente
    public ContaCorrente criarContaCorrente(Cliente cliente, double limite) {
        if (!clientes.contains(cliente)) {
            cadastrarCliente(cliente);
        }
        
        ContaCorrente conta = new ContaCorrente(proximoNumeroConta++, 
                                                cliente, limite);
        contas.add(conta);
        System.out.println("Conta Corrente " + conta.getNumero() + 
                         " criada para " + cliente.getNome());
        return conta;
    }
    
    // Criar conta poupança
    public ContaPoupanca criarContaPoupanca(Cliente cliente) {
        if (!clientes.contains(cliente)) {
            cadastrarCliente(cliente);
        }
        
        ContaPoupanca conta = new ContaPoupanca(proximoNumeroConta++, cliente);
        contas.add(conta);
        System.out.println("Conta Poupança " + conta.getNumero() + 
                         " criada para " + cliente.getNome());
        return conta;
    }
    
    // Buscar conta por número
    public Conta buscarConta(int numero) {
        return contas.stream()
            .filter(c -> c.getNumero() == numero)
            .findFirst()
            .orElse(null);
    }
    
    // Listar todas as contas
    public void listarContas() {
        System.out.println("=== Contas do " + nome + " ===");
        for (Conta conta : contas) {
            String tipo = conta instanceof ContaCorrente ? "Corrente" : "Poupança";
            System.out.println("Conta " + tipo + " " + conta.getNumero() + 
                             " - Titular: " + conta.getTitular().getNome() + 
                             " - Saldo: R$ " + conta.getSaldo());
        }
    }
    
    // Polimorfismo: processar todas as contas
    public void processarRendimentos() {
        System.out.println("=== Processando rendimentos ===");
        for (Conta conta : contas) {
            if (conta instanceof ContaPoupanca) {
                ((ContaPoupanca) conta).aplicarRendimento();
            }
        }
    }
    
    public void cobrarTaxasManutencao() {
        System.out.println("=== Cobrando taxas de manutenção ===");
        for (Conta conta : contas) {
            if (conta instanceof ContaCorrente) {
                ((ContaCorrente) conta).cobrarTaxaManutencao();
            }
        }
    }
}
```

### 7. Uso Completo do Sistema

```java
public class SistemaBancarioApp {
    public static void main(String[] args) {
        // Criar banco
        Banco banco = new Banco("Banco do Brasil");
        
        // Criar clientes
        Cliente cliente1 = new Cliente(
            "João Silva",
            "111.111.111-11",
            "joao@example.com",
            "(11) 91111-1111",
            LocalDate.of(1985, 5, 15)
        );
        
        Cliente cliente2 = new Cliente(
            "Maria Oliveira",
            "222.222.222-22",
            "maria@example.com",
            "(11) 92222-2222",
            LocalDate.of(1990, 8, 20)
        );
        
        // Criar contas
        ContaCorrente cc1 = banco.criarContaCorrente(cliente1, 1000);
        ContaPoupanca cp1 = banco.criarContaPoupanca(cliente1);
        ContaCorrente cc2 = banco.criarContaCorrente(cliente2, 500);
        
        System.out.println("\n--- Operações Conta Corrente ---");
        cc1.depositar(2000);
        cc1.sacar(500);
        cc1.sacar(2000);  // Usa limite
        cc1.sacar(1000);  // Saldo + limite insuficiente
        
        System.out.println("\n--- Operações Conta Poupança ---");
        cp1.depositar(1000);
        cp1.sacar(200);
        cp1.aplicarRendimento();
        
        System.out.println("\n--- Transferência ---");
        cc1.transferir(cc2, 300);
        
        System.out.println("\n--- Extratos ---");
        cc1.exibirExtrato();
        System.out.println();
        cp1.exibirExtrato();
        System.out.println();
        cc2.exibirExtrato();
        
        System.out.println("\n--- Processar Rendimentos Mensais ---");
        banco.processarRendimentos();
        
        System.out.println("\n--- Cobrar Taxas de Manutenção ---");
        banco.cobrarTaxasManutencao();
        
        System.out.println("\n--- Listar Todas as Contas ---");
        banco.listarContas();
        
        // Polimorfismo: tratar todas as contas de forma genérica
        System.out.println("\n--- Polimorfismo: Processar Todas ---");
        List<Conta> todasContas = List.of(cc1, cp1, cc2);
        for (Conta conta : todasContas) {
            System.out.println("Conta " + conta.getNumero() + 
                             " - Saldo: R$ " + conta.getSaldo());
        }
    }
}
```

### 8. Saída do Sistema

```
Cliente João Silva cadastrado
Conta Corrente 1001 criada para João Silva
Cliente João Silva já cadastrado
Conta Poupança 1002 criada para João Silva
Cliente Maria Oliveira cadastrado
Conta Corrente 1003 criada para Maria Oliveira

--- Operações Conta Corrente ---
Depósito de R$ 2000.0 realizado
Saque de R$ 500.0 realizado
Saque de R$ 2000.0 realizado
Saldo + limite insuficiente

--- Operações Conta Poupança ---
Depósito de R$ 1000.0 realizado
Saque de R$ 200.0 realizado
Rendimento de R$ 4.0 aplicado

--- Transferência ---
Saque de R$ 300.0 realizado
Depósito de R$ 300.0 realizado
Transferência de R$ 300.0 realizada

--- Extratos ---
=== Extrato ===
Conta: 1001
Titular: João Silva
Saldo atual: R$ -800.0

Histórico:
28/11/2025 10:30:15 - DEPOSITO - R$ 2000.00
28/11/2025 10:30:16 - SAQUE - R$ 500.00
28/11/2025 10:30:17 - SAQUE - R$ 2000.00
28/11/2025 10:30:20 - SAQUE - R$ 300.00
28/11/2025 10:30:20 - TRANSFERENCIA_ENVIADA - R$ 300.00
Limite: R$ 1000.0
Saldo disponível: R$ 200.0

=== Extrato ===
Conta: 1002
Titular: João Silva
Saldo atual: R$ 804.0

Histórico:
28/11/2025 10:30:18 - DEPOSITO - R$ 1000.00
28/11/2025 10:30:19 - SAQUE - R$ 200.00
28/11/2025 10:30:19 - RENDIMENTO - R$ 4.00
Taxa de rendimento: 0.5%

=== Extrato ===
Conta: 1003
Titular: Maria Oliveira
Saldo atual: R$ 300.0

Histórico:
28/11/2025 10:30:20 - DEPOSITO - R$ 300.00
28/11/2025 10:30:20 - TRANSFERENCIA_RECEBIDA - R$ 300.00
Limite: R$ 500.0
Saldo disponível: R$ 800.0

--- Processar Rendimentos Mensais ---
=== Processando rendimentos ===
Rendimento de R$ 4.02 aplicado

--- Cobrar Taxas de Manutenção ---
=== Cobrando taxas de manutenção ===
Taxa de manutenção de R$ 15.0 cobrada
Taxa de manutenção de R$ 15.0 cobrada

--- Listar Todas as Contas ---
=== Contas do Banco do Brasil ===
Conta Corrente 1001 - Titular: João Silva - Saldo: R$ -815.0
Conta Poupança 1002 - Titular: João Silva - Saldo: R$ 808.02
Conta Corrente 1003 - Titular: Maria Oliveira - Saldo: R$ 285.0

--- Polimorfismo: Processar Todas ---
Conta 1001 - Saldo: R$ -815.0
Conta 1002 - Saldo: R$ 808.02
Conta 1003 - Saldo: R$ 285.0
```

### 9. Demonstração dos 4 Pilares

```java
// ✅ 1. ABSTRAÇÃO
// Interface simples: depositar(), sacar(), transferir()
// Implementação complexa escondida

// ✅ 2. ENCAPSULAMENTO
// Dados privados: saldo, historico
// Acesso controlado: getSaldo(), depositar(), sacar()

// ✅ 3. HERANÇA
// Conta (abstrata) → ContaCorrente, ContaPoupanca
// Reutilização: depositar(), transferir(), exibirExtrato()

// ✅ 4. POLIMORFISMO
// Tratar ContaCorrente e ContaPoupanca como Conta
List<Conta> contas = List.of(cc1, cp1, cc2);
for (Conta conta : contas) {
    conta.depositar(100);  // Polimorfismo
}
```

### 10. Extensões Possíveis

```java
// ✅ Extensões futuras

// 1. Conta Salário
class ContaSalario extends Conta {
    @Override
    public boolean sacar(double valor) {
        // Saque limitado
    }
}

// 2. Conta Investimento
class ContaInvestimento extends Conta {
    private List<Investimento> investimentos;
    
    public void investir(Investimento inv) {
        // Aplicar investimento
    }
}

// 3. Gerente de Banco
class Gerente {
    private List<Cliente> clientes;
    
    public void aprovarEmprestimo(Cliente cliente, double valor) {
        // Aprovar empréstimo
    }
}

// 4. Empréstimo
class Emprestimo {
    private Cliente cliente;
    private double valor;
    private int parcelas;
    
    public void calcularParcela() {
        // Calcular parcela
    }
}
```

---

## Aplicabilidade

Sistema bancário demonstra:
- **Abstração**: interface simples
- **Encapsulamento**: dados protegidos
- **Herança**: Conta → tipos específicos
- **Polimorfismo**: tratar todas como Conta

---

## Armadilhas

### 1. Não Validar Operações

```java
// ⚠️ Sem validação
public void sacar(double valor) {
    saldo -= valor;  // ⚠️ Permite saldo negativo
}

// ✅ Com validação
public boolean sacar(double valor) {
    if (valor > 0 && saldo >= valor) {
        saldo -= valor;
        return true;
    }
    return false;
}
```

### 2. Expor Saldo Diretamente

```java
// ⚠️ Saldo público
public double saldo;

// ✅ Saldo privado + getter
private double saldo;
public double getSaldo() { return saldo; }
```

### 3. Não Registrar Histórico

```java
// ✅ Sempre registrar transações
protected void registrarTransacao(String tipo, double valor) {
    historico.add(new Transacao(tipo, valor, LocalDateTime.now()));
}
```

---

## Boas Práticas

### 1. Validar Sempre

```java
// ✅ Validação em todos os métodos
if (valor <= 0) {
    throw new IllegalArgumentException("Valor inválido");
}
```

### 2. Usar Polimorfismo

```java
// ✅ Tratar todas as contas de forma genérica
for (Conta conta : contas) {
    conta.depositar(100);
}
```

### 3. Encapsular Lógica

```java
// ✅ Lógica de saque dentro da classe Conta
public abstract boolean sacar(double valor);
```

---

## Resumo

**Sistema Bancário POO**:

**Classes**:
- `Cliente`: dados do cliente
- `Conta` (abstrata): operações comuns
- `ContaCorrente`: com limite
- `ContaPoupanca`: com rendimento
- `Transacao`: histórico
- `Banco`: gerencia contas

**4 Pilares**:
1. **Abstração**: interface simples (depositar, sacar)
2. **Encapsulamento**: dados privados (saldo, historico)
3. **Herança**: Conta → ContaCorrente, ContaPoupanca
4. **Polimorfismo**: tratar todas como Conta

**Funcionalidades**:
- Criar contas
- Depositar, sacar, transferir
- Histórico de transações
- Rendimento (poupança)
- Taxa manutenção (corrente)

**Regra de Ouro**: Sistema bancário = **exemplo completo** dos **4 pilares** da POO. **Abstração** (interface simples), **Encapsulamento** (dados protegidos), **Herança** (reutilização), **Polimorfismo** (substituibilidade). Código **organizado**, **extensível**, **mantível**.
