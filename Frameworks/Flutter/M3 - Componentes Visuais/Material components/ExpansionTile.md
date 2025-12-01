
## Introdução

O **`ExpansionTile`** é um widget amplamente utilizado no Flutter para criar listas expansíveis, onde cada item pode ser expandido ou colapsado para revelar ou ocultar conteúdo adicional. Esse recurso é particularmente útil em interfaces que necessitam organizar informações de forma hierárquica ou em listas que demandam uma navegação mais dinâmica e interativa.

### Sumário

1. [O que é e para que serve?](#o-que-é-e-para-que-serve)
2. [Como funciona?](#como-funciona)
3. [Sintaxe de Uso](#sintaxe-de-uso)
4. [Restrições de Uso](#restrições-de-uso)
5. [Quando Utilizar?](#quando-utilizar)
6. [Propriedades do `ExpansionTile`](#propriedades-do-expansiontile)
7. [Principais Métodos](#principais-métodos)
8. [Categorias de Widget](#categorias-de-widget)
9. [Exemplos de Uso](#exemplos-de-uso)
10. [Considerações Finais](#considerações-finais)

---

## O que é e para que serve?

### O que é?

**`ExpansionTile`** é um widget do Flutter que cria um item de lista que pode ser expandido ou colapsado para mostrar ou ocultar widgets filhos. Ele é geralmente utilizado dentro de listas, como **`ListView`**, para organizar conteúdos de forma compacta e acessível.

### Para que serve?

Serve para criar interfaces mais organizadas e interativas, permitindo que os usuários revelem apenas as informações necessárias no momento, reduzindo a sobrecarga visual e melhorando a experiência de navegação.

**Exemplos de uso:**

- Menus de navegação em aplicativos.
- Listas de FAQs (Perguntas Frequentes).
- Painéis de configurações onde várias opções são agrupadas.
- Listas de categorias com subcategorias.

---

## Como funciona?

O **`ExpansionTile`** funciona como um **`ListTile`** que pode ser expandido ou colapsado. Quando o usuário interage com o tile (geralmente tocando nele), o widget expande para revelar os widgets filhos definidos, e ao interagir novamente, ele colapsa para ocultá-los.

**Componentes principais:**

- **Título:** Sempre visível, representa a descrição principal do tile.
- **Ícone de expansão:** Indica o estado atual (expandido ou colapsado) e permite a identificação visual da ação.
- **Conteúdo expandido:** Widgets que são exibidos quando o tile está expandido.

O **`ExpansionTile`** também suporta animações suaves durante a transição entre os estados expandido e colapsado, melhorando a fluidez da interface.

---

## Sintaxe de Uso

A utilização do **`ExpansionTile`** envolve a definição de diversos parâmetros que controlam seu comportamento e aparência. A seguir, apresentamos a sintaxe básica e uma descrição detalhada de cada parâmetro.

### Exemplo Básico

```dart
ExpansionTile(
  title: Text('Título do Tile'),
  children: <Widget>[
    ListTile(title: Text('Sub-item 1')),
    ListTile(title: Text('Sub-item 2')),
  ],
)
```

### Parâmetros Detalhados

O **`ExpansionTile`** aceita diversos parâmetros que permitem personalizar seu funcionamento e estilo. Abaixo, descrevemos cada um deles:

- **`key`**: (Opcional) Chave para identificar de forma única o widget na árvore de widgets.
- **`leading`**: (Opcional) Widget exibido antes do título, geralmente um ícone.
- **`title`**: (Obrigatório) Widget que representa o título principal do tile.
- **`subtitle`**: (Opcional) Widget exibido abaixo do título, geralmente um texto secundário.
- **`trailing`**: (Opcional) Widget exibido após o título, substituindo o ícone de expansão padrão.
- **`children`**: (Opcional) Lista de widgets que serão exibidos quando o tile estiver expandido.
- **`onExpansionChanged`**: (Opcional) Callback acionado quando o estado de expansão muda.
- **`backgroundColor`**: (Opcional) Cor de fundo do tile quando está expandido.
- **`collapsedBackgroundColor`**: (Opcional) Cor de fundo do tile quando está colapsado.
- **`childrenPadding`**: (Opcional) Padding aplicado aos widgets filhos.
- **`expandedCrossAxisAlignment`**: (Opcional) Alinhamento transversal dos widgets filhos.
- **`expandedAlignment`**: (Opcional) Alinhamento dos widgets filhos no eixo principal.
- **`initiallyExpanded`**: (Opcional) Define se o tile está expandido inicialmente.
- **`maintainState`**: (Opcional) Mantém o estado dos filhos quando o tile está colapsado.
- **`controlAffinity`**: (Opcional) Define onde o controle de expansão é exibido (início ou final).

### Tipos de Parâmetros

- **Widgets**: `leading`, `title`, `subtitle`, `trailing`, `children`.
- **Funções/Callbacks**: `onExpansionChanged`.
- **Cores**: `backgroundColor`, `collapsedBackgroundColor`.
- **Padding e Alinhamento**: `childrenPadding`, `expandedCrossAxisAlignment`, `expandedAlignment`.
- **Booleanos**: `initiallyExpanded`, `maintainState`.
- **Enumerações**: `controlAffinity`.

---

## Restrições de Uso

Embora o **`ExpansionTile`** seja bastante versátil, existem algumas considerações e restrições a serem observadas:

1. **Performance em Listas Grandes**: Em listas com um grande número de itens expansíveis, pode haver impacto na performance. Nesses casos, considere o uso de widgets otimizados como **`ListView.builder`**.

2. **Estado Persistente**: O **`ExpansionTile`** gerencia seu estado internamente. Se for necessário um controle mais granular ou persistente do estado de expansão, pode ser necessário implementar uma solução personalizada.

3. **Aninhamento de ExpansionTiles**: Embora seja possível aninhar **`ExpansionTile`** dentro de outros **`ExpansionTile`**, isso pode complicar a interface e afetar a usabilidade se não for bem implementado.

4. **Interação com Outros Widgets de Lista**: Deve-se ter cuidado ao combinar **`ExpansionTile`** com outros widgets de interação na lista para evitar conflitos de gestos.

---

## Quando Utilizar?

Utilize o **`ExpansionTile`** quando:

- **Organização de Conteúdo Hierárquico**: Quando há necessidade de exibir informações em níveis, permitindo que o usuário expanda itens para revelar detalhes.

- **Economia de Espaço na UI**: Quando se deseja manter a interface limpa e compacta, exibindo apenas o essencial e permitindo a expansão conforme a necessidade.

- **Listas de Navegação Complexas**: Em menus de aplicativos onde diversas opções e sub-opções precisam ser acessíveis sem sobrecarregar a tela.

- **Apresentação de Dados Dinâmicos**: Quando os dados são carregados sob demanda, e a expansão do tile pode acionar a busca ou carregamento de informações adicionais.

---

## Propriedades do `ExpansionTile`

A seguir, apresentamos uma tabela completa com todas as propriedades disponíveis no **`ExpansionTile`**, suas descrições e exemplos de sintaxe de uso.

| **Propriedade**             | **Descrição**                                                                 | **Sintaxe de Uso**                        |
|-----------------------------|-------------------------------------------------------------------------------|-------------------------------------------|
| `key`                       | Chave para identificar de forma única o widget na árvore de widgets.         | `Key('unique_key')`                       |
| `leading`                   | Widget exibido antes do título, geralmente um ícone.                         | `leading: Icon(Icons.info)`               |
| `title`                     | Widget que representa o título principal do tile.                            | `title: Text('Título')`                   |
| `subtitle`                  | Widget exibido abaixo do título, geralmente um texto secundário.             | `subtitle: Text('Subtítulo')`             |
| `trailing`                  | Widget exibido após o título, substituindo o ícone de expansão padrão.       | `trailing: Icon(Icons.arrow_forward)`     |
| `children`                  | Lista de widgets exibidos quando o tile está expandido.                      | `children: [ListTile(title: Text('Item'))]`|
| `onExpansionChanged`        | Callback acionado quando o estado de expansão muda.                         | `onExpansionChanged: (bool expanded) {}`  |
| `backgroundColor`           | Cor de fundo do tile quando está expandido.                                  | `backgroundColor: Colors.blue.shade50`    |
| `collapsedBackgroundColor`  | Cor de fundo do tile quando está colapsado.                                 | `collapsedBackgroundColor: Colors.white`  |
| `childrenPadding`           | Padding aplicado aos widgets filhos.                                         | `childrenPadding: EdgeInsets.all(16.0)`   |
| `expandedCrossAxisAlignment`| Alinhamento transversal dos widgets filhos.                                  | `expandedCrossAxisAlignment: CrossAxisAlignment.start` |
| `expandedAlignment`         | Alinhamento dos widgets filhos no eixo principal.                            | `expandedAlignment: Alignment.topLeft`     |
| `initiallyExpanded`         | Define se o tile está expandido inicialmente.                                | `initiallyExpanded: true`                 |
| `maintainState`             | Mantém o estado dos filhos quando o tile está colapsado.                     | `maintainState: true`                     |
| `controlAffinity`           | Define onde o controle de expansão é exibido (início ou final).              | `controlAffinity: ListTileControlAffinity.leading` |

---

## Principais Métodos

O **`ExpansionTile`** é um widget, e como tal, não possui métodos próprios além dos métodos herdados da classe **`StatefulWidget`** e de **`Widget`**. No entanto, podemos destacar alguns métodos relacionados ao gerenciamento de seu estado e interações:

| **Método**          | **Descrição**                                         | **Sintaxe de Uso**                              |
|---------------------|-------------------------------------------------------|-------------------------------------------------|
| `initState`         | Inicializa o estado do widget antes da construção.    | `@override void initState() { super.initState(); }` |
| `dispose`           | Limpa recursos quando o widget é removido.           | `@override void dispose() { super.dispose(); }` |
| `didChangeDependencies` | Reage a mudanças nas dependências do widget.      | `@override void didChangeDependencies() { super.didChangeDependencies(); }` |
| `build`             | Constrói a interface do widget.                       | `@override Widget build(BuildContext context) { return ExpansionTile(...); }` |
| `setState`          | Atualiza o estado interno do widget.                  | `setState(() { /* atualiza propriedades */ });` |

**Observação:** Como **`ExpansionTile`** gerencia seu próprio estado de expansão internamente, não há métodos públicos adicionais para controlar diretamente o estado de expansão fora do uso de callbacks como `onExpansionChanged`.

---

## Categorias de Widget

O **`ExpansionTile`** se encaixa em várias categorias de widgets no Flutter devido à sua funcionalidade e aplicação. A seguir, listamos as categorias mais relevantes:

- **Material Components**: Faz parte da biblioteca de componentes de design Material do Flutter, seguindo as diretrizes de Material Design.
- **Layout**: Utilizado para organizar a estrutura e o posicionamento dos widgets filhos.
- **Interaction Models**: Facilita a interação do usuário com a interface, permitindo expandir e colapsar conteúdos.
- **Animation & Motion**: Incorpora animações suaves durante a transição de expansão e colapso.
- **Styling**: Permite a personalização visual através de propriedades como cores e alinhamentos.
- **Text**: Envolve a utilização de widgets de texto para títulos e subtítulos.

---

## Exemplos de Uso

### Exemplo 1: Lista Simples de ExpansionTiles

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Exemplo ExpansionTile',
        home: Scaffold(
          appBar: AppBar(title: Text('ExpansionTile Exemplo')),
          body: ListView(
            children: <Widget>[
              ExpansionTile(
                leading: Icon(Icons.account_circle),
                title: Text('Perfil'),
                subtitle: Text('Clique para ver mais'),
                children: <Widget>[
                  ListTile(title: Text('Nome: João Silva')),
                  ListTile(title: Text('Email: joao@example.com')),
                ],
              ),
              ExpansionTile(
                leading: Icon(Icons.settings),
                title: Text('Configurações'),
                children: <Widget>[
                  ListTile(title: Text('Notificações')),
                  ListTile(title: Text('Privacidade')),
                ],
              ),
            ],
          ),
        ));
  }
}
```

### Exemplo 2: ExpansionTile com Callbacks e Personalizações

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  final GlobalKey<ExpansionTileState> expansionTileKey = GlobalKey<ExpansionTileState>();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ExpansionTile Personalizado',
      home: Scaffold(
        appBar: AppBar(title: Text('Personalização do ExpansionTile')),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ExpansionTile(
            key: expansionTileKey,
            leading: Icon(Icons.folder),
            title: Text('Documentos'),
            subtitle: Text('Clique para expandir'),
            initiallyExpanded: false,
            backgroundColor: Colors.blue.shade50,
            collapsedBackgroundColor: Colors.white,
            childrenPadding: EdgeInsets.symmetric(horizontal: 16.0),
            onExpansionChanged: (bool expanded) {
              print('ExpansionTile está ${expanded ? 'expandido' : 'colapsado'}.');
            },
            children: <Widget>[
              ListTile(
                leading: Icon(Icons.insert_drive_file),
                title: Text('Relatório.pdf'),
              ),
              ListTile(
                leading: Icon(Icons.insert_drive_file),
                title: Text('Foto.png'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## Considerações Finais

O **`ExpansionTile`** é uma ferramenta poderosa para criar interfaces organizadas e interativas no Flutter. Sua capacidade de expandir e colapsar conteúdos facilita a criação de listas hierárquicas e menus dinâmicos, melhorando significativamente a experiência do usuário.

Ao utilizar o **`ExpansionTile`**, é importante considerar aspectos de usabilidade e performance, especialmente em listas grandes ou em interfaces complexas. Personalizações adicionais, como animações e estilos, podem ser implementadas para alinhar o widget às necessidades específicas do seu aplicativo.

**Dicas:**

- **Consistência Visual**: Mantenha um estilo consistente ao utilizar múltiplos **`ExpansionTile`** para garantir uma interface harmoniosa.
- **Feedback ao Usuário**: Utilize `onExpansionChanged` para fornecer feedback ou atualizar estados conforme o usuário interage com os tiles.
- **Acessibilidade**: Certifique-se de que os **`ExpansionTile`** sejam acessíveis, fornecendo descrições claras e ícones indicativos do estado de expansão.

Com essas considerações, o **`ExpansionTile`** pode ser implementado de forma eficaz para criar interfaces ricas e funcionais no Flutter.