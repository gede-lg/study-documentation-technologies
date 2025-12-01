
O MapStruct é uma biblioteca Java poderosa que automatiza a conversão de objetos entre diferentes classes. Ele elimina a necessidade de escrever código boilerplate para mapear manualmente propriedades, reduzindo o tempo de desenvolvimento e aumentando a legibilidade do código.

### O que é e para que serve?

O MapStruct atua como um gerador de código, criando automaticamente classes de mapeamento com base em interfaces anotadas. Essas interfaces definem como os campos de um objeto de origem devem ser mapeados para um objeto de destino.

O uso do MapStruct oferece diversos benefícios:

- **Elimina código boilerplate:** O MapStruct gera automaticamente o código de mapeamento, liberando o desenvolvedor para focar na lógica da aplicação.
- **Melhora a legibilidade do código:** As interfaces de mapeamento do MapStruct são claras e concisas, tornando o código mais fácil de entender e manter.
- **Reduz o risco de erros:** O MapStruct garante que os objetos sejam mapeados de forma consistente, evitando erros de mapeamento manual.
- **Aumenta a produtividade:** O MapStruct permite que os desenvolvedores sejam mais produtivos, liberando-os da tarefa repetitiva de escrever código de mapeamento.

### Anotações MapStruct

O MapStruct fornece diversas anotações para personalizar o mapeamento de objetos:

- **@Mapping:** Define o mapeamento de um campo de origem para um campo de destino.

Java

```
@Mapping(source = "nomeCompleto", target = "nome")
public Destino toDestino(Origem origem);
```

- **@Mappings:** Define vários mapeamentos de campos de origem para campos de destino.

Java

```
@Mappings({
    @Mapping(source = "nomeCompleto", target = "nome"),
    @Mapping(source = "idade", target = "idade")
})
public Destino toDestino(Origem origem);
```

- **@InheritInverseMapping:** Indica que o mapeamento inverso deve ser herdado da anotação @Mapping:

Java

```
@Mapping(source = "nomeCompleto", target = "nome")
@InheritInverseMapping
public Destino toDestino(Origem origem);
```

**Propriedades da Anotação Mapping:**

- **source:** O nome do campo na classe de origem.
- **target:** O nome do campo na classe de destino.
- **ignore:** Indica que o campo não deve ser mapeado.
- **dateFormat:** Define o formato de data para o mapeamento de campos de data.
- **numberFormat:** Define o formato de número para o mapeamento de campos numéricos.

### Exemplos de Uso

**Exemplo 1:** Mapeamento simples de um campo

Java

```
public class Origem {
    private String nomeCompleto;
}

public class Destino {
    private String nome;
}

@Mapper
public interface OrigemDestinoMapper {
    @Mapping(source = "nomeCompleto", target = "nome")
    Destino toDestino(Origem origem);
}
```

**Exemplo 2:** Mapeamento de vários campos

Java

```
public class Origem {
    private String nomeCompleto;
    private int idade;
}

public class Destino {
    private String nome;
    private String idadeFormatada;
}

@Mapper
public interface OrigemDestinoMapper {
    @Mappings({
        @Mapping(source = "nomeCompleto", target = "nome"),
        @Mapping(target = "idadeFormatada", expression = "java(origem.getIdade() + \" anos\")")
    })
    Destino toDestino(Origem origem);
}
```

**Exemplo 3:** Mapeamento com condições

Java

```
public class Origem {
    private boolean isAtivo;
    private String nome;

public class Destino {
    private String nome;

@Mapper
public interface OrigemDestinoMapper {
    @Mapping(source = "nome", target = "nome", condition = "isAtivo")
    Destino toDestino(Origem origem);
}
```

### Tópicos Adicionais

- **Mapeamento de coleções:** O MapStruct também pode mapear coleções de objetos.
- **Mapeamento personalizado:** Você pode criar métodos de mapeamento personalizados para casos mais complexos.
- **Configurações do MapStruct:** O MapStruct oferece diversas opções de configuração para personalizar o processo de geração de código.


## CycleAvoiding

Classe que previne a ocorrencia de stackoverflow no mapeamento de entidades.

```java
package io.github.lgustavogomdam.backend.model.generic;  
  
import org.mapstruct.BeforeMapping;  
import org.mapstruct.MappingTarget;  
import org.mapstruct.TargetType;  
  
import java.util.IdentityHashMap;  
import java.util.Map;  
  
public class CycleAvoidingMappingContext {  
    private Map<Object, Object> knownInstances = new IdentityHashMap<Object, Object>();  
  
    @BeforeMapping  
    public <T> T getMappedInstance(Object source, @TargetType Class<T> targetType) {  
        return (T) knownInstances.get( source );  
    }  
  
    @BeforeMapping  
    public void storeMappedInstance(Object source, @MappingTarget Object target) {  
        knownInstances.put( source, target );  
    }  
}

```

---

```java
//Seu uso:

@Mapping(target = "deleted", ignore = true)  
public E toEntity(M model, @Context CycleAvoidingMappingContext context);  
@Mapping(target = "deleted", ignore = true)  
@InheritInverseConfiguration  
public M toModel(E entity, @Context CycleAvoidingMappingContext context);  
  
public List<E> toEntityList(List<M> modelList, @Context CycleAvoidingMappingContext context);  
  
public List<M> toModelList(List<E> modelList, @Context CycleAvoidingMappingContext context);
```
### Recursos Adicionais

- **Documentação oficial do MapStruct:** [https://mapstruct.org/](https://mapstruct.org/)
- **Tutorial do MapStruct:** [https://www.tutorialspoint.com/mapstruct/index.htm](https://www.tutorialspoint.com/mapstruct/index.htm)
- **Exemplos do MapStruct:**