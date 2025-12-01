# Como mapear atributos com nomes diferentes

---

## 1. Introdução

O MapStruct é uma biblioteca Java para geração automática de código de mapeamento entre objetos (por exemplo, entre entidades JPA e DTOs) em tempo de compilação. Seu principal benefício está na performance e na segurança de tipo, pois gera implementações estáticas sem refletir em tempo de execução. Neste documento, vamos focar especificamente em como mapear atributos que possuem nomes distintos entre as classes de origem e destino, dentro de um contexto Spring Boot.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Declaração de Dependências e Configuração Básica
    2. Exemplo de Classes com Atributos de Nomes Diferentes
    3. Uso de `@Mapping` para Associar Campos de Nomes Distintos
    4. Variações de Sintaxe e Configurações Avançadas
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. Anotações Principais (`@Mapper`, `@Mapping`, `@Mappings`, `@BeanMapping`, etc.)
    2. Configuração de `componentModel` (Spring, CDI, etc.)
    3. Uso de Decorators e Implemetações Customizadas
    4. Mapeamento de Tipos Complexos e Coleções
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    1. Projeto Simplificado: Entidades, DTOs e Mapper
    2. Configuração do Spring Boot para Injeção do Mapper
    3. Uso em Camada de Serviço / Controller
    4. Testes Unitários Verificando o Mapeamento de Campos Distintos
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **MapStruct**: Gera implementações de interfaces de mapeamento em tempo de compilação, evitando reflexão e hot-swapping. Trabalha a partir de anotações, produzindo código Java puro que faz conversões diretas entre objetos.
- **Motivação para Mapear Campos com Nomes Diferentes**:
    - Na prática, muitas vezes modelos de domínio (por exemplo, entidades JPA) possuem convenções de nomenclatura diferentes de objetos de transferência (DTOs), seja por cultura de projeto, legibilidade ou restrições de um front-end.
    - Exemplo: entidade `UsuarioEntity` com campo `dataCriacao`, enquanto o DTO `UsuarioDTO` utiliza `createdAt`.
    - Em cenários em que os nomes divergem, o MapStruct permite explicitar como associar cada campo de origem ao campo de destino usando a anotação `@Mapping`.
- **Por que preferir MapStruct?**
    - **Performance**: Geração de código em tempo de compilação sem uso de reflexão em runtime.
    - **Segurança de Tipo**: Falhas de mapeamento são detectadas em compilação.
    - **Legibilidade**: O código gerado é Java puro, o que facilita debug.
    - **Integração com Spring**: Suporta `componentModel = "spring"`, permitindo a injeção automática dos mapeadores como beans.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Declaração de Dependências e Configuração Básica

No projeto Maven ou Gradle, inclua as dependências do MapStruct e do processador:

```xml
<!-- Exemplo Maven (pom.xml) -->
<dependencies>
  <!-- Dependência principal do MapStruct -->
  <dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
  </dependency>
  <!-- Processador, para gerar código em tempo de compilação -->
  <dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
  </dependency>
</dependencies>

<build>
  <plugins>
    <!-- Plugin do Maven para habilitar o annotation processing -->
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.8.1</version>
      <configuration>
        <source>17</source>
        <target>17</target>
        <annotationProcessorPaths>
          <path>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>1.5.5.Final</version>
          </path>
        </annotationProcessorPaths>
      </configuration>
    </plugin>
  </plugins>
</build>

```

Para Gradle (Kotlin DSL):

```kotlin
plugins {
    id("java")
    id("org.springframework.boot") version "3.0.0"
    id("io.spring.dependency-management") version "1.0.15.RELEASE"
}

dependencies {
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
    // Outras dependências do Spring Boot...
}

tasks.withType<JavaCompile> {
    options.compilerArgs.add("-Amapstruct.defaultComponentModel=spring")
    options.compilerArgs.add("-parameters")
}

```

> Observação: Adicionamos -Amapstruct.defaultComponentModel=spring para que todos os mapeadores usem componentModel = "spring" por padrão, evitando repetição.
> 

