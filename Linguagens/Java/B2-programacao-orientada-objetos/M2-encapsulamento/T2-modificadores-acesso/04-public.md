# T2.04 - Modificador de Acesso public

## Introdução e Definição

O modificador de acesso **`public`** é o **mais permissivo** dos quatro modificadores de acesso em Java. Membros declarados como `public` são **acessíveis de qualquer lugar** do código — dentro da própria classe, classes do mesmo pacote, subclasses, e classes de qualquer outro pacote.

O `public` define a **API pública** (Application Programming Interface) de uma classe — os pontos de entrada que o código externo pode usar. É essencial para:
- **Expor funcionalidades** para uso externo
- **Definir contratos** de classes e interfaces
- **Facilitar interoperabilidade** entre módulos e pacotes
- **Criar bibliotecas e frameworks** reutilizáveis

**Características principais**:
- **Acesso irrestrito** de qualquer lugar
- **Define API pública** da classe
- **Sem restrições** de pacote ou hierarquia
- **Visibilidade máxima**
- **Interface de comunicação** entre componentes

**Exemplo Básico**:
```java
package com.empresa.servicos;

public class CalculadoraFinanceira {  // Classe pública
    public static final double TAXA_PADRAO = 0.05;  // Constante pública

    public double calcularJuros(double valor, double taxa) {  // Método público
        return valor * taxa;
    }

    public double calcularJurosSimples(double principal, double taxa, int meses) {
        return principal * taxa * meses;
    }
}
```

```java
package com.empresa.app;  // OUTRO PACOTE

import com.empresa.servicos.CalculadoraFinanceira;

public class Aplicacao {
    public void executar() {
        CalculadoraFinanceira calc = new CalculadoraFinanceira();  // OK: classe pública
        double juros = calc.calcularJuros(1000, 0.05);  // OK: método público
        double taxaPadrao = CalculadoraFinanceira.TAXA_PADRAO;  // OK: constante pública
        System.out.println("Juros: " + juros);
    }
}
```

---

## 10 Fundamentos Teóricos

### 1. Acesso Irrestrito de Qualquer Lugar

Membros `public` são acessíveis **sem restrições** de localização.

```java
package com.biblioteca.util;

public class StringUtils {
    public static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    public static String capitalize(String str) {
        if (isNullOrEmpty(str)) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
```

```java
package com.aplicacao.main;  // PACOTE COMPLETAMENTE DIFERENTE

import com.biblioteca.util.StringUtils;

public class Main {
    public static void main(String[] args) {
        // Acesso irrestrito a membros públicos
        boolean vazio = StringUtils.isNullOrEmpty("");  // OK
        String nome = StringUtils.capitalize("joão");    // OK
        System.out.println(nome);  // João
    }
}
```

**Regra**: `public` → acesso de **qualquer lugar**, qualquer pacote.

---

### 2. Classes Top-Level Públicas

Classes de nível superior (top-level) podem ser `public`, tornando-as acessíveis de outros pacotes.

```java
// Arquivo: Usuario.java
package com.modelo;

public class Usuario {  // Classe pública
    private String nome;
    private String email;

    public Usuario(String nome, String email) {  // Construtor público
        this.nome = nome;
        this.email = email;
    }

    public String getNome() {  // Getter público
        return nome;
    }

    public String getEmail() {
        return email;
    }
}
```

```java
package com.servico;  // OUTRO PACOTE

import com.modelo.Usuario;

public class UsuarioService {
    public void criarUsuario() {
        Usuario usuario = new Usuario("Maria", "maria@email.com");  // OK: classe e construtor públicos
        System.out.println("Usuário: " + usuario.getNome());  // OK: método público
    }
}
```

**Regra**: **Apenas uma** classe pública por arquivo `.java`, e o nome da classe deve corresponder ao nome do arquivo.

---

### 3. API Pública (Interface de Programação)

Membros `public` formam a **API pública** da classe — o que está disponível para código externo.

