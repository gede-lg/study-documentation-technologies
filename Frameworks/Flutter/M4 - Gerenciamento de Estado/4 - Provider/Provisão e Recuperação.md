# Entendendo Dependências no Flutter: 

No Flutter, a gestão de dependências desempenha um papel essencial para manter a organização, reatividade e modularidade do código. É importante entender onde e como fornecer e recuperar dependências em widgets **Stateless** e **Stateful**. Aqui, discutiremos as boas práticas e padrões recomendados.

---

## 1. **Prover Dependências no Flutter**

O fornecimento de dependências geralmente é feito com o uso de pacotes como o **Provider**, **GetIt**, ou frameworks de gerenciamento de estado como **Riverpod**, **Bloc**, etc. A escolha do local onde prover depende das necessidades de escopo e reutilização.

### 1.1 **Prover em Widgets Stateless**

Em widgets **Stateless**, a dependência deve ser fornecida em widgets ancestrais no widget tree (árvore de widgets), especialmente se for algo usado em múltiplos lugares da aplicação. Um exemplo comum é usar um `Provider` no início da árvore.

#### Exemplo:

```dart
void main() {
  runApp(
    MultiProvider(
      providers: [
        Provider(create: (_) => MyDependency()),
      ],
      child: MyApp(),
    ),
  );
}

class MyStatelessWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final myDependency = Provider.of<MyDependency>(context);

    return Scaffold(
      body: Center(
        child: Text(myDependency.someValue),
      ),
    );
  }
}
```

> **Por quê?** Widgets Stateless não possuem estado interno e não são recriados dinamicamente como Stateful, então é melhor mantê-los "puros" e delegar a dependência a um ancestor na árvore.

---

### 1.2 **Prover em Widgets Stateful**

Embora não seja comum fornecer dependências diretamente em widgets **Stateful**, você pode fazer isso dentro do próprio estado se o widget em questão for um ponto único de entrada para a dependência. Entretanto, é recomendado manter a lógica de provisão fora do widget quando possível.

#### Exemplo:

```dart
class MyStatefulWidget extends StatefulWidget {
  @override
  _MyStatefulWidgetState createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  late MyDependency myDependency;

  @override
  void initState() {
    super.initState();
    myDependency = MyDependency();
  }

  @override
  void dispose() {
    myDependency.dispose(); // Libere recursos se necessário
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(myDependency.someValue),
      ),
    );
  }
}
```

> **Nota:** Apesar de possível, evitar essa abordagem em cenários complexos é importante para manter o código limpo e seguir o princípio de separação de responsabilidades.

---

## 2. **Recuperar Dependências no Flutter**

A recuperação de dependências envolve buscar as instâncias já fornecidas para uso em widgets. O local e a maneira de recuperar dependências dependem do tipo do widget e da abordagem usada.

---

### 2.1 **Recuperar em Widgets Stateless**

Em widgets **Stateless**, a recuperação é feita geralmente no método `build` por meio de um contexto. Isso mantém o código simples e o widget focado apenas em renderizar.

#### Exemplo com `Provider`:

```dart
class MyStatelessWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final controller = Provider.of<ScreenController>(context);

    return Scaffold(
      body: Center(
        child: Text(controller.data),
      ),
    );
  }
}
```

> **Dica:** Prefira usar widgets Stateless sempre que possível, pois eles são mais previsíveis e menos propensos a bugs relacionados ao estado.

---

### 2.2 **Recuperar em Widgets Stateful**

Para widgets **Stateful**, a recuperação geralmente é feita no `initState` para evitar recuperar dependências repetidamente no `build`.

#### Exemplo com `Provider`:

```dart
class MyStatefulWidget extends StatefulWidget {
  @override
  _MyStatefulWidgetState createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  late ScreenController controller;

  @override
  void initState() {
    super.initState();
    controller = Provider.of<ScreenController>(context, listen: false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(controller.data),
      ),
    );
  }
}
```

#### Por que usar `listen: false`?

- Ao buscar dependências em `initState`, deve-se usar `listen: false`, pois o contexto ainda não está totalmente inicializado para responder a mudanças.

---

## 3. **Boas Práticas**

- **Evite Provisão Local Excessiva:** Prefira injetar dependências no topo da árvore para reduzir a duplicação e facilitar a reutilização.
- **Minimize Recuperações Repetitivas:** Para widgets Stateful, recupere uma dependência uma única vez em `initState` quando ela não depender de reconstruções frequentes.
- **Separe Provisão e Lógica:** Use classes ou serviços dedicados para lógica, deixando os widgets focados em renderizar a UI.

---

Seguindo essas práticas, você conseguirá organizar melhor sua aplicação Flutter, facilitando a manutenção e escalabilidade.