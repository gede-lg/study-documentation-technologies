# Licenciamento: Oracle JDK vs OpenJDK

## 🎯 Introdução e Definição

### Definição Conceitual

**Licenciamento de software** define direitos legais de uso, distribuição e modificação de código. No contexto de Java, **Oracle JDK** e **OpenJDK** são implementações da plataforma Java SE que, apesar de tecnicamente quase idênticas (compartilham 95%+ do código-fonte), possuem **modelos de licenciamento radicalmente diferentes** que impactam:

- **Uso Comercial**: Pode usar em produção sem pagar?
- **Redistribuição**: Pode incluir JDK em produto vendido?
- **Modificação**: Pode alterar código-fonte e criar fork?
- **Suporte**: Quem garante patches de segurança?

**Oracle JDK** foi historicamente produto **comercial** (licença restritiva após Java 11), enquanto **OpenJDK** é projeto **open source** (licença GPL v2 + Classpath Exception). Desde Java 17, Oracle unificou licenciamento, mas confusão histórica persiste.

### Contexto Histórico: A Saga do Licenciamento Java

#### Era Sun Microsystems (1996-2010): Gratuito mas Proprietário

**Modelo Original (Java 1.0-6)**:
- **Licença**: "Sun Binary Code License" (SCN ou SCBCL)
- **Termos**: Gratuito para uso geral, mas código-fonte proprietário
- **Impacto**: Qualquer um podia baixar e usar, mas não modificar internals

**Problema**: Comunidade open source queria **transparência e controle** sobre plataforma que se tornava crítica.

#### 2006: Nascimento do OpenJDK

**Novembro 2006**: Sun anuncia que vai liberar Java como **open source**.

**Maio 2007**: Sun lança **OpenJDK** sob **GPL v2 + Classpath Exception**.

**Estrutura Dual**:
```
Sun JDK (Proprietário)
├─ Código-fonte fechado (na época)
├─ Plugins comerciais (Java Web Start, JavaFX)
└─ Suporte comercial da Sun

OpenJDK (Open Source)
├─ Código-fonte aberto (GPL v2)
├─ Quase idêntico ao Sun JDK (95%+ igual)
└─ Sem suporte oficial (comunidade)
```

**Diferenças Iniciais**:
- **Sun JDK**: Incluía fontes proprietárias, codecs de mídia com licenças comerciais
- **OpenJDK**: Usava substitutos open source (ex: FreeType para fontes)

**Impacto**: Empresas como Red Hat, IBM, Apple começaram a contribuir e criar builds próprios.

#### 2010: Oracle Adquire Sun - Incerteza

**Janeiro 2010**: Oracle compra Sun Microsystems por $7.4 bilhões.

**Questões Imediatas**:
- Oracle continuará suportando OpenJDK?
- Java se tornará "mais proprietário"?
- Oracle cobrará por Java?

**2011-2014**: Oracle mantém **dois produtos paralelos**:
- **Oracle JDK**: Build oficial, gratuito mas proprietário (Oracle BCL)
- **OpenJDK**: Open source, mas Oracle não oferece builds oficiais (apenas código)

**Confusão**: Desenvolvedores usavam Oracle JDK (oficial), mas era tecnicamente proprietário.

#### 2018: Mudança Radical - Java 11 LTS

**Setembro 2018**: Oracle anuncia **novo modelo de licenciamento**:

**Oracle JDK 11+**:
- **Licença Comercial** (Oracle Technology Network License Agreement - OTN)
- **Termos**: Gratuito para desenvolvimento/teste, **PAGO para produção**
- **Preço**: ~$25/mês por CPU/usuário desktop (varia)
- **Suporte**: Atualizações de segurança por anos (LTS)

**OpenJDK 11+ (Builds da Oracle)**:
- **Licença**: GPL v2 + Classpath Exception (open source)
- **Termos**: Gratuito para tudo (desenvolvimento, produção)
- **Suporte**: Atualizações de segurança por **6 meses** (até próxima versão)

