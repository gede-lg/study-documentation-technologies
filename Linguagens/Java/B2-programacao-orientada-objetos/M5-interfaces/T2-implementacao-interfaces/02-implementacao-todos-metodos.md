# T2.02 - Implementação de Todos os Métodos Abstratos

## Introdução

**Classe concreta**: deve implementar **todos** métodos abstratos da interface.

```java
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
    void deletar(int id);
}

// ❌ ERRO: não implementa todos
// public class Parcial implements Repositorio {
//     @Override
//     public void salvar(Object obj) { }
//     // buscar() e deletar() não implementados - ERRO
// }

// ✅ Implementa todos
public class Completo implements Repositorio {
    @Override
    public void salvar(Object obj) {
        System.out.println("Salvando");
    }
    
    @Override
    public Object buscar(int id) {
        return null;
    }
    
    @Override
    public void deletar(int id) {
        System.out.println("Deletando");
    }
}
```

**Obrigação**: classe **concreta** implementa **100%** dos métodos abstratos.

**Exceção**: classe **abstrata** pode implementar **parcialmente**.

---

## Fundamentos

### 1. Todos os Métodos Obrigatórios

Classe concreta: **todos** métodos abstratos.

```java
public interface Calculadora {
    double somar(double a, double b);
    double subtrair(double a, double b);
    double multiplicar(double a, double b);
    double dividir(double a, double b);
}

// ✅ Implementa todos (obrigatório)
public class CalculadoraImpl implements Calculadora {
    @Override
    public double somar(double a, double b) {
        return a + b;
    }
    
    @Override
    public double subtrair(double a, double b) {
        return a - b;
    }
    
    @Override
    public double multiplicar(double a, double b) {
        return a * b;
    }
    
    @Override
    public double dividir(double a, double b) {
        if (b == 0) throw new ArithmeticException("Divisão por zero");
        return a / b;
    }
}
```

### 2. Interface com Herança

Interface que **extends** outra: implementar **ambas**.

```java
public interface Animal {
    void comer();
    void dormir();
}

public interface Mamifero extends Animal {
    void amamentar();
}

// Implementa Mamifero (que extends Animal)
public class Cachorro implements Mamifero {
    @Override
    public void comer() { // De Animal
        System.out.println("Cachorro comendo");
    }
    
    @Override
    public void dormir() { // De Animal
        System.out.println("Cachorro dormindo");
    }
    
    @Override
    public void amamentar() { // De Mamifero
        System.out.println("Cachorro amamentando");
    }
}
```

### 3. Múltiplas Interfaces

Implementar **todos** métodos de **todas** interfaces.

```java
public interface Voador {
    void voar();
    void pousar();
}

public interface Nadador {
    void nadar();
    void mergulhar();
}

// Implementa ambas
public class Pato implements Voador, Nadador {
    @Override
    public void voar() {
        System.out.println("Pato voando");
    }
    
    @Override
    public void pousar() {
        System.out.println("Pato pousando");
    }
    
    @Override
    public void nadar() {
        System.out.println("Pato nadando");
    }
    
    @Override
    public void mergulhar() {
        System.out.println("Pato mergulhando");
    }
}
```

### 4. @Override Detecta Erros

**@Override**: garante que método sobrescreve/implementa.

```java
public interface Repositorio {
    void salvar(Object obj);
}

// ⚠️ Sem @Override: erro não detectado
public class Sem implements Repositorio {
    // ❌ Erro de digitação não detectado
    public void sallvar(Object obj) { } // Método diferente (erro)
}

// ✅ Com @Override: erro detectado
public class Com implements Repositorio {
    @Override
    public void salvar(Object obj) { } // OK
    
    // @Override
    // public void sallvar(Object obj) { } // ERRO: não sobrescreve nada
}
```

### 5. Visibilidade Public Obrigatória

Métodos implementados: **public** obrigatório.

```java
public interface Exemplo {
    void metodo(); // public abstract implícito
}

// ❌ ERRO: visibilidade reduzida
// public class Errado implements Exemplo {
//     @Override
//     void metodo() { } // package-private (erro)
// }

// ✅ Public obrigatório
public class Correto implements Exemplo {
    @Override
    public void metodo() { } // public
}
```

