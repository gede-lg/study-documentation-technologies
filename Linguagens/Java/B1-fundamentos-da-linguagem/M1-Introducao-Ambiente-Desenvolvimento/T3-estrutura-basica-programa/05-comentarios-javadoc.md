# Comentários (Linha Única, Múltiplas Linhas, Javadoc)

## 🎯 Introdução e Definição

### Definição Conceitual

**Comentários** são **anotações em linguagem natural** inseridas no código-fonte que são **ignoradas pelo compilador**, servindo exclusivamente para **comunicação entre desenvolvedores**. São fundamentais para **documentação**, **explicação de lógica complexa** e **manutenção de código**.

Java oferece **três tipos** de comentários:

1. **Comentário de Linha Única** (`//`): Para anotações breves em uma linha
2. **Comentário de Múltiplas Linhas** (`/* */`): Para blocos de texto
3. **Javadoc** (`/** */`): Para documentação formal de APIs que gera documentação HTML

### Contexto Histórico

**C (1972)**: Introduziu comentários `/* */`
```c
/* Este é um comentário em C */
int x = 10; /* comentário inline */
```

**C++ (1983)**: Adicionou comentários de linha `//`
```cpp
// Comentário de linha única
int x = 10;  // Inicialização
```

**Java (1995)**: Herdou ambos tipos de C/C++ e **criou Javadoc** (`/** */`)
```java
// Comentário de linha
/* Comentário de bloco */
/** Comentário Javadoc - gera documentação */
```

**Javadoc: Inovação de Java**

Inspirado em ferramentas de documentação (como `doc` do Smalltalk), **Javadoc** revolucionou documentação de código ao:
- **Integrar documentação no código-fonte** (não em arquivos separados)
- **Gerar HTML automaticamente** a partir de comentários especiais
- **Padronizar formato** com tags (@param, @return, @throws)

**Resultado**: Toda biblioteca Java tem documentação consistente e navegável.

### Problema Fundamental que Resolve

#### Comunicação e Manutenção

**Código sem comentários**:
```java
public double calcular(double v, int t, double tx) {
    double r = v;
    for (int i = 0; i < t; i++) {
        r += r * tx;
    }
    return r;
}
```

**Pergunta**: O que `v`, `t`, `tx` significam? O que método faz?

**Código com comentários**:
```java
/**
 * Calcula o montante de um investimento com juros compostos.
 * 
 * @param valorInicial Valor principal investido
 * @param periodos Número de períodos (meses/anos)
 * @param taxaJuros Taxa de juros por período (0.05 = 5%)
 * @return Montante final após aplicação dos juros
 */
public double calcularJurosCompostos(double valorInicial, int periodos, double taxaJuros) {
    double montante = valorInicial;
    for (int i = 0; i < periodos; i++) {
        montante += montante * taxaJuros;
    }
    return montante;
}
```

**Impacto**: Intenção clara, parâmetros documentados, fácil manutenção.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Comentários de Linha** (`//`): Anotações rápidas, explicações inline
2. **Comentários de Bloco** (`/* */`): Textos longos, desabilitar código temporariamente
3. **Javadoc** (`/** */`): Documentação formal com tags especiais
4. **Compilador Ignora**: Comentários não afetam bytecode gerado
5. **Ferramentas Processam**: IDEs usam comentários para hints, Javadoc gera HTML

### Pilares Fundamentais

- **Sintaxe**: `//`, `/* */`, `/** */`
- **Localização**: Qualquer lugar no código (exceto dentro de strings/caracteres)
- **Aninhamento**: Comentários de bloco **não** aninham
- **Tags Javadoc**: @param, @return, @throws, @see, @since, @deprecated
- **Geração de Documentação**: Comando `javadoc`

### Visão Geral das Nuances

- **Comentários vs Código Auto-Explicativo**: Preferir nomes descritivos a comentários
- **Javadoc vs Comentários Internos**: Javadoc para API pública, `//` para lógica interna
- **Atualização**: Comentários desatualizados são piores que nenhum comentário
- **TODO/FIXME**: Convenções para marcar trabalho pendente

