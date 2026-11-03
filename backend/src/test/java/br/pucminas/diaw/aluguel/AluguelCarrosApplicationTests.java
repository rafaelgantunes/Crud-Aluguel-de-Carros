package br.pucminas.diaw.aluguel;

import br.pucminas.diaw.aluguel.dto.ClienteRequestDTO;
import br.pucminas.diaw.aluguel.dto.LoginRequestDTO;
import br.pucminas.diaw.aluguel.dto.LoginResponseDTO;
import br.pucminas.diaw.aluguel.dto.RendimentoDTO;
import br.pucminas.diaw.aluguel.model.Cliente;
import br.pucminas.diaw.aluguel.model.RoleUsuario;
import br.pucminas.diaw.aluguel.service.AuthService;
import br.pucminas.diaw.aluguel.service.ClienteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AluguelCarrosApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private ClienteService clienteService;

    @Test
    void deveAutenticarUsuarioPreCadastrado() {
        LoginResponseDTO resp = authService.autenticar(new LoginRequestDTO("cliente", "123456"));
        assertNotNull(resp);
        assertEquals(RoleUsuario.CLIENTE, resp.role());
    }

    @Test
    void deveCriarClienteComAteTresRendimentos() {
        ClienteRequestDTO dto = new ClienteRequestDTO(
                "novocliente",
                "123456",
                "Lucas Teste",
                "MG-10.200.300",
                "111.222.333-44",
                "Rua Teste, 100",
                "Analista",
                List.of(
                        new RendimentoDTO("Empresa A", new BigDecimal("3000.00")),
                        new RendimentoDTO("Empresa B", new BigDecimal("2500.00")),
                        new RendimentoDTO("Empresa C", new BigDecimal("1500.00"))
                )
        );
        Cliente salvo = clienteService.criarCliente(dto);
        assertNotNull(salvo.getId());
        assertEquals(3, salvo.getRendimentos().size());
        assertEquals(new BigDecimal("7000.00"), salvo.calcularRendaTotal());
    }
}

