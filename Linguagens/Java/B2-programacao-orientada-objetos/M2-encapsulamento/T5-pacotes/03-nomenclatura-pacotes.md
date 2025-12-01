# T5.03 - Convenção de Nomenclatura para Pacotes

## Introdução

**Nomenclatura de pacotes** segue convenções estritas para garantir **consistência**, **legibilidade** e **evitar conflitos**.

**Regras principais**:
- **Lowercase** (letras minúsculas)
- **Domínio invertido** (com.empresa, br.gov)
- **Sem underscores ou hífens**
- **Nomes descritivos**

---

## Fundamentos

### 1. Domínio Invertido

**Padrão**: Inverter domínio da empresa/organização.

```java
// Empresa: empresa.com.br
package br.com.empresa.ecommerce;

// GitHub: github.com/usuario/projeto
package com.github.usuario.projeto;

// Apache: apache.org
package org.apache.commons;

// Oracle: oracle.com
package com.oracle.jdbc;
```

**Por quê?**
- **Unicidade global**: Evita conflitos entre projetos
- **Hierarquia clara**: Domínio → empresa → projeto
- **Padrão internacional**

### 2. Lowercase (Letras Minúsculas)

**Convenção**: Pacotes sempre em **minúsculas**.

```java
// ✅ Correto
package br.com.empresa.ecommerce.modelo;

// ❌ Errado
package Br.Com.Empresa.Ecommerce.Modelo;
package br.com.Empresa.Ecommerce;
```

**Razão**: Classes usam PascalCase, pacotes lowercase → diferenciação clara.

### 3. Sem Underscores ou Hífens

**Convenção**: Nomes contínuos, sem separadores.

```java
// ✅ Correto
package br.com.empresa.ecommerce;
package br.com.empresa.gestaoestoque;

// ❌ Evitar
package br.com.empresa.e_commerce;
package br.com.empresa.gestao_estoque;

// ❌ Inválido (hífen causa erro de sintaxe)
package br.com.empresa.e-commerce; // ERRO
```

**Exceção**: Se domínio tem hífen, substituir por nome sem hífen.

```java
// Domínio: empresa-x.com
package com.empresax.projeto; // Remover hífen
```

### 4. Palavras Compostas

**Sem separador**, juntar palavras:

```java
// ✅ Correto
package br.com.empresa.gestaoestoque;
package br.com.empresa.controleacesso;
package br.com.empresa.relatoriovendas;

// ❌ Evitar
package br.com.empresa.gestao.estoque;  // Muito profundo
package br.com.empresa.gestao_estoque; // Underscore
```

**Legibilidade**: Se nome ficar confuso, dividir em níveis:

```java
// Melhor legibilidade
package br.com.empresa.gestao.estoque;
package br.com.empresa.controle.acesso;
```

### 5. Níveis Hierárquicos

**Estrutura recomendada**: 3-5 níveis.

```java
// ✅ Ideal (4 níveis)
package br.com.empresa.ecommerce;

// ✅ Bom (5 níveis)
package br.com.empresa.ecommerce.modelo;

// ❌ Excessivo (8 níveis)
package br.com.empresa.divisao.setor.departamento.sistema.ecommerce.modelo;

// ❌ Muito raso (2 níveis)
package br.empresa; // Falta contexto
```

**Regra**: Profundidade suficiente para organização, sem excesso.

### 6. Evitar Palavras Reservadas Java

**Não usar**: `int`, `class`, `public`, `private`, `if`, etc.

```java
// ❌ Evitar
package br.com.empresa.public;   // 'public' é palavra-chave
package br.com.empresa.class;    // 'class' é palavra-chave
package br.com.empresa.int;      // 'int' é palavra-chave

// ✅ Alternativas
package br.com.empresa.publico;
package br.com.empresa.classes;
package br.com.empresa.inteiro;
```

### 7. Nomes Descritivos e Específicos

**Evitar nomes genéricos**:

```java
// ❌ Genérico demais
package br.com.empresa.util;
package br.com.empresa.comum;
package br.com.empresa.outros;

// ✅ Específico
package br.com.empresa.ecommerce.validacao;
package br.com.empresa.ecommerce.formatacao;
package br.com.empresa.ecommerce.notificacao;
```

