# Configuração Básica da IDE Escolhida

## 🎯 Introdução e Definição

### Definição Conceitual Clara

A **configuração básica de uma IDE** refere-se ao conjunto de ajustes iniciais e personalizações fundamentais que transformam uma instalação padrão em um ambiente de desenvolvimento otimizado e adaptado ao fluxo de trabalho individual. Conceitualmente, é o processo de **calibração da ferramenta** para maximizar produtividade, conforto visual e alinhamento com padrões de codificação do projeto ou organização.

Esta configuração vai além de simplesmente "fazer funcionar". Envolve decisões sobre aparência (temas, fontes), comportamento (atalhos de teclado, indentação automática, formatação de código), integração com ferramentas externas (JDK, Maven, Git), e estabelecimento de preferências que serão base para todo desenvolvimento futuro.

Uma IDE bem configurada torna-se **extensão natural do pensamento do desenvolvedor** — atalhos tornam-se memória muscular, formatação automática elimina decisões triviais, análise de código em tempo real previne erros antes da compilação. Configuração inadequada resulta em fricção constante: lutar contra comportamentos padrão, não encontrar funcionalidades, experiência visual desconfortável.

### Contexto Histórico e Motivação

Nas primeiras gerações de IDEs (anos 90 e início dos 2000), configuração era complexa e mal documentada. IDEs como JBuilder e VisualAge requeriam expertise técnica para ajustes básicos. A motivação para melhorar experiência de configuração veio de duas frentes:

**1. Democratização do Desenvolvimento:** Com popularização do Java, desenvolvedores de diferentes backgrounds (não apenas experts Unix/C++) precisavam de ferramentas acessíveis. IDEs como NetBeans (apoiada pela Sun) focaram em "funcionar out-of-the-box" com configuração mínima.

**2. Produtividade em Escala:** Empresas perceberam que tempo gasto configurando IDE era custo real. IntelliJ IDEA revolucionou ao introduzir **import settings**, permitindo compartilhar configurações entre equipes. Eclipse seguiu com **workspaces** e **preferences export/import**.

A evolução foi de "cada desenvolvedor configura manualmente" para "organização mantém configuração padrão compartilhada", garantindo consistência de código (indentação, organização de imports, etc.) através de code style configurations.

### Problema Fundamental que Resolve

**1. Eliminação de Decisões Triviais:**
Sem configuração de code style, desenvolvedor decide manualmente quantos espaços indentar, onde quebrar linha, como organizar imports. Configuração automatiza isso, permitindo foco em lógica.

**2. Prevenção de Erros:**
Configurar análise de código (inspections) detecta padrões problemáticos (null pointer potencial, recursos não fechados, imports não usados) antes de executar código.

**3. Consistência de Equipe:**
Configurações compartilhadas (via arquivos `.editorconfig`, IntelliJ code style XML, Eclipse preferences) garantem que todo código da equipe tenha formatação idêntica.

**4. Aceleração de Workflow:**
Configurar atalhos de teclado e live templates (snippets) reduz tempo para ações frequentes (gerar getters/setters, criar testes, refatorar).

**5. Integração de Ferramentas:**
Configurar Maven/Gradle, Git, servidores de aplicação na IDE elimina necessidade de alternar constantemente entre IDE e terminal.

### Importância no Ecossistema

Configuração adequada da IDE é **multiplicador silencioso de produtividade**. Desenvolvedores experientes investem horas configurando IDE porque sabem que economizarão centenas de horas em produtividade diária.

No contexto corporativo, **configurações padronizadas** tornam-se ativos da organização. Novos desenvolvedores importam configurações e imediatamente aderem aos padrões de código da empresa. Code reviews focam em lógica, não em formatação, porque IDE formata automaticamente.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Configurações de Aparência:** Tema (light/dark), fonte, tamanho, esquema de cores
2. **Configurações de Editor:** Indentação, quebra de linha, encoding de caracteres
3. **Configurações de Projeto:** JDK, módulos, source/output directories
4. **Integração de Ferramentas:** Maven/Gradle, Git, build automation
5. **Code Style:** Formatação automática, organização de imports, convenções de nomenclatura

### Pilares Fundamentais

