# Integração com componentModel

## Introdução

MapStruct é uma biblioteca Java de mapeamento de objetos que gera implementações de mapeadores (mappers) em tempo de compilação. Quando integrado ao Spring Boot via `componentModel = "spring"`, os mappers passam a ser gerenciados como beans do Spring, permitindo injeção direta em componentes (por exemplo, services e controllers). Esta integração simplifica a conversão entre entidades e DTOs sem a necessidade de instanciar manualmente os mappers.

## Sumário

1. Conceitos Fundamentais
2. Sintaxe Detalhada e Uso Prático (visão geral sem código)
3. Cenários de Restrição ou Não Aplicação
4. Componentes Chave Associados
5. Melhores Práticas e Padrões de Uso
6. Exemplo Prático Completo (visão geral)
7. Sugestões para Aprofundamento

---

## 1. Conceitos Fundamentais

- **O que é MapStruct?**
    - Um gerador de código que converte objetos fonte (por ex., entidades JPA) em objetos alvo (por ex., DTOs) e vice-versa.
    - Funciona em tempo de compilação, criando classes que recorrem a getters/setters ou a construtores para copiar valores.
- **Por que usar `componentModel = "spring"`?**
    - Torna o mapper um bean gerenciado pelo Spring (escopo singleton por padrão).
    - Permite injeção automática (via `@Autowired` ou construtor) em outros componentes Spring.
    - Evita necessidade de instanciá-lo manualmente ou usar fábricas estáticas.
- **Vantagens Gerais**
    - Desempenho melhor que mapeamentos via reflexão em tempo de execução.
    - Código gerado é simples e fácil de debugar.
    - Reduz boilerplate e erros humanos ao escrever mapeamentos manuais.

---

## 2. Sintaxe Detalhada e Uso Prático (visão geral sem código)

- **Definição de um Mapper**
    - Você declara uma interface anotada indicando que é um mapper e informa que o `componentModel` deve ser “spring”.
    - O MapStruct gera automaticamente a implementação dessa interface no build.
- **Injeção via Spring**
    - Uma vez compilado, o Spring reconhece automaticamente o mapper como bean e injeta onde for necessário.
    - Não é preciso chamar métodos estáticos para obter instâncias; basta usar injeção padrão do Spring (por exemplo, anotando a dependência em um Service).
- **Configuração no projeto**
    - É necessário adicionar a dependência do MapStruct (no Maven ou Gradle) e configurar o processador de anotações.
    - Com o Spring Boot, não costuma haver configurações extras além das dependências, pois o Spring Boot já detecta os processadores padrão.

---

## 3. Cenários de Restrição ou Não Aplicação

- **Projetos sem uso de Spring**
    - Se a aplicação não utiliza o ecossistema Spring, a configuração `componentModel = "spring"` não se aplica; deve-se usar o modelo padrão ou outro modelo (p. ex., `default` ou `jsr330`).
- **Mapeamentos Muito Dinâmicos**
    - Para cenários onde mapeamentos dependem de lógica complexa em tempo de execução, MapStruct pode não atender completamente, pois gera código estático.
- **Projetos Pequenos ou de Curta Duração**
    - Se a quantidade de DTOs e entidades for muito pequena, o ganho de produtividade do MapStruct pode não compensar configurar todo o processo (embora geralmente valha a pena).
- **Ambientes com Restrições de Build**
    - Se o pipeline de build não permitir processadores de anotações, não será possível gerar os mappers automaticamente.

---

## 4. Componentes Chave Associados

- **Interface do Mapper**
    - Define as assinaturas de métodos de mapeamento (por ex., de `UserEntity` para `UserDTO`).
    - Anotada para indicar que é um mapper gerado (usualmente com `@Mapper(componentModel = "spring")`).
- **Anotações de Mapeamento**
    - Permitem configurar correspondências de propriedades que não seguem nomes iguais.
    - Configurações opcionais como ignorar campos, mapeamento personalizado via expressão ou uso de outros mappers.
- **Instância Gerada**
    - Em tempo de compilação, o MapStruct cria uma classe de implementação que segue a interface.
- **Bean do Spring**
    - O Spring detecta essa classe como bean (graças à anotação com `componentModel`) e a disponibiliza via contexto.
