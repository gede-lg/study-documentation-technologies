# 🚩 Uso em Configurações e Flags

## 🎯 Introdução

EnumSet e EnumMap são ideais para gerenciar **configurações**, **flags** e **opções** em sistemas, substituindo padrões antiquados baseados em constantes inteiras (bit flags) ou múltiplos campos booleanos por soluções **type-safe**, **legíveis** e **performáticas**. Historicamente, configurações eram representadas por inteiros com operações bitwise (`config & FLAG_X != 0`), tornando código ilegível e propenso a erros. Com enums e coleções especializadas, obtemos clareza semântica sem perda de performance.

### Evolução Histórica

**Antes de Enums (C/Java antigo):**

```java
// ❌ Flags com constantes inteiras
public static final int FLAG_READ = 1;      // 0b001
public static final int FLAG_WRITE = 2;     // 0b010
public static final int FLAG_EXECUTE = 4;   // 0b100

int permissions = FLAG_READ | FLAG_WRITE;  // Combinação bitwise
if ((permissions & FLAG_EXECUTE) != 0) {   // Verificação ilegível
    // ...
}
```

**Problemas**:
- Sem type-safety (aceita qualquer int)
- Código críptico e difícil de ler
- Impossível iterar flags ativos
- Sem validação de valores inválidos

**Depois de Enums + EnumSet:**

```java
// ✅ Type-safe e legível
public enum Permissao {
    LER, ESCREVER, EXECUTAR
}

Set<Permissao> permissions = EnumSet.of(Permissao.LER, Permissao.ESCREVER);
if (permissions.contains(Permissao.EXECUTAR)) {
    // Código claro e verificável
}
```

## 📋 Casos de Uso Principais

### 1. Flags de Configuração

Substituir múltiplos campos booleanos por EnumSet.

**Antes (múltiplos booleanos):**

```java
public class ServidorConfig {
    private boolean logHabilitado;
    private boolean cacheHabilitado;
    private boolean compressionHabilitado;
    private boolean sslHabilitado;
    private boolean debugHabilitado;

    // Construtor verboso
    public ServidorConfig(boolean log, boolean cache, boolean compression,
                          boolean ssl, boolean debug) {
        this.logHabilitado = log;
        this.cacheHabilitado = cache;
        // ... repetitivo
    }
}
```

**Depois (EnumSet):**

```java
public enum OpcaoServidor {
    LOG, CACHE, COMPRESSION, SSL, DEBUG
}

public class ServidorConfig {
    private Set<OpcaoServidor> opcoes;

    public ServidorConfig(Set<OpcaoServidor> opcoes) {
        this.opcoes = EnumSet.copyOf(opcoes);
    }

    public boolean isHabilitado(OpcaoServidor opcao) {
        return opcoes.contains(opcao);
    }
}

// Uso
ServidorConfig config = new ServidorConfig(
    EnumSet.of(OpcaoServidor.LOG, OpcaoServidor.SSL)
);
```

### 2. Opções de Feature Toggles

```java
public enum Feature {
    NOVO_LAYOUT, PAGAMENTO_PIX, NOTIFICACOES_PUSH,
    DARK_MODE, AUTENTICACAO_BIOMETRICA
}

public class FeatureManager {
    private Map<Ambiente, Set<Feature>> featuresHabilitadas = new EnumMap<>(Ambiente.class);

    public FeatureManager() {
        // Produção: apenas features estáveis
        featuresHabilitadas.put(Ambiente.PRODUCAO,
            EnumSet.of(Feature.PAGAMENTO_PIX, Feature.DARK_MODE));

        // Homologação: features em teste
        featuresHabilitadas.put(Ambiente.HOMOLOGACAO,
            EnumSet.of(Feature.NOVO_LAYOUT, Feature.PAGAMENTO_PIX,
                       Feature.NOTIFICACOES_PUSH, Feature.DARK_MODE));

        // Desenvolvimento: todas as features
        featuresHabilitadas.put(Ambiente.DESENVOLVIMENTO,
            EnumSet.allOf(Feature.class));
    }

    public boolean isHabilitada(Ambiente ambiente, Feature feature) {
        return featuresHabilitadas.get(ambiente).contains(feature);
    }

    public void habilitarFeature(Ambiente ambiente, Feature feature) {
        featuresHabilitadas.get(ambiente).add(feature);
    }
}
```

### 3. Configurações por Ambiente

