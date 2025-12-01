# Eventos nativos

### Mouse Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `click` | Clique com o botão primário | `(click)="onClick()"` | `<button (click)="onClick()">Clique</button>` |
| `dblclick` | Duplo clique | `(dblclick)="onDblClick()"` | `<div (dblclick)="onDblClick()">Duplo</div>` |
| `mousedown` | Pressionar qualquer botão do mouse | `(mousedown)="onMouseDown()"` | `<div (mousedown)="onMouseDown()">Pressione</div>` |
| `mouseup` | Soltar o botão do mouse | `(mouseup)="onMouseUp()"` | `<div (mouseup)="onMouseUp()">Solte</div>` |
| `mouseenter` | Cursor entra no elemento (não propaga para filhos) | `(mouseenter)="onEnter()"` | `<div (mouseenter)="onEnter()">Entrou</div>` |
| `mouseleave` | Cursor sai do elemento (não propaga para filhos) | `(mouseleave)="onLeave()"` | `<div (mouseleave)="onLeave()">Saiu</div>` |
| `mouseover` | Cursor passa sobre o elemento ou seus filhos | `(mouseover)="onOver()"` | `<div (mouseover)="onOver()">Mouse Over</div>` |
| `mouseout` | Cursor retira-se do elemento ou seus filhos | `(mouseout)="onOut()"` | `<div (mouseout)="onOut()">Mouse Out</div>` |
| `contextmenu` | Clique com botão direito (abre menu de contexto) | `(contextmenu)="onContext($event)"` | `<div (contextmenu)="onContext($event)">Menu</div>` |
| **Adicionais** |  |  |  |
| `auxclick` | Clique com botões auxiliares (scroll wheel, etc.) | `(auxclick)="onAuxClick($event)"` | `<div (auxclick)="onAuxClick($event)">Aux</div>` |
| `wheel` | Roda o scroll wheel | `(wheel)="onWheel($event)"` | `<div (wheel)="onWheel($event)">Scroll</div>` |
| `mousewheel` | (Legado) equívoco de vários navegadores para `wheel` | `(mousewheel)="onMouseWheel($event)"` | `<div (mousewheel)="onMouseWheel($event)">Antigo Scroll</div>` |

---

### Keyboard Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `keydown` | Tecla pressionada | `(keydown)="onKeyDown($event)"` | `<input (keydown)="onKeyDown($event)" />` |
| `keyup` | Tecla solta | `(keyup)="onKeyUp($event)"` | `<input (keyup)="onKeyUp($event)" />` |
| `keypress` | Enquanto mantém a tecla pressionada | `(keypress)="onKeyPress($event)"` | `<input (keypress)="onKeyPress($event)" />` |
| **Composição** |  |  |  |
| `compositionstart` | Início de composição de texto (IME) | `(compositionstart)="onCompStart($e)"` | `<input (compositionstart)="onCompStart($event)" />` |
| `compositionupdate` | Atualização durante composição | `(compositionupdate)="onCompUpd($e)"` | `<input (compositionupdate)="onCompUpd($event)" />` |
| `compositionend` | Fim da composição de texto | `(compositionend)="onCompEnd($e)"` | `<input (compositionend)="onCompEnd($event)" />` |

---

### Form Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `input` | A cada alteração de valor em `<input>` ou `<textarea>` | `(input)="onInput($event)"` | `<input (input)="onInput($event)" />` |
| `change` | Quando o valor muda e perde foco | `(change)="onChange($event)"` | `<select (change)="onChange($event)"><option>...</option></select>` |
| `submit` | Envio de formulário | `(submit)="onSubmit($event)"` | `<form (submit)="onSubmit($event)"><button>Enviar</button></form>` |
| `reset` | Reset de formulário | `(reset)="onReset($event)"` | `<form (reset)="onReset($event)"><button>Reset</button></form>` |
| `focus` | Elemento recebe foco | `(focus)="onFocus()"` | `<input (focus)="onFocus()" />` |
| `blur` | Elemento perde foco | `(blur)="onBlur()"` | `<input (blur)="onBlur()" />` |
| **Adicional** |  |  |  |
| `invalid` | Quando validação falha antes do envio | `(invalid)="onInvalid($event)"` | `<input required (invalid)="onInvalid($event)" />` |

---

### Focus Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `focusin` | Foco entra no elemento ou em qualquer filho | `(focusin)="onFocusIn($event)"` | `<div (focusin)="onFocusIn($event)" tabindex="0">Foco In</div>` |
| `focusout` | Foco sai do elemento ou de qualquer filho | `(focusout)="onFocusOut($event)"` | `<div (focusout)="onFocusOut($event)" tabindex="0">Foco Out</div>` |

---

