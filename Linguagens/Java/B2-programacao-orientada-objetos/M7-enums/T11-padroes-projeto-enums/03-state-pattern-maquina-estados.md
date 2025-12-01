# 🔄 State Pattern (Máquina de Estados)

## 🎯 Introdução

O **State Pattern** com enums oferece implementação elegante e type-safe de máquinas de estados finitas (FSM - Finite State Machines), onde cada **constante enum representa um estado** e **transições são modeladas através de métodos**. Ao contrário do State Pattern clássico que requer múltiplas classes de estado, a abordagem com enums centraliza todos os estados e transições em um único arquivo, tornando a máquina de estados **mais legível, manutenível e verificável em tempo de compilação**.

### Contexto Histórico

**Problema Antes de Enums:**

Máquinas de estados eram implementadas com **int constants** ou **múltiplas classes**, resultando em código verboso e propenso a erros.

```java
// ❌ Estados com constantes int - sem type-safety
public class Documento {
    public static final int RASCUNHO = 0;
    public static final int EM_REVISAO = 1;
    public static final int APROVADO = 2;
    public static final int PUBLICADO = 3;

    private int estado = RASCUNHO;

    public void enviarParaRevisao() {
        if (estado == RASCUNHO) {
            estado = EM_REVISAO;
        } else {
            throw new IllegalStateException("Estado inválido");
        }
    }

    // Problema: aceita qualquer int
    estado = 999;  // Compila mas é inválido!
}
```

**State Pattern Clássico (GoF):**

```java
// ❌ Verboso - requer múltiplas classes
interface EstadoDocumento {
    void enviarParaRevisao(Documento doc);
    void aprovar(Documento doc);
}

class Rascunho implements EstadoDocumento {
    public void enviarParaRevisao(Documento doc) {
        doc.setEstado(new EmRevisao());
    }
    public void aprovar(Documento doc) {
        throw new IllegalStateException();
    }
}

class EmRevisao implements EstadoDocumento {
    public void enviarParaRevisao(Documento doc) {
        throw new IllegalStateException();
    }
    public void aprovar(Documento doc) {
        doc.setEstado(new Aprovado());
    }
}
// ... mais 2+ classes
```

**Problemas:**
- 5+ arquivos (interface + 4 classes)
- Difícil visualizar transições completas
- Propenso a erros (estados esquecidos)

**State Pattern com Enum:**

```java
// ✅ Conciso e type-safe
public enum EstadoDocumento {
    RASCUNHO {
        public EstadoDocumento enviarParaRevisao() {
            return EM_REVISAO;
        }
    },
    EM_REVISAO {
        public EstadoDocumento aprovar() {
            return APROVADO;
        }
    },
    APROVADO {
        public EstadoDocumento publicar() {
            return PUBLICADO;
        }
    },
    PUBLICADO;

    public EstadoDocumento enviarParaRevisao() {
        throw new IllegalStateException("Transição inválida");
    }

    public EstadoDocumento aprovar() {
        throw new IllegalStateException("Transição inválida");
    }

    public EstadoDocumento publicar() {
        throw new IllegalStateException("Transição inválida");
    }
}
```

## 📋 Fundamentos Teóricos

### Máquina de Estados Finita (FSM)

Uma FSM consiste em:
1. **Estados**: Conjunto finito de condições (enums)
2. **Transições**: Mudanças de estado baseadas em eventos (métodos)
3. **Estado Inicial**: Estado de partida
4. **Estados Finais**: Estados terminais (opcionais)

### Como Modelar com Enums

**1. Cada Constante = Um Estado**

```java
public enum EstadoPedido {
    CARRINHO,      // Estado inicial
    CONFIRMADO,    // Estado intermediário
    PAGO,          // Estado intermediário
    ENVIADO,       // Estado intermediário
    ENTREGUE,      // Estado final
    CANCELADO      // Estado final
}
```

**2. Métodos = Transições**

```java
public enum Estado {
    A {
        public Estado evento1() { return B; }  // Transição A → B
    },
    B {
        public Estado evento2() { return C; }  // Transição B → C
    },
    C;

    public Estado evento1() {
        throw new IllegalStateException("Transição inválida");
    }

    public Estado evento2() {
        throw new IllegalStateException("Transição inválida");
    }
}
```

**3. Implementação Padrão para Transições Inválidas**

Métodos abstratos ou concretos com exceção no enum forçam implementação explícita apenas onde transições são válidas.

## 🔍 Exemplos Práticos

### Máquina de Estados: Pedido E-commerce

