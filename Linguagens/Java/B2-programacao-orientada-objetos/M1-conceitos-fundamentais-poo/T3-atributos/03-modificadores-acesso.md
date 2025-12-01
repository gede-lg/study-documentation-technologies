# Modificadores de Acesso em Atributos

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Modificadores de acesso** são palavras-chave (`private`, `public`, `protected`, ou ausência para package-private) que controlam visibilidade e alcance de atributos, determinando quais partes do código podem ler ou modificar esses atributos - `private` restringe acesso à própria classe, `public` permite acesso irrestrito, `protected` limita a subclasses e mesmo pacote, package-private (padrão) limita ao mesmo pacote. Conceitualmente, modificadores de acesso são as "portas e trancas" do encapsulamento - decidem quem pode tocar em cada pedaço de dados, implementando princípio de menor privilégio onde cada componente acessa apenas o que precisa.

É o reconhecimento de que nem todos os dados devem ser publicamente acessíveis - detalhes internos de implementação devem ser ocultados (encapsulados), expondo apenas interface pública necessária. Saldo de conta bancária deve ser `private` (apenas conta pode modificar), não `public` (qualquer código poderia corromper).

### Contexto Histórico e Motivação

Linguagens antigas (C) não tinham controle de acesso embutido - toda função podia acessar qualquer dado. C++ introduziu `private`/`public`/`protected` para encapsulamento. Java adotou e expandiu com package-private (default). Modificadores de acesso são fundação de encapsulamento - princípio central de POO desde Smalltalk (1970s).

**Motivação:** Proteger invariantes - classe deve garantir que atributos estejam sempre em estado válido. Se saldo for `public`, código externo pode fazer `conta.saldo = -1000` (invalido!). Se `private` com setter validado, classe controla mudanças.

### Problema Fundamental que Resolve

**Problema:** Atributos públicos permitem modificação descontrolada:

```java
class ContaBancaria {
    public double saldo;  // PÚBLICO - qualquer um pode modificar!
}

ContaBancaria conta = new ContaBancaria();
conta.saldo = 1000.0;

// Código malicioso/bugado pode corromper estado
conta.saldo = -9999999;  // Saldo negativo impossível!
// Nenhuma validação, nenhum controle
```

**Solução:** Atributo privado com acesso controlado:

```java
class ContaBancaria {
    private double saldo;  // PRIVADO - apenas classe controla

    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
        } else {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
    }

    public void sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo -= valor;
        } else {
            throw new IllegalArgumentException("Saque inválido");
        }
    }

    public double getSaldo() {
        return saldo;  // Apenas leitura
    }
}

// Código externo não pode corromper saldo
ContaBancaria conta = new ContaBancaria();
conta.depositar(1000);
// conta.saldo = -999;  // ERRO DE COMPILAÇÃO - saldo é private!
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Quatro Níveis:** `private` (mais restritivo) < package-private < `protected` < `public` (menos restritivo).

2. **Encapsulamento:** Modificadores implementam ocultação de informação - esconder detalhes de implementação.

3. **Princípio de Menor Privilégio:** Atributos devem ter menor visibilidade possível.

4. **Imutabilidade de Referências:** Modificador controla acesso ao atributo, não ao objeto referenciado.

5. **Convenção:** Atributos normalmente `private`, acesso via getters/setters.

### Pilares Fundamentais

- **private:** Acesso apenas dentro da própria classe
- **package-private (default):** Acesso dentro do mesmo pacote
- **protected:** Acesso em subclasses e mesmo pacote
- **public:** Acesso irrestrito de qualquer lugar
- **Boa Prática:** Atributos `private` por padrão, expor via métodos

---

## 🧠 Fundamentos Teóricos

### Os Quatro Modificadores Detalhados

#### private - Mais Restritivo

```java
package com.exemplo;

class Conta {
    private double saldo;  // Apenas Conta acessa
    private String senha;

