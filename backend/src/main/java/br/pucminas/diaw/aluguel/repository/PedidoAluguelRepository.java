package br.pucminas.diaw.aluguel.repository;

import br.pucminas.diaw.aluguel.model.PedidoAluguel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {
    List<PedidoAluguel> findByClienteIdOrderByCriadoEmDesc(Long clienteId);
    List<PedidoAluguel> findAllByOrderByCriadoEmDesc();
}