```java
public enum EstadoPedido {
    CARRINHO {
        public EstadoPedido confirmar() {
            return CONFIRMADO;
        }

        public boolean podeEditar() {
            return true;
        }
    },
    CONFIRMADO {
        public EstadoPedido pagar() {
            return PAGO;
        }

        public EstadoPedido cancelar() {
            return CANCELADO;
        }

        public boolean podeEditar() {
            return false;
        }
    },
    PAGO {
        public EstadoPedido enviar() {
            return ENVIADO;
        }

        public EstadoPedido cancelar() {
            return CANCELADO;
        }

        public boolean podeEditar() {
            return false;
        }
    },
    ENVIADO {
        public EstadoPedido entregar() {
            return ENTREGUE;
        }

        public boolean podeEditar() {
            return false;
        }
    },
    ENTREGUE {
        public boolean podeEditar() {
            return false;
        }
    },
    CANCELADO {
        public boolean podeEditar() {
            return false;
        }
    };

    // Métodos padrão (transições inválidas lançam exceção)
    public EstadoPedido confirmar() {
        throw new IllegalStateException("Não é possível confirmar neste estado");
    }

    public EstadoPedido pagar() {
        throw new IllegalStateException("Não é possível pagar neste estado");
    }

    public EstadoPedido enviar() {
        throw new IllegalStateException("Não é possível enviar neste estado");
    }

    public EstadoPedido entregar() {
        throw new IllegalStateException("Não é possível entregar neste estado");
    }

    public EstadoPedido cancelar() {
        throw new IllegalStateException("Não é possível cancelar neste estado");
    }

    public abstract boolean podeEditar();
}

// Classe de contexto
public class Pedido {
    private EstadoPedido estado = EstadoPedido.CARRINHO;
    private List<Item> itens = new ArrayList<>();

    public void confirmar() {
        estado = estado.confirmar();
        System.out.println("Pedido confirmado");
    }

    public void pagar() {
        estado = estado.pagar();
        System.out.println("Pagamento realizado");
    }

    public void enviar() {
        estado = estado.enviar();
        System.out.println("Pedido enviado");
    }

    public void entregar() {
        estado = estado.entregar();
        System.out.println("Pedido entregue");
    }

    public void cancelar() {
        estado = estado.cancelar();
        System.out.println("Pedido cancelado");
    }

    public void adicionarItem(Item item) {
        if (!estado.podeEditar()) {
            throw new IllegalStateException("Pedido não pode ser editado");
        }
        itens.add(item);
    }

    public EstadoPedido getEstado() {
        return estado;
    }
}

// Uso
Pedido pedido = new Pedido();
pedido.adicionarItem(new Item("Livro"));
pedido.confirmar();
pedido.pagar();
pedido.enviar();
pedido.entregar();
// pedido.adicionarItem(new Item("Outro"));  // Lança exceção
```

### Máquina de Estados: Conexão de Rede

```java
public enum EstadoConexao {
    DESCONECTADO {
        public EstadoConexao conectar() {
            System.out.println("Estabelecendo conexão...");
            return CONECTANDO;
        }

        public String getDescricao() {
            return "Sem conexão ativa";
        }
    },
    CONECTANDO {
        public EstadoConexao sucesso() {
            System.out.println("Conexão estabelecida");
            return CONECTADO;
        }

        public EstadoConexao falha() {
            System.out.println("Falha na conexão");
            return ERRO;
        }

        public String getDescricao() {
            return "Conectando ao servidor...";
        }
    },
    CONECTADO {
        public EstadoConexao desconectar() {
            System.out.println("Encerrando conexão...");
            return DESCONECTADO;
        }

        public EstadoConexao perderConexao() {
            System.out.println("Conexão perdida");
            return ERRO;
        }

        public String getDescricao() {
            return "Conectado";
        }
    },
    ERRO {
        public EstadoConexao reconectar() {
            System.out.println("Tentando reconectar...");
            return CONECTANDO;
        }

        public EstadoConexao desistir() {
            return DESCONECTADO;
        }

        public String getDescricao() {
            return "Erro de conexão";
        }
    };

    // Transições padrão (inválidas)
    public EstadoConexao conectar() {
        throw new IllegalStateException("Não é possível conectar neste estado");
    }

    public EstadoConexao desconectar() {
        throw new IllegalStateException("Não é possível desconectar neste estado");
    }

    public EstadoConexao sucesso() {
        throw new IllegalStateException("Transição inválida");
    }

    public EstadoConexao falha() {
        throw new IllegalStateException("Transição inválida");
    }

    public EstadoConexao perderConexao() {
        throw new IllegalStateException("Transição inválida");
    }

    public EstadoConexao reconectar() {
        throw new IllegalStateException("Não é possível reconectar neste estado");
    }

    public EstadoConexao desistir() {
        throw new IllegalStateException("Transição inválida");
    }

    public abstract String getDescricao();
}
```

