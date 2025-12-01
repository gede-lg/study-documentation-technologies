# Dial-stdio

A seguir uma explicação detalhada do comando `docker buildx dial-stdio`, cobrindo sua sintaxe, cada parâmetro/opção, finalidade, tipo de valor e valores padrão. Ao final, há uma tabela resumindo tudo.

---

## 1. Visão Geral

O comando `docker buildx dial-stdio` (parte do plugin Buildx do Docker) tem por objetivo **“encaminhar”** (proxy) os fluxos de entrada e saída padrão (stdin/stdout/stderr) do terminal para uma instância de builder remota ou local. Isso é útil quando você está usando um builder que roda em outro contexto (ex.: container separado, Kubernetes, máquina remota) e deseja enviar comandos interativos ou capturar logs diretamente no seu terminal.

---

## 2. Sintaxe

```bash
docker buildx dial-stdio [OPÇÕES]

```

- **`buildx`**: comando que agrupa funcionalidades avançadas de build (multi-plataforma, drivers alternativos, etc.).
- **`dial-stdio`**: subcomando que faz o proxy de streams.
- **`[OPÇÕES]`**: argumentos que modificam o comportamento do proxy.

---

## 3. Opções

| Opção | Alias | Tipo | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `--builder string` | — | string | `default` | Seleciona qual instância de builder usar. Útil quando você configurou vários builders (ex.: `docker buildx create --name meu-builder`). |
| `-D, --debug` | `-D` | boolean | `false` | Ativa logs de debug detalhados, mostrando informações internas de como o proxy está se conectando e transferindo dados. |
| `--platform string` | — | string | *nenhum* | Indica a plataforma-alvo (ex.: `linux/amd64`, `linux/arm64`). Usado para seleção de nó em builders distribuídos. |
| `--progress string` | — | string | `quiet` | Define o formato de saída de progresso. Valores possíveis: |
|  |  |  |  | • `auto` — detecção automática (TTY vs não-TTY) |
|  |  |  |  | • `plain` — saída em texto simples (útil para CI ou logs) |
|  |  |  |  | • `tty` — saída interativa (barra de progresso em TTY) |
|  |  |  |  | • `rawjson` — objetos JSON cru para cada evento de progresso (útil para parsing) |

> Observação: comandos e flags experimentais ficam ocultos por padrão. Para expô-los, exporte a variável de ambiente:
> 
> 
> ```bash
> export BUILDX_EXPERIMENTAL=1
> 
> ```
> 

---

## 4. Explicação Detalhada das Opções

1. **`-builder string`**
    - **Uso**: `docker buildx dial-stdio --builder meu-builder`
    - **Finalidade**: aponta explicitamente para a instância de builder nomeada `meu-builder` em vez da instância padrão.
    - **Cenário**: quando você tiver criado múltiplos builders com perfis diferentes (por exemplo, um builder para ARM e outro para x86).
2. **`D, --debug`**
    - **Uso**: `docker buildx dial-stdio --debug` ou `docker buildx dial-stdio -D`
    - **Finalidade**: liga o modo debug, imprimindo logs detalhados de conexão, autenticação e transferência de dados entre seu terminal e o builder.
    - **Cenário**: diagnóstico quando o proxy não funciona ou apresenta comportamento inesperado.
3. **`-platform string`**
    - **Uso**: `docker buildx dial-stdio --platform linux/arm64`
    - **Finalidade**: indica ao Buildx qual plataforma você pretende compilar ou testar. Em um cluster de builders heterogêneo, isso ajuda o daemon a selecionar o nó apropriado.
    - **Cenário**: build multi-plataforma, testes cross-compilation, CI que roda em diferentes arquiteturas.
4. **`-progress string`**
    - **Uso**: `docker buildx dial-stdio --progress plain`
    - **Finalidade**: configura como as informações de progresso serão mostradas:
        - **`auto`** — escolhe entre `tty` ou `plain` conforme detecta se seu terminal suporta interatividade.
        - **`plain`** — sempre imprime texto puro (sem barras de progresso dinâmicas), ideal para redirecionar a um arquivo de log.
        - **`tty`** — barra de progresso dinâmica (útil em terminais interativos).
        - **`rawjson`** — emite eventos JSON puros, para parsing automatizado.
    - **Padrão**: `quiet`, ou seja, silêncio (não exibe progresso).

---

## 5. Variáveis de Ambiente Relacionadas

- **`BUILDX_EXPERIMENTAL`**
    - **Descrição**: expõe comandos e flags que estão em fase experimental.
    - **Como usar**:
        
        ```bash
        export BUILDX_EXPERIMENTAL=1
        docker buildx dial-stdio --help
        
        ```
        

---

## 6. Exemplos de Uso

1. **Proxy padrão, silêncio total**
    
    ```bash
    docker buildx dial-stdio
    
    ```
    
2. **Com log de debug e progressão em texto**
    
    ```bash
    BUILDX_EXPERIMENTAL=1 \
      docker buildx dial-stdio \
      --builder meu-builder \
      --debug \
      --progress plain
    
    ```
    
3. **Selecionando plataforma ARM64**
    
    ```bash
    docker buildx dial-stdio --platform linux/arm64
    
    ```
    

---

Com esse guia você tem à mão toda a sintaxe, opções e cenários de uso do `docker buildx dial-stdio`. Qualquer dúvida adicional ou exemplo mais específico, é só falar!