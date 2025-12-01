# entrypoint

**Manipulando o atributo `entrypoint` em serviços do Docker Compose**

---

**Introdução**

O atributo `entrypoint` em um serviço do Docker Compose especifica o ponto de entrada do container no momento da execução, substituindo o `ENTRYPOINT` definido na imagem Docker base ([docs.docker.com](https://docs.docker.com/reference/compose-file/?utm_source=chatgpt.com)).

Ao sobrescrever o `ENTRYPOINT`, você controla exatamente qual processo será iniciado no container, garantindo consistência no comportamento da aplicação ([stackoverflow.com](https://stackoverflow.com/questions/37366857/how-to-pass-arguments-to-entrypoint-in-docker-compose-yml?utm_source=chatgpt.com)).

---

**Sumário**

1. Conceitos Fundamentais
2. Sintaxe Detalhada e Uso Prático
3. Cenários de Restrição ou Não Aplicação
4. Componentes Chave Associados
5. Melhores Práticas e Padrões de Uso
6. Exemplo Prático Completo
7. Sugestões para Aprofundamento

---

## 1. Conceitos Fundamentais

- **Relação com o Dockerfile:**
    - No Dockerfile, a instrução `ENTRYPOINT` define o executável principal do container. O atributo `entrypoint` do Compose mapeia diretamente para essa instrução ([docs.docker.com](https://docs.docker.com/reference/compose-file/?utm_source=chatgpt.com)).
- **Diferença entre `ENTRYPOINT` e `CMD`:**
    - `ENTRYPOINT` fixa o processo principal do container, enquanto `CMD` fornece argumentos padrão que podem ser sobrescritos ([stackoverflow.com](https://stackoverflow.com/questions/37366857/how-to-pass-arguments-to-entrypoint-in-docker-compose-yml?utm_source=chatgpt.com)).

---

## 2. Sintaxe Detalhada e Uso Prático

O `entrypoint` pode ser declarado em duas formas:

1. **Lista (exec form)**
    - Evita o shell e executa diretamente o binário.
    - Sintaxe YAML:
        
        ```yaml
        entrypoint:
          - "/usr/local/bin/start.sh"
          - "--mode"
          - "production"
        
        ```
        
    - **Vantagem:** Passagem de sinais POSIX e melhor controle de parâmetros ([stackoverflow.com](https://stackoverflow.com/questions/37366857/how-to-pass-arguments-to-entrypoint-in-docker-compose-yml?utm_source=chatgpt.com)).
2. **String (shell form)**
    - Interpreta a linha como um comando via shell (`/bin/sh -c`).
    - Sintaxe YAML:
        
        ```yaml
        entrypoint: "/usr/local/bin/start.sh --mode production"
        
        ```
        
    - **Atenção:** Requer cuidado com escaping de aspas e variáveis de ambiente ([docs.docker.com](https://docs.docker.com/reference/compose-file/?utm_source=chatgpt.com)).

> Nota: Se entrypoint for definido como null, o Compose usará o ENTRYPOINT original da imagem (youtrack.jetbrains.com).
> 

---

## 3. Cenários de Restrição ou Não Aplicação

- **Quando não usar `entrypoint`:**
    - Se você deseja apenas alterar argumentos, sem sobrepor o executável principal, prefira o atributo `command` ([stackoverflow.com](https://stackoverflow.com/questions/37366857/how-to-pass-arguments-to-entrypoint-in-docker-compose-yml?utm_source=chatgpt.com)).
    - Em containers que exigem invocação dinâmica de múltiplos comandos (por exemplo, shells interativos), manter o `ENTRYPOINT` original evita quebra de funcionalidade.

---

## 4. Componentes Chave Associados

- **`command`:** Complementa ou substitui o `CMD` da imagem, sem tocar no entrypoint ([stackoverflow.com](https://stackoverflow.com/questions/37366857/how-to-pass-arguments-to-entrypoint-in-docker-compose-yml?utm_source=chatgpt.com)).
- **`image`:** Define a imagem base, de onde o entrypoint original pode ser herdado.
- **`working_dir`:** Diretório de trabalho antes de executar o entrypoint.
- **`environment`:** Variáveis de ambiente disponíveis para o script ou binário definido no entrypoint.
- **`depends_on`:** Controla ordem de inicialização, mas não altera o comportamento do entrypoint.

---

## 5. Melhores Práticas e Padrões de Uso

- **Prefira sempre o exec form:** Garante que sinais (SIGTERM, SIGINT) sejam corretamente repassados ao processo principal ([stackoverflow.com](https://stackoverflow.com/questions/37366857/how-to-pass-arguments-to-entrypoint-in-docker-compose-yml?utm_source=chatgpt.com)).
- **Parametrize via variáveis de ambiente:** Permite configurações dinâmicas sem alterar o `docker-compose.yml` ([docs.docker.com](https://docs.docker.com/reference/compose-file/?utm_source=chatgpt.com)).
- **Documente no Dockerfile:** Deixe claro, na instrução `ENTRYPOINT`, quais parâmetros essenciais devem ser fornecidos via `command` ou `entrypoint`.

---

## 6. Exemplo Prático Completo

```yaml
version: "3.9"

services:
  web:
    image: minha-app:latest
    build:
      context: .
      dockerfile: Dockerfile
    # Sobrescreve o ENTRYPOINT da imagem em exec form
    entrypoint:
      - "/usr/local/bin/start.sh"
      - "--config"
      - "/etc/app/config.yml"
    # Argumentos adicionais que serão anexados
    command:
      - "--verbose"
    environment:
      - APP_ENV=production
    ports:
      - "8080:80"
    volumes:
      - ./logs:/var/log/app

```

Neste exemplo, o script `start.sh` definido como entrypoint é chamado diretamente, e a flag `--verbose` é passada via `command` ([docs.docker.com](https://docs.docker.com/reference/compose-file/?utm_source=chatgpt.com)).

---

## 7. Sugestões para Aprofundamento

- **Documentação Oficial do Compose File Reference**
- **Dockerfile Reference (instruções ENTRYPOINT vs CMD)**
- **Artigos sobre design de entrypoints e boas práticas**

---

Com isso, você possui um panorama completo do atributo `entrypoint` no Docker Compose, desde conceitos básicos até uso avançado em projetos reais.