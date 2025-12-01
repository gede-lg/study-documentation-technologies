
Tags semânticas são aquelas que **descrevem o propósito do conteúdo** dentro delas.
Por exemplo:

```html
<header> → Cabeçalho
<nav> → Navegação
<main> → Conteúdo principal
<article> → Artigo independente
<section> → Seção de um tema
<aside> → Conteúdo lateral (complementar)
<footer> → Rodapé
```

Diferente de `<div>` ou `<span>`, que são genéricas, as semânticas **têm um significado claro**.

---

## 🧱 Estrutura semântica básica de uma página

Uma página típica bem estruturada pode seguir esse esqueleto:

```html
<header> <!-- Cabeçalho -->
  <nav> <!-- Navegação -->
  </nav>
</header>

<main> <!-- Conteúdo principal -->
  <article> <!-- Artigo ou conteúdo independente -->
    <section> <!-- Parte do artigo -->
    </section>
  </article>
  <aside> <!-- Conteúdo lateral -->
  </aside>
</main>

<footer> <!-- Rodapé -->
</footer>
```

---

## 🧠 Quando e como usar cada tag

### 1. `<header>`

**Usado para:** cabeçalhos gerais da página ou de seções.

📍Pode conter:

* Logo
* Título
* Navegação principal ou local
* Botões de login, etc.

📘 Exemplo:

```html
<header>
  <h1>Gedê.log</h1>
  <nav>
    <ul>
      <li><a href="#posts">Posts</a></li>
      <li><a href="#sobre">Sobre</a></li>
    </ul>
  </nav>
</header>
```

👉 **Dica:** Pode haver vários `<header>` na página (por exemplo, dentro de um `<article>`).

---

### 2. `<nav>`

**Usado para:** blocos de links de navegação principais.

📘 Exemplo:

```html
<nav>
  <ul>
    <li><a href="/">Início</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/contato">Contato</a></li>
  </ul>
</nav>
```

👉 **Dica:** use apenas para menus **importantes**, não para links isolados.

---

### 3. `<main>`

**Usado para:** conteúdo principal da página — **deve existir apenas um por página**.

📘 Exemplo:

```html
<main>
  <h2>Artigos recentes</h2>
  <article>...</article>
</main>
```

👉 **Dica:** o `<main>` melhora acessibilidade, pois leitores de tela pulam direto pra ele.

---

### 4. `<section>`

**Usado para:** dividir conteúdo por temas ou tópicos dentro da página.

📘 Exemplo:

```html
<section>
  <h2>Projetos recentes</h2>
  <p>Confira meus últimos trabalhos com Go e Java.</p>
</section>
```

👉 **Dica:** cada `<section>` deve ter um título (`<h2>`, `<h3>`, etc.), pois representa um bloco temático.

---

### 5. `<article>`

**Usado para:** conteúdo independente — que faz sentido fora da página.

📍Exemplos:

* Post de blog
* Comentário
* Notícia
* Card de produto

📘 Exemplo:

```html
<article>
  <h2>Aprendendo Go do zero</h2>
  <p>Hoje comecei meus estudos com Go e usei o pacote godotenv...</p>
</article>
```

👉 **Dica:** cada `<article>` pode ter seu próprio `<header>` e `<footer>`.

---

### 6. `<aside>`

**Usado para:** conteúdo complementar ao principal.

📍Exemplos:

* Barra lateral
* Publicidade
* Dicas extras
* Links relacionados

📘 Exemplo:

```html
<aside>
  <h3>Leia também</h3>
  <ul>
    <li><a href="#">Dicas de produtividade</a></li>
    <li><a href="#">Como usar .env no Go</a></li>
  </ul>
</aside>
```

---

### 7. `<footer>`

**Usado para:** rodapés da página ou de uma seção/artigo.

📍Pode conter:

* Créditos
* Links institucionais
* Contato
* Direitos autorais

📘 Exemplo:

```html
<footer>
  <p>&copy; 2025 Gedê.log - Todos os direitos reservados.</p>
</footer>
```

👉 **Dica:** também pode haver `<footer>` dentro de `<article>` ou `<section>`.

---

### 8. `<figure>` e `<figcaption>`

**Usado para:** imagens, gráficos ou códigos com legenda.

📘 Exemplo:

```html
<figure>
  <img src="setup.jpg" alt="Setup de programação de Gustavo">
  <figcaption>Meu setup de desenvolvimento com Go e Java</figcaption>
</figure>
```

---

### 9. `<mark>`

**Usado para:** destacar texto (como marca-texto).

📘 Exemplo:

```html
<p>O comando <mark>go run main.go</mark> executa seu programa Go.</p>
```

---

### 10. `<time>`

**Usado para:** representar datas ou horários (útil para SEO e acessibilidade).

📘 Exemplo:

```html
<time datetime="2025-09-27">27 de setembro de 2025</time>
```

---

### 11. `<address>`

**Usado para:** informações de contato (autor, empresa, etc).

📘 Exemplo:

```html
<address>
  Escrito por <a href="mailto:gustavo@gedelog.dev">gustavo@gedelog.dev</a>
</address>
```

---

### 12. `<details>` e `<summary>`

**Usado para:** criar seções colapsáveis (tipo FAQ).

📘 Exemplo:

```html
<details>
  <summary>O que é o Go?</summary>
  <p>Go é uma linguagem criada pela Google, focada em desempenho e simplicidade.</p>
</details>
```

---

## 📐 Hierarquia visual e semântica ideal

```html
<body>
  <header>...</header>

  <main>
    <article>
      <header>...</header>
      <section>...</section>
      <section>...</section>
      <footer>...</footer>
    </article>

    <aside>...</aside>
  </main>

  <footer>...</footer>
</body>
```

---

## 🎯 Benefícios de usar tags semânticas

✅ Melhora **SEO** (Google entende melhor seu conteúdo).
✅ Aumenta **acessibilidade** (leitores de tela e navegação por teclado).
✅ Código mais **organizado** e **fácil de manter**.
✅ Facilita **CSS e JavaScript**, pois a estrutura é mais previsível.

---

Se quiser, posso te montar **um modelo HTML completo** e moderno (por exemplo: o layout de um blog técnico, tipo o Gedê.log 😎) usando todas as tags semânticas corretamente, pra servir de base pros seus futuros projetos.
Quer que eu monte esse exemplo completo com explicações dentro do código?
