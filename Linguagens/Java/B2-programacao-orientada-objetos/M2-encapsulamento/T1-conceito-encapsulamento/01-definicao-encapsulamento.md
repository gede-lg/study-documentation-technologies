# Definição de Encapsulamento

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Encapsulamento** é princípio fundamental de POO que consiste em esconder detalhes de implementação interna de uma classe, expondo apenas interface pública controlada - combinando dados (atributos) e comportamentos (métodos) que operam sobre esses dados em unidade coesa, protegendo estado interno de acesso e modificação externa arbitrária. Conceitualmente, encapsulamento é "cápsula protetora" ao redor dos dados - acesso controlado via métodos públicos, implementação interna privada e invisível.

É diferença entre "como funciona" (privado, escondido) e "como usar" (público, exposto). Carro encapsula motor - motorista usa volante/pedais (interface pública), não manipula pistões diretamente (implementação privada). `ContaBancaria` encapsula `saldo` - código externo chama `depositar(100)` (interface), não acessa `conta.saldo += 100` diretamente (violação de encapsulamento).

Propósito é **controle** e **proteção**: impedir que código externo coloque objeto em estado inválido, permitir mudanças internas sem quebrar código cliente, oferecer API estável enquanto implementação evolui. Encapsulamento não é apenas esconder dados, é garantir que objeto sempre mantenha seus invariantes (regras de negócio) através de controle de acesso.

### Contexto Histórico e Motivação

Encapsulamento vem de Simula 67 (primeira linguagem OO, 1967) e foi refinado em Smalltalk (1970s). Linguagens procedurais (C, Pascal) expunham dados em structs - qualquer código podia modificar qualquer campo, causando bugs quando invariantes eram quebrados. POO introduziu encapsulamento para proteger dados e manter consistência.

Java (1996) tornou encapsulamento padrão com modificadores de acesso (`private`, `public`, `protected`) e convenção de atributos privados + getters/setters. JavaBeans specification (1997) formalizou padrão de encapsulamento. Hoje, encapsulamento é reconhecido como um dos quatro pilares de POO (junto com abstração, herança, polimorfismo).

**Motivação Original:** Programação procedural tinha problema de "código espaguete" - qualquer função podia modificar qualquer variável global, tornando impossível rastrear bugs ou manter invariantes. Encapsulamento centraliza controle: objeto é responsável por seu próprio estado, código externo só pode interagir via interface aprovada.

### Problema Fundamental que Resolve

**Problema: Dados Expostos Permitem Estado Inválido**

```java
// SEM encapsulamento - atributos públicos
class ContaBancaria {
    public double saldo;  // ❌ Qualquer código pode modificar!
}

ContaBancaria conta = new ContaBancaria();
conta.saldo = 1000;
// ...
conta.saldo = -500;  // ❌ Saldo negativo! Estado inválido
// Nenhuma validação, nenhum controle
```

**Problemas Causados:**
- Estado inválido (saldo negativo, email sem @, idade 300)
- Invariantes quebrados (total != soma das partes)
- Impossível adicionar validação ou lógica (acesso direto bypassa tudo)
- Dificuldade de debugging (quem modificou? quando?)
- Mudanças internas quebram todo código cliente

**Solução: Encapsulamento Protege e Controla**

