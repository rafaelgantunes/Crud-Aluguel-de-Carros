package br.pucminas.diaw.aluguel.service;

import br.pucminas.diaw.aluguel.dto.ClienteRequestDTO;
import br.pucminas.diaw.aluguel.dto.RendimentoDTO;
import br.pucminas.diaw.aluguel.model.Cliente;
import br.pucminas.diaw.aluguel.model.RendimentoCliente;
import br.pucminas.diaw.aluguel.repository.ClienteRepository;
import br.pucminas.diaw.aluguel.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(ClienteRepository clienteRepository,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com ID: " + id));
    }

    @Transactional
    public Cliente criarCliente(ClienteRequestDTO dto) {
        if (usuarioRepository.existsByUsername(dto.username().trim())) {
            throw new IllegalArgumentException("O nome de usuário '" + dto.username() + "' já está em uso.");
        }
        if (clienteRepository.existsByCpf(dto.cpf().trim())) {
            throw new IllegalArgumentException("Já existe um cliente cadastrado com o CPF " + dto.cpf());
        }
        if (dto.senha() == null || dto.senha().isBlank()) {
            throw new IllegalArgumentException("A senha é obrigatória para o cadastro de novo cliente.");
        }

        Cliente cliente = new Cliente(
                dto.username().trim(),
                passwordEncoder.encode(dto.senha()),
                dto.nome().trim(),
                dto.rg().trim(),
                dto.cpf().trim(),
                dto.endereco().trim(),
                dto.profissao().trim()
        );

        aplicarRendimentos(cliente, dto.rendimentos());
        return clienteRepository.save(cliente);
    }

    @Transactional
    public Cliente atualizarCliente(Long id, ClienteRequestDTO dto) {
        Cliente cliente = buscarPorId(id);

        if (!cliente.getUsername().equalsIgnoreCase(dto.username().trim())
                && usuarioRepository.existsByUsername(dto.username().trim())) {
            throw new IllegalArgumentException("O nome de usuário '" + dto.username() + "' já está em uso.");
        }
        if (!cliente.getCpf().equals(dto.cpf().trim())
                && clienteRepository.existsByCpf(dto.cpf().trim())) {
            throw new IllegalArgumentException("Já existe outro cliente cadastrado com o CPF " + dto.cpf());
        }

        cliente.setUsername(dto.username().trim());
        if (dto.senha() != null && !dto.senha().isBlank()) {
            cliente.setSenha(passwordEncoder.encode(dto.senha()));
        }
        cliente.setNome(dto.nome().trim());
        cliente.setRg(dto.rg().trim());
        cliente.setCpf(dto.cpf().trim());
        cliente.setEndereco(dto.endereco().trim());
        cliente.setProfissao(dto.profissao().trim());

        cliente.limparRendimentos();
        aplicarRendimentos(cliente, dto.rendimentos());

        return clienteRepository.save(cliente);
    }

    @Transactional
    public void excluirCliente(Long id) {
        Cliente cliente = buscarPorId(id);
        clienteRepository.delete(cliente);
    }

    private void aplicarRendimentos(Cliente cliente, List<RendimentoDTO> rendimentosDto) {
        if (rendimentosDto == null) {
            return;
        }
        if (rendimentosDto.size() > 3) {
            throw new IllegalArgumentException("Sobre os contratantes, armazenam-se no máximo 3 entidades empregadoras e respectivos rendimentos.");
        }
        for (RendimentoDTO rDto : rendimentosDto) {
            if (rDto.entidadeEmpregadora() != null && !rDto.entidadeEmpregadora().isBlank() && rDto.valorRendimento() != null) {
                cliente.adicionarRendimento(new RendimentoCliente(
                        rDto.entidadeEmpregadora().trim(),
                        rDto.valorRendimento()
                ));
            }
        }
    }
}

