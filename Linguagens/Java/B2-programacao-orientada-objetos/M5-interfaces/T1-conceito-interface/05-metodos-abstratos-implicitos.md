# T1.05 - Métodos Abstratos Implícitos

## Introdução

**Métodos em interface**: são **public abstract** implícito (não precisa declarar).

```java
public interface Calculadora {
    // Todos são public abstract implícitos:
    double somar(double a, double b);
    double subtrair(double a, double b);
    double multiplicar(double a, double b);
    double dividir(double a, double b);
}

// Equivalente a:
public interface Calculadora {
    public abstract double somar(double a, double b);
    public abstract double subtrair(double a, double b);
    public abstract double multiplicar(double a, double b);
    public abstract double dividir(double a, double b);
}
```

**Implícito**: compilador adiciona automaticamente.

**Benefícios**:
- **Código mais limpo** (menos verbosidade)
- **Convenção clara** (todos sabem que é public abstract)
- **Evita redundância**

**Importante**: métodos **default**, **static** e **private** (Java 8+/9+) **não são** abstratos.

---

## Fundamentos

### 1. Public Implícito

Métodos de interface são **public** implícito.

```java
public interface Exemplo {
    // Sem modificador = public
    void metodo1();
    
    // Explicitamente public (redundante)
    public void metodo2();
}

// Implementação: deve ser public
public class Implementacao implements Exemplo {
    @Override
    public void metodo1() { } // Deve ser public
    
    @Override
    public void metodo2() { }
}
```

### 2. Abstract Implícito

Métodos de interface são **abstract** implícito.

```java
public interface Exemplo {
    // Sem corpo = abstract
    void metodo();
    
    // Explicitamente abstract (redundante)
    abstract void metodoAbstrato();
}

// Compilador trata como:
public interface Exemplo {
    public abstract void metodo();
    public abstract void metodoAbstrato();
}
```

### 3. Modificadores Proibidos

**protected** e **private** proibidos em métodos abstratos.

```java
public interface Errado {
    // ❌ ERRO: modificadores inválidos
    protected void metodo1(); // ERRO
    private void metodo2();   // ERRO (exceto Java 9+ com corpo)
    
    // ✅ OK: public implícito
    void metodo3();
}
```

### 4. Final Proibido

Métodos abstratos **não podem** ser **final**.

```java
public interface Errado {
    // ❌ ERRO: abstract e final são incompatíveis
    final void metodo(); // ERRO
}

// Final só faz sentido em métodos concretos (default)
public interface Correto {
    default final void metodo() { } // ❌ ERRO: default não pode ser final
    
    default void metodo2() { } // OK: pode ser sobrescrito
}
```

### 5. Static Não É Abstrato

**static** precisa ter **corpo** (não pode ser abstrato).

```java
public interface Exemplo {
    // ❌ ERRO: static sem corpo
    static void metodoStaticAbstrato(); // ERRO
    
    // ✅ OK: static com corpo
    static void metodoStatic() {
        System.out.println("Método static");
    }
}

// Uso: via nome da interface
Exemplo.metodoStatic();
```

### 6. Default Não É Abstrato

**default** tem **corpo** (não é abstrato).

```java
public interface Exemplo {
    // Abstrato (sem corpo)
    void metodoAbstrato();
    
    // Default (com corpo, não abstrato)
    default void metodoDefault() {
        System.out.println("Implementação padrão");
    }
}

public class Implementacao implements Exemplo {
    @Override
    public void metodoAbstrato() { } // Obrigatório implementar
    
    // metodoDefault() opcional (herdado)
}
```

### 7. Private com Corpo (Java 9+)

**private** precisa ter **corpo** (não pode ser abstrato).

```java
public interface Exemplo {
    default void metodoPublico() {
        metodoPrivado(); // Usar private
    }
    
    // Private com corpo (não abstrato)
    private void metodoPrivado() {
        System.out.println("Método privado");
    }
    
    // ❌ ERRO: private sem corpo
    // private void metodoPrivadoAbstrato(); // ERRO
}
```

### 8. Implementação Obrigatória

Métodos abstratos **devem ser implementados** por classe concreta.

```java
public interface Repositorio {
    void salvar(Object obj); // Abstrato
    Object buscar(int id);   // Abstrato
}

// ❌ ERRO: não implementa todos os métodos
// public class RepositorioImpl implements Repositorio {
//     @Override
//     public void salvar(Object obj) { }
//     // buscar() não implementado
// }

// ✅ OK: implementa todos
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

### 9. Classe Abstrata para Implementação Parcial

**Classe abstrata** pode implementar interface parcialmente.

```java
public interface Completo {
    void metodo1();
    void metodo2();
    void metodo3();
}

// Classe abstrata: implementação parcial OK
public abstract class ParcialAbstrato implements Completo {
    @Override
    public void metodo1() {
        System.out.println("Método 1");
    }
    
    // metodo2() e metodo3() ainda abstratos
}

// Subclasse concreta: deve implementar restante
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

### 10. Override Annotation

**@Override**: recomendado ao implementar métodos abstratos.

