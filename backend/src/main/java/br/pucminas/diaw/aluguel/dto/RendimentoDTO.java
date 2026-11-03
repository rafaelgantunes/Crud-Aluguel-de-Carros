package br.pucminas.diaw.aluguel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record RendimentoDTO(
        @NotBlank(message = "A entidade empregadora é obrigatória")
        String entidadeEmpregadora,
        @NotNull(message = "O valor do rendimento é obrigatório")
        @PositiveOrZero(message = "O rendimento não pode ser negativo")
        BigDecimal valorRendimento
) {
}

