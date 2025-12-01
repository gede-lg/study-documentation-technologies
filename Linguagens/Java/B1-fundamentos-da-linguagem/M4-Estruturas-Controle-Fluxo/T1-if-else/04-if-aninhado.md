# if Aninhado

## 🎯 Introdução e Definição

### Definição Conceitual

**if aninhado** (ou **nested if**) ocorre quando uma estrutura `if`, `if-else`, ou `if-else-if` está **dentro de outra**. Permite criar **decisões hierárquicas** ou **multi-nível**, onde a execução de um bloco interno depende de múltiplas condições externas.

**Estrutura básica**:
```java
if (condiçãoExterna) {
    // Código executado se condiçãoExterna for true
    
    if (condiçãoInterna) {
        // Executado se AMBAS as condições forem true
    } else {
        // Executado se externa for true MAS interna for false
    }
}
```

**Analogia**: É como uma **árvore de decisões** - cada nível aprofunda a análise de uma situação.

**Exemplo fundamental**:
```java
int idade = 20;
boolean temCarteira = true;

if (idade >= 18) {
    // Primeiro nível: é maior de idade?
    
    if (temCarteira) {
        // Segundo nível: tem carteira?
        System.out.println("Pode dirigir");
    } else {
        System.out.println("Maior de idade, mas sem carteira");
    }
} else {
    System.out.println("Menor de idade");
}
```

**Importância**:
- ✅ Permite **decisões hierárquicas**
- ✅ Combina **múltiplas condições** de forma estruturada
- ✅ Útil quando **condições dependem** de outras
- ⚠️ **Reduz legibilidade** se profundo demais
- ⚠️ **Aumenta complexidade** ciclomática

---

## 📋 Sumário Conceitual

### Componentes do if Aninhado

**1. if externo**: Primeira condição avaliada
**2. if interno**: Condição avaliada SÓ SE externa for `true`
**3. Níveis de profundidade**: Quantos ifs dentro de ifs
**4. Indentação**: Crítica para legibilidade
**5. Escopo**: Variáveis em cada nível

**Sintaxe completa**:
```java
if (condição1) {
    // Nível 1
    
    if (condição2) {
        // Nível 2
        
        if (condição3) {
            // Nível 3
        }
    }
}
```

---

## 🧠 Fundamentos Teóricos

### 1. Anatomia do if Aninhado

**Estrutura de dois níveis**:
```java
if (condiçãoNível1) {
//  ┬
//  └───────────── Condição do primeiro nível (SEMPRE avaliada)
    
    // Código do nível 1
    
    if (condiçãoNível2) {
    //  ┬
    //  └───────── Condição do segundo nível (avaliada SÓ SE nível1 for true)
        
        // Código do nível 2 (executado se AMBAS as condições forem true)
    }
}
```

**Estrutura completa com else**:
```java
if (condiçãoExterna) {
    if (condiçãoInterna) {
        // A: externa true E interna true
    } else {
        // B: externa true MAS interna false
    }
} else {
    // C: externa false (interna NEM é avaliada)
}
```

### 2. Fluxo de Avaliação

**Diagrama de fluxo (2 níveis)**:
```
        ┌─────────┐
        │ Início  │
        └────┬────┘
             │
      ┌──────▼──────┐
      │if (externa) │
      └──┬───────┬──┘
    true │       │ false
         │       │
    ┌────▼─┐ ┌──▼────┐
    │Bloco │ │ else  │
    │antes │ │externa│
    └────┬─┘ └───────┘
         │
  ┌──────▼──────┐
  │if (interna) │
  └──┬───────┬──┘
true │       │ false
     │       │
┌────▼─┐ ┌──▼────┐
│Bloco │ │ else  │
│interno│ │interna│
└──────┘ └───────┘
```

**Passo a passo**:
```java
int x = 15;
int y = 25;

System.out.println("1. Início");

if (x > 10) {
    System.out.println("2. x > 10 (true)");
    
    if (y > 20) {
        System.out.println("3. y > 20 (true)");
    } else {
        System.out.println("X. y <= 20 (NÃO executado)");
    }
    
    System.out.println("4. Fim do if externo");
} else {
    System.out.println("X. x <= 10 (NÃO executado)");
}

System.out.println("5. Fim");

// Saída:
// 1. Início
// 2. x > 10 (true)
// 3. y > 20 (true)
// 4. Fim do if externo
// 5. Fim
```

### 3. Níveis de Profundidade

**1 nível (não aninhado)**:
```java
if (condicao) {
    statement;
}
```

**2 níveis**:
```java
if (condicao1) {
    if (condicao2) {
        statement;
    }
}
```