```java
public interface Repositorio {
    void salvar(Object obj);
}

public class RepositorioImpl implements Repositorio {
    @Override // Recomendado
    public void salvar(Object obj) {
        System.out.println("Salvando");
    }
}
```

---

## Aplicabilidade

**Métodos abstratos implícitos**:
- **Definem contrato** (comportamento obrigatório)
- **Sem implementação** (cada classe implementa)
- **Public por padrão** (acessível externamente)
- **Abstract por padrão** (sem corpo)

**Quando usar**:
- Definir **comportamento obrigatório**
- **Múltiplas implementações** possíveis
- **Polimorfismo**

---

## Armadilhas

### 1. Protected ou Private em Métodos Abstratos

```java
public interface Errado {
    // ❌ ERRO: protected inválido
    protected void metodo1(); // ERRO
    
    // ❌ ERRO: private sem corpo
    private void metodo2(); // ERRO
}

// ✅ Public implícito
public interface Correto {
    void metodo(); // public abstract implícito
}
```

### 2. Final em Método Abstrato

```java
public interface Errado {
    // ❌ ERRO: abstract e final incompatíveis
    final void metodo(); // ERRO
}
```

### 3. Static Sem Corpo

```java
public interface Errado {
    // ❌ ERRO: static precisa de corpo
    static void metodo(); // ERRO
}

// ✅ Static com corpo
public interface Correto {
    static void metodo() {
        System.out.println("Static");
    }
}
```

### 4. Default Sem Corpo

```java
public interface Errado {
    // ❌ ERRO: default precisa de corpo
    default void metodo(); // ERRO
}

// ✅ Default com corpo
public interface Correto {
    default void metodo() {
        System.out.println("Default");
    }
}
```

### 5. Implementação Parcial em Classe Concreta

```java
public interface Completo {
    void metodo1();
    void metodo2();
}

// ❌ ERRO: classe concreta deve implementar todos
// public class Parcial implements Completo {
//     @Override
//     public void metodo1() { }
//     // metodo2() não implementado
// }

// ✅ Classe abstrata para implementação parcial
public abstract class ParcialAbstrato implements Completo {
    @Override
    public void metodo1() { }
}
```

### 6. Modificador Redundante

```java
// ❌ Redundante (já é public abstract implícito)
public interface Redundante {
    public abstract void metodo();
}

// ✅ Limpo
public interface Limpo {
    void metodo(); // public abstract implícito
}
```

### 7. Implementação Sem @Override

```java
public interface Repositorio {
    void salvar(Object obj);
}

// ⚠️ Funciona, mas não recomendado
public class RepositorioImpl implements Repositorio {
    public void salvar(Object obj) { } // Sem @Override
}

// ✅ Recomendado
public class RepositorioImpl2 implements Repositorio {
    @Override
    public void salvar(Object obj) { } // Com @Override
}
```

---

## Boas Práticas

### 1. Omitir Modificadores Redundantes

```java
// ❌ Redundante
public interface Redundante {
    public abstract void metodo1();
    public abstract void metodo2();
}

// ✅ Limpo (implícito)
public interface Limpo {
    void metodo1();
    void metodo2();
}
```

### 2. Usar @Override

```java
public interface Repositorio {
    void salvar(Object obj);
}

// ✅ @Override ajuda a detectar erros
public class RepositorioImpl implements Repositorio {
    @Override
    public void salvar(Object obj) {
        System.out.println("Salvando");
    }
}
```

### 3. Documentar Métodos Abstratos

```java
public interface Repositorio {
    /**
     * Salva entidade no repositório.
     * 
     * @param obj entidade a salvar (não pode ser null)
     * @throws IllegalArgumentException se obj é null
     * @throws PersistenceException se erro ao salvar
     */
    void salvar(Object obj);
    
    /**
     * Busca entidade por ID.
     * 
     * @param id ID da entidade (deve ser > 0)
     * @return entidade encontrada ou null se não existe
     * @throws IllegalArgumentException se id <= 0
     */
    Object buscar(int id);
}
```

### 4. Métodos Default para Evolução

```java
public interface Repositorio {
    // Métodos abstratos (obrigatórios)
    void salvar(Object obj);
    Object buscar(int id);
    
    // Método default (opcional, não quebra implementações antigas)
    default void atualizar(Object obj) {
        System.out.println("Atualização padrão");
    }
}

// Implementação antiga: continua funcionando
public class RepositorioAntigo implements Repositorio {
    @Override
    public void salvar(Object obj) { }
    
    @Override
    public Object buscar(int id) { return null; }
    
    // atualizar() herdado (não precisa implementar)
}
```

### 5. Métodos Static para Utilitários

```java
public interface Matematica {
    // Métodos abstratos
    double calcular(double a, double b);
    
    // Métodos static (utilitários)
    static int somar(int a, int b) {
        return a + b;
    }
    
    static int subtrair(int a, int b) {
        return a - b;
    }
}

// Uso: sem instância
int resultado = Matematica.somar(5, 3);
```

### 6. Classe Abstrata para Template

