# mac_address

**Título da Explicação:** Entendendo o atributo `mac_address` no Docker Compose

---

## Introdução

O atributo `mac_address` em uma definição de serviço do Docker Compose permite especificar o endereço MAC que o contêiner usará em sua interface de rede, garantindo controle sobre mapeamentos estáticos de IPs em DHCP ou configurações avançadas de rede. Esse recurso faz parte da [Compose Specification](https://github.com/compose-spec/compose-spec) e está disponível a partir do Compose v2.23.2. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sintaxe-detalhada-e-uso-pr%C3%A1tico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes-Chave Associados](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **Serviço (`service`)**: abstração que define como um conjunto de contêineres idênticos será executado dentro de uma aplicação multi-contêiner. Cada serviço pode declarar configurações de build, volumes, redes, entre outras opções. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md))
- **Endereço MAC**: identificador único de 48 bits atribuído a interfaces de rede. No contexto de contêineres, definir um `mac_address` é útil para mapeamento estático de endereços IP em servidores DHCP ou em redes VLAN/MACVLAN que exigem endereços MAC previsíveis. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))
- **Compose vs. Docker Engine**: embora o Compose permita declarar `mac_address` no nível de serviço, alguns runtimes (ex.: Docker Engine ≥ v25.0) podem rejeitar essa opção, recomendando então o uso de `networks.mac_address`. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [forum.ansible.com](https://forum.ansible.com/t/setting-a-mac-address-in-a-docker-container/7315?utm_source=chatgpt.com))

---

## Sintaxe Detalhada e Uso Prático

1. **Nível de serviço (legado ou quando suportado pelo runtime)**
    
    ```yaml
    version: '3.9'
    services:
      app:
        image: my-app-image
        mac_address: "02:42:ac:11:00:02"
        networks:
          - rede_padrao
    networks:
      rede_padrao:
        driver: bridge
    
    ```
    
    Aqui, `mac_address` é aplicado à interface de rede principal do contêiner, desde que o runtime aceite essa opção. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))
    
2. **Nível de rede (recomendado e obrigatório se o runtime rejeitar o atributo no serviço)**
    
    ```yaml
    version: '3.9'
    services:
      app:
        image: my-app-image
        networks:
          rede_padrao:
            mac_address: "02:42:ac:11:00:02"
    networks:
      rede_padrao:
        driver: bridge
    
    ```
    
    Essa forma garante que o endereço MAC seja atribuído especificamente à conexão do contêiner com a rede `rede_padrao`, sendo a abordagem mais confiável atualmente. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))
    
3. **Formato do valor**
    - Pode ser escrito com dois separadores diferentes:
        - Dois pontos: `00:50:56:aa:bb:cc`
        - Hífens: `00-50-56-aa-bb-cc`
            
            Ambos são aceitos por Compose e Docker Engine. ([stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))
            

---

## Cenários de Restrição ou Não Aplicação

- **`network_mode: host`**: desativa o isolamento de rede de contêiner; não há interfaces virtuais para atribuir MAC, portanto `mac_address` não se aplica. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md))
- **Redes que não suportam endereços MAC estáticos**: alguns drivers (ex.: `overlay` em Swarm) não permitem customização de MAC; o Compose rejeita a opção ou ignora-a em tais casos. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md))
- **Contêineres criados fora do Compose**: se você usar `docker run` diretamente, use a flag `-mac-address`; o Compose não influencia esses contêineres. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))

---

## Componentes-Chave Associados

- **`mac_address` (serviço)**: endereço MAC global do contêiner, aplicado à interface de maior prioridade em múltiplas redes, se suportado pelo runtime. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))
- **`networks.<nome>.mac_address`**: define o MAC por rede específica, evitando ambiguidade em cenários de multiplas redes ou runtimes restritivos. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))
- **`priority`**: ao anexar um serviço a várias redes, determina a ordem de conexão e a rede que recebe o `mac_address` global, quando aplicável. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))
- **`gw_priority`**: seleciona a rede usada como gateway padrão, independente do MAC, útil para topologias complexas. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md))
- **`network_mode`**: quando definido como `host` ou `none`, desativa as redes declaradas em `networks`, tornando `mac_address` ineatualizável. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md))

---

## Melhores Práticas e Padrões de Uso

1. **Prefira `networks.mac_address`** para garantir compatibilidade com Docker Engine recentes e evitar rejeições de runtime. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [forum.ansible.com](https://forum.ansible.com/t/setting-a-mac-address-in-a-docker-container/7315?utm_source=chatgpt.com))
2. **Mantenha unicidade** nos endereços MAC para evitar conflitos de ARP e duplicidade em redes físicas ou VLAN/MACVLAN. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))
3. **Evite bit de multicast** (bit menos significativo do primeiro octeto = 1), pois endereços multicast não podem ser atribuídos a contêineres. ([stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com), [raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md))
4. **Use `priority`** quando o serviço exigir múltiplas redes, definindo nitidamente qual receberá o MAC global, se for o caso. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))

---

## Exemplo Prático Completo

```yaml
version: '3.9'

services:
  web:
    image: nginx:latest
    # Atribuindo MAC no nível de rede
    networks:
      frontend_net:
        mac_address: "02:42:ac:11:00:02"
      backend_net:
        mac_address: "02:42:ac:11:00:03"

  db:
    image: postgres:14
    # Usando prioridade e MAC global (se suportado)
    mac_address: "02:42:ac:11:00:04"
    networks:
      frontend_net:
        priority: 100
      backend_net:
        priority: 200

networks:
  frontend_net:
    driver: bridge
    ipam:
      config:
        - subnet: "172.18.0.0/16"
  backend_net:
    driver: bridge
    ipam:
      config:
        - subnet: "172.19.0.0/16"

```

Nesse exemplo, o serviço `web` recebe MACs definidos para cada rede via `networks.<nome>.mac_address`, enquanto `db` demonstra o uso de `mac_address` global combinado com `priority` para determinar a interface principal. ([raw.githubusercontent.com](https://raw.githubusercontent.com/compose-spec/compose-spec/main/05-services.md), [stackoverflow.com](https://stackoverflow.com/questions/29074693/is-there-a-way-to-set-the-docker-containers-mac-address-in-docker-compose-yml-f?utm_source=chatgpt.com))

---

## Sugestões para Aprofundamento

- Leia a *Compose Specification* completa para entender todas as opções de rede: [https://github.com/compose-spec/compose-spec/blob/main/06-networks.md](https://github.com/compose-spec/compose-spec/blob/main/06-networks.md)
- Explore tutoriais sobre redes *macvlan* e *bridge* no Docker para conhecer limitações e casos de uso avançados.
- Veja exemplos de usos reais em repositórios como o [Awesome Compose](https://github.com/docker/awesome-compose).

---

Com este guia, você possui uma visão completa do atributo `mac_address` em Docker Compose, cobrindo desde conceitos fundamentais até exemplos práticos e boas práticas para ambientes de produção.