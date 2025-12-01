### O que são Métodos de Classe UML

Métodos de classe, também conhecidos como operações, são funções ou procedimentos especificados dentro de uma classe em UML. Eles definem o comportamento dos objetos criados a partir da classe e podem modificar os estados dos objetos, ou seja, seus atributos. Os métodos são a forma como as classes interagem e executam processos no contexto do sistema modelado.

### Para que servem

Os métodos de classe servem para:

- **Encapsular Funcionalidades**: Eles encapsulam a funcionalidade que um objeto da classe pode realizar, seguindo o princípio da encapsulação da Programação Orientada a Objetos (POO).
- **Definir Comportamento**: Os métodos definem como uma classe responde a "mensagens" ou interações de outras classes ou de si mesma.
- **Modificar Atributos**: Eles podem alterar os valores dos atributos da classe, controlando assim o estado dos objetos.
- **Implementar Relações**: Métodos podem ser usados para implementar relações entre classes, como associações, agregações e composições, facilitando a comunicação e interação entre diferentes partes de um sistema.

### Sintaxe

A sintaxe de um método em um Diagrama de Classe UML inclui o nome do método, parâmetros (se houver) e o tipo de retorno. A sintaxe geral é:

```
visibilidade nomeDoMétodo(parâmetro1: Tipo1, parâmetro2: Tipo2, ...): TipoDeRetorno
```

- **Visibilidade**: Indica o nível de acesso do método e pode ser representado por símbolos (+ para público, - para privado, # para protegido e ~ para pacote).
- **NomeDoMétodo**: O nome da operação ou método.
- **Parâmetros**: Lista de parâmetros que o método aceita, cada um com um tipo especificado.
- **TipoDeRetorno**: O tipo de dado que o método retorna após sua execução. Se o método não retorna nada, isso pode ser omitido ou indicado por um tipo especial, como `void`.

### Exemplo de Código

Vamos considerar uma classe simples `Carro` com um método para iniciar o carro:

```java
public class Carro {
    private String modelo;
    private boolean ligado = false;

    public void ligarCarro() {
        ligado = true;
        System.out.println("Carro ligado!");
    }
}
```

Neste exemplo, `public void ligarCarro()` é um método de classe que muda o estado do atributo `ligado` para `true` e imprime uma mensagem.

### Informações Adicionais Importantes

- **Abstração e Polimorfismo**: Métodos em UML também permitem abstração e polimorfismo, onde métodos de mesma assinatura em diferentes classes realizam operações específicas a cada classe, respectivamente.
- **Diagramas de Sequência**: Métodos são frequentemente representados em Diagramas de Sequência UML para mostrar interações específicas entre objetos ao longo do tempo.
- **Estereótipos**: Em UML, é possível adicionar estereótipos aos métodos para indicar padrões de design ou outras características especiais, como <<create>> para construtores.
Ao modelar sistemas usando UML e Diagramas de Classes, entender e aplicar corretamente os métodos de classe é crucial para definir o comportamento do sistema de forma clara e eficaz.