```java
package com.sistema.core;

public class GerenciadorArquivos {
    // API Pública
    public void salvar(String caminho, String conteudo) {
        validarCaminho(caminho);  // Usa método privado
        escreverArquivo(caminho, conteudo);  // Usa método privado
    }

    public String carregar(String caminho) {
        validarCaminho(caminho);
        return lerArquivo(caminho);  // Usa método privado
    }

    // Implementação privada (não parte da API)
    private void validarCaminho(String caminho) {
        if (caminho == null || caminho.isEmpty()) {
            throw new IllegalArgumentException("Caminho inválido");
        }
    }

    private void escreverArquivo(String caminho, String conteudo) {
        // Lógica de escrita
    }

    private String lerArquivo(String caminho) {
        // Lógica de leitura
        return "conteúdo";
    }
}
```

**Benefício**: Separa **interface pública** (o quê) de **implementação interna** (como).

---

### 4. Constantes Públicas

Constantes `public static final` são acessíveis globalmente.

```java
package com.config;

public class Constantes {
    // Constantes públicas
    public static final String VERSAO_APP = "1.0.0";
    public static final int MAX_TENTATIVAS = 3;
    public static final double PI = 3.14159265359;
    public static final String[] DIAS_SEMANA = {
        "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
    };

    // Construtor privado para impedir instanciação
    private Constantes() {
        throw new UnsupportedOperationException("Classe de constantes não pode ser instanciada");
    }
}
```

```java
package com.app;

import com.config.Constantes;

public class App {
    public void exibirVersao() {
        System.out.println("Versão: " + Constantes.VERSAO_APP);  // OK
        System.out.println("Máx tentativas: " + Constantes.MAX_TENTATIVAS);  // OK
    }
}
```

**Convenção**: Constantes em `UPPER_CASE_WITH_UNDERSCORES`.

---

### 5. Métodos Estáticos Públicos (Métodos Utilitários)

Métodos `public static` são acessíveis sem necessidade de instanciar a classe.

```java
package com.util;

public final class MathUtils {
    // Construtor privado
    private MathUtils() { }

    // Métodos utilitários públicos
    public static int max(int a, int b) {
        return a > b ? a : b;
    }

    public static int min(int a, int b) {
        return a < b ? a : b;
    }

    public static double calcularMedia(int[] valores) {
        if (valores == null || valores.length == 0) {
            throw new IllegalArgumentException("Array vazio");
        }
        int soma = 0;
        for (int v : valores) {
            soma += v;
        }
        return (double) soma / valores.length;
    }
}
```

```java
package com.app;

import com.util.MathUtils;

public class Teste {
    public void calcular() {
        int maior = MathUtils.max(10, 20);  // OK: método estático público
        double media = MathUtils.calcularMedia(new int[]{1, 2, 3, 4, 5});  // OK
    }
}
```

**Exemplos Java**: `Math.sqrt()`, `Collections.sort()`, `Arrays.toString()`.

---

### 6. Construtores Públicos

Construtores `public` permitem **instanciação de qualquer lugar**.

```java
package com.modelo;

public class Produto {
    private String nome;
    private double preco;

    // Construtor público
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    // Outro construtor público
    public Produto(String nome) {
        this(nome, 0.0);  // Delegação
    }

    public String getNome() {
        return nome;
    }

    public double getPreco() {
        return preco;
    }
}
```

```java
package com.servico;

import com.modelo.Produto;

public class Loja {
    public void vender() {
        Produto p1 = new Produto("Notebook", 3000);  // OK: construtor público
        Produto p2 = new Produto("Mouse");           // OK: construtor público
    }
}
```

**Uso**: Permita instanciação pública quando a classe for um **modelo de dados** ou **serviço reutilizável**.

---

### 7. Interfaces Públicas

Interfaces geralmente são `public` para definir **contratos** acessíveis a implementadores.

```java
package com.contrato;

public interface Autenticavel {  // Interface pública
    boolean autenticar(String usuario, String senha);  // Implicitamente public abstract
    void logout();
}
```

