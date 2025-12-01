# Configuração e Uso Completo

---

## Introdução

MapStruct é uma ferramenta de mapeamento de objetos que gera, em tempo de compilação, implementações para conversão entre classes (por exemplo, entidades JPA e DTOs). Diferentemente de abordagens baseadas em reflexão (como ModelMapper), o MapStruct produz código-fonte otimizado, gerando implementações estáticas que melhoram performance e reduzem erros em tempo de execução. Neste guia, veremos como configurar MapStruct em um projeto Spring Boot usando Maven, exploraremos seus conceitos fundamentais, apresentaremos exemplos de código e discutiremos cenários em que seu uso pode não ser indicado.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Dependências no Maven](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#depend%C3%AAncias-no-maven)
    2. [Configuração do Plugin de Processamento de Anotações](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#configura%C3%A7%C3%A3o-do-plugin-de-processamento-de-anota%C3%A7%C3%B5es)
    3. [Definição de Interfaces de Mapper](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#defini%C3%A7%C3%A3o-de-interfaces-de-mapper)
    4. [ComponentModel: Integração com Spring](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentmodel-integra%C3%A7%C3%A3o-com-spring)
    5. [Mapeamentos Específicos e Customizações](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#mapeamentos-espec%C3%ADficos-e-customiza%C3%A7%C3%B5es)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **O que é MapStruct?**
    
    MapStruct é um framework de geração de código para mapeamento de objetos Java. Ele analisa interfaces anotadas (chamadas de **mappers**) e gera, durante a compilação, as classes concretas que implementam as conversões entre tipos.
    
- **Por que usar MapStruct?**
    1. **Performance**: Gera código estático ao invés de usar reflexão em tempo de execução.
    2. **Segurança de Tipos**: Erros de mapeamento são detectados em tempo de compilação.
    3. **Manutenibilidade**: Convenções claras de anotações tornam o código de mapeamento legível e fácil de refatorar.
- **Quando ele se encaixa no fluxo de uma aplicação Spring Boot?**
    
    Em aplicações que separam camadas (entidades de persistência, classes de domínio, DTOs para API), é comum ter conversões repetitivas e suscetíveis a erros. MapStruct automatiza esse trabalho, simplificando a comunicação entre camadas e garantindo consistência.
    

---

## Sintaxe Detalhada e Uso Prático

### Dependências no Maven

Para usar o MapStruct em um projeto Spring Boot com Maven, precisamos declarar as seguintes dependências no arquivo `pom.xml`:

```xml
<!-- Dependência principal do MapStruct -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version> <!-- Verifique a versão mais recente no Repositório Maven Central -->
</dependency>

<!-- Dependência para o gerador de código (plugin de processamento de anotações) -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>

```

> Observação: A versão (1.5.5.Final) é um exemplo; sempre verifique a versão estável mais recente no Maven Central.
> 

---

### Configuração do Plugin de Processamento de Anotações

Para que o MapStruct gere as classes no momento da compilação, habilitamos o processamento de anotações no Maven Compiler Plugin. Acrescente ao seu `pom.xml`:

```xml
<build>
    <plugins>
        <!-- Plugin para compilar o projeto Java -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.10.1</version> <!-- ou a versão compatível com seu projeto -->
            <configuration>
                <!-- Definindo Java 11 como exemplo; ajuste conforme sua versão -->
                <source>11</source>
                <target>11</target>
                <annotationProcessorPaths>
                    <!-- Configurando o processador do MapStruct -->
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>1.5.5.Final</version>
                    </path>
                    <!-- Se usar Lombok, incluir também seu processador -->
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>1.18.26</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
        <!-- O plugin de Spring Boot pode permanecer conforme já configurado -->
    </plugins>
</build>

```

- `<annotationProcessorPaths>`: Informa ao compilador Maven quais processadores de anotações (annotation processors) devem ser executados.
- Caso use **Lombok**, é fundamental incluir seu processador junto com o do MapStruct, para evitar conflitos.

---

### Definição de Interfaces de Mapper

Após configurar dependências, criamos interfaces que definem a assinatura dos mapeamentos:

```java
// Pacote: com.exemplo.project.mapper

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

// Exemplo de classes de origem e destino:
import com.exemplo.project.dto.UsuarioDTO;
import com.exemplo.project.entity.Usuario;

@Mapper
public interface UsuarioMapper {

    // Instância gerada pelo MapStruct
    UsuarioMapper INSTANCIA = Mappers.getMapper(UsuarioMapper.class);

    // Mapeamento simples: propriedades com mesmo nome serão automaticamente convertidas
    UsuarioDTO toDTO(Usuario usuario);

    // Mapeamento inverso: converter DTO de volta para Entidade
    Usuario toEntity(UsuarioDTO dto);

    // Exemplo de mapeamento com nomes diferentes:
    @Mapping(source = "nomeCompleto", target = "nome")
    @Mapping(source = "dataNascimento", target = "idade", dateFormat = "yyyy-MM-dd")
    UsuarioDTO toDTOComFormato(Usuario usuario);
}

```

**Explicações detalhadas**:

- `@Mapper`: Indica ao MapStruct que a interface deve gerar uma implementação concreta.
- `UsuarioMapper INSTANCIA = Mappers.getMapper(...)`: Permite obter a implementação gerada em tempo de compilação.
- Métodos com mesma assinatura:
    - `UsuarioDTO toDTO(Usuario usuario)`: converte automaticamente campos com nomes idênticos.
    - Quando há campos com nomes diferentes, usa-se `@Mapping(source = "...", target = "...")`.
- `dateFormat = "yyyy-MM-dd"`: Exemplo de formatação de data ao converter `LocalDate` (ou `Date`) para `String`.

---

### ComponentModel: Integração com Spring

Para integrar o mapper ao contexto do Spring (permitindo injeção de dependência), definimos `componentModel = "spring"`:

```java
@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioDTO toDTO(Usuario usuario);
    Usuario toEntity(UsuarioDTO dto);
}

```

**O que muda?**

- Não precisamos usar `Mappers.getMapper(...)`.
- No lugar, podemos fazer injeção via `@Autowired` ou construtor:

```java
// Em uma classe de Service, por exemplo
@Service
public class UsuarioService {

    private final UsuarioMapper usuarioMapper;
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioMapper usuarioMapper, UsuarioRepository usuarioRepository) {
        this.usuarioMapper = usuarioMapper;
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        return usuarioMapper.toDTO(usuario);
    }
}

```

---

### Mapeamentos Específicos e Customizações

Além de mapeamentos diretos, MapStruct permite customizar comportamentos:

1. **Mapeamento de campos com tipos diferentes**:
    - Exemplo: converter `String` para `Integer`, ou `LocalDateTime` para `String`.
    
    ```java
    @Mapping(source = "dataCriacao", target = "dataCriacaoFormatada", dateFormat = "dd/MM/yyyy HH:mm")
    ItemDTO toDTO(Item entidade);
    
    ```
    
2. **Utilizar métodos auxiliares**:
    - Caso o MapStruct não saiba converter por padrão, podemos chamar métodos customizados:
    
    ```java
    default String converterStatus(EnumStatus status) {
        return status == null ? null : status.name();
    }
    
    @Mapping(source = "statusEntidade", target = "statusDTO", qualifiedByName = "converterStatus")
    PedidoDTO toDTO(Pedido pedido);
    
    ```
    
    - Para isso, anotamos o método auxiliar com `@Named("converterStatus")`.
3. **Mapeamento de coleções e listas**:
    
    MapStruct trata automaticamente listas e coleções:
    
    ```java
    List<UsuarioDTO> toDTOList(List<Usuario> usuarios);
    
    ```
    
4. **Mapeamento com herança de configurações**:
    - Criar uma interface de configuração base:
        
        ```java
        @MapperConfig(componentModel = "spring", uses = {DateMapper.class})
        public interface CentralConfig {
        }
        
        ```
        
    - Nas interfaces de mappers:
        
        ```java
        @Mapper(config = CentralConfig.class)
        public interface ProdutoMapper { ... }
        
        ```
        

---

## Cenários de Restrição ou Não Aplicação

- **Projetos muito pequenos**: Se há apenas uma ou duas classes a serem convertidas, a sobrecarga de configurar MapStruct pode não compensar; nesse caso, métodos manuais podem ser mais rápidos de implementar.
- **Mapeamentos dinâmicos em tempo de execução**: MapStruct gera código fixo em tempo de compilação; se for necessário decidir quais campos mapear em runtime (por exemplo, seleção dinâmica de colunas), ferramentas baseadas em reflexão podem ser mais flexíveis.
- **Transformações complexas não triviais**: MapStruct é excelente para mapeamentos diretos ou com pequenas customizações. Quando a lógica de conversão envolve regras de negócio muito elaboradas (cálculos condicionais complexos, chamadas a serviços externos, etc.), muitas vezes é melhor encapsular essa lógica em um service ou componente separado.
- **Ambientes sem suporte a annotation processing**: Em projetos com builds que não permitem processadores de anotações (por exemplo, alguns frameworks antigos ou rodando scripts de compilação personalizados), MapStruct não funcionará, pois depende do gerador de código em tempo de compilação.

---

## Componentes Chave Associados

1. **Anotação `@Mapper`**
    - Define uma interface como um mapper.
    - Parâmetros importantes:
        - `componentModel`: define como a implementação será gerenciada; valores comuns: `"default"` (usa `Mappers.getMapper()`), `"spring"`, `"jsr330"`, `"cdi"`.
        - `uses`: outras classes que contêm métodos auxiliares ou customizados.
2. **Anotação `@Mapping`**
    - Especifica um mapeamento entre propriedades de origem e destino quando os nomes diferem ou exigem customização (ex.: formatação de data).
    - Parâmetros:
        - `source`: nome do campo na classe de origem.
        - `target`: nome do campo na classe de destino.
        - `dateFormat`: formato de data (quando converte `java.time` ou `java.util.Date` para `String`).
        - `qualifiedByName`: referência a um método auxiliar anotado com `@Named`.
3. **Anotação `@Named`**
    - Anota métodos auxiliares que podem ser invocados em expressões de mapeamento.
    - Exemplo:
        
        ```java
        @Named("formatarData")
        public static String formatarData(LocalDate data) {
            return data != null ? data.format(DateTimeFormatter.ISO_LOCAL_DATE) : null;
        }
        
        ```
        
4. **Interface `Mappers`**
    - Classe utilitária do MapStruct que fornece implementações no modo `componentModel="default"`.
    - Exemplo:
        
        ```java
        UsuarioMapper INSTANCIA = Mappers.getMapper(UsuarioMapper.class);
        
        ```
        
5. **`@MapperConfig`**
    - Permite criar configurações compartilhadas (por exemplo, estratégias globais de formatação, políticas de null) que podem ser herdadas por vários mappers.
6. **Classes Auxiliares (Utils)**
    - Ex.: `DateMapper`, `StringTrimMapper`, que contêm métodos para conversão específica e podem ser referenciadas em `@Mapper(uses = {DateMapper.class})`.

---

## Melhores Práticas e Padrões de Uso

1. **Sempre use `componentModel = "spring"` (em aplicações Spring Boot)**
    - Permite injeção via `@Autowired` ou construtor, tornando o código mais testável e aderente ao padrão de injeção de dependências do Spring.
2. **Mapear somente o necessário**
    - Defina DTOs apenas com atributos relevantes para a operação (ex.: retorno de API), evitando mapear propriedades irrelevantes que podem expor dados sensíveis.
3. **Agrupar configurações repetitivas em `@MapperConfig`**
    - Se diversos mappers compartilharem políticas de formatação (datas, nomes, mapeamento de listas), extraia essas configurações para uma interface anotada com `@MapperConfig`, reduzindo duplicação.
4. **Testar as implementações geradas**
    - Crie testes unitários para validar que o mapper converte corretamente dados de exemplo. Por exemplo, usando JUnit:
        
        ```java
        @ExtendWith(SpringExtension.class)
        @ContextConfiguration(classes = {MapStructConfig.class}) // caso use config específica
        public class UsuarioMapperTest {
            @Autowired
            private UsuarioMapper mapper;
        
            @Test
            void deveMapearParaDTO() {
                Usuario usuario = new Usuario(1L, "Ana Silva", LocalDate.of(1990, 5, 20));
                UsuarioDTO dto = mapper.toDTO(usuario);
                Assertions.assertEquals("Ana Silva", dto.getNome());
                Assertions.assertEquals("20/05/1990", dto.getDataNascimentoFormatada());
            }
        }
        
        ```
        
5. **Evitar lógica complexa dentro do mapper**
    - Caso haja regras de negócio sofisticadas, execute-as em serviços (Services) e use os mappers apenas para conversões pontuais. Isso mantém o mapper “puro” e fácil de manter.
6. **Gerenciar mapeamentos bidirecionais com cautela**
    - Se suas entidades possuem relacionamentos bidirecionais (por exemplo, `Pedido` ↔ `Cliente`), cuidado para não criar dependências cíclicas. Considere usar métodos personalizados ou DTOs simplificados.
7. **Atualizar a versão do MapStruct regularmente**
    - A comunidade MapStruct é ativa e traz otimizações e correções. Verifique sempre a versão mais recente no Maven Central.

---

## Exemplo Prático Completo

### 1. Estrutura de Projeto (Exemplo Simplificado)

```
meu-projeto/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/exemplo/app/
│   │   │       ├── AppApplication.java
│   │   │       ├── controller/
│   │   │       │   └── UsuarioController.java
│   │   │       ├── dto/
│   │   │       │   └── UsuarioDTO.java
│   │   │       ├── entity/
│   │   │       │   └── Usuario.java
│   │   │       ├── mapper/
│   │   │       │   └── UsuarioMapper.java
│   │   │       └── service/
│   │   │           └── UsuarioService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/exemplo/app/mapper/
│               └── UsuarioMapperTest.java
└── pom.xml

```

---

### 2. `pom.xml` (snippet relevante)

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" ...>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.exemplo</groupId>
    <artifactId>meu-projeto</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <java.version>11</java.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
    </properties>

    <dependencies>
        <!-- Dependências do Spring Boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId> <!-- Banco em memória para teste -->
            <scope>runtime</scope>
        </dependency>

        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>${mapstruct.version}</version>
            <scope>provided</scope>
        </dependency>

        <!-- Lombok (opcional, mas recomendado para getters/setters) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.26</version>
            <scope>provided</scope>
        </dependency>

        <!-- Testes -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Plugin do Spring Boot (geral) -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>

            <!-- Plugin de compilação Java -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.10.1</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                    <annotationProcessorPaths>
                        <!-- MapStruct -->
                        <path>
                            <groupId>org.mapstruct</groupId>
                            <artifactId>mapstruct-processor</artifactId>
                            <version>${mapstruct.version}</version>
                        </path>
                        <!-- Lombok -->
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
</project>

```

---

### 3. Classes de Entidade e DTO

### 3.1 Entidade `Usuario.java`

```java
package com.exemplo.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String email;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;
}

```

### 3.2 DTO `UsuarioDTO.java`

```java
package com.exemplo.app.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    // Para fins de demonstração, vamos converter LocalDate para String formatada
    private String dataNascimentoFormatada;
}

```

---

### 4. Interface de Mapper `UsuarioMapper.java`

```java
package com.exemplo.app.mapper;

import com.exemplo.app.dto.UsuarioDTO;
import com.exemplo.app.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    // Mapear Entity → DTO
    @Mapping(source = "dataNascimento", target = "dataNascimentoFormatada", qualifiedByName = "formatarData")
    UsuarioDTO toDTO(Usuario usuario);

    // Mapear DTO → Entity (supondo que informamos data no formato ISO "yyyy-MM-dd")
    @Mapping(source = "dataNascimentoFormatada", target = "dataNascimento", qualifiedByName = "parseData")
    Usuario toEntity(UsuarioDTO dto);

    // Método auxiliar para formatar LocalDate → String
    @Named("formatarData")
    default String formatarData(LocalDate data) {
        if (data == null) {
            return null;
        }
        return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    // Método auxiliar para parsear String → LocalDate
    @Named("parseData")
    default LocalDate parseData(String dataFormatada) {
        if (dataFormatada == null || dataFormatada.isEmpty()) {
            return null;
        }
        return LocalDate.parse(dataFormatada, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
}

```

**Explicação dos pontos principais**:

- `@Mapper(componentModel = "spring")`: permite injetar `UsuarioMapper` como um bean do Spring.
- `@Mapping(source = "dataNascimento", target = "dataNascimentoFormatada", qualifiedByName = "formatarData")`: especifica que a propriedade `dataNascimento` da entidade deve ser convertida pelo método com `@Named("formatarData")`.
- Métodos `formatarData` e `parseData` têm anotação `@Named`, permitindo referenciar logicamente nas anotações `@Mapping`.

---

### 5. Repositório e Serviço

### 5.1 Repositório `UsuarioRepository.java`

```java
package com.exemplo.app.repository;

import com.exemplo.app.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}

```

### 5.2 Serviço `UsuarioService.java`

```java
package com.exemplo.app.service;

import com.exemplo.app.dto.UsuarioDTO;
import com.exemplo.app.entity.Usuario;
import com.exemplo.app.mapper.UsuarioMapper;
import com.exemplo.app.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    public List<UsuarioDTO> listarTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        // Converter cada entidade para DTO
        return usuarios.stream()
                       .map(usuarioMapper::toDTO)
                       .collect(Collectors.toList());
    }

    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return usuarioMapper.toDTO(usuario);
    }

    public UsuarioDTO criarUsuario(UsuarioDTO dto) {
        // Converter DTO para entidade, salvar e retornar DTO atualizado
        Usuario entidade = usuarioMapper.toEntity(dto);
        Usuario salvo = usuarioRepository.save(entidade);
        return usuarioMapper.toDTO(salvo);
    }
}