---

### 4.2. Exemplo de Classes com Atributos de Nomes Diferentes

Suponha um cenário típico de uma aplicação de gestão de usuários:

```java
// Entidade JPA (origem)
@Entity
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Data de criação no banco de dados
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "nome_completo")
    private String nomeCompleto;

    private String email;

    // Getters e Setters omitidos para brevidade
}

```

```java
// DTO (destino) que será enviado para o front-end
public class UsuarioDTO {
    private Long id;
    private String createdAt;      // Em String, para simplicidade de exibição
    private String fullName;       // Nome diferente de 'nomeCompleto'
    private String emailAddress;   // Nome diferente de 'email'

    // Getters e Setters omitidos para brevidade
}

```

Observe que:

- `UsuarioEntity.dataCriacao` → `UsuarioDTO.createdAt`
- `UsuarioEntity.nomeCompleto` → `UsuarioDTO.fullName`
- `UsuarioEntity.email` → `UsuarioDTO.emailAddress`

---

### 4.3. Uso de `@Mapping` para Associar Campos de Nomes Distintos

Para mapear cada campo com nome distinto, usamos a anotação `@Mapping(source = "...", target = "...")` em nossa interface de mapeamento:

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    // Opcional: obter instância manualmente se não usar Spring
    // UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    @Mapping(source = "dataCriacao", target = "createdAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    @Mapping(source = "nomeCompleto",  target = "fullName")
    @Mapping(source = "email",        target = "emailAddress")
    UsuarioDTO toDto(UsuarioEntity entity);

    // Mapeamento reverso, caso necessário
    @Mapping(source = "createdAt",    target = "dataCriacao", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    @Mapping(source = "fullName",     target = "nomeCompleto")
    @Mapping(source = "emailAddress", target = "email")
    UsuarioEntity toEntity(UsuarioDTO dto);
}