---

## 🧠 Fundamentos Teóricos

### Comentário de Linha Única (`//`)

**Sintaxe**:
```java
// Comentário até o fim da linha
código // Comentário inline (após código)
```

**Exemplos**:
```java
// Inicialização de variáveis
int contador = 0;
double taxa = 0.05;  // Taxa de 5%

// TODO: Implementar validação de entrada
String entrada = scanner.nextLine();

// FIXME: Corrigir bug de overflow
int resultado = valor1 + valor2;
```

**Uso Típico**:
- **Explicações rápidas** de linhas específicas
- **Desabilitar código temporariamente** (comentar linha)
```java
System.out.println("Debug ativo");
// System.out.println("Debug desativado");  // Linha comentada
```
- **Marcações**: TODO, FIXME, HACK, NOTE

**Vantagens**:
- ✅ Rápido de digitar
- ✅ Não precisa fechar (fim de linha automático)
- ✅ Comentar/descomentar múltiplas linhas (Ctrl+/)

### Comentário de Múltiplas Linhas (`/* */`)

**Sintaxe**:
```java
/* Comentário pode
   ocupar múltiplas
   linhas */
```

**Exemplos**:
```java
/* 
 * Bloco de comentário tradicional
 * Usado para textos mais longos
 */
public void metodo() {
    /*
        Comentário de bloco inline
        Pode estar no meio do código
    */
    int x = 10;
}
```

**Comentário Inline** (no meio de expressão):
```java
int resultado = /* comentário no meio */ calcular(10);

String mensagem = "Olá" /* concatenação */ + "Mundo";
```

**Desabilitar Blocos de Código**:
```java
public void debug() {
    System.out.println("Início");
    
    /*
    // Bloco inteiro comentado temporariamente
    if (condicao) {
        executarProcesso();
        salvarDados();
    }
    */
    
    System.out.println("Fim");
}
```

**Importante: NÃO Aninha**:
```java
/* Comentário externo
   /* Tentativa de aninhar */  ← FIM do comentário aqui!
   Este texto causa ERRO */
```

**Solução para Aninhamento**: Usar `//` em cada linha
```java
// Comentário externo
// /* Comentário interno pode ter /* e */ */
// Tudo funciona
```

### Javadoc (`/** */`)

**Definição**: Comentário especial que **gera documentação HTML** usando ferramenta `javadoc`.

**Sintaxe**:
```java
/**
 * Descrição do elemento (classe, método, atributo).
 * Pode ter múltiplas linhas.
 * 
 * @tag Descrição da tag
 */
```

**Localização**: **Imediatamente antes** de:
- Declaração de classe/interface/enum
- Declaração de método
- Declaração de atributo

#### Tags Principais do Javadoc

**@param**: Documenta parâmetros de método
```java
/**
 * @param nome Nome do parâmetro
 * @param idade Idade em anos
 */
public void cadastrar(String nome, int idade) { }
```

**@return**: Documenta retorno de método
```java
/**
 * @return Soma dos dois valores
 */
public int somar(int a, int b) {
    return a + b;
}
```

**@throws** (ou **@exception**): Documenta exceções lançadas
```java
/**
 * @throws IllegalArgumentException Se idade for negativa
 * @throws SQLException Se houver erro no banco de dados
 */
public void salvar(int idade) throws SQLException {
    if (idade < 0) throw new IllegalArgumentException();
}
```

**@see**: Referencia outro elemento relacionado
```java
/**
 * @see #metodoPrincipal()
 * @see OutraClasse
 * @see <a href="http://exemplo.com">Documentação externa</a>
 */
```

**@since**: Indica versão em que elemento foi adicionado
```java
/**
 * @since 1.5
 */
public void novoMetodo() { }
```

**@deprecated**: Marca elemento como obsoleto
```java
/**
 * @deprecated Usar {@link #novoMetodo()} ao invés deste
 */
@Deprecated
public void metodoAntigo() { }
```

