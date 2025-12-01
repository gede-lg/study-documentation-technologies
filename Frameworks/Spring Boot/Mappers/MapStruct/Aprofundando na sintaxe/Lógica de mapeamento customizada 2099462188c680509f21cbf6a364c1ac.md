# Lógica de mapeamento customizada

## Introdução

O MapStruct é uma biblioteca Java que simplifica a conversão (mapeamento) entre objetos, gerando automaticamente código de mapeamento em tempo de compilação. Embora ele resolva grande parte dos mapeamentos simples de forma automática, em cenários avançados muitas vezes há a necessidade de incluir lógica customizada — seja para tratar regras de negócio específicas, conversões condicionais ou transformações complexas. Nesta explicação, focaremos no uso de MapStruct dentro de um projeto Spring Boot, explorando desde conceitos fundamentais até padrões avançados de customização.

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Mapeamento Simples Automático
    
    2.2. Definição de Métodos Customizados
    
    2.3. Uso de Expressões e `expression`
    
    2.4. `@Mapping` com `qualifiedByName` e `@Named`
    
    2.5. `@AfterMapping` e `@BeforeMapping`
    
    2.6. Decorators e Estratégia de Herança
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    
    4.1. Anotações Principais (`@Mapper`, `@Mapping`, etc.)
    
    4.2. Interfaces e Classes de Implementação Geradas
    
    4.3. Qualifiers e `@Qualifier`
    
    4.4. Configuração de Component Model (Spring)
    
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 1. Conceitos Fundamentais

- **MapStruct e Geração em Tempo de Compilação**
    - O MapStruct gera implementações das interfaces de mapeamento durante a fase de compilação, garantindo que o código gerado seja eficiente (sem reflexão) e detectável por erros de tipagem em build time.
    - Define métodos que convertem de um tipo de objeto (DTO, entidade, VO) para outro, sem precisar escrever manualmente cada instrução de cópia de campo.
- **Objetivo da Lógica de Mapeamento Customizada**
    - Tratar campos que não se mapeiam diretamente por nome (ex.: concatenação, formatação de datas, criptografia).
    - Incluir validações ou transformações adicionais antes ou depois do mapeamento “padrão”.
    - Gerenciar cenários em que a origem ou destino possuem estrutura de objetos diferente (ex.: campos agrupados, tipos distintos).
- **Integração com Spring Boot**
    - Ao configurar `componentModel = "spring"`, as interfaces de mapeamento são gerenciadas como beans do Spring, permitindo injeção via `@Autowired`.
    - Facilita o uso em services, controllers e demais componentes do ecossistema Spring.

---

## 2. Sintaxe Detalhada e Uso Prático

### 2.1. Mapeamento Simples Automático

> Antes de falar sobre customizações, é importante entender como MapStruct realiza mapeamentos básicos.
> 

```java
// Exemplo de DTO e Entidade
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    // getters e setters...
}

public class UsuarioEntity {
    private Long id;
    private String nomeCompleto;
    private String email;
    // getters e setters...
}

```

```java
@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    // MapStruct, ao gerar a implementação, fará:
    // usuarioDTO.getId() → usuarioEntity.setId(...)
    // usuarioDTO.getNome() → usuarioEntity.setNome(...) (quando tiver mesmo nome e tipo)
    // usuarioDTO.getEmail() → usuarioEntity.setEmail(...)
    UsuarioEntity dtoParaEntity(UsuarioDTO usuarioDTO);
    UsuarioDTO entityParaDTO(UsuarioEntity usuarioEntity);
}

```

- **Mapeamento Automático**:
    - Campos com nomes e tipos idênticos são mapeados sem necessidade de anotação.
    - Para nomes ou tipos diferentes, é preciso indicar explicitamente com `@Mapping`.

### 2.2. Definição de Métodos Customizados

Para converter tipos incompatíveis (ex.: `String` → `LocalDate`), é possível definir métodos auxiliares no próprio mapper:

```java
@Mapper(componentModel = "spring")
public interface ClienteMapper {

    @Mapping(target = "dataNascimento", source = "dataNascimentoStr")
    Cliente entityParaCliente(ClienteDTO dto);

    // Método customizado para conversão de String para LocalDate
    default LocalDate mapData(String dataNascimentoStr) {
        return LocalDate.parse(dataNascimentoStr, DateTimeFormatter.ISO_DATE);
    }
}

```

**Como funciona**:

- MapStruct, ao compilar, identifica que `ClienteDTO.dataNascimentoStr` (String) precisa ser convertida para `Cliente.dataNascimento` (LocalDate).
- Ele procura um método `mapData(String)` no mapper ou em classes referenciadas para realizar a conversão.

