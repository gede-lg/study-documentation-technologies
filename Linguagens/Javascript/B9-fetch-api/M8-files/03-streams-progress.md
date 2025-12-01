# Streams e Progress Tracking: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Streams API** permite **processar dados em chunks** (pedaços) à medida que **chegam**, em vez de **esperar download completo** - essencial para **large files**, **real-time processing**, **memory efficiency**. **ReadableStream** (response.body) é **stream de bytes** que pode ser **lido progressivamente** via **reader** (getReader()), permitindo **processar chunks** individualmente. **Progress tracking** requer **Content-Length header** do servidor (total bytes) e **soma de bytes recebidos** (accumulated chunk sizes) para calcular **percentage** (`(loaded / total) * 100`). **Fetch API** não expõe **native progress events** (diferente de XMLHttpRequest.upload.onprogress), então **manual implementation** via **ReadableStream** é necessária.

Conceitualmente, Streams são **data flowing over time**: em vez de **buffer completo** (memória), dados são **processados incrementalmente**. **Reader** consome stream chunk-by-chunk via `reader.read()` (retorna `{value: Uint8Array, done: boolean}`). **Progress tracking** monitora **bytes processados** vs **total bytes** (Content-Length), atualizando **UI progressively** (progress bar, percentage). **Cancelamento** via **AbortController** interrompe stream reading.

```javascript
// Stream Reading Básico:
const response = await fetch('https://example.com/large-file.zip');

// Get ReadableStream
const reader = response.body.getReader();

// Read chunks
while (true) {
  const { value, done } = await reader.read();
  
  if (done) {
    console.log('Stream complete');
    break;
  }
  
  // value é Uint8Array (chunk de bytes)
  console.log('Received chunk:', value.length, 'bytes');
  
  // Process chunk...
}

// Progress Tracking:
const response = await fetch('https://example.com/file.pdf');

const contentLength = response.headers.get('Content-Length');
const total = parseInt(contentLength);

const reader = response.body.getReader();
let loaded = 0;

while (true) {
  const { value, done } = await reader.read();
  
  if (done) break;
  
  loaded += value.length;
  
  const progress = (loaded / total) * 100;
  console.log(`Progress: ${progress.toFixed(2)}%`);
  
  // Update UI...
}
```

### Contexto Histórico e Motivação

**Evolução de Streaming:**

1. **XMLHttpRequest (2006)**: progress events (upload.onprogress, onprogress)
2. **Streams API (2016)**: ReadableStream, WritableStream
3. **Fetch + Streams (2017)**: response.body as ReadableStream
4. **Modern (2020+)**: TransformStream, pipeTo, pipeThrough

**Motivação para Streams:**

**Pre-Streams**: Download requeria **esperar response completo** (buffered in memory) antes de processar - **ineficiente** para large files (memória), **sem progress feedback** (UX ruim). **Streams** permitem **processar chunks** à medida que chegam: **memory efficient** (chunks pequenos), **progress tracking** (bytes recebidos), **early processing** (não esperar download completo), **cancelamento** (abort mid-stream).

**Motivação para Manual Progress:**

**Fetch API** não tem **native progress events** (XMLHttpRequest tinha). **ReadableStream** permite **manual implementation**: ler chunks, acumular bytes, calcular progress. **Benefícios**: control granular, custom logic (throttling, validation), integração com modern patterns (async/await).

### Problema Fundamental que Resolve

Streams + Progress Tracking resolvem:

**1. Memory Efficiency**: Large files processados em chunks (não buffer completo)
**2. Progress Feedback**: UX - mostrar % download/upload
**3. Early Processing**: Processar dados antes de download completo
**4. Cancelamento**: Abort stream reading mid-download
**5. Real-time Data**: WebSocket, Server-Sent Events (streaming data)

### Importância no Ecossistema

Streams são **essenciais** para:

- **Large File Download**: Videos, archives, datasets
- **File Upload**: Progress bars, cancelamento
- **Real-time Data**: Live logs, chat messages
- **Media Streaming**: Video/audio playback
- **Data Processing**: ETL pipelines, transformações

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **ReadableStream**: Stream de bytes (response.body)
2. **reader.read()**: Ler chunks ({value: Uint8Array, done: boolean})
3. **Content-Length**: Total bytes (progress calculation)
4. **Progress**: (loaded / total) * 100
5. **Manual Implementation**: Fetch não tem native progress

### Pilares Fundamentais

- **response.body**: ReadableStream
- **getReader()**: Obter reader do stream
- **reader.read()**: Ler chunk (async)
- **Uint8Array**: Chunk data (bytes)
- **done**: Boolean (stream ended)
- **AbortController**: Cancel stream reading

### Visão Geral das Nuances

- **Content-Length**: Necessário para progress % (não sempre presente)
- **Chunks**: Tamanho variável (browser decide)
- **Accumulation**: Soma de chunk.length = total bytes
- **UI Update**: Throttle para evitar renders excessivos
- **Fetch vs XHR**: XHR tem native progress, Fetch não

---

## 🧠 Fundamentos Teóricos

### ReadableStream Básico

```javascript
// Ler stream chunk-by-chunk

async function readStream(url) {
  const response = await fetch(url);
  
  // Get ReadableStream
  const reader = response.body.getReader();
  
  const chunks = [];
  
  while (true) {
    // Read chunk
    const { value, done } = await reader.read();
    
    if (done) {
      console.log('Stream complete');
      break;
    }
    
    // value é Uint8Array (bytes)
    console.log('Chunk size:', value.length, 'bytes');
    
    chunks.push(value);
  }
  
  // Combine chunks em single Blob
  const blob = new Blob(chunks);
  
  console.log('Total size:', blob.size, 'bytes');
  
  return blob;
}

// Uso:
const blob = await readStream('/api/large-file.pdf');
```

### Progress Tracking (Download)

```javascript
// Download com progress tracking

async function downloadWithProgress(url, onProgress) {
  const response = await fetch(url);
  
  // Get total size
  const contentLength = response.headers.get('Content-Length');
  
  if (!contentLength) {
    console.warn('Content-Length header missing - progress unavailable');
  }
  
  const total = parseInt(contentLength);
  
  const reader = response.body.getReader();
  
  const chunks = [];
  let loaded = 0;
  
  while (true) {
    const { value, done } = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
    loaded += value.length;
    
    // Calculate progress
    const progress = total ? (loaded / total) * 100 : 0;
    
    // Callback
    if (onProgress) {
      onProgress({ loaded, total, progress });
    }
  }
  
  // Combine chunks
  const blob = new Blob(chunks);
  
  return blob;
}

// Uso:
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const blob = await downloadWithProgress('/api/large-file.zip', (data) => {
  const { loaded, total, progress } = data;
  
  // Update UI
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${progress.toFixed(2)}% (${(loaded / (1024 * 1024)).toFixed(2)} MB / ${(total / (1024 * 1024)).toFixed(2)} MB)`;
});

// Download blob
const blobUrl = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = blobUrl;
a.download = 'file.zip';
a.click();

URL.revokeObjectURL(blobUrl);
```

### Upload Progress (XMLHttpRequest)

```javascript
// ⚠️ Fetch não suporta upload progress nativamente
// Usar XMLHttpRequest para upload progress

function uploadWithProgress(file, url, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Upload progress event
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        
        if (onProgress) {
          onProgress({ loaded: e.loaded, total: e.total, progress });
        }
      }
    });
    
    // Success
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`HTTP ${xhr.status}`));
      }
    });
    
    // Error
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    // Abort
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });
    
    // Send
    const formData = new FormData();
    formData.append('file', file);
    
    xhr.open('POST', url);
    xhr.send(formData);
  });
}

// Uso:
const fileInput = document.querySelector('input[type="file"]');
const progressBar = document.getElementById('upload-progress');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  
  if (!file) return;
  
  try {
    const result = await uploadWithProgress(file, '/api/upload', (data) => {
      const { progress } = data;
      progressBar.style.width = `${progress}%`;
    });
    
    console.log('Upload success:', result);
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
});
```

### Stream Cancellation (AbortController)

```javascript
// Cancel stream reading mid-download

