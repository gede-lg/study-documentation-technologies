# Principais anotações

---

## 1. Introdução

MapStruct é uma biblioteca Java que automatiza a geração de código para mapeamento entre objetos (por exemplo, Entidades JPA ↔ DTOs) em tempo de compilação. Em vez de escrever manualmente métodos de cópia de propriedades, o MapStruct gera implementações fortemente tipadas e de alta performance, sem utilizar reflexão. Em projetos Spring Boot, basta usar `componentModel = "spring"` para que cada interface de mapeamento seja registrada como bean e injetada via `@Autowired`.

---

## 2. Sumário

1. Conceitos Fundamentais
2. Principais Anotações e suas Propriedades
    - `@Mapper`
    - `@Mapping`
    - `@Mappings`
    - `@InheritConfiguration`
    - `@InheritInverseConfiguration`
    - `@MapperConfig`
    - `@MappingTarget`
    - `@Named`
    - `@BeanMapping`
    - `@IterableMapping`
    - `@MapMapping`
    - `@Context`
    - `@Qualifier`
    - Anotações auxiliares (enums)
3. Sintaxe e Uso Prático
    - Dependências Maven/Gradle
    - Exemplo Simples de Interface `@Mapper`
    - Mapeamentos de nested, coleções e valores padrão
    - Atualização de instância (`@MappingTarget`)
    - Uso de `@MapperConfig` para configurações globais
    - Métodos auxiliares com `@Named` e qualifiers
    - Contexto (`@Context`) e conversões condicionais
4. Cenários de Restrição
5. Melhores Práticas e Padrões de Uso
6. Exemplo Prático Completo (Entidade ↔ DTO)
7. Sugestões para Aprofundamento

---

## 3. Conceitos Fundamentais

- **Annotation Processor em Tempo de Compilação:** MapStruct escaneia interfaces anotadas com `@Mapper` e gera classes `Impl` correspondentes em `target/generated-sources/annotations`.
- **Sem Reflexão:** O código gerado invoca getters e setters diretamente, resultando em performance ideal.
- **Integração com Spring Boot:** Ao usar `componentModel = "spring"`, cada mapper vira um bean Spring, apto a ser injetado via `@Autowired` ou construtor.
- **Segurança de Tipos:** Como a geração ocorre em compila­ção, erros de mapeamento (campos faltando, tipos incompatíveis) são detectados antecipadamente, evitando NPEs em runtime.

---

## 4. Principais Anotações e suas Propriedades

### 4.1 `@Mapper`

```java
@Mapper(
    componentModel            = "spring",
    uses                      = { OutroMapper.class, UtilClasse.class },
    implementationName        = "NomePersonalizadoImpl",
    implementationPackage     = "com.exemplo.impl",
    unmappedTargetPolicy      = ReportingPolicy.ERROR,
    unmappedSourcePolicy      = ReportingPolicy.WARN,
    typeConversionPolicy      = ReportingPolicy.IGNORE,
    nullValueCheckStrategy    = NullValueCheckStrategy.ALWAYS,
    nullValueMappingStrategy  = NullValueMappingStrategy.RETURN_DEFAULT,
    collectionMappingStrategy = CollectionMappingStrategy.PREFER_COLLECTION_COPY_CONSTRUCTOR,
    mappingInheritanceStrategy= MappingInheritanceStrategy.AUTO_INHERIT_ALL_FROM_CONFIG,
    builder                   = @Builder(disableBuilder = true)
)
public interface ExemploMapper { … }

```

- **componentModel** (`String`):
    - `"default"`: usa `Mappers.getMapper(...)`.
    - `"spring"`: gera `@Component` na classe impl, permitindo DI.
    - `"cdi"`, `"jsr330"`, `"guice"`: para outros containers de injeção.
- **uses** (`Class<?>[]`):
    
    Lista de classes (outros mappers ou utilitários) cujos métodos MapStruct pode chamar para converter tipos personalizados.
    
- **implementationName** (`String`):
    
    Nome exato que a classe gerada terá (por padrão, `SeuMapperNomeImpl`).
    
- **implementationPackage** (`String`):
    
    Pacote onde MapStruct colocará a classe gerada.
    
- **unmappedTargetPolicy** (`ReportingPolicy`):
    
    Define comportamento para campos destino sem mapeamento:
    
    - `IGNORE`: não gerar aviso.
    - `WARN`: emitir warning.
    - `ERROR`: falhar compilação se existir campo destino sem mapeamento.
- **unmappedSourcePolicy** (`ReportingPolicy`):
    
    Política para campos origem não utilizados em nenhum `@Mapping`.
    
- **typeConversionPolicy** (`ReportingPolicy`):
    
    Política para conversões implícitas não presentes (ex.: `String → Enum`).
    
- **nullValueCheckStrategy** (`NullValueCheckStrategy`):
    - `ON_IMPLICIT_CONVERSION`: verifica `null` apenas ao converter tipos diferentes.
    - `ALWAYS`: sempre checa `null` antes de chamar getter.
- **nullValueMappingStrategy** (`NullValueMappingStrategy`):
    - `RETURN_NULL`: se objeto fonte for `null`, retorna `null`.
    - `RETURN_DEFAULT`: se fonte for `null`, retorna nova instância via construtor padrão.
- **collectionMappingStrategy** (`CollectionMappingStrategy`):
    - `ACCESSOR_ONLY`: usa getters e setters ou `addAll`.
    - `PREFER_COLLECTION_COPY_CONSTRUCTOR`: tenta chamar construtor de cópia de coleção (ex.: `new ArrayList<>(origem)`).
    - `TARGET_IMMUTABLE`: gera coleções imutáveis, se o tipo destino suportar.
- **mappingInheritanceStrategy** (`MappingInheritanceStrategy`):
    - `AUTO_INHERIT_FROM_CONFIG`: herda anotações de `@MapperConfig` apenas se o método tiver `@InheritConfiguration`.
    - `AUTO_INHERIT_ALL_FROM_CONFIG`: herda todas anotações de `@MapperConfig` sem necessidade de `@InheritConfiguration`.
