# 🎯 Introdução

Progress tracking representa componente crítico de user experience em operações de file transfer: fornecer feedback visual em tempo real sobre progresso de uploads e downloads, transformando espera passiva em experiência informativa que reduz ansiedade do usuário e comunica que aplicação está funcionando. Sem progress tracking, uploads de 500MB parecem travados, frustrando usuários que podem abandonar operação ou pensar que app falhou.

O problema que progress tracking resolve é **information void** durante operações longas: quando usuário inicia upload de vídeo de 2GB ou download de dataset de 1GB, operação pode levar minutos ou horas dependendo de conexão. Sem feedback, usuário não sabe: operação ainda está rodando? Quanto tempo falta? Vale a pena esperar ou cancelar? Progress tracking responde estas questões via percentual completado, velocidade de transfer, tempo estimado restante.

Axios fornece progress tracking via **callbacks especiais**: `onUploadProgress` para uploads e `onDownloadProgress` para downloads. Estes callbacks são invocados periodicamente durante transfer com objeto `ProgressEvent` contendo `loaded` (bytes transferidos) e `total` (bytes totais), permitindo calcular percentual. Implementation é event-driven: Axios usa XMLHttpRequest progress events (browser) ou stream events (Node.js) para acionar callbacks conforme chunks de dados são transferidos.

Entretanto, progress tracking tem nuances: `total` pode ser `undefined` se server não envia `Content-Length` header, progress pode não ser linear (compression, buffering), e percentual não reflete processing server-side pós-upload. Implementations robustas devem handle indeterminate progress (total desconhecido), exibir fallback UI (spinner), e comunicar claramente que barra de progresso refere-se a transfer, não processing total.

Este módulo explora progress tracking com Axios em profundidade: desde conceitos fundamentais de ProgressEvent e callbacks, através de implementações de progress bars e upload/download indicators, até patterns avançados de throttling (evitar UI updates excessivos), integration com libraries de UI (react-circular-progressbar, nprogress), e handling de edge cases (indeterminate progress, concurrent transfers). Objetivo é capacitar você a implementar progress tracking que transforma file transfers em experiências transparentes e user-friendly.

---

# 📋 Sumário

### **Fundamentos de Progress Tracking**
- Problema resolvido por progress tracking
- ProgressEvent API
- loaded vs total bytes
- Cálculo de percentual

### **onUploadProgress**
- Callback durante uploads
- ProgressEvent properties
- Calculando percentual de upload
- Integration com FormData uploads

### **onDownloadProgress**
- Callback durante downloads
- Diferenças vs upload progress
- Content-Length dependency
- Handling de indeterminate progress

### **Implementação de Progress Bar**
- HTML progress element
- Custom progress bar CSS
- Updating progress UI
- Percentual display

### **Upload Progress Example**
- File upload com progress bar
- Real-time percentual update
- Speed calculation
- Time remaining estimation

### **Download Progress Example**
- File download com progress
- responseType: 'blob' compatibility
- Progress bar durante download

### **Advanced Progress Patterns**
- Throttling de UI updates
- Multiple file progress tracking
- Concurrent uploads/downloads progress
- Global progress indicator

### **Best Practices**
- User feedback durante transfer
- Handling de indeterminate progress
- Performance considerations (throttling)
- Accessibility (ARIA attributes)

---

# 🧠 Fundamentos

## Problema Resolvido por Progress Tracking

**Information Void**: Sem progress tracking, usuários não sabem se operação está progredindo ou travada.

**User Anxiety**: Espera sem feedback causa ansiedade, leading a abandono de operação.

**Perceived Performance**: Progress bars fazem espera parecer mais curta (psicologia).

**Decision Making**: Usuário pode decidir se vale esperar baseado em tempo estimado.

## ProgressEvent API

**ProgressEvent**: Evento disparado periodicamente durante transferência de dados.

**Properties**:
- `loaded`: Bytes transferidos até agora (number)
- `total`: Total de bytes a transferir (number ou undefined)
- `lengthComputable`: Boolean indicando se `total` é conhecido

```javascript
// Exemplo de ProgressEvent
{
  loaded: 2048576,     // 2MB transferidos
  total: 10485760,     // 10MB total
  lengthComputable: true
}
```

**Cálculo de Percentual**:
```javascript
function calculateProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
    return Math.round(percentComplete);
  }
  return null; // Total desconhecido
}
```

---

# 🔍 Análise

## onUploadProgress

**Callback** invocado durante upload:

```javascript
const formData = new FormData();
formData.append('file', file);

await axios.post('https://api.example.com/upload', formData, {
  onUploadProgress: (progressEvent) => {
    const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
    console.log(`Upload: ${percentComplete}%`);
  }
});
```

