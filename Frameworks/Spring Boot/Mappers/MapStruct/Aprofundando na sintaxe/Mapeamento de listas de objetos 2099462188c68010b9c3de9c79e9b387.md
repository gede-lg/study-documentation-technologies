# Mapeamento de listas de objetos

---

## 1. Introdução

MapStruct é um framework de mapeamento de Java Bean para Java Bean que gera implementações em tempo de compilação, garantindo alto desempenho e segurança de tipo. No contexto de aplicações Spring Boot, ele permite converter objetos de domínio (entidades, modelos de persistência) em DTOs/UI Models e vice-versa, de forma simples e declarativa, graças a anotations que descrevem as regras de mapeamento. Este guia foca especificamente em como MapStruct trata coleções (listas, conjuntos, arrays) de objetos, explorando desde conceitos básicos até aspectos avançados e casos de uso complexos.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conhecendo-o-mapstruct-e-por-que-us%C3%A1-lo)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração do MapStruct em um projeto Spring Boot
    2. Definição de mapeadores simples (de objeto único)
    3. Mapeamento automático de listas (conversão implícita)
    4. Personalizando o mapeamento de listas com `@IterableMapping`
    5. Mapeamento de coleções heterogêneas e genéricas
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. `@Mapper` e `componentModel="spring"`
    2. `@Mapping`, `@Mappings` e `@Named`
    3. `@IterableMapping` e `@Mapping#qualifiedByName`
    4. `MapperConfig` e uso de herança de configurações
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

### 3.1 O que é MapStruct?

- **Mapeamento em tempo de compilação**: Em vez de usar reflexão em runtime, MapStruct gera implementações concretas (classes) durante a compilação, oferecendo melhor desempenho e detecção precoce de erros (como campos faltantes ou tipos incompatíveis).
- **Declaração via Anotações**: Utiliza anotações como `@Mapper`, `@Mapping`, `@IterableMapping` para descrever como os campos de uma classe devem ser copiados/convertidos para outra.
- **Integração com Spring**: Com `componentModel="spring"`, os mapeadores são registrados como beans do Spring, permitindo injeção automática via `@Autowired`.

### 3.2 Por que mapear listas de objetos?

- **DTOs e Camada de Apresentação**: Em aplicações REST, frequentemente retornamos listas de DTOs ao invés de entidades, aplicando transformações (por exemplo, mascarar dados sensíveis, converter datas, agrupar campos).
- **Conversão em Massa**: Ao mapear uma única instância, é trivial; porém, em coleções, queremos reduzir código boilerplate e evitar laços manuais (`for`, `stream().map(...)`). MapStruct faz isso automaticamente, chamando o método de mapeamento de elemento para cada item na coleção.

### 3.3 Funcionamento Básico do Mapeamento de Listas

- **Detecção Automática**: Se você definiu um método mapeador para converter `Entity` em `DTO`, MapStruct gera, por padrão, um método para converter `List<Entity>` em `List<DTO>`, copiando elemento a elemento.
- **Tipos de Coleções Suportados**: `List`, `Set`, `Iterable` e até arrays (por ex. `Entity[]` ↔ `DTO[]`). A implementação padrão cria uma nova coleção do mesmo tipo da origem (por ex., `ArrayList<T>` para uma `List<T>`).

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Configuração do MapStruct em um projeto Spring Boot

1. **Dependência Maven** (caso use Maven):
    
    ```xml
    <dependencies>
      <!-- MapStruct Annotations -->
      <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
      </dependency>
    
      <!-- MapStruct Processor (implementação em tempo de compilação) -->
      <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>1.5.5.Final</version>
        <scope>provided</scope>
      </dependency>
    
      <!-- Caso queira usar Lombok em conjunto (opcional) -->
      <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.26</version>
        <scope>provided</scope>
      </dependency>
    </dependencies>
    
    <build>
      <plugins>
        <!-- Plugin do Java Compiler, para habilitar annotations -->
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.10.1</version>
          <configuration>
            <source>11</source>
            <target>11</target>
            <annotationProcessorPaths>
              <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.5.5.Final</version>
              </path>
              <!-- Se usar Lombok -->
              <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.26</version>
              </path>
            </annotationProcessorPaths>
          </configuration>
        </plugin>
      </plugins>
    </build>
    
    ```
    
