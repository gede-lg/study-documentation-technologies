# <input>

A seguir, você encontrará uma explicação detalhada sobre cada tipo de input disponível no HTML5. Cada seção abordará o conceito, a sintaxe, os atributos específicos e exemplos práticos para ajudar a compreender como e quando utilizar cada um.

---

## 1. Introdução

A tag `<input>` é essencial para a criação de formulários interativos em HTML5. Com a evolução do padrão, surgiram diversos tipos de inputs que atendem a necessidades variadas, desde simples campos de texto até seletores avançados de data e cor. Esses diferentes tipos melhoram a semântica, a usabilidade e a validação dos dados inseridos pelos usuários, além de permitir uma experiência mais dinâmica e responsiva.

---

## 2. Sumário

1. **Introdução**
2. **Tipos de Input e suas Especificações**
    - **text**
    - **password**
    - **checkbox**
    - **radio**
    - **submit**
    - **reset**
    - **hidden**
    - **button**
    - **image**
    - **file**
    - **date**
    - **time**
    - **datetime-local**
    - **month**
    - **week**
    - **number**
    - **range**
    - **email**
    - **url**
    - **search**
    - **tel**
    - **color**
3. **Exemplos Práticos**
4. **Informações Adicionais**
5. **Referências para Estudo**

---

## 3. Conteúdo Detalhado

### 3.1 `<input type="text">`

- **Definição:** Campo de entrada para texto simples em linha.
- **Atributos Comuns:** `name`, `id`, `placeholder`, `value`, `required`.
- **Uso:** Ideal para nomes, endereços e outros dados curtos.
- **Exemplo:**
    
    ```html
    <input type="text" name="nome" id="nome" placeholder="Digite seu nome" required>
    
    ```
    

---

### 3.2 `<input type="password">`

- **Definição:** Campo para senhas que oculta os caracteres digitados.
- **Atributos Comuns:** `name`, `id`, `placeholder`, `required`.
- **Uso:** Formulários de login e cadastro.
- **Exemplo:**
    
    ```html
    <input type="password" name="senha" id="senha" placeholder="Digite sua senha" required>
    
    ```
    

---

### 3.3 `<input type="checkbox">`

- **Definição:** Permite selecionar uma ou mais opções dentre um conjunto.
- **Atributos Comuns:** `name`, `id`, `value`, `checked` (para pré-seleção).
- **Uso:** Seleção de múltiplas preferências ou confirmações.
- **Exemplo:**
    
    ```html
    <label for="aceito">
      <input type="checkbox" id="aceito" name="termos" value="sim" required>
      Aceito os termos e condições
    </label>
    
    ```
    

---

### 3.4 `<input type="radio">`

- **Definição:** Permite escolher apenas uma opção dentre várias disponíveis.
- **Atributos Comuns:** `name` (compartilhado entre os botões), `id`, `value`, `checked`.
- **Uso:** Seleção única, como gênero ou método de pagamento.
- **Exemplo:**
    
    ```html
    <label for="masculino">
      <input type="radio" id="masculino" name="genero" value="masculino">
      Masculino
    </label>
    <label for="feminino">
      <input type="radio" id="feminino" name="genero" value="feminino">
      Feminino
    </label>
    
    ```
    

---

### 3.5 `<input type="submit">`

- **Definição:** Botão que submete o formulário.
- **Atributos Comuns:** `value` (texto exibido no botão).
- **Uso:** Envio de dados para processamento.
- **Exemplo:**
    
    ```html
    <input type="submit" value="Enviar">
    
    ```
    

---

### 3.6 `<input type="reset">`

- **Definição:** Botão que reinicia os campos do formulário para seus valores iniciais.
- **Atributos Comuns:** `value`.
- **Uso:** Limpar formulários de forma rápida.
- **Exemplo:**
    
    ```html
    <input type="reset" value="Limpar">
    
    ```
    

---

### 3.7 `<input type="hidden">`

- **Definição:** Campo oculto que armazena dados sem exibir ao usuário.
- **Atributos Comuns:** `name`, `value`.
- **Uso:** Envio de dados que não precisam ser alterados pelo usuário, como tokens ou IDs.
- **Exemplo:**
    
    ```html
    <input type="hidden" name="user_id" value="12345">
    
    ```
    

