# Condições Booleanas Complexas

## 🎯 Introdução e Definição

### Definição Conceitual

**Condições booleanas complexas** são expressões que combinam **múltiplas condições** usando **operadores lógicos** (&&, ||, !), **operadores relacionais** (<, >, ==, !=, <=, >=), e **parênteses** para criar lógica de decisão **sofisticada**. São fundamentais para estruturas condicionais (`if`, `while`, `for`), mas requerem cuidado para manter **legibilidade** e **corretude**.

**Exemplo fundamental**:
```java
// Condição complexa
if (idade >= 18 && (temCarteira || temPermissaoEspecial) && !temMultasGraves) {
    permitirDirigir();
}
```

**Analogia**: É como uma **sentença lógica** em português: "Se a pessoa é maior de idade E (tem carteira OU tem permissão especial) E NÃO tem multas graves, então pode dirigir".

**Importância**:
- ✅ Expressa **lógica complexa** de negócio
- ✅ Combina **múltiplos critérios** em uma decisão
- ✅ Reduz **aninhamento** de ifs
- ⚠️ Pode reduzir **legibilidade** se mal escrita
- ⚠️ Requer compreensão de **precedência** e **associatividade**

---

## 📋 Sumário Conceitual

### Componentes de Condições Complexas

**1. Operadores Lógicos**:
- `&&` (AND): Ambos devem ser `true`
- `||` (OR): Pelo menos um deve ser `true`
- `!` (NOT): Inverte o valor booleano

**2. Operadores Relacionais**:
- `>`, `<`, `>=`, `<=`: Comparação numérica
- `==`, `!=`: Igualdade/desigualdade

**3. Parênteses**: Controlam ordem de avaliação

**4. Short-circuit**: Avaliação preguiçosa (&& e ||)

**5. De Morgan's Laws**: Regras de transformação

---

## 🧠 Fundamentos Teóricos

### 1. Combinando Condições com &&

**Operador AND (&&)**: Retorna `true` SOMENTE SE **ambas** as condições forem `true`.

**Tabela verdade**:
| A | B | A && B |
|---|---|--------|
| true | true | **true** |
| true | false | false |
| false | true | false |
| false | false | false |

**Exemplo**:
```java
int idade = 25;
boolean temCarteira = true;

if (idade >= 18 && temCarteira) {
    System.out.println("Pode dirigir");
}
// Resultado: "Pode dirigir" (ambas são true)
```

**Múltiplas condições**:
```java
if (idade >= 18 && idade <= 65 && temCarteira && !temMultas) {
    System.out.println("Pode dirigir sem restrições");
}
// TODAS as 4 condições devem ser true
```

### 2. Combinando Condições com ||

**Operador OR (||)**: Retorna `true` SE **pelo menos uma** das condições for `true`.

**Tabela verdade**:
| A | B | A \|\| B |
|---|---|--------|
| true | true | **true** |
| true | false | **true** |
| false | true | **true** |
| false | false | false |

**Exemplo**:
```java
boolean isAdmin = false;
boolean isModerador = true;

if (isAdmin || isModerador) {
    System.out.println("Tem permissões elevadas");
}
// Resultado: true (pelo menos uma é true)
```

**Múltiplas condições**:
```java
if (dia == 0 || dia == 6 || feriado) {
    System.out.println("Não é dia útil");
}
// Qualquer UMA das 3 condições true resulta em true
```

### 3. Negação com !

**Operador NOT (!)**: Inverte o valor booleano.

**Tabela verdade**:
| A | !A |
|---|----|
| true | **false** |
| false | **true** |

**Exemplo**:
```java
boolean isAtivo = false;

if (!isAtivo) {
    System.out.println("Usuário inativo");
}
// Resultado: "Usuário inativo" (!false = true)
```

**Negação de expressões**:
```java
if (!(idade >= 18)) {
    System.out.println("Menor de idade");
}
// Equivalente a: if (idade < 18)
```