### Window/Document Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `load` | Página e recursos totalmente carregados | `(window:load)="onLoad()"` | `<div (window:load)="onLoad()">Carregado</div>` |
| `beforeunload` | Antes de sair ou atualizar a página | `(window:beforeunload)="onBeforeUnload($e)"` | `<div (window:beforeunload)="onBeforeUnload($event)">Confirmar</div>` |
| `unload` | Após descarregar a página | `(window:unload)="onUnload()"` | `<div (window:unload)="onUnload()">Saindo</div>` |
| `resize` | Ao redimensionar a janela | `(window:resize)="onResize($event)"` | `<div (window:resize)="onResize($event)">Resize</div>` |
| `scroll` | Ao rolar janela ou elemento | `(window:scroll)="onScroll($event)"` | `<div (window:scroll)="onScroll($event)">Scroll</div>` |
| **Adicionais** |  |  |  |
| `hashchange` | Quando a parte “#” da URL muda | `(window:hashchange)="onHashChange($e)"` | `<div (window:hashchange)="onHashChange($event)">Hash</div>` |
| `popstate` | Ao navegar via histórico (back/forward) | `(window:popstate)="onPopState($e)"` | `<div (window:popstate)="onPopState($event)">History</div>` |
| `online` | Quando conexão volta | `(window:online)="onOnline()"` | `<div (window:online)="onOnline()">Online</div>` |
| `offline` | Quando conexão cai | `(window:offline)="onOffline()"` | `<div (window:offline)="onOffline()">Offline</div>` |
| `visibilitychange` | Página torna-se visível/oculta | `(document:visibilitychange)="onVisChange()"` | `<div (document:visibilitychange)="onVisChange()">Visibilidade</div>` |
| `storage` | Quando outra aba altera localStorage/sessionStorage | `(window:storage)="onStorage($event)"` | `<div (window:storage)="onStorage($event)">Storage</div>` |

---

### Touch & Pointer Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `touchstart` | Início do toque | `(touchstart)="onTouchStart($event)"` | `<div (touchstart)="onTouchStart($event)">Tocar</div>` |
| `touchmove` | Deslizar o dedo | `(touchmove)="onTouchMove($event)"` | `<div (touchmove)="onTouchMove($event)">Move</div>` |
| `touchend` | Fim do toque | `(touchend)="onTouchEnd($event)"` | `<div (touchend)="onTouchEnd($event)">Fim</div>` |
| `touchcancel` | Toque cancelado (ex.: alerta) | `(touchcancel)="onTouchCancel($e)"` | `<div (touchcancel)="onTouchCancel($event)">Cancel</div>` |
| **Pointer Básicos** |  |  |  |
| `pointerdown` | Ao pressionar dispositivo apontador | `(pointerdown)="onPointerDown($e)"` | `<div (pointerdown)="onPointerDown($event)">Down</div>` |
| `pointermove` | Ao mover dispositivo apontador | `(pointermove)="onPointerMove($e)"` | `<div (pointermove)="onPointerMove($event)">Move</div>` |
| `pointerup` | Ao soltar dispositivo apontador | `(pointerup)="onPointerUp($e)"` | `<div (pointerup)="onPointerUp($event)">Up</div>` |
| `pointercancel` | Cancelamento do apontador | `(pointercancel)="onPointerCancel($e)"` | `<div (pointercancel)="onPointerCancel($event)">Cancel</div>` |
| **Pointer Avançados** |  |  |  |
| `pointerenter` | Semelhante a `mouseenter`, mas para pointer | `(pointerenter)="onPtrEnter($e)"` | `<div (pointerenter)="onPtrEnter($event)">Enter</div>` |
| `pointerleave` | Semelhante a `mouseleave`, mas para pointer | `(pointerleave)="onPtrLeave($e)"` | `<div (pointerleave)="onPtrLeave($event)">Leave</div>` |
| `gotpointercapture` | Quando elemento “captura” o pointer | `(gotpointercapture)="onGotCapture($e)"` | `<div (gotpointercapture)="onGotCapture($event)">Got</div>` |
| `lostpointercapture` | Quando elemento perde captura do pointer | `(lostpointercapture)="onLostCapture($e)"` | `<div (lostpointercapture)="onLostCapture($event)">Lost</div>` |

---

### Drag & Drop Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `dragstart` | Início do arraste | `(dragstart)="onDragStart($event)"` | `<div draggable="true" (dragstart)="onDragStart($event)">Arrastar</div>` |
| `drag` | Durante o arraste | `(drag)="onDrag($event)"` | `<div draggable="true" (drag)="onDrag($event)">Movendo</div>` |
| `dragend` | Fim do arraste | `(dragend)="onDragEnd($event)"` | `<div draggable="true" (dragend)="onDragEnd($event)">Soltou</div>` |
| `dragenter` | Item entra na área-alvo | `(dragenter)="onDragEnter($event)"` | `<div (dragenter)="onDragEnter($event)">Entrou</div>` |
| `dragover` | Enquanto item sobre a área-alvo | `(dragover)="onDragOver($event)"` | `<div (dragover)="onDragOver($event)">Sobre</div>` |
| `dragleave` | Item sai da área-alvo | `(dragleave)="onDragLeave($event)"` | `<div (dragleave)="onDragLeave($event)">Saiu</div>` |
| `drop` | Item solto na área-alvo | `(drop)="onDrop($event)"` | `<div (drop)="onDrop($event)">Soltar Aqui</div>` |

