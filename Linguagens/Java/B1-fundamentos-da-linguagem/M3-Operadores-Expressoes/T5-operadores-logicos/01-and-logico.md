# AND Lógico (&&)

## 🎯 Introdução e Definição

### Definição Conceitual

O **operador AND lógico (`&&`)** em Java realiza a **conjunção lógica** entre duas expressões booleanas, retornando `true` **somente se ambas as expressões forem verdadeiras**. É um operador binário que implementa a operação lógica **E**.

**Sintaxe**:
```java
boolean resultado = expressão1 && expressão2;
```

**Tabela de verdade básica**:
| expressão1 | expressão2 | expressão1 && expressão2 |
|-----------|-----------|------------------------|
| true      | true      | **true**               |
| true      | false     | false                  |
| false     | true      | false                  |
| false     | false     | false                  |

**Exemplo básico**:
```java
int idade = 25;
boolean temCarteira = true;

// Pode dirigir se tem idade >= 18 E tem carteira
boolean podeDirigir = (idade >= 18) && temCarteira;
System.out.println(podeDirigir);  // true (ambas condições verdadeiras)
```

### Características Fundamentais

- 🔍 **Conjunção lógica**: Retorna `true` apenas se **ambas** forem `true`
- ⚡ **Short-circuit**: Avalia segunda expressão **somente se a primeira for `true`**
- 📊 **Tipo de retorno**: Sempre `boolean`
- 🎯 **Precedência**: Menor que relacionais, maior que OR (`||`)
- 💡 **Uso comum**: Validações com múltiplas condições obrigatórias

---

## 📋 Sumário Conceitual

### Comparação AND (&) vs AND lógico (&&)

| Aspecto | `&&` (AND lógico) | `&` (AND bit a bit) |
|---------|------------------|-------------------|
| **Tipo de operação** | Lógica | Bit a bit |
| **Short-circuit** | ✅ Sim | ❌ Não |
| **Uso principal** | Condições booleanas | Manipulação de bits |
| **Eficiência** | Maior (para true/false) | Menor (avalia tudo) |
| **Aplicação** | if, while, validações | Máscaras, flags |

---

## 🧠 Fundamentos Teóricos

### 1. Comportamento Básico

**Todas as combinações**:
```java
boolean a = true;
boolean b = true;
System.out.println(a && b);  // true (ambas true)

a = true;
b = false;
System.out.println(a && b);  // false (b é false)

a = false;
b = true;
System.out.println(a && b);  // false (a é false)

a = false;
b = false;
System.out.println(a && b);  // false (ambas false)
```

**Com expressões**:
```java
int x = 10;
int y = 5;

boolean resultado = (x > 5) && (y < 10);
//                   true   &&   true    = true

System.out.println(resultado);  // true
```

### 2. Short-Circuit Evaluation

**Conceito fundamental**:
```java
// Se a primeira expressão é false, a segunda NÃO é avaliada
boolean resultado = (5 > 10) && (10 / 0 > 1);
//                    false   && (não avaliado)
//                    = false (sem erro!)

System.out.println(resultado);  // false (sem ArithmeticException)
```

**Demonstração com método**:
```java
public class ShortCircuit {
    static boolean primeiraCondicao() {
        System.out.println("Primeira condição avaliada");
        return false;
    }
    
    static boolean segundaCondicao() {
        System.out.println("Segunda condição avaliada");
        return true;
    }
    
    public static void main(String[] args) {
        boolean resultado = primeiraCondicao() && segundaCondicao();
        System.out.println("Resultado: " + resultado);
    }
}

// Saída:
// Primeira condição avaliada
// Resultado: false
// (segundaCondicao() NÃO foi executada!)
```

**Comparação com &**:
```java
// && (short-circuit)
boolean resultado1 = false && (10 / 0 > 1);  // OK (não avalia 10/0)

// & (sem short-circuit)
// boolean resultado2 = false & (10 / 0 > 1);  // ❌ ArithmeticException!
```

### 3. Validação de Múltiplas Condições

**Exemplo: verificação de intervalo**:
```java
int idade = 25;

// Verifica se idade está entre 18 e 65
boolean idadeValida = (idade >= 18) && (idade <= 65);
System.out.println(idadeValida);  // true
```

