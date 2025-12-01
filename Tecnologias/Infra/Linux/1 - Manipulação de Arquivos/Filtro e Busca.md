Vamos explorar os comandos do sistema de arquivos do Linux, focando em como filtrar a exibição de arquivos usando `ls` e `find`, complementados por wildcards e pipes. Esses comandos são fundamentais para navegar e gerenciar eficientemente os arquivos no sistema operacional Linux.

### Filtrando a Exibição de Arquivos

#### Comando 'ls' com Wildcards

- **Comando**: `ls`
- **Para que serve**: Lista os arquivos e diretórios no diretório atual ou especificado.
- **Sintaxe de uso**: `ls [opções] [caminho]`
- **Exemplo de uso com wildcards**:

Wildcards são caracteres especiais que representam outros caracteres, permitindo filtrar nomes de arquivos de acordo com padrões especificados.

1. Listar todos os arquivos `.txt`: 
   ```bash
   ls *.txt
   ```
2. Listar arquivos que começam com "a" em qualquer posição:
   ```bash
   ls *a*
   ```
3. Listar arquivos que começam com "a" e terminam com ".txt":
   ```bash
   ls a*.txt
   ```
4. Listar arquivos que começam com "a" ou "b":
   ```bash
   ls [ab]*
   ```
5. Listar arquivos que começam com qualquer letra entre "a" e "c":
   ```bash
   ls [a-c]*
   ```
6. Listar arquivos com exatamente três caracteres de nome:
   ```bash
   ls ???
   ```
7. Listar arquivos que começam com "a" e têm um segundo caractere não sendo "b":
   ```bash
   ls a[!b]*
   ```
8. Listar arquivos que começam com "proj" seguido de qualquer número:
   ```bash
   ls proj[0-9]*
   ```
9. Listar arquivos que terminam com um número seguido de ".txt":
   ```bash
   ls *[0-9].txt
   ```
10. Listar arquivos que começam com um número e têm qualquer coisa entre ".txt":
    ```bash
    ls [0-9]*.txt
    ```

#### Comando 'ls' com Pipes

Pipes (`|`) são usados para passar a saída de um comando como entrada para outro, permitindo combinar múltiplos comandos de maneira poderosa.

Porém, a descrição inicial menciona "ls com 10 pipes", o que parece ser um equívoco, pois `ls` é normalmente combinado com poucos comandos via pipe para filtragem ou manipulação adicional da saída. Em vez de listar 10 usos distintos de pipes com `ls` (o que é pouco prático e fora de contexto), vou mostrar alguns exemplos úteis de como combinar `ls` com outros comandos usando pipes:

1. **Listar arquivos e ordenar por tamanho**:
   ```bash
   ls -l | sort -nk5
   ```
2. **Contar o número de arquivos no diretório atual**:
   ```bash
   ls -1 | wc -l
   ```
3. **Listar apenas diretórios**:
   ```bash
   ls -l | grep "^d"
   ```
4. **Listar arquivos modificados nos últimos 10 dias**:
   ```bash
   ls -lt | head -10
   ```
5. **Listar os 5 maiores arquivos**:
   ```bash
   ls -lS | head -5
   ```
6. **Listar os arquivos com rolagem**:
   ```bash
   ls | more
   ```

#### Comando 'find' com Wildcards

O comando `find` é usado para buscar arquivos e diretórios dentro de uma hierarquia de diretórios baseando-se em critérios especificados. Wildcards com `find` geralmente são usados com a opção `-name` ou `-path`.

- **Comando**: `find`
- **Para que serve**: Buscar arquivos e diretórios baseando-se em critérios específicos.
- **Sintaxe de uso**: `find [caminho] [opção]`
- **Exemplo de uso com wildcards**:

1. Encontrar todos os arquivos `.txt` no diretório atual e subdiretórios:
   ```bash
   find . -name "*.txt"
   ```
2. Encontrar todos os arquivos que começam com "proj":
   ```bash
   find . -name "proj*"
   ```
3. Encontrar diretórios chamados "src":
   ```bash
   find . -type d -name "src