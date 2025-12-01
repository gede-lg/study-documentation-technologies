# T2.03 - Modificador de Acesso protected

## Introdução e Definição

O modificador de acesso **`protected`** oferece um nível intermediário de visibilidade entre `private` e `public`. É especialmente projetado para suportar **herança** e **encapsulamento em hierarquias de classes**.

Membros `protected` são acessíveis:
- **Dentro da própria classe** (como qualquer membro)
- **Classes do mesmo pacote** (como default/package-private)
- **Subclasses em qualquer pacote** (diferencial do protected)

Membros `protected` são **invisíveis**:
- **Classes de outros pacotes que não são subclasses**

O `protected` é fundamental para permitir que **subclasses estendam e customizem** comportamento da superclasse, acessando membros internos que não devem ser públicos, mas que precisam estar disponíveis para extensão.

**Características principais**:
- **Visível no mesmo pacote** (como default)
- **Visível em subclasses de qualquer pacote** (diferencial)
- **Promove extensibilidade** através de herança
- **Encapsula de código externo** não relacionado por herança
- **Balanceia proteção e flexibilidade**

**Exemplo Básico**:
```java
package com.empresa.base;

public class Veiculo {
    protected String chassi;  // Acessível em subclasses
    protected int ano;

    protected void validarChassi() {  // Método protegido
        if (chassi == null || chassi.isEmpty()) {
            throw new IllegalStateException("Chassi inválido");
        }
    }

    public void exibirInfo() {
        validarChassi();  // OK: mesma classe
        System.out.println("Chassi: " + chassi);  // OK: mesma classe
    }
}
```

```java
package com.empresa.derivada;  // PACOTE DIFERENTE

import com.empresa.base.Veiculo;

public class Carro extends Veiculo {  // Subclasse em outro pacote
    private int numeroPortas;

    public Carro(String chassi, int ano, int portas) {
        this.chassi = chassi;    // OK: protected acessível em subclasse
        this.ano = ano;          // OK: protected acessível em subclasse
        this.numeroPortas = portas;
        validarChassi();         // OK: método protected acessível em subclasse
    }

    public void exibir() {
        System.out.println("Chassi: " + chassi);  // OK: atributo protected
        System.out.println("Ano: " + ano);        // OK: atributo protected
    }
}
```

```java
package com.empresa.app;

import com.empresa.base.Veiculo;
import com.empresa.derivada.Carro;

public class App {
    public void teste() {
        Carro carro = new Carro("ABC123", 2024, 4);
        carro.exibir();  // OK: método público

        // carro.chassi = "XYZ";  // ERRO: protected não é acessível em classe não-subclasse de outro pacote
        // carro.validarChassi(); // ERRO: método protected não acessível
    }
}
```

---

## 10 Fundamentos Teóricos

### 1. Visibilidade em Subclasses de Qualquer Pacote

A característica **distintiva** do `protected`: visível em **subclasses**, independentemente do pacote.

```java
package com.framework.base;

public class ComponenteBase {
    protected void inicializar() {
        System.out.println("Inicializando componente...");
    }

    protected String obterConfiguracao() {
        return "Configuração padrão";
    }
}
```

```java
package com.meuapp.componentes;  // PACOTE DIFERENTE

import com.framework.base.ComponenteBase;

public class MeuComponente extends ComponenteBase {
    @Override
    protected void inicializar() {
        super.inicializar();  // OK: acessa método protected da superclasse
        System.out.println("Inicialização customizada");
    }

    public void configurar() {
        inicializar();  // OK: método protected herdado
        String config = obterConfiguracao();  // OK: método protected herdado
        System.out.println("Config: " + config);
    }
}
```

**Importante**: A subclasse acessa membros `protected` da superclasse **através de herança**, não através de uma instância externa.

---

### 2. Acesso no Mesmo Pacote (Como Default)

Membros `protected` são acessíveis para **todas as classes do mesmo pacote**, independentemente de herança.

```java
package com.sistema.core;

public class Servidor {
    protected int porta;
    protected String host;

    protected void conectar() {
        System.out.println("Conectando a " + host + ":" + porta);
    }
}

public class Cliente {  // MESMA PACOTE (não é subclasse)
    public void usar() {
        Servidor servidor = new Servidor();
        servidor.porta = 8080;      // OK: protected acessível no mesmo pacote
        servidor.host = "localhost"; // OK: protected acessível no mesmo pacote
        servidor.conectar();         // OK: protected acessível no mesmo pacote
    }
}
```

