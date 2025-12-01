# Shadowing de Variáveis

## 🎯 Introdução e Definição

### Definição Conceitual

**Shadowing** (ou **sombreamento**) ocorre quando uma variável declarada em um **escopo interno** tem o **mesmo nome** de uma variável em um **escopo externo**, "escondendo" (sombreando) a variável externa dentro do escopo interno.

**Contextos comuns de shadowing**:
1. **Parâmetro de método** sombrea **campo de instância**
2. **Variável local** sombrea **campo de instância**
3. **Variável em bloco interno** sombrea **variável em bloco externo**
4. **Variável de classe filha** sombrea **variável de classe pai** (herança)

**Exemplo Básico**:
```java
public class Pessoa {
    private String nome = "Padrão";  // Campo de instância
    
    public void setNome(String nome) {  // Parâmetro sombrea campo
        nome = nome;  // ⚠️ ERRO: atribui parâmetro a si mesmo (não afeta campo)
    }
}
```

**Solução com `this`**:
```java
public void setNome(String nome) {
    this.nome = nome;  // ✅ OK: this.nome = campo, nome = parâmetro
}
```

### Características Fundamentais

**Regras de Shadowing**:
- 🔒 **Escopo interno** oculta **escopo externo**
- ✅ **Permitido**: Java permite shadowing (diferente de algumas linguagens)
- ⚠️ **Confusão**: Pode dificultar leitura e causar bugs
- 🛠️ **Resolução**: Usar `this` (instância) ou `NomeClasse` (classe)

**Hierarquia de Prioridade** (mais específico tem prioridade):
1. **Variável local** (escopo mais interno)
2. **Parâmetro de método**
3. **Variável de bloco externo**
4. **Campo de instância** (`this.campo`)
5. **Campo de classe** (`NomeClasse.campo`)

### Contexto Histórico

**Java 1.0 (1995)**: Shadowing permitido desde o início, herdado de C/C++.
- **Vantagem**: Flexibilidade (setters podem usar mesmo nome)
- **Desvantagem**: Pode causar bugs sutis

**Evolução**:
- **IDEs modernas**: Warnings para shadowing acidental
- **Code analyzers** (SonarQube, CheckStyle): Detectam shadowing problemático
- **Java 9+**: Warnings para shadowing em lambdas

### Problema Fundamental

#### Bug Clássico: Atribuição Incorreta

**Problema**:
```java
public class Pessoa {
    private String nome;
    
    public void setNome(String nome) {
        nome = nome;  // ❌ Atribui parâmetro a si mesmo (não afeta campo)
    }
}
```

**Uso**:
```java
Pessoa p = new Pessoa();
p.setNome("João");
System.out.println(p.nome);  // null (campo não foi modificado)
```

**Solução**:
```java
public void setNome(String nome) {
    this.nome = nome;  // ✅ OK: distingue campo de parâmetro
}
```

---

## 📋 Sumário Conceitual

### Tipos de Shadowing

#### 1. Parâmetro Sombrea Campo

```java
public class Pessoa {
    private String nome;
    
    public void setNome(String nome) {  // Parâmetro sombrea campo
        this.nome = nome;  // Usa 'this' para acessar campo
    }
}
```

#### 2. Variável Local Sombrea Campo

```java
public class Exemplo {
    private int x = 10;
    
    public void metodo() {
        int x = 20;  // Variável local sombrea campo
        System.out.println(x);       // 20 (local)
        System.out.println(this.x);  // 10 (campo)
    }
}
```

#### 3. Variável em Bloco Interno Sombrea Externa

```java
public void metodo() {
    int x = 10;
    
    if (condicao) {
        int x = 20;  // ❌ ERRO: variable x is already defined in method metodo()
    }
}
```

**Nota**: Java **não permite** shadowing de variáveis locais no mesmo método.

#### 4. Variável de Subclasse Sombrea Superclasse

```java
class Pai {
    protected int valor = 10;
}

class Filho extends Pai {
    private int valor = 20;  // ⚠️ Sombrea campo da superclasse
}
```

---

## 🧠 Fundamentos Teóricos

### 1. Parâmetro vs Campo de Instância

**Cenário Comum**: Setter com parâmetro de mesmo nome.

```java
public class ContaBancaria {
    private String titular;
    private double saldo;
    
    public ContaBancaria(String titular, double saldo) {
        this.titular = titular;  // ✅ 'this' distingue campo de parâmetro
        this.saldo = saldo;
    }
    
    public void setTitular(String titular) {
        this.titular = titular;
    }
    
    public void setSaldo(double saldo) {
        this.saldo = saldo;
    }
}
```

**Sem `this`** (ERRO):
```java
public void setTitular(String titular) {
    titular = titular;  // ❌ Atribui parâmetro a si mesmo (campo não muda)
}
```

### 2. Variável Local vs Campo de Instância

