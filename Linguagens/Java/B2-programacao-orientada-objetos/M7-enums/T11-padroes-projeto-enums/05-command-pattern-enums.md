# ⚙️ Command Pattern com Enums

## 🎯 Introdução

O **Command Pattern** com enums encapsula **ações como constantes enum**, permitindo parametrização de operações, enfileiramento de requisições, logging de comandos e implementação de undo/redo de forma concisa e type-safe. Cada **constante enum representa um comando** com sua lógica de execução implementada através de **constant-specific methods**, eliminando a proliferação de classes comando do padrão GoF tradicional.

### Contexto Histórico

**Command Pattern Clássico (GoF):**

```java
// ❌ Implementação tradicional - muitas classes
interface Command {
    void execute();
}

class SalvarCommand implements Command {
    private Documento documento;

    public SalvarCommand(Documento documento) {
        this.documento = documento;
    }

    public void execute() {
        documento.salvar();
    }
}

class ImprimirCommand implements Command {
    private Documento documento;

    public ImprimirCommand(Documento documento) {
        this.documento = documento;
    }

    public void execute() {
        documento.imprimir();
    }
}

// Uso
Command cmd = new SalvarCommand(documento);
cmd.execute();
```

**Problemas:**
- 1 classe por comando (verboso)
- Muito boilerplate
- Difícil visualizar todos os comandos disponíveis

**Command com Enum:**

```java
// ✅ Implementação concisa com enum
public enum ComandoDocumento {
    SALVAR {
        public void executar(Documento doc) {
            doc.salvar();
        }
    },
    IMPRIMIR {
        public void executar(Documento doc) {
            doc.imprimir();
        }
    },
    FECHAR {
        public void executar(Documento doc) {
            doc.fechar();
        }
    };

    public abstract void executar(Documento doc);
}

// Uso
ComandoDocumento.SALVAR.executar(documento);
```

## 📋 Fundamentos Teóricos

### Elementos do Command Pattern

**1. Command (Enum)**: Encapsula a ação

```java
public enum Comando {
    ACAO_A { void executar() { /* ... */ } },
    ACAO_B { void executar() { /* ... */ } };

    abstract void executar();
}
```

**2. Receiver (Parâmetro)**: Objeto que sofre a ação

```java
public enum Comando {
    SALVAR {
        void executar(Editor receiver) {
            receiver.salvar();  // receiver é quem executa de fato
        }
    };

    abstract void executar(Editor receiver);
}
```

**3. Invoker (Cliente)**: Quem dispara o comando

```java
public class Toolbar {
    public void clicarBotao(Comando comando, Editor editor) {
        comando.executar(editor);  // Invoker dispara
    }
}
```

## 🔍 Exemplos Práticos

### Comandos de Editor de Texto

```java
public enum ComandoEditor {
    COPIAR {
        public void executar(Editor editor) {
            String textoSelecionado = editor.getTextoSelecionado();
            editor.setClipboard(textoSelecionado);
            System.out.println("Texto copiado");
        }

        public boolean podeDesfazer() {
            return false;  // Copiar não precisa desfazer
        }
    },
    COLAR {
        private String textoAnterior;

        public void executar(Editor editor) {
            textoAnterior = editor.getTexto();
            String clipboard = editor.getClipboard();
            editor.inserirTexto(clipboard);
            System.out.println("Texto colado");
        }

        public void desfazer(Editor editor) {
            editor.setTexto(textoAnterior);
        }

        public boolean podeDesfazer() {
            return true;
        }
    },
    RECORTAR {
        private String textoRemovido;
        private int posicao;

        public void executar(Editor editor) {
            textoRemovido = editor.getTextoSelecionado();
            posicao = editor.getPosicaoCursor();
            editor.setClipboard(textoRemovido);
            editor.removerTextoSelecionado();
            System.out.println("Texto recortado");
        }

        public void desfazer(Editor editor) {
            editor.inserirTextoNaPosicao(textoRemovido, posicao);
        }

        public boolean podeDesfazer() {
            return true;
        }
    },
    NEGRITO {
        public void executar(Editor editor) {
            editor.aplicarNegrito();
            System.out.println("Negrito aplicado");
        }

        public void desfazer(Editor editor) {
            editor.removerNegrito();
        }

        public boolean podeDesfazer() {
            return true;
        }
    };

    public abstract void executar(Editor editor);

    public void desfazer(Editor editor) {
        throw new UnsupportedOperationException("Comando não suporta desfazer");
    }

    public abstract boolean podeDesfazer();
}

// Contexto
public class GerenciadorComandos {
    private Stack<ComandoEditor> historico = new Stack<>();
    private Editor editor;

    public GerenciadorComandos(Editor editor) {
        this.editor = editor;
    }

    public void executar(ComandoEditor comando) {
        comando.executar(editor);
        if (comando.podeDesfazer()) {
            historico.push(comando);
        }
    }

    public void desfazer() {
        if (!historico.isEmpty()) {
            ComandoEditor comando = historico.pop();
            comando.desfazer(editor);
        }
    }
}
```