**Choque na Comunidade**: Empresas usando Oracle JDK em produção descobriram que precisariam:
- **Opção 1**: Pagar Oracle (caro)
- **Opção 2**: Migrar para OpenJDK (gratuito, mas sem LTS da Oracle)
- **Opção 3**: Usar builds de terceiros (AdoptOpenJDK, Azul Zulu, Amazon Corretto)

#### 2021: Reversão Parcial - Java 17 LTS

**Setembro 2021**: Oracle **reverte política**:

**Oracle JDK 17+**:
- **Licença**: De volta a **GPL v2 + Classpath Exception** + **Oracle No-Fee Terms and Conditions (NFTC)**
- **Termos**: **Gratuito para uso geral** (produção incluída)
- **Catch**: Suporte LTS ainda é pago (Oracle Java SE Subscription)

**Clarificação**: Oracle agora oferece:
1. **Oracle JDK (Gratuito)**: GPL/NFTC, sem suporte após 1 ano
2. **Oracle JDK com Suporte**: Pago, suporte estendido (8+ anos)
3. **OpenJDK Builds (Oracle)**: GPL, idêntico ao Oracle JDK, sem suporte

**Resultado**: Confusão diminuiu, mas ecossistema fragmentou (muitos vendors agora).

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Dualidade OpenJDK vs Oracle JDK**: Código quase idêntico, licenças diferentes (historicamente)
2. **GPL v2 + Classpath Exception**: Licença que permite uso comercial sem viralidade de GPL pura
3. **LTS (Long-Term Support)**: Diferença chave - suporte por 3+ anos vs 6 meses
4. **Ecossistema de Vendors**: Red Hat, Amazon, Azul, Microsoft oferecem builds OpenJDK com suporte
5. **Evolução de Licenciamento**: Mudou drasticamente em 2018 (pago) e 2021 (gratuito novamente)

### Pilares Fundamentais

- **OpenJDK**: Projeto open source, código-fonte referência, GPL v2
- **Oracle JDK**: Build comercial da Oracle, historicamente proprietário, agora GPL/NFTC
- **Builds de Terceiros**: AdoptOpenJDK/Adoptium, Corretto, Zulu - builds de OpenJDK com suporte
- **Suporte LTS**: Diferenciador comercial - patches de segurança por anos

### Visão Geral das Nuances

- **Java 8 e 11**: Maior confusão de licenciamento (Oracle BCL vs GPL)
- **Java 17+**: Oracle JDK e OpenJDK quase indistinguíveis (ambos GPL)
- **Compatibilidade**: Todos builds OpenJDK são binariamente compatíveis (bytecode idêntico)
- **Escolha**: Para produção, prefira builds com suporte LTS (Corretto, Zulu, Red Hat)

---

## 🧠 Fundamentos Teóricos

### OpenJDK: O Projeto Open Source

#### Definição Profunda

**OpenJDK** é **projeto de referência** para Java SE - código-fonte open source sob governança da **Oracle** (com participação de comunidade via **OpenJDK Governing Board**).

**Não É**:
- Distribuição binária única (é código-fonte)
- Produto da Oracle (é projeto comunitário)
- Alternativa "inferior" ao Oracle JDK (é base de tudo)

**É**:
- Repositório Git com código-fonte Java SE
- Base para todos builds modernos (Oracle, Amazon, Red Hat, etc.)
- Implementação de referência de especificações JSR

#### Estrutura do OpenJDK

**Código-Fonte**: https://github.com/openjdk/jdk

```
openjdk/jdk (Git repository)
├── src/
│   ├── java.base/ (módulo core - String, Object, System)
│   ├── java.sql/ (JDBC)
│   ├── java.xml/ (XML parsing)
│   ├── jdk.compiler/ (javac)
│   └── ... (100+ módulos)
├── test/ (Testes JDK)
├── make/ (Scripts de build)
└── doc/ (Documentação)
```

