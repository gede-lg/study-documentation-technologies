# Hateoas

## O que é e para que serve?
HATEOAS (Hypermedia As The Engine Of Application State) é um princípio utilizado em aplicações RESTful para guiar os clientes através das funcionalidades do serviço web. Ao utilizar HATEOAS, as respostas de um serviço REST incluem links hypermedia (URLs) que indicam as possíveis ações que os clientes podem realizar a seguir. Isso torna a API mais explorável e auto-descritiva, facilitando para os clientes entenderem como navegar e interagir com ela.

O Spring Boot, com Spring HATEOAS, oferece ferramentas para criar esses links hypermedia de forma fácil e padronizada. Isso ajuda a construir APIs REST que aderem ao princípio HATEOAS, tornando-as mais flexíveis e fáceis de usar.

### Exemplo de Código
Suponha que você tenha um controlador REST para gerenciar `Clientes`. Com o Spring HATEOAS, você pode adicionar links aos recursos `Cliente`:

```java
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @GetMapping("/{id}")
    public EntityModel<Cliente> getClienteById(@PathVariable Long id) {
        Cliente cliente = clienteService.findById(id); // Suponha que este serviço recupere o cliente
        EntityModel<Cliente> resource = EntityModel.of(cliente);

        // Adiciona link para 'self' (este recurso)
        WebMvcLinkBuilder linkToSelf = linkTo(methodOn(this.getClass()).getClienteById(id));
        resource.add(linkToSelf.withRel("self"));

        // Adiciona link para a lista de todos os clientes
        WebMvcLinkBuilder linkToAllClientes = linkTo(methodOn(this.getClass()).getAllClientes());
        resource.add(linkToAllClientes.withRel("all-clientes"));

        return resource;
    }

    // ... outros métodos ...
}
```

Neste exemplo, cada `Cliente` retornado pelo método `getClienteById` incluirá links que indicam onde o cliente pode encontrar detalhes sobre o próprio recurso (`self`) e onde listar todos os clientes (`all-clientes`). Isso é feito usando `EntityModel` do Spring HATEOAS e a classe `WebMvcLinkBuilder` para construir os links de forma programática.

#### Importância
- **Descobrimento de API**: Clientes podem entender a API navegando pelos links fornecidos.
- **Manutenção e Evolução**: Mudanças na estrutura da API não afetam os clientes que seguem links, em vez de codificar URLs.
- **Auto-Documentação**: A API se torna mais autoexplicativa.

O uso de HATEOAS com Spring Boot é uma prática poderosa para criar APIs RESTful robustas e fáceis de usar, aderindo aos princípios REST.