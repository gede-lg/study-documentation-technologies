# T10.07 - Fail-Fast vs Fail-Safe

## Introdução

**Fail-Fast**: validar e **falhar cedo** ao detectar problema.
**Fail-Safe**: **continuar** operando mesmo com problema (usar padrão, ignorar).

```java
/*
 * FAIL-FAST vs FAIL-SAFE
 * 
 * FAIL-FAST:
 * - Detecta erro CEDO
 * - Lança exceção IMEDIATAMENTE
 * - Para execução
 * - Evita estado inconsistente
 * 
 * FAIL-SAFE:
 * - Continua executando
 * - Usa valores PADRÃO
 * - Tolera falhas
 * - Sistema degradado mas funcional
 */

// ✅ FAIL-FAST: valida cedo, falha rápido
public class FailFast {
    public static void processar(String nome, int idade, String email) {
        // ✅ Validar IMEDIATAMENTE
        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser null ou vazio");
        }
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email inválido: " + email);
        }
        
        // Processar apenas se TUDO válido
        salvar(nome, idade, email);
    }
    
    static void salvar(String nome, int idade, String email) { }
}

// ✅ FAIL-SAFE: continua com padrões
public class FailSafe {
    public static void processar(String nome, int idade, String email) {
        // ✅ Usar valores PADRÃO se inválido
        if (nome == null || nome.isEmpty()) {
            nome = "Desconhecido";  // Padrão
        }
        if (idade < 0 || idade > 150) {
            idade = 0;  // Padrão
        }
        if (email == null || !email.contains("@")) {
            email = "nao-informado@exemplo.com";  // Padrão
        }
        
        // ✅ Continua processando (sistema degradado)
        salvar(nome, idade, email);
    }
    
    static void salvar(String nome, int idade, String email) { }
}
```

**Regra**: usar **fail-fast** para bugs/validação, **fail-safe** para tolerância a falhas.

---

## Fundamentos

### 1. Fail-Fast: Falhar Cedo

```java
// ✅ Fail-Fast: detecta e falha IMEDIATAMENTE
public class FailFastConceito {
    
    // ✅ Validar argumentos no INÍCIO
    public static void transferir(Conta origem, Conta destino, double valor) {
        // ✅ FAIL-FAST: validar TUDO antes de processar
        if (origem == null) {
            throw new IllegalArgumentException("Conta origem não pode ser null");
        }
        if (destino == null) {
            throw new IllegalArgumentException("Conta destino não pode ser null");
        }
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        if (origem.getSaldo() < valor) {
            throw new IllegalStateException("Saldo insuficiente");
        }
        
        // ✅ Processar apenas se TUDO válido
        origem.debitar(valor);
        destino.creditar(valor);
    }
}

class Conta {
    private double saldo;
    public double getSaldo() { return saldo; }
    public void debitar(double valor) { saldo -= valor; }
    public void creditar(double valor) { saldo += valor; }
}

/*
 * FAIL-FAST:
 * 
 * PRINCÍPIO:
 * - Validar CEDO (início método)
 * - Falhar RÁPIDO (throw exceção)
 * - PARAR execução
 * - Evitar estado INCONSISTENTE
 * 
 * QUANDO USAR:
 * ✅ Validação argumentos
 * ✅ Pré-condições
 * ✅ Estado inválido
 * ✅ Bugs programação
 * ✅ Dados críticos
 * 
 * VANTAGENS:
 * - Detecta bugs CEDO
 * - Mensagem CLARA erro
 * - NÃO propaga erro
 * - Debug FÁCIL (stack trace preciso)
 * - Estado CONSISTENTE
 * 
 * DESVANTAGENS:
 * - Sistema PARA se erro
 * - Menos TOLERANTE a falhas
 */
```

**Fail-fast**: validar **cedo**, falhar **rápido**, **parar** execução.

### 2. Fail-Safe: Continuar Operando

