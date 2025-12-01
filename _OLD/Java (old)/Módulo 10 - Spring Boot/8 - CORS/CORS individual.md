# Configurando CORS Individualmente nos Endpoints

No Spring Boot, o CORS pode ser configurado a nível global ou em endpoints específicos. Para configurações individuais, usamos anotações específicas.

### Principais Anotações

1. `@CrossOrigin`
   - **Uso**: Esta anotação é usada em nível de método ou classe para habilitar o CORS.
   - **Propriedades**:
     - `origins`: Especifica os domínios permitidos (por exemplo, `"http://example.com"`).
     - `methods`: Define os métodos HTTP permitidos (por exemplo, `RequestMethod.GET`).
     - `allowedHeaders`: Especifica os cabeçalhos permitidos na requisição.
     - `exposedHeaders`: Cabeçalhos que podem ser expostos pela resposta.
     - `allowCredentials`: Indica se as credenciais são suportadas.

   **Exemplo**:

   ```java
   @CrossOrigin(origins = "http://example.com", methods = RequestMethod.GET)
   @GetMapping("/myEndpoint")
   public String myMethod() {
       // código
   }
   ```

## Observações Adicionais

- **Testando Configurações de CORS**: É importante testar as configurações do CORS para garantir que as políticas de segurança estão corretas.
- **Erro de CORS em Ambientes de Desenvolvimento**: Em ambientes de desenvolvimento, pode ser comum encontrar erros de CORS devido a diferenças de domínio entre o frontend e o backend. É fundamental configurar o CORS adequadamente para evitar esses problemas.
- **Considerações de Segurança**: Embora o CORS seja uma ferramenta de segurança, uma configuração incorreta pode expor a aplicação a vulnerabilidades. Por exemplo, usar `"*"` (que permite qualquer origem) pode ser perigoso em um ambiente de produção.

Com essas informações, você pode configurar eficientemente o CORS em aplicações Spring Boot, garantindo tanto a funcionalidade quanto a segurança da aplicação.