async function downloadWithCancel(url, onProgress, signal) {
  const response = await fetch(url, { signal });
  
  const contentLength = response.headers.get('Content-Length');
  const total = parseInt(contentLength);
  
  const reader = response.body.getReader();
  
  const chunks = [];
  let loaded = 0;
  
  try {
    while (true) {
      // Check if aborted
      if (signal?.aborted) {
        reader.cancel();
        throw new DOMException('Download aborted', 'AbortError');
      }
      
      const { value, done } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      const progress = (loaded / total) * 100;
      
      if (onProgress) {
        onProgress({ loaded, total, progress });
      }
    }
    
    const blob = new Blob(chunks);
    return blob;
    
  } catch (error) {
    reader.cancel();
    throw error;
  }
}

// Uso:
const controller = new AbortController();

const downloadBtn = document.getElementById('download-btn');
const cancelBtn = document.getElementById('cancel-btn');
const progressBar = document.getElementById('progress-bar');

downloadBtn.addEventListener('click', async () => {
  try {
    const blob = await downloadWithCancel(
      '/api/large-file.zip',
      (data) => {
        progressBar.style.width = `${data.progress}%`;
      },
      controller.signal
    );
    
    console.log('Download complete:', blob.size);
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Download cancelled');
    } else {
      console.error('Download failed:', error);
    }
  }
});

cancelBtn.addEventListener('click', () => {
  controller.abort();
});
```

### Throttled Progress Updates

```javascript
// Throttle progress updates (evitar renders excessivos)