```java
// ✅ Fail-Safe: tolera erros, continua operando
public class FailSafeConceito {
    
    // ✅ Continuar mesmo com problemas
    public static void processarLista(List<String> itens) {
        if (itens == null || itens.isEmpty()) {
            // ✅ FAIL-SAFE: usar lista vazia
            itens = new ArrayList<>();
        }
        
        for (String item : itens) {
            try {
                processar(item);
            } catch (Exception e) {
                // ✅ FAIL-SAFE: logar e continuar
                System.err.println("Erro ao processar " + item + ": " + e.getMessage());
                // Continua com próximo item
            }
        }
    }
    
    // ✅ Valores padrão
    public static int obterConfiguracaoInt(String chave) {
        try {
            String valor = obterConfiguracao(chave);
            return Integer.parseInt(valor);
        } catch (Exception e) {
            // ✅ FAIL-SAFE: retornar valor padrão
            return 0;  // Padrão
        }
    }
    
    static void processar(String item) { }
    static String obterConfiguracao(String chave) { return ""; }
}

/*
 * FAIL-SAFE:
 * 
 * PRINCÍPIO:
 * - TOLERAR erros
 * - Usar valores PADRÃO
 * - CONTINUAR operando
 * - Sistema DEGRADADO mas funcional
 * 
 * QUANDO USAR:
 * ✅ Configuração opcional
 * ✅ Dados não críticos
 * ✅ Processamento lote (continuar com próximo)
 * ✅ Sistema alta disponibilidade
 * ✅ Tolerância a falhas
 * 
 * VANTAGENS:
 * - Sistema NÃO para
 * - ALTA disponibilidade
 * - TOLERANTE a falhas
 * - Funcionalidade DEGRADADA (mas funciona)
 * 
 * DESVANTAGENS:
 * - Pode MASCARAR bugs
 * - Dados INCONSISTENTES
 * - Debug DIFÍCIL (silencioso)
 * - Comportamento INESPERADO
 */
```

**Fail-safe**: **tolerar** erros, valores **padrão**, **continuar** operando.

### 3. Comparação Direta

```java
// ✅ Comparação: mesma situação, abordagens diferentes
public class ComparacaoAbordagens {
    
    // ✅ FAIL-FAST: lança exceção
    public static void processarFailFast(String nome, int idade) {
        // Validar e FALHAR se inválido
        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("Nome obrigatório");
        }
        if (idade < 0) {
            throw new IllegalArgumentException("Idade não pode ser negativa");
        }
        
        // Processar apenas se VÁLIDO
        System.out.println("Processando: " + nome + ", idade: " + idade);
    }
    
    // ✅ FAIL-SAFE: usa padrões
    public static void processarFailSafe(String nome, int idade) {
        // Usar valores PADRÃO se inválido
        if (nome == null || nome.isEmpty()) {
            nome = "Anônimo";  // Padrão
        }
        if (idade < 0) {
            idade = 0;  // Padrão
        }
        
        // SEMPRE processa (pode ser com padrões)
        System.out.println("Processando: " + nome + ", idade: " + idade);
    }
}

/*
 * COMPARAÇÃO:
 * 
 * CENÁRIO: nome null, idade -5
 * 
 * FAIL-FAST:
 * - Lança IllegalArgumentException
 * - Execução PARA
 * - Mensagem clara erro
 * - Não processa dados inválidos
 * 
 * FAIL-SAFE:
 * - Nome = "Anônimo"
 * - Idade = 0
 * - Execução CONTINUA
 * - Processa com valores padrão
 * 
 * RESULTADO:
 * Fail-Fast: ERRO (exceção)
 * Fail-Safe: Sucesso (degradado)
 */
```

**Comparação**: fail-fast **para** e lança exceção, fail-safe **continua** com padrão.

### 4. Quando Usar Fail-Fast