**Regra**: No **mesmo pacote**, `protected` se comporta como **default** (package-private) — acesso irrestrito.

---

### 3. Acesso Através de Herança vs Acesso Direto

Em **outro pacote**, subclasse acessa membros `protected` apenas **através de referência da própria subclasse**, não através de instância da superclasse.

```java
package com.base;

public class Animal {
    protected String nome;

    protected void emitirSom() {
        System.out.println("Som do animal");
    }
}
```

```java
package com.derivada;

import com.base.Animal;

public class Cachorro extends Animal {
    public void testar() {
        // Acesso através da própria subclasse (this)
        this.nome = "Rex";  // OK: acessa membro protected herdado
        emitirSom();        // OK: acessa método protected herdado

        // Acesso através de instância da superclasse
        Animal animal = new Animal();
        // animal.nome = "Qualquer";  // ERRO: não pode acessar protected de outra instância em outro pacote
        // animal.emitirSom();        // ERRO: não pode acessar protected de outra instância

        // Acesso através de outra instância da subclasse
        Cachorro outro = new Cachorro();
        outro.nome = "Bobby";  // OK: acessa através de instância da mesma subclasse
        outro.emitirSom();     // OK: acessa através de instância da mesma subclasse
    }
}
```

**Regra Importante**: Em outro pacote, subclasse pode acessar membros `protected` apenas através de:
- **`this`** (própria instância)
- **Instâncias da própria subclasse**

**NÃO pode acessar** através de:
- Instâncias da superclasse
- Instâncias de outras subclasses

---

### 4. Protected em Construtores

Construtores `protected` permitem:
- **Instanciação no mesmo pacote** (qualquer classe)
- **Instanciação em subclasses de qualquer pacote** (via `super()`)

```java
package com.framework;

public class TemplateBase {
    private String nome;

    // Construtor protected: subclasses podem chamar, mas código externo não
    protected TemplateBase(String nome) {
        this.nome = nome;
        inicializar();
    }

    protected void inicializar() {
        // Template method
    }

    public final void executar() {
        System.out.println("Executando " + nome);
    }
}
```

```java
package com.meuapp;

import com.framework.TemplateBase;

public class MinhaImplementacao extends TemplateBase {
    public MinhaImplementacao() {
        super("MinhaImplementacao");  // OK: chama construtor protected via super()
    }

    @Override
    protected void inicializar() {
        System.out.println("Inicialização customizada");
    }
}
```

```java
package com.meuapp;

import com.framework.TemplateBase;

public class App {
    public void executar() {
        MinhaImplementacao impl = new MinhaImplementacao();  // OK: construtor público
        impl.executar();

        // TemplateBase base = new TemplateBase("teste");  // ERRO: construtor protected não acessível
    }
}
```

**Uso**: Padrão **Template Method** — força uso através de subclasses, não instanciação direta.

---

### 5. Protected e Sobrescrita de Métodos

Métodos `protected` podem ser **sobrescritos** em subclasses. A visibilidade pode ser **mantida** ou **aumentada** (para `public`), mas **não reduzida** (para `private`/default).

```java
package com.base;

public class Processador {
    protected void processar() {
        System.out.println("Processamento base");
    }
}
```

```java
package com.derivada;

import com.base.Processador;

public class ProcessadorAvancado extends Processador {
    // VÁLIDO: mantém protected
    @Override
    protected void processar() {
        super.processar();
        System.out.println("Processamento avançado");
    }

    // VÁLIDO: aumenta para public
    // @Override
    // public void processar() {
    //     super.processar();
    //     System.out.println("Processamento público");
    // }

    // INVÁLIDO: reduz para private
    // @Override
    // private void processar() { }  // ERRO: não pode reduzir visibilidade

    // INVÁLIDO: reduz para default
    // @Override
    // void processar() { }  // ERRO: não pode reduzir visibilidade
}
```

**Regra**: Sobrescrita pode **manter** ou **aumentar** visibilidade, nunca **reduzir**.

---

### 6. Protected em Atributos vs Métodos

Atributos `protected` expõem **estado interno** para subclasses, o que pode quebrar encapsulamento.

