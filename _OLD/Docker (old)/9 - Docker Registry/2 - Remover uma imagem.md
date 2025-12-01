Para remover uma imagem de um Docker Registry, você precisará seguir alguns passos, pois o Docker Registry não oferece uma maneira direta de excluir imagens através de comandos Docker convencionais. A exclusão de imagens envolve a manipulação direta de arquivos no sistema e a reconfiguração do registry. Vou descrever os passos com e sem o uso do Docker Compose.

### Parte 1: Remover Imagem do Docker Registry sem Docker Compose

#### Passo 1: Habilitar a Exclusão de Imagens no Docker Registry

1. **Parar o Container do Registry**:
   ```sh
   docker stop registry
   ```

2. **Remover o Container do Registry**:
   ```sh
   docker rm registry
   ```

3. **Reiniciar o Registry com a Configuração para Exclusão**:
   - Adicione a variável de ambiente `REGISTRY_STORAGE_DELETE_ENABLED` ao iniciar o container:
   ```sh
   docker run -d \
     -p 5000:5000 \
     --name registry \
     -v ~/docker_registry/data:/var/lib/registry \
     -v ~/docker_registry/auth:/auth \
     -e REGISTRY_AUTH=htpasswd \
     -e REGISTRY_AUTH_HTPASSWD_REALM="Registry Realm" \
     -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
     -v ~/docker_registry/certs:/certs \
     -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
     -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
     -e REGISTRY_STORAGE_DELETE_ENABLED=true \
     registry:2
   ```

#### Passo 2: Encontrar o Digest da Imagem

1. **Listar as Tags da Imagem**:
   ```sh
   curl -u <username>:<password> -k https://<hostname>:5000/v2/<repository>/tags/list
   ```

2. **Obter o Digest da Imagem**:
   ```sh
   curl -u <username>:<password> -k -I https://<hostname>:5000/v2/<repository>/manifests/<tag>
   ```

   - O Digest estará no cabeçalho `Docker-Content-Digest`.

#### Passo 3: Excluir a Imagem Usando o Digest

1. **Excluir a Imagem**:
   ```sh
   curl -u <username>:<password> -k -X DELETE https://<hostname>:5000/v2/<repository>/manifests/<digest>
   ```

#### Passo 4: Recompactar o Registro

1. **Executar o Garbage Collection**:
   - Pare o container do Registry:
     ```sh
     docker stop registry
     ```

   - Execute o Garbage Collection:
     ```sh
     docker run --rm -v ~/docker_registry/data:/var/lib/registry registry:2 bin/registry garbage-collect /etc/docker/registry/config.yml
     ```

   - Reinicie o Registry:
     ```sh
     docker start registry
     ```

### Parte 2: Remover Imagem do Docker Registry com Docker Compose

#### Passo 1: Habilitar a Exclusão de Imagens no Docker Registry

1. **Atualizar o `docker-compose.yml`**:
   - Adicione a variável de ambiente `REGISTRY_STORAGE_DELETE_ENABLED` ao serviço do registry:
   ```yaml
   version: '3'

   services:
     registry:
       image: registry:2
       ports:
         - "5000:5000"
       environment:
         REGISTRY_AUTH: htpasswd
         REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
         REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
         REGISTRY_STORAGE_DELETE_ENABLED: "true"
       volumes:
         - ./data:/var/lib/registry
         - ./auth:/auth
         - ./certs:/certs
       restart: always

     caddy:
       image: caddy:2
       ports:
         - "443:443"
       environment:
         - ACME_AGREE=true
         - DOMAIN=<hostname>
         - EMAIL=<email>
       volumes:
         - ./certs:/data/caddy
         - ./certs:/config/caddy
         - ./Caddyfile:/etc/caddy/Caddyfile
       restart: always
   ```

2. **Reiniciar os Serviços**:
   ```sh
   docker-compose down
   docker-compose up -d
   ```

#### Passo 2: Encontrar o Digest da Imagem

1. **Listar as Tags da Imagem**:
   ```sh
   curl -u <username>:<password> -k https://<hostname>:5000/v2/<repository>/tags/list
   ```

2. **Obter o Digest da Imagem**:
   ```sh
   curl -u <username>:<password> -k -I https://<hostname>:5000/v2/<repository>/manifests/<tag>
   ```

   - O Digest estará no cabeçalho `Docker-Content-Digest`.

#### Passo 3: Excluir a Imagem Usando o Digest

1. **Excluir a Imagem**:
   ```sh
   curl -u <username>:<password> -k -X DELETE https://<hostname>:5000/v2/<repository>/manifests/<digest>
   ```

#### Passo 4: Recompactar o Registro

1. **Executar o Garbage Collection**:
   - Pare o container do Registry:
     ```sh
     docker-compose stop registry
     ```

   - Execute o Garbage Collection:
     ```sh
     docker-compose run --rm registry bin/registry garbage-collect /etc/docker/registry/config.yml
     ```

   - Reinicie o Registry:
     ```sh
     docker-compose start registry
     ```

### Conclusão

Esses passos permitem que você remova imagens de um Docker Registry, tanto com quanto sem Docker Compose. A exclusão envolve encontrar o digest da imagem, excluir a imagem usando esse digest e executar o garbage collection para liberar o espaço ocupado pelas imagens deletadas. Se precisar de mais ajuda ou tiver alguma dúvida, estou aqui para ajudar! ✔️