```java
// COM encapsulamento - atributos privados
class ContaBancaria {
    private double saldo;  // ✅ Privado - acesso controlado

    public void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        saldo += valor;  // Validado antes de modificar
    }

    public void sacar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        if (valor > saldo) {
            throw new IllegalArgumentException("Saldo insuficiente");
        }
        saldo -= valor;  // Validado - não pode ficar negativo
    }

    public double getSaldo() {
        return saldo;  // Apenas leitura
    }
}

ContaBancaria conta = new ContaBancaria();
conta.depositar(1000);
// conta.saldo = -500;  // ❌ ERRO DE COMPILAÇÃO - saldo é privado!
conta.sacar(200);       // ✅ Validado
// Impossível colocar em estado inválido
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Ocultação de Dados (Data Hiding):**
   - Atributos privados (`private`)
   - Detalhes de implementação escondidos
   - Estado interno protegido de acesso externo direto

2. **Interface Pública:**
   - Métodos públicos (`public`)
   - API estável para interação externa
   - Contratos bem definidos

3. **Controle de Acesso:**
   - Modificadores: `private`, `public`, `protected`, package-private
   - Validação em métodos de acesso
   - Impossibilidade de bypass

4. **Coesão:**
   - Dados e comportamentos juntos
   - Objeto responsável por seu próprio estado
   - Lógica centralizada

5. **Invariantes:**
   - Regras que devem sempre ser verdadeiras
   - Mantidas através de encapsulamento
   - Garantidas por validação interna

### Pilares Fundamentais

- **Private Data:** Atributos `private`
- **Public Interface:** Métodos `public` controlados
- **Validation:** Verificações antes de modificar estado
- **Information Hiding:** Implementação escondida
- **Controlled Access:** Acesso apenas via métodos aprovados

---

## 🧠 Fundamentos Teóricos

### Anatomia do Encapsulamento

```java
class Pessoa {
    // ========== PRIVADO (Implementação) ==========
    private String nome;        // Dados escondidos
    private int idade;
    private String email;

    private boolean validarEmail(String email) {  // Lógica interna privada
        return email != null && email.contains("@");
    }

    // ========== PÚBLICO (Interface) ==========
    public Pessoa(String nome, int idade, String email) {  // Construtor público
        setNome(nome);
        setIdade(idade);
        setEmail(email);
    }

    public String getNome() {  // Getter público
        return nome;
    }

    public void setNome(String nome) {  // Setter público com validação
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        this.nome = nome;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida");
        }
        this.idade = idade;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (!validarEmail(email)) {  // Usa método privado
            throw new IllegalArgumentException("Email inválido");
        }
        this.email = email;
    }

    public void apresentar() {  // Comportamento público
        System.out.println("Olá, meu nome é " + nome);
    }
}
```

**Estrutura:**
- **Privado:** Atributos, métodos auxiliares, detalhes de implementação
- **Público:** Construtores, getters/setters validados, comportamentos

### Princípio: Tell, Don't Ask

```java
// ❌ RUIM - perguntar e fazer (viola encapsulamento)
class ClienteRuim {
    void processar(ContaBancaria conta) {
        double saldo = conta.getSaldo();  // Pergunta
        if (saldo >= 100) {               // Decide fora
            conta.sacar(100);             // Age
        }
    }
}

// ✅ BOM - dizer o que fazer (encapsulamento correto)
class ContaBancariaBoa {
    private double saldo;

    public boolean sacarSeDisponivel(double valor) {
        if (saldo >= valor) {  // Lógica interna
            saldo -= valor;
            return true;
        }
        return false;
    }
}

class ClienteBom {
    void processar(ContaBancariaBoa conta) {
        conta.sacarSeDisponivel(100);  // Apenas diz o que quer
    }
}
```

**Princípio:** Objeto decide sua própria lógica, código externo não.

### Invariantes de Classe

**Invariante** é condição que deve sempre ser verdadeira. Encapsulamento garante invariantes.

```java
class Retangulo {
    private int largura;
    private int altura;

    // INVARIANTE: largura e altura sempre positivos

    public Retangulo(int largura, int altura) {
        setLargura(largura);
        setAltura(altura);
    }

    public void setLargura(int largura) {
        if (largura <= 0) {
            throw new IllegalArgumentException("Largura deve ser positiva");
        }
        this.largura = largura;  // Invariante mantido
    }

    public void setAltura(int altura) {
        if (altura <= 0) {
            throw new IllegalArgumentException("Altura deve ser positiva");
        }
        this.altura = altura;  // Invariante mantido
    }

    public int getArea() {
        return largura * altura;  // Sempre válido (invariante garantido)
    }
}