### 6. Assinatura Idêntica

Assinatura deve ser **idêntica** (nome, parâmetros, tipo retorno).

```java
public interface Calculadora {
    double calcular(double a, double b);
}

// ❌ ERRO: tipo retorno diferente
// public class Errado implements Calculadora {
//     @Override
//     public int calcular(double a, double b) { // int != double (erro)
//         return 0;
//     }
// }

// ❌ ERRO: parâmetros diferentes
// public class Errado2 implements Calculadora {
//     @Override
//     public double calcular(int a, int b) { // int != double (erro)
//         return 0;
//     }
// }

// ✅ Assinatura idêntica
public class Correto implements Calculadora {
    @Override
    public double calcular(double a, double b) { // Idêntico
        return a + b;
    }
}
```

### 7. Exceções Checked

Implementação: **não pode adicionar** exceções checked.

```java
public interface Repositorio {
    void salvar(Object obj); // Sem throws
}

// ❌ ERRO: adiciona exceção checked
// public class Errado implements Repositorio {
//     @Override
//     public void salvar(Object obj) throws IOException { // ERRO
//     }
// }

// ✅ Sem exceção checked
public class Correto1 implements Repositorio {
    @Override
    public void salvar(Object obj) { // OK
    }
}

// ✅ Exceção unchecked OK
public class Correto2 implements Repositorio {
    @Override
    public void salvar(Object obj) throws RuntimeException { // OK
    }
}
```

### 8. Exceções Checked na Interface

Interface declara **throws**: implementação **pode omitir**.

```java
public interface Repositorio {
    void salvar(Object obj) throws IOException;
}

// ✅ Implementação pode omitir throws
public class Impl1 implements Repositorio {
    @Override
    public void salvar(Object obj) { // Omite throws (OK)
        System.out.println("Salvando");
    }
}

// ✅ Implementação pode manter throws
public class Impl2 implements Repositorio {
    @Override
    public void salvar(Object obj) throws IOException { // Mantém throws (OK)
        throw new IOException("Erro ao salvar");
    }
}
```

### 9. Métodos Default Não Obrigatórios

**default**: não precisa implementar (herdado).

```java
public interface Logger {
    // Abstrato (obrigatório)
    void log(String mensagem);
    
    // Default (opcional)
    default void logError(String mensagem) {
        log("ERRO: " + mensagem);
    }
    
    default void logInfo(String mensagem) {
        log("INFO: " + mensagem);
    }
}

// Implementa apenas abstrato
public class ConsoleLogger implements Logger {
    @Override
    public void log(String mensagem) {
        System.out.println(mensagem);
    }
    
    // logError() e logInfo() herdados (não precisa implementar)
}

// Uso
Logger logger = new ConsoleLogger();
logger.log("Debug"); // Debug
logger.logError("Falha"); // ERRO: Falha (herdado)
```

### 10. Sobrescrever Métodos Default

**default**: pode ser sobrescrito (opcional).

```java
public interface Logger {
    void log(String mensagem);
    
    default void logError(String mensagem) {
        log("ERRO: " + mensagem);
    }
}

// Sobrescreve default
public class CustomLogger implements Logger {
    @Override
    public void log(String mensagem) {
        System.out.println(mensagem);
    }
    
    @Override
    public void logError(String mensagem) {
        // Sobrescreve default
        System.err.println(">>> ERRO: " + mensagem);
    }
}

// Uso
Logger logger = new CustomLogger();
logger.logError("Falha"); // >>> ERRO: Falha (sobrescrito)
```

---

## Aplicabilidade

**Implementação de todos os métodos**:
- **Classe concreta**: obrigatório implementar **100%**
- **Classe abstrata**: pode implementar **parcialmente**
- **Métodos default**: não obrigatórios (herdados)

**Benefícios**:
- **Contrato garantido** (comportamento obrigatório)
- **@Override** detecta erros
- **Polimorfismo** (referência por interface)

---

## Armadilhas

### 1. Não Implementar Todos