### 2.3. Uso de Expressões e `expression`

Caso a lógica seja simples e você queira incluir em linha, é possível usar a propriedade `expression` de `@Mapping`:

```java
@Mapper(componentModel = "spring", imports = {DateTimeFormatter.class})
public interface PedidoMapper {

    @Mapping(target = "dataFormatada", expression = "java(pedido.getData().format(DateTimeFormatter.ofPattern(\"dd/MM/yyyy\")))")
    PedidoDTO entityParaDTO(Pedido pedido);
}

```

- **`expression`**: recebe um trecho de código Java.
- **`imports`**: necessário para classes referenciadas na expressão.

### 2.4. `@Mapping` com `qualifiedByName` e `@Named`

Quando há múltiplos métodos que podem fazer conversões para o mesmo tipo, é recomendado usar qualifiers para indicar qual método usar:

```java
@Mapper(componentModel = "spring")
public interface FuncionarioMapper {

    @Mapping(target = "dataAdmissao", source = "dataAdmissaoStr", qualifiedByName = "stringParaLocalDate")
    Funcionario entityParaFuncionario(FuncionarioDTO dto);

    @Named("stringParaLocalDate")
    default LocalDate converterData(String data) {
        return LocalDate.parse(data, DateTimeFormatter.ISO_DATE);
    }

    @Named("stringParaLocalDatePtBr")
    default LocalDate converterDataPtBr(String data) {
        return LocalDate.parse(data, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
}

```

- **`@Named`**: define um nome para o método de conversão customizada.
- **`qualifiedByName`**: faz referência a um método marcado com determinado nome, garantindo a escolha correta do conversor.

### 2.5. `@AfterMapping` e `@BeforeMapping`

Para adicionar lógica que deve ser executada antes ou após o mapeamento “padrão”, MapStruct disponibiliza essas anotações:

```java
@Mapper(componentModel = "spring")
public abstract class VendaMapper {

    @Mapping(target = "totalLiquido", ignore = true) // Será calculado após mapeamento
    public abstract VendaDTO entityParaDTO(Venda venda);

    @AfterMapping
    protected void calcularTotalLiquido(Venda venda, @MappingTarget VendaDTO dto) {
        BigDecimal descontos = venda.getDescontos().stream()
                                   .map(Desconto::getValor)
                                   .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalBruto = venda.getItens().stream()
                                     .map(Item::getPrecoTotal)
                                     .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalLiquido(totalBruto.subtract(descontos));
    }
}

```

- **`@BeforeMapping`**: executa lógica antes do mapeamento; útil para preparar dados (e.g., normalizar texto).
- **`@AfterMapping`**: executa lógica após o mapeamento; ideal para cálculos agregados, atribuição de campos dependentes de múltiplos campos de origem.
- **`@MappingTarget`**: indica o objeto de destino que está sendo mapeado, permitindo alteração direta.

### 2.6. Decorators e Estratégia de Herança

Em cenários altamente customizados, pode-se usar a pattern de **Decorator** para sobrepor ou complementar o comportamento do mapper gerado:

1. Defina a interface do mapper:
    
    ```java
    @Mapper(componentModel = "spring")
    public interface ProdutoMapper {
        ProdutoDTO toDto(Produto produto);
        Produto toEntity(ProdutoDTO dto);
    }
    
    ```
    
2. Implemente um decorator:
    
    ```java
    @Component
    public abstract class ProdutoMapperDecorator implements ProdutoMapper {
        private final ProdutoMapper delegate;
    
        public ProdutoMapperDecorator(ProdutoMapper delegate) {
            this.delegate = delegate;
        }
    
        @Override
        public ProdutoDTO toDto(Produto produto) {
            ProdutoDTO dto = delegate.toDto(produto);
            // Lógica customizada — ex.: mascarar preço para usuários não autorizados
            if (!UsuarioContexto.isAdmin()) {
                dto.setPreco(null);
            }
            return dto;
        }
    
        @Override
        public Produto toEntity(ProdutoDTO dto) {
            // Possível lógica antes ou depois de delegar
            return delegate.toEntity(dto);
        }
    }
    
    ```
    
3. Informe ao MapStruct para usar o decorator:
    
    ```java
    @Mapper(
        componentModel = "spring",
        uses = {},
        implementationName = "ProdutoMapperImpl",
        implementationPackage = "<pacote>.impl",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
    )
    @DecoratedWith(ProdutoMapperDecorator.class)
    public interface ProdutoMapper {
        // métodos...
    }
    
    ```
    
