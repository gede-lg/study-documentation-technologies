# Tipos de Redes

---

## 1. Introdução

A evolução da virtualização de aplicativos trouxe uma necessidade crescente de redes flexíveis, isoladas e programáveis. No modelo tradicional, máquinas virtuais encapsulam pilhas de rede completas, mas apresentam sobrecarga significativa. O Docker, ao adotar contêineres leves, traz um novo paradigma de **network virtualization**, onde cada instância recebe apenas o suficiente para comunicar-se com outros contêineres ou com o exterior, sem carregar todo um SO convidado.

Compreender os fundamentos, arquiteturas e drivers de rede do Docker é crucial para:

- Garantir **segurança** e segmentação de tráfego.
- Otimizar **performance** e latência.
- Facilitar a **escalabilidade** horizontal em clusters distribuídos.
- Simplificar o **gerenciamento** e a **orquestração** de serviços.

---

## 2. Sumário

1. Conceitos Fundamentais
    - Network Namespace
    - CNM vs CNI
    - veth Pair, Bridge e NAT
    - IPAM (IP Address Management)
2. Componentes e Arquitetura Teórica
    - docker-daemon e libnetwork
    - Drivers de Rede Internos
    - Endpoint, Sandbox e Network Stack
    - Control Plane × Data Plane
3. Drivers de Rede no Docker
    - bridge
    - host
    - overlay
    - macvlan / ipvlan
    - none
    - Plugins de Terceiros (Weave, Calico, Cilium)
4. Cenários de Aplicação e Limitações
5. Melhores Práticas e Padrões de Uso
6. Sugestões para Aprofundamento

---

## 3. Conceitos Fundamentais

### 3.1 Network Namespace

- **Isolamento de recursos**: cada namespace mantém sua própria tabela de roteamento, interfaces de rede e regras de firewall.
- **Espaços separados**: garantindo que pacotes de um contêiner não interfiram diretamente no host ou em outros contêineres sem passagem por drivers e pontes virtuais.

### 3.2 CNM (Container Network Model) vs CNI (Container Network Interface)

- **CNM**: modelo original do Docker, implementado pela libnetwork, define abstrações como Network, Endpoint e Sandbox.
- **CNI**: padrão adotado por projetos como Kubernetes; foca em simplicidade de “plugins” que recebem instruções e configuram interfaces dentro do namespace.

### 3.3 veth Pair, Bridge Virtual e NAT

- **veth pair**: par de interfaces virtuais conectadas em “túnel” – uma ponta no namespace do contêiner, outra no host.
- **Bridge**: switch L2 virtual (geralmente `docker0`) conecta múltiplos veths, permitindo comunicação intra-host.
- **NAT/masquerade**: implementado por iptables; contêineres em bridge usam NAT para acessar externamente com IP do host.

### 3.4 IPAM (IP Address Management)

- **Gerenciamento de sub-redes e alocação de IPs**: evita colisão de faixas CIDR.
- **Drivers IPAM**: internos (padrão), ou externos (etcd, Consul) em setups avançados.

---

## 4. Componentes e Arquitetura Teórica

| Camada | Componente | Função Principal |
| --- | --- | --- |
| **CLI/API** | Docker Engine CLI/API | Interface para o usuário criar/gerenciar redes |
| **Control Plane** | docker-daemon | Coordena criação, atualização e remoção de redes |
|  | Orchestrator (Swarm/Kubernetes) | Propaga estado de rede em múltiplos hosts |
| **Libnetwork** | CNM Controller | Abstrai drivers, gerencia Network, Endpoint, Sandbox |
| **Drivers** | Built-in (bridge, host, overlay…) | Implementam diferentes topologias e lógicas de forwarding |
| **Data Plane** | Kernel Linux (namespaces, iptables, vxlan) | Executa roteamento, NAT, encapsulamento de pacotes |
| **Key/Value Store** | etcd, Consul, ZooKeeper | (Overlay) Armazena topologia e mapeamentos distribuídos |

**Fluxo Simplificado de Criação de Rede**:

1. CLI solicita rede → docker-daemon invoca libnetwork.
2. Libnetwork registra Network no K/V store (se distribuído).
3. Ao criar um contêiner: libnetwork cria Endpoint e Sandbox, aloca IP via IPAM.
4. Par veth é inserido na bridge ou túnel overlay; sandbox configura interface e rotas.

---

## 5. Drivers de Rede no Docker

### 5.1 bridge

- **Como funciona**:
    - Cria a ponte (`docker0`) no host.
    - Contêineres conectados trocam pacotes sem sair ao NIC físico.
- **Características**:
    - Uso de NAT para tráfego de saída.
    - IPs internos típicos: `172.17.0.0/16` (configurável).
- **Quando usar**:
    - Desenvolvimento local, ambientes mono-host, testes rápidos.

### 5.2 host

- **Como funciona**:
    - Desabilita namespace de rede: contêiner “vê” interfaces do host.
- **Características**:
    - Latência mínima, throughput máximo.
    - Risco elevado de conflitos de porta/IP.