---

### Clipboard Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `copy` | Ao copiar (Ctrl+C / menu) | `(copy)="onCopy($event)"` | `<input (copy)="onCopy($event)" />` |
| `cut` | Ao recortar (Ctrl+X / menu) | `(cut)="onCut($event)"` | `<input (cut)="onCut($event)" />` |
| `paste` | Ao colar (Ctrl+V / menu) | `(paste)="onPaste($event)"` | `<input (paste)="onPaste($event)" />` |
| **Adicionais** |  |  |  |
| `beforecopy` | Antes de copiar | `(document:beforecopy)="onBeforeCopy()"` | `<div (document:beforecopy)="onBeforeCopy()">Antes Copy</div>` |
| `beforecut` | Antes de recortar | `(document:beforecut)="onBeforeCut()"` | `<div (document:beforecut)="onBeforeCut()">Antes Cut</div>` |
| `beforepaste` | Antes de colar | `(document:beforepaste)="onBeforePaste()"` | `<div (document:beforepaste)="onBeforePaste()">Antes Paste</div>` |

---

### Media Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `play` | Início da reprodução | `(play)="onPlay()"` | `<video (play)="onPlay()" src="…"></video>` |
| `pause` | Pausa da reprodução | `(pause)="onPause()"` | `<audio (pause)="onPause()" src="…"></audio>` |
| `ended` | Fim da reprodução | `(ended)="onEnded()"` | `<video (ended)="onEnded()" src="…"></video>` |
| `timeupdate` | A cada frame de reprodução | `(timeupdate)="onTimeUpdate($event)"` | `<video (timeupdate)="onTimeUpdate($event)" src="…"></video>` |
| `volumechange` | Alteração do volume | `(volumechange)="onVolumeChange($event)"` | `<audio (volumechange)="onVolumeChange($event)" src="…"></audio>` |
| `loadeddata` | Quando dados suficientes carregados | `(loadeddata)="onLoadedData($event)"` | `<video (loadeddata)="onLoadedData($event)" src="…"></video>` |
| `canplay` | Mídia pode começar sem interrupções | `(canplay)="onCanPlay()"` | `<video (canplay)="onCanPlay()" src="…"></video>` |
| **Adicionais** |  |  |  |
| `durationchange` | Mudança na duração do recurso | `(durationchange)="onDurationChange()"` | `<audio (durationchange)="onDurationChange()">…</audio>` |
| `progress` | Progresso no download/carregamento | `(progress)="onProgress($event)"` | `<video (progress)="onProgress($event)" src="…"></video>` |
| `seeking` | Início de busca (seek) | `(seeking)="onSeeking()"` | `<video (seeking)="onSeeking()">…</video>` |
| `seeked` | Fim da busca | `(seeked)="onSeeked()"` | `<video (seeked)="onSeeked()">…</video>` |
| `stalled` | Buffer insuficiente | `(stalled)="onStalled()"` | `<video (stalled)="onStalled()">…</video>` |
| `suspend` | Suspensão de download | `(suspend)="onSuspend()"` | `<video (suspend)="onSuspend()">…</video>` |
| `ratechange` | Alteração da velocidade de reprodução | `(ratechange)="onRateChange()"` | `<audio (ratechange)="onRateChange()">…</audio>` |
| `loadedmetadata` | Metadados (como duração) carregados | `(loadedmetadata)="onLoadedMeta()"` | `<video (loadedmetadata)="onLoadedMeta()">…</video>` |
| `canplaythrough` | Pode tocar até o fim sem interrupção | `(canplaythrough)="onCanPlayThrough()"` | `<video (canplaythrough)="onCanPlayThrough()">…</video>` |

---

### Animation & Transition Events

| Evento | Descrição | Sintaxe | Exemplo |
| --- | --- | --- | --- |
| `animationstart` | Início de animação CSS | `(animationstart)="onAnimStart($e)"` | `<div (animationstart)="onAnimStart($event)" class="anim">…</div>` |
| `animationend` | Fim da animação CSS | `(animationend)="onAnimEnd($e)"` | `<div (animationend)="onAnimEnd($event)" class="anim">…</div>` |
| `animationiteration` | Cada iteração em animação repetida | `(animationiteration)="onIter($e)"` | `<div (animationiteration)="onIter($event)" class="anim">…</div>` |
| `transitionstart` | Início de transição CSS | `(transitionstart)="onTransStart($e)"` | `<div (transitionstart)="onTransStart($event)" class="trans">…</div>` |
| `transitionend` | Fim da transição CSS | `(transitionend)="onTransEnd($e)"` | `<div (transitionend)="onTransEnd($event)" class="trans">…</div>` |

---

Dessa forma, cobrimos praticamente **todos** os eventos nativos que você pode associar via Event Binding no Angular. Se precisar de algo mais específico ou de outros exemplos, só avisar!