2. **Dependência Gradle** (caso use Gradle Kotlin DSL):
    
    ```kotlin
    plugins {
        java
        id("org.springframework.boot") version "3.0.6"
        id("io.spring.dependency-management") version "1.1.0"
    }
    
    dependencies {
        implementation("org.mapstruct:mapstruct:1.5.5.Final")
        annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
        // Caso use Lombok
        compileOnly("org.projectlombok:lombok:1.18.26")
        annotationProcessor("org.projectlombok:lombok:1.18.26")
    }
    
    tasks.withType<JavaCompile> {
        options.annotationProcessorPath = configurations.annotationProcessor.get()
    }
    
    ```
    
3. **Estrutura de Pacotes (exemplo)**:
    
    ```
    src/main/java/
    └── com
        └── exemplo
            ├── domain
            │   └── model
            │       ├── Pessoa.java
            │       └── Endereco.java
            ├── dto
            │   ├── PessoaDTO.java
            │   └── EnderecoDTO.java
            └── mapper
                ├── PessoaMapper.java
                └── EnderecoMapper.java
    
    ```
    

---

### 4.2 Definição de Mapeadores Simples (Objeto Único)

### 4.2.1 Exemplo de Entidade e DTO

```java
// src/main/java/com/exemplo/domain/model/Pessoa.java
package com.exemplo.domain.model;

public class Pessoa {
    private Long id;
    private String nome;
    private String email;
    private Endereco endereco;
    // getters e setters
}

```

```java
// src/main/java/com/exemplo/dto/PessoaDTO.java
package com.exemplo.dto;

public class PessoaDTO {
    private Long id;
    private String nome;
    private String email;
    private EnderecoDTO endereco;
    // getters e setters
}

```

### 4.2.2 Mapeador Básico

```java
// src/main/java/com/exemplo/mapper/PessoaMapper.java
package com.exemplo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.exemplo.domain.model.Pessoa;
import com.exemplo.dto.PessoaDTO;

@Mapper(componentModel = "spring")  // registra como bean do Spring
public interface PessoaMapper {

    // Instância via Mappers.getMapper(PessoaMapper.class) ou injeção com Spring
    PessoaMapper INSTANCE = Mappers.getMapper(PessoaMapper.class);

    PessoaDTO toPessoaDTO(Pessoa pessoa);
    Pessoa toPessoaEntity(PessoaDTO pessoaDTO);
}

```

> Observação:
> 
> - `componentModel = "spring"` faz com que a implementação gerada seja registrada como bean e possa ser injetada via `@Autowired`.
> - Se você não especificar `componentModel`, a instância pode ser obtida via `PessoaMapper.INSTANCE`.

---

### 4.3 Mapeamento Automático de Listas

Se já existe um método `toPessoaDTO(Pessoa)`, MapStruct gera, de modo implícito, um método para `List<Pessoa> -> List<PessoaDTO>` sem necessidade de definição manual.

### 4.3.1 Definindo o Método de Lista (opcional)

Você pode adicionar assinaturas explícitas ao mapper para “deixar claro” que precisa de métodos de coleção, embora MapStruct geralmente os crie automaticamente:

```java
// Dentro de PessoaMapper
List<PessoaDTO> toPessoaDTOList(List<Pessoa> pessoas);
List<Pessoa> toPessoaEntityList(List<PessoaDTO> pessoasDTO);

```

> Comportamento Padrão:
> 
> - A implementação gerada cria uma nova `ArrayList<>`, percorre cada elemento de `pessoas` e invoca `toPessoaDTO` para cada item.

### 4.3.2 Exemplo de Uso em um Service