```java
package com.implementacao;

import com.contrato.Autenticavel;

public class AutenticacaoBasica implements Autenticavel {  // Implementa interface pública
    @Override
    public boolean autenticar(String usuario, String senha) {
        // Lógica de autenticação
        return true;
    }

    @Override
    public void logout() {
        // Lógica de logout
    }
}
```

**Benefício**: Define **contratos** que podem ter múltiplas implementações públicas.

---

### 8. Enums Públicos

Enums `public` definem **conjuntos de constantes** acessíveis globalmente.

```java
package com.modelo;

public enum StatusPedido {  // Enum público
    PENDENTE("Aguardando pagamento"),
    CONFIRMADO("Pagamento confirmado"),
    ENVIADO("Em transporte"),
    ENTREGUE("Entregue ao destinatário"),
    CANCELADO("Cancelado pelo cliente");

    private final String descricao;

    StatusPedido(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {  // Método público
        return descricao;
    }
}
```

```java
package com.servico;

import com.modelo.StatusPedido;

public class PedidoService {
    public void processarPedido(StatusPedido status) {
        System.out.println("Processando pedido: " + status.getDescricao());
    }

    public void criar() {
        processarPedido(StatusPedido.PENDENTE);  // OK: enum e método públicos
    }
}
```

---

### 9. Getters e Setters Públicos (JavaBeans)

Getters/setters `public` expõem **atributos privados** de forma controlada.

```java
package com.modelo;

public class Pessoa {
    private String nome;  // Privado
    private int idade;    // Privado

    // Getter público
    public String getNome() {
        return nome;
    }

    // Setter público com validação
    public void setNome(String nome) {
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
}
```

```java
package com.app;

import com.modelo.Pessoa;

public class App {
    public void criar() {
        Pessoa p = new Pessoa();
        p.setNome("Carlos");  // OK: setter público
        p.setIdade(30);       // OK: setter público
        System.out.println(p.getNome());  // OK: getter público
    }
}
```

**Convenção JavaBeans**:
- Getters: `getTipo()`
- Setters: `setTipo(Tipo valor)`
- Boolean: `isTipo()` ou `getTipo()`

---

### 10. Main Method (Ponto de Entrada Público)

O método `main` deve ser `public static void` para ser acessível pela JVM.

```java
package com.app;

public class Aplicacao {
    // Ponto de entrada: DEVE ser public static void main(String[] args)
    public static void main(String[] args) {
        System.out.println("Aplicação iniciada");
        Aplicacao app = new Aplicacao();
        app.executar();
    }

    public void executar() {
        // Lógica da aplicação
    }
}
```

**Assinatura obrigatória**:
```java
public static void main(String[] args)
```

**Por quê public?**: JVM precisa acessar `main` de fora da classe para iniciar o programa.

---

## Aplicabilidade

### Quando Usar `public`

1. **Classes de Modelo de Domínio** (DTOs, Entities):
   ```java
   public class Usuario { }
   ```

2. **Serviços e APIs**:
   ```java
   public class UsuarioService { }
   ```

3. **Interfaces e Contratos**:
   ```java
   public interface Repository { }
   ```

4. **Enums Compartilhados**:
   ```java
   public enum Status { }
   ```

5. **Constantes Globais**:
   ```java
   public static final String VERSAO = "1.0";
   ```

6. **Métodos Utilitários Estáticos**:
   ```java
   public static int max(int a, int b) { }
   ```

7. **Getters/Setters**:
   ```java
   public String getNome() { }
   ```

8. **Construtores para Instanciação Externa**:
   ```java
   public Usuario(String nome) { }
   ```

9. **Método `main`**:
   ```java
   public static void main(String[] args) { }
   ```

### Quando NÃO Usar `public`

1. **Implementações Internas** → use default ou `private`
2. **Métodos Auxiliares** → use `private`
3. **Atributos de Instância** → use `private` (expor via getters/setters)
4. **Classes Internas de Implementação** → use default
5. **Construtores em Singleton** → use `private`

