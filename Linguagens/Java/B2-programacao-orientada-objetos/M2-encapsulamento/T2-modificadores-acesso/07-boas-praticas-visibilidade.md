# T2.07 - Boas Práticas de Visibilidade e Encapsulamento

## Introdução e Definição

As **boas práticas de visibilidade** são diretrizes que ajudam a criar código **bem encapsulado**, **manutenível** e **flexível**. Elas se baseiam em princípios fundamentais de design orientado a objetos:

- **Information Hiding** (Ocultação de Informação)
- **Principle of Least Privilege** (Princípio do Menor Privilégio)
- **Open/Closed Principle** (Aberto para Extensão, Fechado para Modificação)
- **Dependency Inversion** (Depender de Abstrações, não Implementações)

Seguir essas práticas resulta em:
- **Código mais seguro** (dados protegidos)
- **Maior manutenibilidade** (mudanças internas não afetam código externo)
- **APIs mais claras** (interface pública bem definida)
- **Menor acoplamento** (componentes independentes)
- **Maior coesão** (responsabilidades bem definidas)

---

## 10 Fundamentos Teóricos

### 1. Princípio do Menor Privilégio (Least Privilege)

**Regra**: Sempre comece com a **menor visibilidade possível** (`private`) e aumente **apenas quando necessário**.

```java
// ✅ BOM: Começa privado
public class Usuario {
    private String nome;        // Privado por padrão
    private String senha;       // Privado
    private LocalDate dataNascimento;

    // Aumenta visibilidade apenas para API pública
    public String getNome() {
        return nome;
    }

    // Validação privada
    private boolean validarSenha(String senha) {
        return senha != null && senha.length() >= 8;
    }
}

// ❌ RUIM: Tudo público
public class Usuario {
    public String nome;         // Exposto desnecessariamente
    public String senha;        // PERIGO: senha exposta!
    public LocalDate dataNascimento;
}
```

**Ordem de Preferência**:
```
1. private (primeira escolha)
2. default (se precisa compartilhar no pacote)
3. protected (se precisa herança)
4. public (apenas para API pública)
```

---

### 2. Atributos Sempre Privados

**Regra**: Atributos de instância devem ser **`private`**, com acesso via getters/setters.

```java
// ✅ BOM: Atributos privados
public class Produto {
    private String nome;
    private double preco;

    public String getNome() {
        return nome;
    }

    public void setPreco(double preco) {
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }
        this.preco = preco;  // Validação!
    }
}

// ❌ RUIM: Atributos públicos
public class Produto {
    public String nome;
    public double preco;  // Sem validação!
}

// Problema:
Produto p = new Produto();
p.preco = -100;  // Viola regra de negócio!
```

**Benefícios**:
- **Validação** centralizada em setters
- **Flexibilidade** para mudar implementação interna
- **Controle** sobre leitura/escrita
- **Debugging** facilitado (breakpoints em getters/setters)

---

### 3. Métodos Públicos Mínimos (API Pública Enxuta)

**Regra**: Exponha apenas o **absolutamente necessário** como `public`. Mantenha métodos auxiliares `private`.

```java
// ✅ BOM: API pública mínima
public class GerenciadorArquivos {
    // API pública (interface)
    public void salvar(String caminho, String conteudo) {
        validarCaminho(caminho);      // private
        criarDiretorioSeNecessario(caminho);  // private
        escreverArquivo(caminho, conteudo);   // private
    }

    // Implementação privada
    private void validarCaminho(String caminho) {
        if (caminho == null || caminho.isEmpty()) {
            throw new IllegalArgumentException();
        }
    }

    private void criarDiretorioSeNecessario(String caminho) {
        // Lógica de criação de diretório
    }

    private void escreverArquivo(String caminho, String conteudo) {
        // Lógica de escrita
    }
}

// ❌ RUIM: Tudo público (expõe implementação)
public class GerenciadorArquivos {
    public void validarCaminho(String caminho) { }  // Não deveria ser público
    public void criarDiretorioSeNecessario(String caminho) { }  // Implementação exposta
    public void escreverArquivo(String caminho, String conteudo) { }
}
```

