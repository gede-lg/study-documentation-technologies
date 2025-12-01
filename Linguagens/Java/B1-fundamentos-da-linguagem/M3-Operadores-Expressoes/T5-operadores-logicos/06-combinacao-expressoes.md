# Combinação de Expressões Lógicas

## 🎯 Introdução e Definição

### Definição Conceitual

**Combinação de expressões lógicas** refere-se à prática de **unir múltiplos operadores lógicos** (`&&`, `||`, `!`) e **expressões booleanas** em uma única expressão complexa, criando condições sofisticadas para controle de fluxo e validação.

**Sintaxe geral**:
```java
boolean resultado = (expr1 op1 expr2) op2 (expr3 op3 expr4);
```

**Exemplo**:
```java
int idade = 25;
boolean temCarteira = true;
boolean temCarro = false;

// Combinação: AND + OR + NOT
boolean podeDirigir = (idade >= 18 && temCarteira) || !temCarro;
System.out.println(podeDirigir);  // true
```

### Características Fundamentais

- 🔗 **Composição**: Múltiplos operadores em uma expressão
- 📐 **Precedência**: NOT (`!`) > AND (`&&`) > OR (`||`)
- 🎯 **Parênteses**: Controlam ordem de avaliação
- ⚡ **Short-circuit**: Aplicado em cascata
- 💡 **Uso comum**: Validações complexas, regras de negócio

---

## 📋 Sumário Conceitual

### Ordem de Precedência Completa

| Prioridade | Operador | Descrição | Associatividade |
|-----------|----------|-----------|-----------------|
| 1 (maior) | `!` | NOT (negação) | Direita → Esquerda |
| 2 | `&&` | AND (conjunção) | Esquerda → Direita |
| 3 (menor) | `\|\|` | OR (disjunção) | Esquerda → Direita |

**Exemplo**:
```java
// !A && B || C é interpretado como:
// ((!A) && B) || C

boolean resultado = !false && true || false;
//                  (!false) && true || false
//                    true   && true || false
//                  (true && true) || false
//                       true       || false
//                            true
```

---

## 🧠 Fundamentos Teóricos

### 1. Combinação Simples: AND + OR

**Sem parênteses (precedência implícita)**:
```java
boolean a = true;
boolean b = false;
boolean c = true;

// && tem precedência sobre ||
boolean resultado = a && b || c;
//                  (a && b) || c
//                  (true && false) || true
//                      false       || true
//                           true

System.out.println(resultado);  // true
```

**Com parênteses (ordem explícita)**:
```java
boolean a = true;
boolean b = false;
boolean c = true;

// || executado primeiro (parênteses)
boolean resultado = a && (b || c);
//                  true && (false || true)
//                  true &&     true
//                       true

System.out.println(resultado);  // true
```

### 2. Combinação com NOT

**NOT no início**:
```java
boolean a = false;
boolean b = true;

// ! tem maior precedência
boolean resultado = !a && b;
//                  (!a) && b
//                  true && true
//                     true

System.out.println(resultado);  // true
```

**NOT em sub-expressão**:
```java
boolean a = true;
boolean b = true;

// Negação de toda a expressão
boolean resultado = !(a && b);
//                  !(true && true)
//                  !(true)
//                   false

System.out.println(resultado);  // false
```

**NOT múltiplos**:
```java
boolean a = true;
boolean b = false;

// Cada ! nega sua expressão
boolean resultado = !a || !b;
//                  !true || !false
//                  false || true
//                      true

System.out.println(resultado);  // true (Lei de De Morgan: !(A && B))
```

### 3. Múltiplos ANDs

**Cadeia de ANDs**:
```java
boolean a = true;
boolean b = true;
boolean c = true;
boolean d = false;

// Todos devem ser true
boolean resultado = a && b && c && d;
//                  true && true && true && false
//                  (true && true) && true && false
//                       true      && true && false
//                       (true && true) && false
//                            true      && false
//                                false

System.out.println(resultado);  // false
```

