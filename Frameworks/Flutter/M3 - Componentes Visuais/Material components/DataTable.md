
## Introdução

No desenvolvimento de aplicativos Flutter, a apresentação de dados de forma organizada e interativa é fundamental para proporcionar uma boa experiência ao usuário. O widget **DataTable** é uma ferramenta poderosa para exibir informações tabulares, permitindo a visualização clara e estruturada de conjuntos de dados. Este guia detalhado abordará todos os aspectos do **DataTable**, desde sua finalidade até a utilização avançada, incluindo exemplos práticos em Português do Brasil.

## Sumário

1. [O que é e para que serve?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#o-que-%C3%A9-e-para-que-serve)
2. [Como funciona?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#como-funciona)
3. [Sintaxe de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#sintaxe-de-uso)
    - [Parâmetros](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#par%C3%A2metros)
4. [Restrições de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#restri%C3%A7%C3%B5es-de-uso)
5. [Quando utilizar?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#quando-utilizar)
6. [Propriedades do DataTable](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#propriedades-do-datatable)
7. [Métodos do DataTable](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#m%C3%A9todos-do-datatable)
8. [Categorias de Widget](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#categorias-de-widget)
9. [Exemplos de código](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#exemplos-de-c%C3%B3digo)
10. [Considerações finais](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#considera%C3%A7%C3%B5es-finais)
11. [Referências](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb?model=o1-mini#refer%C3%AAncias)

## O que é e para que serve?

O **DataTable** é um widget do Flutter que permite exibir dados em formato tabular. Ele é ideal para apresentar grandes conjuntos de informações de maneira organizada, facilitando a leitura e a interação do usuário com os dados. Com suporte a ordenação, seleção e paginação, o **DataTable** é amplamente utilizado em aplicativos que requerem exibição detalhada de informações, como sistemas de gerenciamento, dashboards e aplicativos de negócios.

**Finalidades principais:**

- **Organização de Dados:** Apresenta dados de forma estruturada em linhas e colunas.
- **Interatividade:** Permite ordenação e seleção de linhas.
- **Personalização:** Estilização avançada para atender às necessidades visuais do aplicativo.
- **Escalabilidade:** Suporta grandes volumes de dados com performance otimizada.

## Como funciona?

O **DataTable** funciona através da definição de colunas e linhas. As colunas são representadas por **DataColumn** e as linhas por **DataRow**, que contêm **DataCell** para cada célula da tabela. O widget gerencia automaticamente a disposição das células, e, com a ajuda de funcionalidades adicionais, pode fornecer interatividade como ordenação e seleção.

**Estrutura básica:**

```dart
DataTable(
  columns: <DataColumn>[
    DataColumn(label: Text('Nome')),
    DataColumn(label: Text('Idade')),
    DataColumn(label: Text('Profissão')),
  ],
  rows: <DataRow>[
    DataRow(cells: <DataCell>[
      DataCell(Text('João')),
      DataCell(Text('25')),
      DataCell(Text('Engenheiro')),
    ]),
    DataRow(cells: <DataCell>[
      DataCell(Text('Maria')),
      DataCell(Text('30')),
      DataCell(Text('Médica')),
    ]),
  ],
);
```

Neste exemplo, criamos uma tabela com três colunas: Nome, Idade e Profissão, e duas linhas com os dados correspondentes.

## Sintaxe de uso

A sintaxe do **DataTable** envolve a definição de colunas e linhas, além de diversas propriedades que controlam seu comportamento e aparência.

### Estrutura Básica

```dart
DataTable({
  Key? key,
  required List<DataColumn> columns,
  required List<DataRow> rows,
  bool sortAscending = true,
  int? sortColumnIndex,
  bool showCheckboxColumn = true,
  Color? dataRowColor,
  DataRowHeight? dataRowHeight,
  Decoration? decoration,
  double? columnSpacing,
  double? horizontalMargin,
  // Outras propriedades opcionais
});
```

### Descrição Detalhada dos Parâmetros

#### Parâmetros Obrigatórios

- **`columns`** (`List<DataColumn>`): Lista de colunas da tabela. Cada coluna é definida por um objeto **DataColumn**.
    
- **`rows`** (`List<DataRow>`): Lista de linhas da tabela. Cada linha é definida por um objeto **DataRow**, que contém **DataCell**.
    

#### Parâmetros Opcionais

- **`sortAscending`** (`bool`): Define a ordem de ordenação das colunas. Padrão é `true` (ascendente).
    
- **`sortColumnIndex`** (`int?`): Índice da coluna atualmente ordenada.
    
- **`showCheckboxColumn`** (`bool`): Define se a tabela deve exibir uma coluna de checkboxes para seleção de linhas. Padrão é `true`.
    
- **`dataRowColor`** (`Color?`): Cor de fundo das linhas de dados.
    
- **`dataRowHeight`** (`double?`): Altura das linhas de dados.
    
- **`decoration`** (`Decoration?`): Decoração aplicada à tabela.
    
- **`columnSpacing`** (`double?`): Espaçamento horizontal entre as colunas.
    
- **`horizontalMargin`** (`double?`): Margem horizontal das células.
    
- **`headingRowColor`** (`MaterialStateProperty<Color?>?`): Cor de fundo da linha de cabeçalho.
    
- **`headingRowHeight`** (`double?`): Altura da linha de cabeçalho.
    
- **`dividerThickness`** (`double?`): Espessura dos divisores entre linhas e colunas.
    
- **`dataTextStyle`** (`TextStyle?`): Estilo do texto nas células de dados.
    
- **`headingTextStyle`** (`TextStyle?`): Estilo do texto nas células de cabeçalho.
    
- **`checkboxHorizontalMargin`** (`double?`): Margem horizontal dos checkboxes.
    
- **`showBottomBorder`** (`bool`): Define se a tabela deve exibir uma borda inferior. Padrão é `false`.
    
- **`border`** (`TableBorder?`): Borda personalizada para a tabela.
    

## Restrições de uso

Embora o **DataTable** seja altamente versátil, há algumas restrições e considerações a serem levadas em conta:

- **Performance com Grandes Conjuntos de Dados:** O **DataTable** não é ideal para exibir milhares de linhas, pois pode afetar a performance. Para grandes conjuntos de dados, considere usar o **PaginatedDataTable** ou outras soluções de paginação.
    
- **Responsividade:** O **DataTable** pode não se ajustar bem a todos os tamanhos de tela, especialmente em dispositivos móveis com telas menores. É importante implementar responsividade ou utilizar widgets complementares para melhorar a experiência do usuário.
    
- **Personalização Avançada:** Embora permita personalização básica, para estilizações mais complexas pode ser necessário recorrer a widgets personalizados ou combinar o **DataTable** com outros widgets.
    
- **Interatividade Limitada:** Funcionalidades como edição inline não são suportadas nativamente e exigem implementação adicional.
    

## Quando utilizar?

O **DataTable** é mais adequado para situações onde é necessário:

- **Exibir Dados Tabulares:** Como listas de produtos, registros de usuários, históricos de transações, etc.
    
- **Interatividade Básica:** Quando é necessário permitir que o usuário ordene ou selecione linhas.
    
- **Organização Estruturada:** Quando os dados precisam ser apresentados de forma clara e organizada, facilitando a leitura e compreensão.
    

**Exemplos de uso:**

- **Aplicativos de Gestão:** Sistemas de gerenciamento de estoque, CRM, etc.
    
- **Dashboards de Análise:** Apresentação de métricas e estatísticas em formato tabular.
    
- **Formulários de Dados:** Exibição de dados inseridos pelo usuário em forma de tabela.
    

## Propriedades do DataTable

A seguir, uma tabela detalhada com todas as propriedades do **DataTable**, suas descrições e sintaxes de uso.

|Propriedade|Descrição|Sintaxe de Uso|
|---|---|---|
|`columns`|Define as colunas da tabela, cada uma representada por um **DataColumn**.|`columns: <DataColumn>[...]`|
|`rows`|Define as linhas da tabela, cada uma representada por um **DataRow**.|`rows: <DataRow>[...]`|
|`sortAscending`|Define se a ordenação é ascendente (`true`) ou descendente (`false`).|`sortAscending: true`|
|`sortColumnIndex`|Índice da coluna atualmente ordenada.|`sortColumnIndex: 0`|
|`showCheckboxColumn`|Define se deve exibir uma coluna de checkboxes para seleção de linhas.|`showCheckboxColumn: true`|
|`dataRowColor`|Cor de fundo das linhas de dados.|`dataRowColor: Colors.grey[200]`|
|`dataRowHeight`|Altura das linhas de dados.|`dataRowHeight: 56.0`|
|`decoration`|Decoração aplicada à tabela.|`decoration: BoxDecoration(...)`|
|`columnSpacing`|Espaçamento horizontal entre as colunas.|`columnSpacing: 56.0`|
|`horizontalMargin`|Margem horizontal das células.|`horizontalMargin: 24.0`|
|`headingRowColor`|Cor de fundo da linha de cabeçalho.|`headingRowColor: MaterialStateProperty.all(Colors.blue)`|
|`headingRowHeight`|Altura da linha de cabeçalho.|`headingRowHeight: 56.0`|
|`dividerThickness`|Espessura dos divisores entre linhas e colunas.|`dividerThickness: 1.0`|
|`dataTextStyle`|Estilo do texto nas células de dados.|`dataTextStyle: TextStyle(fontSize: 14.0)`|
|`headingTextStyle`|Estilo do texto nas células de cabeçalho.|`headingTextStyle: TextStyle(fontWeight: FontWeight.bold)`|
|`checkboxHorizontalMargin`|Margem horizontal dos checkboxes.|`checkboxHorizontalMargin: 16.0`|
|`showBottomBorder`|Define se a tabela deve exibir uma borda inferior.|`showBottomBorder: true`|
|`border`|Borda personalizada para a tabela.|`border: TableBorder.all(color: Colors.black)`|

## Métodos do DataTable

O **DataTable** possui alguns métodos que permitem interagir e manipular a tabela de forma programática. Abaixo, listamos os métodos disponíveis com suas descrições e sintaxes de uso.

|Método|Descrição|Sintaxe de Uso|
|---|---|---|
|`setState`|Atualiza o estado da tabela, permitindo re-renderizações com novos dados ou configurações.|`setState(() { /* Atualizações */ })`|
|`sort`|Ordena as linhas da tabela com base em uma função de comparação.|`sort((a, b) => a.compareTo(b))`|
|`selectAll`|Seleciona todas as linhas da tabela.|`selectAll()`|
|`clearSelection`|Limpa todas as seleções de linhas.|`clearSelection()`|
|`addRow`|Adiciona uma nova linha à tabela.|`addRow(DataRow(...))`|
|`removeRow`|Remove uma linha específica da tabela.|`removeRow(DataRow(...))`|
|`updateRow`|Atualiza uma linha existente na tabela.|`updateRow(int index, DataRow row)`|
|`getSelectedRows`|Retorna as linhas que estão atualmente selecionadas.|`getSelectedRows()`|

**Observação:** Muitos desses métodos, como `addRow`, `removeRow`, e `updateRow`, não são métodos nativos do **DataTable**, mas são implementados através da gestão do estado do widget pai que controla as linhas da tabela. O **DataTable** em si é um widget imutável e, portanto, suas linhas e colunas devem ser gerenciadas externamente.

## Categorias de Widget

O **DataTable** pertence a diversas categorias de widgets no Flutter, sendo relevante em várias áreas devido à sua funcionalidade e flexibilidade.

|Categoria|Descrição|
|---|---|
|**Material Components**|Faz parte dos componentes de Material Design, seguindo as diretrizes visuais do Flutter.|
|**Layout**|Atua como um widget de layout, organizando seus filhos em uma estrutura tabular.|
|**Styling**|Permite personalizações de estilo como cores, bordas e espaçamentos.|
|**Interaction Models**|Suporta interações como seleção e ordenação de linhas.|
|**Accessibility**|Suporta acessibilidade, permitindo que leitores de tela interpretem corretamente os dados exibidos.|

## Exemplos de código

A seguir, apresentamos exemplos práticos de como implementar e personalizar um **DataTable** no Flutter.

### Exemplo Básico de DataTable

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Exemplo DataTable',
        home: Scaffold(
          appBar: AppBar(title: Text('DataTable Exemplo')),
          body: MyDataTable(),
        ));
  }
}

class MyDataTable extends StatefulWidget {
  @override
  _MyDataTableState createState() => _MyDataTableState();
}

class _MyDataTableState extends State<MyDataTable> {
  // Dados de exemplo
  final List<Map<String, dynamic>> _users = [
    {"nome": "João", "idade": 25, "profissao": "Engenheiro"},
    {"nome": "Maria", "idade": 30, "profissao": "Médica"},
    {"nome": "Pedro", "idade": 28, "profissao": "Designer"},
  ];

  bool _sortAscending = true;
  int? _sortColumnIndex;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: DataTable(
          columns: [
            DataColumn(
                label: Text('Nome'),
                onSort: (columnIndex, ascending) {
                  _sort<String>((user) => user['nome'], ascending);
                  setState(() {
                    _sortColumnIndex = columnIndex;
                    _sortAscending = ascending;
                  });
                }),
            DataColumn(
                label: Text('Idade'),
                numeric: true,
                onSort: (columnIndex, ascending) {
                  _sort<num>((user) => user['idade'], ascending);
                  setState(() {
                    _sortColumnIndex = columnIndex;
                    _sortAscending = ascending;
                  });
                }),
            DataColumn(label: Text('Profissão')),
          ],
          rows: _users
              .map(
                (user) => DataRow(cells: [
                  DataCell(Text(user['nome'])),
                  DataCell(Text(user['idade'].toString())),
                  DataCell(Text(user['profissao'])),
                ]),
              )
              .toList(),
          sortAscending: _sortAscending,
          sortColumnIndex: _sortColumnIndex,
        ));
  }

  void _sort<T>(
      Comparable<T> Function(Map<String, dynamic> user) getField, bool ascending) {
    _users.sort((a, b) {
      if (!ascending) {
        final Map<String, dynamic> c = a;
        a = b;
        b = c;
      }
      Comparable<T> aValue = getField(a);
      Comparable<T> bValue = getField(b);
      return Comparable.compare(aValue, bValue);
    });
  }
}
```

**Descrição do Código:**

1. **Estrutura Básica:** O aplicativo possui um **DataTable** dentro de um **SingleChildScrollView** para permitir a rolagem vertical caso a tabela exceda a altura da tela.
    
2. **Definição de Colunas:** Três colunas são definidas: Nome, Idade e Profissão. As colunas Nome e Idade possuem funcionalidade de ordenação (`onSort`).
    
3. **Definição de Linhas:** As linhas são geradas a partir da lista `_users`, mapeando cada usuário para uma **DataRow** com **DataCell** correspondentes.
    
4. **Ordenação:** O método `_sort` permite ordenar os dados com base na coluna selecionada, atualizando o estado para refletir a ordenação na interface.
    

### Exemplo Avançado com Personalização

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'DataTable Avançado',
        home: Scaffold(
          appBar: AppBar(title: Text('DataTable Personalizado')),
          body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: CustomDataTable(),
          ),
        ));
  }
}

class CustomDataTable extends StatefulWidget {
  @override
  _CustomDataTableState createState() => _CustomDataTableState();
}

class _CustomDataTableState extends State<CustomDataTable> {
  final List<Map<String, dynamic>> _products = [
    {"nome": "Laptop", "preco": 3500.00, "estoque": 15},
    {"nome": "Smartphone", "preco": 2500.00, "estoque": 30},
    {"nome": "Tablet", "preco": 1800.00, "estoque": 20},
  ];

  bool _sortAscending = true;
  int? _sortColumnIndex;

  @override
  Widget build(BuildContext context) {
    return DataTable(
      columns: [
        DataColumn(
            label: Text('Produto',
                style: TextStyle(fontWeight: FontWeight.bold)),
            onSort: (columnIndex, ascending) {
              _sort<String>((product) => product['nome'], ascending);
              setState(() {
                _sortColumnIndex = columnIndex;
                _sortAscending = ascending;
              });
            }),
        DataColumn(
            label: Text('Preço',
                style: TextStyle(fontWeight: FontWeight.bold)),
            numeric: true,
            onSort: (columnIndex, ascending) {
              _sort<num>((product) => product['preco'], ascending);
              setState(() {
                _sortColumnIndex = columnIndex;
                _sortAscending = ascending;
              });
            }),
        DataColumn(
            label: Text('Estoque',
                style: TextStyle(fontWeight: FontWeight.bold)),
            numeric: true,
            onSort: (columnIndex, ascending) {
              _sort<num>((product) => product['estoque'], ascending);
              setState(() {
                _sortColumnIndex = columnIndex;
                _sortAscending = ascending;
              });
            }),
      ],
      rows: _products
          .map(
            (product) => DataRow(cells: [
              DataCell(Text(product['nome']),
                  showEditIcon: true,
                  onTap: () {
                    // Ação ao clicar na célula
                  }),
              DataCell(Text('R\$ ${product['preco'].toStringAsFixed(2)}'),
                  placeholder: true),
              DataCell(Text(product['estoque'].toString())),
            ]),
          )
          .toList(),
      sortAscending: _sortAscending,
      sortColumnIndex: _sortColumnIndex,
      showCheckboxColumn: false,
      headingRowColor:
          MaterialStateProperty.all(Colors.blueGrey[50]),
      dataRowColor:
          MaterialStateProperty.resolveWith<Color?>((Set<MaterialState> states) {
        if (states.contains(MaterialState.selected)) {
          return Colors.blue.withOpacity(0.2);
        }
        return null; // Use default value for other states
      }),
      dividerThickness: 2.0,
      columnSpacing: 40.0,
      horizontalMargin: 20.0,
    );
  }

  void _sort<T>(
      Comparable<T> Function(Map<String, dynamic> product) getField, bool ascending) {
    _products.sort((a, b) {
      if (!ascending) {
        final Map<String, dynamic> c = a;
        a = b;
        b = c;
      }
      Comparable<T> aValue = getField(a);
      Comparable<T> bValue = getField(b);
      return Comparable.compare(aValue, bValue);
    });
  }
}
```

**Descrição do Código:**

1. **Personalização de Estilos:** As colunas possuem estilos de texto personalizados, com negrito nos títulos. As linhas de dados alternam cores com base na seleção.
    
2. **Ocultação da Coluna de Checkboxes:** Definido `showCheckboxColumn: false` para remover a coluna de seleção de linhas.
    
3. **Interatividade nas Células:** Algumas células possuem ações ao serem clicadas, como exibir ícones de edição.
    
4. **Formatação de Dados:** Valores numéricos são formatados com símbolos de moeda e casas decimais.
    

## Considerações Finais

O **DataTable** no Flutter é uma ferramenta robusta para a apresentação de dados tabulares, oferecendo diversas opções de personalização e interatividade. No entanto, é essencial considerar o contexto de uso e as limitações do widget para garantir uma experiência de usuário fluida e eficiente. Para aplicações que lidam com grandes volumes de dados, explorar widgets alternativos ou implementar mecanismos de paginação pode ser uma estratégia mais adequada.

**Boas Práticas:**

- **Gestão de Estado:** Utilize gerenciadores de estado como **Provider** ou **Bloc** para gerenciar dados de forma eficiente.
- **Responsividade:** Garanta que a tabela se adapte a diferentes tamanhos de tela, especialmente em dispositivos móveis.
- **Acessibilidade:** Certifique-se de que a tabela seja acessível para todos os usuários, incluindo aqueles que utilizam leitores de tela.
- **Performance:** Evite reconstruções desnecessárias do widget para manter a performance otimizada.

## Referências

- [Documentação do DataTable - Flutter](https://api.flutter.dev/flutter/material/DataTable-class.html)
- [Flutter Widgets](https://flutter.dev/docs/development/ui/widgets)
- [Material Design - Flutter](https://flutter.dev/docs/development/ui/widgets/material)

---

**Nota:** Este guia visa fornecer uma compreensão abrangente sobre o uso do **DataTable** no Flutter. Recomenda-se a experimentação prática e a consulta à documentação oficial para aprofundar o conhecimento e adaptar as implementações às necessidades específicas de cada projeto.