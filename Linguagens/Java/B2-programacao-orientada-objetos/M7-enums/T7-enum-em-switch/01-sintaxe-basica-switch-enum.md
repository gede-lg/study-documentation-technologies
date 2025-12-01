# T7.01 - Sintaxe Básica: Switch com Enum

## Introdução

**Switch** funciona **perfeitamente** com **enums**.

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

public class Exemplo {
    public boolean isUtil(DiaSemana dia) {
        switch (dia) {
            case SEGUNDA:
            case TERCA:
            case QUARTA:
            case QUINTA:
            case SEXTA:
                return true;
            case SABADO:
            case DOMINGO:
                return false;
            default:
                throw new IllegalArgumentException("Dia inválido");
        }
    }
}

// ✅ Tipo seguro
// ✅ Código limpo
// ✅ Compilador valida
```

**Vantagens**:
- **Tipo seguro** (compilador valida)
- Sem `String` ou `int` mágicos
- IDE autocomplete
- Refatoração segura

---

## Fundamentos

### 1. Switch Statement Básico

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE, BLOQUEADO
}

public class GerenciadorStatus {
    public String getDescricao(Status status) {
        switch (status) {
            case ATIVO:
                return "Usuário ativo no sistema";
            case INATIVO:
                return "Usuário inativo";
            case PENDENTE:
                return "Aguardando aprovação";
            case BLOQUEADO:
                return "Acesso bloqueado";
            default:
                return "Status desconhecido";
        }
    }
}

// ✅ case usa nome da constante (sem qualificador)
// ✅ Não precisa "Status.ATIVO", só "ATIVO"
```

### 2. Sintaxe do Case

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA, URGENTE
}

public int getTempoResposta(Prioridade prioridade) {
    switch (prioridade) {
        case BAIXA:     // ← Nome da constante (sem enum.)
            return 72;  // horas
        case MEDIA:
            return 24;
        case ALTA:
            return 8;
        case URGENTE:
            return 1;
        default:
            throw new IllegalArgumentException("Prioridade inválida");
    }
}

// ✅ case BAIXA (não case Prioridade.BAIXA)
// ✅ Compilador sabe que é Prioridade
```

### 3. Fall-Through

```java
public enum TipoPagamento {
    DINHEIRO, PIX, DEBITO, CREDITO, BOLETO
}

public boolean requerCartao(TipoPagamento tipo) {
    switch (tipo) {
        case DEBITO:
        case CREDITO:
            // ✅ Fall-through: ambos caem aqui
            return true;
        case DINHEIRO:
        case PIX:
        case BOLETO:
            return false;
        default:
            throw new IllegalArgumentException("Tipo inválido");
    }
}

// ✅ DEBITO e CREDITO compartilham mesmo código
```

### 4. Múltiplas Ações por Case

```java
public enum Operacao {
    CRIAR, EDITAR, DELETAR, VISUALIZAR
}

public void executar(Operacao operacao, String recurso) {
    switch (operacao) {
        case CRIAR:
            validarPermissao("criar");
            log("Criando recurso: " + recurso);
            criar(recurso);
            break;
        case EDITAR:
            validarPermissao("editar");
            log("Editando recurso: " + recurso);
            editar(recurso);
            break;
        case DELETAR:
            validarPermissao("deletar");
            log("Deletando recurso: " + recurso);
            deletar(recurso);
            break;
        case VISUALIZAR:
            log("Visualizando recurso: " + recurso);
            visualizar(recurso);
            break;
        default:
            throw new IllegalArgumentException("Operação inválida");
    }
}

// ✅ Múltiplas linhas por case
// ✅ break obrigatório (exceto fall-through)
```

### 5. Return Direto (Sem Break)

```java
public enum Moeda {
    BRL, USD, EUR, GBP
}

public String getSimbolo(Moeda moeda) {
    switch (moeda) {
        case BRL:
            return "R$";
        case USD:
            return "$";
        case EUR:
            return "€";
        case GBP:
            return "£";
        default:
            throw new IllegalArgumentException("Moeda inválida");
    }
}