```java
public interface Completo {
    void metodo1();
    void metodo2();
    void metodo3();
}

// ❌ ERRO: classe concreta não implementa todos
// public class Parcial implements Completo {
//     @Override
//     public void metodo1() { }
//     // metodo2() e metodo3() não implementados - ERRO
// }

// ✅ Implementa todos
public class Total implements Completo {
    @Override
    public void metodo1() { }
    
    @Override
    public void metodo2() { }
    
    @Override
    public void metodo3() { }
}
```

### 2. Esquecer Interface Herdada

```java
public interface Animal {
    void comer();
}

public interface Mamifero extends Animal {
    void amamentar();
}

// ❌ ERRO: esquece comer() de Animal
// public class Cachorro implements Mamifero {
//     @Override
//     public void amamentar() { }
//     // comer() não implementado - ERRO
// }

// ✅ Implementa de ambas
public class Cachorro implements Mamifero {
    @Override
    public void comer() { } // De Animal
    
    @Override
    public void amamentar() { } // De Mamifero
}
```

### 3. Visibilidade Reduzida

```java
public interface Exemplo {
    void metodo();
}

// ❌ ERRO: reduz visibilidade
// public class Errado implements Exemplo {
//     @Override
//     void metodo() { } // package-private (erro)
// }

// ✅ Public obrigatório
public class Correto implements Exemplo {
    @Override
    public void metodo() { }
}
```

### 4. Assinatura Diferente

```java
public interface Calculadora {
    double calcular(double a, double b);
}

// ❌ ERRO: tipo retorno diferente
// public class Errado implements Calculadora {
//     @Override
//     public int calcular(double a, double b) { // int != double (erro)
//         return 0;
//     }
// }

// ✅ Assinatura idêntica
public class Correto implements Calculadora {
    @Override
    public double calcular(double a, double b) {
        return a + b;
    }
}
```

### 5. Adicionar Exceção Checked

```java
public interface Repositorio {
    void salvar(Object obj);
}

// ❌ ERRO: adiciona exceção checked
// public class Errado implements Repositorio {
//     @Override
//     public void salvar(Object obj) throws IOException { // ERRO
//     }
// }

// ✅ Sem exceção checked
public class Correto implements Repositorio {
    @Override
    public void salvar(Object obj) {
    }
}
```

### 6. Sem @Override

```java
public interface Repositorio {
    void salvar(Object obj);
}

// ⚠️ Funciona, mas perigoso
public class Sem implements Repositorio {
    public void salvar(Object obj) { } // Sem @Override
    
    // Erro de digitação não detectado
    public void sallvar(Object obj) { } // Método extra (erro)
}

// ✅ @Override detecta erros
public class Com implements Repositorio {
    @Override
    public void salvar(Object obj) { }
}
```

### 7. Esquecer Múltiplas Interfaces

```java
public interface Interface1 {
    void metodo1();
}

public interface Interface2 {
    void metodo2();
}

// ❌ ERRO: esquece metodo2() de Interface2
// public class Errado implements Interface1, Interface2 {
//     @Override
//     public void metodo1() { }
//     // metodo2() não implementado - ERRO
// }

// ✅ Implementa de ambas
public class Correto implements Interface1, Interface2 {
    @Override
    public void metodo1() { }
    
    @Override
    public void metodo2() { }
}
```

---

## Boas Práticas

### 1. @Override Sempre

```java
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
}

// ✅ @Override em todos
public class RepositorioImpl implements Repositorio {
    @Override
    public void salvar(Object obj) {
        System.out.println("Salvando");
    }
    
    @Override
    public Object buscar(int id) {
        return null;
    }
}
```

### 2. Documentar Implementações

```java
public interface Repositorio {
    /**
     * Salva entidade no repositório.
     */
    void salvar(Object obj);
}

/**
 * Implementação em memória de {@link Repositorio}.
 */
public class RepositorioMemoria implements Repositorio {
    private final Map<Integer, Object> dados = new HashMap<>();
    
    /**
     * {@inheritDoc}
     * 
     * <p>Implementação: armazena em Map interno.
     */
    @Override
    public void salvar(Object obj) {
        dados.put(obj.hashCode(), obj);
    }
}
```

### 3. Classe Abstrata para Implementação Parcial

