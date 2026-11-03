package br.pucminas.diaw.aluguel.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ClienteRequestDTO(
        @NotBlank(message = "O usuário (username) é obrigatório")
        String username,
        String senha,
        @NotBlank(message = "O nome é obrigatório")
        String nome,
        @NotBlank(message = "O RG é obrigatório")
        String rg,
        @NotBlank(message = "O CPF é obrigatório")
        String cpf,
        @NotBlank(message = "O endereço é obrigatório")
        String endereco,
        @NotBlank(message = "A profissão é obrigatória")
        String profissao,
        @Valid
        @Size(max = 3, message = "São permitidos no máximo 3 rendimentos/entidades empregadoras por contratante")
        List<RendimentoDTO> rendimentos
) {
}

