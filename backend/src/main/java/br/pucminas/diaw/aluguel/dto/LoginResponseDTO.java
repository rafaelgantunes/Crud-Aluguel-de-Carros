package br.pucminas.diaw.aluguel.dto;

import br.pucminas.diaw.aluguel.model.RoleUsuario;

public record LoginResponseDTO(
        Long id,
        String username,
        String nome,
        RoleUsuario role,
        String tokenSimulado
) {
}

