package br.pucminas.diaw.aluguel.repository;

import br.pucminas.diaw.aluguel.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutomovelRepository extends JpaRepository<Automovel, Long> {
    List<Automovel> findByDisponivelTrue();
    boolean existsByPlaca(String placa);
    boolean existsByMatricula(String matricula);
}

