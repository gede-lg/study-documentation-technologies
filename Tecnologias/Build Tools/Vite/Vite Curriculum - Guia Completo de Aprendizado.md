## Módulo 1: Introdução ao Vite

### Tópicos:

- O que é Vite (significado e propósito)
- Criador: Evan You (criador do Vue.js)
- Histórico e evolução do Vite
- Vite vs Webpack vs Parcel vs Snowpack
- Comparação com ferramentas tradicionais
- Filosofia e princípios do Vite
- Por que escolher Vite em 2024
- Adoção em frameworks (Vue, React, Svelte, SolidJS)
- Ecossistema e comunidade
- Recursos oficiais e documentação

---

## Módulo 2: Conceitos Fundamentais

### Tópicos:

- ES Modules (ESM) nativo no navegador
- Como Vite utiliza ESM durante o desenvolvimento
- Native ES Modules vs Bundling
- Hot Module Replacement (HMR)
- Zero-configuration vs configuração customizada
- Diferença entre dev e production
- Rollup como bundler de produção
- esbuild para transpilação rápida
- Arquitetura de dois-comandos (dev e build)
- Workflow de desenvolvimento com Vite
- Performance e velocidade comparadas

---

## Módulo 3: Setup e Instalação

### Tópicos:

- Pré-requisitos (Node.js versão e npm/yarn/pnpm)
- Instalação global vs local do Vite
- Criar novo projeto com create-vite
- npx create-vite (opção recomendada)
- Escolher framework (Vanilla, Vue, React, Svelte, etc.)
- Escolher variante (JavaScript vs TypeScript)
- Estrutura de projeto gerado
- Arquivo package.json padrão
- Scripts npm disponíveis
- Alternativas: instalação manual
- Configuração de ferramentas complementares

---

## Módulo 4: Estrutura de Projeto Vite

### Tópicos:

- Raiz do projeto (root)
- Diretório public
- Diretório src (source)
- index.html como entry point
- Arquivo main.js/main.ts
- Estrutura de pastas recomendada
- vite.config.js/vite.config.ts
- package.json e dependências
- .gitignore padrão
- node_modules
- dist (diretório de build)
- Configuração de alias de caminhos
- Resolução de módulos

---

## Módulo 5: Servidor de Desenvolvimento

### Tópicos:

- Comando: npm run dev (ou vite dev, vite serve)
- Iniciar servidor dev
- Porta padrão (5173)
- Configurar porta customizada
- Abrir navegador automaticamente
- HTTPS em desenvolvimento
- Acesso via rede local
- Proxy de requisições
- Middlewares customizados
- HMR (Hot Module Replacement) detalhado
- Configurações de HMR
- Modo preview (vite preview)
- Performance do dev server

---

## Módulo 6: Configuração Básica do Vite

### Tópicos:

- Estrutura do arquivo vite.config.js
- Função defineConfig()
- Importação de configuração
- Configurações essenciais
- Variáveis de modo (development, production)
- command e isSsrBuild
- Retorno de objeto de configuração
- Async config function
- Formatação e sintaxe
- Validação de configuração
- Dicas de IDEs e intellisense
- Salvamento automático ao editar config

---

## Módulo 7: Configurações de Servidor Dev

### Tópicos:

- Option: server
- server.port (configurar porta)
- server.host (0.0.0.0, localhost)
- server.open (abrir navegador)
- server.https (protocolo HTTPS)
- server.proxy (proxy HTTP)
- server.cors (CORS settings)
- server.middlewares (middlewares customizados)
- server.watch (opções de monitoramento)
- server.ws (WebSocket)
- server.preTransformRequests
- server.sourcemap
- Configuração de desenvolvimento local
- Debugging de problemas

---

## Módulo 8: Tipos de Projeto Vite

### Tópicos:

- Vanilla JavaScript/TypeScript
- Projetos com Vue
- Projetos com React
- Projetos com Svelte
- Projetos com SolidJS
- Projetos com Preact
- Projetos com Lit
- Projetos com Astro
- Multiplas variações de frameworks
- Aplicação de página única (SPA)
- Aplicação multipáginas (MPA)
- Library mode (modo biblioteca)
- Backend com Vite
- SSR (Server-Side Rendering)
- SSG (Static Site Generation)