**Exemplo: validação de String**:
```java
String nome = "João";

// Verifica se nome não é null E não é vazio
boolean nomeValido = (nome != null) && (!nome.isEmpty());
System.out.println(nomeValido);  // true
```

**Importância da ordem (short-circuit)**:
```java
String texto = null;

// ✅ CORRETO: verifica null primeiro
if (texto != null && texto.length() > 0) {
    System.out.println("Texto válido");
}
// Não executa o bloco, mas não lança NullPointerException

// ❌ ERRADO: se inverter a ordem
// if (texto.length() > 0 && texto != null) {
//     System.out.println("Texto válido");
// }
// Lança NullPointerException! (texto.length() é avaliado primeiro)
```

### 4. Combinação com Operadores Relacionais

**Verificação de faixa numérica**:
```java
int nota = 75;

// Nota entre 60 e 100 (aprovado)
boolean aprovado = (nota >= 60) && (nota <= 100);
System.out.println(aprovado);  // true
```

**Múltiplas comparações**:
```java
int a = 10;
int b = 20;
int c = 15;

// a < c < b (em matemática: 10 < 15 < 20)
boolean resultado = (a < c) && (c < b);
System.out.println(resultado);  // true
```

### 5. Validação de Objetos

**Verificação de null antes de métodos**:
```java
public class Pessoa {
    private String nome;
    
    public boolean nomeComecaComA() {
        // ✅ Verifica null primeiro (short-circuit)
        return nome != null && nome.startsWith("A");
    }
}
```

**Validação de múltiplos campos**:
```java
public class Usuario {
    private String username;
    private String password;
    
    public boolean isValido() {
        return (username != null && !username.isEmpty()) &&
               (password != null && password.length() >= 8);
    }
}
```

### 6. Uso em Estruturas de Controle

**if com múltiplas condições**:
```java
int idade = 20;
boolean temCarteira = true;
boolean temCarro = true;

if (idade >= 18 && temCarteira && temCarro) {
    System.out.println("Pode dirigir");
}
```

**while com validação**:
```java
Scanner scanner = new Scanner(System.in);
int tentativas = 0;
boolean acertou = false;

while (tentativas < 3 && !acertou) {
    System.out.print("Digite a senha: ");
    String senha = scanner.nextLine();
    
    if (senha.equals("1234")) {
        acertou = true;
    }
    tentativas++;
}
```

**for com múltiplas condições**:
```java
for (int i = 0; i < 10 && i * i < 50; i++) {
    System.out.println(i);
}
// Executa enquanto i < 10 E i² < 50
// Para em i = 7 (7² = 49 < 50, mas 8² = 64 > 50)
```

### 7. Expressões Complexas

**Múltiplos ANDs**:
```java
boolean a = true;
boolean b = true;
boolean c = false;
boolean d = true;

boolean resultado = a && b && c && d;
//                  true && true && false && (não avaliado)
//                  = false

System.out.println(resultado);  // false
```

**Combinação com parênteses**:
```java
int x = 10;
int y = 5;

// (x > 5 && y > 3) equivale a (true && true) = true
boolean resultado = (x > 5) && (y > 3);
System.out.println(resultado);  // true
```

### 8. Otimização com Short-Circuit

**Evitar operações caras**:
```java
public class Otimizacao {
    static boolean condicaoRapida() {
        return false;  // Rápida
    }
    
    static boolean condicaoLenta() {
        // Operação cara: acesso a banco, cálculo complexo, etc.
        try {
            Thread.sleep(1000);  // Simula operação lenta
        } catch (InterruptedException e) { }
        return true;
    }
    
    public static void main(String[] args) {
        // ✅ Coloque condição rápida PRIMEIRO
        if (condicaoRapida() && condicaoLenta()) {
            System.out.println("Ambas true");
        }
        // condicaoLenta() NÃO é executada (short-circuit)
        // Economiza 1 segundo!
    }
}
```

### 9. Diferença entre && e &

**&& (short-circuit)**:
```java
int x = 0;
boolean resultado = (x != 0) && (10 / x > 5);
//                    false   && (não avaliado)
System.out.println(resultado);  // false (sem erro)
```

**& (sem short-circuit)**:
```java
int x = 0;
// boolean resultado = (x != 0) & (10 / x > 5);
//                      false   &  ArithmeticException!
// ❌ ERRO: sempre avalia ambos os lados
```