### 4. Precedência de Operadores

**Ordem de avaliação** (maior para menor precedência):
1. **Parênteses** `()`
2. **NOT** `!`
3. **Relacionais** `<`, `>`, `<=`, `>=`
4. **Igualdade** `==`, `!=`
5. **AND** `&&`
6. **OR** `||`

**Exemplo sem parênteses**:
```java
if (x > 5 || y < 10 && z == 0) {
    // Avaliado como: x > 5 || (y < 10 && z == 0)
    // && tem precedência sobre ||
}
```

**Sempre use parênteses para clareza**:
```java
// ✅ Claro
if ((x > 5) || (y < 10 && z == 0)) {
    // Intenção explícita
}

// ✅ Ainda melhor
if (x > 5 || (y < 10 && z == 0)) {
    // Parênteses apenas onde necessário
}
```

### 5. Short-Circuit Evaluation (Avaliação Preguiçosa)

**&& short-circuit**: Se o primeiro operando for `false`, o segundo **NÃO é avaliado**.

```java
if (usuario != null && usuario.isAtivo()) {
    // Se usuario for null, usuario.isAtivo() NÃO é chamado (evita NullPointerException)
}
```

**|| short-circuit**: Se o primeiro operando for `true`, o segundo **NÃO é avaliado**.

```java
if (isAdmin || temPermissaoEspecial()) {
    // Se isAdmin for true, temPermissaoEspecial() NÃO é chamado
}
```

**Importante**:
```java
// ✅ Short-circuit evita erro
if (str != null && str.length() > 5) {
    // Seguro: se str for null, str.length() não é chamado
}

// ❌ Sem short-circuit (usa & em vez de &&)
if (str != null & str.length() > 5) {
    // ERRO: str.length() é SEMPRE chamado, mesmo se str for null
}
```

### 6. Parênteses para Clareza e Controle

**Sem parênteses** (ambíguo):
```java
if (isAdmin || isModerador && isAtivo) {
    // Ambíguo: (isAdmin || isModerador) && isAtivo
    //       ou: isAdmin || (isModerador && isAtivo) ?
}
// Avaliado como: isAdmin || (isModerador && isAtivo)  [&& tem precedência]
```

**Com parênteses** (claro):
```java
// Intenção 1: Admin OU (Moderador E Ativo)
if (isAdmin || (isModerador && isAtivo)) {
    // ...
}

// Intenção 2: (Admin OU Moderador) E Ativo
if ((isAdmin || isModerador) && isAtivo) {
    // ...
}
```

### 7. De Morgan's Laws (Leis de De Morgan)

**Regras de transformação** para simplificar condições negadas:

**Lei 1**: `!(A && B)` = `!A || !B`
```java
// Antes
if (!(idade >= 18 && temCarteira)) {
    System.out.println("Não pode dirigir");
}

// Depois (equivalente)
if (idade < 18 || !temCarteira) {
    System.out.println("Não pode dirigir");
}
```

**Lei 2**: `!(A || B)` = `!A && !B`
```java
// Antes
if (!(isAdmin || isModerador)) {
    System.out.println("Sem permissões elevadas");
}

// Depois (equivalente)
if (!isAdmin && !isModerador) {
    System.out.println("Sem permissões elevadas");
}
```

### 8. Extraindo Condições Complexas

**Problema**: Condição longa e difícil de ler.

```java
// ❌ Condição inline complexa
if (usuario.getIdade() >= 18 && usuario.getIdade() <= 65 && usuario.isPago() 
    && !usuario.isBloqueado() && usuario.getScore() > 500) {
    processar();
}
```

**Solução 1**: Variáveis temporárias descritivas.

```java
// ✅ Variáveis descritivas
boolean isIdadeValida = usuario.getIdade() >= 18 && usuario.getIdade() <= 65;
boolean isContaAtiva = usuario.isPago() && !usuario.isBloqueado();
boolean isScoreBom = usuario.getScore() > 500;

if (isIdadeValida && isContaAtiva && isScoreBom) {
    processar();
}
```