```java
// ✅ Fail-Fast: situações apropriadas
public class QuandoUsarFailFast {
    
    // ✅ 1. Validação argumentos
    public static void exemplo1(String cpf) {
        if (cpf == null || cpf.length() != 11) {
            throw new IllegalArgumentException("CPF inválido");  // ✅ Fail-fast
        }
        // CPF crítico, não pode ser inválido
    }
    
    // ✅ 2. Pré-condições
    public static void exemplo2(List<Integer> lista) {
        if (lista.isEmpty()) {
            throw new IllegalStateException("Lista não pode estar vazia");  // ✅ Fail-fast
        }
        int primeiro = lista.get(0);
        // Operação requer lista não vazia
    }
    
    // ✅ 3. Dados críticos
    public static void exemplo3(double saldo, double valor) {
        if (saldo < valor) {
            throw new IllegalStateException("Saldo insuficiente");  // ✅ Fail-fast
        }
        // Transferência bancária, não pode ter saldo negativo
    }
    
    // ✅ 4. Configuração obrigatória
    public static void exemplo4(String dbUrl) {
        if (dbUrl == null || dbUrl.isEmpty()) {
            throw new IllegalStateException("URL banco obrigatória");  // ✅ Fail-fast
        }
        // Sistema não pode funcionar sem banco
    }
}

/*
 * FAIL-FAST APROPRIADO:
 * 
 * ✅ USAR quando:
 * 
 * 1. VALIDAÇÃO ARGUMENTOS:
 *    - Parâmetros obrigatórios
 *    - Formato específico (CPF, email)
 *    - Range válido
 * 
 * 2. PRÉ-CONDIÇÕES:
 *    - Estado necessário para operação
 *    - Recursos obrigatórios
 * 
 * 3. DADOS CRÍTICOS:
 *    - Financeiro (saldo, valor)
 *    - Segurança (senha, token)
 *    - Integridade dados
 * 
 * 4. BUGS PROGRAMAÇÃO:
 *    - Violação contrato
 *    - Estado inconsistente
 *    - Null inesperado
 * 
 * 5. SISTEMA NÃO PODE CONTINUAR:
 *    - Configuração obrigatória
 *    - Dependência crítica
 */
```

**Fail-fast**: validação **argumentos**, pré-condições, dados **críticos**, bugs.

### 5. Quando Usar Fail-Safe

```java
// ✅ Fail-Safe: situações apropriadas
public class QuandoUsarFailSafe {
    
    // ✅ 1. Configuração opcional
    public static int exemplo1() {
        try {
            return Integer.parseInt(System.getProperty("timeout"));
        } catch (Exception e) {
            return 30;  // ✅ Padrão: 30 segundos
        }
        // Timeout opcional, pode usar padrão
    }
    
    // ✅ 2. Processamento lote
    public static void exemplo2(List<Pedido> pedidos) {
        for (Pedido pedido : pedidos) {
            try {
                processar(pedido);
            } catch (Exception e) {
                System.err.println("Erro pedido " + pedido.getId() + ": " + e);
                // ✅ Continuar com próximo pedido
            }
        }
        // Processar máximo possível, não parar no primeiro erro
    }
    
    // ✅ 3. Dados não críticos
    public static void exemplo3(String usuarioId, String avatar) {
        if (avatar == null || avatar.isEmpty()) {
            avatar = "avatar-padrao.png";  // ✅ Padrão
        }
        salvar(usuarioId, avatar);
        // Avatar não crítico, pode usar padrão
    }
    
    // ✅ 4. Sistema alta disponibilidade
    public static void exemplo4() {
        try {
            enviarMetricas();
        } catch (Exception e) {
            // ✅ Logar e continuar
            System.err.println("Erro enviar métricas: " + e);
        }
        // Sistema principal não pode parar por métricas
    }
    
    static void processar(Pedido pedido) { }
    static void salvar(String usuarioId, String avatar) { }
    static void enviarMetricas() { }
}

class Pedido {
    public int getId() { return 0; }
}

/*
 * FAIL-SAFE APROPRIADO:
 * 
 * ✅ USAR quando:
 * 
 * 1. CONFIGURAÇÃO OPCIONAL:
 *    - Timeout
 *    - Cache size
 *    - Features opcionais
 * 
 * 2. PROCESSAMENTO LOTE:
 *    - Lista itens
 *    - Continuar com próximo se erro
 *    - Não parar tudo por um
 * 
 * 3. DADOS NÃO CRÍTICOS:
 *    - Avatar, logo
 *    - Descrição, observação
 *    - Pode usar padrão
 * 
 * 4. ALTA DISPONIBILIDADE:
 *    - Sistema não pode parar
 *    - Funcionalidade degradada OK
 *    - Métricas, logs
 * 
 * 5. TOLERÂNCIA FALHAS:
 *    - Serviços externos
 *    - Rede instável
 *    - Fallback disponível
 */
```

**Fail-safe**: configuração **opcional**, lote, dados **não críticos**, alta disponibilidade.

### 6. Híbrido: Combinando Abordagens

