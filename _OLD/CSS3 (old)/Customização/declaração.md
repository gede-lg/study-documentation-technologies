Certamente! Aqui está uma explicação em Markdown sobre as formas de declaração de CSS em um documento HTML, juntamente com exemplos:

### Declaração Inline

A declaração inline é feita diretamente no elemento HTML usando o atributo `style`. É útil para estilos específicos a serem aplicados a um único elemento.

Exemplo:
```html
<p style="color: blue; font-size: 16px;">Este é um parágrafo com estilo inline.</p>
```

### Declaração Interna (ou Incorporada)

A declaração interna é inserida no cabeçalho do documento HTML, entre as tags `<style>` e `</style>`. Afeta os elementos dentro do documento.

Exemplo:
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
        }
        h1 {
            color: green;
        }
    </style>
</head>
<body>
    <h1>Este é um cabeçalho com estilo interno.</h1>
</body>
</html>
```

### Declaração Externa

A declaração externa é armazenada em um arquivo CSS separado e é vinculada ao documento HTML usando a tag `<link>` no cabeçalho.

Exemplo (styles.css):
```css
/* styles.css */
body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
}
h1 {
    color: green;
}
```

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <h1>Este é um cabeçalho com estilo externo.</h1>
</body>
</html>
```

Essas são as principais formas de declarar estilos CSS em um documento HTML. A escolha entre elas depende das necessidades específicas do projeto e da organização do código.