## 1. Introdução

A tag `<footer>` é um dos elementos semânticos introduzidos no HTML5. Ela é utilizada para definir uma seção de rodapé em um documento ou em uma seção específica. Essa estrutura é essencial para a organização do conteúdo da página, proporcionando uma maneira padronizada de incluir informações complementares, como autoria, links de navegação, direitos autorais e informações de contato.

O uso correto da `<footer>` melhora a acessibilidade, facilita a indexação pelos mecanismos de busca (SEO) e proporciona uma experiência de usuário mais organizada.

## 2. Sumário

1. Introdução
2. Definição e conceitos fundamentais
3. Sintaxe e estrutura
4. Componentes principais
5. Propriedades/Atributos
6. Uso avançado
7. Exemplos práticos
8. Informações adicionais
9. Referências para estudo

## 3. Definição e conceitos fundamentais

A tag `<footer>` representa um rodapé para o seu elemento pai mais próximo, que pode ser um artigo (`<article>`), uma seção (`<section>`) ou o próprio corpo do documento (`<body>`).

### **Diferença entre rodapé global e rodapé de seção**

- **Rodapé global:** Quando o `<footer>` está diretamente dentro do `<body>`, ele representa o rodapé do site inteiro.
- **Rodapé de seção:** Quando o `<footer>` está dentro de um `<article>` ou `<section>`, ele se aplica apenas àquela seção específica.

## 4. Sintaxe e estrutura

A estrutura básica da tag `<footer>` é:

```html
<footer>
    <p>&copy; 2025 Meu Site. Todos os direitos reservados.</p>
    <nav>
        <ul>
            <li><a href="/termos">Termos de Uso</a></li>
            <li><a href="/privacidade">Política de Privacidade</a></li>
        </ul>
    </nav>
</footer>

```

### **Posicionamento no HTML**

A `<footer>` geralmente é colocada no final da estrutura HTML, logo antes do fechamento do `<body>`, mas também pode ser usada dentro de seções ou artigos específicos.

## 5. Componentes principais

Dentro da `<footer>`, é comum incluir:

- **Informações de direitos autorais (`<p>`)**
- **Links de navegação (`<nav>`, `<ul>`, `<a>`)**
- **Informações de contato (`<address>`)**
- **Redes sociais (ícones e links)**
- **Autores e fontes de conteúdo**

Exemplo com todos esses elementos:

```html
<footer>
    <p>&copy; 2025 Meu Site. Desenvolvido por <a href="https://meusite.com">Meu Nome</a></p>
    <nav>
        <ul>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#contato">Contato</a></li>
        </ul>
    </nav>
    <p>Nos siga:
        <a href="https://twitter.com">Twitter</a> |
        <a href="https://instagram.com">Instagram</a>
    </p>
</footer>

```

## 6. Propriedades/Atributos

A tag `<footer>` não possui atributos específicos, mas pode utilizar atributos globais do HTML5, como:

- `id`: Define um identificador único.
- `class`: Permite estilizar o elemento com CSS.
- `style`: Adiciona estilos inline (não recomendado para produção).
- `hidden`: Esconde o rodapé da interface sem removê-lo do DOM.
- `aria-label`: Melhora a acessibilidade ao fornecer uma descrição.

Exemplo com atributos globais:

```html
<footer id="rodape-principal" class="rodape" aria-label="Rodapé do site">
    <p>Todos os direitos reservados.</p>
</footer>

```

## 7. Uso avançado

A `<footer>` pode ser combinada com CSS e JavaScript para fornecer funcionalidades adicionais, como:

### **Rodapé fixo no final da tela**

```css
footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #222;
    color: white;
    text-align: center;
    padding: 10px;
}

```

### **Rodapé dinâmico com JavaScript**

Exemplo para atualizar automaticamente o ano nos direitos autorais:

```html
<footer>
    <p>&copy; <span id="ano"></span> Meu Site</p>
</footer>

<script>
    document.getElementById("ano").textContent = new Date().getFullYear();
</script>

```

## 8. Exemplos práticos

### **Rodapé para um blog**

```html
<footer>
    <p>Escrito por João Silva</p>
    <p>Publicado em 07 de fevereiro de 2025</p>
</footer>

```

### **Rodapé para um e-commerce**

```html
<footer>
    <p>&copy; 2025 Loja Online. Todos os direitos reservados.</p>
    <p>Formas de pagamento aceitas:</p>
    <img src="cartoes.png" alt="Cartões de crédito aceitos">
</footer>

```

## 9. Informações adicionais

- A `<footer>` não deve ser usada dentro de outro `<footer>`.
- Diferente de `<header>`, que define o topo de uma página ou seção, `<footer>` sempre define a parte final.
- Melhor prática: sempre incluir links úteis e informações de contato.

## 10. Referências para estudo

- [Documentação oficial do MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/footer)
- [W3Schools - Tag `<footer>`](https://www.w3schools.com/tags/tag_footer.asp)
- [HTML5 Specification - Footer](https://html.spec.whatwg.org/multipage/sections.html#the-footer-element)

---

Esse guia cobre desde os conceitos básicos até usos avançados da tag `<footer>`, com exemplos práticos para facilitar a implementação. 🚀