// Impossível criar retângulo inválido
// Retangulo r = new Retangulo(-5, 10);  // ❌ Exceção
```

---

## 🔍 Análise Conceitual Profunda

### Níveis de Encapsulamento

#### 1. Sem Encapsulamento (Anti-Padrão)

```java
// ❌ Tudo público - nenhum encapsulamento
class Usuario {
    public String nome;
    public String senha;  // ❌ Senha exposta!
    public boolean admin;

    public Usuario() { }
}

Usuario u = new Usuario();
u.senha = "123";  // ❌ Qualquer código pode ver/modificar
u.admin = true;   // ❌ Qualquer código pode dar privilégios
```

#### 2. Encapsulamento Básico

```java
// ✅ Atributos privados + getters/setters
class Usuario {
    private String nome;
    private String senha;
    private boolean admin;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public void setSenha(String senha) {
        this.senha = hashSenha(senha);  // Hash antes de guardar
    }

    // Sem getSenha() - senha nunca exposta

    public boolean isAdmin() { return admin; }
    // Sem setAdmin() - apenas código interno pode alterar

    private String hashSenha(String senha) {
        return "hash_" + senha;  // Simplificado
    }
}
```

#### 3. Encapsulamento Rico (Com Comportamento)

```java
// ✅ Comportamento encapsula lógica de negócio
class ContaBancaria {
    private double saldo;
    private List<Transacao> historico;

    public void transferir(ContaBancaria destino, double valor) {
        // Lógica complexa encapsulada
        if (valor <= 0) throw new IllegalArgumentException("Valor inválido");
        if (saldo < valor) throw new IllegalArgumentException("Saldo insuficiente");

        this.saldo -= valor;
        destino.saldo += valor;

        registrarTransacao(new Transacao("TRANSFERENCIA", valor));
        destino.registrarTransacao(new Transacao("RECEBIMENTO", valor));
    }

    private void registrarTransacao(Transacao t) {
        historico.add(t);
    }

    public double getSaldo() {
        return saldo;  // Apenas leitura
    }

    public List<Transacao> getHistorico() {
        return Collections.unmodifiableList(historico);  // Cópia imutável
    }
}
```

### Interface Pública vs Implementação Privada

```java
class Pilha {
    // ========== PRIVADO (pode mudar) ==========
    private List<String> elementos = new ArrayList<>();  // Implementação

    // ========== PÚBLICO (estável) ==========
    public void push(String elemento) {
        elementos.add(elemento);
    }

    public String pop() {
        if (elementos.isEmpty()) {
            throw new IllegalStateException("Pilha vazia");
        }
        return elementos.remove(elementos.size() - 1);
    }

    public int size() {
        return elementos.size();
    }

    public boolean isEmpty() {
        return elementos.isEmpty();
    }
}

// Código cliente usa interface pública:
Pilha pilha = new Pilha();
pilha.push("A");
pilha.push("B");
String topo = pilha.pop();  // "B"

// Se mudar implementação interna (ArrayList → LinkedList), código cliente não quebra!
```

**Vantagem:** Implementação pode evoluir sem afetar clientes.

---

## 🎯 Aplicabilidade e Contextos

### Quando Aplicar Encapsulamento

✅ **Sempre! Regra padrão:**

1. **Atributos Privados por Padrão:**
   ```java
   class Produto {
       private String codigo;  // ✅ Sempre private
       private double preco;
   }
   ```

2. **Métodos Públicos para Acesso:**
   ```java
   public double getPreco() { return preco; }

   public void setPreco(double preco) {
       if (preco < 0) throw new IllegalArgumentException();
       this.preco = preco;
   }
   ```

3. **Validação em Setters:**
   ```java
   public void setIdade(int idade) {
       if (idade < 0 || idade > 150) {
           throw new IllegalArgumentException("Idade inválida");
       }
       this.idade = idade;
   }
   ```

### Exceções Raras

❌ **Quando NÃO encapsular:**

1. **DTOs (Data Transfer Objects):**
   ```java
   // DTO simples - apenas transporte de dados
   class ClienteDTO {
       public String nome;
       public String email;
       // Sem comportamento, apenas dados
   }
   ```

2. **Records (Java 14+):**
   ```java
   record Ponto(int x, int y) { }  // Imutável, auto-encapsulado
   ```

3. **Classes Internas Privadas:**
   ```java
   class Externa {
       private class Interna {
           int valor;  // OK - apenas Externa acessa
       }
   }
   ```

---

## ⚠️ Limitações e Considerações

### Getter Retornando Referência Mutável

```java
// ⚠️ PROBLEMA - getter expõe referência interna
class Turma {
    private List<String> alunos = new ArrayList<>();

