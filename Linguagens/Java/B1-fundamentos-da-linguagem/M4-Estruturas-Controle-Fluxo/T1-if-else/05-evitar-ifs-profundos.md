# Evitar ifs Profundos

## 🎯 Introdução e Definição

### Definição Conceitual

**Evitar ifs profundos** (também chamado de **evitar arrow code** ou **combater pirâmide da morte**) refere-se ao conjunto de **técnicas e padrões** para reduzir o aninhamento excessivo de estruturas condicionais, melhorando **legibilidade**, **manutenção** e **testabilidade** do código.

**Problema: Arrow Code (Código em Flecha)**:
```java
// ❌ "Arrow code": código se desloca para a direita como uma flecha
if (user != null) {
    if (user.isActive()) {
        if (user.hasPermission("ADMIN")) {
            if (user.isPaid()) {
                if (user.getEmail() != null) {
                    // Lógica profunda (5 níveis!)
                }
            }
        }
    }
}
```

**Solução: Código Plano**:
```java
// ✅ Código plano: fácil de ler
if (user == null) return;
if (!user.isActive()) return;
if (!user.hasPermission("ADMIN")) return;
if (!user.isPaid()) return;
if (user.getEmail() == null) return;

// Lógica no mesmo nível (0 aninhamentos!)
```

**Importância**:
- ✅ **Legibilidade**: Código mais fácil de entender
- ✅ **Manutenção**: Mais fácil modificar e corrigir
- ✅ **Testabilidade**: Mais fácil testar todos os caminhos
- ✅ **Reduz bugs**: Menos erros de lógica
- ✅ **Complexidade ciclomática**: Reduz complexidade do código

---

## 📋 Sumário Conceitual

### Sinais de ifs Profundos

**1. Profundidade > 3 níveis**: Mais de 3 ifs aninhados
**2. Arrow code**: Código se desloca para a direita
**3. Muitos else**: Múltiplos else aninhados
**4. Dificuldade de leitura**: Difícil entender fluxo
**5. Complexidade alta**: Complexidade ciclomática > 10

**Técnicas de refatoração**:
1. **Guard Clauses** (cláusulas de guarda)
2. **Early Return** (retorno antecipado)
3. **Extract Method** (extração de método)
4. **Inversão de Condições**
5. **Operadores Lógicos** (&&, ||)
6. **Polimorfismo**
7. **Strategy Pattern**
8. **Lookup Tables/Map**
9. **Optional** (Java 8+)
10. **Decomposição de Métodos**

---

## 🧠 Fundamentos Teóricos

### 1. O Problema: Arrow Code (Pirâmide da Morte)

**Exemplo clássico**:
```java
public void processar(Usuario usuario, Pedido pedido) {
    if (usuario != null) {
        if (usuario.isAtivo()) {
            if (usuario.isPago()) {
                if (pedido != null) {
                    if (pedido.hasItens()) {
                        if (pedido.getValor() > 0) {
                            if (pedido.getEndereco() != null) {
                                // Lógica aqui (7 níveis de indentação!)
                                processarPedido(pedido);
                            } else {
                                System.out.println("Endereço inválido");
                            }
                        } else {
                            System.out.println("Valor inválido");
                        }
                    } else {
                        System.out.println("Pedido vazio");
                    }
                } else {
                    System.out.println("Pedido nulo");
                }
            } else {
                System.out.println("Usuário não pago");
            }
        } else {
            System.out.println("Usuário inativo");
        }
    } else {
        System.out.println("Usuário nulo");
    }
}
```

**Problemas**:
- ❌ **28 linhas** para lógica simples
- ❌ **7 níveis** de indentação
- ❌ **Lógica principal** está no fundo
- ❌ **Difícil** identificar condições de erro
- ❌ **Complexidade ciclomática** = 8

### 2. Técnica 1: Guard Clauses (Cláusulas de Guarda)

**Definição**: Verificar condições de **erro/saída** no **início** do método e retornar imediatamente.