**ProgressEvent Properties**:
```javascript
onUploadProgress: (progressEvent) => {
  console.log('Loaded:', progressEvent.loaded);   // Ex: 524288 (512KB)
  console.log('Total:', progressEvent.total);     // Ex: 2097152 (2MB)
  console.log('Computable:', progressEvent.lengthComputable); // true
  
  const percent = (progressEvent.loaded / progressEvent.total) * 100;
  console.log(`${percent.toFixed(2)}%`);
}
```

**Frequency**: Callback é invocado múltiplas vezes (ex: a cada 50-100KB transferidos, dependendo do browser).

## onDownloadProgress

**Callback** invocado durante download:

```javascript
await axios.get('https://api.example.com/download/large-file.zip', {
  responseType: 'blob',
  onDownloadProgress: (progressEvent) => {
    if (progressEvent.lengthComputable) {
      const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      console.log(`Download: ${percentComplete}%`);
    } else {
      console.log(`Downloaded: ${(progressEvent.loaded / 1024 / 1024).toFixed(2)} MB`);
    }
  }
});
```

**Content-Length Dependency**: `total` só é conhecido se server envia `Content-Length` header:

```http
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Length: 10485760

[binary data]
```

**Se Content-Length ausente**:
```javascript
onDownloadProgress: (progressEvent) => {
  if (progressEvent.lengthComputable) {
    // Total conhecido
    const percent = (progressEvent.loaded / progressEvent.total) * 100;
    updateProgressBar(percent);
  } else {
    // Total desconhecido (indeterminate)
    showSpinner(`Downloaded: ${formatBytes(progressEvent.loaded)}`);
  }
}
```

## Implementação de Progress Bar

### **HTML**

```html
<div class="upload-container">
  <input type="file" id="file-input">
  <button id="upload-btn">Upload</button>
  
  <div class="progress-container" id="progress-container" style="display: none;">
    <progress id="progress-bar" max="100" value="0"></progress>
    <span id="progress-text">0%</span>
  </div>
</div>
```

### **CSS**

```css
.progress-container {
  margin-top: 20px;
}

progress {
  width: 100%;
  height: 30px;
  border-radius: 5px;
}

progress::-webkit-progress-bar {
  background-color: #f0f0f0;
  border-radius: 5px;
}

progress::-webkit-progress-value {
  background-color: #4caf50;
  border-radius: 5px;
}

#progress-text {
  display: inline-block;
  margin-top: 10px;
  font-weight: bold;
}
```

### **JavaScript**

```javascript
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Select a file');
    return;
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  // Mostrar progress bar
  progressContainer.style.display = 'block';
  progressBar.value = 0;
  progressText.textContent = '0%';
  
  try {
    const response = await axios.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        
        // Atualizar UI
        progressBar.value = percentComplete;
        progressText.textContent = `${percentComplete}%`;
      }
    });
    
    alert('Upload complete!');
    progressContainer.style.display = 'none';
  } catch (error) {
    alert('Upload failed');
    progressContainer.style.display = 'none';
  }
});
```

## Upload Progress Example

### **Com Velocidade e Tempo Estimado**

```javascript
let startTime = null;
let lastLoaded = 0;
let lastTime = null;

uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('file', file);
  
  startTime = Date.now();
  lastLoaded = 0;
  lastTime = startTime;
  
  progressContainer.style.display = 'block';
  
  try {
    await axios.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const now = Date.now();
        const loaded = progressEvent.loaded;
        const total = progressEvent.total;
        
        // Percentual
        const percent = Math.round((loaded / total) * 100);
        progressBar.value = percent;
        
        // Velocidade (bytes/segundo)
        const timeDiff = (now - lastTime) / 1000; // Segundos
        const loadedDiff = loaded - lastLoaded;
        const speed = loadedDiff / timeDiff; // bytes/s
        
        // Tempo restante
        const remaining = total - loaded;
        const timeRemaining = remaining / speed; // Segundos
        
        // Atualizar UI
        progressText.innerHTML = `
          ${percent}% - 
          ${formatBytes(loaded)} / ${formatBytes(total)} - 
          ${formatSpeed(speed)} - 
          ETA: ${formatTime(timeRemaining)}
        `;
        
        lastLoaded = loaded;
        lastTime = now;
      }
    });
    
    alert('Upload complete!');
  } catch (error) {
    alert('Upload failed');
  }
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatSpeed(bytesPerSecond) {
  return formatBytes(bytesPerSecond) + '/s';
}

function formatTime(seconds) {
  if (!isFinite(seconds)) return 'Calculating...';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}
```

