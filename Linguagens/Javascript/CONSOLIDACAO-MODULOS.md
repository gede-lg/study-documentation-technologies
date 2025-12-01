# Plano de Consolidação - Grade Curricular JavaScript

## 📊 Resumo da Consolidação

**DE:** 44 módulos → **PARA:** 27 módulos
**Redução:** 17 módulos (38,6%)
**Conteúdo perdido:** ZERO (apenas reorganizado)

---

## 🗺️ Mapeamento Completo: Módulo Antigo → Módulo Novo

### BLOCO 1: FUNDAMENTOS (M1-M8)

| Novo                             | Antigo                                                                                                         | Ação        | Descrição                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------- |
| **M1-introducao-setup**          | M1-introducao-setup                                                                                            | ✅ MANTER   | Sem alterações                                  |
| **M2-variaveis-declaracoes**     | M2-variaveis-declaracoes                                                                                       | ✅ MANTER   | Sem alterações                                  |
| **M3-tipos-primitivos-completo** | M3-tipos-primitivos<br>M4-trabalhando-com-numbers<br>M5-trabalhando-com-strings<br>M6-trabalhando-com-booleans | 🔄 FUNDIR   | Consolidar todo conteúdo sobre tipos primitivos |
| **M4-operadores-completo**       | M7-operadores-fundamentais<br>M8-operadores-avancados                                                          | 🔄 FUNDIR   | Unificar operadores fundamentais e avançados    |
| **M5-estruturas-condicionais**   | M9-estruturas-condicionais                                                                                     | 📝 RENOMEAR | Renumerar de M9→M5                              |
| **M6-estruturas-repeticao**      | M10-estruturas-repeticao                                                                                       | 📝 RENOMEAR | Renumerar de M10→M6                             |
| **M7-tratamento-de-erros**       | M11-tratamento-de-erros                                                                                        | 📝 RENOMEAR | Renumerar de M11→M7                             |
| **M8-expressoes-regulares**      | M22-expressoes-regulares                                                                                       | 📝 RENOMEAR | Renumerar de M22→M8                             |

---

### BLOCO 2: ESTRUTURAS DE DADOS (M9-M12)

| Novo                              | Antigo                                                                                  | Ação      | Descrição                                           |
| --------------------------------- | --------------------------------------------------------------------------------------- | --------- | --------------------------------------------------- |
| **M9-arrays-fundamentos**         | M12-arrays-basicos<br>M13-metodos-modificacao-arrays<br>M14-metodos-acesso-busca-arrays | 🔄 FUNDIR | Arrays básicos, modificação, acesso e busca         |
| **M10-arrays-iteracao-funcional** | M15-iteracao-arrays<br>M16-metodos-funcionais-arrays                                    | 🔄 FUNDIR | Iteração + métodos funcionais (map, filter, reduce) |
| **M11-objetos-fundamentos**       | M17-objetos-basicos<br>M18-metodos-this-objetos<br>M19-propriedades-avancadas-objetos   | 🔄 FUNDIR | Objetos básicos, this, propriedades avançadas       |
| **M12-objetos-avancados**         | M20-iteracao-objetos<br>M21-metodos-object-avancados                                    | 🔄 FUNDIR | Iteração + Object methods + descriptors             |

---

### BLOCO 3: FUNÇÕES (M13-M15)

| Novo                              | Antigo                                     | Ação        | Descrição                                 |
| --------------------------------- | ------------------------------------------ | ----------- | ----------------------------------------- |
| **M13-funcoes-fundamentos**       | M23-funcoes-basicas<br>M25-arrow-functions | 🔄 FUNDIR   | Declarações, expressions, arrow functions |
| **M14-funcoes-escopo-closure**    | M24-escopo-closure-retorno                 | 📝 RENOMEAR | Renumerar de M24→M14                      |
| **M15-funcoes-padroes-avancados** | M26-padroes-avancados-funcoes              | 📝 RENOMEAR | Renumerar de M26→M15                      |

---

### BLOCO 4: ASSINCRONIA (M16-M18)

