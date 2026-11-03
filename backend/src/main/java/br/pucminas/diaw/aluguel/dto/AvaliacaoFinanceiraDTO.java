package br.pucminas.diaw.aluguel.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record AvaliacaoFinanceiraDTO(
        @NotNull(message = "O ID do agente avaliador é obrigatório")
        Long agenteId,
        @NotNull(message = "Informe se o parecer financeiro é positivo ou negativo")
        Boolean parecerPositivo,
        String parecerFinanceiro,
        Boolean concederContratoCredito,
        Long bancoAgenteId,
        BigDecimal taxaJurosMensal,
        Integer quantidadeParcelas
) {
}

