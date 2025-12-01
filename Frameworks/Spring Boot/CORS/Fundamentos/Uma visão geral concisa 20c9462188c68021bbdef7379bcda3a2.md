# Uma visão geral concisa

---

## 1. Introdução

Cross-Origin Resource Sharing (CORS) é o mecanismo que permite ao navegador controlar como recursos (APIs, fontes, imagens etc.) hospedados em um domínio/protocolo/porta (“origem”) podem ser acessados por páginas Web de outra origem. Por padrão, o **Same-Origin Policy** impede que scripts de uma origem façam requisições a outra, protegendo o usuário de ataques como o Cross-Site Request Forgery.

---

## 2. Sumário

1. Conceitos Fundamentais
2. Como “origem” é definida
3. Por que existe a política Same-Origin
4. Configuração de CORS em Spring Boot
5. Cenários de restrição ou não aplicação
6. Componentes chave associados
7. Melhores práticas e padrões de uso
8. Exemplo prático (fluxo conceitual)
9. Sugestões para aprofundamento

---

## 3. Conceitos Fundamentais

- **Same-Origin Policy (SOP):** regra de segurança dos navegadores que só autoriza scripts de `origem A` a interagir com recursos de `origem A`.
- **Cross-Origin Request:** requisição HTTP feita por uma página em `origem A` para um servidor em `origem B`.
- **CORS:** mecanismo que, por meio de cabeçalhos HTTP, indica ao navegador que determinados recursos em `origem B` podem ser consumidos por scripts de `origem A`.

---

## 4. Definição de “Origem”

Uma “origem” é composta por três elementos:

1. **Protocolo:** `http` vs `https`
2. **Domínio:** `exemplo.com`
3. **Porta:** `:80`, `:443`, `:8080`
    
    Qualquer diferença em um desses três componentes resulta em **origens distintas**.
    

---

## 5. Por que os navegadores bloqueiam requisições Cross-Origin

- Evita **vazamento de dados sensíveis** entre sites
- Previne ataques de **cross-site scripting** e **CSRF**
- Mantém o princípio de **confidencialidade** e **integridade** das sessões de usuário

---

## 6. Configuração de CORS em Spring Boot

Existem duas abordagens principais:

1. **Anotação em controller/endpoints**
    - Use uma anotação (ex.: `@CrossOrigin`) sobre classes ou métodos REST para liberar origens específicas.
    - Permite granularidade: habilitar CORS apenas onde for necessário.
2. **Configuração global via WebMvcConfigurer**
    - Implemente a interface responsável por registrar todos os mapeamentos de CORS da aplicação.
    - Pode definir: origens permitidas, métodos HTTP, cabeçalhos customizados, credenciais, tempo de cache do “preflight”.

---

## 7. Cenários de Restrição ou Não Aplicação

- **Não é necessário** quando front-end e back-end estão na **mesma origem**.
- **Não se aplica** em clients que não utilizam o navegador (por exemplo, em scripts de linha de comando ou serviços de back-end).
- Em arquiteturas de microsserviços internos (com proxy/API Gateway), frequentemente o CORS é gerenciado pelo gateway e não pelos serviços downstream.

---

## 8. Componentes Chave Associados

- **@CrossOrigin**
    - Permite configurar origens, métodos e cabeçalhos diretamente em controllers.
- **CorsRegistry / CorsConfiguration**
    - Classes usadas para registrar globalmente as regras de CORS.
- **CorsFilter**
    - Filtro HTTP que aplica as políticas antes mesmo do despacho aos controllers.
- **allowedOrigins**, **allowedMethods**, **allowedHeaders**, **allowCredentials**, **maxAge**
    - Principais atributos que controlam quem pode chamar a API e como o navegador deve proceder.

---

## 9. Melhores Práticas e Padrões de Uso

- **Restrinja origens:** evite usar “” em produção; especifique domínios confiáveis.
- **Cache de preflight:** configure `maxAge` para reduzir requisições OPTION.
- **Permita apenas métodos necessários:** liste somente GET, POST, PUT, DELETE etc. usados de fato.
- **Controle de credenciais:** defina `allowCredentials` somente quando realmente precisar enviar cookies ou cabeçalhos de autorização.
- **Centralize configurações:** mantenha o registro global via `WebMvcConfigurer` para facilitar manutenção.

---

## 10. Exemplo Prático (Fluxo Conceitual)

1. **Cenário:** Front-end em `http://localhost:3000`; back-end Spring Boot em `http://localhost:8080`.
2. **Requisição:** Página em `:3000` faz `fetch` para `:8080/api/dados`.
3. **Preflight:** Navegador envia `OPTIONS /api/dados` com cabeçalhos `Origin`, `Access-Control-Request-Method`.
4. **Resposta do servidor:** inclui `Access-Control-Allow-Origin: http://localhost:3000`, `Access-Control-Allow-Methods: GET,POST`, etc.
5. **Chamada efetiva:** navegador, satisfeito com a permissão, envia o GET real.
6. **Resultado:** API responde com recurso JSON, e o navegador libera o acesso ao JavaScript.

---

## 11. Sugestões para Aprofundamento

- MDN Web Docs: **CORS** (com exemplos de cabeçalhos HTTP)
- Documentação oficial Spring: seção **“Cross origin resource sharing”**
- Artigos sobre segurança Web: **Same-Origin Policy** vs **CORS**
- Ferramentas de teste: extensões de navegador para simular requisições CORS

---

Espero que esta visão geral ajude a esclarecer **o que é CORS**, **por que existe**, e **como habilitá-lo com Spring Boot** de forma concisa e prática. Qualquer dúvida ou se desejar aprofundar em exemplos de código, estou à disposição!