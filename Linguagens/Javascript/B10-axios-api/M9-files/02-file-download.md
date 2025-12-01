# 🎯 Introdução

File download representa operação complementar a upload: transferir arquivos binários do servidor para cliente de forma que usuário possa salvar localmente ou processar client-side. Diferente de responses JSON típicos, downloads requerem handling especial: Axios deve retornar dados binários brutos (não tentar parsear como JSON), browser deve apresentar save dialog ou processar dados em memória, e para arquivos grandes, progress tracking é essencial.

O problema que file download resolve é permitir usuários obterem conteúdo: relatórios PDF gerados server-side, exports de dados em CSV/Excel, imagens em alta resolução, backups de dados, installers de software. Cada use case tem requisitos específicos: PDFs podem ser exibidos inline em browser via `<embed>`, CSVs podem ser baixados diretamente via download dialog, imagens podem ser processadas client-side ou cached localmente.

Axios simplifica downloads através de **responseType configuration**: `responseType: 'blob'` instrui Axios a retornar ArrayBuffer/Blob em vez de tentar parsear response como JSON. Blob (Binary Large Object) é browser API para representar dados binários imutáveis, permitindo criar URLs temporários (Object URLs) para download via anchor element ou processar dados com FileReader API.

Entretanto, implementações production-ready vão além de básico `axios.get(url, { responseType: 'blob' })`: detecção de filename do response headers (`Content-Disposition`), fallback filename se header ausente, progress tracking para downloads longos (similar a uploads), error handling para downloads falhados (network interruption, 404, server errors), e cleanup de Object URLs para prevenir memory leaks.

Este módulo explora file download com Axios em profundidade: desde conceitos fundamentais de Blob API e responseType, através de implementações práticas de download triggers e filename extraction, até patterns avançados de streaming, caching, e integration com UI (download buttons, progress bars). Objetivo é capacitar você a implementar download experiences robustas que atendam expectativas de usuários.

---

# 📋 Sumário

### **Fundamentos de File Download**
- Problema resolvido por file downloads
- Blob API
- responseType: 'blob', 'arraybuffer'
- Object URLs

### **Basic File Download com Axios**
- GET request com responseType: 'blob'
- Criando Object URL
- Triggering download via anchor element
- Revogando Object URL (cleanup)

### **Filename Extraction**
- Content-Disposition header
- Parsing filename do header
- Fallback filename
- Sanitização de filename

### **Different Download Patterns**
- Download direto (save dialog)
- Exibir inline (PDF viewer)
- Processar client-side (parse CSV)
- Data URLs vs Object URLs

### **Multiple File Download**
- Sequential downloads
- Parallel downloads (Promise.all)
- Zipping files client-side

### **Error Handling**
- 404 errors (file não encontrado)
- Network errors durante download
- Timeout configuration
- Retry logic

### **responseType Options**
- 'blob' (binary data)
- 'arraybuffer' (raw bytes)
- 'text' (plain text)
- 'document' (HTML/XML parsing)

### **Best Practices**
- Object URL cleanup
- Memory management para arquivos grandes
- User feedback durante download
- Security considerations (download de sources confiáveis)

---

# 🧠 Fundamentos

## Problema Resolvido por File Download

**Transferência de Binários do Servidor**: Server gera ou armazena arquivos (PDFs, images, exports) que devem ser transferidos para cliente.

**Save Dialog Trigger**: Diferente de exibir content in-page, download aciona browser's save dialog permitindo usuário escolher location e filename.

**Client-Side Processing**: Dados binários podem ser processados em JavaScript (ex: parsear CSV, gerar thumbnails de imagens, extract metadata de PDFs).

**Caching Local**: Downloads permitem offline access via localStorage/IndexedDB.

## Blob API

**Blob** (Binary Large Object): Browser API para representar dados binários imutáveis.

```javascript
// Criar Blob de texto
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// Criar Blob de JSON
const jsonBlob = new Blob([JSON.stringify({ name: 'John' })], { type: 'application/json' });

// Blob de dados binários
const bytes = new Uint8Array([0x89, 0x50, 0x4E, 0x47]); // PNG header
const imageBlob = new Blob([bytes], { type: 'image/png' });
```

**Propriedades**:
- `size`: Tamanho em bytes
- `type`: MIME type

**Métodos**:
- `slice(start, end)`: Criar sub-blob
- `text()`: Ler como texto (retorna Promise)
- `arrayBuffer()`: Ler como ArrayBuffer (retorna Promise)

## responseType: 'blob'

Por default, Axios tenta parsear responses como JSON. Para downloads, devemos configurar `responseType`:

