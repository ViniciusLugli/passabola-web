# 🚨 ISSUE CRÍTICA: CORS 403 em Requisições PATCH

**Data:** 05/11/2025  
**Prioridade:** 🔴 CRÍTICA  
**Status:** ❌ Bloqueando Funcionalidades  

## 📊 Impacto

Funcionalidades **completamente quebradas** no frontend:
- ❌ Marcar notificações como lidas
- ❌ Marcar todas notificações como lidas  
- ❌ Aceitar convites de time (se usar PATCH)
- ❌ Qualquer outra feature que use método PATCH

## 🔍 Diagnóstico

### Teste Realizado:

```bash
curl -X OPTIONS http://localhost:8080/api/notifications/3/read \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: PATCH" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -v
```

### Resultado:

```
< HTTP/1.1 403 
< Vary: Origin
< Vary: Access-Control-Request-Method
< Vary: Access-Control-Request-Headers
```

**❌ Erro:** Requisição OPTIONS (CORS preflight) retorna 403

### Logs do Frontend:

```
XHROPTIONS http://localhost:8080/api/notifications/3/read
CORS Missing Allow Origin

Requisição cross-origin bloqueada: A diretiva Same Origin não permite a leitura 
do recurso remoto em http://localhost:8080/api/notifications/3/read 
(motivo: falta cabeçalho 'Access-Control-Allow-Origin' no CORS). 
Código de status: 403.

❌ [ERROR] PATCH /notifications/3/read
Erro ao marcar como lida: Object { message: "NetworkError when attempting to fetch resource." }
```

## 🔧 Causa Raiz

O backend NÃO está configurado corretamente para aceitar requisições PATCH via CORS:

1. ❌ Método `PATCH` provavelmente não está em `Access-Control-Allow-Methods`
2. ❌ Requisições `OPTIONS` (preflight) estão exigindo autenticação

## ✅ Solução (Backend)

### 1. Permitir OPTIONS sem Autenticação

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // ⚡ IMPORTANTE: Permitir OPTIONS sem autenticação
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### 2. Configurar CORS com PATCH

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Origens permitidas
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:3001"
        ));
        
        // ⚡ IMPORTANTE: Incluir PATCH e OPTIONS
        configuration.setAllowedMethods(Arrays.asList(
            "GET", 
            "POST", 
            "PUT", 
            "PATCH",    // ← Adicionar
            "DELETE", 
            "OPTIONS"   // ← Adicionar
        ));
        
        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Permitir credenciais (cookies, authorization header)
        configuration.setAllowCredentials(true);
        
        // Headers expostos ao frontend
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type"
        ));
        
        // Tempo de cache do preflight (opcional)
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}
```

### 3. Verificar Controller (Opcional)

Se estiver usando `@CrossOrigin` nos controllers, certifique-se de incluir PATCH:

```java
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(
    origins = "http://localhost:3000",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = "*",
    allowCredentials = "true"
)
public class NotificationController {
    
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        // ...
    }
}
```

## ✅ Validação

Após implementar a correção, testar:

```bash
# 1. Testar OPTIONS (deve retornar 200)
curl -X OPTIONS http://localhost:8080/api/notifications/3/read \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: PATCH" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -v

# Deve retornar:
# < HTTP/1.1 200 
# < Access-Control-Allow-Origin: http://localhost:3000
# < Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
# < Access-Control-Allow-Headers: authorization,content-type

# 2. Testar PATCH real (com token)
curl -X PATCH http://localhost:8080/api/notifications/3/read \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -v

# Deve retornar:
# < HTTP/1.1 200
# < Access-Control-Allow-Origin: http://localhost:3000
```

## 📚 Referências

- [Spring CORS Documentation](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)
- [MDN CORS Preflight](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests)
- [Spring Security CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)

## 🎯 Checklist de Implementação

- [ ] Adicionar `PATCH` em `allowedMethods` na configuração CORS
- [ ] Adicionar `OPTIONS` em `allowedMethods` na configuração CORS
- [ ] Permitir requisições OPTIONS sem autenticação no SecurityConfig
- [ ] Testar com curl (OPTIONS deve retornar 200)
- [ ] Testar no frontend (marcar notificação como lida deve funcionar)
- [ ] Verificar outros endpoints que usam PATCH
- [ ] Deploy e validação em produção

## 👥 Responsável

**Backend Team**

## 🔗 Endpoints Afetados

- `PATCH /api/notifications/{id}/read`
- `PATCH /api/notifications/read-all`
- Qualquer outro endpoint que use método PATCH

---

**Nota:** Este é um problema de configuração do backend. O frontend está fazendo as requisições corretamente conforme a documentação da API.
