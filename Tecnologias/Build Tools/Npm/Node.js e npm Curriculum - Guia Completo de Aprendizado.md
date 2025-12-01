## Módulo 1: Introdução ao Node.js

### Tópicos:

- O que é Node.js
- História e evolução do Node.js
- Node.js vs browser JavaScript
- Event-driven, non-blocking I/O
- Single-threaded event loop
- JavaScript no servidor
- Casos de uso de Node.js
- Vantagens e desvantagens
- Comunidade e ecossistema
- Versões e LTS (Long Term Support)

---

## Módulo 2: Instalação e Setup

### Tópicos:

- Download de Node.js (versions e variants)
- Instalação no Windows
- Instalação no macOS
- Instalação no Linux
- Verificar instalação (node -v, npm -v)
- Atualizar Node.js
- Atualizar npm
- Node Version Manager (nvm) instalação
- Gerenciar múltiplas versões do Node.js com nvm
- Path e variáveis de ambiente
- Terminal/Command line basics

---

## Módulo 3: npm - Node Package Manager Fundamentos

### Tópicos:

- O que é npm
- npm registry (npmjs.com)
- npm vs Yarn vs pnpm
- npm CLI (command-line interface)
- npm install vs npm ci
- npm versioning
- Semantic versioning (semver)
- package.json (estrutura e propósito)
- package-lock.json (lock file)
- node_modules (pasta de dependências)
- npm configuração inicial

---

## Módulo 4: Configuração de Projeto Node.js

### Tópicos:

- Inicializar novo projeto (npm init)
- npm init -y (quick init)
- Entender estrutura de package.json
- name (nome do projeto)
- version (versionamento)
- description (descrição)
- entry point (main file)
- scripts (npm scripts)
- keywords (palavras-chave)
- author e license
- repository
- bugs e homepage
- Custom fields

---

## Módulo 5: Package.json Detalhado

### Tópicos:

- Dependencies (dependências de produção)
- DevDependencies (dependências de desenvolvimento)
- OptionalDependencies (dependências opcionais)
- PeerDependencies (dependências peer)
- EngineStrict
- Engines (versão de Node.js requerida)
- Bin (executáveis binários)
- Files (arquivos a publicar)
- Directories
- Type (module vs commonjs)
- Exports (field de exports)
- Imports (field de imports)
- Workspaces

---

## Módulo 6: npm Scripts e Automação

### Tópicos:

- Entender npm scripts
- npm run (executar scripts customizados)
- npm start
- npm test
- npm stop
- npm restart
- Pre e post scripts
- npm run-script
- Arguments em scripts
- Environment variables em scripts
- Cross-platform scripts (cross-env)
- Comandos shell em scripts
- Script sequencing (&&, ||, &)
- Parallel scripts

---

## Módulo 7: Instalando Pacotes

### Tópicos:

- npm install (instalar todas as dependências)
- npm install --save (adicionar a dependencies)
- npm install --save-dev (adicionar a devDependencies)
- npm install --save-optional
- npm install --no-save (sem salvar em package.json)
- npm install -g (instalação global)
- npm install <package>@version
- npm install <package>@latest
- npm install <package>@^version (caret)
- npm install <package>@~version (tilde)
- npm install <package>@*
- npm install from URL
- npm install from git
- npm install from local path
- npm ci (continuous integration install)

---

## Módulo 8: Gerenciando Dependências

### Tópicos:

- npm update (atualizar pacotes)
- npm outdated (listar pacotes desatualizados)
- npm prune (remover pacotes não usados)
- npm uninstall (remover pacote)
- npm ls (listar pacotes instalados)
- npm list --depth=0 (tree structure)
- npm explain (explicar dependência)
- Flat dependency tree
- Dependency conflicts
- Semver compatibility
- Version locking
- Shrinkwrap vs package-lock

---

## Módulo 9: Versioning e Semantic Versioning

### Tópicos:

- Semantic versioning (semver) explicado
- Major.Minor.Patch (X.Y.Z)
- Major version (breaking changes)
- Minor version (new features)
- Patch version (bug fixes)
- Pre-release versions (alpha, beta)
- Build metadata
- Caret (^) - compatible versions
- Tilde (~) - close versions
- Exact versioning
- Version ranges
- npm view package version
- Checking compatibility
- Version resolution algorithm

