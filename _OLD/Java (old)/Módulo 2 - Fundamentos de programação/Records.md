## O que são e para que servem as Records?

`Records` são uma construção de linguagem introduzida para representar classes de dados simples, concisas e imutáveis. Elas são um tipo especial de classe em Java que ajuda a modelar dados de forma compacta. A sintaxe de `records` reduz a verbosidade ao automatizar a geração de getters, o método `toString()`, `equals()` e `hashCode()`. Assim, você evita o boilerplate code associado à criação de POJOs (Plain Old Java Objects) tradicionais.

### Sintaxe básica de `Records`:

```java
public record NomeRecord(Tipo1 campo1, Tipo2 campo2, ..., TipoN campoN) {}
```

Neste exemplo, `NomeRecord` seria o nome da `record`, e ela poderia ter diversos campos (`campo1`, `campo2`, ..., `campoN`) de diferentes tipos (`Tipo1`, `Tipo2`, ..., `TipoN`).

### Sintaxe complexa de `Records`:

```java
public record NomeDoRecord(Tipo1 campo1, Tipo2 campo2, ..., TipoN campoN) {

	// Atributo estático
	public static final String NOME_ATRIBUTO = "Valor Atributo";
	
    // Construtor(s) personalizado(s)
    public NomeDoRecord {
        // validações ou transformações
    }

    // Métodos adicionais
    public TipoRetorno metodoAdicional() {
        // implementação do método
    }

    // Sobrescritas de métodos
    @Override
    public boolean equals(Object o) {
        // implementação customizada, se necessário
    }

    @Override
    public int hashCode() {
        // implementação customizada, se necessário
    }

    @Override
    public String toString() {
        // implementação customizada, se necessário
    }
}

```

Neste exemplo, `NomeRecord` seria o nome da `record`, e ela poderia ter diversos campos (`campo1`, `campo2`, ..., `campoN`) de diferentes tipos (`Tipo1`, `Tipo2`, ..., `TipoN`).

### O que você pode fazer:

- **Definir métodos estáticos e não estáticos:** Você pode adicionar métodos adicionais para fornecer mais funcionalidades além dos acessores automáticos.
- **Implementar interfaces:** `records` podem implementar qualquer número de interfaces.
- **Sobrescrever métodos:** Você pode sobrescrever métodos herdados, como `equals()`, `hashCode()`, e `toString()`, para alterar seu comportamento padrão, embora a necessidade disso seja rara.
- **Definir construtores personalizados:** Embora um construtor padrão seja automaticamente fornecido, você pode definir construtores personalizados para validar ou processar os dados antes de um objeto ser criado. No entanto, qualquer construtor personalizado deve delegar ao construtor canônico (o construtor primário que aceita todos os componentes do `record` como argumentos).

### O que você não pode fazer:

- **Adicionar campos adicionais mutáveis ou imutáveis:** Todos os campos de um `record` devem ser os componentes declarados em sua definição. Isso ajuda a manter a imutabilidade e a semântica clara de igualdade baseada no estado de seus componentes.
- **Estender uma classe:** `records` são implicitamente `final`, então eles não podem ser a base para outras classes.

### Por que o uso de DTO com records são considerados eficientes?

Utilizar `records` para definir DTOs é considerado eficiente por diversos motivos:

1. **Imutabilidade**: Os campos de um `record` são final por padrão, o que significa que um DTO definido como um `record` é imutável. Isso é vantajoso para a segurança e integridade dos dados, especialmente em aplicações concorrentes.
2. **Redução de Boilerplate**: Ao usar `records`, evita-se a necessidade de escrever getters, setters, `equals()`, `hashCode()`, e `toString()` manualmente, o que torna o código mais limpo e fácil de manter.
3. **Legibilidade**: O código se torna mais expressivo e fácil de entender, já que a declaração de um `record` encapsula claramente a intenção de modelar uma estrutura de dados imutável.

### Sintaxe de uso de DTOs com records

Vamos criar um DTO para um `Usuário`, utilizando `record`:

```java
public record UsuarioDTO(Long id, String nome, String email) {}
```

Neste exemplo, `UsuarioDTO` é um DTO para a entidade `Usuário`, contendo um `id`, `nome`, e `email` como seus campos. Graças ao `record`, cada campo tem seu getter gerado automaticamente, e os métodos `equals()`, `hashCode()`, e `toString()` também são gerados, baseando-se nos campos do `record`.

### Exemplo de utilização:

Suponha que você tenha um serviço que retorna informações de usuário. Você poderia usar o `UsuarioDTO` da seguinte forma:

```java
public UsuarioDTO buscarUsuarioPorId(Long id) {
    // Suponha que este método busca um usuário na base de dados
    Usuario usuario = usuarioRepository.findById(id);
    return new UsuarioDTO(usuario.getId(), usuario.getNome(), usuario.getEmail());
}
```

## Considerações adicionais

- **Construtores Personalizados**: Embora `records` sejam imutáveis e tenham um construtor padrão, você pode definir construtores adicionais, se necessário, para realizar validações ou operações antes de atribuir valores aos campos.
- **Métodos**: Além de campos e construtores, `records` podem conter métodos. Esses métodos podem ser úteis para lógicas específicas relacionadas aos dados que o `record` carrega.
- **Herança**: `Records` não podem herdar de outras classes, mas podem implementar interfaces. Isso mantém a imutabilidade e a simplicidade dos `records`, alinhadas com sua finalidade de representar conjuntos simples de dados.

Ao utilizar `records` para definir DTOs em aplicações Java, você simplifica a modelagem de dados imutáveis e torna seu código mais claro e conciso, o que é especialmente útil para a camada de transferência de dados entre diferentes partes de uma aplicação.