```java
@Service
public class PessoaService {
    private final PessoaRepository pessoaRepository;
    private final PessoaMapper pessoaMapper;

    public PessoaService(PessoaRepository pessoaRepository, PessoaMapper pessoaMapper) {
        this.pessoaRepository = pessoaRepository;
        this.pessoaMapper = pessoaMapper;
    }

    public List<PessoaDTO> listarTodas() {
        List<Pessoa> entidades = pessoaRepository.findAll();
        return pessoaMapper.toPessoaDTOList(entidades);
    }
}

```

---

### 4.4 Personalizando o Mapeamento de Listas com `@IterableMapping`

Em cenários avançados, podemos ter situações nas quais:

- Queremos utilizar um método de conversão específico para cada elemento de uma coleção sem depender do `toPessoaDTO` genérico.
- Desejamos aplicar um `qualifiedByName` ou usar diferentes estratégias (por exemplo, ignorar campos nulos ou converter listas de IDs).

### 4.4.1 `@IterableMapping` e Tipos de Qualificador

**Exemplo:** Suponha que você tenha dois métodos de conversão em **PessoaMapper**:

1. Método padrão `toPessoaDTO` (mapeia todos os campos).
2. Método especializado `toPessoaDTOSemEmail` (ignora o campo `email`).

```java
@Mapper(componentModel = "spring")
public interface PessoaMapper {
    PessoaDTO toPessoaDTO(Pessoa pessoa);

    @Named("semEmail")
    @Mapping(target = "email", ignore = true)
    PessoaDTO toPessoaDTOSemEmail(Pessoa pessoa);

    // Uso de @IterableMapping para especificar o método a ser aplicado em cada elemento da lista
    @IterableMapping(qualifiedByName = "semEmail")
    List<PessoaDTO> toPessoaDTOListWithoutEmail(List<Pessoa> pessoas);
}

```

- **`@Named("semEmail")`** marca o método especializado para que possa ser referenciado.
- **`@IterableMapping(qualifiedByName = "semEmail")`** faz com que o MapStruct utilize `toPessoaDTOSemEmail` em vez de `toPessoaDTO` ao mapear cada elemento da lista.

---

### 4.4.2 Ignorando Nulos ao Mapear Listas

Suponha que alguns `Pessoa` em `List<Pessoa>` possam ser nulos e você deseja ignorá-los (não incluir entradas nulas no resultado).

```java
@Mapper(componentModel = "spring")
public interface PessoaMapper {

    PessoaDTO toPessoaDTO(Pessoa pessoa);

    @IterableMapping(nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
    List<PessoaDTO> toPessoaDTOListIgnoredNulls(List<Pessoa> pessoas);
}

```

- **`nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT`**: gera uma lista com entradas “default” (por exemplo, instância vazia de `PessoaDTO`) para cada elemento nulo.
- Alternativamente, você pode usar `NullValueMappingStrategy.RETURN_NULL` para manter `null` no local correspondente.

> Nota: por padrão, se um elemento da lista de origem for null, o elemento correspondente na lista destino será null.
> 

---

### 4.5 Mapeamento de Coleções Heterogêneas e Genéricas

### 4.5.1 Listas com Tipos Diferentes Entre Origem e Destino

Imagine que você tenha:

- `List<Long>` representando IDs de endereços em `PessoaRequestDTO`.
- Precisa buscar (`findById`) cada `Endereco` e montar uma `List<Endereco>` para atribuir a `Pessoa`.

```java
// DTO de entrada
public class PessoaRequestDTO {
    private String nome;
    private String email;
    private List<Long> enderecoIds;
    // getters e setters
}

// Entidade Pessoa
public class Pessoa {
    private Long id;
    private String nome;
    private String email;
    private List<Endereco> enderecos;
    // getters e setters
}

// Mapeador
@Mapper(componentModel = "spring", uses = EnderecoService.class)
public interface PessoaRequestMapper {

    // Mapear campos simples diretamente
    @Mapping(target = "enderecos", source = "enderecoIds")
    Pessoa toPessoa(PessoaRequestDTO dto);

    // Mapear ID Long -> Endereco via método auxiliar (em EnderecoService)
    default Endereco map(Long id) {
        // Exemplo: buscar no service ou repository
        return enderecoService.findById(id);
    }
}

```