    private void validarSenha(String senha) {
        // Método privado, só usado internamente
    }

    public void sacar(double valor, String senha) {
        validarSenha(senha);  // OK - mesmo dentro da classe
        if (valor <= saldo) {
            saldo -= valor;  // OK - mesmo dentro da classe
        }
    }
}

class OutraClasse {
    void testar() {
        Conta conta = new Conta();
        // conta.saldo = 100;  // ERRO - saldo é private!
        // conta.senha = "123";  // ERRO - senha é private!
        // conta.validarSenha("123");  // ERRO - método é private!
    }
}
```

**Visibilidade:** Apenas dentro da classe que declarou.

**Uso:** Detalhes internos de implementação, dados sensíveis.

#### Package-Private (Default) - Sem Modificador

```java
package com.exemplo;

class ClasseA {
    int valor;  // SEM modificador = package-private
    String dado;

    void processar() {  // package-private
        // ...
    }
}

class ClasseB {  // Mesma package
    void testar() {
        ClasseA a = new ClasseA();
        a.valor = 10;     // OK - mesmo pacote
        a.dado = "test";  // OK - mesmo pacote
        a.processar();    // OK - mesmo pacote
    }
}
```

```java
package com.outro;  // PACOTE DIFERENTE

import com.exemplo.ClasseA;

class ClasseC {
    void testar() {
        ClasseA a = new ClasseA();
        // a.valor = 10;  // ERRO - pacote diferente!
        // a.processar();  // ERRO - pacote diferente!
    }
}
```

**Visibilidade:** Mesmo pacote apenas.

**Uso:** Classes "helper" internas ao pacote, API interna.

#### protected - Herança e Pacote

```java
package com.exemplo;

class Animal {
    protected String especie;  // Subclasses e mesmo pacote
    protected int idade;

    protected void envelhecer() {
        idade++;
    }
}

class Cachorro extends Animal {  // Subclasse
    void aniversario() {
        envelhecer();  // OK - subclasse acessa protected
        especie = "Canis familiaris";  // OK
    }
}

class OutraClasse {  // Mesmo pacote, não é subclasse
    void testar() {
        Animal animal = new Animal();
        animal.especie = "Felino";  // OK - mesmo pacote
        animal.envelhecer();  // OK - mesmo pacote
    }
}
```

```java
package com.outro;  // PACOTE DIFERENTE

import com.exemplo.Animal;

class Gato extends Animal {  // Subclasse em outro pacote
    void crescer() {
        idade++;  // OK - subclasse acessa protected
        envelhecer();  // OK - subclasse acessa protected
    }
}

class Veterinario {  // Não é subclasse
    void examinar() {
        Animal animal = new Animal();
        // animal.especie = "...";  // ERRO - outro pacote, não é subclasse!
    }
}
```

**Visibilidade:** Subclasses (qualquer pacote) + mesmo pacote.

**Uso:** Atributos que subclasses devem acessar/sobrescrever.

#### public - Menos Restritivo

```java
package com.exemplo;

public class Usuario {
    public String nome;  // Acessível de qualquer lugar
    public static final String VERSAO = "1.0";  // Constante pública
}
```

```java
package com.qualquer;

import com.exemplo.Usuario;

class Teste {
    void usar() {
        Usuario u = new Usuario();
        u.nome = "Alice";  // OK - público
        System.out.println(Usuario.VERSAO);  // OK - público
    }
}
```

**Visibilidade:** Irrestrita.

**Uso:** API pública, constantes, interfaces.

### Tabela de Visibilidade

| Modificador | Mesma Classe | Mesmo Pacote | Subclasse (outro pacote) | Qualquer Lugar |
|-------------|--------------|--------------|--------------------------|----------------|
| **private** | ✅ | ❌ | ❌ | ❌ |
| **package-private** | ✅ | ✅ | ❌ | ❌ |
| **protected** | ✅ | ✅ | ✅ | ❌ |
| **public** | ✅ | ✅ | ✅ | ✅ |

---

## 🔍 Análise Conceitual Profunda

### Encapsulamento com Private

#### Exemplo Completo

```java
class ContaBancaria {
    // Atributos PRIVADOS - encapsulados
    private String numeroConta;
    private String titular;
    private double saldo;
    private double limite;

