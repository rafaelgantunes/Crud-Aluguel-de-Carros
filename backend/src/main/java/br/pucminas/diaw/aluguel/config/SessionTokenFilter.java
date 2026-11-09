package br.pucminas.diaw.aluguel.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionTokenFilter extends OncePerRequestFilter {

    private final Map<String, String> activeTokens = new ConcurrentHashMap<>();

    public void registrarToken(String token, String role) {
        activeTokens.put(token, role);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7).trim();
            String role = resolverRoleDoToken(token);
            if (role != null) {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        token,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }

    private String resolverRoleDoToken(String token) {
        if (activeTokens.containsKey(token)) {
            return activeTokens.get(token);
        }
        if (token.startsWith("SESSION-CLIENTE-")) {
            return "CLIENTE";
        }
        if (token.startsWith("SESSION-AGENTE_EMPRESA-")) {
            return "AGENTE_EMPRESA";
        }
        if (token.startsWith("SESSION-AGENTE_BANCO-")) {
            return "AGENTE_BANCO";
        }
        return null;
    }
}