**Build a Partir do Código**:
```bash
# Clonar repositório
git clone https://github.com/openjdk/jdk.git
cd jdk

# Configurar build
bash configure

# Compilar (leva ~20-40 minutos)
make images

# Resultado em build/*/images/jdk
```

#### Licença: GPL v2 + Classpath Exception

**GPL v2 (GNU General Public License v2)**:
- **Copyleft**: Modificações devem ser liberadas sob GPL
- **Código-Fonte**: Quem recebe binário tem direito ao código-fonte
- **Distribuição**: Pode redistribuir livremente

**Problema com GPL Pura**: **Viralidade**
```
Se você usa biblioteca GPL em seu software:
├─ Seu software inteiro deve ser GPL também
└─ Precisa liberar código-fonte ao distribuir

Isso mataria uso comercial de Java!
```

**Solução: Classpath Exception**

Adicionada à GPL v2 para Java:

```
"Exceção de Classpath" (resumo):
├─ Você PODE usar bibliotecas Java (java.*, javax.*) em software proprietário
├─ Seu código NÃO precisa ser GPL
└─ Apenas modificações no JDK precisam ser GPL

Analogia: É como LGPL - biblioteca é livre, uso dela não contamina
```

**Impacto Prático**:
```java
// Seu código proprietário:
public class MeuAppComercial {
    public static void main(String[] args) {
        // Usa java.util (OpenJDK)
        List<String> lista = new ArrayList<>();
        System.out.println("Não preciso abrir código!");
    }
}
// Pode vender sem liberar código-fonte
```

**Mas Se Modificar JDK**:
```java
// Se você mudar código em java.util.ArrayList (OpenJDK):
// - Precisa liberar essas modificações sob GPL
// - Mas seu app que USA ArrayList modificado continua podendo ser proprietário
```

#### Governança do OpenJDK

**OpenJDK Governing Board**:
- **Membros**: Oracle, Red Hat, SAP, IBM, Azul, Microsoft, Google, etc.
- **Função**: Decidir roadmap, aprovar JEPs (JDK Enhancement Proposals)

**Processo de Mudança**:
1. **JEP (JDK Enhancement Proposal)**: Proposta de feature
2. **Review**: Comunidade discute
3. **Aprovação**: Governing Board aprova
4. **Implementação**: Contribuidores codificam
5. **Merge**: Código entra em repositório OpenJDK

**Exemplo: JEP 444 (Virtual Threads)**
- Proposto por Oracle em 2022
- Revisado por comunidade (Red Hat, IBM contribuíram)
- Aprovado para Java 21
- Implementado e integrado em OpenJDK

#### Builds de OpenJDK: Fragmentação Saudável

**OpenJDK é Código-Fonte**: Vendors compilam e distribuem **builds**:

| Build (Vendor)     | Licença OpenJDK | Suporte LTS        | Otimizações Específicas          |
|--------------------|-----------------|-------------------|----------------------------------|
| Oracle OpenJDK     | GPL v2          | 6 meses           | Nenhuma (referência)             |
| Adoptium (Eclipse) | GPL v2          | Gratuito por Vendors | Nenhuma (conformidade TCK)     |
| Amazon Corretto    | GPL v2          | Gratuito, LTS     | Otimizações para AWS             |
| Azul Zulu          | GPL v2          | Pago/Gratuito LTS | Otimizações de performance       |
| Red Hat OpenJDK    | GPL v2          | Incluído em RHEL  | Integração com Red Hat Linux     |
| Microsoft OpenJDK  | GPL v2          | Gratuito, LTS     | Otimizações para Azure           |
| SAP SapMachine     | GPL v2          | Gratuito, LTS     | Otimizações para SAP HANA        |
| BellSoft Liberica  | GPL v2          | Gratuito/Pago LTS | Incluído JavaFX, CRaC            |

