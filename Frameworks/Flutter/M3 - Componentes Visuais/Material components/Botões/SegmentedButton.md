
## Introdução

No desenvolvimento de interfaces de usuário (UI) com Flutter, a criação de componentes interativos e intuitivos é essencial para proporcionar uma experiência agradável ao usuário. Um desses componentes é o **SegmentedButton**, um widget que permite a seleção entre múltiplas opções, apresentando-as de forma segmentada e organizada. Inspirado no `UISegmentedControl` da plataforma iOS, o `SegmentedButton` facilita a alternância entre diferentes visões ou funcionalidades dentro de um aplicativo.

## Sumário

1. [O que é o SegmentedButton e para que serve?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#o-que-%C3%A9-o-segmentedbutton-e-para-que-serve)
2. [Como funciona o SegmentedButton?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#como-funciona-o-segmentedbutton)
3. [Sintaxe de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#sintaxe-de-uso)
    - [Descrição dos parâmetros](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#descri%C3%A7%C3%A3o-dos-par%C3%A2metros)
4. [Restrições de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#restri%C3%A7%C3%B5es-de-uso)
5. [Quando utilizar o SegmentedButton?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#quando-utilizar-o-segmentedbutton)
6. [Propriedades do SegmentedButton](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#propriedades-do-segmentedbutton)
    - [Tabela de Propriedades](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#tabela-de-propriedades)
7. [Métodos do SegmentedButton](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#m%C3%A9todos-do-segmentedbutton)
    - [Tabela de Métodos](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#tabela-de-m%C3%A9todos)
8. [Categorias de Widget](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#categorias-de-widget)
9. [Exemplos de código](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#exemplos-de-c%C3%B3digo)
10. [Considerações Finais](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#considera%C3%A7%C3%B5es-finais)

## O que é o SegmentedButton e para que serve?

O **SegmentedButton** é um widget do Flutter que exibe múltiplas opções como segmentos de um botão, permitindo que o usuário selecione uma ou mais dessas opções de forma visualmente clara e intuitiva. Cada segmento representa uma opção distinta, e a seleção pode ser configurada para permitir múltiplas escolhas ou apenas uma única seleção.

**Finalidades principais:**

- **Navegação rápida:** Alternar entre diferentes seções ou visualizações dentro de uma mesma página.
- **Filtragem de conteúdo:** Aplicar filtros a uma lista ou conjunto de dados exibidos.
- **Configurações e preferências:** Selecionar opções de configuração de forma segmentada.

## Como funciona o SegmentedButton?

O `SegmentedButton` funciona agrupando vários botões menores (segmentos) em um único componente. Cada segmento pode ser selecionado individualmente ou em conjunto, dependendo da configuração escolhida. O widget gerencia o estado de seleção dos segmentos, garantindo que a interação do usuário seja refletida de forma consistente na UI.

**Funcionamento básico:**

1. **Definição das opções:** Cada segmento representa uma opção definida pelo desenvolvedor.
2. **Gerenciamento de seleção:** O widget controla quais segmentos estão selecionados, permitindo mudanças dinâmicas conforme a interação do usuário.
3. **Personalização visual:** É possível estilizar os segmentos para se adequarem ao tema e design do aplicativo.

## Sintaxe de uso

A utilização do `SegmentedButton` envolve a definição das opções disponíveis, o gerenciamento do estado de seleção e a configuração de comportamentos específicos conforme necessário.

### Exemplo Básico

```dart
import 'package:flutter/material.dart';

class ExemploSegmentedButton extends StatefulWidget {
  @override
  _ExemploSegmentedButtonState createState() => _ExemploSegmentedButtonState();
}

class _ExemploSegmentedButtonState extends State<ExemploSegmentedButton> {
  // Lista de opções disponíveis
  final List<String> _opcoes = ['Opção 1', 'Opção 2', 'Opção 3'];

  // Estado das opções selecionadas
  String _opcaoSelecionada = 'Opção 1';

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SegmentedButton<String>(
        segments: _opcoes
            .map((opcao) => ButtonSegment<String>(
                  value: opcao,
                  label: Text(opcao),
                ))
            .toList(),
        selected: {_opcaoSelecionada},
        onSelectionChanged: (Set<String> novasSelecoes) {
          setState(() {
            _opcaoSelecionada = novasSelecoes.first;
          });
        },
      ),
    );
  }
}
```

### Explicação do Exemplo

- **segments:** Define os segmentos disponíveis, mapeando cada opção para um `ButtonSegment`.
- **selected:** Define quais segmentos estão atualmente selecionados.
- **onSelectionChanged:** Callback que é chamado quando a seleção muda, permitindo atualizar o estado.

## Descrição dos parâmetros

A seguir, detalhamos cada parâmetro do `SegmentedButton`, explicando seu tipo, aceitação e se é obrigatório ou opcional.

### Parâmetros

|Parâmetro|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|`segments`|`List<ButtonSegment<T>>`|Sim|Lista de segmentos que compõem o `SegmentedButton`. Cada `ButtonSegment` representa uma opção que pode ser selecionada.|
|`selected`|`Set<T>`|Sim|Conjunto de valores que estão atualmente selecionados. Utiliza-se um `Set` para permitir múltiplas seleções, se configurado.|
|`onSelectionChanged`|`ValueChanged<Set<T>>`|Sim|Callback acionado quando a seleção muda. Recebe o novo conjunto de seleções.|
|`multiselect`|`bool`|Não|Define se múltiplas opções podem ser selecionadas simultaneamente. O padrão é `false`, permitindo apenas uma seleção.|
|`style`|`ButtonStyle?`|Não|Estilo personalizado para os botões, permitindo customizações visuais como cores, bordas, etc.|
|`showSelectedIcon`|`bool`|Não|Define se um ícone de seleção deve ser exibido nos segmentos selecionados. O padrão é `false`.|
|`textStyle`|`TextStyle?`|Não|Estilo de texto personalizado para os rótulos dos segmentos.|
|`padding`|`EdgeInsetsGeometry?`|Não|Padding interno dos segmentos.|
|`elevation`|`double?`|Não|Elevação (sombra) dos botões, para criar um efeito de profundidade.|
|`backgroundColor`|`Color?`|Não|Cor de fundo dos segmentos não selecionados.|
|`selectedColor`|`Color?`|Não|Cor de fundo dos segmentos selecionados.|
|`borderRadius`|`BorderRadius?`|Não|Define o raio das bordas dos segmentos, permitindo cantos arredondados.|
|`height`|`double?`|Não|Altura dos segmentos.|
|`width`|`double?`|Não|Largura dos segmentos.|
|`constraints`|`BoxConstraints?`|Não|Restrições de layout para os segmentos.|
|`animationDuration`|`Duration`|Não|Duração das animações de transição de estado.|
|`animationCurve`|`Curve`|Não|Curva de animação para transições de estado.|

## Restrições de uso

Apesar de ser um widget versátil, o `SegmentedButton` possui algumas restrições que devem ser consideradas durante seu uso:

- **Tipos de Dados:** O tipo genérico `T` utilizado nos segmentos deve ser consistente e único para cada opção.
- **Renderização:** Em listas com um número muito grande de segmentos, a performance pode ser afetada. É recomendável limitar o número de opções visíveis.
- **Compatibilidade:** O `SegmentedButton` está disponível a partir de versões específicas do Flutter. Verifique a compatibilidade com a versão utilizada no seu projeto.
- **Estilização Avançada:** Personalizações muito complexas podem exigir a criação de widgets personalizados ou a utilização de outras abordagens.

## Quando utilizar o SegmentedButton?

O `SegmentedButton` é ideal para cenários onde é necessário permitir que o usuário escolha entre múltiplas opções de forma clara e direta. Alguns casos de uso comuns incluem:

- **Filtros de Conteúdo:** Aplicar diferentes filtros a uma lista ou coleção de itens.
- **Navegação entre Vistas:** Alternar entre diferentes seções ou páginas dentro de uma mesma tela.
- **Configurações Rápidas:** Alterar rapidamente entre diferentes modos ou preferências de configuração.
- **Opções de Visualização:** Selecionar entre diferentes modos de exibição, como lista ou grade.

## Propriedades do SegmentedButton

O `SegmentedButton` possui diversas propriedades que permitem sua configuração e personalização. Abaixo, apresentamos uma tabela detalhada com todas as propriedades disponíveis.

### Tabela de Propriedades

|Propriedade|Descrição|Sintaxe de Uso|
|---|---|---|
|`segments`|Lista de segmentos que compõem o botão segmentado.|`List<ButtonSegment<T>>`|
|`selected`|Conjunto de valores que estão atualmente selecionados.|`Set<T>`|
|`onSelectionChanged`|Callback acionado quando a seleção muda.|`ValueChanged<Set<T>>`|
|`multiselect`|Define se múltiplas opções podem ser selecionadas simultaneamente.|`bool`|
|`style`|Estilo personalizado para os botões.|`ButtonStyle?`|
|`showSelectedIcon`|Define se um ícone de seleção deve ser exibido nos segmentos selecionados.|`bool`|
|`textStyle`|Estilo de texto personalizado para os rótulos dos segmentos.|`TextStyle?`|
|`padding`|Padding interno dos segmentos.|`EdgeInsetsGeometry?`|
|`elevation`|Elevação (sombra) dos botões, para criar um efeito de profundidade.|`double?`|
|`backgroundColor`|Cor de fundo dos segmentos não selecionados.|`Color?`|
|`selectedColor`|Cor de fundo dos segmentos selecionados.|`Color?`|
|`borderRadius`|Define o raio das bordas dos segmentos, permitindo cantos arredondados.|`BorderRadius?`|
|`height`|Altura dos segmentos.|`double?`|
|`width`|Largura dos segmentos.|`double?`|
|`constraints`|Restrições de layout para os segmentos.|`BoxConstraints?`|
|`animationDuration`|Duração das animações de transição de estado.|`Duration`|
|`animationCurve`|Curva de animação para transições de estado.|`Curve`|

## Métodos do SegmentedButton

O `SegmentedButton` é um widget e, portanto, não possui métodos próprios para interação direta. Sua funcionalidade é gerenciada através de suas propriedades e callbacks. Contudo, é importante entender como utilizar seus métodos internos, como os relacionados à construção e atualização do widget.

### Tabela de Métodos

|Método|Descrição|Sintaxe de Uso|
|---|---|---|
|`build`|Método responsável por construir a interface do widget.|`@override Widget build(BuildContext context)`|
|`didChangeDependencies`|Chamado quando as dependências do widget mudam.|`@override void didChangeDependencies()`|
|`initState`|Inicializa o estado do widget.|`@override void initState()`|
|`dispose`|Limpa recursos quando o widget é removido da árvore de widgets.|`@override void dispose()`|

## Categorias de Widget

O `SegmentedButton` se encaixa principalmente nas seguintes categorias de widgets no Flutter:

- **Input:** Como o widget lida com a seleção de opções pelo usuário.
- **Material Components:** Faz parte da biblioteca de componentes de material design do Flutter.
- **Interaction models:** Gerencia a interação do usuário com múltiplas opções.
- **Styling:** Permite personalização visual para se adequar ao tema do aplicativo.

## Exemplos de Código

A seguir, apresentamos exemplos de utilização do `SegmentedButton` em diferentes cenários.

### Exemplo 1: Seleção Única

Este exemplo demonstra como utilizar o `SegmentedButton` para permitir a seleção de apenas uma opção dentre várias.

```dart
import 'package:flutter/material.dart';

class SegmentedButtonExemploUnico extends StatefulWidget {
  @override
  _SegmentedButtonExemploUnicoState createState() => _SegmentedButtonExemploUnicoState();
}

class _SegmentedButtonExemploUnicoState extends State<SegmentedButtonExemploUnico> {
  // Opções disponíveis
  final List<String> _opcoes = ['Home', 'Perfil', 'Configurações'];

  // Opção selecionada
  String _opcaoSelecionada = 'Home';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SegmentedButton - Seleção Única'),
      ),
      body: Center(
        child: SegmentedButton<String>(
          segments: _opcoes
              .map((opcao) => ButtonSegment<String>(
                    value: opcao,
                    label: Text(opcao),
                  ))
              .toList(),
          selected: {_opcaoSelecionada},
          onSelectionChanged: (Set<String> novasSelecoes) {
            setState(() {
              _opcaoSelecionada = novasSelecoes.first;
            });
          },
          // Estilo opcional
          style: ButtonStyle(
            backgroundColor: MaterialStateProperty.resolveWith<Color?>(
              (Set<MaterialState> states) {
                if (states.contains(MaterialState.selected)) {
                  return Colors.blue;
                }
                return Colors.grey[300];
              },
            ),
          ),
        ),
      ),
    );
  }
}
```

### Exemplo 2: Seleção Múltipla com Ícones

Este exemplo demonstra como permitir a seleção de múltiplas opções e adicionar ícones aos segmentos selecionados.

```dart
import 'package:flutter/material.dart';

class SegmentedButtonExemploMultiplo extends StatefulWidget {
  @override
  _SegmentedButtonExemploMultiploState createState() => _SegmentedButtonExemploMultiploState();
}

class _SegmentedButtonExemploMultiploState extends State<SegmentedButtonExemploMultiplo> {
  // Opções disponíveis
  final List<String> _opcoes = ['Email', 'SMS', 'Notificações Push'];

  // Opções selecionadas
  Set<String> _opcoesSelecionadas = {'Email'};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SegmentedButton - Seleção Múltipla'),
      ),
      body: Center(
        child: SegmentedButton<String>(
          segments: _opcoes
              .map((opcao) => ButtonSegment<String>(
                    value: opcao,
                    label: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(opcao),
                        if (_opcoesSelecionadas.contains(opcao))
                          Icon(
                            Icons.check,
                            size: 16,
                            color: Colors.white,
                          ),
                      ],
                    ),
                  ))
              .toList(),
          selected: _opcoesSelecionadas,
          onSelectionChanged: (Set<String> novasSelecoes) {
            setState(() {
              _opcoesSelecionadas = novasSelecoes;
            });
          },
          multiselect: true,
          // Estilo opcional
          style: ButtonStyle(
            backgroundColor: MaterialStateProperty.resolveWith<Color?>(
              (Set<MaterialState> states) {
                if (states.contains(MaterialState.selected)) {
                  return Colors.green;
                }
                return Colors.grey[300];
              },
            ),
          ),
        ),
      ),
    );
  }
}
```

### Exemplo 3: Personalização Avançada

Este exemplo demonstra como personalizar visualmente o `SegmentedButton`, incluindo cores, bordas e animações.

```dart
import 'package:flutter/material.dart';

class SegmentedButtonExemploPersonalizado extends StatefulWidget {
  @override
  _SegmentedButtonExemploPersonalizadoState createState() => _SegmentedButtonExemploPersonalizadoState();
}

class _SegmentedButtonExemploPersonalizadoState extends State<SegmentedButtonExemploPersonalizado> {
  // Opções disponíveis
  final List<String> _opcoes = ['Diário', 'Semanal', 'Mensal'];

  // Opção selecionada
  String _opcaoSelecionada = 'Diário';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SegmentedButton - Personalizado'),
      ),
      body: Center(
        child: SegmentedButton<String>(
          segments: _opcoes
              .map((opcao) => ButtonSegment<String>(
                    value: opcao,
                    label: Text(
                      opcao,
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ))
              .toList(),
          selected: {_opcaoSelecionada},
          onSelectionChanged: (Set<String> novasSelecoes) {
            setState(() {
              _opcaoSelecionada = novasSelecoes.first;
            });
          },
          style: ButtonStyle(
            backgroundColor: MaterialStateProperty.resolveWith<Color?>(
              (Set<MaterialState> states) {
                if (states.contains(MaterialState.selected)) {
                  return Colors.purple;
                }
                return Colors.purple[100];
              },
            ),
            shape: MaterialStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0),
                side: BorderSide(color: Colors.purple),
              ),
            ),
            animationDuration: Duration(milliseconds: 300),
            animationCurve: Curves.easeInOut,
          ),
        ),
      ),
    );
  }
}
```

## Considerações Finais

O `SegmentedButton` é uma ferramenta poderosa para criar interfaces de usuário interativas e intuitivas no Flutter. Sua capacidade de organizar múltiplas opções de forma segmentada melhora a experiência do usuário, facilitando a navegação e a seleção de preferências dentro do aplicativo.

**Boas práticas ao utilizar o SegmentedButton:**

- **Clareza nas Opções:** As opções apresentadas devem ser claras e mutuamente exclusivas quando a seleção for única.
- **Consistência Visual:** Mantenha a consistência no estilo dos segmentos para harmonizar com o restante da interface.
- **Feedback Visual:** Utilize mudanças visuais (como cores e ícones) para indicar claramente quais opções estão selecionadas.
- **Responsividade:** Assegure-se de que o `SegmentedButton` seja responsivo e funcione bem em diferentes tamanhos de tela e dispositivos.

Além disso, considere a acessibilidade ao projetar os segmentos, garantindo que sejam facilmente utilizáveis por todos os usuários, inclusive aqueles com deficiências.

## Referências

- [Documentação Oficial do Flutter - SegmentedButton](https://api.flutter.dev/flutter/material/SegmentedButton-class.html)
- [Flutter Widgets Catalog](https://flutter.dev/docs/development/ui/widgets)
- [Material Design Guidelines - Segmented Controls](https://material.io/components/segmented-buttons)

---

**Nota:** Sempre teste os componentes em diferentes dispositivos e cenários para garantir a melhor experiência ao usuário. A personalização avançada pode exigir ajustes adicionais para atender às necessidades específicas do seu aplicativo.