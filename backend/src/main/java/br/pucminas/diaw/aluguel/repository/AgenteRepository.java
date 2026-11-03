package br.pucminas.diaw.aluguel.repository;

import br.pucminas.diaw.aluguel.model.Agente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgenteRepository extends JpaRepository<Agente, Long> {
    List<Agente> findByTipoAgente(String tipoAgente);
    boolean existsByCnpj(String cnpj);
}