### Comandos de Controle Remoto

```java
public enum ComandoDispositivo {
    LIGAR {
        public void executar(Dispositivo dispositivo) {
            dispositivo.ligar();
            System.out.println(dispositivo.getNome() + " ligado");
        }
    },
    DESLIGAR {
        public void executar(Dispositivo dispositivo) {
            dispositivo.desligar();
            System.out.println(dispositivo.getNome() + " desligado");
        }
    },
    AUMENTAR_VOLUME {
        public void executar(Dispositivo dispositivo) {
            if (dispositivo instanceof DispositivoComVolume) {
                ((DispositivoComVolume) dispositivo).aumentarVolume();
            }
        }
    },
    DIMINUIR_VOLUME {
        public void executar(Dispositivo dispositivo) {
            if (dispositivo instanceof DispositivoComVolume) {
                ((DispositivoComVolume) dispositivo).diminuirVolume();
            }
        }
    },
    TROCAR_CANAL {
        public void executar(Dispositivo dispositivo) {
            if (dispositivo instanceof TV) {
                ((TV) dispositivo).proximoCanal();
            }
        }
    };

    public abstract void executar(Dispositivo dispositivo);
}

// Controle remoto (Invoker)
public class ControleRemoto {
    private Map<String, Dispositivo> dispositivos = new HashMap<>();
    private List<ComandoExecutado> log = new ArrayList<>();

    public void registrarDispositivo(String nome, Dispositivo dispositivo) {
        dispositivos.put(nome, dispositivo);
    }

    public void executarComando(String nomeDispositivo, ComandoDispositivo comando) {
        Dispositivo dispositivo = dispositivos.get(nomeDispositivo);
        if (dispositivo != null) {
            comando.executar(dispositivo);
            log.add(new ComandoExecutado(comando, dispositivo, LocalDateTime.now()));
        }
    }

    public List<ComandoExecutado> getLog() {
        return new ArrayList<>(log);
    }
}
```

### Comandos de Operações Bancárias

```java
public enum OperacaoBancaria {
    DEPOSITO {
        public boolean executar(Conta conta, double valor) {
            if (valor <= 0) {
                System.out.println("Valor inválido");
                return false;
            }
            conta.setSaldo(conta.getSaldo() + valor);
            System.out.println("Depósito de " + valor + " realizado");
            return true;
        }

        public String getDescricao() {
            return "Depósito em conta";
        }
    },
    SAQUE {
        public boolean executar(Conta conta, double valor) {
            if (valor <= 0) {
                System.out.println("Valor inválido");
                return false;
            }
            if (conta.getSaldo() < valor) {
                System.out.println("Saldo insuficiente");
                return false;
            }
            conta.setSaldo(conta.getSaldo() - valor);
            System.out.println("Saque de " + valor + " realizado");
            return true;
        }

        public String getDescricao() {
            return "Saque de conta";
        }
    },
    TRANSFERENCIA {
        public boolean executar(Conta origem, Conta destino, double valor) {
            if (valor <= 0 || origem.getSaldo() < valor) {
                return false;
            }
            origem.setSaldo(origem.getSaldo() - valor);
            destino.setSaldo(destino.getSaldo() + valor);
            System.out.println("Transferência de " + valor + " realizada");
            return true;
        }

        public boolean executar(Conta conta, double valor) {
            throw new UnsupportedOperationException("Use executar(origem, destino, valor)");
        }

        public String getDescricao() {
            return "Transferência entre contas";
        }
    },
    PAGAMENTO {
        public boolean executar(Conta conta, double valor) {
            if (valor <= 0 || conta.getSaldo() < valor) {
                return false;
            }
            double taxa = valor * 0.02;  // 2% de taxa
            double total = valor + taxa;
            if (conta.getSaldo() < total) {
                System.out.println("Saldo insuficiente (incluindo taxa)");
                return false;
            }
            conta.setSaldo(conta.getSaldo() - total);
            System.out.println("Pagamento de " + valor + " + taxa " + taxa + " realizado");
            return true;
        }

        public String getDescricao() {
            return "Pagamento de conta/boleto";
        }
    };

    public abstract boolean executar(Conta conta, double valor);

    public boolean executar(Conta origem, Conta destino, double valor) {
        throw new UnsupportedOperationException("Operação não suportada");
    }

    public abstract String getDescricao();
}

// Sistema de log de transações
public class RegistroTransacoes {
    private List<Transacao> transacoes = new ArrayList<>();

    public void registrar(OperacaoBancaria operacao, Conta conta, double valor, boolean sucesso) {
        transacoes.add(new Transacao(
            LocalDateTime.now(),
            operacao,
            conta.getNumero(),
            valor,
            sucesso
        ));
    }

    public void executarOperacao(OperacaoBancaria operacao, Conta conta, double valor) {
        boolean sucesso = operacao.executar(conta, valor);
        registrar(operacao, conta, valor, sucesso);
    }

    public List<Transacao> getHistorico() {
        return new ArrayList<>(transacoes);
    }
}
```

