## O que é AngularCLI?

AngularCLI (Angular Command Line Interface) é uma ferramenta de linha de comando desenvolvida para simplificar e automatizar o processo de desenvolvimento com o framework Angular. Ela permite que os desenvolvedores criem, configurem e gerenciem aplicações Angular de forma eficiente e padronizada. A AngularCLI encapsula práticas recomendadas e complexidades em comandos simples, facilitando tarefas como a criação de novos projetos, geração de componentes, construção e execução de testes.

## Para que serve?

A principal função da AngularCLI é aumentar a produtividade dos desenvolvedores ao reduzir a quantidade de trabalho manual necessário para executar tarefas comuns e repetitivas no ciclo de desenvolvimento de aplicações Angular. Ela serve para:

- Iniciar novos projetos Angular rapidamente.
- Gerar blocos de construção da aplicação, como componentes, serviços e módulos.
- Executar a aplicação em um servidor de desenvolvimento local.
- Executar testes unitários e de ponta a ponta (e2e).
- Linting de código para manter a qualidade e a consistência do código.
- Gerar builds de produção otimizadas.

## Instalação e criação de projetos: `ng new` e `ng serve`

### Instalação

Para instalar a AngularCLI, você precisa ter o Node.js instalado em sua máquina. Após instalar o Node.js, execute o seguinte comando no terminal:

```bash
npm install -g @angular/cli
```

### Criação de Projetos

Para criar um novo projeto Angular, use o comando:

```bash
ng new nome-do-projeto
```

Isso criará um novo diretório com o nome `nome-do-projeto` e configurará um projeto Angular inicial com uma estrutura de diretório padrão.

Para executar o projeto localmente e abrir em um navegador, navegue até o diretório do projeto e execute:

```bash
cd nome-do-projeto
ng serve
```

O comando `ng serve` compila a aplicação e inicia um servidor de desenvolvimento. Por padrão, a aplicação pode ser acessada em `http://localhost:4200`.

## Criando components, services, interfaces, módulos, etc.: `ng generate`

Para gerar diferentes entidades, como componentes, serviços e módulos, a AngularCLI oferece o comando `ng generate` (ou `ng g` para abreviar). Aqui estão alguns exemplos:

- **Componente**: `ng generate component nome-do-componente`
- **Serviço**: `ng generate service nome-do-servico`
- **Módulo**: `ng generate module nome-do-modulo`
- **Interface**: `ng generate interface nome-da-interface`

Cada comando acima criará os arquivos necessários com um código base seguindo as melhores práticas do Angular.

## Usando pré-processadores e alterando-os (Sass, Less, Stylus)

Durante a criação do projeto (`ng new`), a AngularCLI permite selecionar um pré-processador CSS de sua escolha (Sass, Less, Stylus) através da opção `--style`. Por exemplo:

```bash
ng new nome-do-projeto --style=scss
```

Se você deseja alterar o pré-processador após a criação do projeto, pode modificar o arquivo `angular.json` do projeto, especificando o pré-processador desejado na opção `schematics`.

## Angular CLI: `ng lint`, `ng test`, `ng e2e`

- **Linting**: `ng lint` executa o linting de código para identificar problemas de estilo e de conformidade com as boas práticas.
- **Testes Unitários**: `ng test` executa os testes unitários da aplicação usando Karma e Jasmine.
- **Testes e2e**: `ng e2e` executa testes de ponta a ponta usando Protractor.

## Estrutura do Projeto

A estrutura de diretórios de um projeto Angular gerado pela CLI é organizada para promover boas práticas e facilitar a manutenção. Inclui diretórios para componentes, serviços, módulos, testes e configurações.

## Gerando build de produção

Para gerar uma build de produção, use o comando:

```bash
ng build --prod
```

Isso otimiza a aplicação para produção, minimizando scripts e estilos, e gera artefatos na pasta

 `dist/`.

---

Esta visão geral do AngularCLI abrange os conceitos básicos e comandos essenciais para começar a trabalhar com Angular. A documentação oficial do AngularCLI é uma excelente fonte para explorar mais funcionalidades e opções avançadas.