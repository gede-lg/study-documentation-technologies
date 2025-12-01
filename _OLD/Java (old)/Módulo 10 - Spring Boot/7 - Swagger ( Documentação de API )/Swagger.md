# Swagger 3.0 no Spring Boot: Uma Introdução

## Módulo 1: Introdução

### O que é e para que serve o Swagger?

Swagger é um framework de software open-source para projetar, construir e documentar APIs RESTful. Ele usa um formato de especificação conhecido como OpenAPI Specification para descrever a estrutura de uma API, possibilitando documentação interativa, geração de clientes e stubs de servidor.

### História e evolução do Swagger

O Swagger começou como uma especificação e uma coleção de ferramentas para ajudar a documentar e consumir APIs RESTful. A evolução do Swagger está intrinsecamente ligada ao desenvolvimento da OpenAPI Specification (OAS). Com o lançamento do OpenAPI 3.0, houve mudanças significativas na estrutura da especificação, visando aumentar a reutilização e simplificação da descrição da API.

### Swagger vs OpenAPI

A diferença fundamental entre Swagger e OpenAPI reside na terminologia e no escopo. Enquanto "Swagger" refere-se ao conjunto de ferramentas e à especificação original, "OpenAPI" é o nome da especificação após a doação do projeto Swagger para a Linux Foundation. A OpenAPI 3.0 é baseada na especificação Swagger 2.0 original e introduz novos recursos para melhorar a design e documentação da API, como suporte para callbacks, links, e aprimoramentos na definição de exemplos e segurança.

### Principais Características do OpenAPI 3.0

1. **Estrutura Simplificada**: A OpenAPI 3.0 tem uma estrutura mais simplificada que facilita a escrita e navegação de definições da API. Houve uma ampliação no número de componentes reutilizáveis e a introdução de novos recursos como links e callbacks.

2. **Suporte à Negociação de Conteúdo**: A versão 3.0 introduziu mudanças significativas na definição do corpo de uma requisição e resposta, permitindo maior flexibilidade na aceitação de diferentes tipos de mídia.

3. **Definições de Segurança Aprimoradas**: As definições de segurança foram aprimoradas na OpenAPI 3.0, mantendo a consistência com a versão 2.0, mas incluindo mudanças importantes, como a renomeação dos fluxos OAuth 2 e suporte para OpenID Connect Discovery.

4. **Tipos de Parâmetros Atualizados**: Foram removidos os tipos de parâmetros "body" e "formdata", e introduzido o tipo "cookie", além de suporte para arrays e objetos em parâmetros de operação.

5. **Exemplos Aprimorados**: OpenAPI 3.0 reformulou o uso de exemplos dentro da especificação, permitindo descrever múltiplos exemplos, reutilizar exemplos dentro da definição da API e referenciar exemplos externos.

6. **Links do OpenAPI**: Uma nova funcionalidade da OpenAPI 3.0, os links são usados para mostrar a relação entre respostas e operações, descrevendo como valores retornados por uma operação podem ser usados como entrada para outras operações.

7. **Suporte para Descrição de Callbacks**: A versão 3.0 oferece suporte para descrever callbacks, que podem ser usados para definir APIs assíncronas ou Webhooks.

8. **Mudanças Adicionais e Ferramentas de Conversão**: Mudanças adicionais na OpenAPI 3.0 incluem suporte para CommonMark, extensão do suporte ao JSON Schema, definição de múltiplos servidores, e suporte para o método TRACE.

## Conclusão

A transição do Swagger 2.0 para o OpenAPI 3.0 traz uma série de melhorias e novas funcionalidades que facilitam o design, a documentação, e a utilização de APIs RESTful. O Spring Boot, com sua integração ao Swagger através de bibliotecas como `springdoc-openapi-ui`, torna o processo de documentação de APIs mais eficiente e padronizado.

Para mais informações, você pode consultar as fontes de onde essas informações foram retiradas: Java Infinite【22†source】, Swagger.io【23†source】, e Swagger Blog【24†source】.