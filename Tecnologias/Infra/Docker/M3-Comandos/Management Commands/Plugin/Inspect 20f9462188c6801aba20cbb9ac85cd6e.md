# Inspect

## Visão Geral

O comando `docker plugin inspect` exibe detalhes completos sobre um ou mais plugins instalados no host, mostrando metadados, configurações, permissões e o estado de cada plugin. É a forma principal de verificar internamente como cada plugin está definido e habilitado ou não.

---

## Sintaxe

```bash
docker plugin inspect [OPÇÕES] PLUGIN [PLUGIN...]

```

- **PLUGIN**: nome (e opcionalmente tag) do plugin a inspecionar. Você pode passar vários plugins de uma só vez.

---

## Opções

| Opção | Descrição |
| --- | --- |
| `-f, --format string` | Formata a saída usando um template Go:• `json`: imprime JSON puro (padrão).• `TEMPLATE`: aplica um Go template.Veja mais em [https://docs.docker.com/go/formatting/](https://docs.docker.com/go/formatting/). |

---

## Exemplos de Uso

1. **Inspecionar um plugin**
    
    ```bash
    docker plugin inspect traefik:latest
    
    ```
    
    Exibe um objeto JSON com todos os campos de configuração do plugin `traefik:latest`.
    
2. **Inspecionar múltiplos plugins**
    
    ```bash
    docker plugin inspect meussh/volume-plugin:latest grafana/grafana-plugin:1.2.3
    
    ```
    
    Retorna um array JSON, um objeto para cada plugin informado.
    
3. **Obter saída formatada em tabela**
    
    ```bash
    docker plugin inspect --format "table {{.Name}}\t{{.Enabled}}\t{{.Settings.Rootfs.Type}}"
    
    ```
    
    Mostra colunas com nome do plugin, se está habilitado e tipo de rootfs.
    
4. **Extrair apenas o estado Enabled**
    
    ```bash
    docker plugin inspect --format '{{.Enabled}}' meussh/volume-plugin:latest
    
    ```
    
    Imprime `true` ou `false`, útil em scripts de automação.
    

---

> Dica:
> 
> 
> Combine `docker plugin inspect` com `docker plugin ls` para primeiro listar quais plugins estão instalados e depois inspecionar apenas aqueles de seu interesse.
>