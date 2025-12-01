
### **Retornando somente o content de Page (Controller):** 

```java
@GetMapping()  
@Operation(security = { @SecurityRequirement(name = "bearer-key") })  
//Recebendo query params
public ResponseEntity<List<M>> list(  
	@RequestParam(name = "page", defaultValue = "0") Integer page,  
	@RequestParam(name = "limit", defaultValue = "12") Integer limit,  
	@RequestParam(name = "direction", defaultValue = "asc") String direction 
){  

	//Definindo o tipo de ordenação e chamando o metodo de ordenação pelas propriedades definidas  
	var sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;  
	var pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "nome"));
	//Definindo um modelo de paginação que deverá ser retornado pelo Spring Data
    Pageable pageable = PageRequest.of(page, limit);  
  
    return new ResponseEntity<List<M>>((List<M>) this.service.findAll(pageable).getContent(), HttpStatus.OK);  
}
```

### **Retornando o objeto Page (Controller):** 

```java
@GetMapping()  
@Operation(security = { @SecurityRequirement(name = "bearer-key") })  
//Recebendo query params
public ResponseEntity<Page<List<M>>> list(  
        @RequestParam(name = "page", defaultValue = "0") Integer page,  
        @RequestParam(name = "limit", defaultValue = "12") Integer limit  
){  

	//Definindo um modelo de paginação que deverá ser retornado pelo Spring Data
    Pageable pageable = PageRequest.of(page, limit);  
  
    return new ResponseEntity<Page<List<M>>>(this.service.findAll(pageable), HttpStatus.OK);  
}
```

### **Service:**

```java
public Page<List<M>> findAll(Pageable pageable){  

	//retorna uma pagina de itens
    Page entityPage = this.repository.findAll(pageable);  

	//Mapeia (para cada item, transforma ele em DTO) para uma nova pagina e retorna
    var modelPage = entityPage.map(p -> this.mapper.toModel((E)p));  
    return modelPage;  
}
```