**3 níveis**:
```java
if (condicao1) {
    if (condicao2) {
        if (condicao3) {
            statement;
        }
    }
}
```

**⚠️ Máximo recomendado: 2-3 níveis** (além disso, refatore!)

### 4. if Aninhado vs Operadores Lógicos

**if aninhado**:
```java
if (idade >= 18) {
    if (temCarteira) {
        System.out.println("Pode dirigir");
    }
}
```

**Equivalente com &&**:
```java
if (idade >= 18 && temCarteira) {
    System.out.println("Pode dirigir");
}
```

**Quando usar cada um?**

| Situação | Preferir |
|----------|----------|
| Condições simples E independentes | `&&` |
| Ações diferentes em cada nível | if aninhado |
| Muitas condições (3+) | `&&` |
| Processamento intermediário | if aninhado |

**Exemplo onde aninhamento é melhor**:
```java
// ✅ if aninhado: ações em cada nível
if (usuario != null) {
    System.out.println("Usuário existe");  // Ação no nível 1
    
    if (usuario.isAtivo()) {
        System.out.println("E está ativo");  // Ação no nível 2
    }
}

// ❌ && não permite ação intermediária
if (usuario != null && usuario.isAtivo()) {
    System.out.println("Usuário existe e está ativo");
    // Não há ponto para "Usuário existe mas inativo"
}
```

### 5. Padrão: Validação em Cascata

**Validação multi-nível**:
```java
if (entrada != null) {
    if (!entrada.isEmpty()) {
        if (entrada.length() >= 3) {
            if (entrada.matches("[a-zA-Z]+")) {
                System.out.println("Entrada válida");
            } else {
                System.out.println("Deve conter apenas letras");
            }
        } else {
            System.out.println("Deve ter no mínimo 3 caracteres");
        }
    } else {
        System.out.println("Não pode ser vazio");
    }
} else {
    System.out.println("Entrada nula");
}
```

**Alternativa com guard clauses** (melhor):
```java
if (entrada == null) {
    System.out.println("Entrada nula");
    return;
}
if (entrada.isEmpty()) {
    System.out.println("Não pode ser vazio");
    return;
}
if (entrada.length() < 3) {
    System.out.println("Deve ter no mínimo 3 caracteres");
    return;
}
if (!entrada.matches("[a-zA-Z]+")) {
    System.out.println("Deve conter apenas letras");
    return;
}

System.out.println("Entrada válida");
```

### 6. if-else Aninhado

**Estrutura com else em cada nível**:
```java
if (salario > 10000) {
    if (anosEmpresa > 5) {
        nivel = "Sênior A";
    } else {
        nivel = "Sênior B";
    }
} else {
    if (anosEmpresa > 3) {
        nivel = "Pleno A";
    } else {
        nivel = "Júnior";
    }
}
```

**Tabela de decisão**:
| salario > 10000 | anosEmpresa > 5 | Resultado |
|-----------------|-----------------|-----------|
| true | true | Sênior A |
| true | false | Sênior B |
| false | true | Pleno A |
| false | false | Júnior |

### 7. if-else-if Aninhado

**Combina encadeamento com aninhamento**:
```java
if (tipo.equals("ADMIN")) {
    if (ativo) {
        permissoes = "TODAS";
    } else {
        permissoes = "NENHUMA";
    }
} else if (tipo.equals("MODERADOR")) {
    if (ativo) {
        permissoes = "MODERADAS";
    } else {
        permissoes = "SOMENTE_LEITURA";
    }
} else {
    permissoes = "BASICAS";
}
```

### 8. Indentação e Legibilidade

**⚠️ Indentação é CRÍTICA**:

```java
// ❌ Mal indentado: ilegível
if (a) {
if (b) {
if (c) {
statement;
}
}
}

// ✅ Bem indentado: clara hierarquia
if (a) {
    if (b) {
        if (c) {
            statement;
        }
    }
}
```

**Regra**: Cada nível adiciona **4 espaços** (ou 1 tab).

### 9. Escopo em if Aninhado

**Variáveis declaradas em cada nível**:
```java
if (x > 0) {
    int a = 10;  // Visível apenas neste bloco e nos blocos internos
    
    if (y > 0) {
        int b = 20;  // Visível apenas neste bloco interno
        System.out.println(a + b);  // OK: "a" visível aqui
    }
    
    // System.out.println(b);  // ERRO: "b" não visível aqui
}
// System.out.println(a);  // ERRO: "a" não visível aqui
```

### 10. Exemplos Práticos Completos

#### **Verificação de Elegibilidade para Empréstimo**