```javascript
// ❌ Default - tenta parsear como JSON
const response = await axios.get('/download/file.pdf');
// Response data será string corrompida ou erro de parsing

// ✅ Correto - retorna Blob
const response = await axios.get('/download/file.pdf', {
  responseType: 'blob'
});
// Response data é Blob object
console.log(response.data instanceof Blob); // true
```

**responseType Options**:
- `'blob'`: Retorna Blob (melhor para downloads)
- `'arraybuffer'`: Retorna ArrayBuffer (raw bytes)
- `'text'`: Retorna string
- `'json'`: Default, parseia como JSON
- `'document'`: Parseia como HTML/XML Document

## Object URLs

**Object URL** (Blob URL): URL temporário apontando para Blob em memória.

```javascript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
console.log(url); // "blob:http://localhost:3000/abc-123-def-456"

// Usar URL
const link = document.createElement('a');
link.href = url;
link.download = 'hello.txt';
link.click();

// IMPORTANTE: Revogar URL para liberar memória
URL.revokeObjectURL(url);
```

**Vantagens**:
- Permite usar Blob como source de `<a>`, `<img>`, `<video>`, etc.
- Não requer encoding (ex: data URLs)

**Desvantagens**:
- URLs são válidos apenas para sessão atual
- Devem ser revogados manualmente para prevenir memory leaks

---

# 🔍 Análise

## Basic File Download com Axios

```javascript
import axios from 'axios';

async function downloadFile(url, filename) {
  try {
    // 1. Request com responseType: 'blob'
    const response = await axios.get(url, {
      responseType: 'blob'
    });
    
    // 2. Criar Object URL do Blob
    const blob = response.data;
    const objectUrl = URL.createObjectURL(blob);
    
    // 3. Criar anchor element e trigger download
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link); // Necessário para Firefox
    link.click();
    
    // 4. Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
    
    console.log('Download complete');
  } catch (error) {
    console.error('Download failed:', error);
  }
}

// Uso
downloadFile('https://api.example.com/files/report.pdf', 'report.pdf');
```

**Flow**:
1. Axios faz GET request com `responseType: 'blob'`
2. Response data é Blob object
3. `URL.createObjectURL()` cria temporary URL
4. Anchor element com `download` attribute triggers save dialog
5. `link.click()` programmatically inicia download
6. Cleanup remove link do DOM e revoga Object URL

## Filename Extraction

Frequentemente, filename deve ser extraído do server response headers:

### **Content-Disposition Header**

Server envia filename via `Content-Disposition` header:

```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="report-2024.pdf"

[binary data]
```

### **Parsing Filename**

```javascript
function extractFilename(response) {
  const disposition = response.headers['content-disposition'];
  
  if (!disposition) {
    return null;
  }
  
  // Parse: attachment; filename="report.pdf"
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(disposition);
  
  if (matches != null && matches[1]) {
    let filename = matches[1].replace(/['"]/g, '');
    
    // Decode se filename estiver URL-encoded
    filename = decodeURIComponent(filename);
    
    return filename;
  }
  
  return null;
}

// Uso
async function downloadFile(url, fallbackFilename) {
  const response = await axios.get(url, {
    responseType: 'blob'
  });
  
  const filename = extractFilename(response) || fallbackFilename;
  
  const blob = response.data;
  const objectUrl = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(objectUrl);
}

downloadFile('https://api.example.com/download/123', 'file.pdf');
```

### **Filename UTF-8 Support**

Para filenames com caracteres especiais, server pode usar RFC 5987:

```http
Content-Disposition: attachment; filename*=UTF-8''relat%C3%B3rio.pdf
```

**Parsing avançado**:

```javascript
function extractFilename(response) {
  const disposition = response.headers['content-disposition'];
  
  if (!disposition) {
    return null;
  }
  
  // RFC 5987: filename*=UTF-8''encoded-filename
  const utf8FilenameRegex = /filename\*=UTF-8''([^;\n]*)/i;
  let matches = utf8FilenameRegex.exec(disposition);
  
  if (matches != null && matches[1]) {
    return decodeURIComponent(matches[1]);
  }
  
  // Fallback: filename="filename"
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  matches = filenameRegex.exec(disposition);
  
  if (matches != null && matches[1]) {
    return matches[1].replace(/['"]/g, '');
  }
  
  return null;
}
```

## Different Download Patterns

### **1. Download Direto (Save Dialog)**

```javascript
// Força save dialog
const link = document.createElement('a');
link.href = objectUrl;
link.download = 'report.pdf'; // download attribute
link.click();
```

### **2. Exibir Inline (PDF Viewer)**