- **builder** (`@Builder`):
    - `disableBuilder = true|false`: desabilita ou habilita uso de *builder* no tipo destino.
    - `builderClassName`, `buildMethod`, `builderMethodName`: configuram customizações para pattern builder (ex.: classes geradas por Lombok).

---

### 4.2 `@Mapping`

```java
@Mapping(
    target                        = "campoDestino",
    source                        = "campoOrigem.nested",
    dateFormat                    = "dd/MM/yyyy",
    numberFormat                  = "#,##0.00",
    defaultValue                  = "VALOR_PADRAO",
    constant                      = "TEXTO_LITERAL",
    expression                    = "java(converterEspecial(origem.getX()))",
    sourceExpression              = "java(origem.getLista().stream().map(Item::getId).collect(Collectors.toList()))",
    ignore                        = false,
    qualifiedByName               = "nomeDoMetodoNamed",
    qualifiedBy                   = { MinhasQualifier.class },
    nullValueMappingStrategy      = NullValueMappingStrategy.RETURN_DEFAULT,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)

```

- **target** (`String`, obrigatório):
    
    Nome do atributo no objeto de destino. Pode usar “nested” no destino, ex.: `"endereco.cidade"`.
    
- **source** (`String`):
    
    Nome do atributo no objeto origem. Também aceita “nested”, ex.: `"cliente.nome"`. Se omitido, assume que `source` e `target` têm o mesmo nome.
    
- **dateFormat** (`String`):
    
    Padrão de formatação para conversão entre `String` ↔ `java.util.Date` ou `java.time.*`. Ex.: `"yyyy-MM-dd"`.
    
- **numberFormat** (`String`):
    
    Padrão de formatação numérica (usa `DecimalFormat`), ex.: `"#,##0.00"`.
    
- **defaultValue** (`String`):
    
    Se o `source` resultar em `null`, atribui esse literal ao destino. Útil quando destino é `int` ou `String`.
    
- **constant** (`String`):
    
    Ignora o `source` e atribui sempre esse literal no destino.
    
- **expression** (`String`):
    
    Permite inserir código Java inline, envolto em `java(...)`. Ex.:
    
    ```java
    @Mapping(target="precoComTaxa", expression="java(origem.getPreco().multiply(BigDecimal.valueOf(1.10)))")
    
    ```
    
- **sourceExpression** (`String`):
    
    Similar a `expression`, mas ignora o `source`. Útil ao usar streams ou chamadas mais complexas para gerar valor. Ex.:
    
    ```java
    @Mapping(target = "ids", sourceExpression = "java(origem.getLista().stream().map(Item::getId).collect(Collectors.toList()))")
    
    ```
    
- **ignore** (`boolean`):
    
    Se `true`, esse campo destino é ignorado (mesmo que haja atributo no source).
    
- **qualifiedByName** (`String[]`):
    
    Lista de nomes de métodos anotados com `@Named`. O MapStruct usará esse método para converter esse campo específico.
    
- **qualifiedBy** (`Class<? extends Annotation>[]`):
    
    Lista de annotations `@Qualifier` customizadas que indicam quais métodos auxiliares usar para conversão.
    
- **nullValueMappingStrategy** (`NullValueMappingStrategy`):
    - `RETURN_NULL`: se o `source` for `null`, retorna `null` no destino.
    - `RETURN_DEFAULT`: retorna nova instância padrão (ex.: empty list).
- **nullValuePropertyMappingStrategy** (`NullValuePropertyMappingStrategy`):
    - `SET_TO_NULL`: se `source` for `null`, seta `null` na propriedade destino.
    - `IGNORE`: não altera valor já presente no destino (usado com `@MappingTarget`).

---

### 4.3 `@Mappings`

```java
@Mappings({
    @Mapping(source = "id",   target = "clienteId"),
    @Mapping(source = "nome", target = "nomeCliente"),
    @Mapping(target = "senha", ignore = true)
})

```

- **Propriedade:**
    - Apenas container para agrupar múltiplas anotações `@Mapping`.
    - Em versões recentes do MapStruct, basta declarar múltiplos `@Mapping` sobre o mesmo método; `@Mappings` é opcional.

---

### 4.4 `@InheritConfiguration`

```java
@MapperConfig
public interface ConfigBase {
    @Mapping(source = "id",   target = "clienteId")
    @Mapping(source = "nome", target = "nomeCliente")
    ClienteDTO toDTO(Cliente c);
}

@Mapper(config = ConfigBase.class)
public interface PedidoMapper {
    @InheritConfiguration(name = "toDTO")
    PedidoDTO toDTO(Pedido p);
}

```

- **Propriedade `name`** (`String`):
    - Nome do método (no mesmo mapper ou em `@MapperConfig`) cujas anotações `@Mapping` serão herdadas.
    - Se omitido, MapStruct tenta encontrar método com mesmo nome no `@MapperConfig` ou dentro da própria interface.
- **Comportamento:**
    - Copia todas as anotações `@Mapping` do método “pai” para o método atual.
    - Útil para evitar duplicação de mapeamentos quando as classes têm campos em comum (ex.: `id`, `nome`).

---

### 4.5 `@InheritInverseConfiguration`

```java
@Mapper
public interface UsuarioMapper {
    @Mapping(source = "id",   target = "usuarioId")
    @Mapping(source = "nome", target = "nomeUsuario")
    UsuarioDTO toDTO(Usuario entidade);

    @InheritInverseConfiguration
    Usuario toEntity(UsuarioDTO dto);
}

```

- **Sem propriedades próprias.**
- **Comportamento:**
    - Inverte automaticamente os pares `source ↔ target` definidos no método “pai”.
    - Se `toDTO` mapeia `entidade.id → usuarioId`, a inversão fará `usuarioId → entidade.id`.

---

### 4.6 `@MapperConfig`

