
## User Repository:

```java
@Repository  
public interface UserRepository extends JpaRepository<User, Long> {  
  
	@Query("SELECT u FROM User u WHERE u.userName =:userName")  
	User findByUsername(@Param("userName") String userName);  
}
```

## User Service:

```java
@Service  
public class UserServices implements UserDetailsService {  
  
	private Logger logger = Logger.getLogger(UserServices.class.getName());  
  
	@Autowired  
	UserRepository repository;  
  
	public UserServices(UserRepository repository){  
	this.repository = repository;  
	}
	
	@Override  
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{  
		logger.info("Finding one user by name " + username + "!");  
		var user = repository.findByUsername(username);  
		if (user != null) {  
		return user;  
		} else {  
		throw new UsernameNotFoundException("Username " + username + " not found!");  
		}  
	}  
}
```