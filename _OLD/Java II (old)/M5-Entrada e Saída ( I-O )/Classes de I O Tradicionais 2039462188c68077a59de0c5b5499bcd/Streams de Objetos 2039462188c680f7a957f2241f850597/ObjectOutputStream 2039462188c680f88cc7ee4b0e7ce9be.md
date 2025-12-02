# ObjectOutputStream

1. **Introdução**
    
    As *Streams de objetos* em Java permitem serializar e desserializar objetos completos — preservando seus campos e estruturas internas — diretamente em fluxos de bytes. O **ObjectOutputStream** é a classe responsável por transformar objetos Java em uma sequência de bytes, que pode ser gravada em arquivos, enviada pela rede ou armazenada em memória.
    
    - **Relevância**: Fundamental sempre que você precisar
        - Persistir o estado de um objeto para uso futuro (por exemplo, salvar sessões, cache ou configurações);
        - Enviar objetos por sockets em aplicações distribuídas;
        - Implementar mecanismos simples de “snapshot” ou checkpoint em sistemas.
    - **Definição de tema principal e subtemas**
        - **Tema principal**: *Streams de objetos* — a API de serialização em Java.
        - **Subtemas**:
            1. *Serialização* (ObjectOutputStream) — converter objetos em bytes.
            2. *Desserialização* (ObjectInputStream) — reconstruir objetos a partir dos bytes.
            3. *Controle de versão* (serialVersionUID) — gerenciar compatibilidade entre diferentes versões de classe.
2. **Sumário**
    1. Conteúdo Detalhado
        1. Sintaxe e Estrutura
        2. Componentes Principais
        3. Restrições de uso
    2. Exemplos de Código Otimizados
    3. Informações Adicionais
    4. Referências para Estudo Independente
3. **Conteúdo Detalhado**
    
    ### 3.1 Sintaxe e Estrutura
    
    ```java
    // Abrindo um stream de arquivo para saída de objetos
    try (FileOutputStream fos = new FileOutputStream("dados.obj");
         ObjectOutputStream oos = new ObjectOutputStream(fos)) {
        // Serializa o objeto 'pessoa' e escreve no arquivo
        oos.writeObject(pessoa);
        // Garante que todos os bytes foram efetivamente enviados
        oos.flush();
    }
    
    ```
    
    - **FileOutputStream**: fluxo de bytes para destino (arquivo, socket…).
    - **ObjectOutputStream**: envolve um OutputStream e fornece métodos para serializar objetos.
    - **`writeObject(Object obj)`**: serializa e grava o objeto inteiro.
    - **`flush()`**: despeja buffers pendentes no stream subjacente.
    
    ### 3.2 Componentes Principais
    
    1. **Construtor**
        - `new ObjectOutputStream(OutputStream out)`
        - Internamente, escreve um *header* de stream para identificação.
    2. **Métodos**
        - `writeObject(Object obj)`
            - Aceita qualquer objeto que implemente `Serializable`.
            - Lança `NotSerializableException` se o objeto (ou algum campo) não for serializável.
        - `defaultWriteObject()`
            - Chamado dentro de `writeObject()` de classes que definem seu próprio método `private void writeObject(ObjectOutputStream oos)`.
        - `writeInt(int val)`, `writeUTF(String str)`, etc.
            - Permitem serializar valores primitivos e Strings isoladamente.
        - `reset()`
            - Limpa o cache de referências de objetos já gravados, forçando nova escrita completa se o mesmo objeto for escrito de novo.
        - `close()` (via AutoCloseable)
            - Fecha o stream, liberando recursos.
    
    ### 3.3 Restrições de uso
    
    - A classe do objeto **deve** implementar `java.io.Serializable` (ou `Externalizable`).
    - Campos `transient` **não** são serializados; usados para dados sensíveis ou não essenciais.
    - Cuidado com **serialVersionUID**:
        
        ```java
        private static final long serialVersionUID = 1L;
        
        ```
        
        - Garante compatibilidade entre versões diferentes da classe.
        - Se não declarado, o compilador gera um baseado em estrutura, e versões futuras podem falhar ao desserializar.
    - Hierarquia de herança: todas as superclasses até `Serializable` devem suportar um construtor sem argumentos, caso implementem `Externalizable`.
4. **Exemplos de Código Otimizados**
    
    ```java
    import java.io.*;
    import java.time.LocalDate;
    
    // 1) Definição de classe serializável
    public class Pessoa implements Serializable {
        private static final long serialVersionUID = 1L;
    
        private String nome;
        private transient String senha; // não será gravada
        private LocalDate nascimento;
    
        public Pessoa(String nome, String senha, LocalDate nascimento) {
            this.nome = nome;
            this.senha = senha;
            this.nascimento = nascimento;
        }
    
        // Getters e Setters omitidos para brevidade
    }
    
    // 2) Serialização otimizada com buffer e flush
    public class SerializacaoDemo {
        public static void main(String[] args) {
            Pessoa p = new Pessoa("Luiz", "segredo123", LocalDate.of(2001, 9, 19));
    
            try (BufferedOutputStream bos = new BufferedOutputStream(
                     new FileOutputStream("pessoa.dat"));
                 ObjectOutputStream oos = new ObjectOutputStream(bos)) {
    
                oos.writeObject(p);
                oos.flush(); // garante escrita imediata
                System.out.println("Objeto serializado com sucesso!");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    ```
    
    - **Buffering** melhora desempenho em gravações de disco.
    - **Tratamento de exceções**: sempre capture `IOException` ou lance adiante.
    - **Uso de `transient`**: protege dados sensíveis (ex.: senhas).
    
    ```java
    // 3) Reset de cache de referências
    oos.writeObject(p);
    oos.reset();           // limpa referências internas
    oos.writeObject(p);    // força regravação completa do objeto
    
    ```
    
5. **Informações Adicionais**
    - **ObjectInputStream**: contraparte para ler objetos (`readObject()`).
    - **Customization Hooks**:
        - `private void writeObject(ObjectOutputStream oos)`
        - `private void readObject(ObjectInputStream ois)`
        - Permitem controle fino de serialização/desserialização.
    - **Externalizable**: interface alternativa que exige implementar `writeExternal` e `readExternal` manualmente.
    - **Performance**: para grandes volumes de objetos, avalie bibliotecas como Kryo ou protocol buffers para serialização mais rápida e compacta.
6. **Referências para Estudo Independente**
    - *Oracle Java Tutorials* — “Trail: Essential I/O > Object Serialization”:
    [https://docs.oracle.com/javase/tutorial/essential/io/objectstreams.html](https://docs.oracle.com/javase/tutorial/essential/io/objectstreams.html)
    - Bloch, Joshua. *Effective Java*, 3ª ed., Capítulo 11 (Serialização).
    - Vogella, Lars. “Java Object Serialization”:
    [https://www.vogella.com/tutorials/JavaSerialisation/article.html](https://www.vogella.com/tutorials/JavaSerialisation/article.html)
    - Baeldung. “Guide to Java Serialization”:
    [https://www.baeldung.com/java-serialization](https://www.baeldung.com/java-serialization)

---

> Você pode agora testar a leitura desses objetos usando o ObjectInputStream e explorar técnicas avançadas de customização para adaptar a serialização às suas necessidades!
>