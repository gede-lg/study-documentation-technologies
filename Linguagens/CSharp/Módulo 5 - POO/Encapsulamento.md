Encapsulamento é um dos quatro fundamentos da programação orientada a objetos (OOP), sendo os outros a herança, a polimorfia e a abstração. No contexto da linguagem C#, o encapsulamento é uma técnica que protege o estado de um objeto, impedindo que código externo acesse diretamente os dados internos do objeto ou modifique-os sem controle. Vamos explorar detalhadamente o conceito de encapsulamento, seus níveis de visibilidade, a sintaxe para cada um desses níveis, e membros estáticos em C#.

### O que é e para que serve?

Encapsulamento em C# serve para:
- **Proteger os dados**: Evita que o estado interno dos objetos seja modificado de maneira inesperada ou inadequada.
- **Simplificar a interface**: Ao ocultar a complexidade interna, o encapsulamento oferece uma interface mais simples para o usuário da classe.
- **Facilitar a manutenção**: Alterações internas em uma classe não afetam o código que a utiliza, desde que a interface pública permaneça inalterada.

### Níveis de Visibilidade

Em C#, existem vários níveis de visibilidade que controlam o acesso aos membros de uma classe (métodos, propriedades, campos, etc.):

1. **`public`**: O membro é acessível de qualquer parte do código.
2. **`private`**: O membro é acessível apenas dentro da classe onde é declarado.
3. **`protected`**: O membro é acessível dentro da classe onde é declarado e por classes derivadas.
4. **`internal`**: O membro é acessível apenas dentro do mesmo assembly.
5. **`protected internal`**: O membro é acessível dentro do mesmo assembly ou de classes derivadas.
6. **`private protected`**: O membro é acessível apenas dentro da classe onde é declarado ou por classes derivadas dentro do mesmo assembly.

### Sintaxe de Uso

A seguir, são apresentados exemplos de como utilizar cada nível de visibilidade em C#:

```csharp
public class ExemploEncapsulamento
{
    public int Publico = 1; // Acessível de qualquer lugar
    private int _privado = 2; // Acessível apenas dentro desta classe
    protected int Protegido = 3; // Acessível dentro desta classe e classes derivadas
    internal int Interno = 4; // Acessível dentro deste assembly
    protected internal int ProtegidoInterno = 5; // Acessível dentro deste assembly e classes derivadas
    private protected int PrivadoProtegido = 6; // Acessível dentro desta classe e classes derivadas dentro deste assembly
}
```

### Membros Estáticos

Membros estáticos em C# são membros de uma classe que pertencem à classe em si, em vez de pertencer a uma instância específica da classe. Eles são acessados diretamente através do nome da classe, sem a necessidade de criar uma instância. Membros estáticos podem ser úteis para representar dados ou comportamentos que são comuns a todas as instâncias da classe.

```csharp
public class Calculadora
{
    public static int Somar(int a, int b)
    {
        return a + b;
    }
}
// Acesso ao membro estático
int resultado = Calculadora.Somar(5, 3);
```

### Observações Importantes

- **Encapsulamento via Propriedades**: Em C#, frequentemente usamos propriedades (com `get` e `set`) para encapsular campos. As propriedades permitem um controle mais fino sobre o acesso e a modificação dos dados.
- **Boas Práticas**: Utilize o encapsulamento para proteger o estado interno dos objetos e expor apenas o necessário para o uso externo da classe.
- **Membros estáticos e Encapsulamento**: Embora os membros estáticos não sejam instanciados, eles ainda podem ser encapsulados usando os modificadores de acesso mencionados acima.

Encapsulamento é fundamental para a criação de software robusto, facilitando a manutenção e a evolução dos sistemas. Através do uso adequado dos níveis de visibilidade e da compreensão de como e quando usar membros estáticos, você pode projetar suas classes de maneira a proteger seus dados internos, enquanto expõe uma interface clara e concisa para os usuários da classe.