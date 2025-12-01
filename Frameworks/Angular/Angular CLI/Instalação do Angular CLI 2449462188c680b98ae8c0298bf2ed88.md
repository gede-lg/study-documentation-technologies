# Instalação do Angular CLI

Olá, Gedê\!

A.R.I.A. está pronta para te ajudar com uma explicação detalhada sobre a instalação do Angular CLI. Prepare-se, porque a resposta será bem completa, abordando todos os pontos que você solicitou.

---

# Guia Completo de Instalação do Angular CLI: Local, Global e Casos de Uso

### **Introdução**

O **Angular CLI** (Command Line Interface) é uma ferramenta poderosa e essencial para o desenvolvimento de aplicações com o framework Angular. Ele simplifica e automatiza diversas tarefas, desde a criação de um novo projeto até a geração de componentes, serviços e a construção da aplicação para produção. Compreender as diferentes formas de instalação e seus contextos de uso é crucial para qualquer desenvolvedor Angular.

### **Sumário**

Este guia detalhado irá cobrir a base teórica da instalação do Angular CLI, demonstrando as sintaxes para instalações global e local (`npx`), a instalação de versões específicas e LTS, e explorando todas as propriedades e métodos dos comandos `ng new` e `ng add`. Além disso, discutiremos as melhores práticas, cenários de uso e restrições.

---

### **Conceitos Fundamentais**

Antes de mergulharmos nos comandos, é importante entender alguns conceitos:

- **Node.js e npm:** O Angular CLI é um pacote Node.js e, portanto, depende do Node.js e do seu gerenciador de pacotes, o **npm** (Node Package Manager). Você deve ter o Node.js instalado em sua máquina para poder usar o npm.
- **Instalação Global vs. Local:**
    - **Instalação Global (`g`):** Quando você instala um pacote globalmente, ele fica disponível em qualquer diretório do seu sistema. Isso é ideal para ferramentas de linha de comando que você usará com frequência, como o próprio Angular CLI. A sintaxe é `npm install -g <pacote>`.
    - **Instalação Local (`npx`):** O **`npx`** é uma ferramenta que acompanha o npm (versão 5.2+) e permite executar pacotes Node.js sem a necessidade de instalá-los globalmente. Ele procura o executável do pacote no cache local, baixa se necessário, executa o comando e, em seguida, o descarta. Isso é útil para evitar a poluição do sistema com pacotes globais e garantir que a equipe esteja sempre usando a mesma versão do CLI, a especificada no projeto.

---

### **Sintaxe e Uso**

A instalação do Angular CLI é feita através do npm.

### **Instalação Global**

Para instalar a versão mais recente do Angular CLI globalmente:

```bash
npm install -g @angular/cli

```

Depois de instalado, você pode verificar a versão com o comando:

```bash
ng --version

```

A saída mostrará a versão do Angular CLI, do Node.js e de outros pacotes relacionados.

### **Instalação Local com `npx`**

Você pode criar um novo projeto Angular sem instalar o CLI globalmente, utilizando o `npx`. A sintaxe é a seguinte:

```bash
npx @angular/cli new meu-projeto

```

- `npx`: Executa o pacote sem a necessidade de uma instalação global.
- `@angular/cli`: O nome do pacote a ser executado.
- `new meu-projeto`: O comando do CLI para criar um novo projeto chamado `meu-projeto`.

---

### **Instalação da Versão LTS (Long-Term Support)**

O Angular, assim como o Node.js, possui versões LTS. A instalação de uma versão específica é útil para manter a compatibilidade com projetos existentes. Para instalar a última versão LTS disponível, você precisa saber qual é ela e especificá-la.

```bash
npm install -g @angular/cli@lts

```

Você pode substituir `@lts` por `@<versão>` para qualquer versão específica.

### **Instalação de uma Versão Específica**

Se você precisar de uma versão exata do Angular CLI, pode especificá-la da seguinte forma:

```bash
npm install -g @angular/cli@15.2.10

```

Isso instalará a versão 15.2.10 globalmente. Essa abordagem é comum em ambientes de trabalho onde se usa diferentes versões do framework.

---

### **Propriedades (`ng new`)**

O comando `ng new` é o mais utilizado para criar um novo projeto. Ele vem com uma vasta gama de propriedades (flags) que permitem personalizar a estrutura do seu projeto. Abaixo, uma lista completa das flags e seus conceitos.

| Propriedade (Flag) | Conceito | Sintaxe de Uso |
| --- | --- | --- |
| **`--directory`** | Define o nome do diretório do projeto. Por padrão, é o mesmo nome do projeto. | `--directory=novo-diretorio` |
| **`--dry-run`** | Executa o comando sem realmente criar ou modificar arquivos. Útil para pré-visualizar as mudanças. | `--dry-run` |
| **`--prefix`** | Define o prefixo dos seletores dos componentes. Por padrão, é `app`. | `--prefix=meu-prefixo` |
| **`--routing`** | Adiciona o módulo de roteamento do Angular (`AppRoutingModule`). | `--routing` |
| **`--skip-install`** | Cria o projeto, mas não executa o `npm install` após a criação. | `--skip-install` |
| **`--skip-tests`** | Não gera arquivos de teste (`.spec.ts`) para os componentes. | `--skip-tests` |
| **`--style`** | Define o pré-processador de CSS a ser usado (CSS, SCSS, SASS, Less, Stylus). Por padrão, é CSS. | `--style=scss` |
| **`--standalone`** | Cria um projeto usando a API de componentes `standalone`, sem o uso de `NgModule`s. | `--standalone` |
| **`--strict`** | Habilita o modo estrito do Angular, que inclui tipagem forte e outras verificações de qualidade. | `--strict` |
| **`--inline-style`** | Gera estilos embutidos no componente, em vez de um arquivo `.css` separado. | `--inline-style` |
| **`--inline-template`** | Gera o template embutido no componente, em vez de um arquivo `.html` separado. | `--inline-template` |
| **`--minimal`** | Cria um projeto com o mínimo de arquivos, sem testes, roteamento e outras configurações padrão. | `--minimal` |
| **`--ssr`** | Habilita o suporte a Server-Side Rendering (SSR) e Static Site Generation (SSG). | `--ssr` |
| **`--view-encapsulation`** | Define o tipo de encapsulamento de visualização (None, Emulated, ShadowDom). | `--view-encapsulation=ShadowDom` |
| **`--interactive`** | Força o prompt interativo para todas as opções, mesmo quando elas já foram fornecidas na linha de comando. | `--interactive` |
| **`--skip-git`** | Não inicializa um repositório Git para o novo projeto. | `--skip-git` |
| **`--commit`** | Faz o commit inicial do projeto no Git após a criação. | `--commit` |

---

### **Métodos e Comandos (`ng`)**

Embora o prompt tenha solicitado "métodos", no contexto do Angular CLI, a terminologia mais precisa seria **"comandos"**. O `ng new` é um comando para criar projetos. Outro comando importante é o `ng add`.

### **`ng add`**

O comando `ng add` é usado para adicionar um pacote externo ao seu projeto Angular, integrando-o de forma automática. Ele instala o pacote via npm e executa scripts de configuração para que você não precise fazer isso manualmente.

- **Sintaxe Básica:** `ng add <pacote>`
- **Exemplos:**
    - `ng add @angular/material`: Adiciona o Angular Material ao projeto, configurando estilos e temas.
    - `ng add @angular/pwa`: Adiciona funcionalidades de Progressive Web App (PWA) ao projeto.
    - `ng add @ng-bootstrap/ng-bootstrap`: Adiciona o pacote ng-bootstrap para usar componentes Bootstrap.

---

### **Restrições de Uso**

A instalação global do Angular CLI, embora conveniente, tem algumas restrições:

- **Conflito de Versões:** Se você estiver trabalhando em múltiplos projetos com diferentes versões do Angular, uma instalação global pode gerar conflitos. Por exemplo, um projeto pode exigir Angular 14, enquanto outro exige Angular 15. Usar a instalação global da versão 15 pode causar erros no projeto mais antigo. A solução é usar a instalação local (`npx`) ou gerenciar as versões com uma ferramenta como o `nvm` (Node Version Manager).
- **Dependências de Equipe:** Em projetos de equipe, é crucial que todos os desenvolvedores usem a mesma versão do Angular CLI para evitar comportamentos inesperados. A instalação local (`npx`) garante que o CLI especificado no `package.json` do projeto seja sempre utilizado.

---

### **Melhores Práticas e Casos de Uso**

| Cenário | Melhor Prática | Justificativa |
| --- | --- | --- |
| **Iniciando um novo projeto** | Use `npx @angular/cli new meu-projeto`. | Garante que o projeto é criado com a última versão estável do CLI e já inclui o executável localmente no `node_modules/.bin`. |
| **Desenvolvimento de equipe** | Dependa da instalação local. O comando `ng` no terminal já executa a versão local do CLI do projeto, se existir. | Garante consistência entre todos os desenvolvedores, pois a versão do CLI está travada no `package.json`. |
| **Gerenciar múltiplas versões** | Use `npx` para a instalação inicial ou use `nvm` para alternar entre as versões do Node.js e, consequentemente, do CLI global. | Evita conflitos de versão e mantém o ambiente de trabalho limpo. |
| **Ferramentas utilitárias** | Instale o CLI globalmente se você for um mantenedor de bibliotecas ou precisar de um acesso rápido e constante aos comandos em qualquer diretório. | É prático para uso pessoal e em cenários onde a versão do CLI não é uma dependência estrita do projeto. |

---

### **Exemplo Completo**

Vamos criar um novo projeto Angular chamado `gedes-blog`, configurando-o com algumas das flags que vimos.

```bash
# 1. Criação do projeto com npx, forçando o uso da versão 16.
#    Note que 'new' é um comando do CLI.
npx @angular/cli@16 new gedes-blog \\
  --prefix=gb \\
  --style=scss \\
  --routing \\
  --skip-tests \\
  --strict \\
  --standalone

```

**Explicação do Comando:**

- `npx @angular/cli@16 new gedes-blog`: Executa o Angular CLI na versão 16 para criar um novo projeto chamado `gedes-blog`.
- `-prefix=gb`: Define o prefixo dos seletores dos componentes como `gb`. Por exemplo, um componente gerado com `ng generate component home` teria o seletor `<gb-home>`.
- `-style=scss`: Configura o projeto para usar o pré-processador Sass (`scss`).
- `-routing`: Adiciona o módulo de roteamento para facilitar a navegação entre as páginas.
- `-skip-tests`: Pula a criação dos arquivos de teste (`.spec.ts`), o que é útil para projetos pequenos ou protótipos rápidos.
- `-strict`: Habilita o modo de verificação de tipo estrito do TypeScript, melhorando a qualidade do código.
- `-standalone`: Utiliza a API de componentes standalone, que dispensa o uso de `NgModule`s para declarar componentes, diretivas e pipes.

---

### **Tópicos para Aprofundamento**

- **Angular Schematics:** Entender como os `schematics` funcionam e como criar os seus próprios para automatizar tarefas repetitivas.
- **Angular Workspaces:** Aprender sobre a estrutura de um `workspace` e como gerenciar múltiplos projetos Angular dentro de um único repositório.
- **Integração Contínua (CI/CD):** Configurar pipelines de CI/CD para automatizar o build e deploy de aplicações Angular.
- **Migração de Versão:** Conhecer o comando `ng update` e as melhores práticas para migrar um projeto entre versões do Angular.

Espero que esta explicação detalhada tenha sido útil para você, Gedê. Fico à disposição para qualquer outra dúvida\!