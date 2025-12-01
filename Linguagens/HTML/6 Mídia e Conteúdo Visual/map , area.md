# <map>, <area>

**1. Introdução**

As tags `<map>` e `<area>` em HTML5 são utilizadas para criar **mapas de imagem**, permitindo que áreas específicas de uma imagem sejam clicáveis e direcionem o usuário a diferentes links ou ações. Essas tags são essenciais para criar interatividade em infográficos, diagramas técnicos, mapas geográficos ou qualquer imagem que exija múltiplas ações dependendo da região clicada. Embora menos comuns em layouts modernos (devido à popularidade de CSS e SVG), ainda são úteis em cenários específicos.

---

**2. Sumário**

1. Definição e conceitos fundamentais
2. Sintaxe e estrutura
3. Componentes principais
4. Atributos específicos
5. Uso avançado
6. Exemplos práticos
7. Informações adicionais
8. Referências para estudo

---

**3. Conteúdo Detalhado**

### **3.1 Definição e Conceitos Fundamentais**

- **`<map>`**: Define um mapa de imagem, vinculado a uma imagem via atributo `usemap`.
- **`<area>`**: Define regiões clicáveis dentro do `<map>`, com formas geométricas (retângulo, círculo, polígono).

**Conceitos Básicos**:

- Associar uma imagem a um mapa.
- Definir áreas clicáveis com coordenadas.

**Conceitos Avançados**:

- Integração com JavaScript para dinamismo.
- Técnicas responsivas para ajuste de coordenadas.

---

### **3.2 Sintaxe e Estrutura**

```html
<img src="imagem.jpg" alt="Descrição" usemap="#nome-mapa">

<map name="nome-mapa">
  <area shape="rect" coords="x1,y1,x2,y2" href="link1" alt="Descrição 1">
  <area shape="circle" coords="x,y,raio" href="link2" alt="Descrição 2">
</map>

```

---

### **3.3 Componentes Principais**

1. **Imagem (`<img>`)**
    - Vinculada ao `<map>` via `usemap="#nome-mapa"`.
2. **Mapa (`<map>`)**
    - Contêiner para `<area>`, com atributo `name` único.
3. **Áreas (`<area>`)**
    - Definem forma, coordenadas e ação (link).

---

### **3.4 Atributos Específicos**

**Para `<map>`:**

- `name` (obrigatório): Identificador do mapa.

**Para `<area>`:**

- `shape`: Define a forma (`rect`, `circle`, `poly`, `default`).
- `coords`: Coordenadas da área (varia conforme a forma):
    - **rect**: `x1,y1,x2,y2` (canto superior esquerdo e inferior direito).
    - **circle**: `x,y,raio` (centro e raio).
    - **poly**: `x1,y1,x2,y2,...,xn,yn` (pontos do polígono).
- `href`: URL do link.
- `alt`: Texto alternativo (obrigatório para acessibilidade).
- `target`: Define onde abrir o link (`_blank`, `_self`, etc.).
- `download`: Força o download do recurso.

---

### **3.5 Uso Avançado**

1. **Mapas Responsivos**:
    - Ajustar coordenadas via JavaScript conforme o tamanho da tela.
2. **Interatividade com CSS/JS**:
    - Efeitos de hover em áreas usando CSS.
    - Eventos JavaScript (`onclick`, `onmouseover`).
3. **Polígonos Complexos**:
    - Uso de ferramentas para calcular coordenadas de polígonos.

---

**4. Exemplos Práticos**

### **4.1 Exemplo Básico**

```html
<img src="computador.jpg" alt="Computador" usemap="#computador-map">

<map name="computador-map">
  <!-- Tela do computador (retângulo) -->
  <area shape="rect" coords="30,50,270,180" href="telas.html" alt="Telas" target="_blank">

  <!-- Teclado (polígono) -->
  <area shape="poly" coords="50,200,300,200,280,250,70,250" href="teclados.html" alt="Teclados">
</map>

```

### **4.2 Exemplo Avançado (Responsivo com JavaScript)**

```html
<img id="mapa-responsivo" src="mapa.jpg" alt="Mapa" usemap="#mapa-dinamico">

<map name="mapa-dinamico">
  <area shape="circle" id="area-dinamica" href="#" alt="Área ajustável">
</map>

<script>
  function ajustarCoordenadas() {
    const img = document.getElementById('mapa-responsivo');
    const area = document.getElementById('area-dinamica');
    const escala = img.width / 800; // Baseado no tamanho original da imagem
    area.coords = `${100*escala},${150*escala},${50*escala}`;
  }

  window.addEventListener('resize', ajustarCoordenadas);
  ajustarCoordenadas();
</script>

```

---

**5. Informações Adicionais**

- **Acessibilidade**: Sempre inclua `alt` descritivo nas áreas.
- **Precedência**: A primeira área definida tem prioridade em sobreposições.
- **SEO**: Links em mapas de imagem têm menor peso para motores de busca.
- **Ferramentas**: Use editores como GIMP ou GIMP Image Map Plugin para calcular coordenadas.

---

**6. Referências para Estudo**

1. [MDN Web Docs: `<map>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/map)
2. [W3Schools: Image Maps](https://www.w3schools.com/html/html_images_imagemap.asp)
3. [Tutorial de Mapas Responsivos (em inglês)](https://www.sitepoint.com/image-maps-html/)

---

**7. Formatação**

A resposta foi estruturada para facilitar a compreensão gradual, desde conceitos básicos até técnicas avançadas, com exemplos práticos e referências confiáveis.