```javascript
// Abre PDF no browser (sem download attribute)
const link = document.createElement('a');
link.href = objectUrl;
link.target = '_blank'; // Nova tab
link.click();

// Ou para embedding
const embed = document.createElement('embed');
embed.src = objectUrl;
embed.type = 'application/pdf';
embed.width = '100%';
embed.height = '600px';
document.body.appendChild(embed);
```

### **3. Processar Client-Side**

```javascript
// Download e parsear CSV
const response = await axios.get('/export/data.csv', {
  responseType: 'blob'
});

const text = await response.data.text();
const rows = text.split('\n').map(row => row.split(','));
console.log('CSV data:', rows);
```

### **4. Data URLs vs Object URLs**

**Object URLs** (recomendado):
```javascript
const objectUrl = URL.createObjectURL(blob);
// "blob:http://localhost:3000/abc-123"
// Mais eficiente, deve ser revogado
```

**Data URLs**:
```javascript
const reader = new FileReader();
reader.onload = () => {
  const dataUrl = reader.result;
  // "data:image/png;base64,iVBORw0KG..."
  // Não requer revogação, mas maior overhead
};
reader.readAsDataURL(blob);
```

**Comparação**:
| Aspecto | Object URL | Data URL |
|---------|------------|----------|
| **Tamanho** | Pequeno (referência) | Grande (dados encoded) |
| **Performance** | Melhor | Pior (base64 encoding) |
| **Cleanup** | Manual (revokeObjectURL) | Automático |
| **Persistência** | Sessão apenas | Pode ser armazenado |

**Use Object URLs** para downloads, **Data URLs** para embedding persistente (ex: localStorage).

## Multiple File Download

### **Sequential Downloads**

```javascript
async function downloadMultipleFiles(files) {
  for (const file of files) {
    await downloadFile(file.url, file.name);
    
    // Delay para não bombardear servidor
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

const files = [
  { url: '/download/file1.pdf', name: 'file1.pdf' },
  { url: '/download/file2.pdf', name: 'file2.pdf' },
  { url: '/download/file3.pdf', name: 'file3.pdf' }
];

await downloadMultipleFiles(files);
```

### **Parallel Downloads**

```javascript
async function downloadMultipleFilesParallel(files) {
  const downloadPromises = files.map(file => 
    downloadFile(file.url, file.name)
  );
  
  await Promise.all(downloadPromises);
}

// Downloads simultâneos
await downloadMultipleFilesParallel(files);
```

**Cuidado**: Browsers limitam concurrent downloads (~6). Para muitos arquivos, considerar batching.

### **Zipping Client-Side**

Para múltiplos arquivos, pode ser melhor zipar client-side:

```javascript
import JSZip from 'jszip';

async function downloadFilesAsZip(files, zipName) {
  const zip = new JSZip();
  
  // Download todos arquivos
  const promises = files.map(async file => {
    const response = await axios.get(file.url, { responseType: 'blob' });
    zip.file(file.name, response.data);
  });
  
  await Promise.all(promises);
  
  // Gerar ZIP
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  
  // Download ZIP
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = zipName;
  link.click();
  
  URL.revokeObjectURL(url);
}

await downloadFilesAsZip(files, 'documents.zip');
```

## Error Handling

### **404 Errors**

```javascript
async function downloadFile(url, filename) {
  try {
    const response = await axios.get(url, {
      responseType: 'blob'
    });
    
    // Trigger download
    const objectUrl = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    if (error.response?.status === 404) {
      alert('File not found');
    } else if (error.response?.status === 403) {
      alert('Access denied');
    } else {
      alert('Download failed');
    }
  }
}
```

### **Network Errors**

```javascript
try {
  const response = await axios.get(url, {
    responseType: 'blob',
    timeout: 30000 // 30 segundos
  });
  
  // Download
} catch (error) {
  if (error.code === 'ECONNABORTED') {
    alert('Download timed out');
  } else if (error.code === 'ERR_NETWORK') {
    alert('Network error');
  } else {
    alert('Download failed');
  }
}
```

### **Retry Logic**

```javascript
async function downloadFileWithRetry(url, filename, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
        timeout: 30000
      });
      
      const objectUrl = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      link.click();
      
      URL.revokeObjectURL(objectUrl);
      
      return; // Success
    } catch (error) {
      attempt++;
      
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        if (attempt >= maxRetries) {
          throw new Error(`Download failed after ${maxRetries} attempts`);
        }
        
        console.log(`Download attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        // Outro error (404, 403), não retry
        throw error;
      }
    }
  }
}
```

## responseType Options

### **'blob'**

```javascript
// Melhor para downloads
const response = await axios.get('/file.pdf', {
  responseType: 'blob'
});

