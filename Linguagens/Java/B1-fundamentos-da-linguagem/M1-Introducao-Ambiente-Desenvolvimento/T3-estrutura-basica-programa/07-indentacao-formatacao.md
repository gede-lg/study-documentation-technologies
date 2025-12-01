# Indentação e Formatação de Código

## 🎯 Introdução e Definição

### Definição Conceitual

**Indentação** é o uso de **espaços ou tabs no início de linhas** para representar visualmente a **estrutura hierárquica** do código (blocos, aninhamento, escopo). **Formatação** engloba indentação mais outras regras de organização visual: **posição de chaves**, **espaçamento**, **quebras de linha**, **alinhamento**.

Diferente de linguagens como Python (onde indentação é **sintaxe obrigatória**), em Java indentação é **opcional** - o compilador ignora espaços em branco. Porém, formatação adequada é **essencial** para **legibilidade**, **manutenção** e **colaboração** em equipe.

### Analogia: Código como Prosa

**Código mal formatado**:
```java
public class Exemplo{private int valor;public void metodo(){if(valor>10){System.out.
println("Maior");} else{System.out.println("Menor");}}}
```

**Código bem formatado**:
```java
public class Exemplo {
    private int valor;
    
    public void metodo() {
        if (valor > 10) {
            System.out.println("Maior");
        } else {
            System.out.println("Menor");
        }
    }
}
```

**Analogia**: Como parágrafos e pontuação em texto - tecnicamente opcional, mas crucial para compreensão.

### Contexto Histórico

**Primeiras Linguagens (1950-60s)**:
- **FORTRAN**, **COBOL**: Formatação rígida (colunas fixas)
```fortran
C     Comentário deve estar na coluna 1
      PROGRAM EXEMPLO
      INTEGER X
      X = 10
      END
```

**C (1972)**: Liberdade total (espaços ignorados)
```c
int main(){int x=10;if(x>5){printf("OK");}}  // Compila!
```

**Problema**: Cada programador formatava diferente - inconsistência.

**Solução**: **Style Guides** (guias de estilo)
- **K&R Style** (Kernighan & Ritchie, 1978): Estilo C clássico
- **Allman Style** (Eric Allman, 1980s): Chaves em linhas separadas

**Java (1995)**: Adotou **convenções do Code Conventions for Java (1997)** da Sun Microsystems
- **Indentação**: 4 espaços
- **Chaves**: Estilo K&R (chave de abertura na mesma linha)
- **Espaçamento**: Espaços ao redor de operadores

**Atualidade**: **Google Java Style Guide** e **Oracle Conventions** são referências modernas.

### Problema Fundamental que Resolve

#### Legibilidade e Compreensão

**Código sem indentação**:
```java
public class ProcessadorPedidos {
public void processar(List<Pedido> pedidos) {
for (Pedido pedido : pedidos) {
if (pedido.isValido()) {
if (pedido.getValor() > 1000) {
aplicarDesconto(pedido);
}
salvarPedido(pedido);
} else {
registrarErro(pedido);
}
}
}
}
```

**Problema**: Difícil identificar blocos, aninhamento, estrutura lógica.

**Código com indentação**:
```java
public class ProcessadorPedidos {
    public void processar(List<Pedido> pedidos) {
        for (Pedido pedido : pedidos) {
            if (pedido.isValido()) {
                if (pedido.getValor() > 1000) {
                    aplicarDesconto(pedido);
                }
                salvarPedido(pedido);
            } else {
                registrarErro(pedido);
            }
        }
    }
}
```

**Vantagem**: Estrutura visual clara - cada nível de aninhamento é evidente.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Indentação**: 4 espaços (padrão Java) ou 2 espaços (Google)
2. **Tabs vs Espaços**: Espaços preferíveis (consistência entre editores)
3. **Posição de Chaves**: K&R style (abertura na mesma linha)
4. **Espaçamento**: Espaços ao redor de operadores e após vírgulas
5. **Comprimento de Linha**: Máximo 80-120 caracteres

### Pilares Fundamentais