- **Ergonomia Visual:** Tema e fonte confortáveis reduzem fadiga ocular
- **Automação de Formatação:** Code style elimina formatação manual
- **Atalhos Produtivos:** Keymap otimizado acelera ações frequentes
- **Análise Proativa:** Inspections detectam problemas antes da execução
- **Compartilhamento de Configurações:** Consistência entre desenvolvedores

### Nuances Importantes

- **Configurações Globais vs Por Projeto:** Algumas são globais (tema, keymap), outras por projeto (JDK, code style)
- **Importação/Exportação:** Mecanismos para compartilhar configurações variam por IDE
- **Precedência de Configurações:** EditorConfig sobrescreve configurações IDE para formatação

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Hierarquia de Configurações

IDEs armazenam configurações em camadas hierárquicas:

**IntelliJ IDEA:**
```
Sistema (IDE-wide)
  ↓
Projeto
  ↓
Módulo
  ↓
Arquivo (via EditorConfig)
```

**Conceito:** Configuração mais específica sobrescreve mais geral. EditorConfig no diretório do arquivo tem precedência sobre configuração global.

#### Armazenamento de Configurações

**IntelliJ:**
- Configurações globais: `~/.IntelliJIdea<version>/config/`
- Configurações de projeto: `.idea/` directory no projeto
- Code style: `<project>/.idea/codeStyles/`

**Eclipse:**
- Workspace preferences: `<workspace>/.metadata/.plugins/org.eclipse.core.runtime/.settings/`
- Project preferences: `<project>/.settings/`

**Conceito:** Configurações são arquivos XML/properties. Podem ser versionados no Git para compartilhamento.

#### Formatação Automática via AST

Quando IDE formata código, ela:

1. **Parseia código em AST** (Abstract Syntax Tree)
2. **Aplica regras de code style** (indentação, espaçamento, quebras de linha)
3. **Reconstrói código** a partir da AST formatada

**Implicação:** Formatação preserva semântica (código formatado é funcionalmente idêntico ao original).

### Princípios Subjacentes

#### Convenção sobre Configuração

IDEs modernas vêm com defaults sensatos (Oracle Code Conventions para Java). Maioria dos projetos precisa apenas ajustes menores, não reconfiguração total.

#### Configuração Declarativa

Code style é declarativo (XML, JSON): "use 4 espaços para indentação", "organize imports alfabeticamente". IDE interpreta declaração e aplica automaticamente.

#### EditorConfig como Padrão Universal

`.editorconfig` é arquivo padronizado que funciona em múltiplas IDEs:

```ini
[*.java]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
```

**Benefício:** Projeto com `.editorconfig` funciona consistentemente em IntelliJ, Eclipse, VS Code.

---

## 🔍 Análise Conceitual Profunda

### Configuração IntelliJ IDEA

#### Aparência e Temas

**Acessar:** File > Settings > Appearance & Behavior > Appearance

**Configurações Essenciais:**

```
Theme: Darcula (dark) ou IntelliJ Light
Font: JetBrains Mono, Consolas, Fira Code (com ligatures)
Size: 14-16pt (ajustar conforme resolução)
```

**Conceito de Ligatures:** Fontes como Fira Code combinam caracteres (`!=` vira `≠`, `=>` vira `⇒`), melhorando legibilidade de código.

**Sintaxe de Aplicação:**
1. Settings > Appearance > Theme: Darcula
2. Settings > Editor > Font: JetBrains Mono
3. Enable font ligatures: ✓

#### Configuração de Editor

**Acessar:** Settings > Editor > General

**Indentação:**
```
Settings > Editor > Code Style > Java
  - Tab size: 4
  - Indent: 4
  - Continuation indent: 8
  - Use tab character: ✗ (usar espaços)
```

**Conceito:** Espaços são preferíveis a tabs (renderizam identicamente em todas ferramentas).

**Encoding:**
```
Settings > Editor > File Encodings
  - Project Encoding: UTF-8
  - Default encoding for properties files: UTF-8
```

**Implicação:** UTF-8 suporta caracteres internacionais, essencial para projetos globais.

#### Configuração de Projeto e JDK

**Acessar:** File > Project Structure

**Configurar Project SDK:**
```
Project Structure > Project
  - SDK: 17 (java version "17.0.1")
  - Language level: 17 - Sealed types, always-strict floating-point
```

**Conceito de Language Level:** Determina quais recursos da linguagem estão disponíveis. SDK 17 pode compilar para language level 11 (compatibilidade retroativa).