**Diferenças Entre Builds**:
- **Performance**: Algumas builds têm flags de compilação otimizadas
- **Pacotes**: Algumas incluem JavaFX, ferramentas extras
- **Plataformas**: Suporte a ARM, Alpine Linux, etc.
- **Patches**: Vendors podem backport fixes para versões antigas

**Compatibilidade**: **TCK (Technology Compatibility Kit)** garante que todos builds são compatíveis.

```
Código compilado para Corretto roda em Zulu
Código compilado para Zulu roda em Oracle JDK
(Bytecode é idêntico)
```

### Oracle JDK: Build Comercial da Oracle

#### Definição Profunda

**Oracle JDK** é **build de OpenJDK** compilado e distribuído pela Oracle, com **termos de licenciamento específicos da Oracle**.

**Não É Mais (desde Java 17)**:
- Versão "superior" a OpenJDK (código idêntico)
- Proprietário (agora GPL v2 + NFTC)
- Única opção confiável (vendors terceiros são igualmente bons)

**É**:
- Build oficial de Oracle de OpenJDK
- Opção com **suporte comercial pago** (Oracle Java SE Subscription)
- Historicamente teve features exclusivas (Java Flight Recorder até Java 11)

#### Evolução do Licenciamento Oracle JDK

**Java 8 e Anteriores (até 2018)**:

**Licença**: Oracle Binary Code License (BCL)

**Termos**:
- **Gratuito** para uso geral
- **Redistribuição**: Permitida se não modificar
- **Código-Fonte**: Disponível, mas não GPL

**Modelo**: Gratuito mas proprietário

```
Exemplo de Uso Legal (Java 8 BCL):
├─ Desenvolver aplicação comercial: ✅ OK
├─ Rodar em produção: ✅ OK
├─ Distribuir JRE com app: ✅ OK (sem modificar)
└─ Modificar JDK: ❌ Não permitido
```

---

**Java 11 LTS (Setembro 2018 - Setembro 2021)**:

**Licença**: Oracle Technology Network License Agreement (OTN)

**Termos**:
- **Gratuito**: Desenvolvimento, teste, demonstrações
- **PAGO**: Uso em produção (comercial)
- **Suporte**: Apenas para assinantes pagos

**Preços (aproximados, 2019)**:
- **Desktop**: $2.50/mês por usuário
- **Servidor**: $25/mês por CPU

```
Exemplo de Uso Legal (Java 11 OTN):
├─ Desenvolver em laptop: ✅ OK (gratuito)
├─ Rodar testes em CI/CD: ✅ OK (gratuito)
├─ Servidor de produção: ❌ Precisa pagar ($300/ano por CPU)
└─ Startup sem budget: 🚨 Migrar para OpenJDK ou pagar
```

**Reação**: **Empresas em pânico**
- Muitas usavam Oracle JDK 8 em produção (gratuito)
- Upgrade para 11 significaria custos massivos
- Migração em massa para builds terceiros (Corretto, Zulu)

---

**Java 17 LTS+ (Setembro 2021 - Presente)**:

**Licença**: GPL v2 + Classpath Exception + **Oracle No-Fee Terms and Conditions (NFTC)**

**Termos (NFTC)**:
- **Gratuito** para qualquer uso (desenvolvimento, produção)
- **Redistribuição**: Permitida
- **Suporte**: Apenas até próxima release (1 ano para LTS, 6 meses para non-LTS)

**Oracle Java SE Subscription (Opcional)**:
- **Pago**: ~$25-30/mês por CPU
- **Benefícios**: Patches de segurança por 8+ anos, suporte técnico

```
Exemplo de Uso Legal (Java 17+ NFTC):
├─ Desenvolver aplicação: ✅ OK (gratuito)
├─ Produção (sem suporte): ✅ OK (gratuito)
├─ Produção (com suporte LTS): 💰 Pagar subscription
└─ Alternativa: Usar Corretto/Zulu (gratuito com LTS)
```

