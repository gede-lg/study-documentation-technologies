### Tutorial: Acesso Remoto com SSH de Windows para Windows (Windows 10 e 11)

SSH não é nativamente suportado como um servidor no Windows, mas a partir do Windows 10 e do Windows Server 2019, a Microsoft adicionou um servidor OpenSSH opcional que pode ser instalado e configurado. Este tutorial irá guiá-lo através das etapas necessárias para configurar o acesso remoto SSH de um computador Windows para outro, tanto no Windows 10 quanto no Windows 11.

### Parte 1: Configuração do Servidor SSH no Windows

#### Passo 1: Instalar o Servidor OpenSSH

1. **Abra as Configurações**:
   - Pressione `Windows + I` para abrir as Configurações.

2. **Vá para 'Aplicativos'**:
   - No Windows 10: Vá para `Aplicativos` > `Recursos opcionais`.
   - No Windows 11: Vá para `Sistema` > `Recursos opcionais` > `Exibir recursos`.

3. **Adicionar um Recurso**:
   - Clique em `Adicionar um recurso` no topo da página.

4. **Instalar 'Servidor OpenSSH'**:
   - Procure por `Servidor OpenSSH` na lista de recursos opcionais.
   - Selecione `Servidor OpenSSH` e clique em `Instalar`.

#### Passo 2: Iniciar e Configurar o Serviço OpenSSH

1. **Abra o PowerShell como Administrador**:
   - Clique com o botão direito do mouse no botão Iniciar e selecione `Windows PowerShell (Admin)`.

2. **Iniciar o Serviço OpenSSH**:
   - Execute o comando:
     ```sh
     Start-Service sshd
     ```

3. **Configurar o Serviço para Iniciar Automaticamente**:
   - Execute o comando:
     ```sh
     Set-Service -Name sshd -StartupType 'Automatic'
     ```

4. **Adicionar a Regra de Firewall para o SSH**:
   - Execute o comando:
     ```sh
     New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
     ```

#### Passo 3: Verificar a Instalação

1. **Verificar o Status do Serviço SSH**:
   - Execute o comando:
     ```sh
     Get-Service -Name sshd
     ```
   - Certifique-se de que o serviço está `Running`.

### Parte 2: Configuração do Cliente SSH no Windows

O cliente SSH vem pré-instalado no Windows 10 e 11. Não é necessário instalar nada adicional.

#### Passo 1: Abrir o Prompt de Comando ou PowerShell

1. **Abra o Prompt de Comando ou PowerShell**:
   - Pressione `Windows + X` e selecione `Windows PowerShell` ou `Prompt de Comando`.

#### Passo 2: Conectar ao Servidor SSH

1. **Conectar ao Servidor SSH**:
   - Use o comando SSH para conectar ao servidor. Substitua `username` pelo nome de usuário no servidor remoto e `hostname` pelo endereço IP ou nome do host do servidor.
     ```sh
     ssh username@hostname
     ```
   - Exemplo:
     ```sh
     ssh john@192.168.1.100
     ```

2. **Aceitar a Chave do Servidor**:
   - Na primeira vez que você se conectar, você será solicitado a aceitar a chave do servidor. Digite `yes` e pressione Enter.

3. **Inserir a Senha**:
   - Insira a senha do usuário e pressione Enter.

### Dicas Adicionais

- **Uso de Chaves SSH**: Para maior segurança, você pode configurar a autenticação por chave SSH.
  - **Gerar um Par de Chaves SSH**:
    ```sh
    ssh-keygen
    ```
  - **Copiar a Chave Pública para o Servidor**:
    ```sh
    ssh-copy-id username@hostname
    ```

- **Configuração Avançada**: Edite o arquivo de configuração SSH (`C:\ProgramData\ssh\sshd_config`) para ajustes avançados, como desabilitar a autenticação por senha ou mudar a porta padrão.

### Solução de Problemas

- **Problemas de Conexão**: Verifique se o serviço SSH está em execução e se a porta 22 está aberta no firewall.
- **Permissões de Usuário**: Certifique-se de que o usuário tem permissão para se conectar via SSH.
- **Configurações de Rede**: Verifique as configurações de rede para garantir que o cliente e o servidor podem se comunicar.

### Conclusão

Seguindo este tutorial, você deverá ser capaz de configurar e utilizar SSH para acesso remoto de um computador Windows para outro. SSH é uma ferramenta poderosa para administração remota segura e pode ser usada para uma variedade de tarefas, desde transferências de arquivos até execução remota de comandos. Se tiver mais perguntas ou encontrar problemas, sinta-se à vontade para pedir ajuda!