```java
public enum Ambiente {
    DESENVOLVIMENTO, HOMOLOGACAO, PRODUCAO
}

public enum ConfigFlag {
    DEBUG_ENABLED, CACHE_ENABLED, MINIFY_ASSETS,
    SSL_REQUIRED, LOGGING_VERBOSE
}

public class AppConfig {
    private Map<Ambiente, Set<ConfigFlag>> configuracoes = new EnumMap<>(Ambiente.class);

    public AppConfig() {
        // Desenvolvimento: debug e logs verbosos
        configuracoes.put(Ambiente.DESENVOLVIMENTO,
            EnumSet.of(ConfigFlag.DEBUG_ENABLED, ConfigFlag.LOGGING_VERBOSE));

        // Produção: cache, minificação, SSL
        configuracoes.put(Ambiente.PRODUCAO,
            EnumSet.of(ConfigFlag.CACHE_ENABLED, ConfigFlag.MINIFY_ASSETS,
                       ConfigFlag.SSL_REQUIRED));
    }

    public Set<ConfigFlag> getConfig(Ambiente ambiente) {
        return EnumSet.copyOf(configuracoes.get(ambiente));
    }
}
```

## 🔍 Padrão: Permission System

Sistema de permissões completo usando EnumSet.

```java
public enum Permissao {
    // CRUD básico
    CRIAR, LER, ATUALIZAR, DELETAR,

    // Administrativas
    GERENCIAR_USUARIOS, CONFIGURAR_SISTEMA, VISUALIZAR_RELATORIOS
}

public class Usuario {
    private String nome;
    private Set<Permissao> permissoes;

    public Usuario(String nome, Set<Permissao> permissoes) {
        this.nome = nome;
        this.permissoes = EnumSet.copyOf(permissoes);
    }

    public boolean pode(Permissao permissao) {
        return permissoes.contains(permissao);
    }

    public boolean podeMultiplas(Permissao... permissoesRequeridas) {
        return permissoes.containsAll(Arrays.asList(permissoesRequeridas));
    }
}

public class Perfil {
    private String nome;
    private Set<Permissao> permissoes;

    // Perfis pré-definidos
    public static final Perfil ADMIN = new Perfil("Admin",
        EnumSet.allOf(Permissao.class));

    public static final Perfil EDITOR = new Perfil("Editor",
        EnumSet.of(Permissao.CRIAR, Permissao.LER,
                   Permissao.ATUALIZAR, Permissao.VISUALIZAR_RELATORIOS));

    public static final Perfil LEITOR = new Perfil("Leitor",
        EnumSet.of(Permissao.LER));

    private Perfil(String nome, Set<Permissao> permissoes) {
        this.nome = nome;
        this.permissoes = EnumSet.copyOf(permissoes);
    }

    public Set<Permissao> getPermissoes() {
        return EnumSet.copyOf(permissoes);
    }
}

// Uso
Usuario admin = new Usuario("Alice", Perfil.ADMIN.getPermissoes());
if (admin.pode(Permissao.DELETAR)) {
    // Executar ação
}

Usuario editor = new Usuario("Bob", Perfil.EDITOR.getPermissoes());
if (editor.podeMultiplas(Permissao.LER, Permissao.ATUALIZAR)) {
    // Permitir edição
}
```

## 🎯 Padrão: Builder com Opções

```java
public enum OpcaoRelatorio {
    INCLUIR_GRAFICOS, INCLUIR_TABELAS, EXPORTAR_PDF,
    EXPORTAR_EXCEL, MODO_RESUMIDO, MODO_DETALHADO
}

public class Relatorio {
    private String titulo;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Set<OpcaoRelatorio> opcoes;

    private Relatorio(Builder builder) {
        this.titulo = builder.titulo;
        this.dataInicio = builder.dataInicio;
        this.dataFim = builder.dataFim;
        this.opcoes = builder.opcoes;
    }

    public boolean temOpcao(OpcaoRelatorio opcao) {
        return opcoes.contains(opcao);
    }

    public static class Builder {
        private String titulo;
        private LocalDate dataInicio;
        private LocalDate dataFim;
        private Set<OpcaoRelatorio> opcoes = EnumSet.noneOf(OpcaoRelatorio.class);

        public Builder titulo(String titulo) {
            this.titulo = titulo;
            return this;
        }

        public Builder periodo(LocalDate inicio, LocalDate fim) {
            this.dataInicio = inicio;
            this.dataFim = fim;
            return this;
        }

        public Builder comOpcao(OpcaoRelatorio opcao) {
            this.opcoes.add(opcao);
            return this;
        }

        public Builder comOpcoes(OpcaoRelatorio... opcoes) {
            this.opcoes.addAll(Arrays.asList(opcoes));
            return this;
        }

        public Relatorio build() {
            return new Relatorio(this);
        }
    }
}

// Uso
Relatorio relatorio = new Relatorio.Builder()
    .titulo("Vendas Q1 2024")
    .periodo(LocalDate.of(2024, 1, 1), LocalDate.of(2024, 3, 31))
    .comOpcoes(OpcaoRelatorio.INCLUIR_GRAFICOS,
               OpcaoRelatorio.EXPORTAR_PDF,
               OpcaoRelatorio.MODO_DETALHADO)
    .build();

if (relatorio.temOpcao(OpcaoRelatorio.INCLUIR_GRAFICOS)) {
    // Gerar gráficos
}
```

