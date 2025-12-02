# Exceções Customizadas: Criando suas próprias exceções

1. **Introdução**
    - **Visão Geral Concisa:**
    Exceções customizadas em Java são classes que estendem a hierarquia de exceções padrão (`Exception` ou `RuntimeException`) para representar cenários de erro específicos da sua aplicação. Em vez de lançar sempre `IllegalArgumentException`, `NullPointerException` ou outras genéricas, você cria exceções que falam a “linguagem do domínio” do seu sistema.
    - **Relevância e Importância:**
        - **Clareza de Código:** Permitem identificar rapidamente a causa do erro pelo tipo da exceção.
        - **Tratamento Granular:** Facilitam capturar e tratar distintos cenários de falha de forma específica.
        - **Documentação Implícita:** Servem como documentação viva — o nome da exceção descreve o problema.
        - **Manutenção e Evolução:** Ao adicionar novas regras de negócio, basta criar novas exceções sem misturar lógicas em blocos `if/else`.
    - **Definição e Conceitos Fundamentais:**
        - **Tema Principal:** Exceções customizadas — criação de classes de erro próprias para sua aplicação.
        - **Subtemas:**
            1. Escolha entre checked vs. unchecked
            2. Estrutura básica de definição
            3. Boas práticas de design
            4. Integração com frameworks (ex.: Spring)
        - **Para que servem:** Encapsular falhas de negócio, validações e condições de erro específicas, tornando o fluxo de tratamento mais legível e organizado.

---

1. **Sumário**
    1. Introdução
    2. Por que criar exceções customizadas
    3. Checked vs. Unchecked
    4. Sintaxe e Estrutura
    5. Componentes Principais
    6. Restrições de Uso
    7. Exemplos de Código Otimizados
    8. Informações Adicionais
    9. Referências para Estudo Independente

---

1. **Conteúdo Detalhado**
    
    ### 3.1 Por que criar exceções customizadas
    
    - Isolar erros de domínio (ex.: `UsuarioNaoEncontradoException`).
    - Evitar ambiguidade na captura de falhas (capturar apenas o que interessa).
    - Facilitar logging e monitoramento por tipo de erro.
    
    ### 3.2 Checked vs. Unchecked
    
    - **Checked Exceptions:** Herdam de `Exception` (exceto `RuntimeException`). O compilador obriga a tratar ou declarar `throws`.
    - **Unchecked Exceptions:** Herdam de `RuntimeException`. Não exigem tratamento explícito.
    - **Quando usar:**
        - **Checked:** Falhas recuperáveis e previstas, p.ex., “arquivo não encontrado”.
        - **Unchecked:** Erros de programação ou violações de contrato, p.ex., “índice fora de faixa”.
    
    ### 3.3 Sintaxe e Estrutura
    
    ```java
    // Exceção checked
    public class UsuarioNaoEncontradoException extends Exception {
        public UsuarioNaoEncontradoException(String mensagem) {
            super(mensagem);
        }
        public UsuarioNaoEncontradoException(String mensagem, Throwable causa) {
            super(mensagem, causa);
        }
    }
    
    // Exceção unchecked
    public class SaldoInsuficienteException extends RuntimeException {
        public SaldoInsuficienteException(String mensagem) {
            super(mensagem);
        }
        public SaldoInsuficienteException(String mensagem, Throwable causa) {
            super(mensagem, causa);
        }
    }
    
    ```
    
    - **Construtores:**
        - `super(mensagem)` — define a mensagem de erro.
        - `super(mensagem, causa)` — encadeia outra exceção que originou o problema.
    
    ### 3.4 Componentes Principais
    
    - **Classe da Exceção:** herda de `Exception` ou `RuntimeException`.
    - **Mensagens Claras:** sempre forneça mensagens informativas, ex.:
        
        ```java
        throw new UsuarioNaoEncontradoException(
            "Usuário com ID " + id + " não encontrado no sistema");
        
        ```
        
    - **Encadeamento de Causas:** preserve a causa original:
        
        ```java
        try {
            // operação que lança SQLException
        } catch (SQLException e) {
            throw new DataAccessException("Erro ao acessar tabela Usuario", e);
        }
        
        ```
        
    - **Tratamento no Chamador:**
        
        ```java
        try {
            usuarioService.buscarPorId(id);
        } catch (UsuarioNaoEncontradoException e) {
            // resposta 404 ao cliente, log específico, etc.
        }
        
        ```
        
    
    ### 3.5 Restrições de uso
    
    - **Não Abusar:** não crie exceções para tudo — evite classes de exceção com finalidades triviais.
    - **Herança Adequada:** não herde diretamente de `Throwable`.
    - **Design Lógico:** agrupe exceções similares em um pacote e use nomes coerentes.
    - **Performance:** lançamento de exceção é custoso; não use para fluxo de controle normal.