**Benefícios**:
- **Simplifica interface** para usuários
- **Facilita mudanças** internas sem quebrar código cliente
- **Reduz complexidade** da API

---

### 4. Use Protected Para Extensibilidade (Template Method)

**Regra**: Use `protected` para permitir **customização por subclasses** sem expor publicamente.

```java
// ✅ BOM: Protected para extensão controlada
public abstract class HTTPServlet {
    // Template method (public final)
    public final void processarRequisicao(Request req, Response res) {
        validar(req);      // protected
        doGet(req, res);   // protected abstract
        finalizar(res);    // protected
    }

    // Subclasses podem customizar
    protected void validar(Request req) {
        // Validação padrão
    }

    // Subclasses DEVEM implementar
    protected abstract void doGet(Request req, Response res);

    protected void finalizar(Response res) {
        // Finalização padrão
    }
}

public class MeuServlet extends HTTPServlet {
    @Override
    protected void doGet(Request req, Response res) {
        // Implementação específica
    }
}

// ❌ RUIM: Métodos públicos (expõe demais) ou privados (impede extensão)
public abstract class HTTPServlet {
    public void validar(Request req) { }  // Público demais
    private void finalizar(Response res) { }  // Privado demais (subclasses não podem usar)
}
```

---

### 5. Constantes Públicas, Variáveis Privadas

**Regra**: **Constantes** (`final`) podem ser `public static final`. **Variáveis mutáveis** devem ser `private`.

```java
// ✅ BOM: Constantes públicas
public class Config {
    public static final String VERSAO = "1.0.0";      // OK: imutável
    public static final int MAX_CONEXOES = 100;       // OK: imutável
    public static final List<String> NOMES_RESERVADOS =  // OK: imutável
        Collections.unmodifiableList(Arrays.asList("admin", "root"));

    private static int conexoesAtivas = 0;  // Privado: mutável
}

// ❌ RUIM: Variáveis mutáveis públicas
public class Config {
    public static int conexoesAtivas = 0;  // PERIGO: qualquer um pode modificar!
    public static List<String> usuarios = new ArrayList<>();  // PERIGO: mutável!
}
```

**Exceção**: Se precisa expor lista, use Collections imutáveis:

```java
public class Config {
    private static final List<String> listaInterna = new ArrayList<>();

    // Retorna lista imutável
    public static List<String> getItens() {
        return Collections.unmodifiableList(listaInterna);
    }
}
```

---

### 6. Cópia Defensiva Para Objetos Mutáveis

**Regra**: Getters de **objetos mutáveis** (coleções, arrays, Datas) devem retornar **cópias**, não referências internas.

```java
// ✅ BOM: Cópia defensiva
public class Pedido {
    private List<String> itens = new ArrayList<>();
    private Date dataCriacao = new Date();

    // Retorna cópia (não referência interna)
    public List<String> getItens() {
        return new ArrayList<>(itens);  // Cópia
    }

    // Ou lista imutável
    public List<String> getItens() {
        return Collections.unmodifiableList(itens);
    }

    // Retorna cópia de Date
    public Date getDataCriacao() {
        return new Date(dataCriacao.getTime());  // Cópia
    }

    // Setter também recebe cópia
    public void setItens(List<String> itens) {
        this.itens = new ArrayList<>(itens);  // Cópia
    }
}

// ❌ RUIM: Expõe referência interna
public class Pedido {
    private List<String> itens = new ArrayList<>();

    public List<String> getItens() {
        return itens;  // PERIGO: referência direta!
    }
}

// Problema:
Pedido p = new Pedido();
p.getItens().clear();  // Modifica lista interna!
```

**Alternativa Moderna (Java 10+)**:

