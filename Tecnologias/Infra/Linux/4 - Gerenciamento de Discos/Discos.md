### Gerenciamento de Discos no Linux (Ubuntu)

O gerenciamento de discos no Linux pode ser realizado através de diversos comandos que permitem verificar, particionar, formatar e montar unidades de armazenamento. Abaixo estão alguns dos comandos mais utilizados para gerenciar discos no Linux, especialmente no Ubuntu:

---

#### 1. `lsblk`
- **Para que serve:** Lista informações sobre todos os dispositivos de bloco disponíveis no sistema, incluindo discos rígidos, SSDs, pendrives, entre outros.
- **Sintaxe:** `lsblk [opções]`
- **Exemplo de uso:** Para listar todos os dispositivos de bloco com informações detalhadas, use:
  ```bash
  lsblk -o NAME,SIZE,FSTYPE,TYPE,MOUNTPOINT
  ```

---

#### 2. `fdisk`
- **Para que serve:** Ferramenta para manipular a tabela de partições de um disco. É utilizada para criar, deletar e alterar partições.
- **Sintaxe:** `fdisk [opções] <dispositivo>`
- **Exemplo de uso:** Para iniciar a interface de gerenciamento de partições em um disco `/dev/sda`, use:
  ```bash
  sudo fdisk /dev/sda
  ```

---

#### 3. `mkfs`
- **Para que serve:** Utilizado para formatar uma partição com um sistema de arquivos específico, como ext4, NTFS, FAT, entre outros.
- **Sintaxe:** `mkfs -t <tipo_sistema_de_arquivos> <dispositivo>`
- **Exemplo de uso:** Para formatar a partição `/dev/sda1` com o sistema de arquivos ext4, use:
  ```bash
  sudo mkfs -t ext4 /dev/sda1
  ```

---

#### 4. `mount`
- **Para que serve:** Monta um sistema de arquivos em um determinado diretório, tornando-o acessível para o sistema operacional.
- **Sintaxe:** `mount <opções> <dispositivo> <ponto_de_montagem>`
- **Exemplo de uso:** Para montar a partição `/dev/sda1` no diretório `/mnt`, use:
  ```bash
  sudo mount /dev/sda1 /mnt
  ```

---

#### 5. `umount`
- **Para que serve:** Desmonta um sistema de arquivos previamente montado, tornando-o inacessível.
- **Sintaxe:** `umount <ponto_de_montagem>`
- **Exemplo de uso:** Para desmontar o sistema de arquivos montado em `/mnt`, use:
  ```bash
  sudo umount /mnt
  ```

---

#### 6. `df`
- **Para que serve:** Exibe informações sobre o uso do espaço em disco dos sistemas de arquivos montados.
- **Sintaxe:** `df [opções]`
- **Exemplo de uso:** Para exibir o uso do espaço em disco em formato legível por humanos, use:
  ```bash
  df -h
  ```

---

#### 7. `du`
- **Para que serve:** Exibe o uso do espaço em disco de diretórios e arquivos.
- **Sintaxe:** `du [opções] <diretório/arquivo>`
- **Exemplo de uso:** Para exibir o uso do espaço em disco do diretório `/home` e seus subdiretórios, use:
  ```bash
  du -h /home
  ```

---

#### 8. `parted`
- **Para que serve:** Uma ferramenta mais avançada para manipulação de partições, suportando uma variedade maior de sistemas de arquivos e operações.
- **Sintaxe:** `parted <dispositivo> [opções] [comandos]`
- **Exemplo de uso:** Para iniciar a interface interativa do `parted` no disco `/dev/sda`, use:
  ```bash
  sudo parted /dev/sda
  ```

---

#### Observações:
- Lembre-se de substituir `<dispositivo>`, `<ponto_de_montagem>`, `<tipo_sistema_de_arquivos>`, `<diretório/arquivo>` pelos valores correspondentes ao seu sistema.
- Antes de manipular partições ou formatar um disco, certifique-se de ter um backup dos dados importantes, pois essas operações podem resultar na perda de dados.
- Alguns comandos, como `fdisk`, `mkfs`, e `parted`, requerem privilégios de superusuário

 (root), portanto, utilize o comando `sudo` para executá-los.

O gerenciamento de discos no Linux é uma tarefa essencial para administradores de sistemas e usuários avançados. Compreender e utilizar corretamente esses comandos permite otimizar o uso do espaço em disco, organizar os dados de maneira eficiente e garantir a integridade do sistema de arquivos.