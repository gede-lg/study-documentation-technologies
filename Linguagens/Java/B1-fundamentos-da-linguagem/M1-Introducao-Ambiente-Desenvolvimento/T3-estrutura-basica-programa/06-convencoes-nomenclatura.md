# Convenções de Nomenclatura (CamelCase, snake_case)

## 🎯 Introdução e Definição

### Definição Conceitual

**Convenções de nomenclatura** são **padrões estabelecidos pela comunidade** para nomear elementos de código (classes, métodos, variáveis, constantes, pacotes). Não são regras obrigatórias da linguagem, mas **normas sociais** que tornam código **legível** e **consistente** entre diferentes projetos e desenvolvedores.

Java adota principalmente **CamelCase** (palavras compostas sem espaços, com maiúsculas indicando separação) em duas variantes:
- **PascalCase** (UpperCamelCase): Primeira letra maiúscula - usado para **classes**, **interfaces**, **enums**
- **camelCase** (lowerCamelCase): Primeira letra minúscula - usado para **métodos**, **variáveis**, **parâmetros**

Adicionalmente:
- **UPPER_CASE** (SCREAMING_SNAKE_CASE): Tudo maiúsculo com underscores - usado para **constantes**
- **lowercase**: Tudo minúsculo - usado para **pacotes**

### Contexto Histórico

**Origens dos Estilos**:

**snake_case** (anos 1960-70):
- Comum em **C**, **Python**, **Ruby**
- Palavras separadas por underscores
```c
int numero_total;
void calcular_media(int valor_inicial);
```

**CamelCase** (anos 1980):
- Popularizado por **Smalltalk**, **Objective-C**
- Adotado por **Java**, **C#**, **JavaScript**
- Nome vem da aparência de "corcovas de camelo" nas maiúsculas
```java
int numeroTotal;
void calcularMedia(int valorInicial);
```

**PascalCase**:
- Nomeado após linguagem **Pascal** (1970)
- Usada para tipos (classes) em várias linguagens modernas
```java
class ClientePremium { }
interface Calculavel { }
```

**Por que Java escolheu CamelCase?**

Java (1995) herdou convenções de **Smalltalk** e **C++**, onde:
- **Smalltalk**: Usava camelCase para mensagens (métodos)
- **C++**: Começava a adotar PascalCase para classes (STL usava snake_case, mas práticas estavam mudando)

**Resultado**: Java consolidou CamelCase como padrão dominante em OOP.

### Problema Fundamental que Resolve

#### Legibilidade e Consistência

**Código sem convenções** (inconsistente):
```java
public class conta_bancaria {  // Mistura estilos
    private String NOME_Cliente;
    private double saldo_ATUAL;
    
    public void Depositar(double VLR) {
        this.saldo_ATUAL += VLR;
    }
    
    public double get_saldo_atual() {
        return saldo_ATUAL;
    }
}
```

**Problemas**:
- Difícil distinguir **tipo** de elemento (classe? variável? constante?)
- Falta de padrão causa **confusão cognitiva**
- Código não profissional

**Código com convenções** (consistente):
```java
public class ContaBancaria {
    private String nomeCliente;
    private double saldoAtual;
    
    public void depositar(double valor) {
        this.saldoAtual += valor;
    }
    
    public double getSaldoAtual() {
        return saldoAtual;
    }
}
```

**Vantagens**:
- **Reconhecimento imediato**: `ContaBancaria` é classe, `depositar` é método, `saldoAtual` é variável
- **Legibilidade**: Código fluente como linguagem natural
- **Padrão universal**: Qualquer desenvolvedor Java reconhece

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **PascalCase**: Classes, Interfaces, Enums, Annotations
2. **camelCase**: Métodos, variáveis, parâmetros
3. **UPPER_CASE**: Constantes (static final)
4. **lowercase**: Pacotes
5. **Prefixos/Sufixos**: Convenções especiais (IInterface, AbstractBase)

