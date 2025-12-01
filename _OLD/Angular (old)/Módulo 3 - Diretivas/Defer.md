Conteudo baseado em [Novidades no Angular 17 | Alura](https://www.alura.com.br/artigos/novidades-angular-17)

O lazy loading é uma técnica importante quando criamos páginas web pois tem como objetivo carregar recursos apenas quando são necessários. No contexto do Angular, isso significa carregar módulos ou componentes somente quando são requisitados, melhorando o tempo de carregamento inicial da aplicação.

A versão 17 do Angular trouxe uma nova ferramenta para otimizar esse processo: as _deferrable views_ ou visualizações adiáveis. Esse mecanismo pode ser utilizado para tornar seus apps mais rápidos e com melhor desempenho.

A estrutura se baseia em um bloco de código adiável `@defer` que pode ser acompanhado de um bloco `@placeholder`, que vai conter um conteúdo que será exibido enquanto o bloco adiado não estiver disponível, um bloco `@loading` que traz a mensagem de carregamento e um bloco `@error` para exibição em caso de erro.

Para exemplificar o uso desta ferramenta, vamos utilizar o projeto que utilizamos nos exemplos anteriores, a lista de estudos.

No projeto criamos um novo componente chamado **conteudo-estudos**, que será uma página com texto e imagens. No nosso componente de lista, adicionamos um botão que leva para o novo componente.

Nesse novo componente, temos um grande volume de texto e algumas imagens:

```html
<!-- modo on timer -->
	@defer (on timer(4s)) {
		<img src="../../assets/logo-javascript.png" alt="Logo do Angular" width="100px" height="100px">
	} @placeholder {
		<p>Futura imagem</p>
	}@loading {
		<p>Carregando imagem...</p>
	} @error {
		<p>Carregamento falhou!</p>
	}
```