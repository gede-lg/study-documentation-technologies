# requestAnimationFrame: Animações Otimizadas

## 🎯 Introdução

`requestAnimationFrame()` é uma API do browser otimizada para **animações suaves**, sincronizando execução com a **taxa de atualização da tela** (~60 FPS). É mais eficiente que `setTimeout` para animações visuais.

### Por Que Usar

- **Sincronizado com display:** Executa antes de repaint
- **60 FPS ideal:** ~16.67ms entre frames
- **Pausado em background:** Economiza bateria/CPU
- **Smoother animations:** Sem tearing ou jank
- **Otimizado:** Browser controla timing

---

## 📋 Características

- **Taxa variável:** Adapta à capacidade do dispositivo
- **Callback recebe timestamp:** Tempo preciso
- **Cancelável:** Via `cancelAnimationFrame()`
- **Uma vez por frame:** Não acumula execuções
- **Browser-only:** Não existe em Node.js

---

## 🧠 Fundamentos

### Sintaxe Básica

```javascript
console.log("=== requestAnimationFrame BÁSICO ===\n");

let frame = 0;

function animar(timestamp) {
    frame++;
    console.log(`Frame ${frame} em ${timestamp.toFixed(2)}ms`);
    
    if (frame < 5) {
        requestAnimationFrame(animar);
    } else {
        console.log("Animação concluída!");
    }
}

// Inicia animação
requestAnimationFrame(animar);

// Executa ~5 vezes (a cada ~16ms se 60 FPS)
```

### cancelAnimationFrame

```javascript
console.log("\n=== cancelAnimationFrame ===\n");

let animationId;

function animar() {
    console.log("Animando...");
    animationId = requestAnimationFrame(animar);
}

animationId = requestAnimationFrame(animar);

// Cancela após 100ms
setTimeout(() => {
    cancelAnimationFrame(animationId);
    console.log("Animação cancelada!");
}, 100);
```

### Timestamp Preciso

```javascript
console.log("\n=== TIMESTAMP ===\n");

let ultimoTimestamp = 0;

function animar(timestamp) {
    if (ultimoTimestamp) {
        const delta = timestamp - ultimoTimestamp;
        console.log(`Delta: ${delta.toFixed(2)}ms (~${(1000/delta).toFixed(1)} FPS)`);
    }
    
    ultimoTimestamp = timestamp;
    
    if (timestamp < 200) {
        requestAnimationFrame(animar);
    }
}

requestAnimationFrame(animar);
```

---

## 🔍 requestAnimationFrame vs setTimeout

### Comparação

```javascript
console.log("\n=== RAF vs setTimeout ===\n");

console.log("setTimeout para animação:");
console.log("❌ Não sincronizado com display");
console.log("❌ Pode causar frames perdidos");
console.log("❌ Continua rodando em background");
console.log("❌ Taxa fixa (pode ser demais ou de menos)");

console.log("\nrequestAnimationFrame:");
console.log("✅ Sincronizado com refresh rate");
console.log("✅ Otimizado pelo browser");
console.log("✅ Pausa em tabs inativas");
console.log("✅ Taxa adaptativa");
```

### Exemplo Comparativo

```javascript
console.log("\n=== EXEMPLO COMPARATIVO ===\n");

// ❌ Com setTimeout (não ideal)
let posicaoSetTimeout = 0;

function animarComSetTimeout() {
    posicaoSetTimeout += 1;
    // Atualizar DOM...
    
    if (posicaoSetTimeout < 100) {
        setTimeout(animarComSetTimeout, 16); // Tenta 60 FPS
    }
}

// ✅ Com requestAnimationFrame (ideal)
let posicaoRAF = 0;

function animarComRAF(timestamp) {
    posicaoRAF += 1;
    // Atualizar DOM...
    
    if (posicaoRAF < 100) {
        requestAnimationFrame(animarComRAF);
    }
}

// requestAnimationFrame(animarComRAF);
```

---

## 🎯 Padrões Práticos

### Animação com Delta Time

```javascript
console.log("\n=== DELTA TIME ===\n");

class AnimacaoSuave {
    constructor() {
        this.posicao = 0;
        this.velocidade = 100; // pixels por segundo
        this.ultimoTimestamp = null;
    }
    
    animar(timestamp) {
        if (!this.ultimoTimestamp) {
            this.ultimoTimestamp = timestamp;
        }
        
        const deltaSegundos = (timestamp - this.ultimoTimestamp) / 1000;
        this.posicao += this.velocidade * deltaSegundos;
        
        console.log(`Posição: ${this.posicao.toFixed(2)}px`);
        
        this.ultimoTimestamp = timestamp;
        
        if (this.posicao < 500) {
            requestAnimationFrame(t => this.animar(t));
        }
    }
    
    iniciar() {
        requestAnimationFrame(t => this.animar(t));
    }
}

const anim = new AnimacaoSuave();
// anim.iniciar();

// Movimento independente de frame rate!
```

### Parallax Effect

