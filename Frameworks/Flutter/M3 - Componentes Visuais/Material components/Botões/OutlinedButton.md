
## Introdução

No desenvolvimento de interfaces de usuário no Flutter, os botões são componentes essenciais para interações do usuário. O `OutlinedButton` é uma das variantes de botões fornecidas pelo Flutter, oferecendo um estilo distinto que combina linhas contornadas com textos ou ícones. Este botão é particularmente útil quando se deseja uma aparência mais sutil em comparação com os botões preenchidos (`ElevatedButton`) ou de texto simples (`TextButton`).

## Sumário

1. [O que é e para que serve?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#o-que-%C3%A9-e-para-que-serve)
2. [Como funciona?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#como-funciona)
3. [Sintaxe de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#sintaxe-de-uso)
4. [Restrições de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#restri%C3%A7%C3%B5es-de-uso)
5. [Quando utilizar?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#quando-utilizar)
6. [Propriedades do OutlinedButton](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#propriedades-do-outlinedbutton)
7. [Métodos do OutlinedButton](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#m%C3%A9todos-do-outlinedbutton)
8. [Categoria de Widget](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#categoria-de-widget)
9. [Exemplos de Código](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#exemplos-de-c%C3%B3digo)
10. [Considerações Finais](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#considera%C3%A7%C3%B5es-finais)

## O que é e para que serve?

**`OutlinedButton`** é um widget de botão do Flutter que exibe uma borda contornada sem preenchimento interno. Ele é ideal para cenários onde se deseja um botão com destaque sutil, mantendo a hierarquia visual com outros elementos da interface.

**Finalidades principais:**

- **Ação secundária:** Indicado para ações que são importantes, mas não são a principal ação da tela.
- **Estilo sutil:** Quando se busca uma aparência mais leve em comparação com botões preenchidos.
- **Consistência visual:** Mantém a coerência com o design de Material Design, oferecendo uma variante específica de botão.

## Como funciona?

O `OutlinedButton` é construído com base no widget `ButtonStyleButton`, que permite personalizar diversos aspectos visuais e comportamentais do botão. Ele utiliza a propriedade `style` para definir características como cor da borda, cor do texto, padding, entre outras.

### Estrutura Básica

```dart
OutlinedButton(
  onPressed: () {
    // Ação do botão
  },
  child: Text('Clique Aqui'),
)
```

- **`onPressed`**: Callback que é executado quando o botão é pressionado.
- **`child`**: Widget que será exibido dentro do botão, geralmente um `Text` ou um `Icon`.

## Sintaxe de uso

A criação de um `OutlinedButton` envolve a utilização do construtor padrão, onde é possível personalizar diversas propriedades. A seguir, detalhamos cada parâmetro disponível.

### Construtor

```dart
OutlinedButton({
  Key? key,
  required VoidCallback? onPressed,
  VoidCallback? onLongPress,
  ButtonStyle? style,
  FocusNode? focusNode,
  bool autofocus = false,
  Clip clipBehavior = Clip.none,
  required Widget child,
})
```

### Descrição dos Parâmetros

|**Parâmetro**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|`key`|Identificador exclusivo para o widget. Útil para preservar o estado do widget em reconstruções.|`key: Key('botao1')`|
|`onPressed`|Callback chamado quando o botão é pressionado. Pode ser nulo para desabilitar o botão.|`onPressed: () { /* ação */ }`|
|`onLongPress`|Callback chamado quando o botão é pressionado por um longo período. Pode ser nulo se não for necessário.|`onLongPress: () { /* ação */ }`|
|`style`|Define o estilo visual do botão, como cores, bordas e padding. Utiliza a classe `ButtonStyle`.|`style: ButtonStyle(...)`|
|`focusNode`|Gerencia o foco do botão, permitindo controle programático sobre seu estado de foco.|`focusNode: FocusNode()`|
|`autofocus`|Indica se o botão deve receber foco automaticamente ao ser exibido.|`autofocus: true`|
|`clipBehavior`|Define como o conteúdo dentro do botão deve ser recortado (clipping).|`clipBehavior: Clip.antiAlias`|
|`child`|Widget que será exibido dentro do botão. Geralmente um `Text`, `Icon` ou `Row` com múltiplos widgets.|`child: Text('Clique Aqui')`|

### Detalhamento dos Parâmetros

- **`key`**: Utilizado para identificar o widget de forma única dentro da árvore de widgets. É especialmente útil em listas ou quando se utiliza animações.
    
    ```dart
    key: Key('botaoSalvar')
    ```
    
- **`onPressed`**: Função obrigatória que define a ação a ser executada quando o botão é pressionado. Se definido como `null`, o botão ficará desabilitado.
    
    ```dart
    onPressed: () {
      print('Botão pressionado');
    }
    ```
    
- **`onLongPress`**: Função opcional que define a ação a ser executada quando o botão é pressionado por um longo período.
    
    ```dart
    onLongPress: () {
      print('Botão pressionado por um longo período');
    }
    ```
    
- **`style`**: Permite a personalização detalhada do botão, como cor da borda, cor de fundo, formas, padding, entre outros. Utiliza `ButtonStyle` com várias propriedades como `side`, `backgroundColor`, `padding`, etc.
    
    ```dart
    style: OutlinedButton.styleFrom(
      primary: Colors.blue,
      side: BorderSide(color: Colors.blue, width: 2),
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    )
    ```
    
- **`focusNode`**: Permite o controle programático do foco no botão, podendo ser utilizado para direcionar o foco em navegadores ou para acessibilidade.
    
    ```dart
    focusNode: FocusNode(),
    ```
    
- **`autofocus`**: Quando definido como `true`, o botão receberá foco automaticamente ao ser exibido. Útil para facilitar a navegação via teclado.
    
    ```dart
    autofocus: true,
    ```
    
- **`clipBehavior`**: Define como o conteúdo do botão deve ser recortado. Os valores possíveis são `Clip.none`, `Clip.hardEdge`, `Clip.antiAlias`, e `Clip.antiAliasWithSaveLayer`.
    
    ```dart
    clipBehavior: Clip.antiAlias,
    ```
    
- **`child`**: Widget obrigatório que define o conteúdo interno do botão. Pode ser um `Text`, `Icon`, ou uma combinação de widgets.
    
    ```dart
    child: Row(
      children: [
        Icon(Icons.save),
        SizedBox(width: 8),
        Text('Salvar'),
      ],
    )
    ```
    

## Restrições de uso

Embora o `OutlinedButton` seja altamente personalizável, existem algumas restrições e considerações a serem observadas:

- **Compatibilidade de Tema**: O estilo do botão pode ser influenciado pelo tema global da aplicação. Personalizações excessivas podem causar inconsistências visuais.
- **Acessibilidade**: É essencial garantir que as cores e tamanhos escolhidos atendam aos padrões de acessibilidade para que o botão seja facilmente utilizável por todos os usuários.
- **Performance**: Personalizações muito complexas podem impactar a performance, especialmente se usadas em grande quantidade na interface.
- **Tamanho e Espaçamento**: O `OutlinedButton` possui padding interno padrão que pode precisar ser ajustado para diferentes layouts.

## Quando utilizar?

O `OutlinedButton` é ideal para situações específicas onde se deseja uma ação destacada de forma sutil. Alguns cenários comuns incluem:

- **Ações Secundárias**: Botões que não são a principal ação da tela, mas ainda assim importantes.
    
    ```dart
    Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        OutlinedButton(
          onPressed: () {},
          child: Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: () {},
          child: Text('Salvar'),
        ),
      ],
    )
    ```
    
- **Formulários**: Em formulários onde diferentes ações são necessárias, como limpar campos ou enviar dados.
    
    ```dart
    OutlinedButton(
      onPressed: () {
        // Limpar formulário
      },
      child: Text('Limpar'),
    )
    ```
    
- **Diálogos e Modais**: Para ações dentro de diálogos que exigem uma distinção visual.
    
    ```dart
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirmação'),
        content: Text('Deseja realmente sair?'),
        actions: [
          OutlinedButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Não'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Sim'),
          ),
        ],
      ),
    );
    ```
    
- **Interfaces Responsivas**: Quando se deseja que os botões se adaptem de forma harmoniosa em diferentes tamanhos de tela.
    

## Propriedades do OutlinedButton

A seguir, apresentamos uma tabela completa das propriedades do `OutlinedButton`, descrevendo cada uma e sua sintaxe de uso.

|**Propriedade**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|`onPressed`|Callback chamado quando o botão é pressionado. Deve ser uma função ou `null` para desabilitar o botão.|`onPressed: () { /* ação */ }`|
|`onLongPress`|Callback chamado quando o botão é pressionado por um longo período.|`onLongPress: () { /* ação */ }`|
|`style`|Define o estilo visual do botão, incluindo cor, borda, padding, etc., utilizando `ButtonStyle`.|`style: ButtonStyle(...)`|
|`focusNode`|Controla o foco do botão, permitindo manipulação programática do foco.|`focusNode: FocusNode()`|
|`autofocus`|Indica se o botão deve receber foco automaticamente ao ser exibido.|`autofocus: true`|
|`clipBehavior`|Define como o conteúdo interno deve ser recortado.|`clipBehavior: Clip.antiAlias`|
|`child`|Widget que será exibido dentro do botão. Geralmente um `Text`, `Icon` ou combinação de widgets.|`child: Text('Clique Aqui')`|
|`key`|Identificador exclusivo para o widget, usado para preservar estado ou identificar o widget de forma única.|`key: Key('botao1')`|
|`onHover`|Callback chamado quando o ponteiro do mouse entra ou sai do botão.|`onHover: (bool hovering) { /* ação */ }`|
|`onFocusChange`|Callback chamado quando o foco do botão muda.|`onFocusChange: (bool isFocused) { /* ação */ }`|
|`mouseCursor`|Define o cursor do mouse quando está sobre o botão.|`mouseCursor: SystemMouseCursors.click`|
|`minimumSize`|Define o tamanho mínimo do botão.|`minimumSize: Size(100, 50)`|
|`padding`|Define o espaço interno entre o conteúdo do botão e suas bordas.|`padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8)`|
|`side`|Define a borda do botão, incluindo cor e largura.|`side: BorderSide(color: Colors.blue, width: 2)`|
|`shape`|Define a forma do botão, como bordas arredondadas ou circulares.|`shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))`|
|`backgroundColor`|Define a cor de fundo do botão.|`backgroundColor: MaterialStateProperty.all(Colors.white)`|
|`foregroundColor`|Define a cor do conteúdo do botão (texto e ícones).|`foregroundColor: MaterialStateProperty.all(Colors.blue)`|
|`elevation`|Define a elevação (sombra) do botão.|`elevation: MaterialStateProperty.all(2)`|
|`textStyle`|Define o estilo do texto dentro do botão.|`textStyle: MaterialStateProperty.all(TextStyle(fontSize: 16))`|
|`animationDuration`|Define a duração das animações de transição de estado do botão.|`animationDuration: Duration(milliseconds: 200)`|
|`tapTargetSize`|Define o tamanho da área sensível ao toque do botão.|`tapTargetSize: MaterialTapTargetSize.shrinkWrap`|

## Métodos do OutlinedButton

Embora o `OutlinedButton` seja principalmente um widget com propriedades configuráveis, alguns métodos podem ser utilizados para criar variações ou comportamentos específicos. A seguir, estão listados os métodos mais relevantes.

|**Método**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|`styleFrom`|Método estático que facilita a criação de um `ButtonStyle` com base em parâmetros comuns.|`OutlinedButton.styleFrom(primary: Colors.blue, ...)`|
|`icon`|Cria um `OutlinedButton` que inclui um ícone junto ao texto.|`OutlinedButton.icon(onPressed: () {}, icon: Icon(Icons.add), label: Text('Adicionar'))`|
|`defaultStyleOf`|Retorna o estilo padrão para o `OutlinedButton` no tema atual.|`ButtonStyle style = OutlinedButton.defaultStyleOf(context);`|
|`themeStyle`|Aplica o estilo do tema atual ao `OutlinedButton`.|`style: OutlinedButton.themeStyle(context)`|

### Detalhamento dos Métodos

- **`styleFrom`**: Facilita a criação de estilos personalizados sem a necessidade de definir todas as propriedades manualmente.
    
    ```dart
    style: OutlinedButton.styleFrom(
      primary: Colors.green,
      side: BorderSide(color: Colors.green, width: 2),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
    )
    ```
    
- **`icon`**: Método construtor que permite incluir um ícone juntamente com o texto no botão, seguindo uma disposição específica.
    
    ```dart
    OutlinedButton.icon(
      onPressed: () {},
      icon: Icon(Icons.add),
      label: Text('Adicionar'),
    )
    ```
    
- **`defaultStyleOf`**: Permite obter o estilo padrão aplicado ao `OutlinedButton` com base no tema atual, útil para criar estilos derivados.
    
    ```dart
    ButtonStyle estiloPadrao = OutlinedButton.defaultStyleOf(context);
    ```
    
- **`themeStyle`**: Integra o estilo do botão com o tema da aplicação, garantindo consistência visual.
    
    ```dart
    style: OutlinedButton.themeStyle(context),
    ```
    

## Categoria de Widget

O `OutlinedButton` se encaixa em várias categorias de widgets dentro do ecossistema Flutter, conforme descrito abaixo:

|**Categoria**|**Descrição**|
|---|---|
|**Material Components**|Faz parte dos componentes de Material Design, seguindo as diretrizes visuais e interativas do Material.|
|**Input**|Atua como um elemento de entrada ao receber interações do usuário para executar ações.|
|**Interaction Models**|Gerencia interações como cliques e pressionamentos longos, respondendo com callbacks definidos.|
|**Styling**|Altamente personalizável em termos de aparência, incluindo cores, bordas e tipografia.|
|**Accessibility**|Pode ser configurado para suportar recursos de acessibilidade, como foco automático e leitores de tela.|

## Exemplos de Código

A seguir, apresentamos exemplos práticos de como utilizar o `OutlinedButton` em diferentes cenários.

### Exemplo 1: Botão Básico

```dart
OutlinedButton(
  onPressed: () {
    print('Botão básico pressionado');
  },
  child: Text('Clique Aqui'),
)
```

### Exemplo 2: Botão com Ícone

```dart
OutlinedButton.icon(
  onPressed: () {
    print('Botão com ícone pressionado');
  },
  icon: Icon(Icons.add),
  label: Text('Adicionar'),
)
```

### Exemplo 3: Botão Personalizado

```dart
OutlinedButton(
  onPressed: () {},
  style: OutlinedButton.styleFrom(
    primary: Colors.white,
    backgroundColor: Colors.blue,
    side: BorderSide(color: Colors.blue, width: 2),
    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  child: Text('Personalizado'),
)
```

### Exemplo 4: Botão Desabilitado

```dart
OutlinedButton(
  onPressed: null, // Botão desabilitado
  child: Text('Desabilitado'),
)
```

### Exemplo 5: Botão com Ação de Longa Pressão

```dart
OutlinedButton(
  onPressed: () {
    print('Botão pressionado');
  },
  onLongPress: () {
    print('Botão pressionado por um longo período');
  },
  child: Text('Pressione'),
)
```

### Exemplo 6: Botão com Foco Automático

```dart
OutlinedButton(
  onPressed: () {},
  autofocus: true,
  child: Text('Autofocus'),
)
```

### Exemplo 7: Botão com Alteração de Cor ao Hover (Web)

```dart
OutlinedButton(
  onPressed: () {},
  style: ButtonStyle(
    side: MaterialStateProperty.resolveWith<BorderSide>((states) {
      if (states.contains(MaterialState.hovered)) {
        return BorderSide(color: Colors.red, width: 2);
      }
      return BorderSide(color: Colors.blue, width: 2);
    }),
    foregroundColor: MaterialStateProperty.all(Colors.blue),
  ),
  child: Text('Hover Me'),
)
```

## Considerações Finais

O `OutlinedButton` é uma ferramenta poderosa para criar interfaces de usuário elegantes e funcionais no Flutter. Sua flexibilidade permite adaptações para diversos cenários, desde ações secundárias até interações complexas com o usuário.

### Boas Práticas

- **Consistência Visual**: Mantenha a consistência no uso de botões em toda a aplicação para garantir uma experiência de usuário coesa.
- **Acessibilidade**: Certifique-se de que os botões possuem tamanhos adequados e contrastes de cores que facilitem a legibilidade e interação.
- **Feedback ao Usuário**: Utilize estados visuais como hover e focus para fornecer feedback imediato ao usuário sobre suas interações.
- **Responsividade**: Adapte o design dos botões para diferentes tamanhos de tela, garantindo usabilidade em dispositivos variados.

### Recursos Adicionais

- [Documentação Oficial do OutlinedButton](https://api.flutter.dev/flutter/material/OutlinedButton-class.html)
- [Guia de Botões no Flutter](https://flutter.dev/docs/development/ui/widgets/material#buttons)

**Nota:** Sempre teste os botões em diferentes dispositivos e cenários para garantir que funcionam conforme o esperado e proporcionam uma boa experiência ao usuário.