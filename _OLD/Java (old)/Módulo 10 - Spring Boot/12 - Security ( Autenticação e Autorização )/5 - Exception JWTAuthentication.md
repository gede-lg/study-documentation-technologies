
## Exception Customizada:

```java
@ResponseStatus(HttpStatus.FORBIDDEN)  
public class InvalidJwtAuthenticationException extends AuthenticationException{  
  
	private static final long serialVersionUID = 1L;  
	  
	public InvalidJwtAuthenticationException(String ex) {  
	super(ex);  
	}  
}
```

## Resposta Customizada (colocar no ControllerAdvice):

```java
@ExceptionHandler(InvalidJwtAuthenticationException.class)  
public final ResponseEntity<ExceptionResponse> handleInvalidJwtAuthenticationExceptions( Exception ex, WebRequest request ){  
  
	ExceptionResponse exceptionResponse = new ExceptionResponse(  
	new Date(),  
	ex.getMessage(),  
	request.getDescription(false));  
	  
	return new ResponseEntity<>(exceptionResponse, HttpStatus.FORBIDDEN);  
}
```