```java
public class Exemplo {
    private int numero = 10;  // Campo de instância
    
    public void metodo() {
        int numero = 20;  // Variável local sombrea campo
        
        System.out.println(numero);       // 20 (variável local)
        System.out.println(this.numero);  // 10 (campo de instância)
        
        numero = 30;       // Modifica variável local
        this.numero = 40;  // Modifica campo de instância
    }
}
```

### 3. Shadowing em Herança

**Campos de classe** (static):
```java
class Pai {
    public static int valor = 10;
}

class Filho extends Pai {
    public static int valor = 20;  // Sombrea campo static da superclasse
}
```

**Uso**:
```java
System.out.println(Pai.valor);    // 10
System.out.println(Filho.valor);  // 20

Pai obj = new Filho();
System.out.println(obj.valor);    // 10 (tipo de referência, não de objeto)
```

**Campos de instância**:
```java
class Pai {
    protected int numero = 10;
}

class Filho extends Pai {
    private int numero = 20;  // Sombrea campo da superclasse
    
    public void exibir() {
        System.out.println(numero);        // 20 (campo da subclasse)
        System.out.println(super.numero);  // 10 (campo da superclasse)
    }
}
```

### 4. Shadowing em Lambdas (Effectively Final)

**Regra**: Lambdas **não podem** declarar variáveis com mesmo nome de variáveis locais do escopo externo.

```java
public void metodo() {
    int x = 10;
    
    Runnable r = () -> {
        int x = 20;  // ❌ ERRO: variable x is already defined in method metodo()
    };
}
```

**Mas podem capturar**:
```java
public void metodo() {
    int x = 10;  // Effectively final
    
    Runnable r = () -> {
        System.out.println(x);  // ✅ OK (captura, não sombrea)
    };
}
```

---

## 🔍 Análise Conceitual Profunda

### Quando Shadowing é Aceitável

**1. Setters e Construtores**:
```java
public class Pessoa {
    private String nome;
    private int idade;
    
    public Pessoa(String nome, int idade) {  // ✅ Comum e aceito
        this.nome = nome;
        this.idade = idade;
    }
    
    public void setNome(String nome) {  // ✅ Comum e aceito
        this.nome = nome;
    }
}
```

**2. Parâmetros com mesmo nome de campo** (padrão JavaBeans):
```java
public void setEmail(String email) {  // ✅ Convenção JavaBeans
    this.email = email;
}
```

### Quando Shadowing Deve Ser Evitado

**1. Variáveis locais com mesmo nome de campo**:
```java
// ❌ Ruim (confuso)
public class Exemplo {
    private int valor = 10;
    
    public void processar() {
        int valor = 20;  // ⚠️ Sombrea campo (confuso)
        // ... lógica ...
    }
}

// ✅ Bom (nomes diferentes)
public class Exemplo {
    private int valorPadrao = 10;
    
    public void processar() {
        int valorTemp = 20;
        // ... lógica ...
    }
}
```

**2. Shadowing em herança** (pode confundir):
```java
// ❌ Ruim (confuso)
class Pai {
    protected int contador = 0;
}

class Filho extends Pai {
    private int contador = 10;  // ⚠️ Sombrea campo do pai
}

// ✅ Bom (nomes diferentes)
class Pai {
    protected int contadorPai = 0;
}

class Filho extends Pai {
    private int contadorFilho = 10;
}
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Setter com Shadowing

```java
public class Produto {
    private String nome;
    private double preco;
    
    public void setNome(String nome) {
        this.nome = nome;  // ✅ 'this' distingue campo de parâmetro
    }
    
    public void setPreco(double preco) {
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }
        this.preco = preco;
    }
}
```

### Caso 2: Construtor com Shadowing

```java
public class ContaBancaria {
    private String numeroConta;
    private String titular;
    private double saldo;
    
    public ContaBancaria(String numeroConta, String titular, double saldo) {
        this.numeroConta = numeroConta;
        this.titular = titular;
        this.saldo = saldo;
    }
}
```

### Caso 3: Variável Local Sombrea Campo (EVITAR)

```java
// ❌ Ruim (confuso)
public class Calculadora {
    private int resultado = 0;
    
    public void calcular() {
        int resultado = 10;  // ⚠️ Sombrea campo
        resultado += 5;       // Modifica local, não campo
        
        System.out.println(resultado);       // 15 (local)
        System.out.println(this.resultado);  // 0 (campo não mudou)
    }
}

// ✅ Bom (nomes diferentes)
public class Calculadora {
    private int resultadoFinal = 0;
    
    public void calcular() {
        int resultadoTemp = 10;
        resultadoTemp += 5;
        
        this.resultadoFinal = resultadoTemp;
    }
}
```

### Caso 4: Shadowing em Herança

```java
class Animal {
    protected String nome = "Animal Genérico";
    
    public void exibir() {
        System.out.println("Nome: " + nome);
    }
}