```

- `@Mapper(componentModel = "spring")`: instrui o MapStruct a gerar um bean Spring para `UsuarioMapper`.
- Cada `@Mapping` indica **origem** (campo na `source`) e **destino** (campo na `target`).
- Em `dateFormat`, definimos como converter `LocalDateTime` para `String`. Se fosse outra estratégia, poderíamos usar expressões ou métodos auxiliares.

### Pontos Importantes:

1. **Ordem das Anotações**:
    - O MapStruct procura converter campo a campo com mesmo nome automaticamente. Só precisamos anotar aqueles que divergem.
    - Se houver correspondência exata, não é necessário usar `@Mapping` para esse campo.
2. **Conversões de Tipos**:
    - Para tipos simples compatíveis (e.g., `String` → `String`), a conversão é direta.
    - Para tipos diferentes (e.g., `LocalDateTime` → `String`), usamos `dateFormat` ou definimos métodos personalizados (ex. `LocalDateTime to String` em classe utilitária).
3. **Mapeamento Reverso**:
    - Ao definir `toDto`, também é possível deixar `toEntity` sem anotações, se todos os nomes baterem, mas neste caso os nomes diferentes também precisam de `@Mapping`.

---

### 4.4. Variações de Sintaxe e Configurações Avançadas

1. **Anotá-los Dentro de `@Mappings`**
    
    Caso queira agrupar múltiplas anotações de `@Mapping`:
    
    ```java
    import org.mapstruct.Mappings;
    import org.mapstruct.Mapping;
    import org.mapstruct.Mapper;
    
    @Mapper(componentModel = "spring")
    public interface UsuarioMapper {
    
        @Mappings({
            @Mapping(source = "dataCriacao", target = "createdAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss"),
            @Mapping(source = "nomeCompleto",  target = "fullName"),
            @Mapping(source = "email",        target = "emailAddress")
        })
        UsuarioDTO toDto(UsuarioEntity entity);
    
        // ...
    }
    
    ```
    
    - Esse estilo é mais verboso e geralmente usado em versões antigas. Atualmente, pode-se simplesmente colocar várias anotações `@Mapping` sem `@Mappings`.
2. **Uso de Expressões e Métodos Auxiliares**
    
    Para cenários mais complexos, é possível definir lógica inline:
    
    ```java
    @Mapper(componentModel = "spring", imports = {DateTimeFormatter.class})
    public interface UsuarioMapper {
    
        @Mapping(target = "createdAt", expression = "java(entity.getDataCriacao().format(DateTimeFormatter.ISO_DATE_TIME))")
        @Mapping(source = "nomeCompleto", target = "fullName")
        @Mapping(source = "email", target = "emailAddress")
        UsuarioDTO toDto(UsuarioEntity entity);
    
        // ...
    }
    
    ```
    
    - `expression = "...java code..."`: permite executar código Java para converter valores.
    - O MapStruct exige que as classes usadas na expressão estejam disponíveis via `imports` ou estejam no mesmo pacote.
3. **Mapeamento de Propriedades Aninhadas**
    
    Quando a fonte ou o destino contêm objetos aninhados:
    
    ```java
    public class EnderecoEntity {
        private String rua;
        private String cidade;
        // getters e setters
    }
    
    public class UsuarioEntity {
        // ...
        private EnderecoEntity endereco;
        // getters e setters
    }
    
    public class UsuarioDTO {
        private String street;     // De endereco.rua
        private String city;       // De endereco.cidade
        // getters e setters
    }
    
    ```
    
    O mapeamento fica:
    
    ```java
    @Mapper(componentModel = "spring")
    public interface UsuarioMapper {
    
        @Mapping(source = "endereco.rua",  target = "street")
        @Mapping(source = "endereco.cidade", target = "city")
        UsuarioDTO toDto(UsuarioEntity entity);
        // ...
    }
    
    ```
    
4. **Configurações de `componentModel`**
    - **`spring`**: gera um `@Component` para que você injete o mapper via `@Autowired`.
    - **`default` / Sem `componentModel`**: você obtém instância com `Mappers.getMapper(UsuarioMapper.class)`.
    - **`cdi`**: para projetos usando CDI (Jakarta EE).
    - **`jsr330`**: compatível com `@Inject` (Guice, Dagger, etc.).

---

## 5. Cenários de Restrição ou Não Aplicação

Embora o MapStruct seja bastante poderoso, há situações em que talvez não seja a melhor opção:

1. **Mapeamentos Altamente Dinâmicos em Tempo de Execução**
    - Se a lógica de mapeamento precisa ser construída com base em metadados que só são conhecidos em runtime, MapStruct (que gera código estático) pode não cobrir todas as variações.
    - Exemplo: aplicações que recebem instruções de mapeamento JSON dinâmicas e precisam moldar objetos conforme input do usuário.
2. **Transformações Complexas de Dados**
    - Quando o mapeamento envolve lógica de negócio complexa (e.g., agregações, filtragens condicionais que envolvem múltiplos repositórios), usar MapStruct para “tudo” pode deixar o código do mapper inchado.
    - Nesses casos, é melhor aplicar a parte complexa em serviços dedicados e deixar o mapper apenas para conversões simples.
3. **Dependência Pesada de Bibliotecas Externas para Conversão**
    - Caso seja necessária alguma biblioteca de terceiros para converter tipos específicos (por ex., criptografia, formatação muito específica), às vezes faz mais sentido delegar manualmente a conversão num serviço ou helper do que estender MapStruct.
4. **Mapeamento Inverso com Diferença de Tipos Não Compatíveis**
    - Quando converter do DTO para Entity com tipos que exigem validações pesadas (e.g., converter String arbitrária num campo `enum`), o MapStruct pode gerar código que lança `IllegalArgumentException` em tempo de execução.
    - Nessa situação, pode ser mais seguro implementar manualmente parte da lógica de validação.

---

## 6. Componentes Chave Associados

### 6.1. Anotações Principais

- **`@Mapper`**
    - Marca uma interface como mapeadora.
    - Principais atributos:
        - `componentModel`: define o modelo de componente (ex.: `"spring"`, `"cdi"`, `"jsr330"`, `default`).
        - `uses`: lista de classes auxiliares (por ex., **mapeadores auxiliares** ou **conversores** personalizados) que serão usados no mapeamento.
        - `implementationName`: controla como será nomeada a classe gerada (padrão: `NomeInterfaceImpl`).
        - `unmappedTargetPolicy`: define como tratar campos não mapeados (ex.: `ERROR`, `WARN`, `IGNORE`).
- **`@Mapping`**
    - Define a associação entre um campo da origem e um campo do destino.
    - Parâmetros importantes:
        - `source`: nome do campo na classe de origem (pode ser aninhado como `obj.subobj.campo`).
        - `target`: nome do campo na classe de destino.
        - `dateFormat`: para mapeamento de datas (de `java.time.*` → `String`).
        - `expression`: permite inserir código Java customizado.
        - `ignore = true`: indica que o campo alvo deve ser ignorado.
        - `defaultValue`: valor padrão para atribuir caso a origem seja `null`.
- **`@Mappings`**
    - Contêiner para agrupar múltiplos `@Mapping`.
    - (No MapStruct moderno, inserir várias anotações `@Mapping` sem `@Mappings` já é suficiente e mais legível.)
- **`@BeanMapping`**
    - Usado para configurações mais finas de mapeamento (e.g., controlar estratégia de mapeamento nulo, herdar configurações).
    - Principais atributos:
        - `nullValueCheckStrategy`: como tratar `null` (ex.: `ALWAYS`, `ON_IMPLICIT_CONVERSION_ONLY`, `NEVER`).
        - `nullValuePropertyMappingStrategy`: define comportamento quando propriedade de origem for `null` (ex.: `SET_TO_NULL`, `IGNORE`, `SET_TO_DEFAULT`).
- **`@InheritInverseConfiguration`**
    - Automáticamente reutiliza configurações do mapeamento inverso (se já definimos `toDto`, podemos marcar `toEntity` com esta anotação para “espelhar” as regras de mapeamento em sentido inverso).
- **`@InheritConfiguration`**
    - Permite herdar configurações de outro método de mapeamento (útil quando vários métodos compartilham mapeamentos semelhantes).

---

### 6.2. Configuração de `componentModel`

- **`componentModel = "spring"`**
    - O MapStruct adiciona `@Component` na classe gerada, permitindo injeção via `@Autowired` ou `@Inject`.
    - Exemplo:
        
        ```java
        @Autowired
        private UsuarioMapper usuarioMapper;
        
        ```
        
- **`componentModel = "jsr330"`**
    - Gera código com anotações `@Named` e `@Singleton`, ajudando injecções em contêineres compatíveis com JSR-330 (Guice, Dagger, etc.).
- **`componentModel = "cdi"`**
    - Para projetos Jakarta EE; gera `@ApplicationScoped`.

Caso não queira especificar em cada interface, usar a opção de compilador (`-Amapstruct.defaultComponentModel=spring`) ou definir no `@MapperConfig` global.

---

### 6.3. Uso de Decorators e Implementações Customizadas

- **Decorators**
    - Permitem “decorar” o mapper gerado para adicionar lógica pré ou pós-conversão sem sobrescrever o código gerado.
    - Exemplo de uso:
        
        ```java
        @Mapper(componentModel = "spring", uses = { DataMapper.class })
        @DecoratedWith(UsuarioMapperDecorator.class)
        public interface UsuarioMapper {
            UsuarioDTO toDto(UsuarioEntity entity);
        }
        
        public abstract class UsuarioMapperDecorator implements UsuarioMapper {
            private final UsuarioMapper delegate;
        
            public UsuarioMapperDecorator(UsuarioMapper delegate) {
                this.delegate = delegate;
            }
        
            @Override
            public UsuarioDTO toDto(UsuarioEntity entity) {
                UsuarioDTO dto = delegate.toDto(entity);
                // Lógica customizada adicional
                dto.setSomeField("ValorCustomizado");
                return dto;
            }
        }
        
        ```
        
    - O MapStruct gera a implementação (por ex. `UsuarioMapperImpl`) e, via `@DecoratedWith`, injeta o decorator que delega ao `delegate`.

### 6.4. Mapeamento de Tipos Complexos e Coleções

- **Conversão de Listas/Set**:
    
    ```java
    @Mapper(componentModel = "spring")
    public interface UsuarioMapper {
        List<UsuarioDTO> toDtos(List<UsuarioEntity> entities);
        Set<UsuarioDTO> toSets(Set<UsuarioEntity> entities);
    }
    
    ```
    
    O MapStruct detecta automaticamente que deve iterar sobre cada elemento e usar `toDto` para cada `UsuarioEntity`.
    
- **Mapeamento de Mapas (Map<K,V>)**
    
    ```java
    @Mapper(componentModel = "spring")
    public interface ExemploMapper {
        Map<String, UsuarioDTO> toMap(Map<String, UsuarioEntity> entities);
    }
    
    ```
    
    É possível, desde que o MapStruct encontre métodos para converter chaves e valores.
    
- **Tipos Genéricos e Wrapper Objects**
    - Se for usar classes genéricas, é preciso declarar métodos auxiliares ou usar mapeamentos específicos.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Manter Convenções de Nomenclatura**
    - Se possível, alinhe nomes de campos entre entidade e DTO quando não houver conflito. Assim, você evita anotações repetidas de `@Mapping`.
2. **Agrupar Mapeamentos Comuns em Configurações Reutilizáveis**
    - Use `@MapperConfig` para definir regras compartilhadas (ex.: formatação de data padrão) e faça suas interfaces de mapper `@Mapper(config = MeuMapperConfig.class)`.
3. **Separar Lógica de Conversão Complexa**
    - Para conversões que exijam lógica customizada (ex.: criptografar senha, converter enum complexo), coloque o método em uma classe utilitária ou em “Helper” e referencie-a em `uses` do `@Mapper`.
4. **Herdar Configurações via `@InheritConfiguration` / `@InheritInverseConfiguration`**
    - Evita duplicação de anotações quando os mapeamentos são muito semelhantes em várias interfaces ou métodos.
5. **Evitar Chamar Métodos de Banco dentro do Mapper**
    - Mappers devem permanecer “puros”: converter atributos de um objeto para outro. Não carregue relacionamentos na base de dados durante o mapeamento (não faça consultas).
6. **Testar Mapeamentos Automaticamente**
    - Crie testes unitários focados em validar campos mapeados (especialmente nomes diferentes) para garantir que futuras alterações não quebrem o contrato.
    - Exemplo de teste (Junit + AssertJ):
        
        ```java
        @SpringBootTest
        public class UsuarioMapperTest {
        
            @Autowired
            private UsuarioMapper usuarioMapper;
        
            @Test
            void deveMapearAtributosComNomesDiferentes() {
                UsuarioEntity entity = new UsuarioEntity();
                entity.setId(1L);
                entity.setDataCriacao(LocalDateTime.of(2025, 6, 5, 14, 30));
                entity.setNomeCompleto("João Silva");
                entity.setEmail("joao@example.com");
        
                UsuarioDTO dto = usuarioMapper.toDto(entity);
        
                assertThat(dto.getId()).isEqualTo(1L);
                assertThat(dto.getCreatedAt()).isEqualTo("2025-06-05T14:30:00");
                assertThat(dto.getFullName()).isEqualTo("João Silva");
                assertThat(dto.getEmailAddress()).isEqualTo("joao@example.com");
            }
        }
        
        ```
        
7. **Cuidado com Propriedades Nulas**
    - Se algum campo na origem pode ser `null`, avalie configurar `nullValueCheckStrategy` ou `nullValuePropertyMappingStrategy` (ex.: `IGNORE` para não sobrescrever valores do destino ou `SET_TO_DEFAULT`).
    - Exemplo:
        
        ```java
        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(source = "nomeCompleto", target = "fullName")
        UsuarioDTO toDto(UsuarioEntity entity);
        
        ```
        
8. **Controlar Poluição de Dependências**
    - Se usar muitos mapeadores auxiliares em `uses`, avalie se não vale criar classes de serviço ou conversores desacoplados para evitar dependências circulares complexas.

---

## 8. Exemplo Prático Completo

### 8.1. Projeto Simplificado: Entidades, DTOs e Mapper

### 8.1.1. Entidade JPA

```java
package com.exemplo.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "nome_completo")
    private String nomeCompleto;

    @Column(name = "email")
    private String email;

    // Construtores, getters e setters omitidos
}