```java
public void verificarEmprestimo(int idade, double renda, int score) {
    if (idade >= 18) {
        System.out.println("Idade OK");
        
        if (renda >= 2000) {
            System.out.println("Renda OK");
            
            if (score >= 700) {
                System.out.println("Score OK");
                System.out.println("✅ EMPRÉSTIMO APROVADO");
            } else if (score >= 500) {
                System.out.println("Score razoável");
                System.out.println("⚠️ EMPRÉSTIMO COM JUROS MAIORES");
            } else {
                System.out.println("Score baixo");
                System.out.println("❌ EMPRÉSTIMO NEGADO");
            }
        } else {
            System.out.println("Renda insuficiente");
            System.out.println("❌ EMPRÉSTIMO NEGADO");
        }
    } else {
        System.out.println("Menor de idade");
        System.out.println("❌ EMPRÉSTIMO NEGADO");
    }
}
```

#### **Sistema de Descontos com Múltiplos Critérios**

```java
public double calcularDesconto(double valor, boolean isPremium, boolean temCupom) {
    double desconto = 0;
    
    if (isPremium) {
        // Cliente premium: descontos maiores
        if (valor >= 1000) {
            desconto = 0.25;  // 25%
        } else if (valor >= 500) {
            desconto = 0.20;  // 20%
        } else {
            desconto = 0.15;  // 15%
        }
        
        if (temCupom) {
            // Cupom adicional para premium
            desconto += 0.05;  // +5%
        }
    } else {
        // Cliente regular: descontos menores
        if (valor >= 1000) {
            desconto = 0.15;  // 15%
        } else if (valor >= 500) {
            desconto = 0.10;  // 10%
        } else {
            desconto = 0.05;  // 5%
        }
        
        if (temCupom) {
            // Cupom para regular
            desconto += 0.03;  // +3%
        }
    }
    
    return desconto;
}
```

#### **Controle de Acesso Hierárquico**

```java
public void verificarAcesso(Usuario usuario, String recurso) {
    if (usuario != null) {
        if (usuario.isAtivo()) {
            if (usuario.isAdmin()) {
                System.out.println("Acesso TOTAL ao recurso: " + recurso);
            } else {
                // Não é admin: verificar permissão específica
                if (usuario.hasPermissao(recurso)) {
                    System.out.println("Acesso permitido ao recurso: " + recurso);
                } else {
                    System.out.println("Sem permissão para: " + recurso);
                }
            }
        } else {
            System.out.println("Usuário inativo");
        }
    } else {
        System.out.println("Usuário não autenticado");
    }
}
```

#### **Classificação de Triângulos**