**@author**: Autor da classe
```java
/**
 * @author João Silva
 * @author Maria Santos
 */
public class MinhaClasse { }
```

**@version**: Versão da classe
```java
/**
 * @version 2.1.3
 */
public class MinhaClasse { }
```

#### Exemplo Completo de Javadoc

**Classe Documentada**:
```java
package com.empresa.util;

/**
 * Classe utilitária para cálculos matemáticos avançados.
 * 
 * <p>Esta classe fornece métodos estáticos para operações matemáticas
 * que não estão disponíveis na classe {@link Math} padrão do Java.</p>
 * 
 * <p><strong>Exemplo de uso:</strong></p>
 * <pre>
 * {@code
 * double resultado = CalculadoraAvancada.fatorial(5);
 * System.out.println("5! = " + resultado);  // Saída: 5! = 120.0
 * }
 * </pre>
 * 
 * @author João Silva
 * @version 1.2.0
 * @since 1.0
 * @see Math
 */
public class CalculadoraAvancada {
    
    /**
     * Calcula o fatorial de um número inteiro.
     * 
     * <p>O fatorial de n (n!) é o produto de todos os inteiros positivos
     * menores ou iguais a n.</p>
     * 
     * <p><strong>Fórmula:</strong> n! = n × (n-1) × (n-2) × ... × 1</p>
     * 
     * @param n O número para calcular o fatorial (deve ser não-negativo)
     * @return O fatorial de n
     * @throws IllegalArgumentException Se n for negativo
     * @since 1.0
     */
    public static double fatorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Número não pode ser negativo");
        }
        
        double resultado = 1;
        for (int i = 2; i <= n; i++) {
            resultado *= i;
        }
        return resultado;
    }
    
    /**
     * Verifica se um número é primo.
     * 
     * <p>Um número é primo se for divisível apenas por 1 e por ele mesmo.</p>
     * 
     * @param numero O número a ser verificado
     * @return {@code true} se o número for primo, {@code false} caso contrário
     * @since 1.1
     */
    public static boolean ehPrimo(int numero) {
        if (numero <= 1) return false;
        if (numero == 2) return true;
        if (numero % 2 == 0) return false;
        
        for (int i = 3; i * i <= numero; i += 2) {
            if (numero % i == 0) return false;
        }
        return true;
    }
    
    /**
     * Constante PI com precisão estendida.
     * 
     * @deprecated Usar {@link Math#PI} do JDK padrão
     */
    @Deprecated
    public static final double PI_LEGADO = 3.14159265358979323846;
}
```

**Gerar Documentação**:
```bash
javadoc -d docs -sourcepath src -subpackages com.empresa
```

**Resultado**: Arquivos HTML em `docs/` com navegação completa.

#### Tags Inline do Javadoc

**{@link}**: Link para outro elemento
```java
/**
 * Veja também {@link Math#sqrt(double)} para raiz quadrada.
 */
```

**{@code}**: Código inline (sem HTML)
```java
/**
 * Use {@code new ArrayList<>()} para criar lista.
 */
```

**{@literal}**: Texto literal (sem processar HTML)
```java
/**
 * Operador {@literal <} é menor que.
 */
```

**{@value}**: Valor de constante
```java
/**
 * Valor padrão: {@value #TAMANHO_PADRAO}
 */
public static final int TAMANHO_PADRAO = 100;
```

---

## 🔍 Análise Conceitual Profunda

### Quando Usar Cada Tipo

**Comentários de Linha (`//`)**:
✅ Explicar **por que** (não o quê)
```java
// Usa TreeSet para manter ordem alfabética automática
Set<String> nomes = new TreeSet<>();

// Necessário esperar 100ms devido a limitação da API externa
Thread.sleep(100);
```

**Comentários de Bloco (`/* */`)**:
✅ Documentação de algoritmo complexo
```java
/*
 * Implementação do algoritmo QuickSort:
 * 1. Escolhe pivô (geralmente elemento central)
 * 2. Particiona array: menores à esquerda, maiores à direita
 * 3. Recursivamente ordena partições
 * Complexidade: O(n log n) médio, O(n²) pior caso
 */
```