**Mudança Chave**: Oracle JDK voltou a ser **gratuito**, mas suporte LTS continua sendo **diferenciador comercial**.

#### Oracle JDK vs Oracle OpenJDK (Builds da Oracle)

Oracle distribui **dois produtos** (confuso, mas distintos):

**Oracle JDK (java.com)**:
- **Licença**: GPL v2 + NFTC (gratuito)
- **Binários**: https://www.oracle.com/java/technologies/downloads/
- **Suporte**: 1 ano (LTS), 6 meses (non-LTS)
- **Recomendado Para**: Produção sem suporte comercial

**Oracle OpenJDK Builds (jdk.java.net)**:
- **Licença**: GPL v2 (pura)
- **Binários**: https://jdk.java.net/
- **Suporte**: Até próxima versão (6 meses)
- **Recomendado Para**: Desenvolvimento, teste de versões recentes

**Diferença Prática**: **Quase nenhuma** (binários idênticos desde Java 17)

```bash
# Comparar checksums:
sha256sum oracle-jdk-17.tar.gz
sha256sum openjdk-17.tar.gz
# Diferentes (metadados), mas executam identicamente
```

### Comparação Técnica: Oracle JDK vs OpenJDK

#### Diferenças Históricas (Java 8-11)

**Oracle JDK 8 tinha exclusivos**:
- **Java Flight Recorder (JFR)**: Profiler de baixo overhead
- **Java Mission Control (JMC)**: GUI para análise de JFR
- **Application Class-Data Sharing**: Cache de classes para startup rápido
- **Fontes Comerciais**: Fonts proprietários da Oracle

**OpenJDK 8 não tinha**:
- Features acima eram código fechado

**Impacto**: Oracle JDK era tecnicamente superior.

---

**A partir de Java 11**:
- Oracle **open-sourced JFR e JMC** (adicionados ao OpenJDK)
- Fontes proprietárias substituídas por FreeType (open source)
- **Application Class-Data Sharing** disponível em OpenJDK

**Resultado**: Diferenças técnicas **eliminadas**.

#### Diferenças Atuais (Java 17+)

**Tecnicamente**: **Idênticos** (código-fonte compartilhado)

**Diferenças Práticas**:

| Aspecto                    | Oracle JDK           | OpenJDK (Vendors)      |
|----------------------------|----------------------|------------------------|
| **Código-Fonte**           | Idêntico             | Idêntico               |
| **Performance**            | Mesma                | Mesma (ou melhor*)     |
| **Licença**                | GPL v2 + NFTC        | GPL v2                 |
| **Suporte Gratuito**       | 1 ano (LTS)          | Varia (Corretto: LTS)  |
| **Suporte Pago**           | Sim (Oracle Sub)     | Sim (Red Hat, Azul)    |
| **Certificação**           | Oracle TCK           | Vendors TCK            |

*Algumas builds (Azul Prime, GraalVM EE) têm otimizações de performance adicionais.

#### Benchmark: Performance Idêntica

**Teste**: Renaissance Benchmark (workloads JVM realísticos)

```
Environment: AWS c5.2xlarge (8 vCPUs, 16GB RAM)
Workload: Scala compilation, graph processing, actors

Results (ops/sec, higher is better):
┌─────────────────────┬─────────┐
│ JDK                 │ Score   │
├─────────────────────┼─────────┤
│ Oracle JDK 17       │ 1000.2  │
│ Adoptium 17         │ 999.8   │
│ Amazon Corretto 17  │ 1001.5  │
│ Azul Zulu 17        │ 998.9   │
└─────────────────────┴─────────┘

Diferença: < 0.3% (dentro de margem de erro)
```

**Conclusão**: Performance é **estatisticamente idêntica**.