**Solução 2**: Método privado.

```java
// ✅ Método descritivo
if (isUsuarioElegivel(usuario)) {
    processar();
}

private boolean isUsuarioElegivel(Usuario usuario) {
    boolean isIdadeValida = usuario.getIdade() >= 18 && usuario.getIdade() <= 65;
    boolean isContaAtiva = usuario.isPago() && !usuario.isBloqueado();
    boolean isScoreBom = usuario.getScore() > 500;
    
    return isIdadeValida && isContaAtiva && isScoreBom;
}
```

### 9. Condições com Métodos

**Métodos que retornam boolean**:
```java
if (usuario.isAtivo() && usuario.hasPermissao("ADMIN")) {
    // ...
}
```

**Combinando métodos e operadores**:
```java
if (arquivo.exists() && arquivo.canRead() && arquivo.length() > 0) {
    processar(arquivo);
}
```

**Cuidado com NullPointerException**:
```java
// ❌ Pode lançar NullPointerException
if (usuario.getEndereco().getCidade().equals("SP")) {
    // Se getEndereco() ou getCidade() retornar null, erro!
}

// ✅ Verificações de null
if (usuario != null 
    && usuario.getEndereco() != null 
    && "SP".equals(usuario.getEndereco().getCidade())) {
    // Seguro
}
```

### 10. Exemplos Práticos Completos

#### **Validação de Elegibilidade para Empréstimo**

```java
public boolean isElegivelParaEmprestimo(Cliente cliente) {
    // Critérios:
    // - Idade entre 21 e 70 anos
    // - Renda mínima de R$ 2000
    // - Score >= 600 OU (Score >= 400 E tem garantia)
    // - Não estar bloqueado
    
    boolean idadeValida = cliente.getIdade() >= 21 && cliente.getIdade() <= 70;
    boolean rendaValida = cliente.getRenda() >= 2000;
    boolean scoreBom = cliente.getScore() >= 600;
    boolean scoreRazoavelComGarantia = cliente.getScore() >= 400 && cliente.hasGarantia();
    boolean nãoBloqueado = !cliente.isBloqueado();
    
    return idadeValida 
        && rendaValida 
        && (scoreBom || scoreRazoavelComGarantia) 
        && nãoBloqueado;
}
```

#### **Autorização de Acesso a Recurso**

```java
public boolean podeAcessar(Usuario usuario, Recurso recurso) {
    // Pode acessar se:
    // - Usuário está ativo E
    // - (É admin OU é owner do recurso OU recurso é público) E
    // - Não excedeu limite de acessos
    
    if (usuario == null || !usuario.isAtivo()) {
        return false;
    }
    
    boolean isAdmin = usuario.hasRole("ADMIN");
    boolean isOwner = recurso.getOwner().equals(usuario);
    boolean isPublico = recurso.isPublico();
    boolean dentroLimite = usuario.getAcessosDiarios() < 100;
    
    return (isAdmin || isOwner || isPublico) && dentroLimite;
}
```

#### **Cálculo de Desconto com Múltiplos Critérios**

```java
public boolean aplicaDescontoMaximo(Compra compra, Cliente cliente) {
    // Desconto máximo se:
    // - (Cliente premium E valor >= 1000) OU
    // - (Cliente há mais de 5 anos E valor >= 500) OU
    // - (Cupom especial E dia promocional)
    
    boolean premiumComValorAlto = cliente.isPremium() && compra.getValor() >= 1000;
    boolean clienteAntigoComValorMedio = cliente.getAnosCliente() > 5 && compra.getValor() >= 500;
    boolean cupomEspecialEmPromocao = compra.hasCupomEspecial() && isDataPromocional();
    
    return premiumComValorAlto 
        || clienteAntigoComValorMedio 
        || cupomEspecialEmPromocao;
}

private boolean isDataPromocional() {
    int dia = LocalDate.now().getDayOfMonth();
    return dia == 1 || dia == 15;  // Dias 1 e 15
}
```

