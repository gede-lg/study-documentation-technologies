
## Sumário

1. **Introdução**
2. **O que é e para que serve?**
3. **Como funciona?**
4. **Sintaxe de uso**
    - Parâmetros (detalhados)
5. **Restrições de uso**
6. **Quando utilizar?**
7. **Propriedades do `FutureBuilder`**
8. **Principais métodos do `FutureBuilder`**
9. **Categoria de widget**
10. **Exemplos de código**
11. **Conclusão**

---

## 1. Introdução

O `FutureBuilder` é um widget poderoso no Flutter usado para construir interfaces baseadas em dados assíncronos. Ele permite que desenvolvedores conectem diretamente operações assíncronas (como chamadas de API ou leitura de dados do banco de dados) à interface do usuário, atualizando dinamicamente o estado da UI conforme o `Future` é resolvido.

---

## 2. O que é e para que serve?

O `FutureBuilder` é um widget do Flutter que constrói seu conteúdo com base no estado de um `Future`. Ele é ideal para exibir informações que dependem de operações assíncronas, como:

- Chamadas a APIs REST.
- Leitura de arquivos.
- Consultas a bancos de dados locais ou remotos.
- Processos computacionais longos.

Ele simplifica o gerenciamento de estados associados ao ciclo de vida de operações assíncronas, como:

- `loading` (carregando),
- `done` (completo com sucesso),
- `error` (erro durante a execução).

---

## 3. Como funciona?

O `FutureBuilder` observa um objeto `Future` e reconstrói automaticamente sua interface de usuário sempre que o estado do `Future` muda. Ele possui três estados principais:

1. **`ConnectionState.none`**: Quando nenhum `Future` foi iniciado.
2. **`ConnectionState.waiting`**: Quando o `Future` está em andamento (estado de carregamento).
3. **`ConnectionState.done`**: Quando o `Future` foi concluído, seja com sucesso ou erro.

### Fluxo de funcionamento:

1. Um `Future` é fornecido ao `FutureBuilder` por meio da propriedade `future`.
2. O `FutureBuilder` constrói a interface com base no estado atual do `Future`.
3. Quando o `Future` é concluído, a interface é atualizada automaticamente.

---

## 4. Sintaxe de uso

```dart
FutureBuilder<T>(
  future: Future<T>?,
  builder: BuildContext context, AsyncSnapshot<T> snapshot,
)
```

### Parâmetros detalhados:

|Parâmetro|Tipo|Descrição|Obrigatório|Valor padrão|
|---|---|---|---|---|
|`future`|`Future<T>?`|O `Future` que será observado.|Não|`null`|
|`builder`|`Widget Function(BuildContext, AsyncSnapshot<T>)`|Função que constrói a interface com base no estado do `Future`.|Sim|N/A|

#### Parâmetro: `future`

- **Descrição**: O `Future` a ser executado. Pode ser `null`, caso você queira apenas reconstruir a interface de usuário.
- **Aceita**: Qualquer tipo de `Future<T>`.
- **Obrigatório?**: Não.
- **Exemplo**:
    
    ```dart
    Future<String> fetchData() async {
      return Future.delayed(Duration(seconds: 2), () => "Dados carregados!");
    }
    
    FutureBuilder(
      future: fetchData(),
      builder: ...
    );
    ```
    

#### Parâmetro: `builder`

- **Descrição**: Função responsável por construir a interface com base no `AsyncSnapshot<T>` fornecido.
- **Aceita**: Uma função com dois parâmetros:
    - `BuildContext`: O contexto atual.
    - `AsyncSnapshot<T>`: Representa o estado atual do `Future`.
- **Obrigatório?**: Sim.
- **Exemplo**:
    
    ```dart
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return CircularProgressIndicator();
      } else if (snapshot.hasError) {
        return Text('Erro: ${snapshot.error}');
      } else {
        return Text('Dados: ${snapshot.data}');
      }
    }
    ```
    

---

## 5. Restrições de uso

1. **O `FutureBuilder` reconstrói a UI sempre que o estado do `Future` muda.**  
    Se a reconstrução for indesejada, certifique-se de não recriar o `Future` a cada `build`.
    
2. **Evite usar o mesmo `FutureBuilder` para múltiplos `Futures`.**  
    Cada `FutureBuilder` deve estar vinculado a um único `Future`.
    
3. **Evite lógica pesada no `builder`.**  
    Coloque apenas lógica de interface de usuário no `builder`.
    

---

## 6. Quando utilizar?

- Quando sua interface depende diretamente de uma operação assíncrona.
- Para simplificar o gerenciamento de estados de carregamento, sucesso e erro.
- Quando precisar atualizar a UI automaticamente ao término de um `Future`.

---

## 7. Propriedades do `FutureBuilder`

|Propriedade|Descrição|Sintaxe de uso|
|---|---|---|
|`future`|Define o `Future` a ser monitorado.|`future: minhaFuncaoAsync()`|
|`builder`|Função que constrói a interface com base no estado do `Future`.|`builder: (context, snapshot) => {...}`|

---

## 8. Principais métodos do `FutureBuilder`

O `FutureBuilder` não possui métodos próprios relevantes, mas você pode usar os métodos do `AsyncSnapshot` no `builder`.

|Método|Descrição|Sintaxe de uso|
|---|---|---|
|`snapshot.hasData`|Retorna `true` se o `Future` foi concluído com sucesso e possui dados.|`snapshot.hasData`|
|`snapshot.hasError`|Retorna `true` se o `Future` foi concluído com erro.|`snapshot.hasError`|
|`snapshot.data`|Dados retornados pelo `Future`.|`snapshot.data`|
|`snapshot.error`|Erro retornado pelo `Future`.|`snapshot.error`|
|`snapshot.connectionState`|Estado atual da conexão (`none`, `waiting`, `active`, `done`).|`snapshot.connectionState`|

---

## 9. Categoria de widget

O `FutureBuilder` se encaixa na categoria **Async**.

---

## 10. Exemplos de código

### Exemplo básico

```dart
import 'package:flutter/material.dart';

class FutureBuilderExample extends StatelessWidget {
  Future<String> fetchData() async {
    return Future.delayed(Duration(seconds: 2), () => "Dados carregados!");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Exemplo de FutureBuilder')),
      body: Center(
        child: FutureBuilder<String>(
          future: fetchData(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return CircularProgressIndicator();
            } else if (snapshot.hasError) {
              return Text('Erro: ${snapshot.error}');
            } else {
              return Text('Dados: ${snapshot.data}');
            }
          },
        ),
      ),
    );
  }
}
```

---

## 11. Conclusão

O `FutureBuilder` é uma ferramenta poderosa para construção de interfaces assíncronas no Flutter. Ele simplifica a exibição de dados que dependem de operações demoradas, garantindo que a interface seja atualizada dinamicamente com base no estado do `Future`.

Utilize-o sempre que sua interface necessitar de dados provenientes de operações assíncronas e evite misturar lógicas de reconstrução de interface e manipulação de dados.