Nesse exemplo:

- A presença do método `default Endereco map(Long id)` no mesmo mapper faz com que MapStruct o utilize para converter cada `Long` em `Endereco`.
- Logo, `List<Long> enderecoIds` gera, automaticamente, `List<Endereco>` chamando `map(Long)` para cada item.

### 4.5.2 Mapeamento de Arrays e Conversão entre Tipos de Coleção

- `Endereco[]` ↔ `List<EnderecoDTO>` também funciona: basta definir métodos com essas assinaturas, e MapStruct gerará o código.
- Se desejar converter `Set<Pessoa>` em `List<PessoaDTO>`, defina métodos `Set<PessoaDTO> toPessoaDTOSet(Set<Pessoa> pessoas)` etc.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Mapeamentos Dinâmicos em Tempo de Execução**
    - Quando as regras de mapeamento dependem de condições dinâmicas decididas em runtime (por ex. colunas escolhidas pelo usuário), MapStruct, que gera o código estático em compile-time, não é adequado. Nestes casos, usar frameworks baseados em reflexão (ModelMapper, Dozer) ou construções manuais é mais indicado.
2. **Mapeamento de Classes Não Conhecidas (Genéricas)**
    - Se você não sabe, em compile-time, o tipo exato de objeto, e precisa mapear genéricamente (por exemplo: `Map<String,Object> → MyDTO`), MapStruct não conseguirá gerar código.
3. **Transformações Muito Complexas**
    - Cálculos pesados, fusões de vários objetos ou condições intrincadas (`if/else`) que envolvem múltiplas fontes, podem tornar o código MapStruct extenso ou difícil de manter. Nesses casos, métodos auxiliares manuais podem ser preferíveis.
4. **Coleções Muito Grandes e Consumo de Memória**
    - Em coleções gigantes (milhares de elementos), a criação de novas listas objetas representa overhead de memória. Se for necessário um mapeamento “lazy” (sob demanda), é melhor usar streams manuais ou iteradores.

---

## 6. Componentes Chave Associados

### 6.1 `@Mapper` e `componentModel="spring"`

- **`@Mapper`**: Indica que a interface (ou classe abstrata) deve ter uma implementação gerada pelo MapStruct.
- **`componentModel`**:
    - `"default"` (padrão): gera uma implementação instanciável via `Mappers.getMapper(...)`.
    - `"spring"`: registra o mapper como bean do Spring (anotado com `@Component`).
    - `"jsr330"`: gera `@Named` e usa injeção JSR-330.
    - `"cdi"`: gera a classe como bean CDI (`@ApplicationScoped`).

```java
@Mapper(componentModel = "spring", uses = {EnderecoMapper.class})
public interface PessoaMapper {
    // mapeamentos
}

```

- **`uses`**: lista classes auxiliares para mapear atributos complexos (por ex. `EnderecoMapper`).

---

### 6.2 `@Mapping`, `@Mappings` e `@Named`

- **`@Mapping(source = "origem", target = "destino")`**: Mapeia explicitamente um campo com diferença de nome.
- **`@Mappings`**: Agrupa múltiplas anotações `@Mapping`.
- **`@Named("nome")`**: Marca um método ou uma configuração como qualificadora para uso com `qualifiedByName`.

```java
@Mapper(componentModel = "spring")
public interface EnderecoMapper {
    @Mapping(source = "rua", target = "street")
    @Mapping(source = "cep", target = "postalCode")
    EnderecoDTO toEnderecoDTO(Endereco endereco);

    @Named("toEnderecoDTOSemBairro")
    @Mapping(source = "rua", target = "street")
    @Mapping(target = "bairro", ignore = true)
    EnderecoDTO toEnderecoDTOSemBairro(Endereco endereco);
}

```

