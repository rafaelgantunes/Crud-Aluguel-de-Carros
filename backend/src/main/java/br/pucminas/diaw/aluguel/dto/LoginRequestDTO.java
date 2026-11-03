package br.pucminas.diaw.aluguel.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @NotBlank(message = "O usuário (username) é obrigatório")
        String username,
        @NotBlank(message = "A senha é obrigatória")
        String senha
) {
}