```java
@MapperConfig(
    componentModel            = "spring",
    unmappedTargetPolicy      = ReportingPolicy.ERROR,
    unmappedSourcePolicy      = ReportingPolicy.WARN,
    typeConversionPolicy      = ReportingPolicy.ERROR,
    nullValueCheckStrategy    = NullValueCheckStrategy.ON_IMPLICIT_CONVERSION,
    nullValueMappingStrategy  = NullValueMappingStrategy.RETURN_DEFAULT,
    collectionMappingStrategy = CollectionMappingStrategy.ACCESSOR_ONLY,
    mappingInheritanceStrategy= MappingInheritanceStrategy.AUTO_INHERIT_ALL_FROM_CONFIG,
    builder                   = @Builder(disableBuilder = false)
)
public interface ConfiguracaoGlobal { }

```

- **componentModel, unmappedTargetPolicy, unmappedSourcePolicy, typeConversionPolicy, nullValueCheckStrategy, nullValueMappingStrategy, collectionMappingStrategy, mappingInheritanceStrategy, builder**
    - Mesmas propriedades que `@Mapper`, mas definidas como padrão compartilhado.
- **Uso:**
    - Interfaces de mapper específicas referenciam via `@Mapper(config = ConfiguracaoGlobal.class)`.
    - Fábrica de configurações padronizadas, evitando repetir atributos em cada `@Mapper`.

---

### 4.7 `@MappingTarget`

```java
@Mapper(componentModel = "spring")
public interface ProdutoMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void atualizarProduto(ProdutoDTO dto, @MappingTarget Produto entidadeExistente);
}

```

- **Sem propriedades próprias.**
- **Uso:**
    - Marca o parâmetro que receberá valores do DTO, atualizando-o em vez de criar instância nova.
    - Geralmente combinado com `@BeanMapping(nullValuePropertyMappingStrategy = IGNORE)` para não sobrepor campos que estejam `null` no DTO.

---

### 4.8 `@Named`

```java
@Mapper(componentModel = "spring")
public interface ConversorUtil {
    @Named("formatarDataLonga")
    default String formatarData(LocalDate data) {
        return data == null ? null : data.format(DateTimeFormatter.ofPattern("dd MMM yyyy", new Locale("pt","BR")));
    }

    @Mapping(source = "dataCriacao", target = "dataFormatada", qualifiedByName = "formatarDataLonga")
    DocumentoDTO toDTO(Documento doc);
}

```

- **Propriedade `value` (opcional)** (`String`):
    - Define explicitamente o nome do método.
    - Se omitido, o nome do método é usado como nome.
- **Uso:**
    - Permite criar funções auxiliares de conversão e referenciá-las em `@Mapping(qualifiedByName = "nome")`.
    - Facilita reaproveitamento de lógica em vários mappers.

---

### 4.9 `@BeanMapping`

```java
@Mapper(componentModel = "spring")
public interface ClienteMapper {
    @BeanMapping(
        ignoreByDefault                  = true,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL,
        nullValueMappingStrategy         = NullValueMappingStrategy.RETURN_DEFAULT,
        resultType                       = ClienteDTO.class
    )
    @Mapping(source = "nome",       target = "nomeCliente")
    @Mapping(source = "email",      target = "emailCliente")
    ClienteDTO toDTO(Cliente c);
}

```

- **ignoreByDefault** (`boolean`):
    - `true`: mapeia apenas campos que tenham `@Mapping` explícito; ignora todos os outros campos destino.
- **nullValuePropertyMappingStrategy** (`NullValuePropertyMappingStrategy`):
    - `SET_TO_NULL`: se o campo fonte for `null`, seta `null` na propriedade destino.
    - `IGNORE`: se fonte for `null`, mantém valor anterior do destino (usado principalmente em métodos `@MappingTarget`).
- **nullValueMappingStrategy** (`NullValueMappingStrategy`):
    - `RETURN_NULL`: se o objeto fonte for `null`, retorna `null`.
    - `RETURN_DEFAULT`: retorna instância nova e vazia do tipo destino.
- **resultType** (`Class<?>`):
    - Força o tipo retorno do método, útil quando MapStruct não consegue inferir (ex.: mapeamentos genéricos ou heranças).

---

### 4.10 `@IterableMapping`

```java
@Mapper(componentModel = "spring", uses = ItemMapper.class)
public interface PedidoMapper {
    @IterableMapping(
        qualifiedByName           = "paraItemResumo",
        nullValueMappingStrategy  = NullValueMappingStrategy.RETURN_DEFAULT,
        elementTargetType         = ItemResumoDTO.class
    )
    List<ItemResumoDTO> toListaResumo(List<Item> itens);
}

```

- **qualifiedByName** (`String[]`):
    
    Nome(s) de método(s) `@Named` usados para converter cada elemento da coleção.
    
- **qualifiedBy** (`Class<? extends Annotation>[]`):
    
    Lista de qualifiers customizadas usados para converter cada elemento.
    
- **nullValueMappingStrategy** (`NullValueMappingStrategy`):
    - `RETURN_NULL`: se a lista fonte for `null`, retorna `null`.
    - `RETURN_DEFAULT`: se fonte for `null`, retorna lista vazia (ex.: `new ArrayList<>()`).
- **elementTargetType** (`Class<?>`):
    
    Quando MapStruct não infere corretamente o tipo destino dos elementos (ex.: em heranças ou genéricos), força o tipo.
    
- **qualifierResolutionStrategy** (`QualifierControl`):
    
    Controla como MapStruct resolve múltiplos qualificadores; opções padrão: `AFTER_MAPPING`.
    

---

### 4.11 `@MapMapping`

```java
@Mapper(componentModel = "spring")
public interface ExemploMapMapper {
    @MapMapping(
        keyDateFormat           = "yyyy-MM-dd",
        valueDateFormat         = "dd/MM/yyyy",
        keyQualifiedByName      = "stringParaLocalDate",
        valueQualifiedByName    = "stringParaLocalDate",
        nullValueMappingStrategy= NullValueMappingStrategy.RETURN_DEFAULT,
        keyTargetType           = LocalDate.class,
        valueTargetType         = LocalDate.class
    )
    Map<LocalDate, LocalDate> toMap(Map<String, String> datas);
}

```