---

### 6.3 `@IterableMapping` e `@Mapping#qualifiedByName`

- **`@IterableMapping`**: Configuração global para coleções, definindo como cada elemento deve ser convertido:
    - `qualifiedByName`: especifica o método de elemento a usar (marcado com `@Named`).
    - `nullValueMappingStrategy`: define como lidar com elementos `null`.
    - `elementTargetType`: para `Iterable<?>`/`Set<?>` genéricos, especifica o tipo resultante.

```java
@IterableMapping(qualifiedByName = "toEnderecoDTOSemBairro")
List<EnderecoDTO> mapEnderecosWithoutBairro(List<Endereco> enderecos);

```

- **`@Mapping#qualifiedByName`** (para atributos não-coleção): força uso de método específico para converter um campo simples.

---

### 6.4 `@MapperConfig` e Herança de Configurações

- **`@MapperConfig`**: Permite criar configurações compartilhadas (por ex. política global de nulls, estratégias de montagem de builder, componentModel).
- Em grandes projetos, você pode definir um `MapperConfig` base e reutilizá-lo em diversos mappers:

```java
@MapperConfig(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CentralMapperConfig {
}

```

```java
@Mapper(config = CentralMapperConfig.class, uses = {EnderecoMapper.class})
public interface PessoaMapper {
    // ...
}

```

---

## 7. Melhores Práticas e Padrões de Uso

1. **Organização de Mappers por Contexto**
    - Separe mappers por domínio: `domain.mapper`, `service.mapper` ou `dto.mapper`, evitando mappers inchados que misturam várias responsabilidades.
2. **Reutilização de Mapeadores Auxiliares**
    - Use `uses = {OutroMapper.class}` para delegar partes específicas (por ex. `EnderecoMapper` é usado em `PessoaMapper`). Assim, cada mapper se mantém coeso.
3. **Tratar Nulls de Forma Consistente**
    - Decida uma política global (no `MapperConfig`) para ignorar ou sobrescrever propriedades nulas. Por ex.:
        
        ```java
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
        
        ```
        
4. **Mapeamento Explícito de Campos Divergentes**
    - Sempre anote campos com nomes diferentes (`source` e `target`), evitando comportamentos inesperados.
    - Utilize `@InheritConfiguration` para herdar configurações de outro método quando houver pequenas variações.
5. **Testes Unitários para Mappers**
    - Crie testes que cobrem:
        - Conversão de objeto único (valores preenchidos, valores nulos).
        - Conversão de lista com elemento nulo (verificar lista resultante e posição de nulos).
        - Uso de qualificadores (`@Named`).
6. **Evitar Lógica Complexa nos Mappers**
    - MapStruct deve apenas mapear dados. Se houver regras de negócio (por ex. cálculo de algum campo, chamadas a API externas), prefira método auxiliar ou serviço.
    - Use métodos `default` ou `@AfterMapping`/`@BeforeMapping` para casos pontuais, mas sem introduzir código volumoso.
7. **Uso de `Iterable` vs `List`**
    - Se quiser suportar vários tipos de coleção, use `Iterable<T>` nas assinaturas, pois a implementação gerada é genérica. Mas, ao expor a API, prefira `List<T>`/`Set<T>` para maior clareza.
8. **Mapear Propriedades Imutáveis**
    - Se sua classe destino for imutável ou usar builder, configure `builder` em MapStruct:
        
        ```java
        @Mapper(builder = @Builder(disableBuilder = false))
        public interface PessoaMapper { … }
        
        ```
        
    - Ou anote os construtores apropriados para MapStruct usar o padrão builder.

---

## 8. Exemplo Prático Completo

A seguir, um cenário fim-a-fim:

1. **Contexto**:
    - Temos uma entidade `Pedido` que contém uma lista de `ItemPedido`.
    - Queremos expor uma API REST em Spring Boot que retorne uma lista de `PedidoDTO`, onde cada item é representado por `ItemPedidoDTO`.
