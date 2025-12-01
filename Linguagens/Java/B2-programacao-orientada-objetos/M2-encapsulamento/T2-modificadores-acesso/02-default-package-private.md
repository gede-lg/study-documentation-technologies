# T2.02 - Modificador de Acesso default (package-private)

## Introdução e Definição

O modificador de acesso **default** (também chamado de **package-private**) é aplicado quando **nenhum modificador** de acesso (`public`, `private`, `protected`) é explicitamente declarado. Este é o nível de acesso **padrão** em Java.

Membros com acesso default são visíveis para:
- **Mesma classe** (obviamente)
- **Classes do mesmo pacote** (package)

E **invisíveis** para:
- **Classes de outros pacotes** (mesmo que sejam subclasses)

Este modificador promove **coesão em nível de pacote**, permitindo que classes relacionadas no mesmo pacote colaborem internamente, enquanto esconde detalhes de implementação de pacotes externos.

**Características principais**:
- **Sem palavra-chave** (ausência de modificador)
- **Acesso no mesmo pacote**
- **Invisível fora do pacote**
- **Útil para organização interna** de pacotes
- **Promove encapsulamento em nível de pacote**

**Exemplo Básico**:
```java
package com.exemplo.util;

class UtilInterno {  // default: visível apenas no pacote com.exemplo.util
    String mensagem;  // default: visível apenas no pacote

    void processar() {  // default: visível apenas no pacote
        System.out.println("Processando...");
    }
}

public class UtilPublico {
    UtilInterno helper = new UtilInterno();  // OK: mesmo pacote

    public void executar() {
        helper.processar();  // OK: mesmo pacote
        helper.mensagem = "Teste";  // OK: mesmo pacote
    }
}
```

```java
package com.exemplo.main;

import com.exemplo.util.UtilPublico;
// import com.exemplo.util.UtilInterno;  // ERRO: UtilInterno não é visível

public class Principal {
    public void testar() {
        UtilPublico util = new UtilPublico();
        util.executar();  // OK: UtilPublico é public

        // UtilInterno interno = new UtilInterno();  // ERRO: default não é visível fora do pacote
    }
}
```

---

## 10 Fundamentos Teóricos

### 1. Ausência de Modificador = Default

O modificador default **não tem palavra-chave**. É aplicado quando você **não especifica** nenhum modificador.

```java
package com.exemplo;

// Classe com acesso default
class MinhaClasse {  // default (sem modificador)
    String atributo;  // default
    int numero;       // default

    void metodo() {   // default
        System.out.println("Método default");
    }
}

// Classe no MESMO pacote pode acessar
class OutraClasse {
    void usar() {
        MinhaClasse obj = new MinhaClasse();  // OK: mesmo pacote
        obj.atributo = "Teste";               // OK: mesmo pacote
        obj.metodo();                          // OK: mesmo pacote
    }
}
```

```java
package com.exemplo.outro;  // PACOTE DIFERENTE

// import com.exemplo.MinhaClasse;  // ERRO: MinhaClasse não é acessível

public class Teste {
    void usar() {
        // MinhaClasse obj = new MinhaClasse();  // ERRO: default não é visível
    }
}
```

**Regra**: Se não há `public`, `private`, ou `protected` → é **default**.

---

### 2. Visibilidade em Nível de Pacote

Membros default são visíveis para **todas as classes do mesmo pacote**, independentemente de hierarquia de herança.

```java
package com.empresa.modulo;

class Utilitario {
    String mensagem = "Mensagem interna";

    void processar() {
        System.out.println("Processando...");
    }
}

class Processador {
    void executar() {
        Utilitario util = new Utilitario();  // OK: mesmo pacote
        System.out.println(util.mensagem);   // OK: mesmo pacote
        util.processar();                     // OK: mesmo pacote
    }
}

public class Facade {
    public void operar() {
        Processador proc = new Processador();  // OK: mesmo pacote
        proc.executar();                        // OK: mesmo pacote
    }
}
```

**Benefício**: Classes internas do pacote podem colaborar livremente.

---

