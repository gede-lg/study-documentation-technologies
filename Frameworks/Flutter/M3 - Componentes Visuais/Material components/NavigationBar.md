
## Introdução

No desenvolvimento de aplicativos móveis com Flutter, a navegação entre diferentes telas é uma parte essencial para proporcionar uma experiência de usuário fluida e intuitiva. A `NavigationBar` é um dos widgets fundamentais para implementar essa navegação, permitindo que os usuários alternem facilmente entre diferentes seções do aplicativo. Este guia detalhado abordará todos os aspectos da `NavigationBar` no Flutter, desde sua definição até suas propriedades, métodos e melhores práticas de uso.

## Sumário

1. [O que é e para que serve?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#o-que-%C3%A9-e-para-que-serve)
2. [Como funciona?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#como-funciona)
3. [Sintaxe de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#sintaxe-de-uso)
    - [Parâmetros](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#par%C3%A2metros)
4. [Restrições de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#restri%C3%A7%C3%B5es-de-uso)
5. [Quando utilizar?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#quando-utilizar)
6. [Tabela de Propriedades](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#tabela-de-propriedades)
7. [Tabela de Métodos](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#tabela-de-m%C3%A9todos)
8. [Categorias de Widget](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#categorias-de-widget)
9. [Exemplos de Código](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#exemplos-de-c%C3%B3digo)
10. [Considerações Finais](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#considera%C3%A7%C3%B5es-finais)

## O que é e para que serve?

A `NavigationBar` no Flutter é um widget que fornece uma barra de navegação inferior, permitindo que os usuários alternem entre diferentes seções principais de um aplicativo. Ela é uma evolução do tradicional `BottomNavigationBar`, incorporando as diretrizes de design do Material Design 3 (Material You), oferecendo uma aparência mais moderna e personalizável.

**Finalidades principais:**

- **Navegação Intuitiva:** Facilita a transição entre as seções principais do aplicativo.
- **Visibilidade Permanente:** Permite que os usuários acessem facilmente as principais funcionalidades a qualquer momento.
- **Personalização:** Suporta diferentes estilos e temas para se adequar à identidade visual do aplicativo.

## Como funciona?

A `NavigationBar` funciona como um contêiner para múltiplos itens de navegação, geralmente posicionados na parte inferior da tela. Cada item representa uma seção do aplicativo e pode incluir ícones e rótulos. Quando um item é selecionado, a `NavigationBar` notifica o aplicativo sobre a mudança, permitindo que o conteúdo da tela seja atualizado de acordo.

**Componentes principais:**

- **Items:** Representam as diferentes seções ou telas do aplicativo.
- **Seleção:** Indica qual item está atualmente ativo.
- **Interação:** Detecta toques nos itens para alterar a seleção e navegar para a seção correspondente.

## Sintaxe de uso

A `NavigationBar` pode ser utilizada dentro da estrutura do aplicativo Flutter, geralmente como parte do scaffold principal. A seguir, apresentamos a sintaxe básica de uso, seguida de uma descrição detalhada de seus parâmetros.

```dart
NavigationBar(
  selectedIndex: 0,
  onDestinationSelected: (int index) {
    // Lógica para lidar com a seleção
  },
  destinations: const <NavigationDestination>[
    NavigationDestination(
      icon: Icon(Icons.home_outlined),
      selectedIcon: Icon(Icons.home),
      label: 'Início',
    ),
    NavigationDestination(
      icon: Icon(Icons.search_outlined),
      selectedIcon: Icon(Icons.search),
      label: 'Buscar',
    ),
    NavigationDestination(
      icon: Icon(Icons.person_outline),
      selectedIcon: Icon(Icons.person),
      label: 'Perfil',
    ),
  ],
)
```

### Parâmetros

A seguir, detalhamos todos os parâmetros disponíveis na `NavigationBar`, especificando quais são obrigatórios e quais são opcionais, além de seus tipos e descrições.

|Parâmetro|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|`selectedIndex`|`int`|Sim|Índice do item atualmente selecionado na barra de navegação.|
|`onDestinationSelected`|`ValueChanged<int>`|Sim|Callback acionado quando um item é selecionado. Recebe o índice do item selecionado.|
|`destinations`|`List<NavigationDestination>`|Sim|Lista de itens de navegação que serão exibidos na barra. Cada item é representado por um `NavigationDestination`.|
|`height`|`double`|Não|Altura da barra de navegação. Se não for especificado, o valor padrão será utilizado.|
|`backgroundColor`|`Color`|Não|Cor de fundo da barra de navegação. Pode ser personalizada para se adequar ao tema do aplicativo.|
|`elevation`|`double`|Não|Sombreamento aplicado à barra de navegação.|
|`surfaceTintColor`|`Color`|Não|Cor de destaque superficial para elementos da barra, seguindo as diretrizes do Material Design 3.|
|`animationDuration`|`Duration`|Não|Duração das animações de transição ao selecionar diferentes itens.|
|`indicatorColor`|`Color`|Não|Cor do indicador que destaca o item selecionado.|
|`indicatorShape`|`ShapeBorder`|Não|Forma do indicador de seleção. Pode ser personalizado para ter diferentes bordas ou formatos.|
|`labelBehavior`|`NavigationDestinationLabelBehavior`|Não|Comportamento dos rótulos dos itens de navegação. Controla a visibilidade e estilo dos textos.|
|`iconTheme`|`IconThemeData`|Não|Tema dos ícones dentro da barra de navegação, permitindo personalização como cor, tamanho e forma.|
|`labelTextStyle`|`MaterialStateProperty<TextStyle?>`|Não|Estilo dos textos dos rótulos dos itens de navegação, permitindo personalização baseada no estado (selecionado ou não).|
|`indicatorShape`|`ShapeBorder`|Não|Define a forma do indicador de seleção para itens. Pode ser uma forma personalizada como `RoundedRectangleBorder`, `CircleBorder`, etc.|
|`animationDuration`|`Duration`|Não|Define a duração da animação que ocorre quando a seleção de itens muda.|

## Restrições de uso

Embora a `NavigationBar` seja um widget poderoso e flexível, existem algumas restrições e considerações que devem ser levadas em conta ao utilizá-la:

- **Quantidade de Itens:** É recomendado utilizar entre 3 e 5 itens de navegação. Exceder esse número pode tornar a barra confusa e difícil de usar.
- **Conteúdo dos Itens:** Cada `NavigationDestination` deve ter um ícone e, opcionalmente, um rótulo. Evite sobrecarregar os itens com muitos detalhes.
- **Estado Selecionado:** Apenas um item deve estar selecionado por vez para evitar ambiguidade na navegação.
- **Responsividade:** Certifique-se de que a barra de navegação se adapte bem a diferentes tamanhos de tela e orientações.
- **Compatibilidade com Tema:** Garanta que as cores e estilos da barra estejam em harmonia com o tema geral do aplicativo para manter a consistência visual.
- **Desempenho:** Evite lógica pesada dentro do callback `onDestinationSelected` para não comprometer a responsividade do aplicativo.

## Quando utilizar?

A `NavigationBar` é ideal para aplicativos que possuem múltiplas seções principais e necessitam de uma forma clara e acessível para os usuários navegarem entre elas. Alguns cenários comuns incluem:

- **Aplicativos de Redes Sociais:** Para alternar entre feed, mensagens, notificações e perfil.
- **Aplicativos de E-commerce:** Para acessar categorias, carrinho, favoritos e perfil do usuário.
- **Aplicativos de Produtividade:** Para gerenciar tarefas, calendários, notas e configurações.
- **Aplicativos de Conteúdo:** Para navegar entre diferentes tipos de mídia, como vídeos, artigos, galerias e configurações.

**Benefícios de utilizar a `NavigationBar`:**

- **Acessibilidade:** Facilita a navegação para todos os tipos de usuários, incluindo aqueles com necessidades especiais.
- **Consistência:** Proporciona uma experiência de navegação padronizada e previsível.
- **Eficiência:** Reduz o número de toques necessários para acessar diferentes seções do aplicativo.

## Tabela de Propriedades

A tabela a seguir apresenta todas as propriedades da `NavigationBar`, detalhando sua descrição e sintaxe de uso.

|Propriedade|Descrição|Sintaxe de Uso|
|---|---|---|
|`selectedIndex`|Índice do item atualmente selecionado na barra de navegação.|`selectedIndex: 0`|
|`onDestinationSelected`|Callback acionado quando um item é selecionado. Recebe o índice do item selecionado.|`onDestinationSelected: (int index) { /* lógica */ }`|
|`destinations`|Lista de itens de navegação exibidos na barra. Cada item é um `NavigationDestination`.|`destinations: const <NavigationDestination>[/* itens */]`|
|`height`|Altura da barra de navegação.|`height: 60.0`|
|`backgroundColor`|Cor de fundo da barra de navegação.|`backgroundColor: Colors.white`|
|`elevation`|Sombreamento aplicado à barra de navegação.|`elevation: 8.0`|
|`surfaceTintColor`|Cor de destaque superficial para elementos da barra, seguindo o Material Design 3.|`surfaceTintColor: Colors.blue`|
|`animationDuration`|Duração das animações de transição ao selecionar diferentes itens.|`animationDuration: Duration(milliseconds: 300)`|
|`indicatorColor`|Cor do indicador que destaca o item selecionado.|`indicatorColor: Colors.blueAccent`|
|`indicatorShape`|Forma do indicador de seleção.|`indicatorShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))`|
|`labelBehavior`|Comportamento dos rótulos dos itens de navegação. Controla visibilidade e estilo dos textos.|`labelBehavior: NavigationDestinationLabelBehavior.alwaysShow`|
|`iconTheme`|Tema dos ícones dentro da barra de navegação, permitindo personalização.|`iconTheme: IconThemeData(color: Colors.grey, size: 24)`|
|`labelTextStyle`|Estilo dos textos dos rótulos dos itens de navegação, baseado no estado.|`labelTextStyle: MaterialStateProperty.all(TextStyle(fontSize: 12))`|

## Tabela de Métodos

A `NavigationBar` é um widget, portanto, não possui métodos específicos. No entanto, os métodos relacionados ao widget geralmente se referem à construção e gerenciamento do estado. Abaixo, listamos os métodos comuns utilizados em conjunto com a `NavigationBar`:

|Método|Descrição|Sintaxe de Uso|
|---|---|---|
|`build`|Constrói a representação visual do widget.|`@override Widget build(BuildContext context)`|
|`setState`|Atualiza o estado do widget e refaz a interface quando necessário.|`setState(() { selectedIndex = newIndex; })`|
|`didChangeDependencies`|Chamado quando as dependências do widget mudam.|`@override void didChangeDependencies()`|
|`initState`|Inicializa o estado do widget antes da construção.|`@override void initState()`|
|`dispose`|Limpa os recursos quando o widget é removido da árvore de widgets.|`@override void dispose()`|

**Observação:** Embora a `NavigationBar` não tenha métodos próprios, ela interage com métodos do ciclo de vida do widget para gerenciar seu estado e comportamento.

## Categorias de Widget

A `NavigationBar` se encaixa em várias categorias de widgets dentro do ecossistema Flutter. A seguir, listamos as categorias mais relevantes:

|Categoria|Descrição|
|---|---|
|**Material Components**|A `NavigationBar` é parte dos componentes de Material Design, seguindo as diretrizes visuais e interativas.|
|**Layout**|Atua como um componente de layout, posicionando-se geralmente na parte inferior da tela para organizar a navegação.|
|**Interaction Models**|Gerencia a interação do usuário com os itens de navegação, respondendo a toques e mudanças de seleção.|
|**Styling**|Permite personalização de estilos, cores e temas para se adequar à identidade visual do aplicativo.|
|**Accessibility**|Facilita a navegação acessível para todos os usuários, incluindo suporte a leitores de tela e toques.|
|**Animation & Motion**|Incorpora animações suaves ao mudar de itens selecionados, melhorando a experiência do usuário.|

## Exemplos de Código

A seguir, apresentamos exemplos de código que ilustram o uso da `NavigationBar` em diferentes cenários, incluindo personalização e gerenciamento de estado.

### Exemplo Básico de `NavigationBar`

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Exemplo NavigationBar',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
        ),
        home: HomePage());
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  static const List<Widget> _widgetOptions = <Widget>[
    Center(child: Text('Página Início', style: TextStyle(fontSize: 24))),
    Center(child: Text('Página Buscar', style: TextStyle(fontSize: 24))),
    Center(child: Text('Página Perfil', style: TextStyle(fontSize: 24))),
  ];

  void _onItemSelected(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Exemplo NavigationBar'),
      ),
      body: _widgetOptions.elementAt(_selectedIndex),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: _onItemSelected,
        destinations: const <NavigationDestination>[
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Início',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search),
            label: 'Buscar',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}
```

### Exemplo de `NavigationBar` Personalizada

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyCustomNavBarApp());
}

class MyCustomNavBarApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Custom NavigationBar',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: CustomNavBarHomePage(),
    );
  }
}

class CustomNavBarHomePage extends StatefulWidget {
  @override
  _CustomNavBarHomePageState createState() => _CustomNavBarHomePageState();
}

class _CustomNavBarHomePageState extends State<CustomNavBarHomePage> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    HomeScreen(),
    SearchScreen(),
    ProfileScreen(),
    SettingsScreen(),
  ];

  void _onNavBarTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Custom NavigationBar'),
      ),
      body: _pages[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _onNavBarTapped,
        backgroundColor: Colors.deepPurple.shade50,
        elevation: 10,
        indicatorColor: Colors.deepPurple,
        destinations: const <NavigationDestination>[
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Início',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search),
            label: 'Buscar',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Perfil',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Configurações',
          ),
        ],
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Página Início', style: TextStyle(fontSize: 24)));
  }
}

class SearchScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Página Buscar', style: TextStyle(fontSize: 24)));
  }
}

class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Página Perfil', style: TextStyle(fontSize: 24)));
  }
}

class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Página Configurações', style: TextStyle(fontSize: 24)));
  }
}
```

### Exemplo com `labelBehavior` e `TextStyle` Personalizados

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(LabelBehaviorApp());
}

class LabelBehaviorApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NavigationBar com labelBehavior',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        useMaterial3: true,
      ),
      home: LabelBehaviorHomePage(),
    );
  }
}

class LabelBehaviorHomePage extends StatefulWidget {
  @override
  _LabelBehaviorHomePageState createState() => _LabelBehaviorHomePageState();
}

class _LabelBehaviorHomePageState extends State<LabelBehaviorHomePage> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    Center(child: Text('Início', style: TextStyle(fontSize: 24))),
    Center(child: Text('Buscar', style: TextStyle(fontSize: 24))),
    Center(child: Text('Perfil', style: TextStyle(fontSize: 24))),
  ];

  void _onNavBarSelected(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final MaterialStateProperty<TextStyle?> labelStyle = MaterialStateProperty.resolveWith<TextStyle?>(
    (Set<MaterialState> states) {
      if (states.contains(MaterialState.selected)) {
        return TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.teal);
      }
      return TextStyle(fontSize: 12, color: Colors.grey);
    },
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('NavigationBar com labelBehavior'),
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: _onNavBarSelected,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        labelTextStyle: labelStyle,
        destinations: const <NavigationDestination>[
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Início',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search),
            label: 'Buscar',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}
```

## Considerações Finais

A `NavigationBar` no Flutter é uma ferramenta poderosa para gerenciar a navegação entre diferentes seções de um aplicativo, proporcionando uma experiência de usuário intuitiva e consistente. Ao entender suas propriedades, métodos e melhores práticas de uso, você pode criar interfaces eficientes e visualmente agradáveis que atendam às necessidades dos usuários.

**Boas Práticas:**

- **Limite de Itens:** Mantenha o número de itens de navegação entre 3 e 5 para evitar sobrecarregar a barra.
- **Consistência Visual:** Assegure que os ícones e rótulos sejam claros e representativos das seções que representam.
- **Feedback Visual:** Utilize indicadores e animações para fornecer feedback imediato ao usuário sobre suas ações.
- **Acessibilidade:** Garanta que a `NavigationBar` seja acessível, suportando leitores de tela e tamanhos de fonte ajustáveis.

**Ferramentas e Recursos Adicionais:**

- **Flutter DevTools:** Utilize para depurar e otimizar a performance da `NavigationBar`.
- **Documentação Oficial:** [Flutter NavigationBar](https://api.flutter.dev/flutter/material/NavigationBar-class.html)
- **Pacotes Complementares:** Explore pacotes como `flutter_svg` para utilizar ícones vetoriais personalizados.

**Conclusão:**

Implementar uma `NavigationBar` eficaz é crucial para a usabilidade e navegação de qualquer aplicativo Flutter. Ao seguir as diretrizes apresentadas neste guia, você estará bem equipado para criar barras de navegação que não apenas atendem às expectativas dos usuários, mas também melhoram significativamente a experiência geral do aplicativo.