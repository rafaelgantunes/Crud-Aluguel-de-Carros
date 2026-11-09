package br.pucminas.diaw.aluguel.config;

import br.pucminas.diaw.aluguel.model.*;
import br.pucminas.diaw.aluguel.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final AutomovelRepository automovelRepository;
    private final PedidoAluguelRepository pedidoRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           ClienteRepository clienteRepository,
                           AgenteRepository agenteRepository,
                           AutomovelRepository automovelRepository,
                           PedidoAluguelRepository pedidoRepository,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
        this.automovelRepository = automovelRepository;
        this.pedidoRepository = pedidoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }

        String senhaHashPadrao = passwordEncoder.encode("123456");

        // 1. Criar Clientes com suas entidades empregadoras e rendimentos (máx. 3)
        Cliente cliente1 = new Cliente(
                "cliente",
                senhaHashPadrao,
                "Gabriel Henrique Silva",
                "MG-18.452.901",
                "123.456.789-00",
                "Av. Dom José Gaspar, 500 - Coração Eucarístico, Belo Horizonte - MG",
                "Engenheiro de Software"
        );
        cliente1.adicionarRendimento(new RendimentoCliente("Tech Solutions Brasil S.A.", new BigDecimal("8500.00")));
        cliente1.adicionarRendimento(new RendimentoCliente("PUC Minas (Monitoria/Pesquisa)", new BigDecimal("1800.00")));
        cliente1 = clienteRepository.save(cliente1);

        Cliente cliente2 = new Cliente(
                "mariana",
                senhaHashPadrao,
                "Mariana Costa Oliveira",
                "MG-21.998.112",
                "987.654.321-11",
                "Rua da Bahia, 1450 - Lourdes, Belo Horizonte - MG",
                "Arquiteta de Sistemas"
        );
        cliente2.adicionarRendimento(new RendimentoCliente("Inova Cloud Consultoria", new BigDecimal("9200.00")));
        cliente2.adicionarRendimento(new RendimentoCliente("Startup FinDev", new BigDecimal("3100.00")));
        cliente2.adicionarRendimento(new RendimentoCliente("Docência Universitária", new BigDecimal("2400.00")));
        cliente2 = clienteRepository.save(cliente2);

        // 2. Criar Agentes (Empresa Locadora e Banco Agente)
        Agente agenteEmpresa = new Agente(
                "empresa",
                senhaHashPadrao,
                "AutoRent Minas Locadora",
                "12.345.678/0001-90",
                "AutoRent Minas Gestão de Frotas S.A.",
                "EMPRESA"
        );
        agenteEmpresa = agenteRepository.save(agenteEmpresa);

        Agente agenteBanco = new Agente(
                "banco",
                senhaHashPadrao,
                "Banco CrediAuto S.A.",
                "45.987.123/0001-55",
                "Banco CrediAuto Financiamentos e Leasing S.A.",
                "BANCO"
        );
        agenteBanco = agenteRepository.save(agenteBanco);

        // 3. Criar Frota de Automóveis (Matrícula, Ano, Marca, Modelo, Placa e Propriedade)
        Automovel auto1 = automovelRepository.save(new Automovel(
                "MAT-2025-001", 2025, "Toyota", "Corolla Altis Hybrid", "RVA4B21",
                new BigDecimal("240.00"), TipoProprietario.EMPRESA, agenteEmpresa.getNome()
        ));

        Automovel auto2 = automovelRepository.save(new Automovel(
                "MAT-2025-002", 2025, "Jeep", "Compass Longitude T270", "QXM9E84",
                new BigDecimal("290.00"), TipoProprietario.BANCO, agenteBanco.getNome()
        ));

        Automovel auto3 = automovelRepository.save(new Automovel(
                "MAT-2024-003", 2024, "Volkswagen", "Nivus Highline 200 TSI", "PZK7C19",
                new BigDecimal("195.00"), TipoProprietario.EMPRESA, agenteEmpresa.getNome()
        ));

        Automovel auto4 = automovelRepository.save(new Automovel(
                "MAT-2026-004", 2026, "BYD", "Song Plus DM-i", "SBA2F90",
                new BigDecimal("320.00"), TipoProprietario.BANCO, agenteBanco.getNome()
        ));

        // 4. Criar Pedidos de Aluguel Iniciais para Demonstração do Protótipo
        PedidoAluguel p1 = new PedidoAluguel();
        p1.setCodigoPedido("PED-DEMO001");
        p1.setCliente(cliente1);
        p1.setAutomovel(auto1);
        p1.setDataInicio(LocalDate.now().plusDays(2));
        p1.setDataFim(LocalDate.now().plusDays(9));
        p1.setTipoContrato(TipoContrato.PADRAO_EMPRESA);
        p1.setValorTotal(new BigDecimal("1680.00"));
        p1.setStatus(StatusPedido.AGUARDANDO_ANALISE);
        p1.setObservacoesCliente("Retirada no período da manhã na unidade Coração Eucarístico.");
        pedidoRepository.save(p1);

        PedidoAluguel p2 = new PedidoAluguel();
        p2.setCodigoPedido("PED-DEMO002");
        p2.setCliente(cliente1);
        p2.setAutomovel(auto2);
        p2.setAgenteAvaliador(agenteBanco);
        p2.setDataInicio(LocalDate.now().plusDays(10));
        p2.setDataFim(LocalDate.now().plusDays(25));
        p2.setTipoContrato(TipoContrato.CREDITO_BANCO);
        p2.setValorTotal(new BigDecimal("4350.00"));
        p2.setStatus(StatusPedido.APROVADO_AGUARDANDO_CONTRATO);
        p2.setParecerFinanceiro("Parecer Positivo: Renda mensal comprovada de R$ 10.300,00 compatível com o contrato. Crédito aprovado pelo Banco CrediAuto.");
        p2.setObservacoesCliente("Solicito associação com contrato de crédito em 12 parcelas.");
        ContratoCredito cred = new ContratoCredito(
                "CRED-2026-8841",
                agenteBanco,
                new BigDecimal("4350.00"),
                new BigDecimal("1.39"),
                12
        );
        p2.setContratoCredito(cred);
        pedidoRepository.save(p2);
    }
}