**Refatoração do exemplo anterior**:
```java
public void processar(Usuario usuario, Pedido pedido) {
    // Guard clauses: validações no início
    if (usuario == null) {
        System.out.println("Usuário nulo");
        return;
    }
    if (!usuario.isAtivo()) {
        System.out.println("Usuário inativo");
        return;
    }
    if (!usuario.isPago()) {
        System.out.println("Usuário não pago");
        return;
    }
    if (pedido == null) {
        System.out.println("Pedido nulo");
        return;
    }
    if (!pedido.hasItens()) {
        System.out.println("Pedido vazio");
        return;
    }
    if (pedido.getValor() <= 0) {
        System.out.println("Valor inválido");
        return;
    }
    if (pedido.getEndereco() == null) {
        System.out.println("Endereço inválido");
        return;
    }
    
    // Lógica principal: sem aninhamento!
    processarPedido(pedido);
}
```

**Vantagens**:
- ✅ **15 linhas** (redução de 46%)
- ✅ **0 aninhamentos** (era 7)
- ✅ **Lógica principal** no final (clara)
- ✅ **Condições de erro** visíveis no topo
- ✅ **Fácil adicionar** novas validações

### 3. Técnica 2: Early Return (Retorno Antecipado)

**Princípio**: Retorne o mais **cedo** possível quando o resultado é conhecido.

**Antes (if-else aninhado)**:
```java
public String getDesconto(Cliente cliente) {
    String desconto;
    
    if (cliente.isPremium()) {
        if (cliente.getCompras() > 10) {
            desconto = "30%";
        } else {
            desconto = "20%";
        }
    } else {
        if (cliente.getCompras() > 5) {
            desconto = "10%";
        } else {
            desconto = "5%";
        }
    }
    
    return desconto;
}
```

**Depois (early return)**:
```java
public String getDesconto(Cliente cliente) {
    if (cliente.isPremium() && cliente.getCompras() > 10) {
        return "30%";
    }
    if (cliente.isPremium()) {
        return "20%";
    }
    if (cliente.getCompras() > 5) {
        return "10%";
    }
    return "5%";
}
```

### 4. Técnica 3: Extract Method (Extração de Método)

**Princípio**: Extrair condições complexas para **métodos com nomes descritivos**.

**Antes**:
```java
if (user != null && user.isActive() && user.isPaid() && user.hasPermission("ADMIN")) {
    if (pedido != null && pedido.hasItens() && pedido.getValor() > 0) {
        processar();
    }
}
```

**Depois**:
```java
if (isUsuarioValido(user)) {
    if (isPedidoValido(pedido)) {
        processar();
    }
}

private boolean isUsuarioValido(Usuario user) {
    return user != null 
        && user.isActive() 
        && user.isPaid() 
        && user.hasPermission("ADMIN");
}

private boolean isPedidoValido(Pedido pedido) {
    return pedido != null 
        && pedido.hasItens() 
        && pedido.getValor() > 0;
}
```

**Ainda melhor com guard clauses**:
```java
if (!isUsuarioValido(user)) return;
if (!isPedidoValido(pedido)) return;

processar();
```

### 5. Técnica 4: Inversão de Condições

**Princípio**: Inverter condições para eliminar `else`.

**Antes**:
```java
if (value > 0) {
    // 10 linhas de código
} else {
    return;
}
```

**Depois**:
```java
if (value <= 0) {
    return;
}

// 10 linhas de código (sem aninhamento)
```

### 6. Técnica 5: Operadores Lógicos (&&, ||)

**Princípio**: Combinar múltiplas condições com operadores lógicos.

**Antes**:
```java
if (idade >= 18) {
    if (temCarteira) {
        if (!temMultas) {
            dirigir();
        }
    }
}
```

**Depois**:
```java
if (idade >= 18 && temCarteira && !temMultas) {
    dirigir();
}
```

**⚠️ Quando NÃO usar**: Se houver ações intermediárias em cada nível.

### 7. Técnica 6: Polimorfismo

**Princípio**: Usar herança/polimorfismo em vez de `if` para tipos.

**Antes**:
```java
if (animal instanceof Cachorro) {
    Cachorro c = (Cachorro) animal;
    c.latir();
} else if (animal instanceof Gato) {
    Gato g = (Gato) animal;
    g.miar();
} else if (animal instanceof Passaro) {
    Passaro p = (Passaro) animal;
    p.cantar();
}
```

**Depois**:
```java
animal.emitirSom();  // Cada classe implementa seu método
```

### 8. Técnica 7: Strategy Pattern

