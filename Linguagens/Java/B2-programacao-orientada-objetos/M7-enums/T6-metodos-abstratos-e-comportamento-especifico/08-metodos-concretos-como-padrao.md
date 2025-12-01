# T6.08 - Métodos Concretos como Padrão

## Introdução

**Método concreto**: implementação **padrão** compartilhada por todas as constantes.

```java
public enum Status {
    ATIVO,
    INATIVO,
    BLOQUEADO;
    
    // ✅ Método concreto: todas as constantes herdam
    public String getDescricao() {
        return "Status: " + name();
    }
    
    public boolean isValido() {
        return this != BLOQUEADO;
    }
}

// ✅ Uso: todas as constantes têm acesso
Status.ATIVO.getDescricao();     // "Status: ATIVO"
Status.INATIVO.getDescricao();   // "Status: INATIVO"
Status.BLOQUEADO.isValido();     // false
```

Método concreto = **comportamento compartilhado**.

---

## Fundamentos

### 1. Método Simples

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO;
    
    // ✅ Método concreto simples
    public boolean isUtil() {
        return this != SABADO && this != DOMINGO;
    }
    
    public String getNomeCompleto() {
        return "Dia da semana: " + name();
    }
}

// ✅ Todas as constantes usam
boolean util1 = DiaSemana.SEGUNDA.isUtil(); // true
boolean util2 = DiaSemana.SABADO.isUtil();  // false
```

### 2. Método com Lógica Compartilhada

```java
public enum TipoPagamento {
    DINHEIRO,
    CARTAO_CREDITO,
    CARTAO_DEBITO,
    PIX;
    
    // ✅ Método concreto com switch
    public double calcularTaxa(double valor) {
        switch (this) {
            case DINHEIRO:
                return 0;
            case CARTAO_CREDITO:
                return valor * 0.03;
            case CARTAO_DEBITO:
                return valor * 0.015;
            case PIX:
                return 0;
            default:
                throw new IllegalStateException("Tipo inválido: " + this);
        }
    }
    
    // ✅ Método utilitário
    public boolean requerCartao() {
        return this == CARTAO_CREDITO || this == CARTAO_DEBITO;
    }
}

// ✅ Todas as constantes compartilham lógica
double taxa = TipoPagamento.CARTAO_CREDITO.calcularTaxa(100); // 3.0
boolean requer = TipoPagamento.PIX.requerCartao();            // false
```

### 3. Método que Acessa Atributos

```java
public enum Prioridade {
    BAIXA(1),
    MEDIA(3),
    ALTA(5),
    URGENTE(10);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() {
        return nivel;
    }
    
    // ✅ Método concreto que usa atributo
    public boolean isMaiorQue(Prioridade outra) {
        return this.nivel > outra.nivel;
    }
    
    public String getDescricaoCompleta() {
        return name() + " (Nível: " + nivel + ")";
    }
}

// ✅ Uso
boolean maior = Prioridade.ALTA.isMaiorQue(Prioridade.MEDIA); // true
String desc = Prioridade.URGENTE.getDescricaoCompleta();      // "URGENTE (Nível: 10)"
```

### 4. Método Static Compartilhado

```java
public enum Status {
    ATIVO,
    INATIVO,
    BLOQUEADO,
    PENDENTE;
    