```java
public interface Processador {
    void processar();
}

// Classe abstrata: implementação parcial + template method
public abstract class ProcessadorTemplate implements Processador {
    @Override
    public final void processar() { // Template method
        antes();
        executar(); // Abstrato
        depois();
    }
    
    protected void antes() {
        System.out.println("Antes");
    }
    
    protected abstract void executar(); // Para subclasses
    
    protected void depois() {
        System.out.println("Depois");
    }
}

public class ProcessadorConcreto extends ProcessadorTemplate {
    @Override
    protected void executar() {
        System.out.println("Executando");
    }
}
```

### 7. Interface Funcional

```java
@FunctionalInterface
public interface Converter<F, T> {
    T converter(F from); // Um método abstrato
    
    // Pode ter default/static
    default T converterSafe(F from) {
        if (from == null) return null;
        return converter(from);
    }
}

// Uso com lambda
Converter<String, Integer> converter = Integer::parseInt;
Integer numero = converter.converter("123");
```

### 8. Segregação de Interfaces

```java
// ✅ Interfaces pequenas (ISP)
public interface Leitura {
    Object ler();
}

public interface Escrita {
    void escrever(Object obj);
}

public interface Fechavel {
    void fechar();
}

// Implementações combinam conforme necessário
public class ArquivoLeitura implements Leitura, Fechavel {
    @Override
    public Object ler() { return null; }
    
    @Override
    public void fechar() { }
}

public class ArquivoEscrita implements Escrita, Fechavel {
    @Override
    public void escrever(Object obj) { }
    
    @Override
    public void fechar() { }
}
```

### 9. Generics em Interface

```java
public interface Repositorio<T> {
    void salvar(T entidade);
    T buscar(int id);
    List<T> buscarTodos();
}

public class UsuarioRepositorio implements Repositorio<Usuario> {
    @Override
    public void salvar(Usuario entidade) {
        System.out.println("Salvando usuário");
    }
    
    @Override
    public Usuario buscar(int id) {
        return new Usuario();
    }
    
    @Override
    public List<Usuario> buscarTodos() {
        return new ArrayList<>();
    }
}
```

### 10. Métodos Private para Reutilização (Java 9+)

```java
public interface Calculadora {
    default double calcularMedia(List<Double> valores) {
        validar(valores);
        double soma = valores.stream().mapToDouble(Double::doubleValue).sum();
        return soma / valores.size();
    }
    
    default double calcularSoma(List<Double> valores) {
        validar(valores);
        return valores.stream().mapToDouble(Double::doubleValue).sum();
    }
    
    // Private: reutilização interna
    private void validar(List<Double> valores) {
        if (valores == null || valores.isEmpty()) {
            throw new IllegalArgumentException("Lista vazia");
        }
    }
}
```

---

## Resumo

**Métodos em interface**: **public abstract** implícito.

```java
public interface Exemplo {
    void metodo(); // public abstract implícito
}

// Equivalente a:
public interface Exemplo {
    public abstract void metodo();
}
```

**Public implícito**:
```java
void metodo(); // public
```

**Abstract implícito**:
```java
void metodo(); // abstract (sem corpo)
```

**Modificadores proibidos**:
- ❌ **protected**: inválido
- ❌ **private**: sem corpo (exceto Java 9+ com corpo)
- ❌ **final**: incompatível com abstract

**Static**: precisa de corpo.
```java
static void metodo() { // OK: com corpo
    System.out.println("Static");
}
```

**Default**: precisa de corpo.
```java
default void metodo() { // OK: com corpo
    System.out.println("Default");
}
```

**Private** (Java 9+): precisa de corpo.
```java
private void metodo() { // OK: com corpo
    System.out.println("Private");
}
```

**Implementação obrigatória**:
```java
public class Impl implements Repositorio {
    @Override
    public void salvar(Object obj) { } // Obrigatório
}
```

**Classe abstrata**: implementação parcial OK.
```java
public abstract class Parcial implements Completo {
    @Override
    public void metodo1() { }
    // metodo2() ainda abstrato
}
```

**@Override**: recomendado.
```java
@Override
public void metodo() { }
```

**Boas práticas**:
- Omitir modificadores redundantes (public abstract)
- Usar @Override
- Documentar contrato (Javadoc)
- Default methods para evolução
- Static methods para utilitários
- Private methods para reutilização (Java 9+)

**Modificadores válidos**:

| Tipo | Public | Abstract | Default | Static | Private |
|------|--------|----------|---------|--------|---------|
| **Abstrato** | Implícito | Implícito | ❌ | ❌ | ❌ |
| **Default** | Implícito | ❌ | ✅ | ❌ | ❌ |
| **Static** | Implícito | ❌ | ❌ | ✅ | ❌ |
| **Private** (Java 9+) | ❌ | ❌ | ❌ | ❌ | ✅ |

**Regra de Ouro**: Métodos em interface são **public abstract** implícito (não precisa declarar). **Omita modificadores redundantes** para código mais limpo. Use **@Override** ao implementar. **Default**, **static** e **private** **não são abstratos** (precisam de corpo). Documente **contratos** claramente.
