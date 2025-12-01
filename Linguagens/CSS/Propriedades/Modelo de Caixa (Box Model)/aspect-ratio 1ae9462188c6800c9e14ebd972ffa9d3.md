# aspect-ratio

A propriedade **`aspect-ratio`** no CSS define a proporção entre a largura e a altura de um elemento. Isso permite que você controle a relação de aspecto sem precisar definir explicitamente `width` e `height`, tornando o layout mais responsivo e previsível.

---

### **Sintaxe:**

```css
element {
  aspect-ratio: width / height;
}

```

Ou seja, `aspect-ratio: 16 / 9;` significa que o elemento terá uma proporção de **16:9** (como em muitos vídeos e telas de dispositivos).

---

### **Exemplos de Uso**

### **1. Criar um Contêiner com Proporção 16:9**

```css
.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: lightgray;
}

```

Isso garante que a altura seja ajustada automaticamente para manter a proporção 16:9.

### **2. Imagens Responsivas sem `height` Fixo**

```css
img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

```

Aqui, a imagem manterá a proporção 4:3 e será cortada se necessário para preencher o espaço.

### **3. Criar um Quadrado Dinâmico**

```css
.square {
  width: 50%;
  aspect-ratio: 1 / 1;
  background-color: tomato;
}

```

Isso gera um quadrado sempre proporcional, independentemente do tamanho da tela.

---

### **Compatibilidade**

✅ Suportado na maioria dos navegadores modernos (Chrome, Firefox, Edge, Safari 15+, etc.).

🔴 **Não funciona no IE11 ou versões muito antigas do Safari.** Se precisar de compatibilidade, pode-se usar um **hack com `padding-top`**.

---

### **Alternativa para Browsers Antigos**

Caso precise suportar navegadores que não têm `aspect-ratio`, pode usar `padding` para criar a mesma proporção:

```css
.aspect-ratio-box {
  width: 100%;
  padding-top: 56.25%; /* 16:9 => 9/16 * 100 */
  position: relative;
}

.aspect-ratio-box > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

```

---

### **Resumo**

- 🟢 Facilita layouts responsivos.
- 🟢 Elimina a necessidade de hacks como `padding-top`.
- 🟢 Perfeito para vídeos, imagens e elementos dimensionados proporcionalmente.
- 🔴 Não funciona em navegadores antigos como o Internet Explorer.

🚀 **Conclusão:** Se estiver criando layouts modernos, **`aspect-ratio`** é uma excelente ferramenta para manter a proporção dos elementos de forma simples e eficiente!