**Short-circuit em cadeia**:
```java
public class CadeiaAND {
    static boolean metodo1() {
        System.out.println("metodo1 executado");
        return true;
    }
    
    static boolean metodo2() {
        System.out.println("metodo2 executado");
        return false;
    }
    
    static boolean metodo3() {
        System.out.println("metodo3 executado");
        return true;
    }
    
    public static void main(String[] args) {
        boolean resultado = metodo1() && metodo2() && metodo3();
        System.out.println("Resultado: " + resultado);
    }
}

// Saída:
// metodo1 executado
// metodo2 executado
// Resultado: false
// (metodo3 NÃO executado devido a short-circuit)
```

### 4. Múltiplos ORs

**Cadeia de ORs**:
```java
boolean a = false;
boolean b = false;
boolean c = true;
boolean d = false;

// Pelo menos uma deve ser true
boolean resultado = a || b || c || d;
//                  false || false || true || (não avaliado)
//                       true

System.out.println(resultado);  // true
```

**Short-circuit em cadeia**:
```java
public class CadeiaOR {
    static boolean metodo1() {
        System.out.println("metodo1 executado");
        return false;
    }
    
    static boolean metodo2() {
        System.out.println("metodo2 executado");
        return true;
    }
    
    static boolean metodo3() {
        System.out.println("metodo3 executado");
        return false;
    }
    
    public static void main(String[] args) {
        boolean resultado = metodo1() || metodo2() || metodo3();
        System.out.println("Resultado: " + resultado);
    }
}

// Saída:
// metodo1 executado
// metodo2 executado
// Resultado: true
// (metodo3 NÃO executado devido a short-circuit)
```

### 5. Combinação AND + OR + NOT

**Expressão complexa**:
```java
boolean usuarioAtivo = true;
boolean isAdmin = false;
boolean isModerador = true;
boolean bloqueado = false;

// Pode acessar se:
// - Usuário está ativo E (é admin OU moderador) E NÃO está bloqueado
boolean podeAcessar = usuarioAtivo && (isAdmin || isModerador) && !bloqueado;
//                    true && (false || true) && !false
//                    true &&     true        &&  true
//                    (true && true) && true
//                         true      && true
//                              true

System.out.println(podeAcessar);  // true
```

**Precedência sem parênteses**:
```java
// ! > && > ||
boolean resultado = !false && true || false;
//                  (!false) && true || false
//                    true   && true || false
//                  (true && true) || false
//                       true       || false
//                            true

System.out.println(resultado);  // true
```

### 6. Validações em Cascata com Short-Circuit

**Verificação de null antes de acessar**:
```java
public class ValidadorCascata {
    static class Pedido {
        Cliente cliente;
    }
    
    static class Cliente {
        Endereco endereco;
    }
    
    static class Endereco {
        String cidade;
    }
    
    public static boolean isCidadeSaoPaulo(Pedido pedido) {
        // Validação em cascata (cada nível verifica null)
        return pedido != null &&
               pedido.cliente != null &&
               pedido.cliente.endereco != null &&
               pedido.cliente.endereco.cidade != null &&
               pedido.cliente.endereco.cidade.equals("São Paulo");
    }
}
```

**Múltiplas condições de validação**:
```java
public class ValidadorUsuario {
    public boolean isUsuarioValido(Usuario usuario) {
        // Todas condições devem ser verdadeiras
        return usuario != null &&
               usuario.getNome() != null && !usuario.getNome().isEmpty() &&
               usuario.getEmail() != null && usuario.getEmail().contains("@") &&
               usuario.getIdade() >= 18 &&
               usuario.isAtivo();
    }
}
```

### 7. Combinação com Comparações

**Operadores relacionais + lógicos**:
```java
int idade = 25;
double salario = 3500.0;
int anosEmpresa = 3;

// Aprovado para empréstimo se:
// - Idade entre 21 e 65 E
// - Salário > 2000 E
// - Mais de 2 anos na empresa
boolean aprovado = (idade >= 21 && idade <= 65) &&
                   salario > 2000 &&
                   anosEmpresa > 2;

System.out.println(aprovado);  // true
```

**Faixas e intervalos**:
```java
int nota = 75;

// Nota entre 60 e 100 (aprovado)
boolean aprovado = nota >= 60 && nota <= 100;

// Nota excepcional (90-100) ou recuperação (50-59)
boolean notaEspecial = (nota >= 90 && nota <= 100) || 
                       (nota >= 50 && nota <= 59);
```