**Output Example**: `45% - 2.3 MB / 5.1 MB - 512 KB/s - ETA: 5s`

## Download Progress Example

```javascript
const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', async () => {
  progressContainer.style.display = 'block';
  progressBar.value = 0;
  progressText.textContent = '0%';
  
  try {
    const response = await axios.get('/download/large-file.zip', {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          progressBar.value = percent;
          progressText.textContent = `${percent}% - ${formatBytes(progressEvent.loaded)} / ${formatBytes(progressEvent.total)}`;
        } else {
          // Indeterminate progress
          progressBar.removeAttribute('value'); // Indeterminate state
          progressText.textContent = `Downloaded: ${formatBytes(progressEvent.loaded)}`;
        }
      }
    });
    
    // Trigger download
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'large-file.zip';
    link.click();
    URL.revokeObjectURL(url);
    
    progressContainer.style.display = 'none';
    alert('Download complete!');
  } catch (error) {
    alert('Download failed');
    progressContainer.style.display = 'none';
  }
});
```

**Indeterminate Progress Bar**: `<progress>` sem `value` attribute exibe animação indeterminada (pulsante).

## Advanced Progress Patterns

### **Throttling de UI Updates**

Atualizar UI a cada evento de progress pode causar performance issues. Throttle updates:

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const updateProgress = throttle((percent, loaded, total) => {
  progressBar.value = percent;
  progressText.textContent = `${percent}% - ${formatBytes(loaded)} / ${formatBytes(total)}`;
}, 100); // Update máximo a cada 100ms

await axios.post('/upload', formData, {
  onUploadProgress: (progressEvent) => {
    const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
    updateProgress(percent, progressEvent.loaded, progressEvent.total);
  }
});
```

### **Multiple File Progress**

Tracking de múltiplos uploads simultâneos:

```javascript
const files = fileInput.files;
const totalFiles = files.length;
let completedFiles = 0;

const overallProgressBar = document.getElementById('overall-progress');
const fileProgressBars = {}; // Track individual progress

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const formData = new FormData();
  formData.append('file', file);
  
  // Criar progress bar para cada arquivo
  const fileProgressContainer = createFileProgressBar(file.name);
  fileProgressBars[file.name] = fileProgressContainer.progressBar;
  
  axios.post('/upload', formData, {
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      
      // Atualizar progress individual
      fileProgressBars[file.name].value = percent;
      
      // Atualizar overall progress (approximação)
      const overallPercent = Math.round(((completedFiles + (percent / 100)) / totalFiles) * 100);
      overallProgressBar.value = overallPercent;
    }
  })
  .then(() => {
    completedFiles++;
    fileProgressBars[file.name].value = 100;
    
    if (completedFiles === totalFiles) {
      alert('All uploads complete!');
    }
  })
  .catch(error => {
    console.error(`Upload failed for ${file.name}:`, error);
  });
}

function createFileProgressBar(filename) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="file-progress">
      <span>${filename}</span>
      <progress max="100" value="0"></progress>
    </div>
  `;
  document.getElementById('files-progress-container').appendChild(container);
  
  return {
    progressBar: container.querySelector('progress')
  };
}
```

### **Global Progress Indicator**

Para múltiplos requests, mostrar progress global:

```javascript
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

// Request interceptor
axios.interceptors.request.use(config => {
  nprogress.start();
  return config;
});

// Response interceptor
axios.interceptors.response.use(
  response => {
    nprogress.done();
    return response;
  },
  error => {
    nprogress.done();
    return Promise.reject(error);
  }
);

// Uso com progress tracking
await axios.post('/upload', formData, {
  onUploadProgress: (progressEvent) => {
    const percent = (progressEvent.loaded / progressEvent.total);
    nprogress.set(percent); // 0.0 - 1.0
  }
});
```

### **React Integration**

```javascript
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    
    try {
      await axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setProgress(percent);
        }
      });
      
      alert('Upload complete!');
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };
  
  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      
      {uploading && (
        <div>
          <progress max="100" value={progress} />
          <p>{progress}%</p>
        </div>
      )}
    </div>
  );
}
```

## Best Practices

### **1. User Feedback**

Sempre mostrar progress para operações que podem levar > 2 segundos:

```javascript
// ✅ Com progress
await axios.post('/upload', formData, {
  onUploadProgress: updateProgressBar
});

// ❌ Sem feedback (bad UX)
await axios.post('/upload', formData);
```

### **2. Indeterminate Progress Handling**