| Novo                            | Antigo                                                   | Ação        | Descrição                               |
| ------------------------------- | -------------------------------------------------------- | ----------- | --------------------------------------- |
| **M16-assincronia-event-loop**  | M27-fundamentos-assincronia                              | 📝 RENOMEAR | Renumerar de M27→M16                    |
| **M17-assincronia-promises**    | M28-callbacks-promises-basicas<br>M29-promises-avancadas | 🔄 FUNDIR   | Callbacks, Promises básicas e avançadas |
| **M18-assincronia-async-await** | M30-async-await                                          | 📝 RENOMEAR | Renumerar de M30→M18                    |

---

### BLOCO 5: OOP E MÓDULOS (M19-M20)

| Novo                                | Antigo                                        | Ação        | Descrição                            |
| ----------------------------------- | --------------------------------------------- | ----------- | ------------------------------------ |
| **M19-orientacao-objetos-completo** | M31-orientacao-objetos-es5<br>M32-classes-es6 | 🔄 FUNDIR   | OOP ES5 (prototypes) + ES6 (classes) |
| **M20-modulos-es6**                 | M33-modulos-es6                               | 📝 RENOMEAR | Renumerar de M33→M20                 |

---

### BLOCO 6: FEATURES ES6+ AVANÇADAS (M21-M23)

| Novo                               | Antigo                                                                    | Ação      | Descrição                                         |
| ---------------------------------- | ------------------------------------------------------------------------- | --------- | ------------------------------------------------- |
| **M21-sintaxe-moderna-es6**        | M34-destructuring<br>M35-spread-operator<br>M36-template-literals-symbols | 🔄 FUNDIR | Destructuring, spread, template literals, symbols |
| **M22-estruturas-dados-avancadas** | M37-iterators-generators<br>M38-map-set-collections                       | 🔄 FUNDIR | Iterators, Generators, Map, Set, WeakMap          |
| **M23-metaprogramacao-completo**   | M39-proxy-reflect<br>M40-meta-programming-json                            | 🔄 FUNDIR | Proxy, Reflect, JSON, metaprogramação             |

---

### BLOCO 7: PERFORMANCE E BROWSER (M24-M25)

| Novo                       | Antigo                                                            | Ação                      | Descrição                                      |
| -------------------------- | ----------------------------------------------------------------- | ------------------------- | ---------------------------------------------- |
| **M24-performance-memory** | M41-memory-performance-browser-apis (parcial)                     | 📝 RENOMEAR<br>🔄 DIVIDIR | Memory leaks, GC, performance.now(), profiling |
| **M25-browser-apis-dom**   | M41-memory-performance-browser-apis (parcial)<br>M42-web-apis-dom | 🔄 FUNDIR                 | fetch, URL, Intl, DOM, Web APIs, Observers     |

---

### BLOCO 8: DESIGN PATTERNS E PROJETO (M26-M27)

| Novo                               | Antigo                         | Ação        | Descrição            |
| ---------------------------------- | ------------------------------ | ----------- | -------------------- |
| **M26-design-patterns**            | M43-design-patterns            | 📝 RENOMEAR | Renumerar de M43→M26 |
| **M27-projeto-pratico-integrador** | M44-projeto-pratico-integrador | 📝 RENOMEAR | Renumerar de M44→M27 |

---

## 📋 Checklist de Execução

### Fase 1: Preparação

- [ ] Fazer backup completo da pasta `Linguagens/Javascript/`
- [ ] Criar branch Git para consolidação (se usar Git)
- [ ] Documentar estrutura atual

### Fase 2: Consolidações (Fusões)

- [ ] **M3**: Fundir M3+M4+M5+M6 → tipos-primitivos-completo
- [ ] **M4**: Fundir M7+M8 → operadores-completo
- [ ] **M9**: Fundir M12+M13+M14 → arrays-fundamentos
- [ ] **M10**: Fundir M15+M16 → arrays-iteracao-funcional
- [ ] **M11**: Fundir M17+M18+M19 → objetos-fundamentos
- [ ] **M12**: Fundir M20+M21 → objetos-avancados
- [ ] **M13**: Fundir M23+M25 → funcoes-fundamentos
- [ ] **M17**: Fundir M28+M29 → assincronia-promises
- [ ] **M19**: Fundir M31+M32 → orientacao-objetos-completo
- [ ] **M21**: Fundir M34+M35+M36 → sintaxe-moderna-es6
- [ ] **M22**: Fundir M37+M38 → estruturas-dados-avancadas
- [ ] **M23**: Fundir M39+M40 → metaprogramacao-completo
- [ ] **M25**: Fundir M41(parcial)+M42 → browser-apis-dom