### 3. Invisível Fora do Pacote (Mesmo para Subclasses)

Classes com acesso default **NÃO são acessíveis** fora do pacote, **mesmo que haja herança**.

```java
package com.biblioteca.interno;

class BibliotecaBase {  // default
    void configurar() {  // default
        System.out.println("Configurando biblioteca...");
    }
}
```

```java
package com.biblioteca.publico;

// import com.biblioteca.interno.BibliotecaBase;  // ERRO: não visível

// Não é possível herdar classe default de outro pacote
// public class MinhaB Biblioteca extends BibliotecaBase { }  // ERRO: BibliotecaBase não visível
```

**Importante**: Diferente de `protected`, que permite acesso em subclasses de outros pacotes, **default NÃO permite** acesso fora do pacote, mesmo em subclasses.

---

### 4. Classes Top-Level e Default

Classes de nível superior (top-level) podem ser **public** ou **default**, mas **não** `private` ou `protected`.

```java
package com.exemplo;

// VÁLIDO: classe pública
public class ClassePublica {
}

// VÁLIDO: classe default (sem modificador)
class ClasseDefault {
}

// INVÁLIDO: classe top-level não pode ser private
// private class ClassePrivada { }  // ERRO de compilação

// INVÁLIDO: classe top-level não pode ser protected
// protected class ClasseProtegida { }  // ERRO de compilação
```

**Regra**: Classes top-level → `public` ou **default** apenas.

---

### 5. Organização de Pacotes com Default

O modificador default é útil para **organizar implementação interna** sem expor ao mundo externo.

**Estrutura de Pacote**:
```
com.empresa.util
├── StringUtils.java (public)
├── NumberUtils.java (public)
├── Validator.java (default - uso interno)
└── Cache.java (default - uso interno)
```

```java
package com.empresa.util;

// API Pública
public class StringUtils {
    public static String format(String s) {
        return Validator.validar(s) ? s.toUpperCase() : "";  // Usa classe default
    }
}

// Implementação Interna (não exposta)
class Validator {  // default
    static boolean validar(String s) {
        return s != null && !s.isEmpty();
    }
}

class Cache {  // default
    private static Map<String, String> cache = new HashMap<>();

    static void armazenar(String chave, String valor) {
        cache.put(chave, valor);
    }
}
```

**Benefício**: Código cliente só vê `StringUtils` (pública). `Validator` e `Cache` são detalhes internos.

---

### 6. Default em Atributos e Métodos

Atributos e métodos podem ter acesso default, visíveis no pacote.

```java
package com.exemplo.model;

public class Produto {
    String codigo;  // default: visível no pacote
    private String nome;  // private: visível apenas nesta classe
    public double preco;  // public: visível em todos os lugares

    void atualizarEstoque(int quantidade) {  // default: visível no pacote
        // Lógica de atualização
    }

    public void vender() {  // public
        atualizarEstoque(-1);  // OK: mesmo na própria classe
    }
}

class Estoque {  // default
    void processar() {
        Produto p = new Produto();
        p.codigo = "P001";  // OK: atributo default, mesmo pacote
        p.preco = 100.0;    // OK: atributo public
        // p.nome = "Teste";  // ERRO: nome é private
        p.atualizarEstoque(10);  // OK: método default, mesmo pacote
        p.vender();  // OK: método public
    }
}
```

```java
package com.exemplo.vendas;  // OUTRO PACOTE

import com.exemplo.model.Produto;

public class Vendedor {
    void vender() {
        Produto p = new Produto();
        // p.codigo = "P002";  // ERRO: codigo é default (não visível fora do pacote)
        p.preco = 200.0;  // OK: preco é public
        // p.atualizarEstoque(5);  // ERRO: atualizarEstoque é default
        p.vender();  // OK: vender é public
    }
}
```

---

### 7. Default em Construtores

Construtores com acesso default permitem instanciação **apenas no mesmo pacote**.