**Configurar Módulos:**
```
Project Structure > Modules
  - Sources: src/main/java (marcar como Sources)
  - Test Sources: src/test/java
  - Resources: src/main/resources
```

#### Code Style e Formatação

**Importar Scheme:**
```
Settings > Editor > Code Style > Java
  - Scheme: Default / Google Java Style / Custom
```

**Google Java Style Guide Example:**

Download `intellij-java-google-style.xml`, importar:
```
Settings > Editor > Code Style > Java > ⚙️ > Import Scheme > IntelliJ IDEA code style XML
```

**Configurar Imports:**
```
Settings > Editor > Code Style > Java > Imports
  - Class count to use import with '*': 99 (evitar imports wildcard)
  - Names count to use static import with '*': 99
  - Import Layout:
    1. java.*
    2. javax.*
    3. <blank line>
    4. org.*
    5. com.*
    6. <blank line>
    7. all other imports
```

**Formatação Automática ao Salvar:**
```
Settings > Tools > Actions on Save
  - Reformat code: ✓
  - Optimize imports: ✓
```

**Conceito:** Código é formatado automaticamente ao salvar (Ctrl+S), eliminando necessidade de invocar manualmente.

#### Atalhos de Teclado (Keymap)

**Acessar:** Settings > Keymap

**Escolher Predefinição:**
```
Keymap: Default (IntelliJ) / Eclipse / Visual Studio / macOS
```

**Customizar Atalhos Essenciais:**
```
- Reformat Code: Ctrl+Alt+L
- Optimize Imports: Ctrl+Alt+O
- Search Everywhere: Shift Shift (duplo)
- Find Usages: Alt+F7
- Rename: Shift+F6
- Extract Method: Ctrl+Alt+M
- Run: Shift+F10
- Debug: Shift+F9
```

**Conceito:** Atalhos tornam-se memória muscular. Desenvolvedores proficientes raramente usam mouse.

#### Plugins Essenciais

**Acessar:** Settings > Plugins

**Recomendados:**
```
- Lombok: Suporte para anotações Lombok (@Getter, @Setter)
- CheckStyle-IDEA: Integração com CheckStyle para análise estática
- SonarLint: Detecção de bugs e code smells
- GitToolBox: Extensões Git (inline blame, auto-fetch)
- Rainbow Brackets: Colorir parênteses/colchetes por nível
```

**Instalação:**
```
Settings > Plugins > Marketplace
Buscar "Lombok" > Install > Restart IDE
```

### Configuração Eclipse

#### Aparência

**Acessar:** Window > Preferences > General > Appearance

**Theme:**
```
Theme: Dark (ou Classic se preferir light)
```

**Font:**
```
Preferences > General > Appearance > Colors and Fonts
  - Basic > Text Font: Edit
  - Font: Consolas, 12pt
```

#### Configuração de Projeto e JDK

**Adicionar JDK:**
```
Window > Preferences > Java > Installed JREs
  - Add > Standard VM
  - JRE home: C:\Program Files\Java\jdk-17
  - JRE name: jdk-17
```

**Configurar Compiler:**
```
Preferences > Java > Compiler
  - Compiler compliance level: 17
```

#### Code Style

**Importar Formatter:**

Download `eclipse-java-google-style.xml`:
```
Preferences > Java > Code Style > Formatter
  - Import > Selecionar XML
  - Active profile: GoogleStyle
```

**Organização de Imports:**
```
Preferences > Java > Code Style > Organize Imports
  - Number of imports needed for .*: 99
  - Order:
    1. java
    2. javax
    3. org
    4. com
```

**Save Actions:**
```
Preferences > Java > Editor > Save Actions
  - Perform the selected actions on save: ✓
  - Format source code: ✓
  - Organize imports: ✓
```

#### Atalhos

Eclipse usa keybindings diferentes de IntelliJ:

```
- Format: Ctrl+Shift+F
- Organize Imports: Ctrl+Shift+O
- Quick Fix: Ctrl+1
- Rename: Alt+Shift+R
- Extract Method: Alt+Shift+M
```

### Configuração VS Code

#### Extensões Java

**Instalar Extension Pack for Java:**
```
Extensions (Ctrl+Shift+X) > Buscar "Extension Pack for Java" > Install
```

