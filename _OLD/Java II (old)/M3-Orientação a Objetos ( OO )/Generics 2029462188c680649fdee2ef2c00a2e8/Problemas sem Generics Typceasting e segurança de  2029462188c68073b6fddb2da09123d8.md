# Problemas sem Generics: Typceasting e segurança de tipo em coleções

1. **Introdução**
    
    A evolução da linguagem Java incluiu, a partir da versão 5, o suporte a *Generics*. Antes disso, trabalhávamos com coleções de tipos “crus” (*raw types*), o que gerava diversos **problemas de type-safety** e obrigava o uso intenso de **typecasting**.
    
    - **Relevância**: Sem generics, erros de tipo só eram detectados em tempo de execução (por exemplo, `ClassCastException`), diminuindo a robustez do sistema e a produtividade do desenvolvedor.
    - **Contexto**: Em aplicações reais, usamos frequentemente estruturas como `List`, `Set` e `Map`. Garantir que uma `List` contenha apenas objetos de um tipo esperado é crucial para evitar bugs silenciosos.
    - **Definições**
        - **Tema Principal**: entender os *problemas* causados pela ausência de generics em coleções Java.
        - **Subtemas**:
            - Uso de *raw types*
            - Necessidade de *typecasting*
            - Exceções em tempo de execução
            - Perda de Autodocumentação do código
            - Segurança de tipo em coleções genéricas

---

1. **Sumário**
    1. Problemas sem Generics
    2. Sintaxe e Estrutura de Raw Types
    3. Typecasting Explícito
    4. Exceções em Tempo de Execução
    5. Perda de Legibilidade e Autodocumentação
    6. Boas Práticas com Generics (contraste)
    7. Exemplos de Código Otimizados
    8. Informações Adicionais
    9. Referências para Estudo Independente

---

1. **Conteúdo Detalhado**
    
    ### 3.1 Problemas sem Generics
    
    - **Insegurança de Tipo**: Nada impede de inserir objetos diferentes em uma coleção.
    - **Erros em Tempo de Execução**: Somente ao fazer o *cast* é que se descobre um objeto inesperado, lançando `ClassCastException`.
    - **Código Verboso**: Cada leitura de coleção exige *casting*, tornando o código mais extenso e sujeito a erros.
    - **Perda de Autodocumentação**: A assinatura `List nomes` não diz quais tipos estão armazenados, obrigando o dev a consultar documentação ou código.
    
    ### 3.2 Sintaxe e Estrutura de Raw Types
    
    ```java
    // Criação de lista sem especificação de tipo
    List listaDeCoisas = new ArrayList();
    listaDeCoisas.add("Olá");
    listaDeCoisas.add(123);  // Permitido, mas perigoso
    
    ```
    
    - **Raw Type**: referência a `List` sem `<Tipo>`.
    - Internamente, a JVM trata todos os elementos como `Object`.
    
    ### 3.3 Typecasting Explícito
    
    ```java
    for (Object obj : listaDeCoisas) {
        // Cada leitura precisa converter para o tipo esperado
        String texto = (String) obj;  // Pode lançar ClassCastException
        System.out.println(texto.toUpperCase());
    }
    
    ```
    
    - **Método `toString()`**: funciona para todos, mas métodos específicos de `String` exigem cast.
    - **Risco**: se `obj` for `Integer`, falha em tempo de execução.
    
    ### 3.4 Exceções em Tempo de Execução
    
    - **`ClassCastException`**
        
        ```
        Exception in thread "main" java.lang.ClassCastException: java.lang.Integer cannot be cast to java.lang.String
        
        ```
        
    - **Detecção Tardia**: Bugs só aparecem durante execução de cenários específicos, custando tempo de debugging e testes.
    
    ### 3.5 Perda de Legibilidade e Autodocumentação
    
    - **Assinaturas Ambíguas**:
        
        ```java
        public void processar(List dados) { … }
        
        ```
        
        Não sabemos se `dados` são `List<String>`, `List<Pedido>` etc.
        
    - **Manutenção Difícil**: Novos desenvolvedores têm de investigar usos em todo o código.
    
    ### 3.6 Boas Práticas com Generics (Contraste)
    
    - Passar a usar `List<Tipo>` impede inserções incorretas em tempo de compilação:
        
        ```java
        List<String> nomes = new ArrayList<>();
        nomes.add("Gustavo");
        nomes.add(123); // **Erro de compilação**!
        
        ```
        
    - **Segurança de Tipo**: compilador garante consistência.
    - **Menos Casting**: leitura retorna já o tipo correto:
        
        ```java
        for (String nome : nomes) {
            System.out.println(nome.toUpperCase());
        }
        
        ```
        

---

1. **Exemplos de Código Otimizados**
    
    ```java
    //===============================
    // 1. Raw Types (não recomendado)
    //===============================
    List listaBruta = new ArrayList();
    listaBruta.add("Jane");
    listaBruta.add("John");
    listaBruta.add(42);  // A compilação permite…
    
    for (Object o : listaBruta) {
        // …mas em tempo de execução falha aqui:
        String s = (String) o;
        System.out.println(s);
    }
    
    ```
    
    ```java
    //================================================
    // 2. Com Generics (Java 5+): Segurança em compilação
    //================================================
    List<String> listaSegura = new ArrayList<>();
    listaSegura.add("Jane");
    listaSegura.add("John");
    // listaSegura.add(42); // ### Erro em tempo de compilação
    
    listaSegura.forEach(nome -> {
        // Não precisa de cast!
        System.out.println(nome.toLowerCase());
    });
    
    ```
    
    ```java
    //================================================
    // 3. Coleções heterogêneas intencionais – uso de Generics avançado
    //================================================
    Map<String, Object> mapa = new HashMap<>();
    mapa.put("idade", 30);
    mapa.put("nome", "Alice");
    
    // Ao buscar, fazemos cast controlado:
    int idade = (Integer) mapa.get("idade");
    String nome = (String)  mapa.get("nome");
    
    ```
    
    > Dica: Prefira coleções homogêneas (List<T>, Set<T>) sempre que possível. Use Map<String, Object> ou <?> apenas quando realmente necessário.
    > 

---

1. **Informações Adicionais**
    - **Wildcards (`?`)**: permitem declaração flexível (`List<?>`, `List<? extends Number>`), mas mantêm a segurança de tipo.
    - **PECS** (“Producer Extends, Consumer Super”): dica mnemônica para usar `<? extends T>` e `<? super T>`.
    - **Type Erasure**: Generics são apagados em tempo de compilação, garantindo compatibilidade com versões anteriores da JVM.
    - **Coleções “Type-Safe Heterogêneas”**: padrão de Bloch em *Effective Java* para armazenar múltiplos tipos de forma segura, usando chaves de classe.

---

1. **Referências para Estudo Independente**
    1. **Documentação Oficial Oracle – Generics**[https://docs.oracle.com/javase/tutorial/java/generics/](https://docs.oracle.com/javase/tutorial/java/generics/)
    2. **“Effective Java” (Joshua Bloch), 3ª Edição** – Capítulo sobre Generics
    3. **Baeldung – Guide to Java Generics**[https://www.baeldung.com/java-generics](https://www.baeldung.com/java-generics)
    4. **Vikram Kulkarni – “Java Generics Tutorial”** (YouTube)
    5. **Stack Overflow** – Pesquise por “ClassCastException generics” para casos concretos

---

Com esta estrutura você tem um panorama profundo dos problemas de coleções sem generics e como os generics, introduzidos no Java 5, resolvem **type-casting** excessivo e aumentam a **segurança de tipo** em tempo de compilação.