# M9 - Arrays Fundamentos

## 📚 Visão Geral

Este módulo consolida **todos os conceitos fundamentais sobre arrays em JavaScript**, unificando os antigos M12 (Arrays Básicos), M13 (Métodos de Modificação) e M14 (Métodos de Acesso e Busca) em uma estrutura completa e progressiva.

## 🎯 Objetivo

Fornecer compreensão sólida dos **fundamentos de arrays**, incluindo criação, acesso, manipulação, métodos de modificação e métodos de busca, preparando para conceitos funcionais avançados.

## 📋 Estrutura do Módulo

### Bloco 1: Fundamentos (Arquivos 01-04)

**01. Criação de Arrays**
- Sintaxe literal []
- Array() constructor
- Array.of() e Array.from()
- Arrays multidimensionais

**02. Índices e Acesso a Elementos**
- Indexação baseada em zero
- Acesso via colchetes
- Acesso a índices negativos (inexistente nativamente)
- Boundary checking

**03. Propriedade Length**
- Leitura e modificação
- Truncar arrays alterando length
- Expandir arrays
- Length vs elementos reais

**04. Arrays Esparsos**
- Conceito de slots vazios
- Diferença entre undefined e vazio
- Comportamento de métodos com arrays esparsos
- Quando ocorrem

### Bloco 2: Métodos de Modificação (Arquivos 05-10)

**05. push() e pop()**
- Adicionar ao final (push)
- Remover do final (pop)
- Retorno dos métodos
- Stack (pilha) com arrays

**06. shift() e unshift()**
- Adicionar ao início (unshift)
- Remover do início (shift)
- Performance considerations
- Queue (fila) com arrays

**07. splice()**
- Método mais versátil de modificação
- Remover, adicionar e substituir elementos
- Sintaxe e parâmetros
- Valor de retorno (elementos removidos)

**08. sort()**
- Ordenação in-place
- Sort alfabético padrão
- Função comparadora customizada
- Ordenação numérica correta

**09. reverse()**
- Inversão in-place
- Retorno do array invertido
- Não cria cópia

**10. fill()**
- Preencher com valor estático
- Parâmetros start e end
- Uso em inicialização
- Referências vs valores primitivos

### Bloco 3: Métodos de Acesso e Busca (Arquivos 11-16)

**11. indexOf() e lastIndexOf()**
- Busca de elemento (primeiro e último)
- Comparação por igualdade estrita
- Retorno de índice ou -1
- Limitações com objetos e NaN

**12. includes()**
- Verificação booleana de existência
- Diferença para indexOf
- Funciona com NaN
- From index opcional

**13. find() e findIndex()**
- Busca com predicado (função)
- Diferença entre find e findIndex
- Retorno de elemento ou índice
- Retorno undefined/-1 se não encontrar

**14. slice()**
- Extração de subarray (cópia superficial)
- Não modifica original
- Parâmetros start e end
- Índices negativos

**15. concat()**
- Concatenação de arrays
- Não modifica originais
- Aceita múltiplos argumentos
- Shallow copy

**16. join()**
- Conversão para string
- Separador customizável
- Comportamento com elementos vazios/undefined
- Integração com split()

## 🔗 Pré-requisitos

- M3: Tipos Primitivos Completo
- M4: Operadores Completo
- M5: Estruturas Condicionais
- M6: Estruturas de Repetição

## 🎓 Habilidades Desenvolvidas

Após completar este módulo, você será capaz de:

- ✅ Criar e manipular arrays com confiança
- ✅ Utilizar métodos de modificação apropriadamente
- ✅ Buscar e acessar elementos eficientemente
- ✅ Compreender mutabilidade vs imutabilidade
- ✅ Escolher métodos adequados para cada situação
- ✅ Evitar armadilhas comuns (sort sem comparador, etc.)

## 🚀 Próximos Passos

Após dominar este módulo, você estará preparado para:

- **M10: Arrays Iteração Funcional** - map, filter, reduce, forEach
- **M11: Objetos Fundamentos** - Estruturas de dados complementares

## 📊 Consolidação

Este módulo é resultado da consolidação de:
- **M12-arrays-basicos** (4 arquivos)
- **M13-metodos-modificacao-arrays** (6 arquivos)
- **M14-metodos-acesso-busca-arrays** (6 arquivos)

**Total:** 16 arquivos organizados sequencialmente + README

---

**Última atualização:** 2025-01-13
**Status:** Consolidado e atualizado