```java
package com.sistema.core;

public class Configuracao {
    private static Configuracao instancia;

    // Construtor default: apenas classes do pacote podem instanciar
    Configuracao() {
        // Inicialização
    }

    public static Configuracao getInstance() {
        if (instancia == null) {
            instancia = new Configuracao();  // OK: mesma classe
        }
        return instancia;
    }
}

class ConfiguracaoManager {  // default
    void resetar() {
        Configuracao config = new Configuracao();  // OK: mesmo pacote, construtor default
    }
}
```

```java
package com.sistema.app;

import com.sistema.core.Configuracao;

public class App {
    void iniciar() {
        // Configuracao config = new Configuracao();  // ERRO: construtor default não é visível
        Configuracao config = Configuracao.getInstance();  // OK: método público
    }
}
```

**Uso**: Controlar instanciação dentro do pacote, expor apenas via factory methods ou Singleton.

---

### 8. Default vs Protected em Subclasses

**Default** não é visível fora do pacote, **mesmo em subclasses**.  
**Protected** é visível em subclasses de qualquer pacote.

```java
package com.base;

public class Animal {
    String nome;  // default

    protected void emitirSom() {  // protected
        System.out.println("Som do animal");
    }

    void mover() {  // default
        System.out.println("Movendo...");
    }
}
```

```java
package com.derivada;

import com.base.Animal;

public class Cachorro extends Animal {
    void testar() {
        // nome = "Rex";  // ERRO: nome é default (não visível fora do pacote)
        emitirSom();  // OK: emitirSom é protected (visível em subclasse)
        // mover();  // ERRO: mover é default (não visível fora do pacote)
    }
}
```

**Diferença Crítica**:
- **Default**: visível **mesmo pacote** (ignorando hierarquia de herança)
- **Protected**: visível **mesmo pacote + subclasses de qualquer pacote**

---

### 9. Múltiplas Classes no Mesmo Arquivo

Um arquivo `.java` pode conter **múltiplas classes**, mas apenas **uma pública** (que deve ter o nome do arquivo).

```java
// Arquivo: Calculadora.java
package com.exemplo;

public class Calculadora {  // public (nome do arquivo)
    public int somar(int a, int b) {
        return Validador.validar(a, b) ? a + b : 0;
    }
}

class Validador {  // default (não pode ser public aqui)
    static boolean validar(int a, int b) {
        return a >= 0 && b >= 0;
    }
}

class Logger {  // default
    static void log(String msg) {
        System.out.println("LOG: " + msg);
    }
}
```

**Regra**: Um arquivo pode ter várias classes default, mas **apenas uma public** (com nome igual ao arquivo).

---

### 10. Default em Interfaces (Não Aplicável Diretamente)

Interfaces **não podem ter acesso default** como classes. Interfaces de nível superior devem ser **public** ou **default**, mas membros de interface têm regras próprias.

```java
package com.exemplo;

// Interface pública
public interface Calculavel {
    void calcular();  // Implicitamente public abstract
}

// Interface default (sem modificador)
interface UtilInterno {
    void processar();  // Implicitamente public abstract
}
```

**Membros de Interface**:
- Métodos abstratos: implicitamente `public abstract`
- Métodos default: implicitamente `public`
- Métodos static: implicitamente `public`
- Atributos: implicitamente `public static final`

**Não existe** método/atributo default (package-private) em interface (antes do Java 9). A partir do Java 9, interfaces podem ter **métodos privados**, mas não package-private.

---

## Aplicabilidade

### Quando Usar Default (Package-Private)

1. **Classes de Implementação Interna**:
   ```java
   class Helper { }  // Usado apenas dentro do pacote
   ```

2. **Métodos Auxiliares para Pacote**:
   ```java
   void atualizarCache() { }  // Usado por classes do pacote
   ```

3. **Construtores para Controle de Instanciação**:
   ```java
   Configuracao() { }  // Apenas pacote pode instanciar
   ```

4. **Atributos Compartilhados no Pacote**:
   ```java
   String configuracaoPadrao;  // Visível no pacote
   ```

5. **Classes de Teste no Mesmo Pacote** (test packages):
   ```java
   class TestHelper { }  // Para testes no mesmo pacote
   ```

