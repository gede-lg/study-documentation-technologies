# Mapeamento de Tipos Enum (@Enumerated)

---

1. **Introdução:**
    
    O mapeamento de tipos enumerados em Java para colunas de banco de dados é um requisito comum em aplicações que utilizam JPA (Java Persistence API). O uso de enums traz clareza de domínio ao código, mas exige configurações específicas para que o JPA saiba como persistir esses valores (e recuperá-los) de forma consistente. A anotação `@Enumerated` permite controlar esse comportamento, definindo se o valor salvo será o índice ordinal ou o nome literal do enum.
    
    **Tópicos relacionados:**
    
    - Mapeamento de atributos básicos com JPA
    - Uso de `@Converter` e `AttributeConverter` para tipos personalizados

---

1. **Sumário:**
    1. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#3-conceitos-fundamentais)
    2. [Sintaxe e Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#4-sintaxe-e-uso-se-aplic%C3%A1vel)
    3. [Restrições de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#5-restri%C3%A7%C3%B5es-de-uso)
    4. [Elementos Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#6-elementos-associados)
    5. [Melhores Práticas e Casos de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#7-melhores-pr%C3%A1ticas-e-casos-de-uso)
    6. [Exemplos Completos](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#8-exemplos-completos)

---

1. **Conceitos Fundamentais:**
    - **O que é um `enum` em Java?**
        
        Um `enum` (abreviação de *enumeration*) é um tipo especial de classe em Java que define um conjunto fixo de constantes nomeadas. Exemplo:
        
        ```java
        public enum StatusPedido {
            PENDENTE,
            EM_PROCESSAMENTO,
            ENVIADO,
            ENTREGUE,
            CANCELADO
        }
        
        ```
        
        Cada constante (`PENDENTE`, `EM_PROCESSAMENTO`, etc.) é, na verdade, uma instância única da classe `StatusPedido`.
        
    - **Por que usar enums em entidades JPA?**
        1. **Legibilidade e Segurança de Tipo:** Em vez de usar valores “mágicos” (por exemplo, inteiros ou strings) para representar estados, utiliza-se uma enum, o que torna o código mais claro e menos propenso a erros de digitação.
        2. **Validação Implícita:** O conjunto de valores possíveis está restrito às constantes definidas no enum, evitando valores inválidos.
        3. **Facilidade de Evolução:** A adição de novos valores ou a refatoração de nomes pode ser gerenciada diretamente no enum, facilitando a manutenção.
    - **Propósito do mapeamento de enums no JPA:**
        
        O JPA não “sabe” automaticamente como salvar um tipo `enum` no banco de dados, pois bancos relacionais não possuem uma coluna do tipo enum Java. É preciso informar ao provedor JPA como realizar esse mapeamento—ou seja, se o valor deve ser persistido como inteiro (ordinal) ou texto (string). Para isso, usa-se a anotação `@Enumerated`, que direciona o JPA a converter o enum para um tipo suportado pela coluna.
        
    
    **Tópicos relacionados sugeridos:**
    
    - Diferença entre `enum` e classes imutáveis em Java
    - Como funcionam atributos embutidos (`@Embeddable`) com enums

---

1. **Sintaxe e Uso (se aplicável):**
    
    A anotação principal para mapear enums em JPA é `@Enumerated`. Ela pode ser colocada diretamente sobre o campo (ou sobre o método getter) da entidade que for do tipo `enum`. Existem dois valores possíveis para `EnumType`:
    
    - `EnumType.ORDINAL` (padrão): Persiste o enum como um inteiro, correspondendo à posição da constante (começando em zero).
    - `EnumType.STRING`: Persiste o enum como o nome literal da constante.
    
    ### 4.1. Declaração Básica
    
    ```java
    @Entity
    public class Pedido {
    
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        // Mapeia o enum usando ORDINAL (0 = PENDENTE, 1 = EM_PROCESSAMENTO, etc.)
        @Enumerated(EnumType.ORDINAL)
        private StatusPedido status;
    
        // outros atributos, construtores, getters e setters…
    }
    
    ```
    
    No exemplo acima, supondo que `status = EM_PROCESSAMENTO`, o valor salvo na coluna `status` será `1` (a segunda constante do enum).
    
    ### 4.2. Uso de `EnumType.STRING`
    
    ```java
    @Entity
    public class Pedido {
    
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        // Mapeia o enum usando STRING (persistirá “PENDENTE”, “EM_PROCESSAMENTO”, etc.)
        @Enumerated(EnumType.STRING)
        @Column(length = 20) // opcional: define tamanho do VARCHAR no banco
        private StatusPedido status;
    
        // ...
    }
    
    ```
    
    Agora, se `status = EM_PROCESSAMENTO`, a coluna `status` receberá o valor `"EM_PROCESSAMENTO"`.
    
    ### 4.3. Exemplos Comentados
    
    ```java
    // Enum que representa possíveis status de um pedido
    public enum StatusPedido {
        PENDENTE,          // ordinal = 0
        EM_PROCESSAMENTO,  // ordinal = 1
        ENVIADO,           // ordinal = 2
        ENTREGUE,          // ordinal = 3
        CANCELADO          // ordinal = 4
    }
    
    // Entidade JPA que utiliza esse enum
    @Entity
    @Table(name = "PEDIDO")
    public class Pedido {
    
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        @Column(name = "DESCRICAO", nullable = false)
        private String descricao;
    
        // Ao usar ORDINAL, cuidado: se a ordem das constantes mudar, dados antigos ficam inconsistentes
        @Enumerated(EnumType.ORDINAL)
        @Column(name = "STATUS_ORDINAL")
        private StatusPedido statusOrdinal;
    
        // Ao usar STRING, o nome exato será salvo; se renomear constantes, pode quebrar consultas históricas
        @Enumerated(EnumType.STRING)
        @Column(name = "STATUS_STRING", length = 20)
        private StatusPedido statusString;
    
        // Construtor padrão, getters e setters omitidos para brevidade
    }
    
    ```
    
    **Tópicos relacionados sugeridos:**
    
    - Estratégias de geração de chaves primárias (`@GeneratedValue`)
    - Diferenças entre `@Column` e `@JoinColumn` no JPA

---

1. **Restrições de Uso:**
    
    Embora mapeamentos de enums sejam diretos, há cenários em que determinada escolha (`ORDINAL` ou `STRING`) pode trazer problemas:
    
    1. **Uso de `EnumType.ORDINAL`:**
        - **Problema de Evolução:** Se, em um release futuro, você inserir, remover ou reordenar constantes no enum, todos os registros existentes no banco poderão ficar desalinhados. Exemplo:
            
            ```java
            // Versão inicial
            public enum StatusPedido { PENDENTE, EM_PROCESSAMENTO, ENVIADO }
            
            // Salvo no banco: 0, 1 ou 2
            
            // Versão modificada (inserindo “APROVADO” antes de ENVIADO)
            public enum StatusPedido { PENDENTE, EM_PROCESSAMENTO, APROVADO, ENVIADO }
            
            // Agora, um registro que tinha Ordinal = 2 passará a ser APROVADO, não ENVIADO.
            
            ```
            
        - **Portabilidade Limitada:** Alguns bancos podem ter otimizações específicas para colunas inteiras, mas a legibilidade direta do valor fica comprometida.
        
        **Conclusão:** Evitar `ORDINAL` se houver risco de alterar a ordem das constantes ou se o histórico de dados precisar manter referência legível ao enum.
        
    2. **Uso de `EnumType.STRING`:**
        - **Tamanho da Coluna:** Strings ocupam mais espaço no banco, especialmente se o nome da constante for longo. Pode ser necessário ajustar `length` em `@Column`.
        - **Sensibilidade a Alterações de Nome:** Se renomear uma constante, as consultas que buscam pelo nome anterior falharão, e dados históricos podem ficar inconsistentes.
        - **Case Sensitive (dependendo do banco):** Alguns bancos tratam strings de forma sensível ao caso—logo, `"ENVIADO"` difere de `"enviado"`. É recomendável manter convenção de uso sempre em caixa alta.
        
        **Conclusão:** `STRING` é mais estável contra alterações de ordem, mas requer cuidado ao renomear e dimensionar colunas.
        
    3. **Cenários Inadequados para Uso de `@Enumerated`:**
        - **Campos de Configuração Dinâmica:** Caso os valores sejam frequentemente alterados (por configuração administrativa, por exemplo), é melhor usar uma tabela separada referenciada via `@ManyToOne` do que um enum.
        - **Mapeamento a Conjuntos Complexos:** Se for necessário mapear combinações de flags ou bitfields, enums JPA simples não atendem; nesse caso, usar `@ElementCollection` ou converter bitmasks manualmente.
    
    **Tópicos relacionados sugeridos:**
    
    - Implementação de `AttributeConverter` para conversões personalizadas
    - Mapeamento de relacionamentos (`@ManyToOne`) versus uso de enums

---

1. **Elementos Associados:**
    
    A fim de aplicar corretamente o mapeamento de enums em JPA, é importante entender as anotações, classes e interfaces envolvidas. A seguir, cada elemento essencial:
    
    1. **`@Enumerated`**
        - **Pacote:** `javax.persistence.Enumerated`
        - **Uso:** Indica que um atributo do tipo enum deve ser persistido com conversão específica.
        - **Atributo Principal:**
            
            ```java
            public @interface Enumerated {
                EnumType value() default EnumType.ORDINAL;
            }
            
            ```
            
        - **EnumType (valores possíveis):**
            - `EnumType.ORDINAL` – Persiste como inteiro.
            - `EnumType.STRING` – Persiste como texto (nome da constante).
    2. **`EnumType`**
        - **Pacote:** `javax.persistence.EnumType`
        - **Constantes:**
            
            ```java
            public enum EnumType {
                ORDINAL,
                STRING
            }
            
            ```
            
        - **Propósito:** Define a estratégia de conversão para o enum.
    3. **`@Column` (opcional, mas recomendado em mapeamentos STRING)**
        - **Pacote:** `javax.persistence.Column`
        - **Principais Atributos:**
            - `name`: nome da coluna no banco.
            - `length`: tamanho máximo para colunas de texto (VARCHAR).
            - `nullable`: indica se coluna aceita valor nulo.
        - **Exemplo:**
            
            ```java
            @Column(name = "STATUS", length = 30, nullable = false)
            private StatusPedido status;
            
            ```
            
    4. **Enum em Java**
        - **Definição Básica:**
            
            ```java
            public enum StatusPedido {
                PENDENTE,
                EM_PROCESSAMENTO,
                ENVIADO,
                ENTREGUE,
                CANCELADO
            }
            
            ```
            
        - **Possibilidade de Atributos Personalizados (Opcional):**
            - Enum pode conter campos adicionais, construtores e métodos.
            - Exemplo de enum com campo descritivo:
                
                ```java
                public enum StatusPedido {
                    PENDENTE("Aguardando pagamento"),
                    EM_PROCESSAMENTO("Processando pedido"),
                    ENVIADO("Em rota de entrega"),
                    ENTREGUE("Entregue ao cliente"),
                    CANCELADO("Pedido cancelado");
                
                    private String descricao;
                
                    StatusPedido(String descricao) {
                        this.descricao = descricao;
                    }
                
                    public String getDescricao() {
                        return descricao;
                    }
                }
                
                ```
                
    5. **Classe de Entidade (`@Entity`)**
        - **Pacote:** `javax.persistence.Entity`
        - **Objetivo:** Marca uma classe como persistível. O campo do tipo enum será anotado diretamente nesta classe.
        - **Exemplo:**
            
            ```java
            @Entity
            @Table(name = "PEDIDO")
            public class Pedido {
                @Id
                @GeneratedValue(strategy = GenerationType.IDENTITY)
                private Long id;
            
                @Enumerated(EnumType.STRING)
                @Column(name = "STATUS", length = 20)
                private StatusPedido status;
            
                // demais atributos, construtores, getters e setters...
            }
            
            ```
            
    6. **`@Enumerated` em Propriedades vs. Getters**
        - Pode-se anotar diretamente o atributo ou o método getter:
            
            ```java
            // Atributo
            @Enumerated(EnumType.STRING)
            private StatusPedido status;
            
            // Ou Getter
            @Enumerated(EnumType.STRING)
            public StatusPedido getStatus() {
                return status;
            }
            
            ```
            
        - A convenção do JPA segue o *acessor mode* configurado (`ACCESS.FIELD` ou `ACCESS.PROPERTY`). Mapeie de forma consistente (atributo ou getter) para toda classe.
    
    **Tópicos relacionados sugeridos:**
    
    - Estratégias de acesso do JPA: `@Access(FIELD)` vs. `@Access(PROPERTY)`
    - Como combinar `@Enumerated` com `@AttributeOverride`

---

1. **Melhores Práticas e Casos de Uso:**
    1. **Preferência por `EnumType.STRING`:**
        - **Motivo:** Garante que, mesmo se reordenar enums ou inserir novas constantes, registros históricos sejam mantidos corretamente.
        - **Impacto de Espaço:** Pode ocupar mais bytes, mas sistemas modernos de banco (especialmente com compressão) minimizam essa diferença.
        - **Recomendação:** Definir explicitamente `@Enumerated(EnumType.STRING)` sempre que possível, a menos que a performance e o espaço sejam restrições críticas.
    2. **Uso de `length` Adequado no `@Column`:**
        - **Contexto:** Ao usar `STRING`, determine um tamanho que suporte o enum mais longo.
        - **Exemplo:**
            
            ```java
            @Enumerated(EnumType.STRING)
            @Column(name = "STATUS", length = 50, nullable = false)
            private StatusPedido status;
            
            ```
            
        - **Justificativa:** Garante que nomes literais não sejam truncados, evitando erros de persistência.
    3. **Documentação Clara das Constantes de Enum:**
        - **Motivo:** Quando novos desenvolvedores entrarem no projeto, é útil saber o propósito de cada constante.
        - **Sugestão:** Comentar cada constante ou usar campos descritivos internos, como em:
            
            ```java
            public enum StatusPedido {
                PENDENTE("Aguardando pagamento"),
                EM_PROCESSAMENTO("Processando pedido"),
                // ...
            }
            
            ```
            
        - **Uso em Relatórios ou Interfaces:** O método `getDescricao()` pode ser usado para apresentar nomes amigáveis ao usuário.
    4. **Considerar Uso de `AttributeConverter` para Cenários Especiais:**
        - **Quando usar:** Se for necessário persistir o enum de forma customizada (por exemplo, armazenar um código numérico específico ou um valor diferente do nome).
        - **Exemplo Simples de `AttributeConverter`:**
            
            ```java
            @Converter(autoApply = true)
            public class StatusPedidoConverter implements AttributeConverter<StatusPedido, Integer> {
            
              @Override
              public Integer convertToDatabaseColumn(StatusPedido attribute) {
                  switch (attribute) {
                      case PENDENTE: return 0;
                      case EM_PROCESSAMENTO: return 1;
                      case ENVIADO: return 2;
                      case ENTREGUE: return 3;
                      case CANCELADO: return 4;
                      default: throw new IllegalArgumentException("Status desconhecido: " + attribute);
                  }
              }
            
              @Override
              public StatusPedido convertToEntityAttribute(Integer dbData) {
                  switch (dbData) {
                      case 0: return StatusPedido.PENDENTE;
                      case 1: return StatusPedido.EM_PROCESSAMENTO;
                      case 2: return StatusPedido.ENVIADO;
                      case 3: return StatusPedido.ENTREGUE;
                      case 4: return StatusPedido.CANCELADO;
                      default: throw new IllegalArgumentException("Código de status inválido: " + dbData);
                  }
              }
            }
            
            ```
            
        - **Benefício:** Total controle sobre conversão, útil quando há legados ou necessidade de persistência de códigos específicos.
    5. **Validação de Dados em Camada de Negócio:**
        - **Cenário:** Mesmo com enum restrito, pode ser interessante validar, por exemplo, transições inválidas de status (e.g., não permitir que um pedido vá diretamente de `PENDENTE` para `ENTREGUE`).
        - **Implementação:**
            
            ```java
            public void atualizarStatus(StatusPedido novoStatus) {
                if (this.status == StatusPedido.PENDENTE && novoStatus == StatusPedido.ENTREGUE) {
                    throw new IllegalStateException("Não é permitido ir diretamente de PENDENTE para ENTREGUE.");
                }
                this.status = novoStatus;
            }
            
            ```
            
    6. **Consulta JPA por Enums:**
        - **JPQL Example com `EnumType.STRING`:**
            
            ```java
            // Repositório Spring Data JPA
            public interface PedidoRepository extends JpaRepository<Pedido, Long> {
                List<Pedido> findByStatus(StatusPedido status);
            }
            
            // Uso
            List<Pedido> pedidosEnviados = pedidoRepository.findByStatus(StatusPedido.ENVIADO);
            
            ```
            
        - **Em Query Nativa:**
            
            ```java
            @Query(value = "SELECT * FROM PEDIDO p WHERE p.STATUS = :status", nativeQuery = true)
            List<Pedido> buscarPorStatusNativo(@Param("status") String status);
            // Ao chamar, envie "ENVIADO" como parâmetro
            
            ```
            
    
    **Tópicos relacionados sugeridos:**
    
    - Mapeamento de coleções (`@ElementCollection`) com enums
    - Uso de `EnumType.STRING` versus tabelas lookup

---

1. **Exemplos Completos:**
    
    A seguir, um exemplo de aplicação prática, desde a definição de enums até o uso em repositório e testes.
    
    ### 8.1. Definição do Enum
    
    ```java
    package com.exemplo.dominio;
    
    /**
     * Enum que representa os possíveis status de um pedido no sistema.
     */
    public enum StatusPedido {
        PENDENTE("Aguardando pagamento"),
        EM_PROCESSAMENTO("Processando pedido"),
        APROVADO("Pedido aprovado"),
        ENVIADO("Em rota de entrega"),
        ENTREGUE("Entregue ao cliente"),
        CANCELADO("Pedido cancelado");
    
        private final String descricao;
    
        StatusPedido(String descricao) {
            this.descricao = descricao;
        }
    
        public String getDescricao() {
            return descricao;
        }
    }
    
    ```
    
    ### 8.2. Entidade `Pedido`
    
    ```java
    package com.exemplo.entidade;
    
    import com.exemplo.dominio.StatusPedido;
    import javax.persistence.*;
    
    @Entity
    @Table(name = "PEDIDO")
    public class Pedido {
    
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "ID")
        private Long id;
    
        @Column(name = "DESCRICAO", nullable = false, length = 100)
        private String descricao;
    
        /**
         * Mapeamos o enum como STRING para manter legibilidade e evitar problemas de reordenação futura.
         * A coluna terá até 30 caracteres, suportando o valor do enum e possíveis variações de nome.
         */
        @Enumerated(EnumType.STRING)
        @Column(name = "STATUS", nullable = false, length = 30)
        private StatusPedido status;
    
        @Column(name = "VALOR_TOTAL", nullable = false)
        private Double valorTotal;
    
        public Pedido() {
            // Construtor padrão exigido pelo JPA
        }
    
        public Pedido(String descricao, StatusPedido status, Double valorTotal) {
            this.descricao = descricao;
            this.status = status;
            this.valorTotal = valorTotal;
        }
    
        // Getters e Setters
        public Long getId() {
            return id;
        }
    
        public void setId(Long id) {
            this.id = id;
        }
    
        public String getDescricao() {
            return descricao;
        }
    
        public void setDescricao(String descricao) {
            this.descricao = descricao;
        }
    
        public StatusPedido getStatus() {
            return status;
        }
    
        public void setStatus(StatusPedido status) {
            this.status = status;
        }
    
        public Double getValorTotal() {
            return valorTotal;
        }
    
        public void setValorTotal(Double valorTotal) {
            this.valorTotal = valorTotal;
        }
    
        @Override
        public String toString() {
            return "Pedido{" +
                    "id=" + id +
                    ", descricao='" + descricao + '\'' +
                    ", status=" + status +
                    ", valorTotal=" + valorTotal +
                    '}';
        }
    }
    
    ```
    
    ### 8.3. Repositório (Spring Data JPA)
    
    ```java
    package com.exemplo.repositorio;
    
    import com.exemplo.entidade.Pedido;
    import com.exemplo.dominio.StatusPedido;
    import org.springframework.data.jpa.repository.JpaRepository;
    import java.util.List;
    
    public interface PedidoRepository extends JpaRepository<Pedido, Long> {
        // Busca pedidos pelo status especificado
        List<Pedido> findByStatus(StatusPedido status);
    }
    
    ```
    
    ### 8.4. Serviço de Negócio
    
    ```java
    package com.exemplo.servico;
    
    import com.exemplo.entidade.Pedido;
    import com.exemplo.dominio.StatusPedido;
    import com.exemplo.repositorio.PedidoRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;
    import java.util.List;
    
    @Service
    public class PedidoService {
    
        @Autowired
        private PedidoRepository pedidoRepository;
    
        /**
         * Cria um novo pedido com status PENDENTE.
         */
        @Transactional
        public Pedido criarPedido(String descricao, Double valorTotal) {
            Pedido pedido = new Pedido(descricao, StatusPedido.PENDENTE, valorTotal);
            return pedidoRepository.save(pedido);
        }
    
        /**
         * Atualiza o status de um pedido. Exemplo de lógica de negócio que evita
         * transição ilegal de status.
         */
        @Transactional
        public Pedido atualizarStatus(Long pedidoId, StatusPedido novoStatus) {
            Pedido pedido = pedidoRepository.findById(pedidoId)
                    .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + pedidoId));
    
            // Exemplo de validação: não permitir pular para ENTREGUE se estiver PENDENTE
            if (pedido.getStatus() == StatusPedido.PENDENTE && novoStatus == StatusPedido.ENTREGUE) {
                throw new IllegalStateException("Não é possível ir diretamente de PENDENTE para ENTREGUE.");
            }
    
            pedido.setStatus(novoStatus);
            return pedidoRepository.save(pedido);
        }
    
        /**
         * Recupera todos os pedidos com o status especificado.
         */
        @Transactional(readOnly = true)
        public List<Pedido> listarPorStatus(StatusPedido status) {
            return pedidoRepository.findByStatus(status);
        }
    }
    
    ```
    
    ### 8.5. Controlador REST (Opcional)
    
    ```java
    package com.exemplo.controller;
    
    import com.exemplo.entidade.Pedido;
    import com.exemplo.dominio.StatusPedido;
    import com.exemplo.servico.PedidoService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    
    import java.util.List;
    
    @RestController
    @RequestMapping("/api/pedidos")
    public class PedidoController {
    
        @Autowired
        private PedidoService pedidoService;
    
        @PostMapping
        public ResponseEntity<Pedido> criar(@RequestBody Pedido pedido) {
            Pedido criado = pedidoService.criarPedido(pedido.getDescricao(), pedido.getValorTotal());
            return ResponseEntity.ok(criado);
        }
    
        @PutMapping("/{id}/status")
        public ResponseEntity<Pedido> atualizarStatus(
                @PathVariable Long id,
                @RequestParam("status") StatusPedido novoStatus) {
            Pedido atualizado = pedidoService.atualizarStatus(id, novoStatus);
            return ResponseEntity.ok(atualizado);
        }
    
        @GetMapping("/status/{status}")
        public ResponseEntity<List<Pedido>> listarPorStatus(@PathVariable StatusPedido status) {
            List<Pedido> pedidos = pedidoService.listarPorStatus(status);
            return ResponseEntity.ok(pedidos);
        }
    }
    
    ```
    
    ### 8.6. Script SQL de Criação de Tabela (Exemplo MySQL)
    
    ```sql
    CREATE TABLE PEDIDO (
        ID BIGINT AUTO_INCREMENT PRIMARY KEY,
        DESCRICAO VARCHAR(100) NOT NULL,
        STATUS VARCHAR(30) NOT NULL,
        VALOR_TOTAL DECIMAL(10,2) NOT NULL
    );
    
    ```
    
    ### 8.7. Teste de Integração (JUnit + Spring Boot Test)
    
    ```java
    package com.exemplo.teste;
    
    import com.exemplo.entidade.Pedido;
    import com.exemplo.dominio.StatusPedido;
    import com.exemplo.repositorio.PedidoRepository;
    import org.junit.jupiter.api.Assertions;
    import org.junit.jupiter.api.Test;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
    
    import java.util.List;
    
    @DataJpaTest
    public class PedidoRepositoryTest {
    
        @Autowired
        private PedidoRepository pedidoRepository;
    
        @Test
        public void devePersistirEPesquisarPorStatus() {
            // Cria e salva um pedido
            Pedido pedido = new Pedido("Teste de Pedido", StatusPedido.EM_PROCESSAMENTO, 150.00);
            pedido = pedidoRepository.save(pedido);
    
            // Busca pelo status
            List<Pedido> resultado = pedidoRepository.findByStatus(StatusPedido.EM_PROCESSAMENTO);
            Assertions.assertFalse(resultado.isEmpty());
            Assertions.assertEquals(StatusPedido.EM_PROCESSAMENTO, resultado.get(0).getStatus());
        }
    }
    
    ```
    
    **Tópicos relacionados sugeridos:**
    
    - Testes de integração completos com banco em memória (H2)
    - Como configurar migrações de banco (Flyway ou Liquibase) para enums

---

**Conclusão:**

Este guia abordou de forma detalhada o **mapeamento de tipos enum** utilizando a anotação `@Enumerated` no contexto de **JPA com Java**. Vimos desde a definição de enums em Java até exemplos completos de entidades, repositórios, serviços, controladores e testes, passando pelas principais armadilhas (como o uso de `ORDINAL`) e melhores práticas (como preferir `STRING` para maior robustez).

**Próximos passos recomendados / Tópicos para aprofundamento:**

- Implementar **`AttributeConverter`** para casos onde se precise persistir valores customizados (ex.: códigos alfanuméricos).
- Explorar o **mapeamento de coleções de enums** com `@ElementCollection`.
- Estudar o uso de **`@Converter(autoApply = true)`** para aplicar conversão global de certos enums em todas as entidades.
- Conhecer ferramentas de migração (como **Flyway** ou **Liquibase**) para versionar alterações em colunas de enums de forma segura.