### Máquina de Estados: Semáforo

```java
public enum EstadoSemaforo {
    VERDE(30) {
        public EstadoSemaforo proximo() {
            return AMARELO;
        }

        public boolean podeCruzar() {
            return true;
        }
    },
    AMARELO(5) {
        public EstadoSemaforo proximo() {
            return VERMELHO;
        }

        public boolean podeCruzar() {
            return false;  // Não deve cruzar
        }
    },
    VERMELHO(25) {
        public EstadoSemaforo proximo() {
            return VERDE;
        }

        public boolean podeCruzar() {
            return false;
        }
    };

    private final int duracaoSegundos;

    EstadoSemaforo(int duracaoSegundos) {
        this.duracaoSegundos = duracaoSegundos;
    }

    public abstract EstadoSemaforo proximo();
    public abstract boolean podeCruzar();

    public int getDuracaoSegundos() {
        return duracaoSegundos;
    }
}

// Contexto
public class Semaforo {
    private EstadoSemaforo estado = EstadoSemaforo.VERDE;

    public void avancar() {
        System.out.println("Estado: " + estado + " (" + estado.getDuracaoSegundos() + "s)");
        estado = estado.proximo();
    }

    public boolean podeCruzar() {
        return estado.podeCruzar();
    }
}

// Uso
Semaforo semaforo = new Semaforo();
semaforo.avancar();  // VERDE → AMARELO
semaforo.avancar();  // AMARELO → VERMELHO
semaforo.avancar();  // VERMELHO → VERDE
```

### Máquina de Estados: Tarefa com Ciclo de Vida

```java
public enum EstadoTarefa {
    NOVA {
        public EstadoTarefa iniciar() {
            return EM_ANDAMENTO;
        }
    },
    EM_ANDAMENTO {
        public EstadoTarefa pausar() {
            return PAUSADA;
        }

        public EstadoTarefa concluir() {
            return CONCLUIDA;
        }

        public EstadoTarefa falhar() {
            return FALHA;
        }
    },
    PAUSADA {
        public EstadoTarefa retomar() {
            return EM_ANDAMENTO;
        }

        public EstadoTarefa cancelar() {
            return CANCELADA;
        }
    },
    CONCLUIDA,
    FALHA {
        public EstadoTarefa reiniciar() {
            return NOVA;
        }
    },
    CANCELADA;

    // Transições padrão
    public EstadoTarefa iniciar() {
        throw new IllegalStateException("Não é possível iniciar");
    }

    public EstadoTarefa pausar() {
        throw new IllegalStateException("Não é possível pausar");
    }

    public EstadoTarefa retomar() {
        throw new IllegalStateException("Não é possível retomar");
    }

    public EstadoTarefa concluir() {
        throw new IllegalStateException("Não é possível concluir");
    }

    public EstadoTarefa falhar() {
        throw new IllegalStateException("Não é possível marcar como falha");
    }

    public EstadoTarefa cancelar() {
        throw new IllegalStateException("Não é possível cancelar");
    }

    public EstadoTarefa reiniciar() {
        throw new IllegalStateException("Não é possível reiniciar");
    }

    public boolean isFinal() {
        return this == CONCLUIDA || this == CANCELADA;
    }
}
```

## 🎯 Vantagens sobre State Pattern Clássico

**1. Visualização Clara de Transições**
- Tudo em um único arquivo
- Fácil ver todos os estados e transições possíveis

**2. Type-Safe**
```java
EstadoPedido estado = EstadoPedido.PAGO;
estado = estado.enviar();  // OK - retorna EstadoPedido
// estado = 999;  // ERRO de compilação
```

**3. Verificação de Completude**
```java
// Compilador avisa se um estado não implementa método abstrato
```

**4. Performance**
- Enum: dispatch otimizado
- State clássico: criação de objetos para cada transição

## ⚠️ Limitações

**1. Estados Fixos em Tempo de Compilação**
```java
// ❌ Não é possível adicionar estados dinamicamente
// Estados são definidos no código
```

**2. Lógica Complexa Pode Ficar Verbosa**
```java
// Se transições têm lógica muito complexa, pode ser melhor usar State clássico
```

**Quando Preferir State Clássico:**
- Estados com lógica muito complexa
- Estados carregados dinamicamente (plugins)
- Necessidade de herança entre estados

## 🔗 Interconexões

**Relação com Switch**: Pode combinar com switch para ações adicionais

**Relação com Constant-Specific Methods**: Base da implementação

**Relação com Strategy**: State é Strategy onde estratégia muda conforme contexto interno
