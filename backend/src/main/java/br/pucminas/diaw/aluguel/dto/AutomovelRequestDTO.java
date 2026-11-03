package br.pucminas.diaw.aluguel.dto;

import br.pucminas.diaw.aluguel.model.TipoProprietario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record AutomovelRequestDTO(
        @NotBlank(message = "A matrícula é obrigatória")
        String matricula,
        @NotNull(message = "O ano é obrigatório")
        Integer ano,
        @NotBlank(message = "A marca é obrigatória")
        String marca,
        @NotBlank(message = "O modelo é obrigatório")
        String modelo,
        @NotBlank(message = "A placa é obrigatória")
        String placa,
        @NotNull(message = "O valor da diária é obrigatório")
        @Positive(message = "O valor da diária deve ser positivo")
        BigDecimal valorDiaria,
        Boolean disponivel,
        TipoProprietario tipoProprietario,
        String nomeProprietario
) {
}