- **Quando usar**:
    - Serviços que exigem performance de rede nativa (e.g. sistemas de streaming, VPN em contêiner).

### 5.3 overlay

- **Como funciona**:
    - Cria rede L2/L3 virtual entre múltiplos hosts via encapsulamento VXLAN (ou Geneve).
    - Cada host roda agentes que mantêm túneis ponto-a-ponto.
- **Características**:
    - Comunicação cross-host sem expor IPs diretamente.
    - Suporta políticas de segmentação e criptografia (via plugins adicionais).
- **Quando usar**:
    - Ambientes de produção distribuídos, Swarm, Kubernetes (via CNI-bridge).

### 5.4 macvlan / ipvlan

- **Como funciona**:
    - Atribui ao contêiner um MAC/IP “físico” diretamente na rede do host.
    - Modo bridge, VEPA, 802.1Q trunk (para VLANs).
- **Características**:
    - Mais próximo de uma VM em termos de visibilidade na LAN.
    - Permite DHCP externo.
- **Limitações**:
    - Roteamento entre sub-redes requer configuração externa.

### 5.5 none

- Cria namespace vazio; sem interfaces além do `lo`.
- Indicada para uso de redes customizadas totalmente definidas por plugins externos.

### 5.6 Plugins de Terceiros

- **Weave Net**: criptografa tráfego overlay, simplifica discovery.
- **Calico / Cilium**: roteamento baseado em BGP, políticas de rede avançadas (L3/L4).
- **Multus (K8s)**: múltiplas interfaces dentro de pods, usando CNI.

---

## 6. Cenários de Aplicação e Limitações

| Driver | Cenários Ideais | Pontos de Atenção |
| --- | --- | --- |
| **bridge** | Dev/QA mono-host; protótipos; integração simples de microsserviços | Escala limitada; NAT introduce latência adicional |
| **host** | Alta performance; serviços de baixa latência | Total ausência de isolamento; impacto direto no host |
| **overlay** | Clusters distribuídos; deploy contínuo em Swarm/K8s | Requer KV com HA; overhead de encapsulamento; MTU tuning |
| **macvlan** | Integração com VLANs corporativas; requisitos de DHCP | Complexidade de roteamento; limitação em comunicação inter­subnet |
| **none** | Testes sem rede; validadores de segurança interno | Contêiner sem comunicação (exceto via volumes ou exec) |
| **plugins** | Políticas avançadas; criptografia; alta disponibilidade | Aprendizado de novas APIs; overhead de componentes extras |

---

## 7. Melhores Práticas e Padrões de Uso

1. **Planejamento de CIDR**
    - Defina faixas distintas por ambiente (dev, QA, prod).
    - Evite sobreposição com redes físicas e VPNs.
2. **Segurança e Políticas de Rede**
    - Use plugins como Calico/Cilium para políticas L3–L7.
    - Habilite criptografia no overlay sempre que possível.
3. **Monitoramento e Observabilidade**
    - Instrumente métricas de throughput, latência e erros de conexão.
    - Centralize logs de firewall (iptables/nftables) e encapsulamento.
4. **Tuning de Performance**
    - Ajuste MTU para VXLAN (p.ex. 1450 bytes) para evitar fragments.
    - Em cenários de alta I/O, avalie host network ou macvlan.
5. **Alta Disponibilidade**
    - Para overlay, configure KV stores em modo cluster (etcd/Consul com quorum).
    - Distribua managers Swarm ou control planes Kubernetes em múltiplos nós.
6. **Desenvolvimento e Automação**
    - Mantenha `docker-compose.yml` e stacks definidos como código.
    - Automatize testes de conectividade entre contêineres em pipelines CI/CD.

---

## 8. Sugestões para Aprofundamento

- **Especificações e Documentação Oficiais**
    - Docker Networking: [https://docs.docker.com/network/](https://docs.docker.com/network/)
    - CNM Design: [https://github.com/docker/libnetwork/blob/master/docs/design.md](https://github.com/docker/libnetwork/blob/master/docs/design.md)
    - CNI Spec: [https://github.com/containernetworking/cni](https://github.com/containernetworking/cni)
- **Livros e Whitepapers**
    - *Docker Deep Dive* (Nigel Poulton) – Capítulos sobre rede.
    - *The Linux Programming Interface* – Network Namespaces e Virtualização de Rede.
- **Artigos e Blogs**
    - “Understanding Docker Networking” (DigitalOcean Community).
    - “VXLAN Demystified” – explica túnel overlay e tunelamento L2 sobre L3.
- **Termos de Pesquisa Complementares**
    - “Linux Network Namespaces vs Docker Namespaces”
    - “Container Network Security Best Practices”
    - “Service Mesh vs Container Network Plugins”

---

> Próximos Passos:
> 
> 
> Se desejar todo este conteúdo estruturado num arquivo Markdown para consulta offline ou compartilhamento, me avise que gerarei o arquivo e disponibilizarei para download.
>