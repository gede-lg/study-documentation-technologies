
Para usar o wsl tem que:

1. Trocar o hypervisorlaunchtype para auto com o comando `bcdedit /set hypervisorlaunchtype auto` e reiniciar o sistema (WSL só funciona com ele no AUTO e o VirtualBox no OFF, ou usa um ou outro).
2. Acessar `Painel de controle/Programas/Ativar ou Desativar recursos do windows` e em seguida marcar como ativo as opções (e em seguida reiniciar o computador):

	- Plataforma de Máquina Virtual
	- Plataforma do Hipervisor do Windows
	- Subsistema de Windows para Linux

3. Acessar o endereço `https://aka.ms/wsl2kernel` e realizar o download do - [Pacote de atualização do kernel do Linux do WSL2 para computadores x64](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi) e executá-lo, em seguida deve-se reiniciar o computador.

Feito isso pode-se instalar os SO's como apps via Microsoft Store ou por linha de comando no PowerShell.

## Listar distribuições WSL instaladas:

**1. Comando `wsl -l`:**

```
wsl -l
```

Este comando lista todas as distribuições WSL instaladas no seu sistema.

**2. Comando `wsl --list` (opção mais detalhada):**

```
wsl --list 
```

Este comando exibe informações mais detalhadas sobre as distribuições WSL instaladas, como nome, versão, estado (em execução ou parada) e ID do usuário padrão.

**3. Comando `wsl --list --online` (opção mais detalhada):**

```
wsl --list --online
```

Este comando exibe informações mais detalhadas sobre as distribuições WSL disponiveis para serem instaladas na loja.

## Instalar uma distro específica do Linux:

**1. Comando `wsl --install`:**

```
wsl --install -d <NomeDaDistro>
```

Este comando instala a distribuição Linux especificada pelo nome `<NomeDaDistro>`. Por exemplo, para instalar o Ubuntu, use o seguinte comando:

```
wsl --install -d Ubuntu
```

**2. Loja da Microsoft (opção alternativa):**

- Abra a Loja da Microsoft e procure pela distribuição Linux que você deseja instalar.
- Clique no botão "Obter" para iniciar a instalação.

## Desinstalar uma distro específica do Linux:

**1. Comando `wsl --unregister`:**

```
wsl --unregister <NomeDaDistro>
```

Este comando desinstala a distribuição Linux especificada pelo nome `<NomeDaDistro>`. **Cuidado:** esta ação remove todos os dados da distribuição, incluindo arquivos, configurações e aplicativos.

**2. Configurações do Windows (opção alternativa):**

- Abra o menu Iniciar e procure por "Configurações".
- Acesse "Aplicativos" > "Aplicativos e recursos".
- Procure pela distribuição Linux que você deseja desinstalar e clique em "Desinstalar".

**Observações:**