**Princípio**: Encapsular algoritmos/comportamentos em classes separadas.

**Antes**:
```java
if (tipo.equals("CREDITO")) {
    if (parcelas > 1) {
        if (valorParcela >= 100) {
            // Lógica complexa para crédito parcelado
        } else {
            // Lógica para crédito com parcelas pequenas
        }
    } else {
        // Lógica para crédito à vista
    }
} else if (tipo.equals("DEBITO")) {
    // Lógica para débito
} else if (tipo.equals("BOLETO")) {
    // Lógica para boleto
}
```

**Depois**:
```java
// Interface
interface FormaPagamento {
    void processar(double valor);
}

// Implementações
class PagamentoCredito implements FormaPagamento {
    public void processar(double valor) { /* ... */ }
}

class PagamentoDebito implements FormaPagamento {
    public void processar(double valor) { /* ... */ }
}

// Uso
FormaPagamento forma = formaFactory.criar(tipo);
forma.processar(valor);
```

### 9. Técnica 8: Lookup Tables/Map

**Princípio**: Usar `Map` para mapear valores a ações.

**Antes**:
```java
String mensagem;
if (codigo == 200) {
    mensagem = "OK";
} else if (codigo == 404) {
    mensagem = "Não encontrado";
} else if (codigo == 500) {
    mensagem = "Erro interno";
} else {
    mensagem = "Desconhecido";
}
```

**Depois**:
```java
Map<Integer, String> mensagens = Map.of(
    200, "OK",
    404, "Não encontrado",
    500, "Erro interno"
);

String mensagem = mensagens.getOrDefault(codigo, "Desconhecido");
```

**Para ações (não apenas valores)**:
```java
Map<String, Runnable> acoes = Map.of(
    "SALVAR", () -> salvar(),
    "DELETAR", () -> deletar(),
    "ATUALIZAR", () -> atualizar()
);

acoes.getOrDefault(comando, () -> System.out.println("Comando inválido")).run();
```

### 10. Técnica 9: Optional (Java 8+)

**Princípio**: Usar `Optional` para evitar verificações de `null`.

**Antes**:
```java
if (usuario != null) {
    Endereco endereco = usuario.getEndereco();
    if (endereco != null) {
        String cidade = endereco.getCidade();
        if (cidade != null) {
            System.out.println(cidade.toUpperCase());
        }
    }
}
```

**Depois**:
```java
Optional.ofNullable(usuario)
    .map(Usuario::getEndereco)
    .map(Endereco::getCidade)
    .ifPresent(cidade -> System.out.println(cidade.toUpperCase()));
```

### 11. Técnica 10: Decomposição de Métodos

**Princípio**: Dividir método grande em **métodos menores** e **coesos**.

**Antes (método monolítico)**:
```java
public void processar(Pedido pedido) {
    if (pedido != null) {
        if (pedido.hasItens()) {
            if (validarEstoque(pedido)) {
                if (validarPagamento(pedido)) {
                    if (validarEndereco(pedido)) {
                        // Calcular frete
                        // Aplicar desconto
                        // Gerar nota fiscal
                        // Enviar email
                    }
                }
            }
        }
    }
}
```

**Depois (métodos especializados)**:
```java
public void processar(Pedido pedido) {
    if (!validarPedido(pedido)) return;
    
    calcularFrete(pedido);
    aplicarDesconto(pedido);
    gerarNotaFiscal(pedido);
    enviarEmail(pedido);
}

private boolean validarPedido(Pedido pedido) {
    if (pedido == null) return false;
    if (!pedido.hasItens()) return false;
    if (!validarEstoque(pedido)) return false;
    if (!validarPagamento(pedido)) return false;
    if (!validarEndereco(pedido)) return false;
    return true;
}

private void calcularFrete(Pedido pedido) { /* ... */ }
private void aplicarDesconto(Pedido pedido) { /* ... */ }
private void gerarNotaFiscal(Pedido pedido) { /* ... */ }
private void enviarEmail(Pedido pedido) { /* ... */ }
```

---

## 🔍 Análise Conceitual Profunda

### Quando Aplicar Cada Técnica?

