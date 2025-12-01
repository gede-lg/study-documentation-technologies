# Modulo 1 - Introdução ao REST

## O que é REST?

REST, ou Representational State Transfer, é um estilo arquitetural para o desenvolvimento de serviços web. Foi introduzido por Roy Fielding em sua dissertação de doutorado em 2000 e rapidamente se tornou um padrão popular para APIs na web devido à sua simplicidade e escalabilidade.

REST é baseado em um conjunto de princípios de arquitetura. Aqui estão os principais:

1. **Cliente-Servidor**: Esta separação de preocupações significa que, por exemplo, a interface do usuário está desacoplada do armazenamento de dados, o que melhora a portabilidade da interface do usuário em várias plataformas.

2. **Stateless**: Cada requisição do cliente deve conter todas as informações necessárias para o servidor compreender e processar a requisição. Ou seja, o servidor não armazena nenhum estado do cliente entre as requisições.

3. **Cacheable**: As respostas devem, implícita

ou explicitamente, definir a si mesmas como cacheáveis ou não. Se uma resposta é cacheável, o cliente tem o direito de reutilizar esses dados para respostas posteriores e idênticas, melhorando a eficiência.

4. **Interface Uniforme**: Simplifica e desacopla a arquitetura, o que facilita a compreensão de cada parte do sistema. Isso geralmente é implementado usando URIs padronizadas, HTTP para todas as operações e a transferência de recursos representativos.

5. **Sistema em camadas**: As interações do cliente podem ser intermediadas por várias camadas de servidores intermediários para melhorar a escalabilidade e a segurança.

6. **Código sob demanda (opcional)**: Extende a funcionalidade do cliente transferindo código executável, por exemplo, applets ou scripts.

## Níveis do REST

Leonard Richardson propôs um modelo que define os níveis de conformidade com o estilo REST. Esses níveis são frequentemente usados para classificar APIs RESTful:

1. **Nível 0 (O Pântano da POX)**: Uma única URI e uma única técnica de codificação, geralmente XML.

2. **Nível 1 (Recursos)**: Recursos individuais são identificados usando URIs distintas.

3. **Nível 2 (HTTP Verbs)**: Recursos são manipulados usando métodos HTTP padrão (GET, POST, PUT, DELETE, etc.).

4. **Nível 3 (HATEOAS - Hypermedia As The Engine Of Application State)**: O cliente interage com a aplicação inteiramente através de hiperlinks fornecidos dinamicamente contidos nas representações dos recursos.

## Tópicos Adicionais Relevantes

- **Diferenças entre SOAP e REST**: Comparar REST com outras abordagens de serviços web, como SOAP, pode ser útil para entender suas vantagens e desvantagens.

- **Formatos de Mensagem REST**: Embora JSON seja o formato mais popular, é importante compreender outros formatos como XML e YAML.

- **Segurança em REST**: Técnicas para proteger uma API REST, como autenticação e autorização, são essenciais no design de uma API segura.

- **Melhores Práticas REST**: Incluir um segmento sobre convenções de nomenclatura, versionamento de API, tratamento de erros e documentação.

Este módulo inicial oferece a base necessária para os participantes do curso compreenderem os conceitos fundamentais do REST, preparando-os para módulos mais avançados sobre implementação com Java e Spring Boot.