- **keyDateFormat** (`String`):
    
    Padrão de formatação de `String ↔ java.util.Date` ou `java.time.*` para chaves do mapa.
    
- **valueDateFormat** (`String`):
    
    Mesmo, mas para valores do mapa.
    
- **keyQualifiedByName** (`String[]`):
    
    Nome(s) de método(s) `@Named` para converter chaves.
    
- **valueQualifiedByName** (`String[]`):
    
    Nome(s) de método(s) `@Named` para converter valores.
    
- **qualifiedBy** (`Class<? extends Annotation>[]`):
    
    Lista de qualifiers customizadas que indicam métodos a serem usados para converter chaves/valores.
    
- **nullValueMappingStrategy** (`NullValueMappingStrategy`):
    - `RETURN_NULL`: se o mapa fonte for `null`, retorna `null`.
    - `RETURN_DEFAULT`: retorna mapa vazio (ex.: `new HashMap<>()`).
- **keyTargetType** & **valueTargetType** (`Class<?>`):
    
    Quando MapStruct não consegue inferir tipo de chave ou valor, força o tipo.
    

---

### 4.12 `@Context`

```java
@Mapper(componentModel = "spring", uses = { ClienteService.class })
public interface PedidoMapper {
    @Mapping(source = "clienteId", target = "cliente", qualifiedByName = "buscaCliente")
    Pedido toEntity(PedidoDTO dto, @Context ClienteService clienteService);

    @Named("buscaCliente")
    default Cliente mapCliente(Long id, @Context ClienteService servico) {
        return servico.buscarPorId(id);
    }
}

```

- **Sem propriedades próprias.**
- **Uso:**
    - Marca um parâmetro que não deve ser mapeado como campo, mas repassado para métodos `@Named` ou outros auxiliares.
    - Permite usar serviços externos, repositórios ou objetos auxiliares durante o mapeamento.
- **Regra:**
    - Todos os parâmetros marcados com `@Context` não entram na lógica de copiar propriedades; servem apenas como argumento adicional para métodos auxiliares.

---

### 4.13 `@Qualifier`

```java
@Qualifier
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.CLASS)
public @interface ParaMinusculas { }

@Mapper(componentModel = "spring")
public interface StringMapper {
    @ParaMinusculas
    default String toLower(String valor) {
        return valor == null ? null : valor.toLowerCase();
    }

    @Mapping(source = "texto", target = "textoFormatado", qualifiedBy = ParaMinusculas.class)
    DocumentoDTO toDTO(Documento doc);
}

```

- **Sem propriedades próprias.**
- **Uso:**
    - Anota métodos auxiliares, permitindo diferenciá-los quando há mais de uma forma de converter do mesmo tipo de origem para o mesmo tipo de destino.
    - Em `@Mapping`, informar `qualifiedBy = { MinhaQualifier.class }` para usar exclusivamente aquele método.

---

### 4.14 Anotações Auxiliares (Enums)

### 4.14.1 `@NullValueCheckStrategy`

- **ON_IMPLICIT_CONVERSION:** checa `null` apenas quando converter tipos incompatíveis (ex.: `String → LocalDate`).
- **ALWAYS:** checa `null` antes de qualquer `getter`.

### 4.14.2 `@NullValueMappingStrategy`

- **RETURN_NULL:** se objeto fonte `null`, retorna `null`.
- **RETURN_DEFAULT:** retorna instância vazia do tipo destino.

### 4.14.3 `@NullValuePropertyMappingStrategy`

- **SET_TO_NULL:** se campo fonte for `null`, seta `null` no destino.
- **IGNORE:** em métodos de atualização (`@MappingTarget`), se campo fonte for `null`, ignora o campo e mantém valor anterior no destino.

### 4.14.4 `@CollectionMappingStrategy`

- **ACCESSOR_ONLY:** usa getters e setters ou `addAll`.
- **PREFER_COLLECTION_COPY_CONSTRUCTOR:** usa construtor de cópia (ex.: `new ArrayList<>(origem)`).
- **TARGET_IMMUTABLE:** produz coleções imutáveis no destino, se suportado.

### 4.14.5 `@MappingInheritanceStrategy`

- **AUTO_INHERIT_FROM_CONFIG:** herda anotações de `@MapperConfig` apenas onde há `@InheritConfiguration`.
- **AUTO_INHERIT_ALL_FROM_CONFIG:** herda todas anotações de `@MapperConfig` sem necessidade de `@InheritConfiguration` explícita.

---

## 5. Sintaxe e Uso Prático

### 5.1 Dependências (Maven)

```xml
<dependencies>
    <!-- MapStruct -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
    <!-- Annotation Processor -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>1.5.5.Final</version>
        <scope>provided</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <!-- Garante que o annotation processor seja executado -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>1.5.5.Final</version>
                    </path>
                </annotationProcessorPaths>
                <source>17</source>
                <target>17</target>
            </configuration>
        </plugin>
    </plugins>
</build>

```

### 5.2 Dependências (Gradle, Kotlin DSL)

```kotlin
plugins {
    id("java")
    id("org.springframework.boot") version "3.0.0"
}

dependencies {
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
}

tasks.withType<JavaCompile> {
    options.annotationProcessorPath = configurations.annotationProcessor.get()
}

```

---

### 5.3 Exemplo Simples de `@Mapper`

**Entidades e DTOs**:

```java
// Entidade JPA
public class Usuario {
    private Long id;
    private String nome;
    private LocalDate dataNascimento;
    // getters e setters
}

// DTO correspondente
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String dataNascimento; // formato "dd/MM/yyyy"
    // getters e setters
}

```

**Interface de Mapeamento**:

```java
@Mapper(componentModel = "spring", imports = DateTimeFormatter.class)
public interface UsuarioMapper {

    @Mapping(source = "dataNascimento", target = "dataNascimento", dateFormat = "dd/MM/yyyy")
    UsuarioDTO toDTO(Usuario entidade);

    @Mapping(source = "dataNascimento", target = "dataNascimento", dateFormat = "dd/MM/yyyy")
    Usuario toEntity(UsuarioDTO dto);
}

```

- O MapStruct gera `UsuarioMapperImpl` durante a compilação.
- Em um serviço Spring, basta injetar:
    
    ```java
    @Service
    public class UsuarioService {
        private final UsuarioMapper usuarioMapper;
        // Construtor injetado automaticamente
    }
    
    ```
    

---

### 5.4 Mapeamento de Coleções e Nested

- **Coleções**:
    
    Se houver método `T toDTO(U u)`, MapStruct mapeia automaticamente `List<U> → List<T>` se você declarar:
    
    ```java
    List<UsuarioDTO> toDTOs(List<Usuario> usuarios);
    
    ```
    
- **Objetos Aninhados (Nested)**:
    
    Basta usar “ponto” no `source`:
    
    ```java
    @Mapping(source = "endereco.cidade", target = "cidadeDTO")
    
    ```
    
    MapStruct chama `entidade.getEndereco().getCidade()` e atribui a `dto.setCidadeDTO(...)`.
    

---

### 5.5 Valores Padrão, Expression e sourceExpression

- **defaultValue**:
    
    ```java
    @Mapping(source = "estoque", target = "estoque", defaultValue = "0")
    
    ```
    
    Se `obj.getEstoque()` for `null`, atribui `0` no destino.
    
- **constant**:
    
    ```java
    @Mapping(target = "status", constant = "ATIVO")
    
    ```
    
    Define sempre **ATIVO**, independentemente do source.
    
- **expression**:
    
    ```java
    @Mapping(target = "totalComTaxa", expression = "java(origem.getTotal().multiply(BigDecimal.valueOf(1.1)))")
    
    ```
    
    Permite código Java “inline” para lógica leve.
    
- **sourceExpression**:
    
    ```java
    @Mapping(target = "ids", sourceExpression = "java(origem.getItens().stream().map(Item::getId).collect(Collectors.toList()))")
    
    ```
    
    Útil ao precisar de streams ou operações complexas de transformação de coleção.
    

---

### 5.6 Atualização de Instância com `@MappingTarget`

```java
@Mapper(componentModel = "spring")
public interface ClienteMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void atualizarCliente(ClienteDTO dto, @MappingTarget Cliente entidadeExistente);
}

```

- **uso típico**:
    
    ```java
    Cliente entidade = colegioRepo.findById(id).orElseThrow(...);
    clienteMapper.atualizarCliente(dto, entidade);
    repositorio.save(entidade);
    
    ```
    
- **Combinação com `@BeanMapping(nullValuePropertyMappingStrategy = IGNORE)`**:
    
    Campos `null` no DTO não sobrescrevem valores existentes na entidade.
    

---

### 5.7 Compartilhando Configurações com `@MapperConfig`

**Configuração Global**:

```java
@MapperConfig(
    componentModel            = "spring",
    unmappedTargetPolicy      = ReportingPolicy.ERROR,
    nullValueMappingStrategy  = NullValueMappingStrategy.RETURN_DEFAULT,
    collectionMappingStrategy = CollectionMappingStrategy.ACCESSOR_ONLY,
    mappingInheritanceStrategy= MappingInheritanceStrategy.AUTO_INHERIT_ALL_FROM_CONFIG
)
public interface GlobalMapperConfig { }

```

**Mapper específico**:

```java
@Mapper(config = GlobalMapperConfig.class, uses = EnderecoMapper.class)
public interface ClienteMapper {
    ClienteDTO toDTO(Cliente c);
    Cliente toEntity(ClienteDTO dto);
}

```

- As propriedades de `GlobalMapperConfig` valem para qualquer mapper que referencie `config = GlobalMapperConfig.class`.
- Evita duplicar `componentModel = "spring"`, políticas de null, etc.

---

### 5.8 Métodos Auxiliares com `@Named`

**Classe utilitária (pode estar em qualquer pacote)**:

```java
@Mapper(componentModel = "spring")
public interface DataConversor {

    @Named("paraDataLonga")
    default String paraDataLonga(LocalDate data) {
        if (data == null) return null;
        return data.format(DateTimeFormatter.ofPattern("dd MMM yyyy", new Locale("pt","BR")));
    }
}

```

**Uso em outro mapper**:

```java
@Mapper(componentModel = "spring", uses = DataConversor.class)
public interface EventoMapper {

    @Mapping(source = "dataEvento", target = "dataFormatada", qualifiedByName = "paraDataLonga")
    EventoDTO toDTO(Evento evento);
}

```

- O MapStruct chama automaticamente `DataConversor.paraDataLonga(evento.getDataEvento())`.
- Caso haja mais de um método `@Named("paraDataLonga")`, use `qualifiedBy` com `@Qualifier` customizada para evitar ambiguidade.

---

### 5.9 Contexto com `@Context`

**Serviço auxiliar**:

```java
@Service
public class ClienteService {
    public Cliente buscarPorId(Long id) { … }
}

```

**Mapper**:

```java
@Mapper(componentModel = "spring", uses = { ClienteService.class })
public interface PedidoMapper {

    @Mapping(source = "clienteId", target = "cliente", qualifiedByName = "mapearCliente")
    Pedido toEntity(PedidoDTO dto, @Context ClienteService clienteService);

    @Named("mapearCliente")
    default Cliente mapCliente(Long id, @Context ClienteService service) {
        return service.buscarPorId(id);
    }
}

```

- Ao chamar `pedidoMapper.toEntity(dto, clienteService)`, o MapStruct repassa `clienteService` para o método `mapCliente`.
- Assim, você pode buscar entidades do banco ou aplicar regras externas durante o mapeamento.