✅ Desabilitar código temporariamente
```java
/* Desabilitado durante testes
if (modo == DEBUG) {
    imprimirDadosCompletos();
}
*/
```

**Javadoc (`/** */`)**:
✅ APIs públicas (classes, métodos públicos)
```java
/**
 * Serviço para gerenciamento de pedidos de clientes.
 * 
 * @author Equipe de Desenvolvimento
 * @since 1.0
 */
public class PedidoService {
    
    /**
     * Cria um novo pedido para o cliente especificado.
     * 
     * @param cliente Cliente que está fazendo o pedido
     * @param produtos Lista de produtos do pedido
     * @return ID do pedido criado
     * @throws IllegalArgumentException Se cliente ou produtos forem nulos
     */
    public Long criarPedido(Cliente cliente, List<Produto> produtos) {
        // Implementação
    }
}
```

### Código Auto-Explicativo vs Comentários

**Princípio**: **Código bom não precisa de comentários explicando o quê faz - precisa de comentários explicando POR QUE faz.**

**Ruim**: Comentário redundante
```java
// Incrementa contador
contador++;

// Define nome como "João"
String nome = "João";

// Se idade for maior que 18
if (idade > 18) {
    // ...
}
```

**Bom**: Nomes descritivos (sem comentários desnecessários)
```java
int totalPedidosProcessados = 0;
totalPedidosProcessados++;

String nomeClientePadrao = "João";

if (clienteMaiorDeIdade(idade)) {
    // ...
}
```

**Quando Comentar**:
```java
// Regex complexo - explica intenção
String regexEmail = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

// Workaround para bug #1234 da biblioteca XYZ
// TODO: Remover quando versão 2.0 da lib for lançada
Thread.sleep(50);

// Fórmula de Haversine para calcular distância entre coordenadas geográficas
double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
           Math.cos(lat1) * Math.cos(lat2) *
           Math.sin(dLon / 2) * Math.sin(dLon / 2);
```

### Comentários TODO e FIXME

**Convenções**:

**TODO**: Trabalho planejado, mas não implementado
```java
// TODO: Adicionar validação de CPF
public void cadastrarCliente(String cpf) {
    // ...
}

// TODO(joao): Otimizar algoritmo - complexidade atual O(n²)
public void processar(List<Integer> dados) {
    // ...
}
```

**FIXME**: Bug conhecido que precisa correção
```java
// FIXME: Método falha com números negativos
public int calcular(int valor) {
    return Math.sqrt(valor);  // Erro se valor < 0
}
```

**HACK**: Solução não ideal (gambiarra)
```java
// HACK: Conversão forçada - refatorar quando possível
String resultado = (String) objetoGenerico;
```

**NOTE**: Informação importante
```java
// NOTE: Este método é chamado via reflection - não remover
public void callbackExterno() { }
```

**IDEs Detectam**: Eclipse, IntelliJ mostram lista de TODO/FIXME no projeto.

### Comentários Desatualizados: Pior que Nenhum

**Problema Grave**:
```java
/**
 * Retorna lista de clientes ativos.
 * 
 * @return Lista de clientes
 */
public List<Cliente> buscarTodos() {
    // Código refatorado retorna TODOS os clientes (não só ativos)
    return repositorio.findAll();
}
```

**Documentação mente** - desenvolvedor confia no comentário errado.

**Solução**: **Atualizar comentários** quando código muda, ou **remover** se irrelevante.

---

## 🎯 Aplicabilidade e Contextos

### Exemplo: Classe Bem Documentada