### Quando NÃO Usar Default

1. **API Pública** → use `public`
2. **Proteger Completamente** → use `private`
3. **Herança entre Pacotes** → use `protected`
4. **Constantes Públicas** → use `public static final`

---

## Armadilhas Comuns

### 1. Confundir Default com Public

```java
package com.exemplo;

class MinhaClasse {  // Parece "public", mas é default
    void metodo() { }
}

// Outro pacote:
// import com.exemplo.MinhaClasse;  // ERRO: não é pública
```

**Solução**: Sempre declare `public` explicitamente se quiser visibilidade externa.

---

### 2. Tentar Herdar Classe Default de Outro Pacote

```java
package com.base;

class BaseClass { }  // default
```

```java
package com.derivada;

// import com.base.BaseClass;  // ERRO
// public class Derivada extends BaseClass { }  // ERRO: BaseClass não visível
```

**Solução**: Torne a superclasse `public` ou mova a subclasse para o mesmo pacote.

---

### 3. Acessar Membros Default de Outro Pacote

```java
package com.exemplo.util;

public class Util {
    String mensagem;  // default
}
```

```java
package com.exemplo.app;

import com.exemplo.util.Util;

public class App {
    void teste() {
        Util u = new Util();
        // u.mensagem = "Teste";  // ERRO: mensagem é default
    }
}
```

**Solução**: Torne o atributo `public` ou forneça getter/setter público.

---

### 4. Múltiplas Classes Public no Mesmo Arquivo

```java
// Arquivo: MinhaClasse.java
package com.exemplo;

public class MinhaClasse { }

public class OutraClasse { }  // ERRO: apenas uma classe pública por arquivo
```

**Solução**: Apenas uma classe `public` por arquivo (com nome igual ao arquivo).

---

### 5. Esquecer que Default NÃO é Protected

```java
package com.base;

public class Animal {
    void mover() { }  // default (não protected)
}
```

```java
package com.derivada;

import com.base.Animal;

public class Cachorro extends Animal {
    void teste() {
        // mover();  // ERRO: mover() é default (não visível aqui)
    }
}
```

**Solução**: Se precisa acesso em subclasses de outros pacotes, use `protected`.

---

## Boas Práticas

### 1. Use Default para Implementação Interna de Pacote

```java
package com.sistema.database;

public class DatabaseFacade {
    private ConnectionPool pool = new ConnectionPool();  // Usa classe default

    public void conectar() {
        Connection conn = pool.obterConexao();
    }
}

class ConnectionPool {  // default: implementação interna
    Connection obterConexao() {
        // Lógica interna
        return null;
    }
}
```

---

### 2. Organize Pacotes Coesos

Agrupe classes relacionadas no mesmo pacote para que possam colaborar com acesso default.

```
com.empresa.produto
├── Produto.java (public)
├── ProdutoDAO.java (public)
├── ProdutoValidator.java (default - uso interno)
└── ProdutoCache.java (default - uso interno)
```

---

### 3. Mantenha API Pública Mínima

Exponha apenas o necessário como `public`. Mantenha implementações como default.

```java
package com.api;

// API Pública
public class ApiService {
    public void executar() {
        Helper.processar();  // Usa helper interno
    }
}

// Implementação Interna
class Helper {  // default
    static void processar() { }
}
```

---

### 4. Construtores Default Para Factory

```java
package com.modelo;

public class Usuario {
    private String nome;

    // Construtor default: apenas pacote instancia diretamente
    Usuario(String nome) {
        this.nome = nome;
    }

    public static Usuario criar(String nome) {  // Factory público
        return new Usuario(nome);
    }
}
```

---

### 5. Documente Decisões de Visibilidade

```java
/**
 * Classe de validação para uso interno do pacote.
 * Não deve ser usada fora de com.empresa.util.
 */
class Validator {
}
```

---

### 6. Evite Default Para Atributos (Prefira Private)

```java
// EVITAR
public class Produto {
    String nome;  // default
}

// PREFERIR
public class Produto {
    private String nome;  // private com getter/setter

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
```