---

## Módulo 9: TypeScript em Vite

### Tópicos:

- Suporte nativo para TypeScript
- Apenas transpilação, não type-checking
- Arquivo tsconfig.json
- Configuração recomendada para Vite
- Opções importantes (target, lib, module)
- useDefineForClassFields
- skipLibCheck
- Importar arquivos .ts
- TypeScript com diferentes frameworks
- Type-only imports e exports
- const enum em TypeScript
- Implicit type-only imports
- Executar type checking separadamente
- tsc --noEmit
- vite-plugin-checker para erros inline
- Esbuild para transpilação rápida (20-30x mais rápido)
- HMR updates em menos de 50ms

---

## Módulo 10: Suporte CSS e Pré-processadores

### Tópicos:

- Importar CSS diretamente em JS
- CSS Modules (.module.css)
- Nomeação automática de classes
- CSS com url() references
- PostCSS automático
- Configuração de PostCSS
- Sass/SCSS (installação e uso)
- Less (instalação e uso)
- Stylus (instalação e uso)
- CSS Preprocessors opções
- CSS inlining via @import
- CSS url() rebasing automático
- CSS minification
- Construção de CSS Modules
- BEM naming convention
- Scoped styles
- CSS-in-JS solutions

---

## Módulo 11: Assets e Recursos Estáticos

### Tópicos:

- Importar assets (imagens, fonts, etc.)
- URL de assets durante build
- Diretório public
- Diferença entre import e public
- Otimização de imagens
- Compressão de assets
- Base path (base option)
- Nested public path
- Asset URLs em HTML
- Asset URLs em CSS
- Asset URLs em JavaScript
- Dynamic asset imports
- import.meta.glob()
- import.meta.globEager()
- Lazy loading de assets
- Web Workers

---

## Módulo 12: Importações Especiais

### Tópicos:

- Importar JSON (?raw flag)
- Importar Web Workers (?worker flag)
- Importar WebAssembly (.wasm files)
- Importar como URL (?url flag)
- Importar como string (?raw flag)
- Raw imports
- URL imports
- Worker imports
- WASM imports
- Mime types
- Query parameters em imports
- Importações condicionais
- Fallbacks para imports

---

## Módulo 13: Command Line Interface (CLI)

### Tópicos:

- vite (start dev server)
- vite dev (alias do dev)
- vite serve (alias do dev)
- vite build (build para produção)
- vite preview (preview do build)
- Opções de linha de comando
- --host (especificar host)
- --port (especificar porta)
- --base (base public path)
- --mode (especificar modo)
- --outDir (diretório de saída)
- --minify (minificação)
- --sourcemap (gerar sourcemaps)
- --ssr (SSR build)
- Argumentos customizados
- Scripts npm
- Environment variables via CLI

---

## Módulo 14: Variables de Ambiente

### Tópicos:

- Arquivo .env
- Arquivo .env.local
- Arquivo .env.[mode]
- Arquivo .env.[mode].local
- VITE_* prefix
- import.meta.env
- import.meta.env.MODE
- import.meta.env.DEV
- import.meta.env.PROD
- import.meta.env.SSR
- Variáveis customizadas
- Carregamento de .env files
- Acesso em tempo de build
- Acesso em runtime
- Substituição estática de variáveis
- Segurança de variáveis sensíveis
- Exposição de variáveis ao client

---

## Módulo 15: Build e Otimizações de Produção

### Tópicos:

- Comando vite build
- Rollup configuration
- Output format (ES modules, UMD, CommonJS, IIFE)
- Minificação (esbuild)
- Tree shaking (eliminação de código morto)
- Code splitting
- Chunk splitting estratégico
- Dynamic imports
- Lazy loading de chunks
- Preload de chunks
- Module preload polyfill
- Source maps gerados
- CSS optimization
- Asset optimization
- Tercer vs esbuild minification
- Build.target (browser targets)
- CSS target
- Brotli compression
- CSS na distribuição