| Técnica | Quando Usar | Exemplo |
|---------|-------------|---------|
| **Guard Clauses** | Validações no início | Verificar null, parâmetros inválidos |
| **Early Return** | Resultado conhecido cedo | Cálculos condicionais, classificações |
| **Extract Method** | Condições complexas | Múltiplas verificações, regras de negócio |
| **Inversão** | if com else vazio | Inverter para eliminar else |
| **&&/\|\|** | Condições independentes | Múltiplas verificações simples |
| **Polimorfismo** | Verificação de tipos | instanceof, getClass() |
| **Strategy** | Algoritmos alternativos | Formas de pagamento, estratégias |
| **Map** | Mapeamento valor→ação | Códigos, comandos, estados |
| **Optional** | Cadeia de null-checks | Navegação de objetos, getters |
| **Decomposição** | Método muito grande | Processos complexos, workflows |

### Complexidade Ciclomática

**Definição**: Número de caminhos independentes no código.

**Cálculo**: M = E - N + 2P
- E = número de arestas
- N = número de nós
- P = componentes conectados

**Simplificado**: Conte os `if`, `else if`, `while`, `for`, `case`, `&&`, `||` e some 1.

**Exemplo**:
```java
// Complexidade = 5
public void exemplo(int x) {           // +1 (base)
    if (x > 0) {                       // +1
        if (x > 10) {                  // +1
            System.out.println("A");
        } else {                       // +1
            System.out.println("B");
        }
    } else {                           // +1
        System.out.println("C");
    }
}
```

**Metas de complexidade**:
- ✅ **1-5**: Simples, fácil de testar
- ⚠️ **6-10**: Moderado, considerar refatoração
- ❌ **11-20**: Alto, refatorar
- ❌ **21+**: Muito alto, reescrever

### Guard Clauses vs if-else

**Guard clauses**:
- ✅ Condições de **erro primeiro**
- ✅ **Retorno antecipado**
- ✅ **Lógica principal** sem aninhamento
- ✅ Fácil **adicionar validações**

**if-else**:
- ✅ Quando **ambos os caminhos** são igualmente importantes
- ✅ Quando há **processamento** em ambos os lados
- ✅ Quando **não pode retornar** cedo (ex: loop)

---

## 🎯 Aplicabilidade e Contextos

### 1. **Validação de Parâmetros**

**Antes**:
```java
public void criar(String nome, int idade) {
    if (nome != null && !nome.isEmpty()) {
        if (idade >= 0 && idade <= 120) {
            // Criar
        } else {
            throw new IllegalArgumentException("Idade inválida");
        }
    } else {
        throw new IllegalArgumentException("Nome inválido");
    }
}
```

**Depois**:
```java
public void criar(String nome, int idade) {
    if (nome == null || nome.isEmpty()) {
        throw new IllegalArgumentException("Nome inválido");
    }
    if (idade < 0 || idade > 120) {
        throw new IllegalArgumentException("Idade inválida");
    }
    
    // Criar
}
```

### 2. **Processamento Condicional**

**Antes**:
```java
if (arquivo.exists()) {
    if (arquivo.canRead()) {
        if (arquivo.length() > 0) {
            processar(arquivo);
        } else {
            log("Arquivo vazio");
        }
    } else {
        log("Sem permissão");
    }
} else {
    log("Arquivo não existe");
}
```

**Depois**:
```java
if (!arquivo.exists()) {
    log("Arquivo não existe");
    return;
}
if (!arquivo.canRead()) {
    log("Sem permissão");
    return;
}
if (arquivo.length() == 0) {
    log("Arquivo vazio");
    return;
}

processar(arquivo);
```

### 3. **Cálculos com Múltiplas Condições**

**Antes**:
```java
double desconto = 0;
if (cliente.isPremium()) {
    if (valor >= 1000) {
        desconto = 0.25;
    } else {
        if (valor >= 500) {
            desconto = 0.20;
        } else {
            desconto = 0.15;
        }
    }
} else {
    if (valor >= 500) {
        desconto = 0.10;
    } else {
        desconto = 0.05;
    }
}
```

**Depois**:
```java
double desconto = calcularDesconto(cliente, valor);

private double calcularDesconto(Cliente cliente, double valor) {
    if (cliente.isPremium()) {
        return calcularDescontoPremium(valor);
    }
    return calcularDescontoRegular(valor);
}

private double calcularDescontoPremium(double valor) {
    if (valor >= 1000) return 0.25;
    if (valor >= 500) return 0.20;
    return 0.15;
}

private double calcularDescontoRegular(double valor) {
    if (valor >= 500) return 0.10;
    return 0.05;
}
```