### Comandos de Build/Deploy

```java
public enum ComandoBuild {
    CLEAN {
        public void executar(Projeto projeto) {
            System.out.println("Limpando diretório target...");
            projeto.limparBuild();
        }

        public int getOrdem() { return 1; }
    },
    COMPILE {
        public void executar(Projeto projeto) {
            System.out.println("Compilando código-fonte...");
            projeto.compilar();
        }

        public int getOrdem() { return 2; }
    },
    TEST {
        public void executar(Projeto projeto) {
            System.out.println("Executando testes...");
            projeto.executarTestes();
        }

        public int getOrdem() { return 3; }
    },
    PACKAGE {
        public void executar(Projeto projeto) {
            System.out.println("Empacotando aplicação...");
            projeto.empacotar();
        }

        public int getOrdem() { return 4; }
    },
    DEPLOY {
        public void executar(Projeto projeto) {
            System.out.println("Fazendo deploy...");
            projeto.deploy();
        }

        public int getOrdem() { return 5; }
    };

    public abstract void executar(Projeto projeto);
    public abstract int getOrdem();

    // Executar pipeline completo
    public static void executarPipeline(Projeto projeto, ComandoBuild... comandos) {
        Arrays.stream(comandos)
            .sorted(Comparator.comparingInt(ComandoBuild::getOrdem))
            .forEach(cmd -> cmd.executar(projeto));
    }
}

// Uso
ComandoBuild.executarPipeline(
    projeto,
    ComandoBuild.CLEAN,
    ComandoBuild.COMPILE,
    ComandoBuild.TEST,
    ComandoBuild.PACKAGE,
    ComandoBuild.DEPLOY
);
```

## 🎯 Macro Commands (Comandos Compostos)

```java
public enum MacroComando {
    BUILD_COMPLETO {
        public void executar(Projeto projeto) {
            ComandoBuild.CLEAN.executar(projeto);
            ComandoBuild.COMPILE.executar(projeto);
            ComandoBuild.TEST.executar(projeto);
            ComandoBuild.PACKAGE.executar(projeto);
        }
    },
    DEPLOY_PRODUCAO {
        public void executar(Projeto projeto) {
            ComandoBuild.CLEAN.executar(projeto);
            ComandoBuild.COMPILE.executar(projeto);
            ComandoBuild.TEST.executar(projeto);
            ComandoBuild.PACKAGE.executar(projeto);
            ComandoBuild.DEPLOY.executar(projeto);
        }
    },
    QUICK_BUILD {
        public void executar(Projeto projeto) {
            ComandoBuild.COMPILE.executar(projeto);
            ComandoBuild.PACKAGE.executar(projeto);
        }
    };

    public abstract void executar(Projeto projeto);
}
```

## ⚡ Vantagens sobre Command Tradicional

**1. Menos Classes**
- Tradicional: 1 interface + N classes
- Enum: 1 enum apenas

**2. Enumeração Automática de Comandos**
```java
// Listar todos os comandos disponíveis
for (ComandoEditor cmd : ComandoEditor.values()) {
    System.out.println(cmd);
}
```

**3. Switch/Pattern Matching**
```java
String descricao = switch (comando) {
    case COPIAR -> "Copiar texto";
    case COLAR -> "Colar texto";
    case RECORTAR -> "Recortar texto";
};
```

**4. Type-Safe**
```java
// ❌ Tradicional aceita qualquer Command
executar(new ComandoInvalido());

// ✅ Enum só aceita valores válidos
executar(ComandoEditor.COPIAR);
```

## ⚠️ Limitações

**1. Comandos Fixos**
```java
// ❌ Não é possível adicionar comandos em runtime
// Comandos são definidos em tempo de compilação
```

**2. Estado do Comando**
```java
// Cuidado com estado mutável em enums
// Preferir passar estado via parâmetros
```

## 🔗 Interconexões

**Relação com Strategy**: Command encapsula ação; Strategy encapsula algoritmo

**Relação com Memento**: Combinação para undo/redo robusto

**Relação com Chain of Responsibility**: Comandos podem ser encadeados