```javascript
onDownloadProgress: (progressEvent) => {
  if (progressEvent.lengthComputable) {
    // Determinate progress
    const percent = (progressEvent.loaded / progressEvent.total) * 100;
    progressBar.setAttribute('value', percent);
    progressText.textContent = `${Math.round(percent)}%`;
  } else {
    // Indeterminate progress
    progressBar.removeAttribute('value'); // Mostra animação indeterminada
    progressText.textContent = `Downloading... ${formatBytes(progressEvent.loaded)}`;
  }
}
```

### **3. Performance (Throttling)**

```javascript
// ✅ Throttled updates
const throttledUpdate = throttle(updateProgressBar, 100);

onUploadProgress: (progressEvent) => {
  const percent = (progressEvent.loaded / progressEvent.total) * 100;
  throttledUpdate(percent);
}

// ❌ Update em cada evento (pode causar lag)
onUploadProgress: (progressEvent) => {
  updateProgressBar((progressEvent.loaded / progressEvent.total) * 100);
}
```

### **4. Accessibility**

```html
<progress 
  id="progress-bar" 
  max="100" 
  value="0"
  aria-label="Upload progress"
  aria-valuenow="0"
  aria-valuemin="0"
  aria-valuemax="100"
  role="progressbar"
></progress>

<div aria-live="polite" aria-atomic="true">
  <span id="progress-text">0%</span>
</div>
```

```javascript
onUploadProgress: (progressEvent) => {
  const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
  
  progressBar.value = percent;
  progressBar.setAttribute('aria-valuenow', percent);
  
  progressText.textContent = `${percent}%`;
}
```

### **5. Error Handling**

```javascript
try {
  await axios.post('/upload', formData, {
    onUploadProgress: updateProgress
  });
  
  // Success
  progressContainer.style.display = 'none';
  showSuccessMessage();
} catch (error) {
  // Error
  progressContainer.style.display = 'none';
  showErrorMessage();
}
```

### **6. Cancel Support**

```javascript
const cancelTokenSource = axios.CancelToken.source();

uploadBtn.addEventListener('click', async () => {
  // ... setup progress bar ...
  
  try {
    await axios.post('/upload', formData, {
      cancelToken: cancelTokenSource.token,
      onUploadProgress: updateProgress
    });
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Upload cancelled');
    }
  }
});

cancelBtn.addEventListener('click', () => {
  cancelTokenSource.cancel('User cancelled upload');
});
```

---

# 🎯 Aplicabilidade

## Quando Usar Progress Tracking

**Large File Uploads**: Vídeos, backups, datasets.

**Large File Downloads**: ISOs, datasets, media.

**Batch Operations**: Upload/download de múltiplos arquivos.

**Long-Running Requests**: Qualquer request que pode levar > 2 segundos.

## Quando Pode Ser Opcional

**Small Files**: Arquivos < 100KB geralmente transferem instantaneamente.

**Background Operations**: Se operação é background e usuário não está esperando.

---

# ⚠️ Limitações

## Content-Length Dependency

Download progress requer que server envie `Content-Length` header. Se ausente, `total` é undefined.

## Server Processing

Progress tracking reflete apenas transfer de rede. Processing server-side (ex: validação, virus scan) pós-upload não é refletido.

## Accuracy

Progress pode não ser perfeitamente linear devido a buffering, compression, network variability.

## Browser Compatibility

`onUploadProgress` e `onDownloadProgress` dependem de XMLHttpRequest progress events (bem suportados em browsers modernos).

---

# 🔗 Interconexões

## Requires File Upload/Download

Progress tracking é built on top de upload/download operations.

## Enhances UX

Transforma operações longas em experiências transparentes.

## Integrates with Cancellation

Progress + cancel button permite usuários abortar operações longas.

---

# 🚀 Evolução

## Fetch API Progress

Fetch não suporta nativamente progress tracking. Axios mantém vantagem aqui.

## Streams API

Future: Progress tracking via ReadableStream progressivo.

## Background Sync API

Service Workers podem mostrar progress de uploads background.

---

**Conclusão Integrada**: Progress tracking com Axios é implementado via callbacks `onUploadProgress` e `onDownloadProgress`, fornecendo ProgressEvents com `loaded` e `total` bytes para cálculo de percentual. Implementações robustas incluem progress bars visuais, cálculo de velocidade e tempo estimado, throttling de UI updates para performance, e handling de indeterminate progress quando `Content-Length` ausente. Best practices enfatizam user feedback, accessibility via ARIA attributes, error handling, e integration com cancel functionality. Progress tracking transforma file transfers de black boxes em operações transparentes que empoderam usuários com informação.