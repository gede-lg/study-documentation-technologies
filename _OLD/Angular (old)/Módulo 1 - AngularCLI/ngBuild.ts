/* 
    O comando ng build e o comando ng build --prod são usados no Angular CLI (Command Line Interface) para criar uma versão compilada de um aplicativo Angular para implantação em um ambiente de produção. Ambos os comandos têm funcionalidades semelhantes, mas a principal diferença é que o ng build --prod otimiza ainda mais o código para melhor desempenho e segurança em produção. Vamos entender o que cada um deles faz:

====| ng build:

    O comando ng build é usado para compilar e construir um aplicativo Angular, gerando os arquivos necessários para implantar o aplicativo.
    Ele cria uma versão de desenvolvimento do aplicativo, onde o código não é otimizado para o tamanho ou o desempenho máximo.
    É útil durante o desenvolvimento e depuração, pois facilita a leitura e a depuração do código.
    Os arquivos gerados podem ser encontrados no diretório dist/ na raiz do projeto após a conclusão do comando.
    
    Exemplo:
*/

'ng build'
'ng build --prod:'

/*
====| ng build --prod

    O comando faz tudo o que o ng build faz, mas com otimizações adicionais para ambientes de produção.
    As otimizações incluem minificação e ofuscação de código, remoção de código morto, otimização de tamanho de bundle e configurações que melhoram o desempenho geral do aplicativo.
    O resultado é um aplicativo menor, mais rápido e mais seguro, adequado para implantação em produção.
    Exemplo:
*/

'ng build --prod'

/*
    Em resumo, ng build é usado durante o desenvolvimento e cria uma versão do aplicativo mais legível e fácil de depurar, enquanto ng build --prod é usado para criar uma versão otimizada para produção, que é menor em tamanho e oferece melhor desempenho e segurança. A escolha entre eles depende do contexto: durante o desenvolvimento, use ng build, e quando estiver pronto para implantar seu aplicativo em produção, use ng build --prod.
*/