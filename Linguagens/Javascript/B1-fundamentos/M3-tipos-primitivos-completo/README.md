# M3 - Tipos Primitivos Completo

## 📚 Visão Geral

Este módulo consolida **todo o conteúdo sobre tipos primitivos em JavaScript**, unificando os antigos M3 (Tipos Primitivos), M4 (Trabalhando com Numbers), M5 (Trabalhando com Strings) e M6 (Trabalhando com Booleans) em uma estrutura coesa e completa.

## 🎯 Objetivo

Fornecer compreensão profunda e completa dos **7 tipos primitivos** do JavaScript (Number, String, Boolean, undefined, null, Symbol, BigInt), incluindo seus fundamentos teóricos, características únicas, métodos, conversões e aplicações práticas.

## 📋 Estrutura do Módulo

### Bloco 1: Number (Arquivos 01-06)

**01. Visão Geral - Number**
- Conceito de tipo numérico
- Representação IEEE 754
- Características fundamentais
- Contexto histórico

**02. Number - Operações Aritméticas**
- Operadores aritméticos aplicados
- Cálculos matemáticos
- Precedência e associatividade
- Casos práticos

**03. Number - Valores Especiais**
- Infinity e -Infinity
- NaN (Not-a-Number)
- Number.MAX_VALUE e MIN_VALUE
- Tratamento de edge cases

**04. Number - Métodos**
- toFixed(), toPrecision(), toExponential()
- toString() com bases numéricas
- Number.isNaN(), isFinite(), isInteger()
- Métodos estáticos vs instância

**05. Number - Precisão de Ponto Flutuante**
- Limitações do IEEE 754
- Problemas de arredondamento
- Comparações seguras (epsilon)
- Soluções e workarounds

**06. Number - Conversões**
- Number(), parseInt(), parseFloat()
- Coerção implícita vs explícita
- Operador unário +
- Armadilhas comuns

### Bloco 2: String (Arquivos 07-13)

**07. Visão Geral - String**
- Conceito de string
- Imutabilidade
- Unicode e UTF-16
- Características fundamentais

**08. String - Criação**
- Aspas simples, duplas e template literals
- String() constructor
- Strings vazias
- Diferenças entre formas de criação

**09. String - Escape de Caracteres**
- Sequências de escape (\n, \t, \\, etc.)
- Unicode escapes (\uXXXX)
- Caracteres especiais
- Boas práticas

**10. String - Propriedade Length**
- Contagem de caracteres
- Diferença entre length e caracteres visuais
- Emojis e caracteres compostos
- Limitações

**11. String - Métodos**
- charAt(), charCodeAt(), codePointAt()
- indexOf(), lastIndexOf(), includes()
- slice(), substring(), substr()
- toLowerCase(), toUpperCase()
- trim(), trimStart(), trimEnd()

**12. String - Template Literals**
- Sintaxe com backticks
- Interpolação de expressões (${})
- Multiline strings
- Tagged templates

**13. String - Métodos Avançados**
- split(), join() (integração com arrays)
- repeat(), padStart(), padEnd()
- startsWith(), endsWith()
- match(), matchAll(), search(), replace()
- Expressões regulares básicas

### Bloco 3: Boolean (Arquivos 14-17)

**14. Visão Geral - Boolean**
- Conceito de valor lógico
- true e false
- Contexto em estruturas de controle
- Importância na programação

**15. Boolean - Criação de Valores**
- Literais booleanos
- Boolean() constructor
- Operadores de comparação
- Expressões lógicas

**16. Boolean - Truthy e Falsy**
- Os 8 valores falsy
- Todos os demais são truthy
- Coerção em contextos booleanos
- Casos contraintuitivos

**17. Boolean - Conversões**
- Conversão explícita (Boolean(), !!)
- Conversão implícita (if, while, &&, ||)
- Regras de coerção por tipo
- Boas práticas

### Bloco 4: Tipos Especiais (Arquivos 18-21)

**18. undefined**
- Significado e conceito
- Variáveis não inicializadas
- Parâmetros ausentes
- Retorno de funções
- Diferença entre undefined e "não definido"

**19. null**
- Conceito de ausência intencional
- Diferença entre null e undefined
- typeof null (quirk histórico)
- Quando usar null

**20. Symbol**
- Conceito de identificador único
- Symbol() vs Symbol.for()
- Symbols conhecidos (well-known symbols)
- Casos de uso (propriedades privadas, iteradores)

**21. BigInt**
- Conceito de inteiros arbitrariamente grandes
- Sintaxe com 'n' sufixo
- Limitações e conversões
- Operações matemáticas com BigInt
- Quando usar BigInt

## 🔗 Pré-requisitos

- M1: Introdução e Setup
- M2: Variáveis e Declarações

## 🎓 Habilidades Desenvolvidas

Após completar este módulo, você será capaz de:

- ✅ Compreender profundamente os 7 tipos primitivos do JavaScript
- ✅ Trabalhar com números incluindo valores especiais e precisão
- ✅ Manipular strings com confiança usando métodos apropriados
- ✅ Dominar conversões entre tipos (coerção)
- ✅ Entender truthy/falsy e seu impacto em lógica condicional
- ✅ Utilizar tipos modernos (Symbol, BigInt) quando apropriado
- ✅ Evitar armadilhas comuns relacionadas a tipos primitivos

## 🚀 Próximos Passos

Após dominar este módulo, você estará preparado para:

- **M4: Operadores Completo** - Aplicar operadores nos tipos primitivos
- **M5: Estruturas Condicionais** - Usar truthy/falsy em condições
- **M11: Objetos Fundamentos** - Contrastar primitivos com objetos

## 📊 Consolidação

Este módulo é resultado da consolidação de:
- **M3-tipos-primitivos** (7 arquivos)
- **M4-trabalhando-com-numbers** (5 arquivos)
- **M5-trabalhando-com-strings** (6 arquivos)
- **M6-trabalhando-com-booleans** (4 arquivos - 2 foram realocados para M4)

**Total:** 21 arquivos organizados sequencialmente + README

---

**Última atualização:** 2025-01-13
**Status:** Consolidado e atualizado