```java
public interface Completo {
    void metodo1();
    void metodo2();
    void metodo3();
}

// ✅ Classe abstrata: implementação parcial
public abstract class ParcialAbstrato implements Completo {
    @Override
    public void metodo1() {
        System.out.println("Método 1");
    }
    
    // metodo2() e metodo3() para subclasses
}

// Subclasse concreta: implementa restante
public class Concreto extends ParcialAbstrato {
    @Override
    public void metodo2() {
        System.out.println("Método 2");
    }
    
    @Override
    public void metodo3() {
        System.out.println("Método 3");
    }
}
```

### 4. Skeletal Implementation Pattern

```java
public interface Collection<E> {
    int size();
    boolean isEmpty();
    boolean contains(Object o);
    Iterator<E> iterator();
    boolean add(E e);
    boolean remove(Object o);
    // ... muitos outros métodos
}

// Skeletal implementation (classe abstrata)
public abstract class AbstractCollection<E> implements Collection<E> {
    // Implementa métodos comuns
    @Override
    public boolean isEmpty() {
        return size() == 0; // Usa size() abstrato
    }
    
    @Override
    public boolean contains(Object o) {
        Iterator<E> it = iterator();
        while (it.hasNext()) {
            if (o.equals(it.next())) return true;
        }
        return false;
    }
    
    // size() e iterator() abstratos (para subclasses)
    @Override
    public abstract int size();
    
    @Override
    public abstract Iterator<E> iterator();
    
    // ... outros métodos implementados
}

// Subclasse concreta: implementa apenas métodos abstratos
public class MinhaColecao<E> extends AbstractCollection<E> {
    private final List<E> list = new ArrayList<>();
    
    @Override
    public int size() {
        return list.size();
    }
    
    @Override
    public Iterator<E> iterator() {
        return list.iterator();
    }
    
    @Override
    public boolean add(E e) {
        return list.add(e);
    }
    
    // isEmpty(), contains() herdados de AbstractCollection
}
```

### 5. Template Method Pattern

```java
public interface Processador {
    void processar();
}

public abstract class ProcessadorTemplate implements Processador {
    @Override
    public final void processar() { // Template method
        validar();
        preparar();
        executar(); // Abstrato
        finalizar();
    }
    
    protected void validar() {
        System.out.println("Validando");
    }
    
    protected void preparar() {
        System.out.println("Preparando");
    }
    
    protected abstract void executar(); // Para subclasses
    
    protected void finalizar() {
        System.out.println("Finalizando");
    }
}

public class ProcessadorConcreto extends ProcessadorTemplate {
    @Override
    protected void executar() {
        System.out.println("Executando");
    }
}
```

### 6. Implementação Vazia para Adapters

```java
public interface MouseListener {
    void mouseClicked();
    void mousePressed();
    void mouseReleased();
    void mouseEntered();
    void mouseExited();
}

// Adapter: implementação vazia (facilita uso)
public class MouseAdapter implements MouseListener {
    @Override
    public void mouseClicked() { }
    
    @Override
    public void mousePressed() { }
    
    @Override
    public void mouseReleased() { }
    
    @Override
    public void mouseEntered() { }
    
    @Override
    public void mouseExited() { }
}

// Uso: sobrescreve apenas o necessário
public class MinhaClasse extends MouseAdapter {
    @Override
    public void mouseClicked() {
        System.out.println("Clicado");
    }
    
    // Outros métodos herdados (vazios)
}
```

### 7. Sobrescrever Métodos Default Quando Necessário

```java
public interface Logger {
    void log(String mensagem);
    
    default void logError(String mensagem) {
        log("ERRO: " + mensagem);
    }
}

// ✅ Sobrescreve default quando comportamento diferente
public class FileLogger implements Logger {
    @Override
    public void log(String mensagem) {
        // Escrever em arquivo
    }
    
    @Override
    public void logError(String mensagem) {
        // Comportamento diferente para erros
        log(">>> ERRO CRÍTICO: " + mensagem);
        // Enviar email
    }
}
```

### 8. Evitar Implementação Vazia Desnecessária