    // ✅ Método static: compartilhado por todas
    public static Status fromString(String nome) {
        if (nome == null) {
            return null;
        }
        try {
            return valueOf(nome.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
    
    public static List<Status> getStatusAtivos() {
        return Arrays.asList(ATIVO, PENDENTE);
    }
}

// ✅ Chamada static
Status status = Status.fromString("ativo");            // ATIVO
List<Status> ativos = Status.getStatusAtivos();        // [ATIVO, PENDENTE]
```

### 5. Método com Validação

```java
public enum TipoDocumento {
    CPF,
    CNPJ,
    RG;
    
    // ✅ Método concreto com validação
    public boolean validarTamanho(String documento) {
        if (documento == null) {
            return false;
        }
        
        switch (this) {
            case CPF:
                return documento.length() == 11;
            case CNPJ:
                return documento.length() == 14;
            case RG:
                return documento.length() >= 7 && documento.length() <= 9;
            default:
                return false;
        }
    }
    
    public String getMensagemErro() {
        switch (this) {
            case CPF:
                return "CPF deve ter 11 dígitos";
            case CNPJ:
                return "CNPJ deve ter 14 dígitos";
            case RG:
                return "RG deve ter entre 7 e 9 caracteres";
            default:
                return "Documento inválido";
        }
    }
}

// ✅ Uso
boolean valido = TipoDocumento.CPF.validarTamanho("12345678901"); // true
String erro = TipoDocumento.CNPJ.getMensagemErro();               // "CNPJ deve ter 14 dígitos"
```

### 6. Método com Coleções

```java
public enum StatusPedido {
    NOVO,
    APROVADO,
    ENVIADO,
    ENTREGUE,
    CANCELADO;
    
    // ✅ Método que retorna lista
    public List<StatusPedido> getProximosEstados() {
        switch (this) {
            case NOVO:
                return Arrays.asList(APROVADO, CANCELADO);
            case APROVADO:
                return Arrays.asList(ENVIADO, CANCELADO);
            case ENVIADO:
                return Collections.singletonList(ENTREGUE);
            case ENTREGUE:
            case CANCELADO:
                return Collections.emptyList();
            default:
                return Collections.emptyList();
        }
    }
    
    public boolean podeTransicionarPara(StatusPedido novoStatus) {
        return getProximosEstados().contains(novoStatus);
    }
}

// ✅ Uso
List<StatusPedido> proximos = StatusPedido.NOVO.getProximosEstados();
// [APROVADO, CANCELADO]

boolean pode = StatusPedido.APROVADO.podeTransicionarPara(StatusPedido.ENVIADO);
// true
```

### 7. Método Utilitário

```java
public enum Forma {
    CIRCULO,
    QUADRADO,
    RETANGULO,
    TRIANGULO;
    
    // ✅ Métodos utilitários compartilhados
    public int getNumeroLados() {
        switch (this) {
            case CIRCULO:
                return 0;
            case TRIANGULO:
                return 3;
            case QUADRADO:
            case RETANGULO:
                return 4;
            default:
                return 0;
        }
    }
    
    public boolean isPoligono() {
        return this != CIRCULO;
    }
    
    public String getDescricao() {
        return name() + " (" + getNumeroLados() + " lados)";
    }
}

// ✅ Uso
int lados = Forma.TRIANGULO.getNumeroLados(); // 3
boolean poli = Forma.CIRCULO.isPoligono();    // false
String desc = Forma.QUADRADO.getDescricao();  // "QUADRADO (4 lados)"
```

### 8. Método com Formatação

```java
public enum Moeda {
    BRL("R$", 2),
    USD("$", 2),
    EUR("€", 2),
    JPY("¥", 0);
    
    private final String simbolo;
    private final int casasDecimais;
    
    Moeda(String simbolo, int casasDecimais) {
        this.simbolo = simbolo;
        this.casasDecimais = casasDecimais;
    }
    
    // ✅ Método concreto de formatação
    public String formatar(double valor) {
        String formato = "%." + casasDecimais + "f";
        return simbolo + " " + String.format(formato, valor);
    }
    
    public String getSimbolo() {
        return simbolo;
    }
}

// ✅ Uso
String formatado1 = Moeda.BRL.formatar(100.50); // "R$ 100,50"
String formatado2 = Moeda.JPY.formatar(1000);   // "¥ 1000"
```

### 9. Método com Comparação

```java
public enum NivelAcesso {
    GUEST(0),
    USER(1),
    MODERADOR(2),
    ADMIN(3);
    
    private final int nivel;
    
    NivelAcesso(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() {
        return nivel;
    }
    
    // ✅ Métodos de comparação
    public boolean temPermissaoMaiorOuIgual(NivelAcesso outro) {
        return this.nivel >= outro.nivel;
    }
    
    public boolean podeAcessar(NivelAcesso nivelMinimo) {
        return this.nivel >= nivelMinimo.nivel;
    }
    
    public NivelAcesso getMaior(NivelAcesso outro) {
        return this.nivel > outro.nivel ? this : outro;
    }
}

// ✅ Uso
boolean pode = NivelAcesso.ADMIN.podeAcessar(NivelAcesso.USER);          // true
boolean pode2 = NivelAcesso.GUEST.podeAcessar(NivelAcesso.MODERADOR);    // false
NivelAcesso maior = NivelAcesso.USER.getMaior(NivelAcesso.MODERADOR);   // MODERADOR
```

### 10. Método Template

```java
public enum TipoNotificacao {
    EMAIL,
    SMS,
    PUSH;
    
    // ✅ Método template (final)
    public final void enviarNotificacao(String destinatario, String mensagem) {
        validar(destinatario, mensagem);
        formatar(mensagem);
        enviar(destinatario, mensagem);
        registrar(destinatario);
    }
    
    // Métodos concretos auxiliares
    protected void validar(String destinatario, String mensagem) {
        if (destinatario == null || destinatario.isEmpty()) {
            throw new IllegalArgumentException("Destinatário inválido");
        }
        if (mensagem == null || mensagem.isEmpty()) {
            throw new IllegalArgumentException("Mensagem inválida");
        }
    }
    
    protected void formatar(String mensagem) {
        System.out.println("Formatando mensagem: " + mensagem);
    }
    
    protected void enviar(String destinatario, String mensagem) {
        switch (this) {
            case EMAIL:
                System.out.println("Enviando email para: " + destinatario);
                break;
            case SMS:
                System.out.println("Enviando SMS para: " + destinatario);
                break;
            case PUSH:
                System.out.println("Enviando push para: " + destinatario);
                break;
        }
    }
    
    protected void registrar(String destinatario) {
        System.out.println("Notificação registrada para: " + destinatario);
    }
}

// ✅ Uso: método template compartilhado
TipoNotificacao.EMAIL.enviarNotificacao("user@email.com", "Olá!");
```

---

## Aplicabilidade

**Método concreto** quando:
- Lógica compartilhada por **todas** as constantes
- Método utilitário
- Acesso a atributos
- Validação comum
- Formatação padrão

**Vantagens**:
- Código reutilizado
- Sem duplicação
- Fácil manutenção
- Todas as constantes herdam

---

## Armadilhas

### 1. Switch Complexo

```java
// ⚠️ Switch muito grande (considerar método abstrato)
public String get() {
    switch (this) {
        case A: return "valor a";
        case B: return "valor b";
        // ... 20 cases ⚠️
    }
}

// ✅ Método abstrato se cada constante é diferente
public abstract String get();
```

### 2. Lógica Específica no Concreto

```java
// ⚠️ Lógica específica em método concreto
public void processar() {
    if (this == ESPECIAL) {
        // lógica específica ⚠️
    }
}

// ✅ Sobrescrever em ESPECIAL
ESPECIAL {
    @Override
    public void processar() {
        // lógica específica
    }
};
```

### 3. Método Final Quando Pode Sobrescrever

```java
// ⚠️ Final impede sobrescrita
public final String get() { }

// ✅ Não usar final se constantes podem sobrescrever
public String get() { }
```

---

## Boas Práticas

### 1. Método Simples e Claro

```java
public boolean isAtivo() {
    return this == ATIVO || this == PENDENTE;
}
```

### 2. Reutilizar Lógica Comum

```java
public String getDescricao() {
    return name() + " - " + getNivel();
}
```

### 3. Documentar Comportamento

```java
/**
 * Retorna true se o status permite edição.
 * 
 * @return true para NOVO e APROVADO, false caso contrário
 */
public boolean podeEditar() {
    return this == NOVO || this == APROVADO;
}
```

### 4. Static para Utilitários

```java
public static Status fromString(String nome) {
    // lógica compartilhada
}
```

---

## Resumo

**Métodos concretos como padrão**:

```java
public enum Status {
    ATIVO,
    INATIVO,
    BLOQUEADO;
    
    // ✅ Método concreto: todas as constantes herdam
    public String getDescricao() {
        return "Status: " + name();
    }
    
    public boolean isValido() {
        return this != BLOQUEADO;
    }
    
    // ✅ Static para utilitários
    public static Status fromString(String nome) {
        try {
            return valueOf(nome.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}

// ✅ Todas as constantes têm acesso
Status.ATIVO.getDescricao();   // "Status: ATIVO"
Status.INATIVO.isValido();     // true
Status status = Status.fromString("ativo"); // ATIVO
```

**Características**:
- Lógica **compartilhada** por todas
- Constantes **herdam** implementação
- Pode usar **switch** se necessário
- Pode ser **sobrescrito** por constante
- **Static** para utilitários globais

**Regra de Ouro**: **Método concreto** quando lógica é **compartilhada** por todas as constantes. **Reutiliza** código, evita **duplicação**. Use **switch** para lógica diferente por constante, ou **método abstrato** se cada constante é única. **Static** para utilitários que não dependem da instância.
