# ObjectInputStream

**1. Introdução**

O tema principal deste guia é o uso de **Streams de objetos** em Java, especificamente a classe `ObjectInputStream`. Trata-se de um mecanismo de I/O que permite desserializar objetos Java que foram previamente serializados em um fluxo de bytes, recuperando-os em sua forma original na memória.

- **Relevância e importância:**
    - Facilita a persistência de estados complexos de objetos (por exemplo, caches, sessões, configurações).
    - Permite comunicação de objetos entre aplicações (por exemplo, via sockets).
    - Essencial para frameworks que utilizam serialização (RMI, JPA em certos casos, caches distribuídos).
- **Definição e Concepts Fundamentais:**
    - **Tema principal:** Streams de objetos — fluxos especializados que convertem objetos Java em sequências de bytes e vice-versa.
    - **Subtemas:**
        - Serialização (`ObjectOutputStream`)
        - Desserialização (`ObjectInputStream`)
        - Controle de versão de classes (campo `serialVersionUID`)
        - Customização de processo de serialização

---

**2. Sumário**

1. [Sintaxe e Estrutura](ObjectInputStream%202039462188c68089a4f6eec7b448afa4.md)
2. [Componentes Principais](ObjectInputStream%202039462188c68089a4f6eec7b448afa4.md)
3. [Restrições de Uso](ObjectInputStream%202039462188c68089a4f6eec7b448afa4.md)
4. [Exemplos de Código Otimizados](ObjectInputStream%202039462188c68089a4f6eec7b448afa4.md)
5. [Informações Adicionais](ObjectInputStream%202039462188c68089a4f6eec7b448afa4.md)
6. [Referências para Estudo Independente](ObjectInputStream%202039462188c68089a4f6eec7b448afa4.md)

---

### 3. Conteúdo Detalhado

### Sintaxe e Estrutura

- **Instanciação básica**
    
    ```java
    try (FileInputStream fis = new FileInputStream("dados.obj");
         ObjectInputStream ois = new ObjectInputStream(fis)) {
        // leitura de objetos aqui
    }
    
    ```
    
    - O `FileInputStream` abre o arquivo de bytes.
    - O `ObjectInputStream` decorador converte o fluxo de bytes em objetos Java.
- **Método principal**
    
    ```java
    Object readObject() throws IOException, ClassNotFoundException
    
    ```
    
    - Lê o próximo objeto do fluxo, retornando-o como `Object`.

### Componentes Principais

- **`ObjectInputStream`**
    - Construtores:
        - `ObjectInputStream(InputStream in)`
    - Métodos notáveis:
        - `readObject()` – desserializa o próximo objeto.
        - `readInt()`, `readUTF()`, etc. – lê tipos primitivos em sequência.
        - `defaultReadObject()` – usado em métodos `readObject()` customizados internos à classe.
- **Fluxo de controle interno**
    1. **Cabeçalho de Stream**
        - Verifica compatibilidade de versão e integridade.
    2. **Tabela de referências**
        - Garante que objetos repetidos no mesmo fluxo mantenham referências corretas (não duplicam instâncias).
    3. **Desserialização recursiva**
        - Se um objeto contém outros objetos, todos são desserializados em profundidade.

### Restrições de uso

- **Classe deve implementar `Serializable`**
    - Caso contrário, `NotSerializableException`.
- **Campo `serialVersionUID`**
    - Se não declarado, gerado automaticamente; diferenças entre versões da classe podem quebrar desserialização.
- **Cuidado com segurança**
    - Desserializar objetos não confiáveis pode abrir brechas (injection de classes maliciosas).
    - Em aplicações críticas, validar tipo antes de usar:
        
        ```java
        Object obj = ois.readObject();
        if (obj instanceof MinhaClasseSegura) {
            // OK
        } else {
            throw new SecurityException("Objeto inesperado");
        }
        
        ```
        

---

### 4. Exemplos de Código Otimizados

### 4.1. Serializando e Desserializando uma Lista

```java
import java.io.*;
import java.util.*;

public class ExemploObjectStream {
    public static void main(String[] args) {
        List<String> lista = List.of("Java", "Streams", "Objetos");

        // Serialização
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new BufferedOutputStream(new FileOutputStream("lista.ser")))) {
            oos.writeObject(lista);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Desserialização
        try (ObjectInputStream ois = new ObjectInputStream(
                new BufferedInputStream(new FileInputStream("lista.ser")))) {
            @SuppressWarnings("unchecked")
            List<String> listaRecuperada = (List<String>) ois.readObject();
            listaRecuperada.forEach(System.out::println);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}

```

- Uso de *buffered streams* para melhorar performance.
- Cast seguro com `@SuppressWarnings`.

### 4.2. Classe com Custom `readObject`

```java
import java.io.*;

public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    private String nome;
    private transient String senha; // não será serializada

    public Usuario(String nome, String senha) {
        this.nome = nome;
        this.senha = senha;
    }

    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        // desserialização padrão
        in.defaultReadObject();
        // pós-processamento: recuperar senha de outra fonte ou setar valor padrão
        this.senha = "<não armazenada>";
    }
}

```

- Exemplo de como tratar campos transitórios após leitura.

---

### 5. Informações Adicionais

- **Performance:**
    - Streams de objetos não são as mais rápidas; para grandes volumes ou alta concorrência, considere formatos como JSON/binary (Jackson, Protobuf).
- **Compatibilidade de versões:**
    - Use `serialVersionUID` explícito e evite mudanças não compatíveis na classe (renomear campos, mudar hierarquia).
- **Alternativas modernas:**
    - `Externalizable` – maior controle, mas exige implementar `writeExternal` e `readExternal`.
    - Bibliotecas de serialização (Kryo, Protostuff) para cenários de alto desempenho.

---

### 6. Referências para Estudo Independente

1. **Documentação Oficial Oracle**
    - *Java Object Serialization Specification*[https://docs.oracle.com/javase/8/docs/platform/serialization/spec/](https://docs.oracle.com/javase/8/docs/platform/serialization/spec/)
2. **Livro “Effective Java”, Joshua Bloch**
    - Capítulo sobre serialização e `serialVersionUID`.
3. **Artigo “Understanding Java Serialization”**
    - DZone: [https://dzone.com/articles/understanding-serialization-in-java](https://dzone.com/articles/understanding-serialization-in-java)
4. **Tutorial Baeldung**
    - “Java Serialization Basics”:
    [https://www.baeldung.com/java-serialization](https://www.baeldung.com/java-serialization)

---

Espero que este guia completo ajude você a dominar o uso de `ObjectInputStream` em cenários do dia a dia! Se precisar de mais exemplos ou esclarecimentos, é só pedir.