    public ContaBancaria(String numero, String titular, double limiteInicial) {
        this.numeroConta = numero;
        this.titular = titular;
        this.saldo = 0;
        this.limite = limiteInicial;
    }

    // Getters - apenas leitura
    public String getNumeroConta() {
        return numeroConta;
    }

    public String getTitular() {
        return titular;
    }

    public double getSaldo() {
        return saldo;
    }

    // Operações CONTROLADAS - validação interna
    public void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        saldo += valor;
    }

    public boolean sacar(double valor) {
        if (valor <= 0) {
            return false;
        }
        if (saldo + limite >= valor) {
            saldo -= valor;
            return true;
        }
        return false;
    }

    // Sem setter para saldo - NÃO pode ser modificado diretamente
    // Apenas através de depositar/sacar que validam
}

// Uso seguro
ContaBancaria conta = new ContaBancaria("123", "Alice", 1000);
conta.depositar(500);
conta.sacar(200);
System.out.println(conta.getSaldo());  // 300

// Impossível corromper estado
// conta.saldo = -999;  // ERRO DE COMPILAÇÃO
// conta.limite = 999999;  // ERRO DE COMPILAÇÃO
```

**Vantagens:**
- Invariantes garantidos (saldo sempre válido)
- Validação centralizada
- Flexibilidade para mudar implementação interna

### Quando Usar Cada Modificador

#### Private - Padrão para Atributos

```java
class Pessoa {
    // SEMPRE private para atributos (boa prática)
    private String nome;
    private int idade;
    private String cpf;

    // Acesso via métodos públicos
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome != null && !nome.isEmpty()) {
            this.nome = nome;
        }
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        if (idade >= 0 && idade <= 150) {
            this.idade = idade;
        }
    }
}
```

#### Package-Private - Classes Helper Internas

```java
package com.exemplo.util;

// Classe interna ao pacote (sem public)
class StringUtils {
    static String normalizar(String texto) {
        return texto.trim().toLowerCase();
    }
}

// Classe pública do pacote
public class Validador {
    public boolean validarEmail(String email) {
        // Usa classe helper do mesmo pacote
        String normalizado = StringUtils.normalizar(email);
        return normalizado.contains("@");
    }
}
```

#### Protected - Herança

```java
class Veiculo {
    // Protected - subclasses podem acessar
    protected String marca;
    protected String modelo;
    protected int ano;

    protected void acelerar() {
        // Implementação base
    }
}

class Carro extends Veiculo {
    private int numeroPortas;

    void inicializar() {
        marca = "Fiat";  // OK - acessa protected da superclasse
        modelo = "Uno";
        acelerar();      // OK - acessa método protected
    }
}
```

#### Public - Constantes e APIs

```java
class Matematica {
    // Constantes públicas (static final)
    public static final double PI = 3.14159265359;
    public static final double E = 2.71828182846;

    // Método utilitário público
    public static double calcularArea(double raio) {
        return PI * raio * raio;
    }
}

// Uso
double area = Matematica.calcularArea(5);
System.out.println(Matematica.PI);
```

### Armadilhas Comuns

#### Armadilha 1: Public Mutable Objects

```java
class Problema {
    public List<String> itens = new ArrayList<>();  // PÚBLICO e MUTÁVEL!
}

Problema p = new Problema();
p.itens.add("A");
p.itens.add("B");

// Código externo pode corromper
p.itens.clear();  // Apagou tudo!
p.itens = null;   // Pior ainda!

// SOLUÇÃO - retornar cópia imutável
class Correto {
    private List<String> itens = new ArrayList<>();