```

---

### 6. Controller `UsuarioController.java`

```java
package com.exemplo.app.controller;

import com.exemplo.app.dto.UsuarioDTO;
import com.exemplo.app.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        List<UsuarioDTO> dtos = usuarioService.listarTodos();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        UsuarioDTO dto = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> criar(@RequestBody UsuarioDTO dto) {
        UsuarioDTO criado = usuarioService.criarUsuario(dto);
        return ResponseEntity.ok(criado);
    }
}

```

---

### 7. Teste Unitário do Mapper `UsuarioMapperTest.java`

```java
package com.exemplo.app.mapper;

import com.exemplo.app.dto.UsuarioDTO;
import com.exemplo.app.entity.Usuario;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;

public class UsuarioMapperTest {

    private UsuarioMapper mapper;

    @BeforeEach
    void setup() {
        // Obtém instância gerada pelo MapStruct (no modo default)
        mapper = Mappers.getMapper(UsuarioMapper.class);
    }

    @Test
    void mapearParaDTO_deveRetornarObjetoComCamposFormatados() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Carlos Souza");
        usuario.setEmail("carlos@example.com");
        usuario.setDataNascimento(LocalDate.of(1985, 8, 15));

        UsuarioDTO dto = mapper.toDTO(usuario);

        Assertions.assertEquals(1L, dto.getId());
        Assertions.assertEquals("Carlos Souza", dto.getNome());
        Assertions.assertEquals("carlos@example.com", dto.getEmail());
        Assertions.assertEquals("15/08/1985", dto.getDataNascimentoFormatada());
    }

    @Test
    void mapearParaEntity_deveConverterDataCorretamente() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(2L);
        dto.setNome("Mariana Lima");
        dto.setEmail("mariana@example.com");
        dto.setDataNascimentoFormatada("20/12/1990");

        Usuario entidade = mapper.toEntity(dto);

        Assertions.assertEquals(2L, entidade.getId());
        Assertions.assertEquals("Mariana Lima", entidade.getNome());
        Assertions.assertEquals("mariana@example.com", entidade.getEmail());
        Assertions.assertEquals(LocalDate.of(1990, 12, 20), entidade.getDataNascimento());
    }
}

