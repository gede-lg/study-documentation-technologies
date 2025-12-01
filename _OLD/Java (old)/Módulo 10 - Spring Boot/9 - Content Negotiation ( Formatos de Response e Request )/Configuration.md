# Configuração de Content Negotiation

## Importando a Dependência Necessária

Para usar Content Negotiation em um projeto Spring Boot, primeiro, certifique-se de que o Spring Web MVC esteja incluído no seu `pom.xml` ou `build.gradle`, normalmente já incluso no Spring Boot Starter Web.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
</dependency>

<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-yaml</artifactId>
</dependency>
```

## Principais Classes e Métodos para Configuração

1. **`ContentNegotiationConfigurer`**: Esta classe é usada para configurar as opções de negociação de conteúdo no Spring MVC.
   - Métodos:
     - `favorParameter(boolean)`: Para habilitar a negociação de conteúdo usando parâmetros de consulta.
     - `parameterName(String)`: Para definir o nome do parâmetro de consulta usado na negociação de conteúdo.

2. **`WebMvcConfigurer`**: Interface que pode ser implementada para personalizar a configuração padrão do Spring MVC.
   - Método:
     - `configureContentNegotiation(ContentNegotiationConfigurer configurer)`: Sobrescreva esse método para configurar a negociação de conteúdo.

## Implementando Content Negotiation via Query Parameter

Para habilitar a negociação de conteúdo via parâmetro de consulta, você precisa:

1. **Criar uma classe de configuração**:
   - Implementar `WebMvcConfigurer`.
   - Sobrescrever o método `configureContentNegotiation`.

2. **Exemplo de Configuração**:

```java
package br.com.erudio.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import br.com.erudio.serialization.converter.YamlJackson2HttpMesageConverter;

@Configuration
public class WebConfig implements WebMvcConfigurer{

	private static final MediaType MEDIA_TYPE_APPLICATION_YML = MediaType.valueOf("application/x-yaml");
	
	@Override
	public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
		converters.add(new YamlJackson2HttpMesageConverter());
	}

	@Override
	public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
		// https://www.baeldung.com/spring-mvc-content-negotiation-json-xml
		// Via EXTENSION. http://localhost:8080/api/person/v1.xml DEPRECATED on SpringBoot 2.6
		
		// Via QUERY PARAM. http://localhost:8080/api/person/v1?mediaType=xml
		/*
		configurer.favorParameter(true)
			.parameterName("mediaType").ignoreAcceptHeader(true)
			.useRegisteredExtensionsOnly(false)
			.defaultContentType(MediaType.APPLICATION_JSON)
				.mediaType("json", MediaType.APPLICATION_JSON)
				.mediaType("xml", MediaType.APPLICATION_XML);
		*/
		
		// Via HEADER PARAM. http://localhost:8080/api/person/v1
		
		configurer.favorParameter(false)
		.ignoreAcceptHeader(false)
		.useRegisteredExtensionsOnly(false)
		.defaultContentType(MediaType.APPLICATION_JSON)
			.mediaType("json", MediaType.APPLICATION_JSON)
			.mediaType("xml", MediaType.APPLICATION_XML)
			.mediaType("x-yaml", MEDIA_TYPE_APPLICATION_YML)
			;
	}

}


```
   Aqui, a negociação de conteúdo é configurada para usar um parâmetro de consulta chamado `mediaType`. Se o parâmetro `mediaType=json` for fornecido, o tipo de mídia será JSON, e se `mediaType=xml`, será XML.

3. **Usando em um Controller**:
   - Não é necessário nenhuma alteração específica no controller. A negociação de conteúdo determinará automaticamente o formato de resposta com base no parâmetro de consulta.

## Content Negotiation via Header Parameter
A negociação de conteúdo através de um cabeçalho geralmente envolve o cabeçalho `Accept`, onde o cliente especifica o formato desejado (como `application/json` ou `application/xml`). O Spring Boot automaticamente lida com isso se você tiver métodos de controlador que produzem diferentes tipos de mídia.

Exemplo:

```java
@RestController
public class MyController {

    @GetMapping(value = "/example", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getJson() {
        return ResponseEntity.ok("JSON response");
    }

    @GetMapping(value = "/example", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getXml() {
        return ResponseEntity.ok("<response>XML response</response>");
    }
}
```

Neste exemplo, o Spring Boot escolherá o método apropriado com base no cabeçalho `Accept` da solicitação.


## Serialização com yaml

```java
package br.com.erudio.serialization.converter;

import org.springframework.http.MediaType;
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;

public class YamlJackson2HttpMesageConverter extends AbstractJackson2HttpMessageConverter{

	public YamlJackson2HttpMesageConverter() {
		super(
			new YAMLMapper()
				.setSerializationInclusion(
					JsonInclude.Include.NON_NULL),
					MediaType.parseMediaType("application/x-yaml")
				);
	}

}

```
## Criando a classe MediaType

```java
package br.com.erudio.util;

public class MediaType {
	
	public static final String APPLICATION_JSON = "application/json";
	public static final String APPLICATION_XML = "application/xml";
	public static final String APPLICATION_YML = "application/x-yaml";
}

```
### Usando no controller
```java
@GetMapping(produces = { MediaType.APPLICATION_JSON,
			MediaType.APPLICATION_XML,
			MediaType.APPLICATION_YML 
			})
	public List<PersonVO> findAll() {
		return service.findAll();
	}
```
### Informações Adicionais
- **Personalização Avançada**: Para casos mais complexos, você pode criar seus próprios `HttpMessageConverter`s.
- **Tratamento de Erros**: Considere o tratamento de casos em que o formato pedido não está disponível.

A content negotiation é uma parte fundamental de APIs RESTful modernas, garantindo que diferentes formatos de conteúdo possam ser servidos de acordo com as necessidades do cliente.

