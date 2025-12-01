# Módulo 1 - Introdução ao REST

## O que é HTTP?

HTTP (Hypertext Transfer Protocol) é o protocolo utilizado para a transferência de dados na World Wide Web. É a base para qualquer troca de dados na Internet, estabelecendo as regras para a transmissão de mensagens entre um cliente e um servidor. HTTP funciona como um protocolo de requisição-resposta no modelo cliente-servidor. 

## Quais são os métodos HTTP e para que servem cada um deles?

1. **GET**: Utilizado para solicitar dados de um recurso específico.

2. **POST**: Empregado para enviar dados para serem processados a um recurso específico. Frequentemente usado para enviar formulários.
3. **PUT**: Utilizado para atualizar completamente um recurso existente ou criar um novo se ele não existir.
4. **DELETE**: Empregado para remover um recurso específico.
5. **HEAD**: Semelhante ao GET, mas usado para obter os cabeçalhos de resposta, sem o corpo da resposta.
6. **OPTIONS**: Usado para descrever as opções de comunicação para o recurso de destino.
7. **PATCH**: Utilizado para aplicar atualizações parciais a um recurso.

## O que é Request e Response?

- **Request (Requisição)**: É uma solicitação enviada por um cliente (geralmente um navegador) para um servidor. Uma requisição HTTP contém: um método (como GET, POST), um cabeçalho (que define metadados da requisição), um endereço de recurso (URL) e, opcionalmente, um corpo de dados.

- **Response (Resposta)**: É a resposta do servidor ao cliente após receber e interpretar a requisição. Uma resposta HTTP inclui um status (indicando se a requisição foi bem-sucedida ou não), cabeçalhos (fornecendo informações sobre a resposta) e, frequentemente, um corpo de conteúdo.

## Tópicos Adicionais Relevantes

- **Códigos de Status HTTP**: São códigos de resposta padrão usados para indicar o resultado de uma requisição HTTP. Por exemplo, 200 (OK), 404 (Not Found), 500 (Internal Server Error).
- **URI e URL**: URI (Uniform Resource Identifier) é uma string que identifica um recurso na Internet. URL (Uniform Resource Locator) é um tipo de URI que especifica o local de um recurso na web e como acessá-lo.
- **Representação de Recursos**: Em REST, recursos são representados em formatos como JSON ou XML, permitindo a transferência de dados entre cliente e servidor.
- **Stateless Protocol**: HTTP é um protocolo sem estado, o que significa que cada requisição é independente das demais, e o servidor não mantém o estado da sessão do cliente.

Ao entender esses conceitos básicos, os alunos estarão bem preparados para mergulhar mais fundo no desenvolvimento de APIs RESTful usando Java e Spring Boot.