- **Vantagens**:
    - Separação clara entre código gerado (pelo MapStruct) e lógica manual.
    - Facilidade de manutenção e testes unitários.

---

## 3. Cenários de Restrição ou Não Aplicação

1. **Mapeamento Extremamente Dinâmico em Tempo de Execução**
    - Caso seja necessário construir mapeamentos totalmente dinâmicos com campos não conhecidos em build time, MapStruct não é indicado, pois requer definição estática das interfaces e anotações.
2. **Conversões Muito Complexas ou que Dependem de Contexto Raramente Conhecido em Build Time**
    - Se a lógica de mapeamento exige acesso a recursos externos (e.g., banco de dados, serviços REST) durante a execução, MapStruct por si só não basta — melhor usar serviços intermediários ou factories manuais.
3. **Projetos que Não Dependem de Alta Performance de Mapeamento**
    - Em sistemas pequenos ou scripts de conversão pontuais, implementar manualmente pode ser mais direto. No entanto, ainda assim, MapStruct traz robustez e segurança de tipagem.
4. **Quando Já se Utiliza Outro Framework de Mapeamento com Recursos Ainda Mais Complexos**
    - Ex.: Dozer ou ModelMapper oferecem mapeamentos dinâmicos via reflexão. Se a equipe já está acostumada a usar esses e necessita de mapeamentos baseados em convenções em runtime, migrar para MapStruct exigirá reengenharia.

---

## 4. Componentes Chave Associados

### 4.1. Anotações Principais

- **`@Mapper`**
    - Marca uma interface ou classe abstrata como “gerenciável” pelo MapStruct.
    - Atributos principais:
        - `componentModel`: define o modelo de injeção de dependência. Para Spring, use `"spring"`.
        - `uses`: lista de classes adicionais que contêm métodos de conversão a serem usados pelo mapper.
        - `unmappedTargetPolicy`: define como lidar com campos não mapeados (e.g., `ReportingPolicy.IGNORE` ou `WARN`).
- **`@Mapping`**
    - Utilizada em métodos de mapeamento para especificar correspondência entre campos de origem e destino.
    - Atributos principais:
        - `source`: campo de origem.
        - `target`: campo de destino.
        - `expression`: permite especificar um trecho de código Java para conversão inline.
        - `qualifiedByName`: faz referência a métodos anotados com `@Named` para converter o dado.
- **`@Named`**
    - Define um identificador para métodos de conversão customizada, possibilitando o uso via `qualifiedByName`.
- **`@AfterMapping` / `@BeforeMapping`**
    - Métodos anotados são executados após ou antes do mapeamento gerado.
    - Deve receber como parâmetro o objeto de destino anotado com `@MappingTarget` (e opcionalmente o objeto origem).
- **`@DecoratedWith`**
    - Especifica um decorator que envolve o mapper gerado, permitindo customizações pós-geração.
    - Trabalha em conjunto com `@Component` para que o Spring injete o decorator em vez da implementação direta.

### 4.2. Interfaces e Classes de Implementação Geradas

- Ao compilar, por exemplo, uma interface `UsuarioMapper`, MapStruct gerará uma classe `UsuarioMapperImpl` (padrão).
- Essa classe contém o código Java “cru” que copia campo a campo, chama métodos auxiliares e executa lógicas definidas via `expression`, `@AfterMapping`, etc.

### 4.3. Qualifiers e `@Qualifier`

- Em contextos Spring, pode-se utilizar `@Qualifier` para distinguir implementações de interfaces de conversão.
- É útil quando há múltiplos mappers que convertem tipos similares, para injetar especificamente o que se deseja.

### 4.4. Configuração de Component Model (Spring)

- Com `componentModel = "spring"`, MapStruct anota a implementação gerada com `@Component`, permitindo a injeção em classes como:
    
    ```java
    @Service
    public class UsuarioService {
        private final UsuarioMapper usuarioMapper;
    
        @Autowired
        public UsuarioService(UsuarioMapper usuarioMapper) {
            this.usuarioMapper = usuarioMapper;
        }
    
        // Uso do mapper dentro do service...
    }
    
    ```
    

---

## 5. Melhores Práticas e Padrões de Uso

1. **Definir Convenções Claras de Nomes nos DTOs e Entidades**
    - Quanto mais uniformes os campos, menos anotações `@Mapping` são necessárias.
    - Utilize sufixos padronizados para diferenciar campos (e.g., `dataNascimentoStr`, `dataNascimentoEpoch`) e crie métodos auxiliares com nomes coerentes.