2. **Estrutura de Pacotes**:
    
    ```
    com.exemplo
    ├── domain
    │   └── model
    │       ├── Pedido.java
    │       └── ItemPedido.java
    ├── dto
    │   ├── PedidoDTO.java
    │   └── ItemPedidoDTO.java
    ├── mapper
    │   ├── PedidoMapper.java
    │   └── ItemPedidoMapper.java
    └── service
        └── PedidoService.java
    
    ```
    

### 8.1 Entidades

```java
// com/exemplo/domain/model/ItemPedido.java
package com.exemplo.domain.model;

import java.math.BigDecimal;

public class ItemPedido {
    private Long id;
    private String descricao;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    // getters e setters
}

```

```java
// com/exemplo/domain/model/Pedido.java
package com.exemplo.domain.model;

import java.time.LocalDateTime;
import java.util.List;

public class Pedido {
    private Long id;
    private LocalDateTime dataPedido;
    private String cliente;
    private List<ItemPedido> itens;
    // getters e setters
}

```

### 8.2 DTOs

```java
// com/exemplo/dto/ItemPedidoDTO.java
package com.exemplo.dto;

public class ItemPedidoDTO {
    private Long id;
    private String descricao;
    private Integer quantidade;
    private String precoUnitarioFormatado;
    // (Exemplo: mapa BigDecimal → String formatado)
    // getters e setters
}

```

```java
// com/exemplo/dto/PedidoDTO.java
package com.exemplo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PedidoDTO {
    private Long id;
    private LocalDateTime dataPedido;
    private String cliente;
    private List<ItemPedidoDTO> itens;
    // getters e setters
}

```

### 8.3 Mapeador de Itens

```java
// com/exemplo/mapper/ItemPedidoMapper.java
package com.exemplo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.exemplo.domain.model.ItemPedido;
import com.exemplo.dto.ItemPedidoDTO;

@Mapper(componentModel = "spring")
public interface ItemPedidoMapper {

    @Mapping(source = "precoUnitario", target = "precoUnitarioFormatado", numberFormat = "#,##0.00")
    ItemPedidoDTO toItemPedidoDTO(ItemPedido item);

    // Se desejado, método inverso:
    //@Mapping(source = "precoUnitarioFormatado", target = "precoUnitario")
    //ItemPedido toItemPedido(ItemPedidoDTO dto);
}

```

- **`numberFormat = "#,##0.00"`**: Formata `BigDecimal precoUnitario` como string com duas casas decimais.

### 8.4 Mapeador de Pedidos (com lista de itens)

```java
// com/exemplo/mapper/PedidoMapper.java
package com.exemplo.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.exemplo.domain.model.Pedido;
import com.exemplo.dto.PedidoDTO;

@Mapper(
    componentModel = "spring",
    uses = { ItemPedidoMapper.class }  // delega mapeamento dos itens
)
public interface PedidoMapper {

    PedidoMapper INSTANCE = Mappers.getMapper(PedidoMapper.class);

    @Mapping(source = "dataPedido", target = "dataPedido")
    // campos com mesmo nome e tipo não precisam de @Mapping explícito; manual aqui só para ilustrar
    PedidoDTO toPedidoDTO(Pedido pedido);

    List<PedidoDTO> toPedidoDTOList(List<Pedido> pedidos);

    // Se necessário método inverso:
    //Pedido toPedidoEntity(PedidoDTO dto);
    //List<Pedido> toPedidoEntityList(List<PedidoDTO> dtos);
}

```

- **O que acontece “por baixo dos panos”**:
    1. Para cada `Pedido` na lista de entrada, MapStruct chama `toPedidoDTO(Pedido)`.
    2. Ao chegar no campo `List<ItemPedido> itens`, MapStruct detecta que existe `ItemPedidoMapper.toItemPedidoDTO(ItemPedido)` (via `uses`), e portanto converte cada `ItemPedido` para `ItemPedidoDTO`, gerando a lista apropriada.

