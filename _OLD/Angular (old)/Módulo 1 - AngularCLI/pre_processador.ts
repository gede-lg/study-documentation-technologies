/* 
    No Angular, é possível especificar na hora de criar o projeto, qual pré-processador de estilo você quer, como por exemplo o CSS, SCSS ou Less.

    Exemplo:
*/

'ng new MeuAppAngular --style=sass'
'ng new MeuAppAngular --style=less'
'ng new MeuAppAngular --style=stylus'

/* 
    Ou ainda modificar um pré-processador num projeto já existente.

    Exemplo:
*/

'ng set defaults.styleExt sass'
'ng set defaults.styleExt less'
'ng set defaults.styleExt styl'