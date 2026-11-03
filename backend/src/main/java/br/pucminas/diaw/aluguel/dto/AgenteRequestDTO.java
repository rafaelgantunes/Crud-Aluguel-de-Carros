package br.pucminas.diaw.aluguel.dto;

import jakarta.validation.constraints.NotBlank;

public record AgenteRequestDTO(
        @NotBlank(message = "O usuário (username) é obrigatório")
        String username,
        @NotBlank(message = "A senha é obrigatória")
        String senha,
        @NotBlank(message = "O nome fantasia é obrigatório")
        String nome,
        @NotBlank(message = "O CNPJ é obrigatório")
        String cnpj,
        @NotBlank(message = "A razão social é obrigatória")
        String razaoSocial,
        @NotBlank(message = "O tipo de agente (EMPRESA ou BANCO) é obrigatório")
        String tipoAgente
) {
}