// ✅ return elimina necessidade de break
```

### 6. Blocos de Código

```java
public enum TipoArquivo {
    TEXTO, IMAGEM, VIDEO, AUDIO
}

public void processar(TipoArquivo tipo, String arquivo) {
    switch (tipo) {
        case TEXTO: {
            // ✅ Bloco com variáveis locais
            String conteudo = ler(arquivo);
            String processado = processar(conteudo);
            salvar(processado);
            break;
        }
        case IMAGEM: {
            BufferedImage img = lerImagem(arquivo);
            BufferedImage redimensionada = redimensionar(img);
            salvarImagem(redimensionada);
            break;
        }
        case VIDEO: {
            Video video = lerVideo(arquivo);
            Video comprimido = comprimir(video);
            salvarVideo(comprimido);
            break;
        }
        case AUDIO: {
            Audio audio = lerAudio(arquivo);
            Audio normalizado = normalizar(audio);
            salvarAudio(normalizado);
            break;
        }
        default:
            throw new IllegalArgumentException("Tipo inválido");
    }
}

// ✅ Blocos { } isolam escopo de variáveis
```

### 7. Switch com Null

```java
public enum Estado {
    NOVO, PROCESSANDO, CONCLUIDO, ERRO
}

public String getDescricao(Estado estado) {
    // ✅ Validar null antes do switch
    if (estado == null) {
        return "Estado não informado";
    }
    
    switch (estado) {
        case NOVO:
            return "Novo";
        case PROCESSANDO:
            return "Em processamento";
        case CONCLUIDO:
            return "Concluído";
        case ERRO:
            return "Erro";
        default:
            return "Desconhecido";
    }
}

// ⚠️ Switch com enum null lança NullPointerException
// ✅ Validar null ANTES do switch
```

### 8. Switch Aninhado

```java
public enum TipoUsuario {
    ADMIN, MODERADOR, USUARIO
}

public enum Acao {
    LER, ESCREVER, DELETAR
}

public boolean temPermissao(TipoUsuario tipo, Acao acao) {
    switch (tipo) {
        case ADMIN:
            return true; // Admin pode tudo
        case MODERADOR:
            switch (acao) {
                case LER:
                case ESCREVER:
                    return true;
                case DELETAR:
                    return false;
                default:
                    return false;
            }
        case USUARIO:
            switch (acao) {
                case LER:
                    return true;
                case ESCREVER:
                case DELETAR:
                    return false;
                default:
                    return false;
            }
        default:
            return false;
    }
}

// ✅ Switch dentro de switch
// ⚠️ Pode ficar complexo, considerar alternativas
```

### 9. Switch com Exceções

```java
public enum TipoConversao {
    PARA_MAIUSCULA, PARA_MINUSCULA, PARA_NUMERO, PARA_DATA
}

public Object converter(TipoConversao tipo, String valor) {
    switch (tipo) {
        case PARA_MAIUSCULA:
            return valor.toUpperCase();
        case PARA_MINUSCULA:
            return valor.toLowerCase();
        case PARA_NUMERO:
            try {
                return Integer.parseInt(valor);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Valor não é número: " + valor);
            }
        case PARA_DATA:
            try {
                return LocalDate.parse(valor);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Valor não é data válida: " + valor);
            }
        default:
            throw new IllegalArgumentException("Tipo de conversão inválido");
    }
}

// ✅ Try-catch dentro do case
```

### 10. Switch como Método

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

public class Calendario {
    public boolean isUtil(DiaSemana dia) {
        switch (dia) {
            case SEGUNDA:
            case TERCA:
            case QUARTA:
            case QUINTA:
            case SEXTA:
                return true;
            case SABADO:
            case DOMINGO:
                return false;
            default:
                throw new IllegalArgumentException("Dia inválido: " + dia);
        }
    }
    
    public boolean isFimDeSemana(DiaSemana dia) {
        switch (dia) {
            case SABADO:
            case DOMINGO:
                return true;
            default:
                return false;
        }
    }
    
    public int getNumeroTrabalho(DiaSemana dia) {
        switch (dia) {
            case SEGUNDA: return 1;
            case TERCA:   return 2;
            case QUARTA:  return 3;
            case QUINTA:  return 4;
            case SEXTA:   return 5;
            case SABADO:  return 0;
            case DOMINGO: return 0;
            default:
                throw new IllegalArgumentException("Dia inválido");
        }
    }
}

// ✅ Métodos pequenos com switch
// ✅ Retorno direto sem break
```