```java
public String classificarTriangulo(int a, int b, int c) {
    // Verifica se é triângulo válido
    if (a + b > c && a + c > b && b + c > a) {
        // É triângulo: classificar tipo
        if (a == b && b == c) {
            return "Equilátero";
        } else if (a == b || a == c || b == c) {
            return "Isósceles";
        } else {
            return "Escaleno";
        }
    } else {
        return "Não é triângulo";
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Quando Usar if Aninhado?

**✅ Use if aninhado quando**:
1. **Ações diferentes** em cada nível de decisão
2. **Processamento intermediário** é necessário
3. **Dependências claras** entre condições (B só faz sentido se A for true)
4. **Contextos hierárquicos** (país → estado → cidade)

**❌ EVITE if aninhado quando**:
1. Condições são **independentes** (use `&&`)
2. Profundidade > **2-3 níveis** (refatore)
3. Apenas **validação** (use guard clauses)
4. Muitas condições **do mesmo tipo** (use if-else-if ou switch)

### Complexidade Ciclomática

**Complexidade ciclomática** = número de caminhos independentes no código.

```java
// Complexidade = 4 (4 caminhos possíveis)
if (a) {          // +1
    if (b) {      // +1
        path1();
    } else {
        path2();
    }
} else {
    if (c) {      // +1
        path3();
    } else {
        path4();
    }
}
```

**Meta**: Complexidade ≤ 10 (idealmente ≤ 5)

### if Aninhado vs Guard Clauses

**❌ if aninhado profundo**:
```java
public void processar(String valor) {
    if (valor != null) {
        if (!valor.isEmpty()) {
            if (valor.length() >= 3) {
                // Processamento
            }
        }
    }
}
```

**✅ Guard clauses (early return)**:
```java
public void processar(String valor) {
    if (valor == null) return;
    if (valor.isEmpty()) return;
    if (valor.length() < 3) return;
    
    // Processamento
}
```

**Vantagens de guard clauses**:
- ✅ Menos indentação
- ✅ Mais legível
- ✅ Fácil adicionar validações
- ✅ Reduz complexidade percebida

---

## 🎯 Aplicabilidade e Contextos

### 1. **Autorização Multi-Nível**

```java
if (usuario.isLogado()) {
    if (usuario.isAtivo()) {
        if (usuario.isPago() || recurso.isGratuito()) {
            liberarAcesso();
        }
    }
}
```

### 2. **Validação de Dados Complexos**

```java
if (data != null) {
    if (data.isAfter(LocalDate.now())) {
        if (data.isBefore(limiteFuturo)) {
            dataValida();
        }
    }
}
```

### 3. **Processamento Condicional em Etapas**

```java
if (arquivo.exists()) {
    System.out.println("Arquivo encontrado");
    
    if (arquivo.canRead()) {
        System.out.println("Arquivo legível");
        processarArquivo(arquivo);
    } else {
        System.out.println("Sem permissão de leitura");
    }
} else {
    System.out.println("Arquivo não existe");
}
```

### 4. **Cálculos com Regras Hierárquicas**

```java
if (isWeekend) {
    if (isHoliday) {
        taxa = 2.5;  // Final de semana + feriado
    } else {
        taxa = 2.0;  // Apenas final de semana
    }
} else {
    taxa = 1.0;  // Dia de semana
}
```

### 5. **Classificação Hierárquica**

```java
if (pais.equals("Brasil")) {
    if (estado.equals("SP")) {
        if (cidade.equals("São Paulo")) {
            zona = "Capital";
        } else {
            zona = "Interior SP";
        }
    } else {
        zona = "Outro estado";
    }
} else {
    zona = "Internacional";
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Profundidade Excessiva (Arrow Code)**

```java
// ❌ "Arrow code": difícil de ler
if (a) {
    if (b) {
        if (c) {
            if (d) {
                if (e) {
                    statement;  // Muito profundo!
                }
            }
        }
    }
}

// ✅ Guard clauses
if (!a) return;
if (!b) return;
if (!c) return;
if (!d) return;
if (!e) return;

statement;
```

### 2. **Esquecer else em Nível Intermediário**

```java
// ⚠️ Sem else: caso não tratado
if (usuario != null) {
    if (usuario.isAtivo()) {
        processar();
    }
    // E se usuário NÃO for ativo? Nada acontece!
}

// ✅ Com else: todos os casos tratados
if (usuario != null) {
    if (usuario.isAtivo()) {
        processar();
    } else {
        System.out.println("Usuário inativo");
    }
} else {
    System.out.println("Usuário nulo");
}
```

### 3. **Indentação Incorreta**

```java
// ❌ Indentação enganosa
if (a)
if (b)
    statement1;
else
    statement2;  // else pertence ao if(b), NÃO ao if(a)!

// ✅ Sempre use chaves
if (a) {
    if (b) {
        statement1;
    } else {
        statement2;  // Claro que pertence ao if(b)
    }
}
```

### 4. **Variáveis Não Inicializadas**

```java
// ❌ Variável pode não ser inicializada
String resultado;
if (a) {
    if (b) {
        resultado = "AB";
    }
    // Se b for false, resultado não é inicializada!
}
// System.out.println(resultado);  // ERRO!

// ✅ Garanta inicialização
String resultado = "Padrão";
if (a) {
    if (b) {
        resultado = "AB";
    }
}
System.out.println(resultado);  // OK
```

### 5. **NullPointerException em Níveis Internos**

```java
// ❌ Pode lançar NullPointerException
if (usuario.isAtivo()) {
    if (usuario.getEndereco().getCidade().equals("SP")) {  // NPE se getEndereco() for null
        // ...
    }
}

// ✅ Verificações de null em cada nível
if (usuario != null && usuario.isAtivo()) {
    Endereco endereco = usuario.getEndereco();
    if (endereco != null) {
        String cidade = endereco.getCidade();
        if ("SP".equals(cidade)) {
            // ...
        }
    }
}
```

### 6. **Condições Redundantes**

```java
// ❌ Segunda condição é redundante
if (x > 10) {
    if (x > 5) {  // Sempre true se x > 10!
        statement;
    }
}

// ✅ Apenas condição necessária
if (x > 10) {
    statement;
}
```

---

## 🔗 Interconexões Conceituais

### Relacionamento com Outros Conceitos

- **Operadores lógicos (&&, ||)**: Alternativa para condições independentes
- **Guard clauses**: Alternativa para validações
- **if-else-if**: Alternativa para condições mutuamente exclusivas
- **switch**: Alternativa para valores constantes
- **Polimorfismo**: Alternativa OO para tipos
- **Escopo de variáveis**: Cada nível tem seu escopo
- **Complexidade ciclomática**: Aninhamento aumenta complexidade
- **Code smells**: Profundidade > 3 é "arrow code"

---

## 🚀 Boas Práticas

### 1. ✅ Limite Profundidade (máximo 2-3 níveis)

```java
// ✅ Máximo 2-3 níveis
if (a) {
    if (b) {
        if (c) {  // 3 níveis OK
            statement;
        }
    }
}

// ❌ Profundidade excessiva (4+ níveis)
if (a) {
    if (b) {
        if (c) {
            if (d) {  // 4 níveis: refatore!
                statement;
            }
        }
    }
}
```

### 2. ✅ Prefira Guard Clauses para Validação

```java
// ✅ Guard clauses
public void processar(Usuario usuario) {
    if (usuario == null) return;
    if (!usuario.isAtivo()) return;
    if (!usuario.isPago()) return;
    
    // Processamento
}

// ❌ if aninhado para validação
public void processar(Usuario usuario) {
    if (usuario != null) {
        if (usuario.isAtivo()) {
            if (usuario.isPago()) {
                // Processamento
            }
        }
    }
}
```

### 3. ✅ Use && Quando Não Houver Ações Intermediárias

```java
// ✅ && simples
if (idade >= 18 && temCarteira) {
    dirigir();
}

// ❌ Aninhamento desnecessário
if (idade >= 18) {
    if (temCarteira) {
        dirigir();
    }
}
```

### 4. ✅ Extraia Métodos para Condições Complexas

```java
// ✅ Métodos descritivos
if (isUsuarioValido(usuario)) {
    if (isRecursoDisponivel(recurso)) {
        processar();
    }
}

private boolean isUsuarioValido(Usuario u) {
    return u != null && u.isAtivo() && u.isPago();
}

private boolean isRecursoDisponivel(Recurso r) {
    return r != null && r.isAtivo() && r.hasEstoque();
}
```

### 5. ✅ Sempre Use Chaves

```java
// ✅ Sempre chaves
if (a) {
    if (b) {
        statement;
    }
}

// ❌ Sem chaves: perigoso
if (a)
    if (b)
        statement;
```

### 6. ✅ Indentação Consistente

```java
// ✅ 4 espaços por nível
if (a) {
    if (b) {
        if (c) {
            statement;
        }
    }
}
```

### 7. ✅ Comentários em Estruturas Complexas

```java
if (usuario.isAtivo()) {
    // Usuário ativo: verificar permissões
    
    if (usuario.hasPermissao("ADMIN")) {
        // Admin: acesso total
        liberarTudo();
    } else {
        // Não-admin: acesso limitado
        liberarLimitado();
    }
}
```

### 8. ✅ Evite else Após return

```java
// ✅ Sem else após return
if (a) {
    if (b) {
        return "AB";
    }
    return "A apenas";
}
return "Nenhum";

// ❌ else desnecessário
if (a) {
    if (b) {
        return "AB";
    } else {
        return "A apenas";
    }
} else {
    return "Nenhum";
}
```

### 9. ✅ Use Variáveis Temporárias Descritivas

```java
// ✅ Variáveis descritivas
boolean isAdulto = idade >= 18;
boolean temHabilitacao = carteira != null && carteira.isValida();

if (isAdulto) {
    if (temHabilitacao) {
        dirigir();
    }
}
```

### 10. ✅ Teste Todos os Caminhos

```java
@Test
void testIfAninhado() {
    // true-true
    assertTrue(processar(true, true));
    
    // true-false
    assertFalse(processar(true, false));
    
    // false-true
    assertFalse(processar(false, true));
    
    // false-false
    assertFalse(processar(false, false));
}
```

---

## 📚 Resumo

**if aninhado** ocorre quando uma estrutura `if` está **dentro de outra**, criando **decisões hierárquicas** ou **multi-nível**. Permite combinar múltiplas condições onde cada nível interno **depende** da condição externa ser verdadeira. É útil quando há **ações diferentes** em cada nível ou **processamento intermediário** necessário. **Limite a profundidade** a 2-3 níveis para manter legibilidade; além disso, **refatore** usando **guard clauses** (early return), **operadores lógicos** (`&&`), ou **extração de métodos**. Sempre use **chaves** `{}` e **indentação consistente** (4 espaços por nível). Para **validações em cascata**, prefira **guard clauses** (if-return). Para condições **independentes** sem ações intermediárias, use **&&** em vez de aninhamento. O aninhamento aumenta a **complexidade ciclomática**; evite "arrow code" (profundidade > 3) que dificulta manutenção.