### 4. **Autorização/Permissões**

**Antes**:
```java
if (usuario != null) {
    if (usuario.isAtivo()) {
        if (usuario.hasRole("ADMIN") || usuario.hasRole("MODERADOR")) {
            if (recurso.isPublico() || usuario.isOwner(recurso)) {
                permitirAcesso();
            } else {
                negarAcesso();
            }
        } else {
            negarAcesso();
        }
    } else {
        negarAcesso();
    }
} else {
    negarAcesso();
}
```

**Depois**:
```java
if (!podeAcessar(usuario, recurso)) {
    negarAcesso();
    return;
}

permitirAcesso();

private boolean podeAcessar(Usuario usuario, Recurso recurso) {
    if (usuario == null) return false;
    if (!usuario.isAtivo()) return false;
    if (!usuario.hasRole("ADMIN") && !usuario.hasRole("MODERADOR")) return false;
    if (!recurso.isPublico() && !usuario.isOwner(recurso)) return false;
    return true;
}
```

### 5. **Workflow/Pipeline**

**Antes**:
```java
if (validarDados(pedido)) {
    if (verificarEstoque(pedido)) {
        if (processarPagamento(pedido)) {
            if (gerarNota(pedido)) {
                enviarEmail(pedido);
            }
        }
    }
}
```

**Depois**:
```java
if (!validarDados(pedido)) return;
if (!verificarEstoque(pedido)) return;
if (!processarPagamento(pedido)) return;
if (!gerarNota(pedido)) return;

enviarEmail(pedido);
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Não Usar Guard Clauses em Loops**

```java
// ❌ return em loop pode não funcionar como esperado
for (int i = 0; i < 10; i++) {
    if (condicao) {
        return;  // Sai do método, não apenas do loop!
    }
}

// ✅ Use continue ou break
for (int i = 0; i < 10; i++) {
    if (!condicao) {
        continue;  // Próxima iteração
    }
    // Processar
}
```

### 2. **Abusar de Early Return**

```java
// ❌ Muitos returns dificultam rastreamento
public int calcular(int x) {
    if (x == 1) return 10;
    if (x == 2) return 20;
    if (x == 3) return 30;
    // ... 20 mais ...
    if (x == 23) return 230;
    return 0;
}

// ✅ Use Map ou switch
private static final Map<Integer, Integer> VALORES = Map.of(
    1, 10, 2, 20, 3, 30  // ...
);

public int calcular(int x) {
    return VALORES.getOrDefault(x, 0);
}
```

### 3. **Extrair Métodos Triviais**

```java
// ❌ Método trivial: overhead desnecessário
private boolean isNotNull(Object obj) {
    return obj != null;
}

if (isNotNull(usuario)) { /* ... */ }

// ✅ Use condição diretamente
if (usuario != null) { /* ... */ }
```

### 4. **Inverter Condições Complexas**

```java
// ❌ Inversão confusa
if (!(x > 0 && y < 10 || z == 5)) {
    return;
}

// ✅ Mantenha condição positiva e use else
if (x > 0 && y < 10 || z == 5) {
    // Lógica
} else {
    return;
}
```

### 5. **Polimorfismo para Casos Simples**

```java
// ❌ Overhead para 2 casos
interface Calculadora { double calcular(double x); }
class CalcA implements Calculadora { /* ... */ }
class CalcB implements Calculadora { /* ... */ }

// ✅ if-else simples
if (tipo.equals("A")) {
    return x * 2;
} else {
    return x + 10;
}
```

---

## 🔗 Interconexões Conceituais

- **Complexidade ciclomática**: Aninhamento aumenta complexidade
- **SOLID**: Single Responsibility, Open/Closed
- **Clean Code**: Código limpo, legível
- **Refatoração**: Melhoria contínua do código
- **Code Smells**: Arrow code é smell
- **Testes**: Código plano é mais testável
- **Manutenibilidade**: Menos aninhamento = mais fácil manter

---

## 🚀 Boas Práticas

### 1. ✅ Máximo 2-3 Níveis de Aninhamento

```java
// ✅ Máximo 2 níveis
if (a) {
    if (b) {
        processar();
    }
}