- **Dependências no Build**
    - Biblioteca principal do MapStruct e processador de anotações (annotation processor).
    - No Maven/Gradle, adiciona-se o plugin ou a configuração para rodar o processador no compile time.

---

## 5. Melhores Práticas e Padrões de Uso

- **Definir Mappers Pequenos e Específicos**
    - Crie um mapper para cada contexto (por ex., `UserMapper` apenas para converter usuário), evitando monólitos de mapeamento.
- **Reutilização de Mapeamentos Comuns**
    - Se dois mappers precisam converter objetos similares, utilize referências a mappers auxiliares ou use `uses = {OutroMapper.class}`.
- **Nomes de Métodos Claros**
    - Mantenha assinaturas consistentes, como `toDTO` e `toEntity`, para facilitar compreensão.
- **Tratamento de Listas e Coleções**
    - O MapStruct consegue mapeamentos de listas/coleções automaticamente se o tipo genérico for compatível.
- **Manter Configurações Padrão no Perfil de Testes**
    - Use perfis ou propriedades para habilitar/desabilitar mapeamento ou gerar proxies se for necessário em ambientes de teste.
- **Versionamento de Mapas**
    - Se a estrutura de entidades mudar, reveja os mappers antes de atualizar a versão da biblioteca, já que pequenas quebras podem gerar erros de compilação.
- **Documentar Casos Especiais**
    - Quando houver mapeamentos complexos (por ex., campos que exigem lógica de conversão adicional), documente claramente o uso de `@Mapping` para facilitar manutenção.

---

## 6. Exemplo Prático Completo (visão geral)

> Nesta seção, apresentamos um fluxo de ponta a ponta descrevendo como um mapper é definido, gerado e usado em um Service do Spring Boot, sem entrar no detalhe linha a linha de código.
> 
1. **Configuração do Projeto**
    - Declaração das dependências do MapStruct e do processador no `pom.xml` ou `build.gradle`.
    - O Spring Boot detecta automaticamente o processador de anotações e gera classes conforme a interface anotada.
2. **Criação da Interface do Mapper**
    - O desenvolvedor define uma interface simples, indicando que será um mapper do MapStruct e especifica `componentModel = "spring"`.
    - Não há instanciamento manual; o Spring se encarrega de criar o bean no contexto.
3. **Geração de Código**
    - Durante a fase de compilação, o MapStruct analisa todas as interfaces anotadas e gera classes concretas (`UserMapperImpl`, por exemplo).
    - O Spring registra essas classes como beans, prontos para injeção.
4. **Consumo no Service**
    - Em um componente Service ou Controller, injeta-se a interface do mapper normalmente, sem precisar se preocupar com a implementação.
    - O método de conversão é chamado para transformar uma entidade em DTO antes de retornar ao cliente ou vice-versa ao receber dados de entrada.
5. **Benefícios Observados**
    - Conversões ocorrem rapidamente, sem reflexão.
    - Código mais limpo em layers superiores (Service/Controller), pois não há lógica manual de cópia de propriedades.
    - Fácil manutenção quando surgem mudanças nos modelos, pois falhas de compilação apontam mapeamentos faltantes.

---

## 7. Sugestões para Aprofundamento

- **Documentação Oficial do MapStruct**
    - Explore os tópicos sobre customização avançada de mapeamentos e uso de expressões.
- **Artigos sobre Performance**
    - Pesquise benchmarks que comparem mapeamento gerado por MapStruct versus soluções baseadas em reflexão (como ModelMapper).
- **Integração com Testes de Unidade**
    - Entenda como configurar testes para validar que o mapper realmente converte campos conforme esperado, sem depender de instância manual.
- **Casos Específicos: Mapeamentos de Tipos Complexos**
    - Veja exemplos de conversão de `LocalDateTime`, `Enum` ou objetos aninhados, e estratégias para lidar com nulos ou formatos diferentes.
- **Comparações com Outras Ferramentas**
    - Analise vantagens e limitações em relação a bibliotecas como Dozer, ModelMapper ou MapStruct em cenários de microsserviços.

---

Com este resumo, você tem uma visão geral sobre como o MapStruct se integra ao Spring Boot usando `componentModel = "spring"`, quais são seus principais componentes, quando evitar seu uso e boas práticas para manter mapeamentos confiáveis e fáceis de manter.