| Aspecto | Convenção Oracle | Convenção Google |
|---------|------------------|------------------|
| **Indentação** | 4 espaços | 2 espaços |
| **Chave abertura** | Mesma linha | Mesma linha |
| **Chave fechamento** | Linha própria | Linha própria |
| **Comprimento linha** | 80 caracteres | 100 caracteres |
| **Tabs** | Não usar | Não usar |

### Visão Geral das Nuances

- **Chaves Opcionais**: Usar mesmo em blocos de 1 linha (prevenção de bugs)
- **Espaços em Parênteses**: Não usar dentro de parênteses
- **Quebra de Linha**: Em cadeias de métodos, quebrar antes do ponto
- **Imports**: Organizar e agrupar (sem *wildcard* excessivo)

---

## 🧠 Fundamentos Teóricos

### Indentação: Espaços vs Tabs

**Espaços**:
- ✅ **Consistência**: Aparência idêntica em todos editores/ferramentas
- ✅ **Alinhamento preciso**: Controle exato de colunas
- ❌ **Mais caracteres**: Arquivo ligeiramente maior

**Tabs**:
- ✅ **Flexibilidade**: Cada desenvolvedor configura largura (2, 4, 8 espaços)
- ❌ **Inconsistência**: Pode quebrar alinhamento entre editores
- ❌ **Mistura com espaços**: Causa problemas visuais

**Convenção Java**: **Espaços** (4 espaços por nível)

**Configuração IDEs**:
- **IntelliJ**: Settings → Editor → Code Style → Java → Tabs and Indents
- **Eclipse**: Preferences → Java → Code Style → Formatter

**Exemplo**:
```java
public class Exemplo {
····private int valor;  // 4 espaços
····
····public void metodo() {
········if (valor > 10) {  // 8 espaços (2 níveis × 4)
············System.out.println("OK");  // 12 espaços (3 níveis × 4)
········}
····}
}
```

### Posição de Chaves

**K&R Style** (padrão Java):
- Chave de **abertura** na **mesma linha**
- Chave de **fechamento** em **linha própria**

```java
public class Exemplo {  // ← Chave abertura na mesma linha
    public void metodo() {  // ← Mesma linha
        if (condicao) {  // ← Mesma linha
            // código
        }  // ← Chave fechamento em linha própria
    }
}
```

**Allman Style** (não Java):
- Ambas chaves em linhas próprias

```java
public class Exemplo  
{  // ← Chave abertura em linha própria (NÃO Java)
    public void metodo() 
    {
        if (condicao) 
        {
            // código
        }
    }
}
```

**Vantagem K&R**: Mais compacto, padrão Java universal.

### Chaves em Blocos de Uma Linha

**Debate**: Chaves opcionais em if/for/while de uma linha.

**Sem Chaves** (permitido):
```java
if (condicao)
    executar();

for (int i = 0; i < 10; i++)
    processar(i);
```

**Com Chaves** (recomendado):
```java
if (condicao) {
    executar();
}

for (int i = 0; i < 10; i++) {
    processar(i);
}
```

**Por que usar chaves sempre?**

**Bug Clássico** (Apple SSL Bug, 2014):
```java
if (condicao)
    executar1();
    executar2();  // ❌ PARECE estar no if, mas NÃO está!
```

**Correto com chaves**:
```java
if (condicao) {
    executar1();
    executar2();  // ✅ Claramente dentro do bloco
}
```

**Convenção Google/Oracle**: **Sempre usar chaves**, mesmo em blocos de 1 linha.

### Espaçamento

**Ao redor de operadores**:
```java
// ✅ Correto
int resultado = a + b * c;
boolean valido = x > 10 && y < 20;

// ❌ Incorreto
int resultado=a+b*c;
boolean valido=x>10&&y<20;
```

**Após vírgulas**:
```java
// ✅ Correto
metodo(a, b, c);
List<Integer> lista = Arrays.asList(1, 2, 3);

// ❌ Incorreto
metodo(a,b,c);
List<Integer> lista = Arrays.asList(1,2,3);
```

