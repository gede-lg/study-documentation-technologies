# Módulo 7: Programação Avançada em Java - Annotations

## 1. O que são Annotations?

Annotations no Java são metadados que fornecem informações adicionais sobre o código. Elas não têm efeito direto na operação do código que anotam, mas podem ser utilizadas por ferramentas e bibliotecas para processamento em tempo de compilação, tempo de execução ou ambos.

### Exemplo Básico:
```java
@Override
public String toString() {
    return "Exemplo de Annotation";
}
```
`@Override` é uma annotation que indica que o método está sobrescrevendo um método da superclasse.

## 2. Para que servem?

Annotations são usadas para diversas finalidades, como:

- **Documentação**: Ajudam a entender o código e podem ser utilizadas por ferramentas de geração de documentação.
- **Checagem de Erros**: Podem ajudar a evitar erros, como no caso da annotation `@Override`.
- **Configuração de Frameworks**: Muito utilizadas em frameworks modernos, como Spring e Hibernate, para configuração e definição de comportamentos.

## 3. Como e quando utilizar annotations?

Annotations podem ser aplicadas em declarações de classes, métodos, variáveis, parâmetros, entre outros. São utilizadas quando se deseja fornecer metadados para esses elementos.

### Exemplo com Spring Framework:
```java
@Controller
public class MeuController {
    // ...
}
```
`@Controller` é uma annotation do Spring que indica que a classe é um controlador MVC.

### Quando Usar:

- **@Override**: Quando sobrescrever um método.
- **@Deprecated**: Para indicar que um método ou classe não deve mais ser utilizado.
- **@SuppressWarnings**: Para suprimir avisos específicos do compilador.
- **Annotations de Frameworks**: Conforme as necessidades do framework utilizado.

## 4. Como criar minhas próprias Annotations?

Para criar uma annotation personalizada, você define uma interface com a palavra-chave `@interface`. 

### Exemplo:
```java
public @interface MinhaAnnotation {
    String valor() default "Padrão";
}
```
Esta annotation pode agora ser usada para anotar classes, métodos, etc.

### Usando a Annotation Customizada:
```java
@MinhaAnnotation(valor = "Teste")
public class MinhaClasse {
    // ...
}
```

## Tópicos Adicionais

### Tipos de Annotations:

- **Marcadores**: Sem elementos, como `@Override`.
- **Single-Value**: Possuem um único valor.
- **Multi-Value**: Contêm múltiplos elementos.

### Processamento de Annotations:

- **Em Tempo de Compilação**: Processadas por ferramentas de desenvolvimento.
- **Em Tempo de Execução**: Processadas em tempo de execução através de reflexão (Java Reflection).

### Reflexão (Reflection):

- É uma característica da linguagem Java que permite inspecionar e manipular classes, métodos e interfaces em tempo de execução.
- Pode ser usada para obter informações de annotations em tempo de execução.

### Exemplo de Reflexão:

```java
public class ReflexaoExemplo {
    public static void main(String[] args) {
        Class<?> obj = MinhaClasse.class;
        if (obj.isAnnotationPresent(MinhaAnnotation.class)) {
            // Processamento da annotation
        }
    }
}
```

### Considerações de Desempenho:

- O uso excessivo de reflexão e processamento de annotations pode impactar o desempenho da aplicação.
- É essencial avaliar a necessidade e o impacto de cada annotation utilizada.

### Melhores Práticas:

As annotations customizadas no Java são utilizadas para definir metadados específicos que podem ser interpretados e utilizados pelo seu próprio código ou por frameworks. Elas servem para diversas finalidades, incluindo a validação de dados, a configuração de aspectos de comportamento em frameworks, e até mesmo para melhorar a legibilidade e a manutenção do código.

Vamos ver um exemplo prático:

### Cenário: Validar um Campo de E-mail

Suponha que você queira garantir que um campo de e-mail em suas classes esteja sempre em um formato válido. Você pode criar uma annotation customizada para isso.

#### 1. Criando a Annotation

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang

.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface EmailValido {
    String message() default "E-mail inválido";
}
```

Neste exemplo, `@EmailValido` é a annotation customizada. `@Retention(RetentionPolicy.RUNTIME)` indica que a annotation deve ser mantida em tempo de execução, permitindo que seja lida via reflexão. `@Target(ElementType.FIELD)` especifica que esta annotation pode ser aplicada a campos (atributos de classes).

#### 2. Utilizando a Annotation

Você pode usar essa annotation em qualquer campo de e-mail que deseja validar.

```java
public class Usuario {

    @EmailValido
    private String email;

    // Getters e setters
}
```

#### 3. Processando a Annotation

Para fazer a validação, você precisaria de um método que verifica se o campo anotado com `@EmailValido` está em um formato válido de e-mail. Isso poderia ser feito por meio de reflexão.

```java
public static boolean validarEmails(Object obj) throws IllegalAccessException {
    Class<?> clazz = obj.getClass();
    for (Field field : clazz.getDeclaredFields()) {
        if (field.isAnnotationPresent(EmailValido.class)) {
            field.setAccessible(true);
            String email = (String) field.get(obj);
            // Aqui você aplicaria a lógica de validação de e-mail
            if (!emailValido(email)) {
                System.out.println(field.getAnnotation(EmailValido.class).message());
                return false;
            }
        }
    }
    return true;
}

private static boolean emailValido(String email) {
    // Implemente a lógica de validação de e-mail aqui
}
```

### Para que Serve?

O uso de annotations customizadas como este serve para:

- **Validação de Dados**: Como demonstrado no exemplo, para validar campos específicos de um objeto.
- **Configuração e Metadados**: Pode ser usada para configurar comportamentos em tempo de execução, como mapear propriedades para um banco de dados ou para JSON/XML.
- **Melhoria na Legibilidade**: Torna o código mais legível, identificando claramente os propósitos e regras associadas aos elementos do código.
- **Reuso**: Uma vez definida, a annotation pode ser reutilizada em múltiplos locais, promovendo a reutilização de código e padronização.

Lembre-se, o poder das annotations customizadas está na forma como você as implementa e processa em seu código ou frameworks, trazendo uma flexibilidade incrível para a solução de problemas específicos do seu domínio de aplicação.