console.log(response.data instanceof Blob); // true
```

### **'arraybuffer'**

```javascript
// Útil para processar bytes diretamente
const response = await axios.get('/file.pdf', {
  responseType: 'arraybuffer'
});

const buffer = response.data;
console.log(buffer instanceof ArrayBuffer); // true

// Converter para Blob se necessário
const blob = new Blob([buffer], { type: 'application/pdf' });
```

### **'text'**

```javascript
// Para arquivos de texto
const response = await axios.get('/file.txt', {
  responseType: 'text'
});

console.log(typeof response.data); // "string"
```

### **'document'**

```javascript
// Para HTML/XML parsing
const response = await axios.get('/page.html', {
  responseType: 'document'
});

console.log(response.data instanceof Document); // true
const title = response.data.querySelector('title').textContent;
```

## Best Practices

### **1. Object URL Cleanup**

```javascript
// ✅ Sempre revogar Object URLs
const objectUrl = URL.createObjectURL(blob);
link.href = objectUrl;
link.click();
URL.revokeObjectURL(objectUrl);

// ❌ Memory leak
const objectUrl = URL.createObjectURL(blob);
link.href = objectUrl;
link.click();
// Esqueceu de revogar - memória não liberada
```

### **2. User Feedback**

```javascript
const downloadButton = document.getElementById('download-btn');

downloadButton.addEventListener('click', async () => {
  downloadButton.disabled = true;
  downloadButton.textContent = 'Downloading...';
  
  try {
    await downloadFile('/file.pdf', 'report.pdf');
    alert('Download complete');
  } catch (error) {
    alert('Download failed');
  } finally {
    downloadButton.disabled = false;
    downloadButton.textContent = 'Download';
  }
});
```

### **3. Memory Management**

```javascript
// Para arquivos muito grandes, considerar streaming
// (Não totalmente suportado em todos browsers via Axios)

// Alternativa: Server-side streaming com links diretos
const response = await axios.post('/generate-download-link', { fileId: 123 });
const downloadUrl = response.data.url;

// Redirecionar para URL direta (server streams)
window.location.href = downloadUrl;
```

### **4. Security Considerations**

```javascript
// ⚠️ Validar source antes de download
function isSafeUrl(url) {
  const allowedDomains = ['api.example.com', 'cdn.example.com'];
  const urlObj = new URL(url);
  return allowedDomains.includes(urlObj.hostname);
}

async function downloadFile(url, filename) {
  if (!isSafeUrl(url)) {
    throw new Error('Untrusted download source');
  }
  
  // Prosseguir com download
}
```

---

# 🎯 Aplicabilidade

## Quando Usar File Download

**Relatórios**: Export de relatórios em PDF/Excel.

**Data Export**: Download de dados em CSV/JSON.

**Media**: Download de imagens, vídeos, áudio.

**Backups**: Export de dados do usuário.

**Documents**: Download de invoices, contracts, etc.

## Quando Considerar Alternativas

**Small Text Data**: Para texto pequeno, exibir inline pode ser melhor que download.

**Streaming Media**: Para vídeo/áudio streaming, usar `<video>`/`<audio>` com progressive loading.

---

# ⚠️ Limitações

## Browser Compatibility

Object URLs amplamente suportados, mas features específicas (ex: download attribute) podem ter issues em browsers antigos.

## Memory Constraints

Downloads muito grandes podem consumir muita memória, especialmente se múltiplos downloads simultâneos.

## Filename Restrictions

Browsers podem sanitizar filenames (remover caracteres especiais) automaticamente.

## CORS

Downloads cross-origin requerem CORS headers apropriados do servidor.

---

# 🔗 Interconexões

## Complements File Upload

Download é operação inversa de upload.

## Uses Blob API

Blob é core para handling de dados binários.

## Enables Progress Tracking

Download progress (próximo módulo) requer responseType: 'blob' como base.

---

# 🚀 Evolução

## Streams API

Futuramente, Axios pode suportar Streams API para downloads mais eficientes (streaming incremental).

## Service Workers

Interceptar downloads via Service Workers para caching offline.

## File System Access API

Permitir usuários escolherem diretório de save via API nativa (substituindo download attribute).

---

**Conclusão Integrada**: File download com Axios é implementado via `responseType: 'blob'`, criando Object URLs para trigger de save dialog via anchor elements. Implementações robustas requerem filename extraction de Content-Disposition headers com fallbacks, error handling para 404/network errors, retry logic, e cleanup obrigatório de Object URLs. Best practices incluem user feedback durante download, memory management para arquivos grandes, e security validation de download sources. Próximo tópico explorará progress tracking, fornecendo feedback real-time durante uploads e downloads longos.