    public List<String> getItens() {
        return Collections.unmodifiableList(itens);  // Cópia imutável
    }

    public void addItem(String item) {
        itens.add(item);  // Controle centralizado
    }
}
```

#### Armadilha 2: Protected Quebra Encapsulamento

```java
class Base {
    protected int contador = 0;  // Protected - subclasses acessam
}

class Derivada extends Base {
    void buggy() {
        contador = -999;  // Subclasse pode corromper estado da base!
    }
}
```

**Solução:** Use `private` + métodos `protected`:

```java
class Base {
    private int contador = 0;  // Private - protegido

    protected void incrementar() {
        contador++;  // Controle via método
    }

    protected int getContador() {
        return contador;
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Regras de Ouro

1. **Atributos:** SEMPRE `private` (exceto constantes `public static final`)
2. **Métodos Públicos:** API da classe (o que outros devem usar)
3. **Métodos Privados:** Helpers internos
4. **Protected:** Apenas quando herança explicitamente desejada

### Checklist de Decisão

```
Atributo deve ser acessível fora da classe?
├─ NÃO → private (padrão)
├─ SIM, apenas subclasses → protected
├─ SIM, apenas mesmo pacote → package-private
└─ SIM, qualquer lugar → public (apenas constantes!)
```

---

## ⚠️ Limitações e Considerações

### Reflexão Quebra Encapsulamento

```java
class Segredo {
    private String senha = "secreto123";
}

Segredo s = new Segredo();
// s.senha;  // ERRO - private

// MAS com reflexão...
Field campo = Segredo.class.getDeclaredField("senha");
campo.setAccessible(true);  // Quebra private!
String senha = (String) campo.get(s);
System.out.println(senha);  // "secreto123" - conseguiu acessar!
```

**Análise:** Modificadores de acesso são proteção em tempo de compilação, não runtime absoluto.

### Performance

Modificadores de acesso NÃO têm impacto em performance - são verificados em compile-time.

---

## 🔗 Interconexões Conceituais

### Relação com Getters/Setters

```java
class Usuario {
    private String email;  // Private

    // Getter público
    public String getEmail() {
        return email;
    }

    // Setter público com validação
    public void setEmail(String email) {
        if (email.contains("@")) {
            this.email = email;
        }
    }
}
```

### Relação com Imutabilidade

```java
class PontoImutavel {
    private final int x;  // Private + final
    private final int y;

    public PontoImutavel(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Apenas getters, sem setters
    public int getX() { return x; }
    public int getY() { return y; }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Encapsulamento**: Princípio implementado por modificadores
- **Getters/Setters**: Padrão JavaBeans
- **Imutabilidade**: final + private
- **Information Hiding**: Ocultar detalhes de implementação

---

## 📚 Conclusão

Modificadores de acesso controlam visibilidade de atributos: `private` (apenas classe), package-private (mesmo pacote), `protected` (subclasses + pacote), `public` (irrestrito). Implementam encapsulamento - princípio de ocultar detalhes internos e expor apenas interface pública necessária.

Dominar modificadores de acesso significa:
- **Sempre** usar `private` para atributos (padrão)
- `public` apenas para constantes (`static final`) e API de métodos
- `protected` quando herança explicitamente desejada
- Package-private para classes helper internas
- Compreender tabela de visibilidade (classe/pacote/subclasse/todos)
- Encapsular atributos mutáveis - nunca expor diretamente
- Usar getters/setters para controle de acesso com validação
- Princípio de menor privilégio: menor visibilidade possível
- Modificadores protegem em compile-time, não contra reflexão

Modificadores de acesso são "portas e trancas" do encapsulamento - decidem quem pode tocar em cada atributo. `private` = trancado (apenas classe), `public` = aberto (todos). Atributos devem ser `private` por padrão - expor apenas o necessário via métodos públicos com validação. É diferença entre código frágil (tudo público, sem controle) e código robusto (encapsulado, invariantes garantidos).