```java
// ESTILO 1: Atributos protected (menos encapsulado)
public class Conta {
    protected double saldo;  // Atributo exposto

    public void depositar(double valor) {
        saldo += valor;
    }
}

public class ContaPremium extends Conta {
    public void aplicarBonus() {
        saldo += saldo * 0.05;  // Acesso direto ao atributo
    }
}

// ESTILO 2: Métodos protected (mais encapsulado)
public class Conta {
    private double saldo;  // Atributo privado

    protected double getSaldo() {  // Método protected
        return saldo;
    }

    protected void setSaldo(double saldo) {  // Método protected com validação
        if (saldo < 0) {
            throw new IllegalArgumentException("Saldo não pode ser negativo");
        }
        this.saldo = saldo;
    }

    public void depositar(double valor) {
        setSaldo(getSaldo() + valor);
    }
}

public class ContaPremium extends Conta {
    public void aplicarBonus() {
        setSaldo(getSaldo() * 1.05);  // Acesso através de métodos protected
    }
}
```

**Recomendação**: Prefira **métodos protected** a **atributos protected** para manter encapsulamento e permitir validação.

---

### 7. Protected e Classes Abstratas

Classes abstratas frequentemente usam membros `protected` para fornecer **contratos de extensão**.

```java
package com.framework;

public abstract class HTTPServlet {
    private String url;

    protected HTTPServlet(String url) {  // Construtor protected
        this.url = url;
    }

    // Template method (public final)
    public final void processarRequisicao(Request req, Response res) {
        validarRequisicao(req);  // protected
        doGet(req, res);          // protected (abstract)
        finalizarRequisicao();    // protected
    }

    // Métodos protected para subclasses implementarem/usarem
    protected void validarRequisicao(Request req) {
        // Validação padrão
    }

    protected abstract void doGet(Request req, Response res);  // Subclasses DEVEM implementar

    protected void finalizarRequisicao() {
        // Finalização padrão
    }

    protected String getUrl() {  // Getter protected
        return url;
    }
}
```

```java
package com.meuapp;

import com.framework.HTTPServlet;

public class MeuServlet extends HTTPServlet {
    public MeuServlet() {
        super("/meuservlet");  // Chama construtor protected
    }

    @Override
    protected void doGet(Request req, Response res) {
        String url = getUrl();  // Acessa método protected
        res.write("Servlet em " + url);
    }
}
```

**Benefício**: Superclasse controla fluxo (`processarRequisicao`), subclasse customiza partes (`doGet`).

---

### 8. Protected e Final (Métodos)

Métodos `protected final` podem ser **usados** por subclasses, mas **não sobrescritos**.

```java
public abstract class Template {
    // Subclasses podem chamar, mas não sobrescrever
    protected final void logOperacao(String mensagem) {
        System.out.println(LocalDateTime.now() + ": " + mensagem);
    }

    // Subclasses DEVEM sobrescrever
    protected abstract void executar();

    // Template method
    public final void processar() {
        logOperacao("Iniciando processamento");  // Usa método protected final
        executar();                               // Chama método abstrato
        logOperacao("Processamento concluído");
    }
}

public class ProcessadorConcreto extends Template {
    @Override
    protected void executar() {
        logOperacao("Executando lógica específica");  // OK: pode chamar
        // Processamento
    }

    // ERRO: não pode sobrescrever protected final
    // @Override
    // protected void logOperacao(String mensagem) { }  // ERRO: método é final
}
```

**Uso**: Fornecer **métodos utilitários** para subclasses sem permitir modificação.

---

### 9. Protected em Interfaces (Não Aplicável)

Interfaces **não suportam** membros `protected`. Todos os membros de interface são implicitamente `public`.

```java
public interface MinhaInterface {
    void metodo();  // Implicitamente public abstract

    // protected void metodoProtegido();  // ERRO: protected não permitido em interface

    default void metodoDefault() {  // Implicitamente public
        // Implementação
    }

    static void metodoStatic() {  // Implicitamente public
        // Implementação
    }

    // Java 9+: métodos privados são permitidos
    private void metodoPrivado() {
        // Uso interno
    }
}
```

**Regra**: Interfaces não têm `protected` (apenas `public` e `private` a partir do Java 9).

---

### 10. Protected e Encapsulamento Controlado

`protected` permite **extensibilidade controlada** sem expor completamente a implementação.

```java
package com.biblioteca.core;

public abstract class Conexao {
    private String url;
    private boolean conectada;

    // Atributo protected: subclasses podem acessar
    protected int timeout = 30000;

    protected Conexao(String url) {
        this.url = url;
        this.conectada = false;
    }

    // Método protected: subclasses podem customizar
    protected void validarUrl() {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("URL inválida");
        }
    }

    // Método protected abstrato: subclasses DEVEM implementar
    protected abstract void estabelecerConexao();

    // Template method público
    public final void conectar() {
        if (conectada) {
            return;
        }
        validarUrl();             // Validação (pode ser sobrescrita)
        estabelecerConexao();     // Implementação específica (abstrata)
        this.conectada = true;
    }

    // Getter protected: subclasses podem acessar URL
    protected String getUrl() {
        return url;
    }

    // Método público
    public boolean isConectada() {
        return conectada;
    }
}
```