```

### 8.1.2. DTO de Transferência

```java
package com.exemplo.dto;

public class UsuarioDTO {

    private Long id;

    /**
     * Data e hora de criação como String no formato ISO
     */
    private String createdAt;

    /**
     * Nome completo do usuário
     */
    private String fullName;

    /**
     * Endereço de e-mail
     */
    private String emailAddress;

    // Construtores, getters e setters omitidos
}

```

### 8.1.3. Interface de Mapper

```java
package com.exemplo.mapper;

import com.exemplo.domain.UsuarioEntity;
import com.exemplo.dto.UsuarioDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.WARN // Emite warning se algum campo do destino não for mapeado
)
public interface UsuarioMapper {

    @Mapping(source = "dataCriacao",   target = "createdAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    @Mapping(source = "nomeCompleto",  target = "fullName")
    @Mapping(source = "email",         target = "emailAddress")
    UsuarioDTO toDto(UsuarioEntity entity);

    @InheritInverseConfiguration
    UsuarioEntity toEntity(UsuarioDTO dto);
}

```

- **`ReportingPolicy.WARN`**: indica que se existir algum campo no DTO sem mapeamento explícito, o compilador emitirá um aviso (útil durante desenvolvimento).

---

### 8.2. Configuração do Spring Boot para Injeção do Mapper

No `Application.java` (classe principal do Spring Boot) não é preciso configuração adicional, pois definimos `componentModel = "spring"`:

```java
package com.exemplo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExemploApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExemploApplication.class, args);
    }
}