## 💡 Padrão: Configuração de Módulos

```java
public enum ModuloSistema {
    AUTENTICACAO, AUTORIZACAO, AUDITORIA, CACHE,
    NOTIFICACOES, RELATORIOS, API_REST
}

public class ConfiguracaoSistema {
    private Set<ModuloSistema> modulosAtivos;
    private Map<ModuloSistema, Properties> propriedadesModulos;

    public ConfiguracaoSistema() {
        this.modulosAtivos = EnumSet.noneOf(ModuloSistema.class);
        this.propriedadesModulos = new EnumMap<>(ModuloSistema.class);
    }

    public void ativarModulo(ModuloSistema modulo, Properties config) {
        modulosAtivos.add(modulo);
        propriedadesModulos.put(modulo, config);
    }

    public void desativarModulo(ModuloSistema modulo) {
        modulosAtivos.remove(modulo);
        propriedadesModulos.remove(modulo);
    }

    public boolean isModuloAtivo(ModuloSistema modulo) {
        return modulosAtivos.contains(modulo);
    }

    public Set<ModuloSistema> obterModulosAtivos() {
        return EnumSet.copyOf(modulosAtivos);
    }

    public void carregarPerfilMinimo() {
        modulosAtivos.clear();
        modulosAtivos.addAll(EnumSet.of(
            ModuloSistema.AUTENTICACAO,
            ModuloSistema.AUTORIZACAO
        ));
    }

    public void carregarPerfilCompleto() {
        modulosAtivos.addAll(EnumSet.allOf(ModuloSistema.class));
    }
}
```

## ⚡ Vantagens sobre Alternativas

### vs. Múltiplos Booleanos

```java
// ❌ Difícil de gerenciar
public class Config {
    private boolean opt1, opt2, opt3, opt4, opt5, opt6, opt7;

    // Construtor com 7 parâmetros booleanos - propenso a erros
    public Config(boolean o1, boolean o2, boolean o3, boolean o4,
                  boolean o5, boolean o6, boolean o7) { ... }
}

// ✅ Escalável e claro
public enum Opcao { OPT1, OPT2, OPT3, OPT4, OPT5, OPT6, OPT7 }

public class Config {
    private Set<Opcao> opcoes;

    public Config(Set<Opcao> opcoes) {
        this.opcoes = EnumSet.copyOf(opcoes);
    }
}
```

### vs. Bit Flags Inteiros

```java
// ❌ Sem type-safety
public static final int FLAG_A = 1;
public static final int FLAG_B = 2;
int flags = FLAG_A | FLAG_B;
flags = flags | 999;  // Aceita valor inválido!

// ✅ Type-safe
enum Flag { A, B }
Set<Flag> flags = EnumSet.of(Flag.A, Flag.B);
// flags.add(999);  // ERRO DE COMPILAÇÃO
```

## 🎯 Melhores Práticas

**1. Use EnumSet para conjuntos de flags**

```java
// ✅ Bom
Set<Opcao> opcoes = EnumSet.of(Opcao.LOG, Opcao.DEBUG);

// ❌ Evite HashSet para enums
Set<Opcao> opcoes = new HashSet<>(Arrays.asList(Opcao.LOG, Opcao.DEBUG));
```

**2. Use EnumMap para configurações por categoria**

```java
// ✅ Configurações por ambiente
Map<Ambiente, DatabaseConfig> configs = new EnumMap<>(Ambiente.class);
configs.put(Ambiente.PRODUCAO, prodConfig);
configs.put(Ambiente.DESENVOLVIMENTO, devConfig);
```

**3. Cópia defensiva em construtores**

```java
public Config(Set<Opcao> opcoes) {
    this.opcoes = EnumSet.copyOf(opcoes);  // Cópia, não referência
}
```

**4. Retorne cópias de coleções internas**

```java
public Set<Opcao> getOpcoes() {
    return EnumSet.copyOf(opcoes);  // Evita mutação externa
}
```

## 🔗 Interconexões

**Relação com Builder Pattern**: EnumSet ideal para opções em builders

**Relação com Strategy Pattern**: EnumMap para mapear estratégias por contexto

**Relação com Feature Flags**: EnumSet representa features ativas/inativas

**Relação com Permissions**: EnumSet centraliza permissões de usuários