---

## Módulo 10: npm Security

### Tópicos:

- npm audit (verificar vulnerabilidades)
- npm audit fix (corrigir automaticamente)
- npm audit fix --force
- npm audit report
- npm audit json
- Security vulnerabilities types
- CVE (Common Vulnerabilities and Exposures)
- Dependency scanning
- npm publish authentication
- npm two-factor authentication (2FA)
- Trusted publishers
- Supply chain security
- Lockfile integrity
- Signing packages

---

## Módulo 11: npm Registry e Publicação

### Tópicos:

- npm registry (npmjs.com)
- Configurar npm registry
- npm whoami (verificar autenticação)
- npm login (fazer login)
- npm logout (deslogar)
- npm publish (publicar pacote)
- npm unpublish (remover pacote)
- npm deprecate (deprecar versão)
- npm dist-tags (tags de versão)
- npm version (atualizar versão)
- Scoped packages (@scope/package)
- Tarball packages
- Private packages
- Org scope
- npm organization memberships

---

## Módulo 12: Package.lock.json

### Tópicos:

- Propósito do package-lock.json
- Estructura do arquivo
- Version locking (travamento de versão)
- Integrity hashes (SHA-512)
- Nested dependencies
- Peer dependency resolution
- Lock file formato
- npm ci vs npm install
- Quando commitar package-lock.json
- Merge conflicts em lock files
- npm install --package-lock-only
- Resolving lock file conflicts

---

## Módulo 13: Node.js Core Modules

### Tópicos:

- O que são módulos core
- require() para carregar módulos
- import (ES6 modules)
- Diferença entre require e import
- fs (File System)
- path (manipulação de caminhos)
- http (criar servidores)
- events (EventEmitter)
- util (utilidades)
- stream (streaming de dados)
- buffer (dados binários)
- os (informações do sistema)
- process (processo Node.js)
- global (objetos globais)
- module e exports

---

## Módulo 14: CommonJS vs ES6 Modules

### Tópicos:

- CommonJS (require/module.exports)
- ES6 Modules (import/export)
- require() function
- module.exports object
- exports shorthand
- import statement
- export default
- Named exports
- export as
- import * as
- Dynamic imports
- require.resolve()
- import.meta
- .mjs extension
- "type": "module" em package.json
- Mixing CommonJS e ES6 (quando possível)
- Transpilation com Babel

---

## Módulo 15: npm Alternativas - Yarn

### Tópicos:

- O que é Yarn
- Yarn vs npm comparação
- Instalação de Yarn
- yarn init
- yarn add (instalar pacote)
- yarn remove (remover pacote)
- yarn upgrade (atualizar pacotes)
- yarn list (listar pacotes)
- yarn audit (verificar segurança)
- yarn lock file (yarn.lock)
- Yarn workspaces
- Yarn Plug'n'Play (PnP)
- Migrando de npm para Yarn
- Yarn 3 features

---

## Módulo 16: npm Alternativas - pnpm

### Tópicos:

- O que é pnpm
- pnpm vs npm vs Yarn
- Instalação de pnpm
- Space efficiency (economiza espaço)
- pnpm install
- pnpm add (instalar pacote)
- pnpm remove
- pnpm update
- pnpm audit
- pnpm list
- pnpm lock file (pnpm-lock.yaml)
- Symlink structure
- Strict dependency
- Monorepo suporte
- Migrando para pnpm

---

## Módulo 17: npm Aliases e Shortcuts

### Tópicos:

- npm install = npm i
- npm install --save = npm add
- npm install --save-dev = npm i -D
- npm install -g = npm i -g
- npm uninstall = npm un, npm remove = npm rm
- npm update = npm up
- npm outdated = npm o
- npm list = npm ls
- npm run-script = npm run
- Aliases customizados
- .npmrc configuração
- Shortcuts no terminal (bash, zsh)

---

## Módulo 18: npm Global vs Local

### Tópicos:

- Instalar globally (-g flag)
- Instalar localmente (padrão)
- Diferenças e casos de uso
- npm root (ver pasta node_modules)
- npm root -g (ver pasta global)
- Estrutura de pasta global
- PATH variável de ambiente
- Executáveis globais
- Conflitos de versão global vs local
- Quando usar global
- Quando usar local
- Melhor prática recomendada

---