```java
package com.empresa.financeiro;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Calculadora de juros para operações financeiras.
 * 
 * <p>Fornece métodos para cálculo de juros simples e compostos,
 * com precisão adequada para operações monetárias (usa {@link BigDecimal}).</p>
 * 
 * <p><strong>Exemplo de uso:</strong></p>
 * <pre>
 * {@code
 * CalculadoraJuros calc = new CalculadoraJuros();
 * BigDecimal montante = calc.jurosCompostos(
 *     new BigDecimal("1000.00"),  // Principal
 *     new BigDecimal("0.05"),     // Taxa 5%
 *     12                           // 12 meses
 * );
 * System.out.println("Montante: " + montante);
 * }
 * </pre>
 * 
 * @author Equipe Financeiro
 * @version 2.0.1
 * @since 1.0
 */
public class CalculadoraJuros {
    
    /** Escala padrão para cálculos monetários (2 casas decimais). */
    private static final int ESCALA_MONETARIA = 2;
    
    /** Modo de arredondamento padrão (metade para cima). */
    private static final RoundingMode MODO_ARREDONDAMENTO = RoundingMode.HALF_UP;
    
    /**
     * Calcula juros compostos.
     * 
     * <p>Fórmula: M = P × (1 + i)^n</p>
     * <p>Onde:
     * <ul>
     *   <li>M = Montante final</li>
     *   <li>P = Principal (valor inicial)</li>
     *   <li>i = Taxa de juros por período</li>
     *   <li>n = Número de períodos</li>
     * </ul>
     * </p>
     * 
     * @param principal Valor principal investido (deve ser positivo)
     * @param taxa Taxa de juros por período (0.05 = 5%, deve ser não-negativa)
     * @param periodos Número de períodos (deve ser positivo)
     * @return Montante final com juros aplicados
     * @throws IllegalArgumentException Se qualquer parâmetro for inválido
     * @since 1.0
     */
    public BigDecimal jurosCompostos(BigDecimal principal, BigDecimal taxa, int periodos) {
        // Validações
        if (principal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Principal deve ser positivo");
        }
        if (taxa.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Taxa não pode ser negativa");
        }
        if (periodos <= 0) {
            throw new IllegalArgumentException("Períodos deve ser positivo");
        }
        
        // Cálculo: M = P × (1 + i)^n
        BigDecimal umMaisTaxa = BigDecimal.ONE.add(taxa);
        BigDecimal fator = umMaisTaxa.pow(periodos);
        BigDecimal montante = principal.multiply(fator);
        
        // Arredonda para escala monetária
        return montante.setScale(ESCALA_MONETARIA, MODO_ARREDONDAMENTO);
    }
    
    /**
     * Calcula juros simples.
     * 
     * <p>Fórmula: M = P × (1 + i × n)</p>
     * 
     * @param principal Valor principal
     * @param taxa Taxa de juros
     * @param periodos Número de períodos
     * @return Montante final
     * @throws IllegalArgumentException Se parâmetros inválidos
     * @see #jurosCompostos(BigDecimal, BigDecimal, int)
     * @since 1.0
     */
    public BigDecimal jurosSimples(BigDecimal principal, BigDecimal taxa, int periodos) {
        if (principal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Principal deve ser positivo");
        }
        
        // M = P + (P × i × n)
        BigDecimal juros = principal
            .multiply(taxa)
            .multiply(new BigDecimal(periodos));
        
        BigDecimal montante = principal.add(juros);
        return montante.setScale(ESCALA_MONETARIA, MODO_ARREDONDAMENTO);
    }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Comentários Não Substituem Código Claro

**Ruim**:
```java
// Calcula média
double r = (a + b + c) / 3;
```

**Bom**:
```java
double media = (nota1 + nota2 + nota3) / NUMERO_DE_NOTAS;
```

### Manutenção de Comentários

Comentários requerem **manutenção** como código - desatualizados causam confusão.

---

## 🔗 Interconexões Conceituais

**Próximos Conceitos**: Convenções de Nomenclatura (nomes descritivos reduzem necessidade de comentários).

---

## 🚀 Evolução

**Ferramentas Modernas**:
- **Javadoc Markdown**: Propostas para suportar Markdown
- **AI Documentation**: Ferramentas que geram Javadoc automaticamente
- **Code Linters**: Detectam comentários desatualizados