```java
public List<String> getItens() {
    return List.copyOf(itens);  // Cópia imutável
}
```

---

### 7. Construtores Privados Para Singletons e Classes Utilitárias

**Regra**: Use construtor `private` para **impedir instanciação** em Singletons e classes utilitárias.

#### Singleton

```java
public class Configuracao {
    private static final Configuracao INSTANCIA = new Configuracao();

    private Configuracao() { }  // Impede instanciação externa

    public static Configuracao getInstance() {
        return INSTANCIA;
    }
}

// Uso:
Configuracao config = Configuracao.getInstance();  // OK
// Configuracao c = new Configuracao();  // ERRO: construtor privado
```

#### Classe Utilitária

```java
public final class StringUtils {
    private StringUtils() {  // Impede instanciação
        throw new UnsupportedOperationException("Classe utilitária não pode ser instanciada");
    }

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }
}

// Uso:
boolean vazio = StringUtils.isNullOrEmpty("");  // OK: método estático
// StringUtils util = new StringUtils();  // ERRO: construtor privado
```

---

### 8. Interfaces Públicas, Implementações Package-Private

**Regra**: Exponha **interfaces** como `public`, mantenha **implementações** como `default` (package-private).

```java
// API pública (interface)
public interface UserRepository {
    User findById(int id);
    List<User> findAll();
    void save(User user);
}

// Implementação interna (default)
class UserRepositoryImpl implements UserRepository {
    @Override
    public User findById(int id) {
        // Implementação
        return null;
    }

    @Override
    public List<User> findAll() {
        return new ArrayList<>();
    }

    @Override
    public void save(User user) {
        // Implementação
    }
}

// Factory pública
public class RepositoryFactory {
    public static UserRepository getUserRepository() {
        return new UserRepositoryImpl();  // Retorna implementação
    }
}

// Uso:
UserRepository repo = RepositoryFactory.getUserRepository();
User user = repo.findById(1);
```

**Benefícios**:
- **Flexibilidade**: mudar implementação sem afetar código cliente
- **Encapsulamento**: esconde detalhes de implementação
- **Testabilidade**: fácil criar mocks

---

### 9. Documente Decisões de Visibilidade

**Regra**: Use **Javadoc** para documentar API pública e explicar decisões de visibilidade não óbvias.

```java
/**
 * Serviço para gerenciar usuários do sistema.
 * 
 * <p>Esta classe fornece operações para criar, atualizar e remover usuários.
 * Não deve ser instanciada diretamente; use {@link ServiceFactory#getUserService()}.
 */
public interface UserService {
    /**
     * Cria um novo usuário no sistema.
     * 
     * @param nome nome completo do usuário
     * @param email email válido (deve ser único)
     * @throws IllegalArgumentException se nome ou email forem inválidos
     * @throws DuplicateEmailException se email já estiver cadastrado
     */
    void createUser(String nome, String email);
}

/**
 * Implementação padrão de {@link UserService}.
 * 
 * <p>Visibilidade package-private para esconder detalhes de implementação.
 * Código cliente deve usar {@link ServiceFactory} para obter instância.
 */
class UserServiceImpl implements UserService {
    @Override
    public void createUser(String nome, String email) {
        validarNome(nome);  // private
        validarEmail(email);  // private
        // ...
    }

    /**
     * Valida formato do nome.
     * Método privado, não parte da API pública.
     */
    private void validarNome(String nome) {
        // ...
    }
}
```

---

### 10. Revise Visibilidade ao Refatorar

**Regra**: Ao **mover classes entre pacotes** ou **alterar hierarquias**, revise modificadores de acesso.

**Cenário 1: Mover Classe Para Outro Pacote**

```java
// Antes: com.empresa.util
package com.empresa.util;

class Helper {  // default (acessível no pacote util)
    void processar() { }
}

// Depois: mover para com.empresa.core
package com.empresa.core;

// Se outras classes do pacote util precisam acessar, torne público
public class Helper {
    public void processar() { }
}
```