---

### 5.10 Qualifiers Customizados com `@Qualifier`

**Definição do qualifyer**:

```java
@Qualifier
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.CLASS)
public @interface ParaMaiusculas { }

```

**Método utilitário**:

```java
@Mapper(componentModel = "spring")
public interface StringMapper {

    @ParaMaiusculas
    default String toUpperCase(String valor) {
        return valor == null ? null : valor.toUpperCase();
    }
}

```

**Uso em outro mapper**:

```java
@Mapper(componentModel = "spring", uses = StringMapper.class)
public interface DocumentoMapper {

    @Mapping(source = "titulo", target = "tituloFormatado", qualifiedBy = ParaMaiusculas.class)
    DocumentoDTO toDTO(Documento doc);
}

```

- Se houvesse outro método que também convertesse `String → String` sem a annotation `@ParaMaiusculas`, MapStruct escolheria apenas o método anotado com `@ParaMaiusculas` para este mapeamento específico.

---

## 6. Cenários de Restrição ou Não Aplicação

1. **Tipos Dinâmicos ou Genéricos Extremos**
    - Estruturas do tipo `Map<String,Object>` ou objetos criados em runtime (via reflexão) não se encaixam bem no model de código gerado do MapStruct.
2. **Lógica de Negócio Complexa**
    - Quando há regras muito condicionais e mutáveis (ex.: se `status A` faça “X”, se `status B` faça “Y”, dezenas de variações), às vezes é mais legível escrever um método manual do que concentrar tudo em `@Mapping(expression=…)`.
3. **Quando se Precisa de Reflexão em Runtime**
    - MapStruct não lida com mapeamentos de propriedades descobertas só em runtime (por ex.: frameworks que geram proxy e adicionam campos dinamicamente).
4. **Performance em Volume Extremo**
    - Apesar de MapStruct ser muito performático, se você tiver processamento de milhões de objetos em lote, é bom benchmarkar contra uma solução manual otimizada (apesar de, em geral, MapStruct ganhar nessa comparação).

---

## 7. Melhores Práticas e Padrões de Uso

1. **Interface Enxuta e Focada**
    - Cada interface `@Mapper` deve mapear apenas classes relacionadas (ex.: `ClienteMapper` → `Cliente ↔ ClienteDTO`).
2. **Configuração Global via `@MapperConfig`**
    - Reúna políticas de `null`, relatórios de mapeamentos não feitos e estratégias de coleções num único `@MapperConfig`, evitando inconsistências.
3. **Documentar Conversões Especiais com `@Named`**
    - Sempre que usar `@Named` ou qualifiers, adicione JavaDocs ao método, explicando para que serve e em quais cenários aplicá-lo.
4. **Evitar Ambiguidade**
    - Se tiver múltiplos métodos que convertem do mesmo tipo de origem para o mesmo tipo de destino, use `@Qualifier` ou `@Named` para indicar qual usar.
5. **Cobertura de Testes**
    - Crie testes unitários para cada mapper, validando conversões de campos simples, nested, coleções e casos de valores nulos.
6. **Estratégia de Nulls Padronizada**
    - Decida se, em caso de objeto fonte `null`, você quer `RETURN_NULL` ou `RETURN_DEFAULT`. Configure globalmente em `@MapperConfig` ou em mapeamentos críticos com `@Mapping(nullValueMappingStrategy=…)`.
7. **Atualização Parcial (“PATCH”)**
    - Combine `@MappingTarget` com `@BeanMapping(nullValuePropertyMappingStrategy = IGNORE)` para não sobrescrever campos que estejam `null` no DTO.
8. **Verificar Código Gerado**
    - Sempre dê uma olhada no código de `Impl`. Isso ajuda a entender exatamente o que está sendo invocado e a diagnosticar problemas.

---

## 8. Exemplo Prático Completo

### 8.1 Cenário e Estrutura de Pacotes

```
src/main/java
 └─ com/exemplo/vendas
      ├─ domain
      │    ├─ Cliente.java
      │    ├─ Pedido.java
      │    ├─ ItemPedido.java
      │    └─ Endereco.java
      ├─ dto
      │    ├─ ClienteDTO.java
      │    ├─ PedidoDTO.java
      │    ├─ ItemPedidoDTO.java
      │    └─ EnderecoDTO.java
      ├─ mapper
      │    ├─ config
      │    │    └─ GlobalMapperConfig.java
      │    ├─ ClienteMapper.java
      │    ├─ PedidoMapper.java
      │    ├─ ItemPedidoMapper.java
      │    └─ EnderecoMapper.java
      └─ service
           └─ ClienteService.java

```

### 8.2 Modelos e DTOs

```java
// domain/Endereco.java
@Embeddable
public class Endereco {
    private String rua;
    private String cidade;
    private String cep;
    // getters e setters
}

// domain/Cliente.java
@Entity
public class Cliente {
    @Id @GeneratedValue
    private Long id;
    private String nome;
    private String email;

    @Embedded
    private Endereco endereco;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Pedido> pedidos;
    // getters e setters
}

// domain/ItemPedido.java
@Entity
public class ItemPedido {
    @Id @GeneratedValue
    private Long id;
    private String descricao;
    private Integer quantidade;
    private BigDecimal precoUnitario;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;
    // getters e setters
}

// domain/Pedido.java
@Entity
public class Pedido {
    @Id @GeneratedValue
    private Long id;
    private LocalDate dataPedido;
    private BigDecimal total;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens;
    // getters e setters
}

```

```java
// dto/EnderecoDTO.java
public class EnderecoDTO {
    private String rua;
    private String cidade;
    private String cep;
    // getters e setters
}

// dto/ClienteDTO.java
public class ClienteDTO {
    private Long id;
    private String nome;
    private String email;
    private EnderecoDTO endereco;
    // para simplificar, não trazemos lista de pedidos aqui
    // getters e setters
}

// dto/ItemPedidoDTO.java
public class ItemPedidoDTO {
    private Long id;
    private String descricao;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    // getters e setters
}

// dto/PedidoDTO.java
public class PedidoDTO {
    private Long id;
    private String dataPedido; // formato "dd/MM/yyyy"
    private BigDecimal total;
    private List<ItemPedidoDTO> itens;
    // getters e setters
}

```