### Pilares Fundamentais

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| **Classe** | PascalCase | `Cliente`, `ContaBancaria` |
| **Interface** | PascalCase | `Runnable`, `Comparable` |
| **Enum** | PascalCase | `DiaSemana`, `StatusPedido` |
| **Método** | camelCase | `calcularTotal()`, `isAtivo()` |
| **Variável** | camelCase | `contador`, `nomeCompleto` |
| **Constante** | UPPER_CASE | `MAX_VALOR`, `PI` |
| **Pacote** | lowercase | `com.empresa.projeto` |

### Visão Geral das Nuances

- **Acrônimos**: `URL` em classe → `Url` (não `URL`); variável → `url` (não `uRL`)
- **Booleanos**: Prefixo `is`, `has`, `can` → `isAtivo()`, `hasPermissao()`
- **Getters/Setters**: `get` + nome, `set` + nome → `getNome()`, `setIdade()`
- **Nomes Descritivos**: Evitar abreviações (`qtd` → `quantidade`)

---

## 🧠 Fundamentos Teóricos

### Convenções para Classes

**Regra**: **PascalCase** (primeira letra maiúscula, sem separadores)

**Formato**:
```java
public class NomeDaClasse { }
```

**Exemplos**:
```java
// ✅ Correto
public class Cliente { }
public class ContaBancaria { }
public class ProcessadorPagamento { }
public class RelatorioVendasMensais { }

// ❌ Incorreto
public class cliente { }          // Deveria ser Cliente
public class conta_bancaria { }   // Deveria ser ContaBancaria
public class PROCESSADOR { }      // Deveria ser Processador
```

**Convenções Adicionais**:

**Substantivos**: Classes representam "coisas"
```java
class Pessoa { }
class Produto { }
class Pedido { }
```

**Sufixos Comuns**:
```java
class ClienteService { }      // Serviço (lógica de negócio)
class ProdutoRepository { }   // Repositório (acesso a dados)
class PedidoController { }    // Controlador (camada web)
class ValidadorCPF { }        // Sufixo -dor (agente/executor)
class PagamentoException { }  // Exceção customizada
```

### Convenções para Interfaces

**Regra**: **PascalCase** (igual a classes)

**Exemplos JDK**:
```java
public interface Runnable { }
public interface Comparable<T> { }
public interface Serializable { }
public interface List<E> { }
```

