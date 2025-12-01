# Port

**Introdução**

O comando `docker compose port` é utilizado para consultar qual porta pública (no *host*) está vinculada a uma porta privada de um serviço definido no Compose. Ele retorna algo como `0.0.0.0:8080` para uma porta privada `80` do serviço, por exemplo ([docs.docker.com](https://docs.docker.com/reference/cli/docker/compose/port/)).

---

## Sintaxe

```bash
docker compose port [OPTIONS] SERVICE PRIVATE_PORT

```

- **SERVICE**: nome do serviço conforme definido em `docker-compose.yml`.
- **PRIVATE_PORT**: porta interna do contêiner que foi exposta (por exemplo `80` ou `5432`). ([docs.docker.com](https://docs.docker.com/reference/cli/docker/compose/port/))

---

## Opções

- `-dry-run`
    
    Executa o comando em modo “ensaio”, simulando a operação sem alterar o estado do *stack*. Útil para ver quais passos o Compose faria antes de realizar qualquer ação ([docs.docker.com](https://docs.docker.com/reference/cli/docker/compose/?utm_source=chatgpt.com)).
    
- `-index int`
    
    Em serviços com múltiplas réplicas (escalados), escolhe o índice do contêiner (começando em 0) para o qual será feita a consulta da porta. Sem esse parâmetro, assume o índice 0 ([docs.docker.com](https://docs.docker.com/reference/cli/docker/compose/port/)).
    
- `-protocol string`
    
    Protocolo de transporte:
    
    - `tcp` (padrão)
    - `udp`
        
        Define se você quer a porta TCP ou UDP correspondente ([docs.docker.com](https://docs.docker.com/reference/cli/docker/compose/port/)).
        

---

## Tabela de Opções

| Opção | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `--dry-run` | *flag* | – | Simula o comando, mostrando o que seria feito sem realmente executar qualquer operação |
| `--index int` | inteiro | 0 | Índice do contêiner (em serviços escalados) para retornar a porta pública correspondente |
| `--protocol str` | string | `tcp` | Protocolo da porta a consultar: `tcp` ou `udp` |

---

## Exemplos de Uso

1. **Consulta básica**
    
    ```bash
    docker compose port web 80
    
    ```
    
    Retorna algo como:
    
    ```
    0.0.0.0:8080
    
    ```
    
    indicando que o serviço `web` está acessível na porta 8080 do host.
    
2. **Escolhendo réplica específica**
    
    ```bash
    docker compose port --index 1 api 3000
    
    ```
    
    Se você tiver `replicas: 2` para o serviço `api`, isso retorna a porta pública do *segundo* contêiner (índice 1).
    
3. **Modo dry-run**
    
    ```bash
    docker compose port --dry-run cache 6379
    
    ```
    
    Mostra o que o Compose faria para consultar a porta sem realmente executar a operação.
    

---

### Observações

- Se não houver mapeamento para a porta privada solicitada, o comando retorna código de erro não-zero.
- Esse comando é estritamente informativo; não altera contêineres, redes ou *stacks*.

Com essa estrutura, você tem definição clara de sintaxe, argumentação, finalidade de cada parâmetro e exemplos práticos de uso!