```

Em qualquer classe `@Service`, `@Controller` ou `@Component`, podemos injetar o mapper:

```java
package com.exemplo.service;

import com.exemplo.domain.UsuarioEntity;
import com.exemplo.dto.UsuarioDTO;
import com.exemplo.mapper.UsuarioMapper;
import com.exemplo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository,
                          UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    public List<UsuarioDTO> listarUsuarios() {
        List<UsuarioEntity> entities = usuarioRepository.findAll();
        return entities.stream()
                       .map(usuarioMapper::toDto)
                       .collect(Collectors.toList());
    }

    public UsuarioDTO buscarPorId(Long id) {
        UsuarioEntity entity = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return usuarioMapper.toDto(entity);
    }

    public UsuarioDTO criarUsuario(UsuarioDTO dto) {
        UsuarioEntity entity = usuarioMapper.toEntity(dto);
        // Supondo que createdAt vem do front-end, mas aqui generamos no backend
        entity.setDataCriacao(LocalDateTime.now());
        UsuarioEntity salvo = usuarioRepository.save(entity);
        return usuarioMapper.toDto(salvo);
    }
}

```

- O `UsuarioService` injeta `UsuarioMapper` normalmente, sem necessidade de factory ou `Mappers.getMapper()`.

---

### 8.3. Uso em Camada de Controller

```java
package com.exemplo.controller;

