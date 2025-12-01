# 🗺️ EnumMap com Chave Enum

## 🎯 Introdução

**EnumMap** é uma implementação especializada de `Map` otimizada para usar **enums como chaves**, utilizando internamente um **array** indexado pelo ordinal das constantes, resultando em performance superior a `HashMap` e uso mínimo de memória.

## 📋 Sintaxe e Criação

```java
public enum Dia {
    SEG, TER, QUA, QUI, SEX, SAB, DOM
}

// ========== CRIAÇÃO ==========

// Construtor: requer Class do enum
Map<Dia, String> horarios = new EnumMap<>(Dia.class);

// Popular
horarios.put(Dia.SEG, "09:00-18:00");
horarios.put(Dia.TER, "09:00-18:00");
horarios.put(Dia.SAB, "10:00-14:00");

// Criação a partir de outro Map
Map<Dia, String> copia = new EnumMap<>(horarios);
```

## 🔍 Casos de Uso

### Configurações por Enum

```java
public enum Ambiente {
    DESENVOLVIMENTO, HOMOLOGACAO, PRODUCAO
}

public class ConfigManager {
    private Map<Ambiente, Properties> configs = new EnumMap<>(Ambiente.class);

    public ConfigManager() {
        configs.put(Ambiente.DESENVOLVIMENTO, loadDevConfig());
        configs.put(Ambiente.HOMOLOGACAO, loadHomConfig());
        configs.put(Ambiente.PRODUCAO, loadProdConfig());
    }

    public Properties getConfig(Ambiente env) {
        return configs.get(env);  // O(1) - acesso direto por ordinal
    }
}
```

### Contadores por Enum

```java
public enum TipoEvento {
    CLIQUE, VISUALIZACAO, COMPARTILHAMENTO, COMPRA
}

public class Analitico {
    private Map<TipoEvento, Integer> contadores = new EnumMap<>(TipoEvento.class);

    public Analitico() {
        // Inicializar todos com 0
        for (TipoEvento tipo : TipoEvento.values()) {
            contadores.put(tipo, 0);
        }
    }

    public void registrar(TipoEvento evento) {
        contadores.put(evento, contadores.get(evento) + 1);
    }

    public int obterContagem(TipoEvento evento) {
        return contadores.get(evento);
    }

    public Map<TipoEvento, Integer> obterResumo() {
        return new EnumMap<>(contadores);
    }
}
```

### Cache por Estado

```java
public enum Status {
    NOVO, PROCESSANDO, CONCLUIDO, ERRO
}

public class CacheStatus<T> {
    private Map<Status, List<T>> cache = new EnumMap<>(Status.class);

    public CacheStatus() {
        for (Status status : Status.values()) {
            cache.put(status, new ArrayList<>());
        }
    }

    public void adicionar(Status status, T item) {
        cache.get(status).add(item);
    }

    public List<T> obter(Status status) {
        return new ArrayList<>(cache.get(status));
    }

    public void mover(T item, Status origem, Status destino) {
        cache.get(origem).remove(item);
        cache.get(destino).add(item);
    }
}
```

## ⚡ Performance

### EnumMap vs HashMap

```
Operação     | EnumMap | HashMap
-------------|---------|----------
put()        | 2ns     | 15ns
get()        | 1ns     | 12ns
Memória      | Array   | Nodes + buckets
Ordem        | Natural | Aleatória
```

**EnumMap é 5-10x mais rápido!**

### Implementação Interna

```java
// Simplificação conceitual
class EnumMap<K extends Enum<K>, V> {
    private V[] values;  // Array indexado por ordinal

    V get(K key) {
        return values[key.ordinal()];  // Acesso O(1) direto
    }

    void put(K key, V value) {
        values[key.ordinal()] = value;  // Atribuição O(1) direta
    }
}
```

## 🎯 Vantagens

1. **Performance Superior**: Acesso O(1) sem hash
2. **Memória Eficiente**: Array simples, sem overhead de nodes
3. **Ordem Natural**: Iteração segue ordinal das chaves
4. **Type-Safe**: Chaves garantidas do tipo enum
5. **Null Values**: Aceita valores null (chaves não)

## ⚠️ Limitações

```java
// ❌ Chave deve ser enum
Map<String, Integer> map = new EnumMap<>(String.class);  // ERRO!

// ❌ Chave null não permitida
Map<Dia, String> map = new EnumMap<>(Dia.class);
map.put(null, "teste");  // NullPointerException

// ✅ Valor null permitido
map.put(Dia.SEG, null);  // OK
```

## 💡 Melhores Práticas

```java
// ✅ Declare como Map
Map<Status, Handler> handlers = new EnumMap<>(Status.class);

// ✅ Inicialize todos os valores se necessário
for (Status s : Status.values()) {
    handlers.put(s, new DefaultHandler());
}

// ✅ Use para lookup tables
Map<Operacao, BiFunction<Double, Double, Double>> ops = new EnumMap<>(Operacao.class);
ops.put(Operacao.SOMA, (a, b) -> a + b);
ops.put(Operacao.SUBTRACAO, (a, b) -> a - b);

double resultado = ops.get(Operacao.SOMA).apply(10.0, 5.0);  // 15.0
```