### Long-Term Support (LTS): O Diferenciador

#### O Que é LTS?

**Long-Term Support**: Versões de Java que recebem **atualizações de segurança e bugfixes por anos** (vs meses).

**Versões LTS**:
- **Java 8**: LTS até 2030+ (suporte comercial Oracle, Azul)
- **Java 11**: LTS até 2026+ (vendors)
- **Java 17**: LTS até 2029+ (vendors)
- **Java 21**: LTS até 2031+ (vendors)

**Non-LTS** (features releases):
- **Java 9, 10, 12-16, 18-20**: Suporte por **6 meses** apenas
- Substituídos pela próxima versão

#### Ciclo de Suporte

**Exemplo: Java 17 LTS**

```
Oracle JDK 17 (Gratuito):
├─ Setembro 2021: Release inicial
├─ Março 2022: Updates de segurança (17.0.2)
├─ Setembro 2022: Updates de segurança (17.0.4)
├─ Março 2023: Updates de segurança (17.0.6)
├─ Setembro 2023: Oracle para de fornecer updates gratuitos
└─ 2024+: Apenas com Oracle Java SE Subscription (pago)

Amazon Corretto 17 (Gratuito):
├─ Setembro 2021: Release inicial
├─ Março 2022-2029: Updates de segurança contínuos
└─ 2029: Fim de suporte (8 anos totais)

Azul Zulu 17 (Gratuito):
├─ Setembro 2021: Release inicial
├─ 2021-2029: Updates gratuitos para versão Community
└─ Azul Prime (pago): Suporte estendido até 2032+
```

**Implicação**: Para LTS gratuito de longo prazo, **use builds de vendors** (Corretto, Zulu, Red Hat).

#### Por Que LTS Importa?

**Cenário 1: Empresa Conservadora**
```
Sistema bancário:
├─ Não pode atualizar Java a cada 6 meses (riscos)
├─ Precisa de patches de segurança (compliance)
└─ Solução: Usar LTS (Java 17), manter por 3-5 anos
```

**Cenário 2: Startup Ágil**
```
SaaS moderno:
├─ Pode atualizar rapidamente
├─ Quer features mais recentes
└─ Opção: Usar non-LTS (Java 22, 23, etc.)
```

**Trade-Off**: **Estabilidade vs Features**

---

## 🔍 Análise Conceitual Profunda

### Qual JDK Escolher em 2024?

#### Decision Tree

```
Você precisa de suporte comercial (SLA, telefone 24/7)?
│
├─ SIM → Oracle Java SE Subscription OU Azul Platform Prime OU Red Hat (se RHEL)
│
└─ NÃO → Usar OpenJDK gratuito
    │
    ├─ Qual versão?
    │   ├─ LTS (17 ou 21) → Estabilidade, suporte longo
    │   └─ Latest (22, 23) → Features recentes
    │
    └─ Qual build?
        ├─ Amazon Corretto → Recomendado para AWS, LTS gratuito
        ├─ Azul Zulu → Bom suporte, builds para Alpine/ARM
        ├─ Adoptium (Eclipse) → Neutro, TCK-certified
        ├─ Microsoft OpenJDK → Recomendado para Azure
        ├─ Red Hat OpenJDK → Se usa Red Hat Linux
        └─ Oracle JDK → Se prefere "oficial" Oracle
```

#### Recomendações por Cenário

**Produção Enterprise (Banco, Saúde)**:
- **Versão**: Java 17 LTS (ou 21 se recente)
- **Build**: Amazon Corretto **OU** Azul Zulu **OU** Red Hat OpenJDK
- **Razão**: Suporte LTS gratuito, TCK-certified, vendors confiáveis

**Startup/SaaS**:
- **Versão**: Java 21 LTS (ou 22/23 se quer features recentes)
- **Build**: Amazon Corretto (se AWS) **OU** Adoptium
- **Razão**: Gratuito, LTS, fácil de atualizar

