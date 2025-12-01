# Content Negotiation em Java com Spring Boot

## O que é Content Negotiation

Content Negotiation, no contexto de APIs Web, é o processo pelo qual o servidor e o cliente negociam o formato da resposta. Isso é baseado nos cabeçalhos HTTP enviados pelo cliente, como `Accept`, que indicam o tipo de mídia preferido (por exemplo, `application/json`, `application/xml`).

## Para que serve?

Content Negotiation é útil para:

- **Suportar múltiplos formatos**: Permite que uma única API suporte diferentes formatos de resposta, como JSON, XML, etc.
- **Flexibilidade para o cliente**: O cliente pode escolher o formato mais conveniente ou eficiente para suas necessidades.
- **Manutenção de API**: Facilita a evolução da API, permitindo a adição de novos formatos de resposta sem quebrar os clientes existentes.

## Implementação no Spring Boot

No Spring Boot, Content Negotiation pode ser configurado no `WebMvcConfigurer`. Aqui está um exemplo básico:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(true)
            .parameterName("mediaType")
            .defaultContentType(MediaType.APPLICATION_JSON)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}
```

Neste exemplo, o servidor prioriza um parâmetro na URL para determinar o formato. Por exemplo, um cliente pode especificar o formato desejado usando `?mediaType=xml`.

## Conclusão

Content Negotiation é uma funcionalidade poderosa que aumenta a flexibilidade e adaptabilidade das APIs Web. Com o Spring Boot, essa funcionalidade pode ser facilmente configurada e customizada para atender às necessidades específicas de diferentes clientes.