## Módulo 19: npm Cache

### Tópicos:

- npm cache (verificar cache)
- npm cache verify (verificar integridade)
- npm cache clean (limpar cache)
- npm cache clean --force
- Cache location
- npm cache dir
- Offline installations
- npm ci (respeita cache)
- npm install (usa cache quando disponível)
- Cache patterns
- Limitações do cache
- Troubleshooting cache

---

## Módulo 20: Node.js REPL

### Tópicos:

- REPL (Read-Eval-Print-Loop)
- Iniciar REPL (digitando 'node')
- Expressões interativas
- Variáveis em REPL
- .help command
- .exit command
- .clear command
- Multi-line input
- History navigation (arrow keys)
- Loadinging modules em REPL
- .load file.js
- Tab completion
- Breakpoints em REPL
- Alternativas ao REPL padrão

---

## Módulo 21: Executando Arquivos Node.js

### Tópicos:

- node script.js (executar arquivo)
- Argumentos de linha de comando
- process.argv
- Parsear argumentos
- Variáveis de ambiente (process.env)
- Standard input/output (stdin, stdout, stderr)
- Exit codes (process.exit())
- Signal handling (SIGINT, SIGTERM)
- Graceful shutdown
- Script relative paths
- Absolute paths
- require vs import em scripts
- Executar código antes do script

---

## Módulo 22: npm CLI Commands Completo

### Tópicos:

- npm init
- npm install / npm i
- npm update / npm up
- npm uninstall / npm rm
- npm search
- npm view
- npm info
- npm list / npm ls
- npm outdated
- npm audit
- npm publish
- npm unpublish
- npm owner
- npm access
- npm team
- npm org
- npm tag
- npm version
- npm deprecate
- npm help

---

## Módulo 23: Popular npm Packages

### Tópicos:

- lodash (utilidades)
- express (web framework)
- axios (HTTP client)
- moment/dayjs (data/hora)
- dotenv (variáveis de ambiente)
- nodemon (development)
- jest (testing)
- mongoose (MongoDB ODM)
- sequelize (SQL ORM)
- multer (file upload)
- socket.io (real-time)
- uuid (gerar IDs)
- validator (validação)
- chalk (colorir output)
- commander (CLI builder)

---

## Módulo 24: npm ERR! - Troubleshooting

### Tópicos:

- Erros comuns de instalação
- npm ERR! code ERESOLVE
- npm ERR! code E404
- npm ERR! code EACCES (permissões)
- npm ERR! code ENOENT
- npm ERR! code ERR_INVALID_URL
- Dependency conflicts
- Versão Node.js não compatível
- Espaço em disco insuficiente
- Problemas de rede
- Certificados SSL/TLS
- Proxy configuration
- Cache corruption
- Reinstalar node_modules
- npm ci para CI/CD

---

## Módulo 25: npm e Desenvolvimento

### Tópicos:

- npm install (install all dependencies)
- npm start (iniciar aplicação)
- npm test (rodar testes)
- npm run dev (dev server)
- npm run build (build para produção)
- nodemon para desenvolvimento
- Restart automático de servidor
- Watch mode
- Dev dependencies separadas
- package.json scripts workflow
- Ferramentas de desenvolvimento
- Linting (ESLint)
- Formatting (Prettier)
- Type checking (TypeScript)

---

## Módulo 26: npm e Produção

### Tópicos:

- npm install --production (instalar apenas dependencies)
- Remover devDependencies em produção
- npm prune --production
- Node.js production environment
- process.env.NODE_ENV
- Optimizações de produção
- Build tools (webpack, vite)
- Code minification
- Tree shaking
- Bundle size optimization
- Docker e npm
- CI/CD pipelines
- Deployment strategies

---

## Módulo 27: npm Workspaces (Monorepo)

### Tópicos:

- O que é monorepo
- npm workspaces
- package.json "workspaces" field
- Estrutura de workspaces
- npm install em workspaces
- npm run em todos os workspaces
- npm run --workspace=<name>
- npm publish de workspaces
- Dependency resolution em workspaces
- Symlinking
- Shared dependencies
- Vantagens de monorepo
- Desvantagens de monorepo
- Ferramentas de monorepo (lerna, turborepo)

---

## Módulo 28: .npmrc Configuração

### Tópicos:

- O que é .npmrc
- Localização do .npmrc
- .npmrc global (~/.npmrc)
- .npmrc local (projeto)
- npm config (ler/escrever config)
- npm config get <key>
- npm config set <key> <value>
- npm config delete <key>
- npm config list
- Chave/valor commons
- Auth tokens
- Registry customizado
- Proxy settings
- SSL/TLS configuration
- Environment variables em config

---

## Módulo 29: npm scripts Avançado

### Tópicos:

- Pre/post scripts automation
- pretest, test, posttest
- prebuild, build, postbuild
- prestart, start, poststart
- Custom scripts com pré/pós
- npm run-script
- Script composition
- Executando scripts em sequência
- Executando scripts em paralelo
- Conditional execution
- Using child_process
- Cross-platform scripts (cross-env)
- Variáveis de ambiente em scripts
- Argumentos passados para scripts

---

## Módulo 30: npm Publish - Criar Seu Próprio Pacote

### Tópicos:

- Preparar pacote para publicação
- Estrutura de projeto para publicação
- README.md obrigatório
- LICENSE file
- .npmignore (excluir arquivos)
- files field em package.json
- Versionamento do pacote
- npm version (atualizar versão)
- git tags
- npm pack (testar antes de publicar)
- npm publish (publicar pacote)
- npm login (autenticação)
- npm logout
- Scoped packages (@scope/name)
- Atualizar pacote publicado
- Deprecar versão
- Remover pacote (npm unpublish)

---

## Módulo 31: Node.js File System (fs)

### Tópicos:

- fs module basics
- fs.readFile() - ler arquivo
- fs.writeFile() - escrever arquivo
- fs.appendFile() - adicionar ao arquivo
- fs.unlink() - deletar arquivo
- fs.mkdir() - criar diretório
- fs.rmdir() - remover diretório
- fs.readdir() - listar diretório
- fs.stat() - informações do arquivo
- fs.exists() - arquivo existe
- Operações síncronas vs assíncronas
- fs.promises (promisified API)
- async/await com fs
- Callbacks em fs
- Error handling

---

## Módulo 32: Node.js HTTP Server

### Tópicos:

- http module
- Criar servidor HTTP básico
- http.createServer()
- Request object
- Response object
- res.writeHead() - headers
- res.write() - escrever response
- res.end() - finalizar response
- Routing básico
- Status codes
- Content-type headers
- JSON responses
- Middleware concept
- Servindo arquivos estáticos
- Query parameters
- URL parsing

---

## Módulo 33: Express.js com npm

### Tópicos:

- npm install express
- Express basics
- Express application
- app.get(), app.post(), etc.
- Routing
- Middleware
- Error handling
- Static files (express.static)
- Request body parsing
- Query strings
- URL parameters
- Response methods
- Templating engines
- Express best practices
- Popular express packages

---

## Módulo 34: Ambiente e Variables

### Tópicos:

- process.env (variáveis de ambiente)
- NODE_ENV (development/production)
- Configurar variáveis de ambiente
- .env files
- dotenv package
- Acessar variáveis em Node.js
- Segurança de variáveis sensíveis
- process.argv
- Command line arguments
- Parse arguments (yargs, minimist)
- Environment variables em scripts
- CI/CD environment variables

---

## Módulo 35: Node.js Events

### Tópicos:

- EventEmitter
- events module
- Creating event listeners
- on() method
- once() method
- emit() method
- off() / removeListener()
- removeAllListeners()
- Event names
- Passing data with events
- Error events
- Listener management
- Memory leaks from listeners
- Custom event emitters
- Stream events

---

## Módulo 36: npm e Testing

### Tópicos:

- npm test command
- Jest framework
- Mocha + Chai
- Test runners
- Unit testing
- Integration testing
- npm install --save-dev jest
- Configurar package.json para testes
- Test script em package.json
- Running tests locally
- Coverage reports
- Continuous integration testing
- Pre-commit hooks
- Testing best practices

---

## Módulo 37: Node.js Streams

### Tópicos:

- Readable streams
- Writable streams
- Duplex streams
- Transform streams
- pipe() method
- Streaming files
- Large file handling
- Memory efficiency
- Backpressure handling
- error event
- end event
- data event
- close event
- Stream options

---

## Módulo 38: Node.js Buffer

### Tópicos:

- Buffer class
- Criando buffers
- Buffer.from()
- Buffer.alloc()
- Buffer.allocUnsafe()
- Buffer methods
- String encoding (utf8, ascii, hex)
- Buffer concatenation
- Buffer comparison
- Buffer slicing
- Copy between buffers
- Binary data handling
- File operations com buffers

---

## Módulo 39: npm e Produtividade

### Tópicos:

- npm i -D (dev dependencies)
- Nodemon para hot reload
- npm scripts efficiency
- Alias e shortcuts
- Tab completion
- npm run lista scripts
- npm start vs npm run start
- npm test execution
- npm search (buscar pacotes)
- npm info (informações de pacote)
- npm docs (documentação online)
- npm repository (ir para repositório)
- npm bugs (reportar bugs)
- npm home (página do pacote)

---

## Módulo 40: Node.js Async/Await e npm

### Tópicos:

- async/await com npm packages
- Promises
- Callbacks vs Promises vs async/await
- Error handling com try/catch
- Multiple awaits
- Promise.all() com múltiplas requisições
- Timeout handling
- Async iterators
- for await...of loops
- Generator functions
- Async generators
- Popular async packages

---

## Módulo 41: npm Lock Files e Reproducibilidade

### Tópicos:

- Importância do lock file
- npm ci (clean install)
- CI/CD environments
- Reproducible builds
- Package lock conflicts
- Resolvendo merge conflicts
- npm install vs npm ci
- Shrinkwrap (npm-shrinkwrap.json)
- Lock file format
- Integrity verification
- Hash mismatches
- Version conflicts resolution

---

## Módulo 42: Node.js e npm Best Practices

### Tópicos:

- Semantic versioning
- Version pinning strategies
- Dependency management
- Reducing bundle size
- Audit regularly
- Keep Node.js updated
- Keep npm updated
- Use lock files
- Security considerations
- Performance optimization
- Code organization
- Testing strategy
- CI/CD integration
- Documentation
- Changelog management

---

## Módulo 43: npm Ecosystem e Tendências

### Tópicos:

- npm ecosystem growth
- Popular packages trends
- Package alternatives
- Community contributions
- Open source participation
- Publishing your own package
- Maintaining packages
- Versioning strategy
- Backward compatibility
- Breaking changes
- Migration guides
- npm stats and insights
- Package quality indicators

---

## Módulo 44: Projeto Prático Integrador

### Tópicos:

- Criar projeto Node.js completo
- Setup inicial com npm
- Estrutura de projeto
- Package.json customizado
- npm scripts workflow
- Instalar dependências necessárias
- Configurar dev environment
- Express server setup
- Rotas e controllers
- Middleware customizado
- Database integration
- Testing setup
- Environment variables
- Error handling
- Logging
- Code organization
- Git workflow
- Deploy preparation
- CI/CD setup
- Documentation
- Code quality tools
- Performance monitoring
- Security practices

---

## Ordem de Estudo Recomendada

1. **Módulos 1-6**: Fundamentos (8-12 horas)
2. **Módulos 7-14**: npm Essencial (10-14 horas)
3. **Módulos 15-22**: Gerenciamento Avançado (8-12 horas)
4. **Módulos 23-28**: npm Especializado (6-10 horas)
5. **Módulos 29-38**: Node.js Core (12-16 horas)
6. **Módulos 39-42**: Produção e Best Practices (8-12 horas)
7. **Módulo 43**: Projeto Prático (8-12 horas)

**Total Estimado: 60-88 horas (8-12 semanas)**

---

## Pré-requisitos

- Conhecimento básico de JavaScript
- Familiaridade com terminal/bash
- Editor de código (VSCode recomendado)
- Conceitos de linha de comando

---

## Recursos Complementares

- **Documentação Oficial Node.js**: https://nodejs.org/docs/
- **npm Documentation**: https://docs.npmjs.com/
- **npm Registry**: https://www.npmjs.com/
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices
- **Yarn Documentation**: https://yarnpkg.com/
- **pnpm Documentation**: https://pnpm.io/
- **MDN Web Docs**: https://developer.mozilla.org/

---

**Cada módulo deve incluir:**

- Conceitos teóricos
- Exemplos práticos
- Exercícios hands-on
- Troubleshooting comuns
- Links para referências
- Boas práticas
- Casos de uso reais