class Cachorro extends Animal {
    private String nome = "Rex";  // ⚠️ Sombrea campo da superclasse
    
    public void exibir() {
        System.out.println("Nome (subclasse): " + nome);        // Rex
        System.out.println("Nome (superclasse): " + super.nome); // Animal Genérico
    }
}
```

### Caso 5: Blocos Internos (NÃO Permitido)

```java
public void metodo() {
    int x = 10;
    
    {
        int x = 20;  // ❌ ERRO: variable x is already defined in method metodo()
    }
}
```

**Nota**: Java **não permite** shadowing de variáveis locais no mesmo método, mesmo em blocos diferentes.

---

## ⚠️ Limitações e Considerações

### 1. Atribuição Incorreta sem `this`

**Problema**:
```java
public class Pessoa {
    private String nome;
    
    public void setNome(String nome) {
        nome = nome;  // ❌ Atribui parâmetro a si mesmo
    }
}
```

**Solução**:
```java
public void setNome(String nome) {
    this.nome = nome;  // ✅ OK
}
```

### 2. Variáveis Locais com Mesmo Nome (ERRO)

**Problema**:
```java
public void metodo() {
    int x = 10;
    
    if (true) {
        int x = 20;  // ❌ ERRO: variable x is already defined
    }
}
```

**Solução**: Usar nomes diferentes.
```java
public void metodo() {
    int x = 10;
    
    if (true) {
        int y = 20;  // ✅ OK
    }
}
```

### 3. Shadowing em Herança Confunde

**Problema**:
```java
class Pai {
    protected int valor = 10;
}

class Filho extends Pai {
    private int valor = 20;
}

Pai obj = new Filho();
System.out.println(obj.valor);  // 10 (usa tipo de referência, não objeto)
```

**Solução**: Evitar shadowing em herança.

### 4. Lambdas e Shadowing

**Problema**:
```java
int x = 10;
Runnable r = () -> {
    int x = 20;  // ❌ ERRO: variable x is already defined
};
```

**Solução**: Usar nome diferente.
```java
int x = 10;
Runnable r = () -> {
    int y = 20;  // ✅ OK
};
```

### 5. IDEs Mostram Warnings

**IntelliJ IDEA / Eclipse**:
```java
public void metodo() {
    int valor = 10;  // ⚠️ Warning: "Parameter 'valor' is shadowing field 'valor'"
}
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Escopo de Variáveis**: Base para entender shadowing
- **`this`**: Resolve ambiguidade
- **`super`**: Acessa campo da superclasse
- **Herança**: Shadowing entre superclasse e subclasse
- **Lambdas**: Restrições de shadowing

---

## 🚀 Boas Práticas

1. ✅ **Use `this` em setters e construtores**
   ```java
   public void setNome(String nome) {
       this.nome = nome;  // ✅ Claro
   }
   ```

2. ❌ **Evite variáveis locais com mesmo nome de campo**
   ```java
   // ❌ Ruim
   int valor = 10;  // Sombrea campo
   
   // ✅ Bom
   int valorTemp = 10;
   ```

3. ❌ **Evite shadowing em herança**
   ```java
   // ❌ Ruim
   class Filho extends Pai {
       private int valor;  // Sombrea campo do pai
   }
   
   // ✅ Bom
   class Filho extends Pai {
       private int valorFilho;
   }
   ```

4. ✅ **Use nomes descritivos para evitar confusão**
   ```java
   // ❌ Ruim
   int x;
   int x2;
   
   // ✅ Bom
   int valorOriginal;
   int valorCalculado;
   ```

5. ✅ **Ative warnings de shadowing na IDE**
   - IntelliJ: Settings → Editor → Inspections → Java → Declaration redundancy → "Field may be 'final'"
   - Eclipse: Preferences → Java → Compiler → Errors/Warnings

6. ✅ **Use ferramentas de análise estática**
   - **SonarQube**: Detecta shadowing problemático
   - **CheckStyle**: Regra `HiddenField`

7. ✅ **Documente shadowing intencional**
   ```java
   /**
    * @param nome Nome do titular (sombrea campo de instância)
    */
   public void setNome(String nome) {
       this.nome = nome;
   }
   ```

8. ❌ **Nunca use `nome = nome` sem `this`**
   ```java
   nome = nome;       // ❌ ERRO: não afeta campo
   this.nome = nome;  // ✅ OK
   ```

### Resumo de Recomendações

| Contexto | Shadowing | Recomendação |
|----------|-----------|--------------|
| Setters/Construtores | ✅ Aceitável | Usar `this.campo = parametro` |
| Variáveis locais vs campo | ❌ Evitar | Usar nomes diferentes |
| Herança | ❌ Evitar | Usar nomes diferentes |
| Lambdas | ❌ Proibido | Compilador rejeita |
| Blocos internos (mesmo método) | ❌ Proibido | Compilador rejeita |
