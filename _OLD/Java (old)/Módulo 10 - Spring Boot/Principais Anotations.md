## Módulo 2 - Spring Boot: Principais Anotações

Spring Boot é uma poderosa ferramenta para o desenvolvimento de aplicações Spring com configuração mínima. Neste módulo, focaremos nas anotações cruciais que facilitam esse processo.

### **Configuração e Inicialização**
1. `@SpringBootApplication` - Combinação de `@Configuration`, `@EnableAutoConfiguration` e `@ComponentScan`.
2. `@EnableAutoConfiguration` - Habilita a configuração automática do Spring.
3. `@Configuration` - Indica que a classe tem métodos de configuração.
4. `@ComponentScan` - Configura o escaneamento automático de componentes.

### **Definição de Componentes**
1. `@Component` - Indica uma classe como componente.
2. `@Repository` - Especifica a camada de persistência.
3. `@Service` - Define a classe como um serviço.
4. `@Controller` - Marca a classe como controladora.
5. `@RestController` - Combinação de `@Controller` e `@ResponseBody`.
6. `@Bean` - Marca um método para criar um bean.
7. `@Entity` - Define uma classe como entidade JPA.

### **Injeção de Dependências**
1. `@Autowired` - Injeção automática de dependência.
2. `@Qualifier` - Especifica qual bean deve ser injetado.
3. `@Primary` - Indica que um bean deve ter preferência na injeção.
4. `@Inject` - Alternativa ao `@Autowired` (JSR-330).

### **Mapeamento Web**
1. `@RequestMapping` - Mapeia requisições HTTP.
2. `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` - Específicos para cada método HTTP.
3. `@PathVariable` - Captura valores de URL.
4. `@RequestParam` - Vincula parâmetros de consulta HTTP.
5. `@RequestBody` - Vincula o corpo da solicitação.
6. `@ResponseBody` - Indica que o retorno do método deve ser o corpo da resposta.

### **Aspectos e Intercepções**
1. `@Aspect` - Define um aspecto.
2. `@Before`, `@After`, `@Around`, `@AfterReturning`, `@AfterThrowing` - Diferentes tipos de advices em AOP.

### **Transações e Persistência de Dados**
1. `@Transactional` - Gerencia transações.
2. `@EnableJpaRepositories` - Habilita repositórios JPA.
3. `@Query` - Define consultas personalizadas em repositórios.

### **Testes**
1. `@SpringBootTest` - Configuração de teste para aplicações Spring Boot.
2. `@DataJpaTest` - Focado em testes JPA.
3. `@WebMvcTest` - Para testes de camada web.
4. `@MockBean` - Cria beans mock para testes.
5. `@Test` - Indica um método de teste.

### **Validação**
1. `@Valid` - Ativa a validação de um bean.
2. `@NotNull`, `@NotEmpty`, `@Size`, `@Min`, `@Max` - Anotações de validação de campo.

### **Segurança**
1. `@EnableWebSecurity` - Habilita a segurança da

web no Spring.
2. `@PreAuthorize`, `@PostAuthorize` - Define restrições de acesso baseadas em expressões.

### **Outras Anotações Importantes**
1. `@Profile` - Define configurações específicas para diferentes ambientes.
2. `@PropertySource` - Especifica arquivos de propriedades.
3. `@Value` - Injeta valores de propriedades.
4. `@Scheduled` - Define métodos a serem executados em um cronograma.
5. `@Order` - Define a ordem de execução para componentes.

---

### **Tópicos Adicionais Relevantes**

Além das anotações, é importante abordar os seguintes tópicos no contexto do Spring Boot:

1. **Criação de APIs RESTful**: Práticas para estruturar endpoints, tratamento de erros e documentação (Swagger, por exemplo).
2. **Spring Boot Actuator**: Ferramentas para monitoramento e gerenciamento de aplicações Spring Boot.
3. **Testes Unitários e de Integração**: Como escrever e executar testes eficientes em Spring Boot.
4. **Spring Data JPA**: Uso do Spring Data para simplificar a camada de persistência de dados.
5. **Segurança**: Implementação de segurança em APIs RESTful, incluindo autenticação e autorização (Spring Security).