```java
// ✅ Híbrido: fail-fast para crítico, fail-safe para opcional
public class AbordagemHibrida {
    
    public static void processar(Usuario usuario, Config config) {
        // ✅ FAIL-FAST: dados críticos
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário não pode ser null");
        }
        if (usuario.getId() <= 0) {
            throw new IllegalArgumentException("ID usuário inválido");
        }
        
        // ✅ FAIL-SAFE: configuração opcional
        int timeout = 30;  // Padrão
        if (config != null && config.getTimeout() > 0) {
            timeout = config.getTimeout();
        }
        
        String avatar = "avatar-padrao.png";  // Padrão
        if (usuario.getAvatar() != null && !usuario.getAvatar().isEmpty()) {
            avatar = usuario.getAvatar();
        }
        
        // Processar com dados críticos validados e opcionais com padrões
        salvar(usuario.getId(), avatar, timeout);
    }
    
    static void salvar(int id, String avatar, int timeout) { }
}

class Usuario {
    public int getId() { return 0; }
    public String getAvatar() { return ""; }
}

class Config {
    public int getTimeout() { return 0; }
}

/*
 * ABORDAGEM HÍBRIDA:
 * 
 * COMBINAR:
 * - FAIL-FAST para dados CRÍTICOS
 * - FAIL-SAFE para dados OPCIONAIS
 * 
 * EXEMPLO:
 * Usuario usuario (CRÍTICO):
 * - Fail-fast se null ou inválido
 * 
 * Avatar (OPCIONAL):
 * - Fail-safe, usar padrão
 * 
 * Timeout (CONFIGURAÇÃO):
 * - Fail-safe, usar padrão
 * 
 * VANTAGENS:
 * - Garantia dados críticos
 * - Tolerância dados opcionais
 * - Equilíbrio robustez/disponibilidade
 */
```

**Híbrido**: fail-fast para **crítico**, fail-safe para **opcional**.

### 7. Iteradores: Fail-Fast

```java
// ✅ Iteradores Java: fail-fast por padrão
public class IteradoresFailFast {
    
    public static void exemplo1() {
        List<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        for (String item : lista) {
            System.out.println(item);
            lista.remove(item);  // ❌ Modificar durante iteração
        }
        // Lança ConcurrentModificationException (FAIL-FAST)
    }
    
    public static void exemplo2() {
        List<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        
        Iterator<String> it = lista.iterator();
        while (it.hasNext()) {
            String item = it.next();
            System.out.println(item);
            lista.add("X");  // ❌ Modificar por outra referência
        }
        // Lança ConcurrentModificationException (FAIL-FAST)
    }
    
    // ✅ Correto: usar Iterator.remove()
    public static void exemplo3() {
        List<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        
        Iterator<String> it = lista.iterator();
        while (it.hasNext()) {
            String item = it.next();
            if (item.equals("A")) {
                it.remove();  // ✅ Usar método iterator
            }
        }
    }
}

/*
 * ITERADORES FAIL-FAST:
 * 
 * JAVA COLLECTIONS:
 * - ArrayList, HashMap, HashSet: FAIL-FAST
 * - Detectam modificação durante iteração
 * - Lançam ConcurrentModificationException
 * 
 * FAIL-SAFE COLLECTIONS:
 * - CopyOnWriteArrayList
 * - ConcurrentHashMap
 * - Toleram modificação durante iteração
 * 
 * POR QUE FAIL-FAST:
 * - Evita comportamento IMPREVISÍVEL
 * - Detecta BUGS cedo
 * - Estado CONSISTENTE
 */
```

**Iteradores**: Java collections **fail-fast** (ConcurrentModificationException).

### 8. Fail-Safe Collections

```java
// ✅ Fail-Safe: CopyOnWriteArrayList
public class FailSafeCollections {
    
    public static void exemplo1() {
        // ✅ FAIL-SAFE: permite modificação durante iteração
        List<String> lista = new CopyOnWriteArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        for (String item : lista) {
            System.out.println(item);
            lista.remove(item);  // ✅ OK (fail-safe)
        }
        // NÃO lança exceção (itera sobre cópia)
    }
    
    public static void exemplo2() {
        // ✅ FAIL-SAFE: ConcurrentHashMap
        Map<String, Integer> map = new ConcurrentHashMap<>();
        map.put("A", 1);
        map.put("B", 2);
        
        for (String chave : map.keySet()) {
            System.out.println(chave);
            map.put("C", 3);  // ✅ OK (fail-safe)
        }
        // NÃO lança exceção
    }
}

/*
 * FAIL-SAFE COLLECTIONS:
 * 
 * JAVA CONCURRENT:
 * - CopyOnWriteArrayList
 * - CopyOnWriteArraySet
 * - ConcurrentHashMap
 * - ConcurrentLinkedQueue
 * 
 * VANTAGENS:
 * - Toleram modificação durante iteração
 * - Thread-safe
 * - Sem ConcurrentModificationException
 * 
 * DESVANTAGENS:
 * - PERFORMANCE (cópia)
 * - MEMÓRIA (duplicação)
 * - Iterador pode ver estado ANTIGO
 * 
 * QUANDO USAR:
 * - Concorrência (múltiplas threads)
 * - Modificação durante iteração necessária
 * - Lista pequena (performance aceitável)
 */
```

