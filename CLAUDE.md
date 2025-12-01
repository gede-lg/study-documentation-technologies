# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Visão Geral do Repositório

Este é um **repositório de estudos pessoais** contendo anotações técnicas detalhadas sobre desenvolvimento de software. O conteúdo é organizado em arquivos Markdown seguindo uma estrutura pedagógica específica.

## Estrutura do Repositório

```
Study/
├── Linguagens/           # Linguagens de programação (Javascript, Java, CSS, etc.)
│   └── <linguagem>/
│       └── MX-<modulo>/  # Módulos numerados (M1, M2, M3...)
├── Frameworks/           # Frameworks (Flutter, ReactJS, Angular, Spring Boot)
│   └── <framework>/
│       └── MX-<modulo>/
├── Tecnologias/          # Tecnologias auxiliares (Testes, Build Tools, Infra, Mensageria)
├── AI Context/           # Prompts e configurações para geração de conteúdo
├── UML/                  # Diagramas UML
└── _OLD/                 # Conteúdo antigo arquivado
```

## Padrões de Nomenclatura

- **Módulos**: Sempre seguir o padrão `MX-<nome-modulo>` onde X é o número do módulo
  - ✅ Correto: `M1-introducao`, `M2-fundamentos`
  - ❌ Incorreto: `modulo-1-introducao`, `Módulo 1 - Introdução`

- **Arquivos**: Usar kebab-case para nomes de arquivos e sempre numerado `.md`
  - Exemplo: `01-historia-evolucao.md`

## Padrões de Caminhos de Arquivo

**CRÍTICO**: Sempre usar **caminhos absolutos completos do Windows** com letra de unidade e barras invertidas para TODAS as operações de arquivo:

- ✅ Correto: `G:\Meu Drive\Study\Linguagens\Javascript\M1-introducao\arquivo.md`
- ❌ Incorreto: `./Linguagens/Javascript/M1-introducao/arquivo.md`
- ❌ Incorreto: `Linguagens/Javascript/M1-introducao/arquivo.md`

## Estrutura Padrão dos Arquivos de Estudo

Cada arquivo `.md` de conteúdo educacional segue uma estrutura específica com 80% teoria e 20% exemplos práticos:

### Seções Obrigatórias

1. **🎯 Introdução e Definição**
   - Definição conceitual clara
   - Contexto histórico e motivação
   - Problema que resolve
   - Importância no ecossistema

2. **📋 Sumário Conceitual**
   - Aspectos teóricos centrais organizados
   - Pilares fundamentais
   - Visão geral das nuances

3. **🧠 Fundamentos Teóricos**
   - Como funciona internamente
   - Princípios e conceitos subjacentes
   - Relação com outros conceitos
   - Modelo mental para compreensão

4. **🔍 Análise Conceitual Profunda**
   - Sintaxe básica
   - Mergulho teórico em cada aspecto
   - Explicação extensa de comportamentos
   - Exemplos de código ilustrativos
   - Diferenças conceituais entre variações

5. **🎯 Aplicabilidade e Contextos**
   - Quando usar cada abordagem
   - Cenários ideais
   - Raciocínio por trás das escolhas técnicas

6. **⚠️ Limitações e Considerações Teóricas**
   - Restrições conceituais e de uso
   - Trade-offs e compromissos
   - Armadilhas comuns

7. **🔗 Interconexões Conceituais**
   - Relação com outros tópicos
   - Dependências conceituais
   - Progressão lógica de aprendizado

8. **🚀 Evolução e Próximos Conceitos**
   - Desenvolvimento natural do entendimento
   - Conceitos que se constroem sobre este

## Diretrizes para Criação/Edição de Conteúdo

### Abordagem Pedagógica

- **80% Teoria**: Explicações conceituais profundas e extensas, fundamentos, quando usar, por que existe, como funciona internamente
- **20% Código**: Exemplos práticos para ilustrar pontos teóricos específicos
- **Foco em Compreensão**: Priorizar entendimento conceitual sobre memorização sintática
- **Exemplos em Português**: Quando possível, usar nomes de variáveis e comentários em português brasileiro

### Estilo de Escrita

- Explicações minuciosas e detalhadas
- Usar analogias elaboradas para conceitos abstratos
- Foco no "porquê" mais que no "como"
- Desenvolver modelos mentais claros
- Respostas extensas são encorajadas (20.000-25.000 caracteres)

### Exemplos de Código

- Sempre devem ter explicação conceitual ANTES do código
- Código deve ilustrar conceitos, não ser o foco principal
- Incluir comentários explicativos
- Mostrar sintaxe básica e sintaxe de uso

## Sistema de Geração de Conteúdo

O diretório `AI Context/` contém arquivos que definem como gerar conteúdo automatizado:

- **`prompt.md`**: Template detalhado para geração de explicações técnicas
- **`comando.md`**: Instruções para automação de criação de conteúdo
- **`grade-curricular.md`**: Grade de estudos estruturada
- **`exemplo-resposta.md`**: Exemplo de resposta formatada corretamente

Ao gerar conteúdo, sempre consultar esses arquivos para manter consistência.

## Ferramenta Obsidian

Este repositório é gerenciado com **Obsidian** (pasta `.obsidian/` presente). Os arquivos são otimizados para visualização nesta ferramenta, incluindo:

- Plugins: Excalidraw, Calendar, Kanban
- Links internos entre documentos
- Tags e metadados

## Tecnologias Cobertas

### Linguagens Principais
- **Javascript**: Estrutura modular completa (M1-M6 em andamento)
- **Java**: Conteúdo legacy em `_OLD/`
- **Typescript, Dart, Go, C#, CSS, HTML, SQL, SCSS**

### Frameworks Principais
- **ReactJS**: 31 módulos (M1-M31) cobrindo fundamentos até DevOps
- **Flutter**: Grade curricular completa com widgets e CLI
- **Angular, Spring Boot**: Conteúdo em desenvolvimento

### Tecnologias Auxiliares
- **Cypress**: Testes E2E
- **Build Tools, Infra, Mensageria**: Em expansão

## Comandos Comuns

**Não há comandos de build/test** pois este é um repositório de documentação, não de código executável.

### Navegação e Busca

```bash
# Encontrar todos os arquivos de um módulo específico
find "./Linguagens/Javascript/M1-introducao-setup" -name "*.md"

# Buscar por conceito específico em todos os arquivos
grep -r "closure" "./Linguagens/Javascript"

# Listar estrutura de módulos de uma tecnologia
ls -la "./Frameworks/ReactJS"
```

## Arquitetura de Conteúdo

### Hierarquia de Aprendizado

O conteúdo segue progressão pedagógica:
1. **M1**: Sempre introdução/fundamentos/setup
2. **M2+**: Conceitos em ordem crescente de complexidade
3. **Módulos Finais**: Tópicos avançados, integração, patterns

### Interconexões

- Arquivos referenciam conceitos de módulos anteriores
- Links entre tecnologias relacionadas (ex: Javascript → ReactJS)
- Grade curricular define pré-requisitos implícitos

### Padrão de Grade Curricular

Cada tecnologia pode ter um arquivo `Grade Curricular.md` listando:
- Estrutura completa de módulos
- Tópicos e subtópicos
- Recursos de estudo externos
- Ordem recomendada de aprendizado