**Quando usar &**:
```java
// Quando efeitos colaterais DEVEM ocorrer
boolean a = metodo1() & metodo2();
// Ambos metodo1() e metodo2() são SEMPRE executados
// Útil quando ambos têm efeitos colaterais necessários
```

### 10. Precedência e Associatividade

**Precedência**:
```java
// && tem precedência MENOR que relacionais
boolean resultado = 5 > 3 && 10 < 20;
//                  (5 > 3) && (10 < 20)  (parênteses implícitos)
//                    true  &&   true
System.out.println(resultado);  // true
```

**Associatividade (esquerda para direita)**:
```java
boolean resultado = true && false && true;
//                  (true && false) && true
//                     false        && true
//                          false
System.out.println(resultado);  // false
```

**Com outros operadores**:
```java
// ! (NOT) tem precedência MAIOR que &&
boolean resultado = !false && true;
//                  (!false) && true
//                    true   && true
System.out.println(resultado);  // true
```

---

## 🔍 Análise Conceitual Profunda

### Por que Short-Circuit é Importante?

**1. Previne erros**:
```java
String texto = null;

// ✅ Seguro: short-circuit previne NullPointerException
if (texto != null && texto.length() > 0) {
    System.out.println(texto);
}

// ❌ Erro: se usar &
// if (texto != null & texto.length() > 0) {  // NPE!
```

**2. Otimização de performance**:
```java
// Condição cara é evitada se a primeira for false
if (condicaoRapida() && operacaoCara()) {
    // ...
}
```

### AND Lógico na Álgebra Booleana

**Propriedades**:
```java
// Identidade: A && true = A
boolean a = false;
System.out.println(a && true);  // false

// Anulação: A && false = false
System.out.println(a && false);  // false

// Idempotência: A && A = A
System.out.println(a && a);  // false

// Comutatividade: A && B = B && A (em valor, não em execução)
boolean b = true;
System.out.println(a && b);  // false
System.out.println(b && a);  // false
```

### Quando NÃO Usar Short-Circuit

**Quando efeitos colaterais importam**:
```java
int contador1 = 0;
int contador2 = 0;

// && (short-circuit): contador2 NÃO é incrementado se primeira é false
boolean resultado1 = (false) && (++contador2 > 0);
System.out.println(contador2);  // 0 (não incrementado)

// & (sem short-circuit): contador2 É incrementado sempre
boolean resultado2 = (false) & (++contador1 > 0);
System.out.println(contador1);  // 1 (incrementado)
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação de Formulário

```java
public class ValidadorFormulario {
    public boolean validarCadastro(String nome, String email, int idade) {
        return (nome != null && !nome.isEmpty()) &&
               (email != null && email.contains("@")) &&
               (idade >= 18 && idade <= 120);
    }
}
```

### Caso 2: Controle de Acesso

```java
public class SistemaAcesso {
    public boolean podeAcessar(Usuario usuario, Recurso recurso) {
        return usuario != null &&
               usuario.isAtivo() &&
               usuario.temPermissao(recurso);
    }
}
```

### Caso 3: Validação de Intervalo

```java
public class ValidadorNota {
    public boolean notaValida(double nota) {
        return (nota >= 0.0) && (nota <= 10.0);
    }
    
