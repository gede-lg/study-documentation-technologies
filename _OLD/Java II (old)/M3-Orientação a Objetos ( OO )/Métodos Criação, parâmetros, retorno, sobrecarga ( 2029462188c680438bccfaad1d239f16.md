# Métodos: Criação, parâmetros, retorno, sobrecarga (overloading)

**1. Introdução**
Este tópico trata de **métodos em Java** — blocos de código nomeados que executam tarefas específicas. Métodos são pilares da **modularidade**, permitindo dividir a lógica em unidades reutilizáveis. Aqui vamos ver:

- **Tema principal**: Métodos – definição, estrutura e papel no código.
- **Subtemas**:
    - Criação e assinatura de métodos
    - Parâmetros de entrada
    - Valor de retorno
    - Sobrecarga (overloading)

Entender métodos é vital para escrever código legível, testável e manutenível, tanto em projetos pequenos quanto em sistemas corporativos.

---

**2. Sumário**

1. Métodos em Java
1.1. Estrutura e sintaxe
1.2. Parâmetros
1.3. Valor de retorno
1.4. Sobrecarga (Overloading)
2. Restrições de uso
3. Exemplos de Código Otimizados
4. Informações Adicionais
5. Referências para Estudo Independente

---

**3. Conteúdo Detalhado**

### 3.1 Estrutura e sintaxe

Um método Java tem a forma:

```java
[modificadores] TipoRetorno nomeDoMetodo([Tipo1 param1, Tipo2 param2, ...]) {
    // corpo do método
}

```

- **Modificadores**: `public`, `private`, `static`, etc.
- **TipoRetorno**: tipo de dado que o método devolve; use `void` se não retornar nada.
- **nomeDoMetodo**: identiﬁcador seguindo convenções camelCase.
- **parâmetros**: lista separada por vírgulas; pode ser vazia.

### 3.2 Parâmetros

- **Passagem por valor**: Java sempre copia o valor da referência ou do primitivo.
- **Tipos**: primitivos (`int`, `double`…) ou objetos (`String`, `List<String>`…).
- **Varargs**: permite um número variável de argumentos:
    
    ```java
    public void log(String... messages) { /* ... */ }
    
    ```
    

### 3.3 Valor de retorno

- O método termina com `return expressão;`.
- Em métodos `void`, `return;` pode encerrar a execução antecipadamente.
- O tipo da expressão deve ser compatível com `TipoRetorno`.

### 3.4 Sobrecarga (Overloading)

- **Definição**: múltiplos métodos com **mesmo nome** mas assinaturas (lista/tipo de parâmetros) diferentes.
- **Regras**:
    - Assinaturas devem diferir em tipo e/ou número de parâmetros.
    - Modificadores e tipo de retorno **não** contribuem para diferenciar.
- **Resolução**: em tempo de compilação, o Java escolhe o método cujo perfil de parâmetros melhor corresponde à chamada.

---

**4. Restrições de uso**

- Não é possível sobrecarregar apenas pelo tipo de retorno.
- Varargs (`T...`) e array (`T[]`) conflitam se assinaturas forem ambíguas.
- Sobrescrever um método (override) requer mesma assinatura e compatibilidade de tipo de retorno.

---

**5. Exemplos de Código Otimizados**

```java
public class Calculadora {

    // 1. Método simples sem parâmetros, sem retorno
    public void imprimirBoasVindas() {
        System.out.println("Bem-vindo à Calculadora!");
    }

    // 2. Método com parâmetros e retorno
    public int somar(int a, int b) {
        return a + b;
    }

    // 3. Sobrecarga: mesma operação 'somar' mas com tipos diferentes
    public double somar(double a, double b) {
        return a + b;
    }

    // 4. Sobrecarga: somar vários números usando varargs
    public int somar(int... valores) {
        int total = 0;
        for (int v : valores) {
            total += v;
        }
        return total;
    }

    // 5. Método com validação e retorno antecipado
    public String formatarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            return "Nome inválido";
        }
        // Capitaliza primeira letra
        return nome.substring(0,1).toUpperCase()
             + nome.substring(1).toLowerCase();
    }
}

```

> Boas práticas:
> 
> - Nomes significativos.
> - Métodos curtos (máx. \~20 linhas).
> - Validar parâmetros e retornar cedo em caso de erro.
> - Comentar apenas o “porquê”, não o “o quê” (que deve ser claro pelo nome).

---

**6. Informações Adicionais**

- **Overloading vs. Overriding**:
    - *Overloading*: mesma classe, mesmo nome, diferentes parâmetros.
    - *Overriding*: classe filha redefine método da superclasse com mesma assinatura.
- **Métodos genéricos**: podem ter parâmetros de tipo `<T>`; úteis para reuso.
    
    ```java
    public <T> List<T> criarLista(T... elementos) {
        return Arrays.asList(elementos);
    }
    
    ```
    

---

**7. Referências para Estudo Independente**

- Oracle Java Tutorials – Methods:
[https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html)
- Java Language Specification, §8 (Methods):
[https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html)
- Baeldung – Guide to Java Method Overloading and Overriding:
[https://www.baeldung.com/java-method-overloading-overriding](https://www.baeldung.com/java-method-overloading-overriding)
- *Effective Java* (Joshua Bloch) – Capítulo sobre métodos e design de APIs.