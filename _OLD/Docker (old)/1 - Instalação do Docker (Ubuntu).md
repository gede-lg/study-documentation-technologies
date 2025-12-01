## Instalando o Docker no Ubuntu

#### Passo 1: Atualizar Pacotes e Instalar Dependências

1. **Atualizar os Pacotes do Sistema**:
   ```sh
   sudo apt-get update
   sudo apt-get upgrade
   ```

2. **Instalar Pacotes Necessários**:
   ```sh
   sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
   ```

#### Passo 2: Adicionar o Repositório do Docker

1. **Adicionar a Chave GPG do Docker**:
   ```sh
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   ```

2. **Adicionar o Repositório do Docker**:
   ```sh
   sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
   ```

#### Passo 3: Instalar o Docker

1. **Atualizar os Pacotes do Sistema**:
   ```sh
   sudo apt-get update
   ```

2. **Instalar o Docker**:
   ```sh
   sudo apt-get install docker-ce
   ```

#### Passo 4: Configurar o Docker para Iniciar no Boot

1. **Iniciar o Docker**:
   ```sh
   sudo systemctl start docker
   ```

2. **Habilitar o Docker para Iniciar no Boot**:
   ```sh
   sudo systemctl enable docker
   ```

#### Passo 5: Adicionar seu Usuário ao Grupo Docker

1. **Adicionar o Usuário ao Grupo Docker**:
   ```sh
   sudo usermod -aG docker ${USER}
   ```

2. **Reiniciar a Sessão**:
   - Saia e entre novamente para que as alterações tenham efeito.