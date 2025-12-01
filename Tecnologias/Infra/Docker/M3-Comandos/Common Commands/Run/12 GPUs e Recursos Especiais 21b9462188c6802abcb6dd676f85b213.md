# 12. GPUs e Recursos Especiais

---

Os parâmetros de GPUs permitem disponibilizar aceleradores gráficos ou outros dispositivos especializados ao contêiner, integrando-os via NVIDIA Container Toolkit ou runtimes compatíveis.

---

### 12.1 `-gpus gpu-request`

- **Sintaxe**
    
    ```bash
    # Todas as GPUs disponíveis
    --gpus all
    
    # Número de GPUs (ex.: 2 GPUs quaisquer)
    --gpus 2
    
    # GPUs específicas por índice
    --gpus '"device=0,1"'
    
    # Configuração avançada com count, dispositivos e capabilities
    --gpus '"count=1,device=2,capabilities=compute,utility"'
    
    ```
    
    - Note que, para requisições com sub-parâmetros (device, count, capabilities), deve-se envolver o argumento entre aspas simples e duplas para o shell interpretar corretamente o JSON-like string.
- **Descrição**
    
    Solicita ao Docker que incorpore dispositivos GPU (ou outros aceleradores suportados pelo runtime) dentro do contêiner. Internamente, isso faz com que o daemon adicione um objeto `DeviceRequest` ao `HostConfig`, instruindo o runtime OCI a montar os dispositivos `/dev/nvidia*`, bibliotecas e variáveis de ambiente necessárias.
    
- **Conceito de Uso**
    - **`all`**: monta todas as GPUs visíveis no host.
    - **`<número>`**: aloca qualquer conjunto de N GPUs.
    - **`device=<id1>,<id2>`**: monta GPUs específicas pelos índices (major:minor).
    - **`capabilities=<lista>`**: filtra quais subsistemas GPU serão expostos (ex.: `compute`, `utility`, `video`, `display`).
    - **`count=<n>`**: define mecanismo genérico de requisição de N GPUs (podendo combinar com capabilities, sem fixar IDs).
- **Propriedades Internas**
    - Docker preenche em `HostConfig.DeviceRequests` um array de objetos:
        
        ```json
        {
          "Driver": "nvidia",
          "Count": <int|null>,
          "DeviceIDs": [<string>],
          "Capabilities": [["compute","utility",...]],
          "Options": {}
        }
        
        ```
        
    - O runtime (ex.: `nvidia-container-runtime`) então:
        1. Inspeciona drivers/núcleo e encontra `/dev/nvidia0`, `/dev/nvidiactl`, etc.
        2. Monta esses nós de dispositivo e injeta variáveis como `NVIDIA_VISIBLE_DEVICES` e `LD_LIBRARY_PATH`.
        3. Assegura que bibliotecas CUDA e plugins NVML estejam acessíveis.
- **Exemplos**
    
    ```bash
    # 1) Rodar container com todas as GPUs
    docker run --gpus all nvidia/cuda:11.8-base nvidia-smi
    
    # 2) Usar exatamente 2 GPUs de sua escolha
    docker run --gpus 2 pytorch/pytorch:latest python train.py
    
    # 3) Montar apenas GPU 0 e 2, com capabilities de computação e utilitários
    docker run --gpus '"device=0,2,capabilities=compute,utility"' my-ai-app
    
    # 4) Requisição combinada: qualquer GPU com vídeo e computação
    docker run --gpus '"count=1,capabilities=compute,video"' video-encoder
    
    ```
    

---

## Observações e Boas Práticas

1. **Pré-requisitos no Host**
    - Drivers NVIDIA instalados (mínimo NVIDIA Driver 418.xx ou superior).
    - NVIDIA Container Toolkit (`nvidia-docker2` ou instalação via `nvidia-container-toolkit`) configurado como runtime padrão ou adicional no `daemon.json`:
        
        ```json
        {
          "runtimes": {
            "nvidia": {
              "path": "nvidia-container-runtime",
              "runtimeArgs": []
            }
          }
        }
        
        ```
        
2. **Runtimes e Competibilidade**
    - Se o runtime padrão for diferente, especifique `-runtime=nvidia` (em versões anteriores do Docker).
    - Confirme com `docker info | grep Runtimes` se “nvidia” aparece.
3. **Segurança e Isolamento**
    - GPUs expõem interfaces de baixo nível: mantenha o contêiner atualizado e rode apenas imagens confiáveis.
4. **Orquestração em Cluster**
    - Em Kubernetes, use dispositivos com *device plugin* e defina em `resources.limits`:
        
        ```yaml
        resources:
          limits:
            nvidia.com/gpu: 1
        
        ```
        
5. **Validação**
    - Dentro do contêiner, verifique com `nvidia-smi` ou bibliotecas CUDA (`cudaGetDeviceCount`).
    - Monitore uso de GPU via `nvidia-smi dmon` ou ferramentas de profiling.

Com essa configuração, você tem controle preciso sobre como e quais aceleradores são disponibilizados aos seus contêineres Docker.