function throttle(func, delay) {
  let lastCall = 0;
  
  return function (...args) {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

async function downloadWithThrottledProgress(url) {
  const response = await fetch(url);
  
  const contentLength = response.headers.get('Content-Length');
  const total = parseInt(contentLength);
  
  const reader = response.body.getReader();
  
  const chunks = [];
  let loaded = 0;
  
  // Throttled UI update (max 1 update per 100ms)
  const updateUI = throttle((progress) => {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progress}%`;
  }, 100);
  
  while (true) {
    const { value, done } = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
    loaded += value.length;
    
    const progress = (loaded / total) * 100;
    
    updateUI(progress); // Throttled
  }
  
  const blob = new Blob(chunks);
  return blob;
}
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: React Upload Progress Hook

```javascript
// Custom hook para upload com progress (React + XHR)

import { useState } from 'react';

function useUploadProgress(url) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const upload = (file) => {
    return new Promise((resolve, reject) => {
      setUploading(true);
      setProgress(0);
      setError(null);
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          setProgress(percent);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploading(false);
          setProgress(100);
          resolve(JSON.parse(xhr.responseText));
        } else {
          setUploading(false);
          setError(`HTTP ${xhr.status}`);
          reject(new Error(`HTTP ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        setUploading(false);
        setError('Upload failed');
        reject(new Error('Upload failed'));
      });
      
      const formData = new FormData();
      formData.append('file', file);
      
      xhr.open('POST', url);
      xhr.send(formData);
    });
  };
  
  return { upload, uploading, progress, error };
}

// Uso:
function FileUpload() {
  const { upload, uploading, progress, error } = useUploadProgress('/api/upload');
  
  const handleChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    try {
      const result = await upload(file);
      console.log('Upload success:', result);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };
  
  return (
    <div>
      <input type="file" onChange={handleChange} disabled={uploading} />
      
      {uploading && (
        <div>
          <progress value={progress} max="100" />
          <span>{progress.toFixed(2)}%</span>
        </div>
      )}
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}
```

### Pattern 2: Download Progress Component (React)

```javascript
// React component para download com progress

import { useState } from 'react';

function DownloadWithProgress({ url, filename }) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  
  const download = async () => {
    setDownloading(true);
    setProgress(0);
    
    try {
      const response = await fetch(url);
      
      const contentLength = response.headers.get('Content-Length');
      const totalBytes = parseInt(contentLength);
      
      setTotal(totalBytes);
      
      const reader = response.body.getReader();
      
      const chunks = [];
      let loadedBytes = 0;
      
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        loadedBytes += value.length;
        
        setLoaded(loadedBytes);
        setProgress((loadedBytes / totalBytes) * 100);
      }
      
      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.click();
      
      URL.revokeObjectURL(blobUrl);
      
      setDownloading(false);
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloading(false);
    }
  };
  
  const formatBytes = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };
  
  return (
    <div>
      <button onClick={download} disabled={downloading}>
        {downloading ? 'Downloading...' : 'Download File'}
      </button>
      
      {downloading && (
        <div style={{ marginTop: '10px' }}>
          <progress value={progress} max="100" style={{ width: '100%' }} />
          <p>
            {progress.toFixed(2)}% 
            ({formatBytes(loaded)} MB / {formatBytes(total)} MB)
          </p>
        </div>
      )}
    </div>
  );
}

// Uso:
<DownloadWithProgress 
  url="/api/reports/large-report.pdf" 
  filename="report.pdf" 
/>
```

### Pattern 3: Stream Transformation

```javascript
// TransformStream: Processar chunks durante download

async function downloadAndTransform(url) {
  const response = await fetch(url);
  
  // TransformStream para processar chunks
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      // Processar chunk (ex: decompressão, decryption)
      console.log('Processing chunk:', chunk.length, 'bytes');
      
      // Pode modificar chunk antes de enqueue
      // const processed = processChunk(chunk);
      
      controller.enqueue(chunk);
    }
  });
  
  // Pipe response através de transform
  const transformedStream = response.body.pipeThrough(transformStream);
  
  // Ler transformed stream
  const reader = transformedStream.getReader();
  
  const chunks = [];
  
  while (true) {
    const { value, done } = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
  }
  
  const blob = new Blob(chunks);
  return blob;
}
```

### Pattern 4: Multiple File Upload com Progress

```javascript
// Upload de múltiplos arquivos com progress individual

function uploadMultipleFiles(files, url) {
  const uploads = Array.from(files).map((file, index) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      const progressBar = document.getElementById(`progress-${index}`);
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          progressBar.style.width = `${progress}%`;
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`File ${file.name} failed`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error(`File ${file.name} failed`));
      });
      
      const formData = new FormData();
      formData.append('file', file);
      
      xhr.open('POST', url);
      xhr.send(formData);
    });
  });
  
  return Promise.all(uploads);
}

// HTML (template):
// <div id="progress-0" class="progress-bar"></div>
// <div id="progress-1" class="progress-bar"></div>

// Uso:
const filesInput = document.querySelector('input[type="file"][multiple]');

filesInput.addEventListener('change', async (e) => {
  const files = e.target.files;
  
  try {
    const results = await uploadMultipleFiles(files, '/api/upload');
    console.log('All uploads complete:', results);
  } catch (error) {
    console.error('Some uploads failed:', error);
  }
});
```

### Pattern 5: Resumable Upload (Chunked)

```javascript
// Upload resumable (chunks) com progress

async function uploadChunked(file, url, chunkSize = 1024 * 1024) { // 1MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    
    const chunk = file.slice(start, end);
    
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex);
    formData.append('totalChunks', totalChunks);
    formData.append('filename', file.name);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Chunk ${chunkIndex} failed`);
    }
    
    // Progress
    const progress = ((chunkIndex + 1) / totalChunks) * 100;
    console.log(`Progress: ${progress.toFixed(2)}%`);
    
    // Update UI...
  }
  
  console.log('Upload complete');
}

// Backend (Node.js/Express):
// Recebe chunks e reassembla no final
// (quando chunkIndex === totalChunks - 1)
```

### Pattern 6: Download Speed Calculation

```javascript
// Calcular download speed (MB/s)

async function downloadWithSpeed(url) {
  const response = await fetch(url);
  
  const contentLength = response.headers.get('Content-Length');
  const total = parseInt(contentLength);
  
  const reader = response.body.getReader();
  
  const chunks = [];
  let loaded = 0;
  
  const startTime = Date.now();
  let lastTime = startTime;
  let lastLoaded = 0;
  
  while (true) {
    const { value, done } = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
    loaded += value.length;
    
    const currentTime = Date.now();
    const elapsedTime = (currentTime - lastTime) / 1000; // seconds
    
    if (elapsedTime >= 1) { // Update speed every second
      const bytesDownloaded = loaded - lastLoaded;
      const speed = bytesDownloaded / elapsedTime; // bytes/second
      const speedMBps = speed / (1024 * 1024); // MB/s
      
      console.log(`Speed: ${speedMBps.toFixed(2)} MB/s`);
      
      lastTime = currentTime;
      lastLoaded = loaded;
    }
  }
  
  const totalTime = (Date.now() - startTime) / 1000;
  const avgSpeed = (loaded / totalTime) / (1024 * 1024);
  
  console.log(`Average speed: ${avgSpeed.toFixed(2)} MB/s`);
  
  const blob = new Blob(chunks);
  return blob;
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Streams

**✅ Large Files**: Videos, archives (memory efficiency)
**✅ Progress Tracking**: UX feedback durante download/upload
**✅ Real-time Processing**: Processar chunks antes de download completo
**✅ Cancelamento**: Abort mid-download

### Quando Usar XMLHttpRequest (XHR)

**✅ Upload Progress**: Fetch não suporta nativamente
**✅ Legacy Support**: Browsers antigos (pré-Fetch)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. Fetch Upload Progress**: Não suporta nativamente (usar XHR)
**2. Content-Length**: Necessário para progress % (não sempre presente)
**3. Chunk Size**: Browser decide (não controlável)
**4. Complexity**: Manual implementation (vs XHR native events)

### Armadilhas Comuns

#### Armadilha 1: Esperar Progress com Fetch Upload

```javascript
// ❌ ERRO - Fetch não tem upload progress
const formData = new FormData();
formData.append('file', file);

fetch('/api/upload', {
  method: 'POST',
  body: formData
  // ❌ Sem forma de monitorar upload progress
});

// ✅ CORRETO - Usar XMLHttpRequest para upload progress
const xhr = new XMLHttpRequest();

xhr.upload.addEventListener('progress', (e) => {
  const progress = (e.loaded / e.total) * 100;
  console.log(`Upload: ${progress}%`);
});

xhr.open('POST', '/api/upload');
xhr.send(formData);
```

#### Armadilha 2: UI Updates em Todo Chunk

```javascript
// ❌ INEFICIENTE - Atualizar UI em todo chunk
while (true) {
  const { value, done } = await reader.read();
  
  if (done) break;
  
  loaded += value.length;
  
  // ❌ UI update em CADA chunk (pode ser centenas)
  progressBar.style.width = `${(loaded / total) * 100}%`;
}

// ✅ EFICIENTE - Throttle UI updates
const updateUI = throttle(() => {
  progressBar.style.width = `${(loaded / total) * 100}%`;
}, 100); // Max 1 update per 100ms

while (true) {
  const { value, done } = await reader.read();
  
  if (done) break;
  
  loaded += value.length;
  updateUI();
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Blob API

**Chunks (Uint8Array)** combinados em **Blob** (`new Blob(chunks)`).

### Relação com AbortController

**AbortSignal** cancela **stream reading** (`reader.cancel()`).

### Relação com XMLHttpRequest

**XHR** tem **native upload.onprogress**, **Fetch** requer manual implementation.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Advanced Patterns**: Retry logic, parallel requests
2. **Caching**: Cache strategies, request deduplication
3. **React Integration**: Custom hooks, state management

---

## 📚 Conclusão

Streams + Progress Tracking permitem **download/upload eficiente com feedback visual**.

Dominar Streams significa:
- **ReadableStream**: Processar chunks progressivamente
- **Progress tracking**: Content-Length + accumulated bytes
- **UI updates**: Throttle para performance
- **Cancelamento**: AbortController + reader.cancel()
- **XHR para uploads**: Upload progress nativo (Fetch não suporta)

É essencial para aplicações com large files e UX responsiva.