**Dentro de parênteses** (NÃO usar):
```java
// ✅ Correto
if (condicao) {
    metodo(a, b);
}

// ❌ Incorreto
if ( condicao ) {  // Espaço desnecessário
    metodo( a, b );
}
```

**Entre palavra-chave e parêntese**:
```java
// ✅ Correto
if (condicao) { }
for (int i = 0; i < 10; i++) { }
while (ativo) { }

// ❌ Incorreto
if(condicao) { }  // Falta espaço
for(int i=0;i<10;i++) { }
```

### Comprimento de Linha

**Convenção**:
- **Oracle**: 80 caracteres (histórico - terminais antigos)
- **Google**: 100 caracteres
- **Moderno**: 100-120 caracteres (monitores wide)

**Quebra de Linha**:
```java
// Linha longa
String mensagem = calcularMensagem(parametro1, parametro2, parametro3, parametro4, parametro5);

// ✅ Quebra adequada
String mensagem = calcularMensagem(
    parametro1, 
    parametro2, 
    parametro3, 
    parametro4, 
    parametro5
);

// Ou (se cabe):
String mensagem = calcularMensagem(parametro1, parametro2, 
    parametro3, parametro4, parametro5);
```

**Cadeias de Métodos** (Fluent API):
```java
// ✅ Correto (quebra ANTES do ponto)
List<String> resultado = lista.stream()
    .filter(s -> s.length() > 5)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());

// ❌ Incorreto (quebra DEPOIS do ponto)
List<String> resultado = lista.stream().
    filter(s -> s.length() > 5).
    map(String::toUpperCase).
    sorted().
    collect(Collectors.toList());
```

### Linhas em Branco

**Separar Seções Lógicas**:
```java
public class Exemplo {
    // Constantes
    private static final int MAX_VALOR = 100;
    
    // Atributos
    private int valor;
    private String nome;
    
    // Construtor
    public Exemplo(int valor, String nome) {
        this.valor = valor;
        this.nome = nome;
    }
    
    // Métodos públicos
    public void processar() {
        // Implementação
    }
    
    // Métodos privados
    private void validar() {
        // Implementação
    }
}
```

**Dentro de Métodos**:
```java
public void processar() {
    // Bloco 1: Validação
    if (valor < 0) {
        throw new IllegalArgumentException();
    }
    
    // Bloco 2: Processamento
    int resultado = valor * 2;
    
    // Bloco 3: Persistência
    salvar(resultado);
}
```

### Alinhamento de Declarações

**NÃO alinhar** (Google Style):
```java
// ✅ Preferível (Google)
private int valor;
private String nome;
private boolean ativo;
```

**Alinhar** (estilo antigo, não recomendado):
```java
// ❌ Evitar (dificulta manutenção)
private int     valor;
private String  nome;
private boolean ativo;
```

**Razão**: Adicionar variável com tipo longo requer realinhar tudo.

---

## 🔍 Análise Conceitual Profunda

### Formatação Automática (IDEs)

**IntelliJ IDEA**:
- **Formatar arquivo**: `Ctrl+Alt+L` (Windows/Linux), `Cmd+Option+L` (Mac)
- **Configurar**: Settings → Editor → Code Style → Java

**Eclipse**:
- **Formatar arquivo**: `Ctrl+Shift+F`
- **Configurar**: Preferences → Java → Code Style → Formatter

**Vantagem**: Consistência automática - desenvolvedor não precisa lembrar regras.

### Ferramentas de Verificação

**Checkstyle**: Verifica conformidade com estilo
```xml
<module name="Indentation">
    <property name="basicOffset" value="4"/>
</module>
<module name="LineLength">
    <property name="max" value="100"/>
</module>
```

**Prettier** (JavaScript, mas conceito similar): Formatação automática e opinionated

### Google Java Style vs Oracle Conventions

**Principais Diferenças**:

| Aspecto | Oracle | Google |
|---------|--------|--------|
| Indentação | 4 espaços | 2 espaços |
| Comprimento linha | 80 chars | 100 chars |
| Imports | Organizar em grupos | Organizar alfabeticamente |
| Chaves obrigatórias | Recomendado | **Obrigatório** |

**Exemplo Google (2 espaços)**:
```java
public class Exemplo {
  private int valor;
  
  public void metodo() {
    if (condicao) {
      executar();
    }
  }
}
```

**Exemplo Oracle (4 espaços)**:
```java
public class Exemplo {
    private int valor;
    
    public void metodo() {
        if (condicao) {
            executar();
        }
    }
}
```

**Qual usar?** **Consistência dentro do projeto** > estilo específico.

---

## 🎯 Aplicabilidade e Contextos

### Exemplo: Código Bem Formatado

```java
package com.empresa.comercial.servico;

import com.empresa.comercial.modelo.Cliente;
import com.empresa.comercial.modelo.Pedido;
import com.empresa.comercial.repositorio.PedidoRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço de processamento de pedidos.
 */
public class PedidoService {
    
    private static final BigDecimal DESCONTO_CLIENTE_PREMIUM = new BigDecimal("0.10");
    private static final BigDecimal VALOR_MINIMO_DESCONTO = new BigDecimal("1000.00");
    
    private final PedidoRepository repository;
    
    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }
    
    /**
     * Processa lista de pedidos aplicando regras de negócio.
     */
    public void processar(List<Pedido> pedidos) {
        List<Pedido> pedidosValidos = pedidos.stream()
            .filter(this::validarPedido)
            .collect(Collectors.toList());
        
        for (Pedido pedido : pedidosValidos) {
            aplicarDesconto(pedido);
            calcularTotal(pedido);
            salvarPedido(pedido);
        }
    }
    
    private boolean validarPedido(Pedido pedido) {
        return pedido != null 
            && pedido.getCliente() != null 
            && !pedido.getItens().isEmpty();
    }
    
    private void aplicarDesconto(Pedido pedido) {
        Cliente cliente = pedido.getCliente();
        BigDecimal valorTotal = pedido.getValorTotal();
        
        if (cliente.isPremium() && valorTotal.compareTo(VALOR_MINIMO_DESCONTO) > 0) {
            BigDecimal desconto = valorTotal.multiply(DESCONTO_CLIENTE_PREMIUM);
            pedido.setDesconto(desconto);
        }
    }
    
    private void calcularTotal(Pedido pedido) {
        BigDecimal subtotal = pedido.getItens().stream()
            .map(item -> item.getPrecoUnitario().multiply(new BigDecimal(item.getQuantidade())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal desconto = pedido.getDesconto() != null 
            ? pedido.getDesconto() 
            : BigDecimal.ZERO;
        
        BigDecimal total = subtotal.subtract(desconto);
        pedido.setValorTotal(total);
    }
    
    private void salvarPedido(Pedido pedido) {
        repository.save(pedido);
    }
}
```

**Características**:
- ✅ Indentação consistente (4 espaços)
- ✅ Chaves sempre presentes
- ✅ Espaçamento adequado
- ✅ Quebras de linha em cadeias longas
- ✅ Linhas em branco separando seções
- ✅ Comprimento de linha controlado

---

## ⚠️ Limitações e Considerações Teóricas

### Formatação NÃO Afeta Funcionalidade

**Código mal formatado compila e funciona**:
```java
public class Exemplo{public static void main(String[]args){System.out.println("OK");}}
```

**Compila e executa perfeitamente** - mas é ilegível.

### Consistência > Estilo Específico

**Pior cenário**: Cada arquivo com estilo diferente.

**Solução**: **EditorConfig**, **Checkstyle** para forçar consistência.

---

## 🔗 Interconexões Conceituais

**Próximo Tópico**: **Estrutura de Diretórios e Arquivos** - Como organizar arquivos .java no sistema de arquivos.

---

## 🚀 Evolução

**Futuro**: 
- **Formatação AI**: Ferramentas que aprendem estilo do projeto
- **Git Hooks**: Formatar automaticamente antes de commit
