## 1. Introdução

A tag `<address>` em HTML5 é utilizada para representar informações de contato relacionadas ao conteúdo ao qual está associada. Essa tag é essencial para estruturar informações como endereços físicos, e-mails e números de telefone de maneira semântica, facilitando a interpretação tanto por usuários quanto por motores de busca e assistentes de acessibilidade.

## 2. Sumário

1. Introdução
2. Sumário
3. Conteúdo Detalhado
    - Definição e conceitos fundamentais
    - Sintaxe e estrutura
    - Componentes principais
    - Propriedades e atributos específicos
    - Uso avançado
4. Exemplos práticos
5. Informações adicionais
6. Referências para estudo

## 3. Conteúdo Detalhado

### 3.1 Definição e conceitos fundamentais

A tag `<address>` é um elemento de bloco em HTML5 que tem como objetivo fornecer informações de contato associadas a uma página, artigo ou seção específica. Ela pode conter:

- Endereços físicos
- E-mails
- Telefones
- Links para perfis sociais
- Outras formas de contato relevantes

É importante notar que a tag `<address>` não deve ser utilizada para indicar endereços genéricos dentro de um conteúdo (por exemplo, o endereço de uma loja dentro de um artigo), mas sim para representar informações de contato do autor ou responsável pelo conteúdo.

### 3.2 Sintaxe e estrutura

A estrutura básica da tag `<address>` é a seguinte:

```html
<address>
    <p>John Doe</p>
    <p>1234 Main Street, Suite 567</p>
    <p>Cityville, ST 12345</p>
    <p>Email: <a href="mailto:johndoe@example.com">johndoe@example.com</a></p>
    <p>Telefone: <a href="tel:+5511999999999">+55 11 99999-9999</a></p>
</address>

```

### 3.3 Componentes principais

Os principais elementos utilizados dentro da tag `<address>` incluem:

- **Textos simples**: Nome da empresa, endereço físico, telefone.
- **Tags de formatação**: `<p>`, `<br>`, `<strong>` para melhor organização.
- **Links**: `<a>` com `mailto:` para e-mails e `tel:` para números de telefone.

### 3.4 Propriedades e atributos específicos

A tag `<address>` não possui atributos específicos próprios, mas pode ser estilizada com CSS e combinada com outros elementos HTML para criar melhores experiências visuais.

### 3.5 Uso avançado

A tag `<address>` pode ser utilizada de maneira mais avançada em contextos como:

- **Rodapés de sites**: Para fornecer informações de contato institucionais.
- **Páginas de contato**: Estruturando diferentes formas de contato dentro da página.
- **Microdados e SEO**: Utilizando a tag com microdados do schema.org para enriquecer os resultados de busca.

Exemplo com microdados:

```html
<address itemscope itemtype="http://schema.org/Organization">
    <p><strong itemprop="name">Empresa XYZ</strong></p>
    <p itemprop="address">Av. Paulista, 1000 - São Paulo, SP</p>
    <p>Telefone: <a itemprop="telephone" href="tel:+5511987654321">+55 11 98765-4321</a></p>
    <p>Email: <a itemprop="email" href="mailto:contato@empresa.com">contato@empresa.com</a></p>
</address>

```

## 4. Exemplos Práticos

### 4.1 Uso Básico

```html
<address>
    <p>Jane Doe</p>
    <p>Rua Exemplo, 123 - Centro</p>
    <p>São Paulo, SP - Brasil</p>
    <p>Email: <a href="mailto:jane.doe@email.com">jane.doe@email.com</a></p>
</address>

```

### 4.2 Uso em um Rodapé

```html
<footer>
    <address>
        <p>© 2025 Minha Empresa</p>
        <p>Contato: <a href="mailto:suporte@minhaempresa.com">suporte@minhaempresa.com</a></p>
    </address>
</footer>

```

### 4.3 Uso com CSS para Melhor Estilização

```html
<address class="contact-info">
    <p>John Smith</p>
    <p>123 Example St, Example City</p>
    <p><a href="mailto:john.smith@email.com">john.smith@email.com</a></p>
</address>

```

```css
.contact-info {
    font-style: normal;
    color: #333;
}
.contact-info a {
    color: blue;
    text-decoration: none;
}
.contact-info a:hover {
    text-decoration: underline;
}

```

## 5. Informações Adicionais

- A tag `<address>` não deve ser usada para endereços comuns dentro do conteúdo de um site. Seu propósito é exclusivo para informações de contato.
- Motores de busca interpretam `<address>` como uma fonte importante de informações sobre um site ou autor.
- Adicionar microdados pode melhorar a indexação e a apresentação nos resultados de pesquisa.

## 6. Referências para Estudo

- [MDN Web Docs - `<address>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/address)
- [W3C HTML Specification](https://html.spec.whatwg.org/multipage/semantics.html#the-address-element)
- [Schema.org - Microdados](https://schema.org/PostalAddress)

Com isso, você terá um entendimento completo sobre a tag `<address>` e sua aplicação em HTML5!