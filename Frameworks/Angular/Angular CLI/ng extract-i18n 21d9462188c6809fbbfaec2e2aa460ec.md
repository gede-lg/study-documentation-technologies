# ng extract-i18n

## Título

**Extração de Mensagens i18n com Angular CLI: Guia Abrangente do Comando ng extract-i18n**

## Introdução

O Angular CLI disponibiliza o comando **ng extract-i18n** para coletar todas as strings marcadas para internacionalização (i18n) diretamente do seu código-fonte e gerar um arquivo de catálogo (por padrão `messages.xlf`). Esse arquivo servirá de base para traduzir sua aplicação e, posteriormente, reimportar essas traduções no build final ([angular.dev](https://angular.dev/cli/extract-i18n)) ([angular.dev](https://angular.dev/guide/i18n/translation-files?utm_source=chatgpt.com)).

## Sumário

1. Conceitos Fundamentais
2. Sintaxe e Uso
3. Restrições de Uso
4. Argumentos
5. Opções
6. Melhores Práticas e Casos de Uso
7. Exemplos Completos
8. Tópicos Relacionados

---

## 1. Conceitos Fundamentais

- **Internacionalização (i18n)**: processo de preparar a aplicação para vários idiomas, separando as strings de UI em catálogos de tradução.
- **Marcação de Strings**: no Angular, utiliza-se o atributo `i18n` em templates ou a função `$localize` em código TypeScript para identificar trechos traduzíveis.
- **Fluxo de Trabalho**:
    1. Marcar textos com `i18n` ou `$localize`.
    2. Extrair mensagens com **ng extract-i18n** num arquivo em formatos como XLIFF (1.2/2), XMB, JSON ou ARB.
    3. Traduzir o arquivo gerado, incluindo plurais e contextos.
    4. Rebuild da aplicação usando `-localize` para cada idioma configurado. ([angular.dev](https://angular.dev/guide/i18n/translation-files?utm_source=chatgpt.com))

---

## 2. Sintaxe e Uso

```bash
ng extract-i18n [projeto] [opções]

```

- **projeto**: nome definido em `angular.json` (aplicação ou biblioteca).
- **opções**: flags para customizar nome, local e formato do arquivo de saída.

**Exemplo de fluxo básico**:

```bash
ng add @angular/localize
ng extract-i18n --format=xlf2 --output-path=src/locale --out-file=messages.en.xlf

```

Isso criará `src/locale/messages.en.xlf` com todas as strings marcadas ([angular.dev](https://angular.dev/cli/extract-i18n)).

---

## 3. Restrições de Uso

- **Bibliotecas**: desde Angular 18, **ng extract-i18n** só funciona em projetos de aplicação; bibliotecas não são suportadas diretamente ([github.com](https://github.com/angular/angular-cli/issues/29120?utm_source=chatgpt.com)).
- **Pacote `@angular/localize`**: deve estar instalado e aplicado antes de extrair, caso contrário as marcações não serão reconhecidas.
- **Mesclagem Incremental**: para fluxos complexos de atualizações de tradução, recomenda-se usar ferramentas como `@ngx-i18nsupport/xliffmerge` ou `ng-extract-i18n-merge` ([npmjs.com](https://www.npmjs.com/package/ng-extract-i18n-merge?utm_source=chatgpt.com)).

---

## 4. Argumentos

| Argumento | Descrição | Tipo |
| --- | --- | --- |
| project | Nome do projeto (aplicação ou biblioteca) definido em `angular.json`, do qual extrair as mensagens. | string |

> Fonte: Angular CLI Reference (angular.dev)
> 

---

## 5. Opções

| Opção | Descrição | Tipo | Padrão |
| --- | --- | --- | --- |
| `--build-target` | Alvo do builder (`projeto:target[:configurações]`), podendo listar várias configurações separadas por vírgula. | string | — |
| `--configuration`, `-c` | Uma ou mais configurações nomeadas em `angular.json`, separadas por vírgula. | string | — |
| `--format` | Formato do arquivo de saída. | string | `xlf` |
|  | *Valores:* `xmb`, `xlf`, `xlif`, `xliff`, `xlf2`, `xliff2`, `json`, `arb`, `legacy-migrate` |  |  |
| `--out-file` | Nome do arquivo gerado (por ex., `messages.xlf`). | string | — |
| `--output-path` | Diretório onde o arquivo será salvo. | string | — |
| `--i18n-duplicate-translation` | Como tratar mensagens duplicadas. | string | — |
|  | *Valores:* `error`, `warning`, `ignore` |  |  |
| `--help` | Exibe ajuda resumida. | boolean | — |
| `--progress` | Mostra progresso de extração no console. | boolean | `true` |

> Fontes: Angular CLI Reference (angular.dev)
> 

---

## 6. Melhores Práticas e Casos de Uso

- **Organização de Arquivos**: centralize traduções em `src/locale` para manter consistência.
- **Configs de Build**: crie configurações dedicadas em `angular.json` para cada idioma e use `-configuration` para builds automatizados.
- **Tratamento de Duplicatas**: em pipelines de CI, use `-i18n-duplicate-translation=warning` para detectar conflitos sem falhar o processo.
- **Automação de Mesclagem**: combine `ng extract-i18n` com scripts de mesclagem (`xliffmerge`) para manter arquivos sincronizados.
- **Integração em CI/CD**: configure um job que rode a extração periodicamente (ou em cada PR) e publique o arquivo em um repositório de traduções.

---

## 7. Exemplos Completos

### Exemplo 1: Extração e Preparação de Traduções

```bash
ng add @angular/localize

# Extrai mensagens base em XLIFF 2
ng extract-i18n my-app \
  --format=xlf2 \
  --output-path=src/locale \
  --out-file=messages.en.xlf

# Copia para pt-BR e inicia a tradução
cp src/locale/messages.en.xlf src/locale/messages.pt-BR.xlf

```

### Exemplo 2: Build para Múltiplos Idiomas

```
// angular.json (trecho relevante)
"projects": {
  "my-app": {
    "i18n": {
      "sourceLocale": "en-US",
      "locales": {
        "pt-BR": "src/locale/messages.pt-BR.xlf",
        "fr":    "src/locale/messages.fr.xlf"
      }
    },
    "architect": {
      "build": {
        "configurations": {
          "production-pt": { "localize": ["pt-BR"] },
          "production-fr": { "localize": ["fr"] }
        }
      }
    }
  }
}

```

```bash
# Extrai antes das traduções
ng extract-i18n my-app --format=xlf2 --out-file=messages.en.xlf --output-path=src/locale

# Gera builds localizados
ng build my-app --configuration=production-pt
ng build my-app --configuration=production-fr

```

---

## 8. Tópicos Relacionados

- Gerenciamento e mesclagem de arquivos de tradução com `ngx-i18nsupport/xliffmerge`
- Deep dive no pacote `@angular/localize`
- Internacionalização em tempo de execução (runtime)
- Configurações avançadas de build para múltiplas localidades
- Integração contínua (CI/CD) para fluxo completo de i18n

Espero que este guia completo lhe dê todo o embasamento necessário para dominar o **ng extract-i18n** no Angular CLI!