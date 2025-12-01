# max-height

A propriedade **`max-height`** define a altura máxima que um elemento pode ter. Se o conteúdo ou o tamanho do elemento for maior que esse valor, ele será limitado à altura máxima definida.

---

## **📌 Sintaxe**

```css
element {
  max-height: valor;
}

```

📌 **Valores possíveis:**

- **`none`** (padrão) → Sem limite de altura.
- **Comprimento fixo** (ex: `300px`, `50vh`) → Define um limite absoluto.
- **Porcentagem** (ex: `80%`) → Baseia-se no elemento pai.
- **`inherit`** → Herda do elemento pai.
- **`initial`** → Reseta para o valor padrão (`none`).
- **`unset`** → Reseta para o valor padrão ou herda.

---

## **📌 Exemplos de Uso**

### **1️⃣ Limitar a Altura Máxima de um Contêiner**

```css
.container {
  max-height: 400px;
  overflow: auto; /* Adiciona rolagem se o conteúdo for maior */
  background-color: lightgray;
}

```

🔹 O contêiner nunca será maior que **400px**.

🔹 Se o conteúdo for maior, ele poderá rolar (`overflow: auto;`).

---

### **2️⃣ Garantir que uma Imagem Não Exceda um Tamanho**

```css
img {
  max-height: 500px;
  width: auto;
}

```

🔹 A imagem nunca será maior que **500px** de altura.

🔹 A largura se ajustará automaticamente para manter a proporção.

---

### **3️⃣ Criar um Layout Responsivo**

```css
.box {
  height: 100%;
  max-height: 600px;
  background-color: lightblue;
  padding: 20px;
}

```

🔹 O elemento pode se expandir até **600px**, mas nunca ultrapassará esse valor.

---

## **📌 `max-height` vs. `height`**

| Propriedade | Comportamento |
| --- | --- |
| `height: 600px;` | Sempre mantém **600px**, mesmo se a tela for menor. |
| `max-height: 600px;` | **Adapta-se** se o conteúdo for menor que **600px**, tornando o layout responsivo. |

---

## **📌 Quando Usar?**

✅ Para evitar que um elemento fique **maior que um certo valor**.

✅ Para **permitir rolagem** (`overflow: auto;`) caso o conteúdo exceda a altura máxima.

✅ Para criar **layouts responsivos** que se ajustam dinamicamente.

🚀 **Conclusão:** `max-height` é útil para limitar a altura sem definir um tamanho fixo, tornando os layouts mais flexíveis e responsivos!