// ❌ 4+ níveis: refatore!
if (a) {
    if (b) {
        if (c) {
            if (d) {
                processar();
            }
        }
    }
}
```

### 2. ✅ Use Guard Clauses para Validações

```java
// ✅ Validações no início
public void processar(String valor) {
    if (valor == null) return;
    if (valor.isEmpty()) return;
    if (valor.length() < 3) return;
    
    // Processar
}
```

### 3. ✅ Extraia Condições Complexas

```java
// ✅ Métodos descritivos
if (isElegivelParaDesconto(cliente, compra)) {
    aplicarDesconto();
}

private boolean isElegivelParaDesconto(Cliente c, Compra comp) {
    return c.isPremium() && comp.getValor() > 500;
}
```

### 4. ✅ Prefira && para Condições Independentes

```java
// ✅ && simples
if (idade >= 18 && temCarteira && !temMultas) {
    dirigir();
}

// ❌ Aninhamento desnecessário
if (idade >= 18) {
    if (temCarteira) {
        if (!temMultas) {
            dirigir();
        }
    }
}
```

### 5. ✅ Use Polimorfismo para Tipos

```java
// ✅ Polimorfismo
animal.emitirSom();

// ❌ if para tipos
if (animal instanceof Cachorro) {
    ((Cachorro) animal).latir();
} else if (animal instanceof Gato) {
    ((Gato) animal).miar();
}
```

### 6. ✅ Use Map para Mapeamentos

```java
// ✅ Map
Map<Integer, String> STATUS = Map.of(
    200, "OK",
    404, "Not Found",
    500, "Error"
);
String msg = STATUS.getOrDefault(codigo, "Unknown");

// ❌ if-else-if longo
if (codigo == 200) msg = "OK";
else if (codigo == 404) msg = "Not Found";
else if (codigo == 500) msg = "Error";
else msg = "Unknown";
```

### 7. ✅ Use Optional para Null-Safety

```java
// ✅ Optional
Optional.ofNullable(usuario)
    .map(Usuario::getEndereco)
    .map(Endereco::getCidade)
    .ifPresent(System.out::println);

// ❌ Aninhamento de null-checks
if (usuario != null) {
    Endereco end = usuario.getEndereco();
    if (end != null) {
        String cidade = end.getCidade();
        if (cidade != null) {
            System.out.println(cidade);
        }
    }
}
```

### 8. ✅ Decomponha Métodos Grandes

```java
// ✅ Métodos pequenos e coesos
public void processar(Pedido p) {
    validar(p);
    calcular(p);
    persistir(p);
    notificar(p);
}

// ❌ Método monolítico com 10 ifs aninhados
public void processar(Pedido p) {
    if (...) {
        if (...) {
            // 50 linhas
        }
    }
}
```

### 9. ✅ Use SonarQube/Checkstyle

Ferramentas que detectam:
- Complexidade ciclomática alta
- Profundidade de aninhamento
- Métodos muito longos
- Code smells

### 10. ✅ Aplique Refatoração Contínua

```java
// Ciclo de refatoração:
// 1. Identificar código problemático
// 2. Escrever testes (se não houver)
// 3. Refatorar (uma técnica por vez)
// 4. Executar testes
// 5. Commit
// 6. Repetir
```

---

## 📚 Resumo

**Evitar ifs profundos** é essencial para código **legível**, **manutenível** e **testável**. **Arrow code** (profundidade > 3 níveis) deve ser **refatorado** usando técnicas como **guard clauses** (validações no início com return), **early return** (retornar assim que resultado é conhecido), **extract method** (extrair condições complexas), **operadores lógicos** (&&, ||), **polimorfismo** (para tipos), **Strategy pattern** (para algoritmos), **Map** (para mapeamentos), **Optional** (para null-safety), e **decomposição de métodos** (dividir métodos grandes). **Guard clauses** são a técnica mais comum: verifique condições de **erro/saída** no **início** e retorne, deixando a **lógica principal** sem aninhamento. Mantenha **complexidade ciclomática ≤ 10** (idealmente ≤ 5). Use ferramentas como **SonarQube** para detectar code smells. Aplique **refatoração contínua** sempre que identificar aninhamento excessivo.