---

## Módulo 16: Configurações de Build

### Tópicos:

- Option: build
- build.target (especificar navegadores)
- build.outDir (output directory - default: dist)
- build.assetsDir (assets subdirectory - default: assets)
- build.assetsInlineLimit (inline threshold)
- build.cssCodeSplit (CSS code splitting)
- build.sourcemap (generate source maps)
- build.minify (minificação - esbuild, terser)
- build.cssMinify (CSS minification)
- build.cssTarget (CSS browser target)
- build.lib (library mode)
- build.manifest (build manifest generation)
- build.rollupOptions (customizar Rollup)
- build.commonjsOptions (CommonJS options)
- build.dynamicImportVarsOptions

---

## Módulo 17: Library Mode

### Tópicos:

- Usar Vite para criar bibliotecas
- build.lib configuration
- build.lib.entry (entry point)
- build.lib.name (library name)
- build.lib.formats (output formats)
- build.lib.fileName (output filename)
- ES Module format
- CommonJS format
- UMD format
- IIFE format
- Geração de tipos TypeScript
- package.json exports
- package.json main, module fields
- CSS bundling em library
- Dist files structure
- Publishing to npm
- Exemplo completo de library

---

## Módulo 18: SSR (Server-Side Rendering)

### Tópicos:

- O que é SSR
- Vite SSR support
- build.ssr (SSR build)
- SSR entry point
- Renderização no servidor
- Hydration no cliente
- Middleware SSR
- Exemplo com Express.js
- Framework SSR support (Vue, React)
- SSR com Nitro
- Performance considerations SSR
- Bundle optimization SSR
- Troubleshooting SSR

---

## Módulo 19: SSG (Static Site Generation)

### Tópicos:

- O que é SSG
- Vite SSG support
- VitePress para SSG
- Static site generation tools
- Pre-rendering
- SEO optimization SSG
- Incremental Static Regeneration (ISR)
- Performance benefícios SSG
- Content management com SSG
- Markdown support
- Dark mode SSG
- Localization SSG

---

## Módulo 20: Plugin System - Fundamentos

### Tópicos:

- Plugin architecture
- O que são plugins Vite
- Estrutura básica de um plugin
- Plugin return object
- Métodos comuns de plugins
- name (identificação)
- apply (aplicação condicional)
- enforce (pre/post)
- resolveId (custom resolving)
- load (custom loading)
- transform (code transformation)
- handleHotUpdate (HMR customizado)
- Ordem de aplicação de plugins
- Plugin chaining

---

## Módulo 21: Using Plugins

### Tópicos:

- Plugin oficial do Vite
- @vitejs/plugin-vue
- @vitejs/plugin-react
- @vitejs/plugin-svelte
- @vitejs/plugin-legacy
- Community plugins
- Procurar plugins no awesome-vite
- Instalar e usar plugins
- Configurar plugins em vite.config.js
- Array de plugins
- Passar opções para plugins
- Plugins condicionais
- Combinar múltiplos plugins
- Plugin resolution

---

## Módulo 22: Plugins Úteis

### Tópicos:

- vite-plugin-vue
- vite-plugin-react
- vite-plugin-svelte
- vite-plugin-legacy
- vite-plugin-inspect
- vite-plugin-visualization
- vite-plugin-compression
- vite-plugin-imagemin
- vite-plugin-mock
- vite-plugin-pages
- vite-plugin-layouts
- unplugin libraries
- auto-import plugins
- component resolver plugins
- API mock plugins

---

## Módulo 23: Criando Custom Plugins

### Tópicos:

- Estrutura de um plugin Vite
- Virtual modules (módulos virtuais)
- Resolver customizados
- Loaders customizados
- Transformers customizados
- HMR customizado
- Plugin options
- Plugin context
- Exemplo simples de plugin
- Exemplo complexo de plugin
- Publicar plugin no npm
- Testing plugins
- Debugging plugins
- Best practices para plugins

---

## Módulo 24: Dependency Pre-bundling

### Tópicos:

- O que é pre-bundling
- esbuild para pre-bundling
- node_modules optimization
- optimizeDeps configuration
- optimizeDeps.include
- optimizeDeps.exclude
- optimizeDeps.esbuildOptions
- Detecção automática de dependências
- Force include/exclude
- Cache de pre-bundling
- .vite/deps cache
- Performance impact
- Debugging pre-bundling
- Monorepo considerations

---

## Módulo 25: Resolução de Módulos

### Tópicos:

- Module resolution strategy
- Alias configuration
- resolve.alias
- Path mapping
- ~ para root imports
- @ para src imports
- Extensões customizadas
- resolve.extensions
- resolve.mainFields
- resolve.conditions
- Conditional exports
- Exports field em package.json
- Monorepo workspace resolution
- Debugging resolution
- Common patterns

---

## Módulo 26: Advanced Configuration

### Tópicos:

- root (project root)
- base (public base path)
- mode (development/production)
- define (global constants)
- publicDir (public files directory)
- cacheDir (cache directory)
- logLevel (logging level)
- clearScreen (clear console on rebuild)
- envPrefix (environment variable prefix)
- envDir (environment files directory)
- benchmark (performance benchmarking)
- workers configuration
- ssr configuration option
- experimental options

---

## Módulo 27: Performance Optimization

### Tópicos:

- Code splitting strategies
- Lazy loading modules
- Dynamic imports
- Route-based code splitting
- Component-based code splitting
- Vendor bundle separation
- Import analysis
- vite-plugin-visualization
- Bundle analysis tools
- Treemap visualization
- Lighthouse integration
- Performance budgets
- Minification settings
- Compression (gzip, brotli)
- Image optimization
- Font loading strategies
- Script loading strategies

---

## Módulo 28: Security

### Tópicos:

- XSS prevention
- CSP (Content Security Policy)
- CORS configuration
- HTTPS em desenvolvimento
- Dependencies vulnerabilities
- npm audit
- Dependabot integration
- Source maps em produção
- Environment variables security
- Secrets management
- Signed URLs
- CSRF protection
- Insecure protocols
- Supply chain security

---

## Módulo 29: Testing com Vite

### Tópicos:

- Vitest (test runner para Vite)
- Jest vs Vitest
- Setup de Vitest
- test configuration em vite.config.js
- vitest.config.js
- Test globals (describe, it, expect)
- jsdom environment
- happy-dom environment
- Browser environment
- Escrevendo testes unitários
- Testes de integração
- Snapshot testing
- Coverage reporting
- Watch mode
- UI mode do Vitest
- Debugging testes

---

## Módulo 30: Debugging e Troubleshooting

### Tópicos:

- Chrome DevTools
- VS Code debugging
- Browser extensions
- Launch configurations
- Breakpoints
- Source maps
- Step through code
- Watch expressions
- Console logging
- Performance profiling
- Network debugging
- Storage inspection
- Network tab
- Common issues e soluções
- HMR issues
- Build errors
- Performance issues
- Memory leaks

---

## Módulo 31: Multi-Page Apps (MPA)

### Tópicos:

- Multi-page vs Single-page apps
- Estrutura de projeto MPA
- Múltiplos index.html entry points
- Configurar entrypoints
- rollupOptions.input
- Roteamento em MPA
- Shared modules
- Common dependencies
- Asset routing
- Build output para MPA
- Performance considerations MPA
- SEO em MPA
- Exemplo de MPA

---

## Módulo 32: Monorepo Support

### Tópicos:

- O que é monorepo
- Workspace configuration
- package.json workspaces
- pnpm workspaces
- yarn workspaces
- Shared packages
- Dependency resolution em monorepo
- Vite em monorepo
- Build múltiplos pacotes
- Development workflow
- Turborepo integration
- Nx integration
- Performance em monorepo

---

## Módulo 33: Framework Integration

### Tópicos:

- Vue.js + Vite
- React + Vite
- Svelte + Vite
- SolidJS + Vite
- Astro + Vite
- Nuxt + Vite
- SvelteKit + Vite
- SolidStart + Vite
- Framework-specific plugins
- Hot module replacement por framework
- Build otimizações por framework
- Development experience por framework
- Best practices por framework

