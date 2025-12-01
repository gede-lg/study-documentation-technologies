## **Sumário**

1. Introdução
2. O que é e para que serve?
3. Como funciona?
4. Sintaxe de uso
5. Restrições de uso
6. Quando utilizar?
7. Tabela de propriedades
8. Tabela de métodos principais
9. Categoria de widget
10. Exemplos práticos

---

## **1. Introdução**

O Flutter oferece widgets que permitem criar interfaces reativas, e o `StreamBuilder` é essencial para lidar com fluxos de dados assíncronos. Ele é ideal para atualizar a interface em tempo real, conforme os dados chegam.

---

## **2. O que é e para que serve?**

O `StreamBuilder` escuta fluxos assíncronos (`Stream`) e atualiza automaticamente sua interface conforme os eventos são emitidos. Ele é amplamente usado para lidar com dados em tempo real, como mensagens, atualizações de status ou dados provenientes de APIs.

**Principais finalidades**:

- Trabalhar com dados assíncronos.
- Construir interfaces reativas.
- Atualizar automaticamente a UI com base em novos eventos.

---

## **3. Como funciona?**

O `StreamBuilder` funciona assim:

1. Conecta-se a um `Stream` fornecido.
2. Escuta eventos emitidos pelo `Stream`.
3. Atualiza o widget com base nos dados do snapshot atual.
4. Desconecta-se do `Stream` ao ser descartado.

---

## **4. Sintaxe de uso**

```dart
StreamBuilder<T>(
  stream: Stream<T>,
  initialData: T?,
  builder: (BuildContext context, AsyncSnapshot<T> snapshot) {
    // Constrói o widget baseado no snapshot
  },
)
```

### **Descrição dos parâmetros**

|Parâmetro|Descrição|Tipo|Obrigatório|Valor Padrão|
|---|---|---|---|---|
|**`stream`**|O fluxo assíncrono que será escutado.|`Stream<T>`|Sim|`null`|
|**`initialData`**|Valor inicial antes do stream emitir eventos.|`T?`|Não|`null`|
|**`builder`**|Função que cria o widget com base no snapshot.|`Widget Function(BuildContext, AsyncSnapshot<T>)`|Sim|`null`|

---

## **5. Restrições de uso**

1. **Não recrie o StreamBuilder desnecessariamente**: Isso pode causar novas assinaturas ao stream, afetando a performance.
2. **Evite streams nulos**: Caso o stream seja `null`, o `StreamBuilder` renderiza apenas o valor inicial, se configurado.
3. **Estado perdido**: Se o widget pai for recriado, o stream pode ser reiniciado.

---

## **6. Quando utilizar?**

Use o `StreamBuilder` quando:

- Dados são recebidos em tempo real.
- Está trabalhando com blocos de estado (BLoC).
- Precisa exibir um estado de carregamento ou erros dinâmicos.
- Integração com APIs baseadas em WebSocket ou Firebase.

---

## **7. Tabela de propriedades**

|Propriedade|Descrição|Sintaxe de uso|
|---|---|---|
|**`stream`**|O fluxo de dados que será escutado.|`stream: minhaStream`|
|**`initialData`**|Valor inicial mostrado antes de o stream emitir.|`initialData: MeuValorInicial`|
|**`builder`**|Função que reconstrói o widget baseado nos dados do snapshot.|`builder: (context, snapshot)`|

---

## **8. Tabela de métodos principais**

O `StreamBuilder` não possui métodos próprios, mas utiliza o método `build` implicitamente:

|Método|Descrição|Sintaxe de uso|
|---|---|---|
|**`build`**|Método chamado para renderizar o widget com base nos dados do snapshot.|`build(context)`|

---

## **9. Categoria de widget**

O `StreamBuilder` pertence à categoria **Async**, que inclui widgets focados em dados assíncronos e eventos em tempo real.

---

## **10. Exemplos práticos**

### **Exemplo 1: Contador em tempo real**

```dart
import 'dart:async';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Exemplo StreamBuilder')),
        body: const ContadorStream(),
      ),
    );
  }
}

class ContadorStream extends StatelessWidget {
  const ContadorStream({super.key});

  Stream<int> contador() async* {
    for (int i = 0; i <= 10; i++) {
      await Future.delayed(const Duration(seconds: 1));
      yield i;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: StreamBuilder<int>(
        stream: contador(),
        initialData: 0,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.hasError) {
            return Text('Erro: ${snapshot.error}');
          } else {
            return Text('Contagem: ${snapshot.data}',
                style: const TextStyle(fontSize: 24));
          }
        },
      ),
    );
  }
}
```

### **Explicação do exemplo**

- **`Stream<int>`**: Emite números de 0 a 10 com intervalos de 1 segundo.
- **`initialData`**: Define o valor inicial como `0`.
- **`snapshot`**: Encapsula o estado atual do stream.

---

Essa explicação cobre todos os aspectos do `StreamBuilder`. Se tiver mais dúvidas ou precisar de ajuda com algum detalhe, é só perguntar! 😊