package br.pucminas.diaw.aluguel.dto;

import br.pucminas.diaw.aluguel.model.TipoContrato;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PedidoAluguelRequestDTO(
        @NotNull(message = "O cliente é obrigatório")
        Long clienteId,
        @NotNull(message = "O automóvel é obrigatório")
        Long automovelId,
        @NotNull(message = "A data de início é obrigatória")
        LocalDate dataInicio,
        @NotNull(message = "A data de término é obrigatória")
        LocalDate dataFim,
        @NotNull(message = "O tipo de contrato é obrigatório")
        TipoContrato tipoContrato,
        String observacoesCliente
) {
}

