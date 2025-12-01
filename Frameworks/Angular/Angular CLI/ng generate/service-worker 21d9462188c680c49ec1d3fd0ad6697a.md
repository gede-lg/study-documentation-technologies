# service-worker

**Título:**

**Domínio Completo do `ng generate service-worker`: Configurando Service Workers no Angular CLI**

---

## 1. Introdução

O comando `ng generate service-worker` faz parte do Angular CLI e automatiza a configuração do *Service Worker* no seu projeto Angular, transformando-o em uma Progressive Web App (PWA). Com ele, você habilita cache de recursos, interceptação de requisições e modo offline, todos gerenciados pelo Angular Service Worker.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#conceitos-fundamentais)
2. [Sintaxe e Uso](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#sintaxe-e-uso)
3. [Restrições de Uso](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#restri%C3%A7%C3%B5es-de-uso)
4. [Argumentos](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#argumentos)
5. [Opções](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#op%C3%A7%C3%B5es)
    - Específicas do Schematic
    - Globais do Angular CLI
6. [Melhores Práticas e Casos de Uso](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#melhores-pr%C3%A1ticas-e-casos-de-uso)
7. [Exemplo Completo](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#exemplo-completo)
8. [Tópicos Adicionais & Sugestões](https://chatgpt.com/c/685bd1e4-9d88-8013-9f64-1ff6bede9ffc#t%C3%B3picos-adicionais--sugest%C3%B5es)

---

## 3. Conceitos Fundamentais

- **Service Worker**: é um *script* executado em segundo plano pelo navegador, separado da página web, capaz de interceptar requisições de rede e gerenciar cache, permitindo modos offline ou em redes instáveis.
- **Angular Service Worker**: implementação oficial mantida pelo time Angular que, junto ao arquivo `ngsw-config.json`, define quais ativos e dados serão cacheados e por qual estratégia (precaching, runtime caching, data groups etc.) ([angular.dev](https://angular.dev/cli/generate/service-worker)).
- **Progressive Web App (PWA)**: conjunto de práticas que tornam aplicações web confiáveis, rápidas e engajantes, aproveitando Service Workers, Web App Manifest e HTTPS. O comando em questão insere suporte a PWA na sua aplicação Angular ([blog.angular-university.io](https://blog.angular-university.io/angular-service-worker/?utm_source=chatgpt.com)).

---

## 4. Sintaxe e Uso

```bash
ng generate service-worker [options]
# ou abreviado
ng g service-worker [options]

```

- **Propósito**: adiciona ao `angular.json` a flag `serviceWorker: true` para o *build* de produção, cria o arquivo de configuração `ngsw-config.json` na raiz do projeto e importa o `ServiceWorkerModule` no `AppModule`.
- **Fluxo Típico**:
    1. Executar o comando no diretório raiz de um workspace Angular configurado.
    2. Ajustar o arquivo `ngsw-config.json` conforme necessidades de cache.
    3. Fazer *build* de produção (`ng build --configuration production`) e implantar.

---

## 5. Restrições de Uso

- **Ambiente de Produção**: só faz sentido para *builds* com `serviceWorker: true`, geralmente `production`. Em modo de desenvolvimento (`ng serve`), o *service worker* não é registrado por padrão.
- **HTTPS OBRIGATÓRIO**: navegadores exigem conexão segura para registrar Service Workers.
- **Escopo de Aplicação**: só funciona na raiz onde o *service worker* está hospedado; se seu app for servido de subpasta, ajuste `scope` no registro ou `baseHref`.
- **Projetos sem PWA**: se não há necessidade de modo offline ou instalação como app, pode ser desnecessário.

---

## 6. Argumentos

| Argumento | Descrição | Tipo |
| --- | --- | --- |
| `schematic` | Nome do *schematic* a ser executado (sempre `service-worker`) | `string` |

> Observação: não há outros argumentos posicionais além do próprio schematic.
> 

---

## 7. Opções

### 7.1 Específicas do Schematic

| Opção | Descrição | Tipo | Default |
| --- | --- | --- | --- |
| `--project` | Nome do projeto no `angular.json` onde o SW será adicionado. Se omitido, determina do diretório atual. | `string` | — |
| `--target` | *Build target* para aplicar o SW. Geralmente `build` (modo standard). | `string` | `build` |

> (angular.dev)
> 

### 7.2 Globais do Angular CLI (para `ng generate`)

| Opção | Descrição | Tipo | Default |
| --- | --- | --- | --- |
| `--defaults` | Desabilita prompts interativos para opções que já têm valor padrão. | `boolean` | `false` ([angular.dev](https://angular.dev/cli/generate)) |
| `--dry-run`, `-d` | Simula a execução, mostrando o que seria feito, sem gravar alterações no sistema de arquivos. | `boolean` | `false` ([angular.dev](https://angular.dev/cli/generate)) |
| `--force`, `-f` | Força sobrescrever arquivos existentes sem perguntar. | `boolean` | `false` ([angular.dev](https://angular.dev/cli/generate)) |
| `--help` | Exibe ajuda resumida do comando no console. | `boolean` | —       ([angular.dev](https://angular.dev/cli/generate)) |
| `--interactive` | Habilita (ou desabilita, se `false`) prompts interativos. | `boolean` | `true` ([angular.dev](https://angular.dev/cli/generate)) |

---

## 8. Melhores Práticas e Casos de Uso

1. **Configurar PWA ao criar o projeto**: use `ng new my-app --defaults` + `ng add @angular/pwa` para um fluxo completo que já adiciona o SW.
2. **Ajustar `ngsw-config.json`**: personalize `assetGroups` (arquivos estáticos) e `dataGroups` (chamadas HTTP).
3. **Gerenciar versões**: o Angular SW gera hashes e controla atualizações. Teste no navegador (DevTools → Application → Service Workers).
4. **Monitorar tamanho de cache**: limite quantidades em `dataGroups` para não estourar quotas do navegador.
5. **Testar offline**: após build de produção, sirva via `http-server ./dist/my-app -c-1 --ssl-cert ...` e simule offline no DevTools.

---

## 9. Exemplo Completo

### 9.1 Estrutura de comandos

```bash
# 1. Criar app (opcional se já tiver):
ng new minha-pwa --defaults

# 2. Adicionar suporte a PWA (inclui SW):
ng add @angular/pwa --project=minha-pwa

# 3. Ou, manualmente, apenas gerar SW:
cd minha-pwa
ng generate service-worker --project=minha-pwa --target=build

# 4. Build de produção:
ng build --configuration production

```

### 9.2 `app.module.ts`

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // Registra o Service Worker apenas em produção:
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Registro condicionado e estratégias avançadas:
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

```

### 9.3 `ngsw-config.json` (exemplo simplificado)

```
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",       // Baixa tudo no install
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",           // Baixa sob demanda
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(png|jpg|svg)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-data",
      "urls": [
        "https://api.meusite.com/**"
      ],
      "cacheConfig": {
        "maxSize": 100,
        "maxAge": "1d",
        "timeout": "10s",
        "strategy": "freshness"        // Tenta rede primeiro, depois cache
      }
    }
  ]
}

```

---

## 10. Tópicos Adicionais & Sugestões

- **Personalização Avançada do `ngsw-config.json`**: estratégias de atualização, versionamento, *push manifest*
- **Push Notifications com `SwPush`**
- **Testes Automatizados de Service Worker**
- **Debbuging e Ferramentas de DevTools para SW**
- **Integração com Workbox para recursos fora do escopo Angular**

### Tópicos Relacionados para Aprofundamento

- Criação e otimização de *assetGroups* vs *dataGroups*
- Comparativo Angular Service Worker x Workbox
- Service Workers fora de Angular: APIs nativas
- Web App Manifest e configuração de ícones
- Estratégias de *cache invalidation* e migração de versões

---

Com esta visão 360° do `ng generate service-worker`, você está pronto para transformar aplicações Angular em PWAs robustas, garantindo performance, confiabilidade e experiência rica mesmo em condições adversas de rede.