**Cenário 2: Tornar Classe Final (Sem Subclasses)**

```java
// Antes: permite herança
public class Servico {
    protected void metodo() { }  // protected para subclasses
}

// Depois: classe final (sem herança)
public final class Servico {
    private void metodo() { }  // protected não faz mais sentido → private
}
```

**Checklist de Revisão**:
- [ ] Atributos são `private`?
- [ ] Métodos auxiliares são `private`?
- [ ] API pública está mínima?
- [ ] `protected` usado apenas para extensão?
- [ ] Construtores têm visibilidade adequada?
- [ ] Classes internas têm visibilidade mínima?

---

## Aplicabilidade

### Guia de Decisão Rápida

**Para Atributos**:
```
Regra geral → private
Exceção → public static final (constantes)
```

**Para Métodos**:
```
Auxiliares → private
API pública → public
Extensão → protected
Colaboração no pacote → default
```

**Para Construtores**:
```
Instanciação pública → public
Apenas subclasses → protected
Singleton/Utilitária → private
Controle no pacote → default
```

**Para Classes**:
```
API pública → public
Implementação interna → default
Classes internas auxiliares → private
```

---

## Armadilhas Comuns

### 1. Atributos Públicos (Quebra Encapsulamento)

```java
// ❌ EVITAR
public class Pessoa {
    public String nome;  // Sem validação, sem controle
}

// ✅ CORRIGIR
public class Pessoa {
    private String nome;

    public String getNome() { return nome; }
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException();
        }
        this.nome = nome;
    }
}
```

### 2. Retornar Referências Mutáveis

```java
// ❌ EVITAR
public List<String> getItens() {
    return itens;  // Referência direta
}

// ✅ CORRIGIR
public List<String> getItens() {
    return new ArrayList<>(itens);  // Cópia
}
```

### 3. API Pública Muito Ampla

```java
// ❌ EVITAR: tudo público
public void validar() { }
public void preparar() { }
public void processar() { }
public void finalizar() { }

// ✅ CORRIGIR: API pública mínima
public void executar() {
    validar();   // private
    preparar();  // private
    processar(); // private
    finalizar(); // private
}
```

---

## Resumo Executivo

**Boas Práticas Essenciais**:

1. **Princípio do Menor Privilégio**: Comece com `private`, aumente apenas quando necessário

2. **Atributos Sempre Privados**: Acesso via getters/setters com validação

3. **API Pública Mínima**: Exponha apenas o necessário, mantenha auxiliares `private`

4. **Protected Para Extensão**: Use em Template Method e hooks para subclasses

5. **Constantes Públicas**: `public static final` para valores imutáveis

6. **Cópia Defensiva**: Retorne cópias de objetos mutáveis, não referências internas

7. **Construtores Privados**: Singleton, classes utilitárias, controle de instanciação

8. **Interfaces Públicas, Implementações Privadas**: Exponha abstrações, esconda implementações

9. **Documente Decisões**: Javadoc para API pública, explique visibilidade não óbvia

10. **Revise ao Refatorar**: Mover classes/mudar hierarquia exige revisão de visibilidade

**Ordem de Preferência**:
```
private > default > protected > public
(mais restritivo → menos restritivo)
```

**Checklist Rápido**:
- [ ] Atributos `private`?
- [ ] Getters/setters com validação?
- [ ] API pública mínima?
- [ ] Cópia defensiva para mutáveis?
- [ ] Construtores com visibilidade adequada?
- [ ] Documentação clara?

**Princípios Fundamentais**:
- **Information Hiding** (Ocultação de Informação)
- **Least Privilege** (Menor Privilégio)
- **Open/Closed** (Aberto para Extensão, Fechado para Modificação)

**Regra de Ouro**: **Encapsule tudo por padrão** (`private`). Exponha apenas o **absolutamente necessário** para a API pública.