### 8. Lei de De Morgan em Combinações

**Transformação de expressões**:
```java
boolean a = true;
boolean b = false;
boolean c = true;

// !(A && B) = !A || !B
boolean resultado1 = !(a && b);      // !(true && false) = true
boolean resultado2 = !a || !b;       // false || true = true
System.out.println(resultado1 == resultado2);  // true

// !(A || B) = !A && !B
boolean resultado3 = !(a || b);      // !(true || false) = false
boolean resultado4 = !a && !b;       // false && true = false
System.out.println(resultado3 == resultado4);  // true

// Complexo: !(A && B || C)
boolean resultado5 = !(a && b || c);           // !(false || true) = false
boolean resultado6 = (!a || !b) && !c;         // (false || true) && false = false
System.out.println(resultado5 == resultado6);  // true
```

**Simplificação prática**:
```java
// ❌ Complexo
if (!(usuarioAtivo && temPermissao)) {
    System.out.println("Acesso negado");
}

// ✅ Simplificado com De Morgan
if (!usuarioAtivo || !temPermissao) {
    System.out.println("Acesso negado");
}
```

### 9. Expressões com Parênteses Aninhados

**Múltiplos níveis**:
```java
boolean a = true;
boolean b = false;
boolean c = true;
boolean d = false;

// ((A || B) && C) || D
boolean resultado = ((a || b) && c) || d;
//                  ((true || false) && true) || false
//                  (    true        && true) || false
//                           true             || false
//                                true

System.out.println(resultado);  // true
```

**Regras de negócio complexas**:
```java
public class ValidadorDesconto {
    public boolean temDesconto(int idade, boolean clienteVIP, 
                               boolean primeiraCompra, double valorCompra) {
        // Desconto se:
        // - (Idoso OU criança) E não é VIP
        // OU
        // - Primeira compra E valor > 100
        return ((idade < 12 || idade >= 65) && !clienteVIP) ||
               (primeiraCompra && valorCompra > 100);
    }
}
```

### 10. Combinação com Operador Ternário

**Operador ternário em expressões lógicas**:
```java
int idade = 20;
boolean temCarteira = true;

// Pode dirigir se maior de idade E tem carteira
String resultado = (idade >= 18 && temCarteira) ? "Pode dirigir" : "Não pode dirigir";
System.out.println(resultado);  // "Pode dirigir"
```

**Ternário aninhado com lógica**:
```java
int nota = 75;

String conceito = (nota >= 90) ? "A" :
                  (nota >= 80) ? "B" :
                  (nota >= 70) ? "C" :
                  (nota >= 60) ? "D" : "F";

System.out.println(conceito);  // "C"

// Equivalente com if-else
String conceito2;
if (nota >= 90) {
    conceito2 = "A";
} else if (nota >= 80) {
    conceito2 = "B";
} else if (nota >= 70) {
    conceito2 = "C";
} else if (nota >= 60) {
    conceito2 = "D";
} else {
    conceito2 = "F";
}
```

---

## 🔍 Análise Conceitual Profunda

### Precedência Detalhada

**Ordem completa de operadores (maior para menor)**:
```java
1. !                    (NOT - unário)
2. *, /, %              (Multiplicação, divisão, módulo)
3. +, -                 (Adição, subtração)
4. <, <=, >, >=         (Relacionais)
5. ==, !=               (Igualdade, diferença)
6. &&                   (AND lógico)
7. ||                   (OR lógico)
8. ? :                  (Ternário)
9. =, +=, -=, etc.      (Atribuição)
```

**Exemplo completo**:
```java
int x = 10;
int y = 5;
boolean a = true;

boolean resultado = x > 5 && y < 10 || !a;
//                  (x > 5) && (y < 10) || (!a)  // Precedência implícita
//                  (10 > 5) && (5 < 10) || (!true)
//                    true   &&   true   ||  false
//                  (true && true) || false
//                       true       || false
//                            true

System.out.println(resultado);  // true
```

### Short-Circuit em Combinações