---

## Aplicabilidade

**Switch com enum** quando:
- Lógica **diferente** por constante
- **Alternativa** a métodos abstratos
- Código **fora** do enum
- Múltiplos enums (switch aninhado)

**Vantagens**:
- Tipo seguro
- Compilador valida
- IDE autocomplete
- Refatoração segura

---

## Armadilhas

### 1. Esquecer Break

```java
// ⚠️ Sem break: fall-through não intencional
switch (status) {
    case ATIVO:
        processar(); // ⚠️ Executa
    case INATIVO:    // ⚠️ Também executa
        logar();
        break;
}

// ✅ Adicionar break
switch (status) {
    case ATIVO:
        processar();
        break; // ✅
    case INATIVO:
        logar();
        break;
}
```

### 2. Null no Switch

```java
// ⚠️ NullPointerException
switch (status) { // status = null ⚠️
    case ATIVO:
        // ...
}

// ✅ Validar null antes
if (status == null) {
    throw new IllegalArgumentException("Status null");
}
switch (status) {
    // ...
}
```

### 3. Qualificador Desnecessário

```java
// ⚠️ Erro de compilação
switch (status) {
    case Status.ATIVO: // ⚠️ Não compilar
        break;
}

// ✅ Sem qualificador
switch (status) {
    case ATIVO: // ✅
        break;
}
```

---

## Boas Práticas

### 1. Sempre Incluir Default

```java
// ✅ Default para casos inesperados
switch (status) {
    case ATIVO:
        return "Ativo";
    case INATIVO:
        return "Inativo";
    default:
        throw new IllegalArgumentException("Status inválido: " + status);
}
```

### 2. Return em Vez de Break

```java
// ✅ Return elimina break
public String get(Status status) {
    switch (status) {
        case ATIVO:   return "Ativo";
        case INATIVO: return "Inativo";
        default:      throw new IllegalArgumentException();
    }
}
```

### 3. Fall-Through Intencional

```java
// ✅ Fall-through documentado
switch (tipo) {
    case DEBITO:
    case CREDITO:
        // Ambos requerem cartão
        return true;
    default:
        return false;
}
```

### 4. Validar Null

```java
// ✅ Validar null antes
if (status == null) {
    throw new IllegalArgumentException("Status null");
}
switch (status) {
    // ...
}
```

---

## Resumo

**Switch com enum**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

public String getDescricao(Status status) {
    switch (status) {  // ← Enum como expressão
        case ATIVO:    // ← Nome da constante (sem qualificador)
            return "Ativo";
        case INATIVO:
            return "Inativo";
        case PENDENTE:
            return "Pendente";
        default:       // ← Sempre incluir default
            throw new IllegalArgumentException("Status inválido");
    }
}
```

**Sintaxe**:
- `switch (enum)`: expressão enum
- `case CONSTANTE:`: sem qualificador
- `break` ou `return`: terminar case
- Fall-through: múltiplos `case` consecutivos
- `default`: casos inesperados

**Características**:
- **Tipo seguro**: compilador valida
- **Sem qualificador**: `case ATIVO` (não `case Status.ATIVO`)
- **Null**: lança `NullPointerException`, validar antes
- **Break**: obrigatório (exceto `return` ou fall-through)
- **Default**: sempre incluir para segurança

**Regra de Ouro**: **Switch com enum** = tipo seguro e limpo. Use `case CONSTANTE` (sem qualificador). **Sempre** inclua `default`. **Valide null** antes do switch. Prefira `return` a `break` quando possível. **Fall-through** intencional OK. Compilador **valida** todas as constantes.
