
O Docker permite criar e gerenciar redes internas para a comunicação entre containers. Essas redes podem ser configuradas para fornecer isolamento e controle de tráfego entre diferentes containers ou serviços.

## Criando uma Nova Rede

Para criar uma nova rede no Docker, utilizamos o comando `docker network create`. Este comando permite especificar diversas configurações, como o driver de rede, o escopo e opções específicas do driver.
### Exemplo Básico

```bash
docker network create minha_rede
```

Este comando cria uma rede chamada `minha_rede` usando o driver de rede `bridge`, que é o tipo padrão. Redes bridge permitem que containers conectados a ela comuniquem entre si, e com o host.
### Exemplo de Criação de Rede especificando driver

```bash
docker network create --driver bridge minha_rede
```

Este comando cria uma rede chamada `minha_rede` usando o driver de rede `bridge`, que é o tipo padrão. Redes bridge permitem que containers conectados a ela comuniquem entre si, e com o host.

### Opções Avançadas

Você pode também especificar subnets, gateways, e outras configurações de rede:

```bash
docker network create --driver bridge --subnet 192.168.1.0/24 --gateway 192.168.1.1 minha_rede_customizada
```

Isso cria uma rede com uma configuração de rede IP específica, útil para integração com redes existentes ou para especificar o layout de rede em ambientes mais complexos.

## Criando Containers em uma Rede Específica

Para lançar um container em uma rede específica, use a opção `--network` ao executar `docker run`. Isso vincula o container à rede escolhida.

### Exemplo de Criação de Container

```bash
docker run -d --name meu_container --network minha_rede nginx
```

Este comando executa um container chamado `meu_container` na rede `minha_rede` rodando a imagem `nginx`. O container será capaz de comunicar-se com outros containers na mesma rede.
## Considerações Finais

Trabalhar com redes no Docker é fundamental para a construção de aplicações robustas e isoladas. As redes não apenas facilitam a comunicação entre containers, mas também oferecem uma camada adicional de segurança e controle sobre como os serviços dentro de seus containers interagem.