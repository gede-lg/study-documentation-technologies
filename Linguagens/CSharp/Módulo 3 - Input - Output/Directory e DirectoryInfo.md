### O que é e para que serve?

#### Directory

`Directory` é uma classe estática no namespace `System.IO` que fornece métodos estáticos para criar, mover e enumerar diretórios e subdiretórios. Esta classe é útil para tarefas de manipulação de diretórios que não requerem a instância de um objeto para um diretório específico.

#### DirectoryInfo

`DirectoryInfo`, por outro lado, é uma classe que representa um diretório em um sistema de arquivos. Diferente da classe `Directory`, `DirectoryInfo` requer que você instancie um objeto representando o diretório com o qual deseja trabalhar. Isso permite que você execute várias operações como criar, mover, ou enumerar diretórios e subdiretórios, além de obter informações detalhadas sobre o diretório.

### Como funciona?

- **Directory**: Sendo uma classe estática, você a utiliza chamando seus métodos diretamente, passando o caminho do diretório como argumento. Por exemplo, para criar um diretório, você usaria `Directory.CreateDirectory(path)`.
  
- **DirectoryInfo**: Você primeiro instancia um objeto `DirectoryInfo` com o caminho do diretório e depois chama métodos nesse objeto. Para criar um subdiretório dentro dele, você poderia usar `directoryInfo.CreateSubdirectory(name)`.

### Sintaxe de uso

#### Usando Directory

```csharp
using System.IO;

// Criar um diretório
Directory.CreateDirectory(@"C:\ExemploNovoDiretorio");

// Mover um diretório (e todo o seu conteúdo)
Directory.Move(@"C:\ExemploNovoDiretorio", @"C:\ExemploDiretorioRenomeado");

// Deletar um diretório
Directory.Delete(@"C:\ExemploDiretorioRenomeado", true); // O segundo argumento especifica se subdiretórios e arquivos devem ser deletados também

// Listar subdiretórios
string[] subdiretorios = Directory.GetDirectories(@"C:\Exemplo");
foreach (var dir in subdiretorios)
{
    Console.WriteLine(dir);
}
```

#### Usando DirectoryInfo

```csharp
using System.IO;

// Instanciando um objeto DirectoryInfo
DirectoryInfo dirInfo = new DirectoryInfo(@"C:\ExemploNovoDiretorio");

// Criar um diretório
if (!dirInfo.Exists)
{
    dirInfo.Create();
}

// Criar um subdiretório
dirInfo.CreateSubdirectory("SubDiretorio");

// Mover um diretório (não diretamente suportado por DirectoryInfo, use MoveTo de FileInfo para arquivos individuais ou recrie e copie para o novo local)

// Deletar um diretório
dirInfo.Delete(true); // O argumento especifica se subdiretórios e arquivos devem ser deletados também

// Listar arquivos em um diretório
FileInfo[] arquivos = dirInfo.GetFiles();
foreach (var arquivo in arquivos)
{
    Console.WriteLine(arquivo.Name);
}
```

### Informações e Tópicos Importantes

- **Segurança de Acesso a Arquivos**: Ao manipular diretórios, é crucial considerar as permissões de acesso aos arquivos e diretórios para evitar exceções de segurança.
- **Tratamento de Exceções**: Operações de I/O podem falhar por várias razões (e.g., permissões, caminhos não encontrados, etc.). É recomendado envolver chamadas de I/O em blocos `try-catch` para tratar adequadamente as exceções.
- **Path Class**: A classe `Path` no namespace `System.IO` oferece métodos estáticos para manipulação de strings de caminhos de arquivo, o que pode ser muito útil ao trabalhar com `Directory` e `DirectoryInfo`.

A escolha entre `Directory` e `DirectoryInfo` geralmente depende do contexto de uso e da preferência do desenvolvedor, com `Directory` sendo adequado para operações pontuais e simples e `DirectoryInfo` oferecendo uma abordagem orientada a objetos com mais flexibilidade para manipulações complexas.