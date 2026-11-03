package br.pucminas.diaw.aluguel.service;

import br.pucminas.diaw.aluguel.dto.AutomovelRequestDTO;
import br.pucminas.diaw.aluguel.model.Automovel;
import br.pucminas.diaw.aluguel.model.TipoProprietario;
import br.pucminas.diaw.aluguel.repository.AutomovelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AutomovelService {

    private final AutomovelRepository automovelRepository;

    public AutomovelService(AutomovelRepository automovelRepository) {
        this.automovelRepository = automovelRepository;
    }

    public List<Automovel> listarTodos() {
        return automovelRepository.findAll();
    }

    public Automovel buscarPorId(Long id) {
        return automovelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Automóvel não encontrado com ID: " + id));
    }

    @Transactional
    public Automovel cadastrarAutomovel(AutomovelRequestDTO dto) {
        if (automovelRepository.existsByMatricula(dto.matricula().trim())) {
            throw new IllegalArgumentException("Já existe um automóvel com a matrícula " + dto.matricula());
        }
        if (automovelRepository.existsByPlaca(dto.placa().trim().toUpperCase())) {
            throw new IllegalArgumentException("Já existe um automóvel com a placa " + dto.placa());
        }

        Automovel automovel = new Automovel(
                dto.matricula().trim().toUpperCase(),
                dto.ano(),
                dto.marca().trim(),
                dto.modelo().trim(),
                dto.placa().trim().toUpperCase(),
                dto.valorDiaria(),
                dto.tipoProprietario() != null ? dto.tipoProprietario() : TipoProprietario.EMPRESA,
                dto.nomeProprietario() != null && !dto.nomeProprietario().isBlank() ? dto.nomeProprietario().trim() : "Frota Localiza PUC"
        );
        if (dto.disponivel() != null) {
            automovel.setDisponivel(dto.disponivel());
        }
        return automovelRepository.save(automovel);
    }

    @Transactional
    public Automovel atualizarAutomovel(Long id, AutomovelRequestDTO dto) {
        Automovel automovel = buscarPorId(id);
        automovel.setMatricula(dto.matricula().trim().toUpperCase());
        automovel.setAno(dto.ano());
        automovel.setMarca(dto.marca().trim());
        automovel.setModelo(dto.modelo().trim());
        automovel.setPlaca(dto.placa().trim().toUpperCase());
        automovel.setValorDiaria(dto.valorDiaria());
        if (dto.disponivel() != null) {
            automovel.setDisponivel(dto.disponivel());
        }
        if (dto.tipoProprietario() != null) {
            automovel.setTipoProprietario(dto.tipoProprietario());
        }
        if (dto.nomeProprietario() != null) {
            automovel.setNomeProprietario(dto.nomeProprietario().trim());
        }
        return automovelRepository.save(automovel);
    }

    @Transactional
    public void excluirAutomovel(Long id) {
        Automovel automovel = buscarPorId(id);
        automovelRepository.delete(automovel);
    }
}