### 8.5 Service e Uso

```java
// com/exemplo/service/PedidoService.java
package com.exemplo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.exemplo.domain.model.Pedido;
import com.exemplo.dto.PedidoDTO;
import com.exemplo.mapper.PedidoMapper;
import com.exemplo.repository.PedidoRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;

    public PedidoService(PedidoRepository pedidoRepository, PedidoMapper pedidoMapper) {
        this.pedidoRepository = pedidoRepository;
        this.pedidoMapper = pedidoMapper;
    }

    public List<PedidoDTO> listarTodosPedidos() {
        List<Pedido> listaPedidos = pedidoRepository.findAll(); // Exemplo: JPA
        return pedidoMapper.toPedidoDTOList(listaPedidos);
    }
}

```

**Testando o Mapeamento de Listas**

- **Cenário de Teste JUnit**:
    
    ```java
    @SpringBootTest
    public class PedidoMapperTest {
    
        @Autowired
        private PedidoMapper pedidoMapper;
    
        @Test
        public void deveMapearListaDePedidosParaDTOS() {
            // Montar objetos de exemplo
            ItemPedido item = new ItemPedido();
            item.setId(1L);
            item.setDescricao("Produto A");
            item.setQuantidade(2);
            item.setPrecoUnitario(new BigDecimal("50.00"));
    
            Pedido pedido = new Pedido();
            pedido.setId(100L);
            pedido.setDataPedido(LocalDateTime.of(2025, 6, 5, 15, 30));
            pedido.setCliente("Cliente Exemplo");
            pedido.setItens(List.of(item));
    
            List<PedidoDTO> dtos = pedidoMapper.toPedidoDTOList(List.of(pedido));
    
            Assertions.assertThat(dtos).hasSize(1);
            Assertions.assertThat(dtos.get(0).getItens()).hasSize(1);
            Assertions.assertThat(dtos.get(0).getItens().get(0).getPrecoUnitarioFormatado()).isEqualTo("50,00");
        }
    }
    
    ```
    
- **Resultado Esperado**:
    - A lista de `Pedido` é convertida em lista de `PedidoDTO`.
    - Cada `ItemPedido` em `Pedido.itens` se torna um `ItemPedidoDTO` em `PedidoDTO.itens`, com `precoUnitarioFormatado` corretamente formatado.

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial do MapStruct**
    - [MapStruct Reference Guide](https://mapstruct.org/documentation/stable/reference/html/)
2. **Blog Posts e Artigos Avançados**
    - “How to Use MapStruct with Spring Boot” (Baeldung)
    - “Custom Collection Mapping in MapStruct” (Dev.to)
3. **Repositório no GitHub**
    - Exemplos práticos e projetos de referência com MapStruct:
        - [mapstruct-examples](https://github.com/mapstruct/mapstruct-examples)
4. **Comparação com Outros Frameworks de Mapeamento**
    - ModelMapper, Dozer, Orika: investigar cenários de uso e benchmarks de desempenho.
5. **Tópicos Avançados**
    - **MapStruct e Builder Patterns**: configurações para classes imutáveis.
    - **MapStruct + Spring Boot + JPA**: evitar “LazyInitializationException” ao mapear associações.
    - **MapStruct com Qualifiers**: uso de `@Qualifier` e `@IterableMapping` para cenários multi-mapeadores.

---

> Resumo Final:
> 
> 
> Este guia explorou desde uma visão geral de MapStruct até a aplicação avançada de mapeamento de listas, incluindo personalizações com `@IterableMapping`, tratamento de nulos, mapeamento de coleções heterogêneas e melhores práticas. Ao dominar essas técnicas, você reduzirá drasticamente o código boilerplate em sua camada de conversão de objetos em aplicações Spring Boot, ganhando performance, segurança de tipos e manutenibilidade.
> 

---

**Boa codificação!**