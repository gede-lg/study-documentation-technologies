# M10 - Arrays Iteração Funcional

## 📚 Visão Geral

Este módulo consolida **conceitos de iteração e programação funcional com arrays**, unificando os antigos M15 (Iteração Arrays) e M16 (Métodos Funcionais Arrays) em uma progressão completa desde loops tradicionais até paradigma funcional.

## 🎯 Objetivo

Dominar **todos os métodos de iteração** em arrays, desde loops imperativos até métodos funcionais (map, filter, reduce), compreendendo quando e como aplicar cada abordagem.

## 📋 Estrutura do Módulo

### Bloco 1: Iteração Imperativa (Arquivos 01-04)

**01. For Tradicional**
- Sintaxe clássica for(i=0; i<arr.length; i++)
- Controle total sobre iteração
- Break e continue
- Performance e casos de uso

**02. For...of**
- Iteração sobre valores (ES6)
- Sintaxe limpa e legível
- Diferença entre for...of e for...in
- Iterables

**03. forEach()**
- Método de iteração funcional básico
- Callback com element, index, array
- Não retorna valor (undefined)
- Impossibilidade de break

**04. Comparação de Métodos de Iteração**
- For vs for...of vs forEach
- Performance comparativa
- Quando usar cada um
- Trade-offs

### Bloco 2: Programação Funcional (Arquivos 05-12)

**05. Conceito de Funções de Alta Ordem**
- Funções que recebem/retornam funções
- Callbacks e predicados
- Imutabilidade
- Paradigma declarativo vs imperativo

**06. map()**
- Transformação de elementos
- Retorna novo array (mesmo tamanho)
- Imutabilidade
- Casos de uso

**07. filter()**
- Filtragem por predicado
- Retorna novo array (tamanho menor ou igual)
- Imutabilidade
- Casos de uso

**08. reduce() e reduceRight()**
- Redução/agregação de array
- Acumulador e valor inicial
- Casos avançados (flatten, groupBy, etc.)
- reduceRight (direita para esquerda)

**09. flatMap()**
- map() + flat() combinados
- Mapeamento com achatamento
- Performance vs map().flat()
- Casos de uso

**10. some() e every()**
- Verificações booleanas
- some: pelo menos um satisfaz
- every: todos satisfazem
- Short-circuit evaluation

**11. Encadeamento de Métodos (Method Chaining)**
- Composição de transformações
- Pipeline de dados
- Legibilidade vs performance
- Boas práticas

**12. Comparação Loops Tradicionais vs Funcionais**
- Quando usar for vs métodos funcionais
- Performance considerations
- Legibilidade e manutenibilidade
- Paradigmas

## 🔗 Pré-requisitos

- M9: Arrays Fundamentos
- M13: Funções Fundamentos (recomendado)

## 🎓 Habilidades Desenvolvidas

Após completar este módulo, você será capaz de:

- ✅ Escolher método de iteração apropriado para cada situação
- ✅ Utilizar métodos funcionais (map, filter, reduce) com maestria
- ✅ Compor transformações com method chaining
- ✅ Escrever código declarativo e imutável
- ✅ Compreender trade-offs entre abordagens
- ✅ Aplicar paradigma funcional em JavaScript

## 🚀 Próximos Passos

Após dominar este módulo, você estará preparado para:

- **M11: Objetos Fundamentos** - Trabalhar com estruturas mais complexas
- **M13: Funções Fundamentos** - Aprofundar em callbacks e closures
- Programação funcional avançada

## 📊 Consolidação

Este módulo é resultado da consolidação de:
- **M15-iteracao-arrays** (4 arquivos)
- **M16-metodos-funcionais-arrays** (8 arquivos selecionados)

**Total:** 12 arquivos organizados sequencialmente + README

**Nota:** Alguns arquivos do M16 foram omitidos por duplicação com M9 (find, sort, reverse, concat, includes, join já estão em Arrays Fundamentos).

---

**Última atualização:** 2025-01-13
**Status:** Consolidado e atualizado
