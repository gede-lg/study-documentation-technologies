# overflow-anchor

A propriedade **`overflow-anchor`** controla o **scroll anchoring** (ancoragem de rolagem), um recurso do navegador que impede que a página "salte" inesperadamente ao carregar imagens, anúncios ou conteúdos dinâmicos.

---

## **📌 Sintaxe**

```css
element {
  overflow-anchor: auto | none;
}

```

📌 **Valores possíveis:**

- **`auto`** *(padrão)* → Permite a ancoragem automática da rolagem pelo navegador.
- **`none`** → Desativa a ancoragem da rolagem para evitar efeitos indesejados.

---

## **📌 O Que é Scroll Anchoring?**

Quando um site carrega conteúdos dinâmicos (como anúncios ou imagens atrasadas), a posição da rolagem pode mudar inesperadamente. O **scroll anchoring** evita isso, mantendo a posição visual do usuário.

**Exemplo de problema sem `overflow-anchor`:**

1. Você rola para baixo lendo um artigo.
2. Um anúncio acima carrega e empurra o conteúdo para baixo.
3. O usuário perde o ponto onde estava lendo. 😡

✅ O **scroll anchoring** tenta impedir esse comportamento automaticamente.

---

## **📌 Exemplos de Uso**

### **1️⃣ Desativando a Ancoragem em um Elemento**

```css
.chat-box {
  overflow-anchor: none;
  overflow-y: auto;
  height: 400px;
  border: 1px solid #ccc;
}

```

🔹 Em um **chat**, é comum desativar a ancoragem para evitar que o usuário perca a rolagem automática para novas mensagens.

---

### **2️⃣ Evitando Ancoragem em um Carrossel**

```css
.carousel {
  overflow-anchor: none;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

```

🔹 Em **carrosséis de imagens**, a rolagem pode ser afetada pela ancoragem automática, então desativamos.

---

## **📌 Compatibilidade**

✅ Suportado na maioria dos navegadores modernos (Chrome, Edge, Firefox, Safari 17+).

❌ **Internet Explorer não suporta.**

---

## **📌 Quando Usar?**

✅ Para **evitar saltos de rolagem inesperados**.

✅ Para **desativar a ancoragem em elementos como chats, carrosséis ou sliders**.

✅ Para **ter maior controle sobre o comportamento da rolagem**.

🚀 **Conclusão:** `overflow-anchor` ajuda a melhorar a **experiência do usuário** ao controlar a rolagem, especialmente em **conteúdos dinâmicos e interativos**!