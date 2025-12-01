
## Introdução

O **BottomAppBar** é um widget do Flutter que facilita a criação de barras de ferramentas na parte inferior do aplicativo. Ele é usado frequentemente em aplicativos que seguem o design **Material Design** para oferecer um espaço funcional e esteticamente agradável para botões de ação, menus ou outras ferramentas interativas.

Por padrão, o **BottomAppBar** pode conter ícones, botões, e até mesmo espaços vazios para um botão de ação flutuante (_FloatingActionButton_). Ele é altamente personalizável, permitindo que os desenvolvedores adaptem seu estilo e comportamento às necessidades do aplicativo.

---

## Sumário

1. [O que é e para que serve?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#o-que-%C3%A9-e-para-que-serve)
2. [Como funciona?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#como-funciona)
3. [Sintaxe de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#sintaxe-de-uso)
4. [Restrições de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#restri%C3%A7%C3%B5es-de-uso)
5. [Quando utilizar?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#quando-utilizar)
6. [Propriedades do BottomAppBar](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#propriedades-do-bottomappbar)
7. [Métodos do BottomAppBar](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#m%C3%A9todos-do-bottomappbar)
8. [Exemplo completo](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#exemplo-completo)
9. [Categoria do widget](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#categoria-do-widget)
10. [Conclusão](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#conclus%C3%A3o)

---

## O que é e para que serve?

O **BottomAppBar** é um componente visual usado para exibir uma barra na parte inferior da tela que pode conter ferramentas interativas, como:

- **Ícones de navegação** (menus, atalhos rápidos);
- **Botões de ação flutuante** (_FloatingActionButton_);
- **Botões padrão** com funções específicas.

Ele serve como uma alternativa ao uso de uma barra superior (_AppBar_), proporcionando um design mais moderno e orientado ao usuário.

### Principais usos:

- Criar uma barra de ferramentas na parte inferior.
- Suportar navegação com botões de menu.
- Integrar um botão de ação flutuante com uma aparência consistente.

---

## Como funciona?

O **BottomAppBar** funciona como um contêiner personalizável na parte inferior da interface do aplicativo. Ele aceita widgets como filhos e pode ser combinado com um **FloatingActionButton** para criar uma interface intuitiva. Através de suas propriedades, você pode:

- Adicionar widgets ao centro ou às laterais.
- Configurar a forma do recorte para acomodar botões flutuantes.
- Alterar o estilo da barra, como cores e elevações.

Internamente, ele utiliza o **Material Design** para aplicar padrões visuais consistentes, mas também permite personalizações avançadas.

---

## Sintaxe de uso

A sintaxe básica para criar um **BottomAppBar** é:

```dart
BottomAppBar({
  Key? key,
  Color? color,
  double? elevation,
  NotchedShape? shape,
  Clip clipBehavior = Clip.none,
  required Widget child,
})
```

### Descrição completa dos parâmetros:

|**Parâmetro**|**Descrição**|**Tipo**|**Obrigatório?**|
|---|---|---|---|
|**`key`**|Chave usada para identificar de forma única o widget.|`Key?`|Não|
|**`color`**|Define a cor de fundo da barra.|`Color?`|Não|
|**`elevation`**|Define a elevação da barra, afetando sua sombra.|`double?`|Não|
|**`shape`**|Define a forma do recorte na barra, como ao redor de um botão flutuante.|`NotchedShape?`|Não|
|**`clipBehavior`**|Define como a barra deve se comportar ao cortar seu conteúdo.|`Clip`|Não|
|**`child`**|Define o conteúdo dentro da barra. É onde os widgets, como ícones ou botões, são colocados.|`Widget`|Sim|

---

## Restrições de uso

- **Dependência do Material Design**: O BottomAppBar funciona melhor em aplicativos que seguem os princípios de design Material.
- **Compatibilidade com FloatingActionButton**: Embora opcional, o BottomAppBar é frequentemente usado com o FloatingActionButton, então pode ser necessário ajustá-lo para layouts diferentes.
- **Atenção à responsividade**: Certifique-se de que os widgets adicionados dentro do BottomAppBar se adaptem bem em dispositivos de tamanhos variados.

---

## Quando utilizar?

- **Aplicativos com foco em interatividade**: Onde botões e ícones na parte inferior facilitam o uso.
- **Interfaces orientadas por ações**: Quando o FloatingActionButton está presente e precisa de um suporte visual consistente.
- **Substituição de navegação superior**: Para uma navegação mais intuitiva e de fácil acesso.

---

## Propriedades do BottomAppBar

|**Propriedade**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|**`key`**|Identificador único para o widget.|`BottomAppBar(key: Key('uniqueKey'))`|
|**`color`**|Define a cor do fundo da barra.|`BottomAppBar(color: Colors.blue)`|
|**`elevation`**|Adiciona uma sombra abaixo da barra. Valores maiores criam sombras mais pronunciadas.|`BottomAppBar(elevation: 4.0)`|
|**`shape`**|Define o recorte na barra, geralmente para acomodar um botão de ação flutuante.|`BottomAppBar(shape: CircularNotchedRectangle())`|
|**`clipBehavior`**|Define como o conteúdo dentro da barra deve ser cortado. Valores aceitos: `Clip.none`, `Clip.hardEdge`, `Clip.antiAlias`, `Clip.antiAliasWithSaveLayer`.|`BottomAppBar(clipBehavior: Clip.antiAlias)`|
|**`child`**|Conteúdo da barra. Pode incluir widgets como Row, IconButton, etc.|`BottomAppBar(child: Row(children: [Icon(Icons.menu), Spacer(), Icon(Icons.search)]))`|

---

## Métodos do BottomAppBar

O **BottomAppBar** não possui métodos diretamente associados, pois é um widget de apresentação estática. As interações devem ser implementadas nos widgets filhos, como botões ou ícones adicionados no `child`.

---

## Exemplo completo

Aqui está um exemplo funcional de como usar o **BottomAppBar** com um **FloatingActionButton**:

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Exemplo de BottomAppBar')),
        body: Center(child: Text('Conteúdo da página')),
        bottomNavigationBar: BottomAppBar(
          color: Colors.blue,
          shape: CircularNotchedRectangle(),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              IconButton(
                icon: Icon(Icons.menu, color: Colors.white),
                onPressed: () {
                  print('Menu pressionado');
                },
              ),
              IconButton(
                icon: Icon(Icons.search, color: Colors.white),
                onPressed: () {
                  print('Busca pressionada');
                },
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            print('Ação flutuante pressionada');
          },
          child: Icon(Icons.add),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      ),
    );
  }
}
```

---

## Categoria do widget

|**Categoria**|**Descrição**|
|---|---|
|**Material Components**|O BottomAppBar é um componente de interface do Material Design.|

---

## Conclusão

O **BottomAppBar** é um widget poderoso e flexível para criar barras de ferramentas na parte inferior de aplicativos Flutter. Ele é ideal para interfaces que seguem o design Material, suportando botões flutuantes e widgets interativos. Sua personalização e simplicidade o tornam uma escolha popular para aprimorar a usabilidade de aplicativos.

Ao combiná-lo com outros widgets como **FloatingActionButton** e **IconButton**, você pode criar interfaces modernas e funcionais de maneira eficiente.