**Fail-safe collections**: CopyOnWriteArrayList, ConcurrentHashMap (toleram modificação).

### 9. Trade-offs

```java
/*
 * TRADE-OFFS: FAIL-FAST vs FAIL-SAFE
 * 
 * FAIL-FAST:
 * 
 * VANTAGENS:
 * ✅ Detecta bugs CEDO
 * ✅ Mensagem CLARA erro
 * ✅ Debug FÁCIL (stack trace)
 * ✅ Estado CONSISTENTE
 * ✅ Previne corrupção dados
 * 
 * DESVANTAGENS:
 * ❌ Sistema PARA se erro
 * ❌ Menos TOLERANTE
 * ❌ Pode ser AGRESSIVO demais
 * 
 * QUANDO USAR:
 * - Validação argumentos
 * - Dados críticos
 * - Bugs programação
 * - Desenvolvimento (detectar bugs)
 * 
 * 
 * FAIL-SAFE:
 * 
 * VANTAGENS:
 * ✅ Sistema NÃO para
 * ✅ ALTA disponibilidade
 * ✅ TOLERANTE a falhas
 * ✅ Funcionalidade DEGRADADA
 * 
 * DESVANTAGENS:
 * ❌ Pode MASCARAR bugs
 * ❌ Dados INCONSISTENTES
 * ❌ Debug DIFÍCIL
 * ❌ Comportamento INESPERADO
 * 
 * QUANDO USAR:
 * - Configuração opcional
 * - Dados não críticos
 * - Alta disponibilidade
 * - Processamento lote
 * 
 * 
 * RECOMENDAÇÃO:
 * 
 * PADRÃO: FAIL-FAST
 * - Mais seguro
 * - Detecta bugs cedo
 * - Código mais robusto
 * 
 * FAIL-SAFE:
 * - Apenas quando NECESSÁRIO
 * - Documentar CLARAMENTE
 * - LOGAR valores padrão usados
 * 
 * HÍBRIDO:
 * - Fail-fast: dados críticos
 * - Fail-safe: dados opcionais
 * - Equilíbrio robustez/disponibilidade
 */
```

**Trade-offs**: fail-fast **detecta bugs**, fail-safe **alta disponibilidade**.

### 10. Resumo Visual