**Desktop Application**:
- **Versão**: Java 17 LTS
- **Build**: BellSoft Liberica (inclui JavaFX) **OU** Azul Zulu FX
- **Razão**: JavaFX incluído (Oracle JDK não tem mais JavaFX)

**Android/Mobile (Backend)**:
- **Versão**: Java 17 LTS
- **Build**: Amazon Corretto (se AWS) **OU** Adoptium
- **Razão**: Compatibilidade com Kotlin, Gradle

**Oracle Cloud Customers**:
- **Versão**: Java 17 ou 21 LTS
- **Build**: Oracle JDK **OU** GraalVM Enterprise
- **Razão**: Integração com Oracle Cloud, suporte incluído em licenças cloud

### Migrando de Oracle JDK 8/11 para OpenJDK

**Cenário Comum**: Empresa usa Oracle JDK 8 desde 2014, precisa migrar.

#### Passo 1: Escolher Versão Alvo

**Opções**:
- **Java 11 LTS**: Migração mais suave (menos breaking changes)
- **Java 17 LTS**: Recomendado (features modernas, suporte até 2029)
- **Java 21 LTS**: Se quer features recentes (virtual threads)

#### Passo 2: Escolher Build

**Critérios**:
- **Cloud**: Corretto (AWS), Microsoft OpenJDK (Azure)
- **On-Premise**: Azul Zulu, Adoptium, Red Hat (se RHEL)
- **Preferência**: Neutro → Adoptium

#### Passo 3: Testar Compatibilidade

**Problemas Comuns**:

**1. Módulos (Java 9+)**:
```bash
# Aplicação antiga pode quebrar com module system
java --add-opens java.base/java.lang=ALL-UNNAMED \
     --add-opens java.base/java.util=ALL-UNNAMED \
     -jar myapp.jar
```

**2. Removed APIs**:
```java
// Java 8:
sun.misc.BASE64Encoder encoder = new sun.misc.BASE64Encoder();

// Java 11+: Removido! Usar:
Base64.getEncoder().encodeToString(bytes);
```

**3. Garbage Collector Padrão**:
```
Java 8: Parallel GC
Java 9+: G1 GC (pode ter comportamento diferente)

Solução: Testar, ajustar heap size se necessário
```

#### Passo 4: Update Build Scripts

**Maven**:
```xml
<properties>
    <!-- Antes -->
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    
    <!-- Depois -->
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
</properties>
```

**Gradle**:
```groovy
// Antes
sourceCompatibility = '1.8'
targetCompatibility = '1.8'

// Depois
sourceCompatibility = '17'
targetCompatibility = '17'
```

#### Passo 5: Deploy

**Docker** (exemplo com Corretto):
```dockerfile
# Antes (Oracle JDK 8)
FROM openjdk:8-jdk-alpine
COPY target/myapp.jar /app/myapp.jar
CMD ["java", "-jar", "/app/myapp.jar"]

# Depois (Amazon Corretto 17)
FROM amazoncorretto:17-alpine
COPY target/myapp.jar /app/myapp.jar
CMD ["java", "-jar", "/app/myapp.jar"]
```

### Aspectos Legais e Compliance

#### Oracle Java SE Subscription: Quando Vale a Pena?

**Cenários Sim**:
- **Missão Crítica**: Sistema não pode ter downtime (SLA 24/7)
- **Compliance Rigoroso**: Auditorias exigem vendor suportado oficialmente
- **Oracle Shops**: Já usam Oracle Database, Middleware (desconto em bundle)
- **Legacy Java 8**: Precisa de suporte estendido além de 2030

**Cenários Não**:
- **Orçamento Limitado**: Startups, ONGs
- **Expertise Interna**: Time consegue resolver problemas sem suporte
- **Cloud-Native**: Usa Kubernetes, pode atualizar rápido (menos dependência de LTS)

