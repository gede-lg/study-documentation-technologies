# Proteção de Dados e Interface Pública vs Implementação Privada

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Proteção de dados** é prática de tornar atributos `private` para impedir acesso direto externo, forçando que toda interação passe por métodos controlados que validam e mantêm invariantes. **Interface pública** é conjunto de métodos `public` que definem como código externo pode interagir com objeto. **Implementação privada** são detalhes internos (atributos, métodos auxiliares) marcados `private` que podem mudar sem afetar código cliente.

Conceitualmente, é separação entre "o que objeto oferece" (interface - estável, documentada, contrato) e "como objeto faz" (implementação - mutável, escondida, detalhe). Carro tem interface pública (volante, pedais, painel) que permanece igual mesmo que motor seja trocado (V6 → V8) - implementação muda, interface não.

Propósito é **estabilidade** e **flexibilidade**: interface pública é contrato com clientes (não quebra), implementação privada é liberdade para melhorar internamente (pode mudar). Cliente depende de `conta.depositar(100)` (interface), não de como `saldo` é armazenado (array? banco de dados? arquivo?).

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Proteção de Dados:** Atributos `private` impedem modificação externa direta
2. **Interface Pública:** Métodos `public` que código externo pode chamar
3. **Implementação Privada:** Detalhes internos escondidos, podem evoluir
4. **Contrato:** Interface é contrato estável, implementação é detalhe volátil
5. **Validação:** Métodos públicos validam antes de aceitar mudanças

---

## 🧠 Fundamentos Teóricos

### Proteção de Dados com `private`

```java
class ContaBancaria {
    // ❌ Dados expostos - sem proteção
    // public double saldo;

    // ✅ Dados protegidos
    private double saldo;  // Apenas classe pode acessar diretamente

    public void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        saldo += valor;  // Acesso interno OK
    }

    public double getSaldo() {
        return saldo;  // Leitura controlada
    }
}

// Código externo:
ContaBancaria conta = new ContaBancaria();
// conta.saldo = 1000;  // ❌ ERRO - saldo é private
conta.depositar(1000);  // ✅ Interface pública
```

### Interface Pública Estável

```java
class Pilha {
    // ========== INTERFACE PÚBLICA (Contrato) ==========
    public void push(String elemento) { }
    public String pop() { }
    public int size() { }
    public boolean isEmpty() { }
    // Métodos públicos definem "o que" Pilha faz
}
```

### Implementação Privada Mutável

```java
// Versão 1: Implementação com ArrayList
class Pilha {
    private List<String> elementos = new ArrayList<>();  // Implementação

    public void push(String elemento) {
        elementos.add(elemento);
    }

    public String pop() {
        return elementos.remove(elementos.size() - 1);
    }
}

// Versão 2: Mudou implementação para array
class Pilha {
    private String[] elementos = new String[100];  // Mudou!
    private int topo = 0;

    public void push(String elemento) {
        elementos[topo++] = elemento;  // Diferente internamente
    }

    public String pop() {
        return elementos[--topo];  // Diferente internamente
    }
}

// Código cliente não muda - interface pública é igual!
Pilha p = new Pilha();
p.push("A");
String x = p.pop();  // Funciona em ambas versões
```

---

## 🔍 Análise Conceitual Profunda

### Separação Interface vs Implementação

```java
// Interface pública clara
interface Cache {
    void put(String chave, String valor);
    String get(String chave);
    void clear();
}

// Implementação 1: HashMap
class CacheMemoria implements Cache {
    private Map<String, String> dados = new HashMap<>();

    public void put(String chave, String valor) {
        dados.put(chave, valor);
    }

    public String get(String chave) {
        return dados.get(chave);
    }

    public void clear() {
        dados.clear();
    }
}

// Implementação 2: Arquivo
class CacheArquivo implements Cache {
    private Properties dados = new Properties();
    private String arquivo = "cache.properties";

    public void put(String chave, String valor) {
        dados.setProperty(chave, valor);
        salvar();
    }

    public String get(String chave) {
        return dados.getProperty(chave);
    }

    public void clear() {
        dados.clear();
        salvar();
    }

    private void salvar() {
        // Salva em arquivo
    }
}

// Cliente usa interface, não sabe implementação:
Cache cache = new CacheMemoria();  // Ou CacheArquivo
cache.put("chave", "valor");
String v = cache.get("chave");
```

### Validação na Interface Pública

```java
class Pessoa {
    private String nome;
    private int idade;

    // Interface pública COM validação
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        this.nome = nome.trim();  // Normaliza também
    }

    public void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
        this.idade = idade;
    }

    // Métodos auxiliares PRIVADOS
    private boolean validarNome(String nome) {
        return nome != null && !nome.trim().isEmpty();
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Mudar Implementação Sem Quebrar Interface

```java
// Versão 1: Lista simples
class Carrinho {
    private List<Produto> itens = new ArrayList<>();

    public void adicionar(Produto p) {
        itens.add(p);
    }

    public double getTotal() {
        return itens.stream().mapToDouble(Produto::getPreco).sum();
    }
}

// Versão 2: Otimizou com cache (implementação diferente!)
class Carrinho {
    private List<Produto> itens = new ArrayList<>();
    private Double totalCache = null;  // Novo campo privado

    public void adicionar(Produto p) {
        itens.add(p);
        totalCache = null;  // Invalida cache
    }

    public double getTotal() {
        if (totalCache == null) {
            totalCache = itens.stream().mapToDouble(Produto::getPreco).sum();
        }
        return totalCache;
    }
}

// Cliente continua funcionando igual:
Carrinho c = new Carrinho();
c.adicionar(produto);
double total = c.getTotal();  // Interface não mudou!
```

---

## ⚠️ Limitações e Considerações

### Getter Expondo Referência Mutável

```java
class Turma {
    private List<String> alunos = new ArrayList<>();

    // ❌ Expõe implementação interna
    public List<String> getAlunos() {
        return alunos;  // Retorna referência direta
    }
}

// Cliente pode modificar interno:
Turma t = new Turma();
t.getAlunos().add("Invasor");  // ❌ Modificou interno!

// ✅ Solução: Cópia defensiva
class TurmaSegura {
    private List<String> alunos = new ArrayList<>();

    public List<String> getAlunos() {
        return Collections.unmodifiableList(alunos);  // Imutável
        // Ou: return new ArrayList<>(alunos);  // Cópia
    }
}
```

---

## 📚 Conclusão

Proteção de dados com `private` impede acesso externo direto. Interface pública (`public`) define contrato estável com clientes. Implementação privada pode evoluir sem quebrar código cliente - separação permite flexibilidade interna com estabilidade externa.

Dominar proteção e separação significa:
- Atributos `private` sempre - nunca expor diretamente
- Interface pública com métodos validados
- Implementação privada pode mudar sem afetar clientes
- Cópias defensivas para referências mutáveis
- Validação em métodos públicos antes de modificar estado
- Métodos auxiliares `private` - detalhes internos
- Interface é contrato (estável), implementação é detalhe (mutável)