- Certifique-se de ter direitos administrativos para instalar ou desinstalar distribuições WSL.
- A lista de distribuições disponíveis para instalação pode variar de acordo com sua região e configurações do sistema.
- Consulte a documentação da Microsoft para obter mais informações sobre o WSL: [https://docs.microsoft.com/pt-br/windows/wsl/install-win10](https://docs.microsoft.com/pt-br/windows/wsl/install-win10).

**Dicas:**

- Use o comando `wsl --help` para obter mais informações sobre o comando `wsl`.
- Use o comando `man wsl` para visualizar a página de manual do comando `wsl`.
- Pesquise online por tutoriais e guias específicos para a distribuição Linux que você deseja instalar ou desinstalar.

## Definir uma distro como padrão do WSL

Existem duas maneiras de definir uma distro como padrão do WSL:

**1. Usando o comando `wsl --set-default`:**

```
wsl --set-default <NomeDaDistro>
```

Este comando define a distro especificada pelo nome `<NomeDaDistro>` como a distro padrão do WSL. Isso significa que quando você executar o comando `wsl` sem especificar um nome de distro, essa distro será iniciada automaticamente.

**2. Usando o menu Iniciar:**

- Abra o menu Iniciar e procure por "WSL".
- Clique com o botão direito do mouse na distro que você deseja definir como padrão e selecione "Definir como padrão".

**Observações:**

- Você só pode definir como padrão distros que já estão instaladas no seu sistema.
- A distro padrão do WSL é usada para executar comandos WSL no prompt de comando e no PowerShell.
- Se você definir uma distro como padrão e depois desinstalá-la, a próxima distro na lista de distros instaladas será definida como padrão automaticamente.

## Desinstalar todas as distros do WSL em seu Windows

**Opção 1: Comando `wsl --unregister`:**

1. Abra o **Prompt de Comando** como administrador.
2. Execute o seguinte comando:

```
wsl --unregister <NomeDaDistro1> <NomeDaDistro2> ...
```

Substitua `<NomeDaDistro1>` e `<NomeDaDistro2>` pelos nomes das distros que você deseja desinstalar. Repita o comando para cada distro.

**Opção 2: Configurações do Windows:**

1. Abra o menu Iniciar e procure por **Configurações**.
2. Acesse **Aplicativos** > **Aplicativos e recursos**.
3. Na lista de aplicativos, procure por **Distro do WSL**.
4. Clique em **Distro do WSL** e selecione a distro que você deseja desinstalar.
5. Clique em **Desinstalar**.
6. Repita os passos 4 e 5 para cada distro que você deseja desinstalar.

**Observações:**

- Ao desinstalar uma distro, todos os seus dados, incluindo arquivos, configurações e aplicativos, serão excluídos.
- Certifique-se de ter feito backup de seus dados importantes antes de desinstalar qualquer distro.
- Se você desinstalar todas as distros do WSL, o subsistema WSL será removido do seu sistema.

**Dicas:**

- Use o comando `wsl -l` para verificar a lista de distros instaladas no seu sistema.
- Use o comando `wsl --help` para obter mais informações sobre o comando `wsl`.
- Consulte a documentação da Microsoft para obter mais informações sobre o WSL: [https://docs.microsoft.com/pt-br/windows/wsl/install-win10](https://docs.microsoft.com/pt-br/windows/wsl/install-win10).

**Opção 3: Script PowerShell:**

**1. Criar script:**

Crie um arquivo `.ps1` com o seguinte código:

PowerShell

```
# Lista todas as distros WSL
$distros = Get-WslDistribution

# Desinstala cada distro
foreach ($distro in $distros) {
    Remove-WslDistribution -Name $distro.Name
}
```

**2. Executar script:**

- Abra o **PowerShell** como administrador.
- Navegue até a pasta onde o script está salvo.
- Execute o seguinte comando:

```
.\script.ps1
```

**Opção 4: Ferramenta WSLCleanup:**

- Baixe e instale a ferramenta WSLCleanup: [URL inválido removido]
- Execute a ferramenta WSLCleanup como administrador.
- Siga as instruções na tela para desinstalar todas as distros do WSL.

**Importante:**

- Use esta opção com cuidado, pois ela pode remover todos os seus dados do WSL.
- Faça backup de seus dados importantes antes de usar esta ferramenta.

**Recursos adicionais:**

- Como desinstalar o WSL do Windows 10: [URL inválido removido]
- Como remover o WSL do Windows 11: [URL inválido removido]


---

### Parte 1: Instalando o WSL 2 no Windows

#### Passo 1: Habilitar o WSL

1. **Abrir o PowerShell como Administrador**:
   - Clique com o botão direito no botão Iniciar e selecione "Windows PowerShell (Admin)".

2. **Executar o Comando para Habilitar o WSL**:
   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   ```

#### Passo 2: Habilitar a Máquina Virtual

1. **Ainda no PowerShell, execute o comando para habilitar a máquina virtual**:
   ```powershell
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

#### Passo 3: Atualizar para o WSL 2

1. **Baixar o Pacote de Atualização do Kernel do WSL 2**:
   - Vá para [este link](https://aka.ms/wsl2kernel) e baixe o pacote.

2. **Instalar o Pacote de Atualização**:
   - Execute o arquivo baixado e siga as instruções de instalação.

#### Passo 4: Definir o WSL 2 como Padrão

1. **Executar o Comando no PowerShell**:
   ```powershell
   wsl --set-default-version 2
   ```

#### Passo 5: Instalar uma Distribuição Linux

1. **Abrir a Microsoft Store e Pesquisar por "Linux"**.
   - Selecione a distribuição de sua preferência (ex: Ubuntu) e clique em "Obter" para instalar.

2. **Iniciar a Distribuição e Configurar o Usuário**.
   - Após a instalação, abra a distribuição e siga as instruções para configurar o usuário e senha.

### Parte 2: Instalar Outros Sistemas Operacionais no WSL 2

#### Passo 1: Baixar Distribuições Adicionais

1. **Baixar a Distribuição Linux Desejada**:
   - Acesse a página de lançamentos do [WSL-DistroLauncher](https://github.com/microsoft/WSL-DistroLauncher) e baixe a distribuição desejada.

2. **Instalar a Distribuição**:
   - Siga as instruções fornecidas na página da distribuição para instalá-la no WSL 2.



### Parte 4: Instalar o Docker Desktop no Windows

#### Passo 1: Baixar o Docker Desktop

1. **Acessar o Site do Docker**:
   - Vá para [o site do Docker](https://www.docker.com/products/docker-desktop) e baixe o Docker Desktop para Windows.

#### Passo 2: Instalar o Docker Desktop

1. **Executar o Instalador Baixado**:
   - Siga as instruções na tela para instalar o Docker Desktop.

2. **Configurar o WSL 2**:
   - Durante a instalação, certifique-se de habilitar a opção para usar o WSL 2 como backend.

#### Passo 3: Configurar o Docker Desktop

1. **Abrir o Docker Desktop**:
   - Após a instalação, abra o Docker Desktop.

2. **Configurar Integração com WSL 2**:
   - Vá para "Settings" > "Resources" > "WSL Integration" e habilite a distribuição desejada para usar com o Docker Desktop.

### Conclusão

Seguindo esses passos, você terá o WSL 2 configurado com várias distribuições Linux, o Docker instalado no Ubuntu e o Docker Desktop configurado no Windows. Se precisar de mais alguma ajuda ou tiver alguma dúvida, estou aqui para ajudar! 💡🔨🤖🔧