**Convenção Antiga (C#, .NET)**: Prefixo `I`
```java
public interface ICliente { }      // Estilo C#
public interface IPagamento { }
```

**Convenção Java Moderna**: **SEM prefixo `I`**
```java
public interface Cliente { }       // ✅ Java moderno
public interface Pagamento { }
```

**Razão**: Java prefere sufixos descritivos
```java
interface Calculavel { }     // Adjetivo (-ável, -able)
interface Comparavel { }
interface Observador { }     // Substantivo
interface Listener { }
```

**Implementações Comuns**:
```java
// Interface sem prefixo
interface List<E> { }

// Implementações com sufixos
class ArrayList<E> implements List<E> { }
class LinkedList<E> implements List<E> { }
```

### Convenções para Métodos

**Regra**: **camelCase** (primeira letra minúscula)

**Formato**:
```java
public void nomeDoMetodo() { }
public int calcularValor() { }
```

**Exemplos**:
```java
// ✅ Correto
public void salvar() { }
public int calcularTotal() { }
public boolean isAtivo() { }
public String getNome() { }

// ❌ Incorreto
public void Salvar() { }           // Deveria ser salvar
public int Calcular_Total() { }    // Deveria ser calcularTotal
public boolean ativo() { }         // Deveria ser isAtivo
```

**Convenções de Prefixos**:

**Getters** (obter valor):
```java
public String getNome() {
    return nome;
}

public int getIdade() {
    return idade;
}
```

**Setters** (definir valor):
```java
public void setNome(String nome) {
    this.nome = nome;
}

public void setIdade(int idade) {
    this.idade = idade;
}
```

**Booleanos**: Prefixos `is`, `has`, `can`
```java
public boolean isAtivo() {
    return ativo;
}

public boolean hasPermissao() {
    return permissao != null;
}

public boolean canExecutar() {
    return credenciais.ehValida();
}
```

**Verbos**: Métodos representam **ações**
```java
void salvar() { }
void processar() { }
void calcular() { }
void validar() { }
void enviar() { }
```

### Convenções para Variáveis e Parâmetros

**Regra**: **camelCase** (igual a métodos)

**Exemplos**:
```java
// ✅ Correto
int contador;
String nomeCompleto;
double saldoDisponivel;
List<Cliente> clientesAtivos;

// ❌ Incorreto
int Contador;              // Deveria ser contador
String nome_completo;      // Deveria ser nomeCompleto
double SALDO;              // Deveria ser saldo (não é constante)
```

**Nomes Descritivos** (evitar abreviações):
```java
// ❌ Ruim (abreviado)
int qtd;
String nm;
double vlr;

// ✅ Bom (descritivo)
int quantidade;
String nome;
double valor;
```

**Exceção**: Variáveis de loop (tradição aceita)
```java
for (int i = 0; i < 10; i++) { }     // ✅ OK: i, j, k comuns em loops
for (String item : lista) { }        // ✅ Melhor: nome descritivo
```

**Variáveis Booleanas**: Prefixos interrogativos
```java
boolean isAtivo;
boolean hasErro;
boolean canProsseguir;
boolean flagProcessado;  // Ou usar 'flag' como sufixo
```

### Convenções para Constantes

**Regra**: **UPPER_CASE** com underscores

**Definição**: Constantes são `static final`

**Exemplos**:
```java
// ✅ Correto
public static final int MAX_TENTATIVAS = 3;
public static final String MENSAGEM_ERRO = "Erro ao processar";
public static final double TAXA_PADRAO = 0.05;

// ❌ Incorreto
public static final int maxTentativas = 3;    // Deveria ser MAX_TENTATIVAS
public static final String MensagemErro = ""; // Deveria ser MENSAGEM_ERRO
```

**Constantes em Enums**:
```java
public enum DiaSemana {
    SEGUNDA,     // ✅ UPPER_CASE
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO,
    DOMINGO
}
```

**Constantes Matemáticas**:
```java
public static final double PI = 3.14159265358979323846;
public static final double E = 2.718281828459045;
```

### Convenções para Pacotes

**Regra**: **lowercase**, sem underscores

**Formato**:
```java
package com.empresa.projeto.modulo;
```

**Exemplos**:
```java
// ✅ Correto
package com.exemplo.util;
package org.apache.commons.lang3;
package br.com.empresa.comercial;

// ❌ Incorreto
package com.Exemplo.Util;           // Deveria ser lowercase
package org.apache.commons_lang;    // Evitar underscores
package br.com.Empresa.Comercial;   // Deveria ser lowercase
```

**Estrutura Típica**:
```
com.empresa.projeto
├── modelo
├── servico
├── repositorio
├── controlador
└── util
```

### Tratamento de Acrônimos

**Regra**: Tratar acrônimos como palavras comuns

**Classes/Interfaces** (PascalCase):
```java
// ❌ Ruim (acrônimo todo maiúsculo)
class XMLParser { }
class HTTPConnection { }
class URLValidator { }

// ✅ Bom (acrônimo como palavra)
class XmlParser { }
class HttpConnection { }
class UrlValidator { }
```

**Métodos/Variáveis** (camelCase):
```java
// ❌ Ruim
String parseXML() { }
void sendHTTP() { }
URL url;

// ✅ Bom
String parseXml() { }
void sendHttp() { }
Url url;  // Ou String urlString se for String
```

**Exceção**: Acrônimos muito estabelecidos
```java
// Aceito por convenção histórica (JDK usa):
URL url = new URL("http://exemplo.com");  // java.net.URL
IOException e;  // IO é tratado como palavra única
```

---

## 🔍 Análise Conceitual Profunda

### Comparação: Java vs Outras Linguagens

| Linguagem | Classes | Métodos | Variáveis | Constantes |
|-----------|---------|---------|-----------|------------|
| **Java** | PascalCase | camelCase | camelCase | UPPER_CASE |
| **C#** | PascalCase | PascalCase | camelCase | PascalCase |
| **Python** | PascalCase | snake_case | snake_case | UPPER_CASE |
| **JavaScript** | PascalCase | camelCase | camelCase | UPPER_CASE |
| **Ruby** | PascalCase | snake_case | snake_case | UPPER_CASE |
| **Go** | PascalCase | PascalCase | camelCase | PascalCase |
| **Kotlin** | PascalCase | camelCase | camelCase | UPPER_CASE |

**Observações**:
- **Java e JavaScript**: Convenções quase idênticas
- **C#**: Métodos públicos usam PascalCase (diferença de Java)
- **Python/Ruby**: Preferem snake_case para métodos

### Convenções JavaBeans

**JavaBeans**: Padrão para componentes reutilizáveis

**Regras**:
1. **Construtor sem argumentos**
```java
public class Pessoa {
    public Pessoa() { }  // ✅ Obrigatório
}
```

2. **Propriedades privadas** com **getters/setters públicos**
```java
private String nome;

public String getNome() {       // getter
    return nome;
}

public void setNome(String nome) {  // setter
    this.nome = nome;
}
```

3. **Booleanos**: `is` para getter
```java
private boolean ativo;

public boolean isAtivo() {      // ✅ is + propriedade
    return ativo;
}

public void setAtivo(boolean ativo) {
    this.ativo = ativo;
}
```

4. **Serializable** (opcional)
```java
public class Pessoa implements Serializable {
    private static final long serialVersionUID = 1L;
}
```

**Uso**: Frameworks (Spring, JSF, Hibernate) dependem dessas convenções.

### Convenções de Prefixos/Sufixos

**Prefixos Comuns**:
```java
// Abstract-: Classe abstrata
abstract class AbstractList { }
abstract class AbstractService { }

// Base-: Classe base (herança)
class BaseController { }
class BaseEntity { }
```

**Sufixos Comuns**:
```java
// -Service: Lógica de negócio
class ClienteService { }
class PedidoService { }

// -Repository: Acesso a dados
class ClienteRepository { }
class ProdutoRepository { }

// -Controller: Camada de apresentação
class HomeController { }
class ClienteController { }

// -Exception: Exceções customizadas
class DadosInvalidosException extends Exception { }
class SaldoInsuficienteException extends RuntimeException { }

// -Util: Classes utilitárias
class StringUtil { }
class DateUtil { }

// -Factory: Padrão Factory
class ConnectionFactory { }
class DAOFactory { }

// -Builder: Padrão Builder
class ClienteBuilder { }
class PedidoBuilder { }
```

### Nomes Descritivos vs Concisos

**Princípio**: **Clareza > Brevidade**

**Ruim** (abreviações obscuras):
```java
void prc() { }           // O que significa?
int qtd;
String nm;
double vlr;
```

**Bom** (descritivo):
```java
void processar() { }
int quantidade;
String nome;
double valor;
```

**Exceções Aceitáveis**:
```java
// Variáveis de loop (tradição)
for (int i = 0; i < n; i++) { }

// Variáveis temporárias de escopo muito curto
int temp = a;
a = b;
b = temp;

// Coordenadas matemáticas
double x, y, z;
```

**Comprimento Ideal**:
- **Variáveis locais**: 1-3 palavras (`contador`, `nomeCliente`)
- **Métodos**: 2-4 palavras (`calcularTotal`, `buscarClientePorCpf`)
- **Classes**: 1-3 palavras (`Cliente`, `ProcessadorPagamento`)

---

## 🎯 Aplicabilidade e Contextos

### Exemplo: Classe Seguindo Todas as Convenções

```java
package com.empresa.comercial.modelo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Representa um pedido de cliente no sistema comercial.
 */
public class PedidoCliente {
    
    // Constantes (UPPER_CASE)
    public static final int MAX_ITENS_POR_PEDIDO = 100;
    public static final BigDecimal TAXA_ENTREGA_PADRAO = new BigDecimal("15.00");
    
    // Atributos (camelCase)
    private Long id;
    private String numeroControle;
    private ClientePremium cliente;
    private List<ItemPedido> itens;
    private boolean ativo;
    private boolean entregaRealizada;
    
    // Construtor (PascalCase da classe)
    public PedidoCliente(ClientePremium cliente) {
        this.cliente = cliente;
        this.itens = new ArrayList<>();
        this.ativo = true;
        this.entregaRealizada = false;
    }
    
    // Getters (camelCase, começam com 'get')
    public Long getId() {
        return id;
    }
    
    public String getNumeroControle() {
        return numeroControle;
    }
    
    public ClientePremium getCliente() {
        return cliente;
    }
    
    public List<ItemPedido> getItens() {
        return new ArrayList<>(itens);  // Cópia defensiva
    }
    
    // Getters booleanos (começam com 'is')
    public boolean isAtivo() {
        return ativo;
    }
    
    public boolean isEntregaRealizada() {
        return entregaRealizada;
    }
    
    // Setters (camelCase, começam com 'set')
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setNumeroControle(String numeroControle) {
        this.numeroControle = numeroControle;
    }
    
    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
    
    // Métodos de negócio (camelCase, verbos)
    public void adicionarItem(ItemPedido item) {
        if (itens.size() >= MAX_ITENS_POR_PEDIDO) {
            throw new IllegalStateException("Número máximo de itens atingido");
        }
        itens.add(item);
    }
    
    public void removerItem(ItemPedido item) {
        itens.remove(item);
    }
    
    public BigDecimal calcularValorTotal() {
        BigDecimal total = BigDecimal.ZERO;
        for (ItemPedido item : itens) {
            total = total.add(item.calcularSubtotal());
        }
        return total.add(TAXA_ENTREGA_PADRAO);
    }
    
    public boolean podeSerFinalizado() {
        return ativo && !itens.isEmpty();
    }
    
    public void finalizarPedido() {
        if (!podeSerFinalizado()) {
            throw new IllegalStateException("Pedido não pode ser finalizado");
        }
        this.ativo = false;
    }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Convenções NÃO são Regras

**Compilador aceita qualquer nome válido**:
```java
public class minha_classe { }  // ✅ Compila (mas viola convenção)
public void METODO() { }       // ✅ Compila (mas viola convenção)
int Variavel;                  // ✅ Compila (mas viola convenção)
```

**Problema**: Código funciona, mas não é profissional.

### Ferramentas de Análise Estática

**Checkstyle**, **PMD**, **SonarQube**: Detectam violações de convenções

**Exemplo Checkstyle**:
```xml
<module name="TypeName">  <!-- Verifica nomes de classes -->
    <property name="format" value="^[A-Z][a-zA-Z0-9]*$"/>
</module>
<module name="MethodName">  <!-- Verifica nomes de métodos -->
    <property name="format" value="^[a-z][a-zA-Z0-9]*$"/>
</module>
```

---

## 🔗 Interconexões Conceituais

**Próximo Tópico**: **Indentação e Formatação** - Como organizar visualmente código seguindo convenções.

---

## 🚀 Evolução

**Futuro**: Ferramentas AI sugerem nomes baseados em contexto (GitHub Copilot, ChatGPT).
