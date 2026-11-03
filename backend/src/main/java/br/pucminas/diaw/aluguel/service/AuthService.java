package br.pucminas.diaw.aluguel.service;

import br.pucminas.diaw.aluguel.dto.AgenteRequestDTO;
import br.pucminas.diaw.aluguel.dto.LoginRequestDTO;
import br.pucminas.diaw.aluguel.dto.LoginResponseDTO;
import br.pucminas.diaw.aluguel.model.Agente;
import br.pucminas.diaw.aluguel.model.Usuario;
import br.pucminas.diaw.aluguel.repository.AgenteRepository;
import br.pucminas.diaw.aluguel.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AgenteRepository agenteRepository;

    public AuthService(UsuarioRepository usuarioRepository, AgenteRepository agenteRepository) {
        this.usuarioRepository = usuarioRepository;
        this.agenteRepository = agenteRepository;
    }

    public LoginResponseDTO autenticar(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByUsername(dto.username().trim())
                .orElseThrow(() -> new SecurityException("Usuário ou senha inválidos. O acesso ao sistema requer cadastro prévio."));

        if (!usuario.getSenha().equals(dto.senha())) {
            throw new SecurityException("Usuário ou senha inválidos.");
        }

        String token = "SESSION-" + usuario.getRole().name() + "-" + UUID.randomUUID();
        return new LoginResponseDTO(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getNome(),
                usuario.getRole(),
                token
        );
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
                dto.senha(),
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