#### **Validação de Dados de Formulário**

```java
public boolean isFormularioValido(Formulario form) {
    // Nome: não null, não vazio, mínimo 3 caracteres
    boolean nomeValido = form.getNome() != null 
        && !form.getNome().trim().isEmpty() 
        && form.getNome().length() >= 3;
    
    // Email: não null, contém @, contém .
    boolean emailValido = form.getEmail() != null 
        && form.getEmail().contains("@") 
        && form.getEmail().contains(".");
    
    // Idade: entre 0 e 120
    boolean idadeValida = form.getIdade() >= 0 && form.getIdade() <= 120;
    
    // Termos: deve aceitar
    boolean aceitouTermos = form.isAceitouTermos();
    
    return nomeValido && emailValido && idadeValida && aceitouTermos;
}
```

#### **Verificação de Horário de Atendimento**

```java
public boolean isHorarioAtendimento() {
    LocalTime agora = LocalTime.now();
    DayOfWeek dia = LocalDate.now().getDayOfWeek();
    
    // Horário: 8h-18h de segunda a sexta, 9h-13h no sábado
    boolean isDiaUtil = dia != DayOfWeek.SUNDAY && dia != DayOfWeek.SATURDAY;
    boolean isSabado = dia == DayOfWeek.SATURDAY;
    
    boolean horarioSemana = isDiaUtil 
        && agora.isAfter(LocalTime.of(8, 0)) 
        && agora.isBefore(LocalTime.of(18, 0));
    
    boolean horarioSabado = isSabado 
        && agora.isAfter(LocalTime.of(9, 0)) 
        && agora.isBefore(LocalTime.of(13, 0));
    
    return horarioSemana || horarioSabado;
}
```

---

## 🔍 Análise Conceitual Profunda

### Quando Simplificar vs Quando Manter

**Simplifique quando**:
- Condição pode ser expressa mais diretamente
- Há redundância lógica
- Negação dupla (`!!`)

```java
// ❌ Redundante
if (idade >= 18 && idade >= 21) {
    // Segunda condição implica a primeira
}

// ✅ Simplificado
if (idade >= 21) {
    // ...
}
```

**Mantenha explícito quando**:
- Clareza > concisão
- Regras de negócio específicas
- Cada condição tem significado semântico

```java
// ✅ Explícito (mesmo redundante)
if (cliente.isPremium() && cliente.getCompras() > 10) {
    // Claro que são dois critérios distintos
}
```

### Complexidade Cognitiva

**Regra de Ouro**: Máximo **4 operadores lógicos** por expressão.

```java
// ❌ Complexidade alta (6 operadores)
if (a && b || c && d && e || f) {
    // Difícil de entender
}

// ✅ Extraia para variáveis/métodos
boolean condicao1 = a && b;
boolean condicao2 = c && d && e;
boolean condicao3 = f;

if (condicao1 || condicao2 || condicao3) {
    // Mais claro
}
```

### Performance vs Legibilidade

**Short-circuit** pode otimizar:

```java
// ✅ Otimizado: verificação barata primeiro
if (usuario.isAtivo() && autorizacaoComplexaEDemorada(usuario)) {
    // Se isAtivo() for false, segundo método NÃO é chamado
}

// ❌ Não otimizado
if (autorizacaoComplexaEDemorada(usuario) && usuario.isAtivo()) {
    // Método caro SEMPRE é chamado
}
```

**Regra**: Condições **mais baratas** e **mais prováveis de falhar** primeiro.

---

## 🎯 Aplicabilidade e Contextos

### 1. **Validação de Entrada**

```java
if (senha != null && senha.length() >= 8 && senha.matches(".*[A-Z].*") && senha.matches(".*[0-9].*")) {
    System.out.println("Senha forte");
}
```