```java
package com.meuapp;

import com.biblioteca.core.Conexao;

public class ConexaoHTTP extends Conexao {
    public ConexaoHTTP(String url) {
        super(url);
        this.timeout = 10000;  // Customiza timeout protected
    }

    @Override
    protected void validarUrl() {
        super.validarUrl();
        if (!getUrl().startsWith("http://")) {  // Usa getUrl() protected
            throw new IllegalArgumentException("URL deve começar com http://");
        }
    }

    @Override
    protected void estabelecerConexao() {
        System.out.println("Estabelecendo conexão HTTP para " + getUrl());
        // Lógica de conexão HTTP
    }
}
```

**Benefícios**:
- **Controle**: superclasse define estrutura (`conectar`)
- **Flexibilidade**: subclasses customizam partes (`validarUrl`, `estabelecerConexao`)
- **Encapsulamento**: `url` e `conectada` são privados (não acessíveis a subclasses diretamente)
- **Extensibilidade**: `timeout` e métodos protected permitem customização

---

## Aplicabilidade

### Quando Usar `protected`

1. **Atributos/Métodos para Extensão em Subclasses**:
   ```java
   protected void validar() { }
   ```

2. **Construtores de Classes Abstratas/Template**:
   ```java
   protected MinhaClasse() { }
   ```

3. **Template Method Pattern**:
   ```java
   protected abstract void executar();
   ```

4. **Métodos Hook (Gancho) para Customização**:
   ```java
   protected void antesDe() { }
   protected void depoisDe() { }
   ```

5. **Getters/Setters para Subclasses** (sem expor publicamente):
   ```java
   protected String getConfiguracao() { }
   ```

### Quando NÃO Usar `protected`

1. **Membros que NÃO devem ser acessados por subclasses** → use `private`
2. **Membros de API pública** → use `public`
3. **Membros apenas para o pacote** → use default (package-private)
4. **Quando não há intenção de herança** → use `private` ou `public`

---

## Armadilhas Comuns

### 1. Acessar Protected de Instância da Superclasse em Outro Pacote

```java
package com.base;
public class Animal {
    protected String nome;
}

package com.derivada;
import com.base.Animal;

public class Cachorro extends Animal {
    void teste() {
        this.nome = "Rex";  // OK: acessa através de this

        Animal animal = new Animal();
        // animal.nome = "Qualquer";  // ERRO: não pode acessar protected de instância da superclasse
    }
}
```

**Solução**: Acesse apenas através de `this` ou instâncias da própria subclasse.

---

### 2. Reduzir Visibilidade ao Sobrescrever

```java
public class Base {
    protected void metodo() { }
}

public class Derivada extends Base {
    // @Override
    // private void metodo() { }  // ERRO: não pode reduzir visibilidade
}
```

**Solução**: Mantenha `protected` ou aumente para `public`.

---

### 3. Expor Atributos Protected Quebrando Encapsulamento

```java
public class Conta {
    protected double saldo;  // Qualquer subclasse pode modificar diretamente
}

public class ContaRuim extends Conta {
    void hackear() {
        saldo = 1000000;  // Quebra regras de negócio
    }
}
```

**Solução**: Prefira métodos protected a atributos protected.

---

### 4. Confundir Protected com Public

```java
// Desenvolvedor pensa que protected é "quase público"
public class MinhaClasse {
    protected String dado;  // Não é público!
}

// Outro pacote (não subclasse)
MinhaClasse obj = new MinhaClasse();
// obj.dado = "teste";  // ERRO: protected não é acessível
```

**Solução**: Lembre-se: protected ≠ public. Só é acessível em subclasses ou mesmo pacote.

---

### 5. Usar Protected em Classes Final

```java
public final class ClasseFinal {  // final: não pode ser herdada
    protected void metodo() { }  // Protected sem sentido em classe final
}
```

**Solução**: Classes `final` não têm subclasses. Use `private` ou `public`.

---

## Boas Práticas

### 1. Prefira Métodos Protected a Atributos Protected

```java
// EVITAR
protected double saldo;

// PREFERIR
private double saldo;
protected double getSaldo() { return saldo; }
protected void setSaldo(double saldo) {
    if (saldo < 0) throw new IllegalArgumentException();
    this.saldo = saldo;
}
```