```java
/*
 * FAIL-FAST vs FAIL-SAFE
 * 
 * FAIL-FAST (Falhar Cedo):
 * 
 * PRINCÍPIO:
 * - Validar CEDO
 * - Falhar RÁPIDO
 * - PARAR execução
 * 
 * CÓDIGO:
 * if (param == null) {
 *     throw new IllegalArgumentException("Param obrigatório");  // Para
 * }
 * 
 * QUANDO USAR:
 * ✅ Validação argumentos
 * ✅ Pré-condições
 * ✅ Dados críticos (financeiro, segurança)
 * ✅ Bugs programação
 * ✅ Estado inconsistente
 * 
 * VANTAGENS:
 * ✅ Detecta bugs cedo
 * ✅ Mensagem clara
 * ✅ Debug fácil
 * ✅ Estado consistente
 * 
 * DESVANTAGENS:
 * ❌ Sistema para
 * ❌ Menos tolerante
 * 
 * 
 * FAIL-SAFE (Tolerar Falhas):
 * 
 * PRINCÍPIO:
 * - TOLERAR erros
 * - Usar PADRÕES
 * - CONTINUAR execução
 * 
 * CÓDIGO:
 * if (param == null) {
 *     param = "PADRÃO";  // Continua
 * }
 * 
 * QUANDO USAR:
 * ✅ Configuração opcional
 * ✅ Dados não críticos
 * ✅ Processamento lote
 * ✅ Alta disponibilidade
 * ✅ Tolerância falhas
 * 
 * VANTAGENS:
 * ✅ Sistema não para
 * ✅ Alta disponibilidade
 * ✅ Tolerante
 * 
 * DESVANTAGENS:
 * ❌ Mascara bugs
 * ❌ Dados inconsistentes
 * ❌ Debug difícil
 * 
 * 
 * COMPARAÇÃO:
 * 
 * CENÁRIO: param null
 * 
 * FAIL-FAST:
 * throw new IllegalArgumentException();  // PARA
 * 
 * FAIL-SAFE:
 * param = "PADRÃO";  // CONTINUA
 * 
 * 
 * ABORDAGEM HÍBRIDA:
 * 
 * // Crítico: FAIL-FAST
 * if (usuario == null) {
 *     throw new IllegalArgumentException();
 * }
 * 
 * // Opcional: FAIL-SAFE
 * String avatar = usuario.getAvatar();
 * if (avatar == null) {
 *     avatar = "avatar-padrao.png";  // Padrão
 * }
 * 
 * 
 * ITERADORES:
 * 
 * FAIL-FAST (ArrayList, HashMap):
 * for (String item : lista) {
 *     lista.remove(item);  // ❌ ConcurrentModificationException
 * }
 * 
 * FAIL-SAFE (CopyOnWriteArrayList):
 * for (String item : lista) {
 *     lista.remove(item);  // ✅ OK
 * }
 * 
 * 
 * RECOMENDAÇÃO:
 * 
 * PADRÃO: FAIL-FAST
 * - Mais seguro
 * - Detecta bugs
 * - Código robusto
 * 
 * FAIL-SAFE: Apenas quando necessário
 * - Documentar claramente
 * - Logar valores padrão
 * - Monitorar comportamento
 */

public class ExemploFailFastFailSafe {
    
    // ✅ FAIL-FAST: dados críticos
    public static void processarPagamento(Pagamento pagamento) {
        // Validar TUDO antes de processar
        if (pagamento == null) {
            throw new IllegalArgumentException("Pagamento não pode ser null");
        }
        if (pagamento.getValor() <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        if (pagamento.getCartao() == null) {
            throw new IllegalArgumentException("Cartão obrigatório");
        }
        
        // ✅ Processar apenas se VÁLIDO
        cobrar(pagamento);
    }
    
    // ✅ FAIL-SAFE: configuração opcional
    public static void enviarEmail(String destinatario, String assunto, String corpo) {
        // Usar valores PADRÃO se necessário
        if (assunto == null || assunto.isEmpty()) {
            assunto = "Sem assunto";  // Padrão
        }
        if (corpo == null || corpo.isEmpty()) {
            corpo = "(Corpo vazio)";  // Padrão
        }
        
        // ✅ SEMPRE envia (pode ser com padrões)
        enviar(destinatario, assunto, corpo);
    }
    
    // ✅ HÍBRIDO: crítico + opcional
    public static void salvarUsuario(Usuario usuario) {
        // FAIL-FAST: dados críticos
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário não pode ser null");
        }
        if (usuario.getEmail() == null || !usuario.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
        
        // FAIL-SAFE: dados opcionais
        String avatar = usuario.getAvatar();
        if (avatar == null || avatar.isEmpty()) {
            avatar = "avatar-padrao.png";
        }
        
        String bio = usuario.getBio();
        if (bio == null) {
            bio = "";
        }
        
        salvar(usuario.getEmail(), avatar, bio);
    }
    
    static void cobrar(Pagamento p) { }
    static void enviar(String dest, String assunto, String corpo) { }
    static void salvar(String email, String avatar, String bio) { }
}

class Pagamento {
    public double getValor() { return 0; }
    public String getCartao() { return ""; }
}
```

---

## Aplicabilidade

**Fail-Fast**:
- Validação **argumentos**
- Dados **críticos** (financeiro, segurança)
- **Bugs** programação
- Pré-condições

**Fail-Safe**:
- Configuração **opcional**
- Dados **não críticos**
- **Lote** (continuar próximo)
- Alta **disponibilidade**

---

## Armadilhas

### 1. Fail-Safe Mascarando Bugs