---

## Armadilhas Comuns

### 1. Expor Atributos Diretamente (Quebra Encapsulamento)

```java
// EVITAR
public class Produto {
    public String nome;  // Atributo público direto
    public double preco; // Quebra encapsulamento
}

// Cliente pode fazer:
Produto p = new Produto();
p.preco = -100;  // Sem validação!

// PREFERIR
public class Produto {
    private String nome;  // Privado
    private double preco;

    public String getNome() { return nome; }

    public void setPreco(double preco) {
        if (preco < 0) throw new IllegalArgumentException();
        this.preco = preco;
    }
}
```

**Solução**: Atributos privados + getters/setters públicos com validação.

---

### 2. Múltiplas Classes Públicas no Mesmo Arquivo

```java
// Arquivo: MinhaClasse.java
public class MinhaClasse { }
public class OutraClasse { }  // ERRO: apenas uma classe pública por arquivo
```

**Solução**: Uma classe pública por arquivo, ou torne as demais default.

---

### 3. Nome da Classe Pública Diferente do Arquivo

```java
// Arquivo: MinhaClasse.java
public class OutraClasse { }  // ERRO: nome deve ser MinhaClasse
```

**Solução**: Nome da classe pública = nome do arquivo.

---

### 4. Retornar Referências Mutáveis Sem Cópia Defensiva

```java
public class Agenda {
    private List<String> contatos = new ArrayList<>();

    // PROBLEMA: retorna referência interna
    public List<String> getContatos() {
        return contatos;  // Cliente pode modificar!
    }
}

// Cliente:
Agenda agenda = new Agenda();
agenda.getContatos().clear();  // Quebra encapsulamento!

// SOLUÇÃO: Cópia defensiva
public List<String> getContatos() {
    return new ArrayList<>(contatos);  // Cópia
}

// Ou lista imutável (Java 10+)
public List<String> getContatos() {
    return List.copyOf(contatos);  // Imutável
}
```

---

### 5. APIs Públicas Mal Projetadas (Difíceis de Mudar)

```java
// API pública expõe implementação
public class Cache {
    public HashMap<String, Object> dados = new HashMap<>();  // Implementação exposta
}

// Problema: Se mudar para ConcurrentHashMap, quebra código cliente

// SOLUÇÃO: Expor interface abstrata
public class Cache {
    private Map<String, Object> dados = new HashMap<>();

    public Object get(String key) {
        return dados.get(key);
    }

    public void put(String key, Object value) {
        dados.put(key, value);
    }
}
```

---

## Boas Práticas

### 1. Minimize a API Pública

Exponha apenas o necessário. Comece com `private`, torne `public` apenas quando necessário.

```java
public class Servico {
    // API pública mínima
    public void executar() {
        preparar();  // private
        processar(); // private
        finalizar(); // private
    }

    // Implementação privada
    private void preparar() { }
    private void processar() { }
    private void finalizar() { }
}
```

---

### 2. Atributos Privados, Acesso Público Controlado

```java
public class Conta {
    private double saldo;  // Privado

    public double getSaldo() {  // Getter público
        return saldo;
    }

    public void depositar(double valor) {  // Método público com validação
        if (valor <= 0) throw new IllegalArgumentException();
        saldo += valor;
    }
}
```

---

### 3. Constantes Públicas para Valores Compartilhados

```java
public class Config {
    public static final String VERSAO = "1.0.0";
    public static final int TIMEOUT = 30000;

    private Config() { }  // Impede instanciação
}
```

---

### 4. Interfaces Públicas para Contratos

```java
public interface UserRepository {
    User findById(int id);
    List<User> findAll();
    void save(User user);
}
```

---

### 5. Enums Públicos para Estados e Tipos

```java
public enum TipoUsuario {
    ADMIN, MODERADOR, USUARIO
}
```

---

### 6. Métodos Utilitários Estáticos Públicos

