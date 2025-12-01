## 1. Introdução

O **Emmet** é uma ferramenta de produtividade para desenvolvedores web que permite escrever código **HTML** e **CSS** de forma muito mais rápida, utilizando abreviações que são automaticamente expandidas para código completo.

### **Por que usar o Emmet?**

- **Economiza tempo**: Reduz a quantidade de digitação repetitiva.
- **Minimiza erros**: Garante que as tags HTML sejam corretamente fechadas e estruturadas.
- **Integração com editores modernos**: Suportado no **VS Code, Sublime Text, Atom, WebStorm** e outros.

---

## 2. Sumário

1. **Introdução**
2. **Sintaxe e Estrutura do Emmet**
    - Como funciona o Emmet?
    - Operadores do Emmet
3. **Lista Completa de Operadores**
    - `>` (Child)
    - `+` (Sibling)
    - `^` (Climb-up)
    - `*` (Multiplicação)
    - `{}` (Conteúdo de texto)
    - `[]` (Atributos)
    - `()` (Agrupamento)
    - `!` (Estrutura Boilerplate)
    - `.` (Classe)
    - `#` (ID)
    - `@` (Numeração automática)
4. **Exemplos Práticos**
5. **Informações Adicionais**
6. **Referências**

---

## 3. Sintaxe e Estrutura do Emmet

### **Como funciona o Emmet?**

O Emmet utiliza abreviações curtas que são expandidas em código HTML ou CSS completo.

Exemplo básico:

```
ul>li*3

```

Se expande para:

```html
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>

```

O **ponto forte do Emmet** está no uso de **operadores**, que permitem criar estruturas complexas rapidamente.

---

## 4. Lista Completa de Operadores

Aqui estão todos os operadores suportados pelo Emmet, com exemplos práticos.

### 4.1 `>` (Child - Filho)

Cria uma relação de **pai para filho**.

```
div>p

```

Se expande para:

```html
<div>
  <p></p>
</div>

```

---

### 4.2 `+` (Sibling - Irmão)

Cria elementos **irmãos** (no mesmo nível hierárquico).

```
h1+p

```

Se expande para:

```html
<h1></h1>
<p></p>

```

---

### 4.3 `^` (Climb-up - Subir um nível)

Move um nível acima na hierarquia.

```
div>p>span^a

```

Expande para:

```html
<div>
  <p>
    <span></span>
  </p>
  <a></a>
</div>

```

O `^` faz com que o `<a>` **saia do `<p>`**, mas ainda fique dentro da `<div>`.

---

### 4.4  (Multiplicação)

Repete um elemento **várias vezes**.

```
ul>li*3

```

Se expande para:

```html
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>

```

---

### 4.5 `{}` (Conteúdo de Texto)

Define um **texto dentro de uma tag**.

```
button{Clique Aqui}

```

Expande para:

```html
<button>Clique Aqui</button>

```

---

### 4.6 `[]` (Atributos)

Define **atributos personalizados** dentro de uma tag.

```
input[type="text" placeholder="Digite seu nome"]

```

Expande para:

```html
<input type="text" placeholder="Digite seu nome">

```

---

### 4.7 `()` (Agrupamento)

Usado para **combinar expressões**.

```
div>(header>h1{Título})+section>p{Conteúdo}

```

Expande para:

```html
<div>
  <header>
    <h1>Título</h1>
  </header>
  <section>
    <p>Conteúdo</p>
  </section>
</div>

```

---

### 4.8 `!` (Estrutura Boilerplate)

Cria a estrutura básica de um documento HTML5 ao pressionar **Tab**.

```
!

```

Expande para:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

</body>
</html>

```

---

### 4.9 `.` (Classe)

Define **classes** em uma tag.

```
div.box

```

Expande para:

```html
<div class="box"></div>

```

---

### 4.10 `#` (ID)

Define **IDs** em uma tag.

```
section#hero

```

Expande para:

```html
<section id="hero"></section>

```

---

### 4.11 `@` (Numeração Automática)

Numera automaticamente elementos repetidos.

```
ul>li.item$*3

```

Expande para:

```html
<ul>
  <li class="item1"></li>
  <li class="item2"></li>
  <li class="item3"></li>
</ul>

```

---

## 5. Exemplos Práticos

### **Exemplo 1: Criando uma Estrutura Completa**

```
header>nav>ul>li*3>a{Link $}

```

Expande para:

```html
<header>
  <nav>
    <ul>
      <li><a href="">Link 1</a></li>
      <li><a href="">Link 2</a></li>
      <li><a href="">Link 3</a></li>
    </ul>
  </nav>
</header>

```

---

### **Exemplo 2: Criando um Card de Produto**

```
div.card>img[src="produto.jpg"]+h2{Nome do Produto}+p{Descrição}+button{Comprar}

```

Expande para:

```html
<div class="card">
  <img src="produto.jpg">
  <h2>Nome do Produto</h2>
  <p>Descrição</p>
  <button>Comprar</button>
</div>

```

---

### **Exemplo 3: Criando uma Tabela**

```
table>thead>tr>th*3{Título $}^^tbody>tr*3>td*3{Dado $}

```

Expande para:

```html
<table>
  <thead>
    <tr>
      <th>Título 1</th>
      <th>Título 2</th>
      <th>Título 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dado 1</td>
      <td>Dado 2</td>
      <td>Dado 3</td>
    </tr>
    <tr>
      <td>Dado 1</td>
      <td>Dado 2</td>
      <td>Dado 3</td>
    </tr>
    <tr>
      <td>Dado 1</td>
      <td>Dado 2</td>
      <td>Dado 3</td>
    </tr>
  </tbody>
</table>

```

---

## 6. Informações Adicionais

- **O Emmet é personalizável**: Pode ser configurado para incluir snippets próprios.
- **Integração com CSS**: Também permite expansão de propriedades CSS.
- **Extensível**: Suporte para JSX, Pug e outras linguagens.

---

## 7. Referências para Estudo

- 📄 [**Documentação Oficial**](https://emmet.io/)
- 📘 [**Emmet no VS Code**](https://code.visualstudio.com/docs/editor/emmet)
- 🎥 **Pesquise "Emmet tutorial" no YouTube para ver demonstrações visuais.**

Com este guia, você dominará o Emmet e aumentará sua produtividade no desenvolvimento web! 🚀