
## Introdução

O `TextButton` é um componente do Flutter que representa um botão de texto simples, sem elevações ou bordas explícitas. Este tipo de botão é ideal para ações secundárias, links e situações onde o botão não precisa se destacar tanto quanto um `ElevatedButton` ou `OutlinedButton`. A simplicidade do `TextButton` permite um estilo visual limpo e adaptável, seguindo o padrão do Material Design.

---

## O que é e para que serve?

O `TextButton` é um botão leve que exibe apenas texto, sem bordas ou sombras. Ele é ideal para ações que não precisam se destacar visualmente, funcionando bem em locais onde uma ação secundária é desejada. Ele pode ser customizado para mudar de cor e estilo ao ser pressionado ou quando está desativado.

### Principais características

- **Visual leve:** Ideal para ações secundárias ou menos importantes.
- **Interação personalizável:** Possui propriedades que permitem mudar o estilo e o comportamento visual do botão.
- **Compatível com temas e estados:** O `TextButton` se adapta facilmente ao tema de cores e ao modo claro/escuro.

---

## Como funciona?

O `TextButton` é uma implementação de um botão no Flutter que permite adicionar texto e definir ações de toque. Ele utiliza um callback, o `onPressed`, para capturar a interação do usuário. Quando o botão é pressionado, o `onPressed` é disparado, executando a função definida.

### Exemplo de funcionamento

Ao pressionar o botão, ele executa a função definida no `onPressed`:

```dart
TextButton(
  onPressed: () {
    print("Botão pressionado!");
  },
  child: Text("Clique Aqui"),
)
```

Neste exemplo, ao pressionar o botão, a função `print` é executada, exibindo uma mensagem no console.

---

## Sintaxe de uso

Para utilizar o `TextButton`, basta definir o `onPressed` e o `child`:

```dart
TextButton(
  onPressed: () {
    // Ação a ser executada ao pressionar o botão
  },
  child: Text("Texto do Botão"),
)
```

### Personalização com estilos

Para customizar o botão, utilize o `style` e defina estilos específicos, como a cor do texto, da superfície ou da borda:

```dart
TextButton(
  onPressed: () {},
  style: TextButton.styleFrom(
    primary: Colors.blue, // Cor do texto
    backgroundColor: Colors.grey[200], // Cor de fundo
    padding: EdgeInsets.all(16.0),
  ),
  child: Text("Texto Estilizado"),
)
```

---

## Restrições de uso

- **Visibilidade reduzida**: Como o `TextButton` não tem bordas ou sombras, ele pode passar despercebido, especialmente em interfaces muito coloridas.
- **Callback obrigatório**: O botão não é interativo se `onPressed` for `null`. Isso faz com que o botão seja exibido em estado desabilitado.
- **Estilos limitados**: O `TextButton` é limitado a texto, então para botões com ícones ou mais destaque, considere `ElevatedButton` ou `OutlinedButton`.

---

## Quando utilizar?

O `TextButton` é indicado para ações secundárias ou links, sendo comumente usado para:

- Botões de "Cancelar" em diálogos.
- Links como "Esqueceu sua senha?".
- Botões de navegação em rodapés, onde a ação não deve chamar muita atenção.

---

## Propriedades

A tabela abaixo lista todas as propriedades do `TextButton`, com uma breve descrição e exemplos de uso.

| Propriedade        | Descrição                                                                                                                                          | Sintaxe de Uso                                                                                               |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `onPressed`        | Função callback executada ao pressionar o botão. Se `null`, o botão fica desabilitado.                                                              | `onPressed: () { print("Pressionado!"); }`                                                                   |
| `onLongPress`      | Função callback executada ao pressionar e segurar o botão.                                                                                          | `onLongPress: () { print("Pressionado longo!"); }`                                                           |
| `child`            | Widget que define o conteúdo do botão, geralmente um `Text`.                                                                                        | `child: Text("Botão")`                                                                                       |
| `style`            | Define o estilo do botão, incluindo cor, formato e comportamento visual.                                                                            | `style: TextButton.styleFrom(primary: Colors.red)`                                                           |
| `autofocus`        | Determina se o botão deve receber foco automaticamente.                                                                                             | `autofocus: true`                                                                                            |
| `clipBehavior`     | Define o comportamento de recorte do conteúdo do botão.                                                                                             | `clipBehavior: Clip.antiAlias`                                                                               |
| `focusNode`        | Especifica o `FocusNode` para o botão, permitindo controlar o foco manualmente.                                                                     | `focusNode: myFocusNode`                                                                                     |
| `key`              | Define uma chave única para o widget, útil para controle de estado em listas e árvores de widgets.                                                  | `key: Key("button1")`                                                                                        |

### Exemplo de uso das propriedades

```dart
TextButton(
  onPressed: () {
    print("Botão pressionado!");
  },
  onLongPress: () {
    print("Pressionado por mais tempo!");
  },
  style: TextButton.styleFrom(
    primary: Colors.white,
    backgroundColor: Colors.blue,
    padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
  ),
  child: Text("Clique Aqui"),
)
```

---

## Principais métodos

A tabela a seguir descreve os principais métodos da classe `TextButton` que podem ser úteis para manipulação e controle.

| Método               | Descrição                                                                                                    | Sintaxe de Uso                              |
|----------------------|--------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| `of(context)`        | Obtém o tema do botão baseado no contexto atual, permitindo acesso ao estilo e configuração do `TextButton`. | `TextButtonTheme.of(context)`               |
| `styleFrom`          | Método estático que cria um estilo para o `TextButton` baseado em parâmetros personalizados.                 | `TextButton.styleFrom(primary: Colors.red)` |

### Exemplo de uso de métodos

```dart
TextButton(
  onPressed: () {},
  style: TextButton.styleFrom(
    primary: Colors.black,
    backgroundColor: Colors.orangeAccent,
    padding: EdgeInsets.all(12.0),
  ),
  child: Text("Pressione Aqui"),
)
```

---

## Em quais categoria de widget mais se encaixa?

O `TextButton` se encaixa nas seguintes categorias de widgets:

- **Material Components**: Faz parte dos componentes de design do Material.
- **Input**: Serve como um widget de interação, capturando a ação do usuário.
- **Interaction Models**: Modela a interação de toque, permitindo que o usuário clique e execute uma ação.
- **Styling**: Possui opções de personalização para adaptar o estilo visual ao tema do aplicativo.

---

## Considerações Finais

O `TextButton` é uma excelente escolha para ações secundárias e links devido ao seu visual limpo e ao comportamento personalizável. Ele é fácil de usar, rápido de configurar e pode ser estilizado para atender às diretrizes do Material Design. Além disso, seu uso como um botão "leve" e a adaptação ao tema o tornam um componente essencial para desenvolver interfaces limpas e elegantes no Flutter.