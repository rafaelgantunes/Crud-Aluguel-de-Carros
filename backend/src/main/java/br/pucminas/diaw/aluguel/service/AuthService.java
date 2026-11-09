package br.pucminas.diaw.aluguel.service;

import br.pucminas.diaw.aluguel.config.SessionTokenFilter;
import br.pucminas.diaw.aluguel.dto.AgenteRequestDTO;
import br.pucminas.diaw.aluguel.dto.LoginRequestDTO;
import br.pucminas.diaw.aluguel.dto.LoginResponseDTO;
import br.pucminas.diaw.aluguel.model.Agente;
import br.pucminas.diaw.aluguel.model.Usuario;
import br.pucminas.diaw.aluguel.repository.AgenteRepository;
import br.pucminas.diaw.aluguel.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AgenteRepository agenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionTokenFilter sessionTokenFilter;

    public AuthService(UsuarioRepository usuarioRepository,
                       AgenteRepository agenteRepository,
                       PasswordEncoder passwordEncoder,
                       SessionTokenFilter sessionTokenFilter) {
        this.usuarioRepository = usuarioRepository;
        this.agenteRepository = agenteRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessionTokenFilter = sessionTokenFilter;
    }

    @Transactional
    public LoginResponseDTO autenticar(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByUsername(dto.username().trim())
                .orElseThrow(() -> new SecurityException("Usuário ou senha inválidos. O acesso ao sistema requer cadastro prévio."));

        boolean senhaValida = validarSenhaComBCrypt(dto.senha(), usuario);
        if (!senhaValida) {
            throw new SecurityException("Usuário ou senha inválidos.");
        }

        String token = "SESSION-" + usuario.getRole().name() + "-" + UUID.randomUUID();
        sessionTokenFilter.registrarToken(token, usuario.getRole().name());

        return new LoginResponseDTO(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getNome(),
                usuario.getRole(),
                token
        );
    }

    private boolean validarSenhaComBCrypt(String senhaInformada, Usuario usuario) {
        String senhaArmazenada = usuario.getSenha();
        if (senhaArmazenada != null && senhaArmazenada.startsWith("$2")) {
            return passwordEncoder.matches(senhaInformada, senhaArmazenada);
        }
        if (senhaArmazenada != null && senhaArmazenada.equals(senhaInformada)) {
            usuario.setSenha(passwordEncoder.encode(senhaInformada));
            usuarioRepository.save(usuario);
            return true;
        }
        return false;
    }

    @Transactional
    public Agente registrarAgente(AgenteRequestDTO dto) {
        if (usuarioRepository.existsByUsername(dto.username().trim())) {
            throw new IllegalArgumentException("Já existe um usuário com este username.");
        }
        if (agenteRepository.existsByCnpj(dto.cnpj().trim())) {
            throw new IllegalArgumentException("Já existe um agente cadastrado com este CNPJ.");
        }

        Agente agente = new Agente(
                dto.username().trim(),
                passwordEncoder.encode(dto.senha()),
                dto.nome().trim(),
                dto.cnpj().trim(),
                dto.razaoSocial().trim(),
                dto.tipoAgente().trim()
        );
        return agenteRepository.save(agente);
    }

    public List<Agente> listarBancosAgentes() {
        return agenteRepository.findByTipoAgente("BANCO");
    }

    public List<Agente> listarTodosAgentes() {
        return agenteRepository.findAll();
    }
}
