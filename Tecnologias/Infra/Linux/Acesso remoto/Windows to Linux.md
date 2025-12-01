Para fazer acesso remoto de um sistema Windows para um sistema Linux utilizando o PuTTY, um popular cliente SSH e telnet para Windows, você pode seguir este tutorial passo a passo. Certifique-se de que o serviço SSH está instalado e ativado no sistema Linux que você deseja acessar remotamente. 

### Passo 1: Instalar o PuTTY

1. **Baixar o PuTTY**: Vá até o site oficial do PuTTY (https://www.putty.org/) e baixe a versão mais recente do software para Windows (putty.exe e puttygen.exe).
2. **Instalar o PuTTY**: Execute o instalador baixado e siga as instruções para instalar o PuTTY no seu sistema Windows.

### Passo 2: Obter o Endereço IP do Sistema Linux

Antes de estabelecer a conexão, você precisa saber o endereço IP da máquina Linux à qual deseja se conectar. Você pode obter isso de várias maneiras, uma delas é executar o comando `ip a` em um terminal no sistema Linux. Anote o endereço IP para uso posterior.

### Passo 3: Configurar o PuTTY e Conectar

1. **Abrir o PuTTY**: Encontre o PuTTY na lista de programas instalados no seu Windows e abra-o.
2. **Configurar a Conexão**:
    - **Host Name (or IP address)**: Digite o endereço IP da máquina Linux que você anotou anteriormente.
    - **Port**: Certifique-se de que a porta 22 (porta padrão para SSH) está selecionada, a menos que o SSH na máquina Linux esteja configurado para usar uma porta diferente.
    - **Connection Type**: Selecione "SSH".
    - **Possivel ERRO:** SSH no linux não estiver instalado. `sudo apt-get install openssh-server`
1. **Nomear e Salvar a Sessão** (opcional): No campo "Saved Sessions", você pode dar um nome à sua sessão e clicar em "Save" para salvar as configurações, facilitando conexões futuras.
2. **Abrir a Conexão**: Clique em "Open" para iniciar a conexão SSH com o sistema Linux.

### Passo 4: Logar no Sistema Linux

Após clicar em "Open", uma janela de terminal será aberta pedindo suas credenciais de login.

1. **Login as**: Digite seu nome de usuário no sistema Linux e pressione Enter.
2. **Senha**: Digite sua senha. Por razões de segurança, a senha não será exibida enquanto você digita. Pressione Enter após digitar sua senha.

Se as informações estiverem corretas, você estará logado no sistema Linux e pronto para começar a trabalhar remotamente através do terminal.

### Dicas Adicionais

- **Segurança**: Considere usar chaves SSH para uma conexão mais segura.
- **Copiar e Colar**: Você pode copiar e colar no PuTTY usando o botão direito do mouse ou as teclas de atalho configuráveis nas opções do PuTTY.
- **Personalização**: O PuTTY permite personalizar várias configurações, como cores, fontes e comportamentos do terminal, através do menu "Window" e "Appearance".

Seguindo estes passos, você deve ser capaz de estabelecer uma conexão SSH do Windows para o Linux usando o PuTTY. Lembre-se de manter seu software atualizado e seguir as melhores práticas de segurança.


Ou fazer isso com `ssh user_aqui@endereco_ip_aqui -p 22` no terminal do windows.