### 8. Organização por Camadas vs Funcionalidades

**Camadas** (MVC):

```java
package br.com.empresa.ecommerce.controller;
package br.com.empresa.ecommerce.service;
package br.com.empresa.ecommerce.repository;
package br.com.empresa.ecommerce.model;
```

**Funcionalidades** (DDD):

```java
package br.com.empresa.ecommerce.usuario;
package br.com.empresa.ecommerce.produto;
package br.com.empresa.ecommerce.pedido;
```

**Híbrido**:

```java
package br.com.empresa.ecommerce.usuario.model;
package br.com.empresa.ecommerce.usuario.service;
package br.com.empresa.ecommerce.produto.model;
```

### 9. Exemplos de Nomenclatura Real

**Spring Framework**:
```java
org.springframework.boot
org.springframework.context
org.springframework.web.servlet
```

**Google Guava**:
```java
com.google.common.collect
com.google.common.base
com.google.common.io
```

**Apache Commons**:
```java
org.apache.commons.lang3
org.apache.commons.collections4
```

**Padrão**:
- Domínio invertido (`org.springframework`, `com.google`)
- Projeto/biblioteca (`boot`, `common`)
- Módulo/contexto (`servlet`, `collect`, `lang3`)

### 10. Nomenclatura para Testes

**Teste no mesmo pacote** (src/test/java):

```java
// Produção: src/main/java
package br.com.empresa.ecommerce.service;
public class UsuarioService {}

// Teste: src/test/java (mesmo pacote)
package br.com.empresa.ecommerce.service;
public class UsuarioServiceTest {}
```

**Vantagem**: Acesso a membros package-private.

---

## Aplicabilidade

**Domínio invertido quando**:
- Projeto profissional
- Biblioteca pública
- Código compartilhado

**Simplificado quando**:
- Protótipo pessoal
- Aprendizado

```java
// Aprendizado
package aprendizado.ecommerce;

// Produção
package br.com.empresa.ecommerce;
```

---

## Armadilhas

### 1. Maiúsculas em Pacote

```java
// ❌
package Br.Com.Empresa.Ecommerce;

// ✅
package br.com.empresa.ecommerce;
```

### 2. Underscores

```java
// ❌
package br.com.empresa.e_commerce;

// ✅
package br.com.empresa.ecommerce;
```

### 3. Hierarquia Excessiva

```java
// ❌ 10 níveis
package br.com.empresa.divisao.setor.area.sistema.modulo.componente;

// ✅ 5 níveis
package br.com.empresa.ecommerce.modelo;
```

---

## Boas Práticas

### 1. Lowercase Sempre

```java
package br.com.empresa.ecommerce.modelo;
```

### 2. Domínio Invertido

```java
// Empresa: empresa.com.br
package br.com.empresa;
```

### 3. 3-5 Níveis

```java
package br.com.empresa.ecommerce.service;
```

### 4. Nomes Descritivos

```java
package br.com.empresa.ecommerce.notificacao;
```

### 5. Consistência no Projeto

**Escolha organização** (camadas ou funcionalidades) e **mantenha**.

```java
// Se usar camadas, manter em todo projeto
package br.com.empresa.ecommerce.controller;
package br.com.empresa.ecommerce.service;
package br.com.empresa.ecommerce.repository;
```

---

## Resumo

**Convenções de nomenclatura**:

**Regras**:
1. **Lowercase**: Apenas minúsculas
2. **Domínio invertido**: `br.com.empresa`
3. **Sem underscores/hífens**: `ecommerce`
4. **3-5 níveis**: Hierarquia equilibrada
5. **Nomes descritivos**: `validacao`, não `util`

**Estrutura típica**:
```java
package [domínio].[empresa].[projeto].[módulo];
//      br.com    .empresa .ecommerce.modelo
```

**Exemplos**:
```java
package br.com.empresa.ecommerce.modelo;
package com.github.usuario.projeto.util;
package org.apache.commons.lang3;
```

**Regra de Ouro**: **Lowercase + domínio invertido + nomes específicos** = nomenclatura profissional.