2. **Isolar Lógica de Conversão Complexa em Métodos Auxiliares Reutilizáveis**
    - Em vez de escrever `expression` longa, crie um método `@Named` ou em uma classe utilitária e referencie com `qualifiedByName`.
    - Facilita testes unitários e manutenção.
3. **Evitar Excesso de Lógica em `@AfterMapping`**
    - Use este recurso apenas para ajustes finais. Para regras de negócio extensas, é melhor processar antes do mapeamento ou em serviços especializados.
4. **Configurar `unmappedTargetPolicy` Apropriadamente**
    - Em projetos grandes, deixe como `WARN` para alertar campos não mapeados e evitar dados perdidos sem perceber.
    - Em protótipos, `IGNORE` pode agilizar, mas em produção recomenda-se vigilância.
5. **Documentar Métodos de Mapeamento e Nomear Claramente**
    - Use JavaDoc para descrever o propósito de cada conversão customizada.
    - Nomes como `converterDataPtBr`, `mascararSenha`, `tratarEnderecoNulo` ajudam na legibilidade.
6. **Utilizar Testes Unitários de Mapeamento**
    - Crie testes que validem mapeamentos críticos, assegurando que conversões customizadas e método `@AfterMapping` funcionem conforme esperado.
7. **Modularizar Mappers com Propósito Único**
    - Prefira ter um mapper por “agregação de contexto” (e.g., `UsuarioMapper`, `PedidoMapper`), evitando interfaces gigantescas.
    - Em sistemas com múltiplos módulos, agrupe mappers relacionados em pacotes coesos.

---

## 6. Exemplo Prático Completo

### 6.1. Cenário

Imagine um sistema de e-commerce onde:

- A entidade de JPA `Order` possui campos complexos, como lista de itens, descontos, data de criação e relacionamento com `Customer`.
- O DTO `OrderDTO` exige campos calculados (ex.: `totalLiquido`), formatação de data e mapeamento parcial de informações do cliente (ex.: apenas nome e email).

### 6.2. Classes de Domínio

```java
// Entidade JPA
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customer;

    private LocalDateTime creationDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<Discount> discounts;
    // getters e setters...
}

// Itens do pedido
@Entity
public class OrderItem {
    @Id
    @GeneratedValue
    private Long id;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    // getters e setters...
}

// Descontos aplicados
@Entity
public class Discount {
    @Id
    @GeneratedValue
    private Long id;
    private String description;
    private BigDecimal value;
    // getters e setters...
}

// Cliente associado
@Entity
public class Customer {
    @Id
    @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    // getters e setters...
}

```

### 6.3. DTOs de Destino

```java
public class OrderDTO {
    private Long id;
    private String customerName;       // Deve ser "firstName lastName"
    private String customerEmail;
    private String creationDateFormatted; // Ex.: "05/06/2025 14:30"
    private BigDecimal totalBruto;     // Soma de price * quantity de cada item
    private BigDecimal totalDescontos; // Soma de todos discounts.value
    private BigDecimal totalLiquido;   // totalBruto - totalDescontos
    private List<OrderItemDTO> itens;
    // getters e setters...
}

public class OrderItemDTO {
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subTotal; // price * quantity
    // getters e setters...
}

```

### 6.4. Definição do Mapper

```java
@Mapper(
    componentModel = "spring",
    imports = {
        DateTimeFormatter.class,
        BigDecimal.class,
        Collectors.class
    }
)
public abstract class OrderMapper {

    // Mapeamento principal de Order para OrderDTO
    @Mapping(target = "customerName", expression = "java(concatenarNome(order.getCustomer()))")
    @Mapping(target = "customerEmail", source = "order.customer.email")
    @Mapping(target = "creationDateFormatted", expression = "java(formatarData(order.getCreationDate()))")
    @Mapping(target = "totalBruto", ignore = true)      // Calcular em @AfterMapping
    @Mapping(target = "totalDescontos", ignore = true) // Calcular em @AfterMapping
    @Mapping(target = "totalLiquido", ignore = true)   // Calcular em @AfterMapping
    @Mapping(target = "itens", source = "items")
    public abstract OrderDTO toDTO(Order order);

    // Mapeamento de OrderItem para OrderItemDTO
    @Mapping(target = "subTotal", expression = "java(calcularSubTotal(item))")
    public abstract OrderItemDTO itemParaDTO(OrderItem item);

    // Métodos utilitários

    @Named("concatenarNome")
    protected String concatenarNome(Customer customer) {
        return customer.getFirstName() + " " + customer.getLastName();
    }

    @Named("formatarData")
    protected String formatarData(LocalDateTime data) {
        return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }

    @Named("calcularSubTotal")
    protected BigDecimal calcularSubTotal(OrderItem item) {
        return item.getPrice().multiply(new BigDecimal(item.getQuantity()));
    }

    // Cálculos agregados após mapeamento
    @AfterMapping
    protected void calcularTotais(Order order, @MappingTarget OrderDTO dto) {
        BigDecimal totalBruto = order.getItems().stream()
            .map(this::calcularSubTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDescontos = order.getDiscounts().stream()
            .map(Discount::getValue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setTotalBruto(totalBruto);
        dto.setTotalDescontos(totalDescontos);
        dto.setTotalLiquido(totalBruto.subtract(totalDescontos));
    }
}

```