---

1. **Exemplos de Código Otimizados**
    
    ### 4.1 Caso de Uso: Serviço de Conta Bancária
    
    ```java
    // 1. Exceção customizada
    public class SaldoInsuficienteException extends RuntimeException {
        public SaldoInsuficienteException(double valor, double saldoAtual) {
            super(String.format("Tentativa de débito de R$%.2f em conta com saldo R$%.2f", valor, saldoAtual));
        }
    }
    
    // 2. Implementação do serviço
    public class ContaService {
        public void debitar(Conta conta, double valor) {
            if (valor > conta.getSaldo()) {
                throw new SaldoInsuficienteException(valor, conta.getSaldo());
            }
            conta.setSaldo(conta.getSaldo() - valor);
        }
    }
    
    // 3. Uso em camada de API (Spring Boot)
    @RestController
    @RequestMapping("/contas")
    public class ContaController {
        @Autowired
        private ContaService contaService;
    
        @PostMapping("/{id}/debito")
        public ResponseEntity<Void> debitar(@PathVariable Long id, @RequestParam double valor) {
            try {
                contaService.debitar(buscarConta(id), valor);
                return ResponseEntity.ok().build();
            } catch (SaldoInsuficienteException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                     .body(null);
            }
        }
    }
    
    ```
    
    - **Comentários de Boas Práticas:**
        - Mensagem formatada via `String.format` para legibilidade.
        - Exceção unchecked, pois débito com saldo insuficiente é falha de lógica.
        - Controller converte exceção em resposta HTTP apropriada.
    
    ### 4.2 Exceção Checked para Validação de Dados
    
    ```java
    public class DadosInvalidosException extends Exception {
        public DadosInvalidosException(String campo, String motivo) {
            super(String.format("Campo '%s' inválido: %s", campo, motivo));
        }
    }
    
    public class UsuarioValidator {
        public void validar(UsuarioDto dto) throws DadosInvalidosException {
            if (dto.getEmail() == null || !dto.getEmail().contains("@")) {
                throw new DadosInvalidosException("email", "formato incorreto");
            }
            // outras validações...
        }
    }
    
    ```
    
    - Neste caso, obriga o chamador a tratar ou declarar `throws`.

---

1. **Informações Adicionais**
    - **Integração com Spring:**
        - Use `@ControllerAdvice` para mapear exceções em respostas uniformes.
        - Exemplo:
            
            ```java
            @ControllerAdvice
            public class GlobalExceptionHandler {
                @ExceptionHandler(SaldoInsuficienteException.class)
                public ResponseEntity<ErroResponse> handleSaldoInsuficiente(SaldoInsuficienteException ex) {
                    return ResponseEntity
                        .badRequest()
                        .body(new ErroResponse("SALDO_INSUFICIENTE", ex.getMessage()));
                }
            }
            
            ```
            
    - **Logging Estruturado:**
        - Combine tipos de exceção com SLF4J/MDC para rastrear incidentes.
    - **Monitoramento:**
        - Configure Sentry, New Relic ou Prometheus para capturar exceções específicas e alertar equipes.

---

1. **Referências para Estudo Independente**
    - **Documentação Oficial Java:**
        - Exception Handling:
        [https://docs.oracle.com/javase/tutorial/essential/exceptions/](https://docs.oracle.com/javase/tutorial/essential/exceptions/) (Oracle Java Tutorials)
    - **Livro “Effective Java” (Joshua Bloch):**
        - Capítulo sobre Exceções, boas práticas e design.
    - **Artigo Baeldung:**
        - “Guide to Custom Exceptions in Java”
        [https://www.baeldung.com/java-custom-exception](https://www.baeldung.com/java-custom-exception)
    - **Spring Framework Reference:**
        - Seção de tratamento de exceções:
        [https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-exceptionhandler)

---

> Dica Final: mantenha o nome da exceção focado no problema de domínio e evite duplicação. Com bons nomes e mensagens, sua base de código ganha legibilidade e robustez.
>