---

### 2. Use Protected em Template Method

```java
public abstract class Processador {
    public final void processar() {
        inicializar();  // protected
        executar();     // protected abstract
        finalizar();    // protected
    }

    protected void inicializar() { }
    protected abstract void executar();
    protected void finalizar() { }
}
```

---

### 3. Construtores Protected em Classes Abstratas

```java
public abstract class Template {
    protected Template() { }  // Apenas subclasses instanciam
}
```

---

### 4. Documente Contratos Protected

```java
/**
 * Valida a entrada. Subclasses podem sobrescrever para validação customizada.
 * @param entrada dados a validar
 * @throws IllegalArgumentException se entrada inválida
 */
protected void validar(String entrada) {
    if (entrada == null) throw new IllegalArgumentException();
}
```

---

### 5. Use Protected Final Para Métodos Utilitários

```java
protected final void log(String msg) {  // Subclasses podem usar, não sobrescrever
    System.out.println(msg);
}
```

---

### 6. Combine com Abstract Para Contratos

```java
public abstract class Handler {
    protected abstract void handle();  // Subclasses DEVEM implementar
}
```

---

### 7. Evite Protected em Classes Sem Intenção de Herança

Se não planeja herança, use `private` ou `public`.

---

### 8. Teste Visibilidade Protected

```java
// Teste em outro pacote
public class TesteVisibilidade extends ClasseProtegida {
    @Test
    public void testarMetodoProtected() {
        metodoProtected();  // Deve ser acessível
    }
}
```

---

### 9. Revise Necessidade de Protected ao Marcar Classe como Final

Se tornar classe `final`, mude `protected` para `private` ou `public`.

---

### 10. Use Protected Para Hook Methods

```java
public class Sistema {
    public void executar() {
        antesDaExecucao();  // Hook protected
        // Lógica principal
        depoisDaExecucao();  // Hook protected
    }

    protected void antesDaExecucao() { }  // Subclasses podem sobrescrever
    protected void depoisDaExecucao() { }
}
```

---

## Resumo Executivo

O modificador **`protected`** oferece visibilidade **intermediária** entre `private` e `public`:

**Visibilidade**:
- ✅ Própria classe
- ✅ Classes do **mesmo pacote** (qualquer classe)
- ✅ **Subclasses de qualquer pacote** (através de herança)
- ❌ Classes de **outros pacotes** que não são subclasses

**Características**:
- Promove **extensibilidade** através de herança
- **Balanceia** proteção e flexibilidade
- **Encapsula** de código externo não relacionado
- Suporta padrões como **Template Method**

**Diferença-Chave de Default**:
- **Default**: apenas mesmo pacote (ignora hierarquia)
- **Protected**: mesmo pacote **+ subclasses de qualquer pacote**

**Acesso em Subclasses de Outro Pacote**:
- ✅ Através de **`this`** (própria instância)
- ✅ Através de **instâncias da mesma subclasse**
- ❌ Através de **instâncias da superclasse**
- ❌ Através de **instâncias de outras subclasses**

**Aplicações**:
1. **Template Method Pattern** (métodos abstract/concrete protected)
2. **Construtores** de classes abstratas
3. **Métodos Hook** para customização
4. **Getters/Setters** para subclasses (sem expor publicamente)
5. **Métodos utilitários** para extensão

**Sobrescrita**:
- Pode **manter** protected
- Pode **aumentar** para public
- **NÃO pode reduzir** para private/default

**Boas Práticas**:
- Prefira **métodos protected** a **atributos protected**
- Use em **Template Method** pattern
- Construtores protected em **classes abstratas**
- **Documente** contratos de extensão
- Use **`protected final`** para métodos utilitários não sobrescríveis
- Combine com **`abstract`** para contratos obrigatórios
- Evite protected em **classes `final`**

**Armadilhas**:
- Acessar protected de instância da superclasse em outro pacote
- Reduzir visibilidade ao sobrescrever
- Expor atributos protected (quebra encapsulamento)
- Confundir protected com public
- Usar protected em classes `final`

**Quando Usar**:
- Herança e extensão de classes
- Template Method e padrões de design
- Fornecer métodos auxiliares para subclasses

**Quando NÃO Usar**:
- Sem intenção de herança → `private` ou `public`
- API pública → `public`
- Apenas pacote → default
- Proteção total → `private`

**Regra de Ouro**: Use **`protected`** quando quiser permitir **extensão através de herança**, mas não expor como API pública.
