
## Introdução

No desenvolvimento de aplicativos móveis com Flutter, a interface do usuário (UI) desempenha um papel crucial na experiência do usuário. Um dos componentes de UI populares para interações contextuais é o **BottomSheet**. Este widget permite exibir conteúdo de forma elegante a partir da parte inferior da tela, proporcionando uma maneira eficiente de apresentar informações adicionais, menus ou ações sem sobrecarregar a interface principal.

## Sumário

1. [O que é e para que serve?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#o-que-%C3%A9-e-para-que-serve)
2. [Como funciona?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#como-funciona)
3. [Sintaxe de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#sintaxe-de-uso)
    - [showModalBottomSheet](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#showmodalbottomsheet)
    - [BottomSheet Widget](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#bottomsheet-widget)
4. [Restrições de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#restri%C3%A7%C3%B5es-de-uso)
5. [Quando utilizar?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#quando-utilizar)
6. [Tabela de Propriedades](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#tabela-de-propriedades)
7. [Tabela de Métodos](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#tabela-de-m%C3%A9todos)
8. [Categoria de Widget](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#categoria-de-widget)
9. [Exemplos de Código](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#exemplos-de-c%C3%B3digo)
10. [Considerações Finais](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#considera%C3%A7%C3%B5es-finais)
11. [Referências](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#refer%C3%AAncias)

## O que é e para que serve?

**BottomSheet** é um componente de UI fornecido pelo Flutter que exibe uma seção deslizante a partir da parte inferior da tela. Ele é utilizado para apresentar informações adicionais, opções de navegação, menus ou ações contextuais sem interromper a experiência principal do usuário.

### Tipos de BottomSheet

1. **Modal BottomSheet**: Impede a interação com o restante da interface até que seja fechado. Geralmente utilizado para exibir opções ou formulários que requerem atenção imediata.
2. **Persistent BottomSheet**: Permanece visível mesmo quando o usuário interage com outras partes da aplicação. Ideal para informações que precisam estar sempre acessíveis, como controles de mídia ou ferramentas de navegação.

## Como funciona?

O **BottomSheet** funciona através de animações que deslizam o conteúdo para dentro e para fora da tela. No Flutter, existem duas abordagens principais para implementar um BottomSheet:

1. **showModalBottomSheet**: Função que exibe um Modal BottomSheet. Ele bloqueia a interação com o restante da interface até ser fechado.
2. **BottomSheet Widget**: Widget que permite criar um Persistent BottomSheet, que pode ser manipulado de forma mais detalhada.

### Ciclo de Vida

- **Exibição**: Quando acionado, o BottomSheet desliza para a tela com uma animação suave.
- **Interação**: O usuário pode interagir com os elementos dentro do BottomSheet.
- **Fechamento**: O BottomSheet pode ser fechado deslizando para baixo ou através de uma ação programática.

## Sintaxe de uso

### `showModalBottomSheet`

A função `showModalBottomSheet` é utilizada para exibir um Modal BottomSheet.

#### Sintaxe

```dart
Future<T?> showModalBottomSheet<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  Color? backgroundColor,
  double? elevation,
  ShapeBorder? shape,
  Clip? clipBehavior,
  bool isScrollControlled = false,
  bool useRootNavigator = false,
  bool isDismissible = true,
  bool enableDrag = true,
  RouteSettings? routeSettings,
});
```

#### Descrição dos Parâmetros

- **`context`** (`BuildContext`): Contexto atual da árvore de widgets. **Obrigatório**.
- **`builder`** (`WidgetBuilder`): Função que retorna o widget a ser exibido dentro do BottomSheet. **Obrigatório**.
- **`backgroundColor`** (`Color?`): Cor de fundo do BottomSheet. **Opcional**.
- **`elevation`** (`double?`): Elevação da sombra do BottomSheet. **Opcional**.
- **`shape`** (`ShapeBorder?`): Forma do BottomSheet, permitindo bordas arredondadas, por exemplo. **Opcional**.
- **`clipBehavior`** (`Clip?`): Define como o conteúdo é cortado quando ultrapassa os limites do BottomSheet. **Opcional**.
- **`isScrollControlled`** (`bool`): Permite que o BottomSheet ocupe a tela inteira se necessário. **Opcional**. Padrão: `false`.
- **`useRootNavigator`** (`bool`): Define se o BottomSheet deve ser inserido no Root Navigator. **Opcional**. Padrão: `false`.
- **`isDismissible`** (`bool`): Permite que o BottomSheet seja fechado ao tocar fora dele. **Opcional**. Padrão: `true`.
- **`enableDrag`** (`bool`): Permite que o BottomSheet seja fechado arrastando para baixo. **Opcional**. Padrão: `true`.
- **`routeSettings`** (`RouteSettings?`): Configurações da rota para o BottomSheet. **Opcional**.

### `BottomSheet` Widget

O widget `BottomSheet` permite criar Persistent BottomSheets, oferecendo mais controle sobre o comportamento e o estado do BottomSheet.

#### Sintaxe

```dart
BottomSheet({
  Key? key,
  required this.builder,
  this.onClosing,
  this.enableDrag = true,
  this.backgroundColor,
  this.elevation,
  this.shape,
  this.clipBehavior = Clip.none,
  this.transitionAnimationController,
});
```

#### Descrição dos Parâmetros

- **`key`** (`Key?`): Identificador único para o widget. **Opcional**.
- **`builder`** (`WidgetBuilder`): Função que retorna o conteúdo do BottomSheet. **Obrigatório**.
- **`onClosing`** (`VoidCallback?`): Callback chamado quando o BottomSheet está prestes a ser fechado. **Opcional**.
- **`enableDrag`** (`bool`): Permite que o BottomSheet seja fechado arrastando. **Opcional**. Padrão: `true`.
- **`backgroundColor`** (`Color?`): Cor de fundo do BottomSheet. **Opcional**.
- **`elevation`** (`double?`): Elevação da sombra do BottomSheet. **Opcional**.
- **`shape`** (`ShapeBorder?`): Forma do BottomSheet. **Opcional**.
- **`clipBehavior`** (`Clip`): Define como o conteúdo é cortado. **Opcional**. Padrão: `Clip.none`.
- **`transitionAnimationController`** (`AnimationController?`): Controlador de animação para transições personalizadas. **Opcional**.

## Restrições de uso

- **Contexto de Navegação**: O `showModalBottomSheet` deve ser chamado dentro de um contexto que possua um `Navigator`.
- **Animações e Performance**: Evite sobrecarregar o BottomSheet com widgets complexos que possam afetar a performance.
- **Tamanho e Espaço**: Gerencie o tamanho do conteúdo para que o BottomSheet não ocupe toda a tela, a menos que `isScrollControlled` seja `true`.
- **Compatibilidade com Orientação**: Considere diferentes orientações de tela (portrait e landscape) para garantir que o BottomSheet se comporte adequadamente.

## Quando utilizar?

O **BottomSheet** é ideal para situações onde você deseja fornecer ao usuário ações ou informações adicionais sem navegar para uma nova página. Alguns casos de uso comuns incluem:

- **Menus de Opções**: Apresentar uma lista de ações relacionadas a um item selecionado.
- **Formulários Rápidos**: Coletar informações do usuário sem sair da tela atual.
- **Detalhes Adicionais**: Mostrar informações suplementares sobre um item sem ocupar espaço na interface principal.
- **Confirmações**: Solicitar confirmações ou feedback do usuário antes de executar uma ação.

## Tabela de Propriedades

### Propriedades do `BottomSheet` Widget

|**Propriedade**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|`key`|Identificador único para o widget.|`Key? key`|
|`builder`|Função que retorna o conteúdo do BottomSheet.|`WidgetBuilder builder`|
|`onClosing`|Callback chamado quando o BottomSheet está prestes a ser fechado.|`VoidCallback? onClosing`|
|`enableDrag`|Permite que o BottomSheet seja fechado arrastando.|`bool enableDrag`|
|`backgroundColor`|Cor de fundo do BottomSheet.|`Color? backgroundColor`|
|`elevation`|Elevação da sombra do BottomSheet.|`double? elevation`|
|`shape`|Forma do BottomSheet, permitindo bordas personalizadas.|`ShapeBorder? shape`|
|`clipBehavior`|Define como o conteúdo é cortado quando ultrapassa os limites do BottomSheet.|`Clip clipBehavior`|
|`transitionAnimationController`|Controlador de animação para transições personalizadas do BottomSheet.|`AnimationController? transitionAnimationController`|

### Propriedades da Função `showModalBottomSheet`

|**Propriedade**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|`context`|Contexto atual da árvore de widgets.|`BuildContext context`|
|`builder`|Função que retorna o widget a ser exibido dentro do BottomSheet.|`WidgetBuilder builder`|
|`backgroundColor`|Cor de fundo do BottomSheet.|`Color? backgroundColor`|
|`elevation`|Elevação da sombra do BottomSheet.|`double? elevation`|
|`shape`|Forma do BottomSheet, permitindo bordas personalizadas.|`ShapeBorder? shape`|
|`clipBehavior`|Define como o conteúdo é cortado quando ultrapassa os limites do BottomSheet.|`Clip? clipBehavior`|
|`isScrollControlled`|Permite que o BottomSheet ocupe a tela inteira se necessário.|`bool isScrollControlled`|
|`useRootNavigator`|Define se o BottomSheet deve ser inserido no Root Navigator.|`bool useRootNavigator`|
|`isDismissible`|Permite que o BottomSheet seja fechado ao tocar fora dele.|`bool isDismissible`|
|`enableDrag`|Permite que o BottomSheet seja fechado arrastando para baixo.|`bool enableDrag`|
|`routeSettings`|Configurações da rota para o BottomSheet.|`RouteSettings? routeSettings`|

## Tabela de Métodos

### Métodos do `showModalBottomSheet`

|**Método**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|`showModalBottomSheet`|Exibe um Modal BottomSheet na tela.|`showModalBottomSheet<T>(...)`|

### Métodos do `BottomSheet` Widget

|**Método**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|`createState`|Cria o estado mutável para este widget.|`@override createState() => _BottomSheetState();`|
|`build`|Desenha o widget na tela com base no estado atual.|`@override Widget build(BuildContext context)`|

### Métodos Adicionais

Embora o `BottomSheet` widget em si não possua muitos métodos públicos, as funções auxiliares e os controladores podem ter métodos relevantes:

|**Método**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|`Navigator.pop`|Fecha o BottomSheet atual e retorna um valor opcional.|`Navigator.pop(context, result);`|
|`ScaffoldState.showBottomSheet`|Exibe um Persistent BottomSheet usando o estado do Scaffold.|`Scaffold.of(context).showBottomSheet(...)`|

## Categoria de Widget

O **BottomSheet** no Flutter se encaixa principalmente nas seguintes categorias:

- **Material Components**: Faz parte dos componentes de design Material do Flutter.
- **Animation & Motion**: Utiliza animações para exibição e ocultação.
- **Interaction Models**: Facilita interações contextuais com o usuário.
- **Layout**: Gerencia a disposição de conteúdo dentro do BottomSheet.
- **Styling**: Permite personalização de cores, formas e estilos visuais.

## Exemplos de Código

### Exemplo 1: Exibindo um Modal BottomSheet Simples

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Exemplo de BottomSheet',
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  void _mostrarBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          padding: EdgeInsets.all(16.0),
          height: 200,
          child: Column(
            children: [
              Text(
                'Este é um Modal BottomSheet',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                child: Text('Fechar'),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Exemplo de BottomSheet'),
        ),
        body: Center(
          child: ElevatedButton(
            child: Text('Mostrar BottomSheet'),
            onPressed: () => _mostrarBottomSheet(context),
          ),
        ));
  }
}
```

### Exemplo 2: Criando um Persistent BottomSheet

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Exemplo de BottomSheet Persistente',
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  PersistentBottomSheetController? _controller;

  void _mostrarPersistentBottomSheet() {
    if (_controller == null) {
      _controller = Scaffold.of(context).showBottomSheet(
        (context) {
          return Container(
            color: Colors.blueGrey,
            height: 200,
            child: Center(
              child: Text(
                'Este é um Persistent BottomSheet',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
            ),
          );
        },
        backgroundColor: Colors.blueGrey,
      );

      _controller!.closed.then((value) {
        _controller = null;
      });
    }
  }

  void _fecharPersistentBottomSheet() {
    if (_controller != null) {
      _controller!.close();
      _controller = null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Exemplo de BottomSheet Persistente'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                onPressed: _mostrarPersistentBottomSheet,
                child: Text('Mostrar Persistent BottomSheet'),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _fecharPersistentBottomSheet,
                child: Text('Fechar Persistent BottomSheet'),
              ),
            ],
          ),
        ));
  }
}
```

### Exemplo 3: Customizando o Modal BottomSheet

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Exemplo Customizado de BottomSheet',
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  void _mostrarCustomBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true, // Permite que o BottomSheet ocupe a tela inteira
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (BuildContext context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.5,
          minChildSize: 0.3,
          maxChildSize: 0.9,
          builder: (BuildContext context, ScrollController scrollController) {
            return Container(
              padding: EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.vertical(top: Radius.circular(25.0)),
              ),
              child: ListView(
                controller: scrollController,
                children: [
                  Center(
                    child: Container(
                      width: 50,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  SizedBox(height: 20),
                  Text(
                    'BottomSheet Customizado',
                    style:
                        TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 20),
                  Text(
                    'Este BottomSheet possui bordas arredondadas e é redimensionável.',
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 20),
                  ElevatedButton(
                    child: Text('Fechar'),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Exemplo Customizado de BottomSheet'),
        ),
        body: Center(
          child: ElevatedButton(
            child: Text('Mostrar BottomSheet Customizado'),
            onPressed: () => _mostrarCustomBottomSheet(context),
          ),
        ));
  }
}
```

## Considerações Finais

O **BottomSheet** é uma ferramenta poderosa no Flutter para criar interfaces de usuário interativas e dinâmicas. Ele permite que desenvolvedores apresentem informações e ações adicionais de maneira intuitiva e eficiente, melhorando a experiência geral do usuário. Ao implementar BottomSheets, considere as melhores práticas de design e usabilidade para garantir que a interação seja fluida e que o conteúdo seja relevante e acessível.

### Boas Práticas

- **Clareza**: Certifique-se de que o conteúdo do BottomSheet seja claro e relevante para o contexto atual.
- **Responsividade**: Adapte o BottomSheet para diferentes tamanhos e orientações de tela.
- **Acessibilidade**: Garanta que o BottomSheet seja acessível a todos os usuários, incluindo aqueles que utilizam leitores de tela.
- **Performance**: Evite sobrecarregar o BottomSheet com widgets complexos que possam afetar a performance do aplicativo.

### Ferramentas e Pacotes Úteis

- **DraggableScrollableSheet**: Facilita a criação de BottomSheets redimensionáveis.
- **Flutter Hooks**: Pode ser utilizado para gerenciar o estado de BottomSheets de maneira mais eficiente.
- **Packages como `modal_bottom_sheet`**: Oferecem funcionalidades adicionais e personalizações para BottomSheets.

## Referências

- [Documentação Oficial do Flutter sobre BottomSheet](https://api.flutter.dev/flutter/material/BottomSheet-class.html)
- [Documentação do `showModalBottomSheet`](https://api.flutter.dev/flutter/material/showModalBottomSheet.html)
- [Flutter Cookbook: Exibindo um Modal BottomSheet](https://flutter.dev/docs/cookbook/design/snackbar)
- [Tutorial de BottomSheets no Flutter](https://www.raywenderlich.com/21388336-flutter-bottom-sheets-tutorial)

---

**Nota**: Ao implementar BottomSheets, é importante testar em diferentes dispositivos e cenários para garantir uma experiência consistente e sem falhas para todos os usuários.