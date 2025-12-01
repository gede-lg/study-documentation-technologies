
O encapsulamento é um dos pilares fundamentais da Programação Orientada a Objetos (POO). Ele se refere à prática de manter os dados (variáveis) de uma classe ocultos e seguros de acesso externo, expondo apenas métodos (funções) para a manipulação desses dados.

### Conceito de Encapsulamento

- **Definição**: Encapsulamento é a técnica de restringir o acesso direto aos dados de um objeto e controlar a maneira como esses dados são modificados ou acessados.
- **Benefícios**:
  - **Segurança**: Protege os dados de acessos e modificações indevidas.
  - **Flexibilidade e Manutenção**: Permite mudanças internas sem afetar outras partes do código.
  - **Abstração**: Oculta a complexidade e mostra apenas o necessário para o usuário da classe.

### Implementação de Encapsulamento em Java

Em Java, o encapsulamento é implementado usando modificadores de acesso. Estes definem como os membros (variáveis e métodos) de uma classe podem ser acessados.

### `Níveis de Visibilidade`

Java possui quatro níveis de visibilidade:

1. **Private**: O membro só pode ser acessado dentro da própria classe.
2. **Default** (sem modificador): O membro é acessível dentro de qualquer classe no mesmo pacote.
3. **Protected**: O membro é acessível dentro do mesmo pacote e por subclasses.
4. **Public**: O membro é acessível de qualquer lugar.

### Exemplos de Código

```java
public class Pessoa {
    // Variáveis com acesso privado
    private String nome;
    private int idade;

    // Construtor público
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    // Métodos públicos para acessar e modificar as variáveis privadas
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        if (idade > 0) {
            this.idade = idade;
        }
    }
}
```

### Práticas Recomendadas

- **Uso de Getters e Setters**: Métodos públicos para obter (get) e modificar (set) os valores de variáveis privadas.
  - **Getters**: Métodos que retornam o valor de uma variável.
  - **Setters**: Métodos que definem ou atualizam o valor de uma variável.

### Aplicação Prática

- **Validação de Dados**: O encapsulamento permite validar os dados antes de modificá-los, como visto no método `setIdade`.
- **Controle de Acesso**: Restringe-se o acesso direto às variáveis, controlando como os dados da classe são acessados e modificados.