### Explicações-chave:

1. **Anotações `@Mapping` com `expression`**
    - `customerName`: chama `concatenarNome(...)` para unir primeiro nome e sobrenome.
    - `creationDateFormatted`: chama `formatarData(...)` para aplicar padrão de data.
2. **Uso de `@Named`**
    - Métodos auxiliares recebem `@Named`, mas aqui não se utiliza `qualifiedByName` explicitamente, pois as expressões Java invocam diretamente esses métodos.
3. **Relação de Coleções**
    - MapStruct mapeia automaticamente a lista de `OrderItem` para `List<OrderItemDTO>` ao detectar método `itemParaDTO(OrderItem)`.
4. **`@AfterMapping` para Cálculos Agregados**
    - Após o mapeamento básico, recalcula totais e define em `OrderDTO`.

### 6.5. Configuração no Spring Boot

- **Dependências Maven** (excerpt):
    
    ```xml
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>1.5.5.Final</version>
        <scope>provided</scope>
    </dependency>
    
    ```
    
- **Plugin para Anotações** (exemplo Gradle):
    
    ```groovy
    plugins {
        id 'java'
        id 'org.springframework.boot' version '3.0.0'
        id 'io.spring.dependency-management' version '1.0.11.RELEASE'
        id 'org.mapstruct' version '1.5.5.Final'
    }
    
    dependencies {
        implementation 'org.mapstruct:mapstruct:1.5.5.Final'
        annotationProcessor 'org.mapstruct:mapstruct-processor:1.5.5.Final'
        // demais dependências...
    }
    
    ```
    
- **Injeção no Service**:
    
    ```java
    @Service
    public class OrderService {
        private final OrderMapper orderMapper;
        private final OrderRepository orderRepository;
    
        @Autowired
        public OrderService(OrderMapper orderMapper, OrderRepository orderRepository) {
            this.orderMapper = orderMapper;
            this.orderRepository = orderRepository;
        }
    
        public OrderDTO buscarPorId(Long id) {
            Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado"));
            return orderMapper.toDTO(order);
        }
    }
    
    ```
    

---

## 7. Sugestões para Aprofundamento

- **Documentação Oficial MapStruct**
    - Ler seções avançadas sobre mapeamentos de herança, mapeamento condicional e uso de contextos (ex.: mapeamento de ciclo ou dependências externas).
- **Padrões de Projeto com MapStruct**
    - Explorar como arquiteturas em camadas (DTO → Service → Repositório) se beneficiam de mappers bem estruturados.
    - Implementar testes de integração focados em verificação de mapeamento em endpoints REST.
- **Performance e Benchmarking**
    - Comparar desempenho de MapStruct com outras soluções (ModelMapper, Dozer) em cenários de grande volume de dados.
    - Estudar como otimizar alocação de objetos e fluxo de dados em mapeamentos extensos.
- **Alternativas e Complementos**
    - Integrar MapStruct com Lombok para reduzir boilerplate em getters/setters.
    - Avaliar o uso de `Immutables` ou `Record` no Java 17+ em conjunto com MapStruct.
- **Casos de Uso Comuns**
    - Mapeamento entre camadas de serviço multi-banco de dados.
    - Conversão de entidades de domínio ricas para DTOs planos em APIs REST.
    - Uso de MapStruct em microserviços, onde DTOs publicados devem ser padronizados entre equipes.

---

Com essa estrutura, você dispõe tanto de uma visão concisa quanto de detalhes aprofundados para implementar lógica de mapeamento customizada com MapStruct em um projeto Spring Boot. Caso precise de exemplos adicionais de cenários específicos, demonstrações de testes unitários ou integração com outras bibliotecas, sinta-se à vontade para solicitar.