---

### 3.8 `<input type="button">`

- **Definição:** Botão genérico que pode ser manipulado via JavaScript.
- **Atributos Comuns:** `value`, `id`, `onclick` (para eventos).
- **Uso:** Acionamento de scripts ou ações não relacionadas à submissão do formulário.
- **Exemplo:**
    
    ```html
    <input type="button" value="Clique Aqui" onclick="alert('Botão acionado!')">
    
    ```
    

---

### 3.9 `<input type="image">`

- **Definição:** Botão de submissão que utiliza uma imagem em vez de texto.
- **Atributos Comuns:** `src` (caminho da imagem), `alt`, `name`.
- **Uso:** Interfaces que exigem uma abordagem gráfica para submissão.
- **Exemplo:**
    
    ```html
    <input type="image" src="botao-enviar.png" alt="Enviar formulário">
    
    ```
    

---

### 3.10 `<input type="file">`

- **Definição:** Campo que permite ao usuário selecionar e enviar arquivos.
- **Atributos Comuns:** `name`, `id`, `accept` (tipos de arquivo permitidos), `multiple`.
- **Uso:** Upload de imagens, documentos ou outros arquivos.
- **Exemplo:**
    
    ```html
    <input type="file" name="foto" id="foto" accept="image/png, image/jpeg" multiple>
    
    ```
    

---

### 3.11 `<input type="date">`

- **Definição:** Campo para seleção de uma data (dia, mês e ano).
- **Atributos Comuns:** `name`, `id`, `min`, `max`.
- **Uso:** Escolha de datas para eventos, aniversários, etc.
- **Exemplo:**
    
    ```html
    <input type="date" name="data_nascimento" id="data_nascimento">
    
    ```
    

---

### 3.12 `<input type="time">`

- **Definição:** Campo para seleção de uma hora (horas e minutos, e opcionalmente segundos).
- **Atributos Comuns:** `name`, `id`, `min`, `max`, `step`.
- **Uso:** Agendamento de horários e entradas de tempo.
- **Exemplo:**
    
    ```html
    <input type="time" name="horario" id="horario">
    
    ```
    

---

### 3.13 `<input type="datetime-local">`

- **Definição:** Permite selecionar data e hora em um formato local (sem fuso horário).
- **Atributos Comuns:** `name`, `id`, `min`, `max`, `step`.
- **Uso:** Eventos ou compromissos que exigem data e hora combinadas.
- **Exemplo:**
    
    ```html
    <input type="datetime-local" name="datahora" id="datahora">
    
    ```
    

---

### 3.14 `<input type="month">`

- **Definição:** Campo para seleção de um mês e um ano.
- **Atributos Comuns:** `name`, `id`, `min`, `max`.
- **Uso:** Faturamento mensal, seleção de período, etc.
- **Exemplo:**
    
    ```html
    <input type="month" name="mes_referencia" id="mes_referencia">
    
    ```
    

---

### 3.15 `<input type="week">`

- **Definição:** Permite selecionar uma semana do ano.
- **Atributos Comuns:** `name`, `id`, `min`, `max`.
- **Uso:** Programações semanais ou relatórios que se baseiam em semanas.
- **Exemplo:**
    
    ```html
    <input type="week" name="semana" id="semana">
    
    ```
    

---

### 3.16 `<input type="number">`

- **Definição:** Campo para entrada de números com suporte a incrementos.
- **Atributos Comuns:** `name`, `id`, `min`, `max`, `step`, `value`.
- **Uso:** Quantidades, valores monetários ou qualquer dado numérico.
- **Exemplo:**
    
    ```html
    <input type="number" name="quantidade" id="quantidade" min="1" max="100" step="1" value="1">
    
    ```
    

---

### 3.17 `<input type="range">`

- **Definição:** Slider para seleção de um valor numérico dentro de um intervalo.
- **Atributos Comuns:** `name`, `id`, `min`, `max`, `step`, `value`.
- **Uso:** Controle de volume, brilho ou outros parâmetros ajustáveis.
- **Exemplo:**
    
    ```html
    <input type="range" name="volume" id="volume" min="0" max="100" step="5" value="50">
    
    ```
    

---

### 3.18 `<input type="email">`

