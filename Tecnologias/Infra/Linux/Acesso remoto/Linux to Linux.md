Acesso remoto de um sistema Linux para outro pode ser realizado facilmente através do terminal usando várias ferramentas. A mais comum e amplamente utilizada é o SSH (Secure Shell), que oferece um meio seguro de acessar um computador remotamente pela linha de comando. Aqui está um guia passo a passo sobre como configurar e usar o SSH para acesso remoto entre dois sistemas Linux:

### 1. Instalação do OpenSSH

**No servidor remoto** (o computador que você deseja acessar):

- Abra o terminal.
- Atualize o índice do pacote do seu sistema com o comando:
  ```bash
  sudo apt update
  ```
  (Use `apt` para Debian/Ubuntu, `yum` para CentOS/RHEL, ou `dnf` para Fedora).

- Instale o servidor SSH com o comando:
  ```bash
  sudo apt install openssh-server
  ```
  (Ajuste o comando de instalação conforme sua distribuição).

- Após a instalação, o serviço SSH deve iniciar automaticamente. Para verificar se está rodando:
  ```bash
  sudo systemctl status ssh
  ```

**No cliente** (o computador que você usará para acessar o servidor):

- Certifique-se de que o cliente SSH esteja instalado. Em muitas distribuições Linux, ele já vem instalado por padrão. Caso contrário, instale-o com o comando:
  ```bash
  sudo apt install openssh-client
  ```

### 2. Conectando-se ao Servidor Remoto

- No terminal do seu cliente, digite o seguinte comando:
  ```bash
  ssh usuario@endereco_do_servidor
  ```
  Substitua `usuario` pelo seu nome de usuário no servidor remoto e `endereco_do_servidor` pelo endereço IP ou nome de domínio do servidor.

- Na primeira vez que se conecta a um servidor, será solicitado que confirme a identidade do servidor. Digite `yes` para continuar.

- Insira sua senha quando solicitado.

### 3. Transferência de Arquivos (Opcional)

Além do acesso remoto, o SSH permite a transferência segura de arquivos usando os comandos `scp` ou `sftp`.

- Para copiar um arquivo do cliente para o servidor:
  ```bash
  scp caminho_do_arquivo_local usuario@endereco_do_servidor:caminho_destino_no_servidor
  ```

- Para copiar um arquivo do servidor para o cliente:
  ```bash
  scp usuario@endereco_do_servidor:caminho_do_arquivo_no_servidor caminho_destino_local
  ```

### 4. Usando Chaves SSH para Acesso Sem Senha (Opcional)

Para um acesso mais seguro e sem o uso de senhas, você pode configurar o acesso SSH com chaves públicas e privadas.

- No cliente, gere um par de chaves (pública e privada) com o comando:
  ```bash
  ssh-keygen
  ```

- Em seguida, copie a chave pública para o servidor com o comando:
  ```bash
  ssh-copy-id usuario@endereco_do_servidor
  ```
  Depois disso, você pode acessar o servidor sem precisar digitar a senha (desde que tenha a chave privada correspondente).

Este é um guia básico para começar com o acesso remoto SSH de Linux para Linux. Existem muitas opções e configurações avançadas disponíveis para o SSH, incluindo a alteração de portas, a configuração de chaves SSH para autenticação automática, e o ajuste de configurações para segurança adicional. Recomenda-se consultar a documentação específica do seu sistema e do SSH para obter informações mais detalhadas e opções de configuração.