```

- **Observação:** No teste acima, usamos `Mappers.getMapper(...)` pois não configuramos o contexto do Spring para testes. Caso o teste seja no contexto Spring, podemos fazer `@Autowired`.

---

## Cenários de Restrição ou Não Aplicação

1. **Projetos Monolíticos Pequenos**
    
    Se existe apenas um ou dois mapeamentos simples, talvez não valha a pena introduzir dependências e gerar código adicional.
    
2. **Mapeamentos Dinâmicos**
    
    MapStruct gera código estático em tempo de compilação. Para cenários onde campos a serem mapeados são definidos em runtime (por exemplo, seleção de colunas baseada em perfil do usuário), ferramentas reflexivas (ModelMapper, BeanUtils) podem ser mais flexíveis.
    
3. **Conversões Complexas de Objetos Profundos**
    
    Quando há grafos de objetos muito complexos, especialmente em hierarquias extensas, MapStruct pode gerar código muito extenso ou exigir configurações adicionais. Nestes casos, pode-se optar por mapeamentos manuais controlados.
    
4. **Dependências de Runtime Específicas**
    
    Se o ambiente de build não suporta annotation processing (por exemplo, builds personalizados sem suporte a APT), o MapStruct não conseguirá gerar as classes implementadas.
    

---

## Componentes Chave Associados

1. **@Mapper**
    - Local: `org.mapstruct.Mapper`
    - Configurações comumente usadas:
        - `componentModel = "spring"` (ou `"jsr330"`, `"cdi"`, conforme o container)
        - `uses = {ClasseAuxiliar1.class, ClasseAuxiliar2.class}`
2. **@Mapping**
    - Local: `org.mapstruct.Mapping`
    - Usa atributos: `source`, `target`, `dateFormat`, `qualifiedByName`, `ignore`, entre outros.
3. **@MapperConfig**
    - Local: `org.mapstruct.MapperConfig`
    - Permite centralizar configurações comuns (ex.: políticas de null, naming conventions, uso de classes auxiliares).
4. **@Named**
    - Local: `org.mapstruct.Named`
    - Marca métodos auxiliares que podem ser referenciados via `qualifiedByName`.
5. **Interface `Mappers`**
    - Local: `org.mapstruct.factory.Mappers`
    - Método estático genérico: `<T> T getMapper(Class<T> mapperClass)`
6. **Classes Auxiliares de Conversão**
    - Exemplo: `DateMapper`, `EnumMapper`, utilizados em `uses`, para funções de conversão personalizadas.
7. **Annotation Processor**
    - Responsável por ler as anotações (`@Mapper`, `@Mapping` etc.) e gerar implementações em `target/generated-sources/annotations`.

---

## Melhores Práticas e Padrões de Uso

1. **Centralizar Configurações via `@MapperConfig`**
    - Crie uma interface com anotações que sirvam para múltiplos mappers.
    - Exemplo:
        
        ```java
        @MapperConfig(
            componentModel = "spring",
            nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
            unmappedTargetPolicy = ReportingPolicy.ERROR
        )
        public interface MapStructConfiguration {
        }
        
        ```
        
    - Em cada mapper, referencie esta configuração:
        
        ```java
        @Mapper(config = MapStructConfiguration.class, uses = {DateMapper.class})
        public interface PedidoMapper { ... }
        
        ```
        
2. **Isolar Lógica Complexa em Métodos Auxiliares**
    - Sempre que houver necessidade de lógica não trivial (por exemplo, busca de dados externos para preencher um campo), crie métodos com `@Named` em classes separadas e referencie-as.
3. **Evitar Ciclos de Dependência**
    - Em casos de relações bidirecionais entre entidades, mapeie apenas o necessário. Por exemplo, se `Pedido` tem referência a `Cliente` e vice-versa, no DTO de `Pedido` inclua somente o `idCliente` ou nome, evitando loop infinito.
4. **Documentar Mapeamentos Incomuns**
    - Quando usar `expression` ou chamadas a métodos auxiliares, documente claramente no código quais campos estão sendo transformados e por quê.
5. **Configurar Políticas de Mapeamento Não Mapeado**
    - Utilize `unmappedTargetPolicy = ReportingPolicy.WARN` ou `ReportingPolicy.ERROR` para alertar quando campos não forem mapeados, evitando que atributos sejam ignorados por descuido.
6. **Versionar Interfaces de Mapper**
    - Para evoluções de DTOs ou entidades, crie versões de mappers (por exemplo, `UsuarioMapperV2`) em vez de alterar diretamente a implementação existente, evitando quebra de contrato.
7. **Testar Cobertura de Mapeamento**
    - Crie testes que verifiquem, para cada campo relevante, se a conversão ocorreu conforme o esperado, garantindo que futuras alterações não quebrem mapeamentos.

---

## Exemplo Prático Completo

Para consolidar o uso do MapStruct em um projeto Spring Boot com Maven, abaixo segue um cenário completo:

1. **Configurar `pom.xml`** (já detalhado acima).
2. **Criar Entidade `Usuario`** (campo: `id`, `nome`, `email`, `dataNascimento`).
3. **Criar DTO `UsuarioDTO`** (campo: `id`, `nome`, `email`, `dataNascimentoFormatada`).
4. **Definir `UsuarioMapper`** com `componentModel = "spring"` e métodos auxiliares para formatação de data.
5. **Implementar Repositório** (`UsuarioRepository extends JpaRepository<Usuario, Long>`).
6. **Criar Serviço `UsuarioService`** para CRUD, usando `usuarioMapper.toDTO(...)` e `usuarioMapper.toEntity(...)`.
7. **Criar Controller REST** (`/api/usuarios`) com endpoints GET (listar, buscar por ID) e POST (criar).
8. **Executar a Aplicação**:
    - Ao dar `mvn clean install`, as classes geradas pelo MapStruct serão criadas em `target/generated-sources/annotations/com/exemplo/app/mapper/UsuarioMapperImpl.java`.
    - A implementação conterá código equivalente a:
        
        ```java
        @Component
        public class UsuarioMapperImpl implements UsuarioMapper {
            @Override
            public UsuarioDTO toDTO(Usuario usuario) {
                if (usuario == null) {
                    return null;
                }
                UsuarioDTO dto = new UsuarioDTO();
                dto.setId(usuario.getId());
                dto.setNome(usuario.getNome());
                dto.setEmail(usuario.getEmail());
                dto.setDataNascimentoFormatada(formatarData(usuario.getDataNascimento()));
                return dto;
            }
        
            @Override
            public Usuario toEntity(UsuarioDTO dto) {
                if (dto == null) {
                    return null;
                }
                Usuario usuario = new Usuario();
                usuario.setId(dto.getId());
                usuario.setNome(dto.getNome());
                usuario.setEmail(dto.getEmail());
                usuario.setDataNascimento(parseData(dto.getDataNascimentoFormatada()));
                return usuario;
            }
        
            // Métodos auxiliares (já definidos na interface)
        }
        
        ```
        
9. **Testar Endpoints via Postman ou Curl**:
    - **Criar**:
        
        ```
        curl -X POST http://localhost:8080/api/usuarios \
          -H "Content-Type: application/json" \
          -d '{
                "nome": "Renata Costa",
                "email": "renata@example.com",
                "dataNascimentoFormatada": "10/10/1995"
              }'
        
        ```
        
        - Resposta esperada (exemplo):
            
            ```json
            {
              "id": 1,
              "nome": "Renata Costa",
              "email": "renata@example.com",
              "dataNascimentoFormatada": "10/10/1995"
            }
            
            ```
            
    - **Listar Todos**:
        
        ```
        curl http://localhost:8080/api/usuarios
        
        ```
        
        - Retorna lista de objetos `UsuarioDTO`.
10. **Verificar Código Gerado**
    - Navegue até `target/generated-sources/annotations/com/exemplo/app/mapper/UsuarioMapperImpl.java` para inspecionar a implementação gerada e ter certeza de que todas as anotações `@Mapping` foram aplicadas corretamente.

---

## Sugestões para Aprofundamento

- **Documentação Oficial**
    - [MapStruct Reference Guide](https://mapstruct.org/documentation/stable/reference/html/)
- **Artigos e Tutoriais**
    - Blog oficial do MapStruct no Medium ou em blogs de desenvolvedores Java (busque “MapStruct Spring Boot tutorial” para exemplos atualizados).
    - Vídeos no YouTube que mostram integração com Spring Boot e demonstrações práticas.
- **Projetos de Exemplo no GitHub**
    - Procure por repositórios que utilizem Spring Boot + MapStruct para ver padrões de projeto (ex.: “spring-boot-mapstruct-example”).
- **Comparar Abordagens**
    - Estude bibliotecas alternativas, como ModelMapper ou Orika, para entender diferenças de performance, facilidade de uso e limitações em cenários avançados.

---

> Conclusão
> 
> 
> Este guia cobriu desde a configuração inicial até exemplos completos de uso do MapStruct em um projeto Spring Boot com Maven. Seguindo os melhores padrões de organização e anotação, é possível automatizar a maior parte da lógica de conversão de objetos, resultando em código mais limpo, performático e menos propenso a erros em tempo de execução.
>