### Fase 3: Renomeações

- [ ] M9→M5, M10→M6, M11→M7, M22→M8
- [ ] M24→M14, M26→M15
- [ ] M27→M16, M30→M18
- [ ] M33→M20
- [ ] M41→M24, M43→M26, M44→M27

### Fase 4: Limpeza

- [ ] Remover módulos vazios/antigos
- [ ] Verificar links internos entre módulos
- [ ] Atualizar referências em arquivos README

### Fase 5: Documentação

- [ ] Atualizar `grade-curricular.md` com nova estrutura
- [ ] Criar arquivo `CHANGELOG-CONSOLIDACAO.md`
- [ ] Atualizar README principal do Javascript

---

## 🔄 Como Executar uma Fusão (Exemplo: M3)

### Exemplo Prático: M3-tipos-primitivos-completo

**Pastas origem:**

- `M3-tipos-primitivos/`
- `M4-trabalhando-com-numbers/`
- `M5-trabalhando-com-strings/`
- `M6-trabalhando-com-booleans/`

**Pasta destino:**

- `M3-tipos-primitivos-completo/`

**Passos:**

1. Criar nova pasta `M3-tipos-primitivos-completo/`
2. Copiar conteúdo de `M3-tipos-primitivos/` para destino
3. Adicionar seções do M4 (numbers) como novos arquivos numerados
4. Adicionar seções do M5 (strings) como novos arquivos numerados
5. Adicionar seções do M6 (booleans) como novos arquivos numerados
6. Criar arquivo `README.md` resumindo estrutura do módulo
7. Verificar numeração sequencial (01, 02, 03...)
8. Deletar pastas M4, M5, M6 originais

**Estrutura sugerida:**

```
M3-tipos-primitivos-completo/
├── 01-visao-geral-tipos.md
├── 02-number-criacao-literais.md
├── 03-number-metodos-conversoes.md
├── 04-number-operacoes-matematicas.md
├── 05-string-criacao-manipulacao.md
├── 06-string-metodos-essenciais.md
├── 07-string-template-literals.md
├── 08-boolean-truthy-falsy.md
├── 09-boolean-conversoes.md
├── 10-undefined-null.md
├── 11-symbol-bigint.md
└── README.md
```

---

## ⚠️ Atenção Especial

### Módulos que Exigem Divisão de Conteúdo

**M41 → M24 + M25**

O conteúdo de M41 precisa ser dividido:

**Para M24-performance-memory:**

- `01-memory-leaks.md`
- `02-garbage-collection.md`
- `03-performance-now.md`
- `04-microtasks-macrotasks.md`
- `05-profiling-conceitos-basicos.md`
- `06-browser-vs-nodejs-differences.md`

**Para M25-browser-apis-dom:**

- `07-settimeout-setinterval-revisited.md`
- `08-fetch-api-basics.md`
- `09-url-api.md`
- `10-intl-api-basics.md`
- - Todo conteúdo de M42-web-apis-dom

---

## 📊 Estatísticas Finais

### Por Tipo de Ação

- **Mantidos sem alteração:** 2 módulos (M1, M2)
- **Renomeados (só número):** 9 módulos
- **Fundidos (2+ módulos):** 13 grupos de fusão
- **Divididos:** 1 módulo (M41)

### Por Bloco

- **Fundamentos:** 8 módulos (redução de 11)
- **Estruturas de Dados:** 4 módulos (redução de 10)
- **Funções:** 3 módulos (redução de 4)
- **Assincronia:** 3 módulos (redução de 4)
- **OOP e Módulos:** 2 módulos (redução de 3)
- **Features Avançadas:** 3 módulos (redução de 7)
- **Performance:** 2 módulos (redução de 2)
- **Projeto:** 2 módulos (redução de 2)

**Total:** 27 módulos (de 44)

---

## 🚀 Próximos Passos

1. Revisar este documento
2. Confirmar estrutura desejada
3. Executar consolidações gradualmente (1 bloco por vez)
4. Testar links e referências após cada bloco
5. Atualizar documentação final

**Estimativa de tempo:** 4-6 horas para consolidação completa

---

**Criado em:** 2025-01-13
**Versão:** 1.0
**Status:** Aguardando execução