### 2. **Regras de Negócio**

```java
if ((cliente.isPremium() || cliente.getCompras() > 50) && !cliente.isBloqueado()) {
    aplicarBeneficios();
}
```

### 3. **Controle de Fluxo**

```java
if (arquivo.exists() && arquivo.canRead() && !arquivo.isDirectory()) {
    processarArquivo(arquivo);
}
```

### 4. **Autorização**

```java
if (usuario.hasRole("ADMIN") || (usuario.hasRole("EDITOR") && recurso.isPublico())) {
    permitirEdicao();
}
```

### 5. **Cálculos Condicionais**

```java
if (quantidade >= 100 || (quantidade >= 50 && clienteVIP)) {
    desconto = 0.20;
}
```

### 6. **Verificação de Estado**

```java
if (conexao != null && conexao.isOpen() && !conexao.isReadOnly()) {
    executarComando(conexao);
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Confundir && com &**

```java
// ❌ & não faz short-circuit
if (usuario != null & usuario.isAtivo()) {
    // usuario.isAtivo() é SEMPRE chamado, mesmo se usuario for null (NullPointerException)
}

// ✅ && faz short-circuit
if (usuario != null && usuario.isAtivo()) {
    // Seguro
}
```

### 2. **Precedência Incorreta**

```java
// ❌ Avaliado como: (a && b) || c  [&& tem precedência]
if (a && b || c) {
    // Pode não ser a intenção
}

// ✅ Parênteses explícitos
if (a && (b || c)) {
    // Intenção clara
}
```

### 3. **Negação Dupla**

```java
// ❌ Confuso
if (!(!usuario.isAtivo())) {
    // Equivalente a: usuario.isAtivo()
}

// ✅ Direto
if (usuario.isAtivo()) {
    // ...
}
```

### 4. **Comparação de Referências**

```java
String s1 = new String("Java");
String s2 = new String("Java");

// ❌ Compara referências
if (s1 == s2) {
    // false (referências diferentes)
}

// ✅ Compara conteúdo
if (s1.equals(s2)) {
    // true (conteúdo igual)
}
```

### 5. **NullPointerException em Cadeias**

```java
// ❌ Pode lançar NullPointerException
if (usuario.getEndereco().getCidade().equals("SP")) {
    // Se getEndereco() ou getCidade() retornar null, ERRO
}

// ✅ Verificações de null
if (usuario != null 
    && usuario.getEndereco() != null 
    && "SP".equals(usuario.getEndereco().getCidade())) {
    // Seguro
}

// ✅ Ainda melhor: Optional (Java 8+)
Optional.ofNullable(usuario)
    .map(Usuario::getEndereco)
    .map(Endereco::getCidade)
    .filter(cidade -> "SP".equals(cidade))
    .ifPresent(cidade -> processar());
```

### 6. **Condições Sempre True/False**

```java
// ❌ Sempre true
if (x > 5 || x <= 5) {
    // Sempre executado (redundante)
}

// ❌ Sempre false
if (x > 10 && x < 5) {
    // Nunca executado (impossível)
}
```

---

## 🔗 Interconexões Conceituais

- **Operadores lógicos**: &&, ||, !
- **Operadores relacionais**: <, >, ==, !=
- **Precedência de operadores**: Ordem de avaliação
- **Short-circuit evaluation**: Otimização de performance
- **De Morgan's Laws**: Simplificação de condições
- **Guard clauses**: Alternativa a condições complexas
- **Extract method**: Refatoração de condições
- **Optional**: Alternativa a null-checks

---

## 🚀 Boas Práticas

### 1. ✅ Use Parênteses para Clareza

```java
// ✅ Claro
if ((isAdmin || isModerador) && isAtivo) {
    // Intenção explícita
}

// ❌ Ambíguo
if (isAdmin || isModerador && isAtivo) {
    // Depende de conhecer precedência
}
```

### 2. ✅ Máximo 4 Operadores Lógicos

```java
// ✅ Até 4 operadores OK
if (a && b && c && d) {
    // ...
}