---

### 8.3 Configuração Global com `@MapperConfig`

```java
// mapper/config/GlobalMapperConfig.java
@MapperConfig(
    componentModel            = "spring",
    unmappedTargetPolicy      = ReportingPolicy.ERROR,
    nullValueMappingStrategy  = NullValueMappingStrategy.RETURN_DEFAULT,
    collectionMappingStrategy = CollectionMappingStrategy.ACCESSOR_ONLY,
    mappingInheritanceStrategy= MappingInheritanceStrategy.AUTO_INHERIT_ALL_FROM_CONFIG
)
public interface GlobalMapperConfig { }

```

- **unmappedTargetPolicy = ERROR**: falha compilação se existir campo destino sem mapeamento.
- **nullValueMappingStrategy = RETURN_DEFAULT**: retorna instância vazia quando fonte for `null`.
- **collectionMappingStrategy = ACCESSOR_ONLY**: usa getters/setters.
- **mappingInheritanceStrategy = AUTO_INHERIT_ALL_FROM_CONFIG**: métodos herdarão automaticamente configurações definidas aqui.

---

### 8.4 Mappers Específicos

```java
// mapper/EnderecoMapper.java
@Mapper(config = GlobalMapperConfig.class)
public interface EnderecoMapper {
    EnderecoDTO toDTO(Endereco endereco);
    Endereco toEntity(EnderecoDTO dto);
}

```

- Campos de `Endereco` e `EnderecoDTO` têm mesmo nome, logo mapeamento implícito basta.

```java
// mapper/ItemPedidoMapper.java
@Mapper(config = GlobalMapperConfig.class)
public interface ItemPedidoMapper {

    @Mapping(source = "precoUnitario", target = "precoUnitario")
    ItemPedidoDTO toDTO(ItemPedido item);

    @InheritInverseConfiguration
    ItemPedido toEntity(ItemPedidoDTO dto);

    List<ItemPedidoDTO> toDTOs(List<ItemPedido> itens);
}

```

- `@InheritInverseConfiguration` herda inversão de mapeamentos de `toDTO` para `toEntity`.
- `toDTOs(List<ItemPedido>)` mapeia automaticamente cada elemento via `toDTO(ItemPedido)`.

```java
// mapper/PedidoMapper.java
@Mapper(
    config = GlobalMapperConfig.class,
    uses   = { ItemPedidoMapper.class, ClienteService.class }
)
public interface PedidoMapper {

    @Mapping(source = "dataPedido", target = "dataPedido", dateFormat = "dd/MM/yyyy")
    @Mapping(source = "itens",      target = "itens")
    @Mapping(source = "cliente.id", target = "clienteId")
    PedidoDTO toDTO(Pedido pedido);

    @InheritInverseConfiguration
    @Mapping(target = "cliente", ignore = true) // associamos cliente manualmente em serviço
    @Mapping(target = "itens",   ignore = true) // itens criados manualmente
    Pedido toEntity(PedidoDTO dto, @Context ClienteService clienteService);

    @Named("mapearCliente")
    default Cliente mapCliente(Long clienteId, @Context ClienteService service) {
        return service.buscarPorId(clienteId);
    }

    @IterableMapping(qualifiedByName = "mapearItem")
    List<ItemPedido> toItens(List<ItemPedidoDTO> itensDTO);

    @Named("mapearItem")
    default ItemPedido mapearItem(ItemPedidoDTO dto) {
        ItemPedido item = new ItemPedido();
        item.setId(dto.getId());
        item.setDescricao(dto.getDescricao());
        item.setQuantidade(dto.getQuantidade());
        item.setPrecoUnitario(dto.getPrecoUnitario());
        return item;
    }
}

```

- **uses = { ItemPedidoMapper.class, ClienteService.class }**: permite chamar `ItemPedidoMapper.toDTO(...)` e também injetar `ClienteService` via `@Context`.
- 1º método `toDTO`: mapeia `dataPedido` com `dateFormat`, lista de itens via `ItemPedidoMapper.toDTOs(...)` (implicitamente) e extrai `cliente.getId()` para `clienteId`.
- 2º método `toEntity`: inverte `dataPedido` e `clienteId → cliente` via `mapearCliente`. Ignora associação de `itens` porque vamos criá-los via `toItens(List<ItemPedidoDTO>)`.
- `@IterableMapping(qualifiedByName = "mapearItem")`: para cada `ItemPedidoDTO`, chama `mapearItem(dto)`, criando `ItemPedido`.

```java
// mapper/ClienteMapper.java
@Mapper(
    config = GlobalMapperConfig.class,
    uses   = { EnderecoMapper.class, PedidoMapper.class }
)
public interface ClienteMapper {

    @Mapping(source = "endereco", target = "endereco")
    @Mapping(source = "pedidos",  target = "pedidos", qualifiedByName = "mapearPedidos")
    ClienteDTO toDTO(Cliente cliente);

    @InheritInverseConfiguration
    Cliente toEntity(ClienteDTO dto);

    @IterableMapping(qualifiedByName = "mapearPedidoSimples")
    List<PedidoDTO> toDTOs(List<Pedido> pedidos);

    @Named("mapearPedidos")
    default List<PedidoDTO> mapearPedidos(List<Pedido> pedidos, @Context ClienteService cs) {
        // Exemplo de lógica customizada: apenas pedidos ativos, por exemplo
        return pedidos.stream()
                .filter(p -> p.getTotal().compareTo(BigDecimal.ZERO) > 0)
                .map(pedido -> toDTO(pedido))
                .collect(Collectors.toList());
    }

    @Named("mapearPedidoSimples")
    default PedidoDTO mapearPedidoSimples(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setDataPedido(pedido.getDataPedido().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        dto.setTotal(pedido.getTotal());
        return dto;
    }
}

```