```javascript
console.log("\n=== PARALLAX EFFECT ===\n");

class Parallax {
    constructor() {
        this.camadas = [
            { velocidade: 0.2, posicao: 0 },
            { velocidade: 0.5, posicao: 0 },
            { velocidade: 1.0, posicao: 0 }
        ];
        this.scroll = 0;
    }
    
    atualizar() {
        this.camadas.forEach((camada, i) => {
            camada.posicao = this.scroll * camada.velocidade;
            console.log(`Camada ${i}: ${camada.posicao.toFixed(2)}px`);
        });
        
        requestAnimationFrame(() => this.atualizar());
    }
    
    onScroll(valor) {
        this.scroll = valor;
    }
}

// const parallax = new Parallax();
// parallax.atualizar();
```

### FPS Counter

```javascript
console.log("\n=== FPS COUNTER ===\n");

class FPSCounter {
    constructor() {
        this.frames = [];
        this.fps = 0;
    }
    
    calcular(timestamp) {
        this.frames.push(timestamp);
        
        // Remove frames antigos (>1 segundo)
        while (this.frames.length > 0 && 
               this.frames[0] <= timestamp - 1000) {
            this.frames.shift();
        }
        
        this.fps = this.frames.length;
        
        if (timestamp % 1000 < 20) { // Log a cada ~1 segundo
            console.log(`FPS: ${this.fps}`);
        }
        
        requestAnimationFrame(t => this.calcular(t));
    }
    
    iniciar() {
        requestAnimationFrame(t => this.calcular(t));
    }
}

// const fpsCounter = new FPSCounter();
// fpsCounter.iniciar();
```

### Easing Functions

```javascript
console.log("\n=== EASING FUNCTIONS ===\n");

const easing = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t
};

function animar(inicio, fim, duracao, easingFunc, callback) {
    const startTime = performance.now();
    
    function frame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duracao, 1);
        const easedProgress = easingFunc(progress);
        
        const valor = inicio + (fim - inicio) * easedProgress;
        callback(valor);
        
        if (progress < 1) {
            requestAnimationFrame(frame);
        }
    }
    
    requestAnimationFrame(frame);
}

// Exemplo de uso:
animar(0, 100, 1000, easing.easeOutQuad, (valor) => {
    console.log(`Valor: ${valor.toFixed(2)}`);
});
```

---

## 🚀 Exemplo Completo

```javascript
console.log("\n=== GAME LOOP COMPLETO ===\n");

class GameLoop {
    constructor() {
        this.rodando = false;
        this.ultimoTimestamp = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
    }
    
    iniciar() {
        if (this.rodando) return;
        
        this.rodando = true;
        this.ultimoTimestamp = performance.now();
        requestAnimationFrame(t => this.loop(t));
        
        console.log("🎮 Game loop iniciado");
    }
    
    parar() {
        this.rodando = false;
        console.log("⏸️ Game loop pausado");
    }
    
    loop(timestamp) {
        if (!this.rodando) return;
        
        const delta = timestamp - this.ultimoTimestamp;
        this.ultimoTimestamp = timestamp;
        
        // Atualizar FPS
        this.frameCount++;
        if (timestamp - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = timestamp;
            
            console.log(`FPS: ${this.fps}`);
        }
        
        // Atualizar game state
        this.atualizar(delta);
        
        // Renderizar
        this.renderizar();
        
        // Próximo frame
        requestAnimationFrame(t => this.loop(t));
    }
    
    atualizar(delta) {
        // Lógica do jogo
        // console.log(`Delta: ${delta.toFixed(2)}ms`);
    }
    
    renderizar() {
        // Desenhar na tela
    }
}

const game = new GameLoop();
game.iniciar();

setTimeout(() => {
    game.parar();
}, 3000);
```

---

## ⚠️ Armadilhas

```javascript
console.log("\n=== ARMADILHAS ===\n");

// ❌ Não funciona em Node.js
console.log("requestAnimationFrame só existe no browser!");

// ❌ Esquecer de chamar novamente
function animarErrado(timestamp) {
    console.log("Executa só uma vez!");
    // Faltou: requestAnimationFrame(animarErrado);
}

// ✅ Chamar recursivamente
function animarCorreto(timestamp) {
    console.log("Loop de animação");
    requestAnimationFrame(animarCorreto);
}

// ❌ Operações pesadas bloqueiam
function animarBloqueante() {
    // Loop pesado - bloqueia frame
    for (let i = 0; i < 1000000000; i++) {}
    requestAnimationFrame(animarBloqueante);
}
// Resultado: FPS cai drasticamente

// ✅ Manter processamento leve
function animarOtimizado() {
    // Processamento rápido
    requestAnimationFrame(animarOtimizado);
}
```

---

## 📚 Conclusão

`requestAnimationFrame` é **essencial** para animações suaves no browser:

**Pontos-chave:**

- **60 FPS ideal:** Sincronizado com display
- **Otimizado:** Browser controla timing
- **Pausa automática:** Em tabs inativas
- **Delta time:** Use para movimento independente de FPS
- **Cancelável:** Via cancelAnimationFrame()
- **Use para:** Animações, game loops, transições visuais
- **Evite:** Operações pesadas no callback

Sempre prefira `requestAnimationFrame` ao invés de `setTimeout`/`setInterval` para **qualquer animação visual**!