import com.exemplo.dto.UsuarioDTO;
import com.exemplo.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        List<UsuarioDTO> usuarios = usuarioService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        UsuarioDTO dto = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> criar(@RequestBody UsuarioDTO dto) {
        UsuarioDTO criado = usuarioService.criarUsuario(dto);
        return ResponseEntity.status(201).body(criado);
    }
}

```

- O endpoint `/api/usuarios` consome e produz `UsuarioDTO`, utilizando internamente `UsuarioMapper` para converter para `UsuarioEntity` e vice-versa.

---

### 8.4. Testes Unitários Verificando o Mapeamento de Campos Distintos

```java
package com.exemplo.mapper;

import com.exemplo.domain.UsuarioEntity;
import com.exemplo.dto.UsuarioDTO;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class UsuarioMapperTest {

    // Se não usar Spring, obtenha manualmente:
    private final UsuarioMapper mapper = Mappers.getMapper(UsuarioMapper.class);

    @Test
    void testMapeamentoDeCamposDifferentNames() {
        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(10L);
        entity.setDataCriacao(LocalDateTime.of(2025, 6, 5, 9, 15, 0));
        entity.setNomeCompleto("Maria Oliveira");
        entity.setEmail("maria@example.com");

        UsuarioDTO dto = mapper.toDto(entity);

        assertThat(dto.getId()).isEqualTo(10L);
        assertThat(dto.getCreatedAt()).isEqualTo("2025-06-05T09:15:00");
        assertThat(dto.getFullName()).isEqualTo("Maria Oliveira");
        assertThat(dto.getEmailAddress()).isEqualTo("maria@example.com");
    }

    @Test
    void testMapeamentoReverso() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(20L);
        dto.setCreatedAt("2025-06-05T10:00:00");
        dto.setFullName("Pedro Santos");
        dto.setEmailAddress("pedro@example.com");

        UsuarioEntity entity = mapper.toEntity(dto);

        assertThat(entity.getId()).isEqualTo(20L);
        assertThat(entity.getDataCriacao()).isEqualTo(LocalDateTime.of(2025, 6, 5, 10, 0, 0));
        assertThat(entity.getNomeCompleto()).isEqualTo("Pedro Santos");
        assertThat(entity.getEmail()).isEqualTo("pedro@example.com");
    }
}