    public boolean aprovado(double nota) {
        return notaValida(nota) && (nota >= 6.0);
    }
}
```

### Caso 4: Filtro de Dados

```java
public class FiltroProduto {
    public List<Produto> filtrar(List<Produto> produtos, 
                                  double precoMin, double precoMax) {
        return produtos.stream()
            .filter(p -> p.getPreco() >= precoMin && 
                         p.getPreco() <= precoMax)
            .collect(Collectors.toList());
    }
}
```

### Caso 5: Validação de Data

```java
public class ValidadorData {
    public boolean dataValida(int dia, int mes, int ano) {
        return (dia >= 1 && dia <= 31) &&
               (mes >= 1 && mes <= 12) &&
               (ano >= 1900 && ano <= 2100);
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Ordem Importa com Short-Circuit

**Problema**: Ordem errada causa exceções.
```java
String texto = null;

// ❌ ERRADO: NullPointerException
// if (texto.length() > 0 && texto != null) { }

// ✅ CORRETO: verificar null primeiro
if (texto != null && texto.length() > 0) { }
```

### 2. Efeitos Colaterais Não Executados

**Problema**: Segunda expressão pode não executar.
```java
int contador = 0;

// contador NÃO é incrementado (short-circuit)
boolean resultado = false && (++contador > 0);
System.out.println(contador);  // 0

// ✅ Se precisa executar, use &
boolean resultado2 = false & (++contador > 0);
System.out.println(contador);  // 1
```

### 3. Legibilidade com Múltiplas Condições

**Problema**: Expressões longas ficam confusas.
```java
// ❌ Difícil de ler
if (a && b && c && d && e && f) { }

// ✅ Quebre em múltiplas linhas
if (a && b && c &&
    d && e && f) { }

// ✅ Ou use variáveis intermediárias
boolean condicao1 = a && b && c;
boolean condicao2 = d && e && f;
if (condicao1 && condicao2) { }
```

### 4. Confundir && com &

**Problema**: Usar & quando deveria usar &&.
```java
// ❌ Menos eficiente e pode causar erros
if (x != 0 & 10 / x > 5) {  // Sempre avalia 10/x
    // ...
}

// ✅ Use && para condições booleanas
if (x != 0 && 10 / x > 5) {  // Short-circuit seguro
    // ...
}
```

### 5. Não Funciona com Valores Não-Booleanos

**Problema**: Java exige boolean explícito.
```java
int x = 10;

// ❌ ERRO: não pode usar int como boolean
// if (x && x > 5) { }

// ✅ Conversão explícita
if (x != 0 && x > 5) { }
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Operador OR (`||`)**: Disjunção lógica (ao menos uma true)
- **Operador NOT (`!`)**: Negação lógica
- **Short-circuit evaluation**: Otimização de avaliação
- **Operadores relacionais**: Produzem valores booleanos para &&
- **Tabelas verdade**: Definição formal de operações lógicas
- **Álgebra booleana**: Fundamento matemático
- **Precedência de operadores**: Ordem de avaliação

---

## 🚀 Boas Práticas

1. ✅ **Coloque condições baratas primeiro**
   ```java
   if (condicaoRapida() && condicaoCara()) {  // ✅ Otimizado
       // ...
   }
   ```

2. ✅ **Verifique null antes de usar objeto**
   ```java
   if (objeto != null && objeto.metodo()) {  // ✅ Seguro
       // ...
   }
   ```

3. ✅ **Use parênteses para clareza**
   ```java
   if ((x > 5) && (y < 10)) {  // ✅ Mais legível
       // ...
   }
   ```

4. ✅ **Quebre expressões longas**
   ```java
   boolean condicaoValida = (idade >= 18) &&
                            (temCarteira) &&
                            (aprovado);  // ✅ Legível
   ```

5. ✅ **Evite efeitos colaterais em condições**
   ```java
   // ❌ Evitar
   if (true && ++contador > 0) { }
   
   // ✅ Preferir
   contador++;
   if (true && contador > 0) { }
   ```

6. ✅ **Use && (não &) para condições booleanas**
   ```java
   if (a && b) {  // ✅ Short-circuit
       // ...
   }
   ```

7. ✅ **Nomeie condições complexas**
   ```java
   boolean usuarioValido = usuario != null && usuario.isAtivo();
   boolean temPermissao = usuarioValido && usuario.isAdmin();
   
   if (temPermissao) {  // ✅ Claro e autoexplicativo
       // ...
   }
   ```

8. ✅ **Documente lógica não óbvia**
   ```java
   // Verifica se usuário é admin E tem mais de 18 anos
   if (usuario.isAdmin() && usuario.getIdade() >= 18) {
       // ...
   }
   ```

9. ✅ **Evite ANDs aninhados desnecessários**
   ```java
   // ❌ Redundante
   if (a) {
       if (b) {
           // ...
       }
   }
   
   // ✅ Simplifique
   if (a && b) {
       // ...
   }
   ```

10. ✅ **Combine com operador ternário com cautela**
    ```java
    // ✅ Aceitável se simples
    String resultado = (a && b) ? "Ambas true" : "Pelo menos uma false";
    ```