---

### 7. Use Default em Testes no Mesmo Pacote

```java
// src/main/java/com/exemplo/Servico.java
package com.exemplo;

public class Servico {
    void metodoInterno() { }  // default para testes
}

// src/test/java/com/exemplo/ServicoTest.java
package com.exemplo;  // MESMO PACOTE

public class ServicoTest {
    @Test
    public void testarMetodoInterno() {
        Servico s = new Servico();
        s.metodoInterno();  // OK: mesmo pacote
    }
}
```

---

### 8. Revise Acessibilidade ao Refatorar Pacotes

Ao mover classes entre pacotes, verifique se membros default precisam ser `public` ou `protected`.

---

### 9. Prefira Composição com Classes Default

```java
package com.sistema;

public class Sistema {
    private Logger logger = new Logger();  // Composição com classe default

    public void executar() {
        logger.log("Executando...");
    }
}

class Logger {  // default: uso interno
    void log(String msg) {
        System.out.println(msg);
    }
}
```

---

### 10. Mantenha Estrutura de Pacotes Clara

Organize pacotes por funcionalidade, não por tipo de classe.

```
// BOM
com.empresa.usuario
├── Usuario.java
├── UsuarioService.java
└── UsuarioDAO.java

com.empresa.produto
├── Produto.java
├── ProdutoService.java
└── ProdutoDAO.java

// EVITAR
com.empresa.model
├── Usuario.java
└── Produto.java

com.empresa.service
├── UsuarioService.java
└── ProdutoService.java
```

---

## Resumo Executivo

O modificador de acesso **default** (package-private) é aplicado quando **nenhum modificador** é declarado:

**Características**:
- **Sem palavra-chave** (ausência de modificador)
- Visível no **mesmo pacote**
- **Invisível fora do pacote** (mesmo para subclasses)
- Promove **coesão em nível de pacote**
- **Encapsulamento de implementação** dentro do pacote

**Visibilidade**:
- ✅ Mesma classe
- ✅ Classes do **mesmo pacote**
- ❌ Classes de **outros pacotes** (mesmo subclasses)

**Aplicações**:
1. **Classes de implementação interna** do pacote
2. **Métodos auxiliares** para uso no pacote
3. **Construtores** para controle de instanciação no pacote
4. **Atributos compartilhados** entre classes do pacote
5. **Classes de teste** no mesmo pacote (test packages)
6. **Helpers e utilitários** internos

**Default vs Outros Modificadores**:
- **private** < **default** < **protected** < **public** (visibilidade crescente)
- **Default**: mesmo pacote (ignora hierarquia)
- **Protected**: mesmo pacote + subclasses de qualquer pacote
- **Public**: todos os lugares
- **Private**: apenas própria classe

**Regras Especiais**:
- Classes top-level: apenas `public` ou **default**
- Um arquivo `.java`: apenas **uma** classe `public`
- Construtores default: instanciação no pacote
- Interfaces: membros implicitamente `public` (exceto métodos privados no Java 9+)

**Boas Práticas**:
- Use default para **implementação interna** de pacote
- Organize **pacotes coesos** (classes relacionadas juntas)
- Mantenha **API pública mínima** (`public`)
- Prefira **`private`** para atributos (não default)
- Documente decisões de visibilidade
- Construtores default para **Factory pattern**
- Use em **testes** (mesmo pacote)

**Armadilhas**:
- Confundir default com `public`
- Tentar herdar classe default de outro pacote
- Acessar membros default de outro pacote
- Múltiplas classes `public` no mesmo arquivo
- Esquecer que default **NÃO é** `protected`

**Quando Usar**:
- Implementação interna de pacote
- Helpers e utilitários privados do pacote
- Controle de instanciação

**Quando NÃO Usar**:
- API pública → `public`
- Proteção total → `private`
- Herança entre pacotes → `protected`

**Regra de Ouro**: Use **default** para esconder detalhes de implementação **dentro do pacote**, expondo apenas classes e métodos essenciais como `public`.