```

> Observação: Se estiver usando Spring, basta anotar a classe de teste com @SpringBootTest ou @MapperScan para injetar o bean do mapper.
> 

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial do MapStruct**
    - [https://mapstruct.org/documentation/stable/reference/html/](https://mapstruct.org/documentation/stable/reference/html/)
    - Excelente recurso para explorar anotações avançadas, integração com frameworks e exemplos de casos especiais.
2. **MapStruct com `@MapperConfig`**
    - Estabelecer configurações globais, herança de configurações e estilos de nomes.
    - [https://mapstruct.org/documentation/stable/reference/html/#mapperconfig](https://mapstruct.org/documentation/stable/reference/html/#mapperconfig)
3. **MapStruct + Spring Boot: Projetando Mapeamentos em Camadas**
    - Como organizar pacotes `domain`, `dto`, `mapper` e `service` para manter separação clara de responsabilidades.
4. **Conversão de Tipos Personalizados (e.g., `Enum`, `BigDecimal`, Listas Aninhadas)**
    - Usar métodos `default` no mapper ou classes auxiliares via `uses`.
5. **Desempenho em Cenários de Grande Volume**
    - Benchmark comparando MapStruct contra Reflection-based mappers (ModelMapper, Dozer).
    - Entender como procurar “erros” de mapeamento e warnings para otimização.
6. **MapStruct + JPA/Hibernate**
    - Efeitos de lazy-loading quando mapeando coleções.
    - Como usar `DTO Projections` no repositório junto com mapeamentos MapStruct.
7. **Testes mais Avançados**
    - Cobrir casos de campos opcionais, nulos, coleções vazias, campos aninhados nulos.
    - Uso de `nullValueMappingStrategy` para personalizar comportamentos.

---

### Conclusão

Neste guia, detalhamos de forma completa como mapear atributos com nomes diferentes utilizando MapStruct em um projeto Spring Boot com Java. Abordamos desde a configuração inicial, passando pela sintaxe de anotações (`@Mapping`), até exemplos práticos, melhores práticas e possíveis cenários de restrição. Seguindo esta estrutura, será possível manter o código organizado, seguro quanto a tipos e altamente performático, aproveitando ao máximo as capacidades do MapStruct para conversões de objetos em aplicações corporativas.