Inclui:
- Language Support for Java (Red Hat)
- Debugger for Java
- Test Runner for Java
- Maven for Java
- Project Manager for Java

#### Configurar JDK

**settings.json:**
```json
{
  "java.home": "C:\\Program Files\\Java\\jdk-17",
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-17",
      "path": "C:\\Program Files\\Java\\jdk-17",
      "default": true
    }
  ]
}
```

#### Code Style

**Usar Google Java Format:**

Instalar extensão "google-java-format":
```
Extensions > Buscar "google-java-format" > Install
```

**settings.json:**
```json
{
  "editor.formatOnSave": true,
  "java.format.settings.url": "https://raw.githubusercontent.com/google/styleguide/gh-pages/eclipse-java-google-style.xml"
}
```

#### EditorConfig

Criar `.editorconfig` na raiz do projeto:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.java]
indent_style = space
indent_size = 4
max_line_length = 120
```

**Conceito:** VS Code respeita `.editorconfig` automaticamente, garantindo consistência.

---

## 🎯 Aplicabilidade e Contextos

### Quando Configurar Imediatamente

**Cenário 1: Início em Novo Emprego**
Importar configurações da empresa (code style, inspections) no primeiro dia garante aderência a padrões desde início.

**Cenário 2: Início de Projeto Pessoal**
Configurar code style e formatação automática desde primeiro commit evita retrabalho futuro.

### Configurações para Equipes

**Filosofia: "Configuration as Code"**

Versionador arquivos de configuração no Git:

```
projeto/
  .idea/
    codeStyles/
      Project.xml  # Code style do projeto
  .editorconfig    # Configuração universal
  checkstyle.xml   # Regras CheckStyle
```

**Benefício:** Novos desenvolvedores clonam projeto e automaticamente herdam configurações.

---

## ⚠️ Limitações e Considerações

### Trade-offs

**Formatação Automática Agressiva:**
- **Vantagem:** Código sempre consistente
- **Desvantagem:** Pode reformatar código de forma não intuitiva (quebras de linha estranhas)

**Mitigação:** Ajustar code style para preferências da equipe. Usar comentários especiais para desabilitar formatação em trechos específicos:
```java
// @formatter:off
String sql = "SELECT * " +
             "FROM users " +
             "WHERE active = 1";
// @formatter:on
```

### Armadilhas

**Armadilha 1: Configurações Conflitantes**
EditorConfig e IDE code style podem conflitar. EditorConfig tem precedência.

**Solução:** Manter ambos sincronizados ou usar apenas EditorConfig.

**Armadilha 2: Sobrescrever Configurações de Projeto**
Configurações globais podem sobrescrever intencionalmente definidas no projeto.

**Solução:** Verificar hierarquia. Configurações de projeto devem ter precedência.

---

## 🔗 Interconexões Conceituais

### Relação com Code Style e Padrões

Configurações de code style implementam padrões como Google Java Style Guide, Oracle Code Conventions.

### Relação com Ferramentas de Build

Maven/Gradle podem incluir plugins de formatação (maven-checkstyle-plugin). Configurações IDE devem alinhar com essas ferramentas.

### Relação com CI/CD

Pipelines CI verificam formatação de código. Configurações IDE devem produzir código que passa checks de CI.

---

## 🚀 Evolução e Próximos Conceitos

### Configurações Avançadas

1. **Live Templates/Snippets:** Criar templates customizados para código repetitivo
2. **File Templates:** Customizar templates de criação de classes, interfaces
3. **Inspections Customizadas:** Criar regras de análise específicas do projeto
4. **Integração com SonarQube:** Conectar IDE a servidor SonarQube para análise contínua

### Próximos Passos

1. Instalação e configuração de ferramentas de build (Maven/Gradle)
2. Primeiro programa Hello World
3. Configuração de debugging
4. Integração com controle de versão (Git)

---

## 📚 Conclusão

A **configuração básica da IDE** é investimento que se paga multiplicadamente através de produtividade diária. Configurações adequadas de aparência (tema, fonte), editor (indentação, encoding), code style (formatação automática, organização de imports) e ferramentas (JDK, Maven, Git) transformam IDE de ferramenta genérica em **ambiente personalizado e otimizado**. Compartilhar configurações via arquivos versionados garante **consistência de equipe**. Dominar configuração da IDE escolhida é dominar o instrumento de trabalho — como músico afinando instrumento antes de performance.