- **uses = { EnderecoMapper.class, PedidoMapper.class }**: MapStruct usa `EnderecoMapper.toDTO(...)` para `endereco` e `PedidoMapper.toDTO(Pedido)` para cada pedido (via `@IterableMapping`).
- **@Mapping(source="pedidos", qualifiedByName="mapearPedidos")**: em vez de usar mapeamento implícito de lista, chamamos `mapearPedidos(pedidos, clienteService)`, que filtra e converte.
- Métodos `@Named` podem receber `@Context ClienteService` se necessário para lógica de domínio (aqui é exemplificativa).

---

### 8.5 Uso em Serviço Spring

```java
// service/ClienteService.java
@Service
public class ClienteService {

    private final ClienteRepository clienteRepo;
    private final ClienteMapper clienteMapper;

    public ClienteService(ClienteRepository clienteRepo, ClienteMapper clienteMapper) {
        this.clienteRepo   = clienteRepo;
        this.clienteMapper = clienteMapper;
    }

    public ClienteDTO criarCliente(ClienteDTO dto) {
        Cliente entidade = clienteMapper.toEntity(dto);
        clienteRepo.save(entidade);
        return clienteMapper.toDTO(entidade);
    }

    public ClienteDTO buscarPorId(Long id) {
        Cliente c = clienteRepo.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return clienteMapper.toDTO(c);
    }
}

```

- Basta injetar `ClienteMapper` (bean gerado pelo MapStruct).
- O método `criarCliente` converte `ClienteDTO → Cliente`, persiste, e retorna `ClienteDTO` via conversão inversa.

---

### 8.6 Testes Unitários

```java
// src/test/java/com/exemplo/vendas/mapper/ClienteMapperTest.java
@SpringBootTest
public class ClienteMapperTest {

    @Autowired
    private ClienteMapper clienteMapper;

    @Test
    void deveMapearClienteCompletoParaDTO() {
        Endereco endereco = new Endereco();
        endereco.setRua("Rua 1");
        endereco.setCidade("Cidade A");
        endereco.setCep("00000-000");

        Cliente cliente = new Cliente();
        cliente.setId(10L);
        cliente.setNome("Maria");
        cliente.setEmail("maria@exemplo.com");
        cliente.setEndereco(endereco);
        cliente.setPedidos(List.of()); // sem pedidos, para simplicidade

        ClienteDTO dto = clienteMapper.toDTO(cliente);

        assertEquals(10L, dto.getId());
        assertEquals("Maria", dto.getNome());
        assertEquals("maria@exemplo.com", dto.getEmail());
        assertEquals("Rua 1", dto.getEndereco().getRua());
        assertEquals("Cidade A", dto.getEndereco().getCidade());
        assertEquals("00000-000", dto.getEndereco().getCep());
    }

    @Test
    void deveMapearListaDeClientes() {
        Cliente c1 = new Cliente();
        c1.setId(1L);
        c1.setNome("Carlos");
        c1.setEmail("carlos@exemplo.com");

        Cliente c2 = new Cliente();
        c2.setId(2L);
        c2.setNome("Bianca");
        c2.setEmail("bianca@exemplo.com");

        List<Cliente> lista = List.of(c1, c2);
        List<ClienteDTO> dtos = clienteMapper.toDTOs(lista);

        assertEquals(2, dtos.size());
        assertEquals("Carlos", dtos.get(0).getNome());
        assertEquals("Bianca", dtos.get(1).getNome());
    }
}

```

- Testes garantem que mapeamentos implícitos, nested e coleções funcionem conforme esperado.

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial do MapStruct**
    - [MapStruct Reference Guide](https://mapstruct.org/documentation/stable/reference/html/).
2. **MapStruct e Lombok**
    - Se usar `@Data` e `@Builder` do Lombok, verifique se as convenções de método coincidem com as propriedades do MapStruct ou configure `@Builder(builderClassName="...", ...)`.
3. **MapStruct + Kotlin**
    - Ao usar `data class` em Kotlin, a inferência de tipos e construtores pode demandar ajustes; consulte a seção “Kotlin Support”.
4. **Performance e Comparativos**
    - Compare MapStruct com outras soluções (ModelMapper, Orika) em cenários de grande volume de objetos.
5. **Custom Annotation Processor Options**
    - Parâmetros como `Amapstruct.suppressGeneratorTimestamp=true` eliminam timestamps nas classes geradas, útil para commit em controle de versão.
6. **MapStruct e Bean Validation (JSR 380)**
    - Após converter DTOs em entidades, use `@Valid` em controladores ou serviços para validar constraints impostas em entidades.
7. **Integração com Spring Data Projections**
    - Explore como usar projeções do Spring Data junto com mapeamentos gerados pelo MapStruct para consultas mais performáticas.
8. **Debug do Código Gerado**
    - Estude classes geradas em `target/generated-sources/annotations` para entender como cada atributo em `@Mapping` ou `@Mapper` impacta o resultado.

---

**Conclusão:**

Neste guia, você encontrou:

- **Visão Geral** de MapStruct e sua filosofia de geração de código.
- **Descrição Completa** de cada anotação e todas as propriedades que podem ser combinadas para ajustar o comportamento de mapeamento.
- **Exemplos Práticos** demonstrando como configurar, usar anotações avançadas (nested, coleções, valores padrão, beans, qualifiers e contexto) e compartilhar configurações com `@MapperConfig`.
- **Boas Práticas** e cuidados (testes, políticas de null, herança de configurações).
- **Exemplo de Projeto** completo, incluindo entidades, DTOs, mappers, serviço e testes, que você pode usar como referência em projetos reais Spring Boot com Java.

Com isso, você tem um panorama detalhado para dominar MapStruct, desde casos simples até cenários mais complexos de herança de configuração, mapeamento condicional, uso de serviços externos e qualifiers customizados.