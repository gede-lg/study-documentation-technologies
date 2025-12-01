
## O que é e para que serve?

O `MediaQuery` é um widget do Flutter que fornece informações sobre a orientação, dimensões e outras características do dispositivo em que o aplicativo está sendo executado. Ele permite que você adapte seu layout e comportamento de acordo com o tamanho da tela, densidade de pixels, orientações e outras características de mídia do dispositivo.

**Para que serve?**

- **Responsividade**: Ajustar o layout para diferentes tamanhos de tela.
- **Acessibilidade**: Adaptar fontes e tamanhos de elementos para melhorar a legibilidade.
- **Detecção de Orientação**: Saber se o dispositivo está em modo retrato ou paisagem.
- **Informações de Dispositivo**: Obter dados como densidade de pixels, padding, entre outros.

## Como funciona?

O `MediaQuery` funciona propagando um objeto `MediaQueryData` pela árvore de widgets, que pode ser acessado por qualquer widget filho. Este objeto contém informações sobre o ambiente em que o aplicativo está sendo executado.

Quando você usa o `MediaQuery.of(context)`, você está acessando o `MediaQueryData` atual do contexto fornecido. A partir daí, você pode obter várias propriedades, como o tamanho da tela, orientação, densidade de pixels, etc.

## Sintaxe de uso

Para acessar o `MediaQueryData`, você utiliza:

```dart
MediaQueryData mediaQueryData = MediaQuery.of(context);
```

Exemplo de uso para obter a largura e altura da tela:

```dart
double larguraTela = MediaQuery.of(context).size.width;
double alturaTela = MediaQuery.of(context).size.height;
```

## Restrições de uso

- **Contexto Válido**: O contexto fornecido deve ter um `MediaQuery` ancestral. Geralmente, isso não é um problema, já que o `MaterialApp` ou `WidgetsApp` geralmente fornece isso.
- **Fora da Árvore de Widgets**: Não é possível usar o `MediaQuery` fora da árvore de widgets, como em classes que não são widgets ou antes do método `build`.

## Quando utilizar?

- **Layouts Responsivos**: Quando você precisa que seu layout se adapte a diferentes tamanhos de tela.
- **Ajustes de Fonte**: Para adaptar o tamanho da fonte com base nas configurações do dispositivo.
- **Detecção de Orientação**: Para modificar o layout quando o dispositivo muda de retrato para paisagem.
- **Espaçamento Seguro**: Para considerar áreas não utilizáveis da tela, como notches ou barras de status.

## Tabela de Propriedades

| Propriedade             | Descrição                                                                                                                                       | Sintaxe de Uso                                     |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| `size`                  | Retorna o tamanho total da área utilizável da tela.                                                                                             | `MediaQuery.of(context).size`                      |
| `devicePixelRatio`      | Densidade de pixels do dispositivo.                                                                                                             | `MediaQuery.of(context).devicePixelRatio`          |
| `textScaleFactor`       | Fator de escala do texto definido pelo usuário nas configurações do dispositivo.                                                                | `MediaQuery.of(context).textScaleFactor`           |
| `platformBrightness`    | Brilho da plataforma (claro ou escuro), útil para temas.                                                                                        | `MediaQuery.of(context).platformBrightness`        |
| `padding`               | Espaçamento inserido pelo sistema operacional, como notches e barras de status.                                                                 | `MediaQuery.of(context).padding`                   |
| `viewPadding`           | Padding da área visível da aplicação, incluindo áreas cobertas por barras do sistema.                                                           | `MediaQuery.of(context).viewPadding`               |
| `viewInsets`            | Espaços ocupados por elementos como o teclado virtual.                                                                                          | `MediaQuery.of(context).viewInsets`                |
| `alwaysUse24HourFormat` | Indica se o formato de 24 horas deve ser usado para exibir a hora.                                                                              | `MediaQuery.of(context).alwaysUse24HourFormat`     |
| `accessibleNavigation`  | Indica se o usuário está usando tecnologias assistivas para navegação.                                                                          | `MediaQuery.of(context).accessibleNavigation`      |
| `disableAnimations`     | Indica se as animações devem ser desabilitadas, geralmente por motivos de acessibilidade.                                                       | `MediaQuery.of(context).disableAnimations`         |
| `invertColors`          | Indica se as cores devem ser invertidas, útil para usuários com certas necessidades visuais.                                                    | `MediaQuery.of(context).invertColors`              |
| `boldText`              | Indica se o texto deve ser exibido em negrito, baseado nas configurações de acessibilidade do usuário.                                          | `MediaQuery.of(context).boldText`                  |
| `orientation`           | Retorna a orientação atual da tela (retratos ou paisagem).                                                                                      | `MediaQuery.of(context).orientation`               |
| `highContrast`          | Indica se o usuário solicitou um tema de alto contraste.                                                                                        | `MediaQuery.of(context).highContrast`              |
| `navigationMode`        | Indica o modo de navegação atual, como tradicional ou direcional.                                                                               | `MediaQuery.of(context).navigationMode`            |
| `gestureSettings`       | Configurações de gestos do usuário, como tamanho mínimo de toque.                                                                               | `MediaQuery.of(context).gestureSettings`           |
| `displayFeatures`       | Lista de recursos de exibição presentes na tela, como dobras ou recortes.                                                                       | `MediaQuery.of(context).displayFeatures`           |
| `systemGestureInsets`   | Áreas onde gestos do sistema têm prioridade sobre os gestos do aplicativo.                                                                      | `MediaQuery.of(context).systemGestureInsets`       |
| `physicalDepth`         | A profundidade física da tela em milímetros, útil para aplicações de realidade aumentada.                                                       | `MediaQuery.of(context).physicalDepth`             |