---

## Módulo 34: Backend e Full-stack com Vite

### Tópicos:

- Express.js + Vite
- Koa.js + Vite
- Node.js servers
- API development
- Server-side rendering (SSR)
- Nitro framework
- Serverless functions
- Vercel integration
- Netlify integration
- Full-stack development
- Dev server proxy
- Environment configuration
- Database integration

---

## Módulo 35: Deployment

### Tópicos:

- Build para produção
- Otimizar dist output
- Asset versioning
- Cache busting
- CDN integration
- GitHub Pages
- Vercel deployment
- Netlify deployment
- AWS S3 + CloudFront
- Docker containerization
- GitHub Actions CI/CD
- GitLab CI/CD
- Deploy scripts
- Post-build steps
- Rollback strategies

---

## Módulo 36: Performance Monitoring

### Tópicos:

- Vitals (Core Web Vitals)
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- Performance.now()
- Performance API
- User Timing API
- Long tasks
- Framework performance
- Bundle size analysis
- Network waterfall
- Slow 3G simulation
- Chrome Lighthouse
- Web Vitals library
- Observability tools

---

## Módulo 37: Migração para Vite

### Tópicos:

- Migrar de Webpack
- Migrar de Parcel
- Migrar de Gulp
- Migrar de Create React App
- Migrar de Vue CLI
- Script npm updates
- Dependencies updates
- Configuration conversion
- Code adjustments
- Testing migration
- Plugin equivalents
- Performance comparison
- Troubleshooting migration
- Gradual migration
- Rollback strategies

---

## Módulo 38: Advanced Features

### Tópicos:

- Virtual modules
- Plugin hooks
- Custom resolvers
- Custom loaders
- AST transforms
- Frame injection
- HMR custom events
- Conditional configuration
- Environment-specific builds
- Feature flags
- A/B testing setup
- Analytics integration
- Error tracking
- Logging integration
- Monitoring setup

---

## Módulo 39: Best Practices e Patterns

### Tópicos:

- File structure organization
- Folder hierarchy recomendada
- Naming conventions
- Component organization
- Page organization
- Utils organization
- Tipos (TypeScript types)
- Constants management
- Configuration management
- Lazy loading patterns
- Code splitting patterns
- Dynamic imports patterns
- Error handling patterns
- Loading states
- Performance patterns
- Testing patterns
- Git workflows

---

## Módulo 40: Ecosystem e Ferramentas Complementares

### Tópicos:

- npm packages úteis
- Vitest para testes
- Visx para gráficos (React)
- Headless UI
- Tailwind CSS com Vite
- PostCSS plugins
- Babel integration
- SWC integration
- TypeScript ecosystem
- Linting tools (ESLint)
- Formatting tools (Prettier)
- Documentation generators
- Static analysis tools
- Code quality tools

---

## Módulo 41: Docker e Containerização

### Tópicos:

- Dockerfile para Vite
- Multi-stage builds
- Node image selection
- Building em container
- Runtime em container
- Docker Compose
- Development container
- Production container
- Health checks
- Volume mounting
- Port mapping
- Environment variables em Docker
- Docker networking
- Registry pushing
- Container optimization

---

## Módulo 42: CI/CD Integration

### Tópicos:

- GitHub Actions
- GitLab CI/CD
- Jenkins
- CircleCI
- Travis CI
- Build pipeline setup
- Test pipeline setup
- Deploy pipeline setup
- Matrix builds
- Caching strategies
- Artifact management
- Status badges
- Slack notifications
- Review deployments
- Automated releases

---

## Módulo 43: Comunidade e Recursos

### Tópicos:

- Vite oficial docs
- Awesome Vite repository
- Community forums
- GitHub discussions
- Stack Overflow
- YouTube tutorials
- Blog posts
- Conferences
- Meetups
- Contributing to Vite
- Plugin development guide
- Report bugs
- Feature requests
- Version updates
- Breaking changes

---

## Módulo 44: Projeto Prático Integrador

### Tópicos:

- Planejamento de projeto
- Definição de requisitos
- Escolha de stack
- Setup inicial com Vite
- Project scaffolding
- Folder structure
- Configuration setup
- Development workflow
- Component architecture
- State management
- Routing setup
- API integration
- Authentication
- Error handling
- Logging
- Unit testing
- Integration testing
- Build optimization
- Performance analysis
- Security audit
- Deployment preparation
- CI/CD setup
- Monitoring setup
- Documentation
- Code review
- Maintenance plan

---

## Ordem de Estudo Recomendada

1. **Módulos 1-4**: Fundamentos e conceitos (2-3 horas)
2. **Módulos 5-7**: Setup e configuração básica (3-4 horas)
3. **Módulos 8-10**: Tipos de projeto e TypeScript (3-4 horas)
4. **Módulos 11-14**: Assets e variables (2-3 horas)
5. **Módulo 15-17**: Build e library mode (4-5 horas)
6. **Módulos 18-19**: SSR e SSG (3-4 horas)
7. **Módulos 20-24**: Plugins e pre-bundling (5-6 horas)
8. **Módulos 25-28**: Configuração avançada (4-5 horas)
9. **Módulos 29-32**: Testing e MPA (4-5 horas)
10. **Módulos 33-36**: Framework e deployment (5-6 horas)
11. **Módulos 37-40**: Migração e ecosystem (4-5 horas)
12. **Módulos 41-44**: DevOps e projeto final (6-8 horas)

**Total Estimado: 50-70 horas (dependendo do ritmo e experiência)**

---

## Recursos Complementares

- **Documentação Oficial**: https://vitejs.dev
- **GitHub Repository**: https://github.com/vitejs/vite
- **Awesome Vite**: https://github.com/vitejs/awesome-vite
- **Community Plugins**: https://vitejs.dev/plugins/
- **Rollup Docs**: https://rollupjs.org/
- **esbuild Docs**: https://esbuild.github.io/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **Vitest**: https://vitest.dev/
- **VitePress**: https://vitepress.dev/
- **Tutorials**: MDN Web Docs, YouTube channels
- **Community**: Discord, GitHub Discussions, Stack Overflow

---

## Pré-requisitos

- Node.js 16+ (recomendado 18 LTS ou 20+)
- npm, yarn ou pnpm
- Conhecimento básico de JavaScript/TypeScript
- Familiarity com linha de comando (terminal/bash)
- Conceitos de módulos e build tools
- Entendimento de HTML/CSS/JavaScript

---

## Estrutura Recomendada de Aprendizado

### Fase 1: Fundamentals (Semana 1)

- Módulos 1-4: Conceitos básicos e setup

### Fase 2: Core Features (Semana 2)

- Módulos 5-10: Dev server, configuração, TypeScript, CSS

### Fase 3: Assets e Recursos (Semana 3)

- Módulos 11-14: Assets, imports, CLI, env variables

### Fase 4: Build e Produção (Semana 4)

- Módulos 15-17: Build, library mode, otimizações

### Fase 5: Advanced Rendering (Semana 5)

- Módulos 18-19: SSR e SSG

### Fase 6: Plugins (Semana 6)

- Módulos 20-24: Plugins, pre-bundling, resolução de módulos

### Fase 7: Advanced Config (Semana 7)

- Módulos 25-28: Configuração avançada, security, testing

### Fase 8: Estruturas Especiais (Semana 8)

- Módulos 29-32: Testing, debugging, MPA, monorepo

### Fase 9: Framework e Backend (Semana 9)

- Módulos 33-36: Framework integration, deployment, monitoring

### Fase 10: Ecosystem (Semana 10)

- Módulos 37-40: Migração, ferramentas, best practices

### Fase 11: DevOps (Semana 11)

- Módulos 41-43: Docker, CI/CD, comunidade

### Fase 12: Projeto Final (Semana 12)

- Módulo 44: Projeto integrador completo

---

**Cada módulo deve incluir:**

- Exemplos práticos de código
- Exercícios hands-on
- Mini projetos
- Configurações reais
- Troubleshooting comuns
- Links para referências
- Casos de uso reais
- Performance comparisons
- Boas práticas