```java
// ❌ Implementação vazia (sem propósito)
public class Vazio implements Repositorio {
    @Override
    public void salvar(Object obj) { } // Vazio
    
    @Override
    public Object buscar(int id) { return null; } // Vazio
}

// ✅ Implementação útil
public class RepositorioMemoria implements Repositorio {
    private final Map<Integer, Object> dados = new HashMap<>();
    
    @Override
    public void salvar(Object obj) {
        dados.put(obj.hashCode(), obj);
    }
    
    @Override
    public Object buscar(int id) {
        return dados.get(id);
    }
}
```

### 9. Usar Generics para Reutilização

```java
public interface Repositorio<T> {
    void salvar(T entidade);
    T buscar(int id);
    List<T> buscarTodos();
}

public class UsuarioRepositorio implements Repositorio<Usuario> {
    private final Map<Integer, Usuario> dados = new HashMap<>();
    
    @Override
    public void salvar(Usuario entidade) {
        dados.put(entidade.getId(), entidade);
    }
    
    @Override
    public Usuario buscar(int id) {
        return dados.get(id);
    }
    
    @Override
    public List<Usuario> buscarTodos() {
        return new ArrayList<>(dados.values());
    }
}
```

### 10. Testes para Garantir Implementação Completa

```java
public interface Calculadora {
    double somar(double a, double b);
    double subtrair(double a, double b);
}

public class CalculadoraImpl implements Calculadora {
    @Override
    public double somar(double a, double b) {
        return a + b;
    }
    
    @Override
    public double subtrair(double a, double b) {
        return a - b;
    }
}

// Testes: garantem implementação correta
@Test
public void testSomar() {
    Calculadora calc = new CalculadoraImpl();
    assertEquals(5.0, calc.somar(2.0, 3.0), 0.001);
}

@Test
public void testSubtrair() {
    Calculadora calc = new CalculadoraImpl();
    assertEquals(1.0, calc.subtrair(3.0, 2.0), 0.001);
}
```

---

## Resumo

**Classe concreta**: implementa **todos** métodos abstratos.

```java
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
}

// ✅ Implementa todos
public class RepositorioImpl implements Repositorio {
    @Override
    public void salvar(Object obj) { }
    
    @Override
    public Object buscar(int id) { return null; }
}
```

**Interface com herança**:
```java
public interface Mamifero extends Animal {
    void amamentar();
}

// Implementa de ambas (Animal + Mamifero)
public class Cachorro implements Mamifero {
    @Override
    public void comer() { } // De Animal
    
    @Override
    public void amamentar() { } // De Mamifero
}
```

**Múltiplas interfaces**:
```java
public class Pato implements Voador, Nadador {
    @Override
    public void voar() { } // De Voador
    
    @Override
    public void nadar() { } // De Nadador
}
```

**@Override**: detecta erros.
```java
@Override
public void metodo() { }
```

**Visibilidade**: **public** obrigatório.
```java
@Override
public void metodo() { } // public
```

**Assinatura**: idêntica à interface.
```java
public double calcular(double a, double b) { } // Idêntico
```

**Exceções checked**: não pode adicionar.
```java
@Override
public void metodo() { } // Sem throws
```

**Métodos default**: não obrigatórios (herdados).
```java
public interface Logger {
    default void logError(String msg) { }
}

public class ConsoleLogger implements Logger {
    // logError() herdado (não precisa implementar)
}
```

**Sobrescrever default**: opcional.
```java
@Override
public void logError(String msg) {
    // Sobrescreve default
}
```

**Boas práticas**:
- **@Override** sempre
- Documentar implementações
- Classe abstrata para implementação parcial
- Skeletal Implementation pattern
- Template Method pattern
- Sobrescrever default quando necessário
- Generics para reutilização
- Testes para garantir implementação completa

**Armadilhas**:
- ❌ Não implementar todos (classe concreta)
- ❌ Esquecer interface herdada
- ❌ Visibilidade reduzida (deve ser public)
- ❌ Assinatura diferente
- ❌ Adicionar exceção checked
- ❌ Sem @Override

**Regra de Ouro**: Classe **concreta** implementa **100%** dos métodos abstratos. Classe **abstrata** pode implementar **parcialmente**. Use **@Override** sempre. Métodos devem ser **public**. Assinatura **idêntica**. Não adicione exceções **checked**. Métodos **default** não obrigatórios (herdados, mas podem ser sobrescritos).