// ❌ 5+ operadores: extraia
if (a && b && c && d && e && f) {
    // Complexo demais
}
```

### 3. ✅ Extraia Condições Complexas

```java
// ✅ Variáveis descritivas
boolean isUsuarioValido = usuario != null && usuario.isAtivo();
boolean isPedidoValido = pedido != null && pedido.hasItens();

if (isUsuarioValido && isPedidoValido) {
    processar();
}
```

### 4. ✅ Prefira Condições Positivas

```java
// ✅ Positivo
if (usuario.isAtivo()) {
    processar();
}

// ❌ Negativo (menos claro)
if (!usuario.isInativo()) {
    processar();
}
```

### 5. ✅ Use equals() com Literal Primeiro

```java
// ✅ Null-safe
if ("ADMIN".equals(role)) {
    // Não lança NullPointerException se role for null
}

// ❌ Pode lançar NPE
if (role.equals("ADMIN")) {
    // NullPointerException se role for null
}
```

### 6. ✅ Aproveite Short-Circuit

```java
// ✅ Verificação null primeiro
if (str != null && str.length() > 5) {
    // Seguro
}

// ✅ Condição barata primeiro
if (cache.contains(key) || expensiveComputation(key)) {
    // expensiveComputation() só é chamado se necessário
}
```

### 7. ✅ Simplifique com De Morgan

```java
// ❌ Negação de condição complexa
if (!(idade >= 18 && temCarteira)) {
    negarDirigir();
}

// ✅ Simplificado com De Morgan
if (idade < 18 || !temCarteira) {
    negarDirigir();
}
```

### 8. ✅ Formatação Multi-Linha

```java
// ✅ Multi-linha para condições longas
if (usuario.isAtivo() 
    && usuario.isPago() 
    && !usuario.isBloqueado() 
    && usuario.getScore() > 500) {
    processar();
}
```

### 9. ✅ Evite Magic Numbers

```java
// ❌ Magic numbers
if (status == 1 || status == 2 || status == 3) {
    // O que significa 1, 2, 3?
}

// ✅ Constantes nomeadas
private static final int STATUS_ATIVO = 1;
private static final int STATUS_PENDENTE = 2;
private static final int STATUS_EM_ANALISE = 3;

if (status == STATUS_ATIVO || status == STATUS_PENDENTE || status == STATUS_EM_ANALISE) {
    // Claro
}
```

### 10. ✅ Teste Casos Limite

```java
@Test
void testCondicoesComplexas() {
    // Testa todas as combinações
    assertTrue(validar(18, true, false));   // idade válida, carteira, sem multas
    assertFalse(validar(17, true, false));  // idade inválida
    assertFalse(validar(18, false, false)); // sem carteira
    assertFalse(validar(18, true, true));   // com multas
}
```

---

## 📚 Resumo

**Condições booleanas complexas** combinam **múltiplas condições** usando operadores lógicos (`&&`, `||`, `!`), relacionais (<, >, ==), e **parênteses** para criar lógica sofisticada. **Precedência** de operadores: parênteses > ! > relacionais > && > ||. **Short-circuit** (avaliação preguiçosa): `&&` para quando primeiro é `false`, `||` para quando primeiro é `true`, evitando avaliações desnecessárias e NullPointerException. **De Morgan's Laws**: `!(A && B)` = `!A || !B` e `!(A || B)` = `!A && !B`. Para manter **legibilidade**, use **parênteses** para clareza, **limite a 4 operadores lógicos**, **extraia condições** para variáveis/métodos descritivos, prefira **condições positivas**, e **formate multi-linha** quando longa. Use `equals()` com **literal primeiro** para evitar NullPointerException. Aproveite **short-circuit** colocando condições **baratas** e **prováveis de falhar** primeiro. Simplifique condições negadas com **De Morgan**.