- **Definição:** Campo que espera um endereço de email, oferecendo validação nativa do formato.
- **Atributos Comuns:** `name`, `id`, `placeholder`, `multiple` (permite múltiplos emails separados por vírgula).
- **Uso:** Cadastro e contato.
- **Exemplo:**
    
    ```html
    <input type="email" name="email" id="email" placeholder="exemplo@dominio.com" required>
    
    ```
    

---

### 3.19 `<input type="url">`

- **Definição:** Campo para entrada de URLs, com validação de formato.
- **Atributos Comuns:** `name`, `id`, `placeholder`.
- **Uso:** Inserção de links e endereços de sites.
- **Exemplo:**
    
    ```html
    <input type="url" name="site" id="site" placeholder="https://www.exemplo.com">
    
    ```
    

---

### 3.20 `<input type="search">`

- **Definição:** Campo destinado à pesquisa. Pode incluir recursos visuais nativos, como botão de limpar.
- **Atributos Comuns:** `name`, `id`, `placeholder`.
- **Uso:** Interfaces de busca em sites e aplicativos.
- **Exemplo:**
    
    ```html
    <input type="search" name="busca" id="busca" placeholder="Pesquisar...">
    
    ```
    

---

### 3.21 `<input type="tel">`

- **Definição:** Campo para entrada de números de telefone. Não há validação intrínseca, mas pode ser customizada.
- **Atributos Comuns:** `name`, `id`, `placeholder`.
- **Uso:** Formulários de contato ou cadastro onde é necessário um número telefônico.
- **Exemplo:**
    
    ```html
    <input type="tel" name="telefone" id="telefone" placeholder="(00) 0000-0000">
    
    ```
    

---

### 3.22 `<input type="color">`

- **Definição:** Campo que abre um seletor de cores, permitindo a escolha por meio de uma interface gráfica.
- **Atributos Comuns:** `name`, `id`, `value` (valor hexadecimal).
- **Uso:** Escolha de cores para temas, personalização ou design.
- **Exemplo:**
    
    ```html
    <input type="color" name="cor" id="cor" value="#ff0000">
    
    ```
    

---

## 4. Exemplos Práticos Integrados

### Formulário com Vários Inputs

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Formulário com Todos os Inputs</title>
  <style>
    body { font-family: Arial, sans-serif; }
    form { max-width: 600px; margin: 20px auto; }
    fieldset { margin-bottom: 20px; padding: 15px; }
    legend { font-weight: bold; }
    label { display: block; margin-top: 10px; }
    input, button { margin-top: 5px; padding: 8px; width: 100%; box-sizing: border-box; }
    .inline { display: inline-block; width: auto; margin-right: 10px; }
  </style>
