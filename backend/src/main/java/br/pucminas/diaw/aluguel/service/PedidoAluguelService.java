package br.pucminas.diaw.aluguel.service;

import br.pucminas.diaw.aluguel.dto.AvaliacaoFinanceiraDTO;
import br.pucminas.diaw.aluguel.dto.PedidoAluguelRequestDTO;
import br.pucminas.diaw.aluguel.model.*;
import br.pucminas.diaw.aluguel.repository.AgenteRepository;
import br.pucminas.diaw.aluguel.repository.AutomovelRepository;
import br.pucminas.diaw.aluguel.repository.ClienteRepository;
import br.pucminas.diaw.aluguel.repository.PedidoAluguelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class PedidoAluguelService {

    private final PedidoAluguelRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;
    private final AgenteRepository agenteRepository;

    public PedidoAluguelService(PedidoAluguelRepository pedidoRepository,
                                ClienteRepository clienteRepository,
                                AutomovelRepository automovelRepository,
                                AgenteRepository agenteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
        this.agenteRepository = agenteRepository;
    }

    public List<PedidoAluguel> listarPedidos(Long clienteId) {
        if (clienteId != null) {
            return pedidoRepository.findByClienteIdOrderByCriadoEmDesc(clienteId);
        }
        return pedidoRepository.findAllByOrderByCriadoEmDesc();
    }

    public PedidoAluguel buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido de aluguel não encontrado com ID: " + id));
    }

    @Transactional
    public PedidoAluguel introduzirPedido(PedidoAluguelRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
        Automovel automovel = automovelRepository.findById(dto.automovelId())
                .orElseThrow(() -> new IllegalArgumentException("Automóvel não encontrado."));

        if (dto.dataFim().isBefore(dto.dataInicio())) {
            throw new IllegalArgumentException("A data de término não pode ser anterior à data de início.");
        }

        long dias = Math.max(1, ChronoUnit.DAYS.between(dto.dataInicio(), dto.dataFim()));
        BigDecimal valorTotal = automovel.getValorDiaria().multiply(BigDecimal.valueOf(dias));

        PedidoAluguel pedido = new PedidoAluguel();
        pedido.setCodigoPedido("PED-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setDataInicio(dto.dataInicio());
        pedido.setDataFim(dto.dataFim());
        pedido.setTipoContrato(dto.tipoContrato());
        pedido.setValorTotal(valorTotal);
        pedido.setStatus(StatusPedido.AGUARDANDO_ANALISE);
        pedido.setObservacoesCliente(dto.observacoesCliente());
        pedido.setCriadoEm(LocalDateTime.now());
        pedido.setAtualizadoEm(LocalDateTime.now());

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public PedidoAluguel modificarPedido(Long id, PedidoAluguelRequestDTO dto) {
        PedidoAluguel pedido = buscarPorId(id);

        if (pedido.getStatus() == StatusPedido.CANCELADO || pedido.getStatus() == StatusPedido.CONTRATO_EXECUTADO) {
            throw new IllegalArgumentException("Não é possível modificar um pedido com contrato já executado ou cancelado.");
        }
        if (dto.dataFim().isBefore(dto.dataInicio())) {
            throw new IllegalArgumentException("A data de término não pode ser anterior à data de início.");
        }

        Automovel automovel = automovelRepository.findById(dto.automovelId())
                .orElseThrow(() -> new IllegalArgumentException("Automóvel não encontrado."));

        long dias = Math.max(1, ChronoUnit.DAYS.between(dto.dataInicio(), dto.dataFim()));
        BigDecimal valorTotal = automovel.getValorDiaria().multiply(BigDecimal.valueOf(dias));

        pedido.setAutomovel(automovel);
        pedido.setDataInicio(dto.dataInicio());
        pedido.setDataFim(dto.dataFim());
        pedido.setTipoContrato(dto.tipoContrato());
        pedido.setValorTotal(valorTotal);
        pedido.setObservacoesCliente(dto.observacoesCliente());
        pedido.setAtualizadoEm(LocalDateTime.now());

        // Se estava rejeitado ou aguardando, volta para análise após modificação
        if (pedido.getStatus() == StatusPedido.REJEITADO) {
            pedido.setStatus(StatusPedido.AGUARDANDO_ANALISE);
        }

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public PedidoAluguel avaliarPedidoFinanceiramente(Long id, AvaliacaoFinanceiraDTO dto) {
        PedidoAluguel pedido = buscarPorId(id);
        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new IllegalArgumentException("Não é possível avaliar um pedido cancelado.");
        }

        Agente agenteAvaliador = agenteRepository.findById(dto.agenteId())
                .orElseThrow(() -> new IllegalArgumentException("Agente avaliador não encontrado."));

        pedido.setAgenteAvaliador(agenteAvaliador);
        pedido.setParecerFinanceiro(dto.parecerFinanceiro());
        pedido.setAtualizadoEm(LocalDateTime.now());

        if (Boolean.TRUE.equals(dto.parecerPositivo())) {
            pedido.setStatus(StatusPedido.APROVADO_AGUARDANDO_CONTRATO);

            // Se foi solicitada concessão de contrato de crédito por um banco agente
            if (Boolean.TRUE.equals(dto.concederContratoCredito()) || pedido.getTipoContrato() == TipoContrato.CREDITO_BANCO) {
                Agente banco = agenteAvaliador;
                if (dto.bancoAgenteId() != null) {
                    banco = agenteRepository.findById(dto.bancoAgenteId()).orElse(agenteAvaliador);
                }
                BigDecimal taxa = dto.taxaJurosMensal() != null ? dto.taxaJurosMensal() : new BigDecimal("1.49");
                Integer parcelas = dto.quantidadeParcelas() != null && dto.quantidadeParcelas() > 0 ? dto.quantidadeParcelas() : 12;

                ContratoCredito contratoCredito = new ContratoCredito(
                        "CRED-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                        banco,
                        pedido.getValorTotal(),
                        taxa,
                        parcelas
                );
                pedido.setContratoCredito(contratoCredito);
            }
        } else {
            pedido.setStatus(StatusPedido.REJEITADO);
        }

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public PedidoAluguel executarContrato(Long id) {
        PedidoAluguel pedido = buscarPorId(id);
        if (pedido.getStatus() != StatusPedido.APROVADO_AGUARDANDO_CONTRATO) {
            throw new IllegalArgumentException("O contrato só pode ser executado após parecer financeiro positivo do agente.");
        }

        pedido.setStatus(StatusPedido.CONTRATO_EXECUTADO);
        pedido.setAtualizadoEm(LocalDateTime.now());

        // Atualiza a propriedade e disponibilidade do automóvel conforme o tipo de contrato
        Automovel automovel = pedido.getAutomovel();
        automovel.setDisponivel(false);
        if (pedido.getTipoContrato() == TipoContrato.PROPRIEDADE_CLIENTE) {
            automovel.setTipoProprietario(TipoProprietario.CLIENTE);
            automovel.setNomeProprietario(pedido.getCliente().getNome());
        } else if (pedido.getTipoContrato() == TipoContrato.CREDITO_BANCO && pedido.getContratoCredito() != null) {
            automovel.setTipoProprietario(TipoProprietario.BANCO);
            automovel.setNomeProprietario(pedido.getContratoCredito().getBancoAgente().getNome());
        } else {
            automovel.setTipoProprietario(TipoProprietario.EMPRESA);
        }
        automovelRepository.save(automovel);

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public PedidoAluguel cancelarPedido(Long id) {
        PedidoAluguel pedido = buscarPorId(id);
        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new IllegalArgumentException("Este pedido já está cancelado.");
        }

        // Caso o automóvel estivesse indisponível por conta deste pedido, libera novamente
        Automovel automovel = pedido.getAutomovel();
        automovel.setDisponivel(true);
        automovelRepository.save(automovel);

        pedido.setStatus(StatusPedido.CANCELADO);
        pedido.setAtualizadoEm(LocalDateTime.now());
        return pedidoRepository.save(pedido);
    }
}