**Avaliação preguiçosa (lazy evaluation)**:
```java
// A && B && C
// - Se A é false, B e C NÃO são avaliados
// - Se A é true e B é false, C NÃO é avaliado

// A || B || C
// - Se A é true, B e C NÃO são avaliados
// - Se A é false e B é true, C NÃO é avaliado
```

**Exemplo prático**:
```java
public class ShortCircuitComplexo {
    static boolean cara1() {
        System.out.println("cara1");
        return false;
    }
    
    static boolean cara2() {
        System.out.println("cara2");
        return true;
    }
    
    static boolean cara3() {
        System.out.println("cara3");
        return false;
    }
    
    public static void main(String[] args) {
        // (false && true) || false
        boolean resultado = (cara1() && cara2()) || cara3();
        System.out.println("Resultado: " + resultado);
    }
}

// Saída:
// cara1 (executado)
// cara3 (executado - porque (cara1() && cara2()) é false)
// Resultado: false
// cara2 NÃO executado (short-circuit do AND)
```

### Legibilidade vs Concisão

**❌ Muito complexo (evitar)**:
```java
if ((a && b || c) && !(d || e) && (f && g || h && i)) {
    // Difícil de entender!
}
```

**✅ Quebrado em partes (preferir)**:
```java
boolean condicao1 = (a && b) || c;
boolean condicao2 = !(d || e);
boolean condicao3 = (f && g) || (h && i);

if (condicao1 && condicao2 && condicao3) {
    // Claro e manutenível
}
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação de Formulário

```java
public class ValidadorFormulario {
    public boolean validarCadastro(String nome, String email, 
                                   String senha, int idade) {
        // Todas condições devem ser verdadeiras
        return nome != null && !nome.trim().isEmpty() &&
               email != null && email.contains("@") && email.contains(".") &&
               senha != null && senha.length() >= 8 &&
               idade >= 18 && idade <= 120;
    }
}
```

### Caso 2: Sistema de Permissões

```java
public class SistemaPermissoes {
    public boolean podeEditar(Usuario usuario, Documento doc) {
        // Pode editar se:
        // - É o autor OU
        // - É admin OU
        // - É moderador E documento não está bloqueado
        return usuario.getId().equals(doc.getAutorId()) ||
               usuario.isAdmin() ||
               (usuario.isModerador() && !doc.isBloqueado());
    }
}
```

### Caso 3: Cálculo de Desconto

```java
public class CalculadoraDesconto {
    public boolean temDesconto(Cliente cliente, double valorCompra) {
        // Desconto se:
        // - Cliente VIP OU
        // - (Primeira compra E valor > 100) OU
        // - (Idoso E valor > 50)
        return cliente.isVIP() ||
               (cliente.isPrimeiraCompra() && valorCompra > 100) ||
               (cliente.getIdade() >= 65 && valorCompra > 50);
    }
}
```

### Caso 4: Validação de Acesso a Recursos

```java
public class ControladorAcesso {
    public boolean podeAcessarRecurso(Usuario usuario, Recurso recurso) {
        // Validações em cascata
        boolean usuarioValido = usuario != null && usuario.isAtivo();
        boolean permissaoValida = usuarioValido && usuario.temPermissao(recurso);
        boolean recursoDisponivel = recurso != null && !recurso.isBloqueado();
        boolean horarioPermitido = recurso.getHorarioInicio() <= horaAtual() &&
                                   horaAtual() <= recurso.getHorarioFim();
        
        return permissaoValida && recursoDisponivel && horarioPermitido;
    }
}
```

### Caso 5: Filtros Complexos

```java
public class FiltroProduto {
    public List<Produto> filtrar(List<Produto> produtos, 
                                  double precoMin, double precoMax,
                                  String categoria, boolean emEstoque) {
        return produtos.stream()
            .filter(p -> 
                // Preço no intervalo
                (p.getPreco() >= precoMin && p.getPreco() <= precoMax) &&
                // Categoria corresponde (ou filtro desabilitado)
                (categoria == null || p.getCategoria().equals(categoria)) &&
                // Em estoque (ou filtro desabilitado)
                (!emEstoque || p.getEstoque() > 0)
            )
            .collect(Collectors.toList());
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Complexidade Excessiva

**Problema**: Expressões muito longas são difíceis de ler.
```java
// ❌ Muito complexo
if (a && b || c && d || e && f && g || h) { }

// ✅ Quebre em partes
boolean parte1 = a && b;
boolean parte2 = c && d;
boolean parte3 = e && f && g;
if (parte1 || parte2 || parte3 || h) { }
```

### 2. Parênteses Esquecidos

**Problema**: Ordem de avaliação errada.
```java
// ❌ Sem parênteses: && tem precedência
boolean resultado = a || b && c;  // a || (b && c)

// ✅ Com parênteses: ordem explícita
boolean resultado = (a || b) && c;
```

### 3. Efeitos Colaterais em Cadeia

**Problema**: Short-circuit impede execução.
```java
int contador = 0;

// contador pode não incrementar (short-circuit)
if (false && ++contador > 0) { }
System.out.println(contador);  // 0

// ✅ Separe efeitos colaterais
contador++;
if (false && contador > 0) { }
```

### 4. Negações Confusas

**Problema**: Múltiplas negações complicam leitura.
```java
// ❌ Confuso
if (!!(!a && !b)) { }

// ✅ Simplifique
if (!a && !b) { }
```

### 5. Falta de Documentação

**Problema**: Lógica complexa sem explicação.
```java
// ❌ O que essa condição faz?
if ((a && b || c) && !(d || e)) { }

// ✅ Documente
// Acesso permitido se (usuário ativo E premium) OU admin
// E NÃO está (bloqueado OU suspenso)
if ((usuarioAtivo && premium || admin) && !(bloqueado || suspenso)) { }
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Operadores lógicos**: AND, OR, NOT
- **Short-circuit evaluation**: Otimização em cascata
- **Precedência de operadores**: Ordem de avaliação
- **Lei de De Morgan**: Simplificação de expressões
- **Tabelas verdade**: Validação de equivalência
- **Álgebra booleana**: Base matemática
- **Clean Code**: Legibilidade e manutenibilidade

---

## 🚀 Boas Práticas

1. ✅ **Use parênteses para clareza**
   ```java
   if ((a && b) || (c && d)) {  // ✅ Explícito
       // ...
   }
   ```

2. ✅ **Quebre expressões complexas**
   ```java
   boolean usuarioValido = usuario != null && usuario.isAtivo();
   boolean temPermissao = usuarioValido && usuario.isAdmin();
   
   if (temPermissao) {  // ✅ Legível
       // ...
   }
   ```

3. ✅ **Nomeie sub-expressões**
   ```java
   boolean dentroIntervalo = x >= min && x <= max;
   boolean valorValido = dentroIntervalo && x != 0;
   ```

4. ✅ **Documente lógica não óbvia**
   ```java
   // Desconto para idosos (>= 65) OU crianças (< 12)
   boolean temDesconto = idade >= 65 || idade < 12;
   ```

5. ✅ **Evite negações excessivas**
   ```java
   // ❌ Confuso
   if (!(!a && !b)) { }
   
   // ✅ Use De Morgan
   if (a || b) { }
   ```

6. ✅ **Prefira métodos auxiliares**
   ```java
   boolean isUsuarioValido(Usuario u) {
       return u != null && u.isAtivo() && u.temPermissao();
   }
   ```

7. ✅ **Use constantes para valores mágicos**
   ```java
   final int IDADE_MINIMA = 18;
   final int IDADE_MAXIMA = 65;
   
   boolean idadeValida = idade >= IDADE_MINIMA && idade <= IDADE_MAXIMA;
   ```

8. ✅ **Valide com tabelas verdade**
   ```java
   // Para expressões complexas, valide todas combinações
   ```

9. ✅ **Evite aninhamento profundo**
   ```java
   // ❌ Evitar
   if (a) {
       if (b) {
           if (c) { }
       }
   }
   
   // ✅ Prefira
   if (a && b && c) { }
   ```

10. ✅ **Combine com Optional para null-safety**
    ```java
    Optional.ofNullable(usuario)
            .filter(u -> u.isAtivo() && u.temPermissao())
            .ifPresent(u -> processar(u));
    ```