```java
public final class StringUtils {
    private StringUtils() { }

    public static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
}
```

---

### 7. Cópia Defensiva em Getters de Coleções

```java
private List<String> itens = new ArrayList<>();

public List<String> getItens() {
    return new ArrayList<>(itens);  // Cópia
}

// Ou imutável
public List<String> getItens() {
    return Collections.unmodifiableList(itens);
}
```

---

### 8. Documente API Pública com Javadoc

```java
/**
 * Calcula o fatorial de um número.
 *
 * @param n número inteiro não-negativo
 * @return fatorial de n
 * @throws IllegalArgumentException se n < 0
 */
public static long fatorial(int n) {
    if (n < 0) throw new IllegalArgumentException("n deve ser >= 0");
    if (n == 0 || n == 1) return 1;
    return n * fatorial(n - 1);
}
```

---

### 9. Use Interfaces Públicas, Implementações Package-Private

```java
// API pública
public interface UserService {
    void createUser(String name);
}

// Implementação interna (default)
class UserServiceImpl implements UserService {
    @Override
    public void createUser(String name) {
        // Implementação
    }
}

// Factory público
public class ServiceFactory {
    public static UserService getUserService() {
        return new UserServiceImpl();
    }
}
```

---

### 10. Revise API Pública ao Refatorar

Mudanças em membros `public` afetam código cliente. Mantenha compatibilidade ou versione adequadamente.

---

## Resumo Executivo

O modificador **`public`** oferece **acesso irrestrito** de qualquer lugar:

**Visibilidade**:
- ✅ Própria classe
- ✅ Classes do mesmo pacote
- ✅ Subclasses de qualquer pacote
- ✅ **Qualquer classe de qualquer pacote**

**Características**:
- **Mais permissivo** dos modificadores
- Define **API pública** da classe
- **Sem restrições** de localização
- **Visibilidade máxima**
- **Interface de comunicação** entre componentes

**Aplicações**:
1. **Classes de modelo** (DTOs, Entities)
2. **Serviços e APIs**
3. **Interfaces e contratos**
4. **Enums compartilhados**
5. **Constantes globais** (`public static final`)
6. **Métodos utilitários estáticos**
7. **Getters/Setters** (encapsulamento controlado)
8. **Construtores** (instanciação pública)
9. **Método `main`** (ponto de entrada)

**Regras Especiais**:
- **Uma classe pública** por arquivo `.java`
- **Nome da classe pública** = nome do arquivo
- **Método `main`**: `public static void main(String[] args)`
- **Membros de interface**: implicitamente `public` (exceto métodos privados Java 9+)

**Níveis de Visibilidade**:
**private** < **default** < **protected** < **public** (crescente)

**Boas Práticas**:
- **Minimize API pública** (exponha apenas o necessário)
- **Atributos privados**, acesso público via getters/setters
- **Constantes públicas** (`public static final`)
- **Interfaces públicas** para contratos
- **Enums públicos** para estados/tipos
- **Cópia defensiva** em getters de coleções
- **Documente** API pública com Javadoc
- **Use interfaces públicas**, implementações package-private
- **Revise impacto** ao mudar API pública

**Armadilhas**:
- Expor atributos diretamente (quebra encapsulamento)
- Múltiplas classes públicas no mesmo arquivo
- Nome da classe ≠ nome do arquivo
- Retornar referências mutáveis sem cópia defensiva
- APIs mal projetadas (difíceis de mudar depois)

**Quando Usar**:
- API pública de classes e serviços
- Contratos (interfaces)
- Constantes globais
- Métodos utilitários
- Getters/Setters

**Quando NÃO Usar**:
- Implementações internas → default/private
- Métodos auxiliares → private
- Atributos de instância → private
- Classes internas → default
- Construtores de Singleton → private

**Regra de Ouro**: **Minimize** a API pública. Exponha apenas o que é **absolutamente necessário** para uso externo. Tudo mais deve ser **privado** ou **package-private** para manter flexibilidade e encapsulamento.