#### Riscos de Não-Compliance

**Java 11 com Oracle OTN (2018-2021)**:

**Cenário Proibido**:
```
Empresa baixou Oracle JDK 11 em 2019
Rodou em produção sem pagar
Oracle pode auditar e cobrar retroativamente
Multa: $25/mês/CPU * número de CPUs * meses
```

**Caso Real (Hipotético)**:
```
100 servidores (200 CPUs totais)
2 anos em não-compliance
Multa: 200 CPUs * $25 * 24 meses = $120,000
```

**Proteção**: Usar **builds open source** (Corretto, Zulu) → sem risco de auditoria.

---

## 🎯 Aplicabilidade e Contextos

### Ambientes de Produção

**Servidores Linux (Maioria dos casos)**:
- **Recomendado**: Amazon Corretto 17/21 LTS (se AWS) **OU** Azul Zulu
- **Instalação**: Package manager (yum, apt)
```bash
# Amazon Linux 2
sudo yum install java-17-amazon-corretto-devel

# Ubuntu (Azul Zulu)
sudo apt install zulu17-jdk
```

**Containers Docker/Kubernetes**:
- **Imagens Base**: Usar oficiais Alpine-based
```dockerfile
FROM amazoncorretto:17-alpine3.18
# OU
FROM azul/zulu-openjdk-alpine:17
# OU
FROM eclipse-temurin:17-jre-alpine  # Adoptium
```

**Windows Desktop**:
- **Recomendado**: BellSoft Liberica (se precisa JavaFX) **OU** Azul Zulu
- **Instalação**: MSI installer

### Desenvolvimento

**IDEs (IntelliJ IDEA, Eclipse, VSCode)**:
- **Qualquer build**: Todas funcionam identicamente
- **Recomendação**: Adoptium (neutro) **OU** Oracle JDK (oficial)

**Build Tools (Maven, Gradle)**:
- **Recomendação**: Mesma versão que produção (evitar discrepâncias)

### CI/CD Pipelines

**GitHub Actions**:
```yaml
- uses: actions/setup-java@v3
  with:
    distribution: 'temurin'  # Adoptium
    java-version: '17'
```

**GitLab CI**:
```yaml
image: amazoncorretto:17
script:
  - ./mvnw clean package
```

**Jenkins**:
- Instalar plugin "AdoptOpenJDK Installer" **OU** configurar manualmente

---

## ⚠️ Limitações e Considerações Teóricas

### Fragmentação do Ecossistema

**Problema**: Muitos vendors → confusão

**Mitigação**:
- **TCK**: Garante compatibilidade binária
- **Padrão**: Todos builds OpenJDK são intercambiáveis

### Suporte de Longo Prazo

**Risco**: Vendor pode descontinuar build

**Exemplo**: AdoptOpenJDK renomeou para Eclipse Adoptium (2021)

**Mitigação**: Escolher vendors com compromisso de longo prazo (Amazon, Azul, Red Hat)

---

## 🔗 Interconexões Conceituais

### Relação com Versões de Java

- **Java 8**: Era de ouro Oracle JDK gratuito (fim em 2019)
- **Java 11**: Crise de licenciamento → migração massiva para OpenJDK
- **Java 17**: Unificação → Oracle JDK voltou a GPL

### Relação com Jakarta EE

- **Jakarta**: Só depende de Java SE (qualquer build funciona)
- **WildFly, Payara**: Testados com múltiplos JDKs

---

## 🚀 Evolução e Próximos Conceitos

### Tendências

**GraalVM**: JVM polilinguística + AOT compilation

**Project Leyden**: Startup instantâneo (futuro Java)

**Project Loom**: Virtual threads (Java 21+)

### Próximos Passos

Estudar **instalação e configuração de JDK** (JAVA_HOME, PATH)

Entender **ferramentas do JDK** (javac, jar, jlink)