```java
// ❌ Mascara bug
if (valor == null) {
    valor = "PADRÃO";  // Bug não detectado
}

// ✅ Fail-fast para bugs
if (valor == null) {
    throw new IllegalArgumentException();
}
```

### 2. Fail-Fast Demais

```java
// ❌ Agressivo demais
if (avatar == null) {
    throw new Exception();  // Avatar não crítico
}

// ✅ Fail-safe apropriado
if (avatar == null) {
    avatar = "padrao.png";
}
```

### 3. Não Logar Fail-Safe

```java
// ❌ Silencioso
if (config == null) {
    config = padrão;  // Sem log
}

// ✅ Logar valores padrão
if (config == null) {
    logger.warning("Config null, usando padrão");
    config = padrão;
}
```

---

## Boas Práticas

### 1. Padrão Fail-Fast

```java
// ✅ Padrão: fail-fast
if (param == null) {
    throw new IllegalArgumentException();
}
```

### 2. Documentar Fail-Safe

```java
// ✅ Documentar padrões
/**
 * @param timeout timeout em segundos (padrão: 30)
 */
public void metodo(Integer timeout) {
    if (timeout == null) timeout = 30;
}
```

### 3. Logar Padrões

```java
// ✅ Logar quando usar padrão
if (valor == null) {
    logger.info("Valor null, usando padrão X");
    valor = "X";
}
```

---

## Resumo

**Fail-Fast**: validar **cedo**, falhar **rápido**, **parar** execução.
**Fail-Safe**: **tolerar** erros, valores **padrão**, **continuar** operando.

**Fail-Fast**:
- **Quando**: validação argumentos, dados críticos, bugs, pré-condições
- **Vantagens**: detecta bugs **cedo**, mensagem **clara**, debug **fácil**, estado **consistente**
- **Desvantagens**: sistema **para**, menos **tolerante**

**Fail-Safe**:
- **Quando**: configuração opcional, dados não críticos, lote, alta disponibilidade
- **Vantagens**: sistema **não para**, alta disponibilidade, **tolerante**
- **Desvantagens**: **mascara** bugs, dados **inconsistentes**, debug **difícil**

**Comparação**:
- Fail-fast: `throw new IllegalArgumentException()` (para)
- Fail-safe: `param = "PADRÃO"` (continua)

**Trade-offs**:
- Fail-fast: **robustez** (detecta bugs)
- Fail-safe: **disponibilidade** (não para)

**Abordagem híbrida**:
- Fail-fast para dados **críticos** (usuário, pagamento, segurança)
- Fail-safe para dados **opcionais** (avatar, timeout, config)

**Iteradores**:
- Java collections (ArrayList, HashMap): **fail-fast** (ConcurrentModificationException)
- Concurrent (CopyOnWriteArrayList, ConcurrentHashMap): **fail-safe**

**Recomendação**:
- **Padrão**: fail-fast (mais seguro, detecta bugs)
- **Fail-safe**: apenas quando necessário, documentar claramente, **logar** valores padrão

**Quando fail-fast**:
- ✅ Argumentos obrigatórios
- ✅ Formato específico (CPF, email)
- ✅ Dados financeiros (saldo, valor)
- ✅ Segurança (senha, token)
- ✅ Estado inconsistente

**Quando fail-safe**:
- ✅ Timeout, cache size
- ✅ Avatar, logo, descrição
- ✅ Processamento lote (continuar próximo)
- ✅ Métricas, logs (não crítico)
- ✅ Features opcionais

**Armadilhas**:
- ❌ Fail-safe mascarando bugs
- ❌ Fail-fast demais (dados não críticos)
- ❌ Não logar quando usa padrão fail-safe

**Boas práticas**:
- ✅ Padrão fail-fast (mais seguro)
- ✅ Documentar padrões fail-safe
- ✅ Logar valores padrão usados
- ✅ Híbrido: crítico fail-fast, opcional fail-safe

**Regra de Ouro**: Padrão fail-fast detecta bugs cedo código robusto. Fail-safe apenas necessário alta disponibilidade tolerância falhas. Híbrido crítico fail-fast opcional fail-safe equilíbrio. Documentar logar padrões. Iteradores Java fail-fast Concurrent fail-safe. Validação argumentos dados críticos fail-fast sempre. Configuração opcional não crítico fail-safe aceitável.

