### Docker Registry

#### O que é e para que serve?

O **Docker Registry** é um serviço que permite o armazenamento e distribuição de imagens Docker. Ele serve como um repositório onde você pode enviar (push) e baixar (pull) imagens Docker, facilitando a distribuição de software em diferentes ambientes de desenvolvimento, teste e produção.

- **DockerHub** é o registro público e mais amplamente utilizado, hospedado pela Docker Inc. Ele fornece armazenamento gratuito e paga por funcionalidades avançadas, como repositórios privados.
- **Registro Privado**: Pode ser configurado em servidores próprios para armazenar imagens de forma privada, permitindo controle total sobre quem pode acessar e baixar as imagens.

#### Quando utilizar?

- **Colaboração**: Compartilhar imagens Docker entre membros de uma equipe.
- **Integração Contínua/Entrega Contínua (CI/CD)**: Automatizar o processo de build, teste e deploy de aplicações.
- **Controle de Versão de Imagens**: Manter diferentes versões de imagens Docker para diferentes ambientes ou releases de software.
- **Segurança**: Usar repositórios privados para armazenar imagens que não devem ser públicas.

#### Como funciona o uso do Docker Registry e DockerHub?

**DockerHub**:
- É um serviço de registro público que pode ser acessado por qualquer pessoa.
- Oferece repositórios públicos gratuitos e repositórios privados pagos.
- Fornece funcionalidades adicionais, como construção automática de imagens (Automated Builds) e scans de segurança.

**Docker Registry**:
- É uma implementação de registro que pode ser hospedada em qualquer servidor.
- Permite configurar repositórios privados sem custo de hospedagem externa.
- Pode ser configurado para usar TLS e autenticação para segurança.

##### Exemplo de uso do DockerHub

1. **Logar no DockerHub**:
   ```sh
   docker login
   ```

2. **Taguear a Imagem**:
   ```sh
   docker tag minha-aplicacao:latest usuario/minha-aplicacao:latest
   ```

3. **Enviar a Imagem**:
   ```sh
   docker push usuario/minha-aplicacao:latest
   ```

4. **Baixar a Imagem**:
   ```sh
   docker pull usuario/minha-aplicacao:latest
   ```

##### Exemplo de uso de um Docker Registry Privado

1. **Subir um Registro Privado**:
   ```sh
   docker run -d -p 5000:5000 --name registry registry:2
   ```

2. **Taguear a Imagem**:
   ```sh
   docker tag minha-aplicacao:latest localhost:5000/minha-aplicacao:latest
   ```

3. **Enviar a Imagem**:
   ```sh
   docker push localhost:5000/minha-aplicacao:latest
   ```

4. **Baixar a Imagem**:
   ```sh
   docker pull localhost:5000/minha-aplicacao:latest
   ```