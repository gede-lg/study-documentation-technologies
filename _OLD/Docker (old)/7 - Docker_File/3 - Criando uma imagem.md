## Tutorial Dockerfile para Imagem Python

Docker é uma plataforma que permite criar, implantar e gerenciar aplicativos virtualizados em contêineres. Utilizar Docker pode ser muito eficaz para garantir que seu aplicativo funcione da mesma maneira em qualquer ambiente. Este tutorial irá guiá-lo através do processo de criação de uma imagem Docker para um aplicativo Python usando um `Dockerfile`, construindo essa imagem, e por fim, rodando o aplicativo em um contêiner.

### O que é um Dockerfile?

Um `Dockerfile` é um script de configuração usado pelo Docker para gerar uma imagem de contêiner. Ele contém uma série de instruções e comandos que o Docker Engine usa para construir a imagem.

### 1. Criando o Dockerfile

Vamos começar criando um simples aplicativo Python e depois escrever um `Dockerfile` para ele.

#### Estrutura do Projeto

```
/meu_app_python
|-- app.py
|-- Dockerfile
|-- requirements.txt
```

- **app.py**: O arquivo Python que contém seu código.
- **Dockerfile**: O script que diz ao Docker como construir a imagem.
- **requirements.txt**: Um arquivo que lista as bibliotecas necessárias para o aplicativo Python.

#### app.py

Suponha que `app.py` seja um simples servidor web:

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Bem-vindo ao meu app Python no Docker!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

#### requirements.txt

Este arquivo contém as dependências necessárias:

```
flask
```

#### Dockerfile

Aqui está como o `Dockerfile` pode ser definido:

```dockerfile
# Usa uma imagem oficial Python como imagem base.
FROM python:3.8-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /code

# Copia os arquivos requirements.txt para dentro do contêiner
COPY requirements.txt .

# Instala as dependências
RUN pip install -r requirements.txt

# Copia os arquivos restantes do projeto
COPY . .

# Expõe a porta em que o contêiner estará ouvindo
EXPOSE 5000

# Define o comando para rodar a aplicação
CMD ["python", "./app.py"]
```

### 2. Construindo a Imagem Docker

Com o `Dockerfile` pronto, o próximo passo é construir a imagem Docker. Isso é feito usando o comando `docker build`. Supondo que você esteja no diretório do projeto, você pode construir a imagem usando o seguinte comando no terminal:

```bash
docker build -t meu_app_python .
```

- `-t meu_app_python`: Nomeia a imagem como `meu_app_python`.
- `.`: Indica que o Docker deve procurar o `Dockerfile` no diretório atual.

### 3. Criando um Contêiner

Depois que a imagem estiver construída, você pode criar e iniciar um contêiner com o comando `docker run`. Para fazer isso, execute:

```bash
docker run -p 5000:5000 meu_app_python
```

- `-p 5000:5000`: Mapeia a porta 5000 do contêiner para a porta 5000 do host, permitindo que você acesse o servidor web.

Agora, se você abrir um navegador e acessar `http://localhost:5000`, deverá ver a mensagem "Bem-vindo ao meu app Python no Docker!"

### Considerações Finais

Este tutorial cobriu os fundamentos para configurar um ambiente Docker para uma aplicação Python simples. O uso do Docker é bastante amplo, e suas práticas podem variar com base nas necessidades específicas do projeto e nos requisitos de segurança. Algumas práticas recomendadas adicionais incluem:

- Utilizar imagens oficiais e minimizadas para reduzir a superfície de ataques e o tamanho das imagens.
- Manter os `Dockerfiles` simples e modularizados para reutilização.
- Usar `.dockerignore` para evitar copiar arquivos desnecessários para dentro da imagem.

Espero que este tutorial tenha sido útil para começar a usar o Docker em seus projetos Python!