    public List<String> getAlunos() {
        return alunos;  // ❌ Retorna referência direta!
    }
}

Turma turma = new Turma();
List<String> lista = turma.getAlunos();
lista.add("Invasor");  // ❌ Modificou interno via referência!
```

**Solução: Cópia Defensiva**

```java
class TurmaSegura {
    private List<String> alunos = new ArrayList<>();

    public List<String> getAlunos() {
        return new ArrayList<>(alunos);  // ✅ Retorna cópia
        // Ou: return Collections.unmodifiableList(alunos);
    }
}
```

### Over-Engineering com Getters/Setters

```java
// ⚠️ Getters/setters para tudo pode ser excessivo
class Ponto {
    private int x;
    private int y;

    public int getX() { return x; }
    public void setX(int x) { this.x = x; }
    public int getY() { return y; }
    public void setY(int y) { this.y = y; }
}

// ✅ Alternativa: Record (imutável)
record Ponto(int x, int y) { }
```

---

## 🔗 Interconexões Conceituais

### Relação com Abstração

- **Abstração:** O que objeto faz (interface)
- **Encapsulamento:** Como objeto faz (implementação escondida)

### Relação com Modificadores de Acesso

- `private`: Máximo encapsulamento
- `public`: Interface exposta
- `protected`: Encapsulamento parcial (herança)

### Relação com Imutabilidade

```java
// Encapsulamento + Imutabilidade = máxima segurança
final class Moeda {
    private final double valor;
    private final String simbolo;

    public Moeda(double valor, String simbolo) {
        this.valor = valor;
        this.simbolo = simbolo;
    }

    public double getValor() { return valor; }
    public String getSimbolo() { return simbolo; }
    // Sem setters - imutável
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Modificadores de Acesso:** `private`, `public`, `protected`
- **Getters/Setters:** Padrão JavaBeans
- **Imutabilidade:** Objetos sem setters
- **Information Hiding:** Esconder implementação
- **Princípio de Demeter:** Minimizar acoplamento

---

## 📚 Conclusão

Encapsulamento é princípio de esconder detalhes de implementação (atributos privados, métodos auxiliares privados) e expor apenas interface pública controlada (métodos públicos com validação) - protegendo estado interno, garantindo invariantes, permitindo evolução de implementação sem quebrar clientes.

Dominar encapsulamento significa:
- Atributos `private` por padrão - nunca `public`
- Acesso via métodos públicos (getters/setters)
- Validação em setters antes de modificar estado
- Interface pública estável, implementação privada mutável
- Garantir invariantes através de controle de acesso
- Cópias defensivas para referências mutáveis
- Tell, don't ask - objeto decide própria lógica
- Código externo não pode colocar objeto em estado inválido
- Comportamento encapsula lógica de negócio
- Impossível bypass de validação

Encapsulamento não é apenas esconder dados (`private`), é **controlar acesso** para manter integridade. `ContaBancaria` com `saldo` privado e métodos `depositar()/sacar()` validados torna impossível saldo negativo - invariante garantido. Sem encapsulamento, qualquer código pode `conta.saldo = -1000`, criando estado inválido. Encapsulamento é barreira protetora que força toda interação passar por portões validados. É diferença entre carro com capô aberto (qualquer um mexe no motor) vs capô trancado com interface de controle (volante, pedais) - acesso controlado, funcionamento garantido. Encapsulamento é fundamento de código robusto e mantível.
