package br.pucminas.diaw.aluguel.repository;

import br.pucminas.diaw.aluguel.model.ContratoCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {
}