</head>
<body>
  <form action="/submit" method="post" enctype="multipart/form-data">
    <!-- Campo de Texto -->
    <fieldset>
      <legend>Textos e Senhas</legend>
      <label for="texto">Texto:</label>
      <input type="text" id="texto" name="texto" placeholder="Digite um texto">

      <label for="senha">Senha:</label>
      <input type="password" id="senha" name="senha" placeholder="Digite sua senha">
    </fieldset>

    <!-- Checkboxes e Radio -->
    <fieldset>
      <legend>Checkbox e Radio</legend>
      <label class="inline">
        <input type="checkbox" name="noticias" value="sim"> Quero receber notícias
      </label>
      <label class="inline">
        <input type="checkbox" name="termos" value="aceito"> Aceito os termos
      </label>
      
      <p>Escolha seu gênero:</p>
      <label class="inline">
        <input type="radio" name="genero" value="masculino"> Masculino
      </label>
      <label class="inline">
        <input type="radio" name="genero" value="feminino"> Feminino
      </label>
      <label class="inline">
        <input type="radio" name="genero" value="outro"> Outro
      </label>
    </fieldset>

    <!-- Botões de Ação -->
    <fieldset>
      <legend>Botões</legend>
      <label for="botao">Botão (não envia formulário):</label>
      <input type="button" id="botao" value="Clique Aqui" onclick="alert('Botão acionado!')">

      <label for="submit">Submeter Formulário:</label>
      <input type="submit" id="submit" value="Enviar">

      <label for="reset">Resetar Formulário:</label>
      <input type="reset" id="reset" value="Limpar">
    </fieldset>

    <!-- Input Oculto -->
    <fieldset>
      <legend>Input Oculto</legend>
      <input type="hidden" name="usuarioID" value="12345">
      <p>(Input hidden não é exibido na tela)</p>
    </fieldset>

    <!-- Input do tipo Image -->
    <fieldset>
      <legend>Input do Tipo Image</legend>
      <p>Este input envia o formulário ao clicar na imagem. Certifique-se de ter uma imagem válida.</p>
      <input type="image" src="https://via.placeholder.com/150" alt="Enviar Formulário" name="imagem">
    </fieldset>

    <!-- Arquivo -->
    <fieldset>
      <legend>Upload de Arquivo</legend>
      <label for="arquivo">Selecione um arquivo:</label>
      <input type="file" id="arquivo" name="arquivo" accept=".jpg, .jpeg, .png" multiple>
    </fieldset>

    <!-- Data e Hora -->
    <fieldset>
      <legend>Data e Hora</legend>
      <label for="data">Data:</label>
      <input type="date" id="data" name="data">

      <label for="hora">Hora:</label>
      <input type="time" id="hora" name="hora">

      <label for="datetime">Data e Hora Local:</label>
      <input type="datetime-local" id="datetime" name="datetime">

      <label for="mes">Mês (Ano e Mês):</label>
      <input type="month" id="mes" name="mes">

      <label for="semana">Semana:</label>
      <input type="week" id="semana" name="semana">
    </fieldset>

    <!-- Números e Range -->
    <fieldset>
      <legend>Números e Intervalos</legend>
      <label for="numero">Número:</label>
      <input type="number" id="numero" name="numero" min="0" max="100" step="1" value="50">

      <label for="range">Range (Slider):</label>
      <input type="range" id="range" name="range" min="0" max="100" step="5" value="50">
    </fieldset>

    <!-- Email, URL, Search e Telefone -->
    <fieldset>
      <legend>Contatos e Pesquisa</legend>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" placeholder="exemplo@dominio.com">

      <label for="url">URL:</label>
      <input type="url" id="url" name="url" placeholder="https://www.exemplo.com">

      <label for="search">Pesquisar:</label>
      <input type="search" id="search" name="search" placeholder="Digite sua pesquisa">

      <label for="tel">Telefone:</label>
      <input type="tel" id="tel" name="tel" placeholder="(00) 0000-0000">
    </fieldset>

    <!-- Cor -->
    <fieldset>
      <legend>Seleção de Cor</legend>
      <label for="cor">Cor:</label>
      <input type="color" id="cor" name="cor" value="#ff0000">
    </fieldset>
  </form>
</body>
</html>

```

---

## 5. Informações Adicionais

- **Customização e Validação:**
    
    Cada input pode ser estilizado com CSS e enriquecido com validações via JavaScript. Os atributos nativos, como `required`, `pattern`, `min`, `max` e `step`, auxiliam na validação básica, enquanto frameworks podem oferecer interações mais avançadas.
    
- **Acessibilidade:**
    
    A associação dos inputs com elementos `<label>` é fundamental para melhorar a acessibilidade, permitindo que tecnologias assistivas interpretem corretamente os formulários.
    
- **Compatibilidade:**
    
    Embora a maioria dos navegadores modernos suporte esses tipos de input, é importante testar a compatibilidade, especialmente para inputs mais recentes (como `datetime-local`, `month` e `week`).
    

---

## 6. Referências para Estudo

- citeMDN-InputHTML: [MDN Web Docs - `<input>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input)
- citeW3C-HTML5Spec: [W3C HTML5 Specification](https://www.w3.org/TR/html52/sec-forms.html#the-input-element)
- citeHTML5Rocks: Artigos e tutoriais sobre HTML5 e formulários interativos.

---

## 7. Conclusão

O HTML5 expande significativamente as possibilidades de interação com formulários por meio dos diversos tipos de `<input>`. Cada tipo possui características específicas que facilitam a validação, a personalização e a melhoria da experiência do usuário. Compreender as particularidades de cada um permite a criação de interfaces mais eficientes, acessíveis e modernas, atendendo a diferentes cenários e necessidades do desenvolvimento web.