## Tabela de Principais Métodos

| Método                    | Descrição                                                                                                                   | Sintaxe de Uso                                  |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `MediaQuery.of`           | Obtém o `MediaQueryData` a partir do contexto.                                                                              | `MediaQuery.of(context)`                        |
| `MediaQuery.removePadding`| Remove o padding especificado dos widgets filhos.                                                                           | `MediaQuery.removePadding(...)`                 |
| `MediaQuery.removeViewInsets`| Remove as viewInsets (como o teclado) dos widgets filhos.                                                                | `MediaQuery.removeViewInsets(...)`              |
| `MediaQuery.removeViewPadding`| Remove o viewPadding dos widgets filhos.                                                                                | `MediaQuery.removeViewPadding(...)`             |
| `MediaQueryData.fromWindow`| Cria um `MediaQueryData` a partir de uma instância de `Window`.                                                            | `MediaQueryData.fromWindow(window)`             |
| `copyWith`                | Cria uma cópia do `MediaQueryData` com os valores modificados.                                                              | `mediaQueryData.copyWith(...)`                  |

## Exemplos de Uso

### Layout Responsivo

```dart
Widget build(BuildContext context) {
  double larguraTela = MediaQuery.of(context).size.width;

  return Container(
    width: larguraTela * 0.8, // 80% da largura da tela
    color: Colors.blue,
    child: Text('Container Responsivo'),
  );
}
```

### Detecção de Orientação

```dart
Widget build(BuildContext context) {
  Orientation orientation = MediaQuery.of(context).orientation;

  if (orientation == Orientation.portrait) {
    return _buildPortraitLayout();
  } else {
    return _buildLandscapeLayout();
  }
}
```

### Ajuste de Fonte

```dart
Text(
  'Texto Ajustável',
  style: TextStyle(
    fontSize: 16 * MediaQuery.of(context).textScaleFactor,
  ),
);
```

## Em quais categorias de widget mais se encaixa

- **Accessibility**
- **Layout**
- **Styling**
- **Text**

O `MediaQuery` é fundamental para criar interfaces acessíveis e responsivas, ajustando layouts, estilos e textos de acordo com as características do dispositivo.

## Informações Adicionais

- **Consistência**: Usar o `MediaQuery` ajuda a manter a consistência visual em diferentes dispositivos.
- **Boas Práticas**: Evite usar valores fixos para dimensões; prefira usar porcentagens ou valores relativos obtidos do `MediaQuery`.
- **Performance**: O uso excessivo de `MediaQuery.of(context)` pode impactar a performance. Armazene o `MediaQueryData` em uma variável se for usá-lo múltiplas vezes.

## Exemplo Completo

```dart
import 'package:flutter/material.dart';

class ExemploMediaQuery extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Obtém o MediaQueryData uma única vez
    final mediaQuery = MediaQuery.of(context);

    final largura = mediaQuery.size.width;
    final altura = mediaQuery.size.height;
    final orientacao = mediaQuery.orientation;
    final padding = mediaQuery.padding;

    return Scaffold(
      appBar: AppBar(
        title: Text('Exemplo MediaQuery'),
      ),
      body: Padding(
        padding: EdgeInsets.only(
          top: padding.top,
          bottom: padding.bottom,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Largura: $largura',
                style: TextStyle(fontSize: 20),
              ),
              Text(
                'Altura: $altura',
                style: TextStyle(fontSize: 20),
              ),
              Text(
                'Orientação: $orientacao',
                style: TextStyle(fontSize: 20),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

## Conclusão

O `MediaQuery` é uma ferramenta poderosa no Flutter que permite criar aplicativos adaptáveis e acessíveis. Ao compreender e utilizar suas propriedades e métodos, você pode melhorar significativamente a experiência do usuário em diferentes dispositivos e configurações.